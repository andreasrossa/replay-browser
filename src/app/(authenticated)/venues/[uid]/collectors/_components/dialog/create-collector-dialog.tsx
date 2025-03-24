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
import {
  createCollectorPublicSchema,
  type CreateCollectorPublicSchema,
} from "@/schemas/collector";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateCollectorDialog({
  venueUID,
  dialogProps,
}: {
  venueUID: string;
  dialogProps: DialogProps;
}) {
  const utils = api.useUtils();
  const mutation = api.collector.create.useMutation({
    onMutate: async ({ venueUID, uid, description }) => {
      // cancel any outgoing refetches
      await utils.collector.listForVenue.cancel({
        venueUID,
      });
      // snapshot the previous value
      const prevData = utils.collector.listForVenue.getData({
        venueUID,
      });
      // optimistic update
      utils.collector.listForVenue.setData({ venueUID }, (prev) => [
        {
          uid,
          description: description ?? null,
          venueUID,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        ...(prev ?? []),
      ]);

      return { prevData };
    },
    onError: (error, { venueUID }, ctx) => {
      if (error.data?.zodError) {
        Object.entries(error.data.zodError.fieldErrors).forEach(
          ([field, error]) => {
            form.setError(field as keyof CreateCollectorPublicSchema, {
              message: error?.[0],
            });
          },
        );
      } else {
        utils.collector.listForVenue.setData({ venueUID }, ctx?.prevData);
        toast.error("Failed to create collector");
      }
    },
    onSuccess: (data) => {
      void utils.collector.listForVenue.invalidate({
        venueUID: data?.venueUID,
      });
      toast.success("Collector created successfully");
      form.reset();
      dialogProps.onOpenChange?.(false);
    },
  });

  const form = useForm<CreateCollectorPublicSchema>({
    resolver: zodResolver(createCollectorPublicSchema),
    defaultValues: {
      uid: "",
      description: "",
    },
  });

  const onSubmit = (data: CreateCollectorPublicSchema) => {
    mutation.mutate({
      venueUID,
      uid: data.uid,
      description: data.description,
    });
  };

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new collector</DialogTitle>
          <DialogDescription>
            Create a new collector to start recording your replays.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="create-collector-form"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="uid"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>UID</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The UID is a unique identifier for the collector.
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
                  <FormLabel>Description (optional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
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
            form="create-collector-form"
          >
            Add collector
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
