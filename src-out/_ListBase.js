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

  /**
   * @module argos/_ListBase
   */
  var resource = (0, _I18n2.default)('listBase');
  var resourceSDK = (0, _I18n2.default)('sdkApplication');

  var __class = (0, _declare2.default)('argos._ListBase', [_View2.default, _PullToRefreshMixin3.default], /** @lends module:argos/_ListBase.prototype */{
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
    widgetTemplate: new Simplate(['\n    <div id="{%= $.id %}" data-title="{%= $.titleText %}" class="list {%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>\n      <div data-columns="{%: $$.multiColumnCount %}" class="page-container scrollable{% if ($$.isNavigationDisabled()) { %} is-multiselect is-selectable is-toolbar-open {% } %} {% if (!$$.isCardView) { %} listview {% } %}"\n        {% if ($$.isNavigationDisabled()) { %}\n        data-selectable="multiple"\n        {% } else { %}\n        data-selectable="false"\n        {% } %}\n        data-dojo-attach-point="scrollerNode">\n          <div class="toolbar has-title-button" role="toolbar" aria-label="List Toolbar">\n            <div class="buttonset" data-dojo-attach-point="toolNode">\n              {% if($.enableSearch) { %}\n              <div data-dojo-attach-point="searchNode"></div>\n              {% } %}\n              {% if($.hasSettings) { %}\n              <button class="btn" title="{%= $.viewSettingsText %}" type="button" data-action="openSettings" aria-controls="list_toolbar_setting_{%= $.id %}">\n                <svg class="icon" role="presentation"><use xlink:href="#icon-settings"></use></svg>\n                <span class="audible">List Settings</span>\n              </button>\n              {% } %}\n            </div>\n          </div>\n          {% if ($$.isNavigationDisabled()) { %}\n          <div class="contextual-toolbar toolbar is-hidden">\n            <div class="buttonset">\n              <button class="btn-tertiary" title="Assign Selected Items" type="button">Assign</button>\n              <button class="btn-tertiary" id="remove" title="Remove Selected Items" type="button">Remove</button>\n            </div>\n          </div>\n          {% } %}\n        {%! $.emptySelectionTemplate %}\n        {% if ($$.isCardView) { %}\n          <div role="presentation" data-dojo-attach-point="contentNode"></div>\n        {% } else { %}\n          <ul class="list-content" role="presentation" data-dojo-attach-point="contentNode"></ul>\n        {% } %}\n        {%! $.moreTemplate %}\n      </div>\n    </div>\n    ']),
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
    listActionTemplate: new Simplate(['<ul id="popupmenu-{%= $$.getItemActionKey($) %}" data-dojo-attach-point="actionsNode" class="actions-row popupmenu">', '{%! $$.loadingTemplate %}', '</ul>']),
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

    currentPopupMenu: null,

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

    /**
      * @class
      * @alias module:argos/_ListBase
      * @classdesc A List View is a view used to display a collection of entries in an easy to skim list. The List View also has a
      * selection model built in for selecting rows from the list and may be used in a number of different manners.
      *
      * @extends module:argos/View
      * @mixes module:argos/_PullToRefreshMixin
      *
      * @param {Object} options
      */
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
      toolbar.toolbar({
        rightAligned: true
      });
      this.toolbar = toolbar.data('toolbar');
      $('[data-action=openSettings]', this.domNode).on('click', function () {
        if (_this.currentPopupMenu && _this.currentPopupMenu.isOpen) {
          _this.currentPopupMenu.close();
        }

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
        if (typeof actionRow === 'undefined') {
          throw new Error('The actions-row domNode is missing. Ensure your listActionTemplate has an "actions-row" className.');
        }

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
        $(btn).popupmenu({
          attachToBody: false
        });

        $(btn).on('beforeopen', function (evt) {
          _this7.selectEntry({ key: evt.target.attributes['data-key'].value });
          var popupmenu = $(btn).data('popupmenu');
          _this7.currentPopupMenu = popupmenu;
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