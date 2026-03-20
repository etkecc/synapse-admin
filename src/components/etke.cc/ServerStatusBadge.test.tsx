import { act, render, waitFor } from "@testing-library/react";
import { memoryStore } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { AdminContext, DataProvider } from "react-admin";

import { EtkeStatusPoller } from "./ServerStatusBadge";
import { AppContext } from "../../Context";
import englishMessages from "../../i18n/en";
import { Config } from "../../utils/config";

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);

const baseConfig: Config = {
  restrictBaseUrl: "",
  corsCredentials: "include",
  asManagedUsers: [],
  menu: [],
  externalAuthProvider: false,
  etkeccAdmin: "https://example.com",
};

const renderPoller = async (config: Config = baseConfig) => {
  const dataProvider = {
    getServerStatus: jest.fn().mockResolvedValue({ success: true, ok: true, maintenance: false, host: "", results: [] }),
    getServerRunningProcess: jest.fn().mockResolvedValue({ command: "", locked_at: "", maintenance: false }),
  };

  const store = memoryStore({
    serverStatus: { success: false, ok: false, maintenance: false, host: "", results: [] },
    serverProcess: { command: "", locked_at: "", maintenance: false },
  });

  await act(async () => {
    render(
      <AppContext.Provider value={config}>
        <AdminContext i18nProvider={i18nProvider} store={store} dataProvider={dataProvider as unknown as DataProvider}>
          <EtkeStatusPoller />
        </AdminContext>
      </AppContext.Provider>
    );
  });
  await act(async () => {
    await Promise.resolve();
  });

  return { dataProvider };
};

describe("EtkeStatusPoller", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("polls server status and process when etkeccAdmin is set", async () => {
    const { dataProvider } = await renderPoller();

    await waitFor(() => expect(dataProvider.getServerStatus).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dataProvider.getServerRunningProcess).toHaveBeenCalledTimes(1));
  });

  it("does not poll when etkeccAdmin is not set", async () => {
    const { dataProvider } = await renderPoller({ ...baseConfig, etkeccAdmin: "" });

    expect(dataProvider.getServerStatus).not.toHaveBeenCalled();
    expect(dataProvider.getServerRunningProcess).not.toHaveBeenCalled();
  });
});
