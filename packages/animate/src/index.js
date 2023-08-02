import { marked } from "marked";
import "reveal-course-elements/dist/elements/simple-popover.js";

function nodeHasLanguageValue(node, value) {
  return (
    node.attributes.language && node.attributes.language.nodeValue === value
  );
}

function nodeHasAnimateValue(node, animateValue) {
  return (
    node.attributes.animate &&
    node.attributes.animate.nodeValue.split(" ").includes(animateValue)
  );
}

function getParents(elem) {
  // Set up a parent array
  var parents = [];

  // Push each parent element to the array
  for (; elem && elem !== document; elem = elem.parentNode) {
    parents.push(elem);
  }

  // Return our parent array
  return parents;
}

function hasClass(elem, clas) {
  return elem.classList.contains(clas);
}

function addFragmentToParents(elem) {
  // event.fragment = the fragment DOM element
  const parentFragments = getParents(elem).filter((e) =>
    hasClass(e, "fragment")
  );
  for (const el of parentFragments) {
    el.classList.add("current-fragment");
  }
}

function getCurrentFragment() {
  const currentFragmentEls = document.querySelectorAll(".current-fragment");

  let highestIndex = 0;
  let currentFragment = undefined;

  for (const el of currentFragmentEls) {
    if (
      el.hasAttribute("data-fragment-index") &&
      parseInt(el.attributes["data-fragment-index"].value) > highestIndex
    ) {
      currentFragment = el;
      highestIndex = parseInt(el.attributes["data-fragment-index"].value);
    }
  }

  return currentFragment;
}

