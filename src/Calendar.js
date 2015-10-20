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
 * @class argos.Calendar
 * @alternateClassName Calendar
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import query from 'dojo/query';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import _ActionMixin from './_ActionMixin';
import _Widget from 'dijit/_Widget';
import _Templated from './_Templated';
import Dropdown from './Dropdown';

const resource = window.localeContext.getEntitySync('calendar').attributes;

const __class = declare('argos.Calendar', [ _Widget, _ActionMixin, _Templated], {
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" class="calendar panel">',
      '{%! $.calendarHeaderTemplate %}',
      '{%! $.calendarTableTemplate %}',
      '{%! $.calendarFooterTemplate %}',
    '</div>',
  ]),
  calendarHeaderTemplate: new Simplate([
    '<div class="calendar-header">',
      '<span class="calendar__header__icon calendar__header__icon--left fa fa-angle-left" data-action="decrementMonth"></span>',
      '<div class="month" data-dojo-attach-point="monthNode" data-action="toggleMonthModal"></div>',
      '<div class="year" data-dojo-attach-point="yearNode" data-action="toggleYearModal"></div>',
      '<span class="fa fa-angle-right calendar__header__icon calendar__header__icon--right " data-action="incrementMonth"></span>',
    '</div>',
  ]),
  calendarTableTemplate: new Simplate([
     '<table class="calendar-table">',
      '<thead>',
        '{%! $.calendarWeekDaysTemplate %}',
      '</thead>',
      '<tbody data-dojo-attach-point="weeksNode"></tbody>',
     '</table>',
  ]),
  calendarFooterTemplate: new Simplate([
    '<div class="calendar-footer" data-dojo-attach-point="footerNode">',
      '<div class="button button--secondary clear" data-action="clearCalendar" data-dojo-attach-point="clearButton">{%= $.clearText %}</div>',
      '<div class="button button--secondary toToday" data-action="goToToday" data-dojo-attach-point="todayButton">{%= $.todayText %}</div>',
    '</div>',
  ]),
  calendarTableDayTemplate: new Simplate([
    '<td class="day {%= $.month %} {%= $.weekend %} {%= $.selected %} {%= $.isToday %}" data-action="changeDay" data-date="{%= $.date %}">',
      '{%= $.day %}',
    '</td>',
  ]),
  calendarTableDayActiveTemplate: new Simplate([
    '<div class="day__active">',
    '</div>',
  ]),
  calendarTableWeekStartTemplate: new Simplate([
    '<tr class="calendar-week">',
  ]),
  calendarTableWeekEndTemplate: new Simplate([
    '</tr>',
  ]),
  calendarWeekDaysTemplate: new Simplate([
    '<tr class="calendar-weekdays">',
      '<th>{%= $.weekDaysShortText[0] %}</th>',
      '<th>{%= $.weekDaysShortText[1] %}</th>',
      '<th>{%= $.weekDaysShortText[2] %}</th>',
      '<th>{%= $.weekDaysShortText[3] %}</th>',
      '<th>{%= $.weekDaysShortText[4] %}</th>',
      '<th>{%= $.weekDaysShortText[5] %}</th>',
      '<th>{%= $.weekDaysShortText[6] %}</th>',
    '</tr>',
  ]),

  // Localization
  titleText: resource.titleText,
  amText: resource.amText,
  pmText: resource.pmText,
  clearText: resource.clearText,
  todayText: resource.todayText,
  monthsText: [
    resource.january,
    resource.february,
    resource.march,
    resource.april,
    resource.may,
    resource.june,
    resource.july,
    resource.august,
    resource.september,
    resource.october,
    resource.november,
    resource.december,
  ],
  weekDaysShortText: [
    resource.sundayAbbreviated,
    resource.mondayAbbreviated,
    resource.tuesdayAbbreviated,
    resource.wednesdayAbbreviated,
    resource.thursdayAbbreviated,
    resource.fridayAbbreviated,
    resource.saturdayAbbreviated,
  ],

  id: 'generic_calendar',
  showTimePicker: true,
  showSubValues: true,
  // This boolean value is used to trigger the modal hide and show and must be used by each entity
  isModal: false,
  // Date is an object containing selected day, month, year, time, todayMoment (today), selectedDateMoment, etc.
  date: null,
  noClearButton: false,
  _monthDropdown: null,
  _currentMonth: null,
  _todayMonth: null,
  _yearDropdown: null,
  _currentYear: null,
  _todayYear: null,
  _widgetName: 'calendar',

  changeDay: function changeDay(params) {
    if (params) {
      const selected = query('.selected', this.weeksNode)[0];

      if (selected) {
        domClass.remove(selected, 'selected');
      }

      if (params.$source) {
        domClass.add(params.$source, 'selected');
        if (domClass.contains(params.$source, 'isToday')) {
          domClass.remove(this.todayButton, 'selected');
        }
      }

      if (params.date) {
        this.date.selectedDateMoment = moment(params.date, 'YYYY-MM-DD');
      }

      if (this.date.selectedDateMoment.date() !== this.date.todayMoment.date()) {
        domClass.add(this.todayButton, 'selected');
      }
      if (this.date.monthNumber !== this.date.selectedDateMoment.month()) {
        this.refreshCalendar(this.date);
      }
    }

    return this;
  },
  changeMonthShown: function changeMonthShown({ month }) {
    this._monthDropdown.setValue(month);
    return this;
  },
  changeYearShown: function changeYearShown({ year }) {
    this._yearDropdown.setValue(year);
    return this;
  },
  checkAndRenderDay: function checkAndRenderDay(data = {}) {
    const dayIndexer = data.day + data.startingDay - 1;
    if (data.day === data.todayMoment.date() && data.todayMoment.month() === data.dateMoment.month() && data.todayMoment.year() === data.dateMoment.year()) {
      data.isToday = 'isToday';
    } else {
      data.isToday = '';
    }
    if (dayIndexer % 7 === data.weekEnds.Sunday || dayIndexer % 7 === data.weekEnds.Saturday) {
      data.weekend = 'weekend';
    } else {
      data.weekend = '';
    }
    data.date = data.dateMoment.clone().date(data.day).format('YYYY-MM-DD');
    const day = domConstruct.toDom(this.calendarTableDayTemplate.apply(data, this));
    if (this.showSubValues) {
      this.setSubValue(day, data)
          .setActiveDay(day);
    }
    domConstruct.place(day, data.week);
  },
  clearCalendar: function clearCalendar() {
    const selected = query('.selected', this.weeksNode)[0];

    if (selected) {
      domClass.remove(selected, 'selected');
      domClass.add(this.todayButton, 'selected');
    }
    this.date.selectedDateMoment = null;
  },
  createMonthDropdown: function createMonthDropdown() {
    if (!this._monthDropdown) {
      this._monthDropdown = new Dropdown({ id: 'month-dropdown ' + this.id, dropdownClass: 'dropdown--medium' });
      this._monthDropdown.createList({ items: this.monthsText, defaultValue: this.date.selectedDateMoment.format('MMMM'), action: 'setMonth', actionScope: this });
      this._todayMonth = this._monthDropdown.getSelected();
      domConstruct.place(this._monthDropdown.domNode, this.monthNode);
    }
    return this;
  },
  createYearDropdown: function createYearDropdown() {
    if (!this._yearDropdown) {
      this._yearDropdown = new Dropdown({ id: 'year-dropdown ' + this.id });
      this._yearDropdown.createList({ items: this.getYearRange(), defaultValue: this.date.selectedDateMoment.format('YYYY'), action: 'setYear', actionScope: this });
      this._todayYear = this._yearDropdown.getSelected();
      domConstruct.place(this._yearDropdown.domNode, this.yearNode);
    }
    return this;
  },
  decrementMonth: function decrementMonth() {
    this.date.selectedDateMoment.subtract({ months: 1 });
    this.refreshCalendar(this.date);
  },
  destroy: function destroy() {
    this._yearDropdown.destroy();
    this._monthDropdown.destroy();
    this.inherited(arguments);
  },
  getContent: function getContent() {
    return this.date;
  },
  goToToday: function goToToday() {
    if (domClass.contains(this.todayButton, 'selected')) {
      domClass.remove(this.todayButton, 'selected');
      if (this.date.selectedDateMoment.month() !== this.date.todayMoment.month() || this.date.selectedDateMoment.year() !== this.date.todayMoment.year()) {
        this.date.selectedDateMoment = this.date.todayMoment;
        this.refreshCalendar(this.date);
      }
      const day = query('.isToday', this.weeksNode)[0];
      let params = {};
      if (day) {
        params = { $source: day, date: day.dataset.date };
      }
      this.changeDay(params);
      this.setDropdownsToday();
    }
  },
  getDateTime: function getDateTime() {
    const result = this.date.selectedDateMoment;
    return result.toDate();
  },
  getSelectedDateMoment: function getSelectedDateMoment() {
    return this.date.selectedDateMoment;
  },
  getYearRange: function getYearRange() {
    const items = [];
    const thisYear = this.date.todayMoment.year();
    for (let i = thisYear - 10; i <= thisYear + 10; i++) {
      items.push(i);
    }
    return items;
  },
  hideModals: function hideModals() {
    this.hideYearModal();
    this.hideMonthModal();
  },
  hideMonthModal: function hideMonthModal() {
    domClass.remove(this.monthNode, 'selected');
    this._monthDropdown.hide();
  },
  hideYearModal: function hideYearModal() {
    domClass.remove(this.yearNode, 'selected');
    this._yearDropdown.hide();
  },
  incrementMonth: function incrementMonth() {
    this.date.selectedDateMoment.add({ months: 1 });
    this.refreshCalendar(this.date);
  },
  init: function init() {
    this.inherited(arguments);
  },
  postRenderCalendar: function postRenderCalendar() {},
  refreshCalendar: function refreshCalendar(date = {}) {
    domConstruct.empty(this.weeksNode);
    this.renderCalendar(date)
        .changeMonthShown(date)
        .changeYearShown(date);
    return this;
  },
  renderCalendar: function renderCalendar({ todayMoment, selectedDateMoment }) {
    const daysInMonth = selectedDateMoment.daysInMonth();
    const startingDay = selectedDateMoment.clone().startOf('month').day();
    const endPrevMonth = selectedDateMoment.clone().startOf('month').subtract({ days: startingDay });
    const startNextMonth = selectedDateMoment.clone().endOf('month').add({ days: 1 });
    const data = {
      todayMoment,
      selectedDateMoment,
      dateMoment: endPrevMonth.clone(),
      week: domConstruct.toDom(this.calendarTableWeekStartTemplate.apply()),
      startingDay: endPrevMonth.clone().startOf('month').day(),
      weekEnds: {
        Sunday: 0,
        Saturday: 6,
      },
    };

    // Iterate through the days that are in the start week of the current month but are in the previous month
    for (let day = endPrevMonth.date(); day < endPrevMonth.date() + startingDay; day++) {
      data.day = day;
      this.checkAndRenderDay(data);
    }

    data.month = 'current-month';
    data.startingDay = startingDay;
    data.dateMoment = selectedDateMoment.clone();
    for (let day = 1; day <= daysInMonth; day++) {
      if (day === selectedDateMoment.date()) {
        data.selected = 'selected';
        this.date.dayNode = day;
      } else {
        data.selected = '';
      }
      data.day = day;
      this.checkAndRenderDay(data);
      if ((day + startingDay) % 7 === 0) {
        domConstruct.place(this.calendarTableWeekEndTemplate.apply(), data.week);
        domConstruct.place(data.week, this.weeksNode);
        data.week = domConstruct.toDom(this.calendarTableWeekStartTemplate.apply());
      }
    }


    data.selected = '';
    data.month = '';
    data.startingDay = startNextMonth.day();
    data.dateMoment = startNextMonth.clone();
    // Iterate through remaining days of the week based on 7 days in the week and ensure there are 6 weeks shown (for consistency)
    for (let day = 1; day <= (1 + data.weekEnds.Saturday - startNextMonth.day()); day++) {
      data.day = day;
      this.checkAndRenderDay(data);
    }
    domConstruct.place(this.calendarTableWeekEndTemplate.apply(), data.week);
    domConstruct.place(data.week, this.weeksNode);

    if (this.weeksNode.children.length === 5) {
      data.week = domConstruct.toDom(this.calendarTableWeekStartTemplate.apply());
      for (let day = 2 + data.weekEnds.Saturday - startNextMonth.day(); day <= (8 + data.weekEnds.Saturday - startNextMonth.day()); day++) {
        data.day = day;
        this.checkAndRenderDay(data);
      }
      domConstruct.place(this.calendarTableWeekEndTemplate.apply(), data.week);
      domConstruct.place(data.week, this.weeksNode);
    }

    this.setDateObject(selectedDateMoment);

    if (this.date.monthNumber !== moment().month() || this.date.year !== moment().year()) {
      domClass.add(this.todayButton, 'selected');
    }

    this.postRenderCalendar();

    return this;
  },
  setActiveDay: function setActiveDay(day = {}) {
    if (day.subValue) {
      const active = domConstruct.toDom(this.calendarTableDayActiveTemplate.apply({ count: day.subValue }, this));
      domConstruct.place(active, day, 'last');
    }
    return this;
  },
  setDateObject: function setDateObject(dateMoment = {}) {
    this.date.day = dateMoment.date();
    this.date.month = dateMoment.format('MMMM');
    this.date.monthNumber = dateMoment.month();
    this.date.year = dateMoment.year();
    this.date.date = moment(dateMoment).toDate();

    return this;
  },
  setDropdownsToday: function setDropdownsToday() {
    if (this._monthDropdown.getSelected() !== this._todayMonth) {
      this._monthDropdown.setSelected(this._todayMonth.innerHTML);
    }
    if (this._yearDropdown.getSelected() !== this._todayYear) {
      this._yearDropdown.setSelected(this._todayYear.innerHTML);
    }
    return this;
  },
  setMonth: function setMonth() {
    this.date.selectedDateMoment.month(this._monthDropdown.getValue());
    this.refreshCalendar(this.date);
  },
  setSubValue: function setSubValue() {
    return this;
  },
  setYear: function setYear() {
    this.date.selectedDateMoment.year(this._yearDropdown.getValue());
    this.refreshCalendar(this.date);
  },
  show: function show(options = {}) {
    this.date = {};
    this.options = options || this.options;

    this.titleText = this.options.label ? this.options.label : this.titleText;
    this.showTimePicker = this.options && this.options.showTimePicker;
    if (this.options.timeless) {
      const startDate = moment(this.options && this.options.date);
      startDate.subtract({
        minutes: startDate.utcOffset(),
      });
      this.date.selectedDateMoment = startDate;
    } else {
      this.date.selectedDateMoment = moment((this.options && this.options.date) || moment().clone());
    }
    this.date.todayMoment = moment();
    if (this.isModal || this.options.isModal || this.noClearButton || this.options.noClearButton) {
      this.clearButton.style.display = 'none';
    }
    this.createMonthDropdown()
        .createYearDropdown();

    domClass.add(this.todayButton, 'selected');
    this.refreshCalendar(this.date);
  },
});

lang.setObject('Sage.Platform.Mobile.Calendar', __class);
export default __class;
