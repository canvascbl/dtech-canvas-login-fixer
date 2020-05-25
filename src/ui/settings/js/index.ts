import {
  addAlert,
  getEnableAutoForwardingCheckbox,
  getParentLoginCheckbox,
  getStudentStaffLoginCheckbox,
  toggleChecked,
  toggleDisabled
} from "./domutil";

interface Config {
  enabled?: boolean;
  forwardingDestination?: "saml" | "canvas";
}

let noLoginTypeAlertId: string;

function init(config: Config): void {
  const autoForwardCheckbox = getEnableAutoForwardingCheckbox();
  if (config.enabled) {
    toggleChecked(autoForwardCheckbox);
  }
  toggleDisabled(autoForwardCheckbox);

  const samlRadio = getStudentStaffLoginCheckbox();
  const canvasRadio = getParentLoginCheckbox();

  switch (config.forwardingDestination) {
    case "saml":
      toggleChecked(samlRadio);
      break;
    case "canvas":
      toggleChecked(canvasRadio);
      break;
    default:
      noLoginTypeAlertId = addAlert(
          "warning",
          "You haven't set a login type! Set one below to get started."
      );
      break;
  }
  toggleDisabled(samlRadio);
  toggleDisabled(canvasRadio);
}

chrome.runtime.sendMessage({ type: "GET_CONFIG" }, (config) => init(config));

function saveForwardingSetting(forwardingDestination: Config["forwardingDestination"]) {
  if (noLoginTypeAlertId) {
    document.getElementById(noLoginTypeAlertId).remove();
    noLoginTypeAlertId = "";
  }

  chrome.runtime.sendMessage(
      {
        type: "SET_FORWARDING_DESTINATION",
        forwardingDestination,
      },
      ({ success }) => {
        if (success) {
          addAlert(
              "success",
              "Saved forwarding destination! Head to Canvas when you're logged out to try it!",
              2500
          );
        } else {
          addAlert("danger", "Error saving forwarding destination", 2500);
        }
      }
  );
}

getEnableAutoForwardingCheckbox().addEventListener("click", async (e: MouseEvent) => {
  const target = e.target as HTMLInputElement;
  chrome.runtime.sendMessage(
      { type: "SET_ENABLED", enabled: target.checked },
      ({ success }) => {
        if (success) {
          addAlert("success", "Saved auto-forwarding setting!", 2500);
        } else {
          addAlert("danger", "Error saving auto-forwarding setting", 2500);
        }
      }
  );
});

getStudentStaffLoginCheckbox().addEventListener("click", () =>
    saveForwardingSetting("saml")
);
getParentLoginCheckbox().addEventListener("click", () =>
    saveForwardingSetting("canvas")
);
