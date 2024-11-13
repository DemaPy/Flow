import { NodeProps } from "@xyflow/react";
import React, { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";

interface NodeComponentProps extends NodeProps {}

const NodeComponent = memo(({ id, selected, data }: NodeComponentProps) => {
  const nodeData = data as AppNodeData;
  return (
    <NodeCard nodeId={id} isSelected={!!selected} >
      <NodeHeader taskType={nodeData.type} />
    </NodeCard>
  );
});

NodeComponent.displayName = "NodeComponent";
export default NodeComponent;
