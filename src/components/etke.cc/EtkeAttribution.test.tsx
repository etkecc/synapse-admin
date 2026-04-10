import { render, screen } from "@testing-library/react";

import { EtkeAttribution } from "./EtkeAttribution";

vi.mock("./InstanceConfig", () => ({
  useInstanceConfig: vi.fn(),
}));

import { useInstanceConfig } from "./InstanceConfig";
const mockUseInstanceConfig = vi.mocked(useInstanceConfig);

describe("EtkeAttribution", () => {
  it("renders children when attributions are not disabled", () => {
    mockUseInstanceConfig.mockReturnValue({ disabled: { attributions: false } } as ReturnType<
      typeof useInstanceConfig
    >);
    render(
      <EtkeAttribution>
        <span>Footer content</span>
      </EtkeAttribution>
    );
    expect(screen.getByText("Footer content")).toBeTruthy();
  });

  it("hides children when attributions are disabled", () => {
    mockUseInstanceConfig.mockReturnValue({ disabled: { attributions: true } } as ReturnType<typeof useInstanceConfig>);
    render(
      <EtkeAttribution>
        <span>Footer content</span>
      </EtkeAttribution>
    );
    expect(screen.queryByText("Footer content")).toBeNull();
  });
});
