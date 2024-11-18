import { Browser, Page } from "puppeteer";
import { WorkflowTask } from "./workflow";

export type Environment = {
  browser?: Browser;
  page?: Page;
  phases: {
    [key: string]: {
      inputs: Record<string, string>;
      outputs: Record<string, string>;
    };
  };
};

export enum LogLevel {
  INFO = "INFO",
  ERROR = "ERROR",
}

export type Log = {
  message: string;
  level: LogLevel;
  timestamp: Date;
};

export type LogCollector = {
  getAll(): Log[];
} & {
  [K in LogLevel]: (message: string) => void;
};

export type ExecutionEnv<T extends WorkflowTask> = {
  getInput(name: T["inputs"][number]["name"]): string;
  getBrowser(): Browser | undefined;
  setBrowser(browser: Browser): void;
  getPage(): Page | undefined;
  setPage(page: Page): void;
  setOutput(name: T["outputs"][number]["name"], value: string): void;
  log: LogCollector;
};
