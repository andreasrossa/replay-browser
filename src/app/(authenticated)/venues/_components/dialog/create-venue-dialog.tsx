"use client";

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
import LoadingButton from "@/components/util/loading-button";
import { type CreateVenueSchema, createVenueSchema } from "@/schemas/venue";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateVenueDialog({
  dialogProps,
}: {
  dialogProps: DialogProps;
}) {
  const utils = api.useUtils();
  const mutation = api.venue.create.useMutation({
    onMutate: async ({ uid, description }) => {
      // cancel any outgoing refetches
      await utils.venue.list.cancel();
      // snapshot the previous value
      const prevData = utils.venue.list.getData();
      // optimistic update
      utils.venue.list.setData(undefined, (prev) => [
        {
          uid,
          description: description ?? null,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...(prev ?? []),
      ]);

      return { prevData };
    },
    onError: (error, _newVenue, ctx) => {
      if (error.data?.zodError) {
        Object.entries(error.data.zodError.fieldErrors).forEach(
          ([field, error]) => {
            form.setError(field as keyof CreateVenueSchema, {
              message: error?.[0],
            });
          },
        );
      } else {
        utils.venue.list.setData(undefined, ctx?.prevData);
        toast.error("Failed to create venue");
      }
    },
    onSuccess: () => {
      void utils.venue.list.invalidate();
      toast.success("Venue created successfully");
      form.reset();
      dialogProps.onOpenChange?.(false);
    },
  });

  const form = useForm<CreateVenueSchema>({
    resolver: zodResolver(createVenueSchema),
    defaultValues: {
      uid: "",
      description: "",
    },
  });

  const onSubmit = (data: CreateVenueSchema) => {
    mutation.mutate({
      uid: data.uid,
      description: data.description,
    });
  };

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new venue</DialogTitle>
          <DialogDescription>
            Create a new venue to start recording your replays.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-venue-form"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="uid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UID *</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    A unique identifier for the venue
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
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
          <LoadingButton
            isLoading={mutation.isPending}
            className="ml-auto"
            type="submit"
            form="create-venue-form"
          >
            Add venue
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
