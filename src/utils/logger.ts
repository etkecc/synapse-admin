const createLogger = (prefix: string) => ({
  debug: (...args: unknown[]) => console.debug(`[${prefix}]`, ...args),
  info: (...args: unknown[]) => console.info(`[${prefix}]`, ...args),
  warn: (...args: unknown[]) => console.warn(`[${prefix}]`, ...args),
  error: (...args: unknown[]) => console.error(`[${prefix}]`, ...args),
});

export default createLogger;
