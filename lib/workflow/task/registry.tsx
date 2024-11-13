import { TaskType } from "@/types/task";
import { LaunchBrowser } from "./LaunchBrowser";

export const TaskRegistry = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowser,
};