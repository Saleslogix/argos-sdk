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
import string from 'dojo/string';
import domClass from 'dojo/dom-class';
import format from '../Format';
import LookupField from './LookupField';
import FieldManager from '../FieldManager';
import getResource from '../I18n';

const resource = getResource('durationField');

/**
 * @class argos.Fields.DurationField
 * The Duration field is a mashup of an auto-complete box and a {@link LookupField LookupField} for handling
 * duration's of: minutes, hours, days, weeks or years. Meaning a user can type directly into the input area the
 * amount of time or press the lookup button and choose from pre-determined list of times.
 *
 * When typing in a value directly, the Duration field only supports one "measurement" meaning if you wanted to
 * have 1 hour and 30 minutes you would need to type in 90 minutes or 1.5 hours.
 *
 * The auto-complete happens on blur, so if a user types in 5m they would need to go to the next field (or press
 * Save) and the field will auto-complete to 5 minute(s), letting the user know it accepted the value. If a value
 * entered is not accepted, 5abc, it will default to the last known measurement, defaulting to minutes.
 *
 * Setting and getting the value is always in minutes as a Number.
 *
 * ###Example:
 *     {
 *         name: 'Duration',
 *         property: 'Duration',
 *         label: this.durationText,
 *         type: 'duration',
 *         view: 'durations_list'
 *     }
 *
 * @alternateClassName DurationField
 * @extends argos.Fields.LookupField
 * @requires argos.FieldManager
 */
