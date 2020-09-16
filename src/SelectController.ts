export type ItemChangeDetail = {
    type: 'moved_up' | 'moved_down' | 'removed';
    elements: Option[];
}

export type Option = {
    role: 'option';
    classList: string;
    id: string;
    ariaSelected: 'true' | 'false';
    name: string;
}

export type OptionData = {
    name: string;
    value: string;
    default?: boolean;
}

export class SelectController {
    _update!: (cb?: () => void) => void;
    _listbox!: () => HTMLElement;
    _button!: () => HTMLElement;
    multiselectable = false;
    moveUpDownEnabled = false;
    siblingList: Set<Option> | null = null;
    upButton?: HTMLElement;
    downButton?: HTMLElement;
    moveButton?: HTMLElement;
    keysSoFar = '';
    searchIndex = 0;
    keyClear!: ReturnType<typeof setTimeout> | null;
    activeIndex: number = -1;

    get button() {
        return this._button();
    }

    get listbox() {
        return this._listbox();
    }

    constructor({
        listbox,
        update,
        button,
        options,
    }: {
        listbox: () => HTMLElement,
        button: () => HTMLElement,
        update: (cb?: () => void) => void,
        options: OptionData[],
    }) {
        this._listbox = listbox;
        this._button = button;
        this._update = update;
        this.optionAttributes = options.map((option, i) => {
            const id = this.labelAttributes.id + `_${i}`
            if (option.default) {
                this.buttonAttributes.text = option.name;
                this.activeIndex = i;
            }
            return {
                role: 'option',
                classList: '',
                id,
                ariaSelected: 'false',
                name: option.name,
            };
        });
    }
    labelAttributes: {
        id: string;
    } = {
        id: 'exp_elem'
    }
    optionAttributes: Option[];
    listboxAttributes: {
        open: boolean;
        classList: string;
        activeDescendant: string | undefined;
        ariaLabelledby: string;
        id: string;
        tabIndex: '-1' | '0';
        role: 'listbox';
    } = {
        open: false,
        classList: 'hidden',
        activeDescendant: undefined,
        id: 'exp_elem_list',
        tabIndex: '-1',
        role: 'listbox',
        ariaLabelledby: 'exp_elem'
    }
    buttonAttributes: {
        ariaExpanded: "true" | "false" | "undefined";
        ariaHaspopup: "true" | "false";
        ariaLabelledby: string;
        id: string;
        text: string;
    } = {
        ariaExpanded: 'false',
        ariaLabelledby: 'exp_elem exp_button',
        ariaHaspopup: 'true',
        id: 'exp_button',
        text: ''
    }
    handleListboxClick = (evt: Event & { target: HTMLElement}) => {
        this.checkClickItem(evt);
    }
    handleListboxFocus = () => {
        this.setupFocus();
    }
    handleBlur = (evt: FocusEvent) => {
        this.hideListbox();
    }
    handleListboxKeydown = (evt: KeyboardEvent) => {
        if(!this.listboxAttributes.open) {
            return;
        }
        this.checkKeyPress(evt);
        this.checkHide(evt);
    }
    handleButtonClick = () => {
        this.showListbox();
    }
    handleButtonKeyup = (evt: KeyboardEvent) => {
        console.log('wj: keyup', evt.code, evt.target);
        this.checkShow(evt);
    }
    showListbox() {
        this.listboxAttributes.classList = '';
        this.listboxAttributes.open = true;
        this.buttonAttributes.ariaExpanded = 'true';
        this._update(() => this.listbox.focus());
    }
    hideListbox() {
        this.listboxAttributes.classList = 'hidden';
        this.listboxAttributes.open = false;
        this.listboxAttributes.activeDescendant = undefined;
        this.buttonAttributes.ariaExpanded = 'false';
        this.buttonAttributes.text = this.optionAttributes[this.activeIndex].name;
        this._update(() => {
            console.log('wj: button focus');
            this.button.focus();
        });
    }
    checkShow(evt: KeyboardEvent) {
      var {code} = evt;
  
      switch (code) {
        case 'ArrowUp':
        case 'ArrowDown':
          evt.preventDefault();
          this.showListbox();
          this.checkKeyPress(evt);
          break;
      }
    }
    checkHide(evt: KeyboardEvent) {
        var { code } = evt;

        switch (code) {
        case 'Enter':
        case 'Escape':
            evt.preventDefault();
            this.hideListbox();
            console.log('close');
            this._update(() => {
                console.log('wj: button focus');
                this.button.focus();
            });
            break;
        }
    }
    checkClickItem(evt: Event & { target: HTMLElement}) {
        const { id } = evt.target;
        let index = -1;
        this.optionAttributes.forEach((option, i) => {
            if (option.id === id) {
                index = i
            }
        });
        if (index > -1) {
            this.focusItem(index);
            this.toggleSelectItem(index);
        }
    }
    setupFocus() {
        if (this.activeIndex === -1) {
            this.focusFirstItem();
        } else {
            this.focusItem(this.activeIndex);
        }
    }
    focusFirstItem() {
        if (this.optionAttributes.length) {
            this.focusItem(0);
        }
    }
    focusLastItem() {
        if (this.optionAttributes.length) {
            this.focusItem(this.optionAttributes.length - 1);
        }
    }
    defocusItem(index: number) {
        const option = this.optionAttributes[index];
        if (!option) {
            return;
        }
        if (!this.multiselectable) {
            option.ariaSelected = 'false';
        }
        option.classList = '';
    }
    focusItem(index: number) {
        this.defocusItem(this.activeIndex);
        const option = this.optionAttributes[index];
        if (!this.multiselectable) {
            option.ariaSelected = 'true';
        }
        option.classList = 'focused';
        this.listboxAttributes.activeDescendant = option.id;
        this.activeIndex = index;
        if (this.listbox) {
            const element = this.listbox.querySelector(`#${option.id}`) as HTMLElement;

            if (this.listbox.scrollHeight > this.listbox.clientHeight) {
                var scrollBottom = this.listbox.clientHeight + this.listbox.scrollTop;
                var elementBottom = element.offsetTop + element.offsetHeight;
                if (elementBottom > scrollBottom) {
                    this.listbox.scrollTop = elementBottom - this.listbox.clientHeight;
                }
                else if (element.offsetTop < this.listbox.scrollTop) {
                    this.listbox.scrollTop = element.offsetTop;
                }
            }
        }

        if (!this.multiselectable && this.moveButton) {
          this.moveButton.setAttribute('aria-disabled', 'false');
        }

        this.checkUpDownButtons();
        console.log('WJ: text');

        this._update();
    }
    checkUpDownButtons() {
        const { activeIndex } = this;

        if (!this.moveUpDownEnabled) {
            return false;
        }

        if (activeIndex > -1 && this.upButton && this.downButton) {
            this.upButton.setAttribute('aria-disabled', 'true');
            this.downButton.setAttribute('aria-disabled', 'true');
            return;
        }

        if (this.upButton && activeIndex > -1) {
            if (activeIndex > 0) {
                this.upButton.setAttribute('aria-disabled', 'false');
            }
            else {
                this.upButton.setAttribute('aria-disabled', 'true');
            }
        }

        if (this.downButton && activeIndex > -1) {
            if (activeIndex < this.optionAttributes.length - 1) {
                this.downButton.setAttribute('aria-disabled', 'false');
            }
            else {
                this.downButton.setAttribute('aria-disabled', 'true');
            }
        }
    }
    checkKeyPress(evt: KeyboardEvent) {
        var { code, key } = evt;
        let nextItem = this.activeIndex;

        if (nextItem == -1) {
            return;
        }

        switch (code) {
            case 'PageUp':
            case 'PageDown':
                if (this.moveUpDownEnabled) {
                    evt.preventDefault();

                    if (code === 'PageUp') {
                        this.moveUpItems();
                    }
                    else {
                        this.moveDownItems();
                    }
                }

                break;
            case 'ArrowUp':
            case 'ArrowDown':
                evt.preventDefault();

                if (this.moveUpDownEnabled && evt.altKey) {
                    if (code === 'ArrowUp') {
                        this.moveUpItems();
                    }
                    else {
                        this.moveDownItems();
                    }
                    return;
                }

                if (code === 'ArrowUp') {
                    nextItem -= 1;
                }
                else {
                    nextItem += 1;
                }

                if (nextItem > -1 && nextItem < this.optionAttributes.length) {
                    this.focusItem(nextItem);
                }

                break;
            case 'Home':
                evt.preventDefault();
                this.focusFirstItem();
                break;
            case 'End':
                evt.preventDefault();
                this.focusLastItem();
                break;
            case 'Space':
                evt.preventDefault();
                this.toggleSelectItem(nextItem);
                break;
            case 'Backspace':
            case 'Delete':
            case 'Enter':
                if (!this.moveButton) {
                    return;
                }

                var keyshortcuts = this.moveButton.getAttribute('aria-keyshortcuts');
                if (code === 'Enter' && keyshortcuts && keyshortcuts.indexOf('Enter') === -1) {
                    return;
                }
                if (
                    (code === 'Backspace' || code === 'Delete') &&
                    keyshortcuts && keyshortcuts.indexOf('Delete') === -1
                ) {
                    return;
                }

                evt.preventDefault();

                let nextUnselected = nextItem + 1;
                while (nextUnselected < this.optionAttributes.length) {
                    if (this.optionAttributes[nextUnselected].ariaSelected != 'true') {
                        break;
                    }
                    nextUnselected = nextUnselected + 1;
                }
                if (!nextUnselected) {
                    nextUnselected = nextItem - 1;
                    while (nextUnselected > -1) {
                        if (this.optionAttributes[nextUnselected].ariaSelected != 'true') {
                            break;
                        }
                        nextUnselected = nextItem - 1;
                    }
                }

                this.moveItems();

                if (this.activeIndex === -1 && nextUnselected) {
                    this.focusItem(nextUnselected);
                }
                break;
            default:
                var itemToFocus = this.findItemToFocus(key);
                if (itemToFocus > -1) {
                    this.focusItem(itemToFocus);
                }
                break;
        }
    }
    findItemToFocus(character: string) {
        if (!this.keysSoFar) {
            for (var i = 0; i < this.optionAttributes.length; i++) {
                if (i == this.activeIndex) {
                    this.searchIndex = i;
                }
            }
        }
        this.keysSoFar += character.toUpperCase();
        this.clearKeysSoFarAfterDelay();

        var nextMatch = this.findMatchInRange(
            this.optionAttributes,
            this.searchIndex + 1,
            this.optionAttributes.length
        );
        if (nextMatch < 0) {
            nextMatch = this.findMatchInRange(
                this.optionAttributes,
                0,
                this.searchIndex
            );
        }
        return nextMatch;
    }
    clearKeysSoFarAfterDelay() {
        if (this.keyClear) {
            clearTimeout(this.keyClear);
            this.keyClear = null;
        }
        this.keyClear = setTimeout(() => {
            this.keysSoFar = '';
            this.keyClear = null;
        }, 500);
    }

