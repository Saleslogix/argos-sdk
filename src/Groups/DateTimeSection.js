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
                if (valueYear === (this.currentYear + 1)) {
                    key = "NextYear";
                }
                else {
                    key = "Future";
                }
            } else if (valueYear === this.currentYear) {
                if (valueMonth > this.currentMonth) {
                    if (valueMonth === this.currentMonth + 1) {
                        key = "NextMonth";
                    } else {
                        key = "ThisYear";
                    }
                } else if (valueMonth === this.currentMonth) {
                    if (valueWeek > this.currentWeek) {

                        if (valueWeek === this.currentWeek + 1) {
                            key = "NextWeek";
                        } else {
                            key = "ThisMonth";
                        }
                    } else if (valueWeek === this.currentWeek) {
                        if (valueDay > this.currentDay) {
                            if (valueDay === (this.currentDay + 1)) {
                                key = "Tomorrow";
                            }
                            else {
                                key = "ThisWeek";
                            }
                        } else if (valueDay === this.currentDay) {
                            key = "Today";
                        } else {
                            if (valueDay === (this.currentDay - 1)) {
                                key = "Yesterday";
                            }else{ 
                                key = "X";
                            }
                        }
                    }
                    else {
                        if (valueWeek === this.currentWeek - 1) {
                            key = "LastWeek";
                        } else if (valueWeek === this.currentWeek - 2) {
                            key = "TwoWeeksAgo";
                        } else if (valueWeek === this.currentWeek - 3) {
                            key = "ThreeWeeksAgo";
                        } else {
                            key = "LastMonth";
                        }
                    }

                } else {
                    if (valueMonth === (this.currentMonth - 1)) {
                        key = "LastMonth";
                    } else if(valueMonth === (this.currentMonth - 2)) {
                        key = "TwoMonthsAgo";
                    } else if (valueMonth === (this.currentMonth - 3)) {
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
        },
        _getWeek: function(date) {
            var onejan = new Date(date.getFullYear(),0,1);
            return Math.ceil((((date - onejan) / 86400000) + onejan.getDay()+1)/7);
        } 
    });
});
