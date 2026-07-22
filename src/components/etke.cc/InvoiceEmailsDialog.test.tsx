import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { AdminContext } from "react-admin";
import { beforeEach, describe, expect, it, vi } from "vitest";

import englishMessages from "../../i18n/en";
import { InvoiceEmails } from "../../providers/types";

// useNotify is mocked so the toast content is assertable without mounting the notification layer.
const notify = vi.fn();
vi.mock("react-admin", async importOriginal => {
  const actual = await importOriginal<typeof import("react-admin")>();
  return { ...actual, useNotify: () => notify };
});

// imported after the mock is registered so the component picks up the mocked useNotify.
const { InvoiceEmailsDialog } = await import("./InvoiceEmailsDialog");

const keyPrefix = "etkecc.billing.invoice_emails";
const t = englishMessages.etkecc.billing.invoice_emails;
const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);

interface ProviderOverrides {
  getInvoiceEmails?: ReturnType<typeof vi.fn>;
  upsertInvoiceEmails?: ReturnType<typeof vi.fn>;
}

const makeProvider = (loaded: InvoiceEmails, overrides: ProviderOverrides = {}) => ({
  getInvoiceEmails: vi.fn().mockResolvedValue(loaded),
  upsertInvoiceEmails: vi.fn().mockResolvedValue({ enabled: true, emails: [], canceled: 0 }),
  ...overrides,
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderDialog = (dataProvider: any) =>
  render(
    <AdminContext i18nProvider={i18nProvider} dataProvider={dataProvider}>
      <InvoiceEmailsDialog etkeccAdmin="https://admin.example/admin/hash" open onClose={vi.fn()} />
    </AdminContext>
  );

const saveButton = () => screen.getByRole("button", { name: t.save });
const confirmButton = () => screen.findByRole("button", { name: "Confirm" });

beforeEach(() => {
  notify.mockClear();
});

describe("InvoiceEmailsDialog", () => {
  it("does not PUT until the confirm dialog is confirmed", async () => {
    const dp = makeProvider({ enabled: true, emails: ["keep@example.com"] });
    renderDialog(dp);
    const user = userEvent.setup();

    const input = await screen.findByLabelText(t.emails_label);
    await user.type(input, "new@example.com{Enter}");
    await user.click(saveButton());

    // dialog is open, but nothing is written yet.
    await confirmButton();
    expect(dp.upsertInvoiceEmails).not.toHaveBeenCalled();

    await user.click(await confirmButton());
    await waitFor(() => expect(dp.upsertInvoiceEmails).toHaveBeenCalledTimes(1));
    expect(dp.upsertInvoiceEmails).toHaveBeenCalledWith(expect.any(String), expect.any(String), true, [
      "keep@example.com",
      "new@example.com",
    ]);
  });

  it("shows the destructive warning when disabling removes the last recipients", async () => {
    const dp = makeProvider({ enabled: true, emails: ["a@example.com", "b@example.com"] });
    renderDialog(dp);
    const user = userEvent.setup();

    await user.click(await screen.findByLabelText(t.enabled_label)); // toggle off
    await user.click(saveButton());

    expect(await screen.findByText(/cancels any pending invoice emails/i)).toBeInTheDocument();
    expect(screen.getByText(/a@example.com, b@example.com/)).toBeInTheDocument();
  });

  it("shows the mild copy when one address is removed but recipients remain (predicate fix)", async () => {
    const dp = makeProvider({ enabled: true, emails: ["a@example.com", "b@example.com"] });
    renderDialog(dp);
    const user = userEvent.setup();

    await screen.findByLabelText(t.emails_label);
    // delete one chip, keeping the other; toggle stays on, so nothing is canceled.
    await user.click(screen.getAllByTestId("CancelIcon")[0]);
    await user.click(saveButton());

    expect(await screen.findByText(t.confirm_additive)).toBeInTheDocument();
    expect(screen.queryByText(/cancels any pending invoice emails/i)).not.toBeInTheDocument();
  });

  it("shows the mild copy on first-time setup (previously unconfigured)", async () => {
    const dp = makeProvider({ enabled: false, emails: [] });
    renderDialog(dp);
    const user = userEvent.setup();

    await user.click(await screen.findByLabelText(t.enabled_label)); // toggle on
    const input = await screen.findByLabelText(t.emails_label);
    await user.type(input, "new@example.com{Enter}");
    await user.click(saveButton());

    // loaded had no recipients, so enabling + adding cancels nothing: mild copy, no destructive warning.
    expect(await screen.findByText(t.confirm_additive)).toBeInTheDocument();
    expect(screen.queryByText(/cancels any pending invoice emails/i)).not.toBeInTheDocument();
  });

  it("disables Save when an address is malformed", async () => {
    const dp = makeProvider({ enabled: true, emails: ["a@example.com"] });
    renderDialog(dp);
    const user = userEvent.setup();

    const input = await screen.findByLabelText(t.emails_label);
    await user.type(input, "not-an-email{Enter}");

    expect(saveButton()).toBeDisabled();
  });

  it("notifies the canceled count when the save revokes pending invoices", async () => {
    const upsertInvoiceEmails = vi.fn().mockResolvedValue({ enabled: false, emails: [], canceled: 3 } as InvoiceEmails);
    const dp = makeProvider({ enabled: true, emails: ["a@example.com"] }, { upsertInvoiceEmails });
    renderDialog(dp);
    const user = userEvent.setup();

    await user.click(await screen.findByLabelText(t.enabled_label)); // toggle off -> destructive save
    await user.click(saveButton());
    await user.click(await confirmButton());

    await waitFor(() =>
      expect(notify).toHaveBeenCalledWith(expect.stringContaining("3 pending invoice emails were canceled"), {
        type: "info",
      })
    );
  });

  it("shows the rate-limit copy on a 429", async () => {
    const upsertInvoiceEmails = vi.fn().mockRejectedValue(new Error(`${keyPrefix}.error_rate_limited`));
    const dp = makeProvider({ enabled: true, emails: ["a@example.com"] }, { upsertInvoiceEmails });
    renderDialog(dp);
    const user = userEvent.setup();

    const input = await screen.findByLabelText(t.emails_label);
    await user.type(input, "b@example.com{Enter}");
    await user.click(saveButton());
    await user.click(await confirmButton());

    await waitFor(() => expect(notify).toHaveBeenCalledWith(t.error_rate_limited, { type: "error" }));
  });

  it("softens the toast on a successful retry after a prior destructive error", async () => {
    const upsertInvoiceEmails = vi
      .fn()
      .mockRejectedValueOnce(new Error("Service temporarily unavailable")) // server-localized, shown verbatim
      .mockResolvedValueOnce({ enabled: false, emails: [], canceled: 0 } as InvoiceEmails);
    const dp = makeProvider({ enabled: true, emails: ["a@example.com"] }, { upsertInvoiceEmails });
    renderDialog(dp);
    const user = userEvent.setup();

    await user.click(await screen.findByLabelText(t.enabled_label)); // toggle off -> destructive
    await user.click(saveButton());
    await user.click(await confirmButton());
    // the first (destructive) failure shows the server message verbatim.
    await waitFor(() => expect(notify).toHaveBeenCalledWith("Service temporarily unavailable", { type: "error" }));

    // retry succeeds with an ambiguous zero: softened copy, not a false "nothing canceled".
    // findByRole waits for the first dialog's close transition to release the aria-hidden background.
    await user.click(await screen.findByRole("button", { name: t.save }));
    await user.click(await confirmButton());
    await waitFor(() => expect(notify).toHaveBeenLastCalledWith(t.saved_canceled_retry, { type: "info" }));
  });

  it("does not soften the toast when the prior failure was additive, not destructive", async () => {
    const upsertInvoiceEmails = vi
      .fn()
      .mockRejectedValueOnce(new Error("Service temporarily unavailable"))
      .mockResolvedValueOnce({
        enabled: true,
        emails: ["a@example.com", "b@example.com"],
        canceled: 0,
      } as InvoiceEmails);
    const dp = makeProvider({ enabled: true, emails: ["a@example.com"] }, { upsertInvoiceEmails });
    renderDialog(dp);
    const user = userEvent.setup();

    // additive save (server keeps recipients) fails: not destructive, so it cancels nothing.
    const input = await screen.findByLabelText(t.emails_label);
    await user.type(input, "b@example.com{Enter}");
    await user.click(saveButton());
    await user.click(await confirmButton());
    await waitFor(() => expect(notify).toHaveBeenCalledWith("Service temporarily unavailable", { type: "error" }));

    // retry succeeds: plain saved, NOT the ambiguity copy, because nothing could have been canceled.
    await user.click(await screen.findByRole("button", { name: t.save }));
    await user.click(await confirmButton());
    await waitFor(() => expect(notify).toHaveBeenLastCalledWith(t.saved, { type: "success" }));
  });

  it("keeps the softened copy after a destructive failure even when the retry is additive", async () => {
    const upsertInvoiceEmails = vi
      .fn()
      .mockRejectedValueOnce(new Error("Service temporarily unavailable")) // destructive attempt fails
      .mockResolvedValueOnce({
        enabled: true,
        emails: ["a@example.com", "b@example.com"],
        canceled: 0,
      } as InvoiceEmails);
    const dp = makeProvider({ enabled: true, emails: ["a@example.com"] }, { upsertInvoiceEmails });
    renderDialog(dp);
    const user = userEvent.setup();

    await user.click(await screen.findByLabelText(t.enabled_label)); // toggle off -> destructive
    await user.click(saveButton());
    await user.click(await confirmButton());
    await waitFor(() => expect(notify).toHaveBeenCalledWith("Service temporarily unavailable", { type: "error" }));

    // the destructive attempt's outcome is unknown, so an additive retry's clean zero is still
    // ambiguous: the softened copy is intended until a save actually succeeds.
    await user.click(await screen.findByLabelText(t.enabled_label)); // toggle back on
    const input = await screen.findByLabelText(t.emails_label);
    await user.type(input, "b@example.com{Enter}");
    await user.click(await screen.findByRole("button", { name: t.save }));
    await user.click(await confirmButton());
    await waitFor(() => expect(notify).toHaveBeenLastCalledWith(t.saved_canceled_retry, { type: "info" }));
  });
});
