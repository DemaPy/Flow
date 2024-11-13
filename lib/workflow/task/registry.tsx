import { TaskType } from "@/types/task";
import { LaunchBrowser } from "./LaunchBrowser";
import { PageToHtml } from "./PageToHtml";

export const TaskRegistry = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowser,
  [TaskType.PAGE_TO_HTML]: PageToHtml,
};
