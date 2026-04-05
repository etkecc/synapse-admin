import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

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
