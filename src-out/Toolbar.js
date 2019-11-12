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
   * @class argos.Toolbar
   * @classdesc Toolbar is a base toolbar class that provides basic rendering of the bar, adding toolbar items and binding their invokacations.
   * @mixins argos._ActionMixin
   * @mixins argos._Templated
   */
  var __class = (0, _declare2.default)('argos.Toolbar', [_WidgetBase3.default, _ActionMixin3.default, _Templated3.default], /** @lends argos.Toolbar# */{
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

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ub29sYmFyLmpzIl0sIm5hbWVzIjpbIl9fY2xhc3MiLCJ3aWRnZXRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwiZW5hYmxlZCIsIm1hbmFnZWQiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJhcHAiLCJ3aW5kb3ciLCJBcHAiLCJleHBhbmRFeHByZXNzaW9uIiwiZXhwcmVzc2lvbiIsImFwcGx5IiwiQXJyYXkiLCJwcm90b3R5cGUiLCJzbGljZSIsImNhbGwiLCJhcmd1bWVudHMiLCJpbml0IiwiaW52b2tlVG9vbCIsInBhcmFtZXRlcnMiLCJldnQiLCJub2RlIiwiaWQiLCJ0b29sIiwidG9vbHMiLCJzb3VyY2UiLCJmbiIsInNjb3BlIiwiYWN0aW9uIiwidmlldyIsImdldFByaW1hcnlBY3RpdmVWaWV3IiwiaGFzQWN0aW9uIiwiaW52b2tlQWN0aW9uIiwibWl4aW4iLCIkdG9vbCIsInNob3ciLCIkIiwiZG9tTm9kZSIsImNzcyIsImhpZGUiLCJjbGVhciIsInJlbW92ZUNsYXNzIiwiZW5hYmxlIiwiZGlzYWJsZSIsImVuYWJsZVRvb2wiLCJkaXNhYmxlVG9vbCIsImluZGljYXRlVG9vbEJ1c3kiLCJidXN5IiwiY2xlYXJUb29sQnVzeSIsImlzVG9vbEVuYWJsZWQiLCJzaG93VG9vbHMiLCJpIiwibGVuZ3RoIiwic2VjdXJpdHkiLCJoYXNBY2Nlc3NUbyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBOzs7Ozs7QUFNQSxNQUFNQSxVQUFVLHVCQUFRLGVBQVIsRUFBeUIsa0VBQXpCLEVBQWtFLDRCQUE0QjtBQUM1Rzs7OztBQUlBQyxvQkFBZ0IsSUFBSUMsUUFBSixDQUFhLENBQzNCLHVCQUQyQixFQUUzQixRQUYyQixDQUFiLENBTDRGO0FBUzVHOzs7O0FBSUFDLGFBQVMsSUFibUc7QUFjNUdDLGFBQVMsSUFkbUc7QUFlNUdDLGlCQUFhLFNBQVNBLFdBQVQsR0FBbUM7QUFBQSxVQUFkQyxPQUFjLHVFQUFKLEVBQUk7O0FB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bEMsRUFBdUM7QUFDckMsWUFBTTVCLE9BQU87QUFDWHdCLGdCQUFNLEtBREs7QUFFWDdDLG1CQUFTLE9BQU9zQixNQUFNMkIsQ0FBTixFQUFTakQsT0FBaEIsS0FBNEIsV0FBNUIsR0FBMENzQixNQUFNMkIsQ0FBTixFQUFTakQsT0FBbkQsR0FBNkQsSUFGM0Q7QUFHWHVCLGtCQUFRRCxNQUFNMkIsQ0FBTjtBQUhHLFNBQWI7O0FBTUE7QUFDQSxZQUFJNUIsS0FBS3JCLE9BQUwsSUFBZ0JzQixNQUFNMkIsQ0FBTixFQUFTRSxRQUE3QixFQUF1QztBQUNyQzlCLGVBQUtyQixPQUFMLEdBQWUsS0FBS0ksR0FBTCxDQUFTZ0QsV0FBVCxDQUFxQixLQUFLN0MsZ0JBQUwsQ0FBc0JlLE1BQU0yQixDQUFOLEVBQVNFLFFBQS9CLENBQXJCLENBQWY7QUFDRDs7QUFFRCxhQUFLN0IsS0FBTCxDQUFXQSxNQUFNMkIsQ0FBTixFQUFTN0IsRUFBcEIsSUFBMEJDLElBQTFCO0FBQ0Q7QUFDRjtBQW5LMkcsR0FBOUYsQ0FBaEIsQyxDQTNCQTs7Ozs7Ozs7Ozs7Ozs7O29CQWlNZXhCLE8iLCJmaWxlIjoiVG9vbGJhci5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgKGMpIDIwMTAsIFNhZ2UgU29mdHdhcmUsIEluYy4gQWxsIHJpZ2h0cyByZXNlcnZlZC5cclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IGxhbmcgZnJvbSAnZG9qby9fYmFzZS9sYW5nJztcclxuaW1wb3J0IF9XaWRnZXRCYXNlIGZyb20gJ2Rpaml0L19XaWRnZXRCYXNlJztcclxuaW1wb3J0IF9BY3Rpb25NaXhpbiBmcm9tICcuL19BY3Rpb25NaXhpbic7XHJcbmltcG9ydCBfVGVtcGxhdGVkIGZyb20gJy4vX1RlbXBsYXRlZCc7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLlRvb2xiYXJcclxuICogQGNsYXNzZGVzYyBUb29sYmFyIGlzIGEgYmFzZSB0b29sYmFyIGNsYXNzIHRoYXQgcHJvdmlkZXMgYmFzaWMgcmVuZGVyaW5nIG9mIHRoZSBiYXIsIGFkZGluZyB0b29sYmFyIGl0ZW1zIGFuZCBiaW5kaW5nIHRoZWlyIGludm9rYWNhdGlvbnMuXHJcbiAqIEBtaXhpbnMgYXJnb3MuX0FjdGlvbk1peGluXHJcbiAqIEBtaXhpbnMgYXJnb3MuX1RlbXBsYXRlZFxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLlRvb2xiYXInLCBbX1dpZGdldEJhc2UsIF9BY3Rpb25NaXhpbiwgX1RlbXBsYXRlZF0sIC8qKiBAbGVuZHMgYXJnb3MuVG9vbGJhciMgKi97XHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtTaW1wbGF0ZX1cclxuICAgKiBIVE1MIG1hcmt1cCBvZiB0aGUgdG9vbGJhclxyXG4gICAqL1xyXG4gIHdpZGdldFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzxkaXYgY2xhc3M9XCJ0b29sYmFyXCI+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn1cclxuICAgKiBTdGF0ZSBvZiB0b29sYmFyXHJcbiAgICovXHJcbiAgZW5hYmxlZDogdHJ1ZSxcclxuICBtYW5hZ2VkOiB0cnVlLFxyXG4gIGNvbnN0cnVjdG9yOiBmdW5jdGlvbiBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuICAgIHRoaXMuYXBwID0gb3B0aW9ucy5hcHAgfHwgd2luZG93LkFwcDtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4cGFuZHMgdGhlIHBhc3NlZCBleHByZXNzaW9uIGlmIGl0IGlzIGEgZnVuY3Rpb24uXHJcbiAgICogQHBhcmFtIHtTdHJpbmcvRnVuY3Rpb259IGV4cHJlc3Npb24gUmV0dXJucyBzdHJpbmcgZGlyZWN0bHksIGlmIGZ1bmN0aW9uIGl0IGlzIGNhbGxlZCBhbmQgdGhlIHJlc3VsdCByZXR1cm5lZC5cclxuICAgKiBAcmV0dXJuIHtTdHJpbmd9IFN0cmluZyBleHByZXNzaW9uLlxyXG4gICAqL1xyXG4gIGV4cGFuZEV4cHJlc3Npb246IGZ1bmN0aW9uIGV4cGFuZEV4cHJlc3Npb24oZXhwcmVzc2lvbikge1xyXG4gICAgaWYgKHR5cGVvZiBleHByZXNzaW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHJldHVybiBleHByZXNzaW9uLmFwcGx5KHRoaXMsIEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGV4cHJlc3Npb247XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBDYWxsZWQgdXBvbiBhcHBsaWNhdGlvbiBzdGFydHVwLlxyXG4gICAqL1xyXG4gIGluaXQ6IGZ1bmN0aW9uIGluaXQoKSB7fSxcclxuICAvKipcclxuICAgKiBXaGVuIGEgdG9vbCBpcyBjbGlja2VkIG9uIHRoaXMgZnVuY3Rpb24gaGFuZGxlcyBtYXRjaGluZyB0aGUgbm9kZSB0byB0b29sYmFyIGl0ZW0gaW5zdGFuY2UgYW5kIHBlcmZvcm1zIHRoZSBhY3R1YWwgYWN0aW9uXHJcbiAgICogQHBhcmFtIHtPYmplY3R9IHBhcmFtZXRlcnMgQW4gb2JqZWN0IG9mIGFsbCB0aGUgYGRhdGEtYCBhdHRyaWJ1dGVzIG9mIHRoZSBub2RlLlxyXG4gICAqIEBwYXJhbSB7RXZlbnR9IGV2dCBUaGUgZXZlbnQgb2JqZWN0XHJcbiAgICogQHBhcmFtIHtIVE1MRWxlbWVudH0gbm9kZSBUaGUgaHRtbCBlbGVtZW50IHRoYXQgd2FzIGNsaWNrZWQuXHJcbiAgICovXHJcbiAgaW52b2tlVG9vbDogZnVuY3Rpb24gaW52b2tlVG9vbChwYXJhbWV0ZXJzLCBldnQsIG5vZGUpIHtcclxuICAgIGNvbnN0IGlkID0gcGFyYW1ldGVycyAmJiBwYXJhbWV0ZXJzLnRvb2w7XHJcbiAgICBjb25zdCB0b29sID0gdGhpcy50b29scyAmJiB0aGlzLnRvb2xzW2lkXTtcclxuICAgIGNvbnN0IHNvdXJjZSA9IHRvb2wgJiYgdG9vbC5zb3VyY2U7XHJcbiAgICBpZiAoc291cmNlICYmIHRvb2wuZW5hYmxlZCkge1xyXG4gICAgICBpZiAoc291cmNlLmZuKSB7XHJcbiAgICAgICAgc291cmNlLmZuLmNhbGwoc291cmNlLnNjb3BlIHx8IHRoaXMsIHNvdXJjZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAoc291cmNlLmFjdGlvbikge1xyXG4gICAgICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC5nZXRQcmltYXJ5QWN0aXZlVmlldygpO1xyXG4gICAgICAgIGlmICh2aWV3ICYmIHZpZXcuaGFzQWN0aW9uKHNvdXJjZS5hY3Rpb24pKSB7XHJcbiAgICAgICAgICB2aWV3Lmludm9rZUFjdGlvbihzb3VyY2UuYWN0aW9uLCBsYW5nLm1peGluKHBhcmFtZXRlcnMsIHtcclxuICAgICAgICAgICAgJHRvb2w6IHNvdXJjZSxcclxuICAgICAgICAgIH0pLCBldnQsIG5vZGUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgdG9vbGJhciBzdHlsZSB0byBibG9jayAodmlzaWJpbGUpXHJcbiAgICovXHJcbiAgc2hvdzogZnVuY3Rpb24gc2hvdygpIHtcclxuICAgICQodGhpcy5kb21Ob2RlKS5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIHRvb2xiYXIgc3R5bGUgdG8gbm9uZSAoaGlkZGVuKVxyXG4gICAqL1xyXG4gIGhpZGU6IGZ1bmN0aW9uIGhpZGUoKSB7XHJcbiAgICAkKHRoaXMuZG9tTm9kZSkuY3NzKCdkaXNwbGF5JywgJ25vbmUnKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEVtcHRpZXMgdGhlIHRvb2xiYXIgaXRlbSBjb2xsZWN0aW9uIGFuZCBzZXRzIGVuYWJsZWQgdG8gdHJ1ZVxyXG4gICAqL1xyXG4gIGNsZWFyOiBmdW5jdGlvbiBjbGVhcigpIHtcclxuICAgIHRoaXMudG9vbHMgPSB7fTtcclxuICAgICQodGhpcy5kb21Ob2RlKS5yZW1vdmVDbGFzcygndG9vbGJhci1kaXNhYmxlZCcpO1xyXG4gICAgdGhpcy5lbmFibGVkID0gdHJ1ZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZXMgdGhlIGRpc2FibGVkIHN0eWxlIGFuZCBzZXRzIGVuYWJsZWQgdG8gdHJ1ZVxyXG4gICAqL1xyXG4gIGVuYWJsZTogZnVuY3Rpb24gZW5hYmxlKCkge1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCd0b29sYmFyLWRpc2FibGVkJyk7XHJcbiAgICB0aGlzLmVuYWJsZWQgPSB0cnVlO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQWRkcyBhIGRpc2FibGVkIHN0eWxlIGNsYXNzIGFuZCBzZXRzIGVuYWJsZWQgdG8gZmFsc2VcclxuICAgKi9cclxuICBkaXNhYmxlOiBmdW5jdGlvbiBkaXNhYmxlKCkge1xyXG4gICAgJCh0aGlzLmRvbU5vZGUpLnJlbW92ZUNsYXNzKCd0b29sYmFyLWRpc2FibGVkJyk7XHJcbiAgICB0aGlzLmVuYWJsZWQgPSBmYWxzZTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgZW5hYmxlZCB0byB0cnVlIG9mIHRoZSB0b29sYmFyIGl0ZW0gdGhhdCBtYXRjaGVzIHRoZSBwYXNzZWQgaWRcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgVGhlIGlkIG9mIHRoZSB0b29sIHRvIGVuYWJsZVxyXG4gICAqL1xyXG4gIGVuYWJsZVRvb2w6IGZ1bmN0aW9uIGVuYWJsZVRvb2woaWQpIHtcclxuICAgIGNvbnN0IHRvb2wgPSB0aGlzLnRvb2xzICYmIHRoaXMudG9vbHNbaWRdO1xyXG4gICAgaWYgKHRvb2wpIHtcclxuICAgICAgdG9vbC5lbmFibGVkID0gdHJ1ZTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgZW5hYmxlZCB0byBmYWxzZSBvZiB0aGUgdG9vbGJhciBpdGVtIHRoYXQgbWF0Y2hlcyB0aGUgcGFzc2VkIGlkXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIFRoZSBpZCBvZiB0aGUgdG9vbCB0byBkaXNhYmxlXHJcbiAgICovXHJcbiAgZGlzYWJsZVRvb2w6IGZ1bmN0aW9uIGRpc2FibGVUb29sKGlkKSB7XHJcbiAgICBjb25zdCB0b29sID0gdGhpcy50b29scyAmJiB0aGlzLnRvb2xzW2lkXTtcclxuICAgIGlmICh0b29sKSB7XHJcbiAgICAgIHRvb2wuZW5hYmxlZCA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogU2V0cyBidXN5IHRvIHRydWUgb2YgdGhlIHRvb2xiYXIgaXRlbSB0aGF0IG1hdGNoZXMgdGhlIHBhc3NlZCBpZFxyXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBpZCBUaGUgaWQgb2YgdGhlIHRvb2wgdG8gaW5kaWNhdGUgYnVzeVxyXG4gICAqL1xyXG4gIGluZGljYXRlVG9vbEJ1c3k6IGZ1bmN0aW9uIGluZGljYXRlVG9vbEJ1c3koaWQpIHtcclxuICAgIGNvbnN0IHRvb2wgPSB0aGlzLnRvb2xzICYmIHRoaXMudG9vbHNbaWRdO1xyXG4gICAgaWYgKHRvb2wpIHtcclxuICAgICAgdG9vbC5idXN5ID0gdHJ1ZTtcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFNldHMgYnVzeSB0byBmYWxzZSBvZiB0aGUgdG9vbGJhciBpdGVtIHRoYXQgbWF0Y2hlcyB0aGUgcGFzc2VkIGlkXHJcbiAgICogQHBhcmFtIHtTdHJpbmd9IGlkIFRoZSBpZCBvZiB0aGUgdG9vbCB0byBzZXQgYXMgbm90IGJ1c3lcclxuICAgKi9cclxuICBjbGVhclRvb2xCdXN5OiBmdW5jdGlvbiBjbGVhclRvb2xCdXN5KGlkKSB7XHJcbiAgICBjb25zdCB0b29sID0gdGhpcy50b29scyAmJiB0aGlzLnRvb2xzW2lkXTtcclxuICAgIGlmICh0b29sKSB7XHJcbiAgICAgIHRvb2wuYnVzeSA9IGZhbHNlO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogQ2hlY2tzIHRoZSBlbmFibGVkIHByb3BlcnR5IG9mIHRoZSB0b29sYmFyIGl0ZW0gdGhhdCBtYXRjaGVzIHRoZSBwYXNzZWQgaWRcclxuICAgKiBAcGFyYW0ge1N0cmluZ30gaWQgVGhlIGlkIG9mIHRoZSB0b29sXHJcbiAgICogQHJldHVybiB7Qm9vbGVhbn0gVHJ1ZSBpZiB0aGUgdG9vbGJhciBpdGVtIGlzIGVuYWJsZWRcclxuICAgKi9cclxuICBpc1Rvb2xFbmFibGVkOiBmdW5jdGlvbiBpc1Rvb2xFbmFibGVkKGlkKSB7XHJcbiAgICByZXR1cm4gdGhpcy50b29scyAmJiB0aGlzLnRvb2xzW2lkXSAmJiB0aGlzLnRvb2xzW2lkXS5lbmFibGVkO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogUmVwbGFjZXMgdGhlIGV4aXN0aW5nIHRvb2xiYXIgaXRlbSBjb2xsZWN0aW9uIHdpdGggdGhlIHBhc3NlZCBhcnJheSBvZiB0b29sYmFyIGl0ZW1zIGFuZCBhbHNvIGNoZWNrcyB0b29sYmFyIHNlY3VyaXR5XHJcbiAgICogQHBhcmFtIHtPYmplY3RbXX0gdG9vbHMgVG9vbGJhciBpdGVtIGFycmF5IHRvIHN0b3JlLlxyXG4gICAqL1xyXG4gIHNob3dUb29sczogZnVuY3Rpb24gc2hvd1Rvb2xzKHRvb2xzKSB7XHJcbiAgICB0aGlzLnRvb2xzID0ge307XHJcblxyXG4gICAgaWYgKHR5cGVvZiB0b29scyA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9vbHMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgY29uc3QgdG9vbCA9IHtcclxuICAgICAgICBidXN5OiBmYWxzZSxcclxuICAgICAgICBlbmFibGVkOiB0eXBlb2YgdG9vbHNbaV0uZW5hYmxlZCAhPT0gJ3VuZGVmaW5lZCcgPyB0b29sc1tpXS5lbmFibGVkIDogdHJ1ZSxcclxuICAgICAgICBzb3VyY2U6IHRvb2xzW2ldLFxyXG4gICAgICB9O1xyXG5cclxuICAgICAgLy8gaWYgdG9vbCBpcyBlbmFibGVkLCBjaGVjayBzZWN1cml0eVxyXG4gICAgICBpZiAodG9vbC5lbmFibGVkICYmIHRvb2xzW2ldLnNlY3VyaXR5KSB7XHJcbiAgICAgICAgdG9vbC5lbmFibGVkID0gdGhpcy5hcHAuaGFzQWNjZXNzVG8odGhpcy5leHBhbmRFeHByZXNzaW9uKHRvb2xzW2ldLnNlY3VyaXR5KSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHRoaXMudG9vbHNbdG9vbHNbaV0uaWRdID0gdG9vbDtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==