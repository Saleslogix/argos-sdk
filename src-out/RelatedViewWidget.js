<<<<<<< HEAD
define('argos/RelatedViewWidget', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/event', 'dojo/on', 'dojo/string', 'dojo/dom-class', 'dojo/when', 'dojo/dom-construct', 'dojo/query', 'dojo/dom-attr', 'dojo/_base/connect', 'dojo/_base/array', './Store/SData', './_CustomizationMixin', './_ActionMixin', 'argos/_RelatedViewWidgetBase'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseEvent, _dojoOn, _dojoString, _dojoDomClass, _dojoWhen, _dojoDomConstruct, _dojoQuery, _dojoDomAttr, _dojo_baseConnect, _dojo_baseArray, _StoreSData, _CustomizationMixin2, _ActionMixin2, _argos_RelatedViewWidgetBase) {
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

    var _query = _interopRequireDefault(_dojoQuery);

    var _domAttr = _interopRequireDefault(_dojoDomAttr);

    var _connect = _interopRequireDefault(_dojo_baseConnect);

    var _array = _interopRequireDefault(_dojo_baseArray);

    var _SDataStore = _interopRequireDefault(_StoreSData);

    var _CustomizationMixin3 = _interopRequireDefault(_CustomizationMixin2);

    var _ActionMixin3 = _interopRequireDefault(_ActionMixin2);

    var _RelatedViewWidgetBase2 = _interopRequireDefault(_argos_RelatedViewWidgetBase);

    'use babel';

    var __class = (0, _declare['default'])('argos.RelatedViewWidget', [_RelatedViewWidgetBase2['default'], _CustomizationMixin3['default'], _ActionMixin3['default']], {
=======
/* see copyright file
 */


define('argos/RelatedViewWidget', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/event',
    'dojo/on',
    'dojo/string',
    'dojo/dom-class',
    'dojo/when',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/dom-attr',
    'dojo/_base/connect',
    'dojo/_base/array',
    './Store/SData',
    './_CustomizationMixin',
    './_ActionMixin',
    'argos/_RelatedViewWidgetBase'
], function(
    declare,
    lang,
    event,
    on,
    string,
    domClass,
    when,
    domConstruct,
    query,
    domAttr,
    connect,
    array,
    SDataStore,
    _CustomizationMixin,
    _ActionMixin,
    _RelatedViewWidgetBase
) {
    var __class = declare('argos.RelatedViewWidget', [_RelatedViewWidgetBase, _CustomizationMixin, _ActionMixin], {
>>>>>>> develop
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
<<<<<<< HEAD
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
=======
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
                    '</div>'
        ]),
        nodataTemplate: new Simplate([
             '<div class="nodata"> {%: $$.nodataText %}</div>'
        ]),
        relatedViewTabItemsTemplate: new Simplate([
            '<span class="tab-item">',
            '<div class="tab-icon" data-dojo-attach-event="onclick:onNavigateToList">',
               '<img src="{%= $.icon %}" alt="{%= $.title %}" />',
            '</div>',
            '<div data-dojo-attach-point="titleNode" data-dojo-attach-event="onclick:toggleView"  class="title" >{%: ($.title ) %} </div>',
            '</span>',
            '<div class="line-bar"></div>'
        ]),
        relatedViewHeaderTemplate: new Simplate([
            ''
        ]),
        relatedViewFooterTemplate: new Simplate([
                 '<div  data-dojo-attach-point="selectMoreNode" class="action" data-dojo-attach-event="onclick:onSelectMoreData"></div>',
                 '<div  data-dojo-attach-point="navtoListFooterNode" class="action" data-dojo-attach-event="onclick:onNavigateToList">{%: $$.navToListText %}</div>'

        ]),
        relatedViewRowTemplate: new Simplate([
            '<div class="row {%: $$.cls %}"  data-relatedkey="{%: $.$key %}" data-descriptor="{%: $.$descriptor %}">',
                 '<div class="item">',
                      '{%! $$.relatedItemTemplate %}',
                 '</div>',
            '</div>'
        ]),
        relatedItemIconTemplate: new Simplate([
             '<img src="{%: $$.itemIcon %}" />'
        ]),
        relatedItemHeaderTemplate: new Simplate([
              '<div>{%: $.$descriptor %}</div>'
        ]),
        relatedItemDetailTemplate: new Simplate([
              '<div></div>'
        ]),
        relatedItemFooterTemplate: new Simplate([
            '<div></div>'
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
               '</div>'
        ]),
        loadingTemplate: new Simplate([
           '<div class="loading-indicator"><div>{%= $.loadingText %}</div></div>'
        ]),

        relatedActionTemplate: new Simplate([
           '<span class="action-item" data-id="{%= $.actionIndex %}">',
                  '<img src="{%= $.icon %}" alt="{%= $.label %}" />',
           '</span>'
        ]),
        constructor: function(options) {
            lang.mixin(this, options);
>>>>>>> develop
            if (this.titleText) {
                this.title = this.titleText;
            }

            this._subscribes = [];
            this._subscribes.push(_connect['default'].subscribe('/app/refresh', this, this._onAppRefresh));
        },
<<<<<<< HEAD
        postCreate: function postCreate() {
            if (!this.showTab && this.tabNode) {
                _domClass['default'].toggle(this.tabNode, 'hidden');
=======
        postCreate: function() {
            if ((!this.showTab) && (this.tabNode)) {
                domClass.toggle(this.tabNode, 'hidden');
>>>>>>> develop
            }
            if (this.enableActions) {
                this.createActions(this._createCustomizedLayout(this.createActionLayout(), 'relatedview-actions'));
            }
        },
<<<<<<< HEAD
        createActionLayout: function createActionLayout() {
=======
        createActionLayout: function() {
>>>>>>> develop
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
<<<<<<< HEAD
            }]);
        },
        createActions: function createActions(actions) {
=======
            }]
            );
        },
        createActions: function(actions) {
>>>>>>> develop
            var i, action, actionNode, actionTemplate, options;
            for (i = 0; i < actions.length; i++) {
                action = actions[i];
                options = {
                    actionIndex: i
                };
                actionTemplate = action.template || this.relatedActionTemplate;

<<<<<<< HEAD
                _lang['default'].mixin(action, options);
                actionNode = _domConstruct['default'].toDom(actionTemplate.apply(action, action.id));
                (0, _on['default'])(actionNode, 'click', this.onInvokeActionItem.bind(this));
                _domConstruct['default'].place(actionNode, this.actionsNode, 'last');
=======
                lang.mixin(action, options);
                actionNode = domConstruct.toDom(actionTemplate.apply(action, action.id));
                on(actionNode, 'click', this.onInvokeActionItem.bind(this));
                domConstruct.place(actionNode, this.actionsNode, 'last');
>>>>>>> develop
            }

            this.actions = actions;
        },
<<<<<<< HEAD
        onInvokeActionItem: function onInvokeActionItem(evt) {
=======
        onInvokeActionItem: function(evt) {
>>>>>>> develop
            var action, parameters, index;
            index = evt.currentTarget.attributes['data-id'].value;
            action = this.actions[index];
            if (action) {
                if (action.isEnabled) {
                    if (action['fn']) {
                        action['fn'].call(action['scope'] || this, action);
<<<<<<< HEAD
                    } else {
=======
                    }
                    else {
>>>>>>> develop

                        if (typeof this[action['action']] === 'function') {
                            this[action['action']](evt);
                        }
                    }
                }
            }
            _event['default'].stop(evt);
        },
<<<<<<< HEAD
        getStore: function getStore() {
            var store = new _SDataStore['default']({
=======
        getStore: function() {
            var store = new SDataStore({
>>>>>>> develop
                service: App.services['crm'],
                resourceKind: this.resourceKind,
                contractName: this.contractName,
                scope: this
            });
            return store;
        },
<<<<<<< HEAD
        getQueryOptions: function getQueryOptions() {
            var whereExpression, startIndex, queryOptions;
=======
        getQueryOptions: function() {
            var whereExpression,
                startIndex,
                queryOptions;
>>>>>>> develop

            whereExpression = '';
            if (this.hasOwnProperty('where')) {
                if (typeof this.where === 'function') {
                    whereExpression = this.where(this.parentEntry);
                } else {
                    whereExpression = this.where;
                }
            }

            queryOptions = {
                count: this.pageSize || 1,
                start: 0,
                select: this.select || '',
                where: whereExpression,
                sort: this.sort || ''
            };

            return queryOptions;
        },
<<<<<<< HEAD
        fetchData: function fetchData() {
=======
        fetchData: function() {
>>>>>>> develop
            var queryResults, startIndex;
            if (this.startIndex < 1) {
                this.startIndex = 1;
            }
            this.queryOptions.start = this.startIndex - 1;
            queryResults = this.store.query(null, this.queryOptions);
            this.startIndex = this.startIndex > 0 && this.pageSize > 0 ? this.startIndex + this.pageSize : 1;
            return queryResults;
        },
<<<<<<< HEAD
        onInit: function onInit() {
=======
        onInit: function() {
>>>>>>> develop
            this._isInitLoad = true;
            this.store = this.store || this.getStore();
            this.queryOptions = this.queryOptions || this.getQueryOptions();

            if (this.autoLoad) {
                this.onLoad();
            }
        },
<<<<<<< HEAD
        onLoad: function onLoad() {
=======
        onLoad: function() {
>>>>>>> develop
            var data;
            if (this.relatedData) {

                if (typeof this.relatedData === 'function') {
                    data = this.relatedData(this.parentEntry);
                } else {
                    data = this.relatedData;
                }
                if (data) {
                    this.relatedResults = { total: data.length };
                    this.pageSize = data.length;
                    this.onApply(data);
                }
<<<<<<< HEAD
=======

>>>>>>> develop
            } else if (this.parentCollection) {
                this.relatedResults = { total: this.parentEntry[this.parentCollectionProperty]['$resources'].length };
                this.pageSize = this.relatedResults.total;
                this.onApply(this.parentEntry[this.parentCollectionProperty]['$resources']);
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
<<<<<<< HEAD
                (function (context, relatedResults) {

                    try {
                        (0, _when['default'])(relatedResults, (function (relatedFeed) {
=======
                (function(context, relatedResults) {

                    try {
                        when(relatedResults, function(relatedFeed) {
>>>>>>> develop
                            this.onApply(relatedFeed);
                        }).bind(context));
                    } catch (error) {
                        console.log('Error fetching related view data:' + error);
                    }
                })(this, this.relatedResults);
            }
            this.isLoaded = true;
        },
<<<<<<< HEAD
        onApply: function onApply(relatedFeed) {
            var i, relatedHTML, itemEntry, itemNode, headerNode, footerNode, itemsNode, itemHTML, moreData, restCount, moreCount;
            try {

=======
        onApply: function(relatedFeed) {
            var i, relatedHTML, itemEntry, itemNode, headerNode, footerNode, itemsNode, itemHTML, moreData, restCount, moreCount;
            try {


>>>>>>> develop
                if (!this.itemsNode) {
                    this.itemsNode = _domConstruct['default'].toDom('<div id=\'itemsNode\' class=\'items\'><div>');
                    _domConstruct['default'].place(this.itemsNode, this.relatedViewNode, 'last', this);
                }
                if (relatedFeed.length > 0) {
                    _domClass['default'].remove(this.containerNode, 'hidden');
                    _domClass['default'].remove(this.tabNode, 'collapsed');
                    this.itemCount = this.itemCount + relatedFeed.length;
                    restCount = this.relatedResults.total - this.itemCount;
                    if (restCount > 0) {
<<<<<<< HEAD
                        moreCount = restCount >= this.pageSize ? this.pageSize : restCount;
                        moreData = _string['default'].substitute(this.selectMoreDataText, [moreCount, this.relatedResults.total]);
=======
                        moreCount = (restCount >= this.pageSize) ? this.pageSize : restCount;
                        moreData = string.substitute(this.selectMoreDataText, [moreCount, this.relatedResults.total]);
>>>>>>> develop
                    } else {
                        moreData = '';
                    }
                    if (this.showSelectMore) {
<<<<<<< HEAD
                        _domAttr['default'].set(this.selectMoreNode, { innerHTML: moreData });
                    } else {
                        _domAttr['default'].set(this.selectMoreNode, { innerHTML: '' });
=======
                        domAttr.set(this.selectMoreNode, { innerHTML: moreData });
                    } else {
                        domAttr.set(this.selectMoreNode, { innerHTML: '' });

>>>>>>> develop
                    }
                    if (this.showTotalInTab) {
                        _domAttr['default'].set(this.titleNode, { innerHTML: this.title + '  ' + _string['default'].substitute(this.totalCountText, [this.relatedResults.total]) });
                    }
                    for (i = 0; i < relatedFeed.length; i++) {
                        itemEntry = relatedFeed[i];
                        itemEntry['$descriptor'] = itemEntry['$descriptor'] || relatedFeed['$descriptor'];
                        itemHTML = this.relatedViewRowTemplate.apply(itemEntry, this);
                        itemNode = _domConstruct['default'].toDom(itemHTML);
                        (0, _on['default'])(itemNode, 'click', this.onSelectViewRow.bind(this));
                        _domConstruct['default'].place(itemNode, this.itemsNode, 'last', this);
                    }
<<<<<<< HEAD
=======

>>>>>>> develop
                } else {
                    if (this.hideWhenNoData) {
                        _domClass['default'].add(this.containerNode, 'hidden');
                    } else {
                        _domClass['default'].remove(this.containerNode, 'hidden');
                    }
                    _domConstruct['default'].place(this.nodataTemplate.apply(this.parentEntry, this), this.itemsNode, 'last');
                    if (this.showTotalInTab) {
                        _domAttr['default'].set(this.titleNode, { innerHTML: this.title + '  ' + _string['default'].substitute(this.totalCountText, [0, 0]) });
                    }
                    _domAttr['default'].set(this.selectMoreNode, { innerHTML: '' });
                    if (this._isInitLoad) {
                        this._isInitLoad = false;
                        _domClass['default'].toggle(this.tabNode, 'collapsed');
                    }
                }
                _domClass['default'].toggle(this.loadingNode, 'loading');
            } catch (error) {
                console.log('Error applying data for related view widget:' + error);
            }

        },
<<<<<<< HEAD
        toggleView: function toggleView(evt) {

            _domClass['default'].toggle(this.tabNode, 'collapsed');
=======
        toggleView: function(evt) {

            domClass.toggle(this.tabNode, 'collapsed');
>>>>>>> develop

            if (!this.isLoaded) {
                this.onLoad();
            }
            evt.stopPropagation();
        },
<<<<<<< HEAD
        onSelectViewRow: function onSelectViewRow(evt) {
=======
        onSelectViewRow: function(evt) {
>>>>>>> develop
            var relatedKey, descriptor, options, view;

            relatedKey = evt.currentTarget.attributes['data-relatedkey'].value;
            descriptor = evt.currentTarget.attributes['data-descriptor'].value;

            options = {
                descriptor: descriptor,
                key: relatedKey,
                title: descriptor
            };

            view = App.getView(this.detailViewId);
            if (view) {
                view.show(options);
            }
            evt.stopPropagation();
        },
<<<<<<< HEAD
        onNavigateToList: function onNavigateToList(evt) {
=======
        onNavigateToList: function(evt) {
>>>>>>> develop
            var options, view, whereExpression;

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

            options = {
                descriptor: this.title,
                where: whereExpression,
                title: this.title
            };

            view = App.getView(this.listViewId);
            if (view) {
                view.show(options);
            }
            evt.stopPropagation();
        },
<<<<<<< HEAD
        onSelectMoreData: function onSelectMoreData(evt) {
            this.onLoad();
            evt.stopPropagation();
        },
        onRefreshView: function onRefreshView(evt) {
            this._onRefreshView();
            evt.stopPropagation();
        },
        _onRefreshView: function _onRefreshView() {
=======
        onSelectMoreData: function(evt) {
            this.onLoad();
            evt.stopPropagation();
        },
        onRefreshView: function(evt) {
            this._onRefreshView();
            evt.stopPropagation();
        },
        _onRefreshView: function() {
>>>>>>> develop
            var view, nodes;

            if (this.itemsNode) {
                _domConstruct['default'].destroy(this.itemsNode);
                this.itemsNode = null;
            }
            this.startIndex = 1;
            this.itemCount = 0;
            this.isLoaded = false;
            this.onLoad();
        },
<<<<<<< HEAD
        _onAppRefresh: function _onAppRefresh(data) {
=======
        _onAppRefresh: function(data) {
>>>>>>> develop
            if (data && data.data) {
                if (data.resourceKind === this.resourceKind) {
                    if (this.parentEntry && this.parentEntry[this.parentProperty] === data.data[this.relatedProperty]) {
                        this._onRefreshView();
                    }
                }
            }
        },
<<<<<<< HEAD
        destroy: function destroy() {
            _array['default'].forEach(this._subscribes, function (handle) {
                _connect['default'].unsubscribe(handle);
=======
        destroy: function() {
            array.forEach(this._subscribes, function(handle) {
                connect.unsubscribe(handle);
>>>>>>> develop
            });
            this.inherited(arguments);
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.RelatedViewWidget', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile.RelatedViewWidget', __class);
    return __class;
>>>>>>> develop
});
