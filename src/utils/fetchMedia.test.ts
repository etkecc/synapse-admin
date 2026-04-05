import { fetchAuthenticatedMedia, getServerAndMediaIdFromMxcUrl } from "./fetchMedia";

describe("getServerAndMediaIdFromMxcUrl", () => {
  it("extracts the server name and media id from a valid MXC URL", () => {
    expect(getServerAndMediaIdFromMxcUrl("mxc://matrix.example/media-123")).toEqual({
      serverName: "matrix.example",
      mediaId: "media-123",
    });
  });

  it("returns empty values for invalid MXC URLs", () => {
    expect(getServerAndMediaIdFromMxcUrl("https://example.org/not-mxc")).toEqual({
      serverName: "",
      mediaId: "",
    });
  });
});

describe("fetchAuthenticatedMedia", () => {
  beforeEach(() => {
    localStorage.clear();
    localStorage.setItem("base_url", "https://hs.example");
    localStorage.setItem("access_token", "secret-token");
    global.fetch = jest.fn();
  });

  it("returns a 400 response for invalid MXC URLs without fetching", async () => {
    const response = await fetchAuthenticatedMedia("invalid", "thumbnail");

    expect(response.status).toBe(400);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it("fetches thumbnails with the authenticated media URL", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 200 }));

    await fetchAuthenticatedMedia("mxc://matrix.example/media123", "thumbnail");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hs.example/_matrix/client/v1/media/thumbnail/matrix.example/media123?width=320&height=240&method=scale",
      {
        headers: {
          authorization: "Bearer secret-token",
        },
      }
    );
  });

  it("fetches originals with quarantine bypass enabled", async () => {
    (global.fetch as jest.Mock).mockResolvedValue(new Response(null, { status: 200 }));

    await fetchAuthenticatedMedia("mxc://matrix.example/media123", "original");

    expect(global.fetch).toHaveBeenCalledWith(
      "https://hs.example/_matrix/client/v1/media/download/matrix.example/media123/?admin_unsafely_bypass_quarantine=true",
      {
        headers: {
          authorization: "Bearer secret-token",
        },
      }
    );
  });
});
