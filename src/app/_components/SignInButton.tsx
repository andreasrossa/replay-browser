'use client'

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import Image from "next/image"

export function SignInButton() {
    const { data } = authClient.useSession()
  return (
    <div className="flex flex-col gap-2 items-center">
      { !data?.user && (
        <Button onClick={() => authClient.signIn.social({ provider: "discord" })}>
          Sign in with Discord
        </Button>
      )}
      <span>Signed in as {data?.user?.email}</span>
      {data?.user && (
        <Button onClick={() => authClient.signOut()}>Sign out</Button>
      )}
      {data?.user?.image && (
        <Image
          src={data.user.image}
          alt="User avatar"
          className="w-10 h-10 rounded-full"
          width={40}
          height={40}
        />
      )}
    </div>
  );
}
