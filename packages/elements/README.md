# @mythosthesia/reveal-course-elements

Common elements and element related utilities to build reveal.js slides in the style of Mythosthesia.

## Elements

### SimplePopover

Import it like this:

```js
import "@mythosthesia/reveal-course-elements/dist/elements/simple-popover.js";
```

And then you can use it like this in your html:

```html
<simple-popover><span>Add your popover content here</span></simple-popover>
```

### DirectoryTree

Import it like this:

```js
import "@mythosthesia/reveal-course-elements/dist/elements/directory-tree.js";
```

And then you can use it like this in your html:

```html
<directory-tree></directory-tree>
<script>
  const directoryTreeElement = document.querySelector('directory-tree');

  // Sets the tree to show 
  directoryTreeElement.tree = {
    type: 'directory',
    contents: {
      src: {
        type: 'directory',
        contents: {
          'main.rs': {
            type: 'file',
            content: `fn main() {}`
          }
        }
      },
      'Cargo.toml': {
        type: 'file',
        content: `[package]`
      }
    }
  };

  // Adds a highlight border to the given paths
  directoryTreeElement.highlightedPaths = ['/src/main.rs'];
</script>
```
