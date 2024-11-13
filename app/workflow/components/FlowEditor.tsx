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
import React, { useEffect } from "react";

import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import NodeComponent from "./nodes/NodeComponent";

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
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
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
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
