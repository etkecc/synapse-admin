import { render, screen, waitFor } from "@testing-library/react";
import fetchMock from "jest-fetch-mock";
fetchMock.enableMocks();

jest.mock("./synapse/authProvider", () => ({
  __esModule: true,
  default: {
    logout: jest.fn().mockResolvedValue(undefined),
    handleCallback: jest.fn().mockResolvedValue({ redirectTo: "/" }),
  },
}));

import App from "./App";
import authProvider from "./synapse/authProvider";

describe("App", () => {
  beforeEach(() => {
    // Reset all mocks before each test
    fetchMock.resetMocks();
    // Mock any fetch call to return empty JSON immediately
    fetchMock.mockResponseOnce(JSON.stringify({}));
  });

  it("renders", async () => {
    render(<App />);

    await screen.findAllByText("Welcome to Synapse Admin");
  });

  it("handles auth callback with trailing slash", async () => {
    const originalHref = window.location.href;
    window.history.replaceState({}, "", "/auth-callback/?code=abc");
    try {
      const mockedHandleCallback = authProvider.handleCallback as jest.Mock;
      mockedHandleCallback.mockReturnValue(new Promise(() => undefined));

      render(<App />);

      await waitFor(() => expect(mockedHandleCallback).toHaveBeenCalled());
    } finally {
      window.history.replaceState({}, "", originalHref);
    }
  });
});
