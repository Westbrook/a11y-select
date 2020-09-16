import { html, css, LitElement, property } from 'lit-element';

export class A11ySelect1 extends LitElement {
  static styles = [css`
    :host {
        display: block;
    }
  `];

  render() {
    return html`
        <slot></slot>
    `;
  }
}