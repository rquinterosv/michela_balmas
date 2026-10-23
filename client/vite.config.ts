import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { siteContentPlugin } from "./siteContentPlugin";

export default defineConfig({
  plugins: [react(), siteContentPlugin()],
  server: {
    port: 5173,
    // En desarrollo, /api va al backend local: el navegador ve un solo origen.
    proxy: {
      "/api": "http://127.0.0.1:3001",
    },
  },
});
