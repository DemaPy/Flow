import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { WorkflowStatus } from "@/types/workflow";
import { Workflow } from "@prisma/client";
import {
  CoinsIcon,
  CornerDownRight,
  FileTextIcon,
  MoveRightIcon,
  PlayIcon,
  ShuffleIcon,
} from "lucide-react";
import Link from "next/link";
import React from "react";
import WorkflowActions from "../components/WorkflowActions";
import RunButton from "../components/RunButton";
import SchedulerDialog from "../components/SchedulerDialog";
import TooltipWrapper from "@/components/TooltipWrapper";
import { Badge } from "@/components/ui/badge";

interface DefaultProps {
  workflow: Workflow;
}

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

const Default = ({ workflow }: DefaultProps) => {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  return (
    <Card className="border border-separate shadow-sm overflow-hidden rounded-md hover:shadow-md dark:shadow-primary/30">
      <CardContent className="p-4 flex items-center justify-between h-[100px]">
        <div className="flex items-center justify-end space-x-3">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              statusColors[workflow.status as WorkflowStatus]
            )}
          >
            {isDraft ? (
              <FileTextIcon className="h-4 w-4" />
            ) : (
              <PlayIcon className="h-4 w-4 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold flex items-center text-muted-foreground">
              <Link
                href={`/workflow/editor/${workflow.id}`}
                className="flex items-center hover:underline transition-shadow"
              >
                {workflow.name}
              </Link>
              {isDraft && (
                <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                  Draft
                </span>
              )}
            </h3>
            {workflow.status !== WorkflowStatus.DRAFT && (
              <ScheduleSection
                cron={workflow.cron}
                workflowId={workflow.id}
                creditsCost={workflow.creditsCost}
              />
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <RunButton workflowId={workflow.id} />
          <Link
            href={`/workflow/editor/${workflow.id}`}
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "sm",
              }),
              "flex items-center gap-2"
            )}
          >
            <ShuffleIcon size={16} /> Edit
          </Link>
          <WorkflowActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
      <LastRunWorkflowDetails workflow={workflow}/>
    </Card>
  );
};

function LastRunWorkflowDetails(workflow: Workflow) {
  return (
    <div>Last Run Details</div>
  )
}

function ScheduleSection({
  workflowId,
  creditsCost,
  cron,
}: {
  workflowId: string;
  creditsCost: number;
  cron: string | null;
}) {
  return (
    <div className="flex items-center gap-2">
      <CornerDownRight className="w-4 h-4 text-muted-foreground" />
      <SchedulerDialog
        key={`${cron}-${workflowId}`}
        cronValue={cron}
        workflowId={workflowId}
      />
      <MoveRightIcon className="h-4 w-4 text-muted-foreground" />
      <TooltipWrapper content="Credit consumption for full run">
        <div className="flex items-center gap-3">
          <Badge
            variant="outline"
            className="space-x-2 text-muted-foreground rounded-sm"
          >
            <CoinsIcon className="w-4 h-4" />
            <span>Credits cost: {creditsCost}</span>
          </Badge>
        </div>
      </TooltipWrapper>
    </div>
  );
}

export default Default;
