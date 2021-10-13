define('argos/Toolbar', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dijit/_WidgetBase', './_ActionMixin', './_Templated'], function (module, exports, _declare, _lang, _WidgetBase2, _ActionMixin2, _Templated2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _ActionMixin3 = _interopRequireDefault(_ActionMixin2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @alias module:argos/Toolbar
   * @classdesc Toolbar is a base toolbar class that provides basic rendering of the bar, adding toolbar items and binding their invokacations.
   * @mixes module:argos/_ActionMixin
   * @extends module:argos/_Templated
   */
  var __class = (0, _declare2.default)('argos.Toolbar', [_WidgetBase3.default, _Templated3.default], /** @lends module:argos/Toolbar.prototype */{
    _ActionMixin: null,
    /**
     * @property {Simplate}
     * HTML markup of the toolbar
     */
    widgetTemplate: new Simplate(['<div class="toolbar">', '</div>']),
    /**
     * @property {Boolean}
     * State of toolbar
     */
    enabled: true,
    managed: true,
    constructor: function constructor() {
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.app = options.app || window.App;
    },
    postCreate: function postCreate() {
      this._ActionMixin = new _ActionMixin3.default();
      this._ActionMixin.postCreate(this);
    },
    /**
     * Expands the passed expression if it is a function.
     * @param {String/Function} expression Returns string directly, if function it is called and the result returned.
     * @return {String} String expression.
     */
    expandExpression: function expandExpression(expression) {
      if (typeof expression === 'function') {
        return expression.apply(this, Array.prototype.slice.call(arguments, 1));
      }
      return expression;
    },
    /**
     * Called upon application startup.
     */
    init: function init() {},
    /**
     * When a tool is clicked on this function handles matching the node to toolbar item instance and performs the actual action
     * @param {Object} parameters An object of all the `data-` attributes of the node.
     * @param {Event} evt The event object
     * @param {HTMLElement} node The html element that was clicked.
     */
    invokeTool: function invokeTool(parameters, evt, node) {
      var id = parameters && parameters.tool;
      var tool = this.tools && this.tools[id];
      var source = tool && tool.source;
      if (source && tool.enabled) {
        if (source.fn) {
          source.fn.call(source.scope || this, source);
        } else if (source.action) {
          var view = this.app.getPrimaryActiveView();
          if (view && view.hasAction(source.action)) {
            view.invokeAction(source.action, _lang2.default.mixin(parameters, {
              $tool: source
            }), evt, node);
          }
        }
      }
    },
    /**
     * Sets the toolbar style to block (visibile)
     */
    show: function show() {
      $(this.domNode).css('display', 'block');
    },
    /**
     * Sets the toolbar style to none (hidden)
     */
    hide: function hide() {
      $(this.domNode).css('display', 'none');
    },
    /**
     * Empties the toolbar item collection and sets enabled to true
     */
    clear: function clear() {
      this.tools = {};
      $(this.domNode).removeClass('toolbar-disabled');
      this.enabled = true;
    },
    /**
     * Removes the disabled style and sets enabled to true
     */
    enable: function enable() {
      $(this.domNode).removeClass('toolbar-disabled');
      this.enabled = true;
    },
    /**
     * Adds a disabled style class and sets enabled to false
     */
    disable: function disable() {
      $(this.domNode).removeClass('toolbar-disabled');
      this.enabled = false;
    },
    /**
     * Sets enabled to true of the toolbar item that matches the passed id
     * @param {String} id The id of the tool to enable
     */
    enableTool: function enableTool(id) {
      var tool = this.tools && this.tools[id];
      if (tool) {
        tool.enabled = true;
      }
    },
    /**
     * Sets enabled to false of the toolbar item that matches the passed id
     * @param {String} id The id of the tool to disable
     */
    disableTool: function disableTool(id) {
      var tool = this.tools && this.tools[id];
      if (tool) {
        tool.enabled = false;
      }
    },
    /**
     * Sets busy to true of the toolbar item that matches the passed id
     * @param {String} id The id of the tool to indicate busy
     */
    indicateToolBusy: function indicateToolBusy(id) {
      var tool = this.tools && this.tools[id];
      if (tool) {
        tool.busy = true;
      }
    },
    /**
     * Sets busy to false of the toolbar item that matches the passed id
     * @param {String} id The id of the tool to set as not busy
     */
    clearToolBusy: function clearToolBusy(id) {
      var tool = this.tools && this.tools[id];
      if (tool) {
        tool.busy = false;
      }
    },
    /**
     * Checks the enabled property of the toolbar item that matches the passed id
     * @param {String} id The id of the tool
     * @return {Boolean} True if the toolbar item is enabled
     */
    isToolEnabled: function isToolEnabled(id) {
      return this.tools && this.tools[id] && this.tools[id].enabled;
    },
    /**
     * Replaces the existing toolbar item collection with the passed array of toolbar items and also checks toolbar security
     * @param {Object[]} tools Toolbar item array to store.
     */
    showTools: function showTools(tools) {
      this.tools = {};

      if (typeof tools === 'undefined') {
        return;
      }

      for (var i = 0; i < tools.length; i++) {
        var tool = {
          busy: false,
          enabled: typeof tools[i].enabled !== 'undefined' ? tools[i].enabled : true,
          source: tools[i]
        };

        // if tool is enabled, check security
        if (tool.enabled && tools[i].security) {
          tool.enabled = this.app.hasAccessTo(this.expandExpression(tools[i].security));
        }

        this.tools[tools[i].id] = tool;
      }
    }
  }); /* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
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
   * @module argos/Toolbar
   */
  exports.default = __class;
  module.exports = exports['default'];
});