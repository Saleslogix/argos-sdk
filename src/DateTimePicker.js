/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @class argos.DateTimePicker
 * @alternateClassName Date Time Select
 */
import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import _Widget from 'dijit/_Widget';
import _Templated from 'argos/_Templated';
import Calendar from './Calendar';
import TimePicker from './TimePicker';

const __class = declare('argos.DateTimePicker', [_Widget, _Templated], {
  widgetTemplate: new Simplate([
    '<div class="datetime-select" data-dojo-attach-point="dateTimeNode">',
    '</div>',
  ]),

  _calendarNode: null,
  _timeSelectNode: null,
  isModal: false,

  init: function init() {
    this.inherited(arguments);
  },
  getContent: function getContent() {
    return [ this._calendarNode, this._timeSelectNode ];
  },
  hideChildModals: function hideChildModals() {
    if (this._calendarNode.hideModals) {
      this._calendarNode.hideModals();
    }
    if (this._timeSelectNode.hideModals) {
      this._timeSelectNode.hideModals();
    }
  },
  show: function show(options = {}) {
    if (!this._calendarNode && !this._timeSelectNode) {
      this._calendarNode = new Calendar({ id: 'datetime-calendar ' + this.id, isModal: this.isModal || options.isModal});
      this._timeSelectNode = new TimePicker({ id: 'datetime-timePicker ' + this.id, showSetTime: false });
      domConstruct.place(this._calendarNode.domNode, this.dateTimeNode);
      domConstruct.place(this._timeSelectNode.domNode, this.dateTimeNode);
      this._calendarNode.show(options);
      this._timeSelectNode.show(options);
    }
  },
});

export default __class;
