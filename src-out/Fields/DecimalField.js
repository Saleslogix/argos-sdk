define(["require", "exports", 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', './TextField', '../FieldManager', '../Utility'], function (require, exports, declare, lang, string, TextField, FieldManager, Utility) {
    /**
     * @class argos.Fields.DecimalField
     * The Decimal Field is used for inputting numbers and extends {@link TextField TextField} with:
     *
     * * hides the clear (x) button;
     * * when setting a value, it converts the decimal and thousands group separator to the localized versions; and
     * * when getting a value, it back-converts the localized punctuation into the en-US format and converts the result into a float (Number).
     *
     * ###Example:
     *     {
     *         name: 'SalesPotential',
     *         property: 'SalesPotential',
     *         label: this.salesPotentialText,
     *         type: 'decimal'
     *     }
     *
     * @alternateClassName DecimalField
     * @extends argos.Fields.TextField
     * @requires argos.FieldManager
     */
    var control = declare('argos.Fields.DecimalField', [TextField], {
        /**
         * @cfg {Number}
         * Defines how many decimal places to format when setting the value.
         */
        precision: 2,
        /**
         * @property {Boolean}
         * Disables the display of the clear (x) button inherited from {@link TextField TextField}.
         */
        enableClearButton: false,
        /**
         * Before calling the {@link TextField#setValue parent implementation} it parses the value
         * via `parseFloat`, trims the decimal place and then applies localization for the decimal
         * and thousands punctuation.
         * @param {Number/String} val Value to be set
         */
        setValue: function (val) {
            var perc;
            perc = this.getPrecision();
            val = Utility.roundNumberTo(parseFloat(val), perc);
            val = val.toFixed(perc);
            if (isNaN(val)) {
                if (perc === 0) {
                    val = '0';
                }
                else {
                    val = string.substitute('0${0}00', [Mobile.CultureInfo.numberFormat.currencyDecimalSeparator || '.']);
                }
            }
            else {
                if (perc !== 0) {
                    val = string.substitute('${0}${1}${2}', [
                        parseInt(val, 10),
                        Mobile.CultureInfo.numberFormat.currencyDecimalSeparator || '.',
                        val.substr(-perc)
                    ]);
                }
            }
            this.inherited(arguments, [val]);
        },
        /**
         * Retrieves the value from the {@link TextField#getValue parent implementation} but before
         * returning it de-converts the punctuation back to `en-US` format.
         * @return {Number}
         */
        getValue: function () {
            var value = this.inherited(arguments);
            // SData (and other functions) expect American formatted numbers
            value = value
                .replace(Mobile.CultureInfo.numberFormat.currencyGroupSeparator, '')
                .replace(Mobile.CultureInfo.numberFormat.numberGroupSeparator, '')
                .replace(Mobile.CultureInfo.numberFormat.currencyDecimalSeparator, '.')
                .replace(Mobile.CultureInfo.numberFormat.numberDecimalSeparator, '.');
            return parseFloat(value);
        },
        /**
         * Retrieves the precision the value will be formated and ronded to.
         * @return {Number}
         */
        getPrecision: function () {
            var perc;
            if (this.precision === 0) {
                perc = this.precision;
            }
            else {
                perc = this.precision || Mobile.CultureInfo.numberFormat.currencyDecimalDigits;
            }
            return perc;
        }
    });
    lang.setObject('Sage.Platform.Mobile.Fields.DecimalField', control);
    return FieldManager.register('decimal', control);
});
