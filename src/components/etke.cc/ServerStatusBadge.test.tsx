import { act, render, screen, waitFor } from "@testing-library/react";
import { memoryStore } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { AdminContext } from "react-admin";
import { useNavigate } from "react-router";

import ServerStatusBadge from "./ServerStatusBadge";
import { AppContext } from "../../Context";
import englishMessages from "../../i18n/en";
import { Config } from "../../utils/config";

jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useNavigate: jest.fn(),
}));

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);

const baseConfig: Config = {
  restrictBaseUrl: "",
  corsCredentials: "include",
  asManagedUsers: [],
  menu: [],
  externalAuthProvider: false,
  etkeccAdmin: "https://example.com",
};

const renderBadge = async ({
  serverStatus,
  serverProcess,
  config = baseConfig,
  mockServerStatus,
  mockServerProcess,
}: {
  serverStatus: { success: boolean; ok: boolean; maintenance?: boolean; host: string; results: [] };
  serverProcess?: { command: string; locked_at: string; maintenance?: boolean };
  config?: Config;
  mockServerStatus?: { success: boolean; ok: boolean; maintenance?: boolean; host: string; results: [] };
  mockServerProcess?: { command: string; locked_at: string; maintenance?: boolean };
}) => {
  const dataProvider = {
    getServerStatus: jest.fn().mockResolvedValue(
      mockServerStatus ?? {
        success: true,
        ok: true,
        maintenance: false,
        host: "",
        results: [],
      }
    ),
    getServerRunningProcess: jest.fn().mockResolvedValue(
      mockServerProcess ?? {
        command: "",
        locked_at: "",
        maintenance: false,
      }
    ),
  };

  const store = memoryStore({
    serverStatus,
    serverProcess: serverProcess ?? { command: "", locked_at: "", maintenance: false },
  });

  await act(async () => {
    render(
      <AppContext.Provider value={config}>
        <AdminContext i18nProvider={i18nProvider} store={store} dataProvider={dataProvider}>
          <ServerStatusBadge />
        </AdminContext>
      </AppContext.Provider>
    );
  });
  await act(async () => {
    await Promise.resolve();
  });

  return { dataProvider };
};

describe("ServerStatusBadge", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.clearAllTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it("renders nothing when status is not loaded", async () => {
    await renderBadge({
      serverStatus: { success: false, ok: false, maintenance: false, host: "", results: [] },
      config: { ...baseConfig, etkeccAdmin: "" },
    });

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("renders badge, fetches status, and navigates on click", async () => {
    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    const { dataProvider } = await renderBadge({
      serverStatus: { success: true, ok: true, maintenance: false, host: "", results: [] },
    });

    const button = await screen.findByRole("button");
    expect(button).toBeInTheDocument();
    expect(screen.getByLabelText(englishMessages.etkecc.status.badge.default)).toBeInTheDocument();

    button.click();
    expect(navigate).toHaveBeenCalledWith("/server_status");

    await waitFor(() => expect(dataProvider.getServerStatus).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dataProvider.getServerRunningProcess).toHaveBeenCalledTimes(1));
  });

  it("uses running tooltip text when a command is active", async () => {
    const command = "rolling_restart";
    const tooltipText = englishMessages.etkecc.status.badge.running
      .replace("%{command}", command)
      .replace("%{text}", englishMessages.etkecc.status.badge.default);

    const { dataProvider } = await renderBadge({
      serverStatus: { success: true, ok: true, maintenance: false, host: "", results: [] },
      serverProcess: { command, locked_at: "2025-01-01T00:00:00Z", maintenance: false },
      mockServerProcess: { command, locked_at: "2025-01-01T00:00:00Z", maintenance: false },
    });

    await screen.findByRole("button");
    expect(screen.getByLabelText(tooltipText)).toBeInTheDocument();
    await waitFor(() => expect(dataProvider.getServerStatus).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(dataProvider.getServerRunningProcess).toHaveBeenCalledTimes(1));
  });
});
