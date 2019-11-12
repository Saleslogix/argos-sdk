define('argos/Groups/_GroupBySection', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang'], function (module, exports, _declare, _lang) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Groups._GroupSection
   */
  /* Copyright 2017 Infor
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

  var __class = (0, _declare2.default)('argos.Groups._GroupBySection', null, /** @lends argos.Groups._GroupSection# */{
    /**
     * @property {String}
     * The unique (within the current form) name of the field
     */
    name: null,
    /**
     * @property {String}
     * Signifies that the field should always be included when the form calls {@link Edit#getValues getValues}.
     */
    displayName: null,
    /**
     * @property {String}
     * The SData property that the field will be bound to.
     */
    groupByProperty: null,
    sortDirection: 'desc',
    sections: null,
    constructor: function constructor(o) {
      _lang2.default.mixin(this, o);
    },
    init: function init() {},
    getGroupSection: function getGroupSection() /* entry*/{},
    getOrderByQuery: function getOrderByQuery() {
      return this.groupByProperty + ' ' + this.sortDirection;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Hcm91cHMvX0dyb3VwQnlTZWN0aW9uLmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJuYW1lIiwiZGlzcGxheU5hbWUiLCJncm91cEJ5UHJvcGVydHkiLCJzb3J0RGlyZWN0aW9uIiwic2VjdGlvbnMiLCJjb25zdHJ1Y3RvciIsIm8iLCJtaXhpbiIsImluaXQiLCJnZXRHcm91cFNlY3Rpb24iLCJnZXRPcmRlckJ5UXVlcnkiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTs7O0FBbEJBOzs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsTUFBTUEsVUFBVSx1QkFBUSw4QkFBUixFQUF3QyxJQUF4QyxFQUE4Qyx5Q0FBeUM7QUFDckc7Ozs7QUFJQUMsVUFBTSxJQUwrRjtBQU1yRzs7OztBQUlBQyxpQkFBYSxJQVZ3RjtBQVdyRzs7OztBQUlBQyxxQkFBaUIsSUFmb0Y7QUFnQnJHQyxtQkFBZSxNQWhCc0Y7QUFpQnJHQyxjQUFVLElBakIyRjtBQWtCckdDLGlCQUFhLFNBQVNBLFdBQVQsQ0FBcUJDLENBQXJCLEVBQXdCO0FBQ25DLHFCQUFLQyxLQUFMLENBQVcsSUFBWCxFQUFpQkQsQ0FBakI7QUFDRCxLQXBCb0c7QUFxQnJHRSxVQUFNLFNBQVNBLElBQVQsR0FBZ0IsQ0FBRSxDQXJCNkU7QUFzQnJHQyxxQkFBaUIsU0FBU0EsZUFBVCxHQUF5QixVQUFZLENBQUUsQ0F0QjZDO0FBdUJyR0MscUJBQWlCLFNBQVNBLGVBQVQsR0FBMkI7QUFDMUMsYUFBVSxLQUFLUixlQUFmLFNBQWtDLEtBQUtDLGFBQXZDO0FBQ0Q7QUF6Qm9HLEdBQXZGLENBQWhCOztvQkE0QmVKLE8iLCJmaWxlIjoiX0dyb3VwQnlTZWN0aW9uLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IGxhbmcgZnJvbSAnZG9qby9fYmFzZS9sYW5nJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuR3JvdXBzLl9Hcm91cFNlY3Rpb25cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5Hcm91cHMuX0dyb3VwQnlTZWN0aW9uJywgbnVsbCwgLyoqIEBsZW5kcyBhcmdvcy5Hcm91cHMuX0dyb3VwU2VjdGlvbiMgKi97XHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHVuaXF1ZSAod2l0aGluIHRoZSBjdXJyZW50IGZvcm0pIG5hbWUgb2YgdGhlIGZpZWxkXHJcbiAgICovXHJcbiAgbmFtZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBTaWduaWZpZXMgdGhhdCB0aGUgZmllbGQgc2hvdWxkIGFsd2F5cyBiZSBpbmNsdWRlZCB3aGVuIHRoZSBmb3JtIGNhbGxzIHtAbGluayBFZGl0I2dldFZhbHVlcyBnZXRWYWx1ZXN9LlxyXG4gICAqL1xyXG4gIGRpc3BsYXlOYW1lOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSBTRGF0YSBwcm9wZXJ0eSB0aGF0IHRoZSBmaWVsZCB3aWxsIGJlIGJvdW5kIHRvLlxyXG4gICAqL1xyXG4gIGdyb3VwQnlQcm9wZXJ0eTogbnVsbCxcclxuICBzb3J0RGlyZWN0aW9uOiAnZGVzYycsXHJcbiAgc2VjdGlvbnM6IG51bGwsXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKG8pIHtcclxuICAgIGxhbmcubWl4aW4odGhpcywgbyk7XHJcbiAgfSxcclxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge30sXHJcbiAgZ2V0R3JvdXBTZWN0aW9uOiBmdW5jdGlvbiBnZXRHcm91cFNlY3Rpb24oLyogZW50cnkqLykge30sXHJcbiAgZ2V0T3JkZXJCeVF1ZXJ5OiBmdW5jdGlvbiBnZXRPcmRlckJ5UXVlcnkoKSB7XHJcbiAgICByZXR1cm4gYCR7dGhpcy5ncm91cEJ5UHJvcGVydHl9ICR7dGhpcy5zb3J0RGlyZWN0aW9ufWA7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=