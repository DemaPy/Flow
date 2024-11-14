"use client";

import { runWorkFlow } from "@/actions/workflows/runWorkflow";
import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { Workflow } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

type ExecuteBtn = {
  workflowId: Workflow["id"];
};

const ExecuteBtn = ({ workflowId }: ExecuteBtn) => {
  const generate = useExecutionPlan();
  const { toObject } = useReactFlow();
  const { mutate, isPending } = useMutation({
    mutationFn: runWorkFlow,
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
          flowDefinition: JSON.stringify(toObject()),
        });
      }}
      variant={"outline"}
      className="flex items-center gap-2"
    >
      <PlayIcon className="stroke-orange-400" size={16} />
      Execute
    </Button>
  );
};

export default ExecuteBtn;
