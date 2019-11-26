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
   * @class argos.Fields.DecimalField
   * @classdesc The Decimal Field is used for inputting numbers and extends {@link TextField TextField} with:
   *
   * * hides the clear (x) button;
   * * when setting a value, it converts the decimal and thousands group separator to the localized versions; and
   * * when getting a value, it back-converts the localized punctuation into the en-US format and converts the result into a float (Number).
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

  var control = (0, _declare2.default)('argos.Fields.DecimalField', [_TextField2.default], /** @lends argos.Fields.DecimalField# */{
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
      value = value.replace(Mobile.CultureInfo.numberFormat.currencyGroupSeparator, '').replace(Mobile.CultureInfo.numberFormat.numberGroupSeparator, '').replace(Mobile.CultureInfo.numberFormat.currencyDecimalSeparator, '.').replace(Mobile.CultureInfo.numberFormat.numberDecimalSeparator, '.');
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvRGVjaW1hbEZpZWxkLmpzIl0sIm5hbWVzIjpbImNvbnRyb2wiLCJwcmVjaXNpb24iLCJlbmFibGVDbGVhckJ1dHRvbiIsInNldFZhbHVlIiwidmFsIiwicGVyYyIsImdldFByZWNpc2lvbiIsIm5ld1ZhbCIsInJvdW5kTnVtYmVyVG8iLCJwYXJzZUZsb2F0IiwidG9GaXhlZCIsImlzTmFOIiwiTW9iaWxlIiwiQ3VsdHVyZUluZm8iLCJudW1iZXJGb3JtYXQiLCJjdXJyZW5jeURlY2ltYWxTZXBhcmF0b3IiLCJwYXJzZUludCIsInN1YnN0ciIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsImdldFZhbHVlIiwidmFsdWUiLCJyZXBsYWNlIiwiY3VycmVuY3lHcm91cFNlcGFyYXRvciIsIm51bWJlckdyb3VwU2VwYXJhdG9yIiwibnVtYmVyRGVjaW1hbFNlcGFyYXRvciIsImN1cnJlbmN5RGVjaW1hbERpZ2l0cyIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFwQkE7Ozs7Ozs7Ozs7Ozs7OztBQXNDQSxNQUFNQSxVQUFVLHVCQUFRLDJCQUFSLEVBQXFDLHFCQUFyQyxFQUFrRCx3Q0FBd0M7QUFDeEc7Ozs7QUFJQUMsZUFBVyxDQUw2RjtBQU14Rzs7OztBQUlBQyx1QkFBbUIsS0FWcUY7QUFXeEc7Ozs7OztBQU1BQyxjQUFVLFNBQVNBLFFBQVQsQ0FBa0JDLEdBQWxCLEVBQXVCO0FBQy9CLFVBQU1DLE9BQU8sS0FBS0MsWUFBTCxFQUFiO0FBQ0EsVUFBSUMsU0FBUyxrQkFBUUMsYUFBUixDQUFzQkMsV0FBV0wsR0FBWCxDQUF0QixFQUF1Q0MsSUFBdkMsQ0FBYjtBQUNBRSxlQUFTQSxPQUFPRyxPQUFQLENBQWVMLElBQWYsQ0FBVDtBQUNBLFVBQUlNLE1BQU1KLE1BQU4sQ0FBSixFQUFtQjtBQUNqQixZQUFJRixTQUFTLENBQWIsRUFBZ0I7QUFDZEUsbUJBQVMsR0FBVDtBQUNELFNBRkQsTUFFTztBQUNMQSwwQkFBYUssT0FBT0MsV0FBUCxDQUFtQkMsWUFBbkIsQ0FBZ0NDLHdCQUFoQyxJQUE0RCxHQUF6RTtBQUNEO0FBQ0YsT0FORCxNQU1PO0FBQ0wsWUFBSVYsU0FBUyxDQUFiLEVBQWdCO0FBQ2RFLHdCQUFZUyxTQUFTVCxNQUFULEVBQWlCLEVBQWpCLENBQVosSUFBbUNLLE9BQU9DLFdBQVAsQ0FBbUJDLFlBQW5CLENBQWdDQyx3QkFBaEMsSUFBNEQsR0FBL0YsSUFBcUdSLE9BQU9VLE1BQVAsQ0FBYyxDQUFDWixJQUFmLENBQXJHO0FBQ0Q7QUFDRjtBQUNELFdBQUthLFNBQUwsQ0FBZWYsUUFBZixFQUF5QmdCLFNBQXpCLEVBQW9DLENBQUNaLE1BQUQsQ0FBcEM7QUFDRCxLQWpDdUc7QUFrQ3hHOzs7OztBQUtBYSxjQUFVLFNBQVNBLFFBQVQsR0FBb0I7QUFDNUIsVUFBSUMsUUFBUSxLQUFLSCxTQUFMLENBQWVFLFFBQWYsRUFBeUJELFNBQXpCLENBQVo7QUFDQTtBQUNBRSxjQUFRQSxNQUNMQyxPQURLLENBQ0dWLE9BQU9DLFdBQVAsQ0FBbUJDLFlBQW5CLENBQWdDUyxzQkFEbkMsRUFDMkQsRUFEM0QsRUFFTEQsT0FGSyxDQUVHVixPQUFPQyxXQUFQLENBQW1CQyxZQUFuQixDQUFnQ1Usb0JBRm5DLEVBRXlELEVBRnpELEVBR0xGLE9BSEssQ0FHR1YsT0FBT0MsV0FBUCxDQUFtQkMsWUFBbkIsQ0FBZ0NDLHdCQUhuQyxFQUc2RCxHQUg3RCxFQUlMTyxPQUpLLENBSUdWLE9BQU9DLFdBQVAsQ0FBbUJDLFlBQW5CLENBQWdDVyxzQkFKbkMsRUFJMkQsR0FKM0QsQ0FBUjtBQUtBLGFBQU9oQixXQUFXWSxLQUFYLENBQVA7QUFDRCxLQWhEdUc7QUFpRHhHOzs7O0FBSUFmLGtCQUFjLFNBQVNBLFlBQVQsR0FBd0I7QUFDcEMsVUFBSUQsYUFBSjtBQUNBLFVBQUksS0FBS0osU0FBTCxLQUFtQixDQUF2QixFQUEwQjtBQUN4QkksZUFBTyxLQUFLSixTQUFaO0FBQ0QsT0FGRCxNQUVPO0FBQ0xJLGVBQU8sS0FBS0osU0FBTCxJQUFrQlcsT0FBT0MsV0FBUCxDQUFtQkMsWUFBbkIsQ0FBZ0NZLHFCQUF6RDtBQUNEO0FBQ0QsYUFBT3JCLElBQVA7QUFDRDtBQTdEdUcsR0FBMUYsQ0FBaEI7O29CQWdFZSx1QkFBYXNCLFFBQWIsQ0FBc0IsU0FBdEIsRUFBaUMzQixPQUFqQyxDIiwiZmlsZSI6IkRlY2ltYWxGaWVsZC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IFRleHRGaWVsZCBmcm9tICcuL1RleHRGaWVsZCc7XHJcbmltcG9ydCBGaWVsZE1hbmFnZXIgZnJvbSAnLi4vRmllbGRNYW5hZ2VyJztcclxuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi4vVXRpbGl0eSc7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkZpZWxkcy5EZWNpbWFsRmllbGRcclxuICogQGNsYXNzZGVzYyBUaGUgRGVjaW1hbCBGaWVsZCBpcyB1c2VkIGZvciBpbnB1dHRpbmcgbnVtYmVycyBhbmQgZXh0ZW5kcyB7QGxpbmsgVGV4dEZpZWxkIFRleHRGaWVsZH0gd2l0aDpcclxuICpcclxuICogKiBoaWRlcyB0aGUgY2xlYXIgKHgpIGJ1dHRvbjtcclxuICogKiB3aGVuIHNldHRpbmcgYSB2YWx1ZSwgaXQgY29udmVydHMgdGhlIGRlY2ltYWwgYW5kIHRob3VzYW5kcyBncm91cCBzZXBhcmF0b3IgdG8gdGhlIGxvY2FsaXplZCB2ZXJzaW9uczsgYW5kXHJcbiAqICogd2hlbiBnZXR0aW5nIGEgdmFsdWUsIGl0IGJhY2stY29udmVydHMgdGhlIGxvY2FsaXplZCBwdW5jdHVhdGlvbiBpbnRvIHRoZSBlbi1VUyBmb3JtYXQgYW5kIGNvbnZlcnRzIHRoZSByZXN1bHQgaW50byBhIGZsb2F0IChOdW1iZXIpLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiAgICAge1xyXG4gKiAgICAgICAgIG5hbWU6ICdTYWxlc1BvdGVudGlhbCcsXHJcbiAqICAgICAgICAgcHJvcGVydHk6ICdTYWxlc1BvdGVudGlhbCcsXHJcbiAqICAgICAgICAgbGFiZWw6IHRoaXMuc2FsZXNQb3RlbnRpYWxUZXh0LFxyXG4gKiAgICAgICAgIHR5cGU6ICdkZWNpbWFsJ1xyXG4gKiAgICAgfVxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5GaWVsZHMuVGV4dEZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZE1hbmFnZXJcclxuICovXHJcbmNvbnN0IGNvbnRyb2wgPSBkZWNsYXJlKCdhcmdvcy5GaWVsZHMuRGVjaW1hbEZpZWxkJywgW1RleHRGaWVsZF0sIC8qKiBAbGVuZHMgYXJnb3MuRmllbGRzLkRlY2ltYWxGaWVsZCMgKi97XHJcbiAgLyoqXHJcbiAgICogQGNmZyB7TnVtYmVyfVxyXG4gICAqIERlZmluZXMgaG93IG1hbnkgZGVjaW1hbCBwbGFjZXMgdG8gZm9ybWF0IHdoZW4gc2V0dGluZyB0aGUgdmFsdWUuXHJcbiAgICovXHJcbiAgcHJlY2lzaW9uOiAyLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBEaXNhYmxlcyB0aGUgZGlzcGxheSBvZiB0aGUgY2xlYXIgKHgpIGJ1dHRvbiBpbmhlcml0ZWQgZnJvbSB7QGxpbmsgVGV4dEZpZWxkIFRleHRGaWVsZH0uXHJcbiAgICovXHJcbiAgZW5hYmxlQ2xlYXJCdXR0b246IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEJlZm9yZSBjYWxsaW5nIHRoZSB7QGxpbmsgVGV4dEZpZWxkI3NldFZhbHVlIHBhcmVudCBpbXBsZW1lbnRhdGlvbn0gaXQgcGFyc2VzIHRoZSB2YWx1ZVxyXG4gICAqIHZpYSBgcGFyc2VGbG9hdGAsIHRyaW1zIHRoZSBkZWNpbWFsIHBsYWNlIGFuZCB0aGVuIGFwcGxpZXMgbG9jYWxpemF0aW9uIGZvciB0aGUgZGVjaW1hbFxyXG4gICAqIGFuZCB0aG91c2FuZHMgcHVuY3R1YXRpb24uXHJcbiAgICogQHBhcmFtIHtOdW1iZXIvU3RyaW5nfSB2YWwgVmFsdWUgdG8gYmUgc2V0XHJcbiAgICovXHJcbiAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKHZhbCkge1xyXG4gICAgY29uc3QgcGVyYyA9IHRoaXMuZ2V0UHJlY2lzaW9uKCk7XHJcbiAgICBsZXQgbmV3VmFsID0gVXRpbGl0eS5yb3VuZE51bWJlclRvKHBhcnNlRmxvYXQodmFsKSwgcGVyYyk7XHJcbiAgICBuZXdWYWwgPSBuZXdWYWwudG9GaXhlZChwZXJjKTtcclxuICAgIGlmIChpc05hTihuZXdWYWwpKSB7XHJcbiAgICAgIGlmIChwZXJjID09PSAwKSB7XHJcbiAgICAgICAgbmV3VmFsID0gJzAnO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG5ld1ZhbCA9IGAwJHtNb2JpbGUuQ3VsdHVyZUluZm8ubnVtYmVyRm9ybWF0LmN1cnJlbmN5RGVjaW1hbFNlcGFyYXRvciB8fCAnLid9MDBgO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAocGVyYyAhPT0gMCkge1xyXG4gICAgICAgIG5ld1ZhbCA9IGAke3BhcnNlSW50KG5ld1ZhbCwgMTApfSR7TW9iaWxlLkN1bHR1cmVJbmZvLm51bWJlckZvcm1hdC5jdXJyZW5jeURlY2ltYWxTZXBhcmF0b3IgfHwgJy4nfSR7bmV3VmFsLnN1YnN0cigtcGVyYyl9YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5pbmhlcml0ZWQoc2V0VmFsdWUsIGFyZ3VtZW50cywgW25ld1ZhbF0pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIHRoZSB2YWx1ZSBmcm9tIHRoZSB7QGxpbmsgVGV4dEZpZWxkI2dldFZhbHVlIHBhcmVudCBpbXBsZW1lbnRhdGlvbn0gYnV0IGJlZm9yZVxyXG4gICAqIHJldHVybmluZyBpdCBkZS1jb252ZXJ0cyB0aGUgcHVuY3R1YXRpb24gYmFjayB0byBgZW4tVVNgIGZvcm1hdC5cclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0VmFsdWU6IGZ1bmN0aW9uIGdldFZhbHVlKCkge1xyXG4gICAgbGV0IHZhbHVlID0gdGhpcy5pbmhlcml0ZWQoZ2V0VmFsdWUsIGFyZ3VtZW50cyk7XHJcbiAgICAvLyBTRGF0YSAoYW5kIG90aGVyIGZ1bmN0aW9ucykgZXhwZWN0IEFtZXJpY2FuIGZvcm1hdHRlZCBudW1iZXJzXHJcbiAgICB2YWx1ZSA9IHZhbHVlXHJcbiAgICAgIC5yZXBsYWNlKE1vYmlsZS5DdWx0dXJlSW5mby5udW1iZXJGb3JtYXQuY3VycmVuY3lHcm91cFNlcGFyYXRvciwgJycpXHJcbiAgICAgIC5yZXBsYWNlKE1vYmlsZS5DdWx0dXJlSW5mby5udW1iZXJGb3JtYXQubnVtYmVyR3JvdXBTZXBhcmF0b3IsICcnKVxyXG4gICAgICAucmVwbGFjZShNb2JpbGUuQ3VsdHVyZUluZm8ubnVtYmVyRm9ybWF0LmN1cnJlbmN5RGVjaW1hbFNlcGFyYXRvciwgJy4nKVxyXG4gICAgICAucmVwbGFjZShNb2JpbGUuQ3VsdHVyZUluZm8ubnVtYmVyRm9ybWF0Lm51bWJlckRlY2ltYWxTZXBhcmF0b3IsICcuJyk7XHJcbiAgICByZXR1cm4gcGFyc2VGbG9hdCh2YWx1ZSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXRyaWV2ZXMgdGhlIHByZWNpc2lvbiB0aGUgdmFsdWUgd2lsbCBiZSBmb3JtYXRlZCBhbmQgcm9uZGVkIHRvLlxyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBnZXRQcmVjaXNpb246IGZ1bmN0aW9uIGdldFByZWNpc2lvbigpIHtcclxuICAgIGxldCBwZXJjO1xyXG4gICAgaWYgKHRoaXMucHJlY2lzaW9uID09PSAwKSB7XHJcbiAgICAgIHBlcmMgPSB0aGlzLnByZWNpc2lvbjtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBlcmMgPSB0aGlzLnByZWNpc2lvbiB8fCBNb2JpbGUuQ3VsdHVyZUluZm8ubnVtYmVyRm9ybWF0LmN1cnJlbmN5RGVjaW1hbERpZ2l0cztcclxuICAgIH1cclxuICAgIHJldHVybiBwZXJjO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGRNYW5hZ2VyLnJlZ2lzdGVyKCdkZWNpbWFsJywgY29udHJvbCk7XHJcbiJdfQ==