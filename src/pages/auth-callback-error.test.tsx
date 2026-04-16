import { act } from "react";
import { createRoot } from "react-dom/client";
import { waitFor } from "@testing-library/react";

vi.mock("../i18n", async () => {
  const polyglotI18nProvider = (await import("ra-i18n-polyglot")).default;
  const englishMessages = (await import("../i18n/en")).default;
  return {
    createI18nProvider: async () =>
      polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]),
  };
});

vi.mock("../components/etke.cc/InstanceConfig", () => ({
  useInstanceConfig: vi.fn(() => ({
    name: "",
    logo_url: "",
    background_url: "",
    disabled: { attributions: false },
  })),
}));

import { useInstanceConfig } from "../components/etke.cc/InstanceConfig";
import { renderAuthCallbackError } from "./auth-callback-error";

const mockUseInstanceConfig = vi.mocked(useInstanceConfig);

describe("renderAuthCallbackError", () => {
  let container: HTMLDivElement;
  let root: ReturnType<typeof createRoot>;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    root = createRoot(container);
    mockUseInstanceConfig.mockReturnValue({
      name: "",
      logo_url: "",
      background_url: "",
      disabled: { attributions: false },
    } as ReturnType<typeof useInstanceConfig>);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });
    container.remove();
  });

  it("renders the error message", async () => {
    const onBack = vi.fn();
    await act(async () => {
      await renderAuthCallbackError(root, { message: "Something went wrong", onBack });
    });
    await waitFor(() => {
      expect(container.textContent).toContain("Something went wrong");
    });
  });

  it("renders the Go Back button", async () => {
    const onBack = vi.fn();
    await act(async () => {
      await renderAuthCallbackError(root, { message: "Oops", onBack });
    });
    await waitFor(() => {
      const button = container.querySelector("button");
      expect(button).toBeTruthy();
    });
  });

  it("calls onBack when the button is clicked", async () => {
    const onBack = vi.fn();
    await act(async () => {
      await renderAuthCallbackError(root, { message: "Oops", onBack });
    });
    await waitFor(() => expect(container.querySelector("button")).toBeTruthy());

    act(() => {
      container.querySelector("button")?.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });
    expect(onBack).toHaveBeenCalledTimes(1);
  });

  it("shows the welcome text with default Ketesa branding", async () => {
    const onBack = vi.fn();
    await act(async () => {
      await renderAuthCallbackError(root, { message: "Oops", onBack });
    });
    await waitFor(() => {
      expect(container.textContent).toContain("Ketesa");
    });
  });

  it("shows custom instance name when configured", async () => {
    mockUseInstanceConfig.mockReturnValue({
      name: "My Matrix Admin",
      logo_url: "",
      background_url: "",
      disabled: { attributions: false },
    } as ReturnType<typeof useInstanceConfig>);

    const onBack = vi.fn();
    await act(async () => {
      await renderAuthCallbackError(root, { message: "Oops", onBack });
    });
    await waitFor(() => {
      expect(container.textContent).toContain("My Matrix Admin");
    });
  });
});
