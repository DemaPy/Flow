"use client";

import getWorkflowExecutions from "@/actions/workflows/getWorkflowExecutions";
import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { datesToDurationString } from "@/lib/workflow/datesToDurationString";
import { Badge } from "@/components/ui/badge";
import { CoinsIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

type InitialDataType = Awaited<ReturnType<typeof getWorkflowExecutions>>;

const ExecutionsTable = ({
  workflowId,
}: {
  workflowId: string;
  initialData: InitialDataType;
}) => {
  const router = useRouter();
  const query = useQuery({
    queryFn: () => getWorkflowExecutions(workflowId),
    queryKey: ["executions", workflowId],
    refetchInterval: 5000,
  });

  return (
    <div className="border rounded-lg shadow-md overflow-auto">
      <Table className="h-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead>Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Consumed</TableHead>
            <TableHead className="text-right text-xs text-muted-foreground">
              Started at (desc)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="gap-2 h-full overflow-auto">
          {query.data?.map((item) => {
            const duration = datesToDurationString({
              end: item.completedAt,
              start: item.startedAt,
            });

            const formatStartedAt = item.startedAt
              ? formatDistanceToNow(item.startedAt, { addSuffix: true })
              : "-";
            return (
              <TableRow
                key={item.id}
                className="cursor-pointer"
                onClick={() =>
                  router.push(`/workflow/runs/${item.workflowId}/${item.id}`)
                }
              >
                <TableCell>
                  <div className="felx flex-col">
                    <span className="font-semibold">{item.id}</span>
                    <div className="text-muted-foreground text-xs">
                      <span>Triggered via</span>
                      <Badge variant={"outline"}>{item.trigger}</Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <div>{item.status}</div>
                    <div>{duration}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <div className="flex gap-2 items-center">
                      <CoinsIcon size={16} className="text-primary" />
                      <span className="font-semibold capitalize">
                        {item.creditsConsumed}
                      </span>
                    </div>
                    <div className="text-muted-foreground text-xs mx-5">
                      Credits
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatStartedAt}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default ExecutionsTable;
