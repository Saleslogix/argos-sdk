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
import SDataStore from '../Store/SData';
import Deferred from 'dojo/Deferred';
import all from 'dojo/promise/all';
import when from 'dojo/when';
import string from 'dojo/string';
import utility from '../Utility';
import _CustomizationMixin from '../_CustomizationMixin';
import MODEL_TYPES from './Types';

/**
 * @class argos._SDataModeMixin
 * A mixin that provides SData specific methods and properties
 * @alternateClassName _SDataModelMixin
 */
export default declare('argos.Models._SDataModelMixin', [_CustomizationMixin], {
  customizationSet: 'models',
  entityName: '',
  modelName: '',
  resourceKind: '',
  itemsProperty: '$resources',
  idProperty: '$key',
  labelProperty: '$descriptor',
  entityProperty: '$name',
  versionProperty: '$etag',
  queryModels: null,
  relationships: null,
  ModelType: MODEL_TYPES.SDATA,
  _getQueryModelByName: function _getQueryModelByName(name) {
    if (!this.queryModels) {
      console.warn('No query Models defined');// eslint-disable-line
    }

    const results = this.queryModels.filter((model) => model.name === name);
    return results[0];
  },
  init: function init() {
    this.queryModels = this.queryModels || this._createCustomizedLayout(this.createQueryModels(), 'queryModel');
    this.relationships = this.relationships || this._createCustomizedLayout(this.createRelationships(), 'relationships');
  },
  createQueryModels: function createQueryModels() {
    return [];
  },
  createRelationships: function createRelationships() {
    return [];
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
  createStore: function createStore(type, service) {
    const app = this.get('app');
    const config = this;
    const typedConfig = this._getQueryModelByName(type);

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

  xgetEntries: function xgetEntries(query, options) { // eslint-disable-line
    const store = this.createStore('list');
    return store.query(this.buildQueryExpression(query, options), this.getOptions(options));
  },
  xgetEntry: function xgetEntry(options) {
    const store = this.createStore('detail');
    return store.get(this.getId(options), this.getOptions(options));
  },
  insertEntry: function insertEntry(entry, options) {
    const store = this.createStore('detail');
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
  getEntityId: function getEntityId(entity) {
    return utility.getValue(entity, this.idProperty);
  },
  getEntityDescription: function getEntityDescription(entity) {
    return entity[this.labelProperty];
  },
  getEntry: function getEntry(entityId, options) {
    let queryResults;
    let relatedRequests;
    const queryModelName = (options && options.queryModelName) ? options.queryModelName : 'detail';
    const store = this.createStore(queryModelName);
    const def = new Deferred();
    const includeRelated = (options && options.includeRelated) ? options.includeRelated : false;
    const queryOptions = this.getOptions(options);
    if (store) {
      relatedRequests = [];
      queryResults = store.get(entityId, queryOptions);
      when(queryResults, function(relatedFeed) { // eslint-disable-line
        const odef = def;
        const entry = queryResults.results[0];
        if (includeRelated) {
          relatedRequests = this.getRelatedRequests(entry);
        }
        if (relatedRequests.length > 0) {
          all(relatedRequests).then(
              function(relatedResults) {
                this.applyRelatedResults(entry, relatedResults);
                odef.resolve(entry);
              }.bind(this),
              function(err) {
                odef.reject(err);
              }.bind(this));
        } else {
          def.resolve(entry);
        }
      }.bind(this), function(err) {
        def.reject(err);
      }.bind(this));

      return def.promise;
    }
  },
  getEntries: function getEntries(query, options) {
    let queryResults;
    const queryModelName = (options && options.queryModelName) ? options.queryModelName : 'list';
    const def = new Deferred();
    const store = this.createStore(queryModelName);
    const queryOptions = this.getOptions(options);
    const queryExpression = this.buildQueryExpression(query, options);
    queryResults = store.query(queryExpression, queryOptions);
    when(queryResults, function(entities) {
      def.resolve(entities);
    }.bind(this), function(err) {
      def.reject(err);
    }.bind(this));

    return def.promise;
  },
  getRelatedRequests: function getRelatedRequests(entry) {
    const self = this;
    const requests = [];
    this.relationships.forEach(function(rel) {
      let request = null;
      if (!rel.disabled) {
        request = self.getRelatedRequest(entry, rel);
        if (request) {
          requests.push(request);
        }
      }
    });
    return requests;
  },
  getRelatedRequest: function getRelatedRequest(entry, relationship, options) {
    let model;
    let queryOptions;
    let queryResults;
    const def = new Deferred();
    model = App.ModelManager.getModel(relationship.childEntity, MODEL_TYPES.SDATA);
    if (model) {
      queryOptions = this.getRelatedQueryOptions(entry, relationship, options);
      if (queryOptions) {
        queryResults = model.getEntries(null, queryOptions);
        when(queryResults, function(entities) {
          const results = {
            entityName: model.entityName,
            entities: entities,
          };
          def.resolve(results);
        }, function(err) {
          def.reject(err);
        });
        return def.promise;
      }
    }
  },
  getRelatedQueryOptions: function getRelatedQueryOptions(entry, relationship, options) {
    let queryOptions;
    let parentDataPath;
    let childDataPath;
    let relatedValue;
    let where;
    let optionsTemp = options;
    if (!optionsTemp) {
      optionsTemp = {};
    }
    queryOptions = {
      count: (optionsTemp.count) ? optionsTemp.count : null,
      start: (optionsTemp.start) ? optionsTemp.start : null,
      where: (optionsTemp.where) ? optionsTemp.where : null,
      sort: (optionsTemp.orderBy) ? optionsTemp.orderBy : null,
      queryModelName: (relationship.queryModelName) ? relationship.queryModelName : 'detail',
    };
    if (relationship.parentPrimaryKey) {
      parentDataPath = this.idProperty;
    } else {
      parentDataPath = (relationship.parentDataPath) ? relationship.parentDataPath : relationship.parentProperty;
    }
    childDataPath = (relationship.childDataPath) ? relationship.childDataPath : relationship.childProperty;
    relatedValue = utility.getValue(entry, parentDataPath);
    where = "${0} eq '${1}'";
    if (!relatedValue) {
      return null;
    }
    queryOptions.where = string.substitute(where, [childDataPath, relatedValue]);
    return queryOptions;
  },
  applyRelatedResults: function applyRelatedResults(entry, relatedResults) {
    let relatedEntities;
    relatedEntities = [];
    relatedResults.forEach(function(result) {
      relatedEntities.push(result);
    });
    entry.$relatedEntities = relatedEntities;
  },
});
