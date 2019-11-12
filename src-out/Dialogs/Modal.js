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
   * @class argos.Dialogs.Modal
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

  var __class = (0, _declare2.default)('argos.Dialogs.Modal', [_WidgetBase3.default, _Templated3.default], /** @lends argos.Dialogs.Modal# */{
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9EaWFsb2dzL01vZGFsLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsIndpZGdldFRlbXBsYXRlIiwiU2ltcGxhdGUiLCJkaWFsb2dDb250ZW50VGVtcGxhdGUiLCJtb2RhbENvbnRlbnRUZW1wbGF0ZSIsIm1vZGFsVGVtcGxhdGUiLCJtb2RhbFRvb2xiYXJUZW1wbGF0ZSIsIm1vZGFsT3ZlcmxheVRlbXBsYXRlIiwiYnV0dG9uVGVtcGxhdGUiLCJpZCIsIl9hY3Rpb25MaXN0ZW5lcnMiLCJfYm9keU92ZXJmbG93IiwiX2NvbnRlbnQiLCJfaGlzdG9yeSIsImRlZmF1bHRIZWFkZXJUZXh0IiwiYWxlcnQiLCJhbGVydFRleHQiLCJjb21wbGV0ZSIsImNvbXBsZXRlVGV4dCIsImVkaXQiLCJlZGl0VGV4dCIsIndhcm5pbmciLCJ3YXJuaW5nVGV4dCIsImRlZmF1bHRUb29sYmFyQWN0aW9ucyIsImNhbmNlbCIsImhpZGUiLCJyZXNvbHZlIiwicmVzb2x2ZURlZmVycmVkIiwiZGVmYXVsdFRvb2xiYXJUZXh0IiwiY2FuY2VsVGV4dCIsImNvbmZpcm0iLCJjb25maXJtVGV4dCIsIm9rYXkiLCJva2F5VGV4dCIsInN1Ym1pdCIsInN1Ym1pdFRleHQiLCJkaXNhYmxlQ2xvc2UiLCJoaXN0b3J5TGVuZ3RoIiwibG9ja1Njcm9sbCIsInRyYWNrSGlzdG9yeSIsInNob3dUb29sYmFyIiwic2hvd092ZXJsYXkiLCJjb25zdHJ1Y3RvciIsIl9sb2NrU2Nyb2xsIiwiJCIsImRvY3VtZW50IiwiYm9keSIsImNzcyIsIl91bmxvY2tTY3JvbGwiLCJhZGQiLCJjb250ZW50IiwidG9vbGJhckFjdGlvbnMiLCJvcHRpb25zIiwiX2RlZmVycmVkIiwibGVuZ3RoIiwicHVzaEhpc3RvcnkiLCJzZXRDb250ZW50Iiwic2hvd0NvbnRlbnQiLCJjcmVhdGVNb2RhbFRvb2xiYXIiLCJzaG93IiwidGhlbiIsImJpbmQiLCJwcm9taXNlIiwiYXR0YWNoQ29udGFpbmVyTGlzdGVuZXIiLCJyZW1vdmVDb250YWluZXJMaXN0ZW5lciIsIm1vZGFsQ29udGFpbmVyIiwib24iLCJvbkNvbnRhaW5lckNsaWNrIiwidG9vbGJhciIsImFwcGx5IiwiZm9yRWFjaCIsInRvb2xiYXJJdGVtIiwiYWN0aW9uIiwiY29udGV4dCIsIml0ZW0iLCJwdXNoIiwiYXBwZW5kIiwibW9kYWxOb2RlIiwiY3JlYXRlU2ltcGxlQWxlcnQiLCJkaWFsb2ciLCJ0aXRsZSIsImdldENvbnRlbnQiLCJjbGFzc05hbWUiLCJ0ZXh0IiwiY3JlYXRlU2ltcGxlRGlhbG9nIiwibGVmdEJ1dHRvbiIsInJpZ2h0QnV0dG9uIiwiZ2V0SGlzdG9yeSIsInJlbW92ZUFjdGlvbkxpc3RlbmVycyIsImRlc3Ryb3kiLCJlbXB0eSIsImFkZENsYXNzIiwib3ZlcmxheSIsInJlbW92ZUNsYXNzIiwiaXNOb3RTaW1wbGVEaWFsb2ciLCJkb21Ob2RlIiwiZXZ0Iiwic3JjRWxlbWVudCIsInBsYWNlIiwicGFyZW50IiwicG9wSGlzdG9yeSIsInBvcCIsInNoaWZ0Iiwib2ZmIiwibGlzdGVuZXIiLCJkYXRhIiwiY29uc29sZSIsImxvZyIsIl9tb2RhbE5vZGUiLCJzaW1wbGVEaWFsb2ciLCJ1cGRhdGVaSW5kZXgiLCJhYm92ZSIsInZhbHVlIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkEsTUFBTUEsV0FBVyxvQkFBWSxPQUFaLENBQWpCOztBQUVBOzs7QUF4QkE7Ozs7Ozs7Ozs7Ozs7OztBQTJCQSxNQUFNQyxVQUFVLHVCQUFRLHFCQUFSLEVBQStCLDJDQUEvQixFQUEwRCxrQ0FBa0M7QUFDMUdDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEsQ0FDM0Isd0VBRDJCLEVBRTNCLHdCQUYyQixFQUczQiwrQkFIMkIsRUFJM0IsUUFKMkIsQ0FBYixDQUQwRjtBQU8xR0MsMkJBQXVCLElBQUlELFFBQUosQ0FBYSxDQUNsQyx3REFEa0MsRUFFbEMsc0RBRmtDLENBQWIsQ0FQbUY7QUFXMUdFLDBCQUFz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QXRCLEVBQWdDaUUsUUFBUSxDQUF4QztBQUNBLGVBQU8sSUFBUDtBQUNEO0FBQ0Y7QUExUnlHLEdBQTVGLENBQWhCOztvQkE2UmVoSCxPIiwiZmlsZSI6Ik1vZGFsLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IERlZmVycmVkIGZyb20gJ2Rvam8vRGVmZXJyZWQnO1xyXG5pbXBvcnQgX1dpZGdldEJhc2UgZnJvbSAnZGlqaXQvX1dpZGdldEJhc2UnO1xyXG5pbXBvcnQgX1RlbXBsYXRlZCBmcm9tICcuLi9fVGVtcGxhdGVkJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4uL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ21vZGFsJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkRpYWxvZ3MuTW9kYWxcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5EaWFsb2dzLk1vZGFsJywgW19XaWRnZXRCYXNlLCBfVGVtcGxhdGVkXSwgLyoqIEBsZW5kcyBhcmdvcy5EaWFsb2dzLk1vZGFsIyAqL3tcclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwibW9kYWxfX2NvbnRhaW5lclwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJtb2RhbENvbnRhaW5lclwiPicsXHJcbiAgICAneyUhICQubW9kYWxUZW1wbGF0ZSAlfScsXHJcbiAgICAneyUhICQubW9kYWxPdmVybGF5VGVtcGxhdGUgJX0nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgZGlhbG9nQ29udGVudFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJtb2RhbF9faGVhZGVyX190aXRsZVwiPnslOiAkLnRpdGxlICV9PC9kaXY+JyxcclxuICAgICc8cCBjbGFzcz1cIm1vZGFsX19jb250ZW50X190ZXh0XCI+eyU6ICQuY29udGVudCAlfTwvcD4nLFxyXG4gIF0pLFxyXG4gIG1vZGFsQ29udGVudFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJtb2RhbF9fY29udGVudFwiPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBtb2RhbFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgaWQ9XCJ7JT0gJC5pZCAlfVwiIGNsYXNzPVwiY3JtLW1vZGFsIHBhbmVsXCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cIm1vZGFsTm9kZVwiPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICBtb2RhbFRvb2xiYXJUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwibW9kYWxfX3Rvb2xiYXJcIj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgbW9kYWxPdmVybGF5VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cIm1vZGFsX19vdmVybGF5IG1vZGFsX19vdmVybGF5LS1oaWRkZW5cIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwib3ZlcmxheVwiPicsXHJcbiAgICAnPC9kaXY+JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBTaW1wbGF0ZSB0aGF0IHJldHVybnMgYSBidXR0b25cclxuICAgKiBAcGFyYW0gY2xhc3M6IGNzcyBjbGFzcyB0byBiZSBhcHBsaWVkIHRvIHRoZSBkaXZcclxuICAgKiBAcGFyYW0gdGV4dDogc3RyaW5nIGZvciB0aGUgYnV0dG9uXHJcbiAgICogQHBhcmFtIGFjdGlvbjogc3RyaW5nIHJlcHJlc2VudGluZyB0aGUgZnVuY3Rpb24gdGhhdCB0aGUgYnV0dG9uIHdpbGwgY2FsbFxyXG4gICAqIEBwYXJhbSBjb250ZXh0OiB0aGUgY29udGV4dCBvZiB0aGUgYWN0aW9uXHJcbiAgICovXHJcbiAgYnV0dG9uVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1dHRvbiB7JT0gJC5jbGFzc05hbWUgJX1cIj57JT0gJC50ZXh0ICV9PC9kaXY+JyxcclxuICBdKSxcclxuXHJcbiAgaWQ6ICdtb2RhbC10ZW1wbGF0ZScsXHJcbiAgX2FjdGlvbkxpc3RlbmVyczogbnVsbCxcclxuICBfYm9keU92ZXJmbG93OiBudWxsLFxyXG4gIF9jb250ZW50OiBudWxsLFxyXG4gIF9oaXN0b3J5OiBbXSxcclxuICBkZWZhdWx0SGVhZGVyVGV4dDoge1xyXG4gICAgYWxlcnQ6IHJlc291cmNlLmFsZXJ0VGV4dCxcclxuICAgIGNvbXBsZXRlOiByZXNvdXJjZS5jb21wbGV0ZVRleHQsXHJcbiAgICBlZGl0OiByZXNvdXJjZS5lZGl0VGV4dCxcclxuICAgIHdhcm5pbmc6IHJlc291cmNlLndhcm5pbmdUZXh0LFxyXG4gIH0sXHJcbiAgZGVmYXVsdFRvb2xiYXJBY3Rpb25zOiB7XHJcbiAgICBjYW5jZWw6IGZ1bmN0aW9uIGNhbmNlbCgpIHsgcmV0dXJuIHRoaXMuaGlkZTsgfSxcclxuICAgIHJlc29sdmU6IGZ1bmN0aW9uIHJlc29sdmUoKSB7IHJldHVybiB0aGlzLnJlc29sdmVEZWZlcnJlZDsgfSxcclxuICB9LFxyXG4gIGRlZmF1bHRUb29sYmFyVGV4dDoge1xyXG4gICAgY2FuY2VsOiByZXNvdXJjZS5jYW5jZWxUZXh0LFxyXG4gICAgY29uZmlybTogcmVzb3VyY2UuY29uZmlybVRleHQsXHJcbiAgICBva2F5OiByZXNvdXJjZS5va2F5VGV4dCxcclxuICAgIHN1Ym1pdDogcmVzb3VyY2Uuc3VibWl0VGV4dCxcclxuICB9LFxyXG4gIGRpc2FibGVDbG9zZTogZmFsc2UsXHJcbiAgaGlzdG9yeUxlbmd0aDogNSxcclxuICBsb2NrU2Nyb2xsOiB0cnVlLFxyXG4gIHRyYWNrSGlzdG9yeTogdHJ1ZSxcclxuICBzaG93VG9vbGJhcjogdHJ1ZSxcclxuICBzaG93T3ZlcmxheTogdHJ1ZSxcclxuXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKCkge1xyXG4gICAgdGhpcy5fYWN0aW9uTGlzdGVuZXJzID0gW107XHJcbiAgfSxcclxuICBfbG9ja1Njcm9sbDogZnVuY3Rpb24gX2xvY2tTY3JvbGwoKSB7XHJcbiAgICBpZiAodGhpcy5sb2NrU2Nyb2xsKSB7XHJcbiAgICAgIHRoaXMuX2JvZHlPdmVyZmxvdyA9ICQoZG9jdW1lbnQuYm9keSkuY3NzKCdvdmVyZmxvdycpO1xyXG4gICAgICAkKGRvY3VtZW50LmJvZHkpLmNzcygnb3ZlcmZsb3cnLCAnaGlkZGVuJyk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIF91bmxvY2tTY3JvbGw6IGZ1bmN0aW9uIF91bmxvY2tTY3JvbGwoKSB7XHJcbiAgICAkKGRvY3VtZW50LmJvZHkpLmNzcygnb3ZlcmZsb3cnLCB0aGlzLl9ib2R5T3ZlcmZsb3cgfHwgJycpO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogVXNlZCB0byBjaGFuZ2UgdGhlIGNvbnRlbnQgb2YgdGhlIG1vZGFsIG5vZGUgKGFrYSB3aGF0IGlzIGRpc3BsYXllZClcclxuICAgKiBNb2RhbHMgY2FuIG9ubHkgc2hvdyBvbmUgYXQgYSB0aW1lIGFuZCB3aWxsIGJlIGNlbnRlcmVkIG9uIHRoZSBzY3JlZW5cclxuICAgKiBAcGFyYW0gY29udGVudDogb2JqZWN0IHJlcHJlc2VudGluZyB0aGUgY3VycmVudCBjb250ZW50IG9mIHRoZSBtb2RhbFxyXG4gICAqIEBwYXJhbSB0b29sYmFyQWN0aW9uczogYXJyYXkgb2YgYWN0aW9ucyB0byBtYWtlIHVwIHRoZSBtb2RhbCB0b29sYmFyIHVzaW5nIGJ1dHRvblRlbXBsYXRlLlxyXG4gICAqIEluIG9yZGVyIHRvIGdldCB0aGUgcHJvbWlzZSBkYXRhIHlvdSBtdXN0IHBhc3MgYW4gaXRlbSB3aXRoIGFjdGlvbiAncmVzb2x2ZSdcclxuICAgKiBUbyBoaWRlIHRoZSBtb2RhbCBwYXNzIGEgdG9vbGJhciBpdGVtIHdpdGggYWN0aW9uICdjYW5jZWwnXHJcbiAgKi9cclxuICBhZGQ6IGZ1bmN0aW9uIGFkZChjb250ZW50ID0ge30sIHRvb2xiYXJBY3Rpb25zID0gW10sIG9wdGlvbnMgPSB7fSkge1xyXG4gICAgY29udGVudC5fZGVmZXJyZWQgPSBuZXcgRGVmZXJyZWQoKTtcclxuICAgIGlmICh0b29sYmFyQWN0aW9ucy5sZW5ndGgpIHtcclxuICAgICAgdGhpcy5zaG93VG9vbGJhciA9IHRydWU7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLnNob3dUb29sYmFyID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgICB0aGlzLnB1c2hIaXN0b3J5KHRoaXMuX2NvbnRlbnQpXHJcbiAgICAgIC5zZXRDb250ZW50KGNvbnRlbnQpXHJcbiAgICAgIC5zaG93Q29udGVudChvcHRpb25zKVxyXG4gICAgICAuY3JlYXRlTW9kYWxUb29sYmFyKHRvb2xiYXJBY3Rpb25zKVxyXG4gICAgICAuX2xvY2tTY3JvbGwoKVxyXG4gICAgICAuc2hvdygpO1xyXG4gICAgY29udGVudC5fZGVmZXJyZWQudGhlbih0aGlzLmhpZGUuYmluZCh0aGlzKSk7XHJcbiAgICByZXR1cm4gY29udGVudC5fZGVmZXJyZWQucHJvbWlzZTtcclxuICB9LFxyXG4gIGF0dGFjaENvbnRhaW5lckxpc3RlbmVyOiBmdW5jdGlvbiBhdHRhY2hDb250YWluZXJMaXN0ZW5lcigpIHtcclxuICAgIHRoaXMucmVtb3ZlQ29udGFpbmVyTGlzdGVuZXIoKTtcclxuICAgICQodGhpcy5tb2RhbENvbnRhaW5lcikub24oJ2NsaWNrJywgdGhpcy5vbkNvbnRhaW5lckNsaWNrLmJpbmQodGhpcykpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBjcmVhdGVNb2RhbFRvb2xiYXI6IGZ1bmN0aW9uIGNyZWF0ZU1vZGFsVG9vbGJhcih0b29sYmFyQWN0aW9ucyA9IFtdKSB7XHJcbiAgICBpZiAodGhpcy5zaG93VG9vbGJhcikge1xyXG4gICAgICBjb25zdCB0b29sYmFyID0gJCh0aGlzLm1vZGFsVG9vbGJhclRlbXBsYXRlLmFwcGx5KHRoaXMpKTtcclxuICAgICAgdG9vbGJhckFjdGlvbnMuZm9yRWFjaCgodG9vbGJhckl0ZW0pID0+IHtcclxuICAgICAgICBpZiAodGhpcy5kZWZhdWx0VG9vbGJhckFjdGlvbnNbdG9vbGJhckl0ZW0uYWN0aW9uXSkge1xyXG4gICAgICAgICAgdG9vbGJhckl0ZW0uYWN0aW9uID0gdGhpcy5kZWZhdWx0VG9vbGJhckFjdGlvbnNbdG9vbGJhckl0ZW0uYWN0aW9uXS5iaW5kKHRoaXMpKCk7XHJcbiAgICAgICAgICB0b29sYmFySXRlbS5jb250ZXh0ID0gdGhpcztcclxuICAgICAgICB9XHJcbiAgICAgICAgY29uc3QgaXRlbSA9ICQodGhpcy5idXR0b25UZW1wbGF0ZS5hcHBseSh0b29sYmFySXRlbSwgdGhpcykpO1xyXG4gICAgICAgICQoaXRlbSkub24oJ2NsaWNrJywgdG9vbGJhckl0ZW0uYWN0aW9uLmJpbmQodG9vbGJhckl0ZW0uY29udGV4dCkpO1xyXG4gICAgICAgIHRoaXMuX2FjdGlvbkxpc3RlbmVycy5wdXNoKCQoaXRlbSkpO1xyXG4gICAgICAgICQodG9vbGJhcikuYXBwZW5kKGl0ZW0pO1xyXG4gICAgICB9KTtcclxuICAgICAgJCh0aGlzLm1vZGFsTm9kZSkuYXBwZW5kKHRvb2xiYXIpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBjcmVhdGVTaW1wbGVBbGVydDogZnVuY3Rpb24gY3JlYXRlU2ltcGxlQWxlcnQob3B0aW9ucyA9IHt9KSB7XHJcbiAgICBjb25zdCBkaWFsb2cgPSB7XHJcbiAgICAgIHRpdGxlOiB0aGlzLmRlZmF1bHRIZWFkZXJUZXh0W29wdGlvbnMudGl0bGVdIHx8IG9wdGlvbnMudGl0bGUsXHJcbiAgICAgIGNvbnRlbnQ6IG9wdGlvbnMuY29udGVudCxcclxuICAgICAgZ2V0Q29udGVudDogb3B0aW9ucy5nZXRDb250ZW50LFxyXG4gICAgfTtcclxuICAgIGNvbnN0IHRvb2xiYXIgPSBbe1xyXG4gICAgICBhY3Rpb246ICdyZXNvbHZlJyxcclxuICAgICAgY2xhc3NOYW1lOiAnYnV0dG9uLS1mbGF0IGJ1dHRvbi0tZmxhdC0tc3BsaXQnLFxyXG4gICAgICB0ZXh0OiByZXNvdXJjZS5va2F5VGV4dCxcclxuICAgIH1dO1xyXG4gICAgcmV0dXJuIHRoaXMuYWRkKGRpYWxvZywgdG9vbGJhcik7XHJcbiAgfSxcclxuICBjcmVhdGVTaW1wbGVEaWFsb2c6IGZ1bmN0aW9uIGNyZWF0ZVNpbXBsZURpYWxvZyhvcHRpb25zID0ge30pIHtcclxuICAgIGNvbnN0IGRpYWxvZyA9IHtcclxuICAgICAgdGl0bGU6IHRoaXMuZGVmYXVsdEhlYWRlclRleHRbb3B0aW9ucy50aXRsZV0gfHwgb3B0aW9ucy50aXRsZSxcclxuICAgICAgY29udGVudDogb3B0aW9ucy5jb250ZW50LFxyXG4gICAgICBnZXRDb250ZW50OiBvcHRpb25zLmdldENvbnRlbnQsXHJcbiAgICB9O1xyXG4gICAgY29uc3QgdG9vbGJhciA9IFtcclxuICAgICAge1xyXG4gICAgICAgIGFjdGlvbjogJ2NhbmNlbCcsXHJcbiAgICAgICAgY2xhc3NOYW1lOiAnYnV0dG9uLS1mbGF0IGJ1dHRvbi0tZmxhdC0tc3BsaXQnLFxyXG4gICAgICAgIHRleHQ6IHRoaXMuZGVmYXVsdFRvb2xiYXJUZXh0W29wdGlvbnMubGVmdEJ1dHRvbl0gfHwgcmVzb3VyY2UuY2FuY2VsVGV4dCxcclxuICAgICAgfSwge1xyXG4gICAgICAgIGFjdGlvbjogJ3Jlc29sdmUnLFxyXG4gICAgICAgIGNsYXNzTmFtZTogJ2J1dHRvbi0tZmxhdCBidXR0b24tLWZsYXQtLXNwbGl0JyxcclxuICAgICAgICB0ZXh0OiB0aGlzLmRlZmF1bHRUb29sYmFyVGV4dFtvcHRpb25zLnJpZ2h0QnV0dG9uXSB8fCByZXNvdXJjZS5va2F5VGV4dCxcclxuICAgICAgfSxcclxuICAgIF07XHJcbiAgICByZXR1cm4gdGhpcy5hZGQoZGlhbG9nLCB0b29sYmFyKTtcclxuICB9LFxyXG4gIGdldEhpc3Rvcnk6IGZ1bmN0aW9uIGdldEhpc3RvcnkoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5faGlzdG9yeTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEhpZGUgdGhlIG1vZGFsQ29udGFpbmVyIHRvIGF2b2lkIGNhcHR1cmluZyBldmVudHNcclxuICAqL1xyXG4gIGhpZGU6IGZ1bmN0aW9uIGhpZGUoKSB7XHJcbiAgICBpZiAoIXRoaXMuZGlzYWJsZUNsb3NlKSB7XHJcbiAgICAgIHRoaXMucmVtb3ZlQ29udGFpbmVyTGlzdGVuZXIoKVxyXG4gICAgICAgIC5yZW1vdmVBY3Rpb25MaXN0ZW5lcnMoKVxyXG4gICAgICAgIC5fdW5sb2NrU2Nyb2xsKCk7XHJcbiAgICAgIGlmICh0aGlzLl9jb250ZW50ICYmIHRoaXMuX2NvbnRlbnQuZGVzdHJveSkge1xyXG4gICAgICAgIHRoaXMuX2NvbnRlbnQuZGVzdHJveSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmICh0aGlzLnNob3dUb29sYmFyKSB7XHJcbiAgICAgICAgJCh0aGlzLm1vZGFsTm9kZSkuZW1wdHkoKTtcclxuICAgICAgICB0aGlzLnJlbW92ZUFjdGlvbkxpc3RlbmVycygpO1xyXG4gICAgICB9XHJcbiAgICAgICQodGhpcy5tb2RhbENvbnRhaW5lcikuYWRkQ2xhc3MoJ21vZGFsX19jb250YWluZXItLWhpZGRlbicpO1xyXG4gICAgICBpZiAodGhpcy5zaG93T3ZlcmxheSkge1xyXG4gICAgICAgICQodGhpcy5vdmVybGF5KS5hZGRDbGFzcygnbW9kYWxfX292ZXJsYXktLWhpZGRlbicpO1xyXG4gICAgICAgICQodGhpcy5tb2RhbE5vZGUpLnJlbW92ZUNsYXNzKCdpcy12aXNpYmxlJyk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgaXNOb3RTaW1wbGVEaWFsb2c6IGZ1bmN0aW9uIGlzTm90U2ltcGxlRGlhbG9nKCkge1xyXG4gICAgaWYgKHRoaXMuX2NvbnRlbnQuZG9tTm9kZSkge1xyXG4gICAgICByZXR1cm4gdHJ1ZTtcclxuICAgIH1cclxuICAgIHJldHVybiBmYWxzZTtcclxuICB9LFxyXG4gIG9uQ29udGFpbmVyQ2xpY2s6IGZ1bmN0aW9uIG9uQ29udGFpbmVyQ2xpY2soZXZ0KSB7XHJcbiAgICBpZiAoZXZ0LnNyY0VsZW1lbnQgPT09IHRoaXMubW9kYWxDb250YWluZXIgfHwgZXZ0LnNyY0VsZW1lbnQgPT09IHRoaXMub3ZlcmxheSkge1xyXG4gICAgICB0aGlzLmhpZGUoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHBsYWNlOiBmdW5jdGlvbiBwbGFjZShwYXJlbnQpIHtcclxuICAgIGlmIChwYXJlbnQpIHtcclxuICAgICAgJChwYXJlbnQpLmFwcGVuZCh0aGlzLm1vZGFsQ29udGFpbmVyKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgcG9wSGlzdG9yeTogZnVuY3Rpb24gcG9wSGlzdG9yeSgpIHtcclxuICAgIHJldHVybiB0aGlzLl9oaXN0b3J5LnBvcCgpO1xyXG4gIH0sXHJcbiAgcHVzaEhpc3Rvcnk6IGZ1bmN0aW9uIHB1c2hIaXN0b3J5KGNvbnRlbnQpIHtcclxuICAgIGlmIChjb250ZW50ICYmIHRoaXMuX2hpc3RvcnkubGVuZ3RoIDwgdGhpcy5oaXN0b3J5TGVuZ3RoKSB7XHJcbiAgICAgIHRoaXMuX2hpc3RvcnkucHVzaChjb250ZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHRoaXMuX2hpc3Rvcnkuc2hpZnQoKTtcclxuICAgICAgdGhpcy5faGlzdG9yeS5wdXNoKGNvbnRlbnQpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICByZW1vdmVDb250YWluZXJMaXN0ZW5lcjogZnVuY3Rpb24gcmVtb3ZlQ29udGFpbmVyTGlzdGVuZXIoKSB7XHJcbiAgICAkKHRoaXMubW9kYWxDb250YWluZXIpLm9mZignY2xpY2snKTtcclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgcmVtb3ZlQWN0aW9uTGlzdGVuZXJzOiBmdW5jdGlvbiByZW1vdmVBY3Rpb25MaXN0ZW5lcnMoKSB7XHJcbiAgICBpZiAodGhpcy5fYWN0aW9uTGlzdGVuZXJzKSB7XHJcbiAgICAgIHRoaXMuX2FjdGlvbkxpc3RlbmVycy5mb3JFYWNoKChsaXN0ZW5lcikgPT4ge1xyXG4gICAgICAgIGxpc3RlbmVyLm9mZigpO1xyXG4gICAgICB9KTtcclxuXHJcbiAgICAgIHRoaXMuX2FjdGlvbkxpc3RlbmVycyA9IFtdO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICByZXNvbHZlRGVmZXJyZWQ6IGZ1bmN0aW9uIHJlc29sdmVEZWZlcnJlZCgpIHtcclxuICAgIGxldCBkYXRhID0ge307XHJcbiAgICBpZiAodGhpcy5fY29udGVudCAmJiB0aGlzLl9jb250ZW50LmdldENvbnRlbnQpIHtcclxuICAgICAgZGF0YSA9IHRoaXMuX2NvbnRlbnQuZ2V0Q29udGVudCgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMuaXNOb3RTaW1wbGVEaWFsb2coKSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdNb2RhbCBjb250ZW50IGRvZXMgbm90IGhhdmUgYSBnZXRDb250ZW50IGZ1bmN0aW9uIGNhbGwgdG8gcmV0cmlldmUgdGhlIGRhdGEsIGFkZCB0aGlzIHRvIGFsbG93IGRhdGEgdG8gYmUgcmV0dXJuZWQnKTsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICB0aGlzLl9jb250ZW50Ll9kZWZlcnJlZC5yZXNvbHZlKGRhdGEpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBzZXRDb250ZW50OiBmdW5jdGlvbiBzZXRDb250ZW50KGNvbnRlbnQpIHtcclxuICAgIGlmIChjb250ZW50KSB7XHJcbiAgICAgIHRoaXMuX2NvbnRlbnQgPSBjb250ZW50O1xyXG4gICAgICBjb250ZW50Ll9tb2RhbE5vZGUgPSB0aGlzO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICBzaG93OiBmdW5jdGlvbiBzaG93KCkge1xyXG4gICAgdGhpcy5hdHRhY2hDb250YWluZXJMaXN0ZW5lcigpO1xyXG4gICAgJCh0aGlzLm1vZGFsQ29udGFpbmVyKS5yZW1vdmVDbGFzcygnbW9kYWxfX2NvbnRhaW5lci0taGlkZGVuJyk7XHJcbiAgICBpZiAodGhpcy5zaG93T3ZlcmxheSkge1xyXG4gICAgICAkKHRoaXMub3ZlcmxheSkucmVtb3ZlQ2xhc3MoJ21vZGFsX19vdmVybGF5LS1oaWRkZW4nKTtcclxuICAgICAgJCh0aGlzLm1vZGFsTm9kZSkuYWRkQ2xhc3MoJ2lzLXZpc2libGUnKTtcclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgc2hvd0NvbnRlbnQ6IGZ1bmN0aW9uIHNob3dDb250ZW50KG9wdGlvbnMgPSB7fSkge1xyXG4gICAgaWYgKHRoaXMuX2NvbnRlbnQgJiYgdGhpcy5fY29udGVudC5zaG93KSB7XHJcbiAgICAgIHRoaXMuX2NvbnRlbnQuc2hvdyhvcHRpb25zKTtcclxuICAgICAgY29uc3QgY29udGVudCA9ICQodGhpcy5tb2RhbENvbnRlbnRUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICAgICQoY29udGVudCkuYXBwZW5kKHRoaXMuX2NvbnRlbnQuZG9tTm9kZSB8fCB0aGlzLl9jb250ZW50KTtcclxuICAgICAgJCh0aGlzLm1vZGFsTm9kZSkuYXBwZW5kKGNvbnRlbnQpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaWYgKHRoaXMuaXNOb3RTaW1wbGVEaWFsb2coKSkge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdDdXJyZW50IG1vZGFsIGNvbnRlbnQgZG9lcyBub3QgaGF2ZSBhIHNob3cgZnVuY3Rpb24sIGRpZCB5b3UgZm9yZ2V0IHRvIGFkZCB0aGlzPycpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgY29uc3QgY29udGVudCA9ICQodGhpcy5tb2RhbENvbnRlbnRUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICAgICAgY29uc3Qgc2ltcGxlRGlhbG9nID0gJCh0aGlzLmRpYWxvZ0NvbnRlbnRUZW1wbGF0ZS5hcHBseSh0aGlzLl9jb250ZW50LCB0aGlzKSk7XHJcbiAgICAgICAgJChjb250ZW50KS5hcHBlbmQoc2ltcGxlRGlhbG9nKTtcclxuICAgICAgICAkKHRoaXMubW9kYWxOb2RlKS5hcHBlbmQoY29udGVudCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH0sXHJcbiAgdXBkYXRlWkluZGV4OiBmdW5jdGlvbiB1cGRhdGVaSW5kZXgoYWJvdmUpIHtcclxuICAgIGlmIChhYm92ZSkge1xyXG4gICAgICBsZXQgdmFsdWUgPSAkKGFib3ZlKS5jc3MoJ3pJbmRleCcpO1xyXG4gICAgICBpZiAoIXZhbHVlIHx8IHZhbHVlID09PSAnYXV0bycpIHtcclxuICAgICAgICB2YWx1ZSA9IDA7XHJcbiAgICAgIH1cclxuICAgICAgJCh0aGlzLm1vZGFsQ29udGFpbmVyKS5jc3MoJ3pJbmRleCcsIHZhbHVlKTtcclxuICAgICAgJCh0aGlzLm1vZGFsTm9kZSkuY3NzKCd6SW5kZXgnLCB2YWx1ZSArIDEpO1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==