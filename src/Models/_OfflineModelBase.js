import declare from 'dojo/_base/declare';
import _ModelBase from './_ModelBase';
import _OfflineModelMixin from './_OfflineModelMixin';
import Manager from './Manager';
import MODEL_TYPES from './Types';

const __class = declare('argos.Models.Offline.OfflineModelBase', [_ModelBase, _OfflineModelMixin], {
  entityName: '',
  modelName: '',
  resourceKind: '',
  itemsProperty: '$resources',
  idProperty: '$key',
  labelProperty: '$descriptor',
  entityProperty: '$name',
  versionProperty: '$etag',
  store: null,
  modelType: MODEL_TYPES.OFFLINE,

});

Manager.register('_OfflineModelBase', MODEL_TYPES.OFFLINE, __class);
export default __class;
