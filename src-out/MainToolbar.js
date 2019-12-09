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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9NYWluVG9vbGJhci5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJhdHRyaWJ1dGVNYXAiLCJ0aXRsZSIsIm5vZGUiLCJ0eXBlIiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsInRoZW1lVGVtcGxhdGUiLCJwZXJzb25hbGl6YXRpb25UZW1wbGF0ZSIsInNlbGVjdGVkVGhlbWUiLCJzZWxlY3RlZFBlcnNvbmFsaXphdGlvbiIsImRlZmF1bHRUZXh0IiwidG9vbFRlbXBsYXRlIiwic2l6ZSIsInRpdGxlVGV4dCIsInBlcnNvbmFsaXphdGlvblRleHQiLCJ0aGVtZVRleHQiLCJjbGVhciIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsIiQiLCJ0b29sTm9kZSIsInJlbW92ZSIsInBvc3RDcmVhdGUiLCJpbml0U29obyIsIl9jaGFuZ2VQZXJzb25hbGl6YXRpb24iLCJjaGFuZ2VDb2xvciIsIm1vZGUiLCJ2YWx1ZSIsIkFwcCIsInByZWZlcmVuY2VzIiwibm9kZVZhbHVlIiwicGVyc2lzdFByZWZlcmVuY2VzIiwiYnVpbGRQZXJzb25hbGl6YXRpb25zIiwic29ob0NvbG9ycyIsIlNvaG8iLCJ0aGVtZSIsInBlcnNvbmFsaXphdGlvbkNvbG9ycyIsImNvbG9ySWQiLCJzYXZlZFBlcnNvbGl6YXRpb24iLCJuYW1lIiwic2F2ZWRUaGVtZSIsInRoZW1lcyIsImZpbmQiLCJvYmoiLCJpZCIsIk9iamVjdCIsImtleXMiLCJmb3JFYWNoIiwia2V5IiwiY29sb3IiLCJwZXJzIiwiYXBwbHkiLCJkYXRhIiwiY29sb3JpZCIsInNlbGVjdGVkIiwicGVyc29uYWxpemF0aW9uTm9kZSIsImFwcGVuZCIsImNsaWNrIiwiZSIsInRhcmdldCIsImF0dHJpYnV0ZXMiLCJpdGVtIiwidGhlbWVOb2RlIiwiaGVhZGVyIiwiZG9tTm9kZSIsInRvb2xiYXIiLCJvbiIsIm9uVGl0bGVDbGljayIsInBlcnNvbmFsaXplIiwiY29sb3JzIiwidXBkYXRlU29obyIsInVwZGF0ZWQiLCJzaG93VG9vbHMiLCJ0b29scyIsInJlbW92ZUNsYXNzIiwib25MaW5lIiwiYXBwIiwiY291bnQiLCJsZWZ0IiwicmlnaHQiLCJpIiwibGVuZ3RoIiwidG9vbCIsInNpZGUiLCJ0ZW1wbGF0ZSIsIm9mZmxpbmUiLCJjbHMiLCJwcmVwZW5kIiwiTWF0aCIsIm1heCIsImFkZENsYXNzIiwic2V0TW9kZSIsImRpc2FibGVUb29sIiwicmVzdWx0IiwiX2dldFRvb2xET01Ob2RlIiwiZGlzYWJsZWQiLCJlbmFibGVUb29sIiwiZmlyc3QiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBb0JBLE1BQU1BLFdBQVcsb0JBQVksYUFBWixDQUFqQjs7QUFFQTs7Ozs7O0FBdEJBOzs7Ozs7Ozs7Ozs7Ozs7QUE0QkEsTUFBTUMsVUFBVSx1QkFBUSxtQkFBUixFQUE2QixtQkFBN0IsRUFBd0MsZ0NBQWdDO0FBQ3RGOzs7O0FBSUFDLGtCQUFjO0FBQ1pDLGFBQU87QUFDTEMsY0FBTSxXQUREO0FBRUxDLGNBQU07QUFGRDtBQURLLEtBTHdFO0FBV3RGOzs7Ozs7QUFNQUMsb0JBQWdCLElBQUlDLFFBQUosQ0FBYSwycURBQWIsQ0FqQnNFO0FBbUR0RkMsbUJBQWUsSUFBSUQsUUFBSixDQUFhLENBQzFCLG1GQUQwQixFQUUxQixnR0FGMEIsRUFHMUIsT0FIMEIsQ0FBYixDQW5EdUU7QUF3RHRGRSw2QkFBeUIsSUFBSUYsUUFBSixDQUFhLENBQ3BDLGtGQURvQyxFQUVwQywySEFGb0MsRUFHcEMsT0FIb0MsQ0FBYixDQXhENkQ7QUE2RHRGRyxtQkFBZSxFQTdEdUU7QUE4RHRGQyw2QkFBeUJYLFNBQVNZLFdBOURvRDtBQStEdEY7Ozs7Ozs7QUFPQUMsa0JBQWMsSUFBSU4sUUFBSixDQUFhLDZkQUFiLENBdEV3RTtBQXNGdEY7Ozs7QUFJQU8sVUFBTSxDQTFGZ0Y7O0FBNEZ0Rjs7O0FBR0FDLGVBQVdmLFNBQVNlLFNBL0ZrRTtBQWdHdEZDLHlCQUFxQmhCLFNBQVNnQixtQkFoR3dEO0FBaUd0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Q0MsTUFBTCxFQUFhO0FBQ1h4RCxVQUFFLEtBQUs2QyxPQUFQLEVBQWdCMEIsUUFBaEIsQ0FBeUIsU0FBekI7QUFDRDtBQUNGLEtBN05xRjs7QUErTnRGRSxpQkFBYSxTQUFTQSxXQUFULENBQXFCaEQsRUFBckIsRUFBeUI7QUFDcEMsV0FBSzNCLFNBQUwsQ0FBZTJFLFdBQWYsRUFBNEIxRSxTQUE1QjtBQUNBLFVBQU0yRSxTQUFTLEtBQUtDLGVBQUwsQ0FBcUJsRCxFQUFyQixDQUFmO0FBQ0EsVUFBSWlELE1BQUosRUFBWTtBQUNWMUUsVUFBRTBFLE1BQUYsRUFBVUgsUUFBVixDQUFtQixxQkFBbkI7QUFDQUcsZUFBT0UsUUFBUCxHQUFrQixJQUFsQjtBQUNEO0FBQ0YsS0F0T3FGO0FBdU90RkMsZ0JBQVksU0FBU0EsVUFBVCxDQUFvQnBELEVBQXBCLEVBQXdCO0FBQ2xDLFdBQUszQixTQUFMLENBQWUrRSxVQUFmLEVBQTJCOUUsU0FBM0I7QUFDQSxVQUFNMkUsU0FBUyxLQUFLQyxlQUFMLENBQXFCbEQsRUFBckIsQ0FBZjtBQUNBLFVBQUlpRCxNQUFKLEVBQVk7QUFDVjFFLFVBQUUwRSxNQUFGLEVBQVVuQixXQUFWLENBQXNCLHFCQUF0QjtBQUNBbUIsZUFBT0UsUUFBUCxHQUFrQixLQUFsQjtBQUNEO0FBQ0YsS0E5T3FGO0FBK090RkQscUJBQWlCLFNBQVNBLGVBQVQsQ0FBeUJsRCxFQUF6QixFQUE2QjtBQUM1QyxVQUFNaUQsU0FBUzFFLHdCQUFzQnlCLEVBQXRCLFFBQTZCLEtBQUtvQixPQUFsQyxFQUEyQ2lDLEtBQTNDLEVBQWY7QUFDQSxhQUFPSixNQUFQO0FBQ0Q7QUFsUHFGLEdBQXhFLENBQWhCOztvQkFxUGU5RixPIiwiZmlsZSI6Ik1haW5Ub29sYmFyLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAoYykgMjAxMCwgU2FnZSBTb2Z0d2FyZSwgSW5jLiBBbGwgcmlnaHRzIHJlc2VydmVkLlxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgVG9vbGJhciBmcm9tICcuL1Rvb2xiYXInO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi9JMThuJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdtYWluVG9vbGJhcicpO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5NYWluVG9vbGJhclxyXG4gKiBAY2xhc3NkZXNjIE1haW5Ub29sYmFyIGlzIGRlc2lnbmVkIHRvIGhhbmRsZSB0aGUgdG9wIGFwcGxpY2F0aW9uIGJhciB3aXRoIG1hcmt1cCBhbmQgbG9naWMgdG8gc2V0XHJcbiAqIGEgdGl0bGUgYW5kIHBvc2l0aW9uIHRvb2xiYXIgaXRlbXMgdG8gdGhlIGxlZnQgb3IgcmlnaHRcclxuICogQGV4dGVuZHMgYXJnb3MuVG9vbGJhclxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLk1haW5Ub29sYmFyJywgW1Rvb2xiYXJdLCAvKiogQGxlbmRzIGFyZ29zLk1haW5Ub29sYmFyIyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge09iamVjdH1cclxuICAgKiBVc2VkIHRvIHNldCB0aGUgdGl0bGUgbm9kZSdzIGlubmVySFRNTFxyXG4gICAqL1xyXG4gIGF0dHJpYnV0ZU1hcDoge1xyXG4gICAgdGl0bGU6IHtcclxuICAgICAgbm9kZTogJ3RpdGxlTm9kZScsXHJcbiAgICAgIHR5cGU6ICdpbm5lckhUTUwnLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxhdGUgdGhhdCBkZWZpbmVzIHRoZSBtYWluIEhUTUwgTWFya3VwIG9mIHRoZSB0b29sYmFyXHJcbiAgICpcclxuICAgKiBgJGAgLSB0aGUgdG9vbGJhciBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW2BcclxuICAgIDxoZWFkZXIgY2xhc3M9XCJoZWFkZXIgaXMtcGVyc29uYWxpemFibGUgaXMtc2Nyb2xsZWQtZG93blwiIGRhdGEtb3B0aW9ucz1cInthZGRTY3JvbGxDbGFzczogdHJ1ZX1cIj5cclxuICAgICAgPGRpdiBjbGFzcz1cInRvb2xiYXIgZG8tcmVzaXplIGhhcy1tb3JlLWJ1dHRvbiBoYXMtdGl0bGUtYnV0dG9uXCIgcm9sZT1cInRvb2xiYXJcIiBhcmlhLWxhYmVsPVwiTGF5b3V0c1wiIGRhdGEtb3B0aW9ucz1cInttYXhWaXNpYmxlQnV0dG9uczogMn1cIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwidGl0bGVcIj5cclxuICAgICAgICAgIDxidXR0b24gY2xhc3M9XCJidG4taWNvbiBhcHBsaWNhdGlvbi1tZW51LXRyaWdnZXIgaGlkZS1mb2N1c1wiIHR5cGU9XCJidXR0b25cIiB0YWJpbmRleD1cIjBcIj5cclxuICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cImF1ZGlibGVcIj5TaG93IG5hdmlnYXRpb248L3NwYW4+XHJcbiAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJpY29uIGFwcC1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwib25lXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgPHNwYW4gY2xhc3M9XCJ0d29cIj48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICA8c3BhbiBjbGFzcz1cInRocmVlXCI+PC9zcGFuPlxyXG4gICAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICAgICAgPGgxIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ0aXRsZU5vZGVcIj57JT0gJC50aXRsZVRleHQgJX08L2gxPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJidXR0b25zZXRcIiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwidG9vbE5vZGVcIj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwibW9yZVwiPlxyXG4gICAgICAgICAgPGJ1dHRvbiBjbGFzcz1cImJ0bi1hY3Rpb25zIHBhZ2UtY2hhbmdlclwiIHR5cGU9XCJidXR0b25cIiBkYXRhLW9wdGlvbnM9XCJ7YXR0YWNoVG9Cb2R5OiB0cnVlfVwiPlxyXG4gICAgICAgICAgICA8c3ZnIGNsYXNzPVwiaWNvblwiIGZvY3VzYWJsZT1cImZhbHNlXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPlxyXG4gICAgICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLW1vcmVcIj48L3VzZT5cclxuICAgICAgICAgICAgPC9zdmc+XHJcbiAgICAgICAgICAgIDxzcGFuIGNsYXNzPVwiYXVkaWJsZVwiIGRhdGEtdHJhbnNsYXRlPVwidGV4dFwiPk1vcmU8L3NwYW4+XHJcbiAgICAgICAgICA8L2J1dHRvbj5cclxuICAgICAgICAgIDx1bCBpZD1cImFwcC10b29sYmFyLW1vcmVcIiBjbGFzcz1cInBvcHVwbWVudSBpcy1zZWxlY3RhYmxlXCI+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cImhlYWRpbmdcIiByb2xlPVwicHJlc2VudGF0aW9uXCI+eyU9ICQudGhlbWVUZXh0ICV9PC9saT5cclxuICAgICAgICAgICAgPGRpdiBkYXRhLWRvam8tYXR0YWNoLXBvaW50PVwidGhlbWVOb2RlXCI+PC9kaXY+XHJcbiAgICAgICAgICAgIDxsaSBjbGFzcz1cInNlcGFyYXRvclwiIHJvbGU9XCJwcmVzZW50YXRpb25cIj48L2xpPlxyXG4gICAgICAgICAgICA8bGkgY2xhc3M9XCJoZWFkaW5nXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPnslPSAkLnBlcnNvbmFsaXphdGlvblRleHQgJX08L2xpPlxyXG4gICAgICAgICAgICA8ZGl2IGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJwZXJzb25hbGl6YXRpb25Ob2RlXCI+PC9kaXY+XHJcbiAgICAgICAgICA8L3VsPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5cclxuICAgIDwvaGVhZGVyPlxyXG4gIGBdKSxcclxuICB0aGVtZVRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxsaSBjbGFzcz1cImlzLXNlbGVjdGFibGUgeyUgaWYoJC5uYW1lID09PSAkLnNlbGVjdGVkKSB7ICV9IGlzLWNoZWNrZWQgeyUgfSAgJX0gXCI+JyxcclxuICAgICc8YSBocmVmPVwiI1wiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwibWVudWl0ZW1jaGVja2JveFwiIGRhdGEtdGhlbWU9XCJ7JT0gJC5kYXRhICV9XCI+eyU9ICQubmFtZSAlfTwvYT4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuICBwZXJzb25hbGl6YXRpb25UZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8bGkgY2xhc3M9XCJpcy1zZWxlY3RhYmxlIHslIGlmKCQubmFtZSA9PT0gJC5zZWxlY3RlZCkgeyAlfSBpcy1jaGVja2VkIHslIH0gICV9XCI+JyxcclxuICAgICc8YSBocmVmPVwiI1wiIHRhYmluZGV4PVwiLTFcIiByb2xlPVwibWVudWl0ZW1cIiBkYXRhLXJnYmNvbG9yPVwieyU9ICQuZGF0YSAlfVwiIGRhdGEtY29sb3JpZD1cInslPSAkLmNvbG9yaWQgJX1cIj57JT0gJC5uYW1lICV9PC9hPicsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG4gIHNlbGVjdGVkVGhlbWU6ICcnLFxyXG4gIHNlbGVjdGVkUGVyc29uYWxpemF0aW9uOiByZXNvdXJjZS5kZWZhdWx0VGV4dCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIFNpbXBsYXRlIHRoYXQgZGVmaW5lcyB0aGUgdG9vbGJhciBpdGVtIEhUTUwgTWFya3VwXHJcbiAgICpcclxuICAgKiBgJGAgLSBUaGUgdG9vbGJhciBpdGVtIG9iamVjdFxyXG4gICAqIGAkJGAgLSBUaGUgdG9vbGJhciBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHRvb2xUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtgXHJcbiAgICAgIDxidXR0b25cclxuICAgICAgICBjbGFzcz1cImJ0bi10ZXJ0aWFyeSBoaWRlLWZvY3VzIHslPSAkLmNscyAlfSB0b29sQnV0dG9uLXJpZ2h0XCJcclxuICAgICAgICB0eXBlPVwiYnV0dG9uXCJcclxuICAgICAgICB0aXRsZT1cInslOiAkLnRpdGxlICV9XCJcclxuICAgICAgICBkYXRhLWFjdGlvbj1cImludm9rZVRvb2xcIlxyXG4gICAgICAgIGRhdGEtdG9vbD1cInslPSAkLmlkICV9XCI+XHJcbiAgICAgICAgeyUgaWYgKCQuc3ZnKSB7ICV9XHJcbiAgICAgICAgPHN2ZyBhcmlhLWhpZGRlbj1cInRydWVcIiBmb2N1c2FibGU9XCJmYWxzZVwiIHJvbGU9XCJwcmVzZW50YXRpb25cIiBjbGFzcz1cImljb25cIj5cclxuICAgICAgICAgIDx1c2UgeGxpbms6aHJlZj1cIiNpY29uLXslPSAkLnN2ZyAlfVwiLz5cclxuICAgICAgICA8L3N2Zz5cclxuICAgICAgICB7JSB9ICV9XHJcbiAgICAgICAgPHNwYW4+eyU6ICQudGl0bGUgfHwgJC5pZCAlfTwvc3Bhbj5cclxuICAgICAgPC9idXR0b24+XHJcbiAgICBgLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfVxyXG4gICAqIEN1cnJlbnQgbnVtYmVyIG9mIHRvb2xiYXIgaXRlbXMgc2V0XHJcbiAgICovXHJcbiAgc2l6ZTogMCxcclxuXHJcbiAgLyoqXHJcbiAgICogVGV4dCB0aGF0IGlzIHBsYWNlZCBpbnRvIHRoZSB0b29sYmFyIHRpdGxlTm9kZVxyXG4gICAqL1xyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG4gIHBlcnNvbmFsaXphdGlvblRleHQ6IHJlc291cmNlLnBlcnNvbmFsaXphdGlvblRleHQsXHJcbiAgdGhlbWVUZXh0OiByZXNvdXJjZS50aGVtZVRleHQsXHJcblxyXG4gIC8qKlxyXG4gICAqIENhbGxzIHBhcmVudCB7QGxpbmsgVG9vbGJhciNjbGVhciBjbGVhcn0gYW5kIHJlbW92ZXMgYWxsIHRvb2xiYXIgaXRlbXMgZnJvbSBET00uXHJcbiAgICovXHJcbiAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoY2xlYXIsIGFyZ3VtZW50cyk7XHJcbiAgICAkKCdidXR0b24udG9vbEJ1dHRvbi1yaWdodCcsIHRoaXMudG9vbE5vZGUpLnJlbW92ZSgpO1xyXG4gIH0sXHJcbiAgcG9zdENyZWF0ZTogZnVuY3Rpb24gcG9zdENyZWF0ZSgpIHtcclxuICAgIHRoaXMuaW5pdFNvaG8oKTtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHBvc3RDcmVhdGUsIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBfY2hhbmdlUGVyc29uYWxpemF0aW9uOiBmdW5jdGlvbiBjaGFuZ2VDb2xvcihtb2RlLCB2YWx1ZSkge1xyXG4gICAgQXBwLnByZWZlcmVuY2VzW21vZGVdID0gdmFsdWUgJiYgdmFsdWUubm9kZVZhbHVlO1xyXG4gICAgQXBwLnBlcnNpc3RQcmVmZXJlbmNlcygpO1xyXG4gIH0sXHJcbiAgYnVpbGRQZXJzb25hbGl6YXRpb25zOiBmdW5jdGlvbiBidWlsZFBlcnNvbmFsaXphdGlvbnMoKSB7XHJcbiAgICBjb25zdCBzb2hvQ29sb3JzID0gU29oby50aGVtZS5wZXJzb25hbGl6YXRpb25Db2xvcnMoKTtcclxuXHJcbiAgICBpZiAoQXBwICYmIEFwcC5wcmVmZXJlbmNlcyAmJiBBcHAucHJlZmVyZW5jZXMuY29sb3JJZCkge1xyXG4gICAgICBjb25zdCBzYXZlZFBlcnNvbGl6YXRpb24gPSBzb2hvQ29sb3JzW0FwcC5wcmVmZXJlbmNlcy5jb2xvcklkXTtcclxuICAgICAgdGhpcy5zZWxlY3RlZFBlcnNvbmFsaXphdGlvbiA9IHNhdmVkUGVyc29saXphdGlvbiAmJiBzYXZlZFBlcnNvbGl6YXRpb24ubmFtZTtcclxuICAgIH1cclxuICAgIGlmIChBcHAgJiYgQXBwLnByZWZlcmVuY2VzICYmIEFwcC5wcmVmZXJlbmNlcy50aGVtZSkge1xyXG4gICAgICBjb25zdCBzYXZlZFRoZW1lID0gU29oby50aGVtZS50aGVtZXMoKS5maW5kKG9iaiA9PiBvYmouaWQgPT09IEFwcC5wcmVmZXJlbmNlcy50aGVtZSk7XHJcbiAgICAgIHRoaXMuc2VsZWN0ZWRUaGVtZSA9IHNhdmVkVGhlbWUgJiYgc2F2ZWRUaGVtZS5uYW1lO1xyXG4gICAgfVxyXG4gICAgT2JqZWN0LmtleXMoc29ob0NvbG9ycykuZm9yRWFjaCgoa2V5KSA9PiB7XHJcbiAgICAgIGNvbnN0IGNvbG9yID0gc29ob0NvbG9yc1trZXldO1xyXG4gICAgICBjb25zdCBwZXJzID0gJCh0aGlzLnBlcnNvbmFsaXphdGlvblRlbXBsYXRlLmFwcGx5KHtcclxuICAgICAgICBuYW1lOiBjb2xvci5uYW1lLFxyXG4gICAgICAgIGRhdGE6IGNvbG9yLnZhbHVlLFxyXG4gICAgICAgIGNvbG9yaWQ6IGNvbG9yLmlkLFxyXG4gICAgICAgIHNlbGVjdGVkOiB0aGlzLnNlbGVjdGVkUGVyc29uYWxpemF0aW9uLFxyXG4gICAgICB9LCB0aGlzKSk7XHJcblxyXG4gICAgICAkKHRoaXMucGVyc29uYWxpemF0aW9uTm9kZSkuYXBwZW5kKHBlcnMpO1xyXG4gICAgfSk7XHJcbiAgICAkKHRoaXMucGVyc29uYWxpemF0aW9uTm9kZSkuY2xpY2soKGUpID0+IHtcclxuICAgICAgdGhpcy5fY2hhbmdlUGVyc29uYWxpemF0aW9uKCdjb2xvcklkJywgZS50YXJnZXQuYXR0cmlidXRlc1snZGF0YS1jb2xvcmlkJ10pO1xyXG4gICAgICB0aGlzLl9jaGFuZ2VQZXJzb25hbGl6YXRpb24oJ2NvbG9yJywgZS50YXJnZXQuYXR0cmlidXRlc1snZGF0YS1yZ2Jjb2xvciddKTtcclxuICAgIH0pO1xyXG4gICAgU29oby50aGVtZS50aGVtZXMoKS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGNvbnN0IHRoZW1lID0gJCh0aGlzLnRoZW1lVGVtcGxhdGUuYXBwbHkoe1xyXG4gICAgICAgIG5hbWU6IGl0ZW0ubmFtZSxcclxuICAgICAgICBkYXRhOiBpdGVtLmlkLFxyXG4gICAgICAgIHNlbGVjdGVkOiB0aGlzLnNlbGVjdGVkVGhlbWUsXHJcbiAgICAgIH0sIHRoaXMpKTtcclxuICAgICAgJCh0aGlzLnRoZW1lTm9kZSkuYXBwZW5kKHRoZW1lKTtcclxuICAgIH0pO1xyXG4gICAgJCh0aGlzLnRoZW1lTm9kZSkuY2xpY2soKGUpID0+IHtcclxuICAgICAgdGhpcy5fY2hhbmdlUGVyc29uYWxpemF0aW9uKCd0aGVtZScsIGUudGFyZ2V0LmF0dHJpYnV0ZXNbJ2RhdGEtdGhlbWUnXSk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGluaXRTb2hvOiBmdW5jdGlvbiBpbml0U29obygpIHtcclxuICAgIHRoaXMuYnVpbGRQZXJzb25hbGl6YXRpb25zKCk7XHJcblxyXG4gICAgY29uc3QgaGVhZGVyID0gJCh0aGlzLmRvbU5vZGUpO1xyXG4gICAgaGVhZGVyLmhlYWRlcigpO1xyXG4gICAgdGhpcy50b29sYmFyID0gaGVhZGVyLmZpbmQoJy50b29sYmFyJykuZGF0YSgndG9vbGJhcicpO1xyXG5cclxuICAgICQoJy50aXRsZSA+IGgxJywgdGhpcy5kb21Ob2RlKS5vbignY2xpY2snLCB0aGlzLm9uVGl0bGVDbGljayk7XHJcblxyXG4gICAgLy8gaW5pdCBwZXJzb25hbGl6YXRpb25cclxuICAgICQoJ2h0bWwnKS5wZXJzb25hbGl6ZSh7XHJcbiAgICAgIGNvbG9yczogQXBwICYmIEFwcC5wcmVmZXJlbmNlcyAmJiBBcHAucHJlZmVyZW5jZXMuY29sb3IsXHJcbiAgICAgIHRoZW1lOiBBcHAgJiYgQXBwLnByZWZlcmVuY2VzICYmIEFwcC5wcmVmZXJlbmNlcy50aGVtZSxcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgdXBkYXRlU29obzogZnVuY3Rpb24gdXBkYXRlU29obygpIHtcclxuICAgIC8vIHVwZGF0aW5nIHNvaG8gaGVhZGVyIHJlc2V0cyB0aGUgaGVhZGVyIHRleHQgdG8gemVybyBsZXZlbC4gdXBkYXRlIG9ubHkgdG9vbGJiYXIgZm9yIG5vdy5cclxuICAgIC8vIElORk9SQ1JNLTE2MDAwOiBhZGRlZCBjaGVjayBmb3IgdG9vbGJhciAtIFVwZGF0ZVRvb2xiYXIuanMgdXNlcyBhcmdvcy9NYWluVG9vbGJhciBmb3IgY29udHJvbGxpbmcgdmlzaWJpbGl0eVxyXG4gICAgaWYgKHRoaXMudG9vbGJhcikge1xyXG4gICAgICB0aGlzLnRvb2xiYXIudXBkYXRlZCgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2FsbHMgcGFyZW50IHtAbGluayBUb29sYmFyI3Nob3dUb29scyBzaG93VG9vbHN9IHdoaWNoIHNldHMgdGhlIHRvb2wgY29sbGVjdGlvbi5cclxuICAgKiBUaGUgY29sbGVjdGlvbiBpcyB0aGVuIGxvb3BlZCBvdmVyIGFuZCBhZGRlZCB0byBET00sIGFkZGluZyB0aGUgbGVmdCBvciByaWdodCBzdHlsaW5nXHJcbiAgICogQHBhcmFtIHtPYmplY3RbXX0gdG9vbHMgQXJyYXkgb2YgdG9vbGJhciBpdGVtIGRlZmluaXRpb25zXHJcbiAgICovXHJcbiAgc2hvd1Rvb2xzOiBmdW5jdGlvbiBzaG93VG9vbHModG9vbHMpIHtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHNob3dUb29scywgYXJndW1lbnRzKTtcclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcyhgdG9vbGJhci1zaXplLSR7dGhpcy5zaXplfWApO1xyXG4gICAgbGV0IG9uTGluZSA9IHRoaXMuYXBwLm9uTGluZTtcclxuICAgIGlmICh0b29scykge1xyXG4gICAgICBjb25zdCBjb3VudCA9IHtcclxuICAgICAgICBsZWZ0OiAwLFxyXG4gICAgICAgIHJpZ2h0OiAwLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gcmVtb3ZlIGJ1dHRvbnMgZnJvbSBwcmV2IHZpZXdcclxuICAgICAgJCgnYnV0dG9uLnRvb2xCdXR0b24tcmlnaHQnLCB0aGlzLnRvb2xOb2RlKS5yZW1vdmUoKTtcclxuXHJcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9vbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICBjb25zdCB0b29sID0gdG9vbHNbaV07XHJcbiAgICAgICAgY29uc3Qgc2lkZSA9IHRvb2wuc2lkZSB8fCAncmlnaHQnO1xyXG4gICAgICAgIGNvbnN0IHRvb2xUZW1wbGF0ZSA9IHRvb2wudGVtcGxhdGUgfHwgdGhpcy50b29sVGVtcGxhdGU7XHJcbiAgICAgICAgY291bnRbc2lkZV0gKz0gMTtcclxuICAgICAgICBpZiAodG9vbC5vZmZsaW5lKSB7XHJcbiAgICAgICAgICBvbkxpbmUgPSBmYWxzZTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKHRvb2wuY2xzICE9PSAnZGlzcGxheS1ub25lJykge1xyXG4gICAgICAgICAgJCh0aGlzLnRvb2xOb2RlKS5wcmVwZW5kKHRvb2xUZW1wbGF0ZS5hcHBseSh0b29sLCB0aGlzLnRvb2xzW3Rvb2wuaWRdKSk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcblxyXG4gICAgICB0aGlzLnVwZGF0ZVNvaG8oKTtcclxuXHJcbiAgICAgIHRoaXMuc2l6ZSA9IE1hdGgubWF4KGNvdW50LmxlZnQsIGNvdW50LnJpZ2h0KTtcclxuICAgICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKGB0b29sYmFyLXNpemUtJHt0aGlzLnNpemV9YCk7XHJcbiAgICAgIHRoaXMuc2V0TW9kZShvbkxpbmUpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXZlbnQgaGFuZGxlciB0aGF0IGZpcmVzIHdoZW4gdGhlIHRvb2xiYXIgdGl0bGUgaXMgY2xpY2tlZC5cclxuICAgKi9cclxuICBvblRpdGxlQ2xpY2s6IGZ1bmN0aW9uIG9uVGl0bGVDbGljaygvKiBldnQqLykge30sXHJcbiAgc2V0TW9kZTogZnVuY3Rpb24gc2V0TW9kZShvbkxpbmUpIHtcclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygnb2ZmbGluZScpO1xyXG4gICAgaWYgKCFvbkxpbmUpIHtcclxuICAgICAgJCh0aGlzLmRvbU5vZGUpLmFkZENsYXNzKCdvZmZsaW5lJyk7XHJcbiAgICB9XHJcbiAgfSxcclxuXHJcbiAgZGlzYWJsZVRvb2w6IGZ1bmN0aW9uIGRpc2FibGVUb29sKGlkKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChkaXNhYmxlVG9vbCwgYXJndW1lbnRzKTtcclxuICAgIGNvbnN0IHJlc3VsdCA9IHRoaXMuX2dldFRvb2xET01Ob2RlKGlkKTtcclxuICAgIGlmIChyZXN1bHQpIHtcclxuICAgICAgJChyZXN1bHQpLmFkZENsYXNzKCd0b29sQnV0dG9uLWRpc2FibGVkJyk7XHJcbiAgICAgIHJlc3VsdC5kaXNhYmxlZCA9IHRydWU7XHJcbiAgICB9XHJcbiAgfSxcclxuICBlbmFibGVUb29sOiBmdW5jdGlvbiBlbmFibGVUb29sKGlkKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChlbmFibGVUb29sLCBhcmd1bWVudHMpO1xyXG4gICAgY29uc3QgcmVzdWx0ID0gdGhpcy5fZ2V0VG9vbERPTU5vZGUoaWQpO1xyXG4gICAgaWYgKHJlc3VsdCkge1xyXG4gICAgICAkKHJlc3VsdCkucmVtb3ZlQ2xhc3MoJ3Rvb2xCdXR0b24tZGlzYWJsZWQnKTtcclxuICAgICAgcmVzdWx0LmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9XHJcbiAgfSxcclxuICBfZ2V0VG9vbERPTU5vZGU6IGZ1bmN0aW9uIF9nZXRUb29sRE9NTm9kZShpZCkge1xyXG4gICAgY29uc3QgcmVzdWx0ID0gJChgYnV0dG9uW2RhdGEtdG9vbD0ke2lkfV1gLCB0aGlzLmRvbU5vZGUpLmZpcnN0KCk7XHJcbiAgICByZXR1cm4gcmVzdWx0O1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19