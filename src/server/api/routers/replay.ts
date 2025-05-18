import {
  createTRPCRouter,
  protectedCollectorProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { replay } from "@/server/db/schema";
import { SlippiGame } from "@slippi/slippi-js";
import { TRPCError } from "@trpc/server";
import { BlobAccessError, put } from "@vercel/blob";
import { and, arrayContains, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

const replayFileSizeLimit = 20 * 1024 * 1024; // 20MB

export const replayRouter = createTRPCRouter({
  start: protectedCollectorProcedure
    .input(
      z.object({
        startedAt: z.coerce.date(),
        stageId: z.number(),
        characterIds: z.array(z.number()),
        wiiMacAddress: z
          .string()
          .regex(/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/),
        key: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [replayEntry] = await ctx.db
        .insert(replay)
        .values({
          key: input.key,
          startedAt: input.startedAt,
          stageId: input.stageId,
          characterIds: input.characterIds,
          collectorUID: ctx.collector.uid,
        })
        .returning();

      if (!replayEntry) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create replay entry",
        });
      }

      return {
        ...replayEntry,
        startedAt: replayEntry.startedAt.getTime(),
        updatedAt: replayEntry.updatedAt?.getTime(),
      };
    }),
  finish: protectedCollectorProcedure
    .input(
      zfd.formData({
        key: zfd.text(),
        file: zfd.file(),
      }),
    )
    .output(
      z.object({
        frameCount: z.number(),
        id: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [replayEntry] = await ctx.db
        .select()
        .from(replay)
        .where(eq(replay.key, input.key));

      if (!replayEntry) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Replay ID not found",
        });
      }

      const buffer = await input.file.arrayBuffer();
      const game = new SlippiGame(buffer);

      const frameCount = game.getLatestFrame()?.frame;

      if (!frameCount) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Replay file is invalid",
        });
      }

      if (input.file.size > replayFileSizeLimit) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Replay file is too large",
        });
      }

      const blobName = `${replayEntry.collectorUID}-${replayEntry.stageId}-${replayEntry.startedAt.toISOString()}.slp`;

      try {
        const putResult = await put(blobName, input.file, {
          access: "public",
          addRandomSuffix: true,
        });

        await ctx.db
          .update(replay)
          .set({
            fileURL: putResult.url,
            frameCount,
            isFinished: true,
          })
          .where(eq(replay.id, replayEntry.id));

        return {
          frameCount,
          id: replayEntry.id,
        };
      } catch (error) {
        if (error instanceof BlobAccessError) {
          // handle a recognized error
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to upload replay file",
            cause: error,
          });
        } else {
          // throw the error again if it's unknown
          throw error;
        }
      }
    }),
  get: protectedProcedure
    .input(z.object({ replayId: z.number() }))
    .query(async ({ input, ctx }) => {
      const [replayEntry] = await ctx.db
        .select()
        .from(replay)
        .where(eq(replay.id, input.replayId));

      if (!replayEntry) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Replay not found",
        });
      }

      return replayEntry;
    }),
  list: protectedProcedure
    .input(
      z
        .object({
          collectorUID: z.string().optional(),
          stageId: z.number().optional(),
          characterIds: z.array(z.number()).optional(),
          isFinished: z.boolean().optional(),
          startedAfter: z.coerce.date().optional(),
          startedBefore: z.coerce.date().optional(),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const filterConditions = [];

      if (input?.collectorUID) {
        filterConditions.push(eq(replay.collectorUID, input.collectorUID));
      }

      if (input?.stageId) {
        filterConditions.push(eq(replay.stageId, input.stageId));
      }

      if (input?.characterIds) {
        filterConditions.push(
          arrayContains(replay.characterIds, input.characterIds),
        );
      }

      if (input?.isFinished) {
        filterConditions.push(eq(replay.isFinished, input.isFinished));
      }

      if (input?.startedAfter) {
        filterConditions.push(gte(replay.startedAt, input.startedAfter));
      }

      if (input?.startedBefore) {
        filterConditions.push(lte(replay.startedAt, input.startedBefore));
      }

      const replayEntries = await ctx.db
        .select()
        .from(replay)
        .where(
          filterConditions.length > 0 ? and(...filterConditions) : undefined,
        );

      return replayEntries;
    }),
});
