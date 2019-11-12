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
      return _lang2.default.mixin(this.inherited(arguments), {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fU0RhdGFMaXN0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsInJlcXVlc3QiLCJyZXNvdXJjZUtpbmQiLCJxdWVyeVNlbGVjdCIsInF1ZXJ5SW5jbHVkZSIsInF1ZXJ5T3JkZXJCeSIsInF1ZXJ5V2hlcmUiLCJxdWVyeUFyZ3MiLCJyZXNvdXJjZVByb3BlcnR5IiwicmVzb3VyY2VQcmVkaWNhdGUiLCJjb250cmFjdE5hbWUiLCJpdGVtc1Byb3BlcnR5IiwiaWRQcm9wZXJ0eSIsImxhYmVsUHJvcGVydHkiLCJlbnRpdHlQcm9wZXJ0eSIsInZlcnNpb25Qcm9wZXJ0eSIsImZvcm1hdFJlbGF0ZWRRdWVyeSIsImVudHJ5IiwiZm10IiwicHJvcGVydHkiLCJzdWJzdGl0dXRlIiwiZ2V0T2JqZWN0IiwiZ2V0Q29udGV4dCIsIm1peGluIiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiX29uUmVmcmVzaCIsIm9wdGlvbnMiLCJyZWZyZXNoUmVxdWlyZWQiLCJjcmVhdGVTdG9yZSIsInNlcnZpY2UiLCJnZXRDb25uZWN0aW9uIiwiaW5jbHVkZSIsInNlbGVjdCIsIndoZXJlIiwib3JkZXJCeSIsInNjb3BlIiwiX2J1aWxkUXVlcnlFeHByZXNzaW9uIiwicGFzc2VkIiwicXVlcnkiLCJleHBhbmQiLCJfYXBwbHlTdGF0ZVRvUXVlcnlPcHRpb25zIiwicXVlcnlPcHRpb25zIiwiY291bnQiLCJwYWdlU2l6ZSIsInN0YXJ0IiwicG9zaXRpb24iLCJzb3J0IiwiZm9ybWF0U2VhcmNoUXVlcnkiLCJlc2NhcGVTZWFyY2hRdWVyeSIsInJlcGxhY2UiLCJoYXNNb3JlRGF0YSIsInRvdGFsIiwicmVtYWluaW5nIiwiZ2V0TGlzdENvdW50Iiwic3RvcmUiLCJBcHAiLCJzZXJ2aWNlcyIsImNybSIsInF1ZXJ5UmVzdWx0cyIsIlByb21pc2UiLCJyZXNvbHZlIiwicmVqZWN0IiwiZXJyIiwiaW5pdE1vZGVsIiwibW9kZWwiLCJnZXRNb2RlbCIsIl9tb2RlbCIsImluaXQiLCJNb2RlbFR5cGUiLCJTREFUQSIsIl9hcHBseVZpZXdUb01vZGVsIiwicXVlcnlNb2RlbCIsIl9nZXRRdWVyeU1vZGVsQnlOYW1lIiwibGVuZ3RoIiwiY29uc29sZSIsIndhcm4iLCJjb25jYXQiLCJmaWx0ZXIiLCJpdGVtIiwiaW5kZXhPZiIsIkFycmF5IiwiaXNBcnJheSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQThCQSxNQUFNQSxVQUFVLHVCQUFRLHVCQUFSLEVBQWlDLElBQWpDLEVBQXVDLG9DQUFvQztBQUN6Rjs7O0FBR0FDLGFBQVMsSUFKZ0Y7O0FBTXpGOzs7OztBQUtBQyxrQkFBYyxFQVgyRTtBQVl6Rjs7OztBQUlBQyxpQkFBYSxFQWhCNEU7QUFpQnpGOzs7O0FBSUFDLGtCQUFjLEVBckIyRTtBQXNCekY7Ozs7QUFJQUMsa0JBQWMsSUExQjJFO0FBMkJ6Rjs7OztBQUlBQyxnQkFBWSxJQS9CNkU7QUFnQ3pGOzs7Ozs7OztBQVFBQyxlQUFXLElBeEM4RTtBQXlDekY7Ozs7QUFJQUMsc0JBQWtCLElBN0N1RTtBQThDekY7Ozs7QUFJQUMsdUJBQW1CLElBbERzRTs7QUFvRHpGQyxrQkFBYyxTQXBEMkU7O0FBc0R6RkMsbUJBQWUsWUF0RDBFO0FBdUR6RkMsZ0JBQVksTUF2RDZFO0FBd0R6RkMsbUJBQWUsYUF4RDBFO0FBeUR6RkMsb0JBQWdCLE9BekR5RTtBQTBEekZDLHFCQUFpQixPQTFEd0U7O0FBNER6Rjs7Ozs7OztBQU9BQyx3QkFBb0IsU0FBU0Esa0JBQVQsQ0FBNEJDLEtBQTVCLEVBQW1DQyxHQUFuQyxFQUF3Q0MsUUFBeEMsRUFBa0Q7QUFDcEUsYUFBTyxpQkFBT0MsVUFBUCxDQUFrQkYsR0FBbEIsRUFBdUIsQ0FBQyxlQUFLRyxTQUFMLENBQWVGLFlBQVksTUFBM0IsRUFBbUMsS0FBbkMsRUFBMENGLEtBQTFDLENBQUQsQ0FBdkIsQ0FBUDtBQUNELEtBckV3RjtBQXNFekZLLGdCQUFZLFNBQVNBLFVBQVQsR0FBc0I7QUFDaEMsYUFBTyxl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akQ7QUFDQUMsZ0JBQVFDLElBQVI7QUFDQTtBQUNBLFlBQUlLLE1BQU1DLE9BQU4sQ0FBYyxLQUFLN0UsWUFBbkIsQ0FBSixFQUFzQztBQUNwQyxjQUFJLENBQUNtRSxXQUFXbkUsWUFBaEIsRUFBOEI7QUFDNUJtRSx1QkFBV25FLFlBQVgsR0FBMEIsRUFBMUI7QUFDRDs7QUFFRG1FLHFCQUFXbkUsWUFBWCxHQUEwQm1FLFdBQVduRSxZQUFYLENBQXdCd0UsTUFBeEIsQ0FBK0IsS0FBS3hFLFlBQUwsQ0FBa0J5RSxNQUFsQixDQUF5QixVQUFDQyxJQUFELEVBQVU7QUFDMUYsbUJBQU9QLFdBQVduRSxZQUFYLENBQXdCMkUsT0FBeEIsQ0FBZ0NELElBQWhDLElBQXdDLENBQS9DO0FBQ0QsV0FGd0QsQ0FBL0IsQ0FBMUI7QUFHRCxTQVJELE1BUU87QUFDTFAscUJBQVduRSxZQUFYLEdBQTBCLEtBQUtBLFlBQS9CO0FBQ0Q7QUFDRjs7QUFFRCxVQUFJLEtBQUtHLGdCQUFULEVBQTJCO0FBQ3pCO0FBQ0FtRSxnQkFBUUMsSUFBUjtBQUNBO0FBQ0FKLG1CQUFXaEUsZ0JBQVgsR0FBOEIsS0FBS0EsZ0JBQW5DO0FBQ0Q7O0FBRUQsVUFBSSxLQUFLQyxpQkFBVCxFQUE0QjtBQUMxQjtBQUNBa0UsZ0JBQVFDLElBQVI7QUFDQTtBQUNBSixtQkFBVy9ELGlCQUFYLEdBQStCLEtBQUtBLGlCQUFwQztBQUNEO0FBQ0Y7QUEvUndGLEdBQTNFLENBQWhCLEMsQ0E5QkE7Ozs7Ozs7Ozs7Ozs7OztBQWVBOzs7Ozs7O29CQWlUZVQsTyIsImZpbGUiOiJfU0RhdGFMaXN0TWl4aW4uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX1NEYXRhTGlzdE1peGluXHJcbiAqIEBjbGFzc2Rlc2MgRW5hYmxlcyBTRGF0YSBmb3IgdGhlIExpc3Qgdmlldy5cclxuICogQWRkcyB0aGUgU0RhdGEgc3RvcmUgdG8gdGhlIHZpZXcgYW5kIGV4cG9zZXMgdGhlIG5lZWRlZCBwcm9wZXJ0aWVzIGZvciBjcmVhdGluZyBhIEZlZWQgcmVxdWVzdC5cclxuICogQHJlcXVpcmVzIGFyZ29zLlNEYXRhXHJcbiAqIEByZXF1aXJlcyBhcmdvcy5VdGlsaXR5XHJcbiAqL1xyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgd2hlbiBmcm9tICdkb2pvL3doZW4nO1xyXG5pbXBvcnQgc3RyaW5nIGZyb20gJ2Rvam8vc3RyaW5nJztcclxuaW1wb3J0IFNEYXRhIGZyb20gJy4vU3RvcmUvU0RhdGEnO1xyXG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuL1V0aWxpdHknO1xyXG5pbXBvcnQgTU9ERUxfVFlQRVMgZnJvbSAnLi9Nb2RlbHMvVHlwZXMnO1xyXG5cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLl9TRGF0YUxpc3RNaXhpbicsIG51bGwsIC8qKiBAbGVuZHMgYXJnb3MuX1NEYXRhTGlzdE1peGluIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkgcmVxdWVzdCBPYmplY3QgU0RhdGEgcmVxdWVzdCBwYXNzZWQgaW50byB0aGUgc3RvcmUuIE9wdGlvbmFsLlxyXG4gICAqL1xyXG4gIHJlcXVlc3Q6IG51bGwsXHJcblxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ30gcmVzb3VyY2VLaW5kXHJcbiAgICogVGhlIFNEYXRhIHJlc291cmNlIGtpbmQgdGhlIHZpZXcgaXMgcmVzcG9uc2libGUgZm9yLiAgVGhpcyB3aWxsIGJlIHVzZWQgYXMgdGhlIGRlZmF1bHQgcmVzb3VyY2Uga2luZFxyXG4gICAqIGZvciBhbGwgU0RhdGEgcmVxdWVzdHMuXHJcbiAgICovXHJcbiAgcmVzb3VyY2VLaW5kOiAnJyxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmdbXX1cclxuICAgKiBBIGxpc3Qgb2YgZmllbGRzIHRvIGJlIHNlbGVjdGVkIGluIGFuIFNEYXRhIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcXVlcnlTZWxlY3Q6IFtdLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZ1tdP31cclxuICAgKiBBIGxpc3Qgb2YgY2hpbGQgcHJvcGVydGllcyB0byBiZSBpbmNsdWRlZCBpbiBhbiBTRGF0YSByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIHF1ZXJ5SW5jbHVkZTogW10sXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7U3RyaW5nfVxyXG4gICAqIFRoZSBkZWZhdWx0IG9yZGVyIGJ5IGV4cHJlc3Npb24gZm9yIGFuIFNEYXRhIHJlcXVlc3QuXHJcbiAgICovXHJcbiAgcXVlcnlPcmRlckJ5OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZy9GdW5jdGlvbn1cclxuICAgKiBUaGUgZGVmYXVsdCB3aGVyZSBleHByZXNzaW9uIGZvciBhbiBTRGF0YSByZXF1ZXN0LlxyXG4gICAqL1xyXG4gIHF1ZXJ5V2hlcmU6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQGNmZyB7T2JqZWN0fVxyXG4gICAqIEtleS92YWx1ZSBtYXAgb2YgYWRkaXRpb25hbCBxdWVyeSBhcmd1bWVudHMgdG8gYWRkIHRvIHRoZSByZXF1ZXN0LlxyXG4gICAqIEV4YW1wbGU6XHJcbiAgICogICAgIHF1ZXJ5QXJnczogeyBfZmlsdGVyOiAnQWN0aXZlJyB9XHJcbiAgICpcclxuICAgKiAgICAgL3NkYXRhL2FwcC9keW5hbWljLy0vcmVzb3VyY2U/X2ZpbHRlcj1BY3RpdmUmd2hlcmU9XCJcIiZmb3JtYXQ9anNvblxyXG4gICAqL1xyXG4gIHF1ZXJ5QXJnczogbnVsbCxcclxuICAvKipcclxuICAgKiBAY2ZnIHtTdHJpbmc/L0Z1bmN0aW9uP31cclxuICAgKiBUaGUgZGVmYXVsdCByZXNvdXJjZSBwcm9wZXJ0eSBmb3IgYW4gU0RhdGEgcmVxdWVzdC5cclxuICAgKi9cclxuICByZXNvdXJjZVByb3BlcnR5OiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBjZmcge1N0cmluZz8vRnVuY3Rpb24/fVxyXG4gICAqIFRoZSBkZWZhdWx0IHJlc291cmNlIHByZWRpY2F0ZSBmb3IgYW4gU0RhdGEgcmVxdWVzdC5cclxuICAgKi9cclxuICByZXNvdXJjZVByZWRpY2F0ZTogbnVsbCxcclxuXHJcbiAgY29udHJhY3ROYW1lOiAnZHluYW1pYycsXHJcblxyXG4gIGl0ZW1zUHJvcGVydHk6ICckcmVzb3VyY2VzJyxcclxuICBpZFByb3BlcnR5OiAnJGtleScsXHJcbiAgbGFiZWxQcm9wZXJ0eTogJyRkZXNjcmlwdG9yJyxcclxuICBlbnRpdHlQcm9wZXJ0eTogJyRuYW1lJyxcclxuICB2ZXJzaW9uUHJvcGVydHk6ICckZXRhZycsXHJcblxyXG4gIC8qKlxyXG4gICAqIENvbnN0cnVjdHMgYSB3aGVyZSBleHByZXNzaW9uIHVzaW5nIHRoZSBwcm92aWRlZCBmb3JtYXQgc3RyaW5nIGFuZCBleHRyYWN0aW5nIHRoZSBuZWVkZWQgcHJvcGVydHkgZnJvbSBlbnRyeVxyXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBlbnRyeSBEYXRhIHBvaW50IHRvIGV4dHJhY3QgZnJvbS5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gZm10IEZvcm1hdCBzdHJpbmcgdG8gYmUgcmVwbGFjZWQgd2hlcmUgYCR7MH1gIHdpbGwgYmUgdGhlIGV4dHJhY3RlZCBwcm9wZXJ0eS5cclxuICAgKiBAcGFyYW0ge1N0cmluZ30gcHJvcGVydHkgUHJvcGVydHkgbmFtZSB0byBleHRyYWN0IGZyb20gdGhlIGVudHJ5LiBNYXkgYmUgYSBwYXRoOiBgJ0FkZHJlc3MuQ2l0eSdgLlxyXG4gICAqIEByZXR1cm4ge1N0cmluZ31cclxuICAgKi9cclxuICBmb3JtYXRSZWxhdGVkUXVlcnk6IGZ1bmN0aW9uIGZvcm1hdFJlbGF0ZWRRdWVyeShlbnRyeSwgZm10LCBwcm9wZXJ0eSkge1xyXG4gICAgcmV0dXJuIHN0cmluZy5zdWJzdGl0dXRlKGZtdCwgW2xhbmcuZ2V0T2JqZWN0KHByb3BlcnR5IHx8ICcka2V5JywgZmFsc2UsIGVudHJ5KV0pO1xyXG4gIH0sXHJcbiAgZ2V0Q29udGV4dDogZnVuY3Rpb24gZ2V0Q29udGV4dCgpIHtcclxuICAgIHJldHVybiBsYW5nLm1peGluKHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyksIHtcclxuICAgICAgcmVzb3VyY2VLaW5kOiB0aGlzLnJlc291cmNlS2luZCxcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgX29uUmVmcmVzaDogZnVuY3Rpb24gX29uUmVmcmVzaChvcHRpb25zKSB7XHJcbiAgICBpZiAodGhpcy5yZXNvdXJjZUtpbmQgJiYgb3B0aW9ucy5yZXNvdXJjZUtpbmQgPT09IHRoaXMucmVzb3VyY2VLaW5kKSB7XHJcbiAgICAgIHRoaXMucmVmcmVzaFJlcXVpcmVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNyZWF0ZVN0b3JlOiBmdW5jdGlvbiBjcmVhdGVTdG9yZSgpIHtcclxuICAgIHJldHVybiBuZXcgU0RhdGEoe1xyXG4gICAgICBzZXJ2aWNlOiB0aGlzLmdldENvbm5lY3Rpb24oKSxcclxuICAgICAgcmVxdWVzdDogdGhpcy5yZXF1ZXN0LFxyXG4gICAgICBjb250cmFjdE5hbWU6IHRoaXMuY29udHJhY3ROYW1lLFxyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgICByZXNvdXJjZVByb3BlcnR5OiB0aGlzLnJlc291cmNlUHJvcGVydHksXHJcbiAgICAgIHJlc291cmNlUHJlZGljYXRlOiB0aGlzLnJlc291cmNlUHJlZGljYXRlLFxyXG4gICAgICBpbmNsdWRlOiB0aGlzLnF1ZXJ5SW5jbHVkZSxcclxuICAgICAgc2VsZWN0OiB0aGlzLnF1ZXJ5U2VsZWN0LFxyXG4gICAgICB3aGVyZTogdGhpcy5xdWVyeVdoZXJlLFxyXG4gICAgICBxdWVyeUFyZ3M6IHRoaXMucXVlcnlBcmdzLFxyXG4gICAgICBvcmRlckJ5OiB0aGlzLnF1ZXJ5T3JkZXJCeSxcclxuICAgICAgaXRlbXNQcm9wZXJ0eTogdGhpcy5pdGVtc1Byb3BlcnR5LFxyXG4gICAgICBpZFByb3BlcnR5OiB0aGlzLmlkUHJvcGVydHksXHJcbiAgICAgIGxhYmVsUHJvcGVydHk6IHRoaXMubGFiZWxQcm9wZXJ0eSxcclxuICAgICAgZW50aXR5UHJvcGVydHk6IHRoaXMuZW50aXR5UHJvcGVydHksXHJcbiAgICAgIHZlcnNpb25Qcm9wZXJ0eTogdGhpcy52ZXJzaW9uUHJvcGVydHksXHJcbiAgICAgIHNjb3BlOiB0aGlzLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBfYnVpbGRRdWVyeUV4cHJlc3Npb246IGZ1bmN0aW9uIF9idWlsZFF1ZXJ5RXhwcmVzc2lvbigpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB0aGlzLm9wdGlvbnM7XHJcbiAgICBjb25zdCBwYXNzZWQgPSBvcHRpb25zICYmIChvcHRpb25zLnF1ZXJ5IHx8IG9wdGlvbnMud2hlcmUpO1xyXG4gICAgcmV0dXJuIHBhc3NlZCA/IHRoaXMucXVlcnkgPyAnKCcgKyB1dGlsaXR5LmV4cGFuZCh0aGlzLCBwYXNzZWQpICsgJykgYW5kICgnICsgdGhpcy5xdWVyeSArICcpJyA6ICcoJyArIHV0aWxpdHkuZXhwYW5kKHRoaXMsIHBhc3NlZCkgKyAnKScgOiB0aGlzLnF1ZXJ5Oy8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICB9LFxyXG4gIF9hcHBseVN0YXRlVG9RdWVyeU9wdGlvbnM6IGZ1bmN0aW9uIF9hcHBseVN0YXRlVG9RdWVyeU9wdGlvbnMocXVlcnlPcHRpb25zKSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG5cclxuICAgIHF1ZXJ5T3B0aW9ucy5jb3VudCA9IHRoaXMucGFnZVNpemU7XHJcbiAgICBxdWVyeU9wdGlvbnMuc3RhcnQgPSB0aGlzLnBvc2l0aW9uO1xyXG4gICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgaWYgKG9wdGlvbnMuc2VsZWN0KSB7XHJcbiAgICAgICAgcXVlcnlPcHRpb25zLnNlbGVjdCA9IG9wdGlvbnMuc2VsZWN0O1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5pbmNsdWRlKSB7XHJcbiAgICAgICAgcXVlcnlPcHRpb25zLmluY2x1ZGUgPSBvcHRpb25zLmluY2x1ZGU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLm9yZGVyQnkpIHtcclxuICAgICAgICBxdWVyeU9wdGlvbnMuc29ydCA9IG9wdGlvbnMub3JkZXJCeTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMuY29udHJhY3ROYW1lKSB7XHJcbiAgICAgICAgcXVlcnlPcHRpb25zLmNvbnRyYWN0TmFtZSA9IG9wdGlvbnMuY29udHJhY3ROYW1lO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5yZXNvdXJjZUtpbmQpIHtcclxuICAgICAgICBxdWVyeU9wdGlvbnMucmVzb3VyY2VLaW5kID0gb3B0aW9ucy5yZXNvdXJjZUtpbmQ7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChvcHRpb25zLnJlc291cmNlUHJvcGVydHkpIHtcclxuICAgICAgICBxdWVyeU9wdGlvbnMucmVzb3VyY2VQcm9wZXJ0eSA9IG9wdGlvbnMucmVzb3VyY2VQcm9wZXJ0eTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKG9wdGlvbnMucmVzb3VyY2VQcmVkaWNhdGUpIHtcclxuICAgICAgICBxdWVyeU9wdGlvbnMucmVzb3VyY2VQcmVkaWNhdGUgPSBvcHRpb25zLnJlc291cmNlUHJlZGljYXRlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpZiAob3B0aW9ucy5xdWVyeUFyZ3MpIHtcclxuICAgICAgICBxdWVyeU9wdGlvbnMucXVlcnlBcmdzID0gb3B0aW9ucy5xdWVyeUFyZ3M7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcXVlcnlPcHRpb25zO1xyXG4gIH0sXHJcbiAgZm9ybWF0U2VhcmNoUXVlcnk6IGZ1bmN0aW9uIGZvcm1hdFNlYXJjaFF1ZXJ5KHF1ZXJ5KSB7XHJcbiAgICByZXR1cm4gcXVlcnk7XHJcbiAgfSxcclxuICBlc2NhcGVTZWFyY2hRdWVyeTogZnVuY3Rpb24gZXNjYXBlU2VhcmNoUXVlcnkocXVlcnkpIHtcclxuICAgIHJldHVybiAocXVlcnkgfHwgJycpLnJlcGxhY2UoL1wiL2csICdcIlwiJyk7XHJcbiAgfSxcclxuICBoYXNNb3JlRGF0YTogZnVuY3Rpb24gaGFzTW9yZURhdGEoKSB7XHJcbiAgICBjb25zdCBzdGFydCA9IHRoaXMucG9zaXRpb247XHJcbiAgICBjb25zdCBjb3VudCA9IHRoaXMucGFnZVNpemU7XHJcbiAgICBjb25zdCB0b3RhbCA9IHRoaXMudG90YWw7XHJcblxyXG4gICAgaWYgKHN0YXJ0ID4gMCAmJiBjb3VudCA+IDAgJiYgdG90YWwgPj0gMCkge1xyXG4gICAgICByZXR1cm4gdGhpcy5yZW1haW5pbmcgPT09IC0xIHx8IHRoaXMucmVtYWluaW5nID4gMDtcclxuICAgIH1cclxuICAgIHJldHVybiB0cnVlOyAvLyBubyB3YXkgdG8gZGV0ZXJtaW5lLCBhbHdheXMgYXNzdW1lIG1vcmUgZGF0YVxyXG4gIH0sXHJcbiAgZ2V0TGlzdENvdW50OiBmdW5jdGlvbiBnZXRMaXN0Q291bnQob3B0aW9ucykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSBuZXcgU0RhdGEoe1xyXG4gICAgICBzZXJ2aWNlOiBBcHAuc2VydmljZXMuY3JtLFxyXG4gICAgICByZXNvdXJjZUtpbmQ6IHRoaXMucmVzb3VyY2VLaW5kLFxyXG4gICAgICBjb250cmFjdE5hbWU6IHRoaXMuY29udHJhY3ROYW1lLFxyXG4gICAgICBzY29wZTogdGhpcyxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IHtcclxuICAgICAgY291bnQ6IDEsXHJcbiAgICAgIHN0YXJ0OiAwLFxyXG4gICAgICBzZWxlY3Q6ICcnLFxyXG4gICAgICB3aGVyZTogb3B0aW9ucy53aGVyZSxcclxuICAgICAgc29ydDogJycsXHJcbiAgICB9O1xyXG5cclxuICAgIGNvbnN0IHF1ZXJ5UmVzdWx0cyA9IHN0b3JlLnF1ZXJ5KG51bGwsIHF1ZXJ5T3B0aW9ucyk7XHJcblxyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcclxuICAgICAgd2hlbihxdWVyeVJlc3VsdHMsICgpID0+IHtcclxuICAgICAgICByZXNvbHZlKHF1ZXJ5UmVzdWx0cy50b3RhbCk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICByZWplY3QoZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGluaXRNb2RlbDogZnVuY3Rpb24gaW5pdE1vZGVsKCkge1xyXG4gICAgY29uc3QgbW9kZWwgPSB0aGlzLmdldE1vZGVsKCk7XHJcbiAgICBpZiAobW9kZWwpIHtcclxuICAgICAgdGhpcy5fbW9kZWwgPSBtb2RlbDtcclxuICAgICAgdGhpcy5fbW9kZWwuaW5pdCgpO1xyXG4gICAgICBpZiAodGhpcy5fbW9kZWwuTW9kZWxUeXBlID09PSBNT0RFTF9UWVBFUy5TREFUQSkge1xyXG4gICAgICAgIHRoaXMuX2FwcGx5Vmlld1RvTW9kZWwodGhpcy5fbW9kZWwpO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfSxcclxuICBfYXBwbHlWaWV3VG9Nb2RlbDogZnVuY3Rpb24gX2FwcGx5Vmlld1RvTW9kZWwobW9kZWwpIHtcclxuICAgIGlmICghbW9kZWwpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHF1ZXJ5TW9kZWwgPSBtb2RlbC5fZ2V0UXVlcnlNb2RlbEJ5TmFtZSgnbGlzdCcpO1xyXG4gICAgaWYgKHRoaXMucmVzb3VyY2VLaW5kKSB7XHJcbiAgICAgIG1vZGVsLnJlc291cmNlS2luZCA9IHRoaXMucmVzb3VyY2VLaW5kO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghcXVlcnlNb2RlbCkge1xyXG4gICAgICByZXR1cm47XHJcbiAgICB9XHJcblxyXG4gICAgLy8gQXR0ZW1wdCB0byBtaXhpbiB0aGUgdmlldydzIHF1ZXJ5U2VsZWN0LCBxdWVyeUluY2x1ZGUsIHF1ZXJ5V2hlcmUsXHJcbiAgICAvLyBxdWVyeUFyZ3MsIHF1ZXJ5T3JkZXJCeSwgcmVzb3VyY2VQcm9wZXJ0eSwgcmVzb3VyY2VQcmVkaWNhdGUgcHJvcGVydGllc1xyXG4gICAgLy8gaW50byB0aGUgbGF5b3V0LiBUaGUgcGFzdCBtZXRob2Qgb2YgZXh0ZW5kaW5nIGEgcXVlcnlTZWxlY3QgZm9yIGV4YW1wbGUsXHJcbiAgICAvLyB3YXMgdG8gbW9kaWZ5IHRoZSBwcm90b3lwZSBvZiB0aGUgdmlldydzIHF1ZXJ5U2VsZWN0IGFycmF5LlxyXG4gICAgaWYgKHRoaXMucXVlcnlTZWxlY3QgJiYgdGhpcy5xdWVyeVNlbGVjdC5sZW5ndGgpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyBxdWVyeVNlbGVjdCBpcyBkZXByZWNhdGVkLiBSZWdpc3RlciBhIGN1c3RvbWl6YXRpb24gdG8gdGhlIG1vZGVscyBsYXlvdXQgaW5zdGVhZC5gKTtcclxuICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xyXG4gICAgICBpZiAoIXF1ZXJ5TW9kZWwucXVlcnlTZWxlY3QpIHtcclxuICAgICAgICBxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0ID0gW107XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHF1ZXJ5TW9kZWwucXVlcnlTZWxlY3QgPSBxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0LmNvbmNhdCh0aGlzLnF1ZXJ5U2VsZWN0LmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICAgIHJldHVybiBxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0LmluZGV4T2YoaXRlbSkgPCAwO1xyXG4gICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucXVlcnlJbmNsdWRlICYmIHRoaXMucXVlcnlJbmNsdWRlLmxlbmd0aCkge1xyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4gICAgICBjb25zb2xlLndhcm4oYEEgdmlldydzIHF1ZXJ5SW5jbHVkZSBpcyBkZXByZWNhdGVkLiBSZWdpc3RlciBhIGN1c3RvbWl6YXRpb24gdG8gdGhlIG1vZGVscyBsYXlvdXQgaW5zdGVhZC5gKTtcclxuICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xyXG4gICAgICBpZiAoIXF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlKSB7XHJcbiAgICAgICAgcXVlcnlNb2RlbC5xdWVyeUluY2x1ZGUgPSBbXTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcXVlcnlNb2RlbC5xdWVyeUluY2x1ZGUgPSBxdWVyeU1vZGVsLnF1ZXJ5SW5jbHVkZS5jb25jYXQodGhpcy5xdWVyeUluY2x1ZGUuZmlsdGVyKChpdGVtKSA9PiB7XHJcbiAgICAgICAgcmV0dXJuIHF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlLmluZGV4T2YoaXRlbSkgPCAwO1xyXG4gICAgICB9KSk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucXVlcnlXaGVyZSkge1xyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4gICAgICBjb25zb2xlLndhcm4oYEEgdmlldydzIHF1ZXJ5V2hlcmUgaXMgZGVwcmVjYXRlZC4gUmVnaXN0ZXIgYSBjdXN0b21pemF0aW9uIHRvIHRoZSBtb2RlbHMgbGF5b3V0IGluc3RlYWQuYCk7XHJcbiAgICAgIC8qIGVzbGludC1lbmFibGUgKi9cclxuICAgICAgcXVlcnlNb2RlbC5xdWVyeVdoZXJlID0gdGhpcy5xdWVyeVdoZXJlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLnF1ZXJ5QXJncykge1xyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4gICAgICBjb25zb2xlLndhcm4oYEEgdmlldydzIHF1ZXJ5QXJncyBpcyBkZXByZWNhdGVkLiBSZWdpc3RlciBhIGN1c3RvbWl6YXRpb24gdG8gdGhlIG1vZGVscyBsYXlvdXQgaW5zdGVhZC5gKTtcclxuICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xyXG4gICAgICBxdWVyeU1vZGVsLnF1ZXJ5QXJncyA9IGxhbmcubWl4aW4oe30sIHF1ZXJ5TW9kZWwucXVlcnlBcmdzLCB0aGlzLnF1ZXJ5QXJncyk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucXVlcnlPcmRlckJ5ICYmIHRoaXMucXVlcnlPcmRlckJ5Lmxlbmd0aCkge1xyXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSAqL1xyXG4gICAgICBjb25zb2xlLndhcm4oYEEgdmlldydzIHF1ZXJ5T3JkZXJCeSBpcyBkZXByZWNhdGVkLiBSZWdpc3RlciBhIGN1c3RvbWl6YXRpb24gdG8gdGhlIG1vZGVscyBsYXlvdXQgaW5zdGVhZC5gKTtcclxuICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xyXG4gICAgICBpZiAoQXJyYXkuaXNBcnJheSh0aGlzLnF1ZXJ5T3JkZXJCeSkpIHtcclxuICAgICAgICBpZiAoIXF1ZXJ5TW9kZWwucXVlcnlPcmRlckJ5KSB7XHJcbiAgICAgICAgICBxdWVyeU1vZGVsLnF1ZXJ5T3JkZXJCeSA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcXVlcnlNb2RlbC5xdWVyeU9yZGVyQnkgPSBxdWVyeU1vZGVsLnF1ZXJ5T3JkZXJCeS5jb25jYXQodGhpcy5xdWVyeU9yZGVyQnkuZmlsdGVyKChpdGVtKSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gcXVlcnlNb2RlbC5xdWVyeU9yZGVyQnkuaW5kZXhPZihpdGVtKSA8IDA7XHJcbiAgICAgICAgfSkpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHF1ZXJ5TW9kZWwucXVlcnlPcmRlckJ5ID0gdGhpcy5xdWVyeU9yZGVyQnk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBpZiAodGhpcy5yZXNvdXJjZVByb3BlcnR5KSB7XHJcbiAgICAgIC8qIGVzbGludC1kaXNhYmxlICovXHJcbiAgICAgIGNvbnNvbGUud2FybihgQSB2aWV3J3MgcmVzb3VyY2VQcm9wZXJ0eSBpcyBkZXByZWNhdGVkLiBSZWdpc3RlciBhIGN1c3RvbWl6YXRpb24gdG8gdGhlIG1vZGVscyBsYXlvdXQgaW5zdGVhZC5gKTtcclxuICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xyXG4gICAgICBxdWVyeU1vZGVsLnJlc291cmNlUHJvcGVydHkgPSB0aGlzLnJlc291cmNlUHJvcGVydHk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHRoaXMucmVzb3VyY2VQcmVkaWNhdGUpIHtcclxuICAgICAgLyogZXNsaW50LWRpc2FibGUgKi9cclxuICAgICAgY29uc29sZS53YXJuKGBBIHZpZXcncyByZXNvdXJjZVByZWRpY2F0ZSBpcyBkZXByZWNhdGVkLiBSZWdpc3RlciBhIGN1c3RvbWl6YXRpb24gdG8gdGhlIG1vZGVscyBsYXlvdXQgaW5zdGVhZC5gKTtcclxuICAgICAgLyogZXNsaW50LWVuYWJsZSAqL1xyXG4gICAgICBxdWVyeU1vZGVsLnJlc291cmNlUHJlZGljYXRlID0gdGhpcy5yZXNvdXJjZVByZWRpY2F0ZTtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==