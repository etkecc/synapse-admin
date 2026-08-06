/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen, waitForElementToBeRemoved } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";

// MUI's useMediaQuery walks window.matchMedia; jsdom doesn't ship one.
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => undefined,
      removeListener: () => undefined,
      addEventListener: () => undefined,
      removeEventListener: () => undefined,
      dispatchEvent: () => false,
    }),
  });
}

const deleteRoomMock = vi.fn();
const notifyMock = vi.fn();

vi.mock("react-admin", () => ({
  Button: ({ label, onClick, disabled, children }: any) => (
    <button type="button" aria-label={label} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  SimpleForm: ({ children }: any) => <div>{children}</div>,
  BooleanInput: ({ value, onChange, label, disabled }: any) => (
    <input type="checkbox" aria-label={label} checked={!!value} disabled={disabled} onChange={onChange} />
  ),
  useTranslate: () => (key: string) => key,
  useNotify: () => notifyMock,
  useRedirect: () => vi.fn(),
  useDataProvider: () => ({ deleteRoom: deleteRoomMock }),
  useUnselectAll: () => vi.fn(),
  useRecordContext: () => undefined,
  useResourceContext: () => "rooms",
}));

import DeleteRoomButton from "./DeleteRoomButton";

const props = {
  selectedIds: ["!a:hs"],
  confirmTitle: "resources.rooms.action.erase.title",
  confirmContent: "resources.rooms.action.erase.content",
};

const forcePurgeLabel = "resources.rooms.action.erase.fields.force_purge";
const purgeLabel = "resources.rooms.action.erase.fields.purge";

beforeEach(() => {
  vi.clearAllMocks();
  // No delete_id back → the handler takes the immediate-success path and never starts polling.
  deleteRoomMock.mockResolvedValue({ success: true });
});

const openDialog = async (user: ReturnType<typeof userEvent.setup>) => {
  // findByRole retries past the MUI close transition that briefly aria-hides the trigger.
  await user.click(await screen.findByRole("button", { name: "ra.action.delete" }));
  await screen.findByRole("dialog");
};

describe("DeleteRoomButton delete flags", () => {
  it("confirms with block off, purge on, force_purge off by default", async () => {
    const user = userEvent.setup();
    render(<DeleteRoomButton {...props} />);

    await openDialog(user);
    await user.click(screen.getByRole("button", { name: "ra.action.confirm" }));

    expect(deleteRoomMock).toHaveBeenCalledWith("!a:hs", false, true, false);
  });

  it("disables force_purge until purge is on", async () => {
    const user = userEvent.setup();
    render(<DeleteRoomButton {...props} />);

    await openDialog(user);
    // purge defaults on, so force_purge starts enabled.
    expect(screen.getByRole("checkbox", { name: forcePurgeLabel })).toBeEnabled();

    await user.click(screen.getByRole("checkbox", { name: purgeLabel }));
    expect(screen.getByRole("checkbox", { name: forcePurgeLabel })).toBeDisabled();
    expect(screen.getByRole("checkbox", { name: forcePurgeLabel })).not.toBeChecked();
  });

  it("resets force_purge on reopen so it can't ride in checked from a prior room", async () => {
    const user = userEvent.setup();
    render(<DeleteRoomButton {...props} />);

    await openDialog(user);
    await user.click(screen.getByRole("checkbox", { name: forcePurgeLabel }));
    expect(screen.getByRole("checkbox", { name: forcePurgeLabel })).toBeChecked();

    await user.click(screen.getByRole("button", { name: "ra.action.cancel" }));
    await waitForElementToBeRemoved(() => screen.queryByRole("dialog"));
    await openDialog(user);

    expect(screen.getByRole("checkbox", { name: forcePurgeLabel })).not.toBeChecked();
  });
});
