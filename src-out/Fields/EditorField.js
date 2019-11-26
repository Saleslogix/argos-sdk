define('argos/Fields/EditorField', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/event', './_Field', '../I18n'], function (module, exports, _declare, _event, _Field2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _event2 = _interopRequireDefault(_event);

  var _Field3 = _interopRequireDefault(_Field2);

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

  var resource = (0, _I18n2.default)('dateField');

  /**
   * @class argos.Fields.EditorField
   * @classdesc The EditorField is not a field per say but a base class for another field type to inherit from. The
   * intent of an EditorField is you have a field where the input should come from another form. EditorField
   * will handle the navigation, gathering values from the other view, going back and applying to the form
   * the field is on.
   *
   * A prime example of an editor field extension would be an AddressField - say you are entering a contacts
   * details and need the address. You could make an AddressField that extends EditorField for handling all
   * the address parts and takes the user to an address_edit with all the street/city/postal etc.
   * @extends argos._Field
   */
  var __class = (0, _declare2.default)('argos.Fields.EditorField', [_Field3.default], /** @lends argos.Fields.EditorField# */{
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
    widgetTemplate: new Simplate(['<label for="{%= $.name %}"\n      {% if ($.required) { %}\n          class="required"\n      {% } %}>\n      {%: $.label %}\n    </label>\n    <div class="field field-control-wrapper">\n      <button\n        class="button simpleSubHeaderButton field-control-trigger"\n        aria-label="{%:  $.lookupLabelText %}">\n        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-{%: $.iconClass %}"></use>\n        </svg>\n      </button>\n      <input data-dojo-attach-point="inputNode" type="text" />\n    </div>']),

    iconClass: 'edit',
    /**
     * required should be true if the field requires input. Defaults to false.
     * @type {Boolean}
     */
    required: false,
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
    formatValue: function formatValue() /* val*/{
      return '';
    },
    /**
     * Extends the parent implementation to connect the `onclick` event of the fields container
     * to {@link #_onClick _onClick}.
     */
    init: function init() {
      this.inherited(init, arguments);

      this.connect(this.containerNode, 'onclick', this._onClick);
    },
    /**
     * Extends the parent implementation to also call {@link #_enableTextElement _enableTextElement}.
     */
    enable: function enable() {
      this.inherited(enable, arguments);

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
      this.inherited(disable, arguments);
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
            svg: 'check',
            fn: this.complete,
            title: resource.confirmText,
            scope: this
          }, {
            id: 'cancel',
            svg: 'cancel',
            side: 'left',
            fn: ReUI.back,
            title: resource.cancelText,
            scope: ReUI
          }]
        },
        entry: this.originalValue || this.validationValue,
        changes: this.currentValue,
        entityName: this.entityName || this.owner && this.owner.entityName,
        negateHistory: true
      };
    },
    /**
     * Navigates to the given `this.view` using the options from {@link #createNavigationOptions createNavigationOptions}.
     */
    navigateToEditView: function navigateToEditView() {
      if (this.isDisabled()) {
        return;
      }

      var view = App.getView(this.view);
      var options = this.createNavigationOptions();

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
      _event2.default.stop(evt);
      this.navigateToEditView();
    },
    /**
     * Gets the values from the editor view and applies it to the this fields `this.currentValue` and
     * `this.validationValue`.
     */
    getValuesFromView: function getValuesFromView() {
      var view = App.getPrimaryActiveView();
      var values = view && view.getValues();

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
      var view = App.getPrimaryActiveView();

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
      return typeof value === 'undefined' ? this.inherited(validate, arguments, [this.validationValue]) : this.inherited(validate, arguments);
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
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvRWRpdG9yRmllbGQuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwiYXR0cmlidXRlTWFwIiwiaW5wdXRWYWx1ZSIsIm5vZGUiLCJ0eXBlIiwiYXR0cmlidXRlIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImljb25DbGFzcyIsInJlcXVpcmVkIiwidmlldyIsIm9yaWdpbmFsVmFsdWUiLCJjdXJyZW50VmFsdWUiLCJ2YWxpZGF0aW9uVmFsdWUiLCJmb3JtYXRWYWx1ZSIsImluaXQiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJjb25uZWN0IiwiY29udGFpbmVyTm9kZSIsIl9vbkNsaWNrIiwiZW5hYmxlIiwiX2VuYWJsZVRleHRFbGVtZW50IiwiaW5wdXROb2RlIiwiZGlzYWJsZWQiLCJkaXNhYmxlIiwiX2Rpc2FibGVUZXh0RWxlbWVudCIsImNyZWF0ZU5hdmlnYXRpb25PcHRpb25zIiwidG9vbHMiLCJ0YmFyIiwiaWQiLCJzdmciLCJmbiIsImNvbXBsZXRlIiwidGl0bGUiLCJjb25maXJtVGV4dCIsInNjb3BlIiwic2lkZSIsIlJlVUkiLCJiYWNrIiwiY2FuY2VsVGV4dCIsImVudHJ5IiwiY2hhbmdlcyIsImVudGl0eU5hbWUiLCJvd25lciIsIm5lZ2F0ZUhpc3RvcnkiLCJuYXZpZ2F0ZVRvRWRpdFZpZXciLCJpc0Rpc2FibGVkIiwiQXBwIiwiZ2V0VmlldyIsIm9wdGlvbnMiLCJzZXQiLCJzaG93IiwiZXZ0Iiwic3RvcCIsImdldFZhbHVlc0Zyb21WaWV3IiwiZ2V0UHJpbWFyeUFjdGl2ZVZpZXciLCJ2YWx1ZXMiLCJnZXRWYWx1ZXMiLCJhcHBseVRvIiwiaW5zZXJ0aW5nIiwiY3JlYXRlSXRlbSIsImFyZ29zIiwiRWRpdCIsImhpZGVWYWxpZGF0aW9uU3VtbWFyeSIsInZhbGlkYXRlIiwic2hvd1ZhbGlkYXRpb25TdW1tYXJ5Iiwic2V0VGV4dCIsImlzVmFsaWQiLCJzZXRUaW1lb3V0IiwiX29uQ29tcGxldGUiLCJiaW5kIiwib25DaGFuZ2UiLCJ0ZXh0IiwiaXNEaXJ0eSIsImdldFZhbHVlIiwidmFsdWUiLCJzZXRWYWx1ZSIsInZhbCIsImluaXRpYWwiLCJlbXB0eVRleHQiLCJjbGVhclZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxNQUFNQSxXQUFXLG9CQUFZLFdBQVosQ0FBakI7O0FBRUE7Ozs7Ozs7Ozs7OztBQVlBLE1BQU1DLFVBQVUsdUJBQVEsMEJBQVIsRUFBb0MsaUJBQXBDLEVBQThDLHVDQUF1QztBQUNuRzs7Ozs7O0FBTUFDLGtCQUFjO0FBQ1pDLGtCQUFZO0FBQ1ZDLGNBQU0sV0FESTtBQUVWQyxjQUFNLFdBRkk7QUFHVkMsbUJBQVc7QUFIRDtBQURBLEtBUHFGOztBQWVuRzs7Ozs7Ozs7QUFRQUMsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSwwbUJBQWIsQ0F2Qm1GOztBQTBDbkdDLGVBQVcsTUExQ3dGO0FBMkNuRzs7OztBQUlBQyxjQUFVLEtBL0N5RjtBQWdEbkc7Ozs7QUFJQUMsVUFBTSxJQXBENkY7QUFxRG5HOzs7O0FBSUFDLG1CQUFlLElBekRvRjtBQTBEbkc7Ozs7QUFJQUMsa0JBQWMsSUE5RHFGO0FBK0RuRzs7Ozs7QUFLQUMscUJBQWlCLElBcEVrRjs7QUFzRW5HOzs7OztBQUtBQyxpQkFBYSxTQUFTQSxXQUFULEdBQXFCLFFBQVU7QUFDMUMsYUFBTyxFQUFQO0FBQ0QsS0E3RWtHO0FBOEVuRzs7OztBQUlBQyxVQUFNLFNBQVNBLElBQVQsR0FBZ0I7QUFDcEIsV0FBS0MsU0FBTCxDQUFlRCxJQUFmLEVBQXFCRSxTQUFyQjs7QUFFQSxXQUFLQyxPQUFMLENBQWEsS0FBS0MsYUFBbEIsRUFBaUMsU0FBakMsRUFBNEMsS0FBS0MsUUFBakQ7QUFDRCxLQXRGa0c7QUF1Rm5HOzs7QUFHQUMsWUFBUSxTQUFTQSxNQUFULEdBQWtCO0FBQ3hCLFdBQUtMLFNBQUwsQ0FBZUssTUFBZixFQUF1QkosU0FBdkI7O0FB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QWVpRCxRQUFmLEVBQXlCaEQsU0FBekIsRUFBb0MsQ0FBQyxLQUFLSixlQUFOLENBQXBDLENBQS9CLEdBQTZGLEtBQUtHLFNBQUwsQ0FBZWlELFFBQWYsRUFBeUJoRCxTQUF6QixDQUFwRztBQUNELEtBN1FrRztBQThRbkc7Ozs7Ozs7OztBQVNBNEQsY0FBVSxTQUFTQSxRQUFULENBQWtCQyxHQUFsQixFQUF1QkMsT0FBdkIsRUFBZ0M7QUFDeEMsVUFBSUQsR0FBSixFQUFTO0FBQ1AsYUFBS2pFLGVBQUwsR0FBdUIsS0FBS0QsWUFBTCxHQUFvQmtFLEdBQTNDOztBQUVBLFlBQUlDLE9BQUosRUFBYTtBQUNYLGVBQUtwRSxhQUFMLEdBQXFCLEtBQUtDLFlBQTFCO0FBQ0Q7O0FBRUQsYUFBS3VELE9BQUwsQ0FBYSxLQUFLckQsV0FBTCxDQUFpQmdFLEdBQWpCLENBQWI7QUFDRCxPQVJELE1BUU87QUFDTCxhQUFLakUsZUFBTCxHQUF1QixLQUFLRCxZQUFMLEdBQW9CLElBQTNDOztBQUVBLFlBQUltRSxPQUFKLEVBQWE7QUFDWCxlQUFLcEUsYUFBTCxHQUFxQixLQUFLQyxZQUExQjtBQUNEOztBQUVELGFBQUt1RCxPQUFMLENBQWEsS0FBS2EsU0FBbEI7QUFDRDtBQUNGLEtBelNrRztBQTBTbkc7OztBQUdBQyxnQkFBWSxTQUFTQSxVQUFULEdBQXNCO0FBQ2hDLFdBQUtKLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLElBQXBCO0FBQ0Q7QUEvU2tHLEdBQXJGLENBQWhCOztvQkFrVGU3RSxPIiwiZmlsZSI6IkVkaXRvckZpZWxkLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgZXZlbnQgZnJvbSAnZG9qby9fYmFzZS9ldmVudCc7XHJcbmltcG9ydCBfRmllbGQgZnJvbSAnLi9fRmllbGQnO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdkYXRlRmllbGQnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRmllbGRzLkVkaXRvckZpZWxkXHJcbiAqIEBjbGFzc2Rlc2MgVGhlIEVkaXRvckZpZWxkIGlzIG5vdCBhIGZpZWxkIHBlciBzYXkgYnV0IGEgYmFzZSBjbGFzcyBmb3IgYW5vdGhlciBmaWVsZCB0eXBlIHRvIGluaGVyaXQgZnJvbS4gVGhlXHJcbiAqIGludGVudCBvZiBhbiBFZGl0b3JGaWVsZCBpcyB5b3UgaGF2ZSBhIGZpZWxkIHdoZXJlIHRoZSBpbnB1dCBzaG91bGQgY29tZSBmcm9tIGFub3RoZXIgZm9ybS4gRWRpdG9yRmllbGRcclxuICogd2lsbCBoYW5kbGUgdGhlIG5hdmlnYXRpb24sIGdhdGhlcmluZyB2YWx1ZXMgZnJvbSB0aGUgb3RoZXIgdmlldywgZ29pbmcgYmFjayBhbmQgYXBwbHlpbmcgdG8gdGhlIGZvcm1cclxuICogdGhlIGZpZWxkIGlzIG9uLlxyXG4gKlxyXG4gKiBBIHByaW1lIGV4YW1wbGUgb2YgYW4gZWRpdG9yIGZpZWxkIGV4dGVuc2lvbiB3b3VsZCBiZSBhbiBBZGRyZXNzRmllbGQgLSBzYXkgeW91IGFyZSBlbnRlcmluZyBhIGNvbnRhY3RzXHJcbiAqIGRldGFpbHMgYW5kIG5lZWQgdGhlIGFkZHJlc3MuIFlvdSBjb3VsZCBtYWtlIGFuIEFkZHJlc3NGaWVsZCB0aGF0IGV4dGVuZHMgRWRpdG9yRmllbGQgZm9yIGhhbmRsaW5nIGFsbFxyXG4gKiB0aGUgYWRkcmVzcyBwYXJ0cyBhbmQgdGFrZXMgdGhlIHVzZXIgdG8gYW4gYWRkcmVzc19lZGl0IHdpdGggYWxsIHRoZSBzdHJlZXQvY2l0eS9wb3N0YWwgZXRjLlxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5fRmllbGRcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5GaWVsZHMuRWRpdG9yRmllbGQnLCBbX0ZpZWxkXSwgLyoqIEBsZW5kcyBhcmdvcy5GaWVsZHMuRWRpdG9yRmllbGQjICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIENyZWF0ZXMgYSBzZXR0ZXIgbWFwIHRvIGh0bWwgbm9kZXMsIG5hbWVseTpcclxuICAgKlxyXG4gICAqICogaW5wdXRWYWx1ZSA9PiBpbnB1dE5vZGUncyB2YWx1ZSBhdHRyaWJ1dGVcclxuICAgKi9cclxuICBhdHRyaWJ1dGVNYXA6IHtcclxuICAgIGlucHV0VmFsdWU6IHtcclxuICAgICAgbm9kZTogJ2lucHV0Tm9kZScsXHJcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxyXG4gICAgICBhdHRyaWJ1dGU6ICd2YWx1ZScsXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBmaWVsZHMgSFRNTCBNYXJrdXBcclxuICAgKlxyXG4gICAqICogYCRgID0+IEZpZWxkIGluc3RhbmNlXHJcbiAgICogKiBgJCRgID0+IE93bmVyIFZpZXcgaW5zdGFuY2VcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgYDxsYWJlbCBmb3I9XCJ7JT0gJC5uYW1lICV9XCJcclxuICAgICAgeyUgaWYgKCQucmVxdWlyZWQpIHsgJX1cclxuICAgICAgICAgIGNsYXNzPVwicmVxdWlyZWRcIlxyXG4gICAgICB7JSB9ICV9PlxyXG4gICAgICB7JTogJC5sYWJlbCAlfVxyXG4gICAgPC9sYWJlbD5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZCBmaWVsZC1jb250cm9sLXdyYXBwZXJcIj5cclxuICAgICAgPGJ1dHRvblxyXG4gICAgICAgIGNsYXNzPVwiYnV0dG9uIHNpbXBsZVN1YkhlYWRlckJ1dHRvbiBmaWVsZC1jb250cm9sLXRyaWdnZXJcIlxyXG4gICAgICAgIGFyaWEtbGFiZWw9XCJ7JTogICQubG9va3VwTGFiZWxUZXh0ICV9XCI+XHJcbiAgICAgICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgIDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeGxpbms6aHJlZj1cIiNpY29uLXslOiAkLmljb25DbGFzcyAlfVwiPjwvdXNlPlxyXG4gICAgICAgIDwvc3ZnPlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgICAgPGlucHV0IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJpbnB1dE5vZGVcIiB0eXBlPVwidGV4dFwiIC8+XHJcbiAgICA8L2Rpdj5gLFxyXG4gIF0pLFxyXG5cclxuICBpY29uQ2xhc3M6ICdlZGl0JyxcclxuICAvKipcclxuICAgKiByZXF1aXJlZCBzaG91bGQgYmUgdHJ1ZSBpZiB0aGUgZmllbGQgcmVxdWlyZXMgaW5wdXQuIERlZmF1bHRzIHRvIGZhbHNlLlxyXG4gICAqIEB0eXBlIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIHJlcXVpcmVkOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogVGhlIHZpZXcgaWQgdGhhdCB0aGUgdXNlciB3aWxsIGJlIHRha2VuIHRvIHdoZW4gdGhlIGVkaXQgYnV0dG9uIGlzIGNsaWNrZWQuXHJcbiAgICovXHJcbiAgdmlldzogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBWYWx1ZSBzdG9yYWdlIGZvciBrZWVwaW5nIHRyYWNrIG9mIG1vZGlmaWVkL3VubW9kaWZpZWQgdmFsdWVzLiBVc2VkIGluIHtAbGluayAjaXNEaXJ0eSBpc0RpcnR5fS5cclxuICAgKi9cclxuICBvcmlnaW5hbFZhbHVlOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0L1N0cmluZy9EYXRlL051bWJlcn1cclxuICAgKiBWYWx1ZSBzdG9yYWdlIGZvciBjdXJyZW50IHZhbHVlLCBhcyBpdCBtdXN0IGJlIGZvcm1hdHRlZCBmb3IgZGlzcGxheSB0aGlzIGlzIHRoZSBmdWxsIHZhbHVlLlxyXG4gICAqL1xyXG4gIGN1cnJlbnRWYWx1ZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdC9TdHJpbmcvRGF0ZS9OdW1iZXJ9XHJcbiAgICogVmFsdWUgc3RvcmFnZSBmb3IgdGhlIHZhbHVlIHRvIHVzZSBpbiB2YWxpZGF0aW9uLCB3aGVuIGdhdGhlcmluZyB2YWx1ZXMgZnJvbSB0aGUgZWRpdG9yIHZpZXdcclxuICAgKiB0aGUgdmFsaWRhdGlvblZhbHVlIGlzIHNldCB1c2luZyBgZ2V0VmFsdWVzKHRydWUpYCB3aGljaCByZXR1cm5zIGFsbCB2YWx1ZXMgZXZlbiBub24tbW9kaWZpZWQgb25lcy5cclxuICAgKi9cclxuICB2YWxpZGF0aW9uVmFsdWU6IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGZvcm1hdHRlZCB2YWx1ZS4gVGhpcyBzaG91bGQgYmUgb3ZlcndyaXR0ZW4gdG8gcHJvdmlkZSBwcm9wZXIgZm9ybWF0dGluZ1xyXG4gICAqIEBwYXJhbSB2YWxcclxuICAgKiBAdGVtcGxhdGVcclxuICAgKi9cclxuICBmb3JtYXRWYWx1ZTogZnVuY3Rpb24gZm9ybWF0VmFsdWUoLyogdmFsKi8pIHtcclxuICAgIHJldHVybiAnJztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHBhcmVudCBpbXBsZW1lbnRhdGlvbiB0byBjb25uZWN0IHRoZSBgb25jbGlja2AgZXZlbnQgb2YgdGhlIGZpZWxkcyBjb250YWluZXJcclxuICAgKiB0byB7QGxpbmsgI19vbkNsaWNrIF9vbkNsaWNrfS5cclxuICAgKi9cclxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoaW5pdCwgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLmNvbm5lY3QodGhpcy5jb250YWluZXJOb2RlLCAnb25jbGljaycsIHRoaXMuX29uQ2xpY2spO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgcGFyZW50IGltcGxlbWVudGF0aW9uIHRvIGFsc28gY2FsbCB7QGxpbmsgI19lbmFibGVUZXh0RWxlbWVudCBfZW5hYmxlVGV4dEVsZW1lbnR9LlxyXG4gICAqL1xyXG4gIGVuYWJsZTogZnVuY3Rpb24gZW5hYmxlKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoZW5hYmxlLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHRoaXMuX2VuYWJsZVRleHRFbGVtZW50KCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBpbnB1dCBub2RlcycgZGlzYWJsZWQgYXR0cmlidXRlIHRvIGZhbHNlXHJcbiAgICovXHJcbiAgX2VuYWJsZVRleHRFbGVtZW50OiBmdW5jdGlvbiBfZW5hYmxlVGV4dEVsZW1lbnQoKSB7XHJcbiAgICB0aGlzLmlucHV0Tm9kZS5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgcGFyZW50IGltcGxlbWVudGF0aW9uIHRvIGFsc28gY2FsbCB7QGxpbmsgI19kaXNhYmxlVGV4dEVsZW1lbnQgX2Rpc2FibGVUZXh0RWxlbWVudH0uXHJcbiAgICovXHJcbiAgZGlzYWJsZTogZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGRpc2FibGUsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLl9kaXNhYmxlVGV4dEVsZW1lbnQoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGlucHV0IG5vZGVzJyBkaXNhYmxlZCBhdHRyaWJ1dGUgdG8gdHJ1ZVxyXG4gICAqL1xyXG4gIF9kaXNhYmxlVGV4dEVsZW1lbnQ6IGZ1bmN0aW9uIF9kaXNhYmxlVGV4dEVsZW1lbnQoKSB7XHJcbiAgICB0aGlzLmlucHV0Tm9kZS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSBuYXZpZ2F0aW9uIG9wdGlvbnMgdG8gYmUgcGFzc2VkIHRvIHRoZSBlZGl0b3Igdmlldy4gVGhlIGltcG9ydGFudCBwYXJ0XHJcbiAgICogb2YgdGhpcyBjb2RlIGlzIHRoYXQgaXQgcGFzc2VzIGB0b29sc2AgdGhhdCBvdmVycmlkZXMgdGhlIGVkaXRvcnMgdmlldyB0b29sYmFyIHdpdGggYW4gaXRlbVxyXG4gICAqIHRoYXQgb3BlcmF0ZXMgd2l0aGluIHRoaXMgZmllbGRzIHNjb3BlLlxyXG4gICAqIEByZXR1cm4gTmF2aWdhdGlvbiBvcHRpb25zXHJcbiAgICovXHJcbiAgY3JlYXRlTmF2aWdhdGlvbk9wdGlvbnM6IGZ1bmN0aW9uIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zKCkge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgdG9vbHM6IHtcclxuICAgICAgICB0YmFyOiBbe1xyXG4gICAgICAgICAgaWQ6ICdjb21wbGV0ZScsXHJcbiAgICAgICAgICBzdmc6ICdjaGVjaycsXHJcbiAgICAgICAgICBmbjogdGhpcy5jb21wbGV0ZSxcclxuICAgICAgICAgIHRpdGxlOiByZXNvdXJjZS5jb25maXJtVGV4dCxcclxuICAgICAgICAgIHNjb3BlOiB0aGlzLFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIGlkOiAnY2FuY2VsJyxcclxuICAgICAgICAgIHN2ZzogJ2NhbmNlbCcsXHJcbiAgICAgICAgICBzaWRlOiAnbGVmdCcsXHJcbiAgICAgICAgICBmbjogUmVVSS5iYWNrLFxyXG4gICAgICAgICAgdGl0bGU6IHJlc291cmNlLmNhbmNlbFRleHQsXHJcbiAgICAgICAgICBzY29wZTogUmVVSSxcclxuICAgICAgICB9XSxcclxuICAgICAgfSxcclxuICAgICAgZW50cnk6IHRoaXMub3JpZ2luYWxWYWx1ZSB8fCB0aGlzLnZhbGlkYXRpb25WYWx1ZSxcclxuICAgICAgY2hhbmdlczogdGhpcy5jdXJyZW50VmFsdWUsXHJcbiAgICAgIGVudGl0eU5hbWU6IHRoaXMuZW50aXR5TmFtZSB8fCAodGhpcy5vd25lciAmJiB0aGlzLm93bmVyLmVudGl0eU5hbWUpLFxyXG4gICAgICBuZWdhdGVIaXN0b3J5OiB0cnVlLFxyXG4gICAgfTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIE5hdmlnYXRlcyB0byB0aGUgZ2l2ZW4gYHRoaXMudmlld2AgdXNpbmcgdGhlIG9wdGlvbnMgZnJvbSB7QGxpbmsgI2NyZWF0ZU5hdmlnYXRpb25PcHRpb25zIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zfS5cclxuICAgKi9cclxuICBuYXZpZ2F0ZVRvRWRpdFZpZXc6IGZ1bmN0aW9uIG5hdmlnYXRlVG9FZGl0VmlldygpIHtcclxuICAgIGlmICh0aGlzLmlzRGlzYWJsZWQoKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRWaWV3KHRoaXMudmlldyk7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucygpO1xyXG5cclxuICAgIGlmICh2aWV3ICYmIG9wdGlvbnMpIHtcclxuICAgICAgaWYgKG9wdGlvbnMudGl0bGUpIHtcclxuICAgICAgICB2aWV3LnNldCgndGl0bGUnLCBvcHRpb25zLnRpdGxlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdmlldy5zaG93KG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdGhlIGBvbmNsaWNrYCBldmVudCBvZiB0aGUgZmllbGRzIGNvbnRhaW5lci5cclxuICAgKlxyXG4gICAqIEludm9rZXMge0BsaW5rICNuYXZpZ2F0ZVRvRWRpdFZpZXcgbmF2aWdhdGVUb0VkaXRWaWV3fS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dFxyXG4gICAqL1xyXG4gIF9vbkNsaWNrOiBmdW5jdGlvbiBfb25DbGljayhldnQpIHtcclxuICAgIGV2ZW50LnN0b3AoZXZ0KTtcclxuICAgIHRoaXMubmF2aWdhdGVUb0VkaXRWaWV3KCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBHZXRzIHRoZSB2YWx1ZXMgZnJvbSB0aGUgZWRpdG9yIHZpZXcgYW5kIGFwcGxpZXMgaXQgdG8gdGhlIHRoaXMgZmllbGRzIGB0aGlzLmN1cnJlbnRWYWx1ZWAgYW5kXHJcbiAgICogYHRoaXMudmFsaWRhdGlvblZhbHVlYC5cclxuICAgKi9cclxuICBnZXRWYWx1ZXNGcm9tVmlldzogZnVuY3Rpb24gZ2V0VmFsdWVzRnJvbVZpZXcoKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gQXBwLmdldFByaW1hcnlBY3RpdmVWaWV3KCk7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSB2aWV3ICYmIHZpZXcuZ2V0VmFsdWVzKCk7XHJcblxyXG4gICAgaWYgKHZpZXcgJiYgdmFsdWVzKSB7XHJcbiAgICAgIGlmICh0aGlzLmFwcGx5VG8pIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHZhbHVlcztcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLm93bmVyLmluc2VydGluZykge1xyXG4gICAgICAgIC8vIElmIHdlIGFyZSBpbnNlcnRpbmcgYSBuZXcgdmFsdWUsIHdlIHdhbnQgYWxsIHRoZSBmaWVsZHMsIG5vdCBqdXN0IGZpZWxkcyB0aGF0IGNoYW5nZWQgKGlmIHRoZSB1c2VyIGVkaXRlZCBtdWx0aXBsZSB0aW1lcylcclxuICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHZpZXcuZ2V0VmFsdWVzKHRydWUpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIEdldHMgYW4gZW50cnkgd2l0aCBmaWVsZHMgdGhhdCBhcmUgZGlydHlcclxuICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHZpZXcuY3JlYXRlSXRlbSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAvLyBzdG9yZSBhbGwgZWRpdG9yIHZhbHVlcyBmb3IgdmFsaWRhdGlvbiwgbm90IG9ubHkgZGlydHkgdmFsdWVzXHJcbiAgICAgIHRoaXMudmFsaWRhdGlvblZhbHVlID0gdmlldy5nZXRWYWx1ZXModHJ1ZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgdG9vbGJhciBpdGVtIHRoYXQgaXMgcGFzc2VkIHRvIHRoZSBlZGl0b3Igdmlldy4gV2hlbiB0aGlzIGZ1bmN0aW9uIGZpcmVzXHJcbiAgICogdGhlIHZpZXcgc2hvd24gaXMgdGhlIGVkaXRvciB2aWV3IGJ1dCB0aGUgZnVuY3Rpb24gaXMgZmlyZWQgaW4gc2NvcGUgb2YgdGhlIGZpZWxkLlxyXG4gICAqXHJcbiAgICogSXQgZ2V0cyBhIGhhbmRsZXIgb2YgdGhlIGN1cnJlbnQgYWN0aXZlIHZpZXcgYW5kIHZhbGlkYXRlcyB0aGUgZm9ybSwgaWYgaXQgcGFzc2VzIGl0IGdhdGhlcnNcclxuICAgKiB0aGUgdmFsdWUsIHNldHMgdGhlIGZpZWxkcyB0ZXh0LCBjYWxscyBgUmVVSS5iYWNrYCBhbmQgZmlyZXMge0BsaW5rICNfb25Db21wbGV0ZSBfb25Db21wbGV0ZX0uXHJcbiAgICpcclxuICAgKi9cclxuICBjb21wbGV0ZTogZnVuY3Rpb24gY29tcGxldGUoKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gQXBwLmdldFByaW1hcnlBY3RpdmVWaWV3KCk7XHJcblxyXG4gICAgaWYgKHZpZXcgaW5zdGFuY2VvZiBhcmdvcy5FZGl0KSB7XHJcbiAgICAgIHZpZXcuaGlkZVZhbGlkYXRpb25TdW1tYXJ5KCk7XHJcblxyXG4gICAgICBpZiAodmlldy52YWxpZGF0ZSgpICE9PSBmYWxzZSkge1xyXG4gICAgICAgIHZpZXcuc2hvd1ZhbGlkYXRpb25TdW1tYXJ5KCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5nZXRWYWx1ZXNGcm9tVmlldygpO1xyXG5cclxuICAgIHRoaXMuc2V0VGV4dCh0aGlzLmZvcm1hdFZhbHVlKHRoaXMudmFsaWRhdGlvblZhbHVlKSk7XHJcblxyXG4gICAgLy8gdG9kbzogcmVtb3ZlXHJcbiAgICBpZiAodmlldy5pc1ZhbGlkICYmICF2aWV3LmlzVmFsaWQoKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgUmVVSS5iYWNrKCk7XHJcbiAgICAvLyBpZiB0aGUgZXZlbnQgaXMgZmlyZWQgYmVmb3JlIHRoZSB0cmFuc2l0aW9uLCBhbnkgWE1MSHR0cFJlcXVlc3QgY3JlYXRlZCBpbiBhbiBldmVudCBoYW5kbGVyIGFuZFxyXG4gICAgLy8gZXhlY3V0aW5nIGR1cmluZyB0aGUgdHJhbnNpdGlvbiBjYW4gcG90ZW50aWFsbHkgZmFpbCAoc3RhdHVzIDApLiAgdGhpcyBtaWdodCBvbmx5IGJlIGFuIGlzc3VlIHdpdGggQ09SU1xyXG4gICAgLy8gcmVxdWVzdHMgY3JlYXRlZCBpbiB0aGlzIHN0YXRlICh0aGUgcHJlLWZsaWdodCByZXF1ZXN0IGlzIG1hZGUsIGFuZCB0aGUgcmVxdWVzdCBlbmRzIHdpdGggc3RhdHVzIDApLlxyXG4gICAgLy8gd3JhcHBpbmcgdGhpbmcgaW4gYSB0aW1lb3V0IGFuZCBwbGFjaW5nIGFmdGVyIHRoZSB0cmFuc2l0aW9uIHN0YXJ0cywgbWl0aWdhdGVzIHRoaXMgaXNzdWUuXHJcbiAgICBzZXRUaW1lb3V0KHRoaXMuX29uQ29tcGxldGUuYmluZCh0aGlzKSwgMCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBgX29uQ29tcGxldGVgIHdoaWNoIGlzIGZpcmVkIGFmdGVyIHRoZSB1c2VyIGhhcyBjb21wbGV0ZWQgdGhlIGZvcm0gaW4gdGhlIGVkaXRvciB2aWV3XHJcbiAgICpcclxuICAgKiBGaXJlcyB7QGxpbmsgI29uQ2hhbmdlIG9uQ2hhbmdlfS5cclxuICAgKlxyXG4gICAqL1xyXG4gIF9vbkNvbXBsZXRlOiBmdW5jdGlvbiBfb25Db21wbGV0ZSgpIHtcclxuICAgIHRoaXMub25DaGFuZ2UodGhpcy5jdXJyZW50VmFsdWUsIHRoaXMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgZGlzcGxheWVkIHRleHQgdG8gdGhlIGlucHV0LlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XHJcbiAgICovXHJcbiAgc2V0VGV4dDogZnVuY3Rpb24gc2V0VGV4dCh0ZXh0KSB7XHJcbiAgICB0aGlzLnNldCgnaW5wdXRWYWx1ZScsIHRleHQpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgdmFsdWUgaGFzIGJlZW4gbW9kaWZpZWQgZnJvbSB0aGUgZGVmYXVsdC9vcmlnaW5hbCBzdGF0ZVxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgaXNEaXJ0eTogZnVuY3Rpb24gaXNEaXJ0eSgpIHtcclxuICAgIHJldHVybiB0aGlzLm9yaWdpbmFsVmFsdWUgIT09IHRoaXMuY3VycmVudFZhbHVlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB2YWx1ZVxyXG4gICAqIEByZXR1cm4ge09iamVjdC9TdHJpbmcvRGF0ZS9OdW1iZXJ9XHJcbiAgICovXHJcbiAgZ2V0VmFsdWU6IGZ1bmN0aW9uIGdldFZhbHVlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFZhbHVlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgcGFyZW50IGltcGxlbWVudGF0aW9uIHRvIHVzZSB0aGUgYHRoaXMudmFsaWRhdGlvblZhbHVlYCBpbnN0ZWFkIG9mIGB0aGlzLmdldFZhbHVlKClgLlxyXG4gICAqIEBwYXJhbSB2YWx1ZVxyXG4gICAqL1xyXG4gIHZhbGlkYXRlOiBmdW5jdGlvbiB2YWxpZGF0ZSh2YWx1ZSkge1xyXG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyB0aGlzLmluaGVyaXRlZCh2YWxpZGF0ZSwgYXJndW1lbnRzLCBbdGhpcy52YWxpZGF0aW9uVmFsdWVdKSA6IHRoaXMuaW5oZXJpdGVkKHZhbGlkYXRlLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgY3VycmVudCB2YWx1ZSB0byB0aGUgaXRlbSBwYXNzZWQsIGFzIHRoZSBkZWZhdWx0IGlmIGluaXRpYWwgaXMgdHJ1ZS4gVGhlbiBpdCBzZXRzXHJcbiAgICogdGhlIGRpc3BsYXllZCB0ZXh0IHVzaW5nIHtAbGluayAjc2V0VGV4dCBzZXRUZXh0fSB3aXRoIHRoZSB7QGxpbmsgI2Zvcm1hdFZhbHVlIGZvcm1hdHRlZH0gdmFsdWUuXHJcbiAgICpcclxuICAgKiBJZiBudWxsL2ZhbHNlIGlzIHBhc3NlZCBhbGwgaXMgY2xlYXJlZCBhbmQgYHRoaXMuZW1wdHlUZXh0YCBpcyBzZXQgYXMgdGhlIGRpc3BsYXllZCB0ZXh0LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3QvU3RyaW5nL0RhdGUvTnVtYmVyfSB2YWwgVmFsdWUgdG8gYmUgc2V0XHJcbiAgICogQHBhcmFtIHtCb29sZWFufSBpbml0aWFsIFRydWUgaWYgdGhlIHZhbHVlIGlzIHRoZSBkZWZhdWx0L2NsZWFuIHZhbHVlLCBmYWxzZSBpZiBpdCBpcyBhIG1lYW50IGFzIGEgZGlydHkgdmFsdWVcclxuICAgKi9cclxuICBzZXRWYWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUodmFsLCBpbml0aWFsKSB7XHJcbiAgICBpZiAodmFsKSB7XHJcbiAgICAgIHRoaXMudmFsaWRhdGlvblZhbHVlID0gdGhpcy5jdXJyZW50VmFsdWUgPSB2YWw7XHJcblxyXG4gICAgICBpZiAoaW5pdGlhbCkge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxWYWx1ZSA9IHRoaXMuY3VycmVudFZhbHVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFRleHQodGhpcy5mb3JtYXRWYWx1ZSh2YWwpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudmFsaWRhdGlvblZhbHVlID0gdGhpcy5jdXJyZW50VmFsdWUgPSBudWxsO1xyXG5cclxuICAgICAgaWYgKGluaXRpYWwpIHtcclxuICAgICAgICB0aGlzLm9yaWdpbmFsVmFsdWUgPSB0aGlzLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5zZXRUZXh0KHRoaXMuZW1wdHlUZXh0KTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENsZWFycyB0aGUgdmFsdWUgYnkgcGFzc2luZyBgbnVsbGAgdG8ge0BsaW5rICNzZXRWYWx1ZSBzZXRWYWx1ZX1cclxuICAgKi9cclxuICBjbGVhclZhbHVlOiBmdW5jdGlvbiBjbGVhclZhbHVlKCkge1xyXG4gICAgdGhpcy5zZXRWYWx1ZShudWxsLCB0cnVlKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==