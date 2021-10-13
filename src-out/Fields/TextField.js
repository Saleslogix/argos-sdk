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
   * @class
   * @alias module:argos/Fields/TextField
   * @classdesc The TextField is the base method of inputting just a string that is bound to a `<input type="text">`.
   *
   * It does introduce:
   *
   * * Clear button - adds a small x buton to clear the input
   * * Option to only allow valid input at each keypress
   *
   * @example
   * {
   *   name: 'LastName',
   *   property: 'LastName',
   *   label: this.lastNameText,
   *   type: 'text',
   * }
   * @extends module:argos/Fields/_Field
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

  /**
   * @module argos/Fields/TextField
   */
  var control = (0, _declare2.default)('argos.Fields.TextField', [_Field3.default], /** @lends module:argos/Fields/TextField.prototype */{
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