import declare from 'dojo/_base/declare';
import _ModelBase from './_ModelBase';
import _SDataModelMixin from './_SDataModelMixin';
import Manager from './Manager';
import MODEL_TYPE from './Types';

const __class = declare('argos.Models.SDataModelBase', [_ModelBase, _SDataModelMixin], {
});

Manager.register('_SDataModelBase', MODEL_TYPE.SDATA, __class);
export default __class;
