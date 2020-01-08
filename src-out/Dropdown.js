define('argos/Dropdown', ['module', 'exports', 'dojo/_base/declare', 'dijit/_WidgetBase', './_Templated'], function (module, exports, _declare, _WidgetBase2, _Templated2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/Dropdown
   * @extends module:argos/_Templated
   */
  var __class = (0, _declare2.default)('argos.Dropdown', [_WidgetBase3.default, _Templated3.default], /** @lends module:argos/Dropdown.prototype */{
    widgetTemplate: new Simplate(['<div class="field">', '<label for="{%= $.id %}_dropdownNode" class="label">{%: $.label %}</label>', '<select id="{%= $.id %}_dropdownNode" class="dropdown {%: $.dropdownClass %}" data-dojo-attach-point="dropdownSelect"></select>', '</div>']),
    selectItemTemplate: new Simplate(['<option value="{%= $.value %}">', '{% if ($.text) { %}', '{%= $.text %}', '{% } else { %}', '{%= $.value %}', '{% } %}', '</option>']),

    dropdownClass: '',
    id: 'dropdown-template',
    multiSelect: false,
    onSelect: null,
    onSelectScope: null,
    _eventConnections: null,
    _list: null,
    _selected: null,
    items: null,
    itemMustExist: true,
    selectedItem: null,
    constructor: function constructor() {
      this._eventConnections = [];
      this.items = [];
    },
    createList: function createList(_ref) {
      var _this = this;

      var items = _ref.items,
          defaultValue = _ref.defaultValue;

      var itemFound = null;
      this.items = items ? items : [];
      this._defaultValue = defaultValue;

      items.forEach(function (item) {
        if (item.value === defaultValue) {
          itemFound = item;
        }
      }, this);
      if (this.itemMustExist && !itemFound) {
        itemFound = { key: -1, value: defaultValue, text: defaultValue };
        this.items.splice(0, 0, itemFound);
      }

      items.forEach(function (item) {
        var option = $(_this.selectItemTemplate.apply({
          key: item.key,
          value: item.value,
          text: item.text
        }, _this));
        $(_this.dropdownSelect).append(option);
      });

      $(this.dropdownSelect).dropdown({
        noSearch: true
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
      this._eventConnections.forEach(function (evt) {
        evt.remove();
      });
      this._eventConnections = [];
      this.inherited(destroy, arguments);
    },
    findValue: function findValue(text) {
      var value = this._list.children.filter(function (element) {
        return element.innerText === text;
      });
      return value[0];
    },
    getSelected: function getSelected() {
      return this._selected;
    },
    getText: function getText() {
      var text = this.dropdownSelect.options[this.dropdownSelect.selectedIndex] ? this.dropdownSelect.options[this.dropdownSelect.selectedIndex].text : '';
      return text;
    },
    getValue: function getValue() {
      var value = this.dropdownSelect.options[this.dropdownSelect.selectedIndex].value;
      return value;
    },
    postCreate: function postCreate() {
      this.inherited(postCreate, arguments);
    },
    setValue: function setValue(value) {
      if (value === 0 || value) {
        this.dropdownSelect.value = value;
        $(this.dropdownSelect).data('dropdown').updated();
      }
    }
  }); /* Copyright 2017 Infor
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *    http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */

  /**
   * @module argos/Dropdown
   */
  exports.default = __class;
  module.exports = exports['default'];
});