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

  /**
   * @module argos/Models/_OfflineModelBase
   */
  const databaseName = 'crm-offline';
  const _store = new _PouchDB2.default(databaseName);

  /**
   * @class
   * @alias module:argos/Models/_OfflineModelBase
   * @extends module:argos/Models/_ModelBase
   * @extends module:argos/_CustomizationMixin
   */
  const __class = (0, _declare2.default)('argos.Models.Offline.OfflineModelBase', [_ModelBase3.default, _CustomizationMixin3.default], /** @lends module:argos/Models/_OfflineModelBase.prototype */{

    store: null,
    modelType: _Types2.default.OFFLINE,
    init: function init() {
      this.inherited(init, arguments);
      this.createNamedQueries();
    },
    createNamedQueries: function createNamedQueries() {
      const store = this.getStore();
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
      const def = new _Deferred2.default();
      this.getEntryDoc(entityId).then(doc => {
        def.resolve(this.unWrap(doc));
      }, err => {
        def.reject(err);
      });
      return def;
    },
    getEntryDoc: function getEntry(entityId) {
      const store = this.getStore();
      const def = new _Deferred2.default();
      store.get(entityId).then(results => {
        def.resolve(results);
      }, err => {
        def.reject(err);
      });
      return def;
    },
    saveEntry: function saveEntity(entry, options) {
      const def = new _Deferred2.default();
      this.updateEntry(entry, options).then(updateResult => {
        const odef = def;
        this.saveRelatedEntries(entry, options).then(() => {
          odef.resolve(updateResult);
        }, err => {
          odef.reject(err);
        });
      }, () => {
        // Fetching the doc/entity failed, so we will insert a new doc instead.
        this.insertEntry(entry, options).then(insertResult => {
          const odef = def;
          this.saveRelatedEntries(entry, options).then(() => {
            odef.resolve(insertResult);
          }, err => {
            odef.reject(err);
          });
        }, err => {
          def.reject(err);
        });
      });
      return def.promise;
    },
    insertEntry: function insertEntry(entry, options) {
      const store = this.getStore();
      const def = new _Deferred2.default();
      const doc = this.wrap(entry, options);
      store.add(doc).then(result => {
        def.resolve(result);
      }, err => {
        def.reject(`error inserting entity: ${err}`);
      });
      return def.promise;
    },
    updateEntry: function updateEntity(entry, options) {
      const store = this.getStore();
      const def = new _Deferred2.default();
      const entityId = this.getEntityId(entry, options);
      this.getEntryDoc(entityId).then(doc => {
        const odef = def;
        doc.entity = entry;
        doc.modifyDate = moment().toDate();
        doc.description = this.getEntityDescription(entry);
        store.put(doc).then(result => {
          odef.resolve(result);
        }, err => {
          odef.reject(`error updating entity: ${err}`);
        });
      }, err => {
        def.reject(`entity not found to update:${err}`);
      });
      return def.promise;
    },
    createEntry: function createEntry() {
      const entry = {}; // need to dynamicly create Properties;
      entry.Id = null;
      entry.CreateDate = moment().toDate();
      entry.ModifyDate = moment().toDate();
      return entry;
    },
    deleteEntry: function deleteEntry(entityId) {
      const def = new _Deferred2.default();
      const store = this.getStore();
      store.get(entityId).then(doc => {
        const odef = def;
        this._removeDoc(doc).then(result => {
          this.onEntryDelete(entityId);
          odef.resolve(result);
        }, err => {
          odef.reject(err);
        });
      }, err => {
        def.reject(err);
      });
      return def.promise;
    },
    _removeDoc: function _removeDoc(doc) {
      const def = new _Deferred2.default();
      const store = this.getStore();
      store.remove(doc._id, doc._rev).then(result => {
        def.resolve(result);
      }, err => {
        def.reject(err);
      });
      return def.promise;
    },
    onEntryDelete: function onEntryDelete() {},
    saveRelatedEntries: function saveRelatedEntries(parentEntry, options) {
      const entries = parentEntry && parentEntry.$relatedEntities ? parentEntry.$relatedEntities : [];
      let relatedPromises = [];
      const def = new _Deferred2.default();
      entries.forEach(related => {
        const model = App.ModelManager.getModel(related.entityName, _Types2.default.OFFLINE);
        if (model && related.entities) {
          relatedPromises = related.entities.map(relatedEntry => {
            return model.saveEntry(relatedEntry, options);
          });
        }
      });
      if (relatedPromises.length > 0) {
        (0, _all2.default)(relatedPromises).then(relatedResults => {
          def.resolve(relatedResults);
        }, err => {
          def.reject(err);
        });
      } else {
        def.resolve(parentEntry);
      }
      return def.promise;
    },
    wrap: function wrap(entry) {
      const doc = {
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
      const store = this.getStore();
      const def = new _Deferred2.default();
      const queryOptions = this.buildQueryOptions();
      _lang2.default.mixin(queryOptions, options);
      const queryExpression = this.buildQueryExpression(query, queryOptions);
      const queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, docs => {
        const entities = this.processEntries(this.unWrapEntities(docs), queryOptions, docs);
        def.resolve(entities);
      }, err => {
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
      return docs.map(doc => this.unWrap(doc.doc));
    },
    getRelatedCount: function getRelatedCount(relationship, entry) {
      const def = new _Deferred2.default();
      const model = App.ModelManager.getModel(relationship.relatedEntity, _Types2.default.OFFLINE);
      if (model) {
        const queryOptions = {
          returnQueryResults: true,
          include_docs: true,
          filter: this.buildRelatedQueryExpression(relationship, entry),
          key: relationship.relatedEntity
        };
        model.getEntries(null, queryOptions).then(result => {
          def.resolve(result.length);
        }, () => {
          def.resolve(-1);
        });
      } else {
        def.resolve(-1);
      }
      return def.promise;
    },
    buildRelatedQueryExpression: function buildRelatedQueryExpression(relationship, entry) {
      return entity => {
        let parentDataPath;
        let relatedDataPath;
        let relatedValue;
        if (relationship.parentProperty) {
          parentDataPath = relationship.parentDataPath ? relationship.parentDataPath : relationship.parentProperty;
          if (relationship.parentPropertyType && relationship.parentPropertyType === 'object') {
            parentDataPath = `${relationship.parentProperty}.$key`;
          }
        } else {
          parentDataPath = this.idProperty;
        }

        if (relationship.relatedProperty) {
          relatedDataPath = relationship.relatedDataPath ? relationship.relatedDataPath : relationship.relatedProperty;
          if (relationship.relatedPropertyType && relationship.relatedPropertyType === 'object') {
            relatedDataPath = `${relationship.relatedProperty}.$key`;
          }
        } else {
          relatedDataPath = '$key';
        }

        const parentValue = _Utility2.default.getValue(entry, parentDataPath);
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
      const store = this.getStore();
      const def = new _Deferred2.default();
      const queryOptions = {
        include_docs: true,
        descending: false,
        key: this.entityName
      };

      const queryExpression = 'entities/by_name';
      const queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, docs => {
        const usage = {};
        const size = this._getDocSize(docs[0]);
        usage.iconClass = this.iconClass;
        usage.entityName = this.entityName;
        usage.description = this.entityDisplayNamePlural;
        usage.oldestDate = docs[0] ? moment(docs[0].doc.modifyDate).toDate() : null; // see decending = false;
        usage.newestDate = docs[docs.length - 1] ? moment(docs[docs.length - 1].doc.modifyDate).toDate() : null;
        usage.count = docs.length;
        usage.sizeAVG = size;
        usage.size = usage.count * (size ? size : 10);
        def.resolve(usage);
      }, err => {
        def.reject(err);
      });
      return def.promise;
    },
    _getDocSize: function _getDocSize(doc) {
      let size = 0;
      const charSize = 2; // 2 bytes
      if (doc) {
        const jsonString = JSON.stringify(doc);
        size = charSize * jsonString.length;
      }
      return size;
    },
    clearAllData: function clearAllData() {
      const store = this.getStore();
      const def = new _Deferred2.default();
      const queryOptions = {
        include_docs: true,
        descending: true,
        key: this.entityName
      };
      const queryExpression = 'entities/by_name';
      const queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, docs => {
        const odef = def;
        const deleteRequests = docs.map(doc => {
          return this._removeDoc(doc.doc);
        });
        if (deleteRequests.length > 0) {
          (0, _all2.default)(deleteRequests).then(results => {
            odef.resolve(results);
          }, err => {
            odef.reject(err);
          });
        } else {
          def.resolve();
        }
      }, err => {
        def.reject(err);
      });
      return def.promise;
    },
    clearDataOlderThan: function clearAllData(days = 0) {
      const store = this.getStore();
      const def = new _Deferred2.default();
      const queryOptions = {
        include_docs: true,
        descending: true,
        key: this.entityName
      };
      const queryExpression = 'entities/by_name';
      const queryResults = store.query(queryExpression, queryOptions);
      (0, _when2.default)(queryResults, docs => {
        const odef = def;
        const deleteRequests = docs.filter(({ doc }) => {
          if (!doc.modifyDate) {
            return true;
          }

          if (days === 0) {
            return true;
          }

          const recordDate = moment(_Convert2.default.toDateFromString(doc.modifyDate));
          const currentDate = moment();
          const diff = currentDate.diff(recordDate, 'days');
          if (diff > days) {
            return true;
          }

          return false;
        }).map(doc => {
          return this._removeDoc(doc.doc);
        });

        if (deleteRequests.length > 0) {
          (0, _all2.default)(deleteRequests).then(results => {
            odef.resolve(results);
          }, err => {
            odef.reject(err);
          });
        } else {
          def.resolve();
        }
      }, err => {
        def.reject(err);
      });
      return def.promise;
    },
    removeFromAuxiliaryEntities: function removeFromAuxiliaryEntities(entityId) {
      const def = new _Deferred2.default();
      const rvModel = App.ModelManager.getModel('RecentlyViewed', _Types2.default.OFFLINE);
      const bcModel = App.ModelManager.getModel('Briefcase', _Types2.default.OFFLINE);
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