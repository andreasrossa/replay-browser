import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { admin } from "better-auth/plugins";

import { db } from "@/server/db";
import {
  account,
  passkey,
  session,
  user,
  verification,
} from "@/server/db/schema";
import { passkey as passkeyPlugin } from "better-auth/plugins/passkey";
import { env } from "../env";
import { accessControl, adminRole, userRole } from "./permissions";

export const roles = {
  admin: adminRole,
  user: userRole,
} as const;

export type Role = keyof typeof roles;

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: user,
      session: session,
      account: account,
      verification: verification,
      passkey: passkey,
    },
  }),
  plugins: [
    admin({
      ac: accessControl,
      roles,
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
    passkeyPlugin(),
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
