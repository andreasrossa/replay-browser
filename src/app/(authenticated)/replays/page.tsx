import { api, HydrateClient } from "@/trpc/server";
import { auth } from "@clerk/nextjs/server";
import ReplayTabs from "./_components/ReplayTabs";
import { CharacterStateProvider } from "./_components/character-state-context";

export default async function ReplaysPage() {
  await auth.protect();

  void api.replay.list.prefetch({});

  return (
    <HydrateClient>
      <CharacterStateProvider>
        <ReplayTabs />
      </CharacterStateProvider>
    </HydrateClient>
  );
}
