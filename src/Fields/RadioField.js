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
 *           checked: true,
 *         }, {
 *         }]
 *     }
 *
 * @extends module:argos/Fields/_Field
 */
const control = declare('argos.Fields.RadioField', [Field], /** @lends module:argos/Fields/RadioField.prototype */{
  options: null,
  mixedOptions: null,
  getOptions: null,

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
   * * `$` => Options object with a generatedId property added
   * * `$$` => Field instance
   *
   */
  radioTemplate: new Simplate([`
    <input type="radio" class="radio" name="{%: $$.name %}" id="{%: $.generatedId %}" data-automation-id="{%: $.generatedId %}" value="{%: $.value %}" {% if ($.checked) { %} checked {% } %}/>
    <label for="{%: $.generatedId %}" class="radio-label">{%: $.label %}</label>
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

    const mixedOptions = options.map((option) => {
      const mixedOption = Object.assign({}, option, {
        generatedId: this.generateOptionId(option),
      });

      return mixedOption;
    });

    this.mixedOptions = mixedOptions;

    const radios = mixedOptions.map((mixedOption) => {
      return this.radioTemplate.apply(mixedOption, this);
    });

    const parent = $(this.domNode);
    parent.append(radios.join(''));
  },

  generateOptionId: function generateOptionId(option) {
    return `${this.name}_${option.id}`;
  },

  /**
   * Returns the current value
   * @return {String}
   */
  getValue: function getValue() {
    return $(':checked', this.domNode)
      .last()
      .val();
  },
  /**
   * Sets the toggled attribute of the field and applies the needed styling.
   *
   * It also directly fires the {@link _Field#onChange onChange} event.
   *
   * @param {String} val Value to set
   * @param {Boolean} initial If true sets the value as the original value and is later used for dirty/modified detection.
   */
  setValue: function setValue(val, initial) {
    if (initial) {
      this.originalValue = val;
    }

    const radioNode = $(`input[value="${val}"]`, this.domNode)
      .get(0);

    // We were passed a value that matched one of our radios,
    // so we will set that to checked.
    if (radioNode) {
      radioNode.checked = true;
    } else if (val === '' && !initial) {
      $('input', this.domNode).each((_, elem) => {
        elem.checked = false;
      });
    }

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
