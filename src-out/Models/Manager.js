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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Nb2RlbHMvTWFuYWdlci5qcyJdLCJuYW1lcyI6WyJzdG9yZSIsIk1hcCIsIl9fY2xhc3MiLCJzZXRPYmplY3QiLCJyZWdpc3RlciIsIm1vZGVsTmFtZSIsIm1vZGVsVHlwZSIsImN0b3IiLCJ2YWx1ZSIsImhhcyIsImdldCIsInNldCIsImdldE1vZGVsIiwiTW9kZWxDdG9yIiwibW9kZWwiLCJpbml0IiwiZ2V0TW9kZWxzIiwibW9kZWxzIiwia2V5cyIsImtleSIsInB1c2giXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7QUFpQkEsTUFBTUEsUUFBUSxJQUFJQyxHQUFKLEVBQWQ7O0FBRUE7OztBQW5CQTs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLE1BQU1DLFVBQVUsZUFBS0MsU0FBTCxDQUFlLHNCQUFmLEVBQXVDO0FBQ3JEQyxjQUFVLFNBQVNBLFFBQVQsQ0FBa0JDLFNBQWxCLEVBQTZCQyxTQUE3QixFQUF3Q0MsSUFBeEMsRUFBOEM7QUFDdEQsVUFBSUMsUUFBUSxJQUFJUCxHQUFKLEVBQVo7QUFDQSxVQUFJRCxNQUFNUyxHQUFOLENBQVVKLFNBQVYsQ0FBSixFQUEwQjtBQUN4QkcsZ0JBQVFSLE1BQU1VLEdBQU4sQ0FBVUwsU0FBVixDQUFSO0FBQ0Q7O0FBRURHLFlBQU1HLEdBQU4sQ0FBVUwsU0FBVixFQUFxQkMsSUFBckI7QUFDQVAsWUFBTVcsR0FBTixDQUFVTixTQUFWLEVBQXFCRyxLQUFyQjtBQUNBLGFBQU9ELElBQVA7QUFDRCxLQVZvRDtBQVdyREcsU0FBSyxTQUFTQSxHQUFULENBQWFMLFNBQWIsRUFBd0JDLFNBQXhCLEVBQW1DO0FBQ3RDLFVBQU1FLFFBQVFSLE1BQU1VLEdBQU4sQ0FBVUwsU0FBVixDQUFkO0FBQ0EsVUFBSUcsS0FBSixFQUFXO0FBQ1QsZUFBT0EsTUFBTUUsR0FBTixDQUFVSixTQUFWLENBQVA7QUFDRDtBQUNGLEtBaEJvRDtBQWlCckRNLGNBQVUsU0FBU0EsUUFBVCxDQUFrQlAsU0FBbEIsRUFBNkJDLFNBQTdCLEVBQXdDO0FBQ2hELFVBQU1PLFlBQVksS0FBS0gsR0FBTCxDQUFTTCxTQUFULEVBQW9CQyxTQUFwQixDQUFsQjtBQUNBLFVBQUlRLFFBQVEsSUFBWjtBQUNBLFVBQUlELFNBQUosRUFBZTtBQUNiQyxnQkFBUSxJQUFJRCxTQUFKLEVBQVI7QUFDQUMsY0FBTUMsSUFBTjtBQUNEO0FBQ0QsYUFBT0QsS0FBUDtBQUNELEtBekJvRDtBQTBCckRFLGVBQVcsU0FBU0EsU0FBVCxDQUFtQlYsU0FBbkIsRUFBOEI7QUFDdkMsVUFBTVcsU0FBUyxFQUFmO0FBRHVDO0FBQUE7QUFBQTs7QUFBQTtBQUV2Qyw2QkFBa0JqQixNQUFNa0IsSUFBTixFQUFsQiw4SEFBZ0M7QUFBQSxjQUFyQkMsR0FBcUI7O0FBQzlCLGNBQU1MLFFBQVEsS0FBS0YsUUFBTCxDQUFjTyxHQUFkLEVBQW1CYixTQUFuQixDQUFkO0FBQ0EsY0FBSVEsS0FBSixFQUFXO0FBQ1RHLG1CQUFPRyxJQUFQLENBQVlOLEtBQVo7QUFDRDtBQUNGO0FBUHNDO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBUXZDLGFBQU9HLE1BQVA7QUFDRCxLQW5Db0Q7QUFvQ3JEakI7QUFwQ3FELEdBQXZDLENBQWhCOztvQkF1Q2VFLE8iLCJmaWxlIjoiTWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcblxyXG5jb25zdCBzdG9yZSA9IG5ldyBNYXAoKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuTW9kZWxzLk1hbmFnZXJcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBsYW5nLnNldE9iamVjdCgnYXJnb3MuTW9kZWxzLk1hbmFnZXInLCB7XHJcbiAgcmVnaXN0ZXI6IGZ1bmN0aW9uIHJlZ2lzdGVyKG1vZGVsTmFtZSwgbW9kZWxUeXBlLCBjdG9yKSB7XHJcbiAgICBsZXQgdmFsdWUgPSBuZXcgTWFwKCk7XHJcbiAgICBpZiAoc3RvcmUuaGFzKG1vZGVsTmFtZSkpIHtcclxuICAgICAgdmFsdWUgPSBzdG9yZS5nZXQobW9kZWxOYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICB2YWx1ZS5zZXQobW9kZWxUeXBlLCBjdG9yKTtcclxuICAgIHN0b3JlLnNldChtb2RlbE5hbWUsIHZhbHVlKTtcclxuICAgIHJldHVybiBjdG9yO1xyXG4gIH0sXHJcbiAgZ2V0OiBmdW5jdGlvbiBnZXQobW9kZWxOYW1lLCBtb2RlbFR5cGUpIHtcclxuICAgIGNvbnN0IHZhbHVlID0gc3RvcmUuZ2V0KG1vZGVsTmFtZSk7XHJcbiAgICBpZiAodmFsdWUpIHtcclxuICAgICAgcmV0dXJuIHZhbHVlLmdldChtb2RlbFR5cGUpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZ2V0TW9kZWw6IGZ1bmN0aW9uIGdldE1vZGVsKG1vZGVsTmFtZSwgbW9kZWxUeXBlKSB7XHJcbiAgICBjb25zdCBNb2RlbEN0b3IgPSB0aGlzLmdldChtb2RlbE5hbWUsIG1vZGVsVHlwZSk7XHJcbiAgICBsZXQgbW9kZWwgPSBudWxsO1xyXG4gICAgaWYgKE1vZGVsQ3Rvcikge1xyXG4gICAgICBtb2RlbCA9IG5ldyBNb2RlbEN0b3IoKTtcclxuICAgICAgbW9kZWwuaW5pdCgpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG1vZGVsO1xyXG4gIH0sXHJcbiAgZ2V0TW9kZWxzOiBmdW5jdGlvbiBnZXRNb2RlbHMobW9kZWxUeXBlKSB7XHJcbiAgICBjb25zdCBtb2RlbHMgPSBbXTtcclxuICAgIGZvciAoY29uc3Qga2V5IG9mIHN0b3JlLmtleXMoKSkge1xyXG4gICAgICBjb25zdCBtb2RlbCA9IHRoaXMuZ2V0TW9kZWwoa2V5LCBtb2RlbFR5cGUpO1xyXG4gICAgICBpZiAobW9kZWwpIHtcclxuICAgICAgICBtb2RlbHMucHVzaChtb2RlbCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiBtb2RlbHM7XHJcbiAgfSxcclxuICBzdG9yZSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=