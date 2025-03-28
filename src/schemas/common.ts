import { z } from "zod";

export const uidSchema = z
  .string()
  .min(3, "UID must be at least 3 characters long")
  .max(50, "UID must be at most 50 characters long")
  .regex(
    /^[a-z0-9_-]+$/,
    "Only lowercase letters, numbers, dashes, and underscores are allowed",
  );

export type UidSchema = z.infer<typeof uidSchema>;
