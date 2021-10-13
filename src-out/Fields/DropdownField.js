define('argos/Fields/DropdownField', ['module', 'exports', 'dojo/_base/declare', '../Dropdown', '../FieldManager', './_Field'], function (module, exports, _declare, _Dropdown, _FieldManager, _Field2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Dropdown2 = _interopRequireDefault(_Dropdown);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _Field3 = _interopRequireDefault(_Field2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/Fields/DropdownField
   */
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

  /**
   * @module argos/Fields/DropdownField
   */
  var __class = (0, _declare2.default)('argos.DropdownField', [_Field3.default, _Dropdown2.default], /** @lends module:argos/Fields/DropdownField.prototype */{
    widgetTemplate: new Simplate(['<div data-dojo-attach-point="dropdownNode">', '<label>{%: $.label %}</label>', '<input readOnly data-dojo-attach-point="dropdownInput"></input>', '<span class="{%: $.icon %}" style="position: absolute;color: #383838;font-size: 14px;height: 14px;width: 14px;margin-top: 15px;margin-left: -15px;tex-align: center;"></span>', '<select class="dropdown__select--hidden" data-dojo-attach-point="dropdownSelect"></select>', '</div>', '</div>']), // TODO: Remove the inline styling applied here... only organized way to override the nested styling occurring.
    onClick: function onClick(evt) {
      this.scrollToDropdown();
      this.show();
      evt.preventDefault();
      evt.stopPropagation();
    },
    renderTo: function renderTo() {
      this.createList({ items: this.items, defaultValue: this.defaultValue });
      this.inherited(renderTo, arguments);
      // TODO: Place in the getData function call and createList call here so the dropdown will be created with the relevant data
    },
    /**
     * Extends the parent implementation to connect the `onclick` event of the fields container
     * to {@link #_onClick _onClick}.
     */
    init: function init() {
      this.inherited(init, arguments);

      this.connect(this.containerNode, 'onclick', this.onClick);
    }
  });

  exports.default = _FieldManager2.default.register('dropdown', __class);
  module.exports = exports['default'];
});