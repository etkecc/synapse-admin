import { render, screen } from "@testing-library/react";

vi.mock("./providers/auth", () => ({
  __esModule: true,
  default: {
    logout: vi.fn().mockResolvedValue(undefined),
    handleCallback: vi.fn().mockResolvedValue({ redirectTo: "/" }),
  },
}));

import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "./i18n/en";

import App from "./App";

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en");

describe("App", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(new Response(JSON.stringify({}))));
  });

  it("renders", async () => {
    render(<App i18nProvider={i18nProvider} />);

    await screen.findAllByText("Welcome to Ketesa");
  });
});
