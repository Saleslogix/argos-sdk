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
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvRWRpdG9yRmllbGQuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwiYXR0cmlidXRlTWFwIiwiaW5wdXRWYWx1ZSIsIm5vZGUiLCJ0eXBlIiwiYXR0cmlidXRlIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImljb25DbGFzcyIsInJlcXVpcmVkIiwidmlldyIsIm9yaWdpbmFsVmFsdWUiLCJjdXJyZW50VmFsdWUiLCJ2YWxpZGF0aW9uVmFsdWUiLCJmb3JtYXRWYWx1ZSIsImluaXQiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJjb25uZWN0IiwiY29udGFpbmVyTm9kZSIsIl9vbkNsaWNrIiwiZW5hYmxlIiwiX2VuYWJsZVRleHRFbGVtZW50IiwiaW5wdXROb2RlIiwiZGlzYWJsZWQiLCJkaXNhYmxlIiwiX2Rpc2FibGVUZXh0RWxlbWVudCIsImNyZWF0ZU5hdmlnYXRpb25PcHRpb25zIiwidG9vbHMiLCJ0YmFyIiwiaWQiLCJzdmciLCJmbiIsImNvbXBsZXRlIiwidGl0bGUiLCJjb25maXJtVGV4dCIsInNjb3BlIiwic2lkZSIsIlJlVUkiLCJiYWNrIiwiY2FuY2VsVGV4dCIsImVudHJ5IiwiY2hhbmdlcyIsImVudGl0eU5hbWUiLCJvd25lciIsIm5lZ2F0ZUhpc3RvcnkiLCJuYXZpZ2F0ZVRvRWRpdFZpZXciLCJpc0Rpc2FibGVkIiwiQXBwIiwiZ2V0VmlldyIsIm9wdGlvbnMiLCJzZXQiLCJzaG93IiwiZXZ0Iiwic3RvcCIsImdldFZhbHVlc0Zyb21WaWV3IiwiZ2V0UHJpbWFyeUFjdGl2ZVZpZXciLCJ2YWx1ZXMiLCJnZXRWYWx1ZXMiLCJhcHBseVRvIiwiaW5zZXJ0aW5nIiwiY3JlYXRlSXRlbSIsImFyZ29zIiwiRWRpdCIsImhpZGVWYWxpZGF0aW9uU3VtbWFyeSIsInZhbGlkYXRlIiwic2hvd1ZhbGlkYXRpb25TdW1tYXJ5Iiwic2V0VGV4dCIsImlzVmFsaWQiLCJzZXRUaW1lb3V0IiwiX29uQ29tcGxldGUiLCJiaW5kIiwib25DaGFuZ2UiLCJ0ZXh0IiwiaXNEaXJ0eSIsImdldFZhbHVlIiwidmFsdWUiLCJzZXRWYWx1ZSIsInZhbCIsImluaXRpYWwiLCJlbXB0eVRleHQiLCJjbGVhclZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxNQUFNQSxXQUFXLG9CQUFZLFdBQVosQ0FBakI7O0FBRUE7Ozs7Ozs7Ozs7OztBQVlBLE1BQU1DLFVBQVUsdUJBQVEsMEJBQVIsRUFBb0MsaUJBQXBDLEVBQThDLHVDQUF1QztBQUNuRzs7Ozs7O0FBTUFDLGtCQUFjO0FBQ1pDLGtCQUFZO0FBQ1ZDLGNBQU0sV0FESTtBQUVWQyxjQUFNLFdBRkk7QUFHVkMsbUJBQVc7QUFIRDtBQURBLEtBUHFGOztBQWVuRzs7Ozs7Ozs7QUFRQUMsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSwwbUJBQWIsQ0F2Qm1GOztBQTBDbkdDLGVBQVcsTUExQ3dGO0FBMkNuRzs7OztBQUlBQyxjQUFVLEtBL0N5RjtBQWdEbkc7Ozs7QUFJQUMsVUFBTSxJQXBENkY7QUFxRG5HOzs7O0FBSUFDLG1CQUFlLElBekRvRjtBQTBEbkc7Ozs7QUFJQUMsa0JBQWMsSUE5RHFGO0FBK0RuRzs7Ozs7QUFLQUMscUJBQWlCLElBcEVrRjs7QUFzRW5HOzs7OztBQUtBQyxpQkFBYSxTQUFTQSxXQUFULEdBQXFCLFFBQVU7QUFDMUMsYUFBTyxFQUFQO0FBQ0QsS0E3RWtHO0FBOEVuRzs7OztBQUlBQyxVQUFNLFNBQVNBLElBQVQsR0FBZ0I7QUFDcEIsV0FBS0MsU0FBTCxDQUFlQyxTQUFmOztBQUVBLFdBQUtDLE9BQUwsQ0FBYSxLQUFLQyxhQUFsQixFQUFpQyxTQUFqQyxFQUE0QyxLQUFLQyxRQUFqRDtBQUNELEtBdEZrRztBQXVGbkc7OztBQUdBQyxZQUFRLFNBQVNBLE1BQVQsR0FBa0I7QUFDeEIsV0FBS0wsU0FBTCxDQUFlQyxTQUFmOztBQUVBLFdBQUtLLGtCQUFMO0FBQ0QsS0E5RmtH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QS9CLEdBQW1GLEtBQUtHLFNBQUwsQ0FBZUMsU0FBZixDQUExRjtBQUNELEtBN1FrRztBQThRbkc7Ozs7Ozs7OztBQVNBNEQsY0FBVSxTQUFTQSxRQUFULENBQWtCQyxHQUFsQixFQUF1QkMsT0FBdkIsRUFBZ0M7QUFDeEMsVUFBSUQsR0FBSixFQUFTO0FBQ1AsYUFBS2pFLGVBQUwsR0FBdUIsS0FBS0QsWUFBTCxHQUFvQmtFLEdBQTNDOztBQUVBLFlBQUlDLE9BQUosRUFBYTtBQUNYLGVBQUtwRSxhQUFMLEdBQXFCLEtBQUtDLFlBQTFCO0FBQ0Q7O0FBRUQsYUFBS3VELE9BQUwsQ0FBYSxLQUFLckQsV0FBTCxDQUFpQmdFLEdBQWpCLENBQWI7QUFDRCxPQVJELE1BUU87QUFDTCxhQUFLakUsZUFBTCxHQUF1QixLQUFLRCxZQUFMLEdBQW9CLElBQTNDOztBQUVBLFlBQUltRSxPQUFKLEVBQWE7QUFDWCxlQUFLcEUsYUFBTCxHQUFxQixLQUFLQyxZQUExQjtBQUNEOztBQUVELGFBQUt1RCxPQUFMLENBQWEsS0FBS2EsU0FBbEI7QUFDRDtBQUNGLEtBelNrRztBQTBTbkc7OztBQUdBQyxnQkFBWSxTQUFTQSxVQUFULEdBQXNCO0FBQ2hDLFdBQUtKLFFBQUwsQ0FBYyxJQUFkLEVBQW9CLElBQXBCO0FBQ0Q7QUEvU2tHLEdBQXJGLENBQWhCOztvQkFrVGU3RSxPIiwiZmlsZSI6IkVkaXRvckZpZWxkLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgZXZlbnQgZnJvbSAnZG9qby9fYmFzZS9ldmVudCc7XHJcbmltcG9ydCBfRmllbGQgZnJvbSAnLi9fRmllbGQnO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdkYXRlRmllbGQnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRmllbGRzLkVkaXRvckZpZWxkXHJcbiAqIEBjbGFzc2Rlc2MgVGhlIEVkaXRvckZpZWxkIGlzIG5vdCBhIGZpZWxkIHBlciBzYXkgYnV0IGEgYmFzZSBjbGFzcyBmb3IgYW5vdGhlciBmaWVsZCB0eXBlIHRvIGluaGVyaXQgZnJvbS4gVGhlXHJcbiAqIGludGVudCBvZiBhbiBFZGl0b3JGaWVsZCBpcyB5b3UgaGF2ZSBhIGZpZWxkIHdoZXJlIHRoZSBpbnB1dCBzaG91bGQgY29tZSBmcm9tIGFub3RoZXIgZm9ybS4gRWRpdG9yRmllbGRcclxuICogd2lsbCBoYW5kbGUgdGhlIG5hdmlnYXRpb24sIGdhdGhlcmluZyB2YWx1ZXMgZnJvbSB0aGUgb3RoZXIgdmlldywgZ29pbmcgYmFjayBhbmQgYXBwbHlpbmcgdG8gdGhlIGZvcm1cclxuICogdGhlIGZpZWxkIGlzIG9uLlxyXG4gKlxyXG4gKiBBIHByaW1lIGV4YW1wbGUgb2YgYW4gZWRpdG9yIGZpZWxkIGV4dGVuc2lvbiB3b3VsZCBiZSBhbiBBZGRyZXNzRmllbGQgLSBzYXkgeW91IGFyZSBlbnRlcmluZyBhIGNvbnRhY3RzXHJcbiAqIGRldGFpbHMgYW5kIG5lZWQgdGhlIGFkZHJlc3MuIFlvdSBjb3VsZCBtYWtlIGFuIEFkZHJlc3NGaWVsZCB0aGF0IGV4dGVuZHMgRWRpdG9yRmllbGQgZm9yIGhhbmRsaW5nIGFsbFxyXG4gKiB0aGUgYWRkcmVzcyBwYXJ0cyBhbmQgdGFrZXMgdGhlIHVzZXIgdG8gYW4gYWRkcmVzc19lZGl0IHdpdGggYWxsIHRoZSBzdHJlZXQvY2l0eS9wb3N0YWwgZXRjLlxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5fRmllbGRcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5GaWVsZHMuRWRpdG9yRmllbGQnLCBbX0ZpZWxkXSwgLyoqIEBsZW5kcyBhcmdvcy5GaWVsZHMuRWRpdG9yRmllbGQjICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIENyZWF0ZXMgYSBzZXR0ZXIgbWFwIHRvIGh0bWwgbm9kZXMsIG5hbWVseTpcclxuICAgKlxyXG4gICAqICogaW5wdXRWYWx1ZSA9PiBpbnB1dE5vZGUncyB2YWx1ZSBhdHRyaWJ1dGVcclxuICAgKi9cclxuICBhdHRyaWJ1dGVNYXA6IHtcclxuICAgIGlucHV0VmFsdWU6IHtcclxuICAgICAgbm9kZTogJ2lucHV0Tm9kZScsXHJcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxyXG4gICAgICBhdHRyaWJ1dGU6ICd2YWx1ZScsXHJcbiAgICB9LFxyXG4gIH0sXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBmaWVsZHMgSFRNTCBNYXJrdXBcclxuICAgKlxyXG4gICAqICogYCRgID0+IEZpZWxkIGluc3RhbmNlXHJcbiAgICogKiBgJCRgID0+IE93bmVyIFZpZXcgaW5zdGFuY2VcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgYDxsYWJlbCBmb3I9XCJ7JT0gJC5uYW1lICV9XCJcclxuICAgICAgeyUgaWYgKCQucmVxdWlyZWQpIHsgJX1cclxuICAgICAgICAgIGNsYXNzPVwicmVxdWlyZWRcIlxyXG4gICAgICB7JSB9ICV9PlxyXG4gICAgICB7JTogJC5sYWJlbCAlfVxyXG4gICAgPC9sYWJlbD5cclxuICAgIDxkaXYgY2xhc3M9XCJmaWVsZCBmaWVsZC1jb250cm9sLXdyYXBwZXJcIj5cclxuICAgICAgPGJ1dHRvblxyXG4gICAgICAgIGNsYXNzPVwiYnV0dG9uIHNpbXBsZVN1YkhlYWRlckJ1dHRvbiBmaWVsZC1jb250cm9sLXRyaWdnZXJcIlxyXG4gICAgICAgIGFyaWEtbGFiZWw9XCJ7JTogICQubG9va3VwTGFiZWxUZXh0ICV9XCI+XHJcbiAgICAgICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgIDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeGxpbms6aHJlZj1cIiNpY29uLXslOiAkLmljb25DbGFzcyAlfVwiPjwvdXNlPlxyXG4gICAgICAgIDwvc3ZnPlxyXG4gICAgICA8L2J1dHRvbj5cclxuICAgICAgPGlucHV0IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJpbnB1dE5vZGVcIiB0eXBlPVwidGV4dFwiIC8+XHJcbiAgICA8L2Rpdj5gLFxyXG4gIF0pLFxyXG5cclxuICBpY29uQ2xhc3M6ICdlZGl0JyxcclxuICAvKipcclxuICAgKiByZXF1aXJlZCBzaG91bGQgYmUgdHJ1ZSBpZiB0aGUgZmllbGQgcmVxdWlyZXMgaW5wdXQuIERlZmF1bHRzIHRvIGZhbHNlLlxyXG4gICAqIEB0eXBlIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIHJlcXVpcmVkOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogVGhlIHZpZXcgaWQgdGhhdCB0aGUgdXNlciB3aWxsIGJlIHRha2VuIHRvIHdoZW4gdGhlIGVkaXQgYnV0dG9uIGlzIGNsaWNrZWQuXHJcbiAgICovXHJcbiAgdmlldzogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBWYWx1ZSBzdG9yYWdlIGZvciBrZWVwaW5nIHRyYWNrIG9mIG1vZGlmaWVkL3VubW9kaWZpZWQgdmFsdWVzLiBVc2VkIGluIHtAbGluayAjaXNEaXJ0eSBpc0RpcnR5fS5cclxuICAgKi9cclxuICBvcmlnaW5hbFZhbHVlOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0L1N0cmluZy9EYXRlL051bWJlcn1cclxuICAgKiBWYWx1ZSBzdG9yYWdlIGZvciBjdXJyZW50IHZhbHVlLCBhcyBpdCBtdXN0IGJlIGZvcm1hdHRlZCBmb3IgZGlzcGxheSB0aGlzIGlzIHRoZSBmdWxsIHZhbHVlLlxyXG4gICAqL1xyXG4gIGN1cnJlbnRWYWx1ZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdC9TdHJpbmcvRGF0ZS9OdW1iZXJ9XHJcbiAgICogVmFsdWUgc3RvcmFnZSBmb3IgdGhlIHZhbHVlIHRvIHVzZSBpbiB2YWxpZGF0aW9uLCB3aGVuIGdhdGhlcmluZyB2YWx1ZXMgZnJvbSB0aGUgZWRpdG9yIHZpZXdcclxuICAgKiB0aGUgdmFsaWRhdGlvblZhbHVlIGlzIHNldCB1c2luZyBgZ2V0VmFsdWVzKHRydWUpYCB3aGljaCByZXR1cm5zIGFsbCB2YWx1ZXMgZXZlbiBub24tbW9kaWZpZWQgb25lcy5cclxuICAgKi9cclxuICB2YWxpZGF0aW9uVmFsdWU6IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGZvcm1hdHRlZCB2YWx1ZS4gVGhpcyBzaG91bGQgYmUgb3ZlcndyaXR0ZW4gdG8gcHJvdmlkZSBwcm9wZXIgZm9ybWF0dGluZ1xyXG4gICAqIEBwYXJhbSB2YWxcclxuICAgKiBAdGVtcGxhdGVcclxuICAgKi9cclxuICBmb3JtYXRWYWx1ZTogZnVuY3Rpb24gZm9ybWF0VmFsdWUoLyogdmFsKi8pIHtcclxuICAgIHJldHVybiAnJztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHBhcmVudCBpbXBsZW1lbnRhdGlvbiB0byBjb25uZWN0IHRoZSBgb25jbGlja2AgZXZlbnQgb2YgdGhlIGZpZWxkcyBjb250YWluZXJcclxuICAgKiB0byB7QGxpbmsgI19vbkNsaWNrIF9vbkNsaWNrfS5cclxuICAgKi9cclxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLmNvbm5lY3QodGhpcy5jb250YWluZXJOb2RlLCAnb25jbGljaycsIHRoaXMuX29uQ2xpY2spO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgcGFyZW50IGltcGxlbWVudGF0aW9uIHRvIGFsc28gY2FsbCB7QGxpbmsgI19lbmFibGVUZXh0RWxlbWVudCBfZW5hYmxlVGV4dEVsZW1lbnR9LlxyXG4gICAqL1xyXG4gIGVuYWJsZTogZnVuY3Rpb24gZW5hYmxlKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLl9lbmFibGVUZXh0RWxlbWVudCgpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgaW5wdXQgbm9kZXMnIGRpc2FibGVkIGF0dHJpYnV0ZSB0byBmYWxzZVxyXG4gICAqL1xyXG4gIF9lbmFibGVUZXh0RWxlbWVudDogZnVuY3Rpb24gX2VuYWJsZVRleHRFbGVtZW50KCkge1xyXG4gICAgdGhpcy5pbnB1dE5vZGUuZGlzYWJsZWQgPSBmYWxzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHBhcmVudCBpbXBsZW1lbnRhdGlvbiB0byBhbHNvIGNhbGwge0BsaW5rICNfZGlzYWJsZVRleHRFbGVtZW50IF9kaXNhYmxlVGV4dEVsZW1lbnR9LlxyXG4gICAqL1xyXG4gIGRpc2FibGU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gICAgdGhpcy5fZGlzYWJsZVRleHRFbGVtZW50KCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBpbnB1dCBub2RlcycgZGlzYWJsZWQgYXR0cmlidXRlIHRvIHRydWVcclxuICAgKi9cclxuICBfZGlzYWJsZVRleHRFbGVtZW50OiBmdW5jdGlvbiBfZGlzYWJsZVRleHRFbGVtZW50KCkge1xyXG4gICAgdGhpcy5pbnB1dE5vZGUuZGlzYWJsZWQgPSB0cnVlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgbmF2aWdhdGlvbiBvcHRpb25zIHRvIGJlIHBhc3NlZCB0byB0aGUgZWRpdG9yIHZpZXcuIFRoZSBpbXBvcnRhbnQgcGFydFxyXG4gICAqIG9mIHRoaXMgY29kZSBpcyB0aGF0IGl0IHBhc3NlcyBgdG9vbHNgIHRoYXQgb3ZlcnJpZGVzIHRoZSBlZGl0b3JzIHZpZXcgdG9vbGJhciB3aXRoIGFuIGl0ZW1cclxuICAgKiB0aGF0IG9wZXJhdGVzIHdpdGhpbiB0aGlzIGZpZWxkcyBzY29wZS5cclxuICAgKiBAcmV0dXJuIE5hdmlnYXRpb24gb3B0aW9uc1xyXG4gICAqL1xyXG4gIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zOiBmdW5jdGlvbiBjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucygpIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIHRvb2xzOiB7XHJcbiAgICAgICAgdGJhcjogW3tcclxuICAgICAgICAgIGlkOiAnY29tcGxldGUnLFxyXG4gICAgICAgICAgc3ZnOiAnY2hlY2snLFxyXG4gICAgICAgICAgZm46IHRoaXMuY29tcGxldGUsXHJcbiAgICAgICAgICB0aXRsZTogcmVzb3VyY2UuY29uZmlybVRleHQsXHJcbiAgICAgICAgICBzY29wZTogdGhpcyxcclxuICAgICAgICB9LCB7XHJcbiAgICAgICAgICBpZDogJ2NhbmNlbCcsXHJcbiAgICAgICAgICBzdmc6ICdjYW5jZWwnLFxyXG4gICAgICAgICAgc2lkZTogJ2xlZnQnLFxyXG4gICAgICAgICAgZm46IFJlVUkuYmFjayxcclxuICAgICAgICAgIHRpdGxlOiByZXNvdXJjZS5jYW5jZWxUZXh0LFxyXG4gICAgICAgICAgc2NvcGU6IFJlVUksXHJcbiAgICAgICAgfV0sXHJcbiAgICAgIH0sXHJcbiAgICAgIGVudHJ5OiB0aGlzLm9yaWdpbmFsVmFsdWUgfHwgdGhpcy52YWxpZGF0aW9uVmFsdWUsXHJcbiAgICAgIGNoYW5nZXM6IHRoaXMuY3VycmVudFZhbHVlLFxyXG4gICAgICBlbnRpdHlOYW1lOiB0aGlzLmVudGl0eU5hbWUgfHwgKHRoaXMub3duZXIgJiYgdGhpcy5vd25lci5lbnRpdHlOYW1lKSxcclxuICAgICAgbmVnYXRlSGlzdG9yeTogdHJ1ZSxcclxuICAgIH07XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBOYXZpZ2F0ZXMgdG8gdGhlIGdpdmVuIGB0aGlzLnZpZXdgIHVzaW5nIHRoZSBvcHRpb25zIGZyb20ge0BsaW5rICNjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucyBjcmVhdGVOYXZpZ2F0aW9uT3B0aW9uc30uXHJcbiAgICovXHJcbiAgbmF2aWdhdGVUb0VkaXRWaWV3OiBmdW5jdGlvbiBuYXZpZ2F0ZVRvRWRpdFZpZXcoKSB7XHJcbiAgICBpZiAodGhpcy5pc0Rpc2FibGVkKCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHZpZXcgPSBBcHAuZ2V0Vmlldyh0aGlzLnZpZXcpO1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuY3JlYXRlTmF2aWdhdGlvbk9wdGlvbnMoKTtcclxuXHJcbiAgICBpZiAodmlldyAmJiBvcHRpb25zKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLnRpdGxlKSB7XHJcbiAgICAgICAgdmlldy5zZXQoJ3RpdGxlJywgb3B0aW9ucy50aXRsZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHZpZXcuc2hvdyhvcHRpb25zKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHRoZSBgb25jbGlja2AgZXZlbnQgb2YgdGhlIGZpZWxkcyBjb250YWluZXIuXHJcbiAgICpcclxuICAgKiBJbnZva2VzIHtAbGluayAjbmF2aWdhdGVUb0VkaXRWaWV3IG5hdmlnYXRlVG9FZGl0Vmlld30uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnRcclxuICAgKi9cclxuICBfb25DbGljazogZnVuY3Rpb24gX29uQ2xpY2soZXZ0KSB7XHJcbiAgICBldmVudC5zdG9wKGV2dCk7XHJcbiAgICB0aGlzLm5hdmlnYXRlVG9FZGl0VmlldygpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgdmFsdWVzIGZyb20gdGhlIGVkaXRvciB2aWV3IGFuZCBhcHBsaWVzIGl0IHRvIHRoZSB0aGlzIGZpZWxkcyBgdGhpcy5jdXJyZW50VmFsdWVgIGFuZFxyXG4gICAqIGB0aGlzLnZhbGlkYXRpb25WYWx1ZWAuXHJcbiAgICovXHJcbiAgZ2V0VmFsdWVzRnJvbVZpZXc6IGZ1bmN0aW9uIGdldFZhbHVlc0Zyb21WaWV3KCkge1xyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRQcmltYXJ5QWN0aXZlVmlldygpO1xyXG4gICAgY29uc3QgdmFsdWVzID0gdmlldyAmJiB2aWV3LmdldFZhbHVlcygpO1xyXG5cclxuICAgIGlmICh2aWV3ICYmIHZhbHVlcykge1xyXG4gICAgICBpZiAodGhpcy5hcHBseVRvKSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB2YWx1ZXM7XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy5vd25lci5pbnNlcnRpbmcpIHtcclxuICAgICAgICAvLyBJZiB3ZSBhcmUgaW5zZXJ0aW5nIGEgbmV3IHZhbHVlLCB3ZSB3YW50IGFsbCB0aGUgZmllbGRzLCBub3QganVzdCBmaWVsZHMgdGhhdCBjaGFuZ2VkIChpZiB0aGUgdXNlciBlZGl0ZWQgbXVsdGlwbGUgdGltZXMpXHJcbiAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB2aWV3LmdldFZhbHVlcyh0cnVlKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBHZXRzIGFuIGVudHJ5IHdpdGggZmllbGRzIHRoYXQgYXJlIGRpcnR5XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB2aWV3LmNyZWF0ZUl0ZW0oKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgLy8gc3RvcmUgYWxsIGVkaXRvciB2YWx1ZXMgZm9yIHZhbGlkYXRpb24sIG5vdCBvbmx5IGRpcnR5IHZhbHVlc1xyXG4gICAgICB0aGlzLnZhbGlkYXRpb25WYWx1ZSA9IHZpZXcuZ2V0VmFsdWVzKHRydWUpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdGhlIHRvb2xiYXIgaXRlbSB0aGF0IGlzIHBhc3NlZCB0byB0aGUgZWRpdG9yIHZpZXcuIFdoZW4gdGhpcyBmdW5jdGlvbiBmaXJlc1xyXG4gICAqIHRoZSB2aWV3IHNob3duIGlzIHRoZSBlZGl0b3IgdmlldyBidXQgdGhlIGZ1bmN0aW9uIGlzIGZpcmVkIGluIHNjb3BlIG9mIHRoZSBmaWVsZC5cclxuICAgKlxyXG4gICAqIEl0IGdldHMgYSBoYW5kbGVyIG9mIHRoZSBjdXJyZW50IGFjdGl2ZSB2aWV3IGFuZCB2YWxpZGF0ZXMgdGhlIGZvcm0sIGlmIGl0IHBhc3NlcyBpdCBnYXRoZXJzXHJcbiAgICogdGhlIHZhbHVlLCBzZXRzIHRoZSBmaWVsZHMgdGV4dCwgY2FsbHMgYFJlVUkuYmFja2AgYW5kIGZpcmVzIHtAbGluayAjX29uQ29tcGxldGUgX29uQ29tcGxldGV9LlxyXG4gICAqXHJcbiAgICovXHJcbiAgY29tcGxldGU6IGZ1bmN0aW9uIGNvbXBsZXRlKCkge1xyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRQcmltYXJ5QWN0aXZlVmlldygpO1xyXG5cclxuICAgIGlmICh2aWV3IGluc3RhbmNlb2YgYXJnb3MuRWRpdCkge1xyXG4gICAgICB2aWV3LmhpZGVWYWxpZGF0aW9uU3VtbWFyeSgpO1xyXG5cclxuICAgICAgaWYgKHZpZXcudmFsaWRhdGUoKSAhPT0gZmFsc2UpIHtcclxuICAgICAgICB2aWV3LnNob3dWYWxpZGF0aW9uU3VtbWFyeSgpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuZ2V0VmFsdWVzRnJvbVZpZXcoKTtcclxuXHJcbiAgICB0aGlzLnNldFRleHQodGhpcy5mb3JtYXRWYWx1ZSh0aGlzLnZhbGlkYXRpb25WYWx1ZSkpO1xyXG5cclxuICAgIC8vIHRvZG86IHJlbW92ZVxyXG4gICAgaWYgKHZpZXcuaXNWYWxpZCAmJiAhdmlldy5pc1ZhbGlkKCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIFJlVUkuYmFjaygpO1xyXG4gICAgLy8gaWYgdGhlIGV2ZW50IGlzIGZpcmVkIGJlZm9yZSB0aGUgdHJhbnNpdGlvbiwgYW55IFhNTEh0dHBSZXF1ZXN0IGNyZWF0ZWQgaW4gYW4gZXZlbnQgaGFuZGxlciBhbmRcclxuICAgIC8vIGV4ZWN1dGluZyBkdXJpbmcgdGhlIHRyYW5zaXRpb24gY2FuIHBvdGVudGlhbGx5IGZhaWwgKHN0YXR1cyAwKS4gIHRoaXMgbWlnaHQgb25seSBiZSBhbiBpc3N1ZSB3aXRoIENPUlNcclxuICAgIC8vIHJlcXVlc3RzIGNyZWF0ZWQgaW4gdGhpcyBzdGF0ZSAodGhlIHByZS1mbGlnaHQgcmVxdWVzdCBpcyBtYWRlLCBhbmQgdGhlIHJlcXVlc3QgZW5kcyB3aXRoIHN0YXR1cyAwKS5cclxuICAgIC8vIHdyYXBwaW5nIHRoaW5nIGluIGEgdGltZW91dCBhbmQgcGxhY2luZyBhZnRlciB0aGUgdHJhbnNpdGlvbiBzdGFydHMsIG1pdGlnYXRlcyB0aGlzIGlzc3VlLlxyXG4gICAgc2V0VGltZW91dCh0aGlzLl9vbkNvbXBsZXRlLmJpbmQodGhpcyksIDApO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgYF9vbkNvbXBsZXRlYCB3aGljaCBpcyBmaXJlZCBhZnRlciB0aGUgdXNlciBoYXMgY29tcGxldGVkIHRoZSBmb3JtIGluIHRoZSBlZGl0b3Igdmlld1xyXG4gICAqXHJcbiAgICogRmlyZXMge0BsaW5rICNvbkNoYW5nZSBvbkNoYW5nZX0uXHJcbiAgICpcclxuICAgKi9cclxuICBfb25Db21wbGV0ZTogZnVuY3Rpb24gX29uQ29tcGxldGUoKSB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuY3VycmVudFZhbHVlLCB0aGlzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGRpc3BsYXllZCB0ZXh0IHRvIHRoZSBpbnB1dC5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdGV4dFxyXG4gICAqL1xyXG4gIHNldFRleHQ6IGZ1bmN0aW9uIHNldFRleHQodGV4dCkge1xyXG4gICAgdGhpcy5zZXQoJ2lucHV0VmFsdWUnLCB0ZXh0KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgdGhlIHZhbHVlIGhhcyBiZWVuIG1vZGlmaWVkIGZyb20gdGhlIGRlZmF1bHQvb3JpZ2luYWwgc3RhdGVcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGlzRGlydHk6IGZ1bmN0aW9uIGlzRGlydHkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5vcmlnaW5hbFZhbHVlICE9PSB0aGlzLmN1cnJlbnRWYWx1ZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdmFsdWVcclxuICAgKiBAcmV0dXJuIHtPYmplY3QvU3RyaW5nL0RhdGUvTnVtYmVyfVxyXG4gICAqL1xyXG4gIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmN1cnJlbnRWYWx1ZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHBhcmVudCBpbXBsZW1lbnRhdGlvbiB0byB1c2UgdGhlIGB0aGlzLnZhbGlkYXRpb25WYWx1ZWAgaW5zdGVhZCBvZiBgdGhpcy5nZXRWYWx1ZSgpYC5cclxuICAgKiBAcGFyYW0gdmFsdWVcclxuICAgKi9cclxuICB2YWxpZGF0ZTogZnVuY3Rpb24gdmFsaWRhdGUodmFsdWUpIHtcclxuICAgIHJldHVybiB0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnID8gdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzLCBbdGhpcy52YWxpZGF0aW9uVmFsdWVdKSA6IHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBjdXJyZW50IHZhbHVlIHRvIHRoZSBpdGVtIHBhc3NlZCwgYXMgdGhlIGRlZmF1bHQgaWYgaW5pdGlhbCBpcyB0cnVlLiBUaGVuIGl0IHNldHNcclxuICAgKiB0aGUgZGlzcGxheWVkIHRleHQgdXNpbmcge0BsaW5rICNzZXRUZXh0IHNldFRleHR9IHdpdGggdGhlIHtAbGluayAjZm9ybWF0VmFsdWUgZm9ybWF0dGVkfSB2YWx1ZS5cclxuICAgKlxyXG4gICAqIElmIG51bGwvZmFsc2UgaXMgcGFzc2VkIGFsbCBpcyBjbGVhcmVkIGFuZCBgdGhpcy5lbXB0eVRleHRgIGlzIHNldCBhcyB0aGUgZGlzcGxheWVkIHRleHQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdC9TdHJpbmcvRGF0ZS9OdW1iZXJ9IHZhbCBWYWx1ZSB0byBiZSBzZXRcclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGluaXRpYWwgVHJ1ZSBpZiB0aGUgdmFsdWUgaXMgdGhlIGRlZmF1bHQvY2xlYW4gdmFsdWUsIGZhbHNlIGlmIGl0IGlzIGEgbWVhbnQgYXMgYSBkaXJ0eSB2YWx1ZVxyXG4gICAqL1xyXG4gIHNldFZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2YWwsIGluaXRpYWwpIHtcclxuICAgIGlmICh2YWwpIHtcclxuICAgICAgdGhpcy52YWxpZGF0aW9uVmFsdWUgPSB0aGlzLmN1cnJlbnRWYWx1ZSA9IHZhbDtcclxuXHJcbiAgICAgIGlmIChpbml0aWFsKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy5jdXJyZW50VmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0VGV4dCh0aGlzLmZvcm1hdFZhbHVlKHZhbCkpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy52YWxpZGF0aW9uVmFsdWUgPSB0aGlzLmN1cnJlbnRWYWx1ZSA9IG51bGw7XHJcblxyXG4gICAgICBpZiAoaW5pdGlhbCkge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxWYWx1ZSA9IHRoaXMuY3VycmVudFZhbHVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFRleHQodGhpcy5lbXB0eVRleHQpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2xlYXJzIHRoZSB2YWx1ZSBieSBwYXNzaW5nIGBudWxsYCB0byB7QGxpbmsgI3NldFZhbHVlIHNldFZhbHVlfVxyXG4gICAqL1xyXG4gIGNsZWFyVmFsdWU6IGZ1bmN0aW9uIGNsZWFyVmFsdWUoKSB7XHJcbiAgICB0aGlzLnNldFZhbHVlKG51bGwsIHRydWUpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19