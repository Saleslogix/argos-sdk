/*
    Swiftpage Partner Source License
    Copyright 2013 Swiftpage ACT! LLC.  All rights reserved.
    
    Swiftpage does not charge for use of the Software licensed herein. Charges for any other software or services will be set forth in a separate written agreement between the parties. Software license granted to you herein is contingent upon your acknowledgement and agreement to the terms herein.  If you do not agree to these terms, you do not have the permission to use the Software in any manner.  You acknowledge and agree to the following: (i) Swiftpage provides the Software free of charge and without any obligation of technical support or maintenance; (ii) Swiftpage does not guarantee the accuracy, completeness, and reliability of the Software or whether the Software is virus-free; (iii) Swiftpage makes no representation about whether the Software has been tested (either internally or via beta test) for quality assurance or quality control, (iv) Swiftpage does not guarantee that the Software does not infringe any third party rights; (v) you may experience bugs, errors, loss or corruption of data, and difficulty in use, and (vi) you shall have sole responsibility for protection and preservation of your data and files.
 
    You are not permitted to use the Software in any product that competes in any way, in Swiftpage's opinion, with a Swiftpage product.  Subject to that exception, redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met: (A) Redistributions of source code must retain the above copyright notice, this sentence and the following Disclaimer; and (B) Redistributions in binary form must reproduce the above copyright notice, this sentence and the following Disclaimer in the documentation and/or other materials provided with the distribution. Neither the names of ACT!, Swiftpage, any of Swiftpage's product/service names, nor the names of the contributors to the Software may be used to endorse or promote products/services derived from this Software without specific prior written permission of Swiftpage. Disclaimer: THE SOFTWARE IS ACCEPTED BY YOU "AS IS" AND "WITH ALL FAULTS". ALL WARRANTIES CONCERNING THE SOFTWARE, EXPRESS OR IMPLIED, STATUTORY, OR IN ANY OTHER PROVISION OF THIS AGREEMENT INCLUDING, WITHOUT LIMITATION, ANY WARRANTY OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY, OR FITNESS FOR A PARTICULAR PURPOSE, ARE HEREBY EXPRESSLY DISCLAIMED AND EXCLUDED. WHETHER OR NOT ADVISED OF THE POSSIBILITY OF SUCH DAMAGES, SWIFTPAGE SHALL NOT UNDER ANY CIRCUMSTANCE BE LIABLE TO YOU OR ANY OTHER PARTY FOR ANY SPECIAL, INDIRECT, INCIDENTAL, PUNITIVE OR CONSEQUENTIAL DAMAGES OF ANY KIND, INCLUDING WITHOUT LIMITATION DAMAGES FOR LOSS OF GOODWILL, LOST PROFITS, LOST DATA, WORK STOPPAGE OR COMPUTER HARDWARE OR SOFTWARE DAMAGE, FAILURE OR MALFUNCTION, EVEN IF SWIFTPAGE HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGES AND NOTWITHSTANDING THE FAILURE OF ESSENTIAL PURPOSE OF ANY LIMITED REMEDY.

    You acknowledge that Swiftpage retains and is not transferring to you any title to or ownership rights in or to any intellectual property in the Software, any modifications thereto, or copies thereof.  Swiftpage may terminate this Agreement, in its sole discretion. Upon termination of this Agreement, you shall return to Swiftpage, or destroy, all originals and copies of all Software (including any support materials furnished by Swiftpage), permanently purge all machine-readable copies of the Software from all computers and storage devices, and to certify to Sage in writing that the foregoing duties have been performed and that you will not in any way use or permit the use of the Software. This Agreement shall be governed by the laws of the State of Colorado.
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
        thisMonthText: 'This month',
        thisYearText: 'This year',
        yesterdayText: 'Yesterday',
        lastWeekText: 'Last Week',
        lastMonthText: 'Last month',
        olderText: 'Older',
        nextYearText: 'Next year',
        nextMonthText: 'Next month',
        nextWeekText: 'Next week',
        futureText: 'Future',
        twoWeeksAgoText: 'Two weeks ago',
        threeWeeksAgoText: 'Three weeks ago',
        twoMonthsAgoText: 'Two months ago',
        threeMonthsAgoText: 'Three months ago',

        constructor: function(o) {
            this.groupByProperty = o.groupByProperty;
            this.sortDirection = o.sortDirection;
            this.init();
        },
        init: function() {
            this.sections = [];

            this.sections.push({ key: 'Today', title: this.todayText, value: null });
            this.sections.push({ key: 'Tomorrow', title: this.tomorrowText, value: null });
            this.sections.push({ key: 'LaterThisWeek', title: this.laterThisWeekText, value: null });
            this.sections.push({ key: 'EarlierThisWeek', title: this.earlierThisWeekText, value: null });
            this.sections.push({ key: 'ThisMonth', title: this.thisMonthText, value: null, collapsed: true });
            this.sections.push({ key: 'ThisYear', title: this.thisYearText, value: null, collapsed: true });
            this.sections.push({ key: 'Yesterday', title:this.yesterdayText, value: null });
            this.sections.push({ key: 'LastWeek', title: this.lastWeekText, value: null, collapsed: true });
            this.sections.push({ key: 'TwoWeeksAgo', title: this.twoWeeksAgoText, value: null, collapsed: true });
            this.sections.push({ key: 'ThreeWeeksAgo', title: this.threeWeeksAgoText, value: null, collapsed: true });
            this.sections.push({ key: 'LastMonth', title: this.lastMonthText, value: null, collapsed: true });
            this.sections.push({ key: 'TwoMonthsAgo', title: this.twoMonthsAgoText, value: null, collapsed: true });
            this.sections.push({ key: 'ThreeMonthsAgo', title: this.threeMonthsAgoText, value: null, collapsed: true });
            this.sections.push({ key: 'Older', title: this.olderText, value: null, collapsed: true });
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
            return { key: 'Unknown', title: 'Unknown' };
        },
        getSectionKey: function(value){
            var valueDate;

            if (!this.currentDate) {
                this.currentDate = moment();;
                this.currentYear = this.currentDate.year();
                this.currentMonth = this.currentDate.month();
                this.currentWeek = this.currentDate.week();
                this.currentDay = this.currentDate.dayOfYear();
            }

            if (value) {
                valueDate = moment(value);
            }

            if (this._isOlder(valueDate)) {
                return "Older";
            }

            if (this._isThreeMonthsAgo(valueDate)) {
                return "ThreeMonthsAgo";
            }

            if (this._isTwoMonthsAgo(valueDate)) {
                return "TwoMonthsAgo";
            }

            if (this._isLastMonth(valueDate)) {
                return "LastMonth";
            }

            if (this._isThreeWeeksAgo(valueDate)) {
                return "ThreeWeeksAgo";
            }

            if (this._isTwoWeeksAgo(valueDate)) {
                return "TwoWeeksAgo";
            }

            if (this._isLastWeek(valueDate)) {
                return "LastWeek";
            }

            if (this._isEarlierThisWeek(valueDate)) {
                return "EarlierThisWeek";
            }
            
            if (this._isYesterday(valueDate)) {
                return "Yesterday";
            }

            if (this._isToday(valueDate)) {
                return "Today";
            }

            if (this._isTomorrow(valueDate)) {
                return "Tomorrow";
            }

            if (this._isLaterThisWeek(valueDate)) {
                return "LaterThisWeek";
            }

            if (this._isNextWeek(valueDate)) {
                return "NextWeek";
            }

            if (this._isThisMonth(valueDate)) {
                return "ThisMonth";
            }

            if (this._isNextMonth(valueDate)) {
                return "NextMonth";
            }

            if (this._isThisYear(valueDate)) {
                return "ThisYear";
            }

            if (this._isNextYear(valueDate)) {
                return "NextYear";
            }

            if (this._isFuture(valueDate)) {
                return "Future";
            }

            return "Unknown";
        },
        _isFuture: function(value) {
            return value.year() > (this.currentYear + 1); 
        },
        _isNextYear: function(value) {
            return value.year() === (this.currentYear + 1);
        },
        _isOlder: function(value) {
            return value.year() <= this.currentYear &&
                value.month() < (this.currentMonth - 3);
        },
        _isThisYear: function(value) {
            return value.year() === this.currentYear;
        },
        _isNextMonth: function(value) {
            return this._isThisYear(value) && value.month() === (this.currentMonth + 1);
        },
        _isNextWeek: function(value) {
            return this._isThisYear(value) &&
                value.month() === this.currentMonth &&
                value.week() === (this.currentWeek + 1);
        },
        _isThisMonth: function(value) {
            // Excludes next week
            return this._isThisYear(value) &&
                value.month() === this.currentMonth &&
                value.week() > (this.currentWeek + 1);
        },
        _isTomorrow: function(value) {
            return this._isThisYear(value) &&
                value.month() === this.currentMonth &&
                value.dayOfYear() === (this.currentDay + 1);
        },
        _isToday: function(value) {
            return this._isThisYear(value) &&
                value.month() === this.currentMonth &&
                value.dayOfYear() === this.currentDay;
        },
        _isYesterday: function(value) {
            return this._isThisYear(value) &&
                value.month() === this.currentMonth &&
                value.dayOfYear() === (this.currentDay - 1);
        },
        _isLaterThisWeek: function(value) {
            // Excludes today, tomorrow, and yesterday
            return this._isThisYear(value) &&
                !this._isToday(value) && 
                !this._isTomorrow(value) &&
                !this._isYesterday(value) &&
                value.week() === this.currentWeek &&
                value.dayOfYear() > this.currentDay;
        },
        _isEarlierThisWeek: function(value) {
            // Excludes today, tomorrow, and yesterday
            return this._isThisYear(value) &&
                !this._isToday(value) && 
                !this._isTomorrow(value) &&
                !this._isYesterday(value) &&
                value.week() === this.currentWeek &&
                value.dayOfYear() < this.currentDay;
        },
        _isLastWeek: function(value) {
            // Excludes yesterday
            return value.week() === (this.currentWeek - 1) &&
                !this._isYesterday(value);
        },
        _isTwoWeeksAgo: function(value) {
            return value.week() === (this.currentWeek - 2);
        },
        _isThreeWeeksAgo: function(value) {
            return value.week() === (this.currentWeek - 3);
        },
        _isLastMonth: function(value) {
            return value.month() === (this.currentMonth - 1);
        },
        _isTwoMonthsAgo: function(value) {
            return value.month() === (this.currentMonth - 2);
        },
        _isThreeMonthsAgo: function(value) {
            return value.month() === (this.currentMonth - 3);
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
