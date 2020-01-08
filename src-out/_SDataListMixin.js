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

  /**
   * @class
   * @mixin
   * @alias module:argos/_SDataListMixin
   * @classdesc Enables SData for the List view.
   * Adds the SData store to the view and exposes the needed properties for creating a Feed request.
   */
  var __class = (0, _declare2.default)('argos._SDataListMixin', null, /** @lends module:argos/_SDataListMixin.prototype */{
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
   * @module argos/_SDataListMixin
   */
  exports.default = __class;
  module.exports = exports['default'];
});