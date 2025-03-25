import {
  createCollectorSchema,
  editCollectorServerSchema,
} from "@/schemas/collector";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { collector } from "@/server/db/schema/collector";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import crypto from "node:crypto";
import { z } from "zod";

const publicValueSelect = {
  uid: true,
  displayName: true,
  createdAt: true,
  updatedAt: true,
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
          secret: crypto.randomBytes(64).toString("hex"),
        })
        .returning();

      if (!createdCollector) {
        throw new Error("Failed to create collector");
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
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      const [updatedCollector] = await db
        .update(collector)
        .set({ displayName: input.displayName })
        .where(eq(collector.uid, input.uid))
        .returning();

      if (!updatedCollector) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return updatedCollector;
    }),
  delete: adminProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      const collectorToDelete = await db.query.collector.findFirst({
        where: eq(collector.uid, input.uid),
      });

      if (!collectorToDelete) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      try {
        await db.delete(collector).where(eq(collector.uid, input.uid));
      } catch (error) {
        console.error(error);
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }
    }),
});
