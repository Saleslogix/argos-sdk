import declare from 'dojo/_base/declare';
import domConstruct from 'dojo/dom-construct';
import domStyle from 'dojo/dom-style';
import _Widget from 'dijit/_Widget';
import _Templated from 'argos/_Templated';
import Calendar from './Calendar';
import TimePicker from './TimePicker';

import moment from 'moment';

/**
 * @class argos.DateTimePicker
 */
const __class = declare('argos.DateTimePicker', [_Widget, _Templated], {
  widgetTemplate: new Simplate([
    '<div class="datetime-select" data-dojo-attach-point="dateTimeNode">',
    '</div>',
  ]),

  _calendarNode: null,
  _timeSelectNode: null,
  isModal: false,
  showTimePicker: false,

  init: function init() {
    this.inherited(arguments);
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
      domConstruct.place(this._calendarNode.domNode, this.dateTimeNode);
      this._calendarNode.show(options);
      this._timeSelectNode = new TimePicker({ id: `datetime-timePicker ${this.id}`, showSetTime: false });
      domConstruct.place(this._timeSelectNode.domNode, this.dateTimeNode);
      this._timeSelectNode.show(options);
      if (!this.showTimePicker) {
        domStyle.set(this._timeSelectNode.domNode, {
          display: 'none',
        });
      }
    } else {
      this._calendarNode.show(options);
      if (this.showTimePicker) {
        this._timeSelectNode.show(options);
        domStyle.set(this._timeSelectNode.domNode, {
          display: 'block',
        });
      } else {
        domStyle.set(this._timeSelectNode.domNode, {
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
