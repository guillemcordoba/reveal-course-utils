# reveal.js-animate-fragments

A [Reveal.js](https://revealjs.com/) plugin that adds new animations styles

## Installation

```bash
npm i reveal.js-animate-fragments
```

## Usage

Add the plugin:

```html
<script type="module">
  import RevealAnimate from "reveal.js-animate-fragments";

  import Reveal from "reveal.js";

  let deck = new Reveal({
    plugins: [RevealAnimate],
  });
  deck.initialize();
</script>
```

Animate options:

- `balanced`: whenever an opening delimiter is encountered, add the fragment with the balanced closing delimiter to the same animation fragment set as its corresponding opening line.

- `by-line`: splits each line of text (as rendered) from a block of html at the newlines
 - Wraps each line in a separate fragment.

- `separate-comments`
 - Comments are broken down into their own fragment.

- `trailing-comments-in-popover`
 - Whenever a line includes both non-comment code and a comment, the comment is extracted and shown in a first fragment as a popover, then the popover is hidden, and finally the comment is shown in a second fragment.
 - Hint: you can use `///` comments to avoid a popover in a specific comment.

- `with-ancestry`: all parent fragemnts are also visible.

- `strike-on-error-in-comment`: if a trailing comment starts with `// Error`, consider the line of code where the comment is placed an error, and add a strike fragment animation to that line of code.

```html
<section animate="by-line balanced separate-comments trailing-comments-in-popover with-ancestry strike-on-error-in-comment">
<pre><code class="rust">
struct Person {
  name: String, // Comment!
  age: u32
}
let immutable_var = 1;
immutable_var = 2; // Error
</code></pre>
</section>

<section language="markdown" animate="by-line with-ancestry">
- point 1
  - point 1b
- point 2   
</section>
```

## Compatibility with RevealHighlight

To work correctly, this plugin needs to be passed **before** `RevealHightlight` in the plugins array when initializing `Reveal`.

```js
import Reveal from "reveal.js";      
import Markdown from "reveal.js/plugin/markdown/markdown.esm.js";
import RevealHighlight from "reveal.js/plugin/highlight/highlight.esm.js";
import RevealAnimateFragments from "reveal.js-animate-fragments";

let deck = new Reveal({
  plugins: [Markdown, RevealAnimateFragments, RevealHighlight],
});
deck.initialize();
```