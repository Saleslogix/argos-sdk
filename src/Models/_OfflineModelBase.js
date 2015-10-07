import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import PouchDB from 'argos/Store/PouchDB';
import Deferred from 'dojo/Deferred';
import all from 'dojo/promise/all';
import when from 'dojo/when';
import _CustomizationMixin from '../_CustomizationMixin';
import _ModelBase from './_ModelBase';
import QueryResults from 'dojo/store/util/QueryResults';
import Manager from './Manager';
import MODEL_TYPES from './Types';

const databaseName = 'crm-offline';
const _store = new PouchDB({databaseName: databaseName});

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
      store.remove(doc._id, doc._rev).then((result) => {
        odef.resolve(result);
      }, (err) => {
        odef.reject(err);
      });
    }, (err) => {
      def.reject(err);
    });
    return def.promise;
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
    }.bind(this), (err) => {
      def.reject(err);
    });
    if (options.returnQueryResults) {
      return QueryResults(def.promise); // eslint-disable-line
    }
    return def.promise;
  },
  buildQueryExpression: function buildQueryExpression(query, options) { // eslint-disable-line
    return function queryFn(doc, emit) {
      if (doc.entityName === this.entityName) {
        emit(doc.modifyDate);
      }
    }.bind(this);
  },
  unWrapEntities: function unWrapEntities(docs) {
    return docs.map((doc) => this.unWrap(doc.doc));
  },
  getRelatedCount: function getRelatedCount(relationship, entry) {
    return 99;
  },
  buildRelatedQueryExpression: function buildRelatedQueryExpression(relationship, entry) {
    return function queryFn(doc, emit) {
      if (doc.entityName === this.entityName) {
        emit(doc.modifyDate);
      }
    }.bind(this);
  },
});

Manager.register('_OfflineModelBase', MODEL_TYPES.OFFLINE, __class);
export default __class;
