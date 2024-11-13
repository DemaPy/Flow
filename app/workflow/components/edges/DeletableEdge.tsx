"use client";

import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSmoothStepPath,
  useReactFlow,
} from "@xyflow/react";
import { X } from "lucide-react";
import React from "react";

const DeletableEdge = (props: EdgeProps) => {
  const [edgePath, labelX, labelY] = getSmoothStepPath(props);
  const { setEdges } = useReactFlow();

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={props.markerEnd}
        style={props.style}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            pointerEvents: "all",
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
          }}
        >
          <Button
            variant={"outline"}
            size={"icon"}
            onClick={() =>
              setEdges((edges) => edges.filter((item) => item.id !== props.id))
            }
            className="w-5 h-5 border cursor-pointer rounded-full text-xs leading-none hover:shadow-lg"
          >
            <X />
          </Button>
        </div>
      </EdgeLabelRenderer>
    </>
  );
};

export default DeletableEdge;
