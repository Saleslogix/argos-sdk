/* Copyright 2017 Infor
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @module argos/TabWidget
 */
import declare from 'dojo/_base/declare';
import _Templated from './_Templated';

/**
 * @class
 * @alias module:argos/TabWidget
 * @extends module:argos/_Templated
 */
const __class = declare('argos.TabWidget', [_Templated], /** @lends module:argos/TabWidget.prototype */{
  /**
   * @property {Simplate}
   * HTML that defines a new tab list
   */
  tabContentTemplate: new Simplate([
    '{%! $.tabContainerTemplate %}',
  ]),
  /**
   * @property {Simplate}
   * HTML that defines a new tab list
   */
  tabContainerTemplate: new Simplate([
    '<div class="tab-container horizontal" data-dojo-attach-point="tabContainer"><div>',
  ]),
  tabListTemplate: new Simplate([
    '<ul class="tab-list"></ul>',
  ]),
  /**
   * @property {Simplate}
   * HTML that defines a new tab to be placed in the tab list
   *
   */
  tabListItemTemplate: new Simplate([
    '<li class="tab" role="presentation">',
    '<a href="#{%: $$.id %}_{%: $.name %}">{%: ($.title || $.options.title) %}</a>',
    '</li>',
  ]),
  /**
   * @property {li}
   * Current tab (html element li) that the view is on
   */
  currentTab: null,
  /**
   * @property {int}
   * int value representing the index at which the default tab is located
   */
  defaultTabIndex: null,
  /**
   * @property {Array}
   * Mapping of tab to the section
   */
  tabMapping: null,
  /**
   * @property {Array}
   * Array holding the tab dom elements
   */
  tabs: null,

  _sohoTabs: null,
  /**
   * Sets the parentNode for the tabList
   */
  placeTabList: function placeTabList(parentNode = {}) {
    if (!this.tabContainer.parentNode && this.isTabbed) {
      this.tabMapping = [];
      this.tabs = [];
      $(parentNode).html(this.tabContainer);
    }
    return this;
  },
  /**
   * Function used to create the tabs, should be called by the parent upon completion of populating the tabs array of dom objects
   * @param {Array} An array of the tab objects.
  */
  createTabs: function createTabs(tabs = []) {
    this.tabList = $(this.tabListTemplate.apply(this));
    $(tabs).each((i, tab) => {
      $(this.tabList).append(tab);
    });

    $(this.tabContainer).prepend($(this.tabList));
    const tempTabs = $(this.tabContainer).tabs();
    this._sohoTabs = tempTabs.data('tabs');
    return this;
  },
  /**
   * Function used to clear the tabs, should be called by the parent on it's clear call
  */
  clearTabs: function clearTabs() {
    if (this.tabList && this.tabs) {
      try {
        this._sohoTabs.destroy();
      } catch (ex) {
        console.warn(ex); // eslint-disable-line
      }
      $(this.tabList).remove();
      $('.tab-panel', this.tabContainer).remove();
    }
    if (this.tabMapping) {
      this.tabs = [];
      this.tabMapping = [];
      this.tabMoreIndex = null;
    }
    return this;
  },
});

export default __class;
