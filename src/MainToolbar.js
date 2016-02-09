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
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import query from 'dojo/query';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import Toolbar from './Toolbar';
import getResource from './I18n';
import 'dojo/NodeList-manipulate';

const resource = getResource('mainToolbar');

/**
 * @class argos.MainToolbar
 * MainToolbar is designed to handle the top application bar with markup and logic to set
 * a title and position toolbar items to the left or right
 * @alternateClassName MainToolbar
 * @extends argos.Toolbar
 */
const __class = declare('argos.MainToolbar', [Toolbar], {
  /**
   * @property {Object}
   * Used to set the title node's innerHTML
   */
  attributeMap: {
    'title': {
      node: 'titleNode',
      type: 'innerHTML',
    },
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
    '</div>',
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
    '</button>',
  ]),
  /**
   * @property {Number}
   * Current number of toolbar items set
   */
  size: 0,

  /**
   * Text that is placed into the toolbar titleNode
   */
  titleText: resource.titleText,

  /**
   * Calls parent {@link Toolbar#clear clear} and removes all toolbar items from DOM.
   */
  clear: function clear() {
    this.inherited(arguments);

    query('> [data-action], .toolButton-right', this.domNode).remove();
  },
  /**
   * Calls parent {@link Toolbar#showTools showTools} which sets the tool collection.
   * The collection is then looped over and added to DOM, adding the left or right styling
   * @param {Object[]} tools Array of toolbar item definitions
   */
  showTools: function showTools(tools) {
    this.inherited(arguments);

    domClass.remove(this.domNode, 'toolbar-size-' + this.size);
    let onLine = this.app.onLine;
    if (tools) {
      const count = {
        left: 0,
        right: 0,
      };

      for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        const side = tool.side || 'right';
        const toolTemplate = tool.template || this.toolTemplate;
        count[side] += 1;
        if (tool.offline) {
          onLine = false;
        }
        domConstruct.place(toolTemplate.apply(tool, this.tools[tool.id]), this.domNode, 'last');
      }

      this.size = Math.max(count.left, count.right);
      domClass.add(this.domNode, 'toolbar-size-' + this.size);
      this.setMode(onLine);
    }
  },
  /**
   * Event handler that fires when the toolbar title is clicked.
   */
  onTitleClick: function onTitleClick(/*evt*/) {},
  setMode: function setMode(onLine) {
    domClass.remove(this.domNode, 'offline');
    if (!onLine) {
      domClass.add(this.domNode, 'offline');
    }
  },
});

lang.setObject('Sage.Platform.Mobile.MainToolbar', __class);
export default __class;
