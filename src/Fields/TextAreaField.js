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
 * @module argos/Fields/TextAreaField
 */
import declare from 'dojo/_base/declare';
import TextField from './TextField';
import FieldManager from '../FieldManager';

/**
 * @class
 * @alias module:argos/Fields/TextAreaField
 * @classdesc The TextAreaField extends the base TextField by changing the input element to
 * an `<textarea>` element with a configurable amount of visible rows.
 *
 * @example
 * {
 *   name: 'Description',
 *   property: 'Description',
 *   label: this.descriptionText,
 *   type: 'textarea',
 *   rows: 6
 * }
 * @extends module:argos/Fields/TextField
 */
const control = declare('argos.Fields.TextAreaField', [TextField], /** @lends module:argos/Fields/TextAreaField.prototype */{
  /**
   * @cfg {Number}
   * Number of rows to show visually, does not constrain input.
   */
  rows: 4,
  /**
   * @property {Boolean}
   * Overrides default to hide the clear button.
   */
  enableClearButton: false,
  /**
   * @property {Simplate}
   * Simplate that defines the fields HTML Markup
   *
   * * `$` => Field instance
   * * `$$` => Owner View instance
   *
   */
  widgetTemplate: new Simplate([
    '<label for="{%= $.name %}">{%: $.label %}</label>',
    '<textarea data-dojo-attach-point="inputNode" name="{%= $.name %}" rows="{%: $.rows %}" {% if ($.readonly) { %} readonly {% } %}></textarea>',
  ]),
  setValue: function setValue(val = '', initial) {
    if (initial) {
      this.originalValue = val;
    }

    this.previousValue = false;
    // IE/Edge shows null values in Text Area Fields, check that we're not setting displayed value as null
    this.set('inputValue', val === null ? '' : val);
  },
});

export default FieldManager.register('textarea', control);
