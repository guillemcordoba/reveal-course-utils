import { v4 as uuidv4 } from "uuid";
import * as NSVG from "@svgdotjs/svg.js";
window.SVG = NSVG.SVG;

export default () => ({
  id: "svg-timeline-fragment",
  init: (deck) => {
    const svgTimelineFragments = document.querySelectorAll(
      "svg-timeline-fragment"
    );

    for (let i = 0; i < svgTimelineFragments.length; i++) {
      const element = svgTimelineFragments[i];
      const js = element.firstElementChild.innerHTML;
      const span = document.createElement("span");
      span.setAttribute("class", "fragment");
      const id = `svg-timeline-fragment-${uuidv4()}`;
      span.id = id;

      element.innerHTML = "";
      element.appendChild(span);

      const originalFn = NSVG.Element.timeline;
      let timeline = undefined;

      timeline = new NSVG.Timeline();
      timeline.persist(true);

      NSVG.extend(NSVG.Element, {
        timeline: function () {
          return timeline;
        },
      });
      eval(js);
      NSVG.extend(NSVG.Element, {
        timeline: originalFn,
      });
      timeline.pause();

      deck.on("fragmentshown", (event) => {
        if (event.fragment.id === id) {
          timeline.reverse(false).play();
        }
      });
      deck.on("fragmenthidden", (event) => {
        if (event.fragment.id === id) {
          timeline.reverse().play();
        }
      });
      deck.on("slidechanged", (event) => {
        const previousSlide = event.previousSlide;

        const section = document.querySelector(`#${id}`)?.closest("section");

        if (section === previousSlide) {
          const movingForward = previousSlide.classList.contains("past");
          if (movingForward) {
            timeline.reverse(false).finish();
          } else {
            if (timeline) {
              // We have this setTimeout to have the animations play in the reverse order
              // from the one in the index.html
              setTimeout(() => {
                timeline.stop();
              }, svgTimelineFragments.length - i);
            }
          }
        }
      });
    }
  },
});
