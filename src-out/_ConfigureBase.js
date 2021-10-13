define('argos/_ConfigureBase', ['module', 'exports', 'dojo/_base/declare', './DraggableList', './I18n'], function (module, exports, _declare, _DraggableList, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _DraggableList2 = _interopRequireDefault(_DraggableList);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('configureBase'); /* Copyright 2017 Infor
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
   * @module argos/_ConfigureBase
   */

  var editResource = (0, _I18n2.default)('editBase');

  /**
   * @class
   * @alias module:argos/_ConfigureBase
   * @extends module:argos/DraggableList
   */
  var __class = (0, _declare2.default)('argos._ConfigureBase', [_DraggableList2.default], /** @lends module:argos/_ConfigureBase.prototype */{
    // Templates
    itemTemplate: new Simplate(['<h4>', '<span>{%: $.$descriptor %}</span>', '</h4>', '<button type="button" class="btn-icon hide-focus draggable">\n      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-drag"></use>\n      </svg>\n    </button>']),

    // Localization
    titleText: resource.titleText,
    saveText: editResource.saveTooltipText,
    cancelText: editResource.cancelTooltipText,

    // View Properties
    id: 'configure_base',
    expose: false,
    enableSearch: false,
    enablePullToRefresh: false,
    selectionOnly: true,
    allowSelection: true,
    autoClearSelection: false,
    cls: 'configurable-list',
    lastMovedCls: 'last-moved',

    createToolLayout: function createToolLayout() {
      return this.tools || (this.tools = {
        tbar: [{
          id: 'cancel',
          title: this.cancelText,
          svg: 'cancel',
          side: 'left',
          fn: this.onCancel,
          scope: ReUI
        }, {
          id: 'save',
          title: this.saveText,
          svg: 'check',
          fn: this.onSave,
          scope: this
        }]
      });
    },
    /**
     * Invoked when the toolbar cancel button is pressed.
     */
    onCancel: function onCancel() {
      ReUI.back();
    },
    /**
     * Invoked when the toolbar save button is pressed.
     */
    onSave: function onSave() {},
    moveUp: function moveUp(params) {
      var _this = this;

      var node = $(params.$source);
      var rows = node.parents('li');

      if (rows.length) {
        var prev = rows.prev('li');
        rows.insertBefore(prev);
        this.clearLastMoved();

        // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
        // initial state (the css transition won't fire)
        setTimeout(function () {
          rows.addClass(_this.lastMovedCls);
        }, 5);
      }
    },
    moveDown: function moveDown(params) {
      var _this2 = this;

      var node = $(params.$source);
      var rows = node.parents('li');

      if (rows.length) {
        var next = rows.next('li');
        rows.insertAfter(next);
        this.clearLastMoved();

        // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
        // initial state (the css transition won't fire)
        setTimeout(function () {
          rows.addClass(_this2.lastMovedCls);
        }, 5);
      }
    },
    clearLastMoved: function clearLastMoved() {
      var nodes = $('> li', this.contentNode);
      var cls = this.lastMovedCls;

      nodes.each(function (_, node) {
        $(node).removeClass(cls);
      });
    },
    activateEntry: function activateEntry() {
      this.clearLastMoved();
      this.inherited(activateEntry, arguments);
    },
    hasMoreData: function hasMoreData() {
      return false;
    },
    createStore: function createStore() {},
    /**
     * Queries the DOM and returns selected item's idProperty in order.
     * @return {Array}
     */
    getSelectedKeys: function getSelectedKeys() {
      var results = [];

      // Using forEach instead of map, because if we return a mapped NodeList to the caller, storing that in local storage will generate an error,
      // for some reason there is a _parent attribute on the NodeList that maeks it recursive.
      $('.list-item-selected', this.domNode).filter('[data-key]').each(function (_, node) {
        var key = $(node).attr('data-key');
        if (key) {
          results.push(key);
        }
      });

      return results;
    },
    /**
     * Queries the DOM and returns all of the idProperty attributes in order.
     * @return {Array}
     */
    getOrderedKeys: function getOrderedKeys() {
      var results = [];

      // Using forEach instead of map, because if we return a mapped NodeList to the caller, storing that in local storage will generate an error,
      // for some reason there is a _parent attribute on the NodeList that maeks it recursive.
      $('li', this.domNode).filter('[data-key]').each(function (_, node) {
        var key = $(node).attr('data-key');
        if (key) {
          results.push(key);
        }
      });

      return results;
    },
    /**
     * Returns an array of keys in the order they were saved previously. This list will contain selected and un-selected items.
     * @return {Array}
     */
    getSavedOrderedKeys: function getSavedOrderedKeys() {
      return [];
    },
    /**
     * Returns an array of keys that were saved/previously selected, in order. Previous un-selected items will not be in this list.
     * ProcessData invokes this to select items in the selection model when it loads.
     * @return {Array}
     */
    getSavedSelectedKeys: function getSavedSelectedKeys() {
      return [];
    },
    /**
     * Processes data from the store. Restores previously selected items by calling this.getSavedSelectedKeys()
     */
    processData: function processData() {
      this.inherited(processData, arguments);
      var visible = this.getSavedSelectedKeys();

      for (var i = 0; i < visible.length; i++) {
        var row = $('[data-key="' + visible[i] + '"]', this.domNode).get(0);
        if (row) {
          this._selectionModel.toggle(visible[i], this.entries[visible[i]], row);
        }
      }
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});