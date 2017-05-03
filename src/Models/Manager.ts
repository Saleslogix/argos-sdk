import * as lang from 'dojo/_base/lang';

const store = new Map();

/**
 * @class argos.Models.Manager
 */
export default class ModelsManager {
  static register(modelName, modelType, ctor) {
    let value = new Map();
    if (store.has(modelName)) {
      value = store.get(modelName);
    }

    value.set(modelType, ctor);
    store.set(modelName, value);
    return ctor;
  }
  static get(modelName, modelType) {
    const value = store.get(modelName);
    if (value) {
      return value.get(modelType);
    }
  }
  static getModel(modelName, modelType) {
    const ModelCtor = this.get(modelName, modelType);
    let model = null;
    if (ModelCtor) {
      model = new ModelCtor();
      model.init();
    }
    return model;
  }
  static getModels(modelType) {
    const models = [];
    for (const key of store.keys() as any) {
      const model = this.getModel(key, modelType);
      if (model) {
        models.push(model);
      }
    }
    return models;
  }
  store;
}

lang.setObject('argos.Models.Manager', ModelsManager);
