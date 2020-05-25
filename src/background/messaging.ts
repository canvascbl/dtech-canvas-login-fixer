import { getConfig, setEnabled, setForwardingDestination } from "./storage";

const GET_CONFIG = "GET_CONFIG";
const SET_ENABLED = "SET_ENABLED";
const SET_FORWARDING_DESTINATION = "SET_FORWARDING_DESTINATION";

export async function handleMessage(
  msg: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: Function
) {
  const config = await getConfig();
  const { enabled, forwardingDestination } = config;

  switch (msg.type) {
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
