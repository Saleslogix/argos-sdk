define('argos/_CustomizationMixin', ['module', 'exports', 'dojo/_base/declare'], function (module, exports, _declare) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var customization = ICRMCustomizationSDK; /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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
   * @class argos._CustomizationMixin
   * @classdesc Customization Mixin is a general purpose Customization Engine. It takes a customization object and
   * a layout object and applies the customization defined to the layout.
   *
   * A customization object has the following properties:
   *
   * * `at`: `function(item)` - passes the current item in the list, the function should return true if this is the item being modified (or is at where you want to insert something).
   * * `at`: `{Number}` - May optionally define the index of the item instead of a function.
   * * `type`: `{String}` - enum of `insert`, `modify`, `replace` or `remove` that indicates the type of customization.
   * * `where`: `{String}` - enum of `before` or `after` only needed when type is `insert`.
   * * `value`: `{Object}` - the entire object to create (insert or replace) or the values to overwrite (modify), not needed for remove.
   * * `value`: `{Object[]}` - if inserting you may pass an array of items to create.
   *
   */


  var __class = (0, _declare2.default)('argos._CustomizationMixin', null, {
    id: null,
    customizationSet: null,

    _getCustomizationsFor: function _getCustomizationsFor(customizationSet, customizationSubSet, id) {
      var set = customizationSubSet ? customizationSet + '/' + customizationSubSet : customizationSet;
      return App.getCustomizationsFor(set, id);
    },
    _createCustomizedLayout: function _createCustomizedLayout(layout, customizationSubSet) {
      var customizations = this._getCustomizationsFor(this.customizationSet, customizationSubSet, this.id);
      if (this.enableCustomizations) {
        return customization.createCustomizedLayout(layout, customizations, this.customizationSet, this.id, customizationSubSet);
      }

      return layout;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fQ3VzdG9taXphdGlvbk1peGluLmpzIl0sIm5hbWVzIjpbImN1c3RvbWl6YXRpb24iLCJJQ1JNQ3VzdG9taXphdGlvblNESyIsIl9fY2xhc3MiLCJpZCIsImN1c3RvbWl6YXRpb25TZXQiLCJfZ2V0Q3VzdG9taXphdGlvbnNGb3IiLCJjdXN0b21pemF0aW9uU3ViU2V0Iiwic2V0IiwiQXBwIiwiZ2V0Q3VzdG9taXphdGlvbnNGb3IiLCJfY3JlYXRlQ3VzdG9taXplZExheW91dCIsImxheW91dCIsImN1c3RvbWl6YXRpb25zIiwiZW5hYmxlQ3VzdG9taXphdGlvbnMiLCJjcmVhdGVDdXN0b21pemVkTGF5b3V0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O0FBZ0NBLE1BQU1BLGdCQUFnQkMsb0JBQXRCLEMsQ0FoQ0E7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQSxNQUFNQyxVQUFVLHVCQUFRLDJCQUFSLEVBQXFDLElBQXJDLEVBQTJDO0FBQ3pEQyxRQUFJLElBRHFEO0FBRXpEQyxzQkFBa0IsSUFGdUM7O0FBSXpEQywyQkFBdUIsU0FBU0EscUJBQVQsQ0FBK0JELGdCQUEvQixFQUFpREUsbUJBQWpELEVBQXNFSCxFQUF0RSxFQUEwRTtBQUMvRixVQUFNSSxNQUFNRCxzQkFBeUJGLGdCQUF6QixTQUE2Q0UsbUJBQTdDLEdBQXFFRixnQkFBakY7QUFDQSxhQUFPSSxJQUFJQyxvQkFBSixDQUF5QkYsR0FBekIsRUFBOEJKLEVBQTlCLENBQVA7QUFDRCxLQVB3RDtBQVF6RE8sNkJBQXlCLFNBQVNBLHVCQUFULENBQWlDQyxNQUFqQyxFQUF5Q0wsbUJBQXpDLEVBQThEO0FBQ3JGLFVBQU1NLGlCQUFpQixLQUFLUCxxQkFBTCxDQUEyQixLQUFLRCxnQkFBaEMsRUFBa0RFLG1CQUFsRCxFQUF1RSxLQUFLSCxFQUE1RSxDQUF2QjtBQUNBLFVBQUksS0FBS1Usb0JBQVQsRUFBK0I7QUFDN0IsZUFBT2IsY0FBY2Msc0JBQWQsQ0FBcUNILE1BQXJDLEVBQTZDQyxjQUE3QyxFQUE2RCxLQUFLUixnQkFBbEUsRUFBb0YsS0FBS0QsRUFBekYsRUFBNkZHLG1CQUE3RixDQUFQO0FBQ0Q7O0FBRUQsYUFBT0ssTUFBUDtBQUNEO0FBZndELEdBQTNDLENBQWhCOztvQkFrQmVULE8iLCJmaWxlIjoiX0N1c3RvbWl6YXRpb25NaXhpbi5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5fQ3VzdG9taXphdGlvbk1peGluXHJcbiAqIEBjbGFzc2Rlc2MgQ3VzdG9taXphdGlvbiBNaXhpbiBpcyBhIGdlbmVyYWwgcHVycG9zZSBDdXN0b21pemF0aW9uIEVuZ2luZS4gSXQgdGFrZXMgYSBjdXN0b21pemF0aW9uIG9iamVjdCBhbmRcclxuICogYSBsYXlvdXQgb2JqZWN0IGFuZCBhcHBsaWVzIHRoZSBjdXN0b21pemF0aW9uIGRlZmluZWQgdG8gdGhlIGxheW91dC5cclxuICpcclxuICogQSBjdXN0b21pemF0aW9uIG9iamVjdCBoYXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxyXG4gKlxyXG4gKiAqIGBhdGA6IGBmdW5jdGlvbihpdGVtKWAgLSBwYXNzZXMgdGhlIGN1cnJlbnQgaXRlbSBpbiB0aGUgbGlzdCwgdGhlIGZ1bmN0aW9uIHNob3VsZCByZXR1cm4gdHJ1ZSBpZiB0aGlzIGlzIHRoZSBpdGVtIGJlaW5nIG1vZGlmaWVkIChvciBpcyBhdCB3aGVyZSB5b3Ugd2FudCB0byBpbnNlcnQgc29tZXRoaW5nKS5cclxuICogKiBgYXRgOiBge051bWJlcn1gIC0gTWF5IG9wdGlvbmFsbHkgZGVmaW5lIHRoZSBpbmRleCBvZiB0aGUgaXRlbSBpbnN0ZWFkIG9mIGEgZnVuY3Rpb24uXHJcbiAqICogYHR5cGVgOiBge1N0cmluZ31gIC0gZW51bSBvZiBgaW5zZXJ0YCwgYG1vZGlmeWAsIGByZXBsYWNlYCBvciBgcmVtb3ZlYCB0aGF0IGluZGljYXRlcyB0aGUgdHlwZSBvZiBjdXN0b21pemF0aW9uLlxyXG4gKiAqIGB3aGVyZWA6IGB7U3RyaW5nfWAgLSBlbnVtIG9mIGBiZWZvcmVgIG9yIGBhZnRlcmAgb25seSBuZWVkZWQgd2hlbiB0eXBlIGlzIGBpbnNlcnRgLlxyXG4gKiAqIGB2YWx1ZWA6IGB7T2JqZWN0fWAgLSB0aGUgZW50aXJlIG9iamVjdCB0byBjcmVhdGUgKGluc2VydCBvciByZXBsYWNlKSBvciB0aGUgdmFsdWVzIHRvIG92ZXJ3cml0ZSAobW9kaWZ5KSwgbm90IG5lZWRlZCBmb3IgcmVtb3ZlLlxyXG4gKiAqIGB2YWx1ZWA6IGB7T2JqZWN0W119YCAtIGlmIGluc2VydGluZyB5b3UgbWF5IHBhc3MgYW4gYXJyYXkgb2YgaXRlbXMgdG8gY3JlYXRlLlxyXG4gKlxyXG4gKi9cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuXHJcbmNvbnN0IGN1c3RvbWl6YXRpb24gPSBJQ1JNQ3VzdG9taXphdGlvblNESztcclxuXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fQ3VzdG9taXphdGlvbk1peGluJywgbnVsbCwge1xyXG4gIGlkOiBudWxsLFxyXG4gIGN1c3RvbWl6YXRpb25TZXQ6IG51bGwsXHJcblxyXG4gIF9nZXRDdXN0b21pemF0aW9uc0ZvcjogZnVuY3Rpb24gX2dldEN1c3RvbWl6YXRpb25zRm9yKGN1c3RvbWl6YXRpb25TZXQsIGN1c3RvbWl6YXRpb25TdWJTZXQsIGlkKSB7XHJcbiAgICBjb25zdCBzZXQgPSBjdXN0b21pemF0aW9uU3ViU2V0ID8gYCR7Y3VzdG9taXphdGlvblNldH0vJHtjdXN0b21pemF0aW9uU3ViU2V0fWAgOiBjdXN0b21pemF0aW9uU2V0O1xyXG4gICAgcmV0dXJuIEFwcC5nZXRDdXN0b21pemF0aW9uc0ZvcihzZXQsIGlkKTtcclxuICB9LFxyXG4gIF9jcmVhdGVDdXN0b21pemVkTGF5b3V0OiBmdW5jdGlvbiBfY3JlYXRlQ3VzdG9taXplZExheW91dChsYXlvdXQsIGN1c3RvbWl6YXRpb25TdWJTZXQpIHtcclxuICAgIGNvbnN0IGN1c3RvbWl6YXRpb25zID0gdGhpcy5fZ2V0Q3VzdG9taXphdGlvbnNGb3IodGhpcy5jdXN0b21pemF0aW9uU2V0LCBjdXN0b21pemF0aW9uU3ViU2V0LCB0aGlzLmlkKTtcclxuICAgIGlmICh0aGlzLmVuYWJsZUN1c3RvbWl6YXRpb25zKSB7XHJcbiAgICAgIHJldHVybiBjdXN0b21pemF0aW9uLmNyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQobGF5b3V0LCBjdXN0b21pemF0aW9ucywgdGhpcy5jdXN0b21pemF0aW9uU2V0LCB0aGlzLmlkLCBjdXN0b21pemF0aW9uU3ViU2V0KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGF5b3V0O1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19