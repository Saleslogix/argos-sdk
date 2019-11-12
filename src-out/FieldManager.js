define('argos/FieldManager', ['module', 'exports', 'dojo/_base/lang'], function (module, exports, _lang) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lang2 = _interopRequireDefault(_lang);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var store = {};

  /**
   * @class argos.FieldManager
   * @classdesc Field Manager is a registry for field types that enables the Edit View layouts to
   * simply define `type: 'myFieldType'`.
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

  var __class = _lang2.default.setObject('argos.FieldManager', /** @lends argos.FieldManager */{
    /**
     * @property {Object}
     * The type map that translates string type names to constructor functions
     */
    types: store,
    /**
     * Registers a field type by providing a unique name and the constructor to be called
     * @param {String} name Unique string name of field, will be what is used in Edit View layouts.
     * @param {Function} ctor Constructor function of field
     */
    register: function register(name, ctor) {
      store[name] = ctor;
      return ctor;
    },
    /**
     * Retrieves a constructor for the given field name
     * @param name Unique name of field
     * @return {Function} Constructor for the given field type
     */
    get: function get(name) {
      return store[name];
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9GaWVsZE1hbmFnZXIuanMiXSwibmFtZXMiOlsic3RvcmUiLCJfX2NsYXNzIiwic2V0T2JqZWN0IiwidHlwZXMiLCJyZWdpc3RlciIsIm5hbWUiLCJjdG9yIiwiZ2V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBaUJBLE1BQU1BLFFBQVEsRUFBZDs7QUFFQTs7Ozs7O0FBbkJBOzs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsTUFBTUMsVUFBVSxlQUFLQyxTQUFMLENBQWUsb0JBQWYsRUFBcUMsZ0NBQWdDO0FBQ25GOzs7O0FBSUFDLFdBQU9ILEtBTDRFO0FBTW5GOzs7OztBQUtBSSxjQUFVLFNBQVNBLFFBQVQsQ0FBa0JDLElBQWxCLEVBQXdCQyxJQUF4QixFQUE4QjtBQUN0Q04sWUFBTUssSUFBTixJQUFjQyxJQUFkO0FBQ0EsYUFBT0EsSUFBUDtBQUNELEtBZGtGO0FBZW5GOzs7OztBQUtBQyxTQUFLLFNBQVNBLEdBQVQsQ0FBYUYsSUFBYixFQUFtQjtBQUN0QixhQUFPTCxNQUFNSyxJQUFOLENBQVA7QUFDRDtBQXRCa0YsR0FBckUsQ0FBaEI7O29CQXlCZUosTyIsImZpbGUiOiJGaWVsZE1hbmFnZXIuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcblxyXG5jb25zdCBzdG9yZSA9IHt9O1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5GaWVsZE1hbmFnZXJcclxuICogQGNsYXNzZGVzYyBGaWVsZCBNYW5hZ2VyIGlzIGEgcmVnaXN0cnkgZm9yIGZpZWxkIHR5cGVzIHRoYXQgZW5hYmxlcyB0aGUgRWRpdCBWaWV3IGxheW91dHMgdG9cclxuICogc2ltcGx5IGRlZmluZSBgdHlwZTogJ215RmllbGRUeXBlJ2AuXHJcbiAqIEBzaW5nbGV0b25cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBsYW5nLnNldE9iamVjdCgnYXJnb3MuRmllbGRNYW5hZ2VyJywgLyoqIEBsZW5kcyBhcmdvcy5GaWVsZE1hbmFnZXIgKi97XHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIHR5cGUgbWFwIHRoYXQgdHJhbnNsYXRlcyBzdHJpbmcgdHlwZSBuYW1lcyB0byBjb25zdHJ1Y3RvciBmdW5jdGlvbnNcclxuICAgKi9cclxuICB0eXBlczogc3RvcmUsXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXJzIGEgZmllbGQgdHlwZSBieSBwcm92aWRpbmcgYSB1bmlxdWUgbmFtZSBhbmQgdGhlIGNvbnN0cnVjdG9yIHRvIGJlIGNhbGxlZFxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIFVuaXF1ZSBzdHJpbmcgbmFtZSBvZiBmaWVsZCwgd2lsbCBiZSB3aGF0IGlzIHVzZWQgaW4gRWRpdCBWaWV3IGxheW91dHMuXHJcbiAgICogQHBhcmFtIHtGdW5jdGlvbn0gY3RvciBDb25zdHJ1Y3RvciBmdW5jdGlvbiBvZiBmaWVsZFxyXG4gICAqL1xyXG4gIHJlZ2lzdGVyOiBmdW5jdGlvbiByZWdpc3RlcihuYW1lLCBjdG9yKSB7XHJcbiAgICBzdG9yZVtuYW1lXSA9IGN0b3I7XHJcbiAgICByZXR1cm4gY3RvcjtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyBhIGNvbnN0cnVjdG9yIGZvciB0aGUgZ2l2ZW4gZmllbGQgbmFtZVxyXG4gICAqIEBwYXJhbSBuYW1lIFVuaXF1ZSBuYW1lIG9mIGZpZWxkXHJcbiAgICogQHJldHVybiB7RnVuY3Rpb259IENvbnN0cnVjdG9yIGZvciB0aGUgZ2l2ZW4gZmllbGQgdHlwZVxyXG4gICAqL1xyXG4gIGdldDogZnVuY3Rpb24gZ2V0KG5hbWUpIHtcclxuICAgIHJldHVybiBzdG9yZVtuYW1lXTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==