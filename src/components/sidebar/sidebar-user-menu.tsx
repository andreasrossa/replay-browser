"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { ChevronUpIcon, KeyIcon, LogOutIcon, UserIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";

/**
 * Renders a sidebar user menu for managing authentication actions.
 *
 * This React component checks the current session state:
 * - While the session is pending, it displays a loading state with skeleton loaders.
 * - Once the session is resolved, it renders a dropdown menu showing the user's email and two actions:
 *   - "Add Passkey": Initiates an asynchronous operation to add a passkey, displaying a toast on success or logging an error and showing an error toast on failure.
 *   - "Sign out": Signs the user out and redirects to the home page on success, with similar error feedback on failure.
 *
 * @example
 * // In a sidebar component:
 * <SidebarUserMenu />
 */
export function SidebarUserMenu() {
  const session = authClient.useSession();
  const router = useRouter();

  if (session.isPending) {
    return (
      <SidebarMenuButton className="flex w-full justify-between">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-full" />
      </SidebarMenuButton>
    );
  }
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className="flex w-full justify-between">
          <UserIcon className="size-4" />
          <span className="truncate">{session.data?.user?.email}</span>
          <ChevronUpIcon className="size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem
          onClick={() => {
            void authClient.passkey
              .addPasskey()
              .then((_res) => {
                toast.success("Passkey added successfully!");
              })
              .catch((error) => {
                console.error("Failed to add passkey", error);
                toast.error("Failed to add passkey");
              });
          }}
        >
          <KeyIcon className="size-4" />
          <span>Add Passkey</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            authClient
              .signOut()
              .then(() => {
                void router.push("/");
              })
              .catch((error) => {
                console.error("Failed to sign out", error);
                toast.error("Failed to sign out");
              });
          }}
        >
          <LogOutIcon className="size-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
