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
import { AddPropertyToJsonTask } from "../task/AddPropertyToJson";
import { NavigateUrlTask } from "../task/NavigateUrlTask";
import { ScrollToElementTask } from "../task/ScrollToElement";

type ExecutorRegistryType = {
  [K in TaskType]: (
    env: ExecutionEnv<WorkflowTask & { type: K }>
  ) => Promise<boolean>;
};

export const ExecutorRegistry: ExecutorRegistryType = {
  SCROLL_TO_ELEMENT: ScrollToElement,
  DELIVER_VIA_WEBHOOK: DeliverViaWebHook,
  LAUNCH_BROWSER: LaunchBrowserExecution,
  PAGE_TO_HTML: PageToHtmlExecution,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecution,
  FILL_INPUT: FillInput,
  CLICK_ELEMENT: ClickElement,
  WAIT_FOR_ELEMENT: WaitForElement,
  ADD_PROPERTY_TO_JSON: AddPropertyToJson,
  NAVIGATE_URL: NavigateUrl,
};

async function ScrollToElement(env: ExecutionEnv<typeof ScrollToElementTask>) {
  try {
    const selector = env.getInput("Selector");
    if (!selector) {
      env.log.ERROR("input->selector not defined");
    }
    await env.getPage()!.evaluate((selector) => {
      const element = document.querySelector(selector);
      if (!element) {
        throw new Error("Element not found");
      }
      const y = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: y });
    }, selector);
    return true;
  } catch (error: any) {
    env.log.ERROR(error.message);
    return false;
  }
}

async function NavigateUrl(env: ExecutionEnv<typeof NavigateUrlTask>) {
  try {
    const url = env.getInput("Url");
    if (!url) {
      env.log.ERROR("input->URL not defined");
    }
    await env.getPage()!.goto(url);
    env.log.INFO(`Url ${url} has been visited.`);
    return true;
  } catch (error: any) {
    env.log.ERROR(error.message);
    return false;
  }
}

async function AddPropertyToJson(
  env: ExecutionEnv<typeof AddPropertyToJsonTask>
): Promise<boolean> {
  try {
    const json = env.getInput("JSON");
    if (!json) {
      env.log.ERROR("input->JSON not defined");
    }
    const propertyName = env.getInput("Property name");
    if (!propertyName) {
      env.log.ERROR("input->propertyName not defined");
    }
    const propertyValue = env.getInput("Property value");
    if (!propertyValue) {
      env.log.ERROR("input->propertyValue not defined");
    }

    const parsedJSON = JSON.parse(json);
    parsedJSON[propertyName] = propertyValue;
    env.setOutput("Update JSON", JSON.stringify(parsedJSON));
    return true;
  } catch (error: any) {
    env.log.ERROR(error.message);
    return false;
  }
}

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
    // await env.getPage()!.click(selector);
    await env
      .getPage()!
      .$eval(selector, (elem) => (elem as HTMLElement).click());
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
