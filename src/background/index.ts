import { getUrlMap } from "./urlMap";
import { handleMessage } from "./messaging";
import { performRedirect } from "./redirect";

const settingsUrl = chrome.runtime.getURL("/ui/settings/index.html");
export const noRedirectFamilyPortalUrl =
  "https://sites.google.com/dtechhs.org/dtechfamilyportal/home?dtech_canvas_fixer_no_redirect=true";

export function openSettingsInNewTab(): void {
  chrome.tabs.create({ url: settingsUrl });
}

// add onMessage listener
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  handleMessage(msg, sender, sendResponse);
  return true;
});

// add onClicked listener
chrome.browserAction.onClicked.addListener(() => {
  openSettingsInNewTab();
});

// add onInstalled listener
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === "install") {
    openSettingsInNewTab();
  }
});

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    performRedirect(details);
  },
  {
    urls: ["*://sites.google.com/dtechhs.org/dtechfamilyportal/home*"],
    types: ["main_frame", "sub_frame"],
  }
);

// fetch the URL map on startup
getUrlMap();
// and fetch it every 24h.
setInterval(() => getUrlMap(true), 86400 * 1000);
