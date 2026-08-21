import { render, screen, waitFor } from "@testing-library/react";
import { memoryStore } from "ra-core";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { AdminContext } from "react-admin";
import { MemoryRouter, Route, Routes } from "react-router-dom";

import SupportRequestPage from "./SupportRequestPage";
import englishMessages from "../../i18n/en";
import { AppContext } from "../../Context";
import type { Config } from "../../utils/config";
import type { SynapseDataProvider, SupportRequestDetail } from "../../providers/types";

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);

const requestWithAttachments: SupportRequestDetail = {
  id: 42,
  subject: "My support request",
  status: "active",
  messages: [
    {
      id: 1,
      type: "customer",
      text: "Hello, please help",
      created_at: "2026-08-21T10:00:00Z",
      attachments: [
        { id: 7, fileName: "screenshot.png", mimeType: "image/png", size: 2048 },
        { id: 8, fileName: "logs.txt", mimeType: "text/plain", size: 12345 },
      ],
    },
    {
      id: 2,
      type: "operator",
      text: "Sure, we will look into it",
      created_at: "2026-08-21T11:00:00Z",
    },
  ],
};

const renderPage = (dataProvider: Partial<SynapseDataProvider>) => {
  const store = memoryStore();
  const config = { etkeccAdmin: "https://etke.cc" } as Config;
  return render(
    <MemoryRouter initialEntries={["/support/42"]}>
      <AdminContext i18nProvider={i18nProvider} dataProvider={dataProvider as SynapseDataProvider} store={store}>
        <AppContext.Provider value={config}>
          <Routes>
            <Route path="/support/:id" element={<SupportRequestPage />} />
          </Routes>
        </AppContext.Provider>
      </AdminContext>
    </MemoryRouter>
  );
};

describe("SupportRequestPage", () => {
  it("renders attachment chips for messages that have attachments", async () => {
    renderPage({
      getSupportRequest: vi.fn().mockResolvedValue(requestWithAttachments),
    });

    await waitFor(() => {
      expect(screen.getByText("screenshot.png (2.0 KB)")).toBeInTheDocument();
    });

    screen.getByText("logs.txt (12.1 KB)");
    screen.getByText(englishMessages.etkecc.support.fields.attachments);
    // only the customer message has attachments; the operator reply must not add a label
    expect(screen.getAllByText(englishMessages.etkecc.support.fields.attachments)).toHaveLength(1);
  });

  it("shows no attachments label when no message has attachments", async () => {
    const requestWithoutAttachments: SupportRequestDetail = {
      ...requestWithAttachments,
      messages: [{ id: 1, type: "customer", text: "Hello, please help" }],
    };
    renderPage({
      getSupportRequest: vi.fn().mockResolvedValue(requestWithoutAttachments),
    });

    await waitFor(() => {
      expect(screen.getByText("Hello, please help")).toBeInTheDocument();
    });

    expect(screen.queryByText(englishMessages.etkecc.support.fields.attachments)).not.toBeInTheDocument();
  });
});
