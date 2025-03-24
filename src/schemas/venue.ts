import { z } from "zod";

export const venueUidSchema = z
  .string()
  .min(3, "UID must be at least 3 characters long")
  .max(50, "UID must be at most 50 characters long")
  .regex(
    /^[a-z0-9_-]+$/,
    "Only lowercase letters, numbers, dashes, and underscores are allowed",
  );

export const venueDescriptionSchema = z
  .string()
  .max(100, "Description must be at most 100 characters long")
  .optional();

export const createVenueSchema = z.object({
  uid: venueUidSchema,
  description: venueDescriptionSchema,
});

export const editVenueClientSchema = z.object({
  description: venueDescriptionSchema,
});

export const editVenueServerSchema = z.object({
  uid: venueUidSchema,
  description: venueDescriptionSchema,
});

export type CreateVenueSchema = z.infer<typeof createVenueSchema>;
export type EditVenueClientSchema = z.infer<typeof editVenueClientSchema>;
export type EditVenueServerSchema = z.infer<typeof editVenueServerSchema>;
