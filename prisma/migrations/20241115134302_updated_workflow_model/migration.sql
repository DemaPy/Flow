-- AlterTable
ALTER TABLE "WorkflowExecution" ADD COLUMN "lastRunAt" DATETIME;
ALTER TABLE "WorkflowExecution" ADD COLUMN "lastRunId" DATETIME;
ALTER TABLE "WorkflowExecution" ADD COLUMN "lastRunStatus" TEXT;
