import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { vitePluginVersionMark } from "vite-plugin-version-mark";

export default defineConfig({
  base: "./",
  build: {
    target: "esnext",
    chunkSizeWarningLimit: 1000, // react-admin itself is 500kb, @mui 350kb, and other vendor libs are 730kb+ at the moment of writing
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("react-admin") || id.includes("ra-")) return "ra";
            if (id.includes("@mui")) return "mui";
            return "vendor";
          }
        },
      },
    },
  },
  plugins: [
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
});
