import {
  createTRPCRouter,
  protectedCollectorProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { replay } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

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
      const [replayEntry] = await db
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
      z.object({
        replayId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // const bucketExists = await minioClient.bucketExists(replayBucket);
      // if (!bucketExists) {
      //   await minioClient.makeBucket(replayBucket);
      // }
      // const fileMetadata = {
      //   "Content-Type": "binary/octet-stream",
      // };
      // const uploadedFile = await minioClient.putObject(
      //   replayBucket,
      //   file.name,
      //   Buffer.from(await file.arrayBuffer()),
      //   file.size,
      //   fileMetadata,
      // );
    }),
});
