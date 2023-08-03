import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealAnimate from "reveal.js-plugins/animate/plugin.js";
import "reveal.js/plugin/animate/svg.min.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
import RevealNotes from "reveal.js/plugin/notes/notes.esm.js";
import RevealAnimateFragments from "reveal.js-animate-fragments";

export const plugins = [
  Markdown,
  RevealNotes,
  RevealAnimateFragments,
  RevealHighlight,
  RevealAnimate,
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
