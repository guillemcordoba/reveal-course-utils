import { SVG } from "@svgdotjs/svg.js";

window.SVG = SVG;

export default () => ({
  id: "animate-svg",
  init: (deck) => {
    const animateElements = document.querySelectorAll("svg-fragment");
    console.log(animateElements);

    for (const element of animateElements) {
      const js = element.innerHTML;
      const span = document.createElement("span");
      span.setAttribute("class", "fragment");

      element.innerHTML = "";
      element.appendChild(span);

      deck.on("fragmentshown", (event) => {
        if (event.fragment === span) {
          eval(js);
        }
      });
    }
  },
});
