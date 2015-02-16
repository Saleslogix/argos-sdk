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
 * @class Sage.Platform.Mobile.List
 * List extends _ListBase and mixes in _SDataListMixin to provide backwards compatibility for consumers.
 * @extends Sage.Platform.Mobile._ListBase
 * @alternateClassName List
 * @requires Sage.Platform.Mobile._ListBase
 * @requires Sage.Platform.Mobile._SDataListMixin
 * @mixins Sage.Platform.Mobile._SDataListMixin
 */
define('Sage/Platform/Mobile/List', [
    'dojo/_base/declare',
    './_ListBase',
    './_SDataListMixin'
], function(
    declare,
    _ListBase,
    _SDataListMixin
) {
    return declare('Sage.Platform.Mobile.List', [_ListBase, _SDataListMixin], {
    });
});

