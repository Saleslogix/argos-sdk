define('argos/_EditBase', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/connect', 'dojo/when', './Utility', './ErrorManager', './FieldManager', './View', './I18n', './Fields/BooleanField', './Fields/DateField', './Fields/DecimalField', './Fields/DropdownField', './Fields/DurationField', './Fields/HiddenField', './Fields/LookupField', './Fields/NoteField', './Fields/PhoneField', './Fields/SelectField', './Fields/SignatureField', './Fields/TextAreaField', './Fields/TextField'], function (module, exports, _declare, _lang, _connect, _when, _Utility, _ErrorManager, _FieldManager, _View, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _connect2 = _interopRequireDefault(_connect);

  var _when2 = _interopRequireDefault(_when);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  var _View2 = _interopRequireDefault(_View);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
    return typeof obj;
  } : function (obj) {
    return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
  };

  var resource = (0, _I18n2.default)('editBase');

  /**
   * @class argos._EditBase
   * @classdesc An Edit View is a dual purpose view - used for both Creating and Updating records. It is comprised
   * of a layout similar to Detail rows but are instead Edit fields.
   *
   * A unique part of the Edit view is it's lifecycle in comparison to Detail. The Detail view is torn
   * down and rebuilt with every record. With Edit the form is emptied (HTML left in-tact) and new values
   * are applied to the fields.
   *
   * Since Edit Views are typically the "last" view (you always come from a List or Detail view) it warrants
   * special attention to the navigation options that are passed, as they greatly control how the Edit view
   * functions and operates.
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
  var __class = (0, _declare2.default)('argos._EditBase', [_View2.default], /** @lends argos._EditBase# */{
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
      },
      title: _View2.default.prototype.attributeMap.title,
      selected: _View2.default.prototype.attributeMap.selected
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
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" data-title="{%: $.titleText %}" class="edit panel scrollable {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>', '{%! $.loadingTemplate %}', '{%! $.validationSummaryTemplate %}', '{%! $.concurrencySummaryTemplate %}', '<div data-dojo-attach-point="contentNode"></div>', '</div>']),
    /**
     * @property {Simplate}
     * HTML shown when data is being loaded.
     *
     * `$` => the view instance
     */
    loadingTemplate: new Simplate(['<fieldset class="panel-loading-indicator">', '<div class="busy-indicator-container" aria-live="polite">', '<div class="busy-indicator active">', '<div class="bar one"></div>', '<div class="bar two"></div>', '<div class="bar three"></div>', '<div class="bar four"></div>', '<div class="bar five"></div>', '</div>', '<span>{%: $.loadingText %}</span>', '</div>', '</fieldset>']),
    /**
     * @property {Simplate}
     * HTML for the validation summary area, this div is shown/hidden as needed.
     *
     * `$` => the view instance
     */
    validationSummaryTemplate: new Simplate(['<div class="panel-validation-summary">', '<h3>{%: $.validationSummaryText %}</h3>', '<ul class="panel-validation-messages" data-dojo-attach-point="validationContentNode">', '</ul>', '</div>']),
    /**
     * @property {Simplate}
     * HTML for the concurrency error area, this div is shown/hidden as needed.
     *
     * `$` => the view instance
     */
    concurrencySummaryTemplate: new Simplate(['<div class="panel-concurrency-summary">', '<h3>{%: $.concurrencySummaryText %}</h3>', '<ul data-dojo-attach-point="concurrencyContentNode">', '</ul>', '</div>']),
    /**
     * @property {Simplate}
     * HTML shown when data is being loaded.
     *
     * * `$` => validation error object
     * * `$$` => field instance that the error is on
     */
    validationSummaryItemTemplate: new Simplate(['<li><p>', '<a class="hyperlink" href="#{%= $.name %}">', '<b>{%: $$.label %}</b>: {%: $.message %}', '</a></p></li>']),
    /**
     * @property {Simplate}
     * * `$` => validation error object
     */
    concurrencySummaryItemTemplate: new Simplate(['<li><p><b>{%: $$.name %}</b>: {%: $.message %}</p></li>']),
    /**
     * @property {Simplate}
     * HTML that starts a new section including the collapsible header
     *
     * `$` => the view instance
     */
    sectionBeginTemplate: new Simplate(['<div class="accordion">\n      <div class="accordion-header is-selected">\n        <a href="#"><span>{%: ($.title || $.options.title) %}</span></a>\n      </div>\n      <div class="accordion-pane">\n        <fieldset class="accordion-content {%= ($.cls || $.options.cls) %}">\n    ']),
    /**
     * @property {Simplate}
     * HTML that ends a section
     *
     * `$` => the view instance
     */
    sectionEndTemplate: new Simplate(['</fieldset></div></div>']),
    /**
     * @property {Simplate}
     * HTML created for each property (field row).
     *
     * * `$` => the field row object defined in {@link #createLayout createLayout}.
     * * `$$` => the view instance
     */
    propertyTemplate: new Simplate(['<a name="{%= $.name || $.property %}"></a>', '<div class="row-edit {%= $.cls %}{% if ($.readonly) { %}row-readonly{% } %}" data-field="{%= $.name || $.property %}" data-field-type="{%= $.type %}">', '</div>']),

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
        410: resource.error401
      }
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
     * @property {Boolean}
     * Flags if the view is multi column or single column.
     */
    multiColumnView: true,
    /**
     * @property {string}
     * SoHo class to be applied on multi column.
     */
    multiColumnClass: 'four',
    /**
     * @property {number}
     * Number of columns in view
     */
    multiColumnCount: 3,
    /**
     * @property {String}
     * Text shown in the top toolbar save button
     */
    saveTooltipText: resource.saveTooltipText,
    /**
     * @property {String}
     * Text shown in the top toolbar cancel button
     */
    cancelTooltipText: resource.cancelTooltipText,
    /**
     * Extends constructor to initialze `this.fields` to {}
     * @param o
     * @constructs
     */
    constructor: function constructor() /* o*/{
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
      var _this = this;

      this.inherited(arguments);
      this.processLayout(this._createCustomizedLayout(this.createLayout()));

      $('div[data-field]', this.contentNode).each(function (i, node) {
        var name = $(node).attr('data-field');
        var field = _this.fields[name];
        if (field) {
          $(field.domNode).addClass('field');
          field.renderTo(node);
        }
      });
    },
    /**
     * Extends init to also init the fields in `this.fields`.
     */
    init: function init() {
      this.inherited(arguments);

      for (var name in this.fields) {
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
      var tbar = [{
        id: 'save',
        action: 'save',
        svg: 'save',
        title: this.saveText,
        security: this.options && this.options.insert ? this.insertSecurity : this.updateSecurity
      }];

      if (!App.isOnFirstView()) {
        tbar.push({
          id: 'cancel',
          svg: 'cancel',
          title: this.cancelTooltipText,
          side: 'left',
          action: 'onToolCancel'
        });
      }

      return this.tools || (this.tools = {
        tbar: tbar
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
     * Handler for a fields on show event.
     *
     * Removes the row-hidden css class.
     *
     * @param {_Field} field Field instance that is being shown
     */
    _onShowField: function _onShowField(field) {
      $(field.containerNode).removeClass('row-hidden');
      $(field.containerNode).parent().removeClass('display-none');
    },
    /**
     * Handler for a fields on hide event.
     *
     * Adds the row-hidden css class.
     *
     * @param {_Field} field Field instance that is being hidden
     */
    _onHideField: function _onHideField(field) {
      $(field.containerNode).addClass('row-hidden');
      $(field.containerNode).parent().addClass('display-none');
    },
    /**
     * Handler for a fields on enable event.
     *
     * Removes the row-disabled css class.
     *
     * @param {_Field} field Field instance that is being enabled
     */
    _onEnableField: function _onEnableField(field) {
      $(field.containerNode).removeClass('row-disabled');
    },
    /**
     * Handler for a fields on disable event.
     *
     * Adds the row-disabled css class.
     *
     * @param {_Field} field Field instance that is being disabled
     */
    _onDisableField: function _onDisableField(field) {
      $(field.containerNode).addClass('row-disabled');
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
      var fieldNode = $(node, this.contentNode).parents('[data-field]');
      var field = this.fields[fieldNode.length > 0 && fieldNode.first().attr('data-field')];

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
      var fieldNode = $(node, this.contentNode).parents('[data-field]');
      var field = fieldNode && this.fields[fieldNode.length > 0 && fieldNode.first().attr('data-field')];

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
    processFieldLevelSecurity: function processFieldLevelSecurity(entry) {// eslint-disable-line
    },
    processData: function processData(entry) {
      this.entry = this.processEntry(this.convertEntry(entry || {})) || {};
      this.processFieldLevelSecurity(this.entry);

      this.setValues(entry, true);

      // Re-apply changes saved from concurrency/precondition failure
      if (this.previousValuesAll) {
        // Make a copy of the current values, so we can diff them
        var currentValues = this.getValues(true);
        var diffs = this.diffs(this.previousValuesAll, currentValues);

        if (diffs.length > 0) {
          diffs.forEach(function forEach(val) {
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
        } else {// eslint-disable-line
          /* todo: show error message? */
        }

        $(this.domNode).removeClass('panel-loading');

        /* this must take place when the content is visible */
        this.onContentChange();
      } catch (e) {
        console.error(e); // eslint-disable-line
      }
    },
    _onGetError: function _onGetError(getOptions, error) {
      this.handleError(error);
      $(this.domNode).removeClass('panel-loading');
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
          var fromContext = this.options.fromContext;
          this.options.fromContext = null;
          var errorItem = {
            serverError: error
          };

          _ErrorManager2.default.addError(this.getErrorMessage(error), errorItem);
          this.options.fromContext = fromContext;
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
      var current = void 0;

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
          content.push('<div class="row edit-row">');
        }

        this.createRowContent(current, content);
      }
      content.push('</div>');
      content.push(this.sectionEndTemplate.apply(layout, this));
      var sectionNode = $(content.join(''));
      sectionNode.accordion();
      this.onApplySectionNode(sectionNode.get(0), current);
      $(this.contentNode).append(sectionNode);

      for (var _i = 0; _i < sectionQueue.length; _i++) {
        current = sectionQueue[_i];

        this.processLayout(current);
      }
    },
    onApplySectionNode: function onApplySectionNode() /* sectionNode, layout*/{},
    createRowContent: function createRowContent(layout, content) {
      var Ctor = _FieldManager2.default.get(layout.type);
      if (Ctor) {
        var field = this.fields[layout.name || layout.property] = new Ctor(_lang2.default.mixin({
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

        if (this.multiColumnView) {
          var hidden = '';
          if (field.type === 'hidden') {
            hidden = 'display-none';
          }
          content.push('<div class="' + this.multiColumnClass + ' columns ' + hidden + '">');
        }
        content.push(template.apply(field, this));
        if (this.multiColumnView) {
          content.push('</div>');
        }
      }
    },
    /**
     * Initiates the request.
     */
    requestData: function requestData() {
      var _this2 = this;

      var store = this.get('store');

      if (this._model) {
        return this.requestDataUsingModel().then(function (data) {
          _this2._onGetComplete(data);
        }, function (err) {
          _this2._onGetError(null, err);
        });
      } else if (store) {
        var getOptions = {};

        this._applyStateToGetOptions(getOptions);

        var getExpression = this._buildGetExpression() || null;
        var getResults = this.requestDataUsingStore(getExpression, getOptions);

        (0, _when2.default)(getResults, this._onGetComplete.bind(this), this._onGetError.bind(this, getOptions));

        return getResults;
      }

      console.warn('Error requesting data, no model or store was defined. Did you mean to mixin _SDataEditMixin to your edit view?'); // eslint-disable-line
    },
    requestDataUsingModel: function requestDataUsingModel() {
      return this._model.getEntry(this.options);
    },
    requestDataUsingStore: function requestDataUsingStore(getExpression, getOptions) {
      var store = this.get('store');
      return store.get(getExpression, getOptions);
    },
    /**
     * Loops all the fields looking for any with the `default` property set, if set apply that
     * value as the initial value of the field. If the value is a function, its expanded then applied.
     */
    applyFieldDefaults: function applyFieldDefaults() {
      for (var name in this.fields) {
        if (this.fields.hasOwnProperty(name)) {
          var field = this.fields[name];
          var defaultValue = field.default;

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
      for (var name in this.fields) {
        if (this.fields.hasOwnProperty(name)) {
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
      var noValue = {};

      for (var name in this.fields) {
        if (this.fields.hasOwnProperty(name)) {
          var field = this.fields[name];
          var value = void 0;
          // for now, explicitly hidden fields (via. the field.hide() method) are not included
          if (field.isHidden()) {
            continue;
          }

          if (field.applyTo !== false) {
            value = _Utility2.default.getValue(values, field.applyTo, noValue);
          } else {
            value = _Utility2.default.getValue(values, field.property || name, noValue);
          }

          // fyi: uses the fact that ({} !== {})
          if (value !== noValue) {
            field.setValue(value, initial);
            $(field.containerNode).removeClass('row-error');
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

      for (var name in this.fields) {
        if (this.fields.hasOwnProperty(name)) {
          var field = this.fields[name];
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
                if ((typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object') {
                  // Copy the value properties into our payload object
                  for (var prop in value) {
                    if (value.hasOwnProperty(prop)) {
                      payload[prop] = value[prop];
                    }
                  }
                }

                field.applyTo(payload, value);
              } else if (typeof field.applyTo === 'string') {
                var target = _Utility2.default.getValue(payload, field.applyTo);
                _lang2.default.mixin(target, value);
              }
            } else {
              _Utility2.default.setValue(payload, field.property || name, value);
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

      for (var name in this.fields) {
        if (this.fields.hasOwnProperty(name)) {
          var field = this.fields[name];

          var result = field.validate();
          if (!field.isHidden() && result !== false) {
            $(field.containerNode).addClass('row-error');

            this.errors.push({
              name: name,
              message: result
            });
          } else {
            $(field.containerNode).removeClass('row-error');
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

      $('body').addClass('busy'); // TODO: Make this the root/app container node
    },
    /**
     * Enables the form by setting busy to false and enabling the toolbar
     */
    enable: function enable() {
      this.busy = false;

      if (App.bars.tbar) {
        App.bars.tbar.enableTool('save');
      }

      $('body').removeClass('busy'); // TODO: Make this the root/app container node
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
      var _this3 = this;

      var store = this.get('store');
      var addOptions = {
        overwrite: false
      };
      var entry = this.createEntryForInsert(values);
      this._applyStateToAddOptions(addOptions);
      if (this._model) {
        this._model.insertEntry(entry, addOptions).then(function (data) {
          _this3.onAddComplete(entry, data);
        }, function (err) {
          _this3.onAddError(addOptions, err);
        });
      } else if (store) {
        (0, _when2.default)(store.add(entry, addOptions), this.onAddComplete.bind(this, entry), this.onAddError.bind(this, addOptions));
      }
    },
    _applyStateToAddOptions: function _applyStateToAddOptions() /* addOptions*/{},
    onAddComplete: function onAddComplete(entry, result) {
      this.enable();

      var message = this._buildRefreshMessage(entry, result);
      _connect2.default.publish('/app/refresh', [message]);

      this.onInsertCompleted(result);
    },
    onAddError: function onAddError(addOptions, error) {
      this.enable();
      this.handleError(error);
    },
    /**
     * Handler for insert complete, checks for `this.options.returnTo` else it simply goes back.
     * @param entry
     */
    onInsertCompleted: function onInsertCompleted() /* entry*/{
      // returnTo is handled by ReUI back
      ReUI.back();
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
      var _this4 = this;

      var store = this.get('store');
      var putOptions = {
        overwrite: true
      };
      var entry = this.createEntryForUpdate(values);
      this._applyStateToPutOptions(putOptions);
      if (this._model) {
        this._model.updateEntry(entry, putOptions).then(function (data) {
          _this4.onPutComplete(entry, data);
        }, function (err) {
          _this4.onPutError(putOptions, err);
        });
      } else if (store) {
        (0, _when2.default)(store.put(entry, putOptions), this.onPutComplete.bind(this, entry), this.onPutError.bind(this, putOptions));
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
    _applyStateToPutOptions: function _applyStateToPutOptions() /* putOptions*/{},
    onPutComplete: function onPutComplete(entry, result) {
      this.enable();

      var message = this._buildRefreshMessage(entry, result);

      _connect2.default.publish('/app/refresh', [message]);

      this.onUpdateCompleted(result);
    },
    onPutError: function onPutError(putOptions, error) {
      this.enable();
      this.handleError(error);
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
      var _this5 = this;

      var acc = [];
      var DIFF_EDITED = 'E';

      if (DeepDiff) {
        var _diffs = DeepDiff.diff(left, right, function (path, key) {
          if (_this5.diffPropertyIgnores.indexOf(key) >= 0) {
            return true;
          }
        });

        if (_diffs) {
          _diffs.forEach(function (diff) {
            var path = diff.path.join('.');
            if (diff.kind === DIFF_EDITED && acc.indexOf(path) === -1) {
              acc.push(path);
            }
          });
        }
      }

      return acc;
    },
    _extractIdPropertyFromEntry: function _extractIdPropertyFromEntry(entry) {
      var store = this.get('store');
      if (this._model) {
        return this._model.getEntityId(entry);
      } else if (store) {
        return store.getIdentity(entry);
      }

      return '';
    },
    _buildRefreshMessage: function _buildRefreshMessage(originalEntry, response) {
      if (originalEntry) {
        var id = this._extractIdPropertyFromEntry(originalEntry);
        return {
          id: id,
          key: id,
          data: response
        };
      }
    },
    /**
     * Handler for update complete, checks for `this.options.returnTo` else it simply goes back.
     * @param entry
     */
    onUpdateCompleted: function onUpdateCompleted() /* entry*/{
      // returnTo is handled by ReUI back
      ReUI.back();
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
      $(this.domNode).addClass('panel-form-error');
    },
    showConcurrencySummary: function showConcurrencySummary() {
      var content = [];

      for (var i = 0; i < this.errors.length; i++) {
        content.push(this.concurrencySummaryItemTemplate.apply(this.errors[i]));
      }

      this.set('concurrencyContent', content.join(''));
      $(this.domNode).addClass('panel-form-concurrency-error');
    },
    /**
     * Removes the summary validation visible styling and empties its contents of error markup
     */
    hideValidationSummary: function hideValidationSummary() {
      $(this.domNode).removeClass('panel-form-error');
      this.set('validationContent', '');
    },
    /**
     * Removes teh summary for concurrency errors
     */
    hideConcurrencySummary: function hideConcurrencySummary() {
      $(this.domNode).removeClass('panel-form-concurrency-error');
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
      return _lang2.default.mixin(this.inherited(arguments), {
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
        update: this.updateSecurity,
        insert: this.insertSecurity
      };

      return lookup[access];
    },
    /**
     * Extends beforeTransitionTo to add the loading styling if refresh is needed
     */
    beforeTransitionTo: function beforeTransitionTo() {
      if (this.refreshRequired) {
        if (this.options.insert === true || this.options.key && !this.options.entry) {
          $(this.domNode).addClass('panel-loading');
        } else {
          $(this.domNode).removeClass('panel-loading');
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

      $(this.domNode).removeClass('panel-form-error');
      $(this.domNode).removeClass('panel-form-concurrency-error');

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
    getRoute: function getRoute() {
      return this.id + '/:key?';
    },
    buildRoute: function buildRoute() {
      var parts = [];
      var id = this.id;
      parts.push(id);

      var key = this.getTag() || this.entry && this.entry[this.idProperty];
      if (key) {
        parts.push(key);
      }

      return parts.join('/');
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fRWRpdEJhc2UuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwiYXR0cmlidXRlTWFwIiwidmFsaWRhdGlvbkNvbnRlbnQiLCJub2RlIiwidHlwZSIsImNvbmN1cnJlbmN5Q29udGVudCIsInRpdGxlIiwicHJvdG90eXBlIiwic2VsZWN0ZWQiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwibG9hZGluZ1RlbXBsYXRlIiwidmFsaWRhdGlvblN1bW1hcnlUZW1wbGF0ZSIsImNvbmN1cnJlbmN5U3VtbWFyeVRlbXBsYXRlIiwidmFsaWRhdGlvblN1bW1hcnlJdGVtVGVtcGxhdGUiLCJjb25jdXJyZW5jeVN1bW1hcnlJdGVtVGVtcGxhdGUiLCJzZWN0aW9uQmVnaW5UZW1wbGF0ZSIsInNlY3Rpb25FbmRUZW1wbGF0ZSIsInByb3BlcnR5VGVtcGxhdGUiLCJpZCIsInN0b3JlIiwibGF5b3V0IiwiZW5hYmxlQ3VzdG9taXphdGlvbnMiLCJjdXN0b21pemF0aW9uU2V0IiwiZXhwb3NlIiwiaW5zZXJ0U2VjdXJpdHkiLCJ1cGRhdGVTZWN1cml0eSIsInZpZXdUeXBlIiwic2F2ZVRleHQiLCJ0aXRsZVRleHQiLCJ2YWxpZGF0aW9uU3VtbWFyeVRleHQiLCJjb25jdXJyZW5jeVN1bW1hcnlUZXh0IiwiZGV0YWlsc1RleHQiLCJsb2FkaW5nVGV4dCIsImVycm9yVGV4dCIsImdlbmVyYWwiLCJlcnJvckdlbmVyYWwiLCJzdGF0dXMiLCJlcnJvcjQwMSIsImNvbmN1cnJlbmN5RXJyb3JUZXh0IiwidG9nZ2xlQ29sbGFwc2VUZXh0IiwiZmllbGRzIiwiZW50cnkiLCJpbnNlcnRpbmciLCJfZm9jdXNGaWVsZCIsIl9oYXNGb2N1c2VkIiwibXVsdGlDb2x1bW5WaWV3IiwibXVsdGlDb2x1bW5DbGFzcyIsIm11bHRpQ29sdW1uQ291bnQiLCJzYXZlVG9vbHRpcFRleHQiLCJjYW5jZWxUb29sdGlwVGV4dCIsImNvbnN0cnVjdG9yIiwic3RhcnR1cCIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInByb2Nlc3NMYXlvdXQiLCJfY3JlYXRlQ3VzdG9taXplZExheW91dCIsImNyZWF0ZUxheW91dCIsIiQiLCJjb250ZW50Tm9kZSIsImVhY2giLCJpIiwibmFtZSIsImF0dHIiLCJmaWVsZCIsImRvbU5vZGUiLCJhZGRDbGFzcyIsInJlbmRlclRvIiwiaW5pdCIsImhhc093blByb3BlcnR5IiwiY3JlYXRlVG9vbExheW91dCIsInRiYXIiLCJhY3Rpb24iLCJzdmciLCJzZWN1cml0eSIsIm9wdGlvbnMiLCJpbnNlcnQiLCJBcHAiLCJpc09uRmlyc3RWaWV3IiwicHVzaCIsInNpZGUiLCJ0b29scyIsIm9uVG9vbENhbmNlbCIsInJlZnJlc2hSZXF1aXJlZCIsIlJlVUkiLCJiYWNrIiwiX2dldFN0b3JlQXR0ciIsImNyZWF0ZVN0b3JlIiwiX29uU2hvd0ZpZWxkIiwiY29udGFpbmVyTm9kZSIsInJlbW92ZUNsYXNzIiwicGFyZW50IiwiX29uSGlkZUZpZWxkIiwiX29uRW5hYmxlRmllbGQiLCJfb25EaXNhYmxlRmllbGQiLCJpbnZva2VBY3Rpb24iLCJwYXJhbWV0ZXJzIiwiZXZ0IiwiZmllbGROb2RlIiwicGFyZW50cyIsImxlbmd0aCIsImZpcnN0IiwiYXBwbHkiLCJoYXNBY3Rpb24iLCJvbkNvbnRlbnRDaGFuZ2UiLCJwcm9jZXNzRW50cnkiLCJjb252ZXJ0RW50cnkiLCJwcm9jZXNzRmllbGRMZXZlbFNlY3VyaXR5IiwicHJvY2Vzc0RhdGEiLCJzZXRWYWx1ZXMiLCJwcmV2aW91c1ZhbHVlc0FsbCIsImN1cnJlbnRWYWx1ZXMiLCJnZXRWYWx1ZXMiLCJkaWZmcyIsImZvckVhY2giLCJ2YWwiLCJlcnJvcnMiLCJtZXNzYWdlIiwic2hvd0NvbmN1cnJlbmN5U3VtbWFyeSIsInNhdmUiLCJjaGFuZ2VzIiwiX29uR2V0Q29tcGxldGUiLCJlIiwiY29uc29sZSIsImVycm9yIiwiX29uR2V0RXJyb3IiLCJnZXRPcHRpb25zIiwiaGFuZGxlRXJyb3IiLCJjcmVhdGVFcnJvckhhbmRsZXJzIiwiZXJyb3JIYW5kbGVycyIsInRlc3QiLCJ0ZXN0UHJlQ29uZGl0aW9uIiwiSFRUUF9TVEFUVVMiLCJQUkVDT05ESVRJT05fRkFJTEVEIiwiaGFuZGxlIiwiaGFuZGxlUHJlQ29uZGl0aW9uIiwibmV4dCIsImtleSIsIiRrZXkiLCJyZWZyZXNoIiwidGVzdEFsZXJ0IiwiaGFuZGxlQWxlcnQiLCJhbGVydCIsImdldEVycm9yTWVzc2FnZSIsInRlc3RDYXRjaEFsbCIsImhhbmRsZUNhdGNoQWxsIiwiZnJvbUNvbnRleHQiLCJlcnJvckl0ZW0iLCJzZXJ2ZXJFcnJvciIsImFkZEVycm9yIiwiZ2V0VGFnIiwidGFnIiwiaWRQcm9wZXJ0eSIsInJvd3MiLCJjaGlsZHJlbiIsImFzIiwic2VjdGlvblF1ZXVlIiwiY29udGVudCIsInNlY3Rpb25TdGFydGVkIiwiY3VycmVudCIsImNyZWF0ZVJvd0NvbnRlbnQiLCJzZWN0aW9uTm9kZSIsImpvaW4iLCJhY2NvcmRpb24iLCJvbkFwcGx5U2VjdGlvbk5vZGUiLCJnZXQiLCJhcHBlbmQiLCJDdG9yIiwicHJvcGVydHkiLCJtaXhpbiIsIm93bmVyIiwidGVtcGxhdGUiLCJhdXRvRm9jdXMiLCJFcnJvciIsImNvbm5lY3QiLCJoaWRkZW4iLCJyZXF1ZXN0RGF0YSIsIl9tb2RlbCIsInJlcXVlc3REYXRhVXNpbmdNb2RlbCIsInRoZW4iLCJkYXRhIiwiZXJyIiwiX2FwcGx5U3RhdGVUb0dldE9wdGlvbnMiLCJnZXRFeHByZXNzaW9uIiwiX2J1aWxkR2V0RXhwcmVzc2lvbiIsImdldFJlc3VsdHMiLCJyZXF1ZXN0RGF0YVVzaW5nU3RvcmUiLCJiaW5kIiwid2FybiIsImdldEVudHJ5IiwiYXBwbHlGaWVsZERlZmF1bHRzIiwiZGVmYXVsdFZhbHVlIiwiZGVmYXVsdCIsInNldFZhbHVlIiwiZXhwYW5kRXhwcmVzc2lvbiIsImNsZWFyVmFsdWVzIiwiY2xlYXJWYWx1ZSIsInZhbHVlcyIsImluaXRpYWwiLCJub1ZhbHVlIiwidmFsdWUiLCJpc0hpZGRlbiIsImFwcGx5VG8iLCJnZXRWYWx1ZSIsImFsbCIsInBheWxvYWQiLCJlbXB0eSIsImluY2x1ZGUiLCJleGNsdWRlIiwidW5kZWZpbmVkIiwiYWx3YXlzVXNlVmFsdWUiLCJpc0RpcnR5IiwicHJvcCIsInRhcmdldCIsInZhbGlkYXRlIiwicmVzdWx0IiwiaXNGb3JtRGlzYWJsZWQiLCJidXN5IiwiZGlzYWJsZSIsImJhcnMiLCJkaXNhYmxlVG9vbCIsImVuYWJsZSIsImVuYWJsZVRvb2wiLCJvbkluc2VydCIsImFkZE9wdGlvbnMiLCJvdmVyd3JpdGUiLCJjcmVhdGVFbnRyeUZvckluc2VydCIsIl9hcHBseVN0YXRlVG9BZGRPcHRpb25zIiwiaW5zZXJ0RW50cnkiLCJvbkFkZENvbXBsZXRlIiwib25BZGRFcnJvciIsImFkZCIsIl9idWlsZFJlZnJlc2hNZXNzYWdlIiwicHVibGlzaCIsIm9uSW5zZXJ0Q29tcGxldGVkIiwidXBkYXRlIiwib25VcGRhdGUiLCJvblVwZGF0ZUNvbXBsZXRlZCIsInB1dE9wdGlvbnMiLCJjcmVhdGVFbnRyeUZvclVwZGF0ZSIsIl9hcHBseVN0YXRlVG9QdXRPcHRpb25zIiwidXBkYXRlRW50cnkiLCJvblB1dENvbXBsZXRlIiwib25QdXRFcnJvciIsInB1dCIsImNyZWF0ZUl0ZW0iLCJjb252ZXJ0VmFsdWVzIiwiZGlmZlByb3BlcnR5SWdub3JlcyIsImxlZnQiLCJyaWdodCIsImFjYyIsIkRJRkZfRURJVEVEIiwiRGVlcERpZmYiLCJfZGlmZnMiLCJkaWZmIiwicGF0aCIsImluZGV4T2YiLCJraW5kIiwiX2V4dHJhY3RJZFByb3BlcnR5RnJvbUVudHJ5IiwiZ2V0RW50aXR5SWQiLCJnZXRJZGVudGl0eSIsIm9yaWdpbmFsRW50cnkiLCJyZXNwb25zZSIsInNob3dWYWxpZGF0aW9uU3VtbWFyeSIsInNldCIsImhpZGVWYWxpZGF0aW9uU3VtbWFyeSIsImhpZGVDb25jdXJyZW5jeVN1bW1hcnkiLCJnZXRDb250ZXh0IiwicmVzb3VyY2VLaW5kIiwiZ2V0U2VjdXJpdHkiLCJhY2Nlc3MiLCJsb29rdXAiLCJiZWZvcmVUcmFuc2l0aW9uVG8iLCJvblRyYW5zaXRpb25UbyIsImZvY3VzIiwiYWN0aXZhdGUiLCJyZWZyZXNoUmVxdWlyZWRGb3IiLCJvblJlZnJlc2giLCJvblJlZnJlc2hJbnNlcnQiLCJvblJlZnJlc2hVcGRhdGUiLCJnZXRSb3V0ZSIsImJ1aWxkUm91dGUiLCJwYXJ0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ0EsTUFBTUEsV0FBVyxvQkFBWSxVQUFaLENBQWpCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLE1BQU1DLFVBQVUsdUJBQVEsaUJBQVIsRUFBMkIsZ0JBQTNCLEVBQW1DLDhCQUE4QjtBQUMvRTs7Ozs7OztBQU9BQyxrQkFBYztBQUNaQyx5QkFBbUI7QUFDakJDLGNBQU0sdUJBRFc7QUFFakJDLGNBQU07QUFGVyxPQURQO0FBS1pDLDBCQUFvQjtBQUNsQkYsY0FBTSx3QkFEWTtBQUVsQkMsY0FBTTtBQUZZLE9BTFI7QUFTWkUsYUFBTyxlQUFLQyxTQUFMLENBQWVOLFlBQWYsQ0FBNEJLLEtBVHZCO0FBVVpFLGdCQUFVLGVBQUtELFNBQUwsQ0FBZU4sWUFBZixDQUE0Qk87QUFWMUIsS0FSaUU7QUFvQi9FOzs7Ozs7Ozs7Ozs7Ozs7QUFlQUMsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSxDQUMzQixnTEFEMkIsRUFFM0IsMEJBRjJCLEVBRzNCLG9DQUgyQixFQUkzQixxQ0FKMkIsRUFLM0Isa0RBTDJCLEVBTTNCLFFBTjJCLENBQWIsQ0FuQytEO0FBMkMvRTs7Ozs7O0FBTUFDLHFCQUFpQixJQUFJRCxRQUFKLENBQWEsQ0FDNUIsNENBRDRCLEVBRTVCLDJEQUY0QixFQUc1QixxQ0FINEIsRUFJNUIsNkJBSjRCLEVBSzVCLDZCQUw0QixFQU01QiwrQkFONEIsRUFPNUIsOEJBUDRCLEVBUTVCLDhCQVI0QixFQVM1QixRQVQ0QixFQVU1QixtQ0FWNEIsRUFXNUIsUUFYNEIsRUFZNUIsYUFaNEIsQ0FBYixDQWpEOEQ7QUErRC9FOzs7Ozs7QUFNQUUsK0JBQTJCLElBQUlGLFFBQUosQ0FBYSxDQUN0Qyx3Q0FEc0MsRUFFdEMseUNBRnNDLEVBR3RDLHVGQUhzQyxFQUl0QyxPQUpzQyxFQUt0QyxRQUxzQyxDQUFiLENBckVvRDtBQTRFL0U7Ozs7OztBQU1BRyxnQ0FBNEIsSUFBSUgsUUFBSixDQUFhLENBQ3ZDLHlDQUR1QyxFQUV2QywwQ0FGdUMsRUFHdkMsc0RBSHVDLEVBSXZDLE9BSnVDLEVBS3ZDLFFBTHVDLENBQWIsQ0FsRm1EO0FBeUYvRTs7Ozs7OztBQU9BSSxtQ0FBK0IsSUFBSUosUUFBSixDQUFhLENBQzFDLFNBRDBDLEVBRTFDLDZDQUYwQyxFQUcxQywwQ0FIMEMsRUFJMUMsZUFKMEMsQ0FBYixDQWhHZ0Q7QUFzRy9FOzs7O0FBSUFLLG9DQUFnQyxJQUFJTCxRQUFKLENBQWEsQ0FDM0MseURBRDJDLENBQWIsQ0ExRytDO0FBNkcvRTs7Ozs7O0FBTUFNLDBCQUFzQixJQUFJTixRQUFKLENBQWEsNlJBQWIsQ0FuSHlEO0FBNEgvRTs7Ozs7O0FBTUFPLHdCQUFvQixJQUFJUCxRQUFKLENBQWEsQ0FDL0IseUJBRCtCLENBQWIsQ0FsSTJEO0FBcUkvRTs7Ozs7OztBQU9BUSxzQkFBa0IsSUFBSVIsUUFBSixDQUFhLENBQzdCLDRDQUQ2QixFQUU3Qix3SkFGNkIsRUFHN0IsUUFINkIsQ0FBYixDQTVJNkQ7O0FBa0ovRTs7OztBQUlBUyxRQUFJLGNBdEoyRTtBQXVKL0VDLFdBQU8sSUF2SndFO0FBd0ovRTs7OztBQUlBQyxZQUFRLElBNUp1RTtBQTZKL0U7Ozs7QUFJQUMsMEJBQXNCLElBakt5RDtBQWtLL0U7Ozs7O0FBS0FDLHNCQUFrQixNQXZLNkQ7QUF3Sy9FOzs7O0FBSUFDLFlBQVEsS0E1S3VFO0FBNksvRTs7OztBQUlBQyxvQkFBZ0IsS0FqTCtEO0FBa0wvRTs7OztBQUlBQyxvQkFBZ0IsS0F0TCtEOztBQXdML0VDLGNBQVUsTUF4THFFOztBQTBML0U7OztBQUdBQyxjQUFVN0IsU0FBUzZCLFFBN0w0RDtBQThML0U7Ozs7QUFJQUMsZUFBVzlCLFNBQVM4QixTQWxNMkQ7QUFtTS9FOzs7O0FBSUFDLDJCQUF1Qi9CLFNBQVMrQixxQkF2TStDO0FBd00vRTs7OztBQUlBQyw0QkFBd0JoQyxTQUFTZ0Msc0JBNU04QztBQTZNL0U7Ozs7QUFJQUMsaUJBQWFqQyxTQUFTaUMsV0FqTnlEO0FBa04vRTs7OztBQUlBQyxpQkFBYWxDLFNBQVNrQyxXQXROeUQ7QUF1Ti9FOzs7O0FBSUFDLGVBQVc7QUFDVEMsZUFBU3BDLFNBQVNxQyxZQURUO0FBRVRDLGNBQVE7QUFDTixhQUFLdEMsU0FBU3VDO0FBRFI7QUFGQyxLQTNOb0U7QUFpTy9FOzs7O0FBSUFDLDBCQUFzQnhDLFNBQVN3QyxvQkFyT2dEO0FBc08vRTs7OztBQUlBQyx3QkFBb0J6QyxTQUFTeUMsa0JBMU9rRDtBQTJPL0U7Ozs7QUFJQUMsWUFBUSxJQS9PdUU7QUFnUC9FOzs7O0FBSUFDLFdBQU8sSUFwUHdFO0FBcVAvRTs7OztBQUlBQyxlQUFXLElBelBvRTs7QUEyUC9FQyxpQkFBYSxJQTNQa0U7QUE0UC9FQyxpQkFBYSxLQTVQa0U7QUE2UC9FOzs7O0FBSUFDLHFCQUFpQixJQWpROEQ7QUFrUS9FOzs7O0FBSUFDLHNCQUFrQixNQXRRNkQ7QUF1US9FOzs7O0FBSUFDLHNCQUFrQixDQTNRNkQ7QUE0US9FOzs7O0FBSUFDLHFCQUFpQmxELFNBQVNrRCxlQWhScUQ7QUFpUi9FOzs7O0FBSUFDLHVCQUFtQm5ELFNBQVNtRCxpQkFyUm1EO0FBc1IvRTs7Ozs7QUFLQUMsaUJBQWEsU0FBU0EsV0FBVCxHQUFxQixNQUFRO0FBQ3hDLFdBQUtWLE1BQUwsR0FBYyxFQUFkO0FBQ0QsS0E3UjhFO0FBOFIvRTs7Ozs7OztBQU9BVyxhQUFTLFNBQVNBLE9BQVQsR0FBbUI7QUFBQTs7QUFDMUIsV0FBS0MsU0FBTCxDQUFlQyxTQUFmO0FBQ0EsV0FBS0MsYUFBTCxDQUFtQixLQUFLQyx1QkFBTCxDQUE2QixLQUFLQyxZQUFMLEVBQTdCLENBQW5COztBQUVBQyxRQUFFLGlCQUFGLEVBQXFCLEtBQUtDLFdBQTFCLEVBQ0dDLElBREgsQ0FDUSxVQUFDQyxDQUFELEVBQUkxRCxJQUFKLEVBQWE7QUFDakIsWUFBTTJELE9BQU9KLEVBQUV2RCxJQUFGLEVBQVE0RCxJQUFSLENBQWEsWUFBYixDQUFiO0FBQ0EsWUFBTUMsUUFBUSxNQUFLdkIsTUFBTCxDQUFZcUIsSUFBWixDQUFkO0FBQ0EsWUFBSUUsS0FBSixFQUFXO0FBQ1ROLFlBQUVNLE1BQU1DLE9BQVIsRUFBaUJDLFFBQWpCLENBQTBCLE9BQTFCO0FBQ0FGLGdCQUFNRyxRQUFOLENBQWVoRSxJQUFmO0FBQ0Q7QUFDRixPQVJIO0FBU0QsS0FsVDhFO0FBbVQvRTs7O0FBR0FpRSxVQUFNLFNBQVNBLElBQVQsR0FBZ0I7QUFDcEIsV0FBS2YsU0FBTCxDQUFlQyxTQUFmOztBQUVBLFdBQUssSUFBTVEsSUFBWCxJQUFtQixLQUFLckIsTUFBeEIsRUFBZ0M7QUFDOUIsWUFBSSxLQUFLQSxNQUFMLENBQVk0QixjQUFaLENBQTJCUCxJQUEzQixDQUFKLEVBQXNDO0FBQ3BDLGVBQUtyQixNQUFMLENBQVlxQixJQUFaLEVBQWtCTSxJQUFsQjtBQUNEO0FBQ0Y7QUFDRixLQTlUOEU7QUErVC9FOzs7Ozs7Ozs7QUFTQUUsc0JBQWtCLFNBQVNBLGdCQUFULEdBQTRCO0FBQzVDLFVBQU1DLE9BQU8sQ0FBQztBQUNacEQsWUFBSSxNQURRO0FBRVpxRCxnQkFBUSxNQUZJO0FBR1pDLGFBQUssTUFITztBQUlabkUsZUFBTyxLQUFLc0IsUUFKQTtBQUtaOEMsa0JBQVUsS0FBS0MsT0FBTCxJQUFnQixLQUFLQSxPQUFMLENBQWFDLE1BQTdCLEdBQXNDLEtBQUtuRCxjQUEzQyxHQUE0RCxLQUFLQztBQUwvRCxPQUFELENBQWI7O0FBUUEsVUFBSSxDQUFDbUQsSUFBSUMsYUFBSixFQUFMLEVBQTBCO0FBQ3hCUCxhQUFLUSxJQUFMLENBQVU7QUFDUjVELGNBQUksUUFESTtBQUVSc0QsZUFBSyxRQUZHO0FBR1JuRSxpQkFBTyxLQUFLNEMsaUJBSEo7QUFJUjhCLGdCQUFNLE1BSkU7QUFLUlIsa0JBQVE7QUFMQSxTQUFWO0FBT0Q7O0FBRUQsYUFBTyxLQUFLUyxLQUFMLEtBQWUsS0FBS0EsS0FBTCxHQUFhO0FBQ2pDVjtBQURpQyxPQUE1QixDQUFQO0FBR0QsS0E5VjhFO0FBK1YvRVcsa0JBQWMsU0FBU0EsWUFBVCxHQUF3QjtBQUNwQyxXQUFLQyxlQUFMLEdBQXVCLElBQXZCO0FBQ0FDLFdBQUtDLElBQUw7QUFDRCxLQWxXOEU7QUFtVy9FQyxtQkFBZSxTQUFTQSxhQUFULEdBQXlCO0FBQ3RDLGFBQU8sS0FBS2xFLEtBQUwsS0FBZSxLQUFLQSxLQUFMLEdBQWEsS0FBS21FLFdBQUwsRUFBNUIsQ0FBUDtBQUNELEtBclc4RTtBQXNXL0U7Ozs7Ozs7QUFPQUMsa0JBQWMsU0FBU0EsWUFBVCxDQUFzQnhCLEtBQXRCLEVBQTZCO0FBQ3pDTixRQUFFTSxNQUFNeUIsYUFBUixFQUF1QkMsV0FBdkIsQ0FBbUMsWUFBbkM7QUFDQWhDLFFBQUVNLE1BQU15QixhQUFSLEVBQXVCRSxNQUF2QixHQUFnQ0QsV0FBaEMsQ0FBNEMsY0FBNUM7QUFDRCxLQWhYOEU7QUFpWC9FOzs7Ozs7O0FBT0FFLGtCQUFjLFNBQVNBLFlBQVQsQ0FBc0I1QixLQUF0QixFQUE2QjtBQUN6Q04sUUFBRU0sTUFBTXlCLGFBQVIsRUFBdUJ2QixRQUF2QixDQUFnQyxZQUFoQztBQUNBUixRQUFFTSxNQUFNeUIsYUFBUixFQUF1QkUsTUFBdkIsR0FBZ0N6QixRQUFoQyxDQUF5QyxjQUF6QztBQUNELEtBM1g4RTtBQTRYL0U7Ozs7Ozs7QUFPQTJCLG9CQUFnQixTQUFTQSxjQUFULENBQXdCN0IsS0FBeEIsRUFBK0I7QUFDN0NOLFFBQUVNLE1BQU15QixhQUFSLEVBQXVCQyxXQUF2QixDQUFtQyxjQUFuQztBQUNELEtBclk4RTtBQXNZL0U7Ozs7Ozs7QUFPQUkscUJBQWlCLFNBQVNBLGVBQVQsQ0FBeUI5QixLQUF6QixFQUFnQztBQUMvQ04sUUFBRU0sTUFBTXlCLGFBQVIsRUFBdUJ2QixRQUF2QixDQUFnQyxjQUFoQztBQUNELEtBL1k4RTtBQWdaL0U7Ozs7Ozs7OztBQVNBNkIsa0JBQWMsU0FBU0EsWUFBVCxDQUFzQmpDLElBQXRCLEVBQTRCa0MsVUFBNUIsRUFBd0NDLEdBQXhDLEVBQTZDOUYsSUFBN0MsRUFBbUQ7QUFDL0QsVUFBTStGLFlBQVl4QyxFQUFFdkQsSUFBRixFQUFRLEtBQUt3RCxXQUFiLEVBQTBCd0MsT0FBMUIsQ0FBa0MsY0FBbEMsQ0FBbEI7QUFDQSxVQUFNbkMsUUFBUSxLQUFLdkIsTUFBTCxDQUFZeUQsVUFBVUUsTUFBVixHQUFtQixDQUFuQixJQUF3QkYsVUFBVUcsS0FBVixHQUFrQnRDLElBQWxCLENBQXVCLFlBQXZCLENBQXBDLENBQWQ7O0FBRUEsVUFBSUMsU0FBUyxPQUFPQSxNQUFNRixJQUFOLENBQVAsS0FBdUIsVUFBcEMsRUFBZ0Q7QUFDOUMsZUFBT0UsTUFBTUYsSUFBTixFQUFZd0MsS0FBWixDQUFrQnRDLEtBQWxCLEVBQXlCLENBQUNnQyxVQUFELEVBQWFDLEdBQWIsRUFBa0I5RixJQUFsQixDQUF6QixDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxLQUFLa0QsU0FBTCxDQUFlQyxTQUFmLENBQVA7QUFDRCxLQWxhOEU7QUFtYS9FOzs7Ozs7O0FBT0FpRCxlQUFXLFNBQVNBLFNBQVQsQ0FBbUJ6QyxJQUFuQixFQUF5Qm1DLEdBQXpCLEVBQThCOUYsSUFBOUIsRUFBb0M7QUFDN0MsVUFBTStGLFlBQVl4QyxFQUFFdkQsSUFBRixFQUFRLEtBQUt3RCxXQUFiLEVBQTBCd0MsT0FBMUIsQ0FBa0MsY0FBbEMsQ0FBbEI7QUFDQSxVQUFNbkMsUUFBUWtDLGFBQWEsS0FBS3pELE1BQUwsQ0FBWXlELFVBQVVFLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0JGLFVBQVVHLEtBQVYsR0FBa0J0QyxJQUFsQixDQUF1QixZQUF2QixDQUFwQyxDQUEzQjs7QUFFQSxVQUFJQyxTQUFTLE9BQU9BLE1BQU1GLElBQU4sQ0FBUCxLQUF1QixVQUFwQyxFQUFnRDtBQUM5QyxlQUFPLElBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQUtULFNBQUwsQ0FBZUMsU0FBZixDQUFQO0FBQ0QsS0FuYjhFO0FBb2IvRWlDLGlCQUFhLFNBQVNBLFdBQVQsR0FBdUI7QUFDbEMsYUFBTyxJQUFQO0FBQ0QsS0F0YjhFO0FBdWIvRWlCLHFCQUFpQixTQUFTQSxlQUFULEdBQTJCLENBQUUsQ0F2YmlDO0FBd2IvRUMsa0JBQWMsU0FBU0EsWUFBVCxDQUFzQi9ELEtBQXRCLEVBQTZCO0FBQ3pDLGFBQU9BLEtBQVA7QUFDRCxLQTFiOEU7QUEyYi9FOzs7OztBQUtBZ0Usa0JBQWMsU0FBU0EsWUFBVCxDQUFzQmhFLEtBQXRCLEVBQTZCO0FBQ3pDLGFBQU9BLEtBQVA7QUFDRCxLQWxjOEU7QUFtYy9FaUUsK0JBQTJCLFNBQVNBLHlCQUFULENBQW1DakUsS0FBbkMsRUFBMEMsQ0FBRTtBQUN0RSxLQXBjOEU7QUFxYy9Fa0UsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQmxFLEtBQXJCLEVBQTRCO0FBQ3ZDLFdBQUtBLEtBQUwsR0FBYSxLQUFLK0QsWUFBTCxDQUFrQixLQUFLQyxZQUFMLENBQWtCaEUsU0FBUyxFQUEzQixDQUFsQixLQUFxRCxFQUFsRTtBQUNBLFdBQUtpRSx5QkFBTCxDQUErQixLQUFLakUsS0FBcEM7O0FBRUEsV0FBS21FLFNBQUwsQ0FBZW5FLEtBQWYsRUFBc0IsSUFBdEI7O0FBRUE7QUFDQSxVQUFJLEtBQUtvRSxpQkFBVCxFQUE0QjtBQUMxQjtBQUNBLFlBQU1DLGdCQUFnQixLQUFLQyxTQUFMLENBQWUsSUFBZixDQUF0QjtBQUNBLFlBQU1DLFFBQVEsS0FBS0EsS0FBTCxDQUFXLEtBQUtILGlCQUFoQixFQUFtQ0MsYUFBbkMsQ0FBZDs7QUFFQSxZQUFJRSxNQUFNYixNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDcEJhLGdCQUFNQyxPQUFOLENBQWMsU0FBU0EsT0FBVCxDQUFpQkMsR0FBakIsRUFBc0I7QUFDbEMsaUJBQUtDLE1BQUwsQ0FBWXJDLElBQVosQ0FBaUI7QUFDZmpCLG9CQUFNcUQsR0FEUztBQUVmRSx1QkFBUyxLQUFLOUU7QUFGQyxhQUFqQjtBQUlELFdBTEQsRUFLRyxJQUxIOztBQU9BLGVBQUsrRSxzQkFBTDtBQUNELFNBVEQsTUFTTztBQUNMO0FBQ0EsZUFBS0MsSUFBTDtBQUNEOztBQUVELGFBQUtULGlCQUFMLEdBQXlCLElBQXpCO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFJLEtBQUtuQyxPQUFMLENBQWE2QyxPQUFqQixFQUEwQjtBQUN4QixhQUFLQSxPQUFMLEdBQWUsS0FBSzdDLE9BQUwsQ0FBYTZDLE9BQTVCO0FBQ0EsYUFBS1gsU0FBTCxDQUFlLEtBQUtXLE9BQXBCO0FBQ0Q7QUFDRixLQXZlOEU7QUF3ZS9FQyxvQkFBZ0IsU0FBU0EsY0FBVCxDQUF3Qi9FLEtBQXhCLEVBQStCO0FBQzdDLFVBQUk7QUFDRixZQUFJQSxLQUFKLEVBQVc7QUFDVCxlQUFLa0UsV0FBTCxDQUFpQmxFLEtBQWpCO0FBQ0QsU0FGRCxNQUVPLENBQUU7QUFDUDtBQUNEOztBQUVEZ0IsVUFBRSxLQUFLTyxPQUFQLEVBQWdCeUIsV0FBaEIsQ0FBNEIsZUFBNUI7O0FBRUE7QUFDQSxhQUFLYyxlQUFMO0FBQ0QsT0FYRCxDQVdFLE9BQU9rQixDQUFQLEVBQVU7QUFDVkMsZ0JBQVFDLEtBQVIsQ0FBY0YsQ0FBZCxFQURVLENBQ1E7QUFDbkI7QUFDRixLQXZmOEU7QUF3Zi9FRyxpQkFBYSxTQUFTQSxXQUFULENBQXFCQyxVQUFyQixFQUFpQ0YsS0FBakMsRUFBd0M7QUFDbkQsV0FBS0csV0FBTCxDQUFpQkgsS0FBakI7QUFDQWxFLFFBQUUsS0FBS08sT0FBUCxFQUFnQnlCLFdBQWhCLENBQTRCLGVBQTVCO0FBQ0QsS0EzZjhFO0FBNGYvRTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBakMsa0JBQWMsU0FBU0EsWUFBVCxHQUF3QjtBQUNwQyxhQUFPLEtBQUtwQyxNQUFMLElBQWUsRUFBdEI7QUFDRCxLQXpoQjhFOztBQTJoQi9FMkcseUJBQXFCLFNBQVNBLG1CQUFULEdBQStCO0FBQ2xELFdBQUtDLGFBQUwsR0FBcUIsS0FBS0EsYUFBTCxJQUFzQixDQUFDO0FBQzFDbkUsY0FBTSxjQURvQztBQUUxQ29FLGNBQU0sU0FBU0MsZ0JBQVQsQ0FBMEJQLEtBQTFCLEVBQWlDO0FBQ3JDLGlCQUFPQSxTQUFTQSxNQUFNdkYsTUFBTixLQUFpQixLQUFLK0YsV0FBTCxDQUFpQkMsbUJBQWxEO0FBQ0QsU0FKeUM7QUFLMUNDLGdCQUFRLFNBQVNDLGtCQUFULENBQTRCWCxLQUE1QixFQUFtQ1ksSUFBbkMsRUFBeUM7QUFDL0NBLGlCQUQrQyxDQUN2Qzs7QUFFUjtBQUNBO0FBQ0EsZUFBSzFCLGlCQUFMLEdBQXlCLEtBQUtFLFNBQUwsQ0FBZSxJQUFmLENBQXpCO0FBQ0EsZUFBS3JDLE9BQUwsQ0FBYThELEdBQWIsR0FBbUIsS0FBSy9GLEtBQUwsQ0FBV2dHLElBQTlCLENBTitDLENBTVg7QUFDcEMsaUJBQU8sS0FBSy9ELE9BQUwsQ0FBYWpDLEtBQXBCLENBUCtDLENBT3BCO0FBQzNCLGVBQUtpRyxPQUFMO0FBQ0Q7QUFkeUMsT0FBRCxFQWV4QztBQUNEN0UsY0FBTSxZQURMO0FBRURvRSxjQUFNLFNBQVNVLFNBQVQsQ0FBbUJoQixLQUFuQixFQUEwQjtBQUM5QixpQkFBT0EsTUFBTXZGLE1BQU4sS0FBaUIsS0FBSytGLFdBQUwsQ0FBaUJDLG1CQUF6QztBQUNELFNBSkE7QUFLREMsZ0JBQVEsU0FBU08sV0FBVCxDQUFxQmpCLEtBQXJCLEVBQTRCWSxJQUE1QixFQUFrQztBQUN4Q00sZ0JBQU0sS0FBS0MsZUFBTCxDQUFxQm5CLEtBQXJCLENBQU4sRUFEd0MsQ0FDSjtBQUNwQ1k7QUFDRDtBQVJBLE9BZndDLEVBd0J4QztBQUNEMUUsY0FBTSxVQURMO0FBRURvRSxjQUFNLFNBQVNjLFlBQVQsR0FBd0I7QUFDNUIsaUJBQU8sSUFBUDtBQUNELFNBSkE7QUFLRFYsZ0JBQVEsU0FBU1csY0FBVCxDQUF3QnJCLEtBQXhCLEVBQStCWSxJQUEvQixFQUFxQztBQUMzQyxjQUFNVSxjQUFjLEtBQUt2RSxPQUFMLENBQWF1RSxXQUFqQztBQUNBLGVBQUt2RSxPQUFMLENBQWF1RSxXQUFiLEdBQTJCLElBQTNCO0FBQ0EsY0FBTUMsWUFBWTtBQUNoQkMseUJBQWF4QjtBQURHLFdBQWxCOztBQUlBLGlDQUFheUIsUUFBYixDQUFzQixLQUFLTixlQUFMLENBQXFCbkIsS0FBckIsQ0FBdEIsRUFBbUR1QixTQUFuRDtBQUNBLGVBQUt4RSxPQUFMLENBQWF1RSxXQUFiLEdBQTJCQSxXQUEzQjtBQUNBVjtBQUNEO0FBZkEsT0F4QndDLENBQTNDOztBQTBDQSxhQUFPLEtBQUtQLGFBQVo7QUFDRCxLQXZrQjhFO0FBd2tCL0U7Ozs7O0FBS0FxQixZQUFRLFNBQVNBLE1BQVQsR0FBa0I7QUFDeEIsVUFBSUMsTUFBTSxLQUFLNUUsT0FBTCxJQUFnQixLQUFLQSxPQUFMLENBQWFqQyxLQUE3QixJQUFzQyxLQUFLaUMsT0FBTCxDQUFhakMsS0FBYixDQUFtQixLQUFLOEcsVUFBeEIsQ0FBaEQ7QUFDQSxVQUFJLENBQUNELEdBQUwsRUFBVTtBQUNSQSxjQUFNLEtBQUs1RSxPQUFMLElBQWdCLEtBQUtBLE9BQUwsQ0FBYThELEdBQW5DO0FBQ0Q7O0FBRUQsYUFBT2MsR0FBUDtBQUNELEtBcGxCOEU7QUFxbEIvRWhHLG1CQUFlLFNBQVNBLGFBQVQsQ0FBdUJsQyxNQUF2QixFQUErQjtBQUM1QyxVQUFNb0ksT0FBUXBJLE9BQU9xSSxRQUFQLElBQW1CckksT0FBT3NJLEVBQTFCLElBQWdDdEksTUFBOUM7QUFDQSxVQUFNdUksZUFBZSxFQUFyQjtBQUNBLFVBQU1DLFVBQVUsRUFBaEI7QUFDQSxVQUFJQyxpQkFBaUIsS0FBckI7QUFDQSxVQUFJQyxnQkFBSjs7QUFFQSxVQUFJLENBQUMxSSxPQUFPc0QsT0FBWixFQUFxQjtBQUNuQnRELGVBQU9zRCxPQUFQLEdBQWlCO0FBQ2ZyRSxpQkFBTyxLQUFLMEI7QUFERyxTQUFqQjtBQUdEO0FBQ0QsV0FBSyxJQUFJNkIsSUFBSSxDQUFiLEVBQWdCQSxJQUFJNEYsS0FBS3JELE1BQXpCLEVBQWlDdkMsR0FBakMsRUFBc0M7QUFDcENrRyxrQkFBVU4sS0FBSzVGLENBQUwsQ0FBVjs7QUFFQSxZQUFJa0csUUFBUUwsUUFBUixJQUFvQkssUUFBUUosRUFBaEMsRUFBb0M7QUFDbEMsY0FBSUcsY0FBSixFQUFvQjtBQUNsQkYseUJBQWE3RSxJQUFiLENBQWtCZ0YsT0FBbEI7QUFDRCxXQUZELE1BRU87QUFDTCxpQkFBS3hHLGFBQUwsQ0FBbUJ3RyxPQUFuQjtBQUNEOztBQUVEO0FBQ0Q7O0FBRUQsWUFBSSxDQUFDRCxjQUFMLEVBQXFCO0FBQ25CQSwyQkFBaUIsSUFBakI7QUFDQUQsa0JBQVE5RSxJQUFSLENBQWEsS0FBSy9ELG9CQUFMLENBQTBCc0YsS0FBMUIsQ0FBZ0NqRixNQUFoQyxFQUF3QyxJQUF4QyxDQUFiO0FBQ0F3SSxrQkFBUTlFLElBQVIsQ0FBYSw0QkFBYjtBQUNEOztBQUVELGFBQUtpRixnQkFBTCxDQUFzQkQsT0FBdEIsRUFBK0JGLE9BQS9CO0FBQ0Q7QUFDREEsY0FBUTlFLElBQVIsQ0FBYSxRQUFiO0FBQ0E4RSxjQUFROUUsSUFBUixDQUFhLEtBQUs5RCxrQkFBTCxDQUF3QnFGLEtBQXhCLENBQThCakYsTUFBOUIsRUFBc0MsSUFBdEMsQ0FBYjtBQUNBLFVBQU00SSxjQUFjdkcsRUFBRW1HLFFBQVFLLElBQVIsQ0FBYSxFQUFiLENBQUYsQ0FBcEI7QUFDQUQsa0JBQVlFLFNBQVo7QUFDQSxXQUFLQyxrQkFBTCxDQUF3QkgsWUFBWUksR0FBWixDQUFnQixDQUFoQixDQUF4QixFQUE0Q04sT0FBNUM7QUFDQXJHLFFBQUUsS0FBS0MsV0FBUCxFQUFvQjJHLE1BQXBCLENBQTJCTCxXQUEzQjs7QUFFQSxXQUFLLElBQUlwRyxLQUFJLENBQWIsRUFBZ0JBLEtBQUkrRixhQUFheEQsTUFBakMsRUFBeUN2QyxJQUF6QyxFQUE4QztBQUM1Q2tHLGtCQUFVSCxhQUFhL0YsRUFBYixDQUFWOztBQUVBLGFBQUtOLGFBQUwsQ0FBbUJ3RyxPQUFuQjtBQUNEO0FBQ0YsS0Fsb0I4RTtBQW1vQi9FSyx3QkFBb0IsU0FBU0Esa0JBQVQsR0FBNEIsd0JBQTBCLENBQUUsQ0Fub0JHO0FBb29CL0VKLHNCQUFrQixTQUFTQSxnQkFBVCxDQUEwQjNJLE1BQTFCLEVBQWtDd0ksT0FBbEMsRUFBMkM7QUFDM0QsVUFBTVUsT0FBTyx1QkFBYUYsR0FBYixDQUFpQmhKLE9BQU9qQixJQUF4QixDQUFiO0FBQ0EsVUFBSW1LLElBQUosRUFBVTtBQUNSLFlBQU12RyxRQUFRLEtBQUt2QixNQUFMLENBQVlwQixPQUFPeUMsSUFBUCxJQUFlekMsT0FBT21KLFFBQWxDLElBQThDLElBQUlELElBQUosQ0FBUyxlQUFLRSxLQUFMLENBQVc7QUFDOUVDLGlCQUFPO0FBRHVFLFNBQVgsRUFFbEVySixNQUZrRSxDQUFULENBQTVEOztBQUlBLFlBQU1zSixXQUFXM0csTUFBTTlDLGdCQUFOLElBQTBCLEtBQUtBLGdCQUFoRDs7QUFFQSxZQUFJOEMsTUFBTTRHLFNBQU4sSUFBbUIsQ0FBQyxLQUFLaEksV0FBN0IsRUFBMEM7QUFDeEMsZUFBS0EsV0FBTCxHQUFtQm9CLEtBQW5CO0FBQ0QsU0FGRCxNQUVPLElBQUlBLE1BQU00RyxTQUFOLElBQW1CLEtBQUtoSSxXQUE1QixFQUF5QztBQUM5QyxnQkFBTSxJQUFJaUksS0FBSixDQUFVLG1FQUFWLENBQU47QUFDRDs7QUFFRCxhQUFLQyxPQUFMLENBQWE5RyxLQUFiLEVBQW9CLFFBQXBCLEVBQThCLEtBQUt3QixZQUFuQztBQUNBLGFBQUtzRixPQUFMLENBQWE5RyxLQUFiLEVBQW9CLFFBQXBCLEVBQThCLEtBQUs0QixZQUFuQztBQUNBLGFBQUtrRixPQUFMLENBQWE5RyxLQUFiLEVBQW9CLFVBQXBCLEVBQWdDLEtBQUs2QixjQUFyQztBQUNBLGFBQUtpRixPQUFMLENBQWE5RyxLQUFiLEVBQW9CLFdBQXBCLEVBQWlDLEtBQUs4QixlQUF0Qzs7QUFFQSxZQUFJLEtBQUtoRCxlQUFULEVBQTBCO0FBQ3hCLGNBQUlpSSxTQUFTLEVBQWI7QUFDQSxjQUFJL0csTUFBTTVELElBQU4sS0FBZSxRQUFuQixFQUE2QjtBQUMzQjJLLHFCQUFTLGNBQVQ7QUFDRDtBQUNEbEIsa0JBQVE5RSxJQUFSLGtCQUE0QixLQUFLaEMsZ0JBQWpDLGlCQUE2RGdJLE1BQTdEO0FBQ0Q7QUFDRGxCLGdCQUFROUUsSUFBUixDQUFhNEYsU0FBU3JFLEtBQVQsQ0FBZXRDLEtBQWYsRUFBc0IsSUFBdEIsQ0FBYjtBQUNBLFlBQUksS0FBS2xCLGVBQVQsRUFBMEI7QUFDeEIrRyxrQkFBUTlFLElBQVIsQ0FBYSxRQUFiO0FBQ0Q7QUFDRjtBQUNGLEtBcHFCOEU7QUFxcUIvRTs7O0FBR0FpRyxpQkFBYSxTQUFTQSxXQUFULEdBQXVCO0FBQUE7O0FBQ2xDLFVBQU01SixRQUFRLEtBQUtpSixHQUFMLENBQVMsT0FBVCxDQUFkOztBQUVBLFVBQUksS0FBS1ksTUFBVCxFQUFpQjtBQUNmLGVBQU8sS0FBS0MscUJBQUwsR0FBNkJDLElBQTdCLENBQWtDLFVBQUNDLElBQUQsRUFBVTtBQUNqRCxpQkFBSzNELGNBQUwsQ0FBb0IyRCxJQUFwQjtBQUNELFNBRk0sRUFFSixVQUFDQyxHQUFELEVBQVM7QUFDVixpQkFBS3hELFdBQUwsQ0FBaUIsSUFBakIsRUFBdUJ3RCxHQUF2QjtBQUNELFNBSk0sQ0FBUDtBQUtELE9BTkQsTUFNTyxJQUFJakssS0FBSixFQUFXO0FBQ2hCLFlBQU0wRyxhQUFhLEVBQW5COztBQUVBLGFBQUt3RCx1QkFBTCxDQUE2QnhELFVBQTdCOztBQUVBLFlBQU15RCxnQkFBZ0IsS0FBS0MsbUJBQUwsTUFBOEIsSUFBcEQ7QUFDQSxZQUFNQyxhQUFhLEtBQUtDLHFCQUFMLENBQTJCSCxhQUEzQixFQUEwQ3pELFVBQTFDLENBQW5COztBQUVBLDRCQUFLMkQsVUFBTCxFQUNFLEtBQUtoRSxjQUFMLENBQW9Ca0UsSUFBcEIsQ0FBeUIsSUFBekIsQ0FERixFQUVFLEtBQUs5RCxXQUFMLENBQWlCOEQsSUFBakIsQ0FBc0IsSUFBdEIsRUFBNEI3RCxVQUE1QixDQUZGOztBQUtBLGVBQU8yRCxVQUFQO0FBQ0Q7O0FBRUQ5RCxjQUFRaUUsSUFBUixDQUFhLGdIQUFiLEVBekJrQyxDQXlCOEY7QUFDakksS0Fsc0I4RTtBQW1zQi9FViwyQkFBdUIsU0FBU0EscUJBQVQsR0FBaUM7QUFDdEQsYUFBTyxLQUFLRCxNQUFMLENBQVlZLFFBQVosQ0FBcUIsS0FBS2xILE9BQTFCLENBQVA7QUFDRCxLQXJzQjhFO0FBc3NCL0UrRywyQkFBdUIsU0FBU0EscUJBQVQsQ0FBK0JILGFBQS9CLEVBQThDekQsVUFBOUMsRUFBMEQ7QUFDL0UsVUFBTTFHLFFBQVEsS0FBS2lKLEdBQUwsQ0FBUyxPQUFULENBQWQ7QUFDQSxhQUFPakosTUFBTWlKLEdBQU4sQ0FBVWtCLGFBQVYsRUFBeUJ6RCxVQUF6QixDQUFQO0FBQ0QsS0F6c0I4RTtBQTBzQi9FOzs7O0FBSUFnRSx3QkFBb0IsU0FBU0Esa0JBQVQsR0FBOEI7QUFDaEQsV0FBSyxJQUFNaEksSUFBWCxJQUFtQixLQUFLckIsTUFBeEIsRUFBZ0M7QUFDOUIsWUFBSSxLQUFLQSxNQUFMLENBQVk0QixjQUFaLENBQTJCUCxJQUEzQixDQUFKLEVBQXNDO0FBQ3BDLGNBQU1FLFFBQVEsS0FBS3ZCLE1BQUwsQ0FBWXFCLElBQVosQ0FBZDtBQUNBLGNBQU1pSSxlQUFlL0gsTUFBTWdJLE9BQTNCOztBQUVBLGNBQUksT0FBT0QsWUFBUCxLQUF3QixXQUE1QixFQUF5QztBQUN2QztBQUNEOztBQUVEL0gsZ0JBQU1pSSxRQUFOLENBQWUsS0FBS0MsZ0JBQUwsQ0FBc0JILFlBQXRCLEVBQW9DL0gsS0FBcEMsQ0FBZjtBQUNEO0FBQ0Y7QUFDRixLQTN0QjhFO0FBNHRCL0U7OztBQUdBbUksaUJBQWEsU0FBU0EsV0FBVCxHQUF1QjtBQUNsQyxXQUFLLElBQU1ySSxJQUFYLElBQW1CLEtBQUtyQixNQUF4QixFQUFnQztBQUM5QixZQUFJLEtBQUtBLE1BQUwsQ0FBWTRCLGNBQVosQ0FBMkJQLElBQTNCLENBQUosRUFBc0M7QUFDcEMsZUFBS3JCLE1BQUwsQ0FBWXFCLElBQVosRUFBa0JzSSxVQUFsQjtBQUNEO0FBQ0Y7QUFDRixLQXJ1QjhFO0FBc3VCL0U7Ozs7Ozs7Ozs7QUFVQXZGLGVBQVcsU0FBU0EsU0FBVCxDQUFtQndGLE1BQW5CLEVBQTJCQyxPQUEzQixFQUFvQztBQUM3QyxVQUFNQyxVQUFVLEVBQWhCOztBQUVBLFdBQUssSUFBTXpJLElBQVgsSUFBbUIsS0FBS3JCLE1BQXhCLEVBQWdDO0FBQzlCLFlBQUksS0FBS0EsTUFBTCxDQUFZNEIsY0FBWixDQUEyQlAsSUFBM0IsQ0FBSixFQUFzQztBQUNwQyxjQUFNRSxRQUFRLEtBQUt2QixNQUFMLENBQVlxQixJQUFaLENBQWQ7QUFDQSxjQUFJMEksY0FBSjtBQUNBO0FBQ0EsY0FBSXhJLE1BQU15SSxRQUFOLEVBQUosRUFBc0I7QUFDcEI7QUFDRDs7QUFFRCxjQUFJekksTUFBTTBJLE9BQU4sS0FBa0IsS0FBdEIsRUFBNkI7QUFDM0JGLG9CQUFRLGtCQUFRRyxRQUFSLENBQWlCTixNQUFqQixFQUF5QnJJLE1BQU0wSSxPQUEvQixFQUF3Q0gsT0FBeEMsQ0FBUjtBQUNELFdBRkQsTUFFTztBQUNMQyxvQkFBUSxrQkFBUUcsUUFBUixDQUFpQk4sTUFBakIsRUFBeUJySSxNQUFNd0csUUFBTixJQUFrQjFHLElBQTNDLEVBQWlEeUksT0FBakQsQ0FBUjtBQUNEOztBQUVEO0FBQ0EsY0FBSUMsVUFBVUQsT0FBZCxFQUF1QjtBQUNyQnZJLGtCQUFNaUksUUFBTixDQUFlTyxLQUFmLEVBQXNCRixPQUF0QjtBQUNBNUksY0FBRU0sTUFBTXlCLGFBQVIsRUFBdUJDLFdBQXZCLENBQW1DLFdBQW5DO0FBQ0Q7QUFDRjtBQUNGO0FBQ0YsS0F6d0I4RTtBQTB3Qi9FOzs7Ozs7Ozs7QUFTQXNCLGVBQVcsU0FBU0EsU0FBVCxDQUFtQjRGLEdBQW5CLEVBQXdCO0FBQ2pDLFVBQU1DLFVBQVUsRUFBaEI7QUFDQSxVQUFJQyxRQUFRLElBQVo7O0FBRUEsV0FBSyxJQUFNaEosSUFBWCxJQUFtQixLQUFLckIsTUFBeEIsRUFBZ0M7QUFDOUIsWUFBSSxLQUFLQSxNQUFMLENBQVk0QixjQUFaLENBQTJCUCxJQUEzQixDQUFKLEVBQXNDO0FBQ3BDLGNBQU1FLFFBQVEsS0FBS3ZCLE1BQUwsQ0FBWXFCLElBQVosQ0FBZDtBQUNBLGNBQU0wSSxRQUFReEksTUFBTTJJLFFBQU4sRUFBZDs7QUFFQSxjQUFNSSxVQUFVLEtBQUtiLGdCQUFMLENBQXNCbEksTUFBTStJLE9BQTVCLEVBQXFDUCxLQUFyQyxFQUE0Q3hJLEtBQTVDLEVBQW1ELElBQW5ELENBQWhCO0FBQ0EsY0FBTWdKLFVBQVUsS0FBS2QsZ0JBQUwsQ0FBc0JsSSxNQUFNZ0osT0FBNUIsRUFBcUNSLEtBQXJDLEVBQTRDeEksS0FBNUMsRUFBbUQsSUFBbkQsQ0FBaEI7O0FBRUE7Ozs7Ozs7O0FBUUEsY0FBSStJLFlBQVlFLFNBQVosSUFBeUIsQ0FBQ0YsT0FBOUIsRUFBdUM7QUFDckM7QUFDRDtBQUNELGNBQUlDLFlBQVlDLFNBQVosSUFBeUJELE9BQTdCLEVBQXNDO0FBQ3BDO0FBQ0Q7O0FBRUQ7QUFDQSxjQUFJSixPQUFRLENBQUM1SSxNQUFNa0osY0FBTixJQUF3QmxKLE1BQU1tSixPQUFOLEVBQXhCLElBQTJDSixPQUE1QyxLQUF3RCxDQUFDL0ksTUFBTXlJLFFBQU4sRUFBckUsRUFBd0Y7QUFDdEYsZ0JBQUl6SSxNQUFNMEksT0FBTixLQUFrQixLQUF0QixFQUE2QjtBQUMzQixrQkFBSSxPQUFPMUksTUFBTTBJLE9BQWIsS0FBeUIsVUFBN0IsRUFBeUM7QUFDdkMsb0JBQUksUUFBT0YsS0FBUCx5Q0FBT0EsS0FBUCxPQUFpQixRQUFyQixFQUErQjtBQUM3QjtBQUNBLHVCQUFLLElBQU1ZLElBQVgsSUFBbUJaLEtBQW5CLEVBQTBCO0FBQ3hCLHdCQUFJQSxNQUFNbkksY0FBTixDQUFxQitJLElBQXJCLENBQUosRUFBZ0M7QUFDOUJQLDhCQUFRTyxJQUFSLElBQWdCWixNQUFNWSxJQUFOLENBQWhCO0FBQ0Q7QUFDRjtBQUNGOztBQUVEcEosc0JBQU0wSSxPQUFOLENBQWNHLE9BQWQsRUFBdUJMLEtBQXZCO0FBQ0QsZUFYRCxNQVdPLElBQUksT0FBT3hJLE1BQU0wSSxPQUFiLEtBQXlCLFFBQTdCLEVBQXVDO0FBQzVDLG9CQUFNVyxTQUFTLGtCQUFRVixRQUFSLENBQWlCRSxPQUFqQixFQUEwQjdJLE1BQU0wSSxPQUFoQyxDQUFmO0FBQ0EsK0JBQUtqQyxLQUFMLENBQVc0QyxNQUFYLEVBQW1CYixLQUFuQjtBQUNEO0FBQ0YsYUFoQkQsTUFnQk87QUFDTCxnQ0FBUVAsUUFBUixDQUFpQlksT0FBakIsRUFBMEI3SSxNQUFNd0csUUFBTixJQUFrQjFHLElBQTVDLEVBQWtEMEksS0FBbEQ7QUFDRDs7QUFFRE0sb0JBQVEsS0FBUjtBQUNEO0FBQ0Y7QUFDRjtBQUNELGFBQU9BLFFBQVEsS0FBUixHQUFnQkQsT0FBdkI7QUFDRCxLQXowQjhFO0FBMDBCL0U7Ozs7O0FBS0FTLGNBQVUsU0FBU0EsUUFBVCxHQUFvQjtBQUM1QixXQUFLbEcsTUFBTCxHQUFjLEVBQWQ7O0FBRUEsV0FBSyxJQUFNdEQsSUFBWCxJQUFtQixLQUFLckIsTUFBeEIsRUFBZ0M7QUFDOUIsWUFBSSxLQUFLQSxNQUFMLENBQVk0QixjQUFaLENBQTJCUCxJQUEzQixDQUFKLEVBQXNDO0FBQ3BDLGNBQU1FLFFBQVEsS0FBS3ZCLE1BQUwsQ0FBWXFCLElBQVosQ0FBZDs7QUFFQSxjQUFNeUosU0FBU3ZKLE1BQU1zSixRQUFOLEVBQWY7QUFDQSxjQUFJLENBQUN0SixNQUFNeUksUUFBTixFQUFELElBQXFCYyxXQUFXLEtBQXBDLEVBQTJDO0FBQ3pDN0osY0FBRU0sTUFBTXlCLGFBQVIsRUFBdUJ2QixRQUF2QixDQUFnQyxXQUFoQzs7QUFFQSxpQkFBS2tELE1BQUwsQ0FBWXJDLElBQVosQ0FBaUI7QUFDZmpCLHdCQURlO0FBRWZ1RCx1QkFBU2tHO0FBRk0sYUFBakI7QUFJRCxXQVBELE1BT087QUFDTDdKLGNBQUVNLE1BQU15QixhQUFSLEVBQXVCQyxXQUF2QixDQUFtQyxXQUFuQztBQUNEO0FBQ0Y7QUFDRjs7QUFFRCxhQUFPLEtBQUswQixNQUFMLENBQVloQixNQUFaLEdBQXFCLENBQXJCLEdBQXlCLEtBQUtnQixNQUE5QixHQUF1QyxLQUE5QztBQUNELEtBcjJCOEU7QUFzMkIvRTs7OztBQUlBb0csb0JBQWdCLFNBQVNBLGNBQVQsR0FBMEI7QUFDeEMsYUFBTyxLQUFLQyxJQUFaO0FBQ0QsS0E1MkI4RTtBQTYyQi9FOzs7QUFHQUMsYUFBUyxTQUFTQSxPQUFULEdBQW1CO0FBQzFCLFdBQUtELElBQUwsR0FBWSxJQUFaOztBQUVBLFVBQUk1SSxJQUFJOEksSUFBSixDQUFTcEosSUFBYixFQUFtQjtBQUNqQk0sWUFBSThJLElBQUosQ0FBU3BKLElBQVQsQ0FBY3FKLFdBQWQsQ0FBMEIsTUFBMUI7QUFDRDs7QUFFRGxLLFFBQUUsTUFBRixFQUFVUSxRQUFWLENBQW1CLE1BQW5CLEVBUDBCLENBT0M7QUFDNUIsS0F4M0I4RTtBQXkzQi9FOzs7QUFHQTJKLFlBQVEsU0FBU0EsTUFBVCxHQUFrQjtBQUN4QixXQUFLSixJQUFMLEdBQVksS0FBWjs7QUFFQSxVQUFJNUksSUFBSThJLElBQUosQ0FBU3BKLElBQWIsRUFBbUI7QUFDakJNLFlBQUk4SSxJQUFKLENBQVNwSixJQUFULENBQWN1SixVQUFkLENBQXlCLE1BQXpCO0FBQ0Q7O0FBRURwSyxRQUFFLE1BQUYsRUFBVWdDLFdBQVYsQ0FBc0IsTUFBdEIsRUFQd0IsQ0FPTTtBQUMvQixLQXA0QjhFO0FBcTRCL0U7Ozs7O0FBS0FkLFlBQVEsU0FBU0EsTUFBVCxHQUFrQjtBQUN4QixXQUFLOEksT0FBTDs7QUFFQSxVQUFNckIsU0FBUyxLQUFLckYsU0FBTCxFQUFmO0FBQ0EsVUFBSXFGLE1BQUosRUFBWTtBQUNWLGFBQUswQixRQUFMLENBQWMxQixNQUFkO0FBQ0QsT0FGRCxNQUVPO0FBQ0xqSCxhQUFLQyxJQUFMO0FBQ0Q7QUFDRixLQW41QjhFO0FBbzVCL0UwSSxjQUFVLFNBQVNBLFFBQVQsQ0FBa0IxQixNQUFsQixFQUEwQjtBQUFBOztBQUNsQyxVQUFNakwsUUFBUSxLQUFLaUosR0FBTCxDQUFTLE9BQVQsQ0FBZDtBQUNBLFVBQU0yRCxhQUFhO0FBQ2pCQyxtQkFBVztBQURNLE9BQW5CO0FBR0EsVUFBTXZMLFFBQVEsS0FBS3dMLG9CQUFMLENBQTBCN0IsTUFBMUIsQ0FBZDtBQUNBLFdBQUs4Qix1QkFBTCxDQUE2QkgsVUFBN0I7QUFDQSxVQUFJLEtBQUsvQyxNQUFULEVBQWlCO0FBQ2YsYUFBS0EsTUFBTCxDQUFZbUQsV0FBWixDQUF3QjFMLEtBQXhCLEVBQStCc0wsVUFBL0IsRUFBMkM3QyxJQUEzQyxDQUFnRCxVQUFDQyxJQUFELEVBQVU7QUFDeEQsaUJBQUtpRCxhQUFMLENBQW1CM0wsS0FBbkIsRUFBMEIwSSxJQUExQjtBQUNELFNBRkQsRUFFRyxVQUFDQyxHQUFELEVBQVM7QUFDVixpQkFBS2lELFVBQUwsQ0FBZ0JOLFVBQWhCLEVBQTRCM0MsR0FBNUI7QUFDRCxTQUpEO0FBS0QsT0FORCxNQU1PLElBQUlqSyxLQUFKLEVBQVc7QUFDaEIsNEJBQUtBLE1BQU1tTixHQUFOLENBQVU3TCxLQUFWLEVBQWlCc0wsVUFBakIsQ0FBTCxFQUNFLEtBQUtLLGFBQUwsQ0FBbUIxQyxJQUFuQixDQUF3QixJQUF4QixFQUE4QmpKLEtBQTlCLENBREYsRUFFRSxLQUFLNEwsVUFBTCxDQUFnQjNDLElBQWhCLENBQXFCLElBQXJCLEVBQTJCcUMsVUFBM0IsQ0FGRjtBQUlEO0FBQ0YsS0F2NkI4RTtBQXc2Qi9FRyw2QkFBeUIsU0FBU0EsdUJBQVQsR0FBaUMsZUFBaUIsQ0FBRSxDQXg2QkU7QUF5NkIvRUUsbUJBQWUsU0FBU0EsYUFBVCxDQUF1QjNMLEtBQXZCLEVBQThCNkssTUFBOUIsRUFBc0M7QUFDbkQsV0FBS00sTUFBTDs7QUFFQSxVQUFNeEcsVUFBVSxLQUFLbUgsb0JBQUwsQ0FBMEI5TCxLQUExQixFQUFpQzZLLE1BQWpDLENBQWhCO0FBQ0Esd0JBQVFrQixPQUFSLENBQWdCLGNBQWhCLEVBQWdDLENBQUNwSCxPQUFELENBQWhDOztBQUVBLFdBQUtxSCxpQkFBTCxDQUF1Qm5CLE1BQXZCO0FBQ0QsS0FoN0I4RTtBQWk3Qi9FZSxnQkFBWSxTQUFTQSxVQUFULENBQW9CTixVQUFwQixFQUFnQ3BHLEtBQWhDLEVBQXVDO0FBQ2pELFdBQUtpRyxNQUFMO0FBQ0EsV0FBSzlGLFdBQUwsQ0FBaUJILEtBQWpCO0FBQ0QsS0FwN0I4RTtBQXE3Qi9FOzs7O0FBSUE4Ryx1QkFBbUIsU0FBU0EsaUJBQVQsR0FBMkIsVUFBWTtBQUN4RDtBQUNBdEosV0FBS0MsSUFBTDtBQUNELEtBNTdCOEU7QUE2N0IvRTs7Ozs7QUFLQXNKLFlBQVEsU0FBU0EsTUFBVCxHQUFrQjtBQUN4QixVQUFNdEMsU0FBUyxLQUFLckYsU0FBTCxFQUFmO0FBQ0EsVUFBSXFGLE1BQUosRUFBWTtBQUNWLGFBQUtxQixPQUFMO0FBQ0EsYUFBS2tCLFFBQUwsQ0FBY3ZDLE1BQWQ7QUFDRCxPQUhELE1BR087QUFDTCxhQUFLd0MsaUJBQUwsQ0FBdUIsS0FBdkI7QUFDRDtBQUNGLEtBMThCOEU7QUEyOEIvRUQsY0FBVSxTQUFTQSxRQUFULENBQWtCdkMsTUFBbEIsRUFBMEI7QUFBQTs7QUFDbEMsVUFBTWpMLFFBQVEsS0FBS2lKLEdBQUwsQ0FBUyxPQUFULENBQWQ7QUFDQSxVQUFNeUUsYUFBYTtBQUNqQmIsbUJBQVc7QUFETSxPQUFuQjtBQUdBLFVBQU12TCxRQUFRLEtBQUtxTSxvQkFBTCxDQUEwQjFDLE1BQTFCLENBQWQ7QUFDQSxXQUFLMkMsdUJBQUwsQ0FBNkJGLFVBQTdCO0FBQ0EsVUFBSSxLQUFLN0QsTUFBVCxFQUFpQjtBQUNmLGFBQUtBLE1BQUwsQ0FBWWdFLFdBQVosQ0FBd0J2TSxLQUF4QixFQUErQm9NLFVBQS9CLEVBQTJDM0QsSUFBM0MsQ0FBZ0QsVUFBQ0MsSUFBRCxFQUFVO0FBQ3hELGlCQUFLOEQsYUFBTCxDQUFtQnhNLEtBQW5CLEVBQTBCMEksSUFBMUI7QUFDRCxTQUZELEVBRUcsVUFBQ0MsR0FBRCxFQUFTO0FBQ1YsaUJBQUs4RCxVQUFMLENBQWdCTCxVQUFoQixFQUE0QnpELEdBQTVCO0FBQ0QsU0FKRDtBQUtELE9BTkQsTUFNTyxJQUFJakssS0FBSixFQUFXO0FBQ2hCLDRCQUFLQSxNQUFNZ08sR0FBTixDQUFVMU0sS0FBVixFQUFpQm9NLFVBQWpCLENBQUwsRUFDRSxLQUFLSSxhQUFMLENBQW1CdkQsSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEJqSixLQUE5QixDQURGLEVBRUUsS0FBS3lNLFVBQUwsQ0FBZ0J4RCxJQUFoQixDQUFxQixJQUFyQixFQUEyQm1ELFVBQTNCLENBRkY7QUFJRDtBQUNGLEtBOTlCOEU7QUErOUIvRTs7Ozs7QUFLQU8sZ0JBQVksU0FBU0EsVUFBVCxHQUFzQjtBQUNoQyxVQUFNaEQsU0FBUyxLQUFLckYsU0FBTCxFQUFmOztBQUVBLGFBQU8sS0FBS3JFLFNBQUwsR0FBaUIsS0FBS3VMLG9CQUFMLENBQTBCN0IsTUFBMUIsQ0FBakIsR0FBcUQsS0FBSzBDLG9CQUFMLENBQTBCMUMsTUFBMUIsQ0FBNUQ7QUFDRCxLQXgrQjhFO0FBeStCL0U7Ozs7O0FBS0EwQywwQkFBc0IsU0FBU0Esb0JBQVQsQ0FBOEIxQyxNQUE5QixFQUFzQztBQUMxRCxhQUFPLEtBQUtpRCxhQUFMLENBQW1CakQsTUFBbkIsQ0FBUDtBQUNELEtBaC9COEU7QUFpL0IvRTs7Ozs7QUFLQTZCLDBCQUFzQixTQUFTQSxvQkFBVCxDQUE4QjdCLE1BQTlCLEVBQXNDO0FBQzFELGFBQU8sS0FBS2lELGFBQUwsQ0FBbUJqRCxNQUFuQixDQUFQO0FBQ0QsS0F4L0I4RTtBQXkvQi9FOzs7QUFHQWlELG1CQUFlLFNBQVNBLGFBQVQsQ0FBdUJqRCxNQUF2QixFQUErQjtBQUM1QyxhQUFPQSxNQUFQO0FBQ0QsS0E5L0I4RTtBQSsvQi9FMkMsNkJBQXlCLFNBQVNBLHVCQUFULEdBQWlDLGVBQWlCLENBQUUsQ0EvL0JFO0FBZ2dDL0VFLG1CQUFlLFNBQVNBLGFBQVQsQ0FBdUJ4TSxLQUF2QixFQUE4QjZLLE1BQTlCLEVBQXNDO0FBQ25ELFdBQUtNLE1BQUw7O0FBRUEsVUFBTXhHLFVBQVUsS0FBS21ILG9CQUFMLENBQTBCOUwsS0FBMUIsRUFBaUM2SyxNQUFqQyxDQUFoQjs7QUFFQSx3QkFBUWtCLE9BQVIsQ0FBZ0IsY0FBaEIsRUFBZ0MsQ0FBQ3BILE9BQUQsQ0FBaEM7O0FBRUEsV0FBS3dILGlCQUFMLENBQXVCdEIsTUFBdkI7QUFDRCxLQXhnQzhFO0FBeWdDL0U0QixnQkFBWSxTQUFTQSxVQUFULENBQW9CTCxVQUFwQixFQUFnQ2xILEtBQWhDLEVBQXVDO0FBQ2pELFdBQUtpRyxNQUFMO0FBQ0EsV0FBSzlGLFdBQUwsQ0FBaUJILEtBQWpCO0FBQ0QsS0E1Z0M4RTtBQTZnQy9FOzs7QUFHQTJILHlCQUFxQixFQWhoQzBEO0FBaWhDL0U7Ozs7O0FBS0F0SSxXQUFPLFNBQVNBLEtBQVQsQ0FBZXVJLElBQWYsRUFBcUJDLEtBQXJCLEVBQTRCO0FBQUE7O0FBQ2pDLFVBQU1DLE1BQU0sRUFBWjtBQUNBLFVBQU1DLGNBQWMsR0FBcEI7O0FBRUEsVUFBSUMsUUFBSixFQUFjO0FBQ1osWUFBTUMsU0FBU0QsU0FBU0UsSUFBVCxDQUFjTixJQUFkLEVBQW9CQyxLQUFwQixFQUEyQixVQUFDTSxJQUFELEVBQU90SCxHQUFQLEVBQWU7QUFDdkQsY0FBSSxPQUFLOEcsbUJBQUwsQ0FBeUJTLE9BQXpCLENBQWlDdkgsR0FBakMsS0FBeUMsQ0FBN0MsRUFBZ0Q7QUFDOUMsbUJBQU8sSUFBUDtBQUNEO0FBQ0YsU0FKYyxDQUFmOztBQU1BLFlBQUlvSCxNQUFKLEVBQVk7QUFDVkEsaUJBQU8zSSxPQUFQLENBQWUsVUFBQzRJLElBQUQsRUFBVTtBQUN2QixnQkFBTUMsT0FBT0QsS0FBS0MsSUFBTCxDQUFVN0YsSUFBVixDQUFlLEdBQWYsQ0FBYjtBQUNBLGdCQUFJNEYsS0FBS0csSUFBTCxLQUFjTixXQUFkLElBQTZCRCxJQUFJTSxPQUFKLENBQVlELElBQVosTUFBc0IsQ0FBQyxDQUF4RCxFQUEyRDtBQUN6REwsa0JBQUkzSyxJQUFKLENBQVNnTCxJQUFUO0FBQ0Q7QUFDRixXQUxEO0FBTUQ7QUFDRjs7QUFFRCxhQUFPTCxHQUFQO0FBQ0QsS0E1aUM4RTtBQTZpQy9FUSxpQ0FBNkIsU0FBU0EsMkJBQVQsQ0FBcUN4TixLQUFyQyxFQUE0QztBQUN2RSxVQUFNdEIsUUFBUSxLQUFLaUosR0FBTCxDQUFTLE9BQVQsQ0FBZDtBQUNBLFVBQUksS0FBS1ksTUFBVCxFQUFpQjtBQUNmLGVBQU8sS0FBS0EsTUFBTCxDQUFZa0YsV0FBWixDQUF3QnpOLEtBQXhCLENBQVA7QUFDRCxPQUZELE1BRU8sSUFBSXRCLEtBQUosRUFBVztBQUNoQixlQUFPQSxNQUFNZ1AsV0FBTixDQUFrQjFOLEtBQWxCLENBQVA7QUFDRDs7QUFFRCxhQUFPLEVBQVA7QUFDRCxLQXRqQzhFO0FBdWpDL0U4TCwwQkFBc0IsU0FBU0Esb0JBQVQsQ0FBOEI2QixhQUE5QixFQUE2Q0MsUUFBN0MsRUFBdUQ7QUFDM0UsVUFBSUQsYUFBSixFQUFtQjtBQUNqQixZQUFNbFAsS0FBSyxLQUFLK08sMkJBQUwsQ0FBaUNHLGFBQWpDLENBQVg7QUFDQSxlQUFPO0FBQ0xsUCxnQkFESztBQUVMc0gsZUFBS3RILEVBRkE7QUFHTGlLLGdCQUFNa0Y7QUFIRCxTQUFQO0FBS0Q7QUFDRixLQWhrQzhFO0FBaWtDL0U7Ozs7QUFJQXpCLHVCQUFtQixTQUFTQSxpQkFBVCxHQUEyQixVQUFZO0FBQ3hEO0FBQ0F6SixXQUFLQyxJQUFMO0FBQ0QsS0F4a0M4RTtBQXlrQy9FOzs7O0FBSUFrTCwyQkFBdUIsU0FBU0EscUJBQVQsR0FBaUM7QUFDdEQsVUFBTTFHLFVBQVUsRUFBaEI7O0FBRUEsV0FBSyxJQUFJaEcsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLEtBQUt1RCxNQUFMLENBQVloQixNQUFoQyxFQUF3Q3ZDLEdBQXhDLEVBQTZDO0FBQzNDZ0csZ0JBQVE5RSxJQUFSLENBQWEsS0FBS2pFLDZCQUFMLENBQW1Dd0YsS0FBbkMsQ0FBeUMsS0FBS2MsTUFBTCxDQUFZdkQsQ0FBWixDQUF6QyxFQUF5RCxLQUFLcEIsTUFBTCxDQUFZLEtBQUsyRSxNQUFMLENBQVl2RCxDQUFaLEVBQWVDLElBQTNCLENBQXpELENBQWI7QUFDRDs7QUFFRCxXQUFLME0sR0FBTCxDQUFTLG1CQUFULEVBQThCM0csUUFBUUssSUFBUixDQUFhLEVBQWIsQ0FBOUI7QUFDQXhHLFFBQUUsS0FBS08sT0FBUCxFQUFnQkMsUUFBaEIsQ0FBeUIsa0JBQXpCO0FBQ0QsS0F0bEM4RTtBQXVsQy9Fb0QsNEJBQXdCLFNBQVNBLHNCQUFULEdBQWtDO0FBQ3hELFVBQU11QyxVQUFVLEVBQWhCOztBQUVBLFdBQUssSUFBSWhHLElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLdUQsTUFBTCxDQUFZaEIsTUFBaEMsRUFBd0N2QyxHQUF4QyxFQUE2QztBQUMzQ2dHLGdCQUFROUUsSUFBUixDQUFhLEtBQUtoRSw4QkFBTCxDQUFvQ3VGLEtBQXBDLENBQTBDLEtBQUtjLE1BQUwsQ0FBWXZELENBQVosQ0FBMUMsQ0FBYjtBQUNEOztBQUVELFdBQUsyTSxHQUFMLENBQVMsb0JBQVQsRUFBK0IzRyxRQUFRSyxJQUFSLENBQWEsRUFBYixDQUEvQjtBQUNBeEcsUUFBRSxLQUFLTyxPQUFQLEVBQWdCQyxRQUFoQixDQUF5Qiw4QkFBekI7QUFDRCxLQWhtQzhFO0FBaW1DL0U7OztBQUdBdU0sMkJBQXVCLFNBQVNBLHFCQUFULEdBQWlDO0FBQ3REL00sUUFBRSxLQUFLTyxPQUFQLEVBQWdCeUIsV0FBaEIsQ0FBNEIsa0JBQTVCO0FBQ0EsV0FBSzhLLEdBQUwsQ0FBUyxtQkFBVCxFQUE4QixFQUE5QjtBQUNELEtBdm1DOEU7QUF3bUMvRTs7O0FBR0FFLDRCQUF3QixTQUFTQSxzQkFBVCxHQUFrQztBQUN4RGhOLFFBQUUsS0FBS08sT0FBUCxFQUFnQnlCLFdBQWhCLENBQTRCLDhCQUE1QjtBQUNBLFdBQUs4SyxHQUFMLENBQVMsb0JBQVQsRUFBK0IsRUFBL0I7QUFDRCxLQTltQzhFO0FBK21DL0U7Ozs7Ozs7QUFPQWpKLFVBQU0sU0FBU0EsSUFBVCxHQUFnQjtBQUNwQixVQUFJLEtBQUtpRyxjQUFMLEVBQUosRUFBMkI7QUFDekI7QUFDRDs7QUFFRCxXQUFLaUQscUJBQUw7QUFDQSxXQUFLQyxzQkFBTDs7QUFFQSxVQUFJLEtBQUtwRCxRQUFMLE9BQW9CLEtBQXhCLEVBQStCO0FBQzdCLGFBQUtpRCxxQkFBTDtBQUNBO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLNU4sU0FBVCxFQUFvQjtBQUNsQixhQUFLaUMsTUFBTDtBQUNELE9BRkQsTUFFTztBQUNMLGFBQUsrSixNQUFMO0FBQ0Q7QUFDRixLQXhvQzhFO0FBeW9DL0U7Ozs7QUFJQWdDLGdCQUFZLFNBQVNBLFVBQVQsR0FBc0I7QUFDaEMsYUFBTyxlQUFLbEcsS0FBTCxDQUFXLEtBQUtwSCxTQUFMLENBQWVDLFNBQWYsQ0FBWCxFQUFzQztBQUMzQ3NOLHNCQUFjLEtBQUtBLFlBRHdCO0FBRTNDaE0sZ0JBQVEsS0FBS0QsT0FBTCxDQUFhQyxNQUZzQjtBQUczQzZELGFBQUssS0FBSzlELE9BQUwsQ0FBYUMsTUFBYixHQUFzQixLQUF0QixHQUE4QixLQUFLRCxPQUFMLENBQWE4RCxHQUFiLEdBQW1CLEtBQUs5RCxPQUFMLENBQWE4RCxHQUFoQyxHQUFzQyxLQUFLOUQsT0FBTCxDQUFhakMsS0FBYixJQUFzQixLQUFLaUMsT0FBTCxDQUFhakMsS0FBYixDQUFtQixLQUFLOEcsVUFBeEIsQ0FIcEQsQ0FHd0Y7QUFIeEYsT0FBdEMsQ0FBUDtBQUtELEtBbnBDOEU7QUFvcEMvRTs7OztBQUlBcUgsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQkMsTUFBckIsRUFBNkI7QUFDeEMsVUFBTUMsU0FBUztBQUNicEMsZ0JBQVEsS0FBS2pOLGNBREE7QUFFYmtELGdCQUFRLEtBQUtuRDtBQUZBLE9BQWY7O0FBS0EsYUFBT3NQLE9BQU9ELE1BQVAsQ0FBUDtBQUNELEtBL3BDOEU7QUFncUMvRTs7O0FBR0FFLHdCQUFvQixTQUFTQSxrQkFBVCxHQUE4QjtBQUNoRCxVQUFJLEtBQUs3TCxlQUFULEVBQTBCO0FBQ3hCLFlBQUksS0FBS1IsT0FBTCxDQUFhQyxNQUFiLEtBQXdCLElBQXhCLElBQWlDLEtBQUtELE9BQUwsQ0FBYThELEdBQWIsSUFBb0IsQ0FBQyxLQUFLOUQsT0FBTCxDQUFhakMsS0FBdkUsRUFBK0U7QUFDN0VnQixZQUFFLEtBQUtPLE9BQVAsRUFBZ0JDLFFBQWhCLENBQXlCLGVBQXpCO0FBQ0QsU0FGRCxNQUVPO0FBQ0xSLFlBQUUsS0FBS08sT0FBUCxFQUFnQnlCLFdBQWhCLENBQTRCLGVBQTVCO0FBQ0Q7QUFDRjs7QUFFRCxXQUFLckMsU0FBTCxDQUFlQyxTQUFmO0FBQ0QsS0E3cUM4RTtBQThxQy9FMk4sb0JBQWdCLFNBQVNBLGNBQVQsR0FBMEI7QUFDeEM7QUFDQTtBQUNBLFVBQUksS0FBS3JPLFdBQUwsSUFBb0IsQ0FBQyxLQUFLQyxXQUE5QixFQUEyQztBQUN6QyxhQUFLRCxXQUFMLENBQWlCc08sS0FBakI7QUFDQSxhQUFLck8sV0FBTCxHQUFtQixJQUFuQjtBQUNEOztBQUVELFdBQUtRLFNBQUwsQ0FBZUMsU0FBZjtBQUNELEtBdnJDOEU7QUF3ckMvRTs7Ozs7O0FBTUE2TixjQUFVLFNBQVNBLFFBQVQsR0FBb0IsQ0FBRSxDQTlyQytDO0FBK3JDL0U7Ozs7QUFJQUMsd0JBQW9CLFNBQVNBLGtCQUFULENBQTRCek0sT0FBNUIsRUFBcUM7QUFDdkQsVUFBSSxLQUFLQSxPQUFULEVBQWtCO0FBQ2hCLFlBQUlBLE9BQUosRUFBYTtBQUNYLGNBQUksS0FBS0EsT0FBTCxDQUFhOEQsR0FBYixJQUFvQixLQUFLOUQsT0FBTCxDQUFhOEQsR0FBYixLQUFxQjlELFFBQVE4RCxHQUFyRCxFQUEwRDtBQUN4RCxtQkFBTyxLQUFQO0FBQ0Q7QUFDRjtBQUNGOztBQUVELGFBQU8sS0FBS3BGLFNBQUwsQ0FBZUMsU0FBZixDQUFQO0FBQ0QsS0E3c0M4RTtBQThzQy9FOzs7Ozs7O0FBT0FxRixhQUFTLFNBQVNBLE9BQVQsR0FBbUI7QUFDMUIsV0FBSzBJLFNBQUw7QUFDQSxXQUFLM08sS0FBTCxHQUFhLEtBQWI7QUFDQSxXQUFLOEUsT0FBTCxHQUFlLEtBQWY7QUFDQSxXQUFLN0UsU0FBTCxHQUFrQixLQUFLZ0MsT0FBTCxDQUFhQyxNQUFiLEtBQXdCLElBQTFDO0FBQ0EsV0FBSy9CLFdBQUwsR0FBbUIsS0FBbkI7O0FBRUFhLFFBQUUsS0FBS08sT0FBUCxFQUFnQnlCLFdBQWhCLENBQTRCLGtCQUE1QjtBQUNBaEMsUUFBRSxLQUFLTyxPQUFQLEVBQWdCeUIsV0FBaEIsQ0FBNEIsOEJBQTVCOztBQUVBLFdBQUt5RyxXQUFMOztBQUVBLFVBQUksS0FBS3hKLFNBQVQsRUFBb0I7QUFDbEIsYUFBSzJPLGVBQUw7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLQyxlQUFMO0FBQ0Q7QUFDRixLQXR1QzhFO0FBdXVDL0VGLGVBQVcsU0FBU0EsU0FBVCxHQUFxQixDQUFFLENBdnVDNkM7QUF3dUMvRUMscUJBQWlCLFNBQVNBLGVBQVQsR0FBMkIsQ0FBRSxDQXh1Q2lDO0FBeXVDL0VDLHFCQUFpQixTQUFTQSxlQUFULEdBQTJCO0FBQzFDO0FBQ0EsVUFBSSxLQUFLNU0sT0FBTCxDQUFhakMsS0FBakIsRUFBd0I7QUFDdEIsYUFBS2tFLFdBQUwsQ0FBaUIsS0FBS2pDLE9BQUwsQ0FBYWpDLEtBQTlCOztBQUVBO0FBQ0EsWUFBSSxLQUFLaUMsT0FBTCxDQUFhNkMsT0FBakIsRUFBMEI7QUFDeEIsZUFBS0EsT0FBTCxHQUFlLEtBQUs3QyxPQUFMLENBQWE2QyxPQUE1QjtBQUNBLGVBQUtYLFNBQUwsQ0FBZSxLQUFLVyxPQUFwQjtBQUNEO0FBQ0YsT0FSRCxNQVFPO0FBQ0w7QUFDQSxZQUFJLEtBQUs3QyxPQUFMLENBQWE4RCxHQUFqQixFQUFzQjtBQUNwQixlQUFLdUMsV0FBTDtBQUNEO0FBQ0Y7QUFDRixLQXp2QzhFO0FBMHZDL0V3RyxjQUFVLFNBQVNBLFFBQVQsR0FBb0I7QUFDNUIsYUFBVSxLQUFLclEsRUFBZjtBQUNELEtBNXZDOEU7QUE2dkMvRXNRLGdCQUFZLFNBQVNBLFVBQVQsR0FBc0I7QUFDaEMsVUFBTUMsUUFBUSxFQUFkO0FBQ0EsVUFBTXZRLEtBQUssS0FBS0EsRUFBaEI7QUFDQXVRLFlBQU0zTSxJQUFOLENBQVc1RCxFQUFYOztBQUVBLFVBQU1zSCxNQUFNLEtBQUthLE1BQUwsTUFBa0IsS0FBSzVHLEtBQUwsSUFBYyxLQUFLQSxLQUFMLENBQVcsS0FBSzhHLFVBQWhCLENBQTVDO0FBQ0EsVUFBSWYsR0FBSixFQUFTO0FBQ1BpSixjQUFNM00sSUFBTixDQUFXMEQsR0FBWDtBQUNEOztBQUVELGFBQU9pSixNQUFNeEgsSUFBTixDQUFXLEdBQVgsQ0FBUDtBQUNEO0FBeHdDOEUsR0FBakUsQ0FBaEI7O29CQTJ3Q2VsSyxPIiwiZmlsZSI6Il9FZGl0QmFzZS5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgY29ubmVjdCBmcm9tICdkb2pvL19iYXNlL2Nvbm5lY3QnO1xyXG5pbXBvcnQgd2hlbiBmcm9tICdkb2pvL3doZW4nO1xyXG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xyXG5pbXBvcnQgRXJyb3JNYW5hZ2VyIGZyb20gJy4vRXJyb3JNYW5hZ2VyJztcclxuaW1wb3J0IEZpZWxkTWFuYWdlciBmcm9tICcuL0ZpZWxkTWFuYWdlcic7XHJcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuaW1wb3J0ICcuL0ZpZWxkcy9Cb29sZWFuRmllbGQnO1xyXG5pbXBvcnQgJy4vRmllbGRzL0RhdGVGaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvRGVjaW1hbEZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9Ecm9wZG93bkZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9EdXJhdGlvbkZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9IaWRkZW5GaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvTG9va3VwRmllbGQnO1xyXG5pbXBvcnQgJy4vRmllbGRzL05vdGVGaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvUGhvbmVGaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvU2VsZWN0RmllbGQnO1xyXG5pbXBvcnQgJy4vRmllbGRzL1NpZ25hdHVyZUZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9UZXh0QXJlYUZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9UZXh0RmllbGQnO1xyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnZWRpdEJhc2UnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX0VkaXRCYXNlXHJcbiAqIEBjbGFzc2Rlc2MgQW4gRWRpdCBWaWV3IGlzIGEgZHVhbCBwdXJwb3NlIHZpZXcgLSB1c2VkIGZvciBib3RoIENyZWF0aW5nIGFuZCBVcGRhdGluZyByZWNvcmRzLiBJdCBpcyBjb21wcmlzZWRcclxuICogb2YgYSBsYXlvdXQgc2ltaWxhciB0byBEZXRhaWwgcm93cyBidXQgYXJlIGluc3RlYWQgRWRpdCBmaWVsZHMuXHJcbiAqXHJcbiAqIEEgdW5pcXVlIHBhcnQgb2YgdGhlIEVkaXQgdmlldyBpcyBpdCdzIGxpZmVjeWNsZSBpbiBjb21wYXJpc29uIHRvIERldGFpbC4gVGhlIERldGFpbCB2aWV3IGlzIHRvcm5cclxuICogZG93biBhbmQgcmVidWlsdCB3aXRoIGV2ZXJ5IHJlY29yZC4gV2l0aCBFZGl0IHRoZSBmb3JtIGlzIGVtcHRpZWQgKEhUTUwgbGVmdCBpbi10YWN0KSBhbmQgbmV3IHZhbHVlc1xyXG4gKiBhcmUgYXBwbGllZCB0byB0aGUgZmllbGRzLlxyXG4gKlxyXG4gKiBTaW5jZSBFZGl0IFZpZXdzIGFyZSB0eXBpY2FsbHkgdGhlIFwibGFzdFwiIHZpZXcgKHlvdSBhbHdheXMgY29tZSBmcm9tIGEgTGlzdCBvciBEZXRhaWwgdmlldykgaXQgd2FycmFudHNcclxuICogc3BlY2lhbCBhdHRlbnRpb24gdG8gdGhlIG5hdmlnYXRpb24gb3B0aW9ucyB0aGF0IGFyZSBwYXNzZWQsIGFzIHRoZXkgZ3JlYXRseSBjb250cm9sIGhvdyB0aGUgRWRpdCB2aWV3XHJcbiAqIGZ1bmN0aW9ucyBhbmQgb3BlcmF0ZXMuXHJcbiAqIEBleHRlbmRzIGFyZ29zLlZpZXdcclxuICogQHJlcXVpcmVzIGFyZ29zLlV0aWxpdHlcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5FcnJvck1hbmFnZXJcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5GaWVsZE1hbmFnZXJcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5Cb29sZWFuRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5EZWNpbWFsRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5EdXJhdGlvbkZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuSGlkZGVuRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5Mb29rdXBGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRzLk5vdGVGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRzLlBob25lRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5TZWxlY3RGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRzLlNpZ25hdHVyZUZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuVGV4dEFyZWFGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRzLlRleHRGaWVsZFxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLl9FZGl0QmFzZScsIFtWaWV3XSwgLyoqIEBsZW5kcyBhcmdvcy5fRWRpdEJhc2UjICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIENyZWF0ZXMgYSBzZXR0ZXIgbWFwIHRvIGh0bWwgbm9kZXMsIG5hbWVseTpcclxuICAgKlxyXG4gICAqICogdmFsaWRhdGlvbkNvbnRlbnQgPT4gdmFsaWRhdGlvbkNvbnRlbnROb2RlJ3MgaW5uZXJIVE1MXHJcbiAgICpcclxuICAgKi9cclxuICBhdHRyaWJ1dGVNYXA6IHtcclxuICAgIHZhbGlkYXRpb25Db250ZW50OiB7XHJcbiAgICAgIG5vZGU6ICd2YWxpZGF0aW9uQ29udGVudE5vZGUnLFxyXG4gICAgICB0eXBlOiAnaW5uZXJIVE1MJyxcclxuICAgIH0sXHJcbiAgICBjb25jdXJyZW5jeUNvbnRlbnQ6IHtcclxuICAgICAgbm9kZTogJ2NvbmN1cnJlbmN5Q29udGVudE5vZGUnLFxyXG4gICAgICB0eXBlOiAnaW5uZXJIVE1MJyxcclxuICAgIH0sXHJcbiAgICB0aXRsZTogVmlldy5wcm90b3R5cGUuYXR0cmlidXRlTWFwLnRpdGxlLFxyXG4gICAgc2VsZWN0ZWQ6IFZpZXcucHJvdG90eXBlLmF0dHJpYnV0ZU1hcC5zZWxlY3RlZCxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSB2aWV3J3MgbWFpbiBET00gZWxlbWVudCB3aGVuIHRoZSB2aWV3IGlzIGluaXRpYWxpemVkLlxyXG4gICAqIFRoaXMgdGVtcGxhdGUgaW5jbHVkZXMgbG9hZGluZ1RlbXBsYXRlIGFuZCB2YWxpZGF0aW9uU3VtbWFyeVRlbXBsYXRlLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgdXNlcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICpcclxuICAgKiAgICAgIG5hbWUgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgKiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiAgICAgIGlkICAgICAgICAgICAgICAgICAgIG1haW4gY29udGFpbmVyIGRpdiBpZFxyXG4gICAqICAgICAgdGl0bGUgICAgICAgICAgICAgICAgbWFpbiBjb250YWluZXIgZGl2IHRpdGxlIGF0dHJcclxuICAgKiAgICAgIGNscyAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWwgY2xhc3Mgc3RyaW5nIGFkZGVkIHRvIHRoZSBtYWluIGNvbnRhaW5lciBkaXZcclxuICAgKiAgICAgIHJlc291cmNlS2luZCAgICAgICAgIHNldCB0byBkYXRhLXJlc291cmNlLWtpbmRcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgaWQ9XCJ7JT0gJC5pZCAlfVwiIGRhdGEtdGl0bGU9XCJ7JTogJC50aXRsZVRleHQgJX1cIiBjbGFzcz1cImVkaXQgcGFuZWwgc2Nyb2xsYWJsZSB7JT0gJC5jbHMgJX1cIiB7JSBpZiAoJC5yZXNvdXJjZUtpbmQpIHsgJX1kYXRhLXJlc291cmNlLWtpbmQ9XCJ7JT0gJC5yZXNvdXJjZUtpbmQgJX1cInslIH0gJX0+JyxcclxuICAgICd7JSEgJC5sb2FkaW5nVGVtcGxhdGUgJX0nLFxyXG4gICAgJ3slISAkLnZhbGlkYXRpb25TdW1tYXJ5VGVtcGxhdGUgJX0nLFxyXG4gICAgJ3slISAkLmNvbmN1cnJlbmN5U3VtbWFyeVRlbXBsYXRlICV9JyxcclxuICAgICc8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJjb250ZW50Tm9kZVwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgc2hvd24gd2hlbiBkYXRhIGlzIGJlaW5nIGxvYWRlZC5cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIGxvYWRpbmdUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZmllbGRzZXQgY2xhc3M9XCJwYW5lbC1sb2FkaW5nLWluZGljYXRvclwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yLWNvbnRhaW5lclwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yIGFjdGl2ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBvbmVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdHdvXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHRocmVlXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZvdXJcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZml2ZVwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8c3Bhbj57JTogJC5sb2FkaW5nVGV4dCAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9maWVsZHNldD4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCBmb3IgdGhlIHZhbGlkYXRpb24gc3VtbWFyeSBhcmVhLCB0aGlzIGRpdiBpcyBzaG93bi9oaWRkZW4gYXMgbmVlZGVkLlxyXG4gICAqXHJcbiAgICogYCRgID0+IHRoZSB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgdmFsaWRhdGlvblN1bW1hcnlUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwicGFuZWwtdmFsaWRhdGlvbi1zdW1tYXJ5XCI+JyxcclxuICAgICc8aDM+eyU6ICQudmFsaWRhdGlvblN1bW1hcnlUZXh0ICV9PC9oMz4nLFxyXG4gICAgJzx1bCBjbGFzcz1cInBhbmVsLXZhbGlkYXRpb24tbWVzc2FnZXNcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwidmFsaWRhdGlvbkNvbnRlbnROb2RlXCI+JyxcclxuICAgICc8L3VsPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgZm9yIHRoZSBjb25jdXJyZW5jeSBlcnJvciBhcmVhLCB0aGlzIGRpdiBpcyBzaG93bi9oaWRkZW4gYXMgbmVlZGVkLlxyXG4gICAqXHJcbiAgICogYCRgID0+IHRoZSB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgY29uY3VycmVuY3lTdW1tYXJ5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInBhbmVsLWNvbmN1cnJlbmN5LXN1bW1hcnlcIj4nLFxyXG4gICAgJzxoMz57JTogJC5jb25jdXJyZW5jeVN1bW1hcnlUZXh0ICV9PC9oMz4nLFxyXG4gICAgJzx1bCBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiY29uY3VycmVuY3lDb250ZW50Tm9kZVwiPicsXHJcbiAgICAnPC91bD4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHNob3duIHdoZW4gZGF0YSBpcyBiZWluZyBsb2FkZWQuXHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiB2YWxpZGF0aW9uIGVycm9yIG9iamVjdFxyXG4gICAqICogYCQkYCA9PiBmaWVsZCBpbnN0YW5jZSB0aGF0IHRoZSBlcnJvciBpcyBvblxyXG4gICAqL1xyXG4gIHZhbGlkYXRpb25TdW1tYXJ5SXRlbVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaT48cD4nLFxyXG4gICAgJzxhIGNsYXNzPVwiaHlwZXJsaW5rXCIgaHJlZj1cIiN7JT0gJC5uYW1lICV9XCI+JyxcclxuICAgICc8Yj57JTogJCQubGFiZWwgJX08L2I+OiB7JTogJC5tZXNzYWdlICV9JyxcclxuICAgICc8L2E+PC9wPjwvbGk+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqICogYCRgID0+IHZhbGlkYXRpb24gZXJyb3Igb2JqZWN0XHJcbiAgICovXHJcbiAgY29uY3VycmVuY3lTdW1tYXJ5SXRlbVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaT48cD48Yj57JTogJCQubmFtZSAlfTwvYj46IHslOiAkLm1lc3NhZ2UgJX08L3A+PC9saT4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IHN0YXJ0cyBhIG5ldyBzZWN0aW9uIGluY2x1ZGluZyB0aGUgY29sbGFwc2libGUgaGVhZGVyXHJcbiAgICpcclxuICAgKiBgJGAgPT4gdGhlIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBzZWN0aW9uQmVnaW5UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgIGA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24taGVhZGVyIGlzLXNlbGVjdGVkXCI+XHJcbiAgICAgICAgPGEgaHJlZj1cIiNcIj48c3Bhbj57JTogKCQudGl0bGUgfHwgJC5vcHRpb25zLnRpdGxlKSAlfTwvc3Bhbj48L2E+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uLXBhbmVcIj5cclxuICAgICAgICA8ZmllbGRzZXQgY2xhc3M9XCJhY2NvcmRpb24tY29udGVudCB7JT0gKCQuY2xzIHx8ICQub3B0aW9ucy5jbHMpICV9XCI+XHJcbiAgICBgLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IGVuZHMgYSBzZWN0aW9uXHJcbiAgICpcclxuICAgKiBgJGAgPT4gdGhlIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBzZWN0aW9uRW5kVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPC9maWVsZHNldD48L2Rpdj48L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCBjcmVhdGVkIGZvciBlYWNoIHByb3BlcnR5IChmaWVsZCByb3cpLlxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gdGhlIGZpZWxkIHJvdyBvYmplY3QgZGVmaW5lZCBpbiB7QGxpbmsgI2NyZWF0ZUxheW91dCBjcmVhdGVMYXlvdXR9LlxyXG4gICAqICogYCQkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHByb3BlcnR5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGEgbmFtZT1cInslPSAkLm5hbWUgfHwgJC5wcm9wZXJ0eSAlfVwiPjwvYT4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJyb3ctZWRpdCB7JT0gJC5jbHMgJX17JSBpZiAoJC5yZWFkb25seSkgeyAlfXJvdy1yZWFkb25seXslIH0gJX1cIiBkYXRhLWZpZWxkPVwieyU9ICQubmFtZSB8fCAkLnByb3BlcnR5ICV9XCIgZGF0YS1maWVsZC10eXBlPVwieyU9ICQudHlwZSAlfVwiPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGUgdmlld1xyXG4gICAqL1xyXG4gIGlkOiAnZ2VuZXJpY19lZGl0JyxcclxuICBzdG9yZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgbGF5b3V0IGRlZmluaXRpb24gdGhhdCBjb25zdHJ1Y3RzIHRoZSBkZXRhaWwgdmlldyB3aXRoIHNlY3Rpb25zIGFuZCByb3dzXHJcbiAgICovXHJcbiAgbGF5b3V0OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge0Jvb2xlYW59XHJcbiAgICogRW5hYmxlcyB0aGUgdXNlIG9mIHRoZSBjdXN0b21pemF0aW9uIGVuZ2luZSBvbiB0aGlzIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBlbmFibGVDdXN0b21pemF0aW9uczogdHJ1ZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgY3VzdG9taXphdGlvbiBpZGVudGlmaWVyIGZvciB0aGlzIGNsYXNzLiBXaGVuIGEgY3VzdG9taXphdGlvbiBpcyByZWdpc3RlcmVkIGl0IGlzIHBhc3NlZFxyXG4gICAqIGEgcGF0aC9pZGVudGlmaWVyIHdoaWNoIGlzIHRoZW4gbWF0Y2hlZCB0byB0aGlzIHByb3BlcnR5LlxyXG4gICAqL1xyXG4gIGN1c3RvbWl6YXRpb25TZXQ6ICdlZGl0JyxcclxuICAvKipcclxuICAgKiBAY2ZnIHtCb29sZWFufVxyXG4gICAqIENvbnRyb2xzIGlmIHRoZSB2aWV3IHNob3VsZCBiZSBleHBvc2VkXHJcbiAgICovXHJcbiAgZXhwb3NlOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmcvT2JqZWN0fVxyXG4gICAqIE1heSBiZSB1c2VkIGZvciB2ZXJpZnlpbmcgdGhlIHZpZXcgaXMgYWNjZXNzaWJsZSBmb3IgY3JlYXRpbmcgZW50cmllc1xyXG4gICAqL1xyXG4gIGluc2VydFNlY3VyaXR5OiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmcvT2JqZWN0fVxyXG4gICAqIE1heSBiZSB1c2VkIGZvciB2ZXJpZnlpbmcgdGhlIHZpZXcgaXMgYWNjZXNzaWJsZSBmb3IgZWRpdGluZyBlbnRyaWVzXHJcbiAgICovXHJcbiAgdXBkYXRlU2VjdXJpdHk6IGZhbHNlLFxyXG5cclxuICB2aWV3VHlwZTogJ2VkaXQnLFxyXG5cclxuICAvKipcclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIHNhdmVUZXh0OiByZXNvdXJjZS5zYXZlVGV4dCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogRGVmYXVsdCB0aXRsZSB0ZXh0IHNob3duIGluIHRoZSB0b3AgdG9vbGJhclxyXG4gICAqL1xyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBwbGFjZWQgaW4gdGhlIGhlYWRlciB3aGVuIHRoZXJlIGFyZSB2YWxpZGF0aW9uIGVycm9yc1xyXG4gICAqL1xyXG4gIHZhbGlkYXRpb25TdW1tYXJ5VGV4dDogcmVzb3VyY2UudmFsaWRhdGlvblN1bW1hcnlUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBwbGFjZWQgaW4gdGhlIGhlYWRlciB3aGVuIHRoZXJlIGFyZSB2YWxpZGF0aW9uIGVycm9yc1xyXG4gICAqL1xyXG4gIGNvbmN1cnJlbmN5U3VtbWFyeVRleHQ6IHJlc291cmNlLmNvbmN1cnJlbmN5U3VtbWFyeVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogRGVmYXVsdCB0ZXh0IHVzZWQgaW4gdGhlIHNlY3Rpb24gaGVhZGVyXHJcbiAgICovXHJcbiAgZGV0YWlsc1RleHQ6IHJlc291cmNlLmRldGFpbHNUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gd2hpbGUgdGhlIHZpZXcgaXMgbG9hZGluZy5cclxuICAgKi9cclxuICBsb2FkaW5nVGV4dDogcmVzb3VyY2UubG9hZGluZ1RleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogTG9jYWxpemVkIGVycm9yIG1lc3NhZ2VzLiBPbmUgZ2VuZXJhbCBlcnJvciBtZXNzYWdlLCBhbmQgbWVzc2FnZXMgYnkgSFRUUCBzdGF0dXMgY29kZS5cclxuICAgKi9cclxuICBlcnJvclRleHQ6IHtcclxuICAgIGdlbmVyYWw6IHJlc291cmNlLmVycm9yR2VuZXJhbCxcclxuICAgIHN0YXR1czoge1xyXG4gICAgICA0MTA6IHJlc291cmNlLmVycm9yNDAxLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgYWxlcnRlZCB0byB1c2VyIHdoZW4gdGhlIGRhdGEgaGFzIGJlZW4gdXBkYXRlZCBzaW5jZSB0aGV5IGxhc3QgZmV0Y2hlZCB0aGUgZGF0YS5cclxuICAgKi9cclxuICBjb25jdXJyZW5jeUVycm9yVGV4dDogcmVzb3VyY2UuY29uY3VycmVuY3lFcnJvclRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogQVJJQSBsYWJlbCB0ZXh0IGZvciBhIGNvbGxhcHNpYmxlIHNlY3Rpb24gaGVhZGVyXHJcbiAgICovXHJcbiAgdG9nZ2xlQ29sbGFwc2VUZXh0OiByZXNvdXJjZS50b2dnbGVDb2xsYXBzZVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogQ29sbGVjdGlvbiBvZiB0aGUgZmllbGRzIGluIHRoZSBsYXlvdXQgd2hlcmUgdGhlIGtleSBpcyB0aGUgYG5hbWVgIG9mIHRoZSBmaWVsZC5cclxuICAgKi9cclxuICBmaWVsZHM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIHNhdmVkIGRhdGEgcmVzcG9uc2UuXHJcbiAgICovXHJcbiAgZW50cnk6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWdzIGlmIHRoZSB2aWV3IGlzIGluIFwiaW5zZXJ0XCIgKGNyZWF0ZSkgbW9kZSwgb3IgaWYgaXQgaXMgaW4gXCJ1cGRhdGVcIiAoZWRpdCkgbW9kZS5cclxuICAgKi9cclxuICBpbnNlcnRpbmc6IG51bGwsXHJcblxyXG4gIF9mb2N1c0ZpZWxkOiBudWxsLFxyXG4gIF9oYXNGb2N1c2VkOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogRmxhZ3MgaWYgdGhlIHZpZXcgaXMgbXVsdGkgY29sdW1uIG9yIHNpbmdsZSBjb2x1bW4uXHJcbiAgICovXHJcbiAgbXVsdGlDb2x1bW5WaWV3OiB0cnVlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfVxyXG4gICAqIFNvSG8gY2xhc3MgdG8gYmUgYXBwbGllZCBvbiBtdWx0aSBjb2x1bW4uXHJcbiAgICovXHJcbiAgbXVsdGlDb2x1bW5DbGFzczogJ2ZvdXInLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfVxyXG4gICAqIE51bWJlciBvZiBjb2x1bW5zIGluIHZpZXdcclxuICAgKi9cclxuICBtdWx0aUNvbHVtbkNvdW50OiAzLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gaW4gdGhlIHRvcCB0b29sYmFyIHNhdmUgYnV0dG9uXHJcbiAgICovXHJcbiAgc2F2ZVRvb2x0aXBUZXh0OiByZXNvdXJjZS5zYXZlVG9vbHRpcFRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCBzaG93biBpbiB0aGUgdG9wIHRvb2xiYXIgY2FuY2VsIGJ1dHRvblxyXG4gICAqL1xyXG4gIGNhbmNlbFRvb2x0aXBUZXh0OiByZXNvdXJjZS5jYW5jZWxUb29sdGlwVGV4dCxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIGNvbnN0cnVjdG9yIHRvIGluaXRpYWx6ZSBgdGhpcy5maWVsZHNgIHRvIHt9XHJcbiAgICogQHBhcmFtIG9cclxuICAgKiBAY29uc3RydWN0c1xyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBjb25zdHJ1Y3RvcigvKiBvKi8pIHtcclxuICAgIHRoaXMuZmllbGRzID0ge307XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBXaGVuIHRoZSBhcHAgaXMgc3RhcnRlZCB0aGlzIGZpcmVzLCB0aGUgRWRpdCB2aWV3IHJlbmRlcnMgaXRzIGxheW91dCBpbW1lZGlhdGVseSwgdGhlblxyXG4gICAqIHJlbmRlcnMgZWFjaCBmaWVsZCBpbnN0YW5jZS5cclxuICAgKlxyXG4gICAqIE9uIHJlZnJlc2ggaXQgd2lsbCBjbGVhciB0aGUgdmFsdWVzLCBidXQgbGVhdmUgdGhlIGxheW91dCBpbnRhY3QuXHJcbiAgICpcclxuICAgKi9cclxuICBzdGFydHVwOiBmdW5jdGlvbiBzdGFydHVwKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIHRoaXMucHJvY2Vzc0xheW91dCh0aGlzLl9jcmVhdGVDdXN0b21pemVkTGF5b3V0KHRoaXMuY3JlYXRlTGF5b3V0KCkpKTtcclxuXHJcbiAgICAkKCdkaXZbZGF0YS1maWVsZF0nLCB0aGlzLmNvbnRlbnROb2RlKVxyXG4gICAgICAuZWFjaCgoaSwgbm9kZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSAkKG5vZGUpLmF0dHIoJ2RhdGEtZmllbGQnKTtcclxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW25hbWVdO1xyXG4gICAgICAgIGlmIChmaWVsZCkge1xyXG4gICAgICAgICAgJChmaWVsZC5kb21Ob2RlKS5hZGRDbGFzcygnZmllbGQnKTtcclxuICAgICAgICAgIGZpZWxkLnJlbmRlclRvKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIGluaXQgdG8gYWxzbyBpbml0IHRoZSBmaWVsZHMgaW4gYHRoaXMuZmllbGRzYC5cclxuICAgKi9cclxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5maWVsZHMpIHtcclxuICAgICAgaWYgKHRoaXMuZmllbGRzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgdGhpcy5maWVsZHNbbmFtZV0uaW5pdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIGFuZCByZXR1cm5zIHRoZSB0b29sYmFyIGl0ZW0gbGF5b3V0IGRlZmluaXRpb24sIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gaW4gdGhlIHZpZXdcclxuICAgKiBzbyB0aGF0IHlvdSBtYXkgZGVmaW5lIHRoZSB2aWV3cyB0b29sYmFyIGl0ZW1zLlxyXG4gICAqXHJcbiAgICogQnkgZGVmYXVsdCBpdCBhZGRzIGEgc2F2ZSBidXR0b24gYm91bmQgdG8gYHRoaXMuc2F2ZSgpYCBhbmQgY2FuY2VsIHRoYXQgZmlyZXMgYFJlVUkuYmFjaygpYFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzLnRvb2xzXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICovXHJcbiAgY3JlYXRlVG9vbExheW91dDogZnVuY3Rpb24gY3JlYXRlVG9vbExheW91dCgpIHtcclxuICAgIGNvbnN0IHRiYXIgPSBbe1xyXG4gICAgICBpZDogJ3NhdmUnLFxyXG4gICAgICBhY3Rpb246ICdzYXZlJyxcclxuICAgICAgc3ZnOiAnc2F2ZScsXHJcbiAgICAgIHRpdGxlOiB0aGlzLnNhdmVUZXh0LFxyXG4gICAgICBzZWN1cml0eTogdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5pbnNlcnQgPyB0aGlzLmluc2VydFNlY3VyaXR5IDogdGhpcy51cGRhdGVTZWN1cml0eSxcclxuICAgIH1dO1xyXG5cclxuICAgIGlmICghQXBwLmlzT25GaXJzdFZpZXcoKSkge1xyXG4gICAgICB0YmFyLnB1c2goe1xyXG4gICAgICAgIGlkOiAnY2FuY2VsJyxcclxuICAgICAgICBzdmc6ICdjYW5jZWwnLFxyXG4gICAgICAgIHRpdGxlOiB0aGlzLmNhbmNlbFRvb2x0aXBUZXh0LFxyXG4gICAgICAgIHNpZGU6ICdsZWZ0JyxcclxuICAgICAgICBhY3Rpb246ICdvblRvb2xDYW5jZWwnLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy50b29scyB8fCAodGhpcy50b29scyA9IHtcclxuICAgICAgdGJhcixcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgb25Ub29sQ2FuY2VsOiBmdW5jdGlvbiBvblRvb2xDYW5jZWwoKSB7XHJcbiAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcbiAgICBSZVVJLmJhY2soKTtcclxuICB9LFxyXG4gIF9nZXRTdG9yZUF0dHI6IGZ1bmN0aW9uIF9nZXRTdG9yZUF0dHIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdG9yZSB8fCAodGhpcy5zdG9yZSA9IHRoaXMuY3JlYXRlU3RvcmUoKSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBhIGZpZWxkcyBvbiBzaG93IGV2ZW50LlxyXG4gICAqXHJcbiAgICogUmVtb3ZlcyB0aGUgcm93LWhpZGRlbiBjc3MgY2xhc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge19GaWVsZH0gZmllbGQgRmllbGQgaW5zdGFuY2UgdGhhdCBpcyBiZWluZyBzaG93blxyXG4gICAqL1xyXG4gIF9vblNob3dGaWVsZDogZnVuY3Rpb24gX29uU2hvd0ZpZWxkKGZpZWxkKSB7XHJcbiAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctaGlkZGVuJyk7XHJcbiAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNwbGF5LW5vbmUnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGEgZmllbGRzIG9uIGhpZGUgZXZlbnQuXHJcbiAgICpcclxuICAgKiBBZGRzIHRoZSByb3ctaGlkZGVuIGNzcyBjbGFzcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7X0ZpZWxkfSBmaWVsZCBGaWVsZCBpbnN0YW5jZSB0aGF0IGlzIGJlaW5nIGhpZGRlblxyXG4gICAqL1xyXG4gIF9vbkhpZGVGaWVsZDogZnVuY3Rpb24gX29uSGlkZUZpZWxkKGZpZWxkKSB7XHJcbiAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLmFkZENsYXNzKCdyb3ctaGlkZGVuJyk7XHJcbiAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLnBhcmVudCgpLmFkZENsYXNzKCdkaXNwbGF5LW5vbmUnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGEgZmllbGRzIG9uIGVuYWJsZSBldmVudC5cclxuICAgKlxyXG4gICAqIFJlbW92ZXMgdGhlIHJvdy1kaXNhYmxlZCBjc3MgY2xhc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge19GaWVsZH0gZmllbGQgRmllbGQgaW5zdGFuY2UgdGhhdCBpcyBiZWluZyBlbmFibGVkXHJcbiAgICovXHJcbiAgX29uRW5hYmxlRmllbGQ6IGZ1bmN0aW9uIF9vbkVuYWJsZUZpZWxkKGZpZWxkKSB7XHJcbiAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctZGlzYWJsZWQnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGEgZmllbGRzIG9uIGRpc2FibGUgZXZlbnQuXHJcbiAgICpcclxuICAgKiBBZGRzIHRoZSByb3ctZGlzYWJsZWQgY3NzIGNsYXNzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtfRmllbGR9IGZpZWxkIEZpZWxkIGluc3RhbmNlIHRoYXQgaXMgYmVpbmcgZGlzYWJsZWRcclxuICAgKi9cclxuICBfb25EaXNhYmxlRmllbGQ6IGZ1bmN0aW9uIF9vbkRpc2FibGVGaWVsZChmaWVsZCkge1xyXG4gICAgJChmaWVsZC5jb250YWluZXJOb2RlKS5hZGRDbGFzcygncm93LWRpc2FibGVkJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIGludm9rZUFjdGlvbiB0byBmaXJzdCBsb29rIGZvciB0aGUgc3BlY2lmaWVkIGZ1bmN0aW9uIG5hbWUgb24gdGhlIGZpZWxkIGluc3RhbmNlXHJcbiAgICogZmlyc3QgYmVmb3JlIHBhc3NpbmcgaXQgdG8gdGhlIHZpZXcuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gaW52b2tlXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgUGFyYW1ldGVycyBvZiB0aGUgZnVuY3Rpb24gdG8gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBvcmlnaW5hbCBjbGljay90YXAgZXZlbnRcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlIFRoZSBub2RlIHRoYXQgaW5pdGlhdGVkIHRoZSBldmVudFxyXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBFaXRoZXIgY2FsbHMgdGhlIGZpZWxkcyBhY3Rpb24gb3IgcmV0dXJucyB0aGUgaW5oZXJpdGVkIHZlcnNpb24gd2hpY2ggbG9va3MgYXQgdGhlIHZpZXcgZm9yIHRoZSBhY3Rpb25cclxuICAgKi9cclxuICBpbnZva2VBY3Rpb246IGZ1bmN0aW9uIGludm9rZUFjdGlvbihuYW1lLCBwYXJhbWV0ZXJzLCBldnQsIG5vZGUpIHtcclxuICAgIGNvbnN0IGZpZWxkTm9kZSA9ICQobm9kZSwgdGhpcy5jb250ZW50Tm9kZSkucGFyZW50cygnW2RhdGEtZmllbGRdJyk7XHJcbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW2ZpZWxkTm9kZS5sZW5ndGggPiAwICYmIGZpZWxkTm9kZS5maXJzdCgpLmF0dHIoJ2RhdGEtZmllbGQnKV07XHJcblxyXG4gICAgaWYgKGZpZWxkICYmIHR5cGVvZiBmaWVsZFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm4gZmllbGRbbmFtZV0uYXBwbHkoZmllbGQsIFtwYXJhbWV0ZXJzLCBldnQsIG5vZGVdKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgYSBmaWVsZCBoYXMgZGVmaW5lZCBvbiBpdCB0aGUgc3VwcGxpZWQgbmFtZSBhcyBhIGZ1bmN0aW9uXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gdGVzdCBmb3JcclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIG9yaWdpbmFsIGNsaWNrL3RhcCBldmVudFxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGUgVGhlIG5vZGUgdGhhdCBpbml0aWF0ZWQgdGhlIGV2ZW50XHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gSWYgdGhlIGZpZWxkIGhhcyB0aGUgbmFtZWQgZnVuY3Rpb24gZGVmaW5lZFxyXG4gICAqL1xyXG4gIGhhc0FjdGlvbjogZnVuY3Rpb24gaGFzQWN0aW9uKG5hbWUsIGV2dCwgbm9kZSkge1xyXG4gICAgY29uc3QgZmllbGROb2RlID0gJChub2RlLCB0aGlzLmNvbnRlbnROb2RlKS5wYXJlbnRzKCdbZGF0YS1maWVsZF0nKTtcclxuICAgIGNvbnN0IGZpZWxkID0gZmllbGROb2RlICYmIHRoaXMuZmllbGRzW2ZpZWxkTm9kZS5sZW5ndGggPiAwICYmIGZpZWxkTm9kZS5maXJzdCgpLmF0dHIoJ2RhdGEtZmllbGQnKV07XHJcblxyXG4gICAgaWYgKGZpZWxkICYmIHR5cGVvZiBmaWVsZFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIGNyZWF0ZVN0b3JlOiBmdW5jdGlvbiBjcmVhdGVTdG9yZSgpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH0sXHJcbiAgb25Db250ZW50Q2hhbmdlOiBmdW5jdGlvbiBvbkNvbnRlbnRDaGFuZ2UoKSB7fSxcclxuICBwcm9jZXNzRW50cnk6IGZ1bmN0aW9uIHByb2Nlc3NFbnRyeShlbnRyeSkge1xyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUHJlLXByb2Nlc3NlcyB0aGUgZW50cnkgYmVmb3JlIHByb2Nlc3NFbnRyeSBydW5zLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSBkYXRhXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBlbnRyeSB3aXRoIGFjdHVhbCBEYXRlIG9iamVjdHNcclxuICAgKi9cclxuICBjb252ZXJ0RW50cnk6IGZ1bmN0aW9uIGNvbnZlcnRFbnRyeShlbnRyeSkge1xyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH0sXHJcbiAgcHJvY2Vzc0ZpZWxkTGV2ZWxTZWN1cml0eTogZnVuY3Rpb24gcHJvY2Vzc0ZpZWxkTGV2ZWxTZWN1cml0eShlbnRyeSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgfSxcclxuICBwcm9jZXNzRGF0YTogZnVuY3Rpb24gcHJvY2Vzc0RhdGEoZW50cnkpIHtcclxuICAgIHRoaXMuZW50cnkgPSB0aGlzLnByb2Nlc3NFbnRyeSh0aGlzLmNvbnZlcnRFbnRyeShlbnRyeSB8fCB7fSkpIHx8IHt9O1xyXG4gICAgdGhpcy5wcm9jZXNzRmllbGRMZXZlbFNlY3VyaXR5KHRoaXMuZW50cnkpO1xyXG5cclxuICAgIHRoaXMuc2V0VmFsdWVzKGVudHJ5LCB0cnVlKTtcclxuXHJcbiAgICAvLyBSZS1hcHBseSBjaGFuZ2VzIHNhdmVkIGZyb20gY29uY3VycmVuY3kvcHJlY29uZGl0aW9uIGZhaWx1cmVcclxuICAgIGlmICh0aGlzLnByZXZpb3VzVmFsdWVzQWxsKSB7XHJcbiAgICAgIC8vIE1ha2UgYSBjb3B5IG9mIHRoZSBjdXJyZW50IHZhbHVlcywgc28gd2UgY2FuIGRpZmYgdGhlbVxyXG4gICAgICBjb25zdCBjdXJyZW50VmFsdWVzID0gdGhpcy5nZXRWYWx1ZXModHJ1ZSk7XHJcbiAgICAgIGNvbnN0IGRpZmZzID0gdGhpcy5kaWZmcyh0aGlzLnByZXZpb3VzVmFsdWVzQWxsLCBjdXJyZW50VmFsdWVzKTtcclxuXHJcbiAgICAgIGlmIChkaWZmcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgZGlmZnMuZm9yRWFjaChmdW5jdGlvbiBmb3JFYWNoKHZhbCkge1xyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaCh7XHJcbiAgICAgICAgICAgIG5hbWU6IHZhbCxcclxuICAgICAgICAgICAgbWVzc2FnZTogdGhpcy5jb25jdXJyZW5jeUVycm9yVGV4dCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0sIHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLnNob3dDb25jdXJyZW5jeVN1bW1hcnkoKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAvLyBObyBkaWZmcyBmb3VuZCwgYXR0ZW1wdCB0byByZS1zYXZlXHJcbiAgICAgICAgdGhpcy5zYXZlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMucHJldmlvdXNWYWx1ZXNBbGwgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFJlLWFwcGx5IGFueSBwYXNzZWQgY2hhbmdlcyBhcyB0aGV5IG1heSBoYXZlIGJlZW4gb3ZlcndyaXR0ZW5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuY2hhbmdlcykge1xyXG4gICAgICB0aGlzLmNoYW5nZXMgPSB0aGlzLm9wdGlvbnMuY2hhbmdlcztcclxuICAgICAgdGhpcy5zZXRWYWx1ZXModGhpcy5jaGFuZ2VzKTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9vbkdldENvbXBsZXRlOiBmdW5jdGlvbiBfb25HZXRDb21wbGV0ZShlbnRyeSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzRGF0YShlbnRyeSk7XHJcbiAgICAgIH0gZWxzZSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgICAvKiB0b2RvOiBzaG93IGVycm9yIG1lc3NhZ2U/ICovXHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygncGFuZWwtbG9hZGluZycpO1xyXG5cclxuICAgICAgLyogdGhpcyBtdXN0IHRha2UgcGxhY2Ugd2hlbiB0aGUgY29udGVudCBpcyB2aXNpYmxlICovXHJcbiAgICAgIHRoaXMub25Db250ZW50Q2hhbmdlKCk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIH1cclxuICB9LFxyXG4gIF9vbkdldEVycm9yOiBmdW5jdGlvbiBfb25HZXRFcnJvcihnZXRPcHRpb25zLCBlcnJvcikge1xyXG4gICAgdGhpcy5oYW5kbGVFcnJvcihlcnJvcik7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWxvYWRpbmcnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgYW5kIHJldHVybnMgdGhlIEVkaXQgdmlldyBsYXlvdXQgYnkgZm9sbG93aW5nIGEgc3RhbmRhcmQgZm9yIHNlY3Rpb24gYW5kIGZpZWxkOlxyXG4gICAqXHJcbiAgICogVGhlIGB0aGlzLmxheW91dGAgaXRzZWxmIGlzIGFuIGFycmF5IG9mIHNlY3Rpb24gb2JqZWN0cyB3aGVyZSBhIHNlY3Rpb24gb2JqZWN0IGlzIGRlZmluZWQgYXMgc3VjaDpcclxuICAgKlxyXG4gICAqICAgICB7XHJcbiAgICogICAgICAgIG5hbWU6ICdTdHJpbmcnLCAvLyBSZXF1aXJlZC4gdW5pcXVlIG5hbWUgZm9yIGlkZW50aWZpY2F0aW9uL2N1c3RvbWl6YXRpb24gcHVycG9zZXNcclxuICAgKiAgICAgICAgdGl0bGU6ICdTdHJpbmcnLCAvLyBSZXF1aXJlZC4gVGV4dCBzaG93biBpbiB0aGUgc2VjdGlvbiBoZWFkZXJcclxuICAgKiAgICAgICAgY2hpbGRyZW46IFtdLCAvLyBBcnJheSBvZiBjaGlsZCByb3cgb2JqZWN0c1xyXG4gICAqICAgICB9XHJcbiAgICpcclxuICAgKiBBIGNoaWxkIHJvdyBvYmplY3QgaGFzOlxyXG4gICAqXHJcbiAgICogICAgIHtcclxuICAgKiAgICAgICAgbmFtZTogJ1N0cmluZycsIC8vIFJlcXVpcmVkLiB1bmlxdWUgbmFtZSBmb3IgaWRlbnRpZmljYXRpb24vY3VzdG9taXphdGlvbiBwdXJwb3Nlc1xyXG4gICAqICAgICAgICBwcm9wZXJ0eTogJ1N0cmluZycsIC8vIE9wdGlvbmFsLiBUaGUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgZW50aXR5IHRvIGJpbmQgdG9cclxuICAgKiAgICAgICAgbGFiZWw6ICdTdHJpbmcnLCAvLyBPcHRpb25hbC4gVGV4dCBzaG93biBpbiB0aGUgbGFiZWwgdG8gdGhlIGxlZnQgb2YgdGhlIHByb3BlcnR5XHJcbiAgICogICAgICAgIHR5cGU6ICdTdHJpbmcnLCAvLyBSZXF1aXJlZC4gVGhlIGZpZWxkIHR5cGUgYXMgcmVnaXN0ZXJlZCB3aXRoIHRoZSBGaWVsZE1hbmFnZXIuXHJcbiAgICogICAgICAgIC8vIEV4YW1wbGVzIG9mIHR5cGU6ICd0ZXh0JywgJ2RlY2ltYWwnLCAnZGF0ZScsICdsb29rdXAnLCAnc2VsZWN0JywgJ2R1cmF0aW9uJ1xyXG4gICAqICAgICAgICAnZGVmYXVsdCc6IHZhbHVlIC8vIE9wdGlvbmFsLiBJZiBkZWZpbmVkIHRoZSB2YWx1ZSB3aWxsIGJlIHNldCBhcyB0aGUgZGVmYXVsdCBcInVubW9kaWZpZWRcIiB2YWx1ZSAobm90IGRpcnR5KS5cclxuICAgKiAgICAgfVxyXG4gICAqXHJcbiAgICogQWxsIGZ1cnRoZXIgcHJvcGVydGllcyBhcmUgc2V0IGJ5IHRoZWlyIHJlc3BlY3RpdmUgdHlwZSwgcGxlYXNlIHNlZSB0aGUgaW5kaXZpZHVhbCBmaWVsZCBmb3JcclxuICAgKiBpdHMgY29uZmlndXJhYmxlIG9wdGlvbnMuXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtPYmplY3RbXX0gRWRpdCBsYXlvdXQgZGVmaW5pdGlvblxyXG4gICAqL1xyXG4gIGNyZWF0ZUxheW91dDogZnVuY3Rpb24gY3JlYXRlTGF5b3V0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5b3V0IHx8IFtdO1xyXG4gIH0sXHJcblxyXG4gIGNyZWF0ZUVycm9ySGFuZGxlcnM6IGZ1bmN0aW9uIGNyZWF0ZUVycm9ySGFuZGxlcnMoKSB7XHJcbiAgICB0aGlzLmVycm9ySGFuZGxlcnMgPSB0aGlzLmVycm9ySGFuZGxlcnMgfHwgW3tcclxuICAgICAgbmFtZTogJ1ByZUNvbmRpdGlvbicsXHJcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIHRlc3RQcmVDb25kaXRpb24oZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gZXJyb3IgJiYgZXJyb3Iuc3RhdHVzID09PSB0aGlzLkhUVFBfU1RBVFVTLlBSRUNPTkRJVElPTl9GQUlMRUQ7XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gaGFuZGxlUHJlQ29uZGl0aW9uKGVycm9yLCBuZXh0KSB7XHJcbiAgICAgICAgbmV4dCgpOyAvLyBJbnZva2UgdGhlIG5leHQgZXJyb3IgaGFuZGxlciBmaXJzdCwgdGhlIHJlZnJlc2ggd2lsbCBjaGFuZ2UgYSBsb3Qgb2YgbXV0YWJsZS9zaGFyZWQgc3RhdGVcclxuXHJcbiAgICAgICAgLy8gUHJlc2VydmUgb3VyIGN1cnJlbnQgZm9ybSB2YWx1ZXMgKGFsbCBvZiB0aGVtKSxcclxuICAgICAgICAvLyBhbmQgcmVsb2FkIHRoZSB2aWV3IHRvIGZldGNoIHRoZSBuZXcgZGF0YS5cclxuICAgICAgICB0aGlzLnByZXZpb3VzVmFsdWVzQWxsID0gdGhpcy5nZXRWYWx1ZXModHJ1ZSk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmtleSA9IHRoaXMuZW50cnkuJGtleTsgLy8gRm9yY2UgYSBmZXRjaCBieSBrZXlcclxuICAgICAgICBkZWxldGUgdGhpcy5vcHRpb25zLmVudHJ5OyAvLyBSZW1vdmUgdGhpcywgb3IgdGhlIGZvcm0gd2lsbCBsb2FkIHRoZSBlbnRyeSB0aGF0IGNhbWUgZnJvbSB0aGUgZGV0YWlsIHZpZXdcclxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcclxuICAgICAgfSxcclxuICAgIH0sIHtcclxuICAgICAgbmFtZTogJ0FsZXJ0RXJyb3InLFxyXG4gICAgICB0ZXN0OiBmdW5jdGlvbiB0ZXN0QWxlcnQoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gZXJyb3Iuc3RhdHVzICE9PSB0aGlzLkhUVFBfU1RBVFVTLlBSRUNPTkRJVElPTl9GQUlMRUQ7XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gaGFuZGxlQWxlcnQoZXJyb3IsIG5leHQpIHtcclxuICAgICAgICBhbGVydCh0aGlzLmdldEVycm9yTWVzc2FnZShlcnJvcikpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9LFxyXG4gICAgfSwge1xyXG4gICAgICBuYW1lOiAnQ2F0Y2hBbGwnLFxyXG4gICAgICB0ZXN0OiBmdW5jdGlvbiB0ZXN0Q2F0Y2hBbGwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gaGFuZGxlQ2F0Y2hBbGwoZXJyb3IsIG5leHQpIHtcclxuICAgICAgICBjb25zdCBmcm9tQ29udGV4dCA9IHRoaXMub3B0aW9ucy5mcm9tQ29udGV4dDtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZnJvbUNvbnRleHQgPSBudWxsO1xyXG4gICAgICAgIGNvbnN0IGVycm9ySXRlbSA9IHtcclxuICAgICAgICAgIHNlcnZlckVycm9yOiBlcnJvcixcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBFcnJvck1hbmFnZXIuYWRkRXJyb3IodGhpcy5nZXRFcnJvck1lc3NhZ2UoZXJyb3IpLCBlcnJvckl0ZW0pO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5mcm9tQ29udGV4dCA9IGZyb21Db250ZXh0O1xyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSxcclxuICAgIH1dO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmVycm9ySGFuZGxlcnM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKlxyXG4gICAqIFJldHVybnMgdGhlIHZpZXcga2V5XHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBWaWV3IGtleVxyXG4gICAqL1xyXG4gIGdldFRhZzogZnVuY3Rpb24gZ2V0VGFnKCkge1xyXG4gICAgbGV0IHRhZyA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuZW50cnkgJiYgdGhpcy5vcHRpb25zLmVudHJ5W3RoaXMuaWRQcm9wZXJ0eV07XHJcbiAgICBpZiAoIXRhZykge1xyXG4gICAgICB0YWcgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmtleTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGFnO1xyXG4gIH0sXHJcbiAgcHJvY2Vzc0xheW91dDogZnVuY3Rpb24gcHJvY2Vzc0xheW91dChsYXlvdXQpIHtcclxuICAgIGNvbnN0IHJvd3MgPSAobGF5b3V0LmNoaWxkcmVuIHx8IGxheW91dC5hcyB8fCBsYXlvdXQpO1xyXG4gICAgY29uc3Qgc2VjdGlvblF1ZXVlID0gW107XHJcbiAgICBjb25zdCBjb250ZW50ID0gW107XHJcbiAgICBsZXQgc2VjdGlvblN0YXJ0ZWQgPSBmYWxzZTtcclxuICAgIGxldCBjdXJyZW50O1xyXG5cclxuICAgIGlmICghbGF5b3V0Lm9wdGlvbnMpIHtcclxuICAgICAgbGF5b3V0Lm9wdGlvbnMgPSB7XHJcbiAgICAgICAgdGl0bGU6IHRoaXMuZGV0YWlsc1RleHQsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJvd3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY3VycmVudCA9IHJvd3NbaV07XHJcblxyXG4gICAgICBpZiAoY3VycmVudC5jaGlsZHJlbiB8fCBjdXJyZW50LmFzKSB7XHJcbiAgICAgICAgaWYgKHNlY3Rpb25TdGFydGVkKSB7XHJcbiAgICAgICAgICBzZWN0aW9uUXVldWUucHVzaChjdXJyZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzTGF5b3V0KGN1cnJlbnQpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghc2VjdGlvblN0YXJ0ZWQpIHtcclxuICAgICAgICBzZWN0aW9uU3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgY29udGVudC5wdXNoKHRoaXMuc2VjdGlvbkJlZ2luVGVtcGxhdGUuYXBwbHkobGF5b3V0LCB0aGlzKSk7XHJcbiAgICAgICAgY29udGVudC5wdXNoKCc8ZGl2IGNsYXNzPVwicm93IGVkaXQtcm93XCI+Jyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY3JlYXRlUm93Q29udGVudChjdXJyZW50LCBjb250ZW50KTtcclxuICAgIH1cclxuICAgIGNvbnRlbnQucHVzaCgnPC9kaXY+Jyk7XHJcbiAgICBjb250ZW50LnB1c2godGhpcy5zZWN0aW9uRW5kVGVtcGxhdGUuYXBwbHkobGF5b3V0LCB0aGlzKSk7XHJcbiAgICBjb25zdCBzZWN0aW9uTm9kZSA9ICQoY29udGVudC5qb2luKCcnKSk7XHJcbiAgICBzZWN0aW9uTm9kZS5hY2NvcmRpb24oKTtcclxuICAgIHRoaXMub25BcHBseVNlY3Rpb25Ob2RlKHNlY3Rpb25Ob2RlLmdldCgwKSwgY3VycmVudCk7XHJcbiAgICAkKHRoaXMuY29udGVudE5vZGUpLmFwcGVuZChzZWN0aW9uTm9kZSk7XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWN0aW9uUXVldWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY3VycmVudCA9IHNlY3Rpb25RdWV1ZVtpXTtcclxuXHJcbiAgICAgIHRoaXMucHJvY2Vzc0xheW91dChjdXJyZW50KTtcclxuICAgIH1cclxuICB9LFxyXG4gIG9uQXBwbHlTZWN0aW9uTm9kZTogZnVuY3Rpb24gb25BcHBseVNlY3Rpb25Ob2RlKC8qIHNlY3Rpb25Ob2RlLCBsYXlvdXQqLykge30sXHJcbiAgY3JlYXRlUm93Q29udGVudDogZnVuY3Rpb24gY3JlYXRlUm93Q29udGVudChsYXlvdXQsIGNvbnRlbnQpIHtcclxuICAgIGNvbnN0IEN0b3IgPSBGaWVsZE1hbmFnZXIuZ2V0KGxheW91dC50eXBlKTtcclxuICAgIGlmIChDdG9yKSB7XHJcbiAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5maWVsZHNbbGF5b3V0Lm5hbWUgfHwgbGF5b3V0LnByb3BlcnR5XSA9IG5ldyBDdG9yKGxhbmcubWl4aW4oe1xyXG4gICAgICAgIG93bmVyOiB0aGlzLFxyXG4gICAgICB9LCBsYXlvdXQpKTtcclxuXHJcbiAgICAgIGNvbnN0IHRlbXBsYXRlID0gZmllbGQucHJvcGVydHlUZW1wbGF0ZSB8fCB0aGlzLnByb3BlcnR5VGVtcGxhdGU7XHJcblxyXG4gICAgICBpZiAoZmllbGQuYXV0b0ZvY3VzICYmICF0aGlzLl9mb2N1c0ZpZWxkKSB7XHJcbiAgICAgICAgdGhpcy5fZm9jdXNGaWVsZCA9IGZpZWxkO1xyXG4gICAgICB9IGVsc2UgaWYgKGZpZWxkLmF1dG9Gb2N1cyAmJiB0aGlzLl9mb2N1c0ZpZWxkKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IG9uZSBmaWVsZCBjYW4gaGF2ZSBhdXRvRm9jdXMgc2V0IHRvIHRydWUgaW4gdGhlIEVkaXQgbGF5b3V0LicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNvbm5lY3QoZmllbGQsICdvblNob3cnLCB0aGlzLl9vblNob3dGaWVsZCk7XHJcbiAgICAgIHRoaXMuY29ubmVjdChmaWVsZCwgJ29uSGlkZScsIHRoaXMuX29uSGlkZUZpZWxkKTtcclxuICAgICAgdGhpcy5jb25uZWN0KGZpZWxkLCAnb25FbmFibGUnLCB0aGlzLl9vbkVuYWJsZUZpZWxkKTtcclxuICAgICAgdGhpcy5jb25uZWN0KGZpZWxkLCAnb25EaXNhYmxlJywgdGhpcy5fb25EaXNhYmxlRmllbGQpO1xyXG5cclxuICAgICAgaWYgKHRoaXMubXVsdGlDb2x1bW5WaWV3KSB7XHJcbiAgICAgICAgbGV0IGhpZGRlbiA9ICcnO1xyXG4gICAgICAgIGlmIChmaWVsZC50eXBlID09PSAnaGlkZGVuJykge1xyXG4gICAgICAgICAgaGlkZGVuID0gJ2Rpc3BsYXktbm9uZSc7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRlbnQucHVzaChgPGRpdiBjbGFzcz1cIiR7dGhpcy5tdWx0aUNvbHVtbkNsYXNzfSBjb2x1bW5zICR7aGlkZGVufVwiPmApO1xyXG4gICAgICB9XHJcbiAgICAgIGNvbnRlbnQucHVzaCh0ZW1wbGF0ZS5hcHBseShmaWVsZCwgdGhpcykpO1xyXG4gICAgICBpZiAodGhpcy5tdWx0aUNvbHVtblZpZXcpIHtcclxuICAgICAgICBjb250ZW50LnB1c2goJzwvZGl2PicpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBJbml0aWF0ZXMgdGhlIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcmVxdWVzdERhdGE6IGZ1bmN0aW9uIHJlcXVlc3REYXRhKCkge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuXHJcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdERhdGFVc2luZ01vZGVsKCkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuX29uR2V0Q29tcGxldGUoZGF0YSk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICB0aGlzLl9vbkdldEVycm9yKG51bGwsIGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChzdG9yZSkge1xyXG4gICAgICBjb25zdCBnZXRPcHRpb25zID0ge307XHJcblxyXG4gICAgICB0aGlzLl9hcHBseVN0YXRlVG9HZXRPcHRpb25zKGdldE9wdGlvbnMpO1xyXG5cclxuICAgICAgY29uc3QgZ2V0RXhwcmVzc2lvbiA9IHRoaXMuX2J1aWxkR2V0RXhwcmVzc2lvbigpIHx8IG51bGw7XHJcbiAgICAgIGNvbnN0IGdldFJlc3VsdHMgPSB0aGlzLnJlcXVlc3REYXRhVXNpbmdTdG9yZShnZXRFeHByZXNzaW9uLCBnZXRPcHRpb25zKTtcclxuXHJcbiAgICAgIHdoZW4oZ2V0UmVzdWx0cyxcclxuICAgICAgICB0aGlzLl9vbkdldENvbXBsZXRlLmJpbmQodGhpcyksXHJcbiAgICAgICAgdGhpcy5fb25HZXRFcnJvci5iaW5kKHRoaXMsIGdldE9wdGlvbnMpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICByZXR1cm4gZ2V0UmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICBjb25zb2xlLndhcm4oJ0Vycm9yIHJlcXVlc3RpbmcgZGF0YSwgbm8gbW9kZWwgb3Igc3RvcmUgd2FzIGRlZmluZWQuIERpZCB5b3UgbWVhbiB0byBtaXhpbiBfU0RhdGFFZGl0TWl4aW4gdG8geW91ciBlZGl0IHZpZXc/Jyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICB9LFxyXG4gIHJlcXVlc3REYXRhVXNpbmdNb2RlbDogZnVuY3Rpb24gcmVxdWVzdERhdGFVc2luZ01vZGVsKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldEVudHJ5KHRoaXMub3B0aW9ucyk7XHJcbiAgfSxcclxuICByZXF1ZXN0RGF0YVVzaW5nU3RvcmU6IGZ1bmN0aW9uIHJlcXVlc3REYXRhVXNpbmdTdG9yZShnZXRFeHByZXNzaW9uLCBnZXRPcHRpb25zKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0KCdzdG9yZScpO1xyXG4gICAgcmV0dXJuIHN0b3JlLmdldChnZXRFeHByZXNzaW9uLCBnZXRPcHRpb25zKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIExvb3BzIGFsbCB0aGUgZmllbGRzIGxvb2tpbmcgZm9yIGFueSB3aXRoIHRoZSBgZGVmYXVsdGAgcHJvcGVydHkgc2V0LCBpZiBzZXQgYXBwbHkgdGhhdFxyXG4gICAqIHZhbHVlIGFzIHRoZSBpbml0aWFsIHZhbHVlIG9mIHRoZSBmaWVsZC4gSWYgdGhlIHZhbHVlIGlzIGEgZnVuY3Rpb24sIGl0cyBleHBhbmRlZCB0aGVuIGFwcGxpZWQuXHJcbiAgICovXHJcbiAgYXBwbHlGaWVsZERlZmF1bHRzOiBmdW5jdGlvbiBhcHBseUZpZWxkRGVmYXVsdHMoKSB7XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5maWVsZHMpIHtcclxuICAgICAgaWYgKHRoaXMuZmllbGRzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tuYW1lXTtcclxuICAgICAgICBjb25zdCBkZWZhdWx0VmFsdWUgPSBmaWVsZC5kZWZhdWx0O1xyXG5cclxuICAgICAgICBpZiAodHlwZW9mIGRlZmF1bHRWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZmllbGQuc2V0VmFsdWUodGhpcy5leHBhbmRFeHByZXNzaW9uKGRlZmF1bHRWYWx1ZSwgZmllbGQpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogTG9vcHMgYWxsIGZpZWxkcyBhbmQgY2FsbHMgaXRzIGBjbGVhclZhbHVlKClgLlxyXG4gICAqL1xyXG4gIGNsZWFyVmFsdWVzOiBmdW5jdGlvbiBjbGVhclZhbHVlcygpIHtcclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiB0aGlzLmZpZWxkcykge1xyXG4gICAgICBpZiAodGhpcy5maWVsZHMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICB0aGlzLmZpZWxkc1tuYW1lXS5jbGVhclZhbHVlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGdpdmVuIHZhbHVlcyBieSBsb29waW5nIHRoZSBmaWVsZHMgYW5kIGNoZWNraW5nIGlmIHRoZSBmaWVsZCBwcm9wZXJ0eSBtYXRjaGVzXHJcbiAgICogYSBrZXkgaW4gdGhlIHBhc3NlZCB2YWx1ZXMgb2JqZWN0IChhZnRlciBjb25zaWRlcmluZyBhIGZpZWxkcyBgYXBwbHlUb2ApLlxyXG4gICAqXHJcbiAgICogVGhlIHZhbHVlIHNldCBpcyB0aGVuIHBhc3NlZCB0aGUgaW5pdGlhbCBzdGF0ZSwgdHJ1ZSBmb3IgZGVmYXVsdC91bm1vZGlmaWVkL2NsZWFuIGFuZCBmYWxzZVxyXG4gICAqIGZvciBkaXJ0eSBvciBhbHRlcmVkLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlcyBkYXRhIGVudHJ5LCBvciBjb2xsZWN0aW9uIG9mIGtleS92YWx1ZXMgd2hlcmUga2V5IG1hdGNoZXMgYSBmaWVsZHMgcHJvcGVydHkgYXR0cmlidXRlXHJcbiAgICogQHBhcmFtIHtCb29sZWFufSBpbml0aWFsIEluaXRpYWwgc3RhdGUgb2YgdGhlIHZhbHVlLCB0cnVlIGZvciBjbGVhbiwgZmFsc2UgZm9yIGRpcnR5XHJcbiAgICovXHJcbiAgc2V0VmFsdWVzOiBmdW5jdGlvbiBzZXRWYWx1ZXModmFsdWVzLCBpbml0aWFsKSB7XHJcbiAgICBjb25zdCBub1ZhbHVlID0ge307XHJcblxyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHRoaXMuZmllbGRzKSB7XHJcbiAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5maWVsZHNbbmFtZV07XHJcbiAgICAgICAgbGV0IHZhbHVlO1xyXG4gICAgICAgIC8vIGZvciBub3csIGV4cGxpY2l0bHkgaGlkZGVuIGZpZWxkcyAodmlhLiB0aGUgZmllbGQuaGlkZSgpIG1ldGhvZCkgYXJlIG5vdCBpbmNsdWRlZFxyXG4gICAgICAgIGlmIChmaWVsZC5pc0hpZGRlbigpKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChmaWVsZC5hcHBseVRvICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgdmFsdWUgPSB1dGlsaXR5LmdldFZhbHVlKHZhbHVlcywgZmllbGQuYXBwbHlUbywgbm9WYWx1ZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHZhbHVlID0gdXRpbGl0eS5nZXRWYWx1ZSh2YWx1ZXMsIGZpZWxkLnByb3BlcnR5IHx8IG5hbWUsIG5vVmFsdWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZnlpOiB1c2VzIHRoZSBmYWN0IHRoYXQgKHt9ICE9PSB7fSlcclxuICAgICAgICBpZiAodmFsdWUgIT09IG5vVmFsdWUpIHtcclxuICAgICAgICAgIGZpZWxkLnNldFZhbHVlKHZhbHVlLCBpbml0aWFsKTtcclxuICAgICAgICAgICQoZmllbGQuY29udGFpbmVyTm9kZSkucmVtb3ZlQ2xhc3MoJ3Jvdy1lcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0cmlldmVzIHRoZSB2YWx1ZSBmcm9tIGV2ZXJ5IGZpZWxkLCBza2lwcGluZyB0aGUgb25lcyBleGNsdWRlZCwgYW5kIG1lcmdlcyB0aGVtIGludG8gYVxyXG4gICAqIHNpbmdsZSBwYXlsb2FkIHdpdGggdGhlIGtleSBiZWluZyB0aGUgZmllbGRzIGBwcm9wZXJ0eWAgYXR0cmlidXRlLCB0YWtpbmcgaW50byBjb25zaWRlcmF0aW9uIGBhcHBseVRvYCBpZiBkZWZpbmVkLlxyXG4gICAqXHJcbiAgICogSWYgYWxsIGlzIHBhc3NlZCBhcyB0cnVlLCBpdCBhbHNvIGdyYWJzIGhpZGRlbiBhbmQgdW5tb2RpZmllZCAoY2xlYW4pIHZhbHVlcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxsIFRydWUgdG8gYWxzbyBpbmNsdWRlIGhpZGRlbiBhbmQgdW5tb2RpZmllZCB2YWx1ZXMuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBBIHNpbmdsZSBvYmplY3QgcGF5bG9hZCB3aXRoIGFsbCB0aGUgdmFsdWVzLlxyXG4gICAqL1xyXG4gIGdldFZhbHVlczogZnVuY3Rpb24gZ2V0VmFsdWVzKGFsbCkge1xyXG4gICAgY29uc3QgcGF5bG9hZCA9IHt9O1xyXG4gICAgbGV0IGVtcHR5ID0gdHJ1ZTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5maWVsZHMpIHtcclxuICAgICAgaWYgKHRoaXMuZmllbGRzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tuYW1lXTtcclxuICAgICAgICBjb25zdCB2YWx1ZSA9IGZpZWxkLmdldFZhbHVlKCk7XHJcblxyXG4gICAgICAgIGNvbnN0IGluY2x1ZGUgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oZmllbGQuaW5jbHVkZSwgdmFsdWUsIGZpZWxkLCB0aGlzKTtcclxuICAgICAgICBjb25zdCBleGNsdWRlID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGZpZWxkLmV4Y2x1ZGUsIHZhbHVlLCBmaWVsZCwgdGhpcyk7XHJcblxyXG4gICAgICAgIC8qKlxyXG4gICAgICAgICAqIGluY2x1ZGU6XHJcbiAgICAgICAgICogICB0cnVlOiBhbHdheXMgaW5jbHVkZSB2YWx1ZVxyXG4gICAgICAgICAqICAgZmFsc2U6IGFsd2F5cyBleGNsdWRlIHZhbHVlXHJcbiAgICAgICAgICogZXhjbHVkZTpcclxuICAgICAgICAgKiAgIHRydWU6IGFsd2F5cyBleGNsdWRlIHZhbHVlXHJcbiAgICAgICAgICogICBmYWxzZTogZGVmYXVsdCBoYW5kbGluZ1xyXG4gICAgICAgICAqL1xyXG4gICAgICAgIGlmIChpbmNsdWRlICE9PSB1bmRlZmluZWQgJiYgIWluY2x1ZGUpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoZXhjbHVkZSAhPT0gdW5kZWZpbmVkICYmIGV4Y2x1ZGUpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gZm9yIG5vdywgZXhwbGljaXRseSBoaWRkZW4gZmllbGRzICh2aWEuIHRoZSBmaWVsZC5oaWRlKCkgbWV0aG9kKSBhcmUgbm90IGluY2x1ZGVkXHJcbiAgICAgICAgaWYgKGFsbCB8fCAoKGZpZWxkLmFsd2F5c1VzZVZhbHVlIHx8IGZpZWxkLmlzRGlydHkoKSB8fCBpbmNsdWRlKSAmJiAhZmllbGQuaXNIaWRkZW4oKSkpIHtcclxuICAgICAgICAgIGlmIChmaWVsZC5hcHBseVRvICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiAodHlwZW9mIGZpZWxkLmFwcGx5VG8gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgICBpZiAodHlwZW9mIHZhbHVlID09PSAnb2JqZWN0Jykge1xyXG4gICAgICAgICAgICAgICAgLy8gQ29weSB0aGUgdmFsdWUgcHJvcGVydGllcyBpbnRvIG91ciBwYXlsb2FkIG9iamVjdFxyXG4gICAgICAgICAgICAgICAgZm9yIChjb25zdCBwcm9wIGluIHZhbHVlKSB7XHJcbiAgICAgICAgICAgICAgICAgIGlmICh2YWx1ZS5oYXNPd25Qcm9wZXJ0eShwcm9wKSkge1xyXG4gICAgICAgICAgICAgICAgICAgIHBheWxvYWRbcHJvcF0gPSB2YWx1ZVtwcm9wXTtcclxuICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgZmllbGQuYXBwbHlUbyhwYXlsb2FkLCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAodHlwZW9mIGZpZWxkLmFwcGx5VG8gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgICAgY29uc3QgdGFyZ2V0ID0gdXRpbGl0eS5nZXRWYWx1ZShwYXlsb2FkLCBmaWVsZC5hcHBseVRvKTtcclxuICAgICAgICAgICAgICBsYW5nLm1peGluKHRhcmdldCwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB1dGlsaXR5LnNldFZhbHVlKHBheWxvYWQsIGZpZWxkLnByb3BlcnR5IHx8IG5hbWUsIHZhbHVlKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICBlbXB0eSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVtcHR5ID8gZmFsc2UgOiBwYXlsb2FkO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogTG9vcHMgYW5kIGdhdGhlcnMgdGhlIHZhbGlkYXRpb24gZXJyb3JzIHJldHVybmVkIGZyb20gZWFjaCBmaWVsZCBhbmQgYWRkcyB0aGVtIHRvIHRoZVxyXG4gICAqIHZhbGlkYXRpb24gc3VtbWFyeSBhcmVhLiBJZiBubyBlcnJvcnMsIHJlbW92ZXMgdGhlIHZhbGlkYXRpb24gc3VtbWFyeS5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFuL09iamVjdFtdfSBSZXR1cm5zIHRoZSBhcnJheSBvZiBlcnJvcnMgaWYgcHJlc2VudCBvciBmYWxzZSBmb3Igbm8gZXJyb3JzLlxyXG4gICAqL1xyXG4gIHZhbGlkYXRlOiBmdW5jdGlvbiB2YWxpZGF0ZSgpIHtcclxuICAgIHRoaXMuZXJyb3JzID0gW107XHJcblxyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHRoaXMuZmllbGRzKSB7XHJcbiAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5maWVsZHNbbmFtZV07XHJcblxyXG4gICAgICAgIGNvbnN0IHJlc3VsdCA9IGZpZWxkLnZhbGlkYXRlKCk7XHJcbiAgICAgICAgaWYgKCFmaWVsZC5pc0hpZGRlbigpICYmIHJlc3VsdCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICQoZmllbGQuY29udGFpbmVyTm9kZSkuYWRkQ2xhc3MoJ3Jvdy1lcnJvcicpO1xyXG5cclxuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goe1xyXG4gICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiByZXN1bHQsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJChmaWVsZC5jb250YWluZXJOb2RlKS5yZW1vdmVDbGFzcygncm93LWVycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZXJyb3JzLmxlbmd0aCA+IDAgPyB0aGlzLmVycm9ycyA6IGZhbHNlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgZm9ybSBpcyBjdXJyZW50bHkgYnVzeS9kaXNhYmxlZFxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgaXNGb3JtRGlzYWJsZWQ6IGZ1bmN0aW9uIGlzRm9ybURpc2FibGVkKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYnVzeTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERpc2FibGVzIHRoZSBmb3JtIGJ5IHNldHRpbmcgYnVzeSB0byB0cnVlIGFuZCBkaXNhYmxpbmcgdGhlIHRvb2xiYXIuXHJcbiAgICovXHJcbiAgZGlzYWJsZTogZnVuY3Rpb24gZGlzYWJsZSgpIHtcclxuICAgIHRoaXMuYnVzeSA9IHRydWU7XHJcblxyXG4gICAgaWYgKEFwcC5iYXJzLnRiYXIpIHtcclxuICAgICAgQXBwLmJhcnMudGJhci5kaXNhYmxlVG9vbCgnc2F2ZScpO1xyXG4gICAgfVxyXG5cclxuICAgICQoJ2JvZHknKS5hZGRDbGFzcygnYnVzeScpOy8vIFRPRE86IE1ha2UgdGhpcyB0aGUgcm9vdC9hcHAgY29udGFpbmVyIG5vZGVcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEVuYWJsZXMgdGhlIGZvcm0gYnkgc2V0dGluZyBidXN5IHRvIGZhbHNlIGFuZCBlbmFibGluZyB0aGUgdG9vbGJhclxyXG4gICAqL1xyXG4gIGVuYWJsZTogZnVuY3Rpb24gZW5hYmxlKCkge1xyXG4gICAgdGhpcy5idXN5ID0gZmFsc2U7XHJcblxyXG4gICAgaWYgKEFwcC5iYXJzLnRiYXIpIHtcclxuICAgICAgQXBwLmJhcnMudGJhci5lbmFibGVUb29sKCdzYXZlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgJCgnYm9keScpLnJlbW92ZUNsYXNzKCdidXN5Jyk7Ly8gVE9ETzogTWFrZSB0aGlzIHRoZSByb290L2FwcCBjb250YWluZXIgbm9kZVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGJ5IHNhdmUoKSB3aGVuIHBlcmZvcm1pbmcgYW4gaW5zZXJ0IChjcmVhdGUpLlxyXG4gICAqIEdhdGhlcnMgdGhlIHZhbHVlcywgY3JlYXRlcyB0aGUgcGF5bG9hZCBmb3IgaW5zZXJ0LCBjcmVhdGVzIHRoZSBzZGF0YSByZXF1ZXN0IGFuZFxyXG4gICAqIGNhbGxzIGBjcmVhdGVgLlxyXG4gICAqL1xyXG4gIGluc2VydDogZnVuY3Rpb24gaW5zZXJ0KCkge1xyXG4gICAgdGhpcy5kaXNhYmxlKCk7XHJcblxyXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoKTtcclxuICAgIGlmICh2YWx1ZXMpIHtcclxuICAgICAgdGhpcy5vbkluc2VydCh2YWx1ZXMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgUmVVSS5iYWNrKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBvbkluc2VydDogZnVuY3Rpb24gb25JbnNlcnQodmFsdWVzKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0KCdzdG9yZScpO1xyXG4gICAgY29uc3QgYWRkT3B0aW9ucyA9IHtcclxuICAgICAgb3ZlcndyaXRlOiBmYWxzZSxcclxuICAgIH07XHJcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuY3JlYXRlRW50cnlGb3JJbnNlcnQodmFsdWVzKTtcclxuICAgIHRoaXMuX2FwcGx5U3RhdGVUb0FkZE9wdGlvbnMoYWRkT3B0aW9ucyk7XHJcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcclxuICAgICAgdGhpcy5fbW9kZWwuaW5zZXJ0RW50cnkoZW50cnksIGFkZE9wdGlvbnMpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLm9uQWRkQ29tcGxldGUoZW50cnksIGRhdGEpO1xyXG4gICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgdGhpcy5vbkFkZEVycm9yKGFkZE9wdGlvbnMsIGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChzdG9yZSkge1xyXG4gICAgICB3aGVuKHN0b3JlLmFkZChlbnRyeSwgYWRkT3B0aW9ucyksXHJcbiAgICAgICAgdGhpcy5vbkFkZENvbXBsZXRlLmJpbmQodGhpcywgZW50cnkpLFxyXG4gICAgICAgIHRoaXMub25BZGRFcnJvci5iaW5kKHRoaXMsIGFkZE9wdGlvbnMpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBfYXBwbHlTdGF0ZVRvQWRkT3B0aW9uczogZnVuY3Rpb24gX2FwcGx5U3RhdGVUb0FkZE9wdGlvbnMoLyogYWRkT3B0aW9ucyovKSB7fSxcclxuICBvbkFkZENvbXBsZXRlOiBmdW5jdGlvbiBvbkFkZENvbXBsZXRlKGVudHJ5LCByZXN1bHQpIHtcclxuICAgIHRoaXMuZW5hYmxlKCk7XHJcblxyXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2J1aWxkUmVmcmVzaE1lc3NhZ2UoZW50cnksIHJlc3VsdCk7XHJcbiAgICBjb25uZWN0LnB1Ymxpc2goJy9hcHAvcmVmcmVzaCcsIFttZXNzYWdlXSk7XHJcblxyXG4gICAgdGhpcy5vbkluc2VydENvbXBsZXRlZChyZXN1bHQpO1xyXG4gIH0sXHJcbiAgb25BZGRFcnJvcjogZnVuY3Rpb24gb25BZGRFcnJvcihhZGRPcHRpb25zLCBlcnJvcikge1xyXG4gICAgdGhpcy5lbmFibGUoKTtcclxuICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgaW5zZXJ0IGNvbXBsZXRlLCBjaGVja3MgZm9yIGB0aGlzLm9wdGlvbnMucmV0dXJuVG9gIGVsc2UgaXQgc2ltcGx5IGdvZXMgYmFjay5cclxuICAgKiBAcGFyYW0gZW50cnlcclxuICAgKi9cclxuICBvbkluc2VydENvbXBsZXRlZDogZnVuY3Rpb24gb25JbnNlcnRDb21wbGV0ZWQoLyogZW50cnkqLykge1xyXG4gICAgLy8gcmV0dXJuVG8gaXMgaGFuZGxlZCBieSBSZVVJIGJhY2tcclxuICAgIFJlVUkuYmFjaygpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIGJ5IHNhdmUoKSB3aGVuIHBlcmZvcm1pbmcgYW4gdXBkYXRlIChlZGl0KS5cclxuICAgKiBHYXRoZXJzIHRoZSB2YWx1ZXMsIGNyZWF0ZXMgdGhlIHBheWxvYWQgZm9yIHVwZGF0ZSwgY3JlYXRlcyB0aGUgc2RhdGEgcmVxdWVzdCBhbmRcclxuICAgKiBjYWxscyBgdXBkYXRlYC5cclxuICAgKi9cclxuICB1cGRhdGU6IGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzKCk7XHJcbiAgICBpZiAodmFsdWVzKSB7XHJcbiAgICAgIHRoaXMuZGlzYWJsZSgpO1xyXG4gICAgICB0aGlzLm9uVXBkYXRlKHZhbHVlcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm9uVXBkYXRlQ29tcGxldGVkKGZhbHNlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIG9uVXBkYXRlOiBmdW5jdGlvbiBvblVwZGF0ZSh2YWx1ZXMpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcbiAgICBjb25zdCBwdXRPcHRpb25zID0ge1xyXG4gICAgICBvdmVyd3JpdGU6IHRydWUsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZW50cnkgPSB0aGlzLmNyZWF0ZUVudHJ5Rm9yVXBkYXRlKHZhbHVlcyk7XHJcbiAgICB0aGlzLl9hcHBseVN0YXRlVG9QdXRPcHRpb25zKHB1dE9wdGlvbnMpO1xyXG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XHJcbiAgICAgIHRoaXMuX21vZGVsLnVwZGF0ZUVudHJ5KGVudHJ5LCBwdXRPcHRpb25zKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5vblB1dENvbXBsZXRlKGVudHJ5LCBkYXRhKTtcclxuICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgIHRoaXMub25QdXRFcnJvcihwdXRPcHRpb25zLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoc3RvcmUpIHtcclxuICAgICAgd2hlbihzdG9yZS5wdXQoZW50cnksIHB1dE9wdGlvbnMpLFxyXG4gICAgICAgIHRoaXMub25QdXRDb21wbGV0ZS5iaW5kKHRoaXMsIGVudHJ5KSxcclxuICAgICAgICB0aGlzLm9uUHV0RXJyb3IuYmluZCh0aGlzLCBwdXRPcHRpb25zKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogR2F0aGVycyB0aGUgdmFsdWVzIGZvciB0aGUgZW50cnkgdG8gc2VuZCBiYWNrIGFuZCByZXR1cm5zIHRoZSBhcHByb3ByaWF0ZSBwYXlsb2FkIGZvclxyXG4gICAqIGNyZWF0aW5nIG9yIHVwZGF0aW5nLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gRW50cnkvcGF5bG9hZFxyXG4gICAqL1xyXG4gIGNyZWF0ZUl0ZW06IGZ1bmN0aW9uIGNyZWF0ZUl0ZW0oKSB7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcygpO1xyXG5cclxuICAgIHJldHVybiB0aGlzLmluc2VydGluZyA/IHRoaXMuY3JlYXRlRW50cnlGb3JJbnNlcnQodmFsdWVzKSA6IHRoaXMuY3JlYXRlRW50cnlGb3JVcGRhdGUodmFsdWVzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIHRoZSB2YWx1ZXMgb2JqZWN0IGFuZCBhZGRzIHRoZSBuZWVkZWQgcHJvcGVydGllcnMgZm9yIHVwZGF0aW5nLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXNcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE9iamVjdCB3aXRoIHByb3BlcnRpZXMgZm9yIHVwZGF0aW5nXHJcbiAgICovXHJcbiAgY3JlYXRlRW50cnlGb3JVcGRhdGU6IGZ1bmN0aW9uIGNyZWF0ZUVudHJ5Rm9yVXBkYXRlKHZhbHVlcykge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udmVydFZhbHVlcyh2YWx1ZXMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgdGhlIHZhbHVlcyBvYmplY3QgYW5kIGFkZHMgdGhlIG5lZWRlZCBwcm9wZXJ0aWVycyBmb3IgY3JlYXRpbmcvaW5zZXJ0aW5nLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXNcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IE9iamVjdCB3aXRoIHByb3BlcnRpZXMgZm9yIGluc2VydGluZ1xyXG4gICAqL1xyXG4gIGNyZWF0ZUVudHJ5Rm9ySW5zZXJ0OiBmdW5jdGlvbiBjcmVhdGVFbnRyeUZvckluc2VydCh2YWx1ZXMpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnZlcnRWYWx1ZXModmFsdWVzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEZ1bmN0aW9uIHRvIGNhbGwgdG8gdHJhbmZvcm0gdmFsdWVzIGJlZm9yZSBzYXZlXHJcbiAgICovXHJcbiAgY29udmVydFZhbHVlczogZnVuY3Rpb24gY29udmVydFZhbHVlcyh2YWx1ZXMpIHtcclxuICAgIHJldHVybiB2YWx1ZXM7XHJcbiAgfSxcclxuICBfYXBwbHlTdGF0ZVRvUHV0T3B0aW9uczogZnVuY3Rpb24gX2FwcGx5U3RhdGVUb1B1dE9wdGlvbnMoLyogcHV0T3B0aW9ucyovKSB7fSxcclxuICBvblB1dENvbXBsZXRlOiBmdW5jdGlvbiBvblB1dENvbXBsZXRlKGVudHJ5LCByZXN1bHQpIHtcclxuICAgIHRoaXMuZW5hYmxlKCk7XHJcblxyXG4gICAgY29uc3QgbWVzc2FnZSA9IHRoaXMuX2J1aWxkUmVmcmVzaE1lc3NhZ2UoZW50cnksIHJlc3VsdCk7XHJcblxyXG4gICAgY29ubmVjdC5wdWJsaXNoKCcvYXBwL3JlZnJlc2gnLCBbbWVzc2FnZV0pO1xyXG5cclxuICAgIHRoaXMub25VcGRhdGVDb21wbGV0ZWQocmVzdWx0KTtcclxuICB9LFxyXG4gIG9uUHV0RXJyb3I6IGZ1bmN0aW9uIG9uUHV0RXJyb3IocHV0T3B0aW9ucywgZXJyb3IpIHtcclxuICAgIHRoaXMuZW5hYmxlKCk7XHJcbiAgICB0aGlzLmhhbmRsZUVycm9yKGVycm9yKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEFycmF5IG9mIHN0cmluZ3MgdGhhdCB3aWxsIGdldCBpZ25vcmVkIHdoZW4gdGhlIGRpZmZpbmcgcnVucy5cclxuICAgKi9cclxuICBkaWZmUHJvcGVydHlJZ25vcmVzOiBbXSxcclxuICAvKipcclxuICAgKiBEaWZmcyB0aGUgcmVzdWx0cyBmcm9tIHRoZSBjdXJyZW50IHZhbHVlcyBhbmQgdGhlIHByZXZpb3VzIHZhbHVlcy5cclxuICAgKiBUaGlzIGlzIGRvbmUgZm9yIGEgY29uY3VycmVuY3kgY2hlY2sgdG8gaW5kaWNhdGUgd2hhdCBoYXMgY2hhbmdlZC5cclxuICAgKiBAcmV0dXJucyBBcnJheSBMaXN0IG9mIHByb3BlcnR5IG5hbWVzIHRoYXQgaGF2ZSBjaGFuZ2VkXHJcbiAgICovXHJcbiAgZGlmZnM6IGZ1bmN0aW9uIGRpZmZzKGxlZnQsIHJpZ2h0KSB7XHJcbiAgICBjb25zdCBhY2MgPSBbXTtcclxuICAgIGNvbnN0IERJRkZfRURJVEVEID0gJ0UnO1xyXG5cclxuICAgIGlmIChEZWVwRGlmZikge1xyXG4gICAgICBjb25zdCBfZGlmZnMgPSBEZWVwRGlmZi5kaWZmKGxlZnQsIHJpZ2h0LCAocGF0aCwga2V5KSA9PiB7XHJcbiAgICAgICAgaWYgKHRoaXMuZGlmZlByb3BlcnR5SWdub3Jlcy5pbmRleE9mKGtleSkgPj0gMCkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIGlmIChfZGlmZnMpIHtcclxuICAgICAgICBfZGlmZnMuZm9yRWFjaCgoZGlmZikgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcGF0aCA9IGRpZmYucGF0aC5qb2luKCcuJyk7XHJcbiAgICAgICAgICBpZiAoZGlmZi5raW5kID09PSBESUZGX0VESVRFRCAmJiBhY2MuaW5kZXhPZihwYXRoKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgYWNjLnB1c2gocGF0aCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYWNjO1xyXG4gIH0sXHJcbiAgX2V4dHJhY3RJZFByb3BlcnR5RnJvbUVudHJ5OiBmdW5jdGlvbiBfZXh0cmFjdElkUHJvcGVydHlGcm9tRW50cnkoZW50cnkpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldEVudGl0eUlkKGVudHJ5KTtcclxuICAgIH0gZWxzZSBpZiAoc3RvcmUpIHtcclxuICAgICAgcmV0dXJuIHN0b3JlLmdldElkZW50aXR5KGVudHJ5KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gJyc7XHJcbiAgfSxcclxuICBfYnVpbGRSZWZyZXNoTWVzc2FnZTogZnVuY3Rpb24gX2J1aWxkUmVmcmVzaE1lc3NhZ2Uob3JpZ2luYWxFbnRyeSwgcmVzcG9uc2UpIHtcclxuICAgIGlmIChvcmlnaW5hbEVudHJ5KSB7XHJcbiAgICAgIGNvbnN0IGlkID0gdGhpcy5fZXh0cmFjdElkUHJvcGVydHlGcm9tRW50cnkob3JpZ2luYWxFbnRyeSk7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgaWQsXHJcbiAgICAgICAga2V5OiBpZCxcclxuICAgICAgICBkYXRhOiByZXNwb25zZSxcclxuICAgICAgfTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHVwZGF0ZSBjb21wbGV0ZSwgY2hlY2tzIGZvciBgdGhpcy5vcHRpb25zLnJldHVyblRvYCBlbHNlIGl0IHNpbXBseSBnb2VzIGJhY2suXHJcbiAgICogQHBhcmFtIGVudHJ5XHJcbiAgICovXHJcbiAgb25VcGRhdGVDb21wbGV0ZWQ6IGZ1bmN0aW9uIG9uVXBkYXRlQ29tcGxldGVkKC8qIGVudHJ5Ki8pIHtcclxuICAgIC8vIHJldHVyblRvIGlzIGhhbmRsZWQgYnkgUmVVSSBiYWNrXHJcbiAgICBSZVVJLmJhY2soKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgdGhlIG1hcmt1cCBieSBhcHBseWluZyB0aGUgYHZhbGlkYXRpb25TdW1tYXJ5SXRlbVRlbXBsYXRlYCB0byBlYWNoIGVudHJ5IGluIGB0aGlzLmVycm9yc2BcclxuICAgKiB0aGVuIHNldHMgdGhlIGNvbWJpbmVkIHJlc3VsdCBpbnRvIHRoZSBzdW1tYXJ5IHZhbGlkYXRpb24gbm9kZSBhbmQgc2V0cyB0aGUgc3R5bGluZyB0byB2aXNpYmxlXHJcbiAgICovXHJcbiAgc2hvd1ZhbGlkYXRpb25TdW1tYXJ5OiBmdW5jdGlvbiBzaG93VmFsaWRhdGlvblN1bW1hcnkoKSB7XHJcbiAgICBjb25zdCBjb250ZW50ID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVycm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb250ZW50LnB1c2godGhpcy52YWxpZGF0aW9uU3VtbWFyeUl0ZW1UZW1wbGF0ZS5hcHBseSh0aGlzLmVycm9yc1tpXSwgdGhpcy5maWVsZHNbdGhpcy5lcnJvcnNbaV0ubmFtZV0pKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldCgndmFsaWRhdGlvbkNvbnRlbnQnLCBjb250ZW50LmpvaW4oJycpKTtcclxuICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcygncGFuZWwtZm9ybS1lcnJvcicpO1xyXG4gIH0sXHJcbiAgc2hvd0NvbmN1cnJlbmN5U3VtbWFyeTogZnVuY3Rpb24gc2hvd0NvbmN1cnJlbmN5U3VtbWFyeSgpIHtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXJyb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnRlbnQucHVzaCh0aGlzLmNvbmN1cnJlbmN5U3VtbWFyeUl0ZW1UZW1wbGF0ZS5hcHBseSh0aGlzLmVycm9yc1tpXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0KCdjb25jdXJyZW5jeUNvbnRlbnQnLCBjb250ZW50LmpvaW4oJycpKTtcclxuICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcygncGFuZWwtZm9ybS1jb25jdXJyZW5jeS1lcnJvcicpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyB0aGUgc3VtbWFyeSB2YWxpZGF0aW9uIHZpc2libGUgc3R5bGluZyBhbmQgZW1wdGllcyBpdHMgY29udGVudHMgb2YgZXJyb3IgbWFya3VwXHJcbiAgICovXHJcbiAgaGlkZVZhbGlkYXRpb25TdW1tYXJ5OiBmdW5jdGlvbiBoaWRlVmFsaWRhdGlvblN1bW1hcnkoKSB7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWZvcm0tZXJyb3InKTtcclxuICAgIHRoaXMuc2V0KCd2YWxpZGF0aW9uQ29udGVudCcsICcnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgdGVoIHN1bW1hcnkgZm9yIGNvbmN1cnJlbmN5IGVycm9yc1xyXG4gICAqL1xyXG4gIGhpZGVDb25jdXJyZW5jeVN1bW1hcnk6IGZ1bmN0aW9uIGhpZGVDb25jdXJyZW5jeVN1bW1hcnkoKSB7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWZvcm0tY29uY3VycmVuY3ktZXJyb3InKTtcclxuICAgIHRoaXMuc2V0KCdjb25jdXJyZW5jeUNvbnRlbnQnLCAnJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgc2F2ZSB0b29sYmFyIGFjdGlvbi5cclxuICAgKlxyXG4gICAqIEZpcnN0IHZhbGlkYXRlcyB0aGUgZm9ybXMsIHNob3dpbmcgZXJyb3JzIGFuZCBzdG9waW5nIHNhdmluZyBpZiBmb3VuZC5cclxuICAgKiBUaGVuIGNhbGxzIGVpdGhlciB7QGxpbmsgI2luc2VydCBpbnNlcnR9IG9yIHtAbGluayAjdXBkYXRlIHVwZGF0ZX0gYmFzZWQgdXBvbiBgdGhpcy5pbnNlcnRpbmdgLlxyXG4gICAqXHJcbiAgICovXHJcbiAgc2F2ZTogZnVuY3Rpb24gc2F2ZSgpIHtcclxuICAgIGlmICh0aGlzLmlzRm9ybURpc2FibGVkKCkpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaGlkZVZhbGlkYXRpb25TdW1tYXJ5KCk7XHJcbiAgICB0aGlzLmhpZGVDb25jdXJyZW5jeVN1bW1hcnkoKTtcclxuXHJcbiAgICBpZiAodGhpcy52YWxpZGF0ZSgpICE9PSBmYWxzZSkge1xyXG4gICAgICB0aGlzLnNob3dWYWxpZGF0aW9uU3VtbWFyeSgpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaW5zZXJ0aW5nKSB7XHJcbiAgICAgIHRoaXMuaW5zZXJ0KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUgZ2V0Q29udGV4dCBmdW5jdGlvbiB0byBhbHNvIGluY2x1ZGUgdGhlIGByZXNvdXJjZUtpbmRgIG9mIHRoZSB2aWV3LCBgaW5zZXJ0YFxyXG4gICAqIHN0YXRlIGFuZCBga2V5YCBvZiB0aGUgZW50cnkgKGZhbHNlIGlmIGluc2VydGluZylcclxuICAgKi9cclxuICBnZXRDb250ZXh0OiBmdW5jdGlvbiBnZXRDb250ZXh0KCkge1xyXG4gICAgcmV0dXJuIGxhbmcubWl4aW4odGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKSwge1xyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgICBpbnNlcnQ6IHRoaXMub3B0aW9ucy5pbnNlcnQsXHJcbiAgICAgIGtleTogdGhpcy5vcHRpb25zLmluc2VydCA/IGZhbHNlIDogdGhpcy5vcHRpb25zLmtleSA/IHRoaXMub3B0aW9ucy5rZXkgOiB0aGlzLm9wdGlvbnMuZW50cnkgJiYgdGhpcy5vcHRpb25zLmVudHJ5W3RoaXMuaWRQcm9wZXJ0eV0gLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBXcmFwcGVyIGZvciBkZXRlY3Rpbmcgc2VjdXJpdHkgZm9yIHVwZGF0ZSBtb2RlIG9yIGluc2VydCBtb2RlXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGFjY2VzcyBDYW4gYmUgZWl0aGVyIFwidXBkYXRlXCIgb3IgXCJpbnNlcnRcIlxyXG4gICAqL1xyXG4gIGdldFNlY3VyaXR5OiBmdW5jdGlvbiBnZXRTZWN1cml0eShhY2Nlc3MpIHtcclxuICAgIGNvbnN0IGxvb2t1cCA9IHtcclxuICAgICAgdXBkYXRlOiB0aGlzLnVwZGF0ZVNlY3VyaXR5LFxyXG4gICAgICBpbnNlcnQ6IHRoaXMuaW5zZXJ0U2VjdXJpdHksXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBsb29rdXBbYWNjZXNzXTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgYmVmb3JlVHJhbnNpdGlvblRvIHRvIGFkZCB0aGUgbG9hZGluZyBzdHlsaW5nIGlmIHJlZnJlc2ggaXMgbmVlZGVkXHJcbiAgICovXHJcbiAgYmVmb3JlVHJhbnNpdGlvblRvOiBmdW5jdGlvbiBiZWZvcmVUcmFuc2l0aW9uVG8oKSB7XHJcbiAgICBpZiAodGhpcy5yZWZyZXNoUmVxdWlyZWQpIHtcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5pbnNlcnQgPT09IHRydWUgfHwgKHRoaXMub3B0aW9ucy5rZXkgJiYgIXRoaXMub3B0aW9ucy5lbnRyeSkpIHtcclxuICAgICAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoJ3BhbmVsLWxvYWRpbmcnKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWxvYWRpbmcnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBvblRyYW5zaXRpb25UbzogZnVuY3Rpb24gb25UcmFuc2l0aW9uVG8oKSB7XHJcbiAgICAvLyBGb2N1cyB0aGUgZGVmYXVsdCBmb2N1cyBmaWVsZCBpZiBpdCBleGlzdHMgYW5kIGl0IGhhcyBub3QgYWxyZWFkeSBiZWVuIGZvY3VzZWQuXHJcbiAgICAvLyBUaGlzIGZsYWcgaXMgaW1wb3J0YW50IGJlY2F1c2Ugb25UcmFuc2l0aW9uVG8gd2lsbCBmaXJlIG11bHRpcGxlIHRpbWVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGxvb2t1cHMgYW5kIGVkaXRvciB0eXBlIGZpZWxkcyB0aGF0IHRyYW5zaXRpb24gYXdheSBmcm9tIHRoaXMgdmlldy5cclxuICAgIGlmICh0aGlzLl9mb2N1c0ZpZWxkICYmICF0aGlzLl9oYXNGb2N1c2VkKSB7XHJcbiAgICAgIHRoaXMuX2ZvY3VzRmllbGQuZm9jdXMoKTtcclxuICAgICAgdGhpcy5faGFzRm9jdXNlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEVtcHRpZXMgdGhlIGFjdGl2YXRlIG1ldGhvZCB3aGljaCBwcmV2ZW50cyBkZXRlY3Rpb24gb2YgcmVmcmVzaCBmcm9tIHRyYW5zaXRpdGlvbmluZy5cclxuICAgKlxyXG4gICAqIEV4dGVybmFsIG5hdmlnYXRpb24gKGJyb3dzZXIgYmFjay9mb3J3YXJkKSBuZXZlciByZWZyZXNoZXMgdGhlIGVkaXQgdmlldyBhcyBpdCdzIGFsd2F5cyBhIHRlcm1pbmFsIGxvb3AuXHJcbiAgICogaS5lLiB5b3UgbmV2ZXIgbW92ZSBcImZvcndhcmRcIiBmcm9tIGFuIGVkaXQgdmlldzsgeW91IG5hdmlnYXRlIHRvIGNoaWxkIGVkaXRvcnMsIGZyb20gd2hpY2ggeW91IGFsd2F5cyByZXR1cm4uXHJcbiAgICovXHJcbiAgYWN0aXZhdGU6IGZ1bmN0aW9uIGFjdGl2YXRlKCkge30sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyByZWZyZXNoUmVxdWlyZWRGb3IgdG8gcmV0dXJuIGZhbHNlIGlmIHdlIGFscmVhZHkgaGF2ZSB0aGUga2V5IHRoZSBvcHRpb25zIGlzIHBhc3NpbmdcclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBOYXZpZ2F0aW9uIG9wdGlvbnMgZnJvbSBwcmV2aW91cyB2aWV3XHJcbiAgICovXHJcbiAgcmVmcmVzaFJlcXVpcmVkRm9yOiBmdW5jdGlvbiByZWZyZXNoUmVxdWlyZWRGb3Iob3B0aW9ucykge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xyXG4gICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMua2V5ICYmIHRoaXMub3B0aW9ucy5rZXkgPT09IG9wdGlvbnMua2V5KSB7XHJcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZWZyZXNoIGZpcnN0IGNsZWFycyBvdXQgYW55IHZhcmlhYmxlcyBzZXQgdG8gcHJldmlvdXMgZGF0YS5cclxuICAgKlxyXG4gICAqIFRoZSBtb2RlIG9mIHRoZSBFZGl0IHZpZXcgaXMgc2V0IGFuZCBkZXRlcm1pbmVkIHZpYSBgdGhpcy5vcHRpb25zLmluc2VydGAsIGFuZCB0aGUgdmlld3MgdmFsdWVzIGFyZSBjbGVhcmVkLlxyXG4gICAqXHJcbiAgICogTGFzdGx5IGl0IG1ha2VzIHRoZSBhcHByb3BpYXRlIGRhdGEgcmVxdWVzdDpcclxuICAgKi9cclxuICByZWZyZXNoOiBmdW5jdGlvbiByZWZyZXNoKCkge1xyXG4gICAgdGhpcy5vblJlZnJlc2goKTtcclxuICAgIHRoaXMuZW50cnkgPSBmYWxzZTtcclxuICAgIHRoaXMuY2hhbmdlcyA9IGZhbHNlO1xyXG4gICAgdGhpcy5pbnNlcnRpbmcgPSAodGhpcy5vcHRpb25zLmluc2VydCA9PT0gdHJ1ZSk7XHJcbiAgICB0aGlzLl9oYXNGb2N1c2VkID0gZmFsc2U7XHJcblxyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1mb3JtLWVycm9yJyk7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWZvcm0tY29uY3VycmVuY3ktZXJyb3InKTtcclxuXHJcbiAgICB0aGlzLmNsZWFyVmFsdWVzKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuaW5zZXJ0aW5nKSB7XHJcbiAgICAgIHRoaXMub25SZWZyZXNoSW5zZXJ0KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm9uUmVmcmVzaFVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb25SZWZyZXNoOiBmdW5jdGlvbiBvblJlZnJlc2goKSB7fSxcclxuICBvblJlZnJlc2hJbnNlcnQ6IGZ1bmN0aW9uIG9uUmVmcmVzaEluc2VydCgpIHt9LFxyXG4gIG9uUmVmcmVzaFVwZGF0ZTogZnVuY3Rpb24gb25SZWZyZXNoVXBkYXRlKCkge1xyXG4gICAgLy8gYXBwbHkgYXMgbm9uLW1vZGlmaWVkIGRhdGFcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZW50cnkpIHtcclxuICAgICAgdGhpcy5wcm9jZXNzRGF0YSh0aGlzLm9wdGlvbnMuZW50cnkpO1xyXG5cclxuICAgICAgLy8gYXBwbHkgY2hhbmdlcyBhcyBtb2RpZmllZCBkYXRhLCBzaW5jZSB3ZSB3YW50IHRoaXMgdG8gZmVlZC1iYWNrIHRocm91Z2hcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jaGFuZ2VzKSB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VzID0gdGhpcy5vcHRpb25zLmNoYW5nZXM7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZXModGhpcy5jaGFuZ2VzKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gaWYga2V5IGlzIHBhc3NlZCByZXF1ZXN0IHRoYXQga2V5cyBlbnRpdHkgYW5kIHByb2Nlc3NcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5rZXkpIHtcclxuICAgICAgICB0aGlzLnJlcXVlc3REYXRhKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGdldFJvdXRlOiBmdW5jdGlvbiBnZXRSb3V0ZSgpIHtcclxuICAgIHJldHVybiBgJHt0aGlzLmlkfS86a2V5P2A7XHJcbiAgfSxcclxuICBidWlsZFJvdXRlOiBmdW5jdGlvbiBidWlsZFJvdXRlKCkge1xyXG4gICAgY29uc3QgcGFydHMgPSBbXTtcclxuICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcclxuICAgIHBhcnRzLnB1c2goaWQpO1xyXG5cclxuICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0VGFnKCkgfHwgKHRoaXMuZW50cnkgJiYgdGhpcy5lbnRyeVt0aGlzLmlkUHJvcGVydHldKTtcclxuICAgIGlmIChrZXkpIHtcclxuICAgICAgcGFydHMucHVzaChrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJ0cy5qb2luKCcvJyk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=