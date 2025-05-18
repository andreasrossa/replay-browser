import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { verifySession } from "@/lib/verify-session";
import { api, HydrateClient } from "@/trpc/server";
import ReplayTable from "./_components/replay-table";

export default async function ReplaysPage() {
  await verifySession();

  void api.replay.list.prefetch();

  return (
    <HydrateClient>
      <Card className="mx-auto w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Replays</CardTitle>
          <CardDescription>{`Find and download replays.`}</CardDescription>
        </CardHeader>
        <CardContent>
          <ReplayTable />
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
