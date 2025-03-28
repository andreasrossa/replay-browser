import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifySession } from "@/lib/verify-session";
import { api, HydrateClient } from "@/trpc/server";
import CollectorTable from "./_components/collector-table";

export default async function CollectorsPage() {
  await verifySession({
    hasRoles: ["admin"],
  });

  void api.collector.list.prefetch();

  return (
    <HydrateClient>
      <Card className="mx-auto w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Manage Collectors
          </CardTitle>
          <CardDescription>
            {`Collectors connect to on or multiple Wii consoles and receive replay data.`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CollectorTable />
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
