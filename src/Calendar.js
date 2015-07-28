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
import declare from 'dojo/_base/declare'
import lang from 'dojo/_base/lang'
import string from 'dojo/string'
import domAttr from 'dojo/dom-attr'
import domClass from 'dojo/dom-class'
import domConstruct from 'dojo/dom-construct'
import domStyle from 'dojo/dom-style'
import View from 'argos/View'
import moment from 'moment'

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
      '<div class="button tertiary" data-action="clearCalendar">{%= $.clearText %}</div>',
      '<div class="button tertiary" data-action="goToToday">{%= $.todayText %}</div>',
    '</div>'
  ]),
  calendarTableDayTemplate: new Simplate([
    '<td class="day {%= $.month %} {%= $.selected %}">{%= $.day %}</td>'
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
  // Date is an object containing selected day, month, year, time, todayMoment (today), selectedDateMoment, etc.
  date: null,

  changeMonthShown: function(object) {
    domConstruct.empty(this.monthNode);
    domConstruct.place(object.month, this.monthNode);
    return true;
  },
  changeYearShown: function(object) {
    domConstruct.empty(this.yearNode);
    domConstruct.place(object.year, this.yearNode);
    return true;
  },
  decrementMonth: function(params) {
    this.selectedDate.subtract({ months: 1 });
    return true;
  },
  incrementMonth: function(params) {
    this.selectedDate.add({ months: 1 });
    return true;
  },
  init: function() {
    this.inherited(arguments);
  },
  renderCalendar: function(object) {
    const date = object.todayMoment.clone().startOf('month'),
          prevMonth = object.todayMoment.clone().subtract({ months: 1 });
          nextMonth = object.todayMoment.clone().add({ month: 1 });
          daysInMonth = object.todayMoment.daysInMonth(),
          startingDay = date.day(),
          weekEnds = [0, 6],
          data = {
            day: 1,
            month: '',
            selected: '',
          };
          //startingDay = date.day();

    // Iterate through the days that are in the start week of the current month but are in the previous month
    let week = domConstruct.toDom(this.calendarWeekStartTemplate.apply());
    for (let day = prevMonth.daysInMonth(); day >= prevMonth.daysInMonth() - startingDay; day--) {
      data.day = day;
      domConstruct.place(this.calendarTableDayTemplate.apply(data, this), week);
    }

    data.month = 'current-month';
    for (let day = 1; day <= daysInMonth; day++) {
      if (day % 7 === 0) {
        domConstruct.place(this.calendarWeekEndTemplate.apply(), week);
        domConstruct.place(week, this.weeksNode);
        week = domConstruct.toDom(this.calendarWeekStartTemplate.apply());
      }
      if (day === object.todayMoment.day()) {
        data.selected = 'selected';
      } else {
        data.selected = '';
      }
      data.day = day;
      domConstruct.place(this.calendarTableDayTemplate.apply(data, this), week);
    }

    data.month = '';
    // Iterate through remaining days of the week based on 7 days in the week
    for (let day = 1; day <= (1 + weekEnds[1] - nextMonth.day()); day++) {
        data.day = day;
        domConstruct.place(this.calendarTableDayTemplate.apply(data, this), week);
    }
    domConstruct.place(this.calendarWeekEndTemplate.apply(), week);
    domConstruct.place(week, this.weeksNode);

    this.date.day = this.selectedDateMoment.day();
    this.date.month = this.selectedDateMoment.month();
    this.date.year = this.selectedDateMoment.year();

    return true;
  },
  show: function(options) {
    this.inherited(arguments);
    this.date = {};
    options = options || this.options;

    this.titleText = options.label ? options.label : this.titleText;
    this.showTimePicker = this.options && this.options.showTimePicker;
    this.date.selectedDateMoment = moment((this.options && this.options.date) || moment());
    this.date.todayMoment = App.getPrimaryActiveView().getDateTime();

    this.renderCalendar(this.date)
        .changeMonthShown(this.date)
        .changeYearShown(this.date);
  }
});

lang.setObject('Sage.Platform.Mobile.Calendar', __class);
export default __class;
