import type { PgColumn, PgSelect } from "drizzle-orm/pg-core";
import type { SQL } from "drizzle-orm/sql";

export function withPagination<T extends PgSelect>(
  qb: T,
  orderByColumn: PgColumn | SQL | SQL.Aliased,
  page = 0,
  pageSize = 10,
) {
  return qb
    .orderBy(orderByColumn)
    .limit(pageSize)
    .offset(page * pageSize);
}
