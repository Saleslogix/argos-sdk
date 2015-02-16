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
 * @class Sage.Platform.Mobile.Edit
 *
 * Edit extends _EditBase and mixes in _SDataEditMixin to provide backwards compatibility for consumers.
 *
 * @alternateClassName Edit
 * @extends Sage.Platform.Mobile._EditBase
 * @requires Sage.Platform.Mobile._EditBase
 * @requires Sage.Platform.Mobile._SDataEditMixin
 * @mixins Sage.Platform.Mobile._SDataEditMixin
 */
define('Sage/Platform/Mobile/Edit', [
    'dojo/_base/declare',
    './_EditBase',
    './_SDataEditMixin'
], function(
    declare,
    _EditBase,
    _SDataEditMixin
) {

    return declare('Sage.Platform.Mobile.Edit', [_EditBase, _SDataEditMixin], {
    });
});
