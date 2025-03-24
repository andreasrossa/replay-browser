import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NotFoundPageError from "@/components/util/error/NotFoundPageError";
import { verifySession } from "@/lib/verify-session";
import { api, HydrateClient } from "@/trpc/server";
import { z } from "zod";
import CollectorTable from "./_components/collector-table";

const paramsSchema = z.object({
  uid: z.string(),
});

export default async function CollectorsPage({
  params,
}: {
  params: Promise<z.input<typeof paramsSchema>>;
}) {
  await verifySession({
    hasRoles: ["admin"],
  });

  const { data: parsedParams, error } = paramsSchema.safeParse(await params);

  if (error) {
    return <NotFoundPageError />;
  }

  void api.collector.listForVenue.prefetch({
    venueUID: parsedParams.uid,
  });

  return (
    <HydrateClient>
      <Card className="mx-auto w-full max-w-6xl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Collectors</CardTitle>
          <CardDescription>
            {`Manage your collectors for venue "${parsedParams.uid}".`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CollectorTable venueUID={parsedParams.uid} />
        </CardContent>
      </Card>
    </HydrateClient>
  );
}
