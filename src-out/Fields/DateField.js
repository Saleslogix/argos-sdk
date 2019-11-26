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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvRGF0ZUZpZWxkLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiZHRGb3JtYXRSZXNvdXJjZSIsImNvbnRyb2wiLCJlbXB0eVRleHQiLCJkYXRlRm9ybWF0VGV4dCIsImludmFsaWREYXRlRm9ybWF0RXJyb3JUZXh0Iiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImljb25DbGFzcyIsInZpZXciLCJyZXF1aXJlZCIsInNob3dUaW1lUGlja2VyIiwic2hvd1JlbGF0aXZlRGF0ZVRpbWUiLCJ0aW1lbGVzcyIsIm1vZGFsIiwiZGF0ZVRpbWVQaWNrZXIiLCJfbW9kYWxMaXN0ZW5lciIsImZvcm1hdFZhbHVlIiwidmFsdWUiLCJkYXRlIiwiX29uQ2hhbmdlIiwianNEYXRlIiwiRGF0ZSIsImlucHV0Tm9kZSIsIm1vbWVudCIsImlzVmFsaWQiLCJ2YWwiLCJ2YWxpZGF0aW9uVmFsdWUiLCJjdXJyZW50VmFsdWUiLCJ0b0RhdGUiLCJmb3JtYXQiLCIkIiwiY29udGFpbmVyTm9kZSIsInJlbW92ZUNsYXNzIiwib25DaGFuZ2UiLCJhZGRDbGFzcyIsImNyZWF0ZU5hdmlnYXRpb25PcHRpb25zIiwib3B0aW9ucyIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsImdldFZhbHVlc0Zyb21WaWV3IiwiQXBwIiwiZ2V0UHJpbWFyeUFjdGl2ZVZpZXciLCJnZXREYXRlVGltZSIsImdldFZhbHVlc0Zyb21Nb2RhbCIsImRhdGEiLCJjYWxlbmRhciIsInNlbGVjdGVkRGF0ZU1vbWVudCIsImNsb25lIiwidGltZSIsImhvdXJzIiwibWludXRlcyIsInNlY29uZHMiLCJpc0RpcnR5Iiwib3JpZ2luYWxWYWx1ZSIsImdldFRpbWUiLCJjbGVhclZhbHVlIiwic2hvd01vZGFsIiwiaXNEaXNhYmxlZCIsInRvb2xiYXIiLCJpZCIsImlzTW9kYWwiLCJhY3Rpb24iLCJjbGFzc05hbWUiLCJ0ZXh0IiwiY2FuY2VsVGV4dCIsInRvRGF0ZVRpbWVQaWNrZXIiLCJhZHZhbmNlZFRleHQiLCJjb250ZXh0IiwiY29uZmlybVRleHQiLCJhZGQiLCJ0aGVuIiwiYmluZCIsIl9vbkNsaWNrIiwiZXZ0Iiwic3RvcCIsInZhbGlkYXRlIiwic3Vic3RpdHV0ZSIsImxhYmVsIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLE1BQU1BLFdBQVcsb0JBQVksV0FBWixDQUFqQixDLENBMUJBOzs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsTUFBTUMsbUJBQW1CLG9CQUFZLHlCQUFaLENBQXpCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLE1BQU1DLFVBQVUsdUJBQVEsd0JBQVIsRUFBa0MsdUJBQWxDLEVBQWlELHFDQUFxQztBQUNwRztBQUNBOzs7O0FBSUFDLGVBQVdILFNBQVNHLFNBTmdGO0FBT3BHQyxvQkFBZ0JILGlCQUFpQkcsY0FQbUU7QUFRcEc7Ozs7OztBQU1BQyxnQ0FBNEJMLFNBQVNLLDBCQWQrRDs7QUFnQnBHOzs7Ozs7OztBQVFBQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLHMzQkFBYixDQXhCb0Y7QUFvRHBHQyxlQUFXLFVBcER5Rjs7QUFzRHBHOzs7OztBQUtBQyxVQUFNLGtCQTNEOEY7QUE0RHBHOzs7O0FBSUFDLGNBQVUsS0FoRTBGO0FBaUVwRzs7Ozs7QUFLQUMsb0JBQWdCLEtBdEVvRjtBQXVFcEc7Ozs7O0FBS0FDLDBCQUFzQixLQTVFOEU7QUE2RXBHOzs7OztBQUtBQyxjQUFVLEtBbEYwRjtBQW1GcEdDLFdBQU8sSUFuRjZGO0FBb0ZwR0Msb0JBQWdCLElBcEZvRjtBQXFGcEdDLG9CQUFnQixJQXJGb0Y7QUFzRnBHOzs7Ozs7QUFNQUMsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQkMsS0FBckIsRUFBNEI7QUFDdkMsYUFBTyxpQkFBT0MsSUFBUCxDQUFZRCxLQUFaLEVBQW1CLEtBQUtkLGNBQXhCLEVBQXdDLEtBQUtTLFFBQTdDLENBQVA7QUFDRCxLQTlGbUc7QUErRnBHOzs7Ozs7O0FBT0FP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aUQsVUFBUCxDQUFrQixLQUFLeEUsMEJBQXZCLEVBQW1ELENBQUMsS0FBS3lFLEtBQU4sQ0FBbkQsQ0FBUDtBQUNEOztBQUVELGFBQU8sS0FBS3hDLFNBQUwsQ0FBZXNDLFFBQWYsRUFBeUJyQyxTQUF6QixDQUFQO0FBQ0Q7QUE3T21HLEdBQXRGLENBQWhCOztvQkFnUGUsdUJBQWF3QyxRQUFiLENBQXNCLE1BQXRCLEVBQThCN0UsT0FBOUIsQyIsImZpbGUiOiJEYXRlRmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBldmVudCBmcm9tICdkb2pvL19iYXNlL2V2ZW50JztcclxuaW1wb3J0IHN0cmluZyBmcm9tICdkb2pvL3N0cmluZyc7XHJcbmltcG9ydCBmb3JtYXQgZnJvbSAnLi4vRm9ybWF0JztcclxuaW1wb3J0IEZpZWxkTWFuYWdlciBmcm9tICcuLi9GaWVsZE1hbmFnZXInO1xyXG5pbXBvcnQgRWRpdG9yRmllbGQgZnJvbSAnLi9FZGl0b3JGaWVsZCc7XHJcbmltcG9ydCBEYXRlVGltZVBpY2tlciBmcm9tICcuLi9EYXRlVGltZVBpY2tlcic7XHJcbmltcG9ydCBSZWxhdGl2ZURhdGVUaW1lUGlja2VyIGZyb20gJy4uL1JlbGF0aXZlRGF0ZVRpbWVQaWNrZXInO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcblxyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnZGF0ZUZpZWxkJyk7XHJcbmNvbnN0IGR0Rm9ybWF0UmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnZGF0ZUZpZWxkRGF0ZVRpbWVGb3JtYXQnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRmllbGRzLkRhdGVGaWVsZFxyXG4gKiBAY2xhc3NkZXNjIFRoZSBEYXRlRmllbGQgaXMgYW4gZXh0ZW5zaW9uIG9mIHRoZSB7QGxpbmsgRWRpdG9yRmllbGQgRWRpdG9yRmllbGR9IGJ5IGFjY2VwdGluZyBEYXRlIE9iamVjdHNcclxuICogZm9yIHZhbHVlcyBhbmQgdXNpbmcgdGhlIHtAbGluayBDYWxlbmRhciBDYWxlbmRhcn0gdmlldyBmb3IgdXNlciBpbnB1dC5cclxuICpcclxuICogQGV4YW1wbGVcclxuICpcclxuICogICAgIHtcclxuICogICAgICAgICBuYW1lOiAnU3RhcnREYXRlJyxcclxuICogICAgICAgICBwcm9wZXJ0eTogJ1N0YXJ0RGF0ZScsXHJcbiAqICAgICAgICAgbGFiZWw6IHRoaXMuc3RhcnREYXRlVGV4dCxcclxuICogICAgICAgICB0eXBlOiAnZGF0ZScsXHJcbiAqICAgICAgICAgZGF0ZUZvcm1hdFRleHQ6ICdNTS9ERCBISDptbTpzcycsXHJcbiAqICAgICAgICAgc2hvd1RpbWVyUGlja2VyOiB0cnVlLFxyXG4gKiAgICAgICAgIHNob3dSZWxhdGl2ZURhdGVUaW1lOiB0cnVlXHJcbiAqICAgICB9XHJcbiAqXHJcbiAqIEBleHRlbmRzIGFyZ29zLkZpZWxkcy5FZGl0b3JGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuQ2FsZW5kYXJcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkTWFuYWdlclxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRm9ybWF0XHJcbiAqL1xyXG5jb25zdCBjb250cm9sID0gZGVjbGFyZSgnYXJnb3MuRmllbGRzLkRhdGVGaWVsZCcsIFtFZGl0b3JGaWVsZF0sIC8qKiBAbGVuZHMgYXJnb3MuRmllbGRzLkRhdGVGaWVsZCMgKi97XHJcbiAgLy8gTG9jYWxpemF0aW9uXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIFRoZSB0ZXh0IHNob3duIHdoZW4gbm8gdmFsdWUgKG9yIG51bGwvdW5kZWZpbmVkKSBpcyBzZXQgdG8gdGhlIGZpZWxkLlxyXG4gICAqL1xyXG4gIGVtcHR5VGV4dDogcmVzb3VyY2UuZW1wdHlUZXh0LFxyXG4gIGRhdGVGb3JtYXRUZXh0OiBkdEZvcm1hdFJlc291cmNlLmRhdGVGb3JtYXRUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSBlcnJvciB2YWxpZGF0aW9uIG1lc3NhZ2UgZm9yIHRoaXMgZmllbGQuXHJcbiAgICpcclxuICAgKiBgJHswfWAgPT4gTGFiZWxcclxuICAgKi9cclxuICBpbnZhbGlkRGF0ZUZvcm1hdEVycm9yVGV4dDogcmVzb3VyY2UuaW52YWxpZERhdGVGb3JtYXRFcnJvclRleHQsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBmaWVsZHMgSFRNTCBNYXJrdXBcclxuICAgKlxyXG4gICAqICogYCRgID0+IEZpZWxkIGluc3RhbmNlXHJcbiAgICogKiBgJCRgID0+IE93bmVyIFZpZXcgaW5zdGFuY2VcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgYDxsYWJlbCBmb3I9XCJ7JT0gJC5uYW1lICV9XCJcclxuICAgICAgeyUgaWYgKCQucmVxdWlyZWQpIHsgJX1cclxuICAgICAgICBjbGFzcz1cInJlcXVpcmVkXCJcclxuICAgICAgeyUgfSAlfT5cclxuICAgICAgeyU6ICQubGFiZWwgJX1cclxuICAgIDwvbGFiZWw+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGQgZmllbGQtY29udHJvbC13cmFwcGVyXCI+XHJcbiAgICAgIDxidXR0b25cclxuICAgICAgICBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwidHJpZ2dlck5vZGVcIlxyXG4gICAgICAgIGRhdGEtYWN0aW9uPVwic2hvd01vZGFsXCJcclxuICAgICAgICBjbGFzcz1cImJ1dHRvbiBmaWVsZC1jb250cm9sLXRyaWdnZXIgd2hpdGVCdXR0b25cIlxyXG4gICAgICAgIGFyaWEtbGFiZWw9XCJ7JTogJC5sb29rdXBMYWJlbFRleHQgJX1cIj5cclxuICAgICAgICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgIDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeGxpbms6aHJlZj1cIiNpY29uLXslOiAkLmljb25DbGFzcyAlfVwiPjwvdXNlPlxyXG4gICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgPC9idXR0b24+XHJcbiAgICAgIDxpbnB1dFxyXG4gICAgICAgIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJpbnB1dE5vZGVcIlxyXG4gICAgICAgIGRhdGEtZG9qby1hdHRhY2gtZXZlbnQ9XCJvbmNoYW5nZTpfb25DaGFuZ2VcIlxyXG4gICAgICAgIHR5cGU9XCJ0ZXh0XCJcclxuICAgICAgICB7JSBpZiAoJC5yZXF1aXJlZCkgeyAlfVxyXG4gICAgICAgICAgZGF0YS12YWxpZGF0ZT1cInJlcXVpcmVkXCJcclxuICAgICAgICAgIGNsYXNzPVwicmVxdWlyZWRcIlxyXG4gICAgICAgIHslIH0gJX1cclxuICAgICAgICAvPlxyXG4gICAgPC9kaXY+YCxcclxuICBdKSxcclxuICBpY29uQ2xhc3M6ICdjYWxlbmRhcicsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSB0YXJnZXQgdmlldyBpZCB0aGF0IHdpbGwgcHJvdmlkZSB0aGUgdXNlciBpbnB1dCwgdGhpcyBzaG91bGQgYWx3YXlzIGJlIHRvIHNldCB0byB0aGVcclxuICAgKiB7QGxpbmsgQ2FsZW5kYXIgQ2FsZW5kYXJzfSB2aWV3IGlkLlxyXG4gICAqL1xyXG4gIHZpZXc6ICdnZW5lcmljX2NhbGVuZGFyJyxcclxuICAvKipcclxuICAgKiByZXF1aXJlZCBzaG91bGQgYmUgdHJ1ZSBpZiB0aGUgZmllbGQgcmVxdWlyZXMgaW5wdXQuIERlZmF1bHRzIHRvIGZhbHNlLlxyXG4gICAqIEB0eXBlIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIHJlcXVpcmVkOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtCb29sZWFufVxyXG4gICAqIFNlbnQgYXMgcGFydCBvZiBuYXZpZ2F0aW9uIG9wdGlvbnMgdG8ge0BsaW5rIENhbGVuZGFyIENhbGVuZGFyfSwgd2hlcmUgaXQgY29udHJvbHMgdGhlXHJcbiAgICogZGlzcGxheSBvZiB0aGUgaG91ci9taW51dGUgaW5wdXRzLlxyXG4gICAqL1xyXG4gIHNob3dUaW1lUGlja2VyOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtCb29sZWFufVxyXG4gICAqIFNlbnQgYXMgcGFydCBvZiBuYXZpZ2F0aW9uIG9wdGlvbnMgdG8ge0BsaW5rIENhbGVuZGFyIENhbGVuZGFyfSwgd2hlcmUgaXQgY29udHJvbHMgdGhlXHJcbiAgICogZGlzcGxheSBvZiB0aGUgcmVsYXRpdmUgZGF0ZSB0aW1lIHBpY2tlci5cclxuICAgKi9cclxuICBzaG93UmVsYXRpdmVEYXRlVGltZTogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7Qm9vbGVhbn1cclxuICAgKiBVc2VkIGluIGZvcm1hdHRlZCBhbmQgc2VudCBhcyBwYXJ0IG9mIG5hdmlnYXRpb24gb3B0aW9ucyB0byB7QGxpbmsgQ2FsZW5kYXIgQ2FsZW5kYXJ9LFxyXG4gICAqIHdoZXJlIGl0IGNvbnRyb2xzIHRoZSB0aGUgY29udmVyc2lvbiB0by9mcm9tIFVUQyBhbmQgc2V0dGluZyB0aGUgaG91cjptaW46c2VjIHRvIDAwOjAwOjA1LlxyXG4gICAqL1xyXG4gIHRpbWVsZXNzOiBmYWxzZSxcclxuICBtb2RhbDogbnVsbCxcclxuICBkYXRlVGltZVBpY2tlcjogbnVsbCxcclxuICBfbW9kYWxMaXN0ZW5lcjogbnVsbCxcclxuICAvKipcclxuICAgKiBUYWtlcyBhIGRhdGUgb2JqZWN0IGFuZCBjYWxscyB7QGxpbmsgZm9ybWF0I2RhdGUgZm9ybWF0LmRhdGV9IHBhc3NpbmcgdGhlIGN1cnJlbnRcclxuICAgKiBgZGF0ZUZvcm1hdFRleHRgIGFuZCBgdGltZWxlc3NgIHZhbHVlcywgZm9ybWF0dGluZyB0aGUgZGF0ZSBpbnRvIGEgc3RyaW5nIHJlcHJlc2VudGF0aW9uLlxyXG4gICAqIEBwYXJhbSB7RGF0ZX0gdmFsdWUgRGF0ZSB0byBiZSBjb252ZXJ0ZWRcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgZm9ybWF0VmFsdWU6IGZ1bmN0aW9uIGZvcm1hdFZhbHVlKHZhbHVlKSB7XHJcbiAgICByZXR1cm4gZm9ybWF0LmRhdGUodmFsdWUsIHRoaXMuZGF0ZUZvcm1hdFRleHQsIHRoaXMudGltZWxlc3MpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogV2hlbiBhIHZhbHVlIGNoYW5nZXMgaXQgY2hlY2tzIHRoYXQgdGhlIHRleHQgaW4gdGhlIGlucHV0IGZpZWxkIG1hdGNoZXMgdGhlIGRlZmluZWRcclxuICAgKiBgZGF0ZUZvcm1hdFRleHRgIGJ5IHVzaW5nIGl0IHRvIHBhcnNlIGl0IGJhY2sgaW50byBhIERhdGUgT2JqZWN0LiBJZiB0aGlzIHN1Y2NlZWRzIHRoZW5cclxuICAgKiBzZXRzIHRoZSBjdXJyZW50IHZhbHVlIHRvIHRoZSBEYXRlIG9iamVjdCBhbmQgcmVtb3ZlcyBhbnkgdmFsaWRhdGlvbiB3YXJuaW5ncy4gSWYgaXRcclxuICAgKiBkb2Vzbid0IHRoZW4gY3VycmVudCB2YWx1ZSBpcyBlbXB0aWVzIGFuZCB0aGUgdmFsaWRhdGlvbiBzdHlsaW5nIGlzIGFkZGVkLlxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBFdmVudCB0aGF0IGNhdXNlZCBjaGFuZ2UgdG8gZmlyZS5cclxuICAgKi9cclxuICBfb25DaGFuZ2U6IGZ1bmN0aW9uIF9vbkNoYW5nZSgvKiBldnQqLykge1xyXG4gICAgY29uc3QganNEYXRlID0gbmV3IERhdGUodGhpcy5pbnB1dE5vZGUudmFsdWUpO1xyXG4gICAgbGV0IGRhdGUgPSBtb21lbnQodGhpcy5pbnB1dE5vZGUudmFsdWUsIHRoaXMuZGF0ZUZvcm1hdFRleHQsIHRydWUpO1xyXG4gICAgaWYgKG1vbWVudChqc0RhdGUpLmlzVmFsaWQoKSAmJiAhZGF0ZS5pc1ZhbGlkKCkpIHtcclxuICAgICAgZGF0ZSA9IG1vbWVudChqc0RhdGUpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdmFsID0gZGF0ZS5pc1ZhbGlkKCk7XHJcblxyXG4gICAgaWYgKHZhbCkge1xyXG4gICAgICB0aGlzLnZhbGlkYXRpb25WYWx1ZSA9IHRoaXMuY3VycmVudFZhbHVlID0gZGF0ZS50b0RhdGUoKTtcclxuICAgICAgaWYgKHRoaXMuaW5wdXROb2RlLnZhbHVlICE9PSBkYXRlLmZvcm1hdCh0aGlzLmRhdGVGb3JtYXRUZXh0KSkge1xyXG4gICAgICAgIHRoaXMuaW5wdXROb2RlLnZhbHVlID0gZGF0ZS5mb3JtYXQodGhpcy5kYXRlRm9ybWF0VGV4dCk7XHJcbiAgICAgIH1cclxuICAgICAgJCh0aGlzLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctZXJyb3InKTsgLy8gdG9kbzogbm90IHRoZSByaWdodCBzcG90IGZvciB0aGlzLCBhZGQgdmFsaWRhdGlvbiBldmVudGluZ1xyXG4gICAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuY3VycmVudFZhbHVlLCB0aGlzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmFsaWRhdGlvblZhbHVlID0gdGhpcy5jdXJyZW50VmFsdWUgPSBudWxsO1xyXG4gICAgICAkKHRoaXMuY29udGFpbmVyTm9kZSkuYWRkQ2xhc3MoJ3Jvdy1lcnJvcicpOyAvLyB0b2RvOiBub3QgdGhlIHJpZ2h0IHNwb3QgZm9yIHRoaXMsIGFkZCB2YWxpZGF0aW9uIGV2ZW50aW5nXHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSBwYXJlbnQge0BsaW5rIEVkaXRvckZpZWxkI2NyZWF0ZU5hdmlnYXRpb25PcHRpb25zIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zfSB0b1xyXG4gICAqIGFsc28gaW5jbHVkZSB0aGUgcHJvcGVydGllcyBgZGF0ZWAsIGBzaG93VGltZVBpY2tlcmAgYW5kIGB0aW1lbGVzc2Agd2l0aCBgZGF0ZWAgYmVpbmcgdGhlIGN1cnJlbnQgdmFsdWVcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE5hdmlnYXRpb24gb3B0aW9uc1xyXG4gICAqL1xyXG4gIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zOiBmdW5jdGlvbiBjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucygpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmluaGVyaXRlZChjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucywgYXJndW1lbnRzKTtcclxuXHJcbiAgICBpZiAodGhpcy5jdXJyZW50VmFsdWUgIT09ICcnICYmIHRoaXMuY3VycmVudFZhbHVlICE9PSBudWxsKSB7XHJcbiAgICAgIG9wdGlvbnMuZGF0ZSA9IHRoaXMuY3VycmVudFZhbHVlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgb3B0aW9ucy5kYXRlID0gbW9tZW50KCk7XHJcbiAgICB9XHJcbiAgICBvcHRpb25zLnNob3dUaW1lUGlja2VyID0gdGhpcy5zaG93VGltZVBpY2tlcjtcclxuICAgIG9wdGlvbnMudGltZWxlc3MgPSB0aGlzLnRpbWVsZXNzO1xyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIHRoZSBkYXRlIGZyb20gdGhlIHtAbGluayBDYWxlbmRhciNnZXREYXRlVGltZSBDYWxlbmRhcn0gdmlldyBhbmQgc2V0cyBpdCB0byBjdXJyZW50VmFsdWUuXHJcbiAgICovXHJcbiAgZ2V0VmFsdWVzRnJvbVZpZXc6IGZ1bmN0aW9uIGdldFZhbHVlc0Zyb21WaWV3KCkge1xyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRQcmltYXJ5QWN0aXZlVmlldygpO1xyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB0aGlzLnZhbGlkYXRpb25WYWx1ZSA9IHZpZXcuZ2V0RGF0ZVRpbWUoKTtcclxuICAgICAgJCh0aGlzLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctZXJyb3InKTsgLy8gdG9kbzogbm90IHRoZSByaWdodCBzcG90IGZvciB0aGlzLCBhZGQgdmFsaWRhdGlvbiBldmVudGluZ1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2V0VmFsdWVzRnJvbU1vZGFsOiBmdW5jdGlvbiBnZXRWYWx1ZXNGcm9tTW9kYWwoZGF0YSA9IHt9KSB7XHJcbiAgICBpZiAoZGF0YS5jYWxlbmRhci5zZWxlY3RlZERhdGVNb21lbnQpIHtcclxuICAgICAgLy8gVGhpcyBpcyB0aGUgY2FzZSB3aGVyZSB0aGUgRGF0ZVRpbWVQaWNrZXIgd2FzIHVzZWQgdG8gc2VsZWN0IHRoZSBkYXRlXHJcbiAgICAgIGNvbnN0IGRhdGUgPSBkYXRhLmNhbGVuZGFyLnNlbGVjdGVkRGF0ZU1vbWVudC5jbG9uZSgpO1xyXG4gICAgICBpZiAoZGF0YS50aW1lKSB7XHJcbiAgICAgICAgZGF0ZS5ob3VycyhkYXRhLnRpbWUuaG91cnMpO1xyXG4gICAgICAgIGRhdGUubWludXRlcyhkYXRhLnRpbWUubWludXRlcyk7XHJcbiAgICAgICAgZGF0ZS5zZWNvbmRzKGRhdGEudGltZS5zZWNvbmRzKTtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHRoaXMudmFsaWRhdGlvblZhbHVlID0gZGF0ZS50b0RhdGUoKTtcclxuICAgICAgdGhpcy5pbnB1dE5vZGUudmFsdWUgPSB0aGlzLmZvcm1hdFZhbHVlKHRoaXMuY3VycmVudFZhbHVlKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gdGhpcy52YWxpZGF0aW9uVmFsdWUgPSBkYXRhLnRvRGF0ZSgpO1xyXG4gICAgICB0aGlzLmlucHV0Tm9kZS52YWx1ZSA9IHRoaXMuZm9ybWF0VmFsdWUodGhpcy5jdXJyZW50VmFsdWUpO1xyXG4gICAgfVxyXG4gICAgJCh0aGlzLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctZXJyb3InKTsgLy8gdG9kbzogbm90IHRoZSByaWdodCBzcG90IGZvciB0aGlzLCBhZGQgdmFsaWRhdGlvbiBldmVudGluZ1xyXG4gICAgdGhpcy5vbkNoYW5nZSh0aGlzLmN1cnJlbnRWYWx1ZSwgdGhpcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBjdXJyZW50IHZhbHVlIGhhcyBiZWVuIG1vZGlmaWVkIGZyb20gdGhlIG9yaWdpbmFsIHZhbHVlLlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgaXNEaXJ0eTogZnVuY3Rpb24gaXNEaXJ0eSgpIHtcclxuICAgIHJldHVybiB0aGlzLm9yaWdpbmFsVmFsdWUgaW5zdGFuY2VvZiBEYXRlICYmIHRoaXMuY3VycmVudFZhbHVlIGluc3RhbmNlb2YgRGF0ZSA/IHRoaXMub3JpZ2luYWxWYWx1ZS5nZXRUaW1lKCkgIT09IHRoaXMuY3VycmVudFZhbHVlLmdldFRpbWUoKSA6IHRoaXMub3JpZ2luYWxWYWx1ZSAhPT0gdGhpcy5jdXJyZW50VmFsdWU7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSBwYXJlbnQge0BsaW5rIEVkaXRvckZpZWxkI2NsZWFyVmFsdWUgY2xlYXJWYWx1ZX0gdG8gYWxzbyBpbmNsdWRlIHJlbW92aW5nIHRoZVxyXG4gICAqIGVycm9yIHZhbGlkYXRpb24gc3R5bGluZy5cclxuICAgKi9cclxuICBjbGVhclZhbHVlOiBmdW5jdGlvbiBjbGVhclZhbHVlKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoY2xlYXJWYWx1ZSwgYXJndW1lbnRzKTtcclxuICAgICQodGhpcy5jb250YWluZXJOb2RlKS5yZW1vdmVDbGFzcygncm93LWVycm9yJyk7IC8vIHRvZG86IG5vdCB0aGUgcmlnaHQgc3BvdCBmb3IgdGhpcywgYWRkIHZhbGlkYXRpb24gZXZlbnRpbmdcclxuICB9LFxyXG4gIHNob3dNb2RhbDogZnVuY3Rpb24gc2hvd01vZGFsKCkge1xyXG4gICAgaWYgKHRoaXMuaXNEaXNhYmxlZCgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucygpO1xyXG5cclxuICAgIGxldCB0b29sYmFyO1xyXG4gICAgaWYgKHRoaXMuc2hvd1JlbGF0aXZlRGF0ZVRpbWUgJiYgIW9wdGlvbnMudGltZWxlc3MpIHtcclxuICAgICAgdGhpcy5kYXRlVGltZVBpY2tlciA9IG5ldyBSZWxhdGl2ZURhdGVUaW1lUGlja2VyKHsgaWQ6IGByZWxhdGl2ZS1kYXRldGltZS1waWNrZXItbW9kYWwgJHt0aGlzLmlkfWAsIGlzTW9kYWw6IHRydWUgfSk7XHJcbiAgICAgIHRvb2xiYXIgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYWN0aW9uOiAnY2FuY2VsJyxcclxuICAgICAgICAgIGNsYXNzTmFtZTogJ2J1dHRvbi0tZmxhdCBidXR0b24tLWZsYXQtLXNwbGl0JyxcclxuICAgICAgICAgIHRleHQ6IHJlc291cmNlLmNhbmNlbFRleHQsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgYWN0aW9uOiB0aGlzLmRhdGVUaW1lUGlja2VyLnRvRGF0ZVRpbWVQaWNrZXIsXHJcbiAgICAgICAgICBjbGFzc05hbWU6ICdidXR0b24tLWZsYXQgYnV0dG9uLS1mbGF0LS1zcGxpdCcsXHJcbiAgICAgICAgICB0ZXh0OiByZXNvdXJjZS5hZHZhbmNlZFRleHQsXHJcbiAgICAgICAgICBjb250ZXh0OiB0aGlzLmRhdGVUaW1lUGlja2VyLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmRhdGVUaW1lUGlja2VyID0gbmV3IERhdGVUaW1lUGlja2VyKHsgaWQ6IGBkYXRldGltZS1waWNrZXItbW9kYWwgJHt0aGlzLmlkfWAsIGlzTW9kYWw6IHRydWUgfSk7XHJcbiAgICAgIHRvb2xiYXIgPSBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgYWN0aW9uOiAnY2FuY2VsJyxcclxuICAgICAgICAgIGNsYXNzTmFtZTogJ2J1dHRvbi0tZmxhdCBidXR0b24tLWZsYXQtLXNwbGl0JyxcclxuICAgICAgICAgIHRleHQ6IHJlc291cmNlLmNhbmNlbFRleHQsXHJcbiAgICAgICAgfSwge1xyXG4gICAgICAgICAgYWN0aW9uOiAncmVzb2x2ZScsXHJcbiAgICAgICAgICBjbGFzc05hbWU6ICdidXR0b24tLWZsYXQgYnV0dG9uLS1mbGF0LS1zcGxpdCcsXHJcbiAgICAgICAgICB0ZXh0OiByZXNvdXJjZS5jb25maXJtVGV4dCxcclxuICAgICAgICB9LFxyXG4gICAgICBdO1xyXG4gICAgfVxyXG5cclxuICAgIEFwcC5tb2RhbC5hZGQodGhpcy5kYXRlVGltZVBpY2tlciwgdG9vbGJhciwgb3B0aW9ucykudGhlbih0aGlzLmdldFZhbHVlc0Zyb21Nb2RhbC5iaW5kKHRoaXMpKTtcclxuICB9LFxyXG4gIF9vbkNsaWNrOiBmdW5jdGlvbiBfb25DbGljayhldnQpIHtcclxuICAgIGV2ZW50LnN0b3AoZXZ0KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHBhcmVudCB7QGxpbmsgRWRpdG9yRmllbGQjdmFsaWRhdGUgdmFsaWRhdGV9IHdpdGggYSBjaGVjayB0aGF0IG1ha2VzIHN1cmUgaWZcclxuICAgKiB0aGUgdXNlciBoYXMgaW5wdXR0ZWQgYSBkYXRlIG1hbnVhbGx5IGludG8gdGhlIGlucHV0IGZpZWxkIHRoYXQgaXQgaGFkIHN1Y2Nlc3NmdWxseSB2YWxpZGF0ZWRcclxuICAgKiBpbiB0aGUge0BsaW5rICNfb25DaGFuZ2UgX29uQ2hhbmdlfSBmdW5jdGlvbi5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFuL09iamVjdH0gRmFsc2UgZm9yIG5vIGVycm9ycy4gVHJ1ZS9PYmplY3QgZm9yIGludmFsaWQuXHJcbiAgICovXHJcbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xyXG4gICAgaWYgKHRoaXMuaW5wdXROb2RlLnZhbHVlICE9PSAnJyAmJiAhdGhpcy5jdXJyZW50VmFsdWUpIHtcclxuICAgICAgcmV0dXJuIHN0cmluZy5zdWJzdGl0dXRlKHRoaXMuaW52YWxpZERhdGVGb3JtYXRFcnJvclRleHQsIFt0aGlzLmxhYmVsXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaW5oZXJpdGVkKHZhbGlkYXRlLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGRNYW5hZ2VyLnJlZ2lzdGVyKCdkYXRlJywgY29udHJvbCk7XHJcbiJdfQ==