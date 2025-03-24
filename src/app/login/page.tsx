import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import LoginCard from "./_components/login-card";

/**
 * Renders the login page and manages user session redirection.
 *
 * This asynchronous component retrieves the current user session. If a session is active, it immediately redirects
 * the user to the "/replays" page. Otherwise, it returns a JSX structure containing the login interface.
 *
 * @returns A JSX element displaying the login card when no active session is found.
 */
export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session !== null) {
    redirect("/replays");
  }

  return (
    <div className="flex min-h-svh w-full flex-col items-center justify-center gap-6 bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm">
        <LoginCard />
      </div>
    </div>
  );
}
