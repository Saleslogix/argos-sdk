define('argos/_DetailBase', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/when', 'dojo/_base/connect', './Format', './Utility', './ErrorManager', './View', './TabWidget', './I18n', 'dojo/string'], function (module, exports, _declare, _lang, _when, _connect, _Format, _Utility, _ErrorManager, _View, _TabWidget, _I18n, _string) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _when2 = _interopRequireDefault(_when);

  var _connect2 = _interopRequireDefault(_connect);

  var _Format2 = _interopRequireDefault(_Format);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  var _View2 = _interopRequireDefault(_View);

  var _TabWidget2 = _interopRequireDefault(_TabWidget);

  var _I18n2 = _interopRequireDefault(_I18n);

  var _string2 = _interopRequireDefault(_string);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('detailBase');

  /**
   * @class argos._DetailBase
   * @classdesc A Detail View represents a single record and should display all the info the user may need about the entry.
   *
   * A Detail entry is identified by its key (idProperty) which is how it requests the data via the endpoint.
   *
   * @extends argos.View
   * @requires argos.Format
   * @requires argos.Utility
   * @requires argos.ErrorManager
   */
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

  var __class = (0, _declare2.default)('argos._DetailBase', [_View2.default, _TabWidget2.default], /** @lends argos._DetailBase# */{
    /**
     * @property {Object}
     * Creates a setter map to html nodes, namely:
     *
     * * detailContent => contentNode's innerHTML
     *
     */
    attributeMap: {
      detailContent: {
        node: 'contentNode',
        type: 'innerHTML'
      },
      title: _View2.default.prototype.attributeMap.title,
      selected: _View2.default.prototype.attributeMap.selected
    },
    /**
     * @property {Simplate}
     * The template used to render the view's main DOM element when the view is initialized.
     * This template includes loadingTemplate.
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
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" data-title="{%= $.titleText %}" class="detail panel scrollable {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>', '{%! $.loadingTemplate %}', '{%! $.quickActionTemplate %}', '<div data-dojo-attach-point="contentNode" class="column">', '{%! $.tabContentTemplate %}', '</div>', '</div>']),
    /**
     * @property {Simplate}
     * HTML shown when no data is available.
     */
    emptyTemplate: new Simplate([]),
    /**
     * @property {Simplate}
     * HTML shown when data is being loaded.
     *
     * `$` => the view instance
     */
    loadingTemplate: new Simplate(['<div class="panel-loading-indicator">', '<div class="busy-indicator-container blocked-ui" aria-live="polite">', '<div class="busy-indicator active">', '<div class="bar one"></div>', '<div class="bar two"></div>', '<div class="bar three"></div>', '<div class="bar four"></div>', '<div class="bar five"></div>', '</div>', '<span>{%: $.loadingText %}</span>', '</div>', '</div>']),
    /**
     * @property {Simplate}
     * HTML that creates the quick action list
     */
    quickActionTemplate: new Simplate(['<div class="quick-actions" data-dojo-attach-point="quickActions"></div>']),
    /**
     * @property {Simplate}
     * HTML that creates the detail header displaying information about the tab list
     *
     * `$` => the view instance
     */
    detailHeaderTemplate: new Simplate(['<div class="detail-header">', '{%: $.value %}', '</div>']),
    /**
     * @property {Simplate}
     * HTML that starts a new section
     *
     * `$` => the view instance
     */
    sectionBeginTemplate: new Simplate(['{% if (!$$.isTabbed) { %}', '<h2 data-action="toggleSection" class="{% if ($.collapsed || $.options.collapsed) { %}collapsed{% } %}">', '<button class="{% if ($.collapsed) { %}{%: $$.toggleExpandClass %}{% } else { %}{%: $$.toggleCollapseClass %}{% } %}" aria-label="{%: $$.toggleCollapseText %}"></button>', '{%: ($.title || $.options.title) %}', '</h2>', '{% } %}', '{% if ($.list || $.options.list) { %}', '{% if ($.cls || $.options.cls) { %}', '<ul class="{%= ($.cls || $.options.cls) %}" id="{%: $$.id %}_{%: $.name %}">', '{% } else { %}', '<ul class="detailContent tab-panel listview" id="{%: $$.id %}_{%: $.name %}">', '{% } %}', '{% } else { %}', '{% if ($.cls || $.options.cls) { %}', '<div class="tab-panel {%= ($.cls || $.options.cls) %}" id="{%: $$.id %}_{%: $.name %}">', '{% } else { %}', '<div class="detailContent tab-panel summary-form" id="{%: $$.id %}_{%: $.name %}">', '{% } %}', '{% } %}']),
    /**
     * @property {Simplate}
     * HTML that ends a section
     *
     * `$` => the view instance
     */
    sectionEndTemplate: new Simplate(['{% if ($.list || $.options.list) { %}', '</ul>', '{% } else { %}', '</div>', '{% } %}']),
    /**
     * @property {Simplate}
     * HTML that is used for a property in the detail layout
     *
     * * `$` => detail layout row
     * * `$$` => view instance
     */
    propertyTemplate: new Simplate(['<div class="{%= $$.multiColumnClass %} columns{%= $.cls %}" data-property="{%= $.property || $.name %}">', '<label>{%: $.label %}</label>', '<span class="data">{%= $.value %}</span>', // todo: create a way to allow the value to not be surrounded with a span tag
    '</div>']),
    /**
     * @property {Simplate}
     * HTML that is used for detail layout items that point to related views, includes a label and links the value text
     *
     * * `$` => detail layout row
     * * `$$` => view instance
     */
    relatedPropertyTemplate: new Simplate(['<div class="{%= $$.multiColumnClass %} columns{%= $.cls %}">', '<label>{%: $.label %}</label>', '<span class="data">', '<a class="hyperlink" data-action="activateRelatedEntry" data-view="{%= $.view %}" data-context="{%: $.context %}" data-descriptor="{%: $.descriptor || $.value %}">', '{%= $.value %}', '</a>', '</span>', '</div>']),
    /**
     * @property {Simplate}
     * HTML that is used for detail layout items that point to related views, displayed as an icon and text
     *
     * * `$` => detail layout row
     * * `$$` => view instance
     */
    relatedTemplate: new Simplate(['<li class="relatedviewitem {%= $.cls %}" data-action="activateRelatedList" data-view="{%= $.view %}" data-context="{%: $.context %}" {% if ($.disabled) { %}data-disable-action="true"{% } %}>', '<a class="{% if ($.disabled) { %}disabled{% } %}">', '{% if ($.icon) { %}', '<img src="{%= $.icon %}" alt="icon" class="icon" />', '{% } else if ($.iconClass) { %}', '<div class="{%= $.iconClass %}" alt="icon"></div>', '{% } %}', '<span class="related-item-label">', '<div class="busy-xs badge"', '<div class="busy-indicator-container" aria-live="polite">', '<div class="busy-indicator active">', '<div class="bar one"></div>', '<div class="bar two"></div>', '<div class="bar three"></div>', '<div class="bar four"></div>', '<div class="bar five"></div>', '</div>', '</div>', '</div>', '{%: $.label %}</span>', '</a>', '</li>']),
    /**
     * @property {Simplate}
     * HTML that is used for detail layout items that fire an action, displayed with label and property value
     *
     * * `$` => detail layout row
     * * `$$` => view instance
     */
    actionPropertyTemplate: new Simplate(['<div class="{%= $$.multiColumnClass %} columns{%= $.cls %}">', '<label>{%: $.label %}</label>', '<span class="data">', '<a class="hyperlink" data-action="{%= $.action %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">', '{%= $.value %}', '</a>', '</span>', '</div>']),
    /**
     * @property {Simplate}
     * HTML that is used for detail layout items that fire an action, displayed as an icon and text
     *
     * * `$` => detail layout row
     * * `$$` => view instance
     */
    actionTemplate: new Simplate(['<li class="{%= $.cls %}{% if ($.disabled) { %} disabled{% } %}">', '<a data-action="{%= $.action %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">', '{% if ($.icon) { %}', '<img src="{%= $.icon %}" alt="icon" class="icon" />', '{% } else if ($.iconClass) { %}', '<button type="button" class="btn-icon hide-focus">\n      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-{%: $.iconClass %}"></use>\n      </svg>\n    </button>', '{% } %}', '<label>{%: $.label %}</label>', '<span class="data">{%= $.value %}</span>', '</a>', '</li>']),
    /**
     * @property {Simplate}
     * HTML that is used for rows created with columns
     */
    rowTemplate: new Simplate(['<div class="row"></div>']),
    /**
     * @property {Simplate}
     * HTML that is shown when not available
     *
     * `$` => the view instance
     */
    notAvailableTemplate: new Simplate(['<p class="not-available">{%: $.notAvailableText %}</p>']),
    /**
     * @property {String}
     * The unique identifier of the view
     */
    id: 'generic_detail',
    /**
     * @property {Object}
     * The dojo store this view will use for data exchange.
     */
    store: null,
    /**
     * @property {Object}
     * The data entry
     */
    entry: null,
    /**
     * @property {Object}
     * The layout definition that constructs the detail view with sections and rows
     */
    layout: null,
    /**
     * @cfg {String/Object}
     * May be used for verifying the view is accessible
     */
    security: false,
    /**
     * @property {String}
     * The customization identifier for this class. When a customization is registered it is passed
     * a path/identifier which is then matched to this property.
     */
    customizationSet: 'detail',
    /**
     * @property {Boolean}
     * Controls if the view should be exposed
     */
    expose: false,
    /**
     * @property {Boolean}
     * Controls whether the view will render as a tab view or the previous list view
     */
    isTabbed: true,
    /**
     * @property {String}
     * Controls how the view determines the quick action section by mapping this string with that on the detail view (should be overwritten)
     */
    quickActionSection: 'QuickActionsSection',
    /**
     * @deprecated
     */
    editText: resource.editText,
    /**
     * @cfg {String}
     * Font awesome icon to be used by the more list item
     */
    icon: 'fa fa-chevron',

    viewType: 'detail',
    /**
     * @cfg {String}
     * Information text that is concatenated with the entity type
     */
    informationText: resource.informationText,
    /**
     * @cfg {String}
     * Default title text shown in the top toolbar
     */
    titleText: resource.titleText,
    /**
     * @cfg {String}
     * Default text used in the header title, followed by information
     */
    entityText: resource.entityText,
    /**
     * @property {String}
     * Helper string for a basic section header text
     */
    detailsText: resource.detailsText,
    /**
     * @property {String}
     * Text shown while loading and used in loadingTemplate
     */
    loadingText: resource.loadingText,
    /**
     * @property {String}
     * Text used in the notAvailableTemplate
     */
    notAvailableText: resource.notAvailableText,
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
     * @cfg {String}
     * The view id to be taken to when the Edit button is pressed in the toolbar
     */
    editView: false,
    /**
     * @property {Object[]}
     * Store for mapping layout options to an index on the HTML node
     */
    _navigationOptions: null,
    /**
     * @property {Boolean}
     * Flag to signal that the interface is loading and clicking refresh will be ignored to prevent double entity loading
     */
    isRefreshing: false,
    /**
     * @property {String}
     * Determines the SoHo class implemented in property templates
     */
    multiColumnClass: 'four',
    /**
     * @property {Number}
     * Determines how many columns the detail view property views should contain
     */
    multiColumnCount: 3,
    /**
     * @property {String}
     * Text shown in the top toolbar refresh button
     */
    refreshTooltipText: resource.refreshTooltipText,
    /**
     * @property {String}
     * Text shown in the top toolbar edit button
     */
    editTooltipText: resource.editTooltipText,

    // Store properties
    itemsProperty: '',
    idProperty: '',
    labelProperty: '',
    entityProperty: '',
    versionProperty: '',

    /**
     * Extends the dijit widget postCreate to subscribe to the global `/app/refresh` event and clear the view.
     */
    postCreate: function postCreate() {
      this.inherited(postCreate, arguments);
      this.subscribe('/app/refresh', this._onRefresh);
      this.clear();
    },
    createErrorHandlers: function createErrorHandlers() {
      var _this = this;

      this.errorHandlers = this.errorHandlers || [{
        name: 'Aborted',
        test: function test(error) {
          return error.aborted;
        },
        handle: function handle(error, next) {
          _this.options = false; // force a refresh
          next();
        }
      }, {
        name: 'AlertError',
        test: function test(error) {
          return error.status !== _this.HTTP_STATUS.NOT_FOUND && !error.aborted;
        },
        handle: function handle(error, next) {
          alert(_this.getErrorMessage(error)); //eslint-disable-line
          next();
        }
      }, {
        name: 'NotFound',
        test: function test(error) {
          return error.status === _this.HTTP_STATUS.NOT_FOUND;
        },
        handle: function handle(error, next) {
          $(_this.contentNode).empty().append(_this.notAvailableTemplate.apply(_this));
          next();
        }
      }, {
        name: 'CatchAll',
        test: function test() {
          return true;
        },
        handle: function handle(error, next) {
          var fromContext = _this.options.fromContext;
          _this.options.fromContext = null;
          var errorItem = {
            viewOptions: _this.options,
            serverError: error
          };

          _ErrorManager2.default.addError(_this.getErrorMessage(error), errorItem);
          _this.options.fromContext = fromContext;
          $(_this.domNode).removeClass('panel-loading');
          next();
        }
      }];

      return this.errorHandlers;
    },
    /**
     * Sets and returns the toolbar item layout definition, this method should be overriden in the view
     * so that you may define the views toolbar items.
     * @return {Object} this.tools
     * @template
     */
    createToolLayout: function createToolLayout() {
      var tools = [];

      if (this.editView) {
        tools.push({
          id: 'edit',
          svg: 'edit',
          title: this.editTooltipText,
          action: 'navigateToEditView',
          security: App.getViewSecurity(this.editView, 'update')
        });
      }

      tools.push({
        id: 'refresh',
        svg: 'refresh',
        title: this.refreshTooltipText,
        action: '_refreshClicked'
      });

      return this.tools || (this.tools = {
        tbar: tools
      });
    },
    _refreshClicked: function _refreshClicked() {
      // If the user has hit refresh already, let the interface load first set of assets
      if (this.isRefreshing) {
        return;
      }
      this.isRefreshing = true;
      this.clear();
      this.refreshRequired = true;
      this.refresh();

      this.onRefreshClicked();
    },
    /**
     * Called when the user clicks the refresh toolbar button.
     */
    onRefreshClicked: function onRefreshClicked() {},
    /**
     * Extends the {@link _ActionMixin#invokeAction mixins invokeAction} to stop if `data-disableAction` is true
     * @param name
     * @param {Object} parameters Collection of `data-` attributes from the node
     * @param {Event} evt
     * @param {HTMLElement} el
     */
    invokeAction: function invokeAction(name, parameters /* , evt, el*/) {
      if (parameters && /true/i.test(parameters.disableAction)) {
        return null;
      }
      return this.inherited(invokeAction, arguments);
    },
    /**
     * Toggles the collapsed state of the section.
     */
    toggleSection: function toggleSection(params) {
      var node = $('#' + params.$source);
      if (node.length) {
        node.toggleClass('collapsed');
        var button = $('button', node).first();
        if (button.length) {
          button.toggleClass(this.toggleCollapseClass);
          button.toggleClass(this.toggleExpandClass);
        }
      }
    },
    /**
     * Handler for the getting the detail resource type from the id and placing the header into the detail view..
     * @private
     */
    placeDetailHeader: function placeDetailHeader() {
      var value = _string2.default.substitute(this.informationText, [this.entityText]);
      $(this.tabContainer).before(this.detailHeaderTemplate.apply({ value: value }, this));
    },
    /**
     * Handler for the global `/app/refresh` event. Sets `refreshRequired` to true if the key matches.
     * @param {Object} options The object published by the event.
     * @private
     */
    _onRefresh: function _onRefresh(o) {
      var descriptor = o.data && o.data[this.labelProperty];

      if (this.options && this.options.key === o.key) {
        this.refreshRequired = true;

        if (descriptor) {
          this.options.title = descriptor;
          this.set('title', descriptor);
        }
      }
    },
    /**
     * Handler for the related entry action, navigates to the defined `data-view` passing the `data-context`.
     * @param {Object} params Collection of `data-` attributes from the source node.
     */
    activateRelatedEntry: function activateRelatedEntry(params) {
      if (params.context) {
        this.navigateToRelatedView(params.view, parseInt(params.context, 10), params.descriptor);
      }
    },
    /**
     * Handler for the related list action, navigates to the defined `data-view` passing the `data-context`.
     * @param {Object} params Collection of `data-` attributes from the source node.
     */
    activateRelatedList: function activateRelatedList(params) {
      if (params.context) {
        this.navigateToRelatedView(params.view, parseInt(params.context, 10), params.descriptor);
      }
    },
    /**
     * Navigates to the defined `this.editView` passing the current `this.entry` as default data.
     * @param {HTMLElement} el
     */
    navigateToEditView: function navigateToEditView() /* el*/{
      var view = App.getView(this.editView);
      if (view) {
        var entry = this.entry;
        view.show({
          entry: entry,
          fromContext: this
        });
      }
    },
    /**
     * Navigates to a given view id passing the options retrieved using the slot index to `this._navigationOptions`.
     * @param {String} id View id to go to
     * @param {Number} slot Index of the context to use in `this._navigationOptions`.
     * @param {String} descriptor Optional descriptor option that is mixed in.
     */
    navigateToRelatedView: function navigateToRelatedView(id, slot, descriptor) {
      var options = this._navigationOptions[slot];
      var view = App.getView(id);

      if (descriptor && options) {
        options.descriptor = descriptor;
      }

      if (this.entry) {
        options.selectedEntry = this.entry;
      }

      options.fromContext = this;
      if (view && options) {
        view.show(options);
      }
    },
    /**
     * Sets and returns the Detail view layout by following a standard for section and rows:
     *
     * The `this.layout` itself is an array of section objects where a section object is defined as such:
     *
     *     {
     *        name: 'String', // Required. unique name for identification/customization purposes
     *        title: 'String', // Required. Text shown in the section header
     *        list: boolean, // Optional. Default false. Controls if the group container for child rows should be a div (false) or ul (true)
     *        children: [], // Array of child row objects
     *     }
     *
     * A child row object has:
     *
     *     {
     *        name: 'String', // Required. unique name for identification/customization purposes
     *        property: 'String', // Optional. The property of the current entity to bind to
     *        label: 'String', // Optional. Text shown in the label to the left of the property
     *        onCreate: function(), // Optional. You may pass a function to be called when the row is added to the DOM
     *        include: boolean, // Optional. If false the row will not be included in the layout
     *        exclude: boolean, // Optional. If true the row will not be included in the layout
     *        template: Simplate, // Optional. Override the HTML Simplate used for rendering the value (not the row) where `$` is the row object
     *        tpl: Simplate, // Optional. Same as template.
     *        renderer: function(), // Optional. Pass a function that receives the current value and returns a value to be rendered
     *        encode: boolean, // Optional. If true it will encode HTML entities
     *        cls: 'String', // Optional. Additional CSS class string to be added to the row div
     *        use: Simplate, // Optional. Override the HTML Simplate used for rendering the row (not value)
     *        provider: function(entry, propertyName), // Optional. Function that accepts the data entry and the property name and returns the extracted value. By default simply extracts directly.
     *        value: Any // Optional. Provide a value directly instead of binding
     *     }
     *
     * @return {Object[]} Detail layout definition
     */
    createLayout: function createLayout() {
      return this.layout || [];
    },
    /**
     * Processes the given layout definition using the data entry response by rendering and inserting the HTML nodes and
     * firing any onCreate events defined.
     * @param {Object[]} layout Layout definition
     * @param {Object} entry data response
     */
    processLayout: function processLayout(layout, entry) {
      var items = layout.children || layout.as || layout;
      var options = layout.options || (layout.options = {
        title: this.detailsText
      });
      var sectionQueue = [];
      var sectionStarted = false;
      var callbacks = [];
      var row = [];

      var sectionNode = void 0;

      if (this.isTabbed) {
        this.placeTabList(this.contentNode);
      }

      for (var i = 0; i < items.length; i++) {
        var current = items[i];
        var include = this.expandExpression(current.include, entry);
        var exclude = this.expandExpression(current.exclude, entry);
        var context = void 0;

        if (include !== undefined && !include) {
          if (i >= items.length - 1 && row.length > 0) {
            var _rowNode = this.createRow(row);
            $(sectionNode).append(_rowNode);
            row = [];
          }
          continue;
        }

        if (exclude !== undefined && exclude) {
          if (i >= items.length - 1 && row.length > 0) {
            var _rowNode2 = this.createRow(row);
            $(sectionNode).append(_rowNode2);
            row = [];
          }
          continue;
        }

        if (current.children || current.as) {
          if (sectionStarted) {
            sectionQueue.push(current);
          } else {
            this.processLayout(current, entry);
          }

          continue;
        }

        if (!sectionStarted) {
          var section = void 0;
          sectionStarted = true;
          if (this.isTabbed) {
            if (layout.name === this.quickActionSection) {
              section = $(this.sectionBeginTemplate.apply(layout, this) + this.sectionEndTemplate.apply(layout, this));
              sectionNode = section.get(0);
              $(this.quickActions).append(section);
            } else {
              var tab = $(this.tabListItemTemplate.apply(layout, this)).get(0);
              section = $(this.sectionBeginTemplate.apply(layout, this) + this.sectionEndTemplate.apply(layout, this));
              sectionNode = section.get(0);
              this.tabMapping.push(section.get(0));
              this.tabs.push(tab);
              $(this.tabContainer).append(section);
            }
          } else {
            section = $(this.sectionBeginTemplate.apply(layout, this) + this.sectionEndTemplate.apply(layout, this));
            sectionNode = section.get(0).childNodes[1];
            $(this.tabContainer).append(section);
          }
        }

        var provider = current.provider || _Utility2.default.getValue;
        var property = typeof current.property === 'string' ? current.property : current.name;
        var value = typeof current.value === 'undefined' ? provider(entry, property, entry) : current.value;
        var rendered = void 0;
        var formatted = void 0;
        if (current.template || current.tpl) {
          rendered = (current.template || current.tpl).apply(value, this);
          formatted = current.encode === true ? _Format2.default.encode(rendered) : rendered;
        } else if (current.renderer && typeof current.renderer === 'function') {
          rendered = current.renderer.call(this, value);
          formatted = current.encode === true ? _Format2.default.encode(rendered) : rendered;
        } else {
          formatted = current.encode !== false ? _Format2.default.encode(value) : value;
        }

        var data = _lang2.default.mixin({}, {
          entry: entry,
          value: formatted,
          raw: value
        }, current);

        if (current.descriptor) {
          data.descriptor = typeof current.descriptor === 'function' ? this.expandExpression(current.descriptor, entry, value) : provider(entry, current.descriptor);
        }

        if (current.action) {
          data.action = this.expandExpression(current.action, entry, value);
        }

        var hasAccess = App.hasAccessTo(current.security);

        if (current.security) {
          data.disabled = !hasAccess;
        }

        if (current.disabled && hasAccess) {
          data.disabled = this.expandExpression(current.disabled, entry, value);
        }

        if (current.view) {
          context = _lang2.default.mixin({}, current.options);

          if (current.key) {
            context.key = typeof current.key === 'function' ? this.expandExpression(current.key, entry) : provider(entry, current.key);
          }
          if (current.where) {
            context.where = this.expandExpression(current.where, entry);
            if (context.where === '') {
              data.disabled = true;
            }
          }
          if (current.contractName) {
            context.contractName = this.expandExpression(current.contractName, entry);
          }
          if (current.resourceKind) {
            context.resourceKind = this.expandExpression(current.resourceKind, entry);
          }
          if (current.resourceProperty) {
            context.resourceProperty = this.expandExpression(current.resourceProperty, entry);
          }
          if (current.resourcePredicate) {
            context.resourcePredicate = this.expandExpression(current.resourcePredicate, entry);
          }
          if (current.dataSet) {
            context.dataSet = this.expandExpression(current.dataSet, entry);
          }
          if (current.title) {
            context.title = current.title;
          }

          if (current.resetSearch) {
            context.resetSearch = current.resetSearch;
          } else {
            context.resetSearch = true;
          }

          data.view = current.view;
          data.context = this._navigationOptions.push(context) - 1;
        }

        var useListTemplate = layout.list || options.list;

        var template = void 0;
        var isColumnItem = false;
        // priority: use > (relatedPropertyTemplate | relatedTemplate) > (actionPropertyTemplate | actionTemplate) > propertyTemplate
        if (current.use) {
          template = current.use;
        } else if (current.view && useListTemplate) {
          template = this.relatedTemplate;
          current.relatedItem = true;
        } else if (current.view) {
          template = this.relatedPropertyTemplate;
          isColumnItem = true;
        } else if (current.action && useListTemplate) {
          template = this.actionTemplate;
        } else if (current.action) {
          template = this.actionPropertyTemplate;
          isColumnItem = true;
        } else {
          template = this.propertyTemplate;
          isColumnItem = true;
        }

        var rowNode = this.createRowNode(current, sectionNode, entry, template, data);
        if (data.raw !== undefined && data.value) {
          if (isColumnItem) {
            row.push(rowNode);
          } else {
            $(sectionNode).append(rowNode);
          }
        }

        if (row.length >= this.multiColumnCount || i >= items.length - 1 && row.length > 0) {
          rowNode = this.createRow(row);
          $(sectionNode).append(rowNode);
          row = [];
        }
        if (current.relatedItem) {
          try {
            this._processRelatedItem(data, context, rowNode);
          } catch (e) {
            // error processing related node
            console.error(e); //eslint-disable-line
          }
        }

        if (current.onCreate) {
          callbacks.push({
            row: current,
            node: rowNode,
            value: value,
            entry: entry
          });
        }
      }

      for (var _i = 0; _i < callbacks.length; _i++) {
        var item = callbacks[_i];
        item.row.onCreate.apply(this, [item.row, item.node, item.value, item.entry]);
      }

      for (var _i2 = 0; _i2 < sectionQueue.length; _i2++) {
        var _current = sectionQueue[_i2];
        this.processLayout(_current, entry);
      }
      this.isRefreshing = false;
    },
    createRow: function createRow(row) {
      var rowTemplate = $(this.rowTemplate.apply(null, this));
      row.forEach(function (element) {
        rowTemplate.append(element);
      });
      return rowTemplate;
    },
    createRowNode: function createRowNode(layout, sectionNode, entry, template, data) {
      var frag = $(template.apply(data, this));
      return frag.get(0);
    },
    _getStoreAttr: function _getStoreAttr() {
      return this.store || (this.store = this.createStore());
    },
    /**
     * CreateStore is the core of the data handling for Detail Views. By default it is empty but it should return
     * a dojo store of your choosing. There are {@link _SDataDetailMixin Mixins} available for SData.
     * @return {*}
     */
    createStore: function createStore() {
      return null;
    },
    /**
     * @template
     * Optional processing of the returned entry before it gets processed into layout.
     * @param {Object} entry Entry from data store
     * @return {Object} By default does not do any processing
     */
    preProcessEntry: function preProcessEntry(entry) {
      return entry;
    },
    /**
     * Takes the entry from the data store, applies customization, applies any custom item process and then
     * passes it to process layout.
     * @param {Object} entry Entry from data store
     */
    processEntry: function processEntry(entry) {
      this.entry = this.preProcessEntry(entry);

      if (this.entry) {
        this.processLayout(this._createCustomizedLayout(this.createLayout()), this.entry);
        if (this.isTabbed) {
          this.createTabs(this.tabs);
          this.placeDetailHeader(this.entry);
        }
      } else {
        this.set('detailContent', '');
      }
    },
    _onGetComplete: function _onGetComplete(entry) {
      try {
        if (entry) {
          this.processEntry(entry);
        } else {
          $(this.contentNode).empty().append(this.notAvailableTemplate.apply(this));
        }

        $(this.domNode).removeClass('panel-loading');

        /* this must take place when the content is visible */
        this.onContentChange();
      } catch (e) {
        console.error(e); //eslint-disable-line
      } finally {
        this.isRefreshing = false;
      }
    },
    _onGetError: function _onGetError(getOptions, error) {
      this.handleError(error);
      this.isRefreshing = false;
    },
    /**
     * Initiates the request.
     */
    requestData: function requestData() {
      var _this2 = this;

      $(this.domNode).addClass('panel-loading');

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

      throw new Error('requestData called without a model or store defined.');
    },
    requestDataUsingModel: function requestDataUsingModel() {
      var key = this._buildGetExpression();
      return this._model.getEntry(key, this.options);
    },
    requestDataUsingStore: function requestDataUsingStore(getExpression, getOptions) {
      var store = this.get('store');
      return store.get(getExpression, getOptions);
    },
    _buildGetExpression: function _buildGetExpression() {
      var options = this.options;
      return options && (options.id || options.key);
    },
    _applyStateToGetOptions: function _applyStateToGetOptions() /* getOptions*/{},
    /**
     * Determines if the view should be refresh by inspecting and comparing the passed navigation option key with current key.
     * @param {Object} options Passed navigation options.
     * @return {Boolean} True if the view should be refreshed, false if not.
     */
    refreshRequiredFor: function refreshRequiredFor(options) {
      if (this.options) {
        if (options) {
          if (this.options.key !== options.key) {
            return true;
          }
        }

        return false;
      }

      return this.inherited(refreshRequiredFor, arguments);
    },
    /**
     * Extends the {@link View#activate parent implementation} to set the nav options title attribute to the descriptor
     * @param tag
     * @param data
     */
    activate: function activate(tag, data) {
      var options = data && data.options;
      if (options && options.descriptor) {
        options.title = options.title || options.descriptor;
      }

      this.inherited(activate, arguments);
    },
    show: function show(options) {
      if (options && options.descriptor) {
        options.title = options.title || options.descriptor;
      }

      this.inherited(show, arguments);
    },
    /**
     * Returns the view key
     * @return {String} View key
     */
    getTag: function getTag() {
      return this.options && this.options.key;
    },
    /**
     * Extends the {@link View#getContext parent implementation} to also set the resourceKind, key and descriptor
     * @return {Object} View context object
     */
    getContext: function getContext() {
      return _lang2.default.mixin(this.inherited(getContext, arguments), {
        resourceKind: this.resourceKind,
        key: this.options.key,
        descriptor: this.options.descriptor
      });
    },
    /**
     * Extends the {@link View#beforeTransitionTo parent implementation} to also clear the view if `refreshRequired` is true
     * @return {Object} View context object
     */
    beforeTransitionTo: function beforeTransitionTo() {
      this.inherited(beforeTransitionTo, arguments);

      if (this.refreshRequired) {
        this.clear();
      }
    },
    /**
     * If a security breach is detected it sets the content to the notAvailableTemplate, otherwise it calls
     * {@link #requestData requestData} which starts the process sequence.
     */
    refresh: function refresh() {
      if (this.security && !App.hasAccessTo(this.expandExpression(this.security))) {
        $(this.contentNode).append(this.notAvailableTemplate.apply(this));
        return;
      }

      this.requestData();
    },
    /**
     * Clears the view by replacing the content with the empty template and emptying the stored row contexts.
     */
    clear: function clear() {
      this.set('detailContent', this.emptyTemplate.apply(this));
      this.clearTabs();
      if (this.quickActions) {
        $(this.quickActions).empty();
      }

      this._navigationOptions = [];
    },
    _processRelatedItem: function _processRelatedItem(data, context, rowNode) {
      var view = App.getView(data.view);
      var options = {};

      var renderRelated = function renderRelated(result) {
        if (result >= 0) {
          var labelNode = $('.related-item-label', rowNode).first();
          if (labelNode.length) {
            $('.busy-xs', labelNode).remove();
            labelNode.before('<span class="info badge">' + result + '</span>');
          } else {
            console.warn('Missing the "related-item-label" dom node.'); //eslint-disable-line
          }
        }
      };

      if (view && context && context.where) {
        options.where = context.where;
        view.getListCount(options).then(renderRelated);
      } else {
        renderRelated(0);
      }
    },
    removeEntry: function removeEntry() {
      var entry = this._createEntryForRemove();
      if (entry) {
        var store = this.get('store');
        if (store) {
          store.remove(entry).then(this._onRemoveSuccess.bind(this), this._onRemoveError.bind(this));
        }
      }
    },
    _createEntryForRemove: function _createEntryForRemove() {
      var entry = {
        $key: this.entry.$key,
        $etag: this.entry.$etag,
        $name: this.entry.$name
      };
      return entry;
    },
    _onRemoveSuccess: function _onRemoveSuccess() {
      _connect2.default.publish('/app/refresh', [{
        resourceKind: this.resourceKind
      }]);
      ReUI.back();
    },
    _onRemoveError: function _onRemoveError(error) {
      if (error) {
        this._onGetError(null, error);
      }
    },
    destroy: function destroy() {
      this.inherited(destroy, arguments);
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fRGV0YWlsQmFzZS5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJhdHRyaWJ1dGVNYXAiLCJkZXRhaWxDb250ZW50Iiwibm9kZSIsInR5cGUiLCJ0aXRsZSIsInByb3RvdHlwZSIsInNlbGVjdGVkIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImVtcHR5VGVtcGxhdGUiLCJsb2FkaW5nVGVtcGxhdGUiLCJxdWlja0FjdGlvblRlbXBsYXRlIiwiZGV0YWlsSGVhZGVyVGVtcGxhdGUiLCJzZWN0aW9uQmVnaW5UZW1wbGF0ZSIsInNlY3Rpb25FbmRUZW1wbGF0ZSIsInByb3BlcnR5VGVtcGxhdGUiLCJyZWxhdGVkUHJvcGVydHlUZW1wbGF0ZSIsInJlbGF0ZWRUZW1wbGF0ZSIsImFjdGlvblByb3BlcnR5VGVtcGxhdGUiLCJhY3Rpb25UZW1wbGF0ZSIsInJvd1RlbXBsYXRlIiwibm90QXZhaWxhYmxlVGVtcGxhdGUiLCJpZCIsInN0b3JlIiwiZW50cnkiLCJsYXlvdXQiLCJzZWN1cml0eSIsImN1c3RvbWl6YXRpb25TZXQiLCJleHBvc2UiLCJpc1RhYmJlZCIsInF1aWNrQWN0aW9uU2VjdGlvbiIsImVkaXRUZXh0IiwiaWNvbiIsInZpZXdUeXBlIiwiaW5mb3JtYXRpb25UZXh0IiwidGl0bGVUZXh0IiwiZW50aXR5VGV4dCIsImRldGFpbHNUZXh0IiwibG9hZGluZ1RleHQiLCJub3RBdmFpbGFibGVUZXh0IiwidG9nZ2xlQ29sbGFwc2VUZXh0IiwidG9nZ2xlQ29sbGFwc2VDbGFzcyIsInRvZ2dsZUV4cGFuZENsYXNzIiwiZWRpdFZpZXciLCJfbmF2aWdhdGlvbk9wdGlvbnMiLCJpc1JlZnJlc2hpbmciLCJtdWx0aUNvbHVtbkNsYXNzIiwibXVsdGlDb2x1bW5Db3VudCIsInJlZnJlc2hUb29sdGlwVGV4dCIsImVkaXRUb29sdGlwVGV4dCIsIml0ZW1zUHJvcGVydHkiLCJpZFByb3BlcnR5IiwibGFiZWxQcm9wZXJ0eSIsImVudGl0eVByb3BlcnR5IiwidmVyc2lvblByb3BlcnR5IiwicG9zdENyZWF0ZSIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInN1YnNjcmliZSIsIl9vblJlZnJlc2giLCJjbGVhciIsImNyZWF0ZUVycm9ySGFuZGxlcnMiLCJlcnJvckhhbmRsZXJzIiwibmFtZSIsInRlc3QiLCJlcnJvciIsImFib3J0ZWQiLCJoYW5kbGUiLCJuZXh0Iiwib3B0aW9ucyIsInN0YXR1cyIsIkhUVFBfU1RBVFVTIiwiTk9UX0ZPVU5EIiwiYWxlcnQiLCJnZXRFcnJvck1lc3NhZ2UiLCIkIiwiY29udGVudE5vZGUiLCJlbXB0eSIsImFwcGVuZCIsImFwcGx5IiwiZnJvbUNvbnRleHQiLCJlcnJvckl0ZW0iLCJ2aWV3T3B0aW9ucyIsInNlcnZlckVycm9yIiwiYWRkRXJyb3IiLCJkb21Ob2RlIiwicmVtb3ZlQ2xhc3MiLCJjcmVhdGVUb29sTGF5b3V0IiwidG9vbHMiLCJwdXNoIiwic3ZnIiwiYWN0aW9uIiwiQXBwIiwiZ2V0Vmlld1NlY3VyaXR5IiwidGJhciIsIl9yZWZyZXNoQ2xpY2tlZCIsInJlZnJlc2hSZXF1aXJlZCIsInJlZnJlc2giLCJvblJlZnJlc2hDbGlja2VkIiwiaW52b2tlQWN0aW9uIiwicGFyYW1ldGVycyIsImRpc2FibGVBY3Rpb24iLCJ0b2dnbGVTZWN0aW9uIiwicGFyYW1zIiwiJHNvdXJjZSIsImxlbmd0aCIsInRvZ2dsZUNsYXNzIiwiYnV0dG9uIiwiZmlyc3QiLCJwbGFjZURldGFpbEhlYWRlciIsInZhbHVlIiwic3Vic3RpdHV0ZSIsInRhYkNvbnRhaW5lciIsImJlZm9yZSIsIm8iLCJkZXNjcmlwdG9yIiwiZGF0YSIsImtleSIsInNldCIsImFjdGl2YXRlUmVsYXRlZEVudHJ5IiwiY29udGV4dCIsIm5hdmlnYXRlVG9SZWxhdGVkVmlldyIsInZpZXciLCJwYXJzZUludCIsImFjdGl2YXRlUmVsYXRlZExpc3QiLCJuYXZpZ2F0ZVRvRWRpdFZpZXciLCJnZXRWaWV3Iiwic2hvdyIsInNsb3QiLCJzZWxlY3RlZEVudHJ5IiwiY3JlYXRlTGF5b3V0IiwicHJvY2Vzc0xheW91dCIsIml0ZW1zIiwiY2hpbGRyZW4iLCJhcyIsInNlY3Rpb25RdWV1ZSIsInNlY3Rpb25TdGFydGVkIiwiY2FsbGJhY2tzIiwicm93Iiwic2VjdGlvbk5vZGUiLCJwbGFjZVRhYkxpc3QiLCJpIiwiY3VycmVudCIsImluY2x1ZGUiLCJleHBhbmRFeHByZXNzaW9uIiwiZXhjbHVkZSIsInVuZGVmaW5lZCIsInJvd05vZGUiLCJjcmVhdGVSb3ciLCJzZWN0aW9uIiwiZ2V0IiwicXVpY2tBY3Rpb25zIiwidGFiIiwidGFiTGlzdEl0ZW1UZW1wbGF0ZSIsInRhYk1hcHBpbmciLCJ0YWJzIiwiY2hpbGROb2RlcyIsInByb3ZpZGVyIiwiZ2V0VmFsdWUiLCJwcm9wZXJ0eSIsInJlbmRlcmVkIiwiZm9ybWF0dGVkIiwidGVtcGxhdGUiLCJ0cGwiLCJlbmNvZGUiLCJyZW5kZXJlciIsImNhbGwiLCJtaXhpbiIsInJhdyIsImhhc0FjY2VzcyIsImhhc0FjY2Vzc1RvIiwiZGlzYWJsZWQiLCJ3aGVyZSIsImNvbnRyYWN0TmFtZSIsInJlc291cmNlS2luZCIsInJlc291cmNlUHJvcGVydHkiLCJyZXNvdXJjZVByZWRpY2F0ZSIsImRhdGFTZXQiLCJyZXNldFNlYXJjaCIsInVzZUxpc3RUZW1wbGF0ZSIsImxpc3QiLCJpc0NvbHVtbkl0ZW0iLCJ1c2UiLCJyZWxhdGVkSXRlbSIsImNyZWF0ZVJvd05vZGUiLCJfcHJvY2Vzc1JlbGF0ZWRJdGVtIiwiZSIsImNvbnNvbGUiLCJvbkNyZWF0ZSIsIml0ZW0iLCJmb3JFYWNoIiwiZWxlbWVudCIsImZyYWciLCJfZ2V0U3RvcmVBdHRyIiwiY3JlYXRlU3RvcmUiLCJwcmVQcm9jZXNzRW50cnkiLCJwcm9jZXNzRW50cnkiLCJfY3JlYXRlQ3VzdG9taXplZExheW91dCIsImNyZWF0ZVRhYnMiLCJfb25HZXRDb21wbGV0ZSIsIm9uQ29udGVudENoYW5nZSIsIl9vbkdldEVycm9yIiwiZ2V0T3B0aW9ucyIsImhhbmRsZUVycm9yIiwicmVxdWVzdERhdGEiLCJhZGRDbGFzcyIsIl9tb2RlbCIsInJlcXVlc3REYXRhVXNpbmdNb2RlbCIsInRoZW4iLCJlcnIiLCJfYXBwbHlTdGF0ZVRvR2V0T3B0aW9ucyIsImdldEV4cHJlc3Npb24iLCJfYnVpbGRHZXRFeHByZXNzaW9uIiwiZ2V0UmVzdWx0cyIsInJlcXVlc3REYXRhVXNpbmdTdG9yZSIsImJpbmQiLCJFcnJvciIsImdldEVudHJ5IiwicmVmcmVzaFJlcXVpcmVkRm9yIiwiYWN0aXZhdGUiLCJ0YWciLCJnZXRUYWciLCJnZXRDb250ZXh0IiwiYmVmb3JlVHJhbnNpdGlvblRvIiwiY2xlYXJUYWJzIiwicmVuZGVyUmVsYXRlZCIsInJlc3VsdCIsImxhYmVsTm9kZSIsInJlbW92ZSIsIndhcm4iLCJnZXRMaXN0Q291bnQiLCJyZW1vdmVFbnRyeSIsIl9jcmVhdGVFbnRyeUZvclJlbW92ZSIsIl9vblJlbW92ZVN1Y2Nlc3MiLCJfb25SZW1vdmVFcnJvciIsIiRrZXkiLCIkZXRhZyIsIiRuYW1lIiwicHVibGlzaCIsIlJlVUkiLCJiYWNrIiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLE1BQU1BLFdBQVcsb0JBQVksWUFBWixDQUFqQjs7QUFFQTs7Ozs7Ozs7Ozs7QUE5QkE7Ozs7Ozs7Ozs7Ozs7OztBQXlDQSxNQUFNQyxVQUFVLHVCQUFRLG1CQUFSLEVBQTZCLHFDQUE3QixFQUFnRCxnQ0FBZ0M7QUFDOUY7Ozs7Ozs7QUFPQUMsa0JBQWM7QUFDWkMscUJBQWU7QUFDYkMsY0FBTSxhQURPO0FBRWJDLGNBQU07QUFGTyxPQURIO0FBS1pDLGFBQU8sZUFBS0MsU0FBTCxDQUFlTCxZQUFmLENBQTRCSSxLQUx2QjtBQU1aRSxnQkFBVSxlQUFLRCxTQUFMLENBQWVMLFlBQWYsQ0FBNEJNO0FBTjFCLEtBUmdGO0FBZ0I5Rjs7Ozs7Ozs7Ozs7Ozs7O0FBZUFDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEs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S0FBS25OLEtBQUwsQ0FBV21OLElBREw7QUFFWkMsZUFBTyxLQUFLcE4sS0FBTCxDQUFXb04sS0FGTjtBQUdaQyxlQUFPLEtBQUtyTixLQUFMLENBQVdxTjtBQUhOLE9BQWQ7QUFLQSxhQUFPck4sS0FBUDtBQUNELEtBbmxDNkY7QUFvbEM5RmlOLHNCQUFrQixTQUFTQSxnQkFBVCxHQUE0QjtBQUM1Qyx3QkFBUUssT0FBUixDQUFnQixjQUFoQixFQUFnQyxDQUFDO0FBQy9CaEUsc0JBQWMsS0FBS0E7QUFEWSxPQUFELENBQWhDO0FBR0FpRSxXQUFLQyxJQUFMO0FBQ0QsS0F6bEM2RjtBQTBsQzlGTixvQkFBZ0IsU0FBU0EsY0FBVCxDQUF3QnpLLEtBQXhCLEVBQStCO0FBQzdDLFVBQUlBLEtBQUosRUFBVztBQUNULGFBQUt3SSxXQUFMLENBQWlCLElBQWpCLEVBQXVCeEksS0FBdkI7QUFDRDtBQUNGLEtBOWxDNkY7QUErbEM5RmdMLGFBQVMsU0FBU0EsT0FBVCxHQUFtQjtBQUMxQixXQUFLekwsU0FBTCxDQUFleUwsT0FBZixFQUF3QnhMLFNBQXhCO0FBQ0Q7QUFqbUM2RixHQUFoRixDQUFoQjs7b0JBb21DZTFELE8iLCJmaWxlIjoiX0RldGFpbEJhc2UuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCB3aGVuIGZyb20gJ2Rvam8vd2hlbic7XHJcbmltcG9ydCBjb25uZWN0IGZyb20gJ2Rvam8vX2Jhc2UvY29ubmVjdCc7XHJcbmltcG9ydCBmb3JtYXQgZnJvbSAnLi9Gb3JtYXQnO1xyXG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xyXG5pbXBvcnQgRXJyb3JNYW5hZ2VyIGZyb20gJy4vRXJyb3JNYW5hZ2VyJztcclxuaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcclxuaW1wb3J0IFRhYldpZGdldCBmcm9tICcuL1RhYldpZGdldCc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdkZXRhaWxCYXNlJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLl9EZXRhaWxCYXNlXHJcbiAqIEBjbGFzc2Rlc2MgQSBEZXRhaWwgVmlldyByZXByZXNlbnRzIGEgc2luZ2xlIHJlY29yZCBhbmQgc2hvdWxkIGRpc3BsYXkgYWxsIHRoZSBpbmZvIHRoZSB1c2VyIG1heSBuZWVkIGFib3V0IHRoZSBlbnRyeS5cclxuICpcclxuICogQSBEZXRhaWwgZW50cnkgaXMgaWRlbnRpZmllZCBieSBpdHMga2V5IChpZFByb3BlcnR5KSB3aGljaCBpcyBob3cgaXQgcmVxdWVzdHMgdGhlIGRhdGEgdmlhIHRoZSBlbmRwb2ludC5cclxuICpcclxuICogQGV4dGVuZHMgYXJnb3MuVmlld1xyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRm9ybWF0XHJcbiAqIEByZXF1aXJlcyBhcmdvcy5VdGlsaXR5XHJcbiAqIEByZXF1aXJlcyBhcmdvcy5FcnJvck1hbmFnZXJcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fRGV0YWlsQmFzZScsIFtWaWV3LCBUYWJXaWRnZXRdLCAvKiogQGxlbmRzIGFyZ29zLl9EZXRhaWxCYXNlIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBDcmVhdGVzIGEgc2V0dGVyIG1hcCB0byBodG1sIG5vZGVzLCBuYW1lbHk6XHJcbiAgICpcclxuICAgKiAqIGRldGFpbENvbnRlbnQgPT4gY29udGVudE5vZGUncyBpbm5lckhUTUxcclxuICAgKlxyXG4gICAqL1xyXG4gIGF0dHJpYnV0ZU1hcDoge1xyXG4gICAgZGV0YWlsQ29udGVudDoge1xyXG4gICAgICBub2RlOiAnY29udGVudE5vZGUnLFxyXG4gICAgICB0eXBlOiAnaW5uZXJIVE1MJyxcclxuICAgIH0sXHJcbiAgICB0aXRsZTogVmlldy5wcm90b3R5cGUuYXR0cmlidXRlTWFwLnRpdGxlLFxyXG4gICAgc2VsZWN0ZWQ6IFZpZXcucHJvdG90eXBlLmF0dHJpYnV0ZU1hcC5zZWxlY3RlZCxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSB2aWV3J3MgbWFpbiBET00gZWxlbWVudCB3aGVuIHRoZSB2aWV3IGlzIGluaXRpYWxpemVkLlxyXG4gICAqIFRoaXMgdGVtcGxhdGUgaW5jbHVkZXMgbG9hZGluZ1RlbXBsYXRlLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgdXNlcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICpcclxuICAgKiAgICAgIG5hbWUgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgKiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiAgICAgIGlkICAgICAgICAgICAgICAgICAgIG1haW4gY29udGFpbmVyIGRpdiBpZFxyXG4gICAqICAgICAgdGl0bGUgICAgICAgICAgICAgICAgbWFpbiBjb250YWluZXIgZGl2IHRpdGxlIGF0dHJcclxuICAgKiAgICAgIGNscyAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWwgY2xhc3Mgc3RyaW5nIGFkZGVkIHRvIHRoZSBtYWluIGNvbnRhaW5lciBkaXZcclxuICAgKiAgICAgIHJlc291cmNlS2luZCAgICAgICAgIHNldCB0byBkYXRhLXJlc291cmNlLWtpbmRcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgaWQ9XCJ7JT0gJC5pZCAlfVwiIGRhdGEtdGl0bGU9XCJ7JT0gJC50aXRsZVRleHQgJX1cIiBjbGFzcz1cImRldGFpbCBwYW5lbCBzY3JvbGxhYmxlIHslPSAkLmNscyAlfVwiIHslIGlmICgkLnJlc291cmNlS2luZCkgeyAlfWRhdGEtcmVzb3VyY2Uta2luZD1cInslPSAkLnJlc291cmNlS2luZCAlfVwieyUgfSAlfT4nLFxyXG4gICAgJ3slISAkLmxvYWRpbmdUZW1wbGF0ZSAlfScsXHJcbiAgICAneyUhICQucXVpY2tBY3Rpb25UZW1wbGF0ZSAlfScsXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiY29udGVudE5vZGVcIiBjbGFzcz1cImNvbHVtblwiPicsXHJcbiAgICAneyUhICQudGFiQ29udGVudFRlbXBsYXRlICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHNob3duIHdoZW4gbm8gZGF0YSBpcyBhdmFpbGFibGUuXHJcbiAgICovXHJcbiAgZW1wdHlUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgc2hvd24gd2hlbiBkYXRhIGlzIGJlaW5nIGxvYWRlZC5cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIGxvYWRpbmdUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwicGFuZWwtbG9hZGluZy1pbmRpY2F0b3JcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJidXN5LWluZGljYXRvci1jb250YWluZXIgYmxvY2tlZC11aVwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yIGFjdGl2ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBvbmVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdHdvXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHRocmVlXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZvdXJcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZml2ZVwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8c3Bhbj57JTogJC5sb2FkaW5nVGV4dCAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBjcmVhdGVzIHRoZSBxdWljayBhY3Rpb24gbGlzdFxyXG4gICAqL1xyXG4gIHF1aWNrQWN0aW9uVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInF1aWNrLWFjdGlvbnNcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwicXVpY2tBY3Rpb25zXCI+PC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBjcmVhdGVzIHRoZSBkZXRhaWwgaGVhZGVyIGRpc3BsYXlpbmcgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHRhYiBsaXN0XHJcbiAgICpcclxuICAgKiBgJGAgPT4gdGhlIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBkZXRhaWxIZWFkZXJUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiZGV0YWlsLWhlYWRlclwiPicsXHJcbiAgICAneyU6ICQudmFsdWUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgc3RhcnRzIGEgbmV3IHNlY3Rpb25cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHNlY3Rpb25CZWdpblRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJ3slIGlmICghJCQuaXNUYWJiZWQpIHsgJX0nLFxyXG4gICAgJzxoMiBkYXRhLWFjdGlvbj1cInRvZ2dsZVNlY3Rpb25cIiBjbGFzcz1cInslIGlmICgkLmNvbGxhcHNlZCB8fCAkLm9wdGlvbnMuY29sbGFwc2VkKSB7ICV9Y29sbGFwc2VkeyUgfSAlfVwiPicsXHJcbiAgICAnPGJ1dHRvbiBjbGFzcz1cInslIGlmICgkLmNvbGxhcHNlZCkgeyAlfXslOiAkJC50b2dnbGVFeHBhbmRDbGFzcyAlfXslIH0gZWxzZSB7ICV9eyU6ICQkLnRvZ2dsZUNvbGxhcHNlQ2xhc3MgJX17JSB9ICV9XCIgYXJpYS1sYWJlbD1cInslOiAkJC50b2dnbGVDb2xsYXBzZVRleHQgJX1cIj48L2J1dHRvbj4nLFxyXG4gICAgJ3slOiAoJC50aXRsZSB8fCAkLm9wdGlvbnMudGl0bGUpICV9JyxcclxuICAgICc8L2gyPicsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgICAneyUgaWYgKCQubGlzdCB8fCAkLm9wdGlvbnMubGlzdCkgeyAlfScsXHJcbiAgICAneyUgaWYgKCQuY2xzIHx8ICQub3B0aW9ucy5jbHMpIHsgJX0nLFxyXG4gICAgJzx1bCBjbGFzcz1cInslPSAoJC5jbHMgfHwgJC5vcHRpb25zLmNscykgJX1cIiBpZD1cInslOiAkJC5pZCAlfV97JTogJC5uYW1lICV9XCI+JyxcclxuICAgICd7JSB9IGVsc2UgeyAlfScsXHJcbiAgICAnPHVsIGNsYXNzPVwiZGV0YWlsQ29udGVudCB0YWItcGFuZWwgbGlzdHZpZXdcIiBpZD1cInslOiAkJC5pZCAlfV97JTogJC5uYW1lICV9XCI+JyxcclxuICAgICd7JSB9ICV9JyxcclxuICAgICd7JSB9IGVsc2UgeyAlfScsXHJcbiAgICAneyUgaWYgKCQuY2xzIHx8ICQub3B0aW9ucy5jbHMpIHsgJX0nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJ0YWItcGFuZWwgeyU9ICgkLmNscyB8fCAkLm9wdGlvbnMuY2xzKSAlfVwiIGlkPVwieyU6ICQkLmlkICV9X3slOiAkLm5hbWUgJX1cIj4nLFxyXG4gICAgJ3slIH0gZWxzZSB7ICV9JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiZGV0YWlsQ29udGVudCB0YWItcGFuZWwgc3VtbWFyeS1mb3JtXCIgaWQ9XCJ7JTogJCQuaWQgJX1feyU6ICQubmFtZSAlfVwiPicsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgZW5kcyBhIHNlY3Rpb25cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHNlY3Rpb25FbmRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICd7JSBpZiAoJC5saXN0IHx8ICQub3B0aW9ucy5saXN0KSB7ICV9JyxcclxuICAgICc8L3VsPicsXHJcbiAgICAneyUgfSBlbHNlIHsgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgaXMgdXNlZCBmb3IgYSBwcm9wZXJ0eSBpbiB0aGUgZGV0YWlsIGxheW91dFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gZGV0YWlsIGxheW91dCByb3dcclxuICAgKiAqIGAkJGAgPT4gdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHByb3BlcnR5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInslPSAkJC5tdWx0aUNvbHVtbkNsYXNzICV9IGNvbHVtbnN7JT0gJC5jbHMgJX1cIiBkYXRhLXByb3BlcnR5PVwieyU9ICQucHJvcGVydHkgfHwgJC5uYW1lICV9XCI+JyxcclxuICAgICc8bGFiZWw+eyU6ICQubGFiZWwgJX08L2xhYmVsPicsXHJcbiAgICAnPHNwYW4gY2xhc3M9XCJkYXRhXCI+eyU9ICQudmFsdWUgJX08L3NwYW4+JywgLy8gdG9kbzogY3JlYXRlIGEgd2F5IHRvIGFsbG93IHRoZSB2YWx1ZSB0byBub3QgYmUgc3Vycm91bmRlZCB3aXRoIGEgc3BhbiB0YWdcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IGlzIHVzZWQgZm9yIGRldGFpbCBsYXlvdXQgaXRlbXMgdGhhdCBwb2ludCB0byByZWxhdGVkIHZpZXdzLCBpbmNsdWRlcyBhIGxhYmVsIGFuZCBsaW5rcyB0aGUgdmFsdWUgdGV4dFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gZGV0YWlsIGxheW91dCByb3dcclxuICAgKiAqIGAkJGAgPT4gdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHJlbGF0ZWRQcm9wZXJ0eVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJ7JT0gJCQubXVsdGlDb2x1bW5DbGFzcyAlfSBjb2x1bW5zeyU9ICQuY2xzICV9XCI+JyxcclxuICAgICc8bGFiZWw+eyU6ICQubGFiZWwgJX08L2xhYmVsPicsXHJcbiAgICAnPHNwYW4gY2xhc3M9XCJkYXRhXCI+JyxcclxuICAgICc8YSBjbGFzcz1cImh5cGVybGlua1wiIGRhdGEtYWN0aW9uPVwiYWN0aXZhdGVSZWxhdGVkRW50cnlcIiBkYXRhLXZpZXc9XCJ7JT0gJC52aWV3ICV9XCIgZGF0YS1jb250ZXh0PVwieyU6ICQuY29udGV4dCAlfVwiIGRhdGEtZGVzY3JpcHRvcj1cInslOiAkLmRlc2NyaXB0b3IgfHwgJC52YWx1ZSAlfVwiPicsXHJcbiAgICAneyU9ICQudmFsdWUgJX0nLFxyXG4gICAgJzwvYT4nLFxyXG4gICAgJzwvc3Bhbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgaXMgdXNlZCBmb3IgZGV0YWlsIGxheW91dCBpdGVtcyB0aGF0IHBvaW50IHRvIHJlbGF0ZWQgdmlld3MsIGRpc3BsYXllZCBhcyBhbiBpY29uIGFuZCB0ZXh0XHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBkZXRhaWwgbGF5b3V0IHJvd1xyXG4gICAqICogYCQkYCA9PiB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgcmVsYXRlZFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaSBjbGFzcz1cInJlbGF0ZWR2aWV3aXRlbSB7JT0gJC5jbHMgJX1cIiBkYXRhLWFjdGlvbj1cImFjdGl2YXRlUmVsYXRlZExpc3RcIiBkYXRhLXZpZXc9XCJ7JT0gJC52aWV3ICV9XCIgZGF0YS1jb250ZXh0PVwieyU6ICQuY29udGV4dCAlfVwiIHslIGlmICgkLmRpc2FibGVkKSB7ICV9ZGF0YS1kaXNhYmxlLWFjdGlvbj1cInRydWVcInslIH0gJX0+JyxcclxuICAgICc8YSBjbGFzcz1cInslIGlmICgkLmRpc2FibGVkKSB7ICV9ZGlzYWJsZWR7JSB9ICV9XCI+JyxcclxuICAgICd7JSBpZiAoJC5pY29uKSB7ICV9JyxcclxuICAgICc8aW1nIHNyYz1cInslPSAkLmljb24gJX1cIiBhbHQ9XCJpY29uXCIgY2xhc3M9XCJpY29uXCIgLz4nLFxyXG4gICAgJ3slIH0gZWxzZSBpZiAoJC5pY29uQ2xhc3MpIHsgJX0nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJ7JT0gJC5pY29uQ2xhc3MgJX1cIiBhbHQ9XCJpY29uXCI+PC9kaXY+JyxcclxuICAgICd7JSB9ICV9JyxcclxuICAgICc8c3BhbiBjbGFzcz1cInJlbGF0ZWQtaXRlbS1sYWJlbFwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3kteHMgYmFkZ2VcIicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yLWNvbnRhaW5lclwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yIGFjdGl2ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBvbmVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdHdvXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHRocmVlXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZvdXJcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZml2ZVwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAneyU6ICQubGFiZWwgJX08L3NwYW4+JyxcclxuICAgICc8L2E+JyxcclxuICAgICc8L2xpPicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgaXMgdXNlZCBmb3IgZGV0YWlsIGxheW91dCBpdGVtcyB0aGF0IGZpcmUgYW4gYWN0aW9uLCBkaXNwbGF5ZWQgd2l0aCBsYWJlbCBhbmQgcHJvcGVydHkgdmFsdWVcclxuICAgKlxyXG4gICAqICogYCRgID0+IGRldGFpbCBsYXlvdXQgcm93XHJcbiAgICogKiBgJCRgID0+IHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBhY3Rpb25Qcm9wZXJ0eVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJ7JT0gJCQubXVsdGlDb2x1bW5DbGFzcyAlfSBjb2x1bW5zeyU9ICQuY2xzICV9XCI+JyxcclxuICAgICc8bGFiZWw+eyU6ICQubGFiZWwgJX08L2xhYmVsPicsXHJcbiAgICAnPHNwYW4gY2xhc3M9XCJkYXRhXCI+JyxcclxuICAgICc8YSBjbGFzcz1cImh5cGVybGlua1wiIGRhdGEtYWN0aW9uPVwieyU9ICQuYWN0aW9uICV9XCIgeyUgaWYgKCQuZGlzYWJsZWQpIHsgJX1kYXRhLWRpc2FibGUtYWN0aW9uPVwidHJ1ZVwieyUgfSAlfSBjbGFzcz1cInslIGlmICgkLmRpc2FibGVkKSB7ICV9ZGlzYWJsZWR7JSB9ICV9XCI+JyxcclxuICAgICd7JT0gJC52YWx1ZSAlfScsXHJcbiAgICAnPC9hPicsXHJcbiAgICAnPC9zcGFuPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBpcyB1c2VkIGZvciBkZXRhaWwgbGF5b3V0IGl0ZW1zIHRoYXQgZmlyZSBhbiBhY3Rpb24sIGRpc3BsYXllZCBhcyBhbiBpY29uIGFuZCB0ZXh0XHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBkZXRhaWwgbGF5b3V0IHJvd1xyXG4gICAqICogYCQkYCA9PiB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgYWN0aW9uVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwieyU9ICQuY2xzICV9eyUgaWYgKCQuZGlzYWJsZWQpIHsgJX0gZGlzYWJsZWR7JSB9ICV9XCI+JyxcclxuICAgICc8YSBkYXRhLWFjdGlvbj1cInslPSAkLmFjdGlvbiAlfVwiIHslIGlmICgkLmRpc2FibGVkKSB7ICV9ZGF0YS1kaXNhYmxlLWFjdGlvbj1cInRydWVcInslIH0gJX0gY2xhc3M9XCJ7JSBpZiAoJC5kaXNhYmxlZCkgeyAlfWRpc2FibGVkeyUgfSAlfVwiPicsXHJcbiAgICAneyUgaWYgKCQuaWNvbikgeyAlfScsXHJcbiAgICAnPGltZyBzcmM9XCJ7JT0gJC5pY29uICV9XCIgYWx0PVwiaWNvblwiIGNsYXNzPVwiaWNvblwiIC8+JyxcclxuICAgICd7JSB9IGVsc2UgaWYgKCQuaWNvbkNsYXNzKSB7ICV9JyxcclxuICAgIGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1pY29uIGhpZGUtZm9jdXNcIj5cclxuICAgICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhsaW5rOmhyZWY9XCIjaWNvbi17JTogJC5pY29uQ2xhc3MgJX1cIj48L3VzZT5cclxuICAgICAgPC9zdmc+XHJcbiAgICA8L2J1dHRvbj5gLFxyXG4gICAgJ3slIH0gJX0nLFxyXG4gICAgJzxsYWJlbD57JTogJC5sYWJlbCAlfTwvbGFiZWw+JyxcclxuICAgICc8c3BhbiBjbGFzcz1cImRhdGFcIj57JT0gJC52YWx1ZSAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvYT4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBpcyB1c2VkIGZvciByb3dzIGNyZWF0ZWQgd2l0aCBjb2x1bW5zXHJcbiAgICovXHJcbiAgcm93VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInJvd1wiPjwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgaXMgc2hvd24gd2hlbiBub3QgYXZhaWxhYmxlXHJcbiAgICpcclxuICAgKiBgJGAgPT4gdGhlIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBub3RBdmFpbGFibGVUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8cCBjbGFzcz1cIm5vdC1hdmFpbGFibGVcIj57JTogJC5ub3RBdmFpbGFibGVUZXh0ICV9PC9wPicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSB2aWV3XHJcbiAgICovXHJcbiAgaWQ6ICdnZW5lcmljX2RldGFpbCcsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIGRvam8gc3RvcmUgdGhpcyB2aWV3IHdpbGwgdXNlIGZvciBkYXRhIGV4Y2hhbmdlLlxyXG4gICAqL1xyXG4gIHN0b3JlOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFRoZSBkYXRhIGVudHJ5XHJcbiAgICovXHJcbiAgZW50cnk6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIGxheW91dCBkZWZpbml0aW9uIHRoYXQgY29uc3RydWN0cyB0aGUgZGV0YWlsIHZpZXcgd2l0aCBzZWN0aW9ucyBhbmQgcm93c1xyXG4gICAqL1xyXG4gIGxheW91dDogbnVsbCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmcvT2JqZWN0fVxyXG4gICAqIE1heSBiZSB1c2VkIGZvciB2ZXJpZnlpbmcgdGhlIHZpZXcgaXMgYWNjZXNzaWJsZVxyXG4gICAqL1xyXG4gIHNlY3VyaXR5OiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgY3VzdG9taXphdGlvbiBpZGVudGlmaWVyIGZvciB0aGlzIGNsYXNzLiBXaGVuIGEgY3VzdG9taXphdGlvbiBpcyByZWdpc3RlcmVkIGl0IGlzIHBhc3NlZFxyXG4gICAqIGEgcGF0aC9pZGVudGlmaWVyIHdoaWNoIGlzIHRoZW4gbWF0Y2hlZCB0byB0aGlzIHByb3BlcnR5LlxyXG4gICAqL1xyXG4gIGN1c3RvbWl6YXRpb25TZXQ6ICdkZXRhaWwnLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBDb250cm9scyBpZiB0aGUgdmlldyBzaG91bGQgYmUgZXhwb3NlZFxyXG4gICAqL1xyXG4gIGV4cG9zZTogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIENvbnRyb2xzIHdoZXRoZXIgdGhlIHZpZXcgd2lsbCByZW5kZXIgYXMgYSB0YWIgdmlldyBvciB0aGUgcHJldmlvdXMgbGlzdCB2aWV3XHJcbiAgICovXHJcbiAgaXNUYWJiZWQ6IHRydWUsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogQ29udHJvbHMgaG93IHRoZSB2aWV3IGRldGVybWluZXMgdGhlIHF1aWNrIGFjdGlvbiBzZWN0aW9uIGJ5IG1hcHBpbmcgdGhpcyBzdHJpbmcgd2l0aCB0aGF0IG9uIHRoZSBkZXRhaWwgdmlldyAoc2hvdWxkIGJlIG92ZXJ3cml0dGVuKVxyXG4gICAqL1xyXG4gIHF1aWNrQWN0aW9uU2VjdGlvbjogJ1F1aWNrQWN0aW9uc1NlY3Rpb24nLFxyXG4gIC8qKlxyXG4gICAqIEBkZXByZWNhdGVkXHJcbiAgICovXHJcbiAgZWRpdFRleHQ6IHJlc291cmNlLmVkaXRUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBGb250IGF3ZXNvbWUgaWNvbiB0byBiZSB1c2VkIGJ5IHRoZSBtb3JlIGxpc3QgaXRlbVxyXG4gICAqL1xyXG4gIGljb246ICdmYSBmYS1jaGV2cm9uJyxcclxuXHJcbiAgdmlld1R5cGU6ICdkZXRhaWwnLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBJbmZvcm1hdGlvbiB0ZXh0IHRoYXQgaXMgY29uY2F0ZW5hdGVkIHdpdGggdGhlIGVudGl0eSB0eXBlXHJcbiAgICovXHJcbiAgaW5mb3JtYXRpb25UZXh0OiByZXNvdXJjZS5pbmZvcm1hdGlvblRleHQsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIERlZmF1bHQgdGl0bGUgdGV4dCBzaG93biBpbiB0aGUgdG9wIHRvb2xiYXJcclxuICAgKi9cclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogRGVmYXVsdCB0ZXh0IHVzZWQgaW4gdGhlIGhlYWRlciB0aXRsZSwgZm9sbG93ZWQgYnkgaW5mb3JtYXRpb25cclxuICAgKi9cclxuICBlbnRpdHlUZXh0OiByZXNvdXJjZS5lbnRpdHlUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIEhlbHBlciBzdHJpbmcgZm9yIGEgYmFzaWMgc2VjdGlvbiBoZWFkZXIgdGV4dFxyXG4gICAqL1xyXG4gIGRldGFpbHNUZXh0OiByZXNvdXJjZS5kZXRhaWxzVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IHNob3duIHdoaWxlIGxvYWRpbmcgYW5kIHVzZWQgaW4gbG9hZGluZ1RlbXBsYXRlXHJcbiAgICovXHJcbiAgbG9hZGluZ1RleHQ6IHJlc291cmNlLmxvYWRpbmdUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgdXNlZCBpbiB0aGUgbm90QXZhaWxhYmxlVGVtcGxhdGVcclxuICAgKi9cclxuICBub3RBdmFpbGFibGVUZXh0OiByZXNvdXJjZS5ub3RBdmFpbGFibGVUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIEFSSUEgbGFiZWwgdGV4dCBmb3IgYSBjb2xsYXBzaWJsZSBzZWN0aW9uIGhlYWRlclxyXG4gICAqL1xyXG4gIHRvZ2dsZUNvbGxhcHNlVGV4dDogcmVzb3VyY2UudG9nZ2xlQ29sbGFwc2VUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIENTUyBjbGFzcyBmb3IgdGhlIGNvbGxhcHNlIGJ1dHRvbiB3aGVuIGluIGEgZXhwYW5kZWQgc3RhdGVcclxuICAgKi9cclxuICB0b2dnbGVDb2xsYXBzZUNsYXNzOiAnZmEgZmEtY2hldnJvbi1kb3duJyxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBDU1MgY2xhc3MgZm9yIHRoZSBjb2xsYXBzZSBidXR0b24gd2hlbiBpbiBhIGNvbGxhcHNlZCBzdGF0ZVxyXG4gICAqL1xyXG4gIHRvZ2dsZUV4cGFuZENsYXNzOiAnZmEgZmEtY2hldnJvbi1yaWdodCcsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIFRoZSB2aWV3IGlkIHRvIGJlIHRha2VuIHRvIHdoZW4gdGhlIEVkaXQgYnV0dG9uIGlzIHByZXNzZWQgaW4gdGhlIHRvb2xiYXJcclxuICAgKi9cclxuICBlZGl0VmlldzogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3RbXX1cclxuICAgKiBTdG9yZSBmb3IgbWFwcGluZyBsYXlvdXQgb3B0aW9ucyB0byBhbiBpbmRleCBvbiB0aGUgSFRNTCBub2RlXHJcbiAgICovXHJcbiAgX25hdmlnYXRpb25PcHRpb25zOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBGbGFnIHRvIHNpZ25hbCB0aGF0IHRoZSBpbnRlcmZhY2UgaXMgbG9hZGluZyBhbmQgY2xpY2tpbmcgcmVmcmVzaCB3aWxsIGJlIGlnbm9yZWQgdG8gcHJldmVudCBkb3VibGUgZW50aXR5IGxvYWRpbmdcclxuICAgKi9cclxuICBpc1JlZnJlc2hpbmc6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIERldGVybWluZXMgdGhlIFNvSG8gY2xhc3MgaW1wbGVtZW50ZWQgaW4gcHJvcGVydHkgdGVtcGxhdGVzXHJcbiAgICovXHJcbiAgbXVsdGlDb2x1bW5DbGFzczogJ2ZvdXInLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfVxyXG4gICAqIERldGVybWluZXMgaG93IG1hbnkgY29sdW1ucyB0aGUgZGV0YWlsIHZpZXcgcHJvcGVydHkgdmlld3Mgc2hvdWxkIGNvbnRhaW5cclxuICAgKi9cclxuICBtdWx0aUNvbHVtbkNvdW50OiAzLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gaW4gdGhlIHRvcCB0b29sYmFyIHJlZnJlc2ggYnV0dG9uXHJcbiAgICovXHJcbiAgcmVmcmVzaFRvb2x0aXBUZXh0OiByZXNvdXJjZS5yZWZyZXNoVG9vbHRpcFRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCBzaG93biBpbiB0aGUgdG9wIHRvb2xiYXIgZWRpdCBidXR0b25cclxuICAgKi9cclxuICBlZGl0VG9vbHRpcFRleHQ6IHJlc291cmNlLmVkaXRUb29sdGlwVGV4dCxcclxuXHJcbiAgLy8gU3RvcmUgcHJvcGVydGllc1xyXG4gIGl0ZW1zUHJvcGVydHk6ICcnLFxyXG4gIGlkUHJvcGVydHk6ICcnLFxyXG4gIGxhYmVsUHJvcGVydHk6ICcnLFxyXG4gIGVudGl0eVByb3BlcnR5OiAnJyxcclxuICB2ZXJzaW9uUHJvcGVydHk6ICcnLFxyXG5cclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSBkaWppdCB3aWRnZXQgcG9zdENyZWF0ZSB0byBzdWJzY3JpYmUgdG8gdGhlIGdsb2JhbCBgL2FwcC9yZWZyZXNoYCBldmVudCBhbmQgY2xlYXIgdGhlIHZpZXcuXHJcbiAgICovXHJcbiAgcG9zdENyZWF0ZTogZnVuY3Rpb24gcG9zdENyZWF0ZSgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHBvc3RDcmVhdGUsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnN1YnNjcmliZSgnL2FwcC9yZWZyZXNoJywgdGhpcy5fb25SZWZyZXNoKTtcclxuICAgIHRoaXMuY2xlYXIoKTtcclxuICB9LFxyXG4gIGNyZWF0ZUVycm9ySGFuZGxlcnM6IGZ1bmN0aW9uIGNyZWF0ZUVycm9ySGFuZGxlcnMoKSB7XHJcbiAgICB0aGlzLmVycm9ySGFuZGxlcnMgPSB0aGlzLmVycm9ySGFuZGxlcnMgfHwgW3tcclxuICAgICAgbmFtZTogJ0Fib3J0ZWQnLFxyXG4gICAgICB0ZXN0OiAoZXJyb3IpID0+IHtcclxuICAgICAgICByZXR1cm4gZXJyb3IuYWJvcnRlZDtcclxuICAgICAgfSxcclxuICAgICAgaGFuZGxlOiAoZXJyb3IsIG5leHQpID0+IHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBmYWxzZTsgLy8gZm9yY2UgYSByZWZyZXNoXHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9LFxyXG4gICAgfSwge1xyXG4gICAgICBuYW1lOiAnQWxlcnRFcnJvcicsXHJcbiAgICAgIHRlc3Q6IChlcnJvcikgPT4ge1xyXG4gICAgICAgIHJldHVybiBlcnJvci5zdGF0dXMgIT09IHRoaXMuSFRUUF9TVEFUVVMuTk9UX0ZPVU5EICYmICFlcnJvci5hYm9ydGVkO1xyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGU6IChlcnJvciwgbmV4dCkgPT4ge1xyXG4gICAgICAgIGFsZXJ0KHRoaXMuZ2V0RXJyb3JNZXNzYWdlKGVycm9yKSk7IC8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSxcclxuICAgIH0sIHtcclxuICAgICAgbmFtZTogJ05vdEZvdW5kJyxcclxuICAgICAgdGVzdDogKGVycm9yKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yLnN0YXR1cyA9PT0gdGhpcy5IVFRQX1NUQVRVUy5OT1RfRk9VTkQ7XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZTogKGVycm9yLCBuZXh0KSA9PiB7XHJcbiAgICAgICAgJCh0aGlzLmNvbnRlbnROb2RlKS5lbXB0eSgpLmFwcGVuZCh0aGlzLm5vdEF2YWlsYWJsZVRlbXBsYXRlLmFwcGx5KHRoaXMpKTtcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LCB7XHJcbiAgICAgIG5hbWU6ICdDYXRjaEFsbCcsXHJcbiAgICAgIHRlc3Q6ICgpID0+IHRydWUsXHJcbiAgICAgIGhhbmRsZTogKGVycm9yLCBuZXh0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZnJvbUNvbnRleHQgPSB0aGlzLm9wdGlvbnMuZnJvbUNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmZyb21Db250ZXh0ID0gbnVsbDtcclxuICAgICAgICBjb25zdCBlcnJvckl0ZW0gPSB7XHJcbiAgICAgICAgICB2aWV3T3B0aW9uczogdGhpcy5vcHRpb25zLFxyXG4gICAgICAgICAgc2VydmVyRXJyb3I6IGVycm9yLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEVycm9yTWFuYWdlci5hZGRFcnJvcih0aGlzLmdldEVycm9yTWVzc2FnZShlcnJvciksIGVycm9ySXRlbSk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmZyb21Db250ZXh0ID0gZnJvbUNvbnRleHQ7XHJcbiAgICAgICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9LFxyXG4gICAgfV07XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZXJyb3JIYW5kbGVycztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgYW5kIHJldHVybnMgdGhlIHRvb2xiYXIgaXRlbSBsYXlvdXQgZGVmaW5pdGlvbiwgdGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiBpbiB0aGUgdmlld1xyXG4gICAqIHNvIHRoYXQgeW91IG1heSBkZWZpbmUgdGhlIHZpZXdzIHRvb2xiYXIgaXRlbXMuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzLnRvb2xzXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICovXHJcbiAgY3JlYXRlVG9vbExheW91dDogZnVuY3Rpb24gY3JlYXRlVG9vbExheW91dCgpIHtcclxuICAgIGNvbnN0IHRvb2xzID0gW107XHJcblxyXG4gICAgaWYgKHRoaXMuZWRpdFZpZXcpIHtcclxuICAgICAgdG9vbHMucHVzaCh7XHJcbiAgICAgICAgaWQ6ICdlZGl0JyxcclxuICAgICAgICBzdmc6ICdlZGl0JyxcclxuICAgICAgICB0aXRsZTogdGhpcy5lZGl0VG9vbHRpcFRleHQsXHJcbiAgICAgICAgYWN0aW9uOiAnbmF2aWdhdGVUb0VkaXRWaWV3JyxcclxuICAgICAgICBzZWN1cml0eTogQXBwLmdldFZpZXdTZWN1cml0eSh0aGlzLmVkaXRWaWV3LCAndXBkYXRlJyksXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRvb2xzLnB1c2goe1xyXG4gICAgICBpZDogJ3JlZnJlc2gnLFxyXG4gICAgICBzdmc6ICdyZWZyZXNoJyxcclxuICAgICAgdGl0bGU6IHRoaXMucmVmcmVzaFRvb2x0aXBUZXh0LFxyXG4gICAgICBhY3Rpb246ICdfcmVmcmVzaENsaWNrZWQnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudG9vbHMgfHwgKHRoaXMudG9vbHMgPSB7XHJcbiAgICAgIHRiYXI6IHRvb2xzLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBfcmVmcmVzaENsaWNrZWQ6IGZ1bmN0aW9uIF9yZWZyZXNoQ2xpY2tlZCgpIHtcclxuICAgIC8vIElmIHRoZSB1c2VyIGhhcyBoaXQgcmVmcmVzaCBhbHJlYWR5LCBsZXQgdGhlIGludGVyZmFjZSBsb2FkIGZpcnN0IHNldCBvZiBhc3NldHNcclxuICAgIGlmICh0aGlzLmlzUmVmcmVzaGluZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmlzUmVmcmVzaGluZyA9IHRydWU7XHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcbiAgICB0aGlzLnJlZnJlc2goKTtcclxuXHJcbiAgICB0aGlzLm9uUmVmcmVzaENsaWNrZWQoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgcmVmcmVzaCB0b29sYmFyIGJ1dHRvbi5cclxuICAgKi9cclxuICBvblJlZnJlc2hDbGlja2VkOiBmdW5jdGlvbiBvblJlZnJlc2hDbGlja2VkKCkge30sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUge0BsaW5rIF9BY3Rpb25NaXhpbiNpbnZva2VBY3Rpb24gbWl4aW5zIGludm9rZUFjdGlvbn0gdG8gc3RvcCBpZiBgZGF0YS1kaXNhYmxlQWN0aW9uYCBpcyB0cnVlXHJcbiAgICogQHBhcmFtIG5hbWVcclxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1ldGVycyBDb2xsZWN0aW9uIG9mIGBkYXRhLWAgYXR0cmlidXRlcyBmcm9tIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICAgKi9cclxuICBpbnZva2VBY3Rpb246IGZ1bmN0aW9uIGludm9rZUFjdGlvbihuYW1lLCBwYXJhbWV0ZXJzIC8qICwgZXZ0LCBlbCovKSB7XHJcbiAgICBpZiAocGFyYW1ldGVycyAmJiAvdHJ1ZS9pLnRlc3QocGFyYW1ldGVycy5kaXNhYmxlQWN0aW9uKSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmluaGVyaXRlZChpbnZva2VBY3Rpb24sIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBUb2dnbGVzIHRoZSBjb2xsYXBzZWQgc3RhdGUgb2YgdGhlIHNlY3Rpb24uXHJcbiAgICovXHJcbiAgdG9nZ2xlU2VjdGlvbjogZnVuY3Rpb24gdG9nZ2xlU2VjdGlvbihwYXJhbXMpIHtcclxuICAgIGNvbnN0IG5vZGUgPSAkKGAjJHtwYXJhbXMuJHNvdXJjZX1gKTtcclxuICAgIGlmIChub2RlLmxlbmd0aCkge1xyXG4gICAgICBub2RlLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZWQnKTtcclxuICAgICAgY29uc3QgYnV0dG9uID0gJCgnYnV0dG9uJywgbm9kZSkuZmlyc3QoKTtcclxuICAgICAgaWYgKGJ1dHRvbi5sZW5ndGgpIHtcclxuICAgICAgICBidXR0b24udG9nZ2xlQ2xhc3ModGhpcy50b2dnbGVDb2xsYXBzZUNsYXNzKTtcclxuICAgICAgICBidXR0b24udG9nZ2xlQ2xhc3ModGhpcy50b2dnbGVFeHBhbmRDbGFzcyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHRoZSBnZXR0aW5nIHRoZSBkZXRhaWwgcmVzb3VyY2UgdHlwZSBmcm9tIHRoZSBpZCBhbmQgcGxhY2luZyB0aGUgaGVhZGVyIGludG8gdGhlIGRldGFpbCB2aWV3Li5cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIHBsYWNlRGV0YWlsSGVhZGVyOiBmdW5jdGlvbiBwbGFjZURldGFpbEhlYWRlcigpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gc3RyaW5nLnN1YnN0aXR1dGUodGhpcy5pbmZvcm1hdGlvblRleHQsIFt0aGlzLmVudGl0eVRleHRdKTtcclxuICAgICQodGhpcy50YWJDb250YWluZXIpLmJlZm9yZSh0aGlzLmRldGFpbEhlYWRlclRlbXBsYXRlLmFwcGx5KHsgdmFsdWUgfSwgdGhpcykpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdGhlIGdsb2JhbCBgL2FwcC9yZWZyZXNoYCBldmVudC4gU2V0cyBgcmVmcmVzaFJlcXVpcmVkYCB0byB0cnVlIGlmIHRoZSBrZXkgbWF0Y2hlcy5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBUaGUgb2JqZWN0IHB1Ymxpc2hlZCBieSB0aGUgZXZlbnQuXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBfb25SZWZyZXNoOiBmdW5jdGlvbiBfb25SZWZyZXNoKG8pIHtcclxuICAgIGNvbnN0IGRlc2NyaXB0b3IgPSBvLmRhdGEgJiYgby5kYXRhW3RoaXMubGFiZWxQcm9wZXJ0eV07XHJcblxyXG4gICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMua2V5ID09PSBvLmtleSkge1xyXG4gICAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcblxyXG4gICAgICBpZiAoZGVzY3JpcHRvcikge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucy50aXRsZSA9IGRlc2NyaXB0b3I7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3RpdGxlJywgZGVzY3JpcHRvcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHRoZSByZWxhdGVkIGVudHJ5IGFjdGlvbiwgbmF2aWdhdGVzIHRvIHRoZSBkZWZpbmVkIGBkYXRhLXZpZXdgIHBhc3NpbmcgdGhlIGBkYXRhLWNvbnRleHRgLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgQ29sbGVjdGlvbiBvZiBgZGF0YS1gIGF0dHJpYnV0ZXMgZnJvbSB0aGUgc291cmNlIG5vZGUuXHJcbiAgICovXHJcbiAgYWN0aXZhdGVSZWxhdGVkRW50cnk6IGZ1bmN0aW9uIGFjdGl2YXRlUmVsYXRlZEVudHJ5KHBhcmFtcykge1xyXG4gICAgaWYgKHBhcmFtcy5jb250ZXh0KSB7XHJcbiAgICAgIHRoaXMubmF2aWdhdGVUb1JlbGF0ZWRWaWV3KHBhcmFtcy52aWV3LCBwYXJzZUludChwYXJhbXMuY29udGV4dCwgMTApLCBwYXJhbXMuZGVzY3JpcHRvcik7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgcmVsYXRlZCBsaXN0IGFjdGlvbiwgbmF2aWdhdGVzIHRvIHRoZSBkZWZpbmVkIGBkYXRhLXZpZXdgIHBhc3NpbmcgdGhlIGBkYXRhLWNvbnRleHRgLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgQ29sbGVjdGlvbiBvZiBgZGF0YS1gIGF0dHJpYnV0ZXMgZnJvbSB0aGUgc291cmNlIG5vZGUuXHJcbiAgICovXHJcbiAgYWN0aXZhdGVSZWxhdGVkTGlzdDogZnVuY3Rpb24gYWN0aXZhdGVSZWxhdGVkTGlzdChwYXJhbXMpIHtcclxuICAgIGlmIChwYXJhbXMuY29udGV4dCkge1xyXG4gICAgICB0aGlzLm5hdmlnYXRlVG9SZWxhdGVkVmlldyhwYXJhbXMudmlldywgcGFyc2VJbnQocGFyYW1zLmNvbnRleHQsIDEwKSwgcGFyYW1zLmRlc2NyaXB0b3IpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogTmF2aWdhdGVzIHRvIHRoZSBkZWZpbmVkIGB0aGlzLmVkaXRWaWV3YCBwYXNzaW5nIHRoZSBjdXJyZW50IGB0aGlzLmVudHJ5YCBhcyBkZWZhdWx0IGRhdGEuXHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICAgKi9cclxuICBuYXZpZ2F0ZVRvRWRpdFZpZXc6IGZ1bmN0aW9uIG5hdmlnYXRlVG9FZGl0VmlldygvKiBlbCovKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gQXBwLmdldFZpZXcodGhpcy5lZGl0Vmlldyk7XHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICBjb25zdCBlbnRyeSA9IHRoaXMuZW50cnk7XHJcbiAgICAgIHZpZXcuc2hvdyh7XHJcbiAgICAgICAgZW50cnksXHJcbiAgICAgICAgZnJvbUNvbnRleHQ6IHRoaXMsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogTmF2aWdhdGVzIHRvIGEgZ2l2ZW4gdmlldyBpZCBwYXNzaW5nIHRoZSBvcHRpb25zIHJldHJpZXZlZCB1c2luZyB0aGUgc2xvdCBpbmRleCB0byBgdGhpcy5fbmF2aWdhdGlvbk9wdGlvbnNgLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBWaWV3IGlkIHRvIGdvIHRvXHJcbiAgICogQHBhcmFtIHtOdW1iZXJ9IHNsb3QgSW5kZXggb2YgdGhlIGNvbnRleHQgdG8gdXNlIGluIGB0aGlzLl9uYXZpZ2F0aW9uT3B0aW9uc2AuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRlc2NyaXB0b3IgT3B0aW9uYWwgZGVzY3JpcHRvciBvcHRpb24gdGhhdCBpcyBtaXhlZCBpbi5cclxuICAgKi9cclxuICBuYXZpZ2F0ZVRvUmVsYXRlZFZpZXc6IGZ1bmN0aW9uIG5hdmlnYXRlVG9SZWxhdGVkVmlldyhpZCwgc2xvdCwgZGVzY3JpcHRvcikge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMuX25hdmlnYXRpb25PcHRpb25zW3Nsb3RdO1xyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRWaWV3KGlkKTtcclxuXHJcbiAgICBpZiAoZGVzY3JpcHRvciAmJiBvcHRpb25zKSB7XHJcbiAgICAgIG9wdGlvbnMuZGVzY3JpcHRvciA9IGRlc2NyaXB0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuZW50cnkpIHtcclxuICAgICAgb3B0aW9ucy5zZWxlY3RlZEVudHJ5ID0gdGhpcy5lbnRyeTtcclxuICAgIH1cclxuXHJcbiAgICBvcHRpb25zLmZyb21Db250ZXh0ID0gdGhpcztcclxuICAgIGlmICh2aWV3ICYmIG9wdGlvbnMpIHtcclxuICAgICAgdmlldy5zaG93KG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyBhbmQgcmV0dXJucyB0aGUgRGV0YWlsIHZpZXcgbGF5b3V0IGJ5IGZvbGxvd2luZyBhIHN0YW5kYXJkIGZvciBzZWN0aW9uIGFuZCByb3dzOlxyXG4gICAqXHJcbiAgICogVGhlIGB0aGlzLmxheW91dGAgaXRzZWxmIGlzIGFuIGFycmF5IG9mIHNlY3Rpb24gb2JqZWN0cyB3aGVyZSBhIHNlY3Rpb24gb2JqZWN0IGlzIGRlZmluZWQgYXMgc3VjaDpcclxuICAgKlxyXG4gICAqICAgICB7XHJcbiAgICogICAgICAgIG5hbWU6ICdTdHJpbmcnLCAvLyBSZXF1aXJlZC4gdW5pcXVlIG5hbWUgZm9yIGlkZW50aWZpY2F0aW9uL2N1c3RvbWl6YXRpb24gcHVycG9zZXNcclxuICAgKiAgICAgICAgdGl0bGU6ICdTdHJpbmcnLCAvLyBSZXF1aXJlZC4gVGV4dCBzaG93biBpbiB0aGUgc2VjdGlvbiBoZWFkZXJcclxuICAgKiAgICAgICAgbGlzdDogYm9vbGVhbiwgLy8gT3B0aW9uYWwuIERlZmF1bHQgZmFsc2UuIENvbnRyb2xzIGlmIHRoZSBncm91cCBjb250YWluZXIgZm9yIGNoaWxkIHJvd3Mgc2hvdWxkIGJlIGEgZGl2IChmYWxzZSkgb3IgdWwgKHRydWUpXHJcbiAgICogICAgICAgIGNoaWxkcmVuOiBbXSwgLy8gQXJyYXkgb2YgY2hpbGQgcm93IG9iamVjdHNcclxuICAgKiAgICAgfVxyXG4gICAqXHJcbiAgICogQSBjaGlsZCByb3cgb2JqZWN0IGhhczpcclxuICAgKlxyXG4gICAqICAgICB7XHJcbiAgICogICAgICAgIG5hbWU6ICdTdHJpbmcnLCAvLyBSZXF1aXJlZC4gdW5pcXVlIG5hbWUgZm9yIGlkZW50aWZpY2F0aW9uL2N1c3RvbWl6YXRpb24gcHVycG9zZXNcclxuICAgKiAgICAgICAgcHJvcGVydHk6ICdTdHJpbmcnLCAvLyBPcHRpb25hbC4gVGhlIHByb3BlcnR5IG9mIHRoZSBjdXJyZW50IGVudGl0eSB0byBiaW5kIHRvXHJcbiAgICogICAgICAgIGxhYmVsOiAnU3RyaW5nJywgLy8gT3B0aW9uYWwuIFRleHQgc2hvd24gaW4gdGhlIGxhYmVsIHRvIHRoZSBsZWZ0IG9mIHRoZSBwcm9wZXJ0eVxyXG4gICAqICAgICAgICBvbkNyZWF0ZTogZnVuY3Rpb24oKSwgLy8gT3B0aW9uYWwuIFlvdSBtYXkgcGFzcyBhIGZ1bmN0aW9uIHRvIGJlIGNhbGxlZCB3aGVuIHRoZSByb3cgaXMgYWRkZWQgdG8gdGhlIERPTVxyXG4gICAqICAgICAgICBpbmNsdWRlOiBib29sZWFuLCAvLyBPcHRpb25hbC4gSWYgZmFsc2UgdGhlIHJvdyB3aWxsIG5vdCBiZSBpbmNsdWRlZCBpbiB0aGUgbGF5b3V0XHJcbiAgICogICAgICAgIGV4Y2x1ZGU6IGJvb2xlYW4sIC8vIE9wdGlvbmFsLiBJZiB0cnVlIHRoZSByb3cgd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gdGhlIGxheW91dFxyXG4gICAqICAgICAgICB0ZW1wbGF0ZTogU2ltcGxhdGUsIC8vIE9wdGlvbmFsLiBPdmVycmlkZSB0aGUgSFRNTCBTaW1wbGF0ZSB1c2VkIGZvciByZW5kZXJpbmcgdGhlIHZhbHVlIChub3QgdGhlIHJvdykgd2hlcmUgYCRgIGlzIHRoZSByb3cgb2JqZWN0XHJcbiAgICogICAgICAgIHRwbDogU2ltcGxhdGUsIC8vIE9wdGlvbmFsLiBTYW1lIGFzIHRlbXBsYXRlLlxyXG4gICAqICAgICAgICByZW5kZXJlcjogZnVuY3Rpb24oKSwgLy8gT3B0aW9uYWwuIFBhc3MgYSBmdW5jdGlvbiB0aGF0IHJlY2VpdmVzIHRoZSBjdXJyZW50IHZhbHVlIGFuZCByZXR1cm5zIGEgdmFsdWUgdG8gYmUgcmVuZGVyZWRcclxuICAgKiAgICAgICAgZW5jb2RlOiBib29sZWFuLCAvLyBPcHRpb25hbC4gSWYgdHJ1ZSBpdCB3aWxsIGVuY29kZSBIVE1MIGVudGl0aWVzXHJcbiAgICogICAgICAgIGNsczogJ1N0cmluZycsIC8vIE9wdGlvbmFsLiBBZGRpdGlvbmFsIENTUyBjbGFzcyBzdHJpbmcgdG8gYmUgYWRkZWQgdG8gdGhlIHJvdyBkaXZcclxuICAgKiAgICAgICAgdXNlOiBTaW1wbGF0ZSwgLy8gT3B0aW9uYWwuIE92ZXJyaWRlIHRoZSBIVE1MIFNpbXBsYXRlIHVzZWQgZm9yIHJlbmRlcmluZyB0aGUgcm93IChub3QgdmFsdWUpXHJcbiAgICogICAgICAgIHByb3ZpZGVyOiBmdW5jdGlvbihlbnRyeSwgcHJvcGVydHlOYW1lKSwgLy8gT3B0aW9uYWwuIEZ1bmN0aW9uIHRoYXQgYWNjZXB0cyB0aGUgZGF0YSBlbnRyeSBhbmQgdGhlIHByb3BlcnR5IG5hbWUgYW5kIHJldHVybnMgdGhlIGV4dHJhY3RlZCB2YWx1ZS4gQnkgZGVmYXVsdCBzaW1wbHkgZXh0cmFjdHMgZGlyZWN0bHkuXHJcbiAgICogICAgICAgIHZhbHVlOiBBbnkgLy8gT3B0aW9uYWwuIFByb3ZpZGUgYSB2YWx1ZSBkaXJlY3RseSBpbnN0ZWFkIG9mIGJpbmRpbmdcclxuICAgKiAgICAgfVxyXG4gICAqXHJcbiAgICogQHJldHVybiB7T2JqZWN0W119IERldGFpbCBsYXlvdXQgZGVmaW5pdGlvblxyXG4gICAqL1xyXG4gIGNyZWF0ZUxheW91dDogZnVuY3Rpb24gY3JlYXRlTGF5b3V0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5b3V0IHx8IFtdO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUHJvY2Vzc2VzIHRoZSBnaXZlbiBsYXlvdXQgZGVmaW5pdGlvbiB1c2luZyB0aGUgZGF0YSBlbnRyeSByZXNwb25zZSBieSByZW5kZXJpbmcgYW5kIGluc2VydGluZyB0aGUgSFRNTCBub2RlcyBhbmRcclxuICAgKiBmaXJpbmcgYW55IG9uQ3JlYXRlIGV2ZW50cyBkZWZpbmVkLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IGxheW91dCBMYXlvdXQgZGVmaW5pdGlvblxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSBkYXRhIHJlc3BvbnNlXHJcbiAgICovXHJcbiAgcHJvY2Vzc0xheW91dDogZnVuY3Rpb24gcHJvY2Vzc0xheW91dChsYXlvdXQsIGVudHJ5KSB7XHJcbiAgICBjb25zdCBpdGVtcyA9IChsYXlvdXQuY2hpbGRyZW4gfHwgbGF5b3V0LmFzIHx8IGxheW91dCk7XHJcbiAgICBjb25zdCBvcHRpb25zID0gbGF5b3V0Lm9wdGlvbnMgfHwgKGxheW91dC5vcHRpb25zID0ge1xyXG4gICAgICB0aXRsZTogdGhpcy5kZXRhaWxzVGV4dCxcclxuICAgIH0pO1xyXG4gICAgY29uc3Qgc2VjdGlvblF1ZXVlID0gW107XHJcbiAgICBsZXQgc2VjdGlvblN0YXJ0ZWQgPSBmYWxzZTtcclxuICAgIGNvbnN0IGNhbGxiYWNrcyA9IFtdO1xyXG4gICAgbGV0IHJvdyA9IFtdO1xyXG5cclxuICAgIGxldCBzZWN0aW9uTm9kZTtcclxuXHJcbiAgICBpZiAodGhpcy5pc1RhYmJlZCkge1xyXG4gICAgICB0aGlzLnBsYWNlVGFiTGlzdCh0aGlzLmNvbnRlbnROb2RlKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGl0ZW1zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBpdGVtc1tpXTtcclxuICAgICAgY29uc3QgaW5jbHVkZSA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LmluY2x1ZGUsIGVudHJ5KTtcclxuICAgICAgY29uc3QgZXhjbHVkZSA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LmV4Y2x1ZGUsIGVudHJ5KTtcclxuICAgICAgbGV0IGNvbnRleHQ7XHJcblxyXG4gICAgICBpZiAoaW5jbHVkZSAhPT0gdW5kZWZpbmVkICYmICFpbmNsdWRlKSB7XHJcbiAgICAgICAgaWYgKGkgPj0gKGl0ZW1zLmxlbmd0aCAtIDEpICYmIHJvdy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBjb25zdCByb3dOb2RlID0gdGhpcy5jcmVhdGVSb3cocm93KTtcclxuICAgICAgICAgICQoc2VjdGlvbk5vZGUpLmFwcGVuZChyb3dOb2RlKTtcclxuICAgICAgICAgIHJvdyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGV4Y2x1ZGUgIT09IHVuZGVmaW5lZCAmJiBleGNsdWRlKSB7XHJcbiAgICAgICAgaWYgKGkgPj0gKGl0ZW1zLmxlbmd0aCAtIDEpICYmIHJvdy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBjb25zdCByb3dOb2RlID0gdGhpcy5jcmVhdGVSb3cocm93KTtcclxuICAgICAgICAgICQoc2VjdGlvbk5vZGUpLmFwcGVuZChyb3dOb2RlKTtcclxuICAgICAgICAgIHJvdyA9IFtdO1xyXG4gICAgICAgIH1cclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnQuY2hpbGRyZW4gfHwgY3VycmVudC5hcykge1xyXG4gICAgICAgIGlmIChzZWN0aW9uU3RhcnRlZCkge1xyXG4gICAgICAgICAgc2VjdGlvblF1ZXVlLnB1c2goY3VycmVudCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMucHJvY2Vzc0xheW91dChjdXJyZW50LCBlbnRyeSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFzZWN0aW9uU3RhcnRlZCkge1xyXG4gICAgICAgIGxldCBzZWN0aW9uO1xyXG4gICAgICAgIHNlY3Rpb25TdGFydGVkID0gdHJ1ZTtcclxuICAgICAgICBpZiAodGhpcy5pc1RhYmJlZCkge1xyXG4gICAgICAgICAgaWYgKGxheW91dC5uYW1lID09PSB0aGlzLnF1aWNrQWN0aW9uU2VjdGlvbikge1xyXG4gICAgICAgICAgICBzZWN0aW9uID0gJCh0aGlzLnNlY3Rpb25CZWdpblRlbXBsYXRlLmFwcGx5KGxheW91dCwgdGhpcykgKyB0aGlzLnNlY3Rpb25FbmRUZW1wbGF0ZS5hcHBseShsYXlvdXQsIHRoaXMpKTtcclxuICAgICAgICAgICAgc2VjdGlvbk5vZGUgPSBzZWN0aW9uLmdldCgwKTtcclxuICAgICAgICAgICAgJCh0aGlzLnF1aWNrQWN0aW9ucykuYXBwZW5kKHNlY3Rpb24pO1xyXG4gICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgY29uc3QgdGFiID0gJCh0aGlzLnRhYkxpc3RJdGVtVGVtcGxhdGUuYXBwbHkobGF5b3V0LCB0aGlzKSkuZ2V0KDApO1xyXG4gICAgICAgICAgICBzZWN0aW9uID0gJCh0aGlzLnNlY3Rpb25CZWdpblRlbXBsYXRlLmFwcGx5KGxheW91dCwgdGhpcykgKyB0aGlzLnNlY3Rpb25FbmRUZW1wbGF0ZS5hcHBseShsYXlvdXQsIHRoaXMpKTtcclxuICAgICAgICAgICAgc2VjdGlvbk5vZGUgPSBzZWN0aW9uLmdldCgwKTtcclxuICAgICAgICAgICAgdGhpcy50YWJNYXBwaW5nLnB1c2goc2VjdGlvbi5nZXQoMCkpO1xyXG4gICAgICAgICAgICB0aGlzLnRhYnMucHVzaCh0YWIpO1xyXG4gICAgICAgICAgICAkKHRoaXMudGFiQ29udGFpbmVyKS5hcHBlbmQoc2VjdGlvbik7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHNlY3Rpb24gPSAkKHRoaXMuc2VjdGlvbkJlZ2luVGVtcGxhdGUuYXBwbHkobGF5b3V0LCB0aGlzKSArIHRoaXMuc2VjdGlvbkVuZFRlbXBsYXRlLmFwcGx5KGxheW91dCwgdGhpcykpO1xyXG4gICAgICAgICAgc2VjdGlvbk5vZGUgPSBzZWN0aW9uLmdldCgwKS5jaGlsZE5vZGVzWzFdO1xyXG4gICAgICAgICAgJCh0aGlzLnRhYkNvbnRhaW5lcikuYXBwZW5kKHNlY3Rpb24pO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgcHJvdmlkZXIgPSBjdXJyZW50LnByb3ZpZGVyIHx8IHV0aWxpdHkuZ2V0VmFsdWU7XHJcbiAgICAgIGNvbnN0IHByb3BlcnR5ID0gdHlwZW9mIGN1cnJlbnQucHJvcGVydHkgPT09ICdzdHJpbmcnID8gY3VycmVudC5wcm9wZXJ0eSA6IGN1cnJlbnQubmFtZTtcclxuICAgICAgY29uc3QgdmFsdWUgPSB0eXBlb2YgY3VycmVudC52YWx1ZSA9PT0gJ3VuZGVmaW5lZCcgPyBwcm92aWRlcihlbnRyeSwgcHJvcGVydHksIGVudHJ5KSA6IGN1cnJlbnQudmFsdWU7XHJcbiAgICAgIGxldCByZW5kZXJlZDtcclxuICAgICAgbGV0IGZvcm1hdHRlZDtcclxuICAgICAgaWYgKGN1cnJlbnQudGVtcGxhdGUgfHwgY3VycmVudC50cGwpIHtcclxuICAgICAgICByZW5kZXJlZCA9IChjdXJyZW50LnRlbXBsYXRlIHx8IGN1cnJlbnQudHBsKS5hcHBseSh2YWx1ZSwgdGhpcyk7XHJcbiAgICAgICAgZm9ybWF0dGVkID0gY3VycmVudC5lbmNvZGUgPT09IHRydWUgPyBmb3JtYXQuZW5jb2RlKHJlbmRlcmVkKSA6IHJlbmRlcmVkO1xyXG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnQucmVuZGVyZXIgJiYgdHlwZW9mIGN1cnJlbnQucmVuZGVyZXIgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICByZW5kZXJlZCA9IGN1cnJlbnQucmVuZGVyZXIuY2FsbCh0aGlzLCB2YWx1ZSk7XHJcbiAgICAgICAgZm9ybWF0dGVkID0gY3VycmVudC5lbmNvZGUgPT09IHRydWUgPyBmb3JtYXQuZW5jb2RlKHJlbmRlcmVkKSA6IHJlbmRlcmVkO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGZvcm1hdHRlZCA9IGN1cnJlbnQuZW5jb2RlICE9PSBmYWxzZSA/IGZvcm1hdC5lbmNvZGUodmFsdWUpIDogdmFsdWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGRhdGEgPSBsYW5nLm1peGluKHt9LCB7XHJcbiAgICAgICAgZW50cnksXHJcbiAgICAgICAgdmFsdWU6IGZvcm1hdHRlZCxcclxuICAgICAgICByYXc6IHZhbHVlLFxyXG4gICAgICB9LCBjdXJyZW50KTtcclxuXHJcbiAgICAgIGlmIChjdXJyZW50LmRlc2NyaXB0b3IpIHtcclxuICAgICAgICBkYXRhLmRlc2NyaXB0b3IgPSB0eXBlb2YgY3VycmVudC5kZXNjcmlwdG9yID09PSAnZnVuY3Rpb24nID8gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQuZGVzY3JpcHRvciwgZW50cnksIHZhbHVlKSA6IHByb3ZpZGVyKGVudHJ5LCBjdXJyZW50LmRlc2NyaXB0b3IpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY3VycmVudC5hY3Rpb24pIHtcclxuICAgICAgICBkYXRhLmFjdGlvbiA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LmFjdGlvbiwgZW50cnksIHZhbHVlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgaGFzQWNjZXNzID0gQXBwLmhhc0FjY2Vzc1RvKGN1cnJlbnQuc2VjdXJpdHkpO1xyXG5cclxuICAgICAgaWYgKGN1cnJlbnQuc2VjdXJpdHkpIHtcclxuICAgICAgICBkYXRhLmRpc2FibGVkID0gIWhhc0FjY2VzcztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnQuZGlzYWJsZWQgJiYgaGFzQWNjZXNzKSB7XHJcbiAgICAgICAgZGF0YS5kaXNhYmxlZCA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LmRpc2FibGVkLCBlbnRyeSwgdmFsdWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY3VycmVudC52aWV3KSB7XHJcbiAgICAgICAgY29udGV4dCA9IGxhbmcubWl4aW4oe30sIGN1cnJlbnQub3B0aW9ucyk7XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50LmtleSkge1xyXG4gICAgICAgICAgY29udGV4dC5rZXkgPSB0eXBlb2YgY3VycmVudC5rZXkgPT09ICdmdW5jdGlvbicgPyB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5rZXksIGVudHJ5KSA6IHByb3ZpZGVyKGVudHJ5LCBjdXJyZW50LmtleSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50LndoZXJlKSB7XHJcbiAgICAgICAgICBjb250ZXh0LndoZXJlID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQud2hlcmUsIGVudHJ5KTtcclxuICAgICAgICAgIGlmIChjb250ZXh0LndoZXJlID09PSAnJykge1xyXG4gICAgICAgICAgICBkYXRhLmRpc2FibGVkID0gdHJ1ZTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnQuY29udHJhY3ROYW1lKSB7XHJcbiAgICAgICAgICBjb250ZXh0LmNvbnRyYWN0TmFtZSA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LmNvbnRyYWN0TmFtZSwgZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudC5yZXNvdXJjZUtpbmQpIHtcclxuICAgICAgICAgIGNvbnRleHQucmVzb3VyY2VLaW5kID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQucmVzb3VyY2VLaW5kLCBlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50LnJlc291cmNlUHJvcGVydHkpIHtcclxuICAgICAgICAgIGNvbnRleHQucmVzb3VyY2VQcm9wZXJ0eSA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LnJlc291cmNlUHJvcGVydHksIGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnQucmVzb3VyY2VQcmVkaWNhdGUpIHtcclxuICAgICAgICAgIGNvbnRleHQucmVzb3VyY2VQcmVkaWNhdGUgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5yZXNvdXJjZVByZWRpY2F0ZSwgZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudC5kYXRhU2V0KSB7XHJcbiAgICAgICAgICBjb250ZXh0LmRhdGFTZXQgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5kYXRhU2V0LCBlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50LnRpdGxlKSB7XHJcbiAgICAgICAgICBjb250ZXh0LnRpdGxlID0gY3VycmVudC50aXRsZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmIChjdXJyZW50LnJlc2V0U2VhcmNoKSB7XHJcbiAgICAgICAgICBjb250ZXh0LnJlc2V0U2VhcmNoID0gY3VycmVudC5yZXNldFNlYXJjaDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29udGV4dC5yZXNldFNlYXJjaCA9IHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBkYXRhLnZpZXcgPSBjdXJyZW50LnZpZXc7XHJcbiAgICAgICAgZGF0YS5jb250ZXh0ID0gKHRoaXMuX25hdmlnYXRpb25PcHRpb25zLnB1c2goY29udGV4dCkgLSAxKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgdXNlTGlzdFRlbXBsYXRlID0gKGxheW91dC5saXN0IHx8IG9wdGlvbnMubGlzdCk7XHJcblxyXG4gICAgICBsZXQgdGVtcGxhdGU7XHJcbiAgICAgIGxldCBpc0NvbHVtbkl0ZW0gPSBmYWxzZTtcclxuICAgICAgLy8gcHJpb3JpdHk6IHVzZSA+IChyZWxhdGVkUHJvcGVydHlUZW1wbGF0ZSB8IHJlbGF0ZWRUZW1wbGF0ZSkgPiAoYWN0aW9uUHJvcGVydHlUZW1wbGF0ZSB8IGFjdGlvblRlbXBsYXRlKSA+IHByb3BlcnR5VGVtcGxhdGVcclxuICAgICAgaWYgKGN1cnJlbnQudXNlKSB7XHJcbiAgICAgICAgdGVtcGxhdGUgPSBjdXJyZW50LnVzZTtcclxuICAgICAgfSBlbHNlIGlmIChjdXJyZW50LnZpZXcgJiYgdXNlTGlzdFRlbXBsYXRlKSB7XHJcbiAgICAgICAgdGVtcGxhdGUgPSB0aGlzLnJlbGF0ZWRUZW1wbGF0ZTtcclxuICAgICAgICBjdXJyZW50LnJlbGF0ZWRJdGVtID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIGlmIChjdXJyZW50LnZpZXcpIHtcclxuICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMucmVsYXRlZFByb3BlcnR5VGVtcGxhdGU7XHJcbiAgICAgICAgaXNDb2x1bW5JdGVtID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIGlmIChjdXJyZW50LmFjdGlvbiAmJiB1c2VMaXN0VGVtcGxhdGUpIHtcclxuICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMuYWN0aW9uVGVtcGxhdGU7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudC5hY3Rpb24pIHtcclxuICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMuYWN0aW9uUHJvcGVydHlUZW1wbGF0ZTtcclxuICAgICAgICBpc0NvbHVtbkl0ZW0gPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRlbXBsYXRlID0gdGhpcy5wcm9wZXJ0eVRlbXBsYXRlO1xyXG4gICAgICAgIGlzQ29sdW1uSXRlbSA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGxldCByb3dOb2RlID0gdGhpcy5jcmVhdGVSb3dOb2RlKGN1cnJlbnQsIHNlY3Rpb25Ob2RlLCBlbnRyeSwgdGVtcGxhdGUsIGRhdGEpO1xyXG4gICAgICBpZiAoKGRhdGEucmF3ICE9PSB1bmRlZmluZWQpICYmIGRhdGEudmFsdWUpIHtcclxuICAgICAgICBpZiAoaXNDb2x1bW5JdGVtKSB7XHJcbiAgICAgICAgICByb3cucHVzaChyb3dOb2RlKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJChzZWN0aW9uTm9kZSkuYXBwZW5kKHJvd05vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJvdy5sZW5ndGggPj0gdGhpcy5tdWx0aUNvbHVtbkNvdW50IHx8IChpID49IChpdGVtcy5sZW5ndGggLSAxKSAmJiByb3cubGVuZ3RoID4gMCkpIHtcclxuICAgICAgICByb3dOb2RlID0gdGhpcy5jcmVhdGVSb3cocm93KTtcclxuICAgICAgICAkKHNlY3Rpb25Ob2RlKS5hcHBlbmQocm93Tm9kZSk7XHJcbiAgICAgICAgcm93ID0gW107XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGN1cnJlbnQucmVsYXRlZEl0ZW0pIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgdGhpcy5fcHJvY2Vzc1JlbGF0ZWRJdGVtKGRhdGEsIGNvbnRleHQsIHJvd05vZGUpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICAgIC8vIGVycm9yIHByb2Nlc3NpbmcgcmVsYXRlZCBub2RlXHJcbiAgICAgICAgICBjb25zb2xlLmVycm9yKGUpOyAvL2VzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjdXJyZW50Lm9uQ3JlYXRlKSB7XHJcbiAgICAgICAgY2FsbGJhY2tzLnB1c2goe1xyXG4gICAgICAgICAgcm93OiBjdXJyZW50LFxyXG4gICAgICAgICAgbm9kZTogcm93Tm9kZSxcclxuICAgICAgICAgIHZhbHVlLFxyXG4gICAgICAgICAgZW50cnksXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNhbGxiYWNrcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBpdGVtID0gY2FsbGJhY2tzW2ldO1xyXG4gICAgICBpdGVtLnJvdy5vbkNyZWF0ZS5hcHBseSh0aGlzLCBbaXRlbS5yb3csIGl0ZW0ubm9kZSwgaXRlbS52YWx1ZSwgaXRlbS5lbnRyeV0pO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc2VjdGlvblF1ZXVlLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnQgPSBzZWN0aW9uUXVldWVbaV07XHJcbiAgICAgIHRoaXMucHJvY2Vzc0xheW91dChjdXJyZW50LCBlbnRyeSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmlzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gIH0sXHJcbiAgY3JlYXRlUm93OiBmdW5jdGlvbiBjcmVhdGVSb3cocm93KSB7XHJcbiAgICBjb25zdCByb3dUZW1wbGF0ZSA9ICQodGhpcy5yb3dUZW1wbGF0ZS5hcHBseShudWxsLCB0aGlzKSk7XHJcbiAgICByb3cuZm9yRWFjaCgoZWxlbWVudCkgPT4ge1xyXG4gICAgICByb3dUZW1wbGF0ZS5hcHBlbmQoZWxlbWVudCk7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByb3dUZW1wbGF0ZTtcclxuICB9LFxyXG4gIGNyZWF0ZVJvd05vZGU6IGZ1bmN0aW9uIGNyZWF0ZVJvd05vZGUobGF5b3V0LCBzZWN0aW9uTm9kZSwgZW50cnksIHRlbXBsYXRlLCBkYXRhKSB7XHJcbiAgICBjb25zdCBmcmFnID0gJCh0ZW1wbGF0ZS5hcHBseShkYXRhLCB0aGlzKSk7XHJcbiAgICByZXR1cm4gZnJhZy5nZXQoMCk7XHJcbiAgfSxcclxuICBfZ2V0U3RvcmVBdHRyOiBmdW5jdGlvbiBfZ2V0U3RvcmVBdHRyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RvcmUgfHwgKHRoaXMuc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKCkpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlU3RvcmUgaXMgdGhlIGNvcmUgb2YgdGhlIGRhdGEgaGFuZGxpbmcgZm9yIERldGFpbCBWaWV3cy4gQnkgZGVmYXVsdCBpdCBpcyBlbXB0eSBidXQgaXQgc2hvdWxkIHJldHVyblxyXG4gICAqIGEgZG9qbyBzdG9yZSBvZiB5b3VyIGNob29zaW5nLiBUaGVyZSBhcmUge0BsaW5rIF9TRGF0YURldGFpbE1peGluIE1peGluc30gYXZhaWxhYmxlIGZvciBTRGF0YS5cclxuICAgKiBAcmV0dXJuIHsqfVxyXG4gICAqL1xyXG4gIGNyZWF0ZVN0b3JlOiBmdW5jdGlvbiBjcmVhdGVTdG9yZSgpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICogT3B0aW9uYWwgcHJvY2Vzc2luZyBvZiB0aGUgcmV0dXJuZWQgZW50cnkgYmVmb3JlIGl0IGdldHMgcHJvY2Vzc2VkIGludG8gbGF5b3V0LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSBFbnRyeSBmcm9tIGRhdGEgc3RvcmVcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IEJ5IGRlZmF1bHQgZG9lcyBub3QgZG8gYW55IHByb2Nlc3NpbmdcclxuICAgKi9cclxuICBwcmVQcm9jZXNzRW50cnk6IGZ1bmN0aW9uIHByZVByb2Nlc3NFbnRyeShlbnRyeSkge1xyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVGFrZXMgdGhlIGVudHJ5IGZyb20gdGhlIGRhdGEgc3RvcmUsIGFwcGxpZXMgY3VzdG9taXphdGlvbiwgYXBwbGllcyBhbnkgY3VzdG9tIGl0ZW0gcHJvY2VzcyBhbmQgdGhlblxyXG4gICAqIHBhc3NlcyBpdCB0byBwcm9jZXNzIGxheW91dC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgRW50cnkgZnJvbSBkYXRhIHN0b3JlXHJcbiAgICovXHJcbiAgcHJvY2Vzc0VudHJ5OiBmdW5jdGlvbiBwcm9jZXNzRW50cnkoZW50cnkpIHtcclxuICAgIHRoaXMuZW50cnkgPSB0aGlzLnByZVByb2Nlc3NFbnRyeShlbnRyeSk7XHJcblxyXG4gICAgaWYgKHRoaXMuZW50cnkpIHtcclxuICAgICAgdGhpcy5wcm9jZXNzTGF5b3V0KHRoaXMuX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQodGhpcy5jcmVhdGVMYXlvdXQoKSksIHRoaXMuZW50cnkpO1xyXG4gICAgICBpZiAodGhpcy5pc1RhYmJlZCkge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlVGFicyh0aGlzLnRhYnMpO1xyXG4gICAgICAgIHRoaXMucGxhY2VEZXRhaWxIZWFkZXIodGhpcy5lbnRyeSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2V0KCdkZXRhaWxDb250ZW50JywgJycpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgX29uR2V0Q29tcGxldGU6IGZ1bmN0aW9uIF9vbkdldENvbXBsZXRlKGVudHJ5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoZW50cnkpIHtcclxuICAgICAgICB0aGlzLnByb2Nlc3NFbnRyeShlbnRyeSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgJCh0aGlzLmNvbnRlbnROb2RlKS5lbXB0eSgpLmFwcGVuZCh0aGlzLm5vdEF2YWlsYWJsZVRlbXBsYXRlLmFwcGx5KHRoaXMpKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcblxyXG4gICAgICAvKiB0aGlzIG11c3QgdGFrZSBwbGFjZSB3aGVuIHRoZSBjb250ZW50IGlzIHZpc2libGUgKi9cclxuICAgICAgdGhpcy5vbkNvbnRlbnRDaGFuZ2UoKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlKTsgLy9lc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICB9IGZpbmFsbHkge1xyXG4gICAgICB0aGlzLmlzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgX29uR2V0RXJyb3I6IGZ1bmN0aW9uIF9vbkdldEVycm9yKGdldE9wdGlvbnMsIGVycm9yKSB7XHJcbiAgICB0aGlzLmhhbmRsZUVycm9yKGVycm9yKTtcclxuICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBJbml0aWF0ZXMgdGhlIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcmVxdWVzdERhdGE6IGZ1bmN0aW9uIHJlcXVlc3REYXRhKCkge1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcblxyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuXHJcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcclxuICAgICAgcmV0dXJuIHRoaXMucmVxdWVzdERhdGFVc2luZ01vZGVsKCkudGhlbigoZGF0YSkgPT4ge1xyXG4gICAgICAgIHRoaXMuX29uR2V0Q29tcGxldGUoZGF0YSk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICB0aGlzLl9vbkdldEVycm9yKG51bGwsIGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIGlmIChzdG9yZSkge1xyXG4gICAgICBjb25zdCBnZXRPcHRpb25zID0ge307XHJcblxyXG4gICAgICB0aGlzLl9hcHBseVN0YXRlVG9HZXRPcHRpb25zKGdldE9wdGlvbnMpO1xyXG5cclxuICAgICAgY29uc3QgZ2V0RXhwcmVzc2lvbiA9IHRoaXMuX2J1aWxkR2V0RXhwcmVzc2lvbigpIHx8IG51bGw7XHJcbiAgICAgIGNvbnN0IGdldFJlc3VsdHMgPSB0aGlzLnJlcXVlc3REYXRhVXNpbmdTdG9yZShnZXRFeHByZXNzaW9uLCBnZXRPcHRpb25zKTtcclxuXHJcbiAgICAgIHdoZW4oZ2V0UmVzdWx0cyxcclxuICAgICAgICB0aGlzLl9vbkdldENvbXBsZXRlLmJpbmQodGhpcyksXHJcbiAgICAgICAgdGhpcy5fb25HZXRFcnJvci5iaW5kKHRoaXMsIGdldE9wdGlvbnMpXHJcbiAgICAgICk7XHJcblxyXG4gICAgICByZXR1cm4gZ2V0UmVzdWx0cztcclxuICAgIH1cclxuXHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3JlcXVlc3REYXRhIGNhbGxlZCB3aXRob3V0IGEgbW9kZWwgb3Igc3RvcmUgZGVmaW5lZC4nKTtcclxuICB9LFxyXG4gIHJlcXVlc3REYXRhVXNpbmdNb2RlbDogZnVuY3Rpb24gcmVxdWVzdERhdGFVc2luZ01vZGVsKCkge1xyXG4gICAgY29uc3Qga2V5ID0gdGhpcy5fYnVpbGRHZXRFeHByZXNzaW9uKCk7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0RW50cnkoa2V5LCB0aGlzLm9wdGlvbnMpO1xyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGFVc2luZ1N0b3JlOiBmdW5jdGlvbiByZXF1ZXN0RGF0YVVzaW5nU3RvcmUoZ2V0RXhwcmVzc2lvbiwgZ2V0T3B0aW9ucykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuICAgIHJldHVybiBzdG9yZS5nZXQoZ2V0RXhwcmVzc2lvbiwgZ2V0T3B0aW9ucyk7XHJcbiAgfSxcclxuICBfYnVpbGRHZXRFeHByZXNzaW9uOiBmdW5jdGlvbiBfYnVpbGRHZXRFeHByZXNzaW9uKCkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuICAgIHJldHVybiBvcHRpb25zICYmIChvcHRpb25zLmlkIHx8IG9wdGlvbnMua2V5KTtcclxuICB9LFxyXG4gIF9hcHBseVN0YXRlVG9HZXRPcHRpb25zOiBmdW5jdGlvbiBfYXBwbHlTdGF0ZVRvR2V0T3B0aW9ucygvKiBnZXRPcHRpb25zKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgdGhlIHZpZXcgc2hvdWxkIGJlIHJlZnJlc2ggYnkgaW5zcGVjdGluZyBhbmQgY29tcGFyaW5nIHRoZSBwYXNzZWQgbmF2aWdhdGlvbiBvcHRpb24ga2V5IHdpdGggY3VycmVudCBrZXkuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgUGFzc2VkIG5hdmlnYXRpb24gb3B0aW9ucy5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHRoZSB2aWV3IHNob3VsZCBiZSByZWZyZXNoZWQsIGZhbHNlIGlmIG5vdC5cclxuICAgKi9cclxuICByZWZyZXNoUmVxdWlyZWRGb3I6IGZ1bmN0aW9uIHJlZnJlc2hSZXF1aXJlZEZvcihvcHRpb25zKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XHJcbiAgICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5rZXkgIT09IG9wdGlvbnMua2V5KSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5pbmhlcml0ZWQocmVmcmVzaFJlcXVpcmVkRm9yLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUge0BsaW5rIFZpZXcjYWN0aXZhdGUgcGFyZW50IGltcGxlbWVudGF0aW9ufSB0byBzZXQgdGhlIG5hdiBvcHRpb25zIHRpdGxlIGF0dHJpYnV0ZSB0byB0aGUgZGVzY3JpcHRvclxyXG4gICAqIEBwYXJhbSB0YWdcclxuICAgKiBAcGFyYW0gZGF0YVxyXG4gICAqL1xyXG4gIGFjdGl2YXRlOiBmdW5jdGlvbiBhY3RpdmF0ZSh0YWcsIGRhdGEpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSBkYXRhICYmIGRhdGEub3B0aW9ucztcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGVzY3JpcHRvcikge1xyXG4gICAgICBvcHRpb25zLnRpdGxlID0gb3B0aW9ucy50aXRsZSB8fCBvcHRpb25zLmRlc2NyaXB0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmhlcml0ZWQoYWN0aXZhdGUsIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBzaG93OiBmdW5jdGlvbiBzaG93KG9wdGlvbnMpIHtcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGVzY3JpcHRvcikge1xyXG4gICAgICBvcHRpb25zLnRpdGxlID0gb3B0aW9ucy50aXRsZSB8fCBvcHRpb25zLmRlc2NyaXB0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmhlcml0ZWQoc2hvdywgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHZpZXcga2V5XHJcbiAgICogQHJldHVybiB7U3RyaW5nfSBWaWV3IGtleVxyXG4gICAqL1xyXG4gIGdldFRhZzogZnVuY3Rpb24gZ2V0VGFnKCkge1xyXG4gICAgcmV0dXJuIHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMua2V5O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUge0BsaW5rIFZpZXcjZ2V0Q29udGV4dCBwYXJlbnQgaW1wbGVtZW50YXRpb259IHRvIGFsc28gc2V0IHRoZSByZXNvdXJjZUtpbmQsIGtleSBhbmQgZGVzY3JpcHRvclxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gVmlldyBjb250ZXh0IG9iamVjdFxyXG4gICAqL1xyXG4gIGdldENvbnRleHQ6IGZ1bmN0aW9uIGdldENvbnRleHQoKSB7XHJcbiAgICByZXR1cm4gbGFuZy5taXhpbih0aGlzLmluaGVyaXRlZChnZXRDb250ZXh0LCBhcmd1bWVudHMpLCB7XHJcbiAgICAgIHJlc291cmNlS2luZDogdGhpcy5yZXNvdXJjZUtpbmQsXHJcbiAgICAgIGtleTogdGhpcy5vcHRpb25zLmtleSxcclxuICAgICAgZGVzY3JpcHRvcjogdGhpcy5vcHRpb25zLmRlc2NyaXB0b3IsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHtAbGluayBWaWV3I2JlZm9yZVRyYW5zaXRpb25UbyBwYXJlbnQgaW1wbGVtZW50YXRpb259IHRvIGFsc28gY2xlYXIgdGhlIHZpZXcgaWYgYHJlZnJlc2hSZXF1aXJlZGAgaXMgdHJ1ZVxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gVmlldyBjb250ZXh0IG9iamVjdFxyXG4gICAqL1xyXG4gIGJlZm9yZVRyYW5zaXRpb25UbzogZnVuY3Rpb24gYmVmb3JlVHJhbnNpdGlvblRvKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYmVmb3JlVHJhbnNpdGlvblRvLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIGlmICh0aGlzLnJlZnJlc2hSZXF1aXJlZCkge1xyXG4gICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBJZiBhIHNlY3VyaXR5IGJyZWFjaCBpcyBkZXRlY3RlZCBpdCBzZXRzIHRoZSBjb250ZW50IHRvIHRoZSBub3RBdmFpbGFibGVUZW1wbGF0ZSwgb3RoZXJ3aXNlIGl0IGNhbGxzXHJcbiAgICoge0BsaW5rICNyZXF1ZXN0RGF0YSByZXF1ZXN0RGF0YX0gd2hpY2ggc3RhcnRzIHRoZSBwcm9jZXNzIHNlcXVlbmNlLlxyXG4gICAqL1xyXG4gIHJlZnJlc2g6IGZ1bmN0aW9uIHJlZnJlc2goKSB7XHJcbiAgICBpZiAodGhpcy5zZWN1cml0eSAmJiAhQXBwLmhhc0FjY2Vzc1RvKHRoaXMuZXhwYW5kRXhwcmVzc2lvbih0aGlzLnNlY3VyaXR5KSkpIHtcclxuICAgICAgJCh0aGlzLmNvbnRlbnROb2RlKS5hcHBlbmQodGhpcy5ub3RBdmFpbGFibGVUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlcXVlc3REYXRhKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDbGVhcnMgdGhlIHZpZXcgYnkgcmVwbGFjaW5nIHRoZSBjb250ZW50IHdpdGggdGhlIGVtcHR5IHRlbXBsYXRlIGFuZCBlbXB0eWluZyB0aGUgc3RvcmVkIHJvdyBjb250ZXh0cy5cclxuICAgKi9cclxuICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICB0aGlzLnNldCgnZGV0YWlsQ29udGVudCcsIHRoaXMuZW1wdHlUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICB0aGlzLmNsZWFyVGFicygpO1xyXG4gICAgaWYgKHRoaXMucXVpY2tBY3Rpb25zKSB7XHJcbiAgICAgICQodGhpcy5xdWlja0FjdGlvbnMpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fbmF2aWdhdGlvbk9wdGlvbnMgPSBbXTtcclxuICB9LFxyXG4gIF9wcm9jZXNzUmVsYXRlZEl0ZW06IGZ1bmN0aW9uIF9wcm9jZXNzUmVsYXRlZEl0ZW0oZGF0YSwgY29udGV4dCwgcm93Tm9kZSkge1xyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRWaWV3KGRhdGEudmlldyk7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge307XHJcblxyXG4gICAgY29uc3QgcmVuZGVyUmVsYXRlZCA9IChyZXN1bHQpID0+IHtcclxuICAgICAgaWYgKHJlc3VsdCA+PSAwKSB7XHJcbiAgICAgICAgY29uc3QgbGFiZWxOb2RlID0gJCgnLnJlbGF0ZWQtaXRlbS1sYWJlbCcsIHJvd05vZGUpLmZpcnN0KCk7XHJcbiAgICAgICAgaWYgKGxhYmVsTm9kZS5sZW5ndGgpIHtcclxuICAgICAgICAgICQoJy5idXN5LXhzJywgbGFiZWxOb2RlKS5yZW1vdmUoKTtcclxuICAgICAgICAgIGxhYmVsTm9kZS5iZWZvcmUoYDxzcGFuIGNsYXNzPVwiaW5mbyBiYWRnZVwiPiR7cmVzdWx0fTwvc3Bhbj5gKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKCdNaXNzaW5nIHRoZSBcInJlbGF0ZWQtaXRlbS1sYWJlbFwiIGRvbSBub2RlLicpOyAvL2VzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaWYgKHZpZXcgJiYgY29udGV4dCAmJiBjb250ZXh0LndoZXJlKSB7XHJcbiAgICAgIG9wdGlvbnMud2hlcmUgPSBjb250ZXh0LndoZXJlO1xyXG4gICAgICB2aWV3LmdldExpc3RDb3VudChvcHRpb25zKVxyXG4gICAgICAgIC50aGVuKHJlbmRlclJlbGF0ZWQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVuZGVyUmVsYXRlZCgwKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHJlbW92ZUVudHJ5OiBmdW5jdGlvbiByZW1vdmVFbnRyeSgpIHtcclxuICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fY3JlYXRlRW50cnlGb3JSZW1vdmUoKTtcclxuICAgIGlmIChlbnRyeSkge1xyXG4gICAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0KCdzdG9yZScpO1xyXG4gICAgICBpZiAoc3RvcmUpIHtcclxuICAgICAgICBzdG9yZS5yZW1vdmUoZW50cnkpLnRoZW4oXHJcbiAgICAgICAgICB0aGlzLl9vblJlbW92ZVN1Y2Nlc3MuYmluZCh0aGlzKSxcclxuICAgICAgICAgIHRoaXMuX29uUmVtb3ZlRXJyb3IuYmluZCh0aGlzKVxyXG4gICAgICAgICk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIF9jcmVhdGVFbnRyeUZvclJlbW92ZTogZnVuY3Rpb24gX2NyZWF0ZUVudHJ5Rm9yUmVtb3ZlKCkge1xyXG4gICAgY29uc3QgZW50cnkgPSB7XHJcbiAgICAgICRrZXk6IHRoaXMuZW50cnkuJGtleSxcclxuICAgICAgJGV0YWc6IHRoaXMuZW50cnkuJGV0YWcsXHJcbiAgICAgICRuYW1lOiB0aGlzLmVudHJ5LiRuYW1lLFxyXG4gICAgfTtcclxuICAgIHJldHVybiBlbnRyeTtcclxuICB9LFxyXG4gIF9vblJlbW92ZVN1Y2Nlc3M6IGZ1bmN0aW9uIF9vblJlbW92ZVN1Y2Nlc3MoKSB7XHJcbiAgICBjb25uZWN0LnB1Ymxpc2goJy9hcHAvcmVmcmVzaCcsIFt7XHJcbiAgICAgIHJlc291cmNlS2luZDogdGhpcy5yZXNvdXJjZUtpbmQsXHJcbiAgICB9XSk7XHJcbiAgICBSZVVJLmJhY2soKTtcclxuICB9LFxyXG4gIF9vblJlbW92ZUVycm9yOiBmdW5jdGlvbiBfb25SZW1vdmVFcnJvcihlcnJvcikge1xyXG4gICAgaWYgKGVycm9yKSB7XHJcbiAgICAgIHRoaXMuX29uR2V0RXJyb3IobnVsbCwgZXJyb3IpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGRlc3Ryb3ksIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=