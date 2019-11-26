define('argos/Fields/DurationField', ['module', 'exports', 'dojo/_base/declare', 'dojo/string', '../Format', './LookupField', '../FieldManager', '../I18n'], function (module, exports, _declare, _string, _Format, _LookupField, _FieldManager, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _string2 = _interopRequireDefault(_string);

  var _Format2 = _interopRequireDefault(_Format);

  var _LookupField2 = _interopRequireDefault(_LookupField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var resource = (0, _I18n2.default)('durationField');

  /**
   * @class argos.Fields.DurationField
   * @classdesc The Duration field is a mashup of an auto-complete box and a {@link LookupField LookupField} for handling
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
   * @example
   *     {
   *         name: 'Duration',
   *         property: 'Duration',
   *         label: this.durationText,
   *         type: 'duration',
   *         view: 'durations_list'
   *     }
   *
   * @extends argos.Fields.LookupField
   * @requires argos.FieldManager
   */
  var control = (0, _declare2.default)('argos.Fields.DurationField', [_LookupField2.default], /** @lends argos.Fields.DurationField# */{
    /**
     * Maps various attributes of nodes to setters.
     */
    attributeMap: {
      inputValue: {
        node: 'inputNode',
        type: 'attribute',
        attribute: 'value'
      },
      inputDisabled: {
        node: 'inputNode',
        type: 'attribute',
        attribute: 'disabled'
      },
      autoCompleteContent: {
        node: 'autoCompleteNode',
        type: 'attribute',
        attribute: 'innerHTML'
      }
    },
    /**
     * @property {Simplate}
     * Simplate that defines the fields HTML Markup
     *
     * * `$` => Field instance
     * * `$$` => Owner View instance
     *
     */
    widgetTemplate: new Simplate(['<label for="{%= $.name %}">{%: $.label %}</label>\n    <div class="field field-control-wrapper">\n      <div class="autoComplete-watermark" data-dojo-attach-point="autoCompleteNode"></div>\n      <button\n        class="button field-control-trigger simpleSubHeaderButton {% if ($$.iconClass) { %} {%: $$.iconClass %} {% } %}"\n        data-dojo-attach-event="onclick:navigateToListView"\n        aria-label="{%: $.lookupLabelText %}">\n        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-{%: $.iconClass %}"></use>\n        </svg>\n      </button>\n      <input data-dojo-attach-point="inputNode" data-dojo-attach-event="onkeyup: _onKeyUp, onblur: _onBlur, onfocus: _onFocus" class="" type="{%: $.inputType %}" name="{%= $.name %}" {% if ($.readonly) { %} readonly {% } %}>\n    </div>']),
    iconClass: 'more',

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
      525960: resource.years
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

      var numberDecimalSeparator = Mobile.CultureInfo.numberFormat.numberDecimalSeparator;

      this.autoCompletePhraseRE = new RegExp(_string2.default.substitute('^((?:\\d+(?:\\${0}\\d*)?|\\${0}\\d+)\\s*?)(.+)', [numberDecimalSeparator]));

      this.autoCompleteValueRE = new RegExp(_string2.default.substitute('^((?:\\d+(?:\\${0}\\d*)?|\\${0}\\d+))', [numberDecimalSeparator]));
    },
    /**
     * Handler for onkeyup on the input. The logic for comparing the matched value and phrase to the autocomplete
     * is done here.
     * @param {Event} evt onkeyup
     * @private
     */
    _onKeyUp: function _onKeyUp() /* evt*/{
      var val = this.inputNode.value.toString();
      var match = this.autoCompletePhraseRE.exec(val);

      if (!match || val.length < 1) {
        this.hideAutoComplete();
        return true;
      }

      for (var key in this.autoCompleteText) {
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
      var newVal = val;
      var newWord = word;

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
    _onBlur: function _onBlur() /* evt*/{
      var val = this.inputNode.value.toString();
      var match = this.autoCompleteValueRE.exec(val);
      var multiplier = this.getMultiplier(this.currentKey);
      var newValue = 0;

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
      var k = void 0;
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
    setValue: function setValue() /* , init*/{
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var newVal = val;
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
      var finalUnit = 1;
      var autoCompleteValues = this.autoCompleteText;

      for (var key in autoCompleteValues) {
        if (autoCompleteValues.hasOwnProperty(key)) {
          var stepValue = parseInt(key, 10);
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
      return _Format2.default.fixed(val / to, 2);
    },
    /**
     * Formats the unit with correct decimal separator.
     * @param {Number} unit
     * @return {string}
     */
    formatUnit: function formatUnit(unit) {
      var sval = void 0;
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
            sval = _string2.default.substitute('${0}${1}${2}', [sval[0], Mobile.CultureInfo.numberFormat.currencyDecimalSeparator || '.', sval[1]]);
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
      var options = this.inherited(createNavigationOptions, arguments);
      options.hideSearch = true;
      options.data = this.expandExpression(this.data);
      return options;
    },
    /**
     * Validets the field by verifying it matches one of the auto complete text.
     * @return {Boolean} False for no-errors, true for error.
     */
    validate: function validate() {
      var val = this.inputNode.value.toString();
      var phraseMatch = this.autoCompletePhraseRE.exec(val);

      if (!phraseMatch) {
        $(this.containerNode).addClass('row-error');
        return _string2.default.substitute(this.invalidDurationErrorText, [val]);
      }

      $(this.containerNode).removeClass('row-error');
      return false;
    }
  });

  exports.default = _FieldManager2.default.register('duration', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvRHVyYXRpb25GaWVsZC5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsImNvbnRyb2wiLCJhdHRyaWJ1dGVNYXAiLCJpbnB1dFZhbHVlIiwibm9kZSIsInR5cGUiLCJhdHRyaWJ1dGUiLCJpbnB1dERpc2FibGVkIiwiYXV0b0NvbXBsZXRlQ29udGVudCIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJpY29uQ2xhc3MiLCJlbXB0eVRleHQiLCJpbnZhbGlkRHVyYXRpb25FcnJvclRleHQiLCJhdXRvQ29tcGxldGVUZXh0IiwibWludXRlcyIsImhvdXJzIiwiZGF5cyIsIndlZWtzIiwieWVhcnMiLCJ2YWx1ZUtleVByb3BlcnR5IiwidmFsdWVUZXh0UHJvcGVydHkiLCJjdXJyZW50S2V5IiwiY3VycmVudFZhbHVlIiwiYXV0b0NvbXBsZXRlUGhyYXNlUkUiLCJhdXRvQ29tcGxldGVWYWx1ZVJFIiwiaW5pdCIsIm51bWJlckRlY2ltYWxTZXBhcmF0b3IiLCJNb2JpbGUiLCJDdWx0dXJlSW5mbyIsIm51bWJlckZvcm1hdCIsIlJlZ0V4cCIsInN1YnN0aXR1dGUiLCJfb25LZXlVcCIsInZhbCIsImlucHV0Tm9kZSIsInZhbHVlIiwidG9TdHJpbmciLCJtYXRjaCIsImV4ZWMiLCJsZW5ndGgiLCJoaWRlQXV0b0NvbXBsZXRlIiwia2V5IiwiaXNXb3JkTWF0Y2giLCJzaG93QXV0b0NvbXBsZXRlIiwid29yZCIsIm5ld1ZhbCIsIm5ld1dvcmQiLCJzbGljZSIsInRvVXBwZXJDYXNlIiwic2V0IiwiX29uQmx1ciIsIm11bHRpcGxpZXIiLCJnZXRNdWx0aXBsaWVyIiwibmV3VmFsdWUiLCJwYXJzZUZsb2F0Iiwic2V0VmFsdWUiLCJrIiwiaGFzT3duUHJvcGVydHkiLCJnZXRWYWx1ZSIsInRleHRGb3JtYXQiLCJzZXRTZWxlY3Rpb24iLCJmaW5hbFVuaXQiLCJhdXRvQ29tcGxldGVWYWx1ZXMiLCJzdGVwVmFsdWUiLCJwYXJzZUludCIsImZvcm1hdFVuaXQiLCJjb252ZXJ0VW5pdCIsInRvIiwiZml4ZWQiLCJ1bml0Iiwic3ZhbCIsImlzTmFOIiwic3BsaXQiLCJjdXJyZW5jeURlY2ltYWxTZXBhcmF0b3IiLCJjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyIsIm9wdGlvbnMiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJoaWRlU2VhcmNoIiwiZGF0YSIsImV4cGFuZEV4cHJlc3Npb24iLCJ2YWxpZGF0ZSIsInBocmFzZU1hdGNoIiwiJCIsImNvbnRhaW5lck5vZGUiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxNQUFNQSxXQUFXLG9CQUFZLGVBQVosQ0FBakI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxNQUFNQyxVQUFVLHVCQUFRLDRCQUFSLEVBQXNDLHVCQUF0QyxFQUFxRCx5Q0FBeUM7QUFDNUc7OztBQUdBQyxrQkFBYztBQUNaQyxrQkFBWTtBQUNWQyxjQUFNLFdBREk7QUFFVkMsY0FBTSxXQUZJO0FBR1ZDLG1CQUFXO0FBSEQsT0FEQTtBQU1aQyxxQkFBZTtBQUNiSCxjQUFNLFdBRE87QUFFYkMsY0FBTSxXQUZPO0FBR2JDLG1CQUFXO0FBSEUsT0FOSDtBQVdaRSwyQkFBcUI7QUFDbkJKLGNBQU0sa0JBRGE7QUFFbkJDLGNBQU0sV0FGYTtBQUduQkMsbUJBQVc7QUFIUTtBQVhULEtBSjhGO0FBcUI1Rzs7Ozs7Ozs7QUFRQUcsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSxrNEJBQWIsQ0E3QjRGO0FBNEM1R0MsZUFBVyxNQTVDaUc7O0FBOEM1RztBQUNBOzs7O0FBSUFDLGVBQVdaLFNBQVNZLFNBbkR3RjtBQW9ENUc7Ozs7QUFJQUMsOEJBQTBCYixTQUFTYSx3QkF4RHlFO0FBeUQ1Rzs7Ozs7O0FBTUFDLHNCQUFrQjtBQUNoQixTQUFHZCxTQUFTZSxPQURJO0FBRWhCLFVBQUlmLFNB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QUFDQSxVQUFNOEMsY0FBYyxLQUFLM0Qsb0JBQUwsQ0FBMEJlLElBQTFCLENBQStCTCxHQUEvQixDQUFwQjs7QUFFQSxVQUFJLENBQUNpRCxXQUFMLEVBQWtCO0FBQ2hCQyxVQUFFLEtBQUtDLGFBQVAsRUFBc0JDLFFBQXRCLENBQStCLFdBQS9CO0FBQ0EsZUFBTyxpQkFBT3RELFVBQVAsQ0FBa0IsS0FBS25CLHdCQUF2QixFQUFpRCxDQUFDcUIsR0FBRCxDQUFqRCxDQUFQO0FBQ0Q7O0FBRURrRCxRQUFFLEtBQUtDLGFBQVAsRUFBc0JFLFdBQXRCLENBQWtDLFdBQWxDO0FBQ0EsYUFBTyxLQUFQO0FBQ0Q7QUF4VjJHLEdBQTlGLENBQWhCOztvQkEyVmUsdUJBQWFDLFFBQWIsQ0FBc0IsVUFBdEIsRUFBa0N2RixPQUFsQyxDIiwiZmlsZSI6IkR1cmF0aW9uRmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBzdHJpbmcgZnJvbSAnZG9qby9zdHJpbmcnO1xyXG5pbXBvcnQgZm9ybWF0IGZyb20gJy4uL0Zvcm1hdCc7XHJcbmltcG9ydCBMb29rdXBGaWVsZCBmcm9tICcuL0xvb2t1cEZpZWxkJztcclxuaW1wb3J0IEZpZWxkTWFuYWdlciBmcm9tICcuLi9GaWVsZE1hbmFnZXInO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcblxyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnZHVyYXRpb25GaWVsZCcpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5GaWVsZHMuRHVyYXRpb25GaWVsZFxyXG4gKiBAY2xhc3NkZXNjIFRoZSBEdXJhdGlvbiBmaWVsZCBpcyBhIG1hc2h1cCBvZiBhbiBhdXRvLWNvbXBsZXRlIGJveCBhbmQgYSB7QGxpbmsgTG9va3VwRmllbGQgTG9va3VwRmllbGR9IGZvciBoYW5kbGluZ1xyXG4gKiBkdXJhdGlvbidzIG9mOiBtaW51dGVzLCBob3VycywgZGF5cywgd2Vla3Mgb3IgeWVhcnMuIE1lYW5pbmcgYSB1c2VyIGNhbiB0eXBlIGRpcmVjdGx5IGludG8gdGhlIGlucHV0IGFyZWEgdGhlXHJcbiAqIGFtb3VudCBvZiB0aW1lIG9yIHByZXNzIHRoZSBsb29rdXAgYnV0dG9uIGFuZCBjaG9vc2UgZnJvbSBwcmUtZGV0ZXJtaW5lZCBsaXN0IG9mIHRpbWVzLlxyXG4gKlxyXG4gKiBXaGVuIHR5cGluZyBpbiBhIHZhbHVlIGRpcmVjdGx5LCB0aGUgRHVyYXRpb24gZmllbGQgb25seSBzdXBwb3J0cyBvbmUgXCJtZWFzdXJlbWVudFwiIG1lYW5pbmcgaWYgeW91IHdhbnRlZCB0b1xyXG4gKiBoYXZlIDEgaG91ciBhbmQgMzAgbWludXRlcyB5b3Ugd291bGQgbmVlZCB0byB0eXBlIGluIDkwIG1pbnV0ZXMgb3IgMS41IGhvdXJzLlxyXG4gKlxyXG4gKiBUaGUgYXV0by1jb21wbGV0ZSBoYXBwZW5zIG9uIGJsdXIsIHNvIGlmIGEgdXNlciB0eXBlcyBpbiA1bSB0aGV5IHdvdWxkIG5lZWQgdG8gZ28gdG8gdGhlIG5leHQgZmllbGQgKG9yIHByZXNzXHJcbiAqIFNhdmUpIGFuZCB0aGUgZmllbGQgd2lsbCBhdXRvLWNvbXBsZXRlIHRvIDUgbWludXRlKHMpLCBsZXR0aW5nIHRoZSB1c2VyIGtub3cgaXQgYWNjZXB0ZWQgdGhlIHZhbHVlLiBJZiBhIHZhbHVlXHJcbiAqIGVudGVyZWQgaXMgbm90IGFjY2VwdGVkLCA1YWJjLCBpdCB3aWxsIGRlZmF1bHQgdG8gdGhlIGxhc3Qga25vd24gbWVhc3VyZW1lbnQsIGRlZmF1bHRpbmcgdG8gbWludXRlcy5cclxuICpcclxuICogU2V0dGluZyBhbmQgZ2V0dGluZyB0aGUgdmFsdWUgaXMgYWx3YXlzIGluIG1pbnV0ZXMgYXMgYSBOdW1iZXIuXHJcbiAqXHJcbiAqIEBleGFtcGxlXHJcbiAqICAgICB7XHJcbiAqICAgICAgICAgbmFtZTogJ0R1cmF0aW9uJyxcclxuICogICAgICAgICBwcm9wZXJ0eTogJ0R1cmF0aW9uJyxcclxuICogICAgICAgICBsYWJlbDogdGhpcy5kdXJhdGlvblRleHQsXHJcbiAqICAgICAgICAgdHlwZTogJ2R1cmF0aW9uJyxcclxuICogICAgICAgICB2aWV3OiAnZHVyYXRpb25zX2xpc3QnXHJcbiAqICAgICB9XHJcbiAqXHJcbiAqIEBleHRlbmRzIGFyZ29zLkZpZWxkcy5Mb29rdXBGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRNYW5hZ2VyXHJcbiAqL1xyXG5jb25zdCBjb250cm9sID0gZGVjbGFyZSgnYXJnb3MuRmllbGRzLkR1cmF0aW9uRmllbGQnLCBbTG9va3VwRmllbGRdLCAvKiogQGxlbmRzIGFyZ29zLkZpZWxkcy5EdXJhdGlvbkZpZWxkIyAqL3tcclxuICAvKipcclxuICAgKiBNYXBzIHZhcmlvdXMgYXR0cmlidXRlcyBvZiBub2RlcyB0byBzZXR0ZXJzLlxyXG4gICAqL1xyXG4gIGF0dHJpYnV0ZU1hcDoge1xyXG4gICAgaW5wdXRWYWx1ZToge1xyXG4gICAgICBub2RlOiAnaW5wdXROb2RlJyxcclxuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXHJcbiAgICAgIGF0dHJpYnV0ZTogJ3ZhbHVlJyxcclxuICAgIH0sXHJcbiAgICBpbnB1dERpc2FibGVkOiB7XHJcbiAgICAgIG5vZGU6ICdpbnB1dE5vZGUnLFxyXG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcclxuICAgICAgYXR0cmlidXRlOiAnZGlzYWJsZWQnLFxyXG4gICAgfSxcclxuICAgIGF1dG9Db21wbGV0ZUNvbnRlbnQ6IHtcclxuICAgICAgbm9kZTogJ2F1dG9Db21wbGV0ZU5vZGUnLFxyXG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcclxuICAgICAgYXR0cmlidXRlOiAnaW5uZXJIVE1MJyxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFNpbXBsYXRlIHRoYXQgZGVmaW5lcyB0aGUgZmllbGRzIEhUTUwgTWFya3VwXHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBGaWVsZCBpbnN0YW5jZVxyXG4gICAqICogYCQkYCA9PiBPd25lciBWaWV3IGluc3RhbmNlXHJcbiAgICpcclxuICAgKi9cclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgIGA8bGFiZWwgZm9yPVwieyU9ICQubmFtZSAlfVwiPnslOiAkLmxhYmVsICV9PC9sYWJlbD5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZCBmaWVsZC1jb250cm9sLXdyYXBwZXJcIj5cclxuICAgICAgPGRpdiBjbGFzcz1cImF1dG9Db21wbGV0ZS13YXRlcm1hcmtcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiYXV0b0NvbXBsZXRlTm9kZVwiPjwvZGl2PlxyXG4gICAgICA8YnV0dG9uXHJcbiAgICAgICAgY2xhc3M9XCJidXR0b24gZmllbGQtY29udHJvbC10cmlnZ2VyIHNpbXBsZVN1YkhlYWRlckJ1dHRvbiB7JSBpZiAoJCQuaWNvbkNsYXNzKSB7ICV9IHslOiAkJC5pY29uQ2xhc3MgJX0geyUgfSAlfVwiXHJcbiAgICAgICAgZGF0YS1kb2pvLWF0dGFjaC1ldmVudD1cIm9uY2xpY2s6bmF2aWdhdGVUb0xpc3RWaWV3XCJcclxuICAgICAgICBhcmlhLWxhYmVsPVwieyU6ICQubG9va3VwTGFiZWxUZXh0ICV9XCI+XHJcbiAgICAgICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgIDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeGxpbms6aHJlZj1cIiNpY29uLXslOiAkLmljb25DbGFzcyAlfVwiPjwvdXNlPlxyXG4gICAgICAgIDwvc3ZnPlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgICAgPGlucHV0IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJpbnB1dE5vZGVcIiBkYXRhLWRvam8tYXR0YWNoLWV2ZW50PVwib25rZXl1cDogX29uS2V5VXAsIG9uYmx1cjogX29uQmx1ciwgb25mb2N1czogX29uRm9jdXNcIiBjbGFzcz1cIlwiIHR5cGU9XCJ7JTogJC5pbnB1dFR5cGUgJX1cIiBuYW1lPVwieyU9ICQubmFtZSAlfVwiIHslIGlmICgkLnJlYWRvbmx5KSB7ICV9IHJlYWRvbmx5IHslIH0gJX0+XHJcbiAgICA8L2Rpdj5gLFxyXG4gIF0pLFxyXG4gIGljb25DbGFzczogJ21vcmUnLFxyXG5cclxuICAvLyBMb2NhbGl6YXRpb25cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IHVzZWQgd2hlbiBubyB2YWx1ZSBvciBudWxsIGlzIHNldCB0byB0aGUgZmllbGRcclxuICAgKi9cclxuICBlbXB0eVRleHQ6IHJlc291cmNlLmVtcHR5VGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IGRpc3BsYXllZCB3aGVuIGFuIGludmFsaWQgaW5wdXQgaXMgZGV0ZWN0ZWRcclxuICAgKi9cclxuICBpbnZhbGlkRHVyYXRpb25FcnJvclRleHQ6IHJlc291cmNlLmludmFsaWREdXJhdGlvbkVycm9yVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgYXV0byBjb21wbGV0ZWQgdGV4dCBhbmQgdGhlaXIgY29ycmVzcG9uZGluZyB2YWx1ZXMgaW4gbWludXRlcyAoU0RhdGEgaXMgYWx3YXlzIG1pbnV0ZXMpXHJcbiAgICpcclxuICAgKiBPdmVycmlkZSByaWRlIHRoaXMgb2JqZWN0IHRvIGNoYW5nZSB0aGUgYXV0b2NvbXBsZXRlIHVuaXRzIG9yIHRoZWlyIGxvY2FsaXphdGlvbi5cclxuICAgKi9cclxuICBhdXRvQ29tcGxldGVUZXh0OiB7XHJcbiAgICAxOiByZXNvdXJjZS5taW51dGVzLFxyXG4gICAgNjA6IHJlc291cmNlLmhvdXJzLFxyXG4gICAgMTQ0MDogcmVzb3VyY2UuZGF5cyxcclxuICAgIDEwMDgwOiByZXNvdXJjZS53ZWVrcyxcclxuICAgIDUyNTk2MDogcmVzb3VyY2UueWVhcnMsXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogT3ZlcnJpZGVzIHRoZSB7QGxpbmsgTG9va3VwRmllbGQgTG9va3VwRmllbGR9IGRlZmF1bHQgdG8gZXhwbGljaXRseSBzZXQgaXQgdG8gZmFsc2UgZm9yY2luZ1xyXG4gICAqIHRoZSB2aWV3IHRvIHVzZSB0aGUgY3VycmVudFZhbHVlIGluc3RlYWQgb2YgYSBrZXkvZGVzY3JpcHRvclxyXG4gICAqL1xyXG4gIHZhbHVlS2V5UHJvcGVydHk6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBPdmVycmlkZXMgdGhlIHtAbGluayBMb29rdXBGaWVsZCBMb29rdXBGaWVsZH0gZGVmYXVsdCB0byBleHBsaWNpdGx5IHNldCBpdCB0byBmYWxzZSBmb3JjaW5nXHJcbiAgICogdGhlIHZpZXcgdG8gdXNlIHRoZSBjdXJyZW50VmFsdWUgaW5zdGVhZCBvZiBhIGtleS9kZXNjcmlwdG9yXHJcbiAgICovXHJcbiAgdmFsdWVUZXh0UHJvcGVydHk6IGZhbHNlLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgY3VycmVudCB1bml0IGFzIGRldGVjdGVkIGJ5IHRoZSBwYXJzZXJcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIGN1cnJlbnRLZXk6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9XHJcbiAgICogVGhlIGN1cnJlbnQgdmFsdWUsIGV4cHJlc3NlZCBhcyBtaW51dGVzLlxyXG4gICAqL1xyXG4gIGN1cnJlbnRWYWx1ZTogMCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtSZWdFeHB9XHJcbiAgICogUmVndWxhciBleHByZXNzaW9uIGZvciBjYXB0dXJpbmcgdGhlIHBocmFzZSAodGV4dCkuXHJcbiAgICpcclxuICAgKiBUaGUgZmlyc3QgY2FwdHVyZSBncm91cCBtdXN0IGJlIG5vbi10ZXh0IHBhcnRcclxuICAgKiBTZWNvbmQgY2FwdHVyZSBpcyB0aGUgcGhyYXNlIHRvIGJlIHVzZWQgaW4gYXV0byBjb21wbGV0ZVxyXG4gICAqL1xyXG4gIGF1dG9Db21wbGV0ZVBocmFzZVJFOiAvXigoPzpcXGQrKD86XFwuXFxkKik/fFxcLlxcZCspXFxzKj8pKC4rKS8sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7UmVnRXhwfVxyXG4gICAqIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgY2FwdHVyaW5nIHRoZSB2YWx1ZS5cclxuICAgKiBPbmx5IG9uZSBjYXB0dXJlIHdoaWNoIHNob3VsZCBjb3JyZWxhdGUgdG8gdGhlIHZhbHVlIHBvcnRpb25cclxuICAgKi9cclxuICBhdXRvQ29tcGxldGVWYWx1ZVJFOiAvXigoPzpcXGQrKD86XFwuXFxkKik/fFxcLlxcZCspKS8sXHJcblxyXG4gIC8qKlxyXG4gICAqIE92ZXJyaWRlcyB0aGUgcGFyZW50IHRvIHNraXAgdGhlIGNvbm5lY3Rpb25zIGFuZCBhbHRlciB0aGUgYmFzZSBjYXB0dXJlIFJlZ0V4cCdzIHRvIGFjY291bnQgZm9yIGxvY2FsaXphdGlvblxyXG4gICAqL1xyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICAvLyBkbyBub3QgdXNlIGxvb2t1cHMgY29ubmVjdHNcclxuXHJcbiAgICBjb25zdCBudW1iZXJEZWNpbWFsU2VwYXJhdG9yID0gTW9iaWxlLkN1bHR1cmVJbmZvLm51bWJlckZvcm1hdC5udW1iZXJEZWNpbWFsU2VwYXJhdG9yO1xyXG5cclxuICAgIHRoaXMuYXV0b0NvbXBsZXRlUGhyYXNlUkUgPSBuZXcgUmVnRXhwKFxyXG4gICAgICBzdHJpbmcuc3Vic3RpdHV0ZSgnXigoPzpcXFxcZCsoPzpcXFxcJHswfVxcXFxkKik/fFxcXFwkezB9XFxcXGQrKVxcXFxzKj8pKC4rKScsIFtudW1iZXJEZWNpbWFsU2VwYXJhdG9yXSlcclxuICAgICk7XHJcblxyXG4gICAgdGhpcy5hdXRvQ29tcGxldGVWYWx1ZVJFID0gbmV3IFJlZ0V4cChcclxuICAgICAgc3RyaW5nLnN1YnN0aXR1dGUoJ14oKD86XFxcXGQrKD86XFxcXCR7MH1cXFxcZCopP3xcXFxcJHswfVxcXFxkKykpJywgW251bWJlckRlY2ltYWxTZXBhcmF0b3JdKVxyXG4gICAgKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIG9ua2V5dXAgb24gdGhlIGlucHV0LiBUaGUgbG9naWMgZm9yIGNvbXBhcmluZyB0aGUgbWF0Y2hlZCB2YWx1ZSBhbmQgcGhyYXNlIHRvIHRoZSBhdXRvY29tcGxldGVcclxuICAgKiBpcyBkb25lIGhlcmUuXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IG9ua2V5dXBcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIF9vbktleVVwOiBmdW5jdGlvbiBfb25LZXlVcCgvKiBldnQqLykge1xyXG4gICAgY29uc3QgdmFsID0gdGhpcy5pbnB1dE5vZGUudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1hdGNoID0gdGhpcy5hdXRvQ29tcGxldGVQaHJhc2VSRS5leGVjKHZhbCk7XHJcblxyXG4gICAgaWYgKCFtYXRjaCB8fCB2YWwubGVuZ3RoIDwgMSkge1xyXG4gICAgICB0aGlzLmhpZGVBdXRvQ29tcGxldGUoKTtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gdGhpcy5hdXRvQ29tcGxldGVUZXh0KSB7XHJcbiAgICAgIGlmICh0aGlzLmlzV29yZE1hdGNoKG1hdGNoWzJdLCB0aGlzLmF1dG9Db21wbGV0ZVRleHRba2V5XSkpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRLZXkgPSB0aGlzLmF1dG9Db21wbGV0ZVRleHRba2V5XTtcclxuICAgICAgICB0aGlzLnNob3dBdXRvQ29tcGxldGUobWF0Y2hbMV0gKyB0aGlzLmF1dG9Db21wbGV0ZVRleHRba2V5XSk7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhpZGVBdXRvQ29tcGxldGUoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgdGhlIHR3byBwcm92aWRlZCB2YWx1ZXMgYXJlIHRoZSBzYW1lIHdvcmQsIGlnbm9yaW5nIGNhcGl0YWxpemF0aW9uIGFuZCBsZW5ndGg6XHJcbiAgICpcclxuICAgKiAqIGgsIGhvdXIocykgPSB0cnVlXHJcbiAgICogKiBob3UsIGhvdXIocykgPSB0cnVlXHJcbiAgICogKiBtaW5uLCBtaW51dGUocykgPSBmYWxzZVxyXG4gICAqICogeWVhciwgeWVhcihzKSA9IHRydWVcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWwgRmlyc3Qgc3RyaW5nIHRvIGNvbXBhcmVcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gd29yZCBTZWNvbmQgc3RyaW5nIHRvIGNvbXBhcmVcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHRoZXkgYXJlIGVxdWFsLlxyXG4gICAqL1xyXG4gIGlzV29yZE1hdGNoOiBmdW5jdGlvbiBpc1dvcmRNYXRjaCh2YWwsIHdvcmQpIHtcclxuICAgIGxldCBuZXdWYWwgPSB2YWw7XHJcbiAgICBsZXQgbmV3V29yZCA9IHdvcmQ7XHJcblxyXG4gICAgaWYgKG5ld1ZhbC5sZW5ndGggPiBuZXdXb3JkLmxlbmd0aCkge1xyXG4gICAgICBuZXdWYWwgPSBuZXdWYWwuc2xpY2UoMCwgbmV3V29yZC5sZW5ndGgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgbmV3V29yZCA9IG5ld1dvcmQuc2xpY2UoMCwgbmV3VmFsLmxlbmd0aCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIG5ld1ZhbC50b1VwcGVyQ2FzZSgpID09PSBuZXdXb3JkLnRvVXBwZXJDYXNlKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTaG93cyB0aGUgYXV0by1jb21wbGV0ZSB2ZXJzaW9uIG9mIHRoZSBwaHJhc2VcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gd29yZCBUZXh0IHRvIHB1dCBpbiB0aGUgYXV0b2NvbXBsZXRlXHJcbiAgICovXHJcbiAgc2hvd0F1dG9Db21wbGV0ZTogZnVuY3Rpb24gc2hvd0F1dG9Db21wbGV0ZSh3b3JkKSB7XHJcbiAgICB0aGlzLnNldCgnYXV0b0NvbXBsZXRlQ29udGVudCcsIHdvcmQpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2xlYXJzIHRoZSBhdXRvY29tcGxldGUgaW5wdXRcclxuICAgKi9cclxuICBoaWRlQXV0b0NvbXBsZXRlOiBmdW5jdGlvbiBoaWRlQXV0b0NvbXBsZXRlKCkge1xyXG4gICAgdGhpcy5zZXQoJ2F1dG9Db21wbGV0ZUNvbnRlbnQnLCAnJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBJbnB1dHMgb25ibHVyIGhhbmRsZXIsIGlmIGFuIGF1dG8gY29tcGxldGUgaXMgbWF0Y2hlZCBpdCBmaWxscyB0aGUgdGV4dCBvdXQgdGhlIGZ1bGwgdGV4dFxyXG4gICAqIEBwYXJhbSBldnRcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgX29uQmx1cjogZnVuY3Rpb24gX29uQmx1cigvKiBldnQqLykge1xyXG4gICAgY29uc3QgdmFsID0gdGhpcy5pbnB1dE5vZGUudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IG1hdGNoID0gdGhpcy5hdXRvQ29tcGxldGVWYWx1ZVJFLmV4ZWModmFsKTtcclxuICAgIGNvbnN0IG11bHRpcGxpZXIgPSB0aGlzLmdldE11bHRpcGxpZXIodGhpcy5jdXJyZW50S2V5KTtcclxuICAgIGxldCBuZXdWYWx1ZSA9IDA7XHJcblxyXG4gICAgaWYgKHZhbC5sZW5ndGggPCAxKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghbWF0Y2gpIHtcclxuICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgbmV3VmFsdWUgPSBwYXJzZUZsb2F0KG1hdGNoWzBdKSAqIG11bHRpcGxpZXI7XHJcbiAgICB0aGlzLnNldFZhbHVlKG5ld1ZhbHVlKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGNvcnJlc3BvbmRpbmcgdmFsdWUgaW4gbWludXRlcyB0byB0aGUgcGFzc2VkIGtleSAoY3VycmVudEtleSlcclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0TXVsdGlwbGllcjogZnVuY3Rpb24gZ2V0TXVsdGlwbGllcihrZXkpIHtcclxuICAgIGxldCBrO1xyXG4gICAgZm9yIChrIGluIHRoaXMuYXV0b0NvbXBsZXRlVGV4dCkge1xyXG4gICAgICBpZiAodGhpcy5hdXRvQ29tcGxldGVUZXh0Lmhhc093blByb3BlcnR5KGspICYmIGtleSA9PT0gdGhpcy5hdXRvQ29tcGxldGVUZXh0W2tdKSB7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBrO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB2YWx1ZSBpbiBtaW51dGVzXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRWYWx1ZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGN1cnJlbnRWYWx1ZSB0byB0aGUgcGFzc2VkIHZhbHVlLCBidXQgc2V0cyB0aGUgZGlzcGxheWVkIHZhbHVlIGFmdGVyIGZvcm1hdHRpbmcgd2l0aCB7QGxpbmsgI3RleHRGb3JtYXQgdGV4dEZvcm1hdH0uXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbCBOdW1iZXIgb2YgbWludXRlc1xyXG4gICAqIEBwYXJhbSBpbml0XHJcbiAgICovXHJcbiAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKHZhbCA9IDAvKiAsIGluaXQqLykge1xyXG4gICAgbGV0IG5ld1ZhbCA9IHZhbDtcclxuICAgIGlmIChuZXdWYWwgPT09IG51bGwpIHtcclxuICAgICAgbmV3VmFsID0gMDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IG5ld1ZhbDtcclxuICAgIHRoaXMuc2V0KCdpbnB1dFZhbHVlJywgdGhpcy50ZXh0Rm9ybWF0KG5ld1ZhbCkpO1xyXG4gICAgdGhpcy5oaWRlQXV0b0NvbXBsZXRlKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBJZiB1c2VkIGFzIGEgTG9va3VwLCB0aGlzIGlzIGludm9rZWQgd2l0aCB0aGUgdmFsdWUgb2YgdGhlIGxvb2t1cCBpdGVtLlxyXG4gICAqIEBwYXJhbSB2YWxcclxuICAgKiBAcGFyYW0ge1N0cmluZy9OdW1iZXJ9IGtleSBOdW1iZXIgb2YgbWludXRlcyAod2lsbCBiZSBjb252ZXJ0ZWQgdmlhIHBhcnNlRmxvYXQpXHJcbiAgICovXHJcbiAgc2V0U2VsZWN0aW9uOiBmdW5jdGlvbiBzZXRTZWxlY3Rpb24odmFsLCBrZXkpIHtcclxuICAgIHRoaXMuc2V0VmFsdWUocGFyc2VGbG9hdChrZXkpKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIHRoZSBudW1iZXIgb2YgbWludXRlcyBhbmQgY29udmVydHMgaXQgaW50byBhIHRleHR1YWwgcmVwcmVzZW50YXRpb24gdXNpbmcgdGhlIGBhdXRvQ29tcGxldGVUZXh0YFxyXG4gICAqIGNvbGxlY3Rpb24gYXMgYWd1aWRlXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbCBOdW1iZXIgb2YgbWludXRlc1xyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgKi9cclxuICB0ZXh0Rm9ybWF0OiBmdW5jdGlvbiB0ZXh0Rm9ybWF0KHZhbCkge1xyXG4gICAgbGV0IGZpbmFsVW5pdCA9IDE7XHJcbiAgICBjb25zdCBhdXRvQ29tcGxldGVWYWx1ZXMgPSB0aGlzLmF1dG9Db21wbGV0ZVRleHQ7XHJcblxyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gYXV0b0NvbXBsZXRlVmFsdWVzKSB7XHJcbiAgICAgIGlmIChhdXRvQ29tcGxldGVWYWx1ZXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIGNvbnN0IHN0ZXBWYWx1ZSA9IHBhcnNlSW50KGtleSwgMTApO1xyXG4gICAgICAgIGlmICh2YWwgPT09IDAgJiYgc3RlcFZhbHVlID09PSAxKSB7XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRLZXkgPSBhdXRvQ29tcGxldGVWYWx1ZXNba2V5XTtcclxuICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHZhbCAvIHN0ZXBWYWx1ZSA+PSAxKSB7XHJcbiAgICAgICAgICBmaW5hbFVuaXQgPSBzdGVwVmFsdWU7XHJcbiAgICAgICAgICB0aGlzLmN1cnJlbnRLZXkgPSBhdXRvQ29tcGxldGVWYWx1ZXNba2V5XTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5mb3JtYXRVbml0KHRoaXMuY29udmVydFVuaXQodmFsLCBmaW5hbFVuaXQpKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERpdmlkZXMgdHdvIG51bWJlcnMgYW5kIGZpeGVzIHRoZSBkZWNpbWFsIHBvaW50IHRvIHR3byBwbGFjZXMuXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHZhbFxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB0b1xyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBjb252ZXJ0VW5pdDogZnVuY3Rpb24gY29udmVydFVuaXQodmFsLCB0bykge1xyXG4gICAgcmV0dXJuIGZvcm1hdC5maXhlZCh2YWwgLyB0bywgMik7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBGb3JtYXRzIHRoZSB1bml0IHdpdGggY29ycmVjdCBkZWNpbWFsIHNlcGFyYXRvci5cclxuICAgKiBAcGFyYW0ge051bWJlcn0gdW5pdFxyXG4gICAqIEByZXR1cm4ge3N0cmluZ31cclxuICAgKi9cclxuICBmb3JtYXRVbml0OiBmdW5jdGlvbiBmb3JtYXRVbml0KHVuaXQpIHtcclxuICAgIGxldCBzdmFsO1xyXG4gICAgaWYgKGlzTmFOKHVuaXQpKSB7XHJcbiAgICAgIHN2YWwgPSAnMCc7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBzdmFsID0gdW5pdC50b1N0cmluZygpLnNwbGl0KCcuJyk7XHJcbiAgICAgIGlmIChzdmFsLmxlbmd0aCA9PT0gMSkge1xyXG4gICAgICAgIHN2YWwgPSBzdmFsWzBdO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChzdmFsWzFdID09PSAnMCcpIHtcclxuICAgICAgICAgIHN2YWwgPSBzdmFsWzBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzdmFsID0gc3RyaW5nLnN1YnN0aXR1dGUoJyR7MH0kezF9JHsyfScsIFtcclxuICAgICAgICAgICAgc3ZhbFswXSxcclxuICAgICAgICAgICAgTW9iaWxlLkN1bHR1cmVJbmZvLm51bWJlckZvcm1hdC5jdXJyZW5jeURlY2ltYWxTZXBhcmF0b3IgfHwgJy4nLFxyXG4gICAgICAgICAgICBzdmFsWzFdLFxyXG4gICAgICAgICAgXSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYCR7c3ZhbH0gJHt0aGlzLmN1cnJlbnRLZXl9YDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHtAbGluayBMb29rdXBGaWVsZCNjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyBwYXJlbnQgaW1wbGVtZW50YXRpb259IHRvIGV4cGxpY2l0bHkgc2V0IGhpZGUgc2VhcmNoXHJcbiAgICogdG8gdHJ1ZSBhbmQgZGF0YSB0byBgdGhpcy5kYXRhYC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE5hdmlnYXRpb24gb3B0aW9ucyBvYmplY3QgdG8gYmUgcGFzc2VkXHJcbiAgICovXHJcbiAgY3JlYXRlTmF2aWdhdGlvbk9wdGlvbnM6IGZ1bmN0aW9uIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zKCkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuaW5oZXJpdGVkKGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zLCBhcmd1bWVudHMpO1xyXG4gICAgb3B0aW9ucy5oaWRlU2VhcmNoID0gdHJ1ZTtcclxuICAgIG9wdGlvbnMuZGF0YSA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbih0aGlzLmRhdGEpO1xyXG4gICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBWYWxpZGV0cyB0aGUgZmllbGQgYnkgdmVyaWZ5aW5nIGl0IG1hdGNoZXMgb25lIG9mIHRoZSBhdXRvIGNvbXBsZXRlIHRleHQuXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gRmFsc2UgZm9yIG5vLWVycm9ycywgdHJ1ZSBmb3IgZXJyb3IuXHJcbiAgICovXHJcbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xyXG4gICAgY29uc3QgdmFsID0gdGhpcy5pbnB1dE5vZGUudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IHBocmFzZU1hdGNoID0gdGhpcy5hdXRvQ29tcGxldGVQaHJhc2VSRS5leGVjKHZhbCk7XHJcblxyXG4gICAgaWYgKCFwaHJhc2VNYXRjaCkge1xyXG4gICAgICAkKHRoaXMuY29udGFpbmVyTm9kZSkuYWRkQ2xhc3MoJ3Jvdy1lcnJvcicpO1xyXG4gICAgICByZXR1cm4gc3RyaW5nLnN1YnN0aXR1dGUodGhpcy5pbnZhbGlkRHVyYXRpb25FcnJvclRleHQsIFt2YWxdKTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuY29udGFpbmVyTm9kZSkucmVtb3ZlQ2xhc3MoJ3Jvdy1lcnJvcicpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGRNYW5hZ2VyLnJlZ2lzdGVyKCdkdXJhdGlvbicsIGNvbnRyb2wpO1xyXG4iXX0=