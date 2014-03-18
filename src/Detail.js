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
 * @class Sage.Platform.Mobile.Detail
 *
 * Extends _DetailBase and mixes in _SDataDetailMixin to provide backwards compatibility to consumers.
 *
 * @alternateClassName Detail
 * @extends Sage.Platform.Mobile._DetailBase
 * @requires Sage.Platform.Mobile._DetailBase
 * @requires Sage.Platform.Mobile._SDataDetailMixin
 * @mixins Sage.Platform.Mobile._DetailBase
 * @mixins Sage.Platform.Mobile._SDataDetailMixin
 */
define('Sage/Platform/Mobile/Detail', [
    'dojo/_base/declare',
    './_DetailBase',
    './_SDataDetailMixin'
], function(
    declare,
    _DetailBase,
    _SDataDetailMixin
) {

    return declare('Sage.Platform.Mobile.Detail', [_DetailBase, _SDataDetailMixin], {
    });
});

