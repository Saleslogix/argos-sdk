/* Copyright 2020 Infor
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
 * @module argos/Fields/RadioField
 */
import declare from 'dojo/_base/declare';
import Field from './_Field';
import FieldManager from '../FieldManager';

/**
 * @class
 * @alias module:argos/Fields/RadioField
 *
 * @example
 *     {
 *         name: 'ColorPref',
 *         property: 'ColorPref',
 *         label: this.colorPrefText,
 *         type: 'radio',
 *         options: [{
 *           id: 'red',
 *           label: 'Cherry Red',
 *           value: 'E12E00',
 *         }, {
 *         }]
 *     }
 *
 * @extends module:argos/Fields/_Field
 */
const control = declare('argos.Fields.RadioField', [Field], /** @lends module:argos/Fields/RadioField.prototype */{
  /**
   * @property {Simplate}
   * Simplate that defines the fields HTML Markup
   *
   * * `$` => Field instance
   * * `$$` => Owner View instance
   *
   */
  widgetTemplate: new Simplate([`
      <fieldset class="radio-group">
        <legend>{%: $.label %}</legend>
      </div>
    `,
  ]),
  /**
   * @property {Simplate}
   * Simplate that defines the radio HTML Markup
   *
   * * `$` => Options object
   * * `$$` => Field instance
   *
   */
  radioTemplate: new Simplate([`
    <input type="radio" class="radio" name="options" id="{%: $.id %}" data-automation-id="{%: $.id %}" value="{%: $.value %}" />
    <label for="{%: $.id %}" class="radio-label">{%: $.label %}</label>
    <br />
  `]),

  /**
   * Value used during dirty/modified comparison
   */
  originalValue: null,

  initSoho: function initSoho() {
  },

  postCreate: function postCreate() {
    this.inherited(postCreate, arguments);
    const options = this.options || [];
    const radios = options.map((option) => {
      return this.radioTemplate.apply(option, this);
    });

    $('.radio-group', this.domNode).append(radios.join());
  },

  /**
   * Returns the current toggled state
   * @return {Boolean}
   */
  getValue: function getValue() {
    return '';// TODO
  },
  /**
   * Sets the toggled attribute of the field and applies the needed styling.
   *
   * It also directly fires the {@link _Field#onChange onChange} event.
   *
   * @param {Boolean/String/Number} val Value to set
   * @param {Boolean} initial If true sets the value as the original value and is later used for dirty/modified detection.
   */
  setValue: function setValue(val, initial) {
    if (initial) {
      this.originalValue = val;
    }

    // TODO: Update DOM state here

    // Fire onChange with new value
    this.onChange(val, this);
  },
  /**
   * Reset back to a default value
   * @param {Boolean} flag Signifies if the cleared value should be set as modified (true) or initial (false/undefined)
   */
  clearValue: function clearValue(flag) {
    const initial = flag !== true;
    this.setValue('', initial);
  },
  /**
   * Determines if the field has been modified from it's original value
   * @return {Boolean}
   */
  isDirty: function isDirty() {
    return (this.originalValue !== this.getValue());
  },
});

export default FieldManager.register('radio', control);
