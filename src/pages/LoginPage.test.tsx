import { act, render, screen } from "@testing-library/react";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { AdminContext } from "react-admin";

import LoginPage, { getDefaultProtocolForHomeserverInput } from "./LoginPage";
import { AppContext } from "../Context";
import englishMessages from "../i18n/en";

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);
const welcomeText = englishMessages.ketesa.auth.welcome.replace("%{name}", "Ketesa");

describe("LoginForm", () => {
  it.each([
    ["localhost", "http"],
    ["localhost:8008", "http"],
    ["127.0.0.1", "http"],
    ["127.0.0.1:8008", "http"],
    ["::1", "http"],
    ["[::1]:8008", "http"],
    ["matrix.example.com", "https"],
    ["matrix.example.com:8448", "https"],
  ])("selects %s for %s homeserver inputs", (input, expectedProtocol) => {
    expect(getDefaultProtocolForHomeserverInput(input)).toBe(expectedProtocol);
  });

  it("renders with no restriction to homeserver", async () => {
    await act(async () => {
      render(
        <AdminContext i18nProvider={i18nProvider}>
          <LoginPage />
        </AdminContext>
      );
    });

    screen.getByText(welcomeText);
    screen.getByRole("combobox", { name: "" }); // Language selector
    // Base URL input should be visible and editable
    const baseUrlInput = screen.getByRole("textbox", {
      name: englishMessages.ketesa.auth.base_url,
    });
    expect(baseUrlInput.className.split(" ")).not.toContain("Mui-readOnly");
    // Username and password fields are not visible until server info is checked
    // and supportPassAuth is determined
  });

  it("renders with single restricted homeserver", () => {
    render(
      <AppContext.Provider
        value={{
          restrictBaseUrl: "https://matrix.example.com",
          asManagedUsers: [],
          menu: [],
          corsCredentials: "include",
          externalAuthProvider: false,
        }}
      >
        <AdminContext i18nProvider={i18nProvider}>
          <LoginPage />
        </AdminContext>
      </AppContext.Provider>
    );

    screen.getByText(welcomeText);
    screen.getByRole("combobox", { name: "" }); // Language selector
    // Base URL field should not be visible when single restricted homeserver is set
    expect(() =>
      screen.getByRole("textbox", {
        name: englishMessages.ketesa.auth.base_url,
      })
    ).toThrow();
    // Username and password fields are not visible until server info is checked
    // and supportPassAuth is determined
  });

  it("renders with multiple restricted homeservers", async () => {
    render(
      <AppContext.Provider
        value={{
          restrictBaseUrl: ["https://matrix.example.com", "https://matrix.example.org"],
          asManagedUsers: [],
          menu: [],
          corsCredentials: "include",
          externalAuthProvider: false,
        }}
      >
        <AdminContext i18nProvider={i18nProvider}>
          <LoginPage />
        </AdminContext>
      </AppContext.Provider>
    );

    screen.getByText(welcomeText);
    screen.getByRole("combobox", { name: "" }); // Language selector
    // Base URL field should be visible as a combobox when multiple restricted homeservers are set
    screen.getByRole("combobox", {
      name: englishMessages.ketesa.auth.base_url,
    });
    // Username and password fields are not visible until server info is checked
    // and supportPassAuth is determined
  });
});
