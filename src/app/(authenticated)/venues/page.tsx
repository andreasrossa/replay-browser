import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import VenueTable from "./_components/venue-table";
import { api, HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2Icon } from "lucide-react";

export default async function VenuesPage() {
  void api.venue.list.prefetch();

  return (
    <HydrateClient>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Venues</CardTitle>
          <CardDescription>
            Manage your venues and their settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense
            fallback={
              <span className="flex w-full items-center justify-center gap-2">
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </span>
            }
          >
            <VenueTable />
          </Suspense>
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
