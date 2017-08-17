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
import event from 'dojo/_base/event';
import _Field from './_Field';
import FieldManager from '../FieldManager';


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
const control = declare('argos.Fields.TextField', [_Field], /** @lends argos.Fields.TextField# */{
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
      attribute: 'value',
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
  widgetTemplate: new Simplate([`
      <div class="field">
        <label for="{%= $.name %}"
          {% if ($.required) { %}
          class="required"
          {% } %}
          >{%: $.label %}</label>
        <input
          data-dojo-attach-point="inputNode"
          type="{%: $.inputType %}"
          id="{%= $.name %}"
          name="{%= $.name %}"
          placeholder="{%: $.placeHolderText %}"
          {% if ($.required) { %}
            data-validate="required"
            class="required"
          {% } %}
          {% if ($.readonly) { %} readonly {% } %}
          >
      </div>
    `,
  ]),
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
    this.inherited(arguments);
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
    this.inherited(arguments);
    $(this.inputNode).css('disabled', false);
    $(this.inputNode).enable();
  },
  /**
   * Extends the parent implementation to set the disabled attribute of the input to true
   */
  disable: function disable() {
    this.inherited(arguments);

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
    const v = this.getValue() + evt.keyChar;
    if (this.validate(v)) {
      event.stop(evt);
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
  onNotificationTrigger: function onNotificationTrigger(/* evt*/) {
    const currentValue = this.getValue();

    if (this.previousValue !== currentValue) {
      this.onChange(currentValue, this);
    }

    this.previousValue = currentValue;
  },
  /**
   * Immediately calls {@link _Field#validate validate} and adds the respective row styling.
   * @param {Event} evt
   */
  onValidationTrigger: function onValidationTrigger(/* evt*/) {
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
  setValue: function setValue(val = '', initial) {
    if (initial) {
      this.originalValue = val;
    }

    this.previousValue = false;
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
    const initial = asDirty !== true;
    this.setValue('', initial);
  },
  /**
   * Determines if the value has been modified from the default/original state
   * @return {Boolean}
   */
  isDirty: function isDirty() {
    return (this.originalValue !== this.getValue());
  },
});

export default FieldManager.register('text', control);
