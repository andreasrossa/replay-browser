import { createAuthClient } from "better-auth/react";
import { adminClient, passkeyClient } from "better-auth/client/plugins";
import { env } from "@/env";
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
