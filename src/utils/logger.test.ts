import createLogger from "./logger";

describe("createLogger", () => {
  let debugSpy: ReturnType<typeof vi.spyOn>;
  let infoSpy: ReturnType<typeof vi.spyOn>;
  let warnSpy: ReturnType<typeof vi.spyOn>;
  let errorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    debugSpy = vi.spyOn(console, "debug").mockImplementation(() => undefined);
    infoSpy = vi.spyOn(console, "info").mockImplementation(() => undefined);
    warnSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an object with debug, info, warn, and error methods", () => {
    const logger = createLogger("test");
    expect(typeof logger.debug).toBe("function");
    expect(typeof logger.info).toBe("function");
    expect(typeof logger.warn).toBe("function");
    expect(typeof logger.error).toBe("function");
  });

  it("debug() calls console.debug with the prefix", () => {
    createLogger("myprefix").debug("hello", 42);
    expect(debugSpy).toHaveBeenCalledWith("[myprefix]", "hello", 42);
  });

  it("info() calls console.info with the prefix", () => {
    createLogger("myprefix").info("world");
    expect(infoSpy).toHaveBeenCalledWith("[myprefix]", "world");
  });

  it("warn() calls console.warn with the prefix", () => {
    createLogger("myprefix").warn("careful");
    expect(warnSpy).toHaveBeenCalledWith("[myprefix]", "careful");
  });

  it("error() calls console.error with the prefix", () => {
    createLogger("myprefix").error("boom", { code: 1 });
    expect(errorSpy).toHaveBeenCalledWith("[myprefix]", "boom", { code: 1 });
  });

  it("uses the correct prefix per logger instance", () => {
    createLogger("alpha").info("a");
    createLogger("beta").info("b");
    expect(infoSpy).toHaveBeenNthCalledWith(1, "[alpha]", "a");
    expect(infoSpy).toHaveBeenNthCalledWith(2, "[beta]", "b");
  });
});
