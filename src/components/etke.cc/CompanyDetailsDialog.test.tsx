import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { AdminContext } from "react-admin";
import { beforeEach, describe, expect, it, vi } from "vitest";

import englishMessages from "../../i18n/en";

// useRedirect is mocked so the success-view "View request" button doesn't need a router mounted.
const redirect = vi.fn();
vi.mock("react-admin", async importOriginal => {
  const actual = await importOriginal<typeof import("react-admin")>();
  return { ...actual, useRedirect: () => redirect };
});

// imported after the mock is registered so the component picks up the mocked useRedirect.
const { CompanyDetailsDialog } = await import("./CompanyDetailsDialog");

const t = englishMessages.etkecc.billing.company_details;
const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);

const makeProvider = (createSupportRequest = vi.fn().mockResolvedValue({ id: 42 })) => ({ createSupportRequest });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderDialog = (dataProvider: any, onClose = vi.fn()) =>
  render(
    <AdminContext i18nProvider={i18nProvider} dataProvider={dataProvider}>
      <CompanyDetailsDialog etkeccAdmin="https://admin.example/admin/hash" open onClose={onClose} />
    </AdminContext>
  );

const sendButton = () => screen.getByRole("button", { name: t.send });

// fills every field; the company name carries &/< to exercise the HTML escape on the ticket body.
const fillAll = async (user: ReturnType<typeof userEvent.setup>) => {
  await user.type(await screen.findByLabelText(t.fields.vat_id, { exact: false }), "DE123456789");
  await user.type(screen.getByLabelText(t.fields.company_name, { exact: false }), "Müller & Co <GmbH>");
  await user.type(screen.getByLabelText(t.fields.country, { exact: false }), "Germany");
  await user.type(screen.getByLabelText(t.fields.address, { exact: false }), "Main St 1");
  await user.type(screen.getByLabelText(t.fields.postal_code, { exact: false }), "10115");
  await user.type(screen.getByLabelText(t.fields.city, { exact: false }), "Berlin");
};

beforeEach(() => {
  redirect.mockClear();
});

describe("CompanyDetailsDialog", () => {
  it("keeps Send disabled until every field is filled", async () => {
    renderDialog(makeProvider());
    const user = userEvent.setup();

    expect(sendButton()).toBeDisabled();
    await user.type(await screen.findByLabelText(t.fields.vat_id, { exact: false }), "DE123456789");
    // one field is not enough.
    expect(sendButton()).toBeDisabled();

    await fillAll(user);
    expect(sendButton()).toBeEnabled();
  });

  it("creates exactly one support request with the English ticket body and escaped input", async () => {
    const dp = makeProvider();
    renderDialog(dp);
    const user = userEvent.setup();

    await fillAll(user);
    await user.click(sendButton());

    await waitFor(() => expect(dp.createSupportRequest).toHaveBeenCalledTimes(1));
    const [url, locale, subject, message] = dp.createSupportRequest.mock.calls[0];
    expect(url).toBe("https://admin.example/admin/hash");
    expect(locale).toBe("en");
    expect(subject).toBe("Add company details to invoices");
    // ticket labels stay English regardless of UI locale (support reads English).
    expect(message).toContain("VAT/Tax ID: DE123456789");
    expect(message).toContain("City: Berlin");
    // customer free text is HTML-escaped so a stray & or < can't corrupt the ticket.
    expect(message).toContain("Müller &amp; Co &lt;GmbH&gt;");
    expect(message).not.toContain("<GmbH>");
  });

  it("shows the success confirmation after the request is sent", async () => {
    renderDialog(makeProvider());
    const user = userEvent.setup();

    await fillAll(user);
    await user.click(sendButton());

    expect(await screen.findByText(t.success)).toBeInTheDocument();
    // the form is gone: Send is replaced by the success actions.
    expect(screen.queryByRole("button", { name: t.send })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: t.view_request })).toBeInTheDocument();
  });

  it("does not double-submit when Send is clicked twice", async () => {
    let resolve!: (value: { id: number }) => void;
    const createSupportRequest = vi.fn().mockReturnValue(new Promise(r => (resolve = r)));
    const dp = makeProvider(createSupportRequest);
    renderDialog(dp);
    const user = userEvent.setup();

    await fillAll(user);
    await user.click(sendButton());
    // request is in flight: the submit button is disabled and relabeled, so there's no second submit to make.
    expect(screen.getByRole("button", { name: t.sending })).toBeDisabled();
    resolve({ id: 7 });

    await waitFor(() => expect(createSupportRequest).toHaveBeenCalledTimes(1));
  });

  it("surfaces an error and stays on the form when creation fails", async () => {
    const createSupportRequest = vi.fn().mockRejectedValue(new Error("boom"));
    renderDialog(makeProvider(createSupportRequest));
    const user = userEvent.setup();

    await fillAll(user);
    await user.click(sendButton());

    expect(await screen.findByText(t.error)).toBeInTheDocument();
    // still on the form, so the customer can retry.
    expect(screen.getByRole("button", { name: t.send })).toBeInTheDocument();
  });
});
