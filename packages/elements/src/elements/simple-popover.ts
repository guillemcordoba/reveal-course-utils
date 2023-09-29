import { css, html, LitElement } from "lit";
import { property, customElement } from "lit/decorators.js";

@customElement("simple-popover")
export class SimplePopover extends LitElement {
  render() {
    return html`<slot></slot>`;
  }

  static styles = css`
    :host {
      position: absolute;
      background-color: #4d4d4d;
      padding: 1rem;
      box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.26);
      border-radius: 10px;
      width: auto;
      transform: translate(16px, -15px);
      max-width: 600px;
      display: inline-flex;
      flex-direction: column;
      text-align: left;
      text-wrap: wrap;
      margin: auto;
      min-width: 150px;
    }
    :host:after {
      content: "";
      position: absolute;
      top: 6px;
      left: -8px;
      border-style: solid;
      border-width: 18px 12px 0;
      border-color: #4d4d4d transparent;
      display: block;
      width: 0;
      z-index: 1;
      transform: translate(-50%, 50%) rotate(90deg);
    }

    slot {
      color: white !important;
    }
  `;
}
