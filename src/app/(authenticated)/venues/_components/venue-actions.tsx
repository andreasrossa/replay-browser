"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VenueDTO } from "@/server/db/schema";
import { PencilIcon } from "lucide-react";

export default function VenueActions({
  venue,
  children,
  side = "left",
}: {
  venue: VenueDTO;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent side={side}>
        <DropdownMenuItem>
          <PencilIcon className="h-3 w-3" />
          Edit
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
