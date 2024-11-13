import { TaskParamType } from "@/types/task";

export const ColorForhandle: Record<TaskParamType, string> = {
  [TaskParamType.BROWSER_INSTANCE]: "!bg-sky-400",
  [TaskParamType.STRING]: "!bg-amber-400",
};
