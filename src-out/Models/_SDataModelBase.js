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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Nb2RlbHMvX1NEYXRhTW9kZWxCYXNlLmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJxdWVyeU1vZGVscyIsIk1vZGVsVHlwZSIsIlNEQVRBIiwiX2dldFF1ZXJ5TW9kZWxCeU5hbWUiLCJuYW1lIiwiY29uc29sZSIsIndhcm4iLCJyZXN1bHRzIiwiZmlsdGVyIiwibW9kZWwiLCJpbml0IiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQiLCJjcmVhdGVRdWVyeU1vZGVscyIsImZvckVhY2giLCJxdWVyeU1vZGVsIiwicXVlcnlTZWxlY3QiLCJxdWVyeUluY2x1ZGUiLCJnZXRPcHRpb25zIiwib3B0aW9ucyIsInRlbXBPcHRpb25zIiwic2VsZWN0IiwiaW5jbHVkZSIsIm9yZGVyQnkiLCJjb250cmFjdE5hbWUiLCJyZXNvdXJjZUtpbmQiLCJyZXNvdXJjZVByb3BlcnR5IiwicmVzb3VyY2VQcmVkaWNhdGUiLCJxdWVyeUFyZ3MiLCJzdGFydCIsImNvdW50IiwiZ2V0SWQiLCJpZCIsImtleSIsImdldFBpY2tsaXN0cyIsIkFwcCIsInBpY2tsaXN0U2VydmljZSIsInJlcXVlc3RQaWNrbGlzdHNGcm9tQXJyYXkiLCJwaWNrbGlzdHMiLCJidWlsZFF1ZXJ5RXhwcmVzc2lvbiIsIl9idWlsZFF1ZXJ5RXhwcmVzc2lvbiIsInF1ZXJ5IiwicGFzc2VkIiwid2hlcmUiLCJleHBhbmQiLCJjcmVhdGVTdG9yZSIsInR5cGUiLCJzZXJ2aWNlIiwiYXBwIiwiZ2V0IiwiY29uZmlnIiwidHlwZWRDb25maWciLCJnZXRTZXJ2aWNlIiwicXVlcnlXaGVyZSIsInF1ZXJ5T3JkZXJCeSIsIml0ZW1zUHJvcGVydHkiLCJpZFByb3BlcnR5IiwibGFiZWxQcm9wZXJ0eSIsImVudGl0eVByb3BlcnR5IiwidmVyc2lvblByb3BlcnR5Iiwic2NvcGUiLCJpbnNlcnRFbnRyeSIsImVudHJ5Iiwic3RvcmUiLCJhZGQiLCJ1cGRhdGVFbnRyeSIsImRlZiIsIkVycm9yIiwidmFsaWRhdGUiLCJ0aGVuIiwicHV0IiwicmVzdWx0Iiwib25FbnRyeVVwZGF0ZWQiLCJyZXNvbHZlIiwiZXJyIiwicmVqZWN0IiwicHJvbWlzZSIsIm9yZ2luYWxFbnRyeSIsImdldEVudHJ5IiwiZW50aXR5SWQiLCJxdWVyeVJlc3VsdHMiLCJyZWxhdGVkUmVxdWVzdHMiLCJxdWVyeU1vZGVsTmFtZSIsImluY2x1ZGVSZWxhdGVkIiwicXVlcnlPcHRpb25zIiwicmVsYXRlZEZlZWQiLCJnZXRSZWxhdGVkUmVxdWVzdHMiLCJsZW5ndGgiLCJyZWxhdGVkUmVzdWx0cyIsImFwcGx5UmVsYXRlZFJlc3VsdHMiLCJiaW5kIiwiZ2V0RW50cmllcyIsInF1ZXJ5RXhwcmVzc2lvbiIsInJldHVyblF1ZXJ5UmVzdWx0cyIsImVudGl0aWVzIiwic2VsZiIsInJlcXVlc3RzIiwicmVsYXRpb25zaGlwcyIsInJlbCIsInJlcXVlc3QiLCJkaXNhYmxlZCIsImdldFJlbGF0ZWRSZXF1ZXN0IiwicHVzaCIsInJlbGF0aW9uc2hpcCIsIk1vZGVsTWFuYWdlciIsImdldE1vZGVsIiwicmVsYXRlZEVudGl0eSIsImdldFJlbGF0ZWRRdWVyeU9wdGlvbnMiLCJlbnRpdHlOYW1lIiwiZW50aXR5RGlzcGxheU5hbWUiLCJlbnRpdHlEaXNwbGF5TmFtZVBsdXJhbCIsInBhcmVudERhdGFQYXRoIiwicmVsYXRlZERhdGFQYXRoIiwib3B0aW9uc1RlbXAiLCJzb3J0IiwicGFyZW50UHJvcGVydHkiLCJwYXJlbnRQcm9wZXJ0eVR5cGUiLCJyZWxhdGVkUHJvcGVydHkiLCJyZWxhdGVkUHJvcGVydHlUeXBlIiwicmVsYXRlZFZhbHVlIiwiZ2V0VmFsdWUiLCJzdWJzdGl0dXRlIiwiYXBwbHkiLCJyZWxhdGVkRW50aXRpZXMiLCIkcmVsYXRlZEVudGl0aWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7O0FBR0EsTUFBTUEsVUFBVSx1QkFBUSw2QkFB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YTVELEtBQS9EO0FBQ0Q7QUFDRjtBQUNELGFBQU95QyxZQUFQO0FBQ0QsS0F0UTRHO0FBdVE3R0sseUJBQXFCLFNBQVNBLG1CQUFULENBQTZCM0IsS0FBN0IsRUFBb0MwQixjQUFwQyxFQUFvRDtBQUN2RSxVQUFNbUMsa0JBQWtCLEVBQXhCO0FBQ0FuQyxxQkFBZTFFLE9BQWYsQ0FBdUIsVUFBQ3lELE1BQUQsRUFBWTtBQUNqQ29ELHdCQUFnQnJCLElBQWhCLENBQXFCL0IsTUFBckI7QUFDRCxPQUZEO0FBR0FULFlBQU04RCxnQkFBTixHQUF5QkQsZUFBekI7QUFDRDtBQTdRNEcsR0FBL0YsQ0FBaEIsQyxDQTVCQTs7Ozs7Ozs7Ozs7Ozs7O29CQTRTZTdILE8iLCJmaWxlIjoiX1NEYXRhTW9kZWxCYXNlLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IFNEYXRhU3RvcmUgZnJvbSAnLi4vU3RvcmUvU0RhdGEnO1xyXG5pbXBvcnQgRGVmZXJyZWQgZnJvbSAnZG9qby9EZWZlcnJlZCc7XHJcbmltcG9ydCBhbGwgZnJvbSAnZG9qby9wcm9taXNlL2FsbCc7XHJcbmltcG9ydCB3aGVuIGZyb20gJ2Rvam8vd2hlbic7XHJcbmltcG9ydCBzdHJpbmcgZnJvbSAnZG9qby9zdHJpbmcnO1xyXG5pbXBvcnQgdXRpbGl0eSBmcm9tICcuLi9VdGlsaXR5JztcclxuaW1wb3J0IF9Nb2RlbEJhc2UgZnJvbSAnLi9fTW9kZWxCYXNlJztcclxuaW1wb3J0IE1PREVMX1RZUEVTIGZyb20gJy4vVHlwZXMnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5Nb2RlbHMuX1NEYXRhTW9kZWxCYXNlXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuTW9kZWxzLlNEYXRhTW9kZWxCYXNlJywgW19Nb2RlbEJhc2VdLCAvKiogQGxlbmRzIGFyZ29zLk1vZGVscy5TRGF0YU1vZGVsQmFzZSMgKi97XHJcbiAgcXVlcnlNb2RlbHM6IG51bGwsXHJcbiAgTW9kZWxUeXBlOiBNT0RFTF9UWVBFUy5TREFUQSxcclxuXHJcbiAgX2dldFF1ZXJ5TW9kZWxCeU5hbWU6IGZ1bmN0aW9uIF9nZXRRdWVyeU1vZGVsQnlOYW1lKG5hbWUpIHtcclxuICAgIGlmICghdGhpcy5xdWVyeU1vZGVscykge1xyXG4gICAgICBjb25zb2xlLndhcm4oJ05vIHF1ZXJ5IE1vZGVscyBkZWZpbmVkJyk7Ly8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHJlc3VsdHMgPSB0aGlzLnF1ZXJ5TW9kZWxzLmZpbHRlcihtb2RlbCA9PiBtb2RlbC5uYW1lID09PSBuYW1lKTtcclxuICAgIHJldHVybiByZXN1bHRzWzBdO1xyXG4gIH0sXHJcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGluaXQsIGFyZ3VtZW50cyk7XHJcblxyXG4gICAgaWYgKCF0aGlzLnF1ZXJ5TW9kZWxzKSB7XHJcbiAgICAgIHRoaXMucXVlcnlNb2RlbHMgPSB0aGlzLl9jcmVhdGVDdXN0b21pemVkTGF5b3V0KHRoaXMuY3JlYXRlUXVlcnlNb2RlbHMoKSwgJ3F1ZXJ5TW9kZWwnKTtcclxuICAgICAgdGhpcy5xdWVyeU1vZGVscy5mb3JFYWNoKChxdWVyeU1vZGVsKSA9PiB7XHJcbiAgICAgICAgcXVlcnlNb2RlbC5xdWVyeVNlbGVjdCA9IHRoaXMuX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQocXVlcnlNb2RlbC5xdWVyeVNlbGVjdCwgYCR7cXVlcnlNb2RlbC5uYW1lfS9xdWVyeVNlbGVjdGApO1xyXG4gICAgICAgIHF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlID0gdGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dChxdWVyeU1vZGVsLnF1ZXJ5SW5jbHVkZSwgYCR7cXVlcnlNb2RlbC5uYW1lfS9xdWVyeUluY2x1ZGVgKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBjcmVhdGVRdWVyeU1vZGVsczogZnVuY3Rpb24gY3JlYXRlUXVlcnlNb2RlbHMoKSB7XHJcbiAgICByZXR1cm4gW107XHJcbiAgfSxcclxuICBnZXRPcHRpb25zOiBmdW5jdGlvbiBnZXRPcHRpb25zKG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHRlbXBPcHRpb25zID0ge307XHJcbiAgICBpZiAob3B0aW9ucykge1xyXG4gICAgICBpZiAob3B0aW9ucy5zZWxlY3QpIHRlbXBPcHRpb25zLnNlbGVjdCA9IG9wdGlvbnMuc2VsZWN0O1xyXG4gICAgICBpZiAob3B0aW9ucy5pbmNsdWRlKSB0ZW1wT3B0aW9ucy5pbmNsdWRlID0gb3B0aW9ucy5pbmNsdWRlO1xyXG4gICAgICBpZiAob3B0aW9ucy5vcmRlckJ5KSB0ZW1wT3B0aW9ucy5vcmRlckJ5ID0gb3B0aW9ucy5vcmRlckJ5O1xyXG4gICAgICBpZiAob3B0aW9ucy5jb250cmFjdE5hbWUpIHRlbXBPcHRpb25zLmNvbnRyYWN0TmFtZSA9IG9wdGlvbnMuY29udHJhY3ROYW1lO1xyXG4gICAgICBpZiAob3B0aW9ucy5yZXNvdXJjZUtpbmQpIHRlbXBPcHRpb25zLnJlc291cmNlS2luZCA9IG9wdGlvbnMucmVzb3VyY2VLaW5kO1xyXG4gICAgICBpZiAob3B0aW9ucy5yZXNvdXJjZVByb3BlcnR5KSB0ZW1wT3B0aW9ucy5yZXNvdXJjZVByb3BlcnR5ID0gb3B0aW9ucy5yZXNvdXJjZVByb3BlcnR5O1xyXG4gICAgICBpZiAob3B0aW9ucy5yZXNvdXJjZVByZWRpY2F0ZSkgdGVtcE9wdGlvbnMucmVzb3VyY2VQcmVkaWNhdGUgPSBvcHRpb25zLnJlc291cmNlUHJlZGljYXRlO1xyXG4gICAgICBpZiAob3B0aW9ucy5xdWVyeUFyZ3MpIHRlbXBPcHRpb25zLnF1ZXJ5QXJncyA9IG9wdGlvbnMucXVlcnlBcmdzO1xyXG4gICAgICBpZiAob3B0aW9ucy5zdGFydCkgdGVtcE9wdGlvbnMuc3RhcnQgPSBvcHRpb25zLnN0YXJ0O1xyXG4gICAgICBpZiAob3B0aW9ucy5jb3VudCkgdGVtcE9wdGlvbnMuY291bnQgPSBvcHRpb25zLmNvdW50O1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB0ZW1wT3B0aW9ucztcclxuICB9LFxyXG4gIGdldElkOiBmdW5jdGlvbiBnZXRJZChvcHRpb25zKSB7XHJcbiAgICByZXR1cm4gb3B0aW9ucyAmJiAob3B0aW9ucy5pZCB8fCBvcHRpb25zLmtleSk7XHJcbiAgfSxcclxuICBnZXRQaWNrbGlzdHM6IGZ1bmN0aW9uIGdldFBpY2tsaXN0cygpIHtcclxuICAgIHJldHVybiBBcHAucGlja2xpc3RTZXJ2aWNlLnJlcXVlc3RQaWNrbGlzdHNGcm9tQXJyYXkodGhpcy5waWNrbGlzdHMpO1xyXG4gIH0sXHJcbiAgYnVpbGRRdWVyeUV4cHJlc3Npb246IGZ1bmN0aW9uIF9idWlsZFF1ZXJ5RXhwcmVzc2lvbihxdWVyeSwgb3B0aW9ucykge1xyXG4gICAgY29uc3QgcGFzc2VkID0gb3B0aW9ucyAmJiAob3B0aW9ucy5xdWVyeSB8fCBvcHRpb25zLndoZXJlKTtcclxuICAgIHJldHVybiBwYXNzZWQgPyBxdWVyeSA/ICcoJyArIHV0aWxpdHkuZXhwYW5kKHRoaXMsIHBhc3NlZCkgKyAnKSBhbmQgKCcgKyBxdWVyeSArICcpJyA6ICcoJyArIHV0aWxpdHkuZXhwYW5kKHRoaXMsIHBhc3NlZCkgKyAnKScgOiBxdWVyeTsvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgfSxcclxuICBjcmVhdGVTdG9yZTogZnVuY3Rpb24gY3JlYXRlU3RvcmUodHlwZSwgc2VydmljZSkge1xyXG4gICAgY29uc3QgYXBwID0gdGhpcy5nZXQoJ2FwcCcpO1xyXG4gICAgY29uc3QgY29uZmlnID0gdGhpcztcclxuICAgIGNvbnN0IHR5cGVkQ29uZmlnID0gdGhpcy5fZ2V0UXVlcnlNb2RlbEJ5TmFtZSh0eXBlKTtcclxuXHJcbiAgICByZXR1cm4gbmV3IFNEYXRhU3RvcmUoe1xyXG4gICAgICBzZXJ2aWNlOiBzZXJ2aWNlIHx8IGFwcC5nZXRTZXJ2aWNlKGZhbHNlKSxcclxuICAgICAgY29udHJhY3ROYW1lOiBjb25maWcuY29udHJhY3ROYW1lLFxyXG4gICAgICByZXNvdXJjZUtpbmQ6IGNvbmZpZy5yZXNvdXJjZUtpbmQsXHJcblxyXG4gICAgICByZXNvdXJjZVByb3BlcnR5OiB0eXBlZENvbmZpZy5yZXNvdXJjZVByb3BlcnR5LFxyXG4gICAgICByZXNvdXJjZVByZWRpY2F0ZTogdHlwZWRDb25maWcucmVzb3VyY2VQcmVkaWNhdGUsXHJcbiAgICAgIGluY2x1ZGU6IHR5cGVkQ29uZmlnLnF1ZXJ5SW5jbHVkZSxcclxuICAgICAgc2VsZWN0OiB0eXBlZENvbmZpZy5xdWVyeVNlbGVjdCxcclxuICAgICAgd2hlcmU6IHR5cGVkQ29uZmlnLnF1ZXJ5V2hlcmUsXHJcbiAgICAgIHF1ZXJ5QXJnczogdHlwZWRDb25maWcucXVlcnlBcmdzLFxyXG4gICAgICBvcmRlckJ5OiB0eXBlZENvbmZpZy5xdWVyeU9yZGVyQnksXHJcblxyXG4gICAgICBpdGVtc1Byb3BlcnR5OiBjb25maWcuaXRlbXNQcm9wZXJ0eSxcclxuICAgICAgaWRQcm9wZXJ0eTogY29uZmlnLmlkUHJvcGVydHksXHJcbiAgICAgIGxhYmVsUHJvcGVydHk6IGNvbmZpZy5sYWJlbFByb3BlcnR5LFxyXG4gICAgICBlbnRpdHlQcm9wZXJ0eTogY29uZmlnLmVudGl0eVByb3BlcnR5LFxyXG4gICAgICB2ZXJzaW9uUHJvcGVydHk6IGNvbmZpZy52ZXJzaW9uUHJvcGVydHksXHJcbiAgICAgIHNjb3BlOiB0aGlzLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICBpbnNlcnRFbnRyeTogZnVuY3Rpb24gaW5zZXJ0RW50cnkoZW50cnksIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHN0b3JlID0gdGhpcy5jcmVhdGVTdG9yZSgnZGV0YWlsJyk7XHJcbiAgICByZXR1cm4gc3RvcmUuYWRkKGVudHJ5LCBvcHRpb25zKTtcclxuICB9LFxyXG4gIHVwZGF0ZUVudHJ5OiBmdW5jdGlvbiB1cGRhdGVFbnRyeShlbnRyeSwgb3B0aW9ucykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKCdlZGl0Jyk7XHJcbiAgICBjb25zdCBkZWYgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIGlmICghc3RvcmUpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdObyBzdG9yZSBzZXQuJyk7XHJcbiAgICB9XHJcbiAgICB0aGlzLnZhbGlkYXRlKGVudHJ5KS50aGVuKCgpID0+IHtcclxuICAgICAgc3RvcmUucHV0KGVudHJ5LCBvcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgICB0aGlzLm9uRW50cnlVcGRhdGVkKHJlc3VsdCwgZW50cnkpO1xyXG4gICAgICAgIGRlZi5yZXNvbHZlKHJlc3VsdCk7XHJcbiAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICAgIH0pO1xyXG4gICAgfSwgKGVycikgPT4ge1xyXG4gICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIG9uRW50cnlVcGRhdGVkOiBmdW5jdGlvbiBvbkVudHJ5VXBkYXRlZChyZXN1bHQsIG9yZ2luYWxFbnRyeSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgfSxcclxuICAvKipcclxuICAgKiBJZiBhbiBlbnRyeSBpcyB2YWxpZCwgdmFsaWRhdGUgc2hvdWxkIHJldHVybiBhIHByb21pc2UgdGhhdCByZXNvbHZlcyB0byB0cnVlLiBJZiB0aGUgZW50cnkgaXMgbm90IHZhbGlkLFxyXG4gICAqIHZhbGlkYXRlIHNob3VsZCByZXR1cm4gYSByZWplY3QgcHJvbWlzZSB3aXRoIHRoZSBlcnJvciBtZXNzYWdlLlxyXG4gICAqIEBwYXJhbSBlbnRyeVxyXG4gICAqIEByZXR1cm5zIFByb21pc2VcclxuICAgKi9cclxuICB2YWxpZGF0ZTogZnVuY3Rpb24gdmFsaWRhdGUoZW50cnkpIHtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgaWYgKGVudHJ5KSB7XHJcbiAgICAgIGRlZi5yZXNvbHZlKHRydWUpO1xyXG4gICAgfVxyXG5cclxuICAgIGRlZi5yZWplY3QoJ1RoZSBlbnRyeSBpcyBudWxsIG9yIHVuZGVmaW5lZC4nKTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIGdldEVudHJ5OiBmdW5jdGlvbiBnZXRFbnRyeShlbnRpdHlJZCwgb3B0aW9ucykge1xyXG4gICAgbGV0IHF1ZXJ5UmVzdWx0cztcclxuICAgIGxldCByZWxhdGVkUmVxdWVzdHM7XHJcbiAgICBjb25zdCBxdWVyeU1vZGVsTmFtZSA9IChvcHRpb25zICYmIG9wdGlvbnMucXVlcnlNb2RlbE5hbWUpID8gb3B0aW9ucy5xdWVyeU1vZGVsTmFtZSA6ICdkZXRhaWwnO1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKHF1ZXJ5TW9kZWxOYW1lKTtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgaW5jbHVkZVJlbGF0ZWQgPSAob3B0aW9ucyAmJiBvcHRpb25zLmluY2x1ZGVSZWxhdGVkKSA/IG9wdGlvbnMuaW5jbHVkZVJlbGF0ZWQgOiBmYWxzZTtcclxuICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucyhvcHRpb25zKTtcclxuICAgIGlmIChzdG9yZSkge1xyXG4gICAgICByZWxhdGVkUmVxdWVzdHMgPSBbXTtcclxuICAgICAgcXVlcnlSZXN1bHRzID0gc3RvcmUuZ2V0KGVudGl0eUlkLCBxdWVyeU9wdGlvbnMpO1xyXG4gICAgICB3aGVuKHF1ZXJ5UmVzdWx0cywgZnVuY3Rpb24ocmVsYXRlZEZlZWQpIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICAgIGNvbnN0IGVudHJ5ID0gcXVlcnlSZXN1bHRzLnJlc3VsdHNbMF07XHJcbiAgICAgICAgaWYgKGluY2x1ZGVSZWxhdGVkKSB7XHJcbiAgICAgICAgICByZWxhdGVkUmVxdWVzdHMgPSB0aGlzLmdldFJlbGF0ZWRSZXF1ZXN0cyhlbnRyeSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmIChyZWxhdGVkUmVxdWVzdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgYWxsKHJlbGF0ZWRSZXF1ZXN0cykudGhlbihcclxuICAgICAgICAgICAgKHJlbGF0ZWRSZXN1bHRzKSA9PiB7XHJcbiAgICAgICAgICAgICAgdGhpcy5hcHBseVJlbGF0ZWRSZXN1bHRzKGVudHJ5LCByZWxhdGVkUmVzdWx0cyk7XHJcbiAgICAgICAgICAgICAgYWxsKHRoaXMuZ2V0UGlja2xpc3RzKCkpLnRoZW4oXHJcbiAgICAgICAgICAgICAgICAoKSA9PiBkZWYucmVzb2x2ZShlbnRyeSksXHJcbiAgICAgICAgICAgICAgICBlcnIgPT4gZGVmLnJlamVjdChlcnIpKTtcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgKGVycikgPT4ge1xyXG4gICAgICAgICAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIGRlZi5yZXNvbHZlKGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH0uYmluZCh0aGlzKSwgKGVycikgPT4ge1xyXG4gICAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgICB9XHJcbiAgfSxcclxuICBnZXRFbnRyaWVzOiBmdW5jdGlvbiBnZXRFbnRyaWVzKHF1ZXJ5LCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBxdWVyeU1vZGVsTmFtZSA9IChvcHRpb25zICYmIG9wdGlvbnMucXVlcnlNb2RlbE5hbWUpID8gb3B0aW9ucy5xdWVyeU1vZGVsTmFtZSA6ICdsaXN0JztcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKHF1ZXJ5TW9kZWxOYW1lKTtcclxuICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IHRoaXMuZ2V0T3B0aW9ucyhvcHRpb25zKTtcclxuICAgIGNvbnN0IHF1ZXJ5RXhwcmVzc2lvbiA9IHRoaXMuYnVpbGRRdWVyeUV4cHJlc3Npb24ocXVlcnksIG9wdGlvbnMpO1xyXG5cclxuICAgIGNvbnN0IHF1ZXJ5UmVzdWx0cyA9IHN0b3JlLnF1ZXJ5KHF1ZXJ5RXhwcmVzc2lvbiwgcXVlcnlPcHRpb25zKTtcclxuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMucmV0dXJuUXVlcnlSZXN1bHRzKSB7XHJcbiAgICAgIHJldHVybiBxdWVyeVJlc3VsdHM7XHJcbiAgICB9XHJcbiAgICB3aGVuKHF1ZXJ5UmVzdWx0cywgKGVudGl0aWVzKSA9PiB7XHJcbiAgICAgIGRlZi5yZXNvbHZlKGVudGl0aWVzKTtcclxuICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgfSk7XHJcbiAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgfSxcclxuICBnZXRSZWxhdGVkUmVxdWVzdHM6IGZ1bmN0aW9uIGdldFJlbGF0ZWRSZXF1ZXN0cyhlbnRyeSkge1xyXG4gICAgY29uc3Qgc2VsZiA9IHRoaXM7XHJcbiAgICBjb25zdCByZXF1ZXN0cyA9IFtdO1xyXG4gICAgdGhpcy5yZWxhdGlvbnNoaXBzLmZvckVhY2goKHJlbCkgPT4ge1xyXG4gICAgICBsZXQgcmVxdWVzdCA9IG51bGw7XHJcbiAgICAgIGlmICghcmVsLmRpc2FibGVkKSB7XHJcbiAgICAgICAgcmVxdWVzdCA9IHNlbGYuZ2V0UmVsYXRlZFJlcXVlc3QoZW50cnksIHJlbCk7XHJcbiAgICAgICAgaWYgKHJlcXVlc3QpIHtcclxuICAgICAgICAgIHJlcXVlc3RzLnB1c2gocmVxdWVzdCk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICAgIHJldHVybiByZXF1ZXN0cztcclxuICB9LFxyXG4gIGdldFJlbGF0ZWRSZXF1ZXN0OiBmdW5jdGlvbiBnZXRSZWxhdGVkUmVxdWVzdChlbnRyeSwgcmVsYXRpb25zaGlwLCBvcHRpb25zKSB7XHJcbiAgICBsZXQgcXVlcnlPcHRpb25zO1xyXG4gICAgbGV0IHF1ZXJ5UmVzdWx0cztcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgY29uc3QgbW9kZWwgPSBBcHAuTW9kZWxNYW5hZ2VyLmdldE1vZGVsKHJlbGF0aW9uc2hpcC5yZWxhdGVkRW50aXR5LCBNT0RFTF9UWVBFUy5TREFUQSk7XHJcbiAgICBpZiAobW9kZWwpIHtcclxuICAgICAgcXVlcnlPcHRpb25zID0gdGhpcy5nZXRSZWxhdGVkUXVlcnlPcHRpb25zKGVudHJ5LCByZWxhdGlvbnNoaXAsIG9wdGlvbnMpO1xyXG4gICAgICBpZiAocXVlcnlPcHRpb25zKSB7XHJcbiAgICAgICAgcXVlcnlSZXN1bHRzID0gbW9kZWwuZ2V0RW50cmllcyhudWxsLCBxdWVyeU9wdGlvbnMpO1xyXG4gICAgICAgIHdoZW4ocXVlcnlSZXN1bHRzLCAoZW50aXRpZXMpID0+IHtcclxuICAgICAgICAgIGNvbnN0IHJlc3VsdHMgPSB7XHJcbiAgICAgICAgICAgIGVudGl0eU5hbWU6IG1vZGVsLmVudGl0eU5hbWUsXHJcbiAgICAgICAgICAgIGVudGl0eURpc3BsYXlOYW1lOiBtb2RlbC5lbnRpdHlEaXNwbGF5TmFtZSxcclxuICAgICAgICAgICAgZW50aXR5RGlzcGxheU5hbWVQbHVyYWw6IG1vZGVsLmVudGl0eURpc3BsYXlOYW1lUGx1cmFsLFxyXG4gICAgICAgICAgICByZWxhdGlvbnNoaXAsXHJcbiAgICAgICAgICAgIGNvdW50OiBlbnRpdGllcy5sZW5ndGgsXHJcbiAgICAgICAgICAgIGVudGl0aWVzLFxyXG4gICAgICAgICAgfTtcclxuICAgICAgICAgIGRlZi5yZXNvbHZlKHJlc3VsdHMpO1xyXG4gICAgICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgICAgICB9KTtcclxuICAgICAgICByZXR1cm4gZGVmLnByb21pc2U7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIGdldFJlbGF0ZWRRdWVyeU9wdGlvbnM6IGZ1bmN0aW9uIGdldFJlbGF0ZWRRdWVyeU9wdGlvbnMoZW50cnksIHJlbGF0aW9uc2hpcCwgb3B0aW9ucykge1xyXG4gICAgbGV0IHBhcmVudERhdGFQYXRoO1xyXG4gICAgbGV0IHJlbGF0ZWREYXRhUGF0aDtcclxuICAgIGxldCBvcHRpb25zVGVtcCA9IG9wdGlvbnM7XHJcblxyXG4gICAgaWYgKCFvcHRpb25zVGVtcCkge1xyXG4gICAgICBvcHRpb25zVGVtcCA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IHF1ZXJ5T3B0aW9ucyA9IHtcclxuICAgICAgY291bnQ6IChvcHRpb25zVGVtcC5jb3VudCkgPyBvcHRpb25zVGVtcC5jb3VudCA6IG51bGwsXHJcbiAgICAgIHN0YXJ0OiAob3B0aW9uc1RlbXAuc3RhcnQpID8gb3B0aW9uc1RlbXAuc3RhcnQgOiBudWxsLFxyXG4gICAgICB3aGVyZTogKG9wdGlvbnNUZW1wLndoZXJlKSA/IG9wdGlvbnNUZW1wLndoZXJlIDogbnVsbCxcclxuICAgICAgc29ydDogKG9wdGlvbnNUZW1wLm9yZGVyQnkpID8gb3B0aW9uc1RlbXAub3JkZXJCeSA6IG51bGwsXHJcbiAgICAgIHF1ZXJ5TW9kZWxOYW1lOiAocmVsYXRpb25zaGlwLnF1ZXJ5TW9kZWxOYW1lKSA/IHJlbGF0aW9uc2hpcC5xdWVyeU1vZGVsTmFtZSA6ICdkZXRhaWwnLFxyXG4gICAgfTtcclxuXHJcbiAgICBpZiAocmVsYXRpb25zaGlwLnBhcmVudFByb3BlcnR5KSB7XHJcbiAgICAgIHBhcmVudERhdGFQYXRoID0gKHJlbGF0aW9uc2hpcC5wYXJlbnREYXRhUGF0aCkgPyByZWxhdGlvbnNoaXAucGFyZW50RGF0YVBhdGggOiByZWxhdGlvbnNoaXAucGFyZW50UHJvcGVydHk7XHJcbiAgICAgIGlmIChyZWxhdGlvbnNoaXAucGFyZW50UHJvcGVydHlUeXBlICYmIChyZWxhdGlvbnNoaXAucGFyZW50UHJvcGVydHlUeXBlID09PSAnb2JqZWN0JykpIHtcclxuICAgICAgICBwYXJlbnREYXRhUGF0aCA9IGAke3JlbGF0aW9uc2hpcC5wYXJlbnRQcm9wZXJ0eX0uJGtleWA7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHBhcmVudERhdGFQYXRoID0gdGhpcy5pZFByb3BlcnR5O1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXAucmVsYXRlZFByb3BlcnR5KSB7XHJcbiAgICAgIHJlbGF0ZWREYXRhUGF0aCA9IChyZWxhdGlvbnNoaXAucmVsYXRlZERhdGFQYXRoKSA/IHJlbGF0aW9uc2hpcC5yZWxhdGVkRGF0YVBhdGggOiByZWxhdGlvbnNoaXAucmVsYXRlZFByb3BlcnR5O1xyXG4gICAgICBpZiAocmVsYXRpb25zaGlwLnJlbGF0ZWRQcm9wZXJ0eVR5cGUgJiYgKHJlbGF0aW9uc2hpcC5yZWxhdGVkUHJvcGVydHlUeXBlID09PSAnb2JqZWN0JykpIHtcclxuICAgICAgICByZWxhdGVkRGF0YVBhdGggPSBgJHtyZWxhdGlvbnNoaXAucmVsYXRlZFByb3BlcnR5fS5JZGA7XHJcbiAgICAgIH1cclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlbGF0ZWREYXRhUGF0aCA9ICdJZCc7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVsYXRlZFZhbHVlID0gdXRpbGl0eS5nZXRWYWx1ZShlbnRyeSwgcGFyZW50RGF0YVBhdGgpO1xyXG4gICAgY29uc3Qgd2hlcmUgPSBcIiR7MH0gZXEgJyR7MX0nXCI7XHJcbiAgICBpZiAoIXJlbGF0ZWRWYWx1ZSkge1xyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH1cclxuICAgIHF1ZXJ5T3B0aW9ucy53aGVyZSA9IHN0cmluZy5zdWJzdGl0dXRlKHdoZXJlLCBbcmVsYXRlZERhdGFQYXRoLCByZWxhdGVkVmFsdWVdKTtcclxuICAgIGlmIChyZWxhdGlvbnNoaXAud2hlcmUpIHtcclxuICAgICAgaWYgKHR5cGVvZiByZWxhdGlvbnNoaXAud2hlcmUgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICBxdWVyeU9wdGlvbnMud2hlcmUgPSByZWxhdGlvbnNoaXAud2hlcmUuYXBwbHkodGhpcywgW2VudHJ5XSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcXVlcnlPcHRpb25zLndoZXJlID0gYCR7cXVlcnlPcHRpb25zLndoZXJlfSBhbmQgJHtyZWxhdGlvbnNoaXAud2hlcmV9YDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHF1ZXJ5T3B0aW9ucztcclxuICB9LFxyXG4gIGFwcGx5UmVsYXRlZFJlc3VsdHM6IGZ1bmN0aW9uIGFwcGx5UmVsYXRlZFJlc3VsdHMoZW50cnksIHJlbGF0ZWRSZXN1bHRzKSB7XHJcbiAgICBjb25zdCByZWxhdGVkRW50aXRpZXMgPSBbXTtcclxuICAgIHJlbGF0ZWRSZXN1bHRzLmZvckVhY2goKHJlc3VsdCkgPT4ge1xyXG4gICAgICByZWxhdGVkRW50aXRpZXMucHVzaChyZXN1bHQpO1xyXG4gICAgfSk7XHJcbiAgICBlbnRyeS4kcmVsYXRlZEVudGl0aWVzID0gcmVsYXRlZEVudGl0aWVzO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19