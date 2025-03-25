import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const collector = pgTable("collector", {
  uid: text("uid").primaryKey(),
  displayName: text("display_name").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
    () => new Date(),
  ),
  secret: text("secret").notNull(),
});

export type CollectorDTO = Omit<typeof collector.$inferSelect, "secret">;
