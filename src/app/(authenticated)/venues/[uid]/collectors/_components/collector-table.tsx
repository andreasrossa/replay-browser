"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useDialog } from "@/hooks/use-dialog";
import { type CollectorDTO } from "@/server/db/schema/collector";
import { api } from "@/trpc/react";
import {
  createColumnHelper,
  getCoreRowModel,
  getFilteredRowModel,
  type Updater,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { useMemo, useState } from "react";
import CollectorActions from "./collector-actions";
import CreateCollectorDialog from "./dialog/create-collector-dialog";

const columnHelper = createColumnHelper<CollectorDTO>();

export default function CollectorTable({ venueUID }: { venueUID: string }) {
  const [globalFilter, setGlobalFilter] = useState("");

  const columns = useMemo(
    () => [
      columnHelper.accessor("uid", {
        header: "UID",
      }),
      columnHelper.accessor("description", {
        header: "Description",
      }),
      columnHelper.accessor("createdAt", {
        header: "Created At",
        cell: ({ getValue }) => getValue().toLocaleString("de-DE"),
      }),
      columnHelper.display({
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <div className="flex justify-end">
            <CollectorActions collector={row.original} side="bottom">
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon className="h-3 w-3" />
              </Button>
            </CollectorActions>
          </div>
        ),
      }),
    ],
    [],
  );

  const [data] = api.collector.listForVenue.useSuspenseQuery({
    venueUID,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableGlobalFilter: true,
    state: {
      globalFilter,
    },
    onGlobalFilterChange: (updater: Updater<string>) => {
      setGlobalFilter(
        typeof updater === "function" ? updater(globalFilter) : updater,
      );
    },
  });

  const createCollectorDialog = useDialog();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search"
          className="max-w-[250px]"
          onChange={(e) => setGlobalFilter(e.target.value)}
          value={globalFilter}
        />
        <Button onClick={createCollectorDialog.trigger}>
          <PlusIcon /> Add Collector
        </Button>
      </div>
      <DataTable table={table} />
      <CreateCollectorDialog
        dialogProps={createCollectorDialog.props}
        venueUID={venueUID}
      />
    </div>
  );
}
