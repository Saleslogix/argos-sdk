<<<<<<< HEAD
define('argos/Fields/TextAreaField', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', './TextField', '../FieldManager'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _TextField, _FieldManager) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _TextField2 = _interopRequireDefault(_TextField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  /**
   * @class argos.Fields.TextAreaField
   * The TextAreaField extends the base TextField by changing the input element to
   * an `<textarea>` element with a configurable amount of visible rows.
   *
   * ###Example:
   *     {
   *         name: 'Description',
   *         property: 'Description',
   *         label: this.descriptionText,
   *         type: 'textarea',
   *         rows: 6
   *     }
   *
   * @alternateClassName TextAreaField
   * @extends argos.Fields.TextField
   * @requires argos.FieldManager
   */
  var control = (0, _declare['default'])('argos.Fields.TextAreaField', [_TextField2['default']], {
=======
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


define('argos/Fields/TextAreaField', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    './TextField',
    '../FieldManager'
], function(
    declare,
    lang,
    TextField,
    FieldManager
) {
>>>>>>> develop
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
<<<<<<< HEAD
    widgetTemplate: new Simplate(['<label for="{%= $.name %}">{%: $.label %}</label>', '<textarea data-dojo-attach-point="inputNode" name="{%= $.name %}" rows="{%: $.rows %}" {% if ($.readonly) { %} readonly {% } %}></textarea>']),
    setValue: function setValue(val, initial) {
      if (val === null || typeof val === 'undefined') {
        val = '';
      }

      if (initial) {
        this.originalValue = val;
      }

      this.previousValue = false;

      this.set('inputValue', val);
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Fields.TextAreaField', control);
  module.exports = _FieldManager2['default'].register('textarea', control);
=======
    var control = declare('argos.Fields.TextAreaField', [TextField], {
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
            '<textarea data-dojo-attach-point="inputNode" name="{%= $.name %}" rows="{%: $.rows %}" {% if ($.readonly) { %} readonly {% } %}></textarea>'
        ]),
        setValue: function(val, initial) {
            if (val === null || typeof val === 'undefined') {
                val = '';
            }

            if (initial) {
                this.originalValue = val;
            }

            this.previousValue = false;

            this.set('inputValue', val);
        }
    });

    lang.setObject('Sage.Platform.Mobile.Fields.TextAreaField', control);
    return FieldManager.register('textarea', control);
>>>>>>> develop
});
