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
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import _DetailBase from './_DetailBase';
import _SDataDetailMixin from './_SDataDetailMixin';
import _RelatedWidgetDetailMixin from './_RelatedViewWidgetDetailMixin';
import _DetailOfflineMixin from './Offline/_DetailOfflineMixin';

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
const __class = declare('argos.Detail', [_DetailBase, _SDataDetailMixin, _RelatedWidgetDetailMixin, _DetailOfflineMixin], {});

lang.setObject('Sage.Platform.Mobile.Detail', __class);
export default __class;
