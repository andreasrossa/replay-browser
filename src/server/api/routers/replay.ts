import { z } from "zod";

import {
  createTRPCRouter,
  protectedCollectorProcedure,
} from "@/server/api/trpc";
import { replay } from "@/server/db/schema";

export const replayRouter = createTRPCRouter({
  start: protectedCollectorProcedure
    .input(
      z.object({
        startedAt: z.coerce.date(),
        stageId: z.number(),
        characterIds: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx: { db, collector }, input }) => {
      const [startedReplay] = await db
        .insert(replay)
        .values({
          startedAt: input.startedAt,
          stageId: input.stageId,
          characterIds: input.characterIds,
          collectorUID: collector.uid,
        })
        .returning({ id: replay.id });

      return startedReplay;
    }),
});
