import "server-only";

import { env } from "@/env";
import jwt from "jsonwebtoken";

export function generateIngestorToken(collectorUID: string): string {
  return jwt.sign(
    {
      collectorUID,
    },
    env.INGESTOR_JWT_SECRET,
    {
      expiresIn: "1h",
      algorithm: "HS256",
    },
  );
}
