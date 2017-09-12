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

import declare from 'dojo/_base/declare';
import _OfflineModelBase from '../_OfflineModelBase';
import Manager from '../Manager';
import MODEL_TYPES from '../Types';
import getResource from '../../I18n';


const resource = getResource('briefcaseModel');

/**
 * @class argos.Models.Briefcase.Offline
 */
const __class = declare('argos.Models.Briefcase.Offline', [_OfflineModelBase], {
  id: 'briefcase_offline_model',
  entityName: 'Briefcase',
  modelName: 'Briefcase',
  entityDisplayName: resource.entityDisplayName,
  entityDisplayNamePlural: resource.entityDisplayNamePlural,
  isSystem: true,
  createEntry: function createEntity(entry, model, options) {
    const entity = {}; // need to dynamicly create Properties;
    entity.$key = `${model.entityName}_${model.getEntityId(entry)}`;
    entity.$descriptor = model.getEntityDescription(entry);
    entity.createDate = moment().toDate();
    entity.modifyDate = moment().toDate();
    entity.entityId = model.getEntityId(entry);
    entity.entityName = model.entityName;
    entity.description = model.getEntityDescription(entry);
    entity.entityDisplayName = model.entityDisplayName;
    entity.resourceKind = model.resourceKind;
    entity.viewId = (options && options.viewId) ? options.viewId : model.detailViewId;
    entity.iconClass = (options && options.iconClass) ? options.iconClass : model.getIconClass(entry);
    return entity;
  },
  deleteEntryByEntityContext: function deleteEntryByEntityContext(entityId, entityName) {
    const queryExpression = function map(doc, emit) {
      if ((doc.entity.entityId === entityId) && (doc.entity.entityName === entityName)) {
        emit(doc.entity);
      }
    };
    this.getEntries(queryExpression).then((entries) => {
      if (entries) {
        entries.forEach((entry) => {
          this.deleteEntry(entry.$key);
        });
      }
    });
  },
});

Manager.register('Briefcase', MODEL_TYPES.OFFLINE, __class);
export default __class;
