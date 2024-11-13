"use client";

import { Workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";

import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/NodeComponent";
import { AppNode } from "@/types/appNode";

interface FlowEditorProps {
  workflow: Workflow;
}

const nodeTypes = {
  ScrapeNode: NodeComponent,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 2,
};

function FlowEditor({ workflow }: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport } = useReactFlow();

  useEffect(() => {
    try {
      const definition = JSON.parse(workflow.definition);
      if (!definition) {
        return;
      }
      setNodes(definition.nodes || []);
      setEdges(definition.edges || []);
      // if ("viewport" in definition) {
      //   const { x = 0, y = 0, zoom = 1 } = definition.viewport;
      //   setViewport({
      //     x,
      //     y,
      //     zoom,
      //   });
      // }
    } catch (error) {
      console.log(error);
    }
  }, [workflow, setNodes, setEdges]);

  const handleDragOver = useCallback((ev: React.DragEvent) => {
    ev.preventDefault();
    ev.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback((ev: React.DragEvent) => {
    ev.preventDefault();
    const taskType = ev.dataTransfer.getData("application/reactflow");
    if (typeof taskType === undefined || !taskType) return;

    const newNode = CreateFlowNode({ nodeType: taskType as TaskType });
    setNodes((prev) => prev.concat(newNode));
  }, []);

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        snapGrid={snapGrid}
        snapToGrid
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
