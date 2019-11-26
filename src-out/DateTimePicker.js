define('argos/DateTimePicker', ['module', 'exports', 'dojo/_base/declare', 'dijit/_WidgetBase', './_Templated', './Calendar', './TimePicker'], function (module, exports, _declare, _WidgetBase2, _Templated2, _Calendar, _TimePicker) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _Calendar2 = _interopRequireDefault(_Calendar);

  var _TimePicker2 = _interopRequireDefault(_TimePicker);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.DateTimePicker
   */
  var __class = (0, _declare2.default)('argos.DateTimePicker', [_WidgetBase3.default, _Templated3.default], {
    widgetTemplate: new Simplate(['<div class="datetime-select" data-dojo-attach-point="dateTimeNode">', '</div>']),

    _calendarNode: null,
    _timeSelectNode: null,
    isModal: false,
    showTimePicker: false,

    init: function init() {
      this.inherited(init, arguments);
    },
    getContent: function getContent() {
      var data = {};
      if (this._calendarNode && this._calendarNode.getContent) {
        data.calendar = this._calendarNode.getContent();
      }
      if (this._timeSelectNode && this._timeSelectNode.getContent) {
        data.time = this._timeSelectNode.getContent();
      }
      return data;
    },
    removeListeners: function removeListeners() {
      if (this._calendarNode && this._calendarNode.removeListeners) {
        this._calendarNode.removeListeners();
      }
      if (this._timeSelectNode && this._timeSelectNode.removeListeners) {
        this._timeSelectNode.removeListeners();
      }
    },
    show: function show() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.showTimePicker = options.showTimePicker;
      this.ensureOptions(options);
      if (!this._calendarNode) {
        this._calendarNode = new _Calendar2.default({ id: 'datetime-calendar ' + this.id, isModal: this.isModal || options.isModal });
        $(this.dateTimeNode).append(this._calendarNode.domNode);
        this._calendarNode.show(options);
        this._timeSelectNode = new _TimePicker2.default({ id: 'datetime-timePicker ' + this.id, showSetTime: false });
        $(this.dateTimeNode).append(this._timeSelectNode.domNode);
        this._timeSelectNode.show(options);
        if (!this.showTimePicker) {
          $(this._timeSelectNode.domNode).css({
            display: 'none'
          });
        }
      } else {
        this._calendarNode.show(options);
        if (this.showTimePicker) {
          this._timeSelectNode.show(options);
          $(this._timeSelectNode.domNode).css({
            display: 'block'
          });
        } else {
          $(this._timeSelectNode.domNode).css({
            display: 'none'
          });
        }
      }
    },
    ensureOptions: function ensureOptions(options) {
      if (options.date && options.date instanceof Date && options.date.toString() === 'Invalid Date') {
        if (options.timeless) {
          options.date = moment().toDate();
        } else {
          options.date = moment().toDate();
        }
      }
    }
  }); /* Copyright 2017 Infor
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

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EYXRlVGltZVBpY2tlci5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsIl9jYWxlbmRhck5vZGUiLCJfdGltZVNlbGVjdE5vZGUiLCJpc01vZGFsIiwic2hvd1RpbWVQaWNrZXIiLCJpbml0IiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiZ2V0Q29udGVudCIsImRhdGEiLCJjYWxlbmRhciIsInRpbWUiLCJyZW1vdmVMaXN0ZW5lcnMiLCJzaG93Iiwib3B0aW9ucyIsImVuc3VyZU9wdGlvbnMiLCJpZCIsIiQiLCJkYXRlVGltZU5vZGUiLCJhcHBlbmQiLCJkb21Ob2RlIiwic2hvd1NldFRpbWUiLCJjc3MiLCJkaXNwbGF5IiwiZGF0ZSIsIkRhdGUiLCJ0b1N0cmluZyIsInRpbWVsZXNzIiwibW9tZW50IiwidG9EYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkE7OztBQUdBLE1BQU1BLFVBQVUsdUJBQVEsc0JBQVIsRUFBZ0MsMkNBQWhDLEVBQTJEO0FBQ3pFQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLHFFQUQyQixFQUUzQixRQUYyQixDQUFiLENBRHlEOztBQU16RUMsbUJBQWUsSUFOMEQ7QUFPekVDLHFCQUFpQixJQVB3RDtBQVF6RUMsYUFBUyxLQVJnRTtBQVN6RUMsb0JBQWdCLEtBVHlEOztBQVd6RUMsVUFBTSxTQUFTQSxJQUFULEdBQWdCO0FBQ3BCLFdBQUtDLFNBQUwsQ0FBZUQsSUFBZixFQUFxQkUsU0FBckI7QUFDRCxLQWJ3RTtBQWN6RUMsZ0JBQVksU0FBU0EsVUFBVCxHQUFzQjtBQUNoQyxVQUFNQyxPQUFPLEVBQWI7QUFDQSxVQUFJLEtBQUtSLGFBQUwsSUFBc0IsS0FBS0EsYUFBTCxDQUFtQk8sVUFBN0MsRUFBeUQ7QUFDdkRDLGFBQUtDLFFBQUwsR0FBZ0IsS0FBS1QsYUFBTCxDQUFtQk8sVUFBbkIsRUFBaEI7QUFDRDtBQUNELFVBQUksS0FBS04sZUFBTCxJQUF3QixLQUFLQSxlQUFMLENBQXFCTSxVQUFqRCxFQUE2RDtBQUMzREMsYUFBS0UsSUFBTCxHQUFZLEtBQUtULGVBQUwsQ0FBcUJNLFVBQXJCLEVBQVo7QUFDRDtBQUNELGFBQU9DLElBQVA7QUFDRCxLQXZCd0U7QUF3QnpFRyxxQkFBaUIsU0FBU0EsZUFBVCxHQUEyQjtBQUMxQyxVQUFJLEtBQUtYLGFBQUwsSUFBc0IsS0FBS0EsYUFBTCxDQUFtQlcsZUFBN0MsRUFBOEQ7QUFDNUQsYUFBS1gsYUFBTCxDQUFtQlcsZUFBbkI7QUFDRDtBQUNELFVBQUksS0FBS1YsZUFBTCxJQUF3QixLQUFLQSxlQUFMLENBQXFCVSxlQUFqRCxFQUFrRTtBQUNoRSxhQUFLVixlQUFMLENBQXFCVSxlQUFyQjtBQUNEO0FBQ0YsS0EvQndFO0FBZ0N6RUMsVUFBTSxTQUFTQSxJQUFULEdBQTRCO0FBQUEsVUFBZEMsT0FBYyx1RUFBSixFQUFJOztBQUNoQyxXQUFLVixjQUFMLEdBQXNCVSxRQUFRVixjQUE5QjtBQUNBLFdBQUtXLGFBQUwsQ0FBbUJELE9BQW5CO0FBQ0EsVUFBSSxDQUFDLEtBQUtiLGFBQVYsRUFBeUI7QUFDdkIsYUFBS0EsYUFBTCxHQUFxQix1QkFBYSxFQUFFZSwyQkFBeUIsS0FBS0EsRUFBaEMsRUFBc0NiLFNBQVMsS0FBS0EsT0FBTCxJQUFnQlcsUUFBUVgsT0FBdkUsRUFBYixDQUFyQjtBQUNBYyxVQUFFLEtBQUtDLFlBQVAsRUFBcUJDLE1BQXJCLENBQTRCLEtBQUtsQixhQUFMLENBQW1CbUIsT0FBL0M7QUFDQSxhQUFLbkIsYUFBTCxDQUFtQlksSUFBbkIsQ0FBd0JDLE9BQXhCO0FBQ0EsYUFBS1osZUFBTCxHQUF1Qix5QkFBZSxFQUFFYyw2QkFBMkIsS0FBS0EsRUFBbEMsRUFBd0NLLGFBQWEsS0FBckQsRUFBZixDQUF2QjtBQUNBSixVQUFFLEtBQUtDLFlBQVAsRUFBcUJDLE1BQXJCLENBQTRCLEtBQUtqQixlQUFMLENBQXFCa0IsT0FBakQ7QUFDQSxhQUFLbEIsZUFBTCxDQUFxQlcsSUFBckIsQ0FBMEJDLE9BQTFCO0FBQ0EsWUFBSSxDQUFDLEtBQUtWLGNBQVYsRUFBMEI7QUFDeEJhLFlBQUUsS0FBS2YsZUFBTCxDQUFxQmtCLE9BQXZCLEVBQWdDRSxHQUFoQyxDQUFvQztBQUNsQ0MscUJBQVM7QUFEeUIsV0FBcEM7QUFHRDtBQUNGLE9BWkQsTUFZTztBQUNMLGFBQUt0QixhQUFMLENBQW1CWSxJQUFuQixDQUF3QkMsT0FBeEI7QUFDQSxZQUFJLEtBQUtWLGNBQVQsRUFBeUI7QUFDdkIsZUFBS0YsZUFBTCxDQUFxQlcsSUFBckIsQ0FBMEJDLE9BQTFCO0FBQ0FHLFlBQUUsS0FBS2YsZUFBTCxDQUFxQmtCLE9BQXZCLEVBQWdDRSxHQUFoQyxDQUFvQztBQUNsQ0MscUJBQVM7QUFEeUIsV0FBcEM7QUFHRCxTQUxELE1BS087QUFDTE4sWUFBRSxLQUFLZixlQUFMLENBQXFCa0IsT0FBdkIsRUFBZ0NFLEdBQWhDLENBQW9DO0FBQ2xDQyxxQkFBUztBQUR5QixXQUFwQztBQUdEO0FBQ0Y7QUFDRixLQTVEd0U7QUE2RHpFUixtQkFBZSxTQUFTQSxhQUFULENBQXVCRCxPQUF2QixFQUFnQztBQUM3QyxVQUFJQSxRQUFRVSxJQUFSLElBQWlCVixRQUFRVSxJQUFSLFlBQXdCQyxJQUF6QyxJQUFtRFgsUUFBUVUsSUFBUixDQUFhRSxRQUFiLE9BQTRCLGNBQW5GLEVBQW9HO0FBQ2xHLFlBQUlaLFFBQVFhLFFBQVosRUFBc0I7QUFDcEJiLGtCQUFRVSxJQUFSLEdBQWVJLFNBQVNDLE1BQVQsRUFBZjtBQUNELFNBRkQsTUFFTztBQUNMZixrQkFBUVUsSUFBUixHQUFlSSxTQUFTQyxNQUFULEVBQWY7QUFDRDtBQUNGO0FBQ0Y7QUFyRXdFLEdBQTNELENBQWhCLEMsQ0F4QkE7Ozs7Ozs7Ozs7Ozs7OztvQkFnR2UvQixPIiwiZmlsZSI6IkRhdGVUaW1lUGlja2VyLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IF9XaWRnZXRCYXNlIGZyb20gJ2Rpaml0L19XaWRnZXRCYXNlJztcclxuaW1wb3J0IF9UZW1wbGF0ZWQgZnJvbSAnLi9fVGVtcGxhdGVkJztcclxuaW1wb3J0IENhbGVuZGFyIGZyb20gJy4vQ2FsZW5kYXInO1xyXG5pbXBvcnQgVGltZVBpY2tlciBmcm9tICcuL1RpbWVQaWNrZXInO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5EYXRlVGltZVBpY2tlclxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLkRhdGVUaW1lUGlja2VyJywgW19XaWRnZXRCYXNlLCBfVGVtcGxhdGVkXSwge1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJkYXRldGltZS1zZWxlY3RcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiZGF0ZVRpbWVOb2RlXCI+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG5cclxuICBfY2FsZW5kYXJOb2RlOiBudWxsLFxyXG4gIF90aW1lU2VsZWN0Tm9kZTogbnVsbCxcclxuICBpc01vZGFsOiBmYWxzZSxcclxuICBzaG93VGltZVBpY2tlcjogZmFsc2UsXHJcblxyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChpbml0LCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgZ2V0Q29udGVudDogZnVuY3Rpb24gZ2V0Q29udGVudCgpIHtcclxuICAgIGNvbnN0IGRhdGEgPSB7fTtcclxuICAgIGlmICh0aGlzLl9jYWxlbmRhck5vZGUgJiYgdGhpcy5fY2FsZW5kYXJOb2RlLmdldENvbnRlbnQpIHtcclxuICAgICAgZGF0YS5jYWxlbmRhciA9IHRoaXMuX2NhbGVuZGFyTm9kZS5nZXRDb250ZW50KCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy5fdGltZVNlbGVjdE5vZGUgJiYgdGhpcy5fdGltZVNlbGVjdE5vZGUuZ2V0Q29udGVudCkge1xyXG4gICAgICBkYXRhLnRpbWUgPSB0aGlzLl90aW1lU2VsZWN0Tm9kZS5nZXRDb250ZW50KCk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZGF0YTtcclxuICB9LFxyXG4gIHJlbW92ZUxpc3RlbmVyczogZnVuY3Rpb24gcmVtb3ZlTGlzdGVuZXJzKCkge1xyXG4gICAgaWYgKHRoaXMuX2NhbGVuZGFyTm9kZSAmJiB0aGlzLl9jYWxlbmRhck5vZGUucmVtb3ZlTGlzdGVuZXJzKSB7XHJcbiAgICAgIHRoaXMuX2NhbGVuZGFyTm9kZS5yZW1vdmVMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl90aW1lU2VsZWN0Tm9kZSAmJiB0aGlzLl90aW1lU2VsZWN0Tm9kZS5yZW1vdmVMaXN0ZW5lcnMpIHtcclxuICAgICAgdGhpcy5fdGltZVNlbGVjdE5vZGUucmVtb3ZlTGlzdGVuZXJzKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBzaG93OiBmdW5jdGlvbiBzaG93KG9wdGlvbnMgPSB7fSkge1xyXG4gICAgdGhpcy5zaG93VGltZVBpY2tlciA9IG9wdGlvbnMuc2hvd1RpbWVQaWNrZXI7XHJcbiAgICB0aGlzLmVuc3VyZU9wdGlvbnMob3B0aW9ucyk7XHJcbiAgICBpZiAoIXRoaXMuX2NhbGVuZGFyTm9kZSkge1xyXG4gICAgICB0aGlzLl9jYWxlbmRhck5vZGUgPSBuZXcgQ2FsZW5kYXIoeyBpZDogYGRhdGV0aW1lLWNhbGVuZGFyICR7dGhpcy5pZH1gLCBpc01vZGFsOiB0aGlzLmlzTW9kYWwgfHwgb3B0aW9ucy5pc01vZGFsIH0pO1xyXG4gICAgICAkKHRoaXMuZGF0ZVRpbWVOb2RlKS5hcHBlbmQodGhpcy5fY2FsZW5kYXJOb2RlLmRvbU5vZGUpO1xyXG4gICAgICB0aGlzLl9jYWxlbmRhck5vZGUuc2hvdyhvcHRpb25zKTtcclxuICAgICAgdGhpcy5fdGltZVNlbGVjdE5vZGUgPSBuZXcgVGltZVBpY2tlcih7IGlkOiBgZGF0ZXRpbWUtdGltZVBpY2tlciAke3RoaXMuaWR9YCwgc2hvd1NldFRpbWU6IGZhbHNlIH0pO1xyXG4gICAgICAkKHRoaXMuZGF0ZVRpbWVOb2RlKS5hcHBlbmQodGhpcy5fdGltZVNlbGVjdE5vZGUuZG9tTm9kZSk7XHJcbiAgICAgIHRoaXMuX3RpbWVTZWxlY3ROb2RlLnNob3cob3B0aW9ucyk7XHJcbiAgICAgIGlmICghdGhpcy5zaG93VGltZVBpY2tlcikge1xyXG4gICAgICAgICQodGhpcy5fdGltZVNlbGVjdE5vZGUuZG9tTm9kZSkuY3NzKHtcclxuICAgICAgICAgIGRpc3BsYXk6ICdub25lJyxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5fY2FsZW5kYXJOb2RlLnNob3cob3B0aW9ucyk7XHJcbiAgICAgIGlmICh0aGlzLnNob3dUaW1lUGlja2VyKSB7XHJcbiAgICAgICAgdGhpcy5fdGltZVNlbGVjdE5vZGUuc2hvdyhvcHRpb25zKTtcclxuICAgICAgICAkKHRoaXMuX3RpbWVTZWxlY3ROb2RlLmRvbU5vZGUpLmNzcyh7XHJcbiAgICAgICAgICBkaXNwbGF5OiAnYmxvY2snLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQodGhpcy5fdGltZVNlbGVjdE5vZGUuZG9tTm9kZSkuY3NzKHtcclxuICAgICAgICAgIGRpc3BsYXk6ICdub25lJyxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZW5zdXJlT3B0aW9uczogZnVuY3Rpb24gZW5zdXJlT3B0aW9ucyhvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucy5kYXRlICYmIChvcHRpb25zLmRhdGUgaW5zdGFuY2VvZiBEYXRlKSAmJiAob3B0aW9ucy5kYXRlLnRvU3RyaW5nKCkgPT09ICdJbnZhbGlkIERhdGUnKSkge1xyXG4gICAgICBpZiAob3B0aW9ucy50aW1lbGVzcykge1xyXG4gICAgICAgIG9wdGlvbnMuZGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIG9wdGlvbnMuZGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=