"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { authClient } from "@/lib/auth-client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FaDiscord, FaGoogle } from "react-icons/fa6";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

/**
 * Renders a login card with multiple authentication methods.
 *
 * This component displays a form for email/password login and provides social login via Discord.
 * It uses react-hook-form paired with Zod for form handling and validation, while managing
 * loading states and error notifications. On devices that support it, the component also
 * attempts a silent passkey-based authentication and redirects the user upon successful login.
 *
 * @remarks
 * The component handles asynchronous authentication responses distinctly, such as preloaded
 * passkey states or authentication failures, and redirects authenticated users to the replays page.
 */
export default function LoginCard() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });

  function onEmailSignInSubmit(data: z.infer<typeof formSchema>) {
    void authClient.signIn.email({
      email: data.email,
      password: data.password,
      callbackURL: "/replays",
      fetchOptions: {
        onError: (error) => {
          console.error(error);
          toast.error(error.error.message);
        },
        onRequest: () => {
          setIsLoading(true);
        },
        onResponse: () => {
          setIsLoading(false);
        },
      },
    });
  }

  React.useEffect(() => {
    if (!PublicKeyCredential.isConditionalMediationAvailable) {
      return;
    }

    PublicKeyCredential.isConditionalMediationAvailable()
      .then((isAvailable) => {
        if (!isAvailable) {
          return;
        }

        authClient.signIn
          .passkey({
            autoFill: true,
          })
          .then((res) => {
            console.log("res", res);
            // yes this is actually how it works. This promise resolves twice.
            // Once with a 400 error (which means the passkey has been preloaded)
            // And once with undefined (which means the user has authenticated successfully).
            // Just to reiterate, this is not my API, this is just how it works (better-auth).
            // Bruh...
            if (res?.error.status === 400) {
              console.log("Passkey preloaded");
            } else if (res?.error.status === 401) {
              toast.error(
                "Passkey authentication failed. Please use a different authentication method.",
              );
            } else if (res === undefined) {
              router.push("/replays");
            }
          })
          .catch((error) => {
            console.error("Failed to preload passkey", error);
          });
      })
      .catch((error) => {
        console.error("Failed to check if passkey is available", error);
      });
  }, [router]);

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Welcome back</CardTitle>
        <CardDescription>
          Login with your Discord or Google account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              void authClient.signIn.social({
                provider: "discord",
                callbackURL: "/replays",
                fetchOptions: {
                  onError: (error) => {
                    console.error("Failed to login with Discord", error);
                    toast.error("Failed to login with Discord");
                  },
                },
              });
            }}
          >
            <FaDiscord /> Login with Discord
          </Button>
          <Button
            className="w-full"
            variant="outline"
            onClick={() => {
              toast.info("Google Login is not available quite yet.");
            }}
          >
            <FaGoogle /> Login with Google
          </Button>
        </div>
        <div className="relative my-6 text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
          <span className="relative z-10 bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
        <Form {...form}>
          <form
            className="flex flex-col gap-4"
            onSubmit={form.handleSubmit(onEmailSignInSubmit)}
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="text"
                      autoComplete="email webauthn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor="password">Password</FormLabel>
                  <FormControl>
                    <Input
                      id="password"
                      type="password"
                      autoComplete="current-password webauthn"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Logging you in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
        <div className="mt-6 text-center">
          <Link href="/signup" className="text-sm">
            Don&apos;t have an account?{" "}
            <span className="underline">Sign up</span>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
