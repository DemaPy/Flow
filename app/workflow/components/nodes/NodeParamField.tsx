import { TaskParam, TaskParamType } from "@/types/task";
import React, { useCallback } from "react";
import StringParam from "./params/StringParam";
import { useReactFlow } from "@xyflow/react";
import { AppNode } from "@/types/appNode";
import BrowserInstanceParam from "./params/BrowserInstanceParam";
import SelectParam from "./params/SelectParam";

interface NodeParamFieldProps {
  nodeInput: TaskParam;
  nodeId: string;
  disabled: boolean;
}

const NodeParamField = ({
  nodeInput,
  nodeId,
  disabled,
}: NodeParamFieldProps) => {
  const { updateNodeData, getNode } = useReactFlow();
  const node = getNode(nodeId) as AppNode;
  const value = node?.data.inputs?.[nodeInput.name];

  const updateNodeParamValue = useCallback(
    (newValue: string) => {
      updateNodeData(nodeId, {
        inputs: {
          ...node?.data.inputs,
          [nodeInput.name]: newValue,
        },
      });
    },
    [nodeId, updateNodeData, nodeInput.name, node?.data.inputs]
  );

  switch (nodeInput.type) {
    case TaskParamType.STRING:
      return (
        <StringParam
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          param={nodeInput}
          disabled={disabled}
        />
      );
    case TaskParamType.BROWSER_INSTANCE:
      return (
        <BrowserInstanceParam
          value={""}
          updateNodeParamValue={updateNodeParamValue}
          param={nodeInput}
        />
      );
    case TaskParamType.SELECT:
      return (
        <SelectParam
          param={nodeInput}
          value={value}
          updateNodeParamValue={updateNodeParamValue}
          disabled={disabled}
        />
      );
    default:
      return (
        <div className="w-full">
          <p className="text-xs text-muted-foreground">Not implemented</p>
        </div>
      );
  }
};

export default NodeParamField;
