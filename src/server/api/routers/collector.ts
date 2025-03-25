import { env } from "@/env";
import {
  createCollectorSchema,
  editCollectorServerSchema,
} from "@/schemas/collector";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { collector } from "@/server/db/schema/collector";
import { encrypt, generateSecret } from "@/server/utils/generate-secret";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import crypto from "node:crypto";
import { z } from "zod";

const publicValueSelect = {
  uid: true,
  displayName: true,
  createdAt: true,
  updatedAt: true,
  secretExpiresAt: true,
} as const;

export const collectorRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx: { db } }) => {
    const collectors = await db.query.collector.findMany({
      columns: publicValueSelect,
      orderBy: [desc(collector.createdAt)],
    });

    return collectors;
  }),
  create: adminProcedure
    .input(createCollectorSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      const [createdCollector] = await db
        .insert(collector)
        .values({
          uid: input.uid,
          displayName: input.displayName,
          secret: generateSecret(),
        })
        .returning();

      if (!createdCollector) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create collector",
        });
      }

      return createdCollector;
    }),
  update: adminProcedure
    .input(editCollectorServerSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      const collectorToUpdate = await db.query.collector.findFirst({
        where: eq(collector.uid, input.uid),
      });

      if (!collectorToUpdate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collector not found",
        });
      }

      const [updatedCollector] = await db
        .update(collector)
        .set({ displayName: input.displayName })
        .where(eq(collector.uid, input.uid))
        .returning();

      if (!updatedCollector) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update collector",
        });
      }

      return updatedCollector;
    }),
  regenerateSecret: adminProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      const collectorToRegenerateSecret = await db.query.collector.findFirst({
        where: eq(collector.uid, input.uid),
      });

      if (!collectorToRegenerateSecret) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collector not found",
        });
      }

      const newSecret = crypto.randomBytes(64).toString("hex");
      const encryptedSecret = encrypt(newSecret);

      const [updatedCollector] = await db
        .update(collector)
        .set({
          secret: encryptedSecret,
          secretExpiresAt: new Date(
            Date.now() + env.COLLECTOR_SECRET_EXPIRATION_TIME_SECONDS * 1000,
          ),
        })
        .where(eq(collector.uid, input.uid))
        .returning();

      if (!updatedCollector) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to regenerate collector secret",
        });
      }

      return {
        secret: newSecret,
        secretExpiresAt: updatedCollector.secretExpiresAt,
      };
    }),
  delete: adminProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      const collectorToDelete = await db.query.collector.findFirst({
        where: eq(collector.uid, input.uid),
      });

      if (!collectorToDelete) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collector not found",
        });
      }

      try {
        await db.delete(collector).where(eq(collector.uid, input.uid));
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete collector",
        });
      }
    }),
});
