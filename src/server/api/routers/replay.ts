import {
  createTRPCRouter,
  protectedCollectorProcedure,
} from "@/server/api/trpc";
import { db } from "@/server/db";
import { replay } from "@/server/db/schema";
import { minioClient } from "@/server/utils/minio";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { zfd } from "zod-form-data";

const replayBucket = "replays";
const replayFileSizeLimit = 50 * 1024 * 1024; // 50MB

export const replayRouter = createTRPCRouter({
  start: protectedCollectorProcedure
    .input(
      zfd.formData({
        file: zfd.file(),
        metadata: zfd.json(
          z.object({
            startedAt: z.coerce.date(),
            stageId: z.number(),
            characterIds: z.array(z.number()),
            wiiMacAddress: z
              .string()
              .regex(/^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$/),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input: { file, metadata } }) => {
      if (!file || !metadata) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File and metadata are required",
        });
      }

      if (file.size === 0) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File is empty",
        });
      }

      if (file.type !== "application/octet-stream") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File is not a valid replay",
        });
      }

      if (file.size > replayFileSizeLimit) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "File is too large",
        });
      }

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
          file.name,
          Buffer.from(await file.arrayBuffer()),
          file.size,
          fileMetadata,
        );

        const [replayEntry] = await db
          .insert(replay)
          .values({
            startedAt: metadata.startedAt,
            stageId: metadata.stageId,
            characterIds: metadata.characterIds,
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
