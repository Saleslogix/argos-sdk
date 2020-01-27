define('argos/Fields/DecimalField', ['module', 'exports', 'dojo/_base/declare', './TextField', '../FieldManager', '../Utility'], function (module, exports, _declare, _TextField, _FieldManager, _Utility) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _TextField2 = _interopRequireDefault(_TextField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _Utility2 = _interopRequireDefault(_Utility);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/Fields/DecimalField
   * @classdesc The Decimal Field is used for inputting numbers and extends {@link TextField TextField} with:
   *
   * * hides the clear (x) button;
   * * when setting a value, it converts the decimal and thousands group separator to the localized versions; and
   * * when getting a value, it back-converts the localized punctuation into the en-US format and converts the result into a float (Number).
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
   * @module argos/Fields/DecimalField
   */
  var control = (0, _declare2.default)('argos.Fields.DecimalField', [_TextField2.default], /** @lends modules:argos/Fields/DecimalField.prototype */{
    /**
     * @cfg {Number}
     * Defines how many decimal places to format when setting the value.
     */
    precision: 2,
    /**
     * @property {Boolean}
     * Disables the display of the clear (x) button inherited from {@link TextField TextField}.
     */
    enableClearButton: false,
    /**
     * Before calling the {@link TextField#setValue parent implementation} it parses the value
     * via `parseFloat`, trims the decimal place and then applies localization for the decimal
     * and thousands punctuation.
     * @param {Number/String} val Value to be set
     */
    setValue: function setValue(val) {
      var perc = this.getPrecision();
      var newVal = _Utility2.default.roundNumberTo(parseFloat(val), perc);
      newVal = newVal.toFixed(perc);
      if (isNaN(newVal)) {
        if (perc === 0) {
          newVal = '0';
        } else {
          newVal = '0' + (Mobile.CultureInfo.numberFormat.currencyDecimalSeparator || '.') + '00';
        }
      } else {
        if (perc !== 0) {
          newVal = '' + parseInt(newVal, 10) + (Mobile.CultureInfo.numberFormat.currencyDecimalSeparator || '.') + newVal.substr(-perc);
        }
      }
      this.inherited(setValue, arguments, [newVal]);
    },
    /**
     * Retrieves the value from the {@link TextField#getValue parent implementation} but before
     * returning it de-converts the punctuation back to `en-US` format.
     * @return {Number}
     */
    getValue: function getValue() {
      var value = this.inherited(getValue, arguments);
      // SData (and other functions) expect American formatted numbers
      value = value.replace(Mobile.CultureInfo.numberFormat.currencySymbol, '').replace(Mobile.CultureInfo.numberFormat.currencyGroupSeparator, '').replace(Mobile.CultureInfo.numberFormat.numberGroupSeparator, '').replace(Mobile.CultureInfo.numberFormat.currencyDecimalSeparator, '.').replace(Mobile.CultureInfo.numberFormat.numberDecimalSeparator, '.');
      return parseFloat(value);
    },
    /**
     * Retrieves the precision the value will be formated and ronded to.
     * @return {Number}
     */
    getPrecision: function getPrecision() {
      var perc = void 0;
      if (this.precision === 0) {
        perc = this.precision;
      } else {
        perc = this.precision || Mobile.CultureInfo.numberFormat.currencyDecimalDigits;
      }
      return perc;
    }
  });

  exports.default = _FieldManager2.default.register('decimal', control);
  module.exports = exports['default'];
});