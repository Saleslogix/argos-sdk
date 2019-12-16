define('argos/Detail', ['module', 'exports', 'dojo/_base/declare', './_DetailBase', './_SDataDetailMixin', './_RelatedViewWidgetDetailMixin', './Offline/_DetailOfflineMixin'], function (module, exports, _declare, _DetailBase2, _SDataDetailMixin2, _RelatedViewWidgetDetailMixin, _DetailOfflineMixin2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _DetailBase3 = _interopRequireDefault(_DetailBase2);

  var _SDataDetailMixin3 = _interopRequireDefault(_SDataDetailMixin2);

  var _RelatedViewWidgetDetailMixin2 = _interopRequireDefault(_RelatedViewWidgetDetailMixin);

  var _DetailOfflineMixin3 = _interopRequireDefault(_DetailOfflineMixin2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.Detail
   * @classdesc Extends _DetailBase and mixes in _SDataDetailMixin to provide backwards compatibility to consumers.
   * @extends argos._DetailBase
   * @requires argos._DetailBase
   * @requires argos._SDataDetailMixin
   * @mixins argos._SDataDetailMixin
   * @mixins argos._RelatedViewWidgetDetailMixin
   */
  var __class = (0, _declare2.default)('argos.Detail', [_DetailBase3.default, _SDataDetailMixin3.default, _RelatedViewWidgetDetailMixin2.default, _DetailOfflineMixin3.default], {}); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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

  exports.default = __class;
  module.exports = exports['default'];
});