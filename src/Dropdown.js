/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import declare from 'dojo/_base/declare';
import array from 'dojo/_base/array';
import connect from 'dojo/_base/connect';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import domGeom from 'dojo/dom-geometry';
import domStyle from 'dojo/dom-style';
import keys from 'dojo/keys';
import on from 'dojo/on';
import query from 'dojo/query';
import _Widget from 'dijit/_Widget';
import _Templated from './_Templated';

const __class = declare('argos.Dropdown', [_Widget, _Templated], {
  widgetTemplate: new Simplate([
    '<div class="dropdown {%: $.dropdownClass %}" data-dojo-attach-point="dropdownNode">',
      '<label class="dropdown__label">{%: $.label %}</label>',
      '<input readOnly class="dropdown__input" data-dojo-attach-point="dropdownInput"></input>',
      '<span class="dropdown__icon {%: $.icon %}"></span>',
      '<select class="dropdown__select dropdown__select--hidden" data-dojo-attach-point="dropdownSelect"></select>',
      '</div>',
    '</div>',
  ]),
  listTemplate: new Simplate([
    '<div class="dropdown {%: $.dropdownClass %} dropdown--absolute dropdown--hidden">',
      '<label class="dropdown__label">{%: $.label %}</label>',
      '<input readOnly class="dropdown__input dropdown__input--absolute" value="{%: $.value %}"></input>',
      '<span class="dropdown__icon {%: $.icon %}"></span>',
    '</div>',
  ]),
  listStartTemplate: new Simplate([
    '<ul class="dropdown__list">',
  ]),
  listEndTemplate: new Simplate([
    '</ul>',
  ]),
  listItemTemplate: new Simplate([
    '<li class="dropdown__list__item" data-value="{%= $.item %}">',
      '{%= $.item %}',
    '</li>',
  ]),
  overlayTemplate: new Simplate([
    '<div class="dropdown__overlay"></div>',
  ]),
  selectItemTemplate: new Simplate([
    '<option value="{%: $.item %}">{%: $.item %}</option>',
  ]),

  dropdownClass: '',
  icon: 'fa fa-caret-down',
  id: 'dropdown-template',
  multiSelect: false,
  openIcon: 'fa fa-caret-up',
  _action: null,
  _actionScope: null,
  _eventConnections: [],
  _ghost: null,
  _list: null,
  _orientation: null,
  _overlay: null,
  _overlayEvent: null,
  _selected: null,

  createGhost: function createGhost(top = false) {
    const listStart = domConstruct.toDom(this.listStartTemplate.apply(this));
    const listEnd = domConstruct.toDom(this.listEndTemplate.apply(this));
    array.forEach(this.dropdownSelect.options, (item) => {
      const dom = domConstruct.toDom(this.listItemTemplate.apply({item: item.text}, this));
      domConstruct.place(dom, listStart);
      if (item.value === this.dropdownSelect.value) {
        this._selected = dom;
        domClass.add(dom, 'dropdown__list__item--selected');
      }
    });
    this._eventConnections.push(on(listStart, 'click', this.onListClick.bind(this)));
    domConstruct.place(listEnd, listStart);
    if (this._ghost) {
      domConstruct.destroy(this._ghost);
    }
    this._ghost = domConstruct.toDom(this.listTemplate.apply({ value: this._selected.innerHTML, icon: this.openIcon, label: this.label, dropdownClass: this.dropdownClass }, this));

    const dropdownInput = query('.dropdown__input', this._ghost)[0];
    if (dropdownInput) {
      this._eventConnections.push(on(dropdownInput, 'keydown', this.onKeyPress.bind(this)));
    }
    const dropdownIcon = query('.dropdown__icon', this._ghost)[0];
    if (dropdownIcon) {
      this._eventConnections.push(on(dropdownIcon, 'click', this.hide.bind(this)));
    }
    let position = 'last';
    if (top) {
      position = 'first';
    }
    domConstruct.place(listStart, this._ghost, position);
    this._list = listStart;
    domConstruct.place(this._ghost, document.body);
  },
  createList: function createList({items, defaultValue, action = null, actionScope = null}) {
    this._action = action;
    this._actionScope = actionScope;
    this._defaultValue = defaultValue;
    array.forEach(items, function addToModalList(item) {
      const option = domConstruct.toDom(this.selectItemTemplate.apply({item: item}, this));
      domConstruct.place(option, this.dropdownSelect);
    }, this);
    this.dropdownSelect.value = this.dropdownInput.value = defaultValue;
    this._eventConnections.push(on(this.dropdownNode, 'click', this.onClick.bind(this)));
    this.createGhost();

    return this;
  },
  createOverlay: function createOverlay() {
    this.destroyOverlay();
    this._overlay = domConstruct.toDom(this.overlayTemplate.apply(this));
    domConstruct.place(this._overlay, document.body);
    this._overlayEvent = on(this._overlay, 'click', this.onOverlayClick.bind(this));
  },
  destroy: function destroy() {
    this._eventConnections.forEach( (evt) => {
      evt.remove();
    });
    this._eventConnections = [];
    domConstruct.destroy(this._ghost);
    this.destroyOverlay();
    this.inherited(arguments);
  },
  destroyOverlay: function destroyOverlay() {
    if (this._overlay) {
      domConstruct.destroy(this._overlay);
      this._overlayEvent.remove();
    }
  },
  getSelected: function getSelected() {
    return this._selected;
  },
  getValue: function getValue() {
    return this.dropdownSelect.value;
  },
  hide: function hide() {
    this.destroyOverlay();
    domClass.add(this._ghost, 'dropdown--hidden');
    return this;
  },
  onClick: function onClick(evt) {
    if (evt.currentTarget === this.dropdownNode) {
      this.scrollToDropdown();
      this.show();
      evt.preventDefault();
      evt.stopPropagation();
    }
  },
  onKeyPress: function onKeyPress(evt) {
    let prevent = true;
    switch (evt.keyCode) {
      case keys.UP_ARROW:
        if (!domClass.contains(this._ghost, 'dropdown--hidden')) {
          if (this._selected.previousSibling) {
            this.updateSelected(this._selected.previousSibling);
            this.updateGhost(this._selected.innerHTML);
            this.scrollListTo(this._selected);
          }
        } else {
          this.show();
        }
        break;
      case keys.DOWN_ARROW:
        if (!domClass.contains(this._ghost, 'dropdown--hidden')) {
          if (this._selected.nextSibling) {
            this.updateSelected(this._selected.nextSibling);
            this.updateGhost(this._selected.innerHTML);
            this.scrollListTo(this._selected);
          }
        } else {
          this.show();
        }
        break;
      case keys.TAB:
        prevent = false;
        this.hide();
        break;
      case keys.ESCAPE:
      case keys.CLEAR:
        this.hide();
        break;
      case keys.ENTER:
      case keys.SPACE:
        this.onListClick({ target: this._selected });
        break;
      case keys.HOME:
        this.updateSelected(this._list.children[0]);
        this.scrollListTo(this._selected);
        break;
      case keys.END:
        this.updateSelected(this._list.children[this._list.children.length - 1]);
        this.scrollListTo(this._selected);
        break;
      default:
    }
    if (prevent) {
      evt.preventDefault();
      evt.stopPropagation();
    }
  },
  onListClick: function onListClick({ target }) {
    this.updateSelected(target);
    if (!this.multiSelect) {
      this.hide();
      this.setValue(target.innerHTML);
    } // TODO: Add in what will happen for a multiSelect dropdown
    if (this._action && this._actionScope) {
      this._actionScope[this._action]();
    }
  },
  onOverlayClick: function onOverlayClick(evt) {
    if (!domClass.contains(this._ghost, 'dropdown--hidden')) {
      evt.preventDefault();
      evt.stopPropagation();
      this.hide();
      domConstruct.destroy(this._overlay);
    }
  },
  postCreate: function postCreate() {
    this.inherited(arguments);
    this._orientation = connect.subscribe('/app/setOrientation', this, this.hide);
    this._eventConnections.push(on(this.dropdownInput, 'keydown', this.onKeyPress.bind(this)));
  },
  scrollToDropdown: function scrollToDropdown() {
    const scrollParent = this.dropdownNode.offsetParent;
    if (scrollParent) {
      if (scrollParent.scrollTop > this.dropdownNode.offsetTop) {
        scrollParent.scrollTop = this.dropdownNode.offsetTop;
      } else if (this.dropdownNode.offsetTop > scrollParent.scrollTop && this.dropdownNode.offsetTop + this.dropdownNode.offsetHeight > scrollParent.scrollTop + scrollParent.offsetHeight) {
        scrollParent.scrollTop = this.dropdownNode.offsetTop + this.dropdownNode.offsetHeight - scrollParent.offsetHeight; // scrollParent.scrollTop + this.dropdownNode.offsetHeight - (scrollParent.scrollTop + scrollParent.offsetHeight - this.dropdownNode.offsetTop);
      }
    }
  },
  scrollListTo: function scrollListTo(target) {
    if (target) {
      this._list.scrollTop = target.offsetTop - target.offsetHeight;
    }
  },
  setSelected: function setSelected(value = {}) {
    if (value !== this._selected) {
      this._selected = value;
      this.setValue(value.innerHTML);
    }
  },
  setValue: function setValue(value) {
    if (value === 0 || value) {
      this.dropdownSelect.value = this.dropdownInput.value = value;
    }
  },
  show: function show() {
    const pos = domGeom.position(this.dropdownNode, true);
    const ghostHeight = domStyle.get(this._ghost, 'height');
    if (pos.y <= App._rootDomNode.offsetHeight / 2) {
      if (domClass.contains(this._ghost, 'dropdown--onTop')) {
        this.createGhost(false);
        domClass.remove(this._ghost, 'dropdown--onTop');
      }
      domStyle.set(this._ghost, {
        top: `${pos.y}px`,
        left: `${pos.x}px`,
      });
      this.trimHeight(false);
    } else {
      if (!domClass.contains(this._ghost, 'dropdown--onTop')) {
        this.createGhost(true);
        domClass.add(this._ghost, 'dropdown--onTop');
      }
      domStyle.set(this._ghost, {
        top: `${pos.y - ghostHeight + pos.h}px`,
        left: `${pos.x}px`,
      });
      this.trimHeight(true);
    }
    this.updateGhost(this.dropdownSelect.value);
    this.createOverlay();
    this.toggle();
    this.scrollListTo(this._selected);
  },
  toggle: function toggle() {
    domClass.toggle(this._ghost, 'dropdown--hidden');
    if (domClass.contains(this._ghost, 'dropdown--hidden')) {
      this.destroyOverlay();
    }
  },
  trimHeight: function trimHeight(top = false) {
    const ghostList = query('.dropdown__list', this._ghost)[0];
    if (ghostList) {
      const dropdownHeight = domStyle.get(this.dropdownNode, 'height');
      const ghostHeight = domStyle.get(this._ghost, 'height');
      const ghostTop = domStyle.get(this._ghost, 'top');
      const borderTop = domStyle.get(this._ghost, 'borderTopWidth');
      const borderBottom = domStyle.get(this._ghost, 'borderBottomWidth');
      if (!top && ghostTop + ghostHeight > App._rootDomNode.offsetHeight) {
        domStyle.set(this._ghost, {
          height: '',
        });
        domStyle.set(ghostList, {
          height: `${App._rootDomNode.offsetHeight - dropdownHeight - ghostTop}px`,
        });
      } else if (top && ghostTop < 0) {
        domStyle.set(this._ghost, {
          top: `0px`,
          height: `${ghostHeight + ghostTop}px`,
        });
        domStyle.set(ghostList, {
          height: `${ghostHeight + ghostTop - dropdownHeight - borderTop - borderBottom}px`,
        });
      }
    }
  },
  updateGhost: function updateGhost(value) {
    const current = query(`[data-value=${value}]`, this._list)[0];
    const input = query('.dropdown__input', this._ghost)[0];
    if (current) {
      this.updateSelected(current);
    }
    if (input) {
      input.value = this.dropdownSelect.value;
    }
    return this;
  },
  updateSelected: function updateSelected(target) {
    domClass.add(target, 'dropdown__list__item--selected');
    if (this._selected && this._selected !== target) {
      domClass.remove(this._selected, 'dropdown__list__item--selected');
    }
    this._selected = target;
  },
});

export default __class;
