<<<<<<< HEAD
define('argos/Fields/BooleanField', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/dom-attr', 'dojo/dom-class', './_Field', '../FieldManager'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoDomAttr, _dojoDomClass, _Field, _FieldManager) {
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

    var _domAttr = _interopRequireDefault(_dojoDomAttr);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _Field2 = _interopRequireDefault(_Field);

    var _FieldManager2 = _interopRequireDefault(_FieldManager);

=======
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

define('argos/Fields/BooleanField', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-attr',
    'dojo/dom-class',
    './_Field',
    '../FieldManager'
], function(
    declare,
    lang,
    domAttr,
    domClass,
    Field,
    FieldManager
) {
>>>>>>> develop
    /**
     * @class argos.Fields.BooleanField
     * The Boolean Field is used for true/false values and is visualized as a toggle or light switch.
     *
     * ###Example:
     *     {
     *         name: 'IsLead',
     *         property: 'IsLead',
     *         label: this.isLeadText,
     *         type: 'boolean'
     *     }
     *
     * @alternateClassName BooleanField
     * @extends argos.Fields._Field
     * @requires argos.FieldManager
     */
    var control = (0, _declare['default'])('argos.Fields.BooleanField', [_Field2['default']], {
        /**
         * @property {Object}
         * Provides a setter to the toggleNodes toggled attribute
         */
        attributeMap: {
            toggled:{
                node: 'toggleNode',
                type: 'attribute',
                attribute: 'toggled'
            }
        },
        /**
         * @property {Simplate}
         * Simplate that defines the fields HTML Markup
         *
         * * `$` => Field instance
         * * `$$` => Owner View instance
         *
         */
<<<<<<< HEAD
        widgetTemplate: new Simplate(['<label for="{%= $.name %}">{%: $.label %}</label>', '<div class="toggle" data-dojo-attach-point="toggleNode" data-dojo-attach-event="onclick:_onClick" toggled="{%= !!$.checked %}">', '<span class="thumb"></span>', '</div>']),
=======
        widgetTemplate: new Simplate([
            '<label for="{%= $.name %}">{%: $.label %}</label>',
            '<div class="toggle" data-dojo-attach-point="toggleNode" data-dojo-attach-event="onclick:_onClick" toggled="{%= !!$.checked %}">',
                '<span class="thumb"></span>',
            '</div>'
        ]),
>>>>>>> develop
        /**
         * @property {HTMLElement}
         * The div node that holds the toggled attribute
         */
        toggleNode: null,

        /**
         * @property {Boolean}
         * When clearing the boolean field it sets the fields value to `this.checked`
         */
        checked: false,

        /**
         * Value used during dirty/modified comparison
         */
        originalValue: null,

        /**
         * Fires with the toggle switch is pressed and sets the value to
         * the opposite of the current value
         * @param {Event} evt The click/tap event
         */
<<<<<<< HEAD
        _onClick: function _onClick(evt) {
=======
        _onClick: function(evt) {
>>>>>>> develop
            if (this.isDisabled()) {
                return;
            }

            var toggledValue = !this.getValue();

            this.setValue(toggledValue);
        },
        /**
         * Returns the current toggled state
         * @return {Boolean}
         */
<<<<<<< HEAD
        getValue: function getValue() {
            return _domAttr['default'].get(this.toggleNode, 'toggled') === true;
=======
        getValue: function() {
            return (domAttr.get(this.toggleNode, 'toggled') === true);
>>>>>>> develop
        },
        /**
         * Sets the toggled attribute of the field and applies the needed styling.
         *
         * It also directly fires the {@link _Field#onChange onChange} event.
         *
         * @param {Boolean/String/Number} val If string is passed it will use `'true'` or `'t'` for true. If number then 0 for true.
         * @param {Boolean} initial If true sets the value as the original value and is later used for dirty/modified detection.
         */
<<<<<<< HEAD
        setValue: function setValue(val, initial) {
            val = typeof val === 'string' ? /^(true|t|0)$/i.test(val) : !!val;
=======
        setValue: function(val, initial) {
            val = typeof val === 'string'
                ? /^(true|t|0)$/i.test(val)
                : !!val;
>>>>>>> develop

            if (initial) {
                this.originalValue = val;
            }

<<<<<<< HEAD
            _domAttr['default'].set(this.toggleNode, 'toggled', val);

            if (val === false) {
                _domClass['default'].remove(this.toggleNode, 'toggleStateOn');
            } else {
                _domClass['default'].add(this.toggleNode, 'toggleStateOn');
=======
            domAttr.set(this.toggleNode, 'toggled', val);

            if (val === false) {
                domClass.remove(this.toggleNode, 'toggleStateOn');
            } else {
                domClass.add(this.toggleNode, 'toggleStateOn');
>>>>>>> develop
            }

            this.onChange(val, this);
        },
        /**
         * Sets the value back to `this.checked` as the initial value. If true is passed it sets
         * `this.checked` as a dirty/modified value.
         * @param {Boolean} flag Signifies if the cleared value should be set as modified (true) or initial (false/undefined)
         */
<<<<<<< HEAD
        clearValue: function clearValue(flag) {
=======
        clearValue: function(flag) {
>>>>>>> develop
            var initial = flag !== true;

            this.setValue(this.checked, initial);
        },
        /**
         * Determines if the field has been modified from it's original value
         * @return {Boolean}
         */
<<<<<<< HEAD
        isDirty: function isDirty() {
            return this.originalValue !== this.getValue();
        }
    });

    _lang['default'].setObject('Sage.Platform.Mobile.Fields.BooleanField', control);
    module.exports = _FieldManager2['default'].register('boolean', control);
=======
        isDirty: function() {
            return (this.originalValue !== this.getValue());
        }
    });

    lang.setObject('Sage.Platform.Mobile.Fields.BooleanField', control);
    return FieldManager.register('boolean', control);
>>>>>>> develop
});
