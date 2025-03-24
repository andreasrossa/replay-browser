import { createCollectorServerSchema } from "@/schemas/collector";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { collector } from "@/server/db/schema/collector";
import { desc, eq } from "drizzle-orm";
import crypto from "node:crypto";
import { z } from "zod";
const publicValueSelect = {
  uid: true,
  description: true,
  venueUID: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const collectorRouter = createTRPCRouter({
  listForVenue: adminProcedure
    .input(z.object({ venueUID: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      const collectors = await db.query.collector.findMany({
        where: eq(collector.venueUID, input.venueUID),
        columns: publicValueSelect,
        orderBy: [desc(collector.createdAt)],
      });

      return collectors;
    }),
  create: adminProcedure
    .input(createCollectorServerSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      const [createdCollector] = await db
        .insert(collector)
        .values({
          uid: input.uid,
          description: input.description,
          venueUID: input.venueUID,
          secret: crypto.randomBytes(64).toString("hex"),
        })
        .returning();

      return createdCollector;
    }),
});
