import { verifySession } from "@/lib/verify-session";
import { api, HydrateClient } from "@/trpc/server";
import ReplayTabs from "./_components/ReplayTabs";
import { CharacterStateProvider } from "./_components/character-state-context";

export default async function ReplaysPage() {
  await verifySession();

  void api.replay.list.prefetch({});

  return (
    <HydrateClient>
      <CharacterStateProvider>
        <ReplayTabs />
      </CharacterStateProvider>
    </HydrateClient>
  );
}
