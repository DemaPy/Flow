-- CreateTable
CREATE TABLE "Executionlog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "logLevel" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "executionPhaseId" TEXT NOT NULL,
    CONSTRAINT "Executionlog_executionPhaseId_fkey" FOREIGN KEY ("executionPhaseId") REFERENCES "ExecutionPhase" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
