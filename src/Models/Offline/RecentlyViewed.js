import declare from 'dojo/_base/declare';
import _OfflineModelBase from '../_OfflineModelBase';
import Manager from '../Manager';
import MODEL_TYPES from '../Types';

const __class = declare('argos.Models.Offline.RecentlyViewed', [_OfflineModelBase], {
  entityName: 'RecentlyViewed',
  modelName: 'RecentlyViewed',
  createEntity: function createEntity(view, viewsModel) {
    const entity = {}; // need to dynamicly create Properties;
    entity.$key = view.id + '_' + view.entry[view.idProperty || '$key'];
    entity.$descriptor = viewsModel.getEntityDescription(view.entry);
    entity.createDate = moment().toDate();
    entity.modifyDate = moment().toDate();
    entity.entityId = viewsModel.getEntityId(view.entry);
    entity.entityName = viewsModel.entityName;
    entity.description = viewsModel.getEntityDescription(view.entry);
    entity.entityDisplayName = viewsModel.entityDisplayName;
    entity.resourceKind = viewsModel.resourceKind;
    entity.storedBy = view.id;
    entity.viewId = view.id;
    entity.iconClass = view.getOfflineIcon();
    return entity;
  },
});

Manager.register('RecentlyViewed', MODEL_TYPES.OFFLINE, __class);
export default __class;
