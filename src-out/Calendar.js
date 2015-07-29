define('argos/Calendar', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/query', 'dojo/string', 'dojo/dom-attr', 'dojo/dom-class', 'dojo/dom-construct', 'dojo/dom-style', 'argos/View', 'moment'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoQuery, _dojoString, _dojoDomAttr, _dojoDomClass, _dojoDomConstruct, _dojoDomStyle, _argosView, _moment) {
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

  var _query = _interopRequireDefault(_dojoQuery);

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
    calendarFooterTemplate: new Simplate(['<div class="calendar-footer">', '<div class="button tertiary clear" data-action="clearCalendar" data-dojo-attach-point="clearButton">{%= $.clearText %}</div>', '<div class="button tertiary toToday" data-action="goToToday" data-dojo-attach-point="todayButton">{%= $.todayText %}</div>', '</div>']),
    calendarTableDayTemplate: new Simplate(['<td class="day {%= $.month %} {%= $.selected %} {%= $.isToday %}" data-action="changeDay" data-date="{%= $.date %}">{%= $.day %}</td>']),
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
    isModal: false,
    // Date is an object containing selected day, month, year, time, todayMoment (today), selectedDateMoment, etc.
    date: null,

    changeDay: function changeDay(params) {
      // TODO: Need to register this event to dojo/connect so that the activity feed and then change based on the date chosen.
      var selected = (0, _query['default'])('.selected', this.weeksNode)[0];

      if (selected) {
        _domClass['default'].remove(selected, 'selected');
      }

      _domClass['default'].add(params.$source, 'selected');

      this.date.selectedDateMoment = (0, _moment2['default'])(params.date, 'YYYY-MM-DD');
      if (this.date.selectedDateMoment.date() !== this.date.todayMoment.date()) {
        _domClass['default'].add(this.todayButton, 'selected');
      }
      if (this.date.month !== this.date.selectedDateMoment.month()) {
        this.refreshCalendar(this.date);
      }
    },
    changeMonthShown: function changeMonthShown(_ref) {
      var month = _ref.month;

      _domConstruct['default'].empty(this.monthNode);
      this.monthNode.innerHTML = month;
      return this;
    },
    changeYearShown: function changeYearShown(_ref2) {
      var year = _ref2.year;

      _domConstruct['default'].empty(this.yearNode);
      this.yearNode.innerHTML = " " + year;
      return this;
    },
    decrementMonth: function decrementMonth(params) {
      this.date.selectedDateMoment.subtract({ months: 1 });
      this.refreshCalendar(this.date);
    },
    goToToday: function goToToday() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _domClass['default'].remove(this.todayButton, 'selected');
      this.date.selectedDateMoment = this.date.todayMoment.clone();
      this.refreshCalendar(this.date);
    },
    incrementMonth: function incrementMonth(params) {
      this.date.selectedDateMoment.add({ months: 1 });
      this.refreshCalendar(this.date);
    },
    init: function init() {
      this.inherited(arguments);
    },
    refreshCalendar: function refreshCalendar() {
      var object = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _domConstruct['default'].empty(this.weeksNode);
      this.renderCalendar(object).changeMonthShown(object).changeYearShown(object);
    },
    renderCalendar: function renderCalendar(_ref3) {
      var todayMoment = _ref3.todayMoment;
      var selectedDateMoment = _ref3.selectedDateMoment;

      // TODO: Refactor the code to call a function that handles the duplicating calls
      var endPrevMonth = selectedDateMoment.clone().subtract({ months: 1 }).endOf('month'),
          startNextMonth = selectedDateMoment.clone().add({ month: 1 }).startOf('month'),
          daysInMonth = selectedDateMoment.daysInMonth(),
          startingDay = selectedDateMoment.clone().startOf('month').day(),
          weekEnds = {
        Sunday: 0,
        Saturday: 6
      },
          data = {};

      // Iterate through the days that are in the start week of the current month but are in the previous month
      var week = _domConstruct['default'].toDom(this.calendarTableWeekStartTemplate.apply()),
          dateMoment = endPrevMonth.clone();

      for (var day = endPrevMonth.date() - startingDay + 1; day <= endPrevMonth.date(); day++) {
        if (day === todayMoment.date() && todayMoment.month() === dateMoment.month()) {
          data.isToday = ' isToday';
        } else {
          data.isToday = '';
        }
        data.day = day;
        data.date = dateMoment.date(day).format('YYYY-MM-DD');
        _domConstruct['default'].place(this.calendarTableDayTemplate.apply(data, this), week);
      }

      data.month = 'current-month';
      dateMoment = selectedDateMoment.clone();
      for (var day = 1; day <= daysInMonth; day++) {
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
        _domConstruct['default'].place(this.calendarTableDayTemplate.apply(data, this), week);
        if ((day + startingDay) % 7 === 0) {
          _domConstruct['default'].place(this.calendarTableWeekEndTemplate.apply(), week);
          _domConstruct['default'].place(week, this.weeksNode);
          week = _domConstruct['default'].toDom(this.calendarTableWeekStartTemplate.apply());
        }
      }

      data.selected = '';
      data.month = '';
      dateMoment = startNextMonth.clone();
      // Iterate through remaining days of the week based on 7 days in the week and ensure there are 6 weeks shown (for consistency)
      for (var day = 1; day <= 1 + weekEnds.Saturday - startNextMonth.day(); day++) {
        if (day === todayMoment.date() && todayMoment.month() === dateMoment.month()) {
          data.isToday = ' isToday';
        } else {
          data.isToday = '';
        }
        data.day = day;
        data.date = dateMoment.date(day).format('YYYY-MM-DD');
        _domConstruct['default'].place(this.calendarTableDayTemplate.apply(data, this), week);
      }
      _domConstruct['default'].place(this.calendarTableWeekEndTemplate.apply(), week);
      _domConstruct['default'].place(week, this.weeksNode);

      if (this.weeksNode.children.length === 5) {
        week = _domConstruct['default'].toDom(this.calendarTableWeekStartTemplate.apply());
        for (var day = 2 + weekEnds.Saturday - startNextMonth.day(); day <= 8 + weekEnds.Saturday - startNextMonth.day(); day++) {
          if (day === todayMoment.date() && todayMoment.month() === dateMoment.month()) {
            data.isToday = ' isToday';
          } else {
            data.isToday = '';
          }
          data.day = day;
          data.date = dateMoment.date(day).format('YYYY-MM-DD');
          _domConstruct['default'].place(this.calendarTableDayTemplate.apply(data, this), week);
        }
        _domConstruct['default'].place(this.calendarTableWeekEndTemplate.apply(), week);
        _domConstruct['default'].place(week, this.weeksNode);
      }

      this.date.day = selectedDateMoment.date();
      this.date.month = selectedDateMoment.format("MMMM");
      this.date.monthNumber = selectedDateMoment.month();
      this.date.year = selectedDateMoment.year();

      return this;
    },
    show: function show() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.inherited(arguments);
      this.date = {};
      options = options || this.options;

      this.titleText = options.label ? options.label : this.titleText;
      this.showTimePicker = this.options && this.options.showTimePicker;
      this.date.selectedDateMoment = (0, _moment2['default'])(this.options && this.options.date || (0, _moment2['default'])());
      this.date.todayMoment = (0, _moment2['default'])();
      if (!(this.isModal || options.isModal)) {
        this.clearButton.style.display = 'none';
      }

      this.goToToday(this.date);
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Calendar', __class);
  module.exports = __class;
});
