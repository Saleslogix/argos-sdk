import lang from 'dojo/_base/lang';

const store = new Map();

const __class = lang.setObject('argos.Models.Manager', {
  register: function register(modelName, modelType, ctor) {
    let value = new Map();
    if (store.has(modelName)) {
      value = store.get(modelName);
    }

    value.set(modelType, ctor);
    store.set(modelName, value);
    return ctor;
  },
  get: function get(modelName, modelType) {
    const value = store.get(modelName);
    if (value) {
      return value.get(modelType);
    }
  },
  getModel: function getModel(modelName, modelType) {
    const ModelCtor = this.get(modelName, modelType);
    let model = null;
    if (ModelCtor) {
      model = new ModelCtor();
      model.init();
    }
    return model;
  },
  store: store,
});

export default __class;
