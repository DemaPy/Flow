"use client";
import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import { ColorForhandle } from "./common";

interface NodeOutputProps {
  nodeOutput: TaskParam;
}

const NodeOutput = ({ nodeOutput }: NodeOutputProps) => {
  return (
    <div className="flex justify-end relative p-3 bg-secondary">
      <p className="text-xs text-muted-foreground">{nodeOutput.name}</p>
      <Handle
        id={nodeOutput.name}
        type="source"
        position={Position.Right}
        className={cn(
          "!bg-muted-foreground !border-2 !border-background !-right-2 !w-4 !h-4",
          ColorForhandle[nodeOutput.type]
        )}
      />
    </div>
  );
};

export default NodeOutput;
