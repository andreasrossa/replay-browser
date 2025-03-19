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
    .input(z.object({ uid: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      return await db.query.venue.findFirst({
        where: eq(venue.uid, input.uid),
      });
    }),
  create: publicProcedure
    .input(
      z.object({
        uid: z.string().regex(/^[a-z0-9_-]+$/),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const [createdVenue] = await db
        .insert(venue)
        .values({
          uid: input.uid,
          description: input.description,
          secret: crypto.randomBytes(64).toString("hex"),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ uid: venue.uid });

      return createdVenue;
    }),
});
