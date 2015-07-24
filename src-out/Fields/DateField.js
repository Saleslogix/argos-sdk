define('argos/Fields/DateField', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', 'dojo/dom-class', '../Format', '../FieldManager', './EditorField', 'moment', '../Calendar'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoString, _dojoDomClass, _Format, _FieldManager, _EditorField, _moment, _Calendar) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
     *
     * Licensed under the Apache License, Version 2.0 (the "License");
     * you may not use this file except in compliance with the License.
     * You may obtain a copy of the License at
     *
     *     http://www.apache.org/licenses/LICENSE-2.0
     *
     * Unless required by applicable law or agreed to in writing, software
     * distributed under the License is distributed on an "AS IS" BASIS,
     * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
     * See the License for the specific language governing permissions and
     * limitations under the License.
     */

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _string = _interopRequireDefault(_dojoString);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _format = _interopRequireDefault(_Format);

    var _FieldManager2 = _interopRequireDefault(_FieldManager);

    var _EditorField2 = _interopRequireDefault(_EditorField);

    var _moment2 = _interopRequireDefault(_moment);

    /**
     * @class argos.Fields.DateField
     * The DateField is an extension of the {@link EditorField EditorField} by accepting Date Objects
     * for values and using the {@link Calendar Calendar} view for user input.
     *
     * ###Example
     *
     *     {
     *         name: 'StartDate',
     *         property: 'StartDate',
     *         label: this.startDateText,
     *         type: 'date',
     *         dateFormatText: 'MM/DD HH:mm:ss',
     *         showTimerPicker: true
     *     }
     *
     * @alternateClassName DateField
     * @extends argos.Fields.EditorField
     * @requires argos.Calendar
     * @requires argos.FieldManager
     * @requires argos.Format
     */
    var control = (0, _declare['default'])('argos.Fields.DateField', [_EditorField2['default']], {
        // Localization
        /**
         * @cfg {String}
         * The text shown when no value (or null/undefined) is set to the field.
         */
        emptyText: '',
        dateFormatText: 'MM/DD/YYYY',
        /**
         * @property {String}
         * The error validation message for this field.
         *
         * `${0}` => Label
         */
        invalidDateFormatErrorText: "Field '${0}' has Invalid date format.",

        /**
         * @property {Simplate}
         * Simplate that defines the fields HTML Markup
         *
         * * `$` => Field instance
         * * `$$` => Owner View instance
         *
         */
        widgetTemplate: new Simplate(['<label for="{%= $.name %}">{%: $.label %}</label>', '<button data-dojo-attach-point="triggerNode" data-action="navigateToEditView" class="button whiteButton {% if ($$.iconClass) { %} {%: $$.iconClass %}{% } %}" aria-label="{%: $.lookupLabelText %}"><span>{%: $.lookupText %}</span></button>', '<input data-dojo-attach-point="inputNode" data-dojo-attach-event="onchange:_onChange" type="text" />']),

        iconClass: 'fa fa-calendar fa-lg',

        /**
         * @property {String}
         * The target view id that will provide the user input, this should always be to set to the
         * {@link Calendar Calendars} view id.
         */
        view: 'generic_calendar',
        /**
         * @cfg {Boolean}
         * Sent as part of navigation options to {@link Calendar Calendar}, where it controls the
         * display of the hour/minute inputs.
         */
        showTimePicker: false,
        /**
         * @cfg {Boolean}
         * Used in formatted and sent as part of navigation options to {@link Calendar Calendar},
         * where it controls the the conversion to/from UTC and setting the hour:min:sec to 00:00:05.
         */
        timeless: false,

        /**
         * Takes a date object and calls {@link format#date format.date} passing the current
         * `dateFormatText` and `timeless` values, formatting the date into a string representation.
         * @param {Date} value Date to be converted
         * @return {String}
         */
        formatValue: function formatValue(value) {
            return _format['default'].date(value, this.dateFormatText, this.timeless);
        },
        /**
         * When a value changes it checks that the text in the input field matches the defined
         * `dateFormatText` by using it to parse it back into a Date Object. If this succeeds then
         * sets the current value to the Date object and removes any validation warnings. If it
         * doesn't then current value is empties and the validation styling is added.
         * @param {Event} evt Event that caused change to fire.
         */
        _onChange: function _onChange(evt) {
            var val = (0, _moment2['default'])(this.inputNode.value, this.dateFormatText).toDate();

            if (val) {
                this.validationValue = this.currentValue = val;
                _domClass['default'].remove(this.containerNode, 'row-error'); // todo: not the right spot for this, add validation eventing
            } else {
                    this.validationValue = this.currentValue = null;
                    _domClass['default'].add(this.containerNode, 'row-error'); // todo: not the right spot for this, add validation eventing
                }
        },
        /**
         * Extends the parent {@link EditorField#createNavigationOptions createNavigationOptions} to
         * also include the properties `date`, `showTimePicker` and `timeless` with `date` being the current value
         * @return {Object} Navigation options
         */
        createNavigationOptions: function createNavigationOptions() {
            var options = this.inherited(arguments);

            options.date = this.currentValue;
            options.showTimePicker = this.showTimePicker;
            options.timeless = this.timeless;

            return options;
        },
        /**
         * Retrieves the date from the {@link Calendar#getDateTime Calendar} view and sets it to currentValue.
         */
        getValuesFromView: function getValuesFromView() {
            var view = App.getPrimaryActiveView();
            if (view) {
                this.currentValue = this.validationValue = view.getDateTime();
                _domClass['default'].remove(this.containerNode, 'row-error'); // todo: not the right spot for this, add validation eventing
            }
        },
        /**
         * Determines if the current value has been modified from the original value.
         * @return {Boolean}
         */
        isDirty: function isDirty() {
            return this.originalValue instanceof Date && this.currentValue instanceof Date ? this.originalValue.getTime() !== this.currentValue.getTime() : this.originalValue !== this.currentValue;
        },
        /**
         * Extends the parent {@link EditorField#clearValue clearValue} to also include removing the
         * error validation styling.
         */
        clearValue: function clearValue() {
            this.inherited(arguments);
            _domClass['default'].remove(this.containerNode, 'row-error'); // todo: not the right spot for this, add validation eventing
        },
        /**
         * Extends the parent {@link EditorField#validate validate} with a check that makes sure if
         * the user has inputted a date manually into the input field that it had successfully validated
         * in the {@link #_onChange _onChange} function.
         * @return {Boolean/Object} False for no errors. True/Object for invalid.
         */
        validate: function validate() {
            if (this.inputNode.value !== '' && !this.currentValue) {
                return _string['default'].substitute(this.invalidDateFormatErrorText, [this.label]);
            }

            return this.inherited(arguments);
        }
    });

    _lang['default'].setObject('Sage.Platform.Mobile.Fields.DateField', control);
    module.exports = _FieldManager2['default'].register('date', control);
});
