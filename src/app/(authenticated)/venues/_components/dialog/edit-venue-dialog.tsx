"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  editVenueClientSchema,
  type EditVenueClientSchema,
} from "@/schemas/venue";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditVenueDialog({
  venueUID,
  dialogProps,
}: {
  venueUID: string;
  dialogProps: DialogProps;
}) {
  const utils = api.useUtils();
  const mutation = api.venue.editDescription.useMutation({
    onMutate: async ({ uid, description }) => {
      // cancel any outgoing refetches
      await utils.venue.list.cancel();
      // snapshot the previous value
      const prevData = utils.venue.list.getData();
      // optimistic update
      utils.venue.list.setData(undefined, (prev) => {
        return (
          prev?.map((venue) => {
            if (venue.uid === uid) {
              return { ...venue, description: description ?? null };
            }
            return venue;
          }) ?? []
        );
      });

      return { prevData };
    },
    onError: (error, _newVenue, ctx) => {
      if (error.data?.zodError) {
        Object.entries(error.data.zodError.fieldErrors).forEach(
          ([field, error]) => {
            form.setError(field as keyof EditVenueClientSchema, {
              message: error?.[0],
            });
          },
        );
      } else {
        utils.venue.list.setData(undefined, ctx?.prevData);
        toast.error("Failed to update venue");
      }
    },
    onSuccess: () => {
      void utils.venue.list.invalidate();
      toast.success("Venue updated successfully");
      form.reset();
      dialogProps.onOpenChange?.(false);
    },
  });

  const form = useForm<EditVenueClientSchema>({
    resolver: zodResolver(editVenueClientSchema),
    defaultValues: {
      description: "",
    },
  });

  const onSubmit = (data: EditVenueClientSchema) => {
    mutation.mutate({
      uid: venueUID,
      description: data.description,
    });
  };

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Venue {venueUID}</DialogTitle>
          <DialogDescription>
            Edit the description of the venue.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-venue-form"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    A description for the venue (optional)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <Button
            disabled={mutation.isPending}
            className="ml-auto"
            type="submit"
            form="edit-venue-form"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Updating...
              </>
            ) : (
              "Update Venue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
