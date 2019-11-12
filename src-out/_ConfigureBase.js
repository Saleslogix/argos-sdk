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

  var editResource = (0, _I18n2.default)('editBase');

  /**
   * @class argos._ConfigureBase
   * @extends argos._ListBase
   */
  var __class = (0, _declare2.default)('argos._ConfigureBase', [_DraggableList2.default], /** @lends argos._ConfigureBase# */{
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
          id: 'save',
          title: this.saveText,
          svg: 'check',
          fn: this.onSave,
          scope: this
        }, {
          id: 'cancel',
          title: this.cancelText,
          svg: 'cancel',
          side: 'left',
          fn: this.onCancel,
          scope: ReUI
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
      this.inherited(arguments);
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
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fQ29uZmlndXJlQmFzZS5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsImVkaXRSZXNvdXJjZSIsIl9fY2xhc3MiLCJpdGVtVGVtcGxhdGUiLCJTaW1wbGF0ZSIsInRpdGxlVGV4dCIsInNhdmVUZXh0Iiwic2F2ZVRvb2x0aXBUZXh0IiwiY2FuY2VsVGV4dCIsImNhbmNlbFRvb2x0aXBUZXh0IiwiaWQiLCJleHBvc2UiLCJlbmFibGVTZWFyY2giLCJlbmFibGVQdWxsVG9SZWZyZXNoIiwic2VsZWN0aW9uT25seSIsImFsbG93U2VsZWN0aW9uIiwiYXV0b0NsZWFyU2VsZWN0aW9uIiwiY2xzIiwibGFzdE1vdmVkQ2xzIiwiY3JlYXRlVG9vbExheW91dCIsInRvb2xzIiwidGJhciIsInRpdGxlIiwic3ZnIiwiZm4iLCJvblNhdmUiLCJzY29wZSIsInNpZGUiLCJvbkNhbmNlbCIsIlJlVUkiLCJiYWNrIiwibW92ZVVwIiwicGFyYW1zIiwibm9kZSIsIiQiLCIkc291cmNlIiwicm93cyIsInBhcmVudHMiLCJsZW5ndGgiLCJwcmV2IiwiaW5zZXJ0QmVmb3JlIiwiY2xlYXJMYXN0TW92ZWQiLCJzZXRUaW1lb3V0IiwiYWRkQ2xhc3MiLCJtb3ZlRG93biIsIm5leHQiLCJpbnNlcnRBZnRlciIsIm5vZGVzIiwiY29udGVudE5vZGUiLCJlYWNoIiwiXyIsInJlbW92ZUNsYXNzIiwiYWN0aXZhdGVFbnRyeSIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsImhhc01vcmVEYXRhIiwiY3JlYXRlU3RvcmUiLCJnZXRTZWxlY3RlZEtleXMiLCJyZXN1bHRzIiwiZG9tTm9kZSIsImZpbHRlciIsImtleSIsImF0dHIiLCJwdXNoIiwiZ2V0T3JkZXJlZEtleXMiLCJnZXRTYXZlZE9yZGVyZWRLZXlzIiwiZ2V0U2F2ZWRTZWxlY3RlZEtleXMiLCJwcm9jZXNzRGF0YSIsInZpc2libGUiLCJpIiwicm93IiwiZ2V0IiwiX3NlbGVjdGlvbk1vZGVsIiwidG9nZ2xlIiwiZW50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LFVBQWIsQ0FBWjtBQUNBLFlBQUlELEdBQUosRUFBUztBQUNQSCxrQkFBUUssSUFBUixDQUFhRixHQUFiO0FBQ0Q7QUFDRixPQUxEOztBQU9BLGFBQU9ILE9BQVA7QUFDRCxLQTVJaUc7QUE2SWxHOzs7O0FBSUFPLHlCQUFxQixTQUFTQSxtQkFBVCxHQUErQjtBQUNsRCxhQUFPLEVBQVA7QUFDRCxLQW5KaUc7QUFvSmxHOzs7OztBQUtBQywwQkFBc0IsU0FBU0Esb0JBQVQsR0FBZ0M7QUFDcEQsYUFBTyxFQUFQO0FBQ0QsS0EzSmlHO0FBNEpsRzs7O0FBR0FDLGlCQUFhLFNBQVNBLFdBQVQsR0FBdUI7QUFDbEMsV0FBS2QsU0FBTCxDQUFlQyxTQUFmO0FBQ0EsVUFBTWMsVUFBVSxLQUFLRixvQkFBTCxFQUFoQjs7QUFFQSxXQUFLLElBQUlHLElBQUksQ0FBYixFQUFnQkEsSUFBSUQsUUFBUTlCLE1BQTVCLEVBQW9DK0IsR0FBcEMsRUFBeUM7QUFDdkMsWUFBTUMsTUFBTXBDLGtCQUFnQmtDLFFBQVFDLENBQVIsQ0FBaEIsU0FBZ0MsS0FBS1YsT0FBckMsRUFBOENZLEdBQTlDLENBQWtELENBQWxELENBQVo7QUFDQSxZQUFJRCxHQUFKLEVBQVM7QUFDUCxlQUFLRSxlQUFMLENBQXFCQyxNQUFyQixDQUE0QkwsUUFBUUMsQ0FBUixDQUE1QixFQUF3QyxLQUFLSyxPQUFMLENBQWFOLFFBQVFDLENBQVIsQ0FBYixDQUF4QyxFQUFrRUMsR0FBbEU7QUFDRDtBQUNGO0FBQ0Y7QUF6S2lHLEdBQXBGLENBQWhCOztvQkE0S2VwRSxPIiwiZmlsZSI6Il9Db25maWd1cmVCYXNlLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IERyYWdnYWJsZUxpc3QgZnJvbSAnLi9EcmFnZ2FibGVMaXN0JztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4vSTE4bic7XHJcblxyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnY29uZmlndXJlQmFzZScpO1xyXG5jb25zdCBlZGl0UmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnZWRpdEJhc2UnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX0NvbmZpZ3VyZUJhc2VcclxuICogQGV4dGVuZHMgYXJnb3MuX0xpc3RCYXNlXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuX0NvbmZpZ3VyZUJhc2UnLCBbRHJhZ2dhYmxlTGlzdF0sIC8qKiBAbGVuZHMgYXJnb3MuX0NvbmZpZ3VyZUJhc2UjICove1xyXG4gIC8vIFRlbXBsYXRlc1xyXG4gIGl0ZW1UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8aDQ+JyxcclxuICAgICc8c3Bhbj57JTogJC4kZGVzY3JpcHRvciAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvaDQ+JyxcclxuICAgIGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1pY29uIGhpZGUtZm9jdXMgZHJhZ2dhYmxlXCI+XHJcbiAgICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgPHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4bGluazpocmVmPVwiI2ljb24tZHJhZ1wiPjwvdXNlPlxyXG4gICAgICA8L3N2Zz5cclxuICAgIDwvYnV0dG9uPmAsXHJcbiAgXSksXHJcblxyXG4gIC8vIExvY2FsaXphdGlvblxyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG4gIHNhdmVUZXh0OiBlZGl0UmVzb3VyY2Uuc2F2ZVRvb2x0aXBUZXh0LFxyXG4gIGNhbmNlbFRleHQ6IGVkaXRSZXNvdXJjZS5jYW5jZWxUb29sdGlwVGV4dCxcclxuXHJcbiAgLy8gVmlldyBQcm9wZXJ0aWVzXHJcbiAgaWQ6ICdjb25maWd1cmVfYmFzZScsXHJcbiAgZXhwb3NlOiBmYWxzZSxcclxuICBlbmFibGVTZWFyY2g6IGZhbHNlLFxyXG4gIGVuYWJsZVB1bGxUb1JlZnJlc2g6IGZhbHNlLFxyXG4gIHNlbGVjdGlvbk9ubHk6IHRydWUsXHJcbiAgYWxsb3dTZWxlY3Rpb246IHRydWUsXHJcbiAgYXV0b0NsZWFyU2VsZWN0aW9uOiBmYWxzZSxcclxuICBjbHM6ICdjb25maWd1cmFibGUtbGlzdCcsXHJcbiAgbGFzdE1vdmVkQ2xzOiAnbGFzdC1tb3ZlZCcsXHJcblxyXG4gIGNyZWF0ZVRvb2xMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZVRvb2xMYXlvdXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy50b29scyB8fCAodGhpcy50b29scyA9IHtcclxuICAgICAgdGJhcjogW3tcclxuICAgICAgICBpZDogJ3NhdmUnLFxyXG4gICAgICAgIHRpdGxlOiB0aGlzLnNhdmVUZXh0LFxyXG4gICAgICAgIHN2ZzogJ2NoZWNrJyxcclxuICAgICAgICBmbjogdGhpcy5vblNhdmUsXHJcbiAgICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICAgIH0sIHtcclxuICAgICAgICBpZDogJ2NhbmNlbCcsXHJcbiAgICAgICAgdGl0bGU6IHRoaXMuY2FuY2VsVGV4dCxcclxuICAgICAgICBzdmc6ICdjYW5jZWwnLFxyXG4gICAgICAgIHNpZGU6ICdsZWZ0JyxcclxuICAgICAgICBmbjogdGhpcy5vbkNhbmNlbCxcclxuICAgICAgICBzY29wZTogUmVVSSxcclxuICAgICAgfV0sXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEludm9rZWQgd2hlbiB0aGUgdG9vbGJhciBjYW5jZWwgYnV0dG9uIGlzIHByZXNzZWQuXHJcbiAgICovXHJcbiAgb25DYW5jZWw6IGZ1bmN0aW9uIG9uQ2FuY2VsKCkge1xyXG4gICAgUmVVSS5iYWNrKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBJbnZva2VkIHdoZW4gdGhlIHRvb2xiYXIgc2F2ZSBidXR0b24gaXMgcHJlc3NlZC5cclxuICAgKi9cclxuICBvblNhdmU6IGZ1bmN0aW9uIG9uU2F2ZSgpIHt9LFxyXG4gIG1vdmVVcDogZnVuY3Rpb24gbW92ZVVwKHBhcmFtcykge1xyXG4gICAgY29uc3Qgbm9kZSA9ICQocGFyYW1zLiRzb3VyY2UpO1xyXG4gICAgY29uc3Qgcm93cyA9IG5vZGUucGFyZW50cygnbGknKTtcclxuXHJcbiAgICBpZiAocm93cy5sZW5ndGgpIHtcclxuICAgICAgY29uc3QgcHJldiA9IHJvd3MucHJldignbGknKTtcclxuICAgICAgcm93cy5pbnNlcnRCZWZvcmUocHJldik7XHJcbiAgICAgIHRoaXMuY2xlYXJMYXN0TW92ZWQoKTtcclxuXHJcbiAgICAgIC8vIFRoZSBzZXRUaW1lb3V0IGlzIHNvIHRoZSBicm93c2VyIGRvZXNuJ3QgdGhpbmsgdGhlIGxhc3QtbW92ZWQgY2xhc3MgaXMgcGFydCBvZiB0aGUgbm9kZSdzXHJcbiAgICAgIC8vIGluaXRpYWwgc3RhdGUgKHRoZSBjc3MgdHJhbnNpdGlvbiB3b24ndCBmaXJlKVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICByb3dzLmFkZENsYXNzKHRoaXMubGFzdE1vdmVkQ2xzKTtcclxuICAgICAgfSwgNSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBtb3ZlRG93bjogZnVuY3Rpb24gbW92ZURvd24ocGFyYW1zKSB7XHJcbiAgICBjb25zdCBub2RlID0gJChwYXJhbXMuJHNvdXJjZSk7XHJcbiAgICBjb25zdCByb3dzID0gbm9kZS5wYXJlbnRzKCdsaScpO1xyXG5cclxuICAgIGlmIChyb3dzLmxlbmd0aCkge1xyXG4gICAgICBjb25zdCBuZXh0ID0gcm93cy5uZXh0KCdsaScpO1xyXG4gICAgICByb3dzLmluc2VydEFmdGVyKG5leHQpO1xyXG4gICAgICB0aGlzLmNsZWFyTGFzdE1vdmVkKCk7XHJcblxyXG4gICAgICAvLyBUaGUgc2V0VGltZW91dCBpcyBzbyB0aGUgYnJvd3NlciBkb2Vzbid0IHRoaW5rIHRoZSBsYXN0LW1vdmVkIGNsYXNzIGlzIHBhcnQgb2YgdGhlIG5vZGUnc1xyXG4gICAgICAvLyBpbml0aWFsIHN0YXRlICh0aGUgY3NzIHRyYW5zaXRpb24gd29uJ3QgZmlyZSlcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgcm93cy5hZGRDbGFzcyh0aGlzLmxhc3RNb3ZlZENscyk7XHJcbiAgICAgIH0sIDUpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgY2xlYXJMYXN0TW92ZWQ6IGZ1bmN0aW9uIGNsZWFyTGFzdE1vdmVkKCkge1xyXG4gICAgY29uc3Qgbm9kZXMgPSAkKCc+IGxpJywgdGhpcy5jb250ZW50Tm9kZSk7XHJcbiAgICBjb25zdCBjbHMgPSB0aGlzLmxhc3RNb3ZlZENscztcclxuXHJcbiAgICBub2Rlcy5lYWNoKChfLCBub2RlKSA9PiB7XHJcbiAgICAgICQobm9kZSkucmVtb3ZlQ2xhc3MoY2xzKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgYWN0aXZhdGVFbnRyeTogZnVuY3Rpb24gYWN0aXZhdGVFbnRyeSgpIHtcclxuICAgIHRoaXMuY2xlYXJMYXN0TW92ZWQoKTtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBoYXNNb3JlRGF0YTogZnVuY3Rpb24gaGFzTW9yZURhdGEoKSB7XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuICBjcmVhdGVTdG9yZTogZnVuY3Rpb24gY3JlYXRlU3RvcmUoKSB7fSxcclxuICAvKipcclxuICAgKiBRdWVyaWVzIHRoZSBET00gYW5kIHJldHVybnMgc2VsZWN0ZWQgaXRlbSdzIGlkUHJvcGVydHkgaW4gb3JkZXIuXHJcbiAgICogQHJldHVybiB7QXJyYXl9XHJcbiAgICovXHJcbiAgZ2V0U2VsZWN0ZWRLZXlzOiBmdW5jdGlvbiBnZXRTZWxlY3RlZEtleXMoKSB7XHJcbiAgICBjb25zdCByZXN1bHRzID0gW107XHJcblxyXG4gICAgLy8gVXNpbmcgZm9yRWFjaCBpbnN0ZWFkIG9mIG1hcCwgYmVjYXVzZSBpZiB3ZSByZXR1cm4gYSBtYXBwZWQgTm9kZUxpc3QgdG8gdGhlIGNhbGxlciwgc3RvcmluZyB0aGF0IGluIGxvY2FsIHN0b3JhZ2Ugd2lsbCBnZW5lcmF0ZSBhbiBlcnJvcixcclxuICAgIC8vIGZvciBzb21lIHJlYXNvbiB0aGVyZSBpcyBhIF9wYXJlbnQgYXR0cmlidXRlIG9uIHRoZSBOb2RlTGlzdCB0aGF0IG1hZWtzIGl0IHJlY3Vyc2l2ZS5cclxuICAgICQoJy5saXN0LWl0ZW0tc2VsZWN0ZWQnLCB0aGlzLmRvbU5vZGUpLmZpbHRlcignW2RhdGEta2V5XScpLmVhY2goKF8sIG5vZGUpID0+IHtcclxuICAgICAgY29uc3Qga2V5ID0gJChub2RlKS5hdHRyKCdkYXRhLWtleScpO1xyXG4gICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgcmVzdWx0cy5wdXNoKGtleSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHRzO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUXVlcmllcyB0aGUgRE9NIGFuZCByZXR1cm5zIGFsbCBvZiB0aGUgaWRQcm9wZXJ0eSBhdHRyaWJ1dGVzIGluIG9yZGVyLlxyXG4gICAqIEByZXR1cm4ge0FycmF5fVxyXG4gICAqL1xyXG4gIGdldE9yZGVyZWRLZXlzOiBmdW5jdGlvbiBnZXRPcmRlcmVkS2V5cygpIHtcclxuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcclxuXHJcbiAgICAvLyBVc2luZyBmb3JFYWNoIGluc3RlYWQgb2YgbWFwLCBiZWNhdXNlIGlmIHdlIHJldHVybiBhIG1hcHBlZCBOb2RlTGlzdCB0byB0aGUgY2FsbGVyLCBzdG9yaW5nIHRoYXQgaW4gbG9jYWwgc3RvcmFnZSB3aWxsIGdlbmVyYXRlIGFuIGVycm9yLFxyXG4gICAgLy8gZm9yIHNvbWUgcmVhc29uIHRoZXJlIGlzIGEgX3BhcmVudCBhdHRyaWJ1dGUgb24gdGhlIE5vZGVMaXN0IHRoYXQgbWFla3MgaXQgcmVjdXJzaXZlLlxyXG4gICAgJCgnbGknLCB0aGlzLmRvbU5vZGUpLmZpbHRlcignW2RhdGEta2V5XScpLmVhY2goKF8sIG5vZGUpID0+IHtcclxuICAgICAgY29uc3Qga2V5ID0gJChub2RlKS5hdHRyKCdkYXRhLWtleScpO1xyXG4gICAgICBpZiAoa2V5KSB7XHJcbiAgICAgICAgcmVzdWx0cy5wdXNoKGtleSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiByZXN1bHRzO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBrZXlzIGluIHRoZSBvcmRlciB0aGV5IHdlcmUgc2F2ZWQgcHJldmlvdXNseS4gVGhpcyBsaXN0IHdpbGwgY29udGFpbiBzZWxlY3RlZCBhbmQgdW4tc2VsZWN0ZWQgaXRlbXMuXHJcbiAgICogQHJldHVybiB7QXJyYXl9XHJcbiAgICovXHJcbiAgZ2V0U2F2ZWRPcmRlcmVkS2V5czogZnVuY3Rpb24gZ2V0U2F2ZWRPcmRlcmVkS2V5cygpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYW4gYXJyYXkgb2Yga2V5cyB0aGF0IHdlcmUgc2F2ZWQvcHJldmlvdXNseSBzZWxlY3RlZCwgaW4gb3JkZXIuIFByZXZpb3VzIHVuLXNlbGVjdGVkIGl0ZW1zIHdpbGwgbm90IGJlIGluIHRoaXMgbGlzdC5cclxuICAgKiBQcm9jZXNzRGF0YSBpbnZva2VzIHRoaXMgdG8gc2VsZWN0IGl0ZW1zIGluIHRoZSBzZWxlY3Rpb24gbW9kZWwgd2hlbiBpdCBsb2Fkcy5cclxuICAgKiBAcmV0dXJuIHtBcnJheX1cclxuICAgKi9cclxuICBnZXRTYXZlZFNlbGVjdGVkS2V5czogZnVuY3Rpb24gZ2V0U2F2ZWRTZWxlY3RlZEtleXMoKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBQcm9jZXNzZXMgZGF0YSBmcm9tIHRoZSBzdG9yZS4gUmVzdG9yZXMgcHJldmlvdXNseSBzZWxlY3RlZCBpdGVtcyBieSBjYWxsaW5nIHRoaXMuZ2V0U2F2ZWRTZWxlY3RlZEtleXMoKVxyXG4gICAqL1xyXG4gIHByb2Nlc3NEYXRhOiBmdW5jdGlvbiBwcm9jZXNzRGF0YSgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCB2aXNpYmxlID0gdGhpcy5nZXRTYXZlZFNlbGVjdGVkS2V5cygpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlzaWJsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCByb3cgPSAkKGBbZGF0YS1rZXk9XCIke3Zpc2libGVbaV19XCJdYCwgdGhpcy5kb21Ob2RlKS5nZXQoMCk7XHJcbiAgICAgIGlmIChyb3cpIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC50b2dnbGUodmlzaWJsZVtpXSwgdGhpcy5lbnRyaWVzW3Zpc2libGVbaV1dLCByb3cpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=