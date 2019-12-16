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