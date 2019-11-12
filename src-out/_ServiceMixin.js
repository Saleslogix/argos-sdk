define('argos/_ServiceMixin', ['module', 'exports', 'dojo/_base/declare'], function (module, exports, _declare) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var __class = (0, _declare2.default)('argos._ServiceMixin', null, {
    serviceMap: null,
    constructor: function constructor() {
      var map = this.serviceMap;
      if (map) {
        for (var property in map) {
          if (map.hasOwnProperty(property)) {
            if (this[property]) {
              continue; /* skip any that were explicitly mixed in */
            }

            this[property] = this._resolveService(map[property]);
          }
        }
      }
    },
    _resolveService: function _resolveService(specification) {
      if (specification && specification.type === 'sdata') {
        return App.getService(specification.name);
      }

      return App.getService(specification);
    }
  }); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
       *
       * Licensed under the Apache License, Version 2.0 (the "License");
       * you may not use this file except in compliance with the License.
       * You may obtain a copy of the License at
       *
       *     http://www.apache.org/licenses/LICENSE-2.0
       *
       * Unless required by applicable law or agreed to in writing, software
       * distributed under the License is distributed on an "AS IS" BASIS,
       * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
       * See the License for the specific language governing permissions and
       * limitations under the License.
       */

  /**
   * @class argos._ServiceMixin
   * @deprecated
   */
  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fU2VydmljZU1peGluLmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJzZXJ2aWNlTWFwIiwiY29uc3RydWN0b3IiLCJtYXAiLCJwcm9wZXJ0eSIsImhhc093blByb3BlcnR5IiwiX3Jlc29sdmVTZXJ2aWNlIiwic3BlY2lmaWNhdGlvbiIsInR5cGUiLCJBcHAiLCJnZXRTZXJ2aWNlIiwibmFtZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OztBQXFCQSxNQUFNQSxVQUFVLHVCQUFRLHFCQUFSLEVBQStCLElBQS9CLEVBQXFDO0FBQ25EQyxnQkFBWSxJQUR1QztBQUVuREMsaUJBQWEsU0FBU0EsV0FBVCxHQUF1QjtBQUNsQyxVQUFNQyxNQUFNLEtBQUtGLFVBQWpCO0FBQ0EsVUFBSUUsR0FBSixFQUFTO0FBQ1AsYUFBSyxJQUFNQyxRQUFYLElBQXVCRCxHQUF2QixFQUE0QjtBQUMxQixjQUFJQSxJQUFJRSxjQUFKLENBQW1CRCxRQUFuQixDQUFKLEVBQWtDO0FBQ2hDLGdCQUFJLEtBQUtBLFFBQUwsQ0FBSixFQUFvQjtBQUNsQix1QkFEa0IsQ0FDUjtBQUNYOztBQUVELGlCQUFLQSxRQUFMLElBQWlCLEtBQUtFLGVBQUwsQ0FBcUJILElBQUlDLFFBQUosQ0FBckIsQ0FBakI7QUFDRDtBQUNGO0FBQ0Y7QUFDRixLQWZrRDtBQWdCbkRFLHFCQUFpQixTQUFTQSxlQUFULENBQXlCQyxhQUF6QixFQUF3QztBQUN2RCxVQUFJQSxpQkFBaUJBLGNBQWNDLElBQWQsS0FBdUIsT0FBNUMsRUFBcUQ7QUFDbkQsZUFBT0MsSUFBSUMsVUFBSixDQUFlSCxjQUFjSSxJQUE3QixDQUFQO0FBQ0Q7O0FBRUQsYUFBT0YsSUFBSUMsVUFBSixDQUFlSCxhQUFmLENBQVA7QUFDRDtBQXRCa0QsR0FBckMsQ0FBaEIsQyxDQXJCQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7Ozs7b0JBK0JlUCxPIiwiZmlsZSI6Il9TZXJ2aWNlTWl4aW4uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX1NlcnZpY2VNaXhpblxyXG4gKiBAZGVwcmVjYXRlZFxyXG4gKi9cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fU2VydmljZU1peGluJywgbnVsbCwge1xyXG4gIHNlcnZpY2VNYXA6IG51bGwsXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgY29uc3QgbWFwID0gdGhpcy5zZXJ2aWNlTWFwO1xyXG4gICAgaWYgKG1hcCkge1xyXG4gICAgICBmb3IgKGNvbnN0IHByb3BlcnR5IGluIG1hcCkge1xyXG4gICAgICAgIGlmIChtYXAuaGFzT3duUHJvcGVydHkocHJvcGVydHkpKSB7XHJcbiAgICAgICAgICBpZiAodGhpc1twcm9wZXJ0eV0pIHtcclxuICAgICAgICAgICAgY29udGludWU7IC8qIHNraXAgYW55IHRoYXQgd2VyZSBleHBsaWNpdGx5IG1peGVkIGluICovXHJcbiAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgdGhpc1twcm9wZXJ0eV0gPSB0aGlzLl9yZXNvbHZlU2VydmljZShtYXBbcHJvcGVydHldKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIF9yZXNvbHZlU2VydmljZTogZnVuY3Rpb24gX3Jlc29sdmVTZXJ2aWNlKHNwZWNpZmljYXRpb24pIHtcclxuICAgIGlmIChzcGVjaWZpY2F0aW9uICYmIHNwZWNpZmljYXRpb24udHlwZSA9PT0gJ3NkYXRhJykge1xyXG4gICAgICByZXR1cm4gQXBwLmdldFNlcnZpY2Uoc3BlY2lmaWNhdGlvbi5uYW1lKTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gQXBwLmdldFNlcnZpY2Uoc3BlY2lmaWNhdGlvbik7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=