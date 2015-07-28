define('argos/Calendar', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', 'dojo/dom-attr', 'dojo/dom-class', 'dojo/dom-construct', 'dojo/dom-style', 'argos/View', 'moment'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoString, _dojoDomAttr, _dojoDomClass, _dojoDomConstruct, _dojoDomStyle, _argosView, _moment) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _string = _interopRequireDefault(_dojoString);

  var _domAttr = _interopRequireDefault(_dojoDomAttr);

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _domStyle = _interopRequireDefault(_dojoDomStyle);

  var _View = _interopRequireDefault(_argosView);

  var _moment2 = _interopRequireDefault(_moment);

  var __class = (0, _declare['default'])('argos.Calendar', [_View['default']], {
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" class="calendar panel">', '{%! $.calendarHeaderTemplate %}', '{%! $.calendarTableTemplate %}', '{%! $.calendarFooterTemplate %}', '</div>']),
    calendarHeaderTemplate: new Simplate(['<div class="calendar-header">', '<span class="fa fa-angle-left" data-action="decrementMonth"></span>', '<span class="month" data-dojo-attach-point="monthNode"></span>', '<span class="year" data-dojo-attach-point="yearNode"></span>', '<span class="fa fa-angle-right" data-action="incrementMonth"></span>', '</div>']),
    calendarTableTemplate: new Simplate(['<table class="calendar-table">', '<thead>', '{%! $.calendarWeekDaysTemplate %}', '</thead>', '<tbody data-dojo-attach-point="weeksNode"></tbody>', '</table>']),
    calendarFooterTemplate: new Simplate(['<div class="calendar-footer">', '<div class="button tertiary" data-action="clearCalendar">{%= $.clearText %}</div>', '<div class="button tertiary" data-action="goToToday">{%= $.todayText %}</div>', '</div>']),
    calendarTableDayTemplate: new Simplate(['<td class="day {%= $.month %} {%= $.selected %}">{%= $.day %}</td>']),
    calendarTableWeekStartTemplate: new Simplate(['<tr class="calendar-week">']),
    calendarTableWeekEndTemplate: new Simplate(['</tr>']),
    calendarWeekDaysTemplate: new Simplate(['<tr class="calendar-weekdays">', '<th>{%= $.weekDaysShortText[0] %}</th>', '<th>{%= $.weekDaysShortText[1] %}</th>', '<th>{%= $.weekDaysShortText[2] %}</th>', '<th>{%= $.weekDaysShortText[3] %}</th>', '<th>{%= $.weekDaysShortText[4] %}</th>', '<th>{%= $.weekDaysShortText[5] %}</th>', '<th>{%= $.weekDaysShortText[6] %}</th>', '</tr>']),
    timePickTemplate: new Simplate(['<div class="time-picker">', '</div>']),

    // Localization
    titleText: 'Calendar',
    amText: 'AM',
    pmText: 'PM',
    clearText: 'Clear',
    todayText: 'Today',
    monthsShortText: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    weekDaysShortText: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],

    id: 'generic_calendar',
    showTimePicker: true,
    // Date is an object containing selected day, month, year, time, todayMoment (today), selectedDateMoment, etc.
    date: null,

    changeMonthShown: function changeMonthShown(object) {
      _domConstruct['default'].empty(this.monthNode);
      _domConstruct['default'].place(object.month, this.monthNode);
      return true;
    },
    changeYearShown: function changeYearShown(object) {
      _domConstruct['default'].empty(this.yearNode);
      _domConstruct['default'].place(object.year, this.yearNode);
      return true;
    },
    decrementMonth: function decrementMonth(params) {
      this.selectedDate.subtract({ months: 1 });
      return true;
    },
    incrementMonth: function incrementMonth(params) {
      this.selectedDate.add({ months: 1 });
      return true;
    },
    init: function init() {
      this.inherited(arguments);
    },
    renderCalendar: function renderCalendar(object) {
      var date = object.todayMoment.clone().startOf('month'),
          prevMonth = object.todayMoment.clone().subtract({ months: 1 });
      nextMonth = object.todayMoment.clone().add({ month: 1 });
      daysInMonth = object.todayMoment.daysInMonth(), startingDay = date.day(), weekEnds = [0, 6], data = {
        day: 1,
        month: '',
        selected: ''
      };
      //startingDay = date.day();

      // Iterate through the days that are in the start week of the current month but are in the previous month
      var week = _domConstruct['default'].toDom(this.calendarWeekStartTemplate.apply());
      for (var day = prevMonth.daysInMonth(); day >= prevMonth.daysInMonth() - startingDay; day--) {
        data.day = day;
        _domConstruct['default'].place(this.calendarTableDayTemplate.apply(data, this), week);
      }

      data.month = 'current-month';
      for (var day = 1; day <= daysInMonth; day++) {
        if (day % 7 === 0) {
          _domConstruct['default'].place(this.calendarWeekEndTemplate.apply(), week);
          _domConstruct['default'].place(week, this.weeksNode);
          week = _domConstruct['default'].toDom(this.calendarWeekStartTemplate.apply());
        }
        if (day === object.todayMoment.day()) {
          data.selected = 'selected';
        } else {
          data.selected = '';
        }
        data.day = day;
        _domConstruct['default'].place(this.calendarTableDayTemplate.apply(data, this), week);
      }

      data.month = '';
      // Iterate through remaining days of the week based on 7 days in the week
      for (var day = 1; day <= 1 + weekEnds[1] - nextMonth.day(); day++) {
        data.day = day;
        _domConstruct['default'].place(this.calendarTableDayTemplate.apply(data, this), week);
      }
      _domConstruct['default'].place(this.calendarWeekEndTemplate.apply(), week);
      _domConstruct['default'].place(week, this.weeksNode);

      this.date.day = this.selectedDateMoment.day();
      this.date.month = this.selectedDateMoment.month();
      this.date.year = this.selectedDateMoment.year();

      return true;
    },
    show: function show(options) {
      this.inherited(arguments);
      this.date = {};
      options = options || this.options;

      this.titleText = options.label ? options.label : this.titleText;
      this.showTimePicker = this.options && this.options.showTimePicker;
      this.date.selectedDateMoment = (0, _moment2['default'])(this.options && this.options.date || (0, _moment2['default'])());
      this.date.todayMoment = App.getPrimaryActiveView().getDateTime();

      this.renderCalendar(this.date).changeMonthShown(this.date).changeYearShown(this.date);
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Calendar', __class);
  module.exports = __class;
});
