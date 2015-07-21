define('argos/SelectionModel', [
       'dojo/_base/lang',
       'dojo/_base/declare'
], function(
    lang,
    declare
) {

    /**
     * @class argos.SelectionModel
     * SelectionModel provides a simple in-memory store for data that fires events
     * when a item is selected (added) or deselected (removed)
     * @alternateClassName SelectionModel
     */
    var __class = declare('argos.SelectionModel', null, {
        // Localization
        requireSelectionText: 'A selection is required, you cannot de-select the last item.',

        /**
         * @property {Boolean}
         * Flag to indicate a selection is required.
         */
        requireSelection: false,
        /**
         * @property {Number}
         * Number of selections
         */
        count: 0,
        /**
         * @property {Object}
         * Collection of selections where the key is the selections key
         */
        selections: null,
        /**
         * @property {Boolean}
         * Flag that determines how to clear:
         *
         * True: Deselect is called on every item, firing onDeselect for each and firing onClear at the end
         *
         * False: Collection is immediately wiped and only onClear is fired
         *
         */
        clearAsDeselect: true,
        /**
         * @property {Boolean}
         * Flag that control the firing of action events: onSelect, onDeselect, onClear
         */
        _fireEvents: true,
        /**
         * Initializes the selections to be empty and mixes the passed object overriding any default properties.
         * @param {Object} options The object to be mixed in.
         */
        constructor: function(options) {
            this.selections = {};

            lang.mixin(this, options);
        },
        /**
         * Prevents the firing of action events: onSelect, onDeselect, onClear
         */
        suspendEvents: function() {
            this._fireEvents = false;
        },
        /**
         * Enables the firing of action events:  onSelect, onDeselect, onClear
         */
        resumeEvents: function() {
            this._fireEvents = true;
        },
        /**
         * Event that happens when an item is selected/added.
         * @param {String} key Unique identifier string
         * @param {Object} data The item stored
         * @param tag
         * @param self
         * @template
         */
        onSelect: function(key, data, tag, self) {
        },
        /**
         * Event that happens when an item is deselected/removed.
         * @param {String} key Unique identifier string
         * @param {Object} data The item removed
         * @param tag
         * @param self
         * @template
         */
        onDeselect: function(key, data, tag, self) {
        },
        /**
         * Event that happens when the store is cleared
         * @param self
         */
        onClear: function(self) {
        },
        /**
         * Adds an item to the `selections` if it is not already stored.
         * @param {String} key Unique identifier string
         * @param {Object} data The item being selected
         * @param tag
         */
        select: function(key, data, tag) {
            if (!this.selections.hasOwnProperty(key)) {
                this.selections[key] = {data: data, tag: tag};
                this.count++;
                if (this._fireEvents) {
                    this.onSelect(key, data, tag, this);
                }
            }
        },
        /**
         * Adds an item to the `selections` if it is not already stored, if it is
         * stored, then it deselects (removes) the item.
         * @param {String} key Unique identifier string
         * @param {Object} data The item being selected
         * @param tag
         */
        toggle: function(key, data, tag) {
            if (this.isSelected(key)) {
                this.deselect(key);
            } else {
                this.select(key, data, tag);
            }
        },
        /**
         * Removes an item from the store
         * @param {String} key Unique identifier string that was given when the item was added
         */
        deselect: function(key) {
            if (this.requireSelection && this.count === 1) {
                window.alert(this.requireSelectionText);
                return;
            }

            if (this.selections.hasOwnProperty(key)) {
                var selection = this.selections[key];

                delete this.selections[key];
                this.count--;

                if (this._fireEvents) {
                    this.onDeselect(key, selection.data, selection.tag, this);
                }
            }
        },
        /**
         * Removes all items from the store
         */
        clear: function() {
            var original, key;

            original = this.requireSelection;

            if (this.clearAsDeselect) {
                this.requireSelection = false;
                for (key in this.selections) {
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
        },
        /**
         * Determines if the given key is in the selections collection.
         * @param {String} key Unique identifier string that was given when the item was added
         * @return {Boolean} True if the item is in the store.
         */
        isSelected: function(key) {
            return !!this.selections[key];
        },
        /**
         * Returns the number of items in the store
         * @return {Number} Current count of items
         */
        getSelectionCount: function() {
            return this.count;
        },
        /**
         * Returns all items in the store
         * @return {Object} The entire selection collection
         */
        getSelections: function() {
            return this.selections;
        },
        /**
         * Returns a list of unique identifier keys used in the selection collection
         * @return {String[]} All keys in the store
         */
        getSelectedKeys: function() {
            var keys,
                key;

            keys = [];
            for (key in this.selections) {
                if (this.selections.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }

            return keys;
        }
    });

    lang.setObject('Sage.Platform.Mobile.SelectionModel', __class);
    return __class;
});
