/**
 * @class argos.Groups._GroupSection
 */
export default class _GroupBySection {
  /**
   * @property {String}
   * The unique (within the current form) name of the field
   */
  name = null;
  /**
   * @property {String}
   * Signifies that the field should always be included when the form calls {@link Edit#getValues getValues}.
   */
  displayName = null;
  /**
   * @property {String}
   * The SData property that the field will be bound to.
   */
  groupByProperty = null;
  sortDirection = 'desc';
  sections = null;

  constructor(o) {
    Object.assign(this, o);
  }

  init() {}

  getGroupSection(/* entry*/) {}

  getOrderByQuery() {
    return `${this.groupByProperty} ${this.sortDirection}`;
  }
}
