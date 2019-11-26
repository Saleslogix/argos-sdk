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
      this.inherited(bind, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvSGlkZGVuRmllbGQuanMiXSwibmFtZXMiOlsiY29udHJvbCIsInByb3BlcnR5VGVtcGxhdGUiLCJTaW1wbGF0ZSIsIndpZGdldFRlbXBsYXRlIiwiYmluZCIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInJlZ2lzdGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW1CQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUEsTUFBTUEsVUFBVSx1QkFBUSwwQkFBUixFQUFvQyxxQkFBcEMsRUFBaUQsdUNBQXVDO0FBQ3RHQyxzQkFBa0IsSUFBSUMsUUFBSixDQUFhLENBQzdCLHVHQUQ2QixFQUU3QixRQUY2QixDQUFiLENBRG9GOztBQU10Rzs7Ozs7Ozs7QUFRQUMsb0JBQWdCLElBQUlELFFBQUosQ0FBYSxDQUMzQiwwREFEMkIsQ0FBYixDQWRzRjtBQWlCdEc7OztBQUdBRSxVQUFNLFNBQVNBLElBQVQsR0FBZ0I7QUFDcEI7QUFDQSxXQUFLQyxTQUFMLENBQWVELElBQWYsRUFBcUJFLFNBQXJCO0FBQ0Q7QUF2QnFHLEdBQXhGLENBQWhCLEMsQ0FsQ0E7Ozs7Ozs7Ozs7Ozs7OztvQkE0RGUsdUJBQWFDLFFBQWIsQ0FBc0IsUUFBdEIsRUFBZ0NQLE9BQWhDLEMiLCJmaWxlIjoiSGlkZGVuRmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBUZXh0RmllbGQgZnJvbSAnLi9UZXh0RmllbGQnO1xyXG5pbXBvcnQgRmllbGRNYW5hZ2VyIGZyb20gJy4uL0ZpZWxkTWFuYWdlcic7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkZpZWxkcy5IaWRkZW5GaWVsZFxyXG4gKiBAY2xhc3NkZXNjIFRoZSBIaWRkZW4gRmllbGQgaXMge0BsaW5rIFRleHRGaWVsZCBUZXh0RmllbGR9IGJ1dCBpbnN0ZWFkIGJpbmRzIHRvIGFuIGA8aW5wdXQgdHlwZT1cImhpZGRlblwiYD4uXHJcbiAqXHJcbiAqIE1lYW5pbmcgdGhhdCB0aGUgZmllbGQgd2lsbCBub3QgYmUgZGlzcGxheWVkIG9uIHNjcmVlbiBidXQgbWF5IHN0aWxsIHN0b3JlIHN0cmluZ3Mgb2YgdGV4dC5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogICAgIHtcclxuICogICAgICAgICBuYW1lOiAnU3RhdHVzQ29kZUtleScsXHJcbiAqICAgICAgICAgcHJvcGVydHk6ICdTdGF0dXNDb2RlS2V5JyxcclxuICogICAgICAgICB0eXBlOiAnaGlkZGVuJ1xyXG4gKiAgICAgfVxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5GaWVsZHMuVGV4dEZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZE1hbmFnZXJcclxuICovXHJcbmNvbnN0IGNvbnRyb2wgPSBkZWNsYXJlKCdhcmdvcy5GaWVsZHMuSGlkZGVuRmllbGQnLCBbVGV4dEZpZWxkXSwgLyoqIEBsZW5kcyBhcmdvcy5GaWVsZHMuSGlkZGVuRmllbGQjICove1xyXG4gIHByb3BlcnR5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBzdHlsZT1cImRpc3BsYXk6IG5vbmU7XCIgZGF0YS1maWVsZD1cInslPSAkLm5hbWUgfHwgJC5wcm9wZXJ0eSAlfVwiIGRhdGEtZmllbGQtdHlwZT1cInslPSAkLnR5cGUgJX1cIj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBmaWVsZHMgSFRNTCBNYXJrdXBcclxuICAgKlxyXG4gICAqICogYCRgID0+IEZpZWxkIGluc3RhbmNlXHJcbiAgICogKiBgJCRgID0+IE93bmVyIFZpZXcgaW5zdGFuY2VcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxpbnB1dCBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiaW5wdXROb2RlXCIgdHlwZT1cImhpZGRlblwiPicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQGRlcHJlY2F0ZWRcclxuICAgKi9cclxuICBiaW5kOiBmdW5jdGlvbiBiaW5kKCkge1xyXG4gICAgLy8gY2FsbCBmaWVsZCdzIGJpbmQuIHdlIGRvbid0IHdhbnQgZXZlbnQgaGFuZGxlcnMgZm9yIHRoaXMuXHJcbiAgICB0aGlzLmluaGVyaXRlZChiaW5kLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGRNYW5hZ2VyLnJlZ2lzdGVyKCdoaWRkZW4nLCBjb250cm9sKTtcclxuIl19