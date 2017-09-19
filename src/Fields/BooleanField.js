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
import Field from './_Field';
import FieldManager from '../FieldManager';

/**
 * @class argos.Fields.BooleanField
 * @classdesc The Boolean Field is used for true/false values and is visualized as a toggle or light switch.
 *
 * @example
 *     {
 *         name: 'IsLead',
 *         property: 'IsLead',
 *         label: this.isLeadText,
 *         type: 'boolean'
 *     }
 *
 * @extends argos.Fields._Field
 * @requires argos.FieldManager
 */
const control = declare('argos.Fields.BooleanField', [Field], /** @lends argos.Fields.BooleanField# */{
  /**
   * @property {Simplate}
   * Simplate that defines the fields HTML Markup
   *
   * * `$` => Field instance
   * * `$$` => Owner View instance
   *
   */
  widgetTemplate: new Simplate([`
      <div class="switch">
        <input
          data-dojo-attach-point="toggleNode"
          type="checkbox" {% if($.checked) { %}checked{% } %}
          id="{%= $.id %}_{%= $.name %}"
          name="{%= $.name %}" class="switch" />
        <label for="{%= $.id %}_{%= $.name %}">{%: $.label %}</label>
      </div>
    `,
  ]),
  /**
   * @property {HTMLElement}
   * The div node that holds the toggled attribute
   */
  toggleNode: null,

  /**
   * @property {Boolean}
   * When clearing the boolean field it sets the fields value to `this.checked`
   */
  checked: false,

  /**
   * Value used during dirty/modified comparison
   */
  originalValue: null,

  initSoho: function initSoho() {
    $(this.toggleNode).on('click', this._onClick.bind(this));
  },
  /**
   * Fires with the toggle switch is pressed and sets the value to
   * the opposite of the current value
   * @param {Event} evt The click/tap event
   */
  _onClick: function _onClick(/* evt*/) {
    if (this.isDisabled()) {
      return;
    }

    const toggledValue = this.getValue();
    this.setValue(toggledValue);
  },
  /**
   * Returns the current toggled state
   * @return {Boolean}
   */
  getValue: function getValue() {
    return this.toggleNode.checked;
  },
  /**
   * Sets the toggled attribute of the field and applies the needed styling.
   *
   * It also directly fires the {@link _Field#onChange onChange} event.
   *
   * @param {Boolean/String/Number} val If string is passed it will use `'true'` or `'t'` for true. If number then 0 for true.
   * @param {Boolean} initial If true sets the value as the original value and is later used for dirty/modified detection.
   */
  setValue: function setValue(val, initial) {
    const newVal = typeof val === 'string' ? /^(true|t|0)$/i.test(val) : !!val;

    if (initial) {
      this.originalValue = newVal;
    }

    this.toggleNode.checked = newVal;
    this.onChange(newVal, this);
  },
  /**
   * Sets the value back to `this.checked` as the initial value. If true is passed it sets
   * `this.checked` as a dirty/modified value.
   * @param {Boolean} flag Signifies if the cleared value should be set as modified (true) or initial (false/undefined)
   */
  clearValue: function clearValue(flag) {
    const initial = flag !== true;
    this.setValue(this.checked, initial);
  },
  /**
   * Determines if the field has been modified from it's original value
   * @return {Boolean}
   */
  isDirty: function isDirty() {
    return (this.originalValue !== this.getValue());
  },
});

export default FieldManager.register('boolean', control);
