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
    selectedTheme: resource.lightText,
    selectedPersonalization: resource.defaultText,
    themes: [{
      name: resource.lightText,
      data: 'light'
    }, {
      name: resource.darkText,
      data: 'dark'
    }, {
      name: resource.highContrastText,
      data: 'high-contrast'
    }],
    personalizations: [{
      name: resource.defaultText,
      data: '#2578a9'
    }, {
      name: resource.azureText,
      data: '#368AC0'
    }, {
      name: resource.amberText,
      data: '#EFA836'
    }, {
      name: resource.amethystText,
      data: '#9279A6'
    }, {
      name: resource.turquoiseText,
      data: '#579E95'
    }, {
      name: resource.emeraldText,
      data: '#76B051'
    }, {
      name: resource.graphiteText,
      data: '#5C5C5C'
    }],
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

      if (App && App.preferences && App.preferences.color) {
        var savedPersolization = this.personalizations.find(function (obj) {
          return obj.data === App.preferences.color;
        });
        this.selectedPersonalization = savedPersolization && savedPersolization.name;
      }
      if (App && App.preferences && App.preferences.theme) {
        var savedTheme = this.themes.find(function (obj) {
          return obj.data === App.preferences.theme;
        });
        this.selectedTheme = savedTheme && savedTheme.name;
      }
      this.personalizations.forEach(function (item) {
        var pers = $(_this.personalizationTemplate.apply({
          name: item.name,
          data: item.data,
          selected: _this.selectedPersonalization
        }, _this));

        $(_this.personalizationNode).append(pers);
      });
      $(this.personalizationNode).click(function (e) {
        _this._changePersonalization('color', e.target.attributes['data-rgbcolor']);
      });
      this.themes.forEach(function (item) {
        var theme = $(_this.themeTemplate.apply({
          name: item.name,
          data: item.data,
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
      $('body').personalize({
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NYWluVG9vbGJhci5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJhdHRyaWJ1dGVNYXAiLCJ0aXRsZSIsIm5vZGUiLCJ0eXBlIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsInRoZW1lVGVtcGxhdGUiLCJwZXJzb25hbGl6YXRpb25UZW1wbGF0ZSIsInNlbGVjdGVkVGhlbWUiLCJsaWdodFRleHQiLCJzZWxlY3RlZFBlcnNvbmFsaXphdGlvbiIsImRlZmF1bHRUZXh0IiwidGhlbWVzIiwibmFtZSIsImRhdGEiLCJkYXJrVGV4dCIsImhpZ2hDb250cmFzdFRleHQiLCJwZXJzb25hbGl6YXRpb25zIiwiYXp1cmVUZXh0IiwiYW1iZXJUZXh0IiwiYW1ldGh5c3RUZXh0IiwidHVycXVvaXNlVGV4dCIsImVtZXJhbGRUZXh0IiwiZ3JhcGhpdGVUZXh0IiwidG9vbFRlbXBsYXRlIiwic2l6ZSIsInRpdGxlVGV4dCIsInBlcnNvbmFsaXphdGlvblRleHQiLCJ0aGVtZVRleHQiLCJjbGVhciIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsIiQiLCJ0b29sTm9kZSIsInJlbW92ZSIsInBvc3RDcmVhdGUiLCJpbml0U29obyIsIl9jaGFuZ2VQZXJzb25hbGl6YXRpb24iLCJjaGFuZ2VDb2xvciIsIm1vZGUiLCJ2YWx1ZSIsIkFwcCIsInByZWZlcmVuY2VzIiwibm9kZVZhbHVlIiwicGVyc2lzdFByZWZlcmVuY2VzIiwiYnVpbGRQZXJzb25hbGl6YXRpb25zIiwiY29sb3IiLCJzYXZlZFBlcnNvbGl6YXRpb24iLCJmaW5kIiwib2JqIiwidGhlbWUiLCJzYXZlZFRoZW1lIiwiZm9yRWFjaCIsIml0ZW0iLCJwZXJzIiwiYXBwbHkiLCJzZWxlY3RlZCIsInBlcnNvbmFsaXphdGlvbk5vZGUiLCJhcHBlbmQiLCJjbGljayIsImUiLCJ0YXJnZXQiLCJhdHRyaWJ1dGVzIiwidGhlbWVOb2RlIiwiaGVhZGVyIiwiZG9tTm9kZSIsInRvb2xiYXIiLCJvbiIsIm9uVGl0bGVDbGljayIsInBlcnNvbmFsaXplIiwiY29sb3JzIiwidXBkYXRlU29obyIsInVwZGF0ZWQiLCJzaG93VG9vbHMiLCJ0b29scyIsInJlbW92ZUNsYXNzIiwib25MaW5lIiwiYXBwIiwiY291bnQiLCJsZWZ0IiwicmlnaHQiLCJpIiwibGVuZ3RoIiwidG9vbCIsInNpZGUiLCJ0ZW1wbGF0ZSIsIm9mZmxpbmUiLCJjbHMiLCJwcmVwZW5kIiwiaWQiLCJNYXRoIiwibWF4IiwiYWRkQ2xhc3MiLCJzZXRNb2RlIiwiZGlzYWJsZVRvb2wiLCJyZXN1bHQiLCJfZ2V0VG9vbERPTU5vZGUiLCJkaXNhYmxlZCIsImVuYWJsZVRvb2wiLCJmaXJzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTUEsV0FBVyxvQkFBWSxhQUFaLENBQWpCOztBQUVBOzs7Ozs7QUF0QkE7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxNQUFNQyxVQUFVLHVCQUFRLG1CQUFSLEVBQTZCLG1CQUE3QixFQUF3QyxnQ0FBZ0M7QUFDdEY7Ozs7QUFJQUMsa0JBQWM7QUFDWkMsYUFBTztBQUNMQyxjQUFNLFdBREQ7QUFFTEMsY0FBTTtBQUZEO0FBREssS0FMd0U7QUFXdEY7Ozs7OztBQU1BQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLDJxREFBYixDQWpCc0U7QUFtRHRGQyxtQkFBZSxJQUFJRCxRQUFKLENBQWEsQ0FDMUIsbUZBRDBCLEVBRTFCLGdHQUYwQixFQUcxQixPQUgwQixDQUFiLENBbkR1RTtBQXdEdEZFLDZCQUF5QixJQUFJRixRQUFKLENBQWEsQ0FDcEMsa0ZBRG9DLEVBRXBDLDJGQUZvQyxFQUdwQyxPQUhvQyxDQUFiLENBeEQ2RDtBQTZEdEZHLG1CQUFlVixTQUFTVyxTQTdEOEQ7QUE4RHRGQyw2QkFBeUJaLFNBQVNhLFdBOURvRDtBQStEdEZDLFlBQVEsQ0FBQztBQUNQQyxZQUFNZixTQUFTVyxTQURSO0FBRVBLLFlBQU07QUFGQyxLQUFELEVBR0w7QUFDREQsWUFBTWYsU0FBU2lCLFFB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U0FBUyxLQUFLQyxlQUFMLENBQXFCUCxFQUFyQixDQUFmO0FBQ0EsVUFBSU0sTUFBSixFQUFZO0FBQ1YvRCxVQUFFK0QsTUFBRixFQUFVcEIsV0FBVixDQUFzQixxQkFBdEI7QUFDQW9CLGVBQU9FLFFBQVAsR0FBa0IsS0FBbEI7QUFDRDtBQUNGLEtBelFxRjtBQTBRdEZELHFCQUFpQixTQUFTQSxlQUFULENBQXlCUCxFQUF6QixFQUE2QjtBQUM1QyxVQUFNTSxTQUFTL0Qsd0JBQXNCeUQsRUFBdEIsUUFBNkIsS0FBS3hCLE9BQWxDLEVBQTJDa0MsS0FBM0MsRUFBZjtBQUNBLGFBQU9KLE1BQVA7QUFDRDtBQTdRcUYsR0FBeEUsQ0FBaEI7O29CQWdSZWhHLE8iLCJmaWxlIjoiTWFpblRvb2xiYXIuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBUb29sYmFyIGZyb20gJy4vVG9vbGJhcic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ21haW5Ub29sYmFyJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLk1haW5Ub29sYmFyXHJcbiAqIEBjbGFzc2Rlc2MgTWFpblRvb2xiYXIgaXMgZGVzaWduZWQgdG8gaGFuZGxlIHRoZSB0b3AgYXBwbGljYXRpb24gYmFyIHdpdGggbWFya3VwIGFuZCBsb2dpYyB0byBzZXRcclxuICogYSB0aXRsZSBhbmQgcG9zaXRpb24gdG9vbGJhciBpdGVtcyB0byB0aGUgbGVmdCBvciByaWdodFxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5Ub29sYmFyXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuTWFpblRvb2xiYXInLCBbVG9vbGJhcl0sIC8qKiBAbGVuZHMgYXJnb3MuTWFpblRvb2xiYXIjICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFVzZWQgdG8gc2V0IHRoZSB0aXRsZSBub2RlJ3MgaW5uZXJIVE1MXHJcbiAgICovXHJcbiAgYXR0cmlidXRlTWFwOiB7XHJcbiAgICB0aXRsZToge1xyXG4gICAgICBub2RlOiAndGl0bGVOb2RlJyxcclxuICAgICAgdHlwZTogJ2lubmVySFRNTCcsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIG1haW4gSFRNTCBNYXJrdXAgb2YgdGhlIHRvb2xiYXJcclxuICAgKlxyXG4gICAqIGAkYCAtIHRoZSB0b29sYmFyIGluc3RhbmNlXHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgPGhlYWRlciBjbGFzcz1cImhlYWRlciBpcy1wZXJzb25hbGl6YWJsZSBpcy1zY3JvbGxlZC1kb3duXCIgZGF0YS1vcHRpb25zPVwie2FkZFNjcm9sbENsYXNzOiB0cnVlfVwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwidG9vbGJhciBkby1yZXNpemUgaGFzLW1vcmUtYnV0dG9uIGhhcy10aXRsZS1idXR0b25cIiByb2xlPVwidG9vbGJhclwiIGFyaWEtbGFiZWw9XCJMYXlvdXRzXCIgZGF0YS1vcHRpb25zPVwie21heFZpc2libGVCdXR0b25zOiAyfVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1pY29uIGFwcGxpY2F0aW9uLW1lbnUtdHJpZ2dlciBoaWRlLWZvY3VzXCIgdHlwZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXVkaWJsZVwiPlNob3cgbmF2aWdhdGlvbjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb24gYXBwLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvbmVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR3b1wiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGhyZWVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8aDEgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRpdGxlTm9kZVwiPnslPSAkLnRpdGxlVGV4dCAlfTwvaDE+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNldFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ0b29sTm9kZVwiPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlXCI+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWFjdGlvbnMgcGFnZS1jaGFuZ2VyXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtb3B0aW9ucz1cInthdHRhY2hUb0JvZHk6IHRydWV9XCI+XHJcbiAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tbW9yZVwiPjwvdXNlPlxyXG4gICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhdWRpYmxlXCIgZGF0YS10cmFuc2xhdGU9XCJ0ZXh0XCI+TW9yZTwvc3Bhbj5cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPHVsIGlkPVwiYXBwLXRvb2xiYXItbW9yZVwiIGNsYXNzPVwicG9wdXBtZW51IGlzLXNlbGVjdGFibGVcIj5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwiaGVhZGluZ1wiIHJvbGU9XCJwcmVzZW50YXRpb25cIj57JT0gJC50aGVtZVRleHQgJX08L2xpPlxyXG4gICAgICAgICAgICA8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ0aGVtZU5vZGVcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPjwvbGk+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImhlYWRpbmdcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+eyU9ICQucGVyc29uYWxpemF0aW9uVGV4dCAlfTwvbGk+XHJcbiAgICAgICAgICAgIDxkaXYgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInBlcnNvbmFsaXphdGlvbk5vZGVcIj48L2Rpdj5cclxuICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9oZWFkZXI+XHJcbiAgYF0pLFxyXG4gIHRoZW1lVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwiaXMtc2VsZWN0YWJsZSB7JSBpZigkLm5hbWUgPT09ICQuc2VsZWN0ZWQpIHsgJX0gaXMtY2hlY2tlZCB7JSB9ICAlfSBcIj4nLFxyXG4gICAgJzxhIGhyZWY9XCIjXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJtZW51aXRlbWNoZWNrYm94XCIgZGF0YS10aGVtZT1cInslPSAkLmRhdGEgJX1cIj57JT0gJC5uYW1lICV9PC9hPicsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG4gIHBlcnNvbmFsaXphdGlvblRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaSBjbGFzcz1cImlzLXNlbGVjdGFibGUgeyUgaWYoJC5uYW1lID09PSAkLnNlbGVjdGVkKSB7ICV9IGlzLWNoZWNrZWQgeyUgfSAgJX1cIj4nLFxyXG4gICAgJzxhIGhyZWY9XCIjXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJtZW51aXRlbVwiIGRhdGEtcmdiY29sb3I9XCJ7JT0gJC5kYXRhICV9XCI+eyU9ICQubmFtZSAlfTwvYT4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuICBzZWxlY3RlZFRoZW1lOiByZXNvdXJjZS5saWdodFRleHQsXHJcbiAgc2VsZWN0ZWRQZXJzb25hbGl6YXRpb246IHJlc291cmNlLmRlZmF1bHRUZXh0LFxyXG4gIHRoZW1lczogW3tcclxuICAgIG5hbWU6IHJlc291cmNlLmxpZ2h0VGV4dCxcclxuICAgIGRhdGE6ICdsaWdodCcsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogcmVzb3VyY2UuZGFya1RleHQsXHJcbiAgICBkYXRhOiAnZGFyaycsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogcmVzb3VyY2UuaGlnaENvbnRyYXN0VGV4dCxcclxuICAgIGRhdGE6ICdoaWdoLWNvbnRyYXN0JyxcclxuICB9XSxcclxuICBwZXJzb25hbGl6YXRpb25zOiBbe1xyXG4gICAgbmFtZTogcmVzb3VyY2UuZGVmYXVsdFRleHQsXHJcbiAgICBkYXRhOiAnIzI1NzhhOScsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogcmVzb3VyY2UuYXp1cmVUZXh0LFxyXG4gICAgZGF0YTogJyMzNjhBQzAnLFxyXG4gIH0sIHtcclxuICAgIG5hbWU6IHJlc291cmNlLmFtYmVyVGV4dCxcclxuICAgIGRhdGE6ICcjRUZBODM2JyxcclxuICB9LCB7XHJcbiAgICBuYW1lOiByZXNvdXJjZS5hbWV0aHlzdFRleHQsXHJcbiAgICBkYXRhOiAnIzkyNzlBNicsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogcmVzb3VyY2UudHVycXVvaXNlVGV4dCxcclxuICAgIGRhdGE6ICcjNTc5RTk1JyxcclxuICB9LCB7XHJcbiAgICBuYW1lOiByZXNvdXJjZS5lbWVyYWxkVGV4dCxcclxuICAgIGRhdGE6ICcjNzZCMDUxJyxcclxuICB9LCB7XHJcbiAgICBuYW1lOiByZXNvdXJjZS5ncmFwaGl0ZVRleHQsXHJcbiAgICBkYXRhOiAnIzVDNUM1QycsXHJcbiAgfV0sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIHRvb2xiYXIgaXRlbSBIVE1MIE1hcmt1cFxyXG4gICAqXHJcbiAgICogYCRgIC0gVGhlIHRvb2xiYXIgaXRlbSBvYmplY3RcclxuICAgKiBgJCRgIC0gVGhlIHRvb2xiYXIgaW5zdGFuY2VcclxuICAgKi9cclxuICB0b29sVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgICA8YnV0dG9uXHJcbiAgICAgICAgY2xhc3M9XCJidG4tdGVydGlhcnkgaGlkZS1mb2N1cyB7JT0gJC5jbHMgJX0gdG9vbEJ1dHRvbi1yaWdodFwiXHJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgdGl0bGU9XCJ7JTogJC50aXRsZSAlfVwiXHJcbiAgICAgICAgZGF0YS1hY3Rpb249XCJpbnZva2VUb29sXCJcclxuICAgICAgICBkYXRhLXRvb2w9XCJ7JT0gJC5pZCAlfVwiPlxyXG4gICAgICAgIHslIGlmICgkLnN2ZykgeyAlfVxyXG4gICAgICAgIDxzdmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3M9XCJpY29uXCI+XHJcbiAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi17JT0gJC5zdmcgJX1cIi8+XHJcbiAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgeyUgfSAlfVxyXG4gICAgICAgIDxzcGFuPnslOiAkLnRpdGxlIHx8ICQuaWQgJX08L3NwYW4+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgYCxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge051bWJlcn1cclxuICAgKiBDdXJyZW50IG51bWJlciBvZiB0b29sYmFyIGl0ZW1zIHNldFxyXG4gICAqL1xyXG4gIHNpemU6IDAsXHJcblxyXG4gIC8qKlxyXG4gICAqIFRleHQgdGhhdCBpcyBwbGFjZWQgaW50byB0aGUgdG9vbGJhciB0aXRsZU5vZGVcclxuICAgKi9cclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuICBwZXJzb25hbGl6YXRpb25UZXh0OiByZXNvdXJjZS5wZXJzb25hbGl6YXRpb25UZXh0LFxyXG4gIHRoZW1lVGV4dDogcmVzb3VyY2UudGhlbWVUZXh0LFxyXG5cclxuICAvKipcclxuICAgKiBDYWxscyBwYXJlbnQge0BsaW5rIFRvb2xiYXIjY2xlYXIgY2xlYXJ9IGFuZCByZW1vdmVzIGFsbCB0b29sYmFyIGl0ZW1zIGZyb20gRE9NLlxyXG4gICAqL1xyXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGNsZWFyLCBhcmd1bWVudHMpO1xyXG4gICAgJCgnYnV0dG9uLnRvb2xCdXR0b24tcmlnaHQnLCB0aGlzLnRvb2xOb2RlKS5yZW1vdmUoKTtcclxuICB9LFxyXG4gIHBvc3RDcmVhdGU6IGZ1bmN0aW9uIHBvc3RDcmVhdGUoKSB7XHJcbiAgICB0aGlzLmluaXRTb2hvKCk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChwb3N0Q3JlYXRlLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgX2NoYW5nZVBlcnNvbmFsaXphdGlvbjogZnVuY3Rpb24gY2hhbmdlQ29sb3IobW9kZSwgdmFsdWUpIHtcclxuICAgIEFwcC5wcmVmZXJlbmNlc1ttb2RlXSA9IHZhbHVlICYmIHZhbHVlLm5vZGVWYWx1ZTtcclxuICAgIEFwcC5wZXJzaXN0UHJlZmVyZW5jZXMoKTtcclxuICB9LFxyXG4gIGJ1aWxkUGVyc29uYWxpemF0aW9uczogZnVuY3Rpb24gYnVpbGRQZXJzb25hbGl6YXRpb25zKCkge1xyXG4gICAgaWYgKEFwcCAmJiBBcHAucHJlZmVyZW5jZXMgJiYgQXBwLnByZWZlcmVuY2VzLmNvbG9yKSB7XHJcbiAgICAgIGNvbnN0IHNhdmVkUGVyc29saXphdGlvbiA9IHRoaXMucGVyc29uYWxpemF0aW9ucy5maW5kKG9iaiA9PiBvYmouZGF0YSA9PT0gQXBwLnByZWZlcmVuY2VzLmNvbG9yKTtcclxuICAgICAgdGhpcy5zZWxlY3RlZFBlcnNvbmFsaXphdGlvbiA9IHNhdmVkUGVyc29saXphdGlvbiAmJiBzYXZlZFBlcnNvbGl6YXRpb24ubmFtZTtcclxuICAgIH1cclxuICAgIGlmIChBcHAgJiYgQXBwLnByZWZlcmVuY2VzICYmIEFwcC5wcmVmZXJlbmNlcy50aGVtZSkge1xyXG4gICAgICBjb25zdCBzYXZlZFRoZW1lID0gdGhpcy50aGVtZXMuZmluZChvYmogPT4gb2JqLmRhdGEgPT09IEFwcC5wcmVmZXJlbmNlcy50aGVtZSk7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRUaGVtZSA9IHNhdmVkVGhlbWUgJiYgc2F2ZWRUaGVtZS5uYW1lO1xyXG4gICAgfVxyXG4gICAgdGhpcy5wZXJzb25hbGl6YXRpb25zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgcGVycyA9ICQodGhpcy5wZXJzb25hbGl6YXRpb25UZW1wbGF0ZS5hcHBseSh7XHJcbiAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxyXG4gICAgICAgIGRhdGE6IGl0ZW0uZGF0YSxcclxuICAgICAgICBzZWxlY3RlZDogdGhpcy5zZWxlY3RlZFBlcnNvbmFsaXphdGlvbixcclxuICAgICAgfSwgdGhpcykpO1xyXG5cclxuICAgICAgJCh0aGlzLnBlcnNvbmFsaXphdGlvbk5vZGUpLmFwcGVuZChwZXJzKTtcclxuICAgIH0pO1xyXG4gICAgJCh0aGlzLnBlcnNvbmFsaXphdGlvbk5vZGUpLmNsaWNrKChlKSA9PiB7XHJcbiAgICAgIHRoaXMuX2NoYW5nZVBlcnNvbmFsaXphdGlvbignY29sb3InLCBlLnRhcmdldC5hdHRyaWJ1dGVzWydkYXRhLXJnYmNvbG9yJ10pO1xyXG4gICAgfSk7XHJcbiAgICB0aGlzLnRoZW1lcy5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRoZW1lID0gJCh0aGlzLnRoZW1lVGVtcGxhdGUuYXBwbHkoe1xyXG4gICAgICAgIG5hbWU6IGl0ZW0ubmFtZSxcclxuICAgICAgICBkYXRhOiBpdGVtLmRhdGEsXHJcbiAgICAgICAgc2VsZWN0ZWQ6IHRoaXMuc2VsZWN0ZWRUaGVtZSxcclxuICAgICAgfSwgdGhpcykpO1xyXG4gICAgICAkKHRoaXMudGhlbWVOb2RlKS5hcHBlbmQodGhlbWUpO1xyXG4gICAgfSk7XHJcbiAgICAkKHRoaXMudGhlbWVOb2RlKS5jbGljaygoZSkgPT4ge1xyXG4gICAgICB0aGlzLl9jaGFuZ2VQZXJzb25hbGl6YXRpb24oJ3RoZW1lJywgZS50YXJnZXQuYXR0cmlidXRlc1snZGF0YS10aGVtZSddKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgaW5pdFNvaG86IGZ1bmN0aW9uIGluaXRTb2hvKCkge1xyXG4gICAgdGhpcy5idWlsZFBlcnNvbmFsaXphdGlvbnMoKTtcclxuXHJcbiAgICBjb25zdCBoZWFkZXIgPSAkKHRoaXMuZG9tTm9kZSk7XHJcbiAgICBoZWFkZXIuaGVhZGVyKCk7XHJcbiAgICB0aGlzLnRvb2xiYXIgPSBoZWFkZXIuZmluZCgnLnRvb2xiYXInKS5kYXRhKCd0b29sYmFyJyk7XHJcblxyXG4gICAgJCgnLnRpdGxlID4gaDEnLCB0aGlzLmRvbU5vZGUpLm9uKCdjbGljaycsIHRoaXMub25UaXRsZUNsaWNrKTtcclxuXHJcbiAgICAvLyBpbml0IHBlcnNvbmFsaXphdGlvblxyXG4gICAgJCgnYm9keScpLnBlcnNvbmFsaXplKHtcclxuICAgICAgY29sb3JzOiBBcHAgJiYgQXBwLnByZWZlcmVuY2VzICYmIEFwcC5wcmVmZXJlbmNlcy5jb2xvcixcclxuICAgICAgdGhlbWU6IEFwcCAmJiBBcHAucHJlZmVyZW5jZXMgJiYgQXBwLnByZWZlcmVuY2VzLnRoZW1lLFxyXG4gICAgfSk7XHJcbiAgfSxcclxuICB1cGRhdGVTb2hvOiBmdW5jdGlvbiB1cGRhdGVTb2hvKCkge1xyXG4gICAgLy8gdXBkYXRpbmcgc29obyBoZWFkZXIgcmVzZXRzIHRoZSBoZWFkZXIgdGV4dCB0byB6ZXJvIGxldmVsLiB1cGRhdGUgb25seSB0b29sYmJhciBmb3Igbm93LlxyXG4gICAgLy8gSU5GT1JDUk0tMTYwMDA6IGFkZGVkIGNoZWNrIGZvciB0b29sYmFyIC0gVXBkYXRlVG9vbGJhci5qcyB1c2VzIGFyZ29zL01haW5Ub29sYmFyIGZvciBjb250cm9sbGluZyB2aXNpYmlsaXR5XHJcbiAgICBpZiAodGhpcy50b29sYmFyKSB7XHJcbiAgICAgIHRoaXMudG9vbGJhci51cGRhdGVkKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxscyBwYXJlbnQge0BsaW5rIFRvb2xiYXIjc2hvd1Rvb2xzIHNob3dUb29sc30gd2hpY2ggc2V0cyB0aGUgdG9vbCBjb2xsZWN0aW9uLlxyXG4gICAqIFRoZSBjb2xsZWN0aW9uIGlzIHRoZW4gbG9vcGVkIG92ZXIgYW5kIGFkZGVkIHRvIERPTSwgYWRkaW5nIHRoZSBsZWZ0IG9yIHJpZ2h0IHN0eWxpbmdcclxuICAgKiBAcGFyYW0ge09iamVjdFtdfSB0b29scyBBcnJheSBvZiB0b29sYmFyIGl0ZW0gZGVmaW5pdGlvbnNcclxuICAgKi9cclxuICBzaG93VG9vbHM6IGZ1bmN0aW9uIHNob3dUb29scyh0b29scykge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoc2hvd1Rvb2xzLCBhcmd1bWVudHMpO1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKGB0b29sYmFyLXNpemUtJHt0aGlzLnNpemV9YCk7XHJcbiAgICBsZXQgb25MaW5lID0gdGhpcy5hcHAub25MaW5lO1xyXG4gICAgaWYgKHRvb2xzKSB7XHJcbiAgICAgIGNvbnN0IGNvdW50ID0ge1xyXG4gICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgcmlnaHQ6IDAsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyByZW1vdmUgYnV0dG9ucyBmcm9tIHByZXYgdmlld1xyXG4gICAgICAkKCdidXR0b24udG9vbEJ1dHRvbi1yaWdodCcsIHRoaXMudG9vbE5vZGUpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b29scy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHRvb2wgPSB0b29sc1tpXTtcclxuICAgICAgICBjb25zdCBzaWRlID0gdG9vbC5zaWRlIHx8ICdyaWdodCc7XHJcbiAgICAgICAgY29uc3QgdG9vbFRlbXBsYXRlID0gdG9vbC50ZW1wbGF0ZSB8fCB0aGlzLnRvb2xUZW1wbGF0ZTtcclxuICAgICAgICBjb3VudFtzaWRlXSArPSAxO1xyXG4gICAgICAgIGlmICh0b29sLm9mZmxpbmUpIHtcclxuICAgICAgICAgIG9uTGluZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodG9vbC5jbHMgIT09ICdkaXNwbGF5LW5vbmUnKSB7XHJcbiAgICAgICAgICAkKHRoaXMudG9vbE5vZGUpLnByZXBlbmQodG9vbFRlbXBsYXRlLmFwcGx5KHRvb2wsIHRoaXMudG9vbHNbdG9vbC5pZF0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMudXBkYXRlU29obygpO1xyXG5cclxuICAgICAgdGhpcy5zaXplID0gTWF0aC5tYXgoY291bnQubGVmdCwgY291bnQucmlnaHQpO1xyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoYHRvb2xiYXItc2l6ZS0ke3RoaXMuc2l6ZX1gKTtcclxuICAgICAgdGhpcy5zZXRNb2RlKG9uTGluZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFdmVudCBoYW5kbGVyIHRoYXQgZmlyZXMgd2hlbiB0aGUgdG9vbGJhciB0aXRsZSBpcyBjbGlja2VkLlxyXG4gICAqL1xyXG4gIG9uVGl0bGVDbGljazogZnVuY3Rpb24gb25UaXRsZUNsaWNrKC8qIGV2dCovKSB7fSxcclxuICBzZXRNb2RlOiBmdW5jdGlvbiBzZXRNb2RlKG9uTGluZSkge1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdvZmZsaW5lJyk7XHJcbiAgICBpZiAoIW9uTGluZSkge1xyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoJ29mZmxpbmUnKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkaXNhYmxlVG9vbDogZnVuY3Rpb24gZGlzYWJsZVRvb2woaWQpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGRpc2FibGVUb29sLCBhcmd1bWVudHMpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fZ2V0VG9vbERPTU5vZGUoaWQpO1xyXG4gICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAkKHJlc3VsdCkuYWRkQ2xhc3MoJ3Rvb2xCdXR0b24tZGlzYWJsZWQnKTtcclxuICAgICAgcmVzdWx0LmRpc2FibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9LFxyXG4gIGVuYWJsZVRvb2w6IGZ1bmN0aW9uIGVuYWJsZVRvb2woaWQpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGVuYWJsZVRvb2wsIGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9nZXRUb29sRE9NTm9kZShpZCk7XHJcbiAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICQocmVzdWx0KS5yZW1vdmVDbGFzcygndG9vbEJ1dHRvbi1kaXNhYmxlZCcpO1xyXG4gICAgICByZXN1bHQuZGlzYWJsZWQgPSBmYWxzZTtcclxuICAgIH1cclxuICB9LFxyXG4gIF9nZXRUb29sRE9NTm9kZTogZnVuY3Rpb24gX2dldFRvb2xET01Ob2RlKGlkKSB7XHJcbiAgICBjb25zdCByZXN1bHQgPSAkKGBidXR0b25bZGF0YS10b29sPSR7aWR9XWAsIHRoaXMuZG9tTm9kZSkuZmlyc3QoKTtcclxuICAgIHJldHVybiByZXN1bHQ7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=