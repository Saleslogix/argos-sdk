define('argos/Views/Link', ['module', 'exports', 'dojo/_base/declare', '../View'], function (module, exports, _declare, _View) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _View2 = _interopRequireDefault(_View);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/Views/Link
   * @extends module:argos/View
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
   * @module argos/Views/Link
   */
  var __class = (0, _declare2.default)('argos.Views.Link', [_View2.default], /** @lends module:argos/Views/Link.prototype */{
    id: 'link_view',
    titleText: '',
    viewType: 'detail',
    /**
     *
     */
    link: '',
    cls: 'link-view',
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" data-title="{%= $.titleText %}" class="detail panel {%= $.cls %}">', '<iframe class="link-node" data-dojo-attach-point="linkNode"', 'sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox">', '</iframe>', '</div>']),
    _getLink: function _getLink() {
      var link = this.options.link;

      return link || this.link;
    },
    onTransitionTo: function onTransitionTo() {
      this.linkNode.contentWindow.location.replace(this._getLink());
    },
    onTransitionAway: function onTransitionAway() {
      this.linkNode.contentWindow.location.replace('about:blank');
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});