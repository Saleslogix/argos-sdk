<<<<<<< HEAD
define('argos/List', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', './_ListBase', './_SDataListMixin', './_RelatedViewWidgetListMixin'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _ListBase2, _SDataListMixin2, _RelatedViewWidgetListMixin) {
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

  var _ListBase3 = _interopRequireDefault(_ListBase2);

  var _SDataListMixin3 = _interopRequireDefault(_SDataListMixin2);

  var _RelatedWidgetListMixin2 = _interopRequireDefault(_RelatedViewWidgetListMixin);

  /**
   * @class argos.List
   * List extends _ListBase and mixes in _SDataListMixin to provide backwards compatibility for consumers.
   * @extends argos._ListBase
   * @alternateClassName List
   * @requires argos._ListBase
   * @requires argos._SDataListMixin
   * @mixins argos._RelateViewdWidgetListMixin
   */
  var __class = (0, _declare['default'])('argos.List', [_ListBase3['default'], _SDataListMixin3['default'], _RelatedWidgetListMixin2['default']], {});

  _lang['default'].setObject('Sage.Platform.Mobile.List', __class);
  module.exports = __class;
=======
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
 * @class argos.List
 * List extends _ListBase and mixes in _SDataListMixin to provide backwards compatibility for consumers.
 * @extends argos._ListBase
 * @alternateClassName List
 * @requires argos._ListBase
 * @requires argos._SDataListMixin
 * @mixins argos._RelateViewdWidgetListMixin
 */
define('argos/List', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    './_ListBase',
    './_SDataListMixin',
    './_RelatedViewWidgetListMixin'
], function(
    declare,
    lang,
    _ListBase,
    _SDataListMixin,
    _RelatedWidgetListMixin
) {
    var __class = declare('argos.List', [_ListBase, _SDataListMixin, _RelatedWidgetListMixin], {
    });

    lang.setObject('Sage.Platform.Mobile.List', __class);
    return __class;
>>>>>>> develop
});

