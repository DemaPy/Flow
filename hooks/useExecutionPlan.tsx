import flowToExecutionPlan, {
  FlowToExecutionPlanError,
  FlowToExecutionPlanValidationError,
} from "@/lib/workflow/flowToExecutionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { toast } from "sonner";
import useFlowValidation from "./useFlowValidation";

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const { setInputs, clearErrors } = useFlowValidation();

  const handleError = useCallback(
    (error: FlowToExecutionPlanError) => {
      switch (error.type as FlowToExecutionPlanValidationError) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found.");
          break;
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("Invalid inputs found.");
          setInputs(error.invalidElements!);
          break;
        default:
          toast.error("Something went wrong.");
          break;
      }
    },
    [setInputs]
  );

  const generateExecPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = flowToExecutionPlan(
      nodes as AppNode[],
      edges
    );
    if (error) {
      handleError(error);
      return null;
    }
    clearErrors();
    return executionPlan;
  }, [toObject, handleError, clearErrors]);

  return generateExecPlan;
};

export default useExecutionPlan;
