import array from 'dojo/_base/array';
import connect from 'dojo/_base/connect';
import declare from 'dojo/_base/declare';
import fx from 'dojo/_base/fx';
import domAttr from 'dojo/dom-attr';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import on from 'dojo/on';
import query from 'dojo/query';
import _Widget from 'dijit/_Widget';
import _Templated from '../_Templated';
import Modal from './Modal';

/**
 * @class argos.Dialogs.Toast
 * @alternateClassName Global Pop-up
 */
const __class = declare('argos.Dialogs.Toast', [_Widget, _Templated, Modal], {
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
  message: 'Message',
  icon: '',
  historyLength: 50,
  // Time toast will be displayed (in milliseconds)
  toastTime: 6000,
  barSize: 100,
  _containerPosition: {
    right: function positionRight() {
      domClass.add(this.modalContainer, 'toast__container--right');
      domClass.add(this.modalNode, 'toast__queue--right');
    },
    left: function positionLeft() {
      domClass.add(this.modalContainer, 'toast__container--left');
      domClass.add(this.modalNode, 'toast__queue--left');
    },
  },
  containerPosition: 'right',
  showProgressBar: true,
  showOverlay: false,
  disableParentScroll: false,
  _progressBar: null,
  _toasts: [],
  _timeouts: [],
  _connections: [],

  add: function add(options = {}) {
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
    this.pushHistory(toasty);
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
    if (this._containerPosition[this.containerPosition]) {
      this._containerPosition[this.containerPosition].bind(this)();
    }
    return this;
  },
  calculatePosition: function calculatePosition() {
    domClass.remove(this.modalNode, 'panel');
    domClass.add(this.modalContainer, 'toast__container');
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
  onContainerClick: function onContainerClick(evt) {
    if (!evt || !evt.path) {
      return;
    }

    on.emit(evt.path[1], 'click', { // evt.path[1] used to pass event to the toasts
      bubbles: true,
      cancelable: true,
    });
  },
  setTimer: function setTimer(toast = {}) {
    this.animateBar(toast);
    this._timeouts.push(setTimeout(this.hideToastTimeout.bind(this), this.toastTime));
    return this;
  },
  show: function show() {
    this.inherited(arguments);
    this.place(document.body)
        .setContent(this.toasts)
        .calculatePosition();
  },
});

export default __class;
