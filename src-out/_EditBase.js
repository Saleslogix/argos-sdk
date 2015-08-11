define('argos/_EditBase', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/connect', 'dojo/_base/array', 'dojo/_base/Deferred', 'dojo/_base/window', 'dojo/dom-attr', 'dojo/dom-class', 'dojo/dom', 'dojo/dom-construct', 'dojo/query', './Utility', './ErrorManager', './FieldManager', './View', 'dojo/NodeList-manipulate', './Fields/BooleanField', './Fields/DateField', './Fields/DecimalField', './Fields/DurationField', './Fields/HiddenField', './Fields/LookupField', './Fields/NoteField', './Fields/PhoneField', './Fields/SelectField', './Fields/SignatureField', './Fields/TextAreaField', './Fields/TextField'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseConnect, _dojo_baseArray, _dojo_baseDeferred, _dojo_baseWindow, _dojoDomAttr, _dojoDomClass, _dojoDom, _dojoDomConstruct, _dojoQuery, _Utility, _ErrorManager, _FieldManager, _View, _dojoNodeListManipulate, _FieldsBooleanField, _FieldsDateField, _FieldsDecimalField, _FieldsDurationField, _FieldsHiddenField, _FieldsLookupField, _FieldsNoteField, _FieldsPhoneField, _FieldsSelectField, _FieldsSignatureField, _FieldsTextAreaField, _FieldsTextField) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _connect = _interopRequireDefault(_dojo_baseConnect);

  var _array = _interopRequireDefault(_dojo_baseArray);

  var _Deferred = _interopRequireDefault(_dojo_baseDeferred);

  var _win = _interopRequireDefault(_dojo_baseWindow);

  var _domAttr = _interopRequireDefault(_dojoDomAttr);

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _dom = _interopRequireDefault(_dojoDom);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _query = _interopRequireDefault(_dojoQuery);

  var _utility = _interopRequireDefault(_Utility);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _View2 = _interopRequireDefault(_View);

  /**
   * @class argos._EditBase
   * An Edit View is a dual purpose view - used for both Creating and Updating records. It is comprised
   * of a layout similar to Detail rows but are instead Edit fields.
   *
   * A unique part of the Edit view is it's lifecycle in comparison to Detail. The Detail view is torn
   * down and rebuilt with every record. With Edit the form is emptied (HTML left in-tact) and new values
   * are applied to the fields.
   *
   * Since Edit Views are typically the "last" view (you always come from a List or Detail view) it warrants
   * special attention to the navigation options that are passed, as they greatly control how the Edit view
   * functions and operates.
   *
   * @alternateClassName _EditBase
   * @extends argos.View
   * @requires argos.Utility
   * @requires argos.Fields.ErrorManager
   * @requires argos.Fields.FieldManager
   * @requires argos.Fields.BooleanField
   * @requires argos.Fields.DecimalField
   * @requires argos.Fields.DurationField
   * @requires argos.Fields.HiddenField
   * @requires argos.Fields.LookupField
   * @requires argos.Fields.NoteField
   * @requires argos.Fields.PhoneField
   * @requires argos.Fields.SelectField
   * @requires argos.Fields.SignatureField
   * @requires argos.Fields.TextAreaField
   * @requires argos.Fields.TextField
   */
  var __class = (0, _declare['default'])('argos._EditBase', [_View2['default']], {
    /**
     * @property {Object}
     * Creates a setter map to html nodes, namely:
     *
     * * validationContent => validationContentNode's innerHTML
     *
     */
    attributeMap: {
      validationContent: {
        node: 'validationContentNode',
        type: 'innerHTML'
      },
      concurrencyContent: {
        node: 'concurrencyContentNode',
        type: 'innerHTML'
      }
    },
    /**
     * @property {Simplate}
     * The template used to render the view's main DOM element when the view is initialized.
     * This template includes loadingTemplate and validationSummaryTemplate.
     *
     * The default template uses the following properties:
     *
     *      name                description
     *      ----------------------------------------------------------------
     *      id                   main container div id
     *      title                main container div title attr
     *      cls                  additional class string added to the main container div
     *      resourceKind         set to data-resource-kind
     *
     */
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" title="{%: $.titleText %}" class="edit panel {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>', '{%! $.loadingTemplate %}', '{%! $.validationSummaryTemplate %}', '{%! $.concurrencySummaryTemplate %}', '<div class="panel-content" data-dojo-attach-point="contentNode"></div>', '</div>']),
    /**
     * @property {Simplate}
     * HTML shown when data is being loaded.
     *
     * `$` => the view instance
     */
    loadingTemplate: new Simplate(['<fieldset class="panel-loading-indicator">', '<div class="row"><span class="fa fa-spinner fa-spin"></span><div>{%: $.loadingText %}</div></div>', '</fieldset>']),
    /**
     * @property {Simplate}
     * HTML for the validation summary area, this div is shown/hidden as needed.
     *
     * `$` => the view instance
     */
    validationSummaryTemplate: new Simplate(['<div class="panel-validation-summary">', '<h2>{%: $.validationSummaryText %}</h2>', '<ul data-dojo-attach-point="validationContentNode">', '</ul>', '</div>']),
    /**
     * @property {Simplate}
     * HTML for the concurrency error area, this div is shown/hidden as needed.
     *
     * `$` => the view instance
     */
    concurrencySummaryTemplate: new Simplate(['<div class="panel-concurrency-summary">', '<h2>{%: $.concurrencySummaryText %}</h2>', '<ul data-dojo-attach-point="concurrencyContentNode">', '</ul>', '</div>']),
    /**
     * @property {Simplate}
     * HTML shown when data is being loaded.
     *
     * * `$` => validation error object
     * * `$$` => field instance that the error is on
     */
    validationSummaryItemTemplate: new Simplate(['<li>', '<a href="#{%= $.name %}">', '<h3>{%: $.message %}</h3>', '<h4>{%: $$.label %}</h4>', '</a>', '</li>']),
    /**
     * @property {Simplate}
     * * `$` => validation error object
     */
    concurrencySummaryItemTemplate: new Simplate(['<li>', '<h3>{%: $.message %}</h3>', '<h4>{%: $.name %}</h4>', '</li>']),
    /**
     * @property {Simplate}
     * HTML that starts a new section including the collapsible header
     *
     * `$` => the view instance
     */
    sectionBeginTemplate: new Simplate(['<h2 data-action="toggleSection" class="{% if ($.collapsed || $.options.collapsed) { %}collapsed{% } %}">', '<button class="{% if ($.collapsed) { %}{%: $$.toggleExpandClass %}{% } else { %}{%: $$.toggleCollapseClass %}{% } %}" aria-label="{%: $$.toggleCollapseText %}"></button>', '{%: ($.title || $.options.title) %}', '</h2>', '<fieldset class="{%= ($.cls || $.options.cls) %}">']),
    /**
     * @property {Simplate}
     * HTML that ends a section
     *
     * `$` => the view instance
     */
    sectionEndTemplate: new Simplate(['</fieldset>']),
    /**
     * @property {Simplate}
     * HTML created for each property (field row).
     *
     * * `$` => the field row object defined in {@link #createLayout createLayout}.
     * * `$$` => the view instance
     */
    propertyTemplate: new Simplate(['<a name="{%= $.name || $.property %}"></a>', '<div class="row row-edit {%= $.cls %}{% if ($.readonly) { %}row-readonly{% } %}" data-field="{%= $.name || $.property %}" data-field-type="{%= $.type %}">', '</div>']),

    /**
     * @cfg {String}
     * The unique identifier of the view
     */
    id: 'generic_edit',
    store: null,
    /**
     * @property {Object}
     * The layout definition that constructs the detail view with sections and rows
     */
    layout: null,
    /**
     * @cfg {Boolean}
     * Enables the use of the customization engine on this view instance
     */
    enableCustomizations: true,
    /**
     * @property {String}
     * The customization identifier for this class. When a customization is registered it is passed
     * a path/identifier which is then matched to this property.
     */
    customizationSet: 'edit',
    /**
     * @cfg {Boolean}
     * Controls if the view should be exposed
     */
    expose: false,
    /**
     * @cfg {String/Object}
     * May be used for verifying the view is accessible for creating entries
     */
    insertSecurity: false,
    /**
     * @cfg {String/Object}
     * May be used for verifying the view is accessible for editing entries
     */
    updateSecurity: false,

    /**
     * @deprecated
     */
    saveText: 'Save',
    /**
     * @cfg {String}
     * Default title text shown in the top toolbar
     */
    titleText: 'Edit',
    /**
     * @cfg {String}
     * The text placed in the header when there are validation errors
     */
    validationSummaryText: 'Validation Summary',
    /**
     * @cfg {String}
     * The text placed in the header when there are validation errors
     */
    concurrencySummaryText: 'Concurrency Error(s)',
    /**
     * @property {String}
     * Default text used in the section header
     */
    detailsText: 'Details',
    /**
     * @property {String}
     * Text shown while the view is loading.
     */
    loadingText: 'loading...',
    /**
     * @property {Object}
     * Localized error messages. One general error message, and messages by HTTP status code.
     */
    errorText: {
      general: 'A server error occured while requesting data.',
      status: {
        '410': 'Error saving. This record no longer exists.'
      }
    },
    /**
     * @property {String}
     * Text alerted to user when the data has been updated since they last fetched the data.
     */
    concurrencyErrorText: 'Another user has updated this field.',
    /**
     * @property {String}
     * ARIA label text for a collapsible section header
     */
    toggleCollapseText: 'toggle collapse',
    /**
     * @property {String}
     * CSS class for the collapse button when in a expanded state
     */
    toggleCollapseClass: 'fa fa-chevron-down',
    /**
     * @property {String}
     * CSS class for the collapse button when in a collapsed state
     */
    toggleExpandClass: 'fa fa-chevron-right',
    /**
     * @property {Object}
     * Collection of the fields in the layout where the key is the `name` of the field.
     */
    fields: null,
    /**
     * @property {Object}
     * The saved data response.
     */
    entry: null,
    /**
     * @property {Boolean}
     * Flags if the view is in "insert" (create) mode, or if it is in "update" (edit) mode.
     */
    inserting: null,

    _focusField: null,
    _hasFocused: false,

    /**
     * Extends constructor to initialze `this.fields` to {}
     * @param o
     */
    constructor: function constructor() {
      this.fields = {};
    },
    /**
     * When the app is started this fires, the Edit view renders its layout immediately, then
     * renders each field instance.
     *
     * On refresh it will clear the values, but leave the layout intact.
     *
     */
    startup: function startup() {
      this.inherited(arguments);
      this.processLayout(this._createCustomizedLayout(this.createLayout()));

      (0, _query['default'])('div[data-field]', this.contentNode).forEach(function forEach(node) {
        var name = _domAttr['default'].get(node, 'data-field');
        var field = this.fields[name];
        if (field) {
          field.renderTo(node);
        }
      }, this);
    },
    /**
     * Extends init to also init the fields in `this.fields`.
     */
    init: function init() {
      this.inherited(arguments);

      for (var _name in this.fields) {
        if (this.fields.hasOwnProperty(_name)) {
          this.fields[_name].init();
        }
      }
    },
    /**
     * Sets and returns the toolbar item layout definition, this method should be overriden in the view
     * so that you may define the views toolbar items.
     *
     * By default it adds a save button bound to `this.save()` and cancel that fires `ReUI.back()`
     *
     * @return {Object} this.tools
     * @template
     */
    createToolLayout: function createToolLayout() {
      var tbar = [{
        id: 'save',
        action: 'save',
        cls: 'fa fa-save fa-fw fa-lg',
        security: this.options && this.options.insert ? this.insertSecurity : this.updateSecurity
      }];

      if (!App.isOnFirstView()) {
        tbar.push({
          id: 'cancel',
          cls: 'fa fa-ban fa-fw fa-lg',
          side: 'left',
          action: 'onToolCancel'
        });
      }

      return this.tools || (this.tools = {
        'tbar': tbar
      });
    },
    onToolCancel: function createToolLayout() {
      this.refreshRequired = true;
      ReUI.back();
    },
    _getStoreAttr: function _getStoreAttr() {
      return this.store || (this.store = this.createStore());
    },
    /**
     * Toggles the collapsed state of the section.
     */
    toggleSection: function toggleSection(params) {
      var node = _dom['default'].byId(params.$source);
      if (node) {
        _domClass['default'].toggle(node, 'collapsed');
        var button = (0, _query['default'])('button', node)[0];
        if (button) {
          _domClass['default'].toggle(button, this.toggleCollapseClass);
          _domClass['default'].toggle(button, this.toggleExpandClass);
        }
      }
    },
    /**
     * Handler for a fields on show event.
     *
     * Removes the row-hidden css class.
     *
     * @param {_Field} field Field instance that is being shown
     */
    _onShowField: function _onShowField(field) {
      _domClass['default'].remove(field.containerNode, 'row-hidden');
    },
    /**
     * Handler for a fields on hide event.
     *
     * Adds the row-hidden css class.
     *
     * @param {_Field} field Field instance that is being hidden
     */
    _onHideField: function _onHideField(field) {
      _domClass['default'].add(field.containerNode, 'row-hidden');
    },
    /**
     * Handler for a fields on enable event.
     *
     * Removes the row-disabled css class.
     *
     * @param {_Field} field Field instance that is being enabled
     */
    _onEnableField: function _onEnableField(field) {
      _domClass['default'].remove(field.containerNode, 'row-disabled');
    },
    /**
     * Handler for a fields on disable event.
     *
     * Adds the row-disabled css class.
     *
     * @param {_Field} field Field instance that is being disabled
     */
    _onDisableField: function _onDisableField(field) {
      _domClass['default'].add(field.containerNode, 'row-disabled');
    },
    /**
     * Extends invokeAction to first look for the specified function name on the field instance
     * first before passing it to the view.
     * @param {String} name Name of the function to invoke
     * @param {Object} parameters Parameters of the function to be passed
     * @param {Event} evt The original click/tap event
     * @param {HTMLElement} node The node that initiated the event
     * @return {Function} Either calls the fields action or returns the inherited version which looks at the view for the action
     */
    invokeAction: function invokeAction(name, parameters, evt, node) {
      var fieldNode = node && (0, _query['default'])(node, this.contentNode).parents('[data-field]');
      var field = this.fields[fieldNode.length > 0 && _domAttr['default'].get(fieldNode[0], 'data-field')];

      if (field && typeof field[name] === 'function') {
        return field[name].apply(field, [parameters, evt, node]);
      }

      return this.inherited(arguments);
    },
    /**
     * Determines if a field has defined on it the supplied name as a function
     * @param {String} name Name of the function to test for
     * @param {Event} evt The original click/tap event
     * @param {HTMLElement} node The node that initiated the event
     * @return {Boolean} If the field has the named function defined
     */
    hasAction: function hasAction(name, evt, node) {
      var fieldNode = node && (0, _query['default'])(node, this.contentNode).parents('[data-field]');
      var field = fieldNode && this.fields[fieldNode.length > 0 && _domAttr['default'].get(fieldNode[0], 'data-field')];

      if (field && typeof field[name] === 'function') {
        return true;
      }

      return this.inherited(arguments);
    },
    createStore: function createStore() {
      return null;
    },
    onContentChange: function onContentChange() {},
    processEntry: function processEntry(entry) {
      return entry;
    },
    /**
     * Pre-processes the entry before processEntry runs.
     * @param {Object} entry data
     * @return {Object} entry with actual Date objects
     */
    convertEntry: function convertEntry(entry) {
      return entry;
    },
    processData: function processData(entry) {
      this.entry = this.processEntry(this.convertEntry(entry || {})) || {};

      this.setValues(entry, true);

      // Re-apply changes saved from concurrency/precondition failure
      if (this.previousValuesAll) {
        // Make a copy of the current values, so we can diff them
        var currentValues = this.getValues(true);
        var diffs = this.diffs(this.previousValuesAll, currentValues);

        if (diffs.length > 0) {
          _array['default'].forEach(diffs, function forEach(val) {
            this.errors.push({
              name: val,
              message: this.concurrencyErrorText
            });
          }, this);

          this.showConcurrencySummary();
        } else {
          // No diffs found, attempt to re-save
          this.save();
        }

        this.previousValuesAll = null;
      }

      // Re-apply any passed changes as they may have been overwritten
      if (this.options.changes) {
        this.changes = this.options.changes;
        this.setValues(this.changes);
      }
    },
    _onGetComplete: function _onGetComplete(entry) {
      try {
        if (entry) {
          this.processData(entry);
        } else {}

        _domClass['default'].remove(this.domNode, 'panel-loading');

        /* this must take place when the content is visible */
        this.onContentChange();
      } catch (e) {
        console.error(e); // eslint-disable-line
      }
    },
    _onGetError: function _onGetError(getOptions, error) {
      this.handleError(error);
      _domClass['default'].remove(this.domNode, 'panel-loading');
    },
    /**
     * Sets and returns the Edit view layout by following a standard for section and field:
     *
     * The `this.layout` itself is an array of section objects where a section object is defined as such:
     *
     *     {
     *        name: 'String', // Required. unique name for identification/customization purposes
     *        title: 'String', // Required. Text shown in the section header
     *        children: [], // Array of child row objects
     *     }
     *
     * A child row object has:
     *
     *     {
     *        name: 'String', // Required. unique name for identification/customization purposes
     *        property: 'String', // Optional. The property of the current entity to bind to
     *        label: 'String', // Optional. Text shown in the label to the left of the property
     *        type: 'String', // Required. The field type as registered with the FieldManager.
     *        // Examples of type: 'text', 'decimal', 'date', 'lookup', 'select', 'duration'
     *        'default': value // Optional. If defined the value will be set as the default "unmodified" value (not dirty).
     *     }
     *
     * All further properties are set by their respective type, please see the individual field for
     * its configurable options.
     *
     * @return {Object[]} Edit layout definition
     */
    createLayout: function createLayout() {
      return this.layout || [];
    },

    createErrorHandlers: function createErrorHandlers() {
      this.errorHandlers = this.errorHandlers || [{
        name: 'PreCondition',
        test: function testPreCondition(error) {
          return error && error.status === this.HTTP_STATUS.PRECONDITION_FAILED;
        },
        handle: function handlePreCondition(error, next) {
          next(); // Invoke the next error handler first, the refresh will change a lot of mutable/shared state

          // Preserve our current form values (all of them),
          // and reload the view to fetch the new data.
          this.previousValuesAll = this.getValues(true);
          this.options.key = this.entry.$key; // Force a fetch by key
          delete this.options.entry; // Remove this, or the form will load the entry that came from the detail view
          this.refresh();
        }
      }, {
        name: 'AlertError',
        test: function testAlert(error) {
          return error.status !== this.HTTP_STATUS.PRECONDITION_FAILED;
        },
        handle: function handleAlert(error, next) {
          alert(this.getErrorMessage(error)); // eslint-disable-line
          next();
        }
      }, {
        name: 'CatchAll',
        test: function testCatchAll() {
          return true;
        },
        handle: function handleCatchAll(error, next) {
          var errorItem = {
            viewOptions: this.options,
            serverError: error
          };

          _ErrorManager2['default'].addError(this.getErrorMessage(error), errorItem);
          next();
        }
      }];

      return this.errorHandlers;
    },
    /**
     *
     * Returns the view key
     * @return {String} View key
     */
    getTag: function getTag() {
      var tag = this.options && this.options.entry && this.options.entry[this.idProperty];
      if (!tag) {
        tag = this.options && this.options.key;
      }

      return tag;
    },
    processLayout: function processLayout(layout) {
      var rows = layout.children || layout.as || layout;
      var sectionQueue = [];
      var content = [];
      var sectionStarted = false;
      var current = undefined;

      if (!layout.options) {
        layout.options = {
          title: this.detailsText
        };
      }

      for (var i = 0; i < rows.length; i++) {
        current = rows[i];

        if (current.children || current.as) {
          if (sectionStarted) {
            sectionQueue.push(current);
          } else {
            this.processLayout(current);
          }

          continue;
        }

        if (!sectionStarted) {
          sectionStarted = true;
          content.push(this.sectionBeginTemplate.apply(layout, this));
        }

        this.createRowContent(current, content);
      }

      content.push(this.sectionEndTemplate.apply(layout, this));
      var sectionNode = _domConstruct['default'].toDom(content.join(''));
      this.onApplySectionNode(sectionNode, current);
      _domConstruct['default'].place(sectionNode, this.contentNode, 'last');

      for (var i = 0; i < sectionQueue.length; i++) {
        current = sectionQueue[i];

        this.processLayout(current);
      }
    },
    onApplySectionNode: function onApplySectionNode() {},
    createRowContent: function createRowContent(layout, content) {
      var Ctor = _FieldManager2['default'].get(layout.type);
      if (Ctor) {
        var field = this.fields[layout.name || layout.property] = new Ctor(_lang['default'].mixin({
          owner: this
        }, layout));

        var template = field.propertyTemplate || this.propertyTemplate;

        if (field.autoFocus && !this._focusField) {
          this._focusField = field;
        } else if (field.autoFocus && this._focusField) {
          throw new Error('Only one field can have autoFocus set to true in the Edit layout.');
        }

        this.connect(field, 'onShow', this._onShowField);
        this.connect(field, 'onHide', this._onHideField);
        this.connect(field, 'onEnable', this._onEnableField);
        this.connect(field, 'onDisable', this._onDisableField);

        content.push(template.apply(field, this));
      }
    },
    /**
     * Initiates the request.
     */
    requestData: function requestData() {
      var store = this.get('store');

      if (store) {
        var getOptions = {};

        this._applyStateToGetOptions(getOptions);

        var getExpression = this._buildGetExpression() || null;
        var getResults = store.get(getExpression, getOptions);

        _Deferred['default'].when(getResults, this._onGetComplete.bind(this), this._onGetError.bind(this, getOptions));

        return getResults;
      }

      console.warn('Error requesting data, no store was defined. Did you mean to mixin _SDataEditMixin to your edit view?'); // eslint-disable-line
    },
    /**
     * Loops all the fields looking for any with the `default` property set, if set apply that
     * value as the initial value of the field. If the value is a function, its expanded then applied.
     */
    applyFieldDefaults: function applyFieldDefaults() {
      for (var _name2 in this.fields) {
        if (this.fields.hasOwnProperty(_name2)) {
          var field = this.fields[_name2];
          var defaultValue = field['default'];

          if (typeof defaultValue === 'undefined') {
            continue;
          }

          field.setValue(this.expandExpression(defaultValue, field));
        }
      }
    },
    /**
     * Loops all fields and calls its `clearValue()`.
     */
    clearValues: function clearValues() {
      for (var _name3 in this.fields) {
        if (this.fields.hasOwnProperty(_name3)) {
          this.fields[_name3].clearHighlight();
          this.fields[_name3].clearValue();
        }
      }
    },
    /**
     * Sets the given values by looping the fields and checking if the field property matches
     * a key in the passed values object (after considering a fields `applyTo`).
     *
     * The value set is then passed the initial state, true for default/unmodified/clean and false
     * for dirty or altered.
     *
     * @param {Object} values data entry, or collection of key/values where key matches a fields property attribute
     * @param {Boolean} initial Initial state of the value, true for clean, false for dirty
     */
    setValues: function setValues(values, initial) {
      var noValue = {};

      for (var _name4 in this.fields) {
        if (this.fields.hasOwnProperty(_name4)) {
          var field = this.fields[_name4];
          var value = undefined;
          // for now, explicitly hidden fields (via. the field.hide() method) are not included
          if (field.isHidden()) {
            continue;
          }

          if (field.applyTo !== false) {
            value = _utility['default'].getValue(values, field.applyTo, noValue);
          } else {
            value = _utility['default'].getValue(values, field.property || _name4, noValue);
          }

          // fyi: uses the fact that ({} !== {})
          if (value !== noValue) {
            field.setValue(value, initial);
          }
        }
      }
    },
    /**
     * Retrieves the value from every field, skipping the ones excluded, and merges them into a
     * single payload with the key being the fields `property` attribute, taking into consideration `applyTo` if defined.
     *
     * If all is passed as true, it also grabs hidden and unmodified (clean) values.
     *
     * @param {Boolean} all True to also include hidden and unmodified values.
     * @return {Object} A single object payload with all the values.
     */
    getValues: function getValues(all) {
      var payload = {};
      var empty = true;

      for (var _name5 in this.fields) {
        if (this.fields.hasOwnProperty(_name5)) {
          var field = this.fields[_name5];
          var value = field.getValue();

          var include = this.expandExpression(field.include, value, field, this);
          var exclude = this.expandExpression(field.exclude, value, field, this);

          /**
           * include:
           *   true: always include value
           *   false: always exclude value
           * exclude:
           *   true: always exclude value
           *   false: default handling
           */
          if (include !== undefined && !include) {
            continue;
          }
          if (exclude !== undefined && exclude) {
            continue;
          }

          // for now, explicitly hidden fields (via. the field.hide() method) are not included
          if (all || (field.alwaysUseValue || field.isDirty() || include) && !field.isHidden()) {
            if (field.applyTo !== false) {
              if (typeof field.applyTo === 'function') {
                if (typeof value === 'object') {
                  // Copy the value properties into our payload object
                  for (var prop in value) {
                    if (value.hasOwnProperty(prop)) {
                      payload[prop] = value[prop];
                    }
                  }
                }

                field.applyTo(payload, value);
              } else if (typeof field.applyTo === 'string') {
                var target = _utility['default'].getValue(payload, field.applyTo);
                _lang['default'].mixin(target, value);
              }
            } else {
              _utility['default'].setValue(payload, field.property || _name5, value);
            }

            empty = false;
          }
        }
      }
      return empty ? false : payload;
    },
    /**
     * Loops and gathers the validation errors returned from each field and adds them to the
     * validation summary area. If no errors, removes the validation summary.
     * @return {Boolean/Object[]} Returns the array of errors if present or false for no errors.
     */
    validate: function validate() {
      this.errors = [];

      for (var _name6 in this.fields) {
        if (this.fields.hasOwnProperty(_name6)) {
          var field = this.fields[_name6];

          var result = field.validate();
          if (!field.isHidden() && result !== false) {
            _domClass['default'].add(field.containerNode, 'row-error');

            this.errors.push({
              name: _name6,
              message: result
            });
          } else {
            _domClass['default'].remove(field.containerNode, 'row-error');
          }
        }
      }

      return this.errors.length > 0 ? this.errors : false;
    },
    /**
     * Determines if the form is currently busy/disabled
     * @return {Boolean}
     */
    isFormDisabled: function isFormDisabled() {
      return this.busy;
    },
    /**
     * Disables the form by setting busy to true and disabling the toolbar.
     */
    disable: function disable() {
      this.busy = true;

      if (App.bars.tbar) {
        App.bars.tbar.disableTool('save');
      }

      _domClass['default'].add(_win['default'].body(), 'busy');
    },
    /**
     * Enables the form by setting busy to false and enabling the toolbar
     */
    enable: function enable() {
      this.busy = false;

      if (App.bars.tbar) {
        App.bars.tbar.enableTool('save');
      }

      _domClass['default'].remove(_win['default'].body(), 'busy');
    },
    /**
     * Called by save() when performing an insert (create).
     * Gathers the values, creates the payload for insert, creates the sdata request and
     * calls `create`.
     */
    insert: function insert() {
      this.disable();

      var values = this.getValues();
      if (values) {
        this.onInsert(values);
      } else {
        ReUI.back();
      }
    },
    onInsert: function onInsert(values) {
      var store = this.get('store');
      if (store) {
        var addOptions = {
          overwrite: false
        };
        var entry = this.createEntryForInsert(values);

        this._applyStateToAddOptions(addOptions);

        _Deferred['default'].when(store.add(entry, addOptions), this.onAddComplete.bind(this, entry), this.onAddError.bind(this, addOptions));
      }
    },
    _applyStateToAddOptions: function _applyStateToAddOptions() {},
    onAddComplete: function onAddComplete(entry, result) {
      this.enable();

      var message = this._buildRefreshMessage(entry, result);
      _connect['default'].publish('/app/refresh', [message]);

      this.onInsertCompleted(result);
    },
    onAddError: function onAddError(addOptions, error) {
      this.handleError(error);
      this.enable();
    },
    /**
     * Handler for insert complete, checks for `this.options.returnTo` else it simply goes back.
     * @param entry
     */
    onInsertCompleted: function onInsertCompleted() {
      if (this.options && this.options.returnTo) {
        var returnTo = this.options.returnTo;
        var view = App.getView(returnTo);
        if (view) {
          view.show();
        } else {
          window.location.hash = returnTo;
        }
      } else {
        ReUI.back();
      }
    },
    /**
     * Called by save() when performing an update (edit).
     * Gathers the values, creates the payload for update, creates the sdata request and
     * calls `update`.
     */
    update: function update() {
      var values = this.getValues();
      if (values) {
        this.disable();
        this.onUpdate(values);
      } else {
        this.onUpdateCompleted(false);
      }
    },
    onUpdate: function onUpdate(values) {
      var store = this.get('store');
      if (store) {
        var putOptions = {
          overwrite: true,
          id: store.getIdentity(this.entry)
        };

        var entry = this.createEntryForUpdate(values);
        this._applyStateToPutOptions(putOptions);

        _Deferred['default'].when(store.put(entry, putOptions), this.onPutComplete.bind(this, entry), this.onPutError.bind(this, putOptions));
      }
    },
    /**
     * Gathers the values for the entry to send back and returns the appropriate payload for
     * creating or updating.
     * @return {Object} Entry/payload
     */
    createItem: function createItem() {
      var values = this.getValues();

      return this.inserting ? this.createEntryForInsert(values) : this.createEntryForUpdate(values);
    },
    /**
     * Takes the values object and adds the needed propertiers for updating.
     * @param {Object} values
     * @return {Object} Object with properties for updating
     */
    createEntryForUpdate: function createEntryForUpdate(values) {
      return this.convertValues(values);
    },
    /**
     * Takes the values object and adds the needed propertiers for creating/inserting.
     * @param {Object} values
     * @return {Object} Object with properties for inserting
     */
    createEntryForInsert: function createEntryForInsert(values) {
      return this.convertValues(values);
    },
    /**
     * Function to call to tranform values before save
     */
    convertValues: function convertValues(values) {
      return values;
    },
    _applyStateToPutOptions: function _applyStateToPutOptions() {},
    onPutComplete: function onPutComplete(entry, result) {
      this.enable();

      var message = this._buildRefreshMessage(entry, result);

      _connect['default'].publish('/app/refresh', [message]);

      this.onUpdateCompleted(result);
    },
    onPutError: function onPutError(putOptions, error) {
      this.handleError(error);
      this.enable();
    },
    /**
     * Array of strings that will get ignored when the diffing runs.
     */
    diffPropertyIgnores: [],
    /**
     * Diffs the results from the current values and the previous values.
     * This is done for a concurrency check to indicate what has changed.
     * @returns Array List of property names that have changed
     */
    diffs: function diffs(left, right) {
      var acc = [];
      var DeepDiff = window.DeepDiff;
      var DIFF_EDITED = 'E';

      if (DeepDiff) {
        var _diffs = DeepDiff.diff(left, right, (function deepDiff(path, key) {
          if (_array['default'].indexOf(this.diffPropertyIgnores, key) >= 0) {
            return true;
          }
        }).bind(this));

        _array['default'].forEach(_diffs, function (diff) {
          var path = diff.path.join('.');
          if (diff.kind === DIFF_EDITED && _array['default'].indexOf(acc, path) === -1) {
            acc.push(path);
          }
        });
      }

      return acc;
    },
    _buildRefreshMessage: function _buildRefreshMessage(entry, result) {
      if (entry) {
        var store = this.get('store');
        var id = store.getIdentity(entry);
        return {
          id: id,
          key: id,
          data: result
        };
      }
    },
    /**
     * Handler for update complete, checks for `this.options.returnTo` else it simply goes back.
     * @param entry
     */
    onUpdateCompleted: function onUpdateCompleted() {
      if (this.options && this.options.returnTo) {
        var returnTo = this.options.returnTo;
        var view = App.getView(returnTo);
        if (view) {
          view.show();
        } else {
          window.location.hash = returnTo;
        }
      } else {
        ReUI.back();
      }
    },
    /**
     * Creates the markup by applying the `validationSummaryItemTemplate` to each entry in `this.errors`
     * then sets the combined result into the summary validation node and sets the styling to visible
     */
    showValidationSummary: function showValidationSummary() {
      var content = [];

      for (var i = 0; i < this.errors.length; i++) {
        content.push(this.validationSummaryItemTemplate.apply(this.errors[i], this.fields[this.errors[i].name]));
      }

      this.set('validationContent', content.join(''));
      _domClass['default'].add(this.domNode, 'panel-form-error');
    },
    showConcurrencySummary: function showConcurrencySummary() {
      var content = [];

      for (var i = 0; i < this.errors.length; i++) {
        content.push(this.concurrencySummaryItemTemplate.apply(this.errors[i]));
      }

      this.set('concurrencyContent', content.join(''));
      _domClass['default'].add(this.domNode, 'panel-form-concurrency-error');
    },
    /**
     * Removes the summary validation visible styling and empties its contents of error markup
     */
    hideValidationSummary: function hideValidationSummary() {
      _domClass['default'].remove(this.domNode, 'panel-form-error');
      this.set('validationContent', '');
    },
    /**
     * Removes teh summary for concurrency errors
     */
    hideConcurrencySummary: function hideConcurrencySummary() {
      _domClass['default'].remove(this.domNode, 'panel-form-concurrency-error');
      this.set('concurrencyContent', '');
    },
    /**
     * Handler for the save toolbar action.
     *
     * First validates the forms, showing errors and stoping saving if found.
     * Then calls either {@link #insert insert} or {@link #update update} based upon `this.inserting`.
     *
     */
    save: function save() {
      if (this.isFormDisabled()) {
        return;
      }

      this.hideValidationSummary();
      this.hideConcurrencySummary();

      if (this.validate() !== false) {
        this.showValidationSummary();
        return;
      }

      if (this.inserting) {
        this.insert();
      } else {
        this.update();
      }
    },
    /**
     * Extends the getContext function to also include the `resourceKind` of the view, `insert`
     * state and `key` of the entry (false if inserting)
     */
    getContext: function getContext() {
      return _lang['default'].mixin(this.inherited(arguments), {
        resourceKind: this.resourceKind,
        insert: this.options.insert,
        key: this.options.insert ? false : this.options.key ? this.options.key : this.options.entry && this.options.entry[this.idProperty] // eslint-disable-line
      });
    },
    /**
     * Wrapper for detecting security for update mode or insert mode
     * @param {String} access Can be either "update" or "insert"
     */
    getSecurity: function getSecurity(access) {
      var lookup = {
        'update': this.updateSecurity,
        'insert': this.insertSecurity
      };

      return lookup[access];
    },
    /**
     * Extends beforeTransitionTo to add the loading styling if refresh is needed
     */
    beforeTransitionTo: function beforeTransitionTo() {
      if (this.refreshRequired) {
        if (this.options.insert === true || this.options.key && !this.options.entry) {
          _domClass['default'].add(this.domNode, 'panel-loading');
        } else {
          _domClass['default'].remove(this.domNode, 'panel-loading');
        }
      }

      this.inherited(arguments);
    },
    onTransitionTo: function onTransitionTo() {
      // Focus the default focus field if it exists and it has not already been focused.
      // This flag is important because onTransitionTo will fire multiple times if the user is using lookups and editor type fields that transition away from this view.
      if (this._focusField && !this._hasFocused) {
        this._focusField.focus();
        this._hasFocused = true;
      }

      this.inherited(arguments);
    },
    /**
     * Empties the activate method which prevents detection of refresh from transititioning.
     *
     * External navigation (browser back/forward) never refreshes the edit view as it's always a terminal loop.
     * i.e. you never move "forward" from an edit view; you navigate to child editors, from which you always return.
     */
    activate: function activate() {},
    /**
     * Extends refreshRequiredFor to return false if we already have the key the options is passing
     * @param {Object} options Navigation options from previous view
     */
    refreshRequiredFor: function refreshRequiredFor(options) {
      if (this.options) {
        if (options) {
          if (this.options.key && this.options.key === options.key) {
            return false;
          }
        }
      }

      return this.inherited(arguments);
    },
    /**
     * Refresh first clears out any variables set to previous data.
     *
     * The mode of the Edit view is set and determined via `this.options.insert`, and the views values are cleared.
     *
     * Lastly it makes the appropiate data request:
     */
    refresh: function refresh() {
      this.onRefresh();
      this.entry = false;
      this.changes = false;
      this.inserting = this.options.insert === true;
      this._hasFocused = false;

      _domClass['default'].remove(this.domNode, 'panel-form-error');
      _domClass['default'].remove(this.domNode, 'panel-form-concurrency-error');

      this.clearValues();

      if (this.inserting) {
        this.onRefreshInsert();
      } else {
        this.onRefreshUpdate();
      }
    },
    onRefresh: function onRefresh() {},
    onRefreshInsert: function onRefreshInsert() {},
    onRefreshUpdate: function onRefreshUpdate() {
      // apply as non-modified data
      if (this.options.entry) {
        this.processData(this.options.entry);

        // apply changes as modified data, since we want this to feed-back through
        if (this.options.changes) {
          this.changes = this.options.changes;
          this.setValues(this.changes);
        }
      } else {
        // if key is passed request that keys entity and process
        if (this.options.key) {
          this.requestData();
        }
      }
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile._EditBase', __class);
  module.exports = __class;
});
/*o*/ // eslint-disable-line
/* todo: show error message? */
/*sectionNode, layout*/ /*addOptions*/ /*entry*/ /*putOptions*/ /*entry*/
