"use client";
import { runWorkFlow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface RunButtonProps {
  workflowId: string;
}

const RunButton = ({ workflowId }: RunButtonProps) => {
  const { mutate, isPending } = useMutation({
    mutationFn: () => runWorkFlow({ workflowId }),
    onSuccess: () => {
      toast.success("Workflow started", { id: workflowId });
    },
    onError: () => {
      toast.error("Something went wrong", { id: workflowId });
    },
  });

  return (
    <Button
      disabled={isPending}
      variant={"outline"}
      size={"sm"}
      className="flex items-center gap-2"
      onClick={() => {
        toast.loading("Workflow executed", { id: workflowId });
        mutate();
      }}
    >
      <PlayIcon size={16} />
      Run
    </Button>
  );
};

export default RunButton;
