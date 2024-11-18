import { Environment, ExecutionEnv } from "@/types/environment";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import puppetter from "puppeteer";
import { LaunchBrowser } from "../task/LaunchBrowser";
import { PageToHtml } from "../task/PageToHtml";
import { ExtractTextFromElement } from "../task/ExtractTextFromElement";

type ExecutorRegistryType = {
  [K in TaskType]: (
    env: ExecutionEnv<WorkflowTask & { type: K }>
  ) => Promise<boolean>;
};

export const ExecutorRegistry: ExecutorRegistryType = {
  LAUNCH_BROWSER: LaunchBrowserExecution,
  PAGE_TO_HTML: PageToHtmlExecution,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecution,
};

async function LaunchBrowserExecution(
  env: ExecutionEnv<typeof LaunchBrowser>
): Promise<boolean> {
  try {
    console.log(env.getInput("Website Url"));
    const browser = await puppetter.launch({ headless: false });
    await new Promise((resolve) => setTimeout(resolve, 3000));
    await browser.close();
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function PageToHtmlExecution(env: ExecutionEnv<typeof PageToHtml>) {
  return true;
}

async function ExtractTextFromElementExecution(
  env: ExecutionEnv<typeof ExtractTextFromElement>
) {
  return true;
}
