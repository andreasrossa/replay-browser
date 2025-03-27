import { env } from "@/env";
import {
  createCollectorSchema,
  editCollectorServerSchema,
} from "@/schemas/collector";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { collector } from "@/server/db/schema/collector";
import { generateSecret, hashSecret } from "@/server/utils/generate-secret";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const publicValueSelect: Partial<
  Record<keyof typeof collector.$inferSelect, boolean>
> = {
  uid: true,
  displayName: true,
  createdAt: true,
  updatedAt: true,
  secretExpiresAt: true,
};

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
      const secret = generateSecret();
      const hashedSecret = hashSecret(secret);
      const [createdCollector] = await db
        .insert(collector)
        .values({
          uid: input.uid,
          displayName: input.displayName,
          secret: hashedSecret,
        })
        .returning();

      if (!createdCollector) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create collector",
        });
      }

      return {
        ...createdCollector,
        secret,
      };
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

      const newSecret = generateSecret();
      const hashedSecret = hashSecret(newSecret);

      const [updatedCollector] = await db
        .update(collector)
        .set({
          secret: hashedSecret,
          secretExpiresAt: new Date(
            Date.now() + env.COLLECTOR_SECRET_EXPIRATION_TIME_SECONDS * 1000,
          ),
        })
        .where(eq(collector.uid, input.uid))
        .returning();

      if (!updatedCollector) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collector not found",
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
