import nodeResolve from "@rollup/plugin-node-resolve";
import babel from "@rollup/plugin-babel";
import terser from "@rollup/plugin-terser";
import { rollupPluginHTML } from "@web/rollup-plugin-html";
import { visualizeCodeExecution } from "@mythosthesia/visualize-rust-code-execution";
import { readFileSync } from "fs";

// Look for `<svg src="FILENAME.svg">` tags, and replace their content with the actual svg file, allowing svg-timeline-fragment to be used with them
function includeSvgs(code, rootPath = process.cwd()) {
  const matches = code.matchAll(/<svg(.*?) src="(.*?)"(.*?)>.*?<\/svg>/gm);

  for (const match of [...matches].reverse()) {
    let svg = readFileSync(`${rootPath}/${match[2]}`, "utf8");
    svg = svg.replace(/<svg /gm, `<svg ${match[1]} ${match[3]}`);
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;
    code = code.slice(0, startIndex) + svg + code.slice(endIndex);
  }
  return code;
}

export const rollupConfig = (publicPath) => ({
  input: "index.html",
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
      publicPath,
      transformHtml: async (code) => visualizeCodeExecution(includeSvgs(code)),
    }),
    /** Resolve bare module imports */
    nodeResolve(),
    /** Minify JS */
    terser(),
    /** Compile JS to a lower language target */
    babel({
      babelHelpers: "bundled",
      presets: [
        [
          "@babel/preset-env",
          {
            targets: [
              "last 3 Chrome major versions",
              "last 3 Firefox major versions",
              "last 3 Edge major versions",
              "last 3 Safari major versions",
            ],
            modules: false,
            bugfixes: true,
          },
        ],
      ],
    }),
  ],
});
