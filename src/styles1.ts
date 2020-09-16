import { css } from 'lit-element';

export default css`
:host {
    box-sizing: border-box;
    display: inline-block;
    font-size: 14px;
    vertical-align: top;
    padding-right: 10px;
}

[role="listbox"] {
    min-height: 18em;
    padding: 0;
    background: white;
    border: 1px solid #aaa;
}

[role="option"] {
    display: block;
    padding: 0 1em 0 1.5em;
    position: relative;
    line-height: 1.8em;
}

[role="option"].focused {
    background: #bde4ff;
}

[role="option"][aria-selected="true"]::before {
    content: '\\2713';
    position: absolute;
    left: 0.5em;
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

#exp_elem {
    display: block;
}

#exp_elem_list {
    border-top: 0;
    max-height: 10em;
    overflow-y: auto;
    position: absolute;
    margin: 0;
    width: 148px;
}

.hidden {
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
.scroll {
    height: 75px;
    overflow: auto;
    position: relative;
}
.options {
    display: flex;
    justify-content: space-between;
}
`;