"use client";
import { updateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { Workflow } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { CheckIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type SaveBtnProps = {
  workflowId: Workflow["id"];
};

const SaveBtn = ({ workflowId }: SaveBtnProps) => {
  const { toObject } = useReactFlow();

  const { mutate, isPending } = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("Workflow updated successfully", { id: "update-workflow" });
    },
    onError: () => {
      toast.error("Something went wrong", { id: "update-workflow" });
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        toast.loading("Updating workflow...", { id: "update-workflow" });
        mutate({ definition: JSON.stringify(toObject()), id: workflowId });
      }}
      variant={"outline"}
      className="flex items-center gap-2"
    >
      <CheckIcon className="stroke-green-400" size={16} />
      Save
    </Button>
  );
};

export default SaveBtn;
