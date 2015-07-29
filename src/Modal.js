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
 * @class argos.Modal
 * @alternateClassName Pop-up
 * Recommended order of function chaining to reduce errors:
 *  If fresh creation - Create -> Place -> Set -> Show
 *  If on old modal with new content - Empty -> Set -> Show
 *  If on old modal with no new content - Show
 *  To hide modal - Hide
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import event from 'dojo/_base/event';
import domConstruct from 'dojo/dom-construct';
import domClass from 'dojo/dom-class';
import _Widget from 'dijit/_Widget';
import _Templated from 'argos/_Templated';

var __class = declare('argos.Modal', [_Widget, _Templated], {
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" class="modal panel" data-dojo-attach-point="modalNode"></div>'
  ]),
  pickListStartTemplate: new Simplate([
    '<ul class="picklist dropdown">'
  ]),
  pickListEndTemplate: new Simplate([
    '</ul>',
  ]),
  pickListItemTemplate: new Simplate([
    '<li class="listItem">{%= $.item %}</li>'
  ]),

  id: 'modal-template',
  _parentNode: null,

  emptyModal: function() {
    domConstruct.empty(this.modalNode);
    return this;
  },
  hideModal: function() {
    this.modalNode.style.visibility = 'hidden';
    return this;
  },
  placeModal: function(parentPanel = {}) {
    this._parentNode = parentPanel;
    domConstruct.place(this.modalNode, parentPanel);
    return this;
  },
  setContent: function(panel = {}) {
    domConstruct.place(panel, this.modalNode);
    return this;
  },
  setContentPicklist: function(items = {}) {
    const pickListStart = domConstruct.toDom(this.pickListStartTemplate.apply()),
          pickListEnd = domConstruct.toDom(this.pickListEndTemplate.apply());

    for (let item in items) {
      domConstruct.place(this.pickListItemTemplate.apply(item, this), pickListStart);
    }
    domConstruct.place(pickListEnd, pickListStart);
    domConstruct.place(pickListStart, this.modalNode);
    return this;
  },
  showModal: function({ offsetTop, offsetLeft, offsetWidth, offsetHeight }) {
    if (this._parentNode) {
      this.modalNode.style.left = posLeft - this.modalNode.offsetWidth + width + 'px';
      this.modalNode.style.top = posTop + height + 'px';
      this.modalNode.style.maxHeight =  this._parentNode.offsetHeight - this._parentNode.offsetTop - posTop + 'px';
      this.modalNode.style.visibility = 'visible';
    }
    return this;
  }
});

lang.setObject('Sage.Platform.Mobile.Modal', __class);
export default __class;
