import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { ref } from "lit/directives/ref.js";
import { animate, fadeIn, fadeOut } from "@lit-labs/motion";
import { unsafeStatic, withStatic } from "lit/static-html.js";
import RevealPlugin from "reveal.js/plugin/highlight/highlight.esm.js";

import { mdiFolder, mdiFile } from "@mdi/js";

export function wrapPathInSvg(path: string) {
  return html`<svg
    viewBox="0 0 24 24"
    style="fill: currentColor; width: 24px; height: 24px; margin-left: 4px;"
  >
    <path d="${path}"></path>
  </svg>`;
}

export type DirectoryContents = Record<string, DirectoryTreeNode>;
export type DirectoryTree = {
  type: "directory";
  contents: DirectoryContents;
};
export type DirectoryTreeNode =
  | DirectoryTree
  | {
      type: "file";
      content: string;
    };

@customElement("directory-tree")
export class DirectoryTreeEl extends LitElement {
  @property()
  tree: DirectoryTree;

  @property()
  displayCode = true;

  @property()
  highlightedPaths: Array<string> = [];

  createRenderRoot() {
    return this;
  }

  renderFile(name: string, content: string, last: boolean, path: string) {
    return html`<div
      style="display: flex; flex-direction: column; flex: 1; position: relative;"
    >
      ${this.highlightedPaths.includes(path)
        ? html`<div
            style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: solid 1px yellow"
            ${animate({
              in: fadeIn,
              out: fadeOut,
            })}
          ></div>`
        : html``}
      <div
        ${animate({
          in: fadeIn,
          out: fadeOut,
        })}
        style="display: flex; flex-direction: row; margin-bottom: -2px; margin-top: -2px; align-items: center;"
      >
        <span style="width: 30px">${last ? "└" : "├"}</span>
        ${wrapPathInSvg(mdiFile)}
        <span style="margin-left: 4px">${name}</span>
      </div>
      ${this.displayCode
        ? withStatic(html)`
              <div style="display: flex; flex-direction: row"
              ${ref((element) => {
                if (!element) return;
                setTimeout(() => {
                  RevealPlugin().highlightBlock(element.querySelector("code"));
                }, 1);
              })}
        >
                <div
                  style="display: flex; flex-direction: column; align-items: center; width: 30px"
                >
        ${
          !last
            ? html`
                <span
                  style="display: inline-block; height: 100%; border-left: solid 4px white; margin: 0 6px;"
                  ${animate({
                    in: fadeIn,
                    out: fadeOut,
                  })}
                ></span>
              `
            : html``
        }                </div>
                ${unsafeStatic(
                  `<pre style="margin: 0; margin-bottom: 16px"><code class="rust" >${content}</pre></code>`
                )}
              </div>
            `
        : html``}
    </div>`;
  }

  renderDirectory(name: string, last: boolean) {
    return html`<div
      ${animate({
        in: fadeIn,
        out: fadeOut,
      })}
      style="display: flex; flex-direction: row; margin-bottom: -2px; margin-top: -2px; align-items: center;"
    >
      <span style="width: 30px">${last ? "└" : "├"}</span>
      ${wrapPathInSvg(mdiFolder)}
      <span style="margin-left: 4px">${name}</span>
    </div>`;
  }

  renderTreeContents(contents: DirectoryContents, currentPath: string) {
    const contentsEntries = Object.entries(contents);
    return html` <div style="display: flex; flex-direction: column; flex: 1">
      ${repeat(
        contentsEntries,
        ([name]) => name,
        ([name, node], i) =>
          node.type === "directory"
            ? html`
                <div style=" position: relative;">
                  ${this.highlightedPaths.includes(`${currentPath}/${name}`)
                    ? html`<div
                        style="position: absolute; top: 0; left: 0; right: 0; bottom: 0; border: solid 1px yellow"
                        ${animate({
                          in: fadeIn,
                          out: fadeOut,
                        })}
                      ></div>`
                    : html``}
                  ${this.renderDirectory(
                    name,
                    i === contentsEntries.length - 1
                  )}
                  <div style="display: flex; flex-direction: row">
                    <div
                      style="display: flex; flex-direction: column; align-items: center; width: 30px"
                    >
                      ${i !== contentsEntries.length - 1
                        ? html`<span
                            style="display: inline-block; height: 100%; border-left: solid 4px white; margin: 0 6px;"
                            ${animate({
                              in: fadeIn,
                              out: fadeOut,
                            })}
                          ></span>`
                        : html``}
                    </div>
                    ${this.renderTreeContents(
                      node.contents,
                      `${currentPath}/${name}`
                    )}
                  </div>
                </div>
              `
            : html`${this.renderFile(
                name,
                node.content,
                i === contentsEntries.length - 1,
                `${currentPath}/${name}`
              )}`
      )}
    </div>`;
  }

  render() {
    return this.renderTreeContents(this.tree.contents, "");
  }
}
