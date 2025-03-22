"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";
import { ChevronUpIcon, KeyIcon, LogOutIcon, UserIcon } from "lucide-react";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Skeleton } from "../ui/skeleton";

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
            authClient.passkey.addPasskey().then((res) => {
              toast.success("Passkey added successfully!");
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
