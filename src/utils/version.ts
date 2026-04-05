import { execSync } from "node:child_process";

export function resolveVersion(): string {
  try {
    return execSync(
      'git describe --tags || git rev-parse --short HEAD || echo "${KETESA_VERSION:-${SYNAPSE_ADMIN_VERSION:-unknown}}"',
      { encoding: "utf8", shell: "/bin/sh" }
    ).trim();
  } catch (e) {
    const stdout = e instanceof Error && "stdout" in e ? String(e.stdout || "").trim() : "";
    if (stdout) {
      return stdout;
    }
    console.error("[version] failed to resolve version", e);
    return process.env.KETESA_VERSION || process.env.SYNAPSE_ADMIN_VERSION || "unknown";
  }
}

export function injectVersion(html: string, version: string): string {
  return html.replace(/__KETESA_VERSION__/g, JSON.stringify(version));
}
