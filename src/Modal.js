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
import connect from 'dojo/_base/connect';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import domProp from 'dojo/dom-prop';
import domStyle from 'dojo/dom-style';
import query from 'dojo/query';
import _Widget from 'dijit/_Widget';
import _Templated from 'argos/_Templated';

const __class = declare('argos.Modal', [_Widget, _Templated], {
  widgetTemplate: new Simplate([
    '<div id="{%= $.id %}" class="modal panel" data-dojo-attach-point="modalNode">',
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
    '<li class="listItem" data-value="{%= $.item %}">',
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
  _picklistSelected: null,
  _cancelButton: null,
  _eventConnections: [], // TODO: Clear connections upon modal destroy
  showBackdrop: true,
  showToolbar: true,
  positioning: 'center',

  cancelText: 'Cancel',
  confirmText: 'Confirm',

  calculatePosition: function calculatePosition({ offsetTop, offsetLeft, offsetWidth, offsetHeight }) {
    const position = {};

    if (this._isPicklist) {
      // This call needs to take place before positioning so that the width of the modal is accounted for
      domStyle.set(this.modalNode, {
        minWidth: offsetWidth + 'px',
        overflow: 'hidden',
      });
      position.border = domStyle.get(this._contentObject, 'borderWidth');
    }

    switch (this.positioning) {
      case 'right':
        position.top = offsetTop + offsetHeight;
        position.left = offsetLeft - (this.modalNode.offsetWidth - offsetWidth) - position.border;
      break;
      case 'left':
        position.top = offsetTop + offsetHeight;
        position.left = offsetLeft - position.border;
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
    if (position.top < this._parentNode.scrollTop) {
      position.top = this._parentNode.offsetTop / 2 + this._parentNode.scrollTop;
      domStyle.set(this.modalNode, {
        maxHeight: this._parentNode.offsetHeight - this._parentNode.offsetTop + 'px',
        overflowY: 'scroll',
      });
    }

    if (this._isPicklist) {
      if (position.top > offsetTop) {
        domStyle.set(this._contentObject, {
          borderTop: '0',
        });
      } else {
        domStyle.set(this._contentObject, {
          borderBottom: '0',
        });
      }
    }

    domStyle.set(this.modalNode, {
      maxWidth: this._parentNode.offsetWidth + 'px',
      top: position.top + 'px',
      left: position.left + 'px',
      visibility: 'visible',
      zIndex: domStyle.get(this._parentNode, 'zIndex') + 10,
    });
    return this;
  },
  confirm: function confirm() {
    const data = {};
    array.forEach(this._content, function getData(content) {
      if (content) {
        data[content.id] = content.getContent();
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
  getContent: function getContent() {
    return this._contentObject;
  },
  getSelected: function getSelected() {
    return this._picklistSelected;
  },
  hideModal: function hideModal(params = {}) {
    if (domStyle.get(this.modalNode, 'visibility') === 'visible') {
      if (params && params.target && params.target !== this._cancelButton && params.target.offsetParent === this.modalNode) {
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
    }
    return this;
  },
  noBackdrop: function noBackDrop() {
    this.showBackdrop = false;
    return this;
  },
  placeBackdrop: function placeBackdrop(parentPanel = {}) {
    const existingBackdrop = query('.modal-backdrop', parentPanel)[0];
    if (!existingBackdrop) {
      this._backdrop = domConstruct.toDom(this.modalBackdropTemplate.apply({ parentHeight: parentPanel.scrollHeight + 'px' }));
      if (!this.showBackdrop) {
        domStyle.set(this._backdrop, {
          backgroundColor: 'transparent',
        });
      }
      const parentZValue = domStyle.get(parentPanel, 'zIndex');
      domStyle.set(this._backdrop, {
        visbility: 'hidden',
        zIndex: parentZValue + 10,
      });
      domConstruct.place(this._backdrop, parentPanel);
      this._eventConnections.push(connect.connect(this._backdrop, 'onclick', this, this.hideModal));
    } else {
      this._backdrop = existingBackdrop;
      this._eventConnections.push(connect.connect(this._backdrop, 'onclick', this, this.hideModal));
    }
    return this;
  },
  placeModal: function placeModal(parentPanel = {}) {
    this._parentNode = parentPanel;
    if (parentPanel._parentNode) {
      this._parentNode = parentPanel._parentNode;
    }
    this.placeBackdrop(parentPanel);
    this._orientation = this._eventConnections.push(connect.subscribe('/app/setOrientation', this, this.hideModal));
    domConstruct.place(this.modalNode, parentPanel);
    return this;
  },
  refreshOverflow: function refreshOverflow() {
    domStyle.set(this.modalNode, {
      overflow: 'scroll',
    });
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
      this._cancelButton = cancelButton;
      this._eventConnections.push(connect.connect(cancelButton, 'onclick', this, this.hideModal));
      domConstruct.place(cancelButton, modalToolbar);
      const confirmButton = domConstruct.toDom(this.buttonTemplate.apply({ text: this.confirmText }));
      this._eventConnections.push(connect.connect(confirmButton, 'onclick', this, this.confirm));
      domConstruct.place(confirmButton, modalToolbar);
      domConstruct.place(modalToolbar, this.modalNode);
    }
    return this;
  },
  setContentOptions: function setContentOptions(options = {}) {
    this._contentOptions = options;
    return this;
  },
  setContentPicklist: function setContentPicklist({items, action, actionScope, defaultValue}) {
    const pickListStart = domConstruct.toDom(this.pickListStartTemplate.apply());
    const pickListEnd = domConstruct.toDom(this.pickListEndTemplate.apply());

    array.forEach(items, function addToModalList(item) {
      const dom = domConstruct.toDom(this.pickListItemTemplate.apply({item: item}, this));
      domConstruct.place(dom, pickListStart);
      if (item.toString() === defaultValue) {
        this._picklistSelected = dom;
        domClass.add(dom, 'selected');
      }
    }, this);
    domConstruct.place(pickListEnd, pickListStart);
    domConstruct.place(pickListStart, this.modalNode);
    this._contentObject = pickListStart;
    this._isPicklist = true;
    domStyle.set(this.modalNode, {
      padding: 0,
      overflow: 'hidden',
    });
    if (this._picklistSelected) {
      domProp.set(pickListStart, 'scrollTop', domProp.get(this._picklistSelected, 'offsetTop'));
    }
    this._eventConnections.push(connect.connect(pickListStart, 'onclick', actionScope, actionScope[action]));

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
    if (domStyle.get(this._parentNode, 'overflow') === 'hidden') {
      domStyle.set(this._parentNode, {
        overflow: '',
      });
    } else {
      domStyle.set(this._parentNode, {
        overflow: 'hidden',
      });
    }
    return this;
  },
});

export default __class;
