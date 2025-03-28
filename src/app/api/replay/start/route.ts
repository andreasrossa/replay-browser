import { createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { getHTTPStatusCodeFromError } from "@trpc/server/unstable-core-do-not-import";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const ctx = await createTRPCContext({ headers: request.headers });
  const caller = createCaller(ctx);

  try {
    const formData = await request.formData();
    const replay = await caller.replay.start(formData);
    return NextResponse.json(replay);
  } catch (cause) {
    if (cause instanceof TRPCError) {
      const status = getHTTPStatusCodeFromError(cause);
      return NextResponse.json(cause.message, { status });
    }

    console.error(cause);
    return NextResponse.json("Internal Server Error", { status: 500 });
  }
}
