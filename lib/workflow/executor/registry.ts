export const ExecutorRegistry = {
  LAUNCH_BROWSER: LaunchBrowserExecution,
  PAGE_TO_HTML: PageToHtmlExecution,
  EXTRACT_TEXT_FROM_ELEMENT: ExtractTextFromElementExecution,
};

async function LaunchBrowserExecution(env: any) {
  return true;
}

async function PageToHtmlExecution(env: any) {
  return true;
}

async function ExtractTextFromElementExecution(env: any) {
  return true;
}
