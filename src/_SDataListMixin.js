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
 * @class argos._SDataListMixin
 *
 * Enables SData for the List view.
 * Adds the SData store to the view and exposes the needed properties for creating a Feed request.
 *
 * @alternateClassName _SDataListMixin
 * @requires argos.SData
 * @requires argos.Utility
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import Deferred from 'dojo/Deferred';
import when from 'dojo/when';
import string from 'dojo/string';
import SData from './Store/SData';
import utility from './Utility';
import MODEL_TYPES from 'argos/Models/Types';

const __class = declare('argos._SDataListMixin', null, {
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
    return string.substitute(fmt, [lang.getObject(property || '$key', false, entry)]);
  },
  getContext: function getContext() {
    return lang.mixin(this.inherited(arguments), {
      resourceKind: this.resourceKind,
    });
  },
  _onRefresh: function _onRefresh(options) {
    if (this.resourceKind && options.resourceKind === this.resourceKind) {
      this.refreshRequired = true;
    }
  },
  createStore: function createStore() {
    return new SData({
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
      scope: this,
    });
  },
  _buildQueryExpression: function _buildQueryExpression() {
    const options = this.options;
    const passed = options && (options.query || options.where);
    return passed ? this.query ? '(' + utility.expand(this, passed) + ') and (' + this.query + ')' : '(' + utility.expand(this, passed) + ')' : this.query;// eslint-disable-line
  },
  _applyStateToQueryOptions: function _applyStateToQueryOptions(queryOptions) {
    const options = this.options;

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
  },
  formatSearchQuery: function formatSearchQuery(query) {
    return query;
  },
  escapeSearchQuery: function escapeSearchQuery(query) {
    return (query || '').replace(/"/g, '""');
  },
  hasMoreData: function hasMoreData() {
    const start = this.position;
    const count = this.pageSize;
    const total = this.total;

    if (start > 0 && count > 0 && total >= 0) {
      return this.remaining === -1 || this.remaining > 0;
    }
    return true; // no way to determine, always assume more data
  },
  getListCount: function getListCount(options) {
    const def = new Deferred();
    const store = new SData({
      service: App.services.crm,
      resourceKind: this.resourceKind,
      contractName: this.contractName,
      scope: this,
    });

    const queryOptions = {
      count: 1,
      start: 0,
      select: '',
      where: options.where,
      sort: '',
    };

    const queryResults = store.query(null, queryOptions);

    when(queryResults, function success() {
      def.resolve(queryResults.total);
    }, function error(err) {
      def.reject(err);
    });

    return def.promise;
  },
  initModel: function initModel() {
    const model = this.getModel();
    if (model) {
      this._model = model;
      this._model.init();
      if (this._model.ModelType === MODEL_TYPES.SDATA) {
        this._applyViewToModel(this._model);
      }
    }
  },
  _applyViewToModel: function _applyViewToModel(model) {
    if (!model) {
      return;
    }

    const queryModel = model._getQueryModelByName('list');
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
    if (this.querySelect) {
      /* eslint-disable */
      console.warn(`A view's querySelect is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      if (!queryModel.querySelect) {
        queryModel.querySelect = [];
      }

      queryModel.querySelect = queryModel.querySelect.concat(this.querySelect.filter( (item) => {
        return queryModel.querySelect.indexOf(item) < 0;
      }));
    }

    if (this.queryInclude) {
      /* eslint-disable */
      console.warn(`A view's queryInclude is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      if (!queryModel.queryInclude) {
        queryModel.queryInclude = [];
      }

      queryModel.queryInclude = queryModel.queryInclude.concat(this.queryInclude.filter( (item) => {
        return queryModel.queryInclude.indexOf(item) < 0;
      }));
    }

    if (this.queryWhere) {
      /* eslint-disable */
      console.warn(`A view's queryWhere is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      queryModel.queryWhere = this.queryWhere;
    }

    if (this.queryArgs) {
      /* eslint-disable */
      console.warn(`A view's queryArgs is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      queryModel.queryArgs = lang.mixin({}, queryModel.queryArgs, this.queryArgs);
    }

    if (this.queryOrderBy) {
      /* eslint-disable */
      console.warn(`A view's queryOrderBy is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      if (Array.isArray(this.queryOrderBy)) {
        if (!queryModel.queryOrderBy) {
          queryModel.queryOrderBy = [];
        }

        queryModel.queryOrderBy = queryModel.queryOrderBy.concat(this.queryOrderBy.filter( (item) => {
          return queryModel.queryOrderBy.indexOf(item) < 0;
        }));
      } else {
        queryModel.queryOrderBy = this.queryOrderBy;
      }
    }

    if (this.resourceProperty) {
      /* eslint-disable */
      console.warn(`A view's resourceProperty is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      queryModel.resourceProperty = this.resourceProperty;
    }

    if (this.resourcePredicate) {
      /* eslint-disable */
      console.warn(`A view's resourcePredicate is deprecated. Register a customization to the models layout instead.`);
      /* eslint-enable */
      queryModel.resourcePredicate = this.resourcePredicate;
    }
  },
});

lang.setObject('Sage.Platform.Mobile._SDataListMixin', __class);
export default __class;
