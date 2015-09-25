import declare from 'dojo/_base/declare';
import _ModelBase from './_ModelBase';
import _OfflineModelMixin from './_OfflineModelMixin';
import Manager from './Manager';
import MODEL_TYPE from './Types';

const __class = declare('argos.Models.Offline.OfflineModelBase', [_ModelBase, _OfflineModelMixin], {
});

Manager.register('_OfflineModelBase', MODEL_TYPE.OFFLINE, __class);
export default __class;
