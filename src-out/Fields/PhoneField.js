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
   * @class argos.Fields.PhoneField
   * @classdesc The Phone field is a specialized {@link TextField TextField} that takes a string of numbers
   * and groups them into a phone number on blur or when setting a value directly the value
   * shown to the user gets passed through the
   * {@link #formatNumberForDisplay formatNumberForDisplay} function, while
   * {@link #getValue getValue} will still return an unformatted version.
   *
   * @example
   *     {
   *         name: 'SalesPotential',
   *         property: 'SalesPotential',
   *         label: this.salesPotentialText,
   *         type: 'decimal'
   *     }
   * @extends argos.Fields.TextField
   * @requires argos.FieldManager
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

  var control = (0, _declare2.default)('argos.Fields.PhoneField', [_TextField2.default], /** @lends argos.Fields.PhoneField# */{
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
      this.inherited(arguments);

      // temporarily added: http://code.google.com/p/android/issues/detail?id=14519
      this.set('inputValue', _Format2.default.phone(this.inputNode.value));
    },
    /**
     * Gets the value and strips out non-numbers and non-letter `x` before returning unless
     * the value starts with `+` in which it is returned unmodified.
     * @return {String}
     */
    getValue: function getValue() {
      var value = this.inherited(arguments);

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
      this.inherited(arguments);
    }
  });

  exports.default = _FieldManager2.default.register('phone', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvUGhvbmVGaWVsZC5qcyJdLCJuYW1lcyI6WyJjb250cm9sIiwiaW5wdXRUeXBlIiwiX29uQmx1ciIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInNldCIsInBob25lIiwiaW5wdXROb2RlIiwidmFsdWUiLCJnZXRWYWx1ZSIsInRlc3QiLCJhbHBoYVRvUGhvbmVOdW1lcmljIiwicmVwbGFjZSIsInNldFZhbHVlIiwidmFsIiwiaW5pdGlhbCIsIm9yaWdpbmFsVmFsdWUiLCJwcmV2aW91c1ZhbHVlIiwiX29uS2V5VXAiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF0QkE7Ozs7Ozs7Ozs7Ozs7OztBQXdDQSxNQUFNQSxVQUFVLHVCQUFRLHlCQUFSLEVBQW1DLHFCQUFuQyxFQUFnRCxzQ0FBc0M7QUFDcEc7Ozs7OztBQU1BQyxlQUFXLG1CQUFJLFFBQUosSUFBZ0IsS0FBaEIsR0FBd0IsTUFQaUU7O0FBU3BHOzs7QUFHQUMsYUFBUyxTQUFTQSxPQUFULEdBQW1CO0FBQzFCLFdBQUtDLFNBQUwsQ0FBZUMsU0FBZjs7QUFFQTtBQUNBLFdBQUtDLEdBQUwsQ0FBUyxZQUFULEVBQXVCLGlCQUFPQyxLQUFQLENBQWEsS0FBS0MsU0FBTCxDQUFlQyxLQUE1QixDQUF2QjtBQUNELEtBakJtRztBQWtCcEc7Ozs7O0FBS0FDLGNBQVUsU0FBU0EsUUFBVCxHQUFvQjtBQUM1QixVQUFJRCxRQUFRLEtBQUtMLFNBQUwsQ0FBZUMsU0FBZixDQUFaOztBQUVBLFVBQUksTUFBTU0sSUFBTixDQUFXRixLQUFYLENBQUosRUFBdUI7QUFDckIsZUFBT0EsS0FBUDtBQUNEOztBQUVEQSxjQUFRLGlCQUFPRyxtQkFBUCxDQUEyQkgsS0FBM0IsQ0FBUjs7QUFFQSxhQUFPQSxNQUFNSSxPQUFOLENBQWMsV0FBZCxFQUEyQixFQUEzQixDQUFQO0FBQ0QsS0FqQ21HO0FBa0NwRzs7Ozs7O0FBTUFDLGNBQVUsU0FBU0EsUUFBVCxDQUFrQkMsR0FBbEIsRUFBdUJDLE9BQXZCLEVBQWdDO0FBQ3hDLFVBQUlBLE9BQUosRUFBYTtBQUNYLGFBQUtDLGFBQUwsR0FBcUJGLEdBQXJCO0FBQ0Q7O0FBRUQsV0FBS0csYUFBTCxHQUFxQixLQUFyQjtBQUNBLFdBQUtaLEdBQUwsQ0FBUyxZQUFULEVBQXVCLGlCQUFPQyxLQUFQLENBQWFRLEdBQWIsS0FBcUIsRUFBNUM7QUFDRCxLQS9DbUc7QUFnRHBHOzs7O0FBSUFJLGNBQVUsU0FBU0EsUUFBVCxHQUFrQixRQUFVO0FBQ3BDOzs7O0FBSUEsV0FBS2YsU0FBTCxDQUFlQyxTQUFmO0FBQ0Q7QUExRG1HLEdBQXRGLENBQWhCOztvQkE2RGUsdUJBQWFlLFFBQWIsQ0FBc0IsT0FBdEIsRUFBK0JuQixPQUEvQixDIiwiZmlsZSI6IlBob25lRmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBoYXMgZnJvbSAnZG9qby9oYXMnO1xyXG5pbXBvcnQgRmllbGRNYW5hZ2VyIGZyb20gJy4uL0ZpZWxkTWFuYWdlcic7XHJcbmltcG9ydCBUZXh0RmllbGQgZnJvbSAnLi9UZXh0RmllbGQnO1xyXG5pbXBvcnQgZm9ybWF0IGZyb20gJy4uL0Zvcm1hdCc7XHJcbmltcG9ydCAnZG9qby9fYmFzZS9zbmlmZic7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkZpZWxkcy5QaG9uZUZpZWxkXHJcbiAqIEBjbGFzc2Rlc2MgVGhlIFBob25lIGZpZWxkIGlzIGEgc3BlY2lhbGl6ZWQge0BsaW5rIFRleHRGaWVsZCBUZXh0RmllbGR9IHRoYXQgdGFrZXMgYSBzdHJpbmcgb2YgbnVtYmVyc1xyXG4gKiBhbmQgZ3JvdXBzIHRoZW0gaW50byBhIHBob25lIG51bWJlciBvbiBibHVyIG9yIHdoZW4gc2V0dGluZyBhIHZhbHVlIGRpcmVjdGx5IHRoZSB2YWx1ZVxyXG4gKiBzaG93biB0byB0aGUgdXNlciBnZXRzIHBhc3NlZCB0aHJvdWdoIHRoZVxyXG4gKiB7QGxpbmsgI2Zvcm1hdE51bWJlckZvckRpc3BsYXkgZm9ybWF0TnVtYmVyRm9yRGlzcGxheX0gZnVuY3Rpb24sIHdoaWxlXHJcbiAqIHtAbGluayAjZ2V0VmFsdWUgZ2V0VmFsdWV9IHdpbGwgc3RpbGwgcmV0dXJuIGFuIHVuZm9ybWF0dGVkIHZlcnNpb24uXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqICAgICB7XHJcbiAqICAgICAgICAgbmFtZTogJ1NhbGVzUG90ZW50aWFsJyxcclxuICogICAgICAgICBwcm9wZXJ0eTogJ1NhbGVzUG90ZW50aWFsJyxcclxuICogICAgICAgICBsYWJlbDogdGhpcy5zYWxlc1BvdGVudGlhbFRleHQsXHJcbiAqICAgICAgICAgdHlwZTogJ2RlY2ltYWwnXHJcbiAqICAgICB9XHJcbiAqIEBleHRlbmRzIGFyZ29zLkZpZWxkcy5UZXh0RmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkTWFuYWdlclxyXG4gKi9cclxuY29uc3QgY29udHJvbCA9IGRlY2xhcmUoJ2FyZ29zLkZpZWxkcy5QaG9uZUZpZWxkJywgW1RleHRGaWVsZF0sIC8qKiBAbGVuZHMgYXJnb3MuRmllbGRzLlBob25lRmllbGQjICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFNldHMgdGhlIGA8aW5wdXQgdHlwZT1gIG9mIHRoZSBmaWVsZC5cclxuICAgKlxyXG4gICAqIEN1cnJlbnRseSBvbmx5IGlPUyBzdXBwb3J0cyBub24tbnVtYmVycyB3aGVuIGEgdGVsIGZpZWxkIGhhcyBhIGRlZmF1bHQgdmFsdWU6IFtCdWcgUmVwb3J0XShodHRwOi8vY29kZS5nb29nbGUuY29tL3AvYW5kcm9pZC9pc3N1ZXMvZGV0YWlsP2lkPTE5NzI0KS5cclxuICAgKi9cclxuICBpbnB1dFR5cGU6IGhhcygnc2FmYXJpJykgPyAndGVsJyA6ICd0ZXh0JyxcclxuXHJcbiAgLyoqXHJcbiAgICogRm9ybWF0cyB0aGUgZGlzcGxheWVkIHZhbHVlIChpbnB1dE5vZGUgdmFsdWUpIHVzaW5nIHtAbGluayBmb3JtYXQucGhvbmUgZm9ybWF0LnBob25lfS5cclxuICAgKi9cclxuICBfb25CbHVyOiBmdW5jdGlvbiBfb25CbHVyKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuXHJcbiAgICAvLyB0ZW1wb3JhcmlseSBhZGRlZDogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2FuZHJvaWQvaXNzdWVzL2RldGFpbD9pZD0xNDUxOVxyXG4gICAgdGhpcy5zZXQoJ2lucHV0VmFsdWUnLCBmb3JtYXQucGhvbmUodGhpcy5pbnB1dE5vZGUudmFsdWUpKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHZhbHVlIGFuZCBzdHJpcHMgb3V0IG5vbi1udW1iZXJzIGFuZCBub24tbGV0dGVyIGB4YCBiZWZvcmUgcmV0dXJuaW5nIHVubGVzc1xyXG4gICAqIHRoZSB2YWx1ZSBzdGFydHMgd2l0aCBgK2AgaW4gd2hpY2ggaXQgaXMgcmV0dXJuZWQgdW5tb2RpZmllZC5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgZ2V0VmFsdWU6IGZ1bmN0aW9uIGdldFZhbHVlKCkge1xyXG4gICAgbGV0IHZhbHVlID0gdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuXHJcbiAgICBpZiAoL15cXCsvLnRlc3QodmFsdWUpKSB7XHJcbiAgICAgIHJldHVybiB2YWx1ZTtcclxuICAgIH1cclxuXHJcbiAgICB2YWx1ZSA9IGZvcm1hdC5hbHBoYVRvUGhvbmVOdW1lcmljKHZhbHVlKTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWUucmVwbGFjZSgvW14wLTl4XS9pZywgJycpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgb3JpZ2luYWwgdmFsdWUgaWYgaW5pdGlhbCBpcyB0cnVlIGFuZCBzZXRzIHRoZSBpbnB1dCB2YWx1ZSB0byB0aGUgZm9ybWF0dGVkXHJcbiAgICogdmFsdWUgdXNpbmcge0BsaW5rIGZvcm1hdC5waG9uZSBmb3JtYXQucGhvbmV9LlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nL051bWJlcn0gdmFsIFN0cmluZyB0byBzZXRcclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGluaXRpYWwgVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdGhlIG9yaWdpbmFsL2NsZWFuIHZhbHVlLlxyXG4gICAqL1xyXG4gIHNldFZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2YWwsIGluaXRpYWwpIHtcclxuICAgIGlmIChpbml0aWFsKSB7XHJcbiAgICAgIHRoaXMub3JpZ2luYWxWYWx1ZSA9IHZhbDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnByZXZpb3VzVmFsdWUgPSBmYWxzZTtcclxuICAgIHRoaXMuc2V0KCdpbnB1dFZhbHVlJywgZm9ybWF0LnBob25lKHZhbCkgfHwgJycpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ3VycmVudGx5IG9ubHkgY2FsbHMgcGFyZW50IGltcGxlbWVudGF0aW9uIGR1ZSB0byBhbiBbQW5kcm9pZCBCdWddKGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9hbmRyb2lkL2lzc3Vlcy9kZXRhaWw/aWQ9MTQ1MTkpLlxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBLZXl1cCBldmVudFxyXG4gICAqL1xyXG4gIF9vbktleVVwOiBmdW5jdGlvbiBfb25LZXlVcCgvKiBldnQqLykge1xyXG4gICAgLypcclxuICAgIC8vIHRlbXBvcmFyaWx5IHJlbW92ZWQ6IGh0dHA6Ly9jb2RlLmdvb2dsZS5jb20vcC9hbmRyb2lkL2lzc3Vlcy9kZXRhaWw/aWQ9MTQ1MTlcclxuICAgIHRoaXMuc2V0KCdpbnB1dFZhbHVlJywgZm9ybWF0LnBob25lKHRoaXMuaW5wdXROb2RlLnZhbHVlLCB0aGlzLmdldFZhbHVlKCkpKTtcclxuICAgICovXHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGRNYW5hZ2VyLnJlZ2lzdGVyKCdwaG9uZScsIGNvbnRyb2wpO1xyXG4iXX0=