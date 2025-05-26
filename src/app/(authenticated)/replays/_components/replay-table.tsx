"use client";

import { DataTable } from "@/components/ui/data-table";
import { type ReplayDTO } from "@/server/db/schema";
import { api } from "@/trpc/react";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { formatDuration, intervalToDuration } from "date-fns";
import { useMemo } from "react";

const columnHelper = createColumnHelper<ReplayDTO>();

export default function ReplayTable() {
  const columns = useMemo(
    () => [
      columnHelper.accessor("startedAt", {
        header: "Started At",
        cell: ({ getValue }) =>
          getValue() ? new Date(getValue()).toLocaleString("de-DE") : "Never",
      }),
      columnHelper.display({
        header: "Duration",
        cell: ({ row }) => {
          const frameCount = row.original.frameCount;
          if (!frameCount) {
            return "Ongoing";
          }

          const seconds = Math.floor(frameCount / 60);

          const duration = intervalToDuration({
            start: 0,
            end: seconds * 1000,
          });

          return formatDuration(duration, {
            format: ["minutes", "seconds"],
          });
        },
      }),

      columnHelper.accessor("stageId", {
        header: "Stage ID",
      }),
    ],
    [],
  );

  const [data] = api.replay.list.useSuspenseQuery({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return <DataTable table={table} />;
}
