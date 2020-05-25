const randString = (): string => `${Math.random()}`;

const getAlertContainer = (): HTMLElement => document.getElementById("alert_container");

export const getEnableAutoForwardingCheckbox = (): HTMLElement =>
    document.getElementById("enabled_checkbox");

export const getStudentStaffLoginCheckbox = (): HTMLElement =>
    document.getElementById("saml_radio");

export const getParentLoginCheckbox = (): HTMLElement => document.getElementById("canvas_radio");

export function addAlert(type: string, body: string, timeout: number = 0): string {
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

export function toggleDisabled(el: HTMLElement): void {
    el.toggleAttribute("disabled");
}

export function toggleChecked(el: HTMLElement): void {
    el.toggleAttribute("checked");
}