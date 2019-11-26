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
    widgetTemplate: new Simplate(['\n    <header class="header is-personalizable is-scrolled-down" data-options="{addScrollClass: true}">\n      <div class="toolbar do-resize has-more-button has-title-button" role="toolbar" aria-label="Layouts">\n        <div class="title">\n          <button class="btn-icon application-menu-trigger hide-focus" type="button" tabindex="0">\n              <span class="audible">Show navigation</span>\n              <span class="icon app-header">\n                <span class="one"></span>\n                <span class="two"></span>\n                <span class="three"></span>\n              </span>\n          </button>\n          <h1 data-dojo-attach-point="titleNode">{%= $.titleText %}</h1>\n        </div>\n        <div class="buttonset" data-dojo-attach-point="toolNode">\n        </div>\n        <div class="more">\n          <button class="btn-actions page-changer" type="button" data-options="{attachToBody: true}">\n            <svg class="icon" focusable="false" aria-hidden="true" role="presentation">\n              <use xlink:href="#icon-more"></use>\n            </svg>\n            <span class="audible" data-translate="text">More</span>\n          </button>\n          <ul id="app-toolbar-more" class="popupmenu is-selectable">\n            <li class="heading" role="presentation">{%= $.themeText %}</li>\n            <div data-dojo-attach-point="themeNode"></div>\n            <li class="separator" role="presentation"></li>\n            <li class="heading" role="presentation">{%= $.personalizationText %}</li>\n            <div data-dojo-attach-point="personalizationNode"></div>\n          </ul>\n        </div>\n      </div>\n    </header>\n  ']),
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
    toolTemplate: new Simplate(['\n      <button\n        class="btn-icon {%= $.cls %} toolButton-right"\n        type="button"\n        title="{%: $.title %}"\n        data-action="invokeTool"\n        data-tool="{%= $.id %}">\n        {% if ($.svg) { %}\n        <svg aria-hidden="true" focusable="false" role="presentation" class="icon">\n          <use xlink:href="#icon-{%= $.svg %}"/>\n        </svg>\n        {% } %}\n        <span class="audible">{%: $.title || $.id %}</span>\n      </button>\n    ']),
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NYWluVG9vbGJhci5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJhdHRyaWJ1dGVNYXAiLCJ0aXRsZSIsIm5vZGUiLCJ0eXBlIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsInRoZW1lVGVtcGxhdGUiLCJwZXJzb25hbGl6YXRpb25UZW1wbGF0ZSIsInNlbGVjdGVkVGhlbWUiLCJsaWdodFRleHQiLCJzZWxlY3RlZFBlcnNvbmFsaXphdGlvbiIsImRlZmF1bHRUZXh0IiwidGhlbWVzIiwibmFtZSIsImRhdGEiLCJkYXJrVGV4dCIsImhpZ2hDb250cmFzdFRleHQiLCJwZXJzb25hbGl6YXRpb25zIiwiYXp1cmVUZXh0IiwiYW1iZXJUZXh0IiwiYW1ldGh5c3RUZXh0IiwidHVycXVvaXNlVGV4dCIsImVtZXJhbGRUZXh0IiwiZ3JhcGhpdGVUZXh0IiwidG9vbFRlbXBsYXRlIiwic2l6ZSIsInRpdGxlVGV4dCIsInBlcnNvbmFsaXphdGlvblRleHQiLCJ0aGVtZVRleHQiLCJjbGVhciIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsIiQiLCJ0b29sTm9kZSIsInJlbW92ZSIsInBvc3RDcmVhdGUiLCJpbml0U29obyIsIl9jaGFuZ2VQZXJzb25hbGl6YXRpb24iLCJjaGFuZ2VDb2xvciIsIm1vZGUiLCJ2YWx1ZSIsIkFwcCIsInByZWZlcmVuY2VzIiwibm9kZVZhbHVlIiwicGVyc2lzdFByZWZlcmVuY2VzIiwiYnVpbGRQZXJzb25hbGl6YXRpb25zIiwiY29sb3IiLCJzYXZlZFBlcnNvbGl6YXRpb24iLCJmaW5kIiwib2JqIiwidGhlbWUiLCJzYXZlZFRoZW1lIiwiZm9yRWFjaCIsIml0ZW0iLCJwZXJzIiwiYXBwbHkiLCJzZWxlY3RlZCIsInBlcnNvbmFsaXphdGlvbk5vZGUiLCJhcHBlbmQiLCJjbGljayIsImUiLCJ0YXJnZXQiLCJhdHRyaWJ1dGVzIiwidGhlbWVOb2RlIiwiaGVhZGVyIiwiZG9tTm9kZSIsInRvb2xiYXIiLCJvbiIsIm9uVGl0bGVDbGljayIsInBlcnNvbmFsaXplIiwiY29sb3JzIiwidXBkYXRlU29obyIsInVwZGF0ZWQiLCJzaG93VG9vbHMiLCJ0b29scyIsInJlbW92ZUNsYXNzIiwib25MaW5lIiwiYXBwIiwiY291bnQiLCJsZWZ0IiwicmlnaHQiLCJpIiwibGVuZ3RoIiwidG9vbCIsInNpZGUiLCJ0ZW1wbGF0ZSIsIm9mZmxpbmUiLCJjbHMiLCJwcmVwZW5kIiwiaWQiLCJNYXRoIiwibWF4IiwiYWRkQ2xhc3MiLCJzZXRNb2RlIiwiZGlzYWJsZVRvb2wiLCJyZXN1bHQiLCJfZ2V0VG9vbERPTU5vZGUiLCJkaXNhYmxlZCIsImVuYWJsZVRvb2wiLCJmaXJzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTUEsV0FBVyxvQkFBWSxhQUFaLENBQWpCOztBQUVBOzs7Ozs7QUF0QkE7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxNQUFNQyxVQUFVLHVCQUFRLG1CQUFSLEVBQTZCLG1CQUE3QixFQUF3QyxnQ0FBZ0M7QUFDdEY7Ozs7QUFJQUMsa0JBQWM7QUFDWkMsYUFBTztBQUNMQyxjQUFNLFdBREQ7QUFFTEMsY0FBTTtBQUZEO0FBREssS0FMd0U7QUFXdEY7Ozs7OztBQU1BQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLHFvREFBYixDQWpCc0U7QUFtRHRGQyxtQkFBZSxJQUFJRCxRQUFKLENBQWEsQ0FDMUIsbUZBRDBCLEVBRTFCLGdHQUYwQixFQUcxQixPQUgwQixDQUFiLENBbkR1RTtBQXdEdEZFLDZCQUF5QixJQUFJRixRQUFKLENBQWEsQ0FDcEMsa0ZBRG9DLEVBRXBDLDJGQUZvQyxFQUdwQyxPQUhvQyxDQUFiLENBeEQ2RDtBQTZEdEZHLG1CQUFlVixTQUFTVyxTQTdEOEQ7QUE4RHRGQyw2QkFBeUJaLFNBQVNhLFdBOURvRDtBQStEdEZDLFlBQVEsQ0FBQztBQUNQQyxZQUFNZixTQUFTVyxTQURSO0FBRVBLLFlBQU07QUFGQyxLQUFELEVBR0w7QUFDREQsWUFBTWYsU0FBU2lCLFFB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U0FBUyxLQUFLQyxlQUFMLENBQXFCUCxFQUFyQixDQUFmO0FBQ0EsVUFBSU0sTUFBSixFQUFZO0FBQ1YvRCxVQUFFK0QsTUFBRixFQUFVcEIsV0FBVixDQUFzQixxQkFBdEI7QUFDQW9CLGVBQU9FLFFBQVAsR0FBa0IsS0FBbEI7QUFDRDtBQUNGLEtBelFxRjtBQTBRdEZELHFCQUFpQixTQUFTQSxlQUFULENBQXlCUCxFQUF6QixFQUE2QjtBQUM1QyxVQUFNTSxTQUFTL0Qsd0JBQXNCeUQsRUFBdEIsUUFBNkIsS0FBS3hCLE9BQWxDLEVBQTJDa0MsS0FBM0MsRUFBZjtBQUNBLGFBQU9KLE1BQVA7QUFDRDtBQTdRcUYsR0FBeEUsQ0FBaEI7O29CQWdSZWhHLE8iLCJmaWxlIjoiTWFpblRvb2xiYXIuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IChjKSAyMDEwLCBTYWdlIFNvZnR3YXJlLCBJbmMuIEFsbCByaWdodHMgcmVzZXJ2ZWQuXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBUb29sYmFyIGZyb20gJy4vVG9vbGJhcic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ21haW5Ub29sYmFyJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLk1haW5Ub29sYmFyXHJcbiAqIEBjbGFzc2Rlc2MgTWFpblRvb2xiYXIgaXMgZGVzaWduZWQgdG8gaGFuZGxlIHRoZSB0b3AgYXBwbGljYXRpb24gYmFyIHdpdGggbWFya3VwIGFuZCBsb2dpYyB0byBzZXRcclxuICogYSB0aXRsZSBhbmQgcG9zaXRpb24gdG9vbGJhciBpdGVtcyB0byB0aGUgbGVmdCBvciByaWdodFxyXG4gKiBAZXh0ZW5kcyBhcmdvcy5Ub29sYmFyXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuTWFpblRvb2xiYXInLCBbVG9vbGJhcl0sIC8qKiBAbGVuZHMgYXJnb3MuTWFpblRvb2xiYXIjICove1xyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fVxyXG4gICAqIFVzZWQgdG8gc2V0IHRoZSB0aXRsZSBub2RlJ3MgaW5uZXJIVE1MXHJcbiAgICovXHJcbiAgYXR0cmlidXRlTWFwOiB7XHJcbiAgICB0aXRsZToge1xyXG4gICAgICBub2RlOiAndGl0bGVOb2RlJyxcclxuICAgICAgdHlwZTogJ2lubmVySFRNTCcsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIG1haW4gSFRNTCBNYXJrdXAgb2YgdGhlIHRvb2xiYXJcclxuICAgKlxyXG4gICAqIGAkYCAtIHRoZSB0b29sYmFyIGluc3RhbmNlXHJcbiAgICovXHJcbiAgd2lkZ2V0VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgPGhlYWRlciBjbGFzcz1cImhlYWRlciBpcy1wZXJzb25hbGl6YWJsZSBpcy1zY3JvbGxlZC1kb3duXCIgZGF0YS1vcHRpb25zPVwie2FkZFNjcm9sbENsYXNzOiB0cnVlfVwiPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwidG9vbGJhciBkby1yZXNpemUgaGFzLW1vcmUtYnV0dG9uIGhhcy10aXRsZS1idXR0b25cIiByb2xlPVwidG9vbGJhclwiIGFyaWEtbGFiZWw9XCJMYXlvdXRzXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInRpdGxlXCI+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWljb24gYXBwbGljYXRpb24tbWVudS10cmlnZ2VyIGhpZGUtZm9jdXNcIiB0eXBlPVwiYnV0dG9uXCIgdGFiaW5kZXg9XCIwXCI+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhdWRpYmxlXCI+U2hvdyBuYXZpZ2F0aW9uPC9zcGFuPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiaWNvbiBhcHAtaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cIm9uZVwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidHdvXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0aHJlZVwiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDxoMSBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwidGl0bGVOb2RlXCI+eyU9ICQudGl0bGVUZXh0ICV9PC9oMT5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiYnV0dG9uc2V0XCIgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRvb2xOb2RlXCI+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cIm1vcmVcIj5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4tYWN0aW9ucyBwYWdlLWNoYW5nZXJcIiB0eXBlPVwiYnV0dG9uXCIgZGF0YS1vcHRpb25zPVwie2F0dGFjaFRvQm9keTogdHJ1ZX1cIj5cclxuICAgICAgICAgICAgPHN2ZyBjbGFzcz1cImljb25cIiBmb2N1c2FibGU9XCJmYWxzZVwiIGFyaWEtaGlkZGVuPVwidHJ1ZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj5cclxuICAgICAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi1tb3JlXCI+PC91c2U+XHJcbiAgICAgICAgICAgIDwvc3ZnPlxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzcz1cImF1ZGlibGVcIiBkYXRhLXRyYW5zbGF0ZT1cInRleHRcIj5Nb3JlPC9zcGFuPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8dWwgaWQ9XCJhcHAtdG9vbGJhci1tb3JlXCIgY2xhc3M9XCJwb3B1cG1lbnUgaXMtc2VsZWN0YWJsZVwiPlxyXG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJoZWFkaW5nXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPnslPSAkLnRoZW1lVGV4dCAlfTwvbGk+XHJcbiAgICAgICAgICAgIDxkaXYgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRoZW1lTm9kZVwiPjwvZGl2PlxyXG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJzZXBhcmF0b3JcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+PC9saT5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwiaGVhZGluZ1wiIHJvbGU9XCJwcmVzZW50YXRpb25cIj57JT0gJC5wZXJzb25hbGl6YXRpb25UZXh0ICV9PC9saT5cclxuICAgICAgICAgICAgPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwicGVyc29uYWxpemF0aW9uTm9kZVwiPjwvZGl2PlxyXG4gICAgICAgICAgPC91bD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9kaXY+XHJcbiAgICA8L2hlYWRlcj5cclxuICBgXSksXHJcbiAgdGhlbWVUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8bGkgY2xhc3M9XCJpcy1zZWxlY3RhYmxlIHslIGlmKCQubmFtZSA9PT0gJC5zZWxlY3RlZCkgeyAlfSBpcy1jaGVja2VkIHslIH0gICV9IFwiPicsXHJcbiAgICAnPGEgaHJlZj1cIiNcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cIm1lbnVpdGVtY2hlY2tib3hcIiBkYXRhLXRoZW1lPVwieyU9ICQuZGF0YSAlfVwiPnslPSAkLm5hbWUgJX08L2E+JyxcclxuICAgICc8L2xpPicsXHJcbiAgXSksXHJcbiAgcGVyc29uYWxpemF0aW9uVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwiaXMtc2VsZWN0YWJsZSB7JSBpZigkLm5hbWUgPT09ICQuc2VsZWN0ZWQpIHsgJX0gaXMtY2hlY2tlZCB7JSB9ICAlfVwiPicsXHJcbiAgICAnPGEgaHJlZj1cIiNcIiB0YWJpbmRleD1cIi0xXCIgcm9sZT1cIm1lbnVpdGVtXCIgZGF0YS1yZ2Jjb2xvcj1cInslPSAkLmRhdGEgJX1cIj57JT0gJC5uYW1lICV9PC9hPicsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG4gIHNlbGVjdGVkVGhlbWU6IHJlc291cmNlLmxpZ2h0VGV4dCxcclxuICBzZWxlY3RlZFBlcnNvbmFsaXphdGlvbjogcmVzb3VyY2UuZGVmYXVsdFRleHQsXHJcbiAgdGhlbWVzOiBbe1xyXG4gICAgbmFtZTogcmVzb3VyY2UubGlnaHRUZXh0LFxyXG4gICAgZGF0YTogJ2xpZ2h0JyxcclxuICB9LCB7XHJcbiAgICBuYW1lOiByZXNvdXJjZS5kYXJrVGV4dCxcclxuICAgIGRhdGE6ICdkYXJrJyxcclxuICB9LCB7XHJcbiAgICBuYW1lOiByZXNvdXJjZS5oaWdoQ29udHJhc3RUZXh0LFxyXG4gICAgZGF0YTogJ2hpZ2gtY29udHJhc3QnLFxyXG4gIH1dLFxyXG4gIHBlcnNvbmFsaXphdGlvbnM6IFt7XHJcbiAgICBuYW1lOiByZXNvdXJjZS5kZWZhdWx0VGV4dCxcclxuICAgIGRhdGE6ICcjMjU3OGE5JyxcclxuICB9LCB7XHJcbiAgICBuYW1lOiByZXNvdXJjZS5henVyZVRleHQsXHJcbiAgICBkYXRhOiAnIzM2OEFDMCcsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogcmVzb3VyY2UuYW1iZXJUZXh0LFxyXG4gICAgZGF0YTogJyNFRkE4MzYnLFxyXG4gIH0sIHtcclxuICAgIG5hbWU6IHJlc291cmNlLmFtZXRoeXN0VGV4dCxcclxuICAgIGRhdGE6ICcjOTI3OUE2JyxcclxuICB9LCB7XHJcbiAgICBuYW1lOiByZXNvdXJjZS50dXJxdW9pc2VUZXh0LFxyXG4gICAgZGF0YTogJyM1NzlFOTUnLFxyXG4gIH0sIHtcclxuICAgIG5hbWU6IHJlc291cmNlLmVtZXJhbGRUZXh0LFxyXG4gICAgZGF0YTogJyM3NkIwNTEnLFxyXG4gIH0sIHtcclxuICAgIG5hbWU6IHJlc291cmNlLmdyYXBoaXRlVGV4dCxcclxuICAgIGRhdGE6ICcjNUM1QzVDJyxcclxuICB9XSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFNpbXBsYXRlIHRoYXQgZGVmaW5lcyB0aGUgdG9vbGJhciBpdGVtIEhUTUwgTWFya3VwXHJcbiAgICpcclxuICAgKiBgJGAgLSBUaGUgdG9vbGJhciBpdGVtIG9iamVjdFxyXG4gICAqIGAkJGAgLSBUaGUgdG9vbGJhciBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHRvb2xUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtgXHJcbiAgICAgIDxidXR0b25cclxuICAgICAgICBjbGFzcz1cImJ0bi1pY29uIHslPSAkLmNscyAlfSB0b29sQnV0dG9uLXJpZ2h0XCJcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0aXRsZT1cInslOiAkLnRpdGxlICV9XCJcclxuICAgICAgICBkYXRhLWFjdGlvbj1cImludm9rZVRvb2xcIlxyXG4gICAgICAgIGRhdGEtdG9vbD1cInslPSAkLmlkICV9XCI+XHJcbiAgICAgICAgeyUgaWYgKCQuc3ZnKSB7ICV9XHJcbiAgICAgICAgPHN2ZyBhcmlhLWhpZGRlbj1cInRydWVcIiBmb2N1c2FibGU9XCJmYWxzZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzcz1cImljb25cIj5cclxuICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXslPSAkLnN2ZyAlfVwiLz5cclxuICAgICAgICA8L3N2Zz5cclxuICAgICAgICB7JSB9ICV9XHJcbiAgICAgICAgPHNwYW4gY2xhc3M9XCJhdWRpYmxlXCI+eyU6ICQudGl0bGUgfHwgJC5pZCAlfTwvc3Bhbj5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICBgLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfVxyXG4gICAqIEN1cnJlbnQgbnVtYmVyIG9mIHRvb2xiYXIgaXRlbXMgc2V0XHJcbiAgICovXHJcbiAgc2l6ZTogMCxcclxuXHJcbiAgLyoqXHJcbiAgICogVGV4dCB0aGF0IGlzIHBsYWNlZCBpbnRvIHRoZSB0b29sYmFyIHRpdGxlTm9kZVxyXG4gICAqL1xyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG4gIHBlcnNvbmFsaXphdGlvblRleHQ6IHJlc291cmNlLnBlcnNvbmFsaXphdGlvblRleHQsXHJcbiAgdGhlbWVUZXh0OiByZXNvdXJjZS50aGVtZVRleHQsXHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxzIHBhcmVudCB7QGxpbmsgVG9vbGJhciNjbGVhciBjbGVhcn0gYW5kIHJlbW92ZXMgYWxsIHRvb2xiYXIgaXRlbXMgZnJvbSBET00uXHJcbiAgICovXHJcbiAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoY2xlYXIsIGFyZ3VtZW50cyk7XHJcbiAgICAkKCdidXR0b24udG9vbEJ1dHRvbi1yaWdodCcsIHRoaXMudG9vbE5vZGUpLnJlbW92ZSgpO1xyXG4gIH0sXHJcbiAgcG9zdENyZWF0ZTogZnVuY3Rpb24gcG9zdENyZWF0ZSgpIHtcclxuICAgIHRoaXMuaW5pdFNvaG8oKTtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHBvc3RDcmVhdGUsIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBfY2hhbmdlUGVyc29uYWxpemF0aW9uOiBmdW5jdGlvbiBjaGFuZ2VDb2xvcihtb2RlLCB2YWx1ZSkge1xyXG4gICAgQXBwLnByZWZlcmVuY2VzW21vZGVdID0gdmFsdWUgJiYgdmFsdWUubm9kZVZhbHVlO1xyXG4gICAgQXBwLnBlcnNpc3RQcmVmZXJlbmNlcygpO1xyXG4gIH0sXHJcbiAgYnVpbGRQZXJzb25hbGl6YXRpb25zOiBmdW5jdGlvbiBidWlsZFBlcnNvbmFsaXphdGlvbnMoKSB7XHJcbiAgICBpZiAoQXBwICYmIEFwcC5wcmVmZXJlbmNlcyAmJiBBcHAucHJlZmVyZW5jZXMuY29sb3IpIHtcclxuICAgICAgY29uc3Qgc2F2ZWRQZXJzb2xpemF0aW9uID0gdGhpcy5wZXJzb25hbGl6YXRpb25zLmZpbmQob2JqID0+IG9iai5kYXRhID09PSBBcHAucHJlZmVyZW5jZXMuY29sb3IpO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkUGVyc29uYWxpemF0aW9uID0gc2F2ZWRQZXJzb2xpemF0aW9uICYmIHNhdmVkUGVyc29saXphdGlvbi5uYW1lO1xyXG4gICAgfVxyXG4gICAgaWYgKEFwcCAmJiBBcHAucHJlZmVyZW5jZXMgJiYgQXBwLnByZWZlcmVuY2VzLnRoZW1lKSB7XHJcbiAgICAgIGNvbnN0IHNhdmVkVGhlbWUgPSB0aGlzLnRoZW1lcy5maW5kKG9iaiA9PiBvYmouZGF0YSA9PT0gQXBwLnByZWZlcmVuY2VzLnRoZW1lKTtcclxuICAgICAgdGhpcy5zZWxlY3RlZFRoZW1lID0gc2F2ZWRUaGVtZSAmJiBzYXZlZFRoZW1lLm5hbWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBlcnNvbmFsaXphdGlvbnMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCBwZXJzID0gJCh0aGlzLnBlcnNvbmFsaXphdGlvblRlbXBsYXRlLmFwcGx5KHtcclxuICAgICAgICBuYW1lOiBpdGVtLm5hbWUsXHJcbiAgICAgICAgZGF0YTogaXRlbS5kYXRhLFxyXG4gICAgICAgIHNlbGVjdGVkOiB0aGlzLnNlbGVjdGVkUGVyc29uYWxpemF0aW9uLFxyXG4gICAgICB9LCB0aGlzKSk7XHJcblxyXG4gICAgICAkKHRoaXMucGVyc29uYWxpemF0aW9uTm9kZSkuYXBwZW5kKHBlcnMpO1xyXG4gICAgfSk7XHJcbiAgICAkKHRoaXMucGVyc29uYWxpemF0aW9uTm9kZSkuY2xpY2soKGUpID0+IHtcclxuICAgICAgdGhpcy5fY2hhbmdlUGVyc29uYWxpemF0aW9uKCdjb2xvcicsIGUudGFyZ2V0LmF0dHJpYnV0ZXNbJ2RhdGEtcmdiY29sb3InXSk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMudGhlbWVzLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgdGhlbWUgPSAkKHRoaXMudGhlbWVUZW1wbGF0ZS5hcHBseSh7XHJcbiAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxyXG4gICAgICAgIGRhdGE6IGl0ZW0uZGF0YSxcclxuICAgICAgICBzZWxlY3RlZDogdGhpcy5zZWxlY3RlZFRoZW1lLFxyXG4gICAgICB9LCB0aGlzKSk7XHJcbiAgICAgICQodGhpcy50aGVtZU5vZGUpLmFwcGVuZCh0aGVtZSk7XHJcbiAgICB9KTtcclxuICAgICQodGhpcy50aGVtZU5vZGUpLmNsaWNrKChlKSA9PiB7XHJcbiAgICAgIHRoaXMuX2NoYW5nZVBlcnNvbmFsaXphdGlvbigndGhlbWUnLCBlLnRhcmdldC5hdHRyaWJ1dGVzWydkYXRhLXRoZW1lJ10pO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBpbml0U29obzogZnVuY3Rpb24gaW5pdFNvaG8oKSB7XHJcbiAgICB0aGlzLmJ1aWxkUGVyc29uYWxpemF0aW9ucygpO1xyXG5cclxuICAgIGNvbnN0IGhlYWRlciA9ICQodGhpcy5kb21Ob2RlKTtcclxuICAgIGhlYWRlci5oZWFkZXIoKTtcclxuICAgIHRoaXMudG9vbGJhciA9IGhlYWRlci5maW5kKCcudG9vbGJhcicpLmRhdGEoJ3Rvb2xiYXInKTtcclxuXHJcbiAgICAkKCcudGl0bGUgPiBoMScsIHRoaXMuZG9tTm9kZSkub24oJ2NsaWNrJywgdGhpcy5vblRpdGxlQ2xpY2spO1xyXG5cclxuICAgIC8vIGluaXQgcGVyc29uYWxpemF0aW9uXHJcbiAgICAkKCdib2R5JykucGVyc29uYWxpemUoe1xyXG4gICAgICBjb2xvcnM6IEFwcCAmJiBBcHAucHJlZmVyZW5jZXMgJiYgQXBwLnByZWZlcmVuY2VzLmNvbG9yLFxyXG4gICAgICB0aGVtZTogQXBwICYmIEFwcC5wcmVmZXJlbmNlcyAmJiBBcHAucHJlZmVyZW5jZXMudGhlbWUsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIHVwZGF0ZVNvaG86IGZ1bmN0aW9uIHVwZGF0ZVNvaG8oKSB7XHJcbiAgICAvLyB1cGRhdGluZyBzb2hvIGhlYWRlciByZXNldHMgdGhlIGhlYWRlciB0ZXh0IHRvIHplcm8gbGV2ZWwuIHVwZGF0ZSBvbmx5IHRvb2xiYmFyIGZvciBub3cuXHJcbiAgICAvLyBJTkZPUkNSTS0xNjAwMDogYWRkZWQgY2hlY2sgZm9yIHRvb2xiYXIgLSBVcGRhdGVUb29sYmFyLmpzIHVzZXMgYXJnb3MvTWFpblRvb2xiYXIgZm9yIGNvbnRyb2xsaW5nIHZpc2liaWxpdHlcclxuICAgIGlmICh0aGlzLnRvb2xiYXIpIHtcclxuICAgICAgdGhpcy50b29sYmFyLnVwZGF0ZWQoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxzIHBhcmVudCB7QGxpbmsgVG9vbGJhciNzaG93VG9vbHMgc2hvd1Rvb2xzfSB3aGljaCBzZXRzIHRoZSB0b29sIGNvbGxlY3Rpb24uXHJcbiAgICogVGhlIGNvbGxlY3Rpb24gaXMgdGhlbiBsb29wZWQgb3ZlciBhbmQgYWRkZWQgdG8gRE9NLCBhZGRpbmcgdGhlIGxlZnQgb3IgcmlnaHQgc3R5bGluZ1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IHRvb2xzIEFycmF5IG9mIHRvb2xiYXIgaXRlbSBkZWZpbml0aW9uc1xyXG4gICAqL1xyXG4gIHNob3dUb29sczogZnVuY3Rpb24gc2hvd1Rvb2xzKHRvb2xzKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChzaG93VG9vbHMsIGFyZ3VtZW50cyk7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoYHRvb2xiYXItc2l6ZS0ke3RoaXMuc2l6ZX1gKTtcclxuICAgIGxldCBvbkxpbmUgPSB0aGlzLmFwcC5vbkxpbmU7XHJcbiAgICBpZiAodG9vbHMpIHtcclxuICAgICAgY29uc3QgY291bnQgPSB7XHJcbiAgICAgICAgbGVmdDogMCxcclxuICAgICAgICByaWdodDogMCxcclxuICAgICAgfTtcclxuXHJcbiAgICAgIC8vIHJlbW92ZSBidXR0b25zIGZyb20gcHJldiB2aWV3XHJcbiAgICAgICQoJ2J1dHRvbi50b29sQnV0dG9uLXJpZ2h0JywgdGhpcy50b29sTm9kZSkucmVtb3ZlKCk7XHJcblxyXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRvb2xzLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgY29uc3QgdG9vbCA9IHRvb2xzW2ldO1xyXG4gICAgICAgIGNvbnN0IHNpZGUgPSB0b29sLnNpZGUgfHwgJ3JpZ2h0JztcclxuICAgICAgICBjb25zdCB0b29sVGVtcGxhdGUgPSB0b29sLnRlbXBsYXRlIHx8IHRoaXMudG9vbFRlbXBsYXRlO1xyXG4gICAgICAgIGNvdW50W3NpZGVdICs9IDE7XHJcbiAgICAgICAgaWYgKHRvb2wub2ZmbGluZSkge1xyXG4gICAgICAgICAgb25MaW5lID0gZmFsc2U7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGlmICh0b29sLmNscyAhPT0gJ2Rpc3BsYXktbm9uZScpIHtcclxuICAgICAgICAgICQodGhpcy50b29sTm9kZSkucHJlcGVuZCh0b29sVGVtcGxhdGUuYXBwbHkodG9vbCwgdGhpcy50b29sc1t0b29sLmlkXSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy51cGRhdGVTb2hvKCk7XHJcblxyXG4gICAgICB0aGlzLnNpemUgPSBNYXRoLm1heChjb3VudC5sZWZ0LCBjb3VudC5yaWdodCk7XHJcbiAgICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcyhgdG9vbGJhci1zaXplLSR7dGhpcy5zaXplfWApO1xyXG4gICAgICB0aGlzLnNldE1vZGUob25MaW5lKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV2ZW50IGhhbmRsZXIgdGhhdCBmaXJlcyB3aGVuIHRoZSB0b29sYmFyIHRpdGxlIGlzIGNsaWNrZWQuXHJcbiAgICovXHJcbiAgb25UaXRsZUNsaWNrOiBmdW5jdGlvbiBvblRpdGxlQ2xpY2soLyogZXZ0Ki8pIHt9LFxyXG4gIHNldE1vZGU6IGZ1bmN0aW9uIHNldE1vZGUob25MaW5lKSB7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkucmVtb3ZlQ2xhc3MoJ29mZmxpbmUnKTtcclxuICAgIGlmICghb25MaW5lKSB7XHJcbiAgICAgICQodGhpcy5kb21Ob2RlKS5hZGRDbGFzcygnb2ZmbGluZScpO1xyXG4gICAgfVxyXG4gIH0sXHJcblxyXG4gIGRpc2FibGVUb29sOiBmdW5jdGlvbiBkaXNhYmxlVG9vbChpZCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoZGlzYWJsZVRvb2wsIGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9nZXRUb29sRE9NTm9kZShpZCk7XHJcbiAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICQocmVzdWx0KS5hZGRDbGFzcygndG9vbEJ1dHRvbi1kaXNhYmxlZCcpO1xyXG4gICAgICByZXN1bHQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZW5hYmxlVG9vbDogZnVuY3Rpb24gZW5hYmxlVG9vbChpZCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoZW5hYmxlVG9vbCwgYXJndW1lbnRzKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX2dldFRvb2xET01Ob2RlKGlkKTtcclxuICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgJChyZXN1bHQpLnJlbW92ZUNsYXNzKCd0b29sQnV0dG9uLWRpc2FibGVkJyk7XHJcbiAgICAgIHJlc3VsdC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgX2dldFRvb2xET01Ob2RlOiBmdW5jdGlvbiBfZ2V0VG9vbERPTU5vZGUoaWQpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9ICQoYGJ1dHRvbltkYXRhLXRvb2w9JHtpZH1dYCwgdGhpcy5kb21Ob2RlKS5maXJzdCgpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==