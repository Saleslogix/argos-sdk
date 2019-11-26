define('argos/_SDataListMixin', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/when', 'dojo/string', './Store/SData', './Utility', './Models/Types'], function (module, exports, _declare, _lang, _when, _string, _SData, _Utility, _Types) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _when2 = _interopRequireDefault(_when);

  var _string2 = _interopRequireDefault(_string);

  var _SData2 = _interopRequireDefault(_SData);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _Types2 = _interopRequireDefault(_Types);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var __class = (0, _declare2.default)('argos._SDataListMixin', null, /** @lends argos._SDataListMixin# */{
    /**
     * @property request Object SData request passed into the store. Optional.
     */
    request: null,

    /**
     * @cfg {String} resourceKind
     * The SData resource kind the view is responsible for.  This will be used as the default resource kind
     * for all SData requests.
     */
    resourceKind: '',
    /**
     * @cfg {String[]}
     * A list of fields to be selected in an SData request.
     */
    querySelect: [],
    /**
     * @cfg {String[]?}
     * A list of child properties to be included in an SData request.
     */
    queryInclude: [],
    /**
     * @cfg {String}
     * The default order by expression for an SData request.
     */
    queryOrderBy: null,
    /**
     * @cfg {String/Function}
     * The default where expression for an SData request.
     */
    queryWhere: null,
    /**
     * @cfg {Object}
     * Key/value map of additional query arguments to add to the request.
     * Example:
     *     queryArgs: { _filter: 'Active' }
     *
     *     /sdata/app/dynamic/-/resource?_filter=Active&where=""&format=json
     */
    queryArgs: null,
    /**
     * @cfg {String?/Function?}
     * The default resource property for an SData request.
     */
    resourceProperty: null,
    /**
     * @cfg {String?/Function?}
     * The default resource predicate for an SData request.
     */
    resourcePredicate: null,

    contractName: 'dynamic',

    itemsProperty: '$resources',
    idProperty: '$key',
    labelProperty: '$descriptor',
    entityProperty: '$name',
    versionProperty: '$etag',

    /**
     * Constructs a where expression using the provided format string and extracting the needed property from entry
     * @param {Object} entry Data point to extract from.
     * @param {String} fmt Format string to be replaced where `${0}` will be the extracted property.
     * @param {String} property Property name to extract from the entry. May be a path: `'Address.City'`.
     * @return {String}
     */
    formatRelatedQuery: function formatRelatedQuery(entry, fmt, property) {
      return _string2.default.substitute(fmt, [_lang2.default.getObject(property || '$key', false, entry)]);
    },
    getContext: function getContext() {
      return _lang2.default.mixin(this.inherited(getContext, arguments), {
        resourceKind: this.resourceKind
      });
    },
    _onRefresh: function _onRefresh(options) {
      if (this.resourceKind && options.resourceKind === this.resourceKind) {
        this.refreshRequired = true;
      }
    },
    createStore: function createStore() {
      return new _SData2.default({
        service: this.getConnection(),
        request: this.request,
        contractName: this.contractName,
        resourceKind: this.resourceKind,
        resourceProperty: this.resourceProperty,
        resourcePredicate: this.resourcePredicate,
        include: this.queryInclude,
        select: this.querySelect,
        where: this.queryWhere,
        queryArgs: this.queryArgs,
        orderBy: this.queryOrderBy,
        itemsProperty: this.itemsProperty,
        idProperty: this.idProperty,
        labelProperty: this.labelProperty,
        entityProperty: this.entityProperty,
        versionProperty: this.versionProperty,
        scope: this
      });
    },
    _buildQueryExpression: function _buildQueryExpression() {
      var options = this.options;
      var passed = options && (options.query || options.where);
      return passed ? this.query ? '(' + _Utility2.default.expand(this, passed) + ') and (' + this.query + ')' : '(' + _Utility2.default.expand(this, passed) + ')' : this.query; // eslint-disable-line
    },
    _applyStateToQueryOptions: function _applyStateToQueryOptions(queryOptions) {
      var options = this.options;

      queryOptions.count = this.pageSize;
      queryOptions.start = this.position;
      if (options) {
        if (options.select) {
          queryOptions.select = options.select;
        }

        if (options.include) {
          queryOptions.include = options.include;
        }

        if (options.orderBy) {
          queryOptions.sort = options.orderBy;
        }

        if (options.contractName) {
          queryOptions.contractName = options.contractName;
        }

        if (options.resourceKind) {
          queryOptions.resourceKind = options.resourceKind;
        }

        if (options.resourceProperty) {
          queryOptions.resourceProperty = options.resourceProperty;
        }

        if (options.resourcePredicate) {
          queryOptions.resourcePredicate = options.resourcePredicate;
        }

        if (options.queryArgs) {
          queryOptions.queryArgs = options.queryArgs;
        }
      }

      return queryOptions;
    },
    formatSearchQuery: function formatSearchQuery(query) {
      return query;
    },
    escapeSearchQuery: function escapeSearchQuery(query) {
      return (query || '').replace(/"/g, '""');
    },
    hasMoreData: function hasMoreData() {
      var start = this.position;
      var count = this.pageSize;
      var total = this.total;

      if (start > 0 && count > 0 && total >= 0) {
        return this.remaining === -1 || this.remaining > 0;
      }
      return true; // no way to determine, always assume more data
    },
    getListCount: function getListCount(options) {
      var store = new _SData2.default({
        service: App.services.crm,
        resourceKind: this.resourceKind,
        contractName: this.contractName,
        scope: this
      });

      var queryOptions = {
        count: 1,
        start: 0,
        select: '',
        where: options.where,
        sort: ''
      };

      var queryResults = store.query(null, queryOptions);

      return new Promise(function (resolve, reject) {
        (0, _when2.default)(queryResults, function () {
          resolve(queryResults.total);
        }, function (err) {
          reject(err);
        });
      });
    },
    initModel: function initModel() {
      var model = this.getModel();
      if (model) {
        this._model = model;
        this._model.init();
        if (this._model.ModelType === _Types2.default.SDATA) {
          this._applyViewToModel(this._model);
        }
      }
    },
    _applyViewToModel: function _applyViewToModel(model) {
      if (!model) {
        return;
      }

      var queryModel = model._getQueryModelByName('list');
      if (this.resourceKind) {
        model.resourceKind = this.resourceKind;
      }

      if (!queryModel) {
        return;
      }

      // Attempt to mixin the view's querySelect, queryInclude, queryWhere,
      // queryArgs, queryOrderBy, resourceProperty, resourcePredicate properties
      // into the layout. The past method of extending a querySelect for example,
      // was to modify the protoype of the view's querySelect array.
      if (this.querySelect && this.querySelect.length) {
        /* eslint-disable */
        console.warn('A view\'s querySelect is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        if (!queryModel.querySelect) {
          queryModel.querySelect = [];
        }

        queryModel.querySelect = queryModel.querySelect.concat(this.querySelect.filter(function (item) {
          return queryModel.querySelect.indexOf(item) < 0;
        }));
      }

      if (this.queryInclude && this.queryInclude.length) {
        /* eslint-disable */
        console.warn('A view\'s queryInclude is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        if (!queryModel.queryInclude) {
          queryModel.queryInclude = [];
        }

        queryModel.queryInclude = queryModel.queryInclude.concat(this.queryInclude.filter(function (item) {
          return queryModel.queryInclude.indexOf(item) < 0;
        }));
      }

      if (this.queryWhere) {
        /* eslint-disable */
        console.warn('A view\'s queryWhere is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        queryModel.queryWhere = this.queryWhere;
      }

      if (this.queryArgs) {
        /* eslint-disable */
        console.warn('A view\'s queryArgs is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        queryModel.queryArgs = _lang2.default.mixin({}, queryModel.queryArgs, this.queryArgs);
      }

      if (this.queryOrderBy && this.queryOrderBy.length) {
        /* eslint-disable */
        console.warn('A view\'s queryOrderBy is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        if (Array.isArray(this.queryOrderBy)) {
          if (!queryModel.queryOrderBy) {
            queryModel.queryOrderBy = [];
          }

          queryModel.queryOrderBy = queryModel.queryOrderBy.concat(this.queryOrderBy.filter(function (item) {
            return queryModel.queryOrderBy.indexOf(item) < 0;
          }));
        } else {
          queryModel.queryOrderBy = this.queryOrderBy;
        }
      }

      if (this.resourceProperty) {
        /* eslint-disable */
        console.warn('A view\'s resourceProperty is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        queryModel.resourceProperty = this.resourceProperty;
      }

      if (this.resourcePredicate) {
        /* eslint-disable */
        console.warn('A view\'s resourcePredicate is deprecated. Register a customization to the models layout instead.');
        /* eslint-enable */
        queryModel.resourcePredicate = this.resourcePredicate;
      }
    }
  }); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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
   * @class argos._SDataListMixin
   * @classdesc Enables SData for the List view.
   * Adds the SData store to the view and exposes the needed properties for creating a Feed request.
   * @requires argos.SData
   * @requires argos.Utility
   */
  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fU0RhdGFMaXN0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsInJlcXVlc3QiLCJyZXNvdXJjZUtpbmQiLCJxdWVyeVNlbGVjdCIsInF1ZXJ5SW5jbHVkZSIsInF1ZXJ5T3JkZXJCeSIsInF1ZXJ5V2hlcmUiLCJxdWVyeUFyZ3MiLCJyZXNvdXJjZVByb3BlcnR5IiwicmVzb3VyY2VQcmVkaWNhdGUiLCJjb250cmFjdE5hbWUiLCJpdGVtc1Byb3BlcnR5IiwiaWRQcm9wZXJ0eSIsImxhYmVsUHJvcGVydHkiLCJlbnRpdHlQcm9wZXJ0eSIsInZlcnNpb25Qcm9wZXJ0eSIsImZvcm1hdFJlbGF0ZWRRdWVyeSIsImVudHJ5IiwiZm10IiwicHJvcGVydHkiLCJzdWJzdGl0dXRlIiwiZ2V0T2JqZWN0IiwiZ2V0Q29udGV4dCIsIm1peGluIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiX29uUmVmcmVzaCIsIm9wdGlvbnMiLCJyZWZyZXNoUmVxdWlyZWQiLCJjcmVhdGVTdG9yZSIsInNlcnZpY2UiLCJnZXRDb25uZWN0aW9uIiwiaW5jbHVkZSIsInNlbGVjdCIsIndoZXJlIiwib3JkZXJCeSIsInNjb3BlIiwiX2J1aWxkUXVlcnlFeHByZXNzaW9uIiwicGFzc2VkIiwicXVlcnkiLCJleHBhbmQiLCJfYXBwbHlTdGF0ZVRvUXVlcnlPcHRpb25zIiwicXVlcnlPcHRpb25zIiwiY291bnQiLCJwYWdlU2l6ZSIsInN0YXJ0IiwicG9zaXRpb24iLCJzb3J0IiwiZm9ybWF0U2VhcmNoUXVlcnkiLCJlc2NhcGVTZWFyY2hRdWVyeSIsInJlcGxhY2UiLCJoYXNNb3JlRGF0YSIsInRvdGFsIiwicmVtYWluaW5nIiwiZ2V0TGlzdENvdW50Iiwic3RvcmUiLCJBcHAiLCJzZXJ2aWNlcyIsImNybSIsInF1ZXJ5UmVzdWx0cyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwiaW5pdE1vZGVsIiwibW9kZWwiLCJnZXRNb2RlbCIsIl9tb2RlbCIsImluaXQiLCJNb2RlbFR5cGUiLCJTREFUQSIsIl9hcHBseVZpZXdUb01vZGVsIiwicXVlcnlNb2RlbCIsIl9nZXRRdWVyeU1vZGVsQnlOYW1lIiwibGVuZ3RoIiwiY29uc29sZSIsIndhcm4iLCJjb25jYXQiLCJmaWx0ZXIiLCJpdGVtIiwiaW5kZXhPZiIsIkFycmF5IiwiaXNBcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCQSxNQUFNQSxVQUFVLHVCQUFRLHVCQUFSLEVBQWlDLElBQWpDLEVBQXVDLG9DQUFvQztBQUN6Rjs7O0FBR0FDLGFBQVMsSUFKZ0Y7O0FBTXpGOzs7OztBQUtBQyxrQkFBYyxFQVgyRTtBQVl6Rjs7OztBQUlBQyxpQkFBYSxFQWhCNEU7QUFpQnpGOzs7O0FBSUFDLGtCQUFjLEVBckIyRTtBQXNCekY7Ozs7QUFJQUMsa0JBQWMsSUExQjJFO0FBMkJ6Rjs7OztBQUlBQyxnQkFBWSxJQS9CNkU7QUFnQ3pGOzs7Ozs7OztBQVFBQyxlQUFXLElBeEM4RTtBQXlDekY7Ozs7QUFJQUMsc0JBQWtCLElBN0N1RTtBQThDekY7Ozs7QUFJQUMsdUJBQW1CLElBbERzRTs7QUFvRHpGQyxrQkFBYyxTQXBEMkU7O0FBc0R6RkMsbUJBQWUsWUF0RDBFO0FBdUR6RkMsZ0JBQVksTUF2RDZFO0FBd0R6RkMsbUJBQWUsYUF4RDBFO0FBeUR6RkMsb0JBQWdCLE9BekR5RTtBQTBEekZDLHFCQUFpQixPQTFEd0U7O0FBNER6Rjs7Ozs7OztBQU9BQyx3QkFBb0IsU0FBU0Esa0JBQVQsQ0FBNEJDLEtBQTVCLEVBQW1DQyxHQUFuQyxFQUF3Q0MsUUFBeEMsRUFBa0Q7QUFDcEUsYUFBTyxpQkFBT0MsVUFBUCxDQUFrQkYsR0FBbEIsRUFBdUIsQ0FBQyxlQUFLRyxTQUFMLENBQWVGLFlBQVksTUFBM0IsRUFBbUMsS0FBbkMsRUFBMENGLEtBQTFDLENBQUQsQ0FBdkIsQ0FBUDtBQUNELEtBckV3RjtBQXNFekZLLGdCQUFZLFNBQVNBLFVBQVQsR0FBc0I7QUFDaEMsYUFBTyxl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QTNDLEVBQW1EO0FBQ2pEO0FBQ0FDLGdCQUFRQyxJQUFSO0FBQ0E7QUFDQSxZQUFJSyxNQUFNQyxPQUFOLENBQWMsS0FBSzdFLFlBQW5CLENBQUosRUFBc0M7QUFDcEMsY0FBSSxDQUFDbUUsV0FBV25FLFlBQWhCLEVBQThCO0FBQzVCbUUsdUJBQVduRSxZQUFYLEdBQTBCLEVBQTFCO0FBQ0Q7O0FBRURtRSxxQkFBV25FLFlBQVgsR0FBMEJtRSxXQUFXbkUsWUFBWCxDQUF3QndFLE1BQXhCLENBQStCLEtBQUt4RSxZQUFMLENBQWtCeUUsTUFBbEIsQ0FBeUIsVUFBQ0MsSUFBRCxFQUFVO0FBQzFGLG1CQUFPUCxXQUFXbkUsWUFBWCxDQUF3QjJFLE9BQXhCLENBQWdDRCxJQUFoQyxJQUF3QyxDQUEvQztBQUNELFdBRndELENBQS9CLENBQTFCO0FBR0QsU0FSRCxNQVFPO0FBQ0xQLHFCQUFXbkUsWUFBWCxHQUEwQixLQUFLQSxZQUEvQjtBQUNEO0FBQ0Y7O0FBRUQsVUFBSSxLQUFLRyxnQkFBVCxFQUEyQjtBQUN6QjtBQUNBbUUsZ0JBQVFDLElBQVI7QUFDQTtBQUNBSixtQkFBV2hFLGdCQUFYLEdBQThCLEtBQUtBLGdCQUFuQztBQUNEOztBQUVELFVBQUksS0FBS0MsaUJBQVQsRUFBNEI7QUFDMUI7QUFDQWtFLGdCQUFRQyxJQUFSO0FBQ0E7QUFDQUosbUJBQVcvRCxpQkFBWCxHQUErQixLQUFLQSxpQkFBcEM7QUFDRDtBQUNGO0FBL1J3RixHQUEzRSxDQUFoQixDLENBOUJBOzs7Ozs7Ozs7Ozs7Ozs7QUFlQTs7Ozs7OztvQkFpVGVULE8iLCJmaWxlIjoiX1NEYXRhTGlzdE1peGluLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLl9TRGF0YUxpc3RNaXhpblxyXG4gKiBAY2xhc3NkZXNjIEVuYWJsZXMgU0RhdGEgZm9yIHRoZSBMaXN0IHZpZXcuXHJcbiAqIEFkZHMgdGhlIFNEYXRhIHN0b3JlIHRvIHRoZSB2aWV3IGFuZCBleHBvc2VzIHRoZSBuZWVkZWQgcHJvcGVydGllcyBmb3IgY3JlYXRpbmcgYSBGZWVkIHJlcXVlc3QuXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5TRGF0YVxyXG4gKiBAcmVxdWlyZXMgYXJnb3MuVXRpbGl0eVxyXG4gKi9cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IGxhbmcgZnJvbSAnZG9qby9fYmFzZS9sYW5nJztcclxuaW1wb3J0IHdoZW4gZnJvbSAnZG9qby93aGVuJztcclxuaW1wb3J0IHN0cmluZyBmcm9tICdkb2pvL3N0cmluZyc7XHJcbmltcG9ydCBTRGF0YSBmcm9tICcuL1N0b3JlL1NEYXRhJztcclxuaW1wb3J0IHV0aWxpdHkgZnJvbSAnLi9VdGlsaXR5JztcclxuaW1wb3J0IE1PREVMX1RZUEVTIGZyb20gJy4vTW9kZWxzL1R5cGVzJztcclxuXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fU0RhdGFMaXN0TWl4aW4nLCBudWxsLCAvKiogQGxlbmRzIGFyZ29zLl9TRGF0YUxpc3RNaXhpbiMgKi97XHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHJlcXVlc3QgT2JqZWN0IFNEYXRhIHJlcXVlc3QgcGFzc2VkIGludG8gdGhlIHN0b3JlLiBPcHRpb25hbC5cclxuICAgKi9cclxuICByZXF1ZXN0OiBudWxsLFxyXG5cclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmd9IHJlc291cmNlS2luZFxyXG4gICAqIFRoZSBTRGF0YSByZXNvdXJjZSBraW5kIHRoZSB2aWV3IGlzIHJlc3BvbnNpYmxlIGZvci4gIFRoaXMgd2lsbCBiZSB1c2VkIGFzIHRoZSBkZWZhdWx0IHJlc291cmNlIGtpbmRcclxuICAgKiBmb3IgYWxsIFNEYXRhIHJlcXVlc3RzLlxyXG4gICAqL1xyXG4gIHJlc291cmNlS2luZDogJycsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nW119XHJcbiAgICogQSBsaXN0IG9mIGZpZWxkcyB0byBiZSBzZWxlY3RlZCBpbiBhbiBTRGF0YSByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIHF1ZXJ5U2VsZWN0OiBbXSxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmdbXT99XHJcbiAgICogQSBsaXN0IG9mIGNoaWxkIHByb3BlcnRpZXMgdG8gYmUgaW5jbHVkZWQgaW4gYW4gU0RhdGEgcmVxdWVzdC5cclxuICAgKi9cclxuICBxdWVyeUluY2x1ZGU6IFtdLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ31cclxuICAgKiBUaGUgZGVmYXVsdCBvcmRlciBieSBleHByZXNzaW9uIGZvciBhbiBTRGF0YSByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIHF1ZXJ5T3JkZXJCeTogbnVsbCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmcvRnVuY3Rpb259XHJcbiAgICogVGhlIGRlZmF1bHQgd2hlcmUgZXhwcmVzc2lvbiBmb3IgYW4gU0RhdGEgcmVxdWVzdC5cclxuICAgKi9cclxuICBxdWVyeVdoZXJlOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge09iamVjdH1cclxuICAgKiBLZXkvdmFsdWUgbWFwIG9mIGFkZGl0aW9uYWwgcXVlcnkgYXJndW1lbnRzIHRvIGFkZCB0byB0aGUgcmVxdWVzdC5cclxuICAgKiBFeGFtcGxlOlxyXG4gICAqICAgICBxdWVyeUFyZ3M6IHsgX2ZpbHRlcjogJ0FjdGl2ZScgfVxyXG4gICAqXHJcbiAgICogICAgIC9zZGF0YS9hcHAvZHluYW1pYy8tL3Jlc291cmNlP19maWx0ZXI9QWN0aXZlJndoZXJlPVwiXCImZm9ybWF0PWpzb25cclxuICAgKi9cclxuICBxdWVyeUFyZ3M6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nPy9GdW5jdGlvbj99XHJcbiAgICogVGhlIGRlZmF1bHQgcmVzb3VyY2UgcHJvcGVydHkgZm9yIGFuIFNEYXRhIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcmVzb3VyY2VQcm9wZXJ0eTogbnVsbCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmc/L0Z1bmN0aW9uP31cclxuICAgKiBUaGUgZGVmYXVsdCByZXNvdXJjZSBwcmVkaWNhdGUgZm9yIGFuIFNEYXRhIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcmVzb3VyY2VQcmVkaWNhdGU6IG51bGwsXHJcblxyXG4gIGNvbnRyYWN0TmFtZTogJ2R5bmFtaWMnLFxyXG5cclxuICBpdGVtc1Byb3BlcnR5OiAnJHJlc291cmNlcycsXHJcbiAgaWRQcm9wZXJ0eTogJyRrZXknLFxyXG4gIGxhYmVsUHJvcGVydHk6ICckZGVzY3JpcHRvcicsXHJcbiAgZW50aXR5UHJvcGVydHk6ICckbmFtZScsXHJcbiAgdmVyc2lvblByb3BlcnR5OiAnJGV0YWcnLFxyXG5cclxuICAvKipcclxuICAgKiBDb25zdHJ1Y3RzIGEgd2hlcmUgZXhwcmVzc2lvbiB1c2luZyB0aGUgcHJvdmlkZWQgZm9ybWF0IHN0cmluZyBhbmQgZXh0cmFjdGluZyB0aGUgbmVlZGVkIHByb3BlcnR5IGZyb20gZW50cnlcclxuICAgKiBAcGFyYW0ge09iamVjdH0gZW50cnkgRGF0YSBwb2ludCB0byBleHRyYWN0IGZyb20uXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGZtdCBGb3JtYXQgc3RyaW5nIHRvIGJlIHJlcGxhY2VkIHdoZXJlIGAkezB9YCB3aWxsIGJlIHRoZSBleHRyYWN0ZWQgcHJvcGVydHkuXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IHByb3BlcnR5IFByb3BlcnR5IG5hbWUgdG8gZXh0cmFjdCBmcm9tIHRoZSBlbnRyeS4gTWF5IGJlIGEgcGF0aDogYCdBZGRyZXNzLkNpdHknYC5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9XHJcbiAgICovXHJcbiAgZm9ybWF0UmVsYXRlZFF1ZXJ5OiBmdW5jdGlvbiBmb3JtYXRSZWxhdGVkUXVlcnkoZW50cnksIGZtdCwgcHJvcGVydHkpIHtcclxuICAgIHJldHVybiBzdHJpbmcuc3Vic3RpdHV0ZShmbXQsIFtsYW5nLmdldE9iamVjdChwcm9wZXJ0eSB8fCAnJGtleScsIGZhbHNlLCBlbnRyeSldKTtcclxuICB9LFxyXG4gIGdldENvbnRleHQ6IGZ1bmN0aW9uIGdldENvbnRleHQoKSB7XHJcbiAgICByZXR1cm4gbGFuZy5taXhpbih0aGlzLmluaGVyaXRlZChnZXRDb250ZXh0LCBhcmd1bWVudHMpLCB7XHJcbiAgICAgIHJlc291cmNlS2luZDogdGhpcy5yZXNvdXJjZUtpbmQsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIF9vblJlZnJlc2g6IGZ1bmN0aW9uIF9vblJlZnJlc2gob3B0aW9ucykge1xyXG4gICAgaWYgKHRoaXMucmVzb3VyY2VLaW5kICYmIG9wdGlvbnMucmVzb3VyY2VLaW5kID09PSB0aGlzLnJlc291cmNlS2luZCkge1xyXG4gICAgICB0aGlzLnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjcmVhdGVTdG9yZTogZnVuY3Rpb24gY3JlYXRlU3RvcmUoKSB7XHJcbiAgICByZXR1cm4gbmV3IFNEYXRhKHtcclxuICAgICAgc2VydmljZTogdGhpcy5nZXRDb25uZWN0aW9uKCksXHJcbiAgICAgIHJlcXVlc3Q6IHRoaXMucmVxdWVzdCxcclxuICAgICAgY29udHJhY3ROYW1lOiB0aGlzLmNvbnRyYWN0TmFtZSxcclxuICAgICAgcmVzb3VyY2VLaW5kOiB0aGlzLnJlc291cmNlS2luZCxcclxuICAgICAgcmVzb3VyY2VQcm9wZXJ0eTogdGhpcy5yZXNvdXJjZVByb3BlcnR5LFxyXG4gICAgICByZXNvdXJjZVByZWRpY2F0ZTogdGhpcy5yZXNvdXJjZVByZWRpY2F0ZSxcclxuICAgICAgaW5jbHVkZTogdGhpcy5xdWVyeUluY2x1ZGUsXHJcbiAgICAgIHNlbGVjdDogdGhpcy5xdWVyeVNlbGVjdCxcclxuICAgICAgd2hlcmU6IHRoaXMucXVlcnlXaGVyZSxcclxuICAgICAgcXVlcnlBcmdzOiB0aGlzLnF1ZXJ5QXJncyxcclxuICAgICAgb3JkZXJCeTogdGhpcy5xdWVyeU9yZGVyQnksXHJcbiAgICAgIGl0ZW1zUHJvcGVydHk6IHRoaXMuaXRlbXNQcm9wZXJ0eSxcclxuICAgICAgaWRQcm9wZXJ0eTogdGhpcy5pZFByb3BlcnR5LFxyXG4gICAgICBsYWJlbFByb3BlcnR5OiB0aGlzLmxhYmVsUHJvcGVydHksXHJcbiAgICAgIGVudGl0eVByb3BlcnR5OiB0aGlzLmVudGl0eVByb3BlcnR5LFxyXG4gICAgICB2ZXJzaW9uUHJvcGVydHk6IHRoaXMudmVyc2lvblByb3BlcnR5LFxyXG4gICAgICBzY29wZTogdGhpcyxcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgX2J1aWxkUXVlcnlFeHByZXNzaW9uOiBmdW5jdGlvbiBfYnVpbGRRdWVyeUV4cHJlc3Npb24oKSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG4gICAgY29uc3QgcGFzc2VkID0gb3B0aW9ucyAmJiAob3B0aW9ucy5xdWVyeSB8fCBvcHRpb25zLndoZXJlKTtcclxuICAgIHJldHVybiBwYXNzZWQgPyB0aGlzLnF1ZXJ5ID8gJygnICsgdXRpbGl0eS5leHBhbmQodGhpcywgcGFzc2VkKSArICcpIGFuZCAoJyArIHRoaXMucXVlcnkgKyAnKScgOiAnKCcgKyB1dGlsaXR5LmV4cGFuZCh0aGlzLCBwYXNzZWQpICsgJyknIDogdGhpcy5xdWVyeTsvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgfSxcclxuICBfYXBwbHlTdGF0ZVRvUXVlcnlPcHRpb25zOiBmdW5jdGlvbiBfYXBwbHlTdGF0ZVRvUXVlcnlPcHRpb25zKHF1ZXJ5T3B0aW9ucykge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHRoaXMub3B0aW9ucztcclxuXHJcbiAgICBxdWVyeU9wdGlvbnMuY291bnQgPSB0aGlzLnBhZ2VTaXplO1xyXG4gICAgcXVlcnlPcHRpb25zLnN0YXJ0ID0gdGhpcy5wb3NpdGlvbjtcclxuICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLnNlbGVjdCkge1xyXG4gICAgICAgIHF1ZXJ5T3B0aW9ucy5zZWxlY3QgPSBvcHRpb25zLnNlbGVjdDtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuaW5jbHVkZSkge1xyXG4gICAgICAgIHF1ZXJ5T3B0aW9ucy5pbmNsdWRlID0gb3B0aW9ucy5pbmNsdWRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5vcmRlckJ5KSB7XHJcbiAgICAgICAgcXVlcnlPcHRpb25zLnNvcnQgPSBvcHRpb25zLm9yZGVyQnk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLmNvbnRyYWN0TmFtZSkge1xyXG4gICAgICAgIHF1ZXJ5T3B0aW9ucy5jb250cmFjdE5hbWUgPSBvcHRpb25zLmNvbnRyYWN0TmFtZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMucmVzb3VyY2VLaW5kKSB7XHJcbiAgICAgICAgcXVlcnlPcHRpb25zLnJlc291cmNlS2luZCA9IG9wdGlvbnMucmVzb3VyY2VLaW5kO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5yZXNvdXJjZVByb3BlcnR5KSB7XHJcbiAgICAgICAgcXVlcnlPcHRpb25zLnJlc291cmNlUHJvcGVydHkgPSBvcHRpb25zLnJlc291cmNlUHJvcGVydHk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLnJlc291cmNlUHJlZGljYXRlKSB7XHJcbiAgICAgICAgcXVlcnlPcHRpb25zLnJlc291cmNlUHJlZGljYXRlID0gb3B0aW9ucy5yZXNvdXJjZVByZWRpY2F0ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMucXVlcnlBcmdzKSB7XHJcbiAgICAgICAgcXVlcnlPcHRpb25zLnF1ZXJ5QXJncyA9IG9wdGlvbnMucXVlcnlBcmdzO1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHF1ZXJ5T3B0aW9ucztcclxuICB9LFxyXG4gIGZvcm1hdFNlYXJjaFF1ZXJ5OiBmdW5jdGlvbiBmb3JtYXRTZWFyY2hRdWVyeShxdWVyeSkge1xyXG4gICAgcmV0dXJuIHF1ZXJ5O1xyXG4gIH0sXHJcbiAgZXNjYXBlU2VhcmNoUXVlcnk6IGZ1bmN0aW9uIGVzY2FwZVNlYXJjaFF1ZXJ5KHF1ZXJ5KSB7XHJcbiAgICByZXR1cm4gKHF1ZXJ5IHx8ICcnKS5yZXBsYWNlKC9cIi9nLCAnXCJcIicpO1xyXG4gIH0sXHJcbiAgaGFzTW9yZURhdGE6IGZ1bmN0aW9uIGhhc01vcmVEYXRhKCkge1xyXG4gICAgY29uc3Qgc3RhcnQgPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgY29uc3QgY291bnQgPSB0aGlzLnBhZ2VTaXplO1xyXG4gICAgY29uc3QgdG90YWwgPSB0aGlzLnRvdGFsO1xyXG5cclxuICAgIGlmIChzdGFydCA+IDAgJiYgY291bnQgPiAwICYmIHRvdGFsID49IDApIHtcclxuICAgICAgcmV0dXJuIHRoaXMucmVtYWluaW5nID09PSAtMSB8fCB0aGlzLnJlbWFpbmluZyA+IDA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdHJ1ZTsgLy8gbm8gd2F5IHRvIGRldGVybWluZSwgYWx3YXlzIGFzc3VtZSBtb3JlIGRhdGFcclxuICB9LFxyXG4gIGdldExpc3RDb3VudDogZnVuY3Rpb24gZ2V0TGlzdENvdW50KG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gbmV3IFNEYXRhKHtcclxuICAgICAgc2VydmljZTogQXBwLnNlcnZpY2VzLmNybSxcclxuICAgICAgcmVzb3VyY2VLaW5kOiB0aGlzLnJlc291cmNlS2luZCxcclxuICAgICAgY29udHJhY3ROYW1lOiB0aGlzLmNvbnRyYWN0TmFtZSxcclxuICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICB9KTtcclxuXHJcbiAgICBjb25zdCBxdWVyeU9wdGlvbnMgPSB7XHJcbiAgICAgIGNvdW50OiAxLFxyXG4gICAgICBzdGFydDogMCxcclxuICAgICAgc2VsZWN0OiAnJyxcclxuICAgICAgd2hlcmU6IG9wdGlvbnMud2hlcmUsXHJcbiAgICAgIHNvcnQ6ICcnLFxyXG4gICAgfTtcclxuXHJcbiAgICBjb25zdCBxdWVyeVJlc3VsdHMgPSBzdG9yZS5xdWVyeShudWxsLCBxdWVyeU9wdGlvbnMpO1xyXG5cclxuICAgIHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcbiAgICAgIHdoZW4ocXVlcnlSZXN1bHRzLCAoKSA9PiB7XHJcbiAgICAgICAgcmVzb2x2ZShxdWVyeVJlc3VsdHMudG90YWwpO1xyXG4gICAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgICAgcmVqZWN0KGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBpbml0TW9kZWw6IGZ1bmN0aW9uIGluaXRNb2RlbCgpIHtcclxuICAgIGNvbnN0IG1vZGVsID0gdGhpcy5nZXRNb2RlbCgpO1xyXG4gICAgaWYgKG1vZGVsKSB7XHJcbiAgICAgIHRoaXMuX21vZGVsID0gbW9kZWw7XHJcbiAgICAgIHRoaXMuX21vZGVsLmluaXQoKTtcclxuICAgICAgaWYgKHRoaXMuX21vZGVsLk1vZGVsVHlwZSA9PT0gTU9ERUxfVFlQRVMuU0RBVEEpIHtcclxuICAgICAgICB0aGlzLl9hcHBseVZpZXdUb01vZGVsKHRoaXMuX21vZGVsKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgX2FwcGx5Vmlld1RvTW9kZWw6IGZ1bmN0aW9uIF9hcHBseVZpZXdUb01vZGVsKG1vZGVsKSB7XHJcbiAgICBpZiAoIW1vZGVsKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBxdWVyeU1vZGVsID0gbW9kZWwuX2dldFF1ZXJ5TW9kZWxCeU5hbWUoJ2xpc3QnKTtcclxuICAgIGlmICh0aGlzLnJlc291cmNlS2luZCkge1xyXG4gICAgICBtb2RlbC5yZXNvdXJjZUtpbmQgPSB0aGlzLnJlc291cmNlS2luZDtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXF1ZXJ5TW9kZWwpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEF0dGVtcHQgdG8gbWl4aW4gdGhlIHZpZXcncyBxdWVyeVNlbGVjdCwgcXVlcnlJbmNsdWRlLCBxdWVyeVdoZXJlLFxyXG4gICAgLy8gcXVlcnlBcmdzLCBxdWVyeU9yZGVyQnksIHJlc291cmNlUHJvcGVydHksIHJlc291cmNlUHJlZGljYXRlIHByb3BlcnRpZXNcclxuICAgIC8vIGludG8gdGhlIGxheW91dC4gVGhlIHBhc3QgbWV0aG9kIG9mIGV4dGVuZGluZyBhIHF1ZXJ5U2VsZWN0IGZvciBleGFtcGxlLFxyXG4gICAgLy8gd2FzIHRvIG1vZGlmeSB0aGUgcHJvdG95cGUgb2YgdGhlIHZpZXcncyBxdWVyeVNlbGVjdCBhcnJheS5cclxuICAgIGlmICh0aGlzLnF1ZXJ5U2VsZWN0ICYmIHRoaXMucXVlcnlTZWxlY3QubGVuZ3RoKSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcXVlcnlTZWxlY3QgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgaWYgKCFxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0KSB7XHJcbiAgICAgICAgcXVlcnlNb2RlbC5xdWVyeVNlbGVjdCA9IFtdO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0ID0gcXVlcnlNb2RlbC5xdWVyeVNlbGVjdC5jb25jYXQodGhpcy5xdWVyeVNlbGVjdC5maWx0ZXIoKGl0ZW0pID0+IHtcclxuICAgICAgICByZXR1cm4gcXVlcnlNb2RlbC5xdWVyeVNlbGVjdC5pbmRleE9mKGl0ZW0pIDwgMDtcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5SW5jbHVkZSAmJiB0aGlzLnF1ZXJ5SW5jbHVkZS5sZW5ndGgpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeUluY2x1ZGUgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgaWYgKCFxdWVyeU1vZGVsLnF1ZXJ5SW5jbHVkZSkge1xyXG4gICAgICAgIHF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlID0gW107XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlID0gcXVlcnlNb2RlbC5xdWVyeUluY2x1ZGUuY29uY2F0KHRoaXMucXVlcnlJbmNsdWRlLmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBxdWVyeU1vZGVsLnF1ZXJ5SW5jbHVkZS5pbmRleE9mKGl0ZW0pIDwgMDtcclxuICAgICAgfSkpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5V2hlcmUpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeVdoZXJlIGlzIGRlcHJlY2F0ZWQuIFJlZ2lzdGVyIGEgY3VzdG9taXphdGlvbiB0byB0aGUgbW9kZWxzIGxheW91dCBpbnN0ZWFkLmApO1xyXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlICovXHJcbiAgICAgIHF1ZXJ5TW9kZWwucXVlcnlXaGVyZSA9IHRoaXMucXVlcnlXaGVyZTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5xdWVyeUFyZ3MpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeUFyZ3MgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgcXVlcnlNb2RlbC5xdWVyeUFyZ3MgPSBsYW5nLm1peGluKHt9LCBxdWVyeU1vZGVsLnF1ZXJ5QXJncywgdGhpcy5xdWVyeUFyZ3MpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5T3JkZXJCeSAmJiB0aGlzLnF1ZXJ5T3JkZXJCeS5sZW5ndGgpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeU9yZGVyQnkgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgaWYgKEFycmF5LmlzQXJyYXkodGhpcy5xdWVyeU9yZGVyQnkpKSB7XHJcbiAgICAgICAgaWYgKCFxdWVyeU1vZGVsLnF1ZXJ5T3JkZXJCeSkge1xyXG4gICAgICAgICAgcXVlcnlNb2RlbC5xdWVyeU9yZGVyQnkgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHF1ZXJ5TW9kZWwucXVlcnlPcmRlckJ5ID0gcXVlcnlNb2RlbC5xdWVyeU9yZGVyQnkuY29uY2F0KHRoaXMucXVlcnlPcmRlckJ5LmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICAgICAgcmV0dXJuIHF1ZXJ5TW9kZWwucXVlcnlPcmRlckJ5LmluZGV4T2YoaXRlbSkgPCAwO1xyXG4gICAgICAgIH0pKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBxdWVyeU1vZGVsLnF1ZXJ5T3JkZXJCeSA9IHRoaXMucXVlcnlPcmRlckJ5O1xyXG4gICAgICB9XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmVzb3VyY2VQcm9wZXJ0eSkge1xyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4gICAgICBjb25zb2xlLndhcm4oYEEgdmlldydzIHJlc291cmNlUHJvcGVydHkgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgcXVlcnlNb2RlbC5yZXNvdXJjZVByb3BlcnR5ID0gdGhpcy5yZXNvdXJjZVByb3BlcnR5O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnJlc291cmNlUHJlZGljYXRlKSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcmVzb3VyY2VQcmVkaWNhdGUgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgcXVlcnlNb2RlbC5yZXNvdXJjZVByZWRpY2F0ZSA9IHRoaXMucmVzb3VyY2VQcmVkaWNhdGU7XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=