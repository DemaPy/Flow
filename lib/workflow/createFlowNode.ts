import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";

interface CreateFlowNode {
  nodeType: TaskType;
  position?: {
    x: number;
    y: number;
  };
}

export function CreateFlowNode({
  nodeType,
  position,
}: CreateFlowNode): AppNode {
  return {
    id: crypto.randomUUID(),
    type: "ScrapeNode",
    dragHandle: ".drag-handle",
    data: {
      type: nodeType,
      inputs: {},
    },
    position: position ?? { x: 0, y: 0 },
  };
}
