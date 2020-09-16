export const template = document.createElement('template');
template.innerHTML = `
  <style>
    .annotate {
      font-style: italic;
      color: #366ed4;
    }

    .listbox-area {
      padding: 20px;
      background: #eee;
      border: 1px solid #aaa;
      font-size: 0;
    }

    .left-area,
    .right-area {
      box-sizing: border-box;
      display: inline-block;
      font-size: 14px;
      vertical-align: top;
      width: 50%;
    }

    .left-area {
      padding-right: 10px;
    }

    .right-area {
      padding-left: 10px;
    }

    [role="listbox"] {
      min-height: 18em;
      padding: 0;
      background: white;
      border: 1px solid #aaa;
    }

    button {
      font-size: 16px;
    }

    button[aria-disabled="true"] {
      opacity: 0.5;
    }

    .move-right-btn {
      padding-right: 20px;
      position: relative;
    }

    .move-right-btn::after {
      content: ' ';
      height: 10px;
      width: 12px;
      background-image: url('../imgs/Arrows-Right-icon.png');
      background-position: center right;
      position: absolute;
      right: 2px;
      top: 6px;
    }

    .move-left-btn {
      padding-left: 20px;
      position: relative;
    }

    .move-left-btn::after {
      content: ' ';
      height: 10px;
      width: 12px;
      background-image: url('../imgs/Arrows-Left-icon.png');
      background-position: center left;
      position: absolute;
      left: 2px;
      top: 6px;
    }

    #ss_elem_list {
      max-height: 18em;
      overflow-y: auto;
      position: relative;
    }

    #exp_button {
      border-radius: 0;
      font-size: 16px;
      text-align: left;
      padding: 5px 10px;
      width: 150px;
      position: relative;
    }

    #exp_button::after {
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 8px solid #aaa;
      content: " ";
      position: absolute;
      right: 5px;
      top: 10px;
    }

    #exp_button[aria-expanded="true"]::after {
      width: 0;
      height: 0;
      border-left: 8px solid transparent;
      border-right: 8px solid transparent;
      border-top: 0;
      border-bottom: 8px solid #aaa;
      content: " ";
      position: absolute;
      right: 5px;
      top: 10px;
    }

    #exp_elem_list,
    ::slotted(ul) {
      border-top: 0;
      max-height: 10em;
      overflow-y: auto;
      position: absolute;
      margin: 0;
      width: 148px;
    }

    .hidden,
    ::slotted(.hidden) {
      display: none;
    }

    .toolbar {
      font-size: 0;
    }

    .toolbar-item {
      border: 1px solid #aaa;
      background: #ccc;
    }

    .toolbar-item[aria-disabled="false"]:focus {
      background-color: #eee;
    }

    .offscreen {
      clip: rect(1px 1px 1px 1px);
      clip: rect(1px, 1px, 1px, 1px);
      font-size: 14px;
      height: 1px;
      overflow: hidden;
      position: absolute;
      white-space: nowrap;
      width: 1px;
    }
  </style>
  <button aria-haspopup="listbox"
          aria-labelledby="exp_elem exp_button"
          id="exp_button">
    Neptunium
  </button>
  <slot></slot>
`;