import declare from 'dojo/_base/declare';
import _OfflineModelBase from '../_OfflineModelBase';
import Manager from '../Manager';
import MODEL_TYPES from '../Types';

const resource = window.localeContext.getEntitySync('autenticationModel').attributes;

const __class = declare('argos.Models.Autentication.Offline', [_OfflineModelBase], {
  entityName: 'Authentication',
  modelName: 'Authentication',
  entityDisplayName: resource.entityDisplayName,
  entityDisplayNamePlural: resource.entityDisplayNamePlural,
  isSystem: true,
  createEntry: function createEntity() {
    const entity = {}; // need to dynamicly create Properties;
    entity.$key = this.createKey();
    entity.$descriptor = resource.entityDisplayName;
    entity.CreateDate = moment().toDate();
    entity.ModifyDate = moment().toDate();
    entity.UserName = null;
    entity.Password = null;
    entity.IsAuthenticated = false;
    entity.AuthenticationDate = null;
    entity.FullName = null;
    return entity;
  },
});

Manager.register('Authentication', MODEL_TYPES.OFFLINE, __class);
export default __class;
