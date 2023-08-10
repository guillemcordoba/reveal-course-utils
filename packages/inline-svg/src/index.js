export default () => ({
  id: "inline-svg",
  init: async () => {
    const inlineSvgs = document.querySelectorAll("inline-svg");

    for (const element of inlineSvgs) {
      const src = element.getAttribute("src");

      const response = await fetchAndRetry(src);
      const svg = await response.text();

      const scriptSetup =
        element.querySelector("script[data-setup]")?.innerHTML;

      element.innerHTML = svg;

      const svgNode = element.querySelector("svg");

      svgNode.id = element.id;
      svgNode.style = element.style;

      for (const attribute of Array.from(element.attributes)) {
        svgNode.setAttribute(attribute.name, attribute.value);
        element.setAttribute(attribute.name, "");
      }
      element.id = "";
      element.style = "display: contents";

      if (scriptSetup) eval(scriptSetup);
    }
  },
});

async function fetchAndRetry(src, retryCount = 3) {
  try {
    const response = await fetch(src);
    return response;
  } catch (e) {
    if (retryCount === 0) throw e;

    return fetchAndRetry(src, retryCount - 1);
  }
}
