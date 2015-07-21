<<<<<<< HEAD
define('argos/Groups/GroupByValueSection', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', '../Convert', '../Utility', './_GroupBySection'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoString, _Convert, _Utility, _GroupBySection2) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    /*
     * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
     */

    /**
     * @class argos.Groups.GroupByValueSection
     */

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _string = _interopRequireDefault(_dojoString);

    var _Convert2 = _interopRequireDefault(_Convert);

    var _Utility2 = _interopRequireDefault(_Utility);

    var _GroupBySection3 = _interopRequireDefault(_GroupBySection2);

    var __class = (0, _declare['default'])('argos.Groups.GroupByValueSection', [_GroupBySection3['default']], {
        name: 'DateTimeSectionFilter',
        displayNameText: 'Group By Value Section',
        width: 0,
        constructor: function constructor(o) {
=======
/*
 * Copyright (c) 1997-2013, SalesLogix, NA., LLC. All rights reserved.
 */

/**
 * @class argos.Groups.GroupByValueSection
 */
define('argos/Groups/GroupByValueSection', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/string',
    '../Convert',
    '../Utility',
    './_GroupBySection'
], function(
    declare,
    lang,
    string,
    Convert,
    Utility,
    _GroupBySection
) {

    var __class = declare('argos.Groups.GroupByValueSection', [_GroupBySection], {
        name: 'DateTimeSectionFilter',
        displayNameText: 'Group By Value Section',
        width:0,
        constructor: function(o) {
>>>>>>> develop
            this.groupByProperty = o.groupByProperty;
            this.sortDirection = o.sortDirection;
            if (o.width) {
                this.width = o.width;
            }
            this.init();
        },
<<<<<<< HEAD
        init: function init() {
            this.sections = [];
        },
        getSection: function getSection(entry) {
=======
        init: function() {
            this.sections = [];
        },
        getSection: function(entry) {
>>>>>>> develop
            var value;
            if (this.groupByProperty && entry) {
                value = _Utility2['default'].getValue(entry, this.groupByProperty);
                value = this._getValueFromWidth(value, this.width);
                if (value) {
                    return { key: value, title: value };
                } else {
                    return this.getDefaultSection();
                }
            }
            return null;
        },
<<<<<<< HEAD
        getDefaultSection: function getDefaultSection() {
            return { key: 'Unknown', title: 'Unknown' };
        },
        _getValueFromWidth: function _getValueFromWidth(value, width) {
=======
        getDefaultSection: function() {
            return { key: 'Unknown', title: 'Unknown' };
        },
        _getValueFromWidth: function(value, width) {
>>>>>>> develop
            if (value) {
                if (width > 0) {
                    value = value.toString().substring(0, width);
                }
            }
            return value;
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.Groups.GroupByValueSection', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile.Groups.GroupByValueSection', __class);
    return __class;
>>>>>>> develop
});
