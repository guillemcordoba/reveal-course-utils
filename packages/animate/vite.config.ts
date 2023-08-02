// vite.config.js
import { defineConfig } from "vite";

export default defineConfig({
  optimizeDeps: {
    disabled: true,
  },

  root: "./demo",
  plugins: [], // e.g. use TypeScript check
});
