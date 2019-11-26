define('argos/ConfigurableSelectionModel', ['module', 'exports', 'dojo/_base/declare', './SelectionModel'], function (module, exports, _declare, _SelectionModel) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _SelectionModel2 = _interopRequireDefault(_SelectionModel);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.ConfigurableSelectionModel
   * @classdesc The ConfigurableSelectionModel adds the logic to the SelectionModel to only have one item selected at a time via the `singleSelection` flag.
   * @extends argos.SelectionModel
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

  var __class = (0, _declare2.default)('argos.ConfigurableSelectionModel', [_SelectionModel2.default], /** @lends argos.ConfigurableSelectionModel# */{
    /**
     * @property {Boolean}
     * Flag that controls if only one item is selectable at a time. Meaning if this is true
     * then when a selection is made it first {@link SelectionModel#clear clears} the store.
     */
    singleSelection: false,
    /**
     * This function is called in Lists {@link List#beforeTransitionTo beforeTransitionTo} and
     * it is always passed the Lists navigation options `singleSelect`.
     *
     * It then sets the flag `singleSelection` to the value if the passed value.
     *
     * @param {Boolean} val The state that `singleSelection` should be in.
     */
    useSingleSelection: function useSingleSelection(val) {
      if (val && typeof val !== 'undefined' && val !== null) {
        this.singleSelection = true;
      } else {
        this.singleSelection = false;
      }
    },
    /**
     * Extends the base {@link SelectionModel#select select} by first clearing out the entire
     * store if `singleSelection` is true and there are items already in the store.
     * @param {String} key Unique identifier string
     * @param {Object} data The item being selected
     * @param tag
     */
    select: function select(key /* , data, tag*/) {
      if (this.singleSelection) {
        if (!this.isSelected(key) || this.count >= 1) {
          this.clear();
        }
      }

      this.inherited(select, arguments);
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db25maWd1cmFibGVTZWxlY3Rpb25Nb2RlbC5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwic2luZ2xlU2VsZWN0aW9uIiwidXNlU2luZ2xlU2VsZWN0aW9uIiwidmFsIiwic2VsZWN0Iiwia2V5IiwiaXNTZWxlY3RlZCIsImNvdW50IiwiY2xlYXIiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTs7Ozs7QUFsQkE7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxNQUFNQSxVQUFVLHVCQUFRLGtDQUFSLEVBQTRDLDBCQUE1QyxFQUE4RCwrQ0FBK0M7QUFDM0g7Ozs7O0FBS0FDLHFCQUFpQixLQU4wRztBQU8zSDs7Ozs7Ozs7QUFRQUMsd0JBQW9CLFNBQVNBLGtCQUFULENBQTRCQyxHQUE1QixFQUFpQztBQUNuRCxVQUFJQSxPQUFPLE9BQU9BLEdBQVAsS0FBZSxXQUF0QixJQUFxQ0EsUUFBUSxJQUFqRCxFQUF1RDtBQUNyRCxhQUFLRixlQUFMLEdBQXVCLElBQXZCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBS0EsZUFBTCxHQUF1QixLQUF2QjtBQUNEO0FBQ0YsS0FyQjBIO0FBc0IzSDs7Ozs7OztBQU9BRyxZQUFRLFNBQVNBLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW1CLGdCQUFuQixFQUFxQztBQUMzQyxVQUFJLEtBQUtKLGVBQVQsRUFBMEI7QUFDeEIsWUFBSSxDQUFDLEtBQUtLLFVBQUwsQ0FBZ0JELEdBQWhCLENBQUQsSUFBMEIsS0FBS0UsS0FBTCxJQUFjLENBQTVDLEVBQWdEO0FBQzlDLGVBQUtDLEtBQUw7QUFDRDtBQUNGOztBQUVELFdBQUtDLFNBQUwsQ0FBZUwsTUFBZixFQUF1Qk0sU0FBdkI7QUFDRDtBQXJDMEgsR0FBN0csQ0FBaEI7O29CQXdDZVYsTyIsImZpbGUiOiJDb25maWd1cmFibGVTZWxlY3Rpb25Nb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBTZWxlY3Rpb25Nb2RlbCBmcm9tICcuL1NlbGVjdGlvbk1vZGVsJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuQ29uZmlndXJhYmxlU2VsZWN0aW9uTW9kZWxcclxuICogQGNsYXNzZGVzYyBUaGUgQ29uZmlndXJhYmxlU2VsZWN0aW9uTW9kZWwgYWRkcyB0aGUgbG9naWMgdG8gdGhlIFNlbGVjdGlvbk1vZGVsIHRvIG9ubHkgaGF2ZSBvbmUgaXRlbSBzZWxlY3RlZCBhdCBhIHRpbWUgdmlhIHRoZSBgc2luZ2xlU2VsZWN0aW9uYCBmbGFnLlxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5TZWxlY3Rpb25Nb2RlbFxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLkNvbmZpZ3VyYWJsZVNlbGVjdGlvbk1vZGVsJywgW1NlbGVjdGlvbk1vZGVsXSwgLyoqIEBsZW5kcyBhcmdvcy5Db25maWd1cmFibGVTZWxlY3Rpb25Nb2RlbCMgKi97XHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWcgdGhhdCBjb250cm9scyBpZiBvbmx5IG9uZSBpdGVtIGlzIHNlbGVjdGFibGUgYXQgYSB0aW1lLiBNZWFuaW5nIGlmIHRoaXMgaXMgdHJ1ZVxyXG4gICAqIHRoZW4gd2hlbiBhIHNlbGVjdGlvbiBpcyBtYWRlIGl0IGZpcnN0IHtAbGluayBTZWxlY3Rpb25Nb2RlbCNjbGVhciBjbGVhcnN9IHRoZSBzdG9yZS5cclxuICAgKi9cclxuICBzaW5nbGVTZWxlY3Rpb246IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIFRoaXMgZnVuY3Rpb24gaXMgY2FsbGVkIGluIExpc3RzIHtAbGluayBMaXN0I2JlZm9yZVRyYW5zaXRpb25UbyBiZWZvcmVUcmFuc2l0aW9uVG99IGFuZFxyXG4gICAqIGl0IGlzIGFsd2F5cyBwYXNzZWQgdGhlIExpc3RzIG5hdmlnYXRpb24gb3B0aW9ucyBgc2luZ2xlU2VsZWN0YC5cclxuICAgKlxyXG4gICAqIEl0IHRoZW4gc2V0cyB0aGUgZmxhZyBgc2luZ2xlU2VsZWN0aW9uYCB0byB0aGUgdmFsdWUgaWYgdGhlIHBhc3NlZCB2YWx1ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gdmFsIFRoZSBzdGF0ZSB0aGF0IGBzaW5nbGVTZWxlY3Rpb25gIHNob3VsZCBiZSBpbi5cclxuICAgKi9cclxuICB1c2VTaW5nbGVTZWxlY3Rpb246IGZ1bmN0aW9uIHVzZVNpbmdsZVNlbGVjdGlvbih2YWwpIHtcclxuICAgIGlmICh2YWwgJiYgdHlwZW9mIHZhbCAhPT0gJ3VuZGVmaW5lZCcgJiYgdmFsICE9PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuc2luZ2xlU2VsZWN0aW9uID0gdHJ1ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2luZ2xlU2VsZWN0aW9uID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSBiYXNlIHtAbGluayBTZWxlY3Rpb25Nb2RlbCNzZWxlY3Qgc2VsZWN0fSBieSBmaXJzdCBjbGVhcmluZyBvdXQgdGhlIGVudGlyZVxyXG4gICAqIHN0b3JlIGlmIGBzaW5nbGVTZWxlY3Rpb25gIGlzIHRydWUgYW5kIHRoZXJlIGFyZSBpdGVtcyBhbHJlYWR5IGluIHRoZSBzdG9yZS5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFVuaXF1ZSBpZGVudGlmaWVyIHN0cmluZ1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBpdGVtIGJlaW5nIHNlbGVjdGVkXHJcbiAgICogQHBhcmFtIHRhZ1xyXG4gICAqL1xyXG4gIHNlbGVjdDogZnVuY3Rpb24gc2VsZWN0KGtleS8qICwgZGF0YSwgdGFnKi8pIHtcclxuICAgIGlmICh0aGlzLnNpbmdsZVNlbGVjdGlvbikge1xyXG4gICAgICBpZiAoIXRoaXMuaXNTZWxlY3RlZChrZXkpIHx8ICh0aGlzLmNvdW50ID49IDEpKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmhlcml0ZWQoc2VsZWN0LCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19