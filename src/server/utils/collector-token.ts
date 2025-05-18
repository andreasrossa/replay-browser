import "server-only";

import crypto from "node:crypto";

export function hashCollectorToken(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function generateCollectorToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
