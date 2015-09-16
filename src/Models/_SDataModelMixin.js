/* Copyright (c) 2015 Infor. All rights reserved.
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
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import SDataStore from '../Store/SData';
import Deferred from 'dojo/Deferred';
import utility from '../Utility';
import _CustomizationMixin from '../_CustomizationMixin';

/**
 * @class argos._SDataModeMixin
 * A mixin that provides SData specific methods and properties
 * @alternateClassName _SDataModelMixin
 */
export default declare('argos.Models._SDataModelMixin', [_CustomizationMixin], {
  customizationSet: 'models',
  resourceKind: '',
  itemsProperty: '$resources',
  idProperty: '$key',
  labelProperty: '$descriptor',
  entityProperty: '$name',
  versionProperty: '$etag',
  layout: null,
  createLayout: function createLayout() {
    return [];
  },
  _getLayoutByName: function _getLayoutByName(name = '') {
    if (!this.layout) {
      console.warn('No layout defined');// eslint-disable-line
    }

    const results = this.layout.filter((layoutItem) => layoutItem.name === name);
    return results[0];
  },
  /**
   * Initializes the model with options that are SData specific.
   * @param options
   */
  init: function init({resourceKind, querySelect, queryInclude, queryWhere,
    queryArgs, queryOrderBy, resourceProperty, resourcePredicate, viewType}) {
    this.layout = this.layout || this._createCustomizedLayout(this.createLayout());

    const layoutItem = this._getLayoutByName(viewType);
    if (resourceKind) {
      this.resourceKind = resourceKind;
    }

    if (!layoutItem) {
      return;
    }

    // Attempt to mixin the view's querySelect, queryInclude, queryWhere,
    // queryArgs, queryOrderBy, resourceProperty, resourcePredicate properties
    // into the layout. The past method of extending a querySelect for example,
    // was to modify the protoype of the view's querySelect array.
    if (querySelect) {
      /* eslint-disable */
      console.warn(`A view's querySelect is deprecated. Register a customization
      to the models layout instead.`);
      /* eslint-enable */
      if (!layoutItem.querySelect) {
        layoutItem.querySelect = [];
      }

      layoutItem.querySelect.concat(querySelect);
    }

    if (queryInclude) {
      /* eslint-disable */
      console.warn(`A view's queryInclude is deprecated. Register a customization
      to the models layout instead.`);
      /* eslint-enable */
      if (!layoutItem.queryInclude) {
        layoutItem.queryInclude = [];
      }

      layoutItem.queryInclude.concat(queryInclude);
    }

    if (queryWhere) {
      /* eslint-disable */
      console.warn(`A view's queryWhere is deprecated. Register a customization
      to the models layout instead.`);
      /* eslint-enable */
      layoutItem.queryWhere = queryWhere;
    }

    if (queryArgs) {
      /* eslint-disable */
      console.warn(`A view's queryArgs is deprecated. Register a customization
      to the models layout instead.`);
      /* eslint-enable */
      layoutItem.queryArgs = lang.mixin({}, layoutItem.queryArgs, queryArgs);
    }

    if (queryOrderBy) {
      /* eslint-disable */
      console.warn(`A view's queryOrderBy is deprecated. Register a customization
      to the models layout instead.`);
      /* eslint-enable */
      if (Array.isArray(queryOrderBy)) {
        if (!layoutItem.queryOrderBy) {
          layoutItem.queryOrderBy = [];
        }

        layoutItem.queryOrderBy.concat(queryInclude);
      } else {
        layoutItem.queryOrderBy = queryOrderBy;
      }
    }

    if (resourceProperty) {
      /* eslint-disable */
      console.warn(`A view's resourceProperty is deprecated. Register a customization
      to the models layout instead.`);
      /* eslint-enable */
      layoutItem.resourceProperty = resourceProperty;
    }

    if (resourcePredicate) {
      /* eslint-disable */
      console.warn(`A view's resourcePredicate is deprecated. Register a customization
      to the models layout instead.`);
      /* eslint-enable */
      layoutItem.resourcePredicate = resourcePredicate;
    }
  },
  getOptions: function getOptionsFn(options) {
    const getOptions = {};
    if (options) {
      if (options.select) getOptions.select = options.select;
      if (options.include) getOptions.include = options.include;
      if (options.orderBy) getOptions.orderBy = options.orderBy;
      if (options.contractName) getOptions.contractName = options.contractName;
      if (options.resourceKind) getOptions.resourceKind = options.resourceKind;
      if (options.resourceProperty) getOptions.resourceProperty = options.resourceProperty;
      if (options.resourcePredicate) getOptions.resourcePredicate = options.resourcePredicate;
      if (options.queryArgs) getOptions.queryArgs = options.queryArgs;
      if (options.start) getOptions.start = options.start;
      if (options.count) getOptions.count = options.count;
    }

    return getOptions;
  },
  getId: function getId(options) {
    return options && (options.id || options.key);
  },
  buildQueryExpression: function _buildQueryExpression(query, options) {
    const passed = options && (options.query || options.where);
    return passed ? query ? '(' + utility.expand(this, passed) + ') and (' + query + ')' : '(' + utility.expand(this, passed) + ')' : query;// eslint-disable-line
  },
  createStore: function createStore(type = 'detail', service) {
    const app = this.get('app');
    const config = this;
    const typedConfig = this._getLayoutByName(type);

    return new SDataStore({
      service: service || app.getService(false),
      contractName: config.contractName,
      resourceKind: config.resourceKind,

      resourceProperty: typedConfig.resourceProperty,
      resourcePredicate: typedConfig.resourcePredicate,
      include: typedConfig.queryInclude,
      select: typedConfig.querySelect,
      where: typedConfig.queryWhere,
      queryArgs: typedConfig.queryArgs,
      orderBy: typedConfig.queryOrderBy,

      itemsProperty: config.itemsProperty,
      idProperty: config.idProperty,
      labelProperty: config.labelProperty,
      entityProperty: config.entityProperty,
      versionProperty: config.versionProperty,
      scope: this,
    });
  },

  getEntries: function getEntries(query, options) { // eslint-disable-line
    const store = this.createStore('list');
    return store.query(this.buildQueryExpression(query, options), this.getOptions(options));
  },
  getEntry: function getEntry(options) {
    const store = this.createStore('detail');
    return store.get(this.getId(options), this.getOptions(options));
  },
  insertEntry: function insertEntry(entry, options) {
    const store = this.createStore();
    return store.add(entry, options);
  },
  updateEntry: function updateEntry(entry, options) {
    const store = this.createStore();

    if (!store) {
      throw new Error('No store set.');
    }

    return this.validate(entry)
      .then(function fulfilled() {
        return store.put(entry, options);
      }); // Since we left off the reject handler, it will propagate up if there is a validation error
  },
  /**
   * If an entry is valid, validate should return a promise that resolves to true. If the entry is not valid,
   * validate should return a reject promise with the error message.
   * @param entry
   * @returns Promise
   */
  validate: function validate(entry) {
    const def = new Deferred();
    if (entry) {
      def.resolve(true);
    }

    def.reject('The entry is null or undefined.');
    return def.promise;
  },
});
