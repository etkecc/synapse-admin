import { render, screen } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

jest.mock("./providers/auth", () => ({
  __esModule: true,
  default: {
    logout: jest.fn().mockResolvedValue(undefined),
    handleCallback: jest.fn().mockResolvedValue({ redirectTo: "/" }),
  },
}));

import polyglotI18nProvider from "ra-i18n-polyglot";
import englishMessages from "./i18n/en";

import App from "./App";

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en");

describe("App", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    fetchMock.resetMocks();
    // Mock any fetch call to return empty JSON immediately
    fetchMock.mockResponseOnce(JSON.stringify({}));
  });

  it("renders", async () => {
    render(<App i18nProvider={i18nProvider} />);

    await screen.findAllByText("Welcome to Ketesa");
  });
});
