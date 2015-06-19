define(["require", "exports", 'dojo/_base/declare', 'dojo/_base/lang', './TextField', '../FieldManager'], function (require, exports, declare, lang, TextField, FieldManager) {
    /**
     * @class argos.Fields.HiddenField
     * The Hidden Field is {@link TextField TextField} but instead binds to an `<input type="hidden"`>.
     *
     * Meaning that the field will not be displayed on screen but may still store strings of text.
     *
     * ###Example:
     *     {
     *         name: 'StatusCodeKey',
     *         property: 'StatusCodeKey',
     *         type: 'hidden'
     *     }
     *
     * @alternateClassName HiddenField
     * @extends argos.Fields.TextField
     * @requires argos.FieldManager
     */
    var control = declare('argos.Fields.HiddenField', [TextField], {
        propertyTemplate: new Simplate([
            '<div style="display: none;" data-field="{%= $.name || $.property %}" data-field-type="{%= $.type %}">',
            '</div>'
        ]),
        /**
         * @property {Simplate}
         * Simplate that defines the fields HTML Markup
         *
         * * `$` => Field instance
         * * `$$` => Owner View instance
         *
         */
        widgetTemplate: new Simplate([
            '<input data-dojo-attach-point="inputNode" type="hidden">'
        ]),
        /**
         * @deprecated
         */
        bind: function () {
            // call field's bind. we don't want event handlers for this.
            this.inherited(arguments);
        }
    });
    lang.setObject('Sage.Platform.Mobile.Fields.HiddenField', control);
    return FieldManager.register('hidden', control);
});
