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
import Toolbar from './Toolbar';
import getResource from './I18n';


const resource = getResource('mainToolbar');

/**
 * @class argos.MainToolbar
 * @classdesc MainToolbar is designed to handle the top application bar with markup and logic to set
 * a title and position toolbar items to the left or right
 * @extends argos.Toolbar
 */
const __class = declare('argos.MainToolbar', [Toolbar], /** @lends argos.MainToolbar# */{
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
  widgetTemplate: new Simplate([`
    <header class="header is-personalizable is-scrolled-down" data-options="{addScrollClass: true}">
      <div class="toolbar do-resize has-more-button has-title-button" role="toolbar" aria-label="Layouts">
        <div class="title">
          <button class="btn-icon application-menu-trigger hide-focus" type="button" tabindex="0">
              <span class="audible">Show navigation</span>
              <span class="icon app-header">
                <span class="one"></span>
                <span class="two"></span>
                <span class="three"></span>
              </span>
          </button>
          <h1 data-dojo-attach-point="titleNode">{%= $.titleText %}</h1>
        </div>
        <div class="buttonset" data-dojo-attach-point="toolNode">
        </div>
        <div class="more">
          <button class="btn-actions page-changer" type="button" data-options="{attachToBody: true}">
            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
              <use xlink:href="#icon-more"></use>
            </svg>
            <span class="audible" data-translate="text">More</span>
          </button>
          <ul id="app-toolbar-more" class="popupmenu is-selectable">
            <li class="heading" role="presentation">{%= $.themeText %}</li>
            <div data-dojo-attach-point="themeNode"></div>
            <li class="separator" role="presentation"></li>
            <li class="heading" role="presentation">{%= $.personalizationText %}</li>
            <div data-dojo-attach-point="personalizationNode"></div>
          </ul>
        </div>
      </div>
    </header>
  `]),
  themeTemplate: new Simplate([
    '<li class="is-selectable {% if($.name === $.selected) { %} is-checked {% }  %} ">',
    '<a href="#" tabindex="-1" role="menuitemcheckbox" data-theme="{%= $.data %}">{%= $.name %}</a>',
    '</li>',
  ]),
  personalizationTemplate: new Simplate([
    '<li class="is-selectable {% if($.name === $.selected) { %} is-checked {% }  %}">',
    '<a href="#" tabindex="-1" role="menuitem" data-rgbcolor="{%= $.data %}">{%= $.name %}</a>',
    '</li>',
  ]),
  selectedTheme: resource.lightText,
  selectedPersonalization: resource.defaultText,
  themes: [{
    name: resource.lightText,
    data: 'light',
  }, {
    name: resource.darkText,
    data: 'dark',
  }, {
    name: resource.highContrastText,
    data: 'high-contrast',
  }],
  personalizations: [{
    name: resource.defaultText,
    data: '#2578a9',
  }, {
    name: resource.azureText,
    data: '#368AC0',
  }, {
    name: resource.amberText,
    data: '#EFA836',
  }, {
    name: resource.amethystText,
    data: '#9279A6',
  }, {
    name: resource.turqoiseText,
    data: '#579E95',
  }, {
    name: resource.emeraldText,
    data: '#76B051',
  }, {
    name: resource.graphiteText,
    data: '#5C5C5C',
  }],
  /**
   * @property {Simplate}
   * Simplate that defines the toolbar item HTML Markup
   *
   * `$` - The toolbar item object
   * `$$` - The toolbar instance
   */
  toolTemplate: new Simplate([`
      <button
        class="btn-icon {%= $.cls %} toolButton-right"
        type="button"
        title="{%: $.title || $.id %}"
        data-action="invokeTool"
        data-tool="{%= $.id %}">
        {% if ($.svg) { %}
        <svg aria-hidden="true" focusable="false" role="presentation" class="icon">
          <use xlink:href="#icon-{%= $.svg %}"/>
        </svg>
        {% } %}
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
  personalizationText: resource.personalizationText,
  themeText: resource.themeText,

  /**
   * Calls parent {@link Toolbar#clear clear} and removes all toolbar items from DOM.
   */
  clear: function clear() {
    this.inherited(arguments);
    $('button.toolButton-right', this.toolNode).remove();
  },
  postCreate: function postCreate() {
    this.initSoho();
    this.inherited(arguments);
  },
  _changePersonalization: function changeColor(mode, value) {
    App.preferences[mode] = value && value.nodeValue;
    App.persistPreferences();
  },
  buildPersonalizations: function buildPersonalizations() {
    if (App && App.preferences && App.preferences.color) {
      const savedPersolization = this.personalizations.find(obj => obj.data === App.preferences.color);
      this.selectedPersonalization = savedPersolization && savedPersolization.name;
    }
    if (App && App.preferences && App.preferences.theme) {
      const savedTheme = this.themes.find(obj => obj.data === App.preferences.theme);
      this.selectedTheme = savedTheme && savedTheme.name;
    }
    this.personalizations.forEach((item) => {
      const pers = $(this.personalizationTemplate.apply({
        name: item.name,
        data: item.data,
        selected: this.selectedPersonalization,
      }, this));

      $(this.personalizationNode).append(pers);
    });
    $(this.personalizationNode).click((e) => {
      this._changePersonalization('color', e.target.attributes['data-rgbcolor']);
    });
    this.themes.forEach((item) => {
      const theme = $(this.themeTemplate.apply({
        name: item.name,
        data: item.data,
        selected: this.selectedTheme,
      }, this));
      $(this.themeNode).append(theme);
    });
    $(this.themeNode).click((e) => {
      this._changePersonalization('theme', e.target.attributes['data-theme']);
    });
  },
  initSoho: function initSoho() {
    this.buildPersonalizations();

    const header = $(this.domNode);
    header.header();
    this.toolbar = header.find('.toolbar').data('toolbar');

    $('.title > h1', this.domNode).on('click', this.onTitleClick);

    // init personalization
    $('body').personalize({
      colors: App && App.preferences && App.preferences.color,
      theme: App && App.preferences && App.preferences.theme,
    });
  },
  updateSoho: function updateSoho() {
    // updating soho header resets the header text to zero level. update only toolbbar for now.
    // INFORCRM-16000: added check for toolbar - UpdateToolbar.js uses argos/MainToolbar for controlling visibility
    if (this.toolbar) {
      this.toolbar.updated();
    }
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

      // remove buttons from prev view
      $('button.toolButton-right', this.toolNode).remove();

      for (let i = 0; i < tools.length; i++) {
        const tool = tools[i];
        const side = tool.side || 'right';
        const toolTemplate = tool.template || this.toolTemplate;
        count[side] += 1;
        if (tool.offline) {
          onLine = false;
        }
        if (tool.cls !== 'display-none') {
          $(this.toolNode).prepend(toolTemplate.apply(tool, this.tools[tool.id]));
        }
      }

      this.updateSoho();

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

  disableTool: function disableTool(id) {
    this.inherited(arguments);
    const result = this._getToolDOMNode(id);
    if (result) {
      $(result).addClass('toolButton-disabled');
    }
  },
  enableTool: function enableTool(id) {
    this.inherited(arguments);
    const result = this._getToolDOMNode(id);
    if (result) {
      $(result).removeClass('toolButton-disabled');
    }
  },
  _getToolDOMNode: function _getToolDOMNode(id) {
    const [result] = $(`button[data-tool=${id}]`, this.domNode);
    return result;
  },
});

export default __class;
