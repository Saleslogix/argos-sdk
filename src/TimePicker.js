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

/**
 * @module argos/TimePicker
 */
import declare from 'dojo/_base/declare';
import _WidgetBase from 'dijit/_WidgetBase';
import _Templated from './_Templated';
import Dropdown from './Dropdown';
import getResource from './I18n';


const resource = getResource('timePicker');

/**
 * @class
 * @alias module:argos/TimePicker
 * @extends module:argos/_Templated
 */
const __class = declare('argos.TimePicker', [_WidgetBase, _Templated], /** @lends module:argos/TimePicker.prototype */{
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
    '<div data-dojo-attach-point="hourNode">',
    '</div>',
  ]),
  minuteSelectTemplate: new Simplate([
    '<div data-dojo-attach-point="minuteNode">',
    '</div>',
  ]),
  meridiemSelectTemplate: new Simplate([
    `<div class="switch" data-dojo-attach-point="meridiemNode">
        <input
          type="checkbox"
          name="AMPMToggleNode"
          id="AMPMToggleNode"
          class="switch" />
        <label class="toggleAMPM" for="AMPMToggleNode">{%= $.amText %}</label>
      </div>`,
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

  amText: resource.amText,
  pmText: resource.pmText,
  setTimeText: resource.setTimeText,

  timeValue: null,
  _showAM: null,
  _hourDropdown: null,
  _hourValue: null,
  _minuteDropdown: null,
  _minuteValue: null,
  _selectedHour: null,
  _selectedMinute: null,
  _widgetName: 'timePicker',
  timeless: false,
  showSetTime: true,
  hourValues: null,
  minuteValues: null,
  createHourLayout: function createHourLayout() {
    if (!this.hourValues) {
      const totalHours = (App.is24HourClock()) ? 24 : 12;
      this.hourValues = [];
      this.hourValues = (totalHours === 24) ? this.create24HourList(totalHours) : this.createHourList(totalHours);
    }
    return this.hourValues;
  },
  createHourList: function createHourList(totalHours) {
    const hourValues = [];
    for (let i = 0; i < totalHours; i++) {
      const dispVal = (i + 1).toString();
      hourValues.push({ value: dispVal, key: dispVal });
    }
    return hourValues;
  },
  create24HourList: function create24HourList(totalHours) {
    const hourValues = [];
    for (let i = 0; i < totalHours; i++) {
      const dispVal = `${i}`.padStart(2, '0');
      hourValues.push({ value: dispVal, key: dispVal });
    }
    return hourValues;
  },
  createMinuteLayout: function createMinuteLayout() {
    if (!this.minuteValues) {
      this.minuteValues = [];
      for (let i = 0; i < 60; i += 5) {
        const dispVal = `${i}`.padStart(2, '0');
        this.minuteValues.push({ value: dispVal, key: i.toString() });
      }
    }
    return this.minuteValues;
  },
  createHourDropdown: function createHourDropdown(initial) {
    if (!this._hourDropdown) {
      this.createHourLayout();
      this._hourDropdown = new Dropdown({ id: 'hour-dropdown', itemMustExist: true, dropdownClass: 'dropdown-mx' });
      this._hourDropdown.createList({ items: this.hourValues, defaultValue: `${initial}` });
      $(this.hourNode).replaceWith(this._hourDropdown.domNode);
    }
    return this;
  },
  createMinuteDropdown: function createMinuteDropdown(initial) {
    const tempValue = Math.ceil(initial / 1) * 1;
    let value = initial;
    if (tempValue >= 60) {
      value = '59';
    }
    if (tempValue === 0) {
      value = '00';
    }

    if (!this._minuteDropdown) {
      this.createMinuteLayout();
      this._minuteDropdown = new Dropdown({ id: 'minute-modal', itemMustExist: true, dropdownClass: 'dropdown-mx' });
      this._minuteDropdown.createList({ items: this.minuteValues, defaultValue: `${value}` });
      $(this.minuteNode).replaceWith(this._minuteDropdown.domNode);
    }
    return this;
  },
  destroy: function destroy() {
    this._hourDropdown.destroy();
    this._minuteDropdown.destroy();
    this.inherited(destroy, arguments);
  },
  getContent: function getContent() {
    this.setTimeValue();
    this.removeListeners();
    return this.timeValue;
  },
  removeListeners: function removeListeners() {
    $(this.meridiemNode.children[0]).off('click');
  },
  setMeridiem: function setMeridiem(value, target) {
    $(this.meridiemNode).toggleClass('toggleStateOn', value);
    if (target) {
      $(target).next().html(value ? this.pmText : this.amText);
      $(target).prop('checked', value);
    }
    return this;
  },
  setTimeValue: function setTimeValue() {
    if (!this._isTimeless()) {
      if (App.is24HourClock()) {
        const hourVal = parseInt(this._hourDropdown.getValue(), 10);
        let isPm = false;
        if (hourVal >= 12) {
          isPm = true;
        }
        this.timeValue.hours = hourVal;
        this.timeValue.minutes = parseInt(this._minuteDropdown.getValue(), 10);
        this.timeValue.isPM = isPm;
      } else {
        this.timeValue.hours = parseInt(this._hourDropdown.getValue(), 10);
        this.timeValue.minutes = parseInt(this._minuteDropdown.getValue(), 10);
        this.timeValue.isPM = $(this.meridiemNode).hasClass('toggleStateOn');
        this.timeValue.hours = this.timeValue.isPM
          ? (this.timeValue.hours % 12) + 12
          : (this.timeValue.hours % 12);
      }
    }
    return this;
  },
  show: function show(options = {}) {
    this.timeValue = {
      isPM: false,
    };
    const date = moment(options.date) || moment();
    let hour = date.hours();
    let meridiemToggled = false;
    if (hour >= 12) {
      if (hour !== 12 && !App.is24HourClock()) {
        hour = hour % 12;
      }
      meridiemToggled = true;
    }
    if (hour === 0 && !App.is24HourClock()) {
      hour = 12;
    }
    let minutes = date.minutes() || 0;
    if (minutes < 10) {
      minutes = `${minutes}`;
      minutes = Array(2).join('0') + minutes;
    }
    this.timeValue.seconds = date.seconds();
    (App.is24HourClock() ? this.createHourDropdown(`${hour}`.padStart(2, '0')) : this.createHourDropdown(`${hour}`))
      .createMinuteDropdown(`${minutes}`);
    if (!App.is24HourClock()) {
      this.setMeridiem(meridiemToggled, this.meridiemNode.children[0]);
      $(this.meridiemNode.children[0]).on('click', this.toggleMeridiem.bind(this));
    } else {
      $(this.meridiemNode).hide();
    }
  },
  toggleMeridiem: function toggleMeridiem({ target }) {
    this._showAM = !this._showAM;
    this.setMeridiem(this._showAM, target);
  },
  _isTimeless: function _isTimeless() {
    return (this.options && this.options.timeless) || this.timeless;
  },
});

export default __class;
