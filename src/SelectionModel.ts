import getResource from './I18n';

/**
 * @class argos.SelectionModel
 * SelectionModel provides a simple in-memory store for data that fires events
 * when a item is selected (added) or deselected (removed)
 * @alternateClassName SelectionModel
 */
export default class SelectionModel {
  /**
   * Initializes the selections to be empty and mixes the passed object overriding any default properties.
   * @param {Object} options The object to be mixed in.
   */
  constructor(options) {
    this.selections = {};

    Object.assign(this, options);
  }

  private resource = getResource('selectionModel');
  // Localization
  requireSelectionText = this.resource.requireSelectionText;

  /**
   * @property {Boolean}
   * Flag to indicate a selection is required.
   */
  requireSelection = false;
  /**
   * @property {Number}
   * Number of selections
   */
  count = 0;
  /**
   * @property {Object}
   * Collection of selections where the key is the selections key
   */
  selections = null;
  /**
   * @property {Boolean}
   * Flag that determines how to clear:
   *
   * True: Deselect is called on every item, firing onDeselect for each and firing onClear at the end
   *
   * False: Collection is immediately wiped and only onClear is fired
   *
   */
  clearAsDeselect = true;
  /**
   * @property {Boolean}
   * Flag that control the firing of action events: onSelect, onDeselect, onClear
   */
  _fireEvents = true;

  /**
   * Prevents the firing of action events: onSelect, onDeselect, onClear
   */
  suspendEvents() {
    this._fireEvents = false;
  }
  /**
   * Enables the firing of action events:  onSelect, onDeselect, onClear
   */
  resumeEvents() {
    this._fireEvents = true;
  }
  /**
   * Event that happens when an item is selected/added.
   * @param {String} key Unique identifier string
   * @param {Object} data The item stored
   * @param tag
   * @param self
   * @template
   */
  onSelect(key, data, tag, self) {}
  /**
   * Event that happens when an item is deselected/removed.
   * @param {String} key Unique identifier string
   * @param {Object} data The item removed
   * @param tag
   * @param self
   * @template
   */
  onDeselect(key, data, tag, self) {}
  /**
   * Event that happens when the store is cleared
   * @param self
   */
  onClear(self) {}
  /**
   * Adds an item to the `selections` if it is not already stored.
   * @param {String} key Unique identifier string
   * @param {Object} data The item being selected
   * @param tag
   */
  select(key, data, tag) {
    if (!this.selections.hasOwnProperty(key)) {
      this.selections[key] = {
        data,
        tag,
      };
      this.count++;
      if (this._fireEvents) {
        this.onSelect(key, data, tag, this);
      }
    }
  }
  /**
   * Adds an item to the `selections` if it is not already stored, if it is
   * stored, then it deselects (removes) the item.
   * @param {String} key Unique identifier string
   * @param {Object} data The item being selected
   * @param tag
   */
  toggle(key, data, tag) {
    if (this.isSelected(key)) {
      this.deselect(key);
    } else {
      this.select(key, data, tag);
    }
  }
  /**
   * Removes an item from the store
   * @param {String} key Unique identifier string that was given when the item was added
   */
  deselect(key) {
    if (this.requireSelection && this.count === 1) {
      window.alert(this.requireSelectionText); // tslint:disable-line
      return;
    }

    if (this.selections.hasOwnProperty(key)) {
      const selection = this.selections[key];

      delete this.selections[key];
      this.count--;

      if (this._fireEvents) {
        this.onDeselect(key, selection.data, selection.tag, this);
      }
    }
  }
  /**
   * Removes all items from the store
   */
  clear() {
    const original = this.requireSelection;

    if (this.clearAsDeselect) {
      this.requireSelection = false;
      for (const key in this.selections) {
        if (this.selections.hasOwnProperty(key)) {
          this.deselect(key);
        }
      }

      this.requireSelection = original;
    } else {
      this.selections = {};
      this.count = 0;
    }

    if (this._fireEvents) {
      this.onClear(this);
    }
  }
  /**
   * Determines if the given key is in the selections collection.
   * @param {String} key Unique identifier string that was given when the item was added
   * @return {Boolean} True if the item is in the store.
   */
  isSelected(key) {
    return !!this.selections[key];
  }
  /**
   * Returns the number of items in the store
   * @return {Number} Current count of items
   */
  getSelectionCount() {
    return this.count;
  }
  /**
   * Returns all items in the store
   * @return {Object} The entire selection collection
   */
  getSelections() {
    return this.selections;
  }
  /**
   * Returns a list of unique identifier keys used in the selection collection
   * @return {String[]} All keys in the store
   */
  getSelectedKeys() {
    return Object.keys(this.selections).filter((key) => {
      return this.selections.hasOwnProperty(key);
    });
  }
}
