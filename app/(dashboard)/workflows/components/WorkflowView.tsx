import { Workflow } from "@prisma/client";
import React from "react";
import Default from "../cards/Default";

interface WorkflowViewProps {
  workflows: Workflow[];
  card: "default";
}

const WorkflowView = ({ card, workflows }: WorkflowViewProps) => {
  return (
    <div className="grid grid-cols-1 gap-4">
      {workflows.map((workflow) => {
        if (card === "default") {
          return <Default key={workflow.id} workflow={workflow} />;
        }
      })}
    </div>
  );
};

export default WorkflowView;
