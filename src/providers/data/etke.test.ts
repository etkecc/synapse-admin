import { etkeProviderMethods } from "./etke";

beforeEach(() => {
  vi.stubGlobal("fetch", vi.fn());
  vi.clearAllMocks();
  localStorage.clear();
  localStorage.setItem("access_token", "test_token");
});

describe("getServerNotifications", () => {
  const url = "https://admin.example/etke";

  it("maps X-Notifications-Advisory: none to status ok", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([{ event_id: "$a", output: "body", sent_at: "2026-04-22" }]), {
        status: 200,
        headers: { "X-Notifications-Advisory": "none" },
      })
    );

    const result = await etkeProviderMethods.getServerNotifications(url, "en");

    expect(result.status).toBe("ok");
    expect(result.success).toBe(true);
    expect(result.notifications).toHaveLength(1);
  });

  it("maps X-Notifications-Advisory: possibly_missed to status advisory", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(
      new Response(JSON.stringify([]), {
        status: 200,
        headers: { "X-Notifications-Advisory": "possibly_missed" },
      })
    );

    const result = await etkeProviderMethods.getServerNotifications(url, "en");

    expect(result.status).toBe("advisory");
    expect(result.success).toBe(true);
  });

  it("defaults to status ok when advisory header is absent", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(JSON.stringify([]), { status: 200 }));

    const result = await etkeProviderMethods.getServerNotifications(url, "en");

    expect(result.status).toBe("ok");
    expect(result.success).toBe(true);
  });

  it("returns ok + empty list on 204 No Content", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 204 }));

    const result = await etkeProviderMethods.getServerNotifications(url, "en");

    expect(result.status).toBe("ok");
    expect(result.success).toBe(true);
    expect(result.notifications).toEqual([]);
  });

  it("returns unavailable on 503", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 503 }));

    const result = await etkeProviderMethods.getServerNotifications(url, "en");

    expect(result.status).toBe("unavailable");
    expect(result.success).toBe(false);
    expect(result.notifications).toEqual([]);
  });

  it("returns unavailable on non-ok HTTP (e.g. 500)", async () => {
    vi.mocked(fetch).mockResolvedValueOnce(new Response(null, { status: 500, statusText: "Server Error" }));

    const result = await etkeProviderMethods.getServerNotifications(url, "en");

    expect(result.status).toBe("unavailable");
    expect(result.success).toBe(false);
  });

  it("returns unavailable when fetch rejects (network error)", async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error("network down"));

    const result = await etkeProviderMethods.getServerNotifications(url, "en");

    expect(result.status).toBe("unavailable");
    expect(result.success).toBe(false);
  });
});
