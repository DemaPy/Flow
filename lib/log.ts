import { Log, LogCollector, LogLevel } from "@/types/environment";

export function createLogCollector(): LogCollector {
  const logs: Log[] = [];

  return {
    ERROR: (message) => {
      logs.push({
        level: LogLevel.ERROR,
        message,
        timestamp: new Date(),
      });
    },
    INFO: (message) => {
      logs.push({
        level: LogLevel.INFO,
        message,
        timestamp: new Date(),
      });
    },
    getAll: () => {
      return logs;
    },
  };
}
