define('argos/Dialogs/Modal', ['module', 'exports', 'dojo/_base/declare', 'dojo/Deferred', 'dijit/_WidgetBase', '../_Templated', '../I18n'], function (module, exports, _declare, _Deferred, _WidgetBase2, _Templated2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Deferred2 = _interopRequireDefault(_Deferred);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('modal');

  /**
   * @class
   * @alias module:argos/Dialogs/Modal
   * @extends module:argos/_Templated
   */
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
   * @module argos/Dialogs/Modal
   */
  var __class = (0, _declare2.default)('argos.Dialogs.Modal', [_WidgetBase3.default, _Templated3.default], /** @lends module:argos/Dialogs/Modal.prototype */{
    widgetTemplate: new Simplate(['<div class="modal__container" data-dojo-attach-point="modalContainer">', '{%! $.modalTemplate %}', '{%! $.modalOverlayTemplate %}', '</div>']),
    dialogContentTemplate: new Simplate(['<div class="modal__header__title">{%: $.title %}</div>', '<p class="modal__content__text">{%: $.content %}</p>']),
    modalContentTemplate: new Simplate(['<div class="modal__content">', '</div>']),
    modalTemplate: new Simplate(['<div id="{%= $.id %}" class="crm-modal panel" data-dojo-attach-point="modalNode">', '</div>']),
    modalToolbarTemplate: new Simplate(['<div class="modal__toolbar">', '</div>']),
    modalOverlayTemplate: new Simplate(['<div class="modal__overlay modal__overlay--hidden" data-dojo-attach-point="overlay">', '</div>']),
    /**
     * Simplate that returns a button
     * @param class: css class to be applied to the div
     * @param text: string for the button
     * @param action: string representing the function that the button will call
     * @param context: the context of the action
     */
    buttonTemplate: new Simplate(['<div class="button {%= $.className %}">{%= $.text %}</div>']),

    id: 'modal-template',
    _actionListeners: null,
    _bodyOverflow: null,
    _content: null,
    _history: [],
    defaultHeaderText: {
      alert: resource.alertText,
      complete: resource.completeText,
      edit: resource.editText,
      warning: resource.warningText
    },
    defaultToolbarActions: {
      cancel: function cancel() {
        return this.hide;
      },
      resolve: function resolve() {
        return this.resolveDeferred;
      }
    },
    defaultToolbarText: {
      cancel: resource.cancelText,
      confirm: resource.confirmText,
      okay: resource.okayText,
      submit: resource.submitText
    },
    disableClose: false,
    historyLength: 5,
    lockScroll: true,
    trackHistory: true,
    showToolbar: true,
    showOverlay: true,

    constructor: function constructor() {
      this._actionListeners = [];
    },
    _lockScroll: function _lockScroll() {
      if (this.lockScroll) {
        this._bodyOverflow = $(document.body).css('overflow');
        $(document.body).css('overflow', 'hidden');
      }
      return this;
    },
    _unlockScroll: function _unlockScroll() {
      $(document.body).css('overflow', this._bodyOverflow || '');
    },
    /**
     * Used to change the content of the modal node (aka what is displayed)
     * Modals can only show one at a time and will be centered on the screen
     * @param content: object representing the current content of the modal
     * @param toolbarActions: array of actions to make up the modal toolbar using buttonTemplate.
     * In order to get the promise data you must pass an item with action 'resolve'
     * To hide the modal pass a toolbar item with action 'cancel'
    */
    add: function add() {
      var content = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var toolbarActions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];
      var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      content._deferred = new _Deferred2.default();
      if (toolbarActions.length) {
        this.showToolbar = true;
      } else {
        this.showToolbar = false;
      }
      this.pushHistory(this._content).setContent(content).showContent(options).createModalToolbar(toolbarActions)._lockScroll().show();
      content._deferred.then(this.hide.bind(this));
      return content._deferred.promise;
    },
    attachContainerListener: function attachContainerListener() {
      this.removeContainerListener();
      $(this.modalContainer).on('click', this.onContainerClick.bind(this));
      return this;
    },
    createModalToolbar: function createModalToolbar() {
      var _this = this;

      var toolbarActions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      if (this.showToolbar) {
        var toolbar = $(this.modalToolbarTemplate.apply(this));
        toolbarActions.forEach(function (toolbarItem) {
          if (_this.defaultToolbarActions[toolbarItem.action]) {
            toolbarItem.action = _this.defaultToolbarActions[toolbarItem.action].bind(_this)();
            toolbarItem.context = _this;
          }
          var item = $(_this.buttonTemplate.apply(toolbarItem, _this));
          $(item).on('click', toolbarItem.action.bind(toolbarItem.context));
          _this._actionListeners.push($(item));
          $(toolbar).append(item);
        });
        $(this.modalNode).append(toolbar);
      }
      return this;
    },
    createSimpleAlert: function createSimpleAlert() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var dialog = {
        title: this.defaultHeaderText[options.title] || options.title,
        content: options.content,
        getContent: options.getContent
      };
      var toolbar = [{
        action: 'resolve',
        className: 'button--flat button--flat--split',
        text: resource.okayText
      }];
      return this.add(dialog, toolbar);
    },
    createSimpleDialog: function createSimpleDialog() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      var dialog = {
        title: this.defaultHeaderText[options.title] || options.title,
        content: options.content,
        getContent: options.getContent
      };
      var toolbar = [{
        action: 'cancel',
        className: 'button--flat button--flat--split',
        text: this.defaultToolbarText[options.leftButton] || resource.cancelText
      }, {
        action: 'resolve',
        className: 'button--flat button--flat--split',
        text: this.defaultToolbarText[options.rightButton] || resource.okayText
      }];
      return this.add(dialog, toolbar);
    },
    getHistory: function getHistory() {
      return this._history;
    },
    /**
     * Hide the modalContainer to avoid capturing events
    */
    hide: function hide() {
      if (!this.disableClose) {
        this.removeContainerListener().removeActionListeners()._unlockScroll();
        if (this._content && this._content.destroy) {
          this._content.destroy();
        }
        if (this.showToolbar) {
          $(this.modalNode).empty();
          this.removeActionListeners();
        }
        $(this.modalContainer).addClass('modal__container--hidden');
        if (this.showOverlay) {
          $(this.overlay).addClass('modal__overlay--hidden');
          $(this.modalNode).removeClass('is-visible');
        }
      }
      return this;
    },
    isNotSimpleDialog: function isNotSimpleDialog() {
      if (this._content.domNode) {
        return true;
      }
      return false;
    },
    onContainerClick: function onContainerClick(evt) {
      if (evt.srcElement === this.modalContainer || evt.srcElement === this.overlay) {
        this.hide();
      }
    },
    place: function place(parent) {
      if (parent) {
        $(parent).append(this.modalContainer);
      }
      return this;
    },
    popHistory: function popHistory() {
      return this._history.pop();
    },
    pushHistory: function pushHistory(content) {
      if (content && this._history.length < this.historyLength) {
        this._history.push(content);
      } else {
        this._history.shift();
        this._history.push(content);
      }
      return this;
    },
    removeContainerListener: function removeContainerListener() {
      $(this.modalContainer).off('click');
      return this;
    },
    removeActionListeners: function removeActionListeners() {
      if (this._actionListeners) {
        this._actionListeners.forEach(function (listener) {
          listener.off();
        });

        this._actionListeners = [];
      }
      return this;
    },
    resolveDeferred: function resolveDeferred() {
      var data = {};
      if (this._content && this._content.getContent) {
        data = this._content.getContent();
      } else {
        if (this.isNotSimpleDialog()) {
          console.log('Modal content does not have a getContent function call to retrieve the data, add this to allow data to be returned'); // eslint-disable-line
        }
      }
      this._content._deferred.resolve(data);
      return this;
    },
    setContent: function setContent(content) {
      if (content) {
        this._content = content;
        content._modalNode = this;
      }
      return this;
    },
    show: function show() {
      this.attachContainerListener();
      $(this.modalContainer).removeClass('modal__container--hidden');
      if (this.showOverlay) {
        $(this.overlay).removeClass('modal__overlay--hidden');
        $(this.modalNode).addClass('is-visible');
      }
      return this;
    },
    showContent: function showContent() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      if (this._content && this._content.show) {
        this._content.show(options);
        var content = $(this.modalContentTemplate.apply(this));
        $(content).append(this._content.domNode || this._content);
        $(this.modalNode).append(content);
      } else {
        if (this.isNotSimpleDialog()) {
          console.log('Current modal content does not have a show function, did you forget to add this?'); // eslint-disable-line
        } else {
          var _content = $(this.modalContentTemplate.apply(this));
          var simpleDialog = $(this.dialogContentTemplate.apply(this._content, this));
          $(_content).append(simpleDialog);
          $(this.modalNode).append(_content);
        }
      }
      return this;
    },
    updateZIndex: function updateZIndex(above) {
      if (above) {
        var value = $(above).css('zIndex');
        if (!value || value === 'auto') {
          value = 0;
        }
        $(this.modalContainer).css('zIndex', value);
        $(this.modalNode).css('zIndex', value + 1);
        return this;
      }
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});