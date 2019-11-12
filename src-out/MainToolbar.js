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
      this.inherited(arguments);
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
      this.inherited(arguments);
      var result = this._getToolDOMNode(id);
      if (result) {
        $(result).addClass('toolButton-disabled');
        result.disabled = true;
      }
    },
    enableTool: function enableTool(id) {
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NYWluVG9vbGJhci5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJhdHRyaWJ1dGVNYXAiLCJ0aXRsZSIsIm5vZGUiLCJ0eXBlIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsInRoZW1lVGVtcGxhdGUiLCJwZXJzb25hbGl6YXRpb25UZW1wbGF0ZSIsInNlbGVjdGVkVGhlbWUiLCJsaWdodFRleHQiLCJzZWxlY3RlZFBlcnNvbmFsaXphdGlvbiIsImRlZmF1bHRUZXh0IiwidGhlbWVzIiwibmFtZSIsImRhdGEiLCJkYXJrVGV4dCIsImhpZ2hDb250cmFzdFRleHQiLCJwZXJzb25hbGl6YXRpb25zIiwiYXp1cmVUZXh0IiwiYW1iZXJUZXh0IiwiYW1ldGh5c3RUZXh0IiwidHVycXVvaXNlVGV4dCIsImVtZXJhbGRUZXh0IiwiZ3JhcGhpdGVUZXh0IiwidG9vbFRlbXBsYXRlIiwic2l6ZSIsInRpdGxlVGV4dCIsInBlcnNvbmFsaXphdGlvblRleHQiLCJ0aGVtZVRleHQiLCJjbGVhciIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsIiQiLCJ0b29sTm9kZSIsInJlbW92ZSIsInBvc3RDcmVhdGUiLCJpbml0U29obyIsIl9jaGFuZ2VQZXJzb25hbGl6YXRpb24iLCJjaGFuZ2VDb2xvciIsIm1vZGUiLCJ2YWx1ZSIsIkFwcCIsInByZWZlcmVuY2VzIiwibm9kZVZhbHVlIiwicGVyc2lzdFByZWZlcmVuY2VzIiwiYnVpbGRQZXJzb25hbGl6YXRpb25zIiwiY29sb3IiLCJzYXZlZFBlcnNvbGl6YXRpb24iLCJmaW5kIiwib2JqIiwidGhlbWUiLCJzYXZlZFRoZW1lIiwiZm9yRWFjaCIsIml0ZW0iLCJwZXJzIiwiYXBwbHkiLCJzZWxlY3RlZCIsInBlcnNvbmFsaXphdGlvbk5vZGUiLCJhcHBlbmQiLCJjbGljayIsImUiLCJ0YXJnZXQiLCJhdHRyaWJ1dGVzIiwidGhlbWVOb2RlIiwiaGVhZGVyIiwiZG9tTm9kZSIsInRvb2xiYXIiLCJvbiIsIm9uVGl0bGVDbGljayIsInBlcnNvbmFsaXplIiwiY29sb3JzIiwidXBkYXRlU29obyIsInVwZGF0ZWQiLCJzaG93VG9vbHMiLCJ0b29scyIsInJlbW92ZUNsYXNzIiwib25MaW5lIiwiYXBwIiwiY291bnQiLCJsZWZ0IiwicmlnaHQiLCJpIiwibGVuZ3RoIiwidG9vbCIsInNpZGUiLCJ0ZW1wbGF0ZSIsIm9mZmxpbmUiLCJjbHMiLCJwcmVwZW5kIiwiaWQiLCJNYXRoIiwibWF4IiwiYWRkQ2xhc3MiLCJzZXRNb2RlIiwiZGlzYWJsZVRvb2wiLCJyZXN1bHQiLCJfZ2V0VG9vbERPTU5vZGUiLCJkaXNhYmxlZCIsImVuYWJsZVRvb2wiLCJmaXJzdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTUEsV0FBVyxvQkFBWSxhQUFaLENBQWpCOztBQUVBOzs7Ozs7QUF0QkE7Ozs7Ozs7Ozs7Ozs7OztBQTRCQSxNQUFNQyxVQUFVLHVCQUFRLG1CQUFSLEVBQTZCLG1CQUE3QixFQUF3QyxnQ0FBZ0M7QUFDdEY7Ozs7QUFJQUMsa0JBQWM7QUFDWkMsYUFBTztBQUNMQyxjQUFNLFdBREQ7QUFFTEMsY0FBTTtBQUZEO0FBREssS0FMd0U7QUFXdEY7Ozs7OztBQU1BQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLHFvREFBYixDQWpCc0U7QUFtRHRGQyxtQkFBZSxJQUFJRCxRQUFKLENBQWEsQ0FDMUIsbUZBRDBCLEVBRTFCLGdHQUYwQixFQUcxQixPQUgwQixDQUFiLENBbkR1RTtBQXdEdEZFLDZCQUF5QixJQUFJRixRQUFKLENBQWEsQ0FDcEMsa0ZBRG9DLEVBRXBDLDJGQUZvQyxFQUdwQyxPQUhvQyxDQUFiLENBeEQ2RDtBQTZEdEZHLG1CQUFlVixTQUFTVyxTQTdEOEQ7QUE4RHRGQyw2QkFBeUJaLFNBQVNhLFdBOURvRDtBQStEdEZDLFlBQVEsQ0FBQztBQUNQQyxZQUFNZixTQUFTVyxTQURSO0FBRVBLLFlBQU07QUFGQyxLQUFELEVBR0w7QUFDREQsWUFBTWYsU0FBU2lCLFFB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QUYsRUFBVXBCLFdBQVYsQ0FBc0IscUJBQXRCO0FBQ0FvQixlQUFPRSxRQUFQLEdBQWtCLEtBQWxCO0FBQ0Q7QUFDRixLQXpRcUY7QUEwUXRGRCxxQkFBaUIsU0FBU0EsZUFBVCxDQUF5QlAsRUFBekIsRUFBNkI7QUFDNUMsVUFBTU0sU0FBUy9ELHdCQUFzQnlELEVBQXRCLFFBQTZCLEtBQUt4QixPQUFsQyxFQUEyQ2tDLEtBQTNDLEVBQWY7QUFDQSxhQUFPSixNQUFQO0FBQ0Q7QUE3UXFGLEdBQXhFLENBQWhCOztvQkFnUmVoRyxPIiwiZmlsZSI6Ik1haW5Ub29sYmFyLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgVG9vbGJhciBmcm9tICcuL1Rvb2xiYXInO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi9JMThuJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdtYWluVG9vbGJhcicpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5NYWluVG9vbGJhclxyXG4gKiBAY2xhc3NkZXNjIE1haW5Ub29sYmFyIGlzIGRlc2lnbmVkIHRvIGhhbmRsZSB0aGUgdG9wIGFwcGxpY2F0aW9uIGJhciB3aXRoIG1hcmt1cCBhbmQgbG9naWMgdG8gc2V0XHJcbiAqIGEgdGl0bGUgYW5kIHBvc2l0aW9uIHRvb2xiYXIgaXRlbXMgdG8gdGhlIGxlZnQgb3IgcmlnaHRcclxuICogQGV4dGVuZHMgYXJnb3MuVG9vbGJhclxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLk1haW5Ub29sYmFyJywgW1Rvb2xiYXJdLCAvKiogQGxlbmRzIGFyZ29zLk1haW5Ub29sYmFyIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBVc2VkIHRvIHNldCB0aGUgdGl0bGUgbm9kZSdzIGlubmVySFRNTFxyXG4gICAqL1xyXG4gIGF0dHJpYnV0ZU1hcDoge1xyXG4gICAgdGl0bGU6IHtcclxuICAgICAgbm9kZTogJ3RpdGxlTm9kZScsXHJcbiAgICAgIHR5cGU6ICdpbm5lckhUTUwnLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBtYWluIEhUTUwgTWFya3VwIG9mIHRoZSB0b29sYmFyXHJcbiAgICpcclxuICAgKiBgJGAgLSB0aGUgdG9vbGJhciBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW2BcclxuICAgIDxoZWFkZXIgY2xhc3M9XCJoZWFkZXIgaXMtcGVyc29uYWxpemFibGUgaXMtc2Nyb2xsZWQtZG93blwiIGRhdGEtb3B0aW9ucz1cInthZGRTY3JvbGxDbGFzczogdHJ1ZX1cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInRvb2xiYXIgZG8tcmVzaXplIGhhcy1tb3JlLWJ1dHRvbiBoYXMtdGl0bGUtYnV0dG9uXCIgcm9sZT1cInRvb2xiYXJcIiBhcmlhLWxhYmVsPVwiTGF5b3V0c1wiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ0aXRsZVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1pY29uIGFwcGxpY2F0aW9uLW1lbnUtdHJpZ2dlciBoaWRlLWZvY3VzXCIgdHlwZT1cImJ1dHRvblwiIHRhYmluZGV4PVwiMFwiPlxyXG4gICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXVkaWJsZVwiPlNob3cgbmF2aWdhdGlvbjwvc3Bhbj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImljb24gYXBwLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJvbmVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInR3b1wiPjwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwidGhyZWVcIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgPC9zcGFuPlxyXG4gICAgICAgICAgPC9idXR0b24+XHJcbiAgICAgICAgICA8aDEgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInRpdGxlTm9kZVwiPnslPSAkLnRpdGxlVGV4dCAlfTwvaDE+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImJ1dHRvbnNldFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ0b29sTm9kZVwiPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJtb3JlXCI+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwiYnRuLWFjdGlvbnMgcGFnZS1jaGFuZ2VyXCIgdHlwZT1cImJ1dHRvblwiIGRhdGEtb3B0aW9ucz1cInthdHRhY2hUb0JvZHk6IHRydWV9XCI+XHJcbiAgICAgICAgICAgIDxzdmcgY2xhc3M9XCJpY29uXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiBhcmlhLWhpZGRlbj1cInRydWVcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+XHJcbiAgICAgICAgICAgICAgPHVzZSB4bGluazpocmVmPVwiI2ljb24tbW9yZVwiPjwvdXNlPlxyXG4gICAgICAgICAgICA8L3N2Zz5cclxuICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJhdWRpYmxlXCIgZGF0YS10cmFuc2xhdGU9XCJ0ZXh0XCI+TW9yZTwvc3Bhbj5cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPHVsIGlkPVwiYXBwLXRvb2xiYXItbW9yZVwiIGNsYXNzPVwicG9wdXBtZW51IGlzLXNlbGVjdGFibGVcIj5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwiaGVhZGluZ1wiIHJvbGU9XCJwcmVzZW50YXRpb25cIj57JT0gJC50aGVtZVRleHQgJX08L2xpPlxyXG4gICAgICAgICAgICA8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ0aGVtZU5vZGVcIj48L2Rpdj5cclxuICAgICAgICAgICAgPGxpIGNsYXNzPVwic2VwYXJhdG9yXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPjwvbGk+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImhlYWRpbmdcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+eyU9ICQucGVyc29uYWxpemF0aW9uVGV4dCAlfTwvbGk+XHJcbiAgICAgICAgICAgIDxkaXYgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cInBlcnNvbmFsaXphdGlvbk5vZGVcIj48L2Rpdj5cclxuICAgICAgICAgIDwvdWw+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PlxyXG4gICAgPC9oZWFkZXI+XHJcbiAgYF0pLFxyXG4gIHRoZW1lVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwiaXMtc2VsZWN0YWJsZSB7JSBpZigkLm5hbWUgPT09ICQuc2VsZWN0ZWQpIHsgJX0gaXMtY2hlY2tlZCB7JSB9ICAlfSBcIj4nLFxyXG4gICAgJzxhIGhyZWY9XCIjXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJtZW51aXRlbWNoZWNrYm94XCIgZGF0YS10aGVtZT1cInslPSAkLmRhdGEgJX1cIj57JT0gJC5uYW1lICV9PC9hPicsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG4gIHBlcnNvbmFsaXphdGlvblRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaSBjbGFzcz1cImlzLXNlbGVjdGFibGUgeyUgaWYoJC5uYW1lID09PSAkLnNlbGVjdGVkKSB7ICV9IGlzLWNoZWNrZWQgeyUgfSAgJX1cIj4nLFxyXG4gICAgJzxhIGhyZWY9XCIjXCIgdGFiaW5kZXg9XCItMVwiIHJvbGU9XCJtZW51aXRlbVwiIGRhdGEtcmdiY29sb3I9XCJ7JT0gJC5kYXRhICV9XCI+eyU9ICQubmFtZSAlfTwvYT4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuICBzZWxlY3RlZFRoZW1lOiByZXNvdXJjZS5saWdodFRleHQsXHJcbiAgc2VsZWN0ZWRQZXJzb25hbGl6YXRpb246IHJlc291cmNlLmRlZmF1bHRUZXh0LFxyXG4gIHRoZW1lczogW3tcclxuICAgIG5hbWU6IHJlc291cmNlLmxpZ2h0VGV4dCxcclxuICAgIGRhdGE6ICdsaWdodCcsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogcmVzb3VyY2UuZGFya1RleHQsXHJcbiAgICBkYXRhOiAnZGFyaycsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogcmVzb3VyY2UuaGlnaENvbnRyYXN0VGV4dCxcclxuICAgIGRhdGE6ICdoaWdoLWNvbnRyYXN0JyxcclxuICB9XSxcclxuICBwZXJzb25hbGl6YXRpb25zOiBbe1xyXG4gICAgbmFtZTogcmVzb3VyY2UuZGVmYXVsdFRleHQsXHJcbiAgICBkYXRhOiAnIzI1NzhhOScsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogcmVzb3VyY2UuYXp1cmVUZXh0LFxyXG4gICAgZGF0YTogJyMzNjhBQzAnLFxyXG4gIH0sIHtcclxuICAgIG5hbWU6IHJlc291cmNlLmFtYmVyVGV4dCxcclxuICAgIGRhdGE6ICcjRUZBODM2JyxcclxuICB9LCB7XHJcbiAgICBuYW1lOiByZXNvdXJjZS5hbWV0aHlzdFRleHQsXHJcbiAgICBkYXRhOiAnIzkyNzlBNicsXHJcbiAgfSwge1xyXG4gICAgbmFtZTogcmVzb3VyY2UudHVycXVvaXNlVGV4dCxcclxuICAgIGRhdGE6ICcjNTc5RTk1JyxcclxuICB9LCB7XHJcbiAgICBuYW1lOiByZXNvdXJjZS5lbWVyYWxkVGV4dCxcclxuICAgIGRhdGE6ICcjNzZCMDUxJyxcclxuICB9LCB7XHJcbiAgICBuYW1lOiByZXNvdXJjZS5ncmFwaGl0ZVRleHQsXHJcbiAgICBkYXRhOiAnIzVDNUM1QycsXHJcbiAgfV0sXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBTaW1wbGF0ZSB0aGF0IGRlZmluZXMgdGhlIHRvb2xiYXIgaXRlbSBIVE1MIE1hcmt1cFxyXG4gICAqXHJcbiAgICogYCRgIC0gVGhlIHRvb2xiYXIgaXRlbSBvYmplY3RcclxuICAgKiBgJCRgIC0gVGhlIHRvb2xiYXIgaW5zdGFuY2VcclxuICAgKi9cclxuICB0b29sVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbYFxyXG4gICAgICA8YnV0dG9uXHJcbiAgICAgICAgY2xhc3M9XCJidG4taWNvbiB7JT0gJC5jbHMgJX0gdG9vbEJ1dHRvbi1yaWdodFwiXHJcbiAgICAgICAgdHlwZT1cImJ1dHRvblwiXHJcbiAgICAgICAgdGl0bGU9XCJ7JTogJC50aXRsZSAlfVwiXHJcbiAgICAgICAgZGF0YS1hY3Rpb249XCJpbnZva2VUb29sXCJcclxuICAgICAgICBkYXRhLXRvb2w9XCJ7JT0gJC5pZCAlfVwiPlxyXG4gICAgICAgIHslIGlmICgkLnN2ZykgeyAlfVxyXG4gICAgICAgIDxzdmcgYXJpYS1oaWRkZW49XCJ0cnVlXCIgZm9jdXNhYmxlPVwiZmFsc2VcIiByb2xlPVwicHJlc2VudGF0aW9uXCIgY2xhc3M9XCJpY29uXCI+XHJcbiAgICAgICAgICA8dXNlIHhsaW5rOmhyZWY9XCIjaWNvbi17JT0gJC5zdmcgJX1cIi8+XHJcbiAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgeyUgfSAlfVxyXG4gICAgICAgIDxzcGFuIGNsYXNzPVwiYXVkaWJsZVwiPnslOiAkLnRpdGxlIHx8ICQuaWQgJX08L3NwYW4+XHJcbiAgICAgIDwvYnV0dG9uPlxyXG4gICAgYCxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge051bWJlcn1cclxuICAgKiBDdXJyZW50IG51bWJlciBvZiB0b29sYmFyIGl0ZW1zIHNldFxyXG4gICAqL1xyXG4gIHNpemU6IDAsXHJcblxyXG4gIC8qKlxyXG4gICAqIFRleHQgdGhhdCBpcyBwbGFjZWQgaW50byB0aGUgdG9vbGJhciB0aXRsZU5vZGVcclxuICAgKi9cclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuICBwZXJzb25hbGl6YXRpb25UZXh0OiByZXNvdXJjZS5wZXJzb25hbGl6YXRpb25UZXh0LFxyXG4gIHRoZW1lVGV4dDogcmVzb3VyY2UudGhlbWVUZXh0LFxyXG5cclxuICAvKipcclxuICAgKiBDYWxscyBwYXJlbnQge0BsaW5rIFRvb2xiYXIjY2xlYXIgY2xlYXJ9IGFuZCByZW1vdmVzIGFsbCB0b29sYmFyIGl0ZW1zIGZyb20gRE9NLlxyXG4gICAqL1xyXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgICAkKCdidXR0b24udG9vbEJ1dHRvbi1yaWdodCcsIHRoaXMudG9vbE5vZGUpLnJlbW92ZSgpO1xyXG4gIH0sXHJcbiAgcG9zdENyZWF0ZTogZnVuY3Rpb24gcG9zdENyZWF0ZSgpIHtcclxuICAgIHRoaXMuaW5pdFNvaG8oKTtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBfY2hhbmdlUGVyc29uYWxpemF0aW9uOiBmdW5jdGlvbiBjaGFuZ2VDb2xvcihtb2RlLCB2YWx1ZSkge1xyXG4gICAgQXBwLnByZWZlcmVuY2VzW21vZGVdID0gdmFsdWUgJiYgdmFsdWUubm9kZVZhbHVlO1xyXG4gICAgQXBwLnBlcnNpc3RQcmVmZXJlbmNlcygpO1xyXG4gIH0sXHJcbiAgYnVpbGRQZXJzb25hbGl6YXRpb25zOiBmdW5jdGlvbiBidWlsZFBlcnNvbmFsaXphdGlvbnMoKSB7XHJcbiAgICBpZiAoQXBwICYmIEFwcC5wcmVmZXJlbmNlcyAmJiBBcHAucHJlZmVyZW5jZXMuY29sb3IpIHtcclxuICAgICAgY29uc3Qgc2F2ZWRQZXJzb2xpemF0aW9uID0gdGhpcy5wZXJzb25hbGl6YXRpb25zLmZpbmQob2JqID0+IG9iai5kYXRhID09PSBBcHAucHJlZmVyZW5jZXMuY29sb3IpO1xyXG4gICAgICB0aGlzLnNlbGVjdGVkUGVyc29uYWxpemF0aW9uID0gc2F2ZWRQZXJzb2xpemF0aW9uICYmIHNhdmVkUGVyc29saXphdGlvbi5uYW1lO1xyXG4gICAgfVxyXG4gICAgaWYgKEFwcCAmJiBBcHAucHJlZmVyZW5jZXMgJiYgQXBwLnByZWZlcmVuY2VzLnRoZW1lKSB7XHJcbiAgICAgIGNvbnN0IHNhdmVkVGhlbWUgPSB0aGlzLnRoZW1lcy5maW5kKG9iaiA9PiBvYmouZGF0YSA9PT0gQXBwLnByZWZlcmVuY2VzLnRoZW1lKTtcclxuICAgICAgdGhpcy5zZWxlY3RlZFRoZW1lID0gc2F2ZWRUaGVtZSAmJiBzYXZlZFRoZW1lLm5hbWU7XHJcbiAgICB9XHJcbiAgICB0aGlzLnBlcnNvbmFsaXphdGlvbnMuZm9yRWFjaCgoaXRlbSkgPT4ge1xyXG4gICAgICBjb25zdCBwZXJzID0gJCh0aGlzLnBlcnNvbmFsaXphdGlvblRlbXBsYXRlLmFwcGx5KHtcclxuICAgICAgICBuYW1lOiBpdGVtLm5hbWUsXHJcbiAgICAgICAgZGF0YTogaXRlbS5kYXRhLFxyXG4gICAgICAgIHNlbGVjdGVkOiB0aGlzLnNlbGVjdGVkUGVyc29uYWxpemF0aW9uLFxyXG4gICAgICB9LCB0aGlzKSk7XHJcblxyXG4gICAgICAkKHRoaXMucGVyc29uYWxpemF0aW9uTm9kZSkuYXBwZW5kKHBlcnMpO1xyXG4gICAgfSk7XHJcbiAgICAkKHRoaXMucGVyc29uYWxpemF0aW9uTm9kZSkuY2xpY2soKGUpID0+IHtcclxuICAgICAgdGhpcy5fY2hhbmdlUGVyc29uYWxpemF0aW9uKCdjb2xvcicsIGUudGFyZ2V0LmF0dHJpYnV0ZXNbJ2RhdGEtcmdiY29sb3InXSk7XHJcbiAgICB9KTtcclxuICAgIHRoaXMudGhlbWVzLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgY29uc3QgdGhlbWUgPSAkKHRoaXMudGhlbWVUZW1wbGF0ZS5hcHBseSh7XHJcbiAgICAgICAgbmFtZTogaXRlbS5uYW1lLFxyXG4gICAgICAgIGRhdGE6IGl0ZW0uZGF0YSxcclxuICAgICAgICBzZWxlY3RlZDogdGhpcy5zZWxlY3RlZFRoZW1lLFxyXG4gICAgICB9LCB0aGlzKSk7XHJcbiAgICAgICQodGhpcy50aGVtZU5vZGUpLmFwcGVuZCh0aGVtZSk7XHJcbiAgICB9KTtcclxuICAgICQodGhpcy50aGVtZU5vZGUpLmNsaWNrKChlKSA9PiB7XHJcbiAgICAgIHRoaXMuX2NoYW5nZVBlcnNvbmFsaXphdGlvbigndGhlbWUnLCBlLnRhcmdldC5hdHRyaWJ1dGVzWydkYXRhLXRoZW1lJ10pO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBpbml0U29obzogZnVuY3Rpb24gaW5pdFNvaG8oKSB7XHJcbiAgICB0aGlzLmJ1aWxkUGVyc29uYWxpemF0aW9ucygpO1xyXG5cclxuICAgIGNvbnN0IGhlYWRlciA9ICQodGhpcy5kb21Ob2RlKTtcclxuICAgIGhlYWRlci5oZWFkZXIoKTtcclxuICAgIHRoaXMudG9vbGJhciA9IGhlYWRlci5maW5kKCcudG9vbGJhcicpLmRhdGEoJ3Rvb2xiYXInKTtcclxuXHJcbiAgICAkKCcudGl0bGUgPiBoMScsIHRoaXMuZG9tTm9kZSkub24oJ2NsaWNrJywgdGhpcy5vblRpdGxlQ2xpY2spO1xyXG5cclxuICAgIC8vIGluaXQgcGVyc29uYWxpemF0aW9uXHJcbiAgICAkKCdib2R5JykucGVyc29uYWxpemUoe1xyXG4gICAgICBjb2xvcnM6IEFwcCAmJiBBcHAucHJlZmVyZW5jZXMgJiYgQXBwLnByZWZlcmVuY2VzLmNvbG9yLFxyXG4gICAgICB0aGVtZTogQXBwICYmIEFwcC5wcmVmZXJlbmNlcyAmJiBBcHAucHJlZmVyZW5jZXMudGhlbWUsXHJcbiAgICB9KTtcclxuICB9LFxyXG4gIHVwZGF0ZVNvaG86IGZ1bmN0aW9uIHVwZGF0ZVNvaG8oKSB7XHJcbiAgICAvLyB1cGRhdGluZyBzb2hvIGhlYWRlciByZXNldHMgdGhlIGhlYWRlciB0ZXh0IHRvIHplcm8gbGV2ZWwuIHVwZGF0ZSBvbmx5IHRvb2xiYmFyIGZvciBub3cuXHJcbiAgICAvLyBJTkZPUkNSTS0xNjAwMDogYWRkZWQgY2hlY2sgZm9yIHRvb2xiYXIgLSBVcGRhdGVUb29sYmFyLmpzIHVzZXMgYXJnb3MvTWFpblRvb2xiYXIgZm9yIGNvbnRyb2xsaW5nIHZpc2liaWxpdHlcclxuICAgIGlmICh0aGlzLnRvb2xiYXIpIHtcclxuICAgICAgdGhpcy50b29sYmFyLnVwZGF0ZWQoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIENhbGxzIHBhcmVudCB7QGxpbmsgVG9vbGJhciNzaG93VG9vbHMgc2hvd1Rvb2xzfSB3aGljaCBzZXRzIHRoZSB0b29sIGNvbGxlY3Rpb24uXHJcbiAgICogVGhlIGNvbGxlY3Rpb24gaXMgdGhlbiBsb29wZWQgb3ZlciBhbmQgYWRkZWQgdG8gRE9NLCBhZGRpbmcgdGhlIGxlZnQgb3IgcmlnaHQgc3R5bGluZ1xyXG4gICAqIEBwYXJhbSB7T2JqZWN0W119IHRvb2xzIEFycmF5IG9mIHRvb2xiYXIgaXRlbSBkZWZpbml0aW9uc1xyXG4gICAqL1xyXG4gIHNob3dUb29sczogZnVuY3Rpb24gc2hvd1Rvb2xzKHRvb2xzKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKGB0b29sYmFyLXNpemUtJHt0aGlzLnNpemV9YCk7XHJcbiAgICBsZXQgb25MaW5lID0gdGhpcy5hcHAub25MaW5lO1xyXG4gICAgaWYgKHRvb2xzKSB7XHJcbiAgICAgIGNvbnN0IGNvdW50ID0ge1xyXG4gICAgICAgIGxlZnQ6IDAsXHJcbiAgICAgICAgcmlnaHQ6IDAsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICAvLyByZW1vdmUgYnV0dG9ucyBmcm9tIHByZXYgdmlld1xyXG4gICAgICAkKCdidXR0b24udG9vbEJ1dHRvbi1yaWdodCcsIHRoaXMudG9vbE5vZGUpLnJlbW92ZSgpO1xyXG5cclxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b29scy5sZW5ndGg7IGkrKykge1xyXG4gICAgICAgIGNvbnN0IHRvb2wgPSB0b29sc1tpXTtcclxuICAgICAgICBjb25zdCBzaWRlID0gdG9vbC5zaWRlIHx8ICdyaWdodCc7XHJcbiAgICAgICAgY29uc3QgdG9vbFRlbXBsYXRlID0gdG9vbC50ZW1wbGF0ZSB8fCB0aGlzLnRvb2xUZW1wbGF0ZTtcclxuICAgICAgICBjb3VudFtzaWRlXSArPSAxO1xyXG4gICAgICAgIGlmICh0b29sLm9mZmxpbmUpIHtcclxuICAgICAgICAgIG9uTGluZSA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuICAgICAgICBpZiAodG9vbC5jbHMgIT09ICdkaXNwbGF5LW5vbmUnKSB7XHJcbiAgICAgICAgICAkKHRoaXMudG9vbE5vZGUpLnByZXBlbmQodG9vbFRlbXBsYXRlLmFwcGx5KHRvb2wsIHRoaXMudG9vbHNbdG9vbC5pZF0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMudXBkYXRlU29obygpO1xyXG5cclxuICAgICAgdGhpcy5zaXplID0gTWF0aC5tYXgoY291bnQubGVmdCwgY291bnQucmlnaHQpO1xyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoYHRvb2xiYXItc2l6ZS0ke3RoaXMuc2l6ZX1gKTtcclxuICAgICAgdGhpcy5zZXRNb2RlKG9uTGluZSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBFdmVudCBoYW5kbGVyIHRoYXQgZmlyZXMgd2hlbiB0aGUgdG9vbGJhciB0aXRsZSBpcyBjbGlja2VkLlxyXG4gICAqL1xyXG4gIG9uVGl0bGVDbGljazogZnVuY3Rpb24gb25UaXRsZUNsaWNrKC8qIGV2dCovKSB7fSxcclxuICBzZXRNb2RlOiBmdW5jdGlvbiBzZXRNb2RlKG9uTGluZSkge1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCdvZmZsaW5lJyk7XHJcbiAgICBpZiAoIW9uTGluZSkge1xyXG4gICAgICAkKHRoaXMuZG9tTm9kZSkuYWRkQ2xhc3MoJ29mZmxpbmUnKTtcclxuICAgIH1cclxuICB9LFxyXG5cclxuICBkaXNhYmxlVG9vbDogZnVuY3Rpb24gZGlzYWJsZVRvb2woaWQpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgICBjb25zdCByZXN1bHQgPSB0aGlzLl9nZXRUb29sRE9NTm9kZShpZCk7XHJcbiAgICBpZiAocmVzdWx0KSB7XHJcbiAgICAgICQocmVzdWx0KS5hZGRDbGFzcygndG9vbEJ1dHRvbi1kaXNhYmxlZCcpO1xyXG4gICAgICByZXN1bHQuZGlzYWJsZWQgPSB0cnVlO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgZW5hYmxlVG9vbDogZnVuY3Rpb24gZW5hYmxlVG9vbChpZCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX2dldFRvb2xET01Ob2RlKGlkKTtcclxuICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgJChyZXN1bHQpLnJlbW92ZUNsYXNzKCd0b29sQnV0dG9uLWRpc2FibGVkJyk7XHJcbiAgICAgIHJlc3VsdC5kaXNhYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgX2dldFRvb2xET01Ob2RlOiBmdW5jdGlvbiBfZ2V0VG9vbERPTU5vZGUoaWQpIHtcclxuICAgIGNvbnN0IHJlc3VsdCA9ICQoYGJ1dHRvbltkYXRhLXRvb2w9JHtpZH1dYCwgdGhpcy5kb21Ob2RlKS5maXJzdCgpO1xyXG4gICAgcmV0dXJuIHJlc3VsdDtcclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==