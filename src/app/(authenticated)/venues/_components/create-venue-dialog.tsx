"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
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
import { api } from "@/trpc/react";
import { HydrateClient } from "@/trpc/server";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const venueSchema = z.object({
  uid: z
    .string()
    .min(3, "UID must be at least 3 characters long")
    .regex(
      /^[a-zA-Z0-9-_]+$/,
      "Only letters, numbers, dashes and underscores are allowed",
    ),
  description: z.string().optional(),
});

export default function CreateVenueDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
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
            form.setError(field as keyof z.infer<typeof venueSchema>, {
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
      setOpen(false);
    },
  });

  const form = useForm<z.infer<typeof venueSchema>>({
    resolver: zodResolver(venueSchema),
    defaultValues: {
      uid: "",
      description: "",
    },
  });

  const onSubmit = (data: z.infer<typeof venueSchema>) => {
    mutation.mutate({
      uid: data.uid,
      description: data.description,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
          <Button
            disabled={mutation.isPending}
            className="ml-auto"
            type="submit"
            form="create-venue-form"
          >
            {mutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Adding...
              </>
            ) : (
              "Add Venue"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
