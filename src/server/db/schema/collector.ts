import { pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { venue } from "./venue";

export const collector = pgTable("collector", {
  uid: text("uid").primaryKey(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  secret: text("secret").notNull(),
  venueUID: text("venue_uid")
    .notNull()
    .references(() => venue.uid, { onDelete: "cascade" }),
});

export type CollectorDTO = Omit<typeof collector.$inferSelect, "secret">;
