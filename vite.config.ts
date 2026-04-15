import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  root: "playground",
  publicDir: "../public",
  plugins: [react()],
  build: {
    // Output al root del repo — Vercel busca ahi por default.
    outDir: "../dist",
    emptyOutDir: true,
    // Shiki chunks tienden a ser >500kb por el grammar — inline chunk limit.
    chunkSizeWarningLimit: 2000,
  },
  server: {
    port: 5173,
    open: false,
    host: "localhost",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js"],
  },
});
