import { type AppRouter, createCaller } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  getHTTPStatusCodeFromError,
  type inferProcedureInput,
} from "@trpc/server/unstable-core-do-not-import";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const ctx = await createTRPCContext({ headers: request.headers });
  const caller = createCaller(ctx);

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const metadata = formData.get("metadata") as string | null;

    if (!metadata) {
      return NextResponse.json("Metadata is required", { status: 400 });
    }

    if (!file) {
      return NextResponse.json("File is required", { status: 400 });
    }

    const body = JSON.parse(metadata) as inferProcedureInput<
      AppRouter["replay"]["start"]
    >;

    const replay = await caller.replay.start({ ...body, file });
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
