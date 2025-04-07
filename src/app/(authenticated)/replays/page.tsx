import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { verifySession } from "@/lib/verify-session";
import { api, HydrateClient } from "@/trpc/server";
import ReplayList from "./_components/replay-list";

export default async function ReplaysPage() {
  await verifySession();

  void api.replay.list.prefetch();

  return (
    <HydrateClient>
      <Card className="p-4">
        <CardContent>
          <CardHeader>
            <CardTitle>Replays</CardTitle>
          </CardHeader>
          <ReplayList />
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
