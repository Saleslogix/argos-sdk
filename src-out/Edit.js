define('argos/Edit', ['module', 'exports', 'dojo/_base/declare', './_EditBase', './_SDataEditMixin', './_RelatedViewWidgetEditMixin'], function (module, exports, _declare, _EditBase2, _SDataEditMixin2, _RelatedViewWidgetEditMixin) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _EditBase3 = _interopRequireDefault(_EditBase2);

  var _SDataEditMixin3 = _interopRequireDefault(_SDataEditMixin2);

  var _RelatedViewWidgetEditMixin2 = _interopRequireDefault(_RelatedViewWidgetEditMixin);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/Edit
   * @classdesc Edit extends _EditBase and mixes in _SDataEditMixin to provide backwards compatibility for consumers.
   * @extends module:argos/_EditBase
   * @mixes module:argos/_SDataEditMixin
   * @mixes module:argos/_RelatedViewWidgetEditMixin
   */
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
   * @module argos/Edit
   */
  const __class = (0, _declare2.default)('argos.Edit', [_EditBase3.default, _SDataEditMixin3.default, _RelatedViewWidgetEditMixin2.default], {});
  exports.default = __class;
  module.exports = exports['default'];
});