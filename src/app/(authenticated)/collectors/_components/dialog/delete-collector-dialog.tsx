import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import LoadingButton from "@/components/util/loading-button";
import { type CollectorDTO } from "@/server/db/schema/collector";
import { api } from "@/trpc/react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { toast } from "sonner";

export default function DeleteCollectorDialog({
  collector,
  dialogProps,
}: {
  collector: CollectorDTO;
  dialogProps: DialogProps;
}) {
  const utils = api.useUtils();
  const deleteCollector = api.collector.delete.useMutation({
    onSuccess: () => {
      void utils.collector.list.invalidate();
      toast.success(`Collector ${collector.displayName} deleted`);
    },
    onError: () => {
      toast.error("Failed to delete collector");
    },
  });

  const handleDelete = () => {
    deleteCollector.mutate({ uid: collector.uid });
  };

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete the collector {collector.displayName}. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            isLoading={deleteCollector.isPending}
            onClick={handleDelete}
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
