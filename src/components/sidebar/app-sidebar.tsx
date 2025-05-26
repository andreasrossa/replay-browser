import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import AppSidebarMenu from "./app-sidebar-menu";
import { SidebarUserMenu } from "./sidebar-user-menu";

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Replay Browser</SidebarGroupLabel>
          <SidebarGroupContent>
            <Suspense fallback={<Skeleton className="h-8 w-full" />}>
              <AppSidebarMenu />
            </Suspense>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Suspense fallback={<Skeleton className="h-8 w-full" />}>
              <SidebarUserMenu />
            </Suspense>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
