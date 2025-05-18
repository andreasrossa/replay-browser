import { PostHogProvider } from "@/components/PostHogProvider";
import AppSidebar from "@/components/sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function ReplaysLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PostHogProvider>
      <SpeedInsights />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Replays</BreadcrumbLink>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </header>
          <main className="p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </PostHogProvider>
  );
}
