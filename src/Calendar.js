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
import string from 'dojo/string';
import domAttr from 'dojo/dom-attr';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import domStyle from 'dojo/dom-style';
import View from 'argos/View';
import moment from 'moment';

var __class = declare('argos.Calendar', [View], {
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" class="calendar panel">',
      '{%! $.calendarHeaderTemplate %}',
      '{%! $.calendarTableTemplate %}',
      '{%! $.calendarFooterTemplate %}',
    '</div>'
  ]),
  calendarHeaderTemplate: new Simplate([
    '<div class="calendar-header">',
      '<span class="fa fa-angle-left" data-action="decrementMonth"></span>',
      '<span class="month" data-dojo-attach-point="monthNode"></span>',
      '<span class="year" data-dojo-attach-point="yearNode"></span>',
      '<span class="fa fa-angle-right" data-action="incrementMonth"></span>',
    '</div>'
  ]),
  calendarTableTemplate: new Simplate([
     '<table class="calendar-table">',
      '<thead>',
        '{%! $.calendarWeekDaysTemplate %}',
      '</thead>',
      '<tbody data-dojo-attach-point="weeksNode"></tbody>',
     '</table>'
  ]),
  calendarFooterTemplate: new Simplate([
    '<div class="calendar-footer">',
      '<div class="button tertiary clear" data-action="clearCalendar" data-dojo-attach-point="clearButton">{%= $.clearText %}</div>',
      '<div class="button tertiary toToday" data-action="goToToday" data-dojo-attach-point="todayButton">{%= $.todayText %}</div>',
    '</div>'
  ]),
  calendarTableDayTemplate: new Simplate([
    '<td class="day {%= $.month %} {%= $.selected %} {%= $.isToday %}" data-action="changeDay" data-date="{%= $.date %}">{%= $.day %}</td>'
  ]),
  calendarTableWeekStartTemplate: new Simplate([
    '<tr class="calendar-week">'
  ]),
  calendarTableWeekEndTemplate: new Simplate([
    '</tr>'
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
    '</tr>'
  ]),
  timePickTemplate: new Simplate([
    '<div class="time-picker">',
    '</div>'
  ]),

  // Localization
  titleText: 'Calendar',
  amText: 'AM',
  pmText: 'PM',
  clearText: 'Clear',
  todayText: 'Today',
  monthsShortText: [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec'
  ],
  weekDaysShortText: [
      'Su',
      'Mo',
      'Tu',
      'We',
      'Th',
      'Fr',
      'Sa'
  ],

  id: 'generic_calendar',
  showTimePicker: true,
  isModal: false,
  // Date is an object containing selected day, month, year, time, todayMoment (today), selectedDateMoment, etc.
  date: null,

  changeDay: function(params) {
    // TODO: Need to register this event to dojo/connect so that the activity feed and then change based on the date chosen.
    const selected = query('.selected', this.weeksNode)[0];

    if (selected) {
        domClass.remove(selected, 'selected');
    }

    domClass.add(params.$source, 'selected');

    this.date.selectedDateMoment = moment(params.date, 'YYYY-MM-DD');
    if (this.date.selectedDateMoment.date() !== this.date.todayMoment.date()) {
      domClass.add(this.todayButton, 'selected');
    }
    if (this.date.month !== this.date.selectedDateMoment.month()) {
      this.refreshCalendar(this.date);
    }
  },
  changeMonthShown: function({ month }) {
    domConstruct.empty(this.monthNode);
    this.monthNode.innerHTML = month;
    return this;
  },
  changeYearShown: function({ year }) {
    domConstruct.empty(this.yearNode);
    this.yearNode.innerHTML = " " + year;
    return this;
  },
  decrementMonth: function(params) {
    this.date.selectedDateMoment.subtract({ months: 1 });
    this.refreshCalendar(this.date);
  },
  goToToday: function(params = {}) {
    domClass.remove(this.todayButton, 'selected');
    this.date.selectedDateMoment = this.date.todayMoment.clone();
    this.refreshCalendar(this.date);
  },
  incrementMonth: function(params) {
    this.date.selectedDateMoment.add({ months: 1 });
    this.refreshCalendar(this.date);
  },
  init: function() {
    this.inherited(arguments);
  },
  refreshCalendar: function(object = {}) {
    domConstruct.empty(this.weeksNode);
    this.renderCalendar(object)
        .changeMonthShown(object)
        .changeYearShown(object);
  },
  renderCalendar: function({ todayMoment, selectedDateMoment }) {
    // TODO: Refactor the code to call a function that handles the duplicating calls
    const endPrevMonth = selectedDateMoment.clone().subtract({ months: 1 }).endOf('month'),
          startNextMonth = selectedDateMoment.clone().add({ month: 1 }).startOf('month'),
          daysInMonth = selectedDateMoment.daysInMonth(),
          startingDay = selectedDateMoment.clone().startOf('month').day(),
          weekEnds = {
            Sunday: 0,
            Saturday: 6,
          },
          data = {};

    // Iterate through the days that are in the start week of the current month but are in the previous month
    let week = domConstruct.toDom(this.calendarTableWeekStartTemplate.apply()),
        dateMoment = endPrevMonth.clone();

    for (let day = endPrevMonth.date() - startingDay + 1; day <= endPrevMonth.date(); day++) {
      if (day === todayMoment.date() && todayMoment.month() === dateMoment.month()) {
        data.isToday = ' isToday';
      } else {
        data.isToday = '';
      }
      data.day = day;
      data.date = dateMoment.date(day).format('YYYY-MM-DD');
      domConstruct.place(this.calendarTableDayTemplate.apply(data, this), week);
    }

    data.month = 'current-month';
    dateMoment = selectedDateMoment.clone();
    for (let day = 1; day <= daysInMonth; day++) {
      if (day === selectedDateMoment.date() && selectedDateMoment.month() === dateMoment.month()) {
        data.selected = 'selected';
      } else {
        data.selected = '';
      }
      if (day === todayMoment.date() && todayMoment.month() === selectedDateMoment.month()) {
        data.isToday = ' isToday';
      } else {
        data.isToday = '';
      }
      data.day = day;
      data.date = dateMoment.date(day).format('YYYY-MM-DD');
      domConstruct.place(this.calendarTableDayTemplate.apply(data, this), week);
      if ((day + startingDay) % 7 === 0) {
        domConstruct.place(this.calendarTableWeekEndTemplate.apply(), week);
        domConstruct.place(week, this.weeksNode);
        week = domConstruct.toDom(this.calendarTableWeekStartTemplate.apply());
      }
    }


    data.selected = '';
    data.month = '';
    dateMoment = startNextMonth.clone();
    // Iterate through remaining days of the week based on 7 days in the week and ensure there are 6 weeks shown (for consistency)
    for (let day = 1; day <= (1 + weekEnds.Saturday - startNextMonth.day()); day++) {
        if (day === todayMoment.date() && todayMoment.month() === dateMoment.month()) {
          data.isToday = ' isToday';
        } else {
          data.isToday = '';
        }
        data.day = day;
        data.date = dateMoment.date(day).format('YYYY-MM-DD');
        domConstruct.place(this.calendarTableDayTemplate.apply(data, this), week);
    }
    domConstruct.place(this.calendarTableWeekEndTemplate.apply(), week);
    domConstruct.place(week, this.weeksNode);

    if (this.weeksNode.children.length === 5) {
      week = domConstruct.toDom(this.calendarTableWeekStartTemplate.apply());
      for (let day = 2 + weekEnds.Saturday - startNextMonth.day(); day <= (8 + weekEnds.Saturday - startNextMonth.day()); day++) {
          if (day === todayMoment.date() && todayMoment.month() === dateMoment.month()) {
            data.isToday = ' isToday';
          } else {
            data.isToday = '';
          }
          data.day = day;
          data.date = dateMoment.date(day).format('YYYY-MM-DD');
          domConstruct.place(this.calendarTableDayTemplate.apply(data, this), week);
      }
      domConstruct.place(this.calendarTableWeekEndTemplate.apply(), week);
      domConstruct.place(week, this.weeksNode);
    }

    this.date.day = selectedDateMoment.date();
    this.date.month = selectedDateMoment.format("MMMM");
    this.date.monthNumber = selectedDateMoment.month();
    this.date.year = selectedDateMoment.year();

    return this;
  },
  show: function(options = {}) {
    this.inherited(arguments);
    this.date = {};
    options = options || this.options;

    this.titleText = options.label ? options.label : this.titleText;
    this.showTimePicker = this.options && this.options.showTimePicker;
    this.date.selectedDateMoment = moment((this.options && this.options.date) || moment());
    this.date.todayMoment = moment();
    if (!(this.isModal || options.isModal)) {
      this.clearButton.style.display = 'none';
    }

    this.goToToday(this.date);
  }
});

lang.setObject('Sage.Platform.Mobile.Calendar', __class);
export default __class;
