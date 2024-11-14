import flowToExecutionPlan from "@/lib/workflow/flowToExecutionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import React, { useCallback } from "react";

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();

  const generateExecPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan } = flowToExecutionPlan(nodes as AppNode[], edges);
    return executionPlan;
  }, [toObject]);

  return generateExecPlan;
};

export default useExecutionPlan;
