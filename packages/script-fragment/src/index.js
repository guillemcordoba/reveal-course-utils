import { v4 as uuidv4 } from "uuid";

export default () => ({
  id: "script-fragment",
  init: (deck) => {
    const fragmentScripts = document.querySelectorAll("script-fragment");

    for (const element of fragmentScripts) {
      const scriptOnShow = element.querySelector("script[data-on-show]");
      const jsOnShow = scriptOnShow?.innerHTML;

      const scriptOnHide = element.querySelector("script[data-on-hide]");
      const jsOnHide = scriptOnHide?.innerHTML;

      const span = document.createElement("span");
      span.setAttribute("class", "fragment");
      const id = uuidv4();
      span.id = id;

      element.innerHTML = "";
      element.appendChild(span);
      if (scriptOnShow) {
        deck.on("fragmentshown", (event) => {
          if (event.fragment.id === id) {
            eval(jsOnShow);
          }
        });
      }

      if (scriptOnHide) {
        deck.on("fragmenthidden", (event) => {
          if (event.fragment.id === id) {
            eval(jsOnHide);
          }
        });
      }
    }
  },
});
