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
 */
import declare from 'dojo/_base/declare';
import _ActionMixin from './_ActionMixin';
import _WidgetBase from 'dijit/_WidgetBase';
import _Templated from './_Templated';
import Dropdown from './Dropdown';
import getResource from './I18n';


const resource = getResource('calendar');

const __class = declare('argos.Calendar', [_WidgetBase, _Templated], {
  _ActionMixin: null,
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" class="calendar">',
    '<div class="calendar-monthview monthview is-fullsize is-selectable">',
    '{%! $.calendarHeaderTemplate %}',
    '{%! $.calendarTableTemplate %}',
    '{%! $.calendarFooterTemplate %}',
    '</div>',
    '</div>',
  ]),
  calendarHeaderTemplate: new Simplate([
    '<div class="calendar__header">',
    `<button type="button" class="btn-icon prev hide-focus" data-action="decrementMonth">
      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-previous-page"></use>
      </svg>
    </button>`,
    '<div class="month" data-dojo-attach-point="monthNode" data-action="toggleMonthModal"></div>',
    '<div class="year" data-dojo-attach-point="yearNode" data-action="toggleYearModal"></div>',
    `<button type="button" class="btn-icon next hide-focus" data-action="incrementMonth">
    <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-next-page"></use>
    </svg>
    </button>`,
    '</div>',
  ]),
  calendarTableTemplate: new Simplate([
    '<table class="monthview-table" aria-label="Calendar" role="application">',
    '<thead>',
    '{%! $.calendarWeekDaysTemplate %}',
    '</thead>',
    '<tbody data-dojo-attach-point="weeksNode"></tbody>',
    '</table>',
  ]),
  calendarFooterTemplate: new Simplate([
    '<div class="calendar-footer" data-dojo-attach-point="footerNode">',
    '<button class="btn-secondary clear" data-action="clearCalendar" data-dojo-attach-point="clearButton"><span>{%= $.clearText %}</span></button>',
    '<button class="btn-secondary toToday" type="button" data-action="goToToday" data-dojo-attach-point="todayButton"><span>{%= $.todayText %}</span></button>',
    '</div>',
  ]),
  calendarTableDayTemplate: new Simplate([
    '<td class="day {%= $.month %} {%= $.weekend %} {%= $.selected %} {%= $.isToday %}" data-action="changeDay" data-date="{%= $.date %}">',
    '<span class="day-container">',
    '<span aria-hidden="true" class="day-text">',
    '{%= $.day %}',
    '</span>',
    '</span>',
    '</td>',
  ]),
  calendarTableDayActiveTemplate: new Simplate([
    '<div class="day__active">',
    '</div>',
  ]),
  calendarTableWeekStartTemplate: new Simplate([
    '<tr>',
  ]),
  calendarTableWeekEndTemplate: new Simplate([
    '</tr>',
  ]),
  calendarWeekDaysTemplate: new Simplate([
    '<tr>',
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

  // Date is an object containing selected day, month, year, time, todayMoment (today), selectedDateMoment, etc.
  date: null,
  id: 'generic_calendar',
  // This boolean value is used to trigger the modal hide and show and must be used by each entity
  isModal: false,
  noClearButton: false,
  showTimePicker: true,
  showSubValues: true,
  _currentMonth: null,
  _currentYear: null,
  _monthDropdown: null,
  _selectWeek: false,
  _selectedDay: null,
  _widgetName: 'calendar',
  _yearDropdown: null,
  constructor: function constructor() {
    const m = this.getCurrentDateMoment();
    let monthsText = m._locale._months;

    if (monthsText.standalone) {
      monthsText = monthsText.standalone;
    }
    this.monthsText = monthsText.map((val, i) => {
      return {
        text: val,
        value: i,
        key: i,
      };
    });
    this.weekDaysShortText = m._locale._weekdaysMin;
  },
  postCreate: function postCreate() {
    this._ActionMixin = new _ActionMixin();
    this._ActionMixin.postCreate(this);
  },
  changeDay: function changeDay(params) {
    if (!this._selectWeek) {
      this.changeSingleDay(params);
    } else {
      this.changeWeek(params);
    }
    this.onChangeDay(params);
    return this;
  },
  onChangeDay: function onChangeDay() {
  },
  changeMonthShown: function changeMonthShown({ monthNumber }) {
    this._monthDropdown.setValue(monthNumber);
    return this;
  },
  changeSingleDay: function changeSingleDay(params) {
    if (params) {
      const selected = $('.is-selected', this.weeksNode);

      if (selected) {
        selected.each((i, day) => {
          $(day).removeClass('is-selected');
        });
      }

      if (selected) {
        $(selected).removeClass('is-selected');
      }

      if (params.$source) {
        this._selectedDay = params.$source;
        $(params.$source).addClass('is-selected');
      }

      if (params.date) {
        this.date.selectedDateMoment = moment(params.date, 'YYYY-MM-DD');
      }

      if (this.date.monthNumber !== this.date.selectedDateMoment.month()) {
        this.refreshCalendar(this.date);
      }
    }
    return this;
  },
  changeWeek: function changeWeek(params) {
    if (params) {
      const selected = $('.is-selected', this.weeksNode);

      if (selected) {
        selected.each((i, day) => {
          $(day).removeClass('is-selected');
        });
      }

      if (params.$source.parentNode) {
        this._selectedDay = params.$source;
        $(params.$source.parentNode).children().each((i, day) => {
          $(day).addClass('is-selected');
        });
      }

      if (params.date) {
        this.date.selectedDateMoment = moment(params.date, 'YYYY-MM-DD');
      }

      if (this.date.monthNumber !== this.date.selectedDateMoment.month()) {
        this.refreshCalendar(this.date);
      }
    }
    return this;
  },
  changeYearShown: function changeYearShown({ year }) {
    this._yearDropdown.setValue(year);
    return this;
  },
  checkAndRenderDay: function checkAndRenderDay(data = {}) {
    const dayIndexer = data.day + data.startingDay - 1;
    if (data.day === data.todayMoment.date() && data.todayMoment.month() === data.dateMoment.month() && data.todayMoment.year() === data.dateMoment.year()) {
      data.isToday = 'is-today';
    } else {
      data.isToday = '';
    }
    if (dayIndexer % 7 === data.weekEnds.Sunday || dayIndexer % 7 === data.weekEnds.Saturday) {
      data.weekend = 'weekend';
    } else {
      data.weekend = '';
    }
    data.date = data.dateMoment.clone().date(data.day).format('YYYY-MM-DD');
    const day = $(this.calendarTableDayTemplate.apply(data, this));
    if (data.day === this.date.dayNode && data.month.indexOf('alternate') === -1) {
      this._selectedDay = day[0];
    }
    if (this.showSubValues) {
      this.setSubValue(day, data)
        .setActiveDay(day);
    }
    $(data.week).append(day);
  },
  clearCalendar: function clearCalendar() {
    const selected = $('.is-selected', this.weeksNode)[0];

    if (selected) {
      $(selected).removeClass('is-selected');
    }
    this.date.selectedDateMoment = null;
  },
  createMonthDropdown: function createMonthDropdown() {
    if (!this._monthDropdown) {
      this._monthDropdown = new Dropdown({ id: `month-dropdown-${this.id}`, dropdownClass: 'dropdown--medium input-sm', onSelect: this.setMonth, onSelectScope: this });
      this._monthDropdown.createList({ items: this.monthsText, defaultValue: this.date.selectedDateMoment.month() });
      $(this.monthNode).append(this._monthDropdown.domNode);
    }
    return this;
  },
  createYearDropdown: function createYearDropdown() {
    if (!this._yearDropdown) {
      this._yearDropdown = new Dropdown({ id: `year-dropdown-${this.id}`, onSelect: this.setYear, dropdownClass: 'dropdown-mx', onSelectScope: this });
      this._yearDropdown.createList({ items: this.getYearRange(), defaultValue: this.date.selectedDateMoment.format('YYYY') });
      $(this.yearNode).append(this._yearDropdown.domNode);
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
    this.inherited(destroy, arguments);
  },
  getContent: function getContent() {
    if (this.options.timeless) {
      // Revert back to timeless
      this.date.selectedDateMoment.add({
        minutes: this.date.selectedDateMoment.utcOffset(),
      });
    }
    return this.date;
  },
  goToToday: function goToToday() {
    this.date.todayMoment = this.getCurrentDateMoment();
    this.date.selectedDateMoment = this.date.todayMoment;
    this.refreshCalendar(this.date); // This will reload the data.
    const day = $('.is-today', this.weeksNode)[0];
    let params = {};
    if (day) {
      params = { $source: day, date: day.dataset.date };
    }
    this.changeDay(params);
  },
  getDateTime: function getDateTime() {
    const result = this.date.selectedDateMoment;
    return result.toDate();
  },
  getCurrentDateMoment: function getCurrentDateMoment() {
    return moment();
  },
  getSelectedDateMoment: function getSelectedDateMoment() {
    return this.date.selectedDateMoment;
  },
  getYearRange: function getYearRange() {
    const items = [];
    const thisYear = this.date.todayMoment.year();
    for (let i = thisYear - 10; i <= thisYear + 10; i++) {
      items.push(
        {
          value: `${i}`,
          key: `${i}`,
        }
      );
    }
    return items;
  },
  incrementMonth: function incrementMonth() {
    this.date.selectedDateMoment.add({ months: 1 });
    this.refreshCalendar(this.date);
  },
  init: function init() {
    this.inherited(init, arguments);
  },
  isActive: function isActive(day) {
    if (day) {
      return $('.day__active', day)[0];
    }
  },
  postRenderCalendar: function postRenderCalendar() {
    if (this._selectWeek) {
      this.changeWeek({ $source: this._selectedDay });
    }
  },
  refreshCalendar: function refreshCalendar(date = {}) {
    this._refreshCalendar(date);
    this.onRefreshCalendar(true);
    return this;
  },
  _refreshCalendar: function refreshCalendar(date = {}) {
    $(this.weeksNode).empty();
    this.renderCalendar(date)
      .changeMonthShown(date)
      .changeYearShown(date);
    return this;
  },
  onRefreshCalendar: function onRefreshCalendar() {
  },
  removeActive: function removeActive(day) {
    if (day) {
      const active = this.isActive(day);
      if (active) {
        $(active).remove();
      }
    }
    return this;
  },
  refresh: function refresh(options) {
    this.date.todayMoment = this.getCurrentDateMoment();
    this._refreshCalendar(this.date);
    this.onRefreshCalendar(options);
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
      week: $(this.calendarTableWeekStartTemplate.apply()),
      startingDay: endPrevMonth.clone().startOf('month').day(),
      weekEnds: {
        Sunday: 0,
        Saturday: 6,
      },
    };

    // Iterate through the days that are in the start week of the current month but are in the previous month
    data.month = 'alternate prev-month';
    for (let day = endPrevMonth.date(); day < endPrevMonth.date() + startingDay; day++) {
      data.day = day;
      this.checkAndRenderDay(data);
    }

    data.month = '';
    data.startingDay = startingDay;
    data.dateMoment = selectedDateMoment.clone();
    for (let day = 1; day <= daysInMonth; day++) {
      if (day === selectedDateMoment.date()) {
        data.selected = 'is-selected';
        this.date.dayNode = day;
      } else {
        data.selected = '';
      }
      data.day = day;
      this.checkAndRenderDay(data);
      if ((day + startingDay) % 7 === 0) {
        $(data.week).append(this.calendarTableWeekEndTemplate.apply());
        $(this.weeksNode).append(data.week);
        data.week = $(this.calendarTableWeekStartTemplate.apply());
      }
    }

    data.selected = '';
    data.startingDay = startNextMonth.day();
    data.dateMoment = startNextMonth.clone();
    // Iterate through remaining days of the week based on 7 days in the week and ensure there are 6 weeks shown (for consistency)
    data.month = 'alternate next-month';
    for (let day = 1; day <= (1 + data.weekEnds.Saturday - startNextMonth.day()); day++) {
      data.day = day;
      this.checkAndRenderDay(data);
    }
    $(data.week).append($(this.calendarTableWeekEndTemplate.apply()));
    $(this.weeksNode).append(data.week);

    if (this.weeksNode.children.length === 5) {
      data.week = $(this.calendarTableWeekStartTemplate.apply());
      for (let day = 2 + data.weekEnds.Saturday - startNextMonth.day(); day <= (8 + data.weekEnds.Saturday - startNextMonth.day()); day++) {
        data.day = day;
        this.checkAndRenderDay(data);
      }
      $(data.week).append($(this.calendarTableWeekEndTemplate.apply()));
      $(this.weeksNode).append(data.week);
    }

    this.setDateObject(selectedDateMoment);

    this.postRenderCalendar();

    return this;
  },
  setActiveDay: function setActiveDay(day = {}) {
    if (day.subValue) {
      const active = this.calendarTableDayActiveTemplate.apply({ count: day.subValue }, this);
      $(day).append(active);
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
  setMonth: function setMonth() {
    const monthNumber = Number(this._monthDropdown.getValue());
    this.date.selectedDateMoment.month(monthNumber);
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
      // Undo timeless
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

    this.refreshCalendar(this.date);
  },
  toggleSelectWeek: function toggleSelectWeek() {
    this._selectWeek = !this._selectWeek;
    this.changeDay({ $source: this._selectedDay });
  },
});

export default __class;