export default () => ({
  id: "animate-fragments",
  init: async (deck) => {
    deck.on("fragmentshown", (event) => {
      const parents = getParents(event.fragment.parentNode);
      if (!parents.some((p) => nodeHasAnimateValue(p, "with-ancestry"))) return;

      addFragmentToParents(event.fragment.parentNode);
    });
    deck.on("fragmenthidden", (event) => {
      const currentFragment = getCurrentFragment();

      if (
        !getParents(event.fragment.parentNode).some((p) =>
          nodeHasAnimateValue(p, "with-ancestry")
        )
      )
        return;

      addFragmentToParents(currentFragment);
    });

    const markdownElements = document.querySelectorAll('[language="markdown"]');

    for (const markdownElement of markdownElements) {
      markdownElement.innerHTML = markdownElement.innerHTML.replace(
        /<li([^>]*)>/gm,
        "<li data-marker $1>"
      );

      const lines = markdownElement.innerHTML.split("\n");

      const isEmptyLine = (line) => line.match(/[^\W]/gm);

      const countWhitespaces = (line) => line.search(/[^\ \t]/gm);

      const minWhitespaces = lines
        .filter(isEmptyLine)
        .map(countWhitespaces)
        .reduce((acc, next) => (acc > next ? next : acc), 1000);

      const leadingWhitespacesString = Array(minWhitespaces).fill(" ").join("");

      const leadingWhitespaces = new RegExp(
        `^${leadingWhitespacesString}`,
        "gm"
      );

      const removeLeadingWhitespaces = (line) =>
        line.replace(leadingWhitespaces, "");

      markdownElement.innerHTML = lines
        .map(removeLeadingWhitespaces)
        .join("\n");

      markdownElement.innerHTML = marked.parse(markdownElement.innerHTML);
    }

    const animateElements = document.querySelectorAll("[animate]");

    for (const animateElement of animateElements) {
      if (nodeHasAnimateValue(animateElement, "balanced")) {
        animateElement.innerHTML = animateElement.innerHTML.replace(
          /^(.*){(.*)$/gm,
          '<span class="fragment fade-in">$1{$2'
        );
        animateElement.innerHTML = animateElement.innerHTML.replace(
          /}(.*)$/gm,
          "}$1</span>"
        );
        /* 
        fragment.innerHTML = fragment.innerHTML.replace(
          /\(([^\)])/gm,
          '(<span class="fragment fade-in">$1'
        );
        fragment.innerHTML = fragment.innerHTML.replace(
          /([^\(\)])\)([^\)])/gm,
          "$1</span>)$2"
        );
        fragment.innerHTML = fragment.innerHTML.replace(
          /([^\(])\)\)/gm,
          "$1</span>)</span>)"
        );
        fragment.innerHTML = fragment.innerHTML.replace(
          /\(\)\)/gm,
          "()</span>)"
          );
          */
      }
      if (nodeHasAnimateValue(animateElement, "by-line")) {
        if (nodeHasLanguageValue(animateElement, "markdown")) {
          animateElement.innerHTML = animateElement.innerHTML.replace(
            /<li>/gm,
            '<li class="fragment fade-in-then-semi-out">'
          );
          animateElement.innerHTML = animateElement.innerHTML.replace(
            /<h4([^>]*)*>/gm,
            '<h4 $1 class="fragment fade-in">'
          );
          animateElement.innerHTML = animateElement.innerHTML.replace(
            /<h3([^>]*)*>/gm,
            '<h3 $1 class="fragment fade-in">'
          );
          animateElement.innerHTML = animateElement.innerHTML.replace(
            /<h2>/gm,
            '<h2 class="fragment fade-in">'
          );
        } else {
          if (
            nodeHasAnimateValue(animateElement, "trailing-comments-in-popover")
          ) {
            let searchResults = animateElement.innerHTML.matchAll(
              /^(\ *[^{}\ \n]+ *[^{}\n]*)$/gm
            );
            for (const result of Array.from(searchResults).reverse()) {
              let s = result[0];
              if (s.split("//")[0].match(/.*[^\ \t].*/gm)) {
                let replaced = `<span class="fragment fade-in">${
                  s.split("//")[0]
                }</span>${s.split("//")[1] ? `//${s.split("//")[1]}` : ``}`;
                animateElement.innerHTML =
                  animateElement.innerHTML.slice(0, result.index) +
                  replaced +
                  animateElement.innerHTML.slice(result.index + s.length);
              }
            }
          } else {
            animateElement.innerHTML = animateElement.innerHTML.replace(
              /^(\ *[^{} \n]+ *[^{}\n]*)$/gm,
              '<span class="fragment fade-in">$1</span>'
            );
          }
        }
      }

      if (nodeHasAnimateValue(animateElement, "trailing-comments-in-popover")) {
        if (nodeHasAnimateValue(animateElement, "separate-comments")) {
          const lines = animateElement.innerHTML
            // .replace(
            //   /<simple-popover\ [^>]*>[\w\W\n]*?<\/simple-popover>/gm,
            //   ""
            // )
            .split("\n");
          for (let i = 0; i < lines.length; i++) {
            if (!!lines[i].match(/^(\s*)\/\/(.*)$/gm)) {
              if (i === 0) {
                lines[i] = `<span class="fragment fade-in">${lines[i]}</span>`;
              } else {
                const line = removeFragmentSpan(lines[i]);
                const previousLine = removeFragmentSpan(lines[i - 1]);
                console.log(line, "h", lines[i - 1]);
                const lineCommentIndex = line.split("//")[0].length;

                if (
                  lineCommentIndex === 0 ||
                  lineCommentIndex !== previousLine.split("//")[0].length
                ) {
                  lines[
                    i
                  ] = `<span class="fragment fade-in">${lines[i]}</span>`;
                }
              }
            }
          }
          animateElement.innerHTML = lines.join("\n");
        }

        let searchResults = animateElement.innerHTML.matchAll(
          /^(.*\S.*)\/\/([^\n]*)(\n[\ \t]*\/\/(.*))*$/gm
        );

        for (const result of Array.from(searchResults).reverse()) {
          let s = result[0];

          // If this line contains just a <span class="fragment fade-in"> // Some comment</span>, this is a false alarm, skip
          if (!!s.match(/^<[^>]*?>\s*?\/\/[^<]*?<\/[^>]*?>$/gm)) {
            continue;
          }

          let split = s.split("\n");

          const popoverContent = [];
          let firstLine = split[0];

          let commentFirstLine = firstLine;

          if (commentFirstLine.startsWith('<span class="fragment fade-in">')) {
            commentFirstLine = commentFirstLine.split(
              '<span class="fragment fade-in">'
            )[1];
            commentFirstLine = commentFirstLine.split("</span>")[0];
          }

          let commentIndex = commentFirstLine.split("//")[0].length;

          const regex = new RegExp(`^\ {${commentIndex}}\/\/`);

          const lines = [
            firstLine,
            ...split.slice(1).filter((l) => !!l.match(regex)),
          ];
          const lastIndex = lines.reduce(
            (acc, next) => acc + next.length + 1,
            0
          );

          const commentContent =
            `//${firstLine.split("//")[1]}` +
            (lines.length > 1 ? "\n" : "") +
            lines.slice(1).join("\n");
          let firstLineBeforeComment = firstLine.split("//")[0];

          for (const line of lines) {
            let split2 = line.split("//");
            popoverContent.push(split2[1]);
          }

          let markdown = marked.parse(popoverContent.join("\n").trim());

          if (nodeHasAnimateValue(animateElement, "by-line")) {
            markdown = markdown.replace(
              /<li>/gm,
              '<li class="fragment fade-in-then-semi-out">'
            );
            markdown = markdown.replace(
              /<h4([^>]*)*>/gm,
              '<h4 $1 class="fragment fade-in">'
            );
            markdown = markdown.replace(
              /<h3([^>]*)*>/gm,
              '<h3 $1 class="fragment fade-in">'
            );
            markdown = markdown.replace(
              /<h2>/gm,
              '<h2 class="fragment fade-in">'
            );
          }
          let replaced = `${firstLineBeforeComment}<simple-popover class="fragment fade-in-then-out" style="--r-block-margin: 0">${markdown}</simple-popover><span class="fragment fade-in">${commentContent}</span>`;
          animateElement.innerHTML =
            animateElement.innerHTML.slice(0, result.index) +
            replaced +
            animateElement.innerHTML.slice(result.index + lastIndex - 1);
        }
      } else if (nodeHasAnimateValue(animateElement, "separate-comments")) {
        animateElement.innerHTML = animateElement.innerHTML.replace(
          /\/\/(.*)$/gm,
          '<span class="fragment fade-in">//$1</span>'
        );
      }
    }
  },
});

function removeFragmentSpan(html) {
  if (html.startsWith('<span class="fragment fade-in">')) {
    html = html.split('<span class="fragment fade-in">')[1];
    html = html.split("</span>")[0];
  }
  return html;
}
