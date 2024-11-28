"use client";

import downloadInvoice from "@/actions/billing/downloadInvoice";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function InvoiceButton({ id }: { id: string }) {
  const mutation = useMutation({
    mutationFn: downloadInvoice,
    onSuccess: (data) => {
      location.href = data as string;
    },
    onError: () => {
      toast.error("Something went wrong.");
    },
  });

  return (
    <Button
      onClick={() => mutation.mutate(id)}
      disabled={mutation.isPending}
      variant={"ghost"}
      size={"sm"}
      className="px-1 text-xs gap-2 text-muted-foreground"
    >
      Invoice
      {mutation.isPending && <Loader2Icon className="w-4 h-4 animate-spin" />}
    </Button>
  );
}

export default InvoiceButton;
