define('argos/Fields/LookupField', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', '../Utility', './_Field', '../FieldManager', '../I18n'], function (module, exports, _declare, _lang, _string, _Utility, _Field2, _FieldManager, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _string2 = _interopRequireDefault(_string);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _Field3 = _interopRequireDefault(_Field2);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('lookupField'); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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

  var modalResource = (0, _I18n2.default)('modal');

  /**
   * @class argos.Fields.LookupField
   * @classdesc The LookupField is similiar to an Edit View in that it is a field that takes the user to another
   * view but the difference is that an EditorField takes the user to an Edit View, whereas LookupField
   * takes the user to a List View.
   *
   * Meaning that LookupField is meant for establishing relationships by only storing the key for a value
   * and with displayed text.
   *
   * @example
   *     {
   *         name: 'Owner',
   *         property: 'Owner',
   *         label: this.ownerText,
   *         type: 'lookup',
   *         view: 'user_list'
   *     }
   * @extends argos.Fields._Field
   * @requires argos.FieldManager
   * @requires argos.Utility
   */
  var control = (0, _declare2.default)('argos.Fields.LookupField', [_Field3.default], /** @lends argos.Fields.LookupField# */{
    /**
     * @property {Object}
     * Creates a setter map to html nodes, namely:
     *
     * * inputValue => inputNodes's value
     * * inputDisabled => inputNodes's disabled
     * * inputReadOnly => inputNodes readonly
     *
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
      inputReadOnly: {
        node: 'inputNode',
        type: 'attribute',
        attribute: 'readonly'
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
    widgetTemplate: new Simplate(['{% if ($.label) { %}\n    <label for="{%= $.name %}"\n      {% if ($.required) { %}\n        class="required"\n      {% } %}>\n        {%: $.label %}\n    </label>\n    {% } %}\n    <div class="field field-control-wrapper">\n      <button class="field-control-trigger"\n        aria-label="{%: $.lookupLabelText %}"\n        data-action="buttonClick"\n        title="{%: $.lookupText %}">\n        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-{%: $.iconClass %}"></use>\n        </svg>\n      </button>\n      <input data-dojo-attach-point="inputNode"\n        type="text"\n        {% if ($.requireSelection) { %}\n        readonly="readonly"{% } %}\n        {% if ($.required) { %}\n            data-validate="required"\n            class="required"\n          {% } %}\n        />\n    </div>']),
    iconClass: 'search',

    // Localization
    /**
     * @property {String}
     * Error text shown when validation fails.
     *
     * * `${0}` is the label text of the field
     */
    dependentErrorText: resource.dependentErrorText,
    /**
     * @cfg {String}
     * Text displayed when the field is cleared or set to null
     */
    emptyText: resource.emptyText,
    /**
     * @property {String}
     * The tooltip text for saving the selection
     */
    completeText: modalResource.completeText,
    /**
     * @property {String}
     * The ARIA label text in the lookup button
     */
    lookupLabelText: resource.lookupLabelText,
    /**
     * @property {String}
     * The text placed inside the lookup button
     */
    lookupText: resource.lookupText,
    /**
     * @property {String}
     * The tooltip text for cancelling the selection
     */
    cancelText: modalResource.cancelText,

    /**
     * @cfg {String}
     * Required. Must be set to a view id of the target lookup view
     */
    view: false,

    /**
     * @cfg {Object}
     * Optional. Object to mixin over the view
     */
    viewMixin: null,
    /**
     * @property {String}
     * The default `valueKeyProperty` if `valueKeyProperty` is not defined.
     */
    keyProperty: '$key',
    /**
     * required should be true if the field requires input. Defaults to false.
     * @type {Boolean}
     */
    required: false,
    /**
     * @property {String}
     * The default `valueTextProperty` if `valueTextProperty` is not defined.
     */
    textProperty: '$descriptor',
    /**
     * @cfg {Simplate}
     * If provided the displayed textProperty is transformed with the given Simplate.
     *
     * * `$` => value extracted
     * * `$$` => field instance
     *
     * Note that this (and renderer) are destructive, meaning once transformed the stored
     * text value will be the result of the template/renderer. Typically this is not a concern
     * as SData will only use the key property. But be aware if any other fields use this field as
     * context.
     *
     */
    textTemplate: null,
    /**
     * @cfg {Function}
     * If provided the displayed textProperty is transformed with the given function.
     *
     * The function is passed the current value and should return a string to be displayed.
     *
     * Note that this (and renderer) are destructive, meaning once transformed the stored
     * text value will be the result of the template/renderer. Typically this is not a concern
     * as SData will only use the key property. But be aware if any other fields use this field as
     * context.
     *
     */
    textRenderer: null,
    /**
     * @cfg {String}
     * The property name of the returned entry to use as the key
     */
    valueKeyProperty: null,
    /**
     * @cfg {String}
     * The property name of the returned entry to use as the displayed text/description
     */
    valueTextProperty: null,
    /**
     * @cfg {Boolean}
     * Flag that indicates the field is required and that a choice has to be made. If false,
     * it passes the navigation option that {@link List List} views listen for for adding a "Empty"
     * selection choice.
     */
    requireSelection: true,
    /**
     * @property {Boolean}
     * Sets the singleSelect navigation option and if true limits gather the value from the
     * target list view to the first selection.
     */
    singleSelect: true,
    /**
     * @property {String}
     * The data-action of the toolbar item (which will be hidden) sent in navigation options. This
     * with `singleSelect` is listened to in {@link List List} so clicking a row invokes the action,
     * which is the function name defined (on the field instance in this case).
     */
    singleSelectAction: 'complete',
    /**
     * @cfg {String}
     * Name of the field in which this fields depends on before going to the target view. The value
     * is retrieved from the dependOn field and passed to expandable navigation options (resourceKind,
     * where, resourcePredicate and previousSelections).
     *
     * If dependsOn is set, the target field does not have a value and a user attempts to do a lookup
     * an error will be shown.
     *
     */
    dependsOn: null,
    /**
     * @cfg {String/Function}
     * May be set and passed in the navigation options to the target List view.
     *
     * Used to indicate the entity type.
     *
     */
    resourceKind: null,
    /**
     * @cfg {String/Function}
     * May be set and passed in the navigation options to the target List view.
     */
    resourcePredicate: null,
    /**
     * @cfg {String/Function}
     * May be set and passed in the navigation options to the target List view.
     *
     * Sets the where expression used in the SData query of the List view.
     */
    where: null,
    /**
     * @cfg {String/Function}
     * May be set and passed in the navigation options to the target List view.
     *
     * Sets the orderBy expression used in the SData query of the List view.
     */
    orderBy: null,
    /**
     * @property {Object}
     * The current value object defined using the extracted key/text properties from the selected
     * entry.
     */
    currentValue: null,
    /**
     * @property {Object}
     * The entire selected entry from the target view (not just the key/text properties).
     */
    currentSelection: null,

    /**
     * Extends init to connect to the click event, if the field is read only disable and
     * if require selection is false connect to onkeyup and onblur.
     */
    init: function init() {
      this.inherited(init, arguments);

      this.connect(this.containerNode, 'onclick', this._onClick);

      if (this.isReadOnly()) {
        this.disable();
        this.set('inputReadOnly', true);
      } else if (!this.requireSelection) {
        this.connect(this.inputNode, 'onkeyup', this._onKeyUp);
        this.connect(this.inputNode, 'onblur', this._onBlur);
      }
    },
    /**
     * Extends enable to also remove the disabled attribute
     */
    enable: function enable() {
      this.inherited(enable, arguments);

      this.set('inputDisabled', false);
    },
    /**
     * Extends disable to also set the disabled attribute
     */
    disable: function disable() {
      this.inherited(disable, arguments);

      this.set('inputDisabled', true);
    },
    focus: function focus() {
      if (!this.isReadOnly()) {
        this.inputNode.focus();
      }
    },
    /**
     * Determines if the field is readonly by checking for a target view
     * @return {Boolean}
     */
    isReadOnly: function isReadOnly() {
      return !this.view;
    },
    /**
     * Retrieves the value of the field named with `this.dependsOn`
     * @return {String/Object/Number/Boolean}
     */
    getDependentValue: function getDependentValue() {
      if (this.dependsOn && this.owner) {
        var field = this.owner.fields[this.dependsOn];
        if (field) {
          return field.getValue();
        }
      }
    },
    /**
     * Retrieves the label string of the field named with `this.dependsOn`
     * @return {String}
     */
    getDependentLabel: function getDependentLabel() {
      if (this.dependsOn && this.owner) {
        var field = this.owner.fields[this.dependsOn];
        if (field) {
          return field.label;
        }
      }
    },
    /**
     * Expands the passed expression if it is a function.
     * @param {String/Function} expression Returns string directly, if function it is called and the result returned.
     * @return {String} String expression.
     */
    expandExpression: function expandExpression(expression) {
      if (typeof expression === 'function') {
        return expression.apply(this, Array.prototype.slice.call(arguments, 1));
      }
      return expression;
    },
    /**
     * Creates the options to be passed in navigation to the target view
     *
     * Key points of the options set by default:
     *
     * * enableActions = false, List views should not be showing their list-actions bar this hides it
     * * selectionOnly = true, List views should not allow editing/viewing, just selecting
     * * negateHistory = true, disables saving of this options object when storing the history context
     * * tools = {}, overrides the toolbar of the target view so that the function that fires is invoked
     * in the context of this field, not the List.
     *
     * The following options are "expandable" meaning they can be strings or functions that return strings:
     *
     * resourceKind, resourcePredicate, where and previousSelections
     *
     * They will be passed the `dependsOn` field value (if defined).
     *
     */
    createNavigationOptions: function createNavigationOptions() {
      var _this = this;

      var options = {
        enableActions: false,
        selectionOnly: true,
        singleSelect: this.singleSelect,
        singleSelectAction: this.singleSelectAction || 'complete',
        allowEmptySelection: !this.requireSelection,
        resourceKind: this.resourceKind,
        resourcePredicate: this.resourcePredicate,
        where: this.where,
        orderBy: this.orderBy,
        negateHistory: true,
        continuousScrolling: false,
        simpleMode: true,
        tools: {
          tbar: [{
            id: 'cancel',
            side: 'left',
            svg: 'cancel',
            title: this.cancelText,
            fn: this.reui.back,
            scope: this.reui
          }, {
            id: 'complete',
            svg: 'check',
            title: this.completeText,
            fn: this.complete,
            scope: this
          }]
        }
      };

      var expand = ['resourceKind', 'resourcePredicate', 'where', 'previousSelections'];
      var dependentValue = this.getDependentValue();

      if (options.singleSelect && options.singleSelectAction) {
        for (var key in options.tools.tbar) {
          if (options.tools.tbar.hasOwnProperty(key)) {
            var item = options.tools.tbar[key];
            if (item.id === options.singleSelectAction) {
              item.cls = 'display-none';
            }
          }
        }
      }

      if (this.dependsOn && !dependentValue) {
        console.error(_string2.default.substitute(this.dependentErrorText, [this.getDependentLabel() || ''])); //eslint-disable-line
        return false;
      }

      expand.forEach(function (item) {
        if (_this[item]) {
          options[item] = _this.dependsOn // only pass dependentValue if there is a dependency
          ? _this.expandExpression(_this[item], dependentValue) : _this.expandExpression(_this[item]);
        }
      });

      options.dependentValue = dependentValue;
      options.title = this.title;

      return options;
    },
    /**
     * Navigates to the `this.view` id passing the options created from {@link #createNavigationOptions createNavigationOptions}.
     */
    navigateToListView: function navigateToListView() {
      var view = this.app.getView(this.view);
      var options = this.createNavigationOptions();

      if (view && options && !this.disabled) {
        _lang2.default.mixin(view, this.viewMixin);
        view.show(options);
      }
    },
    buttonClick: function buttonClick() {
      this.navigateToListView();
    },
    /**
     * Handler for the click event, fires {@link #navigateToListView navigateToListView} if the
     * field is not disabled.
     * @param evt
     */
    _onClick: function _onClick(evt) {
      var buttonNode = $(evt.target).closest('.button').get(0);

      if (!this.isDisabled() && (buttonNode || this.requireSelection)) {
        evt.stopPropagation();
        this.navigateToListView();
      }
    },
    /**
     * Handler for onkeyup, fires {@link #onNotificationTrigger onNotificationTrigger} if
     * `this.notificationTrigger` is `'keyup'`.
     * @param {Event} evt Click event
     */
    _onKeyUp: function _onKeyUp(evt) {
      if (!this.isDisabled() && this.notificationTrigger === 'keyup') {
        this.onNotificationTrigger(evt);
      }
    },
    /**
     * Handler for onblur, fires {@link #onNotificationTrigger onNotificationTrigger} if
     * `this.notificationTrigger` is `'blur'`.
     * @param {Event} evt Blur event
     */
    _onBlur: function _onBlur(evt) {
      if (!this.isDisabled() && this.notificationTrigger === 'blur') {
        this.onNotificationTrigger(evt);
      }
    },
    /**
     * Called from onkeyup and onblur handlers if the trigger is set.
     *
     * Checks the current value against `this.previousValue` and if different
     * fires {@link #onChange onChange}.
     *
     * @param {Event} evt
     */
    onNotificationTrigger: function onNotificationTrigger() /* evt*/{
      var currentValue = this.getValue();

      if (this.previousValue !== currentValue) {
        this.onChange(currentValue, this);
      }

      this.previousValue = currentValue;
    },
    /**
     * Sets the displayed text of the field
     * @param {String} text
     */
    setText: function setText(text) {
      this.set('inputValue', text);

      this.previousValue = text;
    },
    /**
     * Returns the string text of the field (note, not the value of the field)
     * @return {String}
     */
    getText: function getText() {
      return this.inputNode.value;
    },
    /**
     * Called from the target list view when a row is selected.
     *
     * The intent of the complete function is to gather the value(s) from the list view and
     * transfer them to the field - then handle navigating back to the Edit view.
     *
     * The target view must be the currently active view and must have a selection model.
     *
     * The values are gathered and passed to {@link #setSelection setSelection}, `ReUI.back()` is
     * fired and lastly {@link #_onComplete _onComplete} is called in a setTimeout due to bizarre
     * transition issues, namely in IE.
     */
    complete: function complete() {
      var view = this.app.getPrimaryActiveView();
      var selectionModel = view.get('selectionModel');

      if (view && selectionModel) {
        var selections = selectionModel.getSelections();
        var selectionCount = selectionModel.getSelectionCount();
        var unloadedSelections = view.getUnloadedSelections();

        if (selectionCount === 0 && view.options.allowEmptySelection) {
          this.clearValue(true);
        }

        if (this.singleSelect) {
          for (var selectionKey in selections) {
            if (selections.hasOwnProperty(selectionKey)) {
              var val = selections[selectionKey].data;
              this.setSelection(val, selectionKey);
              break;
            }
          }
        } else {
          if (selectionCount > 0) {
            this.setSelections(selections, unloadedSelections);
          }
        }

        this.reui.back();

        // if the event is fired before the transition, any XMLHttpRequest created in an event handler and
        // executing during the transition can potentially fail (status 0).  this might only be an issue with CORS
        // requests created in this state (the pre-flight request is made, and the request ends with status 0).
        // wrapping thing in a timeout and placing after the transition starts, mitigates this issue.
        setTimeout(this._onComplete.bind(this), 0);
      }
    },
    /**
     * Forces {@link #onChange onChange} to fire
     */
    _onComplete: function _onComplete() {
      this.onChange(this.currentValue, this);
    },
    /**
     * Determines if the field has been altered from the default/template value.
     * @return {Boolean}
     */
    isDirty: function isDirty() {
      if (this.originalValue && this.currentValue) {
        if (this.originalValue.key !== this.currentValue.key) {
          return true;
        }

        if (this.originalValue.text !== this.currentValue.text) {
          return true;
        }

        if (!this.requireSelection && !this.textTemplate) {
          if (this.originalValue.text !== this.getText()) {
            return true;
          }
        }

        return false;
      }

      if (this.originalValue) {
        if (!this.requireSelection && !this.textTemplate) {
          if (this.originalValue.text !== this.getText()) {
            return true;
          }
        }
      } else {
        if (!this.requireSelection && !this.textTemplate) {
          var text = this.getText();
          if (text && text.length > 0) {
            return true;
          }
        }
      }

      return this.originalValue !== this.currentValue;
    },
    /**
     * Returns the current selection that was set from the target list view.
     * @return {Object}
     */
    getSelection: function getSelection() {
      return this.currentSelection;
    },
    /**
     * Returns the current value either by extracting the valueKeyProperty and valueTextProperty or
     * several other methods of getting it to that state.
     * @return {Object/String}
     */
    getValue: function getValue() {
      var value = null;
      var text = this.getText() || '';
      // if valueKeyProperty or valueTextProperty IS NOT EXPLICITLY set to false
      // and IS NOT defined use keyProperty or textProperty in its place.
      var keyProperty = this.valueKeyProperty !== false ? this.valueKeyProperty || this.keyProperty : false;
      var textProperty = this.valueTextProperty !== false ? this.valueTextProperty || this.textProperty : false;

      if (keyProperty || textProperty) {
        if (this.currentValue) {
          if (keyProperty) {
            value = _Utility2.default.setValue(value || {}, keyProperty, this.currentValue.key);
          }

          // if a text template has been applied there is no way to guarantee a correct
          // mapping back to the property
          if (textProperty && !this.textTemplate) {
            value = _Utility2.default.setValue(value || {}, textProperty, this.requireSelection ? this.currentValue.text : text);
          }
        } else if (!this.requireSelection) {
          if (keyProperty && text.length > 0) {
            value = _Utility2.default.setValue(value || {}, keyProperty, text);
          }

          // if a text template has been applied there is no way to guarantee a correct
          // mapping back to the property
          if (textProperty && !this.textTemplate && text.length > 0) {
            value = _Utility2.default.setValue(value || {}, textProperty, text);
          }
        }
      } else {
        if (this.currentValue) {
          if (this.requireSelection) {
            value = this.currentValue.key ? this.currentValue.key : this.currentValue;
          } else {
            value = this.currentValue.text !== text && !this.textTemplate ? text : this.currentValue.key;
          }
        } else if (!this.requireSelection && text.length > 0) {
          value = text;
        }
      }

      return value;
    },
    /**
     * If using a multi-select enabled lookup then the view will return multiple objects as the value.
     *
     * This function takes that array and returns the single value that should be used for `this.currentValue`.
     *
     * @template
     * @param {Object[]} values
     * @return {Object/String}
     */
    formatValue: function formatValue(values) {
      return values;
    },
    /**
     * If using a multi-select enabled lookup this function will be called by {@link #complete complete}
     * in that the target view returned multiple entries.
     *
     * Sets the currentValue using {@link #formatValue formatValue}.
     *
     * Sets the displayed text using `this.textRenderer`.
     *
     * @param {Object[]} values
     * @param {Object[]} unloadedValues option.previousSelections that were not loaded by the view.
     */
    setSelections: function setSelections(values, unloadedValues) {
      this.currentValue = this.formatValue ? this.formatValue.call(this, values, unloadedValues) : values;

      var text = this.textRenderer ? this.textRenderer.call(this, values, unloadedValues) : '';

      this.setText(text);
    },
    /**
     * If using a singleSelect enabled lookup this function will be called by {@link #complete complete}
     * and the single entry's data and key will be passed to this function.
     *
     * Sets the `this.currentSelection` to the passed data (entire entry)
     *
     * Sets the `this.currentValue` to the extract key/text properties
     *
     * Calls {@link #setText setText} with the extracted text property.
     *
     * @param {Object} val Entire selection entry
     * @param {String} key data-key attribute of the selected row (typically $key from SData)
     */
    setSelection: function setSelection(val, key) {
      this.currentSelection = val;
      if (val === null || typeof val === 'undefined') {
        return false;
      }
      var text = _Utility2.default.getValue(val, this.textProperty);
      var newKey = _Utility2.default.getValue(val, this.keyProperty, val) || key; // if we can extract the key as requested, use it instead of the selection key

      if (text && this.textTemplate) {
        text = this.textTemplate.apply(text, this);
      } else if (this.textRenderer) {
        text = this.textRenderer.call(this, val, newKey, text);
      }

      this.currentValue = {
        key: newKey || text,
        text: text || newKey
      };

      this.setText(this.currentValue.text);
    },
    /**
     * Sets the given value to `this.currentValue` using the initial flag if to set it as
     * clean/unmodified or false for dirty.
     * @param {Object/String} val Value to set
     * @param {Boolean} initial Dirty flag (true is clean)
     */
    setValue: function setValue(val, initial) {
      // if valueKeyProperty or valueTextProperty IS NOT EXPLICITLY set to false
      // and IS NOT defined use keyProperty or textProperty in its place.
      var keyProperty = this.valueKeyProperty !== false ? this.valueKeyProperty || this.keyProperty : false;
      var textProperty = this.valueTextProperty !== false ? this.valueTextProperty || this.textProperty : false;
      var key = void 0;
      var text = void 0;

      if (typeof val === 'undefined' || val === null) {
        this.currentValue = false;
        if (initial) {
          this.originalValue = this.currentValue;
        }

        this.setText(this.requireSelection ? this.emptyText : '');
        return false;
      }

      if (keyProperty || textProperty) {
        if (keyProperty) {
          key = _Utility2.default.getValue(val, keyProperty);
        }

        if (textProperty) {
          text = _Utility2.default.getValue(val, textProperty);
        }

        if (text && this.textTemplate) {
          text = this.textTemplate.apply(text, this);
        } else if (this.textRenderer) {
          text = this.textRenderer.call(this, val, key, text);
        }

        if (key || text) {
          this.currentValue = {
            key: key || text,
            text: text || key
          };

          if (initial) {
            this.originalValue = this.currentValue;
          }

          this.setText(this.currentValue.text);
        } else {
          this.currentValue = false;

          if (initial) {
            this.originalValue = this.currentValue;
          }

          this.setText(this.requireSelection ? this.emptyText : '');
        }
      } else {
        key = val;
        text = val;

        if (text && this.textTemplate) {
          text = this.textTemplate.apply(text, this);
        } else if (this.textRenderer) {
          text = this.textRenderer.call(this, val, key, text);
        }

        this.currentValue = {
          key: key || text,
          text: text || key
        };

        if (initial) {
          this.originalValue = this.currentValue;
        }

        this.setText(text);
      }
    },
    /**
     * Clears the value by setting null (which triggers usage of `this.emptyText`.
     *
     * Flag is used to indicate if to set null as the initial value (unmodified) or not.
     *
     * @param {Boolean} flag
     */
    clearValue: function clearValue(flag) {
      var initial = flag !== true;
      this.setSelection(null);
      this.setValue(null, initial);
    }
  });

  exports.default = _FieldManager2.default.register('lookup', control);
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9GaWVsZHMvTG9va3VwRmllbGQuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJtb2RhbFJlc291cmNlIiwiY29udHJvbCIsImF0dHJpYnV0ZU1hcCIsImlucHV0VmFsdWUiLCJub2RlIiwidHlwZSIsImF0dHJpYnV0ZSIsImlucHV0RGlzYWJsZWQiLCJpbnB1dFJlYWRPbmx5Iiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImljb25DbGFzcyIsImRlcGVuZGVudEVycm9yVGV4dCIsImVtcHR5VGV4dCIsImNvbXBsZXRlVGV4dCIsImxvb2t1cExhYmVsVGV4dCIsImxvb2t1cFRleHQiLCJjYW5jZWxUZXh0IiwidmlldyIsInZpZXdNaXhpbiIsImtleVByb3BlcnR5IiwicmVxdWlyZWQiLCJ0ZXh0UHJvcGVydHkiLCJ0ZXh0VGVtcGxhdGUiLCJ0ZXh0UmVuZGVyZXIiLCJ2YWx1ZUtleVByb3BlcnR5IiwidmFsdWVUZXh0UHJvcGVydHkiLCJyZXF1aXJlU2VsZWN0aW9uIiwic2luZ2xlU2VsZWN0Iiwic2luZ2xlU2VsZWN0QWN0aW9uIiwiZGVwZW5kc09uIiwicmVzb3VyY2VLaW5kIiwicmVzb3VyY2VQcmVkaWNhdGUiLCJ3aGVyZSIsIm9yZGVyQnkiLCJjdXJyZW50VmFsdWUiLCJjdXJyZW50U2VsZWN0aW9uIiwiaW5pdCIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsImNvbm5lY3QiLCJjb250YWluZXJOb2RlIiwiX29uQ2xpY2siLCJpc1JlYWRPbmx5IiwiZGlzYWJsZSIsInNldCIsImlucHV0Tm9kZSIsIl9vbktleVVwIiwiX29uQmx1ciIsImVuYWJsZSIsImZvY3VzIiwiZ2V0RGVwZW5kZW50VmFsdWUiLCJvd25lciIsImZpZWxkIiwiZmllbGRzIiwiZ2V0VmFsdWUiLCJnZXREZXBlbmRlbnRMYWJlbCIsImxhYmVsIiwiZXhwYW5kRXhwcmVzc2lvbiIsImV4cHJlc3Npb24iLCJhcHBseSIsIkFycmF5IiwicHJvdG90eXBlIiwic2xpY2UiLCJjYWxsIiwiY3JlYXRlTmF2aWdhdGlvbk9wdGlvbnMiLCJvcHRpb25zIiwiZW5hYmxlQWN0aW9ucyIsInNlbGVjdGlvbk9ubHkiLCJhbGxvd0VtcHR5U2VsZWN0aW9uIiwibmVnYXRlSGlzdG9yeSIsImNvbnRpbnVvdXNTY3JvbGxpbmciLCJzaW1wbGVNb2RlIiwidG9vbHMiLCJ0YmFyIiwiaWQiLCJzaWRlIiwic3ZnIiwidGl0bGUiLCJmbiIsInJldWkiLCJiYWNrIiwic2NvcGUiLCJjb21wbGV0ZSIsImV4cGFuZCIsImRlcGVuZGVudFZhbHVlIiwia2V5IiwiaGFzT3duUHJvcGVydHkiLCJpdGVtIiwiY2xzIiwiY29uc29sZSIsImVycm9yIiwic3Vic3RpdHV0ZSIsImZvckVhY2giLCJuYXZpZ2F0ZVRvTGlzdFZpZXciLCJhcHAiLCJnZXRWaWV3IiwiZGlzYWJsZWQiLCJtaXhpbiIsInNob3ciLCJidXR0b25DbGljayIsImV2dCIsImJ1dHRvbk5vZGUiLCIkIiwidGFyZ2V0IiwiY2xvc2VzdCIsImdldCIsImlzRGlzYWJsZWQiLCJzdG9wUHJvcGFnYXRpb24iLCJub3RpZmljYXRpb25UcmlnZ2VyIiwib25Ob3RpZmljYXRpb25UcmlnZ2VyIiwicHJldmlvdXNWYWx1ZSIsIm9uQ2hhbmdlIiwic2V0VGV4dCIsInRleHQiLCJnZXRUZXh0IiwidmFsdWUiLCJnZXRQcmltYXJ5QWN0aXZlVmlldyIsInNlbGVjdGlvbk1vZGVsIiwic2VsZWN0aW9ucyIsImdldFNlbGVjdGlvbnMiLCJzZWxlY3Rpb25Db3VudCIsImdldFNlbGVjdGlvbkNvdW50IiwidW5sb2FkZWRTZWxlY3Rpb25zIiwiZ2V0VW5sb2FkZWRTZWxlY3Rpb25zIiwiY2xlYXJWYWx1ZSIsInNlbGVjdGlvbktleSIsInZhbCIsImRhdGEiLCJzZXRTZWxlY3Rpb24iLCJzZXRTZWxlY3Rpb25zIiwic2V0VGltZW91dCIsIl9vbkNvbXBsZXRlIiwiYmluZCIsImlzRGlydHkiLCJvcmlnaW5hbFZhbHVlIiwibGVuZ3RoIiwiZ2V0U2VsZWN0aW9uIiwic2V0VmFsdWUiLCJmb3JtYXRWYWx1ZSIsInZhbHVlcyIsInVubG9hZGVkVmFsdWVzIiwibmV3S2V5IiwiaW5pdGlhbCIsImZsYWciLCJyZWdpc3RlciJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXdCQSxNQUFNQSxXQUFXLG9CQUFZLGFBQVosQ0FBakIsQyxDQXhCQTs7Ozs7Ozs7Ozs7Ozs7O0FBeUJBLE1BQU1DLGdCQUFnQixvQkFBWSxPQUFaLENBQXRCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsTUFBTUMsVUFBVSx1QkFBUSwwQkFBUixFQUFvQyxpQkFBcEMsRUFBOEMsdUNBQXVDO0FBQ25HOzs7Ozs7Ozs7QUFTQUMsa0JBQWM7QUFDWkMsa0JBQVk7QUFDVkMsY0FBTSxXQURJO0FBRVZDLGNBQU0sV0FGSTtBQUdWQyxtQkFBVztBQUhELE9BREE7QUFNWkMscUJBQWU7QUFDYkgsY0FBTSxXQURPO0FBRWJDLGNBQU0sV0FGTztBQUdiQyxtQkFBVztBQUhFLE9BTkg7QUFXWkUscUJBQWU7QUFDYkosY0FBTSxXQURPO0FBRWJDLGNBQU0sV0FGTztBQUdiQyxtQkFBVztBQUhFO0FBWEgsS0FWcUY7QUEyQm5HOzs7Ozs7OztBQVFBRyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLHk0QkFBYixDQW5DbUY7QUFnRW5HQyxlQUFXLFFBaEV3Rjs7QUFrRW5HO0FBQ0E7Ozs7OztBQU1BQyx3QkFBb0JiLFNBQVNhLGtCQXpFc0U7QUEwRW5HOzs7O0FBSUFDLGVBQVdkLFNBQVNjLFNBOUUrRTtBQStFbkc7Ozs7QUFJQUMsa0JBQWNkLGNBQWNjLFlBbkZ1RTtBQW9Gbkc7Ozs7QUFJQUMscUJBQWlCaEIsU0FBU2dCLGVBeEZ5RTtBQXlGbkc7Ozs7QUFJQUMsZ0JBQVlqQixTQUFTaUIsVUE3RjhFO0FBOEZuRzs7OztBQUlBQyxnQkFBWWpCLGNBQWNpQixVQWxHeUU7O0FBb0duRzs7OztBQUlBQyxVQUFNLEtBeEc2Rjs7QUEwR25HOzs7O0FBSUFDLGVBQVcsSUE5R3dG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b0JBZ3hCZSx1QkFBYUUsUUFBYixDQUFzQixRQUF0QixFQUFnQ2hKLE9BQWhDLEMiLCJmaWxlIjoiTG9va3VwRmllbGQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBzdHJpbmcgZnJvbSAnZG9qby9zdHJpbmcnO1xyXG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuLi9VdGlsaXR5JztcclxuaW1wb3J0IF9GaWVsZCBmcm9tICcuL19GaWVsZCc7XHJcbmltcG9ydCBGaWVsZE1hbmFnZXIgZnJvbSAnLi4vRmllbGRNYW5hZ2VyJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4uL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ2xvb2t1cEZpZWxkJyk7XHJcbmNvbnN0IG1vZGFsUmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnbW9kYWwnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuRmllbGRzLkxvb2t1cEZpZWxkXHJcbiAqIEBjbGFzc2Rlc2MgVGhlIExvb2t1cEZpZWxkIGlzIHNpbWlsaWFyIHRvIGFuIEVkaXQgVmlldyBpbiB0aGF0IGl0IGlzIGEgZmllbGQgdGhhdCB0YWtlcyB0aGUgdXNlciB0byBhbm90aGVyXHJcbiAqIHZpZXcgYnV0IHRoZSBkaWZmZXJlbmNlIGlzIHRoYXQgYW4gRWRpdG9yRmllbGQgdGFrZXMgdGhlIHVzZXIgdG8gYW4gRWRpdCBWaWV3LCB3aGVyZWFzIExvb2t1cEZpZWxkXHJcbiAqIHRha2VzIHRoZSB1c2VyIHRvIGEgTGlzdCBWaWV3LlxyXG4gKlxyXG4gKiBNZWFuaW5nIHRoYXQgTG9va3VwRmllbGQgaXMgbWVhbnQgZm9yIGVzdGFibGlzaGluZyByZWxhdGlvbnNoaXBzIGJ5IG9ubHkgc3RvcmluZyB0aGUga2V5IGZvciBhIHZhbHVlXHJcbiAqIGFuZCB3aXRoIGRpc3BsYXllZCB0ZXh0LlxyXG4gKlxyXG4gKiBAZXhhbXBsZVxyXG4gKiAgICAge1xyXG4gKiAgICAgICAgIG5hbWU6ICdPd25lcicsXHJcbiAqICAgICAgICAgcHJvcGVydHk6ICdPd25lcicsXHJcbiAqICAgICAgICAgbGFiZWw6IHRoaXMub3duZXJUZXh0LFxyXG4gKiAgICAgICAgIHR5cGU6ICdsb29rdXAnLFxyXG4gKiAgICAgICAgIHZpZXc6ICd1c2VyX2xpc3QnXHJcbiAqICAgICB9XHJcbiAqIEBleHRlbmRzIGFyZ29zLkZpZWxkcy5fRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkTWFuYWdlclxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuVXRpbGl0eVxyXG4gKi9cclxuY29uc3QgY29udHJvbCA9IGRlY2xhcmUoJ2FyZ29zLkZpZWxkcy5Mb29rdXBGaWVsZCcsIFtfRmllbGRdLCAvKiogQGxlbmRzIGFyZ29zLkZpZWxkcy5Mb29rdXBGaWVsZCMgKi97XHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogQ3JlYXRlcyBhIHNldHRlciBtYXAgdG8gaHRtbCBub2RlcywgbmFtZWx5OlxyXG4gICAqXHJcbiAgICogKiBpbnB1dFZhbHVlID0+IGlucHV0Tm9kZXMncyB2YWx1ZVxyXG4gICAqICogaW5wdXREaXNhYmxlZCA9PiBpbnB1dE5vZGVzJ3MgZGlzYWJsZWRcclxuICAgKiAqIGlucHV0UmVhZE9ubHkgPT4gaW5wdXROb2RlcyByZWFkb25seVxyXG4gICAqXHJcbiAgICovXHJcbiAgYXR0cmlidXRlTWFwOiB7XHJcbiAgICBpbnB1dFZhbHVlOiB7XHJcbiAgICAgIG5vZGU6ICdpbnB1dE5vZGUnLFxyXG4gICAgICB0eXBlOiAnYXR0cmlidXRlJyxcclxuICAgICAgYXR0cmlidXRlOiAndmFsdWUnLFxyXG4gICAgfSxcclxuICAgIGlucHV0RGlzYWJsZWQ6IHtcclxuICAgICAgbm9kZTogJ2lucHV0Tm9kZScsXHJcbiAgICAgIHR5cGU6ICdhdHRyaWJ1dGUnLFxyXG4gICAgICBhdHRyaWJ1dGU6ICdkaXNhYmxlZCcsXHJcbiAgICB9LFxyXG4gICAgaW5wdXRSZWFkT25seToge1xyXG4gICAgICBub2RlOiAnaW5wdXROb2RlJyxcclxuICAgICAgdHlwZTogJ2F0dHJpYnV0ZScsXHJcbiAgICAgIGF0dHJpYnV0ZTogJ3JlYWRvbmx5JyxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFNpbXBsYXRlIHRoYXQgZGVmaW5lcyB0aGUgZmllbGRzIEhUTUwgTWFya3VwXHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBGaWVsZCBpbnN0YW5jZVxyXG4gICAqICogYCQkYCA9PiBPd25lciBWaWV3IGluc3RhbmNlXHJcbiAgICpcclxuICAgKi9cclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgIGB7JSBpZiAoJC5sYWJlbCkgeyAlfVxyXG4gICAgPGxhYmVsIGZvcj1cInslPSAkLm5hbWUgJX1cIlxyXG4gICAgICB7JSBpZiAoJC5yZXF1aXJlZCkgeyAlfVxyXG4gICAgICAgIGNsYXNzPVwicmVxdWlyZWRcIlxyXG4gICAgICB7JSB9ICV9PlxyXG4gICAgICAgIHslOiAkLmxhYmVsICV9XHJcbiAgICA8L2xhYmVsPlxyXG4gICAgeyUgfSAlfVxyXG4gICAgPGRpdiBjbGFzcz1cImZpZWxkIGZpZWxkLWNvbnRyb2wtd3JhcHBlclwiPlxyXG4gICAgICA8YnV0dG9uIGNsYXNzPVwiZmllbGQtY29udHJvbC10cmlnZ2VyXCJcclxuICAgICAgICBhcmlhLWxhYmVsPVwieyU6ICQubG9va3VwTGFiZWxUZXh0ICV9XCJcclxuICAgICAgICBkYXRhLWFjdGlvbj1cImJ1dHRvbkNsaWNrXCJcclxuICAgICAgICB0aXRsZT1cInslOiAkLmxvb2t1cFRleHQgJX1cIj5cclxuICAgICAgICA8c3ZnIGNsYXNzPVwiaWNvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgICAgPHVzZSB4bWxuczp4bGluaz1cImh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmtcIiB4bGluazpocmVmPVwiI2ljb24teyU6ICQuaWNvbkNsYXNzICV9XCI+PC91c2U+XHJcbiAgICAgICAgPC9zdmc+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8aW5wdXQgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImlucHV0Tm9kZVwiXHJcbiAgICAgICAgdHlwZT1cInRleHRcIlxyXG4gICAgICAgIHslIGlmICgkLnJlcXVpcmVTZWxlY3Rpb24pIHsgJX1cclxuICAgICAgICByZWFkb25seT1cInJlYWRvbmx5XCJ7JSB9ICV9XHJcbiAgICAgICAgeyUgaWYgKCQucmVxdWlyZWQpIHsgJX1cclxuICAgICAgICAgICAgZGF0YS12YWxpZGF0ZT1cInJlcXVpcmVkXCJcclxuICAgICAgICAgICAgY2xhc3M9XCJyZXF1aXJlZFwiXHJcbiAgICAgICAgICB7JSB9ICV9XHJcbiAgICAgICAgLz5cclxuICAgIDwvZGl2PmAsXHJcbiAgXSksXHJcbiAgaWNvbkNsYXNzOiAnc2VhcmNoJyxcclxuXHJcbiAgLy8gTG9jYWxpemF0aW9uXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogRXJyb3IgdGV4dCBzaG93biB3aGVuIHZhbGlkYXRpb24gZmFpbHMuXHJcbiAgICpcclxuICAgKiAqIGAkezB9YCBpcyB0aGUgbGFiZWwgdGV4dCBvZiB0aGUgZmllbGRcclxuICAgKi9cclxuICBkZXBlbmRlbnRFcnJvclRleHQ6IHJlc291cmNlLmRlcGVuZGVudEVycm9yVGV4dCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogVGV4dCBkaXNwbGF5ZWQgd2hlbiB0aGUgZmllbGQgaXMgY2xlYXJlZCBvciBzZXQgdG8gbnVsbFxyXG4gICAqL1xyXG4gIGVtcHR5VGV4dDogcmVzb3VyY2UuZW1wdHlUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSB0b29sdGlwIHRleHQgZm9yIHNhdmluZyB0aGUgc2VsZWN0aW9uXHJcbiAgICovXHJcbiAgY29tcGxldGVUZXh0OiBtb2RhbFJlc291cmNlLmNvbXBsZXRlVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgQVJJQSBsYWJlbCB0ZXh0IGluIHRoZSBsb29rdXAgYnV0dG9uXHJcbiAgICovXHJcbiAgbG9va3VwTGFiZWxUZXh0OiByZXNvdXJjZS5sb29rdXBMYWJlbFRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgcGxhY2VkIGluc2lkZSB0aGUgbG9va3VwIGJ1dHRvblxyXG4gICAqL1xyXG4gIGxvb2t1cFRleHQ6IHJlc291cmNlLmxvb2t1cFRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHRvb2x0aXAgdGV4dCBmb3IgY2FuY2VsbGluZyB0aGUgc2VsZWN0aW9uXHJcbiAgICovXHJcbiAgY2FuY2VsVGV4dDogbW9kYWxSZXNvdXJjZS5jYW5jZWxUZXh0LFxyXG5cclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogUmVxdWlyZWQuIE11c3QgYmUgc2V0IHRvIGEgdmlldyBpZCBvZiB0aGUgdGFyZ2V0IGxvb2t1cCB2aWV3XHJcbiAgICovXHJcbiAgdmlldzogZmFsc2UsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBjZmcge09iamVjdH1cclxuICAgKiBPcHRpb25hbC4gT2JqZWN0IHRvIG1peGluIG92ZXIgdGhlIHZpZXdcclxuICAgKi9cclxuICB2aWV3TWl4aW46IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIGRlZmF1bHQgYHZhbHVlS2V5UHJvcGVydHlgIGlmIGB2YWx1ZUtleVByb3BlcnR5YCBpcyBub3QgZGVmaW5lZC5cclxuICAgKi9cclxuICBrZXlQcm9wZXJ0eTogJyRrZXknLFxyXG4gIC8qKlxyXG4gICAqIHJlcXVpcmVkIHNob3VsZCBiZSB0cnVlIGlmIHRoZSBmaWVsZCByZXF1aXJlcyBpbnB1dC4gRGVmYXVsdHMgdG8gZmFsc2UuXHJcbiAgICogQHR5cGUge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgcmVxdWlyZWQ6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSBkZWZhdWx0IGB2YWx1ZVRleHRQcm9wZXJ0eWAgaWYgYHZhbHVlVGV4dFByb3BlcnR5YCBpcyBub3QgZGVmaW5lZC5cclxuICAgKi9cclxuICB0ZXh0UHJvcGVydHk6ICckZGVzY3JpcHRvcicsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U2ltcGxhdGV9XHJcbiAgICogSWYgcHJvdmlkZWQgdGhlIGRpc3BsYXllZCB0ZXh0UHJvcGVydHkgaXMgdHJhbnNmb3JtZWQgd2l0aCB0aGUgZ2l2ZW4gU2ltcGxhdGUuXHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiB2YWx1ZSBleHRyYWN0ZWRcclxuICAgKiAqIGAkJGAgPT4gZmllbGQgaW5zdGFuY2VcclxuICAgKlxyXG4gICAqIE5vdGUgdGhhdCB0aGlzIChhbmQgcmVuZGVyZXIpIGFyZSBkZXN0cnVjdGl2ZSwgbWVhbmluZyBvbmNlIHRyYW5zZm9ybWVkIHRoZSBzdG9yZWRcclxuICAgKiB0ZXh0IHZhbHVlIHdpbGwgYmUgdGhlIHJlc3VsdCBvZiB0aGUgdGVtcGxhdGUvcmVuZGVyZXIuIFR5cGljYWxseSB0aGlzIGlzIG5vdCBhIGNvbmNlcm5cclxuICAgKiBhcyBTRGF0YSB3aWxsIG9ubHkgdXNlIHRoZSBrZXkgcHJvcGVydHkuIEJ1dCBiZSBhd2FyZSBpZiBhbnkgb3RoZXIgZmllbGRzIHVzZSB0aGlzIGZpZWxkIGFzXHJcbiAgICogY29udGV4dC5cclxuICAgKlxyXG4gICAqL1xyXG4gIHRleHRUZW1wbGF0ZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtGdW5jdGlvbn1cclxuICAgKiBJZiBwcm92aWRlZCB0aGUgZGlzcGxheWVkIHRleHRQcm9wZXJ0eSBpcyB0cmFuc2Zvcm1lZCB3aXRoIHRoZSBnaXZlbiBmdW5jdGlvbi5cclxuICAgKlxyXG4gICAqIFRoZSBmdW5jdGlvbiBpcyBwYXNzZWQgdGhlIGN1cnJlbnQgdmFsdWUgYW5kIHNob3VsZCByZXR1cm4gYSBzdHJpbmcgdG8gYmUgZGlzcGxheWVkLlxyXG4gICAqXHJcbiAgICogTm90ZSB0aGF0IHRoaXMgKGFuZCByZW5kZXJlcikgYXJlIGRlc3RydWN0aXZlLCBtZWFuaW5nIG9uY2UgdHJhbnNmb3JtZWQgdGhlIHN0b3JlZFxyXG4gICAqIHRleHQgdmFsdWUgd2lsbCBiZSB0aGUgcmVzdWx0IG9mIHRoZSB0ZW1wbGF0ZS9yZW5kZXJlci4gVHlwaWNhbGx5IHRoaXMgaXMgbm90IGEgY29uY2VyblxyXG4gICAqIGFzIFNEYXRhIHdpbGwgb25seSB1c2UgdGhlIGtleSBwcm9wZXJ0eS4gQnV0IGJlIGF3YXJlIGlmIGFueSBvdGhlciBmaWVsZHMgdXNlIHRoaXMgZmllbGQgYXNcclxuICAgKiBjb250ZXh0LlxyXG4gICAqXHJcbiAgICovXHJcbiAgdGV4dFJlbmRlcmVyOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBUaGUgcHJvcGVydHkgbmFtZSBvZiB0aGUgcmV0dXJuZWQgZW50cnkgdG8gdXNlIGFzIHRoZSBrZXlcclxuICAgKi9cclxuICB2YWx1ZUtleVByb3BlcnR5OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBUaGUgcHJvcGVydHkgbmFtZSBvZiB0aGUgcmV0dXJuZWQgZW50cnkgdG8gdXNlIGFzIHRoZSBkaXNwbGF5ZWQgdGV4dC9kZXNjcmlwdGlvblxyXG4gICAqL1xyXG4gIHZhbHVlVGV4dFByb3BlcnR5OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge0Jvb2xlYW59XHJcbiAgICogRmxhZyB0aGF0IGluZGljYXRlcyB0aGUgZmllbGQgaXMgcmVxdWlyZWQgYW5kIHRoYXQgYSBjaG9pY2UgaGFzIHRvIGJlIG1hZGUuIElmIGZhbHNlLFxyXG4gICAqIGl0IHBhc3NlcyB0aGUgbmF2aWdhdGlvbiBvcHRpb24gdGhhdCB7QGxpbmsgTGlzdCBMaXN0fSB2aWV3cyBsaXN0ZW4gZm9yIGZvciBhZGRpbmcgYSBcIkVtcHR5XCJcclxuICAgKiBzZWxlY3Rpb24gY2hvaWNlLlxyXG4gICAqL1xyXG4gIHJlcXVpcmVTZWxlY3Rpb246IHRydWUsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIFNldHMgdGhlIHNpbmdsZVNlbGVjdCBuYXZpZ2F0aW9uIG9wdGlvbiBhbmQgaWYgdHJ1ZSBsaW1pdHMgZ2F0aGVyIHRoZSB2YWx1ZSBmcm9tIHRoZVxyXG4gICAqIHRhcmdldCBsaXN0IHZpZXcgdG8gdGhlIGZpcnN0IHNlbGVjdGlvbi5cclxuICAgKi9cclxuICBzaW5nbGVTZWxlY3Q6IHRydWUsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIGRhdGEtYWN0aW9uIG9mIHRoZSB0b29sYmFyIGl0ZW0gKHdoaWNoIHdpbGwgYmUgaGlkZGVuKSBzZW50IGluIG5hdmlnYXRpb24gb3B0aW9ucy4gVGhpc1xyXG4gICAqIHdpdGggYHNpbmdsZVNlbGVjdGAgaXMgbGlzdGVuZWQgdG8gaW4ge0BsaW5rIExpc3QgTGlzdH0gc28gY2xpY2tpbmcgYSByb3cgaW52b2tlcyB0aGUgYWN0aW9uLFxyXG4gICAqIHdoaWNoIGlzIHRoZSBmdW5jdGlvbiBuYW1lIGRlZmluZWQgKG9uIHRoZSBmaWVsZCBpbnN0YW5jZSBpbiB0aGlzIGNhc2UpLlxyXG4gICAqL1xyXG4gIHNpbmdsZVNlbGVjdEFjdGlvbjogJ2NvbXBsZXRlJyxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogTmFtZSBvZiB0aGUgZmllbGQgaW4gd2hpY2ggdGhpcyBmaWVsZHMgZGVwZW5kcyBvbiBiZWZvcmUgZ29pbmcgdG8gdGhlIHRhcmdldCB2aWV3LiBUaGUgdmFsdWVcclxuICAgKiBpcyByZXRyaWV2ZWQgZnJvbSB0aGUgZGVwZW5kT24gZmllbGQgYW5kIHBhc3NlZCB0byBleHBhbmRhYmxlIG5hdmlnYXRpb24gb3B0aW9ucyAocmVzb3VyY2VLaW5kLFxyXG4gICAqIHdoZXJlLCByZXNvdXJjZVByZWRpY2F0ZSBhbmQgcHJldmlvdXNTZWxlY3Rpb25zKS5cclxuICAgKlxyXG4gICAqIElmIGRlcGVuZHNPbiBpcyBzZXQsIHRoZSB0YXJnZXQgZmllbGQgZG9lcyBub3QgaGF2ZSBhIHZhbHVlIGFuZCBhIHVzZXIgYXR0ZW1wdHMgdG8gZG8gYSBsb29rdXBcclxuICAgKiBhbiBlcnJvciB3aWxsIGJlIHNob3duLlxyXG4gICAqXHJcbiAgICovXHJcbiAgZGVwZW5kc09uOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZy9GdW5jdGlvbn1cclxuICAgKiBNYXkgYmUgc2V0IGFuZCBwYXNzZWQgaW4gdGhlIG5hdmlnYXRpb24gb3B0aW9ucyB0byB0aGUgdGFyZ2V0IExpc3Qgdmlldy5cclxuICAgKlxyXG4gICAqIFVzZWQgdG8gaW5kaWNhdGUgdGhlIGVudGl0eSB0eXBlLlxyXG4gICAqXHJcbiAgICovXHJcbiAgcmVzb3VyY2VLaW5kOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZy9GdW5jdGlvbn1cclxuICAgKiBNYXkgYmUgc2V0IGFuZCBwYXNzZWQgaW4gdGhlIG5hdmlnYXRpb24gb3B0aW9ucyB0byB0aGUgdGFyZ2V0IExpc3Qgdmlldy5cclxuICAgKi9cclxuICByZXNvdXJjZVByZWRpY2F0ZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmcvRnVuY3Rpb259XHJcbiAgICogTWF5IGJlIHNldCBhbmQgcGFzc2VkIGluIHRoZSBuYXZpZ2F0aW9uIG9wdGlvbnMgdG8gdGhlIHRhcmdldCBMaXN0IHZpZXcuXHJcbiAgICpcclxuICAgKiBTZXRzIHRoZSB3aGVyZSBleHByZXNzaW9uIHVzZWQgaW4gdGhlIFNEYXRhIHF1ZXJ5IG9mIHRoZSBMaXN0IHZpZXcuXHJcbiAgICovXHJcbiAgd2hlcmU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nL0Z1bmN0aW9ufVxyXG4gICAqIE1heSBiZSBzZXQgYW5kIHBhc3NlZCBpbiB0aGUgbmF2aWdhdGlvbiBvcHRpb25zIHRvIHRoZSB0YXJnZXQgTGlzdCB2aWV3LlxyXG4gICAqXHJcbiAgICogU2V0cyB0aGUgb3JkZXJCeSBleHByZXNzaW9uIHVzZWQgaW4gdGhlIFNEYXRhIHF1ZXJ5IG9mIHRoZSBMaXN0IHZpZXcuXHJcbiAgICovXHJcbiAgb3JkZXJCeTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgY3VycmVudCB2YWx1ZSBvYmplY3QgZGVmaW5lZCB1c2luZyB0aGUgZXh0cmFjdGVkIGtleS90ZXh0IHByb3BlcnRpZXMgZnJvbSB0aGUgc2VsZWN0ZWRcclxuICAgKiBlbnRyeS5cclxuICAgKi9cclxuICBjdXJyZW50VmFsdWU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIGVudGlyZSBzZWxlY3RlZCBlbnRyeSBmcm9tIHRoZSB0YXJnZXQgdmlldyAobm90IGp1c3QgdGhlIGtleS90ZXh0IHByb3BlcnRpZXMpLlxyXG4gICAqL1xyXG4gIGN1cnJlbnRTZWxlY3Rpb246IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgaW5pdCB0byBjb25uZWN0IHRvIHRoZSBjbGljayBldmVudCwgaWYgdGhlIGZpZWxkIGlzIHJlYWQgb25seSBkaXNhYmxlIGFuZFxyXG4gICAqIGlmIHJlcXVpcmUgc2VsZWN0aW9uIGlzIGZhbHNlIGNvbm5lY3QgdG8gb25rZXl1cCBhbmQgb25ibHVyLlxyXG4gICAqL1xyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChpbml0LCBhcmd1bWVudHMpO1xyXG5cclxuICAgIHRoaXMuY29ubmVjdCh0aGlzLmNvbnRhaW5lck5vZGUsICdvbmNsaWNrJywgdGhpcy5fb25DbGljayk7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNSZWFkT25seSgpKSB7XHJcbiAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICB0aGlzLnNldCgnaW5wdXRSZWFkT25seScsIHRydWUpO1xyXG4gICAgfSBlbHNlIGlmICghdGhpcy5yZXF1aXJlU2VsZWN0aW9uKSB7XHJcbiAgICAgIHRoaXMuY29ubmVjdCh0aGlzLmlucHV0Tm9kZSwgJ29ua2V5dXAnLCB0aGlzLl9vbktleVVwKTtcclxuICAgICAgdGhpcy5jb25uZWN0KHRoaXMuaW5wdXROb2RlLCAnb25ibHVyJywgdGhpcy5fb25CbHVyKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgZW5hYmxlIHRvIGFsc28gcmVtb3ZlIHRoZSBkaXNhYmxlZCBhdHRyaWJ1dGVcclxuICAgKi9cclxuICBlbmFibGU6IGZ1bmN0aW9uIGVuYWJsZSgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGVuYWJsZSwgYXJndW1lbnRzKTtcclxuXHJcbiAgICB0aGlzLnNldCgnaW5wdXREaXNhYmxlZCcsIGZhbHNlKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgZGlzYWJsZSB0byBhbHNvIHNldCB0aGUgZGlzYWJsZWQgYXR0cmlidXRlXHJcbiAgICovXHJcbiAgZGlzYWJsZTogZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGRpc2FibGUsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgdGhpcy5zZXQoJ2lucHV0RGlzYWJsZWQnLCB0cnVlKTtcclxuICB9LFxyXG4gIGZvY3VzOiBmdW5jdGlvbiBmb2N1cygpIHtcclxuICAgIGlmICghdGhpcy5pc1JlYWRPbmx5KCkpIHtcclxuICAgICAgdGhpcy5pbnB1dE5vZGUuZm9jdXMoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgdGhlIGZpZWxkIGlzIHJlYWRvbmx5IGJ5IGNoZWNraW5nIGZvciBhIHRhcmdldCB2aWV3XHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBpc1JlYWRPbmx5OiBmdW5jdGlvbiBpc1JlYWRPbmx5KCkge1xyXG4gICAgcmV0dXJuICF0aGlzLnZpZXc7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXRyaWV2ZXMgdGhlIHZhbHVlIG9mIHRoZSBmaWVsZCBuYW1lZCB3aXRoIGB0aGlzLmRlcGVuZHNPbmBcclxuICAgKiBAcmV0dXJuIHtTdHJpbmcvT2JqZWN0L051bWJlci9Cb29sZWFufVxyXG4gICAqL1xyXG4gIGdldERlcGVuZGVudFZhbHVlOiBmdW5jdGlvbiBnZXREZXBlbmRlbnRWYWx1ZSgpIHtcclxuICAgIGlmICh0aGlzLmRlcGVuZHNPbiAmJiB0aGlzLm93bmVyKSB7XHJcbiAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5vd25lci5maWVsZHNbdGhpcy5kZXBlbmRzT25dO1xyXG4gICAgICBpZiAoZmllbGQpIHtcclxuICAgICAgICByZXR1cm4gZmllbGQuZ2V0VmFsdWUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIHRoZSBsYWJlbCBzdHJpbmcgb2YgdGhlIGZpZWxkIG5hbWVkIHdpdGggYHRoaXMuZGVwZW5kc09uYFxyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgKi9cclxuICBnZXREZXBlbmRlbnRMYWJlbDogZnVuY3Rpb24gZ2V0RGVwZW5kZW50TGFiZWwoKSB7XHJcbiAgICBpZiAodGhpcy5kZXBlbmRzT24gJiYgdGhpcy5vd25lcikge1xyXG4gICAgICBjb25zdCBmaWVsZCA9IHRoaXMub3duZXIuZmllbGRzW3RoaXMuZGVwZW5kc09uXTtcclxuICAgICAgaWYgKGZpZWxkKSB7XHJcbiAgICAgICAgcmV0dXJuIGZpZWxkLmxhYmVsO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHBhbmRzIHRoZSBwYXNzZWQgZXhwcmVzc2lvbiBpZiBpdCBpcyBhIGZ1bmN0aW9uLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nL0Z1bmN0aW9ufSBleHByZXNzaW9uIFJldHVybnMgc3RyaW5nIGRpcmVjdGx5LCBpZiBmdW5jdGlvbiBpdCBpcyBjYWxsZWQgYW5kIHRoZSByZXN1bHQgcmV0dXJuZWQuXHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBTdHJpbmcgZXhwcmVzc2lvbi5cclxuICAgKi9cclxuICBleHBhbmRFeHByZXNzaW9uOiBmdW5jdGlvbiBleHBhbmRFeHByZXNzaW9uKGV4cHJlc3Npb24pIHtcclxuICAgIGlmICh0eXBlb2YgZXhwcmVzc2lvbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm4gZXhwcmVzc2lvbi5hcHBseSh0aGlzLCBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpKTtcclxuICAgIH1cclxuICAgIHJldHVybiBleHByZXNzaW9uO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgb3B0aW9ucyB0byBiZSBwYXNzZWQgaW4gbmF2aWdhdGlvbiB0byB0aGUgdGFyZ2V0IHZpZXdcclxuICAgKlxyXG4gICAqIEtleSBwb2ludHMgb2YgdGhlIG9wdGlvbnMgc2V0IGJ5IGRlZmF1bHQ6XHJcbiAgICpcclxuICAgKiAqIGVuYWJsZUFjdGlvbnMgPSBmYWxzZSwgTGlzdCB2aWV3cyBzaG91bGQgbm90IGJlIHNob3dpbmcgdGhlaXIgbGlzdC1hY3Rpb25zIGJhciB0aGlzIGhpZGVzIGl0XHJcbiAgICogKiBzZWxlY3Rpb25Pbmx5ID0gdHJ1ZSwgTGlzdCB2aWV3cyBzaG91bGQgbm90IGFsbG93IGVkaXRpbmcvdmlld2luZywganVzdCBzZWxlY3RpbmdcclxuICAgKiAqIG5lZ2F0ZUhpc3RvcnkgPSB0cnVlLCBkaXNhYmxlcyBzYXZpbmcgb2YgdGhpcyBvcHRpb25zIG9iamVjdCB3aGVuIHN0b3JpbmcgdGhlIGhpc3RvcnkgY29udGV4dFxyXG4gICAqICogdG9vbHMgPSB7fSwgb3ZlcnJpZGVzIHRoZSB0b29sYmFyIG9mIHRoZSB0YXJnZXQgdmlldyBzbyB0aGF0IHRoZSBmdW5jdGlvbiB0aGF0IGZpcmVzIGlzIGludm9rZWRcclxuICAgKiBpbiB0aGUgY29udGV4dCBvZiB0aGlzIGZpZWxkLCBub3QgdGhlIExpc3QuXHJcbiAgICpcclxuICAgKiBUaGUgZm9sbG93aW5nIG9wdGlvbnMgYXJlIFwiZXhwYW5kYWJsZVwiIG1lYW5pbmcgdGhleSBjYW4gYmUgc3RyaW5ncyBvciBmdW5jdGlvbnMgdGhhdCByZXR1cm4gc3RyaW5nczpcclxuICAgKlxyXG4gICAqIHJlc291cmNlS2luZCwgcmVzb3VyY2VQcmVkaWNhdGUsIHdoZXJlIGFuZCBwcmV2aW91c1NlbGVjdGlvbnNcclxuICAgKlxyXG4gICAqIFRoZXkgd2lsbCBiZSBwYXNzZWQgdGhlIGBkZXBlbmRzT25gIGZpZWxkIHZhbHVlIChpZiBkZWZpbmVkKS5cclxuICAgKlxyXG4gICAqL1xyXG4gIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zOiBmdW5jdGlvbiBjcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucygpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGVuYWJsZUFjdGlvbnM6IGZhbHNlLFxyXG4gICAgICBzZWxlY3Rpb25Pbmx5OiB0cnVlLFxyXG4gICAgICBzaW5nbGVTZWxlY3Q6IHRoaXMuc2luZ2xlU2VsZWN0LFxyXG4gICAgICBzaW5nbGVTZWxlY3RBY3Rpb246IHRoaXMuc2luZ2xlU2VsZWN0QWN0aW9uIHx8ICdjb21wbGV0ZScsXHJcbiAgICAgIGFsbG93RW1wdHlTZWxlY3Rpb246ICF0aGlzLnJlcXVpcmVTZWxlY3Rpb24sXHJcbiAgICAgIHJlc291cmNlS2luZDogdGhpcy5yZXNvdXJjZUtpbmQsXHJcbiAgICAgIHJlc291cmNlUHJlZGljYXRlOiB0aGlzLnJlc291cmNlUHJlZGljYXRlLFxyXG4gICAgICB3aGVyZTogdGhpcy53aGVyZSxcclxuICAgICAgb3JkZXJCeTogdGhpcy5vcmRlckJ5LFxyXG4gICAgICBuZWdhdGVIaXN0b3J5OiB0cnVlLFxyXG4gICAgICBjb250aW51b3VzU2Nyb2xsaW5nOiBmYWxzZSxcclxuICAgICAgc2ltcGxlTW9kZTogdHJ1ZSxcclxuICAgICAgdG9vbHM6IHtcclxuICAgICAgICB0YmFyOiBbe1xyXG4gICAgICAgICAgaWQ6ICdjYW5jZWwnLFxyXG4gICAgICAgICAgc2lkZTogJ2xlZnQnLFxyXG4gICAgICAgICAgc3ZnOiAnY2FuY2VsJyxcclxuICAgICAgICAgIHRpdGxlOiB0aGlzLmNhbmNlbFRleHQsXHJcbiAgICAgICAgICBmbjogdGhpcy5yZXVpLmJhY2ssXHJcbiAgICAgICAgICBzY29wZTogdGhpcy5yZXVpLFxyXG4gICAgICAgIH0sIHtcclxuICAgICAgICAgIGlkOiAnY29tcGxldGUnLFxyXG4gICAgICAgICAgc3ZnOiAnY2hlY2snLFxyXG4gICAgICAgICAgdGl0bGU6IHRoaXMuY29tcGxldGVUZXh0LFxyXG4gICAgICAgICAgZm46IHRoaXMuY29tcGxldGUsXHJcbiAgICAgICAgICBzY29wZTogdGhpcyxcclxuICAgICAgICB9XSxcclxuICAgICAgfSxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgZXhwYW5kID0gWydyZXNvdXJjZUtpbmQnLCAncmVzb3VyY2VQcmVkaWNhdGUnLCAnd2hlcmUnLCAncHJldmlvdXNTZWxlY3Rpb25zJ107XHJcbiAgICBjb25zdCBkZXBlbmRlbnRWYWx1ZSA9IHRoaXMuZ2V0RGVwZW5kZW50VmFsdWUoKTtcclxuXHJcbiAgICBpZiAob3B0aW9ucy5zaW5nbGVTZWxlY3QgJiYgb3B0aW9ucy5zaW5nbGVTZWxlY3RBY3Rpb24pIHtcclxuICAgICAgZm9yIChjb25zdCBrZXkgaW4gb3B0aW9ucy50b29scy50YmFyKSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMudG9vbHMudGJhci5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgICBjb25zdCBpdGVtID0gb3B0aW9ucy50b29scy50YmFyW2tleV07XHJcbiAgICAgICAgICBpZiAoaXRlbS5pZCA9PT0gb3B0aW9ucy5zaW5nbGVTZWxlY3RBY3Rpb24pIHtcclxuICAgICAgICAgICAgaXRlbS5jbHMgPSAnZGlzcGxheS1ub25lJztcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5kZXBlbmRzT24gJiYgIWRlcGVuZGVudFZhbHVlKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3Ioc3RyaW5nLnN1YnN0aXR1dGUodGhpcy5kZXBlbmRlbnRFcnJvclRleHQsIFt0aGlzLmdldERlcGVuZGVudExhYmVsKCkgfHwgJyddKSk7Ly9lc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBleHBhbmQuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBpZiAodGhpc1tpdGVtXSkge1xyXG4gICAgICAgIG9wdGlvbnNbaXRlbV0gPSB0aGlzLmRlcGVuZHNPbiAvLyBvbmx5IHBhc3MgZGVwZW5kZW50VmFsdWUgaWYgdGhlcmUgaXMgYSBkZXBlbmRlbmN5XHJcbiAgICAgICAgICA/IHRoaXMuZXhwYW5kRXhwcmVzc2lvbih0aGlzW2l0ZW1dLCBkZXBlbmRlbnRWYWx1ZSkgOiB0aGlzLmV4cGFuZEV4cHJlc3Npb24odGhpc1tpdGVtXSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIG9wdGlvbnMuZGVwZW5kZW50VmFsdWUgPSBkZXBlbmRlbnRWYWx1ZTtcclxuICAgIG9wdGlvbnMudGl0bGUgPSB0aGlzLnRpdGxlO1xyXG5cclxuICAgIHJldHVybiBvcHRpb25zO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogTmF2aWdhdGVzIHRvIHRoZSBgdGhpcy52aWV3YCBpZCBwYXNzaW5nIHRoZSBvcHRpb25zIGNyZWF0ZWQgZnJvbSB7QGxpbmsgI2NyZWF0ZU5hdmlnYXRpb25PcHRpb25zIGNyZWF0ZU5hdmlnYXRpb25PcHRpb25zfS5cclxuICAgKi9cclxuICBuYXZpZ2F0ZVRvTGlzdFZpZXc6IGZ1bmN0aW9uIG5hdmlnYXRlVG9MaXN0VmlldygpIHtcclxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC5nZXRWaWV3KHRoaXMudmlldyk7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5jcmVhdGVOYXZpZ2F0aW9uT3B0aW9ucygpO1xyXG5cclxuICAgIGlmICh2aWV3ICYmIG9wdGlvbnMgJiYgIXRoaXMuZGlzYWJsZWQpIHtcclxuICAgICAgbGFuZy5taXhpbih2aWV3LCB0aGlzLnZpZXdNaXhpbik7XHJcbiAgICAgIHZpZXcuc2hvdyhvcHRpb25zKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGJ1dHRvbkNsaWNrOiBmdW5jdGlvbiBidXR0b25DbGljaygpIHtcclxuICAgIHRoaXMubmF2aWdhdGVUb0xpc3RWaWV3KCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgY2xpY2sgZXZlbnQsIGZpcmVzIHtAbGluayAjbmF2aWdhdGVUb0xpc3RWaWV3IG5hdmlnYXRlVG9MaXN0Vmlld30gaWYgdGhlXHJcbiAgICogZmllbGQgaXMgbm90IGRpc2FibGVkLlxyXG4gICAqIEBwYXJhbSBldnRcclxuICAgKi9cclxuICBfb25DbGljazogZnVuY3Rpb24gX29uQ2xpY2soZXZ0KSB7XHJcbiAgICBjb25zdCBidXR0b25Ob2RlID0gJChldnQudGFyZ2V0KS5jbG9zZXN0KCcuYnV0dG9uJykuZ2V0KDApO1xyXG5cclxuICAgIGlmICghdGhpcy5pc0Rpc2FibGVkKCkgJiYgKGJ1dHRvbk5vZGUgfHwgdGhpcy5yZXF1aXJlU2VsZWN0aW9uKSkge1xyXG4gICAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIHRoaXMubmF2aWdhdGVUb0xpc3RWaWV3KCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBvbmtleXVwLCBmaXJlcyB7QGxpbmsgI29uTm90aWZpY2F0aW9uVHJpZ2dlciBvbk5vdGlmaWNhdGlvblRyaWdnZXJ9IGlmXHJcbiAgICogYHRoaXMubm90aWZpY2F0aW9uVHJpZ2dlcmAgaXMgYCdrZXl1cCdgLlxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBDbGljayBldmVudFxyXG4gICAqL1xyXG4gIF9vbktleVVwOiBmdW5jdGlvbiBfb25LZXlVcChldnQpIHtcclxuICAgIGlmICghdGhpcy5pc0Rpc2FibGVkKCkgJiYgdGhpcy5ub3RpZmljYXRpb25UcmlnZ2VyID09PSAna2V5dXAnKSB7XHJcbiAgICAgIHRoaXMub25Ob3RpZmljYXRpb25UcmlnZ2VyKGV2dCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBvbmJsdXIsIGZpcmVzIHtAbGluayAjb25Ob3RpZmljYXRpb25UcmlnZ2VyIG9uTm90aWZpY2F0aW9uVHJpZ2dlcn0gaWZcclxuICAgKiBgdGhpcy5ub3RpZmljYXRpb25UcmlnZ2VyYCBpcyBgJ2JsdXInYC5cclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgQmx1ciBldmVudFxyXG4gICAqL1xyXG4gIF9vbkJsdXI6IGZ1bmN0aW9uIF9vbkJsdXIoZXZ0KSB7XHJcbiAgICBpZiAoIXRoaXMuaXNEaXNhYmxlZCgpICYmIHRoaXMubm90aWZpY2F0aW9uVHJpZ2dlciA9PT0gJ2JsdXInKSB7XHJcbiAgICAgIHRoaXMub25Ob3RpZmljYXRpb25UcmlnZ2VyKGV2dCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgZnJvbSBvbmtleXVwIGFuZCBvbmJsdXIgaGFuZGxlcnMgaWYgdGhlIHRyaWdnZXIgaXMgc2V0LlxyXG4gICAqXHJcbiAgICogQ2hlY2tzIHRoZSBjdXJyZW50IHZhbHVlIGFnYWluc3QgYHRoaXMucHJldmlvdXNWYWx1ZWAgYW5kIGlmIGRpZmZlcmVudFxyXG4gICAqIGZpcmVzIHtAbGluayAjb25DaGFuZ2Ugb25DaGFuZ2V9LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XHJcbiAgICovXHJcbiAgb25Ob3RpZmljYXRpb25UcmlnZ2VyOiBmdW5jdGlvbiBvbk5vdGlmaWNhdGlvblRyaWdnZXIoLyogZXZ0Ki8pIHtcclxuICAgIGNvbnN0IGN1cnJlbnRWYWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcclxuXHJcbiAgICBpZiAodGhpcy5wcmV2aW91c1ZhbHVlICE9PSBjdXJyZW50VmFsdWUpIHtcclxuICAgICAgdGhpcy5vbkNoYW5nZShjdXJyZW50VmFsdWUsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucHJldmlvdXNWYWx1ZSA9IGN1cnJlbnRWYWx1ZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGRpc3BsYXllZCB0ZXh0IG9mIHRoZSBmaWVsZFxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSB0ZXh0XHJcbiAgICovXHJcbiAgc2V0VGV4dDogZnVuY3Rpb24gc2V0VGV4dCh0ZXh0KSB7XHJcbiAgICB0aGlzLnNldCgnaW5wdXRWYWx1ZScsIHRleHQpO1xyXG5cclxuICAgIHRoaXMucHJldmlvdXNWYWx1ZSA9IHRleHQ7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSBzdHJpbmcgdGV4dCBvZiB0aGUgZmllbGQgKG5vdGUsIG5vdCB0aGUgdmFsdWUgb2YgdGhlIGZpZWxkKVxyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgKi9cclxuICBnZXRUZXh0OiBmdW5jdGlvbiBnZXRUZXh0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5wdXROb2RlLnZhbHVlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGZyb20gdGhlIHRhcmdldCBsaXN0IHZpZXcgd2hlbiBhIHJvdyBpcyBzZWxlY3RlZC5cclxuICAgKlxyXG4gICAqIFRoZSBpbnRlbnQgb2YgdGhlIGNvbXBsZXRlIGZ1bmN0aW9uIGlzIHRvIGdhdGhlciB0aGUgdmFsdWUocykgZnJvbSB0aGUgbGlzdCB2aWV3IGFuZFxyXG4gICAqIHRyYW5zZmVyIHRoZW0gdG8gdGhlIGZpZWxkIC0gdGhlbiBoYW5kbGUgbmF2aWdhdGluZyBiYWNrIHRvIHRoZSBFZGl0IHZpZXcuXHJcbiAgICpcclxuICAgKiBUaGUgdGFyZ2V0IHZpZXcgbXVzdCBiZSB0aGUgY3VycmVudGx5IGFjdGl2ZSB2aWV3IGFuZCBtdXN0IGhhdmUgYSBzZWxlY3Rpb24gbW9kZWwuXHJcbiAgICpcclxuICAgKiBUaGUgdmFsdWVzIGFyZSBnYXRoZXJlZCBhbmQgcGFzc2VkIHRvIHtAbGluayAjc2V0U2VsZWN0aW9uIHNldFNlbGVjdGlvbn0sIGBSZVVJLmJhY2soKWAgaXNcclxuICAgKiBmaXJlZCBhbmQgbGFzdGx5IHtAbGluayAjX29uQ29tcGxldGUgX29uQ29tcGxldGV9IGlzIGNhbGxlZCBpbiBhIHNldFRpbWVvdXQgZHVlIHRvIGJpemFycmVcclxuICAgKiB0cmFuc2l0aW9uIGlzc3VlcywgbmFtZWx5IGluIElFLlxyXG4gICAqL1xyXG4gIGNvbXBsZXRlOiBmdW5jdGlvbiBjb21wbGV0ZSgpIHtcclxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC5nZXRQcmltYXJ5QWN0aXZlVmlldygpO1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uTW9kZWwgPSB2aWV3LmdldCgnc2VsZWN0aW9uTW9kZWwnKTtcclxuXHJcbiAgICBpZiAodmlldyAmJiBzZWxlY3Rpb25Nb2RlbCkge1xyXG4gICAgICBjb25zdCBzZWxlY3Rpb25zID0gc2VsZWN0aW9uTW9kZWwuZ2V0U2VsZWN0aW9ucygpO1xyXG4gICAgICBjb25zdCBzZWxlY3Rpb25Db3VudCA9IHNlbGVjdGlvbk1vZGVsLmdldFNlbGVjdGlvbkNvdW50KCk7XHJcbiAgICAgIGNvbnN0IHVubG9hZGVkU2VsZWN0aW9ucyA9IHZpZXcuZ2V0VW5sb2FkZWRTZWxlY3Rpb25zKCk7XHJcblxyXG4gICAgICBpZiAoc2VsZWN0aW9uQ291bnQgPT09IDAgJiYgdmlldy5vcHRpb25zLmFsbG93RW1wdHlTZWxlY3Rpb24pIHtcclxuICAgICAgICB0aGlzLmNsZWFyVmFsdWUodHJ1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0aGlzLnNpbmdsZVNlbGVjdCkge1xyXG4gICAgICAgIGZvciAoY29uc3Qgc2VsZWN0aW9uS2V5IGluIHNlbGVjdGlvbnMpIHtcclxuICAgICAgICAgIGlmIChzZWxlY3Rpb25zLmhhc093blByb3BlcnR5KHNlbGVjdGlvbktleSkpIHtcclxuICAgICAgICAgICAgY29uc3QgdmFsID0gc2VsZWN0aW9uc1tzZWxlY3Rpb25LZXldLmRhdGE7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9uKHZhbCwgc2VsZWN0aW9uS2V5KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmIChzZWxlY3Rpb25Db3VudCA+IDApIHtcclxuICAgICAgICAgIHRoaXMuc2V0U2VsZWN0aW9ucyhzZWxlY3Rpb25zLCB1bmxvYWRlZFNlbGVjdGlvbnMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5yZXVpLmJhY2soKTtcclxuXHJcbiAgICAgIC8vIGlmIHRoZSBldmVudCBpcyBmaXJlZCBiZWZvcmUgdGhlIHRyYW5zaXRpb24sIGFueSBYTUxIdHRwUmVxdWVzdCBjcmVhdGVkIGluIGFuIGV2ZW50IGhhbmRsZXIgYW5kXHJcbiAgICAgIC8vIGV4ZWN1dGluZyBkdXJpbmcgdGhlIHRyYW5zaXRpb24gY2FuIHBvdGVudGlhbGx5IGZhaWwgKHN0YXR1cyAwKS4gIHRoaXMgbWlnaHQgb25seSBiZSBhbiBpc3N1ZSB3aXRoIENPUlNcclxuICAgICAgLy8gcmVxdWVzdHMgY3JlYXRlZCBpbiB0aGlzIHN0YXRlICh0aGUgcHJlLWZsaWdodCByZXF1ZXN0IGlzIG1hZGUsIGFuZCB0aGUgcmVxdWVzdCBlbmRzIHdpdGggc3RhdHVzIDApLlxyXG4gICAgICAvLyB3cmFwcGluZyB0aGluZyBpbiBhIHRpbWVvdXQgYW5kIHBsYWNpbmcgYWZ0ZXIgdGhlIHRyYW5zaXRpb24gc3RhcnRzLCBtaXRpZ2F0ZXMgdGhpcyBpc3N1ZS5cclxuICAgICAgc2V0VGltZW91dCh0aGlzLl9vbkNvbXBsZXRlLmJpbmQodGhpcyksIDApO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRm9yY2VzIHtAbGluayAjb25DaGFuZ2Ugb25DaGFuZ2V9IHRvIGZpcmVcclxuICAgKi9cclxuICBfb25Db21wbGV0ZTogZnVuY3Rpb24gX29uQ29tcGxldGUoKSB7XHJcbiAgICB0aGlzLm9uQ2hhbmdlKHRoaXMuY3VycmVudFZhbHVlLCB0aGlzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgdGhlIGZpZWxkIGhhcyBiZWVuIGFsdGVyZWQgZnJvbSB0aGUgZGVmYXVsdC90ZW1wbGF0ZSB2YWx1ZS5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGlzRGlydHk6IGZ1bmN0aW9uIGlzRGlydHkoKSB7XHJcbiAgICBpZiAodGhpcy5vcmlnaW5hbFZhbHVlICYmIHRoaXMuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgIGlmICh0aGlzLm9yaWdpbmFsVmFsdWUua2V5ICE9PSB0aGlzLmN1cnJlbnRWYWx1ZS5rZXkpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHRoaXMub3JpZ2luYWxWYWx1ZS50ZXh0ICE9PSB0aGlzLmN1cnJlbnRWYWx1ZS50ZXh0KSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghdGhpcy5yZXF1aXJlU2VsZWN0aW9uICYmICF0aGlzLnRleHRUZW1wbGF0ZSkge1xyXG4gICAgICAgIGlmICh0aGlzLm9yaWdpbmFsVmFsdWUudGV4dCAhPT0gdGhpcy5nZXRUZXh0KCkpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9yaWdpbmFsVmFsdWUpIHtcclxuICAgICAgaWYgKCF0aGlzLnJlcXVpcmVTZWxlY3Rpb24gJiYgIXRoaXMudGV4dFRlbXBsYXRlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3JpZ2luYWxWYWx1ZS50ZXh0ICE9PSB0aGlzLmdldFRleHQoKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIXRoaXMucmVxdWlyZVNlbGVjdGlvbiAmJiAhdGhpcy50ZXh0VGVtcGxhdGUpIHtcclxuICAgICAgICBjb25zdCB0ZXh0ID0gdGhpcy5nZXRUZXh0KCk7XHJcbiAgICAgICAgaWYgKHRleHQgJiYgdGV4dC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gKHRoaXMub3JpZ2luYWxWYWx1ZSAhPT0gdGhpcy5jdXJyZW50VmFsdWUpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBzZWxlY3Rpb24gdGhhdCB3YXMgc2V0IGZyb20gdGhlIHRhcmdldCBsaXN0IHZpZXcuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fVxyXG4gICAqL1xyXG4gIGdldFNlbGVjdGlvbjogZnVuY3Rpb24gZ2V0U2VsZWN0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudFNlbGVjdGlvbjtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdmFsdWUgZWl0aGVyIGJ5IGV4dHJhY3RpbmcgdGhlIHZhbHVlS2V5UHJvcGVydHkgYW5kIHZhbHVlVGV4dFByb3BlcnR5IG9yXHJcbiAgICogc2V2ZXJhbCBvdGhlciBtZXRob2RzIG9mIGdldHRpbmcgaXQgdG8gdGhhdCBzdGF0ZS5cclxuICAgKiBAcmV0dXJuIHtPYmplY3QvU3RyaW5nfVxyXG4gICAqL1xyXG4gIGdldFZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcclxuICAgIGxldCB2YWx1ZSA9IG51bGw7XHJcbiAgICBjb25zdCB0ZXh0ID0gdGhpcy5nZXRUZXh0KCkgfHwgJyc7XHJcbiAgICAvLyBpZiB2YWx1ZUtleVByb3BlcnR5IG9yIHZhbHVlVGV4dFByb3BlcnR5IElTIE5PVCBFWFBMSUNJVExZIHNldCB0byBmYWxzZVxyXG4gICAgLy8gYW5kIElTIE5PVCBkZWZpbmVkIHVzZSBrZXlQcm9wZXJ0eSBvciB0ZXh0UHJvcGVydHkgaW4gaXRzIHBsYWNlLlxyXG4gICAgY29uc3Qga2V5UHJvcGVydHkgPSB0aGlzLnZhbHVlS2V5UHJvcGVydHkgIT09IGZhbHNlID8gdGhpcy52YWx1ZUtleVByb3BlcnR5IHx8IHRoaXMua2V5UHJvcGVydHkgOiBmYWxzZTtcclxuICAgIGNvbnN0IHRleHRQcm9wZXJ0eSA9IHRoaXMudmFsdWVUZXh0UHJvcGVydHkgIT09IGZhbHNlID8gdGhpcy52YWx1ZVRleHRQcm9wZXJ0eSB8fCB0aGlzLnRleHRQcm9wZXJ0eSA6IGZhbHNlO1xyXG5cclxuICAgIGlmIChrZXlQcm9wZXJ0eSB8fCB0ZXh0UHJvcGVydHkpIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgaWYgKGtleVByb3BlcnR5KSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHV0aWxpdHkuc2V0VmFsdWUodmFsdWUgfHwge30sIGtleVByb3BlcnR5LCB0aGlzLmN1cnJlbnRWYWx1ZS5rZXkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gaWYgYSB0ZXh0IHRlbXBsYXRlIGhhcyBiZWVuIGFwcGxpZWQgdGhlcmUgaXMgbm8gd2F5IHRvIGd1YXJhbnRlZSBhIGNvcnJlY3RcclxuICAgICAgICAvLyBtYXBwaW5nIGJhY2sgdG8gdGhlIHByb3BlcnR5XHJcbiAgICAgICAgaWYgKHRleHRQcm9wZXJ0eSAmJiAhdGhpcy50ZXh0VGVtcGxhdGUpIHtcclxuICAgICAgICAgIHZhbHVlID0gdXRpbGl0eS5zZXRWYWx1ZSh2YWx1ZSB8fCB7fSwgdGV4dFByb3BlcnR5LCB0aGlzLnJlcXVpcmVTZWxlY3Rpb24gPyB0aGlzLmN1cnJlbnRWYWx1ZS50ZXh0IDogdGV4dCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLnJlcXVpcmVTZWxlY3Rpb24pIHtcclxuICAgICAgICBpZiAoa2V5UHJvcGVydHkgJiYgdGV4dC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHV0aWxpdHkuc2V0VmFsdWUodmFsdWUgfHwge30sIGtleVByb3BlcnR5LCB0ZXh0KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGlmIGEgdGV4dCB0ZW1wbGF0ZSBoYXMgYmVlbiBhcHBsaWVkIHRoZXJlIGlzIG5vIHdheSB0byBndWFyYW50ZWUgYSBjb3JyZWN0XHJcbiAgICAgICAgLy8gbWFwcGluZyBiYWNrIHRvIHRoZSBwcm9wZXJ0eVxyXG4gICAgICAgIGlmICh0ZXh0UHJvcGVydHkgJiYgIXRoaXMudGV4dFRlbXBsYXRlICYmIHRleHQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgdmFsdWUgPSB1dGlsaXR5LnNldFZhbHVlKHZhbHVlIHx8IHt9LCB0ZXh0UHJvcGVydHksIHRleHQpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMuY3VycmVudFZhbHVlKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVxdWlyZVNlbGVjdGlvbikge1xyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmN1cnJlbnRWYWx1ZS5rZXkgPyB0aGlzLmN1cnJlbnRWYWx1ZS5rZXkgOiB0aGlzLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFsdWUgPSB0aGlzLmN1cnJlbnRWYWx1ZS50ZXh0ICE9PSB0ZXh0ICYmICF0aGlzLnRleHRUZW1wbGF0ZSA/IHRleHQgOiB0aGlzLmN1cnJlbnRWYWx1ZS5rZXk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2UgaWYgKCF0aGlzLnJlcXVpcmVTZWxlY3Rpb24gJiYgdGV4dC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgdmFsdWUgPSB0ZXh0O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSWYgdXNpbmcgYSBtdWx0aS1zZWxlY3QgZW5hYmxlZCBsb29rdXAgdGhlbiB0aGUgdmlldyB3aWxsIHJldHVybiBtdWx0aXBsZSBvYmplY3RzIGFzIHRoZSB2YWx1ZS5cclxuICAgKlxyXG4gICAqIFRoaXMgZnVuY3Rpb24gdGFrZXMgdGhhdCBhcnJheSBhbmQgcmV0dXJucyB0aGUgc2luZ2xlIHZhbHVlIHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIGB0aGlzLmN1cnJlbnRWYWx1ZWAuXHJcbiAgICpcclxuICAgKiBAdGVtcGxhdGVcclxuICAgKiBAcGFyYW0ge09iamVjdFtdfSB2YWx1ZXNcclxuICAgKiBAcmV0dXJuIHtPYmplY3QvU3RyaW5nfVxyXG4gICAqL1xyXG4gIGZvcm1hdFZhbHVlOiBmdW5jdGlvbiBmb3JtYXRWYWx1ZSh2YWx1ZXMpIHtcclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBJZiB1c2luZyBhIG11bHRpLXNlbGVjdCBlbmFibGVkIGxvb2t1cCB0aGlzIGZ1bmN0aW9uIHdpbGwgYmUgY2FsbGVkIGJ5IHtAbGluayAjY29tcGxldGUgY29tcGxldGV9XHJcbiAgICogaW4gdGhhdCB0aGUgdGFyZ2V0IHZpZXcgcmV0dXJuZWQgbXVsdGlwbGUgZW50cmllcy5cclxuICAgKlxyXG4gICAqIFNldHMgdGhlIGN1cnJlbnRWYWx1ZSB1c2luZyB7QGxpbmsgI2Zvcm1hdFZhbHVlIGZvcm1hdFZhbHVlfS5cclxuICAgKlxyXG4gICAqIFNldHMgdGhlIGRpc3BsYXllZCB0ZXh0IHVzaW5nIGB0aGlzLnRleHRSZW5kZXJlcmAuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdFtdfSB2YWx1ZXNcclxuICAgKiBAcGFyYW0ge09iamVjdFtdfSB1bmxvYWRlZFZhbHVlcyBvcHRpb24ucHJldmlvdXNTZWxlY3Rpb25zIHRoYXQgd2VyZSBub3QgbG9hZGVkIGJ5IHRoZSB2aWV3LlxyXG4gICAqL1xyXG4gIHNldFNlbGVjdGlvbnM6IGZ1bmN0aW9uIHNldFNlbGVjdGlvbnModmFsdWVzLCB1bmxvYWRlZFZhbHVlcykge1xyXG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSAodGhpcy5mb3JtYXRWYWx1ZSkgPyB0aGlzLmZvcm1hdFZhbHVlLmNhbGwodGhpcywgdmFsdWVzLCB1bmxvYWRlZFZhbHVlcykgOiB2YWx1ZXM7XHJcblxyXG4gICAgY29uc3QgdGV4dCA9ICh0aGlzLnRleHRSZW5kZXJlcikgPyB0aGlzLnRleHRSZW5kZXJlci5jYWxsKHRoaXMsIHZhbHVlcywgdW5sb2FkZWRWYWx1ZXMpIDogJyc7XHJcblxyXG4gICAgdGhpcy5zZXRUZXh0KHRleHQpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSWYgdXNpbmcgYSBzaW5nbGVTZWxlY3QgZW5hYmxlZCBsb29rdXAgdGhpcyBmdW5jdGlvbiB3aWxsIGJlIGNhbGxlZCBieSB7QGxpbmsgI2NvbXBsZXRlIGNvbXBsZXRlfVxyXG4gICAqIGFuZCB0aGUgc2luZ2xlIGVudHJ5J3MgZGF0YSBhbmQga2V5IHdpbGwgYmUgcGFzc2VkIHRvIHRoaXMgZnVuY3Rpb24uXHJcbiAgICpcclxuICAgKiBTZXRzIHRoZSBgdGhpcy5jdXJyZW50U2VsZWN0aW9uYCB0byB0aGUgcGFzc2VkIGRhdGEgKGVudGlyZSBlbnRyeSlcclxuICAgKlxyXG4gICAqIFNldHMgdGhlIGB0aGlzLmN1cnJlbnRWYWx1ZWAgdG8gdGhlIGV4dHJhY3Qga2V5L3RleHQgcHJvcGVydGllc1xyXG4gICAqXHJcbiAgICogQ2FsbHMge0BsaW5rICNzZXRUZXh0IHNldFRleHR9IHdpdGggdGhlIGV4dHJhY3RlZCB0ZXh0IHByb3BlcnR5LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbCBFbnRpcmUgc2VsZWN0aW9uIGVudHJ5XHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBkYXRhLWtleSBhdHRyaWJ1dGUgb2YgdGhlIHNlbGVjdGVkIHJvdyAodHlwaWNhbGx5ICRrZXkgZnJvbSBTRGF0YSlcclxuICAgKi9cclxuICBzZXRTZWxlY3Rpb246IGZ1bmN0aW9uIHNldFNlbGVjdGlvbih2YWwsIGtleSkge1xyXG4gICAgdGhpcy5jdXJyZW50U2VsZWN0aW9uID0gdmFsO1xyXG4gICAgaWYgKHZhbCA9PT0gbnVsbCB8fCB0eXBlb2YgdmFsID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcbiAgICBsZXQgdGV4dCA9IHV0aWxpdHkuZ2V0VmFsdWUodmFsLCB0aGlzLnRleHRQcm9wZXJ0eSk7XHJcbiAgICBjb25zdCBuZXdLZXkgPSB1dGlsaXR5LmdldFZhbHVlKHZhbCwgdGhpcy5rZXlQcm9wZXJ0eSwgdmFsKSB8fCBrZXk7IC8vIGlmIHdlIGNhbiBleHRyYWN0IHRoZSBrZXkgYXMgcmVxdWVzdGVkLCB1c2UgaXQgaW5zdGVhZCBvZiB0aGUgc2VsZWN0aW9uIGtleVxyXG5cclxuICAgIGlmICh0ZXh0ICYmIHRoaXMudGV4dFRlbXBsYXRlKSB7XHJcbiAgICAgIHRleHQgPSB0aGlzLnRleHRUZW1wbGF0ZS5hcHBseSh0ZXh0LCB0aGlzKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy50ZXh0UmVuZGVyZXIpIHtcclxuICAgICAgdGV4dCA9IHRoaXMudGV4dFJlbmRlcmVyLmNhbGwodGhpcywgdmFsLCBuZXdLZXksIHRleHQpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY3VycmVudFZhbHVlID0ge1xyXG4gICAgICBrZXk6IG5ld0tleSB8fCB0ZXh0LFxyXG4gICAgICB0ZXh0OiB0ZXh0IHx8IG5ld0tleSxcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy5zZXRUZXh0KHRoaXMuY3VycmVudFZhbHVlLnRleHQpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgZ2l2ZW4gdmFsdWUgdG8gYHRoaXMuY3VycmVudFZhbHVlYCB1c2luZyB0aGUgaW5pdGlhbCBmbGFnIGlmIHRvIHNldCBpdCBhc1xyXG4gICAqIGNsZWFuL3VubW9kaWZpZWQgb3IgZmFsc2UgZm9yIGRpcnR5LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0L1N0cmluZ30gdmFsIFZhbHVlIHRvIHNldFxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5pdGlhbCBEaXJ0eSBmbGFnICh0cnVlIGlzIGNsZWFuKVxyXG4gICAqL1xyXG4gIHNldFZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2YWwsIGluaXRpYWwpIHtcclxuICAgIC8vIGlmIHZhbHVlS2V5UHJvcGVydHkgb3IgdmFsdWVUZXh0UHJvcGVydHkgSVMgTk9UIEVYUExJQ0lUTFkgc2V0IHRvIGZhbHNlXHJcbiAgICAvLyBhbmQgSVMgTk9UIGRlZmluZWQgdXNlIGtleVByb3BlcnR5IG9yIHRleHRQcm9wZXJ0eSBpbiBpdHMgcGxhY2UuXHJcbiAgICBjb25zdCBrZXlQcm9wZXJ0eSA9IHRoaXMudmFsdWVLZXlQcm9wZXJ0eSAhPT0gZmFsc2UgPyB0aGlzLnZhbHVlS2V5UHJvcGVydHkgfHwgdGhpcy5rZXlQcm9wZXJ0eSA6IGZhbHNlO1xyXG4gICAgY29uc3QgdGV4dFByb3BlcnR5ID0gdGhpcy52YWx1ZVRleHRQcm9wZXJ0eSAhPT0gZmFsc2UgPyB0aGlzLnZhbHVlVGV4dFByb3BlcnR5IHx8IHRoaXMudGV4dFByb3BlcnR5IDogZmFsc2U7XHJcbiAgICBsZXQga2V5O1xyXG4gICAgbGV0IHRleHQ7XHJcblxyXG4gICAgaWYgKHR5cGVvZiB2YWwgPT09ICd1bmRlZmluZWQnIHx8IHZhbCA9PT0gbnVsbCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IGZhbHNlO1xyXG4gICAgICBpZiAoaW5pdGlhbCkge1xyXG4gICAgICAgIHRoaXMub3JpZ2luYWxWYWx1ZSA9IHRoaXMuY3VycmVudFZhbHVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnNldFRleHQodGhpcy5yZXF1aXJlU2VsZWN0aW9uID8gdGhpcy5lbXB0eVRleHQgOiAnJyk7XHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoa2V5UHJvcGVydHkgfHwgdGV4dFByb3BlcnR5KSB7XHJcbiAgICAgIGlmIChrZXlQcm9wZXJ0eSkge1xyXG4gICAgICAgIGtleSA9IHV0aWxpdHkuZ2V0VmFsdWUodmFsLCBrZXlQcm9wZXJ0eSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0ZXh0UHJvcGVydHkpIHtcclxuICAgICAgICB0ZXh0ID0gdXRpbGl0eS5nZXRWYWx1ZSh2YWwsIHRleHRQcm9wZXJ0eSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICh0ZXh0ICYmIHRoaXMudGV4dFRlbXBsYXRlKSB7XHJcbiAgICAgICAgdGV4dCA9IHRoaXMudGV4dFRlbXBsYXRlLmFwcGx5KHRleHQsIHRoaXMpO1xyXG4gICAgICB9IGVsc2UgaWYgKHRoaXMudGV4dFJlbmRlcmVyKSB7XHJcbiAgICAgICAgdGV4dCA9IHRoaXMudGV4dFJlbmRlcmVyLmNhbGwodGhpcywgdmFsLCBrZXksIHRleHQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoa2V5IHx8IHRleHQpIHtcclxuICAgICAgICB0aGlzLmN1cnJlbnRWYWx1ZSA9IHtcclxuICAgICAgICAgIGtleToga2V5IHx8IHRleHQsXHJcbiAgICAgICAgICB0ZXh0OiB0ZXh0IHx8IGtleSxcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoaW5pdGlhbCkge1xyXG4gICAgICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy5jdXJyZW50VmFsdWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnNldFRleHQodGhpcy5jdXJyZW50VmFsdWUudGV4dCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYgKGluaXRpYWwpIHtcclxuICAgICAgICAgIHRoaXMub3JpZ2luYWxWYWx1ZSA9IHRoaXMuY3VycmVudFZhbHVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zZXRUZXh0KHRoaXMucmVxdWlyZVNlbGVjdGlvbiA/IHRoaXMuZW1wdHlUZXh0IDogJycpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBrZXkgPSB2YWw7XHJcbiAgICAgIHRleHQgPSB2YWw7XHJcblxyXG4gICAgICBpZiAodGV4dCAmJiB0aGlzLnRleHRUZW1wbGF0ZSkge1xyXG4gICAgICAgIHRleHQgPSB0aGlzLnRleHRUZW1wbGF0ZS5hcHBseSh0ZXh0LCB0aGlzKTtcclxuICAgICAgfSBlbHNlIGlmICh0aGlzLnRleHRSZW5kZXJlcikge1xyXG4gICAgICAgIHRleHQgPSB0aGlzLnRleHRSZW5kZXJlci5jYWxsKHRoaXMsIHZhbCwga2V5LCB0ZXh0KTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jdXJyZW50VmFsdWUgPSB7XHJcbiAgICAgICAga2V5OiBrZXkgfHwgdGV4dCxcclxuICAgICAgICB0ZXh0OiB0ZXh0IHx8IGtleSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGlmIChpbml0aWFsKSB7XHJcbiAgICAgICAgdGhpcy5vcmlnaW5hbFZhbHVlID0gdGhpcy5jdXJyZW50VmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuc2V0VGV4dCh0ZXh0KTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENsZWFycyB0aGUgdmFsdWUgYnkgc2V0dGluZyBudWxsICh3aGljaCB0cmlnZ2VycyB1c2FnZSBvZiBgdGhpcy5lbXB0eVRleHRgLlxyXG4gICAqXHJcbiAgICogRmxhZyBpcyB1c2VkIHRvIGluZGljYXRlIGlmIHRvIHNldCBudWxsIGFzIHRoZSBpbml0aWFsIHZhbHVlICh1bm1vZGlmaWVkKSBvciBub3QuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGZsYWdcclxuICAgKi9cclxuICBjbGVhclZhbHVlOiBmdW5jdGlvbiBjbGVhclZhbHVlKGZsYWcpIHtcclxuICAgIGNvbnN0IGluaXRpYWwgPSBmbGFnICE9PSB0cnVlO1xyXG4gICAgdGhpcy5zZXRTZWxlY3Rpb24obnVsbCk7XHJcbiAgICB0aGlzLnNldFZhbHVlKG51bGwsIGluaXRpYWwpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgRmllbGRNYW5hZ2VyLnJlZ2lzdGVyKCdsb29rdXAnLCBjb250cm9sKTtcclxuIl19