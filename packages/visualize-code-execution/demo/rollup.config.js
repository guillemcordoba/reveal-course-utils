import { rollupPluginHTML } from "@web/rollup-plugin-html";
import resolve from "@rollup/plugin-node-resolve";
import { visualizeCodeExecution } from "../dist/index.js";

export default {
  input: "demo/index.html",
  output: {
    entryFileNames: "[hash].js",
    chunkFileNames: "[hash].js",
    assetFileNames: "[hash][extname]",
    format: "es",
    dir: "demo/dist",
  },
  preserveEntrySignatures: false,

  plugins: [
    resolve(),
    /** Enable using HTML as rollup entrypoint */
    rollupPluginHTML({
      transformHtml: async (code) => visualizeCodeExecution(code),
    }),
  ],
};
