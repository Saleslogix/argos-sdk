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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fQ29uZmlndXJlQmFzZS5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsImVkaXRSZXNvdXJjZSIsIl9fY2xhc3MiLCJpdGVtVGVtcGxhdGUiLCJTaW1wbGF0ZSIsInRpdGxlVGV4dCIsInNhdmVUZXh0Iiwic2F2ZVRvb2x0aXBUZXh0IiwiY2FuY2VsVGV4dCIsImNhbmNlbFRvb2x0aXBUZXh0IiwiaWQiLCJleHBvc2UiLCJlbmFibGVTZWFyY2giLCJlbmFibGVQdWxsVG9SZWZyZXNoIiwic2VsZWN0aW9uT25seSIsImFsbG93U2VsZWN0aW9uIiwiYXV0b0NsZWFyU2VsZWN0aW9uIiwiY2xzIiwibGFzdE1vdmVkQ2xzIiwiY3JlYXRlVG9vbExheW91dCIsInRvb2xzIiwidGJhciIsInRpdGxlIiwic3ZnIiwiZm4iLCJvblNhdmUiLCJzY29wZSIsInNpZGUiLCJvbkNhbmNlbCIsIlJlVUkiLCJiYWNrIiwibW92ZVVwIiwicGFyYW1zIiwibm9kZSIsIiQiLCIkc291cmNlIiwicm93cyIsInBhcmVudHMiLCJsZW5ndGgiLCJwcmV2IiwiaW5zZXJ0QmVmb3JlIiwiY2xlYXJMYXN0TW92ZWQiLCJzZXRUaW1lb3V0IiwiYWRkQ2xhc3MiLCJtb3ZlRG93biIsIm5leHQiLCJpbnNlcnRBZnRlciIsIm5vZGVzIiwiY29udGVudE5vZGUiLCJlYWNoIiwiXyIsInJlbW92ZUNsYXNzIiwiYWN0aXZhdGVFbnRyeSIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsImhhc01vcmVEYXRhIiwiY3JlYXRlU3RvcmUiLCJnZXRTZWxlY3RlZEtleXMiLCJyZXN1bHRzIiwiZG9tTm9kZSIsImZpbHRlciIsImtleSIsImF0dHIiLCJwdXNoIiwiZ2V0T3JkZXJlZEtleXMiLCJnZXRTYXZlZE9yZGVyZWRLZXlzIiwiZ2V0U2F2ZWRTZWxlY3RlZEtleXMiLCJwcm9jZXNzRGF0YSIsInZpc2libGUiLCJpIiwicm93IiwiZ2V0IiwiX3NlbGVjdGlvbk1vZGVsIiwidG9nZ2xlIiwiZW50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UTZCLElBQVIsQ0FBYSxVQUFiLENBQVo7QUFDQSxZQUFJRCxHQUFKLEVBQVM7QUFDUEgsa0JBQVFLLElBQVIsQ0FBYUYsR0FBYjtBQUNEO0FBQ0YsT0FMRDs7QUFPQSxhQUFPSCxPQUFQO0FBQ0QsS0E1SWlHO0FBNklsRzs7OztBQUlBTyx5QkFBcUIsU0FBU0EsbUJBQVQsR0FBK0I7QUFDbEQsYUFBTyxFQUFQO0FBQ0QsS0FuSmlHO0FBb0psRzs7Ozs7QUFLQUMsMEJBQXNCLFNBQVNBLG9CQUFULEdBQWdDO0FBQ3BELGFBQU8sRUFBUDtBQUNELEtBM0ppRztBQTRKbEc7OztBQUdBQyxpQkFBYSxTQUFTQSxXQUFULEdBQXVCO0FBQ2xDLFdBQUtkLFNBQUwsQ0FBZWMsV0FBZixFQUE0QmIsU0FBNUI7QUFDQSxVQUFNYyxVQUFVLEtBQUtGLG9CQUFMLEVBQWhCOztBQUVBLFdBQUssSUFBSUcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJRCxRQUFROUIsTUFBNUIsRUFBb0MrQixHQUFwQyxFQUF5QztBQUN2QyxZQUFNQyxNQUFNcEMsa0JBQWdCa0MsUUFBUUMsQ0FBUixDQUFoQixTQUFnQyxLQUFLVixPQUFyQyxFQUE4Q1ksR0FBOUMsQ0FBa0QsQ0FBbEQsQ0FBWjtBQUNBLFlBQUlELEdBQUosRUFBUztBQUNQLGVBQUtFLGVBQUwsQ0FBcUJDLE1BQXJCLENBQTRCTCxRQUFRQyxDQUFSLENBQTVCLEVBQXdDLEtBQUtLLE9BQUwsQ0FBYU4sUUFBUUMsQ0FBUixDQUFiLENBQXhDLEVBQWtFQyxHQUFsRTtBQUNEO0FBQ0Y7QUFDRjtBQXpLaUcsR0FBcEYsQ0FBaEI7O29CQTRLZXBFLE8iLCJmaWxlIjoiX0NvbmZpZ3VyZUJhc2UuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgRHJhZ2dhYmxlTGlzdCBmcm9tICcuL0RyYWdnYWJsZUxpc3QnO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi9JMThuJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdjb25maWd1cmVCYXNlJyk7XHJcbmNvbnN0IGVkaXRSZXNvdXJjZSA9IGdldFJlc291cmNlKCdlZGl0QmFzZScpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5fQ29uZmlndXJlQmFzZVxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5fTGlzdEJhc2VcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fQ29uZmlndXJlQmFzZScsIFtEcmFnZ2FibGVMaXN0XSwgLyoqIEBsZW5kcyBhcmdvcy5fQ29uZmlndXJlQmFzZSMgKi97XHJcbiAgLy8gVGVtcGxhdGVzXHJcbiAgaXRlbVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxoND4nLFxyXG4gICAgJzxzcGFuPnslOiAkLiRkZXNjcmlwdG9yICV9PC9zcGFuPicsXHJcbiAgICAnPC9oND4nLFxyXG4gICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWljb24gaGlkZS1mb2N1cyBkcmFnZ2FibGVcIj5cclxuICAgICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhsaW5rOmhyZWY9XCIjaWNvbi1kcmFnXCI+PC91c2U+XHJcbiAgICAgIDwvc3ZnPlxyXG4gICAgPC9idXR0b24+YCxcclxuICBdKSxcclxuXHJcbiAgLy8gTG9jYWxpemF0aW9uXHJcbiAgdGl0bGVUZXh0OiByZXNvdXJjZS50aXRsZVRleHQsXHJcbiAgc2F2ZVRleHQ6IGVkaXRSZXNvdXJjZS5zYXZlVG9vbHRpcFRleHQsXHJcbiAgY2FuY2VsVGV4dDogZWRpdFJlc291cmNlLmNhbmNlbFRvb2x0aXBUZXh0LFxyXG5cclxuICAvLyBWaWV3IFByb3BlcnRpZXNcclxuICBpZDogJ2NvbmZpZ3VyZV9iYXNlJyxcclxuICBleHBvc2U6IGZhbHNlLFxyXG4gIGVuYWJsZVNlYXJjaDogZmFsc2UsXHJcbiAgZW5hYmxlUHVsbFRvUmVmcmVzaDogZmFsc2UsXHJcbiAgc2VsZWN0aW9uT25seTogdHJ1ZSxcclxuICBhbGxvd1NlbGVjdGlvbjogdHJ1ZSxcclxuICBhdXRvQ2xlYXJTZWxlY3Rpb246IGZhbHNlLFxyXG4gIGNsczogJ2NvbmZpZ3VyYWJsZS1saXN0JyxcclxuICBsYXN0TW92ZWRDbHM6ICdsYXN0LW1vdmVkJyxcclxuXHJcbiAgY3JlYXRlVG9vbExheW91dDogZnVuY3Rpb24gY3JlYXRlVG9vbExheW91dCgpIHtcclxuICAgIHJldHVybiB0aGlzLnRvb2xzIHx8ICh0aGlzLnRvb2xzID0ge1xyXG4gICAgICB0YmFyOiBbe1xyXG4gICAgICAgIGlkOiAnc2F2ZScsXHJcbiAgICAgICAgdGl0bGU6IHRoaXMuc2F2ZVRleHQsXHJcbiAgICAgICAgc3ZnOiAnY2hlY2snLFxyXG4gICAgICAgIGZuOiB0aGlzLm9uU2F2ZSxcclxuICAgICAgICBzY29wZTogdGhpcyxcclxuICAgICAgfSwge1xyXG4gICAgICAgIGlkOiAnY2FuY2VsJyxcclxuICAgICAgICB0aXRsZTogdGhpcy5jYW5jZWxUZXh0LFxyXG4gICAgICAgIHN2ZzogJ2NhbmNlbCcsXHJcbiAgICAgICAgc2lkZTogJ2xlZnQnLFxyXG4gICAgICAgIGZuOiB0aGlzLm9uQ2FuY2VsLFxyXG4gICAgICAgIHNjb3BlOiBSZVVJLFxyXG4gICAgICB9XSxcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSW52b2tlZCB3aGVuIHRoZSB0b29sYmFyIGNhbmNlbCBidXR0b24gaXMgcHJlc3NlZC5cclxuICAgKi9cclxuICBvbkNhbmNlbDogZnVuY3Rpb24gb25DYW5jZWwoKSB7XHJcbiAgICBSZVVJLmJhY2soKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEludm9rZWQgd2hlbiB0aGUgdG9vbGJhciBzYXZlIGJ1dHRvbiBpcyBwcmVzc2VkLlxyXG4gICAqL1xyXG4gIG9uU2F2ZTogZnVuY3Rpb24gb25TYXZlKCkge30sXHJcbiAgbW92ZVVwOiBmdW5jdGlvbiBtb3ZlVXAocGFyYW1zKSB7XHJcbiAgICBjb25zdCBub2RlID0gJChwYXJhbXMuJHNvdXJjZSk7XHJcbiAgICBjb25zdCByb3dzID0gbm9kZS5wYXJlbnRzKCdsaScpO1xyXG5cclxuICAgIGlmIChyb3dzLmxlbmd0aCkge1xyXG4gICAgICBjb25zdCBwcmV2ID0gcm93cy5wcmV2KCdsaScpO1xyXG4gICAgICByb3dzLmluc2VydEJlZm9yZShwcmV2KTtcclxuICAgICAgdGhpcy5jbGVhckxhc3RNb3ZlZCgpO1xyXG5cclxuICAgICAgLy8gVGhlIHNldFRpbWVvdXQgaXMgc28gdGhlIGJyb3dzZXIgZG9lc24ndCB0aGluayB0aGUgbGFzdC1tb3ZlZCBjbGFzcyBpcyBwYXJ0IG9mIHRoZSBub2RlJ3NcclxuICAgICAgLy8gaW5pdGlhbCBzdGF0ZSAodGhlIGNzcyB0cmFuc2l0aW9uIHdvbid0IGZpcmUpXHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHJvd3MuYWRkQ2xhc3ModGhpcy5sYXN0TW92ZWRDbHMpO1xyXG4gICAgICB9LCA1KTtcclxuICAgIH1cclxuICB9LFxyXG4gIG1vdmVEb3duOiBmdW5jdGlvbiBtb3ZlRG93bihwYXJhbXMpIHtcclxuICAgIGNvbnN0IG5vZGUgPSAkKHBhcmFtcy4kc291cmNlKTtcclxuICAgIGNvbnN0IHJvd3MgPSBub2RlLnBhcmVudHMoJ2xpJyk7XHJcblxyXG4gICAgaWYgKHJvd3MubGVuZ3RoKSB7XHJcbiAgICAgIGNvbnN0IG5leHQgPSByb3dzLm5leHQoJ2xpJyk7XHJcbiAgICAgIHJvd3MuaW5zZXJ0QWZ0ZXIobmV4dCk7XHJcbiAgICAgIHRoaXMuY2xlYXJMYXN0TW92ZWQoKTtcclxuXHJcbiAgICAgIC8vIFRoZSBzZXRUaW1lb3V0IGlzIHNvIHRoZSBicm93c2VyIGRvZXNuJ3QgdGhpbmsgdGhlIGxhc3QtbW92ZWQgY2xhc3MgaXMgcGFydCBvZiB0aGUgbm9kZSdzXHJcbiAgICAgIC8vIGluaXRpYWwgc3RhdGUgKHRoZSBjc3MgdHJhbnNpdGlvbiB3b24ndCBmaXJlKVxyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICByb3dzLmFkZENsYXNzKHRoaXMubGFzdE1vdmVkQ2xzKTtcclxuICAgICAgfSwgNSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjbGVhckxhc3RNb3ZlZDogZnVuY3Rpb24gY2xlYXJMYXN0TW92ZWQoKSB7XHJcbiAgICBjb25zdCBub2RlcyA9ICQoJz4gbGknLCB0aGlzLmNvbnRlbnROb2RlKTtcclxuICAgIGNvbnN0IGNscyA9IHRoaXMubGFzdE1vdmVkQ2xzO1xyXG5cclxuICAgIG5vZGVzLmVhY2goKF8sIG5vZGUpID0+IHtcclxuICAgICAgJChub2RlKS5yZW1vdmVDbGFzcyhjbHMpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBhY3RpdmF0ZUVudHJ5OiBmdW5jdGlvbiBhY3RpdmF0ZUVudHJ5KCkge1xyXG4gICAgdGhpcy5jbGVhckxhc3RNb3ZlZCgpO1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYWN0aXZhdGVFbnRyeSwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIGhhc01vcmVEYXRhOiBmdW5jdGlvbiBoYXNNb3JlRGF0YSgpIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIGNyZWF0ZVN0b3JlOiBmdW5jdGlvbiBjcmVhdGVTdG9yZSgpIHt9LFxyXG4gIC8qKlxyXG4gICAqIFF1ZXJpZXMgdGhlIERPTSBhbmQgcmV0dXJucyBzZWxlY3RlZCBpdGVtJ3MgaWRQcm9wZXJ0eSBpbiBvcmRlci5cclxuICAgKiBAcmV0dXJuIHtBcnJheX1cclxuICAgKi9cclxuICBnZXRTZWxlY3RlZEtleXM6IGZ1bmN0aW9uIGdldFNlbGVjdGVkS2V5cygpIHtcclxuICAgIGNvbnN0IHJlc3VsdHMgPSBbXTtcclxuXHJcbiAgICAvLyBVc2luZyBmb3JFYWNoIGluc3RlYWQgb2YgbWFwLCBiZWNhdXNlIGlmIHdlIHJldHVybiBhIG1hcHBlZCBOb2RlTGlzdCB0byB0aGUgY2FsbGVyLCBzdG9yaW5nIHRoYXQgaW4gbG9jYWwgc3RvcmFnZSB3aWxsIGdlbmVyYXRlIGFuIGVycm9yLFxyXG4gICAgLy8gZm9yIHNvbWUgcmVhc29uIHRoZXJlIGlzIGEgX3BhcmVudCBhdHRyaWJ1dGUgb24gdGhlIE5vZGVMaXN0IHRoYXQgbWFla3MgaXQgcmVjdXJzaXZlLlxyXG4gICAgJCgnLmxpc3QtaXRlbS1zZWxlY3RlZCcsIHRoaXMuZG9tTm9kZSkuZmlsdGVyKCdbZGF0YS1rZXldJykuZWFjaCgoXywgbm9kZSkgPT4ge1xyXG4gICAgICBjb25zdCBrZXkgPSAkKG5vZGUpLmF0dHIoJ2RhdGEta2V5Jyk7XHJcbiAgICAgIGlmIChrZXkpIHtcclxuICAgICAgICByZXN1bHRzLnB1c2goa2V5KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBRdWVyaWVzIHRoZSBET00gYW5kIHJldHVybnMgYWxsIG9mIHRoZSBpZFByb3BlcnR5IGF0dHJpYnV0ZXMgaW4gb3JkZXIuXHJcbiAgICogQHJldHVybiB7QXJyYXl9XHJcbiAgICovXHJcbiAgZ2V0T3JkZXJlZEtleXM6IGZ1bmN0aW9uIGdldE9yZGVyZWRLZXlzKCkge1xyXG4gICAgY29uc3QgcmVzdWx0cyA9IFtdO1xyXG5cclxuICAgIC8vIFVzaW5nIGZvckVhY2ggaW5zdGVhZCBvZiBtYXAsIGJlY2F1c2UgaWYgd2UgcmV0dXJuIGEgbWFwcGVkIE5vZGVMaXN0IHRvIHRoZSBjYWxsZXIsIHN0b3JpbmcgdGhhdCBpbiBsb2NhbCBzdG9yYWdlIHdpbGwgZ2VuZXJhdGUgYW4gZXJyb3IsXHJcbiAgICAvLyBmb3Igc29tZSByZWFzb24gdGhlcmUgaXMgYSBfcGFyZW50IGF0dHJpYnV0ZSBvbiB0aGUgTm9kZUxpc3QgdGhhdCBtYWVrcyBpdCByZWN1cnNpdmUuXHJcbiAgICAkKCdsaScsIHRoaXMuZG9tTm9kZSkuZmlsdGVyKCdbZGF0YS1rZXldJykuZWFjaCgoXywgbm9kZSkgPT4ge1xyXG4gICAgICBjb25zdCBrZXkgPSAkKG5vZGUpLmF0dHIoJ2RhdGEta2V5Jyk7XHJcbiAgICAgIGlmIChrZXkpIHtcclxuICAgICAgICByZXN1bHRzLnB1c2goa2V5KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHJlc3VsdHM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIGFuIGFycmF5IG9mIGtleXMgaW4gdGhlIG9yZGVyIHRoZXkgd2VyZSBzYXZlZCBwcmV2aW91c2x5LiBUaGlzIGxpc3Qgd2lsbCBjb250YWluIHNlbGVjdGVkIGFuZCB1bi1zZWxlY3RlZCBpdGVtcy5cclxuICAgKiBAcmV0dXJuIHtBcnJheX1cclxuICAgKi9cclxuICBnZXRTYXZlZE9yZGVyZWRLZXlzOiBmdW5jdGlvbiBnZXRTYXZlZE9yZGVyZWRLZXlzKCkge1xyXG4gICAgcmV0dXJuIFtdO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBrZXlzIHRoYXQgd2VyZSBzYXZlZC9wcmV2aW91c2x5IHNlbGVjdGVkLCBpbiBvcmRlci4gUHJldmlvdXMgdW4tc2VsZWN0ZWQgaXRlbXMgd2lsbCBub3QgYmUgaW4gdGhpcyBsaXN0LlxyXG4gICAqIFByb2Nlc3NEYXRhIGludm9rZXMgdGhpcyB0byBzZWxlY3QgaXRlbXMgaW4gdGhlIHNlbGVjdGlvbiBtb2RlbCB3aGVuIGl0IGxvYWRzLlxyXG4gICAqIEByZXR1cm4ge0FycmF5fVxyXG4gICAqL1xyXG4gIGdldFNhdmVkU2VsZWN0ZWRLZXlzOiBmdW5jdGlvbiBnZXRTYXZlZFNlbGVjdGVkS2V5cygpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFByb2Nlc3NlcyBkYXRhIGZyb20gdGhlIHN0b3JlLiBSZXN0b3JlcyBwcmV2aW91c2x5IHNlbGVjdGVkIGl0ZW1zIGJ5IGNhbGxpbmcgdGhpcy5nZXRTYXZlZFNlbGVjdGVkS2V5cygpXHJcbiAgICovXHJcbiAgcHJvY2Vzc0RhdGE6IGZ1bmN0aW9uIHByb2Nlc3NEYXRhKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQocHJvY2Vzc0RhdGEsIGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCB2aXNpYmxlID0gdGhpcy5nZXRTYXZlZFNlbGVjdGVkS2V5cygpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdmlzaWJsZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCByb3cgPSAkKGBbZGF0YS1rZXk9XCIke3Zpc2libGVbaV19XCJdYCwgdGhpcy5kb21Ob2RlKS5nZXQoMCk7XHJcbiAgICAgIGlmIChyb3cpIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC50b2dnbGUodmlzaWJsZVtpXSwgdGhpcy5lbnRyaWVzW3Zpc2libGVbaV1dLCByb3cpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=