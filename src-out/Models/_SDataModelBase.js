define('argos/Models/_SDataModelBase', ['module', 'exports', 'dojo/_base/declare', '../Store/SData', 'dojo/Deferred', 'dojo/promise/all', 'dojo/when', 'dojo/string', '../Utility', './_ModelBase', './Types'], function (module, exports, _declare, _SData, _Deferred, _all, _when, _string, _Utility, _ModelBase2, _Types) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _SData2 = _interopRequireDefault(_SData);

  var _Deferred2 = _interopRequireDefault(_Deferred);

  var _all2 = _interopRequireDefault(_all);

  var _when2 = _interopRequireDefault(_when);

  var _string2 = _interopRequireDefault(_string);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _ModelBase3 = _interopRequireDefault(_ModelBase2);

  var _Types2 = _interopRequireDefault(_Types);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Models._SDataModelBase
   */
  var __class = (0, _declare2.default)('argos.Models.SDataModelBase', [_ModelBase3.default], /** @lends argos.Models.SDataModelBase# */{
    queryModels: null,
    ModelType: _Types2.default.SDATA,

    _getQueryModelByName: function _getQueryModelByName(name) {
      if (!this.queryModels) {
        console.warn('No query Models defined'); // eslint-disable-line
      }

      var results = this.queryModels.filter(function (model) {
        return model.name === name;
      });
      return results[0];
    },
    init: function init() {
      var _this = this;

      this.inherited(init, arguments);

      if (!this.queryModels) {
        this.queryModels = this._createCustomizedLayout(this.createQueryModels(), 'queryModel');
        this.queryModels.forEach(function (queryModel) {
          queryModel.querySelect = _this._createCustomizedLayout(queryModel.querySelect, queryModel.name + '/querySelect');
          queryModel.queryInclude = _this._createCustomizedLayout(queryModel.queryInclude, queryModel.name + '/queryInclude');
        });
      }
    },
    createQueryModels: function createQueryModels() {
      return [];
    },
    getOptions: function getOptions(options) {
      var tempOptions = {};
      if (options) {
        if (options.select) tempOptions.select = options.select;
        if (options.include) tempOptions.include = options.include;
        if (options.orderBy) tempOptions.orderBy = options.orderBy;
        if (options.contractName) tempOptions.contractName = options.contractName;
        if (options.resourceKind) tempOptions.resourceKind = options.resourceKind;
        if (options.resourceProperty) tempOptions.resourceProperty = options.resourceProperty;
        if (options.resourcePredicate) tempOptions.resourcePredicate = options.resourcePredicate;
        if (options.queryArgs) tempOptions.queryArgs = options.queryArgs;
        if (options.start) tempOptions.start = options.start;
        if (options.count) tempOptions.count = options.count;
      }

      return tempOptions;
    },
    getId: function getId(options) {
      return options && (options.id || options.key);
    },
    getPicklists: function getPicklists() {
      return App.picklistService.requestPicklistsFromArray(this.picklists);
    },
    buildQueryExpression: function _buildQueryExpression(query, options) {
      var passed = options && (options.query || options.where);
      return passed ? query ? '(' + _Utility2.default.expand(this, passed) + ') and (' + query + ')' : '(' + _Utility2.default.expand(this, passed) + ')' : query; // eslint-disable-line
    },
    createStore: function createStore(type, service) {
      var app = this.get('app');
      var config = this;
      var typedConfig = this._getQueryModelByName(type);

      return new _SData2.default({
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
        scope: this
      });
    },
    insertEntry: function insertEntry(entry, options) {
      var store = this.createStore('detail');
      return store.add(entry, options);
    },
    updateEntry: function updateEntry(entry, options) {
      var _this2 = this;

      var store = this.createStore('edit');
      var def = new _Deferred2.default();
      if (!store) {
        throw new Error('No store set.');
      }
      this.validate(entry).then(function () {
        store.put(entry, options).then(function (result) {
          _this2.onEntryUpdated(result, entry);
          def.resolve(result);
        }, function (err) {
          def.reject(err);
        });
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    onEntryUpdated: function onEntryUpdated(result, orginalEntry) {// eslint-disable-line
    },
    /**
     * If an entry is valid, validate should return a promise that resolves to true. If the entry is not valid,
     * validate should return a reject promise with the error message.
     * @param entry
     * @returns Promise
     */
    validate: function validate(entry) {
      var def = new _Deferred2.default();
      if (entry) {
        def.resolve(true);
      }

      def.reject('The entry is null or undefined.');
      return def.promise;
    },
    getEntry: function getEntry(entityId, options) {
      var queryResults = void 0;
      var relatedRequests = void 0;
      var queryModelName = options && options.queryModelName ? options.queryModelName : 'detail';
      var store = this.createStore(queryModelName);
      var def = new _Deferred2.default();
      var includeRelated = options && options.includeRelated ? options.includeRelated : false;
      var queryOptions = this.getOptions(options);
      if (store) {
        relatedRequests = [];
        queryResults = store.get(entityId, queryOptions);
        (0, _when2.default)(queryResults, function (relatedFeed) {
          var _this3 = this;

          // eslint-disable-line
          var entry = queryResults.results[0];
          if (includeRelated) {
            relatedRequests = this.getRelatedRequests(entry);
          }
          if (relatedRequests.length > 0) {
            (0, _all2.default)(relatedRequests).then(function (relatedResults) {
              _this3.applyRelatedResults(entry, relatedResults);
              (0, _all2.default)(_this3.getPicklists()).then(function () {
                return def.resolve(entry);
              }, function (err) {
                return def.reject(err);
              });
            }, function (err) {
              def.reject(err);
            });
          } else {
            def.resolve(entry);
          }
        }.bind(this), function (err) {
          def.reject(err);
        });

        return def.promise;
      }
    },
    getEntries: function getEntries(query, options) {
      var queryModelName = options && options.queryModelName ? options.queryModelName : 'list';
      var def = new _Deferred2.default();
      var store = this.createStore(queryModelName);
      var queryOptions = this.getOptions(options);
      var queryExpression = this.buildQueryExpression(query, options);

      var queryResults = store.query(queryExpression, queryOptions);
      if (options && options.returnQueryResults) {
        return queryResults;
      }
      (0, _when2.default)(queryResults, function (entities) {
        def.resolve(entities);
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    getRelatedRequests: function getRelatedRequests(entry) {
      var self = this;
      var requests = [];
      this.relationships.forEach(function (rel) {
        var request = null;
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
      var queryOptions = void 0;
      var queryResults = void 0;
      var def = new _Deferred2.default();
      var model = App.ModelManager.getModel(relationship.relatedEntity, _Types2.default.SDATA);
      if (model) {
        queryOptions = this.getRelatedQueryOptions(entry, relationship, options);
        if (queryOptions) {
          queryResults = model.getEntries(null, queryOptions);
          (0, _when2.default)(queryResults, function (entities) {
            var results = {
              entityName: model.entityName,
              entityDisplayName: model.entityDisplayName,
              entityDisplayNamePlural: model.entityDisplayNamePlural,
              relationship: relationship,
              count: entities.length,
              entities: entities
            };
            def.resolve(results);
          }, function (err) {
            def.reject(err);
          });
          return def.promise;
        }
      }
    },
    getRelatedQueryOptions: function getRelatedQueryOptions(entry, relationship, options) {
      var parentDataPath = void 0;
      var relatedDataPath = void 0;
      var optionsTemp = options;

      if (!optionsTemp) {
        optionsTemp = {};
      }

      var queryOptions = {
        count: optionsTemp.count ? optionsTemp.count : null,
        start: optionsTemp.start ? optionsTemp.start : null,
        where: optionsTemp.where ? optionsTemp.where : null,
        sort: optionsTemp.orderBy ? optionsTemp.orderBy : null,
        queryModelName: relationship.queryModelName ? relationship.queryModelName : 'detail'
      };

      if (relationship.parentProperty) {
        parentDataPath = relationship.parentDataPath ? relationship.parentDataPath : relationship.parentProperty;
        if (relationship.parentPropertyType && relationship.parentPropertyType === 'object') {
          parentDataPath = relationship.parentProperty + '.$key';
        }
      } else {
        parentDataPath = this.idProperty;
      }

      if (relationship.relatedProperty) {
        relatedDataPath = relationship.relatedDataPath ? relationship.relatedDataPath : relationship.relatedProperty;
        if (relationship.relatedPropertyType && relationship.relatedPropertyType === 'object') {
          relatedDataPath = relationship.relatedProperty + '.Id';
        }
      } else {
        relatedDataPath = 'Id';
      }

      var relatedValue = _Utility2.default.getValue(entry, parentDataPath);
      var where = "${0} eq '${1}'";
      if (!relatedValue) {
        return null;
      }
      queryOptions.where = _string2.default.substitute(where, [relatedDataPath, relatedValue]);
      if (relationship.where) {
        if (typeof relationship.where === 'function') {
          queryOptions.where = relationship.where.apply(this, [entry]);
        } else {
          queryOptions.where = queryOptions.where + ' and ' + relationship.where;
        }
      }
      return queryOptions;
    },
    applyRelatedResults: function applyRelatedResults(entry, relatedResults) {
      var relatedEntities = [];
      relatedResults.forEach(function (result) {
        relatedEntities.push(result);
      });
      entry.$relatedEntities = relatedEntities;
    }
  }); /* Copyright 2017 Infor
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

  exports.default = __class;
  module.exports = exports['default'];
});