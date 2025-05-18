import { env } from "@/env";
import {
  createCollectorSchema,
  editCollectorServerSchema,
} from "@/schemas/collector";
import {
  adminProcedure,
  createTRPCRouter,
  protectedCollectorProcedure,
} from "@/server/api/trpc";
import { collector } from "@/server/db/schema/collector";
import {
  generateCollectorToken,
  hashCollectorToken,
} from "@/server/utils/collector-token";
import { generateIngestorToken } from "@/server/utils/ingestor-token";
import { TRPCError } from "@trpc/server";
import { desc, eq } from "drizzle-orm";
import { z } from "zod";

const publicValueSelect = {
  uid: true,
  displayName: true,
  createdAt: true,
  updatedAt: true,
  tokenExpiresAt: true,
} as const;

export const collectorRouter = createTRPCRouter({
  list: adminProcedure.query(async ({ ctx: { db } }) => {
    const collectors = await db.query.collector.findMany({
      columns: publicValueSelect,
      orderBy: [desc(collector.createdAt)],
    });

    return collectors;
  }),
  create: adminProcedure
    .input(createCollectorSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      const exists = await db.query.collector.findFirst({
        where: eq(collector.uid, input.uid),
      });

      if (exists) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collector already exists",
        });
      }

      const token = generateCollectorToken();
      const hashedToken = hashCollectorToken(token);
      const [createdCollector] = await db
        .insert(collector)
        .values({
          uid: input.uid,
          displayName: input.displayName,
          token: hashedToken,
        })
        .returning();

      if (!createdCollector) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create collector",
        });
      }

      return {
        token,
        collector: createdCollector,
      };
    }),
  update: adminProcedure
    .input(editCollectorServerSchema)
    .mutation(async ({ ctx: { db }, input }) => {
      const collectorToUpdate = await db.query.collector.findFirst({
        where: eq(collector.uid, input.uid),
      });

      if (!collectorToUpdate) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collector not found",
        });
      }

      try {
        const [updatedCollector] = await db
          .update(collector)
          .set({ displayName: input.displayName })
          .where(eq(collector.uid, input.uid))
          .returning();

        if (!updatedCollector) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Failed to update collector",
          });
        }

        return updatedCollector;
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update collector",
        });
      }
    }),
  regenerateToken: adminProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      const collectorToRegenerateToken = await db.query.collector.findFirst({
        where: eq(collector.uid, input.uid),
      });

      if (!collectorToRegenerateToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collector not found",
        });
      }

      try {
        const newToken = generateCollectorToken();
        const hashedToken = hashCollectorToken(newToken);

        const [updatedCollector] = await db
          .update(collector)
          .set({
            token: hashedToken,
            tokenExpiresAt: new Date(
              Date.now() + env.COLLECTOR_TOKEN_EXPIRATION_TIME_SECONDS * 1000,
            ),
          })
          .where(eq(collector.uid, input.uid))
          .returning();

        if (!updatedCollector) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Collector not found",
          });
        }

        return {
          token: newToken,
          tokenExpiresAt: updatedCollector.tokenExpiresAt,
        };
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to regenerate collector token",
        });
      }
    }),
  delete: adminProcedure
    .input(z.object({ uid: z.string() }))
    .mutation(async ({ ctx: { db }, input }) => {
      const collectorToDelete = await db.query.collector.findFirst({
        where: eq(collector.uid, input.uid),
      });

      if (!collectorToDelete) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Collector not found",
        });
      }

      try {
        await db.delete(collector).where(eq(collector.uid, input.uid));
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete collector",
        });
      }
    }),
  getIngestorToken: protectedCollectorProcedure.query(
    async ({
      ctx: {
        collector: { uid: collectorUID },
      },
    }) => {
      return generateIngestorToken(collectorUID);
    },
  ),
});
