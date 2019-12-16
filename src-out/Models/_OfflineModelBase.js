define('argos/Models/_OfflineModelBase', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', '../Store/PouchDB', 'dojo/Deferred', 'dojo/promise/all', 'dojo/when', '../Utility', '../_CustomizationMixin', './_ModelBase', 'dojo/store/util/QueryResults', './Types', '../Convert'], function (module, exports, _declare, _lang, _PouchDB, _Deferred, _all, _when, _Utility, _CustomizationMixin2, _ModelBase2, _QueryResults, _Types, _Convert) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _PouchDB2 = _interopRequireDefault(_PouchDB);

  var _Deferred2 = _interopRequireDefault(_Deferred);

  var _all2 = _interopRequireDefault(_all);

  var _when2 = _interopRequireDefault(_when);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _CustomizationMixin3 = _interopRequireDefault(_CustomizationMixin2);

  var _ModelBase3 = _interopRequireDefault(_ModelBase2);

  var _QueryResults2 = _interopRequireDefault(_QueryResults);

  var _Types2 = _interopRequireDefault(_Types);

  var _Convert2 = _interopRequireDefault(_Convert);

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

  var databaseName = 'crm-offline';
  var _store = new _PouchDB2.default(databaseName);

  /**
   * @class argos.Models._OfflineModelBase
   */
  var __class = (0, _declare2.default)('argos.Models.Offline.OfflineModelBase', [_ModelBase3.default, _CustomizationMixin3.default], {

    store: null,
    modelType: _Types2.default.OFFLINE,
    init: function init() {
      this.inherited(init, arguments);
      this.createNamedQueries();
    },
    createNamedQueries: function createNamedQueries() {
      var store = this.getStore();
      // TODO: This is a shared named query, and probably doesn't belong here (will be called multiple times)
      store.createNamedQuery({
        _id: '_design/entities',
        _rev: '1',
        views: {
          by_name: {
            map: function map(doc) {
              emit(doc.entityName); // eslint-disable-line
            }.toString()
          }
        }
      });
    },
    getStore: function getStore() {
      if (!this.store) {
        this.store = _store;
      }
      return this.store;
    },
    getDocId: function getEntityId(entry) {
      return this.getEntityId(entry);
    },
    getEntry: function getEntry(entityId) {
      var _this = this;

      var def = new _Deferred2.default();
      this.getEntryDoc(entityId).then(function (doc) {
        def.resolve(_this.unWrap(doc));
      }, function (err) {
        def.reject(err);
      });
      return def;
    },
    getEntryDoc: function getEntry(entityId) {
      var store = this.getStore();
      var def = new _Deferred2.default();
      store.get(entityId).then(function (results) {
        def.resolve(results);
      }, function (err) {
        def.reject(err);
      });
      return def;
    },
    saveEntry: function saveEntity(entry, options) {
      var _this2 = this;

      var def = new _Deferred2.default();
      this.updateEntry(entry, options).then(function (updateResult) {
        var odef = def;
        _this2.saveRelatedEntries(entry, options).then(function () {
          odef.resolve(updateResult);
        }, function (err) {
          odef.reject(err);
        });
      }, function () {
        // Fetching the doc/entity failed, so we will insert a new doc instead.
        _this2.insertEntry(entry, options).then(function (insertResult) {
          var odef = def;
          _this2.saveRelatedEntries(entry, options).then(function () {
            odef.resolve(insertResult);
          }, function (err) {
            odef.reject(err);
          });
        }, function (err) {
          def.reject(err);
        });
      });
      return def.promise;
    },
    insertEntry: function insertEntry(entry, options) {
      var store = this.getStore();
      var def = new _Deferred2.default();
      var doc = this.wrap(entry, options);
      store.add(doc).then(function (result) {
        def.resolve(result);
      }, function (err) {
        def.reject('error inserting entity: ' + err);
      });
      return def.promise;
    },
    updateEntry: function updateEntity(entry, options) {
      var _this3 = this;

      var store = this.getStore();
      var def = new _Deferred2.default();
      var entityId = this.getEntityId(entry, options);
      this.getEntryDoc(entityId).then(function (doc) {
        var odef = def;
        doc.entity = entry;
        doc.modifyDate = moment().toDate();
        doc.description = _this3.getEntityDescription(entry);
        store.put(doc).then(function (result) {
          odef.resolve(result);
        }, function (err) {
          odef.reject('error updating entity: ' + err);
        });
      }, function (err) {
        def.reject('entity not found to update:' + err);
      });
      return def.promise;
    },
    createEntry: function createEntry() {
      var entry = {}; // need to dynamicly create Properties;
      entry.Id = null;
      entry.CreateDate = moment().toDate();
      entry.ModifyDate = moment().toDate();
      return entry;
    },
    deleteEntry: function deleteEntry(entityId) {
      var _this4 = this;

      var def = new _Deferred2.default();
      var store = this.getStore();
      store.get(entityId).then(function (doc) {
        var odef = def;
        _this4._removeDoc(doc).then(function (result) {
          _this4.onEntryDelete(entityId);
          odef.resolve(result);
        }, function (err) {
          odef.reject(err);
        });
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    _removeDoc: function _removeDoc(doc) {
      var def = new _Deferred2.default();
      var store = this.getStore();
      store.remove(doc._id, doc._rev).then(function (result) {
        def.resolve(result);
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    onEntryDelete: function onEntryDelete() {},
    saveRelatedEntries: function saveRelatedEntries(parentEntry, options) {
      var entries = parentEntry && parentEntry.$relatedEntities ? parentEntry.$relatedEntities : [];
      var relatedPromises = [];
      var def = new _Deferred2.default();
      entries.forEach(function (related) {
        var model = App.ModelManager.getModel(related.entityName, _Types2.default.OFFLINE);
        if (model && related.entities) {
          relatedPromises = related.entities.map(function (relatedEntry) {
            return model.saveEntry(relatedEntry, options);
          });
        }
      });
      if (relatedPromises.length > 0) {
        (0, _all2.default)(relatedPromises).then(function (relatedResults) {
          def.resolve(relatedResults);
        }, function (err) {
          def.reject(err);
        });
      } else {
        def.resolve(parentEntry);
      }
      return def.promise;
    },
    wrap: function wrap(entry) {
      var doc = {
        _id: this.getDocId(entry),
        entity: entry,
        entityId: this.getEntityId(entry),
        createDate: moment().toDate(),
        modifyDate: moment().toDate(),
        resourceKind: this.resourceKind,
        description: this.getEntityDescription(entry),
        entityName: this.entityName,
        entityDisplayName: this.entityDisplayName
      };
      return doc;
    },
    unWrap: function unWrap(doc) {
      if (doc.entity) {
        doc.entity.$offlineDate = doc.modifyDate;
      }
      return doc.entity;
    },
    getEntries: function getEntries(query, options) {
      var _this5 = this;

      var store = this.getStore();
      var def = new _Deferred2.default();
      var queryOptions = this.buildQueryOptions();
      _lang2.default.mixin(queryOptions, options);
      var queryExpression = this.buildQueryExpression(query, queryOptions);
      var queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, function (docs) {
        var entities = _this5.processEntries(_this5.unWrapEntities(docs), queryOptions, docs);
        def.resolve(entities);
      }, function (err) {
        def.reject(err);
      });
      if (queryOptions && queryOptions.returnQueryResults) {
        return (0, _QueryResults2.default)(def.promise); // eslint-disable-line
      }
      return def.promise;
    },
    processEntries: function processEntries(entities, queryOptions, docs) {
      if (typeof queryOptions.filter === 'function') {
        return entities.filter(queryOptions.filter);
      }

      if (typeof queryOptions.filterDocs === 'function') {
        return docs.filter(queryOptions.filterDocs);
      }

      return entities;
    },
    buildQueryOptions: function buildQueryOptions() {
      return {
        include_docs: true,
        descending: true,
        key: this.entityName
      };
    },
    buildQueryExpression: function buildQueryExpression(queryExpression, options) {
      // eslint-disable-line
      return 'entities/by_name';
    },
    unWrapEntities: function unWrapEntities(docs) {
      var _this6 = this;

      return docs.map(function (doc) {
        return _this6.unWrap(doc.doc);
      });
    },
    getRelatedCount: function getRelatedCount(relationship, entry) {
      var def = new _Deferred2.default();
      var model = App.ModelManager.getModel(relationship.relatedEntity, _Types2.default.OFFLINE);
      if (model) {
        var queryOptions = {
          returnQueryResults: true,
          include_docs: true,
          filter: this.buildRelatedQueryExpression(relationship, entry),
          key: relationship.relatedEntity
        };
        model.getEntries(null, queryOptions).then(function (result) {
          def.resolve(result.length);
        }, function () {
          def.resolve(-1);
        });
      } else {
        def.resolve(-1);
      }
      return def.promise;
    },
    buildRelatedQueryExpression: function buildRelatedQueryExpression(relationship, entry) {
      var _this7 = this;

      return function (entity) {
        var parentDataPath = void 0;
        var relatedDataPath = void 0;
        var relatedValue = void 0;
        if (relationship.parentProperty) {
          parentDataPath = relationship.parentDataPath ? relationship.parentDataPath : relationship.parentProperty;
          if (relationship.parentPropertyType && relationship.parentPropertyType === 'object') {
            parentDataPath = relationship.parentProperty + '.$key';
          }
        } else {
          parentDataPath = _this7.idProperty;
        }

        if (relationship.relatedProperty) {
          relatedDataPath = relationship.relatedDataPath ? relationship.relatedDataPath : relationship.relatedProperty;
          if (relationship.relatedPropertyType && relationship.relatedPropertyType === 'object') {
            relatedDataPath = relationship.relatedProperty + '.$key';
          }
        } else {
          relatedDataPath = '$key';
        }

        var parentValue = _Utility2.default.getValue(entry, parentDataPath);
        if (entity) {
          relatedValue = _Utility2.default.getValue(entity, relatedDataPath);
        }
        if (parentValue && relatedValue && relatedValue === parentValue) {
          return true;
        }

        return false;
      };
    },
    getUsage: function getUsage() {
      var _this8 = this;

      var store = this.getStore();
      var def = new _Deferred2.default();
      var queryOptions = {
        include_docs: true,
        descending: false,
        key: this.entityName
      };

      var queryExpression = 'entities/by_name';
      var queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, function (docs) {
        var usage = {};
        var size = _this8._getDocSize(docs[0]);
        usage.iconClass = _this8.iconClass;
        usage.entityName = _this8.entityName;
        usage.description = _this8.entityDisplayNamePlural;
        usage.oldestDate = docs[0] ? moment(docs[0].doc.modifyDate).toDate() : null; // see decending = false;
        usage.newestDate = docs[docs.length - 1] ? moment(docs[docs.length - 1].doc.modifyDate).toDate() : null;
        usage.count = docs.length;
        usage.sizeAVG = size;
        usage.size = usage.count * (size ? size : 10);
        def.resolve(usage);
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    _getDocSize: function _getDocSize(doc) {
      var size = 0;
      var charSize = 2; // 2 bytes
      if (doc) {
        var jsonString = JSON.stringify(doc);
        size = charSize * jsonString.length;
      }
      return size;
    },
    clearAllData: function clearAllData() {
      var _this9 = this;

      var store = this.getStore();
      var def = new _Deferred2.default();
      var queryOptions = {
        include_docs: true,
        descending: true,
        key: this.entityName
      };
      var queryExpression = 'entities/by_name';
      var queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, function (docs) {
        var odef = def;
        var deleteRequests = docs.map(function (doc) {
          return _this9._removeDoc(doc.doc);
        });
        if (deleteRequests.length > 0) {
          (0, _all2.default)(deleteRequests).then(function (results) {
            odef.resolve(results);
          }, function (err) {
            odef.reject(err);
          });
        } else {
          def.resolve();
        }
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    clearDataOlderThan: function clearAllData() {
      var _this10 = this;

      var days = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;

      var store = this.getStore();
      var def = new _Deferred2.default();
      var queryOptions = {
        include_docs: true,
        descending: true,
        key: this.entityName
      };
      var queryExpression = 'entities/by_name';
      var queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, function (docs) {
        var odef = def;
        var deleteRequests = docs.filter(function (_ref) {
          var doc = _ref.doc;

          if (!doc.modifyDate) {
            return true;
          }

          if (days === 0) {
            return true;
          }

          var recordDate = moment(_Convert2.default.toDateFromString(doc.modifyDate));
          var currentDate = moment();
          var diff = currentDate.diff(recordDate, 'days');
          if (diff > days) {
            return true;
          }

          return false;
        }).map(function (doc) {
          return _this10._removeDoc(doc.doc);
        });

        if (deleteRequests.length > 0) {
          (0, _all2.default)(deleteRequests).then(function (results) {
            odef.resolve(results);
          }, function (err) {
            odef.reject(err);
          });
        } else {
          def.resolve();
        }
      }, function (err) {
        def.reject(err);
      });
      return def.promise;
    },
    removeFromAuxiliaryEntities: function removeFromAuxiliaryEntities(entityId) {
      var def = new _Deferred2.default();
      var rvModel = App.ModelManager.getModel('RecentlyViewed', _Types2.default.OFFLINE);
      var bcModel = App.ModelManager.getModel('Briefcase', _Types2.default.OFFLINE);
      if (rvModel) {
        rvModel.deleteEntryByEntityContext(entityId, this.entityName);
      }
      if (bcModel) {
        bcModel.deleteEntryByEntityContext(entityId, this.entityName);
      }
      def.resolve();
      return def.promise;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});