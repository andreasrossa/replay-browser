import { auth } from "@/lib/auth";
import LoginCard from "./_components/login-card";
import { authClient } from "@/lib/auth-client";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  console.log("session", session);

  if (session !== null) {
    console.log("redirecting to /replays");
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
