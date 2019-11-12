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
      this.inherited(arguments);
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
      return this.inherited(arguments);
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

      return this.inherited(arguments);
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

      this.inherited(arguments);
    },
    show: function show(options) {
      if (options && options.descriptor) {
        options.title = options.title || options.descriptor;
      }

      this.inherited(arguments);
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
      return _lang2.default.mixin(this.inherited(arguments), {
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
      this.inherited(arguments);

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
      this.inherited(arguments);
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fRGV0YWlsQmFzZS5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJhdHRyaWJ1dGVNYXAiLCJkZXRhaWxDb250ZW50Iiwibm9kZSIsInR5cGUiLCJ0aXRsZSIsInByb3RvdHlwZSIsInNlbGVjdGVkIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsImVtcHR5VGVtcGxhdGUiLCJsb2FkaW5nVGVtcGxhdGUiLCJxdWlja0FjdGlvblRlbXBsYXRlIiwiZGV0YWlsSGVhZGVyVGVtcGxhdGUiLCJzZWN0aW9uQmVnaW5UZW1wbGF0ZSIsInNlY3Rpb25FbmRUZW1wbGF0ZSIsInByb3BlcnR5VGVtcGxhdGUiLCJyZWxhdGVkUHJvcGVydHlUZW1wbGF0ZSIsInJlbGF0ZWRUZW1wbGF0ZSIsImFjdGlvblByb3BlcnR5VGVtcGxhdGUiLCJhY3Rpb25UZW1wbGF0ZSIsInJvd1RlbXBsYXRlIiwibm90QXZhaWxhYmxlVGVtcGxhdGUiLCJpZCIsInN0b3JlIiwiZW50cnkiLCJsYXlvdXQiLCJzZWN1cml0eSIsImN1c3RvbWl6YXRpb25TZXQiLCJleHBvc2UiLCJpc1RhYmJlZCIsInF1aWNrQWN0aW9uU2VjdGlvbiIsImVkaXRUZXh0IiwiaWNvbiIsInZpZXdUeXBlIiwiaW5mb3JtYXRpb25UZXh0IiwidGl0bGVUZXh0IiwiZW50aXR5VGV4dCIsImRldGFpbHNUZXh0IiwibG9hZGluZ1RleHQiLCJub3RBdmFpbGFibGVUZXh0IiwidG9nZ2xlQ29sbGFwc2VUZXh0IiwidG9nZ2xlQ29sbGFwc2VDbGFzcyIsInRvZ2dsZUV4cGFuZENsYXNzIiwiZWRpdFZpZXciLCJfbmF2aWdhdGlvbk9wdGlvbnMiLCJpc1JlZnJlc2hpbmciLCJtdWx0aUNvbHVtbkNsYXNzIiwibXVsdGlDb2x1bW5Db3VudCIsInJlZnJlc2hUb29sdGlwVGV4dCIsImVkaXRUb29sdGlwVGV4dCIsIml0ZW1zUHJvcGVydHkiLCJpZFByb3BlcnR5IiwibGFiZWxQcm9wZXJ0eSIsImVudGl0eVByb3BlcnR5IiwidmVyc2lvblByb3BlcnR5IiwicG9zdENyZWF0ZSIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInN1YnNjcmliZSIsIl9vblJlZnJlc2giLCJjbGVhciIsImNyZWF0ZUVycm9ySGFuZGxlcnMiLCJlcnJvckhhbmRsZXJzIiwibmFtZSIsInRlc3QiLCJlcnJvciIsImFib3J0ZWQiLCJoYW5kbGUiLCJuZXh0Iiwib3B0aW9ucyIsInN0YXR1cyIsIkhUVFBfU1RBVFVTIiwiTk9UX0ZPVU5EIiwiYWxlcnQiLCJnZXRFcnJvck1lc3NhZ2UiLCIkIiwiY29udGVudE5vZGUiLCJlbXB0eSIsImFwcGVuZCIsImFwcGx5IiwiZnJvbUNvbnRleHQiLCJlcnJvckl0ZW0iLCJ2aWV3T3B0aW9ucyIsInNlcnZlckVycm9yIiwiYWRkRXJyb3IiLCJkb21Ob2RlIiwicmVtb3ZlQ2xhc3MiLCJjcmVhdGVUb29sTGF5b3V0IiwidG9vbHMiLCJwdXNoIiwic3ZnIiwiYWN0aW9uIiwiQXBwIiwiZ2V0Vmlld1NlY3VyaXR5IiwidGJhciIsIl9yZWZyZXNoQ2xpY2tlZCIsInJlZnJlc2hSZXF1aXJlZCIsInJlZnJlc2giLCJvblJlZnJlc2hDbGlja2VkIiwiaW52b2tlQWN0aW9uIiwicGFyYW1ldGVycyIsImRpc2FibGVBY3Rpb24iLCJ0b2dnbGVTZWN0aW9uIiwicGFyYW1zIiwiJHNvdXJjZSIsImxlbmd0aCIsInRvZ2dsZUNsYXNzIiwiYnV0dG9uIiwiZmlyc3QiLCJwbGFjZURldGFpbEhlYWRlciIsInZhbHVlIiwic3Vic3RpdHV0ZSIsInRhYkNvbnRhaW5lciIsImJlZm9yZSIsIm8iLCJkZXNjcmlwdG9yIiwiZGF0YSIsImtleSIsInNldCIsImFjdGl2YXRlUmVsYXRlZEVudHJ5IiwiY29udGV4dCIsIm5hdmlnYXRlVG9SZWxhdGVkVmlldyIsInZpZXciLCJwYXJzZUludCIsImFjdGl2YXRlUmVsYXRlZExpc3QiLCJuYXZpZ2F0ZVRvRWRpdFZpZXciLCJnZXRWaWV3Iiwic2hvdyIsInNsb3QiLCJzZWxlY3RlZEVudHJ5IiwiY3JlYXRlTGF5b3V0IiwicHJvY2Vzc0xheW91dCIsIml0ZW1zIiwiY2hpbGRyZW4iLCJhcyIsInNlY3Rpb25RdWV1ZSIsInNlY3Rpb25TdGFydGVkIiwiY2FsbGJhY2tzIiwicm93Iiwic2VjdGlvbk5vZGUiLCJwbGFjZVRhYkxpc3QiLCJpIiwiY3VycmVudCIsImluY2x1ZGUiLCJleHBhbmRFeHByZXNzaW9uIiwiZXhjbHVkZSIsInVuZGVmaW5lZCIsInJvd05vZGUiLCJjcmVhdGVSb3ciLCJzZWN0aW9uIiwiZ2V0IiwicXVpY2tBY3Rpb25zIiwidGFiIiwidGFiTGlzdEl0ZW1UZW1wbGF0ZSIsInRhYk1hcHBpbmciLCJ0YWJzIiwiY2hpbGROb2RlcyIsInByb3ZpZGVyIiwiZ2V0VmFsdWUiLCJwcm9wZXJ0eSIsInJlbmRlcmVkIiwiZm9ybWF0dGVkIiwidGVtcGxhdGUiLCJ0cGwiLCJlbmNvZGUiLCJyZW5kZXJlciIsImNhbGwiLCJtaXhpbiIsInJhdyIsImhhc0FjY2VzcyIsImhhc0FjY2Vzc1RvIiwiZGlzYWJsZWQiLCJ3aGVyZSIsImNvbnRyYWN0TmFtZSIsInJlc291cmNlS2luZCIsInJlc291cmNlUHJvcGVydHkiLCJyZXNvdXJjZVByZWRpY2F0ZSIsImRhdGFTZXQiLCJyZXNldFNlYXJjaCIsInVzZUxpc3RUZW1wbGF0ZSIsImxpc3QiLCJpc0NvbHVtbkl0ZW0iLCJ1c2UiLCJyZWxhdGVkSXRlbSIsImNyZWF0ZVJvd05vZGUiLCJfcHJvY2Vzc1JlbGF0ZWRJdGVtIiwiZSIsImNvbnNvbGUiLCJvbkNyZWF0ZSIsIml0ZW0iLCJmb3JFYWNoIiwiZWxlbWVudCIsImZyYWciLCJfZ2V0U3RvcmVBdHRyIiwiY3JlYXRlU3RvcmUiLCJwcmVQcm9jZXNzRW50cnkiLCJwcm9jZXNzRW50cnkiLCJfY3JlYXRlQ3VzdG9taXplZExheW91dCIsImNyZWF0ZVRhYnMiLCJfb25HZXRDb21wbGV0ZSIsIm9uQ29udGVudENoYW5nZSIsIl9vbkdldEVycm9yIiwiZ2V0T3B0aW9ucyIsImhhbmRsZUVycm9yIiwicmVxdWVzdERhdGEiLCJhZGRDbGFzcyIsIl9tb2RlbCIsInJlcXVlc3REYXRhVXNpbmdNb2RlbCIsInRoZW4iLCJlcnIiLCJfYXBwbHlTdGF0ZVRvR2V0T3B0aW9ucyIsImdldEV4cHJlc3Npb24iLCJfYnVpbGRHZXRFeHByZXNzaW9uIiwiZ2V0UmVzdWx0cyIsInJlcXVlc3REYXRhVXNpbmdTdG9yZSIsImJpbmQiLCJFcnJvciIsImdldEVudHJ5IiwicmVmcmVzaFJlcXVpcmVkRm9yIiwiYWN0aXZhdGUiLCJ0YWciLCJnZXRUYWciLCJnZXRDb250ZXh0IiwiYmVmb3JlVHJhbnNpdGlvblRvIiwiY2xlYXJUYWJzIiwicmVuZGVyUmVsYXRlZCIsInJlc3VsdCIsImxhYmVsTm9kZSIsInJlbW92ZSIsIndhcm4iLCJnZXRMaXN0Q291bnQiLCJyZW1vdmVFbnRyeSIsIl9jcmVhdGVFbnRyeUZvclJlbW92ZSIsIl9vblJlbW92ZVN1Y2Nlc3MiLCJfb25SZW1vdmVFcnJvciIsIiRrZXkiLCIkZXRhZyIsIiRuYW1lIiwicHVibGlzaCIsIlJlVUkiLCJiYWNrIiwiZGVzdHJveSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLE1BQU1BLFdBQVcsb0JBQVksWUFBWixDQUFqQjs7QUFFQTs7Ozs7Ozs7Ozs7QUE5QkE7Ozs7Ozs7Ozs7Ozs7OztBQXlDQSxNQUFNQyxVQUFVLHVCQUFRLG1CQUFSLEVBQTZCLHFDQUE3QixFQUFnRCxnQ0FBZ0M7QUFDOUY7Ozs7Ozs7QUFPQUMsa0JBQWM7QUFDWkMscUJBQWU7QUFDYkMsY0FBTSxhQURPO0FBRWJDLGNBQU07QUFGTyxPQURIO0FBS1pDLGFBQU8sZUFBS0MsU0FBTCxDQUFlTCxZQUFmLENBQTRCSSxLQUx2QjtBQU1aRSxnQkFBVSxlQUFLRCxTQUFMLENBQWVMLFlBQWYsQ0FBNEJNO0FBTjFCLEtBUmdGO0FBZ0I5Rjs7Ozs7Ozs7Ozs7Ozs7O0FBZUFDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEs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QUFPck4sS0FBUDtBQUNELEtBbmxDNkY7QUFvbEM5RmlOLHNCQUFrQixTQUFTQSxnQkFBVCxHQUE0QjtBQUM1Qyx3QkFBUUssT0FBUixDQUFnQixjQUFoQixFQUFnQyxDQUFDO0FBQy9CaEUsc0JBQWMsS0FBS0E7QUFEWSxPQUFELENBQWhDO0FBR0FpRSxXQUFLQyxJQUFMO0FBQ0QsS0F6bEM2RjtBQTBsQzlGTixvQkFBZ0IsU0FBU0EsY0FBVCxDQUF3QnpLLEtBQXhCLEVBQStCO0FBQzdDLFVBQUlBLEtBQUosRUFBVztBQUNULGFBQUt3SSxXQUFMLENBQWlCLElBQWpCLEVBQXVCeEksS0FBdkI7QUFDRDtBQUNGLEtBOWxDNkY7QUErbEM5RmdMLGFBQVMsU0FBU0EsT0FBVCxHQUFtQjtBQUMxQixXQUFLekwsU0FBTCxDQUFlQyxTQUFmO0FBQ0Q7QUFqbUM2RixHQUFoRixDQUFoQjs7b0JBb21DZTFELE8iLCJmaWxlIjoiX0RldGFpbEJhc2UuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCB3aGVuIGZyb20gJ2Rvam8vd2hlbic7XHJcbmltcG9ydCBjb25uZWN0IGZyb20gJ2Rvam8vX2Jhc2UvY29ubmVjdCc7XHJcbmltcG9ydCBmb3JtYXQgZnJvbSAnLi9Gb3JtYXQnO1xyXG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xyXG5pbXBvcnQgRXJyb3JNYW5hZ2VyIGZyb20gJy4vRXJyb3JNYW5hZ2VyJztcclxuaW1wb3J0IFZpZXcgZnJvbSAnLi9WaWV3JztcclxuaW1wb3J0IFRhYldpZGdldCBmcm9tICcuL1RhYldpZGdldCc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdkZXRhaWxCYXNlJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLl9EZXRhaWxCYXNlXHJcbiAqIEBjbGFzc2Rlc2MgQSBEZXRhaWwgVmlldyByZXByZXNlbnRzIGEgc2luZ2xlIHJlY29yZCBhbmQgc2hvdWxkIGRpc3BsYXkgYWxsIHRoZSBpbmZvIHRoZSB1c2VyIG1heSBuZWVkIGFib3V0IHRoZSBlbnRyeS5cclxuICpcclxuICogQSBEZXRhaWwgZW50cnkgaXMgaWRlbnRpZmllZCBieSBpdHMga2V5IChpZFByb3BlcnR5KSB3aGljaCBpcyBob3cgaXQgcmVxdWVzdHMgdGhlIGRhdGEgdmlhIHRoZSBlbmRwb2ludC5cclxuICpcclxuICogQGV4dGVuZHMgYXJnb3MuVmlld1xyXG4gKiBAcmVxdWlyZXMgYXJnb3MuRm9ybWF0XHJcbiAqIEByZXF1aXJlcyBhcmdvcy5VdGlsaXR5XHJcbiAqIEByZXF1aXJlcyBhcmdvcy5FcnJvck1hbmFnZXJcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fRGV0YWlsQmFzZScsIFtWaWV3LCBUYWJXaWRnZXRdLCAvKiogQGxlbmRzIGFyZ29zLl9EZXRhaWxCYXNlIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBDcmVhdGVzIGEgc2V0dGVyIG1hcCB0byBodG1sIG5vZGVzLCBuYW1lbHk6XHJcbiAgICpcclxuICAgKiAqIGRldGFpbENvbnRlbnQgPT4gY29udGVudE5vZGUncyBpbm5lckhUTUxcclxuICAgKlxyXG4gICAqL1xyXG4gIGF0dHJpYnV0ZU1hcDoge1xyXG4gICAgZGV0YWlsQ29udGVudDoge1xyXG4gICAgICBub2RlOiAnY29udGVudE5vZGUnLFxyXG4gICAgICB0eXBlOiAnaW5uZXJIVE1MJyxcclxuICAgIH0sXHJcbiAgICB0aXRsZTogVmlldy5wcm90b3R5cGUuYXR0cmlidXRlTWFwLnRpdGxlLFxyXG4gICAgc2VsZWN0ZWQ6IFZpZXcucHJvdG90eXBlLmF0dHJpYnV0ZU1hcC5zZWxlY3RlZCxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSB2aWV3J3MgbWFpbiBET00gZWxlbWVudCB3aGVuIHRoZSB2aWV3IGlzIGluaXRpYWxpemVkLlxyXG4gICAqIFRoaXMgdGVtcGxhdGUgaW5jbHVkZXMgbG9hZGluZ1RlbXBsYXRlLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgdXNlcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICpcclxuICAgKiAgICAgIG5hbWUgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgKiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiAgICAgIGlkICAgICAgICAgICAgICAgICAgIG1haW4gY29udGFpbmVyIGRpdiBpZFxyXG4gICAqICAgICAgdGl0bGUgICAgICAgICAgICAgICAgbWFpbiBjb250YWluZXIgZGl2IHRpdGxlIGF0dHJcclxuICAgKiAgICAgIGNscyAgICAgICAgICAgICAgICAgIGFkZGl0aW9uYWwgY2xhc3Mgc3RyaW5nIGFkZGVkIHRvIHRoZSBtYWluIGNvbnRhaW5lciBkaXZcclxuICAgKiAgICAgIHJlc291cmNlS2luZCAgICAgICAgIHNldCB0byBkYXRhLXJlc291cmNlLWtpbmRcclxuICAgKlxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgaWQ9XCJ7JT0gJC5pZCAlfVwiIGRhdGEtdGl0bGU9XCJ7JT0gJC50aXRsZVRleHQgJX1cIiBjbGFzcz1cImRldGFpbCBwYW5lbCBzY3JvbGxhYmxlIHslPSAkLmNscyAlfVwiIHslIGlmICgkLnJlc291cmNlS2luZCkgeyAlfWRhdGEtcmVzb3VyY2Uta2luZD1cInslPSAkLnJlc291cmNlS2luZCAlfVwieyUgfSAlfT4nLFxyXG4gICAgJ3slISAkLmxvYWRpbmdUZW1wbGF0ZSAlfScsXHJcbiAgICAneyUhICQucXVpY2tBY3Rpb25UZW1wbGF0ZSAlfScsXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiY29udGVudE5vZGVcIiBjbGFzcz1cImNvbHVtblwiPicsXHJcbiAgICAneyUhICQudGFiQ29udGVudFRlbXBsYXRlICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHNob3duIHdoZW4gbm8gZGF0YSBpcyBhdmFpbGFibGUuXHJcbiAgICovXHJcbiAgZW1wdHlUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgc2hvd24gd2hlbiBkYXRhIGlzIGJlaW5nIGxvYWRlZC5cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIGxvYWRpbmdUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwicGFuZWwtbG9hZGluZy1pbmRpY2F0b3JcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJidXN5LWluZGljYXRvci1jb250YWluZXIgYmxvY2tlZC11aVwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yIGFjdGl2ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBvbmVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdHdvXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHRocmVlXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZvdXJcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZml2ZVwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8c3Bhbj57JTogJC5sb2FkaW5nVGV4dCAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBjcmVhdGVzIHRoZSBxdWljayBhY3Rpb24gbGlzdFxyXG4gICAqL1xyXG4gIHF1aWNrQWN0aW9uVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInF1aWNrLWFjdGlvbnNcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwicXVpY2tBY3Rpb25zXCI+PC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBjcmVhdGVzIHRoZSBkZXRhaWwgaGVhZGVyIGRpc3BsYXlpbmcgaW5mb3JtYXRpb24gYWJvdXQgdGhlIHRhYiBsaXN0XHJcbiAgICpcclxuICAgKiBgJGAgPT4gdGhlIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBkZXRhaWxIZWFkZXJUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiZGV0YWlsLWhlYWRlclwiPicsXHJcbiAgICAneyU6ICQudmFsdWUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgc3RhcnRzIGEgbmV3IHNlY3Rpb25cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHNlY3Rpb25CZWdpblRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJ3slIGlmICghJCQuaXNUYWJiZWQpIHsgJX0nLFxyXG4gICAgJzxoMiBkYXRhLWFjdGlvbj1cInRvZ2dsZVNlY3Rpb25cIiBjbGFzcz1cInslIGlmICgkLmNvbGxhcHNlZCB8fCAkLm9wdGlvbnMuY29sbGFwc2VkKSB7ICV9Y29sbGFwc2VkeyUgfSAlfVwiPicsXHJcbiAgICAnPGJ1dHRvbiBjbGFzcz1cInslIGlmICgkLmNvbGxhcHNlZCkgeyAlfXslOiAkJC50b2dnbGVFeHBhbmRDbGFzcyAlfXslIH0gZWxzZSB7ICV9eyU6ICQkLnRvZ2dsZUNvbGxhcHNlQ2xhc3MgJX17JSB9ICV9XCIgYXJpYS1sYWJlbD1cInslOiAkJC50b2dnbGVDb2xsYXBzZVRleHQgJX1cIj48L2J1dHRvbj4nLFxyXG4gICAgJ3slOiAoJC50aXRsZSB8fCAkLm9wdGlvbnMudGl0bGUpICV9JyxcclxuICAgICc8L2gyPicsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgICAneyUgaWYgKCQubGlzdCB8fCAkLm9wdGlvbnMubGlzdCkgeyAlfScsXHJcbiAgICAneyUgaWYgKCQuY2xzIHx8ICQub3B0aW9ucy5jbHMpIHsgJX0nLFxyXG4gICAgJzx1bCBjbGFzcz1cInslPSAoJC5jbHMgfHwgJC5vcHRpb25zLmNscykgJX1cIiBpZD1cInslOiAkJC5pZCAlfV97JTogJC5uYW1lICV9XCI+JyxcclxuICAgICd7JSB9IGVsc2UgeyAlfScsXHJcbiAgICAnPHVsIGNsYXNzPVwiZGV0YWlsQ29udGVudCB0YWItcGFuZWwgbGlzdHZpZXdcIiBpZD1cInslOiAkJC5pZCAlfV97JTogJC5uYW1lICV9XCI+JyxcclxuICAgICd7JSB9ICV9JyxcclxuICAgICd7JSB9IGVsc2UgeyAlfScsXHJcbiAgICAneyUgaWYgKCQuY2xzIHx8ICQub3B0aW9ucy5jbHMpIHsgJX0nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJ0YWItcGFuZWwgeyU9ICgkLmNscyB8fCAkLm9wdGlvbnMuY2xzKSAlfVwiIGlkPVwieyU6ICQkLmlkICV9X3slOiAkLm5hbWUgJX1cIj4nLFxyXG4gICAgJ3slIH0gZWxzZSB7ICV9JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiZGV0YWlsQ29udGVudCB0YWItcGFuZWwgc3VtbWFyeS1mb3JtXCIgaWQ9XCJ7JTogJCQuaWQgJX1feyU6ICQubmFtZSAlfVwiPicsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgZW5kcyBhIHNlY3Rpb25cclxuICAgKlxyXG4gICAqIGAkYCA9PiB0aGUgdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHNlY3Rpb25FbmRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICd7JSBpZiAoJC5saXN0IHx8ICQub3B0aW9ucy5saXN0KSB7ICV9JyxcclxuICAgICc8L3VsPicsXHJcbiAgICAneyUgfSBlbHNlIHsgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgaXMgdXNlZCBmb3IgYSBwcm9wZXJ0eSBpbiB0aGUgZGV0YWlsIGxheW91dFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gZGV0YWlsIGxheW91dCByb3dcclxuICAgKiAqIGAkJGAgPT4gdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHByb3BlcnR5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInslPSAkJC5tdWx0aUNvbHVtbkNsYXNzICV9IGNvbHVtbnN7JT0gJC5jbHMgJX1cIiBkYXRhLXByb3BlcnR5PVwieyU9ICQucHJvcGVydHkgfHwgJC5uYW1lICV9XCI+JyxcclxuICAgICc8bGFiZWw+eyU6ICQubGFiZWwgJX08L2xhYmVsPicsXHJcbiAgICAnPHNwYW4gY2xhc3M9XCJkYXRhXCI+eyU9ICQudmFsdWUgJX08L3NwYW4+JywgLy8gdG9kbzogY3JlYXRlIGEgd2F5IHRvIGFsbG93IHRoZSB2YWx1ZSB0byBub3QgYmUgc3Vycm91bmRlZCB3aXRoIGEgc3BhbiB0YWdcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IGlzIHVzZWQgZm9yIGRldGFpbCBsYXlvdXQgaXRlbXMgdGhhdCBwb2ludCB0byByZWxhdGVkIHZpZXdzLCBpbmNsdWRlcyBhIGxhYmVsIGFuZCBsaW5rcyB0aGUgdmFsdWUgdGV4dFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gZGV0YWlsIGxheW91dCByb3dcclxuICAgKiAqIGAkJGAgPT4gdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHJlbGF0ZWRQcm9wZXJ0eVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJ7JT0gJCQubXVsdGlDb2x1bW5DbGFzcyAlfSBjb2x1bW5zeyU9ICQuY2xzICV9XCI+JyxcclxuICAgICc8bGFiZWw+eyU6ICQubGFiZWwgJX08L2xhYmVsPicsXHJcbiAgICAnPHNwYW4gY2xhc3M9XCJkYXRhXCI+JyxcclxuICAgICc8YSBjbGFzcz1cImh5cGVybGlua1wiIGRhdGEtYWN0aW9uPVwiYWN0aXZhdGVSZWxhdGVkRW50cnlcIiBkYXRhLXZpZXc9XCJ7JT0gJC52aWV3ICV9XCIgZGF0YS1jb250ZXh0PVwieyU6ICQuY29udGV4dCAlfVwiIGRhdGEtZGVzY3JpcHRvcj1cInslOiAkLmRlc2NyaXB0b3IgfHwgJC52YWx1ZSAlfVwiPicsXHJcbiAgICAneyU9ICQudmFsdWUgJX0nLFxyXG4gICAgJzwvYT4nLFxyXG4gICAgJzwvc3Bhbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgaXMgdXNlZCBmb3IgZGV0YWlsIGxheW91dCBpdGVtcyB0aGF0IHBvaW50IHRvIHJlbGF0ZWQgdmlld3MsIGRpc3BsYXllZCBhcyBhbiBpY29uIGFuZCB0ZXh0XHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBkZXRhaWwgbGF5b3V0IHJvd1xyXG4gICAqICogYCQkYCA9PiB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgcmVsYXRlZFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaSBjbGFzcz1cInJlbGF0ZWR2aWV3aXRlbSB7JT0gJC5jbHMgJX1cIiBkYXRhLWFjdGlvbj1cImFjdGl2YXRlUmVsYXRlZExpc3RcIiBkYXRhLXZpZXc9XCJ7JT0gJC52aWV3ICV9XCIgZGF0YS1jb250ZXh0PVwieyU6ICQuY29udGV4dCAlfVwiIHslIGlmICgkLmRpc2FibGVkKSB7ICV9ZGF0YS1kaXNhYmxlLWFjdGlvbj1cInRydWVcInslIH0gJX0+JyxcclxuICAgICc8YSBjbGFzcz1cInslIGlmICgkLmRpc2FibGVkKSB7ICV9ZGlzYWJsZWR7JSB9ICV9XCI+JyxcclxuICAgICd7JSBpZiAoJC5pY29uKSB7ICV9JyxcclxuICAgICc8aW1nIHNyYz1cInslPSAkLmljb24gJX1cIiBhbHQ9XCJpY29uXCIgY2xhc3M9XCJpY29uXCIgLz4nLFxyXG4gICAgJ3slIH0gZWxzZSBpZiAoJC5pY29uQ2xhc3MpIHsgJX0nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJ7JT0gJC5pY29uQ2xhc3MgJX1cIiBhbHQ9XCJpY29uXCI+PC9kaXY+JyxcclxuICAgICd7JSB9ICV9JyxcclxuICAgICc8c3BhbiBjbGFzcz1cInJlbGF0ZWQtaXRlbS1sYWJlbFwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3kteHMgYmFkZ2VcIicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yLWNvbnRhaW5lclwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yIGFjdGl2ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBvbmVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdHdvXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHRocmVlXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZvdXJcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZml2ZVwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAneyU6ICQubGFiZWwgJX08L3NwYW4+JyxcclxuICAgICc8L2E+JyxcclxuICAgICc8L2xpPicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgaXMgdXNlZCBmb3IgZGV0YWlsIGxheW91dCBpdGVtcyB0aGF0IGZpcmUgYW4gYWN0aW9uLCBkaXNwbGF5ZWQgd2l0aCBsYWJlbCBhbmQgcHJvcGVydHkgdmFsdWVcclxuICAgKlxyXG4gICAqICogYCRgID0+IGRldGFpbCBsYXlvdXQgcm93XHJcbiAgICogKiBgJCRgID0+IHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBhY3Rpb25Qcm9wZXJ0eVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJ7JT0gJCQubXVsdGlDb2x1bW5DbGFzcyAlfSBjb2x1bW5zeyU9ICQuY2xzICV9XCI+JyxcclxuICAgICc8bGFiZWw+eyU6ICQubGFiZWwgJX08L2xhYmVsPicsXHJcbiAgICAnPHNwYW4gY2xhc3M9XCJkYXRhXCI+JyxcclxuICAgICc8YSBjbGFzcz1cImh5cGVybGlua1wiIGRhdGEtYWN0aW9uPVwieyU9ICQuYWN0aW9uICV9XCIgeyUgaWYgKCQuZGlzYWJsZWQpIHsgJX1kYXRhLWRpc2FibGUtYWN0aW9uPVwidHJ1ZVwieyUgfSAlfSBjbGFzcz1cInslIGlmICgkLmRpc2FibGVkKSB7ICV9ZGlzYWJsZWR7JSB9ICV9XCI+JyxcclxuICAgICd7JT0gJC52YWx1ZSAlfScsXHJcbiAgICAnPC9hPicsXHJcbiAgICAnPC9zcGFuPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBpcyB1c2VkIGZvciBkZXRhaWwgbGF5b3V0IGl0ZW1zIHRoYXQgZmlyZSBhbiBhY3Rpb24sIGRpc3BsYXllZCBhcyBhbiBpY29uIGFuZCB0ZXh0XHJcbiAgICpcclxuICAgKiAqIGAkYCA9PiBkZXRhaWwgbGF5b3V0IHJvd1xyXG4gICAqICogYCQkYCA9PiB2aWV3IGluc3RhbmNlXHJcbiAgICovXHJcbiAgYWN0aW9uVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwieyU9ICQuY2xzICV9eyUgaWYgKCQuZGlzYWJsZWQpIHsgJX0gZGlzYWJsZWR7JSB9ICV9XCI+JyxcclxuICAgICc8YSBkYXRhLWFjdGlvbj1cInslPSAkLmFjdGlvbiAlfVwiIHslIGlmICgkLmRpc2FibGVkKSB7ICV9ZGF0YS1kaXNhYmxlLWFjdGlvbj1cInRydWVcInslIH0gJX0gY2xhc3M9XCJ7JSBpZiAoJC5kaXNhYmxlZCkgeyAlfWRpc2FibGVkeyUgfSAlfVwiPicsXHJcbiAgICAneyUgaWYgKCQuaWNvbikgeyAlfScsXHJcbiAgICAnPGltZyBzcmM9XCJ7JT0gJC5pY29uICV9XCIgYWx0PVwiaWNvblwiIGNsYXNzPVwiaWNvblwiIC8+JyxcclxuICAgICd7JSB9IGVsc2UgaWYgKCQuaWNvbkNsYXNzKSB7ICV9JyxcclxuICAgIGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1pY29uIGhpZGUtZm9jdXNcIj5cclxuICAgICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhsaW5rOmhyZWY9XCIjaWNvbi17JTogJC5pY29uQ2xhc3MgJX1cIj48L3VzZT5cclxuICAgICAgPC9zdmc+XHJcbiAgICA8L2J1dHRvbj5gLFxyXG4gICAgJ3slIH0gJX0nLFxyXG4gICAgJzxsYWJlbD57JTogJC5sYWJlbCAlfTwvbGFiZWw+JyxcclxuICAgICc8c3BhbiBjbGFzcz1cImRhdGFcIj57JT0gJC52YWx1ZSAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvYT4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBpcyB1c2VkIGZvciByb3dzIGNyZWF0ZWQgd2l0aCBjb2x1bW5zXHJcbiAgICovXHJcbiAgcm93VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInJvd1wiPjwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIHRoYXQgaXMgc2hvd24gd2hlbiBub3QgYXZhaWxhYmxlXHJcbiAgICpcclxuICAgKiBgJGAgPT4gdGhlIHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICBub3RBdmFpbGFibGVUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8cCBjbGFzcz1cIm5vdC1hdmFpbGFibGVcIj57JTogJC5ub3RBdmFpbGFibGVUZXh0ICV9PC9wPicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHVuaXF1ZSBpZGVudGlmaWVyIG9mIHRoZSB2aWV3XHJcbiAgICovXHJcbiAgaWQ6ICdnZW5lcmljX2RldGFpbCcsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIGRvam8gc3RvcmUgdGhpcyB2aWV3IHdpbGwgdXNlIGZvciBkYXRhIGV4Y2hhbmdlLlxyXG4gICAqL1xyXG4gIHN0b3JlOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFRoZSBkYXRhIGVudHJ5XHJcbiAgICovXHJcbiAgZW50cnk6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIGxheW91dCBkZWZpbml0aW9uIHRoYXQgY29uc3RydWN0cyB0aGUgZGV0YWlsIHZpZXcgd2l0aCBzZWN0aW9ucyBhbmQgcm93c1xyXG4gICAqL1xyXG4gIGxheW91dDogbnVsbCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmcvT2JqZWN0fVxyXG4gICAqIE1heSBiZSB1c2VkIGZvciB2ZXJpZnlpbmcgdGhlIHZpZXcgaXMgYWNjZXNzaWJsZVxyXG4gICAqL1xyXG4gIHNlY3VyaXR5OiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgY3VzdG9taXphdGlvbiBpZGVudGlmaWVyIGZvciB0aGlzIGNsYXNzLiBXaGVuIGEgY3VzdG9taXphdGlvbiBpcyByZWdpc3RlcmVkIGl0IGlzIHBhc3NlZFxyXG4gICAqIGEgcGF0aC9pZGVudGlmaWVyIHdoaWNoIGlzIHRoZW4gbWF0Y2hlZCB0byB0aGlzIHByb3BlcnR5LlxyXG4gICAqL1xyXG4gIGN1c3RvbWl6YXRpb25TZXQ6ICdkZXRhaWwnLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBDb250cm9scyBpZiB0aGUgdmlldyBzaG91bGQgYmUgZXhwb3NlZFxyXG4gICAqL1xyXG4gIGV4cG9zZTogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIENvbnRyb2xzIHdoZXRoZXIgdGhlIHZpZXcgd2lsbCByZW5kZXIgYXMgYSB0YWIgdmlldyBvciB0aGUgcHJldmlvdXMgbGlzdCB2aWV3XHJcbiAgICovXHJcbiAgaXNUYWJiZWQ6IHRydWUsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogQ29udHJvbHMgaG93IHRoZSB2aWV3IGRldGVybWluZXMgdGhlIHF1aWNrIGFjdGlvbiBzZWN0aW9uIGJ5IG1hcHBpbmcgdGhpcyBzdHJpbmcgd2l0aCB0aGF0IG9uIHRoZSBkZXRhaWwgdmlldyAoc2hvdWxkIGJlIG92ZXJ3cml0dGVuKVxyXG4gICAqL1xyXG4gIHF1aWNrQWN0aW9uU2VjdGlvbjogJ1F1aWNrQWN0aW9uc1NlY3Rpb24nLFxyXG4gIC8qKlxyXG4gICAqIEBkZXByZWNhdGVkXHJcbiAgICovXHJcbiAgZWRpdFRleHQ6IHJlc291cmNlLmVkaXRUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBGb250IGF3ZXNvbWUgaWNvbiB0byBiZSB1c2VkIGJ5IHRoZSBtb3JlIGxpc3QgaXRlbVxyXG4gICAqL1xyXG4gIGljb246ICdmYSBmYS1jaGV2cm9uJyxcclxuXHJcbiAgdmlld1R5cGU6ICdkZXRhaWwnLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBJbmZvcm1hdGlvbiB0ZXh0IHRoYXQgaXMgY29uY2F0ZW5hdGVkIHdpdGggdGhlIGVudGl0eSB0eXBlXHJcbiAgICovXHJcbiAgaW5mb3JtYXRpb25UZXh0OiByZXNvdXJjZS5pbmZvcm1hdGlvblRleHQsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIERlZmF1bHQgdGl0bGUgdGV4dCBzaG93biBpbiB0aGUgdG9wIHRvb2xiYXJcclxuICAgKi9cclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogRGVmYXVsdCB0ZXh0IHVzZWQgaW4gdGhlIGhlYWRlciB0aXRsZSwgZm9sbG93ZWQgYnkgaW5mb3JtYXRpb25cclxuICAgKi9cclxuICBlbnRpdHlUZXh0OiByZXNvdXJjZS5lbnRpdHlUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIEhlbHBlciBzdHJpbmcgZm9yIGEgYmFzaWMgc2VjdGlvbiBoZWFkZXIgdGV4dFxyXG4gICAqL1xyXG4gIGRldGFpbHNUZXh0OiByZXNvdXJjZS5kZXRhaWxzVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUZXh0IHNob3duIHdoaWxlIGxvYWRpbmcgYW5kIHVzZWQgaW4gbG9hZGluZ1RlbXBsYXRlXHJcbiAgICovXHJcbiAgbG9hZGluZ1RleHQ6IHJlc291cmNlLmxvYWRpbmdUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgdXNlZCBpbiB0aGUgbm90QXZhaWxhYmxlVGVtcGxhdGVcclxuICAgKi9cclxuICBub3RBdmFpbGFibGVUZXh0OiByZXNvdXJjZS5ub3RBdmFpbGFibGVUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIEFSSUEgbGFiZWwgdGV4dCBmb3IgYSBjb2xsYXBzaWJsZSBzZWN0aW9uIGhlYWRlclxyXG4gICAqL1xyXG4gIHRvZ2dsZUNvbGxhcHNlVGV4dDogcmVzb3VyY2UudG9nZ2xlQ29sbGFwc2VUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIENTUyBjbGFzcyBmb3IgdGhlIGNvbGxhcHNlIGJ1dHRvbiB3aGVuIGluIGEgZXhwYW5kZWQgc3RhdGVcclxuICAgKi9cclxuICB0b2dnbGVDb2xsYXBzZUNsYXNzOiAnZmEgZmEtY2hldnJvbi1kb3duJyxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBDU1MgY2xhc3MgZm9yIHRoZSBjb2xsYXBzZSBidXR0b24gd2hlbiBpbiBhIGNvbGxhcHNlZCBzdGF0ZVxyXG4gICAqL1xyXG4gIHRvZ2dsZUV4cGFuZENsYXNzOiAnZmEgZmEtY2hldnJvbi1yaWdodCcsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIFRoZSB2aWV3IGlkIHRvIGJlIHRha2VuIHRvIHdoZW4gdGhlIEVkaXQgYnV0dG9uIGlzIHByZXNzZWQgaW4gdGhlIHRvb2xiYXJcclxuICAgKi9cclxuICBlZGl0VmlldzogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3RbXX1cclxuICAgKiBTdG9yZSBmb3IgbWFwcGluZyBsYXlvdXQgb3B0aW9ucyB0byBhbiBpbmRleCBvbiB0aGUgSFRNTCBub2RlXHJcbiAgICovXHJcbiAgX25hdmlnYXRpb25PcHRpb25zOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBGbGFnIHRvIHNpZ25hbCB0aGF0IHRoZSBpbnRlcmZhY2UgaXMgbG9hZGluZyBhbmQgY2xpY2tpbmcgcmVmcmVzaCB3aWxsIGJlIGlnbm9yZWQgdG8gcHJldmVudCBkb3VibGUgZW50aXR5IGxvYWRpbmdcclxuICAgKi9cclxuICBpc1JlZnJlc2hpbmc6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIERldGVybWluZXMgdGhlIFNvSG8gY2xhc3MgaW1wbGVtZW50ZWQgaW4gcHJvcGVydHkgdGVtcGxhdGVzXHJcbiAgICovXHJcbiAgbXVsdGlDb2x1bW5DbGFzczogJ2ZvdXInLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfVxyXG4gICAqIERldGVybWluZXMgaG93IG1hbnkgY29sdW1ucyB0aGUgZGV0YWlsIHZpZXcgcHJvcGVydHkgdmlld3Mgc2hvdWxkIGNvbnRhaW5cclxuICAgKi9cclxuICBtdWx0aUNvbHVtbkNvdW50OiAzLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRleHQgc2hvd24gaW4gdGhlIHRvcCB0b29sYmFyIHJlZnJlc2ggYnV0dG9uXHJcbiAgICovXHJcbiAgcmVmcmVzaFRvb2x0aXBUZXh0OiByZXNvdXJjZS5yZWZyZXNoVG9vbHRpcFRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGV4dCBzaG93biBpbiB0aGUgdG9wIHRvb2xiYXIgZWRpdCBidXR0b25cclxuICAgKi9cclxuICBlZGl0VG9vbHRpcFRleHQ6IHJlc291cmNlLmVkaXRUb29sdGlwVGV4dCxcclxuXHJcbiAgLy8gU3RvcmUgcHJvcGVydGllc1xyXG4gIGl0ZW1zUHJvcGVydHk6ICcnLFxyXG4gIGlkUHJvcGVydHk6ICcnLFxyXG4gIGxhYmVsUHJvcGVydHk6ICcnLFxyXG4gIGVudGl0eVByb3BlcnR5OiAnJyxcclxuICB2ZXJzaW9uUHJvcGVydHk6ICcnLFxyXG5cclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSBkaWppdCB3aWRnZXQgcG9zdENyZWF0ZSB0byBzdWJzY3JpYmUgdG8gdGhlIGdsb2JhbCBgL2FwcC9yZWZyZXNoYCBldmVudCBhbmQgY2xlYXIgdGhlIHZpZXcuXHJcbiAgICovXHJcbiAgcG9zdENyZWF0ZTogZnVuY3Rpb24gcG9zdENyZWF0ZSgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLnN1YnNjcmliZSgnL2FwcC9yZWZyZXNoJywgdGhpcy5fb25SZWZyZXNoKTtcclxuICAgIHRoaXMuY2xlYXIoKTtcclxuICB9LFxyXG4gIGNyZWF0ZUVycm9ySGFuZGxlcnM6IGZ1bmN0aW9uIGNyZWF0ZUVycm9ySGFuZGxlcnMoKSB7XHJcbiAgICB0aGlzLmVycm9ySGFuZGxlcnMgPSB0aGlzLmVycm9ySGFuZGxlcnMgfHwgW3tcclxuICAgICAgbmFtZTogJ0Fib3J0ZWQnLFxyXG4gICAgICB0ZXN0OiAoZXJyb3IpID0+IHtcclxuICAgICAgICByZXR1cm4gZXJyb3IuYWJvcnRlZDtcclxuICAgICAgfSxcclxuICAgICAgaGFuZGxlOiAoZXJyb3IsIG5leHQpID0+IHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMgPSBmYWxzZTsgLy8gZm9yY2UgYSByZWZyZXNoXHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9LFxyXG4gICAgfSwge1xyXG4gICAgICBuYW1lOiAnQWxlcnRFcnJvcicsXHJcbiAgICAgIHRlc3Q6IChlcnJvcikgPT4ge1xyXG4gICAgICAgIHJldHVybiBlcnJvci5zdGF0dXMgIT09IHRoaXMuSFRUUF9TVEFUVVMuTk9UX0ZPVU5EICYmICFlcnJvci5hYm9ydGVkO1xyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGU6IChlcnJvciwgbmV4dCkgPT4ge1xyXG4gICAgICAgIGFsZXJ0KHRoaXMuZ2V0RXJyb3JNZXNzYWdlKGVycm9yKSk7IC8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSxcclxuICAgIH0sIHtcclxuICAgICAgbmFtZTogJ05vdEZvdW5kJyxcclxuICAgICAgdGVzdDogKGVycm9yKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yLnN0YXR1cyA9PT0gdGhpcy5IVFRQX1NUQVRVUy5OT1RfRk9VTkQ7XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZTogKGVycm9yLCBuZXh0KSA9PiB7XHJcbiAgICAgICAgJCh0aGlzLmNvbnRlbnROb2RlKS5lbXB0eSgpLmFwcGVuZCh0aGlzLm5vdEF2YWlsYWJsZVRlbXBsYXRlLmFwcGx5KHRoaXMpKTtcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LCB7XHJcbiAgICAgIG5hbWU6ICdDYXRjaEFsbCcsXHJcbiAgICAgIHRlc3Q6ICgpID0+IHRydWUsXHJcbiAgICAgIGhhbmRsZTogKGVycm9yLCBuZXh0KSA9PiB7XHJcbiAgICAgICAgY29uc3QgZnJvbUNvbnRleHQgPSB0aGlzLm9wdGlvbnMuZnJvbUNvbnRleHQ7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmZyb21Db250ZXh0ID0gbnVsbDtcclxuICAgICAgICBjb25zdCBlcnJvckl0ZW0gPSB7XHJcbiAgICAgICAgICB2aWV3T3B0aW9uczogdGhpcy5vcHRpb25zLFxyXG4gICAgICAgICAgc2VydmVyRXJyb3I6IGVycm9yLFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIEVycm9yTWFuYWdlci5hZGRFcnJvcih0aGlzLmdldEVycm9yTWVzc2FnZShlcnJvciksIGVycm9ySXRlbSk7XHJcbiAgICAgICAgdGhpcy5vcHRpb25zLmZyb21Db250ZXh0ID0gZnJvbUNvbnRleHQ7XHJcbiAgICAgICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdwYW5lbC1sb2FkaW5nJyk7XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9LFxyXG4gICAgfV07XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZXJyb3JIYW5kbGVycztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgYW5kIHJldHVybnMgdGhlIHRvb2xiYXIgaXRlbSBsYXlvdXQgZGVmaW5pdGlvbiwgdGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiBpbiB0aGUgdmlld1xyXG4gICAqIHNvIHRoYXQgeW91IG1heSBkZWZpbmUgdGhlIHZpZXdzIHRvb2xiYXIgaXRlbXMuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzLnRvb2xzXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICovXHJcbiAgY3JlYXRlVG9vbExheW91dDogZnVuY3Rpb24gY3JlYXRlVG9vbExheW91dCgpIHtcclxuICAgIGNvbnN0IHRvb2xzID0gW107XHJcblxyXG4gICAgaWYgKHRoaXMuZWRpdFZpZXcpIHtcclxuICAgICAgdG9vbHMucHVzaCh7XHJcbiAgICAgICAgaWQ6ICdlZGl0JyxcclxuICAgICAgICBzdmc6ICdlZGl0JyxcclxuICAgICAgICB0aXRsZTogdGhpcy5lZGl0VG9vbHRpcFRleHQsXHJcbiAgICAgICAgYWN0aW9uOiAnbmF2aWdhdGVUb0VkaXRWaWV3JyxcclxuICAgICAgICBzZWN1cml0eTogQXBwLmdldFZpZXdTZWN1cml0eSh0aGlzLmVkaXRWaWV3LCAndXBkYXRlJyksXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRvb2xzLnB1c2goe1xyXG4gICAgICBpZDogJ3JlZnJlc2gnLFxyXG4gICAgICBzdmc6ICdyZWZyZXNoJyxcclxuICAgICAgdGl0bGU6IHRoaXMucmVmcmVzaFRvb2x0aXBUZXh0LFxyXG4gICAgICBhY3Rpb246ICdfcmVmcmVzaENsaWNrZWQnLFxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMudG9vbHMgfHwgKHRoaXMudG9vbHMgPSB7XHJcbiAgICAgIHRiYXI6IHRvb2xzLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBfcmVmcmVzaENsaWNrZWQ6IGZ1bmN0aW9uIF9yZWZyZXNoQ2xpY2tlZCgpIHtcclxuICAgIC8vIElmIHRoZSB1c2VyIGhhcyBoaXQgcmVmcmVzaCBhbHJlYWR5LCBsZXQgdGhlIGludGVyZmFjZSBsb2FkIGZpcnN0IHNldCBvZiBhc3NldHNcclxuICAgIGlmICh0aGlzLmlzUmVmcmVzaGluZykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcbiAgICB0aGlzLmlzUmVmcmVzaGluZyA9IHRydWU7XHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcbiAgICB0aGlzLnJlZnJlc2goKTtcclxuXHJcbiAgICB0aGlzLm9uUmVmcmVzaENsaWNrZWQoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCB3aGVuIHRoZSB1c2VyIGNsaWNrcyB0aGUgcmVmcmVzaCB0b29sYmFyIGJ1dHRvbi5cclxuICAgKi9cclxuICBvblJlZnJlc2hDbGlja2VkOiBmdW5jdGlvbiBvblJlZnJlc2hDbGlja2VkKCkge30sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUge0BsaW5rIF9BY3Rpb25NaXhpbiNpbnZva2VBY3Rpb24gbWl4aW5zIGludm9rZUFjdGlvbn0gdG8gc3RvcCBpZiBgZGF0YS1kaXNhYmxlQWN0aW9uYCBpcyB0cnVlXHJcbiAgICogQHBhcmFtIG5hbWVcclxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1ldGVycyBDb2xsZWN0aW9uIG9mIGBkYXRhLWAgYXR0cmlidXRlcyBmcm9tIHRoZSBub2RlXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0XHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxcclxuICAgKi9cclxuICBpbnZva2VBY3Rpb246IGZ1bmN0aW9uIGludm9rZUFjdGlvbihuYW1lLCBwYXJhbWV0ZXJzIC8qICwgZXZ0LCBlbCovKSB7XHJcbiAgICBpZiAocGFyYW1ldGVycyAmJiAvdHJ1ZS9pLnRlc3QocGFyYW1ldGVycy5kaXNhYmxlQWN0aW9uKSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVG9nZ2xlcyB0aGUgY29sbGFwc2VkIHN0YXRlIG9mIHRoZSBzZWN0aW9uLlxyXG4gICAqL1xyXG4gIHRvZ2dsZVNlY3Rpb246IGZ1bmN0aW9uIHRvZ2dsZVNlY3Rpb24ocGFyYW1zKSB7XHJcbiAgICBjb25zdCBub2RlID0gJChgIyR7cGFyYW1zLiRzb3VyY2V9YCk7XHJcbiAgICBpZiAobm9kZS5sZW5ndGgpIHtcclxuICAgICAgbm9kZS50b2dnbGVDbGFzcygnY29sbGFwc2VkJyk7XHJcbiAgICAgIGNvbnN0IGJ1dHRvbiA9ICQoJ2J1dHRvbicsIG5vZGUpLmZpcnN0KCk7XHJcbiAgICAgIGlmIChidXR0b24ubGVuZ3RoKSB7XHJcbiAgICAgICAgYnV0dG9uLnRvZ2dsZUNsYXNzKHRoaXMudG9nZ2xlQ29sbGFwc2VDbGFzcyk7XHJcbiAgICAgICAgYnV0dG9uLnRvZ2dsZUNsYXNzKHRoaXMudG9nZ2xlRXhwYW5kQ2xhc3MpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgZ2V0dGluZyB0aGUgZGV0YWlsIHJlc291cmNlIHR5cGUgZnJvbSB0aGUgaWQgYW5kIHBsYWNpbmcgdGhlIGhlYWRlciBpbnRvIHRoZSBkZXRhaWwgdmlldy4uXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBwbGFjZURldGFpbEhlYWRlcjogZnVuY3Rpb24gcGxhY2VEZXRhaWxIZWFkZXIoKSB7XHJcbiAgICBjb25zdCB2YWx1ZSA9IHN0cmluZy5zdWJzdGl0dXRlKHRoaXMuaW5mb3JtYXRpb25UZXh0LCBbdGhpcy5lbnRpdHlUZXh0XSk7XHJcbiAgICAkKHRoaXMudGFiQ29udGFpbmVyKS5iZWZvcmUodGhpcy5kZXRhaWxIZWFkZXJUZW1wbGF0ZS5hcHBseSh7IHZhbHVlIH0sIHRoaXMpKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHRoZSBnbG9iYWwgYC9hcHAvcmVmcmVzaGAgZXZlbnQuIFNldHMgYHJlZnJlc2hSZXF1aXJlZGAgdG8gdHJ1ZSBpZiB0aGUga2V5IG1hdGNoZXMuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9iamVjdCBwdWJsaXNoZWQgYnkgdGhlIGV2ZW50LlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgX29uUmVmcmVzaDogZnVuY3Rpb24gX29uUmVmcmVzaChvKSB7XHJcbiAgICBjb25zdCBkZXNjcmlwdG9yID0gby5kYXRhICYmIG8uZGF0YVt0aGlzLmxhYmVsUHJvcGVydHldO1xyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmtleSA9PT0gby5rZXkpIHtcclxuICAgICAgdGhpcy5yZWZyZXNoUmVxdWlyZWQgPSB0cnVlO1xyXG5cclxuICAgICAgaWYgKGRlc2NyaXB0b3IpIHtcclxuICAgICAgICB0aGlzLm9wdGlvbnMudGl0bGUgPSBkZXNjcmlwdG9yO1xyXG4gICAgICAgIHRoaXMuc2V0KCd0aXRsZScsIGRlc2NyaXB0b3IpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgcmVsYXRlZCBlbnRyeSBhY3Rpb24sIG5hdmlnYXRlcyB0byB0aGUgZGVmaW5lZCBgZGF0YS12aWV3YCBwYXNzaW5nIHRoZSBgZGF0YS1jb250ZXh0YC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIENvbGxlY3Rpb24gb2YgYGRhdGEtYCBhdHRyaWJ1dGVzIGZyb20gdGhlIHNvdXJjZSBub2RlLlxyXG4gICAqL1xyXG4gIGFjdGl2YXRlUmVsYXRlZEVudHJ5OiBmdW5jdGlvbiBhY3RpdmF0ZVJlbGF0ZWRFbnRyeShwYXJhbXMpIHtcclxuICAgIGlmIChwYXJhbXMuY29udGV4dCkge1xyXG4gICAgICB0aGlzLm5hdmlnYXRlVG9SZWxhdGVkVmlldyhwYXJhbXMudmlldywgcGFyc2VJbnQocGFyYW1zLmNvbnRleHQsIDEwKSwgcGFyYW1zLmRlc2NyaXB0b3IpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdGhlIHJlbGF0ZWQgbGlzdCBhY3Rpb24sIG5hdmlnYXRlcyB0byB0aGUgZGVmaW5lZCBgZGF0YS12aWV3YCBwYXNzaW5nIHRoZSBgZGF0YS1jb250ZXh0YC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIENvbGxlY3Rpb24gb2YgYGRhdGEtYCBhdHRyaWJ1dGVzIGZyb20gdGhlIHNvdXJjZSBub2RlLlxyXG4gICAqL1xyXG4gIGFjdGl2YXRlUmVsYXRlZExpc3Q6IGZ1bmN0aW9uIGFjdGl2YXRlUmVsYXRlZExpc3QocGFyYW1zKSB7XHJcbiAgICBpZiAocGFyYW1zLmNvbnRleHQpIHtcclxuICAgICAgdGhpcy5uYXZpZ2F0ZVRvUmVsYXRlZFZpZXcocGFyYW1zLnZpZXcsIHBhcnNlSW50KHBhcmFtcy5jb250ZXh0LCAxMCksIHBhcmFtcy5kZXNjcmlwdG9yKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIE5hdmlnYXRlcyB0byB0aGUgZGVmaW5lZCBgdGhpcy5lZGl0Vmlld2AgcGFzc2luZyB0aGUgY3VycmVudCBgdGhpcy5lbnRyeWAgYXMgZGVmYXVsdCBkYXRhLlxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsXHJcbiAgICovXHJcbiAgbmF2aWdhdGVUb0VkaXRWaWV3OiBmdW5jdGlvbiBuYXZpZ2F0ZVRvRWRpdFZpZXcoLyogZWwqLykge1xyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRWaWV3KHRoaXMuZWRpdFZpZXcpO1xyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgY29uc3QgZW50cnkgPSB0aGlzLmVudHJ5O1xyXG4gICAgICB2aWV3LnNob3coe1xyXG4gICAgICAgIGVudHJ5LFxyXG4gICAgICAgIGZyb21Db250ZXh0OiB0aGlzLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIE5hdmlnYXRlcyB0byBhIGdpdmVuIHZpZXcgaWQgcGFzc2luZyB0aGUgb3B0aW9ucyByZXRyaWV2ZWQgdXNpbmcgdGhlIHNsb3QgaW5kZXggdG8gYHRoaXMuX25hdmlnYXRpb25PcHRpb25zYC5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgVmlldyBpZCB0byBnbyB0b1xyXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBzbG90IEluZGV4IG9mIHRoZSBjb250ZXh0IHRvIHVzZSBpbiBgdGhpcy5fbmF2aWdhdGlvbk9wdGlvbnNgLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBkZXNjcmlwdG9yIE9wdGlvbmFsIGRlc2NyaXB0b3Igb3B0aW9uIHRoYXQgaXMgbWl4ZWQgaW4uXHJcbiAgICovXHJcbiAgbmF2aWdhdGVUb1JlbGF0ZWRWaWV3OiBmdW5jdGlvbiBuYXZpZ2F0ZVRvUmVsYXRlZFZpZXcoaWQsIHNsb3QsIGRlc2NyaXB0b3IpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLl9uYXZpZ2F0aW9uT3B0aW9uc1tzbG90XTtcclxuICAgIGNvbnN0IHZpZXcgPSBBcHAuZ2V0VmlldyhpZCk7XHJcblxyXG4gICAgaWYgKGRlc2NyaXB0b3IgJiYgb3B0aW9ucykge1xyXG4gICAgICBvcHRpb25zLmRlc2NyaXB0b3IgPSBkZXNjcmlwdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmVudHJ5KSB7XHJcbiAgICAgIG9wdGlvbnMuc2VsZWN0ZWRFbnRyeSA9IHRoaXMuZW50cnk7XHJcbiAgICB9XHJcblxyXG4gICAgb3B0aW9ucy5mcm9tQ29udGV4dCA9IHRoaXM7XHJcbiAgICBpZiAodmlldyAmJiBvcHRpb25zKSB7XHJcbiAgICAgIHZpZXcuc2hvdyhvcHRpb25zKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgYW5kIHJldHVybnMgdGhlIERldGFpbCB2aWV3IGxheW91dCBieSBmb2xsb3dpbmcgYSBzdGFuZGFyZCBmb3Igc2VjdGlvbiBhbmQgcm93czpcclxuICAgKlxyXG4gICAqIFRoZSBgdGhpcy5sYXlvdXRgIGl0c2VsZiBpcyBhbiBhcnJheSBvZiBzZWN0aW9uIG9iamVjdHMgd2hlcmUgYSBzZWN0aW9uIG9iamVjdCBpcyBkZWZpbmVkIGFzIHN1Y2g6XHJcbiAgICpcclxuICAgKiAgICAge1xyXG4gICAqICAgICAgICBuYW1lOiAnU3RyaW5nJywgLy8gUmVxdWlyZWQuIHVuaXF1ZSBuYW1lIGZvciBpZGVudGlmaWNhdGlvbi9jdXN0b21pemF0aW9uIHB1cnBvc2VzXHJcbiAgICogICAgICAgIHRpdGxlOiAnU3RyaW5nJywgLy8gUmVxdWlyZWQuIFRleHQgc2hvd24gaW4gdGhlIHNlY3Rpb24gaGVhZGVyXHJcbiAgICogICAgICAgIGxpc3Q6IGJvb2xlYW4sIC8vIE9wdGlvbmFsLiBEZWZhdWx0IGZhbHNlLiBDb250cm9scyBpZiB0aGUgZ3JvdXAgY29udGFpbmVyIGZvciBjaGlsZCByb3dzIHNob3VsZCBiZSBhIGRpdiAoZmFsc2UpIG9yIHVsICh0cnVlKVxyXG4gICAqICAgICAgICBjaGlsZHJlbjogW10sIC8vIEFycmF5IG9mIGNoaWxkIHJvdyBvYmplY3RzXHJcbiAgICogICAgIH1cclxuICAgKlxyXG4gICAqIEEgY2hpbGQgcm93IG9iamVjdCBoYXM6XHJcbiAgICpcclxuICAgKiAgICAge1xyXG4gICAqICAgICAgICBuYW1lOiAnU3RyaW5nJywgLy8gUmVxdWlyZWQuIHVuaXF1ZSBuYW1lIGZvciBpZGVudGlmaWNhdGlvbi9jdXN0b21pemF0aW9uIHB1cnBvc2VzXHJcbiAgICogICAgICAgIHByb3BlcnR5OiAnU3RyaW5nJywgLy8gT3B0aW9uYWwuIFRoZSBwcm9wZXJ0eSBvZiB0aGUgY3VycmVudCBlbnRpdHkgdG8gYmluZCB0b1xyXG4gICAqICAgICAgICBsYWJlbDogJ1N0cmluZycsIC8vIE9wdGlvbmFsLiBUZXh0IHNob3duIGluIHRoZSBsYWJlbCB0byB0aGUgbGVmdCBvZiB0aGUgcHJvcGVydHlcclxuICAgKiAgICAgICAgb25DcmVhdGU6IGZ1bmN0aW9uKCksIC8vIE9wdGlvbmFsLiBZb3UgbWF5IHBhc3MgYSBmdW5jdGlvbiB0byBiZSBjYWxsZWQgd2hlbiB0aGUgcm93IGlzIGFkZGVkIHRvIHRoZSBET01cclxuICAgKiAgICAgICAgaW5jbHVkZTogYm9vbGVhbiwgLy8gT3B0aW9uYWwuIElmIGZhbHNlIHRoZSByb3cgd2lsbCBub3QgYmUgaW5jbHVkZWQgaW4gdGhlIGxheW91dFxyXG4gICAqICAgICAgICBleGNsdWRlOiBib29sZWFuLCAvLyBPcHRpb25hbC4gSWYgdHJ1ZSB0aGUgcm93IHdpbGwgbm90IGJlIGluY2x1ZGVkIGluIHRoZSBsYXlvdXRcclxuICAgKiAgICAgICAgdGVtcGxhdGU6IFNpbXBsYXRlLCAvLyBPcHRpb25hbC4gT3ZlcnJpZGUgdGhlIEhUTUwgU2ltcGxhdGUgdXNlZCBmb3IgcmVuZGVyaW5nIHRoZSB2YWx1ZSAobm90IHRoZSByb3cpIHdoZXJlIGAkYCBpcyB0aGUgcm93IG9iamVjdFxyXG4gICAqICAgICAgICB0cGw6IFNpbXBsYXRlLCAvLyBPcHRpb25hbC4gU2FtZSBhcyB0ZW1wbGF0ZS5cclxuICAgKiAgICAgICAgcmVuZGVyZXI6IGZ1bmN0aW9uKCksIC8vIE9wdGlvbmFsLiBQYXNzIGEgZnVuY3Rpb24gdGhhdCByZWNlaXZlcyB0aGUgY3VycmVudCB2YWx1ZSBhbmQgcmV0dXJucyBhIHZhbHVlIHRvIGJlIHJlbmRlcmVkXHJcbiAgICogICAgICAgIGVuY29kZTogYm9vbGVhbiwgLy8gT3B0aW9uYWwuIElmIHRydWUgaXQgd2lsbCBlbmNvZGUgSFRNTCBlbnRpdGllc1xyXG4gICAqICAgICAgICBjbHM6ICdTdHJpbmcnLCAvLyBPcHRpb25hbC4gQWRkaXRpb25hbCBDU1MgY2xhc3Mgc3RyaW5nIHRvIGJlIGFkZGVkIHRvIHRoZSByb3cgZGl2XHJcbiAgICogICAgICAgIHVzZTogU2ltcGxhdGUsIC8vIE9wdGlvbmFsLiBPdmVycmlkZSB0aGUgSFRNTCBTaW1wbGF0ZSB1c2VkIGZvciByZW5kZXJpbmcgdGhlIHJvdyAobm90IHZhbHVlKVxyXG4gICAqICAgICAgICBwcm92aWRlcjogZnVuY3Rpb24oZW50cnksIHByb3BlcnR5TmFtZSksIC8vIE9wdGlvbmFsLiBGdW5jdGlvbiB0aGF0IGFjY2VwdHMgdGhlIGRhdGEgZW50cnkgYW5kIHRoZSBwcm9wZXJ0eSBuYW1lIGFuZCByZXR1cm5zIHRoZSBleHRyYWN0ZWQgdmFsdWUuIEJ5IGRlZmF1bHQgc2ltcGx5IGV4dHJhY3RzIGRpcmVjdGx5LlxyXG4gICAqICAgICAgICB2YWx1ZTogQW55IC8vIE9wdGlvbmFsLiBQcm92aWRlIGEgdmFsdWUgZGlyZWN0bHkgaW5zdGVhZCBvZiBiaW5kaW5nXHJcbiAgICogICAgIH1cclxuICAgKlxyXG4gICAqIEByZXR1cm4ge09iamVjdFtdfSBEZXRhaWwgbGF5b3V0IGRlZmluaXRpb25cclxuICAgKi9cclxuICBjcmVhdGVMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZUxheW91dCgpIHtcclxuICAgIHJldHVybiB0aGlzLmxheW91dCB8fCBbXTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFByb2Nlc3NlcyB0aGUgZ2l2ZW4gbGF5b3V0IGRlZmluaXRpb24gdXNpbmcgdGhlIGRhdGEgZW50cnkgcmVzcG9uc2UgYnkgcmVuZGVyaW5nIGFuZCBpbnNlcnRpbmcgdGhlIEhUTUwgbm9kZXMgYW5kXHJcbiAgICogZmlyaW5nIGFueSBvbkNyZWF0ZSBldmVudHMgZGVmaW5lZC5cclxuICAgKiBAcGFyYW0ge09iamVjdFtdfSBsYXlvdXQgTGF5b3V0IGRlZmluaXRpb25cclxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgZGF0YSByZXNwb25zZVxyXG4gICAqL1xyXG4gIHByb2Nlc3NMYXlvdXQ6IGZ1bmN0aW9uIHByb2Nlc3NMYXlvdXQobGF5b3V0LCBlbnRyeSkge1xyXG4gICAgY29uc3QgaXRlbXMgPSAobGF5b3V0LmNoaWxkcmVuIHx8IGxheW91dC5hcyB8fCBsYXlvdXQpO1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IGxheW91dC5vcHRpb25zIHx8IChsYXlvdXQub3B0aW9ucyA9IHtcclxuICAgICAgdGl0bGU6IHRoaXMuZGV0YWlsc1RleHQsXHJcbiAgICB9KTtcclxuICAgIGNvbnN0IHNlY3Rpb25RdWV1ZSA9IFtdO1xyXG4gICAgbGV0IHNlY3Rpb25TdGFydGVkID0gZmFsc2U7XHJcbiAgICBjb25zdCBjYWxsYmFja3MgPSBbXTtcclxuICAgIGxldCByb3cgPSBbXTtcclxuXHJcbiAgICBsZXQgc2VjdGlvbk5vZGU7XHJcblxyXG4gICAgaWYgKHRoaXMuaXNUYWJiZWQpIHtcclxuICAgICAgdGhpcy5wbGFjZVRhYkxpc3QodGhpcy5jb250ZW50Tm9kZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpdGVtcy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBjdXJyZW50ID0gaXRlbXNbaV07XHJcbiAgICAgIGNvbnN0IGluY2x1ZGUgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5pbmNsdWRlLCBlbnRyeSk7XHJcbiAgICAgIGNvbnN0IGV4Y2x1ZGUgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5leGNsdWRlLCBlbnRyeSk7XHJcbiAgICAgIGxldCBjb250ZXh0O1xyXG5cclxuICAgICAgaWYgKGluY2x1ZGUgIT09IHVuZGVmaW5lZCAmJiAhaW5jbHVkZSkge1xyXG4gICAgICAgIGlmIChpID49IChpdGVtcy5sZW5ndGggLSAxKSAmJiByb3cubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgY29uc3Qgcm93Tm9kZSA9IHRoaXMuY3JlYXRlUm93KHJvdyk7XHJcbiAgICAgICAgICAkKHNlY3Rpb25Ob2RlKS5hcHBlbmQocm93Tm9kZSk7XHJcbiAgICAgICAgICByb3cgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChleGNsdWRlICE9PSB1bmRlZmluZWQgJiYgZXhjbHVkZSkge1xyXG4gICAgICAgIGlmIChpID49IChpdGVtcy5sZW5ndGggLSAxKSAmJiByb3cubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgY29uc3Qgcm93Tm9kZSA9IHRoaXMuY3JlYXRlUm93KHJvdyk7XHJcbiAgICAgICAgICAkKHNlY3Rpb25Ob2RlKS5hcHBlbmQocm93Tm9kZSk7XHJcbiAgICAgICAgICByb3cgPSBbXTtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjdXJyZW50LmNoaWxkcmVuIHx8IGN1cnJlbnQuYXMpIHtcclxuICAgICAgICBpZiAoc2VjdGlvblN0YXJ0ZWQpIHtcclxuICAgICAgICAgIHNlY3Rpb25RdWV1ZS5wdXNoKGN1cnJlbnQpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB0aGlzLnByb2Nlc3NMYXlvdXQoY3VycmVudCwgZW50cnkpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29udGludWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmICghc2VjdGlvblN0YXJ0ZWQpIHtcclxuICAgICAgICBsZXQgc2VjdGlvbjtcclxuICAgICAgICBzZWN0aW9uU3RhcnRlZCA9IHRydWU7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNUYWJiZWQpIHtcclxuICAgICAgICAgIGlmIChsYXlvdXQubmFtZSA9PT0gdGhpcy5xdWlja0FjdGlvblNlY3Rpb24pIHtcclxuICAgICAgICAgICAgc2VjdGlvbiA9ICQodGhpcy5zZWN0aW9uQmVnaW5UZW1wbGF0ZS5hcHBseShsYXlvdXQsIHRoaXMpICsgdGhpcy5zZWN0aW9uRW5kVGVtcGxhdGUuYXBwbHkobGF5b3V0LCB0aGlzKSk7XHJcbiAgICAgICAgICAgIHNlY3Rpb25Ob2RlID0gc2VjdGlvbi5nZXQoMCk7XHJcbiAgICAgICAgICAgICQodGhpcy5xdWlja0FjdGlvbnMpLmFwcGVuZChzZWN0aW9uKTtcclxuICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIGNvbnN0IHRhYiA9ICQodGhpcy50YWJMaXN0SXRlbVRlbXBsYXRlLmFwcGx5KGxheW91dCwgdGhpcykpLmdldCgwKTtcclxuICAgICAgICAgICAgc2VjdGlvbiA9ICQodGhpcy5zZWN0aW9uQmVnaW5UZW1wbGF0ZS5hcHBseShsYXlvdXQsIHRoaXMpICsgdGhpcy5zZWN0aW9uRW5kVGVtcGxhdGUuYXBwbHkobGF5b3V0LCB0aGlzKSk7XHJcbiAgICAgICAgICAgIHNlY3Rpb25Ob2RlID0gc2VjdGlvbi5nZXQoMCk7XHJcbiAgICAgICAgICAgIHRoaXMudGFiTWFwcGluZy5wdXNoKHNlY3Rpb24uZ2V0KDApKTtcclxuICAgICAgICAgICAgdGhpcy50YWJzLnB1c2godGFiKTtcclxuICAgICAgICAgICAgJCh0aGlzLnRhYkNvbnRhaW5lcikuYXBwZW5kKHNlY3Rpb24pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBzZWN0aW9uID0gJCh0aGlzLnNlY3Rpb25CZWdpblRlbXBsYXRlLmFwcGx5KGxheW91dCwgdGhpcykgKyB0aGlzLnNlY3Rpb25FbmRUZW1wbGF0ZS5hcHBseShsYXlvdXQsIHRoaXMpKTtcclxuICAgICAgICAgIHNlY3Rpb25Ob2RlID0gc2VjdGlvbi5nZXQoMCkuY2hpbGROb2Rlc1sxXTtcclxuICAgICAgICAgICQodGhpcy50YWJDb250YWluZXIpLmFwcGVuZChzZWN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHByb3ZpZGVyID0gY3VycmVudC5wcm92aWRlciB8fCB1dGlsaXR5LmdldFZhbHVlO1xyXG4gICAgICBjb25zdCBwcm9wZXJ0eSA9IHR5cGVvZiBjdXJyZW50LnByb3BlcnR5ID09PSAnc3RyaW5nJyA/IGN1cnJlbnQucHJvcGVydHkgOiBjdXJyZW50Lm5hbWU7XHJcbiAgICAgIGNvbnN0IHZhbHVlID0gdHlwZW9mIGN1cnJlbnQudmFsdWUgPT09ICd1bmRlZmluZWQnID8gcHJvdmlkZXIoZW50cnksIHByb3BlcnR5LCBlbnRyeSkgOiBjdXJyZW50LnZhbHVlO1xyXG4gICAgICBsZXQgcmVuZGVyZWQ7XHJcbiAgICAgIGxldCBmb3JtYXR0ZWQ7XHJcbiAgICAgIGlmIChjdXJyZW50LnRlbXBsYXRlIHx8IGN1cnJlbnQudHBsKSB7XHJcbiAgICAgICAgcmVuZGVyZWQgPSAoY3VycmVudC50ZW1wbGF0ZSB8fCBjdXJyZW50LnRwbCkuYXBwbHkodmFsdWUsIHRoaXMpO1xyXG4gICAgICAgIGZvcm1hdHRlZCA9IGN1cnJlbnQuZW5jb2RlID09PSB0cnVlID8gZm9ybWF0LmVuY29kZShyZW5kZXJlZCkgOiByZW5kZXJlZDtcclxuICAgICAgfSBlbHNlIGlmIChjdXJyZW50LnJlbmRlcmVyICYmIHR5cGVvZiBjdXJyZW50LnJlbmRlcmVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgcmVuZGVyZWQgPSBjdXJyZW50LnJlbmRlcmVyLmNhbGwodGhpcywgdmFsdWUpO1xyXG4gICAgICAgIGZvcm1hdHRlZCA9IGN1cnJlbnQuZW5jb2RlID09PSB0cnVlID8gZm9ybWF0LmVuY29kZShyZW5kZXJlZCkgOiByZW5kZXJlZDtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBmb3JtYXR0ZWQgPSBjdXJyZW50LmVuY29kZSAhPT0gZmFsc2UgPyBmb3JtYXQuZW5jb2RlKHZhbHVlKSA6IHZhbHVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBkYXRhID0gbGFuZy5taXhpbih7fSwge1xyXG4gICAgICAgIGVudHJ5LFxyXG4gICAgICAgIHZhbHVlOiBmb3JtYXR0ZWQsXHJcbiAgICAgICAgcmF3OiB2YWx1ZSxcclxuICAgICAgfSwgY3VycmVudCk7XHJcblxyXG4gICAgICBpZiAoY3VycmVudC5kZXNjcmlwdG9yKSB7XHJcbiAgICAgICAgZGF0YS5kZXNjcmlwdG9yID0gdHlwZW9mIGN1cnJlbnQuZGVzY3JpcHRvciA9PT0gJ2Z1bmN0aW9uJyA/IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LmRlc2NyaXB0b3IsIGVudHJ5LCB2YWx1ZSkgOiBwcm92aWRlcihlbnRyeSwgY3VycmVudC5kZXNjcmlwdG9yKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnQuYWN0aW9uKSB7XHJcbiAgICAgICAgZGF0YS5hY3Rpb24gPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5hY3Rpb24sIGVudHJ5LCB2YWx1ZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGhhc0FjY2VzcyA9IEFwcC5oYXNBY2Nlc3NUbyhjdXJyZW50LnNlY3VyaXR5KTtcclxuXHJcbiAgICAgIGlmIChjdXJyZW50LnNlY3VyaXR5KSB7XHJcbiAgICAgICAgZGF0YS5kaXNhYmxlZCA9ICFoYXNBY2Nlc3M7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChjdXJyZW50LmRpc2FibGVkICYmIGhhc0FjY2Vzcykge1xyXG4gICAgICAgIGRhdGEuZGlzYWJsZWQgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5kaXNhYmxlZCwgZW50cnksIHZhbHVlKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGN1cnJlbnQudmlldykge1xyXG4gICAgICAgIGNvbnRleHQgPSBsYW5nLm1peGluKHt9LCBjdXJyZW50Lm9wdGlvbnMpO1xyXG5cclxuICAgICAgICBpZiAoY3VycmVudC5rZXkpIHtcclxuICAgICAgICAgIGNvbnRleHQua2V5ID0gdHlwZW9mIGN1cnJlbnQua2V5ID09PSAnZnVuY3Rpb24nID8gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQua2V5LCBlbnRyeSkgOiBwcm92aWRlcihlbnRyeSwgY3VycmVudC5rZXkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudC53aGVyZSkge1xyXG4gICAgICAgICAgY29udGV4dC53aGVyZSA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LndoZXJlLCBlbnRyeSk7XHJcbiAgICAgICAgICBpZiAoY29udGV4dC53aGVyZSA9PT0gJycpIHtcclxuICAgICAgICAgICAgZGF0YS5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50LmNvbnRyYWN0TmFtZSkge1xyXG4gICAgICAgICAgY29udGV4dC5jb250cmFjdE5hbWUgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5jb250cmFjdE5hbWUsIGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnQucmVzb3VyY2VLaW5kKSB7XHJcbiAgICAgICAgICBjb250ZXh0LnJlc291cmNlS2luZCA9IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihjdXJyZW50LnJlc291cmNlS2luZCwgZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudC5yZXNvdXJjZVByb3BlcnR5KSB7XHJcbiAgICAgICAgICBjb250ZXh0LnJlc291cmNlUHJvcGVydHkgPSB0aGlzLmV4cGFuZEV4cHJlc3Npb24oY3VycmVudC5yZXNvdXJjZVByb3BlcnR5LCBlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChjdXJyZW50LnJlc291cmNlUHJlZGljYXRlKSB7XHJcbiAgICAgICAgICBjb250ZXh0LnJlc291cmNlUHJlZGljYXRlID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQucmVzb3VyY2VQcmVkaWNhdGUsIGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGN1cnJlbnQuZGF0YVNldCkge1xyXG4gICAgICAgICAgY29udGV4dC5kYXRhU2V0ID0gdGhpcy5leHBhbmRFeHByZXNzaW9uKGN1cnJlbnQuZGF0YVNldCwgZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAoY3VycmVudC50aXRsZSkge1xyXG4gICAgICAgICAgY29udGV4dC50aXRsZSA9IGN1cnJlbnQudGl0bGU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoY3VycmVudC5yZXNldFNlYXJjaCkge1xyXG4gICAgICAgICAgY29udGV4dC5yZXNldFNlYXJjaCA9IGN1cnJlbnQucmVzZXRTZWFyY2g7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGNvbnRleHQucmVzZXRTZWFyY2ggPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZGF0YS52aWV3ID0gY3VycmVudC52aWV3O1xyXG4gICAgICAgIGRhdGEuY29udGV4dCA9ICh0aGlzLl9uYXZpZ2F0aW9uT3B0aW9ucy5wdXNoKGNvbnRleHQpIC0gMSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IHVzZUxpc3RUZW1wbGF0ZSA9IChsYXlvdXQubGlzdCB8fCBvcHRpb25zLmxpc3QpO1xyXG5cclxuICAgICAgbGV0IHRlbXBsYXRlO1xyXG4gICAgICBsZXQgaXNDb2x1bW5JdGVtID0gZmFsc2U7XHJcbiAgICAgIC8vIHByaW9yaXR5OiB1c2UgPiAocmVsYXRlZFByb3BlcnR5VGVtcGxhdGUgfCByZWxhdGVkVGVtcGxhdGUpID4gKGFjdGlvblByb3BlcnR5VGVtcGxhdGUgfCBhY3Rpb25UZW1wbGF0ZSkgPiBwcm9wZXJ0eVRlbXBsYXRlXHJcbiAgICAgIGlmIChjdXJyZW50LnVzZSkge1xyXG4gICAgICAgIHRlbXBsYXRlID0gY3VycmVudC51c2U7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudC52aWV3ICYmIHVzZUxpc3RUZW1wbGF0ZSkge1xyXG4gICAgICAgIHRlbXBsYXRlID0gdGhpcy5yZWxhdGVkVGVtcGxhdGU7XHJcbiAgICAgICAgY3VycmVudC5yZWxhdGVkSXRlbSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudC52aWV3KSB7XHJcbiAgICAgICAgdGVtcGxhdGUgPSB0aGlzLnJlbGF0ZWRQcm9wZXJ0eVRlbXBsYXRlO1xyXG4gICAgICAgIGlzQ29sdW1uSXRlbSA9IHRydWU7XHJcbiAgICAgIH0gZWxzZSBpZiAoY3VycmVudC5hY3Rpb24gJiYgdXNlTGlzdFRlbXBsYXRlKSB7XHJcbiAgICAgICAgdGVtcGxhdGUgPSB0aGlzLmFjdGlvblRlbXBsYXRlO1xyXG4gICAgICB9IGVsc2UgaWYgKGN1cnJlbnQuYWN0aW9uKSB7XHJcbiAgICAgICAgdGVtcGxhdGUgPSB0aGlzLmFjdGlvblByb3BlcnR5VGVtcGxhdGU7XHJcbiAgICAgICAgaXNDb2x1bW5JdGVtID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0ZW1wbGF0ZSA9IHRoaXMucHJvcGVydHlUZW1wbGF0ZTtcclxuICAgICAgICBpc0NvbHVtbkl0ZW0gPSB0cnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgcm93Tm9kZSA9IHRoaXMuY3JlYXRlUm93Tm9kZShjdXJyZW50LCBzZWN0aW9uTm9kZSwgZW50cnksIHRlbXBsYXRlLCBkYXRhKTtcclxuICAgICAgaWYgKChkYXRhLnJhdyAhPT0gdW5kZWZpbmVkKSAmJiBkYXRhLnZhbHVlKSB7XHJcbiAgICAgICAgaWYgKGlzQ29sdW1uSXRlbSkge1xyXG4gICAgICAgICAgcm93LnB1c2gocm93Tm9kZSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICQoc2VjdGlvbk5vZGUpLmFwcGVuZChyb3dOb2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyb3cubGVuZ3RoID49IHRoaXMubXVsdGlDb2x1bW5Db3VudCB8fCAoaSA+PSAoaXRlbXMubGVuZ3RoIC0gMSkgJiYgcm93Lmxlbmd0aCA+IDApKSB7XHJcbiAgICAgICAgcm93Tm9kZSA9IHRoaXMuY3JlYXRlUm93KHJvdyk7XHJcbiAgICAgICAgJChzZWN0aW9uTm9kZSkuYXBwZW5kKHJvd05vZGUpO1xyXG4gICAgICAgIHJvdyA9IFtdO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChjdXJyZW50LnJlbGF0ZWRJdGVtKSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIHRoaXMuX3Byb2Nlc3NSZWxhdGVkSXRlbShkYXRhLCBjb250ZXh0LCByb3dOb2RlKTtcclxuICAgICAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgICAvLyBlcnJvciBwcm9jZXNzaW5nIHJlbGF0ZWQgbm9kZVxyXG4gICAgICAgICAgY29uc29sZS5lcnJvcihlKTsgLy9lc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoY3VycmVudC5vbkNyZWF0ZSkge1xyXG4gICAgICAgIGNhbGxiYWNrcy5wdXNoKHtcclxuICAgICAgICAgIHJvdzogY3VycmVudCxcclxuICAgICAgICAgIG5vZGU6IHJvd05vZGUsXHJcbiAgICAgICAgICB2YWx1ZSxcclxuICAgICAgICAgIGVudHJ5LFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjYWxsYmFja3MubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgaXRlbSA9IGNhbGxiYWNrc1tpXTtcclxuICAgICAgaXRlbS5yb3cub25DcmVhdGUuYXBwbHkodGhpcywgW2l0ZW0ucm93LCBpdGVtLm5vZGUsIGl0ZW0udmFsdWUsIGl0ZW0uZW50cnldKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHNlY3Rpb25RdWV1ZS5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBjdXJyZW50ID0gc2VjdGlvblF1ZXVlW2ldO1xyXG4gICAgICB0aGlzLnByb2Nlc3NMYXlvdXQoY3VycmVudCwgZW50cnkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICB9LFxyXG4gIGNyZWF0ZVJvdzogZnVuY3Rpb24gY3JlYXRlUm93KHJvdykge1xyXG4gICAgY29uc3Qgcm93VGVtcGxhdGUgPSAkKHRoaXMucm93VGVtcGxhdGUuYXBwbHkobnVsbCwgdGhpcykpO1xyXG4gICAgcm93LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgcm93VGVtcGxhdGUuYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gcm93VGVtcGxhdGU7XHJcbiAgfSxcclxuICBjcmVhdGVSb3dOb2RlOiBmdW5jdGlvbiBjcmVhdGVSb3dOb2RlKGxheW91dCwgc2VjdGlvbk5vZGUsIGVudHJ5LCB0ZW1wbGF0ZSwgZGF0YSkge1xyXG4gICAgY29uc3QgZnJhZyA9ICQodGVtcGxhdGUuYXBwbHkoZGF0YSwgdGhpcykpO1xyXG4gICAgcmV0dXJuIGZyYWcuZ2V0KDApO1xyXG4gIH0sXHJcbiAgX2dldFN0b3JlQXR0cjogZnVuY3Rpb24gX2dldFN0b3JlQXR0cigpIHtcclxuICAgIHJldHVybiB0aGlzLnN0b3JlIHx8ICh0aGlzLnN0b3JlID0gdGhpcy5jcmVhdGVTdG9yZSgpKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZVN0b3JlIGlzIHRoZSBjb3JlIG9mIHRoZSBkYXRhIGhhbmRsaW5nIGZvciBEZXRhaWwgVmlld3MuIEJ5IGRlZmF1bHQgaXQgaXMgZW1wdHkgYnV0IGl0IHNob3VsZCByZXR1cm5cclxuICAgKiBhIGRvam8gc3RvcmUgb2YgeW91ciBjaG9vc2luZy4gVGhlcmUgYXJlIHtAbGluayBfU0RhdGFEZXRhaWxNaXhpbiBNaXhpbnN9IGF2YWlsYWJsZSBmb3IgU0RhdGEuXHJcbiAgICogQHJldHVybiB7Kn1cclxuICAgKi9cclxuICBjcmVhdGVTdG9yZTogZnVuY3Rpb24gY3JlYXRlU3RvcmUoKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEB0ZW1wbGF0ZVxyXG4gICAqIE9wdGlvbmFsIHByb2Nlc3Npbmcgb2YgdGhlIHJldHVybmVkIGVudHJ5IGJlZm9yZSBpdCBnZXRzIHByb2Nlc3NlZCBpbnRvIGxheW91dC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgRW50cnkgZnJvbSBkYXRhIHN0b3JlXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBCeSBkZWZhdWx0IGRvZXMgbm90IGRvIGFueSBwcm9jZXNzaW5nXHJcbiAgICovXHJcbiAgcHJlUHJvY2Vzc0VudHJ5OiBmdW5jdGlvbiBwcmVQcm9jZXNzRW50cnkoZW50cnkpIHtcclxuICAgIHJldHVybiBlbnRyeTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFRha2VzIHRoZSBlbnRyeSBmcm9tIHRoZSBkYXRhIHN0b3JlLCBhcHBsaWVzIGN1c3RvbWl6YXRpb24sIGFwcGxpZXMgYW55IGN1c3RvbSBpdGVtIHByb2Nlc3MgYW5kIHRoZW5cclxuICAgKiBwYXNzZXMgaXQgdG8gcHJvY2VzcyBsYXlvdXQuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGVudHJ5IEVudHJ5IGZyb20gZGF0YSBzdG9yZVxyXG4gICAqL1xyXG4gIHByb2Nlc3NFbnRyeTogZnVuY3Rpb24gcHJvY2Vzc0VudHJ5KGVudHJ5KSB7XHJcbiAgICB0aGlzLmVudHJ5ID0gdGhpcy5wcmVQcm9jZXNzRW50cnkoZW50cnkpO1xyXG5cclxuICAgIGlmICh0aGlzLmVudHJ5KSB7XHJcbiAgICAgIHRoaXMucHJvY2Vzc0xheW91dCh0aGlzLl9jcmVhdGVDdXN0b21pemVkTGF5b3V0KHRoaXMuY3JlYXRlTGF5b3V0KCkpLCB0aGlzLmVudHJ5KTtcclxuICAgICAgaWYgKHRoaXMuaXNUYWJiZWQpIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZVRhYnModGhpcy50YWJzKTtcclxuICAgICAgICB0aGlzLnBsYWNlRGV0YWlsSGVhZGVyKHRoaXMuZW50cnkpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldCgnZGV0YWlsQ29udGVudCcsICcnKTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9vbkdldENvbXBsZXRlOiBmdW5jdGlvbiBfb25HZXRDb21wbGV0ZShlbnRyeSkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgICAgdGhpcy5wcm9jZXNzRW50cnkoZW50cnkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgICQodGhpcy5jb250ZW50Tm9kZSkuZW1wdHkoKS5hcHBlbmQodGhpcy5ub3RBdmFpbGFibGVUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygncGFuZWwtbG9hZGluZycpO1xyXG5cclxuICAgICAgLyogdGhpcyBtdXN0IHRha2UgcGxhY2Ugd2hlbiB0aGUgY29udGVudCBpcyB2aXNpYmxlICovXHJcbiAgICAgIHRoaXMub25Db250ZW50Q2hhbmdlKCk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7IC8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgfSBmaW5hbGx5IHtcclxuICAgICAgdGhpcy5pc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9vbkdldEVycm9yOiBmdW5jdGlvbiBfb25HZXRFcnJvcihnZXRPcHRpb25zLCBlcnJvcikge1xyXG4gICAgdGhpcy5oYW5kbGVFcnJvcihlcnJvcik7XHJcbiAgICB0aGlzLmlzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhdGVzIHRoZSByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIHJlcXVlc3REYXRhOiBmdW5jdGlvbiByZXF1ZXN0RGF0YSgpIHtcclxuICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcygncGFuZWwtbG9hZGluZycpO1xyXG5cclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcblxyXG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnJlcXVlc3REYXRhVXNpbmdNb2RlbCgpLnRoZW4oKGRhdGEpID0+IHtcclxuICAgICAgICB0aGlzLl9vbkdldENvbXBsZXRlKGRhdGEpO1xyXG4gICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fb25HZXRFcnJvcihudWxsLCBlcnIpO1xyXG4gICAgICB9KTtcclxuICAgIH0gZWxzZSBpZiAoc3RvcmUpIHtcclxuICAgICAgY29uc3QgZ2V0T3B0aW9ucyA9IHt9O1xyXG5cclxuICAgICAgdGhpcy5fYXBwbHlTdGF0ZVRvR2V0T3B0aW9ucyhnZXRPcHRpb25zKTtcclxuXHJcbiAgICAgIGNvbnN0IGdldEV4cHJlc3Npb24gPSB0aGlzLl9idWlsZEdldEV4cHJlc3Npb24oKSB8fCBudWxsO1xyXG4gICAgICBjb25zdCBnZXRSZXN1bHRzID0gdGhpcy5yZXF1ZXN0RGF0YVVzaW5nU3RvcmUoZ2V0RXhwcmVzc2lvbiwgZ2V0T3B0aW9ucyk7XHJcblxyXG4gICAgICB3aGVuKGdldFJlc3VsdHMsXHJcbiAgICAgICAgdGhpcy5fb25HZXRDb21wbGV0ZS5iaW5kKHRoaXMpLFxyXG4gICAgICAgIHRoaXMuX29uR2V0RXJyb3IuYmluZCh0aGlzLCBnZXRPcHRpb25zKVxyXG4gICAgICApO1xyXG5cclxuICAgICAgcmV0dXJuIGdldFJlc3VsdHM7XHJcbiAgICB9XHJcblxyXG4gICAgdGhyb3cgbmV3IEVycm9yKCdyZXF1ZXN0RGF0YSBjYWxsZWQgd2l0aG91dCBhIG1vZGVsIG9yIHN0b3JlIGRlZmluZWQuJyk7XHJcbiAgfSxcclxuICByZXF1ZXN0RGF0YVVzaW5nTW9kZWw6IGZ1bmN0aW9uIHJlcXVlc3REYXRhVXNpbmdNb2RlbCgpIHtcclxuICAgIGNvbnN0IGtleSA9IHRoaXMuX2J1aWxkR2V0RXhwcmVzc2lvbigpO1xyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldEVudHJ5KGtleSwgdGhpcy5vcHRpb25zKTtcclxuICB9LFxyXG4gIHJlcXVlc3REYXRhVXNpbmdTdG9yZTogZnVuY3Rpb24gcmVxdWVzdERhdGFVc2luZ1N0b3JlKGdldEV4cHJlc3Npb24sIGdldE9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcbiAgICByZXR1cm4gc3RvcmUuZ2V0KGdldEV4cHJlc3Npb24sIGdldE9wdGlvbnMpO1xyXG4gIH0sXHJcbiAgX2J1aWxkR2V0RXhwcmVzc2lvbjogZnVuY3Rpb24gX2J1aWxkR2V0RXhwcmVzc2lvbigpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcbiAgICByZXR1cm4gb3B0aW9ucyAmJiAob3B0aW9ucy5pZCB8fCBvcHRpb25zLmtleSk7XHJcbiAgfSxcclxuICBfYXBwbHlTdGF0ZVRvR2V0T3B0aW9uczogZnVuY3Rpb24gX2FwcGx5U3RhdGVUb0dldE9wdGlvbnMoLyogZ2V0T3B0aW9ucyovKSB7fSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSB2aWV3IHNob3VsZCBiZSByZWZyZXNoIGJ5IGluc3BlY3RpbmcgYW5kIGNvbXBhcmluZyB0aGUgcGFzc2VkIG5hdmlnYXRpb24gb3B0aW9uIGtleSB3aXRoIGN1cnJlbnQga2V5LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFBhc3NlZCBuYXZpZ2F0aW9uIG9wdGlvbnMuXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmlldyBzaG91bGQgYmUgcmVmcmVzaGVkLCBmYWxzZSBpZiBub3QuXHJcbiAgICovXHJcbiAgcmVmcmVzaFJlcXVpcmVkRm9yOiBmdW5jdGlvbiByZWZyZXNoUmVxdWlyZWRGb3Iob3B0aW9ucykge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xyXG4gICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMua2V5ICE9PSBvcHRpb25zLmtleSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSB7QGxpbmsgVmlldyNhY3RpdmF0ZSBwYXJlbnQgaW1wbGVtZW50YXRpb259IHRvIHNldCB0aGUgbmF2IG9wdGlvbnMgdGl0bGUgYXR0cmlidXRlIHRvIHRoZSBkZXNjcmlwdG9yXHJcbiAgICogQHBhcmFtIHRhZ1xyXG4gICAqIEBwYXJhbSBkYXRhXHJcbiAgICovXHJcbiAgYWN0aXZhdGU6IGZ1bmN0aW9uIGFjdGl2YXRlKHRhZywgZGF0YSkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IGRhdGEgJiYgZGF0YS5vcHRpb25zO1xyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5kZXNjcmlwdG9yKSB7XHJcbiAgICAgIG9wdGlvbnMudGl0bGUgPSBvcHRpb25zLnRpdGxlIHx8IG9wdGlvbnMuZGVzY3JpcHRvcjtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgc2hvdzogZnVuY3Rpb24gc2hvdyhvcHRpb25zKSB7XHJcbiAgICBpZiAob3B0aW9ucyAmJiBvcHRpb25zLmRlc2NyaXB0b3IpIHtcclxuICAgICAgb3B0aW9ucy50aXRsZSA9IG9wdGlvbnMudGl0bGUgfHwgb3B0aW9ucy5kZXNjcmlwdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoZSB2aWV3IGtleVxyXG4gICAqIEByZXR1cm4ge1N0cmluZ30gVmlldyBrZXlcclxuICAgKi9cclxuICBnZXRUYWc6IGZ1bmN0aW9uIGdldFRhZygpIHtcclxuICAgIHJldHVybiB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmtleTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHtAbGluayBWaWV3I2dldENvbnRleHQgcGFyZW50IGltcGxlbWVudGF0aW9ufSB0byBhbHNvIHNldCB0aGUgcmVzb3VyY2VLaW5kLCBrZXkgYW5kIGRlc2NyaXB0b3JcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFZpZXcgY29udGV4dCBvYmplY3RcclxuICAgKi9cclxuICBnZXRDb250ZXh0OiBmdW5jdGlvbiBnZXRDb250ZXh0KCkge1xyXG4gICAgcmV0dXJuIGxhbmcubWl4aW4odGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKSwge1xyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgICBrZXk6IHRoaXMub3B0aW9ucy5rZXksXHJcbiAgICAgIGRlc2NyaXB0b3I6IHRoaXMub3B0aW9ucy5kZXNjcmlwdG9yLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSB7QGxpbmsgVmlldyNiZWZvcmVUcmFuc2l0aW9uVG8gcGFyZW50IGltcGxlbWVudGF0aW9ufSB0byBhbHNvIGNsZWFyIHRoZSB2aWV3IGlmIGByZWZyZXNoUmVxdWlyZWRgIGlzIHRydWVcclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFZpZXcgY29udGV4dCBvYmplY3RcclxuICAgKi9cclxuICBiZWZvcmVUcmFuc2l0aW9uVG86IGZ1bmN0aW9uIGJlZm9yZVRyYW5zaXRpb25UbygpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcblxyXG4gICAgaWYgKHRoaXMucmVmcmVzaFJlcXVpcmVkKSB7XHJcbiAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIElmIGEgc2VjdXJpdHkgYnJlYWNoIGlzIGRldGVjdGVkIGl0IHNldHMgdGhlIGNvbnRlbnQgdG8gdGhlIG5vdEF2YWlsYWJsZVRlbXBsYXRlLCBvdGhlcndpc2UgaXQgY2FsbHNcclxuICAgKiB7QGxpbmsgI3JlcXVlc3REYXRhIHJlcXVlc3REYXRhfSB3aGljaCBzdGFydHMgdGhlIHByb2Nlc3Mgc2VxdWVuY2UuXHJcbiAgICovXHJcbiAgcmVmcmVzaDogZnVuY3Rpb24gcmVmcmVzaCgpIHtcclxuICAgIGlmICh0aGlzLnNlY3VyaXR5ICYmICFBcHAuaGFzQWNjZXNzVG8odGhpcy5leHBhbmRFeHByZXNzaW9uKHRoaXMuc2VjdXJpdHkpKSkge1xyXG4gICAgICAkKHRoaXMuY29udGVudE5vZGUpLmFwcGVuZCh0aGlzLm5vdEF2YWlsYWJsZVRlbXBsYXRlLmFwcGx5KHRoaXMpKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVxdWVzdERhdGEoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENsZWFycyB0aGUgdmlldyBieSByZXBsYWNpbmcgdGhlIGNvbnRlbnQgd2l0aCB0aGUgZW1wdHkgdGVtcGxhdGUgYW5kIGVtcHR5aW5nIHRoZSBzdG9yZWQgcm93IGNvbnRleHRzLlxyXG4gICAqL1xyXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgIHRoaXMuc2V0KCdkZXRhaWxDb250ZW50JywgdGhpcy5lbXB0eVRlbXBsYXRlLmFwcGx5KHRoaXMpKTtcclxuICAgIHRoaXMuY2xlYXJUYWJzKCk7XHJcbiAgICBpZiAodGhpcy5xdWlja0FjdGlvbnMpIHtcclxuICAgICAgJCh0aGlzLnF1aWNrQWN0aW9ucykuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9uYXZpZ2F0aW9uT3B0aW9ucyA9IFtdO1xyXG4gIH0sXHJcbiAgX3Byb2Nlc3NSZWxhdGVkSXRlbTogZnVuY3Rpb24gX3Byb2Nlc3NSZWxhdGVkSXRlbShkYXRhLCBjb250ZXh0LCByb3dOb2RlKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gQXBwLmdldFZpZXcoZGF0YS52aWV3KTtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcclxuXHJcbiAgICBjb25zdCByZW5kZXJSZWxhdGVkID0gKHJlc3VsdCkgPT4ge1xyXG4gICAgICBpZiAocmVzdWx0ID49IDApIHtcclxuICAgICAgICBjb25zdCBsYWJlbE5vZGUgPSAkKCcucmVsYXRlZC1pdGVtLWxhYmVsJywgcm93Tm9kZSkuZmlyc3QoKTtcclxuICAgICAgICBpZiAobGFiZWxOb2RlLmxlbmd0aCkge1xyXG4gICAgICAgICAgJCgnLmJ1c3kteHMnLCBsYWJlbE5vZGUpLnJlbW92ZSgpO1xyXG4gICAgICAgICAgbGFiZWxOb2RlLmJlZm9yZShgPHNwYW4gY2xhc3M9XCJpbmZvIGJhZGdlXCI+JHtyZXN1bHR9PC9zcGFuPmApO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ01pc3NpbmcgdGhlIFwicmVsYXRlZC1pdGVtLWxhYmVsXCIgZG9tIG5vZGUuJyk7IC8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAodmlldyAmJiBjb250ZXh0ICYmIGNvbnRleHQud2hlcmUpIHtcclxuICAgICAgb3B0aW9ucy53aGVyZSA9IGNvbnRleHQud2hlcmU7XHJcbiAgICAgIHZpZXcuZ2V0TGlzdENvdW50KG9wdGlvbnMpXHJcbiAgICAgICAgLnRoZW4ocmVuZGVyUmVsYXRlZCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZW5kZXJSZWxhdGVkKDApO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcmVtb3ZlRW50cnk6IGZ1bmN0aW9uIHJlbW92ZUVudHJ5KCkge1xyXG4gICAgY29uc3QgZW50cnkgPSB0aGlzLl9jcmVhdGVFbnRyeUZvclJlbW92ZSgpO1xyXG4gICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcbiAgICAgIGlmIChzdG9yZSkge1xyXG4gICAgICAgIHN0b3JlLnJlbW92ZShlbnRyeSkudGhlbihcclxuICAgICAgICAgIHRoaXMuX29uUmVtb3ZlU3VjY2Vzcy5iaW5kKHRoaXMpLFxyXG4gICAgICAgICAgdGhpcy5fb25SZW1vdmVFcnJvci5iaW5kKHRoaXMpXHJcbiAgICAgICAgKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgX2NyZWF0ZUVudHJ5Rm9yUmVtb3ZlOiBmdW5jdGlvbiBfY3JlYXRlRW50cnlGb3JSZW1vdmUoKSB7XHJcbiAgICBjb25zdCBlbnRyeSA9IHtcclxuICAgICAgJGtleTogdGhpcy5lbnRyeS4ka2V5LFxyXG4gICAgICAkZXRhZzogdGhpcy5lbnRyeS4kZXRhZyxcclxuICAgICAgJG5hbWU6IHRoaXMuZW50cnkuJG5hbWUsXHJcbiAgICB9O1xyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH0sXHJcbiAgX29uUmVtb3ZlU3VjY2VzczogZnVuY3Rpb24gX29uUmVtb3ZlU3VjY2VzcygpIHtcclxuICAgIGNvbm5lY3QucHVibGlzaCgnL2FwcC9yZWZyZXNoJywgW3tcclxuICAgICAgcmVzb3VyY2VLaW5kOiB0aGlzLnJlc291cmNlS2luZCxcclxuICAgIH1dKTtcclxuICAgIFJlVUkuYmFjaygpO1xyXG4gIH0sXHJcbiAgX29uUmVtb3ZlRXJyb3I6IGZ1bmN0aW9uIF9vblJlbW92ZUVycm9yKGVycm9yKSB7XHJcbiAgICBpZiAoZXJyb3IpIHtcclxuICAgICAgdGhpcy5fb25HZXRFcnJvcihudWxsLCBlcnJvcik7XHJcbiAgICB9XHJcbiAgfSxcclxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==