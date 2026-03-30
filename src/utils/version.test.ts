import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { resolveVersion, injectVersion } from "./version";

const entrypoints = ["index.html", "auth-callback.html"];

describe.each(entrypoints)("entrypoint %s version injection", file => {
  const html = readFileSync(resolve(__dirname, "../entrypoints", file), "utf8");

  it("contains js-version element", () => {
    expect(html).toContain('id="js-version"');
  });

  it("version is injected and placeholder is removed", () => {
    const version = resolveVersion();
    const transformed = injectVersion(html, version);

    expect(transformed).not.toContain("__KETESA_VERSION__");
    expect(transformed).toContain(version);
  });
});
