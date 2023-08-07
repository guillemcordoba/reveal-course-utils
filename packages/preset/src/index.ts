import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
import RevealNotes from "reveal.js/plugin/notes/notes.esm.js";
import RevealAnimateFragments from "reveal.js-animate-fragments";
import RevealFragmentScript from "reveal.js-fragment-script";
import { SVG } from "@svgdotjs/svg.js";

(window as any).SVG = SVG;

export const plugins = [
  Markdown,
  RevealNotes,
  RevealFragmentScript,
  RevealAnimateFragments,
  RevealHighlight,
];

export const config = {
  plugins,

  center: false,
  transition: "none",
  highlight: {
    beforeHighlight: (hljs) => {
      hljs.configure({
        ignoreUnescapedHTML: true,
      });
    },
  },
};
