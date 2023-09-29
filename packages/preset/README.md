# @mythosthesia/reveal-course-preset

Preset that includes everything that the mythosthesia reveal.js slides need.

## Install

```bash
npm install @mythosthesia/reveal-course-preset
```

## Usage

1. Set your `vite.config.js` to:

```js
import { defineConfig } from "vite";
import { vitePlugins } from "@mythosthesia/reveal-course-preset/vite-plugins.js";

export default defineConfig({
  base: '/rust-lesson-1',
  plugins: vitePlugins,
});
```

2. Add these links to your `<head>`:

```html
<script type="module">
  import "reveal.js/dist/reveal.css";
  import "reveal.js/dist/theme/black.css";
  import "reveal.js/plugin/highlight/monokai.css";
  import "@mythosthesia/reveal-course-preset/styles.css";
</script>
```

3. Set your `reveal.js` config to:

```html
<script type="module">
  import Reveal from "reveal.js";
  import { plugins, config } from "@mythosthesia/reveal-course-preset";

  let deck = new Reveal();
  deck.initialize(config);
</script>
```

All set! Now you will be able to use all the features from these plugins:

- [reveal.js-animate-fragments](https://npmjs.com/package/reveal.js-animate-fragments)
- [reveal.js-script-fragment](https://npmjs.com/package/reveal.js-script-fragment)
- [reveal.js-svg-timeline-fragment](https://npmjs.com/package/reveal.js-svg-timeline-fragment)
- [reveal.js-mermaid-plugin](https://npmjs.com/package/reveal.js-mermaid-plugin)
- [@mythosthesia/visualize-rust-code-execution](https://npmjs.com/package/@mythosthesia/visualize-rust-code-execution)
- [@mythosthesia/reveal-course-elements](https://npmjs.com/package/@mythosthesia/reveal-course-elements)
