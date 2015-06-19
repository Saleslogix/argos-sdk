define(["require", "exports", 'dojo/_base/declare', 'dojo/_base/lang'], function (require, exports, declare, lang) {
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
        sortDirection: 'desc',
        sections: null,
        constructor: function (o) {
            lang.mixin(this, o);
        },
        init: function () {
        },
        getGroupSection: function (entry) {
        },
        getOrderByQuery: function () {
            return this.groupByProperty + ' ' + this.sortDirection;
        }
    });
    lang.setObject('Sage.Platform.Mobile.Groups._GroupBySection', __class);
    return __class;
});
