# @mythosthesia/visualize-rust-code-execution

Vite plugin that adds call-stack visualizations to rust code in reveal.js slides.

## Installation

0. Install `vite` with:

```bash
npm install -D vite
```

1. Install with:

```bash
npm install -D @mythosthesia/visualize-rust-code-execution
```

2. If you haven't already, install [rust](https://www.rust-lang.org/), and make sure that the rust built-in component `rust-gdb` is available as an executable in your terminal.

## Setup

1. In your `vite.config.js`, add the `visualizeRustCodeExecution` plugin:

```js
import { defineConfig } from "vite";
import visualizeRustCodeExecution from "../dist/index.js";

export default defineConfig({
  plugins: [visualizeRustCodeExecution()],
});
```

> This will parse the rust code from the slides, compile and run it, and add the execution steps to the reveal.js slides as fragments in the end of the code.

2. In the reveal.js setup, import `reveal.js-script-fragment` and the `rust-execution-visualizer` element:

```html
<script type="module">
  import Reveal from "reveal.js";
  import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
  import RevealScriptFragment from "reveal.js-script-fragment";
  import "@mythosthesia/visualize-rust-code-execution/dist/elements/rust-execution-visualizer.js";

  let deck = new Reveal({
    plugins: [RevealHighlight, RevealScriptFragment],
  });
  deck.initialize({});
</script>
```

This package depends on [`reveal.js-script-fragment`](https://npmjs.com/package/reveal.js-script-fragment), so it won't work if it isn't available on the reveal.js slides.

## Usage

Add `data-visualize-execution` to any `<code class="rust">` that you'd like to add visualization to:

```html
        <section>
<pre><code class="rust" data-visualize-execution data-trim data-noescape>
let s = String::from("mystring");
ref_function(&s);
ownership_function(s);

fn ref_function(s: &String) {}
fn ownership_function(s: String) {}
</code></pre>
        </section>
``` 