import {
  adminProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "@/server/api/trpc";
import { venue } from "@/server/db/schema";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import crypto from "node:crypto";
import { TRPCError } from "@trpc/server";
import { FormError } from "../errors/FormError";

const publicValueSelect = {
  uid: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const venueRouter = createTRPCRouter({
  list: protectedProcedure.query(async ({ ctx: { db } }) => {
    const venues = await db.query.venue.findMany({
      columns: publicValueSelect,
      orderBy: [desc(venue.createdAt)],
    });

    return venues;
  }),
  get: protectedProcedure
    .input(z.object({ uid: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      return await db.query.venue.findFirst({
        where: eq(venue.uid, input.uid),
        columns: publicValueSelect,
      });
    }),
  create: adminProcedure
    .input(
      z.object({
        uid: z.string().regex(/^[a-z0-9_-]+$/, "venue.uid.invalid"),
        description: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx: { db }, input }) => {
      const existingVenue = await db.query.venue.findFirst({
        where: eq(venue.uid, input.uid),
      });

      if (existingVenue) {
        throw new FormError("venue.uid.alreadyExists", ["uid"]);
      }

      const [createdVenue] = await db
        .insert(venue)
        .values({
          uid: input.uid,
          description: input.description,
          secret: crypto.randomBytes(64).toString("hex"),
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning({ uid: venue.uid, secret: venue.secret });

      if (!createdVenue) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return createdVenue;
    }),
  regenerateSecret: protectedProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      const [updatedVenue] = await db
        .update(venue)
        .set({
          secret: crypto.randomBytes(64).toString("hex"),
        })
        .where(eq(venue.uid, input.uid))
        .returning({ uid: venue.uid, secret: venue.secret });

      return updatedVenue;
    }),
});
