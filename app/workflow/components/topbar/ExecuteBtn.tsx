"use client";

import { Button } from "@/components/ui/button";
import useExecutionPlan from "@/hooks/useExecutionPlan";
import { Workflow } from "@prisma/client";
import { PlayIcon } from "lucide-react";
import React from "react";

type ExecuteBtn = {
  workflowId: Workflow["id"];
};

const ExecuteBtn = ({ workflowId }: ExecuteBtn) => {
  const generate = useExecutionPlan();

  return (
    <Button
      onClick={() => {
        const plan = generate();
        console.log(plan);
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
