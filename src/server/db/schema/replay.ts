import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { collector } from "./collector";

export const replay = pgTable("replay", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  frameCount: integer("frame_count"),
  stageId: integer("stage_id").notNull(),
  characterIds: integer("character_ids").array().notNull(),
  fileId: text("file_id").notNull(),
  collectorUID: text("collector_uid")
    .notNull()
    .references(() => collector.uid, { onDelete: "cascade" }),
});

export type ReplayDTO = typeof replay.$inferSelect;
