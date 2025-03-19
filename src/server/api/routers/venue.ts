import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";
import { venue } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import crypto from "node:crypto";

export const venueRouter = createTRPCRouter({
  list: publicProcedure.query(async ({ ctx: { db } }) => {
    return await db.query.venue.findMany();
  }),
  get: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx: { db }, input }) => {
      return await db.query.venue.findFirst({ where: eq(venue.id, input.id) });
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().regex(/^[a-z0-9_-]+$/),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      return await db
        .insert(venue)
        .values({
          name: input.name,
          description: input.description,
          secret: crypto.randomBytes(16).toString("hex"),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();
    }),
});
