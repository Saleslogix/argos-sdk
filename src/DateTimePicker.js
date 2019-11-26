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

import declare from 'dojo/_base/declare';
import _WidgetBase from 'dijit/_WidgetBase';
import _Templated from './_Templated';
import Calendar from './Calendar';
import TimePicker from './TimePicker';

/**
 * @class argos.DateTimePicker
 */
const __class = declare('argos.DateTimePicker', [_WidgetBase, _Templated], {
  widgetTemplate: new Simplate([
    '<div class="datetime-select" data-dojo-attach-point="dateTimeNode">',
    '</div>',
  ]),

  _calendarNode: null,
  _timeSelectNode: null,
  isModal: false,
  showTimePicker: false,

  init: function init() {
    this.inherited(init, arguments);
  },
  getContent: function getContent() {
    const data = {};
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
  show: function show(options = {}) {
    this.showTimePicker = options.showTimePicker;
    this.ensureOptions(options);
    if (!this._calendarNode) {
      this._calendarNode = new Calendar({ id: `datetime-calendar ${this.id}`, isModal: this.isModal || options.isModal });
      $(this.dateTimeNode).append(this._calendarNode.domNode);
      this._calendarNode.show(options);
      this._timeSelectNode = new TimePicker({ id: `datetime-timePicker ${this.id}`, showSetTime: false });
      $(this.dateTimeNode).append(this._timeSelectNode.domNode);
      this._timeSelectNode.show(options);
      if (!this.showTimePicker) {
        $(this._timeSelectNode.domNode).css({
          display: 'none',
        });
      }
    } else {
      this._calendarNode.show(options);
      if (this.showTimePicker) {
        this._timeSelectNode.show(options);
        $(this._timeSelectNode.domNode).css({
          display: 'block',
        });
      } else {
        $(this._timeSelectNode.domNode).css({
          display: 'none',
        });
      }
    }
  },
  ensureOptions: function ensureOptions(options) {
    if (options.date && (options.date instanceof Date) && (options.date.toString() === 'Invalid Date')) {
      if (options.timeless) {
        options.date = moment().toDate();
      } else {
        options.date = moment().toDate();
      }
    }
  },
});

export default __class;
