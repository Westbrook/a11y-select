import { html, LitElement, query, property, PropertyValues } from 'lit-element';
import { ifDefined } from 'lit-html/directives/if-defined.js';
import styles from './styles1.js';
import { SelectController, OptionData } from './SelectController.js';

export class A11ySelect1 extends LitElement {
    static styles = [styles];

    @query('#exp_button')
    button!: HTMLElement;

    @query('#exp_elem_list')
    listbox!: HTMLElement;

    @property({ type: Array, attribute: false })
    options: OptionData[] = [];

    _selectController!: SelectController;

    shouldUpdate(changedProperties: PropertyValues) {
        if (!this._selectController) {
            this._selectController = new SelectController({
                listbox: () => this.listbox,
                button: () => this.button,
                update: (cb?: () => void) => {
                    this.requestUpdate();
                    if (cb) {
                        this.updateComplete.then(() => {
                            requestAnimationFrame(cb)
                        });
                    }
                },
                options: this.options,
            });
        }
        return super.shouldUpdate(changedProperties);
    }

    render() {
        const {
            handleListboxClick,
            handleListboxFocus,
            handleListboxKeydown,
            handleButtonClick,
            handleButtonKeyup,
            handleBlur,
            optionAttributes,
            labelAttributes: {
                id: labelId,
            },
            listboxAttributes: {
                open,
                classList: listboxClassList,
                activeDescendant,
                id: listboxId,
                tabIndex: listboxTabIndex,
                role: listboxRole,
                ariaLabelledby: listboxLabelledby
            },
            buttonAttributes: {
                ariaExpanded: buttonAriaExpanded,
                ariaLabelledby: buttonAriaLabelledby,
                ariaHaspopup: buttonAriaHaspopup,
                id: buttonId,
                text: buttonText,
            }
        } = this._selectController;
        return html`
            <label id=${labelId}>
                Choose an element:
            </label>
            <button 
                @click=${handleButtonClick}
                @keyup=${handleButtonKeyup}
                aria-haspopup=${buttonAriaHaspopup}
                aria-labelledby=${buttonAriaLabelledby}
                aria-expanded=${buttonAriaExpanded}
                id=${buttonId}
            >${buttonText}</button>
            ${open
                ? html`
                    <ul id=${listboxId}
                        @click=${handleListboxClick}
                        @focus=${handleListboxFocus}
                        @keydown=${handleListboxKeydown}
                        @blur=${handleBlur}
                        tabindex=${listboxTabIndex}
                        role=${listboxRole}
                        aria-labelledby=${listboxLabelledby}
                        class=${listboxClassList}
                        aria-activedescendant=${ifDefined(activeDescendant)}
                    >
                        ${this.options.map((option, i) => {
                            const {
                                classList,
                                role,
                                id,
                                ariaSelected,
                            } = optionAttributes[i];
                            return html`
                                <li
                                    data-value=${option.value}
                                    id=${id}
                                    role=${role}
                                    class=${classList}
                                    aria-selected=${ariaSelected}
                                >
                                    ${option.name}
                                </li>   
                            `;
                        })}
                    </ul>
                `
                : html``
            }
        `;
    }
    firstUpdated() {
        const {
            handleBlur
        } = this._selectController;
    }
    _renders = 0;
    updated() {
        console.log(`WJ: Render #${this._renders++}. ${this._selectController.listboxAttributes.activeDescendant}`);
    }
}
