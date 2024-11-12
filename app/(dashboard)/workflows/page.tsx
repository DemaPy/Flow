import React, { Suspense } from "react";
import WorkflowsSkeleton from "./components/WorkflowsSkeleton";
import Workflows from "./Workflows";

const page = () => {
  return (
    <div className="flex flex-1 flex-col h-full">
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>
      </div>

      <div className="h-full py-6">
        <Suspense fallback={<WorkflowsSkeleton />}>
          <Workflows />
        </Suspense>
      </div>
    </div>
  );
};

export default page;
