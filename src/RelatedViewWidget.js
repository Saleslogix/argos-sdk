/* see copyright file
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import event from 'dojo/_base/event';
import on from 'dojo/on';
import string from 'dojo/string';
import domClass from 'dojo/dom-class';
import when from 'dojo/when';
import domConstruct from 'dojo/dom-construct';
import domAttr from 'dojo/dom-attr';
import connect from 'dojo/_base/connect';
import array from 'dojo/_base/array';
import SDataStore from './Store/SData';
import _CustomizationMixin from './_CustomizationMixin';
import _ActionMixin from './_ActionMixin';
import _RelatedViewWidgetBase from 'argos/_RelatedViewWidgetBase';
import getResource from './I18n';

const resource = getResource('relatedViewWidget');

const __class = declare('argos.RelatedViewWidget', [_RelatedViewWidgetBase, _CustomizationMixin, _ActionMixin], {
  cls: 'related-view-widget',
  nodataText: resource.nodataText,
  selectMoreDataText: resource.selectMoreDataText,
  selectMoreDataText2: resource.selectMoreDataText2,
  navToListText: resource.navToListText,
  loadingText: resource.loadingText,
  refreshViewText: resource.refreshViewText,
  itemOfCountText: resource.itemOfCountText,
  totalCountText: resource.totalCountText,
  titleText: resource.titleText,
  parentProperty: '$key',
  parentEntry: null,
  relatedProperty: '$key',
  relatedEntry: null,
  itemsNode: null,
  loadingNode: null,
  id: 'related-view',
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
  relatedContentTemplate: new Simplate([
    '<div  id="tab" data-dojo-attach-point="tabNode" class="',
    '{% if ($.autoLoad) { %}',
    'tab ',
    '{% } else { %}',
    'tab collapsed ',
    '{% } %}',
    '" >',
    '<div class="tab-items">',
    '{%! $$.relatedViewTabItemsTemplate %}',
    '</div>',
    '</div>',
    '<div class="panel">',
    '<div data-dojo-attach-point="actionsNode" class="action-items"></div>',
    '<div data-dojo-attach-point="headereNode" class="header">',
    '{%! $$.relatedViewHeaderTemplate %}',
    '</div>',
    '<div  data-dojo-attach-point="relatedViewNode"></div>',
    '<div data-dojo-attach-point="footerNode" class="footer">',
    '{%! $$.relatedViewFooterTemplate %}',
    '</div>',
    '</div>',
  ]),
  nodataTemplate: new Simplate([
    '<div class="nodata"> {%: $$.nodataText %}</div>',
  ]),
  relatedViewTabItemsTemplate: new Simplate([
    '<span class="tab-item">',
    '<div class="tab-icon" data-dojo-attach-event="onclick:onNavigateToList">',
    '<img src="{%= $.icon %}" alt="{%= $.title %}" />',
    '</div>',
    '<div data-dojo-attach-point="titleNode" data-dojo-attach-event="onclick:toggleView"  class="title" >{%: ($.title ) %} </div>',
    '</span>',
    '<div class="line-bar"></div>',
  ]),
  relatedViewHeaderTemplate: new Simplate([
    '',
  ]),
  relatedViewFooterTemplate: new Simplate([
    '<div  data-dojo-attach-point="selectMoreNode" class="action" data-dojo-attach-event="onclick:onSelectMoreData"></div>',
    '<div  data-dojo-attach-point="navtoListFooterNode" class="action" data-dojo-attach-event="onclick:onNavigateToList">{%: $$.navToListText %}</div>',

  ]),
  relatedViewRowTemplate: new Simplate([
    '<div class="row {%: $$.cls %}"  data-relatedkey="{%: $.$key %}" data-descriptor="{%: $.$descriptor %}">',
    '<div class="item">',
    '{%! $$.relatedItemTemplate %}',
    '</div>',
    '</div>',
  ]),
  relatedItemIconTemplate: new Simplate([
    '<img src="{%: $$.itemIcon %}" />',
  ]),
  relatedItemHeaderTemplate: new Simplate([
    '<div>{%: $.$descriptor %}</div>',
  ]),
  relatedItemDetailTemplate: new Simplate([
    '<div></div>',
  ]),
  relatedItemFooterTemplate: new Simplate([
    '<div></div>',
  ]),
  relatedItemTemplate: new Simplate([
    '<div class="item-icon">',
    '{%! $$.relatedItemIconTemplate %}',
    '</div>',
    '<div class="item-header">',
    '{%! $$.relatedItemHeaderTemplate %}',
    '</div>',
    '<div class="item-detail">',
    '{%! $$.relatedItemDetailTemplate %}',
    '</div>',
    '<div class="item-footer">',
    '{%! $$.relatedItemFooterTemplate %}',
    '</div>',
  ]),
  loadingTemplate: new Simplate([
    '<div class="busyIndicator__container busyIndicator--active" aria-live="polite">',
      '<div class="busyIndicator busyIndicator--large">',
        '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--one"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--two"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--three"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--four"></div>',
        '<div class="busyIndicator__bar busyIndicator__bar--large busyIndicator__bar--five"></div>',
      '</div>',
      '<span class="busyIndicator__label">{%: $.loadingText %}</span>',
    '</div>',
  ]),

  relatedActionTemplate: new Simplate([
    '<span class="action-item" data-id="{%= $.actionIndex %}">',
    '<img src="{%= $.icon %}" alt="{%= $.label %}" />',
    '</span>',
  ]),
  constructor: function constructor(options) {
    lang.mixin(this, options);
    if (this.titleText) {
      this.title = this.titleText;
    }

    this._subscribes = [];
    this._subscribes.push(connect.subscribe('/app/refresh', this, this._onAppRefresh));
  },
  postCreate: function postCreate() {
    if ((!this.showTab) && (this.tabNode)) {
      domClass.toggle(this.tabNode, 'hidden');
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
      isEnabled: true,
    }, {
      id: 'navtoListView',
      label: this.viewContactsActionText,
      cls: 'fa fa-list fa-2x',
      action: 'onNavigateToList',
      isEnabled: true,
      fn: this.onNavigateToList.bind(this),
    }]);
  },
  createActions: function createActions(actions) {
    for (let i = 0; i < actions.length; i++) {
      const action = actions[i];
      const options = {
        actionIndex: i,
      };
      lang.mixin(action, options);
      const actionTemplate = action.template || this.relatedActionTemplate;
      const actionNode = domConstruct.toDom(actionTemplate.apply(action, action.id));
      on(actionNode, 'click', this.onInvokeActionItem.bind(this));
      domConstruct.place(actionNode, this.actionsNode, 'last');
    }

    this.actions = actions;
  },
  onInvokeActionItem: function onInvokeActionItem(evt) {
    const index = evt.currentTarget.attributes['data-id'].value;
    const action = this.actions[index];
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
    event.stop(evt);
  },
  getStore: function getStore() {
    const store = new SDataStore({
      service: App.getService(),
      resourceKind: this.resourceKind,
      contractName: this.contractName,
      scope: this,
    });
    return store;
  },
  getQueryOptions: function getQueryOptions() {
    let whereExpression = '';
    if (this.hasOwnProperty('where')) {
      if (typeof this.where === 'function') {
        whereExpression = this.where(this.parentEntry);
      } else {
        whereExpression = this.where;
      }
    }

    const queryOptions = {
      count: this.pageSize || 1,
      start: 0,
      select: this.select || '',
      where: whereExpression,
      sort: this.sort || '',
    };

    return queryOptions;
  },
  fetchData: function fetchData() {
    if (this.startIndex < 1) {
      this.startIndex = 1;
    }
    this.queryOptions.start = this.startIndex - 1;
    const queryResults = this.store.query(null, this.queryOptions);
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
    let data;
    if (this.relatedData) {
      if (typeof this.relatedData === 'function') {
        data = this.relatedData(this.parentEntry);
      } else {
        data = this.relatedData;
      }
      if (data) {
        this.relatedResults = {
          total: data.length,
        };
        this.pageSize = data.length;
        this.onApply(data);
      }
    } else if (this.parentCollection) {
      this.relatedResults = {
        total: this.parentEntry[this.parentCollectionProperty].$resources.length,
      };
      this.pageSize = this.relatedResults.total;
      this.onApply(this.parentEntry[this.parentCollectionProperty].$resources);
    } else {
      if (!this.loadingNode) {
        this.loadingNode = domConstruct.toDom(this.loadingTemplate.apply(this));
        domConstruct.place(this.loadingNode, this.relatedViewNode, 'last', this);
      }
      domClass.toggle(this.loadingNode, 'loading');
      if (this.wait) {
        return;
      }
      this.relatedResults = this.fetchData();
      ((context, relatedResults) => {
        try {
          when(relatedResults, function success(relatedFeed) {
            this.onApply(relatedFeed);
          }.bind(context));
        } catch (error) {
          console.log('Error fetching related view data:' + error);//eslint-disable-line
        }
      })(this, this.relatedResults);
    }
    this.isLoaded = true;
  },
  onApply: function onApply(relatedFeed) {
    try {
      if (!this.itemsNode) {
        this.itemsNode = domConstruct.toDom("<div id='itemsNode' class='items'><div>");
        domConstruct.place(this.itemsNode, this.relatedViewNode, 'last', this);
      }

      if (relatedFeed.length > 0) {
        let moreData;
        domClass.remove(this.containerNode, 'hidden');
        domClass.remove(this.tabNode, 'collapsed');
        this.itemCount = this.itemCount + relatedFeed.length;
        const restCount = this.relatedResults.total - this.itemCount;
        if (restCount > 0) {
          const moreCount = (restCount >= this.pageSize) ? this.pageSize : restCount;
          moreData = string.substitute(this.selectMoreDataText, [moreCount, this.relatedResults.total]);
        } else {
          moreData = '';
        }

        if (this.showSelectMore) {
          domAttr.set(this.selectMoreNode, {
            innerHTML: moreData,
          });
        } else {
          domAttr.set(this.selectMoreNode, {
            innerHTML: '',
          });
        }

        if (this.showTotalInTab) {
          domAttr.set(this.titleNode, {
            innerHTML: this.title + '  ' + string.substitute(this.totalCountText, [this.relatedResults.total]),
          });
        }
        for (let i = 0; i < relatedFeed.length; i++) {
          const itemEntry = relatedFeed[i];
          itemEntry.$descriptor = itemEntry.$descriptor || relatedFeed.$descriptor;
          const itemHTML = this.relatedViewRowTemplate.apply(itemEntry, this);
          const itemNode = domConstruct.toDom(itemHTML);
          on(itemNode, 'click', this.onSelectViewRow.bind(this));
          domConstruct.place(itemNode, this.itemsNode, 'last', this);
        }
      } else {
        if (this.hideWhenNoData) {
          domClass.add(this.containerNode, 'hidden');
        } else {
          domClass.remove(this.containerNode, 'hidden');
        }
        domConstruct.place(this.nodataTemplate.apply(this.parentEntry, this), this.itemsNode, 'last');
        if (this.showTotalInTab) {
          domAttr.set(this.titleNode, {
            innerHTML: this.title + '  ' + string.substitute(this.totalCountText, [0, 0]),
          });
        }
        domAttr.set(this.selectMoreNode, {
          innerHTML: '',
        });
        if (this._isInitLoad) {
          this._isInitLoad = false;
          domClass.toggle(this.tabNode, 'collapsed');
        }
      }
      domClass.toggle(this.loadingNode, 'loading');
    } catch (error) {
      console.log('Error applying data for related view widget:' + error);//eslint-disable-line
    }
  },
  toggleView: function toggleView(evt) {
    domClass.toggle(this.tabNode, 'collapsed');

    if (!this.isLoaded) {
      this.onLoad();
    }
    evt.stopPropagation();
  },
  onSelectViewRow: function onSelectViewRow(evt) {
    const relatedKey = evt.currentTarget.attributes['data-relatedkey'].value;
    const descriptor = evt.currentTarget.attributes['data-descriptor'].value;

    const options = {
      descriptor: descriptor,
      key: relatedKey,
      title: descriptor,
    };

    const view = App.getView(this.detailViewId);
    if (view) {
      view.show(options);
    }
    evt.stopPropagation();
  },
  onNavigateToList: function onNavigateToList(evt) {
    let whereExpression;
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

    const options = {
      descriptor: this.title,
      where: whereExpression,
      title: this.title,
    };

    const view = App.getView(this.listViewId);
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
      domConstruct.destroy(this.itemsNode);
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
        if (this.parentEntry && (this.parentEntry[this.parentProperty] === data.data[this.relatedProperty])) {
          this._onRefreshView();
        }
      }
    }
  },
  destroy: function destroy() {
    array.forEach(this._subscribes, (handle) => {
      connect.unsubscribe(handle);
    });
    this.inherited(arguments);
  },
});

lang.setObject('Sage.Platform.Mobile.RelatedViewWidget', __class);
export default __class;
