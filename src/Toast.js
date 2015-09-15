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
import array from 'dojo/_base/array';
import connect from 'dojo/_base/connect';
import declare from 'dojo/_base/declare';
import fx from 'dojo/_base/fx';
import domAttr from 'dojo/dom-attr';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import query from 'dojo/query';
import _Widget from 'dijit/_Widget';
import _Templated from './_Templated';
import Modal from './Modal';

const __class = declare('argos.Toast', [_Widget, _Templated, Modal], {
  toastTemplate: new Simplate([
    '<div class="toast effect-scale">',
      '<button class="toast__btn-close fa fa-times"></button>',
      '<div class="toast__icon {%= $.icon %}" focusable="false" aria-hidden="true"></div>',
      '<span class="toast__title">',
        '{%= $.title %}',
      '</span>',
      '<span class="toast__message">',
        '{%= $.message %}',
      '</span>',
      '{% if ($.showProgressBar) { %}',
        '<div class="toast__progressBar"></div>',
      '{% } %}',
    '</div>',
  ]),
  id: 'toast',
  title: 'Title',
  message: 'This is a toast',
  icon: '',
  // Time toast will be displayed (in milliseconds)
  toastTime: 6000,
  barSize: 100,
  positioning: 'toast--top-right',
  showProgressBar: true,
  disableParentScroll: false,
  _progressBar: null,
  _toasts: [],
  _timeouts: [],
  _connections: [],

  addToast: function addToast(options = {}) {
    this.title = options.title || this.title;
    this.message = options.message || this.message;
    this.icon = options.icon || this.icon;
    this.toastTime = options.toastTime || this.toastTime;
    this.barSize = options.barSize || this.barSize;
    this.showProgressBar = options.showProgressBar || this.showProgressBar;
    const toasty = domConstruct.toDom(this.toastTemplate.apply(this));
    if (this.showProgressBar) {
      toasty._progressBar = query('.toast__progressBar', toasty)[0];
    }
    domConstruct.place(toasty, this.modalNode);
    this._toasts.push(toasty);
    this._connections.push(connect.connect(query('.toast__btn-close', toasty)[0], 'onclick', this, this.closeButton));
    this.setTimer(toasty);
  },
  animateBar: function animateBar(toast = {}) {
    if (toast._progressBar) {
      fx.animateProperty({
        node: toast._progressBar,
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
    domClass.add(this.modalNode, 'toast__queue');
    domAttr.set(this.modalNode, 'aria-relevant', 'additions');
    domAttr.set(this.modalNode, 'aria-live', 'polite');
    this.applyPositioning();
    return this;
  },
  closeButton: function closeButton({ target }) {
    const indexOf = array.indexOf(this._toasts, target.offsetParent);
    if (indexOf > -1) {
      const toast = this._toasts.splice(indexOf, 1)[0];
      clearTimeout(this._timeouts.shift());
      connect.disconnect(this._connections.splice(indexOf, 1)[0]);
      this.hideToast(toast);
    }
  },
  destroyToast: function destroyToast() {
    domConstruct.destroy(this);
  },
  hide: function hide() {
    this.hideModal();
  },
  hideToast: function hideToast(toast = {}) {
    if (toast) {
      domClass.add(toast, 'effect-scale-hide');
      setTimeout(this.destroyToast.bind(toast), 500);
    }
    return this;
  },
  hideToastTimeout: function hideToastTimeout() {
    clearTimeout(this._timeouts.shift());
    const toast = this._toasts.shift();
    connect.disconnect(this._connections.shift());
    this.hideToast(toast);
  },
  placeModal: function placeModal(parentPanel = {}) {
    this._parentNode = parentPanel;
    domConstruct.place(this.modalNode, this._parentNode);
    return this;
  },
  setTimer: function setTimer(toast = {}) {
    this.animateBar(toast);
    this._timeouts.push(setTimeout(this.hideToastTimeout.bind(this), this.toastTime));
    return this;
  },
  show: function show() {
    const body = query('body')[0];
    if (body) {
      if (!this._parentNode) {
        this.placeModal(body);
      }
      this.setContent(this.toasts)
          .calculatePosition();
    }
  },
  showModal: function showModal() {
    this.show();
  },
});

export default __class;
