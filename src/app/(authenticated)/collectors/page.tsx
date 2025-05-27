import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api, HydrateClient } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import CollectorTable from "./_components/collector-table";

export default async function CollectorsPage() {
  await auth.protect({
    role: "admin",
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
