"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialog } from "@/hooks/use-dialog";
import { type CollectorDTO } from "@/server/db/schema/collector";
import { KeyIcon, TrashIcon } from "lucide-react";

export default function CollectorActions({
  collector: _collector,
  children,
  side = "left",
}: {
  collector: CollectorDTO;
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
          <DropdownMenuItem onSelect={editDialog.trigger}>
            <KeyIcon className="h-3 w-3" />
            Regenerate Secret
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
    </>
  );
}
