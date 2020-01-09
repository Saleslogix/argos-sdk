define('argos/Groups/GroupByValueSection', ['module', 'exports', 'dojo/_base/declare', '../Utility', './_GroupBySection', '../I18n'], function (module, exports, _declare, _Utility, _GroupBySection2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _GroupBySection3 = _interopRequireDefault(_GroupBySection2);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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
   * @module argos/Groups/GroupByValueSection
   */
  var resource = (0, _I18n2.default)('groupByValueSection');

  /**
   * @class
   * @alias module:argos/Groups/GroupByValueSection
   */
  var __class = (0, _declare2.default)('argos.Groups.GroupByValueSection', [_GroupBySection3.default], /** @lends module:argos/Groups/GroupByValueSection.prototype */{
    name: 'DateTimeSectionFilter',
    displayNameText: resource.displayNameText,
    width: 0,
    constructor: function constructor(o) {
      this.groupByProperty = o.groupByProperty;
      this.sortDirection = o.sortDirection;
      if (o.width) {
        this.width = o.width;
      }
      this.init();
    },
    init: function init() {
      this.sections = [];
    },
    getSection: function getSection(entry) {
      if (this.groupByProperty && entry) {
        var value = _Utility2.default.getValue(entry, this.groupByProperty);
        value = this._getValueFromWidth(value, this.width);
        if (value) {
          return {
            key: value,
            title: value
          };
        }
        return this.getDefaultSection();
      }
      return null;
    },
    getDefaultSection: function getDefaultSection() {
      return {
        key: 'Unknown',
        title: 'Unknown'
      };
    },
    _getValueFromWidth: function _getValueFromWidth(value, width) {
      if (value) {
        if (width > 0) {
          return value.toString().substring(0, width);
        }
      }
      return value;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});