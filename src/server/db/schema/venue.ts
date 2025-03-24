import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const venue = pgTable("venue", {
  uid: text("uid").primaryKey(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export type VenueDTO = Omit<typeof venue.$inferSelect, "secret">;
