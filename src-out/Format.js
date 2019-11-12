define('argos/Format', ['module', 'exports', 'dojo/_base/lang', 'dojo/string', './I18n'], function (module, exports, _lang, _string, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lang2 = _interopRequireDefault(_lang);

  var _string2 = _interopRequireDefault(_string);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var format = ICRMCommonSDK.format; /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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

  var resource = (0, _I18n2.default)('format');
  var dtFormatResource = (0, _I18n2.default)('formatDateTimeFormat');

  /**
   * @class argos.Format
   * @classdesc Format is a singleton that provides various formatting functions.
   * @singleton
   */
  var __class = _lang2.default.setObject('argos.Format', /** @lends argos.Format */{
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
     * Takes a String and encodes `&`, `<`, `>`, `"`, `'`, and `/` to HTML entities
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
      var value = format.date(val, utc);
      var m = moment(value);
      if (m) {
        var formattedDate = m.format(fmt || argos.Format.shortDateFormatText);
        if (m.isValid()) {
          return formattedDate;
        }
      }
      return '';
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
      return format.percent(val, places, function (num) {
        return _string2.default.substitute(argos.Format.percentFormatText, [num, Mobile.CultureInfo.numberFormat.percentSymbol]);
      }, Mobile.CultureInfo.numberFormat.percentGroupSeparator, Mobile.CultureInfo.numberFormat.percentDecimalSeparator);
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
      var f = argos.Format;
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
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Gb3JtYXQuanMiXSwibmFtZXMiOlsiZm9ybWF0IiwiSUNSTUNvbW1vblNESyIsInJlc291cmNlIiwiZHRGb3JtYXRSZXNvdXJjZSIsIl9fY2xhc3MiLCJzZXRPYmplY3QiLCJ5ZXNUZXh0Iiwibm9UZXh0IiwidHJ1ZVRleHQiLCJmYWxzZVRleHQiLCJob3Vyc1RleHQiLCJob3VyVGV4dCIsIm1pbnV0ZXNUZXh0IiwibWludXRlVGV4dCIsInNob3J0RGF0ZUZvcm1hdFRleHQiLCJwZXJjZW50Rm9ybWF0VGV4dCIsImVuY29kZSIsImRlY29kZSIsImlzRW1wdHkiLCJieXRlc1RleHQiLCJwaG9uZUZvcm1hdCIsImxpbmsiLCJ2YWwiLCJ3aW5kb3ciLCJuYXZpZ2F0b3IiLCJzdGFuZGFsb25lIiwibWFpbCIsInRyaW0iLCJkYXRlIiwiZm10IiwidXRjIiwidmFsdWUiLCJtIiwibW9tZW50IiwiZm9ybWF0dGVkRGF0ZSIsImFyZ29zIiwiRm9ybWF0IiwiaXNWYWxpZCIsImZpeGVkIiwicGVyY2VudCIsInBsYWNlcyIsIm51bSIsInN1YnN0aXR1dGUiLCJNb2JpbGUiLCJDdWx0dXJlSW5mbyIsIm51bWJlckZvcm1hdCIsInBlcmNlbnRTeW1ib2wiLCJwZXJjZW50R3JvdXBTZXBhcmF0b3IiLCJwZXJjZW50RGVjaW1hbFNlcGFyYXRvciIsInllc05vIiwiYm9vbCIsIm5sMmJyIiwidGltZXNwYW4iLCJmIiwiY2FudmFzRHJhdyIsImltYWdlRnJvbVZlY3RvciIsInBob25lIiwiYWxwaGFUb1Bob25lTnVtZXJpYyIsImZpbGVTaXplIiwic2l6ZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTUEsU0FBU0MsY0FBY0QsTUFBN0IsQyxDQXBCQTs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBLE1BQU1FLFdBQVcsb0JBQVksUUFBWixDQUFqQjtBQUNBLE1BQU1DLG1CQUFtQixvQkFBWSxzQkFBWixDQUF6Qjs7QUFFQTs7Ozs7QUFLQSxNQUFN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NUIsR0FBZCxFQUFtQjtBQUN2QixhQUFPdEIsT0FBT2tELElBQVAsQ0FBWTVCLEdBQVosRUFBaUJhLE1BQU1DLE1BQU4sQ0FBYTVCLFFBQTlCLEVBQXdDMkIsTUFBTUMsTUFBTixDQUFhM0IsU0FBckQsQ0FBUDtBQUNELEtBekxzRTtBQTBMdkU7Ozs7O0FBS0EwQyxXQUFPbkQsT0FBT21ELEtBL0x5RDtBQWdNdkU7Ozs7O0FBS0FDLGNBQVUsU0FBU0EsUUFBVCxDQUFrQjlCLEdBQWxCLEVBQXVCO0FBQy9CLFVBQU0rQixJQUFJbEIsTUFBTUMsTUFBaEI7QUFDQSxhQUFPcEMsT0FBT29ELFFBQVAsQ0FBZ0I5QixHQUFoQixFQUFxQitCLEVBQUUzQyxTQUF2QixFQUFrQzJDLEVBQUUxQyxRQUFwQyxFQUE4QzBDLEVBQUV6QyxXQUFoRCxFQUE2RHlDLEVBQUV4QyxVQUEvRCxDQUFQO0FBQ0QsS0F4TXNFO0FBeU12RTs7Ozs7Ozs7QUFRQXlDLGdCQUFZdEQsT0FBT3NELFVBak5vRDtBQWtOdkU7Ozs7Ozs7QUFPQUMscUJBQWlCdkQsT0FBT3VELGVBek4rQztBQTBOdkU7Ozs7Ozs7O0FBUUFDLFdBQU94RCxPQUFPd0QsS0FsT3lEO0FBbU92RTs7Ozs7O0FBTUFDLHlCQUFxQnpELE9BQU95RCxtQkF6TzJDO0FBME92RUMsY0FBVSxTQUFTQSxRQUFULENBQWtCQyxJQUFsQixFQUF3QjtBQUNoQyxhQUFPM0QsT0FBTzBELFFBQVAsQ0FBZ0JDLElBQWhCLEVBQXNCeEIsTUFBTUMsTUFBTixDQUFhakIsU0FBbkMsQ0FBUDtBQUNEO0FBNU9zRSxHQUF6RCxDQUFoQjs7b0JBK09lZixPIiwiZmlsZSI6IkZvcm1hdC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGxhbmcgZnJvbSAnZG9qby9fYmFzZS9sYW5nJztcclxuaW1wb3J0IHN0cmluZyBmcm9tICdkb2pvL3N0cmluZyc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IGZvcm1hdCA9IElDUk1Db21tb25TREsuZm9ybWF0O1xyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdmb3JtYXQnKTtcclxuY29uc3QgZHRGb3JtYXRSZXNvdXJjZSA9IGdldFJlc291cmNlKCdmb3JtYXREYXRlVGltZUZvcm1hdCcpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5Gb3JtYXRcclxuICogQGNsYXNzZGVzYyBGb3JtYXQgaXMgYSBzaW5nbGV0b24gdGhhdCBwcm92aWRlcyB2YXJpb3VzIGZvcm1hdHRpbmcgZnVuY3Rpb25zLlxyXG4gKiBAc2luZ2xldG9uXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gbGFuZy5zZXRPYmplY3QoJ2FyZ29zLkZvcm1hdCcsIC8qKiBAbGVuZHMgYXJnb3MuRm9ybWF0ICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgdXNlZCBpbiB7QGxpbmsgI3llc05vIHllc05vfSBmb3JtYXR0ZXIgZm9yIHRydWUgdmFsdWVzXHJcbiAgICovXHJcbiAgeWVzVGV4dDogcmVzb3VyY2UueWVzVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IHVzZWQgaW4ge0BsaW5rICN5ZXNObyB5ZXNOb30gZm9ybWF0dGVyIGZvciBmYWxzZSB2YWx1ZXNcclxuICAgKi9cclxuICBub1RleHQ6IHJlc291cmNlLm5vVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IHVzZWQgaW4ge0BsaW5rICNib29sIGJvb2x9IGZvcm1hdHRlciBmb3IgdHJ1ZSB2YWx1ZXNcclxuICAgKi9cclxuICB0cnVlVGV4dDogcmVzb3VyY2UudHJ1ZVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCB1c2VkIGluIHtAbGluayAjYm9vbCBib29sfSBmb3JtYXR0ZXIgZm9yIGZhbHNlIHZhbHVlc1xyXG4gICAqL1xyXG4gIGZhbHNlVGV4dDogcmVzb3VyY2UuZmFsc2VUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgdXNlZCBpbiB7QGxpbmsgI3RpbWVzcGFuIHRpbWVzcGFufSBmb3JtYXR0ZXIgZm9yIG1vcmUgdGhhbiBvbmUgaG91clxyXG4gICAqL1xyXG4gIGhvdXJzVGV4dDogcmVzb3VyY2UuaG91cnNUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgdXNlZCBpbiB7QGxpbmsgI3RpbWVzcGFuIHRpbWVzcGFufSBmb3JtYXR0ZXIgZm9yIGV4YWN0bHkgb25lIGhvdXJcclxuICAgKi9cclxuICBob3VyVGV4dDogcmVzb3VyY2UuaG91clRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCB1c2VkIGluIHtAbGluayAjdGltZXNwYW4gdGltZXNwYW59IGZvcm1hdHRlciBmb3IgbW9yZSB0aGFuIG9uZSBtaW51dGVcclxuICAgKi9cclxuICBtaW51dGVzVGV4dDogcmVzb3VyY2UubWludXRlc1RleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCB1c2VkIGluIHtAbGluayAjdGltZXNwYW4gdGltZXNwYW59IGZvcm1hdHRlciBmb3IgZXhhY3RseSBvbmUgbWludXRlXHJcbiAgICovXHJcbiAgbWludXRlVGV4dDogcmVzb3VyY2UubWludXRlVGV4dCxcclxuXHJcbiAgc2hvcnREYXRlRm9ybWF0VGV4dDogZHRGb3JtYXRSZXNvdXJjZS5zaG9ydERhdGVGb3JtYXRUZXh0LFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBmb3JtYXQgc3RyaW5nIGZvciBwZXJjZW50XHJcbiAgICogKiBgJHswfWAgLSBwZXJjZW50IHZhbHVlXHJcbiAgICogKiBgJHsxfWAgLSBwZXJjZW50IHN5bm1ib2wgXCIlXCJcclxuICAgKi9cclxuICBwZXJjZW50Rm9ybWF0VGV4dDogcmVzb3VyY2UucGVyY2VudEZvcm1hdFRleHQsXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSBTdHJpbmcgYW5kIGVuY29kZXMgYCZgLCBgPGAsIGA+YCwgYFwiYCwgYCdgLCBhbmQgYC9gIHRvIEhUTUwgZW50aXRpZXNcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gU3RyaW5nIHRvIGVuY29kZVxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gSHRtbCBlbmNvZGVkIHN0cmluZ1xyXG4gICAqL1xyXG4gIGVuY29kZTogZm9ybWF0LmVuY29kZSxcclxuICAvKipcclxuICAgKiBUYWtlcyBhIFN0cmluZyBhbmQgZGVjb2RlcyBgJmAsIGA8YCwgYD5gLCBgXCJgIGZyb20gSFRNTCBlbnRpdGllcyBiYWNrIHRvIHRoZSBjaGFyYWN0ZXJcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gU3RyaW5nIHRvIGRlY29kZVxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gSHRtbCBkZWNvZGVkIHN0cmluZ1xyXG4gICAqL1xyXG4gIGRlY29kZTogZm9ybWF0LmRlY29kZSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBnaXZlbiBpdGVtIGlzIGFuIGVtcHR5IHN0cmluZyBvciBlbXB0eSBhcnJ5XHJcbiAgICogQHBhcmFtIHtTdHJpbmcvQXJyYXl9IEl0ZW0gdG8gY2hlY2sgaWYgZW1wdHlcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBJZiBwYXNzZWQgaXRlbSBpcyBlbXB0eVxyXG4gICAqL1xyXG4gIGlzRW1wdHk6IGZvcm1hdC5pc0VtcHR5LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgdXNlZCBpbiBmaWxlIHNpemUgIGZvcm1hdHRlclxyXG4gICAqL1xyXG4gIGJ5dGVzVGV4dDogcmVzb3VyY2UuYnl0ZXNUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0W119XHJcbiAgICogQXJyYXkgb2Ygb2JqZWN0cyB0aGF0IGhhdmUgdGhlIGtleXMgYHRlc3RgIGFuZCBgZm9ybWF0YCB3aGVyZSBgdGVzdGAgaXMgYSBSZWdFeHAgdGhhdFxyXG4gICAqIG1hdGNoZXMgdGhlIHBob25lIGdyb3VwaW5nIGFuZCBgZm9ybWF0YCBpcyB0aGUgc3RyaW5nIGZvcm1hdCB0byBiZSByZXBsYWNlZC5cclxuICAgKlxyXG4gICAqIFRoZSBSZWdFeHAgbWF5IGhhdmUgY2FwdHVyZSBncm91cHMgYnV0IHdoZW4geW91IGFyZSBkZWZpbmluZyB0aGUgZm9ybWF0IHN0cmluZ3MgdXNlOlxyXG4gICAqXHJcbiAgICogKiBgJHswfWAgLSBvcmlnaW5hbCB2YWx1ZVxyXG4gICAqICogYCR7MX1gIC0gY2xlYW5lZCB2YWx1ZVxyXG4gICAqICogYCR7Mn1gIC0gZW50aXJlIG1hdGNoIChhZ2FpbnN0IGNsZWFuIHZhbHVlKVxyXG4gICAqICogYCR7My4ubn1gIC0gbWF0Y2ggZ3JvdXBzIChhZ2FpbnN0IGNsZWFuIHZhbHVlKVxyXG4gICAqXHJcbiAgICogVGhlIGBjbGVhbiB2YWx1ZWAgaXMgdGFraW5nIHRoZSBpbnB1dHRlZCBudW1iZXJzL3RleHQgYW5kIHJlbW92aW5nIGFueSBub24tbnVtYmVyXHJcbiAgICogYW5kIG5vbi1cInhcIiBhbmQgaXQgcmVwbGFjZXMgQS1aIHRvIHRoZWlyIHJlc3BlY3RpdmUgcGhvbmUgbnVtYmVyIGNoYXJhY3Rlci5cclxuICAgKlxyXG4gICAqIFRoZSB0aHJlZSBkZWZhdWx0IGZvcm1hdHRlcnMgYXJlOlxyXG4gICAqICogYG5ubi1ubm5uYFxyXG4gICAqICogYChubm4pLW5ubi1ubm5uYFxyXG4gICAqICogYChubm4pLW5ubi1ubm54bm5ubmBcclxuICAgKlxyXG4gICAqIElmIHlvdSBwbGFuIHRvIG92ZXJyaWRlIHRoaXMgdmFsdWUgbWFrZSBzdXJlIHlvdSBpbmNsdWRlIHRoZSBkZWZhdWx0IG9uZXMgcHJvdmlkZWQuXHJcbiAgICpcclxuICAgKi9cclxuICBwaG9uZUZvcm1hdDogZm9ybWF0LnBob25lRm9ybWF0LFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGEgdXJsIHN0cmluZyBhbmQgd3JhcHMgaXQgd2l0aCBhbiBgPGE+YCBlbGVtZW50IHdpdGggYGhyZWY9YCBwb2ludGluZyB0byB0aGUgdXJsLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWwgVXJsIHN0cmluZyB0byBiZSB3cmFwcGVkXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBBbiBgPGE+YCBlbGVtZW50IGFzIGEgc3RyaW5nLlxyXG4gICAqL1xyXG4gIGxpbms6IGZ1bmN0aW9uIGxpbmsodmFsKSB7XHJcbiAgICByZXR1cm4gZm9ybWF0LmxpbmsodmFsLCB3aW5kb3cubmF2aWdhdG9yLnN0YW5kYWxvbmUpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYW4gZW1haWwgc3RyaW5nIGFuZCB3cmFwcyBpdCB3aXRoIGFuIGA8YT5gIGVsZW1lbnQgd2l0aCBgaHJlZj1cIm1haWx0bzpcImAgcG9pbnRpbmcgdG8gdGhlIGVtYWlsLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWwgRW1haWwgc3RyaW5nIHRvIGJlIHdyYXBwZWRcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IEFuIGA8YT5gIGVsZW1lbnQgYXMgYSBzdHJpbmcuXHJcbiAgICovXHJcbiAgbWFpbDogZm9ybWF0Lm1haWwsXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyB3aGl0ZXNwYWNlIGZyb20gZnJvbSBhbmQgZW5kIG9mIHN0cmluZ1xyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWwgU3RyaW5nIHRvIGJlIHRyaW1tZWRcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFN0cmluZyB3aXRob3V0IHNwYWNlIG9uIGVpdGhlciBlbmRcclxuICAgKi9cclxuICB0cmltOiBmb3JtYXQudHJpbSxcclxuICAvKipcclxuICAgKiBUYWtlcyBhIGRhdGUgYW5kIGZvcm1hdCBzdHJpbmcgYW5kIHJldHVybnMgdGhlIGZvcm1hdHRlZCBkYXRlIGFzIGEgc3RyaW5nLlxyXG4gICAqIEBwYXJhbSB7RGF0ZS9TdHJpbmd9IHZhbCBEYXRlIHRvIGJlIGNvbnZlcnRlZC4gSWYgc3RyaW5nIGlzIHBhc3NlZCBpdCBpcyBjb252ZXJ0ZWQgdG8gYSBkYXRlIHVzaW5nIHtAbGluayBjb252ZXJ0I3RvRGF0ZUZyb21TdHJpbmcgQ29udmVydHMgdG9EYXRlRnJvbVN0cmluZ30uXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZtdCBGb3JtYXQgc3RyaW5nIGZvbGxvd2luZyBbZGF0ZWpzIGZvcm1hdHRpbmddKGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9kYXRlanMvd2lraS9Gb3JtYXRTcGVjaWZpZXJzKS5cclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IHV0YyBJZiBhIGRhdGUgc2hvdWxkIGJlIGluIFVUQyB0aW1lIHNldCB0aGlzIGZsYWcgdG8gdHJ1ZSB0byBjb3VudGVyLWFjdCBqYXZhc2NyaXB0cyBidWlsdC1pbiB0aW1lem9uZSBhcHBsaWVyLlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gRGF0ZSBmb3JtYXR0ZWQgYXMgYSBzdHJpbmcuXHJcbiAgICovXHJcbiAgZGF0ZTogZnVuY3Rpb24gZGF0ZSh2YWwsIGZtdCwgdXRjKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IGZvcm1hdC5kYXRlKHZhbCwgdXRjKTtcclxuICAgIGNvbnN0IG0gPSBtb21lbnQodmFsdWUpO1xyXG4gICAgaWYgKG0pIHtcclxuICAgICAgY29uc3QgZm9ybWF0dGVkRGF0ZSA9IG0uZm9ybWF0KGZtdCB8fCBhcmdvcy5Gb3JtYXQuc2hvcnREYXRlRm9ybWF0VGV4dCk7XHJcbiAgICAgIGlmIChtLmlzVmFsaWQoKSkge1xyXG4gICAgICAgIHJldHVybiBmb3JtYXR0ZWREYXRlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBUYWtlcyBhIG51bWJlciBhbmQgZGVjaW1hbCBwbGFjZSBhbmQgZmxvb3JzIHRoZSBudW1iZXIgdG8gdGhhdCBwbGFjZTpcclxuICAgKlxyXG4gICAqIGBmaXhlZCg1LjU1NSwgMClgID0+IGA1YFxyXG4gICAqIGBmaXhlZCg1LjU1NSwgMilgID0+IGA1LjU1YFxyXG4gICAqIGBmaXhlZCg1LjU1NSwgNSlgID0+IGA1LjU1NWBcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyL1N0cmluZ30gdmFsIFRoZSB2YWx1ZSB3aWxsIGJlIGBwYXJzZUZsb2F0YCBiZWZvcmUgb3BlcmF0aW5nLlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBkIE51bWJlciBvZiBkZWNpbWFscyBwbGFjZXMgdG8ga2VlcCwgZGVmYXVsdHMgdG8gMiBpZiBub3QgcHJvdmlkZWQuXHJcbiAgICogQHJldHVybiB7TnVtYmVyfSBGaXhlZCBudW1iZXIuXHJcbiAgICovXHJcbiAgZml4ZWQ6IGZvcm1hdC5maXhlZCxcclxuICAvKipcclxuICAgKiBUYWtlcyBhIGRlY2ltYWwgbnVtYmVyLCBtdWx0aXBsaWVzIGJ5IDEwMCBhbmQgYWRkcyB0aGUgJSBzaWduIHdpdGggdGhlIG51bWJlciBvZiBwYWxjZXMgdG8gdGhlIHJpZ2h0LlxyXG4gICAqXHJcbiAgICogYHBlcmVjZW50KDAuMzUpYCA9PiBgJzM1LjAwJSdgXHJcbiAgICogYHBlcmVjZW50KDAuMzUsIDApYCA9PiBgJzM1JSdgXHJcbiAgICogYHBlcmNlbnQoMi45OTUwKWAgPT4gYCcyOTkuNTAlJ2BcclxuICAgKiBgcGVyY2VudCgyLjk5NTAsMClgID0+IGAnMzAwJSdgXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge051bWJlci9TdHJpbmd9IHZhbCBUaGUgdmFsdWUgd2lsbCBiZSBgcGFyc2VGbG9hdGAgYmVmb3JlIG9wZXJhdGluZy5cclxuICAgKiBAcGFyYW0ge051bWJlci9TdHJpbmd9IHBsYWNlcyBJZiBubyB2YWx1ZSBpcyBnaXZlbiB0aGUgZGVmYXVsdCB2YWx1ZSB3aWxsIGJlIHNldCB0byAyLlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gTnVtYmVyIGFzIGEgcGVyY2VudGFnZSB3aXRoICUgc2lnbi5cclxuICAgKi9cclxuICBwZXJjZW50OiBmdW5jdGlvbiBwZXJjZW50KHZhbCwgcGxhY2VzKSB7XHJcbiAgICByZXR1cm4gZm9ybWF0LnBlcmNlbnQoXHJcbiAgICAgIHZhbCxcclxuICAgICAgcGxhY2VzLFxyXG4gICAgICAobnVtKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdGl0dXRlKGFyZ29zLkZvcm1hdC5wZXJjZW50Rm9ybWF0VGV4dCwgW251bSwgTW9iaWxlLkN1bHR1cmVJbmZvLm51bWJlckZvcm1hdC5wZXJjZW50U3ltYm9sXSk7XHJcbiAgICAgIH0sXHJcbiAgICAgIE1vYmlsZS5DdWx0dXJlSW5mby5udW1iZXJGb3JtYXQucGVyY2VudEdyb3VwU2VwYXJhdG9yLFxyXG4gICAgICBNb2JpbGUuQ3VsdHVyZUluZm8ubnVtYmVyRm9ybWF0LnBlcmNlbnREZWNpbWFsU2VwYXJhdG9yKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGEgYm9vbGVhbiB2YWx1ZSBhbmQgcmV0dXJucyB0aGUgc3RyaW5nIFllcyBvciBObyBmb3IgdHJ1ZSBvciBmYWxzZVxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbi9TdHJpbmd9IHZhbCBJZiBzdHJpbmcgaXQgdGVzdHMgaWYgdGhlIHN0cmluZyBpcyBgdHJ1ZWAgZm9yIHRydWUsIGVsc2UgYXNzdW1lcyBmYWxzZVxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gWWVzIGZvciB0cnVlLCBObyBmb3IgZmFsc2UuXHJcbiAgICovXHJcbiAgeWVzTm86IGZ1bmN0aW9uIHllc05vKHZhbCkge1xyXG4gICAgcmV0dXJuIGZvcm1hdC55ZXNObyh2YWwsIGFyZ29zLkZvcm1hdC55ZXNUZXh0LCBhcmdvcy5Gb3JtYXQubm9UZXh0KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGEgYm9vbGVhbiB2YWx1ZSBhbmQgcmV0dXJucyB0aGUgc3RyaW5nIFQgb3IgRiBmb3IgdHJ1ZSBvciBmYWxzZVxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbi9TdHJpbmd9IHZhbCBJZiBzdHJpbmcgaXQgdGVzdHMgaWYgdGhlIHN0cmluZyBpcyBgdHJ1ZWAgZm9yIHRydWUsIGVsc2UgYXNzdW1lcyBmYWxzZVxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gVCBmb3IgdHJ1ZSwgRiBmb3IgZmFsc2UuXHJcbiAgICovXHJcbiAgYm9vbDogZnVuY3Rpb24gYm9vbCh2YWwpIHtcclxuICAgIHJldHVybiBmb3JtYXQuYm9vbCh2YWwsIGFyZ29zLkZvcm1hdC50cnVlVGV4dCwgYXJnb3MuRm9ybWF0LmZhbHNlVGV4dCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBUYWtlcyBhIHN0cmluZyBhbmQgY29udmVydHMgYWxsIG5ldyBsaW5lcyBgXFxuYCB0byBIVE1MIGA8YnI+YCBlbGVtZW50cy5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsIFN0cmluZyB3aXRoIG5ld2xpbmVzXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBTdHJpbmcgd2l0aCByZXBsYWNlZCBgXFxuYCB3aXRoIGA8YnI+YFxyXG4gICAqL1xyXG4gIG5sMmJyOiBmb3JtYXQubmwyYnIsXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSBudW1iZXIgb2YgbWludXRlcyBhbmQgdHVybnMgaXQgaW50byB0aGUgc3RyaW5nOiBgJ24gaG91cnMgbSBtaW51dGVzJ2BcclxuICAgKiBAcGFyYW0ge051bWJlci9TdHJpbmd9IHZhbCBOdW1iZXIgb2YgbWludXRlcywgd2lsbCBiZSBgcGFyc2VGbG9hdGAgYmVmb3JlIG9wZXJhdGlvbnMgYW5kIGZpeGVkIHRvIDIgZGVjaW1hbCBwbGFjZXNcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IEEgc3RyaW5nIHJlcHJlc2VudGF0aW9uIG9mIHRoZSBtaW51dGVzIGFzIGAnbiBob3VycyBtIG1pbnV0ZXMnYFxyXG4gICAqL1xyXG4gIHRpbWVzcGFuOiBmdW5jdGlvbiB0aW1lc3Bhbih2YWwpIHtcclxuICAgIGNvbnN0IGYgPSBhcmdvcy5Gb3JtYXQ7XHJcbiAgICByZXR1cm4gZm9ybWF0LnRpbWVzcGFuKHZhbCwgZi5ob3Vyc1RleHQsIGYuaG91clRleHQsIGYubWludXRlc1RleHQsIGYubWludXRlVGV4dCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBUYWtlcyBhIDJEIGFycmF5IG9mIGBbW3gseV0sW3gseV1dYCBudW1iZXIgY29vcmRpbmF0ZXMgYW5kIGRyYXdzIHRoZW0gb250byB0aGUgcHJvdmlkZWQgY2FudmFzXHJcbiAgICogVGhlIGZpcnN0IHBvaW50IG1hcmtzIHdoZXJlIHRoZSBcInBlblwiIHN0YXJ0cywgZWFjaCBzZXF1ZW50aWFsIHBvaW50IGlzIHRoZW4gXCJkcmF3biB0b1wiIGFzIGlmIGhvbGRpbmcgYVxyXG4gICAqIHBlbiBvbiBwYXBlciBhbmQgbW92aW5nIHRoZSBwZW4gdG8gdGhlIG5ldyBwb2ludC5cclxuICAgKiBAcGFyYW0ge051bWJlcltdW119IHZlY3RvciBBIHNlcmllcyBvZiB4LHkgY29vcmRpbmF0ZXMgaW4gdGhlIGZvcm1hdCBvZjogYFtbMCwwXSxbMSw1XV1gXHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gY2FudmFzIFRoZSBgPGNhbnZhcz5gIGVsZW1lbnQgdG8gYmUgZHJhd24gb25cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBDYW52YXMgb3B0aW9uczogc2NhbGUsIGxpbmVXaWR0aCBhbmQgcGVuQ29sb3IuXHJcbiAgICovXHJcbiAgY2FudmFzRHJhdzogZm9ybWF0LmNhbnZhc0RyYXcsXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgaW1hZ2UgZGF0YSAob3IgaW1nIGVsZW1lbnQpIGZvciBhIHNlcmllcyBvZiB2ZWN0b3JzXHJcbiAgICogQHBhcmFtIHtOdW1iZXJbXVtdfSB2ZWN0b3IgQSBzZXJpZXMgb2YgeCx5IGNvb3JkaW5hdGVzIGluIHRoZSBmb3JtYXQgb2Y6IGBbWzAsMF0sWzEsNV1dYC4gVGhlc2Ugd2lsbCBiZSBkcmF3biBzZXF1ZW50aWFsbHkgYXMgb25lIGxpbmUuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgQ2FudmFzIG9wdGlvbnM6IHNjYWxlLCBsaW5lV2lkdGggYW5kIHBlbkNvbG9yLlxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaHRtbCBGbGFnIGZvciByZXR1cm5pbmcgaW1hZ2UgYXMgYSBkYXRhLXVyaSBvciBhcyBhIHN0cmluZ2lmaWVkIGA8aW1nPmAgZWxlbWVudC5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFRoZSBlbmNvZGVkIGRhdGEgb2YgdGhlIGRyYXduIGltYWdlLCBvcHRpb25hbGx5IHdyYXBwZWQgaW4gYDxpbWc+YCBpZiBodG1sIHdhcyBwYXNzZWQgYXMgdHJ1ZVxyXG4gICAqL1xyXG4gIGltYWdlRnJvbVZlY3RvcjogZm9ybWF0LmltYWdlRnJvbVZlY3RvcixcclxuICAvKipcclxuICAgKiBUYWtlcyBhIHN0cmluZyBwaG9uZSBpbnB1dCBhbmQgYXR0ZW1wdHMgdG8gbWF0Y2ggaXQgYWdhaW5zdCB0aGUgcHJlZGVmaW5lZFxyXG4gICAqIHBob25lIGZvcm1hdHMgLSBpZiBhIG1hdGNoIGlzIGZvdW5kIGl0IGlzIHJldHVybmVkIGZvcm1hdHRlZCBpZiBub3QgaXQgaXMgcmV0dXJuZWRcclxuICAgKiBhcyBpcy5cclxuICAgKiBAcGFyYW0gdmFsIHtTdHJpbmd9IFN0cmluZyBpbnB1dHRlZCBwaG9uZSBudW1iZXIgdG8gZm9ybWF0XHJcbiAgICogQHBhcmFtIGFzTGluayB7Qm9vbGVhbn0gVHJ1ZSB0byBwdXQgdGhlIHBob25lIGluIGFuIGFuY2hvciBlbGVtZW50IHBvaW50aW5nIHRvIGEgdGVsOiB1cmlcclxuICAgKiBAcmV0dXJucyB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIHBob25lOiBmb3JtYXQucGhvbmUsXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSBzdHJpbmcgaW5wdXQgYW5kIGNvbnZlcnRzIEEtWiB0byB0aGVpciByZXNwZWN0aXZlIHBob25lIG51bWJlciBjaGFyYWN0ZXJcclxuICAgKiBgMTgwMENBTExNRWAgLT4gYDE4MDAyMjU1NjNgXHJcbiAgICogQHBhcmFtIHZhbFxyXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgYWxwaGFUb1Bob25lTnVtZXJpYzogZm9ybWF0LmFscGhhVG9QaG9uZU51bWVyaWMsXHJcbiAgZmlsZVNpemU6IGZ1bmN0aW9uIGZpbGVTaXplKHNpemUpIHtcclxuICAgIHJldHVybiBmb3JtYXQuZmlsZVNpemUoc2l6ZSwgYXJnb3MuRm9ybWF0LmJ5dGVzVGV4dCk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=