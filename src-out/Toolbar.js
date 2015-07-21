<<<<<<< HEAD
define('argos/Toolbar', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/dom-style', 'dojo/dom-class', 'dijit/_Widget', './_ActionMixin', './_Templated'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoDomStyle, _dojoDomClass, _dijit_Widget, _ActionMixin2, _Templated2) {
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

    var _domStyle = _interopRequireDefault(_dojoDomStyle);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _Widget2 = _interopRequireDefault(_dijit_Widget);

    var _ActionMixin3 = _interopRequireDefault(_ActionMixin2);

    var _Templated3 = _interopRequireDefault(_Templated2);

    /**
     * @class argos.Toolbar
     * Toolbar is a base toolbar class that provides basic rendering of the bar, adding toolbar items and binding their invokacations.
     *
     * Inherits dijit _Widget.
     *
     * @alternateClassName Toolbar
     * @mixins argos._ActionMixin
     * @mixins argos._Templated
     */
    var __class = (0, _declare['default'])('argos.Toolbar', [_Widget2['default'], _ActionMixin3['default'], _Templated3['default']], {
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

/**
 * @class argos.Toolbar
 * Toolbar is a base toolbar class that provides basic rendering of the bar, adding toolbar items and binding their invokacations.
 *
 * Inherits dijit _Widget.
 *
 * @alternateClassName Toolbar
 * @mixins argos._ActionMixin
 * @mixins argos._Templated
 */
define('argos/Toolbar', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/dom-style',
    'dojo/dom-class',
    'dijit/_Widget',
    './_ActionMixin',
    './_Templated'
], function(
    declare,
    lang,
    domStyle,
    domClass,
    _Widget,
    _ActionMixin,
    _Templated
) {
    var __class = declare('argos.Toolbar', [_Widget, _ActionMixin, _Templated], {
>>>>>>> develop
        /**
         * @property {Simplate}
         * HTML markup of the toolbar
         */
        widgetTemplate: new Simplate(['<div class="toolbar">', '</div>']),
        /**
         * @property {Boolean}
         * State of toolbar
         */
        enabled: true,
        managed: true,
        /**
         * Expands the passed expression if it is a function.
         * @param {String/Function} expression Returns string directly, if function it is called and the result returned.
         * @return {String} String expression.
         */
<<<<<<< HEAD
        expandExpression: function expandExpression(expression) {
=======
        expandExpression: function(expression) {
>>>>>>> develop
            if (typeof expression === 'function') {
                return expression.apply(this, Array.prototype.slice.call(arguments, 1));
            } else {
                return expression;
            }
        },
        /**
         * Called upon application startup.
         */
<<<<<<< HEAD
        init: function init() {},
=======
        init: function() {
        },
>>>>>>> develop
        /**
         * When a tool is clicked on this function handles matching the node to toolbar item instance and performs the actual action
         * @param {Object} parameters An object of all the `data-` attributes of the node.
         * @param {Event} evt The event object
         * @param {HTMLElement} node The html element that was clicked.
         */
<<<<<<< HEAD
        invokeTool: function invokeTool(parameters, evt, node) {
=======
        invokeTool: function(parameters, evt, node) {
>>>>>>> develop
            var id = parameters && parameters.tool,
                tool = this.tools && this.tools[id],
                view,
                source = tool && tool.source;
            if (source && tool.enabled) {
                if (source.fn) {
                    source.fn.call(source.scope || this, source);
                } else if (source.action) {
                    view = App.getPrimaryActiveView();
                    if (view && view.hasAction(source.action)) {
<<<<<<< HEAD
                        view.invokeAction(source.action, _lang['default'].mixin(parameters, { '$tool': source }), evt, node);
=======
                        view.invokeAction(source.action, lang.mixin(parameters, {'$tool': source}), evt, node);
>>>>>>> develop
                    }
                }
            }
        },
        /**
         * Sets the toolbar style to block (visibile)
         */
<<<<<<< HEAD
        show: function show() {
            _domStyle['default'].set(this.domNode, 'display', 'block');
=======
        show: function() {
            domStyle.set(this.domNode, 'display', 'block');
>>>>>>> develop
        },
        /**
         * Sets the toolbar style to none (hidden)
         */
<<<<<<< HEAD
        hide: function hide() {
            _domStyle['default'].set(this.domNode, 'display', 'none');
=======
        hide: function() {
            domStyle.set(this.domNode, 'display', 'none');
>>>>>>> develop
        },
        /**
         * Empties the toolbar item collection and sets enabled to true
         */
<<<<<<< HEAD
        clear: function clear() {
=======
        clear: function() {
>>>>>>> develop
            this.tools = {};
            _domClass['default'].remove(this.domNode, 'toolbar-disabled');
            this.enabled = true;
        },
        /**
         * Removes the disabled style and sets enabled to true
         */
<<<<<<< HEAD
        enable: function enable() {
            _domClass['default'].remove(this.domNode, 'toolbar-disabled');
=======
        enable: function() {
            domClass.remove(this.domNode, 'toolbar-disabled');
>>>>>>> develop
            this.enabled = true;
        },
        /**
         * Adds a disabled style class and sets enabled to false
         */
<<<<<<< HEAD
        disable: function disable() {
            _domClass['default'].add(this.domNode, 'toolbar-disabled');
=======
        disable: function() {
            domClass.add(this.domNode, 'toolbar-disabled');
>>>>>>> develop
            this.enabled = false;
        },
        /**
         * Sets enabled to true of the toolbar item that matches the passed id
         * @param {String} id The id of the tool to enable
         */
<<<<<<< HEAD
        enableTool: function enableTool(id) {
=======
        enableTool: function(id) {
>>>>>>> develop
            var tool = this.tools && this.tools[id];
            if (tool) {
                tool.enabled = true;
            }
        },
        /**
         * Sets enabled to false of the toolbar item that matches the passed id
         * @param {String} id The id of the tool to disable
         */
<<<<<<< HEAD
        disableTool: function disableTool(id) {
=======
        disableTool: function(id) {
>>>>>>> develop
            var tool = this.tools && this.tools[id];
            if (tool) {
                tool.enabled = false;
            }
        },
        /**
         * Sets busy to true of the toolbar item that matches the passed id
         * @param {String} id The id of the tool to indicate busy
         */
<<<<<<< HEAD
        indicateToolBusy: function indicateToolBusy(id) {
=======
        indicateToolBusy: function(id) {
>>>>>>> develop
            var tool = this.tools && this.tools[id];
            if (tool) {
                tool.busy = true;
            }
        },
        /**
         * Sets busy to false of the toolbar item that matches the passed id
         * @param {String} id The id of the tool to set as not busy
         */
<<<<<<< HEAD
        clearToolBusy: function clearToolBusy(id) {
=======
        clearToolBusy: function(id) {
>>>>>>> develop
            var tool = this.tools && this.tools[id];
            if (tool) {
                tool.busy = false;
            }
        },
        /**
         * Checks the enabled property of the toolbar item that matches the passed id
         * @param {String} id The id of the tool
         * @return {Boolean} True if the toolbar item is enabled
         */
<<<<<<< HEAD
        isToolEnabled: function isToolEnabled(id) {
=======
        isToolEnabled: function(id) {
>>>>>>> develop
            return this.tools && this.tools[id] && this.tools[id].enabled;
        },
        /**
         * Replaces the existing toolbar item collection with the passed array of toolbar items and also checks toolbar security
         * @param {Object[]} tools Toolbar item array to store.
         */
<<<<<<< HEAD
        showTools: function showTools(tools) {
=======
        showTools: function(tools) {
>>>>>>> develop
            var tool, i;

            this.tools = {};

            if (typeof tools === 'undefined') {
                return;
            }

            for (i = 0; i < tools.length; i++) {
                tool = {
                    busy: false,
                    enabled: typeof tools[i].enabled !== 'undefined' ? tools[i].enabled : true,
                    source: tools[i]
                };

                // if tool is enabled, check security
                if (tool.enabled && tools[i].security) {
                    tool.enabled = App.hasAccessTo(this.expandExpression(tools[i].security));
                }

                this.tools[tools[i].id] = tool;
            }
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.Toolbar', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile.Toolbar', __class);
    return __class;
>>>>>>> develop
});
