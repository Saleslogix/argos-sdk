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
import domStyle from 'dojo/dom-style';
import domClass from 'dojo/dom-class';
import _Widget from 'dijit/_Widget';
import _ActionMixin from './_ActionMixin';
import _Templated from './_Templated';

/**
 * @class argos.Toolbar
 * Toolbar is a base toolbar class that provides basic rendering of the bar, adding toolbar items and binding their invokacations.
 *
 * Inherits dijit _Widget.
 *
 * @alternateClassName Toolbar
 * @mixins argos._ActionMixin
 * @mixins argos._Templated
 */
const __class = declare('argos.Toolbar', [_Widget, _ActionMixin, _Templated], {
  /**
   * @property {Simplate}
   * HTML markup of the toolbar
   */
  widgetTemplate: new Simplate([
    '<div class="toolbar">',
    '</div>',
  ]),
  /**
   * @property {Boolean}
   * State of toolbar
   */
  enabled: true,
  managed: true,
  constructor: function constructor(options = {}) {
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
    const id = parameters && parameters.tool;
    const tool = this.tools && this.tools[id];
    const source = tool && tool.source;
    if (source && tool.enabled) {
      if (source.fn) {
        source.fn.call(source.scope || this, source);
      } else if (source.action) {
        const view = this.app.getPrimaryActiveView();
        if (view && view.hasAction(source.action)) {
          view.invokeAction(source.action, lang.mixin(parameters, {
            '$tool': source,
          }), evt, node);
        }
      }
    }
  },
  /**
   * Sets the toolbar style to block (visibile)
   */
  show: function show() {
    domStyle.set(this.domNode, 'display', 'block');
  },
  /**
   * Sets the toolbar style to none (hidden)
   */
  hide: function hide() {
    domStyle.set(this.domNode, 'display', 'none');
  },
  /**
   * Empties the toolbar item collection and sets enabled to true
   */
  clear: function clear() {
    this.tools = {};
    domClass.remove(this.domNode, 'toolbar-disabled');
    this.enabled = true;
  },
  /**
   * Removes the disabled style and sets enabled to true
   */
  enable: function enable() {
    domClass.remove(this.domNode, 'toolbar-disabled');
    this.enabled = true;
  },
  /**
   * Adds a disabled style class and sets enabled to false
   */
  disable: function disable() {
    domClass.add(this.domNode, 'toolbar-disabled');
    this.enabled = false;
  },
  /**
   * Sets enabled to true of the toolbar item that matches the passed id
   * @param {String} id The id of the tool to enable
   */
  enableTool: function enableTool(id) {
    const tool = this.tools && this.tools[id];
    if (tool) {
      tool.enabled = true;
    }
  },
  /**
   * Sets enabled to false of the toolbar item that matches the passed id
   * @param {String} id The id of the tool to disable
   */
  disableTool: function disableTool(id) {
    const tool = this.tools && this.tools[id];
    if (tool) {
      tool.enabled = false;
    }
  },
  /**
   * Sets busy to true of the toolbar item that matches the passed id
   * @param {String} id The id of the tool to indicate busy
   */
  indicateToolBusy: function indicateToolBusy(id) {
    const tool = this.tools && this.tools[id];
    if (tool) {
      tool.busy = true;
    }
  },
  /**
   * Sets busy to false of the toolbar item that matches the passed id
   * @param {String} id The id of the tool to set as not busy
   */
  clearToolBusy: function clearToolBusy(id) {
    const tool = this.tools && this.tools[id];
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

    for (let i = 0; i < tools.length; i++) {
      const tool = {
        busy: false,
        enabled: typeof tools[i].enabled !== 'undefined' ? tools[i].enabled : true,
        source: tools[i],
      };

      // if tool is enabled, check security
      if (tool.enabled && tools[i].security) {
        tool.enabled = this.app.hasAccessTo(this.expandExpression(tools[i].security));
      }

      this.tools[tools[i].id] = tool;
    }
  },
});

lang.setObject('Sage.Platform.Mobile.Toolbar', __class);
export default __class;
