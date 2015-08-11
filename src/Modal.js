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
 *  If fresh creation - Create -> Backdrop? -> Place -> Set -> Show
 *  If on old modal with new content - Empty -> Set -> Show
 *  If on old modal with no new content - Show
 *  To hide modal - Hide
 */
import declare from 'dojo/_base/declare';
import array from 'dojo/_base/array';
import lang from 'dojo/_base/lang';
import connect from 'dojo/_base/connect';
import domConstruct from 'dojo/dom-construct';
import domStyle from 'dojo/dom-style';
import query from 'dojo/query';
import _Widget from 'dijit/_Widget';
import _Templated from 'argos/_Templated';
import ModalManager from 'argos/ModalManager';

const __class = declare('argos.Modal', [_Widget, _Templated, ModalManager], {
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" class="modal panel" data-dojo-attach-point="modalNode" data-action="clickModal">',
    '</div>',
  ]),
  modalBackdropTemplate: new Simplate([
    '<div class="modal-backdrop" style="height: {%= $.parentHeight %}">',
    '</div>',
  ]),
  pickListStartTemplate: new Simplate([
    '<ul class="picklist dropdown">',
  ]),
  pickListEndTemplate: new Simplate([
    '</ul>',
  ]),
  pickListItemTemplate: new Simplate([
    '<li class="listItem" data-action="{%= $.action %}">',
    '{%= $.item %}',
    '</li>',
  ]),
  modalToolbarTemplate: new Simplate([
    '<div class="modal-toolbar">',
    '</div>',
  ]),
  buttonTemplate: new Simplate([
    '<div class="button tertiary">{%= $.text %}</div>',
  ]),

  id: 'modal-template',
  _orientation: null,
  _parentNode: null,
  _parentListener: null,
  _content: null,
  _contentObject: null,
  _backdrop: null,
  _isPicklist: false,
  showBackdrop: true,
  showToolbar: true,
  positioning: 'center',

  cancelText: 'Cancel',
  confirmText: 'Confirm',

  calculatePosition: function calculatePosition({ offsetTop, offsetLeft, offsetRight, offsetWidth, offsetHeight }) {
    const position = {};

    if (this._isPicklist) {
      domStyle.set(this.modalNode, {
        width: offsetWidth + 'px',
      });
    }

    switch (this.positioning) {
      case 'right':
        position.top = offsetTop + offsetHeight;
        position.left = offsetLeft - this.modalNode.offsetWidth + offsetWidth;
      break;
      case 'left':
        position.top = offsetTop + offsetHeight;
        position.left = offsetRight + this.modalNode.offsetWidth - offsetWidth;
      break;
      case 'center':
        position.top = (this._parentNode.offsetHeight / 2) + this._parentNode.scrollTop - (this.modalNode.offsetHeight / 2);
        position.left = this._parentNode.offsetWidth / 2 - this.modalNode.offsetWidth / 2;
      break;
      default:
        position.top = (this._parentNode.offsetHeight / 2) + this._parentNode.scrollTop - (this.modalNode.offsetHeight / 2);
        position.left = this._parentNode.offsetWidth / 2 - this.modalNode.offsetWidth / 2;
    }

    if (position.top + this.modalNode.offsetHeight >= this._parentNode.scrollHeight) {
      position.top = position.top - this.modalNode.offsetHeight - offsetHeight;
    }
    if (position.top < 0) {
      position.top = this._parentNode.offsetTop / 2;
      domStyle.set(this.modalNode, {
        maxHeight: this._parentNode.offsetHeight - this._parentNode.offsetTop + 'px',
      });
    }

    domStyle.set(this.modalNode, {
      maxWidth: this._parentNode.offsetWidth + 'px',
      top: position.top + 'px',
      left: position.left + 'px',
      visibility: 'visible',
    });
    return this;
  },
  clickModal: function clickModal() {
    event.preventDefault();
  },
  confirm: function confirm() {
    const data = [];
    array.forEach(this._content, function getData(content) {
      if (content) {
        data.push(content.getContent());
      }
    }, this);
    connect.publish('/app/Modal/confirm', data);
    this.hideModal();
    return this;
  },
  emptyModal: function emptyModal() {
    domConstruct.empty(this.modalNode);
    return this;
  },
  hideModal: function hideModal(params = {}) {
    if (params && params.target && params.target.offsetParent === this.modalNode) {
      return this;
    }

    this.toggleBackdrop()
        .toggleParentScroll();
    domStyle.set(this.modalNode, {
      visibility: 'hidden',
    });
    if (this._parentListener) {
      this._parentListener.remove();
    }
    event.preventDefault();
    return this;
  },
  noBackdrop: function noBackDrop() {
    this.showBackdrop = false;
    return this;
  },
  placeBackdrop: function placeBackdrop(parentPanel = {}) {
    if (this.showBackdrop) {
      const existingBackdrop = query('.modal-backdrop', parentPanel)[0];
      if (!existingBackdrop) {
        this._backdrop = domConstruct.toDom(this.modalBackdropTemplate.apply({ parentHeight: parentPanel.scrollHeight + 'px' }));
        domStyle.set(this._backdrop, {
          visbility: 'hidden',
        });
        domConstruct.place(this._backdrop, parentPanel);
        // connect.connect(this._backdrop, 'onclick', this, this.hideModal);
      }
    }
    return this;
  },
  placeModal: function placeModal(parentPanel = {}) {
    this._parentNode = parentPanel;
    this.placeBackdrop(parentPanel);
    this._orientation = connect.subscribe('/app/setOrientation', this, this.hideModal);
    domConstruct.place(this.modalNode, parentPanel);
    return this;
  },
  setContent: function setContent(content = {}) {
    this._content = content;
    return this;
  },
  setContentObject: function setContentObject(object = {}) {
    this._contentObject = object;
    domConstruct.place(object.domNode, this.modalNode);
    if (this.showToolbar) {
      const modalToolbar = domConstruct.toDom(this.modalToolbarTemplate.apply(this));
      const cancelButton = domConstruct.toDom(this.buttonTemplate.apply({ text: this.cancelText }));
      connect.connect(cancelButton, 'onclick', this, this.hideModal);
      domConstruct.place(cancelButton, modalToolbar);
      const confirmButton = domConstruct.toDom(this.buttonTemplate.apply({ text: this.confirmText }));
      connect.connect(confirmButton, 'onclick', this, this.confirm);
      domConstruct.place(confirmButton, modalToolbar);
      domConstruct.place(modalToolbar, this.modalNode);
    }
    return this;
  },
  setContentOptions: function setContentOptions(options = {}) {
    this._contentOptions = options;
    return this;
  },
  setContentPicklist: function setContentPicklist({items, action, actionScope}) {
    const pickListStart = domConstruct.toDom(this.pickListStartTemplate.apply());
    const pickListEnd = domConstruct.toDom(this.pickListEndTemplate.apply());

    array.forEach(items, function addToModalList(item) {
      domConstruct.place(this.pickListItemTemplate.apply({item: item, action: action}, actionScope), pickListStart);
    }, this);
    domConstruct.place(pickListEnd, pickListStart);
    domConstruct.place(pickListStart, this.modalNode);
    this._contentObject = pickListStart;
    this._isPicklist = true;
    domStyle.set(this.modalNode, {
      padding: 0,
      overflow: 'hidden',
    });

    return this;
  },
  setParentListener: function setParentListener() {
    this._parentListener = connect.connect(this._parentNode, 'onclick', this, this.hideModal);
    return this;
  },
  showContent: function showContent(options = {}) {
    if (this._contentObject.show) {
      this._contentObject.show(this._contentOptions || options);
      if (this._contentObject.getContent) {
        this.setContent(this._contentObject.getContent());
      }
    }
    return this;
  },
  showModal: function showModal(target = {}) {
    if (this._parentNode) {
      this.showContent()
          .toggleBackdrop()
          .toggleParentScroll()
          .setParentListener()
          .calculatePosition(target);
    }
    return this;
  },
  toggleBackdrop: function toggleBackdrop() {
    if (this.showBackdrop) {
      if (this._backdrop) {
        if (domStyle.get(this._backdrop, 'visibility') === 'hidden') {
          domStyle.set(this._backdrop, {
            visibility: 'visible',
          });
        } else {
          domStyle.set(this._backdrop, {
            visibility: 'hidden',
          });
        }
      }
    }
    return this;
  },
  toggleModal: function toggleModal(target = {}) {
    if (domStyle.get(this.modalNode, 'visibility') === 'visible') {
      this.hideModal();
    } else {
      this.showModal(target);
    }
    return this;
  },
  toggleParentScroll: function toggleParentScroll() {
    if (this.positioning === 'center') {
      if (domStyle.get(this._parentNode, 'overflow') === 'hidden') {
        domStyle.set(this._parentNode, {
          overflow: '',
        });
      } else {
        domStyle.set(this._parentNode, {
          overflow: 'hidden',
        });
      }
    }
    return this;
  },
});

lang.setObject('Sage.Platform.Mobile.Modal', __class);
export default __class;
