import React, { Suspense } from "react";
import TopBar from "../../components/topbar/TopBar";
import getWorkflowExecutions from "@/actions/workflows/getWorkflowExecutions";
import { InboxIcon, Loader2Icon } from "lucide-react";
import ExecutionsTable from "./components/ExecutionsTable";

const page = ({ params }: { params: { workflowId: string } }) => {
  return (
    <div className="h-full w-full overflow-auto">
      <TopBar
        hideButtons
        title="Runs"
        subtitle="List of runs"
        workflowId={params.workflowId}
      />
      <Suspense fallback={<ExecutionSkeleton />}>
        <ExecutionsTableWrapper workflowId={params.workflowId} />
      </Suspense>
    </div>
  );
};

function ExecutionSkeleton() {
  return (
    <div className="flex items-center justify-center">
      <Loader2Icon size={30} className="animate-spin" />;
    </div>
  );
}

async function ExecutionsTableWrapper({ workflowId }: { workflowId: string }) {
  const executions = await getWorkflowExecutions(workflowId);
  if (!executions) {
    return <div>No data</div>;
  }

  if (executions.length === 0) {
    return (
      <div className="container w-full py-6">
        <div className="flex items-center flex-col gap-2 justify-center h-full w-full">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No runs triggered yet...</p>
            <p className="text-sm text-muted-foreground">
              You can trigger a new run in the editor page
            </p>
          </div>
        </div>
      </div>
    );
  }

  return <ExecutionsTable workflowId={workflowId} initialData={executions} />;
}

export default page;
