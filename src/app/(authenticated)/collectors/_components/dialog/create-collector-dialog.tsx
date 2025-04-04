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
  createCollectorSchema,
  type CreateCollectorSchemaInput,
} from "@/schemas/collector";
import { type CollectorDTO } from "@/server/db/schema";
import { api } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type DialogProps } from "@radix-ui/react-dialog";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function CreateCollectorDialog({
  dialogProps,
  onCreated,
}: {
  dialogProps: DialogProps;
  onCreated?: ({
    token,
    collector,
  }: {
    token: string;
    collector: CollectorDTO;
  }) => void;
}) {
  const utils = api.useUtils();
  const mutation = api.collector.create.useMutation({
    onError: (error, _) => {
      if (error.data?.zodError) {
        Object.entries(error.data.zodError.fieldErrors).forEach(
          ([field, error]) => {
            form.setError(field as keyof CreateCollectorSchemaInput, {
              message: error?.[0],
            });
          },
        );
      } else {
        toast.error("Failed to create collector");
      }
    },
    onSuccess: (res) => {
      void utils.collector.list.refetch();
      toast.success("Collector created successfully");
      form.reset();
      dialogProps.onOpenChange?.(false);
      setTimeout(() => {
        onCreated?.({
          token: res.token,
          collector: res.collector,
        });
      }, 100);
    },
  });

  const form = useForm<CreateCollectorSchemaInput>({
    resolver: zodResolver(createCollectorSchema),
    defaultValues: {
      uid: "",
      displayName: "",
    },
  });

  const onSubmit = (data: CreateCollectorSchemaInput) => {
    mutation.mutate({
      uid: data.uid,
      displayName: data.displayName,
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
                    A unique identifier for the collector.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="displayName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Display Name</FormLabel>
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
