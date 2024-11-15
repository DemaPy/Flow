import TopBar from "@/app/workflow/components/topbar/TopBar";
import React, { Suspense } from "react";
import ExecutionViewerWrapper from "./components/ExecutionViewerWrapper";
import ExecutionViewerSkeleton from "./components/ExecutionViewerSkeleton";

interface ExecutionViewerPage {
  params: { workflowId: string; executionId: string };
}

const ExecutionViewerPage = ({ params }: ExecutionViewerPage) => {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <TopBar
        hideButtons={true}
        workflowId={params.workflowId}
        title="Workflow run details"
        subtitle={`Run ID: ${params.executionId}`}
      />
      <section className="flex h-full overflow-auto">
        <Suspense fallback={<ExecutionViewerSkeleton />}>
          <ExecutionViewerWrapper
            executionId={params.executionId}
          ></ExecutionViewerWrapper>
        </Suspense>
      </section>
    </div>
  );
};

export default ExecutionViewerPage;
