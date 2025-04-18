import fetchMock from "jest-fetch-mock";
import { HttpError } from "ra-core";

import authProvider from "./authProvider";

fetchMock.enableMocks();

describe("authProvider", () => {
  beforeEach(() => {
    fetchMock.resetMocks();
    localStorage.clear();
  });

  describe("login", () => {
    it("should successfully login with username and password", async () => {
      fetchMock.once(
        JSON.stringify({
          home_server: "example.com",
          user_id: "@user:example.com",
          access_token: "foobar",
          device_id: "some_device",
        })
      );

      const ret = await authProvider.login({
        base_url: "http://example.com",
        username: "@user:example.com",
        password: "secret",
      });

      expect(ret).toEqual({ redirectTo: "/" });
      expect(fetch).toHaveBeenCalledWith("http://example.com/_matrix/client/v3/login", {
        body: '{"device_id":null,"initial_device_display_name":"Synapse Admin","type":"m.login.password","identifier":{"type":"m.id.user","user":"@user:example.com"},"password":"secret"}',
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
    fetchMock.once(
      JSON.stringify({
        home_server: "example.com",
        user_id: "@user:example.com",
        access_token: "foobar",
        device_id: "some_device",
      })
    );

    const ret = await authProvider.login({
      base_url: "https://example.com/",
      loginToken: "login_token",
    });

    expect(ret).toEqual({ redirectTo: "/" });
    expect(fetch).toHaveBeenCalledWith("https://example.com/_matrix/client/v3/login", {
      body: '{"device_id":null,"initial_device_display_name":"Synapse Admin","type":"m.login.token","token":"login_token"}',
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

  describe("logout", () => {
    it("should remove the access_token from storage", async () => {
      localStorage.setItem("base_url", "example.com");
      localStorage.setItem("access_token", "foo");
      fetchMock.mockResponse(JSON.stringify({}));

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
    it("should resolve if error.status is not 401 or 403", async () => {
      await expect(authProvider.checkError({ status: 200 })).resolves.toBeUndefined();
    });

    it("should reject if error.status is 401", async () => {
      await expect(
        authProvider.checkError(new HttpError("test-error", 401, { errcode: "test-errcode", error: "test-error" }))
      ).rejects.toBeDefined();
    });

    it("should reject if error.status is 403", async () => {
      await expect(
        authProvider.checkError(new HttpError("test-error", 403, { errcode: "test-errcode", error: "test-error" }))
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
