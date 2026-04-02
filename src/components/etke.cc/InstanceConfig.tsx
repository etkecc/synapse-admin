import { useSyncExternalStore } from "react";

import createLogger from "../../utils/logger";

const log = createLogger("instance-config");

export interface InstanceConfig {
  name?: string;
  logo_url?: string;
  favicon_url?: string;
  background_url?: string;
  disabled: DisableFeatures;
}

export interface DisableFeatures {
  support?: boolean;
  actions?: boolean;
  attributions?: boolean;
  federation?: boolean;
  monitoring?: boolean;
  notifications?: boolean;
  payments?: boolean;
  registration_tokens?: boolean;
}

let instanceConfig: InstanceConfig = {
  name: "",
  logo_url: "",
  favicon_url: "",
  background_url: "",
  disabled: {},
};

type InstanceConfigListener = () => void;

const instanceConfigListeners = new Set<InstanceConfigListener>();

const notifyInstanceConfigListeners = () => {
  instanceConfigListeners.forEach(listener => listener());
};

export const FetchInstanceConfig = async (etkeccAdminUrl: string | undefined, locale = "") => {
  if (!etkeccAdminUrl || etkeccAdminUrl === "") {
    return;
  }

  try {
    const resp = await fetch(`${etkeccAdminUrl}/config`, {
      headers: {
        "Accept-Language": locale,
      },
    });
    if (resp.status === 200) {
      const configJSON = (await resp.json()) as InstanceConfig;
      instanceConfig = configJSON;
      log.debug("instance config loaded", { url: etkeccAdminUrl });
      notifyInstanceConfigListeners();
      return;
    }

    switch (resp.status) {
      case 204:
        return;
      case 429:
        setTimeout(() => FetchInstanceConfig(etkeccAdminUrl, locale), 1000);
        return;
    }
    log.error(`FetchInstanceConfig: HTTP ${resp.status} ${resp.statusText}`, { url: etkeccAdminUrl });
  } catch (e) {
    log.error("FetchInstanceConfig failed", { url: etkeccAdminUrl, error: e });
  }
};

export const GetInstanceConfig = () => instanceConfig;

export const ClearInstanceConfig = () => {
  instanceConfig = {
    name: "",
    logo_url: "",
    favicon_url: "",
    background_url: "",
    disabled: {},
  };
  notifyInstanceConfigListeners();
};

export const SubscribeInstanceConfig = (listener: InstanceConfigListener) => {
  instanceConfigListeners.add(listener);
  return () => {
    instanceConfigListeners.delete(listener);
  };
};

export const useInstanceConfig = () => useSyncExternalStore(SubscribeInstanceConfig, GetInstanceConfig);
