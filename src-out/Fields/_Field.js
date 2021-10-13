define('argos/Fields/_Field', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', 'dijit/_WidgetBase', '../_ActionMixin', '../_Templated'], function (module, exports, _declare, _lang, _string, _WidgetBase2, _ActionMixin2, _Templated2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _string2 = _interopRequireDefault(_string);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _ActionMixin3 = _interopRequireDefault(_ActionMixin2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/Fields/_Field
   * @classdesc Field is the base class for all field controls. It describes all the functions a field should support giving no implementation itself, merely a shell. The one function that `_Field` does provide that most fields leave untouched is `validate`.
   * All fields are dijit Widgets meaning it goes through the same lifecycle and has all the Widget functionality.
   * @mixes module:argos/_ActionMixin
   * @extends module:argos/_Templated
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
   * @module argos/Fields/_Field
   */
  var __class = (0, _declare2.default)('argos.Fields._Field', [_WidgetBase3.default, _Templated3.default], /** @lends module:argos/Fields/_Field.prototype */{
    _ActionMixin: null,

    /**
     * @property {View} owner
     * View that controls the field.
     */
    owner: false,
    /**
     * @property {String} applyTo
     * If defined it will use the applyTo string when getting and setting properties from
     * the SData object instead of the `property` property.
     */
    applyTo: false,
    /**
     * @property {Boolean} alwaysUseValue
     * Signifies that the field should always be included when the form calls {@link Edit#getValues getValues}.
     */
    alwaysUseValue: false,
    /**
     * @property {Boolean} disabled
     * Indicates the disabled state
     */
    disabled: false,
    /**
     * @property {Boolean} hidden
     * Indicates the visibility state
     */
    hidden: false,
    /**
     * This applies a default value when inserting a new record, the default value
     * is applied after the template entry but before the context and changes are applied.
     *
     * Note the word `default` must be in quotes as default is a reserved word in javascript.
     */
    default: undefined,
    /**
     * @property {String} name
     * The unique (within the current form) name of the field
     */
    name: null,
    /**
     * @property {String} label
     * The text that will, by default, show to the left of a field.
     */
    label: null,
    /**
     * @property {String} property
     * The SData property that the field will be bound to.
     */
    property: null,
    /**
     * @property {String} type
     * The registered name of the field that gets mapped in {@link FieldManager FieldManager} when
     * the field is constructed
     */
    type: null,

    /**
     * @property {Boolean} autoFocus
     * Flag to indicate if this field should be focused when the form is shown.
     */
    autoFocus: false,

    app: null,
    reui: null,
    highlightCls: 'field-highlight',

    /**
     * @property {Simplate}
     * Simplate used to define the fields HTML Markup
     */
    widgetTemplate: new Simplate(['<input data-dojo-attach-point="inputNode">']),
    /**
     * @property {HTMLElement}
     * The parent container element of the field.
     */
    containerNode: null,
    /**
     * Passed options object will be mixed into the field, overwriting any defaults.
     * @param {Object} o Override options
     * @constructs
     */
    constructor: function constructor(o) {
      _lang2.default.mixin(this, o);

      if (this.app === null) {
        this.app = window.App;
      }

      if (this.reui === null) {
        this.reui = window.ReUI;
      }
    },
    postCreate: function postCreate() {
      this._ActionMixin = new _ActionMixin3.default();
      this._ActionMixin.postCreate(this);
    },
    /**
     * Focuses the input for the field
     */
    focus: function focus() {},
    /**
     * Inserts the field into the given DOM node using dijit Widget `placeAt(node)` and saves
     * a reference to it to `this.containerNode`.
     * @param {HTMLElement} node Target node to insert the field into
     */
    renderTo: function renderTo(node) {
      this.containerNode = node; // todo: should node actually be containerNode instead of last rendered node?
      this.placeAt(node);
    },
    /**
     * Calledd during app startup after all fields have been inserted into the view
     * @template
     */
    init: function init() {},
    /**
     * Determines if the fields' value has changed from the original value. Each field type
     * should override this function and provide one tailored to its datatype.
     * @template
     * @return {Boolean} True if the value has been modified (dirty).
     */
    isDirty: function isDirty() {
      return true;
    },
    /**
     * Sets disabled to false and fires {@link #onEnable onEnable}.
     */
    enable: function enable() {
      this.disabled = false;
      this.onEnable(this);
    },
    /**
     * Sets disabled to true and fires {@link #onDisable onDisable}.
     */
    disable: function disable() {
      this.disabled = true;
      this.onDisable(this);
    },
    /**
     * Returns the disabled state
     * @return {Boolean}
     */
    isDisabled: function isDisabled() {
      return this.disabled;
    },
    /**
     * Sets hidden to false and fires {@link #onShow onShow}.
     */
    show: function show() {
      this.hidden = false;
      this.onShow(this);
    },
    /**
     * Sets hidden to true and fires {@link #onHide onHide}.
     */
    hide: function hide() {
      this.hidden = true;
      this.onHide(this);
    },
    /**
     * Returns the hidden state
     * @return {Boolean}
     */
    isHidden: function isHidden() {
      return this.hidden;
    },
    /**
     * Each field type will need to implement this function to return the value of the field.
     * @template
     */
    getValue: function getValue() {},
    /**
     * Each field type will need to implement this function to set the value and represent the change visually.
     * @param {String/Boolean/Number/Object} val The value to set
     * @param {Boolean} initial If true the value is meant to be the default/original/clean value.
     * @template
     */
    setValue: function setValue() /* val, initial*/{},
    /**
     * Each field type will need to implement this function to clear the value and visually.
     * @template
     */
    clearValue: function clearValue() {},
    /**
     * The validate function determines if there is any errors - meaning it will return false for a "Error free" field.
     *
     * ###Basic Flow:
     *
     * * loops over each `validator` defined on the field
     *
     * * Evaluate the result
     *    * If the validator is a RegExp, use return `!regExp.test(value)`
     *    * If the validator is a function, call and return the result of the function passing the value, _Field instance, and the `owner` property.
     *    * If the validator is an object and has a `test` key, follow the RegExp path.
     *    * If the validator is an object and has a `fn` key, follow the function path.
     *
     * * If the result is true and the validator is an object with a `message` key:
     *   * If message is a function, call and return the result of the function passing the value, _Field instance and the `owner` property.
     *   * Otherwise, assume it is a string format and call dojo's `string.substitute` using the message as the format, `${0}` as the value, `${1}` as the fields name, `${2}` as the fields label property.
     *   * Save the result of the function or string substitution as the result itself.
     *
     * * Return the result.
     * @param value Value of the field, if not passed then {@link #getValue getValue} is used.
     * @return {Boolean/Object} False signifies that everything is okay and the field is valid, `true` or a `string message` indicates that it failed.
     */
    validate: function validate(value) {
      if (typeof this.validator === 'undefined') {
        return false;
      }

      if (this.isHidden() || this.isDisabled()) {
        return false;
      }

      var all = Array.isArray(this.validator) ? this.validator : [this.validator];

      for (var i = 0; i < all.length; i++) {
        var current = all[i];
        var definition = void 0;

        if (current instanceof RegExp) {
          definition = {
            test: current
          };
        } else if (typeof current === 'function') {
          definition = {
            fn: current
          };
        } else {
          definition = current;
        }

        var newValue = typeof value === 'undefined' ? this.getValue() : value;

        var result = false;
        if (typeof definition.fn === 'function') {
          result = definition.fn.call(definition.scope || this, newValue, this, this.owner);
        } else if (definition.test instanceof RegExp) {
          result = !definition.test.test(newValue);
        }

        if (result) {
          if (definition.message) {
            result = typeof definition.message === 'function' ? definition.message.call(definition.scope || this, newValue, this, this.owner) : _string2.default.substitute(definition.message, [newValue, this.name, this.label]);
          }

          return result;
        }
      }

      return false;
    },
    /**
     * Event that fires when the field is enabled
     * @param {_Field} field The field itself
     * @template
     */
    onEnable: function onEnable() /* field*/{},
    /**
     * Event that fires when the field is disabled
     * @param {_Field} field The field itself
     * @template
     */
    onDisable: function onDisable() /* field*/{},
    /**
     * Event that fires when the field is shown
     * @param {_Field} field The field itself
     * @template
     */
    onShow: function onShow() /* field*/{},
    /**
     * Event that fires when the field is hidden
     * @param {_Field} field The field itself
     * @template
     */
    onHide: function onHide() /* field*/{},
    /**
     * Event that fires when the field is changed
     * @param {_Field} field The field itself
     * @template
     */
    onChange: function onChange() /* value, field*/{}
  });

  exports.default = __class;
  module.exports = exports['default'];
});