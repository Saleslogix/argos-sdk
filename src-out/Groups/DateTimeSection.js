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

  /**
   * @module argos/Groups/DateTimeSection
   */
  const resource = (0, _I18n2.default)('dateTimeSection');

  /**
   * @class
   * @alias module:argos/Groups/DateTimeSection
   */
  const __class = (0, _declare2.default)('argos.Groups.DateTimeSection', [_GroupBySection3.default], /** @lends module:argos/Groups/DateTimeSection.prototype */{
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
        const value = _Utility2.default.getValue(entry, this.groupByProperty);
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
      let valueDate;

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
      const yearEnd = this.currentDate.clone().endOf('year');
      const nextMonthEnd = this.currentDate.clone().add(1, 'month').endOf('month');

      return value.isAfter(nextMonthEnd) && value.isBefore(yearEnd);
    },
    isEarlierThisYear: function isEarlierThisYear(value) {
      // Anything at the start of the year up until last month
      const yearStart = this.currentDate.clone().startOf('year');
      const lastMonthStart = this.currentDate.clone().subtract(1, 'month').startOf('month');
      return value.isAfter(yearStart) && value.isBefore(lastMonthStart);
    },
    isNextMonth: function isNextMonth(value) {
      // next month, excluding any potential upcoming days (next week, later this week, tomorrow)
      const nextMonthStart = this.currentDate.clone().add(1, 'month').startOf('month');
      const nextMonthEnd = nextMonthStart.clone().endOf('month');

      return value.isAfter(nextMonthStart) && value.isBefore(nextMonthEnd) && !this.isNextWeek(value) && !this.isEarlierThisWeek(value) && !this.isTomorrow(value);
    },
    isEarlierThisMonth: function isEarlierThisMonth(value) {
      // Excludes last week
      const monthStart = this.currentDate.clone().startOf('month');
      const lastWeekStart = this.currentDate.clone().subtract(1, 'week').startOf('week');

      return value.isAfter(monthStart) && value.isBefore(lastWeekStart);
    },
    isLaterThisMonth: function isLaterThisMonth(value) {
      // Excludes next week
      const monthEnd = this.currentDate.clone().endOf('month');
      const nextWeekEnd = this.currentDate.clone().add(1, 'week').endOf('week');

      return value.isAfter(nextWeekEnd) && value.isBefore(monthEnd);
    },
    isNextWeek: function isNextWeek(value) {
      const nextWeekStart = this.currentDate.clone().add(1, 'week').startOf('week');
      const nextWeekEnd = nextWeekStart.clone().endOf('week');

      return value.isAfter(nextWeekStart) && value.isBefore(nextWeekEnd) && !this.isTomorrow(value);
    },
    isTomorrow: function isTomorrow(value) {
      const tomorrow = this.currentDate.clone().add(1, 'days').startOf('day');
      const newValue = value.clone().startOf('day');
      return tomorrow.isSame(newValue);
    },
    isToday: function isToday(value) {
      const now = this.currentDate.clone().startOf('day');
      const newValue = value.clone().startOf('day');
      return now.isSame(newValue);
    },
    isYesterday: function isYesterday(value) {
      const yesterday = this.currentDate.clone().subtract(1, 'days').startOf('day');
      const newValue = value.clone().startOf('day');
      return yesterday.isSame(newValue);
    },
    isLaterThisWeek: function isLaterThisWeek(value) {
      // Excludes today, tomorrow, and yesterday
      const later = this.currentDate.clone().add(2, 'days').startOf('day');
      const endWeek = this.currentDate.clone().endOf('week');

      return value.isAfter(later) && value.isBefore(endWeek);
    },
    isEarlierThisWeek: function isEarlierThisWeek(value) {
      // Start of week to yesterday
      const yesterday = this.currentDate.clone().subtract(1, 'days').startOf('day');
      const weekStart = this.currentDate.clone().startOf('week');

      return value.isAfter(weekStart) && value.isBefore(yesterday);
    },
    isLastWeek: function isLastWeek(value) {
      const lastWeekStart = this.currentDate.clone().subtract(1, 'week').startOf('week');
      const lastWeekEnd = lastWeekStart.clone().endOf('week');

      return value.isAfter(lastWeekStart) && value.isBefore(lastWeekEnd) && !this.isYesterday(value);
    },
    isLastMonth: function isLastMonth(value) {
      // Last month, excluding any potential past days (earlier this week, last week, yesterday)
      const lastMonthStart = this.currentDate.clone().subtract(1, 'month').startOf('month');
      const lastMonthEnd = lastMonthStart.clone().endOf('month');

      return value.isAfter(lastMonthStart) && value.isBefore(lastMonthEnd) && !this.isEarlierThisWeek(value) && !this.isLastWeek(value) && !this.isYesterday(value);
    },
    getSectionByKey: function getSectionByKey(key) {
      for (const section in this.sections) {
        if (this.sections[section].key === key) {
          return this.sections[section];
        }
      }
      return this.getDefaultSection();
    },
    getSectionByDateTime: function getSectionByDateTime(value) {
      const key = this.getSectionKey(value);
      const section = this.getSectionByKey(key, value);
      return section;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});