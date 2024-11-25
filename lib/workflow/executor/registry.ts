import { ExecutionEnv } from "@/types/environment";
import { TaskType } from "@/types/task";
import { WorkflowTask } from "@/types/workflow";
import puppetter from "puppeteer";
import { LaunchBrowser } from "../task/LaunchBrowser";
import { PageToHtml } from "../task/PageToHtml";
import { ExtractTextFromElement } from "../task/ExtractTextFromElement";
import * as cheerio from "cheerio";
import { FillInputTask } from "../task/FillInput";
import { ClickElementTask } from "../task/ClickElement";
import { WaitForElementTask } from "../task/WaitForElement";
import { DeliverViaWebHookTask } from "../task/DeliverViaWebHook";

type ExecutorRegistryType = {
  [K in TaskType]: (
    env: ExecutionEnv<WorkflowTask & { type: K }>
  ) => Promise<boolean>;
};

export const ExecutorRegistry: ExecutorRegistryType = {
  DELIVER_VIA_WEBHOOK: DeliverViaWebHook,
  LAUNCH_BROWSER: LaunchBrowserExecution,
  PAGE_TO_HTML: PageToHtmlExecution,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecution,
  FILL_INPUT: FillInput,
  CLICK_ELEMENT: ClickElement,
  WAIT_FOR_ELEMENT: WaitForElement,
};

async function DeliverViaWebHook(
  env: ExecutionEnv<typeof DeliverViaWebHookTask>
): Promise<boolean> {
  try {
    const url = env.getInput("Target url");
    if (!url) {
      env.log.ERROR("Url not defined");
    }

    const body = env.getInput("Body");
    if (!body) {
      env.log.ERROR("Body not defined");
    }
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      env.log.ERROR("Status code: " + response.status);
      return false;
    }
    const result = await response.json();
    env.log.INFO(JSON.stringify(result));
    return true;
  } catch (error: any) {
    env.log.ERROR(error.message);
    return false;
  }
}

async function WaitForElement(
  env: ExecutionEnv<typeof WaitForElementTask>
): Promise<boolean> {
  try {
    const selector = env.getInput("Selector");
    if (!selector) {
      env.log.ERROR("input->selector not defined");
    }

    const visibility = env.getInput("Visibility");
    if (!visibility) {
      env.log.ERROR("input->visibility not defined");
    }
    await env.getPage()!.waitForSelector(selector, {
      visible: visibility === "visible",
      hidden: visibility === "hidden",
    });

    env.log.INFO(`Element ${selector} became: ${visibility}`);
    return true;
  } catch (error: any) {
    env.log.ERROR(error.message);
    return false;
  }
}

async function ClickElement(
  env: ExecutionEnv<typeof ClickElementTask>
): Promise<boolean> {
  try {
    const selector = env.getInput("Selector");
    if (!selector) {
      env.log.ERROR("input->selector not defined");
    }
    await env.getPage()!.click(selector);
    return true;
  } catch (error: any) {
    env.log.ERROR(error.message);
    return false;
  }
}

async function FillInput(
  env: ExecutionEnv<typeof FillInputTask>
): Promise<boolean> {
  try {
    const selector = env.getInput("Selector");
    if (!selector) {
      env.log.ERROR("input->selector not defined");
    }
    const value = env.getInput("Value");
    if (!value) {
      env.log.ERROR("input->value not defined");
    }
    await env.getPage()!.type(selector, value);
    return true;
  } catch (error: any) {
    env.log.ERROR(error.message);
    return false;
  }
}

async function LaunchBrowserExecution(
  env: ExecutionEnv<typeof LaunchBrowser>
): Promise<boolean> {
  try {
    const url = env.getInput("Website Url");
    const browser = await puppetter.launch({ headless: true });
    env.log.INFO("Browser started successfully");
    env.setBrowser(browser);
    const page = await browser.newPage();
    await page.goto(url);
    env.setPage(page);
    env.log.INFO(`Page ${url} loaded successfully`);
    return true;
  } catch (error: any) {
    env.log.ERROR(error.message);
    return false;
  }
}

async function PageToHtmlExecution(env: ExecutionEnv<typeof PageToHtml>) {
  try {
    const html = await env.getPage()!.content();
    env.setOutput("Html", html);
    return true;
  } catch (error: any) {
    env.log.ERROR(error.message);
    return false;
  }
}

async function ExtractTextFromElementExecution(
  env: ExecutionEnv<typeof ExtractTextFromElement>
) {
  try {
    const selector = env.getInput("Selector");
    if (!selector) {
      env.log.ERROR("Selector not found.");
      return false;
    }
    const html = env.getInput("Html");
    if (!html) {
      env.log.ERROR("HTML not found.");
      return false;
    }

    const $ = cheerio.load(html);
    const element = $(selector);

    if (!element) {
      env.log.ERROR("Element not found.");
      return false;
    }

    const extractedText = $.text(element);
    if (!extractedText) {
      env.log.ERROR("Text not found.");
      return false;
    }

    env.setOutput("Extracted text", extractedText);
    return true;
  } catch (error: any) {
    env.log.ERROR(error.message);
    return false;
  }
}
