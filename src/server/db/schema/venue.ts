import { index, text, timestamp, pgTable } from "drizzle-orm/pg-core";

export const venue = pgTable(
  "venue",
  {
    uid: text("uid").primaryKey(),
    description: text("description"),
    secret: text("secret").notNull(),
    createdAt: timestamp("created_at").notNull(),
    updatedAt: timestamp("updated_at").notNull(),
  },
  (table) => {
    return {
      secretIdx: index("venue_secret_idx").on(table.secret),
    };
  },
);

export type VenueDTO = Omit<typeof venue.$inferSelect, "secret">;
