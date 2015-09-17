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
 *  Destroy modal - Destroy
 */
import declare from 'dojo/_base/declare';
import array from 'dojo/_base/array';
import connect from 'dojo/_base/connect';
import Deferred from 'dojo/Deferred';
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
  _content: null,
  _contentObject: null,
  _backdrop: null,
  _isPicklist: false,
  _picklistSelected: null,
  _cancelButton: null,
  _modalConnection: null,
  _eventConnections: [], // TODO: Clear connections upon modal destroy
  _deferred: null,
  showBackdrop: true,
  showToolbar: true,
  disableParentScroll: true,
  closeAction: null,
  actionScope: null,
  positioning: '',

  cancelText: 'Cancel',
  confirmText: 'Confirm',

  attachEventListener: function attachEventListener() {
    this._modalConnection = connect.connect(this.modalNode, 'onclick', this, this.modalClick);
    return this;
  },
  calculatePosition: function calculatePosition({ offsetTop, offsetLeft, offsetWidth, offsetHeight }) {
    const position = {};

    if (this._isPicklist) {
      // This call needs to take place before positioning so that the width of the modal is accounted for
      domStyle.set(this.modalNode, {
        minWidth: offsetWidth + 'px',
      });
    }

    this.refreshModalSize();

    const parentHeight = domProp.get(this._parentNode, 'offsetHeight');
    const parentWidth = domProp.get(this._parentNode, 'offsetWidth');
    const parentScrollTop = domProp.get(this._parentNode, 'scrollTop');
    const parentScrollHeight = domProp.get(this._parentNode, 'scrollHeight');
    const modalHeight = domProp.get(this.modalNode, 'offsetHeight');
    const modalWidth = domProp.get(this.modalNode, 'offsetWidth');

    switch (this.positioning) {
      case 'right':
        position.top = offsetTop + offsetHeight;
        position.left = offsetLeft - modalWidth + offsetWidth;
      break;
      case 'left':
        position.top = offsetTop + offsetHeight;
        position.left = offsetLeft;
      break;
      case 'center':
        position.top = offsetTop + offsetHeight;
        position.left = offsetLeft + (offsetWidth - modalWidth) / 2;
      break;
      default:
        position.top = ((parentHeight - modalHeight) / 2) + parentScrollTop;
        position.left = (parentWidth - modalWidth) / 2;
    }

    if (position.top + modalHeight >= parentScrollHeight) {
      position.top = position.top - modalHeight - offsetHeight;
    }

    if (position.top < parentScrollTop) {
      position.top = parentScrollTop;
    }

    domStyle.set(this.modalNode, {
      maxWidth: parentWidth + 'px',
      top: position.top + 'px',
      left: position.left + 'px',
      zIndex: domStyle.get(this._parentNode, 'zIndex') + 10,
      maxHeight: parentHeight + 'px',
      visibility: 'visible',
      overflow: 'auto',
    });

    if (this._isPicklist) {
      if (this._picklistSelected) {
        domProp.set(this.getContent(), 'scrollTop', domProp.get(this._picklistSelected, 'offsetTop'));
      }
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

    return this;
  },
  confirm: function confirm() {
    const data = {};
    array.forEach(this._content, (content) => {
      data[content._widgetName] = content.getContent();
    }, this);
    this._deferred.resolve(data);
    this.hideModal();
    return this;
  },
  destroy: function destroy() {
    this.emptyModal();
    domConstruct.destroy(this.modalNode);
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
  hideChildModals: function hideChildModals() {
    if (this.getContent().hideChildModals) {
      this.getContent().hideChildModals();
    }
    return this;
  },
  hideModal: function hideModal(params = {}) {
    if (domStyle.get(this.modalNode, 'visibility') === 'visible') {
      if (params && params.target && params.target !== this._cancelButton && params.target.offsetParent === this.modalNode) {
        return this;
      }

      this.toggleBackdrop()
          .toggleParentScroll()
          .hideChildModals();
      domStyle.set(this.modalNode, {
        visibility: 'hidden',
      });
    }
    return this;
  },
  modalClick: function modalClick() {
    connect.disconnect(this._modalConnection);
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
    } else {
      this._backdrop = existingBackdrop;
    }
    if (this.actionScope && this.closeAction) {
      // If close action is specified use that action, otherwise default to closing the modal
      this._eventConnections.push(connect.connect(this._backdrop, 'onclick', this.actionScope, this.actionScope[this.closeAction]));
    } else {
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
  refreshModalSize: function refreshModalSize() {
    domStyle.set(this.modalNode, {
      width: 'auto',
      height: 'auto',
      maxHeight: '',
      maxWidth: '',
      top: '',
      left: '',
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
      this._deferred = new Deferred();
      this.showContent()
          .toggleBackdrop()
          .toggleParentScroll()
          .attachEventListener()
          .calculatePosition(target);
    }
    return this._deferred.promise;
  },
  toggleBackdrop: function toggleBackdrop() {
    if (this._backdrop) {
      if (domStyle.get(this._backdrop, 'visibility') === 'hidden') {
        domStyle.set(this._backdrop, {
          visibility: 'visible',
          height: domProp.get(this._parentNode, 'scrollHeight') + 'px',
          zIndex: domStyle.get(this._parentNode, 'zIndex') + 5,
        });
      } else {
        domStyle.set(this._backdrop, {
          visibility: 'hidden',
        });
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
    if (this.disableParentScroll) {
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

export default __class;
