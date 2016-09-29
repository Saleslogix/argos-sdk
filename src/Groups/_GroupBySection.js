import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';

/**
 * @class argos.Groups._GroupSection
 */
const __class = declare('argos.Groups._GroupBySection', null, {
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
  constructor: function constructor(o) {
    lang.mixin(this, o);
  },
  init: function init() {},
  getGroupSection: function getGroupSection(/* entry*/) {},
  getOrderByQuery: function getOrderByQuery() {
    return `${this.groupByProperty} ${this.sortDirection}`;
  },
});

lang.setObject('Sage.Platform.Mobile.Groups._GroupBySection', __class);
export default __class;
