define('argos/Fields/SelectField', ['module', 'exports', 'dojo/_base/declare', './LookupField', '../FieldManager'], function (module, exports, _declare, _LookupField, _FieldManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _LookupField2 = _interopRequireDefault(_LookupField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Fields.SelectField
   * @classdesc The SelectField is a minor extension to te LookupField in that it explicitly hides search and actions.
   *
   * It may also optionally pass the `data` option which a view may optionally use instead of requesting data.
   *
   * @example
   *     {
   *         name: 'State',
   *         property: 'State',
   *         label: this.stateText,
   *         type: 'select',
   *         view: 'state_list'
   *     }
   * @extends argos.Fields.LookupField
   * @requires argos.FieldManager
   */
  var control = (0, _declare2.default)('argos.Fields.SelectField', [_LookupField2.default], /** @lends argos.SelectField# */{
    /**
     * @property {Boolean}
     * Overrides the {@link LookupField LookupField} default to explicitly set it to false forcing
     * the view to use the currentValue instead of a key/descriptor
     */
    valueKeyProperty: false,
    /**
     * @property {Boolean}
     * Overrides the {@link LookupField LookupField} default to explicitly set it to false forcing
     * the view to use the currentValue instead of a key/descriptor
     */
    valueTextProperty: false,
    /**
     * @property {Object|Object[]|Function}
     * If defined will be expanded (if function) and passed in the navigation options to the lookup view
     */
    data: null,
    /**
     * Overides the {@link LookupField#createNavigationOptions parent implementation} to set search and actions to
     * hidden and optionally pass data defined on the field.
     */
    createNavigationOptions: function createNavigationOptions() {
      var options = this.inherited(createNavigationOptions, arguments);
      options.hideSearch = true;
      options.enableActions = false;
      options.data = this.expandExpression(this.data);
      return options;
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

  exports.default = _FieldManager2.default.register('select', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvU2VsZWN0RmllbGQuanMiXSwibmFtZXMiOlsiY29udHJvbCIsInZhbHVlS2V5UHJvcGVydHkiLCJ2YWx1ZVRleHRQcm9wZXJ0eSIsImRhdGEiLCJjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyIsIm9wdGlvbnMiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJoaWRlU2VhcmNoIiwiZW5hYmxlQWN0aW9ucyIsImV4cGFuZEV4cHJlc3Npb24iLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE1BQU1BLFVBQVUsdUJBQVEsMEJBQVIsRUFBb0MsdUJBQXBDLEVBQW1ELGdDQUFpQztBQUNsRzs7Ozs7QUFLQUMsc0JBQWtCLEtBTmdGO0FBT2xHOzs7OztBQUtBQyx1QkFBbUIsS0FaK0U7QUFhbEc7Ozs7QUFJQUMsVUFBTSxJQWpCNEY7QUFrQmxHOzs7O0FBSUFDLDZCQUF5QixTQUFTQSx1QkFBVCxHQUFtQztBQUMxRCxVQUFNQyxVQUFVLEtBQUtDLFNBQUwsQ0FBZUYsdUJBQWYsRUFBd0NHLFNBQXhDLENBQWhCO0FBQ0FGLGNBQVFHLFVBQVIsR0FBcUIsSUFBckI7QUFDQUgsY0FBUUksYUFBUixHQUF3QixLQUF4QjtBQUNBSixjQUFRRixJQUFSLEdBQWUsS0FBS08sZ0JBQUwsQ0FBc0IsS0FBS1AsSUFBM0IsQ0FBZjtBQUNBLGFBQU9FLE9BQVA7QUFDRDtBQTVCaUcsR0FBcEYsQ0FBaEIsQyxDQXBDQTs7Ozs7Ozs7Ozs7Ozs7O29CQW1FZSx1QkFBYU0sUUFBYixDQUFzQixRQUF0QixFQUFnQ1gsT0FBaEMsQyIsImZpbGUiOiJTZWxlY3RGaWVsZC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IExvb2t1cEZpZWxkIGZyb20gJy4vTG9va3VwRmllbGQnO1xyXG5pbXBvcnQgRmllbGRNYW5hZ2VyIGZyb20gJy4uL0ZpZWxkTWFuYWdlcic7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkZpZWxkcy5TZWxlY3RGaWVsZFxyXG4gKiBAY2xhc3NkZXNjIFRoZSBTZWxlY3RGaWVsZCBpcyBhIG1pbm9yIGV4dGVuc2lvbiB0byB0ZSBMb29rdXBGaWVsZCBpbiB0aGF0IGl0IGV4cGxpY2l0bHkgaGlkZXMgc2VhcmNoIGFuZCBhY3Rpb25zLlxyXG4gKlxyXG4gKiBJdCBtYXkgYWxzbyBvcHRpb25hbGx5IHBhc3MgdGhlIGBkYXRhYCBvcHRpb24gd2hpY2ggYSB2aWV3IG1heSBvcHRpb25hbGx5IHVzZSBpbnN0ZWFkIG9mIHJlcXVlc3RpbmcgZGF0YS5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogICAgIHtcclxuICogICAgICAgICBuYW1lOiAnU3RhdGUnLFxyXG4gKiAgICAgICAgIHByb3BlcnR5OiAnU3RhdGUnLFxyXG4gKiAgICAgICAgIGxhYmVsOiB0aGlzLnN0YXRlVGV4dCxcclxuICogICAgICAgICB0eXBlOiAnc2VsZWN0JyxcclxuICogICAgICAgICB2aWV3OiAnc3RhdGVfbGlzdCdcclxuICogICAgIH1cclxuICogQGV4dGVuZHMgYXJnb3MuRmllbGRzLkxvb2t1cEZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZE1hbmFnZXJcclxuICovXHJcbmNvbnN0IGNvbnRyb2wgPSBkZWNsYXJlKCdhcmdvcy5GaWVsZHMuU2VsZWN0RmllbGQnLCBbTG9va3VwRmllbGRdLCAvKiogQGxlbmRzIGFyZ29zLlNlbGVjdEZpZWxkIyAqLyB7XHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIE92ZXJyaWRlcyB0aGUge0BsaW5rIExvb2t1cEZpZWxkIExvb2t1cEZpZWxkfSBkZWZhdWx0IHRvIGV4cGxpY2l0bHkgc2V0IGl0IHRvIGZhbHNlIGZvcmNpbmdcclxuICAgKiB0aGUgdmlldyB0byB1c2UgdGhlIGN1cnJlbnRWYWx1ZSBpbnN0ZWFkIG9mIGEga2V5L2Rlc2NyaXB0b3JcclxuICAgKi9cclxuICB2YWx1ZUtleVByb3BlcnR5OiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogT3ZlcnJpZGVzIHRoZSB7QGxpbmsgTG9va3VwRmllbGQgTG9va3VwRmllbGR9IGRlZmF1bHQgdG8gZXhwbGljaXRseSBzZXQgaXQgdG8gZmFsc2UgZm9yY2luZ1xyXG4gICAqIHRoZSB2aWV3IHRvIHVzZSB0aGUgY3VycmVudFZhbHVlIGluc3RlYWQgb2YgYSBrZXkvZGVzY3JpcHRvclxyXG4gICAqL1xyXG4gIHZhbHVlVGV4dFByb3BlcnR5OiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdHxPYmplY3RbXXxGdW5jdGlvbn1cclxuICAgKiBJZiBkZWZpbmVkIHdpbGwgYmUgZXhwYW5kZWQgKGlmIGZ1bmN0aW9uKSBhbmQgcGFzc2VkIGluIHRoZSBuYXZpZ2F0aW9uIG9wdGlvbnMgdG8gdGhlIGxvb2t1cCB2aWV3XHJcbiAgICovXHJcbiAgZGF0YTogbnVsbCxcclxuICAvKipcclxuICAgKiBPdmVyaWRlcyB0aGUge0BsaW5rIExvb2t1cEZpZWxkI2NyZWF0ZU5hdmlnYXRpb25PcHRpb25zIHBhcmVudCBpbXBsZW1lbnRhdGlvbn0gdG8gc2V0IHNlYXJjaCBhbmQgYWN0aW9ucyB0b1xyXG4gICAqIGhpZGRlbiBhbmQgb3B0aW9uYWxseSBwYXNzIGRhdGEgZGVmaW5lZCBvbiB0aGUgZmllbGQuXHJcbiAgICovXHJcbiAgY3JlYXRlTmF2aWdhdGlvbk9wdGlvbnM6IGZ1bmN0aW9uIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zKCkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuaW5oZXJpdGVkKGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zLCBhcmd1bWVudHMpO1xyXG4gICAgb3B0aW9ucy5oaWRlU2VhcmNoID0gdHJ1ZTtcclxuICAgIG9wdGlvbnMuZW5hYmxlQWN0aW9ucyA9IGZhbHNlO1xyXG4gICAgb3B0aW9ucy5kYXRhID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKHRoaXMuZGF0YSk7XHJcbiAgICByZXR1cm4gb3B0aW9ucztcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpZWxkTWFuYWdlci5yZWdpc3Rlcignc2VsZWN0JywgY29udHJvbCk7XHJcbiJdfQ==