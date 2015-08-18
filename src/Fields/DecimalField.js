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
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import TextField from './TextField';
import FieldManager from '../FieldManager';
import Utility from '../Utility';

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
const control = declare('argos.Fields.DecimalField', [TextField], {
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
    const perc = this.getPrecision();
    let newVal = Utility.roundNumberTo(parseFloat(val), perc);
    newVal = newVal.toFixed(perc);
    if (isNaN(newVal)) {
      if (perc === 0) {
        newVal = '0';
      } else {
        newVal = string.substitute('0${0}00', [Mobile.CultureInfo.numberFormat.currencyDecimalSeparator || '.']);
      }
    } else {
      if (perc !== 0) {
        newVal = string.substitute('${0}${1}${2}', [
          parseInt(newVal, 10),
          Mobile.CultureInfo.numberFormat.currencyDecimalSeparator || '.',
          newVal.substr(-perc),
        ]);
      }
    }
    this.inherited(arguments, [newVal]);
  },
  /**
   * Retrieves the value from the {@link TextField#getValue parent implementation} but before
   * returning it de-converts the punctuation back to `en-US` format.
   * @return {Number}
   */
  getValue: function getValue() {
    let value = this.inherited(arguments);
    // SData (and other functions) expect American formatted numbers
    value = value
      .replace(Mobile.CultureInfo.numberFormat.currencyGroupSeparator, '')
      .replace(Mobile.CultureInfo.numberFormat.numberGroupSeparator, '')
      .replace(Mobile.CultureInfo.numberFormat.currencyDecimalSeparator, '.')
      .replace(Mobile.CultureInfo.numberFormat.numberDecimalSeparator, '.');
    return parseFloat(value);
  },
  /**
   * Retrieves the precision the value will be formated and ronded to.
   * @return {Number}
   */
  getPrecision: function getPrecision() {
    let perc;
    if (this.precision === 0) {
      perc = this.precision;
    } else {
      perc = this.precision || Mobile.CultureInfo.numberFormat.currencyDecimalDigits;
    }
    return perc;
  },
});

lang.setObject('Sage.Platform.Mobile.Fields.DecimalField', control);
export default FieldManager.register('decimal', control);
