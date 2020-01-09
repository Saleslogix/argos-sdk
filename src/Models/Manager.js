/* Copyright 2017 Infor
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @module argos/Models/Manager
 */
import lang from 'dojo/_base/lang';

const store = new Map();

/**
 * @class
 * @alias module:argos/Models/Manager
 * @static
 */
const __class = lang.setObject('argos.Models.Manager', /** @lends module:argos/Models/Manager */{
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
  getModels: function getModels(modelType) {
    const models = [];
    for (const key of store.keys()) {
      const model = this.getModel(key, modelType);
      if (model) {
        models.push(model);
      }
    }
    return models;
  },
  store,
});

export default __class;
