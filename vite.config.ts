import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const DICTIONARY_ORIGIN = "https://sjp-check-api.vercel.app";
const DICTIONARY_PATH = "/validate-words-boggle";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  /** Same path as production `/api/validate-words`; key stays in Node via SJP_API_KEY. */
  server: {
    proxy: {
      "/api/validate-words": {
        target: DICTIONARY_ORIGIN,
        changeOrigin: true,
        rewrite: () => DICTIONARY_PATH,
        configure(proxy) {
          proxy.on("proxyReq", (proxyReq) => {
            const key = process.env.SJP_API_KEY;
            if (key) {
              proxyReq.setHeader("Authorization", `Bearer ${key}`);
            }
          });
        },
      },
    },
  },
  test: {
    environment: "jsdom",
    setupFiles: "./src/utils/setupTests.ts",
  },
});
