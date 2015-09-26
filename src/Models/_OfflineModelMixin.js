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
import PouchDB from 'argos/Store/PouchDB';
import Deferred from 'dojo/Deferred';
// import all from 'dojo/promise/all';
// import when from 'dojo/when';
// import string from 'dojo/string';
import utility from '../Utility';
import _CustomizationMixin from '../_CustomizationMixin';

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
    this.updateEntry(entry, options).then(function updateSuccess(result) {
      def.resolve(result);
    }, function updateFailed() {
      // Fetching the doc/entity failed, so we will insert a new doc instead.
      const odef = def;
      this.insertEntry(entry, options).then(function insertSuccess(result) {
        odef.resolve(result);
      }, function insertFailed(err) {
        odef.reject(err);
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
    }.bind(this));
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
      }, function updateFailed(err) {
        def.reject('error updating entity: ' + err);
      });
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
});
