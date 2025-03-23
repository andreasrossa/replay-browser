import { createVenueSchema, editVenueServerSchema } from "@/schemas/venue";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { venue } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import crypto from "node:crypto";
import { z } from "zod";
import { FormError } from "../errors/FormError";

const publicValueSelect = {
  uid: true,
  description: true,
  createdAt: true,
  updatedAt: true,
} as const;

export const venueRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx: { db } }) => {
    const venues = await db.query.venue.findMany({
      columns: publicValueSelect,
      orderBy: [desc(venue.createdAt)],
    });

    return venues;
  }),
  get: adminProcedure
    .input(z.object({ uid: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      return await db.query.venue.findFirst({
        where: eq(venue.uid, input.uid),
        columns: publicValueSelect,
      });
    }),
  create: adminProcedure
    .input(createVenueSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      const existingVenue = await db.query.venue.findFirst({
        where: eq(venue.uid, input.uid),
      });

      if (existingVenue) {
        throw new FormError("This UID is already taken", ["uid"]);
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
  delete: adminProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      await db.delete(venue).where(eq(venue.uid, input.uid));
    }),
  editDescription: adminProcedure
    .input(editVenueServerSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      const [updatedVenue] = await db
        .update(venue)
        .set({ description: input.description })
        .where(eq(venue.uid, input.uid))
        .returning({ uid: venue.uid, description: venue.description });

      if (!updatedVenue) {
        throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
      }

      return updatedVenue;
    }),
  regenerateSecret: adminProcedure
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
