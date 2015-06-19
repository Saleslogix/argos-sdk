define(["require", "exports", 'dojo/_base/declare', 'dojo/_base/lang', './LookupField', '../FieldManager'], function (require, exports, declare, lang, LookupField, FieldManager) {
    /**
     * @class argos.Fields.SelectField
     * The SelectField is a minor extension to te LookupField in that it explicitly hides search and actions.
     *
     * It may also optionally pass the `data` option which a view may optionally use instead of requesting data.
     *
     * ###Example:
     *     {
     *         name: 'State',
     *         property: 'State',
     *         label: this.stateText,
     *         type: 'select',
     *         view: 'state_list'
     *     }
     *
     * @alternateClassName SelectField
     * @extends argos.Fields.LookupField
     * @requires argos.FieldManager
     */
    var control = declare('argos.Fields.SelectField', [LookupField], {
        /**
         * @property {Boolean}
         * Overrides the {@link LookupField LookupField} default to explicitly set it to false forcing
         * the view to use the currentValue instead of a key/descriptor
         */
        valueKeyProperty: false,
        /**
         * @property {Boolean}
         * Overrides the {@link LookupField LookupField} default to explicitly set it to false forcing
         * the view to use the currentValue instead of a key/descriptor
         */
        valueTextProperty: false,
        /**
         * @property {Object/Object[]/Function}
         * If defined will be expanded (if function) and passed in the navigation options to the lookup view
         */
        data: null,
        /**
         * Overides the {@link LookupField#createNavigationOptions parent implementation} to set search and actions to
         * hidden and optionally pass data defined on the field.
         */
        createNavigationOptions: function () {
            var options = this.inherited(arguments);
            options.hideSearch = true;
            options.enableActions = false;
            options.data = this.expandExpression(this.data);
            return options;
        }
    });
    lang.setObject('Sage.Platform.Mobile.Fields.SelectField', control);
    return FieldManager.register('select', control);
});
