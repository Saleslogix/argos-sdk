import declare from 'dojo/_base/declare';
import Deferred from 'dojo/Deferred';
import _WidgetBase from 'dijit/_WidgetBase';
import _Templated from '../_Templated';
import getResource from '../I18n';


const resource = getResource('modal');

/**
 * @class argos.Dialogs.Modal
 * @alternateClassName Pop-up
 */
const __class = declare('argos.Dialogs.Modal', [_WidgetBase, _Templated], {
  widgetTemplate: new Simplate([
    '<div class="modal__container" data-dojo-attach-point="modalContainer">',
    '{%! $.modalTemplate %}',
    '{%! $.modalOverlayTemplate %}',
    '</div>',
  ]),
  dialogContentTemplate: new Simplate([
    '<div class="modal__header__title">{%: $.title %}</div>',
    '<p class="modal__content__text">{%: $.content %}</p>',
  ]),
  modalContentTemplate: new Simplate([
    '<div class="modal__content">',
    '</div>',
  ]),
  modalTemplate: new Simplate([
    '<div id="{%= $.id %}" class="crm-modal panel" data-dojo-attach-point="modalNode">',
    '</div>',
  ]),
  modalToolbarTemplate: new Simplate([
    '<div class="modal__toolbar">',
    '</div>',
  ]),
  modalOverlayTemplate: new Simplate([
    '<div class="modal__overlay modal__overlay--hidden" data-dojo-attach-point="overlay">',
    '</div>',
  ]),
  /**
   * Simplate that returns a button
   * @param class: css class to be applied to the div
   * @param text: string for the button
   * @param action: string representing the function that the button will call
   * @param context: the context of the action
   */
  buttonTemplate: new Simplate([
    '<div class="button {%= $.className %}">{%= $.text %}</div>',
  ]),

  id: 'modal-template',
  _actionListeners: null,
  _bodyOverflow: null,
  _content: null,
  _history: [],
  defaultHeaderText: {
    alert: resource.alertText,
    complete: resource.completeText,
    edit: resource.editText,
    warning: resource.warningText,
  },
  defaultToolbarActions: {
    cancel: function cancel() { return this.hide; },
    resolve: function resolve() { return this.resolveDeferred; },
  },
  defaultToolbarText: {
    cancel: resource.cancelText,
    confirm: resource.confirmText,
    okay: resource.okayText,
    submit: resource.submitText,
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
  add: function add(content = {}, toolbarActions = [], options = {}) {
    content._deferred = new Deferred();
    if (toolbarActions.length) {
      this.showToolbar = true;
    } else {
      this.showToolbar = false;
    }
    this.pushHistory(this._content)
        .setContent(content)
        .showContent(options)
        .createModalToolbar(toolbarActions)
        ._lockScroll()
        .show();
    content._deferred.then(this.hide.bind(this));
    return content._deferred.promise;
  },
  attachContainerListener: function attachContainerListener() {
    this.removeContainerListener();
    $(this.modalContainer).on('click', this.onContainerClick.bind(this));
    return this;
  },
  createModalToolbar: function createModalToolbar(toolbarActions = []) {
    if (this.showToolbar) {
      const toolbar = $(this.modalToolbarTemplate.apply(this));
      toolbarActions.forEach((toolbarItem) => {
        if (this.defaultToolbarActions[toolbarItem.action]) {
          toolbarItem.action = this.defaultToolbarActions[toolbarItem.action].bind(this)();
          toolbarItem.context = this;
        }
        const item = $(this.buttonTemplate.apply(toolbarItem, this));
        $(item).on('click', toolbarItem.action.bind(toolbarItem.context));
        this._actionListeners.push($(item));
        $(toolbar).append(item);
      });
      $(this.modalNode).append(toolbar);
    }
    return this;
  },
  createSimpleAlert: function createSimpleAlert(options = {}) {
    const dialog = {
      title: this.defaultHeaderText[options.title] || options.title,
      content: options.content,
      getContent: options.getContent,
    };
    const toolbar = [{
      action: 'resolve',
      className: 'button--flat button--flat--split',
      text: resource.okayText,
    }];
    return this.add(dialog, toolbar);
  },
  createSimpleDialog: function createSimpleDialog(options = {}) {
    const dialog = {
      title: this.defaultHeaderText[options.title] || options.title,
      content: options.content,
      getContent: options.getContent,
    };
    const toolbar = [
      {
        action: 'cancel',
        className: 'button--flat button--flat--split',
        text: this.defaultToolbarText[options.leftButton] || resource.cancelText,
      }, {
        action: 'resolve',
        className: 'button--flat button--flat--split',
        text: this.defaultToolbarText[options.rightButton] || resource.okayText,
      },
    ];
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
      this.removeContainerListener()
          .removeActionListeners()
          ._unlockScroll();
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
      this._actionListeners.forEach((listener) => {
        listener.off();
      });

      this._actionListeners = [];
    }
    return this;
  },
  resolveDeferred: function resolveDeferred() {
    let data = {};
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
  showContent: function showContent(options = {}) {
    if (this._content && this._content.show) {
      this._content.show(options);
      const content = $(this.modalContentTemplate.apply(this));
      $(content).append(this._content.domNode || this._content);
      $(this.modalNode).append(content);
    } else {
      if (this.isNotSimpleDialog()) {
        console.log('Current modal content does not have a show function, did you forget to add this?'); // eslint-disable-line
      } else {
        const content = $(this.modalContentTemplate.apply(this));
        const simpleDialog = $(this.dialogContentTemplate.apply(this._content, this));
        $(content).append(simpleDialog);
        $(this.modalNode).append(content);
      }
    }
    return this;
  },
  updateZIndex: function updateZIndex(above) {
    if (above) {
      let value = $(above).css('zIndex');
      if (!value || value === 'auto') {
        value = 0;
      }
      $(this.modalContainer).css('zIndex', value);
      $(this.modalNode).css('zIndex', value + 1);
      return this;
    }
  },
});

export default __class;
