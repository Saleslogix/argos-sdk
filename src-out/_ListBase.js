define('argos/_ListBase', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/connect', 'dojo/string', './Utility', './ErrorManager', './View', './SearchWidget', './ConfigurableSelectionModel', './_PullToRefreshMixin', './I18n', 'argos/Convert'], function (module, exports, _declare, _lang, _connect, _string, _Utility, _ErrorManager, _View, _SearchWidget, _ConfigurableSelectionModel, _PullToRefreshMixin2, _I18n, _Convert) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _connect2 = _interopRequireDefault(_connect);

  var _string2 = _interopRequireDefault(_string);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  var _View2 = _interopRequireDefault(_View);

  var _SearchWidget2 = _interopRequireDefault(_SearchWidget);

  var _ConfigurableSelectionModel2 = _interopRequireDefault(_ConfigurableSelectionModel);

  var _PullToRefreshMixin3 = _interopRequireDefault(_PullToRefreshMixin2);

  var _I18n2 = _interopRequireDefault(_I18n);

  var _Convert2 = _interopRequireDefault(_Convert);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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

  var resource = (0, _I18n2.default)('listBase');
  var resourceSDK = (0, _I18n2.default)('sdkApplication');

  /**
   * @classdesc A List View is a view used to display a collection of entries in an easy to skim list. The List View also has a
   * selection model built in for selecting rows from the list and may be used in a number of different manners.
   * @class argos._ListBase
   * @extends argos.View
   * @mixins argos._PullToRefreshMixin
   */
  var __class = (0, _declare2.default)('argos._ListBase', [_View2.default, _PullToRefreshMixin3.default], /** @lends argos._ListBase# */{
    /**
     * @property {Object}
     * Creates a setter map to html nodes, namely:
     *
     * * listContent => contentNode's innerHTML
     * * remainingContent => remainingContentNode's innerHTML
     */
    viewSettingsText: resourceSDK.viewSettingsText,
    attributeMap: {
      listContent: {
        node: 'contentNode',
        type: 'innerHTML'
      },
      remainingContent: {
        node: 'remainingContentNode',
        type: 'innerHTML'
      },
      title: _View2.default.prototype.attributeMap.title,
      selected: _View2.default.prototype.attributeMap.selected
    },
    /**
     * @property {Object}
     *
     *  Maps to Utility Class
     */
    utility: _Utility2.default,
    /**
     * @property {Simplate}
     * The template used to render the view's main DOM element when the view is initialized.
     * This template includes emptySelectionTemplate, moreTemplate and listActionTemplate.
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
    widgetTemplate: new Simplate(['\n    <div id="{%= $.id %}" data-title="{%= $.titleText %}" class="list {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>\n      <div class="page-container scrollable{% if ($$.isNavigationDisabled()) { %} is-multiselect is-selectable is-toolbar-open {% } %} {% if (!$$.isCardView) { %} listview {% } %}"\n        {% if ($$.isNavigationDisabled()) { %}\n        data-selectable="multiple"\n        {% } else { %}\n        data-selectable="false"\n        {% } %}\n        data-dojo-attach-point="scrollerNode">\n          <div class="toolbar has-title-button" role="toolbar" aria-label="List Toolbar">\n            <div class="title">\n              <h1></h1>\n            </div>\n            <div class="buttonset" data-dojo-attach-point="toolNode">\n              {% if($.enableSearch) { %}\n              <div data-dojo-attach-point="searchNode"></div>\n              {% } %}\n              {% if($.hasSettings) { %}\n              <button class="btn" title="{%= $.viewSettingsText %}" type="button" data-action="openSettings" aria-controls="list_toolbar_setting_{%= $.id %}">\n                <svg class="icon" role="presentation"><use xlink:href="#icon-settings"></use></svg>\n                <span class="audible">List Settings</span>\n              </button>\n              {% } %}\n            </div>\n          </div>\n          {% if ($$.isNavigationDisabled()) { %}\n          <div class="contextual-toolbar toolbar is-hidden">\n            <div class="buttonset">\n              <button class="btn-tertiary" title="Assign Selected Items" type="button">Assign</button>\n              <button class="btn-tertiary" id="remove" title="Remove Selected Items" type="button">Remove</button>\n            </div>\n          </div>\n          {% } %}\n        {%! $.emptySelectionTemplate %}\n        {% if ($$.isCardView) { %}\n          <div role="presentation" data-dojo-attach-point="contentNode"></div>\n        {% } else { %}\n          <ul class="list-content" role="presentation" data-dojo-attach-point="contentNode"></ul>\n        {% } %}\n        {%! $.moreTemplate %}\n      </div>\n    </div>\n    ']),
    /**
     * @property {Simplate}
     * The template used to render the loading message when the view is requesting more data.
     *
     * The default template uses the following properties:
     *
     *      name                description
     *      ----------------------------------------------------------------
     *      loadingText         The text to display while loading.
     */
    loadingTemplate: new Simplate(['<div class="busy-indicator-container" aria-live="polite">', '<div class="busy-indicator active">', '<div class="bar one"></div>', '<div class="bar two"></div>', '<div class="bar three"></div>', '<div class="bar four"></div>', '<div class="bar five"></div>', '</div>', '<span>{%: $.loadingText %}</span>', '</div>']),
    /**
     * @property {Simplate}
     * The template used to render the pager at the bottom of the view.  This template is not directly rendered, but is
     * included in {@link #viewTemplate}.
     *
     * The default template uses the following properties:
     *
     *      name                description
     *      ----------------------------------------------------------------
     *      moreText            The text to display on the more button.
     *
     * The default template exposes the following actions:
     *
     * * more
     */
    moreTemplate: new Simplate(['<div class="list-more" data-dojo-attach-point="moreNode">', '<p class="list-remaining"><span data-dojo-attach-point="remainingContentNode"></span></p>', '<button class="btn" data-action="more">', '<span>{%= $.moreText %}</span>', '</button>', '</div>']),
    /**
     * @property {Boolean}
     * Indicates whether a template is a card view or a list
     */
    isCardView: true,

    /**
     * @property {Boolean}
     * Indicates if there is a list settings modal.
     */
    hasSettings: false,
    /**
     * listbase calculated property based on actions available
     */
    visibleActions: [],
    /**
     * @property {Simplate}
     * Template used on lookups to have empty Selection option.
     * This template is not directly rendered but included in {@link #viewTemplate}.
     *
     * The default template uses the following properties:
     *
     *      name                description
     *      ----------------------------------------------------------------
     *      emptySelectionText  The text to display on the empty Selection button.
     *
     * The default template exposes the following actions:
     *
     * * emptySelection
     */
    emptySelectionTemplate: new Simplate(['<div class="list-empty-opt" data-dojo-attach-point="emptySelectionNode">', '<button class="button" data-action="emptySelection">', '<span>{%= $.emptySelectionText %}</span>', '</button>', '</div>']),
    /**
     * @property {Simplate}
     * The template used to render a row in the view.  This template includes {@link #itemTemplate}.
     */
    rowTemplate: new Simplate(['\n    <div data-action="activateEntry" data-key="{%= $$.getItemActionKey($) %}" data-descriptor="{%: $$.getItemDescriptor($) %}">\n      <div class="widget">\n        <div class="widget-header">\n          <h2 class="widget-title">{%: $$.getTitle($, $$.labelProperty) %}</h2>\n          {% if($$.visibleActions.length > 0 && $$.enableActions) { %}\n            <button class="btn-actions" type="button" data-key="{%= $$.getItemActionKey($) %}">\n              <span class="audible">Actions</span>\n              <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n                <use xlink:href="#icon-more"></use>\n              </svg>\n            </button>\n            {%! $$.listActionTemplate %}\n          {% } %}\n        </div>\n        <div class="card-content">\n          {%! $$.itemRowContentTemplate %}\n        </div>\n      </div>\n    </div>\n    ']),
    liRowTemplate: new Simplate(['<li data-action="activateEntry" data-key="{%= $[$$.idProperty] %}" data-descriptor="{%: $$.utility.getValue($, $$.labelProperty) %}">', '{% if ($$.icon || $$.selectIcon) { %}', '<button type="button" class="btn-icon hide-focus list-item-selector" data-action="selectEntry">', '<svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n        <use xlink:href="#icon-{%= $$.icon || $$.selectIcon %}" />\n      </svg>', '</button>', '{% } %}', '</button>', '<div class="list-item-content">{%! $$.itemTemplate %}</div>', '</li>']),
    /**
     * @cfg {Simplate}
     * The template used to render the content of a row.  This template is not directly rendered, but is
     * included in {@link #rowTemplate}.
     *
     * This property should be overridden in the derived class.
     * @template
     */
    itemTemplate: new Simplate(['<p>{%: $[$$.labelProperty] %}</p>', '<p class="micro-text">{%: $[$$.idProperty] %}</p>']),
    /**
     * @property {Simplate}
     * The template used to render a message if there is no data available.
     * The default template uses the following properties:
     *
     *      name                description
     *      ----------------------------------------------------------------
     *      noDataText          The text to display if there is no data.
     */
    noDataTemplate: new Simplate(['<div class="no-data">', '<p>{%= $.noDataText %}</p>', '</div>']),
    /**
     * @property {Simplate}
     * The template used to render the single list action row.
     */
    listActionTemplate: new Simplate(['<ul id="popupmenu-{%= $$.getItemActionKey($) %}" data-dojo-attach-point="actionsNode" class="popupmenu">', '{%! $$.loadingTemplate %}', '</ul>']),
    /**
     * @property {Simplate}
     * The template used to render a list action item.
     * The default template uses the following properties:
     *
     *      name                description
     *      ----------------------------------------------------------------
     *      actionIndex         The correlating index number of the action collection
     *      title               Text used for ARIA-labeling
     *      icon                Relative path to the icon to use
     *      cls                 CSS class to use instead of an icon
     *      id                  Unique name of action, also used for alt image text
     *      label               Text added below the icon
     */
    listActionItemTemplate: new Simplate(['\n    <li><a href="#" data-action="invokeActionItem" data-id="{%= $.actionIndex %}">{%: $.label %}</a></li>']),
    /**
     * @property {Simplate}
     * The template used to render row content template
     */
    itemRowContentTemplate: new Simplate(['<div class="top_item_indicators list-item-indicator-content"></div>', '<div class="list-item-content">{%! $$.itemTemplate %}</div>', '<div class="bottom_item_indicators list-item-indicator-content"></div>', '<div class="list-item-content-related"></div>']),
    itemIconTemplate: new Simplate(['{% if ($$.getItemIconClass($)) { %}', '<button type="button" class="btn-icon hide-focus" class="list-item-selector button">\n        <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n            <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-{%= $$.getItemIconClass($) || \'alert\' %}"></use>\n        </svg>\n    </button>', '{% } else if ($$.getItemIconSource($)) { %}', '<button data-action="selectEntry" class="list-item-selector button">', '<img id="list-item-image_{%: $.$key %}" src="{%: $$.getItemIconSource($) %}" alt="{%: $$.getItemIconAlt($) %}" class="icon" />', '</button>', '{% } %}']),
    /**
     * @property {Simplate}
     * The template used to render item indicator
     */
    itemIndicatorTemplate: new Simplate(['<button type="button" class="btn-icon hide-focus" title="{%= $.title %}">', '<svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n        <use xlink:href="#icon-{%= $.cls %}" />\n      </svg>', '</button>']),
    /**
     * @property {HTMLElement}
     * Attach point for the main view content
     */
    contentNode: null,
    /**
     * @property {HTMLElement}
     * Attach point for the remaining entries content
     */
    remainingContentNode: null,
    /**
     * @property {HTMLElement}
     * Attach point for the search widget
     */
    searchNode: null,
    /**
     * @property {HTMLElement}
     * Attach point for the empty, or no selection, container
     */
    emptySelectionNode: null,
    /**
     * @property {HTMLElement}
     * Attach point for the remaining entries container
     */
    remainingNode: null,
    /**
     * @property {HTMLElement}
     * Attach point for the request more entries container
     */
    moreNode: null,
    /**
     * @property {HTMLElement}
     * Attach point for the list actions container
     */
    actionsNode: null,

    /**
     * @cfg {String} id
     * The id for the view, and it's main DOM element.
     */
    id: 'generic_list',

    /**
     * @cfg {String}
     * The SData resource kind the view is responsible for.  This will be used as the default resource kind
     * for all SData requests.
     */
    resourceKind: '',
    store: null,
    entries: null,
    /**
     * @property {Number}
     * The number of entries to request per SData payload.
     */
    pageSize: 21,
    /**
     * @property {Boolean}
     * Controls the addition of a search widget.
     */
    enableSearch: true,
    /**
     * @property {Boolean}
     * Flag that determines if the list actions panel should be in use.
     */
    enableActions: false,
    /**
     * @property {Boolean}
     * Controls the visibility of the search widget.
     */
    hideSearch: false,
    /**
     * @property {Boolean}
     * True to allow selections via the SelectionModel in the view.
     */
    allowSelection: false,
    /**
     * @property {Boolean}
     * True to clear the selection model when the view is shown.
     */
    autoClearSelection: true,
    /**
     * @property {String/View}
     * The id of the detail view, or view instance, to show when a row is clicked.
     */
    detailView: null,

    /**
     * @property {String}
     * The id of the configure view for quick action preferences
     */
    quickActionConfigureView: 'configure_quickactions',
    /**
     * @property {String}
     * The view id to show if there is no `insertView` specified, when
     * the {@link #navigateToInsertView} action is invoked.
     */
    editView: null,
    /**
     * @property {String}
     * The view id to show when the {@link #navigateToInsertView} action is invoked.
     */
    insertView: null,
    /**
     * @property {String}
     * The view id to show when the {@link #navigateToContextView} action is invoked.
     */
    contextView: false,
    /**
     * @property {Object}
     * A dictionary of hash tag search queries.  The key is the hash tag, without the symbol, and the value is
     * either a query string, or a function that returns a query string.
     */
    hashTagQueries: null,
    /**
     * The text displayed in the more button.
     * @type {String}
     */
    moreText: resource.moreText,
    /**
     * @property {String}
     * The text displayed in the emptySelection button.
     */
    emptySelectionText: resource.emptySelectionText,
    /**
     * @property {String}
     * The text displayed as the default title.
     */
    titleText: resource.titleText,
    /**
     * @property {String}
     * The text displayed for quick action configure.
     */
    configureText: resource.configureText,
    /**
     * @property {String}
     * The error message to display if rendering a row template is not successful.
     */
    errorRenderText: resource.errorRenderText,
    /**
     * @property {Simplate}
     *
     */
    rowTemplateError: new Simplate(['<div data-action="activateEntry" data-key="{%= $[$$.idProperty] %}" data-descriptor="{%: $[$$.labelProperty] %}">', '<div class="list-item-content">{%: $$.errorRenderText %}</div>', '</div>']),
    /**
     * @property {String}
     * The format string for the text displayed for the remaining record count.  This is used in a {@link String#format} call.
     */
    remainingText: resource.remainingText,
    /**
     * @property {String}
     * The text displayed on the cancel button.
     * @deprecated
     */
    cancelText: resource.cancelText,
    /**
     * @property {String}
     * The text displayed on the insert button.
     * @deprecated
     */
    insertText: resource.insertText,
    /**
     * @property {String}
     * The text displayed when no records are available.
     */
    noDataText: resource.noDataText,
    /**
     * @property {String}
     * The text displayed when data is being requested.
     */
    loadingText: resource.loadingText,
    /**
     * @property {String}
     * The text displayed in tooltip for the new button.
     */
    newTooltipText: resource.newTooltipText,
    /**
     * @property {String}
     * The text displayed in tooltip for the refresh button.
     */
    refreshTooltipText: resource.refreshTooltipText,
    /**
     * @property {String}
     * The customization identifier for this class. When a customization is registered it is passed
     * a path/identifier which is then matched to this property.
     */
    customizationSet: 'list',
    /**
     * @property {String}
     * The relative path to the checkmark or select icon for row selector
     */
    selectIcon: 'check',
    /**
     * @property {String}
     * CSS class to use for checkmark or select icon for row selector. Overrides selectIcon.
     */
    selectIconClass: '',
    /**
     * @property {Object}
     * The search widget instance for the view
     */
    searchWidget: null,
    /**
     * @property {SearchWidget}
     * The class constructor to use for the search widget
     */
    searchWidgetClass: _SearchWidget2.default,
    /**
     * @property {Boolean}
     * Flag to indicate the default search term has been set.
     */
    defaultSearchTermSet: false,

    /**
     * @property {String}
     * The default search term to use
     */
    defaultSearchTerm: '',

    /**
     * @property {String}
     * The current search term being used for the current requestData().
     */
    currentSearchExpression: '',
    /**
     * @property {Object}
     * The selection model for the view
     */
    _selectionModel: null,
    /**
     * @property {Object}
     * The selection event connections
     */
    _selectionConnects: null,
    /**
     * @property {Object}
     * The toolbar layout definition for all toolbar entries.
     */
    tools: null,
    /**
     * The list action layout definition for the list action bar.
     */
    actions: null,
    /**
     * @property {Boolean} If true, will remove the loading button and auto fetch more data when the user scrolls to the bottom of the page.
     */
    continuousScrolling: true,
    /**
     * @property {Boolean} Indicates if the list is loading
     */
    listLoading: false,
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
    // Store properties
    itemsProperty: '',
    idProperty: '',
    labelProperty: '',
    entityProperty: '',
    versionProperty: '',
    isRefreshing: false,
    /**
     * Sets the title to card
     */
    getTitle: function getTitle(entry, labelProperty) {
      return this.utility.getValue(entry, labelProperty);
    },
    /**
     * Setter method for the selection model, also binds the various selection model select events
     * to the respective List event handler for each.
     * @param {SelectionModel} selectionModel The selection model instance to save to the view
     * @private
     */
    _setSelectionModelAttr: function _setSelectionModelAttr(selectionModel) {
      if (this._selectionConnects) {
        this._selectionConnects.forEach(this.disconnect, this);
      }

      this._selectionModel = selectionModel;
      this._selectionConnects = [];

      if (this._selectionModel) {
        this._selectionConnects.push(this.connect(this._selectionModel, 'onSelect', this._onSelectionModelSelect), this.connect(this._selectionModel, 'onDeselect', this._onSelectionModelDeselect), this.connect(this._selectionModel, 'onClear', this._onSelectionModelClear));
      }
    },
    /**
     * Getter nmethod for the selection model
     * @return {SelectionModel}
     * @private
     */
    _getSelectionModelAttr: function _getSelectionModelAttr() {
      return this._selectionModel;
    },
    constructor: function constructor(options) {
      this.entries = {};
      this._loadedSelections = {};

      // backward compatibility for disableRightDrawer property. To be removed after 4.0
      if (options && options.disableRightDrawer) {
        console.warn('disableRightDrawer property is depracated. Use hasSettings property instead. disableRightDrawer = !hasSettings'); //eslint-disable-line
        this.hasSettings = false;
      }
    },
    initSoho: function initSoho() {
      var _this = this;

      var toolbar = $('.toolbar', this.domNode).first();
      toolbar.toolbar();
      this.toolbar = toolbar.data('toolbar');
      $('[data-action=openSettings]', this.domNode).on('click', function () {
        _this.openSettings();
      });
    },
    openSettings: function openSettings() {},
    updateSoho: function updateSoho() {
      this.toolbar.updated();
    },
    _onListViewSelected: function _onListViewSelected() {
      console.dir(arguments); //eslint-disable-line
    },
    postCreate: function postCreate() {
      this.inherited(postCreate, arguments);

      if (this._selectionModel === null) {
        this.set('selectionModel', new _ConfigurableSelectionModel2.default());
      }
      this.subscribe('/app/refresh', this._onRefresh);

      if (this.enableSearch) {
        var SearchWidgetCtor = _lang2.default.isString(this.searchWidgetClass) ? _lang2.default.getObject(this.searchWidgetClass, false) : this.searchWidgetClass;

        this.searchWidget = this.searchWidget || new SearchWidgetCtor({
          class: 'list-search',
          owner: this,
          onSearchExpression: this._onSearchExpression.bind(this)
        });
        this.searchWidget.placeAt(this.searchNode, 'replace');
      } else {
        this.searchWidget = null;
      }

      if (this.hideSearch || !this.enableSearch) {
        $(this.domNode).addClass('list-hide-search');
      }

      this.clear();

      this.initPullToRefresh(this.scrollerNode);
    },
    shouldStartPullToRefresh: function shouldStartPullToRefresh() {
      // Get the base results
      var shouldStart = this.inherited(shouldStartPullToRefresh, arguments);
      var selected = $(this.domNode).attr('selected');
      var actionNode = $(this.domNode).find('.btn-actions.is-open');
      var actionsOpen = actionNode.length > 0;
      return shouldStart && selected === 'selected' && !this.listLoading && !actionsOpen;
    },
    forceRefresh: function forceRefresh() {
      this.clear();
      this.refreshRequired = true;
      this.refresh();
    },
    onPullToRefreshComplete: function onPullToRefreshComplete() {
      this.forceRefresh();
    },
    onConnectionStateChange: function onConnectionStateChange(state) {
      if (state === true && this.enableOfflineSupport) {
        this.refreshRequired = true;
      }
    },
    /**
     * Called on application startup to configure the search widget if present and create the list actions.
     */
    startup: function startup() {
      this.inherited(startup, arguments);

      if (this.searchWidget) {
        this.searchWidget.configure({
          hashTagQueries: this._createCustomizedLayout(this.createHashTagQueryLayout(), 'hashTagQueries'),
          formatSearchQuery: this.formatSearchQuery.bind(this)
        });
      }
    },
    /**
     * Extends dijit Widget to destroy the search widget before destroying the view.
     */
    destroy: function destroy() {
      if (this.searchWidget) {
        if (!this.searchWidget._destroyed) {
          this.searchWidget.destroyRecursive();
        }

        delete this.searchWidget;
      }

      delete this.store;
      this.inherited(destroy, arguments);
    },
    _getStoreAttr: function _getStoreAttr() {
      return this.store || (this.store = this.createStore());
    },
    /**
     * Shows overrides the view class to set options for the list view and then calls the inherited show method on the view.
     * @param {Object} options The navigation options passed from the previous view.
     * @param transitionOptions {Object} Optional transition object that is forwarded to ReUI.
     */
    show: function show(options /* , transitionOptions*/) {
      if (options) {
        if (options.resetSearch) {
          this.defaultSearchTermSet = false;
        }

        if (options.allowEmptySelection === false && this._selectionModel) {
          this._selectionModel.requireSelection = true;
        }
      }

      this.inherited(show, arguments);
    },
    /**
     * Sets and returns the toolbar item layout definition, this method should be overriden in the view
     * so that you may define the views toolbar entries.
     * @return {Object} this.tools
     * @template
     */
    createToolLayout: function createToolLayout() {
      var toolbar = this.tools || (this.tools = {
        tbar: [{
          id: 'new',
          svg: 'add',
          title: this.newTooltipText,
          action: 'navigateToInsertView',
          security: this.app.getViewSecurity(this.insertView, 'insert')
        }]
      });
      if (toolbar.tbar && !this._refreshAdded && !window.App.supportsTouch()) {
        this.tools.tbar.push({
          id: 'refresh',
          svg: 'refresh',
          title: this.refreshTooltipText,
          action: '_refreshList'
        });
        this._refreshAdded = true;
      }
      return this.tools;
    },
    createErrorHandlers: function createErrorHandlers() {
      this.errorHandlers = this.errorHandlers || [{
        name: 'Aborted',
        test: function testAborted(error) {
          return error.aborted;
        },
        handle: function handleAborted(error, next) {
          this.clear();
          this.refreshRequired = true;
          next();
        }
      }, {
        name: 'AlertError',
        test: function testError(error) {
          return !error.aborted;
        },
        handle: function handleError(error, next) {
          alert(this.getErrorMessage(error)); // eslint-disable-line
          next();
        }
      }, {
        name: 'CatchAll',
        test: function testCatchAll() {
          return true;
        },
        handle: function handleCatchAll(error, next) {
          this._logError(error);
          this._clearLoading();
          next();
        }
      }];

      return this.errorHandlers;
    },
    /**
     * Sets and returns the list-action actions layout definition, this method should be overriden in the view
     * so that you may define the action entries for that view.
     * @return {Object} this.acttions
     */
    createActionLayout: function createActionLayout() {
      return this.actions || [];
    },
    /**
     * Creates the action bar and adds it to the DOM. Note that it replaces `this.actions` with the passed
     * param as the passed param should be the result of the customization mixin and `this.actions` needs to be the
     * final actions state.
     * @param {Object[]} actions
     */
    createActions: function createActions(a) {
      var _this2 = this;

      var actions = a;
      this.actions = actions.reduce(this._removeActionDuplicates, []);
      this.visibleActions = [];

      this.ensureQuickActionPrefs();

      // Pluck out our system actions that are NOT saved in preferences
      var systemActions = actions.filter(function (action) {
        return action && action.systemAction;
      });

      systemActions = systemActions.reduce(this._removeActionDuplicates, []);

      // Grab quick actions from the users preferences (ordered and made visible according to user)
      var prefActions = void 0;
      if (this.app.preferences && this.app.preferences.quickActions) {
        prefActions = this.app.preferences.quickActions[this.id];
      }

      if (systemActions && prefActions) {
        // Display system actions first, then the order of what the user specified
        actions = systemActions.concat(prefActions);
      }

      var visibleActions = [];

      var _loop = function _loop(i) {
        var action = actions[i];

        if (!action.visible) {
          return 'continue';
        }

        if (!action.security) {
          var orig = a.find(function (x) {
            return x.id === action.id;
          });
          if (orig && orig.security) {
            action.security = orig.security; // Reset the security value
          }
        }

        var options = {
          actionIndex: visibleActions.length,
          hasAccess: !action.security || action.security && _this2.app.hasAccessTo(_this2.expandExpression(action.security)) ? true : false
        };

        _lang2.default.mixin(action, options);

        var actionTemplate = action.template || _this2.listActionItemTemplate;
        action.templateDom = $(actionTemplate.apply(action, action.id));

        visibleActions.push(action);
      };

      for (var i = 0; i < actions.length; i++) {
        var _ret = _loop(i);

        if (_ret === 'continue') continue;
      }
      this.visibleActions = visibleActions;
    },
    createSystemActionLayout: function createSystemActionLayout() {
      var actions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      var systemActions = actions.filter(function (action) {
        return action.systemAction === true;
      });

      var others = actions.filter(function (action) {
        return !action.systemAction;
      });

      if (!others.length) {
        return [];
      }

      if (systemActions.length) {
        return systemActions.concat(others);
      }

      return [{
        id: '__editPrefs__',
        cls: 'settings',
        label: this.configureText,
        action: 'configureQuickActions',
        systemAction: true,
        visible: true
      }].concat(others);
    },
    configureQuickActions: function configureQuickActions() {
      var view = App.getView(this.quickActionConfigureView);
      if (view) {
        view.show({
          viewId: this.id,
          actions: this.actions.filter(function (action) {
            // Exclude system actions
            return action && action.systemAction !== true;
          })
        });
      }
    },
    selectEntrySilent: function selectEntrySilent(key) {
      var enableActions = this.enableActions; // preserve the original value
      var selectionModel = this.get('selectionModel');
      var selection = void 0;

      if (key) {
        this.enableActions = false; // Set to false so the quick actions menu doesn't pop up
        selectionModel.clear();
        selectionModel.toggle(key, this.entries[key]);
        var selectedItems = selectionModel.getSelections();
        this.enableActions = enableActions;

        // We know we are single select, so just grab the first selection
        for (var prop in selectedItems) {
          if (selectedItems.hasOwnProperty(prop)) {
            selection = selectedItems[prop];
            break;
          }
        }
      }

      return selection;
    },
    invokeActionItemBy: function invokeActionItemBy(actionPredicate, key) {
      var _this3 = this;

      var actions = this.visibleActions.filter(actionPredicate);
      var selection = this.selectEntrySilent(key);
      this.checkActionState();
      actions.forEach(function (action) {
        _this3._invokeAction(action, selection);
      });
    },
    /**
     * This is the data-action handler for list-actions, it will locate the action instance viw the data-id attribute
     * and invoke either the `fn` with `scope` or the named `action` on the current view.
     *
     * The resulting function being called will be passed not only the action item definition but also
     * the first (only) selection from the lists selection model.
     *
     * @param {Object} parameters Collection of data- attributes already gathered from the node
     * @param {Event} evt The click/tap event
     * @param {HTMLElement} node The node that invoked the action
     */
    invokeActionItem: function invokeActionItem(parameters, evt, node) {
      var popupmenu = $(node).parent('li').parent('.actions-row').parent('.popupmenu-wrapper').prev().data('popupmenu');
      if (popupmenu) {
        setTimeout(function () {
          popupmenu.close();
        }, 100);
      }

      var index = parameters.id;
      var action = this.visibleActions[index];
      var selectedItems = this.get('selectionModel').getSelections();
      var selection = null;

      for (var key in selectedItems) {
        if (selectedItems.hasOwnProperty(key)) {
          selection = selectedItems[key];
          this._selectionModel.deselect(key);
          break;
        }
      }
      this._invokeAction(action, selection);
    },
    _invokeAction: function _invokeAction(action, selection) {
      if (!action.isEnabled) {
        return;
      }

      if (action.fn) {
        action.fn.call(action.scope || this, action, selection);
      } else {
        if (action.action) {
          if (this.hasAction(action.action)) {
            this.invokeAction(action.action, action, selection);
          }
        }
      }
    },
    /**
     * Called when showing the action bar for a newly selected row, it sets the disabled state for each action
     * item using the currently selected row as context by passing the action instance the selected row to the
     * action items `enabled` property.
     */
    checkActionState: function checkActionState(rowNode) {
      var selectedItems = this.get('selectionModel').getSelections();
      var selection = null;

      for (var key in selectedItems) {
        if (selectedItems.hasOwnProperty(key)) {
          selection = selectedItems[key];
          break;
        }
      }

      this._applyStateToActions(selection, rowNode);
    },
    getQuickActionPrefs: function getQuickActionPrefs() {
      return this.app && this.app.preferences && this.app.preferences.quickActions;
    },
    _removeActionDuplicates: function _removeActionDuplicates(acc, cur) {
      var hasID = acc.some(function (item) {
        return item.id === cur.id;
      });

      if (!hasID) {
        acc.push(cur);
      }

      return acc;
    },
    ensureQuickActionPrefs: function ensureQuickActionPrefs() {
      var appPrefs = this.app && this.app.preferences;
      var actionPrefs = this.getQuickActionPrefs();
      var filtered = this.actions.filter(function (action) {
        return action && action.systemAction !== true;
      });

      if (!this.actions || !appPrefs) {
        return;
      }

      if (!actionPrefs) {
        appPrefs.quickActions = {};
        actionPrefs = appPrefs.quickActions;
      }

      // If it doesn't exist, or there is a count mismatch (actions created on upgrades perhaps?)
      // re-create the preferences store
      if (!actionPrefs[this.id] || actionPrefs[this.id] && actionPrefs[this.id].length !== filtered.length) {
        actionPrefs[this.id] = filtered.map(function (action) {
          action.visible = true;
          return action;
        });

        this.app.persistPreferences();
      }
    },
    /**
     * Called from checkActionState method and sets the state of the actions from what was selected from the selected row, it sets the disabled state for each action
     * item using the currently selected row as context by passing the action instance the selected row to the
     * action items `enabled` property.
     * @param {Object} selection
     */
    _applyStateToActions: function _applyStateToActions(selection, rowNode) {
      var actionRow = void 0;
      if (rowNode) {
        actionRow = $(rowNode).find('.actions-row')[0];
        $(actionRow).empty();
      }

      for (var i = 0; i < this.visibleActions.length; i++) {
        // The visible action is from our local storage preferences, where the action from the layout
        // contains functions that will get stripped out converting it to JSON, get the original action
        // and mix it into the visible so we can work with it.
        // TODO: This will be a problem throughout visible actions, come up with a better solution
        var visibleAction = this.visibleActions[i];
        var _action = _lang2.default.mixin(visibleAction, this._getActionById(visibleAction.id));

        _action.isEnabled = typeof _action.enabled === 'undefined' ? true : this.expandExpression(_action.enabled, _action, selection);

        if (!_action.hasAccess) {
          _action.isEnabled = false;
        }
        if (rowNode) {
          $(visibleAction.templateDom).clone().toggleClass('toolButton-disabled', !_action.isEnabled).appendTo(actionRow);
        }
      }

      if (rowNode) {
        var popupmenuNode = $(rowNode).find('.btn-actions')[0];
        var popupmenu = $(popupmenuNode).data('popupmenu');
        setTimeout(function () {
          popupmenu.position();
        }, 1);
      }
    },
    _getActionById: function _getActionById(id) {
      return this.actions.filter(function (action) {
        return action && action.id === id;
      })[0];
    },
    /**
     * Handler for showing the list-action panel/bar - it needs to do several things:
     *
     * 1. Check each item for context-enabledment
     * 1. Move the action panel to the current row and show it
     * 1. Adjust the scrolling if needed (if selected row is at bottom of screen, the action-bar shows off screen
     * which is bad)
     *
     * @param {HTMLElement} rowNode The currently selected row node
     */
    showActionPanel: function showActionPanel(rowNode) {
      var actionNode = $(rowNode).find('.actions-row');
      this.checkActionState(rowNode);
      this.onApplyRowActionPanel(actionNode, rowNode);
    },
    onApplyRowActionPanel: function onApplyRowActionPanel() /* actionNodePanel, rowNode*/{},
    /**
     * Sets the `this.options.source` to passed param after adding the views resourceKind. This function is used so
     * that when the next view queries the navigation context we can include the passed param as a data point.
     *
     * @param {Object} source The object to set as the options.source.
     */
    setSource: function setSource(source) {
      _lang2.default.mixin(source, {
        resourceKind: this.resourceKind
      });

      this.options.source = source;
    },
    /**
     * @deprecated
     * Hides the passed list-action row/panel by removing the selected styling
     * @param {HTMLElement} rowNode The currently selected row.
     */
    hideActionPanel: function hideActionPanel() {},
    /**
     * Determines if the view is a navigatible view or a selection view by returning `this.selectionOnly` or the
     * navigation `this.options.selectionOnly`.
     * @return {Boolean}
     */
    isNavigationDisabled: function isNavigationDisabled() {
      return this.options && this.options.selectionOnly || this.selectionOnly;
    },
    /**
     * Determines if the selections are disabled by checking the `allowSelection` and `enableActions`
     * @return {Boolean}
     */
    isSelectionDisabled: function isSelectionDisabled() {
      return !(this.options && this.options.selectionOnly || this.enableActions || this.allowSelection);
    },
    /**
     * Handler for when the selection model adds an item. Adds the selected state to the row or shows the list
     * actions panel.
     * @param {String} key The extracted key from the selected row.
     * @param {Object} data The actual row's matching data point
     * @param {String/HTMLElement} tag An indentifier, may be the actual row node or some other id.
     * @private
     */
    _onSelectionModelSelect: function _onSelectionModelSelect(key, data, tag) {
      // eslint-disable-line
      var node = $(tag);

      if (this.enableActions) {
        this.showActionPanel(node.get(0));
        return;
      }

      node.addClass('list-item-selected');
      node.removeClass('list-item-de-selected');
    },
    /**
     * Handler for when the selection model removes an item. Removes the selected state to the row or hides the list
     * actions panel.
     * @param {String} key The extracted key from the de-selected row.
     * @param {Object} data The actual row's matching data point
     * @param {String/HTMLElement} tag An indentifier, may be the actual row node or some other id.
     * @private
     */
    _onSelectionModelDeselect: function _onSelectionModelDeselect(key, data, tag) {
      var node = $(tag) || $('[data-key="' + key + '"]', this.contentNode).first();
      if (!node.length) {
        return;
      }

      node.removeClass('list-item-selected');
      node.addClass('list-item-de-selected');
    },
    /**
     * Handler for when the selection model clears the selections.
     * @private
     */
    _onSelectionModelClear: function _onSelectionModelClear() {},

    /**
     * Cache of loaded selections
     */
    _loadedSelections: null,

    /**
     * Attempts to activate entries passed in `this.options.previousSelections` where previousSelections is an array
     * of data-keys or data-descriptors to search the list rows for.
     * @private
     */
    _loadPreviousSelections: function _loadPreviousSelections() {
      var previousSelections = this.options && this.options.previousSelections;
      if (previousSelections) {
        for (var i = 0; i < previousSelections.length; i++) {
          var key = previousSelections[i];

          // Set initial state of previous selection to unloaded (false)
          if (!this._loadedSelections.hasOwnProperty(key)) {
            this._loadedSelections[key] = false;
          }

          var row = $('[data-key="' + key + '"], [data-descriptor="' + key + '"]', this.contentNode)[0];

          if (row && this._loadedSelections[key] !== true) {
            this.activateEntry({
              key: key,
              descriptor: key,
              $source: row
            });

            // Flag that this previous selection has been loaded, since this function can be called
            // multiple times, while paging through long lists. clear() will reset.
            this._loadedSelections[key] = true;
          }
        }
      }
    },
    applyRowIndicators: function applyRowIndicators(entry, rowNode) {
      if (this.itemIndicators && this.itemIndicators.length > 0) {
        var topIndicatorsNode = $('.top_item_indicators', rowNode);
        var bottomIndicatorsNode = $('.bottom_item_indicators', rowNode);
        if (bottomIndicatorsNode[0] && topIndicatorsNode[0]) {
          if (bottomIndicatorsNode[0].childNodes.length === 0 && topIndicatorsNode[0].childNodes.length === 0) {
            var customizeLayout = this._createCustomizedLayout(this.itemIndicators, 'indicators');
            this.createIndicators(topIndicatorsNode[0], bottomIndicatorsNode[0], customizeLayout, entry);
          }
        }
      }
    },
    createIndicatorLayout: function createIndicatorLayout() {
      return this.itemIndicators || (this.itemIndicators = [{
        id: 'touched',
        cls: 'flag',
        onApply: function onApply(entry, parent) {
          this.isEnabled = parent.hasBeenTouched(entry);
        }
      }]);
    },
    hasBeenTouched: function hasBeenTouched(entry) {
      if (entry.ModifyDate) {
        var modifiedDate = moment(_Convert2.default.toDateFromString(entry.ModifyDate));
        var currentDate = moment().endOf('day');
        var weekAgo = moment().subtract(1, 'weeks');

        return modifiedDate.isAfter(weekAgo) && modifiedDate.isBefore(currentDate);
      }
      return false;
    },
    _refreshList: function _refreshList() {
      this.forceRefresh();
    },
    /**
     * Returns this.options.previousSelections that have not been loaded or paged to
     * @return {Array}
     */
    getUnloadedSelections: function getUnloadedSelections() {
      var _this4 = this;

      return Object.keys(this._loadedSelections).filter(function (key) {
        return _this4._loadedSelections[key] === false;
      });
    },
    /**
     * Handler for the global `/app/refresh` event. Sets `refreshRequired` to true if the resourceKind matches.
     * @param {Object} options The object published by the event.
     * @private
     */
    _onRefresh: function _onRefresh() /* options*/{},
    onScroll: function onScroll() /* evt*/{
      var scrollerNode = this.scrollerNode;
      var height = $(scrollerNode).height(); // viewport height (what user sees)
      var scrollHeight = scrollerNode.scrollHeight; // Entire container height
      var scrollTop = scrollerNode.scrollTop; // How far we are scrolled down
      var remaining = scrollHeight - scrollTop; // Height we have remaining to scroll
      var selected = $(this.domNode).attr('selected');
      var diff = Math.abs(remaining - height);

      // Start auto fetching more data if the user is on the last half of the remaining screen
      if (diff <= height / 2) {
        if (selected === 'selected' && this.hasMoreData() && !this.listLoading) {
          this.more();
        }
      }
    },
    /**
     * Handler for the select or action node data-action. Finds the nearest node with the data-key attribute and
     * toggles it in the views selection model.
     *
     * If singleSelectAction is defined, invoke the singleSelectionAction.
     *
     * @param {Object} params Collection of `data-` attributes from the node.
     * @param {Event} evt The click/tap event.
     * @param {HTMLElement} node The element that initiated the event.
     */
    selectEntry: function selectEntry(params) {
      var row = $('[data-key=\'' + params.key + '\']', this.contentNode).first();
      var key = row ? row.attr('data-key') : false;

      if (this._selectionModel && key) {
        this._selectionModel.select(key, this.entries[key], row.get(0));
      }

      if (this.options.singleSelect && this.options.singleSelectAction && !this.enableActions) {
        this.invokeSingleSelectAction();
      }
    },
    /**
     * Handler for each row.
     *
     * If a selection model is defined and navigation is disabled then toggle the entry/row
     * in the model and if singleSelectionAction is true invoke the singleSelectAction.
     *
     * Else navigate to the detail view for the extracted data-key.
     *
     * @param {Object} params Collection of `data-` attributes from the node.
     */
    activateEntry: function activateEntry(params) {
      // dont navigate if clicked on QA button
      if (params.$event && params.$event.target.className && params.$event.target.className.indexOf('btn-actions') !== -1) {
        return;
      }
      if (params.key) {
        if (this._selectionModel && this.isNavigationDisabled()) {
          this._selectionModel.toggle(params.key, this.entries[params.key] || params.descriptor, params.$source);
          if (this.options.singleSelect && this.options.singleSelectAction) {
            this.invokeSingleSelectAction();
          }
        } else {
          this.navigateToDetailView(params.key, params.descriptor);
        }
      }
    },
    /**
     * Invokes the corresponding top toolbar tool using `this.options.singleSelectAction` as the name.
     * If autoClearSelection is true, clear the selection model.
     */
    invokeSingleSelectAction: function invokeSingleSelectAction() {
      if (this.app.bars.tbar) {
        this.app.bars.tbar.invokeTool({
          tool: this.options.singleSelectAction
        });
      }

      if (this.autoClearSelection) {
        this._selectionModel.clear();
        this._loadedSelections = {};
      }
    },
    /**
     * Called to transform a textual query into an SData query compatible search expression.
     *
     * Views should override this function to provide their own formatting tailored to their entity.
     *
     * @param {String} searchQuery User inputted text from the search widget.
     * @return {String/Boolean} An SData query compatible search expression.
     * @template
     */
    formatSearchQuery: function formatSearchQuery() /* searchQuery*/{
      return false;
    },
    /**
     * Replaces a single `"` with two `""` for proper SData query expressions.
     * @param {String} searchQuery Search expression to be escaped.
     * @return {String}
     */
    escapeSearchQuery: function escapeSearchQuery(searchQuery) {
      return _Utility2.default.escapeSearchQuery(searchQuery);
    },
    /**
     * Handler for the search widgets search.
     *
     * Prepares the view by clearing it and setting `this.query` to the given search expression. Then calls
     * {@link #requestData requestData} which start the request process.
     *
     * @param {String} expression String expression as returned from the search widget
     * @private
     */
    _onSearchExpression: function _onSearchExpression(expression) {
      this.clear(false);
      this.queryText = '';
      this.query = expression;

      this.requestData();
    },
    /**
     * Sets the default search expression (acting as a pre-filter) to `this.options.query` and configures the
     * search widget by passing in the current view context.
     */
    configureSearch: function configureSearch() {
      this.query = this.options && this.options.query || this.query || null;
      if (this.searchWidget) {
        this.searchWidget.configure({
          context: this.getContext()
        });
      }

      this._setDefaultSearchTerm();
    },
    _setDefaultSearchTerm: function _setDefaultSearchTerm() {
      if (!this.defaultSearchTerm || this.defaultSearchTermSet) {
        return;
      }

      if (typeof this.defaultSearchTerm === 'function') {
        this.setSearchTerm(this.defaultSearchTerm());
      } else {
        this.setSearchTerm(this.defaultSearchTerm);
      }

      this._updateQuery();

      this.defaultSearchTermSet = true;
    },
    _updateQuery: function _updateQuery() {
      var searchQuery = this.getSearchQuery();
      if (searchQuery) {
        this.query = searchQuery;
      } else {
        this.query = '';
      }
    },
    getSearchQuery: function getSearchQuery() {
      var results = null;

      if (this.searchWidget) {
        results = this.searchWidget.getFormattedSearchQuery();
      }

      return results;
    },
    /**
     * Helper method for list actions. Takes a view id, data point and where format string, sets the nav options
     * `where` to the formatted expression using the data point and shows the given view id with that option.
     * @param {Object} action Action instance, not used.
     * @param {Object} selection Data entry for the selection.
     * @param {String} viewId View id to be shown
     * @param {String} whereQueryFmt Where expression format string to be passed. `${0}` will be the `idProperty`
     * @param {Object} additionalOptions Additional options to be passed into the next view
     * property of the passed selection data.
     */
    navigateToRelatedView: function navigateToRelatedView(action, selection, viewId, whereQueryFmt, additionalOptions) {
      var view = this.app.getView(viewId);
      var options = {
        where: _string2.default.substitute(whereQueryFmt, [selection.data[this.idProperty]]),
        selectedEntry: selection.data
      };

      if (additionalOptions) {
        options = _lang2.default.mixin(options, additionalOptions);
      }

      this.setSource({
        entry: selection.data,
        descriptor: selection.data[this.labelProperty],
        key: selection.data[this.idProperty]
      });

      if (view) {
        view.show(options);
      }
    },
    /**
     * Navigates to the defined `this.detailView` passing the params as navigation options.
     * @param {String} key Key of the entry to be shown in detail
     * @param {String} descriptor Description of the entry, will be used as the top toolbar title text
     * @param {Object} additionalOptions Additional options to be passed into the next view
     */
    navigateToDetailView: function navigateToDetailView(key, descriptor, additionalOptions) {
      var view = this.app.getView(this.detailView);
      var options = {
        descriptor: descriptor, // keep for backwards compat
        title: descriptor,
        key: key,
        fromContext: this
      };

      if (additionalOptions) {
        options = _lang2.default.mixin(options, additionalOptions);
      }

      if (view) {
        view.show(options);
      }
    },
    /**
     * Helper method for list-actions. Navigates to the defined `this.editView` passing the given selections `idProperty`
     * property in the navigation options (which is then requested and result used as default data).
     * @param {Object} action Action instance, not used.
     * @param {Object} selection Data entry for the selection.
     * @param {Object} additionalOptions Additional options to be passed into the next view.
     */
    navigateToEditView: function navigateToEditView(action, selection, additionalOptions) {
      var view = this.app.getView(this.editView || this.insertView);
      var key = selection.data[this.idProperty];
      var options = {
        key: key,
        selectedEntry: selection.data,
        fromContext: this
      };

      if (additionalOptions) {
        options = _lang2.default.mixin(options, additionalOptions);
      }

      if (view) {
        view.show(options);
      }
    },
    /**
     * Navigates to the defined `this.insertView`, or `this.editView` passing the current views id as the `returnTo`
     * option and setting `insert` to true.
     * @param {Object} additionalOptions Additional options to be passed into the next view.
     */
    navigateToInsertView: function navigateToInsertView(additionalOptions) {
      var view = this.app.getView(this.insertView || this.editView);
      var options = {
        returnTo: this.id,
        insert: true
      };

      // Pass along the selected entry (related list could get it from a quick action)
      if (this.options.selectedEntry) {
        options.selectedEntry = this.options.selectedEntry;
      }

      if (additionalOptions) {
        options = _lang2.default.mixin(options, additionalOptions);
      }

      if (view) {
        view.show(options);
      }
    },
    /**
     * Deterimines if there is more data to be shown.
     * @return {Boolean} True if the list has more data; False otherwise. Default is true.
     */
    hasMoreData: function hasMoreData() {},
    _setLoading: function _setLoading() {
      $(this.domNode).addClass('list-loading');
      this.listLoading = true;
    },
    _clearLoading: function _clearLoading() {
      $(this.domNode).removeClass('list-loading');
      this.listLoading = false;
    },
    /**
     * Initiates the data request.
     */
    requestData: function requestData() {
      var _this5 = this;

      var store = this.get('store');

      if (!store && !this._model) {
        console.warn('Error requesting data, no store was defined. Did you mean to mixin _SDataListMixin to your list view?'); // eslint-disable-line
        return null;
      }

      if (this.searchWidget) {
        this.currentSearchExpression = this.searchWidget.getSearchExpression();
      }

      this._setLoading();

      var queryResults = void 0;
      var queryOptions = {};
      var queryExpression = void 0;
      if (this._model) {
        // Todo: find a better way to transfer this state.
        this.options.count = this.pageSize;
        this.options.start = this.position;
        queryOptions = this._applyStateToQueryOptions(queryOptions) || queryOptions;
        queryExpression = this._buildQueryExpression() || null;
        queryResults = this.requestDataUsingModel(queryExpression, queryOptions);
      } else {
        queryOptions = this._applyStateToQueryOptions(queryOptions) || queryOptions;
        queryExpression = this._buildQueryExpression() || null;
        queryResults = this.requestDataUsingStore(queryExpression, queryOptions);
      }
      $.when(queryResults).done(function (results) {
        _this5._onQueryComplete(queryResults, results);
      }).fail(function () {
        _this5._onQueryError(queryResults, queryOptions);
      });

      return queryResults;
    },
    requestDataUsingModel: function requestDataUsingModel(queryExpression, options) {
      var queryOptions = {
        returnQueryResults: true,
        queryModelName: this.queryModelName
      };
      _lang2.default.mixin(queryOptions, options);
      return this._model.getEntries(queryExpression, queryOptions);
    },
    requestDataUsingStore: function requestDataUsingStore(queryExpression, queryOptions) {
      var store = this.get('store');
      return store.query(queryExpression, queryOptions);
    },
    postMixInProperties: function postMixInProperties() {
      this.inherited(postMixInProperties, arguments);
      this.createIndicatorLayout();
    },
    getItemActionKey: function getItemActionKey(entry) {
      return this.getIdentity(entry);
    },
    getItemDescriptor: function getItemDescriptor(entry) {
      return entry.$descriptor || entry[this.labelProperty];
    },
    getItemIconClass: function getItemIconClass() {
      return this.itemIconClass;
    },
    getItemIconSource: function getItemIconSource() {
      return this.itemIcon || this.icon;
    },
    getItemIconAlt: function getItemIconAlt() {
      return this.itemIconAltText;
    },
    createIndicators: function createIndicators(topIndicatorsNode, bottomIndicatorsNode, indicators, entry) {
      var self = this;
      for (var i = 0; i < indicators.length; i++) {
        var indicator = indicators[i];
        var iconPath = indicator.iconPath || self.itemIndicatorIconPath;
        if (indicator.onApply) {
          try {
            indicator.onApply(entry, self);
          } catch (err) {
            indicator.isEnabled = false;
          }
        }
        var options = {
          indicatorIndex: i,
          indicatorIcon: indicator.icon ? iconPath + indicator.icon : '',
          iconCls: indicator.cls || ''
        };

        var indicatorTemplate = indicator.template || self.itemIndicatorTemplate;

        _lang2.default.mixin(indicator, options);

        if (indicator.isEnabled === false) {
          if (indicator.cls) {
            indicator.iconCls = indicator.cls + ' disabled';
          } else {
            indicator.indicatorIcon = indicator.icon ? iconPath + 'disabled_' + indicator.icon : '';
          }
        } else {
          indicator.indicatorIcon = indicator.icon ? iconPath + indicator.icon : '';
        }

        if (indicator.isEnabled === false && indicator.showIcon === false) {
          return;
        }

        if (self.itemIndicatorShowDisabled || indicator.isEnabled) {
          if (indicator.isEnabled === false && indicator.showIcon === false) {
            return;
          }
          var indicatorHTML = indicatorTemplate.apply(indicator, indicator.id);
          if (indicator.location === 'top') {
            $(topIndicatorsNode).append(indicatorHTML);
          } else {
            $(bottomIndicatorsNode).append(indicatorHTML);
          }
        }
      }
    },
    _onQueryComplete: function _onQueryComplete(queryResults, entries) {
      var _this6 = this;

      try {
        var start = this.position;

        try {
          $.when(queryResults.total).done(function (result) {
            _this6._onQueryTotal(result);
          }).fail(function (error) {
            _this6._onQueryTotalError(error);
          });

          /* todo: move to a more appropriate location */
          if (this.options && this.options.allowEmptySelection) {
            $(this.domNode).addClass('list-has-empty-opt');
          }

          /* remove the loading indicator so that it does not get re-shown while requesting more data */
          if (start === 0) {
            // Check entries.length so we don't clear out the "noData" template
            if (entries && entries.length > 0) {
              this.set('listContent', '');
            }

            $(this.loadingIndicatorNode).remove();
          }

          this.processData(entries);
        } finally {
          this._clearLoading();
          this.isRefreshing = false;
        }

        if (!this._onScrollHandle && this.continuousScrolling) {
          this._onScrollHandle = this.connect(this.scrollerNode, 'onscroll', this.onScroll);
        }

        this.onContentChange();
        _connect2.default.publish('/app/toolbar/update', []);

        if (this._selectionModel) {
          this._loadPreviousSelections();
        }
      } catch (e) {
        console.error(e); // eslint-disable-line
        this._logError({
          message: e.message,
          stack: e.stack
        }, e.message);
      }
    },
    createStore: function createStore() {
      return null;
    },
    onContentChange: function onContentChange() {},
    _processEntry: function _processEntry(entry) {
      return entry;
    },
    _onQueryTotalError: function _onQueryTotalError(error) {
      this.handleError(error);
    },
    _onQueryTotal: function _onQueryTotal(size) {
      this.total = size;
      if (size === 0) {
        this.set('listContent', this.noDataTemplate.apply(this));
      } else {
        var remaining = this.getRemainingCount();
        if (remaining !== -1) {
          this.set('remainingContent', _string2.default.substitute(this.remainingText, [remaining]));
          this.remaining = remaining;
        }

        $(this.domNode).toggleClass('list-has-more', remaining === -1 || remaining > 0);

        this.position = this.position + this.pageSize;
      }
    },
    getRemainingCount: function getRemainingCount() {
      var remaining = this.total > -1 ? this.total - (this.position + this.pageSize) : -1;
      return remaining;
    },
    onApplyRowTemplate: function onApplyRowTemplate(entry, rowNode) {
      this.applyRowIndicators(entry, rowNode);
      this.initRowQuickActions(rowNode);
    },
    initRowQuickActions: function initRowQuickActions(rowNode) {
      var _this7 = this;

      if (this.isCardView && this.visibleActions.length) {
        // initialize popupmenus on each card
        var btn = $(rowNode).find('.btn-actions');
        $(btn).popupmenu();
        $(btn).on('beforeopen', function (evt) {
          _this7.selectEntry({ key: evt.target.attributes['data-key'].value });
        });

        // The click handle in the popup stops propagation which breaks our _ActionMixin click handling
        // This just wraps the selected element in the popup selection event and triggers the
        // _ActionMixin method manually
        $(btn).on('selected', function (evt, args) {
          var selected = args && args[0];
          if (!selected) {
            console.warn('Something went wrong selecting a quick action.'); // eslint-disable-line
            return;
          }

          var e = $.Event('click', { target: selected });
          _this7._initiateActionFromEvent(e);
        });
      }
    },
    processData: function processData(entries) {
      if (!entries) {
        return;
      }

      var count = entries.length;

      if (count > 0) {
        var docfrag = document.createDocumentFragment();
        var row = [];
        for (var i = 0; i < count; i++) {
          var entry = this._processEntry(entries[i]);
          // If key comes back with nothing, check that the store is properly
          // setup with an idProperty
          this.entries[this.getIdentity(entry, i)] = entry;

          var rowNode = this.createItemRowNode(entry);

          if (this.isCardView && this.multiColumnView) {
            var column = $('<div class="' + this.multiColumnClass + ' columns">').append(rowNode);
            row.push(column);
            if ((i + 1) % this.multiColumnCount === 0 || i === count - 1) {
              (function () {
                var rowTemplate = $('<div class="row"></div>');
                row.forEach(function (element) {
                  rowTemplate.append(element);
                });
                docfrag.appendChild(rowTemplate.get(0));
                row = [];
              })();
            }
          } else {
            docfrag.appendChild(rowNode);
          }
          this.onApplyRowTemplate(entry, rowNode);
        }

        if (docfrag.childNodes.length > 0) {
          $(this.contentNode).append(docfrag);
        }
      }
    },
    createItemRowNode: function createItemRowNode(entry) {
      var rowNode = null;
      try {
        if (this.isCardView) {
          rowNode = $(this.rowTemplate.apply(entry, this));
        } else {
          rowNode = $(this.liRowTemplate.apply(entry, this));
        }
      } catch (err) {
        console.error(err); // eslint-disable-line
        rowNode = $(this.rowTemplateError.apply(entry, this));
      }
      return rowNode.get(0);
    },
    getIdentity: function getIdentity(entry, defaultId) {
      var modelId = void 0;
      var storeId = void 0;

      if (this._model) {
        modelId = this._model.getEntityId(entry);
      }

      if (modelId) {
        return modelId;
      }

      var store = this.get('store');
      if (store) {
        storeId = store.getIdentity(entry, this.idProperty);
      }

      if (storeId) {
        return storeId;
      }

      return defaultId;
    },
    _logError: function _logError(error, message) {
      var fromContext = this.options.fromContext;
      this.options.fromContext = null;
      var errorItem = {
        viewOptions: this.options,
        serverError: error
      };

      _ErrorManager2.default.addError(message || this.getErrorMessage(error), errorItem);
      this.options.fromContext = fromContext;
    },
    _onQueryError: function _onQueryError(queryOptions, error) {
      this.handleError(error);
      this.isRefreshing = false;
    },
    _buildQueryExpression: function _buildQueryExpression() {
      return _lang2.default.mixin(this.query || {}, this.options && (this.options.query || this.options.where));
    },
    _applyStateToQueryOptions: function _applyStateToQueryOptions(queryOptions) {
      return queryOptions;
    },
    /**
     * Handler for the more button. Simply calls {@link #requestData requestData} which already has the info for
     * setting the start index as needed.
     */
    more: function more() {
      if (this.continuousScrolling) {
        this.set('remainingContent', this.loadingTemplate.apply(this));
      }

      this.requestData();
    },
    /**
     * Handler for the none/no selection button is pressed. Used in selection views when not selecting is an option.
     * Invokes the `this.options.singleSelectAction` tool.
     */
    emptySelection: function emptySelection() {
      this._selectionModel.clear();
      this._loadedSelections = {};

      if (this.app.bars.tbar) {
        this.app.bars.tbar.invokeTool({
          tool: this.options.singleSelectAction
        }); // invoke action of tool
      }
    },
    /**
     * Determines if the view should be refresh by inspecting and comparing the passed navigation options with current values.
     * @param {Object} options Passed navigation options.
     * @return {Boolean} True if the view should be refreshed, false if not.
     */
    refreshRequiredFor: function refreshRequiredFor(options) {
      if (this.options) {
        if (options) {
          if (this.expandExpression(this.options.stateKey) !== this.expandExpression(options.stateKey)) {
            return true;
          }
          if (this.expandExpression(this.options.where) !== this.expandExpression(options.where)) {
            return true;
          }
          if (this.expandExpression(this.options.query) !== this.expandExpression(options.query)) {
            return true;
          }
          if (this.expandExpression(this.options.resourceKind) !== this.expandExpression(options.resourceKind)) {
            return true;
          }
          if (this.expandExpression(this.options.resourcePredicate) !== this.expandExpression(options.resourcePredicate)) {
            return true;
          }
        }

        return false;
      }

      return this.inherited(refreshRequiredFor, arguments);
    },
    /**
     * Returns the current views context by expanding upon the {@link View#getContext parent implementation} to include
     * the views resourceKind.
     * @return {Object} context.
     */
    getContext: function getContext() {
      return this.inherited(getContext, arguments);
    },
    /**
     * Extends the {@link View#beforeTransitionTo parent implementation} by also toggling the visibility of the views
     * components and clearing the view and selection model as needed.
     */
    beforeTransitionTo: function beforeTransitionTo() {
      this.inherited(beforeTransitionTo, arguments);

      $(this.domNode).toggleClass('list-hide-search', this.options && typeof this.options.hideSearch !== 'undefined' ? this.options.hideSearch : this.hideSearch || !this.enableSearch);

      $(this.domNode).toggleClass('list-show-selectors', !this.isSelectionDisabled() && !this.options.singleSelect);

      if (this._selectionModel && !this.isSelectionDisabled()) {
        this._selectionModel.useSingleSelection(this.options.singleSelect);
      }

      if (typeof this.options.enableActions !== 'undefined') {
        this.enableActions = this.options.enableActions;
      }

      $(this.domNode).toggleClass('list-show-actions', this.enableActions);
      if (this.enableActions) {
        this._selectionModel.useSingleSelection(true);
      }

      if (this.refreshRequired) {
        this.clear();
      } else {
        // if enabled, clear any pre-existing selections
        if (this._selectionModel && this.autoClearSelection && !this.enableActions) {
          this._selectionModel.clear();
          this._loadedSelections = {};
        }
      }
    },
    /**
     * Extends the {@link View#transitionTo parent implementation} to also configure the search widget and
     * load previous selections into the selection model.
     */
    transitionTo: function transitionTo() {
      this.configureSearch();

      if (this._selectionModel) {
        this._loadPreviousSelections();
      }

      this.inherited(transitionTo, arguments);
    },
    /**
     * Generates the hash tag layout by taking the hash tags defined in `this.hashTagQueries` and converting them
     * into individual objects in an array to be used in the customization engine.
     * @return {Object[]}
     */
    createHashTagQueryLayout: function createHashTagQueryLayout() {
      // todo: always regenerate this layout? always regenerating allows for all existing customizations
      // to still work, at expense of potential (rare) performance issues if many customizations are registered.
      var layout = [];
      for (var name in this.hashTagQueries) {
        if (this.hashTagQueries.hasOwnProperty(name)) {
          layout.push({
            key: name,
            tag: this.hashTagQueriesText && this.hashTagQueriesText[name] || name,
            query: this.hashTagQueries[name]
          });
        }
      }

      return layout;
    },
    /**
     * Called when the view needs to be reset. Invokes the request data process.
     */
    refresh: function refresh() {
      if (this.isRefreshing) {
        return;
      }
      this.createActions(this._createCustomizedLayout(this.createSystemActionLayout(this.createActionLayout()), 'actions'));
      this.isRefreshing = true;
      this.query = this.getSearchQuery() || this.query;
      this.requestData();
    },
    /**
     * Clears the view by:
     *
     *  * clearing the selection model, but without it invoking the event handlers;
     *  * clears the views data such as `this.entries` and `this.entries`;
     *  * clears the search width if passed true; and
     *  * applies the default template.
     *
     * @param {Boolean} all If true, also clear the search widget.
     */
    clear: function clear(all) {
      if (this._selectionModel) {
        this._selectionModel.suspendEvents();
        this._selectionModel.clear();
        this._selectionModel.resumeEvents();
      }

      this._loadedSelections = {};
      this.requestedFirstPage = false;
      this.entries = {};
      this.position = 0;

      if (this._onScrollHandle) {
        this.disconnect(this._onScrollHandle);
        this._onScrollHandle = null;
      }

      if (all === true && this.searchWidget) {
        this.searchWidget.clear();
        this.query = false; // todo: rename to searchQuery
        this.hasSearched = false;
      }

      $(this.domNode).removeClass('list-has-more');

      this.set('listContent', this.loadingTemplate.apply(this));
    },
    search: function search() {
      if (this.searchWidget) {
        this.searchWidget.search();
      }
    },
    /**
     * Sets the query value on the serach widget
     */
    setSearchTerm: function setSearchTerm(value) {
      if (this.searchWidget) {
        this.searchWidget.set('queryValue', value);
      }
    },
    /**
     * Returns a promise with the list's count.
     */
    getListCount: function getListCount() /* options, callback*/{}
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fTGlzdEJhc2UuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJyZXNvdXJjZVNESyIsIl9fY2xhc3MiLCJ2aWV3U2V0dGluZ3NUZXh0IiwiYXR0cmlidXRlTWFwIiwibGlzdENvbnRlbnQiLCJub2RlIiwidHlwZSIsInJlbWFpbmluZ0NvbnRlbnQiLCJ0aXRsZSIsInByb3RvdHlwZSIsInNlbGVjdGVkIiwidXRpbGl0eSIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJsb2FkaW5nVGVtcGxhdGUiLCJtb3JlVGVtcGxhdGUiLCJpc0NhcmRWaWV3IiwiaGFzU2V0dGluZ3MiLCJ2aXNpYmxlQWN0aW9ucyIsImVtcHR5U2VsZWN0aW9uVGVtcGxhdGUiLCJyb3dUZW1wbGF0ZSIsImxpUm93VGVtcGxhdGUiLCJpdGVtVGVtcGxhdGUiLCJub0RhdGFUZW1wbGF0ZSIsImxpc3RBY3Rpb25UZW1wbGF0ZSIsImxpc3RBY3Rpb25JdGVtVGVtcGxhdGUiLCJpdGVtUm93Q29udGVudFRlbXBsYXRlIiwiaXRlbUljb25UZW1wbGF0ZSIsIml0ZW1JbmRpY2F0b3JUZW1wbGF0ZSIsImNvbnRlbnROb2RlIiwicmVtYWluaW5nQ29udGVudE5vZGUiLCJzZWFyY2hOb2RlIiwiZW1wdHlTZWxlY3Rpb25Ob2RlIiwicmVtYWluaW5nTm9kZSIsIm1vcmVOb2RlIiwiYWN0aW9uc05vZGUiLCJpZCIsInJlc291cmNlS2luZCIsInN0b3JlIiwiZW50cmllcyIsInBhZ2VTaXplIiwiZW5hYmxlU2VhcmNoIiwiZW5hYmxlQWN0aW9ucyIsImhpZGVTZWFyY2giLCJhbGxvd1NlbGVjdGlvbiIsImF1dG9DbGVhclNlbGVjdGlvbiIsImRldGFpbFZpZXciLCJxdWlja0FjdGlvbkNvbmZpZ3VyZVZpZXciLCJlZGl0VmlldyIsImluc2VydFZpZXciLCJjb250ZXh0VmlldyIsImhhc2hUYWdRdWVyaWVzIiwibW9yZVRleHQiLCJlbXB0eVNlbGVjdGlvblRleHQiLCJ0aXRsZVRleHQiLCJjb25maWd1cmVUZXh0IiwiZXJyb3JSZW5kZXJUZXh0Iiwicm93VGVtcGxhdGVFcnJvciIsInJlbWFpbmluZ1RleHQiLCJjYW5jZWxUZXh0IiwiaW5zZXJ0VGV4dCIsIm5vRGF0YVRleHQiLCJsb2FkaW5nVGV4dCIsIm5ld1Rvb2x0aXBUZXh0IiwicmVmcmVzaFRvb2x0aXBUZXh0IiwiY3VzdG9taXphdGlvblNldCIsInNlbGVjdEljb24iLCJzZWxlY3RJY29uQ2xhc3MiLCJzZWFyY2hXaWRnZXQiLCJzZWFyY2hXaWRnZXRDbGFzcyIsImRlZmF1bHRTZWFyY2hUZXJtU2V0IiwiZGVmYXVsdFNlYXJjaFRlcm0iLCJjdXJyZW50U2VhcmNoRXhwcmVzc2lvbiIsIl9zZWxlY3Rpb25Nb2RlbCIsIl9zZWxlY3Rpb25Db25uZWN0cyIsInRvb2xzIiwiYWN0aW9ucyIsImNvbnRpbnVvdXNTY3JvbGxpbmciLCJsaXN0TG9hZGluZyIsIm11bHRpQ29sdW1uVmlldyIsIm11bHRpQ29sdW1uQ2xhc3MiLCJtdWx0aUNvbHVtbkNvdW50IiwiaXRlbXNQcm9wZXJ0eSIsImlkUHJvcGVydHkiLCJsYWJlbFByb3BlcnR5IiwiZW50aXR5UHJvcGVydHkiLCJ2ZXJzaW9uUHJvcGVydHkiLCJpc1JlZnJlc2hpbmciLCJnZXRUaXRsZSIsImVudHJ5IiwiZ2V0VmFsdWUiLCJfc2V0U2VsZWN0aW9uTW9kZWxBdHRyIiwic2VsZWN0aW9uTW9kZWwiLCJmb3JFYWNoIiwiZGlzY29ubmVjdCIsInB1c2giLCJjb25uZWN0IiwiX29uU2VsZWN0aW9uTW9kZWxTZWxlY3QiLCJfb25TZWxlY3Rpb25Nb2RlbERlc2VsZWN0IiwiX29uU2VsZWN0aW9uTW9kZWxDbGVhciIsIl9nZXRTZWxlY3Rpb25Nb2RlbEF0dHIiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJfbG9hZGVkU2VsZWN0aW9ucyIsImRpc2FibGVSaWdodERyYXdlciIsImNvbnNvbGUiLCJ3YXJuIiwiaW5pdFNvaG8iLCJ0b29sYmFyIiwiJCIsImRvbU5vZGUiLCJmaXJzdCIsImRhdGEiLCJvbiIsIm9wZW5TZXR0aW5ncyIsInVwZGF0ZVNvaG8iLCJ1cGRhdGVkIiwiX29uTGlzdFZpZXdTZWxlY3RlZCIsImRpciIsImFyZ3VtZW50cyIsInBvc3RDcmVhdGUiLCJpbmhlcml0ZWQiLCJzZXQiLCJzdWJzY3JpYmUiLCJfb25SZWZyZXNoIiwiU2VhcmNoV2lkZ2V0Q3RvciIsImlzU3RyaW5nIiwiZ2V0T2JqZWN0IiwiY2xhc3MiLCJvd25lciIsIm9uU2VhcmNoRXhwcmVzc2lvbiIsIl9vblNlYXJjaEV4cHJlc3Npb24iLCJiaW5kIiwicGxhY2VBdCIsImFkZENsYXNzIiwiY2xlYXIiLCJpbml0UHVsbFRvUmVmcmVzaCIsInNjcm9sbGVyTm9kZSIsInNob3VsZFN0YXJ0UHVsbFRvUmVmcmVzaCIsInNob3VsZFN0YXJ0IiwiYXR0ciIsImFjdGlvbk5vZGUiLCJmaW5kIiwiYWN0aW9uc09wZW4iLCJsZW5ndGgiLCJmb3JjZVJlZnJlc2giLCJyZWZyZXNoUmVxdWlyZWQiLCJyZWZyZXNoIiwib25QdWxsVG9SZWZyZXNoQ29tcGxldGUiLCJvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZSIsInN0YXRlIiwiZW5hYmxlT2ZmbGluZVN1cHBvcnQiLCJzdGFydHVwIiwiY29uZmlndXJlIiwiX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQiLCJjcmVhdGVIYXNoVGFnUXVlcnlMYXlvdXQiLCJmb3JtYXRTZWFyY2hRdWVyeSIsImRlc3Ryb3kiLCJfZGVzdHJveWVkIiwiZGVzdHJveVJlY3Vyc2l2ZSIsIl9nZXRTdG9yZUF0dHIiLCJjcmVhdGVTdG9yZSIsInNob3ciLCJyZXNldFNlYXJjaCIsImFsbG93RW1wdHlTZWxlY3Rpb24iLCJyZXF1aXJlU2VsZWN0aW9uIiwiY3JlYXRlVG9vbExheW91dCIsInRiYXIiLCJzdmciLCJhY3Rpb24iLCJzZWN1cml0eSIsImFwcCIsImdldFZpZXdTZWN1cml0eSIsIl9yZWZyZXNoQWRkZWQiLCJ3aW5kb3ciLCJBcHAiLCJzdXBwb3J0c1RvdWNoIiwiY3JlYXRlRXJyb3JIYW5kbGVycyIsImVycm9ySGFuZGxlcnMiLCJuYW1lIiwidGVzdCIsInRlc3RBYm9ydGVkIiwiZXJyb3IiLCJhYm9ydGVkIiwiaGFuZGxlIiwiaGFuZGxlQWJvcnRlZCIsIm5leHQiLCJ0ZXN0RXJyb3IiLCJoYW5kbGVFcnJvciIsImFsZXJ0IiwiZ2V0RXJyb3JNZXNzYWdlIiwidGVzdENhdGNoQWxsIiwiaGFuZGxlQ2F0Y2hBbGwiLCJfbG9nRXJyb3IiLCJfY2xlYXJMb2FkaW5nIiwiY3JlYXRlQWN0aW9uTGF5b3V0IiwiY3JlYXRlQWN0aW9ucyIsImEiLCJyZWR1Y2UiLCJfcmVtb3ZlQWN0aW9uRHVwbGljYXRlcyIsImVuc3VyZVF1aWNrQWN0aW9uUHJlZnMiLCJzeXN0ZW1BY3Rpb25zIiwiZmlsdGVyIiwic3lzdGVtQWN0aW9uIiwicHJlZkFjdGlvbnMiLCJwcmVmZXJlbmNlcyIsInF1aWNrQWN0aW9ucyIsImNvbmNhdCIsImkiLCJ2aXNpYmxlIiwib3JpZyIsIngiLCJhY3Rpb25JbmRleCIsImhhc0FjY2VzcyIsImhhc0FjY2Vzc1RvIiwiZXhwYW5kRXhwcmVzc2lvbiIsIm1peGluIiwiYWN0aW9uVGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsInRlbXBsYXRlRG9tIiwiYXBwbHkiLCJjcmVhdGVTeXN0ZW1BY3Rpb25MYXlvdXQiLCJvdGhlcnMiLCJjbHMiLCJsYWJlbCIsImNvbmZpZ3VyZVF1aWNrQWN0aW9ucyIsInZpZXciLCJnZXRWaWV3Iiwidmlld0lkIiwic2VsZWN0RW50cnlTaWxlbnQiLCJrZXkiLCJnZXQiLCJzZWxlY3Rpb24iLCJ0b2dnbGUiLCJzZWxlY3RlZEl0ZW1zIiwiZ2V0U2VsZWN0aW9ucyIsInByb3AiLCJoYXNPd25Qcm9wZXJ0eSIsImludm9rZUFjdGlvbkl0ZW1CeSIsImFjdGlvblByZWRpY2F0ZSIsImNoZWNrQWN0aW9uU3RhdGUiLCJfaW52b2tlQWN0aW9uIiwiaW52b2tlQWN0aW9uSXRlbSIsInBhcmFtZXRlcnMiLCJldnQiLCJwb3B1cG1lbnUiLCJwYXJlbnQiLCJwcmV2Iiwic2V0VGltZW91dCIsImNsb3NlIiwiaW5kZXgiLCJkZXNlbGVjdCIsImlzRW5hYmxlZCIsImZuIiwiY2FsbCIsInNjb3BlIiwiaGFzQWN0aW9uIiwiaW52b2tlQWN0aW9uIiwicm93Tm9kZSIsIl9hcHBseVN0YXRlVG9BY3Rpb25zIiwiZ2V0UXVpY2tBY3Rpb25QcmVmcyIsImFjYyIsImN1ciIsImhhc0lEIiwic29tZSIsIml0ZW0iLCJhcHBQcmVmcyIsImFjdGlvblByZWZzIiwiZmlsdGVyZWQiLCJtYXAiLCJwZXJzaXN0UHJlZmVyZW5jZXMiLCJhY3Rpb25Sb3ciLCJlbXB0eSIsInZpc2libGVBY3Rpb24iLCJfZ2V0QWN0aW9uQnlJZCIsImVuYWJsZWQiLCJjbG9uZSIsInRvZ2dsZUNsYXNzIiwiYXBwZW5kVG8iLCJwb3B1cG1lbnVOb2RlIiwicG9zaXRpb24iLCJzaG93QWN0aW9uUGFuZWwiLCJvbkFwcGx5Um93QWN0aW9uUGFuZWwiLCJzZXRTb3VyY2UiLCJzb3VyY2UiLCJoaWRlQWN0aW9uUGFuZWwiLCJpc05hdmlnYXRpb25EaXNhYmxlZCIsInNlbGVjdGlvbk9ubHkiLCJpc1NlbGVjdGlvbkRpc2FibGVkIiwidGFnIiwicmVtb3ZlQ2xhc3MiLCJfbG9hZFByZXZpb3VzU2VsZWN0aW9ucyIsInByZXZpb3VzU2VsZWN0aW9ucyIsInJvdyIsImFjdGl2YXRlRW50cnkiLCJkZXNjcmlwdG9yIiwiJHNvdXJjZSIsImFwcGx5Um93SW5kaWNhdG9ycyIsIml0ZW1JbmRpY2F0b3JzIiwidG9wSW5kaWNhdG9yc05vZGUiLCJib3R0b21JbmRpY2F0b3JzTm9kZSIsImNoaWxkTm9kZXMiLCJjdXN0b21pemVMYXlvdXQiLCJjcmVhdGVJbmRpY2F0b3JzIiwiY3JlYXRlSW5kaWNhdG9yTGF5b3V0Iiwib25BcHBseSIsImhhc0JlZW5Ub3VjaGVkIiwiTW9kaWZ5RGF0ZSIsIm1vZGlmaWVkRGF0ZSIsIm1vbWVudCIsInRvRGF0ZUZyb21TdHJpbmciLCJjdXJyZW50RGF0ZSIsImVuZE9mIiwid2Vla0FnbyIsInN1YnRyYWN0IiwiaXNBZnRlciIsImlzQmVmb3JlIiwiX3JlZnJlc2hMaXN0IiwiZ2V0VW5sb2FkZWRTZWxlY3Rpb25zIiwiT2JqZWN0Iiwia2V5cyIsIm9uU2Nyb2xsIiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0Iiwic2Nyb2xsVG9wIiwicmVtYWluaW5nIiwiZGlmZiIsIk1hdGgiLCJhYnMiLCJoYXNNb3JlRGF0YSIsIm1vcmUiLCJzZWxlY3RFbnRyeSIsInBhcmFtcyIsInNlbGVjdCIsInNpbmdsZVNlbGVjdCIsInNpbmdsZVNlbGVjdEFjdGlvbiIsImludm9rZVNpbmdsZVNlbGVjdEFjdGlvbiIsIiRldmVudCIsInRhcmdldCIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJuYXZpZ2F0ZVRvRGV0YWlsVmlldyIsImJhcnMiLCJpbnZva2VUb29sIiwidG9vbCIsImVzY2FwZVNlYXJjaFF1ZXJ5Iiwic2VhcmNoUXVlcnkiLCJleHByZXNzaW9uIiwicXVlcnlUZXh0IiwicXVlcnkiLCJyZXF1ZXN0RGF0YSIsImNvbmZpZ3VyZVNlYXJjaCIsImNvbnRleHQiLCJnZXRDb250ZXh0IiwiX3NldERlZmF1bHRTZWFyY2hUZXJtIiwic2V0U2VhcmNoVGVybSIsIl91cGRhdGVRdWVyeSIsImdldFNlYXJjaFF1ZXJ5IiwicmVzdWx0cyIsImdldEZvcm1hdHRlZFNlYXJjaFF1ZXJ5IiwibmF2aWdhdGVUb1JlbGF0ZWRWaWV3Iiwid2hlcmVRdWVyeUZtdCIsImFkZGl0aW9uYWxPcHRpb25zIiwid2hlcmUiLCJzdWJzdGl0dXRlIiwic2VsZWN0ZWRFbnRyeSIsImZyb21Db250ZXh0IiwibmF2aWdhdGVUb0VkaXRWaWV3IiwibmF2aWdhdGVUb0luc2VydFZpZXciLCJyZXR1cm5UbyIsImluc2VydCIsIl9zZXRMb2FkaW5nIiwiX21vZGVsIiwiZ2V0U2VhcmNoRXhwcmVzc2lvbiIsInF1ZXJ5UmVzdWx0cyIsInF1ZXJ5T3B0aW9ucyIsInF1ZXJ5RXhwcmVzc2lvbiIsImNvdW50Iiwic3RhcnQiLCJfYXBwbHlTdGF0ZVRvUXVlcnlPcHRpb25zIiwiX2J1aWxkUXVlcnlFeHByZXNzaW9uIiwicmVxdWVzdERhdGFVc2luZ01vZGVsIiwicmVxdWVzdERhdGFVc2luZ1N0b3JlIiwid2hlbiIsImRvbmUiLCJfb25RdWVyeUNvbXBsZXRlIiwiZmFpbCIsIl9vblF1ZXJ5RXJyb3IiLCJyZXR1cm5RdWVyeVJlc3VsdHMiLCJxdWVyeU1vZGVsTmFtZSIsImdldEVudHJpZXMiLCJwb3N0TWl4SW5Qcm9wZXJ0aWVzIiwiZ2V0SXRlbUFjdGlvbktleSIsImdldElkZW50aXR5IiwiZ2V0SXRlbURlc2NyaXB0b3IiLCIkZGVzY3JpcHRvciIsImdldEl0ZW1JY29uQ2xhc3MiLCJpdGVtSWNvbkNsYXNzIiwiZ2V0SXRlbUljb25Tb3VyY2UiLCJpdGVtSWNvbiIsImljb24iLCJnZXRJdGVtSWNvbkFsdCIsIml0ZW1JY29uQWx0VGV4dCIsImluZGljYXRvcnMiLCJzZWxmIiwiaW5kaWNhdG9yIiwiaWNvblBhdGgiLCJpdGVtSW5kaWNhdG9ySWNvblBhdGgiLCJlcnIiLCJpbmRpY2F0b3JJbmRleCIsImluZGljYXRvckljb24iLCJpY29uQ2xzIiwiaW5kaWNhdG9yVGVtcGxhdGUiLCJzaG93SWNvbiIsIml0ZW1JbmRpY2F0b3JTaG93RGlzYWJsZWQiLCJpbmRpY2F0b3JIVE1MIiwibG9jYXRpb24iLCJhcHBlbmQiLCJ0b3RhbCIsInJlc3VsdCIsIl9vblF1ZXJ5VG90YWwiLCJfb25RdWVyeVRvdGFsRXJyb3IiLCJsb2FkaW5nSW5kaWNhdG9yTm9kZSIsInJlbW92ZSIsInByb2Nlc3NEYXRhIiwiX29uU2Nyb2xsSGFuZGxlIiwib25Db250ZW50Q2hhbmdlIiwicHVibGlzaCIsImUiLCJtZXNzYWdlIiwic3RhY2siLCJfcHJvY2Vzc0VudHJ5Iiwic2l6ZSIsImdldFJlbWFpbmluZ0NvdW50Iiwib25BcHBseVJvd1RlbXBsYXRlIiwiaW5pdFJvd1F1aWNrQWN0aW9ucyIsImJ0biIsImF0dHJpYnV0ZXMiLCJ2YWx1ZSIsImFyZ3MiLCJFdmVudCIsIl9pbml0aWF0ZUFjdGlvbkZyb21FdmVudCIsImRvY2ZyYWciLCJkb2N1bWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJjcmVhdGVJdGVtUm93Tm9kZSIsImNvbHVtbiIsImVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImRlZmF1bHRJZCIsIm1vZGVsSWQiLCJzdG9yZUlkIiwiZ2V0RW50aXR5SWQiLCJlcnJvckl0ZW0iLCJ2aWV3T3B0aW9ucyIsInNlcnZlckVycm9yIiwiYWRkRXJyb3IiLCJlbXB0eVNlbGVjdGlvbiIsInJlZnJlc2hSZXF1aXJlZEZvciIsInN0YXRlS2V5IiwicmVzb3VyY2VQcmVkaWNhdGUiLCJiZWZvcmVUcmFuc2l0aW9uVG8iLCJ1c2VTaW5nbGVTZWxlY3Rpb24iLCJ0cmFuc2l0aW9uVG8iLCJsYXlvdXQiLCJoYXNoVGFnUXVlcmllc1RleHQiLCJhbGwiLCJzdXNwZW5kRXZlbnRzIiwicmVzdW1lRXZlbnRzIiwicmVxdWVzdGVkRmlyc3RQYWdlIiwiaGFzU2VhcmNoZWQiLCJzZWFyY2giLCJnZXRMaXN0Q291bnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQTZCQSxNQUFNQSxXQUFXLG9CQUFZLFVBQVosQ0FBakI7QUFDQSxNQUFNQyxjQUFjLG9CQUFZLGdCQUFaLENBQXBCOztBQUVBOzs7Ozs7O0FBT0EsTUFBTUMsVUFBVSx1QkFBUSxpQkFBUixFQUEyQiw4Q0FBM0IsRUFBd0QsOEJBQThCO0FBQ3BHOzs7Ozs7O0FBT0FDLHNCQUFrQkYsWUFBWUUsZ0JBUnNFO0FBU3BHQyxrQkFBYztBQUNaQyxtQkFBYTtBQUNYQyxjQUFNLGFBREs7QUFFWEMsY0FBTTtBQUZLLE9BREQ7QUFLWkMsd0JBQWtCO0FBQ2hCRixjQUFNLHNCQURVO0FBRWhCQyxjQUFNO0FBRlUsT0FMTjtBQVNaRSxhQUFPLGVBQUtDLFNBQUwsQ0FBZU4sWUFBZixDQUE0QkssS0FUdkI7QUFVWkUsZ0JBQVUsZUFBS0QsU0FBTCxDQUFlTixZ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QUFTQSxhQUFULENBQXVCbUYsS0FBdkIsRUFBOEI7QUFDM0MsVUFBSSxLQUFLbFgsWUFBVCxFQUF1QjtBQUNyQixhQUFLQSxZQUFMLENBQWtCc0QsR0FBbEIsQ0FBc0IsWUFBdEIsRUFBb0M0VCxLQUFwQztBQUNEO0FBQ0YsS0F4aEVtRztBQXloRXBHOzs7QUFHQWtDLGtCQUFjLFNBQVNBLFlBQVQsR0FBc0Isc0JBQXdCLENBQUU7QUE1aEVzQyxHQUF0RixDQUFoQjs7b0JBK2hFZXZkLE8iLCJmaWxlIjoiX0xpc3RCYXNlLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgY29ubmVjdCBmcm9tICdkb2pvL19iYXNlL2Nvbm5lY3QnO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5JztcclxuaW1wb3J0IEVycm9yTWFuYWdlciBmcm9tICcuL0Vycm9yTWFuYWdlcic7XHJcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XHJcbmltcG9ydCBTZWFyY2hXaWRnZXQgZnJvbSAnLi9TZWFyY2hXaWRnZXQnO1xyXG5pbXBvcnQgQ29uZmlndXJhYmxlU2VsZWN0aW9uTW9kZWwgZnJvbSAnLi9Db25maWd1cmFibGVTZWxlY3Rpb25Nb2RlbCc7XHJcbmltcG9ydCBfUHVsbFRvUmVmcmVzaE1peGluIGZyb20gJy4vX1B1bGxUb1JlZnJlc2hNaXhpbic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5pbXBvcnQgY29udmVydCBmcm9tICdhcmdvcy9Db252ZXJ0JztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdsaXN0QmFzZScpO1xyXG5jb25zdCByZXNvdXJjZVNESyA9IGdldFJlc291cmNlKCdzZGtBcHBsaWNhdGlvbicpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc2Rlc2MgQSBMaXN0IFZpZXcgaXMgYSB2aWV3IHVzZWQgdG8gZGlzcGxheSBhIGNvbGxlY3Rpb24gb2YgZW50cmllcyBpbiBhbiBlYXN5IHRvIHNraW0gbGlzdC4gVGhlIExpc3QgVmlldyBhbHNvIGhhcyBhXHJcbiAqIHNlbGVjdGlvbiBtb2RlbCBidWlsdCBpbiBmb3Igc2VsZWN0aW5nIHJvd3MgZnJvbSB0aGUgbGlzdCBhbmQgbWF5IGJlIHVzZWQgaW4gYSBudW1iZXIgb2YgZGlmZmVyZW50IG1hbm5lcnMuXHJcbiAqIEBjbGFzcyBhcmdvcy5fTGlzdEJhc2VcclxuICogQGV4dGVuZHMgYXJnb3MuVmlld1xyXG4gKiBAbWl4aW5zIGFyZ29zLl9QdWxsVG9SZWZyZXNoTWl4aW5cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fTGlzdEJhc2UnLCBbVmlldywgX1B1bGxUb1JlZnJlc2hNaXhpbl0sIC8qKiBAbGVuZHMgYXJnb3MuX0xpc3RCYXNlIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBDcmVhdGVzIGEgc2V0dGVyIG1hcCB0byBodG1sIG5vZGVzLCBuYW1lbHk6XHJcbiAgICpcclxuICAgKiAqIGxpc3RDb250ZW50ID0+IGNvbnRlbnROb2RlJ3MgaW5uZXJIVE1MXHJcbiAgICogKiByZW1haW5pbmdDb250ZW50ID0+IHJlbWFpbmluZ0NvbnRlbnROb2RlJ3MgaW5uZXJIVE1MXHJcbiAgICovXHJcbiAgdmlld1NldHRpbmdzVGV4dDogcmVzb3VyY2VTREsudmlld1NldHRpbmdzVGV4dCxcclxuICBhdHRyaWJ1dGVNYXA6IHtcclxuICAgIGxpc3RDb250ZW50OiB7XHJcbiAgICAgIG5vZGU6ICdjb250ZW50Tm9kZScsXHJcbiAgICAgIHR5cGU6ICdpbm5lckhUTUwnLFxyXG4gICAgfSxcclxuICAgIHJlbWFpbmluZ0NvbnRlbnQ6IHtcclxuICAgICAgbm9kZTogJ3JlbWFpbmluZ0NvbnRlbnROb2RlJyxcclxuICAgICAgdHlwZTogJ2lubmVySFRNTCcsXHJcbiAgICB9LFxyXG4gICAgdGl0bGU6IFZpZXcucHJvdG90eXBlLmF0dHJpYnV0ZU1hcC50aXRsZSxcclxuICAgIHNlbGVjdGVkOiBWaWV3LnByb3RvdHlwZS5hdHRyaWJ1dGVNYXAuc2VsZWN0ZWQsXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKlxyXG4gICAqICBNYXBzIHRvIFV0aWxpdHkgQ2xhc3NcclxuICAgKi9cclxuICB1dGlsaXR5OiBVdGlsaXR5LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSB2aWV3J3MgbWFpbiBET00gZWxlbWVudCB3aGVuIHRoZSB2aWV3IGlzIGluaXRpYWxpemVkLlxyXG4gICAqIFRoaXMgdGVtcGxhdGUgaW5jbHVkZXMgZW1wdHlTZWxlY3Rpb25UZW1wbGF0ZSwgbW9yZVRlbXBsYXRlIGFuZCBsaXN0QWN0aW9uVGVtcGxhdGUuXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSB1c2VzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICAgKlxyXG4gICAqICAgICAgbmFtZSAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAqICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqICAgICAgaWQgICAgICAgICAgICAgICAgICAgbWFpbiBjb250YWluZXIgZGl2IGlkXHJcbiAgICogICAgICB0aXRsZSAgICAgICAgICAgICAgICBtYWluIGNvbnRhaW5lciBkaXYgdGl0bGUgYXR0clxyXG4gICAqICAgICAgY2xzICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbCBjbGFzcyBzdHJpbmcgYWRkZWQgdG8gdGhlIG1haW4gY29udGFpbmVyIGRpdlxyXG4gICAqICAgICAgcmVzb3VyY2VLaW5kICAgICAgICAgc2V0IHRvIGRhdGEtcmVzb3VyY2Uta2luZFxyXG4gICAqXHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgPGRpdiBpZD1cInslPSAkLmlkICV9XCIgZGF0YS10aXRsZT1cInslPSAkLnRpdGxlVGV4dCAlfVwiIGNsYXNzPVwibGlzdCB7JT0gJC5jbHMgJX1cIiB7JSBpZiAoJC5yZXNvdXJjZUtpbmQpIHsgJX1kYXRhLXJlc291cmNlLWtpbmQ9XCJ7JT0gJC5yZXNvdXJjZUtpbmQgJX1cInslIH0gJX0+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWNvbnRhaW5lciBzY3JvbGxhYmxleyUgaWYgKCQkLmlzTmF2aWdhdGlvbkRpc2FibGVkKCkpIHsgJX0gaXMtbXVsdGlzZWxlY3QgaXMtc2VsZWN0YWJsZSBpcy10b29sYmFyLW9wZW4geyUgfSAlfSB7JSBpZiAoISQkLmlzQ2FyZFZpZXcpIHsgJX0gbGlzdHZpZXcgeyUgfSAlfVwiXHJcbiAgICAgICAgeyUgaWYgKCQkLmlzTmF2aWdhdGlvbkRpc2FibGVkKCkpIHsgJX1cclxuICAgICAgICBkYXRhLXNlbGVjdGFibGU9XCJtdWx0aXBsZVwiXHJcbiAgICAgICAgeyUgfSBlbHNlIHsgJX1cclxuICAgICAgICBkYXRhLXNlbGVjdGFibGU9XCJmYWxzZVwiXHJcbiAgICAgICAgeyUgfSAlfVxyXG4gICAgICAgIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJzY3JvbGxlck5vZGVcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sYmFyIGhhcy10aXRsZS1idXR0b25cIiByb2xlPVwidG9vbGJhclwiIGFyaWEtbGFiZWw9XCJMaXN0IFRvb2xiYXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgPGgxPjwvaDE+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uc2V0XCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRvb2xOb2RlXCI+XHJcbiAgICAgICAgICAgICAgeyUgaWYoJC5lbmFibGVTZWFyY2gpIHsgJX1cclxuICAgICAgICAgICAgICA8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJzZWFyY2hOb2RlXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgeyUgfSAlfVxyXG4gICAgICAgICAgICAgIHslIGlmKCQuaGFzU2V0dGluZ3MpIHsgJX1cclxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCIgdGl0bGU9XCJ7JT0gJC52aWV3U2V0dGluZ3NUZXh0ICV9XCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtYWN0aW9uPVwib3BlblNldHRpbmdzXCIgYXJpYS1jb250cm9scz1cImxpc3RfdG9vbGJhcl9zZXR0aW5nX3slPSAkLmlkICV9XCI+XHJcbiAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzPVwiaWNvblwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1zZXR0aW5nc1wiPjwvdXNlPjwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhdWRpYmxlXCI+TGlzdCBTZXR0aW5nczwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICB7JSB9ICV9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICB7JSBpZiAoJCQuaXNOYXZpZ2F0aW9uRGlzYWJsZWQoKSkgeyAlfVxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRleHR1YWwtdG9vbGJhciB0b29sYmFyIGlzLWhpZGRlblwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uc2V0XCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi10ZXJ0aWFyeVwiIHRpdGxlPVwiQXNzaWduIFNlbGVjdGVkIEl0ZW1zXCIgdHlwZT1cImJ1dHRvblwiPkFzc2lnbjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tdGVydGlhcnlcIiBpZD1cInJlbW92ZVwiIHRpdGxlPVwiUmVtb3ZlIFNlbGVjdGVkIEl0ZW1zXCIgdHlwZT1cImJ1dHRvblwiPlJlbW92ZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgeyUgfSAlfVxyXG4gICAgICAgIHslISAkLmVtcHR5U2VsZWN0aW9uVGVtcGxhdGUgJX1cclxuICAgICAgICB7JSBpZiAoJCQuaXNDYXJkVmlldykgeyAlfVxyXG4gICAgICAgICAgPGRpdiByb2xlPVwicHJlc2VudGF0aW9uXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImNvbnRlbnROb2RlXCI+PC9kaXY+XHJcbiAgICAgICAgeyUgfSBlbHNlIHsgJX1cclxuICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtY29udGVudFwiIHJvbGU9XCJwcmVzZW50YXRpb25cIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiY29udGVudE5vZGVcIj48L3VsPlxyXG4gICAgICAgIHslIH0gJX1cclxuICAgICAgICB7JSEgJC5tb3JlVGVtcGxhdGUgJX1cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBUaGUgdGVtcGxhdGUgdXNlZCB0byByZW5kZXIgdGhlIGxvYWRpbmcgbWVzc2FnZSB3aGVuIHRoZSB2aWV3IGlzIHJlcXVlc3RpbmcgbW9yZSBkYXRhLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgdXNlcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICpcclxuICAgKiAgICAgIG5hbWUgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgKiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiAgICAgIGxvYWRpbmdUZXh0ICAgICAgICAgVGhlIHRleHQgdG8gZGlzcGxheSB3aGlsZSBsb2FkaW5nLlxyXG4gICAqL1xyXG4gIGxvYWRpbmdUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiYnVzeS1pbmRpY2F0b3ItY29udGFpbmVyXCIgYXJpYS1saXZlPVwicG9saXRlXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYnVzeS1pbmRpY2F0b3IgYWN0aXZlXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIG9uZVwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciB0d29cIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdGhyZWVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZm91clwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBmaXZlXCI+PC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzxzcGFuPnslOiAkLmxvYWRpbmdUZXh0ICV9PC9zcGFuPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciB0aGUgcGFnZXIgYXQgdGhlIGJvdHRvbSBvZiB0aGUgdmlldy4gIFRoaXMgdGVtcGxhdGUgaXMgbm90IGRpcmVjdGx5IHJlbmRlcmVkLCBidXQgaXNcclxuICAgKiBpbmNsdWRlZCBpbiB7QGxpbmsgI3ZpZXdUZW1wbGF0ZX0uXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSB1c2VzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICAgKlxyXG4gICAqICAgICAgbmFtZSAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAqICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqICAgICAgbW9yZVRleHQgICAgICAgICAgICBUaGUgdGV4dCB0byBkaXNwbGF5IG9uIHRoZSBtb3JlIGJ1dHRvbi5cclxuICAgKlxyXG4gICAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlIGV4cG9zZXMgdGhlIGZvbGxvd2luZyBhY3Rpb25zOlxyXG4gICAqXHJcbiAgICogKiBtb3JlXHJcbiAgICovXHJcbiAgbW9yZVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJsaXN0LW1vcmVcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwibW9yZU5vZGVcIj4nLFxyXG4gICAgJzxwIGNsYXNzPVwibGlzdC1yZW1haW5pbmdcIj48c3BhbiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwicmVtYWluaW5nQ29udGVudE5vZGVcIj48L3NwYW4+PC9wPicsXHJcbiAgICAnPGJ1dHRvbiBjbGFzcz1cImJ0blwiIGRhdGEtYWN0aW9uPVwibW9yZVwiPicsXHJcbiAgICAnPHNwYW4+eyU9ICQubW9yZVRleHQgJX08L3NwYW4+JyxcclxuICAgICc8L2J1dHRvbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIGEgdGVtcGxhdGUgaXMgYSBjYXJkIHZpZXcgb3IgYSBsaXN0XHJcbiAgICovXHJcbiAgaXNDYXJkVmlldzogdHJ1ZSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEluZGljYXRlcyBpZiB0aGVyZSBpcyBhIGxpc3Qgc2V0dGluZ3MgbW9kYWwuXHJcbiAgICovXHJcbiAgaGFzU2V0dGluZ3M6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIGxpc3RiYXNlIGNhbGN1bGF0ZWQgcHJvcGVydHkgYmFzZWQgb24gYWN0aW9ucyBhdmFpbGFibGVcclxuICAgKi9cclxuICB2aXNpYmxlQWN0aW9uczogW10sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBUZW1wbGF0ZSB1c2VkIG9uIGxvb2t1cHMgdG8gaGF2ZSBlbXB0eSBTZWxlY3Rpb24gb3B0aW9uLlxyXG4gICAqIFRoaXMgdGVtcGxhdGUgaXMgbm90IGRpcmVjdGx5IHJlbmRlcmVkIGJ1dCBpbmNsdWRlZCBpbiB7QGxpbmsgI3ZpZXdUZW1wbGF0ZX0uXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSB1c2VzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICAgKlxyXG4gICAqICAgICAgbmFtZSAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAqICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqICAgICAgZW1wdHlTZWxlY3Rpb25UZXh0ICBUaGUgdGV4dCB0byBkaXNwbGF5IG9uIHRoZSBlbXB0eSBTZWxlY3Rpb24gYnV0dG9uLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgZXhwb3NlcyB0aGUgZm9sbG93aW5nIGFjdGlvbnM6XHJcbiAgICpcclxuICAgKiAqIGVtcHR5U2VsZWN0aW9uXHJcbiAgICovXHJcbiAgZW1wdHlTZWxlY3Rpb25UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwibGlzdC1lbXB0eS1vcHRcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiZW1wdHlTZWxlY3Rpb25Ob2RlXCI+JyxcclxuICAgICc8YnV0dG9uIGNsYXNzPVwiYnV0dG9uXCIgZGF0YS1hY3Rpb249XCJlbXB0eVNlbGVjdGlvblwiPicsXHJcbiAgICAnPHNwYW4+eyU9ICQuZW1wdHlTZWxlY3Rpb25UZXh0ICV9PC9zcGFuPicsXHJcbiAgICAnPC9idXR0b24+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIGEgcm93IGluIHRoZSB2aWV3LiAgVGhpcyB0ZW1wbGF0ZSBpbmNsdWRlcyB7QGxpbmsgI2l0ZW1UZW1wbGF0ZX0uXHJcbiAgICovXHJcbiAgcm93VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgPGRpdiBkYXRhLWFjdGlvbj1cImFjdGl2YXRlRW50cnlcIiBkYXRhLWtleT1cInslPSAkJC5nZXRJdGVtQWN0aW9uS2V5KCQpICV9XCIgZGF0YS1kZXNjcmlwdG9yPVwieyU6ICQkLmdldEl0ZW1EZXNjcmlwdG9yKCQpICV9XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJ3aWRnZXRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwid2lkZ2V0LWhlYWRlclwiPlxyXG4gICAgICAgICAgPGgyIGNsYXNzPVwid2lkZ2V0LXRpdGxlXCI+eyU6ICQkLmdldFRpdGxlKCQsICQkLmxhYmVsUHJvcGVydHkpICV9PC9oMj5cclxuICAgICAgICAgIHslIGlmKCQkLnZpc2libGVBY3Rpb25zLmxlbmd0aCA+IDAgJiYgJCQuZW5hYmxlQWN0aW9ucykgeyAlfVxyXG4gICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWFjdGlvbnNcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1rZXk9XCJ7JT0gJCQuZ2V0SXRlbUFjdGlvbktleSgkKSAlfVwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXVkaWJsZVwiPkFjdGlvbnM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLW1vcmVcIj48L3VzZT5cclxuICAgICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICAgIHslISAkJC5saXN0QWN0aW9uVGVtcGxhdGUgJX1cclxuICAgICAgICAgIHslIH0gJX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiY2FyZC1jb250ZW50XCI+XHJcbiAgICAgICAgICB7JSEgJCQuaXRlbVJvd0NvbnRlbnRUZW1wbGF0ZSAlfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvZGl2PlxyXG4gICAgYCxcclxuICBdKSxcclxuICBsaVJvd1RlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaSBkYXRhLWFjdGlvbj1cImFjdGl2YXRlRW50cnlcIiBkYXRhLWtleT1cInslPSAkWyQkLmlkUHJvcGVydHldICV9XCIgZGF0YS1kZXNjcmlwdG9yPVwieyU6ICQkLnV0aWxpdHkuZ2V0VmFsdWUoJCwgJCQubGFiZWxQcm9wZXJ0eSkgJX1cIj4nLFxyXG4gICAgJ3slIGlmICgkJC5pY29uIHx8ICQkLnNlbGVjdEljb24pIHsgJX0nLFxyXG4gICAgJzxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWljb24gaGlkZS1mb2N1cyBsaXN0LWl0ZW0tc2VsZWN0b3JcIiBkYXRhLWFjdGlvbj1cInNlbGVjdEVudHJ5XCI+JyxcclxuICAgIGA8c3ZnIGNsYXNzPVwiaWNvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXslPSAkJC5pY29uIHx8ICQkLnNlbGVjdEljb24gJX1cIiAvPlxyXG4gICAgICA8L3N2Zz5gLFxyXG4gICAgJzwvYnV0dG9uPicsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgICAnPC9idXR0b24+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwibGlzdC1pdGVtLWNvbnRlbnRcIj57JSEgJCQuaXRlbVRlbXBsYXRlICV9PC9kaXY+JyxcclxuICAgICc8L2xpPicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSBjb250ZW50IG9mIGEgcm93LiAgVGhpcyB0ZW1wbGF0ZSBpcyBub3QgZGlyZWN0bHkgcmVuZGVyZWQsIGJ1dCBpc1xyXG4gICAqIGluY2x1ZGVkIGluIHtAbGluayAjcm93VGVtcGxhdGV9LlxyXG4gICAqXHJcbiAgICogVGhpcyBwcm9wZXJ0eSBzaG91bGQgYmUgb3ZlcnJpZGRlbiBpbiB0aGUgZGVyaXZlZCBjbGFzcy5cclxuICAgKiBAdGVtcGxhdGVcclxuICAgKi9cclxuICBpdGVtVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPHA+eyU6ICRbJCQubGFiZWxQcm9wZXJ0eV0gJX08L3A+JyxcclxuICAgICc8cCBjbGFzcz1cIm1pY3JvLXRleHRcIj57JTogJFskJC5pZFByb3BlcnR5XSAlfTwvcD4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIGEgbWVzc2FnZSBpZiB0aGVyZSBpcyBubyBkYXRhIGF2YWlsYWJsZS5cclxuICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSB1c2VzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICAgKlxyXG4gICAqICAgICAgbmFtZSAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAqICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqICAgICAgbm9EYXRhVGV4dCAgICAgICAgICBUaGUgdGV4dCB0byBkaXNwbGF5IGlmIHRoZXJlIGlzIG5vIGRhdGEuXHJcbiAgICovXHJcbiAgbm9EYXRhVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cIm5vLWRhdGFcIj4nLFxyXG4gICAgJzxwPnslPSAkLm5vRGF0YVRleHQgJX08L3A+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSBzaW5nbGUgbGlzdCBhY3Rpb24gcm93LlxyXG4gICAqL1xyXG4gIGxpc3RBY3Rpb25UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8dWwgaWQ9XCJwb3B1cG1lbnUteyU9ICQkLmdldEl0ZW1BY3Rpb25LZXkoJCkgJX1cIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiYWN0aW9uc05vZGVcIiBjbGFzcz1cInBvcHVwbWVudVwiPicsXHJcbiAgICAneyUhICQkLmxvYWRpbmdUZW1wbGF0ZSAlfScsXHJcbiAgICAnPC91bD4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIGEgbGlzdCBhY3Rpb24gaXRlbS5cclxuICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSB1c2VzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICAgKlxyXG4gICAqICAgICAgbmFtZSAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAqICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqICAgICAgYWN0aW9uSW5kZXggICAgICAgICBUaGUgY29ycmVsYXRpbmcgaW5kZXggbnVtYmVyIG9mIHRoZSBhY3Rpb24gY29sbGVjdGlvblxyXG4gICAqICAgICAgdGl0bGUgICAgICAgICAgICAgICBUZXh0IHVzZWQgZm9yIEFSSUEtbGFiZWxpbmdcclxuICAgKiAgICAgIGljb24gICAgICAgICAgICAgICAgUmVsYXRpdmUgcGF0aCB0byB0aGUgaWNvbiB0byB1c2VcclxuICAgKiAgICAgIGNscyAgICAgICAgICAgICAgICAgQ1NTIGNsYXNzIHRvIHVzZSBpbnN0ZWFkIG9mIGFuIGljb25cclxuICAgKiAgICAgIGlkICAgICAgICAgICAgICAgICAgVW5pcXVlIG5hbWUgb2YgYWN0aW9uLCBhbHNvIHVzZWQgZm9yIGFsdCBpbWFnZSB0ZXh0XHJcbiAgICogICAgICBsYWJlbCAgICAgICAgICAgICAgIFRleHQgYWRkZWQgYmVsb3cgdGhlIGljb25cclxuICAgKi9cclxuICBsaXN0QWN0aW9uSXRlbVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW2BcclxuICAgIDxsaT48YSBocmVmPVwiI1wiIGRhdGEtYWN0aW9uPVwiaW52b2tlQWN0aW9uSXRlbVwiIGRhdGEtaWQ9XCJ7JT0gJC5hY3Rpb25JbmRleCAlfVwiPnslOiAkLmxhYmVsICV9PC9hPjwvbGk+YF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHJvdyBjb250ZW50IHRlbXBsYXRlXHJcbiAgICovXHJcbiAgaXRlbVJvd0NvbnRlbnRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwidG9wX2l0ZW1faW5kaWNhdG9ycyBsaXN0LWl0ZW0taW5kaWNhdG9yLWNvbnRlbnRcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0tY29udGVudFwiPnslISAkJC5pdGVtVGVtcGxhdGUgJX08L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJib3R0b21faXRlbV9pbmRpY2F0b3JzIGxpc3QtaXRlbS1pbmRpY2F0b3ItY29udGVudFwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImxpc3QtaXRlbS1jb250ZW50LXJlbGF0ZWRcIj48L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIGl0ZW1JY29uVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAneyUgaWYgKCQkLmdldEl0ZW1JY29uQ2xhc3MoJCkpIHsgJX0nLFxyXG4gICAgYDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzPVwiYnRuLWljb24gaGlkZS1mb2N1c1wiIGNsYXNzPVwibGlzdC1pdGVtLXNlbGVjdG9yIGJ1dHRvblwiPlxyXG4gICAgICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgIDx1c2UgeG1sbnM6eGxpbms9XCJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rXCIgeGxpbms6aHJlZj1cIiNpY29uLXslPSAkJC5nZXRJdGVtSWNvbkNsYXNzKCQpIHx8ICdhbGVydCcgJX1cIj48L3VzZT5cclxuICAgICAgICA8L3N2Zz5cclxuICAgIDwvYnV0dG9uPmAsXHJcbiAgICAneyUgfSBlbHNlIGlmICgkJC5nZXRJdGVtSWNvblNvdXJjZSgkKSkgeyAlfScsXHJcbiAgICAnPGJ1dHRvbiBkYXRhLWFjdGlvbj1cInNlbGVjdEVudHJ5XCIgY2xhc3M9XCJsaXN0LWl0ZW0tc2VsZWN0b3IgYnV0dG9uXCI+JyxcclxuICAgICc8aW1nIGlkPVwibGlzdC1pdGVtLWltYWdlX3slOiAkLiRrZXkgJX1cIiBzcmM9XCJ7JTogJCQuZ2V0SXRlbUljb25Tb3VyY2UoJCkgJX1cIiBhbHQ9XCJ7JTogJCQuZ2V0SXRlbUljb25BbHQoJCkgJX1cIiBjbGFzcz1cImljb25cIiAvPicsXHJcbiAgICAnPC9idXR0b24+JyxcclxuICAgICd7JSB9ICV9JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciBpdGVtIGluZGljYXRvclxyXG4gICAqL1xyXG4gIGl0ZW1JbmRpY2F0b3JUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1pY29uIGhpZGUtZm9jdXNcIiB0aXRsZT1cInslPSAkLnRpdGxlICV9XCI+JyxcclxuICAgIGA8c3ZnIGNsYXNzPVwiaWNvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXslPSAkLmNscyAlfVwiIC8+XHJcbiAgICAgIDwvc3ZnPmAsXHJcbiAgICAnPC9idXR0b24+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fVxyXG4gICAqIEF0dGFjaCBwb2ludCBmb3IgdGhlIG1haW4gdmlldyBjb250ZW50XHJcbiAgICovXHJcbiAgY29udGVudE5vZGU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH1cclxuICAgKiBBdHRhY2ggcG9pbnQgZm9yIHRoZSByZW1haW5pbmcgZW50cmllcyBjb250ZW50XHJcbiAgICovXHJcbiAgcmVtYWluaW5nQ29udGVudE5vZGU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH1cclxuICAgKiBBdHRhY2ggcG9pbnQgZm9yIHRoZSBzZWFyY2ggd2lkZ2V0XHJcbiAgICovXHJcbiAgc2VhcmNoTm9kZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fVxyXG4gICAqIEF0dGFjaCBwb2ludCBmb3IgdGhlIGVtcHR5LCBvciBubyBzZWxlY3Rpb24sIGNvbnRhaW5lclxyXG4gICAqL1xyXG4gIGVtcHR5U2VsZWN0aW9uTm9kZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fVxyXG4gICAqIEF0dGFjaCBwb2ludCBmb3IgdGhlIHJlbWFpbmluZyBlbnRyaWVzIGNvbnRhaW5lclxyXG4gICAqL1xyXG4gIHJlbWFpbmluZ05vZGU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH1cclxuICAgKiBBdHRhY2ggcG9pbnQgZm9yIHRoZSByZXF1ZXN0IG1vcmUgZW50cmllcyBjb250YWluZXJcclxuICAgKi9cclxuICBtb3JlTm9kZTogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0hUTUxFbGVtZW50fVxyXG4gICAqIEF0dGFjaCBwb2ludCBmb3IgdGhlIGxpc3QgYWN0aW9ucyBjb250YWluZXJcclxuICAgKi9cclxuICBhY3Rpb25zTm9kZTogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfSBpZFxyXG4gICAqIFRoZSBpZCBmb3IgdGhlIHZpZXcsIGFuZCBpdCdzIG1haW4gRE9NIGVsZW1lbnQuXHJcbiAgICovXHJcbiAgaWQ6ICdnZW5lcmljX2xpc3QnLFxyXG5cclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9XHJcbiAgICogVGhlIFNEYXRhIHJlc291cmNlIGtpbmQgdGhlIHZpZXcgaXMgcmVzcG9uc2libGUgZm9yLiAgVGhpcyB3aWxsIGJlIHVzZWQgYXMgdGhlIGRlZmF1bHQgcmVzb3VyY2Uga2luZFxyXG4gICAqIGZvciBhbGwgU0RhdGEgcmVxdWVzdHMuXHJcbiAgICovXHJcbiAgcmVzb3VyY2VLaW5kOiAnJyxcclxuICBzdG9yZTogbnVsbCxcclxuICBlbnRyaWVzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfVxyXG4gICAqIFRoZSBudW1iZXIgb2YgZW50cmllcyB0byByZXF1ZXN0IHBlciBTRGF0YSBwYXlsb2FkLlxyXG4gICAqL1xyXG4gIHBhZ2VTaXplOiAyMSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogQ29udHJvbHMgdGhlIGFkZGl0aW9uIG9mIGEgc2VhcmNoIHdpZGdldC5cclxuICAgKi9cclxuICBlbmFibGVTZWFyY2g6IHRydWUsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWcgdGhhdCBkZXRlcm1pbmVzIGlmIHRoZSBsaXN0IGFjdGlvbnMgcGFuZWwgc2hvdWxkIGJlIGluIHVzZS5cclxuICAgKi9cclxuICBlbmFibGVBY3Rpb25zOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogQ29udHJvbHMgdGhlIHZpc2liaWxpdHkgb2YgdGhlIHNlYXJjaCB3aWRnZXQuXHJcbiAgICovXHJcbiAgaGlkZVNlYXJjaDogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIFRydWUgdG8gYWxsb3cgc2VsZWN0aW9ucyB2aWEgdGhlIFNlbGVjdGlvbk1vZGVsIGluIHRoZSB2aWV3LlxyXG4gICAqL1xyXG4gIGFsbG93U2VsZWN0aW9uOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogVHJ1ZSB0byBjbGVhciB0aGUgc2VsZWN0aW9uIG1vZGVsIHdoZW4gdGhlIHZpZXcgaXMgc2hvd24uXHJcbiAgICovXHJcbiAgYXV0b0NsZWFyU2VsZWN0aW9uOiB0cnVlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nL1ZpZXd9XHJcbiAgICogVGhlIGlkIG9mIHRoZSBkZXRhaWwgdmlldywgb3IgdmlldyBpbnN0YW5jZSwgdG8gc2hvdyB3aGVuIGEgcm93IGlzIGNsaWNrZWQuXHJcbiAgICovXHJcbiAgZGV0YWlsVmlldzogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIGlkIG9mIHRoZSBjb25maWd1cmUgdmlldyBmb3IgcXVpY2sgYWN0aW9uIHByZWZlcmVuY2VzXHJcbiAgICovXHJcbiAgcXVpY2tBY3Rpb25Db25maWd1cmVWaWV3OiAnY29uZmlndXJlX3F1aWNrYWN0aW9ucycsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHZpZXcgaWQgdG8gc2hvdyBpZiB0aGVyZSBpcyBubyBgaW5zZXJ0Vmlld2Agc3BlY2lmaWVkLCB3aGVuXHJcbiAgICogdGhlIHtAbGluayAjbmF2aWdhdGVUb0luc2VydFZpZXd9IGFjdGlvbiBpcyBpbnZva2VkLlxyXG4gICAqL1xyXG4gIGVkaXRWaWV3OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSB2aWV3IGlkIHRvIHNob3cgd2hlbiB0aGUge0BsaW5rICNuYXZpZ2F0ZVRvSW5zZXJ0Vmlld30gYWN0aW9uIGlzIGludm9rZWQuXHJcbiAgICovXHJcbiAgaW5zZXJ0VmlldzogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdmlldyBpZCB0byBzaG93IHdoZW4gdGhlIHtAbGluayAjbmF2aWdhdGVUb0NvbnRleHRWaWV3fSBhY3Rpb24gaXMgaW52b2tlZC5cclxuICAgKi9cclxuICBjb250ZXh0VmlldzogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogQSBkaWN0aW9uYXJ5IG9mIGhhc2ggdGFnIHNlYXJjaCBxdWVyaWVzLiAgVGhlIGtleSBpcyB0aGUgaGFzaCB0YWcsIHdpdGhvdXQgdGhlIHN5bWJvbCwgYW5kIHRoZSB2YWx1ZSBpc1xyXG4gICAqIGVpdGhlciBhIHF1ZXJ5IHN0cmluZywgb3IgYSBmdW5jdGlvbiB0aGF0IHJldHVybnMgYSBxdWVyeSBzdHJpbmcuXHJcbiAgICovXHJcbiAgaGFzaFRhZ1F1ZXJpZXM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogVGhlIHRleHQgZGlzcGxheWVkIGluIHRoZSBtb3JlIGJ1dHRvbi5cclxuICAgKiBAdHlwZSB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIG1vcmVUZXh0OiByZXNvdXJjZS5tb3JlVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBkaXNwbGF5ZWQgaW4gdGhlIGVtcHR5U2VsZWN0aW9uIGJ1dHRvbi5cclxuICAgKi9cclxuICBlbXB0eVNlbGVjdGlvblRleHQ6IHJlc291cmNlLmVtcHR5U2VsZWN0aW9uVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBkaXNwbGF5ZWQgYXMgdGhlIGRlZmF1bHQgdGl0bGUuXHJcbiAgICovXHJcbiAgdGl0bGVUZXh0OiByZXNvdXJjZS50aXRsZVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgZGlzcGxheWVkIGZvciBxdWljayBhY3Rpb24gY29uZmlndXJlLlxyXG4gICAqL1xyXG4gIGNvbmZpZ3VyZVRleHQ6IHJlc291cmNlLmNvbmZpZ3VyZVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIGVycm9yIG1lc3NhZ2UgdG8gZGlzcGxheSBpZiByZW5kZXJpbmcgYSByb3cgdGVtcGxhdGUgaXMgbm90IHN1Y2Nlc3NmdWwuXHJcbiAgICovXHJcbiAgZXJyb3JSZW5kZXJUZXh0OiByZXNvdXJjZS5lcnJvclJlbmRlclRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKlxyXG4gICAqL1xyXG4gIHJvd1RlbXBsYXRlRXJyb3I6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBkYXRhLWFjdGlvbj1cImFjdGl2YXRlRW50cnlcIiBkYXRhLWtleT1cInslPSAkWyQkLmlkUHJvcGVydHldICV9XCIgZGF0YS1kZXNjcmlwdG9yPVwieyU6ICRbJCQubGFiZWxQcm9wZXJ0eV0gJX1cIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0tY29udGVudFwiPnslOiAkJC5lcnJvclJlbmRlclRleHQgJX08L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIGZvcm1hdCBzdHJpbmcgZm9yIHRoZSB0ZXh0IGRpc3BsYXllZCBmb3IgdGhlIHJlbWFpbmluZyByZWNvcmQgY291bnQuICBUaGlzIGlzIHVzZWQgaW4gYSB7QGxpbmsgU3RyaW5nI2Zvcm1hdH0gY2FsbC5cclxuICAgKi9cclxuICByZW1haW5pbmdUZXh0OiByZXNvdXJjZS5yZW1haW5pbmdUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSB0ZXh0IGRpc3BsYXllZCBvbiB0aGUgY2FuY2VsIGJ1dHRvbi5cclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIGNhbmNlbFRleHQ6IHJlc291cmNlLmNhbmNlbFRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgZGlzcGxheWVkIG9uIHRoZSBpbnNlcnQgYnV0dG9uLlxyXG4gICAqIEBkZXByZWNhdGVkXHJcbiAgICovXHJcbiAgaW5zZXJ0VGV4dDogcmVzb3VyY2UuaW5zZXJ0VGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBkaXNwbGF5ZWQgd2hlbiBubyByZWNvcmRzIGFyZSBhdmFpbGFibGUuXHJcbiAgICovXHJcbiAgbm9EYXRhVGV4dDogcmVzb3VyY2Uubm9EYXRhVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBkaXNwbGF5ZWQgd2hlbiBkYXRhIGlzIGJlaW5nIHJlcXVlc3RlZC5cclxuICAgKi9cclxuICBsb2FkaW5nVGV4dDogcmVzb3VyY2UubG9hZGluZ1RleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgZGlzcGxheWVkIGluIHRvb2x0aXAgZm9yIHRoZSBuZXcgYnV0dG9uLlxyXG4gICAqL1xyXG4gIG5ld1Rvb2x0aXBUZXh0OiByZXNvdXJjZS5uZXdUb29sdGlwVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBkaXNwbGF5ZWQgaW4gdG9vbHRpcCBmb3IgdGhlIHJlZnJlc2ggYnV0dG9uLlxyXG4gICAqL1xyXG4gIHJlZnJlc2hUb29sdGlwVGV4dDogcmVzb3VyY2UucmVmcmVzaFRvb2x0aXBUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSBjdXN0b21pemF0aW9uIGlkZW50aWZpZXIgZm9yIHRoaXMgY2xhc3MuIFdoZW4gYSBjdXN0b21pemF0aW9uIGlzIHJlZ2lzdGVyZWQgaXQgaXMgcGFzc2VkXHJcbiAgICogYSBwYXRoL2lkZW50aWZpZXIgd2hpY2ggaXMgdGhlbiBtYXRjaGVkIHRvIHRoaXMgcHJvcGVydHkuXHJcbiAgICovXHJcbiAgY3VzdG9taXphdGlvblNldDogJ2xpc3QnLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSByZWxhdGl2ZSBwYXRoIHRvIHRoZSBjaGVja21hcmsgb3Igc2VsZWN0IGljb24gZm9yIHJvdyBzZWxlY3RvclxyXG4gICAqL1xyXG4gIHNlbGVjdEljb246ICdjaGVjaycsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogQ1NTIGNsYXNzIHRvIHVzZSBmb3IgY2hlY2ttYXJrIG9yIHNlbGVjdCBpY29uIGZvciByb3cgc2VsZWN0b3IuIE92ZXJyaWRlcyBzZWxlY3RJY29uLlxyXG4gICAqL1xyXG4gIHNlbGVjdEljb25DbGFzczogJycsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIHNlYXJjaCB3aWRnZXQgaW5zdGFuY2UgZm9yIHRoZSB2aWV3XHJcbiAgICovXHJcbiAgc2VhcmNoV2lkZ2V0OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2VhcmNoV2lkZ2V0fVxyXG4gICAqIFRoZSBjbGFzcyBjb25zdHJ1Y3RvciB0byB1c2UgZm9yIHRoZSBzZWFyY2ggd2lkZ2V0XHJcbiAgICovXHJcbiAgc2VhcmNoV2lkZ2V0Q2xhc3M6IFNlYXJjaFdpZGdldCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogRmxhZyB0byBpbmRpY2F0ZSB0aGUgZGVmYXVsdCBzZWFyY2ggdGVybSBoYXMgYmVlbiBzZXQuXHJcbiAgICovXHJcbiAgZGVmYXVsdFNlYXJjaFRlcm1TZXQ6IGZhbHNlLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgZGVmYXVsdCBzZWFyY2ggdGVybSB0byB1c2VcclxuICAgKi9cclxuICBkZWZhdWx0U2VhcmNoVGVybTogJycsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSBjdXJyZW50IHNlYXJjaCB0ZXJtIGJlaW5nIHVzZWQgZm9yIHRoZSBjdXJyZW50IHJlcXVlc3REYXRhKCkuXHJcbiAgICovXHJcbiAgY3VycmVudFNlYXJjaEV4cHJlc3Npb246ICcnLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFRoZSBzZWxlY3Rpb24gbW9kZWwgZm9yIHRoZSB2aWV3XHJcbiAgICovXHJcbiAgX3NlbGVjdGlvbk1vZGVsOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFRoZSBzZWxlY3Rpb24gZXZlbnQgY29ubmVjdGlvbnNcclxuICAgKi9cclxuICBfc2VsZWN0aW9uQ29ubmVjdHM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtPYmplY3R9XHJcbiAgICogVGhlIHRvb2xiYXIgbGF5b3V0IGRlZmluaXRpb24gZm9yIGFsbCB0b29sYmFyIGVudHJpZXMuXHJcbiAgICovXHJcbiAgdG9vbHM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogVGhlIGxpc3QgYWN0aW9uIGxheW91dCBkZWZpbml0aW9uIGZvciB0aGUgbGlzdCBhY3Rpb24gYmFyLlxyXG4gICAqL1xyXG4gIGFjdGlvbnM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBJZiB0cnVlLCB3aWxsIHJlbW92ZSB0aGUgbG9hZGluZyBidXR0b24gYW5kIGF1dG8gZmV0Y2ggbW9yZSBkYXRhIHdoZW4gdGhlIHVzZXIgc2Nyb2xscyB0byB0aGUgYm90dG9tIG9mIHRoZSBwYWdlLlxyXG4gICAqL1xyXG4gIGNvbnRpbnVvdXNTY3JvbGxpbmc6IHRydWUsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBJbmRpY2F0ZXMgaWYgdGhlIGxpc3QgaXMgbG9hZGluZ1xyXG4gICAqL1xyXG4gIGxpc3RMb2FkaW5nOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59XHJcbiAgICogRmxhZ3MgaWYgdGhlIHZpZXcgaXMgbXVsdGkgY29sdW1uIG9yIHNpbmdsZSBjb2x1bW4uXHJcbiAgICovXHJcbiAgbXVsdGlDb2x1bW5WaWV3OiB0cnVlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7c3RyaW5nfVxyXG4gICAqIFNvSG8gY2xhc3MgdG8gYmUgYXBwbGllZCBvbiBtdWx0aSBjb2x1bW4uXHJcbiAgICovXHJcbiAgbXVsdGlDb2x1bW5DbGFzczogJ2ZvdXInLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7bnVtYmVyfVxyXG4gICAqIE51bWJlciBvZiBjb2x1bW5zIGluIHZpZXdcclxuICAgKi9cclxuICBtdWx0aUNvbHVtbkNvdW50OiAzLFxyXG4gIC8vIFN0b3JlIHByb3BlcnRpZXNcclxuICBpdGVtc1Byb3BlcnR5OiAnJyxcclxuICBpZFByb3BlcnR5OiAnJyxcclxuICBsYWJlbFByb3BlcnR5OiAnJyxcclxuICBlbnRpdHlQcm9wZXJ0eTogJycsXHJcbiAgdmVyc2lvblByb3BlcnR5OiAnJyxcclxuICBpc1JlZnJlc2hpbmc6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIHRpdGxlIHRvIGNhcmRcclxuICAgKi9cclxuICBnZXRUaXRsZTogZnVuY3Rpb24gZ2V0VGl0bGUoZW50cnksIGxhYmVsUHJvcGVydHkpIHtcclxuICAgIHJldHVybiB0aGlzLnV0aWxpdHkuZ2V0VmFsdWUoZW50cnksIGxhYmVsUHJvcGVydHkpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0dGVyIG1ldGhvZCBmb3IgdGhlIHNlbGVjdGlvbiBtb2RlbCwgYWxzbyBiaW5kcyB0aGUgdmFyaW91cyBzZWxlY3Rpb24gbW9kZWwgc2VsZWN0IGV2ZW50c1xyXG4gICAqIHRvIHRoZSByZXNwZWN0aXZlIExpc3QgZXZlbnQgaGFuZGxlciBmb3IgZWFjaC5cclxuICAgKiBAcGFyYW0ge1NlbGVjdGlvbk1vZGVsfSBzZWxlY3Rpb25Nb2RlbCBUaGUgc2VsZWN0aW9uIG1vZGVsIGluc3RhbmNlIHRvIHNhdmUgdG8gdGhlIHZpZXdcclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIF9zZXRTZWxlY3Rpb25Nb2RlbEF0dHI6IGZ1bmN0aW9uIF9zZXRTZWxlY3Rpb25Nb2RlbEF0dHIoc2VsZWN0aW9uTW9kZWwpIHtcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Db25uZWN0cykge1xyXG4gICAgICB0aGlzLl9zZWxlY3Rpb25Db25uZWN0cy5mb3JFYWNoKHRoaXMuZGlzY29ubmVjdCwgdGhpcyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwgPSBzZWxlY3Rpb25Nb2RlbDtcclxuICAgIHRoaXMuX3NlbGVjdGlvbkNvbm5lY3RzID0gW107XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGlvbkNvbm5lY3RzLnB1c2goXHJcbiAgICAgICAgdGhpcy5jb25uZWN0KHRoaXMuX3NlbGVjdGlvbk1vZGVsLCAnb25TZWxlY3QnLCB0aGlzLl9vblNlbGVjdGlvbk1vZGVsU2VsZWN0KSxcclxuICAgICAgICB0aGlzLmNvbm5lY3QodGhpcy5fc2VsZWN0aW9uTW9kZWwsICdvbkRlc2VsZWN0JywgdGhpcy5fb25TZWxlY3Rpb25Nb2RlbERlc2VsZWN0KSxcclxuICAgICAgICB0aGlzLmNvbm5lY3QodGhpcy5fc2VsZWN0aW9uTW9kZWwsICdvbkNsZWFyJywgdGhpcy5fb25TZWxlY3Rpb25Nb2RlbENsZWFyKVxyXG4gICAgICApO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogR2V0dGVyIG5tZXRob2QgZm9yIHRoZSBzZWxlY3Rpb24gbW9kZWxcclxuICAgKiBAcmV0dXJuIHtTZWxlY3Rpb25Nb2RlbH1cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIF9nZXRTZWxlY3Rpb25Nb2RlbEF0dHI6IGZ1bmN0aW9uIF9nZXRTZWxlY3Rpb25Nb2RlbEF0dHIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5fc2VsZWN0aW9uTW9kZWw7XHJcbiAgfSxcclxuICBjb25zdHJ1Y3RvcjogZnVuY3Rpb24gY29uc3RydWN0b3Iob3B0aW9ucykge1xyXG4gICAgdGhpcy5lbnRyaWVzID0ge307XHJcbiAgICB0aGlzLl9sb2FkZWRTZWxlY3Rpb25zID0ge307XHJcblxyXG4gICAgLy8gYmFja3dhcmQgY29tcGF0aWJpbGl0eSBmb3IgZGlzYWJsZVJpZ2h0RHJhd2VyIHByb3BlcnR5LiBUbyBiZSByZW1vdmVkIGFmdGVyIDQuMFxyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5kaXNhYmxlUmlnaHREcmF3ZXIpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdkaXNhYmxlUmlnaHREcmF3ZXIgcHJvcGVydHkgaXMgZGVwcmFjYXRlZC4gVXNlIGhhc1NldHRpbmdzIHByb3BlcnR5IGluc3RlYWQuIGRpc2FibGVSaWdodERyYXdlciA9ICFoYXNTZXR0aW5ncycpOyAgLy9lc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIHRoaXMuaGFzU2V0dGluZ3MgPSBmYWxzZTtcclxuICAgIH1cclxuICB9LFxyXG4gIGluaXRTb2hvOiBmdW5jdGlvbiBpbml0U29obygpIHtcclxuICAgIGNvbnN0IHRvb2xiYXIgPSAkKCcudG9vbGJhcicsIHRoaXMuZG9tTm9kZSkuZmlyc3QoKTtcclxuICAgIHRvb2xiYXIudG9vbGJhcigpO1xyXG4gICAgdGhpcy50b29sYmFyID0gdG9vbGJhci5kYXRhKCd0b29sYmFyJyk7XHJcbiAgICAkKCdbZGF0YS1hY3Rpb249b3BlblNldHRpbmdzXScsIHRoaXMuZG9tTm9kZSkub24oJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICB0aGlzLm9wZW5TZXR0aW5ncygpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBvcGVuU2V0dGluZ3M6IGZ1bmN0aW9uIG9wZW5TZXR0aW5ncygpIHtcclxuICB9LFxyXG4gIHVwZGF0ZVNvaG86IGZ1bmN0aW9uIHVwZGF0ZVNvaG8oKSB7XHJcbiAgICB0aGlzLnRvb2xiYXIudXBkYXRlZCgpO1xyXG4gIH0sXHJcbiAgX29uTGlzdFZpZXdTZWxlY3RlZDogZnVuY3Rpb24gX29uTGlzdFZpZXdTZWxlY3RlZCgpIHtcclxuICAgIGNvbnNvbGUuZGlyKGFyZ3VtZW50cyk7IC8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gIH0sXHJcbiAgcG9zdENyZWF0ZTogZnVuY3Rpb24gcG9zdENyZWF0ZSgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHBvc3RDcmVhdGUsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsID09PSBudWxsKSB7XHJcbiAgICAgIHRoaXMuc2V0KCdzZWxlY3Rpb25Nb2RlbCcsIG5ldyBDb25maWd1cmFibGVTZWxlY3Rpb25Nb2RlbCgpKTtcclxuICAgIH1cclxuICAgIHRoaXMuc3Vic2NyaWJlKCcvYXBwL3JlZnJlc2gnLCB0aGlzLl9vblJlZnJlc2gpO1xyXG5cclxuICAgIGlmICh0aGlzLmVuYWJsZVNlYXJjaCkge1xyXG4gICAgICBjb25zdCBTZWFyY2hXaWRnZXRDdG9yID0gbGFuZy5pc1N0cmluZyh0aGlzLnNlYXJjaFdpZGdldENsYXNzKSA/IGxhbmcuZ2V0T2JqZWN0KHRoaXMuc2VhcmNoV2lkZ2V0Q2xhc3MsIGZhbHNlKSA6IHRoaXMuc2VhcmNoV2lkZ2V0Q2xhc3M7XHJcblxyXG4gICAgICB0aGlzLnNlYXJjaFdpZGdldCA9IHRoaXMuc2VhcmNoV2lkZ2V0IHx8IG5ldyBTZWFyY2hXaWRnZXRDdG9yKHtcclxuICAgICAgICBjbGFzczogJ2xpc3Qtc2VhcmNoJyxcclxuICAgICAgICBvd25lcjogdGhpcyxcclxuICAgICAgICBvblNlYXJjaEV4cHJlc3Npb246IHRoaXMuX29uU2VhcmNoRXhwcmVzc2lvbi5iaW5kKHRoaXMpLFxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5zZWFyY2hXaWRnZXQucGxhY2VBdCh0aGlzLnNlYXJjaE5vZGUsICdyZXBsYWNlJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNlYXJjaFdpZGdldCA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuaGlkZVNlYXJjaCB8fCAhdGhpcy5lbmFibGVTZWFyY2gpIHtcclxuICAgICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKCdsaXN0LWhpZGUtc2VhcmNoJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5jbGVhcigpO1xyXG5cclxuICAgIHRoaXMuaW5pdFB1bGxUb1JlZnJlc2godGhpcy5zY3JvbGxlck5vZGUpO1xyXG4gIH0sXHJcbiAgc2hvdWxkU3RhcnRQdWxsVG9SZWZyZXNoOiBmdW5jdGlvbiBzaG91bGRTdGFydFB1bGxUb1JlZnJlc2goKSB7XHJcbiAgICAvLyBHZXQgdGhlIGJhc2UgcmVzdWx0c1xyXG4gICAgY29uc3Qgc2hvdWxkU3RhcnQgPSB0aGlzLmluaGVyaXRlZChzaG91bGRTdGFydFB1bGxUb1JlZnJlc2gsIGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCBzZWxlY3RlZCA9ICQodGhpcy5kb21Ob2RlKS5hdHRyKCdzZWxlY3RlZCcpO1xyXG4gICAgY29uc3QgYWN0aW9uTm9kZSA9ICQodGhpcy5kb21Ob2RlKS5maW5kKCcuYnRuLWFjdGlvbnMuaXMtb3BlbicpO1xyXG4gICAgY29uc3QgYWN0aW9uc09wZW4gPSBhY3Rpb25Ob2RlLmxlbmd0aCA+IDA7XHJcbiAgICByZXR1cm4gc2hvdWxkU3RhcnQgJiYgc2VsZWN0ZWQgPT09ICdzZWxlY3RlZCcgJiYgIXRoaXMubGlzdExvYWRpbmcgJiYgIWFjdGlvbnNPcGVuO1xyXG4gIH0sXHJcbiAgZm9yY2VSZWZyZXNoOiBmdW5jdGlvbiBmb3JjZVJlZnJlc2goKSB7XHJcbiAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcbiAgICB0aGlzLnJlZnJlc2goKTtcclxuICB9LFxyXG4gIG9uUHVsbFRvUmVmcmVzaENvbXBsZXRlOiBmdW5jdGlvbiBvblB1bGxUb1JlZnJlc2hDb21wbGV0ZSgpIHtcclxuICAgIHRoaXMuZm9yY2VSZWZyZXNoKCk7XHJcbiAgfSxcclxuICBvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZTogZnVuY3Rpb24gb25Db25uZWN0aW9uU3RhdGVDaGFuZ2Uoc3RhdGUpIHtcclxuICAgIGlmIChzdGF0ZSA9PT0gdHJ1ZSAmJiB0aGlzLmVuYWJsZU9mZmxpbmVTdXBwb3J0KSB7XHJcbiAgICAgIHRoaXMucmVmcmVzaFJlcXVpcmVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBvbiBhcHBsaWNhdGlvbiBzdGFydHVwIHRvIGNvbmZpZ3VyZSB0aGUgc2VhcmNoIHdpZGdldCBpZiBwcmVzZW50IGFuZCBjcmVhdGUgdGhlIGxpc3QgYWN0aW9ucy5cclxuICAgKi9cclxuICBzdGFydHVwOiBmdW5jdGlvbiBzdGFydHVwKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoc3RhcnR1cCwgYXJndW1lbnRzKTtcclxuXHJcbiAgICBpZiAodGhpcy5zZWFyY2hXaWRnZXQpIHtcclxuICAgICAgdGhpcy5zZWFyY2hXaWRnZXQuY29uZmlndXJlKHtcclxuICAgICAgICBoYXNoVGFnUXVlcmllczogdGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dCh0aGlzLmNyZWF0ZUhhc2hUYWdRdWVyeUxheW91dCgpLCAnaGFzaFRhZ1F1ZXJpZXMnKSxcclxuICAgICAgICBmb3JtYXRTZWFyY2hRdWVyeTogdGhpcy5mb3JtYXRTZWFyY2hRdWVyeS5iaW5kKHRoaXMpLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgZGlqaXQgV2lkZ2V0IHRvIGRlc3Ryb3kgdGhlIHNlYXJjaCB3aWRnZXQgYmVmb3JlIGRlc3Ryb3lpbmcgdGhlIHZpZXcuXHJcbiAgICovXHJcbiAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgIGlmICh0aGlzLnNlYXJjaFdpZGdldCkge1xyXG4gICAgICBpZiAoIXRoaXMuc2VhcmNoV2lkZ2V0Ll9kZXN0cm95ZWQpIHtcclxuICAgICAgICB0aGlzLnNlYXJjaFdpZGdldC5kZXN0cm95UmVjdXJzaXZlKCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGRlbGV0ZSB0aGlzLnNlYXJjaFdpZGdldDtcclxuICAgIH1cclxuXHJcbiAgICBkZWxldGUgdGhpcy5zdG9yZTtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGRlc3Ryb3ksIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBfZ2V0U3RvcmVBdHRyOiBmdW5jdGlvbiBfZ2V0U3RvcmVBdHRyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc3RvcmUgfHwgKHRoaXMuc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKCkpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2hvd3Mgb3ZlcnJpZGVzIHRoZSB2aWV3IGNsYXNzIHRvIHNldCBvcHRpb25zIGZvciB0aGUgbGlzdCB2aWV3IGFuZCB0aGVuIGNhbGxzIHRoZSBpbmhlcml0ZWQgc2hvdyBtZXRob2Qgb24gdGhlIHZpZXcuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG5hdmlnYXRpb24gb3B0aW9ucyBwYXNzZWQgZnJvbSB0aGUgcHJldmlvdXMgdmlldy5cclxuICAgKiBAcGFyYW0gdHJhbnNpdGlvbk9wdGlvbnMge09iamVjdH0gT3B0aW9uYWwgdHJhbnNpdGlvbiBvYmplY3QgdGhhdCBpcyBmb3J3YXJkZWQgdG8gUmVVSS5cclxuICAgKi9cclxuICBzaG93OiBmdW5jdGlvbiBzaG93KG9wdGlvbnMgLyogLCB0cmFuc2l0aW9uT3B0aW9ucyovKSB7XHJcbiAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICBpZiAob3B0aW9ucy5yZXNldFNlYXJjaCkge1xyXG4gICAgICAgIHRoaXMuZGVmYXVsdFNlYXJjaFRlcm1TZXQgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuYWxsb3dFbXB0eVNlbGVjdGlvbiA9PT0gZmFsc2UgJiYgdGhpcy5fc2VsZWN0aW9uTW9kZWwpIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5yZXF1aXJlU2VsZWN0aW9uID0gdHJ1ZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuaW5oZXJpdGVkKHNob3csIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIGFuZCByZXR1cm5zIHRoZSB0b29sYmFyIGl0ZW0gbGF5b3V0IGRlZmluaXRpb24sIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gaW4gdGhlIHZpZXdcclxuICAgKiBzbyB0aGF0IHlvdSBtYXkgZGVmaW5lIHRoZSB2aWV3cyB0b29sYmFyIGVudHJpZXMuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzLnRvb2xzXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICovXHJcbiAgY3JlYXRlVG9vbExheW91dDogZnVuY3Rpb24gY3JlYXRlVG9vbExheW91dCgpIHtcclxuICAgIGNvbnN0IHRvb2xiYXIgPSB0aGlzLnRvb2xzIHx8ICh0aGlzLnRvb2xzID0ge1xyXG4gICAgICB0YmFyOiBbe1xyXG4gICAgICAgIGlkOiAnbmV3JyxcclxuICAgICAgICBzdmc6ICdhZGQnLFxyXG4gICAgICAgIHRpdGxlOiB0aGlzLm5ld1Rvb2x0aXBUZXh0LFxyXG4gICAgICAgIGFjdGlvbjogJ25hdmlnYXRlVG9JbnNlcnRWaWV3JyxcclxuICAgICAgICBzZWN1cml0eTogdGhpcy5hcHAuZ2V0Vmlld1NlY3VyaXR5KHRoaXMuaW5zZXJ0VmlldywgJ2luc2VydCcpLFxyXG4gICAgICB9XSxcclxuICAgIH0pO1xyXG4gICAgaWYgKCh0b29sYmFyLnRiYXIgJiYgIXRoaXMuX3JlZnJlc2hBZGRlZCkgJiYgIXdpbmRvdy5BcHAuc3VwcG9ydHNUb3VjaCgpKSB7XHJcbiAgICAgIHRoaXMudG9vbHMudGJhci5wdXNoKHtcclxuICAgICAgICBpZDogJ3JlZnJlc2gnLFxyXG4gICAgICAgIHN2ZzogJ3JlZnJlc2gnLFxyXG4gICAgICAgIHRpdGxlOiB0aGlzLnJlZnJlc2hUb29sdGlwVGV4dCxcclxuICAgICAgICBhY3Rpb246ICdfcmVmcmVzaExpc3QnLFxyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5fcmVmcmVzaEFkZGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzLnRvb2xzO1xyXG4gIH0sXHJcbiAgY3JlYXRlRXJyb3JIYW5kbGVyczogZnVuY3Rpb24gY3JlYXRlRXJyb3JIYW5kbGVycygpIHtcclxuICAgIHRoaXMuZXJyb3JIYW5kbGVycyA9IHRoaXMuZXJyb3JIYW5kbGVycyB8fCBbe1xyXG4gICAgICBuYW1lOiAnQWJvcnRlZCcsXHJcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIHRlc3RBYm9ydGVkKGVycm9yKSB7XHJcbiAgICAgICAgcmV0dXJuIGVycm9yLmFib3J0ZWQ7XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gaGFuZGxlQWJvcnRlZChlcnJvciwgbmV4dCkge1xyXG4gICAgICAgIHRoaXMuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9LFxyXG4gICAgfSwge1xyXG4gICAgICBuYW1lOiAnQWxlcnRFcnJvcicsXHJcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIHRlc3RFcnJvcihlcnJvcikge1xyXG4gICAgICAgIHJldHVybiAhZXJyb3IuYWJvcnRlZDtcclxuICAgICAgfSxcclxuICAgICAgaGFuZGxlOiBmdW5jdGlvbiBoYW5kbGVFcnJvcihlcnJvciwgbmV4dCkge1xyXG4gICAgICAgIGFsZXJ0KHRoaXMuZ2V0RXJyb3JNZXNzYWdlKGVycm9yKSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH0sXHJcbiAgICB9LCB7XHJcbiAgICAgIG5hbWU6ICdDYXRjaEFsbCcsXHJcbiAgICAgIHRlc3Q6IGZ1bmN0aW9uIHRlc3RDYXRjaEFsbCgpIHtcclxuICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgfSxcclxuICAgICAgaGFuZGxlOiBmdW5jdGlvbiBoYW5kbGVDYXRjaEFsbChlcnJvciwgbmV4dCkge1xyXG4gICAgICAgIHRoaXMuX2xvZ0Vycm9yKGVycm9yKTtcclxuICAgICAgICB0aGlzLl9jbGVhckxvYWRpbmcoKTtcclxuICAgICAgICBuZXh0KCk7XHJcbiAgICAgIH0sXHJcbiAgICB9XTtcclxuXHJcbiAgICByZXR1cm4gdGhpcy5lcnJvckhhbmRsZXJzO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyBhbmQgcmV0dXJucyB0aGUgbGlzdC1hY3Rpb24gYWN0aW9ucyBsYXlvdXQgZGVmaW5pdGlvbiwgdGhpcyBtZXRob2Qgc2hvdWxkIGJlIG92ZXJyaWRlbiBpbiB0aGUgdmlld1xyXG4gICAqIHNvIHRoYXQgeW91IG1heSBkZWZpbmUgdGhlIGFjdGlvbiBlbnRyaWVzIGZvciB0aGF0IHZpZXcuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSB0aGlzLmFjdHRpb25zXHJcbiAgICovXHJcbiAgY3JlYXRlQWN0aW9uTGF5b3V0OiBmdW5jdGlvbiBjcmVhdGVBY3Rpb25MYXlvdXQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hY3Rpb25zIHx8IFtdO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ3JlYXRlcyB0aGUgYWN0aW9uIGJhciBhbmQgYWRkcyBpdCB0byB0aGUgRE9NLiBOb3RlIHRoYXQgaXQgcmVwbGFjZXMgYHRoaXMuYWN0aW9uc2Agd2l0aCB0aGUgcGFzc2VkXHJcbiAgICogcGFyYW0gYXMgdGhlIHBhc3NlZCBwYXJhbSBzaG91bGQgYmUgdGhlIHJlc3VsdCBvZiB0aGUgY3VzdG9taXphdGlvbiBtaXhpbiBhbmQgYHRoaXMuYWN0aW9uc2AgbmVlZHMgdG8gYmUgdGhlXHJcbiAgICogZmluYWwgYWN0aW9ucyBzdGF0ZS5cclxuICAgKiBAcGFyYW0ge09iamVjdFtdfSBhY3Rpb25zXHJcbiAgICovXHJcbiAgY3JlYXRlQWN0aW9uczogZnVuY3Rpb24gY3JlYXRlQWN0aW9ucyhhKSB7XHJcbiAgICBsZXQgYWN0aW9ucyA9IGE7XHJcbiAgICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zLnJlZHVjZSh0aGlzLl9yZW1vdmVBY3Rpb25EdXBsaWNhdGVzLCBbXSk7XHJcbiAgICB0aGlzLnZpc2libGVBY3Rpb25zID0gW107XHJcblxyXG5cclxuICAgIHRoaXMuZW5zdXJlUXVpY2tBY3Rpb25QcmVmcygpO1xyXG5cclxuICAgIC8vIFBsdWNrIG91dCBvdXIgc3lzdGVtIGFjdGlvbnMgdGhhdCBhcmUgTk9UIHNhdmVkIGluIHByZWZlcmVuY2VzXHJcbiAgICBsZXQgc3lzdGVtQWN0aW9ucyA9IGFjdGlvbnMuZmlsdGVyKChhY3Rpb24pID0+IHtcclxuICAgICAgcmV0dXJuIGFjdGlvbiAmJiBhY3Rpb24uc3lzdGVtQWN0aW9uO1xyXG4gICAgfSk7XHJcblxyXG4gICAgc3lzdGVtQWN0aW9ucyA9IHN5c3RlbUFjdGlvbnMucmVkdWNlKHRoaXMuX3JlbW92ZUFjdGlvbkR1cGxpY2F0ZXMsIFtdKTtcclxuXHJcbiAgICAvLyBHcmFiIHF1aWNrIGFjdGlvbnMgZnJvbSB0aGUgdXNlcnMgcHJlZmVyZW5jZXMgKG9yZGVyZWQgYW5kIG1hZGUgdmlzaWJsZSBhY2NvcmRpbmcgdG8gdXNlcilcclxuICAgIGxldCBwcmVmQWN0aW9ucztcclxuICAgIGlmICh0aGlzLmFwcC5wcmVmZXJlbmNlcyAmJiB0aGlzLmFwcC5wcmVmZXJlbmNlcy5xdWlja0FjdGlvbnMpIHtcclxuICAgICAgcHJlZkFjdGlvbnMgPSB0aGlzLmFwcC5wcmVmZXJlbmNlcy5xdWlja0FjdGlvbnNbdGhpcy5pZF07XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN5c3RlbUFjdGlvbnMgJiYgcHJlZkFjdGlvbnMpIHtcclxuICAgICAgLy8gRGlzcGxheSBzeXN0ZW0gYWN0aW9ucyBmaXJzdCwgdGhlbiB0aGUgb3JkZXIgb2Ygd2hhdCB0aGUgdXNlciBzcGVjaWZpZWRcclxuICAgICAgYWN0aW9ucyA9IHN5c3RlbUFjdGlvbnMuY29uY2F0KHByZWZBY3Rpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB2aXNpYmxlQWN0aW9ucyA9IFtdO1xyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBhY3Rpb24gPSBhY3Rpb25zW2ldO1xyXG5cclxuICAgICAgaWYgKCFhY3Rpb24udmlzaWJsZSkge1xyXG4gICAgICAgIGNvbnRpbnVlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIWFjdGlvbi5zZWN1cml0eSkge1xyXG4gICAgICAgIGNvbnN0IG9yaWcgPSBhLmZpbmQoeCA9PiB4LmlkID09PSBhY3Rpb24uaWQpO1xyXG4gICAgICAgIGlmIChvcmlnICYmIG9yaWcuc2VjdXJpdHkpIHtcclxuICAgICAgICAgIGFjdGlvbi5zZWN1cml0eSA9IG9yaWcuc2VjdXJpdHk7IC8vIFJlc2V0IHRoZSBzZWN1cml0eSB2YWx1ZVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICBhY3Rpb25JbmRleDogdmlzaWJsZUFjdGlvbnMubGVuZ3RoLFxyXG4gICAgICAgIGhhc0FjY2VzczogKCFhY3Rpb24uc2VjdXJpdHkgfHwgKGFjdGlvbi5zZWN1cml0eSAmJiB0aGlzLmFwcC5oYXNBY2Nlc3NUbyh0aGlzLmV4cGFuZEV4cHJlc3Npb24oYWN0aW9uLnNlY3VyaXR5KSkpKSA/IHRydWUgOiBmYWxzZSxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIGxhbmcubWl4aW4oYWN0aW9uLCBvcHRpb25zKTtcclxuXHJcbiAgICAgIGNvbnN0IGFjdGlvblRlbXBsYXRlID0gYWN0aW9uLnRlbXBsYXRlIHx8IHRoaXMubGlzdEFjdGlvbkl0ZW1UZW1wbGF0ZTtcclxuICAgICAgYWN0aW9uLnRlbXBsYXRlRG9tID0gJChhY3Rpb25UZW1wbGF0ZS5hcHBseShhY3Rpb24sIGFjdGlvbi5pZCkpO1xyXG5cclxuICAgICAgdmlzaWJsZUFjdGlvbnMucHVzaChhY3Rpb24pO1xyXG4gICAgfVxyXG4gICAgdGhpcy52aXNpYmxlQWN0aW9ucyA9IHZpc2libGVBY3Rpb25zO1xyXG4gIH0sXHJcbiAgY3JlYXRlU3lzdGVtQWN0aW9uTGF5b3V0OiBmdW5jdGlvbiBjcmVhdGVTeXN0ZW1BY3Rpb25MYXlvdXQoYWN0aW9ucyA9IFtdKSB7XHJcbiAgICBjb25zdCBzeXN0ZW1BY3Rpb25zID0gYWN0aW9ucy5maWx0ZXIoKGFjdGlvbikgPT4ge1xyXG4gICAgICByZXR1cm4gYWN0aW9uLnN5c3RlbUFjdGlvbiA9PT0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IG90aGVycyA9IGFjdGlvbnMuZmlsdGVyKChhY3Rpb24pID0+IHtcclxuICAgICAgcmV0dXJuICFhY3Rpb24uc3lzdGVtQWN0aW9uO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKCFvdGhlcnMubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBbXTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3lzdGVtQWN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgcmV0dXJuIHN5c3RlbUFjdGlvbnMuY29uY2F0KG90aGVycyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIFt7XHJcbiAgICAgIGlkOiAnX19lZGl0UHJlZnNfXycsXHJcbiAgICAgIGNsczogJ3NldHRpbmdzJyxcclxuICAgICAgbGFiZWw6IHRoaXMuY29uZmlndXJlVGV4dCxcclxuICAgICAgYWN0aW9uOiAnY29uZmlndXJlUXVpY2tBY3Rpb25zJyxcclxuICAgICAgc3lzdGVtQWN0aW9uOiB0cnVlLFxyXG4gICAgICB2aXNpYmxlOiB0cnVlLFxyXG4gICAgfV0uY29uY2F0KG90aGVycyk7XHJcbiAgfSxcclxuICBjb25maWd1cmVRdWlja0FjdGlvbnM6IGZ1bmN0aW9uIGNvbmZpZ3VyZVF1aWNrQWN0aW9ucygpIHtcclxuICAgIGNvbnN0IHZpZXcgPSBBcHAuZ2V0Vmlldyh0aGlzLnF1aWNrQWN0aW9uQ29uZmlndXJlVmlldyk7XHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICB2aWV3LnNob3coe1xyXG4gICAgICAgIHZpZXdJZDogdGhpcy5pZCxcclxuICAgICAgICBhY3Rpb25zOiB0aGlzLmFjdGlvbnMuZmlsdGVyKChhY3Rpb24pID0+IHtcclxuICAgICAgICAgIC8vIEV4Y2x1ZGUgc3lzdGVtIGFjdGlvbnNcclxuICAgICAgICAgIHJldHVybiBhY3Rpb24gJiYgYWN0aW9uLnN5c3RlbUFjdGlvbiAhPT0gdHJ1ZTtcclxuICAgICAgICB9KSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBzZWxlY3RFbnRyeVNpbGVudDogZnVuY3Rpb24gc2VsZWN0RW50cnlTaWxlbnQoa2V5KSB7XHJcbiAgICBjb25zdCBlbmFibGVBY3Rpb25zID0gdGhpcy5lbmFibGVBY3Rpb25zOyAvLyBwcmVzZXJ2ZSB0aGUgb3JpZ2luYWwgdmFsdWVcclxuICAgIGNvbnN0IHNlbGVjdGlvbk1vZGVsID0gdGhpcy5nZXQoJ3NlbGVjdGlvbk1vZGVsJyk7XHJcbiAgICBsZXQgc2VsZWN0aW9uO1xyXG5cclxuICAgIGlmIChrZXkpIHtcclxuICAgICAgdGhpcy5lbmFibGVBY3Rpb25zID0gZmFsc2U7IC8vIFNldCB0byBmYWxzZSBzbyB0aGUgcXVpY2sgYWN0aW9ucyBtZW51IGRvZXNuJ3QgcG9wIHVwXHJcbiAgICAgIHNlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XHJcbiAgICAgIHNlbGVjdGlvbk1vZGVsLnRvZ2dsZShrZXksIHRoaXMuZW50cmllc1trZXldKTtcclxuICAgICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHNlbGVjdGlvbk1vZGVsLmdldFNlbGVjdGlvbnMoKTtcclxuICAgICAgdGhpcy5lbmFibGVBY3Rpb25zID0gZW5hYmxlQWN0aW9ucztcclxuXHJcbiAgICAgIC8vIFdlIGtub3cgd2UgYXJlIHNpbmdsZSBzZWxlY3QsIHNvIGp1c3QgZ3JhYiB0aGUgZmlyc3Qgc2VsZWN0aW9uXHJcbiAgICAgIGZvciAoY29uc3QgcHJvcCBpbiBzZWxlY3RlZEl0ZW1zKSB7XHJcbiAgICAgICAgaWYgKHNlbGVjdGVkSXRlbXMuaGFzT3duUHJvcGVydHkocHJvcCkpIHtcclxuICAgICAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdGVkSXRlbXNbcHJvcF07XHJcbiAgICAgICAgICBicmVhaztcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gc2VsZWN0aW9uO1xyXG4gIH0sXHJcbiAgaW52b2tlQWN0aW9uSXRlbUJ5OiBmdW5jdGlvbiBpbnZva2VBY3Rpb25JdGVtQnkoYWN0aW9uUHJlZGljYXRlLCBrZXkpIHtcclxuICAgIGNvbnN0IGFjdGlvbnMgPSB0aGlzLnZpc2libGVBY3Rpb25zLmZpbHRlcihhY3Rpb25QcmVkaWNhdGUpO1xyXG4gICAgY29uc3Qgc2VsZWN0aW9uID0gdGhpcy5zZWxlY3RFbnRyeVNpbGVudChrZXkpO1xyXG4gICAgdGhpcy5jaGVja0FjdGlvblN0YXRlKCk7XHJcbiAgICBhY3Rpb25zLmZvckVhY2goKGFjdGlvbikgPT4ge1xyXG4gICAgICB0aGlzLl9pbnZva2VBY3Rpb24oYWN0aW9uLCBzZWxlY3Rpb24pO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBUaGlzIGlzIHRoZSBkYXRhLWFjdGlvbiBoYW5kbGVyIGZvciBsaXN0LWFjdGlvbnMsIGl0IHdpbGwgbG9jYXRlIHRoZSBhY3Rpb24gaW5zdGFuY2Ugdml3IHRoZSBkYXRhLWlkIGF0dHJpYnV0ZVxyXG4gICAqIGFuZCBpbnZva2UgZWl0aGVyIHRoZSBgZm5gIHdpdGggYHNjb3BlYCBvciB0aGUgbmFtZWQgYGFjdGlvbmAgb24gdGhlIGN1cnJlbnQgdmlldy5cclxuICAgKlxyXG4gICAqIFRoZSByZXN1bHRpbmcgZnVuY3Rpb24gYmVpbmcgY2FsbGVkIHdpbGwgYmUgcGFzc2VkIG5vdCBvbmx5IHRoZSBhY3Rpb24gaXRlbSBkZWZpbml0aW9uIGJ1dCBhbHNvXHJcbiAgICogdGhlIGZpcnN0IChvbmx5KSBzZWxlY3Rpb24gZnJvbSB0aGUgbGlzdHMgc2VsZWN0aW9uIG1vZGVsLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgQ29sbGVjdGlvbiBvZiBkYXRhLSBhdHRyaWJ1dGVzIGFscmVhZHkgZ2F0aGVyZWQgZnJvbSB0aGUgbm9kZVxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgY2xpY2svdGFwIGV2ZW50XHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBUaGUgbm9kZSB0aGF0IGludm9rZWQgdGhlIGFjdGlvblxyXG4gICAqL1xyXG4gIGludm9rZUFjdGlvbkl0ZW06IGZ1bmN0aW9uIGludm9rZUFjdGlvbkl0ZW0ocGFyYW1ldGVycywgZXZ0LCBub2RlKSB7XHJcbiAgICBjb25zdCBwb3B1cG1lbnUgPSAkKG5vZGUpXHJcbiAgICAgIC5wYXJlbnQoJ2xpJylcclxuICAgICAgLnBhcmVudCgnLmFjdGlvbnMtcm93JylcclxuICAgICAgLnBhcmVudCgnLnBvcHVwbWVudS13cmFwcGVyJylcclxuICAgICAgLnByZXYoKVxyXG4gICAgICAuZGF0YSgncG9wdXBtZW51Jyk7XHJcbiAgICBpZiAocG9wdXBtZW51KSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHBvcHVwbWVudS5jbG9zZSgpO1xyXG4gICAgICB9LCAxMDApO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGluZGV4ID0gcGFyYW1ldGVycy5pZDtcclxuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMudmlzaWJsZUFjdGlvbnNbaW5kZXhdO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWRJdGVtcyA9IHRoaXMuZ2V0KCdzZWxlY3Rpb25Nb2RlbCcpXHJcbiAgICAgIC5nZXRTZWxlY3Rpb25zKCk7XHJcbiAgICBsZXQgc2VsZWN0aW9uID0gbnVsbDtcclxuXHJcbiAgICBmb3IgKGNvbnN0IGtleSBpbiBzZWxlY3RlZEl0ZW1zKSB7XHJcbiAgICAgIGlmIChzZWxlY3RlZEl0ZW1zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICBzZWxlY3Rpb24gPSBzZWxlY3RlZEl0ZW1zW2tleV07XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuZGVzZWxlY3Qoa2V5KTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5faW52b2tlQWN0aW9uKGFjdGlvbiwgc2VsZWN0aW9uKTtcclxuICB9LFxyXG4gIF9pbnZva2VBY3Rpb246IGZ1bmN0aW9uIF9pbnZva2VBY3Rpb24oYWN0aW9uLCBzZWxlY3Rpb24pIHtcclxuICAgIGlmICghYWN0aW9uLmlzRW5hYmxlZCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFjdGlvbi5mbikge1xyXG4gICAgICBhY3Rpb24uZm4uY2FsbChhY3Rpb24uc2NvcGUgfHwgdGhpcywgYWN0aW9uLCBzZWxlY3Rpb24pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKGFjdGlvbi5hY3Rpb24pIHtcclxuICAgICAgICBpZiAodGhpcy5oYXNBY3Rpb24oYWN0aW9uLmFjdGlvbikpIHtcclxuICAgICAgICAgIHRoaXMuaW52b2tlQWN0aW9uKGFjdGlvbi5hY3Rpb24sIGFjdGlvbiwgc2VsZWN0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCB3aGVuIHNob3dpbmcgdGhlIGFjdGlvbiBiYXIgZm9yIGEgbmV3bHkgc2VsZWN0ZWQgcm93LCBpdCBzZXRzIHRoZSBkaXNhYmxlZCBzdGF0ZSBmb3IgZWFjaCBhY3Rpb25cclxuICAgKiBpdGVtIHVzaW5nIHRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcm93IGFzIGNvbnRleHQgYnkgcGFzc2luZyB0aGUgYWN0aW9uIGluc3RhbmNlIHRoZSBzZWxlY3RlZCByb3cgdG8gdGhlXHJcbiAgICogYWN0aW9uIGl0ZW1zIGBlbmFibGVkYCBwcm9wZXJ0eS5cclxuICAgKi9cclxuICBjaGVja0FjdGlvblN0YXRlOiBmdW5jdGlvbiBjaGVja0FjdGlvblN0YXRlKHJvd05vZGUpIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldCgnc2VsZWN0aW9uTW9kZWwnKVxyXG4gICAgICAuZ2V0U2VsZWN0aW9ucygpO1xyXG4gICAgbGV0IHNlbGVjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gc2VsZWN0ZWRJdGVtcykge1xyXG4gICAgICBpZiAoc2VsZWN0ZWRJdGVtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgc2VsZWN0aW9uID0gc2VsZWN0ZWRJdGVtc1trZXldO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fYXBwbHlTdGF0ZVRvQWN0aW9ucyhzZWxlY3Rpb24sIHJvd05vZGUpO1xyXG4gIH0sXHJcbiAgZ2V0UXVpY2tBY3Rpb25QcmVmczogZnVuY3Rpb24gZ2V0UXVpY2tBY3Rpb25QcmVmcygpIHtcclxuICAgIHJldHVybiB0aGlzLmFwcCAmJiB0aGlzLmFwcC5wcmVmZXJlbmNlcyAmJiB0aGlzLmFwcC5wcmVmZXJlbmNlcy5xdWlja0FjdGlvbnM7XHJcbiAgfSxcclxuICBfcmVtb3ZlQWN0aW9uRHVwbGljYXRlczogZnVuY3Rpb24gX3JlbW92ZUFjdGlvbkR1cGxpY2F0ZXMoYWNjLCBjdXIpIHtcclxuICAgIGNvbnN0IGhhc0lEID0gYWNjLnNvbWUoKGl0ZW0pID0+IHtcclxuICAgICAgcmV0dXJuIGl0ZW0uaWQgPT09IGN1ci5pZDtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghaGFzSUQpIHtcclxuICAgICAgYWNjLnB1c2goY3VyKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gYWNjO1xyXG4gIH0sXHJcbiAgZW5zdXJlUXVpY2tBY3Rpb25QcmVmczogZnVuY3Rpb24gZW5zdXJlUXVpY2tBY3Rpb25QcmVmcygpIHtcclxuICAgIGNvbnN0IGFwcFByZWZzID0gdGhpcy5hcHAgJiYgdGhpcy5hcHAucHJlZmVyZW5jZXM7XHJcbiAgICBsZXQgYWN0aW9uUHJlZnMgPSB0aGlzLmdldFF1aWNrQWN0aW9uUHJlZnMoKTtcclxuICAgIGNvbnN0IGZpbHRlcmVkID0gdGhpcy5hY3Rpb25zLmZpbHRlcigoYWN0aW9uKSA9PiB7XHJcbiAgICAgIHJldHVybiBhY3Rpb24gJiYgYWN0aW9uLnN5c3RlbUFjdGlvbiAhPT0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghdGhpcy5hY3Rpb25zIHx8ICFhcHBQcmVmcykge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFhY3Rpb25QcmVmcykge1xyXG4gICAgICBhcHBQcmVmcy5xdWlja0FjdGlvbnMgPSB7fTtcclxuICAgICAgYWN0aW9uUHJlZnMgPSBhcHBQcmVmcy5xdWlja0FjdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gSWYgaXQgZG9lc24ndCBleGlzdCwgb3IgdGhlcmUgaXMgYSBjb3VudCBtaXNtYXRjaCAoYWN0aW9ucyBjcmVhdGVkIG9uIHVwZ3JhZGVzIHBlcmhhcHM/KVxyXG4gICAgLy8gcmUtY3JlYXRlIHRoZSBwcmVmZXJlbmNlcyBzdG9yZVxyXG4gICAgaWYgKCFhY3Rpb25QcmVmc1t0aGlzLmlkXSB8fFxyXG4gICAgICAoYWN0aW9uUHJlZnNbdGhpcy5pZF0gJiYgYWN0aW9uUHJlZnNbdGhpcy5pZF0ubGVuZ3RoICE9PSBmaWx0ZXJlZC5sZW5ndGgpKSB7XHJcbiAgICAgIGFjdGlvblByZWZzW3RoaXMuaWRdID0gZmlsdGVyZWQubWFwKChhY3Rpb24pID0+IHtcclxuICAgICAgICBhY3Rpb24udmlzaWJsZSA9IHRydWU7XHJcbiAgICAgICAgcmV0dXJuIGFjdGlvbjtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmFwcC5wZXJzaXN0UHJlZmVyZW5jZXMoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCBmcm9tIGNoZWNrQWN0aW9uU3RhdGUgbWV0aG9kIGFuZCBzZXRzIHRoZSBzdGF0ZSBvZiB0aGUgYWN0aW9ucyBmcm9tIHdoYXQgd2FzIHNlbGVjdGVkIGZyb20gdGhlIHNlbGVjdGVkIHJvdywgaXQgc2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgZm9yIGVhY2ggYWN0aW9uXHJcbiAgICogaXRlbSB1c2luZyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHJvdyBhcyBjb250ZXh0IGJ5IHBhc3NpbmcgdGhlIGFjdGlvbiBpbnN0YW5jZSB0aGUgc2VsZWN0ZWQgcm93IHRvIHRoZVxyXG4gICAqIGFjdGlvbiBpdGVtcyBgZW5hYmxlZGAgcHJvcGVydHkuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNlbGVjdGlvblxyXG4gICAqL1xyXG4gIF9hcHBseVN0YXRlVG9BY3Rpb25zOiBmdW5jdGlvbiBfYXBwbHlTdGF0ZVRvQWN0aW9ucyhzZWxlY3Rpb24sIHJvd05vZGUpIHtcclxuICAgIGxldCBhY3Rpb25Sb3c7XHJcbiAgICBpZiAocm93Tm9kZSkge1xyXG4gICAgICBhY3Rpb25Sb3cgPSAkKHJvd05vZGUpLmZpbmQoJy5hY3Rpb25zLXJvdycpWzBdO1xyXG4gICAgICAkKGFjdGlvblJvdykuZW1wdHkoKTtcclxuICAgIH1cclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMudmlzaWJsZUFjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgLy8gVGhlIHZpc2libGUgYWN0aW9uIGlzIGZyb20gb3VyIGxvY2FsIHN0b3JhZ2UgcHJlZmVyZW5jZXMsIHdoZXJlIHRoZSBhY3Rpb24gZnJvbSB0aGUgbGF5b3V0XHJcbiAgICAgIC8vIGNvbnRhaW5zIGZ1bmN0aW9ucyB0aGF0IHdpbGwgZ2V0IHN0cmlwcGVkIG91dCBjb252ZXJ0aW5nIGl0IHRvIEpTT04sIGdldCB0aGUgb3JpZ2luYWwgYWN0aW9uXHJcbiAgICAgIC8vIGFuZCBtaXggaXQgaW50byB0aGUgdmlzaWJsZSBzbyB3ZSBjYW4gd29yayB3aXRoIGl0LlxyXG4gICAgICAvLyBUT0RPOiBUaGlzIHdpbGwgYmUgYSBwcm9ibGVtIHRocm91Z2hvdXQgdmlzaWJsZSBhY3Rpb25zLCBjb21lIHVwIHdpdGggYSBiZXR0ZXIgc29sdXRpb25cclxuICAgICAgY29uc3QgdmlzaWJsZUFjdGlvbiA9IHRoaXMudmlzaWJsZUFjdGlvbnNbaV07XHJcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGxhbmcubWl4aW4odmlzaWJsZUFjdGlvbiwgdGhpcy5fZ2V0QWN0aW9uQnlJZCh2aXNpYmxlQWN0aW9uLmlkKSk7XHJcblxyXG4gICAgICBhY3Rpb24uaXNFbmFibGVkID0gKHR5cGVvZiBhY3Rpb24uZW5hYmxlZCA9PT0gJ3VuZGVmaW5lZCcpID8gdHJ1ZSA6IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihhY3Rpb24uZW5hYmxlZCwgYWN0aW9uLCBzZWxlY3Rpb24pO1xyXG5cclxuICAgICAgaWYgKCFhY3Rpb24uaGFzQWNjZXNzKSB7XHJcbiAgICAgICAgYWN0aW9uLmlzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChyb3dOb2RlKSB7XHJcbiAgICAgICAgJCh2aXNpYmxlQWN0aW9uLnRlbXBsYXRlRG9tKVxyXG4gICAgICAgICAgLmNsb25lKClcclxuICAgICAgICAgIC50b2dnbGVDbGFzcygndG9vbEJ1dHRvbi1kaXNhYmxlZCcsICFhY3Rpb24uaXNFbmFibGVkKVxyXG4gICAgICAgICAgLmFwcGVuZFRvKGFjdGlvblJvdyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAocm93Tm9kZSkge1xyXG4gICAgICBjb25zdCBwb3B1cG1lbnVOb2RlID0gJChyb3dOb2RlKS5maW5kKCcuYnRuLWFjdGlvbnMnKVswXTtcclxuICAgICAgY29uc3QgcG9wdXBtZW51ID0gJChwb3B1cG1lbnVOb2RlKS5kYXRhKCdwb3B1cG1lbnUnKTtcclxuICAgICAgc2V0VGltZW91dCgoKSA9PiB7XHJcbiAgICAgICAgcG9wdXBtZW51LnBvc2l0aW9uKCk7XHJcbiAgICAgIH0sIDEpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgX2dldEFjdGlvbkJ5SWQ6IGZ1bmN0aW9uIF9nZXRBY3Rpb25CeUlkKGlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hY3Rpb25zLmZpbHRlcigoYWN0aW9uKSA9PiB7XHJcbiAgICAgIHJldHVybiBhY3Rpb24gJiYgYWN0aW9uLmlkID09PSBpZDtcclxuICAgIH0pWzBdO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3Igc2hvd2luZyB0aGUgbGlzdC1hY3Rpb24gcGFuZWwvYmFyIC0gaXQgbmVlZHMgdG8gZG8gc2V2ZXJhbCB0aGluZ3M6XHJcbiAgICpcclxuICAgKiAxLiBDaGVjayBlYWNoIGl0ZW0gZm9yIGNvbnRleHQtZW5hYmxlZG1lbnRcclxuICAgKiAxLiBNb3ZlIHRoZSBhY3Rpb24gcGFuZWwgdG8gdGhlIGN1cnJlbnQgcm93IGFuZCBzaG93IGl0XHJcbiAgICogMS4gQWRqdXN0IHRoZSBzY3JvbGxpbmcgaWYgbmVlZGVkIChpZiBzZWxlY3RlZCByb3cgaXMgYXQgYm90dG9tIG9mIHNjcmVlbiwgdGhlIGFjdGlvbi1iYXIgc2hvd3Mgb2ZmIHNjcmVlblxyXG4gICAqIHdoaWNoIGlzIGJhZClcclxuICAgKlxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IHJvd05vZGUgVGhlIGN1cnJlbnRseSBzZWxlY3RlZCByb3cgbm9kZVxyXG4gICAqL1xyXG4gIHNob3dBY3Rpb25QYW5lbDogZnVuY3Rpb24gc2hvd0FjdGlvblBhbmVsKHJvd05vZGUpIHtcclxuICAgIGNvbnN0IGFjdGlvbk5vZGUgPSAkKHJvd05vZGUpLmZpbmQoJy5hY3Rpb25zLXJvdycpO1xyXG4gICAgdGhpcy5jaGVja0FjdGlvblN0YXRlKHJvd05vZGUpO1xyXG4gICAgdGhpcy5vbkFwcGx5Um93QWN0aW9uUGFuZWwoYWN0aW9uTm9kZSwgcm93Tm9kZSk7XHJcbiAgfSxcclxuICBvbkFwcGx5Um93QWN0aW9uUGFuZWw6IGZ1bmN0aW9uIG9uQXBwbHlSb3dBY3Rpb25QYW5lbCgvKiBhY3Rpb25Ob2RlUGFuZWwsIHJvd05vZGUqLykge30sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgYHRoaXMub3B0aW9ucy5zb3VyY2VgIHRvIHBhc3NlZCBwYXJhbSBhZnRlciBhZGRpbmcgdGhlIHZpZXdzIHJlc291cmNlS2luZC4gVGhpcyBmdW5jdGlvbiBpcyB1c2VkIHNvXHJcbiAgICogdGhhdCB3aGVuIHRoZSBuZXh0IHZpZXcgcXVlcmllcyB0aGUgbmF2aWdhdGlvbiBjb250ZXh0IHdlIGNhbiBpbmNsdWRlIHRoZSBwYXNzZWQgcGFyYW0gYXMgYSBkYXRhIHBvaW50LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHNvdXJjZSBUaGUgb2JqZWN0IHRvIHNldCBhcyB0aGUgb3B0aW9ucy5zb3VyY2UuXHJcbiAgICovXHJcbiAgc2V0U291cmNlOiBmdW5jdGlvbiBzZXRTb3VyY2Uoc291cmNlKSB7XHJcbiAgICBsYW5nLm1peGluKHNvdXJjZSwge1xyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5vcHRpb25zLnNvdXJjZSA9IHNvdXJjZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBkZXByZWNhdGVkXHJcbiAgICogSGlkZXMgdGhlIHBhc3NlZCBsaXN0LWFjdGlvbiByb3cvcGFuZWwgYnkgcmVtb3ZpbmcgdGhlIHNlbGVjdGVkIHN0eWxpbmdcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByb3dOb2RlIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcm93LlxyXG4gICAqL1xyXG4gIGhpZGVBY3Rpb25QYW5lbDogZnVuY3Rpb24gaGlkZUFjdGlvblBhbmVsKCkge1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgdmlldyBpcyBhIG5hdmlnYXRpYmxlIHZpZXcgb3IgYSBzZWxlY3Rpb24gdmlldyBieSByZXR1cm5pbmcgYHRoaXMuc2VsZWN0aW9uT25seWAgb3IgdGhlXHJcbiAgICogbmF2aWdhdGlvbiBgdGhpcy5vcHRpb25zLnNlbGVjdGlvbk9ubHlgLlxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgaXNOYXZpZ2F0aW9uRGlzYWJsZWQ6IGZ1bmN0aW9uIGlzTmF2aWdhdGlvbkRpc2FibGVkKCkge1xyXG4gICAgcmV0dXJuICgodGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5zZWxlY3Rpb25Pbmx5KSB8fCAodGhpcy5zZWxlY3Rpb25Pbmx5KSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSBzZWxlY3Rpb25zIGFyZSBkaXNhYmxlZCBieSBjaGVja2luZyB0aGUgYGFsbG93U2VsZWN0aW9uYCBhbmQgYGVuYWJsZUFjdGlvbnNgXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cclxuICAgKi9cclxuICBpc1NlbGVjdGlvbkRpc2FibGVkOiBmdW5jdGlvbiBpc1NlbGVjdGlvbkRpc2FibGVkKCkge1xyXG4gICAgcmV0dXJuICEoKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuc2VsZWN0aW9uT25seSkgfHwgdGhpcy5lbmFibGVBY3Rpb25zIHx8IHRoaXMuYWxsb3dTZWxlY3Rpb24pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3Igd2hlbiB0aGUgc2VsZWN0aW9uIG1vZGVsIGFkZHMgYW4gaXRlbS4gQWRkcyB0aGUgc2VsZWN0ZWQgc3RhdGUgdG8gdGhlIHJvdyBvciBzaG93cyB0aGUgbGlzdFxyXG4gICAqIGFjdGlvbnMgcGFuZWwuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGtleSBUaGUgZXh0cmFjdGVkIGtleSBmcm9tIHRoZSBzZWxlY3RlZCByb3cuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGRhdGEgVGhlIGFjdHVhbCByb3cncyBtYXRjaGluZyBkYXRhIHBvaW50XHJcbiAgICogQHBhcmFtIHtTdHJpbmcvSFRNTEVsZW1lbnR9IHRhZyBBbiBpbmRlbnRpZmllciwgbWF5IGJlIHRoZSBhY3R1YWwgcm93IG5vZGUgb3Igc29tZSBvdGhlciBpZC5cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIF9vblNlbGVjdGlvbk1vZGVsU2VsZWN0OiBmdW5jdGlvbiBfb25TZWxlY3Rpb25Nb2RlbFNlbGVjdChrZXksIGRhdGEsIHRhZykgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICBjb25zdCBub2RlID0gJCh0YWcpO1xyXG5cclxuICAgIGlmICh0aGlzLmVuYWJsZUFjdGlvbnMpIHtcclxuICAgICAgdGhpcy5zaG93QWN0aW9uUGFuZWwobm9kZS5nZXQoMCkpO1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZS5hZGRDbGFzcygnbGlzdC1pdGVtLXNlbGVjdGVkJyk7XHJcbiAgICBub2RlLnJlbW92ZUNsYXNzKCdsaXN0LWl0ZW0tZGUtc2VsZWN0ZWQnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHdoZW4gdGhlIHNlbGVjdGlvbiBtb2RlbCByZW1vdmVzIGFuIGl0ZW0uIFJlbW92ZXMgdGhlIHNlbGVjdGVkIHN0YXRlIHRvIHRoZSByb3cgb3IgaGlkZXMgdGhlIGxpc3RcclxuICAgKiBhY3Rpb25zIHBhbmVsLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGV4dHJhY3RlZCBrZXkgZnJvbSB0aGUgZGUtc2VsZWN0ZWQgcm93LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBhY3R1YWwgcm93J3MgbWF0Y2hpbmcgZGF0YSBwb2ludFxyXG4gICAqIEBwYXJhbSB7U3RyaW5nL0hUTUxFbGVtZW50fSB0YWcgQW4gaW5kZW50aWZpZXIsIG1heSBiZSB0aGUgYWN0dWFsIHJvdyBub2RlIG9yIHNvbWUgb3RoZXIgaWQuXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBfb25TZWxlY3Rpb25Nb2RlbERlc2VsZWN0OiBmdW5jdGlvbiBfb25TZWxlY3Rpb25Nb2RlbERlc2VsZWN0KGtleSwgZGF0YSwgdGFnKSB7XHJcbiAgICBjb25zdCBub2RlID0gJCh0YWcpIHx8ICQoYFtkYXRhLWtleT1cIiR7a2V5fVwiXWAsIHRoaXMuY29udGVudE5vZGUpLmZpcnN0KCk7XHJcbiAgICBpZiAoIW5vZGUubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBub2RlLnJlbW92ZUNsYXNzKCdsaXN0LWl0ZW0tc2VsZWN0ZWQnKTtcclxuICAgIG5vZGUuYWRkQ2xhc3MoJ2xpc3QtaXRlbS1kZS1zZWxlY3RlZCcpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3Igd2hlbiB0aGUgc2VsZWN0aW9uIG1vZGVsIGNsZWFycyB0aGUgc2VsZWN0aW9ucy5cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIF9vblNlbGVjdGlvbk1vZGVsQ2xlYXI6IGZ1bmN0aW9uIF9vblNlbGVjdGlvbk1vZGVsQ2xlYXIoKSB7fSxcclxuXHJcbiAgLyoqXHJcbiAgICogQ2FjaGUgb2YgbG9hZGVkIHNlbGVjdGlvbnNcclxuICAgKi9cclxuICBfbG9hZGVkU2VsZWN0aW9uczogbnVsbCxcclxuXHJcbiAgLyoqXHJcbiAgICogQXR0ZW1wdHMgdG8gYWN0aXZhdGUgZW50cmllcyBwYXNzZWQgaW4gYHRoaXMub3B0aW9ucy5wcmV2aW91c1NlbGVjdGlvbnNgIHdoZXJlIHByZXZpb3VzU2VsZWN0aW9ucyBpcyBhbiBhcnJheVxyXG4gICAqIG9mIGRhdGEta2V5cyBvciBkYXRhLWRlc2NyaXB0b3JzIHRvIHNlYXJjaCB0aGUgbGlzdCByb3dzIGZvci5cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIF9sb2FkUHJldmlvdXNTZWxlY3Rpb25zOiBmdW5jdGlvbiBfbG9hZFByZXZpb3VzU2VsZWN0aW9ucygpIHtcclxuICAgIGNvbnN0IHByZXZpb3VzU2VsZWN0aW9ucyA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMucHJldmlvdXNTZWxlY3Rpb25zO1xyXG4gICAgaWYgKHByZXZpb3VzU2VsZWN0aW9ucykge1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHByZXZpb3VzU2VsZWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGtleSA9IHByZXZpb3VzU2VsZWN0aW9uc1tpXTtcclxuXHJcbiAgICAgICAgLy8gU2V0IGluaXRpYWwgc3RhdGUgb2YgcHJldmlvdXMgc2VsZWN0aW9uIHRvIHVubG9hZGVkIChmYWxzZSlcclxuICAgICAgICBpZiAoIXRoaXMuX2xvYWRlZFNlbGVjdGlvbnMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgICAgdGhpcy5fbG9hZGVkU2VsZWN0aW9uc1trZXldID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCByb3cgPSAkKGBbZGF0YS1rZXk9XCIke2tleX1cIl0sIFtkYXRhLWRlc2NyaXB0b3I9XCIke2tleX1cIl1gLCB0aGlzLmNvbnRlbnROb2RlKVswXTtcclxuXHJcbiAgICAgICAgaWYgKHJvdyAmJiB0aGlzLl9sb2FkZWRTZWxlY3Rpb25zW2tleV0gIT09IHRydWUpIHtcclxuICAgICAgICAgIHRoaXMuYWN0aXZhdGVFbnRyeSh7XHJcbiAgICAgICAgICAgIGtleSxcclxuICAgICAgICAgICAgZGVzY3JpcHRvcjoga2V5LFxyXG4gICAgICAgICAgICAkc291cmNlOiByb3csXHJcbiAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAvLyBGbGFnIHRoYXQgdGhpcyBwcmV2aW91cyBzZWxlY3Rpb24gaGFzIGJlZW4gbG9hZGVkLCBzaW5jZSB0aGlzIGZ1bmN0aW9uIGNhbiBiZSBjYWxsZWRcclxuICAgICAgICAgIC8vIG11bHRpcGxlIHRpbWVzLCB3aGlsZSBwYWdpbmcgdGhyb3VnaCBsb25nIGxpc3RzLiBjbGVhcigpIHdpbGwgcmVzZXQuXHJcbiAgICAgICAgICB0aGlzLl9sb2FkZWRTZWxlY3Rpb25zW2tleV0gPSB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgYXBwbHlSb3dJbmRpY2F0b3JzOiBmdW5jdGlvbiBhcHBseVJvd0luZGljYXRvcnMoZW50cnksIHJvd05vZGUpIHtcclxuICAgIGlmICh0aGlzLml0ZW1JbmRpY2F0b3JzICYmIHRoaXMuaXRlbUluZGljYXRvcnMubGVuZ3RoID4gMCkge1xyXG4gICAgICBjb25zdCB0b3BJbmRpY2F0b3JzTm9kZSA9ICQoJy50b3BfaXRlbV9pbmRpY2F0b3JzJywgcm93Tm9kZSk7XHJcbiAgICAgIGNvbnN0IGJvdHRvbUluZGljYXRvcnNOb2RlID0gJCgnLmJvdHRvbV9pdGVtX2luZGljYXRvcnMnLCByb3dOb2RlKTtcclxuICAgICAgaWYgKGJvdHRvbUluZGljYXRvcnNOb2RlWzBdICYmIHRvcEluZGljYXRvcnNOb2RlWzBdKSB7XHJcbiAgICAgICAgaWYgKGJvdHRvbUluZGljYXRvcnNOb2RlWzBdLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwICYmIHRvcEluZGljYXRvcnNOb2RlWzBdLmNoaWxkTm9kZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICBjb25zdCBjdXN0b21pemVMYXlvdXQgPSB0aGlzLl9jcmVhdGVDdXN0b21pemVkTGF5b3V0KHRoaXMuaXRlbUluZGljYXRvcnMsICdpbmRpY2F0b3JzJyk7XHJcbiAgICAgICAgICB0aGlzLmNyZWF0ZUluZGljYXRvcnModG9wSW5kaWNhdG9yc05vZGVbMF0sIGJvdHRvbUluZGljYXRvcnNOb2RlWzBdLCBjdXN0b21pemVMYXlvdXQsIGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGNyZWF0ZUluZGljYXRvckxheW91dDogZnVuY3Rpb24gY3JlYXRlSW5kaWNhdG9yTGF5b3V0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbUluZGljYXRvcnMgfHwgKHRoaXMuaXRlbUluZGljYXRvcnMgPSBbe1xyXG4gICAgICBpZDogJ3RvdWNoZWQnLFxyXG4gICAgICBjbHM6ICdmbGFnJyxcclxuICAgICAgb25BcHBseTogZnVuY3Rpb24gb25BcHBseShlbnRyeSwgcGFyZW50KSB7XHJcbiAgICAgICAgdGhpcy5pc0VuYWJsZWQgPSBwYXJlbnQuaGFzQmVlblRvdWNoZWQoZW50cnkpO1xyXG4gICAgICB9LFxyXG4gICAgfV0pO1xyXG4gIH0sXHJcbiAgaGFzQmVlblRvdWNoZWQ6IGZ1bmN0aW9uIGhhc0JlZW5Ub3VjaGVkKGVudHJ5KSB7XHJcbiAgICBpZiAoZW50cnkuTW9kaWZ5RGF0ZSkge1xyXG4gICAgICBjb25zdCBtb2RpZmllZERhdGUgPSBtb21lbnQoY29udmVydC50b0RhdGVGcm9tU3RyaW5nKGVudHJ5Lk1vZGlmeURhdGUpKTtcclxuICAgICAgY29uc3QgY3VycmVudERhdGUgPSBtb21lbnQoKS5lbmRPZignZGF5Jyk7XHJcbiAgICAgIGNvbnN0IHdlZWtBZ28gPSBtb21lbnQoKS5zdWJ0cmFjdCgxLCAnd2Vla3MnKTtcclxuXHJcbiAgICAgIHJldHVybiBtb2RpZmllZERhdGUuaXNBZnRlcih3ZWVrQWdvKSAmJlxyXG4gICAgICAgIG1vZGlmaWVkRGF0ZS5pc0JlZm9yZShjdXJyZW50RGF0ZSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gZmFsc2U7XHJcbiAgfSxcclxuICBfcmVmcmVzaExpc3Q6IGZ1bmN0aW9uIF9yZWZyZXNoTGlzdCgpIHtcclxuICAgIHRoaXMuZm9yY2VSZWZyZXNoKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIHRoaXMub3B0aW9ucy5wcmV2aW91c1NlbGVjdGlvbnMgdGhhdCBoYXZlIG5vdCBiZWVuIGxvYWRlZCBvciBwYWdlZCB0b1xyXG4gICAqIEByZXR1cm4ge0FycmF5fVxyXG4gICAqL1xyXG4gIGdldFVubG9hZGVkU2VsZWN0aW9uczogZnVuY3Rpb24gZ2V0VW5sb2FkZWRTZWxlY3Rpb25zKCkge1xyXG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHRoaXMuX2xvYWRlZFNlbGVjdGlvbnMpXHJcbiAgICAgIC5maWx0ZXIoKGtleSkgPT4ge1xyXG4gICAgICAgIHJldHVybiB0aGlzLl9sb2FkZWRTZWxlY3Rpb25zW2tleV0gPT09IGZhbHNlO1xyXG4gICAgICB9KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHRoZSBnbG9iYWwgYC9hcHAvcmVmcmVzaGAgZXZlbnQuIFNldHMgYHJlZnJlc2hSZXF1aXJlZGAgdG8gdHJ1ZSBpZiB0aGUgcmVzb3VyY2VLaW5kIG1hdGNoZXMuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgVGhlIG9iamVjdCBwdWJsaXNoZWQgYnkgdGhlIGV2ZW50LlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgX29uUmVmcmVzaDogZnVuY3Rpb24gX29uUmVmcmVzaCgvKiBvcHRpb25zKi8pIHt9LFxyXG4gIG9uU2Nyb2xsOiBmdW5jdGlvbiBvblNjcm9sbCgvKiBldnQqLykge1xyXG4gICAgY29uc3Qgc2Nyb2xsZXJOb2RlID0gdGhpcy5zY3JvbGxlck5vZGU7XHJcbiAgICBjb25zdCBoZWlnaHQgPSAkKHNjcm9sbGVyTm9kZSkuaGVpZ2h0KCk7IC8vIHZpZXdwb3J0IGhlaWdodCAod2hhdCB1c2VyIHNlZXMpXHJcbiAgICBjb25zdCBzY3JvbGxIZWlnaHQgPSBzY3JvbGxlck5vZGUuc2Nyb2xsSGVpZ2h0OyAvLyBFbnRpcmUgY29udGFpbmVyIGhlaWdodFxyXG4gICAgY29uc3Qgc2Nyb2xsVG9wID0gc2Nyb2xsZXJOb2RlLnNjcm9sbFRvcDsgLy8gSG93IGZhciB3ZSBhcmUgc2Nyb2xsZWQgZG93blxyXG4gICAgY29uc3QgcmVtYWluaW5nID0gc2Nyb2xsSGVpZ2h0IC0gc2Nyb2xsVG9wOyAvLyBIZWlnaHQgd2UgaGF2ZSByZW1haW5pbmcgdG8gc2Nyb2xsXHJcbiAgICBjb25zdCBzZWxlY3RlZCA9ICQodGhpcy5kb21Ob2RlKS5hdHRyKCdzZWxlY3RlZCcpO1xyXG4gICAgY29uc3QgZGlmZiA9IE1hdGguYWJzKHJlbWFpbmluZyAtIGhlaWdodCk7XHJcblxyXG4gICAgLy8gU3RhcnQgYXV0byBmZXRjaGluZyBtb3JlIGRhdGEgaWYgdGhlIHVzZXIgaXMgb24gdGhlIGxhc3QgaGFsZiBvZiB0aGUgcmVtYWluaW5nIHNjcmVlblxyXG4gICAgaWYgKGRpZmYgPD0gaGVpZ2h0IC8gMikge1xyXG4gICAgICBpZiAoc2VsZWN0ZWQgPT09ICdzZWxlY3RlZCcgJiYgdGhpcy5oYXNNb3JlRGF0YSgpICYmICF0aGlzLmxpc3RMb2FkaW5nKSB7XHJcbiAgICAgICAgdGhpcy5tb3JlKCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHRoZSBzZWxlY3Qgb3IgYWN0aW9uIG5vZGUgZGF0YS1hY3Rpb24uIEZpbmRzIHRoZSBuZWFyZXN0IG5vZGUgd2l0aCB0aGUgZGF0YS1rZXkgYXR0cmlidXRlIGFuZFxyXG4gICAqIHRvZ2dsZXMgaXQgaW4gdGhlIHZpZXdzIHNlbGVjdGlvbiBtb2RlbC5cclxuICAgKlxyXG4gICAqIElmIHNpbmdsZVNlbGVjdEFjdGlvbiBpcyBkZWZpbmVkLCBpbnZva2UgdGhlIHNpbmdsZVNlbGVjdGlvbkFjdGlvbi5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbXMgQ29sbGVjdGlvbiBvZiBgZGF0YS1gIGF0dHJpYnV0ZXMgZnJvbSB0aGUgbm9kZS5cclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGNsaWNrL3RhcCBldmVudC5cclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBub2RlIFRoZSBlbGVtZW50IHRoYXQgaW5pdGlhdGVkIHRoZSBldmVudC5cclxuICAgKi9cclxuICBzZWxlY3RFbnRyeTogZnVuY3Rpb24gc2VsZWN0RW50cnkocGFyYW1zKSB7XHJcbiAgICBjb25zdCByb3cgPSAkKGBbZGF0YS1rZXk9JyR7cGFyYW1zLmtleX0nXWAsIHRoaXMuY29udGVudE5vZGUpLmZpcnN0KCk7XHJcbiAgICBjb25zdCBrZXkgPSByb3cgPyByb3cuYXR0cignZGF0YS1rZXknKSA6IGZhbHNlO1xyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCAmJiBrZXkpIHtcclxuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuc2VsZWN0KGtleSwgdGhpcy5lbnRyaWVzW2tleV0sIHJvdy5nZXQoMCkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2luZ2xlU2VsZWN0ICYmIHRoaXMub3B0aW9ucy5zaW5nbGVTZWxlY3RBY3Rpb24gJiYgIXRoaXMuZW5hYmxlQWN0aW9ucykge1xyXG4gICAgICB0aGlzLmludm9rZVNpbmdsZVNlbGVjdEFjdGlvbigpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgZWFjaCByb3cuXHJcbiAgICpcclxuICAgKiBJZiBhIHNlbGVjdGlvbiBtb2RlbCBpcyBkZWZpbmVkIGFuZCBuYXZpZ2F0aW9uIGlzIGRpc2FibGVkIHRoZW4gdG9nZ2xlIHRoZSBlbnRyeS9yb3dcclxuICAgKiBpbiB0aGUgbW9kZWwgYW5kIGlmIHNpbmdsZVNlbGVjdGlvbkFjdGlvbiBpcyB0cnVlIGludm9rZSB0aGUgc2luZ2xlU2VsZWN0QWN0aW9uLlxyXG4gICAqXHJcbiAgICogRWxzZSBuYXZpZ2F0ZSB0byB0aGUgZGV0YWlsIHZpZXcgZm9yIHRoZSBleHRyYWN0ZWQgZGF0YS1rZXkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIENvbGxlY3Rpb24gb2YgYGRhdGEtYCBhdHRyaWJ1dGVzIGZyb20gdGhlIG5vZGUuXHJcbiAgICovXHJcbiAgYWN0aXZhdGVFbnRyeTogZnVuY3Rpb24gYWN0aXZhdGVFbnRyeShwYXJhbXMpIHtcclxuICAgIC8vIGRvbnQgbmF2aWdhdGUgaWYgY2xpY2tlZCBvbiBRQSBidXR0b25cclxuICAgIGlmIChwYXJhbXMuJGV2ZW50ICYmIHBhcmFtcy4kZXZlbnQudGFyZ2V0LmNsYXNzTmFtZSAmJiBwYXJhbXMuJGV2ZW50LnRhcmdldC5jbGFzc05hbWUuaW5kZXhPZignYnRuLWFjdGlvbnMnKSAhPT0gLTEpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgaWYgKHBhcmFtcy5rZXkpIHtcclxuICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsICYmIHRoaXMuaXNOYXZpZ2F0aW9uRGlzYWJsZWQoKSkge1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnRvZ2dsZShwYXJhbXMua2V5LCB0aGlzLmVudHJpZXNbcGFyYW1zLmtleV0gfHwgcGFyYW1zLmRlc2NyaXB0b3IsIHBhcmFtcy4kc291cmNlKTtcclxuICAgICAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZVNlbGVjdCAmJiB0aGlzLm9wdGlvbnMuc2luZ2xlU2VsZWN0QWN0aW9uKSB7XHJcbiAgICAgICAgICB0aGlzLmludm9rZVNpbmdsZVNlbGVjdEFjdGlvbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aGlzLm5hdmlnYXRlVG9EZXRhaWxWaWV3KHBhcmFtcy5rZXksIHBhcmFtcy5kZXNjcmlwdG9yKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSW52b2tlcyB0aGUgY29ycmVzcG9uZGluZyB0b3AgdG9vbGJhciB0b29sIHVzaW5nIGB0aGlzLm9wdGlvbnMuc2luZ2xlU2VsZWN0QWN0aW9uYCBhcyB0aGUgbmFtZS5cclxuICAgKiBJZiBhdXRvQ2xlYXJTZWxlY3Rpb24gaXMgdHJ1ZSwgY2xlYXIgdGhlIHNlbGVjdGlvbiBtb2RlbC5cclxuICAgKi9cclxuICBpbnZva2VTaW5nbGVTZWxlY3RBY3Rpb246IGZ1bmN0aW9uIGludm9rZVNpbmdsZVNlbGVjdEFjdGlvbigpIHtcclxuICAgIGlmICh0aGlzLmFwcC5iYXJzLnRiYXIpIHtcclxuICAgICAgdGhpcy5hcHAuYmFycy50YmFyLmludm9rZVRvb2woe1xyXG4gICAgICAgIHRvb2w6IHRoaXMub3B0aW9ucy5zaW5nbGVTZWxlY3RBY3Rpb24sXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmF1dG9DbGVhclNlbGVjdGlvbikge1xyXG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xyXG4gICAgICB0aGlzLl9sb2FkZWRTZWxlY3Rpb25zID0ge307XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgdG8gdHJhbnNmb3JtIGEgdGV4dHVhbCBxdWVyeSBpbnRvIGFuIFNEYXRhIHF1ZXJ5IGNvbXBhdGlibGUgc2VhcmNoIGV4cHJlc3Npb24uXHJcbiAgICpcclxuICAgKiBWaWV3cyBzaG91bGQgb3ZlcnJpZGUgdGhpcyBmdW5jdGlvbiB0byBwcm92aWRlIHRoZWlyIG93biBmb3JtYXR0aW5nIHRhaWxvcmVkIHRvIHRoZWlyIGVudGl0eS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBzZWFyY2hRdWVyeSBVc2VyIGlucHV0dGVkIHRleHQgZnJvbSB0aGUgc2VhcmNoIHdpZGdldC5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmcvQm9vbGVhbn0gQW4gU0RhdGEgcXVlcnkgY29tcGF0aWJsZSBzZWFyY2ggZXhwcmVzc2lvbi5cclxuICAgKiBAdGVtcGxhdGVcclxuICAgKi9cclxuICBmb3JtYXRTZWFyY2hRdWVyeTogZnVuY3Rpb24gZm9ybWF0U2VhcmNoUXVlcnkoLyogc2VhcmNoUXVlcnkqLykge1xyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmVwbGFjZXMgYSBzaW5nbGUgYFwiYCB3aXRoIHR3byBgXCJcImAgZm9yIHByb3BlciBTRGF0YSBxdWVyeSBleHByZXNzaW9ucy5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoUXVlcnkgU2VhcmNoIGV4cHJlc3Npb24gdG8gYmUgZXNjYXBlZC5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgZXNjYXBlU2VhcmNoUXVlcnk6IGZ1bmN0aW9uIGVzY2FwZVNlYXJjaFF1ZXJ5KHNlYXJjaFF1ZXJ5KSB7XHJcbiAgICByZXR1cm4gVXRpbGl0eS5lc2NhcGVTZWFyY2hRdWVyeShzZWFyY2hRdWVyeSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgc2VhcmNoIHdpZGdldHMgc2VhcmNoLlxyXG4gICAqXHJcbiAgICogUHJlcGFyZXMgdGhlIHZpZXcgYnkgY2xlYXJpbmcgaXQgYW5kIHNldHRpbmcgYHRoaXMucXVlcnlgIHRvIHRoZSBnaXZlbiBzZWFyY2ggZXhwcmVzc2lvbi4gVGhlbiBjYWxsc1xyXG4gICAqIHtAbGluayAjcmVxdWVzdERhdGEgcmVxdWVzdERhdGF9IHdoaWNoIHN0YXJ0IHRoZSByZXF1ZXN0IHByb2Nlc3MuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZXhwcmVzc2lvbiBTdHJpbmcgZXhwcmVzc2lvbiBhcyByZXR1cm5lZCBmcm9tIHRoZSBzZWFyY2ggd2lkZ2V0XHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBfb25TZWFyY2hFeHByZXNzaW9uOiBmdW5jdGlvbiBfb25TZWFyY2hFeHByZXNzaW9uKGV4cHJlc3Npb24pIHtcclxuICAgIHRoaXMuY2xlYXIoZmFsc2UpO1xyXG4gICAgdGhpcy5xdWVyeVRleHQgPSAnJztcclxuICAgIHRoaXMucXVlcnkgPSBleHByZXNzaW9uO1xyXG5cclxuICAgIHRoaXMucmVxdWVzdERhdGEoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGRlZmF1bHQgc2VhcmNoIGV4cHJlc3Npb24gKGFjdGluZyBhcyBhIHByZS1maWx0ZXIpIHRvIGB0aGlzLm9wdGlvbnMucXVlcnlgIGFuZCBjb25maWd1cmVzIHRoZVxyXG4gICAqIHNlYXJjaCB3aWRnZXQgYnkgcGFzc2luZyBpbiB0aGUgY3VycmVudCB2aWV3IGNvbnRleHQuXHJcbiAgICovXHJcbiAgY29uZmlndXJlU2VhcmNoOiBmdW5jdGlvbiBjb25maWd1cmVTZWFyY2goKSB7XHJcbiAgICB0aGlzLnF1ZXJ5ID0gdGhpcy5vcHRpb25zICYmIHRoaXMub3B0aW9ucy5xdWVyeSB8fCB0aGlzLnF1ZXJ5IHx8IG51bGw7XHJcbiAgICBpZiAodGhpcy5zZWFyY2hXaWRnZXQpIHtcclxuICAgICAgdGhpcy5zZWFyY2hXaWRnZXQuY29uZmlndXJlKHtcclxuICAgICAgICBjb250ZXh0OiB0aGlzLmdldENvbnRleHQoKSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc2V0RGVmYXVsdFNlYXJjaFRlcm0oKTtcclxuICB9LFxyXG4gIF9zZXREZWZhdWx0U2VhcmNoVGVybTogZnVuY3Rpb24gX3NldERlZmF1bHRTZWFyY2hUZXJtKCkge1xyXG4gICAgaWYgKCF0aGlzLmRlZmF1bHRTZWFyY2hUZXJtIHx8IHRoaXMuZGVmYXVsdFNlYXJjaFRlcm1TZXQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgdGhpcy5kZWZhdWx0U2VhcmNoVGVybSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICB0aGlzLnNldFNlYXJjaFRlcm0odGhpcy5kZWZhdWx0U2VhcmNoVGVybSgpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuc2V0U2VhcmNoVGVybSh0aGlzLmRlZmF1bHRTZWFyY2hUZXJtKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl91cGRhdGVRdWVyeSgpO1xyXG5cclxuICAgIHRoaXMuZGVmYXVsdFNlYXJjaFRlcm1TZXQgPSB0cnVlO1xyXG4gIH0sXHJcbiAgX3VwZGF0ZVF1ZXJ5OiBmdW5jdGlvbiBfdXBkYXRlUXVlcnkoKSB7XHJcbiAgICBjb25zdCBzZWFyY2hRdWVyeSA9IHRoaXMuZ2V0U2VhcmNoUXVlcnkoKTtcclxuICAgIGlmIChzZWFyY2hRdWVyeSkge1xyXG4gICAgICB0aGlzLnF1ZXJ5ID0gc2VhcmNoUXVlcnk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnF1ZXJ5ID0gJyc7XHJcbiAgICB9XHJcbiAgfSxcclxuICBnZXRTZWFyY2hRdWVyeTogZnVuY3Rpb24gZ2V0U2VhcmNoUXVlcnkoKSB7XHJcbiAgICBsZXQgcmVzdWx0cyA9IG51bGw7XHJcblxyXG4gICAgaWYgKHRoaXMuc2VhcmNoV2lkZ2V0KSB7XHJcbiAgICAgIHJlc3VsdHMgPSB0aGlzLnNlYXJjaFdpZGdldC5nZXRGb3JtYXR0ZWRTZWFyY2hRdWVyeSgpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZXN1bHRzO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGVscGVyIG1ldGhvZCBmb3IgbGlzdCBhY3Rpb25zLiBUYWtlcyBhIHZpZXcgaWQsIGRhdGEgcG9pbnQgYW5kIHdoZXJlIGZvcm1hdCBzdHJpbmcsIHNldHMgdGhlIG5hdiBvcHRpb25zXHJcbiAgICogYHdoZXJlYCB0byB0aGUgZm9ybWF0dGVkIGV4cHJlc3Npb24gdXNpbmcgdGhlIGRhdGEgcG9pbnQgYW5kIHNob3dzIHRoZSBnaXZlbiB2aWV3IGlkIHdpdGggdGhhdCBvcHRpb24uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiBBY3Rpb24gaW5zdGFuY2UsIG5vdCB1c2VkLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZWxlY3Rpb24gRGF0YSBlbnRyeSBmb3IgdGhlIHNlbGVjdGlvbi5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gdmlld0lkIFZpZXcgaWQgdG8gYmUgc2hvd25cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gd2hlcmVRdWVyeUZtdCBXaGVyZSBleHByZXNzaW9uIGZvcm1hdCBzdHJpbmcgdG8gYmUgcGFzc2VkLiBgJHswfWAgd2lsbCBiZSB0aGUgYGlkUHJvcGVydHlgXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGFkZGl0aW9uYWxPcHRpb25zIEFkZGl0aW9uYWwgb3B0aW9ucyB0byBiZSBwYXNzZWQgaW50byB0aGUgbmV4dCB2aWV3XHJcbiAgICogcHJvcGVydHkgb2YgdGhlIHBhc3NlZCBzZWxlY3Rpb24gZGF0YS5cclxuICAgKi9cclxuICBuYXZpZ2F0ZVRvUmVsYXRlZFZpZXc6IGZ1bmN0aW9uIG5hdmlnYXRlVG9SZWxhdGVkVmlldyhhY3Rpb24sIHNlbGVjdGlvbiwgdmlld0lkLCB3aGVyZVF1ZXJ5Rm10LCBhZGRpdGlvbmFsT3B0aW9ucykge1xyXG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLmdldFZpZXcodmlld0lkKTtcclxuICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICB3aGVyZTogc3RyaW5nLnN1YnN0aXR1dGUod2hlcmVRdWVyeUZtdCwgW3NlbGVjdGlvbi5kYXRhW3RoaXMuaWRQcm9wZXJ0eV1dKSxcclxuICAgICAgc2VsZWN0ZWRFbnRyeTogc2VsZWN0aW9uLmRhdGEsXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChhZGRpdGlvbmFsT3B0aW9ucykge1xyXG4gICAgICBvcHRpb25zID0gbGFuZy5taXhpbihvcHRpb25zLCBhZGRpdGlvbmFsT3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5zZXRTb3VyY2Uoe1xyXG4gICAgICBlbnRyeTogc2VsZWN0aW9uLmRhdGEsXHJcbiAgICAgIGRlc2NyaXB0b3I6IHNlbGVjdGlvbi5kYXRhW3RoaXMubGFiZWxQcm9wZXJ0eV0sXHJcbiAgICAgIGtleTogc2VsZWN0aW9uLmRhdGFbdGhpcy5pZFByb3BlcnR5XSxcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIHZpZXcuc2hvdyhvcHRpb25zKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIE5hdmlnYXRlcyB0byB0aGUgZGVmaW5lZCBgdGhpcy5kZXRhaWxWaWV3YCBwYXNzaW5nIHRoZSBwYXJhbXMgYXMgbmF2aWdhdGlvbiBvcHRpb25zLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgS2V5IG9mIHRoZSBlbnRyeSB0byBiZSBzaG93biBpbiBkZXRhaWxcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZGVzY3JpcHRvciBEZXNjcmlwdGlvbiBvZiB0aGUgZW50cnksIHdpbGwgYmUgdXNlZCBhcyB0aGUgdG9wIHRvb2xiYXIgdGl0bGUgdGV4dFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhZGRpdGlvbmFsT3B0aW9ucyBBZGRpdGlvbmFsIG9wdGlvbnMgdG8gYmUgcGFzc2VkIGludG8gdGhlIG5leHQgdmlld1xyXG4gICAqL1xyXG4gIG5hdmlnYXRlVG9EZXRhaWxWaWV3OiBmdW5jdGlvbiBuYXZpZ2F0ZVRvRGV0YWlsVmlldyhrZXksIGRlc2NyaXB0b3IsIGFkZGl0aW9uYWxPcHRpb25zKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAuZ2V0Vmlldyh0aGlzLmRldGFpbFZpZXcpO1xyXG4gICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGRlc2NyaXB0b3IsIC8vIGtlZXAgZm9yIGJhY2t3YXJkcyBjb21wYXRcclxuICAgICAgdGl0bGU6IGRlc2NyaXB0b3IsXHJcbiAgICAgIGtleSxcclxuICAgICAgZnJvbUNvbnRleHQ6IHRoaXMsXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChhZGRpdGlvbmFsT3B0aW9ucykge1xyXG4gICAgICBvcHRpb25zID0gbGFuZy5taXhpbihvcHRpb25zLCBhZGRpdGlvbmFsT3B0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgdmlldy5zaG93KG9wdGlvbnMpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGVscGVyIG1ldGhvZCBmb3IgbGlzdC1hY3Rpb25zLiBOYXZpZ2F0ZXMgdG8gdGhlIGRlZmluZWQgYHRoaXMuZWRpdFZpZXdgIHBhc3NpbmcgdGhlIGdpdmVuIHNlbGVjdGlvbnMgYGlkUHJvcGVydHlgXHJcbiAgICogcHJvcGVydHkgaW4gdGhlIG5hdmlnYXRpb24gb3B0aW9ucyAod2hpY2ggaXMgdGhlbiByZXF1ZXN0ZWQgYW5kIHJlc3VsdCB1c2VkIGFzIGRlZmF1bHQgZGF0YSkuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGFjdGlvbiBBY3Rpb24gaW5zdGFuY2UsIG5vdCB1c2VkLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZWxlY3Rpb24gRGF0YSBlbnRyeSBmb3IgdGhlIHNlbGVjdGlvbi5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gYWRkaXRpb25hbE9wdGlvbnMgQWRkaXRpb25hbCBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBuZXh0IHZpZXcuXHJcbiAgICovXHJcbiAgbmF2aWdhdGVUb0VkaXRWaWV3OiBmdW5jdGlvbiBuYXZpZ2F0ZVRvRWRpdFZpZXcoYWN0aW9uLCBzZWxlY3Rpb24sIGFkZGl0aW9uYWxPcHRpb25zKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAuZ2V0Vmlldyh0aGlzLmVkaXRWaWV3IHx8IHRoaXMuaW5zZXJ0Vmlldyk7XHJcbiAgICBjb25zdCBrZXkgPSBzZWxlY3Rpb24uZGF0YVt0aGlzLmlkUHJvcGVydHldO1xyXG4gICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGtleSxcclxuICAgICAgc2VsZWN0ZWRFbnRyeTogc2VsZWN0aW9uLmRhdGEsXHJcbiAgICAgIGZyb21Db250ZXh0OiB0aGlzLFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoYWRkaXRpb25hbE9wdGlvbnMpIHtcclxuICAgICAgb3B0aW9ucyA9IGxhbmcubWl4aW4ob3B0aW9ucywgYWRkaXRpb25hbE9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIHZpZXcuc2hvdyhvcHRpb25zKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIE5hdmlnYXRlcyB0byB0aGUgZGVmaW5lZCBgdGhpcy5pbnNlcnRWaWV3YCwgb3IgYHRoaXMuZWRpdFZpZXdgIHBhc3NpbmcgdGhlIGN1cnJlbnQgdmlld3MgaWQgYXMgdGhlIGByZXR1cm5Ub2BcclxuICAgKiBvcHRpb24gYW5kIHNldHRpbmcgYGluc2VydGAgdG8gdHJ1ZS5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gYWRkaXRpb25hbE9wdGlvbnMgQWRkaXRpb25hbCBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBuZXh0IHZpZXcuXHJcbiAgICovXHJcbiAgbmF2aWdhdGVUb0luc2VydFZpZXc6IGZ1bmN0aW9uIG5hdmlnYXRlVG9JbnNlcnRWaWV3KGFkZGl0aW9uYWxPcHRpb25zKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAuZ2V0Vmlldyh0aGlzLmluc2VydFZpZXcgfHwgdGhpcy5lZGl0Vmlldyk7XHJcbiAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAgcmV0dXJuVG86IHRoaXMuaWQsXHJcbiAgICAgIGluc2VydDogdHJ1ZSxcclxuICAgIH07XHJcblxyXG4gICAgLy8gUGFzcyBhbG9uZyB0aGUgc2VsZWN0ZWQgZW50cnkgKHJlbGF0ZWQgbGlzdCBjb3VsZCBnZXQgaXQgZnJvbSBhIHF1aWNrIGFjdGlvbilcclxuICAgIGlmICh0aGlzLm9wdGlvbnMuc2VsZWN0ZWRFbnRyeSkge1xyXG4gICAgICBvcHRpb25zLnNlbGVjdGVkRW50cnkgPSB0aGlzLm9wdGlvbnMuc2VsZWN0ZWRFbnRyeTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYWRkaXRpb25hbE9wdGlvbnMpIHtcclxuICAgICAgb3B0aW9ucyA9IGxhbmcubWl4aW4ob3B0aW9ucywgYWRkaXRpb25hbE9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIHZpZXcuc2hvdyhvcHRpb25zKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVyaW1pbmVzIGlmIHRoZXJlIGlzIG1vcmUgZGF0YSB0byBiZSBzaG93bi5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHRoZSBsaXN0IGhhcyBtb3JlIGRhdGE7IEZhbHNlIG90aGVyd2lzZS4gRGVmYXVsdCBpcyB0cnVlLlxyXG4gICAqL1xyXG4gIGhhc01vcmVEYXRhOiBmdW5jdGlvbiBoYXNNb3JlRGF0YSgpIHt9LFxyXG4gIF9zZXRMb2FkaW5nOiBmdW5jdGlvbiBfc2V0TG9hZGluZygpIHtcclxuICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcygnbGlzdC1sb2FkaW5nJyk7XHJcbiAgICB0aGlzLmxpc3RMb2FkaW5nID0gdHJ1ZTtcclxuICB9LFxyXG4gIF9jbGVhckxvYWRpbmc6IGZ1bmN0aW9uIF9jbGVhckxvYWRpbmcoKSB7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ2xpc3QtbG9hZGluZycpO1xyXG4gICAgdGhpcy5saXN0TG9hZGluZyA9IGZhbHNlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhdGVzIHRoZSBkYXRhIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcmVxdWVzdERhdGE6IGZ1bmN0aW9uIHJlcXVlc3REYXRhKCkge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuXHJcbiAgICBpZiAoIXN0b3JlICYmICF0aGlzLl9tb2RlbCkge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ0Vycm9yIHJlcXVlc3RpbmcgZGF0YSwgbm8gc3RvcmUgd2FzIGRlZmluZWQuIERpZCB5b3UgbWVhbiB0byBtaXhpbiBfU0RhdGFMaXN0TWl4aW4gdG8geW91ciBsaXN0IHZpZXc/Jyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMuc2VhcmNoV2lkZ2V0KSB7XHJcbiAgICAgIHRoaXMuY3VycmVudFNlYXJjaEV4cHJlc3Npb24gPSB0aGlzLnNlYXJjaFdpZGdldC5nZXRTZWFyY2hFeHByZXNzaW9uKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fc2V0TG9hZGluZygpO1xyXG5cclxuICAgIGxldCBxdWVyeVJlc3VsdHM7XHJcbiAgICBsZXQgcXVlcnlPcHRpb25zID0ge307XHJcbiAgICBsZXQgcXVlcnlFeHByZXNzaW9uO1xyXG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XHJcbiAgICAgIC8vIFRvZG86IGZpbmQgYSBiZXR0ZXIgd2F5IHRvIHRyYW5zZmVyIHRoaXMgc3RhdGUuXHJcbiAgICAgIHRoaXMub3B0aW9ucy5jb3VudCA9IHRoaXMucGFnZVNpemU7XHJcbiAgICAgIHRoaXMub3B0aW9ucy5zdGFydCA9IHRoaXMucG9zaXRpb247XHJcbiAgICAgIHF1ZXJ5T3B0aW9ucyA9IHRoaXMuX2FwcGx5U3RhdGVUb1F1ZXJ5T3B0aW9ucyhxdWVyeU9wdGlvbnMpIHx8IHF1ZXJ5T3B0aW9ucztcclxuICAgICAgcXVlcnlFeHByZXNzaW9uID0gdGhpcy5fYnVpbGRRdWVyeUV4cHJlc3Npb24oKSB8fCBudWxsO1xyXG4gICAgICBxdWVyeVJlc3VsdHMgPSB0aGlzLnJlcXVlc3REYXRhVXNpbmdNb2RlbChxdWVyeUV4cHJlc3Npb24sIHF1ZXJ5T3B0aW9ucyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBxdWVyeU9wdGlvbnMgPSB0aGlzLl9hcHBseVN0YXRlVG9RdWVyeU9wdGlvbnMocXVlcnlPcHRpb25zKSB8fCBxdWVyeU9wdGlvbnM7XHJcbiAgICAgIHF1ZXJ5RXhwcmVzc2lvbiA9IHRoaXMuX2J1aWxkUXVlcnlFeHByZXNzaW9uKCkgfHwgbnVsbDtcclxuICAgICAgcXVlcnlSZXN1bHRzID0gdGhpcy5yZXF1ZXN0RGF0YVVzaW5nU3RvcmUocXVlcnlFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnMpO1xyXG4gICAgfVxyXG4gICAgJC53aGVuKHF1ZXJ5UmVzdWx0cylcclxuICAgICAgLmRvbmUoKHJlc3VsdHMpID0+IHtcclxuICAgICAgICB0aGlzLl9vblF1ZXJ5Q29tcGxldGUocXVlcnlSZXN1bHRzLCByZXN1bHRzKTtcclxuICAgICAgfSlcclxuICAgICAgLmZhaWwoKCkgPT4ge1xyXG4gICAgICAgIHRoaXMuX29uUXVlcnlFcnJvcihxdWVyeVJlc3VsdHMsIHF1ZXJ5T3B0aW9ucyk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBxdWVyeVJlc3VsdHM7XHJcbiAgfSxcclxuICByZXF1ZXN0RGF0YVVzaW5nTW9kZWw6IGZ1bmN0aW9uIHJlcXVlc3REYXRhVXNpbmdNb2RlbChxdWVyeUV4cHJlc3Npb24sIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IHtcclxuICAgICAgcmV0dXJuUXVlcnlSZXN1bHRzOiB0cnVlLFxyXG4gICAgICBxdWVyeU1vZGVsTmFtZTogdGhpcy5xdWVyeU1vZGVsTmFtZSxcclxuICAgIH07XHJcbiAgICBsYW5nLm1peGluKHF1ZXJ5T3B0aW9ucywgb3B0aW9ucyk7XHJcbiAgICByZXR1cm4gdGhpcy5fbW9kZWwuZ2V0RW50cmllcyhxdWVyeUV4cHJlc3Npb24sIHF1ZXJ5T3B0aW9ucyk7XHJcbiAgfSxcclxuICByZXF1ZXN0RGF0YVVzaW5nU3RvcmU6IGZ1bmN0aW9uIHJlcXVlc3REYXRhVXNpbmdTdG9yZShxdWVyeUV4cHJlc3Npb24sIHF1ZXJ5T3B0aW9ucykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuICAgIHJldHVybiBzdG9yZS5xdWVyeShxdWVyeUV4cHJlc3Npb24sIHF1ZXJ5T3B0aW9ucyk7XHJcbiAgfSxcclxuICBwb3N0TWl4SW5Qcm9wZXJ0aWVzOiBmdW5jdGlvbiBwb3N0TWl4SW5Qcm9wZXJ0aWVzKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQocG9zdE1peEluUHJvcGVydGllcywgYXJndW1lbnRzKTtcclxuICAgIHRoaXMuY3JlYXRlSW5kaWNhdG9yTGF5b3V0KCk7XHJcbiAgfSxcclxuICBnZXRJdGVtQWN0aW9uS2V5OiBmdW5jdGlvbiBnZXRJdGVtQWN0aW9uS2V5KGVudHJ5KSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZXRJZGVudGl0eShlbnRyeSk7XHJcbiAgfSxcclxuICBnZXRJdGVtRGVzY3JpcHRvcjogZnVuY3Rpb24gZ2V0SXRlbURlc2NyaXB0b3IoZW50cnkpIHtcclxuICAgIHJldHVybiBlbnRyeS4kZGVzY3JpcHRvciB8fCBlbnRyeVt0aGlzLmxhYmVsUHJvcGVydHldO1xyXG4gIH0sXHJcbiAgZ2V0SXRlbUljb25DbGFzczogZnVuY3Rpb24gZ2V0SXRlbUljb25DbGFzcygpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1JY29uQ2xhc3M7XHJcbiAgfSxcclxuICBnZXRJdGVtSWNvblNvdXJjZTogZnVuY3Rpb24gZ2V0SXRlbUljb25Tb3VyY2UoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtSWNvbiB8fCB0aGlzLmljb247XHJcbiAgfSxcclxuICBnZXRJdGVtSWNvbkFsdDogZnVuY3Rpb24gZ2V0SXRlbUljb25BbHQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtSWNvbkFsdFRleHQ7XHJcbiAgfSxcclxuICBjcmVhdGVJbmRpY2F0b3JzOiBmdW5jdGlvbiBjcmVhdGVJbmRpY2F0b3JzKHRvcEluZGljYXRvcnNOb2RlLCBib3R0b21JbmRpY2F0b3JzTm9kZSwgaW5kaWNhdG9ycywgZW50cnkpIHtcclxuICAgIGNvbnN0IHNlbGYgPSB0aGlzO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbmRpY2F0b3JzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGluZGljYXRvciA9IGluZGljYXRvcnNbaV07XHJcbiAgICAgIGNvbnN0IGljb25QYXRoID0gaW5kaWNhdG9yLmljb25QYXRoIHx8IHNlbGYuaXRlbUluZGljYXRvckljb25QYXRoO1xyXG4gICAgICBpZiAoaW5kaWNhdG9yLm9uQXBwbHkpIHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgaW5kaWNhdG9yLm9uQXBwbHkoZW50cnksIHNlbGYpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICAgICAgaW5kaWNhdG9yLmlzRW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgIGluZGljYXRvckluZGV4OiBpLFxyXG4gICAgICAgIGluZGljYXRvckljb246IGluZGljYXRvci5pY29uID8gaWNvblBhdGggKyBpbmRpY2F0b3IuaWNvbiA6ICcnLFxyXG4gICAgICAgIGljb25DbHM6IGluZGljYXRvci5jbHMgfHwgJycsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBjb25zdCBpbmRpY2F0b3JUZW1wbGF0ZSA9IGluZGljYXRvci50ZW1wbGF0ZSB8fCBzZWxmLml0ZW1JbmRpY2F0b3JUZW1wbGF0ZTtcclxuXHJcbiAgICAgIGxhbmcubWl4aW4oaW5kaWNhdG9yLCBvcHRpb25zKTtcclxuXHJcbiAgICAgIGlmIChpbmRpY2F0b3IuaXNFbmFibGVkID09PSBmYWxzZSkge1xyXG4gICAgICAgIGlmIChpbmRpY2F0b3IuY2xzKSB7XHJcbiAgICAgICAgICBpbmRpY2F0b3IuaWNvbkNscyA9IGAke2luZGljYXRvci5jbHN9IGRpc2FibGVkYDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaW5kaWNhdG9yLmluZGljYXRvckljb24gPSBpbmRpY2F0b3IuaWNvbiA/IGAke2ljb25QYXRofWRpc2FibGVkXyR7aW5kaWNhdG9yLmljb259YCA6ICcnO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpbmRpY2F0b3IuaW5kaWNhdG9ySWNvbiA9IGluZGljYXRvci5pY29uID8gaWNvblBhdGggKyBpbmRpY2F0b3IuaWNvbiA6ICcnO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoaW5kaWNhdG9yLmlzRW5hYmxlZCA9PT0gZmFsc2UgJiYgaW5kaWNhdG9yLnNob3dJY29uID09PSBmYWxzZSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHNlbGYuaXRlbUluZGljYXRvclNob3dEaXNhYmxlZCB8fCBpbmRpY2F0b3IuaXNFbmFibGVkKSB7XHJcbiAgICAgICAgaWYgKGluZGljYXRvci5pc0VuYWJsZWQgPT09IGZhbHNlICYmIGluZGljYXRvci5zaG93SWNvbiA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaW5kaWNhdG9ySFRNTCA9IGluZGljYXRvclRlbXBsYXRlLmFwcGx5KGluZGljYXRvciwgaW5kaWNhdG9yLmlkKTtcclxuICAgICAgICBpZiAoaW5kaWNhdG9yLmxvY2F0aW9uID09PSAndG9wJykge1xyXG4gICAgICAgICAgJCh0b3BJbmRpY2F0b3JzTm9kZSkuYXBwZW5kKGluZGljYXRvckhUTUwpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKGJvdHRvbUluZGljYXRvcnNOb2RlKS5hcHBlbmQoaW5kaWNhdG9ySFRNTCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBfb25RdWVyeUNvbXBsZXRlOiBmdW5jdGlvbiBfb25RdWVyeUNvbXBsZXRlKHF1ZXJ5UmVzdWx0cywgZW50cmllcykge1xyXG4gICAgdHJ5IHtcclxuICAgICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvc2l0aW9uO1xyXG5cclxuICAgICAgdHJ5IHtcclxuICAgICAgICAkLndoZW4ocXVlcnlSZXN1bHRzLnRvdGFsKVxyXG4gICAgICAgICAgLmRvbmUoKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLl9vblF1ZXJ5VG90YWwocmVzdWx0KTtcclxuICAgICAgICAgIH0pXHJcbiAgICAgICAgICAuZmFpbCgoZXJyb3IpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb25RdWVyeVRvdGFsRXJyb3IoZXJyb3IpO1xyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qIHRvZG86IG1vdmUgdG8gYSBtb3JlIGFwcHJvcHJpYXRlIGxvY2F0aW9uICovXHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuYWxsb3dFbXB0eVNlbGVjdGlvbikge1xyXG4gICAgICAgICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKCdsaXN0LWhhcy1lbXB0eS1vcHQnKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8qIHJlbW92ZSB0aGUgbG9hZGluZyBpbmRpY2F0b3Igc28gdGhhdCBpdCBkb2VzIG5vdCBnZXQgcmUtc2hvd24gd2hpbGUgcmVxdWVzdGluZyBtb3JlIGRhdGEgKi9cclxuICAgICAgICBpZiAoc3RhcnQgPT09IDApIHtcclxuICAgICAgICAgIC8vIENoZWNrIGVudHJpZXMubGVuZ3RoIHNvIHdlIGRvbid0IGNsZWFyIG91dCB0aGUgXCJub0RhdGFcIiB0ZW1wbGF0ZVxyXG4gICAgICAgICAgaWYgKGVudHJpZXMgJiYgZW50cmllcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0KCdsaXN0Q29udGVudCcsICcnKTtcclxuICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAkKHRoaXMubG9hZGluZ0luZGljYXRvck5vZGUpLnJlbW92ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wcm9jZXNzRGF0YShlbnRyaWVzKTtcclxuICAgICAgfSBmaW5hbGx5IHtcclxuICAgICAgICB0aGlzLl9jbGVhckxvYWRpbmcoKTtcclxuICAgICAgICB0aGlzLmlzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoIXRoaXMuX29uU2Nyb2xsSGFuZGxlICYmIHRoaXMuY29udGludW91c1Njcm9sbGluZykge1xyXG4gICAgICAgIHRoaXMuX29uU2Nyb2xsSGFuZGxlID0gdGhpcy5jb25uZWN0KHRoaXMuc2Nyb2xsZXJOb2RlLCAnb25zY3JvbGwnLCB0aGlzLm9uU2Nyb2xsKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5vbkNvbnRlbnRDaGFuZ2UoKTtcclxuICAgICAgY29ubmVjdC5wdWJsaXNoKCcvYXBwL3Rvb2xiYXIvdXBkYXRlJywgW10pO1xyXG5cclxuICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XHJcbiAgICAgICAgdGhpcy5fbG9hZFByZXZpb3VzU2VsZWN0aW9ucygpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgIGNvbnNvbGUuZXJyb3IoZSk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgdGhpcy5fbG9nRXJyb3Ioe1xyXG4gICAgICAgIG1lc3NhZ2U6IGUubWVzc2FnZSxcclxuICAgICAgICBzdGFjazogZS5zdGFjayxcclxuICAgICAgfSwgZS5tZXNzYWdlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNyZWF0ZVN0b3JlOiBmdW5jdGlvbiBjcmVhdGVTdG9yZSgpIHtcclxuICAgIHJldHVybiBudWxsO1xyXG4gIH0sXHJcbiAgb25Db250ZW50Q2hhbmdlOiBmdW5jdGlvbiBvbkNvbnRlbnRDaGFuZ2UoKSB7fSxcclxuICBfcHJvY2Vzc0VudHJ5OiBmdW5jdGlvbiBfcHJvY2Vzc0VudHJ5KGVudHJ5KSB7XHJcbiAgICByZXR1cm4gZW50cnk7XHJcbiAgfSxcclxuICBfb25RdWVyeVRvdGFsRXJyb3I6IGZ1bmN0aW9uIF9vblF1ZXJ5VG90YWxFcnJvcihlcnJvcikge1xyXG4gICAgdGhpcy5oYW5kbGVFcnJvcihlcnJvcik7XHJcbiAgfSxcclxuICBfb25RdWVyeVRvdGFsOiBmdW5jdGlvbiBfb25RdWVyeVRvdGFsKHNpemUpIHtcclxuICAgIHRoaXMudG90YWwgPSBzaXplO1xyXG4gICAgaWYgKHNpemUgPT09IDApIHtcclxuICAgICAgdGhpcy5zZXQoJ2xpc3RDb250ZW50JywgdGhpcy5ub0RhdGFUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCByZW1haW5pbmcgPSB0aGlzLmdldFJlbWFpbmluZ0NvdW50KCk7XHJcbiAgICAgIGlmIChyZW1haW5pbmcgIT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5zZXQoJ3JlbWFpbmluZ0NvbnRlbnQnLCBzdHJpbmcuc3Vic3RpdHV0ZSh0aGlzLnJlbWFpbmluZ1RleHQsIFtyZW1haW5pbmddKSk7XHJcbiAgICAgICAgdGhpcy5yZW1haW5pbmcgPSByZW1haW5pbmc7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgICQodGhpcy5kb21Ob2RlKS50b2dnbGVDbGFzcygnbGlzdC1oYXMtbW9yZScsIChyZW1haW5pbmcgPT09IC0xIHx8IHJlbWFpbmluZyA+IDApKTtcclxuXHJcbiAgICAgIHRoaXMucG9zaXRpb24gPSB0aGlzLnBvc2l0aW9uICsgdGhpcy5wYWdlU2l6ZTtcclxuICAgIH1cclxuICB9LFxyXG4gIGdldFJlbWFpbmluZ0NvdW50OiBmdW5jdGlvbiBnZXRSZW1haW5pbmdDb3VudCgpIHtcclxuICAgIGNvbnN0IHJlbWFpbmluZyA9IHRoaXMudG90YWwgPiAtMSA/IHRoaXMudG90YWwgLSAodGhpcy5wb3NpdGlvbiArIHRoaXMucGFnZVNpemUpIDogLTE7XHJcbiAgICByZXR1cm4gcmVtYWluaW5nO1xyXG4gIH0sXHJcbiAgb25BcHBseVJvd1RlbXBsYXRlOiBmdW5jdGlvbiBvbkFwcGx5Um93VGVtcGxhdGUoZW50cnksIHJvd05vZGUpIHtcclxuICAgIHRoaXMuYXBwbHlSb3dJbmRpY2F0b3JzKGVudHJ5LCByb3dOb2RlKTtcclxuICAgIHRoaXMuaW5pdFJvd1F1aWNrQWN0aW9ucyhyb3dOb2RlKTtcclxuICB9LFxyXG4gIGluaXRSb3dRdWlja0FjdGlvbnM6IGZ1bmN0aW9uIGluaXRSb3dRdWlja0FjdGlvbnMocm93Tm9kZSkge1xyXG4gICAgaWYgKHRoaXMuaXNDYXJkVmlldyAmJiB0aGlzLnZpc2libGVBY3Rpb25zLmxlbmd0aCkge1xyXG4gICAgICAvLyBpbml0aWFsaXplIHBvcHVwbWVudXMgb24gZWFjaCBjYXJkXHJcbiAgICAgIGNvbnN0IGJ0biA9ICQocm93Tm9kZSkuZmluZCgnLmJ0bi1hY3Rpb25zJyk7XHJcbiAgICAgICQoYnRuKS5wb3B1cG1lbnUoKTtcclxuICAgICAgJChidG4pLm9uKCdiZWZvcmVvcGVuJywgKGV2dCkgPT4ge1xyXG4gICAgICAgIHRoaXMuc2VsZWN0RW50cnkoeyBrZXk6IGV2dC50YXJnZXQuYXR0cmlidXRlc1snZGF0YS1rZXknXS52YWx1ZSB9KTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICAvLyBUaGUgY2xpY2sgaGFuZGxlIGluIHRoZSBwb3B1cCBzdG9wcyBwcm9wYWdhdGlvbiB3aGljaCBicmVha3Mgb3VyIF9BY3Rpb25NaXhpbiBjbGljayBoYW5kbGluZ1xyXG4gICAgICAvLyBUaGlzIGp1c3Qgd3JhcHMgdGhlIHNlbGVjdGVkIGVsZW1lbnQgaW4gdGhlIHBvcHVwIHNlbGVjdGlvbiBldmVudCBhbmQgdHJpZ2dlcnMgdGhlXHJcbiAgICAgIC8vIF9BY3Rpb25NaXhpbiBtZXRob2QgbWFudWFsbHlcclxuICAgICAgJChidG4pLm9uKCdzZWxlY3RlZCcsIChldnQsIGFyZ3MpID0+IHtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IGFyZ3MgJiYgYXJnc1swXTtcclxuICAgICAgICBpZiAoIXNlbGVjdGVkKSB7XHJcbiAgICAgICAgICBjb25zb2xlLndhcm4oJ1NvbWV0aGluZyB3ZW50IHdyb25nIHNlbGVjdGluZyBhIHF1aWNrIGFjdGlvbi4nKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3QgZSA9ICQuRXZlbnQoJ2NsaWNrJywgeyB0YXJnZXQ6IHNlbGVjdGVkIH0pO1xyXG4gICAgICAgIHRoaXMuX2luaXRpYXRlQWN0aW9uRnJvbUV2ZW50KGUpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIHByb2Nlc3NEYXRhOiBmdW5jdGlvbiBwcm9jZXNzRGF0YShlbnRyaWVzKSB7XHJcbiAgICBpZiAoIWVudHJpZXMpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGNvdW50ID0gZW50cmllcy5sZW5ndGg7XHJcblxyXG4gICAgaWYgKGNvdW50ID4gMCkge1xyXG4gICAgICBjb25zdCBkb2NmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICBsZXQgcm93ID0gW107XHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY291bnQ7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IGVudHJ5ID0gdGhpcy5fcHJvY2Vzc0VudHJ5KGVudHJpZXNbaV0pO1xyXG4gICAgICAgIC8vIElmIGtleSBjb21lcyBiYWNrIHdpdGggbm90aGluZywgY2hlY2sgdGhhdCB0aGUgc3RvcmUgaXMgcHJvcGVybHlcclxuICAgICAgICAvLyBzZXR1cCB3aXRoIGFuIGlkUHJvcGVydHlcclxuICAgICAgICB0aGlzLmVudHJpZXNbdGhpcy5nZXRJZGVudGl0eShlbnRyeSwgaSldID0gZW50cnk7XHJcblxyXG4gICAgICAgIGNvbnN0IHJvd05vZGUgPSB0aGlzLmNyZWF0ZUl0ZW1Sb3dOb2RlKGVudHJ5KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMuaXNDYXJkVmlldyAmJiB0aGlzLm11bHRpQ29sdW1uVmlldykge1xyXG4gICAgICAgICAgY29uc3QgY29sdW1uID0gJChgPGRpdiBjbGFzcz1cIiR7dGhpcy5tdWx0aUNvbHVtbkNsYXNzfSBjb2x1bW5zXCI+YCkuYXBwZW5kKHJvd05vZGUpO1xyXG4gICAgICAgICAgcm93LnB1c2goY29sdW1uKTtcclxuICAgICAgICAgIGlmICgoaSArIDEpICUgdGhpcy5tdWx0aUNvbHVtbkNvdW50ID09PSAwIHx8IGkgPT09IGNvdW50IC0gMSkge1xyXG4gICAgICAgICAgICBjb25zdCByb3dUZW1wbGF0ZSA9ICQoJzxkaXYgY2xhc3M9XCJyb3dcIj48L2Rpdj4nKTtcclxuICAgICAgICAgICAgcm93LmZvckVhY2goKGVsZW1lbnQpID0+IHtcclxuICAgICAgICAgICAgICByb3dUZW1wbGF0ZS5hcHBlbmQoZWxlbWVudCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICBkb2NmcmFnLmFwcGVuZENoaWxkKHJvd1RlbXBsYXRlLmdldCgwKSk7XHJcbiAgICAgICAgICAgIHJvdyA9IFtdO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBkb2NmcmFnLmFwcGVuZENoaWxkKHJvd05vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLm9uQXBwbHlSb3dUZW1wbGF0ZShlbnRyeSwgcm93Tm9kZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChkb2NmcmFnLmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQodGhpcy5jb250ZW50Tm9kZSkuYXBwZW5kKGRvY2ZyYWcpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBjcmVhdGVJdGVtUm93Tm9kZTogZnVuY3Rpb24gY3JlYXRlSXRlbVJvd05vZGUoZW50cnkpIHtcclxuICAgIGxldCByb3dOb2RlID0gbnVsbDtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICh0aGlzLmlzQ2FyZFZpZXcpIHtcclxuICAgICAgICByb3dOb2RlID0gJCh0aGlzLnJvd1RlbXBsYXRlLmFwcGx5KGVudHJ5LCB0aGlzKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcm93Tm9kZSA9ICQodGhpcy5saVJvd1RlbXBsYXRlLmFwcGx5KGVudHJ5LCB0aGlzKSk7XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycikge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGVycik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgcm93Tm9kZSA9ICQodGhpcy5yb3dUZW1wbGF0ZUVycm9yLmFwcGx5KGVudHJ5LCB0aGlzKSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcm93Tm9kZS5nZXQoMCk7XHJcbiAgfSxcclxuICBnZXRJZGVudGl0eTogZnVuY3Rpb24gZ2V0SWRlbnRpdHkoZW50cnksIGRlZmF1bHRJZCkge1xyXG4gICAgbGV0IG1vZGVsSWQ7XHJcbiAgICBsZXQgc3RvcmVJZDtcclxuXHJcbiAgICBpZiAodGhpcy5fbW9kZWwpIHtcclxuICAgICAgbW9kZWxJZCA9IHRoaXMuX21vZGVsLmdldEVudGl0eUlkKGVudHJ5KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAobW9kZWxJZCkge1xyXG4gICAgICByZXR1cm4gbW9kZWxJZDtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuZ2V0KCdzdG9yZScpO1xyXG4gICAgaWYgKHN0b3JlKSB7XHJcbiAgICAgIHN0b3JlSWQgPSBzdG9yZS5nZXRJZGVudGl0eShlbnRyeSwgdGhpcy5pZFByb3BlcnR5KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoc3RvcmVJZCkge1xyXG4gICAgICByZXR1cm4gc3RvcmVJZDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gZGVmYXVsdElkO1xyXG4gIH0sXHJcbiAgX2xvZ0Vycm9yOiBmdW5jdGlvbiBfbG9nRXJyb3IoZXJyb3IsIG1lc3NhZ2UpIHtcclxuICAgIGNvbnN0IGZyb21Db250ZXh0ID0gdGhpcy5vcHRpb25zLmZyb21Db250ZXh0O1xyXG4gICAgdGhpcy5vcHRpb25zLmZyb21Db250ZXh0ID0gbnVsbDtcclxuICAgIGNvbnN0IGVycm9ySXRlbSA9IHtcclxuICAgICAgdmlld09wdGlvbnM6IHRoaXMub3B0aW9ucyxcclxuICAgICAgc2VydmVyRXJyb3I6IGVycm9yLFxyXG4gICAgfTtcclxuXHJcbiAgICBFcnJvck1hbmFnZXIuYWRkRXJyb3IobWVzc2FnZSB8fCB0aGlzLmdldEVycm9yTWVzc2FnZShlcnJvciksIGVycm9ySXRlbSk7XHJcbiAgICB0aGlzLm9wdGlvbnMuZnJvbUNvbnRleHQgPSBmcm9tQ29udGV4dDtcclxuICB9LFxyXG4gIF9vblF1ZXJ5RXJyb3I6IGZ1bmN0aW9uIF9vblF1ZXJ5RXJyb3IocXVlcnlPcHRpb25zLCBlcnJvcikge1xyXG4gICAgdGhpcy5oYW5kbGVFcnJvcihlcnJvcik7XHJcbiAgICB0aGlzLmlzUmVmcmVzaGluZyA9IGZhbHNlO1xyXG4gIH0sXHJcbiAgX2J1aWxkUXVlcnlFeHByZXNzaW9uOiBmdW5jdGlvbiBfYnVpbGRRdWVyeUV4cHJlc3Npb24oKSB7XHJcbiAgICByZXR1cm4gbGFuZy5taXhpbih0aGlzLnF1ZXJ5IHx8IHt9LCB0aGlzLm9wdGlvbnMgJiYgKHRoaXMub3B0aW9ucy5xdWVyeSB8fCB0aGlzLm9wdGlvbnMud2hlcmUpKTtcclxuICB9LFxyXG4gIF9hcHBseVN0YXRlVG9RdWVyeU9wdGlvbnM6IGZ1bmN0aW9uIF9hcHBseVN0YXRlVG9RdWVyeU9wdGlvbnMocXVlcnlPcHRpb25zKSB7XHJcbiAgICByZXR1cm4gcXVlcnlPcHRpb25zO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdGhlIG1vcmUgYnV0dG9uLiBTaW1wbHkgY2FsbHMge0BsaW5rICNyZXF1ZXN0RGF0YSByZXF1ZXN0RGF0YX0gd2hpY2ggYWxyZWFkeSBoYXMgdGhlIGluZm8gZm9yXHJcbiAgICogc2V0dGluZyB0aGUgc3RhcnQgaW5kZXggYXMgbmVlZGVkLlxyXG4gICAqL1xyXG4gIG1vcmU6IGZ1bmN0aW9uIG1vcmUoKSB7XHJcbiAgICBpZiAodGhpcy5jb250aW51b3VzU2Nyb2xsaW5nKSB7XHJcbiAgICAgIHRoaXMuc2V0KCdyZW1haW5pbmdDb250ZW50JywgdGhpcy5sb2FkaW5nVGVtcGxhdGUuYXBwbHkodGhpcykpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMucmVxdWVzdERhdGEoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHRoZSBub25lL25vIHNlbGVjdGlvbiBidXR0b24gaXMgcHJlc3NlZC4gVXNlZCBpbiBzZWxlY3Rpb24gdmlld3Mgd2hlbiBub3Qgc2VsZWN0aW5nIGlzIGFuIG9wdGlvbi5cclxuICAgKiBJbnZva2VzIHRoZSBgdGhpcy5vcHRpb25zLnNpbmdsZVNlbGVjdEFjdGlvbmAgdG9vbC5cclxuICAgKi9cclxuICBlbXB0eVNlbGVjdGlvbjogZnVuY3Rpb24gZW1wdHlTZWxlY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xyXG4gICAgdGhpcy5fbG9hZGVkU2VsZWN0aW9ucyA9IHt9O1xyXG5cclxuICAgIGlmICh0aGlzLmFwcC5iYXJzLnRiYXIpIHtcclxuICAgICAgdGhpcy5hcHAuYmFycy50YmFyLmludm9rZVRvb2woe1xyXG4gICAgICAgIHRvb2w6IHRoaXMub3B0aW9ucy5zaW5nbGVTZWxlY3RBY3Rpb24sXHJcbiAgICAgIH0pOyAvLyBpbnZva2UgYWN0aW9uIG9mIHRvb2xcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgdGhlIHZpZXcgc2hvdWxkIGJlIHJlZnJlc2ggYnkgaW5zcGVjdGluZyBhbmQgY29tcGFyaW5nIHRoZSBwYXNzZWQgbmF2aWdhdGlvbiBvcHRpb25zIHdpdGggY3VycmVudCB2YWx1ZXMuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgUGFzc2VkIG5hdmlnYXRpb24gb3B0aW9ucy5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFufSBUcnVlIGlmIHRoZSB2aWV3IHNob3VsZCBiZSByZWZyZXNoZWQsIGZhbHNlIGlmIG5vdC5cclxuICAgKi9cclxuICByZWZyZXNoUmVxdWlyZWRGb3I6IGZ1bmN0aW9uIHJlZnJlc2hSZXF1aXJlZEZvcihvcHRpb25zKSB7XHJcbiAgICBpZiAodGhpcy5vcHRpb25zKSB7XHJcbiAgICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZXhwYW5kRXhwcmVzc2lvbih0aGlzLm9wdGlvbnMuc3RhdGVLZXkpICE9PSB0aGlzLmV4cGFuZEV4cHJlc3Npb24ob3B0aW9ucy5zdGF0ZUtleSkpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5leHBhbmRFeHByZXNzaW9uKHRoaXMub3B0aW9ucy53aGVyZSkgIT09IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihvcHRpb25zLndoZXJlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmV4cGFuZEV4cHJlc3Npb24odGhpcy5vcHRpb25zLnF1ZXJ5KSAhPT0gdGhpcy5leHBhbmRFeHByZXNzaW9uKG9wdGlvbnMucXVlcnkpKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZXhwYW5kRXhwcmVzc2lvbih0aGlzLm9wdGlvbnMucmVzb3VyY2VLaW5kKSAhPT0gdGhpcy5leHBhbmRFeHByZXNzaW9uKG9wdGlvbnMucmVzb3VyY2VLaW5kKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmV4cGFuZEV4cHJlc3Npb24odGhpcy5vcHRpb25zLnJlc291cmNlUHJlZGljYXRlKSAhPT0gdGhpcy5leHBhbmRFeHByZXNzaW9uKG9wdGlvbnMucmVzb3VyY2VQcmVkaWNhdGUpKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gdGhpcy5pbmhlcml0ZWQocmVmcmVzaFJlcXVpcmVkRm9yLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCB2aWV3cyBjb250ZXh0IGJ5IGV4cGFuZGluZyB1cG9uIHRoZSB7QGxpbmsgVmlldyNnZXRDb250ZXh0IHBhcmVudCBpbXBsZW1lbnRhdGlvbn0gdG8gaW5jbHVkZVxyXG4gICAqIHRoZSB2aWV3cyByZXNvdXJjZUtpbmQuXHJcbiAgICogQHJldHVybiB7T2JqZWN0fSBjb250ZXh0LlxyXG4gICAqL1xyXG4gIGdldENvbnRleHQ6IGZ1bmN0aW9uIGdldENvbnRleHQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pbmhlcml0ZWQoZ2V0Q29udGV4dCwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHtAbGluayBWaWV3I2JlZm9yZVRyYW5zaXRpb25UbyBwYXJlbnQgaW1wbGVtZW50YXRpb259IGJ5IGFsc28gdG9nZ2xpbmcgdGhlIHZpc2liaWxpdHkgb2YgdGhlIHZpZXdzXHJcbiAgICogY29tcG9uZW50cyBhbmQgY2xlYXJpbmcgdGhlIHZpZXcgYW5kIHNlbGVjdGlvbiBtb2RlbCBhcyBuZWVkZWQuXHJcbiAgICovXHJcbiAgYmVmb3JlVHJhbnNpdGlvblRvOiBmdW5jdGlvbiBiZWZvcmVUcmFuc2l0aW9uVG8oKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChiZWZvcmVUcmFuc2l0aW9uVG8sIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnRvZ2dsZUNsYXNzKCdsaXN0LWhpZGUtc2VhcmNoJywgKHRoaXMub3B0aW9ucyAmJiB0eXBlb2YgdGhpcy5vcHRpb25zLmhpZGVTZWFyY2ggIT09ICd1bmRlZmluZWQnKSA/IHRoaXMub3B0aW9ucy5oaWRlU2VhcmNoIDogdGhpcy5oaWRlU2VhcmNoIHx8ICF0aGlzLmVuYWJsZVNlYXJjaCk7XHJcblxyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnRvZ2dsZUNsYXNzKCdsaXN0LXNob3ctc2VsZWN0b3JzJywgIXRoaXMuaXNTZWxlY3Rpb25EaXNhYmxlZCgpICYmICF0aGlzLm9wdGlvbnMuc2luZ2xlU2VsZWN0KTtcclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uTW9kZWwgJiYgIXRoaXMuaXNTZWxlY3Rpb25EaXNhYmxlZCgpKSB7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnVzZVNpbmdsZVNlbGVjdGlvbih0aGlzLm9wdGlvbnMuc2luZ2xlU2VsZWN0KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMub3B0aW9ucy5lbmFibGVBY3Rpb25zICE9PSAndW5kZWZpbmVkJykge1xyXG4gICAgICB0aGlzLmVuYWJsZUFjdGlvbnMgPSB0aGlzLm9wdGlvbnMuZW5hYmxlQWN0aW9ucztcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuZG9tTm9kZSkudG9nZ2xlQ2xhc3MoJ2xpc3Qtc2hvdy1hY3Rpb25zJywgdGhpcy5lbmFibGVBY3Rpb25zKTtcclxuICAgIGlmICh0aGlzLmVuYWJsZUFjdGlvbnMpIHtcclxuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwudXNlU2luZ2xlU2VsZWN0aW9uKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlZnJlc2hSZXF1aXJlZCkge1xyXG4gICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAvLyBpZiBlbmFibGVkLCBjbGVhciBhbnkgcHJlLWV4aXN0aW5nIHNlbGVjdGlvbnNcclxuICAgICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsICYmIHRoaXMuYXV0b0NsZWFyU2VsZWN0aW9uICYmICF0aGlzLmVuYWJsZUFjdGlvbnMpIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xyXG4gICAgICAgIHRoaXMuX2xvYWRlZFNlbGVjdGlvbnMgPSB7fTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyB0aGUge0BsaW5rIFZpZXcjdHJhbnNpdGlvblRvIHBhcmVudCBpbXBsZW1lbnRhdGlvbn0gdG8gYWxzbyBjb25maWd1cmUgdGhlIHNlYXJjaCB3aWRnZXQgYW5kXHJcbiAgICogbG9hZCBwcmV2aW91cyBzZWxlY3Rpb25zIGludG8gdGhlIHNlbGVjdGlvbiBtb2RlbC5cclxuICAgKi9cclxuICB0cmFuc2l0aW9uVG86IGZ1bmN0aW9uIHRyYW5zaXRpb25UbygpIHtcclxuICAgIHRoaXMuY29uZmlndXJlU2VhcmNoKCk7XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XHJcbiAgICAgIHRoaXMuX2xvYWRQcmV2aW91c1NlbGVjdGlvbnMoKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaGVyaXRlZCh0cmFuc2l0aW9uVG8sIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBHZW5lcmF0ZXMgdGhlIGhhc2ggdGFnIGxheW91dCBieSB0YWtpbmcgdGhlIGhhc2ggdGFncyBkZWZpbmVkIGluIGB0aGlzLmhhc2hUYWdRdWVyaWVzYCBhbmQgY29udmVydGluZyB0aGVtXHJcbiAgICogaW50byBpbmRpdmlkdWFsIG9iamVjdHMgaW4gYW4gYXJyYXkgdG8gYmUgdXNlZCBpbiB0aGUgY3VzdG9taXphdGlvbiBlbmdpbmUuXHJcbiAgICogQHJldHVybiB7T2JqZWN0W119XHJcbiAgICovXHJcbiAgY3JlYXRlSGFzaFRhZ1F1ZXJ5TGF5b3V0OiBmdW5jdGlvbiBjcmVhdGVIYXNoVGFnUXVlcnlMYXlvdXQoKSB7XHJcbiAgICAvLyB0b2RvOiBhbHdheXMgcmVnZW5lcmF0ZSB0aGlzIGxheW91dD8gYWx3YXlzIHJlZ2VuZXJhdGluZyBhbGxvd3MgZm9yIGFsbCBleGlzdGluZyBjdXN0b21pemF0aW9uc1xyXG4gICAgLy8gdG8gc3RpbGwgd29yaywgYXQgZXhwZW5zZSBvZiBwb3RlbnRpYWwgKHJhcmUpIHBlcmZvcm1hbmNlIGlzc3VlcyBpZiBtYW55IGN1c3RvbWl6YXRpb25zIGFyZSByZWdpc3RlcmVkLlxyXG4gICAgY29uc3QgbGF5b3V0ID0gW107XHJcbiAgICBmb3IgKGNvbnN0IG5hbWUgaW4gdGhpcy5oYXNoVGFnUXVlcmllcykge1xyXG4gICAgICBpZiAodGhpcy5oYXNoVGFnUXVlcmllcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xyXG4gICAgICAgIGxheW91dC5wdXNoKHtcclxuICAgICAgICAgIGtleTogbmFtZSxcclxuICAgICAgICAgIHRhZzogKHRoaXMuaGFzaFRhZ1F1ZXJpZXNUZXh0ICYmIHRoaXMuaGFzaFRhZ1F1ZXJpZXNUZXh0W25hbWVdKSB8fCBuYW1lLFxyXG4gICAgICAgICAgcXVlcnk6IHRoaXMuaGFzaFRhZ1F1ZXJpZXNbbmFtZV0sXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbGF5b3V0O1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIHdoZW4gdGhlIHZpZXcgbmVlZHMgdG8gYmUgcmVzZXQuIEludm9rZXMgdGhlIHJlcXVlc3QgZGF0YSBwcm9jZXNzLlxyXG4gICAqL1xyXG4gIHJlZnJlc2g6IGZ1bmN0aW9uIHJlZnJlc2goKSB7XHJcbiAgICBpZiAodGhpcy5pc1JlZnJlc2hpbmcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgdGhpcy5jcmVhdGVBY3Rpb25zKHRoaXMuX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQodGhpcy5jcmVhdGVTeXN0ZW1BY3Rpb25MYXlvdXQodGhpcy5jcmVhdGVBY3Rpb25MYXlvdXQoKSksICdhY3Rpb25zJykpO1xyXG4gICAgdGhpcy5pc1JlZnJlc2hpbmcgPSB0cnVlO1xyXG4gICAgdGhpcy5xdWVyeSA9IHRoaXMuZ2V0U2VhcmNoUXVlcnkoKSB8fCB0aGlzLnF1ZXJ5O1xyXG4gICAgdGhpcy5yZXF1ZXN0RGF0YSgpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2xlYXJzIHRoZSB2aWV3IGJ5OlxyXG4gICAqXHJcbiAgICogICogY2xlYXJpbmcgdGhlIHNlbGVjdGlvbiBtb2RlbCwgYnV0IHdpdGhvdXQgaXQgaW52b2tpbmcgdGhlIGV2ZW50IGhhbmRsZXJzO1xyXG4gICAqICAqIGNsZWFycyB0aGUgdmlld3MgZGF0YSBzdWNoIGFzIGB0aGlzLmVudHJpZXNgIGFuZCBgdGhpcy5lbnRyaWVzYDtcclxuICAgKiAgKiBjbGVhcnMgdGhlIHNlYXJjaCB3aWR0aCBpZiBwYXNzZWQgdHJ1ZTsgYW5kXHJcbiAgICogICogYXBwbGllcyB0aGUgZGVmYXVsdCB0ZW1wbGF0ZS5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7Qm9vbGVhbn0gYWxsIElmIHRydWUsIGFsc28gY2xlYXIgdGhlIHNlYXJjaCB3aWRnZXQuXHJcbiAgICovXHJcbiAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKGFsbCkge1xyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnN1c3BlbmRFdmVudHMoKTtcclxuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2xlYXIoKTtcclxuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwucmVzdW1lRXZlbnRzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fbG9hZGVkU2VsZWN0aW9ucyA9IHt9O1xyXG4gICAgdGhpcy5yZXF1ZXN0ZWRGaXJzdFBhZ2UgPSBmYWxzZTtcclxuICAgIHRoaXMuZW50cmllcyA9IHt9O1xyXG4gICAgdGhpcy5wb3NpdGlvbiA9IDA7XHJcblxyXG4gICAgaWYgKHRoaXMuX29uU2Nyb2xsSGFuZGxlKSB7XHJcbiAgICAgIHRoaXMuZGlzY29ubmVjdCh0aGlzLl9vblNjcm9sbEhhbmRsZSk7XHJcbiAgICAgIHRoaXMuX29uU2Nyb2xsSGFuZGxlID0gbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoYWxsID09PSB0cnVlICYmIHRoaXMuc2VhcmNoV2lkZ2V0KSB7XHJcbiAgICAgIHRoaXMuc2VhcmNoV2lkZ2V0LmNsZWFyKCk7XHJcbiAgICAgIHRoaXMucXVlcnkgPSBmYWxzZTsgLy8gdG9kbzogcmVuYW1lIHRvIHNlYXJjaFF1ZXJ5XHJcbiAgICAgIHRoaXMuaGFzU2VhcmNoZWQgPSBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ2xpc3QtaGFzLW1vcmUnKTtcclxuXHJcbiAgICB0aGlzLnNldCgnbGlzdENvbnRlbnQnLCB0aGlzLmxvYWRpbmdUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgfSxcclxuICBzZWFyY2g6IGZ1bmN0aW9uIHNlYXJjaCgpIHtcclxuICAgIGlmICh0aGlzLnNlYXJjaFdpZGdldCkge1xyXG4gICAgICB0aGlzLnNlYXJjaFdpZGdldC5zZWFyY2goKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIHF1ZXJ5IHZhbHVlIG9uIHRoZSBzZXJhY2ggd2lkZ2V0XHJcbiAgICovXHJcbiAgc2V0U2VhcmNoVGVybTogZnVuY3Rpb24gc2V0U2VhcmNoVGVybSh2YWx1ZSkge1xyXG4gICAgaWYgKHRoaXMuc2VhcmNoV2lkZ2V0KSB7XHJcbiAgICAgIHRoaXMuc2VhcmNoV2lkZ2V0LnNldCgncXVlcnlWYWx1ZScsIHZhbHVlKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSBwcm9taXNlIHdpdGggdGhlIGxpc3QncyBjb3VudC5cclxuICAgKi9cclxuICBnZXRMaXN0Q291bnQ6IGZ1bmN0aW9uIGdldExpc3RDb3VudCgvKiBvcHRpb25zLCBjYWxsYmFjayovKSB7fSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=