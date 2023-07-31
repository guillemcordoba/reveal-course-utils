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

      if (nodeHasAnimateValue(animateElement, "trailing-comments-in-popover")) {
        animateElement.innerHTML = animateElement.innerHTML.replace(
          /^(.*\S.*)\/\/(.*)$/gm,
          '$1<simple-popover data-popover-fragment-skip class="fragment fade-in-then-out">$2</simple-popover><span class="fragment fade-in">//$2</span>'
        );

        if (
          nodeHasAnimateValue(animateElement, "separate-comments") &&
          !nodeHasAnimateValue(animateElement, "by-line")
        ) {
          console.log(animateElement.innerHTML);
          animateElement.innerHTML = animateElement.innerHTML.replace(
            /^(.*\s.*)\/\/(.*)$/gm,
            '$1<span class="fragment fade-in">//$2</span>'
          );
          console.log(animateElement.innerHTML, "2");
        }
      } else if (
        nodeHasAnimateValue(animateElement, "separate-comments") &&
        !nodeHasAnimateValue(animateElement, "by-line")
      ) {
        animateElement.innerHTML = animateElement.innerHTML.replace(
          /\/\/(.*)$/gm,
          '<span class="fragment fade-in">//$1</span>'
        );
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
          console.log(animateElement.innerHTML, 4);
          animateElement.innerHTML = animateElement.innerHTML.replace(
            /^(\ *(?:[^{} \n]+) *[^{}\n]*)$/gm,
            '<span class="fragment fade-in">$1</span>'
          );
        }
      }

      console.log(animateElement.innerHTML, 3);
    }
  },
});
