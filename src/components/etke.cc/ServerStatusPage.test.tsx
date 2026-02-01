import { render, screen } from "@testing-library/react";
import { memoryStore } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { AdminContext } from "react-admin";

import ServerStatusPage from "./ServerStatusPage";
import englishMessages from "../../i18n/en";
import { ServerProcessResponse, ServerStatusComponent, ServerStatusResponse } from "../../synapse/dataProvider";

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);

const renderWithStore = (serverStatus: ServerStatusResponse, serverProcess?: ServerProcessResponse) => {
  const store = memoryStore({
    serverStatus,
    serverProcess: serverProcess ?? { command: "", locked_at: "", maintenance: false },
  });

  return render(
    <AdminContext i18nProvider={i18nProvider} store={store}>
      <ServerStatusPage />
    </AdminContext>
  );
};

describe("ServerStatusPage", () => {
  it("shows maintenance notice when maintenance mode is active", () => {
    renderWithStore({
      success: true,
      maintenance: true,
      ok: false,
      host: "",
      results: [],
    });

    expect(
      screen.getAllByText((_, node) => node?.textContent?.includes(englishMessages.etkecc.maintenance.title) ?? false)
        .length
    ).toBeGreaterThan(0);
    expect(
      screen.getAllByText((_, node) => node?.textContent?.includes(englishMessages.etkecc.maintenance.note) ?? false)
        .length
    ).toBeGreaterThan(0);
  });

  it("shows loading state when status is not yet available", () => {
    renderWithStore({
      success: false,
      maintenance: false,
      ok: false,
      host: "",
      results: [],
    });

    screen.getByText(englishMessages.etkecc.status.loading);
  });

  it("renders grouped results, host, and help link when status is loaded", () => {
    const results: ServerStatusComponent[] = [
      {
        ok: true,
        category: "HTTP",
        reason: "",
        url: "",
        help: "",
        label: {
          url: "https://status.example.com",
          icon: "",
          text: "Health endpoint",
        },
      },
      {
        ok: false,
        category: "Matrix",
        reason: "Federation <strong>down</strong>",
        url: "",
        help: "https://help.example.com",
        label: {
          url: "",
          icon: "",
          text: "Federation status",
        },
      },
    ];

    renderWithStore(
      {
        success: true,
        maintenance: false,
        ok: true,
        host: "matrix.example.com",
        results,
      },
      {
        command: "rolling_restart",
        locked_at: "",
        maintenance: false,
      }
    );

    screen.getByText("Status:");
    screen.getByText("matrix.example.com");
    screen.getByText("rolling_restart");
    screen.getByText(englishMessages.etkecc.status.category.HTTP);
    screen.getByText(englishMessages.etkecc.status.category.Matrix);
    screen.getByRole("link", { name: "Health endpoint" });
    screen.getByText("Federation status");
    expect(
      screen.getAllByText((_, node) => (node?.textContent ?? "").replace(/\s+/g, " ").includes("Federation down"))
        .length
    ).toBeGreaterThan(0);
    screen.getByRole("link", { name: englishMessages.etkecc.status.help });
  });
});
