import declare from 'dojo/_base/declare';
import _OfflineModelBase from '../_OfflineModelBase';
import Manager from '../Manager';
import MODEL_TYPES from '../Types';

const resource = window.localeContext.getEntitySync('briefcaseModel').attributes;

const __class = declare('argos.Models.Briefcase.Offline', [_OfflineModelBase], {
  entityName: 'Briefcase',
  modelName: 'Briefcase',
  entityDisplayName: resource.entityDisplayName,
  entityDisplayNamePlural: resource.entityDisplayNamePlural,

  createEntry: function createEntity(entry, model, options) {
    const entity = {}; // need to dynamicly create Properties;
    entity.$key = model.entityName + '_' + model.getEntityId(entry);
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
});

Manager.register('Briefcase', MODEL_TYPES.OFFLINE, __class);
export default __class;
