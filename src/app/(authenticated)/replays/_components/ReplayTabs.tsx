"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { usePhoenixChannel } from "@/hooks/use-phoenix-channel";
import { api } from "@/trpc/react";
import { Suspense, useCallback, useContext } from "react";
import ReplayGrid, { ReplayGridSkeleton } from "./ReplayGrid";
import { PercentageContext } from "./percentage-context";
import { StockContext } from "./stock-context";

export default function ReplayTabs() {
  const utils = api.useUtils();
  const { setPercentage } = useContext(PercentageContext);
  const { setStock } = useContext(StockContext);

  const onEvent = useCallback(
    (event: string, payload: unknown, _ref: string) => {
      if (["replay_started", "replay_ended"].includes(event)) {
        void utils.replay.list.invalidate();
      }

      if (event === "percentage_update") {
        const {
          payload: {
            payload: { percentage, key, character_id },
          },
        } = payload as {
          payload: {
            payload: {
              percentage: number;
              key: string;
              character_id: number;
            };
          };
          collector: string;
        };

        setPercentage(key, character_id, percentage);
      }

      if (event === "stock_update") {
        console.log(payload);
        const {
          payload: {
            payload: { stock, key, character_id },
          },
        } = payload as {
          payload: {
            payload: {
              stock: number;
              key: string;
              character_id: number;
            };
          };
          collector: string;
        };

        setStock(key, character_id, stock);
      }
    },
    [setPercentage, setStock, utils],
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
