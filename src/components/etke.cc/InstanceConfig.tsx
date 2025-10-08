export interface InstanceConfig {
  name?: string;
  logo_url?: string;
  favicon_url?: string;
  background_url?: string;
  disabled: DisableFeatures;
}

export interface DisableFeatures {
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

export const FetchInstanceConfig = async (etkeccAdminUrl: string) => {
  if (!etkeccAdminUrl || etkeccAdminUrl === "") {
    return;
  }

  try {
    const resp = await fetch(`${etkeccAdminUrl}/config`);
    if (resp.status === 200) {
      const configJSON = (await resp.json()) as InstanceConfig;
      instanceConfig = configJSON;
      console.log("Fetched instance config:", instanceConfig);
      return;
    }

    switch (resp.status) {
      case 204:
        return;
      case 429:
        setTimeout(() => FetchInstanceConfig(etkeccAdminUrl), 1000);
        return;
    }
    console.error(`Error fetching instance config: ${resp.status} ${resp.statusText}`);
  } catch (e) {
    console.error(`Error fetching instance config: ${e}`);
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
};
