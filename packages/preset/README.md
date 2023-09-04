# @mythosthesia/reveal-course-preset

Preset that includes everything that the mythosthesia reveal.js slides need.

## Install

```bash
npm install @mythosthesia/reveal-course-preset
```

## Usage

1. Set your `rollup.config.js` to:

```js
import { rollupConfig } from "@mythosthesia/reveal-course-preset/rollup.preset.js";

export default rollupConfig("rust-lesson-1");
```

2. Add these links to your `<head>`:

```html
<link rel="stylesheet" href="/node_modules/reveal.js/dist/reveal.css" />
<link
  rel="stylesheet"
  href="/node_modules/reveal.js/dist/theme/black.css"
/>
<link
  rel="stylesheet"
  href="/node_modules/reveal.js/plugin/highlight/monokai.css"
/>
<link rel="stylesheet" href="/node_modules/@mythosthesia/reveal-course-preset/styles.css" />
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
- [@mythosthesia/visualize-rust-code-execution](https://npmjs.com/package/@mythosthesia/visualize-rust-code-execution)
- [@mythosthesia/reveal-course-elements](https://npmjs.com/package/@mythosthesia/reveal-course-elements)
