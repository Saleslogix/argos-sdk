import lang from 'dojo/_base/lang';

const store = new Map();

const __class = lang.setObject('argos.Models.Manager', {
  register: function register(entityName, modelType, ctor) {
    let value = new Map();
    if (store.has(entityName)) {
      value = store.get(entityName);
    }

    value.set(modelType, ctor);
    store.set(entityName, value);
    return ctor;
  },
  get: function get(entityName, modelType) {
    const value = store.get(entityName);
    if (value) {
      return value.get(modelType);
    }
  },
  store: store,
});

export default __class;
