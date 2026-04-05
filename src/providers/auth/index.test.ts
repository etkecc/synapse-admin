vi.mock("oidc-client-ts", () => {
  return {
    UserManager: vi.fn(function UserManager() {
      return {
        signinRedirectCallback: vi.fn().mockResolvedValue({
          access_token: "oidc_access_token",
          refresh_token: "oidc_refresh_token",
          id_token: "oidc_id_token",
          expires_in: 3600,
        }),
      };
    }),
  };
});

vi.mock("../data", () => ({
  initResources: vi.fn(),
}));

vi.mock("../data/mas", async () => ({
  ...(await vi.importActual("../data/mas")),
  detectAndSetMAS: vi.fn().mockResolvedValue(undefined),
}));

import { HttpError } from "ra-core";

import authProvider from "./index";
import { initResources } from "../data";
import { UserManager } from "oidc-client-ts";

describe("authProvider", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
    vi.clearAllMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("should successfully login with username and password", async () => {
      vi.mocked(fetch).mockResolvedValueOnce(
        new Response(
          JSON.stringify({
            home_server: "example.com",
            user_id: "@user:example.com",
            access_token: "foobar",
            device_id: "some_device",
          })
        )
      );
      vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({})));

      const ret = await authProvider.login({
        base_url: "http://example.com",
        username: "@user:example.com",
        password: "secret",
      });

      expect(ret).toEqual({ redirectTo: "/" });
      expect(fetch).toHaveBeenCalledWith("http://example.com/_matrix/client/v3/login", {
        body: '{"device_id":null,"initial_device_display_name":"Ketesa","type":"m.login.password","identifier":{"type":"m.id.user","user":"@user:example.com"},"password":"secret"}',
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "application/json",
        }),
        credentials: "same-origin",
        method: "POST",
      });
      expect(localStorage.getItem("base_url")).toEqual("http://example.com");
      expect(localStorage.getItem("user_id")).toEqual("@user:example.com");
      expect(localStorage.getItem("access_token")).toEqual("foobar");
      expect(localStorage.getItem("device_id")).toEqual("some_device");
    });
  });

  it("should successfully login with token", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          home_server: "example.com",
          user_id: "@user:example.com",
          access_token: "foobar",
          device_id: "some_device",
        })
      )
    );
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({})));

    const ret = await authProvider.login({
      base_url: "https://example.com/",
      loginToken: "login_token",
    });

    expect(ret).toEqual({ redirectTo: "/" });
    expect(fetch).toHaveBeenCalledWith("https://example.com/_matrix/client/v3/login", {
      body: '{"device_id":null,"initial_device_display_name":"Ketesa","type":"m.login.token","token":"login_token"}',
      headers: new Headers({
        Accept: "application/json",
        "Content-Type": "application/json",
      }),
      credentials: "same-origin",
      method: "POST",
    });
    expect(localStorage.getItem("base_url")).toEqual("https://example.com");
    expect(localStorage.getItem("user_id")).toEqual("@user:example.com");
    expect(localStorage.getItem("access_token")).toEqual("foobar");
    expect(localStorage.getItem("device_id")).toEqual("some_device");
  });

  it("handles OIDC callback via oidc-client-ts", async () => {
    localStorage.setItem("clientId", "client_id");
    localStorage.setItem("oidc_issuer", "https://issuer.example");
    localStorage.setItem("oidc_scope", "openid profile");
    localStorage.setItem("oidc_redirect_uri", "http://localhost:5173/auth-callback");
    localStorage.setItem("decoded_base_url", "http://example.com");

    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          user_id: "@user:example.com",
          device_id: "DEVICE",
        })
      )
    );
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify({})));

    const result = await authProvider.handleCallback?.();

    expect(UserManager).toHaveBeenCalledWith({
      authority: "https://issuer.example",
      client_id: "client_id",
      redirect_uri: "http://localhost:5173/auth-callback",
      response_type: "code",
      scope: "openid profile",
    });
    const userManagerInstance = vi.mocked(UserManager).mock.results[0].value;
    expect(userManagerInstance.signinRedirectCallback).toHaveBeenCalledTimes(1);
    expect(localStorage.getItem("access_token")).toBe("oidc_access_token");
    expect(localStorage.getItem("refresh_token")).toBe("oidc_refresh_token");
    expect(localStorage.getItem("id_token")).toBe("oidc_id_token");
    expect(localStorage.getItem("login_type")).toBe("credentials");
    expect(initResources).toHaveBeenCalledTimes(1);
    expect(result).toEqual({ redirectTo: "/" });
  });

  describe("logout", () => {
    it("should remove the access_token from storage", async () => {
      localStorage.setItem("base_url", "example.com");
      localStorage.setItem("access_token", "foo");
      vi.mocked(fetch).mockResolvedValue(new Response(JSON.stringify({})));

      await authProvider.logout(null);

      expect(fetch).toHaveBeenCalledWith("example.com/_matrix/client/v3/logout", {
        headers: new Headers({
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer foo",
        }),
        method: "POST",
        credentials: "same-origin",
        user: { authenticated: true, token: "Bearer foo" },
      });
      expect(localStorage.getItem("access_token")).toBeNull();
    });
  });

  describe("checkError", () => {
    it("should resolve if error.status is not 401", async () => {
      await expect(authProvider.checkError({ status: 200 })).resolves.toBeUndefined();
    });

    it("should reject if error.status is 401", async () => {
      await expect(
        authProvider.checkError(new HttpError("test-error", 401, { errcode: "test-errcode", error: "test-error" }))
      ).rejects.toBeDefined();
    });
  });

  describe("checkAuth", () => {
    it("should reject when not logged in", async () => {
      await expect(authProvider.checkAuth({})).rejects.toBeUndefined();
    });

    it("should resolve when logged in", async () => {
      localStorage.setItem("access_token", "foobar");

      await expect(authProvider.checkAuth({})).resolves.toBeUndefined();
    });
  });

  describe("getPermissions", () => {
    it("should do nothing", async () => {
      if (authProvider.getPermissions) {
        await expect(authProvider.getPermissions(null)).resolves.toBeUndefined();
      }
    });
  });
});
