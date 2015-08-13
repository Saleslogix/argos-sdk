define('argos/Modal', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/array', 'dojo/_base/connect', 'dojo/Deferred', 'dojo/dom-class', 'dojo/dom-construct', 'dojo/dom-prop', 'dojo/dom-style', 'dojo/query', 'dijit/_Widget', 'argos/_Templated'], function (exports, module, _dojo_baseDeclare, _dojo_baseArray, _dojo_baseConnect, _dojoDeferred, _dojoDomClass, _dojoDomConstruct, _dojoDomProp, _dojoDomStyle, _dojoQuery, _dijit_Widget, _argos_Templated) {
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

  var _connect = _interopRequireDefault(_dojo_baseConnect);

  var _Deferred = _interopRequireDefault(_dojoDeferred);

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _domProp = _interopRequireDefault(_dojoDomProp);

  var _domStyle = _interopRequireDefault(_dojoDomStyle);

  var _query = _interopRequireDefault(_dojoQuery);

  var _Widget2 = _interopRequireDefault(_dijit_Widget);

  var _Templated2 = _interopRequireDefault(_argos_Templated);

  var __class = (0, _declare['default'])('argos.Modal', [_Widget2['default'], _Templated2['default']], {
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" class="modal panel" data-dojo-attach-point="modalNode">', '</div>']),
    modalBackdropTemplate: new Simplate(['<div class="modal-backdrop" style="height: {%= $.parentHeight %}">', '</div>']),
    pickListStartTemplate: new Simplate(['<ul class="picklist dropdown">']),
    pickListEndTemplate: new Simplate(['</ul>']),
    pickListItemTemplate: new Simplate(['<li class="listItem" data-value="{%= $.item %}">', '{%= $.item %}', '</li>']),
    modalToolbarTemplate: new Simplate(['<div class="modal-toolbar">', '</div>']),
    buttonTemplate: new Simplate(['<div class="button tertiary">{%= $.text %}</div>']),

    id: 'modal-template',
    _orientation: null,
    _parentNode: null,
    _content: null,
    _contentObject: null,
    _backdrop: null,
    _isPicklist: false,
    _picklistSelected: null,
    _cancelButton: null,
    _eventConnections: [], // TODO: Clear connections upon modal destroy
    _deferred: null,
    showBackdrop: true,
    showToolbar: true,
    closeAction: null,
    actionScope: null,
    positioning: '',

    cancelText: 'Cancel',
    confirmText: 'Confirm',

    calculatePosition: function calculatePosition(_ref) {
      var offsetTop = _ref.offsetTop;
      var offsetLeft = _ref.offsetLeft;
      var offsetWidth = _ref.offsetWidth;
      var offsetHeight = _ref.offsetHeight;

      var position = {};

      if (this._isPicklist) {
        // This call needs to take place before positioning so that the width of the modal is accounted for
        _domStyle['default'].set(this.modalNode, {
          minWidth: offsetWidth + 'px'
        });
      }

      this.refreshModalSize();

      var parentHeight = _domProp['default'].get(this._parentNode, 'offsetHeight');
      var parentWidth = _domProp['default'].get(this._parentNode, 'offsetWidth');
      var parentScrollTop = _domProp['default'].get(this._parentNode, 'scrollTop');
      var parentScrollHeight = _domProp['default'].get(this._parentNode, 'scrollHeight');
      var modalHeight = _domProp['default'].get(this.modalNode, 'offsetHeight');
      var modalWidth = _domProp['default'].get(this.modalNode, 'offsetWidth');

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
          position.top = (parentHeight - modalHeight) / 2 + parentScrollTop;
          position.left = (parentWidth - modalWidth) / 2;
      }

      if (position.top + modalHeight >= parentScrollHeight) {
        position.top = position.top - modalHeight - offsetHeight;
      }

      if (position.top < parentScrollTop) {
        position.top = parentScrollTop;
      }

      _domStyle['default'].set(this.modalNode, {
        maxWidth: parentWidth + 'px',
        top: position.top + 'px',
        left: position.left + 'px',
        zIndex: _domStyle['default'].get(this._parentNode, 'zIndex') + 10,
        maxHeight: parentHeight + 'px',
        visibility: 'visible',
        overflow: 'auto'
      });

      if (this._isPicklist) {
        if (position.top > offsetTop) {
          _domStyle['default'].set(this._contentObject, {
            borderTop: '0'
          });
        } else {
          _domStyle['default'].set(this._contentObject, {
            borderBottom: '0'
          });
        }
      }

      return this;
    },
    confirm: function confirm() {
      var data = {};
      _array['default'].forEach(this._content, function getData(content) {
        if (content) {
          data[content.id] = content.getContent();
        }
      }, this);
      this._deferred.resolve(data);
      this.hideModal();
      return this;
    },
    emptyModal: function emptyModal() {
      _domConstruct['default'].empty(this.modalNode);
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
    hideModal: function hideModal() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (_domStyle['default'].get(this.modalNode, 'visibility') === 'visible') {
        if (params && params.target && params.target !== this._cancelButton && params.target.offsetParent === this.modalNode) {
          return this;
        }

        this.toggleBackdrop().toggleParentScroll().hideChildModals();
        _domStyle['default'].set(this.modalNode, {
          visibility: 'hidden'
        });
      }
      return this;
    },
    noBackdrop: function noBackDrop() {
      this.showBackdrop = false;
      return this;
    },
    placeBackdrop: function placeBackdrop() {
      var parentPanel = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var existingBackdrop = (0, _query['default'])('.modal-backdrop', parentPanel)[0];
      if (!existingBackdrop) {
        this._backdrop = _domConstruct['default'].toDom(this.modalBackdropTemplate.apply({ parentHeight: parentPanel.scrollHeight + 'px' }));
        if (!this.showBackdrop) {
          _domStyle['default'].set(this._backdrop, {
            backgroundColor: 'transparent'
          });
        }
        var parentZValue = _domStyle['default'].get(parentPanel, 'zIndex');
        _domStyle['default'].set(this._backdrop, {
          visbility: 'hidden',
          zIndex: parentZValue + 10
        });
        _domConstruct['default'].place(this._backdrop, parentPanel);
      } else {
        this._backdrop = existingBackdrop;
      }
      if (this.actionScope && this.closeAction) {
        // If close action is specified use that action, otherwise default to closing the modal
        this._eventConnections.push(_connect['default'].connect(this._backdrop, 'onclick', this.actionScope, this.actionScope[this.closeAction]));
      } else {
        this._eventConnections.push(_connect['default'].connect(this._backdrop, 'onclick', this, this.hideModal));
      }
      return this;
    },
    placeModal: function placeModal() {
      var parentPanel = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._parentNode = parentPanel;
      if (parentPanel._parentNode) {
        this._parentNode = parentPanel._parentNode;
      }
      this.placeBackdrop(parentPanel);
      this._orientation = this._eventConnections.push(_connect['default'].subscribe('/app/setOrientation', this, this.hideModal));
      _domConstruct['default'].place(this.modalNode, parentPanel);
      return this;
    },
    refreshOverflow: function refreshOverflow() {
      _domStyle['default'].set(this.modalNode, {
        overflow: 'scroll'
      });
      return this;
    },
    refreshModalSize: function refreshModalSize() {
      _domStyle['default'].set(this.modalNode, {
        width: 'auto',
        height: 'auto',
        maxHeight: '',
        maxWidth: '',
        top: '',
        left: ''
      });
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
        this._cancelButton = cancelButton;
        this._eventConnections.push(_connect['default'].connect(cancelButton, 'onclick', this, this.hideModal));
        _domConstruct['default'].place(cancelButton, modalToolbar);
        var confirmButton = _domConstruct['default'].toDom(this.buttonTemplate.apply({ text: this.confirmText }));
        this._eventConnections.push(_connect['default'].connect(confirmButton, 'onclick', this, this.confirm));
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
      var defaultValue = _ref2.defaultValue;

      var pickListStart = _domConstruct['default'].toDom(this.pickListStartTemplate.apply());
      var pickListEnd = _domConstruct['default'].toDom(this.pickListEndTemplate.apply());

      _array['default'].forEach(items, function addToModalList(item) {
        var dom = _domConstruct['default'].toDom(this.pickListItemTemplate.apply({ item: item }, this));
        _domConstruct['default'].place(dom, pickListStart);
        if (item.toString() === defaultValue) {
          this._picklistSelected = dom;
          _domClass['default'].add(dom, 'selected');
        }
      }, this);
      _domConstruct['default'].place(pickListEnd, pickListStart);
      _domConstruct['default'].place(pickListStart, this.modalNode);
      this._contentObject = pickListStart;
      this._isPicklist = true;
      _domStyle['default'].set(this.modalNode, {
        padding: 0,
        overflow: 'hidden'
      });
      if (this._picklistSelected) {
        _domProp['default'].set(pickListStart, 'scrollTop', _domProp['default'].get(this._picklistSelected, 'offsetTop'));
      }
      this._eventConnections.push(_connect['default'].connect(pickListStart, 'onclick', actionScope, actionScope[action]));

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
        this._deferred = new _Deferred['default']();
        this.showContent().toggleBackdrop().toggleParentScroll().calculatePosition(target);
      }
      return this._deferred;
    },
    toggleBackdrop: function toggleBackdrop() {
      if (this._backdrop) {
        if (_domStyle['default'].get(this._backdrop, 'visibility') === 'hidden') {
          _domStyle['default'].set(this._backdrop, {
            visibility: 'visible',
            height: _domProp['default'].get(this._parentNode, 'scrollHeight') + 'px',
            zIndex: _domStyle['default'].get(this._parentNode, 'zIndex') + 5
          });
        } else {
          _domStyle['default'].set(this._backdrop, {
            visibility: 'hidden'
          });
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
      if (_domStyle['default'].get(this._parentNode, 'overflow') === 'hidden') {
        _domStyle['default'].set(this._parentNode, {
          overflow: ''
        });
      } else {
        _domStyle['default'].set(this._parentNode, {
          overflow: 'hidden'
        });
      }
      return this;
    }
  });

  module.exports = __class;
});
