import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { Frame } from "types";

const colors = ["blue", "red", "green", "yellow"];

@customElement("rust-execution-visualizer")
export class RustExecutionVisualizer extends LitElement {
  @property()
  frames: Array<Frame> = [];

  renderFrame(frame: Frame) {
    return html`
      <table style="margin-bottom: 8px">
        <thead>
          <th>${frame.fn_name}</th>
        </thead>

        ${Object.entries(frame.variables).map(
          ([name, variablecontent]) => html`
            <tr>
              <td style="border-right: 1px solid #ddd;">${name}</td>
              <td style="border-right: 1px solid #ddd;">
                ${variablecontent.type}
              </td>
              <td style="text-align: center">${variablecontent.value}</td>
            </tr>
          `
        )}
      </table>
    `;
  }

  render() {
    return html`
      <div class="column">
        ${this.frames.map((frame) => this.renderFrame(frame))}
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
    }
    tr {
      padding: 8px;
      display: flex;
      flex-direction: row;
    }
    td {
      flex: 1;
    }
    table tr:nth-child(even) {
      background-color: #f2f2f2;
    }
  `;
}
