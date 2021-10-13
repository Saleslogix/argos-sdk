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

  /**
   * @class
   * @mixin
   * @alias module:argos/_ServiceMixin
   * @deprecated
   */
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
   * @module argos/_ServiceMixin
   */
  exports.default = __class;
  module.exports = exports['default'];
});