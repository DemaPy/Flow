import React, { PropsWithChildren, ReactElement, ReactNode } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";

interface TooltipWrapperProps extends PropsWithChildren {
  content: ReactNode;
  side?: "top" | "right" | "bottom" | "left";
}

const TooltipWrapper = ({ children, side, content }: TooltipWrapperProps) => {
  if (!content) return children;
  return (
    <TooltipProvider delayDuration={0}>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent side={side}>{content}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default TooltipWrapper;
