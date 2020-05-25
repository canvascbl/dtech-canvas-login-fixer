import WebRequestBodyDetails = chrome.webRequest.WebRequestBodyDetails;

import { getConfig } from "./storage";
import { getUrlMap } from "./urlMap";
import { openSettingsInNewTab } from "./index";

export async function performRedirect(body: WebRequestBodyDetails) {
  const config = await getConfig();
  const { enabled, forwardingDestination } = config;

  const noRedirect =
    new URL(body.url).searchParams.get("dtech_canvas_fixer_no_redirect") ===
    "true";
  if (!enabled || noRedirect) {
    return;
  }

  if (!forwardingDestination) {
    openSettingsInNewTab();
    chrome.tabs.remove(body.tabId);
    return;
  }

  const urlMap = await getUrlMap();
  chrome.tabs.update(body.tabId, { url: urlMap[forwardingDestination] });
  return;
}
