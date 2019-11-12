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
      var options = this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvU2VsZWN0RmllbGQuanMiXSwibmFtZXMiOlsiY29udHJvbCIsInZhbHVlS2V5UHJvcGVydHkiLCJ2YWx1ZVRleHRQcm9wZXJ0eSIsImRhdGEiLCJjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyIsIm9wdGlvbnMiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJoaWRlU2VhcmNoIiwiZW5hYmxlQWN0aW9ucyIsImV4cGFuZEV4cHJlc3Npb24iLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBaUJBLE1BQU1BLFVBQVUsdUJBQVEsMEJBQVIsRUFBb0MsdUJBQXBDLEVBQW1ELGdDQUFpQztBQUNsRzs7Ozs7QUFLQUMsc0JBQWtCLEtBTmdGO0FBT2xHOzs7OztBQUtBQyx1QkFBbUIsS0FaK0U7QUFhbEc7Ozs7QUFJQUMsVUFBTSxJQWpCNEY7QUFrQmxHOzs7O0FBSUFDLDZCQUF5QixTQUFTQSx1QkFBVCxHQUFtQztBQUMxRCxVQUFNQyxVQUFVLEtBQUtDLFNBQUwsQ0FBZUMsU0FBZixDQUFoQjtBQUNBRixjQUFRRyxVQUFSLEdBQXFCLElBQXJCO0FBQ0FILGNBQVFJLGFBQVIsR0FBd0IsS0FBeEI7QUFDQUosY0FBUUYsSUFBUixHQUFlLEtBQUtPLGdCQUFMLENBQXNCLEtBQUtQLElBQTNCLENBQWY7QUFDQSxhQUFPRSxPQUFQO0FBQ0Q7QUE1QmlHLEdBQXBGLENBQWhCLEMsQ0FwQ0E7Ozs7Ozs7Ozs7Ozs7OztvQkFtRWUsdUJBQWFNLFFBQWIsQ0FBc0IsUUFBdEIsRUFBZ0NYLE9BQWhDLEMiLCJmaWxlIjoiU2VsZWN0RmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBMb29rdXBGaWVsZCBmcm9tICcuL0xvb2t1cEZpZWxkJztcclxuaW1wb3J0IEZpZWxkTWFuYWdlciBmcm9tICcuLi9GaWVsZE1hbmFnZXInO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5GaWVsZHMuU2VsZWN0RmllbGRcclxuICogQGNsYXNzZGVzYyBUaGUgU2VsZWN0RmllbGQgaXMgYSBtaW5vciBleHRlbnNpb24gdG8gdGUgTG9va3VwRmllbGQgaW4gdGhhdCBpdCBleHBsaWNpdGx5IGhpZGVzIHNlYXJjaCBhbmQgYWN0aW9ucy5cclxuICpcclxuICogSXQgbWF5IGFsc28gb3B0aW9uYWxseSBwYXNzIHRoZSBgZGF0YWAgb3B0aW9uIHdoaWNoIGEgdmlldyBtYXkgb3B0aW9uYWxseSB1c2UgaW5zdGVhZCBvZiByZXF1ZXN0aW5nIGRhdGEuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqICAgICB7XHJcbiAqICAgICAgICAgbmFtZTogJ1N0YXRlJyxcclxuICogICAgICAgICBwcm9wZXJ0eTogJ1N0YXRlJyxcclxuICogICAgICAgICBsYWJlbDogdGhpcy5zdGF0ZVRleHQsXHJcbiAqICAgICAgICAgdHlwZTogJ3NlbGVjdCcsXHJcbiAqICAgICAgICAgdmlldzogJ3N0YXRlX2xpc3QnXHJcbiAqICAgICB9XHJcbiAqIEBleHRlbmRzIGFyZ29zLkZpZWxkcy5Mb29rdXBGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRNYW5hZ2VyXHJcbiAqL1xyXG5jb25zdCBjb250cm9sID0gZGVjbGFyZSgnYXJnb3MuRmllbGRzLlNlbGVjdEZpZWxkJywgW0xvb2t1cEZpZWxkXSwgLyoqIEBsZW5kcyBhcmdvcy5TZWxlY3RGaWVsZCMgKi8ge1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBPdmVycmlkZXMgdGhlIHtAbGluayBMb29rdXBGaWVsZCBMb29rdXBGaWVsZH0gZGVmYXVsdCB0byBleHBsaWNpdGx5IHNldCBpdCB0byBmYWxzZSBmb3JjaW5nXHJcbiAgICogdGhlIHZpZXcgdG8gdXNlIHRoZSBjdXJyZW50VmFsdWUgaW5zdGVhZCBvZiBhIGtleS9kZXNjcmlwdG9yXHJcbiAgICovXHJcbiAgdmFsdWVLZXlQcm9wZXJ0eTogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIE92ZXJyaWRlcyB0aGUge0BsaW5rIExvb2t1cEZpZWxkIExvb2t1cEZpZWxkfSBkZWZhdWx0IHRvIGV4cGxpY2l0bHkgc2V0IGl0IHRvIGZhbHNlIGZvcmNpbmdcclxuICAgKiB0aGUgdmlldyB0byB1c2UgdGhlIGN1cnJlbnRWYWx1ZSBpbnN0ZWFkIG9mIGEga2V5L2Rlc2NyaXB0b3JcclxuICAgKi9cclxuICB2YWx1ZVRleHRQcm9wZXJ0eTogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R8T2JqZWN0W118RnVuY3Rpb259XHJcbiAgICogSWYgZGVmaW5lZCB3aWxsIGJlIGV4cGFuZGVkIChpZiBmdW5jdGlvbikgYW5kIHBhc3NlZCBpbiB0aGUgbmF2aWdhdGlvbiBvcHRpb25zIHRvIHRoZSBsb29rdXAgdmlld1xyXG4gICAqL1xyXG4gIGRhdGE6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogT3ZlcmlkZXMgdGhlIHtAbGluayBMb29rdXBGaWVsZCNjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyBwYXJlbnQgaW1wbGVtZW50YXRpb259IHRvIHNldCBzZWFyY2ggYW5kIGFjdGlvbnMgdG9cclxuICAgKiBoaWRkZW4gYW5kIG9wdGlvbmFsbHkgcGFzcyBkYXRhIGRlZmluZWQgb24gdGhlIGZpZWxkLlxyXG4gICAqL1xyXG4gIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zOiBmdW5jdGlvbiBjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucygpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gICAgb3B0aW9ucy5oaWRlU2VhcmNoID0gdHJ1ZTtcclxuICAgIG9wdGlvbnMuZW5hYmxlQWN0aW9ucyA9IGZhbHNlO1xyXG4gICAgb3B0aW9ucy5kYXRhID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKHRoaXMuZGF0YSk7XHJcbiAgICByZXR1cm4gb3B0aW9ucztcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpZWxkTWFuYWdlci5yZWdpc3Rlcignc2VsZWN0JywgY29udHJvbCk7XHJcbiJdfQ==