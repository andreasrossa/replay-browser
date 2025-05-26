import {
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { collector } from "./collector";

export type Player = {
  characterId: number;
  tag?: string;
  skin: number;
};

export type ReplayStatus = "live" | "finished" | "error";

export const replay = pgTable(
  "replay",
  {
    key: text("key").notNull().primaryKey(),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    frameCount: integer("frame_count"),
    stageId: integer("stage_id").notNull(),
    player1: jsonb("player1").notNull().$type<Player>(),
    player2: jsonb("player2").notNull().$type<Player>(),
    fileURL: text("file_url"),
    status: text("status").notNull().default("live").$type<ReplayStatus>(),
    collectorUID: text("collector_uid")
      .notNull()
      .references(() => collector.uid, { onDelete: "cascade" }),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => [index("key_idx").on(t.key)],
);

export type ReplayDTO = typeof replay.$inferSelect;
