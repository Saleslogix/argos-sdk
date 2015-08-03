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
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import event from 'dojo/_base/event';
import connect from 'dojo/_base/connect';
import string from 'dojo/string';
import domClass from 'dojo/dom-class';
import format from '../Format';
import FieldManager from '../FieldManager';
import EditorField from './EditorField';
import moment from 'moment';
import DateTimePicker from '../DateTimePicker';
import Modal from '../Modal';

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
var control = declare('argos.Fields.DateField', [EditorField], {
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
  widgetTemplate: new Simplate([
    '<label for="{%= $.name %}">{%: $.label %}</label>',
        '<button data-dojo-attach-point="triggerNode" data-action="showModal" class="button whiteButton {% if ($$.iconClass) { %} {%: $$.iconClass %}{% } %}" aria-label="{%: $.lookupLabelText %}"><span>{%: $.lookupText %}</span></button>',
        //'<button data-dojo-attach-point="triggerNode" data-action="navigateToEditView" class="button whiteButton {% if ($$.iconClass) { %} {%: $$.iconClass %}{% } %}" aria-label="{%: $.lookupLabelText %}"><span>{%: $.lookupText %}</span></button>',
    '<input data-dojo-attach-point="inputNode" data-dojo-attach-event="onchange:_onChange" type="text" />'
  ]),

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
  modal: null,
  dateTimePicker: null,
  _modalListener: null,
  /**
   * Takes a date object and calls {@link format#date format.date} passing the current
   * `dateFormatText` and `timeless` values, formatting the date into a string representation.
   * @param {Date} value Date to be converted
   * @return {String}
   */
  formatValue: function(value) {
    return format.date(value, this.dateFormatText, this.timeless);
  },
  /**
   * When a value changes it checks that the text in the input field matches the defined
   * `dateFormatText` by using it to parse it back into a Date Object. If this succeeds then
   * sets the current value to the Date object and removes any validation warnings. If it
   * doesn't then current value is empties and the validation styling is added.
   * @param {Event} evt Event that caused change to fire.
   */
  _onChange: function(evt) {
    var val = moment(this.inputNode.value, this.dateFormatText).toDate();

    if (val) {
      this.validationValue = this.currentValue = val;
      domClass.remove(this.containerNode, 'row-error'); // todo: not the right spot for this, add validation eventing
    } else {
      this.validationValue = this.currentValue = null;
      domClass.add(this.containerNode, 'row-error'); // todo: not the right spot for this, add validation eventing
    }
  },
  /**
   * Extends the parent {@link EditorField#createNavigationOptions createNavigationOptions} to
   * also include the properties `date`, `showTimePicker` and `timeless` with `date` being the current value
   * @return {Object} Navigation options
   */
  createNavigationOptions: function() {
    var options = this.inherited(arguments);

    options.date = this.currentValue;
    options.showTimePicker = this.showTimePicker;
    options.timeless = this.timeless;

    return options;
  },
  /**
   * Retrieves the date from the {@link Calendar#getDateTime Calendar} view and sets it to currentValue.
   */
  getValuesFromView: function() {
    var view = App.getPrimaryActiveView();
    if (view) {
      this.currentValue = this.validationValue = view.getDateTime();
      domClass.remove(this.containerNode, 'row-error'); // todo: not the right spot for this, add validation eventing
    }
  },
  getValuesFromModal: function getValuesFromModal(data = {}) {
    if (this.modal) {
      this.currentValue = this.validationValue = data.date;
      this.inputNode.value = this.formatValue(this.currentValue);
    }
  },
  /**
   * Determines if the current value has been modified from the original value.
   * @return {Boolean}
   */
  isDirty: function() {
    return this.originalValue instanceof Date && this.currentValue instanceof Date ? this.originalValue.getTime() !== this.currentValue.getTime() : this.originalValue !== this.currentValue;
  },
  /**
   * Extends the parent {@link EditorField#clearValue clearValue} to also include removing the
   * error validation styling.
   */
  clearValue: function() {
    this.inherited(arguments);
    domClass.remove(this.containerNode, 'row-error'); // todo: not the right spot for this, add validation eventing
  },
  showModal: function showModal(params) {
    if (this.isDisabled()) {
      return;
    }

    if (!this.modal) {
      const options = this.createNavigationOptions();
      this.dateTimePicker = new DateTimePicker({ id: 'datetime-picker-modal', isModal: true });
      this.modal = new Modal({ id: 'date-time-modal' });
      this.modal.placeModal(this.domNode.offsetParent)
                .setContentObject(this.dateTimePicker)
                .setContentOptions(options);
      this._modalListener = connect.subscribe('/app/Modal/confirm', this, this.getValuesFromModal);
    }

    this.modal.showModal(params.$source);
  },
  _onClick: function(evt) {
     event.stop(evt);
     this.showModal(params = {$source: evt.target});
  },
  /**
   * Extends the parent {@link EditorField#validate validate} with a check that makes sure if
   * the user has inputted a date manually into the input field that it had successfully validated
   * in the {@link #_onChange _onChange} function.
   * @return {Boolean/Object} False for no errors. True/Object for invalid.
   */
  validate: function() {
    if (this.inputNode.value !== '' && !this.currentValue) {
      return string.substitute(this.invalidDateFormatErrorText, [this.label]);
    }

    return this.inherited(arguments);
  }
});

lang.setObject('Sage.Platform.Mobile.Fields.DateField', control);
export default FieldManager.register('date', control);
