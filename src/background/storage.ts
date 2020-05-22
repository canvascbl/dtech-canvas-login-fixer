export interface Config {
  enabled?: boolean;
  forwardingDestination?: "saml" | "canvas";
}

const defaultConfig: Config = {
  enabled: true,
};

export async function getConfig(): Promise<Config> {
  const { config } = await storageGet(["config"]);
  if (!config) {
    await storagePut({ config: defaultConfig });
    return defaultConfig;
  }

  return config as Config;
}

export async function setEnabled(enabled: Config["enabled"]): Promise<null> {
  const config = await getConfig();

  return storagePut({ config: { ...config, enabled } });
}

export async function setForwardingDestination(
  forwardingDestination: Config["forwardingDestination"]
) {
  const config = await getConfig();

  return storagePut({ config: { ...config, forwardingDestination } });
}

async function storageGet(
  keys: string | Array<string> | null
): Promise<{ [key: string]: any }> {
  return new Promise((res, rej) => {
    chrome.storage.sync.get(keys, (items) => res(items));
    if (chrome.runtime.lastError) {
      rej(chrome.runtime.lastError);
    }
  });
}

async function storagePut(items: {
  [key: string]: any | Config;
}): Promise<null> {
  return new Promise((res, rej) => {
    chrome.storage.sync.set(items, () => res());
    if (chrome.runtime.lastError) {
      rej(chrome.runtime.lastError);
    }
  });
}
