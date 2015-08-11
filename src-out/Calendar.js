define('argos/Calendar', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/query', 'dojo/dom-class', 'dojo/dom-construct', 'argos/View', 'moment'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoQuery, _dojoDomClass, _dojoDomConstruct, _argosView, _moment) {
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

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _View = _interopRequireDefault(_argosView);

  var _moment2 = _interopRequireDefault(_moment);

  var __class = (0, _declare['default'])('argos.Calendar', [_View['default']], {
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" class="calendar panel">', '{%! $.calendarHeaderTemplate %}', '{%! $.calendarTableTemplate %}', '{%! $.calendarFooterTemplate %}', '</div>']),
    calendarHeaderTemplate: new Simplate(['<div class="calendar-header">', '<span class="fa fa-angle-left" data-action="decrementMonth"></span>', '<span class="month" data-dojo-attach-point="monthNode"></span>', '<span class="year" data-dojo-attach-point="yearNode"></span>', '<span class="fa fa-angle-right" data-action="incrementMonth"></span>', '</div>']),
    calendarTableTemplate: new Simplate(['<table class="calendar-table">', '<thead>', '{%! $.calendarWeekDaysTemplate %}', '</thead>', '<tbody data-dojo-attach-point="weeksNode"></tbody>', '</table>']),
    calendarFooterTemplate: new Simplate(['<div class="calendar-footer">', '<div class="button tertiary clear" data-action="clearCalendar" data-dojo-attach-point="clearButton">{%= $.clearText %}</div>', '<div class="button tertiary toToday" data-action="goToToday" data-dojo-attach-point="todayButton">{%= $.todayText %}</div>', '</div>']),
    calendarTableDayTemplate: new Simplate(['<td class="day {%= $.month %} {%= $.weekend %} {%= $.selected %} {%= $.isToday %}" data-action="changeDay" data-date="{%= $.date %}">', '{%= $.day %}', '</td>']),
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
    // This boolean value is used to trigger the modal hide and show and must be used by each entity
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

      return this;
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
      this.yearNode.innerHTML = ' ' + year;
      return this;
    },
    checkAndRenderDay: function checkAndRenderDay() {
      var data = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var dayIndexer = data.day + data.startingDay - 1;
      if (data.day === data.todayMoment.date() && data.todayMoment.month() === data.dateMoment.month()) {
        data.isToday = 'isToday';
      } else {
        data.isToday = '';
      }
      if (dayIndexer % 7 === data.weekEnds.Sunday || dayIndexer % 7 === data.weekEnds.Saturday) {
        data.weekend = 'weekend';
      } else {
        data.weekend = '';
      }
      data.date = data.dateMoment.date(data.day).format('YYYY-MM-DD');
      _domConstruct['default'].place(this.calendarTableDayTemplate.apply(data, this), data.week);
    },
    clearCalendar: function clearCalendar() {
      var selected = (0, _query['default'])('.selected', this.weeksNode)[0];

      if (selected) {
        _domClass['default'].remove(selected, 'selected');
        _domClass['default'].add(this.todayButton, 'selected');
      }
      this.date.selectedDateMoment = null;
    },
    decrementMonth: function decrementMonth() {
      this.date.selectedDateMoment.subtract({ months: 1 });
      this.refreshCalendar(this.date);
    },
    getContent: function getContent() {
      return this.date;
    },
    goToToday: function goToToday() {
      _domClass['default'].remove(this.todayButton, 'selected');
      this.date.selectedDateMoment = this.date.todayMoment.clone();
      this.refreshCalendar(this.date);
    },
    incrementMonth: function incrementMonth() {
      this.date.selectedDateMoment.add({ months: 1 });
      this.refreshCalendar(this.date);
    },
    init: function init() {
      this.inherited(arguments);
    },
    refreshCalendar: function refreshCalendar() {
      var date = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _domConstruct['default'].empty(this.weeksNode);
      this.renderCalendar(date).changeMonthShown(date).changeYearShown(date);
    },
    renderCalendar: function renderCalendar(_ref3) {
      var todayMoment = _ref3.todayMoment;
      var selectedDateMoment = _ref3.selectedDateMoment;

      var daysInMonth = selectedDateMoment.daysInMonth();
      var startingDay = selectedDateMoment.clone().startOf('month').day();
      var endPrevMonth = selectedDateMoment.clone().startOf('month').subtract({ days: startingDay });
      var startNextMonth = selectedDateMoment.clone().endOf('month').add({ days: 1 });
      var data = {
        todayMoment: todayMoment,
        selectedDateMoment: selectedDateMoment,
        dateMoment: endPrevMonth.clone(),
        week: _domConstruct['default'].toDom(this.calendarTableWeekStartTemplate.apply()),
        startingDay: endPrevMonth.clone().startOf('month').day(),
        weekEnds: {
          Sunday: 0,
          Saturday: 6
        }
      };

      // Iterate through the days that are in the start week of the current month but are in the previous month
      for (var day = endPrevMonth.date(); day < endPrevMonth.date() + startingDay; day++) {
        data.day = day;
        this.checkAndRenderDay(data);
      }

      data.month = 'current-month';
      data.startingDay = startingDay;
      data.dateMoment = selectedDateMoment.clone();
      for (var day = 1; day <= daysInMonth; day++) {
        if (day === selectedDateMoment.date()) {
          data.selected = 'selected';
        } else {
          data.selected = '';
        }
        data.day = day;
        this.checkAndRenderDay(data);
        if ((day + startingDay) % 7 === 0) {
          _domConstruct['default'].place(this.calendarTableWeekEndTemplate.apply(), data.week);
          _domConstruct['default'].place(data.week, this.weeksNode);
          data.week = _domConstruct['default'].toDom(this.calendarTableWeekStartTemplate.apply());
        }
      }

      data.selected = '';
      data.month = '';
      data.startingDay = startNextMonth.day();
      data.dateMoment = startNextMonth.clone();
      // Iterate through remaining days of the week based on 7 days in the week and ensure there are 6 weeks shown (for consistency)
      for (var day = 1; day <= 1 + data.weekEnds.Saturday - startNextMonth.day(); day++) {
        data.day = day;
        this.checkAndRenderDay(data);
      }
      _domConstruct['default'].place(this.calendarTableWeekEndTemplate.apply(), data.week);
      _domConstruct['default'].place(data.week, this.weeksNode);

      if (this.weeksNode.children.length === 5) {
        data.week = _domConstruct['default'].toDom(this.calendarTableWeekStartTemplate.apply());
        for (var day = 2 + data.weekEnds.Saturday - startNextMonth.day(); day <= 8 + data.weekEnds.Saturday - startNextMonth.day(); day++) {
          data.day = day;
          this.checkAndRenderDay(data);
        }
        _domConstruct['default'].place(this.calendarTableWeekEndTemplate.apply(), data.week);
        _domConstruct['default'].place(data.week, this.weeksNode);
      }

      this.setDateObject(selectedDateMoment);

      if (this.date.monthNumber !== (0, _moment2['default'])().month()) {
        _domClass['default'].add(this.todayButton, 'selected');
      }

      return this;
    },
    setDateObject: function setDateObject() {
      var dateMoment = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.date.day = dateMoment.date();
      this.date.month = dateMoment.format('MMMM');
      this.date.monthNumber = dateMoment.month();
      this.date.year = dateMoment.year();
      this.date.date = (0, _moment2['default'])(dateMoment).toDate();

      return this;
    },
    show: function show() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (!this.isModal) {
        this.inherited(arguments);
      }
      this.date = {};
      this.options = options || this.options;

      this.titleText = this.options.label ? this.options.label : this.titleText;
      this.showTimePicker = this.options && this.options.showTimePicker;
      this.date.selectedDateMoment = (0, _moment2['default'])(this.options && this.options.date || (0, _moment2['default'])());
      this.date.todayMoment = (0, _moment2['default'])();
      if (this.isModal || this.options.isModal) {
        this.clearButton.style.display = 'none';
      }

      this.goToToday(this.date);
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Calendar', __class);
  module.exports = __class;
});
