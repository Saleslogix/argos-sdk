define('argos/Fields/RadioField', ['module', 'exports', 'dojo/_base/declare', './_Field', '../FieldManager'], function (module, exports, _declare, _Field, _FieldManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Field2 = _interopRequireDefault(_Field);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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
  var control = (0, _declare2.default)('argos.Fields.RadioField', [_Field2.default], /** @lends module:argos/Fields/RadioField.prototype */{
    /**
     * @property {Simplate}
     * Simplate that defines the fields HTML Markup
     *
     * * `$` => Field instance
     * * `$$` => Owner View instance
     *
     */
    widgetTemplate: new Simplate(['\n      <fieldset class="radio-group">\n        <legend>{%: $.label %}</legend>\n      </div>\n    ']),
    /**
     * @property {Simplate}
     * Simplate that defines the radio HTML Markup
     *
     * * `$` => Options object
     * * `$$` => Field instance
     *
     */
    radioTemplate: new Simplate(['\n    <input type="radio" class="radio" name="options" id="{%: $.id %}" data-automation-id="{%: $.id %}" value="{%: $.value %}" />\n    <label for="{%: $.id %}" class="radio-label">{%: $.label %}</label>\n    <br />\n  ']),

    /**
     * Value used during dirty/modified comparison
     */
    originalValue: null,

    initSoho: function initSoho() {},

    postCreate: function postCreate() {
      var _this = this;

      this.inherited(postCreate, arguments);
      var options = this.options || [];
      var radios = options.map(function (option) {
        return _this.radioTemplate.apply(option, _this);
      });

      $('.radio-group', this.domNode).append(radios.join());
    },

    /**
     * Returns the current toggled state
     * @return {Boolean}
     */
    getValue: function getValue() {
      return ''; // TODO
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
      var initial = flag !== true;
      this.setValue('', initial);
    },
    /**
     * Determines if the field has been modified from it's original value
     * @return {Boolean}
     */
    isDirty: function isDirty() {
      return this.originalValue !== this.getValue();
    }
  }); /* Copyright 2020 Infor
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
  exports.default = _FieldManager2.default.register('radio', control);
  module.exports = exports['default'];
});