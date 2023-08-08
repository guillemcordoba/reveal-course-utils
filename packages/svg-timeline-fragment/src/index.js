import { v4 as uuidv4 } from "uuid";
import * as SVG from "@svgdotjs/svg.js";

export default () => ({
  id: "svg-timeline-fragment",
  init: (deck) => {
    const svgTimelineFragment = document.querySelectorAll(
      "svg-timeline-fragment"
    );

    for (const element of svgTimelineFragment) {
      const js = element.innerHTML
        .replaceAll("&gt;", ">")
        .replaceAll("&lt;", "<");
      const span = document.createElement("span");
      span.setAttribute("class", "fragment");
      const id = uuidv4();
      span.id = id;

      element.innerHTML = "";
      element.appendChild(span);

      const timeline = new SVG.Timeline();
      timeline.persist(true);
      const originalFn = SVG.Element.timeline;

      deck.on("fragmentshown", (event) => {
        if (event.fragment.id === id) {
          SVG.extend(SVG.Element, {
            timeline: function () {
              return timeline;
            },
          });
          eval(js);
          SVG.extend(SVG.Element, {
            timeline: originalFn,
          });
        }
      });
      deck.on("fragmenthidden", (event) => {
        if (event.fragment.id === id) {
          timeline.stop();
        }
      });
    }
  },
});
