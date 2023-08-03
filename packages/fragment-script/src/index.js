export default () => ({
  id: "script-fragment",
  init: (deck) => {
    const animateElements = document.querySelectorAll("script[data-fragment]");

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
