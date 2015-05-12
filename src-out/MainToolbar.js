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
 * @class argos.MainToolbar
 * MainToolbar is designed to handle the top application bar with markup and logic to set
 * a title and position toolbar items to the left or right
 * @alternateClassName MainToolbar
 * @extends argos.Toolbar
 */
define('argos/MainToolbar', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/query',
    'dojo/dom-class',
    'dojo/dom-construct',
    'argos/Toolbar',
    'dojo/NodeList-manipulate'
], function (declare, lang, query, domClass, domConstruct, Toolbar) {
    var __class = declare('argos.MainToolbar', [Toolbar], {
        /**
         * @property {Object}
         * Used to set the title node's innerHTML
         */
        attributeMap: {
            'title': {
                node: 'titleNode',
                type: 'innerHTML'
            }
        },
        /**
         * @property {Simplate}
         * Simplate that defines the main HTML Markup of the toolbar
         *
         * `$` - the toolbar instance
         */
        widgetTemplate: new Simplate([
            '<div class="toolbar {%= $.cls %}">',
            '<div id="pageTitle" class="toolbar-title" data-dojo-attach-event="onclick: onTitleClick" data-dojo-attach-point="titleNode">{%= $.titleText %}</div>',
            '</div>'
        ]),
        /**
         * @property {Simplate}
         * Simplate that defines the toolbar item HTML Markup
         *
         * `$` - The toolbar item object
         * `$$` - The toolbar instance
         */
        toolTemplate: new Simplate([
            '<button class="button toolButton toolButton-{%= $.side || "right" %} {%= ($$.enabled) ? "" : "toolButton-disabled" %} {%= $.cls %}"',
            'data-action="invokeTool" data-tool="{%= $.id %}"',
            'aria-label="{%: $.title || $.id %}">',
            '{% if ($.icon) { %}',
            '<img src="{%= $.icon %}" alt="{%= $.id %}" />',
            '{% } %}',
            '{% if (!$.cls) { %}',
            '<span></span>',
            '{% } %}',
            '</button>'
        ]),
        /**
         * @property {Number}
         * Current number of toolbar items set
         */
        size: 0,
        /**
         * Text that is placed into the toolbar titleNode
         */
        titleText: 'Mobile',
        /**
         * Calls parent {@link Toolbar#clear clear} and removes all toolbar items from DOM.
         */
        clear: function () {
            this.inherited(arguments);
            query('> [data-action], .toolButton-right', this.domNode).remove();
        },
        /**
         * Calls parent {@link Toolbar#showTools showTools} which sets the tool collection.
         * The collection is then looped over and added to DOM, adding the left or right styling
         * @param {Object[]} tools Array of toolbar item definitions
         */
        showTools: function (tools) {
            var count, i, toolTemplate, side, tool;
            this.inherited(arguments);
            domClass.remove(this.domNode, 'toolbar-size-' + this.size);
            if (tools) {
                count = { left: 0, right: 0 };
                for (i = 0; i < tools.length; i++) {
                    tool = tools[i];
                    side = tool.side || 'right';
                    count[side] += 1;
                    toolTemplate = tool.template || this.toolTemplate;
                    domConstruct.place(toolTemplate.apply(tool, this.tools[tool.id]), this.domNode, 'last');
                }
                this.size = Math.max(count.left, count.right);
                domClass.add(this.domNode, 'toolbar-size-' + this.size);
            }
        },
        /**
         * Event handler that fires when the toolbar title is clicked.
         */
        onTitleClick: function (evt) {
        }
    });
    lang.setObject('Sage.Platform.Mobile.MainToolbar', __class);
    return __class;
});
