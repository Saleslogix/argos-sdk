define('argos/Calendar', ['module', 'exports', 'dojo/_base/declare', './_ActionMixin', 'dijit/_WidgetBase', './_Templated', './Dropdown', './I18n'], function (module, exports, _declare, _ActionMixin2, _WidgetBase2, _Templated2, _Dropdown, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _ActionMixin3 = _interopRequireDefault(_ActionMixin2);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _Dropdown2 = _interopRequireDefault(_Dropdown);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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
  var resource = (0, _I18n2.default)('calendar');

  var __class = (0, _declare2.default)('argos.Calendar', [_WidgetBase3.default, _ActionMixin3.default, _Templated3.default], {
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" class="calendar">', '<div class="calendar-monthview monthview is-fullsize is-selectable">', '{%! $.calendarHeaderTemplate %}', '{%! $.calendarTableTemplate %}', '{%! $.calendarFooterTemplate %}', '</div>', '</div>']),
    calendarHeaderTemplate: new Simplate(['<div class="calendar__header">', '<button type="button" class="btn-icon prev hide-focus" data-action="decrementMonth">\n      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-previous-page"></use>\n      </svg>\n    </button>', '<div class="month" data-dojo-attach-point="monthNode" data-action="toggleMonthModal"></div>', '<div class="year" data-dojo-attach-point="yearNode" data-action="toggleYearModal"></div>', '<button type="button" class="btn-icon next hide-focus" data-action="incrementMonth">\n    <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-next-page"></use>\n    </svg>\n    </button>', '</div>']),
    calendarTableTemplate: new Simplate(['<table class="monthview-table" aria-label="Calendar" role="application">', '<thead>', '{%! $.calendarWeekDaysTemplate %}', '</thead>', '<tbody data-dojo-attach-point="weeksNode"></tbody>', '</table>']),
    calendarFooterTemplate: new Simplate(['<div class="calendar-footer" data-dojo-attach-point="footerNode">', '<button class="btn-secondary clear" data-action="clearCalendar" data-dojo-attach-point="clearButton"><span>{%= $.clearText %}</span></button>', '<button class="btn-secondary toToday" type="button" data-action="goToToday" data-dojo-attach-point="todayButton"><span>{%= $.todayText %}</span></button>', '</div>']),
    calendarTableDayTemplate: new Simplate(['<td class="day {%= $.month %} {%= $.weekend %} {%= $.selected %} {%= $.isToday %}" data-action="changeDay" data-date="{%= $.date %}">', '<span class="day-container">', '<span aria-hidden="true" class="day-text">', '{%= $.day %}', '</span>', '</span>', '</td>']),
    calendarTableDayActiveTemplate: new Simplate(['<div class="day__active">', '</div>']),
    calendarTableWeekStartTemplate: new Simplate(['<tr>']),
    calendarTableWeekEndTemplate: new Simplate(['</tr>']),
    calendarWeekDaysTemplate: new Simplate(['<tr>', '<th>{%= $.weekDaysShortText[0] %}</th>', '<th>{%= $.weekDaysShortText[1] %}</th>', '<th>{%= $.weekDaysShortText[2] %}</th>', '<th>{%= $.weekDaysShortText[3] %}</th>', '<th>{%= $.weekDaysShortText[4] %}</th>', '<th>{%= $.weekDaysShortText[5] %}</th>', '<th>{%= $.weekDaysShortText[6] %}</th>', '</tr>']),

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
      var m = this.getCurrentDateMoment();
      var monthsText = m._locale._months;

      if (monthsText.standalone) {
        monthsText = monthsText.standalone;
      }
      this.monthsText = monthsText.map(function (val, i) {
        return {
          text: val,
          value: i,
          key: i
        };
      });
      this.weekDaysShortText = m._locale._weekdaysMin;
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
    onChangeDay: function onChangeDay() {},
    changeMonthShown: function changeMonthShown(_ref) {
      var monthNumber = _ref.monthNumber;

      this._monthDropdown.setValue(monthNumber);
      return this;
    },
    changeSingleDay: function changeSingleDay(params) {
      if (params) {
        var selected = $('.is-selected', this.weeksNode);

        if (selected) {
          selected.each(function (i, day) {
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
        var selected = $('.is-selected', this.weeksNode);

        if (selected) {
          selected.each(function (i, day) {
            $(day).removeClass('is-selected');
          });
        }

        if (params.$source.parentNode) {
          this._selectedDay = params.$source;
          $(params.$source.parentNode).children().each(function (i, day) {
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
    changeYearShown: function changeYearShown(_ref2) {
      var year = _ref2.year;

      this._yearDropdown.setValue(year);
      return this;
    },
    checkAndRenderDay: function checkAndRenderDay() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var dayIndexer = data.day + data.startingDay - 1;
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
      var day = $(this.calendarTableDayTemplate.apply(data, this));
      if (data.day === this.date.dayNode && data.month.indexOf('alternate') === -1) {
        this._selectedDay = day[0];
      }
      if (this.showSubValues) {
        this.setSubValue(day, data).setActiveDay(day);
      }
      $(data.week).append(day);
    },
    clearCalendar: function clearCalendar() {
      var selected = $('.is-selected', this.weeksNode)[0];

      if (selected) {
        $(selected).removeClass('is-selected');
      }
      this.date.selectedDateMoment = null;
    },
    createMonthDropdown: function createMonthDropdown() {
      if (!this._monthDropdown) {
        this._monthDropdown = new _Dropdown2.default({ id: 'month-dropdown-' + this.id, dropdownClass: 'dropdown--medium input-sm', onSelect: this.setMonth, onSelectScope: this });
        this._monthDropdown.createList({ items: this.monthsText, defaultValue: this.date.selectedDateMoment.month() });
        $(this.monthNode).append(this._monthDropdown.domNode);
      }
      return this;
    },
    createYearDropdown: function createYearDropdown() {
      if (!this._yearDropdown) {
        this._yearDropdown = new _Dropdown2.default({ id: 'year-dropdown-' + this.id, onSelect: this.setYear, dropdownClass: 'dropdown-mx', onSelectScope: this });
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
      this.inherited(arguments);
    },
    getContent: function getContent() {
      if (this.options.timeless) {
        // Revert back to timeless
        this.date.selectedDateMoment.add({
          minutes: this.date.selectedDateMoment.utcOffset()
        });
      }
      return this.date;
    },
    goToToday: function goToToday() {
      this.date.todayMoment = this.getCurrentDateMoment();
      this.date.selectedDateMoment = this.date.todayMoment;
      this.refreshCalendar(this.date); // This will reload the data.
      var day = $('.is-today', this.weeksNode)[0];
      var params = {};
      if (day) {
        params = { $source: day, date: day.dataset.date };
      }
      this.changeDay(params);
    },
    getDateTime: function getDateTime() {
      var result = this.date.selectedDateMoment;
      return result.toDate();
    },
    getCurrentDateMoment: function getCurrentDateMoment() {
      return moment();
    },
    getSelectedDateMoment: function getSelectedDateMoment() {
      return this.date.selectedDateMoment;
    },
    getYearRange: function getYearRange() {
      var items = [];
      var thisYear = this.date.todayMoment.year();
      for (var i = thisYear - 10; i <= thisYear + 10; i++) {
        items.push({
          value: '' + i,
          key: '' + i
        });
      }
      return items;
    },
    incrementMonth: function incrementMonth() {
      this.date.selectedDateMoment.add({ months: 1 });
      this.refreshCalendar(this.date);
    },
    init: function init() {
      this.inherited(arguments);
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
    refreshCalendar: function refreshCalendar() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this._refreshCalendar(date);
      this.onRefreshCalendar(true);
      return this;
    },
    _refreshCalendar: function refreshCalendar() {
      var date = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      $(this.weeksNode).empty();
      this.renderCalendar(date).changeMonthShown(date).changeYearShown(date);
      return this;
    },
    onRefreshCalendar: function onRefreshCalendar() {},
    removeActive: function removeActive(day) {
      if (day) {
        var active = this.isActive(day);
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
    renderCalendar: function renderCalendar(_ref3) {
      var todayMoment = _ref3.todayMoment,
          selectedDateMoment = _ref3.selectedDateMoment;

      var daysInMonth = selectedDateMoment.daysInMonth();
      var startingDay = selectedDateMoment.clone().startOf('month').day();
      var endPrevMonth = selectedDateMoment.clone().startOf('month').subtract({ days: startingDay });
      var startNextMonth = selectedDateMoment.clone().endOf('month').add({ days: 1 });
      var data = {
        todayMoment: todayMoment,
        selectedDateMoment: selectedDateMoment,
        dateMoment: endPrevMonth.clone(),
        week: $(this.calendarTableWeekStartTemplate.apply()),
        startingDay: endPrevMonth.clone().startOf('month').day(),
        weekEnds: {
          Sunday: 0,
          Saturday: 6
        }
      };

      // Iterate through the days that are in the start week of the current month but are in the previous month
      data.month = 'alternate prev-month';
      for (var day = endPrevMonth.date(); day < endPrevMonth.date() + startingDay; day++) {
        data.day = day;
        this.checkAndRenderDay(data);
      }

      data.month = '';
      data.startingDay = startingDay;
      data.dateMoment = selectedDateMoment.clone();
      for (var _day = 1; _day <= daysInMonth; _day++) {
        if (_day === selectedDateMoment.date()) {
          data.selected = 'is-selected';
          this.date.dayNode = _day;
        } else {
          data.selected = '';
        }
        data.day = _day;
        this.checkAndRenderDay(data);
        if ((_day + startingDay) % 7 === 0) {
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
      for (var _day2 = 1; _day2 <= 1 + data.weekEnds.Saturday - startNextMonth.day(); _day2++) {
        data.day = _day2;
        this.checkAndRenderDay(data);
      }
      $(data.week).append($(this.calendarTableWeekEndTemplate.apply()));
      $(this.weeksNode).append(data.week);

      if (this.weeksNode.children.length === 5) {
        data.week = $(this.calendarTableWeekStartTemplate.apply());
        for (var _day3 = 2 + data.weekEnds.Saturday - startNextMonth.day(); _day3 <= 8 + data.weekEnds.Saturday - startNextMonth.day(); _day3++) {
          data.day = _day3;
          this.checkAndRenderDay(data);
        }
        $(data.week).append($(this.calendarTableWeekEndTemplate.apply()));
        $(this.weeksNode).append(data.week);
      }

      this.setDateObject(selectedDateMoment);

      this.postRenderCalendar();

      return this;
    },
    setActiveDay: function setActiveDay() {
      var day = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (day.subValue) {
        var active = this.calendarTableDayActiveTemplate.apply({ count: day.subValue }, this);
        $(day).append(active);
      }
      return this;
    },
    setDateObject: function setDateObject() {
      var dateMoment = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.date.day = dateMoment.date();
      this.date.month = dateMoment.format('MMMM');
      this.date.monthNumber = dateMoment.month();
      this.date.year = dateMoment.year();
      this.date.date = moment(dateMoment).toDate();

      return this;
    },
    setMonth: function setMonth() {
      var monthNumber = Number(this._monthDropdown.getValue());
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
    show: function show() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.date = {};
      this.options = options || this.options;

      this.titleText = this.options.label ? this.options.label : this.titleText;
      this.showTimePicker = this.options && this.options.showTimePicker;
      if (this.options.timeless) {
        // Undo timeless
        var startDate = moment(this.options && this.options.date);
        startDate.subtract({
          minutes: startDate.utcOffset()
        });
        this.date.selectedDateMoment = startDate;
      } else {
        this.date.selectedDateMoment = moment(this.options && this.options.date || moment().clone());
      }
      this.date.todayMoment = moment();
      if (this.isModal || this.options.isModal || this.noClearButton || this.options.noClearButton) {
        this.clearButton.style.display = 'none';
      }
      this.createMonthDropdown().createYearDropdown();

      this.refreshCalendar(this.date);
    },
    toggleSelectWeek: function toggleSelectWeek() {
      this._selectWeek = !this._selectWeek;
      this.changeDay({ $source: this._selectedDay });
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwiY2FsZW5kYXJIZWFkZXJUZW1wbGF0ZSIsImNhbGVuZGFyVGFibGVUZW1wbGF0ZSIsImNhbGVuZGFyRm9vdGVyVGVtcGxhdGUiLCJjYWxlbmRhclRhYmxlRGF5VGVtcGxhdGUiLCJjYWxlbmRhclRhYmxlRGF5QWN0aXZlVGVtcGxhdGUiLCJjYWxlbmRhclRhYmxlV2Vla1N0YXJ0VGVtcGxhdGUiLCJjYWxlbmRhclRhYmxlV2Vla0VuZFRlbXBsYXRlIiwiY2FsZW5kYXJXZWVrRGF5c1RlbXBsYXRlIiwidGl0bGVUZXh0IiwiYW1UZXh0IiwicG1UZXh0IiwiY2xlYXJUZXh0IiwidG9kYXlUZXh0IiwiZGF0ZSIsImlkIiwiaXNNb2RhbCIsIm5vQ2xlYXJCdXR0b24iLCJzaG93VGltZVBpY2tlciIsInNob3dTdWJWYWx1ZXMiLCJfY3VycmVudE1vbnRoIiwiX2N1cnJlbnRZZWFyIiwiX21vbnRoRHJvcGRvd24iLCJfc2VsZWN0V2VlayIsIl9zZWxlY3RlZERheSIsIl93aWRnZXROYW1lIiwiX3llYXJEcm9wZG93biIsImNvbnN0cnVjdG9yIiwibSIsImdldEN1cnJlbnREYXRlTW9tZW50IiwibW9udGhzVGV4dCIsIl9sb2NhbGUiLCJfbW9udGhzIiwic3RhbmRhbG9uZSIsIm1hcCIsInZhbCIsImkiLCJ0ZXh0IiwidmFsdWUiLCJrZXkiLCJ3ZWVrRGF5c1Nob3J0VGV4dCIsIl93ZWVrZGF5c01pbiIsImNoYW5nZURheSIsInBhcmFtcyIsImNoYW5nZVNpbmdsZURheSIsImNoYW5nZVdlZWsiLCJvbkNoYW5nZURheSIsImNoYW5nZU1vbnRoU2hvd24iLCJtb250aE51bWJlciIsInNldFZhbHVlIiwic2VsZWN0ZWQiLCIkIiwid2Vla3NOb2RlIiwiZWFjaCIsImRheSIsInJlbW92ZUNsYXNzIiwiJHNvdXJjZSIsImFkZENsYXNzIiwic2VsZWN0ZWREYXRlTW9tZW50IiwibW9tZW50IiwibW9udGgiLCJyZWZyZXNoQ2FsZW5kYXIiLCJwYXJlbnROb2RlIiwiY2hpbGRyZW4iLCJjaGFuZ2VZZWFyU2hvd24iLCJ5ZWFyIiwiY2hlY2tBbmRSZW5kZXJEYXkiLCJkYXRhIiwiZGF5SW5kZXhlciIsInN0YXJ0aW5nRGF5IiwidG9kYXlNb21lbnQiLCJkYXRlTW9tZW50IiwiaXNUb2RheSIsIndlZWtFbmRzIiwiU3VuZGF5IiwiU2F0dXJkYXkiLCJ3ZWVrZW5kIiwiY2xvbmUiLCJmb3JtYXQiLCJhcHBseSIsImRheU5vZGUiLCJpbmRleE9mIiwic2V0U3ViVmFsdWUiLCJzZXRBY3RpdmVEYXkiLCJ3ZWVrIiwiYXBwZW5kIiwiY2xlYXJDYWxlbmRhciIsImNyZWF0ZU1vbnRoRHJvcGRvd24iLCJkcm9wZG93bkNsYXNzIiwib25TZWxlY3QiLCJzZXRNb250aCIsIm9uU2VsZWN0U2NvcGUiLCJjcmVhdGVMaXN0IiwiaXRlbXMiLCJkZWZhdWx0VmFsdWUiLCJtb250aE5vZGUiLCJkb21Ob2RlIiwiY3JlYXRlWWVhckRyb3Bkb3duIiwic2V0WWVhciIsImdldFllYXJSYW5nZSIsInllYXJOb2RlIiwiZGVjcmVtZW50TW9udGgiLCJzdWJ0cmFjdCIsIm1vbnRocyIsImRlc3Ryb3kiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJnZXRDb250ZW50Iiwib3B0aW9ucyIsInRpbWVsZXNzIiwiYWRkIiwibWludXRlcyIsInV0Y09mZnNldCIsImdvVG9Ub2RheSIsImRhdGFzZXQiLCJnZXREYXRlVGltZSIsInJlc3VsdCIsInRvRGF0ZSIsImdldFNlbGVjdGVkRGF0ZU1vbWVudCIsInRoaXNZZWFyIiwicHVzaCIsImluY3JlbWVudE1vbnRoIiwiaW5pdCIsImlzQWN0aXZlIiwicG9zdFJlbmRlckNhbGVuZGFyIiwiX3JlZnJlc2hDYWxlbmRhciIsIm9uUmVmcmVzaENhbGVuZGFyIiwiZW1wdHkiLCJyZW5kZXJDYWxlbmRhciIsInJlbW92ZUFjdGl2ZSIsImFjdGl2ZSIsInJlbW92ZSIsInJlZnJlc2giLCJkYXlzSW5Nb250aCIsInN0YXJ0T2YiLCJlbmRQcmV2TW9udGgiLCJkYXlzIiwic3RhcnROZXh0TW9udGgiLCJlbmRPZiIsImxlbmd0aCIsInNldERhdGVPYmplY3QiLCJzdWJWYWx1ZSIsImNvdW50IiwiTnVtYmVyIiwiZ2V0VmFsdWUiLCJzaG93IiwibGFiZWwiLCJzdGFydERhdGUiLCJjbGVhckJ1dHRvbiIsInN0eWxlIiwiZGlzcGxheSIsInRvZ2dsZVNlbGVjdFdlZWsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7QUFXQSxNQUFNQSxXQUFXLG9CQUFZLFVBQVosQ0FBakI7O0FBRUEsTUFBTUMsVUFBVSx1QkFBUSxnQkFBUixFQUEwQixrRUFBMUIsRUFBbUU7QUFDakZDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEsQ0FDM0IseUNBRDJCLEVBRTNCLHNFQUYyQixFQUczQixpQ0FIMkIsRUFJM0IsZ0NBSjJCLEVBSzNCLGlDQUwyQixFQU0zQixRQU4yQixFQU8zQixRQVAyQixDQUFiLENBRGlFO0FBVWpGQyw0QkFBd0IsSUFBSUQsUUFBSixDQUFhLENBQ25DLGdDQURtQywyU0FPbkMsNkZBUG1DLEVBUW5DLDBGQVJtQyxpU0FjbkMsUUFkbUMsQ0FBYixDQVZ5RDtBQTBCakZFLDJCQUF1QixJQUFJRixRQUFKLENBQWEsQ0FDbEMsMEVBRGtDLEVBRWxDLFNBRmtDLEVBR2xDLG1DQUhrQyxFQUlsQyxVQUprQyxFQUtsQyxvREFMa0MsRUFNbEMsVUFOa0MsQ0FBYixDQTFCMEQ7QUFrQ2pGRyw0QkFBd0IsSUFBSUgsUUFBSixDQUFhLENBQ25DLG1FQURtQyxFQUVuQywrSUFGbUMsRUFHbkMsMkpBSG1DLEVBSW5DLFFBSm1DLENBQWIsQ0FsQ3lEO0FBd0NqRkksOEJBQTBCLElBQUlKLFFBQUosQ0FBYSxDQUNyQyx1SUFEcUMsRUFFckMsOEJBRnFDLEVBR3JDLDRDQUhxQyxFQUlyQyxj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M0YsYUFBL0UsRUFBOEY7QUFDNUYsYUFBS21JLFdBQUwsQ0FBaUJDLEtBQWpCLENBQXVCQyxPQUF2QixHQUFpQyxNQUFqQztBQUNEO0FBQ0QsV0FBSy9ELG1CQUFMLEdBQ0dVLGtCQURIOztBQUdBLFdBQUtwQyxlQUFMLENBQXFCLEtBQUsvQyxJQUExQjtBQUNELEtBbmNnRjtBQW9jakZ5SSxzQkFBa0IsU0FBU0EsZ0JBQVQsR0FBNEI7QUFDNUMsV0FBS2hJLFdBQUwsR0FBbUIsQ0FBQyxLQUFLQSxXQUF6QjtBQUNBLFdBQUttQixTQUFMLENBQWUsRUFBRWMsU0FBUyxLQUFLaEMsWUFBaEIsRUFBZjtBQUNEO0FBdmNnRixHQUFuRSxDQUFoQjs7b0JBMGNlMUIsTyIsImZpbGUiOiJDYWxlbmRhci5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5DYWxlbmRhclxyXG4gKi9cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IF9BY3Rpb25NaXhpbiBmcm9tICcuL19BY3Rpb25NaXhpbic7XHJcbmltcG9ydCBfV2lkZ2V0QmFzZSBmcm9tICdkaWppdC9fV2lkZ2V0QmFzZSc7XHJcbmltcG9ydCBfVGVtcGxhdGVkIGZyb20gJy4vX1RlbXBsYXRlZCc7XHJcbmltcG9ydCBEcm9wZG93biBmcm9tICcuL0Ryb3Bkb3duJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4vSTE4bic7XHJcblxyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnY2FsZW5kYXInKTtcclxuXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5DYWxlbmRhcicsIFtfV2lkZ2V0QmFzZSwgX0FjdGlvbk1peGluLCBfVGVtcGxhdGVkXSwge1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgaWQ9XCJ7JT0gJC5pZCAlfVwiIGNsYXNzPVwiY2FsZW5kYXJcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJjYWxlbmRhci1tb250aHZpZXcgbW9udGh2aWV3IGlzLWZ1bGxzaXplIGlzLXNlbGVjdGFibGVcIj4nLFxyXG4gICAgJ3slISAkLmNhbGVuZGFySGVhZGVyVGVtcGxhdGUgJX0nLFxyXG4gICAgJ3slISAkLmNhbGVuZGFyVGFibGVUZW1wbGF0ZSAlfScsXHJcbiAgICAneyUhICQuY2FsZW5kYXJGb290ZXJUZW1wbGF0ZSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIGNhbGVuZGFySGVhZGVyVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cImNhbGVuZGFyX19oZWFkZXJcIj4nLFxyXG4gICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWljb24gcHJldiBoaWRlLWZvY3VzXCIgZGF0YS1hY3Rpb249XCJkZWNyZW1lbnRNb250aFwiPlxyXG4gICAgICA8c3ZnIGNsYXNzPVwiaWNvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgIDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeGxpbms6aHJlZj1cIiNpY29uLXByZXZpb3VzLXBhZ2VcIj48L3VzZT5cclxuICAgICAgPC9zdmc+XHJcbiAgICA8L2J1dHRvbj5gLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJtb250aFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJtb250aE5vZGVcIiBkYXRhLWFjdGlvbj1cInRvZ2dsZU1vbnRoTW9kYWxcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJ5ZWFyXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInllYXJOb2RlXCIgZGF0YS1hY3Rpb249XCJ0b2dnbGVZZWFyTW9kYWxcIj48L2Rpdj4nLFxyXG4gICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWljb24gbmV4dCBoaWRlLWZvY3VzXCIgZGF0YS1hY3Rpb249XCJpbmNyZW1lbnRNb250aFwiPlxyXG4gICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgPHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4bGluazpocmVmPVwiI2ljb24tbmV4dC1wYWdlXCI+PC91c2U+XHJcbiAgICA8L3N2Zz5cclxuICAgIDwvYnV0dG9uPmAsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBjYWxlbmRhclRhYmxlVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPHRhYmxlIGNsYXNzPVwibW9udGh2aWV3LXRhYmxlXCIgYXJpYS1sYWJlbD1cIkNhbGVuZGFyXCIgcm9sZT1cImFwcGxpY2F0aW9uXCI+JyxcclxuICAgICc8dGhlYWQ+JyxcclxuICAgICd7JSEgJC5jYWxlbmRhcldlZWtEYXlzVGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvdGhlYWQ+JyxcclxuICAgICc8dGJvZHkgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cIndlZWtzTm9kZVwiPjwvdGJvZHk+JyxcclxuICAgICc8L3RhYmxlPicsXHJcbiAgXSksXHJcbiAgY2FsZW5kYXJGb290ZXJUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiY2FsZW5kYXItZm9vdGVyXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImZvb3Rlck5vZGVcIj4nLFxyXG4gICAgJzxidXR0b24gY2xhc3M9XCJidG4tc2Vjb25kYXJ5IGNsZWFyXCIgZGF0YS1hY3Rpb249XCJjbGVhckNhbGVuZGFyXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImNsZWFyQnV0dG9uXCI+PHNwYW4+eyU9ICQuY2xlYXJUZXh0ICV9PC9zcGFuPjwvYnV0dG9uPicsXHJcbiAgICAnPGJ1dHRvbiBjbGFzcz1cImJ0bi1zZWNvbmRhcnkgdG9Ub2RheVwiIHR5cGU9XCJidXR0b25cIiBkYXRhLWFjdGlvbj1cImdvVG9Ub2RheVwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ0b2RheUJ1dHRvblwiPjxzcGFuPnslPSAkLnRvZGF5VGV4dCAlfTwvc3Bhbj48L2J1dHRvbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgY2FsZW5kYXJUYWJsZURheVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzx0ZCBjbGFzcz1cImRheSB7JT0gJC5tb250aCAlfSB7JT0gJC53ZWVrZW5kICV9IHslPSAkLnNlbGVjdGVkICV9IHslPSAkLmlzVG9kYXkgJX1cIiBkYXRhLWFjdGlvbj1cImNoYW5nZURheVwiIGRhdGEtZGF0ZT1cInslPSAkLmRhdGUgJX1cIj4nLFxyXG4gICAgJzxzcGFuIGNsYXNzPVwiZGF5LWNvbnRhaW5lclwiPicsXHJcbiAgICAnPHNwYW4gYXJpYS1oaWRkZW49XCJ0cnVlXCIgY2xhc3M9XCJkYXktdGV4dFwiPicsXHJcbiAgICAneyU9ICQuZGF5ICV9JyxcclxuICAgICc8L3NwYW4+JyxcclxuICAgICc8L3NwYW4+JyxcclxuICAgICc8L3RkPicsXHJcbiAgXSksXHJcbiAgY2FsZW5kYXJUYWJsZURheUFjdGl2ZVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJkYXlfX2FjdGl2ZVwiPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBjYWxlbmRhclRhYmxlV2Vla1N0YXJ0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPHRyPicsXHJcbiAgXSksXHJcbiAgY2FsZW5kYXJUYWJsZVdlZWtFbmRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8L3RyPicsXHJcbiAgXSksXHJcbiAgY2FsZW5kYXJXZWVrRGF5c1RlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzx0cj4nLFxyXG4gICAgJzx0aD57JT0gJC53ZWVrRGF5c1Nob3J0VGV4dFswXSAlfTwvdGg+JyxcclxuICAgICc8dGg+eyU9ICQud2Vla0RheXNTaG9ydFRleHRbMV0gJX08L3RoPicsXHJcbiAgICAnPHRoPnslPSAkLndlZWtEYXlzU2hvcnRUZXh0WzJdICV9PC90aD4nLFxyXG4gICAgJzx0aD57JT0gJC53ZWVrRGF5c1Nob3J0VGV4dFszXSAlfTwvdGg+JyxcclxuICAgICc8dGg+eyU9ICQud2Vla0RheXNTaG9ydFRleHRbNF0gJX08L3RoPicsXHJcbiAgICAnPHRoPnslPSAkLndlZWtEYXlzU2hvcnRUZXh0WzVdICV9PC90aD4nLFxyXG4gICAgJzx0aD57JT0gJC53ZWVrRGF5c1Nob3J0VGV4dFs2XSAlfTwvdGg+JyxcclxuICAgICc8L3RyPicsXHJcbiAgXSksXHJcblxyXG4gIC8vIExvY2FsaXphdGlvblxyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG4gIGFtVGV4dDogcmVzb3VyY2UuYW1UZXh0LFxyXG4gIHBtVGV4dDogcmVzb3VyY2UucG1UZXh0LFxyXG4gIGNsZWFyVGV4dDogcmVzb3VyY2UuY2xlYXJUZXh0LFxyXG4gIHRvZGF5VGV4dDogcmVzb3VyY2UudG9kYXlUZXh0LFxyXG5cclxuICAvLyBEYXRlIGlzIGFuIG9iamVjdCBjb250YWluaW5nIHNlbGVjdGVkIGRheSwgbW9udGgsIHllYXIsIHRpbWUsIHRvZGF5TW9tZW50ICh0b2RheSksIHNlbGVjdGVkRGF0ZU1vbWVudCwgZXRjLlxyXG4gIGRhdGU6IG51bGwsXHJcbiAgaWQ6ICdnZW5lcmljX2NhbGVuZGFyJyxcclxuICAvLyBUaGlzIGJvb2xlYW4gdmFsdWUgaXMgdXNlZCB0byB0cmlnZ2VyIHRoZSBtb2RhbCBoaWRlIGFuZCBzaG93IGFuZCBtdXN0IGJlIHVzZWQgYnkgZWFjaCBlbnRpdHlcclxuICBpc01vZGFsOiBmYWxzZSxcclxuICBub0NsZWFyQnV0dG9uOiBmYWxzZSxcclxuICBzaG93VGltZVBpY2tlcjogdHJ1ZSxcclxuICBzaG93U3ViVmFsdWVzOiB0cnVlLFxyXG4gIF9jdXJyZW50TW9udGg6IG51bGwsXHJcbiAgX2N1cnJlbnRZZWFyOiBudWxsLFxyXG4gIF9tb250aERyb3Bkb3duOiBudWxsLFxyXG4gIF9zZWxlY3RXZWVrOiBmYWxzZSxcclxuICBfc2VsZWN0ZWREYXk6IG51bGwsXHJcbiAgX3dpZGdldE5hbWU6ICdjYWxlbmRhcicsXHJcbiAgX3llYXJEcm9wZG93bjogbnVsbCxcclxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gY29uc3RydWN0b3IoKSB7XHJcbiAgICBjb25zdCBtID0gdGhpcy5nZXRDdXJyZW50RGF0ZU1vbWVudCgpO1xyXG4gICAgbGV0IG1vbnRoc1RleHQgPSBtLl9sb2NhbGUuX21vbnRocztcclxuXHJcbiAgICBpZiAobW9udGhzVGV4dC5zdGFuZGFsb25lKSB7XHJcbiAgICAgIG1vbnRoc1RleHQgPSBtb250aHNUZXh0LnN0YW5kYWxvbmU7XHJcbiAgICB9XHJcbiAgICB0aGlzLm1vbnRoc1RleHQgPSBtb250aHNUZXh0Lm1hcCgodmFsLCBpKSA9PiB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgdGV4dDogdmFsLFxyXG4gICAgICAgIHZhbHVlOiBpLFxyXG4gICAgICAgIGtleTogaSxcclxuICAgICAgfTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy53ZWVrRGF5c1Nob3J0VGV4dCA9IG0uX2xvY2FsZS5fd2Vla2RheXNNaW47XHJcbiAgfSxcclxuICBjaGFuZ2VEYXk6IGZ1bmN0aW9uIGNoYW5nZURheShwYXJhbXMpIHtcclxuICAgIGlmICghdGhpcy5fc2VsZWN0V2Vlaykge1xyXG4gICAgICB0aGlzLmNoYW5nZVNpbmdsZURheShwYXJhbXMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5jaGFuZ2VXZWVrKHBhcmFtcyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLm9uQ2hhbmdlRGF5KHBhcmFtcyk7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIG9uQ2hhbmdlRGF5OiBmdW5jdGlvbiBvbkNoYW5nZURheSgpIHtcclxuICB9LFxyXG4gIGNoYW5nZU1vbnRoU2hvd246IGZ1bmN0aW9uIGNoYW5nZU1vbnRoU2hvd24oeyBtb250aE51bWJlciB9KSB7XHJcbiAgICB0aGlzLl9tb250aERyb3Bkb3duLnNldFZhbHVlKG1vbnRoTnVtYmVyKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgY2hhbmdlU2luZ2xlRGF5OiBmdW5jdGlvbiBjaGFuZ2VTaW5nbGVEYXkocGFyYW1zKSB7XHJcbiAgICBpZiAocGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gJCgnLmlzLXNlbGVjdGVkJywgdGhpcy53ZWVrc05vZGUpO1xyXG5cclxuICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgc2VsZWN0ZWQuZWFjaCgoaSwgZGF5KSA9PiB7XHJcbiAgICAgICAgICAkKGRheSkucmVtb3ZlQ2xhc3MoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgICQoc2VsZWN0ZWQpLnJlbW92ZUNsYXNzKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLiRzb3VyY2UpIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3RlZERheSA9IHBhcmFtcy4kc291cmNlO1xyXG4gICAgICAgICQocGFyYW1zLiRzb3VyY2UpLmFkZENsYXNzKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmRhdGUpIHtcclxuICAgICAgICB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50ID0gbW9tZW50KHBhcmFtcy5kYXRlLCAnWVlZWS1NTS1ERCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5kYXRlLm1vbnRoTnVtYmVyICE9PSB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50Lm1vbnRoKCkpIHtcclxuICAgICAgICB0aGlzLnJlZnJlc2hDYWxlbmRhcih0aGlzLmRhdGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIGNoYW5nZVdlZWs6IGZ1bmN0aW9uIGNoYW5nZVdlZWsocGFyYW1zKSB7XHJcbiAgICBpZiAocGFyYW1zKSB7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkID0gJCgnLmlzLXNlbGVjdGVkJywgdGhpcy53ZWVrc05vZGUpO1xyXG5cclxuICAgICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgc2VsZWN0ZWQuZWFjaCgoaSwgZGF5KSA9PiB7XHJcbiAgICAgICAgICAkKGRheSkucmVtb3ZlQ2xhc3MoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbXMuJHNvdXJjZS5wYXJlbnROb2RlKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXkgPSBwYXJhbXMuJHNvdXJjZTtcclxuICAgICAgICAkKHBhcmFtcy4kc291cmNlLnBhcmVudE5vZGUpLmNoaWxkcmVuKCkuZWFjaCgoaSwgZGF5KSA9PiB7XHJcbiAgICAgICAgICAkKGRheSkuYWRkQ2xhc3MoJ2lzLXNlbGVjdGVkJyk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChwYXJhbXMuZGF0ZSkge1xyXG4gICAgICAgIHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQgPSBtb21lbnQocGFyYW1zLmRhdGUsICdZWVlZLU1NLUREJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLmRhdGUubW9udGhOdW1iZXIgIT09IHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQubW9udGgoKSkge1xyXG4gICAgICAgIHRoaXMucmVmcmVzaENhbGVuZGFyKHRoaXMuZGF0ZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgY2hhbmdlWWVhclNob3duOiBmdW5jdGlvbiBjaGFuZ2VZZWFyU2hvd24oeyB5ZWFyIH0pIHtcclxuICAgIHRoaXMuX3llYXJEcm9wZG93bi5zZXRWYWx1ZSh5ZWFyKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgY2hlY2tBbmRSZW5kZXJEYXk6IGZ1bmN0aW9uIGNoZWNrQW5kUmVuZGVyRGF5KGRhdGEgPSB7fSkge1xyXG4gICAgY29uc3QgZGF5SW5kZXhlciA9IGRhdGEuZGF5ICsgZGF0YS5zdGFydGluZ0RheSAtIDE7XHJcbiAgICBpZiAoZGF0YS5kYXkgPT09IGRhdGEudG9kYXlNb21lbnQuZGF0ZSgpICYmIGRhdGEudG9kYXlNb21lbnQubW9udGgoKSA9PT0gZGF0YS5kYXRlTW9tZW50Lm1vbnRoKCkgJiYgZGF0YS50b2RheU1vbWVudC55ZWFyKCkgPT09IGRhdGEuZGF0ZU1vbWVudC55ZWFyKCkpIHtcclxuICAgICAgZGF0YS5pc1RvZGF5ID0gJ2lzLXRvZGF5JztcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGRhdGEuaXNUb2RheSA9ICcnO1xyXG4gICAgfVxyXG4gICAgaWYgKGRheUluZGV4ZXIgJSA3ID09PSBkYXRhLndlZWtFbmRzLlN1bmRheSB8fCBkYXlJbmRleGVyICUgNyA9PT0gZGF0YS53ZWVrRW5kcy5TYXR1cmRheSkge1xyXG4gICAgICBkYXRhLndlZWtlbmQgPSAnd2Vla2VuZCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkYXRhLndlZWtlbmQgPSAnJztcclxuICAgIH1cclxuICAgIGRhdGEuZGF0ZSA9IGRhdGEuZGF0ZU1vbWVudC5jbG9uZSgpLmRhdGUoZGF0YS5kYXkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xyXG4gICAgY29uc3QgZGF5ID0gJCh0aGlzLmNhbGVuZGFyVGFibGVEYXlUZW1wbGF0ZS5hcHBseShkYXRhLCB0aGlzKSk7XHJcbiAgICBpZiAoZGF0YS5kYXkgPT09IHRoaXMuZGF0ZS5kYXlOb2RlICYmIGRhdGEubW9udGguaW5kZXhPZignYWx0ZXJuYXRlJykgPT09IC0xKSB7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGVkRGF5ID0gZGF5WzBdO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuc2hvd1N1YlZhbHVlcykge1xyXG4gICAgICB0aGlzLnNldFN1YlZhbHVlKGRheSwgZGF0YSlcclxuICAgICAgICAuc2V0QWN0aXZlRGF5KGRheSk7XHJcbiAgICB9XHJcbiAgICAkKGRhdGEud2VlaykuYXBwZW5kKGRheSk7XHJcbiAgfSxcclxuICBjbGVhckNhbGVuZGFyOiBmdW5jdGlvbiBjbGVhckNhbGVuZGFyKCkge1xyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSAkKCcuaXMtc2VsZWN0ZWQnLCB0aGlzLndlZWtzTm9kZSlbMF07XHJcblxyXG4gICAgaWYgKHNlbGVjdGVkKSB7XHJcbiAgICAgICQoc2VsZWN0ZWQpLnJlbW92ZUNsYXNzKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudCA9IG51bGw7XHJcbiAgfSxcclxuICBjcmVhdGVNb250aERyb3Bkb3duOiBmdW5jdGlvbiBjcmVhdGVNb250aERyb3Bkb3duKCkge1xyXG4gICAgaWYgKCF0aGlzLl9tb250aERyb3Bkb3duKSB7XHJcbiAgICAgIHRoaXMuX21vbnRoRHJvcGRvd24gPSBuZXcgRHJvcGRvd24oeyBpZDogYG1vbnRoLWRyb3Bkb3duLSR7dGhpcy5pZH1gLCBkcm9wZG93bkNsYXNzOiAnZHJvcGRvd24tLW1lZGl1bSBpbnB1dC1zbScsIG9uU2VsZWN0OiB0aGlzLnNldE1vbnRoLCBvblNlbGVjdFNjb3BlOiB0aGlzIH0pO1xyXG4gICAgICB0aGlzLl9tb250aERyb3Bkb3duLmNyZWF0ZUxpc3QoeyBpdGVtczogdGhpcy5tb250aHNUZXh0LCBkZWZhdWx0VmFsdWU6IHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQubW9udGgoKSB9KTtcclxuICAgICAgJCh0aGlzLm1vbnRoTm9kZSkuYXBwZW5kKHRoaXMuX21vbnRoRHJvcGRvd24uZG9tTm9kZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIGNyZWF0ZVllYXJEcm9wZG93bjogZnVuY3Rpb24gY3JlYXRlWWVhckRyb3Bkb3duKCkge1xyXG4gICAgaWYgKCF0aGlzLl95ZWFyRHJvcGRvd24pIHtcclxuICAgICAgdGhpcy5feWVhckRyb3Bkb3duID0gbmV3IERyb3Bkb3duKHsgaWQ6IGB5ZWFyLWRyb3Bkb3duLSR7dGhpcy5pZH1gLCBvblNlbGVjdDogdGhpcy5zZXRZZWFyLCBkcm9wZG93bkNsYXNzOiAnZHJvcGRvd24tbXgnLCBvblNlbGVjdFNjb3BlOiB0aGlzIH0pO1xyXG4gICAgICB0aGlzLl95ZWFyRHJvcGRvd24uY3JlYXRlTGlzdCh7IGl0ZW1zOiB0aGlzLmdldFllYXJSYW5nZSgpLCBkZWZhdWx0VmFsdWU6IHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQuZm9ybWF0KCdZWVlZJykgfSk7XHJcbiAgICAgICQodGhpcy55ZWFyTm9kZSkuYXBwZW5kKHRoaXMuX3llYXJEcm9wZG93bi5kb21Ob2RlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgZGVjcmVtZW50TW9udGg6IGZ1bmN0aW9uIGRlY3JlbWVudE1vbnRoKCkge1xyXG4gICAgdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudC5zdWJ0cmFjdCh7IG1vbnRoczogMSB9KTtcclxuICAgIHRoaXMucmVmcmVzaENhbGVuZGFyKHRoaXMuZGF0ZSk7XHJcbiAgfSxcclxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5feWVhckRyb3Bkb3duLmRlc3Ryb3koKTtcclxuICAgIHRoaXMuX21vbnRoRHJvcGRvd24uZGVzdHJveSgpO1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIGdldENvbnRlbnQ6IGZ1bmN0aW9uIGdldENvbnRlbnQoKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnRpbWVsZXNzKSB7XHJcbiAgICAgIC8vIFJldmVydCBiYWNrIHRvIHRpbWVsZXNzXHJcbiAgICAgIHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQuYWRkKHtcclxuICAgICAgICBtaW51dGVzOiB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50LnV0Y09mZnNldCgpLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmRhdGU7XHJcbiAgfSxcclxuICBnb1RvVG9kYXk6IGZ1bmN0aW9uIGdvVG9Ub2RheSgpIHtcclxuICAgIHRoaXMuZGF0ZS50b2RheU1vbWVudCA9IHRoaXMuZ2V0Q3VycmVudERhdGVNb21lbnQoKTtcclxuICAgIHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQgPSB0aGlzLmRhdGUudG9kYXlNb21lbnQ7XHJcbiAgICB0aGlzLnJlZnJlc2hDYWxlbmRhcih0aGlzLmRhdGUpOyAvLyBUaGlzIHdpbGwgcmVsb2FkIHRoZSBkYXRhLlxyXG4gICAgY29uc3QgZGF5ID0gJCgnLmlzLXRvZGF5JywgdGhpcy53ZWVrc05vZGUpWzBdO1xyXG4gICAgbGV0IHBhcmFtcyA9IHt9O1xyXG4gICAgaWYgKGRheSkge1xyXG4gICAgICBwYXJhbXMgPSB7ICRzb3VyY2U6IGRheSwgZGF0ZTogZGF5LmRhdGFzZXQuZGF0ZSB9O1xyXG4gICAgfVxyXG4gICAgdGhpcy5jaGFuZ2VEYXkocGFyYW1zKTtcclxuICB9LFxyXG4gIGdldERhdGVUaW1lOiBmdW5jdGlvbiBnZXREYXRlVGltZSgpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQ7XHJcbiAgICByZXR1cm4gcmVzdWx0LnRvRGF0ZSgpO1xyXG4gIH0sXHJcbiAgZ2V0Q3VycmVudERhdGVNb21lbnQ6IGZ1bmN0aW9uIGdldEN1cnJlbnREYXRlTW9tZW50KCkge1xyXG4gICAgcmV0dXJuIG1vbWVudCgpO1xyXG4gIH0sXHJcbiAgZ2V0U2VsZWN0ZWREYXRlTW9tZW50OiBmdW5jdGlvbiBnZXRTZWxlY3RlZERhdGVNb21lbnQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudDtcclxuICB9LFxyXG4gIGdldFllYXJSYW5nZTogZnVuY3Rpb24gZ2V0WWVhclJhbmdlKCkge1xyXG4gICAgY29uc3QgaXRlbXMgPSBbXTtcclxuICAgIGNvbnN0IHRoaXNZZWFyID0gdGhpcy5kYXRlLnRvZGF5TW9tZW50LnllYXIoKTtcclxuICAgIGZvciAobGV0IGkgPSB0aGlzWWVhciAtIDEwOyBpIDw9IHRoaXNZZWFyICsgMTA7IGkrKykge1xyXG4gICAgICBpdGVtcy5wdXNoKFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHZhbHVlOiBgJHtpfWAsXHJcbiAgICAgICAgICBrZXk6IGAke2l9YCxcclxuICAgICAgICB9XHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaXRlbXM7XHJcbiAgfSxcclxuICBpbmNyZW1lbnRNb250aDogZnVuY3Rpb24gaW5jcmVtZW50TW9udGgoKSB7XHJcbiAgICB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50LmFkZCh7IG1vbnRoczogMSB9KTtcclxuICAgIHRoaXMucmVmcmVzaENhbGVuZGFyKHRoaXMuZGF0ZSk7XHJcbiAgfSxcclxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIGlzQWN0aXZlOiBmdW5jdGlvbiBpc0FjdGl2ZShkYXkpIHtcclxuICAgIGlmIChkYXkpIHtcclxuICAgICAgcmV0dXJuICQoJy5kYXlfX2FjdGl2ZScsIGRheSlbMF07XHJcbiAgICB9XHJcbiAgfSxcclxuICBwb3N0UmVuZGVyQ2FsZW5kYXI6IGZ1bmN0aW9uIHBvc3RSZW5kZXJDYWxlbmRhcigpIHtcclxuICAgIGlmICh0aGlzLl9zZWxlY3RXZWVrKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlV2Vlayh7ICRzb3VyY2U6IHRoaXMuX3NlbGVjdGVkRGF5IH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVmcmVzaENhbGVuZGFyOiBmdW5jdGlvbiByZWZyZXNoQ2FsZW5kYXIoZGF0ZSA9IHt9KSB7XHJcbiAgICB0aGlzLl9yZWZyZXNoQ2FsZW5kYXIoZGF0ZSk7XHJcbiAgICB0aGlzLm9uUmVmcmVzaENhbGVuZGFyKHRydWUpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBfcmVmcmVzaENhbGVuZGFyOiBmdW5jdGlvbiByZWZyZXNoQ2FsZW5kYXIoZGF0ZSA9IHt9KSB7XHJcbiAgICAkKHRoaXMud2Vla3NOb2RlKS5lbXB0eSgpO1xyXG4gICAgdGhpcy5yZW5kZXJDYWxlbmRhcihkYXRlKVxyXG4gICAgICAuY2hhbmdlTW9udGhTaG93bihkYXRlKVxyXG4gICAgICAuY2hhbmdlWWVhclNob3duKGRhdGUpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBvblJlZnJlc2hDYWxlbmRhcjogZnVuY3Rpb24gb25SZWZyZXNoQ2FsZW5kYXIoKSB7XHJcbiAgfSxcclxuICByZW1vdmVBY3RpdmU6IGZ1bmN0aW9uIHJlbW92ZUFjdGl2ZShkYXkpIHtcclxuICAgIGlmIChkYXkpIHtcclxuICAgICAgY29uc3QgYWN0aXZlID0gdGhpcy5pc0FjdGl2ZShkYXkpO1xyXG4gICAgICBpZiAoYWN0aXZlKSB7XHJcbiAgICAgICAgJChhY3RpdmUpLnJlbW92ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIHJlZnJlc2g6IGZ1bmN0aW9uIHJlZnJlc2gob3B0aW9ucykge1xyXG4gICAgdGhpcy5kYXRlLnRvZGF5TW9tZW50ID0gdGhpcy5nZXRDdXJyZW50RGF0ZU1vbWVudCgpO1xyXG4gICAgdGhpcy5fcmVmcmVzaENhbGVuZGFyKHRoaXMuZGF0ZSk7XHJcbiAgICB0aGlzLm9uUmVmcmVzaENhbGVuZGFyKG9wdGlvbnMpO1xyXG4gIH0sXHJcbiAgcmVuZGVyQ2FsZW5kYXI6IGZ1bmN0aW9uIHJlbmRlckNhbGVuZGFyKHsgdG9kYXlNb21lbnQsIHNlbGVjdGVkRGF0ZU1vbWVudCB9KSB7XHJcbiAgICBjb25zdCBkYXlzSW5Nb250aCA9IHNlbGVjdGVkRGF0ZU1vbWVudC5kYXlzSW5Nb250aCgpO1xyXG4gICAgY29uc3Qgc3RhcnRpbmdEYXkgPSBzZWxlY3RlZERhdGVNb21lbnQuY2xvbmUoKS5zdGFydE9mKCdtb250aCcpLmRheSgpO1xyXG4gICAgY29uc3QgZW5kUHJldk1vbnRoID0gc2VsZWN0ZWREYXRlTW9tZW50LmNsb25lKCkuc3RhcnRPZignbW9udGgnKS5zdWJ0cmFjdCh7IGRheXM6IHN0YXJ0aW5nRGF5IH0pO1xyXG4gICAgY29uc3Qgc3RhcnROZXh0TW9udGggPSBzZWxlY3RlZERhdGVNb21lbnQuY2xvbmUoKS5lbmRPZignbW9udGgnKS5hZGQoeyBkYXlzOiAxIH0pO1xyXG4gICAgY29uc3QgZGF0YSA9IHtcclxuICAgICAgdG9kYXlNb21lbnQsXHJcbiAgICAgIHNlbGVjdGVkRGF0ZU1vbWVudCxcclxuICAgICAgZGF0ZU1vbWVudDogZW5kUHJldk1vbnRoLmNsb25lKCksXHJcbiAgICAgIHdlZWs6ICQodGhpcy5jYWxlbmRhclRhYmxlV2Vla1N0YXJ0VGVtcGxhdGUuYXBwbHkoKSksXHJcbiAgICAgIHN0YXJ0aW5nRGF5OiBlbmRQcmV2TW9udGguY2xvbmUoKS5zdGFydE9mKCdtb250aCcpLmRheSgpLFxyXG4gICAgICB3ZWVrRW5kczoge1xyXG4gICAgICAgIFN1bmRheTogMCxcclxuICAgICAgICBTYXR1cmRheTogNixcclxuICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHRoZSBkYXlzIHRoYXQgYXJlIGluIHRoZSBzdGFydCB3ZWVrIG9mIHRoZSBjdXJyZW50IG1vbnRoIGJ1dCBhcmUgaW4gdGhlIHByZXZpb3VzIG1vbnRoXHJcbiAgICBkYXRhLm1vbnRoID0gJ2FsdGVybmF0ZSBwcmV2LW1vbnRoJztcclxuICAgIGZvciAobGV0IGRheSA9IGVuZFByZXZNb250aC5kYXRlKCk7IGRheSA8IGVuZFByZXZNb250aC5kYXRlKCkgKyBzdGFydGluZ0RheTsgZGF5KyspIHtcclxuICAgICAgZGF0YS5kYXkgPSBkYXk7XHJcbiAgICAgIHRoaXMuY2hlY2tBbmRSZW5kZXJEYXkoZGF0YSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5tb250aCA9ICcnO1xyXG4gICAgZGF0YS5zdGFydGluZ0RheSA9IHN0YXJ0aW5nRGF5O1xyXG4gICAgZGF0YS5kYXRlTW9tZW50ID0gc2VsZWN0ZWREYXRlTW9tZW50LmNsb25lKCk7XHJcbiAgICBmb3IgKGxldCBkYXkgPSAxOyBkYXkgPD0gZGF5c0luTW9udGg7IGRheSsrKSB7XHJcbiAgICAgIGlmIChkYXkgPT09IHNlbGVjdGVkRGF0ZU1vbWVudC5kYXRlKCkpIHtcclxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gJ2lzLXNlbGVjdGVkJztcclxuICAgICAgICB0aGlzLmRhdGUuZGF5Tm9kZSA9IGRheTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkYXRhLnNlbGVjdGVkID0gJyc7XHJcbiAgICAgIH1cclxuICAgICAgZGF0YS5kYXkgPSBkYXk7XHJcbiAgICAgIHRoaXMuY2hlY2tBbmRSZW5kZXJEYXkoZGF0YSk7XHJcbiAgICAgIGlmICgoZGF5ICsgc3RhcnRpbmdEYXkpICUgNyA9PT0gMCkge1xyXG4gICAgICAgICQoZGF0YS53ZWVrKS5hcHBlbmQodGhpcy5jYWxlbmRhclRhYmxlV2Vla0VuZFRlbXBsYXRlLmFwcGx5KCkpO1xyXG4gICAgICAgICQodGhpcy53ZWVrc05vZGUpLmFwcGVuZChkYXRhLndlZWspO1xyXG4gICAgICAgIGRhdGEud2VlayA9ICQodGhpcy5jYWxlbmRhclRhYmxlV2Vla1N0YXJ0VGVtcGxhdGUuYXBwbHkoKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBkYXRhLnNlbGVjdGVkID0gJyc7XHJcbiAgICBkYXRhLnN0YXJ0aW5nRGF5ID0gc3RhcnROZXh0TW9udGguZGF5KCk7XHJcbiAgICBkYXRhLmRhdGVNb21lbnQgPSBzdGFydE5leHRNb250aC5jbG9uZSgpO1xyXG4gICAgLy8gSXRlcmF0ZSB0aHJvdWdoIHJlbWFpbmluZyBkYXlzIG9mIHRoZSB3ZWVrIGJhc2VkIG9uIDcgZGF5cyBpbiB0aGUgd2VlayBhbmQgZW5zdXJlIHRoZXJlIGFyZSA2IHdlZWtzIHNob3duIChmb3IgY29uc2lzdGVuY3kpXHJcbiAgICBkYXRhLm1vbnRoID0gJ2FsdGVybmF0ZSBuZXh0LW1vbnRoJztcclxuICAgIGZvciAobGV0IGRheSA9IDE7IGRheSA8PSAoMSArIGRhdGEud2Vla0VuZHMuU2F0dXJkYXkgLSBzdGFydE5leHRNb250aC5kYXkoKSk7IGRheSsrKSB7XHJcbiAgICAgIGRhdGEuZGF5ID0gZGF5O1xyXG4gICAgICB0aGlzLmNoZWNrQW5kUmVuZGVyRGF5KGRhdGEpO1xyXG4gICAgfVxyXG4gICAgJChkYXRhLndlZWspLmFwcGVuZCgkKHRoaXMuY2FsZW5kYXJUYWJsZVdlZWtFbmRUZW1wbGF0ZS5hcHBseSgpKSk7XHJcbiAgICAkKHRoaXMud2Vla3NOb2RlKS5hcHBlbmQoZGF0YS53ZWVrKTtcclxuXHJcbiAgICBpZiAodGhpcy53ZWVrc05vZGUuY2hpbGRyZW4ubGVuZ3RoID09PSA1KSB7XHJcbiAgICAgIGRhdGEud2VlayA9ICQodGhpcy5jYWxlbmRhclRhYmxlV2Vla1N0YXJ0VGVtcGxhdGUuYXBwbHkoKSk7XHJcbiAgICAgIGZvciAobGV0IGRheSA9IDIgKyBkYXRhLndlZWtFbmRzLlNhdHVyZGF5IC0gc3RhcnROZXh0TW9udGguZGF5KCk7IGRheSA8PSAoOCArIGRhdGEud2Vla0VuZHMuU2F0dXJkYXkgLSBzdGFydE5leHRNb250aC5kYXkoKSk7IGRheSsrKSB7XHJcbiAgICAgICAgZGF0YS5kYXkgPSBkYXk7XHJcbiAgICAgICAgdGhpcy5jaGVja0FuZFJlbmRlckRheShkYXRhKTtcclxuICAgICAgfVxyXG4gICAgICAkKGRhdGEud2VlaykuYXBwZW5kKCQodGhpcy5jYWxlbmRhclRhYmxlV2Vla0VuZFRlbXBsYXRlLmFwcGx5KCkpKTtcclxuICAgICAgJCh0aGlzLndlZWtzTm9kZSkuYXBwZW5kKGRhdGEud2Vlayk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXREYXRlT2JqZWN0KHNlbGVjdGVkRGF0ZU1vbWVudCk7XHJcblxyXG4gICAgdGhpcy5wb3N0UmVuZGVyQ2FsZW5kYXIoKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIHNldEFjdGl2ZURheTogZnVuY3Rpb24gc2V0QWN0aXZlRGF5KGRheSA9IHt9KSB7XHJcbiAgICBpZiAoZGF5LnN1YlZhbHVlKSB7XHJcbiAgICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMuY2FsZW5kYXJUYWJsZURheUFjdGl2ZVRlbXBsYXRlLmFwcGx5KHsgY291bnQ6IGRheS5zdWJWYWx1ZSB9LCB0aGlzKTtcclxuICAgICAgJChkYXkpLmFwcGVuZChhY3RpdmUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBzZXREYXRlT2JqZWN0OiBmdW5jdGlvbiBzZXREYXRlT2JqZWN0KGRhdGVNb21lbnQgPSB7fSkge1xyXG4gICAgdGhpcy5kYXRlLmRheSA9IGRhdGVNb21lbnQuZGF0ZSgpO1xyXG4gICAgdGhpcy5kYXRlLm1vbnRoID0gZGF0ZU1vbWVudC5mb3JtYXQoJ01NTU0nKTtcclxuICAgIHRoaXMuZGF0ZS5tb250aE51bWJlciA9IGRhdGVNb21lbnQubW9udGgoKTtcclxuICAgIHRoaXMuZGF0ZS55ZWFyID0gZGF0ZU1vbWVudC55ZWFyKCk7XHJcbiAgICB0aGlzLmRhdGUuZGF0ZSA9IG1vbWVudChkYXRlTW9tZW50KS50b0RhdGUoKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIHNldE1vbnRoOiBmdW5jdGlvbiBzZXRNb250aCgpIHtcclxuICAgIGNvbnN0IG1vbnRoTnVtYmVyID0gTnVtYmVyKHRoaXMuX21vbnRoRHJvcGRvd24uZ2V0VmFsdWUoKSk7XHJcbiAgICB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50Lm1vbnRoKG1vbnRoTnVtYmVyKTtcclxuICAgIHRoaXMucmVmcmVzaENhbGVuZGFyKHRoaXMuZGF0ZSk7XHJcbiAgfSxcclxuICBzZXRTdWJWYWx1ZTogZnVuY3Rpb24gc2V0U3ViVmFsdWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIHNldFllYXI6IGZ1bmN0aW9uIHNldFllYXIoKSB7XHJcbiAgICB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50LnllYXIodGhpcy5feWVhckRyb3Bkb3duLmdldFZhbHVlKCkpO1xyXG4gICAgdGhpcy5yZWZyZXNoQ2FsZW5kYXIodGhpcy5kYXRlKTtcclxuICB9LFxyXG4gIHNob3c6IGZ1bmN0aW9uIHNob3cob3B0aW9ucyA9IHt9KSB7XHJcbiAgICB0aGlzLmRhdGUgPSB7fTtcclxuICAgIHRoaXMub3B0aW9ucyA9IG9wdGlvbnMgfHwgdGhpcy5vcHRpb25zO1xyXG5cclxuICAgIHRoaXMudGl0bGVUZXh0ID0gdGhpcy5vcHRpb25zLmxhYmVsID8gdGhpcy5vcHRpb25zLmxhYmVsIDogdGhpcy50aXRsZVRleHQ7XHJcbiAgICB0aGlzLnNob3dUaW1lUGlja2VyID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5zaG93VGltZVBpY2tlcjtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMudGltZWxlc3MpIHtcclxuICAgICAgLy8gVW5kbyB0aW1lbGVzc1xyXG4gICAgICBjb25zdCBzdGFydERhdGUgPSBtb21lbnQodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5kYXRlKTtcclxuICAgICAgc3RhcnREYXRlLnN1YnRyYWN0KHtcclxuICAgICAgICBtaW51dGVzOiBzdGFydERhdGUudXRjT2Zmc2V0KCksXHJcbiAgICAgIH0pO1xyXG4gICAgICB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50ID0gc3RhcnREYXRlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudCA9IG1vbWVudCgodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5kYXRlKSB8fCBtb21lbnQoKS5jbG9uZSgpKTtcclxuICAgIH1cclxuICAgIHRoaXMuZGF0ZS50b2RheU1vbWVudCA9IG1vbWVudCgpO1xyXG4gICAgaWYgKHRoaXMuaXNNb2RhbCB8fCB0aGlzLm9wdGlvbnMuaXNNb2RhbCB8fCB0aGlzLm5vQ2xlYXJCdXR0b24gfHwgdGhpcy5vcHRpb25zLm5vQ2xlYXJCdXR0b24pIHtcclxuICAgICAgdGhpcy5jbGVhckJ1dHRvbi5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jcmVhdGVNb250aERyb3Bkb3duKClcclxuICAgICAgLmNyZWF0ZVllYXJEcm9wZG93bigpO1xyXG5cclxuICAgIHRoaXMucmVmcmVzaENhbGVuZGFyKHRoaXMuZGF0ZSk7XHJcbiAgfSxcclxuICB0b2dnbGVTZWxlY3RXZWVrOiBmdW5jdGlvbiB0b2dnbGVTZWxlY3RXZWVrKCkge1xyXG4gICAgdGhpcy5fc2VsZWN0V2VlayA9ICF0aGlzLl9zZWxlY3RXZWVrO1xyXG4gICAgdGhpcy5jaGFuZ2VEYXkoeyAkc291cmNlOiB0aGlzLl9zZWxlY3RlZERheSB9KTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==