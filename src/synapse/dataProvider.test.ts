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
});
