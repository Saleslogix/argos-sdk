import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import PouchDB from 'argos/Store/PouchDB';
import Deferred from 'dojo/Deferred';
import all from 'dojo/promise/all';
import when from 'dojo/when';
import utility from '../Utility';
import _CustomizationMixin from '../_CustomizationMixin';
import _ModelBase from './_ModelBase';
import QueryResults from 'dojo/store/util/QueryResults';
import MODEL_TYPES from './Types';

const databaseName = 'crm-offline';
const _store = new PouchDB({databaseName: databaseName});

/**
 * @class argos.Models._OfflineModelBase
 * Base for offline models
 */
const __class = declare('argos.Models.Offline.OfflineModelBase', [_ModelBase, _CustomizationMixin], {

  store: null,
  modelType: MODEL_TYPES.OFFLINE,
  getStore: function getStore() {
    if (!this.store) {
      this.store = _store;
    }
    return this.store;
  },
  getAllIds: function getAllIds() {
    // The results from this query should just get cached/updated/stored
    // globally when the application goes offline. This will
    // prevent some timing issues with calling this async on list loads.
    const store = this.getStore();
    return store.query(function queryFn(doc, emit) {
      emit(doc._id);
    });
  },
  getDocId: function getEntityId(entry) {
    return this.getEntityId(entry);
  },
  getEntry: function getEntry(entityId) {
    const def = new Deferred();
    this.getEntryDoc(entityId).then(function querySuccess(doc) {
      def.resolve(this.unWrap(doc));
    }.bind(this), function queryFailed(err) {
      def.reject(err);
    });
    return def;
  },
  getEntryDoc: function getEntry(entityId) {
    const store = this.getStore();
    const def = new Deferred();
    store.get(entityId).then(function querySuccess(results) {
      def.resolve(results);
    }, function queryFailed(err) {
      def.reject(err);
    });
    return def;
  },
  saveEntry: function saveEntity(entry, options) {
    const def = new Deferred();
    this.updateEntry(entry, options).then(function updateSuccess(updateResult) {
      const odef = def;
      this.saveRelatedEntries(entry, options).then( function updateRelatedSuccess() {
        odef.resolve(updateResult);
      }, function updateRelatedFailed(err) {
        odef.reject(err);
      });
    }.bind(this), function updateFailed() {
      // Fetching the doc/entity failed, so we will insert a new doc instead.
      this.insertEntry(entry, options).then(function insertSuccess(insertResult) {
        const odef = def;
        this.saveRelatedEntries(entry, options).then( function insertRelatedSuccess() {
          odef.resolve(insertResult);
        }, function insertRelatedFailed(err) {
          odef.reject(err);
        });
      }.bind(this), function insertFailed(err) {
        def.reject(err);
      });
    }.bind(this));
    return def.promise;
  },
  insertEntry: function insertEntry(entry, options) {
    const store = this.getStore();
    const def = new Deferred();
    const doc = this.wrap(entry, options);
    store.add(doc).then(function insertSuccess(result) {
      def.resolve(result);
    },
    function insertFailed(err) {
      def.reject('error inserting entity: ' + err);
    });
    return def.promise;
  },
  updateEntry: function updateEntity(entry, options) {
    const store = this.getStore();
    const def = new Deferred();
    const entityId = this.getEntityId(entry, options);
    this.getEntryDoc(entityId).then(function querySuccess(doc) {
      const odef = def;
      doc.entity = entry;
      doc.modifyDate = moment().toDate();
      doc.description = this.getEntityDescription(entry);
      store.put(doc).then(function updateSuccess(result) {
        odef.resolve(result);
      }, function updateFailed(err) {
        odef.reject('error updating entity: ' + err);
      });
    }.bind(this), function queryError(err) {
      def.reject('entity not found to update:' + err);
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
    const def = new Deferred();
    const store = this.getStore();
    store.get(entityId).then((doc) => {
      const odef = def;
      this._removeDoc(doc).then((result) => {
        this.onEntryDelete(entityId);
        odef.resolve(result);
      }, (err) => {
        odef.reject(err);
      });
    }, (err) => {
      def.reject(err);
    });
    return def.promise;
  },
  _removeDoc: function _removeDoc(doc) {
    const def = new Deferred();
    const store = this.getStore();
    store.remove(doc._id, doc._rev).then((result) => {
      def.resolve(result);
    }, (err) => {
      def.reject(err);
    });
    return def.promise;
  },
  onEntryDelete: function onEntryDelete() {
  },
  saveRelatedEntries: function saveRelatedEntries(parentEntry, options) {
    const entries = (parentEntry && parentEntry.$relatedEntities) ? parentEntry.$relatedEntities : [];
    let relatedPromises = [];
    const def = new Deferred();
    entries.forEach((related) => {
      const model = App.ModelManager.getModel(related.entityName, MODEL_TYPES.OFFLINE);
      if (model && related.entities) {
        relatedPromises = related.entities.map((relatedEntry) => {
          return model.saveEntry(relatedEntry, options);
        });
      }
    });
    if (relatedPromises.length > 0) {
      all(relatedPromises).then(
          (relatedResults) => {
            def.resolve(relatedResults);
          },
          (err) => {
            def.reject(err);
          });
    } else {
      def.resolve(parentEntry);
    }
    return def.promise;
  },
  wrap: function wrap(entry) {
    let doc;
    doc = {
      _id: this.getDocId(entry),
      entity: entry,
      entityId: this.getEntityId(entry),
      createDate: moment().toDate(),
      modifyDate: moment().toDate(),
      resourceKind: this.resourceKind,
      description: this.getEntityDescription(entry),
      entityName: this.entityName,
      entityDisplayName: this.entityDisplayName,
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
    const def = new Deferred();
    const queryOptions = {
      include_docs: true,
      descending: true,
    };
    lang.mixin(queryOptions, options);
    const queryExpression = this.buildQueryExpression(query, queryOptions);
    const queryResults = store.query(queryExpression, queryOptions);
    when(queryResults, (docs) => {
      const entities = this.unWrapEntities(docs);
      def.resolve(entities);
    }, (err) => {
      def.reject(err);
    });
    if (queryOptions && queryOptions.returnQueryResults) {
      return QueryResults(def.promise); // eslint-disable-line
    }
    return def.promise;
  },
  buildQueryExpression: function buildQueryExpression(queryExpression, options) { // eslint-disable-line
    return function queryFn(doc, emit) {
      if (doc.entityName === this.entityName) {
        if (queryExpression && (typeof queryExpression === 'function')) {
          queryExpression.apply(this, [doc, emit]);
        } else {
          emit(doc.modifyDate);
        }
      }
    }.bind(this);
  },
  unWrapEntities: function unWrapEntities(docs) {
    return docs.map((doc) => this.unWrap(doc.doc));
  },
  getRelatedCount: function getRelatedCount(relationship, entry) {
    const def = new Deferred();
    const model = App.ModelManager.getModel(relationship.relatedEntity, MODEL_TYPES.OFFLINE);
    if (model) {
      const queryExpression = this.buildRelatedQueryExpression(relationship, entry);
      const queryOptions = {
        returnQueryResults: true,
      };
      model.getEntries(queryExpression, queryOptions).then((result) => {
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
    return function queryFn(doc, emit) {
      let parentDataPath;
      let relatedDataPath;
      let parentValue;
      let relatedValue;
      if (relationship.parentProperty) {
        parentDataPath = (relationship.parentDataPath) ? relationship.parentDataPath : relationship.parentProperty;
        if (relationship.parentPropertyType && (relationship.parentPropertyType === 'object')) {
          parentDataPath = relationship.parentProperty + '.$key';
        }
      } else {
        parentDataPath = this.idProperty;
      }

      if (relationship.relatedProperty) {
        relatedDataPath = (relationship.relatedDataPath) ? relationship.relatedDataPath : relationship.relatedProperty;
        if (relationship.relatedPropertyType && (relationship.relatedPropertyType === 'object')) {
          relatedDataPath = relationship.relatedProperty + '.$key';
        }
      } else {
        relatedDataPath = '$key';
      }

      parentValue = utility.getValue(entry, parentDataPath);
      if (doc.entity) {
        relatedValue = utility.getValue(doc.entity, relatedDataPath);
      }
      if ((parentValue && relatedValue) && (relatedValue === parentValue)) {
        emit(doc.modifyDate);
      }
    }.bind(this);
  },
  getUsage: function getUsage() {
    const store = this.getStore();
    const def = new Deferred();
    const queryOptions = {
      include_docs: true,
      descending: false,
    };
    const queryExpression = this.buildQueryExpression(null, queryOptions);
    const queryResults = store.query(queryExpression, queryOptions);
    when(queryResults, (docs) => {
      const usage = {};
      const size = this._getDocSize(docs[0]);
      usage.iconClass = this.iconClass;
      usage.entityName = this.entityName;
      usage.description = this.entityDisplayNamePlural;
      usage.oldestDate = (docs[0]) ? moment(docs[0].doc.modifyDate).toDate() : null; // see decending = false;
      usage.newestDate = (docs[docs.length - 1]) ? moment(docs[docs.length - 1].doc.modifyDate).toDate() : null;
      usage.count = docs.length;
      usage.sizeAVG = size;
      usage.size = usage.count * (size ? size : 10);
      def.resolve(usage);
    }, (err) => {
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
  clearData: function clearData(query, options) {
    const store = this.getStore();
    const def = new Deferred();
    const queryOptions = {
      include_docs: true,
      descending: true,
    };
    lang.mixin(queryOptions, options);
    const queryExpression = this.buildQueryExpression(query, queryOptions);
    const queryResults = store.query(queryExpression, queryOptions);
    when(queryResults, (docs) => {
      const odef = def;
      const deleteRequests = docs.map((doc) => {
        return this._removeDoc(doc.doc);
      });
      if (deleteRequests.length > 0) {
        all(deleteRequests).then((results) => {
          odef.resolve(results);
        }, (err) => {
          odef.reject(err);
        });
      } else {
        def.resolve();
      }
    }, (err) => {
      def.reject(err);
    });
    return def.promise;
  },
  createKey: function createKey() {
    const d = new Date().getTime();
    const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function genkey(c) { // eslint-disable-line
      const r = (d + Math.random() * 16) % 16 | 0;
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return `{this.entityName.toLowwer()}-{uuid}`;
  },
  removeFromAuxiliaryEntities: function removeFromAuxiliaryEntities(entityId) {
    const def = new Deferred();
    const rvModel = App.ModelManager.getModel('RecentlyViewed', MODEL_TYPES.OFFLINE);
    const bcModel = App.ModelManager.getModel('Briefcase', MODEL_TYPES.OFFLINE);
    if (rvModel) {
      rvModel.deleteEntryByEntityContext(entityId, this.entityName);
    }
    if (bcModel) {
      bcModel.deleteEntryByEntityContext(entityId, this.entityName);
    }
    def.resolve();
    return def.promise;
  },
});

export default __class;
