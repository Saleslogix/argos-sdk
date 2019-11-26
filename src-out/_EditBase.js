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

      return this.inherited(invokeAction, arguments);
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

      return this.inherited(hasAction, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fRWRpdEJhc2UuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwiYXR0cmlidXRlTWFwIiwidmFsaWRhdGlvbkNvbnRlbnQiLCJub2RlIiwidHlwZSIsImNvbmN1cnJlbmN5Q29udGVudCIsInRpdGxlIiwicHJvdG90eXBlIiwic2VsZWN0ZWQiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwibG9hZGluZ1RlbXBsYXRlIiwidmFsaWRhdGlvblN1bW1hcnlUZW1wbGF0ZSIsImNvbmN1cnJlbmN5U3VtbWFyeVRlbXBsYXRlIiwidmFsaWRhdGlvblN1bW1hcnlJdGVtVGVtcGxhdGUiLCJjb25jdXJyZW5jeVN1bW1hcnlJdGVtVGVtcGxhdGUiLCJzZWN0aW9uQmVnaW5UZW1wbGF0ZSIsInNlY3Rpb25FbmRUZW1wbGF0ZSIsInByb3BlcnR5VGVtcGxhdGUiLCJpZCIsInN0b3JlIiwibGF5b3V0IiwiZW5hYmxlQ3VzdG9taXphdGlvbnMiLCJjdXN0b21pemF0aW9uU2V0IiwiZXhwb3NlIiwiaW5zZXJ0U2VjdXJpdHkiLCJ1cGRhdGVTZWN1cml0eSIsInZpZXdUeXBlIiwic2F2ZVRleHQiLCJ0aXRsZVRleHQiLCJ2YWxpZGF0aW9uU3VtbWFyeVRleHQiLCJjb25jdXJyZW5jeVN1bW1hcnlUZXh0IiwiZGV0YWlsc1RleHQiLCJsb2FkaW5nVGV4dCIsImVycm9yVGV4dCIsImdlbmVyYWwiLCJlcnJvckdlbmVyYWwiLCJzdGF0dXMiLCJlcnJvcjQwMSIsImNvbmN1cnJlbmN5RXJyb3JUZXh0IiwidG9nZ2xlQ29sbGFwc2VUZXh0IiwiZmllbGRzIiwiZW50cnkiLCJpbnNlcnRpbmciLCJfZm9jdXNGaWVsZCIsIl9oYXNGb2N1c2VkIiwibXVsdGlDb2x1bW5WaWV3IiwibXVsdGlDb2x1bW5DbGFzcyIsIm11bHRpQ29sdW1uQ291bnQiLCJzYXZlVG9vbHRpcFRleHQiLCJjYW5jZWxUb29sdGlwVGV4dCIsImNvbnN0cnVjdG9yIiwic3RhcnR1cCIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInByb2Nlc3NMYXlvdXQiLCJfY3JlYXRlQ3VzdG9taXplZExheW91dCIsImNyZWF0ZUxheW91dCIsIiQiLCJjb250ZW50Tm9kZSIsImVhY2giLCJpIiwibmFtZSIsImF0dHIiLCJmaWVsZCIsImRvbU5vZGUiLCJhZGRDbGFzcyIsInJlbmRlclRvIiwiaW5pdCIsImhhc093blByb3BlcnR5IiwiY3JlYXRlVG9vbExheW91dCIsInRiYXIiLCJhY3Rpb24iLCJzdmciLCJzZWN1cml0eSIsIm9wdGlvbnMiLCJpbnNlcnQiLCJBcHAiLCJpc09uRmlyc3RWaWV3IiwicHVzaCIsInNpZGUiLCJ0b29scyIsIm9uVG9vbENhbmNlbCIsInJlZnJlc2hSZXF1aXJlZCIsIlJlVUkiLCJiYWNrIiwiX2dldFN0b3JlQXR0ciIsImNyZWF0ZVN0b3JlIiwiX29uU2hvd0ZpZWxkIiwiY29udGFpbmVyTm9kZSIsInJlbW92ZUNsYXNzIiwicGFyZW50IiwiX29uSGlkZUZpZWxkIiwiX29uRW5hYmxlRmllbGQiLCJfb25EaXNhYmxlRmllbGQiLCJpbnZva2VBY3Rpb24iLCJwYXJhbWV0ZXJzIiwiZXZ0IiwiZmllbGROb2RlIiwicGFyZW50cyIsImxlbmd0aCIsImZpcnN0IiwiYXBwbHkiLCJoYXNBY3Rpb24iLCJvbkNvbnRlbnRDaGFuZ2UiLCJwcm9jZXNzRW50cnkiLCJjb252ZXJ0RW50cnkiLCJwcm9jZXNzRmllbGRMZXZlbFNlY3VyaXR5IiwicHJvY2Vzc0RhdGEiLCJzZXRWYWx1ZXMiLCJwcmV2aW91c1ZhbHVlc0FsbCIsImN1cnJlbnRWYWx1ZXMiLCJnZXRWYWx1ZXMiLCJkaWZmcyIsImZvckVhY2giLCJ2YWwiLCJlcnJvcnMiLCJtZXNzYWdlIiwic2hvd0NvbmN1cnJlbmN5U3VtbWFyeSIsInNhdmUiLCJjaGFuZ2VzIiwiX29uR2V0Q29tcGxldGUiLCJlIiwiY29uc29sZSIsImVycm9yIiwiX29uR2V0RXJyb3IiLCJnZXRPcHRpb25zIiwiaGFuZGxlRXJyb3IiLCJjcmVhdGVFcnJvckhhbmRsZXJzIiwiZXJyb3JIYW5kbGVycyIsInRlc3QiLCJ0ZXN0UHJlQ29uZGl0aW9uIiwiSFRUUF9TVEFUVVMiLCJQUkVDT05ESVRJT05fRkFJTEVEIiwiaGFuZGxlIiwiaGFuZGxlUHJlQ29uZGl0aW9uIiwibmV4dCIsImtleSIsIiRrZXkiLCJyZWZyZXNoIiwidGVzdEFsZXJ0IiwiaGFuZGxlQWxlcnQiLCJhbGVydCIsImdldEVycm9yTWVzc2FnZSIsInRlc3RDYXRjaEFsbCIsImhhbmRsZUNhdGNoQWxsIiwiZnJvbUNvbnRleHQiLCJlcnJvckl0ZW0iLCJzZXJ2ZXJFcnJvciIsImFkZEVycm9yIiwiZ2V0VGFnIiwidGFnIiwiaWRQcm9wZXJ0eSIsInJvd3MiLCJjaGlsZHJlbiIsImFzIiwic2VjdGlvblF1ZXVlIiwiY29udGVudCIsInNlY3Rpb25TdGFydGVkIiwiY3VycmVudCIsImNyZWF0ZVJvd0NvbnRlbnQiLCJzZWN0aW9uTm9kZSIsImpvaW4iLCJhY2NvcmRpb24iLCJvbkFwcGx5U2VjdGlvbk5vZGUiLCJnZXQiLCJhcHBlbmQiLCJDdG9yIiwicHJvcGVydHkiLCJtaXhpbiIsIm93bmVyIiwidGVtcGxhdGUiLCJhdXRvRm9jdXMiLCJFcnJvciIsImNvbm5lY3QiLCJoaWRkZW4iLCJyZXF1ZXN0RGF0YSIsIl9tb2RlbCIsInJlcXVlc3REYXRhVXNpbmdNb2RlbCIsInRoZW4iLCJkYXRhIiwiZXJyIiwiX2FwcGx5U3RhdGVUb0dldE9wdGlvbnMiLCJnZXRFeHByZXNzaW9uIiwiX2J1aWxkR2V0RXhwcmVzc2lvbiIsImdldFJlc3VsdHMiLCJyZXF1ZXN0RGF0YVVzaW5nU3RvcmUiLCJiaW5kIiwid2FybiIsImdldEVudHJ5IiwiYXBwbHlGaWVsZERlZmF1bHRzIiwiZGVmYXVsdFZhbHVlIiwiZGVmYXVsdCIsInNldFZhbHVlIiwiZXhwYW5kRXhwcmVzc2lvbiIsImNsZWFyVmFsdWVzIiwiY2xlYXJWYWx1ZSIsInZhbHVlcyIsImluaXRpYWwiLCJub1ZhbHVlIiwidmFsdWUiLCJpc0hpZGRlbiIsImFwcGx5VG8iLCJnZXRWYWx1ZSIsImFsbCIsInBheWxvYWQiLCJlbXB0eSIsImluY2x1ZGUiLCJleGNsdWRlIiwidW5kZWZpbmVkIiwiYWx3YXlzVXNlVmFsdWUiLCJpc0RpcnR5IiwicHJvcCIsInRhcmdldCIsInZhbGlkYXRlIiwicmVzdWx0IiwiaXNGb3JtRGlzYWJsZWQiLCJidXN5IiwiZGlzYWJsZSIsImJhcnMiLCJkaXNhYmxlVG9vbCIsImVuYWJsZSIsImVuYWJsZVRvb2wiLCJvbkluc2VydCIsImFkZE9wdGlvbnMiLCJvdmVyd3JpdGUiLCJjcmVhdGVFbnRyeUZvckluc2VydCIsIl9hcHBseVN0YXRlVG9BZGRPcHRpb25zIiwiaW5zZXJ0RW50cnkiLCJvbkFkZENvbXBsZXRlIiwib25BZGRFcnJvciIsImFkZCIsIl9idWlsZFJlZnJlc2hNZXNzYWdlIiwicHVibGlzaCIsIm9uSW5zZXJ0Q29tcGxldGVkIiwidXBkYXRlIiwib25VcGRhdGUiLCJvblVwZGF0ZUNvbXBsZXRlZCIsInB1dE9wdGlvbnMiLCJjcmVhdGVFbnRyeUZvclVwZGF0ZSIsIl9hcHBseVN0YXRlVG9QdXRPcHRpb25zIiwidXBkYXRlRW50cnkiLCJvblB1dENvbXBsZXRlIiwib25QdXRFcnJvciIsInB1dCIsImNyZWF0ZUl0ZW0iLCJjb252ZXJ0VmFsdWVzIiwiZGlmZlByb3BlcnR5SWdub3JlcyIsImxlZnQiLCJyaWdodCIsImFjYyIsIkRJRkZfRURJVEVEIiwiRGVlcERpZmYiLCJfZGlmZnMiLCJkaWZmIiwicGF0aCIsImluZGV4T2YiLCJraW5kIiwiX2V4dHJhY3RJZFByb3BlcnR5RnJvbUVudHJ5IiwiZ2V0RW50aXR5SWQiLCJnZXRJZGVudGl0eSIsIm9yaWdpbmFsRW50cnkiLCJyZXNwb25zZSIsInNob3dWYWxpZGF0aW9uU3VtbWFyeSIsInNldCIsImhpZGVWYWxpZGF0aW9uU3VtbWFyeSIsImhpZGVDb25jdXJyZW5jeVN1bW1hcnkiLCJnZXRDb250ZXh0IiwicmVzb3VyY2VLaW5kIiwiZ2V0U2VjdXJpdHkiLCJhY2Nlc3MiLCJsb29rdXAiLCJiZWZvcmVUcmFuc2l0aW9uVG8iLCJvblRyYW5zaXRpb25UbyIsImZvY3VzIiwiYWN0aXZhdGUiLCJyZWZyZXNoUmVxdWlyZWRGb3IiLCJvblJlZnJlc2giLCJvblJlZnJlc2hJbnNlcnQiLCJvblJlZnJlc2hVcGRhdGUiLCJnZXRSb3V0ZSIsImJ1aWxkUm91dGUiLCJwYXJ0cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQ0EsTUFBTUEsV0FBVyxvQkFBWSxVQUFaLENBQWpCOztBQUVBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLE1BQU1DLFVBQVUsdUJBQVEsaUJBQVIsRUFBMkIsZ0JBQTNCLEVBQW1DLDhCQUE4QjtBQUMvRTs7Ozs7OztBQU9BQyxrQkFBYztBQUNaQyx5QkFBbUI7QUFDakJDLGNBQU0sdUJBRFc7QUFFakJDLGNBQU07QUFGVyxPQURQO0FBS1pDLDBCQUFvQjtBQUNsQkYsY0FBTSx3QkFEWTtBQUVsQkMsY0FBTTtBQUZZLE9BTFI7QUFTWkUsYUFBTyxlQUFLQyxTQUFMLENBQWVOLFlBQWYsQ0FBNEJLLEtBVHZCO0FBVVpFLGdCQUFVLGVBQUtELFNBQUwsQ0FBZU4sWUFBZixDQUE0Qk87QUFWMUIsS0FSaUU7QUFvQi9FOzs7Ozs7Ozs7Ozs7Ozs7QUFlQUMsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSxDQUMzQixnTEFEMkIsRUFFM0IsMEJBRjJCLEVBRzNCLG9DQUgyQixFQUkzQixxQ0FKMkIsRUFLM0Isa0RBTDJCLEVBTTNCLFFBTjJCLENBQWIsQ0FuQytEO0FBMkMvRTs7Ozs7O0FBTUFDLHFCQUFpQixJQUFJRCxRQUFKLENBQWEsQ0FDNUIsNENBRDRCLEVBRTVCLDJEQUY0QixFQUc1QixxQ0FINEIsRUFJNUIsNkJBSjRCLEVBSzVCLDZCQUw0QixFQU01QiwrQkFONEIsRUFPNUIsOEJBUDRCLEVBUTVCLDhCQVI0QixFQVM1QixRQVQ0QixFQVU1QixtQ0FWNEIsRUFXNUIsUUFY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QVEsRUFBZDtBQUNBLFVBQU12USxLQUFLLEtBQUtBLEVBQWhCO0FBQ0F1USxZQUFNM00sSUFBTixDQUFXNUQsRUFBWDs7QUFFQSxVQUFNc0gsTUFBTSxLQUFLYSxNQUFMLE1BQWtCLEtBQUs1RyxLQUFMLElBQWMsS0FBS0EsS0FBTCxDQUFXLEtBQUs4RyxVQUFoQixDQUE1QztBQUNBLFVBQUlmLEdBQUosRUFBUztBQUNQaUosY0FBTTNNLElBQU4sQ0FBVzBELEdBQVg7QUFDRDs7QUFFRCxhQUFPaUosTUFBTXhILElBQU4sQ0FBVyxHQUFYLENBQVA7QUFDRDtBQXh3QzhFLEdBQWpFLENBQWhCOztvQkEyd0NlbEssTyIsImZpbGUiOiJfRWRpdEJhc2UuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IGxhbmcgZnJvbSAnZG9qby9fYmFzZS9sYW5nJztcclxuaW1wb3J0IGNvbm5lY3QgZnJvbSAnZG9qby9fYmFzZS9jb25uZWN0JztcclxuaW1wb3J0IHdoZW4gZnJvbSAnZG9qby93aGVuJztcclxuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5JztcclxuaW1wb3J0IEVycm9yTWFuYWdlciBmcm9tICcuL0Vycm9yTWFuYWdlcic7XHJcbmltcG9ydCBGaWVsZE1hbmFnZXIgZnJvbSAnLi9GaWVsZE1hbmFnZXInO1xyXG5pbXBvcnQgVmlldyBmcm9tICcuL1ZpZXcnO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi9JMThuJztcclxuXHJcbmltcG9ydCAnLi9GaWVsZHMvQm9vbGVhbkZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9EYXRlRmllbGQnO1xyXG5pbXBvcnQgJy4vRmllbGRzL0RlY2ltYWxGaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvRHJvcGRvd25GaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvRHVyYXRpb25GaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvSGlkZGVuRmllbGQnO1xyXG5pbXBvcnQgJy4vRmllbGRzL0xvb2t1cEZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9Ob3RlRmllbGQnO1xyXG5pbXBvcnQgJy4vRmllbGRzL1Bob25lRmllbGQnO1xyXG5pbXBvcnQgJy4vRmllbGRzL1NlbGVjdEZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9TaWduYXR1cmVGaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvVGV4dEFyZWFGaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvVGV4dEZpZWxkJztcclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ2VkaXRCYXNlJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLl9FZGl0QmFzZVxyXG4gKiBAY2xhc3NkZXNjIEFuIEVkaXQgVmlldyBpcyBhIGR1YWwgcHVycG9zZSB2aWV3IC0gdXNlZCBmb3IgYm90aCBDcmVhdGluZyBhbmQgVXBkYXRpbmcgcmVjb3Jkcy4gSXQgaXMgY29tcHJpc2VkXHJcbiAqIG9mIGEgbGF5b3V0IHNpbWlsYXIgdG8gRGV0YWlsIHJvd3MgYnV0IGFyZSBpbnN0ZWFkIEVkaXQgZmllbGRzLlxyXG4gKlxyXG4gKiBBIHVuaXF1ZSBwYXJ0IG9mIHRoZSBFZGl0IHZpZXcgaXMgaXQncyBsaWZlY3ljbGUgaW4gY29tcGFyaXNvbiB0byBEZXRhaWwuIFRoZSBEZXRhaWwgdmlldyBpcyB0b3JuXHJcbiAqIGRvd24gYW5kIHJlYnVpbHQgd2l0aCBldmVyeSByZWNvcmQuIFdpdGggRWRpdCB0aGUgZm9ybSBpcyBlbXB0aWVkIChIVE1MIGxlZnQgaW4tdGFjdCkgYW5kIG5ldyB2YWx1ZXNcclxuICogYXJlIGFwcGxpZWQgdG8gdGhlIGZpZWxkcy5cclxuICpcclxuICogU2luY2UgRWRpdCBWaWV3cyBhcmUgdHlwaWNhbGx5IHRoZSBcImxhc3RcIiB2aWV3ICh5b3UgYWx3YXlzIGNvbWUgZnJvbSBhIExpc3Qgb3IgRGV0YWlsIHZpZXcpIGl0IHdhcnJhbnRzXHJcbiAqIHNwZWNpYWwgYXR0ZW50aW9uIHRvIHRoZSBuYXZpZ2F0aW9uIG9wdGlvbnMgdGhhdCBhcmUgcGFzc2VkLCBhcyB0aGV5IGdyZWF0bHkgY29udHJvbCBob3cgdGhlIEVkaXQgdmlld1xyXG4gKiBmdW5jdGlvbnMgYW5kIG9wZXJhdGVzLlxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5WaWV3XHJcbiAqIEByZXF1aXJlcyBhcmdvcy5VdGlsaXR5XHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuRXJyb3JNYW5hZ2VyXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuRmllbGRNYW5hZ2VyXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuQm9vbGVhbkZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuRGVjaW1hbEZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuRHVyYXRpb25GaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRzLkhpZGRlbkZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuTG9va3VwRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5Ob3RlRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5QaG9uZUZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuU2VsZWN0RmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5TaWduYXR1cmVGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRzLlRleHRBcmVhRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5UZXh0RmllbGRcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fRWRpdEJhc2UnLCBbVmlld10sIC8qKiBAbGVuZHMgYXJnb3MuX0VkaXRCYXNlIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBDcmVhdGVzIGEgc2V0dGVyIG1hcCB0byBodG1sIG5vZGVzLCBuYW1lbHk6XHJcbiAgICpcclxuICAgKiAqIHZhbGlkYXRpb25Db250ZW50ID0+IHZhbGlkYXRpb25Db250ZW50Tm9kZSdzIGlubmVySFRNTFxyXG4gICAqXHJcbiAgICovXHJcbiAgYXR0cmlidXRlTWFwOiB7XHJcbiAgICB2YWxpZGF0aW9uQ29udGVudDoge1xyXG4gICAgICBub2RlOiAndmFsaWRhdGlvbkNvbnRlbnROb2RlJyxcclxuICAgICAgdHlwZTogJ2lubmVySFRNTCcsXHJcbiAgICB9LFxyXG4gICAgY29uY3VycmVuY3lDb250ZW50OiB7XHJcbiAgICAgIG5vZGU6ICdjb25jdXJyZW5jeUNvbnRlbnROb2RlJyxcclxuICAgICAgdHlwZTogJ2lubmVySFRNTCcsXHJcbiAgICB9LFxyXG4gICAgdGl0bGU6IFZpZXcucHJvdG90eXBlLmF0dHJpYnV0ZU1hcC50aXRsZSxcclxuICAgIHNlbGVjdGVkOiBWaWV3LnByb3RvdHlwZS5hdHRyaWJ1dGVNYXAuc2VsZWN0ZWQsXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciB0aGUgdmlldydzIG1haW4gRE9NIGVsZW1lbnQgd2hlbiB0aGUgdmlldyBpcyBpbml0aWFsaXplZC5cclxuICAgKiBUaGlzIHRlbXBsYXRlIGluY2x1ZGVzIGxvYWRpbmdUZW1wbGF0ZSBhbmQgdmFsaWRhdGlvblN1bW1hcnlUZW1wbGF0ZS5cclxuICAgKlxyXG4gICAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlIHVzZXMgdGhlIGZvbGxvd2luZyBwcm9wZXJ0aWVzOlxyXG4gICAqXHJcbiAgICogICAgICBuYW1lICAgICAgICAgICAgICAgIGRlc2NyaXB0aW9uXHJcbiAgICogICAgICAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXHJcbiAgICogICAgICBpZCAgICAgICAgICAgICAgICAgICBtYWluIGNvbnRhaW5lciBkaXYgaWRcclxuICAgKiAgICAgIHRpdGxlICAgICAgICAgICAgICAgIG1haW4gY29udGFpbmVyIGRpdiB0aXRsZSBhdHRyXHJcbiAgICogICAgICBjbHMgICAgICAgICAgICAgICAgICBhZGRpdGlvbmFsIGNsYXNzIHN0cmluZyBhZGRlZCB0byB0aGUgbWFpbiBjb250YWluZXIgZGl2XHJcbiAgICogICAgICByZXNvdXJjZUtpbmQgICAgICAgICBzZXQgdG8gZGF0YS1yZXNvdXJjZS1raW5kXHJcbiAgICpcclxuICAgKi9cclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGlkPVwieyU9ICQuaWQgJX1cIiBkYXRhLXRpdGxlPVwieyU6ICQudGl0bGVUZXh0ICV9XCIgY2xhc3M9XCJlZGl0IHBhbmVsIHNjcm9sbGFibGUgeyU9ICQuY2xzICV9XCIgeyUgaWYgKCQucmVzb3VyY2VLaW5kKSB7ICV9ZGF0YS1yZXNvdXJjZS1raW5kPVwieyU9ICQucmVzb3VyY2VLaW5kICV9XCJ7JSB9ICV9PicsXHJcbiAgICAneyUhICQubG9hZGluZ1RlbXBsYXRlICV9JyxcclxuICAgICd7JSEgJC52YWxpZGF0aW9uU3VtbWFyeVRlbXBsYXRlICV9JyxcclxuICAgICd7JSEgJC5jb25jdXJyZW5jeVN1bW1hcnlUZW1wbGF0ZSAlfScsXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiY29udGVudE5vZGVcIj48L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHNob3duIHdoZW4gZGF0YSBpcyBiZWluZyBsb2FkZWQuXHJcbiAgICpcclxuICAgKiBgJGAgPT4gdGhlIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBsb2FkaW5nVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGZpZWxkc2V0IGNsYXNzPVwicGFuZWwtbG9hZGluZy1pbmRpY2F0b3JcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJidXN5LWluZGljYXRvci1jb250YWluZXJcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJidXN5LWluZGljYXRvciBhY3RpdmVcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgb25lXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHR3b1wiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciB0aHJlZVwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBmb3VyXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZpdmVcIj48L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPHNwYW4+eyU6ICQubG9hZGluZ1RleHQgJX08L3NwYW4+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzwvZmllbGRzZXQ+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgZm9yIHRoZSB2YWxpZGF0aW9uIHN1bW1hcnkgYXJlYSwgdGhpcyBkaXYgaXMgc2hvd24vaGlkZGVuIGFzIG5lZWRlZC5cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHZhbGlkYXRpb25TdW1tYXJ5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInBhbmVsLXZhbGlkYXRpb24tc3VtbWFyeVwiPicsXHJcbiAgICAnPGgzPnslOiAkLnZhbGlkYXRpb25TdW1tYXJ5VGV4dCAlfTwvaDM+JyxcclxuICAgICc8dWwgY2xhc3M9XCJwYW5lbC12YWxpZGF0aW9uLW1lc3NhZ2VzXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInZhbGlkYXRpb25Db250ZW50Tm9kZVwiPicsXHJcbiAgICAnPC91bD4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIGZvciB0aGUgY29uY3VycmVuY3kgZXJyb3IgYXJlYSwgdGhpcyBkaXYgaXMgc2hvd24vaGlkZGVuIGFzIG5lZWRlZC5cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIGNvbmN1cnJlbmN5U3VtbWFyeVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJwYW5lbC1jb25jdXJyZW5jeS1zdW1tYXJ5XCI+JyxcclxuICAgICc8aDM+eyU6ICQuY29uY3VycmVuY3lTdW1tYXJ5VGV4dCAlfTwvaDM+JyxcclxuICAgICc8dWwgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImNvbmN1cnJlbmN5Q29udGVudE5vZGVcIj4nLFxyXG4gICAgJzwvdWw+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCBzaG93biB3aGVuIGRhdGEgaXMgYmVpbmcgbG9hZGVkLlxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gdmFsaWRhdGlvbiBlcnJvciBvYmplY3RcclxuICAgKiAqIGAkJGAgPT4gZmllbGQgaW5zdGFuY2UgdGhhdCB0aGUgZXJyb3IgaXMgb25cclxuICAgKi9cclxuICB2YWxpZGF0aW9uU3VtbWFyeUl0ZW1UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8bGk+PHA+JyxcclxuICAgICc8YSBjbGFzcz1cImh5cGVybGlua1wiIGhyZWY9XCIjeyU9ICQubmFtZSAlfVwiPicsXHJcbiAgICAnPGI+eyU6ICQkLmxhYmVsICV9PC9iPjogeyU6ICQubWVzc2FnZSAlfScsXHJcbiAgICAnPC9hPjwvcD48L2xpPicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiAqIGAkYCA9PiB2YWxpZGF0aW9uIGVycm9yIG9iamVjdFxyXG4gICAqL1xyXG4gIGNvbmN1cnJlbmN5U3VtbWFyeUl0ZW1UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8bGk+PHA+PGI+eyU6ICQkLm5hbWUgJX08L2I+OiB7JTogJC5tZXNzYWdlICV9PC9wPjwvbGk+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBzdGFydHMgYSBuZXcgc2VjdGlvbiBpbmNsdWRpbmcgdGhlIGNvbGxhcHNpYmxlIGhlYWRlclxyXG4gICAqXHJcbiAgICogYCRgID0+IHRoZSB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgc2VjdGlvbkJlZ2luVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICBgPGRpdiBjbGFzcz1cImFjY29yZGlvblwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uLWhlYWRlciBpcy1zZWxlY3RlZFwiPlxyXG4gICAgICAgIDxhIGhyZWY9XCIjXCI+PHNwYW4+eyU6ICgkLnRpdGxlIHx8ICQub3B0aW9ucy50aXRsZSkgJX08L3NwYW4+PC9hPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgPGRpdiBjbGFzcz1cImFjY29yZGlvbi1wYW5lXCI+XHJcbiAgICAgICAgPGZpZWxkc2V0IGNsYXNzPVwiYWNjb3JkaW9uLWNvbnRlbnQgeyU9ICgkLmNscyB8fCAkLm9wdGlvbnMuY2xzKSAlfVwiPlxyXG4gICAgYCxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBlbmRzIGEgc2VjdGlvblxyXG4gICAqXHJcbiAgICogYCRgID0+IHRoZSB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgc2VjdGlvbkVuZFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzwvZmllbGRzZXQ+PC9kaXY+PC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgY3JlYXRlZCBmb3IgZWFjaCBwcm9wZXJ0eSAoZmllbGQgcm93KS5cclxuICAgKlxyXG4gICAqICogYCRgID0+IHRoZSBmaWVsZCByb3cgb2JqZWN0IGRlZmluZWQgaW4ge0BsaW5rICNjcmVhdGVMYXlvdXQgY3JlYXRlTGF5b3V0fS5cclxuICAgKiAqIGAkJGAgPT4gdGhlIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBwcm9wZXJ0eVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxhIG5hbWU9XCJ7JT0gJC5uYW1lIHx8ICQucHJvcGVydHkgJX1cIj48L2E+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwicm93LWVkaXQgeyU9ICQuY2xzICV9eyUgaWYgKCQucmVhZG9ubHkpIHsgJX1yb3ctcmVhZG9ubHl7JSB9ICV9XCIgZGF0YS1maWVsZD1cInslPSAkLm5hbWUgfHwgJC5wcm9wZXJ0eSAlfVwiIGRhdGEtZmllbGQtdHlwZT1cInslPSAkLnR5cGUgJX1cIj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcblxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBUaGUgdW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIHZpZXdcclxuICAgKi9cclxuICBpZDogJ2dlbmVyaWNfZWRpdCcsXHJcbiAgc3RvcmU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIGxheW91dCBkZWZpbml0aW9uIHRoYXQgY29uc3RydWN0cyB0aGUgZGV0YWlsIHZpZXcgd2l0aCBzZWN0aW9ucyBhbmQgcm93c1xyXG4gICAqL1xyXG4gIGxheW91dDogbnVsbCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtCb29sZWFufVxyXG4gICAqIEVuYWJsZXMgdGhlIHVzZSBvZiB0aGUgY3VzdG9taXphdGlvbiBlbmdpbmUgb24gdGhpcyB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgZW5hYmxlQ3VzdG9taXphdGlvbnM6IHRydWUsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIGN1c3RvbWl6YXRpb24gaWRlbnRpZmllciBmb3IgdGhpcyBjbGFzcy4gV2hlbiBhIGN1c3RvbWl6YXRpb24gaXMgcmVnaXN0ZXJlZCBpdCBpcyBwYXNzZWRcclxuICAgKiBhIHBhdGgvaWRlbnRpZmllciB3aGljaCBpcyB0aGVuIG1hdGNoZWQgdG8gdGhpcyBwcm9wZXJ0eS5cclxuICAgKi9cclxuICBjdXN0b21pemF0aW9uU2V0OiAnZWRpdCcsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7Qm9vbGVhbn1cclxuICAgKiBDb250cm9scyBpZiB0aGUgdmlldyBzaG91bGQgYmUgZXhwb3NlZFxyXG4gICAqL1xyXG4gIGV4cG9zZTogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nL09iamVjdH1cclxuICAgKiBNYXkgYmUgdXNlZCBmb3IgdmVyaWZ5aW5nIHRoZSB2aWV3IGlzIGFjY2Vzc2libGUgZm9yIGNyZWF0aW5nIGVudHJpZXNcclxuICAgKi9cclxuICBpbnNlcnRTZWN1cml0eTogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nL09iamVjdH1cclxuICAgKiBNYXkgYmUgdXNlZCBmb3IgdmVyaWZ5aW5nIHRoZSB2aWV3IGlzIGFjY2Vzc2libGUgZm9yIGVkaXRpbmcgZW50cmllc1xyXG4gICAqL1xyXG4gIHVwZGF0ZVNlY3VyaXR5OiBmYWxzZSxcclxuXHJcbiAgdmlld1R5cGU6ICdlZGl0JyxcclxuXHJcbiAgLyoqXHJcbiAgICogQGRlcHJlY2F0ZWRcclxuICAgKi9cclxuICBzYXZlVGV4dDogcmVzb3VyY2Uuc2F2ZVRleHQsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIERlZmF1bHQgdGl0bGUgdGV4dCBzaG93biBpbiB0aGUgdG9wIHRvb2xiYXJcclxuICAgKi9cclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgcGxhY2VkIGluIHRoZSBoZWFkZXIgd2hlbiB0aGVyZSBhcmUgdmFsaWRhdGlvbiBlcnJvcnNcclxuICAgKi9cclxuICB2YWxpZGF0aW9uU3VtbWFyeVRleHQ6IHJlc291cmNlLnZhbGlkYXRpb25TdW1tYXJ5VGV4dCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgcGxhY2VkIGluIHRoZSBoZWFkZXIgd2hlbiB0aGVyZSBhcmUgdmFsaWRhdGlvbiBlcnJvcnNcclxuICAgKi9cclxuICBjb25jdXJyZW5jeVN1bW1hcnlUZXh0OiByZXNvdXJjZS5jb25jdXJyZW5jeVN1bW1hcnlUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIERlZmF1bHQgdGV4dCB1c2VkIGluIHRoZSBzZWN0aW9uIGhlYWRlclxyXG4gICAqL1xyXG4gIGRldGFpbHNUZXh0OiByZXNvdXJjZS5kZXRhaWxzVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IHNob3duIHdoaWxlIHRoZSB2aWV3IGlzIGxvYWRpbmcuXHJcbiAgICovXHJcbiAgbG9hZGluZ1RleHQ6IHJlc291cmNlLmxvYWRpbmdUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIExvY2FsaXplZCBlcnJvciBtZXNzYWdlcy4gT25lIGdlbmVyYWwgZXJyb3IgbWVzc2FnZSwgYW5kIG1lc3NhZ2VzIGJ5IEhUVFAgc3RhdHVzIGNvZGUuXHJcbiAgICovXHJcbiAgZXJyb3JUZXh0OiB7XHJcbiAgICBnZW5lcmFsOiByZXNvdXJjZS5lcnJvckdlbmVyYWwsXHJcbiAgICBzdGF0dXM6IHtcclxuICAgICAgNDEwOiByZXNvdXJjZS5lcnJvcjQwMSxcclxuICAgIH0sXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IGFsZXJ0ZWQgdG8gdXNlciB3aGVuIHRoZSBkYXRhIGhhcyBiZWVuIHVwZGF0ZWQgc2luY2UgdGhleSBsYXN0IGZldGNoZWQgdGhlIGRhdGEuXHJcbiAgICovXHJcbiAgY29uY3VycmVuY3lFcnJvclRleHQ6IHJlc291cmNlLmNvbmN1cnJlbmN5RXJyb3JUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIEFSSUEgbGFiZWwgdGV4dCBmb3IgYSBjb2xsYXBzaWJsZSBzZWN0aW9uIGhlYWRlclxyXG4gICAqL1xyXG4gIHRvZ2dsZUNvbGxhcHNlVGV4dDogcmVzb3VyY2UudG9nZ2xlQ29sbGFwc2VUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIENvbGxlY3Rpb24gb2YgdGhlIGZpZWxkcyBpbiB0aGUgbGF5b3V0IHdoZXJlIHRoZSBrZXkgaXMgdGhlIGBuYW1lYCBvZiB0aGUgZmllbGQuXHJcbiAgICovXHJcbiAgZmllbGRzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFRoZSBzYXZlZCBkYXRhIHJlc3BvbnNlLlxyXG4gICAqL1xyXG4gIGVudHJ5OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBGbGFncyBpZiB0aGUgdmlldyBpcyBpbiBcImluc2VydFwiIChjcmVhdGUpIG1vZGUsIG9yIGlmIGl0IGlzIGluIFwidXBkYXRlXCIgKGVkaXQpIG1vZGUuXHJcbiAgICovXHJcbiAgaW5zZXJ0aW5nOiBudWxsLFxyXG5cclxuICBfZm9jdXNGaWVsZDogbnVsbCxcclxuICBfaGFzRm9jdXNlZDogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWdzIGlmIHRoZSB2aWV3IGlzIG11bHRpIGNvbHVtbiBvciBzaW5nbGUgY29sdW1uLlxyXG4gICAqL1xyXG4gIG11bHRpQ29sdW1uVmlldzogdHJ1ZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge3N0cmluZ31cclxuICAgKiBTb0hvIGNsYXNzIHRvIGJlIGFwcGxpZWQgb24gbXVsdGkgY29sdW1uLlxyXG4gICAqL1xyXG4gIG11bHRpQ29sdW1uQ2xhc3M6ICdmb3VyJyxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge251bWJlcn1cclxuICAgKiBOdW1iZXIgb2YgY29sdW1ucyBpbiB2aWV3XHJcbiAgICovXHJcbiAgbXVsdGlDb2x1bW5Db3VudDogMyxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IHNob3duIGluIHRoZSB0b3AgdG9vbGJhciBzYXZlIGJ1dHRvblxyXG4gICAqL1xyXG4gIHNhdmVUb29sdGlwVGV4dDogcmVzb3VyY2Uuc2F2ZVRvb2x0aXBUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gaW4gdGhlIHRvcCB0b29sYmFyIGNhbmNlbCBidXR0b25cclxuICAgKi9cclxuICBjYW5jZWxUb29sdGlwVGV4dDogcmVzb3VyY2UuY2FuY2VsVG9vbHRpcFRleHQsXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyBjb25zdHJ1Y3RvciB0byBpbml0aWFsemUgYHRoaXMuZmllbGRzYCB0byB7fVxyXG4gICAqIEBwYXJhbSBvXHJcbiAgICogQGNvbnN0cnVjdHNcclxuICAgKi9cclxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gY29uc3RydWN0b3IoLyogbyovKSB7XHJcbiAgICB0aGlzLmZpZWxkcyA9IHt9O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogV2hlbiB0aGUgYXBwIGlzIHN0YXJ0ZWQgdGhpcyBmaXJlcywgdGhlIEVkaXQgdmlldyByZW5kZXJzIGl0cyBsYXlvdXQgaW1tZWRpYXRlbHksIHRoZW5cclxuICAgKiByZW5kZXJzIGVhY2ggZmllbGQgaW5zdGFuY2UuXHJcbiAgICpcclxuICAgKiBPbiByZWZyZXNoIGl0IHdpbGwgY2xlYXIgdGhlIHZhbHVlcywgYnV0IGxlYXZlIHRoZSBsYXlvdXQgaW50YWN0LlxyXG4gICAqXHJcbiAgICovXHJcbiAgc3RhcnR1cDogZnVuY3Rpb24gc3RhcnR1cCgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHN0YXJ0dXAsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnByb2Nlc3NMYXlvdXQodGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dCh0aGlzLmNyZWF0ZUxheW91dCgpKSk7XHJcblxyXG4gICAgJCgnZGl2W2RhdGEtZmllbGRdJywgdGhpcy5jb250ZW50Tm9kZSlcclxuICAgICAgLmVhY2goKGksIG5vZGUpID0+IHtcclxuICAgICAgICBjb25zdCBuYW1lID0gJChub2RlKS5hdHRyKCdkYXRhLWZpZWxkJyk7XHJcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tuYW1lXTtcclxuICAgICAgICBpZiAoZmllbGQpIHtcclxuICAgICAgICAgICQoZmllbGQuZG9tTm9kZSkuYWRkQ2xhc3MoJ2ZpZWxkJyk7XHJcbiAgICAgICAgICBmaWVsZC5yZW5kZXJUbyhub2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyBpbml0IHRvIGFsc28gaW5pdCB0aGUgZmllbGRzIGluIGB0aGlzLmZpZWxkc2AuXHJcbiAgICovXHJcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGluaXQsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHRoaXMuZmllbGRzKSB7XHJcbiAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgIHRoaXMuZmllbGRzW25hbWVdLmluaXQoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyBhbmQgcmV0dXJucyB0aGUgdG9vbGJhciBpdGVtIGxheW91dCBkZWZpbml0aW9uLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGVuIGluIHRoZSB2aWV3XHJcbiAgICogc28gdGhhdCB5b3UgbWF5IGRlZmluZSB0aGUgdmlld3MgdG9vbGJhciBpdGVtcy5cclxuICAgKlxyXG4gICAqIEJ5IGRlZmF1bHQgaXQgYWRkcyBhIHNhdmUgYnV0dG9uIGJvdW5kIHRvIGB0aGlzLnNhdmUoKWAgYW5kIGNhbmNlbCB0aGF0IGZpcmVzIGBSZVVJLmJhY2soKWBcclxuICAgKlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gdGhpcy50b29sc1xyXG4gICAqIEB0ZW1wbGF0ZVxyXG4gICAqL1xyXG4gIGNyZWF0ZVRvb2xMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZVRvb2xMYXlvdXQoKSB7XHJcbiAgICBjb25zdCB0YmFyID0gW3tcclxuICAgICAgaWQ6ICdzYXZlJyxcclxuICAgICAgYWN0aW9uOiAnc2F2ZScsXHJcbiAgICAgIHN2ZzogJ3NhdmUnLFxyXG4gICAgICB0aXRsZTogdGhpcy5zYXZlVGV4dCxcclxuICAgICAgc2VjdXJpdHk6IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuaW5zZXJ0ID8gdGhpcy5pbnNlcnRTZWN1cml0eSA6IHRoaXMudXBkYXRlU2VjdXJpdHksXHJcbiAgICB9XTtcclxuXHJcbiAgICBpZiAoIUFwcC5pc09uRmlyc3RWaWV3KCkpIHtcclxuICAgICAgdGJhci5wdXNoKHtcclxuICAgICAgICBpZDogJ2NhbmNlbCcsXHJcbiAgICAgICAgc3ZnOiAnY2FuY2VsJyxcclxuICAgICAgICB0aXRsZTogdGhpcy5jYW5jZWxUb29sdGlwVGV4dCxcclxuICAgICAgICBzaWRlOiAnbGVmdCcsXHJcbiAgICAgICAgYWN0aW9uOiAnb25Ub29sQ2FuY2VsJyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudG9vbHMgfHwgKHRoaXMudG9vbHMgPSB7XHJcbiAgICAgIHRiYXIsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIG9uVG9vbENhbmNlbDogZnVuY3Rpb24gb25Ub29sQ2FuY2VsKCkge1xyXG4gICAgdGhpcy5yZWZyZXNoUmVxdWlyZWQgPSB0cnVlO1xyXG4gICAgUmVVSS5iYWNrKCk7XHJcbiAgfSxcclxuICBfZ2V0U3RvcmVBdHRyOiBmdW5jdGlvbiBfZ2V0U3RvcmVBdHRyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RvcmUgfHwgKHRoaXMuc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKCkpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgYSBmaWVsZHMgb24gc2hvdyBldmVudC5cclxuICAgKlxyXG4gICAqIFJlbW92ZXMgdGhlIHJvdy1oaWRkZW4gY3NzIGNsYXNzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtfRmllbGR9IGZpZWxkIEZpZWxkIGluc3RhbmNlIHRoYXQgaXMgYmVpbmcgc2hvd25cclxuICAgKi9cclxuICBfb25TaG93RmllbGQ6IGZ1bmN0aW9uIF9vblNob3dGaWVsZChmaWVsZCkge1xyXG4gICAgJChmaWVsZC5jb250YWluZXJOb2RlKS5yZW1vdmVDbGFzcygncm93LWhpZGRlbicpO1xyXG4gICAgJChmaWVsZC5jb250YWluZXJOb2RlKS5wYXJlbnQoKS5yZW1vdmVDbGFzcygnZGlzcGxheS1ub25lJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBhIGZpZWxkcyBvbiBoaWRlIGV2ZW50LlxyXG4gICAqXHJcbiAgICogQWRkcyB0aGUgcm93LWhpZGRlbiBjc3MgY2xhc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge19GaWVsZH0gZmllbGQgRmllbGQgaW5zdGFuY2UgdGhhdCBpcyBiZWluZyBoaWRkZW5cclxuICAgKi9cclxuICBfb25IaWRlRmllbGQ6IGZ1bmN0aW9uIF9vbkhpZGVGaWVsZChmaWVsZCkge1xyXG4gICAgJChmaWVsZC5jb250YWluZXJOb2RlKS5hZGRDbGFzcygncm93LWhpZGRlbicpO1xyXG4gICAgJChmaWVsZC5jb250YWluZXJOb2RlKS5wYXJlbnQoKS5hZGRDbGFzcygnZGlzcGxheS1ub25lJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBhIGZpZWxkcyBvbiBlbmFibGUgZXZlbnQuXHJcbiAgICpcclxuICAgKiBSZW1vdmVzIHRoZSByb3ctZGlzYWJsZWQgY3NzIGNsYXNzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtfRmllbGR9IGZpZWxkIEZpZWxkIGluc3RhbmNlIHRoYXQgaXMgYmVpbmcgZW5hYmxlZFxyXG4gICAqL1xyXG4gIF9vbkVuYWJsZUZpZWxkOiBmdW5jdGlvbiBfb25FbmFibGVGaWVsZChmaWVsZCkge1xyXG4gICAgJChmaWVsZC5jb250YWluZXJOb2RlKS5yZW1vdmVDbGFzcygncm93LWRpc2FibGVkJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBhIGZpZWxkcyBvbiBkaXNhYmxlIGV2ZW50LlxyXG4gICAqXHJcbiAgICogQWRkcyB0aGUgcm93LWRpc2FibGVkIGNzcyBjbGFzcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7X0ZpZWxkfSBmaWVsZCBGaWVsZCBpbnN0YW5jZSB0aGF0IGlzIGJlaW5nIGRpc2FibGVkXHJcbiAgICovXHJcbiAgX29uRGlzYWJsZUZpZWxkOiBmdW5jdGlvbiBfb25EaXNhYmxlRmllbGQoZmllbGQpIHtcclxuICAgICQoZmllbGQuY29udGFpbmVyTm9kZSkuYWRkQ2xhc3MoJ3Jvdy1kaXNhYmxlZCcpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyBpbnZva2VBY3Rpb24gdG8gZmlyc3QgbG9vayBmb3IgdGhlIHNwZWNpZmllZCBmdW5jdGlvbiBuYW1lIG9uIHRoZSBmaWVsZCBpbnN0YW5jZVxyXG4gICAqIGZpcnN0IGJlZm9yZSBwYXNzaW5nIGl0IHRvIHRoZSB2aWV3LlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIE5hbWUgb2YgdGhlIGZ1bmN0aW9uIHRvIGludm9rZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIFBhcmFtZXRlcnMgb2YgdGhlIGZ1bmN0aW9uIHRvIGJlIHBhc3NlZFxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgb3JpZ2luYWwgY2xpY2svdGFwIGV2ZW50XHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBUaGUgbm9kZSB0aGF0IGluaXRpYXRlZCB0aGUgZXZlbnRcclxuICAgKiBAcmV0dXJuIHtGdW5jdGlvbn0gRWl0aGVyIGNhbGxzIHRoZSBmaWVsZHMgYWN0aW9uIG9yIHJldHVybnMgdGhlIGluaGVyaXRlZCB2ZXJzaW9uIHdoaWNoIGxvb2tzIGF0IHRoZSB2aWV3IGZvciB0aGUgYWN0aW9uXHJcbiAgICovXHJcbiAgaW52b2tlQWN0aW9uOiBmdW5jdGlvbiBpbnZva2VBY3Rpb24obmFtZSwgcGFyYW1ldGVycywgZXZ0LCBub2RlKSB7XHJcbiAgICBjb25zdCBmaWVsZE5vZGUgPSAkKG5vZGUsIHRoaXMuY29udGVudE5vZGUpLnBhcmVudHMoJ1tkYXRhLWZpZWxkXScpO1xyXG4gICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tmaWVsZE5vZGUubGVuZ3RoID4gMCAmJiBmaWVsZE5vZGUuZmlyc3QoKS5hdHRyKCdkYXRhLWZpZWxkJyldO1xyXG5cclxuICAgIGlmIChmaWVsZCAmJiB0eXBlb2YgZmllbGRbbmFtZV0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgcmV0dXJuIGZpZWxkW25hbWVdLmFwcGx5KGZpZWxkLCBbcGFyYW1ldGVycywgZXZ0LCBub2RlXSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaW5oZXJpdGVkKGludm9rZUFjdGlvbiwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgYSBmaWVsZCBoYXMgZGVmaW5lZCBvbiBpdCB0aGUgc3VwcGxpZWQgbmFtZSBhcyBhIGZ1bmN0aW9uXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gdGVzdCBmb3JcclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIG9yaWdpbmFsIGNsaWNrL3RhcCBldmVudFxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGUgVGhlIG5vZGUgdGhhdCBpbml0aWF0ZWQgdGhlIGV2ZW50XHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gSWYgdGhlIGZpZWxkIGhhcyB0aGUgbmFtZWQgZnVuY3Rpb24gZGVmaW5lZFxyXG4gICAqL1xyXG4gIGhhc0FjdGlvbjogZnVuY3Rpb24gaGFzQWN0aW9uKG5hbWUsIGV2dCwgbm9kZSkge1xyXG4gICAgY29uc3QgZmllbGROb2RlID0gJChub2RlLCB0aGlzLmNvbnRlbnROb2RlKS5wYXJlbnRzKCdbZGF0YS1maWVsZF0nKTtcclxuICAgIGNvbnN0IGZpZWxkID0gZmllbGROb2RlICYmIHRoaXMuZmllbGRzW2ZpZWxkTm9kZS5sZW5ndGggPiAwICYmIGZpZWxkTm9kZS5maXJzdCgpLmF0dHIoJ2RhdGEtZmllbGQnKV07XHJcblxyXG4gICAgaWYgKGZpZWxkICYmIHR5cGVvZiBmaWVsZFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5pbmhlcml0ZWQoaGFzQWN0aW9uLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgY3JlYXRlU3RvcmU6IGZ1bmN0aW9uIGNyZWF0ZVN0b3JlKCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSxcclxuICBvbkNvbnRlbnRDaGFuZ2U6IGZ1bmN0aW9uIG9uQ29udGVudENoYW5nZSgpIHt9LFxyXG4gIHByb2Nlc3NFbnRyeTogZnVuY3Rpb24gcHJvY2Vzc0VudHJ5KGVudHJ5KSB7XHJcbiAgICByZXR1cm4gZW50cnk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBQcmUtcHJvY2Vzc2VzIHRoZSBlbnRyeSBiZWZvcmUgcHJvY2Vzc0VudHJ5IHJ1bnMuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IGRhdGFcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IGVudHJ5IHdpdGggYWN0dWFsIERhdGUgb2JqZWN0c1xyXG4gICAqL1xyXG4gIGNvbnZlcnRFbnRyeTogZnVuY3Rpb24gY29udmVydEVudHJ5KGVudHJ5KSB7XHJcbiAgICByZXR1cm4gZW50cnk7XHJcbiAgfSxcclxuICBwcm9jZXNzRmllbGRMZXZlbFNlY3VyaXR5OiBmdW5jdGlvbiBwcm9jZXNzRmllbGRMZXZlbFNlY3VyaXR5KGVudHJ5KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICB9LFxyXG4gIHByb2Nlc3NEYXRhOiBmdW5jdGlvbiBwcm9jZXNzRGF0YShlbnRyeSkge1xyXG4gICAgdGhpcy5lbnRyeSA9IHRoaXMucHJvY2Vzc0VudHJ5KHRoaXMuY29udmVydEVudHJ5KGVudHJ5IHx8IHt9KSkgfHwge307XHJcbiAgICB0aGlzLnByb2Nlc3NGaWVsZExldmVsU2VjdXJpdHkodGhpcy5lbnRyeSk7XHJcblxyXG4gICAgdGhpcy5zZXRWYWx1ZXMoZW50cnksIHRydWUpO1xyXG5cclxuICAgIC8vIFJlLWFwcGx5IGNoYW5nZXMgc2F2ZWQgZnJvbSBjb25jdXJyZW5jeS9wcmVjb25kaXRpb24gZmFpbHVyZVxyXG4gICAgaWYgKHRoaXMucHJldmlvdXNWYWx1ZXNBbGwpIHtcclxuICAgICAgLy8gTWFrZSBhIGNvcHkgb2YgdGhlIGN1cnJlbnQgdmFsdWVzLCBzbyB3ZSBjYW4gZGlmZiB0aGVtXHJcbiAgICAgIGNvbnN0IGN1cnJlbnRWYWx1ZXMgPSB0aGlzLmdldFZhbHVlcyh0cnVlKTtcclxuICAgICAgY29uc3QgZGlmZnMgPSB0aGlzLmRpZmZzKHRoaXMucHJldmlvdXNWYWx1ZXNBbGwsIGN1cnJlbnRWYWx1ZXMpO1xyXG5cclxuICAgICAgaWYgKGRpZmZzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICBkaWZmcy5mb3JFYWNoKGZ1bmN0aW9uIGZvckVhY2godmFsKSB7XHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHtcclxuICAgICAgICAgICAgbmFtZTogdmFsLFxyXG4gICAgICAgICAgICBtZXNzYWdlOiB0aGlzLmNvbmN1cnJlbmN5RXJyb3JUZXh0LFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSwgdGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMuc2hvd0NvbmN1cnJlbmN5U3VtbWFyeSgpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIC8vIE5vIGRpZmZzIGZvdW5kLCBhdHRlbXB0IHRvIHJlLXNhdmVcclxuICAgICAgICB0aGlzLnNhdmUoKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5wcmV2aW91c1ZhbHVlc0FsbCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gUmUtYXBwbHkgYW55IHBhc3NlZCBjaGFuZ2VzIGFzIHRoZXkgbWF5IGhhdmUgYmVlbiBvdmVyd3JpdHRlblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucy5jaGFuZ2VzKSB7XHJcbiAgICAgIHRoaXMuY2hhbmdlcyA9IHRoaXMub3B0aW9ucy5jaGFuZ2VzO1xyXG4gICAgICB0aGlzLnNldFZhbHVlcyh0aGlzLmNoYW5nZXMpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgX29uR2V0Q29tcGxldGU6IGZ1bmN0aW9uIF9vbkdldENvbXBsZXRlKGVudHJ5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NEYXRhKGVudHJ5KTtcclxuICAgICAgfSBlbHNlIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICAgIC8qIHRvZG86IHNob3cgZXJyb3IgbWVzc2FnZT8gKi9cclxuICAgICAgfVxyXG5cclxuICAgICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcblxyXG4gICAgICAvKiB0aGlzIG11c3QgdGFrZSBwbGFjZSB3aGVuIHRoZSBjb250ZW50IGlzIHZpc2libGUgKi9cclxuICAgICAgdGhpcy5vbkNvbnRlbnRDaGFuZ2UoKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgX29uR2V0RXJyb3I6IGZ1bmN0aW9uIF9vbkdldEVycm9yKGdldE9wdGlvbnMsIGVycm9yKSB7XHJcbiAgICB0aGlzLmhhbmRsZUVycm9yKGVycm9yKTtcclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygncGFuZWwtbG9hZGluZycpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyBhbmQgcmV0dXJucyB0aGUgRWRpdCB2aWV3IGxheW91dCBieSBmb2xsb3dpbmcgYSBzdGFuZGFyZCBmb3Igc2VjdGlvbiBhbmQgZmllbGQ6XHJcbiAgICpcclxuICAgKiBUaGUgYHRoaXMubGF5b3V0YCBpdHNlbGYgaXMgYW4gYXJyYXkgb2Ygc2VjdGlvbiBvYmplY3RzIHdoZXJlIGEgc2VjdGlvbiBvYmplY3QgaXMgZGVmaW5lZCBhcyBzdWNoOlxyXG4gICAqXHJcbiAgICogICAgIHtcclxuICAgKiAgICAgICAgbmFtZTogJ1N0cmluZycsIC8vIFJlcXVpcmVkLiB1bmlxdWUgbmFtZSBmb3IgaWRlbnRpZmljYXRpb24vY3VzdG9taXphdGlvbiBwdXJwb3Nlc1xyXG4gICAqICAgICAgICB0aXRsZTogJ1N0cmluZycsIC8vIFJlcXVpcmVkLiBUZXh0IHNob3duIGluIHRoZSBzZWN0aW9uIGhlYWRlclxyXG4gICAqICAgICAgICBjaGlsZHJlbjogW10sIC8vIEFycmF5IG9mIGNoaWxkIHJvdyBvYmplY3RzXHJcbiAgICogICAgIH1cclxuICAgKlxyXG4gICAqIEEgY2hpbGQgcm93IG9iamVjdCBoYXM6XHJcbiAgICpcclxuICAgKiAgICAge1xyXG4gICAqICAgICAgICBuYW1lOiAnU3RyaW5nJywgLy8gUmVxdWlyZWQuIHVuaXF1ZSBuYW1lIGZvciBpZGVudGlmaWNhdGlvbi9jdXN0b21pemF0aW9uIHB1cnBvc2VzXHJcbiAgICogICAgICAgIHByb3BlcnR5OiAnU3RyaW5nJywgLy8gT3B0aW9uYWwuIFRoZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBlbnRpdHkgdG8gYmluZCB0b1xyXG4gICAqICAgICAgICBsYWJlbDogJ1N0cmluZycsIC8vIE9wdGlvbmFsLiBUZXh0IHNob3duIGluIHRoZSBsYWJlbCB0byB0aGUgbGVmdCBvZiB0aGUgcHJvcGVydHlcclxuICAgKiAgICAgICAgdHlwZTogJ1N0cmluZycsIC8vIFJlcXVpcmVkLiBUaGUgZmllbGQgdHlwZSBhcyByZWdpc3RlcmVkIHdpdGggdGhlIEZpZWxkTWFuYWdlci5cclxuICAgKiAgICAgICAgLy8gRXhhbXBsZXMgb2YgdHlwZTogJ3RleHQnLCAnZGVjaW1hbCcsICdkYXRlJywgJ2xvb2t1cCcsICdzZWxlY3QnLCAnZHVyYXRpb24nXHJcbiAgICogICAgICAgICdkZWZhdWx0JzogdmFsdWUgLy8gT3B0aW9uYWwuIElmIGRlZmluZWQgdGhlIHZhbHVlIHdpbGwgYmUgc2V0IGFzIHRoZSBkZWZhdWx0IFwidW5tb2RpZmllZFwiIHZhbHVlIChub3QgZGlydHkpLlxyXG4gICAqICAgICB9XHJcbiAgICpcclxuICAgKiBBbGwgZnVydGhlciBwcm9wZXJ0aWVzIGFyZSBzZXQgYnkgdGhlaXIgcmVzcGVjdGl2ZSB0eXBlLCBwbGVhc2Ugc2VlIHRoZSBpbmRpdmlkdWFsIGZpZWxkIGZvclxyXG4gICAqIGl0cyBjb25maWd1cmFibGUgb3B0aW9ucy5cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge09iamVjdFtdfSBFZGl0IGxheW91dCBkZWZpbml0aW9uXHJcbiAgICovXHJcbiAgY3JlYXRlTGF5b3V0OiBmdW5jdGlvbiBjcmVhdGVMYXlvdXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5sYXlvdXQgfHwgW107XHJcbiAgfSxcclxuXHJcbiAgY3JlYXRlRXJyb3JIYW5kbGVyczogZnVuY3Rpb24gY3JlYXRlRXJyb3JIYW5kbGVycygpIHtcclxuICAgIHRoaXMuZXJyb3JIYW5kbGVycyA9IHRoaXMuZXJyb3JIYW5kbGVycyB8fCBbe1xyXG4gICAgICBuYW1lOiAnUHJlQ29uZGl0aW9uJyxcclxuICAgICAgdGVzdDogZnVuY3Rpb24gdGVzdFByZUNvbmRpdGlvbihlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBlcnJvciAmJiBlcnJvci5zdGF0dXMgPT09IHRoaXMuSFRUUF9TVEFUVVMuUFJFQ09ORElUSU9OX0ZBSUxFRDtcclxuICAgICAgfSxcclxuICAgICAgaGFuZGxlOiBmdW5jdGlvbiBoYW5kbGVQcmVDb25kaXRpb24oZXJyb3IsIG5leHQpIHtcclxuICAgICAgICBuZXh0KCk7IC8vIEludm9rZSB0aGUgbmV4dCBlcnJvciBoYW5kbGVyIGZpcnN0LCB0aGUgcmVmcmVzaCB3aWxsIGNoYW5nZSBhIGxvdCBvZiBtdXRhYmxlL3NoYXJlZCBzdGF0ZVxyXG5cclxuICAgICAgICAvLyBQcmVzZXJ2ZSBvdXIgY3VycmVudCBmb3JtIHZhbHVlcyAoYWxsIG9mIHRoZW0pLFxyXG4gICAgICAgIC8vIGFuZCByZWxvYWQgdGhlIHZpZXcgdG8gZmV0Y2ggdGhlIG5ldyBkYXRhLlxyXG4gICAgICAgIHRoaXMucHJldmlvdXNWYWx1ZXNBbGwgPSB0aGlzLmdldFZhbHVlcyh0cnVlKTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMua2V5ID0gdGhpcy5lbnRyeS4ka2V5OyAvLyBGb3JjZSBhIGZldGNoIGJ5IGtleVxyXG4gICAgICAgIGRlbGV0ZSB0aGlzLm9wdGlvbnMuZW50cnk7IC8vIFJlbW92ZSB0aGlzLCBvciB0aGUgZm9ybSB3aWxsIGxvYWQgdGhlIGVudHJ5IHRoYXQgY2FtZSBmcm9tIHRoZSBkZXRhaWwgdmlld1xyXG4gICAgICAgIHRoaXMucmVmcmVzaCgpO1xyXG4gICAgICB9LFxyXG4gICAgfSwge1xyXG4gICAgICBuYW1lOiAnQWxlcnRFcnJvcicsXHJcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIHRlc3RBbGVydChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBlcnJvci5zdGF0dXMgIT09IHRoaXMuSFRUUF9TVEFUVVMuUFJFQ09ORElUSU9OX0ZBSUxFRDtcclxuICAgICAgfSxcclxuICAgICAgaGFuZGxlOiBmdW5jdGlvbiBoYW5kbGVBbGVydChlcnJvciwgbmV4dCkge1xyXG4gICAgICAgIGFsZXJ0KHRoaXMuZ2V0RXJyb3JNZXNzYWdlKGVycm9yKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LCB7XHJcbiAgICAgIG5hbWU6ICdDYXRjaEFsbCcsXHJcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIHRlc3RDYXRjaEFsbCgpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgICAgaGFuZGxlOiBmdW5jdGlvbiBoYW5kbGVDYXRjaEFsbChlcnJvciwgbmV4dCkge1xyXG4gICAgICAgIGNvbnN0IGZyb21Db250ZXh0ID0gdGhpcy5vcHRpb25zLmZyb21Db250ZXh0O1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5mcm9tQ29udGV4dCA9IG51bGw7XHJcbiAgICAgICAgY29uc3QgZXJyb3JJdGVtID0ge1xyXG4gICAgICAgICAgc2VydmVyRXJyb3I6IGVycm9yLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEVycm9yTWFuYWdlci5hZGRFcnJvcih0aGlzLmdldEVycm9yTWVzc2FnZShlcnJvciksIGVycm9ySXRlbSk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmZyb21Db250ZXh0ID0gZnJvbUNvbnRleHQ7XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9LFxyXG4gICAgfV07XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZXJyb3JIYW5kbGVycztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqXHJcbiAgICogUmV0dXJucyB0aGUgdmlldyBrZXlcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFZpZXcga2V5XHJcbiAgICovXHJcbiAgZ2V0VGFnOiBmdW5jdGlvbiBnZXRUYWcoKSB7XHJcbiAgICBsZXQgdGFnID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5lbnRyeSAmJiB0aGlzLm9wdGlvbnMuZW50cnlbdGhpcy5pZFByb3BlcnR5XTtcclxuICAgIGlmICghdGFnKSB7XHJcbiAgICAgIHRhZyA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMua2V5O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0YWc7XHJcbiAgfSxcclxuICBwcm9jZXNzTGF5b3V0OiBmdW5jdGlvbiBwcm9jZXNzTGF5b3V0KGxheW91dCkge1xyXG4gICAgY29uc3Qgcm93cyA9IChsYXlvdXQuY2hpbGRyZW4gfHwgbGF5b3V0LmFzIHx8IGxheW91dCk7XHJcbiAgICBjb25zdCBzZWN0aW9uUXVldWUgPSBbXTtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBbXTtcclxuICAgIGxldCBzZWN0aW9uU3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgbGV0IGN1cnJlbnQ7XHJcblxyXG4gICAgaWYgKCFsYXlvdXQub3B0aW9ucykge1xyXG4gICAgICBsYXlvdXQub3B0aW9ucyA9IHtcclxuICAgICAgICB0aXRsZTogdGhpcy5kZXRhaWxzVGV4dCxcclxuICAgICAgfTtcclxuICAgIH1cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcm93cy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjdXJyZW50ID0gcm93c1tpXTtcclxuXHJcbiAgICAgIGlmIChjdXJyZW50LmNoaWxkcmVuIHx8IGN1cnJlbnQuYXMpIHtcclxuICAgICAgICBpZiAoc2VjdGlvblN0YXJ0ZWQpIHtcclxuICAgICAgICAgIHNlY3Rpb25RdWV1ZS5wdXNoKGN1cnJlbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NMYXlvdXQoY3VycmVudCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFzZWN0aW9uU3RhcnRlZCkge1xyXG4gICAgICAgIHNlY3Rpb25TdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICBjb250ZW50LnB1c2godGhpcy5zZWN0aW9uQmVnaW5UZW1wbGF0ZS5hcHBseShsYXlvdXQsIHRoaXMpKTtcclxuICAgICAgICBjb250ZW50LnB1c2goJzxkaXYgY2xhc3M9XCJyb3cgZWRpdC1yb3dcIj4nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jcmVhdGVSb3dDb250ZW50KGN1cnJlbnQsIGNvbnRlbnQpO1xyXG4gICAgfVxyXG4gICAgY29udGVudC5wdXNoKCc8L2Rpdj4nKTtcclxuICAgIGNvbnRlbnQucHVzaCh0aGlzLnNlY3Rpb25FbmRUZW1wbGF0ZS5hcHBseShsYXlvdXQsIHRoaXMpKTtcclxuICAgIGNvbnN0IHNlY3Rpb25Ob2RlID0gJChjb250ZW50LmpvaW4oJycpKTtcclxuICAgIHNlY3Rpb25Ob2RlLmFjY29yZGlvbigpO1xyXG4gICAgdGhpcy5vbkFwcGx5U2VjdGlvbk5vZGUoc2VjdGlvbk5vZGUuZ2V0KDApLCBjdXJyZW50KTtcclxuICAgICQodGhpcy5jb250ZW50Tm9kZSkuYXBwZW5kKHNlY3Rpb25Ob2RlKTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlY3Rpb25RdWV1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjdXJyZW50ID0gc2VjdGlvblF1ZXVlW2ldO1xyXG5cclxuICAgICAgdGhpcy5wcm9jZXNzTGF5b3V0KGN1cnJlbnQpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb25BcHBseVNlY3Rpb25Ob2RlOiBmdW5jdGlvbiBvbkFwcGx5U2VjdGlvbk5vZGUoLyogc2VjdGlvbk5vZGUsIGxheW91dCovKSB7fSxcclxuICBjcmVhdGVSb3dDb250ZW50OiBmdW5jdGlvbiBjcmVhdGVSb3dDb250ZW50KGxheW91dCwgY29udGVudCkge1xyXG4gICAgY29uc3QgQ3RvciA9IEZpZWxkTWFuYWdlci5nZXQobGF5b3V0LnR5cGUpO1xyXG4gICAgaWYgKEN0b3IpIHtcclxuICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tsYXlvdXQubmFtZSB8fCBsYXlvdXQucHJvcGVydHldID0gbmV3IEN0b3IobGFuZy5taXhpbih7XHJcbiAgICAgICAgb3duZXI6IHRoaXMsXHJcbiAgICAgIH0sIGxheW91dCkpO1xyXG5cclxuICAgICAgY29uc3QgdGVtcGxhdGUgPSBmaWVsZC5wcm9wZXJ0eVRlbXBsYXRlIHx8IHRoaXMucHJvcGVydHlUZW1wbGF0ZTtcclxuXHJcbiAgICAgIGlmIChmaWVsZC5hdXRvRm9jdXMgJiYgIXRoaXMuX2ZvY3VzRmllbGQpIHtcclxuICAgICAgICB0aGlzLl9mb2N1c0ZpZWxkID0gZmllbGQ7XHJcbiAgICAgIH0gZWxzZSBpZiAoZmllbGQuYXV0b0ZvY3VzICYmIHRoaXMuX2ZvY3VzRmllbGQpIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ09ubHkgb25lIGZpZWxkIGNhbiBoYXZlIGF1dG9Gb2N1cyBzZXQgdG8gdHJ1ZSBpbiB0aGUgRWRpdCBsYXlvdXQuJyk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMuY29ubmVjdChmaWVsZCwgJ29uU2hvdycsIHRoaXMuX29uU2hvd0ZpZWxkKTtcclxuICAgICAgdGhpcy5jb25uZWN0KGZpZWxkLCAnb25IaWRlJywgdGhpcy5fb25IaWRlRmllbGQpO1xyXG4gICAgICB0aGlzLmNvbm5lY3QoZmllbGQsICdvbkVuYWJsZScsIHRoaXMuX29uRW5hYmxlRmllbGQpO1xyXG4gICAgICB0aGlzLmNvbm5lY3QoZmllbGQsICdvbkRpc2FibGUnLCB0aGlzLl9vbkRpc2FibGVGaWVsZCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5tdWx0aUNvbHVtblZpZXcpIHtcclxuICAgICAgICBsZXQgaGlkZGVuID0gJyc7XHJcbiAgICAgICAgaWYgKGZpZWxkLnR5cGUgPT09ICdoaWRkZW4nKSB7XHJcbiAgICAgICAgICBoaWRkZW4gPSAnZGlzcGxheS1ub25lJztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGVudC5wdXNoKGA8ZGl2IGNsYXNzPVwiJHt0aGlzLm11bHRpQ29sdW1uQ2xhc3N9IGNvbHVtbnMgJHtoaWRkZW59XCI+YCk7XHJcbiAgICAgIH1cclxuICAgICAgY29udGVudC5wdXNoKHRlbXBsYXRlLmFwcGx5KGZpZWxkLCB0aGlzKSk7XHJcbiAgICAgIGlmICh0aGlzLm11bHRpQ29sdW1uVmlldykge1xyXG4gICAgICAgIGNvbnRlbnQucHVzaCgnPC9kaXY+Jyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEluaXRpYXRlcyB0aGUgcmVxdWVzdC5cclxuICAgKi9cclxuICByZXF1ZXN0RGF0YTogZnVuY3Rpb24gcmVxdWVzdERhdGEoKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0KCdzdG9yZScpO1xyXG5cclxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0RGF0YVVzaW5nTW9kZWwoKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fb25HZXRDb21wbGV0ZShkYXRhKTtcclxuICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgIHRoaXMuX29uR2V0RXJyb3IobnVsbCwgZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHN0b3JlKSB7XHJcbiAgICAgIGNvbnN0IGdldE9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgIHRoaXMuX2FwcGx5U3RhdGVUb0dldE9wdGlvbnMoZ2V0T3B0aW9ucyk7XHJcblxyXG4gICAgICBjb25zdCBnZXRFeHByZXNzaW9uID0gdGhpcy5fYnVpbGRHZXRFeHByZXNzaW9uKCkgfHwgbnVsbDtcclxuICAgICAgY29uc3QgZ2V0UmVzdWx0cyA9IHRoaXMucmVxdWVzdERhdGFVc2luZ1N0b3JlKGdldEV4cHJlc3Npb24sIGdldE9wdGlvbnMpO1xyXG5cclxuICAgICAgd2hlbihnZXRSZXN1bHRzLFxyXG4gICAgICAgIHRoaXMuX29uR2V0Q29tcGxldGUuYmluZCh0aGlzKSxcclxuICAgICAgICB0aGlzLl9vbkdldEVycm9yLmJpbmQodGhpcywgZ2V0T3B0aW9ucylcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHJldHVybiBnZXRSZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnNvbGUud2FybignRXJyb3IgcmVxdWVzdGluZyBkYXRhLCBubyBtb2RlbCBvciBzdG9yZSB3YXMgZGVmaW5lZC4gRGlkIHlvdSBtZWFuIHRvIG1peGluIF9TRGF0YUVkaXRNaXhpbiB0byB5b3VyIGVkaXQgdmlldz8nKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGFVc2luZ01vZGVsOiBmdW5jdGlvbiByZXF1ZXN0RGF0YVVzaW5nTW9kZWwoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0RW50cnkodGhpcy5vcHRpb25zKTtcclxuICB9LFxyXG4gIHJlcXVlc3REYXRhVXNpbmdTdG9yZTogZnVuY3Rpb24gcmVxdWVzdERhdGFVc2luZ1N0b3JlKGdldEV4cHJlc3Npb24sIGdldE9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcbiAgICByZXR1cm4gc3RvcmUuZ2V0KGdldEV4cHJlc3Npb24sIGdldE9wdGlvbnMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogTG9vcHMgYWxsIHRoZSBmaWVsZHMgbG9va2luZyBmb3IgYW55IHdpdGggdGhlIGBkZWZhdWx0YCBwcm9wZXJ0eSBzZXQsIGlmIHNldCBhcHBseSB0aGF0XHJcbiAgICogdmFsdWUgYXMgdGhlIGluaXRpYWwgdmFsdWUgb2YgdGhlIGZpZWxkLiBJZiB0aGUgdmFsdWUgaXMgYSBmdW5jdGlvbiwgaXRzIGV4cGFuZGVkIHRoZW4gYXBwbGllZC5cclxuICAgKi9cclxuICBhcHBseUZpZWxkRGVmYXVsdHM6IGZ1bmN0aW9uIGFwcGx5RmllbGREZWZhdWx0cygpIHtcclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiB0aGlzLmZpZWxkcykge1xyXG4gICAgICBpZiAodGhpcy5maWVsZHMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW25hbWVdO1xyXG4gICAgICAgIGNvbnN0IGRlZmF1bHRWYWx1ZSA9IGZpZWxkLmRlZmF1bHQ7XHJcblxyXG4gICAgICAgIGlmICh0eXBlb2YgZGVmYXVsdFZhbHVlID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmaWVsZC5zZXRWYWx1ZSh0aGlzLmV4cGFuZEV4cHJlc3Npb24oZGVmYXVsdFZhbHVlLCBmaWVsZCkpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBMb29wcyBhbGwgZmllbGRzIGFuZCBjYWxscyBpdHMgYGNsZWFyVmFsdWUoKWAuXHJcbiAgICovXHJcbiAgY2xlYXJWYWx1ZXM6IGZ1bmN0aW9uIGNsZWFyVmFsdWVzKCkge1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHRoaXMuZmllbGRzKSB7XHJcbiAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgIHRoaXMuZmllbGRzW25hbWVdLmNsZWFyVmFsdWUoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgZ2l2ZW4gdmFsdWVzIGJ5IGxvb3BpbmcgdGhlIGZpZWxkcyBhbmQgY2hlY2tpbmcgaWYgdGhlIGZpZWxkIHByb3BlcnR5IG1hdGNoZXNcclxuICAgKiBhIGtleSBpbiB0aGUgcGFzc2VkIHZhbHVlcyBvYmplY3QgKGFmdGVyIGNvbnNpZGVyaW5nIGEgZmllbGRzIGBhcHBseVRvYCkuXHJcbiAgICpcclxuICAgKiBUaGUgdmFsdWUgc2V0IGlzIHRoZW4gcGFzc2VkIHRoZSBpbml0aWFsIHN0YXRlLCB0cnVlIGZvciBkZWZhdWx0L3VubW9kaWZpZWQvY2xlYW4gYW5kIGZhbHNlXHJcbiAgICogZm9yIGRpcnR5IG9yIGFsdGVyZWQuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzIGRhdGEgZW50cnksIG9yIGNvbGxlY3Rpb24gb2Yga2V5L3ZhbHVlcyB3aGVyZSBrZXkgbWF0Y2hlcyBhIGZpZWxkcyBwcm9wZXJ0eSBhdHRyaWJ1dGVcclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGluaXRpYWwgSW5pdGlhbCBzdGF0ZSBvZiB0aGUgdmFsdWUsIHRydWUgZm9yIGNsZWFuLCBmYWxzZSBmb3IgZGlydHlcclxuICAgKi9cclxuICBzZXRWYWx1ZXM6IGZ1bmN0aW9uIHNldFZhbHVlcyh2YWx1ZXMsIGluaXRpYWwpIHtcclxuICAgIGNvbnN0IG5vVmFsdWUgPSB7fTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5maWVsZHMpIHtcclxuICAgICAgaWYgKHRoaXMuZmllbGRzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tuYW1lXTtcclxuICAgICAgICBsZXQgdmFsdWU7XHJcbiAgICAgICAgLy8gZm9yIG5vdywgZXhwbGljaXRseSBoaWRkZW4gZmllbGRzICh2aWEuIHRoZSBmaWVsZC5oaWRlKCkgbWV0aG9kKSBhcmUgbm90IGluY2x1ZGVkXHJcbiAgICAgICAgaWYgKGZpZWxkLmlzSGlkZGVuKCkpIHtcclxuICAgICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGZpZWxkLmFwcGx5VG8gIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHV0aWxpdHkuZ2V0VmFsdWUodmFsdWVzLCBmaWVsZC5hcHBseVRvLCBub1ZhbHVlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdmFsdWUgPSB1dGlsaXR5LmdldFZhbHVlKHZhbHVlcywgZmllbGQucHJvcGVydHkgfHwgbmFtZSwgbm9WYWx1ZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmeWk6IHVzZXMgdGhlIGZhY3QgdGhhdCAoe30gIT09IHt9KVxyXG4gICAgICAgIGlmICh2YWx1ZSAhPT0gbm9WYWx1ZSkge1xyXG4gICAgICAgICAgZmllbGQuc2V0VmFsdWUodmFsdWUsIGluaXRpYWwpO1xyXG4gICAgICAgICAgJChmaWVsZC5jb250YWluZXJOb2RlKS5yZW1vdmVDbGFzcygncm93LWVycm9yJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXRyaWV2ZXMgdGhlIHZhbHVlIGZyb20gZXZlcnkgZmllbGQsIHNraXBwaW5nIHRoZSBvbmVzIGV4Y2x1ZGVkLCBhbmQgbWVyZ2VzIHRoZW0gaW50byBhXHJcbiAgICogc2luZ2xlIHBheWxvYWQgd2l0aCB0aGUga2V5IGJlaW5nIHRoZSBmaWVsZHMgYHByb3BlcnR5YCBhdHRyaWJ1dGUsIHRha2luZyBpbnRvIGNvbnNpZGVyYXRpb24gYGFwcGx5VG9gIGlmIGRlZmluZWQuXHJcbiAgICpcclxuICAgKiBJZiBhbGwgaXMgcGFzc2VkIGFzIHRydWUsIGl0IGFsc28gZ3JhYnMgaGlkZGVuIGFuZCB1bm1vZGlmaWVkIChjbGVhbikgdmFsdWVzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtCb29sZWFufSBhbGwgVHJ1ZSB0byBhbHNvIGluY2x1ZGUgaGlkZGVuIGFuZCB1bm1vZGlmaWVkIHZhbHVlcy5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEEgc2luZ2xlIG9iamVjdCBwYXlsb2FkIHdpdGggYWxsIHRoZSB2YWx1ZXMuXHJcbiAgICovXHJcbiAgZ2V0VmFsdWVzOiBmdW5jdGlvbiBnZXRWYWx1ZXMoYWxsKSB7XHJcbiAgICBjb25zdCBwYXlsb2FkID0ge307XHJcbiAgICBsZXQgZW1wdHkgPSB0cnVlO1xyXG5cclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiB0aGlzLmZpZWxkcykge1xyXG4gICAgICBpZiAodGhpcy5maWVsZHMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW25hbWVdO1xyXG4gICAgICAgIGNvbnN0IHZhbHVlID0gZmllbGQuZ2V0VmFsdWUoKTtcclxuXHJcbiAgICAgICAgY29uc3QgaW5jbHVkZSA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihmaWVsZC5pbmNsdWRlLCB2YWx1ZSwgZmllbGQsIHRoaXMpO1xyXG4gICAgICAgIGNvbnN0IGV4Y2x1ZGUgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oZmllbGQuZXhjbHVkZSwgdmFsdWUsIGZpZWxkLCB0aGlzKTtcclxuXHJcbiAgICAgICAgLyoqXHJcbiAgICAgICAgICogaW5jbHVkZTpcclxuICAgICAgICAgKiAgIHRydWU6IGFsd2F5cyBpbmNsdWRlIHZhbHVlXHJcbiAgICAgICAgICogICBmYWxzZTogYWx3YXlzIGV4Y2x1ZGUgdmFsdWVcclxuICAgICAgICAgKiBleGNsdWRlOlxyXG4gICAgICAgICAqICAgdHJ1ZTogYWx3YXlzIGV4Y2x1ZGUgdmFsdWVcclxuICAgICAgICAgKiAgIGZhbHNlOiBkZWZhdWx0IGhhbmRsaW5nXHJcbiAgICAgICAgICovXHJcbiAgICAgICAgaWYgKGluY2x1ZGUgIT09IHVuZGVmaW5lZCAmJiAhaW5jbHVkZSkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChleGNsdWRlICE9PSB1bmRlZmluZWQgJiYgZXhjbHVkZSkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBmb3Igbm93LCBleHBsaWNpdGx5IGhpZGRlbiBmaWVsZHMgKHZpYS4gdGhlIGZpZWxkLmhpZGUoKSBtZXRob2QpIGFyZSBub3QgaW5jbHVkZWRcclxuICAgICAgICBpZiAoYWxsIHx8ICgoZmllbGQuYWx3YXlzVXNlVmFsdWUgfHwgZmllbGQuaXNEaXJ0eSgpIHx8IGluY2x1ZGUpICYmICFmaWVsZC5pc0hpZGRlbigpKSkge1xyXG4gICAgICAgICAgaWYgKGZpZWxkLmFwcGx5VG8gIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgIGlmICh0eXBlb2YgZmllbGQuYXBwbHlUbyA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICAgIGlmICh0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnKSB7XHJcbiAgICAgICAgICAgICAgICAvLyBDb3B5IHRoZSB2YWx1ZSBwcm9wZXJ0aWVzIGludG8gb3VyIHBheWxvYWQgb2JqZWN0XHJcbiAgICAgICAgICAgICAgICBmb3IgKGNvbnN0IHByb3AgaW4gdmFsdWUpIHtcclxuICAgICAgICAgICAgICAgICAgaWYgKHZhbHVlLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcGF5bG9hZFtwcm9wXSA9IHZhbHVlW3Byb3BdO1xyXG4gICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICBmaWVsZC5hcHBseVRvKHBheWxvYWQsIHZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIGlmICh0eXBlb2YgZmllbGQuYXBwbHlUbyA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICBjb25zdCB0YXJnZXQgPSB1dGlsaXR5LmdldFZhbHVlKHBheWxvYWQsIGZpZWxkLmFwcGx5VG8pO1xyXG4gICAgICAgICAgICAgIGxhbmcubWl4aW4odGFyZ2V0LCB2YWx1ZSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHV0aWxpdHkuc2V0VmFsdWUocGF5bG9hZCwgZmllbGQucHJvcGVydHkgfHwgbmFtZSwgdmFsdWUpO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGVtcHR5ID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZW1wdHkgPyBmYWxzZSA6IHBheWxvYWQ7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBMb29wcyBhbmQgZ2F0aGVycyB0aGUgdmFsaWRhdGlvbiBlcnJvcnMgcmV0dXJuZWQgZnJvbSBlYWNoIGZpZWxkIGFuZCBhZGRzIHRoZW0gdG8gdGhlXHJcbiAgICogdmFsaWRhdGlvbiBzdW1tYXJ5IGFyZWEuIElmIG5vIGVycm9ycywgcmVtb3ZlcyB0aGUgdmFsaWRhdGlvbiBzdW1tYXJ5LlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW4vT2JqZWN0W119IFJldHVybnMgdGhlIGFycmF5IG9mIGVycm9ycyBpZiBwcmVzZW50IG9yIGZhbHNlIGZvciBubyBlcnJvcnMuXHJcbiAgICovXHJcbiAgdmFsaWRhdGU6IGZ1bmN0aW9uIHZhbGlkYXRlKCkge1xyXG4gICAgdGhpcy5lcnJvcnMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5maWVsZHMpIHtcclxuICAgICAgaWYgKHRoaXMuZmllbGRzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgY29uc3QgZmllbGQgPSB0aGlzLmZpZWxkc1tuYW1lXTtcclxuXHJcbiAgICAgICAgY29uc3QgcmVzdWx0ID0gZmllbGQudmFsaWRhdGUoKTtcclxuICAgICAgICBpZiAoIWZpZWxkLmlzSGlkZGVuKCkgJiYgcmVzdWx0ICE9PSBmYWxzZSkge1xyXG4gICAgICAgICAgJChmaWVsZC5jb250YWluZXJOb2RlKS5hZGRDbGFzcygncm93LWVycm9yJyk7XHJcblxyXG4gICAgICAgICAgdGhpcy5lcnJvcnMucHVzaCh7XHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHJlc3VsdCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5lcnJvcnMubGVuZ3RoID4gMCA/IHRoaXMuZXJyb3JzIDogZmFsc2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBmb3JtIGlzIGN1cnJlbnRseSBidXN5L2Rpc2FibGVkXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBpc0Zvcm1EaXNhYmxlZDogZnVuY3Rpb24gaXNGb3JtRGlzYWJsZWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5idXN5O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRGlzYWJsZXMgdGhlIGZvcm0gYnkgc2V0dGluZyBidXN5IHRvIHRydWUgYW5kIGRpc2FibGluZyB0aGUgdG9vbGJhci5cclxuICAgKi9cclxuICBkaXNhYmxlOiBmdW5jdGlvbiBkaXNhYmxlKCkge1xyXG4gICAgdGhpcy5idXN5ID0gdHJ1ZTtcclxuXHJcbiAgICBpZiAoQXBwLmJhcnMudGJhcikge1xyXG4gICAgICBBcHAuYmFycy50YmFyLmRpc2FibGVUb29sKCdzYXZlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgJCgnYm9keScpLmFkZENsYXNzKCdidXN5Jyk7Ly8gVE9ETzogTWFrZSB0aGlzIHRoZSByb290L2FwcCBjb250YWluZXIgbm9kZVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRW5hYmxlcyB0aGUgZm9ybSBieSBzZXR0aW5nIGJ1c3kgdG8gZmFsc2UgYW5kIGVuYWJsaW5nIHRoZSB0b29sYmFyXHJcbiAgICovXHJcbiAgZW5hYmxlOiBmdW5jdGlvbiBlbmFibGUoKSB7XHJcbiAgICB0aGlzLmJ1c3kgPSBmYWxzZTtcclxuXHJcbiAgICBpZiAoQXBwLmJhcnMudGJhcikge1xyXG4gICAgICBBcHAuYmFycy50YmFyLmVuYWJsZVRvb2woJ3NhdmUnKTtcclxuICAgIH1cclxuXHJcbiAgICAkKCdib2R5JykucmVtb3ZlQ2xhc3MoJ2J1c3knKTsvLyBUT0RPOiBNYWtlIHRoaXMgdGhlIHJvb3QvYXBwIGNvbnRhaW5lciBub2RlXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgYnkgc2F2ZSgpIHdoZW4gcGVyZm9ybWluZyBhbiBpbnNlcnQgKGNyZWF0ZSkuXHJcbiAgICogR2F0aGVycyB0aGUgdmFsdWVzLCBjcmVhdGVzIHRoZSBwYXlsb2FkIGZvciBpbnNlcnQsIGNyZWF0ZXMgdGhlIHNkYXRhIHJlcXVlc3QgYW5kXHJcbiAgICogY2FsbHMgYGNyZWF0ZWAuXHJcbiAgICovXHJcbiAgaW5zZXJ0OiBmdW5jdGlvbiBpbnNlcnQoKSB7XHJcbiAgICB0aGlzLmRpc2FibGUoKTtcclxuXHJcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcygpO1xyXG4gICAgaWYgKHZhbHVlcykge1xyXG4gICAgICB0aGlzLm9uSW5zZXJ0KHZhbHVlcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBSZVVJLmJhY2soKTtcclxuICAgIH1cclxuICB9LFxyXG4gIG9uSW5zZXJ0OiBmdW5jdGlvbiBvbkluc2VydCh2YWx1ZXMpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcbiAgICBjb25zdCBhZGRPcHRpb25zID0ge1xyXG4gICAgICBvdmVyd3JpdGU6IGZhbHNlLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5jcmVhdGVFbnRyeUZvckluc2VydCh2YWx1ZXMpO1xyXG4gICAgdGhpcy5fYXBwbHlTdGF0ZVRvQWRkT3B0aW9ucyhhZGRPcHRpb25zKTtcclxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICB0aGlzLl9tb2RlbC5pbnNlcnRFbnRyeShlbnRyeSwgYWRkT3B0aW9ucykudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMub25BZGRDb21wbGV0ZShlbnRyeSwgZGF0YSk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICB0aGlzLm9uQWRkRXJyb3IoYWRkT3B0aW9ucywgZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHN0b3JlKSB7XHJcbiAgICAgIHdoZW4oc3RvcmUuYWRkKGVudHJ5LCBhZGRPcHRpb25zKSxcclxuICAgICAgICB0aGlzLm9uQWRkQ29tcGxldGUuYmluZCh0aGlzLCBlbnRyeSksXHJcbiAgICAgICAgdGhpcy5vbkFkZEVycm9yLmJpbmQodGhpcywgYWRkT3B0aW9ucylcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9hcHBseVN0YXRlVG9BZGRPcHRpb25zOiBmdW5jdGlvbiBfYXBwbHlTdGF0ZVRvQWRkT3B0aW9ucygvKiBhZGRPcHRpb25zKi8pIHt9LFxyXG4gIG9uQWRkQ29tcGxldGU6IGZ1bmN0aW9uIG9uQWRkQ29tcGxldGUoZW50cnksIHJlc3VsdCkge1xyXG4gICAgdGhpcy5lbmFibGUoKTtcclxuXHJcbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5fYnVpbGRSZWZyZXNoTWVzc2FnZShlbnRyeSwgcmVzdWx0KTtcclxuICAgIGNvbm5lY3QucHVibGlzaCgnL2FwcC9yZWZyZXNoJywgW21lc3NhZ2VdKTtcclxuXHJcbiAgICB0aGlzLm9uSW5zZXJ0Q29tcGxldGVkKHJlc3VsdCk7XHJcbiAgfSxcclxuICBvbkFkZEVycm9yOiBmdW5jdGlvbiBvbkFkZEVycm9yKGFkZE9wdGlvbnMsIGVycm9yKSB7XHJcbiAgICB0aGlzLmVuYWJsZSgpO1xyXG4gICAgdGhpcy5oYW5kbGVFcnJvcihlcnJvcik7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBpbnNlcnQgY29tcGxldGUsIGNoZWNrcyBmb3IgYHRoaXMub3B0aW9ucy5yZXR1cm5Ub2AgZWxzZSBpdCBzaW1wbHkgZ29lcyBiYWNrLlxyXG4gICAqIEBwYXJhbSBlbnRyeVxyXG4gICAqL1xyXG4gIG9uSW5zZXJ0Q29tcGxldGVkOiBmdW5jdGlvbiBvbkluc2VydENvbXBsZXRlZCgvKiBlbnRyeSovKSB7XHJcbiAgICAvLyByZXR1cm5UbyBpcyBoYW5kbGVkIGJ5IFJlVUkgYmFja1xyXG4gICAgUmVVSS5iYWNrKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgYnkgc2F2ZSgpIHdoZW4gcGVyZm9ybWluZyBhbiB1cGRhdGUgKGVkaXQpLlxyXG4gICAqIEdhdGhlcnMgdGhlIHZhbHVlcywgY3JlYXRlcyB0aGUgcGF5bG9hZCBmb3IgdXBkYXRlLCBjcmVhdGVzIHRoZSBzZGF0YSByZXF1ZXN0IGFuZFxyXG4gICAqIGNhbGxzIGB1cGRhdGVgLlxyXG4gICAqL1xyXG4gIHVwZGF0ZTogZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoKTtcclxuICAgIGlmICh2YWx1ZXMpIHtcclxuICAgICAgdGhpcy5kaXNhYmxlKCk7XHJcbiAgICAgIHRoaXMub25VcGRhdGUodmFsdWVzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMub25VcGRhdGVDb21wbGV0ZWQoZmFsc2UpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb25VcGRhdGU6IGZ1bmN0aW9uIG9uVXBkYXRlKHZhbHVlcykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuICAgIGNvbnN0IHB1dE9wdGlvbnMgPSB7XHJcbiAgICAgIG92ZXJ3cml0ZTogdHJ1ZSxcclxuICAgIH07XHJcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuY3JlYXRlRW50cnlGb3JVcGRhdGUodmFsdWVzKTtcclxuICAgIHRoaXMuX2FwcGx5U3RhdGVUb1B1dE9wdGlvbnMocHV0T3B0aW9ucyk7XHJcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcclxuICAgICAgdGhpcy5fbW9kZWwudXBkYXRlRW50cnkoZW50cnksIHB1dE9wdGlvbnMpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLm9uUHV0Q29tcGxldGUoZW50cnksIGRhdGEpO1xyXG4gICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgdGhpcy5vblB1dEVycm9yKHB1dE9wdGlvbnMsIGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChzdG9yZSkge1xyXG4gICAgICB3aGVuKHN0b3JlLnB1dChlbnRyeSwgcHV0T3B0aW9ucyksXHJcbiAgICAgICAgdGhpcy5vblB1dENvbXBsZXRlLmJpbmQodGhpcywgZW50cnkpLFxyXG4gICAgICAgIHRoaXMub25QdXRFcnJvci5iaW5kKHRoaXMsIHB1dE9wdGlvbnMpXHJcbiAgICAgICk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBHYXRoZXJzIHRoZSB2YWx1ZXMgZm9yIHRoZSBlbnRyeSB0byBzZW5kIGJhY2sgYW5kIHJldHVybnMgdGhlIGFwcHJvcHJpYXRlIHBheWxvYWQgZm9yXHJcbiAgICogY3JlYXRpbmcgb3IgdXBkYXRpbmcuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBFbnRyeS9wYXlsb2FkXHJcbiAgICovXHJcbiAgY3JlYXRlSXRlbTogZnVuY3Rpb24gY3JlYXRlSXRlbSgpIHtcclxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzKCk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaW5zZXJ0aW5nID8gdGhpcy5jcmVhdGVFbnRyeUZvckluc2VydCh2YWx1ZXMpIDogdGhpcy5jcmVhdGVFbnRyeUZvclVwZGF0ZSh2YWx1ZXMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgdGhlIHZhbHVlcyBvYmplY3QgYW5kIGFkZHMgdGhlIG5lZWRlZCBwcm9wZXJ0aWVycyBmb3IgdXBkYXRpbmcuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlc1xyXG4gICAqIEByZXR1cm4ge09iamVjdH0gT2JqZWN0IHdpdGggcHJvcGVydGllcyBmb3IgdXBkYXRpbmdcclxuICAgKi9cclxuICBjcmVhdGVFbnRyeUZvclVwZGF0ZTogZnVuY3Rpb24gY3JlYXRlRW50cnlGb3JVcGRhdGUodmFsdWVzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb252ZXJ0VmFsdWVzKHZhbHVlcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBUYWtlcyB0aGUgdmFsdWVzIG9iamVjdCBhbmQgYWRkcyB0aGUgbmVlZGVkIHByb3BlcnRpZXJzIGZvciBjcmVhdGluZy9pbnNlcnRpbmcuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHZhbHVlc1xyXG4gICAqIEByZXR1cm4ge09iamVjdH0gT2JqZWN0IHdpdGggcHJvcGVydGllcyBmb3IgaW5zZXJ0aW5nXHJcbiAgICovXHJcbiAgY3JlYXRlRW50cnlGb3JJbnNlcnQ6IGZ1bmN0aW9uIGNyZWF0ZUVudHJ5Rm9ySW5zZXJ0KHZhbHVlcykge1xyXG4gICAgcmV0dXJuIHRoaXMuY29udmVydFZhbHVlcyh2YWx1ZXMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRnVuY3Rpb24gdG8gY2FsbCB0byB0cmFuZm9ybSB2YWx1ZXMgYmVmb3JlIHNhdmVcclxuICAgKi9cclxuICBjb252ZXJ0VmFsdWVzOiBmdW5jdGlvbiBjb252ZXJ0VmFsdWVzKHZhbHVlcykge1xyXG4gICAgcmV0dXJuIHZhbHVlcztcclxuICB9LFxyXG4gIF9hcHBseVN0YXRlVG9QdXRPcHRpb25zOiBmdW5jdGlvbiBfYXBwbHlTdGF0ZVRvUHV0T3B0aW9ucygvKiBwdXRPcHRpb25zKi8pIHt9LFxyXG4gIG9uUHV0Q29tcGxldGU6IGZ1bmN0aW9uIG9uUHV0Q29tcGxldGUoZW50cnksIHJlc3VsdCkge1xyXG4gICAgdGhpcy5lbmFibGUoKTtcclxuXHJcbiAgICBjb25zdCBtZXNzYWdlID0gdGhpcy5fYnVpbGRSZWZyZXNoTWVzc2FnZShlbnRyeSwgcmVzdWx0KTtcclxuXHJcbiAgICBjb25uZWN0LnB1Ymxpc2goJy9hcHAvcmVmcmVzaCcsIFttZXNzYWdlXSk7XHJcblxyXG4gICAgdGhpcy5vblVwZGF0ZUNvbXBsZXRlZChyZXN1bHQpO1xyXG4gIH0sXHJcbiAgb25QdXRFcnJvcjogZnVuY3Rpb24gb25QdXRFcnJvcihwdXRPcHRpb25zLCBlcnJvcikge1xyXG4gICAgdGhpcy5lbmFibGUoKTtcclxuICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQXJyYXkgb2Ygc3RyaW5ncyB0aGF0IHdpbGwgZ2V0IGlnbm9yZWQgd2hlbiB0aGUgZGlmZmluZyBydW5zLlxyXG4gICAqL1xyXG4gIGRpZmZQcm9wZXJ0eUlnbm9yZXM6IFtdLFxyXG4gIC8qKlxyXG4gICAqIERpZmZzIHRoZSByZXN1bHRzIGZyb20gdGhlIGN1cnJlbnQgdmFsdWVzIGFuZCB0aGUgcHJldmlvdXMgdmFsdWVzLlxyXG4gICAqIFRoaXMgaXMgZG9uZSBmb3IgYSBjb25jdXJyZW5jeSBjaGVjayB0byBpbmRpY2F0ZSB3aGF0IGhhcyBjaGFuZ2VkLlxyXG4gICAqIEByZXR1cm5zIEFycmF5IExpc3Qgb2YgcHJvcGVydHkgbmFtZXMgdGhhdCBoYXZlIGNoYW5nZWRcclxuICAgKi9cclxuICBkaWZmczogZnVuY3Rpb24gZGlmZnMobGVmdCwgcmlnaHQpIHtcclxuICAgIGNvbnN0IGFjYyA9IFtdO1xyXG4gICAgY29uc3QgRElGRl9FRElURUQgPSAnRSc7XHJcblxyXG4gICAgaWYgKERlZXBEaWZmKSB7XHJcbiAgICAgIGNvbnN0IF9kaWZmcyA9IERlZXBEaWZmLmRpZmYobGVmdCwgcmlnaHQsIChwYXRoLCBrZXkpID0+IHtcclxuICAgICAgICBpZiAodGhpcy5kaWZmUHJvcGVydHlJZ25vcmVzLmluZGV4T2Yoa2V5KSA+PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgaWYgKF9kaWZmcykge1xyXG4gICAgICAgIF9kaWZmcy5mb3JFYWNoKChkaWZmKSA9PiB7XHJcbiAgICAgICAgICBjb25zdCBwYXRoID0gZGlmZi5wYXRoLmpvaW4oJy4nKTtcclxuICAgICAgICAgIGlmIChkaWZmLmtpbmQgPT09IERJRkZfRURJVEVEICYmIGFjYy5pbmRleE9mKHBhdGgpID09PSAtMSkge1xyXG4gICAgICAgICAgICBhY2MucHVzaChwYXRoKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBhY2M7XHJcbiAgfSxcclxuICBfZXh0cmFjdElkUHJvcGVydHlGcm9tRW50cnk6IGZ1bmN0aW9uIF9leHRyYWN0SWRQcm9wZXJ0eUZyb21FbnRyeShlbnRyeSkge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0RW50aXR5SWQoZW50cnkpO1xyXG4gICAgfSBlbHNlIGlmIChzdG9yZSkge1xyXG4gICAgICByZXR1cm4gc3RvcmUuZ2V0SWRlbnRpdHkoZW50cnkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiAnJztcclxuICB9LFxyXG4gIF9idWlsZFJlZnJlc2hNZXNzYWdlOiBmdW5jdGlvbiBfYnVpbGRSZWZyZXNoTWVzc2FnZShvcmlnaW5hbEVudHJ5LCByZXNwb25zZSkge1xyXG4gICAgaWYgKG9yaWdpbmFsRW50cnkpIHtcclxuICAgICAgY29uc3QgaWQgPSB0aGlzLl9leHRyYWN0SWRQcm9wZXJ0eUZyb21FbnRyeShvcmlnaW5hbEVudHJ5KTtcclxuICAgICAgcmV0dXJuIHtcclxuICAgICAgICBpZCxcclxuICAgICAgICBrZXk6IGlkLFxyXG4gICAgICAgIGRhdGE6IHJlc3BvbnNlLFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdXBkYXRlIGNvbXBsZXRlLCBjaGVja3MgZm9yIGB0aGlzLm9wdGlvbnMucmV0dXJuVG9gIGVsc2UgaXQgc2ltcGx5IGdvZXMgYmFjay5cclxuICAgKiBAcGFyYW0gZW50cnlcclxuICAgKi9cclxuICBvblVwZGF0ZUNvbXBsZXRlZDogZnVuY3Rpb24gb25VcGRhdGVDb21wbGV0ZWQoLyogZW50cnkqLykge1xyXG4gICAgLy8gcmV0dXJuVG8gaXMgaGFuZGxlZCBieSBSZVVJIGJhY2tcclxuICAgIFJlVUkuYmFjaygpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgbWFya3VwIGJ5IGFwcGx5aW5nIHRoZSBgdmFsaWRhdGlvblN1bW1hcnlJdGVtVGVtcGxhdGVgIHRvIGVhY2ggZW50cnkgaW4gYHRoaXMuZXJyb3JzYFxyXG4gICAqIHRoZW4gc2V0cyB0aGUgY29tYmluZWQgcmVzdWx0IGludG8gdGhlIHN1bW1hcnkgdmFsaWRhdGlvbiBub2RlIGFuZCBzZXRzIHRoZSBzdHlsaW5nIHRvIHZpc2libGVcclxuICAgKi9cclxuICBzaG93VmFsaWRhdGlvblN1bW1hcnk6IGZ1bmN0aW9uIHNob3dWYWxpZGF0aW9uU3VtbWFyeSgpIHtcclxuICAgIGNvbnN0IGNvbnRlbnQgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuZXJyb3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnRlbnQucHVzaCh0aGlzLnZhbGlkYXRpb25TdW1tYXJ5SXRlbVRlbXBsYXRlLmFwcGx5KHRoaXMuZXJyb3JzW2ldLCB0aGlzLmZpZWxkc1t0aGlzLmVycm9yc1tpXS5uYW1lXSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0KCd2YWxpZGF0aW9uQ29udGVudCcsIGNvbnRlbnQuam9pbignJykpO1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKCdwYW5lbC1mb3JtLWVycm9yJyk7XHJcbiAgfSxcclxuICBzaG93Q29uY3VycmVuY3lTdW1tYXJ5OiBmdW5jdGlvbiBzaG93Q29uY3VycmVuY3lTdW1tYXJ5KCkge1xyXG4gICAgY29uc3QgY29udGVudCA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lcnJvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29udGVudC5wdXNoKHRoaXMuY29uY3VycmVuY3lTdW1tYXJ5SXRlbVRlbXBsYXRlLmFwcGx5KHRoaXMuZXJyb3JzW2ldKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXQoJ2NvbmN1cnJlbmN5Q29udGVudCcsIGNvbnRlbnQuam9pbignJykpO1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKCdwYW5lbC1mb3JtLWNvbmN1cnJlbmN5LWVycm9yJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZW1vdmVzIHRoZSBzdW1tYXJ5IHZhbGlkYXRpb24gdmlzaWJsZSBzdHlsaW5nIGFuZCBlbXB0aWVzIGl0cyBjb250ZW50cyBvZiBlcnJvciBtYXJrdXBcclxuICAgKi9cclxuICBoaWRlVmFsaWRhdGlvblN1bW1hcnk6IGZ1bmN0aW9uIGhpZGVWYWxpZGF0aW9uU3VtbWFyeSgpIHtcclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygncGFuZWwtZm9ybS1lcnJvcicpO1xyXG4gICAgdGhpcy5zZXQoJ3ZhbGlkYXRpb25Db250ZW50JywgJycpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmVtb3ZlcyB0ZWggc3VtbWFyeSBmb3IgY29uY3VycmVuY3kgZXJyb3JzXHJcbiAgICovXHJcbiAgaGlkZUNvbmN1cnJlbmN5U3VtbWFyeTogZnVuY3Rpb24gaGlkZUNvbmN1cnJlbmN5U3VtbWFyeSgpIHtcclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygncGFuZWwtZm9ybS1jb25jdXJyZW5jeS1lcnJvcicpO1xyXG4gICAgdGhpcy5zZXQoJ2NvbmN1cnJlbmN5Q29udGVudCcsICcnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHRoZSBzYXZlIHRvb2xiYXIgYWN0aW9uLlxyXG4gICAqXHJcbiAgICogRmlyc3QgdmFsaWRhdGVzIHRoZSBmb3Jtcywgc2hvd2luZyBlcnJvcnMgYW5kIHN0b3Bpbmcgc2F2aW5nIGlmIGZvdW5kLlxyXG4gICAqIFRoZW4gY2FsbHMgZWl0aGVyIHtAbGluayAjaW5zZXJ0IGluc2VydH0gb3Ige0BsaW5rICN1cGRhdGUgdXBkYXRlfSBiYXNlZCB1cG9uIGB0aGlzLmluc2VydGluZ2AuXHJcbiAgICpcclxuICAgKi9cclxuICBzYXZlOiBmdW5jdGlvbiBzYXZlKCkge1xyXG4gICAgaWYgKHRoaXMuaXNGb3JtRGlzYWJsZWQoKSkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5oaWRlVmFsaWRhdGlvblN1bW1hcnkoKTtcclxuICAgIHRoaXMuaGlkZUNvbmN1cnJlbmN5U3VtbWFyeSgpO1xyXG5cclxuICAgIGlmICh0aGlzLnZhbGlkYXRlKCkgIT09IGZhbHNlKSB7XHJcbiAgICAgIHRoaXMuc2hvd1ZhbGlkYXRpb25TdW1tYXJ5KCk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5pbnNlcnRpbmcpIHtcclxuICAgICAgdGhpcy5pbnNlcnQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMudXBkYXRlKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSBnZXRDb250ZXh0IGZ1bmN0aW9uIHRvIGFsc28gaW5jbHVkZSB0aGUgYHJlc291cmNlS2luZGAgb2YgdGhlIHZpZXcsIGBpbnNlcnRgXHJcbiAgICogc3RhdGUgYW5kIGBrZXlgIG9mIHRoZSBlbnRyeSAoZmFsc2UgaWYgaW5zZXJ0aW5nKVxyXG4gICAqL1xyXG4gIGdldENvbnRleHQ6IGZ1bmN0aW9uIGdldENvbnRleHQoKSB7XHJcbiAgICByZXR1cm4gbGFuZy5taXhpbih0aGlzLmluaGVyaXRlZChnZXRDb250ZXh0LCBhcmd1bWVudHMpLCB7XHJcbiAgICAgIHJlc291cmNlS2luZDogdGhpcy5yZXNvdXJjZUtpbmQsXHJcbiAgICAgIGluc2VydDogdGhpcy5vcHRpb25zLmluc2VydCxcclxuICAgICAga2V5OiB0aGlzLm9wdGlvbnMuaW5zZXJ0ID8gZmFsc2UgOiB0aGlzLm9wdGlvbnMua2V5ID8gdGhpcy5vcHRpb25zLmtleSA6IHRoaXMub3B0aW9ucy5lbnRyeSAmJiB0aGlzLm9wdGlvbnMuZW50cnlbdGhpcy5pZFByb3BlcnR5XSAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFdyYXBwZXIgZm9yIGRldGVjdGluZyBzZWN1cml0eSBmb3IgdXBkYXRlIG1vZGUgb3IgaW5zZXJ0IG1vZGVcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gYWNjZXNzIENhbiBiZSBlaXRoZXIgXCJ1cGRhdGVcIiBvciBcImluc2VydFwiXHJcbiAgICovXHJcbiAgZ2V0U2VjdXJpdHk6IGZ1bmN0aW9uIGdldFNlY3VyaXR5KGFjY2Vzcykge1xyXG4gICAgY29uc3QgbG9va3VwID0ge1xyXG4gICAgICB1cGRhdGU6IHRoaXMudXBkYXRlU2VjdXJpdHksXHJcbiAgICAgIGluc2VydDogdGhpcy5pbnNlcnRTZWN1cml0eSxcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIGxvb2t1cFthY2Nlc3NdO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyBiZWZvcmVUcmFuc2l0aW9uVG8gdG8gYWRkIHRoZSBsb2FkaW5nIHN0eWxpbmcgaWYgcmVmcmVzaCBpcyBuZWVkZWRcclxuICAgKi9cclxuICBiZWZvcmVUcmFuc2l0aW9uVG86IGZ1bmN0aW9uIGJlZm9yZVRyYW5zaXRpb25UbygpIHtcclxuICAgIGlmICh0aGlzLnJlZnJlc2hSZXF1aXJlZCkge1xyXG4gICAgICBpZiAodGhpcy5vcHRpb25zLmluc2VydCA9PT0gdHJ1ZSB8fCAodGhpcy5vcHRpb25zLmtleSAmJiAhdGhpcy5vcHRpb25zLmVudHJ5KSkge1xyXG4gICAgICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcygncGFuZWwtbG9hZGluZycpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygncGFuZWwtbG9hZGluZycpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmhlcml0ZWQoYmVmb3JlVHJhbnNpdGlvblRvLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgb25UcmFuc2l0aW9uVG86IGZ1bmN0aW9uIG9uVHJhbnNpdGlvblRvKCkge1xyXG4gICAgLy8gRm9jdXMgdGhlIGRlZmF1bHQgZm9jdXMgZmllbGQgaWYgaXQgZXhpc3RzIGFuZCBpdCBoYXMgbm90IGFscmVhZHkgYmVlbiBmb2N1c2VkLlxyXG4gICAgLy8gVGhpcyBmbGFnIGlzIGltcG9ydGFudCBiZWNhdXNlIG9uVHJhbnNpdGlvblRvIHdpbGwgZmlyZSBtdWx0aXBsZSB0aW1lcyBpZiB0aGUgdXNlciBpcyB1c2luZyBsb29rdXBzIGFuZCBlZGl0b3IgdHlwZSBmaWVsZHMgdGhhdCB0cmFuc2l0aW9uIGF3YXkgZnJvbSB0aGlzIHZpZXcuXHJcbiAgICBpZiAodGhpcy5fZm9jdXNGaWVsZCAmJiAhdGhpcy5faGFzRm9jdXNlZCkge1xyXG4gICAgICB0aGlzLl9mb2N1c0ZpZWxkLmZvY3VzKCk7XHJcbiAgICAgIHRoaXMuX2hhc0ZvY3VzZWQgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5oZXJpdGVkKG9uVHJhbnNpdGlvblRvLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRW1wdGllcyB0aGUgYWN0aXZhdGUgbWV0aG9kIHdoaWNoIHByZXZlbnRzIGRldGVjdGlvbiBvZiByZWZyZXNoIGZyb20gdHJhbnNpdGl0aW9uaW5nLlxyXG4gICAqXHJcbiAgICogRXh0ZXJuYWwgbmF2aWdhdGlvbiAoYnJvd3NlciBiYWNrL2ZvcndhcmQpIG5ldmVyIHJlZnJlc2hlcyB0aGUgZWRpdCB2aWV3IGFzIGl0J3MgYWx3YXlzIGEgdGVybWluYWwgbG9vcC5cclxuICAgKiBpLmUuIHlvdSBuZXZlciBtb3ZlIFwiZm9yd2FyZFwiIGZyb20gYW4gZWRpdCB2aWV3OyB5b3UgbmF2aWdhdGUgdG8gY2hpbGQgZWRpdG9ycywgZnJvbSB3aGljaCB5b3UgYWx3YXlzIHJldHVybi5cclxuICAgKi9cclxuICBhY3RpdmF0ZTogZnVuY3Rpb24gYWN0aXZhdGUoKSB7fSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHJlZnJlc2hSZXF1aXJlZEZvciB0byByZXR1cm4gZmFsc2UgaWYgd2UgYWxyZWFkeSBoYXZlIHRoZSBrZXkgdGhlIG9wdGlvbnMgaXMgcGFzc2luZ1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIE5hdmlnYXRpb24gb3B0aW9ucyBmcm9tIHByZXZpb3VzIHZpZXdcclxuICAgKi9cclxuICByZWZyZXNoUmVxdWlyZWRGb3I6IGZ1bmN0aW9uIHJlZnJlc2hSZXF1aXJlZEZvcihvcHRpb25zKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XHJcbiAgICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5rZXkgJiYgdGhpcy5vcHRpb25zLmtleSA9PT0gb3B0aW9ucy5rZXkpIHtcclxuICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5pbmhlcml0ZWQocmVmcmVzaFJlcXVpcmVkRm9yLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmVmcmVzaCBmaXJzdCBjbGVhcnMgb3V0IGFueSB2YXJpYWJsZXMgc2V0IHRvIHByZXZpb3VzIGRhdGEuXHJcbiAgICpcclxuICAgKiBUaGUgbW9kZSBvZiB0aGUgRWRpdCB2aWV3IGlzIHNldCBhbmQgZGV0ZXJtaW5lZCB2aWEgYHRoaXMub3B0aW9ucy5pbnNlcnRgLCBhbmQgdGhlIHZpZXdzIHZhbHVlcyBhcmUgY2xlYXJlZC5cclxuICAgKlxyXG4gICAqIExhc3RseSBpdCBtYWtlcyB0aGUgYXBwcm9waWF0ZSBkYXRhIHJlcXVlc3Q6XHJcbiAgICovXHJcbiAgcmVmcmVzaDogZnVuY3Rpb24gcmVmcmVzaCgpIHtcclxuICAgIHRoaXMub25SZWZyZXNoKCk7XHJcbiAgICB0aGlzLmVudHJ5ID0gZmFsc2U7XHJcbiAgICB0aGlzLmNoYW5nZXMgPSBmYWxzZTtcclxuICAgIHRoaXMuaW5zZXJ0aW5nID0gKHRoaXMub3B0aW9ucy5pbnNlcnQgPT09IHRydWUpO1xyXG4gICAgdGhpcy5faGFzRm9jdXNlZCA9IGZhbHNlO1xyXG5cclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygncGFuZWwtZm9ybS1lcnJvcicpO1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1mb3JtLWNvbmN1cnJlbmN5LWVycm9yJyk7XHJcblxyXG4gICAgdGhpcy5jbGVhclZhbHVlcygpO1xyXG5cclxuICAgIGlmICh0aGlzLmluc2VydGluZykge1xyXG4gICAgICB0aGlzLm9uUmVmcmVzaEluc2VydCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5vblJlZnJlc2hVcGRhdGUoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIG9uUmVmcmVzaDogZnVuY3Rpb24gb25SZWZyZXNoKCkge30sXHJcbiAgb25SZWZyZXNoSW5zZXJ0OiBmdW5jdGlvbiBvblJlZnJlc2hJbnNlcnQoKSB7fSxcclxuICBvblJlZnJlc2hVcGRhdGU6IGZ1bmN0aW9uIG9uUmVmcmVzaFVwZGF0ZSgpIHtcclxuICAgIC8vIGFwcGx5IGFzIG5vbi1tb2RpZmllZCBkYXRhXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmVudHJ5KSB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc0RhdGEodGhpcy5vcHRpb25zLmVudHJ5KTtcclxuXHJcbiAgICAgIC8vIGFwcGx5IGNoYW5nZXMgYXMgbW9kaWZpZWQgZGF0YSwgc2luY2Ugd2Ugd2FudCB0aGlzIHRvIGZlZWQtYmFjayB0aHJvdWdoXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuY2hhbmdlcykge1xyXG4gICAgICAgIHRoaXMuY2hhbmdlcyA9IHRoaXMub3B0aW9ucy5jaGFuZ2VzO1xyXG4gICAgICAgIHRoaXMuc2V0VmFsdWVzKHRoaXMuY2hhbmdlcyk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIC8vIGlmIGtleSBpcyBwYXNzZWQgcmVxdWVzdCB0aGF0IGtleXMgZW50aXR5IGFuZCBwcm9jZXNzXHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMua2V5KSB7XHJcbiAgICAgICAgdGhpcy5yZXF1ZXN0RGF0YSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBnZXRSb3V0ZTogZnVuY3Rpb24gZ2V0Um91dGUoKSB7XHJcbiAgICByZXR1cm4gYCR7dGhpcy5pZH0vOmtleT9gO1xyXG4gIH0sXHJcbiAgYnVpbGRSb3V0ZTogZnVuY3Rpb24gYnVpbGRSb3V0ZSgpIHtcclxuICAgIGNvbnN0IHBhcnRzID0gW107XHJcbiAgICBjb25zdCBpZCA9IHRoaXMuaWQ7XHJcbiAgICBwYXJ0cy5wdXNoKGlkKTtcclxuXHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLmdldFRhZygpIHx8ICh0aGlzLmVudHJ5ICYmIHRoaXMuZW50cnlbdGhpcy5pZFByb3BlcnR5XSk7XHJcbiAgICBpZiAoa2V5KSB7XHJcbiAgICAgIHBhcnRzLnB1c2goa2V5KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFydHMuam9pbignLycpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19