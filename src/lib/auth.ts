import { betterAuth } from "better-auth";
import { admin } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { db } from "@/server/db";
import { env } from "../env";
import { accessControl, adminRole, userRole } from "./permissions";
import { passkey } from "better-auth/plugins/passkey";

export const roles = {
  admin: adminRole,
  user: userRole,
} as const;

export type Role = keyof typeof roles;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  plugins: [
    admin({
      ac: accessControl,
      roles,
    }),
    passkey(),
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    },
  },
});
