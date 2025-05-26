"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePhoenixChannel } from "@/hooks/use-phoenix-channel";
import { api } from "@/trpc/react";
import { Suspense, useCallback, useContext } from "react";
import ReplayGrid, { ReplayGridSkeleton } from "./ReplayGrid";
import { CharacterStateContext } from "./character-state-context";

export default function ReplayTabs() {
  const utils = api.useUtils();
  const { setCharacterState } = useContext(CharacterStateContext);

  const onEvent = useCallback(
    (event: string, payload: unknown, _ref: string) => {
      if (["replay_started", "replay_ended"].includes(event)) {
        void utils.replay.list.invalidate();
      }

      if (event === "character_state_update") {
        const {
          payload: newCharacterState,
          character_id,
          key,
        } = payload as {
          payload: {
            stocks: number;
            percent: number;
          };
          collector: string;
          character_id: number;
          key: string;
        };

        setCharacterState(key, character_id, newCharacterState);
      }
    },
    [setCharacterState, utils],
  );

  usePhoenixChannel("replays:lobby", onEvent);

  return (
    <Tabs defaultValue="all">
      <TabsList>
        <TabsTrigger value="all">All</TabsTrigger>
        <TabsTrigger value="live">Live</TabsTrigger>
        <TabsTrigger value="finished">Finished</TabsTrigger>
      </TabsList>
      <TabsContent value="all">
        <LoadingWrapper>
          <ReplayGrid />
        </LoadingWrapper>
      </TabsContent>
      <TabsContent value="live">
        <LoadingWrapper>
          <ReplayGrid status="live" />
        </LoadingWrapper>
      </TabsContent>
      <TabsContent value="finished">
        <LoadingWrapper>
          <ReplayGrid status="finished" />
        </LoadingWrapper>
      </TabsContent>
    </Tabs>
  );
}

function LoadingWrapper({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<ReplayGridSkeleton />}>{children}</Suspense>;
}
