"use client";

import { publishWorkFlow } from "@/actions/workflows/publishWorkFlow";
import { runWorkFlow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { Workflow } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { UploadIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type PublishButton = {
  workflowId: Workflow["id"];
};

const PublishButton = ({ workflowId }: PublishButton) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const { mutate, isPending } = useMutation({
    mutationFn: publishWorkFlow,
    onSuccess() {
      toast.success("Execution finished.", { id: "flow-execution" });
    },
    onError() {
      toast.error("Something went wrong.", { id: "flow-execution" });
    },
  });

  return (
    <Button
      disabled={isPending}
      onClick={() => {
        const plan = generate();
        if (!plan) {
          return;
        }
        toast.loading("Execution started...", { id: "flow-execution" });
        mutate({
          workflowId,
          definition: ""
        });
      }}
      variant={"outline"}
      className="flex items-center gap-2"
    >
      <UploadIcon className="stroke-green-400" size={16} />
      Publish
    </Button>
  );
};

export default PublishButton;
