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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fRWRpdEJhc2UuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwiYXR0cmlidXRlTWFwIiwidmFsaWRhdGlvbkNvbnRlbnQiLCJub2RlIiwidHlwZSIsImNvbmN1cnJlbmN5Q29udGVudCIsInRpdGxlIiwicHJvdG90eXBlIiwic2VsZWN0ZWQiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwibG9hZGluZ1RlbXBsYXRlIiwidmFsaWRhdGlvblN1bW1hcnlUZW1wbGF0ZSIsImNvbmN1cnJlbmN5U3VtbWFyeVRlbXBsYXRlIiwidmFsaWRhdGlvblN1bW1hcnlJdGVtVGVtcGxhdGUiLCJjb25jdXJyZW5jeVN1bW1hcnlJdGVtVGVtcGxhdGUiLCJzZWN0aW9uQmVnaW5UZW1wbGF0ZSIsInNlY3Rpb25FbmRUZW1wbGF0ZSIsInByb3BlcnR5VGVtcGxhdGUiLCJpZCIsInN0b3JlIiwibGF5b3V0IiwiZW5hYmxlQ3VzdG9taXphdGlvbnMiLCJjdXN0b21pemF0aW9uU2V0IiwiZXhwb3NlIiwiaW5zZXJ0U2VjdXJpdHkiLCJ1cGRhdGVTZWN1cml0eSIsInZpZXdUeXBlIiwic2F2ZVRleHQiLCJ0aXRsZVRleHQiLCJ2YWxpZGF0aW9uU3VtbWFyeVRleHQiLCJjb25jdXJyZW5jeVN1bW1hcnlUZXh0IiwiZGV0YWlsc1RleHQiLCJsb2FkaW5nVGV4dCIsImVycm9yVGV4dCIsImdlbmVyYWwiLCJlcnJvckdlbmVyYWwiLCJzdGF0dXMiLCJlcnJvcjQwMSIsImNvbmN1cnJlbmN5RXJyb3JUZXh0IiwidG9nZ2xlQ29sbGFwc2VUZXh0IiwiZmllbGRzIiwiZW50cnkiLCJpbnNlcnRpbmciLCJfZm9jdXNGaWVsZCIsIl9oYXNGb2N1c2VkIiwibXVsdGlDb2x1bW5WaWV3IiwibXVsdGlDb2x1bW5DbGFzcyIsIm11bHRpQ29sdW1uQ291bnQiLCJzYXZlVG9vbHRpcFRleHQiLCJjYW5jZWxUb29sdGlwVGV4dCIsImNvbnN0cnVjdG9yIiwic3RhcnR1cCIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInByb2Nlc3NMYXlvdXQiLCJfY3JlYXRlQ3VzdG9taXplZExheW91dCIsImNyZWF0ZUxheW91dCIsIiQiLCJjb250ZW50Tm9kZSIsImVhY2giLCJpIiwibmFtZSIsImF0dHIiLCJmaWVsZCIsImRvbU5vZGUiLCJhZGRDbGFzcyIsInJlbmRlclRvIiwiaW5pdCIsImhhc093blByb3BlcnR5IiwiY3JlYXRlVG9vbExheW91dCIsInRiYXIiLCJhY3Rpb24iLCJzdmciLCJzZWN1cml0eSIsIm9wdGlvbnMiLCJpbnNlcnQiLCJBcHAiLCJpc09uRmlyc3RWaWV3IiwidW5zaGlmdCIsInNpZGUiLCJ0b29scyIsIm9uVG9vbENhbmNlbCIsInJlZnJlc2hSZXF1aXJlZCIsIlJlVUkiLCJiYWNrIiwiX2dldFN0b3JlQXR0ciIsImNyZWF0ZVN0b3JlIiwiX29uU2hvd0ZpZWxkIiwiY29udGFpbmVyTm9kZSIsInJlbW92ZUNsYXNzIiwicGFyZW50IiwiX29uSGlkZUZpZWxkIiwiX29uRW5hYmxlRmllbGQiLCJfb25EaXNhYmxlRmllbGQiLCJpbnZva2VBY3Rpb24iLCJwYXJhbWV0ZXJzIiwiZXZ0IiwiZmllbGROb2RlIiwicGFyZW50cyIsImxlbmd0aCIsImZpcnN0IiwiYXBwbHkiLCJoYXNBY3Rpb24iLCJvbkNvbnRlbnRDaGFuZ2UiLCJwcm9jZXNzRW50cnkiLCJjb252ZXJ0RW50cnkiLCJwcm9jZXNzRmllbGRMZXZlbFNlY3VyaXR5IiwicHJvY2Vzc0RhdGEiLCJzZXRWYWx1ZXMiLCJwcmV2aW91c1ZhbHVlc0FsbCIsImN1cnJlbnRWYWx1ZXMiLCJnZXRWYWx1ZXMiLCJkaWZmcyIsImZvckVhY2giLCJ2YWwiLCJlcnJvcnMiLCJwdXNoIiwibWVzc2FnZSIsInNob3dDb25jdXJyZW5jeVN1bW1hcnkiLCJzYXZlIiwiY2hhbmdlcyIsIl9vbkdldENvbXBsZXRlIiwiZSIsImNvbnNvbGUiLCJlcnJvciIsIl9vbkdldEVycm9yIiwiZ2V0T3B0aW9ucyIsImhhbmRsZUVycm9yIiwiY3JlYXRlRXJyb3JIYW5kbGVycyIsImVycm9ySGFuZGxlcnMiLCJ0ZXN0IiwidGVzdFByZUNvbmRpdGlvbiIsIkhUVFBfU1RBVFVTIiwiUFJFQ09ORElUSU9OX0ZBSUxFRCIsImhhbmRsZSIsImhhbmRsZVByZUNvbmRpdGlvbiIsIm5leHQiLCJrZXkiLCIka2V5IiwicmVmcmVzaCIsInRlc3RBbGVydCIsImhhbmRsZUFsZXJ0IiwiYWxlcnQiLCJnZXRFcnJvck1lc3NhZ2UiLCJ0ZXN0Q2F0Y2hBbGwiLCJoYW5kbGVDYXRjaEFsbCIsImZyb21Db250ZXh0IiwiZXJyb3JJdGVtIiwic2VydmVyRXJyb3IiLCJhZGRFcnJvciIsImdldFRhZyIsInRhZyIsImlkUHJvcGVydHkiLCJyb3dzIiwiY2hpbGRyZW4iLCJhcyIsInNlY3Rpb25RdWV1ZSIsImNvbnRlbnQiLCJzZWN0aW9uU3RhcnRlZCIsImN1cnJlbnQiLCJjcmVhdGVSb3dDb250ZW50Iiwic2VjdGlvbk5vZGUiLCJqb2luIiwiYWNjb3JkaW9uIiwib25BcHBseVNlY3Rpb25Ob2RlIiwiZ2V0IiwiYXBwZW5kIiwiQ3RvciIsInByb3BlcnR5IiwibWl4aW4iLCJvd25lciIsInRlbXBsYXRlIiwiYXV0b0ZvY3VzIiwiRXJyb3IiLCJjb25uZWN0IiwiaGlkZGVuIiwicmVxdWVzdERhdGEiLCJfbW9kZWwiLCJyZXF1ZXN0RGF0YVVzaW5nTW9kZWwiLCJ0aGVuIiwiZGF0YSIsImVyciIsIl9hcHBseVN0YXRlVG9HZXRPcHRpb25zIiwiZ2V0RXhwcmVzc2lvbiIsIl9idWlsZEdldEV4cHJlc3Npb24iLCJnZXRSZXN1bHRzIiwicmVxdWVzdERhdGFVc2luZ1N0b3JlIiwiYmluZCIsIndhcm4iLCJnZXRFbnRyeSIsImFwcGx5RmllbGREZWZhdWx0cyIsImRlZmF1bHRWYWx1ZSIsImRlZmF1bHQiLCJzZXRWYWx1ZSIsImV4cGFuZEV4cHJlc3Npb24iLCJjbGVhclZhbHVlcyIsImNsZWFyVmFsdWUiLCJ2YWx1ZXMiLCJpbml0aWFsIiwibm9WYWx1ZSIsInZhbHVlIiwiaXNIaWRkZW4iLCJhcHBseVRvIiwiZ2V0VmFsdWUiLCJhbGwiLCJwYXlsb2FkIiwiZW1wdHkiLCJpbmNsdWRlIiwiZXhjbHVkZSIsInVuZGVmaW5lZCIsImFsd2F5c1VzZVZhbHVlIiwiaXNEaXJ0eSIsInByb3AiLCJ0YXJnZXQiLCJ2YWxpZGF0ZSIsInJlc3VsdCIsImlzRm9ybURpc2FibGVkIiwiYnVzeSIsImRpc2FibGUiLCJiYXJzIiwiZGlzYWJsZVRvb2wiLCJlbmFibGUiLCJlbmFibGVUb29sIiwib25JbnNlcnQiLCJhZGRPcHRpb25zIiwib3ZlcndyaXRlIiwiY3JlYXRlRW50cnlGb3JJbnNlcnQiLCJfYXBwbHlTdGF0ZVRvQWRkT3B0aW9ucyIsImluc2VydEVudHJ5Iiwib25BZGRDb21wbGV0ZSIsIm9uQWRkRXJyb3IiLCJhZGQiLCJfYnVpbGRSZWZyZXNoTWVzc2FnZSIsInB1Ymxpc2giLCJvbkluc2VydENvbXBsZXRlZCIsInVwZGF0ZSIsIm9uVXBkYXRlIiwib25VcGRhdGVDb21wbGV0ZWQiLCJwdXRPcHRpb25zIiwiY3JlYXRlRW50cnlGb3JVcGRhdGUiLCJfYXBwbHlTdGF0ZVRvUHV0T3B0aW9ucyIsInVwZGF0ZUVudHJ5Iiwib25QdXRDb21wbGV0ZSIsIm9uUHV0RXJyb3IiLCJwdXQiLCJjcmVhdGVJdGVtIiwiY29udmVydFZhbHVlcyIsImRpZmZQcm9wZXJ0eUlnbm9yZXMiLCJsZWZ0IiwicmlnaHQiLCJhY2MiLCJESUZGX0VESVRFRCIsIkRlZXBEaWZmIiwiX2RpZmZzIiwiZGlmZiIsInBhdGgiLCJpbmRleE9mIiwia2luZCIsIl9leHRyYWN0SWRQcm9wZXJ0eUZyb21FbnRyeSIsImdldEVudGl0eUlkIiwiZ2V0SWRlbnRpdHkiLCJvcmlnaW5hbEVudHJ5IiwicmVzcG9uc2UiLCJzaG93VmFsaWRhdGlvblN1bW1hcnkiLCJzZXQiLCJoaWRlVmFsaWRhdGlvblN1bW1hcnkiLCJoaWRlQ29uY3VycmVuY3lTdW1tYXJ5IiwiZ2V0Q29udGV4dCIsInJlc291cmNlS2luZCIsImdldFNlY3VyaXR5IiwiYWNjZXNzIiwibG9va3VwIiwiYmVmb3JlVHJhbnNpdGlvblRvIiwib25UcmFuc2l0aW9uVG8iLCJmb2N1cyIsImFjdGl2YXRlIiwicmVmcmVzaFJlcXVpcmVkRm9yIiwib25SZWZyZXNoIiwib25SZWZyZXNoSW5zZXJ0Iiwib25SZWZyZXNoVXBkYXRlIiwiZ2V0Um91dGUiLCJidWlsZFJvdXRlIiwicGFydHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0NBLE1BQU1BLFdBQVcsb0JBQVksVUFBWixDQUFqQjs7QUFFQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxNQUFNQyxVQUFVLHVCQUFRLGlCQUFSLEVBQTJCLGdCQUEzQixFQUFtQyw4QkFBOEI7QUFDL0U7Ozs7Ozs7QUFPQUMsa0JBQWM7QUFDWkMseUJBQW1CO0FBQ2pCQyxjQUFNLHVCQURXO0FBRWpCQyxjQUFNO0FBRlcsT0FEUDtBQUtaQywwQkFBb0I7QUFDbEJGLGNBQU0sd0JBRFk7QUFFbEJDLGNBQU07QUFGWSxPQUxSO0FBU1pFLGFBQU8sZUFBS0MsU0FBTCxDQUFlTixZQUFmLENBQTRCSyxLQVR2QjtBQVVaRSxnQkFBVSxlQUFLRCxTQUFMLENBQWVOLFlBQWYsQ0FBNEJPO0FBVjFCLEtBUmlFO0FBb0IvRTs7Ozs7Ozs7Ozs7Ozs7O0FBZUFDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEsQ0FDM0IsZ0xBRDJCLEVBRTNCLDBCQUYyQixFQUczQixvQ0FIMkIsRUFJM0IscUNBSjJCLEVBSzNCLGtEQUwyQixFQU0zQixRQU4yQixDQUFiLENBbkMrRDtBQTJDL0U7Ozs7OztBQU1BQyxxQkFBaUIsSUFBSUQsUUFBSixDQUFhLENBQzVCLDRDQUQ0QixFQUU1QiwyREFGNEIsRUFHNUIscUNBSDRCLEVBSTVCLDZCQUo0QixFQUs1Qiw2QkFMNEIsRUFNNUIsK0JBTjRCLEVBTzVCLDhCQVA0QixFQVE1Qiw4QkFSNEIsRUFTNUIsUUFUNEIsRUFVNUIsbUNBVjRCLEVBVzVCLFFBWDRCLEVBWTVCLGFBWjRCLENBQWIsQ0FqRDhEO0FBK0QvRTs7Ozs7O0FBTUFFLCtCQUEyQixJQUFJRixRQUFKLENBQWEsQ0FDdEMsd0NBRHNDLEVBRXRDLHlDQUZzQyxFQUd0Qyx1RkFIc0MsRUFJdEMsT0FKc0MsRUFLdEMsUUFMc0MsQ0FBYixDQXJFb0Q7QUE0RS9FOzs7Ozs7QUFNQUcsZ0NBQTRCLElBQUlILFFBQUosQ0FBYSxDQUN2Qyx5Q0FEdUMsRUFFdkMsMENBRnVDLEVBR3ZDLHNEQUh1QyxFQUl2QyxPQUp1QyxFQUt2QyxRQUx1QyxDQUFiLENBbEZtRDtBQXlGL0U7Ozs7Ozs7QUFPQUksbUNBQStCLElBQUlKLFFBQUosQ0FBYSxDQUMxQyxTQUQwQyxFQUUxQyw2Q0FGMEMsRUFHMUMsMENBSDBDLEVBSTFDLGVBSjBDLENBQWIsQ0FoR2dEO0FBc0cvRTs7OztBQUlBSyxvQ0FBZ0MsSUFBSUwsUUFBSixDQUFhLENBQzNDLHlEQUQyQyxDQUFiLENBMUcrQztBQTZHL0U7Ozs7OztBQU1BTSwwQkFBc0IsSUFBSU4sUUFBSixDQUFhLDZSQUFiLENBbkh5RDtBQTRIL0U7Ozs7OztBQU1BTyx3QkFBb0IsSUFBSVAsUUFBSixDQUFhLENBQy9CLHlCQUQrQixDQUFiLENBbEkyRDtBQXFJL0U7Ozs7Ozs7QUFPQVEsc0JBQWtCLElBQUlSLFFBQUosQ0FBYSxDQUM3Qiw0Q0FENkIsRUFFN0Isd0pBRjZCLEVBRzdCLFFBSDZCLENBQWIsQ0E1STZEOztBQWtKL0U7Ozs7QUFJQVMsUUFBSSxjQXRKMkU7QUF1Si9FQyxXQUFPLElBdkp3RTtBQXdKL0U7Ozs7QUFJQUMsWUFBUSxJQTVKdUU7QUE2Si9FOzs7O0FBSUFDLDBCQUFzQixJQWpLeUQ7QUFrSy9FOzs7OztBQUtBQyxzQkFBa0IsTUF2SzZEO0FBd0svRTs7OztBQUlBQyxZQUFRLEtBNUt1RTtBQTZLL0U7Ozs7QUFJQUMsb0JBQWdCLEtBakwrRDtBQWtML0U7Ozs7QUFJQUMsb0JBQWdCLEtBdEwrRDs7QUF3TC9FQyxjQUFVLE1BeExxRTs7QUEwTC9FOzs7QUFHQUMsY0FBVTdCLFNBQVM2QixRQTdMNEQ7QUE4TC9FOzs7O0FBSUFDLGVBQVc5QixTQUFTOEIsU0FsTTJEO0FBbU0vRTs7OztBQUlBQywyQkFBdUIvQixTQUFTK0IscUJBdk0rQztBQXdNL0U7Ozs7QUFJQUMsNEJBQXdCaEMsU0FBU2dDLHNCQTVNOEM7QUE2TS9FOzs7O0FBSUFDLGlCQUFhakMsU0FBU2lDLFdBak55RDtBQWtOL0U7Ozs7QUFJQUMsaUJBQWFsQyxTQUFTa0MsV0F0TnlEO0FBdU4vRTs7OztBQUlBQyxlQUFXO0FBQ1RDLGVBQVNwQyxTQUFTcUMsWUFEVDtBQUVUQyxjQUFRO0FBQ04sYUFBS3RDLFNBQVN1QztBQURSO0FBRkMsS0EzTm9FO0FBaU8vRTs7OztBQUlBQywwQkFBc0J4QyxTQUFTd0Msb0JBck9nRDtBQXNPL0U7Ozs7QUFJQUMsd0JBQW9CekMsU0FBU3lDLGtCQTFPa0Q7QUEyTy9FOzs7O0FBSUFDLFlBQVEsSUEvT3VFO0FBZ1AvRTs7OztBQUlBQyxXQUFPLElBcFB3RTtBQXFQL0U7Ozs7QUFJQUMsZUFBVyxJQXpQb0U7O0FBMlAvRUMsaUJBQWEsSUEzUGtFO0FBNFAvRUMsaUJBQWEsS0E1UGtFO0FBNlAvRTs7OztBQUlBQyxxQkFBaUIsSUFqUThEO0FBa1EvRTs7OztBQUlBQyxzQkFBa0IsTUF0UTZEO0FBdVEvRTs7OztBQUlBQyxzQkFBa0IsQ0EzUTZEO0FBNFEvRTs7OztBQUlBQyxxQkFBaUJsRCxTQUFTa0QsZUFoUnFEO0FBaVIvRTs7OztBQUlBQyx1QkFBbUJuRCxTQUFTbUQsaUJBclJtRDtBQXNSL0U7Ozs7O0FBS0FDLGlCQUFhLFNBQVNBLFdBQVQsR0FBcUIsTUFBUTtBQUN4QyxXQUFLVixNQUFMLEdBQWMsRUFBZDtBQUNELEtBN1I4RTtBQThSL0U7Ozs7Ozs7QUFPQVcsYUFBUyxTQUFTQSxPQUFULEdBQW1CO0FBQUE7O0FBQzFCLFdBQUtDLFNBQUwsQ0FBZUQsT0FBZixFQUF3QkUsU0FBeEI7QUFDQSxXQUFLQyxhQUFMLENBQW1CLEtBQUtDLHVCQUFMLENBQTZCLEtBQUtDLFlBQUwsRUFBN0IsQ0FBbkI7O0FBRUFDLFFBQUUsaUJBQUYsRUFBcUIsS0FBS0MsV0FBMUIsRUFDR0MsSUFESCxDQUNRLFVBQUNDLENBQUQsRUFBSTFELElBQUosRUFBYTtBQUNqQixZQUFNMkQsT0FBT0osRUFBRXZELElBQUYsRUFBUTRELElBQVIsQ0FBYSxZQUFiLENBQWI7QUFDQSxZQUFNQyxRQUFRLE1BQUt2QixNQUFMLENBQVlxQixJQUFaLENBQWQ7QUFDQSxZQUFJRSxLQUFKLEVBQVc7QUFDVE4sWUFBRU0sTUFBTUMsT0FBUixFQUFpQkMsUUFBakIsQ0FBMEIsT0FBMUI7QUFDQUYsZ0JBQU1HLFFBQU4sQ0FBZWhFLElBQWY7QUFDRDtBQUNGLE9BUkg7QUFTRCxLQWxUOEU7QUFtVC9FOzs7QUFHQWlFLFVBQU0sU0FBU0EsSUFBVCxHQUFnQjtBQUNwQixXQUFLZixTQUFMLENBQWVlLElBQWYsRUFBcUJkLFNBQXJCOztBQUVBLFdBQUssSUFBTVEsSUFBWCxJQUFtQixLQUFLckIsTUFBeEIsRUFBZ0M7QUFDOUIsWUFBSSxLQUFLQSxNQUFMLENBQVk0QixjQUFaLENBQTJCUCxJQUEzQixDQUFKLEVBQXNDO0FBQ3BDLGVBQUtyQixNQUFMLENBQVlxQixJQUFaLEVBQWtCTSxJQUFsQjtBQUNEO0FBQ0Y7QUFDRixLQTlUOEU7QUErVC9FOzs7Ozs7Ozs7QUFTQUUsc0JBQWtCLFNBQVNBLGdCQUFULEdBQTRCO0FBQzVDLFVBQU1DLE9BQU8sQ0FBQztBQUNacEQsWUFBSSxNQURRO0FBRVpxRCxnQkFBUSxNQUZJO0FBR1pDLGFBQUssTUFITztBQUlabkUsZUFBTyxLQUFLc0IsUUFKQTtBQUtaOEMsa0JBQVUsS0FBS0MsT0FBTCxJQUFnQixLQUFLQSxPQUFMLENBQWFDLE1BQTdCLEdBQXNDLEtBQUtuRCxjQUEzQyxHQUE0RCxLQUFLQztBQUwvRCxPQUFELENBQWI7O0FBUUEsVUFBSSxDQUFDbUQsSUFBSUMsYUFBSixFQUFMLEVBQTBCO0FBQ3hCUCxhQUFLUSxPQUFMLENBQWE7QUFDWDVELGNBQUksUUFETztBQUVYc0QsZUFBSyxRQUZNO0FBR1huRSxpQkFBTyxLQUFLNEMsaUJBSEQ7QUFJWDhCLGdCQUFNLE1BSks7QUFLWFIsa0JBQVE7QUFMRyxTQUFiO0FBT0Q7O0FBRUQsYUFBTyxLQUFLUyxLQUFMLEtBQWUsS0FBS0EsS0FBTCxHQUFhO0FBQ2pDVjtBQURpQyxPQUE1QixDQUFQO0FBR0QsS0E5VjhFO0FBK1YvRVcsa0JBQWMsU0FBU0EsWUFBVCxHQUF3QjtBQUNwQyxXQUFLQyxlQUFMLEdBQXVCLElBQXZCO0FBQ0FDLFdBQUtDLElBQUw7QUFDRCxLQWxXOEU7QUFtVy9FQyxtQkFBZSxTQUFTQSxhQUFULEdBQXlCO0FBQ3RDLGFBQU8sS0FBS2xFLEtBQUwsS0FBZSxLQUFLQSxLQUFMLEdBQWEsS0FBS21FLFdBQUwsRUFBNUIsQ0FBUDtBQUNELEtBclc4RTtBQXNXL0U7Ozs7Ozs7QUFPQUMsa0JBQWMsU0FBU0EsWUFBVCxDQUFzQnhCLEtBQXRCLEVBQTZCO0FBQ3pDTixRQUFFTSxNQUFNeUIsYUFBUixFQUF1QkMsV0FBdkIsQ0FBbUMsWUFBbkM7QUFDQWhDLFFBQUVNLE1BQU15QixhQUFSLEVBQXVCRSxNQUF2QixHQUFnQ0QsV0FBaEMsQ0FBNEMsY0FBNUM7QUFDRCxLQWhYOEU7QUFpWC9FOzs7Ozs7O0FBT0FFLGtCQUFjLFNBQVNBLFlBQVQsQ0FBc0I1QixLQUF0QixFQUE2QjtBQUN6Q04sUUFBRU0sTUFBTXlCLGFBQVIsRUFBdUJ2QixRQUF2QixDQUFnQyxZQUFoQztBQUNBUixRQUFFTSxNQUFNeUIsYUFBUixFQUF1QkUsTUFBdkIsR0FBZ0N6QixRQUFoQyxDQUF5QyxjQUF6QztBQUNELEtBM1g4RTtBQTRYL0U7Ozs7Ozs7QUFPQTJCLG9CQUFnQixTQUFTQSxjQUFULENBQXdCN0IsS0FBeEIsRUFBK0I7QUFDN0NOLFFBQUVNLE1BQU15QixhQUFSLEVBQXVCQyxXQUF2QixDQUFtQyxjQUFuQztBQUNELEtBclk4RTtBQXNZL0U7Ozs7Ozs7QUFPQUkscUJBQWlCLFNBQVNBLGVBQVQsQ0FBeUI5QixLQUF6QixFQUFnQztBQUMvQ04sUUFBRU0sTUFBTXlCLGFBQVIsRUFBdUJ2QixRQUF2QixDQUFnQyxjQUFoQztBQUNELEtBL1k4RTtBQWdaL0U7Ozs7Ozs7OztBQVNBNkIsa0JBQWMsU0FBU0EsWUFBVCxDQUFzQmpDLElBQXRCLEVBQTRCa0MsVUFBNUIsRUFBd0NDLEdBQXhDLEVBQTZDOUYsSUFBN0MsRUFBbUQ7QUFDL0QsVUFBTStGLFlBQVl4QyxFQUFFdkQsSUFBRixFQUFRLEtBQUt3RCxXQUFiLEVBQTBCd0MsT0FBMUIsQ0FBa0MsY0FBbEMsQ0FBbEI7QUFDQSxVQUFNbkMsUUFBUSxLQUFLdkIsTUFBTCxDQUFZeUQsVUFBVUUsTUFBVixHQUFtQixDQUFuQixJQUF3QkYsVUFBVUcsS0FBVixHQUFrQnRDLElBQWxCLENBQXVCLFlBQXZCLENBQXBDLENBQWQ7O0FBRUEsVUFBSUMsU0FBUyxPQUFPQSxNQUFNRixJQUFOLENBQVAsS0FBdUIsVUFBcEMsRUFBZ0Q7QUFDOUMsZUFBT0UsTUFBTUYsSUFBTixFQUFZd0MsS0FBWixDQUFrQnRDLEtBQWxCLEVBQXlCLENBQUNnQyxVQUFELEVBQWFDLEdBQWIsRUFBa0I5RixJQUFsQixDQUF6QixDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxLQUFLa0QsU0FBTCxDQUFlMEMsWUFBZixFQUE2QnpDLFNBQTdCLENBQVA7QUFDRCxLQWxhOEU7QUFtYS9FOzs7Ozs7O0FBT0FpRCxlQUFXLFNBQVNBLFNBQVQsQ0FBbUJ6QyxJQUFuQixFQUF5Qm1DLEdBQXpCLEVBQThCOUYsSUFBOUIsRUFBb0M7QUFDN0MsVUFBTStGLFlBQVl4QyxFQUFFdkQsSUFBRixFQUFRLEtBQUt3RCxXQUFiLEVBQTBCd0MsT0FBMUIsQ0FBa0MsY0FBbEMsQ0FBbEI7QUFDQSxVQUFNbkMsUUFBUWtDLGFBQWEsS0FBS3pELE1BQUwsQ0FBWXlELFVBQVVFLE1BQVYsR0FBbUIsQ0FBbkIsSUFBd0JGLFVBQVVHLEtBQVYsR0FBa0J0QyxJQUFsQixDQUF1QixZQUF2QixDQUFwQyxDQUEzQjs7QUFFQSxVQUFJQyxTQUFTLE9BQU9BLE1BQU1GLElBQU4sQ0FBUCxLQUF1QixVQUFwQyxFQUFnRDtBQUM5QyxlQUFPLElBQVA7QUFDRDs7QUFFRCxhQUFPLEtBQUtULFNBQUwsQ0FBZWtELFNBQWYsRUFBMEJqRCxTQUExQixDQUFQO0FBQ0QsS0FuYjhFO0FBb2IvRWlDLGlCQUFhLFNBQVNBLFdBQVQsR0FBdUI7QUFDbEMsYUFBTyxJQUFQO0FBQ0QsS0F0YjhFO0FBdWIvRWlCLHFCQUFpQixTQUFTQSxlQUFULEdBQTJCLENBQUUsQ0F2YmlDO0FBd2IvRUMsa0JBQWMsU0FBU0EsWUFBVCxDQUFzQi9ELEtBQXRCLEVBQTZCO0FBQ3pDLGFBQU9BLEtBQVA7QUFDRCxLQTFiOEU7QUEyYi9FOzs7OztBQUtBZ0Usa0JBQWMsU0FBU0EsWUFBVCxDQUFzQmhFLEtBQXRCLEVBQTZCO0FBQ3pDLGFBQU9BLEtBQVA7QUFDRCxLQWxjOEU7QUFtYy9FaUUsK0JBQTJCLFNBQVNBLHlCQUFULENBQW1DakUsS0FBbkMsRUFBMEMsQ0FBRTtBQUN0RSxLQXBjOEU7QUFxYy9Fa0UsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQmxFLEtBQXJCLEVBQTRCO0FBQ3ZDLFdBQUtBLEtBQUwsR0FBYSxLQUFLK0QsWUFBTCxDQUFrQixLQUFLQyxZQUFMLENBQWtCaEUsU0FBUyxFQUEzQixDQUFsQixLQUFxRCxFQUFsRTtBQUNBLFdBQUtpRSx5QkFBTCxDQUErQixLQUFLakUsS0FBcEM7O0FBRUEsV0FBS21FLFNBQUwsQ0FBZW5FLEtBQWYsRUFBc0IsSUFBdEI7O0FBRUE7QUFDQSxVQUFJLEtBQUtvRSxpQkFBVCxFQUE0QjtBQUMxQjtBQUNBLFlBQU1DLGdCQUFnQixLQUFLQyxTQUFMLENBQWUsSUFBZixDQUF0QjtBQUNBLFlBQU1DLFFBQVEsS0FBS0EsS0FBTCxDQUFXLEtBQUtILGlCQUFoQixFQUFtQ0MsYUFBbkMsQ0FBZDs7QUFFQSxZQUFJRSxNQUFNYixNQUFOLEdBQWUsQ0FBbkIsRUFBc0I7QUFDcEJhLGdCQUFNQyxPQUFOLENBQWMsU0FBU0EsT0FBVCxDQUFpQkMsR0FBakIsRUFBc0I7QUFDbEMsaUJBQUtDLE1BQUwsQ0FBWUMsSUFBWixDQUFpQjtBQUNmdkQsb0JBQU1xRCxHQURTO0FBRWZHLHVCQUFTLEtBQUsvRTtBQUZDLGFBQWpCO0FBSUQsV0FMRCxFQUtHLElBTEg7O0FBT0EsZUFBS2dGLHNCQUFMO0FBQ0QsU0FURCxNQVNPO0FBQ0w7QUFDQSxlQUFLQyxJQUFMO0FBQ0Q7O0FBRUQsYUFBS1YsaUJBQUwsR0FBeUIsSUFBekI7QUFDRDs7QUFFRDtBQUNBLFVBQUksS0FBS25DLE9BQUwsQ0FBYThDLE9BQWpCLEVBQTBCO0FBQ3hCLGFBQUtBLE9BQUwsR0FBZSxLQUFLOUMsT0FBTCxDQUFhOEMsT0FBNUI7QUFDQSxhQUFLWixTQUFMLENBQWUsS0FBS1ksT0FBcEI7QUFDRDtBQUNGLEtBdmU4RTtBQXdlL0VDLG9CQUFnQixTQUFTQSxjQUFULENBQXdCaEYsS0FBeEIsRUFBK0I7QUFDN0MsVUFBSTtBQUNGLFlBQUlBLEtBQUosRUFBVztBQUNULGVBQUtrRSxXQUFMLENBQWlCbEUsS0FBakI7QUFDRCxTQUZELE1BRU8sQ0FBRTtBQUNQO0FBQ0Q7O0FBRURnQixVQUFFLEtBQUtPLE9BQVAsRUFBZ0J5QixXQUFoQixDQUE0QixlQUE1Qjs7QUFFQTtBQUNBLGFBQUtjLGVBQUw7QUFDRCxPQVhELENBV0UsT0FBT21CLENBQVAsRUFBVTtBQUNWQyxnQkFBUUMsS0FBUixDQUFjRixDQUFkLEVBRFUsQ0FDUTtBQUNuQjtBQUNGLEtBdmY4RTtBQXdmL0VHLGlCQUFhLFNBQVNBLFdBQVQsQ0FBcUJDLFVBQXJCLEVBQWlDRixLQUFqQyxFQUF3QztBQUNuRCxXQUFLRyxXQUFMLENBQWlCSCxLQUFqQjtBQUNBbkUsUUFBRSxLQUFLTyxPQUFQLEVBQWdCeUIsV0FBaEIsQ0FBNEIsZUFBNUI7QUFDRCxLQTNmOEU7QUE0Zi9FOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUEyQkFqQyxrQkFBYyxTQUFTQSxZQUFULEdBQXdCO0FBQ3BDLGFBQU8sS0FBS3BDLE1BQUwsSUFBZSxFQUF0QjtBQUNELEtBemhCOEU7O0FBMmhCL0U0Ryx5QkFBcUIsU0FBU0EsbUJBQVQsR0FBK0I7QUFDbEQsV0FBS0MsYUFBTCxHQUFxQixLQUFLQSxhQUFMLElBQXNCLENBQUM7QUFDMUNwRSxjQUFNLGNBRG9DO0FBRTFDcUUsY0FBTSxTQUFTQyxnQkFBVCxDQUEwQlAsS0FBMUIsRUFBaUM7QUFDckMsaUJBQU9BLFNBQVNBLE1BQU14RixNQUFOLEtBQWlCLEtBQUtnRyxXQUFMLENBQWlCQyxtQkFBbEQ7QUFDRCxTQUp5QztBQUsxQ0MsZ0JBQVEsU0FBU0Msa0JBQVQsQ0FBNEJYLEtBQTVCLEVBQW1DWSxJQUFuQyxFQUF5QztBQUMvQ0EsaUJBRCtDLENBQ3ZDOztBQUVSO0FBQ0E7QUFDQSxlQUFLM0IsaUJBQUwsR0FBeUIsS0FBS0UsU0FBTCxDQUFlLElBQWYsQ0FBekI7QUFDQSxlQUFLckMsT0FBTCxDQUFhK0QsR0FBYixHQUFtQixLQUFLaEcsS0FBTCxDQUFXaUcsSUFBOUIsQ0FOK0MsQ0FNWDtBQUNwQyxpQkFBTyxLQUFLaEUsT0FBTCxDQUFhakMsS0FBcEIsQ0FQK0MsQ0FPcEI7QUFDM0IsZUFBS2tHLE9BQUw7QUFDRDtBQWR5QyxPQUFELEVBZXhDO0FBQ0Q5RSxjQUFNLFlBREw7QUFFRHFFLGNBQU0sU0FBU1UsU0FBVCxDQUFtQmhCLEtBQW5CLEVBQTBCO0FBQzlCLGlCQUFPQSxNQUFNeEYsTUFBTixLQUFpQixLQUFLZ0csV0FBTCxDQUFpQkMsbUJBQXpDO0FBQ0QsU0FKQTtBQUtEQyxnQkFBUSxTQUFTTyxXQUFULENBQXFCakIsS0FBckIsRUFBNEJZLElBQTVCLEVBQWtDO0FBQ3hDTSxnQkFBTSxLQUFLQyxlQUFMLENBQXFCbkIsS0FBckIsQ0FBTixFQUR3QyxDQUNKO0FBQ3BDWTtBQUNEO0FBUkEsT0Fmd0MsRUF3QnhDO0FBQ0QzRSxjQUFNLFVBREw7QUFFRHFFLGNBQU0sU0FBU2MsWUFBVCxHQUF3QjtBQUM1QixpQkFBTyxJQUFQO0FBQ0QsU0FKQTtBQUtEVixnQkFBUSxTQUFTVyxjQUFULENBQXdCckIsS0FBeEIsRUFBK0JZLElBQS9CLEVBQXFDO0FBQzNDLGNBQU1VLGNBQWMsS0FBS3hFLE9BQUwsQ0FBYXdFLFdBQWpDO0FBQ0EsZUFBS3hFLE9BQUwsQ0FBYXdFLFdBQWIsR0FBMkIsSUFBM0I7QUFDQSxjQUFNQyxZQUFZO0FBQ2hCQyx5QkFBYXhCO0FBREcsV0FBbEI7O0FBSUEsaUNBQWF5QixRQUFiLENBQXNCLEtBQUtOLGVBQUwsQ0FBcUJuQixLQUFyQixDQUF0QixFQUFtRHVCLFNBQW5EO0FBQ0EsZUFBS3pFLE9BQUwsQ0FBYXdFLFdBQWIsR0FBMkJBLFdBQTNCO0FBQ0FWO0FBQ0Q7QUFmQSxPQXhCd0MsQ0FBM0M7O0FBMENBLGFBQU8sS0FBS1AsYUFBWjtBQUNELEtBdmtCOEU7QUF3a0IvRTs7Ozs7QUFLQXFCLFlBQVEsU0FBU0EsTUFBVCxHQUFrQjtBQUN4QixVQUFJQyxNQUFNLEtBQUs3RSxPQUFMLElBQWdCLEtBQUtBLE9BQUwsQ0FBYWpDLEtBQTdCLElBQXNDLEtBQUtpQyxPQUFMLENBQWFqQyxLQUFiLENBQW1CLEtBQUsrRyxVQUF4QixDQUFoRDtBQUNBLFVBQUksQ0FBQ0QsR0FBTCxFQUFVO0FBQ1JBLGNBQU0sS0FBSzdFLE9BQUwsSUFBZ0IsS0FBS0EsT0FBTCxDQUFhK0QsR0FBbkM7QUFDRDs7QUFFRCxhQUFPYyxHQUFQO0FBQ0QsS0FwbEI4RTtBQXFsQi9FakcsbUJBQWUsU0FBU0EsYUFBVCxDQUF1QmxDLE1BQXZCLEVBQStCO0FBQzVDLFVBQU1xSSxPQUFRckksT0FBT3NJLFFBQVAsSUFBbUJ0SSxPQUFPdUksRUFBMUIsSUFBZ0N2SSxNQUE5QztBQUNBLFVBQU13SSxlQUFlLEVBQXJCO0FBQ0EsVUFBTUMsVUFBVSxFQUFoQjtBQUNBLFVBQUlDLGlCQUFpQixLQUFyQjtBQUNBLFVBQUlDLGdCQUFKOztBQUVBLFVBQUksQ0FBQzNJLE9BQU9zRCxPQUFaLEVBQXFCO0FBQ25CdEQsZUFBT3NELE9BQVAsR0FBaUI7QUFDZnJFLGlCQUFPLEtBQUswQjtBQURHLFNBQWpCO0FBR0Q7QUFDRCxXQUFLLElBQUk2QixJQUFJLENBQWIsRUFBZ0JBLElBQUk2RixLQUFLdEQsTUFBekIsRUFBaUN2QyxHQUFqQyxFQUFzQztBQUNwQ21HLGtCQUFVTixLQUFLN0YsQ0FBTCxDQUFWOztBQUVBLFlBQUltRyxRQUFRTCxRQUFSLElBQW9CSyxRQUFRSixFQUFoQyxFQUFvQztBQUNsQyxjQUFJRyxjQUFKLEVBQW9CO0FBQ2xCRix5QkFBYXhDLElBQWIsQ0FBa0IyQyxPQUFsQjtBQUNELFdBRkQsTUFFTztBQUNMLGlCQUFLekcsYUFBTCxDQUFtQnlHLE9BQW5CO0FBQ0Q7O0FBRUQ7QUFDRDs7QUFFRCxZQUFJLENBQUNELGNBQUwsRUFBcUI7QUFDbkJBLDJCQUFpQixJQUFqQjtBQUNBRCxrQkFBUXpDLElBQVIsQ0FBYSxLQUFLckcsb0JBQUwsQ0FBMEJzRixLQUExQixDQUFnQ2pGLE1BQWhDLEVBQXdDLElBQXhDLENBQWI7QUFDQXlJLGtCQUFRekMsSUFBUixDQUFhLDRCQUFiO0FBQ0Q7O0FBRUQsYUFBSzRDLGdCQUFMLENBQXNCRCxPQUF0QixFQUErQkYsT0FBL0I7QUFDRDtBQUNEQSxjQUFRekMsSUFBUixDQUFhLFFBQWI7QUFDQXlDLGNBQVF6QyxJQUFSLENBQWEsS0FBS3BHLGtCQUFMLENBQXdCcUYsS0FBeEIsQ0FBOEJqRixNQUE5QixFQUFzQyxJQUF0QyxDQUFiO0FBQ0EsVUFBTTZJLGNBQWN4RyxFQUFFb0csUUFBUUssSUFBUixDQUFhLEVBQWIsQ0FBRixDQUFwQjtBQUNBRCxrQkFBWUUsU0FBWjtBQUNBLFdBQUtDLGtCQUFMLENBQXdCSCxZQUFZSSxHQUFaLENBQWdCLENBQWhCLENBQXhCLEVBQTRDTixPQUE1QztBQUNBdEcsUUFBRSxLQUFLQyxXQUFQLEVBQW9CNEcsTUFBcEIsQ0FBMkJMLFdBQTNCOztBQUVBLFdBQUssSUFBSXJHLEtBQUksQ0FBYixFQUFnQkEsS0FBSWdHLGFBQWF6RCxNQUFqQyxFQUF5Q3ZDLElBQXpDLEVBQThDO0FBQzVDbUcsa0JBQVVILGFBQWFoRyxFQUFiLENBQVY7O0FBRUEsYUFBS04sYUFBTCxDQUFtQnlHLE9BQW5CO0FBQ0Q7QUFDRixLQWxvQjhFO0FBbW9CL0VLLHdCQUFvQixTQUFTQSxrQkFBVCxHQUE0Qix3QkFBMEIsQ0FBRSxDQW5vQkc7QUFvb0IvRUosc0JBQWtCLFNBQVNBLGdCQUFULENBQTBCNUksTUFBMUIsRUFBa0N5SSxPQUFsQyxFQUEyQztBQUMzRCxVQUFNVSxPQUFPLHVCQUFhRixHQUFiLENBQWlCakosT0FBT2pCLElBQXhCLENBQWI7QUFDQSxVQUFJb0ssSUFBSixFQUFVO0FBQ1IsWUFBTXhHLFFBQVEsS0FBS3ZCLE1BQUwsQ0FBWXBCLE9BQU95QyxJQUFQLElBQWV6QyxPQUFPb0osUUFBbEMsSUFBOEMsSUFBSUQsSUFBSixDQUFTLGVBQUtFLEtBQUwsQ0FBVztBQUM5RUMsaUJBQU87QUFEdUUsU0FBWCxFQUVsRXRKLE1BRmtFLENBQVQsQ0FBNUQ7O0FBSUEsWUFBTXVKLFdBQVc1RyxNQUFNOUMsZ0JBQU4sSUFBMEIsS0FBS0EsZ0JBQWhEOztBQUVBLFlBQUk4QyxNQUFNNkcsU0FBTixJQUFtQixDQUFDLEtBQUtqSSxXQUE3QixFQUEwQztBQUN4QyxlQUFLQSxXQUFMLEdBQW1Cb0IsS0FBbkI7QUFDRCxTQUZELE1BRU8sSUFBSUEsTUFBTTZHLFNBQU4sSUFBbUIsS0FBS2pJLFdBQTVCLEVBQXlDO0FBQzlDLGdCQUFNLElBQUlrSSxLQUFKLENBQVUsbUVBQVYsQ0FBTjtBQUNEOztBQUVELGFBQUtDLE9BQUwsQ0FBYS9HLEtBQWIsRUFBb0IsUUFBcEIsRUFBOEIsS0FBS3dCLFlBQW5DO0FBQ0EsYUFBS3VGLE9BQUwsQ0FBYS9HLEtBQWIsRUFBb0IsUUFBcEIsRUFBOEIsS0FBSzRCLFlBQW5DO0FBQ0EsYUFBS21GLE9BQUwsQ0FBYS9HLEtBQWIsRUFBb0IsVUFBcEIsRUFBZ0MsS0FBSzZCLGNBQXJDO0FBQ0EsYUFBS2tGLE9BQUwsQ0FBYS9HLEtBQWIsRUFBb0IsV0FBcEIsRUFBaUMsS0FBSzhCLGVBQXRDOztBQUVBLFlBQUksS0FBS2hELGVBQVQsRUFBMEI7QUFDeEIsY0FBSWtJLFNBQVMsRUFBYjtBQUNBLGNBQUloSCxNQUFNNUQsSUFBTixLQUFlLFFBQW5CLEVBQTZCO0FBQzNCNEsscUJBQVMsY0FBVDtBQUNEO0FBQ0RsQixrQkFBUXpDLElBQVIsa0JBQTRCLEtBQUt0RSxnQkFBakMsaUJBQTZEaUksTUFBN0Q7QUFDRDtBQUNEbEIsZ0JBQVF6QyxJQUFSLENBQWF1RCxTQUFTdEUsS0FBVCxDQUFldEMsS0FBZixFQUFzQixJQUF0QixDQUFiO0FBQ0EsWUFBSSxLQUFLbEIsZUFBVCxFQUEwQjtBQUN4QmdILGtCQUFRekMsSUFBUixDQUFhLFFBQWI7QUFDRDtBQUNGO0FBQ0YsS0FwcUI4RTtBQXFxQi9FOzs7QUFHQTRELGlCQUFhLFNBQVNBLFdBQVQsR0FBdUI7QUFBQTs7QUFDbEMsVUFBTTdKLFFBQVEsS0FBS2tKLEdBQUwsQ0FBUyxPQUFULENBQWQ7O0FBRUEsVUFBSSxLQUFLWSxNQUFULEVBQWlCO0FBQ2YsZUFBTyxLQUFLQyxxQkFBTCxHQUE2QkMsSUFBN0IsQ0FBa0MsVUFBQ0MsSUFBRCxFQUFVO0FBQ2pELGlCQUFLM0QsY0FBTCxDQUFvQjJELElBQXBCO0FBQ0QsU0FGTSxFQUVKLFVBQUNDLEdBQUQsRUFBUztBQUNWLGlCQUFLeEQsV0FBTCxDQUFpQixJQUFqQixFQUF1QndELEdBQXZCO0FBQ0QsU0FKTSxDQUFQO0FBS0QsT0FORCxNQU1PLElBQUlsSyxLQUFKLEVBQVc7QUFDaEIsWUFBTTJHLGFBQWEsRUFBbkI7O0FBRUEsYUFBS3dELHVCQUFMLENBQTZCeEQsVUFBN0I7O0FBRUEsWUFBTXlELGdCQUFnQixLQUFLQyxtQkFBTCxNQUE4QixJQUFwRDtBQUNBLFlBQU1DLGFBQWEsS0FBS0MscUJBQUwsQ0FBMkJILGFBQTNCLEVBQTBDekQsVUFBMUMsQ0FBbkI7O0FBRUEsNEJBQUsyRCxVQUFMLEVBQ0UsS0FBS2hFLGNBQUwsQ0FBb0JrRSxJQUFwQixDQUF5QixJQUF6QixDQURGLEVBRUUsS0FBSzlELFdBQUwsQ0FBaUI4RCxJQUFqQixDQUFzQixJQUF0QixFQUE0QjdELFVBQTVCLENBRkY7O0FBS0EsZUFBTzJELFVBQVA7QUFDRDs7QUFFRDlELGNBQVFpRSxJQUFSLENBQWEsZ0hBQWIsRUF6QmtDLENBeUI4RjtBQUNqSSxLQWxzQjhFO0FBbXNCL0VWLDJCQUF1QixTQUFTQSxxQkFBVCxHQUFpQztBQUN0RCxhQUFPLEtBQUtELE1BQUwsQ0FBWVksUUFBWixDQUFxQixLQUFLbkgsT0FBMUIsQ0FBUDtBQUNELEtBcnNCOEU7QUFzc0IvRWdILDJCQUF1QixTQUFTQSxxQkFBVCxDQUErQkgsYUFBL0IsRUFBOEN6RCxVQUE5QyxFQUEwRDtBQUMvRSxVQUFNM0csUUFBUSxLQUFLa0osR0FBTCxDQUFTLE9BQVQsQ0FBZDtBQUNBLGFBQU9sSixNQUFNa0osR0FBTixDQUFVa0IsYUFBVixFQUF5QnpELFVBQXpCLENBQVA7QUFDRCxLQXpzQjhFO0FBMHNCL0U7Ozs7QUFJQWdFLHdCQUFvQixTQUFTQSxrQkFBVCxHQUE4QjtBQUNoRCxXQUFLLElBQU1qSSxJQUFYLElBQW1CLEtBQUtyQixNQUF4QixFQUFnQztBQUM5QixZQUFJLEtBQUtBLE1BQUwsQ0FBWTRCLGNBQVosQ0FBMkJQLElBQTNCLENBQUosRUFBc0M7QUFDcEMsY0FBTUUsUUFBUSxLQUFLdkIsTUFBTCxDQUFZcUIsSUFBWixDQUFkO0FBQ0EsY0FBTWtJLGVBQWVoSSxNQUFNaUksT0FBM0I7O0FBRUEsY0FBSSxPQUFPRCxZQUFQLEtBQXdCLFdBQTVCLEVBQXlDO0FBQ3ZDO0FBQ0Q7O0FBRURoSSxnQkFBTWtJLFFBQU4sQ0FBZSxLQUFLQyxnQkFBTCxDQUFzQkgsWUFBdEIsRUFBb0NoSSxLQUFwQyxDQUFmO0FBQ0Q7QUFDRjtBQUNGLEtBM3RCOEU7QUE0dEIvRTs7O0FBR0FvSSxpQkFBYSxTQUFTQSxXQUFULEdBQXVCO0FBQ2xDLFdBQUssSUFBTXRJLElBQVgsSUFBbUIsS0FBS3JCLE1BQXhCLEVBQWdDO0FBQzlCLFlBQUksS0FBS0EsTUFBTCxDQUFZNEIsY0FBWixDQUEyQlAsSUFBM0IsQ0FBSixFQUFzQztBQUNwQyxlQUFLckIsTUFBTCxDQUFZcUIsSUFBWixFQUFrQnVJLFVBQWxCO0FBQ0Q7QUFDRjtBQUNGLEtBcnVCOEU7QUFzdUIvRTs7Ozs7Ozs7OztBQVVBeEYsZUFBVyxTQUFTQSxTQUFULENBQW1CeUYsTUFBbkIsRUFBMkJDLE9BQTNCLEVBQW9DO0FBQzdDLFVBQU1DLFVBQVUsRUFBaEI7O0FBRUEsV0FBSyxJQUFNMUksSUFBWCxJQUFtQixLQUFLckIsTUFBeEIsRUFBZ0M7QUFDOUIsWUFBSSxLQUFLQSxNQUFMLENBQVk0QixjQUFaLENBQTJCUCxJQUEzQixDQUFKLEVBQXNDO0FBQ3BDLGNBQU1FLFFBQVEsS0FBS3ZCLE1BQUwsQ0FBWXFCLElBQVosQ0FBZDtBQUNBLGNBQUkySSxjQUFKO0FBQ0E7QUFDQSxjQUFJekksTUFBTTBJLFFBQU4sRUFBSixFQUFzQjtBQUNwQjtBQUNEOztBQUVELGNBQUkxSSxNQUFNMkksT0FBTixLQUFrQixLQUF0QixFQUE2QjtBQUMzQkYsb0JBQVEsa0JBQVFHLFFBQVIsQ0FBaUJOLE1BQWpCLEVBQXlCdEksTUFBTTJJLE9BQS9CLEVBQXdDSCxPQUF4QyxDQUFSO0FBQ0QsV0FGRCxNQUVPO0FBQ0xDLG9CQUFRLGtCQUFRRyxRQUFSLENBQWlCTixNQUFqQixFQUF5QnRJLE1BQU15RyxRQUFOLElBQWtCM0csSUFBM0MsRUFBaUQwSSxPQUFqRCxDQUFSO0FBQ0Q7O0FBRUQ7QUFDQSxjQUFJQyxVQUFVRCxPQUFkLEVBQXVCO0FBQ3JCeEksa0JBQU1rSSxRQUFOLENBQWVPLEtBQWYsRUFBc0JGLE9BQXRCO0FBQ0E3SSxjQUFFTSxNQUFNeUIsYUFBUixFQUF1QkMsV0FBdkIsQ0FBbUMsV0FBbkM7QUFDRDtBQUNGO0FBQ0Y7QUFDRixLQXp3QjhFO0FBMHdCL0U7Ozs7Ozs7OztBQVNBc0IsZUFBVyxTQUFTQSxTQUFULENBQW1CNkYsR0FBbkIsRUFBd0I7QUFDakMsVUFBTUMsVUFBVSxFQUFoQjtBQUNBLFVBQUlDLFFBQVEsSUFBWjs7QUFFQSxXQUFLLElBQU1qSixJQUFYLElBQW1CLEtBQUtyQixNQUF4QixFQUFnQztBQUM5QixZQUFJLEtBQUtBLE1BQUwsQ0FBWTRCLGNBQVosQ0FBMkJQLElBQTNCLENBQUosRUFBc0M7QUFDcEMsY0FBTUUsUUFBUSxLQUFLdkIsTUFBTCxDQUFZcUIsSUFBWixDQUFkO0FBQ0EsY0FBTTJJLFFBQVF6SSxNQUFNNEksUUFBTixFQUFkOztBQUVBLGNBQU1JLFVBQVUsS0FBS2IsZ0JBQUwsQ0FBc0JuSSxNQUFNZ0osT0FBNUIsRUFBcUNQLEtBQXJDLEVBQTRDekksS0FBNUMsRUFBbUQsSUFBbkQsQ0FBaEI7QUFDQSxjQUFNaUosVUFBVSxLQUFLZCxnQkFBTCxDQUFzQm5JLE1BQU1pSixPQUE1QixFQUFxQ1IsS0FBckMsRUFBNEN6SSxLQUE1QyxFQUFtRCxJQUFuRCxDQUFoQjs7QUFFQTs7Ozs7Ozs7QUFRQSxjQUFJZ0osWUFBWUUsU0FBWixJQUF5QixDQUFDRixPQUE5QixFQUF1QztBQUNyQztBQUNEO0FBQ0QsY0FBSUMsWUFBWUMsU0FBWixJQUF5QkQsT0FBN0IsRUFBc0M7QUFDcEM7QUFDRDs7QUFFRDtBQUNBLGNBQUlKLE9BQVEsQ0FBQzdJLE1BQU1tSixjQUFOLElBQXdCbkosTUFBTW9KLE9BQU4sRUFBeEIsSUFBMkNKLE9BQTVDLEtBQXdELENBQUNoSixNQUFNMEksUUFBTixFQUFyRSxFQUF3RjtBQUN0RixnQkFBSTFJLE1BQU0ySSxPQUFOLEtBQWtCLEtBQXRCLEVBQTZCO0FBQzNCLGtCQUFJLE9BQU8zSSxNQUFNMkksT0FBYixLQUF5QixVQUE3QixFQUF5QztBQUN2QyxvQkFBSSxRQUFPRixLQUFQLHlDQUFPQSxLQUFQLE9BQWlCLFFBQXJCLEVBQStCO0FBQzdCO0FBQ0EsdUJBQUssSUFBTVksSUFBWCxJQUFtQlosS0FBbkIsRUFBMEI7QUFDeEIsd0JBQUlBLE1BQU1wSSxjQUFOLENBQXFCZ0osSUFBckIsQ0FBSixFQUFnQztBQUM5QlAsOEJBQVFPLElBQVIsSUFBZ0JaLE1BQU1ZLElBQU4sQ0FBaEI7QUFDRDtBQUNGO0FBQ0Y7O0FBRURySixzQkFBTTJJLE9BQU4sQ0FBY0csT0FBZCxFQUF1QkwsS0FBdkI7QUFDRCxlQVhELE1BV08sSUFBSSxPQUFPekksTUFBTTJJLE9BQWIsS0FBeUIsUUFBN0IsRUFBdUM7QUFDNUMsb0JBQU1XLFNBQVMsa0JBQVFWLFFBQVIsQ0FBaUJFLE9BQWpCLEVBQTBCOUksTUFBTTJJLE9BQWhDLENBQWY7QUFDQSwrQkFBS2pDLEtBQUwsQ0FBVzRDLE1BQVgsRUFBbUJiLEtBQW5CO0FBQ0Q7QUFDRixhQWhCRCxNQWdCTztBQUNMLGdDQUFRUCxRQUFSLENBQWlCWSxPQUFqQixFQUEwQjlJLE1BQU15RyxRQUFOLElBQWtCM0csSUFBNUMsRUFBa0QySSxLQUFsRDtBQUNEOztBQUVETSxvQkFBUSxLQUFSO0FBQ0Q7QUFDRjtBQUNGO0FBQ0QsYUFBT0EsUUFBUSxLQUFSLEdBQWdCRCxPQUF2QjtBQUNELEtBejBCOEU7QUEwMEIvRTs7Ozs7QUFLQVMsY0FBVSxTQUFTQSxRQUFULEdBQW9CO0FBQzVCLFdBQUtuRyxNQUFMLEdBQWMsRUFBZDs7QUFFQSxXQUFLLElBQU10RCxJQUFYLElBQW1CLEtBQUtyQixNQUF4QixFQUFnQztBQUM5QixZQUFJLEtBQUtBLE1BQUwsQ0FBWTRCLGNBQVosQ0FBMkJQLElBQTNCLENBQUosRUFBc0M7QUFDcEMsY0FBTUUsUUFBUSxLQUFLdkIsTUFBTCxDQUFZcUIsSUFBWixDQUFkOztBQUVBLGNBQU0wSixTQUFTeEosTUFBTXVKLFFBQU4sRUFBZjtBQUNBLGNBQUksQ0FBQ3ZKLE1BQU0wSSxRQUFOLEVBQUQsSUFBcUJjLFdBQVcsS0FBcEMsRUFBMkM7QUFDekM5SixjQUFFTSxNQUFNeUIsYUFBUixFQUF1QnZCLFFBQXZCLENBQWdDLFdBQWhDOztBQUVBLGlCQUFLa0QsTUFBTCxDQUFZQyxJQUFaLENBQWlCO0FBQ2Z2RCx3QkFEZTtBQUVmd0QsdUJBQVNrRztBQUZNLGFBQWpCO0FBSUQsV0FQRCxNQU9PO0FBQ0w5SixjQUFFTSxNQUFNeUIsYUFBUixFQUF1QkMsV0FBdkIsQ0FBbUMsV0FBbkM7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsYUFBTyxLQUFLMEIsTUFBTCxDQUFZaEIsTUFBWixHQUFxQixDQUFyQixHQUF5QixLQUFLZ0IsTUFBOUIsR0FBdUMsS0FBOUM7QUFDRCxLQXIyQjhFO0FBczJCL0U7Ozs7QUFJQXFHLG9CQUFnQixTQUFTQSxjQUFULEdBQTBCO0FBQ3hDLGFBQU8sS0FBS0MsSUFBWjtBQUNELEtBNTJCOEU7QUE2MkIvRTs7O0FBR0FDLGFBQVMsU0FBU0EsT0FBVCxHQUFtQjtBQUMxQixXQUFLRCxJQUFMLEdBQVksSUFBWjs7QUFFQSxVQUFJN0ksSUFBSStJLElBQUosQ0FBU3JKLElBQWIsRUFBbUI7QUFDakJNLFlBQUkrSSxJQUFKLENBQVNySixJQUFULENBQWNzSixXQUFkLENBQTBCLE1BQTFCO0FBQ0Q7O0FBRURuSyxRQUFFLE1BQUYsRUFBVVEsUUFBVixDQUFtQixNQUFuQixFQVAwQixDQU9DO0FBQzVCLEtBeDNCOEU7QUF5M0IvRTs7O0FBR0E0SixZQUFRLFNBQVNBLE1BQVQsR0FBa0I7QUFDeEIsV0FBS0osSUFBTCxHQUFZLEtBQVo7O0FBRUEsVUFBSTdJLElBQUkrSSxJQUFKLENBQVNySixJQUFiLEVBQW1CO0FBQ2pCTSxZQUFJK0ksSUFBSixDQUFTckosSUFBVCxDQUFjd0osVUFBZCxDQUF5QixNQUF6QjtBQUNEOztBQUVEckssUUFBRSxNQUFGLEVBQVVnQyxXQUFWLENBQXNCLE1BQXRCLEVBUHdCLENBT007QUFDL0IsS0FwNEI4RTtBQXE0Qi9FOzs7OztBQUtBZCxZQUFRLFNBQVNBLE1BQVQsR0FBa0I7QUFDeEIsV0FBSytJLE9BQUw7O0FBRUEsVUFBTXJCLFNBQVMsS0FBS3RGLFNBQUwsRUFBZjtBQUNBLFVBQUlzRixNQUFKLEVBQVk7QUFDVixhQUFLMEIsUUFBTCxDQUFjMUIsTUFBZDtBQUNELE9BRkQsTUFFTztBQUNMbEgsYUFBS0MsSUFBTDtBQUNEO0FBQ0YsS0FuNUI4RTtBQW81Qi9FMkksY0FBVSxTQUFTQSxRQUFULENBQWtCMUIsTUFBbEIsRUFBMEI7QUFBQTs7QUFDbEMsVUFBTWxMLFFBQVEsS0FBS2tKLEdBQUwsQ0FBUyxPQUFULENBQWQ7QUFDQSxVQUFNMkQsYUFBYTtBQUNqQkMsbUJBQVc7QUFETSxPQUFuQjtBQUdBLFVBQU14TCxRQUFRLEtBQUt5TCxvQkFBTCxDQUEwQjdCLE1BQTFCLENBQWQ7QUFDQSxXQUFLOEIsdUJBQUwsQ0FBNkJILFVBQTdCO0FBQ0EsVUFBSSxLQUFLL0MsTUFBVCxFQUFpQjtBQUNmLGFBQUtBLE1BQUwsQ0FBWW1ELFdBQVosQ0FBd0IzTCxLQUF4QixFQUErQnVMLFVBQS9CLEVBQTJDN0MsSUFBM0MsQ0FBZ0QsVUFBQ0MsSUFBRCxFQUFVO0FBQ3hELGlCQUFLaUQsYUFBTCxDQUFtQjVMLEtBQW5CLEVBQTBCMkksSUFBMUI7QUFDRCxTQUZELEVBRUcsVUFBQ0MsR0FBRCxFQUFTO0FBQ1YsaUJBQUtpRCxVQUFMLENBQWdCTixVQUFoQixFQUE0QjNDLEdBQTVCO0FBQ0QsU0FKRDtBQUtELE9BTkQsTUFNTyxJQUFJbEssS0FBSixFQUFXO0FBQ2hCLDRCQUFLQSxNQUFNb04sR0FBTixDQUFVOUwsS0FBVixFQUFpQnVMLFVBQWpCLENBQUwsRUFDRSxLQUFLSyxhQUFMLENBQW1CMUMsSUFBbkIsQ0FBd0IsSUFBeEIsRUFBOEJsSixLQUE5QixDQURGLEVBRUUsS0FBSzZMLFVBQUwsQ0FBZ0IzQyxJQUFoQixDQUFxQixJQUFyQixFQUEyQnFDLFVBQTNCLENBRkY7QUFJRDtBQUNGLEtBdjZCOEU7QUF3NkIvRUcsNkJBQXlCLFNBQVNBLHVCQUFULEdBQWlDLGVBQWlCLENBQUUsQ0F4NkJFO0FBeTZCL0VFLG1CQUFlLFNBQVNBLGFBQVQsQ0FBdUI1TCxLQUF2QixFQUE4QjhLLE1BQTlCLEVBQXNDO0FBQ25ELFdBQUtNLE1BQUw7O0FBRUEsVUFBTXhHLFVBQVUsS0FBS21ILG9CQUFMLENBQTBCL0wsS0FBMUIsRUFBaUM4SyxNQUFqQyxDQUFoQjtBQUNBLHdCQUFRa0IsT0FBUixDQUFnQixjQUFoQixFQUFnQyxDQUFDcEgsT0FBRCxDQUFoQzs7QUFFQSxXQUFLcUgsaUJBQUwsQ0FBdUJuQixNQUF2QjtBQUNELEtBaDdCOEU7QUFpN0IvRWUsZ0JBQVksU0FBU0EsVUFBVCxDQUFvQk4sVUFBcEIsRUFBZ0NwRyxLQUFoQyxFQUF1QztBQUNqRCxXQUFLaUcsTUFBTDtBQUNBLFdBQUs5RixXQUFMLENBQWlCSCxLQUFqQjtBQUNELEtBcDdCOEU7QUFxN0IvRTs7OztBQUlBOEcsdUJBQW1CLFNBQVNBLGlCQUFULEdBQTJCLFVBQVk7QUFDeEQ7QUFDQXZKLFdBQUtDLElBQUw7QUFDRCxLQTU3QjhFO0FBNjdCL0U7Ozs7O0FBS0F1SixZQUFRLFNBQVNBLE1BQVQsR0FBa0I7QUFDeEIsVUFBTXRDLFNBQVMsS0FBS3RGLFNBQUwsRUFBZjtBQUNBLFVBQUlzRixNQUFKLEVBQVk7QUFDVixhQUFLcUIsT0FBTDtBQUNBLGFBQUtrQixRQUFMLENBQWN2QyxNQUFkO0FBQ0QsT0FIRCxNQUdPO0FBQ0wsYUFBS3dDLGlCQUFMLENBQXVCLEtBQXZCO0FBQ0Q7QUFDRixLQTE4QjhFO0FBMjhCL0VELGNBQVUsU0FBU0EsUUFBVCxDQUFrQnZDLE1BQWxCLEVBQTBCO0FBQUE7O0FBQ2xDLFVBQU1sTCxRQUFRLEtBQUtrSixHQUFMLENBQVMsT0FBVCxDQUFkO0FBQ0EsVUFBTXlFLGFBQWE7QUFDakJiLG1CQUFXO0FBRE0sT0FBbkI7QUFHQSxVQUFNeEwsUUFBUSxLQUFLc00sb0JBQUwsQ0FBMEIxQyxNQUExQixDQUFkO0FBQ0EsV0FBSzJDLHVCQUFMLENBQTZCRixVQUE3QjtBQUNBLFVBQUksS0FBSzdELE1BQVQsRUFBaUI7QUFDZixhQUFLQSxNQUFMLENBQVlnRSxXQUFaLENBQXdCeE0sS0FBeEIsRUFBK0JxTSxVQUEvQixFQUEyQzNELElBQTNDLENBQWdELFVBQUNDLElBQUQsRUFBVTtBQUN4RCxpQkFBSzhELGFBQUwsQ0FBbUJ6TSxLQUFuQixFQUEwQjJJLElBQTFCO0FBQ0QsU0FGRCxFQUVHLFVBQUNDLEdBQUQsRUFBUztBQUNWLGlCQUFLOEQsVUFBTCxDQUFnQkwsVUFBaEIsRUFBNEJ6RCxHQUE1QjtBQUNELFNBSkQ7QUFLRCxPQU5ELE1BTU8sSUFBSWxLLEtBQUosRUFBVztBQUNoQiw0QkFBS0EsTUFBTWlPLEdBQU4sQ0FBVTNNLEtBQVYsRUFBaUJxTSxVQUFqQixDQUFMLEVBQ0UsS0FBS0ksYUFBTCxDQUFtQnZELElBQW5CLENBQXdCLElBQXhCLEVBQThCbEosS0FBOUIsQ0FERixFQUVFLEtBQUswTSxVQUFMLENBQWdCeEQsSUFBaEIsQ0FBcUIsSUFBckIsRUFBMkJtRCxVQUEzQixDQUZGO0FBSUQ7QUFDRixLQTk5QjhFO0FBKzlCL0U7Ozs7O0FBS0FPLGdCQUFZLFNBQVNBLFVBQVQsR0FBc0I7QUFDaEMsVUFBTWhELFNBQVMsS0FBS3RGLFNBQUwsRUFBZjs7QUFFQSxhQUFPLEtBQUtyRSxTQUFMLEdBQWlCLEtBQUt3TCxvQkFBTCxDQUEwQjdCLE1BQTFCLENBQWpCLEdBQXFELEtBQUswQyxvQkFBTCxDQUEwQjFDLE1BQTFCLENBQTVEO0FBQ0QsS0F4K0I4RTtBQXkrQi9FOzs7OztBQUtBMEMsMEJBQXNCLFNBQVNBLG9CQUFULENBQThCMUMsTUFBOUIsRUFBc0M7QUFDMUQsYUFBTyxLQUFLaUQsYUFBTCxDQUFtQmpELE1BQW5CLENBQVA7QUFDRCxLQWgvQjhFO0FBaS9CL0U7Ozs7O0FBS0E2QiwwQkFBc0IsU0FBU0Esb0JBQVQsQ0FBOEI3QixNQUE5QixFQUFzQztBQUMxRCxhQUFPLEtBQUtpRCxhQUFMLENBQW1CakQsTUFBbkIsQ0FBUDtBQUNELEtBeC9COEU7QUF5L0IvRTs7O0FBR0FpRCxtQkFBZSxTQUFTQSxhQUFULENBQXVCakQsTUFBdkIsRUFBK0I7QUFDNUMsYUFBT0EsTUFBUDtBQUNELEtBOS9COEU7QUErL0IvRTJDLDZCQUF5QixTQUFTQSx1QkFBVCxHQUFpQyxlQUFpQixDQUFFLENBLy9CRTtBQWdnQy9FRSxtQkFBZSxTQUFTQSxhQUFULENBQXVCek0sS0FBdkIsRUFBOEI4SyxNQUE5QixFQUFzQztBQUNuRCxXQUFLTSxNQUFMOztBQUVBLFVBQU14RyxVQUFVLEtBQUttSCxvQkFBTCxDQUEwQi9MLEtBQTFCLEVBQWlDOEssTUFBakMsQ0FBaEI7O0FBRUEsd0JBQVFrQixPQUFSLENBQWdCLGNBQWhCLEVBQWdDLENBQUNwSCxPQUFELENBQWhDOztBQUVBLFdBQUt3SCxpQkFBTCxDQUF1QnRCLE1BQXZCO0FBQ0QsS0F4Z0M4RTtBQXlnQy9FNEIsZ0JBQVksU0FBU0EsVUFBVCxDQUFvQkwsVUFBcEIsRUFBZ0NsSCxLQUFoQyxFQUF1QztBQUNqRCxXQUFLaUcsTUFBTDtBQUNBLFdBQUs5RixXQUFMLENBQWlCSCxLQUFqQjtBQUNELEtBNWdDOEU7QUE2Z0MvRTs7O0FBR0EySCx5QkFBcUIsRUFoaEMwRDtBQWloQy9FOzs7OztBQUtBdkksV0FBTyxTQUFTQSxLQUFULENBQWV3SSxJQUFmLEVBQXFCQyxLQUFyQixFQUE0QjtBQUFBOztBQUNqQyxVQUFNQyxNQUFNLEVBQVo7QUFDQSxVQUFNQyxjQUFjLEdBQXBCOztBQUVBLFVBQUlDLFFBQUosRUFBYztBQUNaLFlBQU1DLFNBQVNELFNBQVNFLElBQVQsQ0FBY04sSUFBZCxFQUFvQkMsS0FBcEIsRUFBMkIsVUFBQ00sSUFBRCxFQUFPdEgsR0FBUCxFQUFlO0FBQ3ZELGNBQUksT0FBSzhHLG1CQUFMLENBQXlCUyxPQUF6QixDQUFpQ3ZILEdBQWpDLEtBQXlDLENBQTdDLEVBQWdEO0FBQzlDLG1CQUFPLElBQVA7QUFDRDtBQUNGLFNBSmMsQ0FBZjs7QUFNQSxZQUFJb0gsTUFBSixFQUFZO0FBQ1ZBLGlCQUFPNUksT0FBUCxDQUFlLFVBQUM2SSxJQUFELEVBQVU7QUFDdkIsZ0JBQU1DLE9BQU9ELEtBQUtDLElBQUwsQ0FBVTdGLElBQVYsQ0FBZSxHQUFmLENBQWI7QUFDQSxnQkFBSTRGLEtBQUtHLElBQUwsS0FBY04sV0FBZCxJQUE2QkQsSUFBSU0sT0FBSixDQUFZRCxJQUFaLE1BQXNCLENBQUMsQ0FBeEQsRUFBMkQ7QUFDekRMLGtCQUFJdEksSUFBSixDQUFTMkksSUFBVDtBQUNEO0FBQ0YsV0FMRDtBQU1EO0FBQ0Y7O0FBRUQsYUFBT0wsR0FBUDtBQUNELEtBNWlDOEU7QUE2aUMvRVEsaUNBQTZCLFNBQVNBLDJCQUFULENBQXFDek4sS0FBckMsRUFBNEM7QUFDdkUsVUFBTXRCLFFBQVEsS0FBS2tKLEdBQUwsQ0FBUyxPQUFULENBQWQ7QUFDQSxVQUFJLEtBQUtZLE1BQVQsRUFBaUI7QUFDZixlQUFPLEtBQUtBLE1BQUwsQ0FBWWtGLFdBQVosQ0FBd0IxTixLQUF4QixDQUFQO0FBQ0QsT0FGRCxNQUVPLElBQUl0QixLQUFKLEVBQVc7QUFDaEIsZUFBT0EsTUFBTWlQLFdBQU4sQ0FBa0IzTixLQUFsQixDQUFQO0FBQ0Q7O0FBRUQsYUFBTyxFQUFQO0FBQ0QsS0F0akM4RTtBQXVqQy9FK0wsMEJBQXNCLFNBQVNBLG9CQUFULENBQThCNkIsYUFBOUIsRUFBNkNDLFFBQTdDLEVBQXVEO0FBQzNFLFVBQUlELGFBQUosRUFBbUI7QUFDakIsWUFBTW5QLEtBQUssS0FBS2dQLDJCQUFMLENBQWlDRyxhQUFqQyxDQUFYO0FBQ0EsZUFBTztBQUNMblAsZ0JBREs7QUFFTHVILGVBQUt2SCxFQUZBO0FBR0xrSyxnQkFBTWtGO0FBSEQsU0FBUDtBQUtEO0FBQ0YsS0Foa0M4RTtBQWlrQy9FOzs7O0FBSUF6Qix1QkFBbUIsU0FBU0EsaUJBQVQsR0FBMkIsVUFBWTtBQUN4RDtBQUNBMUosV0FBS0MsSUFBTDtBQUNELEtBeGtDOEU7QUF5a0MvRTs7OztBQUlBbUwsMkJBQXVCLFNBQVNBLHFCQUFULEdBQWlDO0FBQ3RELFVBQU0xRyxVQUFVLEVBQWhCOztBQUVBLFdBQUssSUFBSWpHLElBQUksQ0FBYixFQUFnQkEsSUFBSSxLQUFLdUQsTUFBTCxDQUFZaEIsTUFBaEMsRUFBd0N2QyxHQUF4QyxFQUE2QztBQUMzQ2lHLGdCQUFRekMsSUFBUixDQUFhLEtBQUt2Ryw2QkFBTCxDQUFtQ3dGLEtBQW5DLENBQXlDLEtBQUtjLE1BQUwsQ0FBWXZELENBQVosQ0FBekMsRUFBeUQsS0FBS3BCLE1BQUwsQ0FBWSxLQUFLMkUsTUFBTCxDQUFZdkQsQ0FBWixFQUFlQyxJQUEzQixDQUF6RCxDQUFiO0FBQ0Q7O0FBRUQsV0FBSzJNLEdBQUwsQ0FBUyxtQkFBVCxFQUE4QjNHLFFBQVFLLElBQVIsQ0FBYSxFQUFiLENBQTlCO0FBQ0F6RyxRQUFFLEtBQUtPLE9BQVAsRUFBZ0JDLFFBQWhCLENBQXlCLGtCQUF6QjtBQUNELEtBdGxDOEU7QUF1bEMvRXFELDRCQUF3QixTQUFTQSxzQkFBVCxHQUFrQztBQUN4RCxVQUFNdUMsVUFBVSxFQUFoQjs7QUFFQSxXQUFLLElBQUlqRyxJQUFJLENBQWIsRUFBZ0JBLElBQUksS0FBS3VELE1BQUwsQ0FBWWhCLE1BQWhDLEVBQXdDdkMsR0FBeEMsRUFBNkM7QUFDM0NpRyxnQkFBUXpDLElBQVIsQ0FBYSxLQUFLdEcsOEJBQUwsQ0FBb0N1RixLQUFwQyxDQUEwQyxLQUFLYyxNQUFMLENBQVl2RCxDQUFaLENBQTFDLENBQWI7QUFDRDs7QUFFRCxXQUFLNE0sR0FBTCxDQUFTLG9CQUFULEVBQStCM0csUUFBUUssSUFBUixDQUFhLEVBQWIsQ0FBL0I7QUFDQXpHLFFBQUUsS0FBS08sT0FBUCxFQUFnQkMsUUFBaEIsQ0FBeUIsOEJBQXpCO0FBQ0QsS0FobUM4RTtBQWltQy9FOzs7QUFHQXdNLDJCQUF1QixTQUFTQSxxQkFBVCxHQUFpQztBQUN0RGhOLFFBQUUsS0FBS08sT0FBUCxFQUFnQnlCLFdBQWhCLENBQTRCLGtCQUE1QjtBQUNBLFdBQUsrSyxHQUFMLENBQVMsbUJBQVQsRUFBOEIsRUFBOUI7QUFDRCxLQXZtQzhFO0FBd21DL0U7OztBQUdBRSw0QkFBd0IsU0FBU0Esc0JBQVQsR0FBa0M7QUFDeERqTixRQUFFLEtBQUtPLE9BQVAsRUFBZ0J5QixXQUFoQixDQUE0Qiw4QkFBNUI7QUFDQSxXQUFLK0ssR0FBTCxDQUFTLG9CQUFULEVBQStCLEVBQS9CO0FBQ0QsS0E5bUM4RTtBQSttQy9FOzs7Ozs7O0FBT0FqSixVQUFNLFNBQVNBLElBQVQsR0FBZ0I7QUFDcEIsVUFBSSxLQUFLaUcsY0FBTCxFQUFKLEVBQTJCO0FBQ3pCO0FBQ0Q7O0FBRUQsV0FBS2lELHFCQUFMO0FBQ0EsV0FBS0Msc0JBQUw7O0FBRUEsVUFBSSxLQUFLcEQsUUFBTCxPQUFvQixLQUF4QixFQUErQjtBQUM3QixhQUFLaUQscUJBQUw7QUFDQTtBQUNEOztBQUVELFVBQUksS0FBSzdOLFNBQVQsRUFBb0I7QUFDbEIsYUFBS2lDLE1BQUw7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLZ0ssTUFBTDtBQUNEO0FBQ0YsS0F4b0M4RTtBQXlvQy9FOzs7O0FBSUFnQyxnQkFBWSxTQUFTQSxVQUFULEdBQXNCO0FBQ2hDLGFBQU8sZUFBS2xHLEtBQUwsQ0FBVyxLQUFLckgsU0FBTCxDQUFldU4sVUFBZixFQUEyQnROLFNBQTNCLENBQVgsRUFBa0Q7QUFDdkR1TixzQkFBYyxLQUFLQSxZQURvQztBQUV2RGpNLGdCQUFRLEtBQUtELE9BQUwsQ0FBYUMsTUFGa0M7QUFHdkQ4RCxhQUFLLEtBQUsvRCxPQUFMLENBQWFDLE1BQWIsR0FBc0IsS0FBdEIsR0FBOEIsS0FBS0QsT0FBTCxDQUFhK0QsR0FBYixHQUFtQixLQUFLL0QsT0FBTCxDQUFhK0QsR0FBaEMsR0FBc0MsS0FBSy9ELE9BQUwsQ0FBYWpDLEtBQWIsSUFBc0IsS0FBS2lDLE9BQUwsQ0FBYWpDLEtBQWIsQ0FBbUIsS0FBSytHLFVBQXhCLENBSHhDLENBRzRFO0FBSDVFLE9BQWxELENBQVA7QUFLRCxLQW5wQzhFO0FBb3BDL0U7Ozs7QUFJQXFILGlCQUFhLFNBQVNBLFdBQVQsQ0FBcUJDLE1BQXJCLEVBQTZCO0FBQ3hDLFVBQU1DLFNBQVM7QUFDYnBDLGdCQUFRLEtBQUtsTixjQURBO0FBRWJrRCxnQkFBUSxLQUFLbkQ7QUFGQSxPQUFmOztBQUtBLGFBQU91UCxPQUFPRCxNQUFQLENBQVA7QUFDRCxLQS9wQzhFO0FBZ3FDL0U7OztBQUdBRSx3QkFBb0IsU0FBU0Esa0JBQVQsR0FBOEI7QUFDaEQsVUFBSSxLQUFLOUwsZUFBVCxFQUEwQjtBQUN4QixZQUFJLEtBQUtSLE9BQUwsQ0FBYUMsTUFBYixLQUF3QixJQUF4QixJQUFpQyxLQUFLRCxPQUFMLENBQWErRCxHQUFiLElBQW9CLENBQUMsS0FBSy9ELE9BQUwsQ0FBYWpDLEtBQXZFLEVBQStFO0FBQzdFZ0IsWUFBRSxLQUFLTyxPQUFQLEVBQWdCQyxRQUFoQixDQUF5QixlQUF6QjtBQUNELFNBRkQsTUFFTztBQUNMUixZQUFFLEtBQUtPLE9BQVAsRUFBZ0J5QixXQUFoQixDQUE0QixlQUE1QjtBQUNEO0FBQ0Y7O0FBRUQsV0FBS3JDLFNBQUwsQ0FBZTROLGtCQUFmLEVBQW1DM04sU0FBbkM7QUFDRCxLQTdxQzhFO0FBOHFDL0U0TixvQkFBZ0IsU0FBU0EsY0FBVCxHQUEwQjtBQUN4QztBQUNBO0FBQ0EsVUFBSSxLQUFLdE8sV0FBTCxJQUFvQixDQUFDLEtBQUtDLFdBQTlCLEVBQTJDO0FBQ3pDLGFBQUtELFdBQUwsQ0FBaUJ1TyxLQUFqQjtBQUNBLGFBQUt0TyxXQUFMLEdBQW1CLElBQW5CO0FBQ0Q7O0FBRUQsV0FBS1EsU0FBTCxDQUFlNk4sY0FBZixFQUErQjVOLFNBQS9CO0FBQ0QsS0F2ckM4RTtBQXdyQy9FOzs7Ozs7QUFNQThOLGNBQVUsU0FBU0EsUUFBVCxHQUFvQixDQUFFLENBOXJDK0M7QUErckMvRTs7OztBQUlBQyx3QkFBb0IsU0FBU0Esa0JBQVQsQ0FBNEIxTSxPQUE1QixFQUFxQztBQUN2RCxVQUFJLEtBQUtBLE9BQVQsRUFBa0I7QUFDaEIsWUFBSUEsT0FBSixFQUFhO0FBQ1gsY0FBSSxLQUFLQSxPQUFMLENBQWErRCxHQUFiLElBQW9CLEtBQUsvRCxPQUFMLENBQWErRCxHQUFiLEtBQXFCL0QsUUFBUStELEdBQXJELEVBQTBEO0FBQ3hELG1CQUFPLEtBQVA7QUFDRDtBQUNGO0FBQ0Y7O0FBRUQsYUFBTyxLQUFLckYsU0FBTCxDQUFlZ08sa0JBQWYsRUFBbUMvTixTQUFuQyxDQUFQO0FBQ0QsS0E3c0M4RTtBQThzQy9FOzs7Ozs7O0FBT0FzRixhQUFTLFNBQVNBLE9BQVQsR0FBbUI7QUFDMUIsV0FBSzBJLFNBQUw7QUFDQSxXQUFLNU8sS0FBTCxHQUFhLEtBQWI7QUFDQSxXQUFLK0UsT0FBTCxHQUFlLEtBQWY7QUFDQSxXQUFLOUUsU0FBTCxHQUFrQixLQUFLZ0MsT0FBTCxDQUFhQyxNQUFiLEtBQXdCLElBQTFDO0FBQ0EsV0FBSy9CLFdBQUwsR0FBbUIsS0FBbkI7O0FBRUFhLFFBQUUsS0FBS08sT0FBUCxFQUFnQnlCLFdBQWhCLENBQTRCLGtCQUE1QjtBQUNBaEMsUUFBRSxLQUFLTyxPQUFQLEVBQWdCeUIsV0FBaEIsQ0FBNEIsOEJBQTVCOztBQUVBLFdBQUswRyxXQUFMOztBQUVBLFVBQUksS0FBS3pKLFNBQVQsRUFBb0I7QUFDbEIsYUFBSzRPLGVBQUw7QUFDRCxPQUZELE1BRU87QUFDTCxhQUFLQyxlQUFMO0FBQ0Q7QUFDRixLQXR1QzhFO0FBdXVDL0VGLGVBQVcsU0FBU0EsU0FBVCxHQUFxQixDQUFFLENBdnVDNkM7QUF3dUMvRUMscUJBQWlCLFNBQVNBLGVBQVQsR0FBMkIsQ0FBRSxDQXh1Q2lDO0FBeXVDL0VDLHFCQUFpQixTQUFTQSxlQUFULEdBQTJCO0FBQzFDO0FBQ0EsVUFBSSxLQUFLN00sT0FBTCxDQUFhakMsS0FBakIsRUFBd0I7QUFDdEIsYUFBS2tFLFdBQUwsQ0FBaUIsS0FBS2pDLE9BQUwsQ0FBYWpDLEtBQTlCOztBQUVBO0FBQ0EsWUFBSSxLQUFLaUMsT0FBTCxDQUFhOEMsT0FBakIsRUFBMEI7QUFDeEIsZUFBS0EsT0FBTCxHQUFlLEtBQUs5QyxPQUFMLENBQWE4QyxPQUE1QjtBQUNBLGVBQUtaLFNBQUwsQ0FBZSxLQUFLWSxPQUFwQjtBQUNEO0FBQ0YsT0FSRCxNQVFPO0FBQ0w7QUFDQSxZQUFJLEtBQUs5QyxPQUFMLENBQWErRCxHQUFqQixFQUFzQjtBQUNwQixlQUFLdUMsV0FBTDtBQUNEO0FBQ0Y7QUFDRixLQXp2QzhFO0FBMHZDL0V3RyxjQUFVLFNBQVNBLFFBQVQsR0FBb0I7QUFDNUIsYUFBVSxLQUFLdFEsRUFBZjtBQUNELEtBNXZDOEU7QUE2dkMvRXVRLGdCQUFZLFNBQVNBLFVBQVQsR0FBc0I7QUFDaEMsVUFBTUMsUUFBUSxFQUFkO0FBQ0EsVUFBTXhRLEtBQUssS0FBS0EsRUFBaEI7QUFDQXdRLFlBQU10SyxJQUFOLENBQVdsRyxFQUFYOztBQUVBLFVBQU11SCxNQUFNLEtBQUthLE1BQUwsTUFBa0IsS0FBSzdHLEtBQUwsSUFBYyxLQUFLQSxLQUFMLENBQVcsS0FBSytHLFVBQWhCLENBQTVDO0FBQ0EsVUFBSWYsR0FBSixFQUFTO0FBQ1BpSixjQUFNdEssSUFBTixDQUFXcUIsR0FBWDtBQUNEOztBQUVELGFBQU9pSixNQUFNeEgsSUFBTixDQUFXLEdBQVgsQ0FBUDtBQUNEO0FBeHdDOEUsR0FBakUsQ0FBaEI7O29CQTJ3Q2VuSyxPIiwiZmlsZSI6Il9FZGl0QmFzZS5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgY29ubmVjdCBmcm9tICdkb2pvL19iYXNlL2Nvbm5lY3QnO1xyXG5pbXBvcnQgd2hlbiBmcm9tICdkb2pvL3doZW4nO1xyXG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xyXG5pbXBvcnQgRXJyb3JNYW5hZ2VyIGZyb20gJy4vRXJyb3JNYW5hZ2VyJztcclxuaW1wb3J0IEZpZWxkTWFuYWdlciBmcm9tICcuL0ZpZWxkTWFuYWdlcic7XHJcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuaW1wb3J0ICcuL0ZpZWxkcy9Cb29sZWFuRmllbGQnO1xyXG5pbXBvcnQgJy4vRmllbGRzL0RhdGVGaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvRGVjaW1hbEZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9Ecm9wZG93bkZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9EdXJhdGlvbkZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9IaWRkZW5GaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvTG9va3VwRmllbGQnO1xyXG5pbXBvcnQgJy4vRmllbGRzL05vdGVGaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvUGhvbmVGaWVsZCc7XHJcbmltcG9ydCAnLi9GaWVsZHMvU2VsZWN0RmllbGQnO1xyXG5pbXBvcnQgJy4vRmllbGRzL1NpZ25hdHVyZUZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9UZXh0QXJlYUZpZWxkJztcclxuaW1wb3J0ICcuL0ZpZWxkcy9UZXh0RmllbGQnO1xyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnZWRpdEJhc2UnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX0VkaXRCYXNlXHJcbiAqIEBjbGFzc2Rlc2MgQW4gRWRpdCBWaWV3IGlzIGEgZHVhbCBwdXJwb3NlIHZpZXcgLSB1c2VkIGZvciBib3RoIENyZWF0aW5nIGFuZCBVcGRhdGluZyByZWNvcmRzLiBJdCBpcyBjb21wcmlzZWRcclxuICogb2YgYSBsYXlvdXQgc2ltaWxhciB0byBEZXRhaWwgcm93cyBidXQgYXJlIGluc3RlYWQgRWRpdCBmaWVsZHMuXHJcbiAqXHJcbiAqIEEgdW5pcXVlIHBhcnQgb2YgdGhlIEVkaXQgdmlldyBpcyBpdCdzIGxpZmVjeWNsZSBpbiBjb21wYXJpc29uIHRvIERldGFpbC4gVGhlIERldGFpbCB2aWV3IGlzIHRvcm5cclxuICogZG93biBhbmQgcmVidWlsdCB3aXRoIGV2ZXJ5IHJlY29yZC4gV2l0aCBFZGl0IHRoZSBmb3JtIGlzIGVtcHRpZWQgKEhUTUwgbGVmdCBpbi10YWN0KSBhbmQgbmV3IHZhbHVlc1xyXG4gKiBhcmUgYXBwbGllZCB0byB0aGUgZmllbGRzLlxyXG4gKlxyXG4gKiBTaW5jZSBFZGl0IFZpZXdzIGFyZSB0eXBpY2FsbHkgdGhlIFwibGFzdFwiIHZpZXcgKHlvdSBhbHdheXMgY29tZSBmcm9tIGEgTGlzdCBvciBEZXRhaWwgdmlldykgaXQgd2FycmFudHNcclxuICogc3BlY2lhbCBhdHRlbnRpb24gdG8gdGhlIG5hdmlnYXRpb24gb3B0aW9ucyB0aGF0IGFyZSBwYXNzZWQsIGFzIHRoZXkgZ3JlYXRseSBjb250cm9sIGhvdyB0aGUgRWRpdCB2aWV3XHJcbiAqIGZ1bmN0aW9ucyBhbmQgb3BlcmF0ZXMuXHJcbiAqIEBleHRlbmRzIGFyZ29zLlZpZXdcclxuICogQHJlcXVpcmVzIGFyZ29zLlV0aWxpdHlcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5FcnJvck1hbmFnZXJcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5GaWVsZE1hbmFnZXJcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5Cb29sZWFuRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5EZWNpbWFsRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5EdXJhdGlvbkZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuSGlkZGVuRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5Mb29rdXBGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRzLk5vdGVGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRzLlBob25lRmllbGRcclxuICogQHJlcXVpcmVzIGFyZ29zLkZpZWxkcy5TZWxlY3RGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRzLlNpZ25hdHVyZUZpZWxkXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5GaWVsZHMuVGV4dEFyZWFGaWVsZFxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRmllbGRzLlRleHRGaWVsZFxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLl9FZGl0QmFzZScsIFtWaWV3XSwgLyoqIEBsZW5kcyBhcmdvcy5fRWRpdEJhc2UjICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIENyZWF0ZXMgYSBzZXR0ZXIgbWFwIHRvIGh0bWwgbm9kZXMsIG5hbWVseTpcclxuICAgKlxyXG4gICAqICogdmFsaWRhdGlvbkNvbnRlbnQgPT4gdmFsaWRhdGlvbkNvbnRlbnROb2RlJ3MgaW5uZXJIVE1MXHJcbiAgICpcclxuICAgKi9cclxuICBhdHRyaWJ1dGVNYXA6IHtcclxuICAgIHZhbGlkYXRpb25Db250ZW50OiB7XHJcbiAgICAgIG5vZGU6ICd2YWxpZGF0aW9uQ29udGVudE5vZGUnLFxyXG4gICAgICB0eXBlOiAnaW5uZXJIVE1MJyxcclxuICAgIH0sXHJcbiAgICBjb25jdXJyZW5jeUNvbnRlbnQ6IHtcclxuICAgICAgbm9kZTogJ2NvbmN1cnJlbmN5Q29udGVudE5vZGUnLFxyXG4gICAgICB0eXBlOiAnaW5uZXJIVE1MJyxcclxuICAgIH0sXHJcbiAgICB0aXRsZTogVmlldy5wcm90b3R5cGUuYXR0cmlidXRlTWFwLnRpdGxlLFxyXG4gICAgc2VsZWN0ZWQ6IFZpZXcucHJvdG90eXBlLmF0dHJpYnV0ZU1hcC5zZWxlY3RlZCxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSB2aWV3J3MgbWFpbiBET00gZWxlbWVudCB3aGVuIHRoZSB2aWV3IGlzIGluaXRpYWxpemVkLlxyXG4gICAqIFRoaXMgdGVtcGxhdGUgaW5jbHVkZXMgbG9hZGluZ1RlbXBsYXRlIGFuZCB2YWxpZGF0aW9uU3VtbWFyeVRlbXBsYXRlLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgdXNlcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICpcclxuICAgKiAgICAgIG5hbWUgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgKiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiAgICAgIGlkICAgICAgICAgICAgICAgICAgIG1haW4gY29udGFpbmVyIGRpdiBpZFxyXG4gICAqICAgICAgdGl0bGUgICAgICAgICAgICAgICAgbWFpbiBjb250YWluZXIgZGl2IHRpdGxlIGF0dHJcclxuICAgKiAgICAgIGNscyAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWwgY2xhc3Mgc3RyaW5nIGFkZGVkIHRvIHRoZSBtYWluIGNvbnRhaW5lciBkaXZcclxuICAgKiAgICAgIHJlc291cmNlS2luZCAgICAgICAgIHNldCB0byBkYXRhLXJlc291cmNlLWtpbmRcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgaWQ9XCJ7JT0gJC5pZCAlfVwiIGRhdGEtdGl0bGU9XCJ7JTogJC50aXRsZVRleHQgJX1cIiBjbGFzcz1cImVkaXQgcGFuZWwgc2Nyb2xsYWJsZSB7JT0gJC5jbHMgJX1cIiB7JSBpZiAoJC5yZXNvdXJjZUtpbmQpIHsgJX1kYXRhLXJlc291cmNlLWtpbmQ9XCJ7JT0gJC5yZXNvdXJjZUtpbmQgJX1cInslIH0gJX0+JyxcclxuICAgICd7JSEgJC5sb2FkaW5nVGVtcGxhdGUgJX0nLFxyXG4gICAgJ3slISAkLnZhbGlkYXRpb25TdW1tYXJ5VGVtcGxhdGUgJX0nLFxyXG4gICAgJ3slISAkLmNvbmN1cnJlbmN5U3VtbWFyeVRlbXBsYXRlICV9JyxcclxuICAgICc8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJjb250ZW50Tm9kZVwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgc2hvd24gd2hlbiBkYXRhIGlzIGJlaW5nIGxvYWRlZC5cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIGxvYWRpbmdUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZmllbGRzZXQgY2xhc3M9XCJwYW5lbC1sb2FkaW5nLWluZGljYXRvclwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yLWNvbnRhaW5lclwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yIGFjdGl2ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBvbmVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdHdvXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHRocmVlXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZvdXJcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZml2ZVwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8c3Bhbj57JTogJC5sb2FkaW5nVGV4dCAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9maWVsZHNldD4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCBmb3IgdGhlIHZhbGlkYXRpb24gc3VtbWFyeSBhcmVhLCB0aGlzIGRpdiBpcyBzaG93bi9oaWRkZW4gYXMgbmVlZGVkLlxyXG4gICAqXHJcbiAgICogYCRgID0+IHRoZSB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgdmFsaWRhdGlvblN1bW1hcnlUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwicGFuZWwtdmFsaWRhdGlvbi1zdW1tYXJ5XCI+JyxcclxuICAgICc8aDM+eyU6ICQudmFsaWRhdGlvblN1bW1hcnlUZXh0ICV9PC9oMz4nLFxyXG4gICAgJzx1bCBjbGFzcz1cInBhbmVsLXZhbGlkYXRpb24tbWVzc2FnZXNcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwidmFsaWRhdGlvbkNvbnRlbnROb2RlXCI+JyxcclxuICAgICc8L3VsPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgZm9yIHRoZSBjb25jdXJyZW5jeSBlcnJvciBhcmVhLCB0aGlzIGRpdiBpcyBzaG93bi9oaWRkZW4gYXMgbmVlZGVkLlxyXG4gICAqXHJcbiAgICogYCRgID0+IHRoZSB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgY29uY3VycmVuY3lTdW1tYXJ5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInBhbmVsLWNvbmN1cnJlbmN5LXN1bW1hcnlcIj4nLFxyXG4gICAgJzxoMz57JTogJC5jb25jdXJyZW5jeVN1bW1hcnlUZXh0ICV9PC9oMz4nLFxyXG4gICAgJzx1bCBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiY29uY3VycmVuY3lDb250ZW50Tm9kZVwiPicsXHJcbiAgICAnPC91bD4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHNob3duIHdoZW4gZGF0YSBpcyBiZWluZyBsb2FkZWQuXHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiB2YWxpZGF0aW9uIGVycm9yIG9iamVjdFxyXG4gICAqICogYCQkYCA9PiBmaWVsZCBpbnN0YW5jZSB0aGF0IHRoZSBlcnJvciBpcyBvblxyXG4gICAqL1xyXG4gIHZhbGlkYXRpb25TdW1tYXJ5SXRlbVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaT48cD4nLFxyXG4gICAgJzxhIGNsYXNzPVwiaHlwZXJsaW5rXCIgaHJlZj1cIiN7JT0gJC5uYW1lICV9XCI+JyxcclxuICAgICc8Yj57JTogJCQubGFiZWwgJX08L2I+OiB7JTogJC5tZXNzYWdlICV9JyxcclxuICAgICc8L2E+PC9wPjwvbGk+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqICogYCRgID0+IHZhbGlkYXRpb24gZXJyb3Igb2JqZWN0XHJcbiAgICovXHJcbiAgY29uY3VycmVuY3lTdW1tYXJ5SXRlbVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaT48cD48Yj57JTogJCQubmFtZSAlfTwvYj46IHslOiAkLm1lc3NhZ2UgJX08L3A+PC9saT4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IHN0YXJ0cyBhIG5ldyBzZWN0aW9uIGluY2x1ZGluZyB0aGUgY29sbGFwc2libGUgaGVhZGVyXHJcbiAgICpcclxuICAgKiBgJGAgPT4gdGhlIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBzZWN0aW9uQmVnaW5UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgIGA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uXCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJhY2NvcmRpb24taGVhZGVyIGlzLXNlbGVjdGVkXCI+XHJcbiAgICAgICAgPGEgaHJlZj1cIiNcIj48c3Bhbj57JTogKCQudGl0bGUgfHwgJC5vcHRpb25zLnRpdGxlKSAlfTwvc3Bhbj48L2E+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiYWNjb3JkaW9uLXBhbmVcIj5cclxuICAgICAgICA8ZmllbGRzZXQgY2xhc3M9XCJhY2NvcmRpb24tY29udGVudCB7JT0gKCQuY2xzIHx8ICQub3B0aW9ucy5jbHMpICV9XCI+XHJcbiAgICBgLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IGVuZHMgYSBzZWN0aW9uXHJcbiAgICpcclxuICAgKiBgJGAgPT4gdGhlIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBzZWN0aW9uRW5kVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPC9maWVsZHNldD48L2Rpdj48L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCBjcmVhdGVkIGZvciBlYWNoIHByb3BlcnR5IChmaWVsZCByb3cpLlxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gdGhlIGZpZWxkIHJvdyBvYmplY3QgZGVmaW5lZCBpbiB7QGxpbmsgI2NyZWF0ZUxheW91dCBjcmVhdGVMYXlvdXR9LlxyXG4gICAqICogYCQkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHByb3BlcnR5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGEgbmFtZT1cInslPSAkLm5hbWUgfHwgJC5wcm9wZXJ0eSAlfVwiPjwvYT4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJyb3ctZWRpdCB7JT0gJC5jbHMgJX17JSBpZiAoJC5yZWFkb25seSkgeyAlfXJvdy1yZWFkb25seXslIH0gJX1cIiBkYXRhLWZpZWxkPVwieyU9ICQubmFtZSB8fCAkLnByb3BlcnR5ICV9XCIgZGF0YS1maWVsZC10eXBlPVwieyU9ICQudHlwZSAlfVwiPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIFRoZSB1bmlxdWUgaWRlbnRpZmllciBvZiB0aGUgdmlld1xyXG4gICAqL1xyXG4gIGlkOiAnZ2VuZXJpY19lZGl0JyxcclxuICBzdG9yZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgbGF5b3V0IGRlZmluaXRpb24gdGhhdCBjb25zdHJ1Y3RzIHRoZSBkZXRhaWwgdmlldyB3aXRoIHNlY3Rpb25zIGFuZCByb3dzXHJcbiAgICovXHJcbiAgbGF5b3V0OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge0Jvb2xlYW59XHJcbiAgICogRW5hYmxlcyB0aGUgdXNlIG9mIHRoZSBjdXN0b21pemF0aW9uIGVuZ2luZSBvbiB0aGlzIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBlbmFibGVDdXN0b21pemF0aW9uczogdHJ1ZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgY3VzdG9taXphdGlvbiBpZGVudGlmaWVyIGZvciB0aGlzIGNsYXNzLiBXaGVuIGEgY3VzdG9taXphdGlvbiBpcyByZWdpc3RlcmVkIGl0IGlzIHBhc3NlZFxyXG4gICAqIGEgcGF0aC9pZGVudGlmaWVyIHdoaWNoIGlzIHRoZW4gbWF0Y2hlZCB0byB0aGlzIHByb3BlcnR5LlxyXG4gICAqL1xyXG4gIGN1c3RvbWl6YXRpb25TZXQ6ICdlZGl0JyxcclxuICAvKipcclxuICAgKiBAY2ZnIHtCb29sZWFufVxyXG4gICAqIENvbnRyb2xzIGlmIHRoZSB2aWV3IHNob3VsZCBiZSBleHBvc2VkXHJcbiAgICovXHJcbiAgZXhwb3NlOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmcvT2JqZWN0fVxyXG4gICAqIE1heSBiZSB1c2VkIGZvciB2ZXJpZnlpbmcgdGhlIHZpZXcgaXMgYWNjZXNzaWJsZSBmb3IgY3JlYXRpbmcgZW50cmllc1xyXG4gICAqL1xyXG4gIGluc2VydFNlY3VyaXR5OiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmcvT2JqZWN0fVxyXG4gICAqIE1heSBiZSB1c2VkIGZvciB2ZXJpZnlpbmcgdGhlIHZpZXcgaXMgYWNjZXNzaWJsZSBmb3IgZWRpdGluZyBlbnRyaWVzXHJcbiAgICovXHJcbiAgdXBkYXRlU2VjdXJpdHk6IGZhbHNlLFxyXG5cclxuICB2aWV3VHlwZTogJ2VkaXQnLFxyXG5cclxuICAvKipcclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIHNhdmVUZXh0OiByZXNvdXJjZS5zYXZlVGV4dCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogRGVmYXVsdCB0aXRsZSB0ZXh0IHNob3duIGluIHRoZSB0b3AgdG9vbGJhclxyXG4gICAqL1xyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBwbGFjZWQgaW4gdGhlIGhlYWRlciB3aGVuIHRoZXJlIGFyZSB2YWxpZGF0aW9uIGVycm9yc1xyXG4gICAqL1xyXG4gIHZhbGlkYXRpb25TdW1tYXJ5VGV4dDogcmVzb3VyY2UudmFsaWRhdGlvblN1bW1hcnlUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBwbGFjZWQgaW4gdGhlIGhlYWRlciB3aGVuIHRoZXJlIGFyZSB2YWxpZGF0aW9uIGVycm9yc1xyXG4gICAqL1xyXG4gIGNvbmN1cnJlbmN5U3VtbWFyeVRleHQ6IHJlc291cmNlLmNvbmN1cnJlbmN5U3VtbWFyeVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogRGVmYXVsdCB0ZXh0IHVzZWQgaW4gdGhlIHNlY3Rpb24gaGVhZGVyXHJcbiAgICovXHJcbiAgZGV0YWlsc1RleHQ6IHJlc291cmNlLmRldGFpbHNUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gd2hpbGUgdGhlIHZpZXcgaXMgbG9hZGluZy5cclxuICAgKi9cclxuICBsb2FkaW5nVGV4dDogcmVzb3VyY2UubG9hZGluZ1RleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogTG9jYWxpemVkIGVycm9yIG1lc3NhZ2VzLiBPbmUgZ2VuZXJhbCBlcnJvciBtZXNzYWdlLCBhbmQgbWVzc2FnZXMgYnkgSFRUUCBzdGF0dXMgY29kZS5cclxuICAgKi9cclxuICBlcnJvclRleHQ6IHtcclxuICAgIGdlbmVyYWw6IHJlc291cmNlLmVycm9yR2VuZXJhbCxcclxuICAgIHN0YXR1czoge1xyXG4gICAgICA0MTA6IHJlc291cmNlLmVycm9yNDAxLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgYWxlcnRlZCB0byB1c2VyIHdoZW4gdGhlIGRhdGEgaGFzIGJlZW4gdXBkYXRlZCBzaW5jZSB0aGV5IGxhc3QgZmV0Y2hlZCB0aGUgZGF0YS5cclxuICAgKi9cclxuICBjb25jdXJyZW5jeUVycm9yVGV4dDogcmVzb3VyY2UuY29uY3VycmVuY3lFcnJvclRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogQVJJQSBsYWJlbCB0ZXh0IGZvciBhIGNvbGxhcHNpYmxlIHNlY3Rpb24gaGVhZGVyXHJcbiAgICovXHJcbiAgdG9nZ2xlQ29sbGFwc2VUZXh0OiByZXNvdXJjZS50b2dnbGVDb2xsYXBzZVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogQ29sbGVjdGlvbiBvZiB0aGUgZmllbGRzIGluIHRoZSBsYXlvdXQgd2hlcmUgdGhlIGtleSBpcyB0aGUgYG5hbWVgIG9mIHRoZSBmaWVsZC5cclxuICAgKi9cclxuICBmaWVsZHM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIHNhdmVkIGRhdGEgcmVzcG9uc2UuXHJcbiAgICovXHJcbiAgZW50cnk6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWdzIGlmIHRoZSB2aWV3IGlzIGluIFwiaW5zZXJ0XCIgKGNyZWF0ZSkgbW9kZSwgb3IgaWYgaXQgaXMgaW4gXCJ1cGRhdGVcIiAoZWRpdCkgbW9kZS5cclxuICAgKi9cclxuICBpbnNlcnRpbmc6IG51bGwsXHJcblxyXG4gIF9mb2N1c0ZpZWxkOiBudWxsLFxyXG4gIF9oYXNGb2N1c2VkOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogRmxhZ3MgaWYgdGhlIHZpZXcgaXMgbXVsdGkgY29sdW1uIG9yIHNpbmdsZSBjb2x1bW4uXHJcbiAgICovXHJcbiAgbXVsdGlDb2x1bW5WaWV3OiB0cnVlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfVxyXG4gICAqIFNvSG8gY2xhc3MgdG8gYmUgYXBwbGllZCBvbiBtdWx0aSBjb2x1bW4uXHJcbiAgICovXHJcbiAgbXVsdGlDb2x1bW5DbGFzczogJ2ZvdXInLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfVxyXG4gICAqIE51bWJlciBvZiBjb2x1bW5zIGluIHZpZXdcclxuICAgKi9cclxuICBtdWx0aUNvbHVtbkNvdW50OiAzLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gaW4gdGhlIHRvcCB0b29sYmFyIHNhdmUgYnV0dG9uXHJcbiAgICovXHJcbiAgc2F2ZVRvb2x0aXBUZXh0OiByZXNvdXJjZS5zYXZlVG9vbHRpcFRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCBzaG93biBpbiB0aGUgdG9wIHRvb2xiYXIgY2FuY2VsIGJ1dHRvblxyXG4gICAqL1xyXG4gIGNhbmNlbFRvb2x0aXBUZXh0OiByZXNvdXJjZS5jYW5jZWxUb29sdGlwVGV4dCxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIGNvbnN0cnVjdG9yIHRvIGluaXRpYWx6ZSBgdGhpcy5maWVsZHNgIHRvIHt9XHJcbiAgICogQHBhcmFtIG9cclxuICAgKiBAY29uc3RydWN0c1xyXG4gICAqL1xyXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBjb25zdHJ1Y3RvcigvKiBvKi8pIHtcclxuICAgIHRoaXMuZmllbGRzID0ge307XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBXaGVuIHRoZSBhcHAgaXMgc3RhcnRlZCB0aGlzIGZpcmVzLCB0aGUgRWRpdCB2aWV3IHJlbmRlcnMgaXRzIGxheW91dCBpbW1lZGlhdGVseSwgdGhlblxyXG4gICAqIHJlbmRlcnMgZWFjaCBmaWVsZCBpbnN0YW5jZS5cclxuICAgKlxyXG4gICAqIE9uIHJlZnJlc2ggaXQgd2lsbCBjbGVhciB0aGUgdmFsdWVzLCBidXQgbGVhdmUgdGhlIGxheW91dCBpbnRhY3QuXHJcbiAgICpcclxuICAgKi9cclxuICBzdGFydHVwOiBmdW5jdGlvbiBzdGFydHVwKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoc3RhcnR1cCwgYXJndW1lbnRzKTtcclxuICAgIHRoaXMucHJvY2Vzc0xheW91dCh0aGlzLl9jcmVhdGVDdXN0b21pemVkTGF5b3V0KHRoaXMuY3JlYXRlTGF5b3V0KCkpKTtcclxuXHJcbiAgICAkKCdkaXZbZGF0YS1maWVsZF0nLCB0aGlzLmNvbnRlbnROb2RlKVxyXG4gICAgICAuZWFjaCgoaSwgbm9kZSkgPT4ge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSAkKG5vZGUpLmF0dHIoJ2RhdGEtZmllbGQnKTtcclxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW25hbWVdO1xyXG4gICAgICAgIGlmIChmaWVsZCkge1xyXG4gICAgICAgICAgJChmaWVsZC5kb21Ob2RlKS5hZGRDbGFzcygnZmllbGQnKTtcclxuICAgICAgICAgIGZpZWxkLnJlbmRlclRvKG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIGluaXQgdG8gYWxzbyBpbml0IHRoZSBmaWVsZHMgaW4gYHRoaXMuZmllbGRzYC5cclxuICAgKi9cclxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoaW5pdCwgYXJndW1lbnRzKTtcclxuXHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5maWVsZHMpIHtcclxuICAgICAgaWYgKHRoaXMuZmllbGRzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgdGhpcy5maWVsZHNbbmFtZV0uaW5pdCgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIGFuZCByZXR1cm5zIHRoZSB0b29sYmFyIGl0ZW0gbGF5b3V0IGRlZmluaXRpb24sIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gaW4gdGhlIHZpZXdcclxuICAgKiBzbyB0aGF0IHlvdSBtYXkgZGVmaW5lIHRoZSB2aWV3cyB0b29sYmFyIGl0ZW1zLlxyXG4gICAqXHJcbiAgICogQnkgZGVmYXVsdCBpdCBhZGRzIGEgc2F2ZSBidXR0b24gYm91bmQgdG8gYHRoaXMuc2F2ZSgpYCBhbmQgY2FuY2VsIHRoYXQgZmlyZXMgYFJlVUkuYmFjaygpYFxyXG4gICAqXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzLnRvb2xzXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICovXHJcbiAgY3JlYXRlVG9vbExheW91dDogZnVuY3Rpb24gY3JlYXRlVG9vbExheW91dCgpIHtcclxuICAgIGNvbnN0IHRiYXIgPSBbe1xyXG4gICAgICBpZDogJ3NhdmUnLFxyXG4gICAgICBhY3Rpb246ICdzYXZlJyxcclxuICAgICAgc3ZnOiAnc2F2ZScsXHJcbiAgICAgIHRpdGxlOiB0aGlzLnNhdmVUZXh0LFxyXG4gICAgICBzZWN1cml0eTogdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5pbnNlcnQgPyB0aGlzLmluc2VydFNlY3VyaXR5IDogdGhpcy51cGRhdGVTZWN1cml0eSxcclxuICAgIH1dO1xyXG5cclxuICAgIGlmICghQXBwLmlzT25GaXJzdFZpZXcoKSkge1xyXG4gICAgICB0YmFyLnVuc2hpZnQoe1xyXG4gICAgICAgIGlkOiAnY2FuY2VsJyxcclxuICAgICAgICBzdmc6ICdjYW5jZWwnLFxyXG4gICAgICAgIHRpdGxlOiB0aGlzLmNhbmNlbFRvb2x0aXBUZXh0LFxyXG4gICAgICAgIHNpZGU6ICdsZWZ0JyxcclxuICAgICAgICBhY3Rpb246ICdvblRvb2xDYW5jZWwnLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy50b29scyB8fCAodGhpcy50b29scyA9IHtcclxuICAgICAgdGJhcixcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgb25Ub29sQ2FuY2VsOiBmdW5jdGlvbiBvblRvb2xDYW5jZWwoKSB7XHJcbiAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcbiAgICBSZVVJLmJhY2soKTtcclxuICB9LFxyXG4gIF9nZXRTdG9yZUF0dHI6IGZ1bmN0aW9uIF9nZXRTdG9yZUF0dHIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdG9yZSB8fCAodGhpcy5zdG9yZSA9IHRoaXMuY3JlYXRlU3RvcmUoKSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciBhIGZpZWxkcyBvbiBzaG93IGV2ZW50LlxyXG4gICAqXHJcbiAgICogUmVtb3ZlcyB0aGUgcm93LWhpZGRlbiBjc3MgY2xhc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge19GaWVsZH0gZmllbGQgRmllbGQgaW5zdGFuY2UgdGhhdCBpcyBiZWluZyBzaG93blxyXG4gICAqL1xyXG4gIF9vblNob3dGaWVsZDogZnVuY3Rpb24gX29uU2hvd0ZpZWxkKGZpZWxkKSB7XHJcbiAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctaGlkZGVuJyk7XHJcbiAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLnBhcmVudCgpLnJlbW92ZUNsYXNzKCdkaXNwbGF5LW5vbmUnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGEgZmllbGRzIG9uIGhpZGUgZXZlbnQuXHJcbiAgICpcclxuICAgKiBBZGRzIHRoZSByb3ctaGlkZGVuIGNzcyBjbGFzcy5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7X0ZpZWxkfSBmaWVsZCBGaWVsZCBpbnN0YW5jZSB0aGF0IGlzIGJlaW5nIGhpZGRlblxyXG4gICAqL1xyXG4gIF9vbkhpZGVGaWVsZDogZnVuY3Rpb24gX29uSGlkZUZpZWxkKGZpZWxkKSB7XHJcbiAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLmFkZENsYXNzKCdyb3ctaGlkZGVuJyk7XHJcbiAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLnBhcmVudCgpLmFkZENsYXNzKCdkaXNwbGF5LW5vbmUnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGEgZmllbGRzIG9uIGVuYWJsZSBldmVudC5cclxuICAgKlxyXG4gICAqIFJlbW92ZXMgdGhlIHJvdy1kaXNhYmxlZCBjc3MgY2xhc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge19GaWVsZH0gZmllbGQgRmllbGQgaW5zdGFuY2UgdGhhdCBpcyBiZWluZyBlbmFibGVkXHJcbiAgICovXHJcbiAgX29uRW5hYmxlRmllbGQ6IGZ1bmN0aW9uIF9vbkVuYWJsZUZpZWxkKGZpZWxkKSB7XHJcbiAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctZGlzYWJsZWQnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGEgZmllbGRzIG9uIGRpc2FibGUgZXZlbnQuXHJcbiAgICpcclxuICAgKiBBZGRzIHRoZSByb3ctZGlzYWJsZWQgY3NzIGNsYXNzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtfRmllbGR9IGZpZWxkIEZpZWxkIGluc3RhbmNlIHRoYXQgaXMgYmVpbmcgZGlzYWJsZWRcclxuICAgKi9cclxuICBfb25EaXNhYmxlRmllbGQ6IGZ1bmN0aW9uIF9vbkRpc2FibGVGaWVsZChmaWVsZCkge1xyXG4gICAgJChmaWVsZC5jb250YWluZXJOb2RlKS5hZGRDbGFzcygncm93LWRpc2FibGVkJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIGludm9rZUFjdGlvbiB0byBmaXJzdCBsb29rIGZvciB0aGUgc3BlY2lmaWVkIGZ1bmN0aW9uIG5hbWUgb24gdGhlIGZpZWxkIGluc3RhbmNlXHJcbiAgICogZmlyc3QgYmVmb3JlIHBhc3NpbmcgaXQgdG8gdGhlIHZpZXcuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgTmFtZSBvZiB0aGUgZnVuY3Rpb24gdG8gaW52b2tlXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgUGFyYW1ldGVycyBvZiB0aGUgZnVuY3Rpb24gdG8gYmUgcGFzc2VkXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBvcmlnaW5hbCBjbGljay90YXAgZXZlbnRcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlIFRoZSBub2RlIHRoYXQgaW5pdGlhdGVkIHRoZSBldmVudFxyXG4gICAqIEByZXR1cm4ge0Z1bmN0aW9ufSBFaXRoZXIgY2FsbHMgdGhlIGZpZWxkcyBhY3Rpb24gb3IgcmV0dXJucyB0aGUgaW5oZXJpdGVkIHZlcnNpb24gd2hpY2ggbG9va3MgYXQgdGhlIHZpZXcgZm9yIHRoZSBhY3Rpb25cclxuICAgKi9cclxuICBpbnZva2VBY3Rpb246IGZ1bmN0aW9uIGludm9rZUFjdGlvbihuYW1lLCBwYXJhbWV0ZXJzLCBldnQsIG5vZGUpIHtcclxuICAgIGNvbnN0IGZpZWxkTm9kZSA9ICQobm9kZSwgdGhpcy5jb250ZW50Tm9kZSkucGFyZW50cygnW2RhdGEtZmllbGRdJyk7XHJcbiAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW2ZpZWxkTm9kZS5sZW5ndGggPiAwICYmIGZpZWxkTm9kZS5maXJzdCgpLmF0dHIoJ2RhdGEtZmllbGQnKV07XHJcblxyXG4gICAgaWYgKGZpZWxkICYmIHR5cGVvZiBmaWVsZFtuYW1lXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICByZXR1cm4gZmllbGRbbmFtZV0uYXBwbHkoZmllbGQsIFtwYXJhbWV0ZXJzLCBldnQsIG5vZGVdKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5pbmhlcml0ZWQoaW52b2tlQWN0aW9uLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyBpZiBhIGZpZWxkIGhhcyBkZWZpbmVkIG9uIGl0IHRoZSBzdXBwbGllZCBuYW1lIGFzIGEgZnVuY3Rpb25cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSBOYW1lIG9mIHRoZSBmdW5jdGlvbiB0byB0ZXN0IGZvclxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgb3JpZ2luYWwgY2xpY2svdGFwIGV2ZW50XHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBUaGUgbm9kZSB0aGF0IGluaXRpYXRlZCB0aGUgZXZlbnRcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBJZiB0aGUgZmllbGQgaGFzIHRoZSBuYW1lZCBmdW5jdGlvbiBkZWZpbmVkXHJcbiAgICovXHJcbiAgaGFzQWN0aW9uOiBmdW5jdGlvbiBoYXNBY3Rpb24obmFtZSwgZXZ0LCBub2RlKSB7XHJcbiAgICBjb25zdCBmaWVsZE5vZGUgPSAkKG5vZGUsIHRoaXMuY29udGVudE5vZGUpLnBhcmVudHMoJ1tkYXRhLWZpZWxkXScpO1xyXG4gICAgY29uc3QgZmllbGQgPSBmaWVsZE5vZGUgJiYgdGhpcy5maWVsZHNbZmllbGROb2RlLmxlbmd0aCA+IDAgJiYgZmllbGROb2RlLmZpcnN0KCkuYXR0cignZGF0YS1maWVsZCcpXTtcclxuXHJcbiAgICBpZiAoZmllbGQgJiYgdHlwZW9mIGZpZWxkW25hbWVdID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmluaGVyaXRlZChoYXNBY3Rpb24sIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBjcmVhdGVTdG9yZTogZnVuY3Rpb24gY3JlYXRlU3RvcmUoKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9LFxyXG4gIG9uQ29udGVudENoYW5nZTogZnVuY3Rpb24gb25Db250ZW50Q2hhbmdlKCkge30sXHJcbiAgcHJvY2Vzc0VudHJ5OiBmdW5jdGlvbiBwcm9jZXNzRW50cnkoZW50cnkpIHtcclxuICAgIHJldHVybiBlbnRyeTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFByZS1wcm9jZXNzZXMgdGhlIGVudHJ5IGJlZm9yZSBwcm9jZXNzRW50cnkgcnVucy5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgZGF0YVxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gZW50cnkgd2l0aCBhY3R1YWwgRGF0ZSBvYmplY3RzXHJcbiAgICovXHJcbiAgY29udmVydEVudHJ5OiBmdW5jdGlvbiBjb252ZXJ0RW50cnkoZW50cnkpIHtcclxuICAgIHJldHVybiBlbnRyeTtcclxuICB9LFxyXG4gIHByb2Nlc3NGaWVsZExldmVsU2VjdXJpdHk6IGZ1bmN0aW9uIHByb2Nlc3NGaWVsZExldmVsU2VjdXJpdHkoZW50cnkpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gIH0sXHJcbiAgcHJvY2Vzc0RhdGE6IGZ1bmN0aW9uIHByb2Nlc3NEYXRhKGVudHJ5KSB7XHJcbiAgICB0aGlzLmVudHJ5ID0gdGhpcy5wcm9jZXNzRW50cnkodGhpcy5jb252ZXJ0RW50cnkoZW50cnkgfHwge30pKSB8fCB7fTtcclxuICAgIHRoaXMucHJvY2Vzc0ZpZWxkTGV2ZWxTZWN1cml0eSh0aGlzLmVudHJ5KTtcclxuXHJcbiAgICB0aGlzLnNldFZhbHVlcyhlbnRyeSwgdHJ1ZSk7XHJcblxyXG4gICAgLy8gUmUtYXBwbHkgY2hhbmdlcyBzYXZlZCBmcm9tIGNvbmN1cnJlbmN5L3ByZWNvbmRpdGlvbiBmYWlsdXJlXHJcbiAgICBpZiAodGhpcy5wcmV2aW91c1ZhbHVlc0FsbCkge1xyXG4gICAgICAvLyBNYWtlIGEgY29weSBvZiB0aGUgY3VycmVudCB2YWx1ZXMsIHNvIHdlIGNhbiBkaWZmIHRoZW1cclxuICAgICAgY29uc3QgY3VycmVudFZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzKHRydWUpO1xyXG4gICAgICBjb25zdCBkaWZmcyA9IHRoaXMuZGlmZnModGhpcy5wcmV2aW91c1ZhbHVlc0FsbCwgY3VycmVudFZhbHVlcyk7XHJcblxyXG4gICAgICBpZiAoZGlmZnMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGRpZmZzLmZvckVhY2goZnVuY3Rpb24gZm9yRWFjaCh2YWwpIHtcclxuICAgICAgICAgIHRoaXMuZXJyb3JzLnB1c2goe1xyXG4gICAgICAgICAgICBuYW1lOiB2YWwsXHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IHRoaXMuY29uY3VycmVuY3lFcnJvclRleHQsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9LCB0aGlzKTtcclxuXHJcbiAgICAgICAgdGhpcy5zaG93Q29uY3VycmVuY3lTdW1tYXJ5KCk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgLy8gTm8gZGlmZnMgZm91bmQsIGF0dGVtcHQgdG8gcmUtc2F2ZVxyXG4gICAgICAgIHRoaXMuc2F2ZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnByZXZpb3VzVmFsdWVzQWxsID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICAvLyBSZS1hcHBseSBhbnkgcGFzc2VkIGNoYW5nZXMgYXMgdGhleSBtYXkgaGF2ZSBiZWVuIG92ZXJ3cml0dGVuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLmNoYW5nZXMpIHtcclxuICAgICAgdGhpcy5jaGFuZ2VzID0gdGhpcy5vcHRpb25zLmNoYW5nZXM7XHJcbiAgICAgIHRoaXMuc2V0VmFsdWVzKHRoaXMuY2hhbmdlcyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBfb25HZXRDb21wbGV0ZTogZnVuY3Rpb24gX29uR2V0Q29tcGxldGUoZW50cnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc0RhdGEoZW50cnkpO1xyXG4gICAgICB9IGVsc2UgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgICAgLyogdG9kbzogc2hvdyBlcnJvciBtZXNzYWdlPyAqL1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWxvYWRpbmcnKTtcclxuXHJcbiAgICAgIC8qIHRoaXMgbXVzdCB0YWtlIHBsYWNlIHdoZW4gdGhlIGNvbnRlbnQgaXMgdmlzaWJsZSAqL1xyXG4gICAgICB0aGlzLm9uQ29udGVudENoYW5nZSgpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICB9XHJcbiAgfSxcclxuICBfb25HZXRFcnJvcjogZnVuY3Rpb24gX29uR2V0RXJyb3IoZ2V0T3B0aW9ucywgZXJyb3IpIHtcclxuICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpO1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIGFuZCByZXR1cm5zIHRoZSBFZGl0IHZpZXcgbGF5b3V0IGJ5IGZvbGxvd2luZyBhIHN0YW5kYXJkIGZvciBzZWN0aW9uIGFuZCBmaWVsZDpcclxuICAgKlxyXG4gICAqIFRoZSBgdGhpcy5sYXlvdXRgIGl0c2VsZiBpcyBhbiBhcnJheSBvZiBzZWN0aW9uIG9iamVjdHMgd2hlcmUgYSBzZWN0aW9uIG9iamVjdCBpcyBkZWZpbmVkIGFzIHN1Y2g6XHJcbiAgICpcclxuICAgKiAgICAge1xyXG4gICAqICAgICAgICBuYW1lOiAnU3RyaW5nJywgLy8gUmVxdWlyZWQuIHVuaXF1ZSBuYW1lIGZvciBpZGVudGlmaWNhdGlvbi9jdXN0b21pemF0aW9uIHB1cnBvc2VzXHJcbiAgICogICAgICAgIHRpdGxlOiAnU3RyaW5nJywgLy8gUmVxdWlyZWQuIFRleHQgc2hvd24gaW4gdGhlIHNlY3Rpb24gaGVhZGVyXHJcbiAgICogICAgICAgIGNoaWxkcmVuOiBbXSwgLy8gQXJyYXkgb2YgY2hpbGQgcm93IG9iamVjdHNcclxuICAgKiAgICAgfVxyXG4gICAqXHJcbiAgICogQSBjaGlsZCByb3cgb2JqZWN0IGhhczpcclxuICAgKlxyXG4gICAqICAgICB7XHJcbiAgICogICAgICAgIG5hbWU6ICdTdHJpbmcnLCAvLyBSZXF1aXJlZC4gdW5pcXVlIG5hbWUgZm9yIGlkZW50aWZpY2F0aW9uL2N1c3RvbWl6YXRpb24gcHVycG9zZXNcclxuICAgKiAgICAgICAgcHJvcGVydHk6ICdTdHJpbmcnLCAvLyBPcHRpb25hbC4gVGhlIHByb3BlcnR5IG9mIHRoZSBjdXJyZW50IGVudGl0eSB0byBiaW5kIHRvXHJcbiAgICogICAgICAgIGxhYmVsOiAnU3RyaW5nJywgLy8gT3B0aW9uYWwuIFRleHQgc2hvd24gaW4gdGhlIGxhYmVsIHRvIHRoZSBsZWZ0IG9mIHRoZSBwcm9wZXJ0eVxyXG4gICAqICAgICAgICB0eXBlOiAnU3RyaW5nJywgLy8gUmVxdWlyZWQuIFRoZSBmaWVsZCB0eXBlIGFzIHJlZ2lzdGVyZWQgd2l0aCB0aGUgRmllbGRNYW5hZ2VyLlxyXG4gICAqICAgICAgICAvLyBFeGFtcGxlcyBvZiB0eXBlOiAndGV4dCcsICdkZWNpbWFsJywgJ2RhdGUnLCAnbG9va3VwJywgJ3NlbGVjdCcsICdkdXJhdGlvbidcclxuICAgKiAgICAgICAgJ2RlZmF1bHQnOiB2YWx1ZSAvLyBPcHRpb25hbC4gSWYgZGVmaW5lZCB0aGUgdmFsdWUgd2lsbCBiZSBzZXQgYXMgdGhlIGRlZmF1bHQgXCJ1bm1vZGlmaWVkXCIgdmFsdWUgKG5vdCBkaXJ0eSkuXHJcbiAgICogICAgIH1cclxuICAgKlxyXG4gICAqIEFsbCBmdXJ0aGVyIHByb3BlcnRpZXMgYXJlIHNldCBieSB0aGVpciByZXNwZWN0aXZlIHR5cGUsIHBsZWFzZSBzZWUgdGhlIGluZGl2aWR1YWwgZmllbGQgZm9yXHJcbiAgICogaXRzIGNvbmZpZ3VyYWJsZSBvcHRpb25zLlxyXG4gICAqXHJcbiAgICogQHJldHVybiB7T2JqZWN0W119IEVkaXQgbGF5b3V0IGRlZmluaXRpb25cclxuICAgKi9cclxuICBjcmVhdGVMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZUxheW91dCgpIHtcclxuICAgIHJldHVybiB0aGlzLmxheW91dCB8fCBbXTtcclxuICB9LFxyXG5cclxuICBjcmVhdGVFcnJvckhhbmRsZXJzOiBmdW5jdGlvbiBjcmVhdGVFcnJvckhhbmRsZXJzKCkge1xyXG4gICAgdGhpcy5lcnJvckhhbmRsZXJzID0gdGhpcy5lcnJvckhhbmRsZXJzIHx8IFt7XHJcbiAgICAgIG5hbWU6ICdQcmVDb25kaXRpb24nLFxyXG4gICAgICB0ZXN0OiBmdW5jdGlvbiB0ZXN0UHJlQ29uZGl0aW9uKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yICYmIGVycm9yLnN0YXR1cyA9PT0gdGhpcy5IVFRQX1NUQVRVUy5QUkVDT05ESVRJT05fRkFJTEVEO1xyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGU6IGZ1bmN0aW9uIGhhbmRsZVByZUNvbmRpdGlvbihlcnJvciwgbmV4dCkge1xyXG4gICAgICAgIG5leHQoKTsgLy8gSW52b2tlIHRoZSBuZXh0IGVycm9yIGhhbmRsZXIgZmlyc3QsIHRoZSByZWZyZXNoIHdpbGwgY2hhbmdlIGEgbG90IG9mIG11dGFibGUvc2hhcmVkIHN0YXRlXHJcblxyXG4gICAgICAgIC8vIFByZXNlcnZlIG91ciBjdXJyZW50IGZvcm0gdmFsdWVzIChhbGwgb2YgdGhlbSksXHJcbiAgICAgICAgLy8gYW5kIHJlbG9hZCB0aGUgdmlldyB0byBmZXRjaCB0aGUgbmV3IGRhdGEuXHJcbiAgICAgICAgdGhpcy5wcmV2aW91c1ZhbHVlc0FsbCA9IHRoaXMuZ2V0VmFsdWVzKHRydWUpO1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy5rZXkgPSB0aGlzLmVudHJ5LiRrZXk7IC8vIEZvcmNlIGEgZmV0Y2ggYnkga2V5XHJcbiAgICAgICAgZGVsZXRlIHRoaXMub3B0aW9ucy5lbnRyeTsgLy8gUmVtb3ZlIHRoaXMsIG9yIHRoZSBmb3JtIHdpbGwgbG9hZCB0aGUgZW50cnkgdGhhdCBjYW1lIGZyb20gdGhlIGRldGFpbCB2aWV3XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LCB7XHJcbiAgICAgIG5hbWU6ICdBbGVydEVycm9yJyxcclxuICAgICAgdGVzdDogZnVuY3Rpb24gdGVzdEFsZXJ0KGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yLnN0YXR1cyAhPT0gdGhpcy5IVFRQX1NUQVRVUy5QUkVDT05ESVRJT05fRkFJTEVEO1xyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGU6IGZ1bmN0aW9uIGhhbmRsZUFsZXJ0KGVycm9yLCBuZXh0KSB7XHJcbiAgICAgICAgYWxlcnQodGhpcy5nZXRFcnJvck1lc3NhZ2UoZXJyb3IpKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSxcclxuICAgIH0sIHtcclxuICAgICAgbmFtZTogJ0NhdGNoQWxsJyxcclxuICAgICAgdGVzdDogZnVuY3Rpb24gdGVzdENhdGNoQWxsKCkge1xyXG4gICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGU6IGZ1bmN0aW9uIGhhbmRsZUNhdGNoQWxsKGVycm9yLCBuZXh0KSB7XHJcbiAgICAgICAgY29uc3QgZnJvbUNvbnRleHQgPSB0aGlzLm9wdGlvbnMuZnJvbUNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmZyb21Db250ZXh0ID0gbnVsbDtcclxuICAgICAgICBjb25zdCBlcnJvckl0ZW0gPSB7XHJcbiAgICAgICAgICBzZXJ2ZXJFcnJvcjogZXJyb3IsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgRXJyb3JNYW5hZ2VyLmFkZEVycm9yKHRoaXMuZ2V0RXJyb3JNZXNzYWdlKGVycm9yKSwgZXJyb3JJdGVtKTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZnJvbUNvbnRleHQgPSBmcm9tQ29udGV4dDtcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH0sXHJcbiAgICB9XTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5lcnJvckhhbmRsZXJzO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBSZXR1cm5zIHRoZSB2aWV3IGtleVxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gVmlldyBrZXlcclxuICAgKi9cclxuICBnZXRUYWc6IGZ1bmN0aW9uIGdldFRhZygpIHtcclxuICAgIGxldCB0YWcgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmVudHJ5ICYmIHRoaXMub3B0aW9ucy5lbnRyeVt0aGlzLmlkUHJvcGVydHldO1xyXG4gICAgaWYgKCF0YWcpIHtcclxuICAgICAgdGFnID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5rZXk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRhZztcclxuICB9LFxyXG4gIHByb2Nlc3NMYXlvdXQ6IGZ1bmN0aW9uIHByb2Nlc3NMYXlvdXQobGF5b3V0KSB7XHJcbiAgICBjb25zdCByb3dzID0gKGxheW91dC5jaGlsZHJlbiB8fCBsYXlvdXQuYXMgfHwgbGF5b3V0KTtcclxuICAgIGNvbnN0IHNlY3Rpb25RdWV1ZSA9IFtdO1xyXG4gICAgY29uc3QgY29udGVudCA9IFtdO1xyXG4gICAgbGV0IHNlY3Rpb25TdGFydGVkID0gZmFsc2U7XHJcbiAgICBsZXQgY3VycmVudDtcclxuXHJcbiAgICBpZiAoIWxheW91dC5vcHRpb25zKSB7XHJcbiAgICAgIGxheW91dC5vcHRpb25zID0ge1xyXG4gICAgICAgIHRpdGxlOiB0aGlzLmRldGFpbHNUZXh0LFxyXG4gICAgICB9O1xyXG4gICAgfVxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb3dzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGN1cnJlbnQgPSByb3dzW2ldO1xyXG5cclxuICAgICAgaWYgKGN1cnJlbnQuY2hpbGRyZW4gfHwgY3VycmVudC5hcykge1xyXG4gICAgICAgIGlmIChzZWN0aW9uU3RhcnRlZCkge1xyXG4gICAgICAgICAgc2VjdGlvblF1ZXVlLnB1c2goY3VycmVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc0xheW91dChjdXJyZW50KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXNlY3Rpb25TdGFydGVkKSB7XHJcbiAgICAgICAgc2VjdGlvblN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGNvbnRlbnQucHVzaCh0aGlzLnNlY3Rpb25CZWdpblRlbXBsYXRlLmFwcGx5KGxheW91dCwgdGhpcykpO1xyXG4gICAgICAgIGNvbnRlbnQucHVzaCgnPGRpdiBjbGFzcz1cInJvdyBlZGl0LXJvd1wiPicpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLmNyZWF0ZVJvd0NvbnRlbnQoY3VycmVudCwgY29udGVudCk7XHJcbiAgICB9XHJcbiAgICBjb250ZW50LnB1c2goJzwvZGl2PicpO1xyXG4gICAgY29udGVudC5wdXNoKHRoaXMuc2VjdGlvbkVuZFRlbXBsYXRlLmFwcGx5KGxheW91dCwgdGhpcykpO1xyXG4gICAgY29uc3Qgc2VjdGlvbk5vZGUgPSAkKGNvbnRlbnQuam9pbignJykpO1xyXG4gICAgc2VjdGlvbk5vZGUuYWNjb3JkaW9uKCk7XHJcbiAgICB0aGlzLm9uQXBwbHlTZWN0aW9uTm9kZShzZWN0aW9uTm9kZS5nZXQoMCksIGN1cnJlbnQpO1xyXG4gICAgJCh0aGlzLmNvbnRlbnROb2RlKS5hcHBlbmQoc2VjdGlvbk5vZGUpO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VjdGlvblF1ZXVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGN1cnJlbnQgPSBzZWN0aW9uUXVldWVbaV07XHJcblxyXG4gICAgICB0aGlzLnByb2Nlc3NMYXlvdXQoY3VycmVudCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBvbkFwcGx5U2VjdGlvbk5vZGU6IGZ1bmN0aW9uIG9uQXBwbHlTZWN0aW9uTm9kZSgvKiBzZWN0aW9uTm9kZSwgbGF5b3V0Ki8pIHt9LFxyXG4gIGNyZWF0ZVJvd0NvbnRlbnQ6IGZ1bmN0aW9uIGNyZWF0ZVJvd0NvbnRlbnQobGF5b3V0LCBjb250ZW50KSB7XHJcbiAgICBjb25zdCBDdG9yID0gRmllbGRNYW5hZ2VyLmdldChsYXlvdXQudHlwZSk7XHJcbiAgICBpZiAoQ3Rvcikge1xyXG4gICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW2xheW91dC5uYW1lIHx8IGxheW91dC5wcm9wZXJ0eV0gPSBuZXcgQ3RvcihsYW5nLm1peGluKHtcclxuICAgICAgICBvd25lcjogdGhpcyxcclxuICAgICAgfSwgbGF5b3V0KSk7XHJcblxyXG4gICAgICBjb25zdCB0ZW1wbGF0ZSA9IGZpZWxkLnByb3BlcnR5VGVtcGxhdGUgfHwgdGhpcy5wcm9wZXJ0eVRlbXBsYXRlO1xyXG5cclxuICAgICAgaWYgKGZpZWxkLmF1dG9Gb2N1cyAmJiAhdGhpcy5fZm9jdXNGaWVsZCkge1xyXG4gICAgICAgIHRoaXMuX2ZvY3VzRmllbGQgPSBmaWVsZDtcclxuICAgICAgfSBlbHNlIGlmIChmaWVsZC5hdXRvRm9jdXMgJiYgdGhpcy5fZm9jdXNGaWVsZCkge1xyXG4gICAgICAgIHRocm93IG5ldyBFcnJvcignT25seSBvbmUgZmllbGQgY2FuIGhhdmUgYXV0b0ZvY3VzIHNldCB0byB0cnVlIGluIHRoZSBFZGl0IGxheW91dC4nKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jb25uZWN0KGZpZWxkLCAnb25TaG93JywgdGhpcy5fb25TaG93RmllbGQpO1xyXG4gICAgICB0aGlzLmNvbm5lY3QoZmllbGQsICdvbkhpZGUnLCB0aGlzLl9vbkhpZGVGaWVsZCk7XHJcbiAgICAgIHRoaXMuY29ubmVjdChmaWVsZCwgJ29uRW5hYmxlJywgdGhpcy5fb25FbmFibGVGaWVsZCk7XHJcbiAgICAgIHRoaXMuY29ubmVjdChmaWVsZCwgJ29uRGlzYWJsZScsIHRoaXMuX29uRGlzYWJsZUZpZWxkKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLm11bHRpQ29sdW1uVmlldykge1xyXG4gICAgICAgIGxldCBoaWRkZW4gPSAnJztcclxuICAgICAgICBpZiAoZmllbGQudHlwZSA9PT0gJ2hpZGRlbicpIHtcclxuICAgICAgICAgIGhpZGRlbiA9ICdkaXNwbGF5LW5vbmUnO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250ZW50LnB1c2goYDxkaXYgY2xhc3M9XCIke3RoaXMubXVsdGlDb2x1bW5DbGFzc30gY29sdW1ucyAke2hpZGRlbn1cIj5gKTtcclxuICAgICAgfVxyXG4gICAgICBjb250ZW50LnB1c2godGVtcGxhdGUuYXBwbHkoZmllbGQsIHRoaXMpKTtcclxuICAgICAgaWYgKHRoaXMubXVsdGlDb2x1bW5WaWV3KSB7XHJcbiAgICAgICAgY29udGVudC5wdXNoKCc8L2Rpdj4nKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhdGVzIHRoZSByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIHJlcXVlc3REYXRhOiBmdW5jdGlvbiByZXF1ZXN0RGF0YSgpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcblxyXG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJlcXVlc3REYXRhVXNpbmdNb2RlbCgpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLl9vbkdldENvbXBsZXRlKGRhdGEpO1xyXG4gICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fb25HZXRFcnJvcihudWxsLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoc3RvcmUpIHtcclxuICAgICAgY29uc3QgZ2V0T3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgdGhpcy5fYXBwbHlTdGF0ZVRvR2V0T3B0aW9ucyhnZXRPcHRpb25zKTtcclxuXHJcbiAgICAgIGNvbnN0IGdldEV4cHJlc3Npb24gPSB0aGlzLl9idWlsZEdldEV4cHJlc3Npb24oKSB8fCBudWxsO1xyXG4gICAgICBjb25zdCBnZXRSZXN1bHRzID0gdGhpcy5yZXF1ZXN0RGF0YVVzaW5nU3RvcmUoZ2V0RXhwcmVzc2lvbiwgZ2V0T3B0aW9ucyk7XHJcblxyXG4gICAgICB3aGVuKGdldFJlc3VsdHMsXHJcbiAgICAgICAgdGhpcy5fb25HZXRDb21wbGV0ZS5iaW5kKHRoaXMpLFxyXG4gICAgICAgIHRoaXMuX29uR2V0RXJyb3IuYmluZCh0aGlzLCBnZXRPcHRpb25zKVxyXG4gICAgICApO1xyXG5cclxuICAgICAgcmV0dXJuIGdldFJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc29sZS53YXJuKCdFcnJvciByZXF1ZXN0aW5nIGRhdGEsIG5vIG1vZGVsIG9yIHN0b3JlIHdhcyBkZWZpbmVkLiBEaWQgeW91IG1lYW4gdG8gbWl4aW4gX1NEYXRhRWRpdE1peGluIHRvIHlvdXIgZWRpdCB2aWV3PycpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgfSxcclxuICByZXF1ZXN0RGF0YVVzaW5nTW9kZWw6IGZ1bmN0aW9uIHJlcXVlc3REYXRhVXNpbmdNb2RlbCgpIHtcclxuICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXRFbnRyeSh0aGlzLm9wdGlvbnMpO1xyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGFVc2luZ1N0b3JlOiBmdW5jdGlvbiByZXF1ZXN0RGF0YVVzaW5nU3RvcmUoZ2V0RXhwcmVzc2lvbiwgZ2V0T3B0aW9ucykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuICAgIHJldHVybiBzdG9yZS5nZXQoZ2V0RXhwcmVzc2lvbiwgZ2V0T3B0aW9ucyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBMb29wcyBhbGwgdGhlIGZpZWxkcyBsb29raW5nIGZvciBhbnkgd2l0aCB0aGUgYGRlZmF1bHRgIHByb3BlcnR5IHNldCwgaWYgc2V0IGFwcGx5IHRoYXRcclxuICAgKiB2YWx1ZSBhcyB0aGUgaW5pdGlhbCB2YWx1ZSBvZiB0aGUgZmllbGQuIElmIHRoZSB2YWx1ZSBpcyBhIGZ1bmN0aW9uLCBpdHMgZXhwYW5kZWQgdGhlbiBhcHBsaWVkLlxyXG4gICAqL1xyXG4gIGFwcGx5RmllbGREZWZhdWx0czogZnVuY3Rpb24gYXBwbHlGaWVsZERlZmF1bHRzKCkge1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHRoaXMuZmllbGRzKSB7XHJcbiAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5maWVsZHNbbmFtZV07XHJcbiAgICAgICAgY29uc3QgZGVmYXVsdFZhbHVlID0gZmllbGQuZGVmYXVsdDtcclxuXHJcbiAgICAgICAgaWYgKHR5cGVvZiBkZWZhdWx0VmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZpZWxkLnNldFZhbHVlKHRoaXMuZXhwYW5kRXhwcmVzc2lvbihkZWZhdWx0VmFsdWUsIGZpZWxkKSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIExvb3BzIGFsbCBmaWVsZHMgYW5kIGNhbGxzIGl0cyBgY2xlYXJWYWx1ZSgpYC5cclxuICAgKi9cclxuICBjbGVhclZhbHVlczogZnVuY3Rpb24gY2xlYXJWYWx1ZXMoKSB7XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5maWVsZHMpIHtcclxuICAgICAgaWYgKHRoaXMuZmllbGRzLmhhc093blByb3BlcnR5KG5hbWUpKSB7XHJcbiAgICAgICAgdGhpcy5maWVsZHNbbmFtZV0uY2xlYXJWYWx1ZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBnaXZlbiB2YWx1ZXMgYnkgbG9vcGluZyB0aGUgZmllbGRzIGFuZCBjaGVja2luZyBpZiB0aGUgZmllbGQgcHJvcGVydHkgbWF0Y2hlc1xyXG4gICAqIGEga2V5IGluIHRoZSBwYXNzZWQgdmFsdWVzIG9iamVjdCAoYWZ0ZXIgY29uc2lkZXJpbmcgYSBmaWVsZHMgYGFwcGx5VG9gKS5cclxuICAgKlxyXG4gICAqIFRoZSB2YWx1ZSBzZXQgaXMgdGhlbiBwYXNzZWQgdGhlIGluaXRpYWwgc3RhdGUsIHRydWUgZm9yIGRlZmF1bHQvdW5tb2RpZmllZC9jbGVhbiBhbmQgZmFsc2VcclxuICAgKiBmb3IgZGlydHkgb3IgYWx0ZXJlZC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSB2YWx1ZXMgZGF0YSBlbnRyeSwgb3IgY29sbGVjdGlvbiBvZiBrZXkvdmFsdWVzIHdoZXJlIGtleSBtYXRjaGVzIGEgZmllbGRzIHByb3BlcnR5IGF0dHJpYnV0ZVxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gaW5pdGlhbCBJbml0aWFsIHN0YXRlIG9mIHRoZSB2YWx1ZSwgdHJ1ZSBmb3IgY2xlYW4sIGZhbHNlIGZvciBkaXJ0eVxyXG4gICAqL1xyXG4gIHNldFZhbHVlczogZnVuY3Rpb24gc2V0VmFsdWVzKHZhbHVlcywgaW5pdGlhbCkge1xyXG4gICAgY29uc3Qgbm9WYWx1ZSA9IHt9O1xyXG5cclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiB0aGlzLmZpZWxkcykge1xyXG4gICAgICBpZiAodGhpcy5maWVsZHMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW25hbWVdO1xyXG4gICAgICAgIGxldCB2YWx1ZTtcclxuICAgICAgICAvLyBmb3Igbm93LCBleHBsaWNpdGx5IGhpZGRlbiBmaWVsZHMgKHZpYS4gdGhlIGZpZWxkLmhpZGUoKSBtZXRob2QpIGFyZSBub3QgaW5jbHVkZWRcclxuICAgICAgICBpZiAoZmllbGQuaXNIaWRkZW4oKSkge1xyXG4gICAgICAgICAgY29udGludWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZmllbGQuYXBwbHlUbyAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgIHZhbHVlID0gdXRpbGl0eS5nZXRWYWx1ZSh2YWx1ZXMsIGZpZWxkLmFwcGx5VG8sIG5vVmFsdWUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB2YWx1ZSA9IHV0aWxpdHkuZ2V0VmFsdWUodmFsdWVzLCBmaWVsZC5wcm9wZXJ0eSB8fCBuYW1lLCBub1ZhbHVlKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZ5aTogdXNlcyB0aGUgZmFjdCB0aGF0ICh7fSAhPT0ge30pXHJcbiAgICAgICAgaWYgKHZhbHVlICE9PSBub1ZhbHVlKSB7XHJcbiAgICAgICAgICBmaWVsZC5zZXRWYWx1ZSh2YWx1ZSwgaW5pdGlhbCk7XHJcbiAgICAgICAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdyb3ctZXJyb3InKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHJpZXZlcyB0aGUgdmFsdWUgZnJvbSBldmVyeSBmaWVsZCwgc2tpcHBpbmcgdGhlIG9uZXMgZXhjbHVkZWQsIGFuZCBtZXJnZXMgdGhlbSBpbnRvIGFcclxuICAgKiBzaW5nbGUgcGF5bG9hZCB3aXRoIHRoZSBrZXkgYmVpbmcgdGhlIGZpZWxkcyBgcHJvcGVydHlgIGF0dHJpYnV0ZSwgdGFraW5nIGludG8gY29uc2lkZXJhdGlvbiBgYXBwbHlUb2AgaWYgZGVmaW5lZC5cclxuICAgKlxyXG4gICAqIElmIGFsbCBpcyBwYXNzZWQgYXMgdHJ1ZSwgaXQgYWxzbyBncmFicyBoaWRkZW4gYW5kIHVubW9kaWZpZWQgKGNsZWFuKSB2YWx1ZXMuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbCBUcnVlIHRvIGFsc28gaW5jbHVkZSBoaWRkZW4gYW5kIHVubW9kaWZpZWQgdmFsdWVzLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gQSBzaW5nbGUgb2JqZWN0IHBheWxvYWQgd2l0aCBhbGwgdGhlIHZhbHVlcy5cclxuICAgKi9cclxuICBnZXRWYWx1ZXM6IGZ1bmN0aW9uIGdldFZhbHVlcyhhbGwpIHtcclxuICAgIGNvbnN0IHBheWxvYWQgPSB7fTtcclxuICAgIGxldCBlbXB0eSA9IHRydWU7XHJcblxyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHRoaXMuZmllbGRzKSB7XHJcbiAgICAgIGlmICh0aGlzLmZpZWxkcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgIGNvbnN0IGZpZWxkID0gdGhpcy5maWVsZHNbbmFtZV07XHJcbiAgICAgICAgY29uc3QgdmFsdWUgPSBmaWVsZC5nZXRWYWx1ZSgpO1xyXG5cclxuICAgICAgICBjb25zdCBpbmNsdWRlID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGZpZWxkLmluY2x1ZGUsIHZhbHVlLCBmaWVsZCwgdGhpcyk7XHJcbiAgICAgICAgY29uc3QgZXhjbHVkZSA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihmaWVsZC5leGNsdWRlLCB2YWx1ZSwgZmllbGQsIHRoaXMpO1xyXG5cclxuICAgICAgICAvKipcclxuICAgICAgICAgKiBpbmNsdWRlOlxyXG4gICAgICAgICAqICAgdHJ1ZTogYWx3YXlzIGluY2x1ZGUgdmFsdWVcclxuICAgICAgICAgKiAgIGZhbHNlOiBhbHdheXMgZXhjbHVkZSB2YWx1ZVxyXG4gICAgICAgICAqIGV4Y2x1ZGU6XHJcbiAgICAgICAgICogICB0cnVlOiBhbHdheXMgZXhjbHVkZSB2YWx1ZVxyXG4gICAgICAgICAqICAgZmFsc2U6IGRlZmF1bHQgaGFuZGxpbmdcclxuICAgICAgICAgKi9cclxuICAgICAgICBpZiAoaW5jbHVkZSAhPT0gdW5kZWZpbmVkICYmICFpbmNsdWRlKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGV4Y2x1ZGUgIT09IHVuZGVmaW5lZCAmJiBleGNsdWRlKSB7XHJcbiAgICAgICAgICBjb250aW51ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIGZvciBub3csIGV4cGxpY2l0bHkgaGlkZGVuIGZpZWxkcyAodmlhLiB0aGUgZmllbGQuaGlkZSgpIG1ldGhvZCkgYXJlIG5vdCBpbmNsdWRlZFxyXG4gICAgICAgIGlmIChhbGwgfHwgKChmaWVsZC5hbHdheXNVc2VWYWx1ZSB8fCBmaWVsZC5pc0RpcnR5KCkgfHwgaW5jbHVkZSkgJiYgIWZpZWxkLmlzSGlkZGVuKCkpKSB7XHJcbiAgICAgICAgICBpZiAoZmllbGQuYXBwbHlUbyAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYgKHR5cGVvZiBmaWVsZC5hcHBseVRvID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpIHtcclxuICAgICAgICAgICAgICAgIC8vIENvcHkgdGhlIHZhbHVlIHByb3BlcnRpZXMgaW50byBvdXIgcGF5bG9hZCBvYmplY3RcclxuICAgICAgICAgICAgICAgIGZvciAoY29uc3QgcHJvcCBpbiB2YWx1ZSkge1xyXG4gICAgICAgICAgICAgICAgICBpZiAodmFsdWUuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgICAgICAgICAgICBwYXlsb2FkW3Byb3BdID0gdmFsdWVbcHJvcF07XHJcbiAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgIGZpZWxkLmFwcGx5VG8ocGF5bG9hZCwgdmFsdWUpO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYgKHR5cGVvZiBmaWVsZC5hcHBseVRvID09PSAnc3RyaW5nJykge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHRhcmdldCA9IHV0aWxpdHkuZ2V0VmFsdWUocGF5bG9hZCwgZmllbGQuYXBwbHlUbyk7XHJcbiAgICAgICAgICAgICAgbGFuZy5taXhpbih0YXJnZXQsIHZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdXRpbGl0eS5zZXRWYWx1ZShwYXlsb2FkLCBmaWVsZC5wcm9wZXJ0eSB8fCBuYW1lLCB2YWx1ZSk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgZW1wdHkgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBlbXB0eSA/IGZhbHNlIDogcGF5bG9hZDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIExvb3BzIGFuZCBnYXRoZXJzIHRoZSB2YWxpZGF0aW9uIGVycm9ycyByZXR1cm5lZCBmcm9tIGVhY2ggZmllbGQgYW5kIGFkZHMgdGhlbSB0byB0aGVcclxuICAgKiB2YWxpZGF0aW9uIHN1bW1hcnkgYXJlYS4gSWYgbm8gZXJyb3JzLCByZW1vdmVzIHRoZSB2YWxpZGF0aW9uIHN1bW1hcnkuXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbi9PYmplY3RbXX0gUmV0dXJucyB0aGUgYXJyYXkgb2YgZXJyb3JzIGlmIHByZXNlbnQgb3IgZmFsc2UgZm9yIG5vIGVycm9ycy5cclxuICAgKi9cclxuICB2YWxpZGF0ZTogZnVuY3Rpb24gdmFsaWRhdGUoKSB7XHJcbiAgICB0aGlzLmVycm9ycyA9IFtdO1xyXG5cclxuICAgIGZvciAoY29uc3QgbmFtZSBpbiB0aGlzLmZpZWxkcykge1xyXG4gICAgICBpZiAodGhpcy5maWVsZHMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICBjb25zdCBmaWVsZCA9IHRoaXMuZmllbGRzW25hbWVdO1xyXG5cclxuICAgICAgICBjb25zdCByZXN1bHQgPSBmaWVsZC52YWxpZGF0ZSgpO1xyXG4gICAgICAgIGlmICghZmllbGQuaXNIaWRkZW4oKSAmJiByZXN1bHQgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAkKGZpZWxkLmNvbnRhaW5lck5vZGUpLmFkZENsYXNzKCdyb3ctZXJyb3InKTtcclxuXHJcbiAgICAgICAgICB0aGlzLmVycm9ycy5wdXNoKHtcclxuICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgbWVzc2FnZTogcmVzdWx0LFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoZmllbGQuY29udGFpbmVyTm9kZSkucmVtb3ZlQ2xhc3MoJ3Jvdy1lcnJvcicpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmVycm9ycy5sZW5ndGggPiAwID8gdGhpcy5lcnJvcnMgOiBmYWxzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgdGhlIGZvcm0gaXMgY3VycmVudGx5IGJ1c3kvZGlzYWJsZWRcclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGlzRm9ybURpc2FibGVkOiBmdW5jdGlvbiBpc0Zvcm1EaXNhYmxlZCgpIHtcclxuICAgIHJldHVybiB0aGlzLmJ1c3k7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEaXNhYmxlcyB0aGUgZm9ybSBieSBzZXR0aW5nIGJ1c3kgdG8gdHJ1ZSBhbmQgZGlzYWJsaW5nIHRoZSB0b29sYmFyLlxyXG4gICAqL1xyXG4gIGRpc2FibGU6IGZ1bmN0aW9uIGRpc2FibGUoKSB7XHJcbiAgICB0aGlzLmJ1c3kgPSB0cnVlO1xyXG5cclxuICAgIGlmIChBcHAuYmFycy50YmFyKSB7XHJcbiAgICAgIEFwcC5iYXJzLnRiYXIuZGlzYWJsZVRvb2woJ3NhdmUnKTtcclxuICAgIH1cclxuXHJcbiAgICAkKCdib2R5JykuYWRkQ2xhc3MoJ2J1c3knKTsvLyBUT0RPOiBNYWtlIHRoaXMgdGhlIHJvb3QvYXBwIGNvbnRhaW5lciBub2RlXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFbmFibGVzIHRoZSBmb3JtIGJ5IHNldHRpbmcgYnVzeSB0byBmYWxzZSBhbmQgZW5hYmxpbmcgdGhlIHRvb2xiYXJcclxuICAgKi9cclxuICBlbmFibGU6IGZ1bmN0aW9uIGVuYWJsZSgpIHtcclxuICAgIHRoaXMuYnVzeSA9IGZhbHNlO1xyXG5cclxuICAgIGlmIChBcHAuYmFycy50YmFyKSB7XHJcbiAgICAgIEFwcC5iYXJzLnRiYXIuZW5hYmxlVG9vbCgnc2F2ZScpO1xyXG4gICAgfVxyXG5cclxuICAgICQoJ2JvZHknKS5yZW1vdmVDbGFzcygnYnVzeScpOy8vIFRPRE86IE1ha2UgdGhpcyB0aGUgcm9vdC9hcHAgY29udGFpbmVyIG5vZGVcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBieSBzYXZlKCkgd2hlbiBwZXJmb3JtaW5nIGFuIGluc2VydCAoY3JlYXRlKS5cclxuICAgKiBHYXRoZXJzIHRoZSB2YWx1ZXMsIGNyZWF0ZXMgdGhlIHBheWxvYWQgZm9yIGluc2VydCwgY3JlYXRlcyB0aGUgc2RhdGEgcmVxdWVzdCBhbmRcclxuICAgKiBjYWxscyBgY3JlYXRlYC5cclxuICAgKi9cclxuICBpbnNlcnQ6IGZ1bmN0aW9uIGluc2VydCgpIHtcclxuICAgIHRoaXMuZGlzYWJsZSgpO1xyXG5cclxuICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMuZ2V0VmFsdWVzKCk7XHJcbiAgICBpZiAodmFsdWVzKSB7XHJcbiAgICAgIHRoaXMub25JbnNlcnQodmFsdWVzKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIFJlVUkuYmFjaygpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb25JbnNlcnQ6IGZ1bmN0aW9uIG9uSW5zZXJ0KHZhbHVlcykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuICAgIGNvbnN0IGFkZE9wdGlvbnMgPSB7XHJcbiAgICAgIG92ZXJ3cml0ZTogZmFsc2UsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgZW50cnkgPSB0aGlzLmNyZWF0ZUVudHJ5Rm9ySW5zZXJ0KHZhbHVlcyk7XHJcbiAgICB0aGlzLl9hcHBseVN0YXRlVG9BZGRPcHRpb25zKGFkZE9wdGlvbnMpO1xyXG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XHJcbiAgICAgIHRoaXMuX21vZGVsLmluc2VydEVudHJ5KGVudHJ5LCBhZGRPcHRpb25zKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5vbkFkZENvbXBsZXRlKGVudHJ5LCBkYXRhKTtcclxuICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgIHRoaXMub25BZGRFcnJvcihhZGRPcHRpb25zLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoc3RvcmUpIHtcclxuICAgICAgd2hlbihzdG9yZS5hZGQoZW50cnksIGFkZE9wdGlvbnMpLFxyXG4gICAgICAgIHRoaXMub25BZGRDb21wbGV0ZS5iaW5kKHRoaXMsIGVudHJ5KSxcclxuICAgICAgICB0aGlzLm9uQWRkRXJyb3IuYmluZCh0aGlzLCBhZGRPcHRpb25zKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgX2FwcGx5U3RhdGVUb0FkZE9wdGlvbnM6IGZ1bmN0aW9uIF9hcHBseVN0YXRlVG9BZGRPcHRpb25zKC8qIGFkZE9wdGlvbnMqLykge30sXHJcbiAgb25BZGRDb21wbGV0ZTogZnVuY3Rpb24gb25BZGRDb21wbGV0ZShlbnRyeSwgcmVzdWx0KSB7XHJcbiAgICB0aGlzLmVuYWJsZSgpO1xyXG5cclxuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9idWlsZFJlZnJlc2hNZXNzYWdlKGVudHJ5LCByZXN1bHQpO1xyXG4gICAgY29ubmVjdC5wdWJsaXNoKCcvYXBwL3JlZnJlc2gnLCBbbWVzc2FnZV0pO1xyXG5cclxuICAgIHRoaXMub25JbnNlcnRDb21wbGV0ZWQocmVzdWx0KTtcclxuICB9LFxyXG4gIG9uQWRkRXJyb3I6IGZ1bmN0aW9uIG9uQWRkRXJyb3IoYWRkT3B0aW9ucywgZXJyb3IpIHtcclxuICAgIHRoaXMuZW5hYmxlKCk7XHJcbiAgICB0aGlzLmhhbmRsZUVycm9yKGVycm9yKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGluc2VydCBjb21wbGV0ZSwgY2hlY2tzIGZvciBgdGhpcy5vcHRpb25zLnJldHVyblRvYCBlbHNlIGl0IHNpbXBseSBnb2VzIGJhY2suXHJcbiAgICogQHBhcmFtIGVudHJ5XHJcbiAgICovXHJcbiAgb25JbnNlcnRDb21wbGV0ZWQ6IGZ1bmN0aW9uIG9uSW5zZXJ0Q29tcGxldGVkKC8qIGVudHJ5Ki8pIHtcclxuICAgIC8vIHJldHVyblRvIGlzIGhhbmRsZWQgYnkgUmVVSSBiYWNrXHJcbiAgICBSZVVJLmJhY2soKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBieSBzYXZlKCkgd2hlbiBwZXJmb3JtaW5nIGFuIHVwZGF0ZSAoZWRpdCkuXHJcbiAgICogR2F0aGVycyB0aGUgdmFsdWVzLCBjcmVhdGVzIHRoZSBwYXlsb2FkIGZvciB1cGRhdGUsIGNyZWF0ZXMgdGhlIHNkYXRhIHJlcXVlc3QgYW5kXHJcbiAgICogY2FsbHMgYHVwZGF0ZWAuXHJcbiAgICovXHJcbiAgdXBkYXRlOiBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLmdldFZhbHVlcygpO1xyXG4gICAgaWYgKHZhbHVlcykge1xyXG4gICAgICB0aGlzLmRpc2FibGUoKTtcclxuICAgICAgdGhpcy5vblVwZGF0ZSh2YWx1ZXMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5vblVwZGF0ZUNvbXBsZXRlZChmYWxzZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBvblVwZGF0ZTogZnVuY3Rpb24gb25VcGRhdGUodmFsdWVzKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0KCdzdG9yZScpO1xyXG4gICAgY29uc3QgcHV0T3B0aW9ucyA9IHtcclxuICAgICAgb3ZlcndyaXRlOiB0cnVlLFxyXG4gICAgfTtcclxuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5jcmVhdGVFbnRyeUZvclVwZGF0ZSh2YWx1ZXMpO1xyXG4gICAgdGhpcy5fYXBwbHlTdGF0ZVRvUHV0T3B0aW9ucyhwdXRPcHRpb25zKTtcclxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICB0aGlzLl9tb2RlbC51cGRhdGVFbnRyeShlbnRyeSwgcHV0T3B0aW9ucykudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMub25QdXRDb21wbGV0ZShlbnRyeSwgZGF0YSk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICB0aGlzLm9uUHV0RXJyb3IocHV0T3B0aW9ucywgZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHN0b3JlKSB7XHJcbiAgICAgIHdoZW4oc3RvcmUucHV0KGVudHJ5LCBwdXRPcHRpb25zKSxcclxuICAgICAgICB0aGlzLm9uUHV0Q29tcGxldGUuYmluZCh0aGlzLCBlbnRyeSksXHJcbiAgICAgICAgdGhpcy5vblB1dEVycm9yLmJpbmQodGhpcywgcHV0T3B0aW9ucylcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEdhdGhlcnMgdGhlIHZhbHVlcyBmb3IgdGhlIGVudHJ5IHRvIHNlbmQgYmFjayBhbmQgcmV0dXJucyB0aGUgYXBwcm9wcmlhdGUgcGF5bG9hZCBmb3JcclxuICAgKiBjcmVhdGluZyBvciB1cGRhdGluZy5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEVudHJ5L3BheWxvYWRcclxuICAgKi9cclxuICBjcmVhdGVJdGVtOiBmdW5jdGlvbiBjcmVhdGVJdGVtKCkge1xyXG4gICAgY29uc3QgdmFsdWVzID0gdGhpcy5nZXRWYWx1ZXMoKTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5pbnNlcnRpbmcgPyB0aGlzLmNyZWF0ZUVudHJ5Rm9ySW5zZXJ0KHZhbHVlcykgOiB0aGlzLmNyZWF0ZUVudHJ5Rm9yVXBkYXRlKHZhbHVlcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBUYWtlcyB0aGUgdmFsdWVzIG9iamVjdCBhbmQgYWRkcyB0aGUgbmVlZGVkIHByb3BlcnRpZXJzIGZvciB1cGRhdGluZy5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBPYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGZvciB1cGRhdGluZ1xyXG4gICAqL1xyXG4gIGNyZWF0ZUVudHJ5Rm9yVXBkYXRlOiBmdW5jdGlvbiBjcmVhdGVFbnRyeUZvclVwZGF0ZSh2YWx1ZXMpIHtcclxuICAgIHJldHVybiB0aGlzLmNvbnZlcnRWYWx1ZXModmFsdWVzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIHRoZSB2YWx1ZXMgb2JqZWN0IGFuZCBhZGRzIHRoZSBuZWVkZWQgcHJvcGVydGllcnMgZm9yIGNyZWF0aW5nL2luc2VydGluZy5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gdmFsdWVzXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBPYmplY3Qgd2l0aCBwcm9wZXJ0aWVzIGZvciBpbnNlcnRpbmdcclxuICAgKi9cclxuICBjcmVhdGVFbnRyeUZvckluc2VydDogZnVuY3Rpb24gY3JlYXRlRW50cnlGb3JJbnNlcnQodmFsdWVzKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb252ZXJ0VmFsdWVzKHZhbHVlcyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBGdW5jdGlvbiB0byBjYWxsIHRvIHRyYW5mb3JtIHZhbHVlcyBiZWZvcmUgc2F2ZVxyXG4gICAqL1xyXG4gIGNvbnZlcnRWYWx1ZXM6IGZ1bmN0aW9uIGNvbnZlcnRWYWx1ZXModmFsdWVzKSB7XHJcbiAgICByZXR1cm4gdmFsdWVzO1xyXG4gIH0sXHJcbiAgX2FwcGx5U3RhdGVUb1B1dE9wdGlvbnM6IGZ1bmN0aW9uIF9hcHBseVN0YXRlVG9QdXRPcHRpb25zKC8qIHB1dE9wdGlvbnMqLykge30sXHJcbiAgb25QdXRDb21wbGV0ZTogZnVuY3Rpb24gb25QdXRDb21wbGV0ZShlbnRyeSwgcmVzdWx0KSB7XHJcbiAgICB0aGlzLmVuYWJsZSgpO1xyXG5cclxuICAgIGNvbnN0IG1lc3NhZ2UgPSB0aGlzLl9idWlsZFJlZnJlc2hNZXNzYWdlKGVudHJ5LCByZXN1bHQpO1xyXG5cclxuICAgIGNvbm5lY3QucHVibGlzaCgnL2FwcC9yZWZyZXNoJywgW21lc3NhZ2VdKTtcclxuXHJcbiAgICB0aGlzLm9uVXBkYXRlQ29tcGxldGVkKHJlc3VsdCk7XHJcbiAgfSxcclxuICBvblB1dEVycm9yOiBmdW5jdGlvbiBvblB1dEVycm9yKHB1dE9wdGlvbnMsIGVycm9yKSB7XHJcbiAgICB0aGlzLmVuYWJsZSgpO1xyXG4gICAgdGhpcy5oYW5kbGVFcnJvcihlcnJvcik7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBBcnJheSBvZiBzdHJpbmdzIHRoYXQgd2lsbCBnZXQgaWdub3JlZCB3aGVuIHRoZSBkaWZmaW5nIHJ1bnMuXHJcbiAgICovXHJcbiAgZGlmZlByb3BlcnR5SWdub3JlczogW10sXHJcbiAgLyoqXHJcbiAgICogRGlmZnMgdGhlIHJlc3VsdHMgZnJvbSB0aGUgY3VycmVudCB2YWx1ZXMgYW5kIHRoZSBwcmV2aW91cyB2YWx1ZXMuXHJcbiAgICogVGhpcyBpcyBkb25lIGZvciBhIGNvbmN1cnJlbmN5IGNoZWNrIHRvIGluZGljYXRlIHdoYXQgaGFzIGNoYW5nZWQuXHJcbiAgICogQHJldHVybnMgQXJyYXkgTGlzdCBvZiBwcm9wZXJ0eSBuYW1lcyB0aGF0IGhhdmUgY2hhbmdlZFxyXG4gICAqL1xyXG4gIGRpZmZzOiBmdW5jdGlvbiBkaWZmcyhsZWZ0LCByaWdodCkge1xyXG4gICAgY29uc3QgYWNjID0gW107XHJcbiAgICBjb25zdCBESUZGX0VESVRFRCA9ICdFJztcclxuXHJcbiAgICBpZiAoRGVlcERpZmYpIHtcclxuICAgICAgY29uc3QgX2RpZmZzID0gRGVlcERpZmYuZGlmZihsZWZ0LCByaWdodCwgKHBhdGgsIGtleSkgPT4ge1xyXG4gICAgICAgIGlmICh0aGlzLmRpZmZQcm9wZXJ0eUlnbm9yZXMuaW5kZXhPZihrZXkpID49IDApIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICBpZiAoX2RpZmZzKSB7XHJcbiAgICAgICAgX2RpZmZzLmZvckVhY2goKGRpZmYpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHBhdGggPSBkaWZmLnBhdGguam9pbignLicpO1xyXG4gICAgICAgICAgaWYgKGRpZmYua2luZCA9PT0gRElGRl9FRElURUQgJiYgYWNjLmluZGV4T2YocGF0aCkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgIGFjYy5wdXNoKHBhdGgpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFjYztcclxuICB9LFxyXG4gIF9leHRyYWN0SWRQcm9wZXJ0eUZyb21FbnRyeTogZnVuY3Rpb24gX2V4dHJhY3RJZFByb3BlcnR5RnJvbUVudHJ5KGVudHJ5KSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0KCdzdG9yZScpO1xyXG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXRFbnRpdHlJZChlbnRyeSk7XHJcbiAgICB9IGVsc2UgaWYgKHN0b3JlKSB7XHJcbiAgICAgIHJldHVybiBzdG9yZS5nZXRJZGVudGl0eShlbnRyeSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICcnO1xyXG4gIH0sXHJcbiAgX2J1aWxkUmVmcmVzaE1lc3NhZ2U6IGZ1bmN0aW9uIF9idWlsZFJlZnJlc2hNZXNzYWdlKG9yaWdpbmFsRW50cnksIHJlc3BvbnNlKSB7XHJcbiAgICBpZiAob3JpZ2luYWxFbnRyeSkge1xyXG4gICAgICBjb25zdCBpZCA9IHRoaXMuX2V4dHJhY3RJZFByb3BlcnR5RnJvbUVudHJ5KG9yaWdpbmFsRW50cnkpO1xyXG4gICAgICByZXR1cm4ge1xyXG4gICAgICAgIGlkLFxyXG4gICAgICAgIGtleTogaWQsXHJcbiAgICAgICAgZGF0YTogcmVzcG9uc2UsXHJcbiAgICAgIH07XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB1cGRhdGUgY29tcGxldGUsIGNoZWNrcyBmb3IgYHRoaXMub3B0aW9ucy5yZXR1cm5Ub2AgZWxzZSBpdCBzaW1wbHkgZ29lcyBiYWNrLlxyXG4gICAqIEBwYXJhbSBlbnRyeVxyXG4gICAqL1xyXG4gIG9uVXBkYXRlQ29tcGxldGVkOiBmdW5jdGlvbiBvblVwZGF0ZUNvbXBsZXRlZCgvKiBlbnRyeSovKSB7XHJcbiAgICAvLyByZXR1cm5UbyBpcyBoYW5kbGVkIGJ5IFJlVUkgYmFja1xyXG4gICAgUmVVSS5iYWNrKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDcmVhdGVzIHRoZSBtYXJrdXAgYnkgYXBwbHlpbmcgdGhlIGB2YWxpZGF0aW9uU3VtbWFyeUl0ZW1UZW1wbGF0ZWAgdG8gZWFjaCBlbnRyeSBpbiBgdGhpcy5lcnJvcnNgXHJcbiAgICogdGhlbiBzZXRzIHRoZSBjb21iaW5lZCByZXN1bHQgaW50byB0aGUgc3VtbWFyeSB2YWxpZGF0aW9uIG5vZGUgYW5kIHNldHMgdGhlIHN0eWxpbmcgdG8gdmlzaWJsZVxyXG4gICAqL1xyXG4gIHNob3dWYWxpZGF0aW9uU3VtbWFyeTogZnVuY3Rpb24gc2hvd1ZhbGlkYXRpb25TdW1tYXJ5KCkge1xyXG4gICAgY29uc3QgY29udGVudCA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5lcnJvcnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29udGVudC5wdXNoKHRoaXMudmFsaWRhdGlvblN1bW1hcnlJdGVtVGVtcGxhdGUuYXBwbHkodGhpcy5lcnJvcnNbaV0sIHRoaXMuZmllbGRzW3RoaXMuZXJyb3JzW2ldLm5hbWVdKSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXQoJ3ZhbGlkYXRpb25Db250ZW50JywgY29udGVudC5qb2luKCcnKSk7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoJ3BhbmVsLWZvcm0tZXJyb3InKTtcclxuICB9LFxyXG4gIHNob3dDb25jdXJyZW5jeVN1bW1hcnk6IGZ1bmN0aW9uIHNob3dDb25jdXJyZW5jeVN1bW1hcnkoKSB7XHJcbiAgICBjb25zdCBjb250ZW50ID0gW107XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLmVycm9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb250ZW50LnB1c2godGhpcy5jb25jdXJyZW5jeVN1bW1hcnlJdGVtVGVtcGxhdGUuYXBwbHkodGhpcy5lcnJvcnNbaV0pKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnNldCgnY29uY3VycmVuY3lDb250ZW50JywgY29udGVudC5qb2luKCcnKSk7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoJ3BhbmVsLWZvcm0tY29uY3VycmVuY3ktZXJyb3InKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgdGhlIHN1bW1hcnkgdmFsaWRhdGlvbiB2aXNpYmxlIHN0eWxpbmcgYW5kIGVtcHRpZXMgaXRzIGNvbnRlbnRzIG9mIGVycm9yIG1hcmt1cFxyXG4gICAqL1xyXG4gIGhpZGVWYWxpZGF0aW9uU3VtbWFyeTogZnVuY3Rpb24gaGlkZVZhbGlkYXRpb25TdW1tYXJ5KCkge1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1mb3JtLWVycm9yJyk7XHJcbiAgICB0aGlzLnNldCgndmFsaWRhdGlvbkNvbnRlbnQnLCAnJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZW1vdmVzIHRlaCBzdW1tYXJ5IGZvciBjb25jdXJyZW5jeSBlcnJvcnNcclxuICAgKi9cclxuICBoaWRlQ29uY3VycmVuY3lTdW1tYXJ5OiBmdW5jdGlvbiBoaWRlQ29uY3VycmVuY3lTdW1tYXJ5KCkge1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1mb3JtLWNvbmN1cnJlbmN5LWVycm9yJyk7XHJcbiAgICB0aGlzLnNldCgnY29uY3VycmVuY3lDb250ZW50JywgJycpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdGhlIHNhdmUgdG9vbGJhciBhY3Rpb24uXHJcbiAgICpcclxuICAgKiBGaXJzdCB2YWxpZGF0ZXMgdGhlIGZvcm1zLCBzaG93aW5nIGVycm9ycyBhbmQgc3RvcGluZyBzYXZpbmcgaWYgZm91bmQuXHJcbiAgICogVGhlbiBjYWxscyBlaXRoZXIge0BsaW5rICNpbnNlcnQgaW5zZXJ0fSBvciB7QGxpbmsgI3VwZGF0ZSB1cGRhdGV9IGJhc2VkIHVwb24gYHRoaXMuaW5zZXJ0aW5nYC5cclxuICAgKlxyXG4gICAqL1xyXG4gIHNhdmU6IGZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgICBpZiAodGhpcy5pc0Zvcm1EaXNhYmxlZCgpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmhpZGVWYWxpZGF0aW9uU3VtbWFyeSgpO1xyXG4gICAgdGhpcy5oaWRlQ29uY3VycmVuY3lTdW1tYXJ5KCk7XHJcblxyXG4gICAgaWYgKHRoaXMudmFsaWRhdGUoKSAhPT0gZmFsc2UpIHtcclxuICAgICAgdGhpcy5zaG93VmFsaWRhdGlvblN1bW1hcnkoKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmluc2VydGluZykge1xyXG4gICAgICB0aGlzLmluc2VydCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy51cGRhdGUoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIGdldENvbnRleHQgZnVuY3Rpb24gdG8gYWxzbyBpbmNsdWRlIHRoZSBgcmVzb3VyY2VLaW5kYCBvZiB0aGUgdmlldywgYGluc2VydGBcclxuICAgKiBzdGF0ZSBhbmQgYGtleWAgb2YgdGhlIGVudHJ5IChmYWxzZSBpZiBpbnNlcnRpbmcpXHJcbiAgICovXHJcbiAgZ2V0Q29udGV4dDogZnVuY3Rpb24gZ2V0Q29udGV4dCgpIHtcclxuICAgIHJldHVybiBsYW5nLm1peGluKHRoaXMuaW5oZXJpdGVkKGdldENvbnRleHQsIGFyZ3VtZW50cyksIHtcclxuICAgICAgcmVzb3VyY2VLaW5kOiB0aGlzLnJlc291cmNlS2luZCxcclxuICAgICAgaW5zZXJ0OiB0aGlzLm9wdGlvbnMuaW5zZXJ0LFxyXG4gICAgICBrZXk6IHRoaXMub3B0aW9ucy5pbnNlcnQgPyBmYWxzZSA6IHRoaXMub3B0aW9ucy5rZXkgPyB0aGlzLm9wdGlvbnMua2V5IDogdGhpcy5vcHRpb25zLmVudHJ5ICYmIHRoaXMub3B0aW9ucy5lbnRyeVt0aGlzLmlkUHJvcGVydHldIC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogV3JhcHBlciBmb3IgZGV0ZWN0aW5nIHNlY3VyaXR5IGZvciB1cGRhdGUgbW9kZSBvciBpbnNlcnQgbW9kZVxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBhY2Nlc3MgQ2FuIGJlIGVpdGhlciBcInVwZGF0ZVwiIG9yIFwiaW5zZXJ0XCJcclxuICAgKi9cclxuICBnZXRTZWN1cml0eTogZnVuY3Rpb24gZ2V0U2VjdXJpdHkoYWNjZXNzKSB7XHJcbiAgICBjb25zdCBsb29rdXAgPSB7XHJcbiAgICAgIHVwZGF0ZTogdGhpcy51cGRhdGVTZWN1cml0eSxcclxuICAgICAgaW5zZXJ0OiB0aGlzLmluc2VydFNlY3VyaXR5LFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gbG9va3VwW2FjY2Vzc107XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIGJlZm9yZVRyYW5zaXRpb25UbyB0byBhZGQgdGhlIGxvYWRpbmcgc3R5bGluZyBpZiByZWZyZXNoIGlzIG5lZWRlZFxyXG4gICAqL1xyXG4gIGJlZm9yZVRyYW5zaXRpb25UbzogZnVuY3Rpb24gYmVmb3JlVHJhbnNpdGlvblRvKCkge1xyXG4gICAgaWYgKHRoaXMucmVmcmVzaFJlcXVpcmVkKSB7XHJcbiAgICAgIGlmICh0aGlzLm9wdGlvbnMuaW5zZXJ0ID09PSB0cnVlIHx8ICh0aGlzLm9wdGlvbnMua2V5ICYmICF0aGlzLm9wdGlvbnMuZW50cnkpKSB7XHJcbiAgICAgICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaGVyaXRlZChiZWZvcmVUcmFuc2l0aW9uVG8sIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBvblRyYW5zaXRpb25UbzogZnVuY3Rpb24gb25UcmFuc2l0aW9uVG8oKSB7XHJcbiAgICAvLyBGb2N1cyB0aGUgZGVmYXVsdCBmb2N1cyBmaWVsZCBpZiBpdCBleGlzdHMgYW5kIGl0IGhhcyBub3QgYWxyZWFkeSBiZWVuIGZvY3VzZWQuXHJcbiAgICAvLyBUaGlzIGZsYWcgaXMgaW1wb3J0YW50IGJlY2F1c2Ugb25UcmFuc2l0aW9uVG8gd2lsbCBmaXJlIG11bHRpcGxlIHRpbWVzIGlmIHRoZSB1c2VyIGlzIHVzaW5nIGxvb2t1cHMgYW5kIGVkaXRvciB0eXBlIGZpZWxkcyB0aGF0IHRyYW5zaXRpb24gYXdheSBmcm9tIHRoaXMgdmlldy5cclxuICAgIGlmICh0aGlzLl9mb2N1c0ZpZWxkICYmICF0aGlzLl9oYXNGb2N1c2VkKSB7XHJcbiAgICAgIHRoaXMuX2ZvY3VzRmllbGQuZm9jdXMoKTtcclxuICAgICAgdGhpcy5faGFzRm9jdXNlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmhlcml0ZWQob25UcmFuc2l0aW9uVG8sIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFbXB0aWVzIHRoZSBhY3RpdmF0ZSBtZXRob2Qgd2hpY2ggcHJldmVudHMgZGV0ZWN0aW9uIG9mIHJlZnJlc2ggZnJvbSB0cmFuc2l0aXRpb25pbmcuXHJcbiAgICpcclxuICAgKiBFeHRlcm5hbCBuYXZpZ2F0aW9uIChicm93c2VyIGJhY2svZm9yd2FyZCkgbmV2ZXIgcmVmcmVzaGVzIHRoZSBlZGl0IHZpZXcgYXMgaXQncyBhbHdheXMgYSB0ZXJtaW5hbCBsb29wLlxyXG4gICAqIGkuZS4geW91IG5ldmVyIG1vdmUgXCJmb3J3YXJkXCIgZnJvbSBhbiBlZGl0IHZpZXc7IHlvdSBuYXZpZ2F0ZSB0byBjaGlsZCBlZGl0b3JzLCBmcm9tIHdoaWNoIHlvdSBhbHdheXMgcmV0dXJuLlxyXG4gICAqL1xyXG4gIGFjdGl2YXRlOiBmdW5jdGlvbiBhY3RpdmF0ZSgpIHt9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgcmVmcmVzaFJlcXVpcmVkRm9yIHRvIHJldHVybiBmYWxzZSBpZiB3ZSBhbHJlYWR5IGhhdmUgdGhlIGtleSB0aGUgb3B0aW9ucyBpcyBwYXNzaW5nXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgTmF2aWdhdGlvbiBvcHRpb25zIGZyb20gcHJldmlvdXMgdmlld1xyXG4gICAqL1xyXG4gIHJlZnJlc2hSZXF1aXJlZEZvcjogZnVuY3Rpb24gcmVmcmVzaFJlcXVpcmVkRm9yKG9wdGlvbnMpIHtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcclxuICAgICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmtleSAmJiB0aGlzLm9wdGlvbnMua2V5ID09PSBvcHRpb25zLmtleSkge1xyXG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmluaGVyaXRlZChyZWZyZXNoUmVxdWlyZWRGb3IsIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZWZyZXNoIGZpcnN0IGNsZWFycyBvdXQgYW55IHZhcmlhYmxlcyBzZXQgdG8gcHJldmlvdXMgZGF0YS5cclxuICAgKlxyXG4gICAqIFRoZSBtb2RlIG9mIHRoZSBFZGl0IHZpZXcgaXMgc2V0IGFuZCBkZXRlcm1pbmVkIHZpYSBgdGhpcy5vcHRpb25zLmluc2VydGAsIGFuZCB0aGUgdmlld3MgdmFsdWVzIGFyZSBjbGVhcmVkLlxyXG4gICAqXHJcbiAgICogTGFzdGx5IGl0IG1ha2VzIHRoZSBhcHByb3BpYXRlIGRhdGEgcmVxdWVzdDpcclxuICAgKi9cclxuICByZWZyZXNoOiBmdW5jdGlvbiByZWZyZXNoKCkge1xyXG4gICAgdGhpcy5vblJlZnJlc2goKTtcclxuICAgIHRoaXMuZW50cnkgPSBmYWxzZTtcclxuICAgIHRoaXMuY2hhbmdlcyA9IGZhbHNlO1xyXG4gICAgdGhpcy5pbnNlcnRpbmcgPSAodGhpcy5vcHRpb25zLmluc2VydCA9PT0gdHJ1ZSk7XHJcbiAgICB0aGlzLl9oYXNGb2N1c2VkID0gZmFsc2U7XHJcblxyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1mb3JtLWVycm9yJyk7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWZvcm0tY29uY3VycmVuY3ktZXJyb3InKTtcclxuXHJcbiAgICB0aGlzLmNsZWFyVmFsdWVzKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuaW5zZXJ0aW5nKSB7XHJcbiAgICAgIHRoaXMub25SZWZyZXNoSW5zZXJ0KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLm9uUmVmcmVzaFVwZGF0ZSgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb25SZWZyZXNoOiBmdW5jdGlvbiBvblJlZnJlc2goKSB7fSxcclxuICBvblJlZnJlc2hJbnNlcnQ6IGZ1bmN0aW9uIG9uUmVmcmVzaEluc2VydCgpIHt9LFxyXG4gIG9uUmVmcmVzaFVwZGF0ZTogZnVuY3Rpb24gb25SZWZyZXNoVXBkYXRlKCkge1xyXG4gICAgLy8gYXBwbHkgYXMgbm9uLW1vZGlmaWVkIGRhdGFcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuZW50cnkpIHtcclxuICAgICAgdGhpcy5wcm9jZXNzRGF0YSh0aGlzLm9wdGlvbnMuZW50cnkpO1xyXG5cclxuICAgICAgLy8gYXBwbHkgY2hhbmdlcyBhcyBtb2RpZmllZCBkYXRhLCBzaW5jZSB3ZSB3YW50IHRoaXMgdG8gZmVlZC1iYWNrIHRocm91Z2hcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5jaGFuZ2VzKSB7XHJcbiAgICAgICAgdGhpcy5jaGFuZ2VzID0gdGhpcy5vcHRpb25zLmNoYW5nZXM7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZXModGhpcy5jaGFuZ2VzKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gaWYga2V5IGlzIHBhc3NlZCByZXF1ZXN0IHRoYXQga2V5cyBlbnRpdHkgYW5kIHByb2Nlc3NcclxuICAgICAgaWYgKHRoaXMub3B0aW9ucy5rZXkpIHtcclxuICAgICAgICB0aGlzLnJlcXVlc3REYXRhKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGdldFJvdXRlOiBmdW5jdGlvbiBnZXRSb3V0ZSgpIHtcclxuICAgIHJldHVybiBgJHt0aGlzLmlkfS86a2V5P2A7XHJcbiAgfSxcclxuICBidWlsZFJvdXRlOiBmdW5jdGlvbiBidWlsZFJvdXRlKCkge1xyXG4gICAgY29uc3QgcGFydHMgPSBbXTtcclxuICAgIGNvbnN0IGlkID0gdGhpcy5pZDtcclxuICAgIHBhcnRzLnB1c2goaWQpO1xyXG5cclxuICAgIGNvbnN0IGtleSA9IHRoaXMuZ2V0VGFnKCkgfHwgKHRoaXMuZW50cnkgJiYgdGhpcy5lbnRyeVt0aGlzLmlkUHJvcGVydHldKTtcclxuICAgIGlmIChrZXkpIHtcclxuICAgICAgcGFydHMucHVzaChrZXkpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwYXJ0cy5qb2luKCcvJyk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=