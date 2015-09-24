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
export default declare('argos.Models._OfflineModelMixin', [_CustomizationMixin], {
  customizationSet: 'models',
  entityName: '',
  modelName: '',
  resourceKind: '',
  itemsProperty: '$resources',
  idProperty: '$key',
  labelProperty: '$descriptor',
  entityProperty: '$name',
  versionProperty: '$etag',
  store: null,
  databaseName: 'crm-offline',
  ModelType: MODEL_TYPES.OFFLINE, 
  getStore: function getStore() {
    if (this.store) {
      this.store = new PouchDB({databaseName: this.databaseName});
    }
    return this.store;
  },
  getId: function getId(entity) {
    return utility.getValue(entity, this.idProperty);
  },
  saveEntity: function saveEntity(entity, options) {
    const store = this.getStore();
    const def = new Deferred();
    let entityId = this.getId(entity);
    this.getEntity(entityId).then(function querySuccess(results) {
      return this.updateEntity(entity, options);
    }, function queryError() {
      // Fetching the doc/entity failed, so we will insert a new doc instead.
      return this.insertEntity(entity, options)
    });

    if (entity.$relatedEntities) {
      this.saveRelatedEntities(entity.$relatedEntities);
      entity.relatedEntities = null;
    }
    const doc = this.wrap(entity);
    this.store.add(doc);
  },
  insertEntity: function insertEntity() {
    if (entity.$relatedEntities) {
      this.saveRelatedEntities(entity.$relatedEntities);
      entity.relatedEntities = null;
    }
    const doc = this.wrap(entity);
    this.store.add(doc);
  },
  updateEntity: function updateEntity() {
  },
  saveDetailView: function saveDetailView(view) {
    const def = new Deferred();
    if (!view) {
      def.reject('A detail view must be specified.');
      return def.promise;
    }

    const model = view.getModel();
    const id = view.entry[view.idProperty || '$key'];
    let doc;

    // Try to fetch the previously cached doc/entity
    return store.get(id).then(function querySuccess(results) {
      // Refresh the offline store with the latest info
      results.entity = view.entry;
      results.modifyDate = moment().toDate();
      results.entityName = model.entityName;
      results.description = view.getOfflineDescription();
      results.entityName = model.entityName;
      results.entityDisplayName = model.entityDisplayName;

      return store.put(results);
    }, function queryError() {
      // Fetching the doc/entity failed, so we will insert a new doc instead.
      doc = {
        _id: id,
        type: 'detail',
        entity: view.entry,
        createDate: moment().toDate(),
        modifyDate: moment().toDate(),
        resourceKind: this.resourceKind,
        storedBy: view.id,
        viewId: view.id,
        iconClass: view.getOfflineIcon(),
        description: view.getOfflineDescription(),
        entityName: model.entityName,
        entityDisplayName: model.entityDisplayName,
      };

      return store.add(doc);
    });
  },
});
