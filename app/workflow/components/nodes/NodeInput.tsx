import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import React from "react";
import NodeParamField from "./NodeParamField";
import { ColorForhandle } from "./common";

interface NodeInputProps {
  nodeInput: TaskParam;
  nodeId: string;
}

const NodeInput = ({ nodeInput, nodeId }: NodeInputProps) => {
  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === nodeInput.name
  );
  
  return (
    <div className="flex justify-start relative p-2 bg-secondary w-full">
      <NodeParamField
        nodeId={nodeId}
        nodeInput={nodeInput}
        disabled={isConnected}
      />
      {!nodeInput.hideHandle && (
        <Handle
          isConnectable={!isConnected}
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4",
            ColorForhandle[nodeInput.type]
          )}
          id={nodeInput.name}
          type="target"
          position={Position.Left}
        />
      )}
    </div>
  );
};

export default NodeInput;
