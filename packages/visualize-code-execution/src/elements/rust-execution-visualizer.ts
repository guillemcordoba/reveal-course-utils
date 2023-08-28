import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { repeat } from "lit/directives/repeat.js";
import { animate, fadeIn, flyAbove } from "@lit-labs/motion";
import { Frame } from "../types.js";

const colors = ["blue", "red", "green", "yellow"];

function removeImportsFromRustType(rustType: string): string {
  return rustType.replaceAll(/([a-zA-Z_]+::)*/gm, "");
}

@customElement("rust-execution-visualizer")
export class RustExecutionVisualizer extends LitElement {
  @property()
  frames: Array<Frame> = [];

  renderFrame(frame: Frame) {
    return html`
      <table
        style="margin-bottom: 8px"
        ${animate({
          in: flyAbove,
        })}
      >
        <thead>
          <th>${frame.fn_name}</th>
        </thead>

        ${repeat(
          Object.entries(frame.variables),
          ([name, _]) => name,
          ([name, variablecontent]) => html`
            <tr
              ${animate({
                in: fadeIn,
              })}
            >
              <td width="102px" style="border-right: 1px solid #ddd;">
                ${name}
              </td>
              <td style="border-right: 1px solid #ddd;">
                ${removeImportsFromRustType(variablecontent.type)}
              </td>
              <td style="text-align: center;" width="160px">
                ${variablecontent.value}
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
  `;
}
