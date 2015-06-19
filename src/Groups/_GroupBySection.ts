import declare = require('dojo/_base/declare');
import lang = require('dojo/_base/lang');
import string = require('dojo/string');

/**
 * @class argos.Groups._GroupSection
 */
var __class = declare('argos.Groups._GroupBySection', null, {
    /**
    * @property {String}
    * The unique (within the current form) name of the field
    */
    name: null,
    /**
     * @property {String}
     * Signifies that the field should always be included when the form calls {@link Edit#getValues getValues}.
     */
    displayName: null,
    /**
     * @property {String}
     * The SData property that the field will be bound to.
     */
    groupByProperty: null,
    sortDirection:'desc',
    sections: null,
    constructor: function(o) {
        lang.mixin(this, o);
    },
    init: function() {
    },
    getGroupSection: function(entry) {
    },
    getOrderByQuery: function() {
        return this.groupByProperty + ' ' + this.sortDirection;
    }
});

lang.setObject('Sage.Platform.Mobile.Groups._GroupBySection', __class);
export = <argos.Groups._GroupBySection>__class;
