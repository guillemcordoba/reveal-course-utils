import { defineConfig } from "vite";
import visualizeRustCodeExecution from "../dist/index.js";

export default defineConfig({
  plugins: [visualizeRustCodeExecution()],
});
