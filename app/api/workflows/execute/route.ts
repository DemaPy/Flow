import prisma from "@/lib/prisma";
import ExecuteWorkflow from "@/lib/workflow/ExecuteWorkflow";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import {
  ExecutionPhaseStatus,
  ExecutionWorkflowStatus,
  WorkflowExecutionPlan,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { timingSafeEqual } from "crypto";
import parser from "cron-parser";

// WHEN GET REQUEST (BY CRON) =>
// CREATE NEW EXECUTION FROM CURRENT EXECUTION PLAN
// CALCULATE NEXT RUN WORKFLOW DATE
// BASED ON CRON TIME AND PASS TIME TO EXECUTE_WORKFLOW FUNCTION
// IN ORDER TO UPDATE workflow for NEXT EXECUTION

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const secret = authHeader.split(" ")[1];
  if (!isValid(secret)) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const workflowId = searchParams.get("workflowId") as string;
  if (!workflowId) {
    return Response.json({ error: "Workflow id not found" }, { status: 400 });
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
    },
  });
  if (!workflow) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  const executionPlan = JSON.parse(workflow.executionPlan!);
  if (!executionPlan) {
    return Response.json({ error: "Bad request" }, { status: 400 });
  }

  let nextRun;
  try {
    const cron = parser.parseExpression(workflow.cron!, { utc: true });
    nextRun = cron.next().toDate();

    const execution = await prisma.workflowExecution.create({
      data: {
        workflowId,
        userId: workflow.userId,
        definition: workflow.definition,
        status: ExecutionWorkflowStatus.PENDING,
        startedAt: new Date(),
        trigger: WorkflowExecutionTrigger.CRON,
        phases: {
          create: (
            executionPlan.executionPlan as WorkflowExecutionPlan
          ).flatMap((phase) =>
            phase.nodes.flatMap((node) => ({
              userId: workflow.userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            }))
          ),
        },
      },
    });

    if (!execution) {
      throw new Error("Workflow execution not created");
    }

    await ExecuteWorkflow(execution.id, nextRun);
    return new Response(null, { status: 200 });
  } catch (error) {
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

function isValid(secret: string) {
  const API_SECRET = process.env.DEMA_SECRET;
  if (!API_SECRET) return false;

  try {
    return timingSafeEqual(Buffer.from(secret), Buffer.from(API_SECRET));
  } catch (error) {
    return false;
  }
}
