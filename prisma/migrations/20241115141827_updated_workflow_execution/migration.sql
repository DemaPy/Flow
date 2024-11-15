/*
  Warnings:

  - You are about to drop the column `lastRunAt` on the `WorkflowExecution` table. All the data in the column will be lost.
  - You are about to drop the column `lastRunId` on the `WorkflowExecution` table. All the data in the column will be lost.
  - You are about to drop the column `lastRunStatus` on the `WorkflowExecution` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Workflow" ADD COLUMN "lastRunAt" DATETIME;
ALTER TABLE "Workflow" ADD COLUMN "lastRunId" DATETIME;
ALTER TABLE "Workflow" ADD COLUMN "lastRunStatus" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WorkflowExecution" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "workflowId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "trigger" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "startedAt" DATETIME,
    "completedAt" DATETIME,
    "creditsConsumed" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "WorkflowExecution_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_WorkflowExecution" ("completedAt", "createdAt", "id", "startedAt", "status", "trigger", "userId", "workflowId") SELECT "completedAt", "createdAt", "id", "startedAt", "status", "trigger", "userId", "workflowId" FROM "WorkflowExecution";
DROP TABLE "WorkflowExecution";
ALTER TABLE "new_WorkflowExecution" RENAME TO "WorkflowExecution";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
