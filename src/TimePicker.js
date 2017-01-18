import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import on from 'dojo/on';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import _Widget from 'dijit/_Widget';
import _Templated from './_Templated';
import Dropdown from 'argos/Dropdown';
import getResource from './I18n';
import domStyle from 'dojo/dom-style';
import string from 'dojo/string';

import moment from 'moment';

const resource = getResource('timePicker');

/**
 * @class argos.TimePicker
 * @alternateClassName Time Select
 */
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
    '<div data-dojo-attach-point="hourNode">',
    '</div>',
  ]),
  minuteSelectTemplate: new Simplate([
    '<div data-dojo-attach-point="minuteNode">',
    '</div>',
  ]),
  meridiemSelectTemplate: new Simplate([
    '<div class="toggle toggle-horizontal meridiem-field" data-dojo-attach-point="meridiemNode">',
    '<span class="thumb horizontal"></span>',
    '<span class="toggleOn">{%= $.pmText %}</span>',
    '<span class="toggleOff">{%= $.amText %}</span>',
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

  amText: resource.amText,
  pmText: resource.pmText,
  setTimeText: resource.setTimeText,

  timeValue: null,
  _hourDropdown: null,
  _hourValue: null,
  _meridiemListener: null,
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
      for (let i = 0; i < totalHours; i++) {
        const dispVal = (totalHours === 24) ? i.toString() : (i + 1).toString();
        this.hourValues.push({ value: dispVal, key: dispVal });
      }
    }
    return this.hourValues;
  },
  createMinuteLayout: function createMinuteLayout() {
    if (!this.minuteValues) {
      this.minuteValues = [];
      for (let i = 0; i < 60; i += 5) {
        const dispVal = (i < 10) ? string.substitute('0${val}', { val: i.toString() }) : i.toString();
        this.minuteValues.push({ value: dispVal, key: i.toString() });
      }
    }
    return this.minuteValues;
  },
  createHourDropdown: function createHourDropdown(initial) {
    if (!this._hourDropdown) {
      this.createHourLayout();
      this._hourDropdown = new Dropdown({ id: 'hour-dropdown', itemMustExist: true });
      this._hourDropdown.createList({ items: this.hourValues, defaultValue: `${initial}` });
      domConstruct.place(this._hourDropdown.domNode, this.hourNode, 'replace');
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
      this._minuteDropdown = new Dropdown({ id: 'minute-modal', itemMustExist: true });
      this._minuteDropdown.createList({ items: this.minuteValues, defaultValue: `${value}` });
      domConstruct.place(this._minuteDropdown.domNode, this.minuteNode, 'replace');
    }
    return this;
  },
  destroy: function destroy() {
    this._hourDropdown.destroy();
    this._minuteDropdown.destroy();
    this.inherited(arguments);
  },
  getContent: function getContent() {
    this.setTimeValue();
    this.removeListeners();
    return this.timeValue;
  },
  removeListeners: function removeListeners() {
    if (this._meridiemListener) {
      this._meridiemListener.remove();
    }
  },
  setMeridiem: function setMeridiem(value) {
    if (value) {
      domClass.add(this.meridiemNode, 'toggleStateOn');
    } else {
      domClass.remove(this.meridiemNode, 'toggleStateOn');
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
        this.timeValue.isPM = domClass.contains(this.meridiemNode, 'toggleStateOn');
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
    this.createHourDropdown(`${hour}`)
        .createMinuteDropdown(`${minutes}`);
    if (!App.is24HourClock()) {
      this.setMeridiem(meridiemToggled);
      this._meridiemListener = on(this.meridiemNode, 'click', this.toggleMeridiem.bind(this));
    } else {
      domStyle.set(this.meridiemNode, 'display', 'none');
    }
  },
  toggleMeridiem: function toggleMeridiem({ target }) {
    if (target) {
      domClass.toggle(this.meridiemNode, 'toggleStateOn');
    }
  },
  _isTimeless: function _isTimeless() {
    return (this.options && this.options.timeless) || this.timeless;
  },
});

lang.setObject('Sage.Platform.Mobile.TimePicker', __class);
export default __class;
