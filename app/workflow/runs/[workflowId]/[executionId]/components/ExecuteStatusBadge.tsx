import { ExecutionPhaseStatus } from "@/types/workflow";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleXIcon,
  Loader2Icon,
} from "lucide-react";
import React from "react";

interface ExecuteStatusBadgeProps {
  status: ExecutionPhaseStatus;
}

const ExecuteStatusBadge = ({ status }: ExecuteStatusBadgeProps) => {
  switch (status) {
    case ExecutionPhaseStatus.COMPLETED:
      return <CircleCheckIcon size={20} className="stroke-green-400" />;
    case ExecutionPhaseStatus.FAILED:
      return <CircleXIcon size={20} className="stroke-destructive" />;
    case ExecutionPhaseStatus.RUNNING:
      return (
        <Loader2Icon size={20} className="animate-spin stroke-yellow-500" />
      );
    case ExecutionPhaseStatus.PENDING:
      return <CircleDashedIcon size={20} className="stroke-muted-foreground" />;
    default:
      return <div className="rounded-full">{status}</div>;
      break;
  }
};

export default ExecuteStatusBadge;
