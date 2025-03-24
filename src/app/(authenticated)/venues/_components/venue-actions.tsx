"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialog } from "@/hooks/use-dialog";
import { type VenueDTO } from "@/server/db/schema";
import { CpuIcon, PencilIcon, TrashIcon } from "lucide-react";
import Link from "next/link";
import DeleteVenueDialog from "./dialog/delete-venue-dialog";
import EditVenueDialog from "./dialog/edit-venue-dialog";

export default function VenueActions({
  venue,
  children,
  side = "left",
}: {
  venue: VenueDTO;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}) {
  const editDialog = useDialog();
  const deleteDialog = useDialog();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent side={side}>
          <DropdownMenuItem asChild>
            <Link href={`/venues/${venue.uid}/collectors`}>
              <CpuIcon className="h-3 w-3" />
              Collectors
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={editDialog.trigger}>
            <PencilIcon className="h-3 w-3" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-red-500"
            onSelect={deleteDialog.trigger}
          >
            <TrashIcon className="h-3 w-3" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditVenueDialog venueUID={venue.uid} dialogProps={editDialog.props} />
      <DeleteVenueDialog
        venueUID={venue.uid}
        dialogProps={deleteDialog.props}
      />
    </>
  );
}
