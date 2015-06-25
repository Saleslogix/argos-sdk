define('argos/Fields/HiddenField', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', './TextField', '../FieldManager'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _TextField, _FieldManager) {
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

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _TextField2 = _interopRequireDefault(_TextField);

    var _FieldManager2 = _interopRequireDefault(_FieldManager);

    /**
     * @class argos.Fields.HiddenField
     * The Hidden Field is {@link TextField TextField} but instead binds to an `<input type="hidden"`>.
     *
     * Meaning that the field will not be displayed on screen but may still store strings of text.
     *
     * ###Example:
     *     {
     *         name: 'StatusCodeKey',
     *         property: 'StatusCodeKey',
     *         type: 'hidden'
     *     }
     *
     * @alternateClassName HiddenField
     * @extends argos.Fields.TextField
     * @requires argos.FieldManager
     */
    var control = (0, _declare['default'])('argos.Fields.HiddenField', [_TextField2['default']], {
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
            this.inherited(arguments);
        }
    });

    _lang['default'].setObject('Sage.Platform.Mobile.Fields.HiddenField', control);
    module.exports = _FieldManager2['default'].register('hidden', control);
});
