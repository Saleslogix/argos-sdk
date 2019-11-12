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
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9EYXRlVGltZVBpY2tlci5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsIl9jYWxlbmRhck5vZGUiLCJfdGltZVNlbGVjdE5vZGUiLCJpc01vZGFsIiwic2hvd1RpbWVQaWNrZXIiLCJpbml0IiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiZ2V0Q29udGVudCIsImRhdGEiLCJjYWxlbmRhciIsInRpbWUiLCJyZW1vdmVMaXN0ZW5lcnMiLCJzaG93Iiwib3B0aW9ucyIsImVuc3VyZU9wdGlvbnMiLCJpZCIsIiQiLCJkYXRlVGltZU5vZGUiLCJhcHBlbmQiLCJkb21Ob2RlIiwic2hvd1NldFRpbWUiLCJjc3MiLCJkaXNwbGF5IiwiZGF0ZSIsIkRhdGUiLCJ0b1N0cmluZyIsInRpbWVsZXNzIiwibW9tZW50IiwidG9EYXRlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkE7OztBQUdBLE1BQU1BLFVBQVUsdUJBQVEsc0JBQVIsRUFBZ0MsMkNBQWhDLEVBQTJEO0FBQ3pFQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLHFFQUQyQixFQUUzQixRQUYyQixDQUFiLENBRHlEOztBQU16RUMsbUJBQWUsSUFOMEQ7QUFPekVDLHFCQUFpQixJQVB3RDtBQVF6RUMsYUFBUyxLQVJnRTtBQVN6RUMsb0JBQWdCLEtBVHlEOztBQVd6RUMsVUFBTSxTQUFTQSxJQUFULEdBQWdCO0FBQ3BCLFdBQUtDLFNBQUwsQ0FBZUMsU0FBZjtBQUNELEtBYndFO0FBY3pFQyxnQkFBWSxTQUFTQSxVQUFULEdBQXNCO0FBQ2hDLFVBQU1DLE9BQU8sRUFBYjtBQUNBLFVBQUksS0FBS1IsYUFBTCxJQUFzQixLQUFLQSxhQUFMLENBQW1CTyxVQUE3QyxFQUF5RDtBQUN2REMsYUFBS0MsUUFBTCxHQUFnQixLQUFLVCxhQUFMLENBQW1CTyxVQUFuQixFQUFoQjtBQUNEO0FBQ0QsVUFBSSxLQUFLTixlQUFMLElBQXdCLEtBQUtBLGVBQUwsQ0FBcUJNLFVBQWpELEVBQTZEO0FBQzNEQyxhQUFLRSxJQUFMLEdBQVksS0FBS1QsZUFBTCxDQUFxQk0sVUFBckIsRUFBWjtBQUNEO0FBQ0QsYUFBT0MsSUFBUDtBQUNELEtBdkJ3RTtBQXdCekVHLHFCQUFpQixTQUFTQSxlQUFULEdBQTJCO0FBQzFDLFVBQUksS0FBS1gsYUFBTCxJQUFzQixLQUFLQSxhQUFMLENBQW1CVyxlQUE3QyxFQUE4RDtBQUM1RCxhQUFLWCxhQUFMLENBQW1CVyxlQUFuQjtBQUNEO0FBQ0QsVUFBSSxLQUFLVixlQUFMLElBQXdCLEtBQUtBLGVBQUwsQ0FBcUJVLGVBQWpELEVBQWtFO0FBQ2hFLGFBQUtWLGVBQUwsQ0FBcUJVLGVBQXJCO0FBQ0Q7QUFDRixLQS9Cd0U7QUFnQ3pFQyxVQUFNLFNBQVNBLElBQVQsR0FBNEI7QUFBQSxVQUFkQyxPQUFjLHVFQUFKLEVBQUk7O0FBQ2hDLFdBQUtWLGNBQUwsR0FBc0JVLFFBQVFWLGNBQTlCO0FBQ0EsV0FBS1csYUFBTCxDQUFtQkQsT0FBbkI7QUFDQSxVQUFJLENBQUMsS0FBS2IsYUFBVixFQUF5QjtBQUN2QixhQUFLQSxhQUFMLEdBQXFCLHVCQUFhLEVBQUVlLDJCQUF5QixLQUFLQSxFQUFoQyxFQUFzQ2IsU0FBUyxLQUFLQSxPQUFMLElBQWdCVyxRQUFRWCxPQUF2RSxFQUFiLENBQXJCO0FBQ0FjLFVBQUUsS0FBS0MsWUFBUCxFQUFxQkMsTUFBckIsQ0FBNEIsS0FBS2xCLGFBQUwsQ0FBbUJtQixPQUEvQztBQUNBLGFBQUtuQixhQUFMLENBQW1CWSxJQUFuQixDQUF3QkMsT0FBeEI7QUFDQSxhQUFLWixlQUFMLEdBQXVCLHlCQUFlLEVBQUVjLDZCQUEyQixLQUFLQSxFQUFsQyxFQUF3Q0ssYUFBYSxLQUFyRCxFQUFmLENBQXZCO0FBQ0FKLFVBQUUsS0FBS0MsWUFBUCxFQUFxQkMsTUFBckIsQ0FBNEIsS0FBS2pCLGVBQUwsQ0FBcUJrQixPQUFqRDtBQUNBLGFBQUtsQixlQUFMLENBQXFCVyxJQUFyQixDQUEwQkMsT0FBMUI7QUFDQSxZQUFJLENBQUMsS0FBS1YsY0FBVixFQUEwQjtBQUN4QmEsWUFBRSxLQUFLZixlQUFMLENBQXFCa0IsT0FBdkIsRUFBZ0NFLEdBQWhDLENBQW9DO0FBQ2xDQyxxQkFBUztBQUR5QixXQUFwQztBQUdEO0FBQ0YsT0FaRCxNQVlPO0FBQ0wsYUFBS3RCLGFBQUwsQ0FBbUJZLElBQW5CLENBQXdCQyxPQUF4QjtBQUNBLFlBQUksS0FBS1YsY0FBVCxFQUF5QjtBQUN2QixlQUFLRixlQUFMLENBQXFCVyxJQUFyQixDQUEwQkMsT0FBMUI7QUFDQUcsWUFBRSxLQUFLZixlQUFMLENBQXFCa0IsT0FBdkIsRUFBZ0NFLEdBQWhDLENBQW9DO0FBQ2xDQyxxQkFBUztBQUR5QixXQUFwQztBQUdELFNBTEQsTUFLTztBQUNMTixZQUFFLEtBQUtmLGVBQUwsQ0FBcUJrQixPQUF2QixFQUFnQ0UsR0FBaEMsQ0FBb0M7QUFDbENDLHFCQUFTO0FBRHlCLFdBQXBDO0FBR0Q7QUFDRjtBQUNGLEtBNUR3RTtBQTZEekVSLG1CQUFlLFNBQVNBLGFBQVQsQ0FBdUJELE9BQXZCLEVBQWdDO0FBQzdDLFVBQUlBLFFBQVFVLElBQVIsSUFBaUJWLFFBQVFVLElBQVIsWUFBd0JDLElBQXpDLElBQW1EWCxRQUFRVSxJQUFSLENBQWFFLFFBQWIsT0FBNEIsY0FBbkYsRUFBb0c7QUFDbEcsWUFBSVosUUFBUWEsUUFBWixFQUFzQjtBQUNwQmIsa0JBQVFVLElBQVIsR0FBZUksU0FBU0MsTUFBVCxFQUFmO0FBQ0QsU0FGRCxNQUVPO0FBQ0xmLGtCQUFRVSxJQUFSLEdBQWVJLFNBQVNDLE1BQVQsRUFBZjtBQUNEO0FBQ0Y7QUFDRjtBQXJFd0UsR0FBM0QsQ0FBaEIsQyxDQXhCQTs7Ozs7Ozs7Ozs7Ozs7O29CQWdHZS9CLE8iLCJmaWxlIjoiRGF0ZVRpbWVQaWNrZXIuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgX1dpZGdldEJhc2UgZnJvbSAnZGlqaXQvX1dpZGdldEJhc2UnO1xyXG5pbXBvcnQgX1RlbXBsYXRlZCBmcm9tICcuL19UZW1wbGF0ZWQnO1xyXG5pbXBvcnQgQ2FsZW5kYXIgZnJvbSAnLi9DYWxlbmRhcic7XHJcbmltcG9ydCBUaW1lUGlja2VyIGZyb20gJy4vVGltZVBpY2tlcic7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkRhdGVUaW1lUGlja2VyXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuRGF0ZVRpbWVQaWNrZXInLCBbX1dpZGdldEJhc2UsIF9UZW1wbGF0ZWRdLCB7XHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cImRhdGV0aW1lLXNlbGVjdFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJkYXRlVGltZU5vZGVcIj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcblxyXG4gIF9jYWxlbmRhck5vZGU6IG51bGwsXHJcbiAgX3RpbWVTZWxlY3ROb2RlOiBudWxsLFxyXG4gIGlzTW9kYWw6IGZhbHNlLFxyXG4gIHNob3dUaW1lUGlja2VyOiBmYWxzZSxcclxuXHJcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBnZXRDb250ZW50OiBmdW5jdGlvbiBnZXRDb250ZW50KCkge1xyXG4gICAgY29uc3QgZGF0YSA9IHt9O1xyXG4gICAgaWYgKHRoaXMuX2NhbGVuZGFyTm9kZSAmJiB0aGlzLl9jYWxlbmRhck5vZGUuZ2V0Q29udGVudCkge1xyXG4gICAgICBkYXRhLmNhbGVuZGFyID0gdGhpcy5fY2FsZW5kYXJOb2RlLmdldENvbnRlbnQoKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLl90aW1lU2VsZWN0Tm9kZSAmJiB0aGlzLl90aW1lU2VsZWN0Tm9kZS5nZXRDb250ZW50KSB7XHJcbiAgICAgIGRhdGEudGltZSA9IHRoaXMuX3RpbWVTZWxlY3ROb2RlLmdldENvbnRlbnQoKTtcclxuICAgIH1cclxuICAgIHJldHVybiBkYXRhO1xyXG4gIH0sXHJcbiAgcmVtb3ZlTGlzdGVuZXJzOiBmdW5jdGlvbiByZW1vdmVMaXN0ZW5lcnMoKSB7XHJcbiAgICBpZiAodGhpcy5fY2FsZW5kYXJOb2RlICYmIHRoaXMuX2NhbGVuZGFyTm9kZS5yZW1vdmVMaXN0ZW5lcnMpIHtcclxuICAgICAgdGhpcy5fY2FsZW5kYXJOb2RlLnJlbW92ZUxpc3RlbmVycygpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuX3RpbWVTZWxlY3ROb2RlICYmIHRoaXMuX3RpbWVTZWxlY3ROb2RlLnJlbW92ZUxpc3RlbmVycykge1xyXG4gICAgICB0aGlzLl90aW1lU2VsZWN0Tm9kZS5yZW1vdmVMaXN0ZW5lcnMoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHNob3c6IGZ1bmN0aW9uIHNob3cob3B0aW9ucyA9IHt9KSB7XHJcbiAgICB0aGlzLnNob3dUaW1lUGlja2VyID0gb3B0aW9ucy5zaG93VGltZVBpY2tlcjtcclxuICAgIHRoaXMuZW5zdXJlT3B0aW9ucyhvcHRpb25zKTtcclxuICAgIGlmICghdGhpcy5fY2FsZW5kYXJOb2RlKSB7XHJcbiAgICAgIHRoaXMuX2NhbGVuZGFyTm9kZSA9IG5ldyBDYWxlbmRhcih7IGlkOiBgZGF0ZXRpbWUtY2FsZW5kYXIgJHt0aGlzLmlkfWAsIGlzTW9kYWw6IHRoaXMuaXNNb2RhbCB8fCBvcHRpb25zLmlzTW9kYWwgfSk7XHJcbiAgICAgICQodGhpcy5kYXRlVGltZU5vZGUpLmFwcGVuZCh0aGlzLl9jYWxlbmRhck5vZGUuZG9tTm9kZSk7XHJcbiAgICAgIHRoaXMuX2NhbGVuZGFyTm9kZS5zaG93KG9wdGlvbnMpO1xyXG4gICAgICB0aGlzLl90aW1lU2VsZWN0Tm9kZSA9IG5ldyBUaW1lUGlja2VyKHsgaWQ6IGBkYXRldGltZS10aW1lUGlja2VyICR7dGhpcy5pZH1gLCBzaG93U2V0VGltZTogZmFsc2UgfSk7XHJcbiAgICAgICQodGhpcy5kYXRlVGltZU5vZGUpLmFwcGVuZCh0aGlzLl90aW1lU2VsZWN0Tm9kZS5kb21Ob2RlKTtcclxuICAgICAgdGhpcy5fdGltZVNlbGVjdE5vZGUuc2hvdyhvcHRpb25zKTtcclxuICAgICAgaWYgKCF0aGlzLnNob3dUaW1lUGlja2VyKSB7XHJcbiAgICAgICAgJCh0aGlzLl90aW1lU2VsZWN0Tm9kZS5kb21Ob2RlKS5jc3Moe1xyXG4gICAgICAgICAgZGlzcGxheTogJ25vbmUnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLl9jYWxlbmRhck5vZGUuc2hvdyhvcHRpb25zKTtcclxuICAgICAgaWYgKHRoaXMuc2hvd1RpbWVQaWNrZXIpIHtcclxuICAgICAgICB0aGlzLl90aW1lU2VsZWN0Tm9kZS5zaG93KG9wdGlvbnMpO1xyXG4gICAgICAgICQodGhpcy5fdGltZVNlbGVjdE5vZGUuZG9tTm9kZSkuY3NzKHtcclxuICAgICAgICAgIGRpc3BsYXk6ICdibG9jaycsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCh0aGlzLl90aW1lU2VsZWN0Tm9kZS5kb21Ob2RlKS5jc3Moe1xyXG4gICAgICAgICAgZGlzcGxheTogJ25vbmUnLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBlbnN1cmVPcHRpb25zOiBmdW5jdGlvbiBlbnN1cmVPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zLmRhdGUgJiYgKG9wdGlvbnMuZGF0ZSBpbnN0YW5jZW9mIERhdGUpICYmIChvcHRpb25zLmRhdGUudG9TdHJpbmcoKSA9PT0gJ0ludmFsaWQgRGF0ZScpKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLnRpbWVsZXNzKSB7XHJcbiAgICAgICAgb3B0aW9ucy5kYXRlID0gbW9tZW50KCkudG9EYXRlKCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgb3B0aW9ucy5kYXRlID0gbW9tZW50KCkudG9EYXRlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==