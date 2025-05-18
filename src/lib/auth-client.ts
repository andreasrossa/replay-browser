import { adminClient, passkeyClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { accessControl, adminRole, userRole } from "./permissions";
import { getBaseUrl } from "./utils/base-url";

export const authClient = createAuthClient({
  baseURL: getBaseUrl(),
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
