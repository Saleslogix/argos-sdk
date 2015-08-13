define('argos/DateTimePicker', ['exports', 'module', 'dojo/_base/declare', 'dojo/dom-construct', 'dijit/_Widget', 'argos/_Templated', './Calendar', './TimePicker'], function (exports, module, _dojo_baseDeclare, _dojoDomConstruct, _dijit_Widget, _argos_Templated, _Calendar, _TimePicker) {
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
   * @class argos.DateTimePicker
   * @alternateClassName Date Time Select
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _Widget2 = _interopRequireDefault(_dijit_Widget);

  var _Templated2 = _interopRequireDefault(_argos_Templated);

  var _Calendar2 = _interopRequireDefault(_Calendar);

  var _TimePicker2 = _interopRequireDefault(_TimePicker);

  var __class = (0, _declare['default'])('argos.DateTimePicker', [_Widget2['default'], _Templated2['default']], {
    widgetTemplate: new Simplate(['<div class="datetime-select" data-dojo-attach-point="dateTimeNode">', '</div>']),

    _calendarNode: null,
    _timeSelectNode: null,
    isModal: false,

    init: function init() {
      this.inherited(arguments);
    },
    getContent: function getContent() {
      return [this._calendarNode, this._timeSelectNode];
    },
    hideChildModals: function hideChildModals() {
      if (this._calendarNode.hideModals) {
        this._calendarNode.hideModals();
      }
      if (this._timeSelectNode.hideModals) {
        this._timeSelectNode.hideModals();
      }
    },
    show: function show() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (!this._calendarNode && !this._timeSelectNode) {
        this._calendarNode = new _Calendar2['default']({ id: 'datetime-calendar', isModal: this.isModal || options.isModal });
        this._timeSelectNode = new _TimePicker2['default']({ id: 'datetime-timePicker', showSetTime: false });
        _domConstruct['default'].place(this._calendarNode.domNode, this.dateTimeNode);
        _domConstruct['default'].place(this._timeSelectNode.domNode, this.dateTimeNode);
        this._calendarNode.show(options);
        this._timeSelectNode.show(options);
      }
    }
  });

  module.exports = __class;
});
