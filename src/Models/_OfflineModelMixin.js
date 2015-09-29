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
import PouchDB from 'argos/Store/PouchDB';
import Deferred from 'dojo/Deferred';
import all from 'dojo/promise/all';
import when from 'dojo/when';
// import string from 'dojo/string';
import utility from '../Utility';
import _CustomizationMixin from '../_CustomizationMixin';
import MODEL_TYPES from './Types';

/**
 * @class argos._SDataModeMixin
 * A mixin that provides SData specific methods and properties
 * @alternateClassName _SDataModelMixin
 */
const databaseName = 'crm-offline';
const _store = new PouchDB({databaseName: databaseName});
export default declare('argos.Models._OfflineModelMixin', [_CustomizationMixin], {
  customizationSet: 'models',
  getStore: function getStore() {
    if (!this.store) {
      this.store = _store;
      // this.store.put({_id: 'author_info',body: {firstName: 'Bill', lastName: 'Edney'}});
      // this.store._db.destroy();
      // this.store = new PouchDB({databaseName: this.databaseName});
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
  getEntityId: function getEntityId(entry) {
    return utility.getValue(entry, this.idProperty);
  },
  getDocId: function getEntityId(entry) {
    return this.getEntityId(entry);
  },
  getEntry: function getEntry(entityId) {
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
      }.bind(this), function updateRelatedFailed(err) {
        odef.reject(err);
      });
    }.bind(this), function updateFailed() {
      // Fetching the doc/entity failed, so we will insert a new doc instead.
      this.insertEntry(entry, options).then(function insertSuccess(insertResult) {
        const odef = def;
        this.saveRelatedEntries(entry, options).then( function insertRelatedSuccess() {
          odef.resolve(insertResult);
        }.bind(this), function insertRelatedFailed(err) {
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
    this.getEntry(entityId).then(function querySuccess(doc) {
      doc.entity = entry;
      doc.modifyDate = moment().toDate();
      doc.description = this.getEntityDescription(entry);
      store.put(doc).then(function updateSuccess(result) {
        def.resolve(result);
      }.bind(this), function updateFailed(err) {
        def.reject('error updating entity: ' + err);
      }.bind(this));
    }.bind(this), function queryError(err) {
      def.reject('entity not found to update:' + err);
    }.bind(this));
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
  saveRelatedEntries: function(parentEntry, options) {
    const entries = (parentEntry && parentEntry.$relatedEntities) ? parentEntry.$relatedEntities : [];
    const relatedPromises = [];
    const def = new Deferred();
    entries.forEach(function(related) {
      const model = App.ModelManager.getModel(related.entityName, MODEL_TYPES.OFFLINE);
      if (model && related.entities) {
        related.entities.forEach(function(relatedEntry) {
          const promise = model.saveEntry(relatedEntry, options);
          relatedPromises.push(promise);
        }.bind(this));
      }
    });
    if (relatedPromises.length > 0) {
      all(relatedPromises).then(
          function(relatedResults) {
            def.resolve(relatedResults);
          },
          function(err) {
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
  getEntityDescription: function getEntityDescription(entry) {
    return utility.getValue(entry, this.labelProperty);
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
    when(queryResults, function(docs) {
      const entities = this.unWrapEntities(docs);
      def.resolve(entities);
    }.bind(this), function(err) {
      def.reject(err);
    }.bind(this));
    return def.promise;
  },
  buildQueryExpression: function buildQueryExpression(query, options) {
    return function queryFn(doc, emit) {
      if (doc.entityName === this.entityName) {
        emit(doc.modifyDate);
      }
    }.bind(this);
  },
  unWrapEntities: function unWrapEntities(docs) {
    const entities = [];
    docs.forEach(function(doc) {
      entities.push(this.unWrapEntity(doc));
    }.bind(this));
    return entities;
  },
  unWrapEntity: function unWrapEntity(doc) {
    return doc.doc.entity;
  },
});
