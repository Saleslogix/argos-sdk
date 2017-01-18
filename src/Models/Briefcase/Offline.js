import declare from 'dojo/_base/declare';
import _OfflineModelBase from '../_OfflineModelBase';
import Manager from '../Manager';
import MODEL_TYPES from '../Types';
import getResource from '../../I18n';

import moment from 'moment';

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
