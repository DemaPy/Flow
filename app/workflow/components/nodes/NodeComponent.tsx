import { NodeProps } from "@xyflow/react";
import React, { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import NodeInputs from "./NodeInputs";
import NodeInput from "./NodeInput";

interface NodeComponentProps extends NodeProps {}

const NodeComponent = memo(({ id, selected, data }: NodeComponentProps) => {
  const nodeData = data as AppNodeData;
  const task = TaskRegistry[nodeData.type];

  return (
    <NodeCard nodeId={id} isSelected={!!selected}>
      <NodeHeader taskType={nodeData.type} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput nodeId={id} key={input.name} nodeInput={input} />
        ))}
      </NodeInputs>
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";
export default NodeComponent;
