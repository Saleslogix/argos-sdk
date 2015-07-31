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
 * @class argos.TimePicker
 * @alternateClassName Time Select
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import _Widget from 'dijit/_Widget';
import _Templated from 'argos/_Templated';
import Modal from './Modal';

var __class = declare('argos.TimePicker', [_Widget, _Templated], {
  widgetTemplate: new Simplate([
    '<div class="time-select panel">',
      '<div class="time-parts">',
      '{%! $.hourSelectTemplate %}',
      ' : ',
      '{%! $.minuteSelectTemplate %}',
      '{%! $.meridiemSelectTemplate %}',
      '</div>',
        '{% if ($.showSetTime) { %}',
          '<div class="button tertiary">{%= $.setTimeText %}</div>',
        '{% } %}',
    '</div>'
  ]),
  hourSelectTemplate: new Simplate([
    '<div class="dropdown">',
      '<input class="hours" data-dojo-attach-point="hourNode" data-action="toggleHours"></input>',
      '<span class="fa fa-caret-down"></span>',
    '</div>'
  ]),
  minuteSelectTemplate: new Simplate([
    '<div class="dropdown" data-dojo-attach-point="minuteNode">',
      '<input class="minutes" data-dojo-attach-point="minutesNode" data-action="toggleMinutes"></input>',
      '<span class="fa fa-caret-down"></span>',
    '</div>'
  ]),
  meridiemSelectTemplate: new Simplate([
    '<div class="toggle toggle-horizontal meridiem-field" data-action="toggleMeridiem" data-dojo-attach-point="meridiemNode">',
        '<span class="thumb horizontal"></span>',
        '<span class="toggleOn">{%= $.amText %}</span>',
        '<span class="toggleOff">{%= $.pmText %}</span>',
    '</div>'
  ]),
  listStartTemplate: new Simplate([
    '<ul class="list">'
  ]),
  listEndTemplate: new Simplate([
    '</ul>'
  ]),
  listItemTemplate: new Simplate([
    '<li class="list-item">{%= $.value }</li>'
  ]),

  amText: 'AM',
  pmText: 'PM',
  setTimeText: 'Set Time',

  timeValue: null,
  _hourModal: null,
  _minuteModal: null,
  showSetTime: true,
  hourValues: [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12
  ],
  minuteValues: [
    5,
    10,
    15,
    20,
    25,
    30,
    35,
    40,
    45,
    50,
    55
  ],

  createHourModal: function() {
    this._hourModal = new Modal({ id: 'hour-modal', showBackdrop: false, positioning: 'right' });
    this._hourModal.placeModal(this.domNode)
                   .setContentPicklist(hourValues);
    return this;
  },
  createMinuteModal: function() {
    this._minuteModal = new Modal({ id: 'minute-modal', showBackdrop: false, positioning: 'right' });
    this._minuteModal.placeModal(this.domNode)
                     .setContentPicklist(minuteValues);
    return this;
  },
  init: function() {
    this.inherited(arguments);
    this.createHourModal()
        .createMinuteModal();
  },
  setTimeValue: function() {
    if (!this._isTimeless()) {
      this.timeValue.hours = parseInt(this.hourNode.value, 10);
      this.timeValue.minutes = parseInt(this.minuteNode.value, 10);
      this.timeValue.isPM = this.is24hrTimeFormat ? (11 < hours) : domAttr.get(this.meridiemNode, 'toggled') !== true;

      this.timeValue.hours = this.timeValue.isPM
         ? (this.timeValue.hours % 12) + 12
         : (this.timeValue.hours % 12);
    }
    return this;
  },
  toggleHours: function(params = {}) {
    this._hourModal.showModal(params.$source);
  },
  toggleMeridiem: function(params = {}) {
      var el = params.$source,
          toggledValue = el && (domAttr.get(el, 'toggled') !== true);

      if (el) {
          domClass.toggle(el, 'toggleStateOn');
          domAttr.set(el, 'toggled', toggledValue);
      }
  },
  toggleMinutes: function(params = {}) {
    this._minuteModal.showModal(params.$source);
  },
  _isTimeless: function() {
    return (this.options && this.options.timeless) || this.timeless;
  }
});

lang.setObject('Sage.Platform.Mobile.TimePicker', __class);
export default __class;
