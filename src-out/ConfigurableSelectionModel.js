define('argos/ConfigurableSelectionModel', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    './SelectionModel'
], function (declare, lang, SelectionModel) {
    /**
     * @class argos.ConfigurableSelectionModel
     * The ConfigurableSelectionModel adds the logic to the SelectionModel to only have one item selected at a time via the `singleSelection` flag.
     * @alternateClassName ConfigurableSelectionModel
     * @extends argos.SelectionModel
     */
    var __class = declare('argos.ConfigurableSelectionModel', [SelectionModel], {
        /**
         * @property {Boolean}
         * Flag that controls if only one item is selectable at a time. Meaning if this is true
         * then when a selection is made it first {@link SelectionModel#clear clears} the store.
         */
        singleSelection: false,
        /**
         * This function is called in Lists {@link List#beforeTransitionTo beforeTransitionTo} and
         * it is always passed the Lists navigation options `singleSelect`.
         *
         * It then sets the flag `singleSelection` to the value if the passed value.
         *
         * @param {Boolean} val The state that `singleSelection` should be in.
         */
        useSingleSelection: function (val) {
            if (val && typeof val !== 'undefined' && val !== null) {
                this.singleSelection = true;
            }
            else {
                this.singleSelection = false;
            }
        },
        /**
         * Extends the base {@link SelectionModel#select select} by first clearing out the entire
         * store if `singleSelection` is true and there are items already in the store.
         * @param {String} key Unique identifier string
         * @param {Object} data The item being selected
         * @param tag
         */
        select: function (key, data, tag) {
            if (this.singleSelection) {
                if (!this.isSelected(key) || (this.count >= 1)) {
                    this.clear();
                }
            }
            this.inherited(arguments);
        }
    });
    lang.setObject('Sage.Platform.Mobile.ConfigurableSelectionModel', __class);
    return __class;
});
