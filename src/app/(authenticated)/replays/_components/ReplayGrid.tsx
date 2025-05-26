"use client";

import { type ReplayStatus } from "@/server/db/schema";
import { api } from "@/trpc/react";
import ReplayCard, { ReplayCardSkeleton } from "./ReplayCard";

export default function ReplayGrid({ status }: { status?: ReplayStatus }) {
  const [replays] = api.replay.list.useSuspenseQuery({
    status,
  });

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {replays.map((replay) => (
        <ReplayCard key={replay.key} replay={replay} />
      ))}
    </div>
  );
}

export function ReplayGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 3 }).map((_, index) => (
        <ReplayCardSkeleton key={index} />
      ))}
    </div>
  );
}
