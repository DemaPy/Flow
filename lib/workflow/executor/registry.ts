import { ExecutionEnv } from "@/types/environment";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import puppetter from "puppeteer";
import { LaunchBrowser } from "../task/LaunchBrowser";
import { PageToHtml } from "../task/PageToHtml";
import { ExtractTextFromElement } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";

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
    const url = env.getInput("Website Url");
    const browser = await puppetter.launch({ headless: true });
    env.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(url);
    env.setPage(page);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function PageToHtmlExecution(env: ExecutionEnv<typeof PageToHtml>) {
  try {
    const html = await env.getPage()!.content();
    env.setOutput("Html", html);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function ExtractTextFromElementExecution(
  env: ExecutionEnv<typeof ExtractTextFromElement>
) {
  try {
    const selector = env.getInput("Selector");
    if (!selector) {
      console.log("Selector not found.");
      return false;
    }
    const html = env.getInput("Html");
    if (!html) {
      console.log("HTML not found.");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      console.log("Element not found.");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      console.log("Element not found.");
      return false;
    }

    env.setOutput("Extracted text", extractedText);
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
