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
 * @class argos.Toast
 * @alternateClassName Global Pop-up
 */
import declare from 'dojo/_base/declare';
import fx from 'dojo/_base/fx';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import domStyle from 'dojo/dom-style';
import query from 'dojo/query';
import _Widget from 'dijit/_Widget';
import _Templated from 'argos/_Templated';
import Modal from 'argos/Modal';

const __class = declare('argos.Toast', [_Widget, _Templated, Modal], {
  toastTemplate: new Simplate([
    '<button class="toast__btn-close fa fa-times"></button>',
    '<span class="toast__title">',
      '{%= $.title %}',
    '</span>',
    '<span class="toast__message">',
      '{%= $.message %}',
    '</span>',
    '{% if ($.showProgressBar) { %}',
      '<div class="toast__progressBar"></div>',
    '{% } %}',
  ]),
  id: 'toast',
  title: 'Title',
  message: 'This is a toast',
  // Time toast will be displayed (in milliseconds)
  toastTime: 6000,
  barSize: 100,
  positioning: 'toast--top-right',
  showProgressBar: true,
  _progressBar: null,

  animateBar: function animateBar() {
    if (this._progressBar) {
      fx.animateProperty({
        node: this._progressBar,
        properties: {
          width: 0,
        },
        duration: this.toastTime,
      }).play();
    }
    return this;
  },
  applyPositioning: function applyPositioning() {
    switch (this.positioning) {
      case 'toast--top-right':
      case 'toast--top-left':
      case 'toast--bottom-right':
      case 'toast--bottom-left':
        domClass.add(this.modalNode, this.positioning);
        break;
      default:
        domClass.add(this.modalNode, 'toast--top-right');
    }
    return this;
  },
  calculatePosition: function calculatePosition() {
    domClass.remove(this.modalNode, 'panel');
    domClass.add(this.modalNode, 'toast');
    this.applyPositioning();
    return this;
  },
  hideToast: function hideToast() {
    domStyle.set(this._progressBar, {
      width: 0,
    });
    domStyle.set(this.modalNode, {
      visibility: 'hidden',
    });
    setTimeout(this.destroy.bind(this), 200);
    return this;
  },
  modalClick: function modalClick({ target }) {
    if (target === query('.toast__btn-close', this.modalNode)[0]) {
      this.inherited(arguments);
      this.hideToast();
    }
    return this;
  },
  placeModal: function placeModal(parentPanel = {}) {
    this._parentNode = parentPanel;
    domConstruct.place(this.modalNode, this._parentNode);
    return this;
  },
  setTimer: function setTimer() {
    this.animateBar();
    setTimeout(this.hideToast.bind(this), this.toastTime);
    return this;
  },
  show: function show() {
    const body = query('body')[0];
    if (body) {
      const toasty = domConstruct.toDom(this.toastTemplate.apply(this));
      if (this.showProgressBar) {
        this._progressBar = query('.toast__progressBar', toasty)[0];
      }
      domConstruct.place(toasty, this.modalNode);
      this.placeModal(App.getPrimaryActiveView().ownerDocumentBody)
          .setContent(toasty)
          .calculatePosition()
          .attachEventListener()
          .setTimer();
    }
  },
  showModal: function showModal() {
    this.show();
  },
});

export default __class;
