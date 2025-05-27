import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError } from "better-auth/api";
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
  onAPIError: {
    errorURL: "/error",
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user, ctx) => {
          console.log(
            "Session in create User Hook: ",
            ctx?.context.session?.user.email,
          );
          if (user.email != "andreas@rossamail.de") {
            throw new APIError("BAD_REQUEST", {
              message: "Signup is disabled",
            });
          }

          return {
            data: user,
          };
        },
      },
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "https://staging.replays.dev",
    "https://www.replays.dev",
  ],
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
    enabled: false,
  },
  socialProviders: {
    discord: {
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      disableSignUp: true,
    },
  },
});
