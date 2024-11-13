import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import NodeParamField from "./NodeParamField";

interface NodeInputProps {
  nodeInput: TaskParam;
  nodeId: string
}

const NodeInput = ({ nodeInput, nodeId }: NodeInputProps) => {
  return (
    <div className="flex justify-start relative p-2 bg-secondary w-full">
      <NodeParamField nodeId={nodeId} nodeInput={nodeInput} />
      {!nodeInput.hideHandle && (
        <Handle
          className={cn(
            "!bg-muted-foreground !border-2 !border-background !-left-2 !w-4 !h-4"
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
