import { z } from "zod";

import { createTRPCRouter, protectedVenueProcedure } from "@/server/api/trpc";
import { replay } from "@/server/db/schema";

export const replayRouter = createTRPCRouter({
  start: protectedVenueProcedure
    .input(
      z.object({
        startedAt: z.coerce.date(),
        stageId: z.number(),
        characterIds: z.array(z.number()),
      }),
    )
    .mutation(async ({ ctx: { db, venue }, input }) => {
      const [startedReplay] = await db
        .insert(replay)
        .values({
          startedAt: input.startedAt,
          stageId: input.stageId,
          characterIds: input.characterIds,
          venueId: venue.id,
        })
        .returning({ id: replay.id });

      return startedReplay;
    }),
});
