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
      this.inherited(init, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Hcm91cHMvRGF0ZVRpbWVTZWN0aW9uLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsIm5hbWUiLCJkaXNwbGF5TmFtZVRleHQiLCJ0b2RheVRleHQiLCJ0b21vcnJvd1RleHQiLCJsYXRlclRoaXNXZWVrVGV4dCIsImVhcmxpZXJUaGlzV2Vla1RleHQiLCJ0aGlzTGF0ZXJNb250aFRleHQiLCJ0aGlzRWFybGllck1vbnRoVGV4dCIsInRoaXNZZWFyRWFybGllclRleHQiLCJ0aGlzWWVhckxhdGVyVGV4dCIsInllc3RlcmRheVRleHQiLCJsYXN0V2Vla1RleHQiLCJsYXN0TW9udGhUZXh0IiwicGFzdFllYXJUZXh0IiwibmV4dFllYXJUZXh0IiwibmV4dE1vbnRoVGV4dCIsIm5leHRXZWVrVGV4dCIsImZ1dHVyZVRleHQiLCJ0d29XZWVrc0Fnb1RleHQiLCJ0aHJlZVdlZWtzQWdvVGV4dCIsInR3b01vbnRoc0Fnb1RleHQiLCJ0aHJlZU1vbnRoc0Fnb1RleHQiLCJ1bmtub3duVGV4dCIsImNvbnN0cnVjdG9yIiwibyIsInNhZmVNaXhpbiIsImluaXQiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJzZWN0aW9ucyIsInB1c2giLCJrZXkiLCJ0aXRsZSIsInZhbHVlIiwiY29sbGFwc2VkIiwiZ2V0U2VjdGlvbiIsImVudHJ5IiwiZ3JvdXBCeVByb3BlcnR5IiwiZ2V0VmFsdWUiLCJnZXRTZWN0aW9uQnlEYXRlVGltZSIsImdldERlZmF1bHRTZWN0aW9uIiwiZ2V0U2VjdGlvbktleSIsInZhbHVlRGF0ZSIsImN1cnJlbnREYXRlIiwibW9tZW50IiwibW9tZW50TGFuZyIsImxvY2FsZSIsImlzTGFzdE1vbnRoIiwiaXNFYXJsaWVyVGhpc01vbnRoIiwiaXNMYXN0V2VlayIsImlzRWFybGllclRoaXNXZWVrIiwiaXNZZXN0ZXJkYXkiLCJpc1Bhc3RZZWFyIiwiaXNUb2RheSIsImlzVG9tb3Jyb3ciLCJpc0xhdGVyVGhpc1dlZWsiLCJpc05leHRXZWVrIiwiaXNMYXRlclRoaXNNb250aCIsImlzTmV4dE1vbnRoIiwiaXNFYXJsaWVyVGhpc1llYXIiLCJpc0xhdGVyVGhpc1llYXIiLCJpc05leHRZZWFyIiwieWVhciIsInllYXJFbmQiLCJjbG9uZSIsImVuZE9mIiwibmV4dE1vbnRoRW5kIiwiYWRkIiwiaXNBZnRlciIsImlzQmVmb3JlIiwieWVhclN0YXJ0Iiwic3RhcnRPZiIsImxhc3RNb250aFN0YXJ0Iiwic3VidHJhY3QiLCJuZXh0TW9udGhTdGFydCIsIm1vbnRoU3RhcnQiLCJsYXN0V2Vla1N0YXJ0IiwibW9udGhFbmQiLCJuZXh0V2Vla0VuZCIsIm5leHRXZWVrU3RhcnQiLCJ0b21vcnJvdyIsIm5ld1ZhbHVlIiwiaXNTYW1lIiwibm93IiwieWVzdGVyZGF5IiwibGF0ZXIiLCJlbmRXZWVrIiwid2Vla1N0YXJ0IiwibGFzdFdlZWtFbmQiLCJsYXN0TW9udGhFbmQiLCJnZXRTZWN0aW9uQnlLZXkiLCJzZWN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQXFCQSxNQUFNQSxXQUFXLG9CQUFZLGlCQUFaLENBQWpCOztBQUVBOzs7QUFHQSxNQUFNQyxVQUFVLHVCQUFRLDhCQUFSLEVBQXdDLDBCQUF4QyxFQUEyRDtBQUN6RUMsVUFBTSx1QkFEbUU7QUFFekVDLHFCQUFpQkgsU0FBU0csZUFGK0M7QUFHekVDLGVBQVdKLFNBQVNJLFNBSHFEO0FBSXpFQyxrQkFBY0wsU0FBU0ssWUFKa0Q7QUFLekVDLHVCQUFtQk4sU0FBU00saUJBTDZDO0FBTXpFQyx5QkFBcUJQLFNBQVNPLG1CQU4yQztBQU96RUMsd0JBQW9CUixTQUFTUSxrQkFQNEM7QUFRekVDLDBCQUFzQlQsU0FBU1Msb0JBUjBDO0FBU3pFQyx5QkFBcUJWLFNBQVNVLG1CQVQyQztBQVV6RUMsdUJBQW1CWCxTQUFTVyxpQkFWNkM7QUFXekVDLG1CQUFlWixTQUFTWSxhQVhpRDtBQVl6RUMsa0JBQWNiLFNBQVNhLFlB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LGFBQUwsQ0FBbUJSLEtBQW5CLENBQVo7QUFDQSxVQUFNMEQsVUFBVSxLQUFLRCxlQUFMLENBQXFCM0QsR0FBckIsRUFBMEJFLEtBQTFCLENBQWhCO0FBQ0EsYUFBTzBELE9BQVA7QUFDRDtBQXhWd0UsR0FBM0QsQ0FBaEI7O29CQTJWZTVGLE8iLCJmaWxlIjoiRGF0ZVRpbWVTZWN0aW9uLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi4vVXRpbGl0eSc7XHJcbmltcG9ydCBfR3JvdXBCeVNlY3Rpb24gZnJvbSAnLi9fR3JvdXBCeVNlY3Rpb24nO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcblxyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnZGF0ZVRpbWVTZWN0aW9uJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkdyb3Vwcy5EYXRlVGltZVNlY3Rpb25cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5Hcm91cHMuRGF0ZVRpbWVTZWN0aW9uJywgW19Hcm91cEJ5U2VjdGlvbl0sIHtcclxuICBuYW1lOiAnRGF0ZVRpbWVTZWN0aW9uRmlsdGVyJyxcclxuICBkaXNwbGF5TmFtZVRleHQ6IHJlc291cmNlLmRpc3BsYXlOYW1lVGV4dCxcclxuICB0b2RheVRleHQ6IHJlc291cmNlLnRvZGF5VGV4dCxcclxuICB0b21vcnJvd1RleHQ6IHJlc291cmNlLnRvbW9ycm93VGV4dCxcclxuICBsYXRlclRoaXNXZWVrVGV4dDogcmVzb3VyY2UubGF0ZXJUaGlzV2Vla1RleHQsXHJcbiAgZWFybGllclRoaXNXZWVrVGV4dDogcmVzb3VyY2UuZWFybGllclRoaXNXZWVrVGV4dCxcclxuICB0aGlzTGF0ZXJNb250aFRleHQ6IHJlc291cmNlLnRoaXNMYXRlck1vbnRoVGV4dCxcclxuICB0aGlzRWFybGllck1vbnRoVGV4dDogcmVzb3VyY2UudGhpc0VhcmxpZXJNb250aFRleHQsXHJcbiAgdGhpc1llYXJFYXJsaWVyVGV4dDogcmVzb3VyY2UudGhpc1llYXJFYXJsaWVyVGV4dCxcclxuICB0aGlzWWVhckxhdGVyVGV4dDogcmVzb3VyY2UudGhpc1llYXJMYXRlclRleHQsXHJcbiAgeWVzdGVyZGF5VGV4dDogcmVzb3VyY2UueWVzdGVyZGF5VGV4dCxcclxuICBsYXN0V2Vla1RleHQ6IHJlc291cmNlLmxhc3RXZWVrVGV4dCxcclxuICBsYXN0TW9udGhUZXh0OiByZXNvdXJjZS5sYXN0TW9udGhUZXh0LFxyXG4gIHBhc3RZZWFyVGV4dDogcmVzb3VyY2UucGFzdFllYXJUZXh0LFxyXG4gIG5leHRZZWFyVGV4dDogcmVzb3VyY2UubmV4dFllYXJUZXh0LFxyXG4gIG5leHRNb250aFRleHQ6IHJlc291cmNlLm5leHRNb250aFRleHQsXHJcbiAgbmV4dFdlZWtUZXh0OiByZXNvdXJjZS5uZXh0V2Vla1RleHQsXHJcbiAgZnV0dXJlVGV4dDogcmVzb3VyY2UuZnV0dXJlVGV4dCxcclxuICB0d29XZWVrc0Fnb1RleHQ6IHJlc291cmNlLnR3b1dlZWtzQWdvVGV4dCxcclxuICB0aHJlZVdlZWtzQWdvVGV4dDogcmVzb3VyY2UudGhyZWVXZWVrc0Fnb1RleHQsXHJcbiAgdHdvTW9udGhzQWdvVGV4dDogcmVzb3VyY2UudHdvTW9udGhzQWdvVGV4dCxcclxuICB0aHJlZU1vbnRoc0Fnb1RleHQ6IHJlc291cmNlLnRocmVlTW9udGhzQWdvVGV4dCxcclxuICB1bmtub3duVGV4dDogcmVzb3VyY2UudW5rbm93blRleHQsXHJcblxyXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBjb25zdHJ1Y3RvcihvKSB7XHJcbiAgICBkZWNsYXJlLnNhZmVNaXhpbih0aGlzLCBvKTtcclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH0sXHJcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGluaXQsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnNlY3Rpb25zID0gW107XHJcblxyXG4gICAgdGhpcy5zZWN0aW9ucy5wdXNoKHtcclxuICAgICAga2V5OiAnVG9kYXknLFxyXG4gICAgICB0aXRsZTogdGhpcy50b2RheVRleHQsXHJcbiAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdUb21vcnJvdycsXHJcbiAgICAgIHRpdGxlOiB0aGlzLnRvbW9ycm93VGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ0xhdGVyVGhpc1dlZWsnLFxyXG4gICAgICB0aXRsZTogdGhpcy5sYXRlclRoaXNXZWVrVGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ0VhcmxpZXJUaGlzV2VlaycsXHJcbiAgICAgIHRpdGxlOiB0aGlzLmVhcmxpZXJUaGlzV2Vla1RleHQsXHJcbiAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdFYXJsaWVyVGhpc01vbnRoJyxcclxuICAgICAgdGl0bGU6IHRoaXMudGhpc0VhcmxpZXJNb250aFRleHQsXHJcbiAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ0xhdGVyVGhpc01vbnRoJyxcclxuICAgICAgdGl0bGU6IHRoaXMudGhpc0xhdGVyTW9udGhUZXh0LFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdFYXJsaWVyVGhpc1llYXInLFxyXG4gICAgICB0aXRsZTogdGhpcy50aGlzWWVhckVhcmxpZXJUZXh0LFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdMYXRlclRoaXNZZWFyJyxcclxuICAgICAgdGl0bGU6IHRoaXMudGhpc1llYXJMYXRlclRleHQsXHJcbiAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ1llc3RlcmRheScsXHJcbiAgICAgIHRpdGxlOiB0aGlzLnllc3RlcmRheVRleHQsXHJcbiAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdMYXN0V2VlaycsXHJcbiAgICAgIHRpdGxlOiB0aGlzLmxhc3RXZWVrVGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zZWN0aW9ucy5wdXNoKHtcclxuICAgICAga2V5OiAnTGFzdE1vbnRoJyxcclxuICAgICAgdGl0bGU6IHRoaXMubGFzdE1vbnRoVGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zZWN0aW9ucy5wdXNoKHtcclxuICAgICAga2V5OiAnUGFzdFllYXInLFxyXG4gICAgICB0aXRsZTogdGhpcy5wYXN0WWVhclRleHQsXHJcbiAgICAgIHZhbHVlOiBudWxsLFxyXG4gICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICB9KTtcclxuICAgIHRoaXMuc2VjdGlvbnMucHVzaCh7XHJcbiAgICAgIGtleTogJ05leHRZZWFyJyxcclxuICAgICAgdGl0bGU6IHRoaXMubmV4dFllYXJUZXh0LFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdOZXh0TW9udGgnLFxyXG4gICAgICB0aXRsZTogdGhpcy5uZXh0TW9udGhUZXh0LFxyXG4gICAgICB2YWx1ZTogbnVsbCxcclxuICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgfSk7XHJcbiAgICB0aGlzLnNlY3Rpb25zLnB1c2goe1xyXG4gICAgICBrZXk6ICdOZXh0V2VlaycsXHJcbiAgICAgIHRpdGxlOiB0aGlzLm5leHRXZWVrVGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG4gICAgdGhpcy5zZWN0aW9ucy5wdXNoKHtcclxuICAgICAga2V5OiAnRnV0dXJlJyxcclxuICAgICAgdGl0bGU6IHRoaXMuZnV0dXJlVGV4dCxcclxuICAgICAgdmFsdWU6IG51bGwsXHJcbiAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgZ2V0U2VjdGlvbjogZnVuY3Rpb24gZ2V0U2VjdGlvbihlbnRyeSkge1xyXG4gICAgaWYgKCh0aGlzLmdyb3VwQnlQcm9wZXJ0eSkgJiYgKGVudHJ5KSkge1xyXG4gICAgICBjb25zdCB2YWx1ZSA9IFV0aWxpdHkuZ2V0VmFsdWUoZW50cnksIHRoaXMuZ3JvdXBCeVByb3BlcnR5KTtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U2VjdGlvbkJ5RGF0ZVRpbWUodmFsdWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0U2VjdGlvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBudWxsO1xyXG4gIH0sXHJcbiAgZ2V0RGVmYXVsdFNlY3Rpb246IGZ1bmN0aW9uIGdldERlZmF1bHRTZWN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAga2V5OiAnVW5rbm93bicsXHJcbiAgICAgIHRpdGxlOiB0aGlzLnVua25vd25UZXh0LFxyXG4gICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICB9O1xyXG4gIH0sXHJcbiAgZ2V0U2VjdGlvbktleTogZnVuY3Rpb24gZ2V0U2VjdGlvbktleSh2YWx1ZSkge1xyXG4gICAgbGV0IHZhbHVlRGF0ZTtcclxuXHJcbiAgICBpZiAoIXRoaXMuY3VycmVudERhdGUpIHtcclxuICAgICAgdGhpcy5jdXJyZW50RGF0ZSA9IG1vbWVudCgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICB2YWx1ZURhdGUgPSBtb21lbnQodmFsdWUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmV0dXJuICdVbmtub3duJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5tb21lbnRMYW5nKSB7XHJcbiAgICAgIHZhbHVlRGF0ZS5sb2NhbGUodGhpcy5tb21lbnRMYW5nKTtcclxuICAgICAgdGhpcy5jdXJyZW50RGF0ZS5sb2NhbGUodGhpcy5tb21lbnRMYW5nKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0xhc3RNb250aCh2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnTGFzdE1vbnRoJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0VhcmxpZXJUaGlzTW9udGgodmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ0VhcmxpZXJUaGlzTW9udGgnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzTGFzdFdlZWsodmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ0xhc3RXZWVrJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0VhcmxpZXJUaGlzV2Vlayh2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnRWFybGllclRoaXNXZWVrJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc1llc3RlcmRheSh2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnWWVzdGVyZGF5JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc1Bhc3RZZWFyKHZhbHVlRGF0ZSkpIHtcclxuICAgICAgcmV0dXJuICdQYXN0WWVhcic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNUb2RheSh2YWx1ZURhdGUpKSB7XHJcbiAgICAgIHJldHVybiAnVG9kYXknO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzVG9tb3Jyb3codmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ1RvbW9ycm93JztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0xhdGVyVGhpc1dlZWsodmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ0xhdGVyVGhpc1dlZWsnO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmlzTmV4dFdlZWsodmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ05leHRXZWVrJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc0xhdGVyVGhpc01vbnRoKHZhbHVlRGF0ZSkpIHtcclxuICAgICAgcmV0dXJuICdMYXRlclRoaXNNb250aCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNOZXh0TW9udGgodmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ05leHRNb250aCc7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNFYXJsaWVyVGhpc1llYXIodmFsdWVEYXRlKSkge1xyXG4gICAgICByZXR1cm4gJ0VhcmxpZXJUaGlzWWVhcic7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaXNMYXRlclRoaXNZZWFyKHZhbHVlRGF0ZSkpIHtcclxuICAgICAgcmV0dXJuICdMYXRlclRoaXNZZWFyJztcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pc05leHRZZWFyKHZhbHVlRGF0ZSkpIHtcclxuICAgICAgcmV0dXJuICdOZXh0WWVhcic7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICdGdXR1cmUnO1xyXG4gIH0sXHJcbiAgaXNOZXh0WWVhcjogZnVuY3Rpb24gaXNOZXh0WWVhcih2YWx1ZSkge1xyXG4gICAgLy8gTmV4dCB5ZWFyIGV4Y2x1ZGluZyBhbnl0aGluZyB0aGF0IGNvdWxkIGJlIHdpdGhpbiB0aGUgbmV4dCBtb250aCAobmV4dCB3ZWVrLCBsYXRlciB0aGlzIHdlZWssIHRvbW9ycm93KVxyXG4gICAgcmV0dXJuIHZhbHVlLnllYXIoKSA9PT0gKHRoaXMuY3VycmVudERhdGUueWVhcigpICsgMSkgJiZcclxuICAgICAgIXRoaXMuaXNOZXh0TW9udGgodmFsdWUpO1xyXG4gIH0sXHJcbiAgaXNQYXN0WWVhcjogZnVuY3Rpb24gaXNQYXN0WWVhcih2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHZhbHVlLnllYXIoKSA8IHRoaXMuY3VycmVudERhdGUueWVhcigpICYmXHJcbiAgICAgICF0aGlzLmlzTGFzdE1vbnRoKHZhbHVlKTtcclxuICB9LFxyXG4gIGlzTGF0ZXJUaGlzWWVhcjogZnVuY3Rpb24gaXNMYXRlclRoaXNZZWFyKHZhbHVlKSB7XHJcbiAgICAvLyBBbnl0aGluZyBmcm9tIHRoZSBlbmQgb2YgbmV4dCBtb250aCB0byB0aGUgZW5kIG9mIHRoZSB5ZWFyXHJcbiAgICBjb25zdCB5ZWFyRW5kID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLmVuZE9mKCd5ZWFyJyk7XHJcbiAgICBjb25zdCBuZXh0TW9udGhFbmQgPSB0aGlzLmN1cnJlbnREYXRlLmNsb25lKCkuYWRkKDEsICdtb250aCcpLmVuZE9mKCdtb250aCcpO1xyXG5cclxuICAgIHJldHVybiB2YWx1ZS5pc0FmdGVyKG5leHRNb250aEVuZCkgJiZcclxuICAgICAgdmFsdWUuaXNCZWZvcmUoeWVhckVuZCk7XHJcbiAgfSxcclxuICBpc0VhcmxpZXJUaGlzWWVhcjogZnVuY3Rpb24gaXNFYXJsaWVyVGhpc1llYXIodmFsdWUpIHtcclxuICAgIC8vIEFueXRoaW5nIGF0IHRoZSBzdGFydCBvZiB0aGUgeWVhciB1cCB1bnRpbCBsYXN0IG1vbnRoXHJcbiAgICBjb25zdCB5ZWFyU3RhcnQgPSB0aGlzLmN1cnJlbnREYXRlLmNsb25lKCkuc3RhcnRPZigneWVhcicpO1xyXG4gICAgY29uc3QgbGFzdE1vbnRoU3RhcnQgPSB0aGlzLmN1cnJlbnREYXRlLmNsb25lKCkuc3VidHJhY3QoMSwgJ21vbnRoJykuc3RhcnRPZignbW9udGgnKTtcclxuICAgIHJldHVybiB2YWx1ZS5pc0FmdGVyKHllYXJTdGFydCkgJiZcclxuICAgICAgdmFsdWUuaXNCZWZvcmUobGFzdE1vbnRoU3RhcnQpO1xyXG4gIH0sXHJcbiAgaXNOZXh0TW9udGg6IGZ1bmN0aW9uIGlzTmV4dE1vbnRoKHZhbHVlKSB7XHJcbiAgICAvLyBuZXh0IG1vbnRoLCBleGNsdWRpbmcgYW55IHBvdGVudGlhbCB1cGNvbWluZyBkYXlzIChuZXh0IHdlZWssIGxhdGVyIHRoaXMgd2VlaywgdG9tb3Jyb3cpXHJcbiAgICBjb25zdCBuZXh0TW9udGhTdGFydCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5hZGQoMSwgJ21vbnRoJykuc3RhcnRPZignbW9udGgnKTtcclxuICAgIGNvbnN0IG5leHRNb250aEVuZCA9IG5leHRNb250aFN0YXJ0LmNsb25lKCkuZW5kT2YoJ21vbnRoJyk7XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlLmlzQWZ0ZXIobmV4dE1vbnRoU3RhcnQpICYmXHJcbiAgICAgIHZhbHVlLmlzQmVmb3JlKG5leHRNb250aEVuZCkgJiZcclxuICAgICAgIXRoaXMuaXNOZXh0V2Vlayh2YWx1ZSkgJiZcclxuICAgICAgIXRoaXMuaXNFYXJsaWVyVGhpc1dlZWsodmFsdWUpICYmXHJcbiAgICAgICF0aGlzLmlzVG9tb3Jyb3codmFsdWUpO1xyXG4gIH0sXHJcbiAgaXNFYXJsaWVyVGhpc01vbnRoOiBmdW5jdGlvbiBpc0VhcmxpZXJUaGlzTW9udGgodmFsdWUpIHtcclxuICAgIC8vIEV4Y2x1ZGVzIGxhc3Qgd2Vla1xyXG4gICAgY29uc3QgbW9udGhTdGFydCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5zdGFydE9mKCdtb250aCcpO1xyXG4gICAgY29uc3QgbGFzdFdlZWtTdGFydCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5zdWJ0cmFjdCgxLCAnd2VlaycpLnN0YXJ0T2YoJ3dlZWsnKTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWUuaXNBZnRlcihtb250aFN0YXJ0KSAmJlxyXG4gICAgICB2YWx1ZS5pc0JlZm9yZShsYXN0V2Vla1N0YXJ0KTtcclxuICB9LFxyXG4gIGlzTGF0ZXJUaGlzTW9udGg6IGZ1bmN0aW9uIGlzTGF0ZXJUaGlzTW9udGgodmFsdWUpIHtcclxuICAgIC8vIEV4Y2x1ZGVzIG5leHQgd2Vla1xyXG4gICAgY29uc3QgbW9udGhFbmQgPSB0aGlzLmN1cnJlbnREYXRlLmNsb25lKCkuZW5kT2YoJ21vbnRoJyk7XHJcbiAgICBjb25zdCBuZXh0V2Vla0VuZCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5hZGQoMSwgJ3dlZWsnKS5lbmRPZignd2VlaycpO1xyXG5cclxuICAgIHJldHVybiB2YWx1ZS5pc0FmdGVyKG5leHRXZWVrRW5kKSAmJlxyXG4gICAgICB2YWx1ZS5pc0JlZm9yZShtb250aEVuZCk7XHJcbiAgfSxcclxuICBpc05leHRXZWVrOiBmdW5jdGlvbiBpc05leHRXZWVrKHZhbHVlKSB7XHJcbiAgICBjb25zdCBuZXh0V2Vla1N0YXJ0ID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLmFkZCgxLCAnd2VlaycpLnN0YXJ0T2YoJ3dlZWsnKTtcclxuICAgIGNvbnN0IG5leHRXZWVrRW5kID0gbmV4dFdlZWtTdGFydC5jbG9uZSgpLmVuZE9mKCd3ZWVrJyk7XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlLmlzQWZ0ZXIobmV4dFdlZWtTdGFydCkgJiZcclxuICAgICAgdmFsdWUuaXNCZWZvcmUobmV4dFdlZWtFbmQpICYmXHJcbiAgICAgICF0aGlzLmlzVG9tb3Jyb3codmFsdWUpO1xyXG4gIH0sXHJcbiAgaXNUb21vcnJvdzogZnVuY3Rpb24gaXNUb21vcnJvdyh2YWx1ZSkge1xyXG4gICAgY29uc3QgdG9tb3Jyb3cgPSB0aGlzLmN1cnJlbnREYXRlLmNsb25lKCkuYWRkKDEsICdkYXlzJykuc3RhcnRPZignZGF5Jyk7XHJcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlLmNsb25lKCkuc3RhcnRPZignZGF5Jyk7XHJcbiAgICByZXR1cm4gdG9tb3Jyb3cuaXNTYW1lKG5ld1ZhbHVlKTtcclxuICB9LFxyXG4gIGlzVG9kYXk6IGZ1bmN0aW9uIGlzVG9kYXkodmFsdWUpIHtcclxuICAgIGNvbnN0IG5vdyA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5zdGFydE9mKCdkYXknKTtcclxuICAgIGNvbnN0IG5ld1ZhbHVlID0gdmFsdWUuY2xvbmUoKS5zdGFydE9mKCdkYXknKTtcclxuICAgIHJldHVybiBub3cuaXNTYW1lKG5ld1ZhbHVlKTtcclxuICB9LFxyXG4gIGlzWWVzdGVyZGF5OiBmdW5jdGlvbiBpc1llc3RlcmRheSh2YWx1ZSkge1xyXG4gICAgY29uc3QgeWVzdGVyZGF5ID0gdGhpcy5jdXJyZW50RGF0ZS5jbG9uZSgpLnN1YnRyYWN0KDEsICdkYXlzJykuc3RhcnRPZignZGF5Jyk7XHJcbiAgICBjb25zdCBuZXdWYWx1ZSA9IHZhbHVlLmNsb25lKCkuc3RhcnRPZignZGF5Jyk7XHJcbiAgICByZXR1cm4geWVzdGVyZGF5LmlzU2FtZShuZXdWYWx1ZSk7XHJcbiAgfSxcclxuICBpc0xhdGVyVGhpc1dlZWs6IGZ1bmN0aW9uIGlzTGF0ZXJUaGlzV2Vlayh2YWx1ZSkge1xyXG4gICAgLy8gRXhjbHVkZXMgdG9kYXksIHRvbW9ycm93LCBhbmQgeWVzdGVyZGF5XHJcbiAgICBjb25zdCBsYXRlciA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5hZGQoMiwgJ2RheXMnKS5zdGFydE9mKCdkYXknKTtcclxuICAgIGNvbnN0IGVuZFdlZWsgPSB0aGlzLmN1cnJlbnREYXRlLmNsb25lKCkuZW5kT2YoJ3dlZWsnKTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWUuaXNBZnRlcihsYXRlcikgJiYgdmFsdWUuaXNCZWZvcmUoZW5kV2Vlayk7XHJcbiAgfSxcclxuICBpc0VhcmxpZXJUaGlzV2VlazogZnVuY3Rpb24gaXNFYXJsaWVyVGhpc1dlZWsodmFsdWUpIHtcclxuICAgIC8vIFN0YXJ0IG9mIHdlZWsgdG8geWVzdGVyZGF5XHJcbiAgICBjb25zdCB5ZXN0ZXJkYXkgPSB0aGlzLmN1cnJlbnREYXRlLmNsb25lKCkuc3VidHJhY3QoMSwgJ2RheXMnKS5zdGFydE9mKCdkYXknKTtcclxuICAgIGNvbnN0IHdlZWtTdGFydCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5zdGFydE9mKCd3ZWVrJyk7XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlLmlzQWZ0ZXIod2Vla1N0YXJ0KSAmJlxyXG4gICAgICB2YWx1ZS5pc0JlZm9yZSh5ZXN0ZXJkYXkpO1xyXG4gIH0sXHJcbiAgaXNMYXN0V2VlazogZnVuY3Rpb24gaXNMYXN0V2Vlayh2YWx1ZSkge1xyXG4gICAgY29uc3QgbGFzdFdlZWtTdGFydCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5zdWJ0cmFjdCgxLCAnd2VlaycpLnN0YXJ0T2YoJ3dlZWsnKTtcclxuICAgIGNvbnN0IGxhc3RXZWVrRW5kID0gbGFzdFdlZWtTdGFydC5jbG9uZSgpLmVuZE9mKCd3ZWVrJyk7XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlLmlzQWZ0ZXIobGFzdFdlZWtTdGFydCkgJiZcclxuICAgICAgdmFsdWUuaXNCZWZvcmUobGFzdFdlZWtFbmQpICYmXHJcbiAgICAgICF0aGlzLmlzWWVzdGVyZGF5KHZhbHVlKTtcclxuICB9LFxyXG4gIGlzTGFzdE1vbnRoOiBmdW5jdGlvbiBpc0xhc3RNb250aCh2YWx1ZSkge1xyXG4gICAgLy8gTGFzdCBtb250aCwgZXhjbHVkaW5nIGFueSBwb3RlbnRpYWwgcGFzdCBkYXlzIChlYXJsaWVyIHRoaXMgd2VlaywgbGFzdCB3ZWVrLCB5ZXN0ZXJkYXkpXHJcbiAgICBjb25zdCBsYXN0TW9udGhTdGFydCA9IHRoaXMuY3VycmVudERhdGUuY2xvbmUoKS5zdWJ0cmFjdCgxLCAnbW9udGgnKS5zdGFydE9mKCdtb250aCcpO1xyXG4gICAgY29uc3QgbGFzdE1vbnRoRW5kID0gbGFzdE1vbnRoU3RhcnQuY2xvbmUoKS5lbmRPZignbW9udGgnKTtcclxuXHJcbiAgICByZXR1cm4gdmFsdWUuaXNBZnRlcihsYXN0TW9udGhTdGFydCkgJiZcclxuICAgICAgdmFsdWUuaXNCZWZvcmUobGFzdE1vbnRoRW5kKSAmJlxyXG4gICAgICAhdGhpcy5pc0VhcmxpZXJUaGlzV2Vlayh2YWx1ZSkgJiZcclxuICAgICAgIXRoaXMuaXNMYXN0V2Vlayh2YWx1ZSkgJiZcclxuICAgICAgIXRoaXMuaXNZZXN0ZXJkYXkodmFsdWUpO1xyXG4gIH0sXHJcbiAgZ2V0U2VjdGlvbkJ5S2V5OiBmdW5jdGlvbiBnZXRTZWN0aW9uQnlLZXkoa2V5KSB7XHJcbiAgICBmb3IgKGNvbnN0IHNlY3Rpb24gaW4gdGhpcy5zZWN0aW9ucykge1xyXG4gICAgICBpZiAodGhpcy5zZWN0aW9uc1tzZWN0aW9uXS5rZXkgPT09IGtleSkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNlY3Rpb25zW3NlY3Rpb25dO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0U2VjdGlvbigpO1xyXG4gIH0sXHJcbiAgZ2V0U2VjdGlvbkJ5RGF0ZVRpbWU6IGZ1bmN0aW9uIGdldFNlY3Rpb25CeURhdGVUaW1lKHZhbHVlKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmdldFNlY3Rpb25LZXkodmFsdWUpO1xyXG4gICAgY29uc3Qgc2VjdGlvbiA9IHRoaXMuZ2V0U2VjdGlvbkJ5S2V5KGtleSwgdmFsdWUpO1xyXG4gICAgcmV0dXJuIHNlY3Rpb247XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=