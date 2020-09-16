import { html, fixture, expect } from '@open-wc/testing';

import {A11ySelect1} from '../src/A11ySelect1.js';
import '../a11y-select.js';

describe('A11ySelect', () => {
  it('passes the a11y audit', async () => {
    const el: A11ySelect1 = await fixture(html`
      <a11y-select></a11y-select>
    `);

    await expect(el).shadowDom.to.be.accessible();
  });
});
