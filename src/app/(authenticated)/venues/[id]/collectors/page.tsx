import NotFoundPageError from "@/components/util/error/NotFoundPageError";
import { verifySession } from "@/lib/verify-session";
import { z } from "zod";

const paramsSchema = z.object({
  id: z.coerce.number(),
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

  return <div>CollectorsPage for Venue #{parsedParams.id}</div>;
}
