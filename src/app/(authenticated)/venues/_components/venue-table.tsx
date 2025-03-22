"use client";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc/react";
import {
  createColumnHelper,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontalIcon, PlusIcon } from "lucide-react";
import { useMemo } from "react";
import CreateVenueDialog from "./create-venue-dialog";
import VenueActions from "./venue-actions";
import { VenueDTO } from "@/server/db/schema";

const columnHelper = createColumnHelper<VenueDTO>();

export default function VenueTable() {
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
            <VenueActions venue={row.original}>
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
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between">
        <Input placeholder="Search" className="w-[250px]" />
        <CreateVenueDialog>
          <Button>
            <PlusIcon /> Add Venue
          </Button>
        </CreateVenueDialog>
      </div>
      <DataTable table={table} />
    </div>
  );
}
