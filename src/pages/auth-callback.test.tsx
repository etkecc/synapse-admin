import { act } from "react-dom/test-utils";

describe("auth-callback entrypoint", () => {
  beforeEach(() => {
    jest.resetModules();
    jest.unmock("../utils/config");
    jest.unmock("../components/etke.cc/InstanceConfig");
    jest.unmock("../providers/authProvider");
  });

  it("redirects to provided path on success", async () => {
    const { runAuthCallback } = await import("./auth-callback");
    const handleCallback = jest.fn().mockResolvedValue({ redirectTo: "/server_status" });

    const result = await runAuthCallback({ handleCallback });

    expect(handleCallback).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ redirectTo: "/server_status" });
  });

  it("shows error and does not redirect on failure", async () => {
    const { bootstrapAuthCallback } = await import("./auth-callback");
    document.body.innerHTML = '<div id="root"></div>';
    const rootElement = document.getElementById("root");
    const location = { origin: "http://localhost", href: "http://localhost/auth-callback?code=abc" };
    const handleCallback = jest.fn().mockRejectedValue(new Error("nope"));
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => undefined);

    await act(async () => {
      bootstrapAuthCallback(rootElement, location, { handleCallback });
      await Promise.resolve();
      await new Promise(resolve => setTimeout(resolve, 0));
      await new Promise(resolve => setTimeout(resolve, 0));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(location.href).toBe("http://localhost/auth-callback?code=abc");
    expect(rootElement?.textContent).toContain("Authentication error");
    expect(rootElement?.textContent).toContain("nope");
    expect(rootElement?.textContent).toContain("Welcome to Ketesa");
    expect(rootElement?.textContent).toContain("Go Back");
    expect(consoleSpy).toHaveBeenCalled();

    const button = rootElement?.querySelector("button");
    expect(button).toBeTruthy();
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(location.href).toBe("http://localhost/#/login");
  });

  it("preserves subpath when redirecting", async () => {
    const { bootstrapAuthCallback } = await import("./auth-callback");
    const handleCallback = jest.fn().mockResolvedValue({ redirectTo: "/server_status" });
    const location = { origin: "http://localhost", href: "http://localhost/admin/auth-callback?code=abc" };

    document.body.innerHTML = '<div id="root"></div>';
    const rootElement = document.getElementById("root");

    await act(async () => {
      bootstrapAuthCallback(rootElement, location, { handleCallback });
      await Promise.resolve();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(handleCallback).toHaveBeenCalledTimes(1);
    expect(location.href).toBe("http://localhost/admin/#/server_status");
  });

  it("loads config before handling callback", async () => {
    const fetchConfig = jest.fn().mockResolvedValue(undefined);
    const fetchInstanceConfig = jest.fn().mockResolvedValue(undefined);
    const getConfig = jest.fn().mockReturnValue({ etkeccAdmin: "https://admin.example" });
    const handleCallback = jest.fn().mockResolvedValue({ redirectTo: "/" });
    const callOrder: string[] = [];

    fetchConfig.mockImplementation(async () => {
      callOrder.push("fetchConfig");
    });
    fetchInstanceConfig.mockImplementation(async () => {
      callOrder.push("fetchInstanceConfig");
    });
    handleCallback.mockImplementation(async () => {
      callOrder.push("handleCallback");
      return { redirectTo: "/" };
    });

    jest.doMock("../utils/config", () => ({
      __esModule: true,
      FetchConfig: fetchConfig,
      GetConfig: getConfig,
    }));
    jest.doMock("../components/etke.cc/InstanceConfig", () => ({
      __esModule: true,
      FetchInstanceConfig: fetchInstanceConfig,
      GetInstanceConfig: () => ({ name: "" }),
    }));
    jest.doMock("../providers/authProvider", () => ({
      __esModule: true,
      default: { handleCallback },
    }));

    const { bootstrapAuthCallback } = await import("./auth-callback");
    document.body.innerHTML = '<div id="root"></div>';
    const rootElement = document.getElementById("root");
    const location = { origin: "http://localhost", href: "http://localhost/auth-callback?code=abc" };

    await act(async () => {
      bootstrapAuthCallback(rootElement, location);
      await Promise.resolve();
      await new Promise(resolve => setTimeout(resolve, 0));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(fetchConfig).toHaveBeenCalledTimes(1);
    expect(fetchInstanceConfig).toHaveBeenCalledWith("https://admin.example", "");
    expect(handleCallback).toHaveBeenCalledTimes(1);
    expect(callOrder.indexOf("fetchConfig")).toBeLessThan(callOrder.indexOf("handleCallback"));
  });

  it.each([
    ["http://localhost/auth-callback?code=abc", "http://localhost/#/server_status", "root path"],
    ["http://localhost/auth-callback/?code=abc", "http://localhost/#/server_status", "root path trailing slash"],
    ["http://localhost/admin/auth-callback?code=abc", "http://localhost/admin/#/server_status", "subpath"],
    [
      "http://localhost/admin/ui/auth-callback/?code=abc",
      "http://localhost/admin/ui/#/server_status",
      "nested subpath trailing slash",
    ],
    [
      "http://localhost/admin/auth-callback?code=abc#fragment",
      "http://localhost/admin/#/server_status",
      "hash fragment",
    ],
    [
      "http://localhost/admin/auth-callback/index.html?code=abc",
      "http://localhost/admin/#/server_status",
      "explicit index.html",
    ],
    [
      "http://localhost/admin/auth-callback/index.html/?code=abc",
      "http://localhost/admin/#/server_status",
      "explicit index.html trailing slash",
    ],
    [
      "http://localhost:8080/admin/auth-callback?code=abc",
      "http://localhost:8080/admin/#/server_status",
      "custom port",
    ],
  ])("normalizes callback base (%s)", async (href, expectedHref) => {
    const { bootstrapAuthCallback } = await import("./auth-callback");
    const handleCallback = jest.fn().mockResolvedValue({ redirectTo: "/server_status" });
    const location = {
      origin: new URL(href).origin,
      href: href,
    };
    document.body.innerHTML = '<div id="root"></div>';
    const rootElement = document.getElementById("root");

    await act(async () => {
      bootstrapAuthCallback(rootElement, location, { handleCallback });
      await Promise.resolve();
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(location.href).toBe(expectedHref);
  });
});
