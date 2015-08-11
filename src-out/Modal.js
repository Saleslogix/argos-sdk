define('argos/Modal', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/_base/connect', 'dojo/dom-construct', 'dojo/dom-style', 'dojo/query', 'dijit/_Widget', 'argos/_Templated', 'argos/ModalManager'], function (exports, module, _dojo_baseDeclare, _dojo_baseArray, _dojo_baseLang, _dojo_baseConnect, _dojoDomConstruct, _dojoDomStyle, _dojoQuery, _dijit_Widget, _argos_Templated, _argosModalManager) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _array = _interopRequireDefault(_dojo_baseArray);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _connect = _interopRequireDefault(_dojo_baseConnect);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _domStyle = _interopRequireDefault(_dojoDomStyle);

  var _query = _interopRequireDefault(_dojoQuery);

  var _Widget2 = _interopRequireDefault(_dijit_Widget);

  var _Templated2 = _interopRequireDefault(_argos_Templated);

  var _ModalManager = _interopRequireDefault(_argosModalManager);

  var __class = (0, _declare['default'])('argos.Modal', [_Widget2['default'], _Templated2['default'], _ModalManager['default']], {
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" class="modal panel" data-dojo-attach-point="modalNode" data-action="clickModal">', '</div>']),
    modalBackdropTemplate: new Simplate(['<div class="modal-backdrop" style="height: {%= $.parentHeight %}">', '</div>']),
    pickListStartTemplate: new Simplate(['<ul class="picklist dropdown">']),
    pickListEndTemplate: new Simplate(['</ul>']),
    pickListItemTemplate: new Simplate(['<li class="listItem" data-action="{%= $.action %}">', '{%= $.item %}', '</li>']),
    modalToolbarTemplate: new Simplate(['<div class="modal-toolbar">', '</div>']),
    buttonTemplate: new Simplate(['<div class="button tertiary">{%= $.text %}</div>']),

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

    calculatePosition: function calculatePosition(_ref) {
      var offsetTop = _ref.offsetTop;
      var offsetLeft = _ref.offsetLeft;
      var offsetRight = _ref.offsetRight;
      var offsetWidth = _ref.offsetWidth;
      var offsetHeight = _ref.offsetHeight;

      var position = {};

      if (this._isPicklist) {
        _domStyle['default'].set(this.modalNode, {
          width: offsetWidth + 'px'
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
          position.top = this._parentNode.offsetHeight / 2 + this._parentNode.scrollTop - this.modalNode.offsetHeight / 2;
          position.left = this._parentNode.offsetWidth / 2 - this.modalNode.offsetWidth / 2;
          break;
        default:
          position.top = this._parentNode.offsetHeight / 2 + this._parentNode.scrollTop - this.modalNode.offsetHeight / 2;
          position.left = this._parentNode.offsetWidth / 2 - this.modalNode.offsetWidth / 2;
      }

      if (position.top + this.modalNode.offsetHeight >= this._parentNode.scrollHeight) {
        position.top = position.top - this.modalNode.offsetHeight - offsetHeight;
      }
      if (position.top < 0) {
        position.top = this._parentNode.offsetTop / 2;
        _domStyle['default'].set(this.modalNode, {
          maxHeight: this._parentNode.offsetHeight - this._parentNode.offsetTop + 'px'
        });
      }

      _domStyle['default'].set(this.modalNode, {
        maxWidth: this._parentNode.offsetWidth + 'px',
        top: position.top + 'px',
        left: position.left + 'px',
        visibility: 'visible'
      });
      return this;
    },
    clickModal: function clickModal() {
      event.preventDefault();
    },
    confirm: function confirm() {
      var data = [];
      _array['default'].forEach(this._content, function getData(content) {
        if (content) {
          data.push(content.getContent());
        }
      }, this);
      _connect['default'].publish('/app/Modal/confirm', data);
      this.hideModal();
      return this;
    },
    emptyModal: function emptyModal() {
      _domConstruct['default'].empty(this.modalNode);
      return this;
    },
    hideModal: function hideModal() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (params && params.target && params.target.offsetParent === this.modalNode) {
        return this;
      }

      this.toggleBackdrop().toggleParentScroll();
      _domStyle['default'].set(this.modalNode, {
        visibility: 'hidden'
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
    placeBackdrop: function placeBackdrop() {
      var parentPanel = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this.showBackdrop) {
        var existingBackdrop = (0, _query['default'])('.modal-backdrop', parentPanel)[0];
        if (!existingBackdrop) {
          this._backdrop = _domConstruct['default'].toDom(this.modalBackdropTemplate.apply({ parentHeight: parentPanel.scrollHeight + 'px' }));
          _domStyle['default'].set(this._backdrop, {
            visbility: 'hidden'
          });
          _domConstruct['default'].place(this._backdrop, parentPanel);
          // connect.connect(this._backdrop, 'onclick', this, this.hideModal);
        }
      }
      return this;
    },
    placeModal: function placeModal() {
      var parentPanel = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._parentNode = parentPanel;
      this.placeBackdrop(parentPanel);
      this._orientation = _connect['default'].subscribe('/app/setOrientation', this, this.hideModal);
      _domConstruct['default'].place(this.modalNode, parentPanel);
      return this;
    },
    setContent: function setContent() {
      var content = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._content = content;
      return this;
    },
    setContentObject: function setContentObject() {
      var object = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._contentObject = object;
      _domConstruct['default'].place(object.domNode, this.modalNode);
      if (this.showToolbar) {
        var modalToolbar = _domConstruct['default'].toDom(this.modalToolbarTemplate.apply(this));
        var cancelButton = _domConstruct['default'].toDom(this.buttonTemplate.apply({ text: this.cancelText }));
        _connect['default'].connect(cancelButton, 'onclick', this, this.hideModal);
        _domConstruct['default'].place(cancelButton, modalToolbar);
        var confirmButton = _domConstruct['default'].toDom(this.buttonTemplate.apply({ text: this.confirmText }));
        _connect['default'].connect(confirmButton, 'onclick', this, this.confirm);
        _domConstruct['default'].place(confirmButton, modalToolbar);
        _domConstruct['default'].place(modalToolbar, this.modalNode);
      }
      return this;
    },
    setContentOptions: function setContentOptions() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._contentOptions = options;
      return this;
    },
    setContentPicklist: function setContentPicklist(_ref2) {
      var items = _ref2.items;
      var action = _ref2.action;
      var actionScope = _ref2.actionScope;

      var pickListStart = _domConstruct['default'].toDom(this.pickListStartTemplate.apply());
      var pickListEnd = _domConstruct['default'].toDom(this.pickListEndTemplate.apply());

      _array['default'].forEach(items, function addToModalList(item) {
        _domConstruct['default'].place(this.pickListItemTemplate.apply({ item: item, action: action }, actionScope), pickListStart);
      }, this);
      _domConstruct['default'].place(pickListEnd, pickListStart);
      _domConstruct['default'].place(pickListStart, this.modalNode);
      this._contentObject = pickListStart;
      this._isPicklist = true;
      _domStyle['default'].set(this.modalNode, {
        padding: 0,
        overflow: 'hidden'
      });

      return this;
    },
    setParentListener: function setParentListener() {
      this._parentListener = _connect['default'].connect(this._parentNode, 'onclick', this, this.hideModal);
      return this;
    },
    showContent: function showContent() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this._contentObject.show) {
        this._contentObject.show(this._contentOptions || options);
        if (this._contentObject.getContent) {
          this.setContent(this._contentObject.getContent());
        }
      }
      return this;
    },
    showModal: function showModal() {
      var target = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this._parentNode) {
        this.showContent().toggleBackdrop().toggleParentScroll().setParentListener().calculatePosition(target);
      }
      return this;
    },
    toggleBackdrop: function toggleBackdrop() {
      if (this.showBackdrop) {
        if (this._backdrop) {
          if (_domStyle['default'].get(this._backdrop, 'visibility') === 'hidden') {
            _domStyle['default'].set(this._backdrop, {
              visibility: 'visible'
            });
          } else {
            _domStyle['default'].set(this._backdrop, {
              visibility: 'hidden'
            });
          }
        }
      }
      return this;
    },
    toggleModal: function toggleModal() {
      var target = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (_domStyle['default'].get(this.modalNode, 'visibility') === 'visible') {
        this.hideModal();
      } else {
        this.showModal(target);
      }
      return this;
    },
    toggleParentScroll: function toggleParentScroll() {
      if (this.positioning === 'center') {
        if (_domStyle['default'].get(this._parentNode, 'overflow') === 'hidden') {
          _domStyle['default'].set(this._parentNode, {
            overflow: ''
          });
        } else {
          _domStyle['default'].set(this._parentNode, {
            overflow: 'hidden'
          });
        }
      }
      return this;
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Modal', __class);
  module.exports = __class;
});
