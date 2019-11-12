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

  var dtFormatResource = (0, _I18n2.default)('dateFieldDateTimeFormat');

  /**
   * @class argos.Fields.DateField
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
   * @extends argos.Fields.EditorField
   * @requires argos.Calendar
   * @requires argos.FieldManager
   * @requires argos.Format
   */
  var control = (0, _declare2.default)('argos.Fields.DateField', [_EditorField2.default], /** @lends argos.Fields.DateField# */{
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
      var options = this.inherited(arguments);

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
      this.inherited(arguments);
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

      return this.inherited(arguments);
    }
  });

  exports.default = _FieldManager2.default.register('date', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvRGF0ZUZpZWxkLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiZHRGb3JtYXRSZXNvdXJjZSIsImNvbnRyb2wiLCJlbXB0eVRleHQiLCJkYXRlRm9ybWF0VGV4dCIsImludmFsaWREYXRlRm9ybWF0RXJyb3JUZXh0Iiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImljb25DbGFzcyIsInZpZXciLCJyZXF1aXJlZCIsInNob3dUaW1lUGlja2VyIiwic2hvd1JlbGF0aXZlRGF0ZVRpbWUiLCJ0aW1lbGVzcyIsIm1vZGFsIiwiZGF0ZVRpbWVQaWNrZXIiLCJfbW9kYWxMaXN0ZW5lciIsImZvcm1hdFZhbHVlIiwidmFsdWUiLCJkYXRlIiwiX29uQ2hhbmdlIiwianNEYXRlIiwiRGF0ZSIsImlucHV0Tm9kZSIsIm1vbWVudCIsImlzVmFsaWQiLCJ2YWwiLCJ2YWxpZGF0aW9uVmFsdWUiLCJjdXJyZW50VmFsdWUiLCJ0b0RhdGUiLCJmb3JtYXQiLCIkIiwiY29udGFpbmVyTm9kZSIsInJlbW92ZUNsYXNzIiwib25DaGFuZ2UiLCJhZGRDbGFzcyIsImNyZWF0ZU5hdmlnYXRpb25PcHRpb25zIiwib3B0aW9ucyIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsImdldFZhbHVlc0Zyb21WaWV3IiwiQXBwIiwiZ2V0UHJpbWFyeUFjdGl2ZVZpZXciLCJnZXREYXRlVGltZSIsImdldFZhbHVlc0Zyb21Nb2RhbCIsImRhdGEiLCJjYWxlbmRhciIsInNlbGVjdGVkRGF0ZU1vbWVudCIsImNsb25lIiwidGltZSIsImhvdXJzIiwibWludXRlcyIsInNlY29uZHMiLCJpc0RpcnR5Iiwib3JpZ2luYWxWYWx1ZSIsImdldFRpbWUiLCJjbGVhclZhbHVlIiwic2hvd01vZGFsIiwiaXNEaXNhYmxlZCIsInRvb2xiYXIiLCJpZCIsImlzTW9kYWwiLCJhY3Rpb24iLCJjbGFzc05hbWUiLCJ0ZXh0IiwiY2FuY2VsVGV4dCIsInRvRGF0ZVRpbWVQaWNrZXIiLCJhZHZhbmNlZFRleHQiLCJjb250ZXh0IiwiY29uZmlybVRleHQiLCJhZGQiLCJ0aGVuIiwiYmluZCIsIl9vbkNsaWNrIiwiZXZ0Iiwic3RvcCIsInZhbGlkYXRlIiwic3Vic3RpdHV0ZSIsImxhYmVsIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLE1BQU1BLFdBQVcsb0JBQVksV0FBWixDQUFqQixDLENBMUJBOzs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsTUFBTUMsbUJBQW1CLG9CQUFZLHlCQUFaLENBQXpCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLE1BQU1DLFVBQVUsdUJBQVEsd0JBQVIsRUFBa0MsdUJBQWxDLEVBQWlELHFDQUFxQztBQUNwRztBQUNBOzs7O0FBSUFDLGVBQVdILFNBQVNHLFNBTmdGO0FBT3BHQyxvQkFBZ0JILGlCQUFpQkcsY0FQbUU7QUFRcEc7Ozs7OztBQU1BQyxnQ0FBNEJMLFNBQVNLLDBCQWQrRDs7QUFnQnBHOzs7Ozs7OztBQVFBQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLHMzQkFBYixDQXhCb0Y7QUFvRHBHQyxlQUFXLFVBcER5Rjs7QUFzRHBHOzs7OztBQUtBQyxVQUFNLGtCQTNEOEY7QUE0RHBHOzs7O0FBSUFDLGNBQVUsS0FoRTBGO0FBaUVwRzs7Ozs7QUFLQUMsb0JBQWdCLEtBdEVvRjtBQXVFcEc7Ozs7O0FBS0FDLDBCQUFzQixLQTVFOEU7QUE2RXBHOzs7OztBQUtBQyxjQUFVLEtBbEYwRjtBQW1GcEdDLFdBQU8sSUFuRjZGO0FBb0ZwR0Msb0JBQWdCLElBcEZvRjtBQXFGcEdDLG9CQUFnQixJQXJGb0Y7QUFzRnBHOzs7Ozs7QUFNQUMsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQkMsS0FBckIsRUFBNEI7QUFDdkMsYUFBTyxpQkFBT0MsSUFBUCxDQUFZRCxLQUFaLEVBQW1CLEtBQUtkLGNBQXhCLEVBQXdDLEtBQUtTLFFBQTdDLENBQVA7QUFDRCxLQTlGbUc7QUErRnBHOzs7Ozs7O0FBT0FP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QUFtRCxDQUFDLEtBQUt5RSxLQUFOLENBQW5ELENBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQUt4QyxTQUFMLENBQWVDLFNBQWYsQ0FBUDtBQUNEO0FBN09tRyxHQUF0RixDQUFoQjs7b0JBZ1BlLHVCQUFhd0MsUUFBYixDQUFzQixNQUF0QixFQUE4QjdFLE9BQTlCLEMiLCJmaWxlIjoiRGF0ZUZpZWxkLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgZXZlbnQgZnJvbSAnZG9qby9fYmFzZS9ldmVudCc7XHJcbmltcG9ydCBzdHJpbmcgZnJvbSAnZG9qby9zdHJpbmcnO1xyXG5pbXBvcnQgZm9ybWF0IGZyb20gJy4uL0Zvcm1hdCc7XHJcbmltcG9ydCBGaWVsZE1hbmFnZXIgZnJvbSAnLi4vRmllbGRNYW5hZ2VyJztcclxuaW1wb3J0IEVkaXRvckZpZWxkIGZyb20gJy4vRWRpdG9yRmllbGQnO1xyXG5pbXBvcnQgRGF0ZVRpbWVQaWNrZXIgZnJvbSAnLi4vRGF0ZVRpbWVQaWNrZXInO1xyXG5pbXBvcnQgUmVsYXRpdmVEYXRlVGltZVBpY2tlciBmcm9tICcuLi9SZWxhdGl2ZURhdGVUaW1lUGlja2VyJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4uL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ2RhdGVGaWVsZCcpO1xyXG5jb25zdCBkdEZvcm1hdFJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ2RhdGVGaWVsZERhdGVUaW1lRm9ybWF0Jyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkZpZWxkcy5EYXRlRmllbGRcclxuICogQGNsYXNzZGVzYyBUaGUgRGF0ZUZpZWxkIGlzIGFuIGV4dGVuc2lvbiBvZiB0aGUge0BsaW5rIEVkaXRvckZpZWxkIEVkaXRvckZpZWxkfSBieSBhY2NlcHRpbmcgRGF0ZSBPYmplY3RzXHJcbiAqIGZvciB2YWx1ZXMgYW5kIHVzaW5nIHRoZSB7QGxpbmsgQ2FsZW5kYXIgQ2FsZW5kYXJ9IHZpZXcgZm9yIHVzZXIgaW5wdXQuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqXHJcbiAqICAgICB7XHJcbiAqICAgICAgICAgbmFtZTogJ1N0YXJ0RGF0ZScsXHJcbiAqICAgICAgICAgcHJvcGVydHk6ICdTdGFydERhdGUnLFxyXG4gKiAgICAgICAgIGxhYmVsOiB0aGlzLnN0YXJ0RGF0ZVRleHQsXHJcbiAqICAgICAgICAgdHlwZTogJ2RhdGUnLFxyXG4gKiAgICAgICAgIGRhdGVGb3JtYXRUZXh0OiAnTU0vREQgSEg6bW06c3MnLFxyXG4gKiAgICAgICAgIHNob3dUaW1lclBpY2tlcjogdHJ1ZSxcclxuICogICAgICAgICBzaG93UmVsYXRpdmVEYXRlVGltZTogdHJ1ZVxyXG4gKiAgICAgfVxyXG4gKlxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5GaWVsZHMuRWRpdG9yRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkNhbGVuZGFyXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZE1hbmFnZXJcclxuICogQHJlcXVpcmVzIGFyZ29zLkZvcm1hdFxyXG4gKi9cclxuY29uc3QgY29udHJvbCA9IGRlY2xhcmUoJ2FyZ29zLkZpZWxkcy5EYXRlRmllbGQnLCBbRWRpdG9yRmllbGRdLCAvKiogQGxlbmRzIGFyZ29zLkZpZWxkcy5EYXRlRmllbGQjICove1xyXG4gIC8vIExvY2FsaXphdGlvblxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBzaG93biB3aGVuIG5vIHZhbHVlIChvciBudWxsL3VuZGVmaW5lZCkgaXMgc2V0IHRvIHRoZSBmaWVsZC5cclxuICAgKi9cclxuICBlbXB0eVRleHQ6IHJlc291cmNlLmVtcHR5VGV4dCxcclxuICBkYXRlRm9ybWF0VGV4dDogZHRGb3JtYXRSZXNvdXJjZS5kYXRlRm9ybWF0VGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgZXJyb3IgdmFsaWRhdGlvbiBtZXNzYWdlIGZvciB0aGlzIGZpZWxkLlxyXG4gICAqXHJcbiAgICogYCR7MH1gID0+IExhYmVsXHJcbiAgICovXHJcbiAgaW52YWxpZERhdGVGb3JtYXRFcnJvclRleHQ6IHJlc291cmNlLmludmFsaWREYXRlRm9ybWF0RXJyb3JUZXh0LFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFNpbXBsYXRlIHRoYXQgZGVmaW5lcyB0aGUgZmllbGRzIEhUTUwgTWFya3VwXHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBGaWVsZCBpbnN0YW5jZVxyXG4gICAqICogYCQkYCA9PiBPd25lciBWaWV3IGluc3RhbmNlXHJcbiAgICpcclxuICAgKi9cclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgIGA8bGFiZWwgZm9yPVwieyU9ICQubmFtZSAlfVwiXHJcbiAgICAgIHslIGlmICgkLnJlcXVpcmVkKSB7ICV9XHJcbiAgICAgICAgY2xhc3M9XCJyZXF1aXJlZFwiXHJcbiAgICAgIHslIH0gJX0+XHJcbiAgICAgIHslOiAkLmxhYmVsICV9XHJcbiAgICA8L2xhYmVsPlxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkIGZpZWxkLWNvbnRyb2wtd3JhcHBlclwiPlxyXG4gICAgICA8YnV0dG9uXHJcbiAgICAgICAgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRyaWdnZXJOb2RlXCJcclxuICAgICAgICBkYXRhLWFjdGlvbj1cInNob3dNb2RhbFwiXHJcbiAgICAgICAgY2xhc3M9XCJidXR0b24gZmllbGQtY29udHJvbC10cmlnZ2VyIHdoaXRlQnV0dG9uXCJcclxuICAgICAgICBhcmlhLWxhYmVsPVwieyU6ICQubG9va3VwTGFiZWxUZXh0ICV9XCI+XHJcbiAgICAgICAgICA8c3ZnIGNsYXNzPVwiaWNvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgICAgICA8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhsaW5rOmhyZWY9XCIjaWNvbi17JTogJC5pY29uQ2xhc3MgJX1cIj48L3VzZT5cclxuICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8aW5wdXRcclxuICAgICAgICBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiaW5wdXROb2RlXCJcclxuICAgICAgICBkYXRhLWRvam8tYXR0YWNoLWV2ZW50PVwib25jaGFuZ2U6X29uQ2hhbmdlXCJcclxuICAgICAgICB0eXBlPVwidGV4dFwiXHJcbiAgICAgICAgeyUgaWYgKCQucmVxdWlyZWQpIHsgJX1cclxuICAgICAgICAgIGRhdGEtdmFsaWRhdGU9XCJyZXF1aXJlZFwiXHJcbiAgICAgICAgICBjbGFzcz1cInJlcXVpcmVkXCJcclxuICAgICAgICB7JSB9ICV9XHJcbiAgICAgICAgLz5cclxuICAgIDwvZGl2PmAsXHJcbiAgXSksXHJcbiAgaWNvbkNsYXNzOiAnY2FsZW5kYXInLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdGFyZ2V0IHZpZXcgaWQgdGhhdCB3aWxsIHByb3ZpZGUgdGhlIHVzZXIgaW5wdXQsIHRoaXMgc2hvdWxkIGFsd2F5cyBiZSB0byBzZXQgdG8gdGhlXHJcbiAgICoge0BsaW5rIENhbGVuZGFyIENhbGVuZGFyc30gdmlldyBpZC5cclxuICAgKi9cclxuICB2aWV3OiAnZ2VuZXJpY19jYWxlbmRhcicsXHJcbiAgLyoqXHJcbiAgICogcmVxdWlyZWQgc2hvdWxkIGJlIHRydWUgaWYgdGhlIGZpZWxkIHJlcXVpcmVzIGlucHV0LiBEZWZhdWx0cyB0byBmYWxzZS5cclxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cclxuICAgKi9cclxuICByZXF1aXJlZDogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7Qm9vbGVhbn1cclxuICAgKiBTZW50IGFzIHBhcnQgb2YgbmF2aWdhdGlvbiBvcHRpb25zIHRvIHtAbGluayBDYWxlbmRhciBDYWxlbmRhcn0sIHdoZXJlIGl0IGNvbnRyb2xzIHRoZVxyXG4gICAqIGRpc3BsYXkgb2YgdGhlIGhvdXIvbWludXRlIGlucHV0cy5cclxuICAgKi9cclxuICBzaG93VGltZVBpY2tlcjogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7Qm9vbGVhbn1cclxuICAgKiBTZW50IGFzIHBhcnQgb2YgbmF2aWdhdGlvbiBvcHRpb25zIHRvIHtAbGluayBDYWxlbmRhciBDYWxlbmRhcn0sIHdoZXJlIGl0IGNvbnRyb2xzIHRoZVxyXG4gICAqIGRpc3BsYXkgb2YgdGhlIHJlbGF0aXZlIGRhdGUgdGltZSBwaWNrZXIuXHJcbiAgICovXHJcbiAgc2hvd1JlbGF0aXZlRGF0ZVRpbWU6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge0Jvb2xlYW59XHJcbiAgICogVXNlZCBpbiBmb3JtYXR0ZWQgYW5kIHNlbnQgYXMgcGFydCBvZiBuYXZpZ2F0aW9uIG9wdGlvbnMgdG8ge0BsaW5rIENhbGVuZGFyIENhbGVuZGFyfSxcclxuICAgKiB3aGVyZSBpdCBjb250cm9scyB0aGUgdGhlIGNvbnZlcnNpb24gdG8vZnJvbSBVVEMgYW5kIHNldHRpbmcgdGhlIGhvdXI6bWluOnNlYyB0byAwMDowMDowNS5cclxuICAgKi9cclxuICB0aW1lbGVzczogZmFsc2UsXHJcbiAgbW9kYWw6IG51bGwsXHJcbiAgZGF0ZVRpbWVQaWNrZXI6IG51bGwsXHJcbiAgX21vZGFsTGlzdGVuZXI6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgYSBkYXRlIG9iamVjdCBhbmQgY2FsbHMge0BsaW5rIGZvcm1hdCNkYXRlIGZvcm1hdC5kYXRlfSBwYXNzaW5nIHRoZSBjdXJyZW50XHJcbiAgICogYGRhdGVGb3JtYXRUZXh0YCBhbmQgYHRpbWVsZXNzYCB2YWx1ZXMsIGZvcm1hdHRpbmcgdGhlIGRhdGUgaW50byBhIHN0cmluZyByZXByZXNlbnRhdGlvbi5cclxuICAgKiBAcGFyYW0ge0RhdGV9IHZhbHVlIERhdGUgdG8gYmUgY29udmVydGVkXHJcbiAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIGZvcm1hdFZhbHVlOiBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIGZvcm1hdC5kYXRlKHZhbHVlLCB0aGlzLmRhdGVGb3JtYXRUZXh0LCB0aGlzLnRpbWVsZXNzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFdoZW4gYSB2YWx1ZSBjaGFuZ2VzIGl0IGNoZWNrcyB0aGF0IHRoZSB0ZXh0IGluIHRoZSBpbnB1dCBmaWVsZCBtYXRjaGVzIHRoZSBkZWZpbmVkXHJcbiAgICogYGRhdGVGb3JtYXRUZXh0YCBieSB1c2luZyBpdCB0byBwYXJzZSBpdCBiYWNrIGludG8gYSBEYXRlIE9iamVjdC4gSWYgdGhpcyBzdWNjZWVkcyB0aGVuXHJcbiAgICogc2V0cyB0aGUgY3VycmVudCB2YWx1ZSB0byB0aGUgRGF0ZSBvYmplY3QgYW5kIHJlbW92ZXMgYW55IHZhbGlkYXRpb24gd2FybmluZ3MuIElmIGl0XHJcbiAgICogZG9lc24ndCB0aGVuIGN1cnJlbnQgdmFsdWUgaXMgZW1wdGllcyBhbmQgdGhlIHZhbGlkYXRpb24gc3R5bGluZyBpcyBhZGRlZC5cclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgRXZlbnQgdGhhdCBjYXVzZWQgY2hhbmdlIHRvIGZpcmUuXHJcbiAgICovXHJcbiAgX29uQ2hhbmdlOiBmdW5jdGlvbiBfb25DaGFuZ2UoLyogZXZ0Ki8pIHtcclxuICAgIGNvbnN0IGpzRGF0ZSA9IG5ldyBEYXRlKHRoaXMuaW5wdXROb2RlLnZhbHVlKTtcclxuICAgIGxldCBkYXRlID0gbW9tZW50KHRoaXMuaW5wdXROb2RlLnZhbHVlLCB0aGlzLmRhdGVGb3JtYXRUZXh0LCB0cnVlKTtcclxuICAgIGlmIChtb21lbnQoanNEYXRlKS5pc1ZhbGlkKCkgJiYgIWRhdGUuaXNWYWxpZCgpKSB7XHJcbiAgICAgIGRhdGUgPSBtb21lbnQoanNEYXRlKTtcclxuICAgIH1cclxuICAgIGNvbnN0IHZhbCA9IGRhdGUuaXNWYWxpZCgpO1xyXG5cclxuICAgIGlmICh2YWwpIHtcclxuICAgICAgdGhpcy52YWxpZGF0aW9uVmFsdWUgPSB0aGlzLmN1cnJlbnRWYWx1ZSA9IGRhdGUudG9EYXRlKCk7XHJcbiAgICAgIGlmICh0aGlzLmlucHV0Tm9kZS52YWx1ZSAhPT0gZGF0ZS5mb3JtYXQodGhpcy5kYXRlRm9ybWF0VGV4dCkpIHtcclxuICAgICAgICB0aGlzLmlucHV0Tm9kZS52YWx1ZSA9IGRhdGUuZm9ybWF0KHRoaXMuZGF0ZUZvcm1hdFRleHQpO1xyXG4gICAgICB9XHJcbiAgICAgICQodGhpcy5jb250YWluZXJOb2RlKS5yZW1vdmVDbGFzcygncm93LWVycm9yJyk7IC8vIHRvZG86IG5vdCB0aGUgcmlnaHQgc3BvdCBmb3IgdGhpcywgYWRkIHZhbGlkYXRpb24gZXZlbnRpbmdcclxuICAgICAgdGhpcy5vbkNoYW5nZSh0aGlzLmN1cnJlbnRWYWx1ZSwgdGhpcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnZhbGlkYXRpb25WYWx1ZSA9IHRoaXMuY3VycmVudFZhbHVlID0gbnVsbDtcclxuICAgICAgJCh0aGlzLmNvbnRhaW5lck5vZGUpLmFkZENsYXNzKCdyb3ctZXJyb3InKTsgLy8gdG9kbzogbm90IHRoZSByaWdodCBzcG90IGZvciB0aGlzLCBhZGQgdmFsaWRhdGlvbiBldmVudGluZ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgcGFyZW50IHtAbGluayBFZGl0b3JGaWVsZCNjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyBjcmVhdGVOYXZpZ2F0aW9uT3B0aW9uc30gdG9cclxuICAgKiBhbHNvIGluY2x1ZGUgdGhlIHByb3BlcnRpZXMgYGRhdGVgLCBgc2hvd1RpbWVQaWNrZXJgIGFuZCBgdGltZWxlc3NgIHdpdGggYGRhdGVgIGJlaW5nIHRoZSBjdXJyZW50IHZhbHVlXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOYXZpZ2F0aW9uIG9wdGlvbnNcclxuICAgKi9cclxuICBjcmVhdGVOYXZpZ2F0aW9uT3B0aW9uczogZnVuY3Rpb24gY3JlYXRlTmF2aWdhdGlvbk9wdGlvbnMoKSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50VmFsdWUgIT09ICcnICYmIHRoaXMuY3VycmVudFZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgIG9wdGlvbnMuZGF0ZSA9IHRoaXMuY3VycmVudFZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3B0aW9ucy5kYXRlID0gbW9tZW50KCk7XHJcbiAgICB9XHJcbiAgICBvcHRpb25zLnNob3dUaW1lUGlja2VyID0gdGhpcy5zaG93VGltZVBpY2tlcjtcclxuICAgIG9wdGlvbnMudGltZWxlc3MgPSB0aGlzLnRpbWVsZXNzO1xyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIHRoZSBkYXRlIGZyb20gdGhlIHtAbGluayBDYWxlbmRhciNnZXREYXRlVGltZSBDYWxlbmRhcn0gdmlldyBhbmQgc2V0cyBpdCB0byBjdXJyZW50VmFsdWUuXHJcbiAgICovXHJcbiAgZ2V0VmFsdWVzRnJvbVZpZXc6IGZ1bmN0aW9uIGdldFZhbHVlc0Zyb21WaWV3KCkge1xyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRQcmltYXJ5QWN0aXZlVmlldygpO1xyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB0aGlzLnZhbGlkYXRpb25WYWx1ZSA9IHZpZXcuZ2V0RGF0ZVRpbWUoKTtcclxuICAgICAgJCh0aGlzLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctZXJyb3InKTsgLy8gdG9kbzogbm90IHRoZSByaWdodCBzcG90IGZvciB0aGlzLCBhZGQgdmFsaWRhdGlvbiBldmVudGluZ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2V0VmFsdWVzRnJvbU1vZGFsOiBmdW5jdGlvbiBnZXRWYWx1ZXNGcm9tTW9kYWwoZGF0YSA9IHt9KSB7XHJcbiAgICBpZiAoZGF0YS5jYWxlbmRhci5zZWxlY3RlZERhdGVNb21lbnQpIHtcclxuICAgICAgLy8gVGhpcyBpcyB0aGUgY2FzZSB3aGVyZSB0aGUgRGF0ZVRpbWVQaWNrZXIgd2FzIHVzZWQgdG8gc2VsZWN0IHRoZSBkYXRlXHJcbiAgICAgIGNvbnN0IGRhdGUgPSBkYXRhLmNhbGVuZGFyLnNlbGVjdGVkRGF0ZU1vbWVudC5jbG9uZSgpO1xyXG4gICAgICBpZiAoZGF0YS50aW1lKSB7XHJcbiAgICAgICAgZGF0ZS5ob3VycyhkYXRhLnRpbWUuaG91cnMpO1xyXG4gICAgICAgIGRhdGUubWludXRlcyhkYXRhLnRpbWUubWludXRlcyk7XHJcbiAgICAgICAgZGF0ZS5zZWNvbmRzKGRhdGEudGltZS5zZWNvbmRzKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHRoaXMudmFsaWRhdGlvblZhbHVlID0gZGF0ZS50b0RhdGUoKTtcclxuICAgICAgdGhpcy5pbnB1dE5vZGUudmFsdWUgPSB0aGlzLmZvcm1hdFZhbHVlKHRoaXMuY3VycmVudFZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gdGhpcy52YWxpZGF0aW9uVmFsdWUgPSBkYXRhLnRvRGF0ZSgpO1xyXG4gICAgICB0aGlzLmlucHV0Tm9kZS52YWx1ZSA9IHRoaXMuZm9ybWF0VmFsdWUodGhpcy5jdXJyZW50VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgJCh0aGlzLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctZXJyb3InKTsgLy8gdG9kbzogbm90IHRoZSByaWdodCBzcG90IGZvciB0aGlzLCBhZGQgdmFsaWRhdGlvbiBldmVudGluZ1xyXG4gICAgdGhpcy5vbkNoYW5nZSh0aGlzLmN1cnJlbnRWYWx1ZSwgdGhpcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBjdXJyZW50IHZhbHVlIGhhcyBiZWVuIG1vZGlmaWVkIGZyb20gdGhlIG9yaWdpbmFsIHZhbHVlLlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgaXNEaXJ0eTogZnVuY3Rpb24gaXNEaXJ0eSgpIHtcclxuICAgIHJldHVybiB0aGlzLm9yaWdpbmFsVmFsdWUgaW5zdGFuY2VvZiBEYXRlICYmIHRoaXMuY3VycmVudFZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHRoaXMub3JpZ2luYWxWYWx1ZS5nZXRUaW1lKCkgIT09IHRoaXMuY3VycmVudFZhbHVlLmdldFRpbWUoKSA6IHRoaXMub3JpZ2luYWxWYWx1ZSAhPT0gdGhpcy5jdXJyZW50VmFsdWU7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSBwYXJlbnQge0BsaW5rIEVkaXRvckZpZWxkI2NsZWFyVmFsdWUgY2xlYXJWYWx1ZX0gdG8gYWxzbyBpbmNsdWRlIHJlbW92aW5nIHRoZVxyXG4gICAqIGVycm9yIHZhbGlkYXRpb24gc3R5bGluZy5cclxuICAgKi9cclxuICBjbGVhclZhbHVlOiBmdW5jdGlvbiBjbGVhclZhbHVlKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgICQodGhpcy5jb250YWluZXJOb2RlKS5yZW1vdmVDbGFzcygncm93LWVycm9yJyk7IC8vIHRvZG86IG5vdCB0aGUgcmlnaHQgc3BvdCBmb3IgdGhpcywgYWRkIHZhbGlkYXRpb24gZXZlbnRpbmdcclxuICB9LFxyXG4gIHNob3dNb2RhbDogZnVuY3Rpb24gc2hvd01vZGFsKCkge1xyXG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZCgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucygpO1xyXG5cclxuICAgIGxldCB0b29sYmFyO1xyXG4gICAgaWYgKHRoaXMuc2hvd1JlbGF0aXZlRGF0ZVRpbWUgJiYgIW9wdGlvbnMudGltZWxlc3MpIHtcclxuICAgICAgdGhpcy5kYXRlVGltZVBpY2tlciA9IG5ldyBSZWxhdGl2ZURhdGVUaW1lUGlja2VyKHsgaWQ6IGByZWxhdGl2ZS1kYXRldGltZS1waWNrZXItbW9kYWwgJHt0aGlzLmlkfWAsIGlzTW9kYWw6IHRydWUgfSk7XHJcbiAgICAgIHRvb2xiYXIgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYWN0aW9uOiAnY2FuY2VsJyxcclxuICAgICAgICAgIGNsYXNzTmFtZTogJ2J1dHRvbi0tZmxhdCBidXR0b24tLWZsYXQtLXNwbGl0JyxcclxuICAgICAgICAgIHRleHQ6IHJlc291cmNlLmNhbmNlbFRleHQsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgYWN0aW9uOiB0aGlzLmRhdGVUaW1lUGlja2VyLnRvRGF0ZVRpbWVQaWNrZXIsXHJcbiAgICAgICAgICBjbGFzc05hbWU6ICdidXR0b24tLWZsYXQgYnV0dG9uLS1mbGF0LS1zcGxpdCcsXHJcbiAgICAgICAgICB0ZXh0OiByZXNvdXJjZS5hZHZhbmNlZFRleHQsXHJcbiAgICAgICAgICBjb250ZXh0OiB0aGlzLmRhdGVUaW1lUGlja2VyLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRhdGVUaW1lUGlja2VyID0gbmV3IERhdGVUaW1lUGlja2VyKHsgaWQ6IGBkYXRldGltZS1waWNrZXItbW9kYWwgJHt0aGlzLmlkfWAsIGlzTW9kYWw6IHRydWUgfSk7XHJcbiAgICAgIHRvb2xiYXIgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYWN0aW9uOiAnY2FuY2VsJyxcclxuICAgICAgICAgIGNsYXNzTmFtZTogJ2J1dHRvbi0tZmxhdCBidXR0b24tLWZsYXQtLXNwbGl0JyxcclxuICAgICAgICAgIHRleHQ6IHJlc291cmNlLmNhbmNlbFRleHQsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgYWN0aW9uOiAncmVzb2x2ZScsXHJcbiAgICAgICAgICBjbGFzc05hbWU6ICdidXR0b24tLWZsYXQgYnV0dG9uLS1mbGF0LS1zcGxpdCcsXHJcbiAgICAgICAgICB0ZXh0OiByZXNvdXJjZS5jb25maXJtVGV4dCxcclxuICAgICAgICB9LFxyXG4gICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIEFwcC5tb2RhbC5hZGQodGhpcy5kYXRlVGltZVBpY2tlciwgdG9vbGJhciwgb3B0aW9ucykudGhlbih0aGlzLmdldFZhbHVlc0Zyb21Nb2RhbC5iaW5kKHRoaXMpKTtcclxuICB9LFxyXG4gIF9vbkNsaWNrOiBmdW5jdGlvbiBfb25DbGljayhldnQpIHtcclxuICAgIGV2ZW50LnN0b3AoZXZ0KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHBhcmVudCB7QGxpbmsgRWRpdG9yRmllbGQjdmFsaWRhdGUgdmFsaWRhdGV9IHdpdGggYSBjaGVjayB0aGF0IG1ha2VzIHN1cmUgaWZcclxuICAgKiB0aGUgdXNlciBoYXMgaW5wdXR0ZWQgYSBkYXRlIG1hbnVhbGx5IGludG8gdGhlIGlucHV0IGZpZWxkIHRoYXQgaXQgaGFkIHN1Y2Nlc3NmdWxseSB2YWxpZGF0ZWRcclxuICAgKiBpbiB0aGUge0BsaW5rICNfb25DaGFuZ2UgX29uQ2hhbmdlfSBmdW5jdGlvbi5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFuL09iamVjdH0gRmFsc2UgZm9yIG5vIGVycm9ycy4gVHJ1ZS9PYmplY3QgZm9yIGludmFsaWQuXHJcbiAgICovXHJcbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xyXG4gICAgaWYgKHRoaXMuaW5wdXROb2RlLnZhbHVlICE9PSAnJyAmJiAhdGhpcy5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdGl0dXRlKHRoaXMuaW52YWxpZERhdGVGb3JtYXRFcnJvclRleHQsIFt0aGlzLmxhYmVsXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBGaWVsZE1hbmFnZXIucmVnaXN0ZXIoJ2RhdGUnLCBjb250cm9sKTtcclxuIl19