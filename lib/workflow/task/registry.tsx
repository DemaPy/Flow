import { TaskType } from "@/types/task";
import { LaunchBrowser } from "./LaunchBrowser";
import { PageToHtml } from "./PageToHtml";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./FillInput";
import { ClickElement } from "./ClickElement";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  [TaskType.CLICK_ELEMENT]: ClickElement,
  [TaskType.FILL_INPUT]: FillInputTask,
  [TaskType.LAUNCH_BROWSER]: LaunchBrowser,
  [TaskType.PAGE_TO_HTML]: PageToHtml,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElement,
};
