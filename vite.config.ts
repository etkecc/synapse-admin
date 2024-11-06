import { vitePluginVersionMark } from "vite-plugin-version-mark";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  base: "./",
  plugins: [
    react(),
    vitePluginVersionMark({
      name: "Synapse Admin",
      command: 'git describe --tags || git rev-parse --short HEAD || echo "${SYNAPSE_ADMIN_VERSION:-unknown}"',
      ifMeta: false,
      ifLog: false,
      ifGlobal: true,
      outputFile: (version) => ({
        path: "manifest.json",
        content: JSON.stringify({
          name: "Synapse Admin",
          version: version,
          description: "Synapse Admin is an admin console for synapse Matrix homeserver with additional features.",
          categories: ["productivity", "utilities"],
          orientation: "landscape",
          icons: [{
            src: "favicon.ico",
            sizes: "32x32",
            type: "image/x-icon"
          },{
            src: "images/logo.webp",
            sizes: "512x512",
            type: "image/webp",
            purpose: "any maskable"
          }],
          start_url: ".",
          display: "standalone",
          theme_color: "#000000",
          background_color: "#ffffff"
        }),
      }),
    }),
  ],
});
