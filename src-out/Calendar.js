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
      this.inherited(destroy, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9DYWxlbmRhci5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwiY2FsZW5kYXJIZWFkZXJUZW1wbGF0ZSIsImNhbGVuZGFyVGFibGVUZW1wbGF0ZSIsImNhbGVuZGFyRm9vdGVyVGVtcGxhdGUiLCJjYWxlbmRhclRhYmxlRGF5VGVtcGxhdGUiLCJjYWxlbmRhclRhYmxlRGF5QWN0aXZlVGVtcGxhdGUiLCJjYWxlbmRhclRhYmxlV2Vla1N0YXJ0VGVtcGxhdGUiLCJjYWxlbmRhclRhYmxlV2Vla0VuZFRlbXBsYXRlIiwiY2FsZW5kYXJXZWVrRGF5c1RlbXBsYXRlIiwidGl0bGVUZXh0IiwiYW1UZXh0IiwicG1UZXh0IiwiY2xlYXJUZXh0IiwidG9kYXlUZXh0IiwiZGF0ZSIsImlkIiwiaXNNb2RhbCIsIm5vQ2xlYXJCdXR0b24iLCJzaG93VGltZVBpY2tlciIsInNob3dTdWJWYWx1ZXMiLCJfY3VycmVudE1vbnRoIiwiX2N1cnJlbnRZZWFyIiwiX21vbnRoRHJvcGRvd24iLCJfc2VsZWN0V2VlayIsIl9zZWxlY3RlZERheSIsIl93aWRnZXROYW1lIiwiX3llYXJEcm9wZG93biIsImNvbnN0cnVjdG9yIiwibSIsImdldEN1cnJlbnREYXRlTW9tZW50IiwibW9udGhzVGV4dCIsIl9sb2NhbGUiLCJfbW9udGhzIiwic3RhbmRhbG9uZSIsIm1hcCIsInZhbCIsImkiLCJ0ZXh0IiwidmFsdWUiLCJrZXkiLCJ3ZWVrRGF5c1Nob3J0VGV4dCIsIl93ZWVrZGF5c01pbiIsImNoYW5nZURheSIsInBhcmFtcyIsImNoYW5nZVNpbmdsZURheSIsImNoYW5nZVdlZWsiLCJvbkNoYW5nZURheSIsImNoYW5nZU1vbnRoU2hvd24iLCJtb250aE51bWJlciIsInNldFZhbHVlIiwic2VsZWN0ZWQiLCIkIiwid2Vla3NOb2RlIiwiZWFjaCIsImRheSIsInJlbW92ZUNsYXNzIiwiJHNvdXJjZSIsImFkZENsYXNzIiwic2VsZWN0ZWREYXRlTW9tZW50IiwibW9tZW50IiwibW9udGgiLCJyZWZyZXNoQ2FsZW5kYXIiLCJwYXJlbnROb2RlIiwiY2hpbGRyZW4iLCJjaGFuZ2VZZWFyU2hvd24iLCJ5ZWFyIiwiY2hlY2tBbmRSZW5kZXJEYXkiLCJkYXRhIiwiZGF5SW5kZXhlciIsInN0YXJ0aW5nRGF5IiwidG9kYXlNb21lbnQiLCJkYXRlTW9tZW50IiwiaXNUb2RheSIsIndlZWtFbmRzIiwiU3VuZGF5IiwiU2F0dXJkYXkiLCJ3ZWVrZW5kIiwiY2xvbmUiLCJmb3JtYXQiLCJhcHBseSIsImRheU5vZGUiLCJpbmRleE9mIiwic2V0U3ViVmFsdWUiLCJzZXRBY3RpdmVEYXkiLCJ3ZWVrIiwiYXBwZW5kIiwiY2xlYXJDYWxlbmRhciIsImNyZWF0ZU1vbnRoRHJvcGRvd24iLCJkcm9wZG93bkNsYXNzIiwib25TZWxlY3QiLCJzZXRNb250aCIsIm9uU2VsZWN0U2NvcGUiLCJjcmVhdGVMaXN0IiwiaXRlbXMiLCJkZWZhdWx0VmFsdWUiLCJtb250aE5vZGUiLCJkb21Ob2RlIiwiY3JlYXRlWWVhckRyb3Bkb3duIiwic2V0WWVhciIsImdldFllYXJSYW5nZSIsInllYXJOb2RlIiwiZGVjcmVtZW50TW9udGgiLCJzdWJ0cmFjdCIsIm1vbnRocyIsImRlc3Ryb3kiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJnZXRDb250ZW50Iiwib3B0aW9ucyIsInRpbWVsZXNzIiwiYWRkIiwibWludXRlcyIsInV0Y09mZnNldCIsImdvVG9Ub2RheSIsImRhdGFzZXQiLCJnZXREYXRlVGltZSIsInJlc3VsdCIsInRvRGF0ZSIsImdldFNlbGVjdGVkRGF0ZU1vbWVudCIsInRoaXNZZWFyIiwicHVzaCIsImluY3JlbWVudE1vbnRoIiwiaW5pdCIsImlzQWN0aXZlIiwicG9zdFJlbmRlckNhbGVuZGFyIiwiX3JlZnJlc2hDYWxlbmRhciIsIm9uUmVmcmVzaENhbGVuZGFyIiwiZW1wdHkiLCJyZW5kZXJDYWxlbmRhciIsInJlbW92ZUFjdGl2ZSIsImFjdGl2ZSIsInJlbW92ZSIsInJlZnJlc2giLCJkYXlzSW5Nb250aCIsInN0YXJ0T2YiLCJlbmRQcmV2TW9udGgiLCJkYXlzIiwic3RhcnROZXh0TW9udGgiLCJlbmRPZiIsImxlbmd0aCIsInNldERhdGVPYmplY3QiLCJzdWJWYWx1ZSIsImNvdW50IiwiTnVtYmVyIiwiZ2V0VmFsdWUiLCJzaG93IiwibGFiZWwiLCJzdGFydERhdGUiLCJjbGVhckJ1dHRvbiIsInN0eWxlIiwiZGlzcGxheSIsInRvZ2dsZVNlbGVjdFdlZWsiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7QUFXQSxNQUFNQSxXQUFXLG9CQUFZLFVBQVosQ0FBakI7O0FBRUEsTUFBTUMsVUFBVSx1QkFBUSxnQkFBUixFQUEwQixrRUFBMUIsRUFBbUU7QUFDakZDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEsQ0FDM0IseUNBRDJCLEVBRTNCLHNFQUYyQixFQUczQixpQ0FIMkIsRUFJM0IsZ0NBSjJCLEVBSzNCLGlDQUwyQixFQU0zQixRQU4yQixFQU8zQixRQVAyQixDQUFiLENBRGlFO0FBVWpGQyw0QkFBd0IsSUFBSUQsUUFBSixDQUFhLENBQ25DLGdDQURtQywyU0FPbkMsNkZBUG1DLEVBUW5DLDBGQVJtQyxpU0FjbkMsUUFkbUMsQ0FBYixDQVZ5RDtBQTBCakZFLDJCQUF1QixJQUFJRixRQUFKLENBQWEsQ0FDbEMsMEVBRGtDLEVBRWxDLFNBRmtDLEVBR2xDLG1DQUhrQyxFQUlsQyxVQUprQyxFQUtsQyxvREFMa0MsRUFNbEMsVUFOa0MsQ0FBYixDQTFCMEQ7QUFrQ2pGRyw0QkFBd0IsSUFBSUgsUUFBSixDQUFhLENBQ25DLG1FQURtQyxFQUVuQywrSUFGbUMsRUFHbkMsMkpBSG1DLEVBSW5DLFFBSm1DLENBQWIsQ0FsQ3lEO0FBd0NqRkksOEJBQTBCLElBQUlKLFFBQUosQ0FBYSxDQUNyQyx1SUFEcUMsRUFFckMsOEJBRnFDLEVBR3JDLDRDQUhxQyxFQUlyQyxj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YUFBN0MsSUFBOEQsS0FBSzJGLE9BQUwsQ0FBYTNGLGFBQS9FLEVBQThGO0FBQzVGLGFBQUttSSxXQUFMLENBQWlCQyxLQUFqQixDQUF1QkMsT0FBdkIsR0FBaUMsTUFBakM7QUFDRDtBQUNELFdBQUsvRCxtQkFBTCxHQUNHVSxrQkFESDs7QUFHQSxXQUFLcEMsZUFBTCxDQUFxQixLQUFLL0MsSUFBMUI7QUFDRCxLQW5jZ0Y7QUFvY2pGeUksc0JBQWtCLFNBQVNBLGdCQUFULEdBQTRCO0FBQzVDLFdBQUtoSSxXQUFMLEdBQW1CLENBQUMsS0FBS0EsV0FBekI7QUFDQSxXQUFLbUIsU0FBTCxDQUFlLEVBQUVjLFNBQVMsS0FBS2hDLFlBQWhCLEVBQWY7QUFDRDtBQXZjZ0YsR0FBbkUsQ0FBaEI7O29CQTBjZTFCLE8iLCJmaWxlIjoiQ2FsZW5kYXIuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuQ2FsZW5kYXJcclxuICovXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBfQWN0aW9uTWl4aW4gZnJvbSAnLi9fQWN0aW9uTWl4aW4nO1xyXG5pbXBvcnQgX1dpZGdldEJhc2UgZnJvbSAnZGlqaXQvX1dpZGdldEJhc2UnO1xyXG5pbXBvcnQgX1RlbXBsYXRlZCBmcm9tICcuL19UZW1wbGF0ZWQnO1xyXG5pbXBvcnQgRHJvcGRvd24gZnJvbSAnLi9Ecm9wZG93bic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ2NhbGVuZGFyJyk7XHJcblxyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuQ2FsZW5kYXInLCBbX1dpZGdldEJhc2UsIF9BY3Rpb25NaXhpbiwgX1RlbXBsYXRlZF0sIHtcclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGlkPVwieyU9ICQuaWQgJX1cIiBjbGFzcz1cImNhbGVuZGFyXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiY2FsZW5kYXItbW9udGh2aWV3IG1vbnRodmlldyBpcy1mdWxsc2l6ZSBpcy1zZWxlY3RhYmxlXCI+JyxcclxuICAgICd7JSEgJC5jYWxlbmRhckhlYWRlclRlbXBsYXRlICV9JyxcclxuICAgICd7JSEgJC5jYWxlbmRhclRhYmxlVGVtcGxhdGUgJX0nLFxyXG4gICAgJ3slISAkLmNhbGVuZGFyRm9vdGVyVGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBjYWxlbmRhckhlYWRlclRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJjYWxlbmRhcl9faGVhZGVyXCI+JyxcclxuICAgIGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1pY29uIHByZXYgaGlkZS1mb2N1c1wiIGRhdGEtYWN0aW9uPVwiZGVjcmVtZW50TW9udGhcIj5cclxuICAgICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhsaW5rOmhyZWY9XCIjaWNvbi1wcmV2aW91cy1wYWdlXCI+PC91c2U+XHJcbiAgICAgIDwvc3ZnPlxyXG4gICAgPC9idXR0b24+YCxcclxuICAgICc8ZGl2IGNsYXNzPVwibW9udGhcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwibW9udGhOb2RlXCIgZGF0YS1hY3Rpb249XCJ0b2dnbGVNb250aE1vZGFsXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwieWVhclwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ5ZWFyTm9kZVwiIGRhdGEtYWN0aW9uPVwidG9nZ2xlWWVhck1vZGFsXCI+PC9kaXY+JyxcclxuICAgIGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1pY29uIG5leHQgaGlkZS1mb2N1c1wiIGRhdGEtYWN0aW9uPVwiaW5jcmVtZW50TW9udGhcIj5cclxuICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgIDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeGxpbms6aHJlZj1cIiNpY29uLW5leHQtcGFnZVwiPjwvdXNlPlxyXG4gICAgPC9zdmc+XHJcbiAgICA8L2J1dHRvbj5gLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgY2FsZW5kYXJUYWJsZVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzx0YWJsZSBjbGFzcz1cIm1vbnRodmlldy10YWJsZVwiIGFyaWEtbGFiZWw9XCJDYWxlbmRhclwiIHJvbGU9XCJhcHBsaWNhdGlvblwiPicsXHJcbiAgICAnPHRoZWFkPicsXHJcbiAgICAneyUhICQuY2FsZW5kYXJXZWVrRGF5c1RlbXBsYXRlICV9JyxcclxuICAgICc8L3RoZWFkPicsXHJcbiAgICAnPHRib2R5IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ3ZWVrc05vZGVcIj48L3Rib2R5PicsXHJcbiAgICAnPC90YWJsZT4nLFxyXG4gIF0pLFxyXG4gIGNhbGVuZGFyRm9vdGVyVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cImNhbGVuZGFyLWZvb3RlclwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJmb290ZXJOb2RlXCI+JyxcclxuICAgICc8YnV0dG9uIGNsYXNzPVwiYnRuLXNlY29uZGFyeSBjbGVhclwiIGRhdGEtYWN0aW9uPVwiY2xlYXJDYWxlbmRhclwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJjbGVhckJ1dHRvblwiPjxzcGFuPnslPSAkLmNsZWFyVGV4dCAlfTwvc3Bhbj48L2J1dHRvbj4nLFxyXG4gICAgJzxidXR0b24gY2xhc3M9XCJidG4tc2Vjb25kYXJ5IHRvVG9kYXlcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1hY3Rpb249XCJnb1RvVG9kYXlcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwidG9kYXlCdXR0b25cIj48c3Bhbj57JT0gJC50b2RheVRleHQgJX08L3NwYW4+PC9idXR0b24+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIGNhbGVuZGFyVGFibGVEYXlUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8dGQgY2xhc3M9XCJkYXkgeyU9ICQubW9udGggJX0geyU9ICQud2Vla2VuZCAlfSB7JT0gJC5zZWxlY3RlZCAlfSB7JT0gJC5pc1RvZGF5ICV9XCIgZGF0YS1hY3Rpb249XCJjaGFuZ2VEYXlcIiBkYXRhLWRhdGU9XCJ7JT0gJC5kYXRlICV9XCI+JyxcclxuICAgICc8c3BhbiBjbGFzcz1cImRheS1jb250YWluZXJcIj4nLFxyXG4gICAgJzxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIGNsYXNzPVwiZGF5LXRleHRcIj4nLFxyXG4gICAgJ3slPSAkLmRheSAlfScsXHJcbiAgICAnPC9zcGFuPicsXHJcbiAgICAnPC9zcGFuPicsXHJcbiAgICAnPC90ZD4nLFxyXG4gIF0pLFxyXG4gIGNhbGVuZGFyVGFibGVEYXlBY3RpdmVUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiZGF5X19hY3RpdmVcIj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgY2FsZW5kYXJUYWJsZVdlZWtTdGFydFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzx0cj4nLFxyXG4gIF0pLFxyXG4gIGNhbGVuZGFyVGFibGVXZWVrRW5kVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPC90cj4nLFxyXG4gIF0pLFxyXG4gIGNhbGVuZGFyV2Vla0RheXNUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8dHI+JyxcclxuICAgICc8dGg+eyU9ICQud2Vla0RheXNTaG9ydFRleHRbMF0gJX08L3RoPicsXHJcbiAgICAnPHRoPnslPSAkLndlZWtEYXlzU2hvcnRUZXh0WzFdICV9PC90aD4nLFxyXG4gICAgJzx0aD57JT0gJC53ZWVrRGF5c1Nob3J0VGV4dFsyXSAlfTwvdGg+JyxcclxuICAgICc8dGg+eyU9ICQud2Vla0RheXNTaG9ydFRleHRbM10gJX08L3RoPicsXHJcbiAgICAnPHRoPnslPSAkLndlZWtEYXlzU2hvcnRUZXh0WzRdICV9PC90aD4nLFxyXG4gICAgJzx0aD57JT0gJC53ZWVrRGF5c1Nob3J0VGV4dFs1XSAlfTwvdGg+JyxcclxuICAgICc8dGg+eyU9ICQud2Vla0RheXNTaG9ydFRleHRbNl0gJX08L3RoPicsXHJcbiAgICAnPC90cj4nLFxyXG4gIF0pLFxyXG5cclxuICAvLyBMb2NhbGl6YXRpb25cclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuICBhbVRleHQ6IHJlc291cmNlLmFtVGV4dCxcclxuICBwbVRleHQ6IHJlc291cmNlLnBtVGV4dCxcclxuICBjbGVhclRleHQ6IHJlc291cmNlLmNsZWFyVGV4dCxcclxuICB0b2RheVRleHQ6IHJlc291cmNlLnRvZGF5VGV4dCxcclxuXHJcbiAgLy8gRGF0ZSBpcyBhbiBvYmplY3QgY29udGFpbmluZyBzZWxlY3RlZCBkYXksIG1vbnRoLCB5ZWFyLCB0aW1lLCB0b2RheU1vbWVudCAodG9kYXkpLCBzZWxlY3RlZERhdGVNb21lbnQsIGV0Yy5cclxuICBkYXRlOiBudWxsLFxyXG4gIGlkOiAnZ2VuZXJpY19jYWxlbmRhcicsXHJcbiAgLy8gVGhpcyBib29sZWFuIHZhbHVlIGlzIHVzZWQgdG8gdHJpZ2dlciB0aGUgbW9kYWwgaGlkZSBhbmQgc2hvdyBhbmQgbXVzdCBiZSB1c2VkIGJ5IGVhY2ggZW50aXR5XHJcbiAgaXNNb2RhbDogZmFsc2UsXHJcbiAgbm9DbGVhckJ1dHRvbjogZmFsc2UsXHJcbiAgc2hvd1RpbWVQaWNrZXI6IHRydWUsXHJcbiAgc2hvd1N1YlZhbHVlczogdHJ1ZSxcclxuICBfY3VycmVudE1vbnRoOiBudWxsLFxyXG4gIF9jdXJyZW50WWVhcjogbnVsbCxcclxuICBfbW9udGhEcm9wZG93bjogbnVsbCxcclxuICBfc2VsZWN0V2VlazogZmFsc2UsXHJcbiAgX3NlbGVjdGVkRGF5OiBudWxsLFxyXG4gIF93aWRnZXROYW1lOiAnY2FsZW5kYXInLFxyXG4gIF95ZWFyRHJvcGRvd246IG51bGwsXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgY29uc3QgbSA9IHRoaXMuZ2V0Q3VycmVudERhdGVNb21lbnQoKTtcclxuICAgIGxldCBtb250aHNUZXh0ID0gbS5fbG9jYWxlLl9tb250aHM7XHJcblxyXG4gICAgaWYgKG1vbnRoc1RleHQuc3RhbmRhbG9uZSkge1xyXG4gICAgICBtb250aHNUZXh0ID0gbW9udGhzVGV4dC5zdGFuZGFsb25lO1xyXG4gICAgfVxyXG4gICAgdGhpcy5tb250aHNUZXh0ID0gbW9udGhzVGV4dC5tYXAoKHZhbCwgaSkgPT4ge1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIHRleHQ6IHZhbCxcclxuICAgICAgICB2YWx1ZTogaSxcclxuICAgICAgICBrZXk6IGksXHJcbiAgICAgIH07XHJcbiAgICB9KTtcclxuICAgIHRoaXMud2Vla0RheXNTaG9ydFRleHQgPSBtLl9sb2NhbGUuX3dlZWtkYXlzTWluO1xyXG4gIH0sXHJcbiAgY2hhbmdlRGF5OiBmdW5jdGlvbiBjaGFuZ2VEYXkocGFyYW1zKSB7XHJcbiAgICBpZiAoIXRoaXMuX3NlbGVjdFdlZWspIHtcclxuICAgICAgdGhpcy5jaGFuZ2VTaW5nbGVEYXkocGFyYW1zKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlV2VlayhwYXJhbXMpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5vbkNoYW5nZURheShwYXJhbXMpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBvbkNoYW5nZURheTogZnVuY3Rpb24gb25DaGFuZ2VEYXkoKSB7XHJcbiAgfSxcclxuICBjaGFuZ2VNb250aFNob3duOiBmdW5jdGlvbiBjaGFuZ2VNb250aFNob3duKHsgbW9udGhOdW1iZXIgfSkge1xyXG4gICAgdGhpcy5fbW9udGhEcm9wZG93bi5zZXRWYWx1ZShtb250aE51bWJlcik7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIGNoYW5nZVNpbmdsZURheTogZnVuY3Rpb24gY2hhbmdlU2luZ2xlRGF5KHBhcmFtcykge1xyXG4gICAgaWYgKHBhcmFtcykge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZCA9ICQoJy5pcy1zZWxlY3RlZCcsIHRoaXMud2Vla3NOb2RlKTtcclxuXHJcbiAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgIHNlbGVjdGVkLmVhY2goKGksIGRheSkgPT4ge1xyXG4gICAgICAgICAgJChkYXkpLnJlbW92ZUNsYXNzKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoc2VsZWN0ZWQpIHtcclxuICAgICAgICAkKHNlbGVjdGVkKS5yZW1vdmVDbGFzcygnaXMtc2VsZWN0ZWQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmFtcy4kc291cmNlKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0ZWREYXkgPSBwYXJhbXMuJHNvdXJjZTtcclxuICAgICAgICAkKHBhcmFtcy4kc291cmNlKS5hZGRDbGFzcygnaXMtc2VsZWN0ZWQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHBhcmFtcy5kYXRlKSB7XHJcbiAgICAgICAgdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudCA9IG1vbWVudChwYXJhbXMuZGF0ZSwgJ1lZWVktTU0tREQnKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMuZGF0ZS5tb250aE51bWJlciAhPT0gdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudC5tb250aCgpKSB7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoQ2FsZW5kYXIodGhpcy5kYXRlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBjaGFuZ2VXZWVrOiBmdW5jdGlvbiBjaGFuZ2VXZWVrKHBhcmFtcykge1xyXG4gICAgaWYgKHBhcmFtcykge1xyXG4gICAgICBjb25zdCBzZWxlY3RlZCA9ICQoJy5pcy1zZWxlY3RlZCcsIHRoaXMud2Vla3NOb2RlKTtcclxuXHJcbiAgICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAgIHNlbGVjdGVkLmVhY2goKGksIGRheSkgPT4ge1xyXG4gICAgICAgICAgJChkYXkpLnJlbW92ZUNsYXNzKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLiRzb3VyY2UucGFyZW50Tm9kZSkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGVkRGF5ID0gcGFyYW1zLiRzb3VyY2U7XHJcbiAgICAgICAgJChwYXJhbXMuJHNvdXJjZS5wYXJlbnROb2RlKS5jaGlsZHJlbigpLmVhY2goKGksIGRheSkgPT4ge1xyXG4gICAgICAgICAgJChkYXkpLmFkZENsYXNzKCdpcy1zZWxlY3RlZCcpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocGFyYW1zLmRhdGUpIHtcclxuICAgICAgICB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50ID0gbW9tZW50KHBhcmFtcy5kYXRlLCAnWVlZWS1NTS1ERCcpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAodGhpcy5kYXRlLm1vbnRoTnVtYmVyICE9PSB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50Lm1vbnRoKCkpIHtcclxuICAgICAgICB0aGlzLnJlZnJlc2hDYWxlbmRhcih0aGlzLmRhdGUpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIGNoYW5nZVllYXJTaG93bjogZnVuY3Rpb24gY2hhbmdlWWVhclNob3duKHsgeWVhciB9KSB7XHJcbiAgICB0aGlzLl95ZWFyRHJvcGRvd24uc2V0VmFsdWUoeWVhcik7XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIGNoZWNrQW5kUmVuZGVyRGF5OiBmdW5jdGlvbiBjaGVja0FuZFJlbmRlckRheShkYXRhID0ge30pIHtcclxuICAgIGNvbnN0IGRheUluZGV4ZXIgPSBkYXRhLmRheSArIGRhdGEuc3RhcnRpbmdEYXkgLSAxO1xyXG4gICAgaWYgKGRhdGEuZGF5ID09PSBkYXRhLnRvZGF5TW9tZW50LmRhdGUoKSAmJiBkYXRhLnRvZGF5TW9tZW50Lm1vbnRoKCkgPT09IGRhdGEuZGF0ZU1vbWVudC5tb250aCgpICYmIGRhdGEudG9kYXlNb21lbnQueWVhcigpID09PSBkYXRhLmRhdGVNb21lbnQueWVhcigpKSB7XHJcbiAgICAgIGRhdGEuaXNUb2RheSA9ICdpcy10b2RheSc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBkYXRhLmlzVG9kYXkgPSAnJztcclxuICAgIH1cclxuICAgIGlmIChkYXlJbmRleGVyICUgNyA9PT0gZGF0YS53ZWVrRW5kcy5TdW5kYXkgfHwgZGF5SW5kZXhlciAlIDcgPT09IGRhdGEud2Vla0VuZHMuU2F0dXJkYXkpIHtcclxuICAgICAgZGF0YS53ZWVrZW5kID0gJ3dlZWtlbmQnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgZGF0YS53ZWVrZW5kID0gJyc7XHJcbiAgICB9XHJcbiAgICBkYXRhLmRhdGUgPSBkYXRhLmRhdGVNb21lbnQuY2xvbmUoKS5kYXRlKGRhdGEuZGF5KS5mb3JtYXQoJ1lZWVktTU0tREQnKTtcclxuICAgIGNvbnN0IGRheSA9ICQodGhpcy5jYWxlbmRhclRhYmxlRGF5VGVtcGxhdGUuYXBwbHkoZGF0YSwgdGhpcykpO1xyXG4gICAgaWYgKGRhdGEuZGF5ID09PSB0aGlzLmRhdGUuZGF5Tm9kZSAmJiBkYXRhLm1vbnRoLmluZGV4T2YoJ2FsdGVybmF0ZScpID09PSAtMSkge1xyXG4gICAgICB0aGlzLl9zZWxlY3RlZERheSA9IGRheVswXTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLnNob3dTdWJWYWx1ZXMpIHtcclxuICAgICAgdGhpcy5zZXRTdWJWYWx1ZShkYXksIGRhdGEpXHJcbiAgICAgICAgLnNldEFjdGl2ZURheShkYXkpO1xyXG4gICAgfVxyXG4gICAgJChkYXRhLndlZWspLmFwcGVuZChkYXkpO1xyXG4gIH0sXHJcbiAgY2xlYXJDYWxlbmRhcjogZnVuY3Rpb24gY2xlYXJDYWxlbmRhcigpIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkID0gJCgnLmlzLXNlbGVjdGVkJywgdGhpcy53ZWVrc05vZGUpWzBdO1xyXG5cclxuICAgIGlmIChzZWxlY3RlZCkge1xyXG4gICAgICAkKHNlbGVjdGVkKS5yZW1vdmVDbGFzcygnaXMtc2VsZWN0ZWQnKTtcclxuICAgIH1cclxuICAgIHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQgPSBudWxsO1xyXG4gIH0sXHJcbiAgY3JlYXRlTW9udGhEcm9wZG93bjogZnVuY3Rpb24gY3JlYXRlTW9udGhEcm9wZG93bigpIHtcclxuICAgIGlmICghdGhpcy5fbW9udGhEcm9wZG93bikge1xyXG4gICAgICB0aGlzLl9tb250aERyb3Bkb3duID0gbmV3IERyb3Bkb3duKHsgaWQ6IGBtb250aC1kcm9wZG93bi0ke3RoaXMuaWR9YCwgZHJvcGRvd25DbGFzczogJ2Ryb3Bkb3duLS1tZWRpdW0gaW5wdXQtc20nLCBvblNlbGVjdDogdGhpcy5zZXRNb250aCwgb25TZWxlY3RTY29wZTogdGhpcyB9KTtcclxuICAgICAgdGhpcy5fbW9udGhEcm9wZG93bi5jcmVhdGVMaXN0KHsgaXRlbXM6IHRoaXMubW9udGhzVGV4dCwgZGVmYXVsdFZhbHVlOiB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50Lm1vbnRoKCkgfSk7XHJcbiAgICAgICQodGhpcy5tb250aE5vZGUpLmFwcGVuZCh0aGlzLl9tb250aERyb3Bkb3duLmRvbU5vZGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBjcmVhdGVZZWFyRHJvcGRvd246IGZ1bmN0aW9uIGNyZWF0ZVllYXJEcm9wZG93bigpIHtcclxuICAgIGlmICghdGhpcy5feWVhckRyb3Bkb3duKSB7XHJcbiAgICAgIHRoaXMuX3llYXJEcm9wZG93biA9IG5ldyBEcm9wZG93bih7IGlkOiBgeWVhci1kcm9wZG93bi0ke3RoaXMuaWR9YCwgb25TZWxlY3Q6IHRoaXMuc2V0WWVhciwgZHJvcGRvd25DbGFzczogJ2Ryb3Bkb3duLW14Jywgb25TZWxlY3RTY29wZTogdGhpcyB9KTtcclxuICAgICAgdGhpcy5feWVhckRyb3Bkb3duLmNyZWF0ZUxpc3QoeyBpdGVtczogdGhpcy5nZXRZZWFyUmFuZ2UoKSwgZGVmYXVsdFZhbHVlOiB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50LmZvcm1hdCgnWVlZWScpIH0pO1xyXG4gICAgICAkKHRoaXMueWVhck5vZGUpLmFwcGVuZCh0aGlzLl95ZWFyRHJvcGRvd24uZG9tTm9kZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIGRlY3JlbWVudE1vbnRoOiBmdW5jdGlvbiBkZWNyZW1lbnRNb250aCgpIHtcclxuICAgIHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQuc3VidHJhY3QoeyBtb250aHM6IDEgfSk7XHJcbiAgICB0aGlzLnJlZnJlc2hDYWxlbmRhcih0aGlzLmRhdGUpO1xyXG4gIH0sXHJcbiAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgIHRoaXMuX3llYXJEcm9wZG93bi5kZXN0cm95KCk7XHJcbiAgICB0aGlzLl9tb250aERyb3Bkb3duLmRlc3Ryb3koKTtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGRlc3Ryb3ksIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBnZXRDb250ZW50OiBmdW5jdGlvbiBnZXRDb250ZW50KCkge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucy50aW1lbGVzcykge1xyXG4gICAgICAvLyBSZXZlcnQgYmFjayB0byB0aW1lbGVzc1xyXG4gICAgICB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50LmFkZCh7XHJcbiAgICAgICAgbWludXRlczogdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudC51dGNPZmZzZXQoKSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5kYXRlO1xyXG4gIH0sXHJcbiAgZ29Ub1RvZGF5OiBmdW5jdGlvbiBnb1RvVG9kYXkoKSB7XHJcbiAgICB0aGlzLmRhdGUudG9kYXlNb21lbnQgPSB0aGlzLmdldEN1cnJlbnREYXRlTW9tZW50KCk7XHJcbiAgICB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50ID0gdGhpcy5kYXRlLnRvZGF5TW9tZW50O1xyXG4gICAgdGhpcy5yZWZyZXNoQ2FsZW5kYXIodGhpcy5kYXRlKTsgLy8gVGhpcyB3aWxsIHJlbG9hZCB0aGUgZGF0YS5cclxuICAgIGNvbnN0IGRheSA9ICQoJy5pcy10b2RheScsIHRoaXMud2Vla3NOb2RlKVswXTtcclxuICAgIGxldCBwYXJhbXMgPSB7fTtcclxuICAgIGlmIChkYXkpIHtcclxuICAgICAgcGFyYW1zID0geyAkc291cmNlOiBkYXksIGRhdGU6IGRheS5kYXRhc2V0LmRhdGUgfTtcclxuICAgIH1cclxuICAgIHRoaXMuY2hhbmdlRGF5KHBhcmFtcyk7XHJcbiAgfSxcclxuICBnZXREYXRlVGltZTogZnVuY3Rpb24gZ2V0RGF0ZVRpbWUoKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLmRhdGUuc2VsZWN0ZWREYXRlTW9tZW50O1xyXG4gICAgcmV0dXJuIHJlc3VsdC50b0RhdGUoKTtcclxuICB9LFxyXG4gIGdldEN1cnJlbnREYXRlTW9tZW50OiBmdW5jdGlvbiBnZXRDdXJyZW50RGF0ZU1vbWVudCgpIHtcclxuICAgIHJldHVybiBtb21lbnQoKTtcclxuICB9LFxyXG4gIGdldFNlbGVjdGVkRGF0ZU1vbWVudDogZnVuY3Rpb24gZ2V0U2VsZWN0ZWREYXRlTW9tZW50KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQ7XHJcbiAgfSxcclxuICBnZXRZZWFyUmFuZ2U6IGZ1bmN0aW9uIGdldFllYXJSYW5nZSgpIHtcclxuICAgIGNvbnN0IGl0ZW1zID0gW107XHJcbiAgICBjb25zdCB0aGlzWWVhciA9IHRoaXMuZGF0ZS50b2RheU1vbWVudC55ZWFyKCk7XHJcbiAgICBmb3IgKGxldCBpID0gdGhpc1llYXIgLSAxMDsgaSA8PSB0aGlzWWVhciArIDEwOyBpKyspIHtcclxuICAgICAgaXRlbXMucHVzaChcclxuICAgICAgICB7XHJcbiAgICAgICAgICB2YWx1ZTogYCR7aX1gLFxyXG4gICAgICAgICAga2V5OiBgJHtpfWAsXHJcbiAgICAgICAgfVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGl0ZW1zO1xyXG4gIH0sXHJcbiAgaW5jcmVtZW50TW9udGg6IGZ1bmN0aW9uIGluY3JlbWVudE1vbnRoKCkge1xyXG4gICAgdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudC5hZGQoeyBtb250aHM6IDEgfSk7XHJcbiAgICB0aGlzLnJlZnJlc2hDYWxlbmRhcih0aGlzLmRhdGUpO1xyXG4gIH0sXHJcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGluaXQsIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBpc0FjdGl2ZTogZnVuY3Rpb24gaXNBY3RpdmUoZGF5KSB7XHJcbiAgICBpZiAoZGF5KSB7XHJcbiAgICAgIHJldHVybiAkKCcuZGF5X19hY3RpdmUnLCBkYXkpWzBdO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcG9zdFJlbmRlckNhbGVuZGFyOiBmdW5jdGlvbiBwb3N0UmVuZGVyQ2FsZW5kYXIoKSB7XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0V2Vlaykge1xyXG4gICAgICB0aGlzLmNoYW5nZVdlZWsoeyAkc291cmNlOiB0aGlzLl9zZWxlY3RlZERheSB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIHJlZnJlc2hDYWxlbmRhcjogZnVuY3Rpb24gcmVmcmVzaENhbGVuZGFyKGRhdGUgPSB7fSkge1xyXG4gICAgdGhpcy5fcmVmcmVzaENhbGVuZGFyKGRhdGUpO1xyXG4gICAgdGhpcy5vblJlZnJlc2hDYWxlbmRhcih0cnVlKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgX3JlZnJlc2hDYWxlbmRhcjogZnVuY3Rpb24gcmVmcmVzaENhbGVuZGFyKGRhdGUgPSB7fSkge1xyXG4gICAgJCh0aGlzLndlZWtzTm9kZSkuZW1wdHkoKTtcclxuICAgIHRoaXMucmVuZGVyQ2FsZW5kYXIoZGF0ZSlcclxuICAgICAgLmNoYW5nZU1vbnRoU2hvd24oZGF0ZSlcclxuICAgICAgLmNoYW5nZVllYXJTaG93bihkYXRlKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgb25SZWZyZXNoQ2FsZW5kYXI6IGZ1bmN0aW9uIG9uUmVmcmVzaENhbGVuZGFyKCkge1xyXG4gIH0sXHJcbiAgcmVtb3ZlQWN0aXZlOiBmdW5jdGlvbiByZW1vdmVBY3RpdmUoZGF5KSB7XHJcbiAgICBpZiAoZGF5KSB7XHJcbiAgICAgIGNvbnN0IGFjdGl2ZSA9IHRoaXMuaXNBY3RpdmUoZGF5KTtcclxuICAgICAgaWYgKGFjdGl2ZSkge1xyXG4gICAgICAgICQoYWN0aXZlKS5yZW1vdmUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICByZWZyZXNoOiBmdW5jdGlvbiByZWZyZXNoKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZGF0ZS50b2RheU1vbWVudCA9IHRoaXMuZ2V0Q3VycmVudERhdGVNb21lbnQoKTtcclxuICAgIHRoaXMuX3JlZnJlc2hDYWxlbmRhcih0aGlzLmRhdGUpO1xyXG4gICAgdGhpcy5vblJlZnJlc2hDYWxlbmRhcihvcHRpb25zKTtcclxuICB9LFxyXG4gIHJlbmRlckNhbGVuZGFyOiBmdW5jdGlvbiByZW5kZXJDYWxlbmRhcih7IHRvZGF5TW9tZW50LCBzZWxlY3RlZERhdGVNb21lbnQgfSkge1xyXG4gICAgY29uc3QgZGF5c0luTW9udGggPSBzZWxlY3RlZERhdGVNb21lbnQuZGF5c0luTW9udGgoKTtcclxuICAgIGNvbnN0IHN0YXJ0aW5nRGF5ID0gc2VsZWN0ZWREYXRlTW9tZW50LmNsb25lKCkuc3RhcnRPZignbW9udGgnKS5kYXkoKTtcclxuICAgIGNvbnN0IGVuZFByZXZNb250aCA9IHNlbGVjdGVkRGF0ZU1vbWVudC5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJykuc3VidHJhY3QoeyBkYXlzOiBzdGFydGluZ0RheSB9KTtcclxuICAgIGNvbnN0IHN0YXJ0TmV4dE1vbnRoID0gc2VsZWN0ZWREYXRlTW9tZW50LmNsb25lKCkuZW5kT2YoJ21vbnRoJykuYWRkKHsgZGF5czogMSB9KTtcclxuICAgIGNvbnN0IGRhdGEgPSB7XHJcbiAgICAgIHRvZGF5TW9tZW50LFxyXG4gICAgICBzZWxlY3RlZERhdGVNb21lbnQsXHJcbiAgICAgIGRhdGVNb21lbnQ6IGVuZFByZXZNb250aC5jbG9uZSgpLFxyXG4gICAgICB3ZWVrOiAkKHRoaXMuY2FsZW5kYXJUYWJsZVdlZWtTdGFydFRlbXBsYXRlLmFwcGx5KCkpLFxyXG4gICAgICBzdGFydGluZ0RheTogZW5kUHJldk1vbnRoLmNsb25lKCkuc3RhcnRPZignbW9udGgnKS5kYXkoKSxcclxuICAgICAgd2Vla0VuZHM6IHtcclxuICAgICAgICBTdW5kYXk6IDAsXHJcbiAgICAgICAgU2F0dXJkYXk6IDYsXHJcbiAgICAgIH0sXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCB0aGUgZGF5cyB0aGF0IGFyZSBpbiB0aGUgc3RhcnQgd2VlayBvZiB0aGUgY3VycmVudCBtb250aCBidXQgYXJlIGluIHRoZSBwcmV2aW91cyBtb250aFxyXG4gICAgZGF0YS5tb250aCA9ICdhbHRlcm5hdGUgcHJldi1tb250aCc7XHJcbiAgICBmb3IgKGxldCBkYXkgPSBlbmRQcmV2TW9udGguZGF0ZSgpOyBkYXkgPCBlbmRQcmV2TW9udGguZGF0ZSgpICsgc3RhcnRpbmdEYXk7IGRheSsrKSB7XHJcbiAgICAgIGRhdGEuZGF5ID0gZGF5O1xyXG4gICAgICB0aGlzLmNoZWNrQW5kUmVuZGVyRGF5KGRhdGEpO1xyXG4gICAgfVxyXG5cclxuICAgIGRhdGEubW9udGggPSAnJztcclxuICAgIGRhdGEuc3RhcnRpbmdEYXkgPSBzdGFydGluZ0RheTtcclxuICAgIGRhdGEuZGF0ZU1vbWVudCA9IHNlbGVjdGVkRGF0ZU1vbWVudC5jbG9uZSgpO1xyXG4gICAgZm9yIChsZXQgZGF5ID0gMTsgZGF5IDw9IGRheXNJbk1vbnRoOyBkYXkrKykge1xyXG4gICAgICBpZiAoZGF5ID09PSBzZWxlY3RlZERhdGVNb21lbnQuZGF0ZSgpKSB7XHJcbiAgICAgICAgZGF0YS5zZWxlY3RlZCA9ICdpcy1zZWxlY3RlZCc7XHJcbiAgICAgICAgdGhpcy5kYXRlLmRheU5vZGUgPSBkYXk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0YS5zZWxlY3RlZCA9ICcnO1xyXG4gICAgICB9XHJcbiAgICAgIGRhdGEuZGF5ID0gZGF5O1xyXG4gICAgICB0aGlzLmNoZWNrQW5kUmVuZGVyRGF5KGRhdGEpO1xyXG4gICAgICBpZiAoKGRheSArIHN0YXJ0aW5nRGF5KSAlIDcgPT09IDApIHtcclxuICAgICAgICAkKGRhdGEud2VlaykuYXBwZW5kKHRoaXMuY2FsZW5kYXJUYWJsZVdlZWtFbmRUZW1wbGF0ZS5hcHBseSgpKTtcclxuICAgICAgICAkKHRoaXMud2Vla3NOb2RlKS5hcHBlbmQoZGF0YS53ZWVrKTtcclxuICAgICAgICBkYXRhLndlZWsgPSAkKHRoaXMuY2FsZW5kYXJUYWJsZVdlZWtTdGFydFRlbXBsYXRlLmFwcGx5KCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZGF0YS5zZWxlY3RlZCA9ICcnO1xyXG4gICAgZGF0YS5zdGFydGluZ0RheSA9IHN0YXJ0TmV4dE1vbnRoLmRheSgpO1xyXG4gICAgZGF0YS5kYXRlTW9tZW50ID0gc3RhcnROZXh0TW9udGguY2xvbmUoKTtcclxuICAgIC8vIEl0ZXJhdGUgdGhyb3VnaCByZW1haW5pbmcgZGF5cyBvZiB0aGUgd2VlayBiYXNlZCBvbiA3IGRheXMgaW4gdGhlIHdlZWsgYW5kIGVuc3VyZSB0aGVyZSBhcmUgNiB3ZWVrcyBzaG93biAoZm9yIGNvbnNpc3RlbmN5KVxyXG4gICAgZGF0YS5tb250aCA9ICdhbHRlcm5hdGUgbmV4dC1tb250aCc7XHJcbiAgICBmb3IgKGxldCBkYXkgPSAxOyBkYXkgPD0gKDEgKyBkYXRhLndlZWtFbmRzLlNhdHVyZGF5IC0gc3RhcnROZXh0TW9udGguZGF5KCkpOyBkYXkrKykge1xyXG4gICAgICBkYXRhLmRheSA9IGRheTtcclxuICAgICAgdGhpcy5jaGVja0FuZFJlbmRlckRheShkYXRhKTtcclxuICAgIH1cclxuICAgICQoZGF0YS53ZWVrKS5hcHBlbmQoJCh0aGlzLmNhbGVuZGFyVGFibGVXZWVrRW5kVGVtcGxhdGUuYXBwbHkoKSkpO1xyXG4gICAgJCh0aGlzLndlZWtzTm9kZSkuYXBwZW5kKGRhdGEud2Vlayk7XHJcblxyXG4gICAgaWYgKHRoaXMud2Vla3NOb2RlLmNoaWxkcmVuLmxlbmd0aCA9PT0gNSkge1xyXG4gICAgICBkYXRhLndlZWsgPSAkKHRoaXMuY2FsZW5kYXJUYWJsZVdlZWtTdGFydFRlbXBsYXRlLmFwcGx5KCkpO1xyXG4gICAgICBmb3IgKGxldCBkYXkgPSAyICsgZGF0YS53ZWVrRW5kcy5TYXR1cmRheSAtIHN0YXJ0TmV4dE1vbnRoLmRheSgpOyBkYXkgPD0gKDggKyBkYXRhLndlZWtFbmRzLlNhdHVyZGF5IC0gc3RhcnROZXh0TW9udGguZGF5KCkpOyBkYXkrKykge1xyXG4gICAgICAgIGRhdGEuZGF5ID0gZGF5O1xyXG4gICAgICAgIHRoaXMuY2hlY2tBbmRSZW5kZXJEYXkoZGF0YSk7XHJcbiAgICAgIH1cclxuICAgICAgJChkYXRhLndlZWspLmFwcGVuZCgkKHRoaXMuY2FsZW5kYXJUYWJsZVdlZWtFbmRUZW1wbGF0ZS5hcHBseSgpKSk7XHJcbiAgICAgICQodGhpcy53ZWVrc05vZGUpLmFwcGVuZChkYXRhLndlZWspO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0RGF0ZU9iamVjdChzZWxlY3RlZERhdGVNb21lbnQpO1xyXG5cclxuICAgIHRoaXMucG9zdFJlbmRlckNhbGVuZGFyKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBzZXRBY3RpdmVEYXk6IGZ1bmN0aW9uIHNldEFjdGl2ZURheShkYXkgPSB7fSkge1xyXG4gICAgaWYgKGRheS5zdWJWYWx1ZSkge1xyXG4gICAgICBjb25zdCBhY3RpdmUgPSB0aGlzLmNhbGVuZGFyVGFibGVEYXlBY3RpdmVUZW1wbGF0ZS5hcHBseSh7IGNvdW50OiBkYXkuc3ViVmFsdWUgfSwgdGhpcyk7XHJcbiAgICAgICQoZGF5KS5hcHBlbmQoYWN0aXZlKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgc2V0RGF0ZU9iamVjdDogZnVuY3Rpb24gc2V0RGF0ZU9iamVjdChkYXRlTW9tZW50ID0ge30pIHtcclxuICAgIHRoaXMuZGF0ZS5kYXkgPSBkYXRlTW9tZW50LmRhdGUoKTtcclxuICAgIHRoaXMuZGF0ZS5tb250aCA9IGRhdGVNb21lbnQuZm9ybWF0KCdNTU1NJyk7XHJcbiAgICB0aGlzLmRhdGUubW9udGhOdW1iZXIgPSBkYXRlTW9tZW50Lm1vbnRoKCk7XHJcbiAgICB0aGlzLmRhdGUueWVhciA9IGRhdGVNb21lbnQueWVhcigpO1xyXG4gICAgdGhpcy5kYXRlLmRhdGUgPSBtb21lbnQoZGF0ZU1vbWVudCkudG9EYXRlKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBzZXRNb250aDogZnVuY3Rpb24gc2V0TW9udGgoKSB7XHJcbiAgICBjb25zdCBtb250aE51bWJlciA9IE51bWJlcih0aGlzLl9tb250aERyb3Bkb3duLmdldFZhbHVlKCkpO1xyXG4gICAgdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudC5tb250aChtb250aE51bWJlcik7XHJcbiAgICB0aGlzLnJlZnJlc2hDYWxlbmRhcih0aGlzLmRhdGUpO1xyXG4gIH0sXHJcbiAgc2V0U3ViVmFsdWU6IGZ1bmN0aW9uIHNldFN1YlZhbHVlKCkge1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBzZXRZZWFyOiBmdW5jdGlvbiBzZXRZZWFyKCkge1xyXG4gICAgdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudC55ZWFyKHRoaXMuX3llYXJEcm9wZG93bi5nZXRWYWx1ZSgpKTtcclxuICAgIHRoaXMucmVmcmVzaENhbGVuZGFyKHRoaXMuZGF0ZSk7XHJcbiAgfSxcclxuICBzaG93OiBmdW5jdGlvbiBzaG93KG9wdGlvbnMgPSB7fSkge1xyXG4gICAgdGhpcy5kYXRlID0ge307XHJcbiAgICB0aGlzLm9wdGlvbnMgPSBvcHRpb25zIHx8IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICB0aGlzLnRpdGxlVGV4dCA9IHRoaXMub3B0aW9ucy5sYWJlbCA/IHRoaXMub3B0aW9ucy5sYWJlbCA6IHRoaXMudGl0bGVUZXh0O1xyXG4gICAgdGhpcy5zaG93VGltZVBpY2tlciA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuc2hvd1RpbWVQaWNrZXI7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnRpbWVsZXNzKSB7XHJcbiAgICAgIC8vIFVuZG8gdGltZWxlc3NcclxuICAgICAgY29uc3Qgc3RhcnREYXRlID0gbW9tZW50KHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZGF0ZSk7XHJcbiAgICAgIHN0YXJ0RGF0ZS5zdWJ0cmFjdCh7XHJcbiAgICAgICAgbWludXRlczogc3RhcnREYXRlLnV0Y09mZnNldCgpLFxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5kYXRlLnNlbGVjdGVkRGF0ZU1vbWVudCA9IHN0YXJ0RGF0ZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuZGF0ZS5zZWxlY3RlZERhdGVNb21lbnQgPSBtb21lbnQoKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZGF0ZSkgfHwgbW9tZW50KCkuY2xvbmUoKSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRhdGUudG9kYXlNb21lbnQgPSBtb21lbnQoKTtcclxuICAgIGlmICh0aGlzLmlzTW9kYWwgfHwgdGhpcy5vcHRpb25zLmlzTW9kYWwgfHwgdGhpcy5ub0NsZWFyQnV0dG9uIHx8IHRoaXMub3B0aW9ucy5ub0NsZWFyQnV0dG9uKSB7XHJcbiAgICAgIHRoaXMuY2xlYXJCdXR0b24uc3R5bGUuZGlzcGxheSA9ICdub25lJztcclxuICAgIH1cclxuICAgIHRoaXMuY3JlYXRlTW9udGhEcm9wZG93bigpXHJcbiAgICAgIC5jcmVhdGVZZWFyRHJvcGRvd24oKTtcclxuXHJcbiAgICB0aGlzLnJlZnJlc2hDYWxlbmRhcih0aGlzLmRhdGUpO1xyXG4gIH0sXHJcbiAgdG9nZ2xlU2VsZWN0V2VlazogZnVuY3Rpb24gdG9nZ2xlU2VsZWN0V2VlaygpIHtcclxuICAgIHRoaXMuX3NlbGVjdFdlZWsgPSAhdGhpcy5fc2VsZWN0V2VlaztcclxuICAgIHRoaXMuY2hhbmdlRGF5KHsgJHNvdXJjZTogdGhpcy5fc2VsZWN0ZWREYXkgfSk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=