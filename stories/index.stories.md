```js script
import { html } from '@open-wc/demoing-storybook';
import '../dist/a11y-select.js';
import { options } from '../dist/stories/options.js';

export default {
  title: 'A11ySelect',
  component: 'a11y-select-1',
  options: { selectedPanel: "storybookjs/knobs/panel" },
};
```

# A11ySelect

A component for...

## Features:

- a
- b
- ...

## How to use

### Installation

```bash
yarn add a11y-select
```

```js
import 'a11y-select/a11y-select.js';
```

```js preview-story
export const Native = () => html`
  <select>
    <option>
        Neptunium
    </option>
    <option>
        Plutonium
    </option>
    <option>
        Americium
    </option>
    <option>
        Curium
    </option>
    <option>
        Berkeoptionum
    </option>
    <option>
        Caoptionfornium
    </option>
    <option>
        Einsteinium
    </option>
    <option>
        Fermium
    </option>
    <option>
        Mendelevium
    </option>
    <option>
        Nobeoptionum
    </option>
    <option>
        Lawrencium
    </option>
    <option>
        Rutherfordium
    </option>
    <option>
        Dubnium
    </option>
    <option>
        Seaborgium
    </option>
    <option>
        Bohrium
    </option>
    <option>
        Hassium
    </option>
    <option>
        Meitnerium
    </option>
    <option>
        Darmstadtium
    </option>
    <option>
        Roentgenium
    </option>
    <option>
        Copernicium
    </option>
    <option>
        Nihonium
    </option>
    <option>
        Flerovium
    </option>
    <option>
        Moscovium
    </option>
    <option>
        optionvermorium
    </option>
    <option>
        Tennessine
    </option>
    <option>
        Oganesson
    </option>
</select>
`;
```

```js preview-story
export const Default = () => html`
  <a11y-select-1 .options=${options}>
  </a11y-select-1>
`;
```
