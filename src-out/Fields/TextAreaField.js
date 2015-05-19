define(["require", "exports", 'dojo/_base/declare', 'dojo/_base/lang', './TextField', '../FieldManager'], function (require, exports, declare, lang, TextField, FieldManager) {
    /**
     * @class argos.Fields.TextAreaField
     * The TextAreaField extends the base TextField by changing the input element to
     * an `<textarea>` element with a configurable amount of visible rows.
     *
     * ###Example:
     *     {
     *         name: 'Description',
     *         property: 'Description',
     *         label: this.descriptionText,
     *         type: 'textarea',
     *         rows: 6
     *     }
     *
     * @alternateClassName TextAreaField
     * @extends argos.Fields.TextField
     * @requires argos.FieldManager
     */
    var control = declare('argos.Fields.TextAreaField', [TextField], {
        /**
         * @cfg {Number}
         * Number of rows to show visually, does not constrain input.
         */
        rows: 4,
        /**
         * @property {Boolean}
         * Overrides default to hide the clear button.
         */
        enableClearButton: false,
        /**
         * @property {Simplate}
         * Simplate that defines the fields HTML Markup
         *
         * * `$` => Field instance
         * * `$$` => Owner View instance
         *
         */
        widgetTemplate: new Simplate([
            '<label for="{%= $.name %}">{%: $.label %}</label>',
            '<textarea data-dojo-attach-point="inputNode" name="{%= $.name %}" rows="{%: $.rows %}" {% if ($.readonly) { %} readonly {% } %}></textarea>'
        ]),
        setValue: function (val, initial) {
            if (val === null || typeof val === 'undefined') {
                val = '';
            }
            if (initial) {
                this.originalValue = val;
            }
            this.previousValue = false;
            this.set('inputValue', val);
        }
    });
    lang.setObject('Sage.Platform.Mobile.Fields.TextAreaField', control);
    return FieldManager.register('textarea', control);
});
