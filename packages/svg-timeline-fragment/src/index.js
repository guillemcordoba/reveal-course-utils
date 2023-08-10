import { v4 as uuidv4 } from "uuid";
import * as SVG from "@svgdotjs/svg.js";

export default () => ({
  id: "svg-timeline-fragment",
  init: (deck) => {
    const svgTimelineFragments = document.querySelectorAll(
      "svg-timeline-fragment"
    );

    for (let i = 0; i < svgTimelineFragments.length; i++) {
      const element = svgTimelineFragments[i];
      const js = element.innerHTML
        .replaceAll("&gt;", ">")
        .replaceAll("&lt;", "<");
      const span = document.createElement("span");
      span.setAttribute("class", "fragment");
      const id = `svg-timeline-fragment-${uuidv4()}`;
      span.id = id;

      element.innerHTML = "";
      element.appendChild(span);

      const originalFn = SVG.Element.timeline;
      let timeline = undefined;

      deck.on("fragmentshown", (event) => {
        if (event.fragment.id === id) {
          timeline = new SVG.Timeline();
          timeline.persist(true);

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
          SVG.extend(SVG.Element, {
            timeline: function () {
              return timeline;
            },
          });
          eval(js);
          timeline.reverse();
        }
      });
      deck.on("slidechanged", (event) => {
        const previousSlide = event.previousSlide;

        const section = document.querySelector(`#${id}`)?.closest("section");

        if (section === previousSlide) {
          const movingForward = previousSlide.classList.contains("past");
          if (movingForward) {
            // finish
            timeline = new SVG.Timeline();
            timeline.persist(true);

            SVG.extend(SVG.Element, {
              timeline: function () {
                return timeline;
              },
            });
            eval(js);
            timeline.finish();
            SVG.extend(SVG.Element, {
              timeline: originalFn,
            });
          } else {
            if (timeline) {
              // We have this setTimeout to have the animations play in the reverse order
              // from the one in the index.html
              setTimeout(() => {
                // stop
                SVG.extend(SVG.Element, {
                  timeline: function () {
                    return timeline;
                  },
                });
                eval(js);
                timeline.stop();
              }, svgTimelineFragments.length - i);
            }
          }
        }
      });
    }
  },
});
