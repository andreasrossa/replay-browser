import { verifySession } from "@/lib/verify-session";

export default async function ReplaysPage() {
  await verifySession();

  return (
    <div>
      <h1>Replays</h1>
    </div>
  );
}
