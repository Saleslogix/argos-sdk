define('argos/Detail', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', './_DetailBase', './_SDataDetailMixin', './_RelatedViewWidgetDetailMixin'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _DetailBase2, _SDataDetailMixin2, _RelatedViewWidgetDetailMixin) {
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

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _DetailBase3 = _interopRequireDefault(_DetailBase2);

  var _SDataDetailMixin3 = _interopRequireDefault(_SDataDetailMixin2);

  var _RelatedWidgetDetailMixin2 = _interopRequireDefault(_RelatedViewWidgetDetailMixin);

  /**
   * @class argos.Detail
   *
   * Extends _DetailBase and mixes in _SDataDetailMixin to provide backwards compatibility to consumers.
   *
   * @alternateClassName Detail
   * @extends argos._DetailBase
   * @requires argos._DetailBase
   * @requires argos._SDataDetailMixin
   * @mixins argos._SDataDetailMixin
   * @mixins argos._RelatedViewWidgetDetailMixin
   */
  var __class = (0, _declare['default'])('argos.Detail', [_DetailBase3['default'], _SDataDetailMixin3['default'], _RelatedWidgetDetailMixin2['default']], {});

  _lang['default'].setObject('Sage.Platform.Mobile.Detail', __class);
  module.exports = __class;
});
