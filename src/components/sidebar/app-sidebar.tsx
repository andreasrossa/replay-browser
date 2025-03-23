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
import { Session } from "@/lib/auth-client";
import { Building2Icon, HomeIcon } from "lucide-react";
import { Suspense } from "react";
import { Skeleton } from "../ui/skeleton";
import AppSidebarMenu from "./app-sidebar-menu";
import { SidebarUserMenu } from "./sidebar-user-menu";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  condition?: (session?: Session | null) => boolean;
};

const items: SidebarItem[] = [
  {
    title: "Home",
    icon: HomeIcon,
    href: "/replays",
  },
  {
    title: "Venues",
    icon: Building2Icon,
    href: "/venues",
    condition: (session) => session?.user.role === "admin",
  },
];

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
