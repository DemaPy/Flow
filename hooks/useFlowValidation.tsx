import { FlowValidationContext } from "@/components/context/FlowValidation";
import { useContext } from "react";

const useFlowValidation = () => {
  const context = useContext(FlowValidationContext);
  if (!context) {
    throw new Error("Context should be used within the context.");
  }
  return context;
};

export default useFlowValidation;
