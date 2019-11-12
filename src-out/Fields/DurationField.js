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
      var options = this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvRHVyYXRpb25GaWVsZC5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsImNvbnRyb2wiLCJhdHRyaWJ1dGVNYXAiLCJpbnB1dFZhbHVlIiwibm9kZSIsInR5cGUiLCJhdHRyaWJ1dGUiLCJpbnB1dERpc2FibGVkIiwiYXV0b0NvbXBsZXRlQ29udGVudCIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJpY29uQ2xhc3MiLCJlbXB0eVRleHQiLCJpbnZhbGlkRHVyYXRpb25FcnJvclRleHQiLCJhdXRvQ29tcGxldGVUZXh0IiwibWludXRlcyIsImhvdXJzIiwiZGF5cyIsIndlZWtzIiwieWVhcnMiLCJ2YWx1ZUtleVByb3BlcnR5IiwidmFsdWVUZXh0UHJvcGVydHkiLCJjdXJyZW50S2V5IiwiY3VycmVudFZhbHVlIiwiYXV0b0NvbXBsZXRlUGhyYXNlUkUiLCJhdXRvQ29tcGxldGVWYWx1ZVJFIiwiaW5pdCIsIm51bWJlckRlY2ltYWxTZXBhcmF0b3IiLCJNb2JpbGUiLCJDdWx0dXJlSW5mbyIsIm51bWJlckZvcm1hdCIsIlJlZ0V4cCIsInN1YnN0aXR1dGUiLCJfb25LZXlVcCIsInZhbCIsImlucHV0Tm9kZSIsInZhbHVlIiwidG9TdHJpbmciLCJtYXRjaCIsImV4ZWMiLCJsZW5ndGgiLCJoaWRlQXV0b0NvbXBsZXRlIiwia2V5IiwiaXNXb3JkTWF0Y2giLCJzaG93QXV0b0NvbXBsZXRlIiwid29yZCIsIm5ld1ZhbCIsIm5ld1dvcmQiLCJzbGljZSIsInRvVXBwZXJDYXNlIiwic2V0IiwiX29uQmx1ciIsIm11bHRpcGxpZXIiLCJnZXRNdWx0aXBsaWVyIiwibmV3VmFsdWUiLCJwYXJzZUZsb2F0Iiwic2V0VmFsdWUiLCJrIiwiaGFzT3duUHJvcGVydHkiLCJnZXRWYWx1ZSIsInRleHRGb3JtYXQiLCJzZXRTZWxlY3Rpb24iLCJmaW5hbFVuaXQiLCJhdXRvQ29tcGxldGVWYWx1ZXMiLCJzdGVwVmFsdWUiLCJwYXJzZUludCIsImZvcm1hdFVuaXQiLCJjb252ZXJ0VW5pdCIsInRvIiwiZml4ZWQiLCJ1bml0Iiwic3ZhbCIsImlzTmFOIiwic3BsaXQiLCJjdXJyZW5jeURlY2ltYWxTZXBhcmF0b3IiLCJjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyIsIm9wdGlvbnMiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJoaWRlU2VhcmNoIiwiZGF0YSIsImV4cGFuZEV4cHJlc3Npb24iLCJ2YWxpZGF0ZSIsInBocmFzZU1hdGNoIiwiJCIsImNvbnRhaW5lck5vZGUiLCJhZGRDbGFzcyIsInJlbW92ZUNsYXNzIiwicmVnaXN0ZXIiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQXVCQSxNQUFNQSxXQUFXLG9CQUFZLGVBQVosQ0FBakI7O0FBRUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxNQUFNQyxVQUFVLHVCQUFRLDRCQUFSLEVBQXNDLHVCQUF0QyxFQUFxRCx5Q0FBeUM7QUFDNUc7OztBQUdBQyxrQkFBYztBQUNaQyxrQkFBWTtBQUNWQyxjQUFNLFdBREk7QUFFVkMsY0FBTSxXQUZJO0FBR1ZDLG1CQUFXO0FBSEQsT0FEQTtBQU1aQyxxQkFBZTtBQUNiSCxjQUFNLFdBRE87QUFFYkMsY0FBTSxXQUZPO0FBR2JDLG1CQUFXO0FBSEUsT0FOSDtBQVdaRSwyQkFBcUI7QUFDbkJKLGNBQU0sa0JBRGE7QUFFbkJDLGNBQU0sV0FGYTtBQUduQkMsbUJBQVc7QUFIUTtBQVhULEtBSjhGO0FBcUI1Rzs7Ozs7Ozs7QUFRQUcsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSxrNEJBQWIsQ0E3QjRGO0FBNEM1R0MsZUFBVyxNQTVDaUc7O0FBOEM1RztBQUNBOzs7O0FBSUFDLGVBQVdaLFNBQVNZLFNBbkR3RjtBQW9ENUc7Ozs7QUFJQUMsOEJBQTBCYixTQUFTYSx3QkF4RHlFO0FBeUQ1Rzs7Ozs7O0FBTUFDLHNCQUFrQjtBQUNoQixTQUFHZCxTQUFTZSxPQURJO0FBRWhCLFVBQUlmLFNB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QWMsS0FBSzNELG9CQUFMLENBQTBCZSxJQUExQixDQUErQkwsR0FBL0IsQ0FBcEI7O0FBRUEsVUFBSSxDQUFDaUQsV0FBTCxFQUFrQjtBQUNoQkMsVUFBRSxLQUFLQyxhQUFQLEVBQXNCQyxRQUF0QixDQUErQixXQUEvQjtBQUNBLGVBQU8saUJBQU90RCxVQUFQLENBQWtCLEtBQUtuQix3QkFBdkIsRUFBaUQsQ0FBQ3FCLEdBQUQsQ0FBakQsQ0FBUDtBQUNEOztBQUVEa0QsUUFBRSxLQUFLQyxhQUFQLEVBQXNCRSxXQUF0QixDQUFrQyxXQUFsQztBQUNBLGFBQU8sS0FBUDtBQUNEO0FBeFYyRyxHQUE5RixDQUFoQjs7b0JBMlZlLHVCQUFhQyxRQUFiLENBQXNCLFVBQXRCLEVBQWtDdkYsT0FBbEMsQyIsImZpbGUiOiJEdXJhdGlvbkZpZWxkLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuaW1wb3J0IGZvcm1hdCBmcm9tICcuLi9Gb3JtYXQnO1xyXG5pbXBvcnQgTG9va3VwRmllbGQgZnJvbSAnLi9Mb29rdXBGaWVsZCc7XHJcbmltcG9ydCBGaWVsZE1hbmFnZXIgZnJvbSAnLi4vRmllbGRNYW5hZ2VyJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4uL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ2R1cmF0aW9uRmllbGQnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRmllbGRzLkR1cmF0aW9uRmllbGRcclxuICogQGNsYXNzZGVzYyBUaGUgRHVyYXRpb24gZmllbGQgaXMgYSBtYXNodXAgb2YgYW4gYXV0by1jb21wbGV0ZSBib3ggYW5kIGEge0BsaW5rIExvb2t1cEZpZWxkIExvb2t1cEZpZWxkfSBmb3IgaGFuZGxpbmdcclxuICogZHVyYXRpb24ncyBvZjogbWludXRlcywgaG91cnMsIGRheXMsIHdlZWtzIG9yIHllYXJzLiBNZWFuaW5nIGEgdXNlciBjYW4gdHlwZSBkaXJlY3RseSBpbnRvIHRoZSBpbnB1dCBhcmVhIHRoZVxyXG4gKiBhbW91bnQgb2YgdGltZSBvciBwcmVzcyB0aGUgbG9va3VwIGJ1dHRvbiBhbmQgY2hvb3NlIGZyb20gcHJlLWRldGVybWluZWQgbGlzdCBvZiB0aW1lcy5cclxuICpcclxuICogV2hlbiB0eXBpbmcgaW4gYSB2YWx1ZSBkaXJlY3RseSwgdGhlIER1cmF0aW9uIGZpZWxkIG9ubHkgc3VwcG9ydHMgb25lIFwibWVhc3VyZW1lbnRcIiBtZWFuaW5nIGlmIHlvdSB3YW50ZWQgdG9cclxuICogaGF2ZSAxIGhvdXIgYW5kIDMwIG1pbnV0ZXMgeW91IHdvdWxkIG5lZWQgdG8gdHlwZSBpbiA5MCBtaW51dGVzIG9yIDEuNSBob3Vycy5cclxuICpcclxuICogVGhlIGF1dG8tY29tcGxldGUgaGFwcGVucyBvbiBibHVyLCBzbyBpZiBhIHVzZXIgdHlwZXMgaW4gNW0gdGhleSB3b3VsZCBuZWVkIHRvIGdvIHRvIHRoZSBuZXh0IGZpZWxkIChvciBwcmVzc1xyXG4gKiBTYXZlKSBhbmQgdGhlIGZpZWxkIHdpbGwgYXV0by1jb21wbGV0ZSB0byA1IG1pbnV0ZShzKSwgbGV0dGluZyB0aGUgdXNlciBrbm93IGl0IGFjY2VwdGVkIHRoZSB2YWx1ZS4gSWYgYSB2YWx1ZVxyXG4gKiBlbnRlcmVkIGlzIG5vdCBhY2NlcHRlZCwgNWFiYywgaXQgd2lsbCBkZWZhdWx0IHRvIHRoZSBsYXN0IGtub3duIG1lYXN1cmVtZW50LCBkZWZhdWx0aW5nIHRvIG1pbnV0ZXMuXHJcbiAqXHJcbiAqIFNldHRpbmcgYW5kIGdldHRpbmcgdGhlIHZhbHVlIGlzIGFsd2F5cyBpbiBtaW51dGVzIGFzIGEgTnVtYmVyLlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiAgICAge1xyXG4gKiAgICAgICAgIG5hbWU6ICdEdXJhdGlvbicsXHJcbiAqICAgICAgICAgcHJvcGVydHk6ICdEdXJhdGlvbicsXHJcbiAqICAgICAgICAgbGFiZWw6IHRoaXMuZHVyYXRpb25UZXh0LFxyXG4gKiAgICAgICAgIHR5cGU6ICdkdXJhdGlvbicsXHJcbiAqICAgICAgICAgdmlldzogJ2R1cmF0aW9uc19saXN0J1xyXG4gKiAgICAgfVxyXG4gKlxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5GaWVsZHMuTG9va3VwRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkTWFuYWdlclxyXG4gKi9cclxuY29uc3QgY29udHJvbCA9IGRlY2xhcmUoJ2FyZ29zLkZpZWxkcy5EdXJhdGlvbkZpZWxkJywgW0xvb2t1cEZpZWxkXSwgLyoqIEBsZW5kcyBhcmdvcy5GaWVsZHMuRHVyYXRpb25GaWVsZCMgKi97XHJcbiAgLyoqXHJcbiAgICogTWFwcyB2YXJpb3VzIGF0dHJpYnV0ZXMgb2Ygbm9kZXMgdG8gc2V0dGVycy5cclxuICAgKi9cclxuICBhdHRyaWJ1dGVNYXA6IHtcclxuICAgIGlucHV0VmFsdWU6IHtcclxuICAgICAgbm9kZTogJ2lucHV0Tm9kZScsXHJcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxyXG4gICAgICBhdHRyaWJ1dGU6ICd2YWx1ZScsXHJcbiAgICB9LFxyXG4gICAgaW5wdXREaXNhYmxlZDoge1xyXG4gICAgICBub2RlOiAnaW5wdXROb2RlJyxcclxuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXHJcbiAgICAgIGF0dHJpYnV0ZTogJ2Rpc2FibGVkJyxcclxuICAgIH0sXHJcbiAgICBhdXRvQ29tcGxldGVDb250ZW50OiB7XHJcbiAgICAgIG5vZGU6ICdhdXRvQ29tcGxldGVOb2RlJyxcclxuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXHJcbiAgICAgIGF0dHJpYnV0ZTogJ2lubmVySFRNTCcsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIGZpZWxkcyBIVE1MIE1hcmt1cFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gRmllbGQgaW5zdGFuY2VcclxuICAgKiAqIGAkJGAgPT4gT3duZXIgVmlldyBpbnN0YW5jZVxyXG4gICAqXHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICBgPGxhYmVsIGZvcj1cInslPSAkLm5hbWUgJX1cIj57JTogJC5sYWJlbCAlfTwvbGFiZWw+XHJcbiAgICA8ZGl2IGNsYXNzPVwiZmllbGQgZmllbGQtY29udHJvbC13cmFwcGVyXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhdXRvQ29tcGxldGUtd2F0ZXJtYXJrXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImF1dG9Db21wbGV0ZU5vZGVcIj48L2Rpdj5cclxuICAgICAgPGJ1dHRvblxyXG4gICAgICAgIGNsYXNzPVwiYnV0dG9uIGZpZWxkLWNvbnRyb2wtdHJpZ2dlciBzaW1wbGVTdWJIZWFkZXJCdXR0b24geyUgaWYgKCQkLmljb25DbGFzcykgeyAlfSB7JTogJCQuaWNvbkNsYXNzICV9IHslIH0gJX1cIlxyXG4gICAgICAgIGRhdGEtZG9qby1hdHRhY2gtZXZlbnQ9XCJvbmNsaWNrOm5hdmlnYXRlVG9MaXN0Vmlld1wiXHJcbiAgICAgICAgYXJpYS1sYWJlbD1cInslOiAkLmxvb2t1cExhYmVsVGV4dCAlfVwiPlxyXG4gICAgICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICA8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhsaW5rOmhyZWY9XCIjaWNvbi17JTogJC5pY29uQ2xhc3MgJX1cIj48L3VzZT5cclxuICAgICAgICA8L3N2Zz5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICAgIDxpbnB1dCBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiaW5wdXROb2RlXCIgZGF0YS1kb2pvLWF0dGFjaC1ldmVudD1cIm9ua2V5dXA6IF9vbktleVVwLCBvbmJsdXI6IF9vbkJsdXIsIG9uZm9jdXM6IF9vbkZvY3VzXCIgY2xhc3M9XCJcIiB0eXBlPVwieyU6ICQuaW5wdXRUeXBlICV9XCIgbmFtZT1cInslPSAkLm5hbWUgJX1cIiB7JSBpZiAoJC5yZWFkb25seSkgeyAlfSByZWFkb25seSB7JSB9ICV9PlxyXG4gICAgPC9kaXY+YCxcclxuICBdKSxcclxuICBpY29uQ2xhc3M6ICdtb3JlJyxcclxuXHJcbiAgLy8gTG9jYWxpemF0aW9uXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCB1c2VkIHdoZW4gbm8gdmFsdWUgb3IgbnVsbCBpcyBzZXQgdG8gdGhlIGZpZWxkXHJcbiAgICovXHJcbiAgZW1wdHlUZXh0OiByZXNvdXJjZS5lbXB0eVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCBkaXNwbGF5ZWQgd2hlbiBhbiBpbnZhbGlkIGlucHV0IGlzIGRldGVjdGVkXHJcbiAgICovXHJcbiAgaW52YWxpZER1cmF0aW9uRXJyb3JUZXh0OiByZXNvdXJjZS5pbnZhbGlkRHVyYXRpb25FcnJvclRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIGF1dG8gY29tcGxldGVkIHRleHQgYW5kIHRoZWlyIGNvcnJlc3BvbmRpbmcgdmFsdWVzIGluIG1pbnV0ZXMgKFNEYXRhIGlzIGFsd2F5cyBtaW51dGVzKVxyXG4gICAqXHJcbiAgICogT3ZlcnJpZGUgcmlkZSB0aGlzIG9iamVjdCB0byBjaGFuZ2UgdGhlIGF1dG9jb21wbGV0ZSB1bml0cyBvciB0aGVpciBsb2NhbGl6YXRpb24uXHJcbiAgICovXHJcbiAgYXV0b0NvbXBsZXRlVGV4dDoge1xyXG4gICAgMTogcmVzb3VyY2UubWludXRlcyxcclxuICAgIDYwOiByZXNvdXJjZS5ob3VycyxcclxuICAgIDE0NDA6IHJlc291cmNlLmRheXMsXHJcbiAgICAxMDA4MDogcmVzb3VyY2Uud2Vla3MsXHJcbiAgICA1MjU5NjA6IHJlc291cmNlLnllYXJzLFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIE92ZXJyaWRlcyB0aGUge0BsaW5rIExvb2t1cEZpZWxkIExvb2t1cEZpZWxkfSBkZWZhdWx0IHRvIGV4cGxpY2l0bHkgc2V0IGl0IHRvIGZhbHNlIGZvcmNpbmdcclxuICAgKiB0aGUgdmlldyB0byB1c2UgdGhlIGN1cnJlbnRWYWx1ZSBpbnN0ZWFkIG9mIGEga2V5L2Rlc2NyaXB0b3JcclxuICAgKi9cclxuICB2YWx1ZUtleVByb3BlcnR5OiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogT3ZlcnJpZGVzIHRoZSB7QGxpbmsgTG9va3VwRmllbGQgTG9va3VwRmllbGR9IGRlZmF1bHQgdG8gZXhwbGljaXRseSBzZXQgaXQgdG8gZmFsc2UgZm9yY2luZ1xyXG4gICAqIHRoZSB2aWV3IHRvIHVzZSB0aGUgY3VycmVudFZhbHVlIGluc3RlYWQgb2YgYSBrZXkvZGVzY3JpcHRvclxyXG4gICAqL1xyXG4gIHZhbHVlVGV4dFByb3BlcnR5OiBmYWxzZSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIGN1cnJlbnQgdW5pdCBhcyBkZXRlY3RlZCBieSB0aGUgcGFyc2VyXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBjdXJyZW50S2V5OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfVxyXG4gICAqIFRoZSBjdXJyZW50IHZhbHVlLCBleHByZXNzZWQgYXMgbWludXRlcy5cclxuICAgKi9cclxuICBjdXJyZW50VmFsdWU6IDAsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7UmVnRXhwfVxyXG4gICAqIFJlZ3VsYXIgZXhwcmVzc2lvbiBmb3IgY2FwdHVyaW5nIHRoZSBwaHJhc2UgKHRleHQpLlxyXG4gICAqXHJcbiAgICogVGhlIGZpcnN0IGNhcHR1cmUgZ3JvdXAgbXVzdCBiZSBub24tdGV4dCBwYXJ0XHJcbiAgICogU2Vjb25kIGNhcHR1cmUgaXMgdGhlIHBocmFzZSB0byBiZSB1c2VkIGluIGF1dG8gY29tcGxldGVcclxuICAgKi9cclxuICBhdXRvQ29tcGxldGVQaHJhc2VSRTogL14oKD86XFxkKyg/OlxcLlxcZCopP3xcXC5cXGQrKVxccyo/KSguKykvLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1JlZ0V4cH1cclxuICAgKiBSZWd1bGFyIGV4cHJlc3Npb24gZm9yIGNhcHR1cmluZyB0aGUgdmFsdWUuXHJcbiAgICogT25seSBvbmUgY2FwdHVyZSB3aGljaCBzaG91bGQgY29ycmVsYXRlIHRvIHRoZSB2YWx1ZSBwb3J0aW9uXHJcbiAgICovXHJcbiAgYXV0b0NvbXBsZXRlVmFsdWVSRTogL14oKD86XFxkKyg/OlxcLlxcZCopP3xcXC5cXGQrKSkvLFxyXG5cclxuICAvKipcclxuICAgKiBPdmVycmlkZXMgdGhlIHBhcmVudCB0byBza2lwIHRoZSBjb25uZWN0aW9ucyBhbmQgYWx0ZXIgdGhlIGJhc2UgY2FwdHVyZSBSZWdFeHAncyB0byBhY2NvdW50IGZvciBsb2NhbGl6YXRpb25cclxuICAgKi9cclxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgLy8gZG8gbm90IHVzZSBsb29rdXBzIGNvbm5lY3RzXHJcblxyXG4gICAgY29uc3QgbnVtYmVyRGVjaW1hbFNlcGFyYXRvciA9IE1vYmlsZS5DdWx0dXJlSW5mby5udW1iZXJGb3JtYXQubnVtYmVyRGVjaW1hbFNlcGFyYXRvcjtcclxuXHJcbiAgICB0aGlzLmF1dG9Db21wbGV0ZVBocmFzZVJFID0gbmV3IFJlZ0V4cChcclxuICAgICAgc3RyaW5nLnN1YnN0aXR1dGUoJ14oKD86XFxcXGQrKD86XFxcXCR7MH1cXFxcZCopP3xcXFxcJHswfVxcXFxkKylcXFxccyo/KSguKyknLCBbbnVtYmVyRGVjaW1hbFNlcGFyYXRvcl0pXHJcbiAgICApO1xyXG5cclxuICAgIHRoaXMuYXV0b0NvbXBsZXRlVmFsdWVSRSA9IG5ldyBSZWdFeHAoXHJcbiAgICAgIHN0cmluZy5zdWJzdGl0dXRlKCdeKCg/OlxcXFxkKyg/OlxcXFwkezB9XFxcXGQqKT98XFxcXCR7MH1cXFxcZCspKScsIFtudW1iZXJEZWNpbWFsU2VwYXJhdG9yXSlcclxuICAgICk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBvbmtleXVwIG9uIHRoZSBpbnB1dC4gVGhlIGxvZ2ljIGZvciBjb21wYXJpbmcgdGhlIG1hdGNoZWQgdmFsdWUgYW5kIHBocmFzZSB0byB0aGUgYXV0b2NvbXBsZXRlXHJcbiAgICogaXMgZG9uZSBoZXJlLlxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBvbmtleXVwXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBfb25LZXlVcDogZnVuY3Rpb24gX29uS2V5VXAoLyogZXZ0Ki8pIHtcclxuICAgIGNvbnN0IHZhbCA9IHRoaXMuaW5wdXROb2RlLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICBjb25zdCBtYXRjaCA9IHRoaXMuYXV0b0NvbXBsZXRlUGhyYXNlUkUuZXhlYyh2YWwpO1xyXG5cclxuICAgIGlmICghbWF0Y2ggfHwgdmFsLmxlbmd0aCA8IDEpIHtcclxuICAgICAgdGhpcy5oaWRlQXV0b0NvbXBsZXRlKCk7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAoY29uc3Qga2V5IGluIHRoaXMuYXV0b0NvbXBsZXRlVGV4dCkge1xyXG4gICAgICBpZiAodGhpcy5pc1dvcmRNYXRjaChtYXRjaFsyXSwgdGhpcy5hdXRvQ29tcGxldGVUZXh0W2tleV0pKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50S2V5ID0gdGhpcy5hdXRvQ29tcGxldGVUZXh0W2tleV07XHJcbiAgICAgICAgdGhpcy5zaG93QXV0b0NvbXBsZXRlKG1hdGNoWzFdICsgdGhpcy5hdXRvQ29tcGxldGVUZXh0W2tleV0pO1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oaWRlQXV0b0NvbXBsZXRlKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSB0d28gcHJvdmlkZWQgdmFsdWVzIGFyZSB0aGUgc2FtZSB3b3JkLCBpZ25vcmluZyBjYXBpdGFsaXphdGlvbiBhbmQgbGVuZ3RoOlxyXG4gICAqXHJcbiAgICogKiBoLCBob3VyKHMpID0gdHJ1ZVxyXG4gICAqICogaG91LCBob3VyKHMpID0gdHJ1ZVxyXG4gICAqICogbWlubiwgbWludXRlKHMpID0gZmFsc2VcclxuICAgKiAqIHllYXIsIHllYXIocykgPSB0cnVlXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsIEZpcnN0IHN0cmluZyB0byBjb21wYXJlXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgU2Vjb25kIHN0cmluZyB0byBjb21wYXJlXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGV5IGFyZSBlcXVhbC5cclxuICAgKi9cclxuICBpc1dvcmRNYXRjaDogZnVuY3Rpb24gaXNXb3JkTWF0Y2godmFsLCB3b3JkKSB7XHJcbiAgICBsZXQgbmV3VmFsID0gdmFsO1xyXG4gICAgbGV0IG5ld1dvcmQgPSB3b3JkO1xyXG5cclxuICAgIGlmIChuZXdWYWwubGVuZ3RoID4gbmV3V29yZC5sZW5ndGgpIHtcclxuICAgICAgbmV3VmFsID0gbmV3VmFsLnNsaWNlKDAsIG5ld1dvcmQubGVuZ3RoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG5ld1dvcmQgPSBuZXdXb3JkLnNsaWNlKDAsIG5ld1ZhbC5sZW5ndGgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBuZXdWYWwudG9VcHBlckNhc2UoKSA9PT0gbmV3V29yZC50b1VwcGVyQ2FzZSgpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2hvd3MgdGhlIGF1dG8tY29tcGxldGUgdmVyc2lvbiBvZiB0aGUgcGhyYXNlXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdvcmQgVGV4dCB0byBwdXQgaW4gdGhlIGF1dG9jb21wbGV0ZVxyXG4gICAqL1xyXG4gIHNob3dBdXRvQ29tcGxldGU6IGZ1bmN0aW9uIHNob3dBdXRvQ29tcGxldGUod29yZCkge1xyXG4gICAgdGhpcy5zZXQoJ2F1dG9Db21wbGV0ZUNvbnRlbnQnLCB3b3JkKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENsZWFycyB0aGUgYXV0b2NvbXBsZXRlIGlucHV0XHJcbiAgICovXHJcbiAgaGlkZUF1dG9Db21wbGV0ZTogZnVuY3Rpb24gaGlkZUF1dG9Db21wbGV0ZSgpIHtcclxuICAgIHRoaXMuc2V0KCdhdXRvQ29tcGxldGVDb250ZW50JywgJycpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSW5wdXRzIG9uYmx1ciBoYW5kbGVyLCBpZiBhbiBhdXRvIGNvbXBsZXRlIGlzIG1hdGNoZWQgaXQgZmlsbHMgdGhlIHRleHQgb3V0IHRoZSBmdWxsIHRleHRcclxuICAgKiBAcGFyYW0gZXZ0XHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIF9vbkJsdXI6IGZ1bmN0aW9uIF9vbkJsdXIoLyogZXZ0Ki8pIHtcclxuICAgIGNvbnN0IHZhbCA9IHRoaXMuaW5wdXROb2RlLnZhbHVlLnRvU3RyaW5nKCk7XHJcbiAgICBjb25zdCBtYXRjaCA9IHRoaXMuYXV0b0NvbXBsZXRlVmFsdWVSRS5leGVjKHZhbCk7XHJcbiAgICBjb25zdCBtdWx0aXBsaWVyID0gdGhpcy5nZXRNdWx0aXBsaWVyKHRoaXMuY3VycmVudEtleSk7XHJcbiAgICBsZXQgbmV3VmFsdWUgPSAwO1xyXG5cclxuICAgIGlmICh2YWwubGVuZ3RoIDwgMSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIW1hdGNoKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIG5ld1ZhbHVlID0gcGFyc2VGbG9hdChtYXRjaFswXSkgKiBtdWx0aXBsaWVyO1xyXG4gICAgdGhpcy5zZXRWYWx1ZShuZXdWYWx1ZSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nIHZhbHVlIGluIG1pbnV0ZXMgdG8gdGhlIHBhc3NlZCBrZXkgKGN1cnJlbnRLZXkpXHJcbiAgICogQHJldHVybiB7TnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldE11bHRpcGxpZXI6IGZ1bmN0aW9uIGdldE11bHRpcGxpZXIoa2V5KSB7XHJcbiAgICBsZXQgaztcclxuICAgIGZvciAoayBpbiB0aGlzLmF1dG9Db21wbGV0ZVRleHQpIHtcclxuICAgICAgaWYgKHRoaXMuYXV0b0NvbXBsZXRlVGV4dC5oYXNPd25Qcm9wZXJ0eShrKSAmJiBrZXkgPT09IHRoaXMuYXV0b0NvbXBsZXRlVGV4dFtrXSkge1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gaztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdmFsdWUgaW4gbWludXRlc1xyXG4gICAqIEByZXR1cm4ge051bWJlcn1cclxuICAgKi9cclxuICBnZXRWYWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50VmFsdWU7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBjdXJyZW50VmFsdWUgdG8gdGhlIHBhc3NlZCB2YWx1ZSwgYnV0IHNldHMgdGhlIGRpc3BsYXllZCB2YWx1ZSBhZnRlciBmb3JtYXR0aW5nIHdpdGgge0BsaW5rICN0ZXh0Rm9ybWF0IHRleHRGb3JtYXR9LlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWwgTnVtYmVyIG9mIG1pbnV0ZXNcclxuICAgKiBAcGFyYW0gaW5pdFxyXG4gICAqL1xyXG4gIHNldFZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2YWwgPSAwLyogLCBpbml0Ki8pIHtcclxuICAgIGxldCBuZXdWYWwgPSB2YWw7XHJcbiAgICBpZiAobmV3VmFsID09PSBudWxsKSB7XHJcbiAgICAgIG5ld1ZhbCA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSBuZXdWYWw7XHJcbiAgICB0aGlzLnNldCgnaW5wdXRWYWx1ZScsIHRoaXMudGV4dEZvcm1hdChuZXdWYWwpKTtcclxuICAgIHRoaXMuaGlkZUF1dG9Db21wbGV0ZSgpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSWYgdXNlZCBhcyBhIExvb2t1cCwgdGhpcyBpcyBpbnZva2VkIHdpdGggdGhlIHZhbHVlIG9mIHRoZSBsb29rdXAgaXRlbS5cclxuICAgKiBAcGFyYW0gdmFsXHJcbiAgICogQHBhcmFtIHtTdHJpbmcvTnVtYmVyfSBrZXkgTnVtYmVyIG9mIG1pbnV0ZXMgKHdpbGwgYmUgY29udmVydGVkIHZpYSBwYXJzZUZsb2F0KVxyXG4gICAqL1xyXG4gIHNldFNlbGVjdGlvbjogZnVuY3Rpb24gc2V0U2VsZWN0aW9uKHZhbCwga2V5KSB7XHJcbiAgICB0aGlzLnNldFZhbHVlKHBhcnNlRmxvYXQoa2V5KSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBUYWtlcyB0aGUgbnVtYmVyIG9mIG1pbnV0ZXMgYW5kIGNvbnZlcnRzIGl0IGludG8gYSB0ZXh0dWFsIHJlcHJlc2VudGF0aW9uIHVzaW5nIHRoZSBgYXV0b0NvbXBsZXRlVGV4dGBcclxuICAgKiBjb2xsZWN0aW9uIGFzIGFndWlkZVxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWwgTnVtYmVyIG9mIG1pbnV0ZXNcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgdGV4dEZvcm1hdDogZnVuY3Rpb24gdGV4dEZvcm1hdCh2YWwpIHtcclxuICAgIGxldCBmaW5hbFVuaXQgPSAxO1xyXG4gICAgY29uc3QgYXV0b0NvbXBsZXRlVmFsdWVzID0gdGhpcy5hdXRvQ29tcGxldGVUZXh0O1xyXG5cclxuICAgIGZvciAoY29uc3Qga2V5IGluIGF1dG9Db21wbGV0ZVZhbHVlcykge1xyXG4gICAgICBpZiAoYXV0b0NvbXBsZXRlVmFsdWVzLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICBjb25zdCBzdGVwVmFsdWUgPSBwYXJzZUludChrZXksIDEwKTtcclxuICAgICAgICBpZiAodmFsID09PSAwICYmIHN0ZXBWYWx1ZSA9PT0gMSkge1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50S2V5ID0gYXV0b0NvbXBsZXRlVmFsdWVzW2tleV07XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmICh2YWwgLyBzdGVwVmFsdWUgPj0gMSkge1xyXG4gICAgICAgICAgZmluYWxVbml0ID0gc3RlcFZhbHVlO1xyXG4gICAgICAgICAgdGhpcy5jdXJyZW50S2V5ID0gYXV0b0NvbXBsZXRlVmFsdWVzW2tleV07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZm9ybWF0VW5pdCh0aGlzLmNvbnZlcnRVbml0KHZhbCwgZmluYWxVbml0KSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEaXZpZGVzIHR3byBudW1iZXJzIGFuZCBmaXhlcyB0aGUgZGVjaW1hbCBwb2ludCB0byB0d28gcGxhY2VzLlxyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSB2YWxcclxuICAgKiBAcGFyYW0ge051bWJlcn0gdG9cclxuICAgKiBAcmV0dXJuIHtOdW1iZXJ9XHJcbiAgICovXHJcbiAgY29udmVydFVuaXQ6IGZ1bmN0aW9uIGNvbnZlcnRVbml0KHZhbCwgdG8pIHtcclxuICAgIHJldHVybiBmb3JtYXQuZml4ZWQodmFsIC8gdG8sIDIpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRm9ybWF0cyB0aGUgdW5pdCB3aXRoIGNvcnJlY3QgZGVjaW1hbCBzZXBhcmF0b3IuXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHVuaXRcclxuICAgKiBAcmV0dXJuIHtzdHJpbmd9XHJcbiAgICovXHJcbiAgZm9ybWF0VW5pdDogZnVuY3Rpb24gZm9ybWF0VW5pdCh1bml0KSB7XHJcbiAgICBsZXQgc3ZhbDtcclxuICAgIGlmIChpc05hTih1bml0KSkge1xyXG4gICAgICBzdmFsID0gJzAnO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgc3ZhbCA9IHVuaXQudG9TdHJpbmcoKS5zcGxpdCgnLicpO1xyXG4gICAgICBpZiAoc3ZhbC5sZW5ndGggPT09IDEpIHtcclxuICAgICAgICBzdmFsID0gc3ZhbFswXTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAoc3ZhbFsxXSA9PT0gJzAnKSB7XHJcbiAgICAgICAgICBzdmFsID0gc3ZhbFswXTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc3ZhbCA9IHN0cmluZy5zdWJzdGl0dXRlKCckezB9JHsxfSR7Mn0nLCBbXHJcbiAgICAgICAgICAgIHN2YWxbMF0sXHJcbiAgICAgICAgICAgIE1vYmlsZS5DdWx0dXJlSW5mby5udW1iZXJGb3JtYXQuY3VycmVuY3lEZWNpbWFsU2VwYXJhdG9yIHx8ICcuJyxcclxuICAgICAgICAgICAgc3ZhbFsxXSxcclxuICAgICAgICAgIF0pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGAke3N2YWx9ICR7dGhpcy5jdXJyZW50S2V5fWA7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSB7QGxpbmsgTG9va3VwRmllbGQjY3JlYXRlTmF2aWdhdGlvbk9wdGlvbnMgcGFyZW50IGltcGxlbWVudGF0aW9ufSB0byBleHBsaWNpdGx5IHNldCBoaWRlIHNlYXJjaFxyXG4gICAqIHRvIHRydWUgYW5kIGRhdGEgdG8gYHRoaXMuZGF0YWAuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBOYXZpZ2F0aW9uIG9wdGlvbnMgb2JqZWN0IHRvIGJlIHBhc3NlZFxyXG4gICAqL1xyXG4gIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zOiBmdW5jdGlvbiBjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucygpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gICAgb3B0aW9ucy5oaWRlU2VhcmNoID0gdHJ1ZTtcclxuICAgIG9wdGlvbnMuZGF0YSA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbih0aGlzLmRhdGEpO1xyXG4gICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBWYWxpZGV0cyB0aGUgZmllbGQgYnkgdmVyaWZ5aW5nIGl0IG1hdGNoZXMgb25lIG9mIHRoZSBhdXRvIGNvbXBsZXRlIHRleHQuXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gRmFsc2UgZm9yIG5vLWVycm9ycywgdHJ1ZSBmb3IgZXJyb3IuXHJcbiAgICovXHJcbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xyXG4gICAgY29uc3QgdmFsID0gdGhpcy5pbnB1dE5vZGUudmFsdWUudG9TdHJpbmcoKTtcclxuICAgIGNvbnN0IHBocmFzZU1hdGNoID0gdGhpcy5hdXRvQ29tcGxldGVQaHJhc2VSRS5leGVjKHZhbCk7XHJcblxyXG4gICAgaWYgKCFwaHJhc2VNYXRjaCkge1xyXG4gICAgICAkKHRoaXMuY29udGFpbmVyTm9kZSkuYWRkQ2xhc3MoJ3Jvdy1lcnJvcicpO1xyXG4gICAgICByZXR1cm4gc3RyaW5nLnN1YnN0aXR1dGUodGhpcy5pbnZhbGlkRHVyYXRpb25FcnJvclRleHQsIFt2YWxdKTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuY29udGFpbmVyTm9kZSkucmVtb3ZlQ2xhc3MoJ3Jvdy1lcnJvcicpO1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGRNYW5hZ2VyLnJlZ2lzdGVyKCdkdXJhdGlvbicsIGNvbnRyb2wpO1xyXG4iXX0=