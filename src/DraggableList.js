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
import _ListBase from './_ListBase';
import _DraggableBase from './_DraggableBase';

/**
 * @class argos.DraggableList
 * @classdesc List extends List and _DraggableBase to make the list draggable
 * @extends argos.List
 * @extends argos._DraggableBase
 * @requires argos.List
 * @requires argos._DraggableBase
 */
const __class = declare('argos.DraggableList', [_ListBase, _DraggableBase], {
  isCardView: false,
  liRowTemplate: new Simplate([
    '<li role="option" data-action="activateEntry" data-key="{%= $[$$.idProperty] %}" data-descriptor="{%: $[$$.labelProperty] %}" class="list-item-draggable">',
    '<button type="button" class="btn-icon hide-focus list-item-selector" data-action="selectEntry">',
    `<svg class="icon" focusable="false" aria-hidden="true" role="presentation">
        <use xlink:href="#icon-{%= $$.selectIcon %}" />
      </svg>`,
    '</button>',
    '<div class="list-item-content">{%! $$.itemTemplate %}</div>',
    '</li>',
  ]),
  show: function show() {
    this.setupDraggable(this.contentNode, this.scrollerNode)
        .setClass('draggable')
        .setParentClassToDrag('list-item-draggable');
    this.inherited(arguments);
  },
});

export default __class;
