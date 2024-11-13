"use client";

import { Workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  ReactFlow,
  addEdge,
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
import { CARD_WIDTH } from "./nodes/NodeCard";
import DeletableEdge from "./edges/DeletableEdge";

interface FlowEditorProps {
  workflow: Workflow;
}

const nodeTypes = {
  ScrapeNode: NodeComponent,
};

const edgeTypes = {
  default: DeletableEdge,
};

const snapGrid: [number, number] = [50, 50];
const fitViewOptions = {
  padding: 2,
};

function FlowEditor({ workflow }: FlowEditorProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const { setViewport, screenToFlowPosition } = useReactFlow();

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

    const position = screenToFlowPosition({
      x: ev.clientX - CARD_WIDTH / 2,
      y: ev.clientY,
    });

    const newNode = CreateFlowNode({
      nodeType: taskType as TaskType,
      position,
    });
    setNodes((prev) => prev.concat(newNode));
  }, []);

  const handleConnect = useCallback((connection: Connection) => {
    setEdges((prev) => addEdge({ ...connection, animated: true }, prev));
  }, []);

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        snapGrid={snapGrid}
        snapToGrid
        fitViewOptions={fitViewOptions}
        fitView
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onConnect={handleConnect}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
