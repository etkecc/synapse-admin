import { fireEvent, render, screen } from "@testing-library/react";
import polyglotI18nProvider from "ra-i18n-polyglot";
import { AdminContext } from "react-admin";

import { ServerNotificationsUnavailable } from "./ServerNotificationsUnavailable";
import englishMessages from "../../i18n/en";

const i18nProvider = polyglotI18nProvider(() => englishMessages, "en", [{ locale: "en", name: "English" }]);

const renderPanel = (onRetry = vi.fn()) => {
  render(
    <AdminContext i18nProvider={i18nProvider}>
      <ServerNotificationsUnavailable onRetry={onRetry} />
    </AdminContext>
  );
  return { onRetry };
};

describe("ServerNotificationsUnavailable", () => {
  it("renders title, body, Matrix/news/email items, and Retry button", () => {
    renderPanel();

    expect(screen.getByText(/Notifications may be unavailable right now/i)).toBeInTheDocument();
    expect(screen.getByText(/updates we can't deliver/i)).toBeInTheDocument();
    expect(screen.getByText(/Matrix room #news:etke.cc/i)).toBeInTheDocument();
    expect(screen.getByText(/Announcements page at etke.cc\/news/i)).toBeInTheDocument();
    expect(screen.getByText(/Your email inbox/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Retry/i })).toBeInTheDocument();
  });

  it("calls onRetry when the Retry button is clicked", () => {
    const { onRetry } = renderPanel();

    fireEvent.click(screen.getByRole("button", { name: /Retry/i }));

    expect(onRetry).toHaveBeenCalledTimes(1);
  });

  it("renders Matrix and news links with target=_blank and correct href", () => {
    renderPanel();

    const matrixLink = screen.getByText(/Matrix room #news:etke.cc/i).closest("a");
    expect(matrixLink).toHaveAttribute("href", "https://matrix.to/#/%23news:etke.cc");
    expect(matrixLink).toHaveAttribute("target", "_blank");
    expect(matrixLink).toHaveAttribute("rel", "noreferrer");

    const newsLink = screen.getByText(/Announcements page at etke.cc\/news/i).closest("a");
    expect(newsLink).toHaveAttribute("href", "https://etke.cc/news");
    expect(newsLink).toHaveAttribute("target", "_blank");
  });
});
