import { v4 as uuidv4 } from "uuid";

export default () => ({
  id: "script-fragment",
  init: (deck) => {
    const fragmentScripts = document.querySelectorAll("script-fragment");

    for (const element of fragmentScripts) {
      const js = element.innerHTML
        .replaceAll("&gt;", ">")
        .replaceAll("&lt;", "<");
      const span = document.createElement("span");
      span.setAttribute("class", "fragment");
      const id = uuidv4();
      span.id = id;

      element.innerHTML = "";
      element.appendChild(span);
      deck.on("fragmentshown", (event) => {
        if (event.fragment.id === id) {
          eval(js);
        }
      });
    }
  },
});
