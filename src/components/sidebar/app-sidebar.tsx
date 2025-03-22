import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { HomeIcon } from "lucide-react";
import Link from "next/link";
import { SidebarUserMenu } from "./sidebar-user-menu";
import { Skeleton } from "../ui/skeleton";
import { Suspense } from "react";

const items = [
  {
    title: "Home",
    icon: HomeIcon,
    href: "/replays",
  },
];

function UserMenuSkeleton() {
  return (
    <SidebarMenuButton className="flex w-full justify-between">
      <div className="flex w-full items-center gap-2">
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="ml-auto h-4 w-4" />
      </div>
    </SidebarMenuButton>
  );
}

export default function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
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
