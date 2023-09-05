import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";
import { classMap } from "lit/directives/class-map.js";
import { repeat } from "lit/directives/repeat.js";
import { animate, fadeIn, fadeOut, flyAbove } from "@lit-labs/motion";

import { Frame } from "../types.js";

const colors = ["blue", "red", "green", "yellow"];

function removeImportsFromRustType(rustType: string): string {
  return rustType.replaceAll(/([a-zA-Z_]+::)*/gm, "");
}

@customElement("rust-execution-visualizer")
export class RustExecutionVisualizer extends LitElement {
  @property()
  displayChanged = true;

  _changed: Record<
    string,
    {
      newFrame: boolean;
      variables: Record<
        string,
        {
          name: boolean;
          type: boolean;
          value: boolean;
        }
      >;
    }
  > = {}; // Segmented by frame name, variable name

  _frames: Array<Frame> = [];
  get frames() {
    return this._frames;
  }

  @property()
  set frames(f: Array<Frame>) {
    const oldFrames = this._frames;

    this._changed = {};

    for (const newFrame of f) {
      this._changed[newFrame.fn_name] = {
        newFrame: false,
        variables: {},
      };
      const oldFrame = oldFrames.find(
        (oldFrame) => oldFrame.fn_name === newFrame.fn_name
      );
      if (!oldFrame) {
        // This frame is new
        this._changed[newFrame.fn_name].newFrame = true;
      } else {
        // Frame is the same
        for (const [newVarName, newVarContents] of Object.entries(
          newFrame.variables
        )) {
          const oldVariableContent = oldFrame.variables[newVarName];
          if (oldVariableContent) {
            if (oldVariableContent.address !== newVarContents.address) {
              // This is a new variable
              this._changed[newFrame.fn_name].variables[newVarName] = {
                name: true,
                type: true,
                value: true,
              };
            } else {
              const typeChanged =
                oldVariableContent.type !== newVarContents.type;
              const valueChanged =
                oldVariableContent.value !== newVarContents.value;

              this._changed[newFrame.fn_name].variables[newVarName] = {
                name: false,
                type: typeChanged,
                value: valueChanged,
              };
            }
          } else {
            // This is a new variable
            this._changed[newFrame.fn_name].variables[newVarName] = {
              name: true,
              type: true,
              value: true,
            };
          }
        }
      }
    }

    this._frames = f;

    this.requestUpdate();
  }

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
          "changed-table": this._changed[frame.fn_name].newFrame,
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
                  changed: this._changed[frame.fn_name].variables[name]?.name,
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
                  changed: this._changed[frame.fn_name].variables[name]?.type,
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
                  changed: this._changed[frame.fn_name].variables[name]?.value,
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
      <div
        class=${classMap({
          column: true,
          "display-changed": this.displayChanged,
        })}
      >
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

    .display-changed .changed {
      background: rgba(255, 0, 0, 0.5);
    }
    .display-changed .changed-table td {
      background: rgba(255, 0, 0, 0.5);
    }
    .display-changed .changed-table caption span {
      background: rgba(255, 0, 0, 0.5);
    }
  `;
}
