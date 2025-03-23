import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifySession } from "@/lib/verify-session";
import { api, HydrateClient } from "@/trpc/server";
import VenueTable from "./_components/venue-table";

export default async function VenuesPage() {
  await verifySession({
    hasRoles: ["admin"],
  });

  void api.venue.list.prefetch();

  return (
    <HydrateClient>
      <Card className="mx-auto w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Bruh</CardTitle>
          <CardDescription>
            Manage your venues and their settings.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <VenueTable />
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
