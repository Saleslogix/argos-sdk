define('argos/Utility', ['module', 'exports', 'dojo/_base/lang'], function (module, exports, _lang) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lang2 = _interopRequireDefault(_lang);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var util = ICRMCommonSDK.utility;

  /**
   * @class argos.Utility
   * @classdesc Utility provides functions that are more javascript enhancers than application related code.
   * @singleton
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

  var __class = _lang2.default.setObject('argos.Utility', /** @lends argos.Utility */{
    /**
     * Replaces a single `"` with two `""` for proper SData query expressions.
     * @param {String} searchQuery Search expression to be escaped.
     * @return {String}
     */
    escapeSearchQuery: util.escapeSearchQuery,
    memoize: util.memoize,
    debounce: util.debounce,
    getValue: util.getValue,
    setValue: util.setValue,
    expand: util.expand,
    roundNumberTo: util.roundNumberTo,
    /**
     * Utility function to join fields within a Simplate template.
     */
    joinFields: util.joinFields,
    /**
     * Sanitizes an Object so that JSON.stringify will work without errors by discarding non-stringable keys.
     * @param {Object} obj Object to be cleansed of non-stringify friendly keys/values.
     * @return {Object} Object ready to be JSON.stringified.
     */
    sanitizeForJson: util.sanitizeForJson
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9VdGlsaXR5LmpzIl0sIm5hbWVzIjpbInV0aWwiLCJJQ1JNQ29tbW9uU0RLIiwidXRpbGl0eSIsIl9fY2xhc3MiLCJzZXRPYmplY3QiLCJlc2NhcGVTZWFyY2hRdWVyeSIsIm1lbW9pemUiLCJkZWJvdW5jZSIsImdldFZhbHVlIiwic2V0VmFsdWUiLCJleHBhbmQiLCJyb3VuZE51bWJlclRvIiwiam9pbkZpZWxkcyIsInNhbml0aXplRm9ySnNvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQWlCQSxNQUFNQSxPQUFPQyxjQUFjQyxPQUEzQjs7QUFFQTs7Ozs7QUFuQkE7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxNQUFNQyxVQUFVLGVBQUtDLFNBQUwsQ0FBZSxlQUFmLEVBQWdDLDJCQUEyQjtBQUN6RTs7Ozs7QUFLQUMsdUJBQW1CTCxLQUFLSyxpQkFOaUQ7QUFPekVDLGFBQVNOLEtBQUtNLE9BUDJEO0FBUXpFQyxjQUFVUCxLQUFLTyxRQVIwRDtBQVN6RUMsY0FBVVIsS0FBS1EsUUFUMEQ7QUFVekVDLGNBQVVULEtBQUtTLFFBVjBEO0FBV3pFQyxZQUFRVixLQUFLVSxNQVg0RDtBQVl6RUMsbUJBQWVYLEtBQUtXLGFBWnFEO0FBYXpFOzs7QUFHQUMsZ0JBQVlaLEtBQUtZLFVBaEJ3RDtBQWlCekU7Ozs7O0FBS0FDLHFCQUFpQmIsS0FBS2E7QUF0Qm1ELEdBQTNELENBQWhCOztvQkF5QmVWLE8iLCJmaWxlIjoiVXRpbGl0eS5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGxhbmcgZnJvbSAnZG9qby9fYmFzZS9sYW5nJztcclxuXHJcbmNvbnN0IHV0aWwgPSBJQ1JNQ29tbW9uU0RLLnV0aWxpdHk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLlV0aWxpdHlcclxuICogQGNsYXNzZGVzYyBVdGlsaXR5IHByb3ZpZGVzIGZ1bmN0aW9ucyB0aGF0IGFyZSBtb3JlIGphdmFzY3JpcHQgZW5oYW5jZXJzIHRoYW4gYXBwbGljYXRpb24gcmVsYXRlZCBjb2RlLlxyXG4gKiBAc2luZ2xldG9uXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gbGFuZy5zZXRPYmplY3QoJ2FyZ29zLlV0aWxpdHknLCAvKiogQGxlbmRzIGFyZ29zLlV0aWxpdHkgKi97XHJcbiAgLyoqXHJcbiAgICogUmVwbGFjZXMgYSBzaW5nbGUgYFwiYCB3aXRoIHR3byBgXCJcImAgZm9yIHByb3BlciBTRGF0YSBxdWVyeSBleHByZXNzaW9ucy5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoUXVlcnkgU2VhcmNoIGV4cHJlc3Npb24gdG8gYmUgZXNjYXBlZC5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgZXNjYXBlU2VhcmNoUXVlcnk6IHV0aWwuZXNjYXBlU2VhcmNoUXVlcnksXHJcbiAgbWVtb2l6ZTogdXRpbC5tZW1vaXplLFxyXG4gIGRlYm91bmNlOiB1dGlsLmRlYm91bmNlLFxyXG4gIGdldFZhbHVlOiB1dGlsLmdldFZhbHVlLFxyXG4gIHNldFZhbHVlOiB1dGlsLnNldFZhbHVlLFxyXG4gIGV4cGFuZDogdXRpbC5leHBhbmQsXHJcbiAgcm91bmROdW1iZXJUbzogdXRpbC5yb3VuZE51bWJlclRvLFxyXG4gIC8qKlxyXG4gICAqIFV0aWxpdHkgZnVuY3Rpb24gdG8gam9pbiBmaWVsZHMgd2l0aGluIGEgU2ltcGxhdGUgdGVtcGxhdGUuXHJcbiAgICovXHJcbiAgam9pbkZpZWxkczogdXRpbC5qb2luRmllbGRzLFxyXG4gIC8qKlxyXG4gICAqIFNhbml0aXplcyBhbiBPYmplY3Qgc28gdGhhdCBKU09OLnN0cmluZ2lmeSB3aWxsIHdvcmsgd2l0aG91dCBlcnJvcnMgYnkgZGlzY2FyZGluZyBub24tc3RyaW5nYWJsZSBrZXlzLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvYmogT2JqZWN0IHRvIGJlIGNsZWFuc2VkIG9mIG5vbi1zdHJpbmdpZnkgZnJpZW5kbHkga2V5cy92YWx1ZXMuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBPYmplY3QgcmVhZHkgdG8gYmUgSlNPTi5zdHJpbmdpZmllZC5cclxuICAgKi9cclxuICBzYW5pdGl6ZUZvckpzb246IHV0aWwuc2FuaXRpemVGb3JKc29uLFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==