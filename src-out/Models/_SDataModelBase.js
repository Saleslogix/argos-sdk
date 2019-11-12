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

      this.inherited(arguments);

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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Nb2RlbHMvX1NEYXRhTW9kZWxCYXNlLmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJxdWVyeU1vZGVscyIsIk1vZGVsVHlwZSIsIlNEQVRBIiwiX2dldFF1ZXJ5TW9kZWxCeU5hbWUiLCJuYW1lIiwiY29uc29sZSIsIndhcm4iLCJyZXN1bHRzIiwiZmlsdGVyIiwibW9kZWwiLCJpbml0IiwiaW5oZXJpdGVkIiwiYXJndW1lbnRzIiwiX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQiLCJjcmVhdGVRdWVyeU1vZGVscyIsImZvckVhY2giLCJxdWVyeU1vZGVsIiwicXVlcnlTZWxlY3QiLCJxdWVyeUluY2x1ZGUiLCJnZXRPcHRpb25zIiwib3B0aW9ucyIsInRlbXBPcHRpb25zIiwic2VsZWN0IiwiaW5jbHVkZSIsIm9yZGVyQnkiLCJjb250cmFjdE5hbWUiLCJyZXNvdXJjZUtpbmQiLCJyZXNvdXJjZVByb3BlcnR5IiwicmVzb3VyY2VQcmVkaWNhdGUiLCJxdWVyeUFyZ3MiLCJzdGFydCIsImNvdW50IiwiZ2V0SWQiLCJpZCIsImtleSIsImdldFBpY2tsaXN0cyIsIkFwcCIsInBpY2tsaXN0U2VydmljZSIsInJlcXVlc3RQaWNrbGlzdHNGcm9tQXJyYXkiLCJwaWNrbGlzdHMiLCJidWlsZFF1ZXJ5RXhwcmVzc2lvbiIsIl9idWlsZFF1ZXJ5RXhwcmVzc2lvbiIsInF1ZXJ5IiwicGFzc2VkIiwid2hlcmUiLCJleHBhbmQiLCJjcmVhdGVTdG9yZSIsInR5cGUiLCJzZXJ2aWNlIiwiYXBwIiwiZ2V0IiwiY29uZmlnIiwidHlwZWRDb25maWciLCJnZXRTZXJ2aWNlIiwicXVlcnlXaGVyZSIsInF1ZXJ5T3JkZXJCeSIsIml0ZW1zUHJvcGVydHkiLCJpZFByb3BlcnR5IiwibGFiZWxQcm9wZXJ0eSIsImVudGl0eVByb3BlcnR5IiwidmVyc2lvblByb3BlcnR5Iiwic2NvcGUiLCJpbnNlcnRFbnRyeSIsImVudHJ5Iiwic3RvcmUiLCJhZGQiLCJ1cGRhdGVFbnRyeSIsImRlZiIsIkVycm9yIiwidmFsaWRhdGUiLCJ0aGVuIiwicHV0IiwicmVzdWx0Iiwib25FbnRyeVVwZGF0ZWQiLCJyZXNvbHZlIiwiZXJyIiwicmVqZWN0IiwicHJvbWlzZSIsIm9yZ2luYWxFbnRyeSIsImdldEVudHJ5IiwiZW50aXR5SWQiLCJxdWVyeVJlc3VsdHMiLCJyZWxhdGVkUmVxdWVzdHMiLCJxdWVyeU1vZGVsTmFtZSIsImluY2x1ZGVSZWxhdGVkIiwicXVlcnlPcHRpb25zIiwicmVsYXRlZEZlZWQiLCJnZXRSZWxhdGVkUmVxdWVzdHMiLCJsZW5ndGgiLCJyZWxhdGVkUmVzdWx0cyIsImFwcGx5UmVsYXRlZFJlc3VsdHMiLCJiaW5kIiwiZ2V0RW50cmllcyIsInF1ZXJ5RXhwcmVzc2lvbiIsInJldHVyblF1ZXJ5UmVzdWx0cyIsImVudGl0aWVzIiwic2VsZiIsInJlcXVlc3RzIiwicmVsYXRpb25zaGlwcyIsInJlbCIsInJlcXVlc3QiLCJkaXNhYmxlZCIsImdldFJlbGF0ZWRSZXF1ZXN0IiwicHVzaCIsInJlbGF0aW9uc2hpcCIsIk1vZGVsTWFuYWdlciIsImdldE1vZGVsIiwicmVsYXRlZEVudGl0eSIsImdldFJlbGF0ZWRRdWVyeU9wdGlvbnMiLCJlbnRpdHlOYW1lIiwiZW50aXR5RGlzcGxheU5hbWUiLCJlbnRpdHlEaXNwbGF5TmFtZVBsdXJhbCIsInBhcmVudERhdGFQYXRoIiwicmVsYXRlZERhdGFQYXRoIiwib3B0aW9uc1RlbXAiLCJzb3J0IiwicGFyZW50UHJvcGVydHkiLCJwYXJlbnRQcm9wZXJ0eVR5cGUiLCJyZWxhdGVkUHJvcGVydHkiLCJyZWxhdGVkUHJvcGVydHlUeXBlIiwicmVsYXRlZFZhbHVlIiwiZ2V0VmFsdWUiLCJzdWJzdGl0dXRlIiwiYXBwbHkiLCJyZWxhdGVkRW50aXRpZXMiLCIkcmVsYXRlZEVudGl0aWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQXlCQTs7O0FBR0EsTUFBTUEsVUFBVSx1QkFBUSw2QkFB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RDtBQUNGO0FBQ0QsYUFBT3lDLFlBQVA7QUFDRCxLQXRRNEc7QUF1UTdHSyx5QkFBcUIsU0FBU0EsbUJBQVQsQ0FBNkIzQixLQUE3QixFQUFvQzBCLGNBQXBDLEVBQW9EO0FBQ3ZFLFVBQU1tQyxrQkFBa0IsRUFBeEI7QUFDQW5DLHFCQUFlMUUsT0FBZixDQUF1QixVQUFDeUQsTUFBRCxFQUFZO0FBQ2pDb0Qsd0JBQWdCckIsSUFBaEIsQ0FBcUIvQixNQUFyQjtBQUNELE9BRkQ7QUFHQVQsWUFBTThELGdCQUFOLEdBQXlCRCxlQUF6QjtBQUNEO0FBN1E0RyxHQUEvRixDQUFoQixDLENBNUJBOzs7Ozs7Ozs7Ozs7Ozs7b0JBNFNlN0gsTyIsImZpbGUiOiJfU0RhdGFNb2RlbEJhc2UuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgU0RhdGFTdG9yZSBmcm9tICcuLi9TdG9yZS9TRGF0YSc7XHJcbmltcG9ydCBEZWZlcnJlZCBmcm9tICdkb2pvL0RlZmVycmVkJztcclxuaW1wb3J0IGFsbCBmcm9tICdkb2pvL3Byb21pc2UvYWxsJztcclxuaW1wb3J0IHdoZW4gZnJvbSAnZG9qby93aGVuJztcclxuaW1wb3J0IHN0cmluZyBmcm9tICdkb2pvL3N0cmluZyc7XHJcbmltcG9ydCB1dGlsaXR5IGZyb20gJy4uL1V0aWxpdHknO1xyXG5pbXBvcnQgX01vZGVsQmFzZSBmcm9tICcuL19Nb2RlbEJhc2UnO1xyXG5pbXBvcnQgTU9ERUxfVFlQRVMgZnJvbSAnLi9UeXBlcyc7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLk1vZGVscy5fU0RhdGFNb2RlbEJhc2VcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5Nb2RlbHMuU0RhdGFNb2RlbEJhc2UnLCBbX01vZGVsQmFzZV0sIC8qKiBAbGVuZHMgYXJnb3MuTW9kZWxzLlNEYXRhTW9kZWxCYXNlIyAqL3tcclxuICBxdWVyeU1vZGVsczogbnVsbCxcclxuICBNb2RlbFR5cGU6IE1PREVMX1RZUEVTLlNEQVRBLFxyXG5cclxuICBfZ2V0UXVlcnlNb2RlbEJ5TmFtZTogZnVuY3Rpb24gX2dldFF1ZXJ5TW9kZWxCeU5hbWUobmFtZSkge1xyXG4gICAgaWYgKCF0aGlzLnF1ZXJ5TW9kZWxzKSB7XHJcbiAgICAgIGNvbnNvbGUud2FybignTm8gcXVlcnkgTW9kZWxzIGRlZmluZWQnKTsvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcmVzdWx0cyA9IHRoaXMucXVlcnlNb2RlbHMuZmlsdGVyKG1vZGVsID0+IG1vZGVsLm5hbWUgPT09IG5hbWUpO1xyXG4gICAgcmV0dXJuIHJlc3VsdHNbMF07XHJcbiAgfSxcclxuICBpbml0OiBmdW5jdGlvbiBpbml0KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuXHJcbiAgICBpZiAoIXRoaXMucXVlcnlNb2RlbHMpIHtcclxuICAgICAgdGhpcy5xdWVyeU1vZGVscyA9IHRoaXMuX2NyZWF0ZUN1c3RvbWl6ZWRMYXlvdXQodGhpcy5jcmVhdGVRdWVyeU1vZGVscygpLCAncXVlcnlNb2RlbCcpO1xyXG4gICAgICB0aGlzLnF1ZXJ5TW9kZWxzLmZvckVhY2goKHF1ZXJ5TW9kZWwpID0+IHtcclxuICAgICAgICBxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0ID0gdGhpcy5fY3JlYXRlQ3VzdG9taXplZExheW91dChxdWVyeU1vZGVsLnF1ZXJ5U2VsZWN0LCBgJHtxdWVyeU1vZGVsLm5hbWV9L3F1ZXJ5U2VsZWN0YCk7XHJcbiAgICAgICAgcXVlcnlNb2RlbC5xdWVyeUluY2x1ZGUgPSB0aGlzLl9jcmVhdGVDdXN0b21pemVkTGF5b3V0KHF1ZXJ5TW9kZWwucXVlcnlJbmNsdWRlLCBgJHtxdWVyeU1vZGVsLm5hbWV9L3F1ZXJ5SW5jbHVkZWApO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIGNyZWF0ZVF1ZXJ5TW9kZWxzOiBmdW5jdGlvbiBjcmVhdGVRdWVyeU1vZGVscygpIHtcclxuICAgIHJldHVybiBbXTtcclxuICB9LFxyXG4gIGdldE9wdGlvbnM6IGZ1bmN0aW9uIGdldE9wdGlvbnMob3B0aW9ucykge1xyXG4gICAgY29uc3QgdGVtcE9wdGlvbnMgPSB7fTtcclxuICAgIGlmIChvcHRpb25zKSB7XHJcbiAgICAgIGlmIChvcHRpb25zLnNlbGVjdCkgdGVtcE9wdGlvbnMuc2VsZWN0ID0gb3B0aW9ucy5zZWxlY3Q7XHJcbiAgICAgIGlmIChvcHRpb25zLmluY2x1ZGUpIHRlbXBPcHRpb25zLmluY2x1ZGUgPSBvcHRpb25zLmluY2x1ZGU7XHJcbiAgICAgIGlmIChvcHRpb25zLm9yZGVyQnkpIHRlbXBPcHRpb25zLm9yZGVyQnkgPSBvcHRpb25zLm9yZGVyQnk7XHJcbiAgICAgIGlmIChvcHRpb25zLmNvbnRyYWN0TmFtZSkgdGVtcE9wdGlvbnMuY29udHJhY3ROYW1lID0gb3B0aW9ucy5jb250cmFjdE5hbWU7XHJcbiAgICAgIGlmIChvcHRpb25zLnJlc291cmNlS2luZCkgdGVtcE9wdGlvbnMucmVzb3VyY2VLaW5kID0gb3B0aW9ucy5yZXNvdXJjZUtpbmQ7XHJcbiAgICAgIGlmIChvcHRpb25zLnJlc291cmNlUHJvcGVydHkpIHRlbXBPcHRpb25zLnJlc291cmNlUHJvcGVydHkgPSBvcHRpb25zLnJlc291cmNlUHJvcGVydHk7XHJcbiAgICAgIGlmIChvcHRpb25zLnJlc291cmNlUHJlZGljYXRlKSB0ZW1wT3B0aW9ucy5yZXNvdXJjZVByZWRpY2F0ZSA9IG9wdGlvbnMucmVzb3VyY2VQcmVkaWNhdGU7XHJcbiAgICAgIGlmIChvcHRpb25zLnF1ZXJ5QXJncykgdGVtcE9wdGlvbnMucXVlcnlBcmdzID0gb3B0aW9ucy5xdWVyeUFyZ3M7XHJcbiAgICAgIGlmIChvcHRpb25zLnN0YXJ0KSB0ZW1wT3B0aW9ucy5zdGFydCA9IG9wdGlvbnMuc3RhcnQ7XHJcbiAgICAgIGlmIChvcHRpb25zLmNvdW50KSB0ZW1wT3B0aW9ucy5jb3VudCA9IG9wdGlvbnMuY291bnQ7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRlbXBPcHRpb25zO1xyXG4gIH0sXHJcbiAgZ2V0SWQ6IGZ1bmN0aW9uIGdldElkKG9wdGlvbnMpIHtcclxuICAgIHJldHVybiBvcHRpb25zICYmIChvcHRpb25zLmlkIHx8IG9wdGlvbnMua2V5KTtcclxuICB9LFxyXG4gIGdldFBpY2tsaXN0czogZnVuY3Rpb24gZ2V0UGlja2xpc3RzKCkge1xyXG4gICAgcmV0dXJuIEFwcC5waWNrbGlzdFNlcnZpY2UucmVxdWVzdFBpY2tsaXN0c0Zyb21BcnJheSh0aGlzLnBpY2tsaXN0cyk7XHJcbiAgfSxcclxuICBidWlsZFF1ZXJ5RXhwcmVzc2lvbjogZnVuY3Rpb24gX2J1aWxkUXVlcnlFeHByZXNzaW9uKHF1ZXJ5LCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBwYXNzZWQgPSBvcHRpb25zICYmIChvcHRpb25zLnF1ZXJ5IHx8IG9wdGlvbnMud2hlcmUpO1xyXG4gICAgcmV0dXJuIHBhc3NlZCA/IHF1ZXJ5ID8gJygnICsgdXRpbGl0eS5leHBhbmQodGhpcywgcGFzc2VkKSArICcpIGFuZCAoJyArIHF1ZXJ5ICsgJyknIDogJygnICsgdXRpbGl0eS5leHBhbmQodGhpcywgcGFzc2VkKSArICcpJyA6IHF1ZXJ5Oy8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICB9LFxyXG4gIGNyZWF0ZVN0b3JlOiBmdW5jdGlvbiBjcmVhdGVTdG9yZSh0eXBlLCBzZXJ2aWNlKSB7XHJcbiAgICBjb25zdCBhcHAgPSB0aGlzLmdldCgnYXBwJyk7XHJcbiAgICBjb25zdCBjb25maWcgPSB0aGlzO1xyXG4gICAgY29uc3QgdHlwZWRDb25maWcgPSB0aGlzLl9nZXRRdWVyeU1vZGVsQnlOYW1lKHR5cGUpO1xyXG5cclxuICAgIHJldHVybiBuZXcgU0RhdGFTdG9yZSh7XHJcbiAgICAgIHNlcnZpY2U6IHNlcnZpY2UgfHwgYXBwLmdldFNlcnZpY2UoZmFsc2UpLFxyXG4gICAgICBjb250cmFjdE5hbWU6IGNvbmZpZy5jb250cmFjdE5hbWUsXHJcbiAgICAgIHJlc291cmNlS2luZDogY29uZmlnLnJlc291cmNlS2luZCxcclxuXHJcbiAgICAgIHJlc291cmNlUHJvcGVydHk6IHR5cGVkQ29uZmlnLnJlc291cmNlUHJvcGVydHksXHJcbiAgICAgIHJlc291cmNlUHJlZGljYXRlOiB0eXBlZENvbmZpZy5yZXNvdXJjZVByZWRpY2F0ZSxcclxuICAgICAgaW5jbHVkZTogdHlwZWRDb25maWcucXVlcnlJbmNsdWRlLFxyXG4gICAgICBzZWxlY3Q6IHR5cGVkQ29uZmlnLnF1ZXJ5U2VsZWN0LFxyXG4gICAgICB3aGVyZTogdHlwZWRDb25maWcucXVlcnlXaGVyZSxcclxuICAgICAgcXVlcnlBcmdzOiB0eXBlZENvbmZpZy5xdWVyeUFyZ3MsXHJcbiAgICAgIG9yZGVyQnk6IHR5cGVkQ29uZmlnLnF1ZXJ5T3JkZXJCeSxcclxuXHJcbiAgICAgIGl0ZW1zUHJvcGVydHk6IGNvbmZpZy5pdGVtc1Byb3BlcnR5LFxyXG4gICAgICBpZFByb3BlcnR5OiBjb25maWcuaWRQcm9wZXJ0eSxcclxuICAgICAgbGFiZWxQcm9wZXJ0eTogY29uZmlnLmxhYmVsUHJvcGVydHksXHJcbiAgICAgIGVudGl0eVByb3BlcnR5OiBjb25maWcuZW50aXR5UHJvcGVydHksXHJcbiAgICAgIHZlcnNpb25Qcm9wZXJ0eTogY29uZmlnLnZlcnNpb25Qcm9wZXJ0eSxcclxuICAgICAgc2NvcGU6IHRoaXMsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGluc2VydEVudHJ5OiBmdW5jdGlvbiBpbnNlcnRFbnRyeShlbnRyeSwgb3B0aW9ucykge1xyXG4gICAgY29uc3Qgc3RvcmUgPSB0aGlzLmNyZWF0ZVN0b3JlKCdkZXRhaWwnKTtcclxuICAgIHJldHVybiBzdG9yZS5hZGQoZW50cnksIG9wdGlvbnMpO1xyXG4gIH0sXHJcbiAgdXBkYXRlRW50cnk6IGZ1bmN0aW9uIHVwZGF0ZUVudHJ5KGVudHJ5LCBvcHRpb25zKSB7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuY3JlYXRlU3RvcmUoJ2VkaXQnKTtcclxuICAgIGNvbnN0IGRlZiA9IG5ldyBEZWZlcnJlZCgpO1xyXG4gICAgaWYgKCFzdG9yZSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ05vIHN0b3JlIHNldC4nKTtcclxuICAgIH1cclxuICAgIHRoaXMudmFsaWRhdGUoZW50cnkpLnRoZW4oKCkgPT4ge1xyXG4gICAgICBzdG9yZS5wdXQoZW50cnksIG9wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAgIHRoaXMub25FbnRyeVVwZGF0ZWQocmVzdWx0LCBlbnRyeSk7XHJcbiAgICAgICAgZGVmLnJlc29sdmUocmVzdWx0KTtcclxuICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgICAgfSk7XHJcbiAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgIGRlZi5yZWplY3QoZXJyKTtcclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gIH0sXHJcbiAgb25FbnRyeVVwZGF0ZWQ6IGZ1bmN0aW9uIG9uRW50cnlVcGRhdGVkKHJlc3VsdCwgb3JnaW5hbEVudHJ5KSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIElmIGFuIGVudHJ5IGlzIHZhbGlkLCB2YWxpZGF0ZSBzaG91bGQgcmV0dXJuIGEgcHJvbWlzZSB0aGF0IHJlc29sdmVzIHRvIHRydWUuIElmIHRoZSBlbnRyeSBpcyBub3QgdmFsaWQsXHJcbiAgICogdmFsaWRhdGUgc2hvdWxkIHJldHVybiBhIHJlamVjdCBwcm9taXNlIHdpdGggdGhlIGVycm9yIG1lc3NhZ2UuXHJcbiAgICogQHBhcmFtIGVudHJ5XHJcbiAgICogQHJldHVybnMgUHJvbWlzZVxyXG4gICAqL1xyXG4gIHZhbGlkYXRlOiBmdW5jdGlvbiB2YWxpZGF0ZShlbnRyeSkge1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBpZiAoZW50cnkpIHtcclxuICAgICAgZGVmLnJlc29sdmUodHJ1ZSk7XHJcbiAgICB9XHJcblxyXG4gICAgZGVmLnJlamVjdCgnVGhlIGVudHJ5IGlzIG51bGwgb3IgdW5kZWZpbmVkLicpO1xyXG4gICAgcmV0dXJuIGRlZi5wcm9taXNlO1xyXG4gIH0sXHJcbiAgZ2V0RW50cnk6IGZ1bmN0aW9uIGdldEVudHJ5KGVudGl0eUlkLCBvcHRpb25zKSB7XHJcbiAgICBsZXQgcXVlcnlSZXN1bHRzO1xyXG4gICAgbGV0IHJlbGF0ZWRSZXF1ZXN0cztcclxuICAgIGNvbnN0IHF1ZXJ5TW9kZWxOYW1lID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5xdWVyeU1vZGVsTmFtZSkgPyBvcHRpb25zLnF1ZXJ5TW9kZWxOYW1lIDogJ2RldGFpbCc7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuY3JlYXRlU3RvcmUocXVlcnlNb2RlbE5hbWUpO1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBjb25zdCBpbmNsdWRlUmVsYXRlZCA9IChvcHRpb25zICYmIG9wdGlvbnMuaW5jbHVkZVJlbGF0ZWQpID8gb3B0aW9ucy5pbmNsdWRlUmVsYXRlZCA6IGZhbHNlO1xyXG4gICAgY29uc3QgcXVlcnlPcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgaWYgKHN0b3JlKSB7XHJcbiAgICAgIHJlbGF0ZWRSZXF1ZXN0cyA9IFtdO1xyXG4gICAgICBxdWVyeVJlc3VsdHMgPSBzdG9yZS5nZXQoZW50aXR5SWQsIHF1ZXJ5T3B0aW9ucyk7XHJcbiAgICAgIHdoZW4ocXVlcnlSZXN1bHRzLCBmdW5jdGlvbihyZWxhdGVkRmVlZCkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgICAgY29uc3QgZW50cnkgPSBxdWVyeVJlc3VsdHMucmVzdWx0c1swXTtcclxuICAgICAgICBpZiAoaW5jbHVkZVJlbGF0ZWQpIHtcclxuICAgICAgICAgIHJlbGF0ZWRSZXF1ZXN0cyA9IHRoaXMuZ2V0UmVsYXRlZFJlcXVlc3RzKGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHJlbGF0ZWRSZXF1ZXN0cy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICBhbGwocmVsYXRlZFJlcXVlc3RzKS50aGVuKFxyXG4gICAgICAgICAgICAocmVsYXRlZFJlc3VsdHMpID0+IHtcclxuICAgICAgICAgICAgICB0aGlzLmFwcGx5UmVsYXRlZFJlc3VsdHMoZW50cnksIHJlbGF0ZWRSZXN1bHRzKTtcclxuICAgICAgICAgICAgICBhbGwodGhpcy5nZXRQaWNrbGlzdHMoKSkudGhlbihcclxuICAgICAgICAgICAgICAgICgpID0+IGRlZi5yZXNvbHZlKGVudHJ5KSxcclxuICAgICAgICAgICAgICAgIGVyciA9PiBkZWYucmVqZWN0KGVycikpO1xyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAoZXJyKSA9PiB7XHJcbiAgICAgICAgICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgZGVmLnJlc29sdmUoZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfS5iaW5kKHRoaXMpLCAoZXJyKSA9PiB7XHJcbiAgICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICAgIH1cclxuICB9LFxyXG4gIGdldEVudHJpZXM6IGZ1bmN0aW9uIGdldEVudHJpZXMocXVlcnksIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IHF1ZXJ5TW9kZWxOYW1lID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5xdWVyeU1vZGVsTmFtZSkgPyBvcHRpb25zLnF1ZXJ5TW9kZWxOYW1lIDogJ2xpc3QnO1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBjb25zdCBzdG9yZSA9IHRoaXMuY3JlYXRlU3RvcmUocXVlcnlNb2RlbE5hbWUpO1xyXG4gICAgY29uc3QgcXVlcnlPcHRpb25zID0gdGhpcy5nZXRPcHRpb25zKG9wdGlvbnMpO1xyXG4gICAgY29uc3QgcXVlcnlFeHByZXNzaW9uID0gdGhpcy5idWlsZFF1ZXJ5RXhwcmVzc2lvbihxdWVyeSwgb3B0aW9ucyk7XHJcblxyXG4gICAgY29uc3QgcXVlcnlSZXN1bHRzID0gc3RvcmUucXVlcnkocXVlcnlFeHByZXNzaW9uLCBxdWVyeU9wdGlvbnMpO1xyXG4gICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5yZXR1cm5RdWVyeVJlc3VsdHMpIHtcclxuICAgICAgcmV0dXJuIHF1ZXJ5UmVzdWx0cztcclxuICAgIH1cclxuICAgIHdoZW4ocXVlcnlSZXN1bHRzLCAoZW50aXRpZXMpID0+IHtcclxuICAgICAgZGVmLnJlc29sdmUoZW50aXRpZXMpO1xyXG4gICAgfSwgKGVycikgPT4ge1xyXG4gICAgICBkZWYucmVqZWN0KGVycik7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICB9LFxyXG4gIGdldFJlbGF0ZWRSZXF1ZXN0czogZnVuY3Rpb24gZ2V0UmVsYXRlZFJlcXVlc3RzKGVudHJ5KSB7XHJcbiAgICBjb25zdCBzZWxmID0gdGhpcztcclxuICAgIGNvbnN0IHJlcXVlc3RzID0gW107XHJcbiAgICB0aGlzLnJlbGF0aW9uc2hpcHMuZm9yRWFjaCgocmVsKSA9PiB7XHJcbiAgICAgIGxldCByZXF1ZXN0ID0gbnVsbDtcclxuICAgICAgaWYgKCFyZWwuZGlzYWJsZWQpIHtcclxuICAgICAgICByZXF1ZXN0ID0gc2VsZi5nZXRSZWxhdGVkUmVxdWVzdChlbnRyeSwgcmVsKTtcclxuICAgICAgICBpZiAocmVxdWVzdCkge1xyXG4gICAgICAgICAgcmVxdWVzdHMucHVzaChyZXF1ZXN0KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gICAgcmV0dXJuIHJlcXVlc3RzO1xyXG4gIH0sXHJcbiAgZ2V0UmVsYXRlZFJlcXVlc3Q6IGZ1bmN0aW9uIGdldFJlbGF0ZWRSZXF1ZXN0KGVudHJ5LCByZWxhdGlvbnNoaXAsIG9wdGlvbnMpIHtcclxuICAgIGxldCBxdWVyeU9wdGlvbnM7XHJcbiAgICBsZXQgcXVlcnlSZXN1bHRzO1xyXG4gICAgY29uc3QgZGVmID0gbmV3IERlZmVycmVkKCk7XHJcbiAgICBjb25zdCBtb2RlbCA9IEFwcC5Nb2RlbE1hbmFnZXIuZ2V0TW9kZWwocmVsYXRpb25zaGlwLnJlbGF0ZWRFbnRpdHksIE1PREVMX1RZUEVTLlNEQVRBKTtcclxuICAgIGlmIChtb2RlbCkge1xyXG4gICAgICBxdWVyeU9wdGlvbnMgPSB0aGlzLmdldFJlbGF0ZWRRdWVyeU9wdGlvbnMoZW50cnksIHJlbGF0aW9uc2hpcCwgb3B0aW9ucyk7XHJcbiAgICAgIGlmIChxdWVyeU9wdGlvbnMpIHtcclxuICAgICAgICBxdWVyeVJlc3VsdHMgPSBtb2RlbC5nZXRFbnRyaWVzKG51bGwsIHF1ZXJ5T3B0aW9ucyk7XHJcbiAgICAgICAgd2hlbihxdWVyeVJlc3VsdHMsIChlbnRpdGllcykgPT4ge1xyXG4gICAgICAgICAgY29uc3QgcmVzdWx0cyA9IHtcclxuICAgICAgICAgICAgZW50aXR5TmFtZTogbW9kZWwuZW50aXR5TmFtZSxcclxuICAgICAgICAgICAgZW50aXR5RGlzcGxheU5hbWU6IG1vZGVsLmVudGl0eURpc3BsYXlOYW1lLFxyXG4gICAgICAgICAgICBlbnRpdHlEaXNwbGF5TmFtZVBsdXJhbDogbW9kZWwuZW50aXR5RGlzcGxheU5hbWVQbHVyYWwsXHJcbiAgICAgICAgICAgIHJlbGF0aW9uc2hpcCxcclxuICAgICAgICAgICAgY291bnQ6IGVudGl0aWVzLmxlbmd0aCxcclxuICAgICAgICAgICAgZW50aXRpZXMsXHJcbiAgICAgICAgICB9O1xyXG4gICAgICAgICAgZGVmLnJlc29sdmUocmVzdWx0cyk7XHJcbiAgICAgICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAgICAgZGVmLnJlamVjdChlcnIpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkZWYucHJvbWlzZTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2V0UmVsYXRlZFF1ZXJ5T3B0aW9uczogZnVuY3Rpb24gZ2V0UmVsYXRlZFF1ZXJ5T3B0aW9ucyhlbnRyeSwgcmVsYXRpb25zaGlwLCBvcHRpb25zKSB7XHJcbiAgICBsZXQgcGFyZW50RGF0YVBhdGg7XHJcbiAgICBsZXQgcmVsYXRlZERhdGFQYXRoO1xyXG4gICAgbGV0IG9wdGlvbnNUZW1wID0gb3B0aW9ucztcclxuXHJcbiAgICBpZiAoIW9wdGlvbnNUZW1wKSB7XHJcbiAgICAgIG9wdGlvbnNUZW1wID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgcXVlcnlPcHRpb25zID0ge1xyXG4gICAgICBjb3VudDogKG9wdGlvbnNUZW1wLmNvdW50KSA/IG9wdGlvbnNUZW1wLmNvdW50IDogbnVsbCxcclxuICAgICAgc3RhcnQ6IChvcHRpb25zVGVtcC5zdGFydCkgPyBvcHRpb25zVGVtcC5zdGFydCA6IG51bGwsXHJcbiAgICAgIHdoZXJlOiAob3B0aW9uc1RlbXAud2hlcmUpID8gb3B0aW9uc1RlbXAud2hlcmUgOiBudWxsLFxyXG4gICAgICBzb3J0OiAob3B0aW9uc1RlbXAub3JkZXJCeSkgPyBvcHRpb25zVGVtcC5vcmRlckJ5IDogbnVsbCxcclxuICAgICAgcXVlcnlNb2RlbE5hbWU6IChyZWxhdGlvbnNoaXAucXVlcnlNb2RlbE5hbWUpID8gcmVsYXRpb25zaGlwLnF1ZXJ5TW9kZWxOYW1lIDogJ2RldGFpbCcsXHJcbiAgICB9O1xyXG5cclxuICAgIGlmIChyZWxhdGlvbnNoaXAucGFyZW50UHJvcGVydHkpIHtcclxuICAgICAgcGFyZW50RGF0YVBhdGggPSAocmVsYXRpb25zaGlwLnBhcmVudERhdGFQYXRoKSA/IHJlbGF0aW9uc2hpcC5wYXJlbnREYXRhUGF0aCA6IHJlbGF0aW9uc2hpcC5wYXJlbnRQcm9wZXJ0eTtcclxuICAgICAgaWYgKHJlbGF0aW9uc2hpcC5wYXJlbnRQcm9wZXJ0eVR5cGUgJiYgKHJlbGF0aW9uc2hpcC5wYXJlbnRQcm9wZXJ0eVR5cGUgPT09ICdvYmplY3QnKSkge1xyXG4gICAgICAgIHBhcmVudERhdGFQYXRoID0gYCR7cmVsYXRpb25zaGlwLnBhcmVudFByb3BlcnR5fS4ka2V5YDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcGFyZW50RGF0YVBhdGggPSB0aGlzLmlkUHJvcGVydHk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKHJlbGF0aW9uc2hpcC5yZWxhdGVkUHJvcGVydHkpIHtcclxuICAgICAgcmVsYXRlZERhdGFQYXRoID0gKHJlbGF0aW9uc2hpcC5yZWxhdGVkRGF0YVBhdGgpID8gcmVsYXRpb25zaGlwLnJlbGF0ZWREYXRhUGF0aCA6IHJlbGF0aW9uc2hpcC5yZWxhdGVkUHJvcGVydHk7XHJcbiAgICAgIGlmIChyZWxhdGlvbnNoaXAucmVsYXRlZFByb3BlcnR5VHlwZSAmJiAocmVsYXRpb25zaGlwLnJlbGF0ZWRQcm9wZXJ0eVR5cGUgPT09ICdvYmplY3QnKSkge1xyXG4gICAgICAgIHJlbGF0ZWREYXRhUGF0aCA9IGAke3JlbGF0aW9uc2hpcC5yZWxhdGVkUHJvcGVydHl9LklkYDtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcmVsYXRlZERhdGFQYXRoID0gJ0lkJztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCByZWxhdGVkVmFsdWUgPSB1dGlsaXR5LmdldFZhbHVlKGVudHJ5LCBwYXJlbnREYXRhUGF0aCk7XHJcbiAgICBjb25zdCB3aGVyZSA9IFwiJHswfSBlcSAnJHsxfSdcIjtcclxuICAgIGlmICghcmVsYXRlZFZhbHVlKSB7XHJcbiAgICAgIHJldHVybiBudWxsO1xyXG4gICAgfVxyXG4gICAgcXVlcnlPcHRpb25zLndoZXJlID0gc3RyaW5nLnN1YnN0aXR1dGUod2hlcmUsIFtyZWxhdGVkRGF0YVBhdGgsIHJlbGF0ZWRWYWx1ZV0pO1xyXG4gICAgaWYgKHJlbGF0aW9uc2hpcC53aGVyZSkge1xyXG4gICAgICBpZiAodHlwZW9mIHJlbGF0aW9uc2hpcC53aGVyZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgIHF1ZXJ5T3B0aW9ucy53aGVyZSA9IHJlbGF0aW9uc2hpcC53aGVyZS5hcHBseSh0aGlzLCBbZW50cnldKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBxdWVyeU9wdGlvbnMud2hlcmUgPSBgJHtxdWVyeU9wdGlvbnMud2hlcmV9IGFuZCAke3JlbGF0aW9uc2hpcC53aGVyZX1gO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcXVlcnlPcHRpb25zO1xyXG4gIH0sXHJcbiAgYXBwbHlSZWxhdGVkUmVzdWx0czogZnVuY3Rpb24gYXBwbHlSZWxhdGVkUmVzdWx0cyhlbnRyeSwgcmVsYXRlZFJlc3VsdHMpIHtcclxuICAgIGNvbnN0IHJlbGF0ZWRFbnRpdGllcyA9IFtdO1xyXG4gICAgcmVsYXRlZFJlc3VsdHMuZm9yRWFjaCgocmVzdWx0KSA9PiB7XHJcbiAgICAgIHJlbGF0ZWRFbnRpdGllcy5wdXNoKHJlc3VsdCk7XHJcbiAgICB9KTtcclxuICAgIGVudHJ5LiRyZWxhdGVkRW50aXRpZXMgPSByZWxhdGVkRW50aXRpZXM7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=