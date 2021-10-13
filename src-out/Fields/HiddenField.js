define('argos/Fields/HiddenField', ['module', 'exports', 'dojo/_base/declare', './TextField', '../FieldManager'], function (module, exports, _declare, _TextField, _FieldManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _TextField2 = _interopRequireDefault(_TextField);

  var _FieldManager2 = _interopRequireDefault(_FieldManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/Fields/HiddenField
   * @classdesc The Hidden Field is {@link module:argos/Fields/TextField TextField} but instead binds to an `<input type="hidden"`>.
   *
   * Meaning that the field will not be displayed on screen but may still store strings of text.
   *
   * @example
   * {
   *   name: 'StatusCodeKey',
   *   property: 'StatusCodeKey',
   *   type: 'hidden'
   * }
   * @extends module:argos/Fields/TextField
   */
  var control = (0, _declare2.default)('argos.Fields.HiddenField', [_TextField2.default], /** @lends module:argos/Fields/HiddenField.prototype */{
    propertyTemplate: new Simplate(['<div style="display: none;" data-field="{%= $.name || $.property %}" data-field-type="{%= $.type %}">', '</div>']),

    /**
     * @property {Simplate}
     * Simplate that defines the fields HTML Markup
     *
     * * `$` => Field instance
     * * `$$` => Owner View instance
     *
     */
    widgetTemplate: new Simplate(['<input data-dojo-attach-point="inputNode" type="hidden">']),
    /**
     * @deprecated
     */
    bind: function bind() {
      // call field's bind. we don't want event handlers for this.
      this.inherited(bind, arguments);
    }
  }); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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
   * @module argos/Fields/HiddenField
   */
  exports.default = _FieldManager2.default.register('hidden', control);
  module.exports = exports['default'];
});