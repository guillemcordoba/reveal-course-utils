# reveal.js-animate-fragments

A [Reveal.js](https://revealjs.com/) plugin to execute a Javascript script as a fragment.

## Installation

```bash
npm install reveal.js-script-fragment
```

## Usage

Add the plugin:

```html
<script type="module">
  import RevealScriptFragment from "reveal.js-script-fragment";

  import Reveal from "reveal.js";

  let deck = new Reveal({
    plugins: [RevealScriptFragment ],
  });
  deck.initialize();
</script>
```

And then add a fragment script like this:

```html
<section>
  <span class="fragment">This is a fragment!</span>

  <script-fragment>
    <script data-on-show type="text/template">
      console.log('This will print when this fragment is shown');
    </script>
    <script data-on-hide type="text/template">
      console.log('This will print when this fragment is hidden');
    </script>
  </script-fragment>

</section>
```

Both scripts types `data-on-show` and `data-on-hide` are optional.
