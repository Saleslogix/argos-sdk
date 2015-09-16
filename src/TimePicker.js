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
import event from 'dojo/_base/event';
import connect from 'dojo/_base/connect';
import domClass from 'dojo/dom-class';
import _Widget from 'dijit/_Widget';
import _Templated from './_Templated';
import Modal from './Modal';

const __class = declare('argos.TimePicker', [_Widget, _Templated], {
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
    '</div>',
  ]),
  hourSelectTemplate: new Simplate([
    '<div class="dropdown" data-dojo-attach-point="hourNode">',
      '<input class="hours" readonly="true" data-dojo-attach-point="hours"></input>',
      '<span class="fa fa-caret-down"></span>',
    '</div>',
  ]),
  minuteSelectTemplate: new Simplate([
    '<div class="dropdown" data-dojo-attach-point="minuteNode">',
      '<input class="minutes" readonly="true" data-dojo-attach-point="minutes"></input>',
      '<span class="fa fa-caret-down"></span>',
    '</div>',
  ]),
  meridiemSelectTemplate: new Simplate([
    '<div class="toggle toggle-horizontal meridiem-field" data-dojo-attach-point="meridiemNode">',
        '<span class="thumb horizontal"></span>',
        '<span class="toggleOn">{%= $.amText %}</span>',
        '<span class="toggleOff">{%= $.pmText %}</span>',
    '</div>',
  ]),
  listStartTemplate: new Simplate([
    '<ul class="list">',
  ]),
  listEndTemplate: new Simplate([
    '</ul>',
  ]),
  listItemTemplate: new Simplate([
    '<li class="list-item" data-action="{$.action}">',
    '{%= $.value }',
    '</li>',
  ]),

  amText: 'AM',
  pmText: 'PM',
  setTimeText: 'Set Time',

  timeValue: null,
  _hourModal: null,
  _minuteModal: null,
  _selectedHour: null,
  _selectedMinute: null,
  _widgetName: 'timePicker',
  timeless: false,
  showSetTime: true,
  hourValues: [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ],
  minuteValues: [
    '00',
    '05',
    '10',
    '15',
    '20',
    '25',
    '30',
    '35',
    '40',
    '45',
    '50',
    '55',
  ],

  createHourModal: function createHourModal() {
    this._hourModal = new Modal({ id: 'hour-modal ' + this.id, showBackdrop: false, positioning: 'right' });
    this._hourModal.placeModal(this.domNode.offsetParent)
                   .setContentPicklist({ items: this.hourValues, action: 'setSelectedHour', actionScope: this });
    this.setSelectedHour({ target: this._hourModal.getContent().children[0] });
    connect.connect(this.hourNode, 'onclick', this, this.toggleHours);
    return this;
  },
  createMinuteModal: function createMinuteModal() {
    this._minuteModal = new Modal({ id: 'minute-modal ' + this.id, showBackdrop: false, positioning: 'right' });
    this._minuteModal.placeModal(this.domNode.offsetParent)
                     .setContentPicklist({ items: this.minuteValues, action: 'setSelectedMinute', actionScope: this });
    this.setSelectedMinute({ target: this._minuteModal.getContent().children[0] });
    connect.connect(this.minuteNode, 'onclick', this, this.toggleMinutes);
    return this;
  },
  getContent: function getContent() {
    this.hideModals();
    this.setTimeValue();
    return this.timeValue;
  },
  hideModals: function hideModals() {
    this._hourModal.hideModal();
    this._minuteModal.hideModal();
  },
  setSelectedHour: function getSelectedHour({ target }) {
    domClass.add(target, 'selected');
    if (this._selectedHour) {
      domClass.remove(this._selectedHour, 'selected');
    }
    this._selectedHour = target;
    this._hourModal.hideModal();
    this.hours.value = target.innerHTML;
  },
  setSelectedMinute: function getSelectedMinute({ target }) {
    domClass.add(target, 'selected');
    if (this._selectedMinute) {
      domClass.remove(this._selectedMinute, 'selected');
    }
    this._selectedMinute = target;
    this._minuteModal.hideModal();
    this.minutes.value = target.innerHTML;
  },
  setTimeValue: function setTimeValue() {
    if (!this._isTimeless()) {
      this.timeValue.hours = parseInt(this.hours.value, 10);
      this.timeValue.minutes = parseInt(this.minutes.value, 10);
      this.timeValue.isPM = domClass.contains(this.meridiemNode, 'toggleStateOn');

      this.timeValue.hours = this.timeValue.isPM
         ? (this.timeValue.hours % 12) + 12
         : (this.timeValue.hours % 12);
    }
    return this;
  },
  show: function show() {
    this.timeValue = {
      isPM: false,
    };
    this.createHourModal()
        .createMinuteModal();
    connect.connect(this.meridiemNode, 'onclick', this, this.toggleMeridiem);
  },
  toggleHours: function toggleHours(params = {}) {
    if (params.target === this.hourNode) {
      this._hourModal.toggleModal(params.target);
    } else {
      // Means the icon was clicked, thus go to the parent node (the div)
      this._hourModal.toggleModal(params.target.parentNode);
    }
    event.stop(params);
  },
  toggleMeridiem: function toggleMeridiem({ target }) {
    if (target) {
      domClass.toggle(this.meridiemNode, 'toggleStateOn');
    }
  },
  toggleMinutes: function toggleMinutes(params = {}) {
    if (params.target === this.minuteNode) {
      this._minuteModal.toggleModal(params.target);
    } else {
      // Means the icon was clicked, thus go to the parent node (the div)
      this._minuteModal.toggleModal(params.target.parentNode);
    }
    event.stop(params);
  },
  _isTimeless: function _isTimeless() {
    return (this.options && this.options.timeless) || this.timeless;
  },
});

lang.setObject('Sage.Platform.Mobile.TimePicker', __class);
export default __class;
