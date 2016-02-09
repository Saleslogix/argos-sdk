import Manager from './Manager';
import MODEL_TYPES from './Types';

/**
 * @class argos.Models.Adapter
 */
export default {
  getModel: function getModel(entityName) {
    let Ctor;
    if (App.onLine) {
      Ctor = Manager.get(entityName, MODEL_TYPES.SDATA);
    } else {
      Ctor = Manager.get(entityName, MODEL_TYPES.OFFLINE);
    }

    return typeof Ctor === 'function' ? new Ctor() : false;
  },
};
