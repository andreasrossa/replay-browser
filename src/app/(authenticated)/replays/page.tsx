import { verifySession } from "@/lib/verify-session";
import { api, HydrateClient } from "@/trpc/server";
import ReplayTabs from "./_components/ReplayTabs";
import { PercentageProvider } from "./_components/percentage-context";
import { StockProvider } from "./_components/stock-context";

export default async function ReplaysPage() {
  await verifySession();

  void api.replay.list.prefetch({});

  return (
    <HydrateClient>
      <StockProvider>
        <PercentageProvider>
          <ReplayTabs />
        </PercentageProvider>
      </StockProvider>
    </HydrateClient>
  );
}
