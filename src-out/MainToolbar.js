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
   * @class argos.MainToolbar
   * @classdesc MainToolbar is designed to handle the top application bar with markup and logic to set
   * a title and position toolbar items to the left or right
   * @extends argos.Toolbar
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

  var __class = (0, _declare2.default)('argos.MainToolbar', [_Toolbar2.default], /** @lends argos.MainToolbar# */{
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
    widgetTemplate: new Simplate(['\n    <header class="header is-personalizable is-scrolled-down" data-options="{addScrollClass: true}">\n      <div class="toolbar do-resize has-more-button has-title-button" role="toolbar" aria-label="Layouts" data-options="{maxVisibleButtons: 2}">\n        <div class="title">\n          <button class="btn-icon application-menu-trigger hide-focus" type="button" tabindex="0">\n              <span class="audible">Show navigation</span>\n              <span class="icon app-header">\n                <span class="one"></span>\n                <span class="two"></span>\n                <span class="three"></span>\n              </span>\n          </button>\n          <h1 data-dojo-attach-point="titleNode">{%= $.titleText %}</h1>\n        </div>\n        <div class="buttonset" data-dojo-attach-point="toolNode">\n        </div>\n        <div class="more">\n          <button class="btn-actions page-changer" type="button" data-options="{attachToBody: true}">\n            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n              <use xlink:href="#icon-more"></use>\n            </svg>\n            <span class="audible" data-translate="text">More</span>\n          </button>\n          <ul id="app-toolbar-more" class="popupmenu is-selectable">\n            <li class="heading" role="presentation">{%= $.themeText %}</li>\n            <div data-dojo-attach-point="themeNode"></div>\n            <li class="separator" role="presentation"></li>\n            <li class="heading" role="presentation">{%= $.personalizationText %}</li>\n            <div data-dojo-attach-point="personalizationNode"></div>\n          </ul>\n        </div>\n      </div>\n    </header>\n  ']),
    themeTemplate: new Simplate(['<li class="is-selectable {% if($.name === $.selected) { %} is-checked {% }  %} ">', '<a href="#" tabindex="-1" role="menuitemcheckbox" data-theme="{%= $.data %}">{%= $.name %}</a>', '</li>']),
    personalizationTemplate: new Simplate(['<li class="is-selectable {% if($.name === $.selected) { %} is-checked {% }  %}">', '<a href="#" tabindex="-1" role="menuitem" data-rgbcolor="{%= $.data %}">{%= $.name %}</a>', '</li>']),
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

      if (App && App.preferences && App.preferences.color) {
        var savedPersolization = sohoColors[App.preferences.color];
        this.selectedPersonalization = savedPersolization && savedPersolization.name;
      }
      if (App && App.preferences && App.preferences.theme) {
        var savedTheme = Soho.theme.themes().find(function (obj) {
          return obj.data === App.preferences.theme;
        });
        this.selectedTheme = savedTheme && savedTheme.name;
      }
      Object.keys(sohoColors).forEach(function (key) {
        var color = sohoColors[key];
        var pers = $(_this.personalizationTemplate.apply({
          name: color.name,
          data: color.value,
          selected: _this.selectedPersonalization
        }, _this));

        $(_this.personalizationNode).append(pers);
      });
      $(this.personalizationNode).click(function (e) {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NYWluVG9vbGJhci5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJhdHRyaWJ1dGVNYXAiLCJ0aXRsZSIsIm5vZGUiLCJ0eXBlIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsInRoZW1lVGVtcGxhdGUiLCJwZXJzb25hbGl6YXRpb25UZW1wbGF0ZSIsInNlbGVjdGVkVGhlbWUiLCJzZWxlY3RlZFBlcnNvbmFsaXphdGlvbiIsImRlZmF1bHRUZXh0IiwidG9vbFRlbXBsYXRlIiwic2l6ZSIsInRpdGxlVGV4dCIsInBlcnNvbmFsaXphdGlvblRleHQiLCJ0aGVtZVRleHQiLCJjbGVhciIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsIiQiLCJ0b29sTm9kZSIsInJlbW92ZSIsInBvc3RDcmVhdGUiLCJpbml0U29obyIsIl9jaGFuZ2VQZXJzb25hbGl6YXRpb24iLCJjaGFuZ2VDb2xvciIsIm1vZGUiLCJ2YWx1ZSIsIkFwcCIsInByZWZlcmVuY2VzIiwibm9kZVZhbHVlIiwicGVyc2lzdFByZWZlcmVuY2VzIiwiYnVpbGRQZXJzb25hbGl6YXRpb25zIiwic29ob0NvbG9ycyIsIlNvaG8iLCJ0aGVtZSIsInBlcnNvbmFsaXphdGlvbkNvbG9ycyIsImNvbG9yIiwic2F2ZWRQZXJzb2xpemF0aW9uIiwibmFtZSIsInNhdmVkVGhlbWUiLCJ0aGVtZXMiLCJmaW5kIiwib2JqIiwiZGF0YSIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwicGVycyIsImFwcGx5Iiwic2VsZWN0ZWQiLCJwZXJzb25hbGl6YXRpb25Ob2RlIiwiYXBwZW5kIiwiY2xpY2siLCJlIiwidGFyZ2V0IiwiYXR0cmlidXRlcyIsIml0ZW0iLCJpZCIsInRoZW1lTm9kZSIsImhlYWRlciIsImRvbU5vZGUiLCJ0b29sYmFyIiwib24iLCJvblRpdGxlQ2xpY2siLCJwZXJzb25hbGl6ZSIsImNvbG9ycyIsInVwZGF0ZVNvaG8iLCJ1cGRhdGVkIiwic2hvd1Rvb2xzIiwidG9vbHMiLCJyZW1vdmVDbGFzcyIsIm9uTGluZSIsImFwcCIsImNvdW50IiwibGVmdCIsInJpZ2h0IiwiaSIsImxlbmd0aCIsInRvb2wiLCJzaWRlIiwidGVtcGxhdGUiLCJvZmZsaW5lIiwiY2xzIiwicHJlcGVuZCIsIk1hdGgiLCJtYXgiLCJhZGRDbGFzcyIsInNldE1vZGUiLCJkaXNhYmxlVG9vbCIsInJlc3VsdCIsIl9nZXRUb29sRE9NTm9kZSIsImRpc2FibGVkIiwiZW5hYmxlVG9vbCIsImZpcnN0Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxNQUFNQSxXQUFXLG9CQUFZLGFBQVosQ0FBakI7O0FBRUE7Ozs7OztBQXRCQTs7Ozs7Ozs7Ozs7Ozs7O0FBNEJBLE1BQU1DLFVBQVUsdUJBQVEsbUJBQVIsRUFBNkIsbUJBQTdCLEVBQXdDLGdDQUFnQztBQUN0Rjs7OztBQUlBQyxrQkFBYztBQUNaQyxhQUFPO0FBQ0xDLGNBQU0sV0FERDtBQUVMQyxjQUFNO0FBRkQ7QUFESyxLQUx3RTtBQVd0Rjs7Ozs7O0FBTUFDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEsMnFEQUFiLENBakJzRTtBQW1EdEZDLG1CQUFlLElBQUlELFFBQUosQ0FBYSxDQUMxQixtRkFEMEIsRUFFMUIsZ0dBRjBCLEVBRzFCLE9BSDBCLENBQWIsQ0FuRHVFO0FBd0R0RkUsNkJBQXlCLElBQUlGLFFBQUosQ0FBYSxDQUNwQyxrRkFEb0MsRUFFcEMsMkZBRm9DLEVBR3BDLE9BSG9DLENBQWIsQ0F4RDZEO0FBNkR0RkcsbUJBQWUsRUE3RHVFO0FBOER0RkMsNkJBQXlCWCxTQUFTWSxXQTlEb0Q7QUErRHRGOzs7Ozs7O0FBT0FDLGtCQUFjLElBQUlOLFFBQUosQ0FBYSw2ZEFBYixDQXRFd0U7QUFzRnRGOzs7O0FBSUFPLFVBQU0sQ0ExRmdGOztBQTRGdEY7OztBQUdBQyxlQUFXZixTQUFTZSxTQS9Ga0U7QUFnR3RGQyx5QkFBcUJoQixTQUFTZ0IsbUJBaEd3RDtBQWlHdEZDLGVBQVdqQixTQUFTaUIsU0Fq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cEMsV0FBSzFDLFNBQUwsQ0FBZXlFLFdBQWYsRUFBNEJ4RSxTQUE1QjtBQUNBLFVBQU15RSxTQUFTLEtBQUtDLGVBQUwsQ0FBcUJqQyxFQUFyQixDQUFmO0FBQ0EsVUFBSWdDLE1BQUosRUFBWTtBQUNWeEUsVUFBRXdFLE1BQUYsRUFBVUgsUUFBVixDQUFtQixxQkFBbkI7QUFDQUcsZUFBT0UsUUFBUCxHQUFrQixJQUFsQjtBQUNEO0FBQ0YsS0FwT3FGO0FBcU90RkMsZ0JBQVksU0FBU0EsVUFBVCxDQUFvQm5DLEVBQXBCLEVBQXdCO0FBQ2xDLFdBQUsxQyxTQUFMLENBQWU2RSxVQUFmLEVBQTJCNUUsU0FBM0I7QUFDQSxVQUFNeUUsU0FBUyxLQUFLQyxlQUFMLENBQXFCakMsRUFBckIsQ0FBZjtBQUNBLFVBQUlnQyxNQUFKLEVBQVk7QUFDVnhFLFVBQUV3RSxNQUFGLEVBQVVuQixXQUFWLENBQXNCLHFCQUF0QjtBQUNBbUIsZUFBT0UsUUFBUCxHQUFrQixLQUFsQjtBQUNEO0FBQ0YsS0E1T3FGO0FBNk90RkQscUJBQWlCLFNBQVNBLGVBQVQsQ0FBeUJqQyxFQUF6QixFQUE2QjtBQUM1QyxVQUFNZ0MsU0FBU3hFLHdCQUFzQndDLEVBQXRCLFFBQTZCLEtBQUtHLE9BQWxDLEVBQTJDaUMsS0FBM0MsRUFBZjtBQUNBLGFBQU9KLE1BQVA7QUFDRDtBQWhQcUYsR0FBeEUsQ0FBaEI7O29CQW1QZTVGLE8iLCJmaWxlIjoiTWFpblRvb2xiYXIuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBUb29sYmFyIGZyb20gJy4vVG9vbGJhcic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ21haW5Ub29sYmFyJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLk1haW5Ub29sYmFyXHJcbiAqIEBjbGFzc2Rlc2MgTWFpblRvb2xiYXIgaXMgZGVzaWduZWQgdG8gaGFuZGxlIHRoZSB0b3AgYXBwbGljYXRpb24gYmFyIHdpdGggbWFya3VwIGFuZCBsb2dpYyB0byBzZXRcclxuICogYSB0aXRsZSBhbmQgcG9zaXRpb24gdG9vbGJhciBpdGVtcyB0byB0aGUgbGVmdCBvciByaWdodFxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5Ub29sYmFyXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuTWFpblRvb2xiYXInLCBbVG9vbGJhcl0sIC8qKiBAbGVuZHMgYXJnb3MuTWFpblRvb2xiYXIjICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFVzZWQgdG8gc2V0IHRoZSB0aXRsZSBub2RlJ3MgaW5uZXJIVE1MXHJcbiAgICovXHJcbiAgYXR0cmlidXRlTWFwOiB7XHJcbiAgICB0aXRsZToge1xyXG4gICAgICBub2RlOiAndGl0bGVOb2RlJyxcclxuICAgICAgdHlwZTogJ2lubmVySFRNTCcsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIG1haW4gSFRNTCBNYXJrdXAgb2YgdGhlIHRvb2xiYXJcclxuICAgKlxyXG4gICAqIGAkYCAtIHRoZSB0b29sYmFyIGluc3RhbmNlXHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgPGhlYWRlciBjbGFzcz1cImhlYWRlciBpcy1wZXJzb25hbGl6YWJsZSBpcy1zY3JvbGxlZC1kb3duXCIgZGF0YS1vcHRpb25zPVwie2FkZFNjcm9sbENsYXNzOiB0cnVlfVwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwidG9vbGJhciBkby1yZXNpemUgaGFzLW1vcmUtYnV0dG9uIGhhcy10aXRsZS1idXR0b25cIiByb2xlPVwidG9vbGJhclwiIGFyaWEtbGFiZWw9XCJMYXlvdXRzXCIgZGF0YS1vcHRpb25zPVwie21heFZpc2libGVCdXR0b25zOiAyfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1pY29uIGFwcGxpY2F0aW9uLW1lbnUtdHJpZ2dlciBoaWRlLWZvY3VzXCIgdHlwZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXVkaWJsZVwiPlNob3cgbmF2aWdhdGlvbjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb24gYXBwLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvbmVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR3b1wiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGhyZWVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8aDEgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRpdGxlTm9kZVwiPnslPSAkLnRpdGxlVGV4dCAlfTwvaDE+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNldFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ0b29sTm9kZVwiPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlXCI+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWFjdGlvbnMgcGFnZS1jaGFuZ2VyXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtb3B0aW9ucz1cInthdHRhY2hUb0JvZHk6IHRydWV9XCI+XHJcbiAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tbW9yZVwiPjwvdXNlPlxyXG4gICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhdWRpYmxlXCIgZGF0YS10cmFuc2xhdGU9XCJ0ZXh0XCI+TW9yZTwvc3Bhbj5cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPHVsIGlkPVwiYXBwLXRvb2xiYXItbW9yZVwiIGNsYXNzPVwicG9wdXBtZW51IGlzLXNlbGVjdGFibGVcIj5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwiaGVhZGluZ1wiIHJvbGU9XCJwcmVzZW50YXRpb25cIj57JT0gJC50aGVtZVRleHQgJX08L2xpPlxyXG4gICAgICAgICAgICA8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ0aGVtZU5vZGVcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPjwvbGk+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImhlYWRpbmdcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+eyU9ICQucGVyc29uYWxpemF0aW9uVGV4dCAlfTwvbGk+XHJcbiAgICAgICAgICAgIDxkaXYgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInBlcnNvbmFsaXphdGlvbk5vZGVcIj48L2Rpdj5cclxuICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9oZWFkZXI+XHJcbiAgYF0pLFxyXG4gIHRoZW1lVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwiaXMtc2VsZWN0YWJsZSB7JSBpZigkLm5hbWUgPT09ICQuc2VsZWN0ZWQpIHsgJX0gaXMtY2hlY2tlZCB7JSB9ICAlfSBcIj4nLFxyXG4gICAgJzxhIGhyZWY9XCIjXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJtZW51aXRlbWNoZWNrYm94XCIgZGF0YS10aGVtZT1cInslPSAkLmRhdGEgJX1cIj57JT0gJC5uYW1lICV9PC9hPicsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG4gIHBlcnNvbmFsaXphdGlvblRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaSBjbGFzcz1cImlzLXNlbGVjdGFibGUgeyUgaWYoJC5uYW1lID09PSAkLnNlbGVjdGVkKSB7ICV9IGlzLWNoZWNrZWQgeyUgfSAgJX1cIj4nLFxyXG4gICAgJzxhIGhyZWY9XCIjXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJtZW51aXRlbVwiIGRhdGEtcmdiY29sb3I9XCJ7JT0gJC5kYXRhICV9XCI+eyU9ICQubmFtZSAlfTwvYT4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuICBzZWxlY3RlZFRoZW1lOiAnJyxcclxuICBzZWxlY3RlZFBlcnNvbmFsaXphdGlvbjogcmVzb3VyY2UuZGVmYXVsdFRleHQsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIHRvb2xiYXIgaXRlbSBIVE1MIE1hcmt1cFxyXG4gICAqXHJcbiAgICogYCRgIC0gVGhlIHRvb2xiYXIgaXRlbSBvYmplY3RcclxuICAgKiBgJCRgIC0gVGhlIHRvb2xiYXIgaW5zdGFuY2VcclxuICAgKi9cclxuICB0b29sVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgICA8YnV0dG9uXHJcbiAgICAgICAgY2xhc3M9XCJidG4tdGVydGlhcnkgaGlkZS1mb2N1cyB7JT0gJC5jbHMgJX0gdG9vbEJ1dHRvbi1yaWdodFwiXHJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgdGl0bGU9XCJ7JTogJC50aXRsZSAlfVwiXHJcbiAgICAgICAgZGF0YS1hY3Rpb249XCJpbnZva2VUb29sXCJcclxuICAgICAgICBkYXRhLXRvb2w9XCJ7JT0gJC5pZCAlfVwiPlxyXG4gICAgICAgIHslIGlmICgkLnN2ZykgeyAlfVxyXG4gICAgICAgIDxzdmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3M9XCJpY29uXCI+XHJcbiAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi17JT0gJC5zdmcgJX1cIi8+XHJcbiAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgeyUgfSAlfVxyXG4gICAgICAgIDxzcGFuPnslOiAkLnRpdGxlIHx8ICQuaWQgJX08L3NwYW4+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgYCxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge051bWJlcn1cclxuICAgKiBDdXJyZW50IG51bWJlciBvZiB0b29sYmFyIGl0ZW1zIHNldFxyXG4gICAqL1xyXG4gIHNpemU6IDAsXHJcblxyXG4gIC8qKlxyXG4gICAqIFRleHQgdGhhdCBpcyBwbGFjZWQgaW50byB0aGUgdG9vbGJhciB0aXRsZU5vZGVcclxuICAgKi9cclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuICBwZXJzb25hbGl6YXRpb25UZXh0OiByZXNvdXJjZS5wZXJzb25hbGl6YXRpb25UZXh0LFxyXG4gIHRoZW1lVGV4dDogcmVzb3VyY2UudGhlbWVUZXh0LFxyXG5cclxuICAvKipcclxuICAgKiBDYWxscyBwYXJlbnQge0BsaW5rIFRvb2xiYXIjY2xlYXIgY2xlYXJ9IGFuZCByZW1vdmVzIGFsbCB0b29sYmFyIGl0ZW1zIGZyb20gRE9NLlxyXG4gICAqL1xyXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGNsZWFyLCBhcmd1bWVudHMpO1xyXG4gICAgJCgnYnV0dG9uLnRvb2xCdXR0b24tcmlnaHQnLCB0aGlzLnRvb2xOb2RlKS5yZW1vdmUoKTtcclxuICB9LFxyXG4gIHBvc3RDcmVhdGU6IGZ1bmN0aW9uIHBvc3RDcmVhdGUoKSB7XHJcbiAgICB0aGlzLmluaXRTb2hvKCk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChwb3N0Q3JlYXRlLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgX2NoYW5nZVBlcnNvbmFsaXphdGlvbjogZnVuY3Rpb24gY2hhbmdlQ29sb3IobW9kZSwgdmFsdWUpIHtcclxuICAgIEFwcC5wcmVmZXJlbmNlc1ttb2RlXSA9IHZhbHVlICYmIHZhbHVlLm5vZGVWYWx1ZTtcclxuICAgIEFwcC5wZXJzaXN0UHJlZmVyZW5jZXMoKTtcclxuICB9LFxyXG4gIGJ1aWxkUGVyc29uYWxpemF0aW9uczogZnVuY3Rpb24gYnVpbGRQZXJzb25hbGl6YXRpb25zKCkge1xyXG4gICAgY29uc3Qgc29ob0NvbG9ycyA9IFNvaG8udGhlbWUucGVyc29uYWxpemF0aW9uQ29sb3JzKCk7XHJcblxyXG4gICAgaWYgKEFwcCAmJiBBcHAucHJlZmVyZW5jZXMgJiYgQXBwLnByZWZlcmVuY2VzLmNvbG9yKSB7XHJcbiAgICAgIGNvbnN0IHNhdmVkUGVyc29saXphdGlvbiA9IHNvaG9Db2xvcnNbQXBwLnByZWZlcmVuY2VzLmNvbG9yXTtcclxuICAgICAgdGhpcy5zZWxlY3RlZFBlcnNvbmFsaXphdGlvbiA9IHNhdmVkUGVyc29saXphdGlvbiAmJiBzYXZlZFBlcnNvbGl6YXRpb24ubmFtZTtcclxuICAgIH1cclxuICAgIGlmIChBcHAgJiYgQXBwLnByZWZlcmVuY2VzICYmIEFwcC5wcmVmZXJlbmNlcy50aGVtZSkge1xyXG4gICAgICBjb25zdCBzYXZlZFRoZW1lID0gU29oby50aGVtZS50aGVtZXMoKS5maW5kKG9iaiA9PiBvYmouZGF0YSA9PT0gQXBwLnByZWZlcmVuY2VzLnRoZW1lKTtcclxuICAgICAgdGhpcy5zZWxlY3RlZFRoZW1lID0gc2F2ZWRUaGVtZSAmJiBzYXZlZFRoZW1lLm5hbWU7XHJcbiAgICB9XHJcbiAgICBPYmplY3Qua2V5cyhzb2hvQ29sb3JzKS5mb3JFYWNoKChrZXkpID0+IHtcclxuICAgICAgY29uc3QgY29sb3IgPSBzb2hvQ29sb3JzW2tleV1cclxuICAgICAgY29uc3QgcGVycyA9ICQodGhpcy5wZXJzb25hbGl6YXRpb25UZW1wbGF0ZS5hcHBseSh7XHJcbiAgICAgICAgbmFtZTogY29sb3IubmFtZSxcclxuICAgICAgICBkYXRhOiBjb2xvci52YWx1ZSxcclxuICAgICAgICBzZWxlY3RlZDogdGhpcy5zZWxlY3RlZFBlcnNvbmFsaXphdGlvbixcclxuICAgICAgfSwgdGhpcykpO1xyXG5cclxuICAgICAgJCh0aGlzLnBlcnNvbmFsaXphdGlvbk5vZGUpLmFwcGVuZChwZXJzKTtcclxuICAgIH0pO1xyXG4gICAgJCh0aGlzLnBlcnNvbmFsaXphdGlvbk5vZGUpLmNsaWNrKChlKSA9PiB7XHJcbiAgICAgIHRoaXMuX2NoYW5nZVBlcnNvbmFsaXphdGlvbignY29sb3InLCBlLnRhcmdldC5hdHRyaWJ1dGVzWydkYXRhLXJnYmNvbG9yJ10pO1xyXG4gICAgfSk7XHJcbiAgICBTb2hvLnRoZW1lLnRoZW1lcygpLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgdGhlbWUgPSAkKHRoaXMudGhlbWVUZW1wbGF0ZS5hcHBseSh7XHJcbiAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxyXG4gICAgICAgIGRhdGE6IGl0ZW0uaWQsXHJcbiAgICAgICAgc2VsZWN0ZWQ6IHRoaXMuc2VsZWN0ZWRUaGVtZSxcclxuICAgICAgfSwgdGhpcykpO1xyXG4gICAgICAkKHRoaXMudGhlbWVOb2RlKS5hcHBlbmQodGhlbWUpO1xyXG4gICAgfSk7XHJcbiAgICAkKHRoaXMudGhlbWVOb2RlKS5jbGljaygoZSkgPT4ge1xyXG4gICAgICB0aGlzLl9jaGFuZ2VQZXJzb25hbGl6YXRpb24oJ3RoZW1lJywgZS50YXJnZXQuYXR0cmlidXRlc1snZGF0YS10aGVtZSddKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgaW5pdFNvaG86IGZ1bmN0aW9uIGluaXRTb2hvKCkge1xyXG4gICAgdGhpcy5idWlsZFBlcnNvbmFsaXphdGlvbnMoKTtcclxuXHJcbiAgICBjb25zdCBoZWFkZXIgPSAkKHRoaXMuZG9tTm9kZSk7XHJcbiAgICBoZWFkZXIuaGVhZGVyKCk7XHJcbiAgICB0aGlzLnRvb2xiYXIgPSBoZWFkZXIuZmluZCgnLnRvb2xiYXInKS5kYXRhKCd0b29sYmFyJyk7XHJcblxyXG4gICAgJCgnLnRpdGxlID4gaDEnLCB0aGlzLmRvbU5vZGUpLm9uKCdjbGljaycsIHRoaXMub25UaXRsZUNsaWNrKTtcclxuXHJcbiAgICAvLyBpbml0IHBlcnNvbmFsaXphdGlvblxyXG4gICAgJCgnaHRtbCcpLnBlcnNvbmFsaXplKHtcclxuICAgICAgY29sb3JzOiBBcHAgJiYgQXBwLnByZWZlcmVuY2VzICYmIEFwcC5wcmVmZXJlbmNlcy5jb2xvcixcclxuICAgICAgdGhlbWU6IEFwcCAmJiBBcHAucHJlZmVyZW5jZXMgJiYgQXBwLnByZWZlcmVuY2VzLnRoZW1lLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICB1cGRhdGVTb2hvOiBmdW5jdGlvbiB1cGRhdGVTb2hvKCkge1xyXG4gICAgLy8gdXBkYXRpbmcgc29obyBoZWFkZXIgcmVzZXRzIHRoZSBoZWFkZXIgdGV4dCB0byB6ZXJvIGxldmVsLiB1cGRhdGUgb25seSB0b29sYmJhciBmb3Igbm93LlxyXG4gICAgLy8gSU5GT1JDUk0tMTYwMDA6IGFkZGVkIGNoZWNrIGZvciB0b29sYmFyIC0gVXBkYXRlVG9vbGJhci5qcyB1c2VzIGFyZ29zL01haW5Ub29sYmFyIGZvciBjb250cm9sbGluZyB2aXNpYmlsaXR5XHJcbiAgICBpZiAodGhpcy50b29sYmFyKSB7XHJcbiAgICAgIHRoaXMudG9vbGJhci51cGRhdGVkKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxscyBwYXJlbnQge0BsaW5rIFRvb2xiYXIjc2hvd1Rvb2xzIHNob3dUb29sc30gd2hpY2ggc2V0cyB0aGUgdG9vbCBjb2xsZWN0aW9uLlxyXG4gICAqIFRoZSBjb2xsZWN0aW9uIGlzIHRoZW4gbG9vcGVkIG92ZXIgYW5kIGFkZGVkIHRvIERPTSwgYWRkaW5nIHRoZSBsZWZ0IG9yIHJpZ2h0IHN0eWxpbmdcclxuICAgKiBAcGFyYW0ge09iamVjdFtdfSB0b29scyBBcnJheSBvZiB0b29sYmFyIGl0ZW0gZGVmaW5pdGlvbnNcclxuICAgKi9cclxuICBzaG93VG9vbHM6IGZ1bmN0aW9uIHNob3dUb29scyh0b29scykge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoc2hvd1Rvb2xzLCBhcmd1bWVudHMpO1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKGB0b29sYmFyLXNpemUtJHt0aGlzLnNpemV9YCk7XHJcbiAgICBsZXQgb25MaW5lID0gdGhpcy5hcHAub25MaW5lO1xyXG4gICAgaWYgKHRvb2xzKSB7XHJcbiAgICAgIGNvbnN0IGNvdW50ID0ge1xyXG4gICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgcmlnaHQ6IDAsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyByZW1vdmUgYnV0dG9ucyBmcm9tIHByZXYgdmlld1xyXG4gICAgICAkKCdidXR0b24udG9vbEJ1dHRvbi1yaWdodCcsIHRoaXMudG9vbE5vZGUpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b29scy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHRvb2wgPSB0b29sc1tpXTtcclxuICAgICAgICBjb25zdCBzaWRlID0gdG9vbC5zaWRlIHx8ICdyaWdodCc7XHJcbiAgICAgICAgY29uc3QgdG9vbFRlbXBsYXRlID0gdG9vbC50ZW1wbGF0ZSB8fCB0aGlzLnRvb2xUZW1wbGF0ZTtcclxuICAgICAgICBjb3VudFtzaWRlXSArPSAxO1xyXG4gICAgICAgIGlmICh0b29sLm9mZmxpbmUpIHtcclxuICAgICAgICAgIG9uTGluZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodG9vbC5jbHMgIT09ICdkaXNwbGF5LW5vbmUnKSB7XHJcbiAgICAgICAgICAkKHRoaXMudG9vbE5vZGUpLnByZXBlbmQodG9vbFRlbXBsYXRlLmFwcGx5KHRvb2wsIHRoaXMudG9vbHNbdG9vbC5pZF0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMudXBkYXRlU29obygpO1xyXG5cclxuICAgICAgdGhpcy5zaXplID0gTWF0aC5tYXgoY291bnQubGVmdCwgY291bnQucmlnaHQpO1xyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoYHRvb2xiYXItc2l6ZS0ke3RoaXMuc2l6ZX1gKTtcclxuICAgICAgdGhpcy5zZXRNb2RlKG9uTGluZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFdmVudCBoYW5kbGVyIHRoYXQgZmlyZXMgd2hlbiB0aGUgdG9vbGJhciB0aXRsZSBpcyBjbGlja2VkLlxyXG4gICAqL1xyXG4gIG9uVGl0bGVDbGljazogZnVuY3Rpb24gb25UaXRsZUNsaWNrKC8qIGV2dCovKSB7fSxcclxuICBzZXRNb2RlOiBmdW5jdGlvbiBzZXRNb2RlKG9uTGluZSkge1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdvZmZsaW5lJyk7XHJcbiAgICBpZiAoIW9uTGluZSkge1xyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoJ29mZmxpbmUnKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkaXNhYmxlVG9vbDogZnVuY3Rpb24gZGlzYWJsZVRvb2woaWQpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGRpc2FibGVUb29sLCBhcmd1bWVudHMpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fZ2V0VG9vbERPTU5vZGUoaWQpO1xyXG4gICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAkKHJlc3VsdCkuYWRkQ2xhc3MoJ3Rvb2xCdXR0b24tZGlzYWJsZWQnKTtcclxuICAgICAgcmVzdWx0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9LFxyXG4gIGVuYWJsZVRvb2w6IGZ1bmN0aW9uIGVuYWJsZVRvb2woaWQpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGVuYWJsZVRvb2wsIGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9nZXRUb29sRE9NTm9kZShpZCk7XHJcbiAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICQocmVzdWx0KS5yZW1vdmVDbGFzcygndG9vbEJ1dHRvbi1kaXNhYmxlZCcpO1xyXG4gICAgICByZXN1bHQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9nZXRUb29sRE9NTm9kZTogZnVuY3Rpb24gX2dldFRvb2xET01Ob2RlKGlkKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSAkKGBidXR0b25bZGF0YS10b29sPSR7aWR9XWAsIHRoaXMuZG9tTm9kZSkuZmlyc3QoKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=