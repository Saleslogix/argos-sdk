define('argos/Fields/DecimalField', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', './TextField', '../FieldManager', '../Utility'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoString, _TextField, _FieldManager, _Utility) {
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

  var _string = _interopRequireDefault(_dojoString);

  var _TextField2 = _interopRequireDefault(_TextField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _Utility2 = _interopRequireDefault(_Utility);

  /**
   * @class argos.Fields.DecimalField
   * The Decimal Field is used for inputting numbers and extends {@link TextField TextField} with:
   *
   * * hides the clear (x) button;
   * * when setting a value, it converts the decimal and thousands group separator to the localized versions; and
   * * when getting a value, it back-converts the localized punctuation into the en-US format and converts the result into a float (Number).
   *
   * ###Example:
   *     {
   *         name: 'SalesPotential',
   *         property: 'SalesPotential',
   *         label: this.salesPotentialText,
   *         type: 'decimal'
   *     }
   *
   * @alternateClassName DecimalField
   * @extends argos.Fields.TextField
   * @requires argos.FieldManager
   */
  var control = (0, _declare['default'])('argos.Fields.DecimalField', [_TextField2['default']], {
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
      var perc;

      perc = this.getPrecision();
      val = _Utility2['default'].roundNumberTo(parseFloat(val), perc);
      val = val.toFixed(perc);
      if (isNaN(val)) {
        if (perc === 0) {
          val = '0';
        } else {
          val = _string['default'].substitute('0${0}00', [Mobile.CultureInfo.numberFormat.currencyDecimalSeparator || '.']);
        }
      } else {
        if (perc !== 0) {
          val = _string['default'].substitute('${0}${1}${2}', [parseInt(val, 10), Mobile.CultureInfo.numberFormat.currencyDecimalSeparator || '.', val.substr(-perc)]);
        }
      }
      this.inherited(arguments, [val]);
    },
    /**
     * Retrieves the value from the {@link TextField#getValue parent implementation} but before
     * returning it de-converts the punctuation back to `en-US` format.
     * @return {Number}
     */
    getValue: function getValue() {
      var value = this.inherited(arguments);
      // SData (and other functions) expect American formatted numbers
      value = value.replace(Mobile.CultureInfo.numberFormat.currencyGroupSeparator, '').replace(Mobile.CultureInfo.numberFormat.numberGroupSeparator, '').replace(Mobile.CultureInfo.numberFormat.currencyDecimalSeparator, '.').replace(Mobile.CultureInfo.numberFormat.numberDecimalSeparator, '.');
      return parseFloat(value);
    },
    /**
     * Retrieves the precision the value will be formated and ronded to.
     * @return {Number}
     */
    getPrecision: function getPrecision() {
      var perc;
      if (this.precision === 0) {
        perc = this.precision;
      } else {
        perc = this.precision || Mobile.CultureInfo.numberFormat.currencyDecimalDigits;
      }
      return perc;
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Fields.DecimalField', control);
  module.exports = _FieldManager2['default'].register('decimal', control);
});
