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
   * @class
   * @alias module:argos/SelectionModel
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

  /**
   * @module argos/SelectionModel
   */
  var __class = (0, _declare2.default)('argos.SelectionModel', null, /** @lends module:argos/SelectionModel.prototype */{
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