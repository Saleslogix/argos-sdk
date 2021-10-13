define('argos/Fields/DateField', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/event', 'dojo/string', '../Format', '../FieldManager', './EditorField', '../DateTimePicker', '../RelativeDateTimePicker', '../I18n'], function (module, exports, _declare, _event, _string, _Format, _FieldManager, _EditorField, _DateTimePicker, _RelativeDateTimePicker, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _event2 = _interopRequireDefault(_event);

  var _string2 = _interopRequireDefault(_string);

  var _Format2 = _interopRequireDefault(_Format);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _EditorField2 = _interopRequireDefault(_EditorField);

  var _DateTimePicker2 = _interopRequireDefault(_DateTimePicker);

  var _RelativeDateTimePicker2 = _interopRequireDefault(_RelativeDateTimePicker);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('dateField'); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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

  /**
   * @module argos/Fields/DateField
   */

  var dtFormatResource = (0, _I18n2.default)('dateFieldDateTimeFormat');

  /**
   * @class
   * @alias module:argos/Fields/DateField
   * @classdesc The DateField is an extension of the {@link EditorField EditorField} by accepting Date Objects
   * for values and using the {@link Calendar Calendar} view for user input.
   *
   * @example
   *
   *     {
   *         name: 'StartDate',
   *         property: 'StartDate',
   *         label: this.startDateText,
   *         type: 'date',
   *         dateFormatText: 'MM/DD HH:mm:ss',
   *         showTimerPicker: true,
   *         showRelativeDateTime: true
   *     }
   *
   * @extends module:argos/Fields/EditorField
   */
  var control = (0, _declare2.default)('argos.Fields.DateField', [_EditorField2.default], /** @lends module:argos/Fields/DateField.prototype */{
    // Localization
    /**
     * @cfg {String}
     * The text shown when no value (or null/undefined) is set to the field.
     */
    emptyText: resource.emptyText,
    dateFormatText: dtFormatResource.dateFormatText,
    /**
     * @property {String}
     * The error validation message for this field.
     *
     * `${0}` => Label
     */
    invalidDateFormatErrorText: resource.invalidDateFormatErrorText,

    /**
     * @property {Simplate}
     * Simplate that defines the fields HTML Markup
     *
     * * `$` => Field instance
     * * `$$` => Owner View instance
     *
     */
    widgetTemplate: new Simplate(['<label for="{%= $.name %}"\n      {% if ($.required) { %}\n        class="required"\n      {% } %}>\n      {%: $.label %}\n    </label>\n    <div class="field field-control-wrapper">\n      <button\n        data-dojo-attach-point="triggerNode"\n        data-action="showModal"\n        class="button field-control-trigger whiteButton"\n        aria-label="{%: $.lookupLabelText %}">\n          <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-{%: $.iconClass %}"></use>\n          </svg>\n        </button>\n      <input\n        data-dojo-attach-point="inputNode"\n        data-dojo-attach-event="onchange:_onChange"\n        type="text"\n        {% if ($.required) { %}\n          data-validate="required"\n          class="required"\n        {% } %}\n        />\n    </div>']),
    iconClass: 'calendar',

    /**
     * @property {String}
     * The target view id that will provide the user input, this should always be to set to the
     * {@link Calendar Calendars} view id.
     */
    view: 'generic_calendar',
    /**
     * required should be true if the field requires input. Defaults to false.
     * @type {Boolean}
     */
    required: false,
    /**
     * @cfg {Boolean}
     * Sent as part of navigation options to {@link Calendar Calendar}, where it controls the
     * display of the hour/minute inputs.
     */
    showTimePicker: false,
    /**
     * @cfg {Boolean}
     * Sent as part of navigation options to {@link Calendar Calendar}, where it controls the
     * display of the relative date time picker.
     */
    showRelativeDateTime: false,
    /**
     * @cfg {Boolean}
     * Used in formatted and sent as part of navigation options to {@link Calendar Calendar},
     * where it controls the the conversion to/from UTC and setting the hour:min:sec to 00:00:05.
     */
    timeless: false,
    modal: null,
    dateTimePicker: null,
    _modalListener: null,
    /**
     * Takes a date object and calls {@link format#date format.date} passing the current
     * `dateFormatText` and `timeless` values, formatting the date into a string representation.
     * @param {Date} value Date to be converted
     * @return {String}
     */
    formatValue: function formatValue(value) {
      return _Format2.default.date(value, this.dateFormatText, this.timeless);
    },
    /**
     * When a value changes it checks that the text in the input field matches the defined
     * `dateFormatText` by using it to parse it back into a Date Object. If this succeeds then
     * sets the current value to the Date object and removes any validation warnings. If it
     * doesn't then current value is empties and the validation styling is added.
     * @param {Event} evt Event that caused change to fire.
     */
    _onChange: function _onChange() /* evt*/{
      var jsDate = new Date(this.inputNode.value);
      var date = moment(this.inputNode.value, this.dateFormatText, true);
      if (moment(jsDate).isValid() && !date.isValid()) {
        date = moment(jsDate);
      }
      var val = date.isValid();

      if (val) {
        this.validationValue = this.currentValue = date.toDate();
        if (this.inputNode.value !== date.format(this.dateFormatText)) {
          this.inputNode.value = date.format(this.dateFormatText);
        }
        $(this.containerNode).removeClass('row-error'); // todo: not the right spot for this, add validation eventing
        this.onChange(this.currentValue, this);
      } else {
        this.validationValue = this.currentValue = null;
        $(this.containerNode).addClass('row-error'); // todo: not the right spot for this, add validation eventing
      }
    },
    /**
     * Extends the parent {@link EditorField#createNavigationOptions createNavigationOptions} to
     * also include the properties `date`, `showTimePicker` and `timeless` with `date` being the current value
     * @return {Object} Navigation options
     */
    createNavigationOptions: function createNavigationOptions() {
      var options = this.inherited(createNavigationOptions, arguments);

      if (this.currentValue !== '' && this.currentValue !== null) {
        options.date = this.currentValue;
      } else {
        options.date = moment();
      }
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
        $(this.containerNode).removeClass('row-error'); // todo: not the right spot for this, add validation eventing
      }
    },
    getValuesFromModal: function getValuesFromModal() {
      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (data.calendar.selectedDateMoment) {
        // This is the case where the DateTimePicker was used to select the date
        var date = data.calendar.selectedDateMoment.clone();
        if (data.time) {
          date.hours(data.time.hours);
          date.minutes(data.time.minutes);
          date.seconds(data.time.seconds);
        }
        this.currentValue = this.validationValue = date.toDate();
        this.inputNode.value = this.formatValue(this.currentValue);
      } else {
        this.currentValue = this.validationValue = data.toDate();
        this.inputNode.value = this.formatValue(this.currentValue);
      }
      $(this.containerNode).removeClass('row-error'); // todo: not the right spot for this, add validation eventing
      this.onChange(this.currentValue, this);
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
      this.inherited(clearValue, arguments);
      $(this.containerNode).removeClass('row-error'); // todo: not the right spot for this, add validation eventing
    },
    showModal: function showModal() {
      if (this.isDisabled()) {
        return;
      }

      var options = this.createNavigationOptions();

      var toolbar = void 0;
      if (this.showRelativeDateTime && !options.timeless) {
        this.dateTimePicker = new _RelativeDateTimePicker2.default({ id: 'relative-datetime-picker-modal ' + this.id, isModal: true });
        toolbar = [{
          action: 'cancel',
          className: 'button--flat button--flat--split',
          text: resource.cancelText
        }, {
          action: this.dateTimePicker.toDateTimePicker,
          className: 'button--flat button--flat--split',
          text: resource.advancedText,
          context: this.dateTimePicker
        }];
      } else {
        this.dateTimePicker = new _DateTimePicker2.default({ id: 'datetime-picker-modal ' + this.id, isModal: true });
        toolbar = [{
          action: 'cancel',
          className: 'button--flat button--flat--split',
          text: resource.cancelText
        }, {
          action: 'resolve',
          className: 'button--flat button--flat--split',
          text: resource.confirmText
        }];
      }

      App.modal.add(this.dateTimePicker, toolbar, options).then(this.getValuesFromModal.bind(this));
    },
    _onClick: function _onClick(evt) {
      _event2.default.stop(evt);
    },
    /**
     * Extends the parent {@link EditorField#validate validate} with a check that makes sure if
     * the user has inputted a date manually into the input field that it had successfully validated
     * in the {@link #_onChange _onChange} function.
     * @return {Boolean/Object} False for no errors. True/Object for invalid.
     */
    validate: function validate() {
      if (this.inputNode.value !== '' && !this.currentValue) {
        return _string2.default.substitute(this.invalidDateFormatErrorText, [this.label]);
      }

      return this.inherited(validate, arguments);
    }
  });

  exports.default = _FieldManager2.default.register('date', control);
  module.exports = exports['default'];
});