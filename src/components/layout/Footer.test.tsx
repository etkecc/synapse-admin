import { render, screen } from "@testing-library/react";
import { createTheme, ThemeProvider } from "@mui/material/styles";

import Footer from "./Footer";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ThemeProvider theme={createTheme()}>{children}</ThemeProvider>
);

describe("Footer", () => {
  afterEach(() => {
    document.getElementById("js-version")?.remove();
  });

  it("renders the Ketesa link pointing to GitHub", () => {
    render(<Footer />, { wrapper });
    const links = screen.getAllByRole("link");
    const ketesaLink = links.find(l => (l as HTMLAnchorElement).href.includes("etkecc/ketesa"));
    expect(ketesaLink).toBeTruthy();
  });

  it("renders the Matrix room link", () => {
    render(<Footer />, { wrapper });
    const links = screen.getAllByRole("link");
    const matrixLink = links.find(l => l.textContent?.includes("#ketesa:etke.cc"));
    expect(matrixLink).toBeTruthy();
  });

  it("shows no version when #js-version element is absent", () => {
    render(<Footer />, { wrapper });
    const links = screen.getAllByRole("link");
    const ketesaLink = links.find(l => (l as HTMLAnchorElement).href.includes("etkecc/ketesa"));
    expect(ketesaLink?.textContent?.trim()).toBe("Ketesa");
  });

  it("reads version from #js-version element when present", () => {
    const el = document.createElement("span");
    el.id = "js-version";
    el.textContent = "1.2.3";
    document.body.appendChild(el);

    render(<Footer />, { wrapper });

    // The version is set via a useEffect reading the DOM element
    const links = screen.getAllByRole("link");
    const ketesaLink = links.find(l => (l as HTMLAnchorElement).href.includes("etkecc/ketesa"));
    expect(ketesaLink?.textContent?.trim()).toBe("Ketesa 1.2.3");
  });

  it("accepts a custom logoSrc prop", () => {
    render(<Footer logoSrc="./custom-logo.png" />, { wrapper });
    const img = document.querySelector("img");
    expect(img?.getAttribute("src")).toBe("./custom-logo.png");
  });
});
