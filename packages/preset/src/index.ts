import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
import RevealNotes from "reveal.js/plugin/notes/notes.esm.js";
import RevealAnimateFragments from "reveal.js-animate-fragments";
import RevealEliminateEmptyLines from "reveal.js-eliminate-empty-lines";

export const plugins = [
  Markdown,
  RevealNotes,
  RevealAnimateFragments,
  RevealHighlight,
  RevealEliminateEmptyLines,
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
