import { z } from "zod";

import {
  createTRPCRouter,
  protectedCollectorProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { replay } from "@/server/db/schema";
import { minioClient } from "@/server/utils/minio";
import { TRPCError } from "@trpc/server";

const replayBucket = "replays";

export const replayRouter = createTRPCRouter({
  start: protectedCollectorProcedure
    .input(
      z.object({
        startedAt: z.coerce.date(),
        stageId: z.number(),
        characterIds: z.array(z.number()),
        file: z.instanceof(File),
        wiiMacAddress: z
          .string()
          .regex(/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const bucketExists = await minioClient.bucketExists(replayBucket);

        if (!bucketExists) {
          await minioClient.makeBucket(replayBucket);
        }

        const fileMetadata = {
          "Content-Type": "binary/octet-stream",
        };

        const uploadedFile = await minioClient.putObject(
          replayBucket,
          input.file.name,
          Buffer.from(await input.file.arrayBuffer()),
          input.file.size,
          fileMetadata,
        );

        const [replayEntry] = await db
          .insert(replay)
          .values({
            startedAt: input.startedAt,
            stageId: input.stageId,
            characterIds: input.characterIds,
            fileId: uploadedFile.etag,
            collectorUID: ctx.collector.uid,
          })
          .returning();

        if (!replayEntry) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to create replay entry",
          });
        }

        return replayEntry;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to upload replay to S3",
        });
      }
    }),
});
