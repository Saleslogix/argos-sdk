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
   * @class
   * @alias module:argos/DateTimePicker
   * @extends module:argos/_Templated
   */
  var __class = (0, _declare2.default)('argos.DateTimePicker', [_WidgetBase3.default, _Templated3.default], /** @lends module:argos/DateTimePicker.prototype */{
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

  /**
   * @module argos/DateTimePicker
   */
  exports.default = __class;
  module.exports = exports['default'];
});