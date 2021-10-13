define('argos/Fields/PhoneField', ['module', 'exports', 'dojo/_base/declare', 'dojo/has', '../FieldManager', './TextField', '../Format', 'dojo/_base/sniff'], function (module, exports, _declare, _has, _FieldManager, _TextField, _Format) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _has2 = _interopRequireDefault(_has);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _TextField2 = _interopRequireDefault(_TextField);

  var _Format2 = _interopRequireDefault(_Format);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/Fields/PhoneField
   * @classdesc The Phone field is a specialized {@link module:argos/Fields/TextField TextField} that takes a string of numbers
   * and groups them into a phone number on blur or when setting a value directly the value
   * shown to the user gets passed through the
   * {@link #formatNumberForDisplay formatNumberForDisplay} function, while
   * {@link #getValue getValue} will still return an unformatted version.
   *
   * @example
   * {
   *   name: 'SalesPotential',
   *   property: 'SalesPotential',
   *   label: this.salesPotentialText,
   *   type: 'decimal'
   * }
   * @extends module:argos/Fields/TextField
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
   * @module argos/Fields/PhoneField
   */
  var control = (0, _declare2.default)('argos.Fields.PhoneField', [_TextField2.default], /** @lends module:argos/Fields/PhoneField.prototype */{
    /**
     * @property {String}
     * Sets the `<input type=` of the field.
     *
     * Currently only iOS supports non-numbers when a tel field has a default value: [Bug Report](http://code.google.com/p/android/issues/detail?id=19724).
     */
    inputType: (0, _has2.default)('safari') ? 'tel' : 'text',

    /**
     * Formats the displayed value (inputNode value) using {@link format.phone format.phone}.
     */
    _onBlur: function _onBlur() {
      this.inherited(_onBlur, arguments);

      // temporarily added: http://code.google.com/p/android/issues/detail?id=14519
      this.set('inputValue', _Format2.default.phone(this.inputNode.value));
    },
    /**
     * Gets the value and strips out non-numbers and non-letter `x` before returning unless
     * the value starts with `+` in which it is returned unmodified.
     * @return {String}
     */
    getValue: function getValue() {
      var value = this.inherited(getValue, arguments);

      if (/^\+/.test(value)) {
        return value;
      }

      value = _Format2.default.alphaToPhoneNumeric(value);

      return value.replace(/[^0-9x]/ig, '');
    },
    /**
     * Sets the original value if initial is true and sets the input value to the formatted
     * value using {@link format.phone format.phone}.
     * @param {String/Number} val String to set
     * @param {Boolean} initial True if the value is the original/clean value.
     */
    setValue: function setValue(val, initial) {
      if (initial) {
        this.originalValue = val;
      }

      this.previousValue = false;
      this.set('inputValue', _Format2.default.phone(val) || '');
    },
    /**
     * Currently only calls parent implementation due to an [Android Bug](http://code.google.com/p/android/issues/detail?id=14519).
     * @param {Event} evt Keyup event
     */
    _onKeyUp: function _onKeyUp() /* evt*/{
      /*
      // temporarily removed: http://code.google.com/p/android/issues/detail?id=14519
      this.set('inputValue', format.phone(this.inputNode.value, this.getValue()));
      */
      this.inherited(_onKeyUp, arguments);
    }
  });

  exports.default = _FieldManager2.default.register('phone', control);
  module.exports = exports['default'];
});