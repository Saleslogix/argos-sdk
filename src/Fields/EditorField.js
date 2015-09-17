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
import _Field from 'argos/Fields/_Field';

/**
 * @class argos.Fields.EditorField
 * The EditorField is not a field per say but a base class for another field type to inherit from. The
 * intent of an EditorField is you have a field where the input should come from another form. EditorField
 * will handle the navigation, gathering values from the other view, going back and applying to the form
 * the field is on.
 *
 * A prime example of an editor field extension would be an AddressField - say you are entering a contacts
 * details and need the address. You could make an AddressField that extends EditorField for handling all
 * the address parts and takes the user to an address_edit with all the street/city/postal etc.
 *
 * @alternateClassName EditorField
 * @extends argos._Field
 */
const __class = declare('argos.Fields.EditorField', [_Field], {
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
  widgetTemplate: new Simplate([
    '<label for="{%= $.name %}">{%: $.label %}</label>',
    '<button class="button simpleSubHeaderButton {% if ($$.iconClass) { %} {%: $$.iconClass %} {% } %}" aria-label="{%: $.lookupLabelText %}"><span>{%: $.lookupText %}</span></button>',
    '<input data-dojo-attach-point="inputNode" type="text" />',
  ]),

  iconClass: 'fa fa-pencil fa-lg',

  // Localization
  localeId: 'editorField',

  /**
   * @cfg {String}
   * The view id that the user will be taken to when the edit button is clicked.
   */
  view: null,
  /**
   * @property {String}
   * Value storage for keeping track of modified/unmodified values. Used in {@link #isDirty isDirty}.
   */
  originalValue: null,
  /**
   * @property {Object/String/Date/Number}
   * Value storage for current value, as it must be formatted for display this is the full value.
   */
  currentValue: null,
  /**
   * @property {Object/String/Date/Number}
   * Value storage for the value to use in validation, when gathering values from the editor view
   * the validationValue is set using `getValues(true)` which returns all values even non-modified ones.
   */
  validationValue: null,

  /**
   * Returns the formatted value. This should be overwritten to provide proper formatting
   * @param val
   * @template
   */
  formatValue: function formatValue(/*val*/) {
    return '';
  },
  /**
   * Extends the parent implementation to connect the `onclick` event of the fields container
   * to {@link #_onClick _onClick}.
   */
  init: function init() {
    this.inherited(arguments);

    this.connect(this.containerNode, 'onclick', this._onClick);
  },
  /**
   * Extends the parent implementation to also call {@link #_enableTextElement _enableTextElement}.
   */
  enable: function enable() {
    this.inherited(arguments);

    this._enableTextElement();
  },
  /**
   * Sets the input nodes' disabled attribute to false
   */
  _enableTextElement: function _enableTextElement() {
    this.inputNode.disabled = false;
  },
  /**
   * Extends the parent implementation to also call {@link #_disableTextElement _disableTextElement}.
   */
  disable: function disable() {
    this.inherited(arguments);
    this._disableTextElement();
  },
  /**
   * Sets the input nodes' disabled attribute to true
   */
  _disableTextElement: function _disableTextElement() {
    this.inputNode.disabled = true;
  },
  /**
   * Creates the navigation options to be passed to the editor view. The important part
   * of this code is that it passes `tools` that overrides the editors view toolbar with an item
   * that operates within this fields scope.
   * @return Navigation options
   */
  createNavigationOptions: function createNavigationOptions() {
    return {
      tools: {
        tbar: [{
          id: 'complete',
          cls: 'fa fa-check fa-fw fa-lg',
          fn: this.complete,
          scope: this,
        }, {
          id: 'cancel',
          cls: 'fa fa-ban fa-fw fa-lg',
          side: 'left',
          fn: ReUI.back,
          scope: ReUI,
        }],
      },
      entry: this.originalValue || this.validationValue,
      changes: this.currentValue,
      entityName: this.entityName || (this.owner && this.owner.entityName),
      negateHistory: true,
    };
  },
  /**
   * Navigates to the given `this.view` using the options from {@link #createNavigationOptions createNavigationOptions}.
   */
  navigateToEditView: function navigateToEditView() {
    if (this.isDisabled()) {
      return;
    }

    const view = App.getView(this.view);
    const options = this.createNavigationOptions();

    if (view && options) {
      if (options.title) {
        view.set('title', options.title);
      }

      view.show(options);
    }
  },
  /**
   * Handler for the `onclick` event of the fields container.
   *
   * Invokes {@link #navigateToEditView navigateToEditView}.
   *
   * @param {Event} evt
   */
  _onClick: function _onClick(evt) {
    event.stop(evt);
    this.navigateToEditView();
  },
  /**
   * Gets the values from the editor view and applies it to the this fields `this.currentValue` and
   * `this.validationValue`.
   */
  getValuesFromView: function getValuesFromView() {
    const view = App.getPrimaryActiveView();
    const values = view && view.getValues();

    if (view && values) {
      if (this.applyTo) {
        this.currentValue = values;
      } else if (this.owner.inserting) {
        // If we are inserting a new value, we want all the fields, not just fields that changed (if the user edited multiple times)
        this.currentValue = view.getValues(true);
      } else {
        // Gets an entry with fields that are dirty
        this.currentValue = view.createItem();
      }

      // store all editor values for validation, not only dirty values
      this.validationValue = view.getValues(true);
    }
  },
  /**
   * Handler for the toolbar item that is passed to the editor view. When this function fires
   * the view shown is the editor view but the function is fired in scope of the field.
   *
   * It gets a handler of the current active view and validates the form, if it passes it gathers
   * the value, sets the fields text, calls `ReUI.back` and fires {@link #_onComplete _onComplete}.
   *
   */
  complete: function complete() {
    const view = App.getPrimaryActiveView();

    if (view instanceof argos.Edit) {
      view.hideValidationSummary();

      if (view.validate() !== false) {
        view.showValidationSummary();
        return;
      }
    }

    this.getValuesFromView();

    this.setText(this.formatValue(this.validationValue));

    // todo: remove
    if (view.isValid && !view.isValid()) {
      return;
    }

    ReUI.back();
    // if the event is fired before the transition, any XMLHttpRequest created in an event handler and
    // executing during the transition can potentially fail (status 0).  this might only be an issue with CORS
    // requests created in this state (the pre-flight request is made, and the request ends with status 0).
    // wrapping thing in a timeout and placing after the transition starts, mitigates this issue.
    setTimeout(this._onComplete.bind(this), 0);
  },
  /**
   * Handler for `_onComplete` which is fired after the user has completed the form in the editor view
   *
   * Fires {@link #onChange onChange}.
   *
   */
  _onComplete: function _onComplete() {
    this.onChange(this.currentValue, this);
  },
  /**
   * Sets the displayed text to the input.
   * @param {String} text
   */
  setText: function setText(text) {
    this.set('inputValue', text);
  },
  /**
   * Determines if the value has been modified from the default/original state
   * @return {Boolean}
   */
  isDirty: function isDirty() {
    return this.originalValue !== this.currentValue;
  },
  /**
   * Returns the current value
   * @return {Object/String/Date/Number}
   */
  getValue: function getValue() {
    return this.currentValue;
  },
  /**
   * Extends the parent implementation to use the `this.validationValue` instead of `this.getValue()`.
   * @param value
   */
  validate: function validate(value) {
    return typeof value === 'undefined' ? this.inherited(arguments, [this.validationValue]) : this.inherited(arguments);
  },
  /**
   * Sets the current value to the item passed, as the default if initial is true. Then it sets
   * the displayed text using {@link #setText setText} with the {@link #formatValue formatted} value.
   *
   * If null/false is passed all is cleared and `this.emptyText` is set as the displayed text.
   *
   * @param {Object/String/Date/Number} val Value to be set
   * @param {Boolean} initial True if the value is the default/clean value, false if it is a meant as a dirty value
   */
  setValue: function setValue(val, initial) {
    if (val) {
      this.validationValue = this.currentValue = val;

      if (initial) {
        this.originalValue = this.currentValue;
      }

      this.setText(this.formatValue(val));
    } else {
      this.validationValue = this.currentValue = null;

      if (initial) {
        this.originalValue = this.currentValue;
      }

      this.setText(this.emptyText);
    }
  },
  /**
   * Clears the value by passing `null` to {@link #setValue setValue}
   */
  clearValue: function clearValue() {
    this.setValue(null, true);
  },
});

lang.setObject('Sage.Platform.Mobile.Fields.EditorField', __class);
export default __class;
