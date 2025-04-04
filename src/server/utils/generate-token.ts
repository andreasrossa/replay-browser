import "server-only";

import crypto from "node:crypto";

export function hashToken(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function generateToken(): string {
  return crypto.randomBytes(32).toString("hex");
}
