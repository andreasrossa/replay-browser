import { z } from "zod";
import { uidSchema } from "./common";

export const venueDescriptionSchema = z
  .string()
  .max(100, "Description must be at most 100 characters long")
  .optional();

export const createVenueSchema = z.object({
  uid: uidSchema,
  description: venueDescriptionSchema,
});

export const editVenueClientSchema = z.object({
  description: venueDescriptionSchema,
});

export const editVenueServerSchema = z.object({
  uid: uidSchema,
  description: venueDescriptionSchema,
});

export type CreateVenueSchema = z.infer<typeof createVenueSchema>;
export type EditVenueClientSchema = z.infer<typeof editVenueClientSchema>;
export type EditVenueServerSchema = z.infer<typeof editVenueServerSchema>;
