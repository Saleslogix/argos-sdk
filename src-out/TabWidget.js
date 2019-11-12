define('argos/TabWidget', ['module', 'exports', 'dojo/_base/declare', './_Templated'], function (module, exports, _declare, _Templated2) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Templated3 = _interopRequireDefault(_Templated2);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos.TabWidget
   */
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

  var __class = (0, _declare2.default)('argos.TabWidget', [_Templated3.default], /** @lends argos.TabWidget# */{
    /**
     * @property {Simplate}
     * HTML that defines a new tab list
     */
    tabContentTemplate: new Simplate(['{%! $.tabContainerTemplate %}']),
    /**
     * @property {Simplate}
     * HTML that defines a new tab list
     */
    tabContainerTemplate: new Simplate(['<div class="tab-container horizontal" data-dojo-attach-point="tabContainer"><div>']),
    tabListTemplate: new Simplate(['<ul class="tab-list"></ul>']),
    /**
     * @property {Simplate}
     * HTML that defines a new tab to be placed in the tab list
     *
     */
    tabListItemTemplate: new Simplate(['<li class="tab" role="presentation">', '<a href="#{%: $$.id %}_{%: $.name %}">{%: ($.title || $.options.title) %}</a>', '</li>']),
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
    placeTabList: function placeTabList() {
      var parentNode = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

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
    createTabs: function createTabs() {
      var _this = this;

      var tabs = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

      this.tabList = $(this.tabListTemplate.apply(this));
      $(tabs).each(function (i, tab) {
        $(_this.tabList).append(tab);
      });

      $(this.tabContainer).prepend($(this.tabList));
      var tempTabs = $(this.tabContainer).tabs();
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
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9UYWJXaWRnZXQuanMiXSwibmFtZXMiOlsiX19jbGFzcyIsInRhYkNvbnRlbnRUZW1wbGF0ZSIsIlNpbXBsYXRlIiwidGFiQ29udGFpbmVyVGVtcGxhdGUiLCJ0YWJMaXN0VGVtcGxhdGUiLCJ0YWJMaXN0SXRlbVRlbXBsYXRlIiwiY3VycmVudFRhYiIsImRlZmF1bHRUYWJJbmRleCIsInRhYk1hcHBpbmciLCJ0YWJzIiwiX3NvaG9UYWJzIiwicGxhY2VUYWJMaXN0IiwicGFyZW50Tm9kZSIsInRhYkNvbnRhaW5lciIsImlzVGFiYmVkIiwiJCIsImh0bWwiLCJjcmVhdGVUYWJzIiwidGFiTGlzdCIsImFwcGx5IiwiZWFjaCIsImkiLCJ0YWIiLCJhcHBlbmQiLCJwcmVwZW5kIiwidGVtcFRhYnMiLCJkYXRhIiwiY2xlYXJUYWJzIiwiZGVzdHJveSIsImV4IiwiY29uc29sZSIsIndhcm4iLCJyZW1vdmUiLCJ0YWJNb3JlSW5kZXgiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWtCQTs7O0FBbEJBOzs7Ozs7Ozs7Ozs7Ozs7QUFxQkEsTUFBTUEsVUFBVSx1QkFBUSxpQkFBUixFQUEyQixxQkFBM0IsRUFBeUMsOEJBQThCO0FBQ3JGOzs7O0FBSUFDLHdCQUFvQixJQUFJQyxRQUFKLENBQWEsQ0FDL0IsK0JBRCtCLENBQWIsQ0FMaUU7QUFRckY7Ozs7QUFJQUMsMEJBQXNCLElBQUlELFFBQUosQ0FBYSxDQUNqQyxtRkFEaUMsQ0FBYixDQVorRDtBQWVyRkUscUJBQWlCLElBQUlGLFFBQUosQ0FBYSxDQUM1Qiw0QkFENEIsQ0FBYixDQWZvRTtBQWtCckY7Ozs7O0FBS0FHLHlCQUFxQixJQUFJSCxRQUFKLENBQWEsQ0FDaEMsc0NBRGdDLEVBRWhDLCtFQUZnQyxFQUdoQyxPQUhnQyxDQUFiLENBdkJnRTtBQTRCckY7Ozs7QUFJQUksZ0JBQVksSUFoQ3lFO0FBaUNyRjs7OztBQUlBQyxxQkFBaUIsSUFyQ29FO0FBc0NyRjs7OztBQUlBQyxnQkFBWSxJQTFDeUU7QUEyQ3JGOzs7O0FBSUFDLFVBQU0sSUEvQytFOztBQWlEckZDLGVBQVcsSUFqRDBFO0FBa0RyRjs7O0FBR0FDLGtCQUFjLFNBQVNBLFlBQVQsR0FBdUM7QUFBQSxVQUFqQkMsVUFBaUIsdUVBQUosRUFBSTs7QUFDbkQsVUFBSSxDQUFDLEtBQUtDLFlBQUwsQ0FBa0JELFVBQW5CLElBQWlDLEtBQUtFLFFBQTFDLEVBQW9EO0FBQ2xELGFBQUtOLFVBQUwsR0FBa0IsRUFBbEI7QUFDQSxhQUFLQyxJQUFMLEdBQVksRUFBWjtBQUNBTSxVQUFFSCxVQUFGLEVBQWNJLElBQWQsQ0FBbUIsS0FBS0gsWUFBeEI7QUFDRDtBQUNELGFBQU8sSUFBUDtBQUNELEtBNURvRjtBQTZEckY7Ozs7QUFJQUksZ0JBQVksU0FBU0EsVUFBVCxHQUErQjtBQUFBOztBQUFBLFVBQVhSLElBQVcsdUVBQUosRUFBSTs7QUFDekMsV0FBS1MsT0FBTCxHQUFlSCxFQUFFLEtBQUtYLGVBQUwsQ0FBcUJlLEtBQXJCLENBQTJCLElBQTNCLENBQUYsQ0FBZjtBQUNBSixRQUFFTixJQUFGLEVBQVFXLElBQVIsQ0FBYSxVQUFDQyxDQUFELEVBQUlDLEdBQUosRUFBWTtBQUN2QlAsVUFBRSxNQUFLRyxPQUFQLEVBQWdCSyxNQUFoQixDQUF1QkQsR0FBdkI7QUFDRCxPQUZEOztBQUlBUCxRQUFFLEtBQUtGLFlBQVAsRUFBcUJXLE9BQXJCLENBQTZCVCxFQUFFLEtBQUtHLE9BQVAsQ0FBN0I7QUFDQSxVQUFNTyxXQUFXVixFQUFFLEtBQUtGLFlBQVAsRUFBcUJKLElBQXJCLEVBQWpCO0FBQ0EsV0FBS0MsU0FBTCxHQUFpQmUsU0FBU0MsSUFBVCxDQUFjLE1BQWQsQ0FBakI7QUFDQSxhQUFPLElBQVA7QUFDRCxLQTNFb0Y7QUE0RXJGOzs7QUFHQUMsZUFBVyxTQUFTQSxTQUFULEdBQXFCO0FBQzlCLFVBQUksS0FBS1QsT0FBTCxJQUFnQixLQUFLVCxJQUF6QixFQUErQjtBQUM3QixZQUFJO0FBQ0YsZUFBS0MsU0FBTCxDQUFla0IsT0FBZjtBQUNELFNBRkQsQ0FFRSxPQUFPQyxFQUFQLEVBQVc7QUFDWEMsa0JBQVFDLElBQVIsQ0FBYUYsRUFBYixFQURXLENBQ087QUFDbkI7QUFDRGQsVUFBRSxLQUFLRyxPQUFQLEVBQWdCYyxNQUFoQjtBQUNBakIsVUFBRSxZQUFGLEVBQWdCLEtBQUtGLFlBQXJCLEVBQW1DbUIsTUFBbkM7QUFDRDtBQUNELFVBQUksS0FBS3hCLFVBQVQsRUFBcUI7QUFDbkIsYUFBS0MsSUFBTCxHQUFZLEVBQVo7QUFDQSxhQUFLRCxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsYUFBS3lCLFlBQUwsR0FBb0IsSUFBcEI7QUFDRDtBQUNELGFBQU8sSUFBUDtBQUNEO0FBL0ZvRixHQUF2RSxDQUFoQjs7b0JBa0dlakMsTyIsImZpbGUiOiJUYWJXaWRnZXQuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgX1RlbXBsYXRlZCBmcm9tICcuL19UZW1wbGF0ZWQnO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5UYWJXaWRnZXRcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5UYWJXaWRnZXQnLCBbX1RlbXBsYXRlZF0sIC8qKiBAbGVuZHMgYXJnb3MuVGFiV2lkZ2V0IyAqL3tcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBkZWZpbmVzIGEgbmV3IHRhYiBsaXN0XHJcbiAgICovXHJcbiAgdGFiQ29udGVudFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJ3slISAkLnRhYkNvbnRhaW5lclRlbXBsYXRlICV9JyxcclxuICBdKSxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBkZWZpbmVzIGEgbmV3IHRhYiBsaXN0XHJcbiAgICovXHJcbiAgdGFiQ29udGFpbmVyVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cInRhYi1jb250YWluZXIgaG9yaXpvbnRhbFwiIGRhdGEtZG9qby1hdHRhY2gtcG9pbnQ9XCJ0YWJDb250YWluZXJcIj48ZGl2PicsXHJcbiAgXSksXHJcbiAgdGFiTGlzdFRlbXBsYXRlOiBuZXcgU2ltcGxhdGUoW1xyXG4gICAgJzx1bCBjbGFzcz1cInRhYi1saXN0XCI+PC91bD4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IGRlZmluZXMgYSBuZXcgdGFiIHRvIGJlIHBsYWNlZCBpbiB0aGUgdGFiIGxpc3RcclxuICAgKlxyXG4gICAqL1xyXG4gIHRhYkxpc3RJdGVtVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwidGFiXCIgcm9sZT1cInByZXNlbnRhdGlvblwiPicsXHJcbiAgICAnPGEgaHJlZj1cIiN7JTogJCQuaWQgJX1feyU6ICQubmFtZSAlfVwiPnslOiAoJC50aXRsZSB8fCAkLm9wdGlvbnMudGl0bGUpICV9PC9hPicsXHJcbiAgICAnPC9saT4nLFxyXG4gIF0pLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7bGl9XHJcbiAgICogQ3VycmVudCB0YWIgKGh0bWwgZWxlbWVudCBsaSkgdGhhdCB0aGUgdmlldyBpcyBvblxyXG4gICAqL1xyXG4gIGN1cnJlbnRUYWI6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtpbnR9XHJcbiAgICogaW50IHZhbHVlIHJlcHJlc2VudGluZyB0aGUgaW5kZXggYXQgd2hpY2ggdGhlIGRlZmF1bHQgdGFiIGlzIGxvY2F0ZWRcclxuICAgKi9cclxuICBkZWZhdWx0VGFiSW5kZXg6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtBcnJheX1cclxuICAgKiBNYXBwaW5nIG9mIHRhYiB0byB0aGUgc2VjdGlvblxyXG4gICAqL1xyXG4gIHRhYk1hcHBpbmc6IG51bGwsXHJcbiAgLyoqXHJcbiAgICogQHByb3BlcnR5IHtBcnJheX1cclxuICAgKiBBcnJheSBob2xkaW5nIHRoZSB0YWIgZG9tIGVsZW1lbnRzXHJcbiAgICovXHJcbiAgdGFiczogbnVsbCxcclxuXHJcbiAgX3NvaG9UYWJzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIHBhcmVudE5vZGUgZm9yIHRoZSB0YWJMaXN0XHJcbiAgICovXHJcbiAgcGxhY2VUYWJMaXN0OiBmdW5jdGlvbiBwbGFjZVRhYkxpc3QocGFyZW50Tm9kZSA9IHt9KSB7XHJcbiAgICBpZiAoIXRoaXMudGFiQ29udGFpbmVyLnBhcmVudE5vZGUgJiYgdGhpcy5pc1RhYmJlZCkge1xyXG4gICAgICB0aGlzLnRhYk1hcHBpbmcgPSBbXTtcclxuICAgICAgdGhpcy50YWJzID0gW107XHJcbiAgICAgICQocGFyZW50Tm9kZSkuaHRtbCh0aGlzLnRhYkNvbnRhaW5lcik7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEZ1bmN0aW9uIHVzZWQgdG8gY3JlYXRlIHRoZSB0YWJzLCBzaG91bGQgYmUgY2FsbGVkIGJ5IHRoZSBwYXJlbnQgdXBvbiBjb21wbGV0aW9uIG9mIHBvcHVsYXRpbmcgdGhlIHRhYnMgYXJyYXkgb2YgZG9tIG9iamVjdHNcclxuICAgKiBAcGFyYW0ge0FycmF5fSBBbiBhcnJheSBvZiB0aGUgdGFiIG9iamVjdHMuXHJcbiAgKi9cclxuICBjcmVhdGVUYWJzOiBmdW5jdGlvbiBjcmVhdGVUYWJzKHRhYnMgPSBbXSkge1xyXG4gICAgdGhpcy50YWJMaXN0ID0gJCh0aGlzLnRhYkxpc3RUZW1wbGF0ZS5hcHBseSh0aGlzKSk7XHJcbiAgICAkKHRhYnMpLmVhY2goKGksIHRhYikgPT4ge1xyXG4gICAgICAkKHRoaXMudGFiTGlzdCkuYXBwZW5kKHRhYik7XHJcbiAgICB9KTtcclxuXHJcbiAgICAkKHRoaXMudGFiQ29udGFpbmVyKS5wcmVwZW5kKCQodGhpcy50YWJMaXN0KSk7XHJcbiAgICBjb25zdCB0ZW1wVGFicyA9ICQodGhpcy50YWJDb250YWluZXIpLnRhYnMoKTtcclxuICAgIHRoaXMuX3NvaG9UYWJzID0gdGVtcFRhYnMuZGF0YSgndGFicycpO1xyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBGdW5jdGlvbiB1c2VkIHRvIGNsZWFyIHRoZSB0YWJzLCBzaG91bGQgYmUgY2FsbGVkIGJ5IHRoZSBwYXJlbnQgb24gaXQncyBjbGVhciBjYWxsXHJcbiAgKi9cclxuICBjbGVhclRhYnM6IGZ1bmN0aW9uIGNsZWFyVGFicygpIHtcclxuICAgIGlmICh0aGlzLnRhYkxpc3QgJiYgdGhpcy50YWJzKSB7XHJcbiAgICAgIHRyeSB7XHJcbiAgICAgICAgdGhpcy5fc29ob1RhYnMuZGVzdHJveSgpO1xyXG4gICAgICB9IGNhdGNoIChleCkge1xyXG4gICAgICAgIGNvbnNvbGUud2FybihleCk7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgfVxyXG4gICAgICAkKHRoaXMudGFiTGlzdCkucmVtb3ZlKCk7XHJcbiAgICAgICQoJy50YWItcGFuZWwnLCB0aGlzLnRhYkNvbnRhaW5lcikucmVtb3ZlKCk7XHJcbiAgICB9XHJcbiAgICBpZiAodGhpcy50YWJNYXBwaW5nKSB7XHJcbiAgICAgIHRoaXMudGFicyA9IFtdO1xyXG4gICAgICB0aGlzLnRhYk1hcHBpbmcgPSBbXTtcclxuICAgICAgdGhpcy50YWJNb3JlSW5kZXggPSBudWxsO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfSxcclxufSk7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=