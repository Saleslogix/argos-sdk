import SelectionModel from './SelectionModel';

/**
 * @class argos.ConfigurableSelectionModel
 * The ConfigurableSelectionModel adds the logic to the SelectionModel to only have one item selected at a
 * time via the `singleSelection` flag.
 * @alternateClassName ConfigurableSelectionModel
 * @extends argos.SelectionModel
 */
export default class ConfigurableSelectionModel extends SelectionModel {
  constructor() {
    super(null);
  }
  /**
   * @property {Boolean}
   * Flag that controls if only one item is selectable at a time. Meaning if this is true
   * then when a selection is made it first {@link SelectionModel#clear clears} the store.
   */
  singleSelection = false;
  /**
   * This function is called in Lists {@link List#beforeTransitionTo beforeTransitionTo} and
   * it is always passed the Lists navigation options `singleSelect`.
   *
   * It then sets the flag `singleSelection` to the value if the passed value.
   *
   * @param {Boolean} val The state that `singleSelection` should be in.
   */
  useSingleSelection(val) {
    this.singleSelection = !!val;
  }
  /**
   * Extends the base {@link SelectionModel#select select} by first clearing out the entire
   * store if `singleSelection` is true and there are items already in the store.
   * @param {String} key Unique identifier string
   * @param {Object} data The item being selected
   * @param tag
   */
  select(key, data, tag) {
    if (this.singleSelection) {
      if (!this.isSelected(key) || (this.count >= 1)) {
        this.clear();
      }
    }

    super.select(key, data, tag);
  }
}
