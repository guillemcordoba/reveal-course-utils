# reveal.js-svg-timeline-fragment

A [Reveal.js](https://revealjs.com/) plugin to add svg.js timelines as fragments.

## Installation

```bash
npm i reveal.js-svg-timeline-fragment
```

## Usage

Add the plugin:

```html
<script type="module">
  import RevealSvgTimelineFragment from "reveal.js-svg-timeline-fragment";

  import Reveal from "reveal.js";

  let deck = new Reveal({
    plugins: [RevealSvgTimelineFragment],
  });
  deck.initialize();
</script>
```

And then use it in your reveal.js slides, like in this example of a heart svg that first turns white and then moves:

```html
<svg
  id="svg"
  xmlns="http://www.w3.org/2000/svg"
  height="457.01"
  width="490.82"
  version="1.0"
>
  <g id="heart">
    <path
      d="m138.636 12.921c-66.24 0-120 53.76-120 120 0 134.756 135.933 170.088 228.562 303.308 87.574-132.403 228.563-172.854 228.563-303.308 0-66.24-53.76-120-120-120-48.048 0-89.402 28.37-108.563 69.188-19.16-40.817-60.514-69.188-108.562-69.188z"
      fill="#e60000"
      stroke="#000"
      stroke-width="18.7"
    />
    <path
      d="m140.22 31.37c-57.96 0-105 47.04-105 105 0 117.91 118.919 148.838 199.969 265.406 6.56-9.918-139.969-145.527-139.969-245.407 0-57.96 47.04-105 105-105 .505 0 .997.056 1.5.063-17.276-12.584-38.494-20.063-61.5-20.063z"
      fill="#e6e6e6"
      fill-opacity=".646"
    />
  </g>
</svg>
<svg-timeline-fragment>
  <script type="text/template">
    // This will get executed when the fragment sequence arrives at this fragment
    SVG("#svg").find("#heart *").animate({ when: 'start' }).fill('#000');
  </script>
</svg-timeline-fragment>
<svg-timeline-fragment>
  <script type="text/template">
    // This will get executed in the following fragment
    SVG("#svg").find("#heart *").animate({ when: 'start' }).move(100, 100);
  </script>
</svg-timeline-fragment>
```

You can read the [svg.js documentation](https://svgjs.dev/docs/3.0/animating/#svg-timeline) to find out all the available APIs.


## Include SVG Vite Plugin

If you need to embed SVG files by referencing them from your html, you can use the "Include SVG" vite plugin.

Include it in your `vite.config.js` like this:

```js
import { defineConfig } from "vite";
import includeSvgs from "reveal.js-svg-timeline-fragment/include-svgs.vite-plugin.js";

export default defineConfig({
  plugins: [
    includeSvgs(),
  ],
});
```