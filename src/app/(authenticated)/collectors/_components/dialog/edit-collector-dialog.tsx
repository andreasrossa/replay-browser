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
  editCollectorSchema,
  type EditCollectorSchemaInput,
} from "@/schemas/collector";
import { type CollectorDTO } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function EditCollectorDialog({
  dialogProps,
  collector,
}: {
  dialogProps: DialogProps;
  collector: CollectorDTO;
}) {
  const utils = api.useUtils();
  const mutation = api.collector.update.useMutation({
    onMutate: async ({ uid, displayName }) => {
      // cancel any outgoing refetches
      await utils.collector.list.cancel();
      // snapshot the previous value
      const prevData = utils.collector.list.getData();
      // optimistic update
      utils.collector.list.setData(undefined, (prev) => {
        return prev?.map((collector) =>
          collector.uid === uid ? { ...collector, displayName } : collector,
        );
      });

      return { prevData };
    },
    onError: (error, _, ctx) => {
      if (error.data?.zodError) {
        Object.entries(error.data.zodError.fieldErrors).forEach(
          ([field, error]) => {
            form.setError(field as keyof EditCollectorSchemaInput, {
              message: error?.[0],
            });
          },
        );
      } else {
        utils.collector.list.setData(undefined, ctx?.prevData);
        toast.error("Failed to update collector");
      }
    },
    onSuccess: () => {
      void utils.collector.list.invalidate();
      toast.success("Collector updated successfully");
      form.reset();
      dialogProps.onOpenChange?.(false);
    },
  });

  const form = useForm<EditCollectorSchemaInput>({
    resolver: zodResolver(editCollectorSchema),
    defaultValues: {
      displayName: collector.displayName,
    },
  });

  const onSubmit = (data: EditCollectorSchemaInput) => {
    mutation.mutate({
      uid: collector.uid,
      displayName: data.displayName,
    });
  };

  return (
    <Dialog {...dialogProps}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit collector</DialogTitle>
          <DialogDescription>
            Edit the display name of the collector {collector.displayName}.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            id="edit-collector-form"
            className="space-y-4"
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    The display name of the collector.
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
            form="edit-collector-form"
          >
            Update
          </LoadingButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
