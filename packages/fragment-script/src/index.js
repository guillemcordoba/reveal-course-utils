import { v4 as uuidv4 } from "uuid";

export default () => ({
  id: "fragment-script",
  init: (deck) => {
    const fragmentScripts = document.querySelectorAll("fragment-script");

    for (const element of fragmentScripts) {
      const js = element.innerHTML;
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
