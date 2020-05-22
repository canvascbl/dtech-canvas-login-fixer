import { parse } from "querystring";
import { getConfig, setEnabled, setForwardingDestination } from "./storage";
import { getUrlMap } from "./urlMap";

const GET_REDIRECT_URL = "GET_REDIRECT_URL";
const GET_CONFIG = "GET_CONFIG";
const SET_ENABLED = "SET_ENABLED";
const SET_FORWARDING_DESTINATION = "SET_FORWARDING_DESTINATION";

const settingsUrl = chrome.runtime.getURL("/public/settings/index.html");
export const noRedirectFamilyPortalUrl =
  "https://sites.google.com/dtechhs.org/dtechfamilyportal/home?dtech_canvas_fixer_no_redirect=true";

async function handleMessage(
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: Function
) {
  const config = await getConfig();
  const { enabled, forwardingDestination } = config;

  switch (msg.type) {
    case GET_REDIRECT_URL:
      const { dtech_canvas_fixer_no_redirect: noRedirect } = parse(sender.url);
      if (!enabled || noRedirect === "true") {
        sendResponse();
        return;
      }

      if (!forwardingDestination) {
        sendResponse(settingsUrl);
        return;
      }

      const urlMap = await getUrlMap();
      console.log(urlMap);
      sendResponse(urlMap[forwardingDestination]);
      return;
    case GET_CONFIG:
      sendResponse(config);
      return;
    case SET_ENABLED:
      try {
        await setEnabled(msg.enabled);
        sendResponse({ success: true });
      } catch {
        sendResponse({ success: false });
      }
      return;
    case SET_FORWARDING_DESTINATION:
      try {
        await setForwardingDestination(msg.forwardingDestination);
        sendResponse({ success: true });
      } catch {
        sendResponse({ success: false });
      }
  }
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  handleMessage(msg, sender, sendResponse);
  return true;
});

chrome.browserAction.onClicked.addListener(() => {
  chrome.tabs.create({ url: settingsUrl });
});
