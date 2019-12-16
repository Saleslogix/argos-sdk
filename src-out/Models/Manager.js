define('argos/Models/Manager', ['module', 'exports', 'dojo/_base/lang'], function (module, exports, _lang) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _lang2 = _interopRequireDefault(_lang);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var store = new Map();

  /**
   * @class argos.Models.Manager
   */
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

  var __class = _lang2.default.setObject('argos.Models.Manager', {
    register: function register(modelName, modelType, ctor) {
      var value = new Map();
      if (store.has(modelName)) {
        value = store.get(modelName);
      }

      value.set(modelType, ctor);
      store.set(modelName, value);
      return ctor;
    },
    get: function get(modelName, modelType) {
      var value = store.get(modelName);
      if (value) {
        return value.get(modelType);
      }
    },
    getModel: function getModel(modelName, modelType) {
      var ModelCtor = this.get(modelName, modelType);
      var model = null;
      if (ModelCtor) {
        model = new ModelCtor();
        model.init();
      }
      return model;
    },
    getModels: function getModels(modelType) {
      var models = [];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = store.keys()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var key = _step.value;

          var model = this.getModel(key, modelType);
          if (model) {
            models.push(model);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      return models;
    },
    store: store
  });

  exports.default = __class;
  module.exports = exports['default'];
});