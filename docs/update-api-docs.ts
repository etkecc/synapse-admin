#!/usr/bin/env node

import { spawn } from "child_process";
import fs from "fs";
import path from "path";
import https from "https";
import { promisify } from "util";
import stream from "stream";

const pipeline = promisify(stream.pipeline);

// ---------- CONFIG ----------
const MAS_URL = "https://element-hq.github.io/matrix-authentication-service/api/spec.json";
const MAS_DEST = "docs/apis/mas.json";

const SYNAPSE_REPO = "https://github.com/element-hq/synapse.git";
const SYNAPSE_BRANCH = "develop";
const TMP_DIR = ".tmp_synapse_repo";
const SYNAPSE_SRC = "docs/admin_api";
const SYNAPSE_DEST = "docs/apis/synapse";

// ---------- UI ----------
const c = {
  blue: "\x1b[34m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  reset: "\x1b[0m",
};

const log = (m: string) => console.log(`${c.blue}[INFO]${c.reset} ${m}`);
const ok = (m: string) => console.log(`${c.green}[OK]${c.reset} ${m}`);
const warn = (m: string) => console.log(`${c.yellow}[WARN]${c.reset} ${m}`);
const fail = (m: string) => console.error(`${c.red}[ERROR]${c.reset} ${m}`);

// ---------- UTILS ----------
const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

// ---------- RETRY ----------
async function retry<T>(fn: () => Promise<T>, label: string, retries = 5): Promise<T> {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt++;

      if (attempt >= retries) {
        throw new Error(`${label} failed after ${retries} attempts`, { cause: err });
      }

      const delay = 500 * 2 ** (attempt - 1);
      warn(`${label} failed: ${err.message}`);
      warn(`Retrying in ${delay}ms (${attempt + 1}/${retries})...`);

      await sleep(delay);
    }
  }
}

// ---------- DOWNLOAD WITH REDIRECT + TIMEOUT ----------
function download(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const tmp = dest + ".tmp";

    const request = https.get(url, { timeout: 30000 }, res => {
      // redirect
      if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(download(res.headers.location, dest));
      }

      if (!res.statusCode || res.statusCode >= 400) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }

      const file = fs.createWriteStream(tmp);

      pipeline(res, file)
        .then(() => {
          fs.renameSync(tmp, dest);
          resolve();
        })
        .catch(reject);
    });

    request.on("timeout", () => {
      request.destroy();
      reject(new Error("Request timed out"));
    });

    request.on("error", reject);
  });
}

// ---------- COPY (portable) ----------
function copyDir(src: string, dest: string) {
  ensureDir(dest);

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

// ---------- GIT ----------
function runGit(args: string[]) {
  return new Promise<void>((resolve, reject) => {
    const p = spawn("git", args, { stdio: "inherit" });

    p.on("close", code => {
      if (code === 0) resolve();
      else reject(new Error(`git ${args.join(" ")} failed (${code})`));
    });
  });
}

// ---------- STEP 1 ----------
async function stepMAS() {
  log("Downloading MAS spec");

  ensureDir(path.dirname(MAS_DEST));

  await retry(async () => {
    await download(MAS_URL, MAS_DEST);

    // validate JSON
    const content = fs.readFileSync(MAS_DEST, "utf-8");
    JSON.parse(content);
  }, "MAS download");

  ok(`Saved → ${MAS_DEST}`);
}

// ---------- STEP 2 ----------
async function stepSynapse() {
  log("Fetching Synapse docs");

  ensureDir(path.dirname(SYNAPSE_DEST));

  await retry(async () => {
    if (fs.existsSync(TMP_DIR)) {
      fs.rmSync(TMP_DIR, { recursive: true, force: true });
    }

    await runGit(["clone", "--depth", "1", "--branch", SYNAPSE_BRANCH, SYNAPSE_REPO, TMP_DIR]);
  }, "Git clone");

  const src = path.join(TMP_DIR, SYNAPSE_SRC);

  if (!fs.existsSync(src)) {
    throw new Error(`Missing path: ${SYNAPSE_SRC}`);
  }

  if (fs.existsSync(SYNAPSE_DEST)) {
    fs.rmSync(SYNAPSE_DEST, { recursive: true, force: true });
  }

  copyDir(src, SYNAPSE_DEST);

  fs.rmSync(TMP_DIR, { recursive: true, force: true });

  ok(`Saved → ${SYNAPSE_DEST}`);
}

// ---------- MAIN ----------
(async () => {
  console.log("=== Matrix API Docs Updater ===\n");

  try {
    await stepMAS();
    console.log();
    await stepSynapse();
    console.log();

    ok("All done!");
  } catch (e) {
    fail(e.message);
    process.exit(1);
  }
})();
