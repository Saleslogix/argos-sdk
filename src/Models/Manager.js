import lang from 'dojo/_base/lang';

const store = new Map();

const __class = lang.setObject('argos.Models.Manager', {
  register: function register(entityName, modelType, ctor) {
    const key = {entityName, modelType};
    if (!store.has(key)) {
      store.set(key, ctor);
    }
    return ctor;
  },
  get: function get(entityName, modelType) {
    const key = {entityName, modelType};
    return store.get(key);
  },
});

export default __class;
