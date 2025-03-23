import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { type Session } from "@/lib/auth-client";
import { verifySession } from "@/lib/verify-session";
import { Gamepad2Icon, HouseIcon } from "lucide-react";
import Link from "next/link";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  href: string;
  condition?: (session?: Session | null) => boolean;
};

const items: SidebarItem[] = [
  {
    title: "Replays",
    icon: Gamepad2Icon,
    href: "/replays",
  },
  {
    title: "Venues",
    icon: HouseIcon,
    href: "/venues",
    condition: (session) => session?.user.role === "admin",
  },
];

export default async function AppSidebarMenu() {
  const session = await verifySession();

  return (
    <SidebarMenu>
      {items
        .filter((item) => !item.condition || item.condition(session))
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
