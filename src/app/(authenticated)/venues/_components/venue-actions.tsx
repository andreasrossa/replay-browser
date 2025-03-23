"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialog } from "@/hooks/use-dialog";
import { type VenueDTO } from "@/server/db/schema";
import { PencilIcon, TrashIcon } from "lucide-react";
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

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent side={side}>
          <DropdownMenuItem onSelect={editDialog.trigger}>
            <PencilIcon className="h-3 w-3" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem className="text-red-500">
            <TrashIcon className="h-3 w-3" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <EditVenueDialog venueUID={venue.uid} dialogProps={editDialog.props} />
    </>
  );
}
