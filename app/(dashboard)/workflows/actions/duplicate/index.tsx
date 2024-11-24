"use client";

import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { workflowDuplicateShemaType, workflowSchema } from "@/schema/workflows";
import { Copy, Layers2Icon, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { duplicateWorkflow } from "@/actions/workflows/duplicateWorkflow";

interface DuplicateWorkFlowDialogProps {
  triggerText?: string;
  workflowId: string;
}

const DuplicateWorkFlowDialog = ({
  triggerText,
  workflowId,
}: DuplicateWorkFlowDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<workflowDuplicateShemaType>({
    resolver: zodResolver(workflowSchema),
    defaultValues: {
      workflowId,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: duplicateWorkflow,
    onSuccess: () => {
      setIsOpen(!isOpen);
      toast.success("Workflow duplicated", { id: "duplicate-workflow" });
    },
    onError: (error) => {
      const message = error?.message;
      toast.error("Failed to duplicate workflow", { id: "duplicate-workflow" });
    },
  });

  const onSubmit = useCallback(
    (value: workflowDuplicateShemaType) => {
      toast.loading("Duplicating workflow...", { id: "duplicate-workflow" });
      mutate({
        ...value,
        workflowId,
      });
    },
    [mutate]
  );

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        form.reset();
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <Copy className="w-4 h-4 text-muted-foreground cursor-pointer" />
        </Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={<Layers2Icon size={30} className="stroke-primary" />}
          title={<>Duplicate workflow</>}
        />
        <div className="p-6">
          <Form {...form}>
            <form
              className="space-y-4 w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Name
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormDescription className="text-muted-foreground text-xs">
                      Choose unique name
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                name="description"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription className="text-muted-foreground text-xs">
                      Provide a brief description of what workflow does.
                    </FormDescription>
                  </FormItem>
                )}
              />
              <Button
                disabled={isPending}
                type="submit"
                className={buttonVariants({
                  variant: "icon",
                })}
              >
                {!isPending && "Proceed"}
                {isPending && <Loader2 className="animate-spin" />}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateWorkFlowDialog;
