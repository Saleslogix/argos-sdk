define('argos/Fields/TextField', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/event', './_Field', '../FieldManager'], function (module, exports, _declare, _event, _Field2, _FieldManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _event2 = _interopRequireDefault(_event);

  var _Field3 = _interopRequireDefault(_Field2);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Fields.TextField
   * @classdesc The TextField is the base method of inputting just a string that is bound to a `<input type="text">`.
   *
   * It does introduce:
   *
   * * Clear button - adds a small x buton to clear the input
   * * Option to only allow valid input at each keypress
   *
   * @example
   *     {
   *         name: 'LastName',
   *         property: 'LastName',
   *         label: this.lastNameText,
   *         type: 'text',
   *     }
   * @extends argos.Fields._Field
   * @requires argos.FieldManager
   */
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

  var control = (0, _declare2.default)('argos.Fields.TextField', [_Field3.default], /** @lends argos.Fields.TextField# */{
    /**
     * @property {Object}
     * Creates a setter map to html nodes, namely:
     *
     * * inputValue => inputNode's value attribute
     */
    attributeMap: {
      inputValue: {
        node: 'inputNode',
        type: 'attribute',
        attribute: 'value'
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
    widgetTemplate: new Simplate(['\n      <div class="field">\n        <label for="{%= $.name %}"\n          {% if ($.required) { %}\n          class="required"\n          {% } %}\n          >{%: $.label %}</label>\n        <input\n          data-dojo-attach-point="inputNode"\n          type="{%: $.inputType %}"\n          id="{%= $.name %}"\n          name="{%= $.name %}"\n          placeholder="{%: $.placeHolderText %}"\n          {% if ($.required) { %}\n            data-validate="required"\n            class="required"\n          {% } %}\n          {% if ($.readonly) { %} readonly {% } %}\n          >\n      </div>\n    ']),
    /**
     * @property {HTMLElement}
     * The dojo-attach-point reference to the input element
     */
    inputNode: null,
    /**
     * @property {HTMLElement}
     * The dojo-attach-point reference to the clear button
     */
    clearNode: null,

    /**
     * required should be true if the field requires input. Defaults to false.
     * @type {Boolean}
     */
    required: false,

    /**
     * @cfg {String}
     * Event name for enabling {@link #onNotificationTrigger onNotificationTrigger} function to
     * be called, can be either `keyup` or `blur`. The trigger in turn calls the {@link #onChange onChange} function
     * if the field has been changed.
     */
    notificationTrigger: false,
    /**
     * @cfg {String}
     * Event name for enabling {@link #onValidationTrigger onValidationTrigger} function to
     * be called, can be either `keyup` or `blur`. The trigger in turn validates the field.
     */
    validationTrigger: false,
    /**
     * @cfg {String}
     * The `<input type=` for the field, may be overridden to use the HTML5 enhanced types.
     */
    inputType: 'text',
    /**
     * @cfg {Boolean}
     * Flag for controlling the addition of the clear button.
     */
    enableClearButton: false,
    /**
     * @cfg {Boolean}
     * Flag that if true connects the `onkeypress` event to {@link #_onKeyPress _onKeyPress}
     * where it adds the typed key to the current value and validates the field - if validation
     * fails the key press is cancelled.
     */
    validInputOnly: false,
    /**
     * @property {String}
     * Value storage for detecting changes either via direct input or programmatic setting.
     */
    previousValue: null,
    /**
     * @property {String}
     * Value storage for keeping track of modified/unmodified values. Used in {@link #isDirty isDirty}.
     */
    originalValue: null,

    /**
     * Extends the parent implementation to optionally bind the `onkeypress` event if `validInputOnly`
     * is true. Binds the 'onblur' and 'keyup' events.
     */
    init: function init() {
      this.inherited(init, arguments);
      if (this.validInputOnly) {
        this.connect(this.inputNode, 'onkeypress', this._onKeyPress);
      }
      this.connect(this.inputNode, 'onblur', this._onBlur);
      this.connect(this.inputNode, 'onkeyup', this._onKeyUp);
    },
    /**
     * Extends the parent implementation to set the disabled attribute of the input to false
     */
    enable: function enable() {
      this.inherited(enable, arguments);
      $(this.inputNode).css('disabled', false);
      $(this.inputNode).enable();
    },
    /**
     * Extends the parent implementation to set the disabled attribute of the input to true
     */
    disable: function disable() {
      this.inherited(disable, arguments);

      $(this.inputNode).css('disabled', true);
      $(this.inputNode).disable();
    },
    focus: function focus() {
      this.inputNode.focus();
    },
    /**
     * Handler for the `onkeypress` event which is not connected unless `validInputOnly` is true.
     *
     * Since this is a direct tie-in for `validInputOnly`, this intercepts the key press, adds it
     * to the current value temporarily and validates the result -- if it validates the key press is
     * accepted, if validation fails the key press is rejected and the key is not entered.
     * @param {Event} evt
     */
    _onKeyPress: function _onKeyPress(evt) {
      var v = this.getValue() + evt.keyChar;
      if (this.validate(v)) {
        _event2.default.stop(evt);
        return false;
      }
    },
    /**
     * Handler for the `onkeyup` event.
     *
     * If either the `validationTrigger` or `notificationTrigger` is set to `keyup` then it will fire
     * the respective function.
     *
     * @param {Event} evt
     */
    _onKeyUp: function _onKeyUp(evt) {
      if (this.validationTrigger === 'keyup') {
        this.onValidationTrigger(evt);
      }

      if (this.notificationTrigger === 'keyup') {
        this.onNotificationTrigger(evt);
      }
    },
    /**
     * Handler for the `onblur` event
     *
     * If either the `validationTrigger` or `notificationTrigger` is set to `blur` then it will fire
     * the respective function.
     *
     * @param {Event} evt
     */
    _onBlur: function _onBlur(evt) {
      if (this.validationTrigger === 'blur') {
        this.onValidationTrigger(evt);
      }

      if (this.notificationTrigger === 'blur') {
        this.onNotificationTrigger(evt);
      }
    },
    /**
     * Fires {@link _Field#onChange onChange} if the value has changed since the previous notification event or
     * a direct setting of the value.
     * @param {Event} evt
     */
    onNotificationTrigger: function onNotificationTrigger() /* evt*/{
      var currentValue = this.getValue();

      if (this.previousValue !== currentValue) {
        this.previousValue = currentValue;
        this.onChange(currentValue, this);
      }
    },
    /**
     * Immediately calls {@link _Field#validate validate} and adds the respective row styling.
     * @param {Event} evt
     */
    onValidationTrigger: function onValidationTrigger() /* evt*/{
      if (this.validate()) {
        $(this.containerNode).addClass('row-error');
      } else {
        $(this.containerNode).removeClass('row-error');
      }
    },
    /**
     * Returns the input nodes value
     * @return {String}
     */
    getValue: function getValue() {
      return this.inputNode.value;
    },
    /**
     * Sets the value of the input node, clears the previous value for notification trigger and
     * if setting an initial value - set the originalValue to the passed value for dirty detection.
     * @param {String} val Value to be set
     * @param {Boolean} initial True if the value is the default/clean value, false if it is a meant as a dirty value
     */
    setValue: function setValue() {
      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var initial = arguments[1];

      if (initial) {
        this.originalValue = val;
      }

      this.previousValue = val;
      this.set('inputValue', val);
    },
    /**
     * Sets the value of the input node, and set the value as the previous value  so notification trigger will not trigger and
     * if setting an initial value - set the originalValue to the passed value for dirty detection.
     * @param {String} val Value to be set
     * @param {Boolean} initial True if the value is the default/clean value, false if it is a meant as a dirty value
     */
    setValueNoTrigger: function setValueNoTrigger(val, initial) {
      this.setValue(val, initial);
      this.previousValue = this.getValue();
    },
    /**
     * Clears the input nodes value, optionally clearing as a modified value.
     * @param {Boolean} asDirty If true it signifies the clearing is meant as destroying an
     * existing value and should then be detected as modified/dirty.
     */
    clearValue: function clearValue(asDirty) {
      var initial = asDirty !== true;
      this.setValue('', initial);
    },
    /**
     * Determines if the value has been modified from the default/original state
     * @return {Boolean}
     */
    isDirty: function isDirty() {
      return this.originalValue !== this.getValue();
    }
  });

  exports.default = _FieldManager2.default.register('text', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvVGV4dEZpZWxkLmpzIl0sIm5hbWVzIjpbImNvbnRyb2wiLCJhdHRyaWJ1dGVNYXAiLCJpbnB1dFZhbHVlIiwibm9kZSIsInR5cGUiLCJhdHRyaWJ1dGUiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwiaW5wdXROb2RlIiwiY2xlYXJOb2RlIiwicmVxdWlyZWQiLCJub3RpZmljYXRpb25UcmlnZ2VyIiwidmFsaWRhdGlvblRyaWdnZXIiLCJpbnB1dFR5cGUiLCJlbmFibGVDbGVhckJ1dHRvbiIsInZhbGlkSW5wdXRPbmx5IiwicHJldmlvdXNWYWx1ZSIsIm9yaWdpbmFsVmFsdWUiLCJpbml0IiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiY29ubmVjdCIsIl9vbktleVByZXNzIiwiX29uQmx1ciIsIl9vbktleVVwIiwiZW5hYmxlIiwiJCIsImNzcyIsImRpc2FibGUiLCJmb2N1cyIsImV2dCIsInYiLCJnZXRWYWx1ZSIsImtleUNoYXIiLCJ2YWxpZGF0ZSIsInN0b3AiLCJvblZhbGlkYXRpb25UcmlnZ2VyIiwib25Ob3RpZmljYXRpb25UcmlnZ2VyIiwiY3VycmVudFZhbHVlIiwib25DaGFuZ2UiLCJjb250YWluZXJOb2RlIiwiYWRkQ2xhc3MiLCJyZW1vdmVDbGFzcyIsInZhbHVlIiwic2V0VmFsdWUiLCJ2YWwiLCJpbml0aWFsIiwic2V0Iiwic2V0VmFsdWVOb1RyaWdnZXIiLCJjbGVhclZhbHVlIiwiYXNEaXJ0eSIsImlzRGlydHkiLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXFCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXJCQTs7Ozs7Ozs7Ozs7Ozs7O0FBd0NBLE1BQU1BLFVBQVUsdUJBQVEsd0JBQVIsRUFBa0MsaUJBQWxDLEVBQTRDLHFDQUFxQztBQUMvRjs7Ozs7O0FBTUFDLGtCQUFjO0FBQ1pDLGtCQUFZO0FBQ1ZDLGNBQU0sV0FESTtBQUVWQyxjQUFNLFdBRkk7QUFHVkMs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O0FBS0FpQixnQkFBWSxTQUFTQSxVQUFULENBQW9CQyxPQUFwQixFQUE2QjtBQUN2QyxVQUFNSixVQUFVSSxZQUFZLElBQTVCO0FBQ0EsV0FBS04sUUFBTCxDQUFjLEVBQWQsRUFBa0JFLE9BQWxCO0FBQ0QsS0F0UDhGO0FBdVAvRjs7OztBQUlBSyxhQUFTLFNBQVNBLE9BQVQsR0FBbUI7QUFDMUIsYUFBUSxLQUFLbEMsYUFBTCxLQUF1QixLQUFLZSxRQUFMLEVBQS9CO0FBQ0Q7QUE3UDhGLEdBQWpGLENBQWhCOztvQkFnUWUsdUJBQWFvQixRQUFiLENBQXNCLE1BQXRCLEVBQThCcEQsT0FBOUIsQyIsImZpbGUiOiJUZXh0RmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBldmVudCBmcm9tICdkb2pvL19iYXNlL2V2ZW50JztcclxuaW1wb3J0IF9GaWVsZCBmcm9tICcuL19GaWVsZCc7XHJcbmltcG9ydCBGaWVsZE1hbmFnZXIgZnJvbSAnLi4vRmllbGRNYW5hZ2VyJztcclxuXHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkZpZWxkcy5UZXh0RmllbGRcclxuICogQGNsYXNzZGVzYyBUaGUgVGV4dEZpZWxkIGlzIHRoZSBiYXNlIG1ldGhvZCBvZiBpbnB1dHRpbmcganVzdCBhIHN0cmluZyB0aGF0IGlzIGJvdW5kIHRvIGEgYDxpbnB1dCB0eXBlPVwidGV4dFwiPmAuXHJcbiAqXHJcbiAqIEl0IGRvZXMgaW50cm9kdWNlOlxyXG4gKlxyXG4gKiAqIENsZWFyIGJ1dHRvbiAtIGFkZHMgYSBzbWFsbCB4IGJ1dG9uIHRvIGNsZWFyIHRoZSBpbnB1dFxyXG4gKiAqIE9wdGlvbiB0byBvbmx5IGFsbG93IHZhbGlkIGlucHV0IGF0IGVhY2gga2V5cHJlc3NcclxuICpcclxuICogQGV4YW1wbGVcclxuICogICAgIHtcclxuICogICAgICAgICBuYW1lOiAnTGFzdE5hbWUnLFxyXG4gKiAgICAgICAgIHByb3BlcnR5OiAnTGFzdE5hbWUnLFxyXG4gKiAgICAgICAgIGxhYmVsOiB0aGlzLmxhc3ROYW1lVGV4dCxcclxuICogICAgICAgICB0eXBlOiAndGV4dCcsXHJcbiAqICAgICB9XHJcbiAqIEBleHRlbmRzIGFyZ29zLkZpZWxkcy5fRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkTWFuYWdlclxyXG4gKi9cclxuY29uc3QgY29udHJvbCA9IGRlY2xhcmUoJ2FyZ29zLkZpZWxkcy5UZXh0RmllbGQnLCBbX0ZpZWxkXSwgLyoqIEBsZW5kcyBhcmdvcy5GaWVsZHMuVGV4dEZpZWxkIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBDcmVhdGVzIGEgc2V0dGVyIG1hcCB0byBodG1sIG5vZGVzLCBuYW1lbHk6XHJcbiAgICpcclxuICAgKiAqIGlucHV0VmFsdWUgPT4gaW5wdXROb2RlJ3MgdmFsdWUgYXR0cmlidXRlXHJcbiAgICovXHJcbiAgYXR0cmlidXRlTWFwOiB7XHJcbiAgICBpbnB1dFZhbHVlOiB7XHJcbiAgICAgIG5vZGU6ICdpbnB1dE5vZGUnLFxyXG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcclxuICAgICAgYXR0cmlidXRlOiAndmFsdWUnLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBmaWVsZHMgSFRNTCBNYXJrdXBcclxuICAgKlxyXG4gICAqICogYCRgID0+IEZpZWxkIGluc3RhbmNlXHJcbiAgICogKiBgJCRgID0+IE93bmVyIFZpZXcgaW5zdGFuY2VcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW2BcclxuICAgICAgPGRpdiBjbGFzcz1cImZpZWxkXCI+XHJcbiAgICAgICAgPGxhYmVsIGZvcj1cInslPSAkLm5hbWUgJX1cIlxyXG4gICAgICAgICAgeyUgaWYgKCQucmVxdWlyZWQpIHsgJX1cclxuICAgICAgICAgIGNsYXNzPVwicmVxdWlyZWRcIlxyXG4gICAgICAgICAgeyUgfSAlfVxyXG4gICAgICAgICAgPnslOiAkLmxhYmVsICV9PC9sYWJlbD5cclxuICAgICAgICA8aW5wdXRcclxuICAgICAgICAgIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJpbnB1dE5vZGVcIlxyXG4gICAgICAgICAgdHlwZT1cInslOiAkLmlucHV0VHlwZSAlfVwiXHJcbiAgICAgICAgICBpZD1cInslPSAkLm5hbWUgJX1cIlxyXG4gICAgICAgICAgbmFtZT1cInslPSAkLm5hbWUgJX1cIlxyXG4gICAgICAgICAgcGxhY2Vob2xkZXI9XCJ7JTogJC5wbGFjZUhvbGRlclRleHQgJX1cIlxyXG4gICAgICAgICAgeyUgaWYgKCQucmVxdWlyZWQpIHsgJX1cclxuICAgICAgICAgICAgZGF0YS12YWxpZGF0ZT1cInJlcXVpcmVkXCJcclxuICAgICAgICAgICAgY2xhc3M9XCJyZXF1aXJlZFwiXHJcbiAgICAgICAgICB7JSB9ICV9XHJcbiAgICAgICAgICB7JSBpZiAoJC5yZWFkb25seSkgeyAlfSByZWFkb25seSB7JSB9ICV9XHJcbiAgICAgICAgICA+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgYCxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fVxyXG4gICAqIFRoZSBkb2pvLWF0dGFjaC1wb2ludCByZWZlcmVuY2UgdG8gdGhlIGlucHV0IGVsZW1lbnRcclxuICAgKi9cclxuICBpbnB1dE5vZGU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH1cclxuICAgKiBUaGUgZG9qby1hdHRhY2gtcG9pbnQgcmVmZXJlbmNlIHRvIHRoZSBjbGVhciBidXR0b25cclxuICAgKi9cclxuICBjbGVhck5vZGU6IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIHJlcXVpcmVkIHNob3VsZCBiZSB0cnVlIGlmIHRoZSBmaWVsZCByZXF1aXJlcyBpbnB1dC4gRGVmYXVsdHMgdG8gZmFsc2UuXHJcbiAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgcmVxdWlyZWQ6IGZhbHNlLFxyXG5cclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogRXZlbnQgbmFtZSBmb3IgZW5hYmxpbmcge0BsaW5rICNvbk5vdGlmaWNhdGlvblRyaWdnZXIgb25Ob3RpZmljYXRpb25UcmlnZ2VyfSBmdW5jdGlvbiB0b1xyXG4gICAqIGJlIGNhbGxlZCwgY2FuIGJlIGVpdGhlciBga2V5dXBgIG9yIGBibHVyYC4gVGhlIHRyaWdnZXIgaW4gdHVybiBjYWxscyB0aGUge0BsaW5rICNvbkNoYW5nZSBvbkNoYW5nZX0gZnVuY3Rpb25cclxuICAgKiBpZiB0aGUgZmllbGQgaGFzIGJlZW4gY2hhbmdlZC5cclxuICAgKi9cclxuICBub3RpZmljYXRpb25UcmlnZ2VyOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogRXZlbnQgbmFtZSBmb3IgZW5hYmxpbmcge0BsaW5rICNvblZhbGlkYXRpb25UcmlnZ2VyIG9uVmFsaWRhdGlvblRyaWdnZXJ9IGZ1bmN0aW9uIHRvXHJcbiAgICogYmUgY2FsbGVkLCBjYW4gYmUgZWl0aGVyIGBrZXl1cGAgb3IgYGJsdXJgLiBUaGUgdHJpZ2dlciBpbiB0dXJuIHZhbGlkYXRlcyB0aGUgZmllbGQuXHJcbiAgICovXHJcbiAgdmFsaWRhdGlvblRyaWdnZXI6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBUaGUgYDxpbnB1dCB0eXBlPWAgZm9yIHRoZSBmaWVsZCwgbWF5IGJlIG92ZXJyaWRkZW4gdG8gdXNlIHRoZSBIVE1MNSBlbmhhbmNlZCB0eXBlcy5cclxuICAgKi9cclxuICBpbnB1dFR5cGU6ICd0ZXh0JyxcclxuICAvKipcclxuICAgKiBAY2ZnIHtCb29sZWFufVxyXG4gICAqIEZsYWcgZm9yIGNvbnRyb2xsaW5nIHRoZSBhZGRpdGlvbiBvZiB0aGUgY2xlYXIgYnV0dG9uLlxyXG4gICAqL1xyXG4gIGVuYWJsZUNsZWFyQnV0dG9uOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtCb29sZWFufVxyXG4gICAqIEZsYWcgdGhhdCBpZiB0cnVlIGNvbm5lY3RzIHRoZSBgb25rZXlwcmVzc2AgZXZlbnQgdG8ge0BsaW5rICNfb25LZXlQcmVzcyBfb25LZXlQcmVzc31cclxuICAgKiB3aGVyZSBpdCBhZGRzIHRoZSB0eXBlZCBrZXkgdG8gdGhlIGN1cnJlbnQgdmFsdWUgYW5kIHZhbGlkYXRlcyB0aGUgZmllbGQgLSBpZiB2YWxpZGF0aW9uXHJcbiAgICogZmFpbHMgdGhlIGtleSBwcmVzcyBpcyBjYW5jZWxsZWQuXHJcbiAgICovXHJcbiAgdmFsaWRJbnB1dE9ubHk6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFZhbHVlIHN0b3JhZ2UgZm9yIGRldGVjdGluZyBjaGFuZ2VzIGVpdGhlciB2aWEgZGlyZWN0IGlucHV0IG9yIHByb2dyYW1tYXRpYyBzZXR0aW5nLlxyXG4gICAqL1xyXG4gIHByZXZpb3VzVmFsdWU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVmFsdWUgc3RvcmFnZSBmb3Iga2VlcGluZyB0cmFjayBvZiBtb2RpZmllZC91bm1vZGlmaWVkIHZhbHVlcy4gVXNlZCBpbiB7QGxpbmsgI2lzRGlydHkgaXNEaXJ0eX0uXHJcbiAgICovXHJcbiAgb3JpZ2luYWxWYWx1ZTogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgcGFyZW50IGltcGxlbWVudGF0aW9uIHRvIG9wdGlvbmFsbHkgYmluZCB0aGUgYG9ua2V5cHJlc3NgIGV2ZW50IGlmIGB2YWxpZElucHV0T25seWBcclxuICAgKiBpcyB0cnVlLiBCaW5kcyB0aGUgJ29uYmx1cicgYW5kICdrZXl1cCcgZXZlbnRzLlxyXG4gICAqL1xyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChpbml0LCBhcmd1bWVudHMpO1xyXG4gICAgaWYgKHRoaXMudmFsaWRJbnB1dE9ubHkpIHtcclxuICAgICAgdGhpcy5jb25uZWN0KHRoaXMuaW5wdXROb2RlLCAnb25rZXlwcmVzcycsIHRoaXMuX29uS2V5UHJlc3MpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jb25uZWN0KHRoaXMuaW5wdXROb2RlLCAnb25ibHVyJywgdGhpcy5fb25CbHVyKTtcclxuICAgIHRoaXMuY29ubmVjdCh0aGlzLmlucHV0Tm9kZSwgJ29ua2V5dXAnLCB0aGlzLl9vbktleVVwKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHBhcmVudCBpbXBsZW1lbnRhdGlvbiB0byBzZXQgdGhlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiB0aGUgaW5wdXQgdG8gZmFsc2VcclxuICAgKi9cclxuICBlbmFibGU6IGZ1bmN0aW9uIGVuYWJsZSgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGVuYWJsZSwgYXJndW1lbnRzKTtcclxuICAgICQodGhpcy5pbnB1dE5vZGUpLmNzcygnZGlzYWJsZWQnLCBmYWxzZSk7XHJcbiAgICAkKHRoaXMuaW5wdXROb2RlKS5lbmFibGUoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHBhcmVudCBpbXBsZW1lbnRhdGlvbiB0byBzZXQgdGhlIGRpc2FibGVkIGF0dHJpYnV0ZSBvZiB0aGUgaW5wdXQgdG8gdHJ1ZVxyXG4gICAqL1xyXG4gIGRpc2FibGU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChkaXNhYmxlLCBhcmd1bWVudHMpO1xyXG5cclxuICAgICQodGhpcy5pbnB1dE5vZGUpLmNzcygnZGlzYWJsZWQnLCB0cnVlKTtcclxuICAgICQodGhpcy5pbnB1dE5vZGUpLmRpc2FibGUoKTtcclxuICB9LFxyXG4gIGZvY3VzOiBmdW5jdGlvbiBmb2N1cygpIHtcclxuICAgIHRoaXMuaW5wdXROb2RlLmZvY3VzKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgYG9ua2V5cHJlc3NgIGV2ZW50IHdoaWNoIGlzIG5vdCBjb25uZWN0ZWQgdW5sZXNzIGB2YWxpZElucHV0T25seWAgaXMgdHJ1ZS5cclxuICAgKlxyXG4gICAqIFNpbmNlIHRoaXMgaXMgYSBkaXJlY3QgdGllLWluIGZvciBgdmFsaWRJbnB1dE9ubHlgLCB0aGlzIGludGVyY2VwdHMgdGhlIGtleSBwcmVzcywgYWRkcyBpdFxyXG4gICAqIHRvIHRoZSBjdXJyZW50IHZhbHVlIHRlbXBvcmFyaWx5IGFuZCB2YWxpZGF0ZXMgdGhlIHJlc3VsdCAtLSBpZiBpdCB2YWxpZGF0ZXMgdGhlIGtleSBwcmVzcyBpc1xyXG4gICAqIGFjY2VwdGVkLCBpZiB2YWxpZGF0aW9uIGZhaWxzIHRoZSBrZXkgcHJlc3MgaXMgcmVqZWN0ZWQgYW5kIHRoZSBrZXkgaXMgbm90IGVudGVyZWQuXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XHJcbiAgICovXHJcbiAgX29uS2V5UHJlc3M6IGZ1bmN0aW9uIF9vbktleVByZXNzKGV2dCkge1xyXG4gICAgY29uc3QgdiA9IHRoaXMuZ2V0VmFsdWUoKSArIGV2dC5rZXlDaGFyO1xyXG4gICAgaWYgKHRoaXMudmFsaWRhdGUodikpIHtcclxuICAgICAgZXZlbnQuc3RvcChldnQpO1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgYG9ua2V5dXBgIGV2ZW50LlxyXG4gICAqXHJcbiAgICogSWYgZWl0aGVyIHRoZSBgdmFsaWRhdGlvblRyaWdnZXJgIG9yIGBub3RpZmljYXRpb25UcmlnZ2VyYCBpcyBzZXQgdG8gYGtleXVwYCB0aGVuIGl0IHdpbGwgZmlyZVxyXG4gICAqIHRoZSByZXNwZWN0aXZlIGZ1bmN0aW9uLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XHJcbiAgICovXHJcbiAgX29uS2V5VXA6IGZ1bmN0aW9uIF9vbktleVVwKGV2dCkge1xyXG4gICAgaWYgKHRoaXMudmFsaWRhdGlvblRyaWdnZXIgPT09ICdrZXl1cCcpIHtcclxuICAgICAgdGhpcy5vblZhbGlkYXRpb25UcmlnZ2VyKGV2dCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMubm90aWZpY2F0aW9uVHJpZ2dlciA9PT0gJ2tleXVwJykge1xyXG4gICAgICB0aGlzLm9uTm90aWZpY2F0aW9uVHJpZ2dlcihldnQpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdGhlIGBvbmJsdXJgIGV2ZW50XHJcbiAgICpcclxuICAgKiBJZiBlaXRoZXIgdGhlIGB2YWxpZGF0aW9uVHJpZ2dlcmAgb3IgYG5vdGlmaWNhdGlvblRyaWdnZXJgIGlzIHNldCB0byBgYmx1cmAgdGhlbiBpdCB3aWxsIGZpcmVcclxuICAgKiB0aGUgcmVzcGVjdGl2ZSBmdW5jdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxyXG4gICAqL1xyXG4gIF9vbkJsdXI6IGZ1bmN0aW9uIF9vbkJsdXIoZXZ0KSB7XHJcbiAgICBpZiAodGhpcy52YWxpZGF0aW9uVHJpZ2dlciA9PT0gJ2JsdXInKSB7XHJcbiAgICAgIHRoaXMub25WYWxpZGF0aW9uVHJpZ2dlcihldnQpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm5vdGlmaWNhdGlvblRyaWdnZXIgPT09ICdibHVyJykge1xyXG4gICAgICB0aGlzLm9uTm90aWZpY2F0aW9uVHJpZ2dlcihldnQpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRmlyZXMge0BsaW5rIF9GaWVsZCNvbkNoYW5nZSBvbkNoYW5nZX0gaWYgdGhlIHZhbHVlIGhhcyBjaGFuZ2VkIHNpbmNlIHRoZSBwcmV2aW91cyBub3RpZmljYXRpb24gZXZlbnQgb3JcclxuICAgKiBhIGRpcmVjdCBzZXR0aW5nIG9mIHRoZSB2YWx1ZS5cclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnRcclxuICAgKi9cclxuICBvbk5vdGlmaWNhdGlvblRyaWdnZXI6IGZ1bmN0aW9uIG9uTm90aWZpY2F0aW9uVHJpZ2dlcigvKiBldnQqLykge1xyXG4gICAgY29uc3QgY3VycmVudFZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xyXG5cclxuICAgIGlmICh0aGlzLnByZXZpb3VzVmFsdWUgIT09IGN1cnJlbnRWYWx1ZSkge1xyXG4gICAgICB0aGlzLnByZXZpb3VzVmFsdWUgPSBjdXJyZW50VmFsdWU7XHJcbiAgICAgIHRoaXMub25DaGFuZ2UoY3VycmVudFZhbHVlLCB0aGlzKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEltbWVkaWF0ZWx5IGNhbGxzIHtAbGluayBfRmllbGQjdmFsaWRhdGUgdmFsaWRhdGV9IGFuZCBhZGRzIHRoZSByZXNwZWN0aXZlIHJvdyBzdHlsaW5nLlxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxyXG4gICAqL1xyXG4gIG9uVmFsaWRhdGlvblRyaWdnZXI6IGZ1bmN0aW9uIG9uVmFsaWRhdGlvblRyaWdnZXIoLyogZXZ0Ki8pIHtcclxuICAgIGlmICh0aGlzLnZhbGlkYXRlKCkpIHtcclxuICAgICAgJCh0aGlzLmNvbnRhaW5lck5vZGUpLmFkZENsYXNzKCdyb3ctZXJyb3InKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICQodGhpcy5jb250YWluZXJOb2RlKS5yZW1vdmVDbGFzcygncm93LWVycm9yJyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBpbnB1dCBub2RlcyB2YWx1ZVxyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgKi9cclxuICBnZXRWYWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbnB1dE5vZGUudmFsdWU7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB2YWx1ZSBvZiB0aGUgaW5wdXQgbm9kZSwgY2xlYXJzIHRoZSBwcmV2aW91cyB2YWx1ZSBmb3Igbm90aWZpY2F0aW9uIHRyaWdnZXIgYW5kXHJcbiAgICogaWYgc2V0dGluZyBhbiBpbml0aWFsIHZhbHVlIC0gc2V0IHRoZSBvcmlnaW5hbFZhbHVlIHRvIHRoZSBwYXNzZWQgdmFsdWUgZm9yIGRpcnR5IGRldGVjdGlvbi5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmFsIFZhbHVlIHRvIGJlIHNldFxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5pdGlhbCBUcnVlIGlmIHRoZSB2YWx1ZSBpcyB0aGUgZGVmYXVsdC9jbGVhbiB2YWx1ZSwgZmFsc2UgaWYgaXQgaXMgYSBtZWFudCBhcyBhIGRpcnR5IHZhbHVlXHJcbiAgICovXHJcbiAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKHZhbCA9ICcnLCBpbml0aWFsKSB7XHJcbiAgICBpZiAoaW5pdGlhbCkge1xyXG4gICAgICB0aGlzLm9yaWdpbmFsVmFsdWUgPSB2YWw7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5wcmV2aW91c1ZhbHVlID0gdmFsO1xyXG4gICAgdGhpcy5zZXQoJ2lucHV0VmFsdWUnLCB2YWwpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgdmFsdWUgb2YgdGhlIGlucHV0IG5vZGUsIGFuZCBzZXQgdGhlIHZhbHVlIGFzIHRoZSBwcmV2aW91cyB2YWx1ZSAgc28gbm90aWZpY2F0aW9uIHRyaWdnZXIgd2lsbCBub3QgdHJpZ2dlciBhbmRcclxuICAgKiBpZiBzZXR0aW5nIGFuIGluaXRpYWwgdmFsdWUgLSBzZXQgdGhlIG9yaWdpbmFsVmFsdWUgdG8gdGhlIHBhc3NlZCB2YWx1ZSBmb3IgZGlydHkgZGV0ZWN0aW9uLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB2YWwgVmFsdWUgdG8gYmUgc2V0XHJcbiAgICogQHBhcmFtIHtCb29sZWFufSBpbml0aWFsIFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZSBkZWZhdWx0L2NsZWFuIHZhbHVlLCBmYWxzZSBpZiBpdCBpcyBhIG1lYW50IGFzIGEgZGlydHkgdmFsdWVcclxuICAgKi9cclxuICBzZXRWYWx1ZU5vVHJpZ2dlcjogZnVuY3Rpb24gc2V0VmFsdWVOb1RyaWdnZXIodmFsLCBpbml0aWFsKSB7XHJcbiAgICB0aGlzLnNldFZhbHVlKHZhbCwgaW5pdGlhbCk7XHJcbiAgICB0aGlzLnByZXZpb3VzVmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDbGVhcnMgdGhlIGlucHV0IG5vZGVzIHZhbHVlLCBvcHRpb25hbGx5IGNsZWFyaW5nIGFzIGEgbW9kaWZpZWQgdmFsdWUuXHJcbiAgICogQHBhcmFtIHtCb29sZWFufSBhc0RpcnR5IElmIHRydWUgaXQgc2lnbmlmaWVzIHRoZSBjbGVhcmluZyBpcyBtZWFudCBhcyBkZXN0cm95aW5nIGFuXHJcbiAgICogZXhpc3RpbmcgdmFsdWUgYW5kIHNob3VsZCB0aGVuIGJlIGRldGVjdGVkIGFzIG1vZGlmaWVkL2RpcnR5LlxyXG4gICAqL1xyXG4gIGNsZWFyVmFsdWU6IGZ1bmN0aW9uIGNsZWFyVmFsdWUoYXNEaXJ0eSkge1xyXG4gICAgY29uc3QgaW5pdGlhbCA9IGFzRGlydHkgIT09IHRydWU7XHJcbiAgICB0aGlzLnNldFZhbHVlKCcnLCBpbml0aWFsKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgdGhlIHZhbHVlIGhhcyBiZWVuIG1vZGlmaWVkIGZyb20gdGhlIGRlZmF1bHQvb3JpZ2luYWwgc3RhdGVcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGlzRGlydHk6IGZ1bmN0aW9uIGlzRGlydHkoKSB7XHJcbiAgICByZXR1cm4gKHRoaXMub3JpZ2luYWxWYWx1ZSAhPT0gdGhpcy5nZXRWYWx1ZSgpKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IEZpZWxkTWFuYWdlci5yZWdpc3RlcigndGV4dCcsIGNvbnRyb2wpO1xyXG4iXX0=