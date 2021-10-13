define('argos/MainToolbar', ['module', 'exports', 'dojo/_base/declare', './Toolbar', './I18n'], function (module, exports, _declare, _Toolbar, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Toolbar2 = _interopRequireDefault(_Toolbar);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('mainToolbar');

  /**
   * @class
   * @alias module:argos/MainToolbar
   * @classdesc MainToolbar is designed to handle the top application bar with markup and logic to set
   * a title and position toolbar items to the left or right
   * @extends module:argos/Toolbar
   */
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
   * @module argos/MainToolbar
   */
  var __class = (0, _declare2.default)('argos.MainToolbar', [_Toolbar2.default], /** @lends module:argos/MainToolbar.prototype */{
    /**
     * @property {Object}
     * Used to set the title node's innerHTML
     */
    attributeMap: {
      title: {
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
    widgetTemplate: new Simplate(['\n    <header class="header is-personalizable is-scrolled-down" data-options="{addScrollClass: true}">\n      <div class="toolbar do-resize has-more-button has-title-button" role="toolbar" aria-label="Layouts" data-options="{maxVisibleButtons: 4}">\n        <div class="title">\n          <button class="btn-icon application-menu-trigger hide-focus" type="button" tabindex="0">\n              <span class="audible">Show navigation</span>\n              <span class="icon app-header">\n                <span class="one"></span>\n                <span class="two"></span>\n                <span class="three"></span>\n              </span>\n          </button>\n          <h1 data-dojo-attach-point="titleNode">{%= $.titleText %}</h1>\n        </div>\n        <div class="buttonset" data-dojo-attach-point="toolNode">\n        </div>\n        <div class="more">\n          <button class="btn-actions page-changer" type="button" data-options="{attachToBody: true}">\n            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n              <use xlink:href="#icon-more"></use>\n            </svg>\n            <span class="audible" data-translate="text">More</span>\n          </button>\n          <ul id="app-toolbar-more" class="popupmenu is-selectable">\n            <li class="heading" role="presentation">{%= $.themeText %}</li>\n            <div data-dojo-attach-point="themeNode"></div>\n            <li class="separator" role="presentation"></li>\n            <li class="heading" role="presentation">{%= $.personalizationText %}</li>\n            <div data-dojo-attach-point="personalizationNode"></div>\n          </ul>\n        </div>\n      </div>\n    </header>\n  ']),
    themeTemplate: new Simplate(['<li class="is-selectable {% if($.name === $.selected) { %} is-checked {% }  %} ">', '<a href="#" tabindex="-1" role="menuitemcheckbox" data-theme="{%= $.data %}">{%= $.name %}</a>', '</li>']),
    personalizationTemplate: new Simplate(['<li class="is-selectable {% if($.name === $.selected) { %} is-checked {% }  %}">', '<a href="#" tabindex="-1" role="menuitem" data-rgbcolor="{%= $.data %}" data-colorid="{%= $.colorid %}">{%= $.name %}</a>', '</li>']),
    selectedTheme: '',
    selectedPersonalization: resource.defaultText,
    /**
     * @property {Simplate}
     * Simplate that defines the toolbar item HTML Markup
     *
     * `$` - The toolbar item object
     * `$$` - The toolbar instance
     */
    toolTemplate: new Simplate(['\n      <button\n        class="btn-tertiary hide-focus {%= $.cls %} toolButton-right"\n        type="button"\n        title="{%: $.title %}"\n        data-action="invokeTool"\n        data-tool="{%= $.id %}">\n        {% if ($.svg) { %}\n        <svg aria-hidden="true" focusable="false" role="presentation" class="icon">\n          <use xlink:href="#icon-{%= $.svg %}"/>\n        </svg>\n        {% } %}\n        <span>{%: $.title || $.id %}</span>\n      </button>\n    ']),
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
      this.inherited(clear, arguments);
      $('button.toolButton-right', this.toolNode).remove();
    },
    postCreate: function postCreate() {
      this.initSoho();
      this.inherited(postCreate, arguments);
    },
    _changePersonalization: function changeColor(mode, value) {
      App.preferences[mode] = value && value.nodeValue;
      App.persistPreferences();
    },
    buildPersonalizations: function buildPersonalizations() {
      var _this = this;

      var sohoColors = Soho.theme.personalizationColors();

      if (App && App.preferences && App.preferences.colorId) {
        var savedPersolization = sohoColors[App.preferences.colorId];
        this.selectedPersonalization = savedPersolization && savedPersolization.name;
      }
      if (App && App.preferences && App.preferences.theme) {
        var savedTheme = Soho.theme.themes().find(function (obj) {
          return obj.id === App.preferences.theme;
        });
        this.selectedTheme = savedTheme && savedTheme.name;
      }
      Object.keys(sohoColors).forEach(function (key) {
        var color = sohoColors[key];
        var pers = $(_this.personalizationTemplate.apply({
          name: color.name,
          data: color.value,
          colorid: color.id,
          selected: _this.selectedPersonalization
        }, _this));

        $(_this.personalizationNode).append(pers);
      });
      $(this.personalizationNode).click(function (e) {
        _this._changePersonalization('colorId', e.target.attributes['data-colorid']);
        _this._changePersonalization('color', e.target.attributes['data-rgbcolor']);
      });
      Soho.theme.themes().forEach(function (item) {
        var theme = $(_this.themeTemplate.apply({
          name: item.name,
          data: item.id,
          selected: _this.selectedTheme
        }, _this));
        $(_this.themeNode).append(theme);
      });
      $(this.themeNode).click(function (e) {
        _this._changePersonalization('theme', e.target.attributes['data-theme']);
      });
    },
    initSoho: function initSoho() {
      this.buildPersonalizations();

      var header = $(this.domNode);
      header.header();
      this.toolbar = header.find('.toolbar').data('toolbar');

      $('.title > h1', this.domNode).on('click', this.onTitleClick);

      // init personalization
      $('html').personalize({
        colors: App && App.preferences && App.preferences.color,
        theme: App && App.preferences && App.preferences.theme
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
      this.inherited(showTools, arguments);
      $(this.domNode).removeClass('toolbar-size-' + this.size);
      var onLine = this.app.onLine;
      if (tools) {
        var count = {
          left: 0,
          right: 0
        };

        // remove buttons from prev view
        $('button.toolButton-right', this.toolNode).remove();

        for (var i = 0; i < tools.length; i++) {
          var tool = tools[i];
          var side = tool.side || 'right';
          var toolTemplate = tool.template || this.toolTemplate;
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
        $(this.domNode).addClass('toolbar-size-' + this.size);
        this.setMode(onLine);
      }
    },
    /**
     * Event handler that fires when the toolbar title is clicked.
     */
    onTitleClick: function onTitleClick() /* evt*/{},
    setMode: function setMode(onLine) {
      $(this.domNode).removeClass('offline');
      if (!onLine) {
        $(this.domNode).addClass('offline');
      }
    },

    disableTool: function disableTool(id) {
      this.inherited(disableTool, arguments);
      var result = this._getToolDOMNode(id);
      if (result) {
        $(result).addClass('toolButton-disabled');
        result.disabled = true;
      }
    },
    enableTool: function enableTool(id) {
      this.inherited(enableTool, arguments);
      var result = this._getToolDOMNode(id);
      if (result) {
        $(result).removeClass('toolButton-disabled');
        result.disabled = false;
      }
    },
    _getToolDOMNode: function _getToolDOMNode(id) {
      var result = $('button[data-tool=' + id + ']', this.domNode).first();
      return result;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});