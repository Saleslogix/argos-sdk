define('argos/_ServiceMixin', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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
   * @alternateClassName _ServiceMixin
   * @deprecated
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var __class = (0, _declare['default'])('argos._ServiceMixin', null, {
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
  });

  _lang['default'].setObject('Sage.Platform.Mobile._ServiceMixin', __class);
  module.exports = __class;
});
