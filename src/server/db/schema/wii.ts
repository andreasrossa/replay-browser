import { pgTable, text } from "drizzle-orm/pg-core";
import { collector } from "./collector";

export const wii = pgTable("wii", {
  macAddress: text("mac_address").primaryKey(),
  nickname: text("nickname").notNull(),
  ipAddress: text("ip_address").notNull(),
  collectorUID: text("collector_uid")
    .notNull()
    .references(() => collector.uid, { onDelete: "cascade" }),
});
