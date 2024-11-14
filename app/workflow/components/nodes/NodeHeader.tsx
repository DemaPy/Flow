"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";

interface NodeHeaderProps {
  taskType: TaskType;
  nodeId: string;
}

const NodeHeader = ({ taskType, nodeId }: NodeHeaderProps) => {
  const Task = TaskRegistry[taskType];
  const { deleteElements, getNode, addNodes } = useReactFlow();
  return (
    <div className="flex items-center gap-2 p-2">
      <Task.icon size={16} />
      <div className="flex justify-between items-center w-full">
        <p className="text-xs font-bold uppercase text-muted-foreground">
          {Task.label}
        </p>
        <div className="flex gap-1 items-center">
          {Task.isEntryPoint && <Badge>Entry point</Badge>}
          <Badge className="gap-1 flex items-center text-xs">
            <CoinsIcon size={16} />
            {Task.credits}
          </Badge>
          {!Task.isEntryPoint && (
            <>
              <Button
                onClick={() => {
                  deleteElements({
                    nodes: [{ id: nodeId }],
                  });
                }}
                variant={"ghost"}
                size={"icon"}
              >
                <TrashIcon size={12} />
              </Button>
              <Button
                onClick={() => {
                  const node = getNode(nodeId) as AppNode;
                  const newX = node.position.x;
                  const newY = node.position.y;

                  const newNode = CreateFlowNode({
                    nodeType: node.data.type,
                    position: {
                      x: newX,
                      y: newY + node.measured?.height! + 20,
                    },
                  });

                  addNodes([newNode]);
                }}
                variant={"ghost"}
                size={"icon"}
              >
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={20} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NodeHeader;
