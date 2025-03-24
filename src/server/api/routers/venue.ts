import { createVenueSchema, editVenueServerSchema } from "@/schemas/venue";
import { adminProcedure, createTRPCRouter } from "@/server/api/trpc";
import { venue } from "@/server/db/schema";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";
import { FormError } from "../errors/FormError";

export const venueRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx: { db } }) => {
    const venues = await db.query.venue.findMany({
      orderBy: [desc(venue.createdAt)],
    });

    return venues;
  }),
  get: adminProcedure
    .input(z.object({ uid: z.string() }))
    .query(async ({ ctx: { db }, input }) => {
      return await db.query.venue.findFirst({
        where: eq(venue.uid, input.uid),
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
          createdAt: new Date(),
          updatedAt: new Date(),
        })
        .returning();

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
});
