import { renderHook } from "@testing-library/react";

import { useDocTitle } from "./useDocTitle";

describe("useDocTitle", () => {
  const originalTitle = document.title;

  afterEach(() => {
    document.title = originalTitle;
    delete document.head.dataset.baseTitle;
  });

  it("sets document.title to '<title> - <document.title>'", () => {
    document.title = "Base App";
    renderHook(() => useDocTitle("Users"));
    expect(document.title).toBe("Users - Base App");
  });

  it("prefers data-base-title over document.title for the base", () => {
    document.title = "Something Else";
    document.head.dataset.baseTitle = "My Admin";
    renderHook(() => useDocTitle("Rooms"));
    expect(document.title).toBe("Rooms - My Admin");
  });

  it("updates document.title when the title argument changes", () => {
    // Use data-base-title so the base stays stable across re-renders
    document.head.dataset.baseTitle = "App";
    const { rerender } = renderHook(({ title }: { title: string }) => useDocTitle(title), {
      initialProps: { title: "First" },
    });
    expect(document.title).toBe("First - App");

    rerender({ title: "Second" });
    expect(document.title).toBe("Second - App");
  });
});
