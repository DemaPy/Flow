import { NodeProps } from "@xyflow/react";
import React, { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import NodeInputs from "./NodeInputs";
import NodeInput from "./NodeInput";
import NodeOutputs from "./NodeOutputs";
import NodeOutput from "./NodeOutput";
import { Badge } from "@/components/ui/badge";

interface NodeComponentProps extends NodeProps {}
const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true"
const NodeComponent = memo(({ id, selected, data }: NodeComponentProps) => {
  const nodeData = data as AppNodeData;
  const task = TaskRegistry[nodeData.type];

  return (
    <NodeCard nodeId={id} isSelected={!!selected}>
      {DEV_MODE && <Badge>DEV: {id}</Badge>}
      <NodeHeader nodeId={id} taskType={nodeData.type} />
      <NodeInputs>
        {task.inputs.map((input) => (
          <NodeInput nodeId={id} key={input.name} nodeInput={input} />
        ))}
      </NodeInputs>
      <NodeOutputs>
        {task.outputs.map((output) => (
          <NodeOutput key={output.name} nodeOutput={output} />
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";
export default NodeComponent;
