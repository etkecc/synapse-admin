jest.mock("./matrix", () => ({
  refreshAccessToken: jest.fn().mockResolvedValue(undefined),
}));

import fetchMock from "jest-fetch-mock";
import dataProvider, { initRegistrationTokens } from "./dataProvider";
import { refreshAccessToken } from "./matrix";

fetchMock.enableMocks();

beforeEach(() => {
  fetchMock.resetMocks();
  jest.clearAllMocks();
  localStorage.clear();
  localStorage.setItem("base_url", "http://localhost");
  localStorage.setItem("access_token", "access_token");
});

describe("dataProvider", () => {
  it("fetches all users", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        users: [
          {
            name: "@user_id1:provider",
            password_hash: "password_hash1",
            is_guest: 0,
            admin: 0,
            user_type: null,
            deactivated: 0,
            displayname: "User One",
          },
          {
            name: "@user_id2:provider",
            password_hash: "password_hash2",
            is_guest: 0,
            admin: 1,
            user_type: null,
            deactivated: 0,
            displayname: "User Two",
          },
        ],
        next_token: "100",
        total: 200,
      })
    );

    const users = await dataProvider.getList("users", {
      pagination: { page: 1, perPage: 5 },
      sort: { field: "title", order: "ASC" },
      filter: { author_id: 12 },
    });

    expect(users.data[0].id).toEqual("@user_id1:provider");
    expect(users.total).toEqual(200);
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("fetches one user", async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        name: "@user_id1:provider",
        password: "user_password",
        displayname: "User",
        threepids: [
          {
            medium: "email",
            address: "user@mail_1.com",
          },
          {
            medium: "email",
            address: "user@mail_2.com",
          },
        ],
        avatar_url: "mxc://localhost/user1",
        admin: false,
        deactivated: false,
      })
    );

    const user = await dataProvider.getOne("users", { id: "@user_id1:provider" });

    expect(user.data.id).toEqual("@user_id1:provider");
    expect(user.data.displayname).toEqual("User");
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  it("refreshes token before MAS admin availability check", async () => {
    const now = Date.now();
    localStorage.setItem("token_endpoint", "http://mas.example/oauth2/token");
    localStorage.setItem("refresh_token", "refresh_token");
    localStorage.setItem("access_token_expires_at", `${now - 1000}`);

    fetchMock.mockResponseOnce(JSON.stringify({}));

    await initRegistrationTokens();

    expect(refreshAccessToken).toHaveBeenCalledTimes(1);
    const [url] = fetchMock.mock.calls[0];
    expect(url).toBe("http://mas.example/api/admin/v1/site-config");
  });

  it("skips MAS availability check when no access token", async () => {
    localStorage.setItem("token_endpoint", "http://mas.example/oauth2/token");
    localStorage.removeItem("access_token");

    await initRegistrationTokens();

    expect(fetch).not.toHaveBeenCalled();
  });

  it("uses MAS pagination cursor on page 2", async () => {
    jest.resetModules();
    // Re-import after reset so MAS registration tokens init isn't cached from prior tests.
    const { default: freshDataProvider } = await import("./dataProvider");

    localStorage.setItem("token_endpoint", "http://mas.example/oauth2/token");

    const masListPage1 = {
      links: {
        self: "/api/admin/v1/user-registration-tokens?page%5Bafter%5D=01JB4PAPAMESEFX6CNP1JA5M6V&page%5Bfirst%5D=10",
        first: "/api/admin/v1/user-registration-tokens?page%5Bfirst%5D=10",
        last: "/api/admin/v1/user-registration-tokens?page%5Bafter%5D=01JB4PAPG3N9FS0YVQTMYV0NG&page%5Bfirst%5D=10",
        next: "/api/admin/v1/user-registration-tokens?page%5Bafter%5D=01JB4PAPAMESEFX6CNP1JA5M6V&page%5Bfirst%5D=10",
        prev: null,
      },
      data: [
        {
          type: "user-registration-token",
          id: "01JB4PAPAMESEFX6CNP1JA5M6V",
          attributes: {
            token: "5lQl96lyEJwMRx1c1Vx0Q2O93",
            valid: true,
            usage_limit: null,
            times_used: 0,
            created_at: "2024-06-10T10:12:21.184Z",
            last_used_at: null,
            expires_at: null,
            revoked_at: null,
          },
        },
      ],
      meta: {
        count: 1,
      },
    };

    const masListPage2 = {
      links: {
        self: "/api/admin/v1/user-registration-tokens?page%5Bafter%5D=01JB4PAPG3N9FS0YVQTMYV0NG&page%5Bfirst%5D=10",
        first: "/api/admin/v1/user-registration-tokens?page%5Bfirst%5D=10",
        last: "/api/admin/v1/user-registration-tokens?page%5Bafter%5D=01JB4PAPG3N9FS0YVQTMYV0NG&page%5Bfirst%5D=10",
        next: null,
        prev: "/api/admin/v1/user-registration-tokens?page%5Bbefore%5D=01JB4PAPG3N9FS0YVQTMYV0NG&page%5Bfirst%5D=10",
      },
      data: [],
      meta: {
        count: 1,
      },
    };

    fetchMock
      .mockResponseOnce(JSON.stringify({}))
      .mockResponseOnce(JSON.stringify(masListPage1))
      .mockResponseOnce(JSON.stringify(masListPage2));

    await freshDataProvider.getList("registration_tokens", {
      pagination: { page: 1, perPage: 10 },
      sort: { field: "token", order: "ASC" },
      filter: { valid: true },
    });

    await freshDataProvider.getList("registration_tokens", {
      pagination: { page: 2, perPage: 10 },
      sort: { field: "token", order: "ASC" },
      filter: { valid: true },
    });

    const [page2Url] = fetchMock.mock.calls[2];
    expect(page2Url).toContain("http://mas.example/api/admin/v1/user-registration-tokens?");
    expect(page2Url).toContain("page%5Bfirst%5D=10");
    expect(page2Url).toContain("page%5Bafter%5D=01JB4PAPAMESEFX6CNP1JA5M6V");
    expect(page2Url).toContain("filter%5Bvalid%5D=true");
  });
});
