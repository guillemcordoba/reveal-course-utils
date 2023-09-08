import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { animate, fadeIn, fadeOut } from "@lit-labs/motion";

import { Frame } from "../types.js";
import { VariablesChanged } from "../utils.js";

function removeImportsFromRustType(rustType: string): string {
  return rustType.replaceAll(/([a-zA-Z_]+::)*/gm, "");
}

@customElement("rust-execution-visualizer")
export class RustExecutionVisualizer extends LitElement {
  @property()
  highlightType: "yellow-box" | "red-background" = "yellow-box"; // Segmented by frame name, variable name

  @property()
  changed: VariablesChanged = {}; // Segmented by frame name, variable name

  @property()
  frames: Array<Frame> = [];

  renderFrame(frame: Frame) {
    return html`
      <table
        style="margin-bottom: 8px"
        ${animate({
          in: fadeIn,
          out: fadeOut,
          properties: ["opacity", "top", "background"],
        })}
        class=${classMap({
          "changed-table": this.changed[frame.fn_name]?.newFrame,
          "yellow-highlight": this.highlightType === "yellow-box",
          "red-highlight": this.highlightType === "red-background",
        })}
      >
        <caption>
          <span> ${frame.fn_name} </span>
        </caption>

        ${repeat(
          Object.entries(frame.variables).sort(([n1], [n2]) =>
            n1.localeCompare(n2)
          ),
          ([name, variableContent]) => variableContent.address,
          ([name, variablecontent]) => html`
            <tr
              ${animate({
                in: fadeIn,
                out: fadeOut,
                properties: ["opacity"],
              })}
            >
              <td
                width="102px"
                style="border-right: 1px solid #ddd;"
                class=${classMap({
                  changed: this.changed[frame.fn_name]?.variables[name]?.name,
                })}
                ${animate({
                  properties: ["background"],
                })}
              >
                ${name}
              </td>
              <td
                style="border-right: 1px solid #ddd;"
                class=${classMap({
                  changed: this.changed[frame.fn_name]?.variables[name]?.type,
                })}
                ${animate({
                  properties: ["background"],
                })}
              >
                ${removeImportsFromRustType(variablecontent.type)}
              </td>
              <td
                style="text-align: center;"
                width="160px"
                class=${classMap({
                  changed: this.changed[frame.fn_name]?.variables[name]?.value,
                })}
                ${animate({
                  properties: ["background"],
                })}
              >
                ${variablecontent.value.match(/^\"\\2/gm)
                  ? "[CONSUMED]"
                  : removeImportsFromRustType(variablecontent.value)}
              </td>
            </tr>
          `
        )}
      </table>
    `;
  }

  render() {
    return html`
      <div class="column">
        ${repeat(
          this.frames,
          (frame) => frame.fn_name,
          (frame) => this.renderFrame(frame)
        )}
      </div>
    `;
  }

  static styles = css`
    .row {
      display: flex;
      flex-direction: row;
    }
    .column {
      display: flex;
      flex-direction: column;
    }
    table {
      width: 100%;
      text-align: left;
      border-radius: 2px;
      box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
    }
    thead {
      margin: 8px;
      background-color: white;
    }
    tr {
      padding: 8px;
      flex-direction: row;
    }
    td {
      padding: 8px;
    }
    table tr:nth-child(even) {
      background-color: #f2f2f2;
    }
    table tr:nth-child(odd) {
      background-color: #ffffff;
    }
    caption {
      background: white;
    }
    caption span {
      display: block;
    }

    .red-highlight .changed {
      background: rgba(255, 0, 0, 0.5);
    }
    .red-highlight.changed-table td {
      background: rgba(255, 0, 0, 0.5);
    }
    .red-highlight.changed-table caption span {
      background: rgba(255, 0, 0, 0.5);
    }

    .yellow-highlight .changed {
      background: yellow;
    }
    .yellow-highlight.changed-table td {
      background: yellow;
    }
    .yellow-highlight.changed-table caption span {
      background: yellow;
    }
  `;
}
