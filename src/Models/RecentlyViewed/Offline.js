import declare from 'dojo/_base/declare';
import _OfflineModelBase from '../_OfflineModelBase';
import Manager from '../Manager';
import MODEL_TYPES from '../Types';

const resource = window.localeContext.getEntitySync('recentlyViewedModel').attributes;

const __class = declare('argos.Models.RecentlyViewed.Offline', [_OfflineModelBase], {
  entityName: 'RecentlyViewed',
  modelName: 'RecentlyViewed',
  entityDisplayName: resource.entityDisplayName,
  entityDisplayNamePlural: resource.entityDisplayNamePlural,
  isSystem: true,
  createEntry: function createEntity(viewId, entry, model) {
    const entity = {}; // need to dynamicly create Properties;
    entity.$key = viewId + '_' + model.getEntityId(entry);
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
});

Manager.register('RecentlyViewed', MODEL_TYPES.OFFLINE, __class);
export default __class;
