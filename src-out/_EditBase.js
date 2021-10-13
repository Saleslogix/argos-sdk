define('argos/_EditBase', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/connect', 'dojo/when', './Utility', './ErrorManager', './FieldManager', './View', './I18n', './Fields/BooleanField', './Fields/DateField', './Fields/DecimalField', './Fields/DropdownField', './Fields/DurationField', './Fields/HiddenField', './Fields/LookupField', './Fields/NoteField', './Fields/PhoneField', './Fields/SelectField', './Fields/SignatureField', './Fields/TextAreaField', './Fields/TextField', './Fields/RadioField'], function (module, exports, _declare, _lang, _connect, _when, _Utility, _ErrorManager, _FieldManager, _View, _I18n) {
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

  var __class = (0, _declare2.default)('argos._EditBase', [_View2.default], /** @lends module:argos/_EditBase */{
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
        410: resource.error410
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
     * @class
     * @alias module:argos/_EditBase
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
     * @extends module:argos/View
     * @param {Object} options
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

      this.inherited(startup, arguments);
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
      this.inherited(init, arguments);

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
        tbar.unshift({
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
      if (this.multiColumnView) {
        $(field.containerNode).parent().addClass('display-none');
      }
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

      return this._ActionMixin.invokeAction(name, parameters, evt, node);
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

      return this._ActionMixin.hasAction(name, evt, node);
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
      return _lang2.default.mixin(this.inherited(getContext, arguments), {
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

      this.inherited(beforeTransitionTo, arguments);
    },
    onTransitionTo: function onTransitionTo() {
      // Focus the default focus field if it exists and it has not already been focused.
      // This flag is important because onTransitionTo will fire multiple times if the user is using lookups and editor type fields that transition away from this view.
      if (this._focusField && !this._hasFocused) {
        this._focusField.focus();
        this._hasFocused = true;
      }

      this.inherited(onTransitionTo, arguments);
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

      return this.inherited(refreshRequiredFor, arguments);
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