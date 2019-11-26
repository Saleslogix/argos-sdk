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
    rowTemplate: new Simplate(['\n    <div data-action="activateEntry" data-key="{%= $$.getItemActionKey($) %}" data-descriptor="{%: $$.getItemDescriptor($) %}">\n      <div class="widget">\n        <div class="widget-header">\n          {%! $$.itemIconTemplate %}\n          <h2 class="widget-title">{%: $$.getTitle($, $$.labelProperty) %}</h2>\n          {% if($$.visibleActions.length > 0 && $$.enableActions) { %}\n            <button class="btn-actions" type="button" data-key="{%= $$.getItemActionKey($) %}">\n              <span class="audible">Actions</span>\n              <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n                <use xlink:href="#icon-more"></use>\n              </svg>\n            </button>\n            {%! $$.listActionTemplate %}\n          {% } %}\n        </div>\n        <div class="card-content">\n          {%! $$.itemRowContentTemplate %}\n        </div>\n      </div>\n    </div>\n    ']),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fTGlzdEJhc2UuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJyZXNvdXJjZVNESyIsIl9fY2xhc3MiLCJ2aWV3U2V0dGluZ3NUZXh0IiwiYXR0cmlidXRlTWFwIiwibGlzdENvbnRlbnQiLCJub2RlIiwidHlwZSIsInJlbWFpbmluZ0NvbnRlbnQiLCJ0aXRsZSIsInByb3RvdHlwZSIsInNlbGVjdGVkIiwidXRpbGl0eSIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJsb2FkaW5nVGVtcGxhdGUiLCJtb3JlVGVtcGxhdGUiLCJpc0NhcmRWaWV3IiwiaGFzU2V0dGluZ3MiLCJ2aXNpYmxlQWN0aW9ucyIsImVtcHR5U2VsZWN0aW9uVGVtcGxhdGUiLCJyb3dUZW1wbGF0ZSIsImxpUm93VGVtcGxhdGUiLCJpdGVtVGVtcGxhdGUiLCJub0RhdGFUZW1wbGF0ZSIsImxpc3RBY3Rpb25UZW1wbGF0ZSIsImxpc3RBY3Rpb25JdGVtVGVtcGxhdGUiLCJpdGVtUm93Q29udGVudFRlbXBsYXRlIiwiaXRlbUljb25UZW1wbGF0ZSIsIml0ZW1JbmRpY2F0b3JUZW1wbGF0ZSIsImNvbnRlbnROb2RlIiwicmVtYWluaW5nQ29udGVudE5vZGUiLCJzZWFyY2hOb2RlIiwiZW1wdHlTZWxlY3Rpb25Ob2RlIiwicmVtYWluaW5nTm9kZSIsIm1vcmVOb2RlIiwiYWN0aW9uc05vZGUiLCJpZCIsInJlc291cmNlS2luZCIsInN0b3JlIiwiZW50cmllcyIsInBhZ2VTaXplIiwiZW5hYmxlU2VhcmNoIiwiZW5hYmxlQWN0aW9ucyIsImhpZGVTZWFyY2giLCJhbGxvd1NlbGVjdGlvbiIsImF1dG9DbGVhclNlbGVjdGlvbiIsImRldGFpbFZpZXciLCJxdWlja0FjdGlvbkNvbmZpZ3VyZVZpZXciLCJlZGl0VmlldyIsImluc2VydFZpZXciLCJjb250ZXh0VmlldyIsImhhc2hUYWdRdWVyaWVzIiwibW9yZVRleHQiLCJlbXB0eVNlbGVjdGlvblRleHQiLCJ0aXRsZVRleHQiLCJjb25maWd1cmVUZXh0IiwiZXJyb3JSZW5kZXJUZXh0Iiwicm93VGVtcGxhdGVFcnJvciIsInJlbWFpbmluZ1RleHQiLCJjYW5jZWxUZXh0IiwiaW5zZXJ0VGV4dCIsIm5vRGF0YVRleHQiLCJsb2FkaW5nVGV4dCIsIm5ld1Rvb2x0aXBUZXh0IiwicmVmcmVzaFRvb2x0aXBUZXh0IiwiY3VzdG9taXphdGlvblNldCIsInNlbGVjdEljb24iLCJzZWxlY3RJY29uQ2xhc3MiLCJzZWFyY2hXaWRnZXQiLCJzZWFyY2hXaWRnZXRDbGFzcyIsImRlZmF1bHRTZWFyY2hUZXJtU2V0IiwiZGVmYXVsdFNlYXJjaFRlcm0iLCJjdXJyZW50U2VhcmNoRXhwcmVzc2lvbiIsIl9zZWxlY3Rpb25Nb2RlbCIsIl9zZWxlY3Rpb25Db25uZWN0cyIsInRvb2xzIiwiYWN0aW9ucyIsImNvbnRpbnVvdXNTY3JvbGxpbmciLCJsaXN0TG9hZGluZyIsIm11bHRpQ29sdW1uVmlldyIsIm11bHRpQ29sdW1uQ2xhc3MiLCJtdWx0aUNvbHVtbkNvdW50IiwiaXRlbXNQcm9wZXJ0eSIsImlkUHJvcGVydHkiLCJsYWJlbFByb3BlcnR5IiwiZW50aXR5UHJvcGVydHkiLCJ2ZXJzaW9uUHJvcGVydHkiLCJpc1JlZnJlc2hpbmciLCJnZXRUaXRsZSIsImVudHJ5IiwiZ2V0VmFsdWUiLCJfc2V0U2VsZWN0aW9uTW9kZWxBdHRyIiwic2VsZWN0aW9uTW9kZWwiLCJmb3JFYWNoIiwiZGlzY29ubmVjdCIsInB1c2giLCJjb25uZWN0IiwiX29uU2VsZWN0aW9uTW9kZWxTZWxlY3QiLCJfb25TZWxlY3Rpb25Nb2RlbERlc2VsZWN0IiwiX29uU2VsZWN0aW9uTW9kZWxDbGVhciIsIl9nZXRTZWxlY3Rpb25Nb2RlbEF0dHIiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJfbG9hZGVkU2VsZWN0aW9ucyIsImRpc2FibGVSaWdodERyYXdlciIsImNvbnNvbGUiLCJ3YXJuIiwiaW5pdFNvaG8iLCJ0b29sYmFyIiwiJCIsImRvbU5vZGUiLCJmaXJzdCIsImRhdGEiLCJvbiIsIm9wZW5TZXR0aW5ncyIsInVwZGF0ZVNvaG8iLCJ1cGRhdGVkIiwiX29uTGlzdFZpZXdTZWxlY3RlZCIsImRpciIsImFyZ3VtZW50cyIsInBvc3RDcmVhdGUiLCJpbmhlcml0ZWQiLCJzZXQiLCJzdWJzY3JpYmUiLCJfb25SZWZyZXNoIiwiU2VhcmNoV2lkZ2V0Q3RvciIsImlzU3RyaW5nIiwiZ2V0T2JqZWN0IiwiY2xhc3MiLCJvd25lciIsIm9uU2VhcmNoRXhwcmVzc2lvbiIsIl9vblNlYXJjaEV4cHJlc3Npb24iLCJiaW5kIiwicGxhY2VBdCIsImFkZENsYXNzIiwiY2xlYXIiLCJpbml0UHVsbFRvUmVmcmVzaCIsInNjcm9sbGVyTm9kZSIsInNob3VsZFN0YXJ0UHVsbFRvUmVmcmVzaCIsInNob3VsZFN0YXJ0IiwiYXR0ciIsImFjdGlvbk5vZGUiLCJmaW5kIiwiYWN0aW9uc09wZW4iLCJsZW5ndGgiLCJmb3JjZVJlZnJlc2giLCJyZWZyZXNoUmVxdWlyZWQiLCJyZWZyZXNoIiwib25QdWxsVG9SZWZyZXNoQ29tcGxldGUiLCJvbkNvbm5lY3Rpb25TdGF0ZUNoYW5nZSIsInN0YXRlIiwiZW5hYmxlT2ZmbGluZVN1cHBvcnQiLCJzdGFydHVwIiwiY29uZmlndXJlIiwiX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQiLCJjcmVhdGVIYXNoVGFnUXVlcnlMYXlvdXQiLCJmb3JtYXRTZWFyY2hRdWVyeSIsImRlc3Ryb3kiLCJfZGVzdHJveWVkIiwiZGVzdHJveVJlY3Vyc2l2ZSIsIl9nZXRTdG9yZUF0dHIiLCJjcmVhdGVTdG9yZSIsInNob3ciLCJyZXNldFNlYXJjaCIsImFsbG93RW1wdHlTZWxlY3Rpb24iLCJyZXF1aXJlU2VsZWN0aW9uIiwiY3JlYXRlVG9vbExheW91dCIsInRiYXIiLCJzdmciLCJhY3Rpb24iLCJzZWN1cml0eSIsImFwcCIsImdldFZpZXdTZWN1cml0eSIsIl9yZWZyZXNoQWRkZWQiLCJ3aW5kb3ciLCJBcHAiLCJzdXBwb3J0c1RvdWNoIiwiY3JlYXRlRXJyb3JIYW5kbGVycyIsImVycm9ySGFuZGxlcnMiLCJuYW1lIiwidGVzdCIsInRlc3RBYm9ydGVkIiwiZXJyb3IiLCJhYm9ydGVkIiwiaGFuZGxlIiwiaGFuZGxlQWJvcnRlZCIsIm5leHQiLCJ0ZXN0RXJyb3IiLCJoYW5kbGVFcnJvciIsImFsZXJ0IiwiZ2V0RXJyb3JNZXNzYWdlIiwidGVzdENhdGNoQWxsIiwiaGFuZGxlQ2F0Y2hBbGwiLCJfbG9nRXJyb3IiLCJfY2xlYXJMb2FkaW5nIiwiY3JlYXRlQWN0aW9uTGF5b3V0IiwiY3JlYXRlQWN0aW9ucyIsImEiLCJyZWR1Y2UiLCJfcmVtb3ZlQWN0aW9uRHVwbGljYXRlcyIsImVuc3VyZVF1aWNrQWN0aW9uUHJlZnMiLCJzeXN0ZW1BY3Rpb25zIiwiZmlsdGVyIiwic3lzdGVtQWN0aW9uIiwicHJlZkFjdGlvbnMiLCJwcmVmZXJlbmNlcyIsInF1aWNrQWN0aW9ucyIsImNvbmNhdCIsImkiLCJ2aXNpYmxlIiwib3JpZyIsIngiLCJhY3Rpb25JbmRleCIsImhhc0FjY2VzcyIsImhhc0FjY2Vzc1RvIiwiZXhwYW5kRXhwcmVzc2lvbiIsIm1peGluIiwiYWN0aW9uVGVtcGxhdGUiLCJ0ZW1wbGF0ZSIsInRlbXBsYXRlRG9tIiwiYXBwbHkiLCJjcmVhdGVTeXN0ZW1BY3Rpb25MYXlvdXQiLCJvdGhlcnMiLCJjbHMiLCJsYWJlbCIsImNvbmZpZ3VyZVF1aWNrQWN0aW9ucyIsInZpZXciLCJnZXRWaWV3Iiwidmlld0lkIiwic2VsZWN0RW50cnlTaWxlbnQiLCJrZXkiLCJnZXQiLCJzZWxlY3Rpb24iLCJ0b2dnbGUiLCJzZWxlY3RlZEl0ZW1zIiwiZ2V0U2VsZWN0aW9ucyIsInByb3AiLCJoYXNPd25Qcm9wZXJ0eSIsImludm9rZUFjdGlvbkl0ZW1CeSIsImFjdGlvblByZWRpY2F0ZSIsImNoZWNrQWN0aW9uU3RhdGUiLCJfaW52b2tlQWN0aW9uIiwiaW52b2tlQWN0aW9uSXRlbSIsInBhcmFtZXRlcnMiLCJldnQiLCJwb3B1cG1lbnUiLCJwYXJlbnQiLCJwcmV2Iiwic2V0VGltZW91dCIsImNsb3NlIiwiaW5kZXgiLCJkZXNlbGVjdCIsImlzRW5hYmxlZCIsImZuIiwiY2FsbCIsInNjb3BlIiwiaGFzQWN0aW9uIiwiaW52b2tlQWN0aW9uIiwicm93Tm9kZSIsIl9hcHBseVN0YXRlVG9BY3Rpb25zIiwiZ2V0UXVpY2tBY3Rpb25QcmVmcyIsImFjYyIsImN1ciIsImhhc0lEIiwic29tZSIsIml0ZW0iLCJhcHBQcmVmcyIsImFjdGlvblByZWZzIiwiZmlsdGVyZWQiLCJtYXAiLCJwZXJzaXN0UHJlZmVyZW5jZXMiLCJhY3Rpb25Sb3ciLCJlbXB0eSIsInZpc2libGVBY3Rpb24iLCJfZ2V0QWN0aW9uQnlJZCIsImVuYWJsZWQiLCJjbG9uZSIsInRvZ2dsZUNsYXNzIiwiYXBwZW5kVG8iLCJwb3B1cG1lbnVOb2RlIiwicG9zaXRpb24iLCJzaG93QWN0aW9uUGFuZWwiLCJvbkFwcGx5Um93QWN0aW9uUGFuZWwiLCJzZXRTb3VyY2UiLCJzb3VyY2UiLCJoaWRlQWN0aW9uUGFuZWwiLCJpc05hdmlnYXRpb25EaXNhYmxlZCIsInNlbGVjdGlvbk9ubHkiLCJpc1NlbGVjdGlvbkRpc2FibGVkIiwidGFnIiwicmVtb3ZlQ2xhc3MiLCJfbG9hZFByZXZpb3VzU2VsZWN0aW9ucyIsInByZXZpb3VzU2VsZWN0aW9ucyIsInJvdyIsImFjdGl2YXRlRW50cnkiLCJkZXNjcmlwdG9yIiwiJHNvdXJjZSIsImFwcGx5Um93SW5kaWNhdG9ycyIsIml0ZW1JbmRpY2F0b3JzIiwidG9wSW5kaWNhdG9yc05vZGUiLCJib3R0b21JbmRpY2F0b3JzTm9kZSIsImNoaWxkTm9kZXMiLCJjdXN0b21pemVMYXlvdXQiLCJjcmVhdGVJbmRpY2F0b3JzIiwiY3JlYXRlSW5kaWNhdG9yTGF5b3V0Iiwib25BcHBseSIsImhhc0JlZW5Ub3VjaGVkIiwiTW9kaWZ5RGF0ZSIsIm1vZGlmaWVkRGF0ZSIsIm1vbWVudCIsInRvRGF0ZUZyb21TdHJpbmciLCJjdXJyZW50RGF0ZSIsImVuZE9mIiwid2Vla0FnbyIsInN1YnRyYWN0IiwiaXNBZnRlciIsImlzQmVmb3JlIiwiX3JlZnJlc2hMaXN0IiwiZ2V0VW5sb2FkZWRTZWxlY3Rpb25zIiwiT2JqZWN0Iiwia2V5cyIsIm9uU2Nyb2xsIiwiaGVpZ2h0Iiwic2Nyb2xsSGVpZ2h0Iiwic2Nyb2xsVG9wIiwicmVtYWluaW5nIiwiZGlmZiIsIk1hdGgiLCJhYnMiLCJoYXNNb3JlRGF0YSIsIm1vcmUiLCJzZWxlY3RFbnRyeSIsInBhcmFtcyIsInNlbGVjdCIsInNpbmdsZVNlbGVjdCIsInNpbmdsZVNlbGVjdEFjdGlvbiIsImludm9rZVNpbmdsZVNlbGVjdEFjdGlvbiIsIiRldmVudCIsInRhcmdldCIsImNsYXNzTmFtZSIsImluZGV4T2YiLCJuYXZpZ2F0ZVRvRGV0YWlsVmlldyIsImJhcnMiLCJpbnZva2VUb29sIiwidG9vbCIsImVzY2FwZVNlYXJjaFF1ZXJ5Iiwic2VhcmNoUXVlcnkiLCJleHByZXNzaW9uIiwicXVlcnlUZXh0IiwicXVlcnkiLCJyZXF1ZXN0RGF0YSIsImNvbmZpZ3VyZVNlYXJjaCIsImNvbnRleHQiLCJnZXRDb250ZXh0IiwiX3NldERlZmF1bHRTZWFyY2hUZXJtIiwic2V0U2VhcmNoVGVybSIsIl91cGRhdGVRdWVyeSIsImdldFNlYXJjaFF1ZXJ5IiwicmVzdWx0cyIsImdldEZvcm1hdHRlZFNlYXJjaFF1ZXJ5IiwibmF2aWdhdGVUb1JlbGF0ZWRWaWV3Iiwid2hlcmVRdWVyeUZtdCIsImFkZGl0aW9uYWxPcHRpb25zIiwid2hlcmUiLCJzdWJzdGl0dXRlIiwic2VsZWN0ZWRFbnRyeSIsImZyb21Db250ZXh0IiwibmF2aWdhdGVUb0VkaXRWaWV3IiwibmF2aWdhdGVUb0luc2VydFZpZXciLCJyZXR1cm5UbyIsImluc2VydCIsIl9zZXRMb2FkaW5nIiwiX21vZGVsIiwiZ2V0U2VhcmNoRXhwcmVzc2lvbiIsInF1ZXJ5UmVzdWx0cyIsInF1ZXJ5T3B0aW9ucyIsInF1ZXJ5RXhwcmVzc2lvbiIsImNvdW50Iiwic3RhcnQiLCJfYXBwbHlTdGF0ZVRvUXVlcnlPcHRpb25zIiwiX2J1aWxkUXVlcnlFeHByZXNzaW9uIiwicmVxdWVzdERhdGFVc2luZ01vZGVsIiwicmVxdWVzdERhdGFVc2luZ1N0b3JlIiwid2hlbiIsImRvbmUiLCJfb25RdWVyeUNvbXBsZXRlIiwiZmFpbCIsIl9vblF1ZXJ5RXJyb3IiLCJyZXR1cm5RdWVyeVJlc3VsdHMiLCJxdWVyeU1vZGVsTmFtZSIsImdldEVudHJpZXMiLCJwb3N0TWl4SW5Qcm9wZXJ0aWVzIiwiZ2V0SXRlbUFjdGlvbktleSIsImdldElkZW50aXR5IiwiZ2V0SXRlbURlc2NyaXB0b3IiLCIkZGVzY3JpcHRvciIsImdldEl0ZW1JY29uQ2xhc3MiLCJpdGVtSWNvbkNsYXNzIiwiZ2V0SXRlbUljb25Tb3VyY2UiLCJpdGVtSWNvbiIsImljb24iLCJnZXRJdGVtSWNvbkFsdCIsIml0ZW1JY29uQWx0VGV4dCIsImluZGljYXRvcnMiLCJzZWxmIiwiaW5kaWNhdG9yIiwiaWNvblBhdGgiLCJpdGVtSW5kaWNhdG9ySWNvblBhdGgiLCJlcnIiLCJpbmRpY2F0b3JJbmRleCIsImluZGljYXRvckljb24iLCJpY29uQ2xzIiwiaW5kaWNhdG9yVGVtcGxhdGUiLCJzaG93SWNvbiIsIml0ZW1JbmRpY2F0b3JTaG93RGlzYWJsZWQiLCJpbmRpY2F0b3JIVE1MIiwibG9jYXRpb24iLCJhcHBlbmQiLCJ0b3RhbCIsInJlc3VsdCIsIl9vblF1ZXJ5VG90YWwiLCJfb25RdWVyeVRvdGFsRXJyb3IiLCJsb2FkaW5nSW5kaWNhdG9yTm9kZSIsInJlbW92ZSIsInByb2Nlc3NEYXRhIiwiX29uU2Nyb2xsSGFuZGxlIiwib25Db250ZW50Q2hhbmdlIiwicHVibGlzaCIsImUiLCJtZXNzYWdlIiwic3RhY2siLCJfcHJvY2Vzc0VudHJ5Iiwic2l6ZSIsImdldFJlbWFpbmluZ0NvdW50Iiwib25BcHBseVJvd1RlbXBsYXRlIiwiaW5pdFJvd1F1aWNrQWN0aW9ucyIsImJ0biIsImF0dHJpYnV0ZXMiLCJ2YWx1ZSIsImFyZ3MiLCJFdmVudCIsIl9pbml0aWF0ZUFjdGlvbkZyb21FdmVudCIsImRvY2ZyYWciLCJkb2N1bWVudCIsImNyZWF0ZURvY3VtZW50RnJhZ21lbnQiLCJjcmVhdGVJdGVtUm93Tm9kZSIsImNvbHVtbiIsImVsZW1lbnQiLCJhcHBlbmRDaGlsZCIsImRlZmF1bHRJZCIsIm1vZGVsSWQiLCJzdG9yZUlkIiwiZ2V0RW50aXR5SWQiLCJlcnJvckl0ZW0iLCJ2aWV3T3B0aW9ucyIsInNlcnZlckVycm9yIiwiYWRkRXJyb3IiLCJlbXB0eVNlbGVjdGlvbiIsInJlZnJlc2hSZXF1aXJlZEZvciIsInN0YXRlS2V5IiwicmVzb3VyY2VQcmVkaWNhdGUiLCJiZWZvcmVUcmFuc2l0aW9uVG8iLCJ1c2VTaW5nbGVTZWxlY3Rpb24iLCJ0cmFuc2l0aW9uVG8iLCJsYXlvdXQiLCJoYXNoVGFnUXVlcmllc1RleHQiLCJhbGwiLCJzdXNwZW5kRXZlbnRzIiwicmVzdW1lRXZlbnRzIiwicmVxdWVzdGVkRmlyc3RQYWdlIiwiaGFzU2VhcmNoZWQiLCJzZWFyY2giLCJnZXRMaXN0Q291bnQiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7Ozs7Ozs7Ozs7OztBQTZCQSxNQUFNQSxXQUFXLG9CQUFZLFVBQVosQ0FBakI7QUFDQSxNQUFNQyxjQUFjLG9CQUFZLGdCQUFaLENBQXBCOztBQUVBOzs7Ozs7O0FBT0EsTUFBTUMsVUFBVSx1QkFBUSxpQkFBUixFQUEyQiw4Q0FBM0IsRUFBd0QsOEJBQThCO0FBQ3BHOzs7Ozs7O0FBT0FDLHNCQUFrQkYsWUFBWUUsZ0JBUnNFO0FBU3BHQyxrQkFBYztBQUNaQyxtQkFBYTtBQUNYQyxjQUFNLGFBREs7QUFFWEMsY0FBTTtBQUZLLE9BREQ7QUFLWkMsd0JBQWtCO0FBQ2hCRixjQUFNLHNCQURVO0FBRWhCQyxjQUFNO0FBRlUsT0FMTjtBQVNaRSxhQUFPLGVBQUtDLFNBQUwsQ0FBZU4sWUFBZixDQUE0QkssS0FUdkI7QUFVWkUsZ0JBQVUsZUFBS0QsU0FBTCxDQUFlTixZ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QUFTQSxhQUFULENBQXVCbUYsS0FBdkIsRUFBOEI7QUFDM0MsVUFBSSxLQUFLbFgsWUFBVCxFQUF1QjtBQUNyQixhQUFLQSxZQUFMLENBQWtCc0QsR0FBbEIsQ0FBc0IsWUFBdEIsRUFBb0M0VCxLQUFwQztBQUNEO0FBQ0YsS0F6aEVtRztBQTBoRXBHOzs7QUFHQWtDLGtCQUFjLFNBQVNBLFlBQVQsR0FBc0Isc0JBQXdCLENBQUU7QUE3aEVzQyxHQUF0RixDQUFoQjs7b0JBZ2lFZXZkLE8iLCJmaWxlIjoiX0xpc3RCYXNlLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgY29ubmVjdCBmcm9tICdkb2pvL19iYXNlL2Nvbm5lY3QnO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuaW1wb3J0IFV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5JztcclxuaW1wb3J0IEVycm9yTWFuYWdlciBmcm9tICcuL0Vycm9yTWFuYWdlcic7XHJcbmltcG9ydCBWaWV3IGZyb20gJy4vVmlldyc7XHJcbmltcG9ydCBTZWFyY2hXaWRnZXQgZnJvbSAnLi9TZWFyY2hXaWRnZXQnO1xyXG5pbXBvcnQgQ29uZmlndXJhYmxlU2VsZWN0aW9uTW9kZWwgZnJvbSAnLi9Db25maWd1cmFibGVTZWxlY3Rpb25Nb2RlbCc7XHJcbmltcG9ydCBfUHVsbFRvUmVmcmVzaE1peGluIGZyb20gJy4vX1B1bGxUb1JlZnJlc2hNaXhpbic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5pbXBvcnQgY29udmVydCBmcm9tICdhcmdvcy9Db252ZXJ0JztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdsaXN0QmFzZScpO1xyXG5jb25zdCByZXNvdXJjZVNESyA9IGdldFJlc291cmNlKCdzZGtBcHBsaWNhdGlvbicpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzc2Rlc2MgQSBMaXN0IFZpZXcgaXMgYSB2aWV3IHVzZWQgdG8gZGlzcGxheSBhIGNvbGxlY3Rpb24gb2YgZW50cmllcyBpbiBhbiBlYXN5IHRvIHNraW0gbGlzdC4gVGhlIExpc3QgVmlldyBhbHNvIGhhcyBhXHJcbiAqIHNlbGVjdGlvbiBtb2RlbCBidWlsdCBpbiBmb3Igc2VsZWN0aW5nIHJvd3MgZnJvbSB0aGUgbGlzdCBhbmQgbWF5IGJlIHVzZWQgaW4gYSBudW1iZXIgb2YgZGlmZmVyZW50IG1hbm5lcnMuXHJcbiAqIEBjbGFzcyBhcmdvcy5fTGlzdEJhc2VcclxuICogQGV4dGVuZHMgYXJnb3MuVmlld1xyXG4gKiBAbWl4aW5zIGFyZ29zLl9QdWxsVG9SZWZyZXNoTWl4aW5cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fTGlzdEJhc2UnLCBbVmlldywgX1B1bGxUb1JlZnJlc2hNaXhpbl0sIC8qKiBAbGVuZHMgYXJnb3MuX0xpc3RCYXNlIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBDcmVhdGVzIGEgc2V0dGVyIG1hcCB0byBodG1sIG5vZGVzLCBuYW1lbHk6XHJcbiAgICpcclxuICAgKiAqIGxpc3RDb250ZW50ID0+IGNvbnRlbnROb2RlJ3MgaW5uZXJIVE1MXHJcbiAgICogKiByZW1haW5pbmdDb250ZW50ID0+IHJlbWFpbmluZ0NvbnRlbnROb2RlJ3MgaW5uZXJIVE1MXHJcbiAgICovXHJcbiAgdmlld1NldHRpbmdzVGV4dDogcmVzb3VyY2VTREsudmlld1NldHRpbmdzVGV4dCxcclxuICBhdHRyaWJ1dGVNYXA6IHtcclxuICAgIGxpc3RDb250ZW50OiB7XHJcbiAgICAgIG5vZGU6ICdjb250ZW50Tm9kZScsXHJcbiAgICAgIHR5cGU6ICdpbm5lckhUTUwnLFxyXG4gICAgfSxcclxuICAgIHJlbWFpbmluZ0NvbnRlbnQ6IHtcclxuICAgICAgbm9kZTogJ3JlbWFpbmluZ0NvbnRlbnROb2RlJyxcclxuICAgICAgdHlwZTogJ2lubmVySFRNTCcsXHJcbiAgICB9LFxyXG4gICAgdGl0bGU6IFZpZXcucHJvdG90eXBlLmF0dHJpYnV0ZU1hcC50aXRsZSxcclxuICAgIHNlbGVjdGVkOiBWaWV3LnByb3RvdHlwZS5hdHRyaWJ1dGVNYXAuc2VsZWN0ZWQsXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKlxyXG4gICAqICBNYXBzIHRvIFV0aWxpdHkgQ2xhc3NcclxuICAgKi9cclxuICB1dGlsaXR5OiBVdGlsaXR5LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIHRoZSB2aWV3J3MgbWFpbiBET00gZWxlbWVudCB3aGVuIHRoZSB2aWV3IGlzIGluaXRpYWxpemVkLlxyXG4gICAqIFRoaXMgdGVtcGxhdGUgaW5jbHVkZXMgZW1wdHlTZWxlY3Rpb25UZW1wbGF0ZSwgbW9yZVRlbXBsYXRlIGFuZCBsaXN0QWN0aW9uVGVtcGxhdGUuXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSB1c2VzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICAgKlxyXG4gICAqICAgICAgbmFtZSAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAqICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqICAgICAgaWQgICAgICAgICAgICAgICAgICAgbWFpbiBjb250YWluZXIgZGl2IGlkXHJcbiAgICogICAgICB0aXRsZSAgICAgICAgICAgICAgICBtYWluIGNvbnRhaW5lciBkaXYgdGl0bGUgYXR0clxyXG4gICAqICAgICAgY2xzICAgICAgICAgICAgICAgICAgYWRkaXRpb25hbCBjbGFzcyBzdHJpbmcgYWRkZWQgdG8gdGhlIG1haW4gY29udGFpbmVyIGRpdlxyXG4gICAqICAgICAgcmVzb3VyY2VLaW5kICAgICAgICAgc2V0IHRvIGRhdGEtcmVzb3VyY2Uta2luZFxyXG4gICAqXHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgPGRpdiBpZD1cInslPSAkLmlkICV9XCIgZGF0YS10aXRsZT1cInslPSAkLnRpdGxlVGV4dCAlfVwiIGNsYXNzPVwibGlzdCB7JT0gJC5jbHMgJX1cIiB7JSBpZiAoJC5yZXNvdXJjZUtpbmQpIHsgJX1kYXRhLXJlc291cmNlLWtpbmQ9XCJ7JT0gJC5yZXNvdXJjZUtpbmQgJX1cInslIH0gJX0+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJwYWdlLWNvbnRhaW5lciBzY3JvbGxhYmxleyUgaWYgKCQkLmlzTmF2aWdhdGlvbkRpc2FibGVkKCkpIHsgJX0gaXMtbXVsdGlzZWxlY3QgaXMtc2VsZWN0YWJsZSBpcy10b29sYmFyLW9wZW4geyUgfSAlfSB7JSBpZiAoISQkLmlzQ2FyZFZpZXcpIHsgJX0gbGlzdHZpZXcgeyUgfSAlfVwiXHJcbiAgICAgICAgeyUgaWYgKCQkLmlzTmF2aWdhdGlvbkRpc2FibGVkKCkpIHsgJX1cclxuICAgICAgICBkYXRhLXNlbGVjdGFibGU9XCJtdWx0aXBsZVwiXHJcbiAgICAgICAgeyUgfSBlbHNlIHsgJX1cclxuICAgICAgICBkYXRhLXNlbGVjdGFibGU9XCJmYWxzZVwiXHJcbiAgICAgICAgeyUgfSAlfVxyXG4gICAgICAgIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJzY3JvbGxlck5vZGVcIj5cclxuICAgICAgICAgIDxkaXYgY2xhc3M9XCJ0b29sYmFyIGhhcy10aXRsZS1idXR0b25cIiByb2xlPVwidG9vbGJhclwiIGFyaWEtbGFiZWw9XCJMaXN0IFRvb2xiYXJcIj5cclxuICAgICAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgPGgxPjwvaDE+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uc2V0XCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRvb2xOb2RlXCI+XHJcbiAgICAgICAgICAgICAgeyUgaWYoJC5lbmFibGVTZWFyY2gpIHsgJX1cclxuICAgICAgICAgICAgICA8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJzZWFyY2hOb2RlXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgeyUgfSAlfVxyXG4gICAgICAgICAgICAgIHslIGlmKCQuaGFzU2V0dGluZ3MpIHsgJX1cclxuICAgICAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuXCIgdGl0bGU9XCJ7JT0gJC52aWV3U2V0dGluZ3NUZXh0ICV9XCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtYWN0aW9uPVwib3BlblNldHRpbmdzXCIgYXJpYS1jb250cm9scz1cImxpc3RfdG9vbGJhcl9zZXR0aW5nX3slPSAkLmlkICV9XCI+XHJcbiAgICAgICAgICAgICAgICA8c3ZnIGNsYXNzPVwiaWNvblwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj48dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1zZXR0aW5nc1wiPjwvdXNlPjwvc3ZnPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhdWRpYmxlXCI+TGlzdCBTZXR0aW5nczwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgICAgICB7JSB9ICV9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICB7JSBpZiAoJCQuaXNOYXZpZ2F0aW9uRGlzYWJsZWQoKSkgeyAlfVxyXG4gICAgICAgICAgPGRpdiBjbGFzcz1cImNvbnRleHR1YWwtdG9vbGJhciB0b29sYmFyIGlzLWhpZGRlblwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uc2V0XCI+XHJcbiAgICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi10ZXJ0aWFyeVwiIHRpdGxlPVwiQXNzaWduIFNlbGVjdGVkIEl0ZW1zXCIgdHlwZT1cImJ1dHRvblwiPkFzc2lnbjwvYnV0dG9uPlxyXG4gICAgICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tdGVydGlhcnlcIiBpZD1cInJlbW92ZVwiIHRpdGxlPVwiUmVtb3ZlIFNlbGVjdGVkIEl0ZW1zXCIgdHlwZT1cImJ1dHRvblwiPlJlbW92ZTwvYnV0dG9uPlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgeyUgfSAlfVxyXG4gICAgICAgIHslISAkLmVtcHR5U2VsZWN0aW9uVGVtcGxhdGUgJX1cclxuICAgICAgICB7JSBpZiAoJCQuaXNDYXJkVmlldykgeyAlfVxyXG4gICAgICAgICAgPGRpdiByb2xlPVwicHJlc2VudGF0aW9uXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImNvbnRlbnROb2RlXCI+PC9kaXY+XHJcbiAgICAgICAgeyUgfSBlbHNlIHsgJX1cclxuICAgICAgICAgIDx1bCBjbGFzcz1cImxpc3QtY29udGVudFwiIHJvbGU9XCJwcmVzZW50YXRpb25cIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiY29udGVudE5vZGVcIj48L3VsPlxyXG4gICAgICAgIHslIH0gJX1cclxuICAgICAgICB7JSEgJC5tb3JlVGVtcGxhdGUgJX1cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBUaGUgdGVtcGxhdGUgdXNlZCB0byByZW5kZXIgdGhlIGxvYWRpbmcgbWVzc2FnZSB3aGVuIHRoZSB2aWV3IGlzIHJlcXVlc3RpbmcgbW9yZSBkYXRhLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgdXNlcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICpcclxuICAgKiAgICAgIG5hbWUgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgKiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiAgICAgIGxvYWRpbmdUZXh0ICAgICAgICAgVGhlIHRleHQgdG8gZGlzcGxheSB3aGlsZSBsb2FkaW5nLlxyXG4gICAqL1xyXG4gIGxvYWRpbmdUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiYnVzeS1pbmRpY2F0b3ItY29udGFpbmVyXCIgYXJpYS1saXZlPVwicG9saXRlXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYnVzeS1pbmRpY2F0b3IgYWN0aXZlXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIG9uZVwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciB0d29cIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdGhyZWVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZm91clwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBmaXZlXCI+PC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzxzcGFuPnslOiAkLmxvYWRpbmdUZXh0ICV9PC9zcGFuPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciB0aGUgcGFnZXIgYXQgdGhlIGJvdHRvbSBvZiB0aGUgdmlldy4gIFRoaXMgdGVtcGxhdGUgaXMgbm90IGRpcmVjdGx5IHJlbmRlcmVkLCBidXQgaXNcclxuICAgKiBpbmNsdWRlZCBpbiB7QGxpbmsgI3ZpZXdUZW1wbGF0ZX0uXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSB1c2VzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICAgKlxyXG4gICAqICAgICAgbmFtZSAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAqICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqICAgICAgbW9yZVRleHQgICAgICAgICAgICBUaGUgdGV4dCB0byBkaXNwbGF5IG9uIHRoZSBtb3JlIGJ1dHRvbi5cclxuICAgKlxyXG4gICAqIFRoZSBkZWZhdWx0IHRlbXBsYXRlIGV4cG9zZXMgdGhlIGZvbGxvd2luZyBhY3Rpb25zOlxyXG4gICAqXHJcbiAgICogKiBtb3JlXHJcbiAgICovXHJcbiAgbW9yZVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJsaXN0LW1vcmVcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwibW9yZU5vZGVcIj4nLFxyXG4gICAgJzxwIGNsYXNzPVwibGlzdC1yZW1haW5pbmdcIj48c3BhbiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwicmVtYWluaW5nQ29udGVudE5vZGVcIj48L3NwYW4+PC9wPicsXHJcbiAgICAnPGJ1dHRvbiBjbGFzcz1cImJ0blwiIGRhdGEtYWN0aW9uPVwibW9yZVwiPicsXHJcbiAgICAnPHNwYW4+eyU9ICQubW9yZVRleHQgJX08L3NwYW4+JyxcclxuICAgICc8L2J1dHRvbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEluZGljYXRlcyB3aGV0aGVyIGEgdGVtcGxhdGUgaXMgYSBjYXJkIHZpZXcgb3IgYSBsaXN0XHJcbiAgICovXHJcbiAgaXNDYXJkVmlldzogdHJ1ZSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEluZGljYXRlcyBpZiB0aGVyZSBpcyBhIGxpc3Qgc2V0dGluZ3MgbW9kYWwuXHJcbiAgICovXHJcbiAgaGFzU2V0dGluZ3M6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIGxpc3RiYXNlIGNhbGN1bGF0ZWQgcHJvcGVydHkgYmFzZWQgb24gYWN0aW9ucyBhdmFpbGFibGVcclxuICAgKi9cclxuICB2aXNpYmxlQWN0aW9uczogW10sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBUZW1wbGF0ZSB1c2VkIG9uIGxvb2t1cHMgdG8gaGF2ZSBlbXB0eSBTZWxlY3Rpb24gb3B0aW9uLlxyXG4gICAqIFRoaXMgdGVtcGxhdGUgaXMgbm90IGRpcmVjdGx5IHJlbmRlcmVkIGJ1dCBpbmNsdWRlZCBpbiB7QGxpbmsgI3ZpZXdUZW1wbGF0ZX0uXHJcbiAgICpcclxuICAgKiBUaGUgZGVmYXVsdCB0ZW1wbGF0ZSB1c2VzIHRoZSBmb2xsb3dpbmcgcHJvcGVydGllczpcclxuICAgKlxyXG4gICAqICAgICAgbmFtZSAgICAgICAgICAgICAgICBkZXNjcmlwdGlvblxyXG4gICAqICAgICAgLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxyXG4gICAqICAgICAgZW1wdHlTZWxlY3Rpb25UZXh0ICBUaGUgdGV4dCB0byBkaXNwbGF5IG9uIHRoZSBlbXB0eSBTZWxlY3Rpb24gYnV0dG9uLlxyXG4gICAqXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgZXhwb3NlcyB0aGUgZm9sbG93aW5nIGFjdGlvbnM6XHJcbiAgICpcclxuICAgKiAqIGVtcHR5U2VsZWN0aW9uXHJcbiAgICovXHJcbiAgZW1wdHlTZWxlY3Rpb25UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwibGlzdC1lbXB0eS1vcHRcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiZW1wdHlTZWxlY3Rpb25Ob2RlXCI+JyxcclxuICAgICc8YnV0dG9uIGNsYXNzPVwiYnV0dG9uXCIgZGF0YS1hY3Rpb249XCJlbXB0eVNlbGVjdGlvblwiPicsXHJcbiAgICAnPHNwYW4+eyU9ICQuZW1wdHlTZWxlY3Rpb25UZXh0ICV9PC9zcGFuPicsXHJcbiAgICAnPC9idXR0b24+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogVGhlIHRlbXBsYXRlIHVzZWQgdG8gcmVuZGVyIGEgcm93IGluIHRoZSB2aWV3LiAgVGhpcyB0ZW1wbGF0ZSBpbmNsdWRlcyB7QGxpbmsgI2l0ZW1UZW1wbGF0ZX0uXHJcbiAgICovXHJcbiAgcm93VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgPGRpdiBkYXRhLWFjdGlvbj1cImFjdGl2YXRlRW50cnlcIiBkYXRhLWtleT1cInslPSAkJC5nZXRJdGVtQWN0aW9uS2V5KCQpICV9XCIgZGF0YS1kZXNjcmlwdG9yPVwieyU6ICQkLmdldEl0ZW1EZXNjcmlwdG9yKCQpICV9XCI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJ3aWRnZXRcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwid2lkZ2V0LWhlYWRlclwiPlxyXG4gICAgICAgICAgeyUhICQkLml0ZW1JY29uVGVtcGxhdGUgJX1cclxuICAgICAgICAgIDxoMiBjbGFzcz1cIndpZGdldC10aXRsZVwiPnslOiAkJC5nZXRUaXRsZSgkLCAkJC5sYWJlbFByb3BlcnR5KSAlfTwvaDI+XHJcbiAgICAgICAgICB7JSBpZigkJC52aXNpYmxlQWN0aW9ucy5sZW5ndGggPiAwICYmICQkLmVuYWJsZUFjdGlvbnMpIHsgJX1cclxuICAgICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1hY3Rpb25zXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEta2V5PVwieyU9ICQkLmdldEl0ZW1BY3Rpb25LZXkoJCkgJX1cIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImF1ZGlibGVcIj5BY3Rpb25zPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1tb3JlXCI+PC91c2U+XHJcbiAgICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgICB7JSEgJCQubGlzdEFjdGlvblRlbXBsYXRlICV9XHJcbiAgICAgICAgICB7JSB9ICV9XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImNhcmQtY29udGVudFwiPlxyXG4gICAgICAgICAgeyUhICQkLml0ZW1Sb3dDb250ZW50VGVtcGxhdGUgJX1cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2Rpdj5cclxuICAgIGAsXHJcbiAgXSksXHJcbiAgbGlSb3dUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8bGkgZGF0YS1hY3Rpb249XCJhY3RpdmF0ZUVudHJ5XCIgZGF0YS1rZXk9XCJ7JT0gJFskJC5pZFByb3BlcnR5XSAlfVwiIGRhdGEtZGVzY3JpcHRvcj1cInslOiAkJC51dGlsaXR5LmdldFZhbHVlKCQsICQkLmxhYmVsUHJvcGVydHkpICV9XCI+JyxcclxuICAgICd7JSBpZiAoJCQuaWNvbiB8fCAkJC5zZWxlY3RJY29uKSB7ICV9JyxcclxuICAgICc8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1pY29uIGhpZGUtZm9jdXMgbGlzdC1pdGVtLXNlbGVjdG9yXCIgZGF0YS1hY3Rpb249XCJzZWxlY3RFbnRyeVwiPicsXHJcbiAgICBgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi17JT0gJCQuaWNvbiB8fCAkJC5zZWxlY3RJY29uICV9XCIgLz5cclxuICAgICAgPC9zdmc+YCxcclxuICAgICc8L2J1dHRvbj4nLFxyXG4gICAgJ3slIH0gJX0nLFxyXG4gICAgJzwvYnV0dG9uPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImxpc3QtaXRlbS1jb250ZW50XCI+eyUhICQkLml0ZW1UZW1wbGF0ZSAlfTwvZGl2PicsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciB0aGUgY29udGVudCBvZiBhIHJvdy4gIFRoaXMgdGVtcGxhdGUgaXMgbm90IGRpcmVjdGx5IHJlbmRlcmVkLCBidXQgaXNcclxuICAgKiBpbmNsdWRlZCBpbiB7QGxpbmsgI3Jvd1RlbXBsYXRlfS5cclxuICAgKlxyXG4gICAqIFRoaXMgcHJvcGVydHkgc2hvdWxkIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGRlcml2ZWQgY2xhc3MuXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICovXHJcbiAgaXRlbVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxwPnslOiAkWyQkLmxhYmVsUHJvcGVydHldICV9PC9wPicsXHJcbiAgICAnPHAgY2xhc3M9XCJtaWNyby10ZXh0XCI+eyU6ICRbJCQuaWRQcm9wZXJ0eV0gJX08L3A+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciBhIG1lc3NhZ2UgaWYgdGhlcmUgaXMgbm8gZGF0YSBhdmFpbGFibGUuXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgdXNlcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICpcclxuICAgKiAgICAgIG5hbWUgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgKiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiAgICAgIG5vRGF0YVRleHQgICAgICAgICAgVGhlIHRleHQgdG8gZGlzcGxheSBpZiB0aGVyZSBpcyBubyBkYXRhLlxyXG4gICAqL1xyXG4gIG5vRGF0YVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJuby1kYXRhXCI+JyxcclxuICAgICc8cD57JT0gJC5ub0RhdGFUZXh0ICV9PC9wPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciB0aGUgc2luZ2xlIGxpc3QgYWN0aW9uIHJvdy5cclxuICAgKi9cclxuICBsaXN0QWN0aW9uVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPHVsIGlkPVwicG9wdXBtZW51LXslPSAkJC5nZXRJdGVtQWN0aW9uS2V5KCQpICV9XCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImFjdGlvbnNOb2RlXCIgY2xhc3M9XCJwb3B1cG1lbnVcIj4nLFxyXG4gICAgJ3slISAkJC5sb2FkaW5nVGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvdWw+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciBhIGxpc3QgYWN0aW9uIGl0ZW0uXHJcbiAgICogVGhlIGRlZmF1bHQgdGVtcGxhdGUgdXNlcyB0aGUgZm9sbG93aW5nIHByb3BlcnRpZXM6XHJcbiAgICpcclxuICAgKiAgICAgIG5hbWUgICAgICAgICAgICAgICAgZGVzY3JpcHRpb25cclxuICAgKiAgICAgIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cclxuICAgKiAgICAgIGFjdGlvbkluZGV4ICAgICAgICAgVGhlIGNvcnJlbGF0aW5nIGluZGV4IG51bWJlciBvZiB0aGUgYWN0aW9uIGNvbGxlY3Rpb25cclxuICAgKiAgICAgIHRpdGxlICAgICAgICAgICAgICAgVGV4dCB1c2VkIGZvciBBUklBLWxhYmVsaW5nXHJcbiAgICogICAgICBpY29uICAgICAgICAgICAgICAgIFJlbGF0aXZlIHBhdGggdG8gdGhlIGljb24gdG8gdXNlXHJcbiAgICogICAgICBjbHMgICAgICAgICAgICAgICAgIENTUyBjbGFzcyB0byB1c2UgaW5zdGVhZCBvZiBhbiBpY29uXHJcbiAgICogICAgICBpZCAgICAgICAgICAgICAgICAgIFVuaXF1ZSBuYW1lIG9mIGFjdGlvbiwgYWxzbyB1c2VkIGZvciBhbHQgaW1hZ2UgdGV4dFxyXG4gICAqICAgICAgbGFiZWwgICAgICAgICAgICAgICBUZXh0IGFkZGVkIGJlbG93IHRoZSBpY29uXHJcbiAgICovXHJcbiAgbGlzdEFjdGlvbkl0ZW1UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtgXHJcbiAgICA8bGk+PGEgaHJlZj1cIiNcIiBkYXRhLWFjdGlvbj1cImludm9rZUFjdGlvbkl0ZW1cIiBkYXRhLWlkPVwieyU9ICQuYWN0aW9uSW5kZXggJX1cIj57JTogJC5sYWJlbCAlfTwvYT48L2xpPmBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFRoZSB0ZW1wbGF0ZSB1c2VkIHRvIHJlbmRlciByb3cgY29udGVudCB0ZW1wbGF0ZVxyXG4gICAqL1xyXG4gIGl0ZW1Sb3dDb250ZW50VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInRvcF9pdGVtX2luZGljYXRvcnMgbGlzdC1pdGVtLWluZGljYXRvci1jb250ZW50XCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwibGlzdC1pdGVtLWNvbnRlbnRcIj57JSEgJCQuaXRlbVRlbXBsYXRlICV9PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYm90dG9tX2l0ZW1faW5kaWNhdG9ycyBsaXN0LWl0ZW0taW5kaWNhdG9yLWNvbnRlbnRcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJsaXN0LWl0ZW0tY29udGVudC1yZWxhdGVkXCI+PC9kaXY+JyxcclxuICBdKSxcclxuICBpdGVtSWNvblRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJ3slIGlmICgkJC5nZXRJdGVtSWNvbkNsYXNzKCQpKSB7ICV9JyxcclxuICAgIGA8YnV0dG9uIHR5cGU9XCJidXR0b25cIiBjbGFzcz1cImJ0bi1pY29uIGhpZGUtZm9jdXNcIiBjbGFzcz1cImxpc3QtaXRlbS1zZWxlY3RvciBidXR0b25cIj5cclxuICAgICAgICA8c3ZnIGNsYXNzPVwiaWNvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgICAgICA8dXNlIHhtbG5zOnhsaW5rPVwiaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGlua1wiIHhsaW5rOmhyZWY9XCIjaWNvbi17JT0gJCQuZ2V0SXRlbUljb25DbGFzcygkKSB8fCAnYWxlcnQnICV9XCI+PC91c2U+XHJcbiAgICAgICAgPC9zdmc+XHJcbiAgICA8L2J1dHRvbj5gLFxyXG4gICAgJ3slIH0gZWxzZSBpZiAoJCQuZ2V0SXRlbUljb25Tb3VyY2UoJCkpIHsgJX0nLFxyXG4gICAgJzxidXR0b24gZGF0YS1hY3Rpb249XCJzZWxlY3RFbnRyeVwiIGNsYXNzPVwibGlzdC1pdGVtLXNlbGVjdG9yIGJ1dHRvblwiPicsXHJcbiAgICAnPGltZyBpZD1cImxpc3QtaXRlbS1pbWFnZV97JTogJC4ka2V5ICV9XCIgc3JjPVwieyU6ICQkLmdldEl0ZW1JY29uU291cmNlKCQpICV9XCIgYWx0PVwieyU6ICQkLmdldEl0ZW1JY29uQWx0KCQpICV9XCIgY2xhc3M9XCJpY29uXCIgLz4nLFxyXG4gICAgJzwvYnV0dG9uPicsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBUaGUgdGVtcGxhdGUgdXNlZCB0byByZW5kZXIgaXRlbSBpbmRpY2F0b3JcclxuICAgKi9cclxuICBpdGVtSW5kaWNhdG9yVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3M9XCJidG4taWNvbiBoaWRlLWZvY3VzXCIgdGl0bGU9XCJ7JT0gJC50aXRsZSAlfVwiPicsXHJcbiAgICBgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi17JT0gJC5jbHMgJX1cIiAvPlxyXG4gICAgICA8L3N2Zz5gLFxyXG4gICAgJzwvYnV0dG9uPicsXHJcbiAgXSksXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH1cclxuICAgKiBBdHRhY2ggcG9pbnQgZm9yIHRoZSBtYWluIHZpZXcgY29udGVudFxyXG4gICAqL1xyXG4gIGNvbnRlbnROb2RlOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9XHJcbiAgICogQXR0YWNoIHBvaW50IGZvciB0aGUgcmVtYWluaW5nIGVudHJpZXMgY29udGVudFxyXG4gICAqL1xyXG4gIHJlbWFpbmluZ0NvbnRlbnROb2RlOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9XHJcbiAgICogQXR0YWNoIHBvaW50IGZvciB0aGUgc2VhcmNoIHdpZGdldFxyXG4gICAqL1xyXG4gIHNlYXJjaE5vZGU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH1cclxuICAgKiBBdHRhY2ggcG9pbnQgZm9yIHRoZSBlbXB0eSwgb3Igbm8gc2VsZWN0aW9uLCBjb250YWluZXJcclxuICAgKi9cclxuICBlbXB0eVNlbGVjdGlvbk5vZGU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH1cclxuICAgKiBBdHRhY2ggcG9pbnQgZm9yIHRoZSByZW1haW5pbmcgZW50cmllcyBjb250YWluZXJcclxuICAgKi9cclxuICByZW1haW5pbmdOb2RlOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7SFRNTEVsZW1lbnR9XHJcbiAgICogQXR0YWNoIHBvaW50IGZvciB0aGUgcmVxdWVzdCBtb3JlIGVudHJpZXMgY29udGFpbmVyXHJcbiAgICovXHJcbiAgbW9yZU5vZGU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtIVE1MRWxlbWVudH1cclxuICAgKiBBdHRhY2ggcG9pbnQgZm9yIHRoZSBsaXN0IGFjdGlvbnMgY29udGFpbmVyXHJcbiAgICovXHJcbiAgYWN0aW9uc05vZGU6IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ30gaWRcclxuICAgKiBUaGUgaWQgZm9yIHRoZSB2aWV3LCBhbmQgaXQncyBtYWluIERPTSBlbGVtZW50LlxyXG4gICAqL1xyXG4gIGlkOiAnZ2VuZXJpY19saXN0JyxcclxuXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIFRoZSBTRGF0YSByZXNvdXJjZSBraW5kIHRoZSB2aWV3IGlzIHJlc3BvbnNpYmxlIGZvci4gIFRoaXMgd2lsbCBiZSB1c2VkIGFzIHRoZSBkZWZhdWx0IHJlc291cmNlIGtpbmRcclxuICAgKiBmb3IgYWxsIFNEYXRhIHJlcXVlc3RzLlxyXG4gICAqL1xyXG4gIHJlc291cmNlS2luZDogJycsXHJcbiAgc3RvcmU6IG51bGwsXHJcbiAgZW50cmllczogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge051bWJlcn1cclxuICAgKiBUaGUgbnVtYmVyIG9mIGVudHJpZXMgdG8gcmVxdWVzdCBwZXIgU0RhdGEgcGF5bG9hZC5cclxuICAgKi9cclxuICBwYWdlU2l6ZTogMjEsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIENvbnRyb2xzIHRoZSBhZGRpdGlvbiBvZiBhIHNlYXJjaCB3aWRnZXQuXHJcbiAgICovXHJcbiAgZW5hYmxlU2VhcmNoOiB0cnVlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBGbGFnIHRoYXQgZGV0ZXJtaW5lcyBpZiB0aGUgbGlzdCBhY3Rpb25zIHBhbmVsIHNob3VsZCBiZSBpbiB1c2UuXHJcbiAgICovXHJcbiAgZW5hYmxlQWN0aW9uczogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIENvbnRyb2xzIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSBzZWFyY2ggd2lkZ2V0LlxyXG4gICAqL1xyXG4gIGhpZGVTZWFyY2g6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBUcnVlIHRvIGFsbG93IHNlbGVjdGlvbnMgdmlhIHRoZSBTZWxlY3Rpb25Nb2RlbCBpbiB0aGUgdmlldy5cclxuICAgKi9cclxuICBhbGxvd1NlbGVjdGlvbjogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIFRydWUgdG8gY2xlYXIgdGhlIHNlbGVjdGlvbiBtb2RlbCB3aGVuIHRoZSB2aWV3IGlzIHNob3duLlxyXG4gICAqL1xyXG4gIGF1dG9DbGVhclNlbGVjdGlvbjogdHJ1ZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZy9WaWV3fVxyXG4gICAqIFRoZSBpZCBvZiB0aGUgZGV0YWlsIHZpZXcsIG9yIHZpZXcgaW5zdGFuY2UsIHRvIHNob3cgd2hlbiBhIHJvdyBpcyBjbGlja2VkLlxyXG4gICAqL1xyXG4gIGRldGFpbFZpZXc6IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSBpZCBvZiB0aGUgY29uZmlndXJlIHZpZXcgZm9yIHF1aWNrIGFjdGlvbiBwcmVmZXJlbmNlc1xyXG4gICAqL1xyXG4gIHF1aWNrQWN0aW9uQ29uZmlndXJlVmlldzogJ2NvbmZpZ3VyZV9xdWlja2FjdGlvbnMnLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSB2aWV3IGlkIHRvIHNob3cgaWYgdGhlcmUgaXMgbm8gYGluc2VydFZpZXdgIHNwZWNpZmllZCwgd2hlblxyXG4gICAqIHRoZSB7QGxpbmsgI25hdmlnYXRlVG9JbnNlcnRWaWV3fSBhY3Rpb24gaXMgaW52b2tlZC5cclxuICAgKi9cclxuICBlZGl0VmlldzogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdmlldyBpZCB0byBzaG93IHdoZW4gdGhlIHtAbGluayAjbmF2aWdhdGVUb0luc2VydFZpZXd9IGFjdGlvbiBpcyBpbnZva2VkLlxyXG4gICAqL1xyXG4gIGluc2VydFZpZXc6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHZpZXcgaWQgdG8gc2hvdyB3aGVuIHRoZSB7QGxpbmsgI25hdmlnYXRlVG9Db250ZXh0Vmlld30gYWN0aW9uIGlzIGludm9rZWQuXHJcbiAgICovXHJcbiAgY29udGV4dFZpZXc6IGZhbHNlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIEEgZGljdGlvbmFyeSBvZiBoYXNoIHRhZyBzZWFyY2ggcXVlcmllcy4gIFRoZSBrZXkgaXMgdGhlIGhhc2ggdGFnLCB3aXRob3V0IHRoZSBzeW1ib2wsIGFuZCB0aGUgdmFsdWUgaXNcclxuICAgKiBlaXRoZXIgYSBxdWVyeSBzdHJpbmcsIG9yIGEgZnVuY3Rpb24gdGhhdCByZXR1cm5zIGEgcXVlcnkgc3RyaW5nLlxyXG4gICAqL1xyXG4gIGhhc2hUYWdRdWVyaWVzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIFRoZSB0ZXh0IGRpc3BsYXllZCBpbiB0aGUgbW9yZSBidXR0b24uXHJcbiAgICogQHR5cGUge1N0cmluZ31cclxuICAgKi9cclxuICBtb3JlVGV4dDogcmVzb3VyY2UubW9yZVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgZGlzcGxheWVkIGluIHRoZSBlbXB0eVNlbGVjdGlvbiBidXR0b24uXHJcbiAgICovXHJcbiAgZW1wdHlTZWxlY3Rpb25UZXh0OiByZXNvdXJjZS5lbXB0eVNlbGVjdGlvblRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgZGlzcGxheWVkIGFzIHRoZSBkZWZhdWx0IHRpdGxlLlxyXG4gICAqL1xyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSB0ZXh0IGRpc3BsYXllZCBmb3IgcXVpY2sgYWN0aW9uIGNvbmZpZ3VyZS5cclxuICAgKi9cclxuICBjb25maWd1cmVUZXh0OiByZXNvdXJjZS5jb25maWd1cmVUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSBlcnJvciBtZXNzYWdlIHRvIGRpc3BsYXkgaWYgcmVuZGVyaW5nIGEgcm93IHRlbXBsYXRlIGlzIG5vdCBzdWNjZXNzZnVsLlxyXG4gICAqL1xyXG4gIGVycm9yUmVuZGVyVGV4dDogcmVzb3VyY2UuZXJyb3JSZW5kZXJUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICpcclxuICAgKi9cclxuICByb3dUZW1wbGF0ZUVycm9yOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgZGF0YS1hY3Rpb249XCJhY3RpdmF0ZUVudHJ5XCIgZGF0YS1rZXk9XCJ7JT0gJFskJC5pZFByb3BlcnR5XSAlfVwiIGRhdGEtZGVzY3JpcHRvcj1cInslOiAkWyQkLmxhYmVsUHJvcGVydHldICV9XCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwibGlzdC1pdGVtLWNvbnRlbnRcIj57JTogJCQuZXJyb3JSZW5kZXJUZXh0ICV9PC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSBmb3JtYXQgc3RyaW5nIGZvciB0aGUgdGV4dCBkaXNwbGF5ZWQgZm9yIHRoZSByZW1haW5pbmcgcmVjb3JkIGNvdW50LiAgVGhpcyBpcyB1c2VkIGluIGEge0BsaW5rIFN0cmluZyNmb3JtYXR9IGNhbGwuXHJcbiAgICovXHJcbiAgcmVtYWluaW5nVGV4dDogcmVzb3VyY2UucmVtYWluaW5nVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgdGV4dCBkaXNwbGF5ZWQgb24gdGhlIGNhbmNlbCBidXR0b24uXHJcbiAgICogQGRlcHJlY2F0ZWRcclxuICAgKi9cclxuICBjYW5jZWxUZXh0OiByZXNvdXJjZS5jYW5jZWxUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSB0ZXh0IGRpc3BsYXllZCBvbiB0aGUgaW5zZXJ0IGJ1dHRvbi5cclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqL1xyXG4gIGluc2VydFRleHQ6IHJlc291cmNlLmluc2VydFRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgZGlzcGxheWVkIHdoZW4gbm8gcmVjb3JkcyBhcmUgYXZhaWxhYmxlLlxyXG4gICAqL1xyXG4gIG5vRGF0YVRleHQ6IHJlc291cmNlLm5vRGF0YVRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgZGlzcGxheWVkIHdoZW4gZGF0YSBpcyBiZWluZyByZXF1ZXN0ZWQuXHJcbiAgICovXHJcbiAgbG9hZGluZ1RleHQ6IHJlc291cmNlLmxvYWRpbmdUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIFRoZSB0ZXh0IGRpc3BsYXllZCBpbiB0b29sdGlwIGZvciB0aGUgbmV3IGJ1dHRvbi5cclxuICAgKi9cclxuICBuZXdUb29sdGlwVGV4dDogcmVzb3VyY2UubmV3VG9vbHRpcFRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIHRleHQgZGlzcGxheWVkIGluIHRvb2x0aXAgZm9yIHRoZSByZWZyZXNoIGJ1dHRvbi5cclxuICAgKi9cclxuICByZWZyZXNoVG9vbHRpcFRleHQ6IHJlc291cmNlLnJlZnJlc2hUb29sdGlwVGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgY3VzdG9taXphdGlvbiBpZGVudGlmaWVyIGZvciB0aGlzIGNsYXNzLiBXaGVuIGEgY3VzdG9taXphdGlvbiBpcyByZWdpc3RlcmVkIGl0IGlzIHBhc3NlZFxyXG4gICAqIGEgcGF0aC9pZGVudGlmaWVyIHdoaWNoIGlzIHRoZW4gbWF0Y2hlZCB0byB0aGlzIHByb3BlcnR5LlxyXG4gICAqL1xyXG4gIGN1c3RvbWl6YXRpb25TZXQ6ICdsaXN0JyxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgcmVsYXRpdmUgcGF0aCB0byB0aGUgY2hlY2ttYXJrIG9yIHNlbGVjdCBpY29uIGZvciByb3cgc2VsZWN0b3JcclxuICAgKi9cclxuICBzZWxlY3RJY29uOiAnY2hlY2snLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfVxyXG4gICAqIENTUyBjbGFzcyB0byB1c2UgZm9yIGNoZWNrbWFyayBvciBzZWxlY3QgaWNvbiBmb3Igcm93IHNlbGVjdG9yLiBPdmVycmlkZXMgc2VsZWN0SWNvbi5cclxuICAgKi9cclxuICBzZWxlY3RJY29uQ2xhc3M6ICcnLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFRoZSBzZWFyY2ggd2lkZ2V0IGluc3RhbmNlIGZvciB0aGUgdmlld1xyXG4gICAqL1xyXG4gIHNlYXJjaFdpZGdldDogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NlYXJjaFdpZGdldH1cclxuICAgKiBUaGUgY2xhc3MgY29uc3RydWN0b3IgdG8gdXNlIGZvciB0aGUgc2VhcmNoIHdpZGdldFxyXG4gICAqL1xyXG4gIHNlYXJjaFdpZGdldENsYXNzOiBTZWFyY2hXaWRnZXQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWcgdG8gaW5kaWNhdGUgdGhlIGRlZmF1bHQgc2VhcmNoIHRlcm0gaGFzIGJlZW4gc2V0LlxyXG4gICAqL1xyXG4gIGRlZmF1bHRTZWFyY2hUZXJtU2V0OiBmYWxzZSxcclxuXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTdHJpbmd9XHJcbiAgICogVGhlIGRlZmF1bHQgc2VhcmNoIHRlcm0gdG8gdXNlXHJcbiAgICovXHJcbiAgZGVmYXVsdFNlYXJjaFRlcm06ICcnLFxyXG5cclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1N0cmluZ31cclxuICAgKiBUaGUgY3VycmVudCBzZWFyY2ggdGVybSBiZWluZyB1c2VkIGZvciB0aGUgY3VycmVudCByZXF1ZXN0RGF0YSgpLlxyXG4gICAqL1xyXG4gIGN1cnJlbnRTZWFyY2hFeHByZXNzaW9uOiAnJyxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgc2VsZWN0aW9uIG1vZGVsIGZvciB0aGUgdmlld1xyXG4gICAqL1xyXG4gIF9zZWxlY3Rpb25Nb2RlbDogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBUaGUgc2VsZWN0aW9uIGV2ZW50IGNvbm5lY3Rpb25zXHJcbiAgICovXHJcbiAgX3NlbGVjdGlvbkNvbm5lY3RzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFRoZSB0b29sYmFyIGxheW91dCBkZWZpbml0aW9uIGZvciBhbGwgdG9vbGJhciBlbnRyaWVzLlxyXG4gICAqL1xyXG4gIHRvb2xzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIFRoZSBsaXN0IGFjdGlvbiBsYXlvdXQgZGVmaW5pdGlvbiBmb3IgdGhlIGxpc3QgYWN0aW9uIGJhci5cclxuICAgKi9cclxuICBhY3Rpb25zOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gSWYgdHJ1ZSwgd2lsbCByZW1vdmUgdGhlIGxvYWRpbmcgYnV0dG9uIGFuZCBhdXRvIGZldGNoIG1vcmUgZGF0YSB3aGVuIHRoZSB1c2VyIHNjcm9sbHMgdG8gdGhlIGJvdHRvbSBvZiB0aGUgcGFnZS5cclxuICAgKi9cclxuICBjb250aW51b3VzU2Nyb2xsaW5nOiB0cnVlLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gSW5kaWNhdGVzIGlmIHRoZSBsaXN0IGlzIGxvYWRpbmdcclxuICAgKi9cclxuICBsaXN0TG9hZGluZzogZmFsc2UsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtCb29sZWFufVxyXG4gICAqIEZsYWdzIGlmIHRoZSB2aWV3IGlzIG11bHRpIGNvbHVtbiBvciBzaW5nbGUgY29sdW1uLlxyXG4gICAqL1xyXG4gIG11bHRpQ29sdW1uVmlldzogdHJ1ZSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge3N0cmluZ31cclxuICAgKiBTb0hvIGNsYXNzIHRvIGJlIGFwcGxpZWQgb24gbXVsdGkgY29sdW1uLlxyXG4gICAqL1xyXG4gIG11bHRpQ29sdW1uQ2xhc3M6ICdmb3VyJyxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge251bWJlcn1cclxuICAgKiBOdW1iZXIgb2YgY29sdW1ucyBpbiB2aWV3XHJcbiAgICovXHJcbiAgbXVsdGlDb2x1bW5Db3VudDogMyxcclxuICAvLyBTdG9yZSBwcm9wZXJ0aWVzXHJcbiAgaXRlbXNQcm9wZXJ0eTogJycsXHJcbiAgaWRQcm9wZXJ0eTogJycsXHJcbiAgbGFiZWxQcm9wZXJ0eTogJycsXHJcbiAgZW50aXR5UHJvcGVydHk6ICcnLFxyXG4gIHZlcnNpb25Qcm9wZXJ0eTogJycsXHJcbiAgaXNSZWZyZXNoaW5nOiBmYWxzZSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSB0aXRsZSB0byBjYXJkXHJcbiAgICovXHJcbiAgZ2V0VGl0bGU6IGZ1bmN0aW9uIGdldFRpdGxlKGVudHJ5LCBsYWJlbFByb3BlcnR5KSB7XHJcbiAgICByZXR1cm4gdGhpcy51dGlsaXR5LmdldFZhbHVlKGVudHJ5LCBsYWJlbFByb3BlcnR5KTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHRlciBtZXRob2QgZm9yIHRoZSBzZWxlY3Rpb24gbW9kZWwsIGFsc28gYmluZHMgdGhlIHZhcmlvdXMgc2VsZWN0aW9uIG1vZGVsIHNlbGVjdCBldmVudHNcclxuICAgKiB0byB0aGUgcmVzcGVjdGl2ZSBMaXN0IGV2ZW50IGhhbmRsZXIgZm9yIGVhY2guXHJcbiAgICogQHBhcmFtIHtTZWxlY3Rpb25Nb2RlbH0gc2VsZWN0aW9uTW9kZWwgVGhlIHNlbGVjdGlvbiBtb2RlbCBpbnN0YW5jZSB0byBzYXZlIHRvIHRoZSB2aWV3XHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBfc2V0U2VsZWN0aW9uTW9kZWxBdHRyOiBmdW5jdGlvbiBfc2V0U2VsZWN0aW9uTW9kZWxBdHRyKHNlbGVjdGlvbk1vZGVsKSB7XHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uQ29ubmVjdHMpIHtcclxuICAgICAgdGhpcy5fc2VsZWN0aW9uQ29ubmVjdHMuZm9yRWFjaCh0aGlzLmRpc2Nvbm5lY3QsIHRoaXMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsID0gc2VsZWN0aW9uTW9kZWw7XHJcbiAgICB0aGlzLl9zZWxlY3Rpb25Db25uZWN0cyA9IFtdO1xyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCkge1xyXG4gICAgICB0aGlzLl9zZWxlY3Rpb25Db25uZWN0cy5wdXNoKFxyXG4gICAgICAgIHRoaXMuY29ubmVjdCh0aGlzLl9zZWxlY3Rpb25Nb2RlbCwgJ29uU2VsZWN0JywgdGhpcy5fb25TZWxlY3Rpb25Nb2RlbFNlbGVjdCksXHJcbiAgICAgICAgdGhpcy5jb25uZWN0KHRoaXMuX3NlbGVjdGlvbk1vZGVsLCAnb25EZXNlbGVjdCcsIHRoaXMuX29uU2VsZWN0aW9uTW9kZWxEZXNlbGVjdCksXHJcbiAgICAgICAgdGhpcy5jb25uZWN0KHRoaXMuX3NlbGVjdGlvbk1vZGVsLCAnb25DbGVhcicsIHRoaXMuX29uU2VsZWN0aW9uTW9kZWxDbGVhcilcclxuICAgICAgKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEdldHRlciBubWV0aG9kIGZvciB0aGUgc2VsZWN0aW9uIG1vZGVsXHJcbiAgICogQHJldHVybiB7U2VsZWN0aW9uTW9kZWx9XHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBfZ2V0U2VsZWN0aW9uTW9kZWxBdHRyOiBmdW5jdGlvbiBfZ2V0U2VsZWN0aW9uTW9kZWxBdHRyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX3NlbGVjdGlvbk1vZGVsO1xyXG4gIH0sXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIHRoaXMuZW50cmllcyA9IHt9O1xyXG4gICAgdGhpcy5fbG9hZGVkU2VsZWN0aW9ucyA9IHt9O1xyXG5cclxuICAgIC8vIGJhY2t3YXJkIGNvbXBhdGliaWxpdHkgZm9yIGRpc2FibGVSaWdodERyYXdlciBwcm9wZXJ0eS4gVG8gYmUgcmVtb3ZlZCBhZnRlciA0LjBcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuZGlzYWJsZVJpZ2h0RHJhd2VyKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignZGlzYWJsZVJpZ2h0RHJhd2VyIHByb3BlcnR5IGlzIGRlcHJhY2F0ZWQuIFVzZSBoYXNTZXR0aW5ncyBwcm9wZXJ0eSBpbnN0ZWFkLiBkaXNhYmxlUmlnaHREcmF3ZXIgPSAhaGFzU2V0dGluZ3MnKTsgIC8vZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICB0aGlzLmhhc1NldHRpbmdzID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSxcclxuICBpbml0U29obzogZnVuY3Rpb24gaW5pdFNvaG8oKSB7XHJcbiAgICBjb25zdCB0b29sYmFyID0gJCgnLnRvb2xiYXInLCB0aGlzLmRvbU5vZGUpLmZpcnN0KCk7XHJcbiAgICB0b29sYmFyLnRvb2xiYXIoKTtcclxuICAgIHRoaXMudG9vbGJhciA9IHRvb2xiYXIuZGF0YSgndG9vbGJhcicpO1xyXG4gICAgJCgnW2RhdGEtYWN0aW9uPW9wZW5TZXR0aW5nc10nLCB0aGlzLmRvbU5vZGUpLm9uKCdjbGljaycsICgpID0+IHtcclxuICAgICAgdGhpcy5vcGVuU2V0dGluZ3MoKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgb3BlblNldHRpbmdzOiBmdW5jdGlvbiBvcGVuU2V0dGluZ3MoKSB7XHJcbiAgfSxcclxuICB1cGRhdGVTb2hvOiBmdW5jdGlvbiB1cGRhdGVTb2hvKCkge1xyXG4gICAgdGhpcy50b29sYmFyLnVwZGF0ZWQoKTtcclxuICB9LFxyXG4gIF9vbkxpc3RWaWV3U2VsZWN0ZWQ6IGZ1bmN0aW9uIF9vbkxpc3RWaWV3U2VsZWN0ZWQoKSB7XHJcbiAgICBjb25zb2xlLmRpcihhcmd1bWVudHMpOyAvL2VzbGludC1kaXNhYmxlLWxpbmVcclxuICB9LFxyXG4gIHBvc3RDcmVhdGU6IGZ1bmN0aW9uIHBvc3RDcmVhdGUoKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChwb3N0Q3JlYXRlLCBhcmd1bWVudHMpO1xyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCA9PT0gbnVsbCkge1xyXG4gICAgICB0aGlzLnNldCgnc2VsZWN0aW9uTW9kZWwnLCBuZXcgQ29uZmlndXJhYmxlU2VsZWN0aW9uTW9kZWwoKSk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnN1YnNjcmliZSgnL2FwcC9yZWZyZXNoJywgdGhpcy5fb25SZWZyZXNoKTtcclxuXHJcbiAgICBpZiAodGhpcy5lbmFibGVTZWFyY2gpIHtcclxuICAgICAgY29uc3QgU2VhcmNoV2lkZ2V0Q3RvciA9IGxhbmcuaXNTdHJpbmcodGhpcy5zZWFyY2hXaWRnZXRDbGFzcykgPyBsYW5nLmdldE9iamVjdCh0aGlzLnNlYXJjaFdpZGdldENsYXNzLCBmYWxzZSkgOiB0aGlzLnNlYXJjaFdpZGdldENsYXNzO1xyXG5cclxuICAgICAgdGhpcy5zZWFyY2hXaWRnZXQgPSB0aGlzLnNlYXJjaFdpZGdldCB8fCBuZXcgU2VhcmNoV2lkZ2V0Q3Rvcih7XHJcbiAgICAgICAgY2xhc3M6ICdsaXN0LXNlYXJjaCcsXHJcbiAgICAgICAgb3duZXI6IHRoaXMsXHJcbiAgICAgICAgb25TZWFyY2hFeHByZXNzaW9uOiB0aGlzLl9vblNlYXJjaEV4cHJlc3Npb24uYmluZCh0aGlzKSxcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuc2VhcmNoV2lkZ2V0LnBsYWNlQXQodGhpcy5zZWFyY2hOb2RlLCAncmVwbGFjZScpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5zZWFyY2hXaWRnZXQgPSBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmhpZGVTZWFyY2ggfHwgIXRoaXMuZW5hYmxlU2VhcmNoKSB7XHJcbiAgICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcygnbGlzdC1oaWRlLXNlYXJjaCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuY2xlYXIoKTtcclxuXHJcbiAgICB0aGlzLmluaXRQdWxsVG9SZWZyZXNoKHRoaXMuc2Nyb2xsZXJOb2RlKTtcclxuICB9LFxyXG4gIHNob3VsZFN0YXJ0UHVsbFRvUmVmcmVzaDogZnVuY3Rpb24gc2hvdWxkU3RhcnRQdWxsVG9SZWZyZXNoKCkge1xyXG4gICAgLy8gR2V0IHRoZSBiYXNlIHJlc3VsdHNcclxuICAgIGNvbnN0IHNob3VsZFN0YXJ0ID0gdGhpcy5pbmhlcml0ZWQoc2hvdWxkU3RhcnRQdWxsVG9SZWZyZXNoLCBhcmd1bWVudHMpO1xyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSAkKHRoaXMuZG9tTm9kZSkuYXR0cignc2VsZWN0ZWQnKTtcclxuICAgIGNvbnN0IGFjdGlvbk5vZGUgPSAkKHRoaXMuZG9tTm9kZSkuZmluZCgnLmJ0bi1hY3Rpb25zLmlzLW9wZW4nKTtcclxuICAgIGNvbnN0IGFjdGlvbnNPcGVuID0gYWN0aW9uTm9kZS5sZW5ndGggPiAwO1xyXG4gICAgcmV0dXJuIHNob3VsZFN0YXJ0ICYmIHNlbGVjdGVkID09PSAnc2VsZWN0ZWQnICYmICF0aGlzLmxpc3RMb2FkaW5nICYmICFhY3Rpb25zT3BlbjtcclxuICB9LFxyXG4gIGZvcmNlUmVmcmVzaDogZnVuY3Rpb24gZm9yY2VSZWZyZXNoKCkge1xyXG4gICAgdGhpcy5jbGVhcigpO1xyXG4gICAgdGhpcy5yZWZyZXNoUmVxdWlyZWQgPSB0cnVlO1xyXG4gICAgdGhpcy5yZWZyZXNoKCk7XHJcbiAgfSxcclxuICBvblB1bGxUb1JlZnJlc2hDb21wbGV0ZTogZnVuY3Rpb24gb25QdWxsVG9SZWZyZXNoQ29tcGxldGUoKSB7XHJcbiAgICB0aGlzLmZvcmNlUmVmcmVzaCgpO1xyXG4gIH0sXHJcbiAgb25Db25uZWN0aW9uU3RhdGVDaGFuZ2U6IGZ1bmN0aW9uIG9uQ29ubmVjdGlvblN0YXRlQ2hhbmdlKHN0YXRlKSB7XHJcbiAgICBpZiAoc3RhdGUgPT09IHRydWUgJiYgdGhpcy5lbmFibGVPZmZsaW5lU3VwcG9ydCkge1xyXG4gICAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgb24gYXBwbGljYXRpb24gc3RhcnR1cCB0byBjb25maWd1cmUgdGhlIHNlYXJjaCB3aWRnZXQgaWYgcHJlc2VudCBhbmQgY3JlYXRlIHRoZSBsaXN0IGFjdGlvbnMuXHJcbiAgICovXHJcbiAgc3RhcnR1cDogZnVuY3Rpb24gc3RhcnR1cCgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHN0YXJ0dXAsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgaWYgKHRoaXMuc2VhcmNoV2lkZ2V0KSB7XHJcbiAgICAgIHRoaXMuc2VhcmNoV2lkZ2V0LmNvbmZpZ3VyZSh7XHJcbiAgICAgICAgaGFzaFRhZ1F1ZXJpZXM6IHRoaXMuX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQodGhpcy5jcmVhdGVIYXNoVGFnUXVlcnlMYXlvdXQoKSwgJ2hhc2hUYWdRdWVyaWVzJyksXHJcbiAgICAgICAgZm9ybWF0U2VhcmNoUXVlcnk6IHRoaXMuZm9ybWF0U2VhcmNoUXVlcnkuYmluZCh0aGlzKSxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIGRpaml0IFdpZGdldCB0byBkZXN0cm95IHRoZSBzZWFyY2ggd2lkZ2V0IGJlZm9yZSBkZXN0cm95aW5nIHRoZSB2aWV3LlxyXG4gICAqL1xyXG4gIGRlc3Ryb3k6IGZ1bmN0aW9uIGRlc3Ryb3koKSB7XHJcbiAgICBpZiAodGhpcy5zZWFyY2hXaWRnZXQpIHtcclxuICAgICAgaWYgKCF0aGlzLnNlYXJjaFdpZGdldC5fZGVzdHJveWVkKSB7XHJcbiAgICAgICAgdGhpcy5zZWFyY2hXaWRnZXQuZGVzdHJveVJlY3Vyc2l2ZSgpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBkZWxldGUgdGhpcy5zZWFyY2hXaWRnZXQ7XHJcbiAgICB9XHJcblxyXG4gICAgZGVsZXRlIHRoaXMuc3RvcmU7XHJcbiAgICB0aGlzLmluaGVyaXRlZChkZXN0cm95LCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgX2dldFN0b3JlQXR0cjogZnVuY3Rpb24gX2dldFN0b3JlQXR0cigpIHtcclxuICAgIHJldHVybiB0aGlzLnN0b3JlIHx8ICh0aGlzLnN0b3JlID0gdGhpcy5jcmVhdGVTdG9yZSgpKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNob3dzIG92ZXJyaWRlcyB0aGUgdmlldyBjbGFzcyB0byBzZXQgb3B0aW9ucyBmb3IgdGhlIGxpc3QgdmlldyBhbmQgdGhlbiBjYWxscyB0aGUgaW5oZXJpdGVkIHNob3cgbWV0aG9kIG9uIHRoZSB2aWV3LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBuYXZpZ2F0aW9uIG9wdGlvbnMgcGFzc2VkIGZyb20gdGhlIHByZXZpb3VzIHZpZXcuXHJcbiAgICogQHBhcmFtIHRyYW5zaXRpb25PcHRpb25zIHtPYmplY3R9IE9wdGlvbmFsIHRyYW5zaXRpb24gb2JqZWN0IHRoYXQgaXMgZm9yd2FyZGVkIHRvIFJlVUkuXHJcbiAgICovXHJcbiAgc2hvdzogZnVuY3Rpb24gc2hvdyhvcHRpb25zIC8qICwgdHJhbnNpdGlvbk9wdGlvbnMqLykge1xyXG4gICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgaWYgKG9wdGlvbnMucmVzZXRTZWFyY2gpIHtcclxuICAgICAgICB0aGlzLmRlZmF1bHRTZWFyY2hUZXJtU2V0ID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmFsbG93RW1wdHlTZWxlY3Rpb24gPT09IGZhbHNlICYmIHRoaXMuX3NlbGVjdGlvbk1vZGVsKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwucmVxdWlyZVNlbGVjdGlvbiA9IHRydWU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmluaGVyaXRlZChzaG93LCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyBhbmQgcmV0dXJucyB0aGUgdG9vbGJhciBpdGVtIGxheW91dCBkZWZpbml0aW9uLCB0aGlzIG1ldGhvZCBzaG91bGQgYmUgb3ZlcnJpZGVuIGluIHRoZSB2aWV3XHJcbiAgICogc28gdGhhdCB5b3UgbWF5IGRlZmluZSB0aGUgdmlld3MgdG9vbGJhciBlbnRyaWVzLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gdGhpcy50b29sc1xyXG4gICAqIEB0ZW1wbGF0ZVxyXG4gICAqL1xyXG4gIGNyZWF0ZVRvb2xMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZVRvb2xMYXlvdXQoKSB7XHJcbiAgICBjb25zdCB0b29sYmFyID0gdGhpcy50b29scyB8fCAodGhpcy50b29scyA9IHtcclxuICAgICAgdGJhcjogW3tcclxuICAgICAgICBpZDogJ25ldycsXHJcbiAgICAgICAgc3ZnOiAnYWRkJyxcclxuICAgICAgICB0aXRsZTogdGhpcy5uZXdUb29sdGlwVGV4dCxcclxuICAgICAgICBhY3Rpb246ICduYXZpZ2F0ZVRvSW5zZXJ0VmlldycsXHJcbiAgICAgICAgc2VjdXJpdHk6IHRoaXMuYXBwLmdldFZpZXdTZWN1cml0eSh0aGlzLmluc2VydFZpZXcsICdpbnNlcnQnKSxcclxuICAgICAgfV0sXHJcbiAgICB9KTtcclxuICAgIGlmICgodG9vbGJhci50YmFyICYmICF0aGlzLl9yZWZyZXNoQWRkZWQpICYmICF3aW5kb3cuQXBwLnN1cHBvcnRzVG91Y2goKSkge1xyXG4gICAgICB0aGlzLnRvb2xzLnRiYXIucHVzaCh7XHJcbiAgICAgICAgaWQ6ICdyZWZyZXNoJyxcclxuICAgICAgICBzdmc6ICdyZWZyZXNoJyxcclxuICAgICAgICB0aXRsZTogdGhpcy5yZWZyZXNoVG9vbHRpcFRleHQsXHJcbiAgICAgICAgYWN0aW9uOiAnX3JlZnJlc2hMaXN0JyxcclxuICAgICAgfSk7XHJcbiAgICAgIHRoaXMuX3JlZnJlc2hBZGRlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy50b29scztcclxuICB9LFxyXG4gIGNyZWF0ZUVycm9ySGFuZGxlcnM6IGZ1bmN0aW9uIGNyZWF0ZUVycm9ySGFuZGxlcnMoKSB7XHJcbiAgICB0aGlzLmVycm9ySGFuZGxlcnMgPSB0aGlzLmVycm9ySGFuZGxlcnMgfHwgW3tcclxuICAgICAgbmFtZTogJ0Fib3J0ZWQnLFxyXG4gICAgICB0ZXN0OiBmdW5jdGlvbiB0ZXN0QWJvcnRlZChlcnJvcikge1xyXG4gICAgICAgIHJldHVybiBlcnJvci5hYm9ydGVkO1xyXG4gICAgICB9LFxyXG4gICAgICBoYW5kbGU6IGZ1bmN0aW9uIGhhbmRsZUFib3J0ZWQoZXJyb3IsIG5leHQpIHtcclxuICAgICAgICB0aGlzLmNsZWFyKCk7XHJcbiAgICAgICAgdGhpcy5yZWZyZXNoUmVxdWlyZWQgPSB0cnVlO1xyXG4gICAgICAgIG5leHQoKTtcclxuICAgICAgfSxcclxuICAgIH0sIHtcclxuICAgICAgbmFtZTogJ0FsZXJ0RXJyb3InLFxyXG4gICAgICB0ZXN0OiBmdW5jdGlvbiB0ZXN0RXJyb3IoZXJyb3IpIHtcclxuICAgICAgICByZXR1cm4gIWVycm9yLmFib3J0ZWQ7XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gaGFuZGxlRXJyb3IoZXJyb3IsIG5leHQpIHtcclxuICAgICAgICBhbGVydCh0aGlzLmdldEVycm9yTWVzc2FnZShlcnJvcikpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9LFxyXG4gICAgfSwge1xyXG4gICAgICBuYW1lOiAnQ2F0Y2hBbGwnLFxyXG4gICAgICB0ZXN0OiBmdW5jdGlvbiB0ZXN0Q2F0Y2hBbGwoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgIH0sXHJcbiAgICAgIGhhbmRsZTogZnVuY3Rpb24gaGFuZGxlQ2F0Y2hBbGwoZXJyb3IsIG5leHQpIHtcclxuICAgICAgICB0aGlzLl9sb2dFcnJvcihlcnJvcik7XHJcbiAgICAgICAgdGhpcy5fY2xlYXJMb2FkaW5nKCk7XHJcbiAgICAgICAgbmV4dCgpO1xyXG4gICAgICB9LFxyXG4gICAgfV07XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuZXJyb3JIYW5kbGVycztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgYW5kIHJldHVybnMgdGhlIGxpc3QtYWN0aW9uIGFjdGlvbnMgbGF5b3V0IGRlZmluaXRpb24sIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZW4gaW4gdGhlIHZpZXdcclxuICAgKiBzbyB0aGF0IHlvdSBtYXkgZGVmaW5lIHRoZSBhY3Rpb24gZW50cmllcyBmb3IgdGhhdCB2aWV3LlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gdGhpcy5hY3R0aW9uc1xyXG4gICAqL1xyXG4gIGNyZWF0ZUFjdGlvbkxheW91dDogZnVuY3Rpb24gY3JlYXRlQWN0aW9uTGF5b3V0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aW9ucyB8fCBbXTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgdGhlIGFjdGlvbiBiYXIgYW5kIGFkZHMgaXQgdG8gdGhlIERPTS4gTm90ZSB0aGF0IGl0IHJlcGxhY2VzIGB0aGlzLmFjdGlvbnNgIHdpdGggdGhlIHBhc3NlZFxyXG4gICAqIHBhcmFtIGFzIHRoZSBwYXNzZWQgcGFyYW0gc2hvdWxkIGJlIHRoZSByZXN1bHQgb2YgdGhlIGN1c3RvbWl6YXRpb24gbWl4aW4gYW5kIGB0aGlzLmFjdGlvbnNgIG5lZWRzIHRvIGJlIHRoZVxyXG4gICAqIGZpbmFsIGFjdGlvbnMgc3RhdGUuXHJcbiAgICogQHBhcmFtIHtPYmplY3RbXX0gYWN0aW9uc1xyXG4gICAqL1xyXG4gIGNyZWF0ZUFjdGlvbnM6IGZ1bmN0aW9uIGNyZWF0ZUFjdGlvbnMoYSkge1xyXG4gICAgbGV0IGFjdGlvbnMgPSBhO1xyXG4gICAgdGhpcy5hY3Rpb25zID0gYWN0aW9ucy5yZWR1Y2UodGhpcy5fcmVtb3ZlQWN0aW9uRHVwbGljYXRlcywgW10pO1xyXG4gICAgdGhpcy52aXNpYmxlQWN0aW9ucyA9IFtdO1xyXG5cclxuXHJcbiAgICB0aGlzLmVuc3VyZVF1aWNrQWN0aW9uUHJlZnMoKTtcclxuXHJcbiAgICAvLyBQbHVjayBvdXQgb3VyIHN5c3RlbSBhY3Rpb25zIHRoYXQgYXJlIE5PVCBzYXZlZCBpbiBwcmVmZXJlbmNlc1xyXG4gICAgbGV0IHN5c3RlbUFjdGlvbnMgPSBhY3Rpb25zLmZpbHRlcigoYWN0aW9uKSA9PiB7XHJcbiAgICAgIHJldHVybiBhY3Rpb24gJiYgYWN0aW9uLnN5c3RlbUFjdGlvbjtcclxuICAgIH0pO1xyXG5cclxuICAgIHN5c3RlbUFjdGlvbnMgPSBzeXN0ZW1BY3Rpb25zLnJlZHVjZSh0aGlzLl9yZW1vdmVBY3Rpb25EdXBsaWNhdGVzLCBbXSk7XHJcblxyXG4gICAgLy8gR3JhYiBxdWljayBhY3Rpb25zIGZyb20gdGhlIHVzZXJzIHByZWZlcmVuY2VzIChvcmRlcmVkIGFuZCBtYWRlIHZpc2libGUgYWNjb3JkaW5nIHRvIHVzZXIpXHJcbiAgICBsZXQgcHJlZkFjdGlvbnM7XHJcbiAgICBpZiAodGhpcy5hcHAucHJlZmVyZW5jZXMgJiYgdGhpcy5hcHAucHJlZmVyZW5jZXMucXVpY2tBY3Rpb25zKSB7XHJcbiAgICAgIHByZWZBY3Rpb25zID0gdGhpcy5hcHAucHJlZmVyZW5jZXMucXVpY2tBY3Rpb25zW3RoaXMuaWRdO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChzeXN0ZW1BY3Rpb25zICYmIHByZWZBY3Rpb25zKSB7XHJcbiAgICAgIC8vIERpc3BsYXkgc3lzdGVtIGFjdGlvbnMgZmlyc3QsIHRoZW4gdGhlIG9yZGVyIG9mIHdoYXQgdGhlIHVzZXIgc3BlY2lmaWVkXHJcbiAgICAgIGFjdGlvbnMgPSBzeXN0ZW1BY3Rpb25zLmNvbmNhdChwcmVmQWN0aW9ucyk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgdmlzaWJsZUFjdGlvbnMgPSBbXTtcclxuXHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgYWN0aW9uID0gYWN0aW9uc1tpXTtcclxuXHJcbiAgICAgIGlmICghYWN0aW9uLnZpc2libGUpIHtcclxuICAgICAgICBjb250aW51ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCFhY3Rpb24uc2VjdXJpdHkpIHtcclxuICAgICAgICBjb25zdCBvcmlnID0gYS5maW5kKHggPT4geC5pZCA9PT0gYWN0aW9uLmlkKTtcclxuICAgICAgICBpZiAob3JpZyAmJiBvcmlnLnNlY3VyaXR5KSB7XHJcbiAgICAgICAgICBhY3Rpb24uc2VjdXJpdHkgPSBvcmlnLnNlY3VyaXR5OyAvLyBSZXNldCB0aGUgc2VjdXJpdHkgdmFsdWVcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgYWN0aW9uSW5kZXg6IHZpc2libGVBY3Rpb25zLmxlbmd0aCxcclxuICAgICAgICBoYXNBY2Nlc3M6ICghYWN0aW9uLnNlY3VyaXR5IHx8IChhY3Rpb24uc2VjdXJpdHkgJiYgdGhpcy5hcHAuaGFzQWNjZXNzVG8odGhpcy5leHBhbmRFeHByZXNzaW9uKGFjdGlvbi5zZWN1cml0eSkpKSkgPyB0cnVlIDogZmFsc2UsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBsYW5nLm1peGluKGFjdGlvbiwgb3B0aW9ucyk7XHJcblxyXG4gICAgICBjb25zdCBhY3Rpb25UZW1wbGF0ZSA9IGFjdGlvbi50ZW1wbGF0ZSB8fCB0aGlzLmxpc3RBY3Rpb25JdGVtVGVtcGxhdGU7XHJcbiAgICAgIGFjdGlvbi50ZW1wbGF0ZURvbSA9ICQoYWN0aW9uVGVtcGxhdGUuYXBwbHkoYWN0aW9uLCBhY3Rpb24uaWQpKTtcclxuXHJcbiAgICAgIHZpc2libGVBY3Rpb25zLnB1c2goYWN0aW9uKTtcclxuICAgIH1cclxuICAgIHRoaXMudmlzaWJsZUFjdGlvbnMgPSB2aXNpYmxlQWN0aW9ucztcclxuICB9LFxyXG4gIGNyZWF0ZVN5c3RlbUFjdGlvbkxheW91dDogZnVuY3Rpb24gY3JlYXRlU3lzdGVtQWN0aW9uTGF5b3V0KGFjdGlvbnMgPSBbXSkge1xyXG4gICAgY29uc3Qgc3lzdGVtQWN0aW9ucyA9IGFjdGlvbnMuZmlsdGVyKChhY3Rpb24pID0+IHtcclxuICAgICAgcmV0dXJuIGFjdGlvbi5zeXN0ZW1BY3Rpb24gPT09IHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBvdGhlcnMgPSBhY3Rpb25zLmZpbHRlcigoYWN0aW9uKSA9PiB7XHJcbiAgICAgIHJldHVybiAhYWN0aW9uLnN5c3RlbUFjdGlvbjtcclxuICAgIH0pO1xyXG5cclxuICAgIGlmICghb3RoZXJzLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm4gW107XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN5c3RlbUFjdGlvbnMubGVuZ3RoKSB7XHJcbiAgICAgIHJldHVybiBzeXN0ZW1BY3Rpb25zLmNvbmNhdChvdGhlcnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBbe1xyXG4gICAgICBpZDogJ19fZWRpdFByZWZzX18nLFxyXG4gICAgICBjbHM6ICdzZXR0aW5ncycsXHJcbiAgICAgIGxhYmVsOiB0aGlzLmNvbmZpZ3VyZVRleHQsXHJcbiAgICAgIGFjdGlvbjogJ2NvbmZpZ3VyZVF1aWNrQWN0aW9ucycsXHJcbiAgICAgIHN5c3RlbUFjdGlvbjogdHJ1ZSxcclxuICAgICAgdmlzaWJsZTogdHJ1ZSxcclxuICAgIH1dLmNvbmNhdChvdGhlcnMpO1xyXG4gIH0sXHJcbiAgY29uZmlndXJlUXVpY2tBY3Rpb25zOiBmdW5jdGlvbiBjb25maWd1cmVRdWlja0FjdGlvbnMoKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gQXBwLmdldFZpZXcodGhpcy5xdWlja0FjdGlvbkNvbmZpZ3VyZVZpZXcpO1xyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgdmlldy5zaG93KHtcclxuICAgICAgICB2aWV3SWQ6IHRoaXMuaWQsXHJcbiAgICAgICAgYWN0aW9uczogdGhpcy5hY3Rpb25zLmZpbHRlcigoYWN0aW9uKSA9PiB7XHJcbiAgICAgICAgICAvLyBFeGNsdWRlIHN5c3RlbSBhY3Rpb25zXHJcbiAgICAgICAgICByZXR1cm4gYWN0aW9uICYmIGFjdGlvbi5zeXN0ZW1BY3Rpb24gIT09IHRydWU7XHJcbiAgICAgICAgfSksXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2VsZWN0RW50cnlTaWxlbnQ6IGZ1bmN0aW9uIHNlbGVjdEVudHJ5U2lsZW50KGtleSkge1xyXG4gICAgY29uc3QgZW5hYmxlQWN0aW9ucyA9IHRoaXMuZW5hYmxlQWN0aW9uczsgLy8gcHJlc2VydmUgdGhlIG9yaWdpbmFsIHZhbHVlXHJcbiAgICBjb25zdCBzZWxlY3Rpb25Nb2RlbCA9IHRoaXMuZ2V0KCdzZWxlY3Rpb25Nb2RlbCcpO1xyXG4gICAgbGV0IHNlbGVjdGlvbjtcclxuXHJcbiAgICBpZiAoa2V5KSB7XHJcbiAgICAgIHRoaXMuZW5hYmxlQWN0aW9ucyA9IGZhbHNlOyAvLyBTZXQgdG8gZmFsc2Ugc28gdGhlIHF1aWNrIGFjdGlvbnMgbWVudSBkb2Vzbid0IHBvcCB1cFxyXG4gICAgICBzZWxlY3Rpb25Nb2RlbC5jbGVhcigpO1xyXG4gICAgICBzZWxlY3Rpb25Nb2RlbC50b2dnbGUoa2V5LCB0aGlzLmVudHJpZXNba2V5XSk7XHJcbiAgICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSBzZWxlY3Rpb25Nb2RlbC5nZXRTZWxlY3Rpb25zKCk7XHJcbiAgICAgIHRoaXMuZW5hYmxlQWN0aW9ucyA9IGVuYWJsZUFjdGlvbnM7XHJcblxyXG4gICAgICAvLyBXZSBrbm93IHdlIGFyZSBzaW5nbGUgc2VsZWN0LCBzbyBqdXN0IGdyYWIgdGhlIGZpcnN0IHNlbGVjdGlvblxyXG4gICAgICBmb3IgKGNvbnN0IHByb3AgaW4gc2VsZWN0ZWRJdGVtcykge1xyXG4gICAgICAgIGlmIChzZWxlY3RlZEl0ZW1zLmhhc093blByb3BlcnR5KHByb3ApKSB7XHJcbiAgICAgICAgICBzZWxlY3Rpb24gPSBzZWxlY3RlZEl0ZW1zW3Byb3BdO1xyXG4gICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHNlbGVjdGlvbjtcclxuICB9LFxyXG4gIGludm9rZUFjdGlvbkl0ZW1CeTogZnVuY3Rpb24gaW52b2tlQWN0aW9uSXRlbUJ5KGFjdGlvblByZWRpY2F0ZSwga2V5KSB7XHJcbiAgICBjb25zdCBhY3Rpb25zID0gdGhpcy52aXNpYmxlQWN0aW9ucy5maWx0ZXIoYWN0aW9uUHJlZGljYXRlKTtcclxuICAgIGNvbnN0IHNlbGVjdGlvbiA9IHRoaXMuc2VsZWN0RW50cnlTaWxlbnQoa2V5KTtcclxuICAgIHRoaXMuY2hlY2tBY3Rpb25TdGF0ZSgpO1xyXG4gICAgYWN0aW9ucy5mb3JFYWNoKChhY3Rpb24pID0+IHtcclxuICAgICAgdGhpcy5faW52b2tlQWN0aW9uKGFjdGlvbiwgc2VsZWN0aW9uKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVGhpcyBpcyB0aGUgZGF0YS1hY3Rpb24gaGFuZGxlciBmb3IgbGlzdC1hY3Rpb25zLCBpdCB3aWxsIGxvY2F0ZSB0aGUgYWN0aW9uIGluc3RhbmNlIHZpdyB0aGUgZGF0YS1pZCBhdHRyaWJ1dGVcclxuICAgKiBhbmQgaW52b2tlIGVpdGhlciB0aGUgYGZuYCB3aXRoIGBzY29wZWAgb3IgdGhlIG5hbWVkIGBhY3Rpb25gIG9uIHRoZSBjdXJyZW50IHZpZXcuXHJcbiAgICpcclxuICAgKiBUaGUgcmVzdWx0aW5nIGZ1bmN0aW9uIGJlaW5nIGNhbGxlZCB3aWxsIGJlIHBhc3NlZCBub3Qgb25seSB0aGUgYWN0aW9uIGl0ZW0gZGVmaW5pdGlvbiBidXQgYWxzb1xyXG4gICAqIHRoZSBmaXJzdCAob25seSkgc2VsZWN0aW9uIGZyb20gdGhlIGxpc3RzIHNlbGVjdGlvbiBtb2RlbC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwYXJhbWV0ZXJzIENvbGxlY3Rpb24gb2YgZGF0YS0gYXR0cmlidXRlcyBhbHJlYWR5IGdhdGhlcmVkIGZyb20gdGhlIG5vZGVcclxuICAgKiBAcGFyYW0ge0V2ZW50fSBldnQgVGhlIGNsaWNrL3RhcCBldmVudFxyXG4gICAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IG5vZGUgVGhlIG5vZGUgdGhhdCBpbnZva2VkIHRoZSBhY3Rpb25cclxuICAgKi9cclxuICBpbnZva2VBY3Rpb25JdGVtOiBmdW5jdGlvbiBpbnZva2VBY3Rpb25JdGVtKHBhcmFtZXRlcnMsIGV2dCwgbm9kZSkge1xyXG4gICAgY29uc3QgcG9wdXBtZW51ID0gJChub2RlKVxyXG4gICAgICAucGFyZW50KCdsaScpXHJcbiAgICAgIC5wYXJlbnQoJy5hY3Rpb25zLXJvdycpXHJcbiAgICAgIC5wYXJlbnQoJy5wb3B1cG1lbnUtd3JhcHBlcicpXHJcbiAgICAgIC5wcmV2KClcclxuICAgICAgLmRhdGEoJ3BvcHVwbWVudScpO1xyXG4gICAgaWYgKHBvcHVwbWVudSkge1xyXG4gICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICBwb3B1cG1lbnUuY2xvc2UoKTtcclxuICAgICAgfSwgMTAwKTtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBpbmRleCA9IHBhcmFtZXRlcnMuaWQ7XHJcbiAgICBjb25zdCBhY3Rpb24gPSB0aGlzLnZpc2libGVBY3Rpb25zW2luZGV4XTtcclxuICAgIGNvbnN0IHNlbGVjdGVkSXRlbXMgPSB0aGlzLmdldCgnc2VsZWN0aW9uTW9kZWwnKVxyXG4gICAgICAuZ2V0U2VsZWN0aW9ucygpO1xyXG4gICAgbGV0IHNlbGVjdGlvbiA9IG51bGw7XHJcblxyXG4gICAgZm9yIChjb25zdCBrZXkgaW4gc2VsZWN0ZWRJdGVtcykge1xyXG4gICAgICBpZiAoc2VsZWN0ZWRJdGVtcy5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XHJcbiAgICAgICAgc2VsZWN0aW9uID0gc2VsZWN0ZWRJdGVtc1trZXldO1xyXG4gICAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmRlc2VsZWN0KGtleSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHRoaXMuX2ludm9rZUFjdGlvbihhY3Rpb24sIHNlbGVjdGlvbik7XHJcbiAgfSxcclxuICBfaW52b2tlQWN0aW9uOiBmdW5jdGlvbiBfaW52b2tlQWN0aW9uKGFjdGlvbiwgc2VsZWN0aW9uKSB7XHJcbiAgICBpZiAoIWFjdGlvbi5pc0VuYWJsZWQpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChhY3Rpb24uZm4pIHtcclxuICAgICAgYWN0aW9uLmZuLmNhbGwoYWN0aW9uLnNjb3BlIHx8IHRoaXMsIGFjdGlvbiwgc2VsZWN0aW9uKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChhY3Rpb24uYWN0aW9uKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuaGFzQWN0aW9uKGFjdGlvbi5hY3Rpb24pKSB7XHJcbiAgICAgICAgICB0aGlzLmludm9rZUFjdGlvbihhY3Rpb24uYWN0aW9uLCBhY3Rpb24sIHNlbGVjdGlvbik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgd2hlbiBzaG93aW5nIHRoZSBhY3Rpb24gYmFyIGZvciBhIG5ld2x5IHNlbGVjdGVkIHJvdywgaXQgc2V0cyB0aGUgZGlzYWJsZWQgc3RhdGUgZm9yIGVhY2ggYWN0aW9uXHJcbiAgICogaXRlbSB1c2luZyB0aGUgY3VycmVudGx5IHNlbGVjdGVkIHJvdyBhcyBjb250ZXh0IGJ5IHBhc3NpbmcgdGhlIGFjdGlvbiBpbnN0YW5jZSB0aGUgc2VsZWN0ZWQgcm93IHRvIHRoZVxyXG4gICAqIGFjdGlvbiBpdGVtcyBgZW5hYmxlZGAgcHJvcGVydHkuXHJcbiAgICovXHJcbiAgY2hlY2tBY3Rpb25TdGF0ZTogZnVuY3Rpb24gY2hlY2tBY3Rpb25TdGF0ZShyb3dOb2RlKSB7XHJcbiAgICBjb25zdCBzZWxlY3RlZEl0ZW1zID0gdGhpcy5nZXQoJ3NlbGVjdGlvbk1vZGVsJylcclxuICAgICAgLmdldFNlbGVjdGlvbnMoKTtcclxuICAgIGxldCBzZWxlY3Rpb24gPSBudWxsO1xyXG5cclxuICAgIGZvciAoY29uc3Qga2V5IGluIHNlbGVjdGVkSXRlbXMpIHtcclxuICAgICAgaWYgKHNlbGVjdGVkSXRlbXMuaGFzT3duUHJvcGVydHkoa2V5KSkge1xyXG4gICAgICAgIHNlbGVjdGlvbiA9IHNlbGVjdGVkSXRlbXNba2V5XTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2FwcGx5U3RhdGVUb0FjdGlvbnMoc2VsZWN0aW9uLCByb3dOb2RlKTtcclxuICB9LFxyXG4gIGdldFF1aWNrQWN0aW9uUHJlZnM6IGZ1bmN0aW9uIGdldFF1aWNrQWN0aW9uUHJlZnMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5hcHAgJiYgdGhpcy5hcHAucHJlZmVyZW5jZXMgJiYgdGhpcy5hcHAucHJlZmVyZW5jZXMucXVpY2tBY3Rpb25zO1xyXG4gIH0sXHJcbiAgX3JlbW92ZUFjdGlvbkR1cGxpY2F0ZXM6IGZ1bmN0aW9uIF9yZW1vdmVBY3Rpb25EdXBsaWNhdGVzKGFjYywgY3VyKSB7XHJcbiAgICBjb25zdCBoYXNJRCA9IGFjYy5zb21lKChpdGVtKSA9PiB7XHJcbiAgICAgIHJldHVybiBpdGVtLmlkID09PSBjdXIuaWQ7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIWhhc0lEKSB7XHJcbiAgICAgIGFjYy5wdXNoKGN1cik7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGFjYztcclxuICB9LFxyXG4gIGVuc3VyZVF1aWNrQWN0aW9uUHJlZnM6IGZ1bmN0aW9uIGVuc3VyZVF1aWNrQWN0aW9uUHJlZnMoKSB7XHJcbiAgICBjb25zdCBhcHBQcmVmcyA9IHRoaXMuYXBwICYmIHRoaXMuYXBwLnByZWZlcmVuY2VzO1xyXG4gICAgbGV0IGFjdGlvblByZWZzID0gdGhpcy5nZXRRdWlja0FjdGlvblByZWZzKCk7XHJcbiAgICBjb25zdCBmaWx0ZXJlZCA9IHRoaXMuYWN0aW9ucy5maWx0ZXIoKGFjdGlvbikgPT4ge1xyXG4gICAgICByZXR1cm4gYWN0aW9uICYmIGFjdGlvbi5zeXN0ZW1BY3Rpb24gIT09IHRydWU7XHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAoIXRoaXMuYWN0aW9ucyB8fCAhYXBwUHJlZnMpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghYWN0aW9uUHJlZnMpIHtcclxuICAgICAgYXBwUHJlZnMucXVpY2tBY3Rpb25zID0ge307XHJcbiAgICAgIGFjdGlvblByZWZzID0gYXBwUHJlZnMucXVpY2tBY3Rpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIElmIGl0IGRvZXNuJ3QgZXhpc3QsIG9yIHRoZXJlIGlzIGEgY291bnQgbWlzbWF0Y2ggKGFjdGlvbnMgY3JlYXRlZCBvbiB1cGdyYWRlcyBwZXJoYXBzPylcclxuICAgIC8vIHJlLWNyZWF0ZSB0aGUgcHJlZmVyZW5jZXMgc3RvcmVcclxuICAgIGlmICghYWN0aW9uUHJlZnNbdGhpcy5pZF0gfHxcclxuICAgICAgKGFjdGlvblByZWZzW3RoaXMuaWRdICYmIGFjdGlvblByZWZzW3RoaXMuaWRdLmxlbmd0aCAhPT0gZmlsdGVyZWQubGVuZ3RoKSkge1xyXG4gICAgICBhY3Rpb25QcmVmc1t0aGlzLmlkXSA9IGZpbHRlcmVkLm1hcCgoYWN0aW9uKSA9PiB7XHJcbiAgICAgICAgYWN0aW9uLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICAgIHJldHVybiBhY3Rpb247XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgdGhpcy5hcHAucGVyc2lzdFByZWZlcmVuY2VzKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgZnJvbSBjaGVja0FjdGlvblN0YXRlIG1ldGhvZCBhbmQgc2V0cyB0aGUgc3RhdGUgb2YgdGhlIGFjdGlvbnMgZnJvbSB3aGF0IHdhcyBzZWxlY3RlZCBmcm9tIHRoZSBzZWxlY3RlZCByb3csIGl0IHNldHMgdGhlIGRpc2FibGVkIHN0YXRlIGZvciBlYWNoIGFjdGlvblxyXG4gICAqIGl0ZW0gdXNpbmcgdGhlIGN1cnJlbnRseSBzZWxlY3RlZCByb3cgYXMgY29udGV4dCBieSBwYXNzaW5nIHRoZSBhY3Rpb24gaW5zdGFuY2UgdGhlIHNlbGVjdGVkIHJvdyB0byB0aGVcclxuICAgKiBhY3Rpb24gaXRlbXMgYGVuYWJsZWRgIHByb3BlcnR5LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzZWxlY3Rpb25cclxuICAgKi9cclxuICBfYXBwbHlTdGF0ZVRvQWN0aW9uczogZnVuY3Rpb24gX2FwcGx5U3RhdGVUb0FjdGlvbnMoc2VsZWN0aW9uLCByb3dOb2RlKSB7XHJcbiAgICBsZXQgYWN0aW9uUm93O1xyXG4gICAgaWYgKHJvd05vZGUpIHtcclxuICAgICAgYWN0aW9uUm93ID0gJChyb3dOb2RlKS5maW5kKCcuYWN0aW9ucy1yb3cnKVswXTtcclxuICAgICAgJChhY3Rpb25Sb3cpLmVtcHR5KCk7XHJcbiAgICB9XHJcblxyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLnZpc2libGVBY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIC8vIFRoZSB2aXNpYmxlIGFjdGlvbiBpcyBmcm9tIG91ciBsb2NhbCBzdG9yYWdlIHByZWZlcmVuY2VzLCB3aGVyZSB0aGUgYWN0aW9uIGZyb20gdGhlIGxheW91dFxyXG4gICAgICAvLyBjb250YWlucyBmdW5jdGlvbnMgdGhhdCB3aWxsIGdldCBzdHJpcHBlZCBvdXQgY29udmVydGluZyBpdCB0byBKU09OLCBnZXQgdGhlIG9yaWdpbmFsIGFjdGlvblxyXG4gICAgICAvLyBhbmQgbWl4IGl0IGludG8gdGhlIHZpc2libGUgc28gd2UgY2FuIHdvcmsgd2l0aCBpdC5cclxuICAgICAgLy8gVE9ETzogVGhpcyB3aWxsIGJlIGEgcHJvYmxlbSB0aHJvdWdob3V0IHZpc2libGUgYWN0aW9ucywgY29tZSB1cCB3aXRoIGEgYmV0dGVyIHNvbHV0aW9uXHJcbiAgICAgIGNvbnN0IHZpc2libGVBY3Rpb24gPSB0aGlzLnZpc2libGVBY3Rpb25zW2ldO1xyXG4gICAgICBjb25zdCBhY3Rpb24gPSBsYW5nLm1peGluKHZpc2libGVBY3Rpb24sIHRoaXMuX2dldEFjdGlvbkJ5SWQodmlzaWJsZUFjdGlvbi5pZCkpO1xyXG5cclxuICAgICAgYWN0aW9uLmlzRW5hYmxlZCA9ICh0eXBlb2YgYWN0aW9uLmVuYWJsZWQgPT09ICd1bmRlZmluZWQnKSA/IHRydWUgOiB0aGlzLmV4cGFuZEV4cHJlc3Npb24oYWN0aW9uLmVuYWJsZWQsIGFjdGlvbiwgc2VsZWN0aW9uKTtcclxuXHJcbiAgICAgIGlmICghYWN0aW9uLmhhc0FjY2Vzcykge1xyXG4gICAgICAgIGFjdGlvbi5pc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgfVxyXG4gICAgICBpZiAocm93Tm9kZSkge1xyXG4gICAgICAgICQodmlzaWJsZUFjdGlvbi50ZW1wbGF0ZURvbSlcclxuICAgICAgICAgIC5jbG9uZSgpXHJcbiAgICAgICAgICAudG9nZ2xlQ2xhc3MoJ3Rvb2xCdXR0b24tZGlzYWJsZWQnLCAhYWN0aW9uLmlzRW5hYmxlZClcclxuICAgICAgICAgIC5hcHBlbmRUbyhhY3Rpb25Sb3cpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJvd05vZGUpIHtcclxuICAgICAgY29uc3QgcG9wdXBtZW51Tm9kZSA9ICQocm93Tm9kZSkuZmluZCgnLmJ0bi1hY3Rpb25zJylbMF07XHJcbiAgICAgIGNvbnN0IHBvcHVwbWVudSA9ICQocG9wdXBtZW51Tm9kZSkuZGF0YSgncG9wdXBtZW51Jyk7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIHBvcHVwbWVudS5wb3NpdGlvbigpO1xyXG4gICAgICB9LCAxKTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9nZXRBY3Rpb25CeUlkOiBmdW5jdGlvbiBfZ2V0QWN0aW9uQnlJZChpZCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aW9ucy5maWx0ZXIoKGFjdGlvbikgPT4ge1xyXG4gICAgICByZXR1cm4gYWN0aW9uICYmIGFjdGlvbi5pZCA9PT0gaWQ7XHJcbiAgICB9KVswXTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHNob3dpbmcgdGhlIGxpc3QtYWN0aW9uIHBhbmVsL2JhciAtIGl0IG5lZWRzIHRvIGRvIHNldmVyYWwgdGhpbmdzOlxyXG4gICAqXHJcbiAgICogMS4gQ2hlY2sgZWFjaCBpdGVtIGZvciBjb250ZXh0LWVuYWJsZWRtZW50XHJcbiAgICogMS4gTW92ZSB0aGUgYWN0aW9uIHBhbmVsIHRvIHRoZSBjdXJyZW50IHJvdyBhbmQgc2hvdyBpdFxyXG4gICAqIDEuIEFkanVzdCB0aGUgc2Nyb2xsaW5nIGlmIG5lZWRlZCAoaWYgc2VsZWN0ZWQgcm93IGlzIGF0IGJvdHRvbSBvZiBzY3JlZW4sIHRoZSBhY3Rpb24tYmFyIHNob3dzIG9mZiBzY3JlZW5cclxuICAgKiB3aGljaCBpcyBiYWQpXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0hUTUxFbGVtZW50fSByb3dOb2RlIFRoZSBjdXJyZW50bHkgc2VsZWN0ZWQgcm93IG5vZGVcclxuICAgKi9cclxuICBzaG93QWN0aW9uUGFuZWw6IGZ1bmN0aW9uIHNob3dBY3Rpb25QYW5lbChyb3dOb2RlKSB7XHJcbiAgICBjb25zdCBhY3Rpb25Ob2RlID0gJChyb3dOb2RlKS5maW5kKCcuYWN0aW9ucy1yb3cnKTtcclxuICAgIHRoaXMuY2hlY2tBY3Rpb25TdGF0ZShyb3dOb2RlKTtcclxuICAgIHRoaXMub25BcHBseVJvd0FjdGlvblBhbmVsKGFjdGlvbk5vZGUsIHJvd05vZGUpO1xyXG4gIH0sXHJcbiAgb25BcHBseVJvd0FjdGlvblBhbmVsOiBmdW5jdGlvbiBvbkFwcGx5Um93QWN0aW9uUGFuZWwoLyogYWN0aW9uTm9kZVBhbmVsLCByb3dOb2RlKi8pIHt9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIGB0aGlzLm9wdGlvbnMuc291cmNlYCB0byBwYXNzZWQgcGFyYW0gYWZ0ZXIgYWRkaW5nIHRoZSB2aWV3cyByZXNvdXJjZUtpbmQuIFRoaXMgZnVuY3Rpb24gaXMgdXNlZCBzb1xyXG4gICAqIHRoYXQgd2hlbiB0aGUgbmV4dCB2aWV3IHF1ZXJpZXMgdGhlIG5hdmlnYXRpb24gY29udGV4dCB3ZSBjYW4gaW5jbHVkZSB0aGUgcGFzc2VkIHBhcmFtIGFzIGEgZGF0YSBwb2ludC5cclxuICAgKlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBzb3VyY2UgVGhlIG9iamVjdCB0byBzZXQgYXMgdGhlIG9wdGlvbnMuc291cmNlLlxyXG4gICAqL1xyXG4gIHNldFNvdXJjZTogZnVuY3Rpb24gc2V0U291cmNlKHNvdXJjZSkge1xyXG4gICAgbGFuZy5taXhpbihzb3VyY2UsIHtcclxuICAgICAgcmVzb3VyY2VLaW5kOiB0aGlzLnJlc291cmNlS2luZCxcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMub3B0aW9ucy5zb3VyY2UgPSBzb3VyY2U7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBAZGVwcmVjYXRlZFxyXG4gICAqIEhpZGVzIHRoZSBwYXNzZWQgbGlzdC1hY3Rpb24gcm93L3BhbmVsIGJ5IHJlbW92aW5nIHRoZSBzZWxlY3RlZCBzdHlsaW5nXHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gcm93Tm9kZSBUaGUgY3VycmVudGx5IHNlbGVjdGVkIHJvdy5cclxuICAgKi9cclxuICBoaWRlQWN0aW9uUGFuZWw6IGZ1bmN0aW9uIGhpZGVBY3Rpb25QYW5lbCgpIHtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIERldGVybWluZXMgaWYgdGhlIHZpZXcgaXMgYSBuYXZpZ2F0aWJsZSB2aWV3IG9yIGEgc2VsZWN0aW9uIHZpZXcgYnkgcmV0dXJuaW5nIGB0aGlzLnNlbGVjdGlvbk9ubHlgIG9yIHRoZVxyXG4gICAqIG5hdmlnYXRpb24gYHRoaXMub3B0aW9ucy5zZWxlY3Rpb25Pbmx5YC5cclxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxyXG4gICAqL1xyXG4gIGlzTmF2aWdhdGlvbkRpc2FibGVkOiBmdW5jdGlvbiBpc05hdmlnYXRpb25EaXNhYmxlZCgpIHtcclxuICAgIHJldHVybiAoKHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMuc2VsZWN0aW9uT25seSkgfHwgKHRoaXMuc2VsZWN0aW9uT25seSkpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRGV0ZXJtaW5lcyBpZiB0aGUgc2VsZWN0aW9ucyBhcmUgZGlzYWJsZWQgYnkgY2hlY2tpbmcgdGhlIGBhbGxvd1NlbGVjdGlvbmAgYW5kIGBlbmFibGVBY3Rpb25zYFxyXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XHJcbiAgICovXHJcbiAgaXNTZWxlY3Rpb25EaXNhYmxlZDogZnVuY3Rpb24gaXNTZWxlY3Rpb25EaXNhYmxlZCgpIHtcclxuICAgIHJldHVybiAhKCh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnNlbGVjdGlvbk9ubHkpIHx8IHRoaXMuZW5hYmxlQWN0aW9ucyB8fCB0aGlzLmFsbG93U2VsZWN0aW9uKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHdoZW4gdGhlIHNlbGVjdGlvbiBtb2RlbCBhZGRzIGFuIGl0ZW0uIEFkZHMgdGhlIHNlbGVjdGVkIHN0YXRlIHRvIHRoZSByb3cgb3Igc2hvd3MgdGhlIGxpc3RcclxuICAgKiBhY3Rpb25zIHBhbmVsLlxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBrZXkgVGhlIGV4dHJhY3RlZCBrZXkgZnJvbSB0aGUgc2VsZWN0ZWQgcm93LlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBkYXRhIFRoZSBhY3R1YWwgcm93J3MgbWF0Y2hpbmcgZGF0YSBwb2ludFxyXG4gICAqIEBwYXJhbSB7U3RyaW5nL0hUTUxFbGVtZW50fSB0YWcgQW4gaW5kZW50aWZpZXIsIG1heSBiZSB0aGUgYWN0dWFsIHJvdyBub2RlIG9yIHNvbWUgb3RoZXIgaWQuXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBfb25TZWxlY3Rpb25Nb2RlbFNlbGVjdDogZnVuY3Rpb24gX29uU2VsZWN0aW9uTW9kZWxTZWxlY3Qoa2V5LCBkYXRhLCB0YWcpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgY29uc3Qgbm9kZSA9ICQodGFnKTtcclxuXHJcbiAgICBpZiAodGhpcy5lbmFibGVBY3Rpb25zKSB7XHJcbiAgICAgIHRoaXMuc2hvd0FjdGlvblBhbmVsKG5vZGUuZ2V0KDApKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIG5vZGUuYWRkQ2xhc3MoJ2xpc3QtaXRlbS1zZWxlY3RlZCcpO1xyXG4gICAgbm9kZS5yZW1vdmVDbGFzcygnbGlzdC1pdGVtLWRlLXNlbGVjdGVkJyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB3aGVuIHRoZSBzZWxlY3Rpb24gbW9kZWwgcmVtb3ZlcyBhbiBpdGVtLiBSZW1vdmVzIHRoZSBzZWxlY3RlZCBzdGF0ZSB0byB0aGUgcm93IG9yIGhpZGVzIHRoZSBsaXN0XHJcbiAgICogYWN0aW9ucyBwYW5lbC5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IFRoZSBleHRyYWN0ZWQga2V5IGZyb20gdGhlIGRlLXNlbGVjdGVkIHJvdy5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gZGF0YSBUaGUgYWN0dWFsIHJvdydzIG1hdGNoaW5nIGRhdGEgcG9pbnRcclxuICAgKiBAcGFyYW0ge1N0cmluZy9IVE1MRWxlbWVudH0gdGFnIEFuIGluZGVudGlmaWVyLCBtYXkgYmUgdGhlIGFjdHVhbCByb3cgbm9kZSBvciBzb21lIG90aGVyIGlkLlxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgX29uU2VsZWN0aW9uTW9kZWxEZXNlbGVjdDogZnVuY3Rpb24gX29uU2VsZWN0aW9uTW9kZWxEZXNlbGVjdChrZXksIGRhdGEsIHRhZykge1xyXG4gICAgY29uc3Qgbm9kZSA9ICQodGFnKSB8fCAkKGBbZGF0YS1rZXk9XCIke2tleX1cIl1gLCB0aGlzLmNvbnRlbnROb2RlKS5maXJzdCgpO1xyXG4gICAgaWYgKCFub2RlLmxlbmd0aCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgbm9kZS5yZW1vdmVDbGFzcygnbGlzdC1pdGVtLXNlbGVjdGVkJyk7XHJcbiAgICBub2RlLmFkZENsYXNzKCdsaXN0LWl0ZW0tZGUtc2VsZWN0ZWQnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHdoZW4gdGhlIHNlbGVjdGlvbiBtb2RlbCBjbGVhcnMgdGhlIHNlbGVjdGlvbnMuXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBfb25TZWxlY3Rpb25Nb2RlbENsZWFyOiBmdW5jdGlvbiBfb25TZWxlY3Rpb25Nb2RlbENsZWFyKCkge30sXHJcblxyXG4gIC8qKlxyXG4gICAqIENhY2hlIG9mIGxvYWRlZCBzZWxlY3Rpb25zXHJcbiAgICovXHJcbiAgX2xvYWRlZFNlbGVjdGlvbnM6IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIEF0dGVtcHRzIHRvIGFjdGl2YXRlIGVudHJpZXMgcGFzc2VkIGluIGB0aGlzLm9wdGlvbnMucHJldmlvdXNTZWxlY3Rpb25zYCB3aGVyZSBwcmV2aW91c1NlbGVjdGlvbnMgaXMgYW4gYXJyYXlcclxuICAgKiBvZiBkYXRhLWtleXMgb3IgZGF0YS1kZXNjcmlwdG9ycyB0byBzZWFyY2ggdGhlIGxpc3Qgcm93cyBmb3IuXHJcbiAgICogQHByaXZhdGVcclxuICAgKi9cclxuICBfbG9hZFByZXZpb3VzU2VsZWN0aW9uczogZnVuY3Rpb24gX2xvYWRQcmV2aW91c1NlbGVjdGlvbnMoKSB7XHJcbiAgICBjb25zdCBwcmV2aW91c1NlbGVjdGlvbnMgPSB0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnByZXZpb3VzU2VsZWN0aW9ucztcclxuICAgIGlmIChwcmV2aW91c1NlbGVjdGlvbnMpIHtcclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBwcmV2aW91c1NlbGVjdGlvbnMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCBrZXkgPSBwcmV2aW91c1NlbGVjdGlvbnNbaV07XHJcblxyXG4gICAgICAgIC8vIFNldCBpbml0aWFsIHN0YXRlIG9mIHByZXZpb3VzIHNlbGVjdGlvbiB0byB1bmxvYWRlZCAoZmFsc2UpXHJcbiAgICAgICAgaWYgKCF0aGlzLl9sb2FkZWRTZWxlY3Rpb25zLmhhc093blByb3BlcnR5KGtleSkpIHtcclxuICAgICAgICAgIHRoaXMuX2xvYWRlZFNlbGVjdGlvbnNba2V5XSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uc3Qgcm93ID0gJChgW2RhdGEta2V5PVwiJHtrZXl9XCJdLCBbZGF0YS1kZXNjcmlwdG9yPVwiJHtrZXl9XCJdYCwgdGhpcy5jb250ZW50Tm9kZSlbMF07XHJcblxyXG4gICAgICAgIGlmIChyb3cgJiYgdGhpcy5fbG9hZGVkU2VsZWN0aW9uc1trZXldICE9PSB0cnVlKSB7XHJcbiAgICAgICAgICB0aGlzLmFjdGl2YXRlRW50cnkoe1xyXG4gICAgICAgICAgICBrZXksXHJcbiAgICAgICAgICAgIGRlc2NyaXB0b3I6IGtleSxcclxuICAgICAgICAgICAgJHNvdXJjZTogcm93LFxyXG4gICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgLy8gRmxhZyB0aGF0IHRoaXMgcHJldmlvdXMgc2VsZWN0aW9uIGhhcyBiZWVuIGxvYWRlZCwgc2luY2UgdGhpcyBmdW5jdGlvbiBjYW4gYmUgY2FsbGVkXHJcbiAgICAgICAgICAvLyBtdWx0aXBsZSB0aW1lcywgd2hpbGUgcGFnaW5nIHRocm91Z2ggbG9uZyBsaXN0cy4gY2xlYXIoKSB3aWxsIHJlc2V0LlxyXG4gICAgICAgICAgdGhpcy5fbG9hZGVkU2VsZWN0aW9uc1trZXldID0gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGFwcGx5Um93SW5kaWNhdG9yczogZnVuY3Rpb24gYXBwbHlSb3dJbmRpY2F0b3JzKGVudHJ5LCByb3dOb2RlKSB7XHJcbiAgICBpZiAodGhpcy5pdGVtSW5kaWNhdG9ycyAmJiB0aGlzLml0ZW1JbmRpY2F0b3JzLmxlbmd0aCA+IDApIHtcclxuICAgICAgY29uc3QgdG9wSW5kaWNhdG9yc05vZGUgPSAkKCcudG9wX2l0ZW1faW5kaWNhdG9ycycsIHJvd05vZGUpO1xyXG4gICAgICBjb25zdCBib3R0b21JbmRpY2F0b3JzTm9kZSA9ICQoJy5ib3R0b21faXRlbV9pbmRpY2F0b3JzJywgcm93Tm9kZSk7XHJcbiAgICAgIGlmIChib3R0b21JbmRpY2F0b3JzTm9kZVswXSAmJiB0b3BJbmRpY2F0b3JzTm9kZVswXSkge1xyXG4gICAgICAgIGlmIChib3R0b21JbmRpY2F0b3JzTm9kZVswXS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCAmJiB0b3BJbmRpY2F0b3JzTm9kZVswXS5jaGlsZE5vZGVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgY29uc3QgY3VzdG9taXplTGF5b3V0ID0gdGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dCh0aGlzLml0ZW1JbmRpY2F0b3JzLCAnaW5kaWNhdG9ycycpO1xyXG4gICAgICAgICAgdGhpcy5jcmVhdGVJbmRpY2F0b3JzKHRvcEluZGljYXRvcnNOb2RlWzBdLCBib3R0b21JbmRpY2F0b3JzTm9kZVswXSwgY3VzdG9taXplTGF5b3V0LCBlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBjcmVhdGVJbmRpY2F0b3JMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZUluZGljYXRvckxheW91dCgpIHtcclxuICAgIHJldHVybiB0aGlzLml0ZW1JbmRpY2F0b3JzIHx8ICh0aGlzLml0ZW1JbmRpY2F0b3JzID0gW3tcclxuICAgICAgaWQ6ICd0b3VjaGVkJyxcclxuICAgICAgY2xzOiAnZmxhZycsXHJcbiAgICAgIG9uQXBwbHk6IGZ1bmN0aW9uIG9uQXBwbHkoZW50cnksIHBhcmVudCkge1xyXG4gICAgICAgIHRoaXMuaXNFbmFibGVkID0gcGFyZW50Lmhhc0JlZW5Ub3VjaGVkKGVudHJ5KTtcclxuICAgICAgfSxcclxuICAgIH1dKTtcclxuICB9LFxyXG4gIGhhc0JlZW5Ub3VjaGVkOiBmdW5jdGlvbiBoYXNCZWVuVG91Y2hlZChlbnRyeSkge1xyXG4gICAgaWYgKGVudHJ5Lk1vZGlmeURhdGUpIHtcclxuICAgICAgY29uc3QgbW9kaWZpZWREYXRlID0gbW9tZW50KGNvbnZlcnQudG9EYXRlRnJvbVN0cmluZyhlbnRyeS5Nb2RpZnlEYXRlKSk7XHJcbiAgICAgIGNvbnN0IGN1cnJlbnREYXRlID0gbW9tZW50KCkuZW5kT2YoJ2RheScpO1xyXG4gICAgICBjb25zdCB3ZWVrQWdvID0gbW9tZW50KCkuc3VidHJhY3QoMSwgJ3dlZWtzJyk7XHJcblxyXG4gICAgICByZXR1cm4gbW9kaWZpZWREYXRlLmlzQWZ0ZXIod2Vla0FnbykgJiZcclxuICAgICAgICBtb2RpZmllZERhdGUuaXNCZWZvcmUoY3VycmVudERhdGUpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGZhbHNlO1xyXG4gIH0sXHJcbiAgX3JlZnJlc2hMaXN0OiBmdW5jdGlvbiBfcmVmcmVzaExpc3QoKSB7XHJcbiAgICB0aGlzLmZvcmNlUmVmcmVzaCgpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyB0aGlzLm9wdGlvbnMucHJldmlvdXNTZWxlY3Rpb25zIHRoYXQgaGF2ZSBub3QgYmVlbiBsb2FkZWQgb3IgcGFnZWQgdG9cclxuICAgKiBAcmV0dXJuIHtBcnJheX1cclxuICAgKi9cclxuICBnZXRVbmxvYWRlZFNlbGVjdGlvbnM6IGZ1bmN0aW9uIGdldFVubG9hZGVkU2VsZWN0aW9ucygpIHtcclxuICAgIHJldHVybiBPYmplY3Qua2V5cyh0aGlzLl9sb2FkZWRTZWxlY3Rpb25zKVxyXG4gICAgICAuZmlsdGVyKChrZXkpID0+IHtcclxuICAgICAgICByZXR1cm4gdGhpcy5fbG9hZGVkU2VsZWN0aW9uc1trZXldID09PSBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgZ2xvYmFsIGAvYXBwL3JlZnJlc2hgIGV2ZW50LiBTZXRzIGByZWZyZXNoUmVxdWlyZWRgIHRvIHRydWUgaWYgdGhlIHJlc291cmNlS2luZCBtYXRjaGVzLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFRoZSBvYmplY3QgcHVibGlzaGVkIGJ5IHRoZSBldmVudC5cclxuICAgKiBAcHJpdmF0ZVxyXG4gICAqL1xyXG4gIF9vblJlZnJlc2g6IGZ1bmN0aW9uIF9vblJlZnJlc2goLyogb3B0aW9ucyovKSB7fSxcclxuICBvblNjcm9sbDogZnVuY3Rpb24gb25TY3JvbGwoLyogZXZ0Ki8pIHtcclxuICAgIGNvbnN0IHNjcm9sbGVyTm9kZSA9IHRoaXMuc2Nyb2xsZXJOb2RlO1xyXG4gICAgY29uc3QgaGVpZ2h0ID0gJChzY3JvbGxlck5vZGUpLmhlaWdodCgpOyAvLyB2aWV3cG9ydCBoZWlnaHQgKHdoYXQgdXNlciBzZWVzKVxyXG4gICAgY29uc3Qgc2Nyb2xsSGVpZ2h0ID0gc2Nyb2xsZXJOb2RlLnNjcm9sbEhlaWdodDsgLy8gRW50aXJlIGNvbnRhaW5lciBoZWlnaHRcclxuICAgIGNvbnN0IHNjcm9sbFRvcCA9IHNjcm9sbGVyTm9kZS5zY3JvbGxUb3A7IC8vIEhvdyBmYXIgd2UgYXJlIHNjcm9sbGVkIGRvd25cclxuICAgIGNvbnN0IHJlbWFpbmluZyA9IHNjcm9sbEhlaWdodCAtIHNjcm9sbFRvcDsgLy8gSGVpZ2h0IHdlIGhhdmUgcmVtYWluaW5nIHRvIHNjcm9sbFxyXG4gICAgY29uc3Qgc2VsZWN0ZWQgPSAkKHRoaXMuZG9tTm9kZSkuYXR0cignc2VsZWN0ZWQnKTtcclxuICAgIGNvbnN0IGRpZmYgPSBNYXRoLmFicyhyZW1haW5pbmcgLSBoZWlnaHQpO1xyXG5cclxuICAgIC8vIFN0YXJ0IGF1dG8gZmV0Y2hpbmcgbW9yZSBkYXRhIGlmIHRoZSB1c2VyIGlzIG9uIHRoZSBsYXN0IGhhbGYgb2YgdGhlIHJlbWFpbmluZyBzY3JlZW5cclxuICAgIGlmIChkaWZmIDw9IGhlaWdodCAvIDIpIHtcclxuICAgICAgaWYgKHNlbGVjdGVkID09PSAnc2VsZWN0ZWQnICYmIHRoaXMuaGFzTW9yZURhdGEoKSAmJiAhdGhpcy5saXN0TG9hZGluZykge1xyXG4gICAgICAgIHRoaXMubW9yZSgpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgc2VsZWN0IG9yIGFjdGlvbiBub2RlIGRhdGEtYWN0aW9uLiBGaW5kcyB0aGUgbmVhcmVzdCBub2RlIHdpdGggdGhlIGRhdGEta2V5IGF0dHJpYnV0ZSBhbmRcclxuICAgKiB0b2dnbGVzIGl0IGluIHRoZSB2aWV3cyBzZWxlY3Rpb24gbW9kZWwuXHJcbiAgICpcclxuICAgKiBJZiBzaW5nbGVTZWxlY3RBY3Rpb24gaXMgZGVmaW5lZCwgaW52b2tlIHRoZSBzaW5nbGVTZWxlY3Rpb25BY3Rpb24uXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge09iamVjdH0gcGFyYW1zIENvbGxlY3Rpb24gb2YgYGRhdGEtYCBhdHRyaWJ1dGVzIGZyb20gdGhlIG5vZGUuXHJcbiAgICogQHBhcmFtIHtFdmVudH0gZXZ0IFRoZSBjbGljay90YXAgZXZlbnQuXHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBUaGUgZWxlbWVudCB0aGF0IGluaXRpYXRlZCB0aGUgZXZlbnQuXHJcbiAgICovXHJcbiAgc2VsZWN0RW50cnk6IGZ1bmN0aW9uIHNlbGVjdEVudHJ5KHBhcmFtcykge1xyXG4gICAgY29uc3Qgcm93ID0gJChgW2RhdGEta2V5PScke3BhcmFtcy5rZXl9J11gLCB0aGlzLmNvbnRlbnROb2RlKS5maXJzdCgpO1xyXG4gICAgY29uc3Qga2V5ID0gcm93ID8gcm93LmF0dHIoJ2RhdGEta2V5JykgOiBmYWxzZTtcclxuXHJcbiAgICBpZiAodGhpcy5fc2VsZWN0aW9uTW9kZWwgJiYga2V5KSB7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnNlbGVjdChrZXksIHRoaXMuZW50cmllc1trZXldLCByb3cuZ2V0KDApKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnNpbmdsZVNlbGVjdCAmJiB0aGlzLm9wdGlvbnMuc2luZ2xlU2VsZWN0QWN0aW9uICYmICF0aGlzLmVuYWJsZUFjdGlvbnMpIHtcclxuICAgICAgdGhpcy5pbnZva2VTaW5nbGVTZWxlY3RBY3Rpb24oKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIGVhY2ggcm93LlxyXG4gICAqXHJcbiAgICogSWYgYSBzZWxlY3Rpb24gbW9kZWwgaXMgZGVmaW5lZCBhbmQgbmF2aWdhdGlvbiBpcyBkaXNhYmxlZCB0aGVuIHRvZ2dsZSB0aGUgZW50cnkvcm93XHJcbiAgICogaW4gdGhlIG1vZGVsIGFuZCBpZiBzaW5nbGVTZWxlY3Rpb25BY3Rpb24gaXMgdHJ1ZSBpbnZva2UgdGhlIHNpbmdsZVNlbGVjdEFjdGlvbi5cclxuICAgKlxyXG4gICAqIEVsc2UgbmF2aWdhdGUgdG8gdGhlIGRldGFpbCB2aWV3IGZvciB0aGUgZXh0cmFjdGVkIGRhdGEta2V5LlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtcyBDb2xsZWN0aW9uIG9mIGBkYXRhLWAgYXR0cmlidXRlcyBmcm9tIHRoZSBub2RlLlxyXG4gICAqL1xyXG4gIGFjdGl2YXRlRW50cnk6IGZ1bmN0aW9uIGFjdGl2YXRlRW50cnkocGFyYW1zKSB7XHJcbiAgICAvLyBkb250IG5hdmlnYXRlIGlmIGNsaWNrZWQgb24gUUEgYnV0dG9uXHJcbiAgICBpZiAocGFyYW1zLiRldmVudCAmJiBwYXJhbXMuJGV2ZW50LnRhcmdldC5jbGFzc05hbWUgJiYgcGFyYW1zLiRldmVudC50YXJnZXQuY2xhc3NOYW1lLmluZGV4T2YoJ2J0bi1hY3Rpb25zJykgIT09IC0xKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGlmIChwYXJhbXMua2V5KSB7XHJcbiAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCAmJiB0aGlzLmlzTmF2aWdhdGlvbkRpc2FibGVkKCkpIHtcclxuICAgICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC50b2dnbGUocGFyYW1zLmtleSwgdGhpcy5lbnRyaWVzW3BhcmFtcy5rZXldIHx8IHBhcmFtcy5kZXNjcmlwdG9yLCBwYXJhbXMuJHNvdXJjZSk7XHJcbiAgICAgICAgaWYgKHRoaXMub3B0aW9ucy5zaW5nbGVTZWxlY3QgJiYgdGhpcy5vcHRpb25zLnNpbmdsZVNlbGVjdEFjdGlvbikge1xyXG4gICAgICAgICAgdGhpcy5pbnZva2VTaW5nbGVTZWxlY3RBY3Rpb24oKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy5uYXZpZ2F0ZVRvRGV0YWlsVmlldyhwYXJhbXMua2V5LCBwYXJhbXMuZGVzY3JpcHRvcik7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEludm9rZXMgdGhlIGNvcnJlc3BvbmRpbmcgdG9wIHRvb2xiYXIgdG9vbCB1c2luZyBgdGhpcy5vcHRpb25zLnNpbmdsZVNlbGVjdEFjdGlvbmAgYXMgdGhlIG5hbWUuXHJcbiAgICogSWYgYXV0b0NsZWFyU2VsZWN0aW9uIGlzIHRydWUsIGNsZWFyIHRoZSBzZWxlY3Rpb24gbW9kZWwuXHJcbiAgICovXHJcbiAgaW52b2tlU2luZ2xlU2VsZWN0QWN0aW9uOiBmdW5jdGlvbiBpbnZva2VTaW5nbGVTZWxlY3RBY3Rpb24oKSB7XHJcbiAgICBpZiAodGhpcy5hcHAuYmFycy50YmFyKSB7XHJcbiAgICAgIHRoaXMuYXBwLmJhcnMudGJhci5pbnZva2VUb29sKHtcclxuICAgICAgICB0b29sOiB0aGlzLm9wdGlvbnMuc2luZ2xlU2VsZWN0QWN0aW9uLFxyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5hdXRvQ2xlYXJTZWxlY3Rpb24pIHtcclxuICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2xlYXIoKTtcclxuICAgICAgdGhpcy5fbG9hZGVkU2VsZWN0aW9ucyA9IHt9O1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbGVkIHRvIHRyYW5zZm9ybSBhIHRleHR1YWwgcXVlcnkgaW50byBhbiBTRGF0YSBxdWVyeSBjb21wYXRpYmxlIHNlYXJjaCBleHByZXNzaW9uLlxyXG4gICAqXHJcbiAgICogVmlld3Mgc2hvdWxkIG92ZXJyaWRlIHRoaXMgZnVuY3Rpb24gdG8gcHJvdmlkZSB0aGVpciBvd24gZm9ybWF0dGluZyB0YWlsb3JlZCB0byB0aGVpciBlbnRpdHkuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gc2VhcmNoUXVlcnkgVXNlciBpbnB1dHRlZCB0ZXh0IGZyb20gdGhlIHNlYXJjaCB3aWRnZXQuXHJcbiAgICogQHJldHVybiB7U3RyaW5nL0Jvb2xlYW59IEFuIFNEYXRhIHF1ZXJ5IGNvbXBhdGlibGUgc2VhcmNoIGV4cHJlc3Npb24uXHJcbiAgICogQHRlbXBsYXRlXHJcbiAgICovXHJcbiAgZm9ybWF0U2VhcmNoUXVlcnk6IGZ1bmN0aW9uIGZvcm1hdFNlYXJjaFF1ZXJ5KC8qIHNlYXJjaFF1ZXJ5Ki8pIHtcclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJlcGxhY2VzIGEgc2luZ2xlIGBcImAgd2l0aCB0d28gYFwiXCJgIGZvciBwcm9wZXIgU0RhdGEgcXVlcnkgZXhwcmVzc2lvbnMuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHNlYXJjaFF1ZXJ5IFNlYXJjaCBleHByZXNzaW9uIHRvIGJlIGVzY2FwZWQuXHJcbiAgICogQHJldHVybiB7U3RyaW5nfVxyXG4gICAqL1xyXG4gIGVzY2FwZVNlYXJjaFF1ZXJ5OiBmdW5jdGlvbiBlc2NhcGVTZWFyY2hRdWVyeShzZWFyY2hRdWVyeSkge1xyXG4gICAgcmV0dXJuIFV0aWxpdHkuZXNjYXBlU2VhcmNoUXVlcnkoc2VhcmNoUXVlcnkpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogSGFuZGxlciBmb3IgdGhlIHNlYXJjaCB3aWRnZXRzIHNlYXJjaC5cclxuICAgKlxyXG4gICAqIFByZXBhcmVzIHRoZSB2aWV3IGJ5IGNsZWFyaW5nIGl0IGFuZCBzZXR0aW5nIGB0aGlzLnF1ZXJ5YCB0byB0aGUgZ2l2ZW4gc2VhcmNoIGV4cHJlc3Npb24uIFRoZW4gY2FsbHNcclxuICAgKiB7QGxpbmsgI3JlcXVlc3REYXRhIHJlcXVlc3REYXRhfSB3aGljaCBzdGFydCB0aGUgcmVxdWVzdCBwcm9jZXNzLlxyXG4gICAqXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGV4cHJlc3Npb24gU3RyaW5nIGV4cHJlc3Npb24gYXMgcmV0dXJuZWQgZnJvbSB0aGUgc2VhcmNoIHdpZGdldFxyXG4gICAqIEBwcml2YXRlXHJcbiAgICovXHJcbiAgX29uU2VhcmNoRXhwcmVzc2lvbjogZnVuY3Rpb24gX29uU2VhcmNoRXhwcmVzc2lvbihleHByZXNzaW9uKSB7XHJcbiAgICB0aGlzLmNsZWFyKGZhbHNlKTtcclxuICAgIHRoaXMucXVlcnlUZXh0ID0gJyc7XHJcbiAgICB0aGlzLnF1ZXJ5ID0gZXhwcmVzc2lvbjtcclxuXHJcbiAgICB0aGlzLnJlcXVlc3REYXRhKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBkZWZhdWx0IHNlYXJjaCBleHByZXNzaW9uIChhY3RpbmcgYXMgYSBwcmUtZmlsdGVyKSB0byBgdGhpcy5vcHRpb25zLnF1ZXJ5YCBhbmQgY29uZmlndXJlcyB0aGVcclxuICAgKiBzZWFyY2ggd2lkZ2V0IGJ5IHBhc3NpbmcgaW4gdGhlIGN1cnJlbnQgdmlldyBjb250ZXh0LlxyXG4gICAqL1xyXG4gIGNvbmZpZ3VyZVNlYXJjaDogZnVuY3Rpb24gY29uZmlndXJlU2VhcmNoKCkge1xyXG4gICAgdGhpcy5xdWVyeSA9IHRoaXMub3B0aW9ucyAmJiB0aGlzLm9wdGlvbnMucXVlcnkgfHwgdGhpcy5xdWVyeSB8fCBudWxsO1xyXG4gICAgaWYgKHRoaXMuc2VhcmNoV2lkZ2V0KSB7XHJcbiAgICAgIHRoaXMuc2VhcmNoV2lkZ2V0LmNvbmZpZ3VyZSh7XHJcbiAgICAgICAgY29udGV4dDogdGhpcy5nZXRDb250ZXh0KCksXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3NldERlZmF1bHRTZWFyY2hUZXJtKCk7XHJcbiAgfSxcclxuICBfc2V0RGVmYXVsdFNlYXJjaFRlcm06IGZ1bmN0aW9uIF9zZXREZWZhdWx0U2VhcmNoVGVybSgpIHtcclxuICAgIGlmICghdGhpcy5kZWZhdWx0U2VhcmNoVGVybSB8fCB0aGlzLmRlZmF1bHRTZWFyY2hUZXJtU2V0KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodHlwZW9mIHRoaXMuZGVmYXVsdFNlYXJjaFRlcm0gPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgdGhpcy5zZXRTZWFyY2hUZXJtKHRoaXMuZGVmYXVsdFNlYXJjaFRlcm0oKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNldFNlYXJjaFRlcm0odGhpcy5kZWZhdWx0U2VhcmNoVGVybSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fdXBkYXRlUXVlcnkoKTtcclxuXHJcbiAgICB0aGlzLmRlZmF1bHRTZWFyY2hUZXJtU2V0ID0gdHJ1ZTtcclxuICB9LFxyXG4gIF91cGRhdGVRdWVyeTogZnVuY3Rpb24gX3VwZGF0ZVF1ZXJ5KCkge1xyXG4gICAgY29uc3Qgc2VhcmNoUXVlcnkgPSB0aGlzLmdldFNlYXJjaFF1ZXJ5KCk7XHJcbiAgICBpZiAoc2VhcmNoUXVlcnkpIHtcclxuICAgICAgdGhpcy5xdWVyeSA9IHNlYXJjaFF1ZXJ5O1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdGhpcy5xdWVyeSA9ICcnO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2V0U2VhcmNoUXVlcnk6IGZ1bmN0aW9uIGdldFNlYXJjaFF1ZXJ5KCkge1xyXG4gICAgbGV0IHJlc3VsdHMgPSBudWxsO1xyXG5cclxuICAgIGlmICh0aGlzLnNlYXJjaFdpZGdldCkge1xyXG4gICAgICByZXN1bHRzID0gdGhpcy5zZWFyY2hXaWRnZXQuZ2V0Rm9ybWF0dGVkU2VhcmNoUXVlcnkoKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcmVzdWx0cztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhlbHBlciBtZXRob2QgZm9yIGxpc3QgYWN0aW9ucy4gVGFrZXMgYSB2aWV3IGlkLCBkYXRhIHBvaW50IGFuZCB3aGVyZSBmb3JtYXQgc3RyaW5nLCBzZXRzIHRoZSBuYXYgb3B0aW9uc1xyXG4gICAqIGB3aGVyZWAgdG8gdGhlIGZvcm1hdHRlZCBleHByZXNzaW9uIHVzaW5nIHRoZSBkYXRhIHBvaW50IGFuZCBzaG93cyB0aGUgZ2l2ZW4gdmlldyBpZCB3aXRoIHRoYXQgb3B0aW9uLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gQWN0aW9uIGluc3RhbmNlLCBub3QgdXNlZC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gc2VsZWN0aW9uIERhdGEgZW50cnkgZm9yIHRoZSBzZWxlY3Rpb24uXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHZpZXdJZCBWaWV3IGlkIHRvIGJlIHNob3duXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHdoZXJlUXVlcnlGbXQgV2hlcmUgZXhwcmVzc2lvbiBmb3JtYXQgc3RyaW5nIHRvIGJlIHBhc3NlZC4gYCR7MH1gIHdpbGwgYmUgdGhlIGBpZFByb3BlcnR5YFxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhZGRpdGlvbmFsT3B0aW9ucyBBZGRpdGlvbmFsIG9wdGlvbnMgdG8gYmUgcGFzc2VkIGludG8gdGhlIG5leHQgdmlld1xyXG4gICAqIHByb3BlcnR5IG9mIHRoZSBwYXNzZWQgc2VsZWN0aW9uIGRhdGEuXHJcbiAgICovXHJcbiAgbmF2aWdhdGVUb1JlbGF0ZWRWaWV3OiBmdW5jdGlvbiBuYXZpZ2F0ZVRvUmVsYXRlZFZpZXcoYWN0aW9uLCBzZWxlY3Rpb24sIHZpZXdJZCwgd2hlcmVRdWVyeUZtdCwgYWRkaXRpb25hbE9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC5nZXRWaWV3KHZpZXdJZCk7XHJcbiAgICBsZXQgb3B0aW9ucyA9IHtcclxuICAgICAgd2hlcmU6IHN0cmluZy5zdWJzdGl0dXRlKHdoZXJlUXVlcnlGbXQsIFtzZWxlY3Rpb24uZGF0YVt0aGlzLmlkUHJvcGVydHldXSksXHJcbiAgICAgIHNlbGVjdGVkRW50cnk6IHNlbGVjdGlvbi5kYXRhLFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoYWRkaXRpb25hbE9wdGlvbnMpIHtcclxuICAgICAgb3B0aW9ucyA9IGxhbmcubWl4aW4ob3B0aW9ucywgYWRkaXRpb25hbE9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuc2V0U291cmNlKHtcclxuICAgICAgZW50cnk6IHNlbGVjdGlvbi5kYXRhLFxyXG4gICAgICBkZXNjcmlwdG9yOiBzZWxlY3Rpb24uZGF0YVt0aGlzLmxhYmVsUHJvcGVydHldLFxyXG4gICAgICBrZXk6IHNlbGVjdGlvbi5kYXRhW3RoaXMuaWRQcm9wZXJ0eV0sXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICB2aWV3LnNob3cob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBOYXZpZ2F0ZXMgdG8gdGhlIGRlZmluZWQgYHRoaXMuZGV0YWlsVmlld2AgcGFzc2luZyB0aGUgcGFyYW1zIGFzIG5hdmlnYXRpb24gb3B0aW9ucy5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30ga2V5IEtleSBvZiB0aGUgZW50cnkgdG8gYmUgc2hvd24gaW4gZGV0YWlsXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGRlc2NyaXB0b3IgRGVzY3JpcHRpb24gb2YgdGhlIGVudHJ5LCB3aWxsIGJlIHVzZWQgYXMgdGhlIHRvcCB0b29sYmFyIHRpdGxlIHRleHRcclxuICAgKiBAcGFyYW0ge09iamVjdH0gYWRkaXRpb25hbE9wdGlvbnMgQWRkaXRpb25hbCBvcHRpb25zIHRvIGJlIHBhc3NlZCBpbnRvIHRoZSBuZXh0IHZpZXdcclxuICAgKi9cclxuICBuYXZpZ2F0ZVRvRGV0YWlsVmlldzogZnVuY3Rpb24gbmF2aWdhdGVUb0RldGFpbFZpZXcoa2V5LCBkZXNjcmlwdG9yLCBhZGRpdGlvbmFsT3B0aW9ucykge1xyXG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLmdldFZpZXcodGhpcy5kZXRhaWxWaWV3KTtcclxuICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICBkZXNjcmlwdG9yLCAvLyBrZWVwIGZvciBiYWNrd2FyZHMgY29tcGF0XHJcbiAgICAgIHRpdGxlOiBkZXNjcmlwdG9yLFxyXG4gICAgICBrZXksXHJcbiAgICAgIGZyb21Db250ZXh0OiB0aGlzLFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAoYWRkaXRpb25hbE9wdGlvbnMpIHtcclxuICAgICAgb3B0aW9ucyA9IGxhbmcubWl4aW4ob3B0aW9ucywgYWRkaXRpb25hbE9wdGlvbnMpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIHZpZXcuc2hvdyhvcHRpb25zKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhlbHBlciBtZXRob2QgZm9yIGxpc3QtYWN0aW9ucy4gTmF2aWdhdGVzIHRvIHRoZSBkZWZpbmVkIGB0aGlzLmVkaXRWaWV3YCBwYXNzaW5nIHRoZSBnaXZlbiBzZWxlY3Rpb25zIGBpZFByb3BlcnR5YFxyXG4gICAqIHByb3BlcnR5IGluIHRoZSBuYXZpZ2F0aW9uIG9wdGlvbnMgKHdoaWNoIGlzIHRoZW4gcmVxdWVzdGVkIGFuZCByZXN1bHQgdXNlZCBhcyBkZWZhdWx0IGRhdGEpLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBhY3Rpb24gQWN0aW9uIGluc3RhbmNlLCBub3QgdXNlZC5cclxuICAgKiBAcGFyYW0ge09iamVjdH0gc2VsZWN0aW9uIERhdGEgZW50cnkgZm9yIHRoZSBzZWxlY3Rpb24uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGFkZGl0aW9uYWxPcHRpb25zIEFkZGl0aW9uYWwgb3B0aW9ucyB0byBiZSBwYXNzZWQgaW50byB0aGUgbmV4dCB2aWV3LlxyXG4gICAqL1xyXG4gIG5hdmlnYXRlVG9FZGl0VmlldzogZnVuY3Rpb24gbmF2aWdhdGVUb0VkaXRWaWV3KGFjdGlvbiwgc2VsZWN0aW9uLCBhZGRpdGlvbmFsT3B0aW9ucykge1xyXG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLmdldFZpZXcodGhpcy5lZGl0VmlldyB8fCB0aGlzLmluc2VydFZpZXcpO1xyXG4gICAgY29uc3Qga2V5ID0gc2VsZWN0aW9uLmRhdGFbdGhpcy5pZFByb3BlcnR5XTtcclxuICAgIGxldCBvcHRpb25zID0ge1xyXG4gICAgICBrZXksXHJcbiAgICAgIHNlbGVjdGVkRW50cnk6IHNlbGVjdGlvbi5kYXRhLFxyXG4gICAgICBmcm9tQ29udGV4dDogdGhpcyxcclxuICAgIH07XHJcblxyXG4gICAgaWYgKGFkZGl0aW9uYWxPcHRpb25zKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBsYW5nLm1peGluKG9wdGlvbnMsIGFkZGl0aW9uYWxPcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICB2aWV3LnNob3cob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBOYXZpZ2F0ZXMgdG8gdGhlIGRlZmluZWQgYHRoaXMuaW5zZXJ0Vmlld2AsIG9yIGB0aGlzLmVkaXRWaWV3YCBwYXNzaW5nIHRoZSBjdXJyZW50IHZpZXdzIGlkIGFzIHRoZSBgcmV0dXJuVG9gXHJcbiAgICogb3B0aW9uIGFuZCBzZXR0aW5nIGBpbnNlcnRgIHRvIHRydWUuXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IGFkZGl0aW9uYWxPcHRpb25zIEFkZGl0aW9uYWwgb3B0aW9ucyB0byBiZSBwYXNzZWQgaW50byB0aGUgbmV4dCB2aWV3LlxyXG4gICAqL1xyXG4gIG5hdmlnYXRlVG9JbnNlcnRWaWV3OiBmdW5jdGlvbiBuYXZpZ2F0ZVRvSW5zZXJ0VmlldyhhZGRpdGlvbmFsT3B0aW9ucykge1xyXG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLmdldFZpZXcodGhpcy5pbnNlcnRWaWV3IHx8IHRoaXMuZWRpdFZpZXcpO1xyXG4gICAgbGV0IG9wdGlvbnMgPSB7XHJcbiAgICAgIHJldHVyblRvOiB0aGlzLmlkLFxyXG4gICAgICBpbnNlcnQ6IHRydWUsXHJcbiAgICB9O1xyXG5cclxuICAgIC8vIFBhc3MgYWxvbmcgdGhlIHNlbGVjdGVkIGVudHJ5IChyZWxhdGVkIGxpc3QgY291bGQgZ2V0IGl0IGZyb20gYSBxdWljayBhY3Rpb24pXHJcbiAgICBpZiAodGhpcy5vcHRpb25zLnNlbGVjdGVkRW50cnkpIHtcclxuICAgICAgb3B0aW9ucy5zZWxlY3RlZEVudHJ5ID0gdGhpcy5vcHRpb25zLnNlbGVjdGVkRW50cnk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFkZGl0aW9uYWxPcHRpb25zKSB7XHJcbiAgICAgIG9wdGlvbnMgPSBsYW5nLm1peGluKG9wdGlvbnMsIGFkZGl0aW9uYWxPcHRpb25zKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICB2aWV3LnNob3cob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEZXRlcmltaW5lcyBpZiB0aGVyZSBpcyBtb3JlIGRhdGEgdG8gYmUgc2hvd24uXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgbGlzdCBoYXMgbW9yZSBkYXRhOyBGYWxzZSBvdGhlcndpc2UuIERlZmF1bHQgaXMgdHJ1ZS5cclxuICAgKi9cclxuICBoYXNNb3JlRGF0YTogZnVuY3Rpb24gaGFzTW9yZURhdGEoKSB7fSxcclxuICBfc2V0TG9hZGluZzogZnVuY3Rpb24gX3NldExvYWRpbmcoKSB7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoJ2xpc3QtbG9hZGluZycpO1xyXG4gICAgdGhpcy5saXN0TG9hZGluZyA9IHRydWU7XHJcbiAgfSxcclxuICBfY2xlYXJMb2FkaW5nOiBmdW5jdGlvbiBfY2xlYXJMb2FkaW5nKCkge1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdsaXN0LWxvYWRpbmcnKTtcclxuICAgIHRoaXMubGlzdExvYWRpbmcgPSBmYWxzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEluaXRpYXRlcyB0aGUgZGF0YSByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIHJlcXVlc3REYXRhOiBmdW5jdGlvbiByZXF1ZXN0RGF0YSgpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcblxyXG4gICAgaWYgKCFzdG9yZSAmJiAhdGhpcy5fbW9kZWwpIHtcclxuICAgICAgY29uc29sZS53YXJuKCdFcnJvciByZXF1ZXN0aW5nIGRhdGEsIG5vIHN0b3JlIHdhcyBkZWZpbmVkLiBEaWQgeW91IG1lYW4gdG8gbWl4aW4gX1NEYXRhTGlzdE1peGluIHRvIHlvdXIgbGlzdCB2aWV3PycpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnNlYXJjaFdpZGdldCkge1xyXG4gICAgICB0aGlzLmN1cnJlbnRTZWFyY2hFeHByZXNzaW9uID0gdGhpcy5zZWFyY2hXaWRnZXQuZ2V0U2VhcmNoRXhwcmVzc2lvbigpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3NldExvYWRpbmcoKTtcclxuXHJcbiAgICBsZXQgcXVlcnlSZXN1bHRzO1xyXG4gICAgbGV0IHF1ZXJ5T3B0aW9ucyA9IHt9O1xyXG4gICAgbGV0IHF1ZXJ5RXhwcmVzc2lvbjtcclxuICAgIGlmICh0aGlzLl9tb2RlbCkge1xyXG4gICAgICAvLyBUb2RvOiBmaW5kIGEgYmV0dGVyIHdheSB0byB0cmFuc2ZlciB0aGlzIHN0YXRlLlxyXG4gICAgICB0aGlzLm9wdGlvbnMuY291bnQgPSB0aGlzLnBhZ2VTaXplO1xyXG4gICAgICB0aGlzLm9wdGlvbnMuc3RhcnQgPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgICBxdWVyeU9wdGlvbnMgPSB0aGlzLl9hcHBseVN0YXRlVG9RdWVyeU9wdGlvbnMocXVlcnlPcHRpb25zKSB8fCBxdWVyeU9wdGlvbnM7XHJcbiAgICAgIHF1ZXJ5RXhwcmVzc2lvbiA9IHRoaXMuX2J1aWxkUXVlcnlFeHByZXNzaW9uKCkgfHwgbnVsbDtcclxuICAgICAgcXVlcnlSZXN1bHRzID0gdGhpcy5yZXF1ZXN0RGF0YVVzaW5nTW9kZWwocXVlcnlFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcXVlcnlPcHRpb25zID0gdGhpcy5fYXBwbHlTdGF0ZVRvUXVlcnlPcHRpb25zKHF1ZXJ5T3B0aW9ucykgfHwgcXVlcnlPcHRpb25zO1xyXG4gICAgICBxdWVyeUV4cHJlc3Npb24gPSB0aGlzLl9idWlsZFF1ZXJ5RXhwcmVzc2lvbigpIHx8IG51bGw7XHJcbiAgICAgIHF1ZXJ5UmVzdWx0cyA9IHRoaXMucmVxdWVzdERhdGFVc2luZ1N0b3JlKHF1ZXJ5RXhwcmVzc2lvbiwgcXVlcnlPcHRpb25zKTtcclxuICAgIH1cclxuICAgICQud2hlbihxdWVyeVJlc3VsdHMpXHJcbiAgICAgIC5kb25lKChyZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgdGhpcy5fb25RdWVyeUNvbXBsZXRlKHF1ZXJ5UmVzdWx0cywgcmVzdWx0cyk7XHJcbiAgICAgIH0pXHJcbiAgICAgIC5mYWlsKCgpID0+IHtcclxuICAgICAgICB0aGlzLl9vblF1ZXJ5RXJyb3IocXVlcnlSZXN1bHRzLCBxdWVyeU9wdGlvbnMpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gcXVlcnlSZXN1bHRzO1xyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGFVc2luZ01vZGVsOiBmdW5jdGlvbiByZXF1ZXN0RGF0YVVzaW5nTW9kZWwocXVlcnlFeHByZXNzaW9uLCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSB7XHJcbiAgICAgIHJldHVyblF1ZXJ5UmVzdWx0czogdHJ1ZSxcclxuICAgICAgcXVlcnlNb2RlbE5hbWU6IHRoaXMucXVlcnlNb2RlbE5hbWUsXHJcbiAgICB9O1xyXG4gICAgbGFuZy5taXhpbihxdWVyeU9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgcmV0dXJuIHRoaXMuX21vZGVsLmdldEVudHJpZXMocXVlcnlFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnMpO1xyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGFVc2luZ1N0b3JlOiBmdW5jdGlvbiByZXF1ZXN0RGF0YVVzaW5nU3RvcmUocXVlcnlFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5nZXQoJ3N0b3JlJyk7XHJcbiAgICByZXR1cm4gc3RvcmUucXVlcnkocXVlcnlFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnMpO1xyXG4gIH0sXHJcbiAgcG9zdE1peEluUHJvcGVydGllczogZnVuY3Rpb24gcG9zdE1peEluUHJvcGVydGllcygpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHBvc3RNaXhJblByb3BlcnRpZXMsIGFyZ3VtZW50cyk7XHJcbiAgICB0aGlzLmNyZWF0ZUluZGljYXRvckxheW91dCgpO1xyXG4gIH0sXHJcbiAgZ2V0SXRlbUFjdGlvbktleTogZnVuY3Rpb24gZ2V0SXRlbUFjdGlvbktleShlbnRyeSkge1xyXG4gICAgcmV0dXJuIHRoaXMuZ2V0SWRlbnRpdHkoZW50cnkpO1xyXG4gIH0sXHJcbiAgZ2V0SXRlbURlc2NyaXB0b3I6IGZ1bmN0aW9uIGdldEl0ZW1EZXNjcmlwdG9yKGVudHJ5KSB7XHJcbiAgICByZXR1cm4gZW50cnkuJGRlc2NyaXB0b3IgfHwgZW50cnlbdGhpcy5sYWJlbFByb3BlcnR5XTtcclxuICB9LFxyXG4gIGdldEl0ZW1JY29uQ2xhc3M6IGZ1bmN0aW9uIGdldEl0ZW1JY29uQ2xhc3MoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5pdGVtSWNvbkNsYXNzO1xyXG4gIH0sXHJcbiAgZ2V0SXRlbUljb25Tb3VyY2U6IGZ1bmN0aW9uIGdldEl0ZW1JY29uU291cmNlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbUljb24gfHwgdGhpcy5pY29uO1xyXG4gIH0sXHJcbiAgZ2V0SXRlbUljb25BbHQ6IGZ1bmN0aW9uIGdldEl0ZW1JY29uQWx0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaXRlbUljb25BbHRUZXh0O1xyXG4gIH0sXHJcbiAgY3JlYXRlSW5kaWNhdG9yczogZnVuY3Rpb24gY3JlYXRlSW5kaWNhdG9ycyh0b3BJbmRpY2F0b3JzTm9kZSwgYm90dG9tSW5kaWNhdG9yc05vZGUsIGluZGljYXRvcnMsIGVudHJ5KSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5kaWNhdG9ycy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBpbmRpY2F0b3IgPSBpbmRpY2F0b3JzW2ldO1xyXG4gICAgICBjb25zdCBpY29uUGF0aCA9IGluZGljYXRvci5pY29uUGF0aCB8fCBzZWxmLml0ZW1JbmRpY2F0b3JJY29uUGF0aDtcclxuICAgICAgaWYgKGluZGljYXRvci5vbkFwcGx5KSB7XHJcbiAgICAgICAgdHJ5IHtcclxuICAgICAgICAgIGluZGljYXRvci5vbkFwcGx5KGVudHJ5LCBzZWxmKTtcclxuICAgICAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgICAgIGluZGljYXRvci5pc0VuYWJsZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICBpbmRpY2F0b3JJbmRleDogaSxcclxuICAgICAgICBpbmRpY2F0b3JJY29uOiBpbmRpY2F0b3IuaWNvbiA/IGljb25QYXRoICsgaW5kaWNhdG9yLmljb24gOiAnJyxcclxuICAgICAgICBpY29uQ2xzOiBpbmRpY2F0b3IuY2xzIHx8ICcnLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgY29uc3QgaW5kaWNhdG9yVGVtcGxhdGUgPSBpbmRpY2F0b3IudGVtcGxhdGUgfHwgc2VsZi5pdGVtSW5kaWNhdG9yVGVtcGxhdGU7XHJcblxyXG4gICAgICBsYW5nLm1peGluKGluZGljYXRvciwgb3B0aW9ucyk7XHJcblxyXG4gICAgICBpZiAoaW5kaWNhdG9yLmlzRW5hYmxlZCA9PT0gZmFsc2UpIHtcclxuICAgICAgICBpZiAoaW5kaWNhdG9yLmNscykge1xyXG4gICAgICAgICAgaW5kaWNhdG9yLmljb25DbHMgPSBgJHtpbmRpY2F0b3IuY2xzfSBkaXNhYmxlZGA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGluZGljYXRvci5pbmRpY2F0b3JJY29uID0gaW5kaWNhdG9yLmljb24gPyBgJHtpY29uUGF0aH1kaXNhYmxlZF8ke2luZGljYXRvci5pY29ufWAgOiAnJztcclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgaW5kaWNhdG9yLmluZGljYXRvckljb24gPSBpbmRpY2F0b3IuaWNvbiA/IGljb25QYXRoICsgaW5kaWNhdG9yLmljb24gOiAnJztcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGluZGljYXRvci5pc0VuYWJsZWQgPT09IGZhbHNlICYmIGluZGljYXRvci5zaG93SWNvbiA9PT0gZmFsc2UpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChzZWxmLml0ZW1JbmRpY2F0b3JTaG93RGlzYWJsZWQgfHwgaW5kaWNhdG9yLmlzRW5hYmxlZCkge1xyXG4gICAgICAgIGlmIChpbmRpY2F0b3IuaXNFbmFibGVkID09PSBmYWxzZSAmJiBpbmRpY2F0b3Iuc2hvd0ljb24gPT09IGZhbHNlKSB7XHJcbiAgICAgICAgICByZXR1cm47XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGNvbnN0IGluZGljYXRvckhUTUwgPSBpbmRpY2F0b3JUZW1wbGF0ZS5hcHBseShpbmRpY2F0b3IsIGluZGljYXRvci5pZCk7XHJcbiAgICAgICAgaWYgKGluZGljYXRvci5sb2NhdGlvbiA9PT0gJ3RvcCcpIHtcclxuICAgICAgICAgICQodG9wSW5kaWNhdG9yc05vZGUpLmFwcGVuZChpbmRpY2F0b3JIVE1MKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJChib3R0b21JbmRpY2F0b3JzTm9kZSkuYXBwZW5kKGluZGljYXRvckhUTUwpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgX29uUXVlcnlDb21wbGV0ZTogZnVuY3Rpb24gX29uUXVlcnlDb21wbGV0ZShxdWVyeVJlc3VsdHMsIGVudHJpZXMpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGNvbnN0IHN0YXJ0ID0gdGhpcy5wb3NpdGlvbjtcclxuXHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgJC53aGVuKHF1ZXJ5UmVzdWx0cy50b3RhbClcclxuICAgICAgICAgIC5kb25lKChyZXN1bHQpID0+IHtcclxuICAgICAgICAgICAgdGhpcy5fb25RdWVyeVRvdGFsKHJlc3VsdCk7XHJcbiAgICAgICAgICB9KVxyXG4gICAgICAgICAgLmZhaWwoKGVycm9yKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuX29uUXVlcnlUb3RhbEVycm9yKGVycm9yKTtcclxuICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAvKiB0b2RvOiBtb3ZlIHRvIGEgbW9yZSBhcHByb3ByaWF0ZSBsb2NhdGlvbiAqL1xyXG4gICAgICAgIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLmFsbG93RW1wdHlTZWxlY3Rpb24pIHtcclxuICAgICAgICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcygnbGlzdC1oYXMtZW1wdHktb3B0Jyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvKiByZW1vdmUgdGhlIGxvYWRpbmcgaW5kaWNhdG9yIHNvIHRoYXQgaXQgZG9lcyBub3QgZ2V0IHJlLXNob3duIHdoaWxlIHJlcXVlc3RpbmcgbW9yZSBkYXRhICovXHJcbiAgICAgICAgaWYgKHN0YXJ0ID09PSAwKSB7XHJcbiAgICAgICAgICAvLyBDaGVjayBlbnRyaWVzLmxlbmd0aCBzbyB3ZSBkb24ndCBjbGVhciBvdXQgdGhlIFwibm9EYXRhXCIgdGVtcGxhdGVcclxuICAgICAgICAgIGlmIChlbnRyaWVzICYmIGVudHJpZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB0aGlzLnNldCgnbGlzdENvbnRlbnQnLCAnJyk7XHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgJCh0aGlzLmxvYWRpbmdJbmRpY2F0b3JOb2RlKS5yZW1vdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHJvY2Vzc0RhdGEoZW50cmllcyk7XHJcbiAgICAgIH0gZmluYWxseSB7XHJcbiAgICAgICAgdGhpcy5fY2xlYXJMb2FkaW5nKCk7XHJcbiAgICAgICAgdGhpcy5pc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKCF0aGlzLl9vblNjcm9sbEhhbmRsZSAmJiB0aGlzLmNvbnRpbnVvdXNTY3JvbGxpbmcpIHtcclxuICAgICAgICB0aGlzLl9vblNjcm9sbEhhbmRsZSA9IHRoaXMuY29ubmVjdCh0aGlzLnNjcm9sbGVyTm9kZSwgJ29uc2Nyb2xsJywgdGhpcy5vblNjcm9sbCk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMub25Db250ZW50Q2hhbmdlKCk7XHJcbiAgICAgIGNvbm5lY3QucHVibGlzaCgnL2FwcC90b29sYmFyL3VwZGF0ZScsIFtdKTtcclxuXHJcbiAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCkge1xyXG4gICAgICAgIHRoaXMuX2xvYWRQcmV2aW91c1NlbGVjdGlvbnMoKTtcclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICBjb25zb2xlLmVycm9yKGUpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIHRoaXMuX2xvZ0Vycm9yKHtcclxuICAgICAgICBtZXNzYWdlOiBlLm1lc3NhZ2UsXHJcbiAgICAgICAgc3RhY2s6IGUuc3RhY2ssXHJcbiAgICAgIH0sIGUubWVzc2FnZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjcmVhdGVTdG9yZTogZnVuY3Rpb24gY3JlYXRlU3RvcmUoKSB7XHJcbiAgICByZXR1cm4gbnVsbDtcclxuICB9LFxyXG4gIG9uQ29udGVudENoYW5nZTogZnVuY3Rpb24gb25Db250ZW50Q2hhbmdlKCkge30sXHJcbiAgX3Byb2Nlc3NFbnRyeTogZnVuY3Rpb24gX3Byb2Nlc3NFbnRyeShlbnRyeSkge1xyXG4gICAgcmV0dXJuIGVudHJ5O1xyXG4gIH0sXHJcbiAgX29uUXVlcnlUb3RhbEVycm9yOiBmdW5jdGlvbiBfb25RdWVyeVRvdGFsRXJyb3IoZXJyb3IpIHtcclxuICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpO1xyXG4gIH0sXHJcbiAgX29uUXVlcnlUb3RhbDogZnVuY3Rpb24gX29uUXVlcnlUb3RhbChzaXplKSB7XHJcbiAgICB0aGlzLnRvdGFsID0gc2l6ZTtcclxuICAgIGlmIChzaXplID09PSAwKSB7XHJcbiAgICAgIHRoaXMuc2V0KCdsaXN0Q29udGVudCcsIHRoaXMubm9EYXRhVGVtcGxhdGUuYXBwbHkodGhpcykpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgcmVtYWluaW5nID0gdGhpcy5nZXRSZW1haW5pbmdDb3VudCgpO1xyXG4gICAgICBpZiAocmVtYWluaW5nICE9PSAtMSkge1xyXG4gICAgICAgIHRoaXMuc2V0KCdyZW1haW5pbmdDb250ZW50Jywgc3RyaW5nLnN1YnN0aXR1dGUodGhpcy5yZW1haW5pbmdUZXh0LCBbcmVtYWluaW5nXSkpO1xyXG4gICAgICAgIHRoaXMucmVtYWluaW5nID0gcmVtYWluaW5nO1xyXG4gICAgICB9XHJcblxyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkudG9nZ2xlQ2xhc3MoJ2xpc3QtaGFzLW1vcmUnLCAocmVtYWluaW5nID09PSAtMSB8fCByZW1haW5pbmcgPiAwKSk7XHJcblxyXG4gICAgICB0aGlzLnBvc2l0aW9uID0gdGhpcy5wb3NpdGlvbiArIHRoaXMucGFnZVNpemU7XHJcbiAgICB9XHJcbiAgfSxcclxuICBnZXRSZW1haW5pbmdDb3VudDogZnVuY3Rpb24gZ2V0UmVtYWluaW5nQ291bnQoKSB7XHJcbiAgICBjb25zdCByZW1haW5pbmcgPSB0aGlzLnRvdGFsID4gLTEgPyB0aGlzLnRvdGFsIC0gKHRoaXMucG9zaXRpb24gKyB0aGlzLnBhZ2VTaXplKSA6IC0xO1xyXG4gICAgcmV0dXJuIHJlbWFpbmluZztcclxuICB9LFxyXG4gIG9uQXBwbHlSb3dUZW1wbGF0ZTogZnVuY3Rpb24gb25BcHBseVJvd1RlbXBsYXRlKGVudHJ5LCByb3dOb2RlKSB7XHJcbiAgICB0aGlzLmFwcGx5Um93SW5kaWNhdG9ycyhlbnRyeSwgcm93Tm9kZSk7XHJcbiAgICB0aGlzLmluaXRSb3dRdWlja0FjdGlvbnMocm93Tm9kZSk7XHJcbiAgfSxcclxuICBpbml0Um93UXVpY2tBY3Rpb25zOiBmdW5jdGlvbiBpbml0Um93UXVpY2tBY3Rpb25zKHJvd05vZGUpIHtcclxuICAgIGlmICh0aGlzLmlzQ2FyZFZpZXcgJiYgdGhpcy52aXNpYmxlQWN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgLy8gaW5pdGlhbGl6ZSBwb3B1cG1lbnVzIG9uIGVhY2ggY2FyZFxyXG4gICAgICBjb25zdCBidG4gPSAkKHJvd05vZGUpLmZpbmQoJy5idG4tYWN0aW9ucycpO1xyXG4gICAgICAkKGJ0bikucG9wdXBtZW51KCk7XHJcbiAgICAgICQoYnRuKS5vbignYmVmb3Jlb3BlbicsIChldnQpID0+IHtcclxuICAgICAgICB0aGlzLnNlbGVjdEVudHJ5KHsga2V5OiBldnQudGFyZ2V0LmF0dHJpYnV0ZXNbJ2RhdGEta2V5J10udmFsdWUgfSk7XHJcbiAgICAgIH0pO1xyXG5cclxuICAgICAgLy8gVGhlIGNsaWNrIGhhbmRsZSBpbiB0aGUgcG9wdXAgc3RvcHMgcHJvcGFnYXRpb24gd2hpY2ggYnJlYWtzIG91ciBfQWN0aW9uTWl4aW4gY2xpY2sgaGFuZGxpbmdcclxuICAgICAgLy8gVGhpcyBqdXN0IHdyYXBzIHRoZSBzZWxlY3RlZCBlbGVtZW50IGluIHRoZSBwb3B1cCBzZWxlY3Rpb24gZXZlbnQgYW5kIHRyaWdnZXJzIHRoZVxyXG4gICAgICAvLyBfQWN0aW9uTWl4aW4gbWV0aG9kIG1hbnVhbGx5XHJcbiAgICAgICQoYnRuKS5vbignc2VsZWN0ZWQnLCAoZXZ0LCBhcmdzKSA9PiB7XHJcbiAgICAgICAgY29uc3Qgc2VsZWN0ZWQgPSBhcmdzICYmIGFyZ3NbMF07XHJcbiAgICAgICAgaWYgKCFzZWxlY3RlZCkge1xyXG4gICAgICAgICAgY29uc29sZS53YXJuKCdTb21ldGhpbmcgd2VudCB3cm9uZyBzZWxlY3RpbmcgYSBxdWljayBhY3Rpb24uJyk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgICAgIHJldHVybjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IGUgPSAkLkV2ZW50KCdjbGljaycsIHsgdGFyZ2V0OiBzZWxlY3RlZCB9KTtcclxuICAgICAgICB0aGlzLl9pbml0aWF0ZUFjdGlvbkZyb21FdmVudChlKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBwcm9jZXNzRGF0YTogZnVuY3Rpb24gcHJvY2Vzc0RhdGEoZW50cmllcykge1xyXG4gICAgaWYgKCFlbnRyaWVzKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBjb3VudCA9IGVudHJpZXMubGVuZ3RoO1xyXG5cclxuICAgIGlmIChjb3VudCA+IDApIHtcclxuICAgICAgY29uc3QgZG9jZnJhZyA9IGRvY3VtZW50LmNyZWF0ZURvY3VtZW50RnJhZ21lbnQoKTtcclxuICAgICAgbGV0IHJvdyA9IFtdO1xyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNvdW50OyBpKyspIHtcclxuICAgICAgICBjb25zdCBlbnRyeSA9IHRoaXMuX3Byb2Nlc3NFbnRyeShlbnRyaWVzW2ldKTtcclxuICAgICAgICAvLyBJZiBrZXkgY29tZXMgYmFjayB3aXRoIG5vdGhpbmcsIGNoZWNrIHRoYXQgdGhlIHN0b3JlIGlzIHByb3Blcmx5XHJcbiAgICAgICAgLy8gc2V0dXAgd2l0aCBhbiBpZFByb3BlcnR5XHJcbiAgICAgICAgdGhpcy5lbnRyaWVzW3RoaXMuZ2V0SWRlbnRpdHkoZW50cnksIGkpXSA9IGVudHJ5O1xyXG5cclxuICAgICAgICBjb25zdCByb3dOb2RlID0gdGhpcy5jcmVhdGVJdGVtUm93Tm9kZShlbnRyeSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLmlzQ2FyZFZpZXcgJiYgdGhpcy5tdWx0aUNvbHVtblZpZXcpIHtcclxuICAgICAgICAgIGNvbnN0IGNvbHVtbiA9ICQoYDxkaXYgY2xhc3M9XCIke3RoaXMubXVsdGlDb2x1bW5DbGFzc30gY29sdW1uc1wiPmApLmFwcGVuZChyb3dOb2RlKTtcclxuICAgICAgICAgIHJvdy5wdXNoKGNvbHVtbik7XHJcbiAgICAgICAgICBpZiAoKGkgKyAxKSAlIHRoaXMubXVsdGlDb2x1bW5Db3VudCA9PT0gMCB8fCBpID09PSBjb3VudCAtIDEpIHtcclxuICAgICAgICAgICAgY29uc3Qgcm93VGVtcGxhdGUgPSAkKCc8ZGl2IGNsYXNzPVwicm93XCI+PC9kaXY+Jyk7XHJcbiAgICAgICAgICAgIHJvdy5mb3JFYWNoKChlbGVtZW50KSA9PiB7XHJcbiAgICAgICAgICAgICAgcm93VGVtcGxhdGUuYXBwZW5kKGVsZW1lbnQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgZG9jZnJhZy5hcHBlbmRDaGlsZChyb3dUZW1wbGF0ZS5nZXQoMCkpO1xyXG4gICAgICAgICAgICByb3cgPSBbXTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZG9jZnJhZy5hcHBlbmRDaGlsZChyb3dOb2RlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgdGhpcy5vbkFwcGx5Um93VGVtcGxhdGUoZW50cnksIHJvd05vZGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAoZG9jZnJhZy5jaGlsZE5vZGVzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAkKHRoaXMuY29udGVudE5vZGUpLmFwcGVuZChkb2NmcmFnKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgY3JlYXRlSXRlbVJvd05vZGU6IGZ1bmN0aW9uIGNyZWF0ZUl0ZW1Sb3dOb2RlKGVudHJ5KSB7XHJcbiAgICBsZXQgcm93Tm9kZSA9IG51bGw7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAodGhpcy5pc0NhcmRWaWV3KSB7XHJcbiAgICAgICAgcm93Tm9kZSA9ICQodGhpcy5yb3dUZW1wbGF0ZS5hcHBseShlbnRyeSwgdGhpcykpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJvd05vZGUgPSAkKHRoaXMubGlSb3dUZW1wbGF0ZS5hcHBseShlbnRyeSwgdGhpcykpO1xyXG4gICAgICB9XHJcbiAgICB9IGNhdGNoIChlcnIpIHtcclxuICAgICAgY29uc29sZS5lcnJvcihlcnIpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIHJvd05vZGUgPSAkKHRoaXMucm93VGVtcGxhdGVFcnJvci5hcHBseShlbnRyeSwgdGhpcykpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHJvd05vZGUuZ2V0KDApO1xyXG4gIH0sXHJcbiAgZ2V0SWRlbnRpdHk6IGZ1bmN0aW9uIGdldElkZW50aXR5KGVudHJ5LCBkZWZhdWx0SWQpIHtcclxuICAgIGxldCBtb2RlbElkO1xyXG4gICAgbGV0IHN0b3JlSWQ7XHJcblxyXG4gICAgaWYgKHRoaXMuX21vZGVsKSB7XHJcbiAgICAgIG1vZGVsSWQgPSB0aGlzLl9tb2RlbC5nZXRFbnRpdHlJZChlbnRyeSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKG1vZGVsSWQpIHtcclxuICAgICAgcmV0dXJuIG1vZGVsSWQ7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmdldCgnc3RvcmUnKTtcclxuICAgIGlmIChzdG9yZSkge1xyXG4gICAgICBzdG9yZUlkID0gc3RvcmUuZ2V0SWRlbnRpdHkoZW50cnksIHRoaXMuaWRQcm9wZXJ0eSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHN0b3JlSWQpIHtcclxuICAgICAgcmV0dXJuIHN0b3JlSWQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGRlZmF1bHRJZDtcclxuICB9LFxyXG4gIF9sb2dFcnJvcjogZnVuY3Rpb24gX2xvZ0Vycm9yKGVycm9yLCBtZXNzYWdlKSB7XHJcbiAgICBjb25zdCBmcm9tQ29udGV4dCA9IHRoaXMub3B0aW9ucy5mcm9tQ29udGV4dDtcclxuICAgIHRoaXMub3B0aW9ucy5mcm9tQ29udGV4dCA9IG51bGw7XHJcbiAgICBjb25zdCBlcnJvckl0ZW0gPSB7XHJcbiAgICAgIHZpZXdPcHRpb25zOiB0aGlzLm9wdGlvbnMsXHJcbiAgICAgIHNlcnZlckVycm9yOiBlcnJvcixcclxuICAgIH07XHJcblxyXG4gICAgRXJyb3JNYW5hZ2VyLmFkZEVycm9yKG1lc3NhZ2UgfHwgdGhpcy5nZXRFcnJvck1lc3NhZ2UoZXJyb3IpLCBlcnJvckl0ZW0pO1xyXG4gICAgdGhpcy5vcHRpb25zLmZyb21Db250ZXh0ID0gZnJvbUNvbnRleHQ7XHJcbiAgfSxcclxuICBfb25RdWVyeUVycm9yOiBmdW5jdGlvbiBfb25RdWVyeUVycm9yKHF1ZXJ5T3B0aW9ucywgZXJyb3IpIHtcclxuICAgIHRoaXMuaGFuZGxlRXJyb3IoZXJyb3IpO1xyXG4gICAgdGhpcy5pc1JlZnJlc2hpbmcgPSBmYWxzZTtcclxuICB9LFxyXG4gIF9idWlsZFF1ZXJ5RXhwcmVzc2lvbjogZnVuY3Rpb24gX2J1aWxkUXVlcnlFeHByZXNzaW9uKCkge1xyXG4gICAgcmV0dXJuIGxhbmcubWl4aW4odGhpcy5xdWVyeSB8fCB7fSwgdGhpcy5vcHRpb25zICYmICh0aGlzLm9wdGlvbnMucXVlcnkgfHwgdGhpcy5vcHRpb25zLndoZXJlKSk7XHJcbiAgfSxcclxuICBfYXBwbHlTdGF0ZVRvUXVlcnlPcHRpb25zOiBmdW5jdGlvbiBfYXBwbHlTdGF0ZVRvUXVlcnlPcHRpb25zKHF1ZXJ5T3B0aW9ucykge1xyXG4gICAgcmV0dXJuIHF1ZXJ5T3B0aW9ucztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhhbmRsZXIgZm9yIHRoZSBtb3JlIGJ1dHRvbi4gU2ltcGx5IGNhbGxzIHtAbGluayAjcmVxdWVzdERhdGEgcmVxdWVzdERhdGF9IHdoaWNoIGFscmVhZHkgaGFzIHRoZSBpbmZvIGZvclxyXG4gICAqIHNldHRpbmcgdGhlIHN0YXJ0IGluZGV4IGFzIG5lZWRlZC5cclxuICAgKi9cclxuICBtb3JlOiBmdW5jdGlvbiBtb3JlKCkge1xyXG4gICAgaWYgKHRoaXMuY29udGludW91c1Njcm9sbGluZykge1xyXG4gICAgICB0aGlzLnNldCgncmVtYWluaW5nQ29udGVudCcsIHRoaXMubG9hZGluZ1RlbXBsYXRlLmFwcGx5KHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlcXVlc3REYXRhKCk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBIYW5kbGVyIGZvciB0aGUgbm9uZS9ubyBzZWxlY3Rpb24gYnV0dG9uIGlzIHByZXNzZWQuIFVzZWQgaW4gc2VsZWN0aW9uIHZpZXdzIHdoZW4gbm90IHNlbGVjdGluZyBpcyBhbiBvcHRpb24uXHJcbiAgICogSW52b2tlcyB0aGUgYHRoaXMub3B0aW9ucy5zaW5nbGVTZWxlY3RBY3Rpb25gIHRvb2wuXHJcbiAgICovXHJcbiAgZW1wdHlTZWxlY3Rpb246IGZ1bmN0aW9uIGVtcHR5U2VsZWN0aW9uKCkge1xyXG4gICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2xlYXIoKTtcclxuICAgIHRoaXMuX2xvYWRlZFNlbGVjdGlvbnMgPSB7fTtcclxuXHJcbiAgICBpZiAodGhpcy5hcHAuYmFycy50YmFyKSB7XHJcbiAgICAgIHRoaXMuYXBwLmJhcnMudGJhci5pbnZva2VUb29sKHtcclxuICAgICAgICB0b29sOiB0aGlzLm9wdGlvbnMuc2luZ2xlU2VsZWN0QWN0aW9uLFxyXG4gICAgICB9KTsgLy8gaW52b2tlIGFjdGlvbiBvZiB0b29sXHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBEZXRlcm1pbmVzIGlmIHRoZSB2aWV3IHNob3VsZCBiZSByZWZyZXNoIGJ5IGluc3BlY3RpbmcgYW5kIGNvbXBhcmluZyB0aGUgcGFzc2VkIG5hdmlnYXRpb24gb3B0aW9ucyB3aXRoIGN1cnJlbnQgdmFsdWVzLlxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIFBhc3NlZCBuYXZpZ2F0aW9uIG9wdGlvbnMuXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgdmlldyBzaG91bGQgYmUgcmVmcmVzaGVkLCBmYWxzZSBpZiBub3QuXHJcbiAgICovXHJcbiAgcmVmcmVzaFJlcXVpcmVkRm9yOiBmdW5jdGlvbiByZWZyZXNoUmVxdWlyZWRGb3Iob3B0aW9ucykge1xyXG4gICAgaWYgKHRoaXMub3B0aW9ucykge1xyXG4gICAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICAgIGlmICh0aGlzLmV4cGFuZEV4cHJlc3Npb24odGhpcy5vcHRpb25zLnN0YXRlS2V5KSAhPT0gdGhpcy5leHBhbmRFeHByZXNzaW9uKG9wdGlvbnMuc3RhdGVLZXkpKSB7XHJcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRoaXMuZXhwYW5kRXhwcmVzc2lvbih0aGlzLm9wdGlvbnMud2hlcmUpICE9PSB0aGlzLmV4cGFuZEV4cHJlc3Npb24ob3B0aW9ucy53aGVyZSkpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5leHBhbmRFeHByZXNzaW9uKHRoaXMub3B0aW9ucy5xdWVyeSkgIT09IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihvcHRpb25zLnF1ZXJ5KSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0aGlzLmV4cGFuZEV4cHJlc3Npb24odGhpcy5vcHRpb25zLnJlc291cmNlS2luZCkgIT09IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihvcHRpb25zLnJlc291cmNlS2luZCkpIHtcclxuICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodGhpcy5leHBhbmRFeHByZXNzaW9uKHRoaXMub3B0aW9ucy5yZXNvdXJjZVByZWRpY2F0ZSkgIT09IHRoaXMuZXhwYW5kRXhwcmVzc2lvbihvcHRpb25zLnJlc291cmNlUHJlZGljYXRlKSkge1xyXG4gICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuaW5oZXJpdGVkKHJlZnJlc2hSZXF1aXJlZEZvciwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdmlld3MgY29udGV4dCBieSBleHBhbmRpbmcgdXBvbiB0aGUge0BsaW5rIFZpZXcjZ2V0Q29udGV4dCBwYXJlbnQgaW1wbGVtZW50YXRpb259IHRvIGluY2x1ZGVcclxuICAgKiB0aGUgdmlld3MgcmVzb3VyY2VLaW5kLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gY29udGV4dC5cclxuICAgKi9cclxuICBnZXRDb250ZXh0OiBmdW5jdGlvbiBnZXRDb250ZXh0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuaW5oZXJpdGVkKGdldENvbnRleHQsIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFeHRlbmRzIHRoZSB7QGxpbmsgVmlldyNiZWZvcmVUcmFuc2l0aW9uVG8gcGFyZW50IGltcGxlbWVudGF0aW9ufSBieSBhbHNvIHRvZ2dsaW5nIHRoZSB2aXNpYmlsaXR5IG9mIHRoZSB2aWV3c1xyXG4gICAqIGNvbXBvbmVudHMgYW5kIGNsZWFyaW5nIHRoZSB2aWV3IGFuZCBzZWxlY3Rpb24gbW9kZWwgYXMgbmVlZGVkLlxyXG4gICAqL1xyXG4gIGJlZm9yZVRyYW5zaXRpb25UbzogZnVuY3Rpb24gYmVmb3JlVHJhbnNpdGlvblRvKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYmVmb3JlVHJhbnNpdGlvblRvLCBhcmd1bWVudHMpO1xyXG5cclxuICAgICQodGhpcy5kb21Ob2RlKS50b2dnbGVDbGFzcygnbGlzdC1oaWRlLXNlYXJjaCcsICh0aGlzLm9wdGlvbnMgJiYgdHlwZW9mIHRoaXMub3B0aW9ucy5oaWRlU2VhcmNoICE9PSAndW5kZWZpbmVkJykgPyB0aGlzLm9wdGlvbnMuaGlkZVNlYXJjaCA6IHRoaXMuaGlkZVNlYXJjaCB8fCAhdGhpcy5lbmFibGVTZWFyY2gpO1xyXG5cclxuICAgICQodGhpcy5kb21Ob2RlKS50b2dnbGVDbGFzcygnbGlzdC1zaG93LXNlbGVjdG9ycycsICF0aGlzLmlzU2VsZWN0aW9uRGlzYWJsZWQoKSAmJiAhdGhpcy5vcHRpb25zLnNpbmdsZVNlbGVjdCk7XHJcblxyXG4gICAgaWYgKHRoaXMuX3NlbGVjdGlvbk1vZGVsICYmICF0aGlzLmlzU2VsZWN0aW9uRGlzYWJsZWQoKSkge1xyXG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC51c2VTaW5nbGVTZWxlY3Rpb24odGhpcy5vcHRpb25zLnNpbmdsZVNlbGVjdCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0aGlzLm9wdGlvbnMuZW5hYmxlQWN0aW9ucyAhPT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgdGhpcy5lbmFibGVBY3Rpb25zID0gdGhpcy5vcHRpb25zLmVuYWJsZUFjdGlvbnM7XHJcbiAgICB9XHJcblxyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnRvZ2dsZUNsYXNzKCdsaXN0LXNob3ctYWN0aW9ucycsIHRoaXMuZW5hYmxlQWN0aW9ucyk7XHJcbiAgICBpZiAodGhpcy5lbmFibGVBY3Rpb25zKSB7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnVzZVNpbmdsZVNlbGVjdGlvbih0cnVlKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yZWZyZXNoUmVxdWlyZWQpIHtcclxuICAgICAgdGhpcy5jbGVhcigpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgLy8gaWYgZW5hYmxlZCwgY2xlYXIgYW55IHByZS1leGlzdGluZyBzZWxlY3Rpb25zXHJcbiAgICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCAmJiB0aGlzLmF1dG9DbGVhclNlbGVjdGlvbiAmJiAhdGhpcy5lbmFibGVBY3Rpb25zKSB7XHJcbiAgICAgICAgdGhpcy5fc2VsZWN0aW9uTW9kZWwuY2xlYXIoKTtcclxuICAgICAgICB0aGlzLl9sb2FkZWRTZWxlY3Rpb25zID0ge307XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgdGhlIHtAbGluayBWaWV3I3RyYW5zaXRpb25UbyBwYXJlbnQgaW1wbGVtZW50YXRpb259IHRvIGFsc28gY29uZmlndXJlIHRoZSBzZWFyY2ggd2lkZ2V0IGFuZFxyXG4gICAqIGxvYWQgcHJldmlvdXMgc2VsZWN0aW9ucyBpbnRvIHRoZSBzZWxlY3Rpb24gbW9kZWwuXHJcbiAgICovXHJcbiAgdHJhbnNpdGlvblRvOiBmdW5jdGlvbiB0cmFuc2l0aW9uVG8oKSB7XHJcbiAgICB0aGlzLmNvbmZpZ3VyZVNlYXJjaCgpO1xyXG5cclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCkge1xyXG4gICAgICB0aGlzLl9sb2FkUHJldmlvdXNTZWxlY3Rpb25zKCk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5pbmhlcml0ZWQodHJhbnNpdGlvblRvLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogR2VuZXJhdGVzIHRoZSBoYXNoIHRhZyBsYXlvdXQgYnkgdGFraW5nIHRoZSBoYXNoIHRhZ3MgZGVmaW5lZCBpbiBgdGhpcy5oYXNoVGFnUXVlcmllc2AgYW5kIGNvbnZlcnRpbmcgdGhlbVxyXG4gICAqIGludG8gaW5kaXZpZHVhbCBvYmplY3RzIGluIGFuIGFycmF5IHRvIGJlIHVzZWQgaW4gdGhlIGN1c3RvbWl6YXRpb24gZW5naW5lLlxyXG4gICAqIEByZXR1cm4ge09iamVjdFtdfVxyXG4gICAqL1xyXG4gIGNyZWF0ZUhhc2hUYWdRdWVyeUxheW91dDogZnVuY3Rpb24gY3JlYXRlSGFzaFRhZ1F1ZXJ5TGF5b3V0KCkge1xyXG4gICAgLy8gdG9kbzogYWx3YXlzIHJlZ2VuZXJhdGUgdGhpcyBsYXlvdXQ/IGFsd2F5cyByZWdlbmVyYXRpbmcgYWxsb3dzIGZvciBhbGwgZXhpc3RpbmcgY3VzdG9taXphdGlvbnNcclxuICAgIC8vIHRvIHN0aWxsIHdvcmssIGF0IGV4cGVuc2Ugb2YgcG90ZW50aWFsIChyYXJlKSBwZXJmb3JtYW5jZSBpc3N1ZXMgaWYgbWFueSBjdXN0b21pemF0aW9ucyBhcmUgcmVnaXN0ZXJlZC5cclxuICAgIGNvbnN0IGxheW91dCA9IFtdO1xyXG4gICAgZm9yIChjb25zdCBuYW1lIGluIHRoaXMuaGFzaFRhZ1F1ZXJpZXMpIHtcclxuICAgICAgaWYgKHRoaXMuaGFzaFRhZ1F1ZXJpZXMuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcclxuICAgICAgICBsYXlvdXQucHVzaCh7XHJcbiAgICAgICAgICBrZXk6IG5hbWUsXHJcbiAgICAgICAgICB0YWc6ICh0aGlzLmhhc2hUYWdRdWVyaWVzVGV4dCAmJiB0aGlzLmhhc2hUYWdRdWVyaWVzVGV4dFtuYW1lXSkgfHwgbmFtZSxcclxuICAgICAgICAgIHF1ZXJ5OiB0aGlzLmhhc2hUYWdRdWVyaWVzW25hbWVdLFxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGxheW91dDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxlZCB3aGVuIHRoZSB2aWV3IG5lZWRzIHRvIGJlIHJlc2V0LiBJbnZva2VzIHRoZSByZXF1ZXN0IGRhdGEgcHJvY2Vzcy5cclxuICAgKi9cclxuICByZWZyZXNoOiBmdW5jdGlvbiByZWZyZXNoKCkge1xyXG4gICAgaWYgKHRoaXMuaXNSZWZyZXNoaW5nKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIHRoaXMuY3JlYXRlQWN0aW9ucyh0aGlzLl9jcmVhdGVDdXN0b21pemVkTGF5b3V0KHRoaXMuY3JlYXRlU3lzdGVtQWN0aW9uTGF5b3V0KHRoaXMuY3JlYXRlQWN0aW9uTGF5b3V0KCkpLCAnYWN0aW9ucycpKTtcclxuICAgIHRoaXMuaXNSZWZyZXNoaW5nID0gdHJ1ZTtcclxuICAgIHRoaXMucXVlcnkgPSB0aGlzLmdldFNlYXJjaFF1ZXJ5KCkgfHwgdGhpcy5xdWVyeTtcclxuICAgIHRoaXMucmVxdWVzdERhdGEoKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENsZWFycyB0aGUgdmlldyBieTpcclxuICAgKlxyXG4gICAqICAqIGNsZWFyaW5nIHRoZSBzZWxlY3Rpb24gbW9kZWwsIGJ1dCB3aXRob3V0IGl0IGludm9raW5nIHRoZSBldmVudCBoYW5kbGVycztcclxuICAgKiAgKiBjbGVhcnMgdGhlIHZpZXdzIGRhdGEgc3VjaCBhcyBgdGhpcy5lbnRyaWVzYCBhbmQgYHRoaXMuZW50cmllc2A7XHJcbiAgICogICogY2xlYXJzIHRoZSBzZWFyY2ggd2lkdGggaWYgcGFzc2VkIHRydWU7IGFuZFxyXG4gICAqICAqIGFwcGxpZXMgdGhlIGRlZmF1bHQgdGVtcGxhdGUuXHJcbiAgICpcclxuICAgKiBAcGFyYW0ge0Jvb2xlYW59IGFsbCBJZiB0cnVlLCBhbHNvIGNsZWFyIHRoZSBzZWFyY2ggd2lkZ2V0LlxyXG4gICAqL1xyXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcihhbGwpIHtcclxuICAgIGlmICh0aGlzLl9zZWxlY3Rpb25Nb2RlbCkge1xyXG4gICAgICB0aGlzLl9zZWxlY3Rpb25Nb2RlbC5zdXNwZW5kRXZlbnRzKCk7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLmNsZWFyKCk7XHJcbiAgICAgIHRoaXMuX3NlbGVjdGlvbk1vZGVsLnJlc3VtZUV2ZW50cygpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX2xvYWRlZFNlbGVjdGlvbnMgPSB7fTtcclxuICAgIHRoaXMucmVxdWVzdGVkRmlyc3RQYWdlID0gZmFsc2U7XHJcbiAgICB0aGlzLmVudHJpZXMgPSB7fTtcclxuICAgIHRoaXMucG9zaXRpb24gPSAwO1xyXG5cclxuICAgIGlmICh0aGlzLl9vblNjcm9sbEhhbmRsZSkge1xyXG4gICAgICB0aGlzLmRpc2Nvbm5lY3QodGhpcy5fb25TY3JvbGxIYW5kbGUpO1xyXG4gICAgICB0aGlzLl9vblNjcm9sbEhhbmRsZSA9IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKGFsbCA9PT0gdHJ1ZSAmJiB0aGlzLnNlYXJjaFdpZGdldCkge1xyXG4gICAgICB0aGlzLnNlYXJjaFdpZGdldC5jbGVhcigpO1xyXG4gICAgICB0aGlzLnF1ZXJ5ID0gZmFsc2U7IC8vIHRvZG86IHJlbmFtZSB0byBzZWFyY2hRdWVyeVxyXG4gICAgICB0aGlzLmhhc1NlYXJjaGVkID0gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdsaXN0LWhhcy1tb3JlJyk7XHJcblxyXG4gICAgdGhpcy5zZXQoJ2xpc3RDb250ZW50JywgdGhpcy5sb2FkaW5nVGVtcGxhdGUuYXBwbHkodGhpcykpO1xyXG4gIH0sXHJcbiAgc2VhcmNoOiBmdW5jdGlvbiBzZWFyY2goKSB7XHJcbiAgICBpZiAodGhpcy5zZWFyY2hXaWRnZXQpIHtcclxuICAgICAgdGhpcy5zZWFyY2hXaWRnZXQuc2VhcmNoKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBxdWVyeSB2YWx1ZSBvbiB0aGUgc2VyYWNoIHdpZGdldFxyXG4gICAqL1xyXG4gIHNldFNlYXJjaFRlcm06IGZ1bmN0aW9uIHNldFNlYXJjaFRlcm0odmFsdWUpIHtcclxuICAgIGlmICh0aGlzLnNlYXJjaFdpZGdldCkge1xyXG4gICAgICB0aGlzLnNlYXJjaFdpZGdldC5zZXQoJ3F1ZXJ5VmFsdWUnLCB2YWx1ZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBSZXR1cm5zIGEgcHJvbWlzZSB3aXRoIHRoZSBsaXN0J3MgY291bnQuXHJcbiAgICovXHJcbiAgZ2V0TGlzdENvdW50OiBmdW5jdGlvbiBnZXRMaXN0Q291bnQoLyogb3B0aW9ucywgY2FsbGJhY2sqLykge30sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19