/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */

/**
 * @class Sage.Platform.Mobile.Groups.GroupByValueSection
 */
define('Sage/Platform/Mobile/Groups/GroupByValueSection', [
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

    return declare('Sage.Platform.Mobile.Groups.GroupByValueSection', [_GroupBySection], {
        name: 'DateTimeSectionFilter',        
        displayNameText: 'Group By Value Section',
        width:0,
        constructor: function(o) {
            this.groupByProperty = o.groupByProperty;
            this.sortDirection = o.sortDirection;
            if (o.width) {
                this.width = o.width;
            }
            this.init();
        },
        init: function() {
            this.sections = [];
        },
        getSection: function(entry) {
            var value;
            if ((this.groupByProperty) && (entry)) {
                value = Utility.getValue(entry, this.groupByProperty);
                value = this._getValueFromWidth(value, this.width);
                if (value) {
                    return { key: value, title: value };
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
        _getValueFromWidth:function(value, width){
            if (value) {
                if (width > 0) {
                    value =value.toString().substring(0,width);
                }
            }
            return value;
        }
        
    });
});
