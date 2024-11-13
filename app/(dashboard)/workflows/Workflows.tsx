import { GetUserWorkFlows } from "@/actions/workflows/getWorkflowsForUser";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, InboxIcon } from "lucide-react";
import React from "react";
import CreateWorkFlowDialog from "./actions/create";
import WorkflowView from "./components/WorkflowView";

const Workflows = async () => {
  try {
    const workflows = await GetUserWorkFlows();
    if (workflows.length === 0) {
      return (
        <div className="flex flex-col gap-4 h-full items-center justify-center">
          <div className="rounded-full bg-accent w-20 h-20 flex items-center justify-center">
            <InboxIcon size={40} className="stroke-primary" />
          </div>
          <div className="flex flex-col gap-1 text-center">
            <p className="font-bold">No workflow created yet</p>
            <p className="text-sm text-muted-foreground">
              Click the button below to create first workflow.
            </p>
          </div>
          <CreateWorkFlowDialog triggerText="Create your first workflow" />
        </div>
      );
    }
    return <WorkflowView workflows={workflows} card={"default"} />;
  } catch (error) {
    let message = "Something went wrong.";
    if (error instanceof Error) {
      message = error.message;
    }
    return (
      <Alert variant={"destructive"}>
        <AlertCircle className="w-4 h-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    );
  }
};

export default Workflows;
