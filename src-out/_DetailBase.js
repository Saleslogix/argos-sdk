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
    quickActionTemplate: new Simplate(['<div class="quick-actions toolbar" data-dojo-attach-point="quickActions"></div>']),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fRGV0YWlsQmFzZS5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJhdHRyaWJ1dGVNYXAiLCJkZXRhaWxDb250ZW50Iiwibm9kZSIsInR5cGUiLCJ0aXRsZSIsInByb3RvdHlwZSIsInNlbGVjdGVkIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImVtcHR5VGVtcGxhdGUiLCJsb2FkaW5nVGVtcGxhdGUiLCJxdWlja0FjdGlvblRlbXBsYXRlIiwiZGV0YWlsSGVhZGVyVGVtcGxhdGUiLCJzZWN0aW9uQmVnaW5UZW1wbGF0ZSIsInNlY3Rpb25FbmRUZW1wbGF0ZSIsInByb3BlcnR5VGVtcGxhdGUiLCJyZWxhdGVkUHJvcGVydHlUZW1wbGF0ZSIsInJlbGF0ZWRUZW1wbGF0ZSIsImFjdGlvblByb3BlcnR5VGVtcGxhdGUiLCJhY3Rpb25UZW1wbGF0ZSIsInJvd1RlbXBsYXRlIiwibm90QXZhaWxhYmxlVGVtcGxhdGUiLCJpZCIsInN0b3JlIiwiZW50cnkiLCJsYXlvdXQiLCJzZWN1cml0eSIsImN1c3RvbWl6YXRpb25TZXQiLCJleHBvc2UiLCJpc1RhYmJlZCIsInF1aWNrQWN0aW9uU2VjdGlvbiIsImVkaXRUZXh0IiwiaWNvbiIsInZpZXdUeXBlIiwiaW5mb3JtYXRpb25UZXh0IiwidGl0bGVUZXh0IiwiZW50aXR5VGV4dCIsImRldGFpbHNUZXh0IiwibG9hZGluZ1RleHQiLCJub3RBdmFpbGFibGVUZXh0IiwidG9nZ2xlQ29sbGFwc2VUZXh0IiwidG9nZ2xlQ29sbGFwc2VDbGFzcyIsInRvZ2dsZUV4cGFuZENsYXNzIiwiZWRpdFZpZXciLCJfbmF2aWdhdGlvbk9wdGlvbnMiLCJpc1JlZnJlc2hpbmciLCJtdWx0aUNvbHVtbkNsYXNzIiwibXVsdGlDb2x1bW5Db3VudCIsInJlZnJlc2hUb29sdGlwVGV4dCIsImVkaXRUb29sdGlwVGV4dCIsIml0ZW1zUHJvcGVydHkiLCJpZFByb3BlcnR5IiwibGFiZWxQcm9wZXJ0eSIsImVudGl0eVByb3BlcnR5IiwidmVyc2lvblByb3BlcnR5IiwicG9zdENyZWF0ZSIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInN1YnNjcmliZSIsIl9vblJlZnJlc2giLCJjbGVhciIsImNyZWF0ZUVycm9ySGFuZGxlcnMiLCJlcnJvckhhbmRsZXJzIiwibmFtZSIsInRlc3QiLCJlcnJvciIsImFib3J0ZWQiLCJoYW5kbGUiLCJuZXh0Iiwib3B0aW9ucyIsInN0YXR1cyIsIkhUVFBfU1RBVFVTIiwiTk9UX0ZPVU5EIiwiYWxlcnQiLCJnZXRFcnJvck1lc3NhZ2UiLCIkIiwiY29udGVudE5vZGUiLCJlbXB0eSIsImFwcGVuZCIsImFwcGx5IiwiZnJvbUNvbnRleHQiLCJlcnJvckl0ZW0iLCJ2aWV3T3B0aW9ucyIsInNlcnZlckVycm9yIiwiYWRkRXJyb3IiLCJkb21Ob2RlIiwicmVtb3ZlQ2xhc3MiLCJjcmVhdGVUb29sTGF5b3V0IiwidG9vbHMiLCJwdXNoIiwic3ZnIiwiYWN0aW9uIiwiQXBwIiwiZ2V0Vmlld1NlY3VyaXR5IiwidGJhciIsIl9yZWZyZXNoQ2xpY2tlZCIsInJlZnJlc2hSZXF1aXJlZCIsInJlZnJlc2giLCJvblJlZnJlc2hDbGlja2VkIiwiaW52b2tlQWN0aW9uIiwicGFyYW1ldGVycyIsImRpc2FibGVBY3Rpb24iLCJ0b2dnbGVTZWN0aW9uIiwicGFyYW1zIiwiJHNvdXJjZSIsImxlbmd0aCIsInRvZ2dsZUNsYXNzIiwiYnV0dG9uIiwiZmlyc3QiLCJwbGFjZURldGFpbEhlYWRlciIsInZhbHVlIiwic3Vic3RpdHV0ZSIsInRhYkNvbnRhaW5lciIsImJlZm9yZSIsIm8iLCJkZXNjcmlwdG9yIiwiZGF0YSIsImtleSIsInNldCIsImFjdGl2YXRlUmVsYXRlZEVudHJ5IiwiY29udGV4dCIsIm5hdmlnYXRlVG9SZWxhdGVkVmlldyIsInZpZXciLCJwYXJzZUludCIsImFjdGl2YXRlUmVsYXRlZExpc3QiLCJuYXZpZ2F0ZVRvRWRpdFZpZXciLCJnZXRWaWV3Iiwic2hvdyIsInNsb3QiLCJzZWxlY3RlZEVudHJ5IiwiY3JlYXRlTGF5b3V0IiwicHJvY2Vzc0xheW91dCIsIml0ZW1zIiwiY2hpbGRyZW4iLCJhcyIsInNlY3Rpb25RdWV1ZSIsInNlY3Rpb25TdGFydGVkIiwiY2FsbGJhY2tzIiwicm93Iiwic2VjdGlvbk5vZGUiLCJwbGFjZVRhYkxpc3QiLCJpIiwiY3VycmVudCIsImluY2x1ZGUiLCJleHBhbmRFeHByZXNzaW9uIiwiZXhjbHVkZSIsInVuZGVmaW5lZCIsInJvd05vZGUiLCJjcmVhdGVSb3ciLCJzZWN0aW9uIiwiZ2V0IiwicXVpY2tBY3Rpb25zIiwidGFiIiwidGFiTGlzdEl0ZW1UZW1wbGF0ZSIsInRhYk1hcHBpbmciLCJ0YWJzIiwiY2hpbGROb2RlcyIsInByb3ZpZGVyIiwiZ2V0VmFsdWUiLCJwcm9wZXJ0eSIsInJlbmRlcmVkIiwiZm9ybWF0dGVkIiwidGVtcGxhdGUiLCJ0cGwiLCJlbmNvZGUiLCJyZW5kZXJlciIsImNhbGwiLCJtaXhpbiIsInJhdyIsImhhc0FjY2VzcyIsImhhc0FjY2Vzc1RvIiwiZGlzYWJsZWQiLCJ3aGVyZSIsImNvbnRyYWN0TmFtZSIsInJlc291cmNlS2luZCIsInJlc291cmNlUHJvcGVydHkiLCJyZXNvdXJjZVByZWRpY2F0ZSIsImRhdGFTZXQiLCJyZXNldFNlYXJjaCIsInVzZUxpc3RUZW1wbGF0ZSIsImxpc3QiLCJpc0NvbHVtbkl0ZW0iLCJ1c2UiLCJyZWxhdGVkSXRlbSIsImNyZWF0ZVJvd05vZGUiLCJfcHJvY2Vzc1JlbGF0ZWRJdGVtIiwiZSIsImNvbnNvbGUiLCJvbkNyZWF0ZSIsIml0ZW0iLCJmb3JFYWNoIiwiZWxlbWVudCIsImZyYWciLCJfZ2V0U3RvcmVBdHRyIiwiY3JlYXRlU3RvcmUiLCJwcmVQcm9jZXNzRW50cnkiLCJwcm9jZXNzRW50cnkiLCJfY3JlYXRlQ3VzdG9taXplZExheW91dCIsImNyZWF0ZVRhYnMiLCJfb25HZXRDb21wbGV0ZSIsIm9uQ29udGVudENoYW5nZSIsIl9vbkdldEVycm9yIiwiZ2V0T3B0aW9ucyIsImhhbmRsZUVycm9yIiwicmVxdWVzdERhdGEiLCJhZGRDbGFzcyIsIl9tb2RlbCIsInJlcXVlc3REYXRhVXNpbmdNb2RlbCIsInRoZW4iLCJlcnIiLCJfYXBwbHlTdGF0ZVRvR2V0T3B0aW9ucyIsImdldEV4cHJlc3Npb24iLCJfYnVpbGRHZXRFeHByZXNzaW9uIiwiZ2V0UmVzdWx0cyIsInJlcXVlc3REYXRhVXNpbmdTdG9yZSIsImJpbmQiLCJFcnJvciIsImdldEVudHJ5IiwicmVmcmVzaFJlcXVpcmVkRm9yIiwiYWN0aXZhdGUiLCJ0YWciLCJnZXRUYWciLCJnZXRDb250ZXh0IiwiYmVmb3JlVHJhbnNpdGlvblRvIiwiY2xlYXJUYWJzIiwicmVuZGVyUmVsYXRlZCIsInJlc3VsdCIsImxhYmVsTm9kZSIsInJlbW92ZSIsIndhcm4iLCJnZXRMaXN0Q291bnQiLCJyZW1vdmVFbnRyeSIsIl9jcmVhdGVFbnRyeUZvclJlbW92ZSIsIl9vblJlbW92ZVN1Y2Nlc3MiLCJfb25SZW1vdmVFcnJvciIsIiRrZXkiLCIkZXRhZyIsIiRuYW1lIiwicHVibGlzaCIsIlJlVUkiLCJiYWNrIiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLE1BQU1BLFdBQVcsb0JBQVksWUFBWixDQUFqQjs7QUFFQTs7Ozs7Ozs7Ozs7QUE5QkE7Ozs7Ozs7Ozs7Ozs7OztBQXlDQSxNQUFNQyxVQUFVLHVCQUFRLG1CQUFSLEVBQTZCLHFDQUE3QixFQUFnRCxnQ0FBZ0M7QUFDOUY7Ozs7Ozs7QUFPQUMsa0JBQWM7QUFDWkMscUJBQWU7QUFDYkMsY0FBTSxhQURPO0FBRWJDLGNBQU07QUFGTyxPQURIO0FBS1pDLGFBQU8sZUFBS0MsU0FBTCxDQUFlTCxZQUFmLENBQTRCSSxLQUx2QjtBQU1aRSxnQkFBVSxlQUFLRCxTQUFMLENBQWVMLFlBQWYsQ0FBNEJNO0FBTjFCLEtBUmdGO0FBZ0I5Rjs7Ozs7Ozs7Ozs7Ozs7O0FBZUFDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEs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S0FBS25OLEtBQUwsQ0FBV21OLElBREw7QUFFWkMsZUFBTyxLQUFLcE4sS0FBTCxDQUFXb04sS0FGTjtBQUdaQyxlQUFPLEtBQUtyTixLQUFMLENBQVdxTjtBQUhOLE9BQWQ7QUFLQSxhQUFPck4sS0FBUDtBQUNELEtBbmxDNkY7QUFvbEM5RmlOLHNCQUFrQixTQUFTQSxnQkFBVCxHQUE0QjtBQUM1Qyx3QkFBUUssT0FBUixDQUFnQixjQUFoQixFQUFnQyxDQUFDO0FBQy9CaEUsc0JBQWMsS0FBS0E7QUFEWSxPQUFELENBQWhDO0FBR0FpRSxXQUFLQyxJQUFMO0FBQ0QsS0F6bEM2RjtBQTBsQzlGTixvQkFBZ0IsU0FBU0EsY0FBVCxDQUF3QnpLLEtBQXhCLEVBQStCO0FBQzdDLFVBQUlBLEtBQUosRUFBVztBQUNULGFBQUt3SSxXQUFMLENBQWlCLElBQWpCLEVBQXVCeEksS0FBdkI7QUFDRDtBQUNGLEtBOWxDNkY7QUErbEM5RmdMLGFBQVMsU0FBU0EsT0FBVCxHQUFtQjtBQUMxQixXQUFLekwsU0FBTCxDQUFleUwsT0FBZixFQUF3QnhMLFNBQXhCO0FBQ0Q7QUFqbUM2RixHQUFoRixDQUFoQjs7b0JBb21DZTFELE8iLCJmaWxlIjoiX0RldGFpbEJhc2UuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCB3aGVuIGZyb20gJ2Rvam8vd2hlbic7XHJcbmltcG9ydCBjb25uZWN0IGZyb20gJ2Rvam8vX2Jhc2UvY29ubmVjdCc7XHJcbmltcG9ydCBmb3JtYXQgZnJvbSAnLi9Gb3JtYXQnO1xyXG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xyXG5pbXBvcnQgRXJyb3JNYW5hZ2VyIGZyb20gJy4vRXJyb3JNYW5hZ2VyJztcclxuaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcclxuaW1wb3J0IFRhYldpZGdldCBmcm9tICcuL1RhYldpZGdldCc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdkZXRhaWxCYXNlJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLl9EZXRhaWxCYXNlXHJcbiAqIEBjbGFzc2Rlc2MgQSBEZXRhaWwgVmlldyByZXByZXNlbnRzIGEgc2luZ2xlIHJlY29yZCBhbmQgc2hvdWxkIGRpc3BsYXkgYWxsIHRoZSBpbmZvIHRoZSB1c2VyIG1heSBuZWVkIGFib3V0IHRoZSBlbnRyeS5cclxuICpcclxuICogQSBEZXRhaWwgZW50cnkgaXMgaWRlbnRpZmllZCBieSBpdHMga2V5IChpZFByb3BlcnR5KSB3aGljaCBpcyBob3cgaXQgcmVxdWVzdHMgdGhlIGRhdGEgdmlhIHRoZSBlbmRwb2ludC5cclxuICpcclxuICogQGV4dGVuZHMgYXJnb3MuVmlld1xyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRm9ybWF0XHJcbiAqIEByZXF1aXJlcyBhcmdvcy5VdGlsaXR5XHJcbiAqIEByZXF1aXJlcyBhcmdvcy5FcnJvck1hbmFnZXJcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fRGV0YWlsQmFzZScsIFtWaWV3LCBUYWJXaWRnZXRdLCAvKiogQGxlbmRzIGFyZ29zLl9EZXRhaWxCYXNlIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBDcmVhdGVzIGEgc2V0dGVyIG1hcCB0byBodG1sIG5vZGVzLCBuYW1lbHk6XHJcbiAgICpcclxuICAgKiAqIGRldGFpbENvbnRlbnQgPT4gY29udGVudE5vZGUncyBpbm5lckhUTUxcclxuICAgKlxyXG4gICAqL1xyXG4gIGF0dHJpYnV0ZU1hcDoge1xyXG4gICAgZGV0YWlsQ29udGVudDoge1xyXG4gICAgICBub2RlOiAnY29udGVudE5vZGUnLFxyXG4gICAgICB0eXBlOiAnaW5uZXJIVE1MJyxcclxuICAgIH0sXHJcbiAgICB0aXRsZTogVmlldy5wcm90b3R5cGUuYXR0cmlidXRlTWFwLnRpdGxlLFxyXG4gICAgc2VsZWN0ZWQ6IFZpZXcucHJvdG90eXBlLmF0dHJpYnV0ZU1hcC5zZWxlY3RlZCxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSB2aWV3J3MgbWFpbiBET00gZWxlbWVudCB3aGVuIHRoZSB2aWV3IGlzIGluaXRpYWxpemVkLlxyXG4gICAqIFRoaXMgdGVtcGxhdGUgaW5jbHVkZXMgbG9hZGluZ1RlbXBsYXRlLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgdXNlcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICpcclxuICAgKiAgICAgIG5hbWUgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgKiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiAgICAgIGlkICAgICAgICAgICAgICAgICAgIG1haW4gY29udGFpbmVyIGRpdiBpZFxyXG4gICAqICAgICAgdGl0bGUgICAgICAgICAgICAgICAgbWFpbiBjb250YWluZXIgZGl2IHRpdGxlIGF0dHJcclxuICAgKiAgICAgIGNscyAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWwgY2xhc3Mgc3RyaW5nIGFkZGVkIHRvIHRoZSBtYWluIGNvbnRhaW5lciBkaXZcclxuICAgKiAgICAgIHJlc291cmNlS2luZCAgICAgICAgIHNldCB0byBkYXRhLXJlc291cmNlLWtpbmRcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgaWQ9XCJ7JT0gJC5pZCAlfVwiIGRhdGEtdGl0bGU9XCJ7JT0gJC50aXRsZVRleHQgJX1cIiBjbGFzcz1cImRldGFpbCBwYW5lbCBzY3JvbGxhYmxlIHslPSAkLmNscyAlfVwiIHslIGlmICgkLnJlc291cmNlS2luZCkgeyAlfWRhdGEtcmVzb3VyY2Uta2luZD1cInslPSAkLnJlc291cmNlS2luZCAlfVwieyUgfSAlfT4nLFxyXG4gICAgJ3slISAkLmxvYWRpbmdUZW1wbGF0ZSAlfScsXHJcbiAgICAneyUhICQucXVpY2tBY3Rpb25UZW1wbGF0ZSAlfScsXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiY29udGVudE5vZGVcIiBjbGFzcz1cImNvbHVtblwiPicsXHJcbiAgICAneyUhICQudGFiQ29udGVudFRlbXBsYXRlICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHNob3duIHdoZW4gbm8gZGF0YSBpcyBhdmFpbGFibGUuXHJcbiAgICovXHJcbiAgZW1wdHlUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgc2hvd24gd2hlbiBkYXRhIGlzIGJlaW5nIGxvYWRlZC5cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIGxvYWRpbmdUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwicGFuZWwtbG9hZGluZy1pbmRpY2F0b3JcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJidXN5LWluZGljYXRvci1jb250YWluZXIgYmxvY2tlZC11aVwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yIGFjdGl2ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBvbmVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdHdvXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHRocmVlXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZvdXJcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZml2ZVwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8c3Bhbj57JTogJC5sb2FkaW5nVGV4dCAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBjcmVhdGVzIHRoZSBxdWljayBhY3Rpb24gbGlzdFxyXG4gICAqL1xyXG4gIHF1aWNrQWN0aW9uVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInF1aWNrLWFjdGlvbnMgdG9vbGJhclwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJxdWlja0FjdGlvbnNcIj48L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IGNyZWF0ZXMgdGhlIGRldGFpbCBoZWFkZXIgZGlzcGxheWluZyBpbmZvcm1hdGlvbiBhYm91dCB0aGUgdGFiIGxpc3RcclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIGRldGFpbEhlYWRlclRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJkZXRhaWwtaGVhZGVyXCI+JyxcclxuICAgICd7JTogJC52YWx1ZSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBzdGFydHMgYSBuZXcgc2VjdGlvblxyXG4gICAqXHJcbiAgICogYCRgID0+IHRoZSB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgc2VjdGlvbkJlZ2luVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAneyUgaWYgKCEkJC5pc1RhYmJlZCkgeyAlfScsXHJcbiAgICAnPGgyIGRhdGEtYWN0aW9uPVwidG9nZ2xlU2VjdGlvblwiIGNsYXNzPVwieyUgaWYgKCQuY29sbGFwc2VkIHx8ICQub3B0aW9ucy5jb2xsYXBzZWQpIHsgJX1jb2xsYXBzZWR7JSB9ICV9XCI+JyxcclxuICAgICc8YnV0dG9uIGNsYXNzPVwieyUgaWYgKCQuY29sbGFwc2VkKSB7ICV9eyU6ICQkLnRvZ2dsZUV4cGFuZENsYXNzICV9eyUgfSBlbHNlIHsgJX17JTogJCQudG9nZ2xlQ29sbGFwc2VDbGFzcyAlfXslIH0gJX1cIiBhcmlhLWxhYmVsPVwieyU6ICQkLnRvZ2dsZUNvbGxhcHNlVGV4dCAlfVwiPjwvYnV0dG9uPicsXHJcbiAgICAneyU6ICgkLnRpdGxlIHx8ICQub3B0aW9ucy50aXRsZSkgJX0nLFxyXG4gICAgJzwvaDI+JyxcclxuICAgICd7JSB9ICV9JyxcclxuICAgICd7JSBpZiAoJC5saXN0IHx8ICQub3B0aW9ucy5saXN0KSB7ICV9JyxcclxuICAgICd7JSBpZiAoJC5jbHMgfHwgJC5vcHRpb25zLmNscykgeyAlfScsXHJcbiAgICAnPHVsIGNsYXNzPVwieyU9ICgkLmNscyB8fCAkLm9wdGlvbnMuY2xzKSAlfVwiIGlkPVwieyU6ICQkLmlkICV9X3slOiAkLm5hbWUgJX1cIj4nLFxyXG4gICAgJ3slIH0gZWxzZSB7ICV9JyxcclxuICAgICc8dWwgY2xhc3M9XCJkZXRhaWxDb250ZW50IHRhYi1wYW5lbCBsaXN0dmlld1wiIGlkPVwieyU6ICQkLmlkICV9X3slOiAkLm5hbWUgJX1cIj4nLFxyXG4gICAgJ3slIH0gJX0nLFxyXG4gICAgJ3slIH0gZWxzZSB7ICV9JyxcclxuICAgICd7JSBpZiAoJC5jbHMgfHwgJC5vcHRpb25zLmNscykgeyAlfScsXHJcbiAgICAnPGRpdiBjbGFzcz1cInRhYi1wYW5lbCB7JT0gKCQuY2xzIHx8ICQub3B0aW9ucy5jbHMpICV9XCIgaWQ9XCJ7JTogJCQuaWQgJX1feyU6ICQubmFtZSAlfVwiPicsXHJcbiAgICAneyUgfSBlbHNlIHsgJX0nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJkZXRhaWxDb250ZW50IHRhYi1wYW5lbCBzdW1tYXJ5LWZvcm1cIiBpZD1cInslOiAkJC5pZCAlfV97JTogJC5uYW1lICV9XCI+JyxcclxuICAgICd7JSB9ICV9JyxcclxuICAgICd7JSB9ICV9JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBlbmRzIGEgc2VjdGlvblxyXG4gICAqXHJcbiAgICogYCRgID0+IHRoZSB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgc2VjdGlvbkVuZFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJ3slIGlmICgkLmxpc3QgfHwgJC5vcHRpb25zLmxpc3QpIHsgJX0nLFxyXG4gICAgJzwvdWw+JyxcclxuICAgICd7JSB9IGVsc2UgeyAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICd7JSB9ICV9JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBpcyB1c2VkIGZvciBhIHByb3BlcnR5IGluIHRoZSBkZXRhaWwgbGF5b3V0XHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBkZXRhaWwgbGF5b3V0IHJvd1xyXG4gICAqICogYCQkYCA9PiB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgcHJvcGVydHlUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwieyU9ICQkLm11bHRpQ29sdW1uQ2xhc3MgJX0gY29sdW1uc3slPSAkLmNscyAlfVwiIGRhdGEtcHJvcGVydHk9XCJ7JT0gJC5wcm9wZXJ0eSB8fCAkLm5hbWUgJX1cIj4nLFxyXG4gICAgJzxsYWJlbD57JTogJC5sYWJlbCAlfTwvbGFiZWw+JyxcclxuICAgICc8c3BhbiBjbGFzcz1cImRhdGFcIj57JT0gJC52YWx1ZSAlfTwvc3Bhbj4nLCAvLyB0b2RvOiBjcmVhdGUgYSB3YXkgdG8gYWxsb3cgdGhlIHZhbHVlIHRvIG5vdCBiZSBzdXJyb3VuZGVkIHdpdGggYSBzcGFuIHRhZ1xyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgaXMgdXNlZCBmb3IgZGV0YWlsIGxheW91dCBpdGVtcyB0aGF0IHBvaW50IHRvIHJlbGF0ZWQgdmlld3MsIGluY2x1ZGVzIGEgbGFiZWwgYW5kIGxpbmtzIHRoZSB2YWx1ZSB0ZXh0XHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBkZXRhaWwgbGF5b3V0IHJvd1xyXG4gICAqICogYCQkYCA9PiB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgcmVsYXRlZFByb3BlcnR5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInslPSAkJC5tdWx0aUNvbHVtbkNsYXNzICV9IGNvbHVtbnN7JT0gJC5jbHMgJX1cIj4nLFxyXG4gICAgJzxsYWJlbD57JTogJC5sYWJlbCAlfTwvbGFiZWw+JyxcclxuICAgICc8c3BhbiBjbGFzcz1cImRhdGFcIj4nLFxyXG4gICAgJzxhIGNsYXNzPVwiaHlwZXJsaW5rXCIgZGF0YS1hY3Rpb249XCJhY3RpdmF0ZVJlbGF0ZWRFbnRyeVwiIGRhdGEtdmlldz1cInslPSAkLnZpZXcgJX1cIiBkYXRhLWNvbnRleHQ9XCJ7JTogJC5jb250ZXh0ICV9XCIgZGF0YS1kZXNjcmlwdG9yPVwieyU6ICQuZGVzY3JpcHRvciB8fCAkLnZhbHVlICV9XCI+JyxcclxuICAgICd7JT0gJC52YWx1ZSAlfScsXHJcbiAgICAnPC9hPicsXHJcbiAgICAnPC9zcGFuPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBpcyB1c2VkIGZvciBkZXRhaWwgbGF5b3V0IGl0ZW1zIHRoYXQgcG9pbnQgdG8gcmVsYXRlZCB2aWV3cywgZGlzcGxheWVkIGFzIGFuIGljb24gYW5kIHRleHRcclxuICAgKlxyXG4gICAqICogYCRgID0+IGRldGFpbCBsYXlvdXQgcm93XHJcbiAgICogKiBgJCRgID0+IHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICByZWxhdGVkVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwicmVsYXRlZHZpZXdpdGVtIHslPSAkLmNscyAlfVwiIGRhdGEtYWN0aW9uPVwiYWN0aXZhdGVSZWxhdGVkTGlzdFwiIGRhdGEtdmlldz1cInslPSAkLnZpZXcgJX1cIiBkYXRhLWNvbnRleHQ9XCJ7JTogJC5jb250ZXh0ICV9XCIgeyUgaWYgKCQuZGlzYWJsZWQpIHsgJX1kYXRhLWRpc2FibGUtYWN0aW9uPVwidHJ1ZVwieyUgfSAlfT4nLFxyXG4gICAgJzxhIGNsYXNzPVwieyUgaWYgKCQuZGlzYWJsZWQpIHsgJX1kaXNhYmxlZHslIH0gJX1cIj4nLFxyXG4gICAgJ3slIGlmICgkLmljb24pIHsgJX0nLFxyXG4gICAgJzxpbWcgc3JjPVwieyU9ICQuaWNvbiAlfVwiIGFsdD1cImljb25cIiBjbGFzcz1cImljb25cIiAvPicsXHJcbiAgICAneyUgfSBlbHNlIGlmICgkLmljb25DbGFzcykgeyAlfScsXHJcbiAgICAnPGRpdiBjbGFzcz1cInslPSAkLmljb25DbGFzcyAlfVwiIGFsdD1cImljb25cIj48L2Rpdj4nLFxyXG4gICAgJ3slIH0gJX0nLFxyXG4gICAgJzxzcGFuIGNsYXNzPVwicmVsYXRlZC1pdGVtLWxhYmVsXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYnVzeS14cyBiYWRnZVwiJyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYnVzeS1pbmRpY2F0b3ItY29udGFpbmVyXCIgYXJpYS1saXZlPVwicG9saXRlXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYnVzeS1pbmRpY2F0b3IgYWN0aXZlXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIG9uZVwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciB0d29cIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdGhyZWVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZm91clwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBmaXZlXCI+PC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICd7JTogJC5sYWJlbCAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvYT4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBpcyB1c2VkIGZvciBkZXRhaWwgbGF5b3V0IGl0ZW1zIHRoYXQgZmlyZSBhbiBhY3Rpb24sIGRpc3BsYXllZCB3aXRoIGxhYmVsIGFuZCBwcm9wZXJ0eSB2YWx1ZVxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gZGV0YWlsIGxheW91dCByb3dcclxuICAgKiAqIGAkJGAgPT4gdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIGFjdGlvblByb3BlcnR5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInslPSAkJC5tdWx0aUNvbHVtbkNsYXNzICV9IGNvbHVtbnN7JT0gJC5jbHMgJX1cIj4nLFxyXG4gICAgJzxsYWJlbD57JTogJC5sYWJlbCAlfTwvbGFiZWw+JyxcclxuICAgICc8c3BhbiBjbGFzcz1cImRhdGFcIj4nLFxyXG4gICAgJzxhIGNsYXNzPVwiaHlwZXJsaW5rXCIgZGF0YS1hY3Rpb249XCJ7JT0gJC5hY3Rpb24gJX1cIiB7JSBpZiAoJC5kaXNhYmxlZCkgeyAlfWRhdGEtZGlzYWJsZS1hY3Rpb249XCJ0cnVlXCJ7JSB9ICV9IGNsYXNzPVwieyUgaWYgKCQuZGlzYWJsZWQpIHsgJX1kaXNhYmxlZHslIH0gJX1cIj4nLFxyXG4gICAgJ3slPSAkLnZhbHVlICV9JyxcclxuICAgICc8L2E+JyxcclxuICAgICc8L3NwYW4+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IGlzIHVzZWQgZm9yIGRldGFpbCBsYXlvdXQgaXRlbXMgdGhhdCBmaXJlIGFuIGFjdGlvbiwgZGlzcGxheWVkIGFzIGFuIGljb24gYW5kIHRleHRcclxuICAgKlxyXG4gICAqICogYCRgID0+IGRldGFpbCBsYXlvdXQgcm93XHJcbiAgICogKiBgJCRgID0+IHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBhY3Rpb25UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8bGkgY2xhc3M9XCJ7JT0gJC5jbHMgJX17JSBpZiAoJC5kaXNhYmxlZCkgeyAlfSBkaXNhYmxlZHslIH0gJX1cIj4nLFxyXG4gICAgJzxhIGRhdGEtYWN0aW9uPVwieyU9ICQuYWN0aW9uICV9XCIgeyUgaWYgKCQuZGlzYWJsZWQpIHsgJX1kYXRhLWRpc2FibGUtYWN0aW9uPVwidHJ1ZVwieyUgfSAlfSBjbGFzcz1cInslIGlmICgkLmRpc2FibGVkKSB7ICV9ZGlzYWJsZWR7JSB9ICV9XCI+JyxcclxuICAgICd7JSBpZiAoJC5pY29uKSB7ICV9JyxcclxuICAgICc8aW1nIHNyYz1cInslPSAkLmljb24gJX1cIiBhbHQ9XCJpY29uXCIgY2xhc3M9XCJpY29uXCIgLz4nLFxyXG4gICAgJ3slIH0gZWxzZSBpZiAoJC5pY29uQ2xhc3MpIHsgJX0nLFxyXG4gICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWljb24gaGlkZS1mb2N1c1wiPlxyXG4gICAgICA8c3ZnIGNsYXNzPVwiaWNvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgIDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeGxpbms6aHJlZj1cIiNpY29uLXslOiAkLmljb25DbGFzcyAlfVwiPjwvdXNlPlxyXG4gICAgICA8L3N2Zz5cclxuICAgIDwvYnV0dG9uPmAsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgICAnPGxhYmVsPnslOiAkLmxhYmVsICV9PC9sYWJlbD4nLFxyXG4gICAgJzxzcGFuIGNsYXNzPVwiZGF0YVwiPnslPSAkLnZhbHVlICV9PC9zcGFuPicsXHJcbiAgICAnPC9hPicsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IGlzIHVzZWQgZm9yIHJvd3MgY3JlYXRlZCB3aXRoIGNvbHVtbnNcclxuICAgKi9cclxuICByb3dUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwicm93XCI+PC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBpcyBzaG93biB3aGVuIG5vdCBhdmFpbGFibGVcclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIG5vdEF2YWlsYWJsZVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxwIGNsYXNzPVwibm90LWF2YWlsYWJsZVwiPnslOiAkLm5vdEF2YWlsYWJsZVRleHQgJX08L3A+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdW5pcXVlIGlkZW50aWZpZXIgb2YgdGhlIHZpZXdcclxuICAgKi9cclxuICBpZDogJ2dlbmVyaWNfZGV0YWlsJyxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgZG9qbyBzdG9yZSB0aGlzIHZpZXcgd2lsbCB1c2UgZm9yIGRhdGEgZXhjaGFuZ2UuXHJcbiAgICovXHJcbiAgc3RvcmU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIGRhdGEgZW50cnlcclxuICAgKi9cclxuICBlbnRyeTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgbGF5b3V0IGRlZmluaXRpb24gdGhhdCBjb25zdHJ1Y3RzIHRoZSBkZXRhaWwgdmlldyB3aXRoIHNlY3Rpb25zIGFuZCByb3dzXHJcbiAgICovXHJcbiAgbGF5b3V0OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZy9PYmplY3R9XHJcbiAgICogTWF5IGJlIHVzZWQgZm9yIHZlcmlmeWluZyB0aGUgdmlldyBpcyBhY2Nlc3NpYmxlXHJcbiAgICovXHJcbiAgc2VjdXJpdHk6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSBjdXN0b21pemF0aW9uIGlkZW50aWZpZXIgZm9yIHRoaXMgY2xhc3MuIFdoZW4gYSBjdXN0b21pemF0aW9uIGlzIHJlZ2lzdGVyZWQgaXQgaXMgcGFzc2VkXHJcbiAgICogYSBwYXRoL2lkZW50aWZpZXIgd2hpY2ggaXMgdGhlbiBtYXRjaGVkIHRvIHRoaXMgcHJvcGVydHkuXHJcbiAgICovXHJcbiAgY3VzdG9taXphdGlvblNldDogJ2RldGFpbCcsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIENvbnRyb2xzIGlmIHRoZSB2aWV3IHNob3VsZCBiZSBleHBvc2VkXHJcbiAgICovXHJcbiAgZXhwb3NlOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogQ29udHJvbHMgd2hldGhlciB0aGUgdmlldyB3aWxsIHJlbmRlciBhcyBhIHRhYiB2aWV3IG9yIHRoZSBwcmV2aW91cyBsaXN0IHZpZXdcclxuICAgKi9cclxuICBpc1RhYmJlZDogdHJ1ZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBDb250cm9scyBob3cgdGhlIHZpZXcgZGV0ZXJtaW5lcyB0aGUgcXVpY2sgYWN0aW9uIHNlY3Rpb24gYnkgbWFwcGluZyB0aGlzIHN0cmluZyB3aXRoIHRoYXQgb24gdGhlIGRldGFpbCB2aWV3IChzaG91bGQgYmUgb3ZlcndyaXR0ZW4pXHJcbiAgICovXHJcbiAgcXVpY2tBY3Rpb25TZWN0aW9uOiAnUXVpY2tBY3Rpb25zU2VjdGlvbicsXHJcbiAgLyoqXHJcbiAgICogQGRlcHJlY2F0ZWRcclxuICAgKi9cclxuICBlZGl0VGV4dDogcmVzb3VyY2UuZWRpdFRleHQsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIEZvbnQgYXdlc29tZSBpY29uIHRvIGJlIHVzZWQgYnkgdGhlIG1vcmUgbGlzdCBpdGVtXHJcbiAgICovXHJcbiAgaWNvbjogJ2ZhIGZhLWNoZXZyb24nLFxyXG5cclxuICB2aWV3VHlwZTogJ2RldGFpbCcsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIEluZm9ybWF0aW9uIHRleHQgdGhhdCBpcyBjb25jYXRlbmF0ZWQgd2l0aCB0aGUgZW50aXR5IHR5cGVcclxuICAgKi9cclxuICBpbmZvcm1hdGlvblRleHQ6IHJlc291cmNlLmluZm9ybWF0aW9uVGV4dCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogRGVmYXVsdCB0aXRsZSB0ZXh0IHNob3duIGluIHRoZSB0b3AgdG9vbGJhclxyXG4gICAqL1xyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBEZWZhdWx0IHRleHQgdXNlZCBpbiB0aGUgaGVhZGVyIHRpdGxlLCBmb2xsb3dlZCBieSBpbmZvcm1hdGlvblxyXG4gICAqL1xyXG4gIGVudGl0eVRleHQ6IHJlc291cmNlLmVudGl0eVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogSGVscGVyIHN0cmluZyBmb3IgYSBiYXNpYyBzZWN0aW9uIGhlYWRlciB0ZXh0XHJcbiAgICovXHJcbiAgZGV0YWlsc1RleHQ6IHJlc291cmNlLmRldGFpbHNUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gd2hpbGUgbG9hZGluZyBhbmQgdXNlZCBpbiBsb2FkaW5nVGVtcGxhdGVcclxuICAgKi9cclxuICBsb2FkaW5nVGV4dDogcmVzb3VyY2UubG9hZGluZ1RleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCB1c2VkIGluIHRoZSBub3RBdmFpbGFibGVUZW1wbGF0ZVxyXG4gICAqL1xyXG4gIG5vdEF2YWlsYWJsZVRleHQ6IHJlc291cmNlLm5vdEF2YWlsYWJsZVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogQVJJQSBsYWJlbCB0ZXh0IGZvciBhIGNvbGxhcHNpYmxlIHNlY3Rpb24gaGVhZGVyXHJcbiAgICovXHJcbiAgdG9nZ2xlQ29sbGFwc2VUZXh0OiByZXNvdXJjZS50b2dnbGVDb2xsYXBzZVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogQ1NTIGNsYXNzIGZvciB0aGUgY29sbGFwc2UgYnV0dG9uIHdoZW4gaW4gYSBleHBhbmRlZCBzdGF0ZVxyXG4gICAqL1xyXG4gIHRvZ2dsZUNvbGxhcHNlQ2xhc3M6ICdmYSBmYS1jaGV2cm9uLWRvd24nLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIENTUyBjbGFzcyBmb3IgdGhlIGNvbGxhcHNlIGJ1dHRvbiB3aGVuIGluIGEgY29sbGFwc2VkIHN0YXRlXHJcbiAgICovXHJcbiAgdG9nZ2xlRXhwYW5kQ2xhc3M6ICdmYSBmYS1jaGV2cm9uLXJpZ2h0JyxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogVGhlIHZpZXcgaWQgdG8gYmUgdGFrZW4gdG8gd2hlbiB0aGUgRWRpdCBidXR0b24gaXMgcHJlc3NlZCBpbiB0aGUgdG9vbGJhclxyXG4gICAqL1xyXG4gIGVkaXRWaWV3OiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdFtdfVxyXG4gICAqIFN0b3JlIGZvciBtYXBwaW5nIGxheW91dCBvcHRpb25zIHRvIGFuIGluZGV4IG9uIHRoZSBIVE1MIG5vZGVcclxuICAgKi9cclxuICBfbmF2aWdhdGlvbk9wdGlvbnM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWcgdG8gc2lnbmFsIHRoYXQgdGhlIGludGVyZmFjZSBpcyBsb2FkaW5nIGFuZCBjbGlja2luZyByZWZyZXNoIHdpbGwgYmUgaWdub3JlZCB0byBwcmV2ZW50IGRvdWJsZSBlbnRpdHkgbG9hZGluZ1xyXG4gICAqL1xyXG4gIGlzUmVmcmVzaGluZzogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogRGV0ZXJtaW5lcyB0aGUgU29IbyBjbGFzcyBpbXBsZW1lbnRlZCBpbiBwcm9wZXJ0eSB0ZW1wbGF0ZXNcclxuICAgKi9cclxuICBtdWx0aUNvbHVtbkNsYXNzOiAnZm91cicsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9XHJcbiAgICogRGV0ZXJtaW5lcyBob3cgbWFueSBjb2x1bW5zIHRoZSBkZXRhaWwgdmlldyBwcm9wZXJ0eSB2aWV3cyBzaG91bGQgY29udGFpblxyXG4gICAqL1xyXG4gIG11bHRpQ29sdW1uQ291bnQ6IDMsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCBzaG93biBpbiB0aGUgdG9wIHRvb2xiYXIgcmVmcmVzaCBidXR0b25cclxuICAgKi9cclxuICByZWZyZXNoVG9vbHRpcFRleHQ6IHJlc291cmNlLnJlZnJlc2hUb29sdGlwVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IHNob3duIGluIHRoZSB0b3AgdG9vbGJhciBlZGl0IGJ1dHRvblxyXG4gICAqL1xyXG4gIGVkaXRUb29sdGlwVGV4dDogcmVzb3VyY2UuZWRpdFRvb2x0aXBUZXh0LFxyXG5cclxuICAvLyBTdG9yZSBwcm9wZXJ0aWVzXHJcbiAgaXRlbXNQcm9wZXJ0eTogJycsXHJcbiAgaWRQcm9wZXJ0eTogJycsXHJcbiAgbGFiZWxQcm9wZXJ0eTogJycsXHJcbiAgZW50aXR5UHJvcGVydHk6ICcnLFxyXG4gIHZlcnNpb25Qcm9wZXJ0eTogJycsXHJcblxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIGRpaml0IHdpZGdldCBwb3N0Q3JlYXRlIHRvIHN1YnNjcmliZSB0byB0aGUgZ2xvYmFsIGAvYXBwL3JlZnJlc2hgIGV2ZW50IGFuZCBjbGVhciB0aGUgdmlldy5cclxuICAgKi9cclxuICBwb3N0Q3JlYXRlOiBmdW5jdGlvbiBwb3N0Q3JlYXRlKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQocG9zdENyZWF0ZSwgYXJndW1lbnRzKTtcclxuICAgIHRoaXMuc3Vic2NyaWJlKCcvYXBwL3JlZnJlc2gnLCB0aGlzLl9vblJlZnJlc2gpO1xyXG4gICAgdGhpcy5jbGVhcigpO1xyXG4gIH0sXHJcbiAgY3JlYXRlRXJyb3JIYW5kbGVyczogZnVuY3Rpb24gY3JlYXRlRXJyb3JIYW5kbGVycygpIHtcclxuICAgIHRoaXMuZXJyb3JIYW5kbGVycyA9IHRoaXMuZXJyb3JIYW5kbGVycyB8fCBbe1xyXG4gICAgICBuYW1lOiAnQWJvcnRlZCcsXHJcbiAgICAgIHRlc3Q6IChlcnJvcikgPT4ge1xyXG4gICAgICAgIHJldHVybiBlcnJvci5hYm9ydGVkO1xyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGU6IChlcnJvciwgbmV4dCkgPT4ge1xyXG4gICAgICAgIHRoaXMub3B0aW9ucyA9IGZhbHNlOyAvLyBmb3JjZSBhIHJlZnJlc2hcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LCB7XHJcbiAgICAgIG5hbWU6ICdBbGVydEVycm9yJyxcclxuICAgICAgdGVzdDogKGVycm9yKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yLnN0YXR1cyAhPT0gdGhpcy5IVFRQX1NUQVRVUy5OT1RfRk9VTkQgJiYgIWVycm9yLmFib3J0ZWQ7XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZTogKGVycm9yLCBuZXh0KSA9PiB7XHJcbiAgICAgICAgYWxlcnQodGhpcy5nZXRFcnJvck1lc3NhZ2UoZXJyb3IpKTsgLy9lc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9LFxyXG4gICAgfSwge1xyXG4gICAgICBuYW1lOiAnTm90Rm91bmQnLFxyXG4gICAgICB0ZXN0OiAoZXJyb3IpID0+IHtcclxuICAgICAgICByZXR1cm4gZXJyb3Iuc3RhdHVzID09PSB0aGlzLkhUVFBfU1RBVFVTLk5PVF9GT1VORDtcclxuICAgICAgfSxcclxuICAgICAgaGFuZGxlOiAoZXJyb3IsIG5leHQpID0+IHtcclxuICAgICAgICAkKHRoaXMuY29udGVudE5vZGUpLmVtcHR5KCkuYXBwZW5kKHRoaXMubm90QXZhaWxhYmxlVGVtcGxhdGUuYXBwbHkodGhpcykpO1xyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSxcclxuICAgIH0sIHtcclxuICAgICAgbmFtZTogJ0NhdGNoQWxsJyxcclxuICAgICAgdGVzdDogKCkgPT4gdHJ1ZSxcclxuICAgICAgaGFuZGxlOiAoZXJyb3IsIG5leHQpID0+IHtcclxuICAgICAgICBjb25zdCBmcm9tQ29udGV4dCA9IHRoaXMub3B0aW9ucy5mcm9tQ29udGV4dDtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZnJvbUNvbnRleHQgPSBudWxsO1xyXG4gICAgICAgIGNvbnN0IGVycm9ySXRlbSA9IHtcclxuICAgICAgICAgIHZpZXdPcHRpb25zOiB0aGlzLm9wdGlvbnMsXHJcbiAgICAgICAgICBzZXJ2ZXJFcnJvcjogZXJyb3IsXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgRXJyb3JNYW5hZ2VyLmFkZEVycm9yKHRoaXMuZ2V0RXJyb3JNZXNzYWdlKGVycm9yKSwgZXJyb3JJdGVtKTtcclxuICAgICAgICB0aGlzLm9wdGlvbnMuZnJvbUNvbnRleHQgPSBmcm9tQ29udGV4dDtcclxuICAgICAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWxvYWRpbmcnKTtcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH0sXHJcbiAgICB9XTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5lcnJvckhhbmRsZXJzO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyBhbmQgcmV0dXJucyB0aGUgdG9vbGJhciBpdGVtIGxheW91dCBkZWZpbml0aW9uLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGVuIGluIHRoZSB2aWV3XHJcbiAgICogc28gdGhhdCB5b3UgbWF5IGRlZmluZSB0aGUgdmlld3MgdG9vbGJhciBpdGVtcy5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IHRoaXMudG9vbHNcclxuICAgKiBAdGVtcGxhdGVcclxuICAgKi9cclxuICBjcmVhdGVUb29sTGF5b3V0OiBmdW5jdGlvbiBjcmVhdGVUb29sTGF5b3V0KCkge1xyXG4gICAgY29uc3QgdG9vbHMgPSBbXTtcclxuXHJcbiAgICBpZiAodGhpcy5lZGl0Vmlldykge1xyXG4gICAgICB0b29scy5wdXNoKHtcclxuICAgICAgICBpZDogJ2VkaXQnLFxyXG4gICAgICAgIHN2ZzogJ2VkaXQnLFxyXG4gICAgICAgIHRpdGxlOiB0aGlzLmVkaXRUb29sdGlwVGV4dCxcclxuICAgICAgICBhY3Rpb246ICduYXZpZ2F0ZVRvRWRpdFZpZXcnLFxyXG4gICAgICAgIHNlY3VyaXR5OiBBcHAuZ2V0Vmlld1NlY3VyaXR5KHRoaXMuZWRpdFZpZXcsICd1cGRhdGUnKSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdG9vbHMucHVzaCh7XHJcbiAgICAgIGlkOiAncmVmcmVzaCcsXHJcbiAgICAgIHN2ZzogJ3JlZnJlc2gnLFxyXG4gICAgICB0aXRsZTogdGhpcy5yZWZyZXNoVG9vbHRpcFRleHQsXHJcbiAgICAgIGFjdGlvbjogJ19yZWZyZXNoQ2xpY2tlZCcsXHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy50b29scyB8fCAodGhpcy50b29scyA9IHtcclxuICAgICAgdGJhcjogdG9vbHMsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIF9yZWZyZXNoQ2xpY2tlZDogZnVuY3Rpb24gX3JlZnJlc2hDbGlja2VkKCkge1xyXG4gICAgLy8gSWYgdGhlIHVzZXIgaGFzIGhpdCByZWZyZXNoIGFscmVhZHksIGxldCB0aGUgaW50ZXJmYWNlIGxvYWQgZmlyc3Qgc2V0IG9mIGFzc2V0c1xyXG4gICAgaWYgKHRoaXMuaXNSZWZyZXNoaW5nKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gdHJ1ZTtcclxuICAgIHRoaXMuY2xlYXIoKTtcclxuICAgIHRoaXMucmVmcmVzaFJlcXVpcmVkID0gdHJ1ZTtcclxuICAgIHRoaXMucmVmcmVzaCgpO1xyXG5cclxuICAgIHRoaXMub25SZWZyZXNoQ2xpY2tlZCgpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHVzZXIgY2xpY2tzIHRoZSByZWZyZXNoIHRvb2xiYXIgYnV0dG9uLlxyXG4gICAqL1xyXG4gIG9uUmVmcmVzaENsaWNrZWQ6IGZ1bmN0aW9uIG9uUmVmcmVzaENsaWNrZWQoKSB7fSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSB7QGxpbmsgX0FjdGlvbk1peGluI2ludm9rZUFjdGlvbiBtaXhpbnMgaW52b2tlQWN0aW9ufSB0byBzdG9wIGlmIGBkYXRhLWRpc2FibGVBY3Rpb25gIGlzIHRydWVcclxuICAgKiBAcGFyYW0gbmFtZVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIENvbGxlY3Rpb24gb2YgYGRhdGEtYCBhdHRyaWJ1dGVzIGZyb20gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnRcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gICAqL1xyXG4gIGludm9rZUFjdGlvbjogZnVuY3Rpb24gaW52b2tlQWN0aW9uKG5hbWUsIHBhcmFtZXRlcnMgLyogLCBldnQsIGVsKi8pIHtcclxuICAgIGlmIChwYXJhbWV0ZXJzICYmIC90cnVlL2kudGVzdChwYXJhbWV0ZXJzLmRpc2FibGVBY3Rpb24pKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXMuaW5oZXJpdGVkKGludm9rZUFjdGlvbiwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRvZ2dsZXMgdGhlIGNvbGxhcHNlZCBzdGF0ZSBvZiB0aGUgc2VjdGlvbi5cclxuICAgKi9cclxuICB0b2dnbGVTZWN0aW9uOiBmdW5jdGlvbiB0b2dnbGVTZWN0aW9uKHBhcmFtcykge1xyXG4gICAgY29uc3Qgbm9kZSA9ICQoYCMke3BhcmFtcy4kc291cmNlfWApO1xyXG4gICAgaWYgKG5vZGUubGVuZ3RoKSB7XHJcbiAgICAgIG5vZGUudG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xyXG4gICAgICBjb25zdCBidXR0b24gPSAkKCdidXR0b24nLCBub2RlKS5maXJzdCgpO1xyXG4gICAgICBpZiAoYnV0dG9uLmxlbmd0aCkge1xyXG4gICAgICAgIGJ1dHRvbi50b2dnbGVDbGFzcyh0aGlzLnRvZ2dsZUNvbGxhcHNlQ2xhc3MpO1xyXG4gICAgICAgIGJ1dHRvbi50b2dnbGVDbGFzcyh0aGlzLnRvZ2dsZUV4cGFuZENsYXNzKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdGhlIGdldHRpbmcgdGhlIGRldGFpbCByZXNvdXJjZSB0eXBlIGZyb20gdGhlIGlkIGFuZCBwbGFjaW5nIHRoZSBoZWFkZXIgaW50byB0aGUgZGV0YWlsIHZpZXcuLlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgcGxhY2VEZXRhaWxIZWFkZXI6IGZ1bmN0aW9uIHBsYWNlRGV0YWlsSGVhZGVyKCkge1xyXG4gICAgY29uc3QgdmFsdWUgPSBzdHJpbmcuc3Vic3RpdHV0ZSh0aGlzLmluZm9ybWF0aW9uVGV4dCwgW3RoaXMuZW50aXR5VGV4dF0pO1xyXG4gICAgJCh0aGlzLnRhYkNvbnRhaW5lcikuYmVmb3JlKHRoaXMuZGV0YWlsSGVhZGVyVGVtcGxhdGUuYXBwbHkoeyB2YWx1ZSB9LCB0aGlzKSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgZ2xvYmFsIGAvYXBwL3JlZnJlc2hgIGV2ZW50LiBTZXRzIGByZWZyZXNoUmVxdWlyZWRgIHRvIHRydWUgaWYgdGhlIGtleSBtYXRjaGVzLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBvYmplY3QgcHVibGlzaGVkIGJ5IHRoZSBldmVudC5cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIF9vblJlZnJlc2g6IGZ1bmN0aW9uIF9vblJlZnJlc2gobykge1xyXG4gICAgY29uc3QgZGVzY3JpcHRvciA9IG8uZGF0YSAmJiBvLmRhdGFbdGhpcy5sYWJlbFByb3BlcnR5XTtcclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5rZXkgPT09IG8ua2V5KSB7XHJcbiAgICAgIHRoaXMucmVmcmVzaFJlcXVpcmVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlmIChkZXNjcmlwdG9yKSB7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLnRpdGxlID0gZGVzY3JpcHRvcjtcclxuICAgICAgICB0aGlzLnNldCgndGl0bGUnLCBkZXNjcmlwdG9yKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdGhlIHJlbGF0ZWQgZW50cnkgYWN0aW9uLCBuYXZpZ2F0ZXMgdG8gdGhlIGRlZmluZWQgYGRhdGEtdmlld2AgcGFzc2luZyB0aGUgYGRhdGEtY29udGV4dGAuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBDb2xsZWN0aW9uIG9mIGBkYXRhLWAgYXR0cmlidXRlcyBmcm9tIHRoZSBzb3VyY2Ugbm9kZS5cclxuICAgKi9cclxuICBhY3RpdmF0ZVJlbGF0ZWRFbnRyeTogZnVuY3Rpb24gYWN0aXZhdGVSZWxhdGVkRW50cnkocGFyYW1zKSB7XHJcbiAgICBpZiAocGFyYW1zLmNvbnRleHQpIHtcclxuICAgICAgdGhpcy5uYXZpZ2F0ZVRvUmVsYXRlZFZpZXcocGFyYW1zLnZpZXcsIHBhcnNlSW50KHBhcmFtcy5jb250ZXh0LCAxMCksIHBhcmFtcy5kZXNjcmlwdG9yKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHRoZSByZWxhdGVkIGxpc3QgYWN0aW9uLCBuYXZpZ2F0ZXMgdG8gdGhlIGRlZmluZWQgYGRhdGEtdmlld2AgcGFzc2luZyB0aGUgYGRhdGEtY29udGV4dGAuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBDb2xsZWN0aW9uIG9mIGBkYXRhLWAgYXR0cmlidXRlcyBmcm9tIHRoZSBzb3VyY2Ugbm9kZS5cclxuICAgKi9cclxuICBhY3RpdmF0ZVJlbGF0ZWRMaXN0OiBmdW5jdGlvbiBhY3RpdmF0ZVJlbGF0ZWRMaXN0KHBhcmFtcykge1xyXG4gICAgaWYgKHBhcmFtcy5jb250ZXh0KSB7XHJcbiAgICAgIHRoaXMubmF2aWdhdGVUb1JlbGF0ZWRWaWV3KHBhcmFtcy52aWV3LCBwYXJzZUludChwYXJhbXMuY29udGV4dCwgMTApLCBwYXJhbXMuZGVzY3JpcHRvcik7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBOYXZpZ2F0ZXMgdG8gdGhlIGRlZmluZWQgYHRoaXMuZWRpdFZpZXdgIHBhc3NpbmcgdGhlIGN1cnJlbnQgYHRoaXMuZW50cnlgIGFzIGRlZmF1bHQgZGF0YS5cclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbFxyXG4gICAqL1xyXG4gIG5hdmlnYXRlVG9FZGl0VmlldzogZnVuY3Rpb24gbmF2aWdhdGVUb0VkaXRWaWV3KC8qIGVsKi8pIHtcclxuICAgIGNvbnN0IHZpZXcgPSBBcHAuZ2V0Vmlldyh0aGlzLmVkaXRWaWV3KTtcclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5lbnRyeTtcclxuICAgICAgdmlldy5zaG93KHtcclxuICAgICAgICBlbnRyeSxcclxuICAgICAgICBmcm9tQ29udGV4dDogdGhpcyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBOYXZpZ2F0ZXMgdG8gYSBnaXZlbiB2aWV3IGlkIHBhc3NpbmcgdGhlIG9wdGlvbnMgcmV0cmlldmVkIHVzaW5nIHRoZSBzbG90IGluZGV4IHRvIGB0aGlzLl9uYXZpZ2F0aW9uT3B0aW9uc2AuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIFZpZXcgaWQgdG8gZ28gdG9cclxuICAgKiBAcGFyYW0ge051bWJlcn0gc2xvdCBJbmRleCBvZiB0aGUgY29udGV4dCB0byB1c2UgaW4gYHRoaXMuX25hdmlnYXRpb25PcHRpb25zYC5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGVzY3JpcHRvciBPcHRpb25hbCBkZXNjcmlwdG9yIG9wdGlvbiB0aGF0IGlzIG1peGVkIGluLlxyXG4gICAqL1xyXG4gIG5hdmlnYXRlVG9SZWxhdGVkVmlldzogZnVuY3Rpb24gbmF2aWdhdGVUb1JlbGF0ZWRWaWV3KGlkLCBzbG90LCBkZXNjcmlwdG9yKSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5fbmF2aWdhdGlvbk9wdGlvbnNbc2xvdF07XHJcbiAgICBjb25zdCB2aWV3ID0gQXBwLmdldFZpZXcoaWQpO1xyXG5cclxuICAgIGlmIChkZXNjcmlwdG9yICYmIG9wdGlvbnMpIHtcclxuICAgICAgb3B0aW9ucy5kZXNjcmlwdG9yID0gZGVzY3JpcHRvcjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5lbnRyeSkge1xyXG4gICAgICBvcHRpb25zLnNlbGVjdGVkRW50cnkgPSB0aGlzLmVudHJ5O1xyXG4gICAgfVxyXG5cclxuICAgIG9wdGlvbnMuZnJvbUNvbnRleHQgPSB0aGlzO1xyXG4gICAgaWYgKHZpZXcgJiYgb3B0aW9ucykge1xyXG4gICAgICB2aWV3LnNob3cob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIGFuZCByZXR1cm5zIHRoZSBEZXRhaWwgdmlldyBsYXlvdXQgYnkgZm9sbG93aW5nIGEgc3RhbmRhcmQgZm9yIHNlY3Rpb24gYW5kIHJvd3M6XHJcbiAgICpcclxuICAgKiBUaGUgYHRoaXMubGF5b3V0YCBpdHNlbGYgaXMgYW4gYXJyYXkgb2Ygc2VjdGlvbiBvYmplY3RzIHdoZXJlIGEgc2VjdGlvbiBvYmplY3QgaXMgZGVmaW5lZCBhcyBzdWNoOlxyXG4gICAqXHJcbiAgICogICAgIHtcclxuICAgKiAgICAgICAgbmFtZTogJ1N0cmluZycsIC8vIFJlcXVpcmVkLiB1bmlxdWUgbmFtZSBmb3IgaWRlbnRpZmljYXRpb24vY3VzdG9taXphdGlvbiBwdXJwb3Nlc1xyXG4gICAqICAgICAgICB0aXRsZTogJ1N0cmluZycsIC8vIFJlcXVpcmVkLiBUZXh0IHNob3duIGluIHRoZSBzZWN0aW9uIGhlYWRlclxyXG4gICAqICAgICAgICBsaXN0OiBib29sZWFuLCAvLyBPcHRpb25hbC4gRGVmYXVsdCBmYWxzZS4gQ29udHJvbHMgaWYgdGhlIGdyb3VwIGNvbnRhaW5lciBmb3IgY2hpbGQgcm93cyBzaG91bGQgYmUgYSBkaXYgKGZhbHNlKSBvciB1bCAodHJ1ZSlcclxuICAgKiAgICAgICAgY2hpbGRyZW46IFtdLCAvLyBBcnJheSBvZiBjaGlsZCByb3cgb2JqZWN0c1xyXG4gICAqICAgICB9XHJcbiAgICpcclxuICAgKiBBIGNoaWxkIHJvdyBvYmplY3QgaGFzOlxyXG4gICAqXHJcbiAgICogICAgIHtcclxuICAgKiAgICAgICAgbmFtZTogJ1N0cmluZycsIC8vIFJlcXVpcmVkLiB1bmlxdWUgbmFtZSBmb3IgaWRlbnRpZmljYXRpb24vY3VzdG9taXphdGlvbiBwdXJwb3Nlc1xyXG4gICAqICAgICAgICBwcm9wZXJ0eTogJ1N0cmluZycsIC8vIE9wdGlvbmFsLiBUaGUgcHJvcGVydHkgb2YgdGhlIGN1cnJlbnQgZW50aXR5IHRvIGJpbmQgdG9cclxuICAgKiAgICAgICAgbGFiZWw6ICdTdHJpbmcnLCAvLyBPcHRpb25hbC4gVGV4dCBzaG93biBpbiB0aGUgbGFiZWwgdG8gdGhlIGxlZnQgb2YgdGhlIHByb3BlcnR5XHJcbiAgICogICAgICAgIG9uQ3JlYXRlOiBmdW5jdGlvbigpLCAvLyBPcHRpb25hbC4gWW91IG1heSBwYXNzIGEgZnVuY3Rpb24gdG8gYmUgY2FsbGVkIHdoZW4gdGhlIHJvdyBpcyBhZGRlZCB0byB0aGUgRE9NXHJcbiAgICogICAgICAgIGluY2x1ZGU6IGJvb2xlYW4sIC8vIE9wdGlvbmFsLiBJZiBmYWxzZSB0aGUgcm93IHdpbGwgbm90IGJlIGluY2x1ZGVkIGluIHRoZSBsYXlvdXRcclxuICAgKiAgICAgICAgZXhjbHVkZTogYm9vbGVhbiwgLy8gT3B0aW9uYWwuIElmIHRydWUgdGhlIHJvdyB3aWxsIG5vdCBiZSBpbmNsdWRlZCBpbiB0aGUgbGF5b3V0XHJcbiAgICogICAgICAgIHRlbXBsYXRlOiBTaW1wbGF0ZSwgLy8gT3B0aW9uYWwuIE92ZXJyaWRlIHRoZSBIVE1MIFNpbXBsYXRlIHVzZWQgZm9yIHJlbmRlcmluZyB0aGUgdmFsdWUgKG5vdCB0aGUgcm93KSB3aGVyZSBgJGAgaXMgdGhlIHJvdyBvYmplY3RcclxuICAgKiAgICAgICAgdHBsOiBTaW1wbGF0ZSwgLy8gT3B0aW9uYWwuIFNhbWUgYXMgdGVtcGxhdGUuXHJcbiAgICogICAgICAgIHJlbmRlcmVyOiBmdW5jdGlvbigpLCAvLyBPcHRpb25hbC4gUGFzcyBhIGZ1bmN0aW9uIHRoYXQgcmVjZWl2ZXMgdGhlIGN1cnJlbnQgdmFsdWUgYW5kIHJldHVybnMgYSB2YWx1ZSB0byBiZSByZW5kZXJlZFxyXG4gICAqICAgICAgICBlbmNvZGU6IGJvb2xlYW4sIC8vIE9wdGlvbmFsLiBJZiB0cnVlIGl0IHdpbGwgZW5jb2RlIEhUTUwgZW50aXRpZXNcclxuICAgKiAgICAgICAgY2xzOiAnU3RyaW5nJywgLy8gT3B0aW9uYWwuIEFkZGl0aW9uYWwgQ1NTIGNsYXNzIHN0cmluZyB0byBiZSBhZGRlZCB0byB0aGUgcm93IGRpdlxyXG4gICAqICAgICAgICB1c2U6IFNpbXBsYXRlLCAvLyBPcHRpb25hbC4gT3ZlcnJpZGUgdGhlIEhUTUwgU2ltcGxhdGUgdXNlZCBmb3IgcmVuZGVyaW5nIHRoZSByb3cgKG5vdCB2YWx1ZSlcclxuICAgKiAgICAgICAgcHJvdmlkZXI6IGZ1bmN0aW9uKGVudHJ5LCBwcm9wZXJ0eU5hbWUpLCAvLyBPcHRpb25hbC4gRnVuY3Rpb24gdGhhdCBhY2NlcHRzIHRoZSBkYXRhIGVudHJ5IGFuZCB0aGUgcHJvcGVydHkgbmFtZSBhbmQgcmV0dXJucyB0aGUgZXh0cmFjdGVkIHZhbHVlLiBCeSBkZWZhdWx0IHNpbXBseSBleHRyYWN0cyBkaXJlY3RseS5cclxuICAgKiAgICAgICAgdmFsdWU6IEFueSAvLyBPcHRpb25hbC4gUHJvdmlkZSBhIHZhbHVlIGRpcmVjdGx5IGluc3RlYWQgb2YgYmluZGluZ1xyXG4gICAqICAgICB9XHJcbiAgICpcclxuICAgKiBAcmV0dXJuIHtPYmplY3RbXX0gRGV0YWlsIGxheW91dCBkZWZpbml0aW9uXHJcbiAgICovXHJcbiAgY3JlYXRlTGF5b3V0OiBmdW5jdGlvbiBjcmVhdGVMYXlvdXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5sYXlvdXQgfHwgW107XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBQcm9jZXNzZXMgdGhlIGdpdmVuIGxheW91dCBkZWZpbml0aW9uIHVzaW5nIHRoZSBkYXRhIGVudHJ5IHJlc3BvbnNlIGJ5IHJlbmRlcmluZyBhbmQgaW5zZXJ0aW5nIHRoZSBIVE1MIG5vZGVzIGFuZFxyXG4gICAqIGZpcmluZyBhbnkgb25DcmVhdGUgZXZlbnRzIGRlZmluZWQuXHJcbiAgICogQHBhcmFtIHtPYmplY3RbXX0gbGF5b3V0IExheW91dCBkZWZpbml0aW9uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IGRhdGEgcmVzcG9uc2VcclxuICAgKi9cclxuICBwcm9jZXNzTGF5b3V0OiBmdW5jdGlvbiBwcm9jZXNzTGF5b3V0KGxheW91dCwgZW50cnkpIHtcclxuICAgIGNvbnN0IGl0ZW1zID0gKGxheW91dC5jaGlsZHJlbiB8fCBsYXlvdXQuYXMgfHwgbGF5b3V0KTtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSBsYXlvdXQub3B0aW9ucyB8fCAobGF5b3V0Lm9wdGlvbnMgPSB7XHJcbiAgICAgIHRpdGxlOiB0aGlzLmRldGFpbHNUZXh0LFxyXG4gICAgfSk7XHJcbiAgICBjb25zdCBzZWN0aW9uUXVldWUgPSBbXTtcclxuICAgIGxldCBzZWN0aW9uU3RhcnRlZCA9IGZhbHNlO1xyXG4gICAgY29uc3QgY2FsbGJhY2tzID0gW107XHJcbiAgICBsZXQgcm93ID0gW107XHJcblxyXG4gICAgbGV0IHNlY3Rpb25Ob2RlO1xyXG5cclxuICAgIGlmICh0aGlzLmlzVGFiYmVkKSB7XHJcbiAgICAgIHRoaXMucGxhY2VUYWJMaXN0KHRoaXMuY29udGVudE5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaXRlbXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgY3VycmVudCA9IGl0ZW1zW2ldO1xyXG4gICAgICBjb25zdCBpbmNsdWRlID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQuaW5jbHVkZSwgZW50cnkpO1xyXG4gICAgICBjb25zdCBleGNsdWRlID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQuZXhjbHVkZSwgZW50cnkpO1xyXG4gICAgICBsZXQgY29udGV4dDtcclxuXHJcbiAgICAgIGlmIChpbmNsdWRlICE9PSB1bmRlZmluZWQgJiYgIWluY2x1ZGUpIHtcclxuICAgICAgICBpZiAoaSA+PSAoaXRlbXMubGVuZ3RoIC0gMSkgJiYgcm93Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGNvbnN0IHJvd05vZGUgPSB0aGlzLmNyZWF0ZVJvdyhyb3cpO1xyXG4gICAgICAgICAgJChzZWN0aW9uTm9kZSkuYXBwZW5kKHJvd05vZGUpO1xyXG4gICAgICAgICAgcm93ID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZXhjbHVkZSAhPT0gdW5kZWZpbmVkICYmIGV4Y2x1ZGUpIHtcclxuICAgICAgICBpZiAoaSA+PSAoaXRlbXMubGVuZ3RoIC0gMSkgJiYgcm93Lmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgIGNvbnN0IHJvd05vZGUgPSB0aGlzLmNyZWF0ZVJvdyhyb3cpO1xyXG4gICAgICAgICAgJChzZWN0aW9uTm9kZSkuYXBwZW5kKHJvd05vZGUpO1xyXG4gICAgICAgICAgcm93ID0gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY3VycmVudC5jaGlsZHJlbiB8fCBjdXJyZW50LmFzKSB7XHJcbiAgICAgICAgaWYgKHNlY3Rpb25TdGFydGVkKSB7XHJcbiAgICAgICAgICBzZWN0aW9uUXVldWUucHVzaChjdXJyZW50KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhpcy5wcm9jZXNzTGF5b3V0KGN1cnJlbnQsIGVudHJ5KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXNlY3Rpb25TdGFydGVkKSB7XHJcbiAgICAgICAgbGV0IHNlY3Rpb247XHJcbiAgICAgICAgc2VjdGlvblN0YXJ0ZWQgPSB0cnVlO1xyXG4gICAgICAgIGlmICh0aGlzLmlzVGFiYmVkKSB7XHJcbiAgICAgICAgICBpZiAobGF5b3V0Lm5hbWUgPT09IHRoaXMucXVpY2tBY3Rpb25TZWN0aW9uKSB7XHJcbiAgICAgICAgICAgIHNlY3Rpb24gPSAkKHRoaXMuc2VjdGlvbkJlZ2luVGVtcGxhdGUuYXBwbHkobGF5b3V0LCB0aGlzKSArIHRoaXMuc2VjdGlvbkVuZFRlbXBsYXRlLmFwcGx5KGxheW91dCwgdGhpcykpO1xyXG4gICAgICAgICAgICBzZWN0aW9uTm9kZSA9IHNlY3Rpb24uZ2V0KDApO1xyXG4gICAgICAgICAgICAkKHRoaXMucXVpY2tBY3Rpb25zKS5hcHBlbmQoc2VjdGlvbik7XHJcbiAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICBjb25zdCB0YWIgPSAkKHRoaXMudGFiTGlzdEl0ZW1UZW1wbGF0ZS5hcHBseShsYXlvdXQsIHRoaXMpKS5nZXQoMCk7XHJcbiAgICAgICAgICAgIHNlY3Rpb24gPSAkKHRoaXMuc2VjdGlvbkJlZ2luVGVtcGxhdGUuYXBwbHkobGF5b3V0LCB0aGlzKSArIHRoaXMuc2VjdGlvbkVuZFRlbXBsYXRlLmFwcGx5KGxheW91dCwgdGhpcykpO1xyXG4gICAgICAgICAgICBzZWN0aW9uTm9kZSA9IHNlY3Rpb24uZ2V0KDApO1xyXG4gICAgICAgICAgICB0aGlzLnRhYk1hcHBpbmcucHVzaChzZWN0aW9uLmdldCgwKSk7XHJcbiAgICAgICAgICAgIHRoaXMudGFicy5wdXNoKHRhYik7XHJcbiAgICAgICAgICAgICQodGhpcy50YWJDb250YWluZXIpLmFwcGVuZChzZWN0aW9uKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgc2VjdGlvbiA9ICQodGhpcy5zZWN0aW9uQmVnaW5UZW1wbGF0ZS5hcHBseShsYXlvdXQsIHRoaXMpICsgdGhpcy5zZWN0aW9uRW5kVGVtcGxhdGUuYXBwbHkobGF5b3V0LCB0aGlzKSk7XHJcbiAgICAgICAgICBzZWN0aW9uTm9kZSA9IHNlY3Rpb24uZ2V0KDApLmNoaWxkTm9kZXNbMV07XHJcbiAgICAgICAgICAkKHRoaXMudGFiQ29udGFpbmVyKS5hcHBlbmQoc2VjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBwcm92aWRlciA9IGN1cnJlbnQucHJvdmlkZXIgfHwgdXRpbGl0eS5nZXRWYWx1ZTtcclxuICAgICAgY29uc3QgcHJvcGVydHkgPSB0eXBlb2YgY3VycmVudC5wcm9wZXJ0eSA9PT0gJ3N0cmluZycgPyBjdXJyZW50LnByb3BlcnR5IDogY3VycmVudC5uYW1lO1xyXG4gICAgICBjb25zdCB2YWx1ZSA9IHR5cGVvZiBjdXJyZW50LnZhbHVlID09PSAndW5kZWZpbmVkJyA/IHByb3ZpZGVyKGVudHJ5LCBwcm9wZXJ0eSwgZW50cnkpIDogY3VycmVudC52YWx1ZTtcclxuICAgICAgbGV0IHJlbmRlcmVkO1xyXG4gICAgICBsZXQgZm9ybWF0dGVkO1xyXG4gICAgICBpZiAoY3VycmVudC50ZW1wbGF0ZSB8fCBjdXJyZW50LnRwbCkge1xyXG4gICAgICAgIHJlbmRlcmVkID0gKGN1cnJlbnQudGVtcGxhdGUgfHwgY3VycmVudC50cGwpLmFwcGx5KHZhbHVlLCB0aGlzKTtcclxuICAgICAgICBmb3JtYXR0ZWQgPSBjdXJyZW50LmVuY29kZSA9PT0gdHJ1ZSA/IGZvcm1hdC5lbmNvZGUocmVuZGVyZWQpIDogcmVuZGVyZWQ7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudC5yZW5kZXJlciAmJiB0eXBlb2YgY3VycmVudC5yZW5kZXJlciA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHJlbmRlcmVkID0gY3VycmVudC5yZW5kZXJlci5jYWxsKHRoaXMsIHZhbHVlKTtcclxuICAgICAgICBmb3JtYXR0ZWQgPSBjdXJyZW50LmVuY29kZSA9PT0gdHJ1ZSA/IGZvcm1hdC5lbmNvZGUocmVuZGVyZWQpIDogcmVuZGVyZWQ7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZm9ybWF0dGVkID0gY3VycmVudC5lbmNvZGUgIT09IGZhbHNlID8gZm9ybWF0LmVuY29kZSh2YWx1ZSkgOiB2YWx1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3QgZGF0YSA9IGxhbmcubWl4aW4oe30sIHtcclxuICAgICAgICBlbnRyeSxcclxuICAgICAgICB2YWx1ZTogZm9ybWF0dGVkLFxyXG4gICAgICAgIHJhdzogdmFsdWUsXHJcbiAgICAgIH0sIGN1cnJlbnQpO1xyXG5cclxuICAgICAgaWYgKGN1cnJlbnQuZGVzY3JpcHRvcikge1xyXG4gICAgICAgIGRhdGEuZGVzY3JpcHRvciA9IHR5cGVvZiBjdXJyZW50LmRlc2NyaXB0b3IgPT09ICdmdW5jdGlvbicgPyB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5kZXNjcmlwdG9yLCBlbnRyeSwgdmFsdWUpIDogcHJvdmlkZXIoZW50cnksIGN1cnJlbnQuZGVzY3JpcHRvcik7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjdXJyZW50LmFjdGlvbikge1xyXG4gICAgICAgIGRhdGEuYWN0aW9uID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQuYWN0aW9uLCBlbnRyeSwgdmFsdWUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBoYXNBY2Nlc3MgPSBBcHAuaGFzQWNjZXNzVG8oY3VycmVudC5zZWN1cml0eSk7XHJcblxyXG4gICAgICBpZiAoY3VycmVudC5zZWN1cml0eSkge1xyXG4gICAgICAgIGRhdGEuZGlzYWJsZWQgPSAhaGFzQWNjZXNzO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY3VycmVudC5kaXNhYmxlZCAmJiBoYXNBY2Nlc3MpIHtcclxuICAgICAgICBkYXRhLmRpc2FibGVkID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQuZGlzYWJsZWQsIGVudHJ5LCB2YWx1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjdXJyZW50LnZpZXcpIHtcclxuICAgICAgICBjb250ZXh0ID0gbGFuZy5taXhpbih7fSwgY3VycmVudC5vcHRpb25zKTtcclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnQua2V5KSB7XHJcbiAgICAgICAgICBjb250ZXh0LmtleSA9IHR5cGVvZiBjdXJyZW50LmtleSA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LmtleSwgZW50cnkpIDogcHJvdmlkZXIoZW50cnksIGN1cnJlbnQua2V5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnQud2hlcmUpIHtcclxuICAgICAgICAgIGNvbnRleHQud2hlcmUgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC53aGVyZSwgZW50cnkpO1xyXG4gICAgICAgICAgaWYgKGNvbnRleHQud2hlcmUgPT09ICcnKSB7XHJcbiAgICAgICAgICAgIGRhdGEuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudC5jb250cmFjdE5hbWUpIHtcclxuICAgICAgICAgIGNvbnRleHQuY29udHJhY3ROYW1lID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQuY29udHJhY3ROYW1lLCBlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50LnJlc291cmNlS2luZCkge1xyXG4gICAgICAgICAgY29udGV4dC5yZXNvdXJjZUtpbmQgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5yZXNvdXJjZUtpbmQsIGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnQucmVzb3VyY2VQcm9wZXJ0eSkge1xyXG4gICAgICAgICAgY29udGV4dC5yZXNvdXJjZVByb3BlcnR5ID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQucmVzb3VyY2VQcm9wZXJ0eSwgZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudC5yZXNvdXJjZVByZWRpY2F0ZSkge1xyXG4gICAgICAgICAgY29udGV4dC5yZXNvdXJjZVByZWRpY2F0ZSA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LnJlc291cmNlUHJlZGljYXRlLCBlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50LmRhdGFTZXQpIHtcclxuICAgICAgICAgIGNvbnRleHQuZGF0YVNldCA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LmRhdGFTZXQsIGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnQudGl0bGUpIHtcclxuICAgICAgICAgIGNvbnRleHQudGl0bGUgPSBjdXJyZW50LnRpdGxlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKGN1cnJlbnQucmVzZXRTZWFyY2gpIHtcclxuICAgICAgICAgIGNvbnRleHQucmVzZXRTZWFyY2ggPSBjdXJyZW50LnJlc2V0U2VhcmNoO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb250ZXh0LnJlc2V0U2VhcmNoID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGRhdGEudmlldyA9IGN1cnJlbnQudmlldztcclxuICAgICAgICBkYXRhLmNvbnRleHQgPSAodGhpcy5fbmF2aWdhdGlvbk9wdGlvbnMucHVzaChjb250ZXh0KSAtIDEpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCB1c2VMaXN0VGVtcGxhdGUgPSAobGF5b3V0Lmxpc3QgfHwgb3B0aW9ucy5saXN0KTtcclxuXHJcbiAgICAgIGxldCB0ZW1wbGF0ZTtcclxuICAgICAgbGV0IGlzQ29sdW1uSXRlbSA9IGZhbHNlO1xyXG4gICAgICAvLyBwcmlvcml0eTogdXNlID4gKHJlbGF0ZWRQcm9wZXJ0eVRlbXBsYXRlIHwgcmVsYXRlZFRlbXBsYXRlKSA+IChhY3Rpb25Qcm9wZXJ0eVRlbXBsYXRlIHwgYWN0aW9uVGVtcGxhdGUpID4gcHJvcGVydHlUZW1wbGF0ZVxyXG4gICAgICBpZiAoY3VycmVudC51c2UpIHtcclxuICAgICAgICB0ZW1wbGF0ZSA9IGN1cnJlbnQudXNlO1xyXG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnQudmlldyAmJiB1c2VMaXN0VGVtcGxhdGUpIHtcclxuICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMucmVsYXRlZFRlbXBsYXRlO1xyXG4gICAgICAgIGN1cnJlbnQucmVsYXRlZEl0ZW0gPSB0cnVlO1xyXG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnQudmlldykge1xyXG4gICAgICAgIHRlbXBsYXRlID0gdGhpcy5yZWxhdGVkUHJvcGVydHlUZW1wbGF0ZTtcclxuICAgICAgICBpc0NvbHVtbkl0ZW0gPSB0cnVlO1xyXG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnQuYWN0aW9uICYmIHVzZUxpc3RUZW1wbGF0ZSkge1xyXG4gICAgICAgIHRlbXBsYXRlID0gdGhpcy5hY3Rpb25UZW1wbGF0ZTtcclxuICAgICAgfSBlbHNlIGlmIChjdXJyZW50LmFjdGlvbikge1xyXG4gICAgICAgIHRlbXBsYXRlID0gdGhpcy5hY3Rpb25Qcm9wZXJ0eVRlbXBsYXRlO1xyXG4gICAgICAgIGlzQ29sdW1uSXRlbSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGVtcGxhdGUgPSB0aGlzLnByb3BlcnR5VGVtcGxhdGU7XHJcbiAgICAgICAgaXNDb2x1bW5JdGVtID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgbGV0IHJvd05vZGUgPSB0aGlzLmNyZWF0ZVJvd05vZGUoY3VycmVudCwgc2VjdGlvbk5vZGUsIGVudHJ5LCB0ZW1wbGF0ZSwgZGF0YSk7XHJcbiAgICAgIGlmICgoZGF0YS5yYXcgIT09IHVuZGVmaW5lZCkgJiYgZGF0YS52YWx1ZSkge1xyXG4gICAgICAgIGlmIChpc0NvbHVtbkl0ZW0pIHtcclxuICAgICAgICAgIHJvdy5wdXNoKHJvd05vZGUpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKHNlY3Rpb25Ob2RlKS5hcHBlbmQocm93Tm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocm93Lmxlbmd0aCA+PSB0aGlzLm11bHRpQ29sdW1uQ291bnQgfHwgKGkgPj0gKGl0ZW1zLmxlbmd0aCAtIDEpICYmIHJvdy5sZW5ndGggPiAwKSkge1xyXG4gICAgICAgIHJvd05vZGUgPSB0aGlzLmNyZWF0ZVJvdyhyb3cpO1xyXG4gICAgICAgICQoc2VjdGlvbk5vZGUpLmFwcGVuZChyb3dOb2RlKTtcclxuICAgICAgICByb3cgPSBbXTtcclxuICAgICAgfVxyXG4gICAgICBpZiAoY3VycmVudC5yZWxhdGVkSXRlbSkge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICB0aGlzLl9wcm9jZXNzUmVsYXRlZEl0ZW0oZGF0YSwgY29udGV4dCwgcm93Tm9kZSk7XHJcbiAgICAgICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgICAgLy8gZXJyb3IgcHJvY2Vzc2luZyByZWxhdGVkIG5vZGVcclxuICAgICAgICAgIGNvbnNvbGUuZXJyb3IoZSk7IC8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnQub25DcmVhdGUpIHtcclxuICAgICAgICBjYWxsYmFja3MucHVzaCh7XHJcbiAgICAgICAgICByb3c6IGN1cnJlbnQsXHJcbiAgICAgICAgICBub2RlOiByb3dOb2RlLFxyXG4gICAgICAgICAgdmFsdWUsXHJcbiAgICAgICAgICBlbnRyeSxcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY2FsbGJhY2tzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGl0ZW0gPSBjYWxsYmFja3NbaV07XHJcbiAgICAgIGl0ZW0ucm93Lm9uQ3JlYXRlLmFwcGx5KHRoaXMsIFtpdGVtLnJvdywgaXRlbS5ub2RlLCBpdGVtLnZhbHVlLCBpdGVtLmVudHJ5XSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzZWN0aW9uUXVldWUubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgY3VycmVudCA9IHNlY3Rpb25RdWV1ZVtpXTtcclxuICAgICAgdGhpcy5wcm9jZXNzTGF5b3V0KGN1cnJlbnQsIGVudHJ5KTtcclxuICAgIH1cclxuICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgfSxcclxuICBjcmVhdGVSb3c6IGZ1bmN0aW9uIGNyZWF0ZVJvdyhyb3cpIHtcclxuICAgIGNvbnN0IHJvd1RlbXBsYXRlID0gJCh0aGlzLnJvd1RlbXBsYXRlLmFwcGx5KG51bGwsIHRoaXMpKTtcclxuICAgIHJvdy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgIHJvd1RlbXBsYXRlLmFwcGVuZChlbGVtZW50KTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJvd1RlbXBsYXRlO1xyXG4gIH0sXHJcbiAgY3JlYXRlUm93Tm9kZTogZnVuY3Rpb24gY3JlYXRlUm93Tm9kZShsYXlvdXQsIHNlY3Rpb25Ob2RlLCBlbnRyeSwgdGVtcGxhdGUsIGRhdGEpIHtcclxuICAgIGNvbnN0IGZyYWcgPSAkKHRlbXBsYXRlLmFwcGx5KGRhdGEsIHRoaXMpKTtcclxuICAgIHJldHVybiBmcmFnLmdldCgwKTtcclxuICB9LFxyXG4gIF9nZXRTdG9yZUF0dHI6IGZ1bmN0aW9uIF9nZXRTdG9yZUF0dHIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5zdG9yZSB8fCAodGhpcy5zdG9yZSA9IHRoaXMuY3JlYXRlU3RvcmUoKSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDcmVhdGVTdG9yZSBpcyB0aGUgY29yZSBvZiB0aGUgZGF0YSBoYW5kbGluZyBmb3IgRGV0YWlsIFZpZXdzLiBCeSBkZWZhdWx0IGl0IGlzIGVtcHR5IGJ1dCBpdCBzaG91bGQgcmV0dXJuXHJcbiAgICogYSBkb2pvIHN0b3JlIG9mIHlvdXIgY2hvb3NpbmcuIFRoZXJlIGFyZSB7QGxpbmsgX1NEYXRhRGV0YWlsTWl4aW4gTWl4aW5zfSBhdmFpbGFibGUgZm9yIFNEYXRhLlxyXG4gICAqIEByZXR1cm4geyp9XHJcbiAgICovXHJcbiAgY3JlYXRlU3RvcmU6IGZ1bmN0aW9uIGNyZWF0ZVN0b3JlKCkge1xyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAdGVtcGxhdGVcclxuICAgKiBPcHRpb25hbCBwcm9jZXNzaW5nIG9mIHRoZSByZXR1cm5lZCBlbnRyeSBiZWZvcmUgaXQgZ2V0cyBwcm9jZXNzZWQgaW50byBsYXlvdXQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IEVudHJ5IGZyb20gZGF0YSBzdG9yZVxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gQnkgZGVmYXVsdCBkb2VzIG5vdCBkbyBhbnkgcHJvY2Vzc2luZ1xyXG4gICAqL1xyXG4gIHByZVByb2Nlc3NFbnRyeTogZnVuY3Rpb24gcHJlUHJvY2Vzc0VudHJ5KGVudHJ5KSB7XHJcbiAgICByZXR1cm4gZW50cnk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBUYWtlcyB0aGUgZW50cnkgZnJvbSB0aGUgZGF0YSBzdG9yZSwgYXBwbGllcyBjdXN0b21pemF0aW9uLCBhcHBsaWVzIGFueSBjdXN0b20gaXRlbSBwcm9jZXNzIGFuZCB0aGVuXHJcbiAgICogcGFzc2VzIGl0IHRvIHByb2Nlc3MgbGF5b3V0LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSBFbnRyeSBmcm9tIGRhdGEgc3RvcmVcclxuICAgKi9cclxuICBwcm9jZXNzRW50cnk6IGZ1bmN0aW9uIHByb2Nlc3NFbnRyeShlbnRyeSkge1xyXG4gICAgdGhpcy5lbnRyeSA9IHRoaXMucHJlUHJvY2Vzc0VudHJ5KGVudHJ5KTtcclxuXHJcbiAgICBpZiAodGhpcy5lbnRyeSkge1xyXG4gICAgICB0aGlzLnByb2Nlc3NMYXlvdXQodGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dCh0aGlzLmNyZWF0ZUxheW91dCgpKSwgdGhpcy5lbnRyeSk7XHJcbiAgICAgIGlmICh0aGlzLmlzVGFiYmVkKSB7XHJcbiAgICAgICAgdGhpcy5jcmVhdGVUYWJzKHRoaXMudGFicyk7XHJcbiAgICAgICAgdGhpcy5wbGFjZURldGFpbEhlYWRlcih0aGlzLmVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZXQoJ2RldGFpbENvbnRlbnQnLCAnJyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBfb25HZXRDb21wbGV0ZTogZnVuY3Rpb24gX29uR2V0Q29tcGxldGUoZW50cnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChlbnRyeSkge1xyXG4gICAgICAgIHRoaXMucHJvY2Vzc0VudHJ5KGVudHJ5KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICAkKHRoaXMuY29udGVudE5vZGUpLmVtcHR5KCkuYXBwZW5kKHRoaXMubm90QXZhaWxhYmxlVGVtcGxhdGUuYXBwbHkodGhpcykpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ3BhbmVsLWxvYWRpbmcnKTtcclxuXHJcbiAgICAgIC8qIHRoaXMgbXVzdCB0YWtlIHBsYWNlIHdoZW4gdGhlIGNvbnRlbnQgaXMgdmlzaWJsZSAqL1xyXG4gICAgICB0aGlzLm9uQ29udGVudENoYW5nZSgpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGUpOyAvL2VzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIH0gZmluYWxseSB7XHJcbiAgICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSxcclxuICBfb25HZXRFcnJvcjogZnVuY3Rpb24gX29uR2V0RXJyb3IoZ2V0T3B0aW9ucywgZXJyb3IpIHtcclxuICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpO1xyXG4gICAgdGhpcy5pc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEluaXRpYXRlcyB0aGUgcmVxdWVzdC5cclxuICAgKi9cclxuICByZXF1ZXN0RGF0YTogZnVuY3Rpb24gcmVxdWVzdERhdGEoKSB7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoJ3BhbmVsLWxvYWRpbmcnKTtcclxuXHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0KCdzdG9yZScpO1xyXG5cclxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5yZXF1ZXN0RGF0YVVzaW5nTW9kZWwoKS50aGVuKChkYXRhKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fb25HZXRDb21wbGV0ZShkYXRhKTtcclxuICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgIHRoaXMuX29uR2V0RXJyb3IobnVsbCwgZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICB9IGVsc2UgaWYgKHN0b3JlKSB7XHJcbiAgICAgIGNvbnN0IGdldE9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICAgIHRoaXMuX2FwcGx5U3RhdGVUb0dldE9wdGlvbnMoZ2V0T3B0aW9ucyk7XHJcblxyXG4gICAgICBjb25zdCBnZXRFeHByZXNzaW9uID0gdGhpcy5fYnVpbGRHZXRFeHByZXNzaW9uKCkgfHwgbnVsbDtcclxuICAgICAgY29uc3QgZ2V0UmVzdWx0cyA9IHRoaXMucmVxdWVzdERhdGFVc2luZ1N0b3JlKGdldEV4cHJlc3Npb24sIGdldE9wdGlvbnMpO1xyXG5cclxuICAgICAgd2hlbihnZXRSZXN1bHRzLFxyXG4gICAgICAgIHRoaXMuX29uR2V0Q29tcGxldGUuYmluZCh0aGlzKSxcclxuICAgICAgICB0aGlzLl9vbkdldEVycm9yLmJpbmQodGhpcywgZ2V0T3B0aW9ucylcclxuICAgICAgKTtcclxuXHJcbiAgICAgIHJldHVybiBnZXRSZXN1bHRzO1xyXG4gICAgfVxyXG5cclxuICAgIHRocm93IG5ldyBFcnJvcigncmVxdWVzdERhdGEgY2FsbGVkIHdpdGhvdXQgYSBtb2RlbCBvciBzdG9yZSBkZWZpbmVkLicpO1xyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGFVc2luZ01vZGVsOiBmdW5jdGlvbiByZXF1ZXN0RGF0YVVzaW5nTW9kZWwoKSB7XHJcbiAgICBjb25zdCBrZXkgPSB0aGlzLl9idWlsZEdldEV4cHJlc3Npb24oKTtcclxuICAgIHJldHVybiB0aGlzLl9tb2RlbC5nZXRFbnRyeShrZXksIHRoaXMub3B0aW9ucyk7XHJcbiAgfSxcclxuICByZXF1ZXN0RGF0YVVzaW5nU3RvcmU6IGZ1bmN0aW9uIHJlcXVlc3REYXRhVXNpbmdTdG9yZShnZXRFeHByZXNzaW9uLCBnZXRPcHRpb25zKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0KCdzdG9yZScpO1xyXG4gICAgcmV0dXJuIHN0b3JlLmdldChnZXRFeHByZXNzaW9uLCBnZXRPcHRpb25zKTtcclxuICB9LFxyXG4gIF9idWlsZEdldEV4cHJlc3Npb246IGZ1bmN0aW9uIF9idWlsZEdldEV4cHJlc3Npb24oKSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG4gICAgcmV0dXJuIG9wdGlvbnMgJiYgKG9wdGlvbnMuaWQgfHwgb3B0aW9ucy5rZXkpO1xyXG4gIH0sXHJcbiAgX2FwcGx5U3RhdGVUb0dldE9wdGlvbnM6IGZ1bmN0aW9uIF9hcHBseVN0YXRlVG9HZXRPcHRpb25zKC8qIGdldE9wdGlvbnMqLykge30sXHJcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgdmlldyBzaG91bGQgYmUgcmVmcmVzaCBieSBpbnNwZWN0aW5nIGFuZCBjb21wYXJpbmcgdGhlIHBhc3NlZCBuYXZpZ2F0aW9uIG9wdGlvbiBrZXkgd2l0aCBjdXJyZW50IGtleS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyBQYXNzZWQgbmF2aWdhdGlvbiBvcHRpb25zLlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59IFRydWUgaWYgdGhlIHZpZXcgc2hvdWxkIGJlIHJlZnJlc2hlZCwgZmFsc2UgaWYgbm90LlxyXG4gICAqL1xyXG4gIHJlZnJlc2hSZXF1aXJlZEZvcjogZnVuY3Rpb24gcmVmcmVzaFJlcXVpcmVkRm9yKG9wdGlvbnMpIHtcclxuICAgIGlmICh0aGlzLm9wdGlvbnMpIHtcclxuICAgICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLmtleSAhPT0gb3B0aW9ucy5rZXkpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0aGlzLmluaGVyaXRlZChyZWZyZXNoUmVxdWlyZWRGb3IsIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSB7QGxpbmsgVmlldyNhY3RpdmF0ZSBwYXJlbnQgaW1wbGVtZW50YXRpb259IHRvIHNldCB0aGUgbmF2IG9wdGlvbnMgdGl0bGUgYXR0cmlidXRlIHRvIHRoZSBkZXNjcmlwdG9yXHJcbiAgICogQHBhcmFtIHRhZ1xyXG4gICAqIEBwYXJhbSBkYXRhXHJcbiAgICovXHJcbiAgYWN0aXZhdGU6IGZ1bmN0aW9uIGFjdGl2YXRlKHRhZywgZGF0YSkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IGRhdGEgJiYgZGF0YS5vcHRpb25zO1xyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5kZXNjcmlwdG9yKSB7XHJcbiAgICAgIG9wdGlvbnMudGl0bGUgPSBvcHRpb25zLnRpdGxlIHx8IG9wdGlvbnMuZGVzY3JpcHRvcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaGVyaXRlZChhY3RpdmF0ZSwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIHNob3c6IGZ1bmN0aW9uIHNob3cob3B0aW9ucykge1xyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5kZXNjcmlwdG9yKSB7XHJcbiAgICAgIG9wdGlvbnMudGl0bGUgPSBvcHRpb25zLnRpdGxlIHx8IG9wdGlvbnMuZGVzY3JpcHRvcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaGVyaXRlZChzaG93LCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgdmlldyBrZXlcclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFZpZXcga2V5XHJcbiAgICovXHJcbiAgZ2V0VGFnOiBmdW5jdGlvbiBnZXRUYWcoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5rZXk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSB7QGxpbmsgVmlldyNnZXRDb250ZXh0IHBhcmVudCBpbXBsZW1lbnRhdGlvbn0gdG8gYWxzbyBzZXQgdGhlIHJlc291cmNlS2luZCwga2V5IGFuZCBkZXNjcmlwdG9yXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBWaWV3IGNvbnRleHQgb2JqZWN0XHJcbiAgICovXHJcbiAgZ2V0Q29udGV4dDogZnVuY3Rpb24gZ2V0Q29udGV4dCgpIHtcclxuICAgIHJldHVybiBsYW5nLm1peGluKHRoaXMuaW5oZXJpdGVkKGdldENvbnRleHQsIGFyZ3VtZW50cyksIHtcclxuICAgICAgcmVzb3VyY2VLaW5kOiB0aGlzLnJlc291cmNlS2luZCxcclxuICAgICAga2V5OiB0aGlzLm9wdGlvbnMua2V5LFxyXG4gICAgICBkZXNjcmlwdG9yOiB0aGlzLm9wdGlvbnMuZGVzY3JpcHRvcixcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUge0BsaW5rIFZpZXcjYmVmb3JlVHJhbnNpdGlvblRvIHBhcmVudCBpbXBsZW1lbnRhdGlvbn0gdG8gYWxzbyBjbGVhciB0aGUgdmlldyBpZiBgcmVmcmVzaFJlcXVpcmVkYCBpcyB0cnVlXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBWaWV3IGNvbnRleHQgb2JqZWN0XHJcbiAgICovXHJcbiAgYmVmb3JlVHJhbnNpdGlvblRvOiBmdW5jdGlvbiBiZWZvcmVUcmFuc2l0aW9uVG8oKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChiZWZvcmVUcmFuc2l0aW9uVG8sIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgaWYgKHRoaXMucmVmcmVzaFJlcXVpcmVkKSB7XHJcbiAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIElmIGEgc2VjdXJpdHkgYnJlYWNoIGlzIGRldGVjdGVkIGl0IHNldHMgdGhlIGNvbnRlbnQgdG8gdGhlIG5vdEF2YWlsYWJsZVRlbXBsYXRlLCBvdGhlcndpc2UgaXQgY2FsbHNcclxuICAgKiB7QGxpbmsgI3JlcXVlc3REYXRhIHJlcXVlc3REYXRhfSB3aGljaCBzdGFydHMgdGhlIHByb2Nlc3Mgc2VxdWVuY2UuXHJcbiAgICovXHJcbiAgcmVmcmVzaDogZnVuY3Rpb24gcmVmcmVzaCgpIHtcclxuICAgIGlmICh0aGlzLnNlY3VyaXR5ICYmICFBcHAuaGFzQWNjZXNzVG8odGhpcy5leHBhbmRFeHByZXNzaW9uKHRoaXMuc2VjdXJpdHkpKSkge1xyXG4gICAgICAkKHRoaXMuY29udGVudE5vZGUpLmFwcGVuZCh0aGlzLm5vdEF2YWlsYWJsZVRlbXBsYXRlLmFwcGx5KHRoaXMpKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVxdWVzdERhdGEoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENsZWFycyB0aGUgdmlldyBieSByZXBsYWNpbmcgdGhlIGNvbnRlbnQgd2l0aCB0aGUgZW1wdHkgdGVtcGxhdGUgYW5kIGVtcHR5aW5nIHRoZSBzdG9yZWQgcm93IGNvbnRleHRzLlxyXG4gICAqL1xyXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgIHRoaXMuc2V0KCdkZXRhaWxDb250ZW50JywgdGhpcy5lbXB0eVRlbXBsYXRlLmFwcGx5KHRoaXMpKTtcclxuICAgIHRoaXMuY2xlYXJUYWJzKCk7XHJcbiAgICBpZiAodGhpcy5xdWlja0FjdGlvbnMpIHtcclxuICAgICAgJCh0aGlzLnF1aWNrQWN0aW9ucykuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9uYXZpZ2F0aW9uT3B0aW9ucyA9IFtdO1xyXG4gIH0sXHJcbiAgX3Byb2Nlc3NSZWxhdGVkSXRlbTogZnVuY3Rpb24gX3Byb2Nlc3NSZWxhdGVkSXRlbShkYXRhLCBjb250ZXh0LCByb3dOb2RlKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gQXBwLmdldFZpZXcoZGF0YS52aWV3KTtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICBjb25zdCByZW5kZXJSZWxhdGVkID0gKHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAocmVzdWx0ID49IDApIHtcclxuICAgICAgICBjb25zdCBsYWJlbE5vZGUgPSAkKCcucmVsYXRlZC1pdGVtLWxhYmVsJywgcm93Tm9kZSkuZmlyc3QoKTtcclxuICAgICAgICBpZiAobGFiZWxOb2RlLmxlbmd0aCkge1xyXG4gICAgICAgICAgJCgnLmJ1c3kteHMnLCBsYWJlbE5vZGUpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgbGFiZWxOb2RlLmJlZm9yZShgPHNwYW4gY2xhc3M9XCJpbmZvIGJhZGdlXCI+JHtyZXN1bHR9PC9zcGFuPmApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ01pc3NpbmcgdGhlIFwicmVsYXRlZC1pdGVtLWxhYmVsXCIgZG9tIG5vZGUuJyk7IC8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAodmlldyAmJiBjb250ZXh0ICYmIGNvbnRleHQud2hlcmUpIHtcclxuICAgICAgb3B0aW9ucy53aGVyZSA9IGNvbnRleHQud2hlcmU7XHJcbiAgICAgIHZpZXcuZ2V0TGlzdENvdW50KG9wdGlvbnMpXHJcbiAgICAgICAgLnRoZW4ocmVuZGVyUmVsYXRlZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZW5kZXJSZWxhdGVkKDApO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVtb3ZlRW50cnk6IGZ1bmN0aW9uIHJlbW92ZUVudHJ5KCkge1xyXG4gICAgY29uc3QgZW50cnkgPSB0aGlzLl9jcmVhdGVFbnRyeUZvclJlbW92ZSgpO1xyXG4gICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcbiAgICAgIGlmIChzdG9yZSkge1xyXG4gICAgICAgIHN0b3JlLnJlbW92ZShlbnRyeSkudGhlbihcclxuICAgICAgICAgIHRoaXMuX29uUmVtb3ZlU3VjY2Vzcy5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgdGhpcy5fb25SZW1vdmVFcnJvci5iaW5kKHRoaXMpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgX2NyZWF0ZUVudHJ5Rm9yUmVtb3ZlOiBmdW5jdGlvbiBfY3JlYXRlRW50cnlGb3JSZW1vdmUoKSB7XHJcbiAgICBjb25zdCBlbnRyeSA9IHtcclxuICAgICAgJGtleTogdGhpcy5lbnRyeS4ka2V5LFxyXG4gICAgICAkZXRhZzogdGhpcy5lbnRyeS4kZXRhZyxcclxuICAgICAgJG5hbWU6IHRoaXMuZW50cnkuJG5hbWUsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH0sXHJcbiAgX29uUmVtb3ZlU3VjY2VzczogZnVuY3Rpb24gX29uUmVtb3ZlU3VjY2VzcygpIHtcclxuICAgIGNvbm5lY3QucHVibGlzaCgnL2FwcC9yZWZyZXNoJywgW3tcclxuICAgICAgcmVzb3VyY2VLaW5kOiB0aGlzLnJlc291cmNlS2luZCxcclxuICAgIH1dKTtcclxuICAgIFJlVUkuYmFjaygpO1xyXG4gIH0sXHJcbiAgX29uUmVtb3ZlRXJyb3I6IGZ1bmN0aW9uIF9vblJlbW92ZUVycm9yKGVycm9yKSB7XHJcbiAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5fb25HZXRFcnJvcihudWxsLCBlcnJvcik7XHJcbiAgICB9XHJcbiAgfSxcclxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoZGVzdHJveSwgYXJndW1lbnRzKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==