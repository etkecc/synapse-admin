import polyglotI18nProvider from "ra-i18n-polyglot";

import { render, screen } from "@testing-library/react";
import { AdminContext } from "react-admin";
import { BrowserRouter } from "react-router-dom";

import LoginPage from "./LoginPage";
import { AppContext } from "../Context";
import englishMessages from "../i18n/en";

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);
import { act } from "@testing-library/react";

describe("LoginForm", () => {
  it("renders with no restriction to homeserver", async () => {
    await act(async () => {
      render(
        <BrowserRouter>
          <AdminContext i18nProvider={i18nProvider}>
            <LoginPage />
          </AdminContext>
        </BrowserRouter>
      );
    });

    screen.getByText(englishMessages.synapseadmin.auth.welcome);
    screen.getByRole("combobox", { name: "" });
    screen.getByRole("textbox", { name: englishMessages.ra.auth.username });
    screen.getByText(englishMessages.ra.auth.password);
    const baseUrlInput = screen.getByRole("textbox", {
      name: englishMessages.synapseadmin.auth.base_url,
    });
    expect(baseUrlInput.className.split(" ")).not.toContain("Mui-readOnly");
    screen.getByRole("button", { name: englishMessages.ra.auth.sign_in });
  });

  it("renders with single restricted homeserver", () => {
    render(
      <BrowserRouter>
        <AppContext.Provider
          value={{ restrictBaseUrl: "https://matrix.example.com", asManagedUsers: [], menu: [] }}
        >
        <AdminContext i18nProvider={i18nProvider}>
          <LoginPage />
          </AdminContext>
        </AppContext.Provider>
      </BrowserRouter>
    );

    screen.getByText(englishMessages.synapseadmin.auth.welcome);
    screen.getByRole("combobox", { name: "" });
    screen.getByRole("textbox", { name: englishMessages.ra.auth.username });
    screen.getByText(englishMessages.ra.auth.password);
    const baseUrlInput = screen.getByRole("textbox", {
      name: englishMessages.synapseadmin.auth.base_url,
    });
    expect(baseUrlInput.className.split(" ")).toContain("Mui-readOnly");
    screen.getByRole("button", { name: englishMessages.ra.auth.sign_in });
  });

  it("renders with multiple restricted homeservers", async () => {
    render(
      <AppContext.Provider
          value={{
            restrictBaseUrl: ["https://matrix.example.com", "https://matrix.example.org"],
            asManagedUsers: [],
          menu: [],
        }}
      >
        <AdminContext i18nProvider={i18nProvider}>
          <BrowserRouter>
            <LoginPage />
          </BrowserRouter>
        </AdminContext>
      </AppContext.Provider>
    );

    screen.getByText(englishMessages.synapseadmin.auth.welcome);
    screen.getByRole("combobox", { name: "" });
    screen.getByRole("textbox", { name: englishMessages.ra.auth.username });
    screen.getByText(englishMessages.ra.auth.password);
    screen.getByRole("combobox", {
      name: englishMessages.synapseadmin.auth.base_url,
    });
    screen.getByRole("button", { name: englishMessages.ra.auth.sign_in });
  });
});
