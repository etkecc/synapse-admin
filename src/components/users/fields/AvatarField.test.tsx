import { render, screen, waitFor } from "@testing-library/react";
import { act } from "react";
import { RecordContextProvider } from "react-admin";

import AvatarField from "./AvatarField";

describe("AvatarField", () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = vi.fn(() =>
      Promise.resolve(new Response(new Blob(["mock image data"], { type: "image/jpeg" })))
    ) as unknown as typeof fetch;

    // Mock URL.createObjectURL
    global.URL.createObjectURL = vi.fn(() => "mock-object-url");
    localStorage.setItem("base_url", "https://example.org");
    localStorage.setItem("access_token", "secret-token");
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows image", async () => {
    const value = {
      avatar: "mxc://serverName/mediaId",
    };

    await act(async () => {
      render(
        <RecordContextProvider value={value}>
          <AvatarField source="avatar" />
        </RecordContextProvider>
      );
    });

    await waitFor(() => {
      const img = screen.getByRole("img");
      expect(img.getAttribute("src")).toBe("mock-object-url");
    });

    expect(global.fetch).toHaveBeenCalled();
  });
});
