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
import Toolbar from './Toolbar';
import getResource from './I18n';
import $ from 'jquery';
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
    title: {
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
  /* widgetTemplate: new Simplate([
    '<div class="toolbar {%= $.cls %}">',
    '<div id="pageTitle" class="toolbar-title" data-dojo-attach-event="onclick: onTitleClick" data-dojo-attach-point="titleNode">{%= $.titleText %}</div>',
    '</div>',
  ]),*/
  widgetTemplate: new Simplate([`
    <nav id="application-menu" data-open-on-large="false" class="application-menu show-shadow"
      data-breakpoint="desktop" style="height: 100%;">
    </nav>
    <header class="header azure07 is-personalizable is-scrolled-down" data-options="{addScrollClass: true}">
      <div class="toolbar has-title-button" role="toolbar" aria-label="Layouts">
        <div class="title">
          <button class="btn-icon application-menu-trigger hide-focus" type="button" tabindex="0">
              <span class="audible">Show navigation</span>
              <span class="icon app-header">
                <span class="one"></span>
                <span class="two"></span>
                <span class="three"></span>
              </span>
          </button>
          <h1>
            <span id="pageTitle" data-dojo-attach-point="titleNode" data-dojo-attach-event="onclick: onTitleClick">{%= $.titleText %}</span>
          </h1>
        </div>
        <div class="buttonset" data-dojo-attach-point="toolNode">
        </div>
      </div>
    </header>
  `]),
  /**
   * @property {Simplate}
   * Simplate that defines the toolbar item HTML Markup
   *
   * `$` - The toolbar item object
   * `$$` - The toolbar instance
   */
  toolTemplate: new Simplate([`
      <button
        class="btn-icon hide-focus {%= $.cls %}"
        type="button"
        data-action="invokeTool"
        data-tool="{%= $.id %}">
          <span class="audible">{%: $.title || $.id %}</span>
      </button>
    `,
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
  initSoho: function sohoInit() {
    const menu = $('.application-menu', this.domNode);
    menu.applicationmenu();

    const accordion = $('.accordion.panel', this.domNode);
    accordion.accordion();

    const header = $('.header', this.domNode);
    header.header();

    const toolbar = $('.toolbar', this.domNode);
    toolbar.toolbar();
  },
  /**
   * Calls parent {@link Toolbar#showTools showTools} which sets the tool collection.
   * The collection is then looped over and added to DOM, adding the left or right styling
   * @param {Object[]} tools Array of toolbar item definitions
   */
  showTools: function showTools(tools) {
    this.inherited(arguments);

    $(this.domNode).removeClass(`toolbar-size-${this.size}`);
    let onLine = this.app.onLine;
    if (tools) {
      const count = {
        left: 0,
        right: 0,
      };

      $(this.toolNode).empty();

      for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        const side = tool.side || 'right';
        const toolTemplate = tool.template || this.toolTemplate;
        count[side] += 1;
        if (tool.offline) {
          onLine = false;
        }
        $(this.toolNode).append(toolTemplate.apply(tool, this.tools[tool.id]));
      }

      this.initSoho();

      this.size = Math.max(count.left, count.right);
      $(this.domNode).addClass(`toolbar-size-${this.size}`);
      this.setMode(onLine);
    }
  },
  /**
   * Event handler that fires when the toolbar title is clicked.
   */
  onTitleClick: function onTitleClick(/* evt*/) {},
  setMode: function setMode(onLine) {
    $(this.domNode).removeClass('offline');
    if (!onLine) {
      $(this.domNode).addClass('offline');
    }
  },
});

lang.setObject('Sage.Platform.Mobile.MainToolbar', __class);
export default __class;
