<<<<<<< HEAD
define('argos/SelectionModel', ['exports', 'module', 'dojo/_base/lang', 'dojo/_base/declare'], function (exports, module, _dojo_baseLang, _dojo_baseDeclare) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _declare = _interopRequireDefault(_dojo_baseDeclare);
=======
define('argos/SelectionModel', [
       'dojo/_base/lang',
       'dojo/_base/declare'
], function(
    lang,
    declare
) {
>>>>>>> develop

    /**
     * @class argos.SelectionModel
     * SelectionModel provides a simple in-memory store for data that fires events
     * when a item is selected (added) or deselected (removed)
     * @alternateClassName SelectionModel
     */
    var __class = (0, _declare['default'])('argos.SelectionModel', null, {
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
<<<<<<< HEAD
        constructor: function constructor(options) {
            this.selections = {};

            _lang['default'].mixin(this, options);
=======
        constructor: function(options) {
            this.selections = {};

            lang.mixin(this, options);
>>>>>>> develop
        },
        /**
         * Prevents the firing of action events: onSelect, onDeselect, onClear
         */
<<<<<<< HEAD
        suspendEvents: function suspendEvents() {
=======
        suspendEvents: function() {
>>>>>>> develop
            this._fireEvents = false;
        },
        /**
         * Enables the firing of action events:  onSelect, onDeselect, onClear
         */
<<<<<<< HEAD
        resumeEvents: function resumeEvents() {
=======
        resumeEvents: function() {
>>>>>>> develop
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
<<<<<<< HEAD
        onSelect: function onSelect(key, data, tag, self) {},
=======
        onSelect: function(key, data, tag, self) {
        },
>>>>>>> develop
        /**
         * Event that happens when an item is deselected/removed.
         * @param {String} key Unique identifier string
         * @param {Object} data The item removed
         * @param tag
         * @param self
         * @template
         */
<<<<<<< HEAD
        onDeselect: function onDeselect(key, data, tag, self) {},
=======
        onDeselect: function(key, data, tag, self) {
        },
>>>>>>> develop
        /**
         * Event that happens when the store is cleared
         * @param self
         */
<<<<<<< HEAD
        onClear: function onClear(self) {},
=======
        onClear: function(self) {
        },
>>>>>>> develop
        /**
         * Adds an item to the `selections` if it is not already stored.
         * @param {String} key Unique identifier string
         * @param {Object} data The item being selected
         * @param tag
         */
<<<<<<< HEAD
        select: function select(key, data, tag) {
=======
        select: function(key, data, tag) {
>>>>>>> develop
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
<<<<<<< HEAD
        toggle: function toggle(key, data, tag) {
=======
        toggle: function(key, data, tag) {
>>>>>>> develop
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
<<<<<<< HEAD
        deselect: function deselect(key) {
=======
        deselect: function(key) {
>>>>>>> develop
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
<<<<<<< HEAD
        clear: function clear() {
=======
        clear: function() {
>>>>>>> develop
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
<<<<<<< HEAD
        isSelected: function isSelected(key) {
=======
        isSelected: function(key) {
>>>>>>> develop
            return !!this.selections[key];
        },
        /**
         * Returns the number of items in the store
         * @return {Number} Current count of items
         */
<<<<<<< HEAD
        getSelectionCount: function getSelectionCount() {
=======
        getSelectionCount: function() {
>>>>>>> develop
            return this.count;
        },
        /**
         * Returns all items in the store
         * @return {Object} The entire selection collection
         */
<<<<<<< HEAD
        getSelections: function getSelections() {
=======
        getSelections: function() {
>>>>>>> develop
            return this.selections;
        },
        /**
         * Returns a list of unique identifier keys used in the selection collection
         * @return {String[]} All keys in the store
         */
<<<<<<< HEAD
        getSelectedKeys: function getSelectedKeys() {
            var keys, key;
=======
        getSelectedKeys: function() {
            var keys,
                key;
>>>>>>> develop

            keys = [];
            for (key in this.selections) {
                if (this.selections.hasOwnProperty(key)) {
                    keys.push(key);
                }
            }

            return keys;
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.SelectionModel', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile.SelectionModel', __class);
    return __class;
>>>>>>> develop
});
