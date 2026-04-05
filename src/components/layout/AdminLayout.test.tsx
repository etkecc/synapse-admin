import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AdminUserMenu } from "./AdminLayout";

const onClose = vi.fn();

vi.mock("react-admin", () => {
  const Menu = Object.assign(({ children }) => <div>{children}</div>, {
    Item: ({ children }) => <div>{children}</div>,
    ResourceItem: ({ children }) => <div>{children}</div>,
  });

  return {
    CheckForApplicationUpdate: () => null,
    AppBar: ({ children }) => <div>{children}</div>,
    TitlePortal: () => null,
    InspectorButton: () => null,
    Confirm: () => null,
    Layout: ({ children }) => <div>{children}</div>,
    LoadingIndicator: () => null,
    Logout: () => <button type="button">Logout</button>,
    Menu,
    ToggleThemeButton: () => null,
    useLogout: () => vi.fn(),
    UserMenu: ({ children }) => <div>{children}</div>,
    useNotify: () => vi.fn(),
    useStore: (_key, defaultValue) => [defaultValue, vi.fn()],
    useLocaleState: () => ["en", vi.fn()],
    useLocale: () => "en",
    useLocales: () => [
      { locale: "en", name: "English" },
      { locale: "de", name: "Deutsch" },
    ],
    useTranslate: () => key => {
      const messages = {
        "etkecc.donate.menu_label": "Donate",
        "ra.auth.user_menu": "Profile",
      };
      return messages[key] || key;
    },
    useUserMenu: () => ({ onClose }),
    useResourceDefinitions: () => ({}),
  };
});

vi.mock("../../providers/data", () => ({
  setDataProviderNotifier: vi.fn(),
}));

vi.mock("../users/AdminClientConfigItems", () => ({
  AdminClientConfigItems: () => <div>Admin client config</div>,
}));

vi.mock("../../providers/serverVersion", () => ({
  useServerVersions: () => ({ synapse: "", mas: "" }),
}));

vi.mock("../../utils/config", () => ({
  ClearConfig: vi.fn(),
}));

vi.mock("../etke.cc/InstanceConfig", () => ({
  ClearInstanceConfig: vi.fn(),
  useInstanceConfig: () => ({
    disabled: {
      notifications: false,
      monitoring: false,
      actions: false,
      payments: false,
      support: false,
      federation: false,
      registration_tokens: false,
    },
  }),
}));

vi.mock("../etke.cc/ServerNotificationsBadge", () => ({
  ServerNotificationsBadge: () => null,
}));

vi.mock("../etke.cc/ServerStatusBadge", () => ({
  EtkeStatusPoller: () => null,
  ServerStatusStyledBadge: () => null,
}));

vi.mock("../../providers/data/mas", () => ({
  isMAS: () => false,
}));

vi.mock("../../Context", () => ({
  useAppContext: () => ({
    menu: [],
    etkeccAdmin: "",
  }),
}));

describe("AdminUserMenu", () => {
  beforeEach(() => {
    onClose.mockReset();
    window.location.hash = "";
    localStorage.clear();
  });

  it("renders donate above logout and navigates to the donate page", async () => {
    const user = userEvent.setup();

    render(<AdminUserMenu />);

    const donateItem = screen.getByText("Donate");
    const logoutButton = screen.getByRole("button", { name: "Logout" });

    expect(donateItem.compareDocumentPosition(logoutButton) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();

    await user.click(donateItem);

    expect(onClose).toHaveBeenCalledTimes(1);
    expect(window.location.hash).toBe("#/donate");
  });
});
