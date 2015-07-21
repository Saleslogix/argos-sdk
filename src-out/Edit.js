<<<<<<< HEAD
define('argos/Edit', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', './_EditBase', './_SDataEditMixin', './_RelatedViewWidgetEditMixin'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _EditBase2, _SDataEditMixin2, _RelatedViewWidgetEditMixin) {
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

  var _EditBase3 = _interopRequireDefault(_EditBase2);

  var _SDataEditMixin3 = _interopRequireDefault(_SDataEditMixin2);

  var _RelatedWidgetEditMixin2 = _interopRequireDefault(_RelatedViewWidgetEditMixin);

  /**
   * @class argos.Edit
   *
   * Edit extends _EditBase and mixes in _SDataEditMixin to provide backwards compatibility for consumers.
   *
   * @alternateClassName Edit
   * @extends argos._EditBase
   * @requires argos._EditBase
   * @requires argos._SDataEditMixin
   * @mixins argos._SDataEditMixin
   * @requires argos._RelatedViewWidgetEditMixin
   * @mixins argos._RelatedViewWidgetEditMixin
   */
  var __class = (0, _declare['default'])('argos.Edit', [_EditBase3['default'], _SDataEditMixin3['default'], _RelatedWidgetEditMixin2['default']], {});

  _lang['default'].setObject('Sage.Platform.Mobile.Edit', __class);
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
 * @class argos.Edit
 *
 * Edit extends _EditBase and mixes in _SDataEditMixin to provide backwards compatibility for consumers.
 *
 * @alternateClassName Edit
 * @extends argos._EditBase
 * @requires argos._EditBase
 * @requires argos._SDataEditMixin
 * @mixins argos._SDataEditMixin
 * @requires argos._RelatedViewWidgetEditMixin
 * @mixins argos._RelatedViewWidgetEditMixin
 */
define('argos/Edit', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    './_EditBase',
    './_SDataEditMixin',
    './_RelatedViewWidgetEditMixin'
], function(
    declare,
    lang,
    _EditBase,
    _SDataEditMixin,
    _RelatedWidgetEditMixin
) {

    var __class = declare('argos.Edit', [_EditBase, _SDataEditMixin, _RelatedWidgetEditMixin], {
    });

    lang.setObject('Sage.Platform.Mobile.Edit', __class);
    return __class;
>>>>>>> develop
});
