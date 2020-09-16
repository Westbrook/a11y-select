import { template } from './template.js';

export class A11ySelect extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    this.moveUpDownEnabled = false;
    this.siblingList = null;
    this.upButton = null;
    this.downButton = null;
    this.moveButton = null;
    this.keysSoFar = '';
    this.handleFocusChange = function () {};
    this.handleItemChange = function (event, items) {};
    this.registerEvents();
  }
  connectedCallback() {
    if (this._initialized) return;
    this.shadowRoot.appendChild(template.content.cloneNode(true));
    this.activeDescendant = this.getAttribute('aria-activedescendant');
    this.multiselectable = this.hasAttribute('aria-multiselectable');
    this.button = this.shadowRoot.querySelector('button');
    this.registerButtonEvents();
    this._initialized = true;
  }

  registerEvents() {
    this.addEventListener('focus', this.setupFocus.bind(this));
    this.addEventListener('keydown', this.checkKeyPress.bind(this));
    this.addEventListener('click', this.checkClickItem.bind(this));
  }
  
  registerButtonEvents() {
    this.button.addEventListener('click', this.showListbox.bind(this));
    this.button.addEventListener('keyup', this.checkShow.bind(this));
    this.addEventListener('focusout', (evt) => {
      if (this.contains(evt.relatedTarget) || this.shadowRoot.contains(evt.relatedTarget)) return;
      this.hideListbox(evt)
    });
    this.addEventListener('keydown', this.checkHide.bind(this));
    this.setHandleFocusChange(this.onFocusChange.bind(this));
  }

  checkShow(evt) {
    console.log(evt.target);
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

  checkHide(evt) {
    var {code} = evt;

    switch (code) {
      case 'Enter':
      case 'Escape':
        evt.preventDefault();
        this.hideListbox();
        this.button.focus();
        break;
    }
  }

  listbox() {
    return this.querySelector('ul');
  }

  showListbox() {
    const listbox = this.listbox();
    listbox.classList.remove('hidden');
    this.button.setAttribute('aria-expanded', 'true');
    listbox.focus();
  }

  hideListbox() {
    this.listbox().classList.add('hidden');
    this.button.removeAttribute('aria-expanded');
  }

  onFocusChange(focusedItem) {
    this.button.innerText = focusedItem.innerText;
  }

  setupFocus() {
    if (this.activeDescendant) {
      return;
    }

    this.focusFirstItem();
  }

  focusFirstItem() {
    var firstItem;

    firstItem = this.querySelector('[role="option"]');

    if (firstItem) {
      this.focusItem(firstItem);
    }
  };

  focusLastItem() {
    var itemList = this.querySelectorAll('[role="option"]');

    if (itemList.length) {
      this.focusItem(itemList[itemList.length - 1]);
    }
  }

  checkKeyPress(evt) {
    console.trace();
    var {code} = evt;
    var nextItem = this.querySelector(`#${this.activeDescendant}`);

    if (!nextItem) {
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
          nextItem = nextItem.previousElementSibling;
        }
        else {
          nextItem = nextItem.nextElementSibling;
        }

        if (nextItem) {
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
        if (code === 'Enter' && keyshortcuts.indexOf('Enter') === -1) {
          return;
        }
        if (
          (code === 'Backspace' || code === 'Delete') &&
          keyshortcuts.indexOf('Delete') === -1
        ) {
          return;
        }

        evt.preventDefault();

        var nextUnselected = nextItem.nextElementSibling;
        while (nextUnselected) {
          if (nextUnselected.getAttribute('aria-selected') != 'true') {
            break;
          }
          nextUnselected = nextUnselected.nextElementSibling;
        }
        if (!nextUnselected) {
          nextUnselected = nextItem.previousElementSibling;
          while (nextUnselected) {
            if (nextUnselected.getAttribute('aria-selected') != 'true') {
              break;
            }
            nextUnselected = nextUnselected.previousElementSibling;
          }
        }

        this.moveItems();

        if (!this.activeDescendant && nextUnselected) {
          this.focusItem(nextUnselected);
        }
        break;
      default:
        var itemToFocus = this.findItemToFocus(code);
        if (itemToFocus) {
          this.focusItem(itemToFocus);
        }
        break;
    }
  }

  findItemToFocus(key) {
    var itemList = this.querySelectorAll('[role="option"]');
    var character = String.fromCharCode(key);

    if (!this.keysSoFar) {
      for (var i = 0; i < itemList.length; i++) {
        if (itemList[i].getAttribute('id') == this.activeDescendant) {
          this.searchIndex = i;
        }
      }
    }
    this.keysSoFar += character;
    this.clearKeysSoFarAfterDelay();

    var nextMatch = this.findMatchInRange(
      itemList,
      this.searchIndex + 1,
      itemList.length
    );
    if (!nextMatch) {
      nextMatch = this.findMatchInRange(
        itemList,
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

  findMatchInRange(list, startIndex, endIndex) {
    // Find the first item starting with the keysSoFar substring, searching in
    // the specified range of items
    for (var n = startIndex; n < endIndex; n++) {
      var label = list[n].innerText;
      if (label && label.toUpperCase().indexOf(this.keysSoFar) === 0) {
        return list[n];
      }
    }
    return null;
  }

  checkClickItem(evt) {
    if (evt.target.getAttribute('role') === 'option') {
      this.focusItem(evt.target);
      this.toggleSelectItem(evt.target);
    }
  }

  toggleSelectItem(element) {
    if (this.multiselectable) {
      element.setAttribute(
        'aria-selected',
        element.getAttribute('aria-selected') === 'true' ? 'false' : 'true'
      );

      if (this.moveButton) {
        if (this.querySelector('[aria-selected="true"]')) {
          this.moveButton.setAttribute('aria-disabled', 'false');
        }
        else {
          this.moveButton.setAttribute('aria-disabled', 'true');
        }
      }
    }
  }

  defocusItem(element) {
    if (!element) {
      return;
    }
    if (!this.multiselectable) {
      element.removeAttribute('aria-selected');
    }
    element.classList.remove('focused');
  }

  focusItem(element) {
    this.defocusItem(this.querySelector(`#${this.activeDescendant}`));
    if (!this.multiselectable) {
      element.setAttribute('aria-selected', 'true');
    }
    element.classList.add('focused');
    this.setAttribute('aria-activedescendant', element.id);
    this.activeDescendant = element.id;

    if (this.scrollHeight > this.clientHeight) {
      var scrollBottom = this.clientHeight + this.scrollTop;
      var elementBottom = element.offsetTop + element.offsetHeight;
      if (elementBottom > scrollBottom) {
        this.scrollTop = elementBottom - this.clientHeight;
      }
      else if (element.offsetTop < this.scrollTop) {
        this.scrollTop = element.offsetTop;
      }
    }

    if (!this.multiselectable && this.moveButton) {
      this.moveButton.setAttribute('aria-disabled', false);
    }

    this.checkUpDownButtons();
    this.handleFocusChange(element);
  }

  checkUpDownButtons() {
    var activeElement = this.querySelector(`#${this.activeDescendant}`);

    if (!this.moveUpDownEnabled) {
      return false;
    }

    if (!activeElement) {
      this.upButton.setAttribute('aria-disabled', 'true');
      this.downButton.setAttribute('aria-disabled', 'true');
      return;
    }

    if (this.upButton) {
      if (activeElement.previousElementSibling) {
        this.upButton.setAttribute('aria-disabled', false);
      }
      else {
        this.upButton.setAttribute('aria-disabled', 'true');
      }
    }

    if (this.downButton) {
      if (activeElement.nextElementSibling) {
        this.downButton.setAttribute('aria-disabled', false);
      }
      else {
        this.downButton.setAttribute('aria-disabled', 'true');
      }
    }
  }

  addItems = function (items) {
    if (!items || !items.length) {
      return false;
    }

    items.forEach((item) => {
      this.defocusItem(item);
      this.toggleSelectItem(item);
      this.append(item);
    });

    if (!this.activeDescendant) {
      this.focusItem(items[0]);
    }

    this.handleItemChange('added', items);
  }

  deleteItems() {
    var itemsToDelete;

    if (this.multiselectable) {
      itemsToDelete = this.querySelectorAll('[aria-selected="true"]');
    }
    else if (this.activeDescendant) {
      itemsToDelete = [ this.querySelector(`#${this.activeDescendant}`) ];
    }

    if (!itemsToDelete || !itemsToDelete.length) {
      return [];
    }

    itemsToDelete.forEach(((item) => {
      item.remove();

      if (item.id === this.activeDescendant) {
        this.clearActiveDescendant();
      }
    }));

    this.handleItemChange('removed', itemsToDelete);

    return itemsToDelete;
  }

  clearActiveDescendant() {
    this.activeDescendant = null;
    this.setAttribute('aria-activedescendant', null);

    if (this.moveButton) {
      this.moveButton.setAttribute('aria-disabled', 'true');
    }

    this.checkUpDownButtons();
  }

  moveUpItems() {
    var previousItem;

    if (!this.activeDescendant) {
      return;
    }

    currentItem = this.querySelector(`#${this.activeDescendant}`);
    previousItem = currentItem.previousElementSibling;

    if (previousItem) {
      this.insertBefore(currentItem, previousItem);
      this.handleItemChange('moved_up', [ currentItem ]);
    }

    this.checkUpDownButtons();
  }

  moveDownItems() {
    var nextItem;

    if (!this.activeDescendant) {
      return;
    }

    currentItem = this.querySelector(`#${this.activeDescendant}`);
    nextItem = currentItem.nextElementSibling;

    if (nextItem) {
      this.insertBefore(nextItem, currentItem);
      this.handleItemChange('moved_down', [ currentItem ]);
    }

    this.checkUpDownButtons();
  }

  moveItems() {
    if (!this.siblingList) {
      return;
    }

    var itemsToMove = this.deleteItems();
    this.siblingList.addItems(itemsToMove);
  }
  
  enableMoveUpDown(upButton, downButton) {
    this.moveUpDownEnabled = true;
    this.upButton = upButton;
    this.downButton = downButton;
    upButton.addEventListener('click', this.moveUpItems.bind(this));
    downButton.addEventListener('click', this.moveDownItems.bind(this));
  }

  setupMove(button, siblingList) {
    this.siblingList = siblingList;
    this.moveButton = button;
    button.addEventListener('click', this.moveItems.bind(this));
  }

  setHandleItemChange(handlerFn) {
    this.handleItemChange = handlerFn;
  }

  setHandleFocusChange(focusChangeHandler) {
    this.handleFocusChange = focusChangeHandler;
  }
}

customElements.define('a11y-select', A11ySelect);