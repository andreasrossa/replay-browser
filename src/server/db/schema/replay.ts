import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { collector } from "./collector";

export const replay = pgTable(
  "replay",
  {
    id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
    key: text("key").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date(),
    ),
    startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
    frameCount: integer("frame_count"),
    stageId: integer("stage_id"),
    characterIds: integer("character_ids").array().notNull(),
    fileURL: text("file_url"),
    isFinished: boolean("is_finished").notNull().default(false),
    collectorUID: text("collector_uid")
      .notNull()
      .references(() => collector.uid, { onDelete: "cascade" }),
  },
  (t) => [
    check("character_ids_length", sql`array_length(${t.characterIds}, 1) = 2`),
    index("key_idx").on(t.key),
  ],
);

export type ReplayDTO = typeof replay.$inferSelect;
