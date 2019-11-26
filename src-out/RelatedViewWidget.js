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
      this.inherited(destroy, arguments);
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWxhdGVkVmlld1dpZGdldC5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJjbHMiLCJub2RhdGFUZXh0Iiwic2VsZWN0TW9yZURhdGFUZXh0Iiwic2VsZWN0TW9yZURhdGFUZXh0MiIsIm5hdlRvTGlzdFRleHQiLCJsb2FkaW5nVGV4dCIsInJlZnJlc2hWaWV3VGV4dCIsIml0ZW1PZkNvdW50VGV4dCIsInRvdGFsQ291bnRUZXh0IiwidGl0bGVUZXh0IiwicGFyZW50UHJvcGVydHkiLCJwYXJlbnRFbnRyeSIsInJlbGF0ZWRQcm9wZXJ0eSIsInJlbGF0ZWRFbnRyeSIsIml0ZW1zTm9kZSIsImxvYWRpbmdOb2RlIiwiaWQiLCJkZXRhaWxWaWV3SWQiLCJsaXN0Vmlld0lkIiwibGlzdFZpZXdXaGVyZSIsImVuYWJsZWQiLCJwYXJlbnRDb2xsZWN0aW9uIiwicGFyZW50Q29sbGVjdGlvblByb3BlcnR5IiwicmVzb3VyY2VLaW5kIiwiY29udHJhY3ROYW1lIiwic2VsZWN0Iiwid2hlcmUiLCJzb3J0Iiwic3RvcmUiLCJyZWxhdGVkRGF0YSIsInF1ZXJ5T3B0aW9ucyIsImlzTG9hZGVkIiwiYXV0b0xvYWQiLCJ3YWl0Iiwic3RhcnRJbmRleCIsInBhZ2VTaXplIiwicmVsYXRlZFJlc3VsdHMiLCJpdGVtQ291bnQiLCJfaXNJbml0TG9hZCIsInNob3dUYWIiLCJzaG93VG90YWxJblRhYiIsInNob3dTZWxlY3RNb3JlIiwiaGlkZVdoZW5Ob0RhdGEiLCJlbmFibGVBY3Rpb25zIiwiX3N1YnNjcmliZXMiLCJyZWxhdGVkQ29udGVudFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJub2RhdGFUZW1wbGF0ZSIsInJlbGF0ZWRWaWV3VGFiSXRlbXNUZW1wbGF0ZSIsInJlbGF0ZWRWaWV3SGVhZGVyVGVtcGxhdGUiLCJyZWxhdGVkVmlld0Zvb3RlclRlbXBsYXRlIiwicmVsYXRlZFZpZXdSb3dUZW1wbGF0ZSIsInJlbGF0ZWRJdGVtSWNvblRlbXBsYXRlIiwicmVsYXRlZEl0ZW1IZWFkZXJUZW1wbGF0ZSIsInJlbGF0ZWRJdGVtRGV0YWlsVGVtcGxhdGUiLCJyZWxhdGVkSXRlbUZvb3RlclRlbXBsYXRlIiwicmVsYXRlZEl0ZW1UZW1wbGF0ZSIsImxvYWRpbmdUZW1wbGF0ZSIsInJlbGF0ZWRBY3Rpb25UZW1wbGF0ZSIsImNvbnN0cnVjdG9yIiwib3B0aW9ucyIsIm1peGluIiwidGl0bGUiLCJwdXNoIiwic3Vic2NyaWJlIiwiX29uQXBwUmVmcmVzaCIsInBvc3RDcmVhdGUiLCJ0YWJOb2RlIiwiJCIsInRvZ2dsZUNsYXNzIiwiY3JlYXRlQWN0aW9ucyIsIl9jcmVhdGVDdXN0b21pemVkTGF5b3V0IiwiY3JlYXRlQWN0aW9uTGF5b3V0IiwiYWN0aW9ucyIsImxhYmVsIiwiYWN0aW9uIiwiaXNFbmFibGVkIiwidmlld0NvbnRhY3RzQWN0aW9uVGV4dCIsImZuIiwib25OYXZpZ2F0ZVRvTGlzdCIsImJpbmQiLCJpIiwibGVuZ3RoIiwiYWN0aW9uSW5kZXgiLCJhY3Rpb25UZW1wbGF0ZSIsInRlbXBsYXRlIiwiYWN0aW9uTm9kZSIsImFwcGx5Iiwib24iLCJvbkludm9rZUFjdGlvbkl0ZW0iLCJhY3Rpb25zTm9kZSIsImFwcGVuZCIsImV2dCIsImluZGV4IiwiY3VycmVudFRhcmdldCIsImF0dHJpYnV0ZXMiLCJ2YWx1ZSIsImNhbGwiLCJzY29wZSIsInN0b3BQcm9wYWdhdGlvbiIsImdldFN0b3JlIiwic2VydmljZSIsIkFwcCIsImdldFNlcnZpY2UiLCJnZXRRdWVyeU9wdGlvbnMiLCJ3aGVyZUV4cHJlc3Npb24iLCJoYXNPd25Qcm9wZXJ0eSIsImNvdW50Iiwic3RhcnQiLCJmZXRjaERhdGEiLCJxdWVyeVJlc3VsdHMiLCJxdWVyeSIsIm9uSW5pdCIsIm9uTG9hZCIsImRhdGEiLCJ0b3RhbCIsIm9uQXBwbHkiLCIkcmVzb3VyY2VzIiwicmVsYXRlZFZpZXdOb2RlIiwiY29udGV4dCIsInN1Y2Nlc3MiLCJyZWxhdGVkRmVlZCIsImVycm9yIiwiY29uc29sZSIsImxvZyIsIm1vcmVEYXRhIiwiY29udGFpbmVyTm9kZSIsInJlbW92ZUNsYXNzIiwicmVzdENvdW50IiwibW9yZUNvdW50Iiwic3Vic3RpdHV0ZSIsInNlbGVjdE1vcmVOb2RlIiwiYXR0ciIsImlubmVySFRNTCIsInRpdGxlTm9kZSIsIml0ZW1FbnRyeSIsIiRkZXNjcmlwdG9yIiwiaXRlbUhUTUwiLCJpdGVtTm9kZSIsIm9uU2VsZWN0Vmlld1JvdyIsImFkZENsYXNzIiwidG9nZ2xlVmlldyIsInJlbGF0ZWRLZXkiLCJkZXNjcmlwdG9yIiwia2V5IiwidmlldyIsImdldFZpZXciLCJzaG93Iiwib25TZWxlY3RNb3JlRGF0YSIsIm9uUmVmcmVzaFZpZXciLCJfb25SZWZyZXNoVmlldyIsInJlbW92ZSIsImRlc3Ryb3kiLCJmb3JFYWNoIiwiaGFuZGxlIiwidW5zdWJzY3JpYmUiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLE1BQU1BLFdBQVcsb0JBQVksbUJBQVosQ0FBakI7O0FBRUE7OztBQUdBLE1BQU1DLFVBQVUsdUJBQVEseUJBQVIsRUFBbUMsc0ZBQW5DLEVBQWdHLHNDQUFzQztBQUNwSkMsU0FBSyxxQkFEK0k7QUFFcEpDLGdCQUFZSCxTQUFTRyxVQUYrSDtBQUdwSkMsd0JBQW9CSixTQUFTSSxrQkFIdUg7QUFJcEpDLHlCQUFxQkwsU0FBU0ssbUJBSnNIO0FBS3BKQyxtQkFBZU4sU0FBU00sYUFMNEg7QUFNcEpDLGlCQUFhUCxTQUFTTyxXQU44SDtBQU9wSkMscUJBQWlCUixTQUFTUSxlQVAwSDtBQVFwSkMscUJBQWlCVCxTQUFTUyxlQVIwSDtBQVNwSkMsb0JBQWdCVixTQUFTVSxjQVQySDtBQVVwSkMsZUFBV1gsU0FBU1csU0FWZ0k7QUFXcEpDLG9CQUFnQixNQVhvSTtBQVlwSkMsaUJBQWEsSUFadUk7QUFhcEpDLHFCQUFpQixNQWJtSTtBQWNwSkMsa0JB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ZixDQUFuRSxFQUFxRztBQUNuRyxpQkFBSzBJLGNBQUw7QUFDRDtBQUNGO0FBQ0Y7QUFDRixLQTlibUo7QUErYnBKRSxhQUFTLFNBQVNBLE9BQVQsR0FBbUI7QUFDMUIsV0FBSzVHLFdBQUwsQ0FBaUI2RyxPQUFqQixDQUF5QixVQUFDQyxNQUFELEVBQVk7QUFDbkMsMEJBQVFDLFdBQVIsQ0FBb0JELE1BQXBCO0FBQ0QsT0FGRDtBQUdBLFdBQUtFLFNBQUwsQ0FBZUosT0FBZixFQUF3QkssU0FBeEI7QUFDRDtBQXBjbUosR0FBdEksQ0FBaEI7O29CQXVjZTlKLE8iLCJmaWxlIjoiUmVsYXRlZFZpZXdXaWRnZXQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuaW1wb3J0IHdoZW4gZnJvbSAnZG9qby93aGVuJztcclxuaW1wb3J0IGNvbm5lY3QgZnJvbSAnZG9qby9fYmFzZS9jb25uZWN0JztcclxuXHJcbmltcG9ydCBTRGF0YVN0b3JlIGZyb20gJy4vU3RvcmUvU0RhdGEnO1xyXG5pbXBvcnQgX0N1c3RvbWl6YXRpb25NaXhpbiBmcm9tICcuL19DdXN0b21pemF0aW9uTWl4aW4nO1xyXG5pbXBvcnQgX0FjdGlvbk1peGluIGZyb20gJy4vX0FjdGlvbk1peGluJztcclxuaW1wb3J0IF9SZWxhdGVkVmlld1dpZGdldEJhc2UgZnJvbSAnLi9fUmVsYXRlZFZpZXdXaWRnZXRCYXNlJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4vSTE4bic7XHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdyZWxhdGVkVmlld1dpZGdldCcpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5SZWxhdGVkVmlld1dpZGdldFxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLlJlbGF0ZWRWaWV3V2lkZ2V0JywgW19SZWxhdGVkVmlld1dpZGdldEJhc2UsIF9DdXN0b21pemF0aW9uTWl4aW4sIF9BY3Rpb25NaXhpbl0sIC8qKiBAbGVuZHMgYXJnb3MuUmVsYXRlZFZpZXdXaWRnZXQjICove1xyXG4gIGNsczogJ3JlbGF0ZWQtdmlldy13aWRnZXQnLFxyXG4gIG5vZGF0YVRleHQ6IHJlc291cmNlLm5vZGF0YVRleHQsXHJcbiAgc2VsZWN0TW9yZURhdGFUZXh0OiByZXNvdXJjZS5zZWxlY3RNb3JlRGF0YVRleHQsXHJcbiAgc2VsZWN0TW9yZURhdGFUZXh0MjogcmVzb3VyY2Uuc2VsZWN0TW9yZURhdGFUZXh0MixcclxuICBuYXZUb0xpc3RUZXh0OiByZXNvdXJjZS5uYXZUb0xpc3RUZXh0LFxyXG4gIGxvYWRpbmdUZXh0OiByZXNvdXJjZS5sb2FkaW5nVGV4dCxcclxuICByZWZyZXNoVmlld1RleHQ6IHJlc291cmNlLnJlZnJlc2hWaWV3VGV4dCxcclxuICBpdGVtT2ZDb3VudFRleHQ6IHJlc291cmNlLml0ZW1PZkNvdW50VGV4dCxcclxuICB0b3RhbENvdW50VGV4dDogcmVzb3VyY2UudG90YWxDb3VudFRleHQsXHJcbiAgdGl0bGVUZXh0OiByZXNvdXJjZS50aXRsZVRleHQsXHJcbiAgcGFyZW50UHJvcGVydHk6ICcka2V5JyxcclxuICBwYXJlbnRFbnRyeTogbnVsbCxcclxuICByZWxhdGVkUHJvcGVydHk6ICcka2V5JyxcclxuICByZWxhdGVkRW50cnk6IG51bGwsXHJcbiAgaXRlbXNOb2RlOiBudWxsLFxyXG4gIGxvYWRpbmdOb2RlOiBudWxsLFxyXG4gIGlkOiAncmVsYXRlZC12aWV3JyxcclxuICBkZXRhaWxWaWV3SWQ6IG51bGwsXHJcbiAgbGlzdFZpZXdJZDogbnVsbCxcclxuICBsaXN0Vmlld1doZXJlOiBudWxsLFxyXG4gIGVuYWJsZWQ6IGZhbHNlLFxyXG4gIHBhcmVudENvbGxlY3Rpb246IGZhbHNlLFxyXG4gIHBhcmVudENvbGxlY3Rpb25Qcm9wZXJ0eTogbnVsbCxcclxuICByZXNvdXJjZUtpbmQ6IG51bGwsXHJcbiAgY29udHJhY3ROYW1lOiBudWxsLFxyXG4gIHNlbGVjdDogbnVsbCxcclxuICB3aGVyZTogbnVsbCxcclxuICBzb3J0OiBudWxsLFxyXG4gIHN0b3JlOiBudWxsLFxyXG4gIHJlbGF0ZWREYXRhOiBudWxsLFxyXG4gIHF1ZXJ5T3B0aW9uczogbnVsbCxcclxuICBpc0xvYWRlZDogZmFsc2UsXHJcbiAgYXV0b0xvYWQ6IGZhbHNlLFxyXG4gIHdhaXQ6IGZhbHNlLFxyXG4gIHN0YXJ0SW5kZXg6IDEsXHJcbiAgcGFnZVNpemU6IDMsXHJcbiAgcmVsYXRlZFJlc3VsdHM6IG51bGwsXHJcbiAgaXRlbUNvdW50OiAwLFxyXG4gIF9pc0luaXRMb2FkOiB0cnVlLFxyXG4gIHNob3dUYWI6IHRydWUsXHJcbiAgc2hvd1RvdGFsSW5UYWI6IHRydWUsXHJcbiAgc2hvd1NlbGVjdE1vcmU6IGZhbHNlLFxyXG4gIGhpZGVXaGVuTm9EYXRhOiBmYWxzZSxcclxuICBlbmFibGVBY3Rpb25zOiB0cnVlLFxyXG4gIF9zdWJzY3JpYmVzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxlIHRoYXQgZGVmaW5lcyB0aGUgSFRNTCBNYXJrdXBcclxuICAgKi9cclxuICByZWxhdGVkQ29udGVudFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgIGlkPVwidGFiXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRhYk5vZGVcIiBjbGFzcz1cIicsXHJcbiAgICAneyUgaWYgKCQuYXV0b0xvYWQpIHsgJX0nLFxyXG4gICAgJ3RhYiAnLFxyXG4gICAgJ3slIH0gZWxzZSB7ICV9JyxcclxuICAgICd0YWIgY29sbGFwc2VkICcsXHJcbiAgICAneyUgfSAlfScsXHJcbiAgICAnXCIgPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cInRhYi1pdGVtc1wiPicsXHJcbiAgICAneyUhICQkLnJlbGF0ZWRWaWV3VGFiSXRlbXNUZW1wbGF0ZSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJwYW5lbFwiPicsXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiYWN0aW9uc05vZGVcIiBjbGFzcz1cImFjdGlvbi1pdGVtc1wiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiaGVhZGVyZU5vZGVcIiBjbGFzcz1cImhlYWRlclwiPicsXHJcbiAgICAneyUhICQkLnJlbGF0ZWRWaWV3SGVhZGVyVGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPGRpdiAgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInJlbGF0ZWRWaWV3Tm9kZVwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwiZm9vdGVyTm9kZVwiIGNsYXNzPVwiZm9vdGVyXCI+JyxcclxuICAgICd7JSEgJCQucmVsYXRlZFZpZXdGb290ZXJUZW1wbGF0ZSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIG5vZGF0YVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJub2RhdGFcIj4geyU6ICQkLm5vZGF0YVRleHQgJX08L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIHJlbGF0ZWRWaWV3VGFiSXRlbXNUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8c3BhbiBjbGFzcz1cInRhYi1pdGVtXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwidGFiLWljb25cIiBkYXRhLWRvam8tYXR0YWNoLWV2ZW50PVwib25jbGljazpvbk5hdmlnYXRlVG9MaXN0XCI+JyxcclxuICAgICc8aW1nIHNyYz1cInslPSAkLmljb24gJX1cIiBhbHQ9XCJ7JT0gJC50aXRsZSAlfVwiIC8+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzxkaXYgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRpdGxlTm9kZVwiIGRhdGEtZG9qby1hdHRhY2gtZXZlbnQ9XCJvbmNsaWNrOnRvZ2dsZVZpZXdcIiAgY2xhc3M9XCJ0aXRsZVwiID57JTogKCQudGl0bGUgKSAlfSA8L2Rpdj4nLFxyXG4gICAgJzwvc3Bhbj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJsaW5lLWJhclwiPjwvZGl2PicsXHJcbiAgXSksXHJcbiAgcmVsYXRlZFZpZXdIZWFkZXJUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICcnLFxyXG4gIF0pLFxyXG4gIHJlbGF0ZWRWaWV3Rm9vdGVyVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiAgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInNlbGVjdE1vcmVOb2RlXCIgY2xhc3M9XCJhY3Rpb25cIiBkYXRhLWRvam8tYXR0YWNoLWV2ZW50PVwib25jbGljazpvblNlbGVjdE1vcmVEYXRhXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2ICBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwibmF2dG9MaXN0Rm9vdGVyTm9kZVwiIGNsYXNzPVwiYWN0aW9uXCIgZGF0YS1kb2pvLWF0dGFjaC1ldmVudD1cIm9uY2xpY2s6b25OYXZpZ2F0ZVRvTGlzdFwiPnslOiAkJC5uYXZUb0xpc3RUZXh0ICV9PC9kaXY+JyxcclxuXHJcbiAgXSksXHJcbiAgcmVsYXRlZFZpZXdSb3dUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwicm93IHslOiAkJC5jbHMgJX1cIiAgZGF0YS1yZWxhdGVka2V5PVwieyU6ICQuJGtleSAlfVwiIGRhdGEtZGVzY3JpcHRvcj1cInslOiAkLiRkZXNjcmlwdG9yICV9XCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiaXRlbVwiPicsXHJcbiAgICAneyUhICQkLnJlbGF0ZWRJdGVtVGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICByZWxhdGVkSXRlbUljb25UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8aW1nIHNyYz1cInslOiAkJC5pdGVtSWNvbiAlfVwiIC8+JyxcclxuICBdKSxcclxuICByZWxhdGVkSXRlbUhlYWRlclRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXY+eyU6ICQuJGRlc2NyaXB0b3IgJX08L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIHJlbGF0ZWRJdGVtRGV0YWlsVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdj48L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIHJlbGF0ZWRJdGVtRm9vdGVyVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdj48L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIHJlbGF0ZWRJdGVtVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cIml0ZW0taWNvblwiPicsXHJcbiAgICAneyUhICQkLnJlbGF0ZWRJdGVtSWNvblRlbXBsYXRlICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJpdGVtLWhlYWRlclwiPicsXHJcbiAgICAneyUhICQkLnJlbGF0ZWRJdGVtSGVhZGVyVGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cIml0ZW0tZGV0YWlsXCI+JyxcclxuICAgICd7JSEgJCQucmVsYXRlZEl0ZW1EZXRhaWxUZW1wbGF0ZSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiaXRlbS1mb290ZXJcIj4nLFxyXG4gICAgJ3slISAkJC5yZWxhdGVkSXRlbUZvb3RlclRlbXBsYXRlICV9JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIGxvYWRpbmdUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwiYnVzeS1pbmRpY2F0b3ItY29udGFpbmVyXCIgYXJpYS1saXZlPVwicG9saXRlXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYnVzeS1pbmRpY2F0b3IgYWN0aXZlXCI+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIG9uZVwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciB0d29cIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdGhyZWVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZm91clwiPjwvZGl2PicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBmaXZlXCI+PC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gICAgJzxzcGFuPnslOiAkLmxvYWRpbmdUZXh0ICV9PC9zcGFuPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuXHJcbiAgcmVsYXRlZEFjdGlvblRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxzcGFuIGNsYXNzPVwiYWN0aW9uLWl0ZW1cIiBkYXRhLWlkPVwieyU9ICQuYWN0aW9uSW5kZXggJX1cIj4nLFxyXG4gICAgJzxpbWcgc3JjPVwieyU9ICQuaWNvbiAlfVwiIGFsdD1cInslPSAkLmxhYmVsICV9XCIgLz4nLFxyXG4gICAgJzwvc3Bhbj4nLFxyXG4gIF0pLFxyXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcbiAgICBsYW5nLm1peGluKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgaWYgKHRoaXMudGl0bGVUZXh0KSB7XHJcbiAgICAgIHRoaXMudGl0bGUgPSB0aGlzLnRpdGxlVGV4dDtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9zdWJzY3JpYmVzID0gW107XHJcbiAgICB0aGlzLl9zdWJzY3JpYmVzLnB1c2goY29ubmVjdC5zdWJzY3JpYmUoJy9hcHAvcmVmcmVzaCcsIHRoaXMsIHRoaXMuX29uQXBwUmVmcmVzaCkpO1xyXG4gIH0sXHJcbiAgcG9zdENyZWF0ZTogZnVuY3Rpb24gcG9zdENyZWF0ZSgpIHtcclxuICAgIGlmICgoIXRoaXMuc2hvd1RhYikgJiYgKHRoaXMudGFiTm9kZSkpIHtcclxuICAgICAgJCh0aGlzLnRhYk5vZGUpLnRvZ2dsZUNsYXNzKCdoaWRkZW4nKTtcclxuICAgIH1cclxuICAgIGlmICh0aGlzLmVuYWJsZUFjdGlvbnMpIHtcclxuICAgICAgdGhpcy5jcmVhdGVBY3Rpb25zKHRoaXMuX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQodGhpcy5jcmVhdGVBY3Rpb25MYXlvdXQoKSwgJ3JlbGF0ZWR2aWV3LWFjdGlvbnMnKSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjcmVhdGVBY3Rpb25MYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZUFjdGlvbkxheW91dCgpIHtcclxuICAgIHJldHVybiB0aGlzLmFjdGlvbnMgfHwgKHRoaXMuYWN0aW9ucyA9IFt7XHJcbiAgICAgIGlkOiAncmVmcmVzaCcsXHJcbiAgICAgIGNsczogJ2ZhIGZhLXJlZnJlc2ggZmEtMngnLFxyXG4gICAgICBsYWJlbDogdGhpcy5yZWZyZXNoVmlld1RleHQsXHJcbiAgICAgIGFjdGlvbjogJ29uUmVmcmVzaFZpZXcnLFxyXG4gICAgICBpc0VuYWJsZWQ6IHRydWUsXHJcbiAgICB9LCB7XHJcbiAgICAgIGlkOiAnbmF2dG9MaXN0VmlldycsXHJcbiAgICAgIGxhYmVsOiB0aGlzLnZpZXdDb250YWN0c0FjdGlvblRleHQsXHJcbiAgICAgIGNsczogJ2ZhIGZhLWxpc3QgZmEtMngnLFxyXG4gICAgICBhY3Rpb246ICdvbk5hdmlnYXRlVG9MaXN0JyxcclxuICAgICAgaXNFbmFibGVkOiB0cnVlLFxyXG4gICAgICBmbjogdGhpcy5vbk5hdmlnYXRlVG9MaXN0LmJpbmQodGhpcyksXHJcbiAgICB9XSk7XHJcbiAgfSxcclxuICBjcmVhdGVBY3Rpb25zOiBmdW5jdGlvbiBjcmVhdGVBY3Rpb25zKGFjdGlvbnMpIHtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYWN0aW9ucy5sZW5ndGg7IGkrKykge1xyXG4gICAgICBjb25zdCBhY3Rpb24gPSBhY3Rpb25zW2ldO1xyXG4gICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgIGFjdGlvbkluZGV4OiBpLFxyXG4gICAgICB9O1xyXG4gICAgICBsYW5nLm1peGluKGFjdGlvbiwgb3B0aW9ucyk7XHJcbiAgICAgIGNvbnN0IGFjdGlvblRlbXBsYXRlID0gYWN0aW9uLnRlbXBsYXRlIHx8IHRoaXMucmVsYXRlZEFjdGlvblRlbXBsYXRlO1xyXG4gICAgICBjb25zdCBhY3Rpb25Ob2RlID0gJChhY3Rpb25UZW1wbGF0ZS5hcHBseShhY3Rpb24sIGFjdGlvbi5pZCkpO1xyXG4gICAgICAkKGFjdGlvbk5vZGUpLm9uKCdjbGljaycsIHRoaXMub25JbnZva2VBY3Rpb25JdGVtLmJpbmQodGhpcykpO1xyXG4gICAgICAkKHRoaXMuYWN0aW9uc05vZGUpLmFwcGVuZChhY3Rpb25Ob2RlKTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLmFjdGlvbnMgPSBhY3Rpb25zO1xyXG4gIH0sXHJcbiAgb25JbnZva2VBY3Rpb25JdGVtOiBmdW5jdGlvbiBvbkludm9rZUFjdGlvbkl0ZW0oZXZ0KSB7XHJcbiAgICBjb25zdCBpbmRleCA9IGV2dC5jdXJyZW50VGFyZ2V0LmF0dHJpYnV0ZXNbJ2RhdGEtaWQnXS52YWx1ZTtcclxuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuYWN0aW9uc1tpbmRleF07XHJcbiAgICBpZiAoYWN0aW9uKSB7XHJcbiAgICAgIGlmIChhY3Rpb24uaXNFbmFibGVkKSB7XHJcbiAgICAgICAgaWYgKGFjdGlvbi5mbikge1xyXG4gICAgICAgICAgYWN0aW9uLmZuLmNhbGwoYWN0aW9uLnNjb3BlIHx8IHRoaXMsIGFjdGlvbik7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGlmICh0eXBlb2YgdGhpc1thY3Rpb24uYWN0aW9uXSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzW2FjdGlvbi5hY3Rpb25dKGV2dCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfSxcclxuICBnZXRTdG9yZTogZnVuY3Rpb24gZ2V0U3RvcmUoKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IG5ldyBTRGF0YVN0b3JlKHtcclxuICAgICAgc2VydmljZTogQXBwLmdldFNlcnZpY2UoKSxcclxuICAgICAgcmVzb3VyY2VLaW5kOiB0aGlzLnJlc291cmNlS2luZCxcclxuICAgICAgY29udHJhY3ROYW1lOiB0aGlzLmNvbnRyYWN0TmFtZSxcclxuICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICB9KTtcclxuICAgIHJldHVybiBzdG9yZTtcclxuICB9LFxyXG4gIGdldFF1ZXJ5T3B0aW9uczogZnVuY3Rpb24gZ2V0UXVlcnlPcHRpb25zKCkge1xyXG4gICAgbGV0IHdoZXJlRXhwcmVzc2lvbiA9ICcnO1xyXG4gICAgaWYgKHRoaXMuaGFzT3duUHJvcGVydHkoJ3doZXJlJykpIHtcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLndoZXJlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgd2hlcmVFeHByZXNzaW9uID0gdGhpcy53aGVyZSh0aGlzLnBhcmVudEVudHJ5KTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB3aGVyZUV4cHJlc3Npb24gPSB0aGlzLndoZXJlO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcXVlcnlPcHRpb25zID0ge1xyXG4gICAgICBjb3VudDogdGhpcy5wYWdlU2l6ZSB8fCAxLFxyXG4gICAgICBzdGFydDogMCxcclxuICAgICAgc2VsZWN0OiB0aGlzLnNlbGVjdCB8fCAnJyxcclxuICAgICAgd2hlcmU6IHdoZXJlRXhwcmVzc2lvbixcclxuICAgICAgc29ydDogdGhpcy5zb3J0IHx8ICcnLFxyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gcXVlcnlPcHRpb25zO1xyXG4gIH0sXHJcbiAgZmV0Y2hEYXRhOiBmdW5jdGlvbiBmZXRjaERhdGEoKSB7XHJcbiAgICBpZiAodGhpcy5zdGFydEluZGV4IDwgMSkge1xyXG4gICAgICB0aGlzLnN0YXJ0SW5kZXggPSAxO1xyXG4gICAgfVxyXG4gICAgdGhpcy5xdWVyeU9wdGlvbnMuc3RhcnQgPSB0aGlzLnN0YXJ0SW5kZXggLSAxO1xyXG4gICAgY29uc3QgcXVlcnlSZXN1bHRzID0gdGhpcy5zdG9yZS5xdWVyeShudWxsLCB0aGlzLnF1ZXJ5T3B0aW9ucyk7XHJcbiAgICB0aGlzLnN0YXJ0SW5kZXggPSB0aGlzLnN0YXJ0SW5kZXggPiAwICYmIHRoaXMucGFnZVNpemUgPiAwID8gdGhpcy5zdGFydEluZGV4ICsgdGhpcy5wYWdlU2l6ZSA6IDE7XHJcbiAgICByZXR1cm4gcXVlcnlSZXN1bHRzO1xyXG4gIH0sXHJcbiAgb25Jbml0OiBmdW5jdGlvbiBvbkluaXQoKSB7XHJcbiAgICB0aGlzLl9pc0luaXRMb2FkID0gdHJ1ZTtcclxuICAgIHRoaXMuc3RvcmUgPSB0aGlzLnN0b3JlIHx8IHRoaXMuZ2V0U3RvcmUoKTtcclxuICAgIHRoaXMucXVlcnlPcHRpb25zID0gdGhpcy5xdWVyeU9wdGlvbnMgfHwgdGhpcy5nZXRRdWVyeU9wdGlvbnMoKTtcclxuXHJcbiAgICBpZiAodGhpcy5hdXRvTG9hZCkge1xyXG4gICAgICB0aGlzLm9uTG9hZCgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgb25Mb2FkOiBmdW5jdGlvbiBvbkxvYWQoKSB7XHJcbiAgICBsZXQgZGF0YTtcclxuICAgIGlmICh0aGlzLnJlbGF0ZWREYXRhKSB7XHJcbiAgICAgIGlmICh0eXBlb2YgdGhpcy5yZWxhdGVkRGF0YSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIGRhdGEgPSB0aGlzLnJlbGF0ZWREYXRhKHRoaXMucGFyZW50RW50cnkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGRhdGEgPSB0aGlzLnJlbGF0ZWREYXRhO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhKSB7XHJcbiAgICAgICAgdGhpcy5yZWxhdGVkUmVzdWx0cyA9IHtcclxuICAgICAgICAgIHRvdGFsOiBkYXRhLmxlbmd0aCxcclxuICAgICAgICB9O1xyXG4gICAgICAgIHRoaXMucGFnZVNpemUgPSBkYXRhLmxlbmd0aDtcclxuICAgICAgICB0aGlzLm9uQXBwbHkoZGF0YSk7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSBpZiAodGhpcy5wYXJlbnRDb2xsZWN0aW9uKSB7XHJcbiAgICAgIHRoaXMucmVsYXRlZFJlc3VsdHMgPSB7XHJcbiAgICAgICAgdG90YWw6IHRoaXMucGFyZW50RW50cnlbdGhpcy5wYXJlbnRDb2xsZWN0aW9uUHJvcGVydHldLiRyZXNvdXJjZXMubGVuZ3RoLFxyXG4gICAgICB9O1xyXG4gICAgICB0aGlzLnBhZ2VTaXplID0gdGhpcy5yZWxhdGVkUmVzdWx0cy50b3RhbDtcclxuICAgICAgdGhpcy5vbkFwcGx5KHRoaXMucGFyZW50RW50cnlbdGhpcy5wYXJlbnRDb2xsZWN0aW9uUHJvcGVydHldLiRyZXNvdXJjZXMpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKCF0aGlzLmxvYWRpbmdOb2RlKSB7XHJcbiAgICAgICAgdGhpcy5sb2FkaW5nTm9kZSA9ICQodGhpcy5sb2FkaW5nVGVtcGxhdGUuYXBwbHkodGhpcykpO1xyXG4gICAgICAgICQodGhpcy5yZWxhdGVkVmlld05vZGUpLmFwcGVuZCh0aGlzLmxvYWRpbmdOb2RlKTtcclxuICAgICAgfVxyXG4gICAgICAkKHRoaXMubG9hZGluZ05vZGUpLnRvZ2dsZUNsYXNzKCdsb2FkaW5nJyk7XHJcbiAgICAgIGlmICh0aGlzLndhaXQpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy5yZWxhdGVkUmVzdWx0cyA9IHRoaXMuZmV0Y2hEYXRhKCk7XHJcbiAgICAgICgoY29udGV4dCwgcmVsYXRlZFJlc3VsdHMpID0+IHtcclxuICAgICAgICB0cnkge1xyXG4gICAgICAgICAgd2hlbihyZWxhdGVkUmVzdWx0cywgZnVuY3Rpb24gc3VjY2VzcyhyZWxhdGVkRmVlZCkge1xyXG4gICAgICAgICAgICB0aGlzLm9uQXBwbHkocmVsYXRlZEZlZWQpO1xyXG4gICAgICAgICAgfS5iaW5kKGNvbnRleHQpKTtcclxuICAgICAgICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgICAgICAgY29uc29sZS5sb2coJ0Vycm9yIGZldGNoaW5nIHJlbGF0ZWQgdmlldyBkYXRhOicgKyBlcnJvcik7Ly9lc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgICAgfVxyXG4gICAgICB9KSh0aGlzLCB0aGlzLnJlbGF0ZWRSZXN1bHRzKTtcclxuICAgIH1cclxuICAgIHRoaXMuaXNMb2FkZWQgPSB0cnVlO1xyXG4gIH0sXHJcbiAgb25BcHBseTogZnVuY3Rpb24gb25BcHBseShyZWxhdGVkRmVlZCkge1xyXG4gICAgdHJ5IHtcclxuICAgICAgaWYgKCF0aGlzLml0ZW1zTm9kZSkge1xyXG4gICAgICAgIHRoaXMuaXRlbXNOb2RlID0gJChcIjxkaXYgaWQ9J2l0ZW1zTm9kZScgY2xhc3M9J2l0ZW1zJz48ZGl2PlwiKTtcclxuICAgICAgICAkKHRoaXMucmVsYXRlZFZpZXdOb2RlKS5hcHBlbmQodGhpcy5pdGVtc05vZGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAocmVsYXRlZEZlZWQubGVuZ3RoID4gMCkge1xyXG4gICAgICAgIGxldCBtb3JlRGF0YTtcclxuICAgICAgICAkKHRoaXMuY29udGFpbmVyTm9kZSkucmVtb3ZlQ2xhc3MoJ2hpZGRlbicpO1xyXG4gICAgICAgICQodGhpcy50YWJOb2RlKS5yZW1vdmVDbGFzcygnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgdGhpcy5pdGVtQ291bnQgPSB0aGlzLml0ZW1Db3VudCArIHJlbGF0ZWRGZWVkLmxlbmd0aDtcclxuICAgICAgICBjb25zdCByZXN0Q291bnQgPSB0aGlzLnJlbGF0ZWRSZXN1bHRzLnRvdGFsIC0gdGhpcy5pdGVtQ291bnQ7XHJcbiAgICAgICAgaWYgKHJlc3RDb3VudCA+IDApIHtcclxuICAgICAgICAgIGNvbnN0IG1vcmVDb3VudCA9IChyZXN0Q291bnQgPj0gdGhpcy5wYWdlU2l6ZSkgPyB0aGlzLnBhZ2VTaXplIDogcmVzdENvdW50O1xyXG4gICAgICAgICAgbW9yZURhdGEgPSBzdHJpbmcuc3Vic3RpdHV0ZSh0aGlzLnNlbGVjdE1vcmVEYXRhVGV4dCwgW21vcmVDb3VudCwgdGhpcy5yZWxhdGVkUmVzdWx0cy50b3RhbF0pO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBtb3JlRGF0YSA9ICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2hvd1NlbGVjdE1vcmUpIHtcclxuICAgICAgICAgICQodGhpcy5zZWxlY3RNb3JlTm9kZSkuYXR0cih7XHJcbiAgICAgICAgICAgIGlubmVySFRNTDogbW9yZURhdGEsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJCh0aGlzLnNlbGVjdE1vcmVOb2RlKS5hdHRyKHtcclxuICAgICAgICAgICAgaW5uZXJIVE1MOiAnJyxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYgKHRoaXMuc2hvd1RvdGFsSW5UYWIpIHtcclxuICAgICAgICAgICQodGhpcy50aXRsZU5vZGUpLmF0dHIoe1xyXG4gICAgICAgICAgICBpbm5lckhUTUw6IGAke3RoaXMudGl0bGV9ICAke3N0cmluZy5zdWJzdGl0dXRlKHRoaXMudG90YWxDb3VudFRleHQsIFt0aGlzLnJlbGF0ZWRSZXN1bHRzLnRvdGFsXSl9YCxcclxuICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHJlbGF0ZWRGZWVkLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICBjb25zdCBpdGVtRW50cnkgPSByZWxhdGVkRmVlZFtpXTtcclxuICAgICAgICAgIGl0ZW1FbnRyeS4kZGVzY3JpcHRvciA9IGl0ZW1FbnRyeS4kZGVzY3JpcHRvciB8fCByZWxhdGVkRmVlZC4kZGVzY3JpcHRvcjtcclxuICAgICAgICAgIGNvbnN0IGl0ZW1IVE1MID0gdGhpcy5yZWxhdGVkVmlld1Jvd1RlbXBsYXRlLmFwcGx5KGl0ZW1FbnRyeSwgdGhpcyk7XHJcbiAgICAgICAgICBjb25zdCBpdGVtTm9kZSA9ICQoaXRlbUhUTUwpO1xyXG4gICAgICAgICAgJChpdGVtTm9kZSkub24oJ2NsaWNrJywgdGhpcy5vblNlbGVjdFZpZXdSb3cuYmluZCh0aGlzKSk7XHJcbiAgICAgICAgICAkKHRoaXMuaXRlbXNOb2RlKS5hcHBlbmQoaXRlbU5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBpZiAodGhpcy5oaWRlV2hlbk5vRGF0YSkge1xyXG4gICAgICAgICAgJCh0aGlzLmNvbnRhaW5lck5vZGUpLmFkZENsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgJCh0aGlzLmNvbnRhaW5lck5vZGUpLnJlbW92ZUNsYXNzKCdoaWRkZW4nKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh0aGlzLml0ZW1zTm9kZSkuYXBwZW5kKHRoaXMubm9kYXRhVGVtcGxhdGUuYXBwbHkodGhpcy5wYXJlbnRFbnRyeSwgdGhpcykpO1xyXG4gICAgICAgIGlmICh0aGlzLnNob3dUb3RhbEluVGFiKSB7XHJcbiAgICAgICAgICAkKHRoaXMudGl0bGVOb2RlKS5hdHRyKHtcclxuICAgICAgICAgICAgaW5uZXJIVE1MOiBgJHt0aGlzLnRpdGxlfSAgJHtzdHJpbmcuc3Vic3RpdHV0ZSh0aGlzLnRvdGFsQ291bnRUZXh0LCBbMCwgMF0pfWAsXHJcbiAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgJCh0aGlzLnNlbGVjdE1vcmVOb2RlKS5hdHRyKHtcclxuICAgICAgICAgIGlubmVySFRNTDogJycsXHJcbiAgICAgICAgfSk7XHJcbiAgICAgICAgaWYgKHRoaXMuX2lzSW5pdExvYWQpIHtcclxuICAgICAgICAgIHRoaXMuX2lzSW5pdExvYWQgPSBmYWxzZTtcclxuICAgICAgICAgICQodGhpcy50YWJOb2RlKS50b2dnbGVDbGFzcygnY29sbGFwc2VkJyk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgICQodGhpcy5sb2FkaW5nTm9kZSkudG9nZ2xlQ2xhc3MoJ2xvYWRpbmcnKTtcclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBhcHBseWluZyBkYXRhIGZvciByZWxhdGVkIHZpZXcgd2lkZ2V0OicgKyBlcnJvcik7Ly9lc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICB9XHJcbiAgfSxcclxuICB0b2dnbGVWaWV3OiBmdW5jdGlvbiB0b2dnbGVWaWV3KGV2dCkge1xyXG4gICAgJCh0aGlzLnRhYk5vZGUpLnRvZ2dsZUNsYXNzKCdjb2xsYXBzZWQnKTtcclxuXHJcbiAgICBpZiAoIXRoaXMuaXNMb2FkZWQpIHtcclxuICAgICAgdGhpcy5vbkxvYWQoKTtcclxuICAgIH1cclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9LFxyXG4gIG9uU2VsZWN0Vmlld1JvdzogZnVuY3Rpb24gb25TZWxlY3RWaWV3Um93KGV2dCkge1xyXG4gICAgY29uc3QgcmVsYXRlZEtleSA9IGV2dC5jdXJyZW50VGFyZ2V0LmF0dHJpYnV0ZXNbJ2RhdGEtcmVsYXRlZGtleSddLnZhbHVlO1xyXG4gICAgY29uc3QgZGVzY3JpcHRvciA9IGV2dC5jdXJyZW50VGFyZ2V0LmF0dHJpYnV0ZXNbJ2RhdGEtZGVzY3JpcHRvciddLnZhbHVlO1xyXG5cclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGRlc2NyaXB0b3IsXHJcbiAgICAgIGtleTogcmVsYXRlZEtleSxcclxuICAgICAgdGl0bGU6IGRlc2NyaXB0b3IsXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHZpZXcgPSBBcHAuZ2V0Vmlldyh0aGlzLmRldGFpbFZpZXdJZCk7XHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICB2aWV3LnNob3cob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfSxcclxuICBvbk5hdmlnYXRlVG9MaXN0OiBmdW5jdGlvbiBvbk5hdmlnYXRlVG9MaXN0KGV2dCkge1xyXG4gICAgbGV0IHdoZXJlRXhwcmVzc2lvbjtcclxuICAgIGlmICh0aGlzLmhhc093blByb3BlcnR5KCdsaXN0Vmlld1doZXJlJykpIHtcclxuICAgICAgaWYgKHR5cGVvZiB0aGlzLmxpc3RWaWV3V2hlcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICB3aGVyZUV4cHJlc3Npb24gPSB0aGlzLmxpc3RWaWV3V2hlcmUodGhpcy5wYXJlbnRFbnRyeSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgd2hlcmVFeHByZXNzaW9uID0gdGhpcy5saXN0Vmlld1doZXJlO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5oYXNPd25Qcm9wZXJ0eSgnd2hlcmUnKSkge1xyXG4gICAgICAgIGlmICh0eXBlb2YgdGhpcy53aGVyZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgd2hlcmVFeHByZXNzaW9uID0gdGhpcy53aGVyZSh0aGlzLnBhcmVudEVudHJ5KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgd2hlcmVFeHByZXNzaW9uID0gdGhpcy53aGVyZTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBkZXNjcmlwdG9yOiB0aGlzLnRpdGxlLFxyXG4gICAgICB3aGVyZTogd2hlcmVFeHByZXNzaW9uLFxyXG4gICAgICB0aXRsZTogdGhpcy50aXRsZSxcclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgdmlldyA9IEFwcC5nZXRWaWV3KHRoaXMubGlzdFZpZXdJZCk7XHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICB2aWV3LnNob3cob3B0aW9ucyk7XHJcbiAgICB9XHJcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfSxcclxuICBvblNlbGVjdE1vcmVEYXRhOiBmdW5jdGlvbiBvblNlbGVjdE1vcmVEYXRhKGV2dCkge1xyXG4gICAgdGhpcy5vbkxvYWQoKTtcclxuICAgIGV2dC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICB9LFxyXG4gIG9uUmVmcmVzaFZpZXc6IGZ1bmN0aW9uIG9uUmVmcmVzaFZpZXcoZXZ0KSB7XHJcbiAgICB0aGlzLl9vblJlZnJlc2hWaWV3KCk7XHJcbiAgICBldnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgfSxcclxuICBfb25SZWZyZXNoVmlldzogZnVuY3Rpb24gX29uUmVmcmVzaFZpZXcoKSB7XHJcbiAgICBpZiAodGhpcy5pdGVtc05vZGUpIHtcclxuICAgICAgJCh0aGlzLml0ZW1zTm9kZSkucmVtb3ZlKCk7XHJcbiAgICAgIHRoaXMuaXRlbXNOb2RlID0gbnVsbDtcclxuICAgIH1cclxuICAgIHRoaXMuc3RhcnRJbmRleCA9IDE7XHJcbiAgICB0aGlzLml0ZW1Db3VudCA9IDA7XHJcbiAgICB0aGlzLmlzTG9hZGVkID0gZmFsc2U7XHJcbiAgICB0aGlzLm9uTG9hZCgpO1xyXG4gIH0sXHJcbiAgX29uQXBwUmVmcmVzaDogZnVuY3Rpb24gX29uQXBwUmVmcmVzaChkYXRhKSB7XHJcbiAgICBpZiAoZGF0YSAmJiBkYXRhLmRhdGEpIHtcclxuICAgICAgaWYgKGRhdGEucmVzb3VyY2VLaW5kID09PSB0aGlzLnJlc291cmNlS2luZCkge1xyXG4gICAgICAgIGlmICh0aGlzLnBhcmVudEVudHJ5ICYmICh0aGlzLnBhcmVudEVudHJ5W3RoaXMucGFyZW50UHJvcGVydHldID09PSBkYXRhLmRhdGFbdGhpcy5yZWxhdGVkUHJvcGVydHldKSkge1xyXG4gICAgICAgICAgdGhpcy5fb25SZWZyZXNoVmlldygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgIHRoaXMuX3N1YnNjcmliZXMuZm9yRWFjaCgoaGFuZGxlKSA9PiB7XHJcbiAgICAgIGNvbm5lY3QudW5zdWJzY3JpYmUoaGFuZGxlKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoZGVzdHJveSwgYXJndW1lbnRzKTtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==