    findMatchInRange(list: Option[], startIndex: number, endIndex: number) {
      // Find the first item starting with the keysSoFar substring, searching in
      // the specified range of items
      for (var n = startIndex; n < endIndex; n++) {
        var label = list[n].name;
        if (label && label.toUpperCase().indexOf(this.keysSoFar) === 0) {
          return n;
        }
      }
      return -1;
    }
    moveUpItems() {
        const currentItem = this.optionAttributes[this.activeIndex];
        if (!currentItem) {
            return;
        }
        const previousItem = this.activeIndex - 1;

        if (previousItem > -1) {
            // array splice instead...
            // this.listbox.insertBefore(currentItem, previousItem);
            this.listbox.dispatchEvent(new CustomEvent<ItemChangeDetail>('item-change', {
                composed: true,
                bubbles: true,
                detail: {
                    type: 'moved_up',
                    elements: [currentItem]
                }
            }));
        }

        this.checkUpDownButtons();
    }

    moveDownItems() {
        const currentItem = this.optionAttributes[this.activeIndex];
        if (!currentItem) {
            return;
        }
        const nextItem = this.activeIndex + 1;

        if (nextItem < this.optionAttributes.length) {
            // array splice instead...
            // this.listbox.insertBefore(nextItem, currentItem);
            this.listbox.dispatchEvent(new CustomEvent<ItemChangeDetail>('item-change', {
                composed: true,
                bubbles: true,
                detail: {
                    type: 'moved_down',
                    elements: [currentItem]
                }
            }));
        }

        this.checkUpDownButtons();
    }
    moveItems() {
        if (!this.siblingList) {
            return;
        }

        var itemsToMove = this.deleteItems();
        itemsToMove.map(item => {
            if (this.siblingList) {
                this.siblingList.add(item);
            }
        });
    }
    toggleSelectItem(index: number) {
        if (this.multiselectable) {
            const option = this.optionAttributes[index];
            option.ariaSelected = option.ariaSelected === 'true' ? 'false' : 'true';

            if (this.moveButton) {
                if (this.listbox.querySelector('[aria-selected="true"]')) {
                    this.moveButton.setAttribute('aria-disabled', 'false');
                }
                else {
                    this.moveButton.setAttribute('aria-disabled', 'true');
                }
            }
        }
    }


    deleteItems() {
        let itemsToDelete;

        if (this.multiselectable) {
            itemsToDelete = this.optionAttributes.filter(option => option.ariaSelected === 'true');
        }
        else if (this.activeIndex > -1) {
            itemsToDelete = [this.optionAttributes[this.activeIndex]];
        }

        if (!itemsToDelete || !itemsToDelete.length) {
            return [];
        }

        itemsToDelete.forEach(((item) => {
            if (this.activeIndex > -1 && item.id === this.optionAttributes[this.activeIndex].id) {
                this.clearActiveDescendant();
            }
        }));

        this.listbox.dispatchEvent(new CustomEvent<ItemChangeDetail>('item-change', {
            composed: true,
            bubbles: true,
            detail: {
                type: 'removed',
                elements: itemsToDelete
            }
        }));

        return itemsToDelete;
    }

    clearActiveDescendant() {
        console.log('clear');
        this.listboxAttributes.activeDescendant = undefined;

        if (this.moveButton) {
            this.moveButton.setAttribute('aria-disabled', 'true');
        }

        this.checkUpDownButtons();
    }
}