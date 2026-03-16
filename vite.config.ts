import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { resolve, join, dirname } from "node:path";
import { promises as fs } from "node:fs";
import { vitePluginVersionMark } from "vite-plugin-version-mark";

let resolvedOutDir = "dist";
let resolvedBase = "./";

export default defineConfig(({ mode }) => ({
  appType: "mpa",
  base: "./",
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 1500, // react-admin itself is 500kb, @mui 350kb, and other vendor libs are 730kb+ at the moment of writing
    sourcemap: mode === "development",
    rolldownOptions: {
      input: {
        main: resolve(__dirname, "src/entrypoints/index.html"),
        "auth-callback/index": resolve(__dirname, "src/entrypoints/auth-callback.html"),
      },
      output: {
        codeSplitting: {
          groups: [
            { name: "ra", test: /node_modules[\\/].*(react-admin|ra-)/, priority: 20 },
            { name: "mui", test: /node_modules[\\/]@mui/, priority: 15 },
            { name: "vendor", test: /node_modules/, priority: 5 },
          ],
        },
      },
    },
  },
  plugins: [
    {
      name: "entrypoint-output-paths",
      apply: "build",
      configResolved(config) {
        resolvedOutDir = config.build.outDir;
        resolvedBase = config.base || "./";
      },
      async closeBundle() {
        const outDir = resolvedOutDir;
        const sourceIndex = join(outDir, "src/entrypoints/index.html");
        const sourceAuth = join(outDir, "src/entrypoints/auth-callback.html");
        const targetIndex = join(outDir, "index.html");
        const targetAuth = join(outDir, "auth-callback/index.html");
        const normalizedBase =
          resolvedBase === "" || resolvedBase === "./"
            ? "./"
            : resolvedBase.endsWith("/")
              ? resolvedBase
              : `${resolvedBase}/`;
        const expectedAssetsPrefix = normalizedBase === "./" ? "./assets/" : `${normalizedBase}assets/`;

        const moveIfExists = async (from: string, to: string) => {
          try {
            await fs.access(from);
          } catch {
            return;
          }
          await fs.mkdir(dirname(to), { recursive: true });
          await fs.rm(to, { force: true });
          await fs.rename(from, to);
        };

        const rewriteAssets = async (filePath: string, assetsPrefix: string) => {
          try {
            const content = await fs.readFile(filePath, "utf8");
            const updated = content.replace(/(["'])(?:\.\.\/)+assets\//g, `$1${assetsPrefix}`);
            if (updated !== content) {
              await fs.writeFile(filePath, updated);
            }
          } catch {
            return;
          }
        };

        const assertAssetPrefix = async (filePath: string, assetsPrefix: string) => {
          const content = await fs.readFile(filePath, "utf8");
          const hasAssets = content.includes("assets/");
          if (!hasAssets) {
            return;
          }
          const invalidAssets = new RegExp(`["'](?!${assetsPrefix.replace(/\//g, "\\/")})[^"']*assets\\/`);
          if (invalidAssets.test(content)) {
            throw new Error(`Unexpected assets path in ${filePath}`);
          }
        };

        await moveIfExists(sourceIndex, targetIndex);
        await moveIfExists(sourceAuth, targetAuth);
        if (normalizedBase === "./") {
          await rewriteAssets(targetIndex, "./assets/");
          await rewriteAssets(targetAuth, "./assets/");
        }
        await assertAssetPrefix(targetIndex, expectedAssetsPrefix);
        await assertAssetPrefix(targetAuth, expectedAssetsPrefix);
        await fs.rm(join(outDir, "src/entrypoints"), { recursive: true, force: true });
      },
    },
    {
      name: "auth-callback-dev-rewrite",
      configureServer(server) {
        server.middlewares.use((req, _res, next) => {
          if (!req.url) return next();
          const [path] = req.url.split("?");
          if (path === "/auth-callback" || path === "/auth-callback/" || path === "/auth-callback/index.html") {
            req.url = req.url.replace(path, "/src/entrypoints/auth-callback.html");
          } else if (path === "/" || path === "/index.html") {
            req.url = req.url.replace(path, "/src/entrypoints/index.html");
          }
          next();
        });
      },
    },
    react(),
    vitePluginVersionMark({
      name: "Synapse Admin",
      command: 'git describe --tags || git rev-parse --short HEAD || echo "${SYNAPSE_ADMIN_VERSION:-unknown}"',
      ifMeta: false,
      ifLog: false,
      ifGlobal: true,
      outputFile: version => {
        const base = {
          name: "Synapse Admin",
          short_name: "Synapse Admin",
          version: version,
          description: "Synapse Admin is an admin console for synapse Matrix homeserver with additional features.",
          lang: "en",
          dir: "auto",
          categories: ["productivity", "utilities"],
          orientation: "landscape",
          icons: [
            {
              src: "favicon.ico",
              sizes: "32x32",
              type: "image/x-icon",
            },
            {
              src: "images/logo.webp",
              sizes: "512x512",
              type: "image/webp",
              purpose: "any maskable",
            },
          ],
          start_url: ".",
          scope: ".",
          id: ".",
          display: "standalone",
        };

        return [
          {
            path: "manifest.json",
            content: JSON.stringify({
              ...base,
              theme_color: "#fafafa",
              background_color: "#fafafa",
            }),
          },
          {
            path: "manifest-dark.json",
            content: JSON.stringify({
              ...base,
              theme_color: "#313131",
              background_color: "#313131",
            }),
          },
        ];
      },
    }),
  ],
  ssr: {
    noExternal: ["react-dropzone", "react-admin", "ra-ui-materialui"],
  },
}));
