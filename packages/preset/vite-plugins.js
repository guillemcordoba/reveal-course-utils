import visualizeRustCodeExecution from "@mythosthesia/visualize-rust-code-execution";
import includeSvgs from "reveal.js-svg-timeline-fragment/include-svgs.vite-plugin.js";

export const vitePlugins = [includeSvgs(), visualizeRustCodeExecution()];
