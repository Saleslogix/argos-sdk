define('argos/Convert', ['module', 'exports', 'dojo/_base/lang'], function (module, exports, _lang) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lang2 = _interopRequireDefault(_lang);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var convert = ICRMCommonSDK.convert; /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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
   * @class argos.Convert
   * @classdesc Convert provides a number of type transformation functions.
   * @singleton
   */


  var __class = _lang2.default.setObject('argos.Convert', /** @lends argos.Convert */{
    /**
     * Takes a string and checks to see if it is `true` or `T`, else returns false
     * @param {String} value String bool value
     * @return {Boolean} Returns true if string is `true` or `T`.
     */
    toBoolean: convert.toBoolean,
    /**
     * Takes a string and checks to see if it is an ISO formatted date or a JSON-string date
     *
     * ISO Date: `'2012-08-28'` or `'2012-05-28T08:30:00Z'`
     * JSON-string: `'/Date(1346189868885)/'`
     *
     * @param {String} value String to be checked to see if it's a date.
     * @return {Boolean} True if it matches ISO or JSON formats, false if not a string or doesn't match.
     */
    isDateString: convert.isDateString,
    /**
     * Takes a Date object and converts it to a ISO 8601 formatted string
     * @param {Date} value Date to be formatted
     * @return {String} ISO 8601 formatted date string
     */
    toIsoStringFromDate: convert.toIsoStringFromDate,
    /**
     * Takes a Date object and returns it in JSON-string format: `'/Date(milliseconds)/'`
     * @param {Date} value Date to stringify
     * @return {String} JSON string: `'/Date(milliseconds)/'`
     */
    toJsonStringFromDate: convert.toJsonStringFromDate,
    /**
     * Takes a string and tests it to see if its an ISO 8601 string or a JSON-string.
     * If a match is found it is parsed into a Date object and returned, else the original value is returned.
     * @param {String} value String in the ISO 8601 format `'2012-08-28T08:30:00Z'` or JSON-string format `'/Date(milliseconds)/'`
     * @return {Date} Date object from string or original object if not convertable.
     */
    toDateFromString: convert.toDateFromString
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db252ZXJ0LmpzIl0sIm5hbWVzIjpbImNvbnZlcnQiLCJJQ1JNQ29tbW9uU0RLIiwiX19jbGFzcyIsInNldE9iamVjdCIsInRvQm9vbGVhbiIsImlzRGF0ZVN0cmluZyIsInRvSXNvU3RyaW5nRnJvbURhdGUiLCJ0b0pzb25TdHJpbmdGcm9tRGF0ZSIsInRvRGF0ZUZyb21TdHJpbmciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFzQkEsTUFBTUEsVUFBVUMsY0FBY0QsT0FBOUIsQyxDQXRCQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7Ozs7Ozs7QUFTQSxNQUFNRSxVQUFVLGVBQUtDLFNBQUwsQ0FBZSxlQUFmLEVBQWdDLDJCQUEyQjtBQUN6RTs7Ozs7QUFLQUMsZUFBV0osUUFBUUksU0FOc0Q7QUFPekU7Ozs7Ozs7OztBQVNBQyxrQkFBY0wsUUFBUUssWUFoQm1EO0FBaUJ6RTs7Ozs7QUFLQUMseUJBQXFCTixRQUFRTSxtQkF0QjRDO0FBdUJ6RTs7Ozs7QUFLQUMsMEJBQXNCUCxRQUFRTyxvQkE1QjJDO0FBNkJ6RTs7Ozs7O0FBTUFDLHNCQUFrQlIsUUFBUVE7QUFuQytDLEdBQTNELENBQWhCOztvQkFzQ2VOLE8iLCJmaWxlIjoiQ29udmVydC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5Db252ZXJ0XHJcbiAqIEBjbGFzc2Rlc2MgQ29udmVydCBwcm92aWRlcyBhIG51bWJlciBvZiB0eXBlIHRyYW5zZm9ybWF0aW9uIGZ1bmN0aW9ucy5cclxuICogQHNpbmdsZXRvblxyXG4gKi9cclxuaW1wb3J0IGxhbmcgZnJvbSAnZG9qby9fYmFzZS9sYW5nJztcclxuXHJcbmNvbnN0IGNvbnZlcnQgPSBJQ1JNQ29tbW9uU0RLLmNvbnZlcnQ7XHJcblxyXG5jb25zdCBfX2NsYXNzID0gbGFuZy5zZXRPYmplY3QoJ2FyZ29zLkNvbnZlcnQnLCAvKiogQGxlbmRzIGFyZ29zLkNvbnZlcnQgKi97XHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSBzdHJpbmcgYW5kIGNoZWNrcyB0byBzZWUgaWYgaXQgaXMgYHRydWVgIG9yIGBUYCwgZWxzZSByZXR1cm5zIGZhbHNlXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHZhbHVlIFN0cmluZyBib29sIHZhbHVlXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gUmV0dXJucyB0cnVlIGlmIHN0cmluZyBpcyBgdHJ1ZWAgb3IgYFRgLlxyXG4gICAqL1xyXG4gIHRvQm9vbGVhbjogY29udmVydC50b0Jvb2xlYW4sXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSBzdHJpbmcgYW5kIGNoZWNrcyB0byBzZWUgaWYgaXQgaXMgYW4gSVNPIGZvcm1hdHRlZCBkYXRlIG9yIGEgSlNPTi1zdHJpbmcgZGF0ZVxyXG4gICAqXHJcbiAgICogSVNPIERhdGU6IGAnMjAxMi0wOC0yOCdgIG9yIGAnMjAxMi0wNS0yOFQwODozMDowMFonYFxyXG4gICAqIEpTT04tc3RyaW5nOiBgJy9EYXRlKDEzNDYxODk4Njg4ODUpLydgXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsdWUgU3RyaW5nIHRvIGJlIGNoZWNrZWQgdG8gc2VlIGlmIGl0J3MgYSBkYXRlLlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgaXQgbWF0Y2hlcyBJU08gb3IgSlNPTiBmb3JtYXRzLCBmYWxzZSBpZiBub3QgYSBzdHJpbmcgb3IgZG9lc24ndCBtYXRjaC5cclxuICAgKi9cclxuICBpc0RhdGVTdHJpbmc6IGNvbnZlcnQuaXNEYXRlU3RyaW5nLFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGEgRGF0ZSBvYmplY3QgYW5kIGNvbnZlcnRzIGl0IHRvIGEgSVNPIDg2MDEgZm9ybWF0dGVkIHN0cmluZ1xyXG4gICAqIEBwYXJhbSB7RGF0ZX0gdmFsdWUgRGF0ZSB0byBiZSBmb3JtYXR0ZWRcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IElTTyA4NjAxIGZvcm1hdHRlZCBkYXRlIHN0cmluZ1xyXG4gICAqL1xyXG4gIHRvSXNvU3RyaW5nRnJvbURhdGU6IGNvbnZlcnQudG9Jc29TdHJpbmdGcm9tRGF0ZSxcclxuICAvKipcclxuICAgKiBUYWtlcyBhIERhdGUgb2JqZWN0IGFuZCByZXR1cm5zIGl0IGluIEpTT04tc3RyaW5nIGZvcm1hdDogYCcvRGF0ZShtaWxsaXNlY29uZHMpLydgXHJcbiAgICogQHBhcmFtIHtEYXRlfSB2YWx1ZSBEYXRlIHRvIHN0cmluZ2lmeVxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gSlNPTiBzdHJpbmc6IGAnL0RhdGUobWlsbGlzZWNvbmRzKS8nYFxyXG4gICAqL1xyXG4gIHRvSnNvblN0cmluZ0Zyb21EYXRlOiBjb252ZXJ0LnRvSnNvblN0cmluZ0Zyb21EYXRlLFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIGEgc3RyaW5nIGFuZCB0ZXN0cyBpdCB0byBzZWUgaWYgaXRzIGFuIElTTyA4NjAxIHN0cmluZyBvciBhIEpTT04tc3RyaW5nLlxyXG4gICAqIElmIGEgbWF0Y2ggaXMgZm91bmQgaXQgaXMgcGFyc2VkIGludG8gYSBEYXRlIG9iamVjdCBhbmQgcmV0dXJuZWQsIGVsc2UgdGhlIG9yaWdpbmFsIHZhbHVlIGlzIHJldHVybmVkLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWx1ZSBTdHJpbmcgaW4gdGhlIElTTyA4NjAxIGZvcm1hdCBgJzIwMTItMDgtMjhUMDg6MzA6MDBaJ2Agb3IgSlNPTi1zdHJpbmcgZm9ybWF0IGAnL0RhdGUobWlsbGlzZWNvbmRzKS8nYFxyXG4gICAqIEByZXR1cm4ge0RhdGV9IERhdGUgb2JqZWN0IGZyb20gc3RyaW5nIG9yIG9yaWdpbmFsIG9iamVjdCBpZiBub3QgY29udmVydGFibGUuXHJcbiAgICovXHJcbiAgdG9EYXRlRnJvbVN0cmluZzogY29udmVydC50b0RhdGVGcm9tU3RyaW5nLFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==