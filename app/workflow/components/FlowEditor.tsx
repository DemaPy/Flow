"use client";

import { Workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  Edge,
  Node,
  ReactFlow,
  addEdge,
  getOutgoers,
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
import { TaskRegistry } from "@/lib/workflow/task/registry";

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
  const { setViewport, screenToFlowPosition, updateNodeData } = useReactFlow();

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

  const handleDrop = useCallback(
    (ev: React.DragEvent) => {
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
    },
    [screenToFlowPosition, setNodes]
  );

  const handleConnect = useCallback(
    (connection: Connection) => {
      setEdges((prev) => addEdge({ ...connection, animated: true }, prev));
      if (!connection.targetHandle) {
        return;
      }
      const node = nodes.find((node) => node.id === connection.target);
      if (!node) {
        return;
      }
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: "",
        },
      });
    },
    [setEdges, updateNodeData, nodes]
  );

  const isValidConnection = useCallback(
    (connection: Edge | Connection) => {
      if (connection.source === connection.target) return false;

      if (connection.source === connection.target) {
      }

      const source = nodes.find((node) => node.id === connection.source);
      const target = nodes.find((node) => node.id === connection.target);
      if (!source || !target) {
        console.log("Invalid connection.");
        return false;
      }

      const sTask = TaskRegistry[source.data.type];
      const tTask = TaskRegistry[target.data.type];

      const output = sTask.outputs.find(
        (item) => item.name === connection.sourceHandle
      );
      const input = tTask.inputs.find(
        (item) => item.name === connection.targetHandle
      );

      if (output?.type !== input?.type) {
        console.log("Invalid connection.");
        return false;
      }

      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      const detectedCycle = hasCycle(target);
      return !detectedCycle;
    },
    [edges, nodes]
  );

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
        isValidConnection={isValidConnection}
      >
        <Controls position="top-left" fitViewOptions={fitViewOptions} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
