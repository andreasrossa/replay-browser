import { z } from "zod";
import { uidSchema } from "./common";

export const collectorDisplayNameSchema = z.string().min(1);

export const createCollectorSchema = z.object({
  uid: uidSchema,
  displayName: collectorDisplayNameSchema,
});

export const editCollectorSchema = z.object({
  displayName: collectorDisplayNameSchema,
});

export const editCollectorServerSchema = z.object({
  uid: uidSchema,
  displayName: collectorDisplayNameSchema,
});

export type CreateCollectorSchemaOutput = z.infer<typeof createCollectorSchema>;
export type CreateCollectorSchemaInput = z.input<typeof createCollectorSchema>;

export type EditCollectorSchemaInput = z.input<typeof editCollectorSchema>;
export type EditCollectorSchemaOutput = z.infer<typeof editCollectorSchema>;
