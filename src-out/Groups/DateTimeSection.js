define('argos/Groups/DateTimeSection', ['module', 'exports', 'dojo/_base/declare', '../Utility', './_GroupBySection', '../I18n'], function (module, exports, _declare, _Utility, _GroupBySection2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _GroupBySection3 = _interopRequireDefault(_GroupBySection2);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var resource = (0, _I18n2.default)('dateTimeSection');

  /**
   * @class argos.Groups.DateTimeSection
   */
  var __class = (0, _declare2.default)('argos.Groups.DateTimeSection', [_GroupBySection3.default], {
    name: 'DateTimeSectionFilter',
    displayNameText: resource.displayNameText,
    todayText: resource.todayText,
    tomorrowText: resource.tomorrowText,
    laterThisWeekText: resource.laterThisWeekText,
    earlierThisWeekText: resource.earlierThisWeekText,
    thisLaterMonthText: resource.thisLaterMonthText,
    thisEarlierMonthText: resource.thisEarlierMonthText,
    thisYearEarlierText: resource.thisYearEarlierText,
    thisYearLaterText: resource.thisYearLaterText,
    yesterdayText: resource.yesterdayText,
    lastWeekText: resource.lastWeekText,
    lastMonthText: resource.lastMonthText,
    pastYearText: resource.pastYearText,
    nextYearText: resource.nextYearText,
    nextMonthText: resource.nextMonthText,
    nextWeekText: resource.nextWeekText,
    futureText: resource.futureText,
    twoWeeksAgoText: resource.twoWeeksAgoText,
    threeWeeksAgoText: resource.threeWeeksAgoText,
    twoMonthsAgoText: resource.twoMonthsAgoText,
    threeMonthsAgoText: resource.threeMonthsAgoText,
    unknownText: resource.unknownText,

    constructor: function constructor(o) {
      _declare2.default.safeMixin(this, o);
      this.init();
    },
    init: function init() {
      this.inherited(arguments);
      this.sections = [];

      this.sections.push({
        key: 'Today',
        title: this.todayText,
        value: null
      });
      this.sections.push({
        key: 'Tomorrow',
        title: this.tomorrowText,
        value: null
      });
      this.sections.push({
        key: 'LaterThisWeek',
        title: this.laterThisWeekText,
        value: null
      });
      this.sections.push({
        key: 'EarlierThisWeek',
        title: this.earlierThisWeekText,
        value: null
      });
      this.sections.push({
        key: 'EarlierThisMonth',
        title: this.thisEarlierMonthText,
        value: null,
        collapsed: true
      });
      this.sections.push({
        key: 'LaterThisMonth',
        title: this.thisLaterMonthText,
        value: null,
        collapsed: true
      });
      this.sections.push({
        key: 'EarlierThisYear',
        title: this.thisYearEarlierText,
        value: null,
        collapsed: true
      });
      this.sections.push({
        key: 'LaterThisYear',
        title: this.thisYearLaterText,
        value: null,
        collapsed: true
      });
      this.sections.push({
        key: 'Yesterday',
        title: this.yesterdayText,
        value: null
      });
      this.sections.push({
        key: 'LastWeek',
        title: this.lastWeekText,
        value: null,
        collapsed: true
      });
      this.sections.push({
        key: 'LastMonth',
        title: this.lastMonthText,
        value: null,
        collapsed: true
      });
      this.sections.push({
        key: 'PastYear',
        title: this.pastYearText,
        value: null,
        collapsed: true
      });
      this.sections.push({
        key: 'NextYear',
        title: this.nextYearText,
        value: null,
        collapsed: true
      });
      this.sections.push({
        key: 'NextMonth',
        title: this.nextMonthText,
        value: null,
        collapsed: true
      });
      this.sections.push({
        key: 'NextWeek',
        title: this.nextWeekText,
        value: null,
        collapsed: true
      });
      this.sections.push({
        key: 'Future',
        title: this.futureText,
        value: null,
        collapsed: true
      });
    },
    getSection: function getSection(entry) {
      if (this.groupByProperty && entry) {
        var value = _Utility2.default.getValue(entry, this.groupByProperty);
        if (value) {
          return this.getSectionByDateTime(value);
        }

        return this.getDefaultSection();
      }

      return null;
    },
    getDefaultSection: function getDefaultSection() {
      return {
        key: 'Unknown',
        title: this.unknownText,
        collapsed: true
      };
    },
    getSectionKey: function getSectionKey(value) {
      var valueDate = void 0;

      if (!this.currentDate) {
        this.currentDate = moment();
      }

      if (value) {
        valueDate = moment(value);
      } else {
        return 'Unknown';
      }

      if (this.momentLang) {
        valueDate.locale(this.momentLang);
        this.currentDate.locale(this.momentLang);
      }

      if (this.isLastMonth(valueDate)) {
        return 'LastMonth';
      }

      if (this.isEarlierThisMonth(valueDate)) {
        return 'EarlierThisMonth';
      }

      if (this.isLastWeek(valueDate)) {
        return 'LastWeek';
      }

      if (this.isEarlierThisWeek(valueDate)) {
        return 'EarlierThisWeek';
      }

      if (this.isYesterday(valueDate)) {
        return 'Yesterday';
      }

      if (this.isPastYear(valueDate)) {
        return 'PastYear';
      }

      if (this.isToday(valueDate)) {
        return 'Today';
      }

      if (this.isTomorrow(valueDate)) {
        return 'Tomorrow';
      }

      if (this.isLaterThisWeek(valueDate)) {
        return 'LaterThisWeek';
      }

      if (this.isNextWeek(valueDate)) {
        return 'NextWeek';
      }

      if (this.isLaterThisMonth(valueDate)) {
        return 'LaterThisMonth';
      }

      if (this.isNextMonth(valueDate)) {
        return 'NextMonth';
      }

      if (this.isEarlierThisYear(valueDate)) {
        return 'EarlierThisYear';
      }

      if (this.isLaterThisYear(valueDate)) {
        return 'LaterThisYear';
      }

      if (this.isNextYear(valueDate)) {
        return 'NextYear';
      }

      return 'Future';
    },
    isNextYear: function isNextYear(value) {
      // Next year excluding anything that could be within the next month (next week, later this week, tomorrow)
      return value.year() === this.currentDate.year() + 1 && !this.isNextMonth(value);
    },
    isPastYear: function isPastYear(value) {
      return value.year() < this.currentDate.year() && !this.isLastMonth(value);
    },
    isLaterThisYear: function isLaterThisYear(value) {
      // Anything from the end of next month to the end of the year
      var yearEnd = this.currentDate.clone().endOf('year');
      var nextMonthEnd = this.currentDate.clone().add(1, 'month').endOf('month');

      return value.isAfter(nextMonthEnd) && value.isBefore(yearEnd);
    },
    isEarlierThisYear: function isEarlierThisYear(value) {
      // Anything at the start of the year up until last month
      var yearStart = this.currentDate.clone().startOf('year');
      var lastMonthStart = this.currentDate.clone().subtract(1, 'month').startOf('month');
      return value.isAfter(yearStart) && value.isBefore(lastMonthStart);
    },
    isNextMonth: function isNextMonth(value) {
      // next month, excluding any potential upcoming days (next week, later this week, tomorrow)
      var nextMonthStart = this.currentDate.clone().add(1, 'month').startOf('month');
      var nextMonthEnd = nextMonthStart.clone().endOf('month');

      return value.isAfter(nextMonthStart) && value.isBefore(nextMonthEnd) && !this.isNextWeek(value) && !this.isEarlierThisWeek(value) && !this.isTomorrow(value);
    },
    isEarlierThisMonth: function isEarlierThisMonth(value) {
      // Excludes last week
      var monthStart = this.currentDate.clone().startOf('month');
      var lastWeekStart = this.currentDate.clone().subtract(1, 'week').startOf('week');

      return value.isAfter(monthStart) && value.isBefore(lastWeekStart);
    },
    isLaterThisMonth: function isLaterThisMonth(value) {
      // Excludes next week
      var monthEnd = this.currentDate.clone().endOf('month');
      var nextWeekEnd = this.currentDate.clone().add(1, 'week').endOf('week');

      return value.isAfter(nextWeekEnd) && value.isBefore(monthEnd);
    },
    isNextWeek: function isNextWeek(value) {
      var nextWeekStart = this.currentDate.clone().add(1, 'week').startOf('week');
      var nextWeekEnd = nextWeekStart.clone().endOf('week');

      return value.isAfter(nextWeekStart) && value.isBefore(nextWeekEnd) && !this.isTomorrow(value);
    },
    isTomorrow: function isTomorrow(value) {
      var tomorrow = this.currentDate.clone().add(1, 'days').startOf('day');
      var newValue = value.clone().startOf('day');
      return tomorrow.isSame(newValue);
    },
    isToday: function isToday(value) {
      var now = this.currentDate.clone().startOf('day');
      var newValue = value.clone().startOf('day');
      return now.isSame(newValue);
    },
    isYesterday: function isYesterday(value) {
      var yesterday = this.currentDate.clone().subtract(1, 'days').startOf('day');
      var newValue = value.clone().startOf('day');
      return yesterday.isSame(newValue);
    },
    isLaterThisWeek: function isLaterThisWeek(value) {
      // Excludes today, tomorrow, and yesterday
      var later = this.currentDate.clone().add(2, 'days').startOf('day');
      var endWeek = this.currentDate.clone().endOf('week');

      return value.isAfter(later) && value.isBefore(endWeek);
    },
    isEarlierThisWeek: function isEarlierThisWeek(value) {
      // Start of week to yesterday
      var yesterday = this.currentDate.clone().subtract(1, 'days').startOf('day');
      var weekStart = this.currentDate.clone().startOf('week');

      return value.isAfter(weekStart) && value.isBefore(yesterday);
    },
    isLastWeek: function isLastWeek(value) {
      var lastWeekStart = this.currentDate.clone().subtract(1, 'week').startOf('week');
      var lastWeekEnd = lastWeekStart.clone().endOf('week');

      return value.isAfter(lastWeekStart) && value.isBefore(lastWeekEnd) && !this.isYesterday(value);
    },
    isLastMonth: function isLastMonth(value) {
      // Last month, excluding any potential past days (earlier this week, last week, yesterday)
      var lastMonthStart = this.currentDate.clone().subtract(1, 'month').startOf('month');
      var lastMonthEnd = lastMonthStart.clone().endOf('month');

      return value.isAfter(lastMonthStart) && value.isBefore(lastMonthEnd) && !this.isEarlierThisWeek(value) && !this.isLastWeek(value) && !this.isYesterday(value);
    },
    getSectionByKey: function getSectionByKey(key) {
      for (var section in this.sections) {
        if (this.sections[section].key === key) {
          return this.sections[section];
        }
      }
      return this.getDefaultSection();
    },
    getSectionByDateTime: function getSectionByDateTime(value) {
      var key = this.getSectionKey(value);
      var section = this.getSectionByKey(key, value);
      return section;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Hcm91cHMvRGF0ZVRpbWVTZWN0aW9uLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsIm5hbWUiLCJkaXNwbGF5TmFtZVRleHQiLCJ0b2RheVRleHQiLCJ0b21vcnJvd1RleHQiLCJsYXRlclRoaXNXZWVrVGV4dCIsImVhcmxpZXJUaGlzV2Vla1RleHQiLCJ0aGlzTGF0ZXJNb250aFRleHQiLCJ0aGlzRWFybGllck1vbnRoVGV4dCIsInRoaXNZZWFyRWFybGllclRleHQiLCJ0aGlzWWVhckxhdGVyVGV4dCIsInllc3RlcmRheVRleHQiLCJsYXN0V2Vla1RleHQiLCJsYXN0TW9udGhUZXh0IiwicGFzdFllYXJUZXh0IiwibmV4dFllYXJUZXh0IiwibmV4dE1vbnRoVGV4dCIsIm5leHRXZWVrVGV4dCIsImZ1dHVyZVRleHQiLCJ0d29XZWVrc0Fnb1RleHQiLCJ0aHJlZVdlZWtzQWdvVGV4dCIsInR3b01vbnRoc0Fnb1RleHQiLCJ0aHJlZU1vbnRoc0Fnb1RleHQiLCJ1bmtub3duVGV4dCIsImNvbnN0cnVjdG9yIiwibyIsInNhZmVNaXhpbiIsImluaXQiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJzZWN0aW9ucyIsInB1c2giLCJrZXkiLCJ0aXRsZSIsInZhbHVlIiwiY29sbGFwc2VkIiwiZ2V0U2VjdGlvbiIsImVudHJ5IiwiZ3JvdXBCeVByb3BlcnR5IiwiZ2V0VmFsdWUiLCJnZXRTZWN0aW9uQnlEYXRlVGltZSIsImdldERlZmF1bHRTZWN0aW9uIiwiZ2V0U2VjdGlvbktleSIsInZhbHVlRGF0ZSIsImN1cnJlbnREYXRlIiwibW9tZW50IiwibW9tZW50TGFuZyIsImxvY2FsZSIsImlzTGFzdE1vbnRoIiwiaXNFYXJsaWVyVGhpc01vbnRoIiwiaXNMYXN0V2VlayIsImlzRWFybGllclRoaXNXZWVrIiwiaXNZZXN0ZXJkYXkiLCJpc1Bhc3RZZWFyIiwiaXNUb2RheSIsImlzVG9tb3Jyb3ciLCJpc0xhdGVyVGhpc1dlZWsiLCJpc05leHRXZWVrIiwiaXNMYXRlclRoaXNNb250aCIsImlzTmV4dE1vbnRoIiwiaXNFYXJsaWVyVGhpc1llYXIiLCJpc0xhdGVyVGhpc1llYXIiLCJpc05leHRZZWFyIiwieWVhciIsInllYXJFbmQiLCJjbG9uZSIsImVuZE9mIiwibmV4dE1vbnRoRW5kIiwiYWRkIiwiaXNBZnRlciIsImlzQmVmb3JlIiwieWVhclN0YXJ0Iiwic3RhcnRPZiIsImxhc3RNb250aFN0YXJ0Iiwic3VidHJhY3QiLCJuZXh0TW9udGhTdGFydCIsIm1vbnRoU3RhcnQiLCJsYXN0V2Vla1N0YXJ0IiwibW9udGhFbmQiLCJuZXh0V2Vla0VuZCIsIm5leHRXZWVrU3RhcnQiLCJ0b21vcnJvdyIsIm5ld1ZhbHVlIiwiaXNTYW1lIiwibm93IiwieWVzdGVyZGF5IiwibGF0ZXIiLCJlbmRXZWVrIiwid2Vla1N0YXJ0IiwibGFzdFdlZWtFbmQiLCJsYXN0TW9udGhFbmQiLCJnZXRTZWN0aW9uQnlLZXkiLCJzZWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxNQUFNQSxXQUFXLG9CQUFZLGlCQUFaLENBQWpCOztBQUVBOzs7QUFHQSxNQUFNQyxVQUFVLHVCQUFRLDhCQUFSLEVBQXdDLDBCQUF4QyxFQUEyRDtBQUN6RUMsVUFBTSx1QkFEbUU7QUFFekVDLHFCQUFpQkgsU0FBU0csZUFGK0M7QUFHekVDLGVBQVdKLFNBQVNJLFNBSHFEO0FBSXpFQyxrQkFBY0wsU0FBU0ssWUFKa0Q7QUFLekVDLHVCQUFtQk4sU0FBU00saUJBTDZDO0FBTXpFQyx5QkFBcUJQLFNBQVNPLG1CQU4yQztBQU96RUMsd0JBQW9CUixTQUFTUSxrQkFQNEM7QUFRekVDLDBCQUFzQlQsU0FBU1Msb0JBUjBDO0FBU3pFQyx5QkFBcUJWLFNBQVNVLG1CQVQyQztBQVV6RUMsdUJBQW1CWCxTQUFTVyxpQkFWNkM7QUFXekVDLG1CQUFlWixTQUFTWSxhQVhpRDtBQVl6RUMsa0JBQWNiLFNBQVNhLFlB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S0FBbkIsQ0FBWjtBQUNBLFVBQU0wRCxVQUFVLEtBQUtELGVBQUwsQ0FBcUIzRCxHQUFyQixFQUEwQkUsS0FBMUIsQ0FBaEI7QUFDQSxhQUFPMEQsT0FBUDtBQUNEO0FBeFZ3RSxHQUEzRCxDQUFoQjs7b0JBMlZlNUYsTyIsImZpbGUiOiJEYXRlVGltZVNlY3Rpb24uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuLi9VdGlsaXR5JztcclxuaW1wb3J0IF9Hcm91cEJ5U2VjdGlvbiBmcm9tICcuL19Hcm91cEJ5U2VjdGlvbic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuLi9JMThuJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdkYXRlVGltZVNlY3Rpb24nKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuR3JvdXBzLkRhdGVUaW1lU2VjdGlvblxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLkdyb3Vwcy5EYXRlVGltZVNlY3Rpb24nLCBbX0dyb3VwQnlTZWN0aW9uXSwge1xyXG4gIG5hbWU6ICdEYXRlVGltZVNlY3Rpb25GaWx0ZXInLFxyXG4gIGRpc3BsYXlOYW1lVGV4dDogcmVzb3VyY2UuZGlzcGxheU5hbWVUZXh0LFxyXG4gIHRvZGF5VGV4dDogcmVzb3VyY2UudG9kYXlUZXh0LFxyXG4gIHRvbW9ycm93VGV4dDogcmVzb3VyY2UudG9tb3Jyb3dUZXh0LFxyXG4gIGxhdGVyVGhpc1dlZWtUZXh0OiByZXNvdXJjZS5sYXRlclRoaXNXZWVrVGV4dCxcclxuICBlYXJsaWVyVGhpc1dlZWtUZXh0OiByZXNvdXJjZS5lYXJsaWVyVGhpc1dlZWtUZXh0LFxyXG4gIHRoaXNMYXRlck1vbnRoVGV4dDogcmVzb3VyY2UudGhpc0xhdGVyTW9udGhUZXh0LFxyXG4gIHRoaXNFYXJsaWVyTW9udGhUZXh0OiByZXNvdXJjZS50aGlzRWFybGllck1vbnRoVGV4dCxcclxuICB0aGlzWWVhckVhcmxpZXJUZXh0OiByZXNvdXJjZS50aGlzWWVhckVhcmxpZXJUZXh0LFxyXG4gIHRoaXNZZWFyTGF0ZXJUZXh0OiByZXNvdXJjZS50aGlzWWVhckxhdGVyVGV4dCxcclxuICB5ZXN0ZXJkYXlUZXh0OiByZXNvdXJjZS55ZXN0ZXJkYXlUZXh0LFxyXG4gIGxhc3RXZWVrVGV4dDogcmVzb3VyY2UubGFzdFdlZWtUZXh0LFxyXG4gIGxhc3RNb250aFRleHQ6IHJlc291cmNlLmxhc3RNb250aFRleHQsXHJcbiAgcGFzdFllYXJUZXh0OiByZXNvdXJjZS5wYXN0WWVhclRleHQsXHJcbiAgbmV4dFllYXJUZXh0OiByZXNvdXJjZS5uZXh0WWVhclRleHQsXHJcbiAgbmV4dE1vbnRoVGV4dDogcmVzb3VyY2UubmV4dE1vbnRoVGV4dCxcclxuICBuZXh0V2Vla1RleHQ6IHJlc291cmNlLm5leHRXZWVrVGV4dCxcclxuICBmdXR1cmVUZXh0OiByZXNvdXJjZS5mdXR1cmVUZXh0LFxyXG4gIHR3b1dlZWtzQWdvVGV4dDogcmVzb3VyY2UudHdvV2Vla3NBZ29UZXh0LFxyXG4gIHRocmVlV2Vla3NBZ29UZXh0OiByZXNvdXJjZS50aHJlZVdlZWtzQWdvVGV4dCxcclxuICB0d29Nb250aHNBZ29UZXh0OiByZXNvdXJjZS50d29Nb250aHNBZ29UZXh0LFxyXG4gIHRocmVlTW9udGhzQWdvVGV4dDogcmVzb3VyY2UudGhyZWVNb250aHNBZ29UZXh0LFxyXG4gIHVua25vd25UZXh0OiByZXNvdXJjZS51bmtub3duVGV4dCxcclxuXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKG8pIHtcclxuICAgIGRlY2xhcmUuc2FmZU1peGluKHRoaXMsIG8pO1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfSxcclxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIHRoaXMuc2VjdGlvbnMgPSBbXTtcclxuXHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdUb2RheScsXHJcbiAgICAgIHRpdGxlOiB0aGlzLnRvZGF5VGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ1RvbW9ycm93JyxcclxuICAgICAgdGl0bGU6IHRoaXMudG9tb3Jyb3dUZXh0LFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zZWN0aW9ucy5wdXNoKHtcclxuICAgICAga2V5OiAnTGF0ZXJUaGlzV2VlaycsXHJcbiAgICAgIHRpdGxlOiB0aGlzLmxhdGVyVGhpc1dlZWtUZXh0LFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zZWN0aW9ucy5wdXNoKHtcclxuICAgICAga2V5OiAnRWFybGllclRoaXNXZWVrJyxcclxuICAgICAgdGl0bGU6IHRoaXMuZWFybGllclRoaXNXZWVrVGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ0VhcmxpZXJUaGlzTW9udGgnLFxyXG4gICAgICB0aXRsZTogdGhpcy50aGlzRWFybGllck1vbnRoVGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zZWN0aW9ucy5wdXNoKHtcclxuICAgICAga2V5OiAnTGF0ZXJUaGlzTW9udGgnLFxyXG4gICAgICB0aXRsZTogdGhpcy50aGlzTGF0ZXJNb250aFRleHQsXHJcbiAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ0VhcmxpZXJUaGlzWWVhcicsXHJcbiAgICAgIHRpdGxlOiB0aGlzLnRoaXNZZWFyRWFybGllclRleHQsXHJcbiAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ0xhdGVyVGhpc1llYXInLFxyXG4gICAgICB0aXRsZTogdGhpcy50aGlzWWVhckxhdGVyVGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zZWN0aW9ucy5wdXNoKHtcclxuICAgICAga2V5OiAnWWVzdGVyZGF5JyxcclxuICAgICAgdGl0bGU6IHRoaXMueWVzdGVyZGF5VGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ0xhc3RXZWVrJyxcclxuICAgICAgdGl0bGU6IHRoaXMubGFzdFdlZWtUZXh0LFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdMYXN0TW9udGgnLFxyXG4gICAgICB0aXRsZTogdGhpcy5sYXN0TW9udGhUZXh0LFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdQYXN0WWVhcicsXHJcbiAgICAgIHRpdGxlOiB0aGlzLnBhc3RZZWFyVGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zZWN0aW9ucy5wdXNoKHtcclxuICAgICAga2V5OiAnTmV4dFllYXInLFxyXG4gICAgICB0aXRsZTogdGhpcy5uZXh0WWVhclRleHQsXHJcbiAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ05leHRNb250aCcsXHJcbiAgICAgIHRpdGxlOiB0aGlzLm5leHRNb250aFRleHQsXHJcbiAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ05leHRXZWVrJyxcclxuICAgICAgdGl0bGU6IHRoaXMubmV4dFdlZWtUZXh0LFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdGdXR1cmUnLFxyXG4gICAgICB0aXRsZTogdGhpcy5mdXR1cmVUZXh0LFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBnZXRTZWN0aW9uOiBmdW5jdGlvbiBnZXRTZWN0aW9uKGVudHJ5KSB7XHJcbiAgICBpZiAoKHRoaXMuZ3JvdXBCeVByb3BlcnR5KSAmJiAoZW50cnkpKSB7XHJcbiAgICAgIGNvbnN0IHZhbHVlID0gVXRpbGl0eS5nZXRWYWx1ZShlbnRyeSwgdGhpcy5ncm91cEJ5UHJvcGVydHkpO1xyXG4gICAgICBpZiAodmFsdWUpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5nZXRTZWN0aW9uQnlEYXRlVGltZSh2YWx1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRTZWN0aW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSxcclxuICBnZXREZWZhdWx0U2VjdGlvbjogZnVuY3Rpb24gZ2V0RGVmYXVsdFNlY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBrZXk6ICdVbmtub3duJyxcclxuICAgICAgdGl0bGU6IHRoaXMudW5rbm93blRleHQsXHJcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgIH07XHJcbiAgfSxcclxuICBnZXRTZWN0aW9uS2V5OiBmdW5jdGlvbiBnZXRTZWN0aW9uS2V5KHZhbHVlKSB7XHJcbiAgICBsZXQgdmFsdWVEYXRlO1xyXG5cclxuICAgIGlmICghdGhpcy5jdXJyZW50RGF0ZSkge1xyXG4gICAgICB0aGlzLmN1cnJlbnREYXRlID0gbW9tZW50KCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgIHZhbHVlRGF0ZSA9IG1vbWVudCh2YWx1ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZXR1cm4gJ1Vua25vd24nO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm1vbWVudExhbmcpIHtcclxuICAgICAgdmFsdWVEYXRlLmxvY2FsZSh0aGlzLm1vbWVudExhbmcpO1xyXG4gICAgICB0aGlzLmN1cnJlbnREYXRlLmxvY2FsZSh0aGlzLm1vbWVudExhbmcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzTGFzdE1vbnRoKHZhbHVlRGF0ZSkpIHtcclxuICAgICAgcmV0dXJuICdMYXN0TW9udGgnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRWFybGllclRoaXNNb250aCh2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnRWFybGllclRoaXNNb250aCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNMYXN0V2Vlayh2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnTGFzdFdlZWsnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzRWFybGllclRoaXNXZWVrKHZhbHVlRGF0ZSkpIHtcclxuICAgICAgcmV0dXJuICdFYXJsaWVyVGhpc1dlZWsnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzWWVzdGVyZGF5KHZhbHVlRGF0ZSkpIHtcclxuICAgICAgcmV0dXJuICdZZXN0ZXJkYXknO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzUGFzdFllYXIodmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ1Bhc3RZZWFyJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc1RvZGF5KHZhbHVlRGF0ZSkpIHtcclxuICAgICAgcmV0dXJuICdUb2RheSc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNUb21vcnJvdyh2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnVG9tb3Jyb3cnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzTGF0ZXJUaGlzV2Vlayh2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnTGF0ZXJUaGlzV2Vlayc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNOZXh0V2Vlayh2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnTmV4dFdlZWsnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzTGF0ZXJUaGlzTW9udGgodmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ0xhdGVyVGhpc01vbnRoJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc05leHRNb250aCh2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnTmV4dE1vbnRoJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0VhcmxpZXJUaGlzWWVhcih2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnRWFybGllclRoaXNZZWFyJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0xhdGVyVGhpc1llYXIodmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ0xhdGVyVGhpc1llYXInO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzTmV4dFllYXIodmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ05leHRZZWFyJztcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJ0Z1dHVyZSc7XHJcbiAgfSxcclxuICBpc05leHRZZWFyOiBmdW5jdGlvbiBpc05leHRZZWFyKHZhbHVlKSB7XHJcbiAgICAvLyBOZXh0IHllYXIgZXhjbHVkaW5nIGFueXRoaW5nIHRoYXQgY291bGQgYmUgd2l0aGluIHRoZSBuZXh0IG1vbnRoIChuZXh0IHdlZWssIGxhdGVyIHRoaXMgd2VlaywgdG9tb3Jyb3cpXHJcbiAgICByZXR1cm4gdmFsdWUueWVhcigpID09PSAodGhpcy5jdXJyZW50RGF0ZS55ZWFyKCkgKyAxKSAmJlxyXG4gICAgICAhdGhpcy5pc05leHRNb250aCh2YWx1ZSk7XHJcbiAgfSxcclxuICBpc1Bhc3RZZWFyOiBmdW5jdGlvbiBpc1Bhc3RZZWFyKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gdmFsdWUueWVhcigpIDwgdGhpcy5jdXJyZW50RGF0ZS55ZWFyKCkgJiZcclxuICAgICAgIXRoaXMuaXNMYXN0TW9udGgodmFsdWUpO1xyXG4gIH0sXHJcbiAgaXNMYXRlclRoaXNZZWFyOiBmdW5jdGlvbiBpc0xhdGVyVGhpc1llYXIodmFsdWUpIHtcclxuICAgIC8vIEFueXRoaW5nIGZyb20gdGhlIGVuZCBvZiBuZXh0IG1vbnRoIHRvIHRoZSBlbmQgb2YgdGhlIHllYXJcclxuICAgIGNvbnN0IHllYXJFbmQgPSB0aGlzLmN1cnJlbnREYXRlLmNsb25lKCkuZW5kT2YoJ3llYXInKTtcclxuICAgIGNvbnN0IG5leHRNb250aEVuZCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5hZGQoMSwgJ21vbnRoJykuZW5kT2YoJ21vbnRoJyk7XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlLmlzQWZ0ZXIobmV4dE1vbnRoRW5kKSAmJlxyXG4gICAgICB2YWx1ZS5pc0JlZm9yZSh5ZWFyRW5kKTtcclxuICB9LFxyXG4gIGlzRWFybGllclRoaXNZZWFyOiBmdW5jdGlvbiBpc0VhcmxpZXJUaGlzWWVhcih2YWx1ZSkge1xyXG4gICAgLy8gQW55dGhpbmcgYXQgdGhlIHN0YXJ0IG9mIHRoZSB5ZWFyIHVwIHVudGlsIGxhc3QgbW9udGhcclxuICAgIGNvbnN0IHllYXJTdGFydCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5zdGFydE9mKCd5ZWFyJyk7XHJcbiAgICBjb25zdCBsYXN0TW9udGhTdGFydCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5zdGFydE9mKCdtb250aCcpO1xyXG4gICAgcmV0dXJuIHZhbHVlLmlzQWZ0ZXIoeWVhclN0YXJ0KSAmJlxyXG4gICAgICB2YWx1ZS5pc0JlZm9yZShsYXN0TW9udGhTdGFydCk7XHJcbiAgfSxcclxuICBpc05leHRNb250aDogZnVuY3Rpb24gaXNOZXh0TW9udGgodmFsdWUpIHtcclxuICAgIC8vIG5leHQgbW9udGgsIGV4Y2x1ZGluZyBhbnkgcG90ZW50aWFsIHVwY29taW5nIGRheXMgKG5leHQgd2VlaywgbGF0ZXIgdGhpcyB3ZWVrLCB0b21vcnJvdylcclxuICAgIGNvbnN0IG5leHRNb250aFN0YXJ0ID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLmFkZCgxLCAnbW9udGgnKS5zdGFydE9mKCdtb250aCcpO1xyXG4gICAgY29uc3QgbmV4dE1vbnRoRW5kID0gbmV4dE1vbnRoU3RhcnQuY2xvbmUoKS5lbmRPZignbW9udGgnKTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWUuaXNBZnRlcihuZXh0TW9udGhTdGFydCkgJiZcclxuICAgICAgdmFsdWUuaXNCZWZvcmUobmV4dE1vbnRoRW5kKSAmJlxyXG4gICAgICAhdGhpcy5pc05leHRXZWVrKHZhbHVlKSAmJlxyXG4gICAgICAhdGhpcy5pc0VhcmxpZXJUaGlzV2Vlayh2YWx1ZSkgJiZcclxuICAgICAgIXRoaXMuaXNUb21vcnJvdyh2YWx1ZSk7XHJcbiAgfSxcclxuICBpc0VhcmxpZXJUaGlzTW9udGg6IGZ1bmN0aW9uIGlzRWFybGllclRoaXNNb250aCh2YWx1ZSkge1xyXG4gICAgLy8gRXhjbHVkZXMgbGFzdCB3ZWVrXHJcbiAgICBjb25zdCBtb250aFN0YXJ0ID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLnN0YXJ0T2YoJ21vbnRoJyk7XHJcbiAgICBjb25zdCBsYXN0V2Vla1N0YXJ0ID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLnN1YnRyYWN0KDEsICd3ZWVrJykuc3RhcnRPZignd2VlaycpO1xyXG5cclxuICAgIHJldHVybiB2YWx1ZS5pc0FmdGVyKG1vbnRoU3RhcnQpICYmXHJcbiAgICAgIHZhbHVlLmlzQmVmb3JlKGxhc3RXZWVrU3RhcnQpO1xyXG4gIH0sXHJcbiAgaXNMYXRlclRoaXNNb250aDogZnVuY3Rpb24gaXNMYXRlclRoaXNNb250aCh2YWx1ZSkge1xyXG4gICAgLy8gRXhjbHVkZXMgbmV4dCB3ZWVrXHJcbiAgICBjb25zdCBtb250aEVuZCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5lbmRPZignbW9udGgnKTtcclxuICAgIGNvbnN0IG5leHRXZWVrRW5kID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLmFkZCgxLCAnd2VlaycpLmVuZE9mKCd3ZWVrJyk7XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlLmlzQWZ0ZXIobmV4dFdlZWtFbmQpICYmXHJcbiAgICAgIHZhbHVlLmlzQmVmb3JlKG1vbnRoRW5kKTtcclxuICB9LFxyXG4gIGlzTmV4dFdlZWs6IGZ1bmN0aW9uIGlzTmV4dFdlZWsodmFsdWUpIHtcclxuICAgIGNvbnN0IG5leHRXZWVrU3RhcnQgPSB0aGlzLmN1cnJlbnREYXRlLmNsb25lKCkuYWRkKDEsICd3ZWVrJykuc3RhcnRPZignd2VlaycpO1xyXG4gICAgY29uc3QgbmV4dFdlZWtFbmQgPSBuZXh0V2Vla1N0YXJ0LmNsb25lKCkuZW5kT2YoJ3dlZWsnKTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWUuaXNBZnRlcihuZXh0V2Vla1N0YXJ0KSAmJlxyXG4gICAgICB2YWx1ZS5pc0JlZm9yZShuZXh0V2Vla0VuZCkgJiZcclxuICAgICAgIXRoaXMuaXNUb21vcnJvdyh2YWx1ZSk7XHJcbiAgfSxcclxuICBpc1RvbW9ycm93OiBmdW5jdGlvbiBpc1RvbW9ycm93KHZhbHVlKSB7XHJcbiAgICBjb25zdCB0b21vcnJvdyA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5hZGQoMSwgJ2RheXMnKS5zdGFydE9mKCdkYXknKTtcclxuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUuY2xvbmUoKS5zdGFydE9mKCdkYXknKTtcclxuICAgIHJldHVybiB0b21vcnJvdy5pc1NhbWUobmV3VmFsdWUpO1xyXG4gIH0sXHJcbiAgaXNUb2RheTogZnVuY3Rpb24gaXNUb2RheSh2YWx1ZSkge1xyXG4gICAgY29uc3Qgbm93ID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpO1xyXG4gICAgY29uc3QgbmV3VmFsdWUgPSB2YWx1ZS5jbG9uZSgpLnN0YXJ0T2YoJ2RheScpO1xyXG4gICAgcmV0dXJuIG5vdy5pc1NhbWUobmV3VmFsdWUpO1xyXG4gIH0sXHJcbiAgaXNZZXN0ZXJkYXk6IGZ1bmN0aW9uIGlzWWVzdGVyZGF5KHZhbHVlKSB7XHJcbiAgICBjb25zdCB5ZXN0ZXJkYXkgPSB0aGlzLmN1cnJlbnREYXRlLmNsb25lKCkuc3VidHJhY3QoMSwgJ2RheXMnKS5zdGFydE9mKCdkYXknKTtcclxuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUuY2xvbmUoKS5zdGFydE9mKCdkYXknKTtcclxuICAgIHJldHVybiB5ZXN0ZXJkYXkuaXNTYW1lKG5ld1ZhbHVlKTtcclxuICB9LFxyXG4gIGlzTGF0ZXJUaGlzV2VlazogZnVuY3Rpb24gaXNMYXRlclRoaXNXZWVrKHZhbHVlKSB7XHJcbiAgICAvLyBFeGNsdWRlcyB0b2RheSwgdG9tb3Jyb3csIGFuZCB5ZXN0ZXJkYXlcclxuICAgIGNvbnN0IGxhdGVyID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLmFkZCgyLCAnZGF5cycpLnN0YXJ0T2YoJ2RheScpO1xyXG4gICAgY29uc3QgZW5kV2VlayA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5lbmRPZignd2VlaycpO1xyXG5cclxuICAgIHJldHVybiB2YWx1ZS5pc0FmdGVyKGxhdGVyKSAmJiB2YWx1ZS5pc0JlZm9yZShlbmRXZWVrKTtcclxuICB9LFxyXG4gIGlzRWFybGllclRoaXNXZWVrOiBmdW5jdGlvbiBpc0VhcmxpZXJUaGlzV2Vlayh2YWx1ZSkge1xyXG4gICAgLy8gU3RhcnQgb2Ygd2VlayB0byB5ZXN0ZXJkYXlcclxuICAgIGNvbnN0IHllc3RlcmRheSA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5zdWJ0cmFjdCgxLCAnZGF5cycpLnN0YXJ0T2YoJ2RheScpO1xyXG4gICAgY29uc3Qgd2Vla1N0YXJ0ID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLnN0YXJ0T2YoJ3dlZWsnKTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWUuaXNBZnRlcih3ZWVrU3RhcnQpICYmXHJcbiAgICAgIHZhbHVlLmlzQmVmb3JlKHllc3RlcmRheSk7XHJcbiAgfSxcclxuICBpc0xhc3RXZWVrOiBmdW5jdGlvbiBpc0xhc3RXZWVrKHZhbHVlKSB7XHJcbiAgICBjb25zdCBsYXN0V2Vla1N0YXJ0ID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLnN1YnRyYWN0KDEsICd3ZWVrJykuc3RhcnRPZignd2VlaycpO1xyXG4gICAgY29uc3QgbGFzdFdlZWtFbmQgPSBsYXN0V2Vla1N0YXJ0LmNsb25lKCkuZW5kT2YoJ3dlZWsnKTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWUuaXNBZnRlcihsYXN0V2Vla1N0YXJ0KSAmJlxyXG4gICAgICB2YWx1ZS5pc0JlZm9yZShsYXN0V2Vla0VuZCkgJiZcclxuICAgICAgIXRoaXMuaXNZZXN0ZXJkYXkodmFsdWUpO1xyXG4gIH0sXHJcbiAgaXNMYXN0TW9udGg6IGZ1bmN0aW9uIGlzTGFzdE1vbnRoKHZhbHVlKSB7XHJcbiAgICAvLyBMYXN0IG1vbnRoLCBleGNsdWRpbmcgYW55IHBvdGVudGlhbCBwYXN0IGRheXMgKGVhcmxpZXIgdGhpcyB3ZWVrLCBsYXN0IHdlZWssIHllc3RlcmRheSlcclxuICAgIGNvbnN0IGxhc3RNb250aFN0YXJ0ID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLnN1YnRyYWN0KDEsICdtb250aCcpLnN0YXJ0T2YoJ21vbnRoJyk7XHJcbiAgICBjb25zdCBsYXN0TW9udGhFbmQgPSBsYXN0TW9udGhTdGFydC5jbG9uZSgpLmVuZE9mKCdtb250aCcpO1xyXG5cclxuICAgIHJldHVybiB2YWx1ZS5pc0FmdGVyKGxhc3RNb250aFN0YXJ0KSAmJlxyXG4gICAgICB2YWx1ZS5pc0JlZm9yZShsYXN0TW9udGhFbmQpICYmXHJcbiAgICAgICF0aGlzLmlzRWFybGllclRoaXNXZWVrKHZhbHVlKSAmJlxyXG4gICAgICAhdGhpcy5pc0xhc3RXZWVrKHZhbHVlKSAmJlxyXG4gICAgICAhdGhpcy5pc1llc3RlcmRheSh2YWx1ZSk7XHJcbiAgfSxcclxuICBnZXRTZWN0aW9uQnlLZXk6IGZ1bmN0aW9uIGdldFNlY3Rpb25CeUtleShrZXkpIHtcclxuICAgIGZvciAoY29uc3Qgc2VjdGlvbiBpbiB0aGlzLnNlY3Rpb25zKSB7XHJcbiAgICAgIGlmICh0aGlzLnNlY3Rpb25zW3NlY3Rpb25dLmtleSA9PT0ga2V5KSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2VjdGlvbnNbc2VjdGlvbl07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmdldERlZmF1bHRTZWN0aW9uKCk7XHJcbiAgfSxcclxuICBnZXRTZWN0aW9uQnlEYXRlVGltZTogZnVuY3Rpb24gZ2V0U2VjdGlvbkJ5RGF0ZVRpbWUodmFsdWUpIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0U2VjdGlvbktleSh2YWx1ZSk7XHJcbiAgICBjb25zdCBzZWN0aW9uID0gdGhpcy5nZXRTZWN0aW9uQnlLZXkoa2V5LCB2YWx1ZSk7XHJcbiAgICByZXR1cm4gc2VjdGlvbjtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==