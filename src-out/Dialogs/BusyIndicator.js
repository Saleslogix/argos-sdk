define('argos/Dialogs/BusyIndicator', ['module', 'exports', 'dojo/_base/declare', 'dijit/_WidgetBase', '../_Templated', '../I18n'], function (module, exports, _declare, _WidgetBase2, _Templated2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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
   * @module argos/Dialogs/BusyIndicator
   */
  var resource = (0, _I18n2.default)('busyIndicator');

  /**
   * @class
   * @alias module:argos/Dialogs/BusyIndicator
   * @extends module:argos/_Templated
   */
  var __class = (0, _declare2.default)('argos.Dialogs.BusyIndicator', [_WidgetBase3.default, _Templated3.default], /** @lends module:argos/Dialogs/BusyIndicator.prototype */{
    widgetTemplate: new Simplate(['<div class="busyIndicator__container {%: $.containerClass %}" aria-live="polite" data-dojo-attach-point="busyIndicatorNode">', '{%! $.busyIndicatorTemplate %}', '{%! $.progressBarTemplate %}', '</div>']),
    busyIndicatorTemplate: new Simplate(['<div class="busy-{%: $.size %}" style="height: 100%; width: 100%;">', '<div class="busy-indicator-container" aria-live="polite" role="status">', '<div class="busy-indicator active">', '<div class="bar one"></div>', '<div class="bar two"></div>', '<div class="bar three"></div>', '<div class="bar four"></div>', '<div class="bar five"></div>', '</div>', '<span data-dojo-attach-point="labelNode">{%: $.label %}</span>', '</div>', '</div>']),
    progressBarTemplate: new Simplate(['<div class="busyIndicator__progress" data-dojo-attach-point="progressNode">', '</div>']),
    progressLabelTemplate: new Simplate(['<div class="busyIndicator__progress__label" style="text-align:center">{%: $.progressText %}</div>']),
    barTemplate: new Simplate(['<div class="busyIndicator__progress__bar"></div>']),

    _busyDeferred: null,
    _busyIndicator: null,
    _progressBar: null,
    containerClass: null,
    currentProgress: null,
    id: 'busyIndicator-template',
    isAsync: true,
    label: resource.loadingText,
    progressLabelNode: null,
    progressText: resource.progressText,
    size: '', // sm, xs, blank for normal
    totalProgress: null,

    complete: function complete() {
      var result = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      $(this.busyIndicatorNode).removeClass('busyIndicator--active');
      this._busyDeferred(result);
    },
    show: function show() {},
    start: function start() {
      var _this = this;

      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      return new Promise(function (resolve) {
        _this._busyDeferred = resolve;
        $(_this.busyIndicatorNode).addClass('busyIndicator--active');

        if (!_this.isAsync || options.isAsync !== undefined && !options.isAsync) {
          _this._progressBar = $(_this.barTemplate.apply(_this));
          _this.progressLabelNode = $(_this.progressLabelTemplate.apply(_this));
          $(_this.progressNode).append(_this.progressLabelNode);
          $(_this.progressNode).append(_this._progressBar);
          _this.currentProgress = options.current || 0;
          _this.totalProgress = options.total || options.count || 0;
        }
      });
    },
    updateProgress: function updateProgress() {
      this.currentProgress = this.currentProgress + 1;
      if (this._progressBar) {
        this._progressBar.css({
          width: 100 * this.currentProgress / this.totalProgress + '%'
        });
      }
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});