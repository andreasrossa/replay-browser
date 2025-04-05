import { sql } from "drizzle-orm";
import { check, index, pgTable, text } from "drizzle-orm/pg-core";
import { collector } from "./collector";

export const wii = pgTable(
  "wii",
  {
    macAddress: text("mac_address").primaryKey(),
    nickname: text("nickname").notNull(),
    ipAddress: text("ip_address").notNull(),
    collectorUID: text("collector_uid")
      .notNull()
      .references(() => collector.uid, { onDelete: "cascade" }),
  },
  (table) => [
    check(
      "ip_address_is_valid",
      sql`${table.ipAddress} ~* '^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$'`,
    ),
    check(
      "mac_address_is_valid",
      sql`${table.macAddress} ~* '^([0-9A-Fa-f]{2}:){5}([0-9A-Fa-f]{2})$'`,
    ),
    index("collector_uid_idx").on(table.collectorUID),
  ],
);
