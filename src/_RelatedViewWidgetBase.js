/* Copyright 2017 Infor
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import _WidgetBase from 'dijit/_WidgetBase';
import _Templated from './_Templated';
import getResource from './I18n';

const resource = getResource('relatedViewWidgetBase');

/**
 * @class argos._RelatedViewWidgetBase
 */
const __class = declare('argos._RelatedViewWidgetBase', [_WidgetBase, _Templated], /** @lends argos._RelatedViewWidgetBase# */{
  cls: null,
  loadingText: resource.loadingText,
  /**
   * @property {Simplate}
   * Simple that defines the HTML Markup
   */
  widgetTemplate: new Simplate([
    '<div class="related-view-widget-base {%: $$.cls %}">',
    '<div data-dojo-attach-point="containerNode" >',
    '{%! $$.relatedContentTemplate %}',
    '</div>',
    '</div>',
  ]),
  relatedContentTemplate: new Simplate([
    '',
  ]),
  loadingTemplate: new Simplate([
    '<div class="busy-indicator-container" aria-live="polite">',
    '<div class="busy-indicator active">',
    '<div class="bar one"></div>',
    '<div class="bar two"></div>',
    '<div class="bar three"></div>',
    '<div class="bar four"></div>',
    '<div class="bar five"></div>',
    '</div>',
    '<span>{%: $.loadingText %}</span>',
    '</div>',
  ]),
  constructor: function constructor(options) {
    lang.mixin(this, options);
  },
  onInit: function onInit() {
    this.onLoad();
  },
  onLoad: function onLoad() {},
});

export default __class;
