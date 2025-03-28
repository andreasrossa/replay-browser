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
  token: text("token").notNull(),
  tokenExpiresAt: timestamp("token_expires_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type CollectorDTO = Omit<typeof collector.$inferSelect, "token">;
