import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@clerk/nextjs/server";
import { Gamepad2Icon, HouseIcon } from "lucide-react";
import Link from "next/link";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  adminOnly?: boolean;
};

const items: SidebarItem[] = [
  {
    title: "Replays",
    icon: Gamepad2Icon,
    href: "/replays",
  },
  {
    title: "Collectors",
    icon: HouseIcon,
    href: "/collectors",
    adminOnly: true,
  },
];

export default async function AppSidebarMenu() {
  const { has } = await auth();

  console.log();

  return (
    <SidebarMenu>
      {items
        .filter((item) => !item.adminOnly || has({ role: "org:admin" }))
        .map((item) => (
          <SidebarMenuItem key={item.title}>
            <SidebarMenuButton asChild>
              <Link href={item.href}>
                <item.icon className="size-4" />
                {item.title}
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
    </SidebarMenu>
  );
}