const control = declare('argos.Fields.DurationField', [LookupField], {
  /**
   * Maps various attributes of nodes to setters.
   */
  attributeMap: {
    inputValue: {
      node: 'inputNode',
      type: 'attribute',
      attribute: 'value',
    },
    inputDisabled: {
      node: 'inputNode',
      type: 'attribute',
      attribute: 'disabled',
    },
    autoCompleteContent: {
      node: 'autoCompleteNode',
      type: 'attribute',
      attribute: 'innerHTML',
    },
  },
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
    '<div class="autoComplete-watermark" data-dojo-attach-point="autoCompleteNode"></div>',
    '<button class="button simpleSubHeaderButton {% if ($$.iconClass) { %} {%: $$.iconClass %} {% } %}" data-dojo-attach-event="onclick:navigateToListView" aria-label="{%: $.lookupLabelText %}"><span aria-hidden="true">{%: $.lookupText %}</span></button>',
    '<input data-dojo-attach-point="inputNode" data-dojo-attach-event="onkeyup: _onKeyUp, onblur: _onBlur, onfocus: _onFocus" class="text-input" type="{%: $.inputType %}" name="{%= $.name %}" {% if ($.readonly) { %} readonly {% } %}>',
  ]),
  iconClass: 'fa fa-ellipsis-h fa-lg',

  // Localization
  /**
   * @property {String}
   * Text used when no value or null is set to the field
   */
  emptyText: resource.emptyText,
  /**
   * @property {String}
   * Text displayed when an invalid input is detected
   */
  invalidDurationErrorText: resource.invalidDurationErrorText,
  /**
   * @property {Object}
   * The auto completed text and their corresponding values in minutes (SData is always minutes)
   *
   * Override ride this object to change the autocomplete units or their localization.
   */
  autoCompleteText: {
    1: resource.minutes,
    60: resource.hours,
    1440: resource.days,
    10080: resource.weeks,
    525960: resource.years,
  },
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
   * @property {String}
   * The current unit as detected by the parser
   * @private
   */
  currentKey: null,
  /**
   * @property {Number}
   * The current value, expressed as minutes.
   */
  currentValue: 0,

  /**
   * @property {RegExp}
   * Regular expression for capturing the phrase (text).
   *
   * The first capture group must be non-text part
   * Second capture is the phrase to be used in auto complete
   */
  autoCompletePhraseRE: /^((?:\d+(?:\.\d*)?|\.\d+)\s*?)(.+)/,

  /**
   * @property {RegExp}
   * Regular expression for capturing the value.
   * Only one capture which should correlate to the value portion
   */
  autoCompleteValueRE: /^((?:\d+(?:\.\d*)?|\.\d+))/,

  /**
   * Overrides the parent to skip the connections and alter the base capture RegExp's to account for localization
   */
  init: function init() {
    // do not use lookups connects

    const numberDecimalSeparator = Mobile.CultureInfo.numberFormat.numberDecimalSeparator;

    this.autoCompletePhraseRE = new RegExp(
      string.substitute('^((?:\\d+(?:\\${0}\\d*)?|\\${0}\\d+)\\s*?)(.+)', [numberDecimalSeparator])
    );

    this.autoCompleteValueRE = new RegExp(
      string.substitute('^((?:\\d+(?:\\${0}\\d*)?|\\${0}\\d+))', [numberDecimalSeparator])
    );
  },
  /**
   * Handler for onkeyup on the input. The logic for comparing the matched value and phrase to the autocomplete
   * is done here.
   * @param {Event} evt onkeyup
   * @private
   */
  _onKeyUp: function _onKeyUp(/*evt*/) {
    const val = this.inputNode.value.toString();
    const match = this.autoCompletePhraseRE.exec(val);

    if (!match || val.length < 1) {
      this.hideAutoComplete();
      return true;
    }

    for (const key in this.autoCompleteText) {
      if (this.isWordMatch(match[2], this.autoCompleteText[key])) {
        this.currentKey = this.autoCompleteText[key];
        this.showAutoComplete(match[1] + this.autoCompleteText[key]);
        return true;
      }
    }

    this.hideAutoComplete();
  },
  /**
   * Determines if the two provided values are the same word, ignoring capitalization and length:
   *
   * * h, hour(s) = true
   * * hou, hour(s) = true
   * * minn, minute(s) = false
   * * year, year(s) = true
   *
   * @param {String} val First string to compare
   * @param {String} word Second string to compare
   * @return {Boolean} True if they are equal.
   */
  isWordMatch: function isWordMatch(val, word) {
    let newVal = val;
    let newWord = word;

    if (newVal.length > newWord.length) {
      newVal = newVal.slice(0, newWord.length);
    } else {
      newWord = newWord.slice(0, newVal.length);
    }

    return newVal.toUpperCase() === newWord.toUpperCase();
  },
  /**
   * Shows the auto-complete version of the phrase
   * @param {String} word Text to put in the autocomplete
   */
  showAutoComplete: function showAutoComplete(word) {
    this.set('autoCompleteContent', word);
  },
  /**
   * Clears the autocomplete input
   */
  hideAutoComplete: function hideAutoComplete() {
    this.set('autoCompleteContent', '');
  },
  /**
   * Inputs onblur handler, if an auto complete is matched it fills the text out the full text
   * @param evt
   * @return {Boolean}
   * @private
   */
  _onBlur: function _onBlur(/*evt*/) {
    const val = this.inputNode.value.toString();
    const match = this.autoCompleteValueRE.exec(val);
    const multiplier = this.getMultiplier(this.currentKey);
    let newValue = 0;

    if (val.length < 1) {
      return true;
    }

    if (!match) {
      return true;
    }

    newValue = parseFloat(match[0]) * multiplier;
    this.setValue(newValue);
  },
  /**
   * Returns the corresponding value in minutes to the passed key (currentKey)
   * @return {Number}
   */
  getMultiplier: function getMultiplier(key) {
    let k;
    for (k in this.autoCompleteText) {
      if (this.autoCompleteText.hasOwnProperty(k) && key === this.autoCompleteText[k]) {
        break;
      }
    }
    return k;
  },
  /**
   * Returns the current value in minutes
   * @return {Number}
   */
  getValue: function getValue() {
    return this.currentValue;
  },
  /**
   * Sets the currentValue to the passed value, but sets the displayed value after formatting with {@link #textFormat textFormat}.
   * @param {Number} val Number of minutes
   * @param init
   */
  setValue: function setValue(val = 0/*, init*/) {
    let newVal = val;
    if (newVal === null) {
      newVal = 0;
    }

    this.currentValue = newVal;
    this.set('inputValue', this.textFormat(newVal));
    this.hideAutoComplete();
  },
  /**
   * If used as a Lookup, this is invoked with the value of the lookup item.
   * @param val
   * @param {String/Number} key Number of minutes (will be converted via parseFloat)
   */
  setSelection: function setSelection(val, key) {
    this.setValue(parseFloat(key));
  },
  /**
   * Takes the number of minutes and converts it into a textual representation using the `autoCompleteText`
   * collection as aguide
   * @param {Number} val Number of minutes
   * @return {String}
   */
  textFormat: function textFormat(val) {
    let finalUnit = 1;
    const autoCompleteValues = this.autoCompleteText;

    for (const key in autoCompleteValues) {
      if (autoCompleteValues.hasOwnProperty(key)) {
        const stepValue = parseInt(key, 10);
        if (val === 0 && stepValue === 1) {
          this.currentKey = autoCompleteValues[key];
          break;
        }

        if (val / stepValue >= 1) {
          finalUnit = stepValue;
          this.currentKey = autoCompleteValues[key];
        }
      }
    }

    return this.formatUnit(this.convertUnit(val, finalUnit));
  },
  /**
   * Divides two numbers and fixes the decimal point to two places.
   * @param {Number} val
   * @param {Number} to
   * @return {Number}
   */
  convertUnit: function convertUnit(val, to) {
    return format.fixed(val / to, 2);
  },
  /**
   * Formats the unit with correct decimal separator.
   * @param {Number} unit
   * @return {string}
   */
  formatUnit: function formatUnit(unit) {
    let sval;
    if (isNaN(unit)) {
      sval = '0';
    } else {
      sval = unit.toString().split('.');
      if (sval.length === 1) {
        sval = sval[0];
      } else {
        if (sval[1] === '0') {
          sval = sval[0];
        } else {
          sval = string.substitute('${0}${1}${2}', [
            sval[0],
            Mobile.CultureInfo.numberFormat.currencyDecimalSeparator || '.',
            sval[1],
          ]);
        }
      }
    }
    return sval + ' ' + this.currentKey;
  },
  /**
   * Extends the {@link LookupField#createNavigationOptions parent implementation} to explicitly set hide search
   * to true and data to `this.data`.
   * @return {Object} Navigation options object to be passed
   */
  createNavigationOptions: function createNavigationOptions() {
    const options = this.inherited(arguments);
    options.hideSearch = true;
    options.data = this.expandExpression(this.data);
    return options;
  },
  /**
   * Validets the field by verifying it matches one of the auto complete text.
   * @return {Boolean} False for no-errors, true for error.
   */
  validate: function validate() {
    const val = this.inputNode.value.toString();
    const phraseMatch = this.autoCompletePhraseRE.exec(val);

    if (!phraseMatch) {
      domClass.add(this.containerNode, 'row-error');
      return string.substitute(this.invalidDurationErrorText, [val]);
    }

    domClass.remove(this.containerNode, 'row-error');
    return false;
  },
});

lang.setObject('Sage.Platform.Mobile.Fields.DurationField', control);
export default FieldManager.register('duration', control);
