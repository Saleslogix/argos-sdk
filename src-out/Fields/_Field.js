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
   * @class argos.Fields._Field
   * @classdesc Field is the base class for all field controls. It describes all the functions a field should support giving no implementation itself, merely a shell. The one function that `_Field` does provide that most fields leave untouched is `validate`.
   * All fields are dijit Widgets meaning it goes through the same lifecycle and has all the Widget functionality.
   * @mixins argos._ActionMixin
   * @mixins argos._Templated
   * @requires argos.FieldManager
   */
  var __class = (0, _declare2.default)('argos.Fields._Field', [_WidgetBase3.default, _ActionMixin3.default, _Templated3.default], /** @lends argos.Fields._Field# */{
    /**
     * @property {View}
     * View that controls the field.
     */
    owner: false,
    /**
     * @property {String}
     * If defined it will use the applyTo string when getting and setting properties from
     * the SData object instead of the `property` property.
     */
    applyTo: false,
    /**
     * @property {Boolean}
     * Signifies that the field should always be included when the form calls {@link Edit#getValues getValues}.
     */
    alwaysUseValue: false,
    /**
     * @property {Boolean}
     * Indicates the disabled state
     */
    disabled: false,
    /**
     * @property {Boolean}
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
     * @property {String}
     * The unique (within the current form) name of the field
     */
    name: null,
    /**
     * @property {String}
     * The text that will, by default, show to the left of a field.
     */
    label: null,
    /**
     * @property {String}
     * The SData property that the field will be bound to.
     */
    property: null,
    /**
     * @property {String}
     * The registered name of the field that gets mapped in {@link FieldManager FieldManager} when
     * the field is constructed
     */
    type: null,

    /**
     * @property {Boolean}
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvX0ZpZWxkLmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJvd25lciIsImFwcGx5VG8iLCJhbHdheXNVc2VWYWx1ZSIsImRpc2FibGVkIiwiaGlkZGVuIiwiZGVmYXVsdCIsInVuZGVmaW5lZCIsIm5hbWUiLCJsYWJlbCIsInByb3BlcnR5IiwidHlwZSIsImF1dG9Gb2N1cyIsImFwcCIsInJldWkiLCJoaWdobGlnaHRDbHMiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwiY29udGFpbmVyTm9kZSIsImNvbnN0cnVjdG9yIiwibyIsIm1peGluIiwid2luZG93IiwiQXBwIiwiUmVVSSIsImZvY3VzIiwicmVuZGVyVG8iLCJub2RlIiwicGxhY2VBdCIsImluaXQiLCJpc0RpcnR5IiwiZW5hYmxlIiwib25FbmFibGUiLCJkaXNhYmxlIiwib25EaXNhYmxlIiwiaXNEaXNhYmxlZCIsInNob3ciLCJvblNob3ciLCJoaWRlIiwib25IaWRlIiwiaXNIaWRkZW4iLCJnZXRWYWx1ZSIsInNldFZhbHVlIiwiY2xlYXJWYWx1ZSIsInZhbGlkYXRlIiwidmFsdWUiLCJ2YWxpZGF0b3IiLCJhbGwiLCJBcnJheSIsImlzQXJyYXkiLCJpIiwibGVuZ3RoIiwiY3VycmVudCIsImRlZmluaXRpb24iLCJSZWdFeHAiLCJ0ZXN0IiwiZm4iLCJuZXdWYWx1ZSIsInJlc3VsdCIsImNhbGwiLCJzY29wZSIsIm1lc3NhZ2UiLCJzdWJzdGl0dXRlIiwib25DaGFuZ2UiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7Ozs7OztBQWVBLE1BQU1BLFVBQVUsdUJBQVEscUJBQVIsRUFBK0Isa0VBQS9CLEVBQXdFLGtDQUFtQztBQUN6SDs7OztBQUlBQyxXQUFPLEtBTGtIO0FBTXpIOzs7OztBQUtBQyxhQUFTLEtBWGdIO0FBWXpIOzs7O0FBSUFDLG9CQUFnQixLQWhCeUc7QUFpQnpIOzs7O0FBSUFD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LElBQW5CLENBQXdCTixXQUFXTyxLQUFYLElBQW9CLElBQTVDLEVBQWtESCxRQUFsRCxFQUE0RCxJQUE1RCxFQUFrRSxLQUFLeEQsS0FBdkUsQ0FBM0MsR0FBMkgsaUJBQU82RCxVQUFQLENBQWtCVCxXQUFXUSxPQUE3QixFQUFzQyxDQUFDSixRQUFELEVBQVcsS0FBS2pELElBQWhCLEVBQXNCLEtBQUtDLEtBQTNCLENBQXRDLENBQXBJO0FBQ0Q7O0FBRUQsaUJBQU9pRCxNQUFQO0FBQ0Q7QUFDRjs7QUFFRCxhQUFPLEtBQVA7QUFDRCxLQXBQd0g7QUFxUHpIOzs7OztBQUtBMUIsY0FBVSxTQUFTQSxRQUFULEdBQWtCLFVBQVksQ0FBRSxDQTFQK0U7QUEyUHpIOzs7OztBQUtBRSxlQUFXLFNBQVNBLFNBQVQsR0FBbUIsVUFBWSxDQUFFLENBaFE2RTtBQWlRekg7Ozs7O0FBS0FHLFlBQVEsU0FBU0EsTUFBVCxHQUFnQixVQUFZLENBQUUsQ0F0UW1GO0FBdVF6SDs7Ozs7QUFLQUUsWUFBUSxTQUFTQSxNQUFULEdBQWdCLFVBQVksQ0FBRSxDQTVRbUY7QUE2UXpIOzs7OztBQUtBd0IsY0FBVSxTQUFTQSxRQUFULEdBQWtCLGlCQUFtQixDQUFFO0FBbFJ3RSxHQUEzRyxDQUFoQjs7b0JBcVJlL0QsTyIsImZpbGUiOiJfRmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRmllbGRzLl9GaWVsZFxyXG4gKiBAY2xhc3NkZXNjIEZpZWxkIGlzIHRoZSBiYXNlIGNsYXNzIGZvciBhbGwgZmllbGQgY29udHJvbHMuIEl0IGRlc2NyaWJlcyBhbGwgdGhlIGZ1bmN0aW9ucyBhIGZpZWxkIHNob3VsZCBzdXBwb3J0IGdpdmluZyBubyBpbXBsZW1lbnRhdGlvbiBpdHNlbGYsIG1lcmVseSBhIHNoZWxsLiBUaGUgb25lIGZ1bmN0aW9uIHRoYXQgYF9GaWVsZGAgZG9lcyBwcm92aWRlIHRoYXQgbW9zdCBmaWVsZHMgbGVhdmUgdW50b3VjaGVkIGlzIGB2YWxpZGF0ZWAuXHJcbiAqIEFsbCBmaWVsZHMgYXJlIGRpaml0IFdpZGdldHMgbWVhbmluZyBpdCBnb2VzIHRocm91Z2ggdGhlIHNhbWUgbGlmZWN5Y2xlIGFuZCBoYXMgYWxsIHRoZSBXaWRnZXQgZnVuY3Rpb25hbGl0eS5cclxuICogQG1peGlucyBhcmdvcy5fQWN0aW9uTWl4aW5cclxuICogQG1peGlucyBhcmdvcy5fVGVtcGxhdGVkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZE1hbmFnZXJcclxuICovXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBzdHJpbmcgZnJvbSAnZG9qby9zdHJpbmcnO1xyXG5pbXBvcnQgX1dpZGdldEJhc2UgZnJvbSAnZGlqaXQvX1dpZGdldEJhc2UnO1xyXG5pbXBvcnQgX0FjdGlvbk1peGluIGZyb20gJy4uL19BY3Rpb25NaXhpbic7XHJcbmltcG9ydCBfVGVtcGxhdGVkIGZyb20gJy4uL19UZW1wbGF0ZWQnO1xyXG5cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLkZpZWxkcy5fRmllbGQnLCBbX1dpZGdldEJhc2UsIF9BY3Rpb25NaXhpbiwgX1RlbXBsYXRlZF0sIC8qKiBAbGVuZHMgYXJnb3MuRmllbGRzLl9GaWVsZCMgKi8ge1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Vmlld31cclxuICAgKiBWaWV3IHRoYXQgY29udHJvbHMgdGhlIGZpZWxkLlxyXG4gICAqL1xyXG4gIG93bmVyOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBJZiBkZWZpbmVkIGl0IHdpbGwgdXNlIHRoZSBhcHBseVRvIHN0cmluZyB3aGVuIGdldHRpbmcgYW5kIHNldHRpbmcgcHJvcGVydGllcyBmcm9tXHJcbiAgICogdGhlIFNEYXRhIG9iamVjdCBpbnN0ZWFkIG9mIHRoZSBgcHJvcGVydHlgIHByb3BlcnR5LlxyXG4gICAqL1xyXG4gIGFwcGx5VG86IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBTaWduaWZpZXMgdGhhdCB0aGUgZmllbGQgc2hvdWxkIGFsd2F5cyBiZSBpbmNsdWRlZCB3aGVuIHRoZSBmb3JtIGNhbGxzIHtAbGluayBFZGl0I2dldFZhbHVlcyBnZXRWYWx1ZXN9LlxyXG4gICAqL1xyXG4gIGFsd2F5c1VzZVZhbHVlOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogSW5kaWNhdGVzIHRoZSBkaXNhYmxlZCBzdGF0ZVxyXG4gICAqL1xyXG4gIGRpc2FibGVkOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogSW5kaWNhdGVzIHRoZSB2aXNpYmlsaXR5IHN0YXRlXHJcbiAgICovXHJcbiAgaGlkZGVuOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBUaGlzIGFwcGxpZXMgYSBkZWZhdWx0IHZhbHVlIHdoZW4gaW5zZXJ0aW5nIGEgbmV3IHJlY29yZCwgdGhlIGRlZmF1bHQgdmFsdWVcclxuICAgKiBpcyBhcHBsaWVkIGFmdGVyIHRoZSB0ZW1wbGF0ZSBlbnRyeSBidXQgYmVmb3JlIHRoZSBjb250ZXh0IGFuZCBjaGFuZ2VzIGFyZSBhcHBsaWVkLlxyXG4gICAqXHJcbiAgICogTm90ZSB0aGUgd29yZCBgZGVmYXVsdGAgbXVzdCBiZSBpbiBxdW90ZXMgYXMgZGVmYXVsdCBpcyBhIHJlc2VydmVkIHdvcmQgaW4gamF2YXNjcmlwdC5cclxuICAgKi9cclxuICBkZWZhdWx0OiB1bmRlZmluZWQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHVuaXF1ZSAod2l0aGluIHRoZSBjdXJyZW50IGZvcm0pIG5hbWUgb2YgdGhlIGZpZWxkXHJcbiAgICovXHJcbiAgbmFtZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCB0aGF0IHdpbGwsIGJ5IGRlZmF1bHQsIHNob3cgdG8gdGhlIGxlZnQgb2YgYSBmaWVsZC5cclxuICAgKi9cclxuICBsYWJlbDogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgU0RhdGEgcHJvcGVydHkgdGhhdCB0aGUgZmllbGQgd2lsbCBiZSBib3VuZCB0by5cclxuICAgKi9cclxuICBwcm9wZXJ0eTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgcmVnaXN0ZXJlZCBuYW1lIG9mIHRoZSBmaWVsZCB0aGF0IGdldHMgbWFwcGVkIGluIHtAbGluayBGaWVsZE1hbmFnZXIgRmllbGRNYW5hZ2VyfSB3aGVuXHJcbiAgICogdGhlIGZpZWxkIGlzIGNvbnN0cnVjdGVkXHJcbiAgICovXHJcbiAgdHlwZTogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWcgdG8gaW5kaWNhdGUgaWYgdGhpcyBmaWVsZCBzaG91bGQgYmUgZm9jdXNlZCB3aGVuIHRoZSBmb3JtIGlzIHNob3duLlxyXG4gICAqL1xyXG4gIGF1dG9Gb2N1czogZmFsc2UsXHJcblxyXG4gIGFwcDogbnVsbCxcclxuICByZXVpOiBudWxsLFxyXG4gIGhpZ2hsaWdodENsczogJ2ZpZWxkLWhpZ2hsaWdodCcsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdXNlZCB0byBkZWZpbmUgdGhlIGZpZWxkcyBIVE1MIE1hcmt1cFxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxpbnB1dCBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiaW5wdXROb2RlXCI+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fVxyXG4gICAqIFRoZSBwYXJlbnQgY29udGFpbmVyIGVsZW1lbnQgb2YgdGhlIGZpZWxkLlxyXG4gICAqL1xyXG4gIGNvbnRhaW5lck5vZGU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogUGFzc2VkIG9wdGlvbnMgb2JqZWN0IHdpbGwgYmUgbWl4ZWQgaW50byB0aGUgZmllbGQsIG92ZXJ3cml0aW5nIGFueSBkZWZhdWx0cy5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gbyBPdmVycmlkZSBvcHRpb25zXHJcbiAgICogQGNvbnN0cnVjdHNcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gY29uc3RydWN0b3Iobykge1xyXG4gICAgbGFuZy5taXhpbih0aGlzLCBvKTtcclxuXHJcbiAgICBpZiAodGhpcy5hcHAgPT09IG51bGwpIHtcclxuICAgICAgdGhpcy5hcHAgPSB3aW5kb3cuQXBwO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJldWkgPT09IG51bGwpIHtcclxuICAgICAgdGhpcy5yZXVpID0gd2luZG93LlJlVUk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBGb2N1c2VzIHRoZSBpbnB1dCBmb3IgdGhlIGZpZWxkXHJcbiAgICovXHJcbiAgZm9jdXM6IGZ1bmN0aW9uIGZvY3VzKCkge30sXHJcbiAgLyoqXHJcbiAgICogSW5zZXJ0cyB0aGUgZmllbGQgaW50byB0aGUgZ2l2ZW4gRE9NIG5vZGUgdXNpbmcgZGlqaXQgV2lkZ2V0IGBwbGFjZUF0KG5vZGUpYCBhbmQgc2F2ZXNcclxuICAgKiBhIHJlZmVyZW5jZSB0byBpdCB0byBgdGhpcy5jb250YWluZXJOb2RlYC5cclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlIFRhcmdldCBub2RlIHRvIGluc2VydCB0aGUgZmllbGQgaW50b1xyXG4gICAqL1xyXG4gIHJlbmRlclRvOiBmdW5jdGlvbiByZW5kZXJUbyhub2RlKSB7XHJcbiAgICB0aGlzLmNvbnRhaW5lck5vZGUgPSBub2RlOyAvLyB0b2RvOiBzaG91bGQgbm9kZSBhY3R1YWxseSBiZSBjb250YWluZXJOb2RlIGluc3RlYWQgb2YgbGFzdCByZW5kZXJlZCBub2RlP1xyXG4gICAgdGhpcy5wbGFjZUF0KG5vZGUpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkZCBkdXJpbmcgYXBwIHN0YXJ0dXAgYWZ0ZXIgYWxsIGZpZWxkcyBoYXZlIGJlZW4gaW5zZXJ0ZWQgaW50byB0aGUgdmlld1xyXG4gICAqIEB0ZW1wbGF0ZVxyXG4gICAqL1xyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7fSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBmaWVsZHMnIHZhbHVlIGhhcyBjaGFuZ2VkIGZyb20gdGhlIG9yaWdpbmFsIHZhbHVlLiBFYWNoIGZpZWxkIHR5cGVcclxuICAgKiBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiBhbmQgcHJvdmlkZSBvbmUgdGFpbG9yZWQgdG8gaXRzIGRhdGF0eXBlLlxyXG4gICAqIEB0ZW1wbGF0ZVxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgdGhlIHZhbHVlIGhhcyBiZWVuIG1vZGlmaWVkIChkaXJ0eSkuXHJcbiAgICovXHJcbiAgaXNEaXJ0eTogZnVuY3Rpb24gaXNEaXJ0eSgpIHtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyBkaXNhYmxlZCB0byBmYWxzZSBhbmQgZmlyZXMge0BsaW5rICNvbkVuYWJsZSBvbkVuYWJsZX0uXHJcbiAgICovXHJcbiAgZW5hYmxlOiBmdW5jdGlvbiBlbmFibGUoKSB7XHJcbiAgICB0aGlzLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLm9uRW5hYmxlKHRoaXMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyBkaXNhYmxlZCB0byB0cnVlIGFuZCBmaXJlcyB7QGxpbmsgI29uRGlzYWJsZSBvbkRpc2FibGV9LlxyXG4gICAqL1xyXG4gIGRpc2FibGU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbiAgICB0aGlzLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIHRoaXMub25EaXNhYmxlKHRoaXMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgZGlzYWJsZWQgc3RhdGVcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGlzRGlzYWJsZWQ6IGZ1bmN0aW9uIGlzRGlzYWJsZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5kaXNhYmxlZDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgaGlkZGVuIHRvIGZhbHNlIGFuZCBmaXJlcyB7QGxpbmsgI29uU2hvdyBvblNob3d9LlxyXG4gICAqL1xyXG4gIHNob3c6IGZ1bmN0aW9uIHNob3coKSB7XHJcbiAgICB0aGlzLmhpZGRlbiA9IGZhbHNlO1xyXG4gICAgdGhpcy5vblNob3codGhpcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIGhpZGRlbiB0byB0cnVlIGFuZCBmaXJlcyB7QGxpbmsgI29uSGlkZSBvbkhpZGV9LlxyXG4gICAqL1xyXG4gIGhpZGU6IGZ1bmN0aW9uIGhpZGUoKSB7XHJcbiAgICB0aGlzLmhpZGRlbiA9IHRydWU7XHJcbiAgICB0aGlzLm9uSGlkZSh0aGlzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGhpZGRlbiBzdGF0ZVxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgaXNIaWRkZW46IGZ1bmN0aW9uIGlzSGlkZGVuKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaGlkZGVuO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRWFjaCBmaWVsZCB0eXBlIHdpbGwgbmVlZCB0byBpbXBsZW1lbnQgdGhpcyBmdW5jdGlvbiB0byByZXR1cm4gdGhlIHZhbHVlIG9mIHRoZSBmaWVsZC5cclxuICAgKiBAdGVtcGxhdGVcclxuICAgKi9cclxuICBnZXRWYWx1ZTogZnVuY3Rpb24gZ2V0VmFsdWUoKSB7fSxcclxuICAvKipcclxuICAgKiBFYWNoIGZpZWxkIHR5cGUgd2lsbCBuZWVkIHRvIGltcGxlbWVudCB0aGlzIGZ1bmN0aW9uIHRvIHNldCB0aGUgdmFsdWUgYW5kIHJlcHJlc2VudCB0aGUgY2hhbmdlIHZpc3VhbGx5LlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nL0Jvb2xlYW4vTnVtYmVyL09iamVjdH0gdmFsIFRoZSB2YWx1ZSB0byBzZXRcclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGluaXRpYWwgSWYgdHJ1ZSB0aGUgdmFsdWUgaXMgbWVhbnQgdG8gYmUgdGhlIGRlZmF1bHQvb3JpZ2luYWwvY2xlYW4gdmFsdWUuXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICovXHJcbiAgc2V0VmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKC8qIHZhbCwgaW5pdGlhbCovKSB7fSxcclxuICAvKipcclxuICAgKiBFYWNoIGZpZWxkIHR5cGUgd2lsbCBuZWVkIHRvIGltcGxlbWVudCB0aGlzIGZ1bmN0aW9uIHRvIGNsZWFyIHRoZSB2YWx1ZSBhbmQgdmlzdWFsbHkuXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICovXHJcbiAgY2xlYXJWYWx1ZTogZnVuY3Rpb24gY2xlYXJWYWx1ZSgpIHt9LFxyXG4gIC8qKlxyXG4gICAqIFRoZSB2YWxpZGF0ZSBmdW5jdGlvbiBkZXRlcm1pbmVzIGlmIHRoZXJlIGlzIGFueSBlcnJvcnMgLSBtZWFuaW5nIGl0IHdpbGwgcmV0dXJuIGZhbHNlIGZvciBhIFwiRXJyb3IgZnJlZVwiIGZpZWxkLlxyXG4gICAqXHJcbiAgICogIyMjQmFzaWMgRmxvdzpcclxuICAgKlxyXG4gICAqICogbG9vcHMgb3ZlciBlYWNoIGB2YWxpZGF0b3JgIGRlZmluZWQgb24gdGhlIGZpZWxkXHJcbiAgICpcclxuICAgKiAqIEV2YWx1YXRlIHRoZSByZXN1bHRcclxuICAgKiAgICAqIElmIHRoZSB2YWxpZGF0b3IgaXMgYSBSZWdFeHAsIHVzZSByZXR1cm4gYCFyZWdFeHAudGVzdCh2YWx1ZSlgXHJcbiAgICogICAgKiBJZiB0aGUgdmFsaWRhdG9yIGlzIGEgZnVuY3Rpb24sIGNhbGwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBmdW5jdGlvbiBwYXNzaW5nIHRoZSB2YWx1ZSwgX0ZpZWxkIGluc3RhbmNlLCBhbmQgdGhlIGBvd25lcmAgcHJvcGVydHkuXHJcbiAgICogICAgKiBJZiB0aGUgdmFsaWRhdG9yIGlzIGFuIG9iamVjdCBhbmQgaGFzIGEgYHRlc3RgIGtleSwgZm9sbG93IHRoZSBSZWdFeHAgcGF0aC5cclxuICAgKiAgICAqIElmIHRoZSB2YWxpZGF0b3IgaXMgYW4gb2JqZWN0IGFuZCBoYXMgYSBgZm5gIGtleSwgZm9sbG93IHRoZSBmdW5jdGlvbiBwYXRoLlxyXG4gICAqXHJcbiAgICogKiBJZiB0aGUgcmVzdWx0IGlzIHRydWUgYW5kIHRoZSB2YWxpZGF0b3IgaXMgYW4gb2JqZWN0IHdpdGggYSBgbWVzc2FnZWAga2V5OlxyXG4gICAqICAgKiBJZiBtZXNzYWdlIGlzIGEgZnVuY3Rpb24sIGNhbGwgYW5kIHJldHVybiB0aGUgcmVzdWx0IG9mIHRoZSBmdW5jdGlvbiBwYXNzaW5nIHRoZSB2YWx1ZSwgX0ZpZWxkIGluc3RhbmNlIGFuZCB0aGUgYG93bmVyYCBwcm9wZXJ0eS5cclxuICAgKiAgICogT3RoZXJ3aXNlLCBhc3N1bWUgaXQgaXMgYSBzdHJpbmcgZm9ybWF0IGFuZCBjYWxsIGRvam8ncyBgc3RyaW5nLnN1YnN0aXR1dGVgIHVzaW5nIHRoZSBtZXNzYWdlIGFzIHRoZSBmb3JtYXQsIGAkezB9YCBhcyB0aGUgdmFsdWUsIGAkezF9YCBhcyB0aGUgZmllbGRzIG5hbWUsIGAkezJ9YCBhcyB0aGUgZmllbGRzIGxhYmVsIHByb3BlcnR5LlxyXG4gICAqICAgKiBTYXZlIHRoZSByZXN1bHQgb2YgdGhlIGZ1bmN0aW9uIG9yIHN0cmluZyBzdWJzdGl0dXRpb24gYXMgdGhlIHJlc3VsdCBpdHNlbGYuXHJcbiAgICpcclxuICAgKiAqIFJldHVybiB0aGUgcmVzdWx0LlxyXG4gICAqIEBwYXJhbSB2YWx1ZSBWYWx1ZSBvZiB0aGUgZmllbGQsIGlmIG5vdCBwYXNzZWQgdGhlbiB7QGxpbmsgI2dldFZhbHVlIGdldFZhbHVlfSBpcyB1c2VkLlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW4vT2JqZWN0fSBGYWxzZSBzaWduaWZpZXMgdGhhdCBldmVyeXRoaW5nIGlzIG9rYXkgYW5kIHRoZSBmaWVsZCBpcyB2YWxpZCwgYHRydWVgIG9yIGEgYHN0cmluZyBtZXNzYWdlYCBpbmRpY2F0ZXMgdGhhdCBpdCBmYWlsZWQuXHJcbiAgICovXHJcbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIHZhbGlkYXRlKHZhbHVlKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMudmFsaWRhdG9yID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgYWxsID0gQXJyYXkuaXNBcnJheSh0aGlzLnZhbGlkYXRvcikgPyB0aGlzLnZhbGlkYXRvciA6IFt0aGlzLnZhbGlkYXRvcl07XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhbGwubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgY3VycmVudCA9IGFsbFtpXTtcclxuICAgICAgbGV0IGRlZmluaXRpb247XHJcblxyXG4gICAgICBpZiAoY3VycmVudCBpbnN0YW5jZW9mIFJlZ0V4cCkge1xyXG4gICAgICAgIGRlZmluaXRpb24gPSB7XHJcbiAgICAgICAgICB0ZXN0OiBjdXJyZW50LFxyXG4gICAgICAgIH07XHJcbiAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGN1cnJlbnQgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBkZWZpbml0aW9uID0ge1xyXG4gICAgICAgICAgZm46IGN1cnJlbnQsXHJcbiAgICAgICAgfTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBkZWZpbml0aW9uID0gY3VycmVudDtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgbmV3VmFsdWUgPSB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnID8gdGhpcy5nZXRWYWx1ZSgpIDogdmFsdWU7XHJcblxyXG4gICAgICBsZXQgcmVzdWx0ID0gZmFsc2U7XHJcbiAgICAgIGlmICh0eXBlb2YgZGVmaW5pdGlvbi5mbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJlc3VsdCA9IGRlZmluaXRpb24uZm4uY2FsbChkZWZpbml0aW9uLnNjb3BlIHx8IHRoaXMsIG5ld1ZhbHVlLCB0aGlzLCB0aGlzLm93bmVyKTtcclxuICAgICAgfSBlbHNlIGlmIChkZWZpbml0aW9uLnRlc3QgaW5zdGFuY2VvZiBSZWdFeHApIHtcclxuICAgICAgICByZXN1bHQgPSAhZGVmaW5pdGlvbi50ZXN0LnRlc3QobmV3VmFsdWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICAgaWYgKGRlZmluaXRpb24ubWVzc2FnZSkge1xyXG4gICAgICAgICAgcmVzdWx0ID0gdHlwZW9mIGRlZmluaXRpb24ubWVzc2FnZSA9PT0gJ2Z1bmN0aW9uJyA/IGRlZmluaXRpb24ubWVzc2FnZS5jYWxsKGRlZmluaXRpb24uc2NvcGUgfHwgdGhpcywgbmV3VmFsdWUsIHRoaXMsIHRoaXMub3duZXIpIDogc3RyaW5nLnN1YnN0aXR1dGUoZGVmaW5pdGlvbi5tZXNzYWdlLCBbbmV3VmFsdWUsIHRoaXMubmFtZSwgdGhpcy5sYWJlbF0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV2ZW50IHRoYXQgZmlyZXMgd2hlbiB0aGUgZmllbGQgaXMgZW5hYmxlZFxyXG4gICAqIEBwYXJhbSB7X0ZpZWxkfSBmaWVsZCBUaGUgZmllbGQgaXRzZWxmXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICovXHJcbiAgb25FbmFibGU6IGZ1bmN0aW9uIG9uRW5hYmxlKC8qIGZpZWxkKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIEV2ZW50IHRoYXQgZmlyZXMgd2hlbiB0aGUgZmllbGQgaXMgZGlzYWJsZWRcclxuICAgKiBAcGFyYW0ge19GaWVsZH0gZmllbGQgVGhlIGZpZWxkIGl0c2VsZlxyXG4gICAqIEB0ZW1wbGF0ZVxyXG4gICAqL1xyXG4gIG9uRGlzYWJsZTogZnVuY3Rpb24gb25EaXNhYmxlKC8qIGZpZWxkKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIEV2ZW50IHRoYXQgZmlyZXMgd2hlbiB0aGUgZmllbGQgaXMgc2hvd25cclxuICAgKiBAcGFyYW0ge19GaWVsZH0gZmllbGQgVGhlIGZpZWxkIGl0c2VsZlxyXG4gICAqIEB0ZW1wbGF0ZVxyXG4gICAqL1xyXG4gIG9uU2hvdzogZnVuY3Rpb24gb25TaG93KC8qIGZpZWxkKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIEV2ZW50IHRoYXQgZmlyZXMgd2hlbiB0aGUgZmllbGQgaXMgaGlkZGVuXHJcbiAgICogQHBhcmFtIHtfRmllbGR9IGZpZWxkIFRoZSBmaWVsZCBpdHNlbGZcclxuICAgKiBAdGVtcGxhdGVcclxuICAgKi9cclxuICBvbkhpZGU6IGZ1bmN0aW9uIG9uSGlkZSgvKiBmaWVsZCovKSB7fSxcclxuICAvKipcclxuICAgKiBFdmVudCB0aGF0IGZpcmVzIHdoZW4gdGhlIGZpZWxkIGlzIGNoYW5nZWRcclxuICAgKiBAcGFyYW0ge19GaWVsZH0gZmllbGQgVGhlIGZpZWxkIGl0c2VsZlxyXG4gICAqIEB0ZW1wbGF0ZVxyXG4gICAqL1xyXG4gIG9uQ2hhbmdlOiBmdW5jdGlvbiBvbkNoYW5nZSgvKiB2YWx1ZSwgZmllbGQqLykge30sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19