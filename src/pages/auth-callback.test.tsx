import { act } from "react";
import { waitFor } from "@testing-library/react";

describe("auth-callback entrypoint", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.doUnmock("../utils/config");
    vi.doUnmock("../components/etke.cc/InstanceConfig");
    vi.doUnmock("../providers/auth");
  });

  it("redirects to provided path on success", async () => {
    const { runAuthCallback } = await import("./auth-callback");
    const handleCallback = vi.fn().mockResolvedValue({ redirectTo: "/server_status" });

    const result = await runAuthCallback({ handleCallback });

    expect(handleCallback).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ redirectTo: "/server_status" });
  }, 15000);

  it("shows error and does not redirect on failure", async () => {
    vi.doMock("../utils/config", async () => ({
      __esModule: true,
      ...(await vi.importActual("../utils/config")),
      FetchConfig: vi.fn().mockResolvedValue(undefined),
      GetConfig: () => ({ etkeccAdmin: "" }),
    }));
    vi.doMock("../components/etke.cc/InstanceConfig", async () => ({
      __esModule: true,
      ...(await vi.importActual("../components/etke.cc/InstanceConfig")),
      FetchInstanceConfig: vi.fn().mockResolvedValue(undefined),
      GetInstanceConfig: () => ({ name: "" }),
      useInstanceConfig: () => ({ name: "", disabled: { attributions: false } }),
    }));
    const { bootstrapAuthCallback } = await import("./auth-callback");
    document.body.innerHTML = '<div id="root"></div>';
    const rootElement = document.getElementById("root");
    const location = { origin: "http://localhost", href: "http://localhost/auth-callback?code=abc" };
    const handleCallback = vi.fn().mockRejectedValue(new Error("nope"));
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    await act(async () => {
      bootstrapAuthCallback(rootElement, location, { handleCallback });
      await Promise.resolve();
      await new Promise(resolve => setTimeout(resolve, 0));
      await new Promise(resolve => setTimeout(resolve, 0));
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(location.href).toBe("http://localhost/auth-callback?code=abc");
    await waitFor(() => expect(rootElement?.textContent).toContain("Authentication error"));
    expect(rootElement?.textContent).toContain("nope");
    expect(rootElement?.textContent).toContain("Welcome to Ketesa");
    expect(rootElement?.textContent).toContain("Go Back");
    expect(consoleSpy).toHaveBeenCalled();

    const button = rootElement?.querySelector("button");
    expect(button).toBeTruthy();
    button?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    expect(location.href).toBe("http://localhost/#/login");
  }, 15000);

  it("preserves subpath when redirecting", async () => {
    const { bootstrapAuthCallback } = await import("./auth-callback");
    const handleCallback = vi.fn().mockResolvedValue({ redirectTo: "/server_status" });
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
    const fetchConfig = vi.fn().mockResolvedValue(undefined);
    const fetchInstanceConfig = vi.fn().mockResolvedValue(undefined);
    const getConfig = vi.fn().mockReturnValue({ etkeccAdmin: "https://admin.example" });
    const handleCallback = vi.fn().mockResolvedValue({ redirectTo: "/" });
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

    vi.doMock("../utils/config", async () => ({
      __esModule: true,
      ...(await vi.importActual("../utils/config")),
      FetchConfig: fetchConfig,
      GetConfig: getConfig,
    }));
    vi.doMock("../components/etke.cc/InstanceConfig", async () => ({
      __esModule: true,
      ...(await vi.importActual("../components/etke.cc/InstanceConfig")),
      FetchInstanceConfig: fetchInstanceConfig,
      GetInstanceConfig: () => ({ name: "" }),
      useInstanceConfig: () => ({ name: "", disabled: { attributions: false } }),
    }));
    vi.doMock("../providers/auth", () => ({
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
    const handleCallback = vi.fn().mockResolvedValue({ redirectTo: "/server_status" });
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
