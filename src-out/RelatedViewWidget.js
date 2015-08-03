define('argos/RelatedViewWidget', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/event', 'dojo/on', 'dojo/string', 'dojo/dom-class', 'dojo/when', 'dojo/dom-construct', 'dojo/dom-attr', 'dojo/_base/connect', 'dojo/_base/array', './Store/SData', './_CustomizationMixin', './_ActionMixin', 'argos/_RelatedViewWidgetBase'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseEvent, _dojoOn, _dojoString, _dojoDomClass, _dojoWhen, _dojoDomConstruct, _dojoDomAttr, _dojo_baseConnect, _dojo_baseArray, _StoreSData, _CustomizationMixin2, _ActionMixin2, _argos_RelatedViewWidgetBase) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  /* see copyright file
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _event = _interopRequireDefault(_dojo_baseEvent);

  var _on = _interopRequireDefault(_dojoOn);

  var _string = _interopRequireDefault(_dojoString);

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _when = _interopRequireDefault(_dojoWhen);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _domAttr = _interopRequireDefault(_dojoDomAttr);

  var _connect = _interopRequireDefault(_dojo_baseConnect);

  var _array = _interopRequireDefault(_dojo_baseArray);

  var _SDataStore = _interopRequireDefault(_StoreSData);

  var _CustomizationMixin3 = _interopRequireDefault(_CustomizationMixin2);

  var _ActionMixin3 = _interopRequireDefault(_ActionMixin2);

  var _RelatedViewWidgetBase2 = _interopRequireDefault(_argos_RelatedViewWidgetBase);

  var __class = (0, _declare['default'])('argos.RelatedViewWidget', [_RelatedViewWidgetBase2['default'], _CustomizationMixin3['default'], _ActionMixin3['default']], {
    cls: 'related-view-widget',
    nodataText: 'no records found ...',
    selectMoreDataText: 'see ${0} more of ${1} ... ',
    selectMoreDataText2: 'see ${0} more ... ',
    navToListText: 'see list',
    loadingText: 'loading ... ',
    refreshViewText: 'refresh',
    itemOfCountText: ' ${0} of ${1}',
    totalCountText: ' (${0})',
    parentProperty: '$key',
    parentEntry: null,
    relatedProperty: '$key',
    relatedEntry: null,
    itemsNode: null,
    loadingNode: null,
    id: 'related-view',
    titleText: 'Related View',
    detailViewId: null,
    listViewId: null,
    listViewWhere: null,
    enabled: false,
    parentCollection: false,
    parentCollectionProperty: null,
    resourceKind: null,
    contractName: null,
    select: null,
    where: null,
    sort: null,
    store: null,
    relatedData: null,
    queryOptions: null,
    isLoaded: false,
    autoLoad: false,
    wait: false,
    startIndex: 1,
    pageSize: 3,
    relatedResults: null,
    itemCount: 0,
    _isInitLoad: true,
    showTab: true,
    showTotalInTab: true,
    showSelectMore: false,
    hideWhenNoData: false,
    enableActions: true,
    _subscribes: null,
    /**
     * @property {Simplate}
     * Simple that defines the HTML Markup
     */
    relatedContentTemplate: new Simplate(['<div  id="tab" data-dojo-attach-point="tabNode" class="', '{% if ($.autoLoad) { %}', 'tab ', '{% } else { %}', 'tab collapsed ', '{% } %}', '" >', '<div class="tab-items">', '{%! $$.relatedViewTabItemsTemplate %}', '</div>', '</div>', '<div class="panel">', '<div data-dojo-attach-point="actionsNode" class="action-items"></div>', '<div data-dojo-attach-point="headereNode" class="header">', '{%! $$.relatedViewHeaderTemplate %}', '</div>', '<div  data-dojo-attach-point="relatedViewNode"></div>', '<div data-dojo-attach-point="footerNode" class="footer">', '{%! $$.relatedViewFooterTemplate %}', '</div>', '</div>']),
    nodataTemplate: new Simplate(['<div class="nodata"> {%: $$.nodataText %}</div>']),
    relatedViewTabItemsTemplate: new Simplate(['<span class="tab-item">', '<div class="tab-icon" data-dojo-attach-event="onclick:onNavigateToList">', '<img src="{%= $.icon %}" alt="{%= $.title %}" />', '</div>', '<div data-dojo-attach-point="titleNode" data-dojo-attach-event="onclick:toggleView"  class="title" >{%: ($.title ) %} </div>', '</span>', '<div class="line-bar"></div>']),
    relatedViewHeaderTemplate: new Simplate(['']),
    relatedViewFooterTemplate: new Simplate(['<div  data-dojo-attach-point="selectMoreNode" class="action" data-dojo-attach-event="onclick:onSelectMoreData"></div>', '<div  data-dojo-attach-point="navtoListFooterNode" class="action" data-dojo-attach-event="onclick:onNavigateToList">{%: $$.navToListText %}</div>']),
    relatedViewRowTemplate: new Simplate(['<div class="row {%: $$.cls %}"  data-relatedkey="{%: $.$key %}" data-descriptor="{%: $.$descriptor %}">', '<div class="item">', '{%! $$.relatedItemTemplate %}', '</div>', '</div>']),
    relatedItemIconTemplate: new Simplate(['<img src="{%: $$.itemIcon %}" />']),
    relatedItemHeaderTemplate: new Simplate(['<div>{%: $.$descriptor %}</div>']),
    relatedItemDetailTemplate: new Simplate(['<div></div>']),
    relatedItemFooterTemplate: new Simplate(['<div></div>']),
    relatedItemTemplate: new Simplate(['<div class="item-icon">', '{%! $$.relatedItemIconTemplate %}', '</div>', '<div class="item-header">', '{%! $$.relatedItemHeaderTemplate %}', '</div>', '<div class="item-detail">', '{%! $$.relatedItemDetailTemplate %}', '</div>', '<div class="item-footer">', '{%! $$.relatedItemFooterTemplate %}', '</div>']),
    loadingTemplate: new Simplate(['<div class="loading-indicator"><div>{%= $.loadingText %}</div></div>']),

    relatedActionTemplate: new Simplate(['<span class="action-item" data-id="{%= $.actionIndex %}">', '<img src="{%= $.icon %}" alt="{%= $.label %}" />', '</span>']),
    constructor: function constructor(options) {
      _lang['default'].mixin(this, options);
      if (this.titleText) {
        this.title = this.titleText;
      }

      this._subscribes = [];
      this._subscribes.push(_connect['default'].subscribe('/app/refresh', this, this._onAppRefresh));
    },
    postCreate: function postCreate() {
      if (!this.showTab && this.tabNode) {
        _domClass['default'].toggle(this.tabNode, 'hidden');
      }
      if (this.enableActions) {
        this.createActions(this._createCustomizedLayout(this.createActionLayout(), 'relatedview-actions'));
      }
    },
    createActionLayout: function createActionLayout() {
      return this.actions || (this.actions = [{
        id: 'refresh',
        cls: 'fa fa-refresh fa-2x',
        label: this.refreshViewText,
        action: 'onRefreshView',
        isEnabled: true
      }, {
        id: 'navtoListView',
        label: this.viewContactsActionText,
        cls: 'fa fa-list fa-2x',
        action: 'onNavigateToList',
        isEnabled: true,
        fn: this.onNavigateToList.bind(this)
      }]);
    },
    createActions: function createActions(actions) {
      for (var i = 0; i < actions.length; i++) {
        var action = actions[i];
        var options = {
          actionIndex: i
        };
        _lang['default'].mixin(action, options);
        var actionTemplate = action.template || this.relatedActionTemplate;
        var actionNode = _domConstruct['default'].toDom(actionTemplate.apply(action, action.id));
        (0, _on['default'])(actionNode, 'click', this.onInvokeActionItem.bind(this));
        _domConstruct['default'].place(actionNode, this.actionsNode, 'last');
      }

      this.actions = actions;
    },
    onInvokeActionItem: function onInvokeActionItem(evt) {
      var index = evt.currentTarget.attributes['data-id'].value;
      var action = this.actions[index];
      if (action) {
        if (action.isEnabled) {
          if (action.fn) {
            action.fn.call(action.scope || this, action);
          } else {
            if (typeof this[action.action] === 'function') {
              this[action.action](evt);
            }
          }
        }
      }
      _event['default'].stop(evt);
    },
    getStore: function getStore() {
      var store = new _SDataStore['default']({
        service: App.getService(),
        resourceKind: this.resourceKind,
        contractName: this.contractName,
        scope: this
      });
      return store;
    },
    getQueryOptions: function getQueryOptions() {
      var whereExpression = '';
      if (this.hasOwnProperty('where')) {
        if (typeof this.where === 'function') {
          whereExpression = this.where(this.parentEntry);
        } else {
          whereExpression = this.where;
        }
      }

      var queryOptions = {
        count: this.pageSize || 1,
        start: 0,
        select: this.select || '',
        where: whereExpression,
        sort: this.sort || ''
      };

      return queryOptions;
    },
    fetchData: function fetchData() {
      if (this.startIndex < 1) {
        this.startIndex = 1;
      }
      this.queryOptions.start = this.startIndex - 1;
      var queryResults = this.store.query(null, this.queryOptions);
      this.startIndex = this.startIndex > 0 && this.pageSize > 0 ? this.startIndex + this.pageSize : 1;
      return queryResults;
    },
    onInit: function onInit() {
      this._isInitLoad = true;
      this.store = this.store || this.getStore();
      this.queryOptions = this.queryOptions || this.getQueryOptions();

      if (this.autoLoad) {
        this.onLoad();
      }
    },
    onLoad: function onLoad() {
      var data = undefined;
      if (this.relatedData) {
        if (typeof this.relatedData === 'function') {
          data = this.relatedData(this.parentEntry);
        } else {
          data = this.relatedData;
        }
        if (data) {
          this.relatedResults = {
            total: data.length
          };
          this.pageSize = data.length;
          this.onApply(data);
        }
      } else if (this.parentCollection) {
        this.relatedResults = {
          total: this.parentEntry[this.parentCollectionProperty].$resources.length
        };
        this.pageSize = this.relatedResults.total;
        this.onApply(this.parentEntry[this.parentCollectionProperty].$resources);
      } else {
        if (!this.loadingNode) {
          this.loadingNode = _domConstruct['default'].toDom(this.loadingTemplate.apply(this));
          _domConstruct['default'].place(this.loadingNode, this.relatedViewNode, 'last', this);
        }
        _domClass['default'].toggle(this.loadingNode, 'loading');
        if (this.wait) {
          return;
        }
        this.relatedResults = this.fetchData();
        (function (context, relatedResults) {
          try {
            (0, _when['default'])(relatedResults, (function success(relatedFeed) {
              this.onApply(relatedFeed);
            }).bind(context));
          } catch (error) {
            console.log('Error fetching related view data:' + error); //eslint-disable-line
          }
        })(this, this.relatedResults);
      }
      this.isLoaded = true;
    },
    onApply: function onApply(relatedFeed) {
      try {
        if (!this.itemsNode) {
          this.itemsNode = _domConstruct['default'].toDom("<div id='itemsNode' class='items'><div>");
          _domConstruct['default'].place(this.itemsNode, this.relatedViewNode, 'last', this);
        }

        if (relatedFeed.length > 0) {
          var moreData = undefined;
          _domClass['default'].remove(this.containerNode, 'hidden');
          _domClass['default'].remove(this.tabNode, 'collapsed');
          this.itemCount = this.itemCount + relatedFeed.length;
          var restCount = this.relatedResults.total - this.itemCount;
          if (restCount > 0) {
            var moreCount = restCount >= this.pageSize ? this.pageSize : restCount;
            moreData = _string['default'].substitute(this.selectMoreDataText, [moreCount, this.relatedResults.total]);
          } else {
            moreData = '';
          }

          if (this.showSelectMore) {
            _domAttr['default'].set(this.selectMoreNode, {
              innerHTML: moreData
            });
          } else {
            _domAttr['default'].set(this.selectMoreNode, {
              innerHTML: ''
            });
          }

          if (this.showTotalInTab) {
            _domAttr['default'].set(this.titleNode, {
              innerHTML: this.title + '  ' + _string['default'].substitute(this.totalCountText, [this.relatedResults.total])
            });
          }
          for (var i = 0; i < relatedFeed.length; i++) {
            var itemEntry = relatedFeed[i];
            itemEntry.$descriptor = itemEntry.$descriptor || relatedFeed.$descriptor;
            var itemHTML = this.relatedViewRowTemplate.apply(itemEntry, this);
            var itemNode = _domConstruct['default'].toDom(itemHTML);
            (0, _on['default'])(itemNode, 'click', this.onSelectViewRow.bind(this));
            _domConstruct['default'].place(itemNode, this.itemsNode, 'last', this);
          }
        } else {
          if (this.hideWhenNoData) {
            _domClass['default'].add(this.containerNode, 'hidden');
          } else {
            _domClass['default'].remove(this.containerNode, 'hidden');
          }
          _domConstruct['default'].place(this.nodataTemplate.apply(this.parentEntry, this), this.itemsNode, 'last');
          if (this.showTotalInTab) {
            _domAttr['default'].set(this.titleNode, {
              innerHTML: this.title + '  ' + _string['default'].substitute(this.totalCountText, [0, 0])
            });
          }
          _domAttr['default'].set(this.selectMoreNode, {
            innerHTML: ''
          });
          if (this._isInitLoad) {
            this._isInitLoad = false;
            _domClass['default'].toggle(this.tabNode, 'collapsed');
          }
        }
        _domClass['default'].toggle(this.loadingNode, 'loading');
      } catch (error) {
        console.log('Error applying data for related view widget:' + error); //eslint-disable-line
      }
    },
    toggleView: function toggleView(evt) {
      _domClass['default'].toggle(this.tabNode, 'collapsed');

      if (!this.isLoaded) {
        this.onLoad();
      }
      evt.stopPropagation();
    },
    onSelectViewRow: function onSelectViewRow(evt) {
      var relatedKey = evt.currentTarget.attributes['data-relatedkey'].value;
      var descriptor = evt.currentTarget.attributes['data-descriptor'].value;

      var options = {
        descriptor: descriptor,
        key: relatedKey,
        title: descriptor
      };

      var view = App.getView(this.detailViewId);
      if (view) {
        view.show(options);
      }
      evt.stopPropagation();
    },
    onNavigateToList: function onNavigateToList(evt) {
      var whereExpression = undefined;
      if (this.hasOwnProperty('listViewWhere')) {
        if (typeof this.listViewWhere === 'function') {
          whereExpression = this.listViewWhere(this.parentEntry);
        } else {
          whereExpression = this.listViewWhere;
        }
      } else {
        if (this.hasOwnProperty('where')) {
          if (typeof this.where === 'function') {
            whereExpression = this.where(this.parentEntry);
          } else {
            whereExpression = this.where;
          }
        }
      }

      var options = {
        descriptor: this.title,
        where: whereExpression,
        title: this.title
      };

      var view = App.getView(this.listViewId);
      if (view) {
        view.show(options);
      }
      evt.stopPropagation();
    },
    onSelectMoreData: function onSelectMoreData(evt) {
      this.onLoad();
      evt.stopPropagation();
    },
    onRefreshView: function onRefreshView(evt) {
      this._onRefreshView();
      evt.stopPropagation();
    },
    _onRefreshView: function _onRefreshView() {
      if (this.itemsNode) {
        _domConstruct['default'].destroy(this.itemsNode);
        this.itemsNode = null;
      }
      this.startIndex = 1;
      this.itemCount = 0;
      this.isLoaded = false;
      this.onLoad();
    },
    _onAppRefresh: function _onAppRefresh(data) {
      if (data && data.data) {
        if (data.resourceKind === this.resourceKind) {
          if (this.parentEntry && this.parentEntry[this.parentProperty] === data.data[this.relatedProperty]) {
            this._onRefreshView();
          }
        }
      }
    },
    destroy: function destroy() {
      _array['default'].forEach(this._subscribes, function (handle) {
        _connect['default'].unsubscribe(handle);
      });
      this.inherited(arguments);
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.RelatedViewWidget', __class);
  module.exports = __class;
});
