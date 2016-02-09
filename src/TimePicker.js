import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import on from 'dojo/on';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import _Widget from 'dijit/_Widget';
import _Templated from './_Templated';
import Dropdown from 'argos/Dropdown';

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

  amText: 'AM',
  pmText: 'PM',
  setTimeText: 'Set Time',

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
  hourValues: [
    {
      value: '1',
      key: '1',
    },
    {
      value: '2',
      key: '2',
    },
    {
      value: '3',
      key: '3',
    },
    {
      value: '4',
      key: '4',
    },
    {
      value: '5',
      key: '5',
    },
    {
      value: '6',
      key: '6',
    },
    {
      value: '7',
      key: '7',
    },
    {
      value: '8',
      key: '8',
    },
    {
      value: '9',
      key: '9',
    },
    {
      value: '10',
      key: '10',
    },
    {
      value: '11',
      key: '11',
    },
    {
      value: '12',
      key: '12',
    },
  ],
  minuteValues: [
    {
      value: '00',
      key: '00',
    },
    {
      value: '05',
      key: '05',
    },
    {
      value: '10',
      key: '10',
    },
    {
      value: '15',
      key: '15',
    },
    {
      value: '20',
      key: '20',
    },
    {
      value: '25',
      key: '25',
    },
    {
      value: '30',
      key: '30',
    },
    {
      value: '35',
      key: '35',
    },
    {
      value: '40',
      key: '40',
    },
    {
      value: '45',
      key: '45',
    },
    {
      value: '50',
      key: '50',
    },
    {
      value: '55',
      key: '55',
    },
  ],

  createHourDropdown: function createHourDropdown(initial) {
    if (!this._hourDropdown) {
      this._hourDropdown = new Dropdown({ id: 'hour-dropdown' });
      this._hourDropdown.createList({ items: this.hourValues, defaultValue: `${initial}` });
      domConstruct.place(this._hourDropdown.domNode, this.hourNode, 'replace');
    }
    return this;
  },
  createMinuteDropdown: function createMinuteDropdown(initial) {
    let value = Math.ceil(initial / 5) * 5;
    if (value >= 60) {
      value = 55;
    }
    if (value === 0) {
      value = '00';
    }
    if (value === 5) {
      value = '05';
    }
    if (!this._minuteDropdown) {
      this._minuteDropdown = new Dropdown({ id: 'minute-modal' });
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
      this.timeValue.hours = parseInt(this._hourDropdown.getValue(), 10);
      this.timeValue.minutes = parseInt(this._minuteDropdown.getValue(), 10);
      this.timeValue.isPM = domClass.contains(this.meridiemNode, 'toggleStateOn');

      this.timeValue.hours = this.timeValue.isPM
         ? (this.timeValue.hours % 12) + 12
         : (this.timeValue.hours % 12);
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
      if (hour !== 12) {
        hour = hour % 12;
      }
      meridiemToggled = true;
    }
    if (hour === 0) {
      hour = 12;
    }
    let minutes = date.minutes() || 0;
    if (minutes === 0) {
      minutes = '00';
    }
    this.timeValue.seconds = date.seconds();
    this.createHourDropdown(`${hour}`)
        .createMinuteDropdown(`${minutes}`)
        .setMeridiem(meridiemToggled);
    this._meridiemListener = on(this.meridiemNode, 'click', this.toggleMeridiem.bind(this));
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
