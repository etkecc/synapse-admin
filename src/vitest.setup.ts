import "@testing-library/jest-dom/vitest";
import { expect, vi } from "vitest";
import * as axeMatchers from "vitest-axe/matchers";

expect.extend(axeMatchers);

const createStorage = () => {
  const store = new Map<string, string>();

  return {
    getItem: (key: string) => store.get(key) ?? null,
    setItem: (key: string, value: string) => {
      store.set(key, String(value));
    },
    removeItem: (key: string) => {
      store.delete(key);
    },
    clear: () => {
      store.clear();
    },
    key: (index: number) => Array.from(store.keys())[index] ?? null,
    get length() {
      return store.size;
    },
  } as unknown as Storage;
};

const installStorageGlobals = () => {
  vi.stubGlobal("localStorage", createStorage());
  vi.stubGlobal("sessionStorage", createStorage());
};

installStorageGlobals();

// Guards setImmediate: callbacks firing after jsdom teardown removes window are silently skipped as already irrelevant.
const _setImmediate = globalThis.setImmediate.bind(globalThis);
vi.stubGlobal("setImmediate", ((fn: (...args: unknown[]) => void, ...args: unknown[]) =>
  _setImmediate(() => {
    if (typeof window !== "undefined") fn(...args);
  })) as typeof setImmediate);

let logSpy: ReturnType<typeof vi.spyOn> | null = null;

beforeEach(() => {
  installStorageGlobals();
});

beforeAll(() => {
  if (!vi.isMockFunction(console.log)) {
    logSpy = vi.spyOn(console, "log").mockImplementation(() => undefined);
  } else {
    vi.mocked(console.log).mockImplementation(() => undefined);
  }
});

afterAll(() => {
  logSpy?.mockRestore();
});
