"sue client";

import { Workflow } from "@prisma/client";
import { ReactFlowProvider } from "@xyflow/react";
import FlowEditor from "./FlowEditor";
import TopBar from "./topbar/TopBar";
import TaskMenu from "./TaskMenu";
import { FlowValidationContextProvider } from "@/components/context/FlowValidation";
import { WorkflowStatus } from "@/types/workflow";

interface EditorProps {
  workflow: Workflow;
}

export default function Editor({ workflow }: EditorProps) {
  return (
    <FlowValidationContextProvider>
      <ReactFlowProvider>
        <div className="flex flex-col h-full w-full overflow-hidden">
          <TopBar
            isPublished={workflow.status === WorkflowStatus.PUBLISHED}
            workflowId={workflow.id}
            title="Workflow editor"
            subtitle={workflow.name}
          />
          <section className="flex h-full overflow-auto">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </FlowValidationContextProvider>
  );
}
