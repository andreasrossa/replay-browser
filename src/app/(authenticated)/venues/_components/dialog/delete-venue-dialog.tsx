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
import { api } from "@/trpc/react";
import { type DialogProps } from "@radix-ui/react-dialog";
import { toast } from "sonner";

export default function DeleteVenueDialog({
  venueUID,
  dialogProps,
}: {
  venueUID: string;
  dialogProps: DialogProps;
}) {
  const utils = api.useUtils();

  const mutation = api.venue.delete.useMutation({
    onError: () => {
      toast.error("Failed to delete venue");
    },
    onSuccess: () => {
      void utils.venue.list.invalidate();
      toast.success("Venue deleted successfully");
      dialogProps.onOpenChange?.(false);
    },
  });

  const handleDelete = () => {
    mutation.mutate({ uid: venueUID });
  };

  return (
    <AlertDialog {...dialogProps}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            {`This will delete the venue '${venueUID}' and all associated data.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <LoadingButton
            variant="destructive"
            onClick={handleDelete}
            isLoading={mutation.isPending}
          >
            Delete
          </LoadingButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
