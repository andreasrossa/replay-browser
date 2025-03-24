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

/**
 * Renders the application's sidebar.
 *
 * This component builds the sidebar structure, including the main application menu and a user menu
 * in the footer. It uses React Suspense with a Skeleton fallback to gracefully handle the loading
 * of the menu components.
 */
export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
