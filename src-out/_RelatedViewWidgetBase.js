define('argos/_RelatedViewWidgetBase', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dijit/_WidgetBase', './_Templated', './I18n'], function (module, exports, _declare, _lang, _WidgetBase2, _Templated2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('relatedViewWidgetBase');

  /**
   * @class
   * @alias module:argos/_RelatedViewWidgetBase
   * @extends module:argos/_Templated
   */
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

  /**
   * @module argos/_RelatedViewWidgetBase
   */
  var __class = (0, _declare2.default)('argos._RelatedViewWidgetBase', [_WidgetBase3.default, _Templated3.default], /** @lends module:argos/_RelatedViewWidgetBase.prototype */{
    cls: null,
    loadingText: resource.loadingText,
    /**
     * @property {Simplate}
     * Simple that defines the HTML Markup
     */
    widgetTemplate: new Simplate(['<div class="related-view-widget-base {%: $$.cls %}">', '<div data-dojo-attach-point="containerNode" >', '{%! $$.relatedContentTemplate %}', '</div>', '</div>']),
    relatedContentTemplate: new Simplate(['']),
    loadingTemplate: new Simplate(['<div class="busy-indicator-container" aria-live="polite">', '<div class="busy-indicator active">', '<div class="bar one"></div>', '<div class="bar two"></div>', '<div class="bar three"></div>', '<div class="bar four"></div>', '<div class="bar five"></div>', '</div>', '<span>{%: $.loadingText %}</span>', '</div>']),
    constructor: function constructor(options) {
      _lang2.default.mixin(this, options);
    },
    onInit: function onInit() {
      this.onLoad();
    },
    onLoad: function onLoad() {}
  });

  exports.default = __class;
  module.exports = exports['default'];
});