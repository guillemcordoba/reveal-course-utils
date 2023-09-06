import { readFileSync } from "fs";

export default function includeSvgsPlugin() {
  return {
    name: "include-svgs",
    transformIndexHtml(html) {
      return includeSvgs(html);
    },
  };
}

// Look for `<svg src="FILENAME.svg">` tags, and replace their content with the actual svg file, allowing svg-timeline-fragment to be used with them
function includeSvgs(code, rootPath = process.cwd()) {
  const matches = code.matchAll(
    /<svg([\s\S]*?)\ssrc="([\s\S]*?)"([\s\S]*?)>[\s\S]*?<\/svg>/gm
  );

  for (const match of [...matches].reverse()) {
    let svg = readFileSync(`${rootPath}/${match[2]}`, "utf8");
    svg = svg.replace(/[\s\S]*<svg /gm, `<svg ${match[1]} ${match[3]}`);
    const startIndex = match.index;
    const endIndex = match.index + match[0].length;
    code = code.slice(0, startIndex) + svg + code.slice(endIndex);
  }
  return code;
}
