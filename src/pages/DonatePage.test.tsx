import { render, screen } from "@testing-library/react";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { AdminContext } from "react-admin";

import DonatePage, { DONATE_URL } from "./DonatePage";
import englishMessages from "../i18n/en";

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);

describe("DonatePage", () => {
  it("renders the approved english donation copy and CTA", () => {
    render(
      <AdminContext i18nProvider={i18nProvider}>
        <DonatePage />
      </AdminContext>
    );

    screen.getByRole("heading", { name: `${englishMessages.etkecc.donate.name} ✨` });
    screen.getByLabelText("Matrix");
    screen.getByText(/The Ketesa project is free and open source/i);
    screen.getByText(/community\./i);
    screen.getByText(englishMessages.etkecc.donate.description_2);
    screen.getByText(englishMessages.etkecc.donate.description_3);
    screen.getByText(englishMessages.etkecc.donate.description_4);
    screen.getByText(englishMessages.etkecc.donate.signature_team);

    const donateLink = screen.getByRole("link", { name: englishMessages.etkecc.donate.button });
    expect(donateLink).toHaveAttribute("href", DONATE_URL);
    expect(donateLink).toHaveAttribute("target", "_blank");
    expect(donateLink).toHaveAttribute("rel", "noreferrer");
  });
});
