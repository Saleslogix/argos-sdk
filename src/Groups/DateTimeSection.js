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
 * @class Sage.Platform.Mobile.Groups._GroupSection
 */
define('Sage/Platform/Mobile/Groups/DateTimeSection', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
     'Sage/Platform/Mobile/Convert',
     'Sage/Platform/Mobile/Utility',
     'Sage/Platform/Mobile/Groups/_GroupBySection'
], function(
    declare,
    lang,
    string,
    Convert,
    Utility,
    _GroupBySection
) {

    return declare('Sage.Platform.Mobile.Groups.DateTimeSection', [_GroupBySection], {
        name: 'DateTimeSectionFilter',        
        displayNameText: 'Date Time Section',
        todayText: 'Today',
        tomorrowText: 'Tomorrow',
        thisWeekText: 'This week',
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
            this.sections.push({ key: 'ThisWeek', title: this.thisWeekText, value: null });
            this.sections.push({ key: 'ThisMonth', title: this.thisMonthText, value: null });
            this.sections.push({ key: 'ThisYear', title: this.thisYearText, value: null });
            this.sections.push({ key: 'Yesterday', title:this.yesterdayText, value: null });
            this.sections.push({ key: 'LastWeek', title: this.lastWeekText, value: null });
            this.sections.push({ key: 'TwoWeeksAgo', title: this.twoWeeksAgoText, value: null });
            this.sections.push({ key: 'ThreeWeeksAgo', title: this.threeWeeksAgoText, value: null });
            this.sections.push({ key: 'LastMonth', title: this.lastMonthText, value: null });
            this.sections.push({ key: 'TwoMonthsAgo', title: this.twoMonthsAgoText, value: null });
            this.sections.push({ key: 'ThreeMonthsAgo', title: this.threeMonthsAgoText, value: null });
            this.sections.push({ key: 'Older', title: this.olderText, value: null });
            this.sections.push({ key: 'NextYear', title: this.nextYearText, value: null });
            this.sections.push({ key: 'NextMonth', title: this.nextMonthText, value: null });
            this.sections.push({ key: 'NextWeek', title: this.nextWeekText, value: null });
            this.sections.push({ key: 'Future', title: this.futureText,value: null });
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
            return { key: 'Unknown', title: 'Unknown' }
        },
        getSectionKey: function(value){
            var valueDate, valueYear, valueMonth, valueDay, valueWeek, key;

            key = '';
            if (!this.currentDate) {
                this.currentDate = new Date();
                this.currentYear = this.currentDate.getYear();
                this.currentMonth = this.currentDate.getMonth();
                this.currentWeek = this._getWeek(this.currentDate);
                this.currentDay = this.currentDate.getDay();
            }

            if (value) {
                valueDate = Convert.toDateFromString(value);
                valueYear = valueDate.getYear();
                valueMonth = valueDate.getMonth();
                valueWeek = this._getWeek(valueDate);
                valueDay = valueDate.getDay();
            }
            if (valueYear > this.currentYear) {
                if (valueYear == (this.currentYear + 1)) {
                    key = "NextYear";
                }
                else {
                    key = "Future";
                }
            } else if (valueYear == this.currentYear) {
                if (valueMonth > this.currentMonth) {
                    if (valueMonth == this.currentMonth + 1) {
                        key = "NextMonth";
                    } else {
                        key = "ThisYear";
                    }
                } else if (valueMonth == this.currentMonth) {
                    if (valueWeek > this.currentWeek) {

                        if (valueWeek = this.currentWeek + 1) {
                            key = "NextWeek";
                        } else {
                            key = "ThisMonth";
                        }
                    } else if (valueWeek == this.currentWeek) {
                        if (valueDay > this.currentDay) {
                            if (valueDay == (this.currentDay + 1)) {
                                key = "Tomorrow";
                            }
                            else {
                                key = "ThisWeek";
                            }
                        } else if (valueDay == this.currentDay) {
                            key = "Today";
                        } else {
                            if (valueDay == (this.currentDay - 1)) {
                                key = "Yesterday";
                            }else{ 
                                key = "X";
                            }
                        }
                    }
                    else {
                        if (valueWeek == this.currentWeek - 1) {
                            key = "LastWeek";
                        } else if (valueWeek == this.currentWeek - 2) {
                            key = "TwoWeeksAgo";
                        } else if (valueWeek == this.currentWeek - 3) {
                            key = "ThreeWeeksAgo";
                        } else {
                            key = "LastMonth";
                        }
                    }

                } else {
                    if (valueMonth == (this.currentMonth - 1)) {
                        key = "LastMonth";
                    } else if(valueMonth == (this.currentMonth - 2)) {
                        key = "TwoMonthsAgo";
                    } else if (valueMonth == (this.currentMonth - 3)) {
                        key = "ThreeMonthsAgo";
                    } else {
                        key = "Older";
                    }
                }
            } else if (valueYear < this.currentYear) {
                key = "Older";
            } else {
                key = "Unknown";
            }
            return key;
        },
        getSectionByKey:function(key, value){
            for(section in this.sections){
                if (this.sections[section].key == key) {
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
        },
        _getWeek: function(date) {
            var onejan = new Date(date.getFullYear(),0,1);
            return Math.ceil((((date - onejan) / 86400000) + onejan.getDay()+1)/7);
        } 
    });
});
