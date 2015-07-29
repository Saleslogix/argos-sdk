define('argos/Modal', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/event', 'dojo/dom-construct', 'dojo/dom-class', 'dijit/_Widget', 'argos/_Templated'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseEvent, _dojoDomConstruct, _dojoDomClass, _dijit_Widget, _argos_Templated) {
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
   *  If fresh creation - Create -> Place -> Set -> Show
   *  If on old modal with new content - Empty -> Set -> Show
   *  If on old modal with no new content - Show
   *  To hide modal - Hide
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _event = _interopRequireDefault(_dojo_baseEvent);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _Widget2 = _interopRequireDefault(_dijit_Widget);

  var _Templated2 = _interopRequireDefault(_argos_Templated);

  var __class = (0, _declare['default'])('argos.Modal', [_Widget2['default'], _Templated2['default']], {
    widgetTemplate: new Simplate(['<div id="{%= $.id %}" class="modal panel" data-dojo-attach-point="modalNode"></div>']),
    pickListStartTemplate: new Simplate(['<ul class="picklist dropdown">']),
    pickListEndTemplate: new Simplate(['</ul>']),
    pickListItemTemplate: new Simplate(['<li class="listItem">{%= $.item %}</li>']),

    id: 'modal-template',
    _parentNode: null,

    emptyModal: function emptyModal() {
      _domConstruct['default'].empty(this.modalNode);
      return this;
    },
    hideModal: function hideModal() {
      this.modalNode.style.visibility = 'hidden';
      return this;
    },
    placeModal: function placeModal() {
      var parentPanel = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._parentNode = parentPanel;
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
    showModal: function showModal(_ref) {
      var offsetTop = _ref.offsetTop;
      var offsetLeft = _ref.offsetLeft;
      var offsetWidth = _ref.offsetWidth;
      var offsetHeight = _ref.offsetHeight;

      if (this._parentNode) {
        this.modalNode.style.left = posLeft - this.modalNode.offsetWidth + width + 'px';
        this.modalNode.style.top = posTop + height + 'px';
        this.modalNode.style.maxHeight = this._parentNode.offsetHeight - this._parentNode.offsetTop - posTop + 'px';
        this.modalNode.style.visibility = 'visible';
      }
      return this;
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.Modal', __class);
  module.exports = __class;
});
