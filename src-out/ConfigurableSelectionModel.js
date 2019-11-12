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

      this.inherited(arguments);
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Db25maWd1cmFibGVTZWxlY3Rpb25Nb2RlbC5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwic2luZ2xlU2VsZWN0aW9uIiwidXNlU2luZ2xlU2VsZWN0aW9uIiwidmFsIiwic2VsZWN0Iiwia2V5IiwiaXNTZWxlY3RlZCIsImNvdW50IiwiY2xlYXIiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTs7Ozs7QUFsQkE7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxNQUFNQSxVQUFVLHVCQUFRLGtDQUFSLEVBQTRDLDBCQUE1QyxFQUE4RCwrQ0FBK0M7QUFDM0g7Ozs7O0FBS0FDLHFCQUFpQixLQU4wRztBQU8zSDs7Ozs7Ozs7QUFRQUMsd0JBQW9CLFNBQVNBLGtCQUFULENBQTRCQyxHQUE1QixFQUFpQztBQUNuRCxVQUFJQSxPQUFPLE9BQU9BLEdBQVAsS0FBZSxXQUF0QixJQUFxQ0EsUUFBUSxJQUFqRCxFQUF1RDtBQUNyRCxhQUFLRixlQUFMLEdBQXVCLElBQXZCO0FBQ0QsT0FGRCxNQUVPO0FBQ0wsYUFBS0EsZUFBTCxHQUF1QixLQUF2QjtBQUNEO0FBQ0YsS0FyQjBIO0FBc0IzSDs7Ozs7OztBQU9BRyxZQUFRLFNBQVNBLE1BQVQsQ0FBZ0JDLEdBQWhCLENBQW1CLGdCQUFuQixFQUFxQztBQUMzQyxVQUFJLEtBQUtKLGVBQVQsRUFBMEI7QUFDeEIsWUFBSSxDQUFDLEtBQUtLLFVBQUwsQ0FBZ0JELEdBQWhCLENBQUQsSUFBMEIsS0FBS0UsS0FBTCxJQUFjLENBQTVDLEVBQWdEO0FBQzlDLGVBQUtDLEtBQUw7QUFDRDtBQUNGOztBQUVELFdBQUtDLFNBQUwsQ0FBZUMsU0FBZjtBQUNEO0FBckMwSCxHQUE3RyxDQUFoQjs7b0JBd0NlVixPIiwiZmlsZSI6IkNvbmZpZ3VyYWJsZVNlbGVjdGlvbk1vZGVsLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IFNlbGVjdGlvbk1vZGVsIGZyb20gJy4vU2VsZWN0aW9uTW9kZWwnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5Db25maWd1cmFibGVTZWxlY3Rpb25Nb2RlbFxyXG4gKiBAY2xhc3NkZXNjIFRoZSBDb25maWd1cmFibGVTZWxlY3Rpb25Nb2RlbCBhZGRzIHRoZSBsb2dpYyB0byB0aGUgU2VsZWN0aW9uTW9kZWwgdG8gb25seSBoYXZlIG9uZSBpdGVtIHNlbGVjdGVkIGF0IGEgdGltZSB2aWEgdGhlIGBzaW5nbGVTZWxlY3Rpb25gIGZsYWcuXHJcbiAqIEBleHRlbmRzIGFyZ29zLlNlbGVjdGlvbk1vZGVsXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuQ29uZmlndXJhYmxlU2VsZWN0aW9uTW9kZWwnLCBbU2VsZWN0aW9uTW9kZWxdLCAvKiogQGxlbmRzIGFyZ29zLkNvbmZpZ3VyYWJsZVNlbGVjdGlvbk1vZGVsIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogRmxhZyB0aGF0IGNvbnRyb2xzIGlmIG9ubHkgb25lIGl0ZW0gaXMgc2VsZWN0YWJsZSBhdCBhIHRpbWUuIE1lYW5pbmcgaWYgdGhpcyBpcyB0cnVlXHJcbiAgICogdGhlbiB3aGVuIGEgc2VsZWN0aW9uIGlzIG1hZGUgaXQgZmlyc3Qge0BsaW5rIFNlbGVjdGlvbk1vZGVsI2NsZWFyIGNsZWFyc30gdGhlIHN0b3JlLlxyXG4gICAqL1xyXG4gIHNpbmdsZVNlbGVjdGlvbjogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogVGhpcyBmdW5jdGlvbiBpcyBjYWxsZWQgaW4gTGlzdHMge0BsaW5rIExpc3QjYmVmb3JlVHJhbnNpdGlvblRvIGJlZm9yZVRyYW5zaXRpb25Ub30gYW5kXHJcbiAgICogaXQgaXMgYWx3YXlzIHBhc3NlZCB0aGUgTGlzdHMgbmF2aWdhdGlvbiBvcHRpb25zIGBzaW5nbGVTZWxlY3RgLlxyXG4gICAqXHJcbiAgICogSXQgdGhlbiBzZXRzIHRoZSBmbGFnIGBzaW5nbGVTZWxlY3Rpb25gIHRvIHRoZSB2YWx1ZSBpZiB0aGUgcGFzc2VkIHZhbHVlLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtCb29sZWFufSB2YWwgVGhlIHN0YXRlIHRoYXQgYHNpbmdsZVNlbGVjdGlvbmAgc2hvdWxkIGJlIGluLlxyXG4gICAqL1xyXG4gIHVzZVNpbmdsZVNlbGVjdGlvbjogZnVuY3Rpb24gdXNlU2luZ2xlU2VsZWN0aW9uKHZhbCkge1xyXG4gICAgaWYgKHZhbCAmJiB0eXBlb2YgdmFsICE9PSAndW5kZWZpbmVkJyAmJiB2YWwgIT09IG51bGwpIHtcclxuICAgICAgdGhpcy5zaW5nbGVTZWxlY3Rpb24gPSB0cnVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zaW5nbGVTZWxlY3Rpb24gPSBmYWxzZTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIGJhc2Uge0BsaW5rIFNlbGVjdGlvbk1vZGVsI3NlbGVjdCBzZWxlY3R9IGJ5IGZpcnN0IGNsZWFyaW5nIG91dCB0aGUgZW50aXJlXHJcbiAgICogc3RvcmUgaWYgYHNpbmdsZVNlbGVjdGlvbmAgaXMgdHJ1ZSBhbmQgdGhlcmUgYXJlIGl0ZW1zIGFscmVhZHkgaW4gdGhlIHN0b3JlLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVW5pcXVlIGlkZW50aWZpZXIgc3RyaW5nXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgVGhlIGl0ZW0gYmVpbmcgc2VsZWN0ZWRcclxuICAgKiBAcGFyYW0gdGFnXHJcbiAgICovXHJcbiAgc2VsZWN0OiBmdW5jdGlvbiBzZWxlY3Qoa2V5LyogLCBkYXRhLCB0YWcqLykge1xyXG4gICAgaWYgKHRoaXMuc2luZ2xlU2VsZWN0aW9uKSB7XHJcbiAgICAgIGlmICghdGhpcy5pc1NlbGVjdGVkKGtleSkgfHwgKHRoaXMuY291bnQgPj0gMSkpIHtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19