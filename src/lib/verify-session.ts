import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth, type Role } from "./auth";

type Props = {
  redirectTo?: string;
  hasRoles?: Role[];
};

export async function verifySession({ redirectTo, hasRoles }: Props = {}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (
    !session?.session ||
    (hasRoles &&
      session.user.role &&
      !hasRoles.includes(session.user.role as Role))
  ) {
    redirect(redirectTo ?? "/login");
  }

  return session;
}
