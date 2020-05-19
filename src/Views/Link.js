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
import declare from 'dojo/_base/declare';
import View from '../View';

/**
 * @class
 * @alias module:argos/Views/Link
 * @extends module:argos/View
 */
const __class = declare('argos.Views.Link', [View], /** @lends module:argos/Views/Link.prototype */{
  id: 'link_view',
  titleText: '',
  viewType: 'detail',
  /**
   *
   */
  link: '',
  cls: 'link-view',
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" data-title="{%= $.titleText %}" class="detail panel {%= $.cls %}">',
    '<iframe class="link-node" data-dojo-attach-point="linkNode"',
    'sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-popups-to-escape-sandbox">',
    '</iframe>',
    '</div>',
  ]),
  _getLink: function _getLink() {
    const { link } = this.options;
    return link || this.link;
  },
  onTransitionTo: function onTransitionTo() {
    this.linkNode.contentWindow.location.replace(this._getLink());
  },
  onTransitionAway: function onTransitionAway() {
    this.linkNode.contentWindow.location.replace('about:blank');
  },
});

export default __class;
