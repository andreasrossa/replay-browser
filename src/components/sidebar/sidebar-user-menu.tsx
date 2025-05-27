"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { useAuth } from "@clerk/clerk-react";
import { useUser } from "@clerk/nextjs";
import { ChevronUpIcon, LogOutIcon, UserIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Skeleton } from "../ui/skeleton";

export function SidebarUserMenu() {
  const { isLoaded, signOut, orgId } = useAuth();
  const { user } = useUser();

  if (!isLoaded) {
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
          <span className="truncate">
            {user?.primaryEmailAddress?.emailAddress}
            {orgId}
          </span>
          <ChevronUpIcon className="size-4" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        className="w-[--radix-popper-anchor-width]"
      >
        <DropdownMenuItem
          onClick={() => {
            void signOut();
          }}
        >
          <LogOutIcon className="size-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
