import { AppNodeMissingInputs } from "@/types/appNode";
import {
  Dispatch,
  PropsWithChildren,
  SetStateAction,
  createContext,
  useState,
} from "react";

interface FlowValidationContextInterface {
  inputs: AppNodeMissingInputs[];
  setInputs: Dispatch<SetStateAction<AppNodeMissingInputs[]>>;
  clearErrors: () => void;
}

export const FlowValidationContext =
  createContext<FlowValidationContextInterface | null>(null);

export function FlowValidationContextProvider({ children }: PropsWithChildren) {
  const [inputs, setInputs] = useState<AppNodeMissingInputs[]>([]);

  const value: FlowValidationContextInterface = {
    setInputs,
    inputs,
    clearErrors: () => {},
  };
  return (
    <FlowValidationContext.Provider value={value}>
      {children}
    </FlowValidationContext.Provider>
  );
}
