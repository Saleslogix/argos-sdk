/// <amd-dependency path="dojo/sniff" />
define(["require", "exports", 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/has', '../FieldManager', './TextField', '../Format', "dojo/sniff"], function (require, exports, declare, lang, has, FieldManager, TextField, format) {
    /**
     * @class argos.Fields.PhoneField
     * The Phone field is a specialized {@link TextField TextField} that takes a string of numbers
     * and groups them into a phone number on blur or when setting a value directly the value
     * shown to the user gets passed through the
     * {@link #formatNumberForDisplay formatNumberForDisplay} function, while
     * {@link #getValue getValue} will still return an unformatted version.
     *
     * ###Example:
     *     {
     *         name: 'SalesPotential',
     *         property: 'SalesPotential',
     *         label: this.salesPotentialText,
     *         type: 'decimal'
     *     }
     *
     * @alternateClassName PhoneField
     * @extends argos.Fields.TextField
     * @requires argos.FieldManager
     */
    var control = declare('argos.Fields.PhoneField', [TextField], {
        /**
         * @property {String}
         * Sets the `<input type=` of the field.
         *
         * Currently only iOS supports non-numbers when a tel field has a default value: [Bug Report](http://code.google.com/p/android/issues/detail?id=19724).
         */
        inputType: has('safari') ? 'tel' : 'text',
        /**
         * Formats the displayed value (inputNode value) using {@link format.phone format.phone}.
         */
        _onBlur: function () {
            this.inherited(arguments);
            // temporarily added: http://code.google.com/p/android/issues/detail?id=14519
            this.set('inputValue', format.phone(this.inputNode.value));
        },
        /**
         * Gets the value and strips out non-numbers and non-letter `x` before returning unless
         * the value starts with `+` in which it is returned unmodified.
         * @return {String}
         */
        getValue: function () {
            var value = this.inherited(arguments);
            if (/^\+/.test(value)) {
                return value;
            }
            value = format.alphaToPhoneNumeric(value);
            return value.replace(/[^0-9x]/ig, '');
        },
        /**
         * Sets the original value if initial is true and sets the input value to the formatted
         * value using {@link format.phone format.phone}.
         * @param {String/Number} val String to set
         * @param {Boolean} initial True if the value is the original/clean value.
         */
        setValue: function (val, initial) {
            if (initial) {
                this.originalValue = val;
            }
            this.previousValue = false;
            this.set('inputValue', format.phone(val) || '');
        },
        /**
         * Currently only calls parent implementation due to an [Android Bug](http://code.google.com/p/android/issues/detail?id=14519).
         * @param {Event} evt Keyup event
         */
        _onKeyUp: function (evt) {
            /*
            // temporarily removed: http://code.google.com/p/android/issues/detail?id=14519
            this.set('inputValue', format.phone(this.inputNode.value, this.getValue()));
            */
            this.inherited(arguments);
        }
    });
    lang.setObject('Sage.Platform.Mobile.Fields.PhoneField', control);
    return FieldManager.register('phone', control);
});
