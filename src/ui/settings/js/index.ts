interface Config {
  enabled?: boolean;
  forwardingDestination?: "saml" | "canvas";
}

const randString = (): string => `${Math.random()}`;

const getAlertContainer = (): HTMLElement => document.getElementById("alert_container");

const getEnableAutoForwardingCheckbox = (): HTMLElement =>
    document.getElementById("enabled_checkbox");

const getStudentStaffLoginCheckbox = (): HTMLElement =>
    document.getElementById("saml_radio");
const getParentLoginCheckbox = (): HTMLElement => document.getElementById("canvas_radio");

function addAlert(type: string, body: string, timeout: number = 0): string {
  const id = randString();
  const el = document.createElement("div");
  el.className = `alert alert-${type}`;
  el.innerText = body;
  el.id = id;

  getAlertContainer().appendChild(el);
  if (timeout > 0) {
    setTimeout(() => {
      document.getElementById(id).remove();
    }, timeout);
  }

  return id;
}

function toggleDisabled(el: HTMLElement): void {
  el.toggleAttribute("disabled");
}

function toggleChecked(el: HTMLElement): void {
  el.toggleAttribute("checked");
}

let nologinTypeAlertId: string;

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
      nologinTypeAlertId = addAlert(
          "warning",
          "You haven't set a login type! Set one below to get started."
      );
      break;
  }
  toggleDisabled(samlRadio);
  toggleDisabled(canvasRadio);
}

chrome.runtime.sendMessage({ type: "GET_CONFIG" }, (config) => init(config));

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

function saveForwardingSetting(forwardingDestination: Config["forwardingDestination"]) {
  if (nologinTypeAlertId) {
    document.getElementById(nologinTypeAlertId).remove();
    nologinTypeAlertId = "";
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

getStudentStaffLoginCheckbox().addEventListener("click", () =>
    saveForwardingSetting("saml")
);
getParentLoginCheckbox().addEventListener("click", () =>
    saveForwardingSetting("canvas")
);
