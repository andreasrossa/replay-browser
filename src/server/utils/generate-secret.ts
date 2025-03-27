import "server-only";

import crypto from "node:crypto";

export function hashSecret(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function generateSecret(): string {
  return crypto.randomBytes(64).toString("hex");
}
