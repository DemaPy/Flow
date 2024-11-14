import useFlowValidation from "@/hooks/useFlowValidation";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React, { PropsWithChildren } from "react";

interface NodeCardProps extends PropsWithChildren {
  nodeId: string;
  isSelected: boolean;
}

export const CARD_WIDTH = 400;

const NodeCard = ({ children, isSelected, nodeId }: NodeCardProps) => {
  const { getNode, setCenter } = useReactFlow();
  const { inputs } = useFlowValidation();
  const hasInvalidInputs = inputs.some((item) => item.nodeId === nodeId);
  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        const x = position.x + width! / 2;
        const y = position.y + height! / 2;
        if (x === undefined || y === undefined) return;
        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
      className={cn(
        "rounded-sm cursor-pointer bg-background border-2 border-separate w-[400px] text-xs gap-1 flex flex-col",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive border-2"
      )}
    >
      {children}
    </div>
  );
};

export default NodeCard;
