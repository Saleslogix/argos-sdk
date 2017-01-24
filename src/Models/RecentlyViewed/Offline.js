import declare from 'dojo/_base/declare';
import _OfflineModelBase from '../_OfflineModelBase';
import Manager from '../Manager';
import MODEL_TYPES from '../Types';
import getResource from '../../I18n';

import moment from 'moment';

const resource = getResource('recentlyViewedModel');

/**
 * @class argos.Models.RecentlyViewed.Offline
 */
const __class = declare('argos.Models.RecentlyViewed.Offline', [_OfflineModelBase], {
  id: 'recentlyviewed_offline_model',
  entityName: 'RecentlyViewed',
  modelName: 'RecentlyViewed',
  entityDisplayName: resource.entityDisplayName,
  entityDisplayNamePlural: resource.entityDisplayNamePlural,
  isSystem: true,
  createEntry: function createEntity(viewId, entry, model) {
    const entity = {}; // need to dynamicly create Properties;
    entity.$key = `${viewId}_${model.getEntityId(entry)}`;
    entity.$descriptor = model.getEntityDescription(entry);
    entity.createDate = moment().toDate();
    entity.modifyDate = moment().toDate();
    entity.entityId = model.getEntityId(entry);
    entity.entityName = model.entityName;
    entity.description = model.getEntityDescription(entry);
    entity.entityDisplayName = model.entityDisplayName;
    entity.resourceKind = model.resourceKind;
    entity.viewId = viewId;
    entity.iconClass = model.getIconClass(entry);
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

Manager.register('RecentlyViewed', MODEL_TYPES.OFFLINE, __class);
export default __class;
