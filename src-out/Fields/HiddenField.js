define('argos/Fields/HiddenField', ['module', 'exports', 'dojo/_base/declare', './TextField', '../FieldManager'], function (module, exports, _declare, _TextField, _FieldManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _TextField2 = _interopRequireDefault(_TextField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Fields.HiddenField
   * @classdesc The Hidden Field is {@link TextField TextField} but instead binds to an `<input type="hidden"`>.
   *
   * Meaning that the field will not be displayed on screen but may still store strings of text.
   *
   * @example
   *     {
   *         name: 'StatusCodeKey',
   *         property: 'StatusCodeKey',
   *         type: 'hidden'
   *     }
   * @extends argos.Fields.TextField
   * @requires argos.FieldManager
   */
  var control = (0, _declare2.default)('argos.Fields.HiddenField', [_TextField2.default], /** @lends argos.Fields.HiddenField# */{
    propertyTemplate: new Simplate(['<div style="display: none;" data-field="{%= $.name || $.property %}" data-field-type="{%= $.type %}">', '</div>']),

    /**
     * @property {Simplate}
     * Simplate that defines the fields HTML Markup
     *
     * * `$` => Field instance
     * * `$$` => Owner View instance
     *
     */
    widgetTemplate: new Simplate(['<input data-dojo-attach-point="inputNode" type="hidden">']),
    /**
     * @deprecated
     */
    bind: function bind() {
      // call field's bind. we don't want event handlers for this.
      this.inherited(arguments);
    }
  }); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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

  exports.default = _FieldManager2.default.register('hidden', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvSGlkZGVuRmllbGQuanMiXSwibmFtZXMiOlsiY29udHJvbCIsInByb3BlcnR5VGVtcGxhdGUiLCJTaW1wbGF0ZSIsIndpZGdldFRlbXBsYXRlIiwiYmluZCIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsTUFBTUEsVUFBVSx1QkFBUSwwQkFBUixFQUFvQyxxQkFBcEMsRUFBaUQsdUNBQXVDO0FBQ3RHQyxzQkFBa0IsSUFBSUMsUUFBSixDQUFhLENBQzdCLHVHQUQ2QixFQUU3QixRQUY2QixDQUFiLENBRG9GOztBQU10Rzs7Ozs7Ozs7QUFRQUMsb0JBQWdCLElBQUlELFFBQUosQ0FBYSxDQUMzQiwwREFEMkIsQ0FBYixDQWRzRjtBQWlCdEc7OztBQUdBRSxVQUFNLFNBQVNBLElBQVQsR0FBZ0I7QUFDcEI7QUFDQSxXQUFLQyxTQUFMLENBQWVDLFNBQWY7QUFDRDtBQXZCcUcsR0FBeEYsQ0FBaEIsQyxDQWxDQTs7Ozs7Ozs7Ozs7Ozs7O29CQTREZSx1QkFBYUMsUUFBYixDQUFzQixRQUF0QixFQUFnQ1AsT0FBaEMsQyIsImZpbGUiOiJIaWRkZW5GaWVsZC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IFRleHRGaWVsZCBmcm9tICcuL1RleHRGaWVsZCc7XHJcbmltcG9ydCBGaWVsZE1hbmFnZXIgZnJvbSAnLi4vRmllbGRNYW5hZ2VyJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRmllbGRzLkhpZGRlbkZpZWxkXHJcbiAqIEBjbGFzc2Rlc2MgVGhlIEhpZGRlbiBGaWVsZCBpcyB7QGxpbmsgVGV4dEZpZWxkIFRleHRGaWVsZH0gYnV0IGluc3RlYWQgYmluZHMgdG8gYW4gYDxpbnB1dCB0eXBlPVwiaGlkZGVuXCJgPi5cclxuICpcclxuICogTWVhbmluZyB0aGF0IHRoZSBmaWVsZCB3aWxsIG5vdCBiZSBkaXNwbGF5ZWQgb24gc2NyZWVuIGJ1dCBtYXkgc3RpbGwgc3RvcmUgc3RyaW5ncyBvZiB0ZXh0LlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiAgICAge1xyXG4gKiAgICAgICAgIG5hbWU6ICdTdGF0dXNDb2RlS2V5JyxcclxuICogICAgICAgICBwcm9wZXJ0eTogJ1N0YXR1c0NvZGVLZXknLFxyXG4gKiAgICAgICAgIHR5cGU6ICdoaWRkZW4nXHJcbiAqICAgICB9XHJcbiAqIEBleHRlbmRzIGFyZ29zLkZpZWxkcy5UZXh0RmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkTWFuYWdlclxyXG4gKi9cclxuY29uc3QgY29udHJvbCA9IGRlY2xhcmUoJ2FyZ29zLkZpZWxkcy5IaWRkZW5GaWVsZCcsIFtUZXh0RmllbGRdLCAvKiogQGxlbmRzIGFyZ29zLkZpZWxkcy5IaWRkZW5GaWVsZCMgKi97XHJcbiAgcHJvcGVydHlUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IHN0eWxlPVwiZGlzcGxheTogbm9uZTtcIiBkYXRhLWZpZWxkPVwieyU9ICQubmFtZSB8fCAkLnByb3BlcnR5ICV9XCIgZGF0YS1maWVsZC10eXBlPVwieyU9ICQudHlwZSAlfVwiPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIGZpZWxkcyBIVE1MIE1hcmt1cFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gRmllbGQgaW5zdGFuY2VcclxuICAgKiAqIGAkJGAgPT4gT3duZXIgVmlldyBpbnN0YW5jZVxyXG4gICAqXHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGlucHV0IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJpbnB1dE5vZGVcIiB0eXBlPVwiaGlkZGVuXCI+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoKSB7XHJcbiAgICAvLyBjYWxsIGZpZWxkJ3MgYmluZC4gd2UgZG9uJ3Qgd2FudCBldmVudCBoYW5kbGVycyBmb3IgdGhpcy5cclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGaWVsZE1hbmFnZXIucmVnaXN0ZXIoJ2hpZGRlbicsIGNvbnRyb2wpO1xyXG4iXX0=