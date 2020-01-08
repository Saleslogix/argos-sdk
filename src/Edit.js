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
import declare from 'dojo/_base/declare';
import _EditBase from './_EditBase';
import _SDataEditMixin from './_SDataEditMixin';
import _RelatedWidgetEditMixin from './_RelatedViewWidgetEditMixin';

/**
 * @class
 * @alias module:argos/Edit
 * @classdesc Edit extends _EditBase and mixes in _SDataEditMixin to provide backwards compatibility for consumers.
 * @extends module:argos/_EditBase
 * @mixes module:argos/_SDataEditMixin
 * @mixes module:argos/_RelatedViewWidgetEditMixin
 */
const __class = declare('argos.Edit', [_EditBase, _SDataEditMixin, _RelatedWidgetEditMixin], {});
export default __class;
