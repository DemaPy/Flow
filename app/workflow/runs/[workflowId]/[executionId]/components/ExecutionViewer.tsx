"use client";
import getWorkflowExecutionPhases from "@/actions/workflows/getWorkflowExecutionPhases";
import { ExecutionWorkflowStatus } from "@/types/workflow";
import {
  ExecutionPhase,
  Executionlog,
  WorkflowExecution,
} from "@prisma/client";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Log, LogLevel } from "@/types/environment";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

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

  const isRunning = query.data?.status === ExecutionWorkflowStatus.RUNNING;

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
                  if (isRunning) return;
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
        {isRunning && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <p className="font-bold">Run is in progress, please wait</p>
          </div>
        )}
        {isRunning && !selectedPhase && (
          <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
            <div className="flex flex-col gap-1 text-center">
              <p className="font-bold">No phase selected</p>
              <p className="text-sm text-muted-foreground">
                Selected a phase to view details
              </p>
            </div>
          </div>
        )}
        {!isRunning && selectedPhase && phaseDetails.data && (
          <div className="flex flex-col py-4 container gap-4 overflow-auto">
            <div className="flex gap-2 items-center">
              <Badge variant="outline" className="space-x-4">
                <CoinsIcon size={18} className="stroke-muted-foreground" />
                <div className="flex gap-1 items-center">
                  <span>Credits</span>
                  <span>TODO</span>
                </div>
              </Badge>
              <Badge variant="outline" className="space-x-4">
                <ClockIcon size={18} className="stroke-muted-foreground" />
                <div className="flex gap-1 items-center">
                  <span>Duration</span>
                  <span>
                    {datesToDurationString({
                      start: phaseDetails.data.completedAt,
                      end: phaseDetails.data.startedAt,
                    }) || "-"}
                  </span>
                </div>
              </Badge>
            </div>
            <ParameterViewer
              title="Inputs"
              subtitle="Inputs used for phase"
              paramsJSON={phaseDetails.data.inputs}
            />
            <ParameterViewer
              title="Outputs"
              subtitle="Outputs generated by phase"
              paramsJSON={phaseDetails.data.outputs}
            />

            <LogViewer logs={phaseDetails.data.logs} />
          </div>
        )}
      </div>
    </div>
  );
};

function LogViewer({ logs }: { logs: Executionlog[] | undefined }) {
  if (!logs || logs?.length === 0) return null;
  return (
    <Card className="w-full">
      <CardHeader className="rounded-md rounded-b-none py-4 border-b bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">Logs</CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          Logs generated by this phase
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="text-muted-foreground text-sm">
            <TableRow>
              <TableHead>Time</TableHead>
              <TableHead>Level</TableHead>
              <TableHead>Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.map((item) => (
              <TableRow key={item.id} className="text-muted-foreground">
                <TableCell
                  className="text-xs text-muted-foreground p-1 pl-4"
                  width={190}
                >
                  {item.timestamp.toISOString()}
                </TableCell>
                <TableCell
                  className={cn(
                    "uppercase text-xs font-bold p-[3px] pl-4",
                    item.logLevel === "ERROR" && "text-destructive",
                    item.logLevel === "INFO" && "text-primary"
                  )}
                  width={80}
                >
                  {item.logLevel}
                </TableCell>
                <TableCell className="text-sm flex-1 p-[3px] pl-4">
                  {item.message}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

interface ParameterViewer {
  title: string;
  subtitle: string;
  paramsJSON: string | null;
}

function ParameterViewer({ title, subtitle, paramsJSON }: ParameterViewer) {
  const params = paramsJSON ? JSON.parse(paramsJSON) : undefined;

  return (
    <Card>
      <CardHeader className="rounded-md rounded-b-none py-4 border-b bg-gray-50 dark:bg-background">
        <CardTitle className="text-base">{title}</CardTitle>
        <CardDescription className="text-muted-foreground text-xs">
          {subtitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="py-4">
        <div className="flex flex-col gap-2">
          {(!params || Object.keys(params).length === 0) && (
            <p className="text-xs">No parameters generated</p>
          )}
          {params &&
            Object.entries(params).map(([key, value]) => {
              return (
                <div
                  key={key}
                  className="flex justify-between items-center space-y-1"
                >
                  <p className="text-sm text-muted-foreground flex-1 basis-1/3">
                    {key}
                  </p>
                  <Input
                    readOnly
                    className="flex-1 basis-2/3"
                    value={value as string}
                  />
                </div>
              );
            })}
        </div>
      </CardContent>
    </Card>
  );
}

export default ExecutionViewer;
