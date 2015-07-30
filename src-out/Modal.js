define('argos/Modal', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/event', 'dojo/_base/connect', 'dojo/dom-construct', 'dojo/dom-class', 'dojo/query', 'dijit/_Widget', 'argos/_Templated'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseEvent, _dojo_baseConnect, _dojoDomConstruct, _dojoDomClass, _dojoQuery, _dijit_Widget, _argos_Templated) {
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

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _event = _interopRequireDefault(_dojo_baseEvent);

  var _connect = _interopRequireDefault(_dojo_baseConnect);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _query = _interopRequireDefault(_dojoQuery);

  var _Widget2 = _interopRequireDefault(_dijit_Widget);

  var _Templated2 = _interopRequireDefault(_argos_Templated);

  var __class = (0, _declare['default'])('argos.Modal', [_Widget2['default'], _Templated2['default']], {
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" class="modal panel" data-dojo-attach-point="modalNode"></div>']),
    modalBackdropTemplate: new Simplate(['<div class="modal-backdrop" style="height: {%= $.parentHeight %}"></div>']),
    pickListStartTemplate: new Simplate(['<ul class="picklist dropdown">']),
    pickListEndTemplate: new Simplate(['</ul>']),
    pickListItemTemplate: new Simplate(['<li class="listItem">{%= $.item %}</li>']),

    id: 'modal-template',
    _orientation: null,
    _parentNode: null,
    _backdrop: null,
    showBackdrop: true,
    positioning: 'center',

    calculatePosition: function calculatePosition(_ref) {
      var offsetTop = _ref.offsetTop;
      var offsetLeft = _ref.offsetLeft;
      var offsetRight = _ref.offsetRight;
      var offsetWidth = _ref.offsetWidth;
      var offsetHeight = _ref.offsetHeight;

      var position = {};

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

      //this.modalNode.style.maxHeight =  this._parentNode.offsetHeight - this._parentNode.offsetTop - offsetTop + 'px';
      this.modalNode.style.top = position.top + 'px';
      this.modalNode.style.left = position.left + 'px';
      this.modalNode.style.visibility = 'visible';
      return this;
    },
    emptyModal: function emptyModal() {
      _domConstruct['default'].empty(this.modalNode);
      return this;
    },
    hideModal: function hideModal() {
      var params = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.toggleBackdrop().toggleParentScroll();
      this.modalNode.style.visibility = 'hidden';
      return this;
    },
    noBackdrop: function noBackdrop() {
      this.showBackdrop = false;
      return this;
    },
    placeBackdrop: function placeBackdrop() {
      var parentPanel = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this.showBackdrop) {
        var existingBackdrop = (0, _query['default'])('.modal-backdrop', parentPanel)[0];
        if (!existingBackdrop) {
          this._backdrop = _domConstruct['default'].toDom(this.modalBackdropTemplate.apply({ parentHeight: parentPanel.scrollHeight + 'px' }));
          this._backdrop.style.visibility = 'hidden';
          _domConstruct['default'].place(this._backdrop, parentPanel);
          _connect['default'].connect(this._backdrop, "onclick", this, this.hideModal);
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
      var panel = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      _domConstruct['default'].place(panel, this.modalNode);
      return this;
    },
    setContentPicklist: function setContentPicklist() {
      var items = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      var pickListStart = _domConstruct['default'].toDom(this.pickListStartTemplate.apply()),
          pickListEnd = _domConstruct['default'].toDom(this.pickListEndTemplate.apply());

      for (var item in items) {
        _domConstruct['default'].place(this.pickListItemTemplate.apply(item, this), pickListStart);
      }
      _domConstruct['default'].place(pickListEnd, pickListStart);
      _domConstruct['default'].place(pickListStart, this.modalNode);
      return this;
    },
    showModal: function showModal() {
      var target = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (this._parentNode) {
        this.toggleBackdrop().toggleParentScroll().calculatePosition(target);
      }
      return this;
    },
    toggleBackdrop: function toggleBackdrop() {
      if (this.showBackdrop) {
        if (this._backdrop) {
          if (this._backdrop.style.visibility === 'hidden') {
            this._backdrop.style.visibility = 'visible';
          } else {
            this._backdrop.style.visibility = 'hidden';
          }
        }
      }
      return this;
    },
    toggleParentScroll: function toggleParentScroll() {
      if (this.positioning === 'center') {
        if (this._parentNode.style.overflow === 'hidden') {
          this._parentNode.style.overflow = '';
        } else {
          this._parentNode.style.overflow = 'hidden';
        }
      }
      return this;
    },
    destroy: function destroy() {
      this.inherited(arguments);
      _connect['default'].unsubscribe(this._orientation);
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Modal', __class);
  module.exports = __class;
});
