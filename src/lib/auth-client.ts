import { env } from "@/env";
import { adminClient, passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { accessControl, adminRole, userRole } from "./permissions";
export const authClient = createAuthClient({
  baseURL: env.NEXT_PUBLIC_URL,
  plugins: [
    adminClient({
      ac: accessControl,
      roles: {
        admin: adminRole,
        user: userRole,
      },
    }),
    passkeyClient(),
  ],
});

export type Session = typeof authClient.$Infer.Session;
