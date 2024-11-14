import { AppNode } from "@/types/appNode";
import {
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { Edge, getIncomers } from "@xyflow/react";
import { TaskRegistry } from "./task/registry";

const flowToExecutionPlan = (nodes: AppNode[], edges: Edge[]) => {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint
  );

  if (!entryPoint) {
    throw new Error("TODO");
  }

  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  const planned = new Set("");

  planned.add(entryPoint.id);
  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };
    for (const currNode of nodes) {
      if (planned.has(currNode.id)) {
        continue;
      }

      const invalidInputs = getInvalidInputs(currNode, edges, planned);
      if (invalidInputs.length > 0) {
        // Get parent nodes (incomers) for currNode
        const incomers = getIncomers(currNode, nodes, edges);
        if (incomers.every((inc) => planned.has(inc.id))) {
          // if all incomers are planned
          // (incomer it is parent node)
          // and there are still incalid inputs
          // this particular node has an invalid input.
          console.log("invalid input");
          throw new Error("TODO");
        } else {
          continue;
        }
      }

      nextPhase.nodes.push(currNode);
    }

    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  return {
    executionPlan,
  };
};

function getInvalidInputs(
  currNode: AppNode,
  edges: Edge[],
  planned: Set<string>
) {
  const invalidInputs = [];
  const inputs = TaskRegistry[currNode.data.type].inputs;
  for (const input of inputs) {
    const inputValue = currNode.data.inputs[input.name];
    const isInputValueProvided = inputValue?.length > 0;
    if (isInputValueProvided) {
      continue;
    }

    // Value is not provided by user
    // Get incoming edges connections
    // (data can ba provided later)
    const incommingEdges = edges.filter((edge) => edge.target === currNode.id);

    const inputEdgeByOutput = incommingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputEdgeByOutput &&
      planned.has(inputEdgeByOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      continue;
    } else if (!input.required) {
      if (!inputEdgeByOutput) continue;
      if (inputEdgeByOutput && planned.has(inputEdgeByOutput.source)) {
        // Output providing value to the input
        continue;
      }
    }

    invalidInputs.push(input.name);
  }
  return invalidInputs;
}

export default flowToExecutionPlan;
