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

export default function RegenerateCollectorTokenDialog({
  collector,
  dialogProps,
}: {
  collector: CollectorDTO;
  dialogProps: DialogProps;
}) {
  const utils = api.useUtils();
  const regenerateToken = api.collector.regenerateToken.useMutation({
    onSuccess: () => {
      void utils.collector.list.invalidate();
      toast.success(`Collector ${collector.displayName} token regenerated`);
    },
    onError: () => {
      toast.error("Failed to regenerate collector token");
    },
  });

  const handleRegenerate = () => {
    regenerateToken.mutate({ uid: collector.uid });
  };

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to regenerate the collector {collector.displayName}
            token. This will invalidate the current token and generate a new
            one.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            isLoading={regenerateToken.isPending}
            onClick={handleRegenerate}
          >
            Regenerate
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
