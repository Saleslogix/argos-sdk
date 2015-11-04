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
import Dropdown from 'argos/Dropdown';
import FieldManager from 'argos/FieldManager';
import _Field from 'argos/Fields/_Field';

const __class = declare('argos.DropdownField', [_Field, Dropdown], {
  widgetTemplate: new Simplate([
    '<div data-dojo-attach-point="dropdownNode">',
      '<label>{%: $.label %}</label>',
      '<input readOnly data-dojo-attach-point="dropdownInput"></input>',
      '<span class="{%: $.icon %}" style="position: absolute;color: #383838;font-size: 14px;height: 14px;width: 14px;margin-top: 15px;margin-left: -15px;tex-align: center;"></span>',
      '<select class="dropdown__select--hidden" data-dojo-attach-point="dropdownSelect"></select>',
      '</div>',
    '</div>',
  ]), // TODO: Remove the inline styling applied here... only organized way to override the nested styling occurring.
  onClick: function onClick(evt) {
    this.scrollToDropdown();
    this.show();
    evt.preventDefault();
    evt.stopPropagation();
  },
  renderTo: function renderTo() {
    this.createList({items: this.items, defaultValue: this.defaultValue});
    this.inherited(arguments);
    // TODO: Place in the getData function call and createList call here so the dropdown will be created with the relevant data
  },
  /**
   * Extends the parent implementation to connect the `onclick` event of the fields container
   * to {@link #_onClick _onClick}.
   */
  init: function init() {
    this.inherited(arguments);

    this.connect(this.containerNode, 'onclick', this.onClick);
  },
});

export default FieldManager.register('dropdown', __class);
