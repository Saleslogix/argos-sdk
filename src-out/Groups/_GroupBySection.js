define('argos/Groups/_GroupBySection', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang'], function (module, exports, _declare, _lang) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Groups._GroupSection
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

  var __class = (0, _declare2.default)('argos.Groups._GroupBySection', null, /** @lends argos.Groups._GroupSection# */{
    /**
     * @property {String}
     * The unique (within the current form) name of the field
     */
    name: null,
    /**
     * @property {String}
     * Signifies that the field should always be included when the form calls {@link Edit#getValues getValues}.
     */
    displayName: null,
    /**
     * @property {String}
     * The SData property that the field will be bound to.
     */
    groupByProperty: null,
    sortDirection: 'desc',
    sections: null,
    constructor: function constructor(o) {
      _lang2.default.mixin(this, o);
    },
    init: function init() {},
    getGroupSection: function getGroupSection() /* entry*/{},
    getOrderByQuery: function getOrderByQuery() {
      return this.groupByProperty + ' ' + this.sortDirection;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});