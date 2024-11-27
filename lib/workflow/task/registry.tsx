import { TaskType } from "@/types/task";
import { LaunchBrowser } from "./LaunchBrowser";
import { PageToHtml } from "./PageToHtml";
import { ExtractTextFromElement } from "./ExtractTextFromElement";
import { WorkflowTask } from "@/types/workflow";
import { FillInputTask } from "./FillInput";
import { ClickElementTask } from "./ClickElement";
import { WaitForElementTask } from "./WaitForElement";
import { DeliverViaWebHookTask } from "./DeliverViaWebHook";
import { AddPropertyToJsonTask } from "./AddPropertyToJson";
import { NavigateUrlTask } from "./NavigateUrlTask";
import { ScrollToElementTask } from "./ScrollToElement";

type Registry = {
  [K in TaskType]: WorkflowTask & { type: K };
};

export const TaskRegistry: Registry = {
  [TaskType.SCROLL_TO_ELEMENT]: ScrollToElementTask,
  [TaskType.NAVIGATE_URL]: NavigateUrlTask,
  [TaskType.ADD_PROPERTY_TO_JSON]: AddPropertyToJsonTask,
  [TaskType.DELIVER_VIA_WEBHOOK]: DeliverViaWebHookTask,
  [TaskType.WAIT_FOR_ELEMENT]: WaitForElementTask,
  [TaskType.CLICK_ELEMENT]: ClickElementTask,
  [TaskType.FILL_INPUT]: FillInputTask,
  [TaskType.LAUNCH_BROWSER]: LaunchBrowser,
  [TaskType.PAGE_TO_HTML]: PageToHtml,
  [TaskType.EXTRACT_TEXT_FROM_ELEMENT]: ExtractTextFromElement,
};
