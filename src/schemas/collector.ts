import { z } from "zod";
import { uidSchema } from "./common";

export const createCollectorServerSchema = z.object({
  uid: uidSchema,
  description: z.string().optional(),
  venueUID: uidSchema,
});

export const createCollectorPublicSchema = createCollectorServerSchema.omit({
  venueUID: true,
});

export type CreateCollectorServerSchema = z.infer<
  typeof createCollectorServerSchema
>;

export type CreateCollectorPublicSchema = z.infer<
  typeof createCollectorPublicSchema
>;
