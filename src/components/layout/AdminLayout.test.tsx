import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "vitest-axe";

import { AdminUserMenu, ActiveMenuItemLink, ActiveResourceItem } from "./AdminLayout";

// ── react-router-dom mock ──────────────────────────────────────────────────────
// useMatch is the only import used by the two components under test.
// matchRef.current lets each test control whether the route is "active".
const matchRef: { current: object | null } = { current: null };

vi.mock("react-router-dom", () => ({
  useMatch: vi.fn(() => matchRef.current),
}));

const onClose = vi.fn();

vi.mock("react-admin", () => {
  // Menu.Item and Menu.ResourceItem forward aria-current so tests can assert on it.
  const Menu = Object.assign(({ children }) => <div>{children}</div>, {
    Item: ({ children, primaryText, "aria-current": ariaCurrent, to }) => (
      <a href={`#${to}`} aria-current={ariaCurrent}>
        {primaryText ?? children}
      </a>
    ),
    ResourceItem: ({ "aria-current": ariaCurrent, name }) => (
      <a href={`#/${name}`} aria-current={ariaCurrent}>
        {name}
      </a>
    ),
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

describe("ActiveMenuItemLink aria-current", () => {
  beforeEach(() => {
    matchRef.current = null;
  });

  it("has no accessibility violations", async () => {
    matchRef.current = { params: {}, pathname: "/billing", pathnameBase: "/billing" };
    const { container } = render(<ActiveMenuItemLink to="/billing" primaryText="Billing" />);
    const results = await axe(container);
    expect(results.violations).toHaveLength(0);
  });

  it("sets aria-current='page' when useMatch returns a match", () => {
    // Simulates the user being on the /billing route: useMatch returns a truthy
    // PathMatch object, so ActiveMenuItemLink injects aria-current="page".
    matchRef.current = { params: {}, pathname: "/billing", pathnameBase: "/billing" };
    render(<ActiveMenuItemLink to="/billing" primaryText="Billing" />);
    const link = screen.getByRole("link", { name: "Billing" });
    expect(link.getAttribute("aria-current")).toBe("page");
  });

  it("omits aria-current when useMatch returns null (route not active)", () => {
    // useMatch returns null → not on /billing → no aria-current attribute.
    matchRef.current = null;
    render(<ActiveMenuItemLink to="/billing" primaryText="Billing" />);
    const link = screen.getByRole("link", { name: "Billing" });
    expect(link.getAttribute("aria-current")).toBeNull();
  });
});

describe("ActiveResourceItem aria-current", () => {
  beforeEach(() => {
    matchRef.current = null;
  });

  it("sets aria-current='page' when useMatch returns a match", () => {
    // Simulates the user being on /users or a sub-route like /users/123/show:
    // useMatch({ path: '/users', end: false }) returns a match.
    matchRef.current = { params: {}, pathname: "/users", pathnameBase: "/users" };
    render(<ActiveResourceItem name="users" />);
    const link = screen.getByRole("link", { name: "users" });
    expect(link.getAttribute("aria-current")).toBe("page");
  });

  it("omits aria-current when useMatch returns null (different resource active)", () => {
    // useMatch returns null → not on /users → no aria-current.
    matchRef.current = null;
    render(<ActiveResourceItem name="users" />);
    const link = screen.getByRole("link", { name: "users" });
    expect(link.getAttribute("aria-current")).toBeNull();
  });
});
