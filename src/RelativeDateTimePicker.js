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
import _ActionMixin from './_ActionMixin';
import _CustomizationMixin from './_CustomizationMixin';
import DateTimePicker from './DateTimePicker';
import getResource from './I18n';


const resource = getResource('relativeDateTimePicker');
const dtFormatResource = getResource('relativeDateTimePickerDateTimeFormat');

/**
 * @class argos.DateTimePicker
 */
const __class = declare('argos.RelativeDateTimePicker', [_WidgetBase, _Templated, _ActionMixin, _CustomizationMixin], {
  widgetTemplate: new Simplate([
    '<div class="relative-datetime-select" data-dojo-attach-point="relativeDateTimeNode">',
    '<div class="relative-datetime-select__title">{%: $.titleText %}</div>',
    '<ul class="simpleList" data-dojo-attach-point="listNode"></ul>',
    '</div>',
  ]),
  listItemTemplate: new Simplate([
    '<li class="simpleList__item" data-time="{%: $.time %}" data-action="select">',
    '<div class="item__text--left"><span>{%: $.textLeft %}</span></div>',
    '<div class="item__text--right"><span>{%: $.textRight %}</span></div>',
    '</li>',
  ]),

  _deferred: null,
  _selectedTime: null,
  _widgetName: 'relativeDateTimePicker',
  _dateTimeModal: null,
  customizationSet: 'relativeDateTimePicker',
  layout: null,
  morningHours: 8,
  eveningHours: 17,
  showThisEveningUntil: 12,
  isModal: false,
  showTimePicker: true,
  titleText: resource.titleText,
  pickDateTimeText: resource.pickDateTimeText,
  thisEveningText: resource.thisEveningText,
  tomorrowMorningText: resource.tomorrowMorningText,
  tomorrowAfternoonText: resource.tomorrowAfternoonText,
  nextWeekText: resource.nextWeekText,
  nextMonthText: resource.nextMonthText,
  hoursFormat: dtFormatResource.hoursFormat,
  dayHoursFormat: dtFormatResource.dayHoursFormat,
  hoursFormat24: dtFormatResource.hoursFormat24,
  dayHoursFormat24: dtFormatResource.dayHoursFormat24,


  createLayout: function createLayout() {
    return [{
      title: this.titleText,
      children: [{
        label: this.thisEveningText,
        time: moment()
          .clone()
          .hours(this.eveningHours)
          .minutes(0)
          .seconds(0),
        format: (App.is24HourClock()) ? this.hoursFormat24 : this.hoursFormat,
      }, {
        label: this.tomorrowMorningText,
        time: moment()
          .clone()
          .add(1, 'days')
          .hours(this.morningHours)
          .minutes(0)
          .seconds(0),
        format: (App.is24HourClock()) ? this.hoursFormat24 : this.hoursFormat,
      }, {
        label: this.tomorrowAfternoonText,
        time: moment()
          .clone()
          .add(1, 'days')
          .hours(this.eveningHours)
          .minutes(0)
          .seconds(0),
        format: (App.is24HourClock()) ? this.hoursFormat24 : this.hoursFormat,
      }, {
        label: this.nextWeekText,
        time: moment()
          .clone()
          .startOf('week')
          .add(7, 'days')
          .hours(this.morningHours)
          .minutes(0)
          .seconds(0),
        format: (App.is24HourClock()) ? this.dayHoursFormat24 : this.dayHoursFormat,
      }, {
        label: this.nextMonthText,
        time: moment()
          .clone()
          .startOf('month')
          .add(1, 'month')
          .hours(this.morningHours)
          .minutes(0)
          .seconds(0),
        format: (App.is24HourClock()) ? this.dayHoursFormat24 : this.dayHoursFormat,
      }],
    }];
  },
  init: function init() {
    this.inherited(init, arguments);
  },
  getContent: function getContent() {
    return this._selectedTime;
  },
  makeItem: function makeItem({ label, time, format }) {
    const item = $(this.listItemTemplate.apply({ textLeft: label, textRight: time.format(format) }));
    item[0].time = time;
    $(this.listNode).append(item);
  },
  makeListItems: function makeListItems({ title, children }) {
    let startIndex = 0;
    if (title === this.titleText) {
      const currentTime = moment();
      if (currentTime.hours() <= this.showThisEveningUntil) {
        this.makeItem(children[startIndex]);
      }
      startIndex++;
    }
    for (let i = startIndex; i < children.length; i++) {
      this.makeItem(children[i]);
    }
    return this;
  },
  processLayout: function processLayout() {
    for (let i = 0; i < this.layout.length; i++) {
      this.makeListItems(this.layout[i]);
    }
  },
  select: function select(evt) {
    this._selectedTime = evt.$source.time;
    if (this.isModal) {
      this._modalNode.resolveDeferred();
      this._selectedTime = null;
    }
  },
  show: function show(options = {}) {
    this.options = options;
    this.showTimePicker = options.showTimePicker;
    this.layout = this.layout || this._createCustomizedLayout(this.createLayout());
    if (!this.listNode.children.length) {
      this.processLayout();
    }
    return;
  },
  toDateTimePicker: function toDateTimePicker() {
    App.modal.hide();
    const dateTimePicker = new DateTimePicker({ isModal: true });
    const toolbar = [
      {
        action: 'cancel',
        className: 'button--flat button--flat--split',
        text: resource.cancelText,
      }, {
        action: 'resolve',
        className: 'button--flat button--flat--split',
        text: resource.confirmText,
      },
    ];
    App.modal.add(dateTimePicker, toolbar, this.options).then(this._deferred.resolve);
  },
});

export default __class;
