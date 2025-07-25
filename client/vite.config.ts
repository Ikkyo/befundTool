import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: "../api/public",
    emptyOutDir: true,
    rollupOptions: {
      onwarn: (warning, warn) => {
        // Suppress certain warnings
        if (warning.code === "UNRESOLVED_IMPORT") return;
        warn(warning);
      },
    },
  },
  server: {
    port: 3000,
    proxy: {
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },
    },
  },
  optimizeDeps: {
    exclude: [],
  },
});
