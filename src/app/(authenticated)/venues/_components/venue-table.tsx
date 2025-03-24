"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { useDialog } from "@/hooks/use-dialog";
import type { VenueDTO } from "@/server/db/schema";
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
import CreateVenueDialog from "./dialog/create-venue-dialog";
import VenueActions from "./venue-actions";

const columnHelper = createColumnHelper<VenueDTO>();

export default function VenueTable() {
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
            <VenueActions venue={row.original} side="bottom">
              <Button variant="ghost" size="icon">
                <MoreHorizontalIcon className="h-3 w-3" />
              </Button>
            </VenueActions>
          </div>
        ),
      }),
    ],
    [],
  );

  const [data] = api.venue.list.useSuspenseQuery();

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

  const createVenueDialog = useDialog();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Input
          placeholder="Search"
          className="max-w-[250px]"
          onChange={(e) => setGlobalFilter(e.target.value)}
          value={globalFilter}
        />
        <Button onClick={createVenueDialog.trigger}>
          <PlusIcon /> Add Venue
        </Button>
      </div>
      <DataTable table={table} />
      <CreateVenueDialog dialogProps={createVenueDialog.props} />
    </div>
  );
}
