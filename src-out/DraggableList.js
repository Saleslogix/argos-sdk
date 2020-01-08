define('argos/DraggableList', ['module', 'exports', 'dojo/_base/declare', './_ListBase', './_DraggableBase'], function (module, exports, _declare, _ListBase2, _DraggableBase2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _ListBase3 = _interopRequireDefault(_ListBase2);

  var _DraggableBase3 = _interopRequireDefault(_DraggableBase2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/DraggableList
   * @classdesc List extends _ListBase and _DraggableBase to make the list draggable
   * @extends module:argos/_ListBase
   * @extends module:argos/_DraggableBase
   */
  var __class = (0, _declare2.default)('argos.DraggableList', [_ListBase3.default, _DraggableBase3.default], /** @lends module:argos/DraggableList.prototype */{
    isCardView: false,
    liRowTemplate: new Simplate(['<li role="option" data-action="activateEntry" data-key="{%= $[$$.idProperty] %}" data-descriptor="{%: $[$$.labelProperty] %}" class="list-item-draggable">', '<button type="button" class="btn-icon hide-focus list-item-selector" data-action="selectEntry">', '<svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n        <use xlink:href="#icon-{%= $$.selectIcon %}" />\n      </svg>', '</button>', '<div class="list-item-content">{%! $$.itemTemplate %}</div>', '</li>']),
    show: function show() {
      this.setupDraggable(this.contentNode, this.scrollerNode).setClass('draggable').setParentClassToDrag('list-item-draggable');
      this.inherited(show, arguments);
    }
  }); /* Copyright 2017 Infor
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
   * @module argos/DraggableList
   */
  exports.default = __class;
  module.exports = exports['default'];
});