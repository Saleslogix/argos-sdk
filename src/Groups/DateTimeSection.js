/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */

/**
 * @class Sage.Platform.Mobile.Groups.DateTimeSection
 */
define('Sage/Platform/Mobile/Groups/DateTimeSection', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
    'Sage/Platform/Mobile/Convert',
    'Sage/Platform/Mobile/Utility',
    'Sage/Platform/Mobile/Groups/_GroupBySection',
    'moment'
], function(
    declare,
    lang,
    string,
    Convert,
    Utility,
    _GroupBySection,
    moment
) {

    return declare('Sage.Platform.Mobile.Groups.DateTimeSection', [_GroupBySection], {
        name: 'DateTimeSectionFilter',
        displayNameText: 'Date Time Section',
        todayText: 'Today',
        tomorrowText: 'Tomorrow',
        laterThisWeekText: 'Later this week',
        earlierThisWeekText: 'Earlier this week',
        thisLaterMonthText: 'Later this month',
        thisEarlierMonthText: 'Earlier this month',
        thisYearEarlierText: 'Earlier this year',
        thisYearLaterText: 'Later this year',
        yesterdayText: 'Yesterday',
        lastWeekText: 'Last week',
        lastMonthText: 'Last month',
        pastYearText: 'Past year(s)',
        nextYearText: 'Next year',
        nextMonthText: 'Next month',
        nextWeekText: 'Next week',
        futureText: 'Future',
        twoWeeksAgoText: 'Two weeks ago',
        threeWeeksAgoText: 'Three weeks ago',
        twoMonthsAgoText: 'Two months ago',
        threeMonthsAgoText: 'Three months ago',
        unknownText: 'Unknown',

        constructor: function(o) {
            declare.safeMixin(this, o);
            this.init();
        },
        init: function() {
            this.inherited(arguments);
            this.sections = [];

            this.sections.push({ key: 'Today', title: this.todayText, value: null });
            this.sections.push({ key: 'Tomorrow', title: this.tomorrowText, value: null });
            this.sections.push({ key: 'LaterThisWeek', title: this.laterThisWeekText, value: null });
            this.sections.push({ key: 'EarlierThisWeek', title: this.earlierThisWeekText, value: null });
            this.sections.push({ key: 'EarlierThisMonth', title: this.thisEarlierMonthText, value: null, collapsed: true });
            this.sections.push({ key: 'LaterThisMonth', title: this.thisLaterMonthText, value: null, collapsed: true });
            this.sections.push({ key: 'EarlierThisYear', title: this.thisYearEarlierText, value: null, collapsed: true });
            this.sections.push({ key: 'LaterThisYear', title: this.thisYearLaterText, value: null, collapsed: true });
            this.sections.push({ key: 'Yesterday', title:this.yesterdayText, value: null });
            this.sections.push({ key: 'LastWeek', title: this.lastWeekText, value: null, collapsed: true });
            this.sections.push({ key: 'LastMonth', title: this.lastMonthText, value: null, collapsed: true });
            this.sections.push({ key: 'PastYear', title: this.pastYearText, value: null, collapsed: true });
            this.sections.push({ key: 'NextYear', title: this.nextYearText, value: null, collapsed: true });
            this.sections.push({ key: 'NextMonth', title: this.nextMonthText, value: null, collapsed: true });
            this.sections.push({ key: 'NextWeek', title: this.nextWeekText, value: null, collapsed: true });
            this.sections.push({ key: 'Future', title: this.futureText,value: null, collapsed: true });
        },
        getSection: function(entry) {
            var value;
            if ((this.groupByProperty) && (entry)) {
                value = Utility.getValue(entry, this.groupByProperty);
                if (value) {
                    return this.getSectionByDateTime(value);
                }
                else {
                    return this.getDefaultSection();
                }
            }
            return null;
        },
        getDefaultSection:function(){
            return { key: 'Unknown', title: this.unknownText, collapsed: true };
        },
        getSectionKey: function(value){
            var valueDate;

            if (!this.currentDate) {
                this.currentDate = moment();
            }

            if (value) {
                valueDate = moment(value);
            } else {
                return 'Unknown';
            }

            if (this.momentLang) {
                valueDate.lang(this.momentLang);
                this.currentDate.lang(this.momentLang);
            }

            if (this.isPastYear(valueDate)) {
                return "PastYear";
            }

            if (this.isLastMonth(valueDate)) {
                return "LastMonth";
            }

            if (this.isEarlierThisMonth(valueDate)) {
                return "EarlierThisMonth";
            }

            if (this.isLastWeek(valueDate)) {
                return "LastWeek";
            }

            if (this.isEarlierThisWeek(valueDate)) {
                return "EarlierThisWeek";
            }

            if (this.isYesterday(valueDate)) {
                return "Yesterday";
            }

            if (this.isToday(valueDate)) {
                return "Today";
            }

            if (this.isTomorrow(valueDate)) {
                return "Tomorrow";
            }

            if (this.isLaterThisWeek(valueDate)) {
                return "LaterThisWeek";
            }

            if (this.isNextWeek(valueDate)) {
                return "NextWeek";
            }

            if (this.isLaterThisMonth(valueDate)) {
                return "LaterThisMonth";
            }

            if (this.isNextMonth(valueDate)) {
                return "NextMonth";
            }

            if (this.isEarlierThisYear(valueDate)) {
                return "EarlierThisYear";
            }

            if (this.isLaterThisYear(valueDate)) {
                return "LaterThisYear";
            }

            if (this.isNextYear(valueDate)) {
                return "NextYear";
            }

            return "Future";
        },
        isNextYear: function(value) {
            // Next year excluding anything that could be within the next month (next week, later this week, tomorrow)
            return value.year() === (this.currentDate.year() + 1) &&
                !this.isNextMonth(value);
        },
        isPastYear: function(value) {
            return value.year() < this.currentDate.year() &&
                !this.isLastMonth(value);
        },
        isLaterThisYear: function(value) {
            // Anything from the end of next month to the end of the year
            var yearEnd = this.currentDate.clone().endOf('year'),
                nextMonthEnd = this.currentDate.clone().add(1, 'month').endOf('month');

            return value.isAfter(nextMonthEnd) &&
                value.isBefore(yearEnd);
        },
        isEarlierThisYear: function(value) {
            // Anything at the start of the year up until last month
            var yearStart = this.currentDate.clone().startOf('year'),
                lastMonthStart = this.currentDate.clone().subtract(1, 'month').startOf('month');
            return value.isAfter(yearStart) &&
                value.isBefore(lastMonthStart);
        },
        isNextMonth: function(value) {
            // next month, excluding any potential upcoming days (next week, later this week, tomorrow)
            var nextMonthStart = this.currentDate.clone().add(1, 'month').startOf('month'),
                nextMonthEnd = nextMonthStart.clone().endOf('month');

            return value.isAfter(nextMonthStart) &&
                value.isBefore(nextMonthEnd) &&
                !this.isNextWeek(value) &&
                !this.isEarlierThisWeek(value) &&
                !this.isTomorrow(value);
        },
        isEarlierThisMonth: function(value) {
            // Excludes last week
            var monthStart = this.currentDate.clone().startOf('month'),
                lastWeekStart = this.currentDate.clone().subtract(1, 'week').startOf('week');

            return value.isAfter(monthStart) &&
                value.isBefore(lastWeekStart);
        },
        isLaterThisMonth: function(value) {
            // Excludes next week
            var monthEnd = this.currentDate.clone().endOf('month'),
                nextWeekEnd = this.currentDate.clone().add(1, 'week').endOf('week');

            return value.isAfter(nextWeekEnd) &&
                value.isBefore(monthEnd);
        },
        isNextWeek: function(value) {
            var nextWeekStart = this.currentDate.clone().add(1, 'week').startOf('week'),
                nextWeekEnd = nextWeekStart.clone().endOf('week');

            return value.isAfter(nextWeekStart) &&
                value.isBefore(nextWeekEnd) &&
                !this.isTomorrow(value);
        },
        isTomorrow: function(value) {
            var tomorrow = this.currentDate.clone().add(1, 'days').startOf('day');
            value = value.clone().startOf('day');
            return tomorrow.isSame(value);
        },
        isToday: function(value) {
            var now = this.currentDate.clone().startOf('day');
            value = value.clone().startOf('day');
            return now.isSame(value);
        },
        isYesterday: function(value) {
            var yesterday = this.currentDate.clone().subtract(1, 'days').startOf('day');
            value = value.clone().startOf('day');
            return yesterday.isSame(value);
        },
        isLaterThisWeek: function(value) {
            // Excludes today, tomorrow, and yesterday
            var later = this.currentDate.clone().add(2, 'days').startOf('day'),
                endWeek = this.currentDate.clone().endOf('week');

            return value.isAfter(later) && value.isBefore(endWeek);
        },
        isEarlierThisWeek: function(value) {
            // Start of week to yesterday
            var yesterday = this.currentDate.clone().subtract(1, 'days').startOf('day'),
                weekStart = this.currentDate.clone().startOf('week');

            return value.isAfter(weekStart) &&
                value.isBefore(yesterday);
        },
        isLastWeek: function(value) {
            var lastWeekStart = this.currentDate.clone().subtract(1, 'week').startOf('week'),
                lastWeekEnd = lastWeekStart.clone().endOf('week');

            return value.isAfter(lastWeekStart) &&
                value.isBefore(lastWeekEnd) &&
                !this.isYesterday(value);
        },
        isLastMonth: function(value) {
            // Last month, excluding any potential past days (earlier this week, last week, yesterday)
            var lastMonthStart = this.currentDate.clone().subtract(1, 'month').startOf('month'),
                lastMonthEnd = lastMonthStart.clone().endOf('month');

            return value.isAfter(lastMonthStart) &&
                value.isBefore(lastMonthEnd) &&
                !this.isEarlierThisWeek(value) &&
                !this.isLastWeek(value) &&
                !this.isYesterday(value);
        },
        getSectionByKey:function(key, value){
            var section;
            for(section in this.sections){
                if (this.sections[section].key === key) {
                    return this.sections[section];
                }
            }
            return this.getDefaultSection();
        },
        getSectionByDateTime:function(value){
            var section,key;
            key = this.getSectionKey(value);
            section = this.getSectionByKey(key, value);
            return section;
        }
    });
});
