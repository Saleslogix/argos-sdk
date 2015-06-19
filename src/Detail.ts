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
import declare = require('dojo/_base/declare');
import lang = require('dojo/_base/lang');
import _DetailBase = require('./_DetailBase');
import _SDataDetailMixin = require('./_SDataDetailMixin');
import _RelatedWidgetDetailMixin = require('./_RelatedViewWidgetDetailMixin');

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
var __class = declare('argos.Detail', [_DetailBase, _SDataDetailMixin, _RelatedWidgetDetailMixin], {
});

lang.setObject('Sage.Platform.Mobile.Detail', __class);
export = <argos.Detail>__class;
