import { act, fireEvent, render, screen } from "@testing-library/react";
import { memoryStore } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { AdminContext, DataProvider } from "react-admin";

import { ServerNotificationsBadge } from "./ServerNotificationsBadge";
import { AppContext } from "../../Context";
import englishMessages from "../../i18n/en";
import { Config } from "../../utils/config";
import { NotificationsStatus, ServerNotification } from "../../providers/types";

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);

const baseConfig: Config = {
  restrictBaseUrl: "",
  corsCredentials: "include",
  asManagedUsers: [],
  menu: [],
  externalAuthProvider: false,
  etkeccAdmin: "https://example.com",
};

interface RenderOpts {
  status: NotificationsStatus;
  notifications?: ServerNotification[];
  getServerNotifications?: ReturnType<typeof vi.fn>;
}

const renderBadge = async ({ status, notifications = [], getServerNotifications }: RenderOpts) => {
  const response = { success: status !== "unavailable", status, notifications };
  const fetchFn = getServerNotifications ?? vi.fn().mockResolvedValue(response);
  const dataProvider = {
    getServerNotifications: fetchFn,
    deleteServerNotifications: vi.fn().mockResolvedValue({ success: true }),
  };

  const store = memoryStore({
    serverNotifications: response,
    serverProcess: { command: "", locked_at: "", maintenance: false },
  });

  await act(async () => {
    render(
      <AppContext.Provider value={baseConfig}>
        <AdminContext i18nProvider={i18nProvider} store={store} dataProvider={dataProvider as unknown as DataProvider}>
          <ServerNotificationsBadge />
        </AdminContext>
      </AppContext.Provider>
    );
  });
  await act(async () => {
    await Promise.resolve();
  });

  return { dataProvider };
};

describe("ServerNotificationsBadge", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders count badge when status is ok and list is non-empty", async () => {
    await renderBadge({
      status: "ok",
      notifications: [
        { event_id: "$1", output: "n1", sent_at: "2026-04-22 10:00:00" },
        { event_id: "$2", output: "n2", sent_at: "2026-04-22 11:00:00" },
      ],
    });

    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders bell with no-notifications tooltip when status is ok and list is empty", async () => {
    await renderBadge({ status: "ok", notifications: [] });

    expect(screen.getByRole("button", { name: /No notifications yet/i })).toBeInTheDocument();
  });

  it("renders advisory tooltip when status is advisory", async () => {
    await renderBadge({ status: "advisory", notifications: [] });

    expect(screen.getByRole("button", { name: /You may have missed a notification/i })).toBeInTheDocument();
  });

  it("renders unavailable tooltip when status is unavailable", async () => {
    await renderBadge({ status: "unavailable", notifications: [] });

    expect(screen.getByRole("button", { name: /Notifications may be unavailable/i })).toBeInTheDocument();
  });

  it("opens the guidance panel and triggers refetch when clicked in unavailable state", async () => {
    const refetch = vi.fn().mockResolvedValue({
      success: false,
      status: "unavailable" as NotificationsStatus,
      notifications: [],
    });
    const { dataProvider } = await renderBadge({
      status: "unavailable",
      notifications: [],
      getServerNotifications: refetch,
    });

    // Initial mount triggers one fetch; opening the Popper in unavailable state triggers exactly one more.
    const initialCalls = dataProvider.getServerNotifications.mock.calls.length;
    await act(async () => {
      fireEvent.click(screen.getByRole("button", { name: /Notifications may be unavailable/i }));
    });

    expect(screen.getByText(/Notifications may be unavailable right now/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
    expect(dataProvider.getServerNotifications).toHaveBeenCalledTimes(initialCalls + 1);
  });
});
