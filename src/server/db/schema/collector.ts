import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { venue } from "./venue";

export const collector = pgTable("collector", {
  collector: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  startedAt: timestamp("started_at", { withTimezone: true }).notNull(),
  frameCount: integer("frame_count"),
  stageId: integer("stage_id").notNull(),
  characterIds: integer("character_ids").array().notNull(),
  replayFileUrl: text("replay_file_url"),
  venueUid: text("venue_uid")
    .notNull()
    .references(() => venue.uid, { onDelete: "cascade" }),
});

export type CollectorDTO = typeof collector.$inferSelect;
