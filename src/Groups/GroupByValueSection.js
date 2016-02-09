/**
 * @class argos.Groups.GroupByValueSection
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import Utility from '../Utility';
import _GroupBySection from './_GroupBySection';
import getResource from '../I18n';

const resource = getResource('groupByValueSection');

const __class = declare('argos.Groups.GroupByValueSection', [_GroupBySection], {
  name: 'DateTimeSectionFilter',
  displayNameText: resource.displayNameText,
  width: 0,
  constructor: function constructor(o) {
    this.groupByProperty = o.groupByProperty;
    this.sortDirection = o.sortDirection;
    if (o.width) {
      this.width = o.width;
    }
    this.init();
  },
  init: function init() {
    this.sections = [];
  },
  getSection: function getSection(entry) {
    if ((this.groupByProperty) && (entry)) {
      let value = Utility.getValue(entry, this.groupByProperty);
      value = this._getValueFromWidth(value, this.width);
      if (value) {
        return {
          key: value,
          title: value,
        };
      }
      return this.getDefaultSection();
    }
    return null;
  },
  getDefaultSection: function getDefaultSection() {
    return {
      key: 'Unknown',
      title: 'Unknown',
    };
  },
  _getValueFromWidth: function _getValueFromWidth(value, width) {
    if (value) {
      if (width > 0) {
        return value.toString().substring(0, width);
      }
    }
    return value;
  },
});

lang.setObject('Sage.Platform.Mobile.Groups.GroupByValueSection', __class);
export default __class;
