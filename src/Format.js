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
import lang from 'dojo/_base/lang';
import string from 'dojo/string';
import getResource from './I18n';
import { format } from '@infor/icrm-js-common';

const resource = getResource('format');
const dtFormatResource = getResource('formatDateTimeFormat');

/**
 * @class argos.Format
 * Format is a singleton that provides various formatting functions.
 * @alternateClassName format
 * @requires argos.Convert
 * @singleton
 */
const __class = lang.setObject('argos.Format', {
  /**
   * @property {String}
   * Text used in {@link #yesNo yesNo} formatter for true values
   */
  yesText: resource.yesText,
  /**
   * @property {String}
   * Text used in {@link #yesNo yesNo} formatter for false values
   */
  noText: resource.noText,
  /**
   * @property {String}
   * Text used in {@link #bool bool} formatter for true values
   */
  trueText: resource.trueText,
  /**
   * @property {String}
   * Text used in {@link #bool bool} formatter for false values
   */
  falseText: resource.falseText,
  /**
   * @property {String}
   * Text used in {@link #timespan timespan} formatter for more than one hour
   */
  hoursText: resource.hoursText,
  /**
   * @property {String}
   * Text used in {@link #timespan timespan} formatter for exactly one hour
   */
  hourText: resource.hourText,
  /**
   * @property {String}
   * Text used in {@link #timespan timespan} formatter for more than one minute
   */
  minutesText: resource.minutesText,
  /**
   * @property {String}
   * Text used in {@link #timespan timespan} formatter for exactly one minute
   */
  minuteText: resource.minuteText,

  shortDateFormatText: dtFormatResource.shortDateFormatText,

  /**
   * @property {String}
   * format string for percent
   * * `${0}` - percent value
   * * `${1}` - percent synmbol "%"
   */
  percentFormatText: resource.percentFormatText,
  /**
   * Takes a String and encodes `&`, `<`, `>`, `"` to HTML entities
   * @param {String} String to encode
   * @return {String} Html encoded string
   */
  encode: format.encode,
  /**
   * Takes a String and decodes `&`, `<`, `>`, `"` from HTML entities back to the character
   * @param {String} String to decode
   * @return {String} Html decoded string
   */
  decode: format.decode,
  /**
   * Determines if the given item is an empty string or empty arry
   * @param {String/Array} Item to check if empty
   * @return {Boolean} If passed item is empty
   */
  isEmpty: format.isEmpty,
  /**
   * @property {String}
   * Text used in file size  formatter
   */
  bytesText: resource.bytesText,
  /**
   * @property {Object[]}
   * Array of objects that have the keys `test` and `format` where `test` is a RegExp that
   * matches the phone grouping and `format` is the string format to be replaced.
   *
   * The RegExp may have capture groups but when you are defining the format strings use:
   *
   * * `${0}` - original value
   * * `${1}` - cleaned value
   * * `${2}` - entire match (against clean value)
   * * `${3..n}` - match groups (against clean value)
   *
   * The `clean value` is taking the inputted numbers/text and removing any non-number
   * and non-"x" and it replaces A-Z to their respective phone number character.
   *
   * The three default formatters are:
   * * `nnn-nnnn`
   * * `(nnn)-nnn-nnnn`
   * * `(nnn)-nnn-nnnxnnnn`
   *
   * If you plan to override this value make sure you include the default ones provided.
   *
   */
  phoneFormat: format.phoneFormat,
  /**
   * Takes a url string and wraps it with an `<a>` element with `href=` pointing to the url.
   * @param {String} val Url string to be wrapped
   * @return {String} An `<a>` element as a string.
   */
  link: function link(val) {
    return format.link(val, window.navigator.standalone);
  },
  /**
   * Takes an email string and wraps it with an `<a>` element with `href="mailto:"` pointing to the email.
   * @param {String} val Email string to be wrapped
   * @return {String} An `<a>` element as a string.
   */
  mail: format.mail,
  /**
   * Removes whitespace from from and end of string
   * @param {String} val String to be trimmed
   * @return {String} String without space on either end
   */
  trim: format.trim,
  /**
   * Takes a date and format string and returns the formatted date as a string.
   * @param {Date/String} val Date to be converted. If string is passed it is converted to a date using {@link convert#toDateFromString Converts toDateFromString}.
   * @param {String} fmt Format string following [datejs formatting](http://code.google.com/p/datejs/wiki/FormatSpecifiers).
   * @param {Boolean} utc If a date should be in UTC time set this flag to true to counter-act javascripts built-in timezone applier.
   * @return {String} Date formatted as a string.
   */
  date: function date(val, fmt, utc) {
    return format.date(val, fmt, utc, argos.Format.shortDateFormatText);
  },
  /**
   * Takes a number and decimal place and floors the number to that place:
   *
   * `fixed(5.555, 0)` => `5`
   * `fixed(5.555, 2)` => `5.55`
   * `fixed(5.555, 5)` => `5.555`
   *
   * @param {Number/String} val The value will be `parseFloat` before operating.
   * @param {Number} d Number of decimals places to keep, defaults to 2 if not provided.
   * @return {Number} Fixed number.
   */
  fixed: format.fixed,
  /**
   * Takes a decimal number, multiplies by 100 and adds the % sign with the number of palces to the right.
   *
   * `perecent(0.35)` => `'35.00%'`
   * `perecent(0.35, 0)` => `'35%'`
   * `percent(2.9950)` => `'299.50%'`
   * `percent(2.9950,0)` => `'300%'`
   *
   * @param {Number/String} val The value will be `parseFloat` before operating.
   * @param {Number/String} places If no value is given the default value will be set to 2.
   * @return {String} Number as a percentage with % sign.
   */
  percent: function percent(val, places) {
    return format.percent(
      val,
      places,
      (num) => {
        return string.substitute(argos.Format.percentFormatText, [num, Mobile.CultureInfo.numberFormat.percentSymbol]);
      },
      Mobile.CultureInfo.numberFormat.percentGroupSeparator,
      Mobile.CultureInfo.numberFormat.percentDecimalSeparator);
  },
  /**
   * Takes a boolean value and returns the string Yes or No for true or false
   * @param {Boolean/String} val If string it tests if the string is `true` for true, else assumes false
   * @return {String} Yes for true, No for false.
   */
  yesNo: function yesNo(val) {
    return format.yesNo(val, argos.Format.yesText, argos.Format.noText);
  },
  /**
   * Takes a boolean value and returns the string T or F for true or false
   * @param {Boolean/String} val If string it tests if the string is `true` for true, else assumes false
   * @return {String} T for true, F for false.
   */
  bool: function bool(val) {
    return format.bool(val, argos.Format.trueText, argos.Format.falseText);
  },
  /**
   * Takes a string and converts all new lines `\n` to HTML `<br>` elements.
   * @param {String} val String with newlines
   * @return {String} String with replaced `\n` with `<br>`
   */
  nl2br: format.nl2br,
  /**
   * Takes a number of minutes and turns it into the string: `'n hours m minutes'`
   * @param {Number/String} val Number of minutes, will be `parseFloat` before operations and fixed to 2 decimal places
   * @return {String} A string representation of the minutes as `'n hours m minutes'`
   */
  timespan: function timespan(val) {
    const f = argos.Format;
    return format.timespan(val, f.hoursText, f.hourText, f.minutesText, f.minuteText);
  },
  /**
   * Takes a 2D array of `[[x,y],[x,y]]` number coordinates and draws them onto the provided canvas
   * The first point marks where the "pen" starts, each sequential point is then "drawn to" as if holding a
   * pen on paper and moving the pen to the new point.
   * @param {Number[][]} vector A series of x,y coordinates in the format of: `[[0,0],[1,5]]`
   * @param {HTMLElement} canvas The `<canvas>` element to be drawn on
   * @param {Object} options Canvas options: scale, lineWidth and penColor.
   */
  canvasDraw: format.canvasDraw,
  /**
   * Returns the image data (or img element) for a series of vectors
   * @param {Number[][]} vector A series of x,y coordinates in the format of: `[[0,0],[1,5]]`. These will be drawn sequentially as one line.
   * @param {Object} options Canvas options: scale, lineWidth and penColor.
   * @param {Boolean} html Flag for returning image as a data-uri or as a stringified `<img>` element.
   * @return {String} The encoded data of the drawn image, optionally wrapped in `<img>` if html was passed as true
   */
  imageFromVector: format.imageFromVector,
  /**
   * Takes a string phone input and attempts to match it against the predefined
   * phone formats - if a match is found it is returned formatted if not it is returned
   * as is.
   * @param val {String} String inputted phone number to format
   * @param asLink {Boolean} True to put the phone in an anchor element pointing to a tel: uri
   * @returns {String}
   */
  phone: format.phone,
  /**
   * Takes a string input and converts A-Z to their respective phone number character
   * `1800CALLME` -> `1800225563`
   * @param val
   * @returns {String}
   */
  alphaToPhoneNumeric: format.alphaToPhoneNumeric,
  fileSize: function fileSize(size) {
    return format.fileSize(size, argos.Format.bytesText);
  },
});

lang.setObject('Sage.Platform.Mobile.Format', __class);
export default __class;
