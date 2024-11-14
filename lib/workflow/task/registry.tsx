import { TaskType } from "@/types/task";
import { LaunchBrowser } from "./LaunchBrowser";
import { PageToHtml } from "./PageToHtml";
import { ExtractTextFromElement } from "./ExtractTextFromElement";

export const TaskRegistry = {
  [TaskType.LAUNCH_BROWSER]: LaunchBrowser,
  [TaskType.PAGE_TO_HTML]: PageToHtml,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElement,
};
