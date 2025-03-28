"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useDialog } from "@/hooks/use-dialog";
import { type CollectorDTO } from "@/server/db/schema/collector";
import { KeyIcon, PencilIcon, TrashIcon } from "lucide-react";
import DeleteCollectorDialog from "./dialog/delete-collector-dialog";
import EditCollectorDialog from "./dialog/edit-collector-dialog";
import RegenerateCollectorTokenDialog from "./dialog/regenerate-collector-token-dialog";

export default function CollectorActions({
  collector,
  children,
  side = "left",
}: {
  collector: CollectorDTO;
  children: React.ReactNode;
  side?: "left" | "right" | "top" | "bottom";
}) {
  const editDialog = useDialog();
  const deleteDialog = useDialog();
  const regenerateTokenDialog = useDialog();

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent side={side}>
          <DropdownMenuItem onSelect={editDialog.trigger}>
            <PencilIcon className="h-3 w-3" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={regenerateTokenDialog.trigger}>
            <KeyIcon className="h-3 w-3" />
            Regenerate Token
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-red-500"
            onSelect={deleteDialog.trigger}
          >
            <TrashIcon className="h-3 w-3" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCollectorDialog
        dialogProps={deleteDialog.props}
        collector={collector}
      />
      <EditCollectorDialog
        dialogProps={editDialog.props}
        collector={collector}
      />
      <RegenerateCollectorTokenDialog
        dialogProps={regenerateTokenDialog.props}
        collector={collector}
      />
    </>
  );
}
