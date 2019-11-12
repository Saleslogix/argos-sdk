define('argos/SelectionModel', ['module', 'exports', 'dojo/_base/lang', 'dojo/_base/declare', './I18n'], function (module, exports, _lang, _declare, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lang2 = _interopRequireDefault(_lang);

  var _declare2 = _interopRequireDefault(_declare);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('selectionModel');

  /**
   * @class argos.SelectionModel
   * @classdesc SelectionModel provides a simple in-memory store for data that fires events
   * when a item is selected (added) or deselected (removed)
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

  var __class = (0, _declare2.default)('argos.SelectionModel', null, /** @lends argos.SelectionModel# */{
    // Localization
    requireSelectionText: resource.requireSelectionText,

    /**
     * @property {Boolean}
     * Flag to indicate a selection is required.
     */
    requireSelection: false,
    /**
     * @property {Number}
     * Number of selections
     */
    count: 0,
    /**
     * @property {Object}
     * Collection of selections where the key is the selections key
     */
    selections: null,
    /**
     * @property {Boolean}
     * Flag that determines how to clear:
     *
     * True: Deselect is called on every item, firing onDeselect for each and firing onClear at the end
     *
     * False: Collection is immediately wiped and only onClear is fired
     *
     */
    clearAsDeselect: true,
    /**
     * @property {Boolean}
     * Flag that control the firing of action events: onSelect, onDeselect, onClear
     */
    _fireEvents: true,
    /**
     * Initializes the selections to be empty and mixes the passed object overriding any default properties.
     * @param {Object} options The object to be mixed in.
     * @constructs
     */
    constructor: function constructor(options) {
      this.selections = {};

      _lang2.default.mixin(this, options);
    },
    /**
     * Prevents the firing of action events: onSelect, onDeselect, onClear
     */
    suspendEvents: function suspendEvents() {
      this._fireEvents = false;
    },
    /**
     * Enables the firing of action events:  onSelect, onDeselect, onClear
     */
    resumeEvents: function resumeEvents() {
      this._fireEvents = true;
    },
    /**
     * Event that happens when an item is selected/added.
     * @param {String} key Unique identifier string
     * @param {Object} data The item stored
     * @param tag
     * @param self
     * @template
     */
    onSelect: function onSelect() /* key, data, tag, self*/{},
    /**
     * Event that happens when an item is deselected/removed.
     * @param {String} key Unique identifier string
     * @param {Object} data The item removed
     * @param tag
     * @param self
     * @template
     */
    onDeselect: function onDeselect() /* key, data, tag, self*/{},
    /**
     * Event that happens when the store is cleared
     * @param self
     */
    onClear: function onClear() /* self*/{},
    /**
     * Adds an item to the `selections` if it is not already stored.
     * @param {String} key Unique identifier string
     * @param {Object} data The item being selected
     * @param tag
     */
    select: function select(key, data, tag) {
      if (!this.selections.hasOwnProperty(key)) {
        this.selections[key] = {
          data: data,
          tag: tag
        };
        this.count++;
        if (this._fireEvents) {
          this.onSelect(key, data, tag, this);
        }
      }
    },
    /**
     * Adds an item to the `selections` if it is not already stored, if it is
     * stored, then it deselects (removes) the item.
     * @param {String} key Unique identifier string
     * @param {Object} data The item being selected
     * @param tag
     */
    toggle: function toggle(key, data, tag) {
      if (this.isSelected(key)) {
        this.deselect(key);
      } else {
        this.select(key, data, tag);
      }
    },
    /**
     * Removes an item from the store
     * @param {String} key Unique identifier string that was given when the item was added
     */
    deselect: function deslect(key) {
      if (this.requireSelection && this.count === 1) {
        window.alert(this.requireSelectionText); //eslint-disable-line
        return;
      }

      if (this.selections.hasOwnProperty(key)) {
        var selection = this.selections[key];

        delete this.selections[key];
        this.count--;

        if (this._fireEvents) {
          this.onDeselect(key, selection.data, selection.tag, this);
        }
      }
    },
    /**
     * Removes all items from the store
     */
    clear: function clear() {
      var original = this.requireSelection;

      if (this.clearAsDeselect) {
        this.requireSelection = false;
        for (var key in this.selections) {
          if (this.selections.hasOwnProperty(key)) {
            this.deselect(key);
          }
        }

        this.requireSelection = original;
      } else {
        this.selections = {};
        this.count = 0;
      }

      if (this._fireEvents) {
        this.onClear(this);
      }
    },
    /**
     * Determines if the given key is in the selections collection.
     * @param {String} key Unique identifier string that was given when the item was added
     * @return {Boolean} True if the item is in the store.
     */
    isSelected: function isSelected(key) {
      return !!this.selections[key];
    },
    /**
     * Returns the number of items in the store
     * @return {Number} Current count of items
     */
    getSelectionCount: function getSelectionCount() {
      return this.count;
    },
    /**
     * Returns all items in the store
     * @return {Object} The entire selection collection
     */
    getSelections: function getSelections() {
      return this.selections;
    },
    /**
     * Returns a list of unique identifier keys used in the selection collection
     * @return {String[]} All keys in the store
     */
    getSelectedKeys: function getSelectedKeys() {
      var _this = this;

      return Object.keys(this.selections).filter(function (key) {
        return _this.selections.hasOwnProperty(key);
      });
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9TZWxlY3Rpb25Nb2RlbC5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJyZXF1aXJlU2VsZWN0aW9uVGV4dCIsInJlcXVpcmVTZWxlY3Rpb24iLCJjb3VudCIsInNlbGVjdGlvbnMiLCJjbGVhckFzRGVzZWxlY3QiLCJfZmlyZUV2ZW50cyIsImNvbnN0cnVjdG9yIiwib3B0aW9ucyIsIm1peGluIiwic3VzcGVuZEV2ZW50cyIsInJlc3VtZUV2ZW50cyIsIm9uU2VsZWN0Iiwib25EZXNlbGVjdCIsIm9uQ2xlYXIiLCJzZWxlY3QiLCJrZXkiLCJkYXRhIiwidGFnIiwiaGFzT3duUHJvcGVydHkiLCJ0b2dnbGUiLCJpc1NlbGVjdGVkIiwiZGVzZWxlY3QiLCJkZXNsZWN0Iiwid2luZG93IiwiYWxlcnQiLCJzZWxlY3Rpb24iLCJjbGVhciIsIm9yaWdpbmFsIiwiZ2V0U2VsZWN0aW9uQ291bnQiLCJnZXRTZWxlY3Rpb25zIiwiZ2V0U2VsZWN0ZWRLZXlzIiwiT2JqZWN0Iiwia2V5cyIsImZpbHRlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsTUFBTUEsV0FBVyxvQkFBWSxnQkFBWixDQUFqQjs7QUFFQTs7Ozs7QUFyQkE7Ozs7Ozs7Ozs7Ozs7OztBQTBCQSxNQUFNQyxVQUFVLHVCQUFRLHNCQUFSLEVBQWdDLElBQWhDLEVBQXNDLG1DQUFtQztBQUN2RjtBQUNBQywwQkFBc0JGLFNBQVNFLG9CQUZ3RDs7QUFJdkY7Ozs7QUFJQUMsc0JBQWtCLEtBUnFFO0FBU3ZGOzs7O0FBSUFDLFdBQU8sQ0FiZ0Y7QUFjdkY7Ozs7QUFJQUMsZ0JBQVksSUFsQjJFO0FBbUJ2Rjs7Ozs7Ozs7O0FBU0FDLHFCQUFpQixJQTVCc0U7QUE2QnZGOzs7O0FBSUFDLGlCQUFhLElBakMwRTtBQWtDdkY7Ozs7O0FBS0FDLGlCQUFhLFNBQVNBLFdBQVQsQ0FBcUJDLE9BQXJCLEVBQThCO0FBQ3pDLFdBQUtKLFVBQUwsR0FBa0IsRUFBbEI7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QWI7QUFDRDs7QUFFRCxVQUFJLEtBQUtHLFdBQVQsRUFBc0I7QUFDcEIsYUFBS1EsT0FBTCxDQUFhLElBQWI7QUFDRDtBQUNGLEtBM0pzRjtBQTRKdkY7Ozs7O0FBS0FPLGdCQUFZLFNBQVNBLFVBQVQsQ0FBb0JMLEdBQXBCLEVBQXlCO0FBQ25DLGFBQU8sQ0FBQyxDQUFDLEtBQUtaLFVBQUwsQ0FBZ0JZLEdBQWhCLENBQVQ7QUFDRCxLQW5Lc0Y7QUFvS3ZGOzs7O0FBSUFhLHVCQUFtQixTQUFTQSxpQkFBVCxHQUE2QjtBQUM5QyxhQUFPLEtBQUsxQixLQUFaO0FBQ0QsS0ExS3NGO0FBMkt2Rjs7OztBQUlBMkIsbUJBQWUsU0FBU0EsYUFBVCxHQUF5QjtBQUN0QyxhQUFPLEtBQUsxQixVQUFaO0FBQ0QsS0FqTHNGO0FBa0x2Rjs7OztBQUlBMkIscUJBQWlCLFNBQVNBLGVBQVQsR0FBMkI7QUFBQTs7QUFDMUMsYUFBT0MsT0FBT0MsSUFBUCxDQUFZLEtBQUs3QixVQUFqQixFQUE2QjhCLE1BQTdCLENBQW9DLFVBQUNsQixHQUFELEVBQVM7QUFDbEQsZUFBTyxNQUFLWixVQUFMLENBQWdCZSxjQUFoQixDQUErQkgsR0FBL0IsQ0FBUDtBQUNELE9BRk0sQ0FBUDtBQUdEO0FBMUxzRixHQUF6RSxDQUFoQjs7b0JBNkxlaEIsTyIsImZpbGUiOiJTZWxlY3Rpb25Nb2RlbC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnc2VsZWN0aW9uTW9kZWwnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuU2VsZWN0aW9uTW9kZWxcclxuICogQGNsYXNzZGVzYyBTZWxlY3Rpb25Nb2RlbCBwcm92aWRlcyBhIHNpbXBsZSBpbi1tZW1vcnkgc3RvcmUgZm9yIGRhdGEgdGhhdCBmaXJlcyBldmVudHNcclxuICogd2hlbiBhIGl0ZW0gaXMgc2VsZWN0ZWQgKGFkZGVkKSBvciBkZXNlbGVjdGVkIChyZW1vdmVkKVxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLlNlbGVjdGlvbk1vZGVsJywgbnVsbCwgLyoqIEBsZW5kcyBhcmdvcy5TZWxlY3Rpb25Nb2RlbCMgKi97XHJcbiAgLy8gTG9jYWxpemF0aW9uXHJcbiAgcmVxdWlyZVNlbGVjdGlvblRleHQ6IHJlc291cmNlLnJlcXVpcmVTZWxlY3Rpb25UZXh0LFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogRmxhZyB0byBpbmRpY2F0ZSBhIHNlbGVjdGlvbiBpcyByZXF1aXJlZC5cclxuICAgKi9cclxuICByZXF1aXJlU2VsZWN0aW9uOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge051bWJlcn1cclxuICAgKiBOdW1iZXIgb2Ygc2VsZWN0aW9uc1xyXG4gICAqL1xyXG4gIGNvdW50OiAwLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIENvbGxlY3Rpb24gb2Ygc2VsZWN0aW9ucyB3aGVyZSB0aGUga2V5IGlzIHRoZSBzZWxlY3Rpb25zIGtleVxyXG4gICAqL1xyXG4gIHNlbGVjdGlvbnM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWcgdGhhdCBkZXRlcm1pbmVzIGhvdyB0byBjbGVhcjpcclxuICAgKlxyXG4gICAqIFRydWU6IERlc2VsZWN0IGlzIGNhbGxlZCBvbiBldmVyeSBpdGVtLCBmaXJpbmcgb25EZXNlbGVjdCBmb3IgZWFjaCBhbmQgZmlyaW5nIG9uQ2xlYXIgYXQgdGhlIGVuZFxyXG4gICAqXHJcbiAgICogRmFsc2U6IENvbGxlY3Rpb24gaXMgaW1tZWRpYXRlbHkgd2lwZWQgYW5kIG9ubHkgb25DbGVhciBpcyBmaXJlZFxyXG4gICAqXHJcbiAgICovXHJcbiAgY2xlYXJBc0Rlc2VsZWN0OiB0cnVlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBGbGFnIHRoYXQgY29udHJvbCB0aGUgZmlyaW5nIG9mIGFjdGlvbiBldmVudHM6IG9uU2VsZWN0LCBvbkRlc2VsZWN0LCBvbkNsZWFyXHJcbiAgICovXHJcbiAgX2ZpcmVFdmVudHM6IHRydWUsXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZXMgdGhlIHNlbGVjdGlvbnMgdG8gYmUgZW1wdHkgYW5kIG1peGVzIHRoZSBwYXNzZWQgb2JqZWN0IG92ZXJyaWRpbmcgYW55IGRlZmF1bHQgcHJvcGVydGllcy5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb2JqZWN0IHRvIGJlIG1peGVkIGluLlxyXG4gICAqIEBjb25zdHJ1Y3RzXHJcbiAgICovXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuc2VsZWN0aW9ucyA9IHt9O1xyXG5cclxuICAgIGxhbmcubWl4aW4odGhpcywgb3B0aW9ucyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBQcmV2ZW50cyB0aGUgZmlyaW5nIG9mIGFjdGlvbiBldmVudHM6IG9uU2VsZWN0LCBvbkRlc2VsZWN0LCBvbkNsZWFyXHJcbiAgICovXHJcbiAgc3VzcGVuZEV2ZW50czogZnVuY3Rpb24gc3VzcGVuZEV2ZW50cygpIHtcclxuICAgIHRoaXMuX2ZpcmVFdmVudHMgPSBmYWxzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEVuYWJsZXMgdGhlIGZpcmluZyBvZiBhY3Rpb24gZXZlbnRzOiAgb25TZWxlY3QsIG9uRGVzZWxlY3QsIG9uQ2xlYXJcclxuICAgKi9cclxuICByZXN1bWVFdmVudHM6IGZ1bmN0aW9uIHJlc3VtZUV2ZW50cygpIHtcclxuICAgIHRoaXMuX2ZpcmVFdmVudHMgPSB0cnVlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXZlbnQgdGhhdCBoYXBwZW5zIHdoZW4gYW4gaXRlbSBpcyBzZWxlY3RlZC9hZGRlZC5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFVuaXF1ZSBpZGVudGlmaWVyIHN0cmluZ1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBpdGVtIHN0b3JlZFxyXG4gICAqIEBwYXJhbSB0YWdcclxuICAgKiBAcGFyYW0gc2VsZlxyXG4gICAqIEB0ZW1wbGF0ZVxyXG4gICAqL1xyXG4gIG9uU2VsZWN0OiBmdW5jdGlvbiBvblNlbGVjdCgvKiBrZXksIGRhdGEsIHRhZywgc2VsZiovKSB7fSxcclxuICAvKipcclxuICAgKiBFdmVudCB0aGF0IGhhcHBlbnMgd2hlbiBhbiBpdGVtIGlzIGRlc2VsZWN0ZWQvcmVtb3ZlZC5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFVuaXF1ZSBpZGVudGlmaWVyIHN0cmluZ1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBpdGVtIHJlbW92ZWRcclxuICAgKiBAcGFyYW0gdGFnXHJcbiAgICogQHBhcmFtIHNlbGZcclxuICAgKiBAdGVtcGxhdGVcclxuICAgKi9cclxuICBvbkRlc2VsZWN0OiBmdW5jdGlvbiBvbkRlc2VsZWN0KC8qIGtleSwgZGF0YSwgdGFnLCBzZWxmKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIEV2ZW50IHRoYXQgaGFwcGVucyB3aGVuIHRoZSBzdG9yZSBpcyBjbGVhcmVkXHJcbiAgICogQHBhcmFtIHNlbGZcclxuICAgKi9cclxuICBvbkNsZWFyOiBmdW5jdGlvbiBvbkNsZWFyKC8qIHNlbGYqLykge30sXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhbiBpdGVtIHRvIHRoZSBgc2VsZWN0aW9uc2AgaWYgaXQgaXMgbm90IGFscmVhZHkgc3RvcmVkLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVW5pcXVlIGlkZW50aWZpZXIgc3RyaW5nXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgVGhlIGl0ZW0gYmVpbmcgc2VsZWN0ZWRcclxuICAgKiBAcGFyYW0gdGFnXHJcbiAgICovXHJcbiAgc2VsZWN0OiBmdW5jdGlvbiBzZWxlY3Qoa2V5LCBkYXRhLCB0YWcpIHtcclxuICAgIGlmICghdGhpcy5zZWxlY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25zW2tleV0gPSB7XHJcbiAgICAgICAgZGF0YSxcclxuICAgICAgICB0YWcsXHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMuY291bnQrKztcclxuICAgICAgaWYgKHRoaXMuX2ZpcmVFdmVudHMpIHtcclxuICAgICAgICB0aGlzLm9uU2VsZWN0KGtleSwgZGF0YSwgdGFnLCB0aGlzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhbiBpdGVtIHRvIHRoZSBgc2VsZWN0aW9uc2AgaWYgaXQgaXMgbm90IGFscmVhZHkgc3RvcmVkLCBpZiBpdCBpc1xyXG4gICAqIHN0b3JlZCwgdGhlbiBpdCBkZXNlbGVjdHMgKHJlbW92ZXMpIHRoZSBpdGVtLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVW5pcXVlIGlkZW50aWZpZXIgc3RyaW5nXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgVGhlIGl0ZW0gYmVpbmcgc2VsZWN0ZWRcclxuICAgKiBAcGFyYW0gdGFnXHJcbiAgICovXHJcbiAgdG9nZ2xlOiBmdW5jdGlvbiB0b2dnbGUoa2V5LCBkYXRhLCB0YWcpIHtcclxuICAgIGlmICh0aGlzLmlzU2VsZWN0ZWQoa2V5KSkge1xyXG4gICAgICB0aGlzLmRlc2VsZWN0KGtleSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNlbGVjdChrZXksIGRhdGEsIHRhZyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZW1vdmVzIGFuIGl0ZW0gZnJvbSB0aGUgc3RvcmVcclxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFVuaXF1ZSBpZGVudGlmaWVyIHN0cmluZyB0aGF0IHdhcyBnaXZlbiB3aGVuIHRoZSBpdGVtIHdhcyBhZGRlZFxyXG4gICAqL1xyXG4gIGRlc2VsZWN0OiBmdW5jdGlvbiBkZXNsZWN0KGtleSkge1xyXG4gICAgaWYgKHRoaXMucmVxdWlyZVNlbGVjdGlvbiAmJiB0aGlzLmNvdW50ID09PSAxKSB7XHJcbiAgICAgIHdpbmRvdy5hbGVydCh0aGlzLnJlcXVpcmVTZWxlY3Rpb25UZXh0KTsvL2VzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNlbGVjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICBjb25zdCBzZWxlY3Rpb24gPSB0aGlzLnNlbGVjdGlvbnNba2V5XTtcclxuXHJcbiAgICAgIGRlbGV0ZSB0aGlzLnNlbGVjdGlvbnNba2V5XTtcclxuICAgICAgdGhpcy5jb3VudC0tO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX2ZpcmVFdmVudHMpIHtcclxuICAgICAgICB0aGlzLm9uRGVzZWxlY3Qoa2V5LCBzZWxlY3Rpb24uZGF0YSwgc2VsZWN0aW9uLnRhZywgdGhpcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgYWxsIGl0ZW1zIGZyb20gdGhlIHN0b3JlXHJcbiAgICovXHJcbiAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgY29uc3Qgb3JpZ2luYWwgPSB0aGlzLnJlcXVpcmVTZWxlY3Rpb247XHJcblxyXG4gICAgaWYgKHRoaXMuY2xlYXJBc0Rlc2VsZWN0KSB7XHJcbiAgICAgIHRoaXMucmVxdWlyZVNlbGVjdGlvbiA9IGZhbHNlO1xyXG4gICAgICBmb3IgKGNvbnN0IGtleSBpbiB0aGlzLnNlbGVjdGlvbnMpIHtcclxuICAgICAgICBpZiAodGhpcy5zZWxlY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgIHRoaXMuZGVzZWxlY3Qoa2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucmVxdWlyZVNlbGVjdGlvbiA9IG9yaWdpbmFsO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZWxlY3Rpb25zID0ge307XHJcbiAgICAgIHRoaXMuY291bnQgPSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLl9maXJlRXZlbnRzKSB7XHJcbiAgICAgIHRoaXMub25DbGVhcih0aGlzKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgdGhlIGdpdmVuIGtleSBpcyBpbiB0aGUgc2VsZWN0aW9ucyBjb2xsZWN0aW9uLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVW5pcXVlIGlkZW50aWZpZXIgc3RyaW5nIHRoYXQgd2FzIGdpdmVuIHdoZW4gdGhlIGl0ZW0gd2FzIGFkZGVkXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgaXRlbSBpcyBpbiB0aGUgc3RvcmUuXHJcbiAgICovXHJcbiAgaXNTZWxlY3RlZDogZnVuY3Rpb24gaXNTZWxlY3RlZChrZXkpIHtcclxuICAgIHJldHVybiAhIXRoaXMuc2VsZWN0aW9uc1trZXldO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgbnVtYmVyIG9mIGl0ZW1zIGluIHRoZSBzdG9yZVxyXG4gICAqIEByZXR1cm4ge051bWJlcn0gQ3VycmVudCBjb3VudCBvZiBpdGVtc1xyXG4gICAqL1xyXG4gIGdldFNlbGVjdGlvbkNvdW50OiBmdW5jdGlvbiBnZXRTZWxlY3Rpb25Db3VudCgpIHtcclxuICAgIHJldHVybiB0aGlzLmNvdW50O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbGwgaXRlbXMgaW4gdGhlIHN0b3JlXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBUaGUgZW50aXJlIHNlbGVjdGlvbiBjb2xsZWN0aW9uXHJcbiAgICovXHJcbiAgZ2V0U2VsZWN0aW9uczogZnVuY3Rpb24gZ2V0U2VsZWN0aW9ucygpIHtcclxuICAgIHJldHVybiB0aGlzLnNlbGVjdGlvbnM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgbGlzdCBvZiB1bmlxdWUgaWRlbnRpZmllciBrZXlzIHVzZWQgaW4gdGhlIHNlbGVjdGlvbiBjb2xsZWN0aW9uXHJcbiAgICogQHJldHVybiB7U3RyaW5nW119IEFsbCBrZXlzIGluIHRoZSBzdG9yZVxyXG4gICAqL1xyXG4gIGdldFNlbGVjdGVkS2V5czogZnVuY3Rpb24gZ2V0U2VsZWN0ZWRLZXlzKCkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuc2VsZWN0aW9ucykuZmlsdGVyKChrZXkpID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMuc2VsZWN0aW9ucy5oYXNPd25Qcm9wZXJ0eShrZXkpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=