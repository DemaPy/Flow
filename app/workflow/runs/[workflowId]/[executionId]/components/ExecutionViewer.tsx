"use client";
import getWorkflowExecutionPhases from "@/actions/workflows/getWorkflowExecutionPhases";
import { ExecutionWorkflowStatus } from "@/types/workflow";
import { ExecutionPhase, WorkflowExecution } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  Loader2Icon,
  WorkflowIcon,
} from "lucide-react";
import React, { useState } from "react";
import ExecutionViewerLabel from "./ExecutionViewerLabel";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { datesToDurationString } from "@/lib/workflow/datesToDurationString";
import getPhasesTotalCost from "@/lib/workflow/getPhasesTotalCost";
import getWorkflowPhaseDetails from "@/actions/workflows/getWorkflowPhaseDetails";

interface ExecutionViewerProps {
  workflowExecution: WorkflowExecution & { phases: ExecutionPhase[] };
}

const ExecutionViewer = ({ workflowExecution }: ExecutionViewerProps) => {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const query = useQuery({
    queryFn: () => getWorkflowExecutionPhases(workflowExecution.id),
    refetchInterval: (q) => {
      return q.state.data?.status === ExecutionWorkflowStatus.RUNNING
        ? 1000
        : false;
    },
    initialData: workflowExecution,
    queryKey: ["execution", workflowExecution.id],
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => getWorkflowPhaseDetails(selectedPhase!),
  });

  const duration = datesToDurationString({
    end: query.data?.completedAt,
    start: query.data?.startedAt,
  });

  const creditsConsumed = getPhasesTotalCost(query.data?.phases || []);

  return (
    <div className="flex w-full h-full relative overflow-hidden">
      <aside className="w-[440px] min-w-[440px] max-w-[440px] border-r-2 border-separate flex flex-grow flex-col">
        <div className="py-4 px-2 ">
          <ExecutionViewerLabel
            icon={
              <CircleDashedIcon
                size={20}
                className="stroke-muted-foreground/80"
              />
            }
            label={"Status"}
            value={query.data?.status || ""}
          />
          <ExecutionViewerLabel
            icon={
              <CalendarIcon size={20} className="stroke-muted-foreground" />
            }
            label={"Started at"}
            value={
              query.data?.startedAt
                ? formatDistanceToNow(new Date(query.data.startedAt), {
                    addSuffix: true,
                  })
                : "-"
            }
          />
          <ExecutionViewerLabel
            icon={<ClockIcon size={20} className="stroke-muted-foreground" />}
            label={"Duration"}
            value={
              duration ? (
                duration
              ) : (
                <Loader2Icon className="animate-spin" size={20} />
              )
            }
          />
          <ExecutionViewerLabel
            icon={<CoinsIcon size={20} className="stroke-muted-foreground" />}
            label={"Credits consumed"}
            value={creditsConsumed}
          />
        </div>
        <Separator />
        <div className="flex justify-center items-center py-2 px-4">
          <div className="text-muted-foreground flex items-center gap-2">
            <WorkflowIcon size={20} className="stroke-muted-foreground/80" />
          </div>
        </div>
        <Separator />
        <div className="overflow-auto h-full px-2 py-4 space-y-2">
          {query.data?.phases.map((phase, idx) => {
            return (
              <Button
                onClick={() => {
                  if (query.data?.status === ExecutionWorkflowStatus.RUNNING)
                    return;
                  setSelectedPhase(phase.id);
                }}
                variant={selectedPhase === phase.id ? "secondary" : "ghost"}
                key={phase.id}
                className="w-full justify-between"
              >
                <div className="flex items-center gap-2">
                  <Badge variant={"outline"}>{idx + 1}</Badge>
                  <p className="font-semibold">{phase.name}</p>
                </div>
                <p className="text-xs text-muted-foreground">{phase.status}</p>
              </Button>
            );
          })}
        </div>
      </aside>
      <div className="flex w-full h-full overflow-auto">
        <pre>{JSON.stringify(phaseDetails, null, 4)}</pre>
      </div>
    </div>
  );
};

export default ExecutionViewer;
