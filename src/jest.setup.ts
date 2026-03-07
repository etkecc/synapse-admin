import "@testing-library/jest-dom";

let logSpy: jest.SpyInstance | null = null;

beforeAll(() => {
  if (!jest.isMockFunction(console.log)) {
    logSpy = jest.spyOn(console, "log").mockImplementation(() => undefined);
  } else {
    (console.log as jest.Mock).mockImplementation(() => undefined);
  }
});

afterAll(() => {
  logSpy?.mockRestore();
});
