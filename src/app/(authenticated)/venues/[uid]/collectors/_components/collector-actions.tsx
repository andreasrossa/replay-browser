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

/**
 * Renders a dropdown menu with actions to manage a collector.
 *
 * This component displays a dropdown menu with two actions: one to regenerate the collector's secret (triggering an edit dialog) and another to delete the collector (triggering a delete dialog). The dropdown's position can be customized via the `side` prop.
 *
 * @param collector - The collector entity for which the actions are provided.
 * @param children - The element used as the trigger for displaying the dropdown menu.
 * @param side - Optional position of the dropdown menu relative to the trigger (default is "left").
 */
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
