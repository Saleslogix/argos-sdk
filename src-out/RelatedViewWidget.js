define('argos/RelatedViewWidget', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/string', 'dojo/when', 'dojo/_base/connect', './Store/SData', './_CustomizationMixin', './_ActionMixin', './_RelatedViewWidgetBase', './I18n'], function (module, exports, _declare, _lang, _string, _when, _connect, _SData, _CustomizationMixin2, _ActionMixin2, _RelatedViewWidgetBase2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _string2 = _interopRequireDefault(_string);

  var _when2 = _interopRequireDefault(_when);

  var _connect2 = _interopRequireDefault(_connect);

  var _SData2 = _interopRequireDefault(_SData);

  var _CustomizationMixin3 = _interopRequireDefault(_CustomizationMixin2);

  var _ActionMixin3 = _interopRequireDefault(_ActionMixin2);

  var _RelatedViewWidgetBase3 = _interopRequireDefault(_RelatedViewWidgetBase2);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /* Copyright 2017 Infor
   *
   * Licensed under the Apache License, Version 2.0 (the "License");
   * you may not use this file except in compliance with the License.
   * You may obtain a copy of the License at
   *
   *    http://www.apache.org/licenses/LICENSE-2.0
   *
   * Unless required by applicable law or agreed to in writing, software
   * distributed under the License is distributed on an "AS IS" BASIS,
   * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   * See the License for the specific language governing permissions and
   * limitations under the License.
   */

  var resource = (0, _I18n2.default)('relatedViewWidget');

  /**
   * @class argos.RelatedViewWidget
   */
  var __class = (0, _declare2.default)('argos.RelatedViewWidget', [_RelatedViewWidgetBase3.default, _CustomizationMixin3.default, _ActionMixin3.default], /** @lends argos.RelatedViewWidget# */{
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
    loadingTemplate: new Simplate(['<div class="busy-indicator-container" aria-live="polite">', '<div class="busy-indicator active">', '<div class="bar one"></div>', '<div class="bar two"></div>', '<div class="bar three"></div>', '<div class="bar four"></div>', '<div class="bar five"></div>', '</div>', '<span>{%: $.loadingText %}</span>', '</div>']),

    relatedActionTemplate: new Simplate(['<span class="action-item" data-id="{%= $.actionIndex %}">', '<img src="{%= $.icon %}" alt="{%= $.label %}" />', '</span>']),
    constructor: function constructor(options) {
      _lang2.default.mixin(this, options);
      if (this.titleText) {
        this.title = this.titleText;
      }

      this._subscribes = [];
      this._subscribes.push(_connect2.default.subscribe('/app/refresh', this, this._onAppRefresh));
    },
    postCreate: function postCreate() {
      if (!this.showTab && this.tabNode) {
        $(this.tabNode).toggleClass('hidden');
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
        _lang2.default.mixin(action, options);
        var actionTemplate = action.template || this.relatedActionTemplate;
        var actionNode = $(actionTemplate.apply(action, action.id));
        $(actionNode).on('click', this.onInvokeActionItem.bind(this));
        $(this.actionsNode).append(actionNode);
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
      evt.stopPropagation();
    },
    getStore: function getStore() {
      var store = new _SData2.default({
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
      var data = void 0;
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
          this.loadingNode = $(this.loadingTemplate.apply(this));
          $(this.relatedViewNode).append(this.loadingNode);
        }
        $(this.loadingNode).toggleClass('loading');
        if (this.wait) {
          return;
        }
        this.relatedResults = this.fetchData();
        (function (context, relatedResults) {
          try {
            (0, _when2.default)(relatedResults, function success(relatedFeed) {
              this.onApply(relatedFeed);
            }.bind(context));
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
          this.itemsNode = $("<div id='itemsNode' class='items'><div>");
          $(this.relatedViewNode).append(this.itemsNode);
        }

        if (relatedFeed.length > 0) {
          var moreData = void 0;
          $(this.containerNode).removeClass('hidden');
          $(this.tabNode).removeClass('collapsed');
          this.itemCount = this.itemCount + relatedFeed.length;
          var restCount = this.relatedResults.total - this.itemCount;
          if (restCount > 0) {
            var moreCount = restCount >= this.pageSize ? this.pageSize : restCount;
            moreData = _string2.default.substitute(this.selectMoreDataText, [moreCount, this.relatedResults.total]);
          } else {
            moreData = '';
          }

          if (this.showSelectMore) {
            $(this.selectMoreNode).attr({
              innerHTML: moreData
            });
          } else {
            $(this.selectMoreNode).attr({
              innerHTML: ''
            });
          }

          if (this.showTotalInTab) {
            $(this.titleNode).attr({
              innerHTML: this.title + '  ' + _string2.default.substitute(this.totalCountText, [this.relatedResults.total])
            });
          }
          for (var i = 0; i < relatedFeed.length; i++) {
            var itemEntry = relatedFeed[i];
            itemEntry.$descriptor = itemEntry.$descriptor || relatedFeed.$descriptor;
            var itemHTML = this.relatedViewRowTemplate.apply(itemEntry, this);
            var itemNode = $(itemHTML);
            $(itemNode).on('click', this.onSelectViewRow.bind(this));
            $(this.itemsNode).append(itemNode);
          }
        } else {
          if (this.hideWhenNoData) {
            $(this.containerNode).addClass('hidden');
          } else {
            $(this.containerNode).removeClass('hidden');
          }
          $(this.itemsNode).append(this.nodataTemplate.apply(this.parentEntry, this));
          if (this.showTotalInTab) {
            $(this.titleNode).attr({
              innerHTML: this.title + '  ' + _string2.default.substitute(this.totalCountText, [0, 0])
            });
          }
          $(this.selectMoreNode).attr({
            innerHTML: ''
          });
          if (this._isInitLoad) {
            this._isInitLoad = false;
            $(this.tabNode).toggleClass('collapsed');
          }
        }
        $(this.loadingNode).toggleClass('loading');
      } catch (error) {
        console.log('Error applying data for related view widget:' + error); //eslint-disable-line
      }
    },
    toggleView: function toggleView(evt) {
      $(this.tabNode).toggleClass('collapsed');

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
      var whereExpression = void 0;
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
        $(this.itemsNode).remove();
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
      this._subscribes.forEach(function (handle) {
        _connect2.default.unsubscribe(handle);
      });
      this.inherited(arguments);
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWxhdGVkVmlld1dpZGdldC5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJjbHMiLCJub2RhdGFUZXh0Iiwic2VsZWN0TW9yZURhdGFUZXh0Iiwic2VsZWN0TW9yZURhdGFUZXh0MiIsIm5hdlRvTGlzdFRleHQiLCJsb2FkaW5nVGV4dCIsInJlZnJlc2hWaWV3VGV4dCIsIml0ZW1PZkNvdW50VGV4dCIsInRvdGFsQ291bnRUZXh0IiwidGl0bGVUZXh0IiwicGFyZW50UHJvcGVydHkiLCJwYXJlbnRFbnRyeSIsInJlbGF0ZWRQcm9wZXJ0eSIsInJlbGF0ZWRFbnRyeSIsIml0ZW1zTm9kZSIsImxvYWRpbmdOb2RlIiwiaWQiLCJkZXRhaWxWaWV3SWQiLCJsaXN0Vmlld0lkIiwibGlzdFZpZXdXaGVyZSIsImVuYWJsZWQiLCJwYXJlbnRDb2xsZWN0aW9uIiwicGFyZW50Q29sbGVjdGlvblByb3BlcnR5IiwicmVzb3VyY2VLaW5kIiwiY29udHJhY3ROYW1lIiwic2VsZWN0Iiwid2hlcmUiLCJzb3J0Iiwic3RvcmUiLCJyZWxhdGVkRGF0YSIsInF1ZXJ5T3B0aW9ucyIsImlzTG9hZGVkIiwiYXV0b0xvYWQiLCJ3YWl0Iiwic3RhcnRJbmRleCIsInBhZ2VTaXplIiwicmVsYXRlZFJlc3VsdHMiLCJpdGVtQ291bnQiLCJfaXNJbml0TG9hZCIsInNob3dUYWIiLCJzaG93VG90YWxJblRhYiIsInNob3dTZWxlY3RNb3JlIiwiaGlkZVdoZW5Ob0RhdGEiLCJlbmFibGVBY3Rpb25zIiwiX3N1YnNjcmliZXMiLCJyZWxhdGVkQ29udGVudFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJub2RhdGFUZW1wbGF0ZSIsInJlbGF0ZWRWaWV3VGFiSXRlbXNUZW1wbGF0ZSIsInJlbGF0ZWRWaWV3SGVhZGVyVGVtcGxhdGUiLCJyZWxhdGVkVmlld0Zvb3RlclRlbXBsYXRlIiwicmVsYXRlZFZpZXdSb3dUZW1wbGF0ZSIsInJlbGF0ZWRJdGVtSWNvblRlbXBsYXRlIiwicmVsYXRlZEl0ZW1IZWFkZXJUZW1wbGF0ZSIsInJlbGF0ZWRJdGVtRGV0YWlsVGVtcGxhdGUiLCJyZWxhdGVkSXRlbUZvb3RlclRlbXBsYXRlIiwicmVsYXRlZEl0ZW1UZW1wbGF0ZSIsImxvYWRpbmdUZW1wbGF0ZSIsInJlbGF0ZWRBY3Rpb25UZW1wbGF0ZSIsImNvbnN0cnVjdG9yIiwib3B0aW9ucyIsIm1peGluIiwidGl0bGUiLCJwdXNoIiwic3Vic2NyaWJlIiwiX29uQXBwUmVmcmVzaCIsInBvc3RDcmVhdGUiLCJ0YWJOb2RlIiwiJCIsInRvZ2dsZUNsYXNzIiwiY3JlYXRlQWN0aW9ucyIsIl9jcmVhdGVDdXN0b21pemVkTGF5b3V0IiwiY3JlYXRlQWN0aW9uTGF5b3V0IiwiYWN0aW9ucyIsImxhYmVsIiwiYWN0aW9uIiwiaXNFbmFibGVkIiwidmlld0NvbnRhY3RzQWN0aW9uVGV4dCIsImZuIiwib25OYXZpZ2F0ZVRvTGlzdCIsImJpbmQiLCJpIiwibGVuZ3RoIiwiYWN0aW9uSW5kZXgiLCJhY3Rpb25UZW1wbGF0ZSIsInRlbXBsYXRlIiwiYWN0aW9uTm9kZSIsImFwcGx5Iiwib24iLCJvbkludm9rZUFjdGlvbkl0ZW0iLCJhY3Rpb25zTm9kZSIsImFwcGVuZCIsImV2dCIsImluZGV4IiwiY3VycmVudFRhcmdldCIsImF0dHJpYnV0ZXMiLCJ2YWx1ZSIsImNhbGwiLCJzY29wZSIsInN0b3BQcm9wYWdhdGlvbiIsImdldFN0b3JlIiwic2VydmljZSIsIkFwcCIsImdldFNlcnZpY2UiLCJnZXRRdWVyeU9wdGlvbnMiLCJ3aGVyZUV4cHJlc3Npb24iLCJoYXNPd25Qcm9wZXJ0eSIsImNvdW50Iiwic3RhcnQiLCJmZXRjaERhdGEiLCJxdWVyeVJlc3VsdHMiLCJxdWVyeSIsIm9uSW5pdCIsIm9uTG9hZCIsImRhdGEiLCJ0b3RhbCIsIm9uQXBwbHkiLCIkcmVzb3VyY2VzIiwicmVsYXRlZFZpZXdOb2RlIiwiY29udGV4dCIsInN1Y2Nlc3MiLCJyZWxhdGVkRmVlZCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsIm1vcmVEYXRhIiwiY29udGFpbmVyTm9kZSIsInJlbW92ZUNsYXNzIiwicmVzdENvdW50IiwibW9yZUNvdW50Iiwic3Vic3RpdHV0ZSIsInNlbGVjdE1vcmVOb2RlIiwiYXR0ciIsImlubmVySFRNTCIsInRpdGxlTm9kZSIsIml0ZW1FbnRyeSIsIiRkZXNjcmlwdG9yIiwiaXRlbUhUTUwiLCJpdGVtTm9kZSIsIm9uU2VsZWN0Vmlld1JvdyIsImFkZENsYXNzIiwidG9nZ2xlVmlldyIsInJlbGF0ZWRLZXkiLCJkZXNjcmlwdG9yIiwia2V5IiwidmlldyIsImdldFZpZXciLCJzaG93Iiwib25TZWxlY3RNb3JlRGF0YSIsIm9uUmVmcmVzaFZpZXciLCJfb25SZWZyZXNoVmlldyIsInJlbW92ZSIsImRlc3Ryb3kiLCJmb3JFYWNoIiwiaGFuZGxlIiwidW5zdWJzY3JpYmUiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLE1BQU1BLFdBQVcsb0JBQVksbUJBQVosQ0FBakI7O0FBRUE7OztBQUdBLE1BQU1DLFVBQVUsdUJBQVEseUJBQVIsRUFBbUMsc0ZBQW5DLEVBQWdHLHNDQUFzQztBQUNwSkMsU0FBSyxxQkFEK0k7QUFFcEpDLGdCQUFZSCxTQUFTRyxVQUYrSDtBQUdwSkMsd0JBQW9CSixTQUFTSSxrQkFIdUg7QUFJcEpDLHlCQUFxQkwsU0FBU0ssbUJBSnNIO0FBS3BKQyxtQkFBZU4sU0FBU00sYUFMNEg7QUFNcEpDLGlCQUFhUCxTQUFTTyxXQU44SDtBQU9wSkMscUJBQWlCUixTQUFTUSxlQVAwSDtBQVFwSkMscUJBQWlCVCxTQUFTUyxlQVIwSDtBQVNwSkMsb0JBQWdCVixTQUFTVSxjQVQySDtBQVVwSkMsZUFBV1gsU0FBU1csU0FWZ0k7QUFXcEpDLG9CQUFnQixNQVhvSTtBQVlwSkMsaUJBQWEsSUFadUk7QUFhcEpDLHFCQUFpQixNQWJtSTtBQWNwSkMsa0JB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ZixDQUFuRSxFQUFxRztBQUNuRyxpQkFBSzBJLGNBQUw7QUFDRDtBQUNGO0FBQ0Y7QUFDRixLQTlibUo7QUErYnBKRSxhQUFTLFNBQVNBLE9BQVQsR0FBbUI7QUFDMUIsV0FBSzVHLFdBQUwsQ0FBaUI2RyxPQUFqQixDQUF5QixVQUFDQyxNQUFELEVBQVk7QUFDbkMsMEJBQVFDLFdBQVIsQ0FBb0JELE1BQXBCO0FBQ0QsT0FGRDtBQUdBLFdBQUtFLFNBQUwsQ0FBZUMsU0FBZjtBQUNEO0FBcGNtSixHQUF0SSxDQUFoQjs7b0JBdWNlOUosTyIsImZpbGUiOiJSZWxhdGVkVmlld1dpZGdldC5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBzdHJpbmcgZnJvbSAnZG9qby9zdHJpbmcnO1xyXG5pbXBvcnQgd2hlbiBmcm9tICdkb2pvL3doZW4nO1xyXG5pbXBvcnQgY29ubmVjdCBmcm9tICdkb2pvL19iYXNlL2Nvbm5lY3QnO1xyXG5cclxuaW1wb3J0IFNEYXRhU3RvcmUgZnJvbSAnLi9TdG9yZS9TRGF0YSc7XHJcbmltcG9ydCBfQ3VzdG9taXphdGlvbk1peGluIGZyb20gJy4vX0N1c3RvbWl6YXRpb25NaXhpbic7XHJcbmltcG9ydCBfQWN0aW9uTWl4aW4gZnJvbSAnLi9fQWN0aW9uTWl4aW4nO1xyXG5pbXBvcnQgX1JlbGF0ZWRWaWV3V2lkZ2V0QmFzZSBmcm9tICcuL19SZWxhdGVkVmlld1dpZGdldEJhc2UnO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi9JMThuJztcclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ3JlbGF0ZWRWaWV3V2lkZ2V0Jyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLlJlbGF0ZWRWaWV3V2lkZ2V0XHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuUmVsYXRlZFZpZXdXaWRnZXQnLCBbX1JlbGF0ZWRWaWV3V2lkZ2V0QmFzZSwgX0N1c3RvbWl6YXRpb25NaXhpbiwgX0FjdGlvbk1peGluXSwgLyoqIEBsZW5kcyBhcmdvcy5SZWxhdGVkVmlld1dpZGdldCMgKi97XHJcbiAgY2xzOiAncmVsYXRlZC12aWV3LXdpZGdldCcsXHJcbiAgbm9kYXRhVGV4dDogcmVzb3VyY2Uubm9kYXRhVGV4dCxcclxuICBzZWxlY3RNb3JlRGF0YVRleHQ6IHJlc291cmNlLnNlbGVjdE1vcmVEYXRhVGV4dCxcclxuICBzZWxlY3RNb3JlRGF0YVRleHQyOiByZXNvdXJjZS5zZWxlY3RNb3JlRGF0YVRleHQyLFxyXG4gIG5hdlRvTGlzdFRleHQ6IHJlc291cmNlLm5hdlRvTGlzdFRleHQsXHJcbiAgbG9hZGluZ1RleHQ6IHJlc291cmNlLmxvYWRpbmdUZXh0LFxyXG4gIHJlZnJlc2hWaWV3VGV4dDogcmVzb3VyY2UucmVmcmVzaFZpZXdUZXh0LFxyXG4gIGl0ZW1PZkNvdW50VGV4dDogcmVzb3VyY2UuaXRlbU9mQ291bnRUZXh0LFxyXG4gIHRvdGFsQ291bnRUZXh0OiByZXNvdXJjZS50b3RhbENvdW50VGV4dCxcclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuICBwYXJlbnRQcm9wZXJ0eTogJyRrZXknLFxyXG4gIHBhcmVudEVudHJ5OiBudWxsLFxyXG4gIHJlbGF0ZWRQcm9wZXJ0eTogJyRrZXknLFxyXG4gIHJlbGF0ZWRFbnRyeTogbnVsbCxcclxuICBpdGVtc05vZGU6IG51bGwsXHJcbiAgbG9hZGluZ05vZGU6IG51bGwsXHJcbiAgaWQ6ICdyZWxhdGVkLXZpZXcnLFxyXG4gIGRldGFpbFZpZXdJZDogbnVsbCxcclxuICBsaXN0Vmlld0lkOiBudWxsLFxyXG4gIGxpc3RWaWV3V2hlcmU6IG51bGwsXHJcbiAgZW5hYmxlZDogZmFsc2UsXHJcbiAgcGFyZW50Q29sbGVjdGlvbjogZmFsc2UsXHJcbiAgcGFyZW50Q29sbGVjdGlvblByb3BlcnR5OiBudWxsLFxyXG4gIHJlc291cmNlS2luZDogbnVsbCxcclxuICBjb250cmFjdE5hbWU6IG51bGwsXHJcbiAgc2VsZWN0OiBudWxsLFxyXG4gIHdoZXJlOiBudWxsLFxyXG4gIHNvcnQ6IG51bGwsXHJcbiAgc3RvcmU6IG51bGwsXHJcbiAgcmVsYXRlZERhdGE6IG51bGwsXHJcbiAgcXVlcnlPcHRpb25zOiBudWxsLFxyXG4gIGlzTG9hZGVkOiBmYWxzZSxcclxuICBhdXRvTG9hZDogZmFsc2UsXHJcbiAgd2FpdDogZmFsc2UsXHJcbiAgc3RhcnRJbmRleDogMSxcclxuICBwYWdlU2l6ZTogMyxcclxuICByZWxhdGVkUmVzdWx0czogbnVsbCxcclxuICBpdGVtQ291bnQ6IDAsXHJcbiAgX2lzSW5pdExvYWQ6IHRydWUsXHJcbiAgc2hvd1RhYjogdHJ1ZSxcclxuICBzaG93VG90YWxJblRhYjogdHJ1ZSxcclxuICBzaG93U2VsZWN0TW9yZTogZmFsc2UsXHJcbiAgaGlkZVdoZW5Ob0RhdGE6IGZhbHNlLFxyXG4gIGVuYWJsZUFjdGlvbnM6IHRydWUsXHJcbiAgX3N1YnNjcmliZXM6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGUgdGhhdCBkZWZpbmVzIHRoZSBIVE1MIE1hcmt1cFxyXG4gICAqL1xyXG4gIHJlbGF0ZWRDb250ZW50VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiAgaWQ9XCJ0YWJcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwidGFiTm9kZVwiIGNsYXNzPVwiJyxcclxuICAgICd7JSBpZiAoJC5hdXRvTG9hZCkgeyAlfScsXHJcbiAgICAndGFiICcsXHJcbiAgICAneyUgfSBlbHNlIHsgJX0nLFxyXG4gICAgJ3RhYiBjb2xsYXBzZWQgJyxcclxuICAgICd7JSB9ICV9JyxcclxuICAgICdcIiA+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwidGFiLWl0ZW1zXCI+JyxcclxuICAgICd7JSEgJCQucmVsYXRlZFZpZXdUYWJJdGVtc1RlbXBsYXRlICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cInBhbmVsXCI+JyxcclxuICAgICc8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJhY3Rpb25zTm9kZVwiIGNsYXNzPVwiYWN0aW9uLWl0ZW1zXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJoZWFkZXJlTm9kZVwiIGNsYXNzPVwiaGVhZGVyXCI+JyxcclxuICAgICd7JSEgJCQucmVsYXRlZFZpZXdIZWFkZXJUZW1wbGF0ZSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8ZGl2ICBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwicmVsYXRlZFZpZXdOb2RlXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJmb290ZXJOb2RlXCIgY2xhc3M9XCJmb290ZXJcIj4nLFxyXG4gICAgJ3slISAkJC5yZWxhdGVkVmlld0Zvb3RlclRlbXBsYXRlICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgbm9kYXRhVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cIm5vZGF0YVwiPiB7JTogJCQubm9kYXRhVGV4dCAlfTwvZGl2PicsXHJcbiAgXSksXHJcbiAgcmVsYXRlZFZpZXdUYWJJdGVtc1RlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxzcGFuIGNsYXNzPVwidGFiLWl0ZW1cIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJ0YWItaWNvblwiIGRhdGEtZG9qby1hdHRhY2gtZXZlbnQ9XCJvbmNsaWNrOm9uTmF2aWdhdGVUb0xpc3RcIj4nLFxyXG4gICAgJzxpbWcgc3JjPVwieyU9ICQuaWNvbiAlfVwiIGFsdD1cInslPSAkLnRpdGxlICV9XCIgLz4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwidGl0bGVOb2RlXCIgZGF0YS1kb2pvLWF0dGFjaC1ldmVudD1cIm9uY2xpY2s6dG9nZ2xlVmlld1wiICBjbGFzcz1cInRpdGxlXCIgPnslOiAoJC50aXRsZSApICV9IDwvZGl2PicsXHJcbiAgICAnPC9zcGFuPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImxpbmUtYmFyXCI+PC9kaXY+JyxcclxuICBdKSxcclxuICByZWxhdGVkVmlld0hlYWRlclRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJycsXHJcbiAgXSksXHJcbiAgcmVsYXRlZFZpZXdGb290ZXJUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2ICBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwic2VsZWN0TW9yZU5vZGVcIiBjbGFzcz1cImFjdGlvblwiIGRhdGEtZG9qby1hdHRhY2gtZXZlbnQ9XCJvbmNsaWNrOm9uU2VsZWN0TW9yZURhdGFcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJuYXZ0b0xpc3RGb290ZXJOb2RlXCIgY2xhc3M9XCJhY3Rpb25cIiBkYXRhLWRvam8tYXR0YWNoLWV2ZW50PVwib25jbGljazpvbk5hdmlnYXRlVG9MaXN0XCI+eyU6ICQkLm5hdlRvTGlzdFRleHQgJX08L2Rpdj4nLFxyXG5cclxuICBdKSxcclxuICByZWxhdGVkVmlld1Jvd1RlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJyb3cgeyU6ICQkLmNscyAlfVwiICBkYXRhLXJlbGF0ZWRrZXk9XCJ7JTogJC4ka2V5ICV9XCIgZGF0YS1kZXNjcmlwdG9yPVwieyU6ICQuJGRlc2NyaXB0b3IgJX1cIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJpdGVtXCI+JyxcclxuICAgICd7JSEgJCQucmVsYXRlZEl0ZW1UZW1wbGF0ZSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIHJlbGF0ZWRJdGVtSWNvblRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxpbWcgc3JjPVwieyU6ICQkLml0ZW1JY29uICV9XCIgLz4nLFxyXG4gIF0pLFxyXG4gIHJlbGF0ZWRJdGVtSGVhZGVyVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdj57JTogJC4kZGVzY3JpcHRvciAlfTwvZGl2PicsXHJcbiAgXSksXHJcbiAgcmVsYXRlZEl0ZW1EZXRhaWxUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2PjwvZGl2PicsXHJcbiAgXSksXHJcbiAgcmVsYXRlZEl0ZW1Gb290ZXJUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2PjwvZGl2PicsXHJcbiAgXSksXHJcbiAgcmVsYXRlZEl0ZW1UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiaXRlbS1pY29uXCI+JyxcclxuICAgICd7JSEgJCQucmVsYXRlZEl0ZW1JY29uVGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cIml0ZW0taGVhZGVyXCI+JyxcclxuICAgICd7JSEgJCQucmVsYXRlZEl0ZW1IZWFkZXJUZW1wbGF0ZSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiaXRlbS1kZXRhaWxcIj4nLFxyXG4gICAgJ3slISAkJC5yZWxhdGVkSXRlbURldGFpbFRlbXBsYXRlICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJpdGVtLWZvb3RlclwiPicsXHJcbiAgICAneyUhICQkLnJlbGF0ZWRJdGVtRm9vdGVyVGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgbG9hZGluZ1RlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJidXN5LWluZGljYXRvci1jb250YWluZXJcIiBhcmlhLWxpdmU9XCJwb2xpdGVcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJidXN5LWluZGljYXRvciBhY3RpdmVcIj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgb25lXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHR3b1wiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciB0aHJlZVwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBmb3VyXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZpdmVcIj48L2Rpdj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPHNwYW4+eyU6ICQubG9hZGluZ1RleHQgJX08L3NwYW4+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG5cclxuICByZWxhdGVkQWN0aW9uVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPHNwYW4gY2xhc3M9XCJhY3Rpb24taXRlbVwiIGRhdGEtaWQ9XCJ7JT0gJC5hY3Rpb25JbmRleCAlfVwiPicsXHJcbiAgICAnPGltZyBzcmM9XCJ7JT0gJC5pY29uICV9XCIgYWx0PVwieyU9ICQubGFiZWwgJX1cIiAvPicsXHJcbiAgICAnPC9zcGFuPicsXHJcbiAgXSksXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIGxhbmcubWl4aW4odGhpcywgb3B0aW9ucyk7XHJcbiAgICBpZiAodGhpcy50aXRsZVRleHQpIHtcclxuICAgICAgdGhpcy50aXRsZSA9IHRoaXMudGl0bGVUZXh0O1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuX3N1YnNjcmliZXMgPSBbXTtcclxuICAgIHRoaXMuX3N1YnNjcmliZXMucHVzaChjb25uZWN0LnN1YnNjcmliZSgnL2FwcC9yZWZyZXNoJywgdGhpcywgdGhpcy5fb25BcHBSZWZyZXNoKSk7XHJcbiAgfSxcclxuICBwb3N0Q3JlYXRlOiBmdW5jdGlvbiBwb3N0Q3JlYXRlKCkge1xyXG4gICAgaWYgKCghdGhpcy5zaG93VGFiKSAmJiAodGhpcy50YWJOb2RlKSkge1xyXG4gICAgICAkKHRoaXMudGFiTm9kZSkudG9nZ2xlQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgfVxyXG4gICAgaWYgKHRoaXMuZW5hYmxlQWN0aW9ucykge1xyXG4gICAgICB0aGlzLmNyZWF0ZUFjdGlvbnModGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dCh0aGlzLmNyZWF0ZUFjdGlvbkxheW91dCgpLCAncmVsYXRlZHZpZXctYWN0aW9ucycpKTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNyZWF0ZUFjdGlvbkxheW91dDogZnVuY3Rpb24gY3JlYXRlQWN0aW9uTGF5b3V0KCkge1xyXG4gICAgcmV0dXJuIHRoaXMuYWN0aW9ucyB8fCAodGhpcy5hY3Rpb25zID0gW3tcclxuICAgICAgaWQ6ICdyZWZyZXNoJyxcclxuICAgICAgY2xzOiAnZmEgZmEtcmVmcmVzaCBmYS0yeCcsXHJcbiAgICAgIGxhYmVsOiB0aGlzLnJlZnJlc2hWaWV3VGV4dCxcclxuICAgICAgYWN0aW9uOiAnb25SZWZyZXNoVmlldycsXHJcbiAgICAgIGlzRW5hYmxlZDogdHJ1ZSxcclxuICAgIH0sIHtcclxuICAgICAgaWQ6ICduYXZ0b0xpc3RWaWV3JyxcclxuICAgICAgbGFiZWw6IHRoaXMudmlld0NvbnRhY3RzQWN0aW9uVGV4dCxcclxuICAgICAgY2xzOiAnZmEgZmEtbGlzdCBmYS0yeCcsXHJcbiAgICAgIGFjdGlvbjogJ29uTmF2aWdhdGVUb0xpc3QnLFxyXG4gICAgICBpc0VuYWJsZWQ6IHRydWUsXHJcbiAgICAgIGZuOiB0aGlzLm9uTmF2aWdhdGVUb0xpc3QuYmluZCh0aGlzKSxcclxuICAgIH1dKTtcclxuICB9LFxyXG4gIGNyZWF0ZUFjdGlvbnM6IGZ1bmN0aW9uIGNyZWF0ZUFjdGlvbnMoYWN0aW9ucykge1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBhY3Rpb25zLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIGNvbnN0IGFjdGlvbiA9IGFjdGlvbnNbaV07XHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgYWN0aW9uSW5kZXg6IGksXHJcbiAgICAgIH07XHJcbiAgICAgIGxhbmcubWl4aW4oYWN0aW9uLCBvcHRpb25zKTtcclxuICAgICAgY29uc3QgYWN0aW9uVGVtcGxhdGUgPSBhY3Rpb24udGVtcGxhdGUgfHwgdGhpcy5yZWxhdGVkQWN0aW9uVGVtcGxhdGU7XHJcbiAgICAgIGNvbnN0IGFjdGlvbk5vZGUgPSAkKGFjdGlvblRlbXBsYXRlLmFwcGx5KGFjdGlvbiwgYWN0aW9uLmlkKSk7XHJcbiAgICAgICQoYWN0aW9uTm9kZSkub24oJ2NsaWNrJywgdGhpcy5vbkludm9rZUFjdGlvbkl0ZW0uYmluZCh0aGlzKSk7XHJcbiAgICAgICQodGhpcy5hY3Rpb25zTm9kZSkuYXBwZW5kKGFjdGlvbk5vZGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuYWN0aW9ucyA9IGFjdGlvbnM7XHJcbiAgfSxcclxuICBvbkludm9rZUFjdGlvbkl0ZW06IGZ1bmN0aW9uIG9uSW52b2tlQWN0aW9uSXRlbShldnQpIHtcclxuICAgIGNvbnN0IGluZGV4ID0gZXZ0LmN1cnJlbnRUYXJnZXQuYXR0cmlidXRlc1snZGF0YS1pZCddLnZhbHVlO1xyXG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5hY3Rpb25zW2luZGV4XTtcclxuICAgIGlmIChhY3Rpb24pIHtcclxuICAgICAgaWYgKGFjdGlvbi5pc0VuYWJsZWQpIHtcclxuICAgICAgICBpZiAoYWN0aW9uLmZuKSB7XHJcbiAgICAgICAgICBhY3Rpb24uZm4uY2FsbChhY3Rpb24uc2NvcGUgfHwgdGhpcywgYWN0aW9uKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGlzW2FjdGlvbi5hY3Rpb25dID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRoaXNbYWN0aW9uLmFjdGlvbl0oZXZ0KTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9LFxyXG4gIGdldFN0b3JlOiBmdW5jdGlvbiBnZXRTdG9yZSgpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gbmV3IFNEYXRhU3RvcmUoe1xyXG4gICAgICBzZXJ2aWNlOiBBcHAuZ2V0U2VydmljZSgpLFxyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgICBjb250cmFjdE5hbWU6IHRoaXMuY29udHJhY3ROYW1lLFxyXG4gICAgICBzY29wZTogdGhpcyxcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHN0b3JlO1xyXG4gIH0sXHJcbiAgZ2V0UXVlcnlPcHRpb25zOiBmdW5jdGlvbiBnZXRRdWVyeU9wdGlvbnMoKSB7XHJcbiAgICBsZXQgd2hlcmVFeHByZXNzaW9uID0gJyc7XHJcbiAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnd2hlcmUnKSkge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXMud2hlcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB3aGVyZUV4cHJlc3Npb24gPSB0aGlzLndoZXJlKHRoaXMucGFyZW50RW50cnkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHdoZXJlRXhwcmVzc2lvbiA9IHRoaXMud2hlcmU7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSB7XHJcbiAgICAgIGNvdW50OiB0aGlzLnBhZ2VTaXplIHx8IDEsXHJcbiAgICAgIHN0YXJ0OiAwLFxyXG4gICAgICBzZWxlY3Q6IHRoaXMuc2VsZWN0IHx8ICcnLFxyXG4gICAgICB3aGVyZTogd2hlcmVFeHByZXNzaW9uLFxyXG4gICAgICBzb3J0OiB0aGlzLnNvcnQgfHwgJycsXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBxdWVyeU9wdGlvbnM7XHJcbiAgfSxcclxuICBmZXRjaERhdGE6IGZ1bmN0aW9uIGZldGNoRGF0YSgpIHtcclxuICAgIGlmICh0aGlzLnN0YXJ0SW5kZXggPCAxKSB7XHJcbiAgICAgIHRoaXMuc3RhcnRJbmRleCA9IDE7XHJcbiAgICB9XHJcbiAgICB0aGlzLnF1ZXJ5T3B0aW9ucy5zdGFydCA9IHRoaXMuc3RhcnRJbmRleCAtIDE7XHJcbiAgICBjb25zdCBxdWVyeVJlc3VsdHMgPSB0aGlzLnN0b3JlLnF1ZXJ5KG51bGwsIHRoaXMucXVlcnlPcHRpb25zKTtcclxuICAgIHRoaXMuc3RhcnRJbmRleCA9IHRoaXMuc3RhcnRJbmRleCA+IDAgJiYgdGhpcy5wYWdlU2l6ZSA+IDAgPyB0aGlzLnN0YXJ0SW5kZXggKyB0aGlzLnBhZ2VTaXplIDogMTtcclxuICAgIHJldHVybiBxdWVyeVJlc3VsdHM7XHJcbiAgfSxcclxuICBvbkluaXQ6IGZ1bmN0aW9uIG9uSW5pdCgpIHtcclxuICAgIHRoaXMuX2lzSW5pdExvYWQgPSB0cnVlO1xyXG4gICAgdGhpcy5zdG9yZSA9IHRoaXMuc3RvcmUgfHwgdGhpcy5nZXRTdG9yZSgpO1xyXG4gICAgdGhpcy5xdWVyeU9wdGlvbnMgPSB0aGlzLnF1ZXJ5T3B0aW9ucyB8fCB0aGlzLmdldFF1ZXJ5T3B0aW9ucygpO1xyXG5cclxuICAgIGlmICh0aGlzLmF1dG9Mb2FkKSB7XHJcbiAgICAgIHRoaXMub25Mb2FkKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHtcclxuICAgIGxldCBkYXRhO1xyXG4gICAgaWYgKHRoaXMucmVsYXRlZERhdGEpIHtcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLnJlbGF0ZWREYXRhID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgZGF0YSA9IHRoaXMucmVsYXRlZERhdGEodGhpcy5wYXJlbnRFbnRyeSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgZGF0YSA9IHRoaXMucmVsYXRlZERhdGE7XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGRhdGEpIHtcclxuICAgICAgICB0aGlzLnJlbGF0ZWRSZXN1bHRzID0ge1xyXG4gICAgICAgICAgdG90YWw6IGRhdGEubGVuZ3RoLFxyXG4gICAgICAgIH07XHJcbiAgICAgICAgdGhpcy5wYWdlU2l6ZSA9IGRhdGEubGVuZ3RoO1xyXG4gICAgICAgIHRoaXMub25BcHBseShkYXRhKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIGlmICh0aGlzLnBhcmVudENvbGxlY3Rpb24pIHtcclxuICAgICAgdGhpcy5yZWxhdGVkUmVzdWx0cyA9IHtcclxuICAgICAgICB0b3RhbDogdGhpcy5wYXJlbnRFbnRyeVt0aGlzLnBhcmVudENvbGxlY3Rpb25Qcm9wZXJ0eV0uJHJlc291cmNlcy5sZW5ndGgsXHJcbiAgICAgIH07XHJcbiAgICAgIHRoaXMucGFnZVNpemUgPSB0aGlzLnJlbGF0ZWRSZXN1bHRzLnRvdGFsO1xyXG4gICAgICB0aGlzLm9uQXBwbHkodGhpcy5wYXJlbnRFbnRyeVt0aGlzLnBhcmVudENvbGxlY3Rpb25Qcm9wZXJ0eV0uJHJlc291cmNlcyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAoIXRoaXMubG9hZGluZ05vZGUpIHtcclxuICAgICAgICB0aGlzLmxvYWRpbmdOb2RlID0gJCh0aGlzLmxvYWRpbmdUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICAgICAgJCh0aGlzLnJlbGF0ZWRWaWV3Tm9kZSkuYXBwZW5kKHRoaXMubG9hZGluZ05vZGUpO1xyXG4gICAgICB9XHJcbiAgICAgICQodGhpcy5sb2FkaW5nTm9kZSkudG9nZ2xlQ2xhc3MoJ2xvYWRpbmcnKTtcclxuICAgICAgaWYgKHRoaXMud2FpdCkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnJlbGF0ZWRSZXN1bHRzID0gdGhpcy5mZXRjaERhdGEoKTtcclxuICAgICAgKChjb250ZXh0LCByZWxhdGVkUmVzdWx0cykgPT4ge1xyXG4gICAgICAgIHRyeSB7XHJcbiAgICAgICAgICB3aGVuKHJlbGF0ZWRSZXN1bHRzLCBmdW5jdGlvbiBzdWNjZXNzKHJlbGF0ZWRGZWVkKSB7XHJcbiAgICAgICAgICAgIHRoaXMub25BcHBseShyZWxhdGVkRmVlZCk7XHJcbiAgICAgICAgICB9LmJpbmQoY29udGV4dCkpO1xyXG4gICAgICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgICAgICBjb25zb2xlLmxvZygnRXJyb3IgZmV0Y2hpbmcgcmVsYXRlZCB2aWV3IGRhdGE6JyArIGVycm9yKTsvL2VzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgICB9XHJcbiAgICAgIH0pKHRoaXMsIHRoaXMucmVsYXRlZFJlc3VsdHMpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5pc0xvYWRlZCA9IHRydWU7XHJcbiAgfSxcclxuICBvbkFwcGx5OiBmdW5jdGlvbiBvbkFwcGx5KHJlbGF0ZWRGZWVkKSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAoIXRoaXMuaXRlbXNOb2RlKSB7XHJcbiAgICAgICAgdGhpcy5pdGVtc05vZGUgPSAkKFwiPGRpdiBpZD0naXRlbXNOb2RlJyBjbGFzcz0naXRlbXMnPjxkaXY+XCIpO1xyXG4gICAgICAgICQodGhpcy5yZWxhdGVkVmlld05vZGUpLmFwcGVuZCh0aGlzLml0ZW1zTm9kZSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWxhdGVkRmVlZC5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgbGV0IG1vcmVEYXRhO1xyXG4gICAgICAgICQodGhpcy5jb250YWluZXJOb2RlKS5yZW1vdmVDbGFzcygnaGlkZGVuJyk7XHJcbiAgICAgICAgJCh0aGlzLnRhYk5vZGUpLnJlbW92ZUNsYXNzKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICB0aGlzLml0ZW1Db3VudCA9IHRoaXMuaXRlbUNvdW50ICsgcmVsYXRlZEZlZWQubGVuZ3RoO1xyXG4gICAgICAgIGNvbnN0IHJlc3RDb3VudCA9IHRoaXMucmVsYXRlZFJlc3VsdHMudG90YWwgLSB0aGlzLml0ZW1Db3VudDtcclxuICAgICAgICBpZiAocmVzdENvdW50ID4gMCkge1xyXG4gICAgICAgICAgY29uc3QgbW9yZUNvdW50ID0gKHJlc3RDb3VudCA+PSB0aGlzLnBhZ2VTaXplKSA/IHRoaXMucGFnZVNpemUgOiByZXN0Q291bnQ7XHJcbiAgICAgICAgICBtb3JlRGF0YSA9IHN0cmluZy5zdWJzdGl0dXRlKHRoaXMuc2VsZWN0TW9yZURhdGFUZXh0LCBbbW9yZUNvdW50LCB0aGlzLnJlbGF0ZWRSZXN1bHRzLnRvdGFsXSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIG1vcmVEYXRhID0gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zaG93U2VsZWN0TW9yZSkge1xyXG4gICAgICAgICAgJCh0aGlzLnNlbGVjdE1vcmVOb2RlKS5hdHRyKHtcclxuICAgICAgICAgICAgaW5uZXJIVE1MOiBtb3JlRGF0YSxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKHRoaXMuc2VsZWN0TW9yZU5vZGUpLmF0dHIoe1xyXG4gICAgICAgICAgICBpbm5lckhUTUw6ICcnLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAodGhpcy5zaG93VG90YWxJblRhYikge1xyXG4gICAgICAgICAgJCh0aGlzLnRpdGxlTm9kZSkuYXR0cih7XHJcbiAgICAgICAgICAgIGlubmVySFRNTDogYCR7dGhpcy50aXRsZX0gICR7c3RyaW5nLnN1YnN0aXR1dGUodGhpcy50b3RhbENvdW50VGV4dCwgW3RoaXMucmVsYXRlZFJlc3VsdHMudG90YWxdKX1gLFxyXG4gICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVsYXRlZEZlZWQubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgIGNvbnN0IGl0ZW1FbnRyeSA9IHJlbGF0ZWRGZWVkW2ldO1xyXG4gICAgICAgICAgaXRlbUVudHJ5LiRkZXNjcmlwdG9yID0gaXRlbUVudHJ5LiRkZXNjcmlwdG9yIHx8IHJlbGF0ZWRGZWVkLiRkZXNjcmlwdG9yO1xyXG4gICAgICAgICAgY29uc3QgaXRlbUhUTUwgPSB0aGlzLnJlbGF0ZWRWaWV3Um93VGVtcGxhdGUuYXBwbHkoaXRlbUVudHJ5LCB0aGlzKTtcclxuICAgICAgICAgIGNvbnN0IGl0ZW1Ob2RlID0gJChpdGVtSFRNTCk7XHJcbiAgICAgICAgICAkKGl0ZW1Ob2RlKS5vbignY2xpY2snLCB0aGlzLm9uU2VsZWN0Vmlld1Jvdy5iaW5kKHRoaXMpKTtcclxuICAgICAgICAgICQodGhpcy5pdGVtc05vZGUpLmFwcGVuZChpdGVtTm9kZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGlmICh0aGlzLmhpZGVXaGVuTm9EYXRhKSB7XHJcbiAgICAgICAgICAkKHRoaXMuY29udGFpbmVyTm9kZSkuYWRkQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAkKHRoaXMuY29udGFpbmVyTm9kZSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKHRoaXMuaXRlbXNOb2RlKS5hcHBlbmQodGhpcy5ub2RhdGFUZW1wbGF0ZS5hcHBseSh0aGlzLnBhcmVudEVudHJ5LCB0aGlzKSk7XHJcbiAgICAgICAgaWYgKHRoaXMuc2hvd1RvdGFsSW5UYWIpIHtcclxuICAgICAgICAgICQodGhpcy50aXRsZU5vZGUpLmF0dHIoe1xyXG4gICAgICAgICAgICBpbm5lckhUTUw6IGAke3RoaXMudGl0bGV9ICAke3N0cmluZy5zdWJzdGl0dXRlKHRoaXMudG90YWxDb3VudFRleHQsIFswLCAwXSl9YCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICAkKHRoaXMuc2VsZWN0TW9yZU5vZGUpLmF0dHIoe1xyXG4gICAgICAgICAgaW5uZXJIVE1MOiAnJyxcclxuICAgICAgICB9KTtcclxuICAgICAgICBpZiAodGhpcy5faXNJbml0TG9hZCkge1xyXG4gICAgICAgICAgdGhpcy5faXNJbml0TG9hZCA9IGZhbHNlO1xyXG4gICAgICAgICAgJCh0aGlzLnRhYk5vZGUpLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZWQnKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgJCh0aGlzLmxvYWRpbmdOb2RlKS50b2dnbGVDbGFzcygnbG9hZGluZycpO1xyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGFwcGx5aW5nIGRhdGEgZm9yIHJlbGF0ZWQgdmlldyB3aWRnZXQ6JyArIGVycm9yKTsvL2VzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIH1cclxuICB9LFxyXG4gIHRvZ2dsZVZpZXc6IGZ1bmN0aW9uIHRvZ2dsZVZpZXcoZXZ0KSB7XHJcbiAgICAkKHRoaXMudGFiTm9kZSkudG9nZ2xlQ2xhc3MoJ2NvbGxhcHNlZCcpO1xyXG5cclxuICAgIGlmICghdGhpcy5pc0xvYWRlZCkge1xyXG4gICAgICB0aGlzLm9uTG9hZCgpO1xyXG4gICAgfVxyXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIH0sXHJcbiAgb25TZWxlY3RWaWV3Um93OiBmdW5jdGlvbiBvblNlbGVjdFZpZXdSb3coZXZ0KSB7XHJcbiAgICBjb25zdCByZWxhdGVkS2V5ID0gZXZ0LmN1cnJlbnRUYXJnZXQuYXR0cmlidXRlc1snZGF0YS1yZWxhdGVka2V5J10udmFsdWU7XHJcbiAgICBjb25zdCBkZXNjcmlwdG9yID0gZXZ0LmN1cnJlbnRUYXJnZXQuYXR0cmlidXRlc1snZGF0YS1kZXNjcmlwdG9yJ10udmFsdWU7XHJcblxyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgZGVzY3JpcHRvcixcclxuICAgICAga2V5OiByZWxhdGVkS2V5LFxyXG4gICAgICB0aXRsZTogZGVzY3JpcHRvcixcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRWaWV3KHRoaXMuZGV0YWlsVmlld0lkKTtcclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIHZpZXcuc2hvdyhvcHRpb25zKTtcclxuICAgIH1cclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9LFxyXG4gIG9uTmF2aWdhdGVUb0xpc3Q6IGZ1bmN0aW9uIG9uTmF2aWdhdGVUb0xpc3QoZXZ0KSB7XHJcbiAgICBsZXQgd2hlcmVFeHByZXNzaW9uO1xyXG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ2xpc3RWaWV3V2hlcmUnKSkge1xyXG4gICAgICBpZiAodHlwZW9mIHRoaXMubGlzdFZpZXdXaGVyZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHdoZXJlRXhwcmVzc2lvbiA9IHRoaXMubGlzdFZpZXdXaGVyZSh0aGlzLnBhcmVudEVudHJ5KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3aGVyZUV4cHJlc3Npb24gPSB0aGlzLmxpc3RWaWV3V2hlcmU7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCd3aGVyZScpKSB7XHJcbiAgICAgICAgaWYgKHR5cGVvZiB0aGlzLndoZXJlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICB3aGVyZUV4cHJlc3Npb24gPSB0aGlzLndoZXJlKHRoaXMucGFyZW50RW50cnkpO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICB3aGVyZUV4cHJlc3Npb24gPSB0aGlzLndoZXJlO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGRlc2NyaXB0b3I6IHRoaXMudGl0bGUsXHJcbiAgICAgIHdoZXJlOiB3aGVyZUV4cHJlc3Npb24sXHJcbiAgICAgIHRpdGxlOiB0aGlzLnRpdGxlLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCB2aWV3ID0gQXBwLmdldFZpZXcodGhpcy5saXN0Vmlld0lkKTtcclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIHZpZXcuc2hvdyhvcHRpb25zKTtcclxuICAgIH1cclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9LFxyXG4gIG9uU2VsZWN0TW9yZURhdGE6IGZ1bmN0aW9uIG9uU2VsZWN0TW9yZURhdGEoZXZ0KSB7XHJcbiAgICB0aGlzLm9uTG9hZCgpO1xyXG4gICAgZXZ0LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gIH0sXHJcbiAgb25SZWZyZXNoVmlldzogZnVuY3Rpb24gb25SZWZyZXNoVmlldyhldnQpIHtcclxuICAgIHRoaXMuX29uUmVmcmVzaFZpZXcoKTtcclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9LFxyXG4gIF9vblJlZnJlc2hWaWV3OiBmdW5jdGlvbiBfb25SZWZyZXNoVmlldygpIHtcclxuICAgIGlmICh0aGlzLml0ZW1zTm9kZSkge1xyXG4gICAgICAkKHRoaXMuaXRlbXNOb2RlKS5yZW1vdmUoKTtcclxuICAgICAgdGhpcy5pdGVtc05vZGUgPSBudWxsO1xyXG4gICAgfVxyXG4gICAgdGhpcy5zdGFydEluZGV4ID0gMTtcclxuICAgIHRoaXMuaXRlbUNvdW50ID0gMDtcclxuICAgIHRoaXMuaXNMb2FkZWQgPSBmYWxzZTtcclxuICAgIHRoaXMub25Mb2FkKCk7XHJcbiAgfSxcclxuICBfb25BcHBSZWZyZXNoOiBmdW5jdGlvbiBfb25BcHBSZWZyZXNoKGRhdGEpIHtcclxuICAgIGlmIChkYXRhICYmIGRhdGEuZGF0YSkge1xyXG4gICAgICBpZiAoZGF0YS5yZXNvdXJjZUtpbmQgPT09IHRoaXMucmVzb3VyY2VLaW5kKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucGFyZW50RW50cnkgJiYgKHRoaXMucGFyZW50RW50cnlbdGhpcy5wYXJlbnRQcm9wZXJ0eV0gPT09IGRhdGEuZGF0YVt0aGlzLnJlbGF0ZWRQcm9wZXJ0eV0pKSB7XHJcbiAgICAgICAgICB0aGlzLl9vblJlZnJlc2hWaWV3KCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5fc3Vic2NyaWJlcy5mb3JFYWNoKChoYW5kbGUpID0+IHtcclxuICAgICAgY29ubmVjdC51bnN1YnNjcmliZShoYW5kbGUpO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19