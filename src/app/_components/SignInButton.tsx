'use client'

import { authClient } from "@/lib/auth-client"

export function SignInButton() {
    const { data } = authClient.useSession()
    return <div className="flex flex-col gap-2">
        <button onClick={() => authClient.signIn.social({ provider: "discord" })}>Sign in with Discord</button>
        <span>Signed in as {data?.user?.email}</span>
    </div>
}  