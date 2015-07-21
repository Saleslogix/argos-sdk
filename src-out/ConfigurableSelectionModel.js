<<<<<<< HEAD
define('argos/ConfigurableSelectionModel', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', './SelectionModel'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _SelectionModel) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _SelectionModel2 = _interopRequireDefault(_SelectionModel);

=======
define('argos/ConfigurableSelectionModel', [
       'dojo/_base/declare',
       'dojo/_base/lang',
       './SelectionModel'
], function(
    declare,
    lang,
    SelectionModel
) {
>>>>>>> develop
    /**
     * @class argos.ConfigurableSelectionModel
     * The ConfigurableSelectionModel adds the logic to the SelectionModel to only have one item selected at a time via the `singleSelection` flag.
     * @alternateClassName ConfigurableSelectionModel
     * @extends argos.SelectionModel
     */
    var __class = (0, _declare['default'])('argos.ConfigurableSelectionModel', [_SelectionModel2['default']], {
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
<<<<<<< HEAD
        useSingleSelection: function useSingleSelection(val) {
=======
        useSingleSelection: function(val) {
>>>>>>> develop
            if (val && typeof val !== 'undefined' && val !== null) {
                this.singleSelection = true;
            } else {
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
<<<<<<< HEAD
        select: function select(key, data, tag) {
=======
        select: function(key, data, tag) {
>>>>>>> develop
            if (this.singleSelection) {
                if (!this.isSelected(key) || this.count >= 1) {
                    this.clear();
                }
            }

            this.inherited(arguments);
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.ConfigurableSelectionModel', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile.ConfigurableSelectionModel', __class);
    return __class;
>>>>>>> develop
});
