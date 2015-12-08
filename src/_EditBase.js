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
import connect from 'dojo/_base/connect';
import array from 'dojo/_base/array';
import Deferred from 'dojo/_base/Deferred';
import win from 'dojo/_base/window';
import domAttr from 'dojo/dom-attr';
import domClass from 'dojo/dom-class';
import dom from 'dojo/dom';
import domConstruct from 'dojo/dom-construct';
import query from 'dojo/query';
import utility from './Utility';
import ErrorManager from './ErrorManager';
import FieldManager from './FieldManager';
import View from './View';
import getResource from './I18n';
import 'dojo/NodeList-manipulate';
import './Fields/BooleanField';
import './Fields/DateField';
import './Fields/DecimalField';
import './Fields/DropdownField';
import './Fields/DurationField';
import './Fields/HiddenField';
import './Fields/LookupField';
import './Fields/NoteField';
import './Fields/PhoneField';
import './Fields/SelectField';
import './Fields/SignatureField';
import './Fields/TextAreaField';
import './Fields/TextField';

const resource = getResource('editBase');

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
const __class = declare('argos._EditBase', [View], {
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
      type: 'innerHTML',
    },
    concurrencyContent: {
      node: 'concurrencyContentNode',
      type: 'innerHTML',
    },
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
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" title="{%: $.titleText %}" class="edit panel {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>',
    '{%! $.loadingTemplate %}',
    '{%! $.validationSummaryTemplate %}',
    '{%! $.concurrencySummaryTemplate %}',
    '<div class="panel-content" data-dojo-attach-point="contentNode"></div>',
    '</div>',
  ]),
  /**
   * @property {Simplate}
   * HTML shown when data is being loaded.
   *
   * `$` => the view instance
   */
  loadingTemplate: new Simplate([
    '<fieldset class="panel-loading-indicator">',
    '<div class="row">',
      '<div class="busyIndicator__container busyIndicator--active" aria-live="polite">',
        '<div class="busyIndicator busyIndicator--large">',
          '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--one"></div>',
          '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--two"></div>',
          '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--three"></div>',
          '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--four"></div>',
          '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--five"></div>',
        '</div>',
        '<span class="busyIndicator__label">{%: $.loadingText %}</span>',
      '</div>',
    '</div>',
    '</fieldset>',
  ]),
  /**
   * @property {Simplate}
   * HTML for the validation summary area, this div is shown/hidden as needed.
   *
   * `$` => the view instance
   */
  validationSummaryTemplate: new Simplate([
    '<div class="panel-validation-summary">',
    '<h2>{%: $.validationSummaryText %}</h2>',
    '<ul data-dojo-attach-point="validationContentNode">',
    '</ul>',
    '</div>',
  ]),
  /**
   * @property {Simplate}
   * HTML for the concurrency error area, this div is shown/hidden as needed.
   *
   * `$` => the view instance
   */
  concurrencySummaryTemplate: new Simplate([
    '<div class="panel-concurrency-summary">',
    '<h2>{%: $.concurrencySummaryText %}</h2>',
    '<ul data-dojo-attach-point="concurrencyContentNode">',
    '</ul>',
    '</div>',
  ]),
  /**
   * @property {Simplate}
   * HTML shown when data is being loaded.
   *
   * * `$` => validation error object
   * * `$$` => field instance that the error is on
   */
  validationSummaryItemTemplate: new Simplate([
    '<li>',
    '<a href="#{%= $.name %}">',
    '<h3>{%: $.message %}</h3>',
    '<h4>{%: $$.label %}</h4>',
    '</a>',
    '</li>',
  ]),
  /**
   * @property {Simplate}
   * * `$` => validation error object
   */
  concurrencySummaryItemTemplate: new Simplate([
    '<li>',
    '<h3>{%: $.message %}</h3>',
    '<h4>{%: $.name %}</h4>',
    '</li>',
  ]),
  /**
   * @property {Simplate}
   * HTML that starts a new section including the collapsible header
   *
   * `$` => the view instance
   */
  sectionBeginTemplate: new Simplate([
    '<h2 data-action="toggleSection" class="{% if ($.collapsed || $.options.collapsed) { %}collapsed{% } %}">',
    '<button class="{% if ($.collapsed) { %}{%: $$.toggleExpandClass %}{% } else { %}{%: $$.toggleCollapseClass %}{% } %}" aria-label="{%: $$.toggleCollapseText %}"></button>',
    '{%: ($.title || $.options.title) %}',
    '</h2>',
    '<fieldset class="{%= ($.cls || $.options.cls) %}">',
  ]),
  /**
   * @property {Simplate}
   * HTML that ends a section
   *
   * `$` => the view instance
   */
  sectionEndTemplate: new Simplate([
    '</fieldset>',
  ]),
  /**
   * @property {Simplate}
   * HTML created for each property (field row).
   *
   * * `$` => the field row object defined in {@link #createLayout createLayout}.
   * * `$$` => the view instance
   */
  propertyTemplate: new Simplate([
    '<a name="{%= $.name || $.property %}"></a>',
    '<div class="row row-edit {%= $.cls %}{% if ($.readonly) { %}row-readonly{% } %}" data-field="{%= $.name || $.property %}" data-field-type="{%= $.type %}">',
    '</div>',
  ]),

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

  viewType: 'edit',

  /**
   * @deprecated
   */
  saveText: resource.saveText,
  /**
   * @cfg {String}
   * Default title text shown in the top toolbar
   */
  titleText: resource.titleText,
  /**
   * @cfg {String}
   * The text placed in the header when there are validation errors
   */
  validationSummaryText: resource.validationSummaryText,
  /**
   * @cfg {String}
   * The text placed in the header when there are validation errors
   */
  concurrencySummaryText: resource.concurrencySummaryText,
  /**
   * @property {String}
   * Default text used in the section header
   */
  detailsText: resource.detailsText,
  /**
   * @property {String}
   * Text shown while the view is loading.
   */
  loadingText: resource.loadingText,
  /**
   * @property {Object}
   * Localized error messages. One general error message, and messages by HTTP status code.
   */
  errorText: {
    general: resource.errorGeneral,
    status: {
      '410': resource.error401,
    },
  },
  /**
   * @property {String}
   * Text alerted to user when the data has been updated since they last fetched the data.
   */
  concurrencyErrorText: resource.concurrencyErrorText,
  /**
   * @property {String}
   * ARIA label text for a collapsible section header
   */
  toggleCollapseText: resource.toggleCollapseText,
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
  constructor: function constructor( /*o*/ ) {
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

    query('div[data-field]', this.contentNode)
      .forEach(function forEach(node) {
        const name = domAttr.get(node, 'data-field');
        const field = this.fields[name];
        if (field) {
          field.renderTo(node);
        }
      }, this);

    const sections = query('h2', this.contentNode);
    if (sections.length === 1) {
      domAttr.remove(sections[0], 'data-action');
      const button = query('button[class*="fa-chevron"]', sections[0]);
      if (button[0]) {
        domConstruct.destroy(button[0]);
      }
    }
  },
  /**
   * Extends init to also init the fields in `this.fields`.
   */
  init: function init() {
    this.inherited(arguments);

    for (const name in this.fields) {
      if (this.fields.hasOwnProperty(name)) {
        this.fields[name].init();
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
    const tbar = [{
      id: 'save',
      action: 'save',
      cls: 'fa fa-save fa-fw fa-lg',
      security: this.options && this.options.insert ? this.insertSecurity : this.updateSecurity,
    }];

    if (!App.isOnFirstView()) {
      tbar.push({
        id: 'cancel',
        cls: 'fa fa-ban fa-fw fa-lg',
        side: 'left',
        action: 'onToolCancel',
      });
    }

    return this.tools || (this.tools = {
      'tbar': tbar,
    });
  },
  onToolCancel: function onToolCancel() {
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
    const node = dom.byId(params.$source);
    if (node) {
      domClass.toggle(node, 'collapsed');
      const button = query('button', node)[0];
      if (button) {
        domClass.toggle(button, this.toggleCollapseClass);
        domClass.toggle(button, this.toggleExpandClass);
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
    domClass.remove(field.containerNode, 'row-hidden');
  },
  /**
   * Handler for a fields on hide event.
   *
   * Adds the row-hidden css class.
   *
   * @param {_Field} field Field instance that is being hidden
   */
  _onHideField: function _onHideField(field) {
    domClass.add(field.containerNode, 'row-hidden');
  },
  /**
   * Handler for a fields on enable event.
   *
   * Removes the row-disabled css class.
   *
   * @param {_Field} field Field instance that is being enabled
   */
  _onEnableField: function _onEnableField(field) {
    domClass.remove(field.containerNode, 'row-disabled');
  },
  /**
   * Handler for a fields on disable event.
   *
   * Adds the row-disabled css class.
   *
   * @param {_Field} field Field instance that is being disabled
   */
  _onDisableField: function _onDisableField(field) {
    domClass.add(field.containerNode, 'row-disabled');
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
    const fieldNode = node && query(node, this.contentNode)
      .parents('[data-field]');
    const field = this.fields[fieldNode.length > 0 && domAttr.get(fieldNode[0], 'data-field')];

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
    const fieldNode = node && query(node, this.contentNode)
      .parents('[data-field]');
    const field = fieldNode && this.fields[fieldNode.length > 0 && domAttr.get(fieldNode[0], 'data-field')];

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
      const currentValues = this.getValues(true);
      const diffs = this.diffs(this.previousValuesAll, currentValues);

      if (diffs.length > 0) {
        array.forEach(diffs, function forEach(val) {
          this.errors.push({
            name: val,
            message: this.concurrencyErrorText,
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
      } else { // eslint-disable-line
        /* todo: show error message? */
      }

      domClass.remove(this.domNode, 'panel-loading');

      /* this must take place when the content is visible */
      this.onContentChange();
    } catch (e) {
      console.error(e); // eslint-disable-line
    }
  },
  _onGetError: function _onGetError(getOptions, error) {
    this.handleError(error);
    domClass.remove(this.domNode, 'panel-loading');
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
      },
    }, {
      name: 'AlertError',
      test: function testAlert(error) {
        return error.status !== this.HTTP_STATUS.PRECONDITION_FAILED;
      },
      handle: function handleAlert(error, next) {
        alert(this.getErrorMessage(error)); // eslint-disable-line
        next();
      },
    }, {
      name: 'CatchAll',
      test: function testCatchAll() {
        return true;
      },
      handle: function handleCatchAll(error, next) {
        const fromContext = this.options.fromContext;
        this.options.fromContext = null;
        const errorItem = {
          viewOptions: this.options,
          serverError: error,
        };

        ErrorManager.addError(this.getErrorMessage(error), errorItem);
        this.options.fromContext = fromContext;
        next();
      },
    }];

    return this.errorHandlers;
  },
  /**
   *
   * Returns the view key
   * @return {String} View key
   */
  getTag: function getTag() {
    let tag = this.options && this.options.entry && this.options.entry[this.idProperty];
    if (!tag) {
      tag = this.options && this.options.key;
    }

    return tag;
  },
  processLayout: function processLayout(layout) {
    const rows = (layout.children || layout.as || layout);
    const sectionQueue = [];
    const content = [];
    let sectionStarted = false;
    let current;

    if (!layout.options) {
      layout.options = {
        title: this.detailsText,
      };
    }

    for (let i = 0; i < rows.length; i++) {
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
    const sectionNode = domConstruct.toDom(content.join(''));
    this.onApplySectionNode(sectionNode, current);
    domConstruct.place(sectionNode, this.contentNode, 'last');

    for (let i = 0; i < sectionQueue.length; i++) {
      current = sectionQueue[i];

      this.processLayout(current);
    }
  },
  onApplySectionNode: function onApplySectionNode( /*sectionNode, layout*/ ) {},
  createRowContent: function createRowContent(layout, content) {
    const Ctor = FieldManager.get(layout.type);
    if (Ctor) {
      const field = this.fields[layout.name || layout.property] = new Ctor(lang.mixin({
        owner: this,
      }, layout));

      const template = field.propertyTemplate || this.propertyTemplate;

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
    const store = this.get('store');

    if (this._model) {
      return this.requestDataUsingModel().then(function fulfilled(data) {
        this._onGetComplete(data);
      }.bind(this), function rejected(err) {
        this._onGetError(null, err);
      }.bind(this));
    } else if (store) {
      const getOptions = {};

      this._applyStateToGetOptions(getOptions);

      const getExpression = this._buildGetExpression() || null;
      const getResults = this.requestDataUsingStore(getExpression, getOptions);

      Deferred.when(getResults,
        this._onGetComplete.bind(this),
        this._onGetError.bind(this, getOptions)
      );

      return getResults;
    }

    console.warn('Error requesting data, no model or store was defined. Did you mean to mixin _SDataEditMixin to your edit view?'); // eslint-disable-line
  },
  requestDataUsingModel: function requestDataUsingModel() {
    return this._model.getEntry(this.options);
  },
  requestDataUsingStore: function requestDataUsingStore(getExpression, getOptions) {
    const store = this.get('store');
    return store.get(getExpression, getOptions);
  },
  /**
   * Loops all the fields looking for any with the `default` property set, if set apply that
   * value as the initial value of the field. If the value is a function, its expanded then applied.
   */
  applyFieldDefaults: function applyFieldDefaults() {
    for (const name in this.fields) {
      if (this.fields.hasOwnProperty(name)) {
        const field = this.fields[name];
        const defaultValue = field.default;

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
    for (const name in this.fields) {
      if (this.fields.hasOwnProperty(name)) {
        this.fields[name].clearHighlight();
        this.fields[name].clearValue();
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
    const noValue = {};

    for (const name in this.fields) {
      if (this.fields.hasOwnProperty(name)) {
        const field = this.fields[name];
        let value;
        // for now, explicitly hidden fields (via. the field.hide() method) are not included
        if (field.isHidden()) {
          continue;
        }

        if (field.applyTo !== false) {
          value = utility.getValue(values, field.applyTo, noValue);
        } else {
          value = utility.getValue(values, field.property || name, noValue);
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
    const payload = {};
    let empty = true;

    for (const name in this.fields) {
      if (this.fields.hasOwnProperty(name)) {
        const field = this.fields[name];
        const value = field.getValue();

        const include = this.expandExpression(field.include, value, field, this);
        const exclude = this.expandExpression(field.exclude, value, field, this);

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
        if (all || ((field.alwaysUseValue || field.isDirty() || include) && !field.isHidden())) {
          if (field.applyTo !== false) {
            if (typeof field.applyTo === 'function') {
              if (typeof value === 'object') {
                // Copy the value properties into our payload object
                for (const prop in value) {
                  if (value.hasOwnProperty(prop)) {
                    payload[prop] = value[prop];
                  }
                }
              }

              field.applyTo(payload, value);
            } else if (typeof field.applyTo === 'string') {
              const target = utility.getValue(payload, field.applyTo);
              lang.mixin(target, value);
            }
          } else {
            utility.setValue(payload, field.property || name, value);
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

    for (const name in this.fields) {
      if (this.fields.hasOwnProperty(name)) {
        const field = this.fields[name];

        const result = field.validate();
        if (!field.isHidden() && result !== false) {
          domClass.add(field.containerNode, 'row-error');

          this.errors.push({
            name: name,
            message: result,
          });
        } else {
          domClass.remove(field.containerNode, 'row-error');
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

    domClass.add(win.body(), 'busy');
  },
  /**
   * Enables the form by setting busy to false and enabling the toolbar
   */
  enable: function enable() {
    this.busy = false;

    if (App.bars.tbar) {
      App.bars.tbar.enableTool('save');
    }

    domClass.remove(win.body(), 'busy');
  },
  /**
   * Called by save() when performing an insert (create).
   * Gathers the values, creates the payload for insert, creates the sdata request and
   * calls `create`.
   */
  insert: function insert() {
    this.disable();

    const values = this.getValues();
    if (values) {
      this.onInsert(values);
    } else {
      ReUI.back();
    }
  },
  onInsert: function onInsert(values) {
    const store = this.get('store');
    const addOptions = {
      overwrite: false,
    };
    const entry = this.createEntryForInsert(values);
    this._applyStateToAddOptions(addOptions);
    if (this._model) {
      this._model.insertEntry(entry, addOptions).then(function success(data) {
        this.onAddComplete(entry, data);
      }.bind(this), function failure(err) {
        this.onAddError(addOptions, err);
      }.bind(this));
    } else if (store) {
      Deferred.when(store.add(entry, addOptions),
        this.onAddComplete.bind(this, entry),
        this.onAddError.bind(this, addOptions)
      );
    }
  },
  _applyStateToAddOptions: function _applyStateToAddOptions( /*addOptions*/ ) {},
  onAddComplete: function onAddComplete(entry, result) {
    this.enable();

    const message = this._buildRefreshMessage(entry, result);
    connect.publish('/app/refresh', [message]);

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
  onInsertCompleted: function onInsertCompleted( /*entry*/ ) {
    if (this.options && this.options.returnTo) {
      const returnTo = this.options.returnTo;
      const view = App.getView(returnTo);
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
    const values = this.getValues();
    if (values) {
      this.disable();
      this.onUpdate(values);
    } else {
      this.onUpdateCompleted(false);
    }
  },
  onUpdate: function onUpdate(values) {
    const store = this.get('store');
    const putOptions = {
      overwrite: true,
    };
    const entry = this.createEntryForUpdate(values);
    this._applyStateToPutOptions(putOptions);
    if (this._model) {
      this._model.updateEntry(entry, putOptions).then(function success(data) {
        this.onPutComplete(entry, data);
      }.bind(this), function failure(err) {
        this.onPutError(putOptions, err);
      }.bind(this));
    } else if (store) {
      Deferred.when(store.put(entry, putOptions),
        this.onPutComplete.bind(this, entry),
        this.onPutError.bind(this, putOptions)
      );
    }
  },
  /**
   * Gathers the values for the entry to send back and returns the appropriate payload for
   * creating or updating.
   * @return {Object} Entry/payload
   */
  createItem: function createItem() {
    const values = this.getValues();

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
  _applyStateToPutOptions: function _applyStateToPutOptions( /*putOptions*/ ) {},
  onPutComplete: function onPutComplete(entry, result) {
    this.enable();

    const message = this._buildRefreshMessage(entry, result);

    connect.publish('/app/refresh', [message]);

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
    const acc = [];
    const DeepDiff = window.DeepDiff;
    const DIFF_EDITED = 'E';

    if (DeepDiff) {
      const _diffs = DeepDiff.diff(left, right, function deepDiff(path, key) {
        if (array.indexOf(this.diffPropertyIgnores, key) >= 0) {
          return true;
        }
      }.bind(this));

      array.forEach(_diffs, (diff) => {
        const path = diff.path.join('.');
        if (diff.kind === DIFF_EDITED && array.indexOf(acc, path) === -1) {
          acc.push(path);
        }
      });
    }

    return acc;
  },
  _buildRefreshMessage: function _buildRefreshMessage(entry, result) {
    if (entry) {
      const store = this.get('store');
      const id = store.getIdentity(entry);
      return {
        id: id,
        key: id,
        data: result,
      };
    }
  },
  /**
   * Handler for update complete, checks for `this.options.returnTo` else it simply goes back.
   * @param entry
   */
  onUpdateCompleted: function onUpdateCompleted( /*entry*/ ) {
    if (this.options && this.options.returnTo) {
      const returnTo = this.options.returnTo;
      const view = App.getView(returnTo);
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
    const content = [];

    for (let i = 0; i < this.errors.length; i++) {
      content.push(this.validationSummaryItemTemplate.apply(this.errors[i], this.fields[this.errors[i].name]));
    }

    this.set('validationContent', content.join(''));
    domClass.add(this.domNode, 'panel-form-error');
  },
  showConcurrencySummary: function showConcurrencySummary() {
    const content = [];

    for (let i = 0; i < this.errors.length; i++) {
      content.push(this.concurrencySummaryItemTemplate.apply(this.errors[i]));
    }

    this.set('concurrencyContent', content.join(''));
    domClass.add(this.domNode, 'panel-form-concurrency-error');
  },
  /**
   * Removes the summary validation visible styling and empties its contents of error markup
   */
  hideValidationSummary: function hideValidationSummary() {
    domClass.remove(this.domNode, 'panel-form-error');
    this.set('validationContent', '');
  },
  /**
   * Removes teh summary for concurrency errors
   */
  hideConcurrencySummary: function hideConcurrencySummary() {
    domClass.remove(this.domNode, 'panel-form-concurrency-error');
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
    return lang.mixin(this.inherited(arguments), {
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
    const lookup = {
      'update': this.updateSecurity,
      'insert': this.insertSecurity,
    };

    return lookup[access];
  },
  /**
   * Extends beforeTransitionTo to add the loading styling if refresh is needed
   */
  beforeTransitionTo: function beforeTransitionTo() {
    if (this.refreshRequired) {
      if (this.options.insert === true || (this.options.key && !this.options.entry)) {
        domClass.add(this.domNode, 'panel-loading');
      } else {
        domClass.remove(this.domNode, 'panel-loading');
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
    this.inserting = (this.options.insert === true);
    this._hasFocused = false;

    domClass.remove(this.domNode, 'panel-form-error');
    domClass.remove(this.domNode, 'panel-form-concurrency-error');

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
  },
});

lang.setObject('Sage.Platform.Mobile._EditBase', __class);
export default __class;
