import { rollupPluginHTML } from "@web/rollup-plugin-html";
import { visualizeCodeExecution } from "./src/index.js";

export default {
  input: "demo/index.html",
  output: {
    entryFileNames: "[hash].js",
    chunkFileNames: "[hash].js",
    assetFileNames: "[hash][extname]",
    format: "es",
    dir: "dist",
  },
  preserveEntrySignatures: false,

  plugins: [
    /** Enable using HTML as rollup entrypoint */
    rollupPluginHTML({
      transformHtml: async (code) => visualizeCodeExecution(code),
    }),
  ],
};
