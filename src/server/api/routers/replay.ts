import {
  createTRPCRouter,
  protectedCollectorProcedure,
  protectedProcedure,
} from "@/server/api/trpc";
import { replay } from "@/server/db/schema";
import { minioClient } from "@/server/utils/minio";
import { TRPCError } from "@trpc/server";
import { and, arrayContains, eq, gte, lte } from "drizzle-orm";
import { z } from "zod";
import { zfd } from "zod-form-data";

const replayBucket = "replays";
const replayFileSizeLimit = 50 * 1024 * 1024; // 50MB

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
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const [replayEntry] = await ctx.db
        .insert(replay)
        .values({
          startedAt: input.startedAt,
          stageId: input.stageId,
          characterIds: input.characterIds,
          collectorUID: ctx.collector.uid,
        })
        .returning({ id: replay.id });

      if (!replayEntry) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create replay entry",
        });
      }

      return replayEntry;
    }),
  end: protectedCollectorProcedure
    .input(
      zfd.formData({
        replayId: zfd.numeric(),
        replayFile: zfd.file(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
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

      const bucketExists = await minioClient.bucketExists(replayBucket);

      if (!bucketExists) {
        await minioClient.makeBucket(replayBucket);
      }

      const fileMetadata = {
        "Content-Type": "binary/octet-stream",
      };

      const uploadedFile = await minioClient.putObject(
        replayBucket,
        input.replayFile.name,
        Buffer.from(await input.replayFile.arrayBuffer()),
        input.replayFile.size,
        fileMetadata,
      );

      await ctx.db
        .update(replay)
        .set({
          fileId: uploadedFile.etag,
          isFinished: true,
        })
        .where(eq(replay.id, input.replayId));
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
      z.object({
        collectorUID: z.string().optional(),
        stageId: z.number().optional(),
        characterIds: z.array(z.number()).optional(),
        isFinished: z.boolean().optional(),
        startedAfter: z.coerce.date().optional(),
        startedBefore: z.coerce.date().optional(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const filterConditions = [];

      if (input.collectorUID) {
        filterConditions.push(eq(replay.collectorUID, input.collectorUID));
      }

      if (input.stageId) {
        filterConditions.push(eq(replay.stageId, input.stageId));
      }

      if (input.characterIds) {
        filterConditions.push(
          arrayContains(replay.characterIds, input.characterIds),
        );
      }

      if (input.isFinished) {
        filterConditions.push(eq(replay.isFinished, input.isFinished));
      }

      if (input.startedAfter) {
        filterConditions.push(gte(replay.startedAt, input.startedAfter));
      }

      if (input.startedBefore) {
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
