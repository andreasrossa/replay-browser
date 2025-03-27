import "server-only";

import { env } from "@/env";
import crypto from "node:crypto";

const IV_LENGTH = 16;

function validateEncryptionKey(key: string): Buffer {
  if (!/^[0-9a-f]{64}$/i.test(key)) {
    throw new Error(
      "Encryption key must be a 64-character hex string (32 bytes)",
    );
  }
  return Buffer.from(key, "hex");
}

const ENCRYPTION_KEY = validateEncryptionKey(
  env.COLLECTOR_SECRET_ENCRYPTION_KEY,
);

export function encrypt(text: string): string {
  // makes sure the resulting secret is unique, even for the same input
  const iv = crypto.randomBytes(IV_LENGTH);
  // encrypts the secret
  const cipher = crypto.createCipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);
  // authTag is used to verify the integrity of the encrypted text
  const authTag = cipher.getAuthTag();
  return (
    iv.toString("hex") +
    ":" +
    encrypted.toString("hex") +
    ":" +
    authTag.toString("hex")
  );
}

export function decrypt(text: string): string {
  const parts = text.split(":");
  const iv = Buffer.from(parts[0]!, "hex");
  const encryptedText = Buffer.from(parts[1]!, "hex");
  const authTag = Buffer.from(parts[2]!, "hex");
  const decipher = crypto.createDecipheriv("aes-256-gcm", ENCRYPTION_KEY, iv);
  decipher.setAuthTag(authTag);
  return (
    decipher.update(encryptedText, undefined, "utf8") + decipher.final("utf8")
  );
}

export function hashSecret(text: string): string {
  return crypto.createHash("sha256").update(text).digest("hex");
}

export function generateSecret(): string {
  return crypto.randomBytes(64).toString("hex");
}
