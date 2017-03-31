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
import _WidgetBase from 'dijit/_WidgetBase';
import _Templated from './_Templated';

import $ from 'jquery';

/**
 * @class argos.Dropdown
 */
const __class = declare('argos.Dropdown', [_WidgetBase, _Templated], {
  widgetTemplate: new Simplate([
    `<label>{%: $.label %}</label>
      <select id="{%= $.id %}_dropdownNode" class="dropdown {%: $.dropdownClass %}" data-dojo-attach-point="dropdownSelect"></select>`,
  ]),
  selectItemTemplate: new Simplate([
    '<option value="{%= $.value %}">',
    '{% if ($.text) { %}',
    '{%= $.text %}',
    '{% } else { %}',
    '{%= $.value %}',
    '{% } %}',
    '</option>',
  ]),

  dropdownClass: '',
  id: 'dropdown-template',
  multiSelect: false,
  onSelect: null,
  onSelectScope: null,
  _eventConnections: null,
  _list: null,
  _orientation: null,
  _selected: null,
  items: null,
  itemMustExist: true,
  selectedItem: null,
  constructor: function constructor() {
    this._eventConnections = [];
    this.items = [];
  },
  createList: function createList({ items, defaultValue }) {
    let itemFound = null;
    this.items = (items) ? items : [];
    this._defaultValue = defaultValue;

    items.forEach((item) => {
      if (item.value === defaultValue) {
        itemFound = item;
      }
    }, this);
    if (this.itemMustExist && !itemFound) {
      itemFound = { key: -1, value: defaultValue, text: defaultValue };
      this.items.splice(0, 0, itemFound);
    }

    items.forEach((item) => {
      const option = $(this.selectItemTemplate.apply({
        key: item.key,
        value: item.value,
        text: item.text,
      }, this));
      $(this.dropdownSelect).append(option);
    });

    $(this.dropdownSelect).dropdown({
      noSearch: true,
    });
    if (itemFound) {
      this.setValue(itemFound.value);
    }
    if (this.onSelect) {
      $(this.dropdownSelect).on('change', this.onSelect.bind(this.onSelectScope || this));
    }
    return this;
  },
  destroy: function destroy() {
    this._eventConnections.forEach((evt) => {
      evt.remove();
    });
    this._eventConnections = [];
    this.inherited(arguments);
  },
  findValue: function findValue(text) {
    const value = this._list.children.filter((element) => {
      return element.innerText === text;
    });
    return value[0];
  },
  getSelected: function getSelected() {
    return this._selected;
  },
  getText: function getText() {
    const text = (this.dropdownSelect.options[this.dropdownSelect.selectedIndex]) ? this.dropdownSelect.options[this.dropdownSelect.selectedIndex].text : '';
    return text;
  },
  getValue: function getValue() {
    const value = this.dropdownSelect.options[this.dropdownSelect.selectedIndex].value;
    return value;
  },
  postCreate: function postCreate() {
    this.inherited(arguments);
  },
  setValue: function setValue(value) {
    if (value === 0 || value) {
      this.dropdownSelect.value = value;
      $(this.dropdownSelect).data('dropdown').updated();
    }
  },
});

export default __class;
