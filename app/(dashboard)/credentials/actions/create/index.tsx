"use client";

import CustomDialogHeader from "@/components/CustomDialogHeader";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, ShieldEllipsis } from "lucide-react";
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
import { credentialShema, credentialShemaType } from "@/schema/credentials";
import { createCredential } from "@/actions/credentials/createCredential";

interface CreateCredentialDialogProps {
  triggerText?: string;
}

const CreateCredentialDialog = ({
  triggerText,
}: CreateCredentialDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<credentialShemaType>({
    resolver: zodResolver(credentialShema),
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createCredential,
    onSuccess: () => {
      toast.success("Credential created", { id: "create-credential" });
    },
    onError: (error) => {
      const message = error?.message;
      toast.error("Failed to create credential", { id: "create-credential" });
    },
  });

  const onSubmit = useCallback(
    (value: credentialShemaType) => {
      toast.loading("Creating credential...", { id: "create-credential" });
      mutate(value);
      setIsOpen(!isOpen);
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
        <Button>{triggerText ?? "Create"}</Button>
      </DialogTrigger>
      <DialogContent className="px-0">
        <CustomDialogHeader
          icon={<ShieldEllipsis size={30} className="stroke-primary" />}
          title={<>Create credential</>}
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
                      Choose unique name for your credential
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                name="value"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex gap-1 items-center">
                      Description
                      <p className="text-xs text-primary">(required)</p>
                    </FormLabel>
                    <FormControl>
                      <Textarea className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription className="text-muted-foreground text-xs">
                      Enter value associated with this credential
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

export default CreateCredentialDialog;
