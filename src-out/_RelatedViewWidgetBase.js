define('argos/_RelatedViewWidgetBase', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', 'dijit/_WidgetBase', './_Templated', './I18n'], function (module, exports, _declare, _lang, _WidgetBase2, _Templated2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _WidgetBase3 = _interopRequireDefault(_WidgetBase2);

  var _Templated3 = _interopRequireDefault(_Templated2);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('relatedViewWidgetBase');

  /**
   * @class argos._RelatedViewWidgetBase
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

  var __class = (0, _declare2.default)('argos._RelatedViewWidgetBase', [_WidgetBase3.default, _Templated3.default], /** @lends argos._RelatedViewWidgetBase# */{
    cls: null,
    loadingText: resource.loadingText,
    /**
     * @property {Simplate}
     * Simple that defines the HTML Markup
     */
    widgetTemplate: new Simplate(['<div class="related-view-widget-base {%: $$.cls %}">', '<div data-dojo-attach-point="containerNode" >', '{%! $$.relatedContentTemplate %}', '</div>', '</div>']),
    relatedContentTemplate: new Simplate(['']),
    loadingTemplate: new Simplate(['<div class="busy-indicator-container" aria-live="polite">', '<div class="busy-indicator active">', '<div class="bar one"></div>', '<div class="bar two"></div>', '<div class="bar three"></div>', '<div class="bar four"></div>', '<div class="bar five"></div>', '</div>', '<span>{%: $.loadingText %}</span>', '</div>']),
    constructor: function constructor(options) {
      _lang2.default.mixin(this, options);
    },
    onInit: function onInit() {
      this.onLoad();
    },
    onLoad: function onLoad() {}
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fUmVsYXRlZFZpZXdXaWRnZXRCYXNlLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiX19jbGFzcyIsImNscyIsImxvYWRpbmdUZXh0Iiwid2lkZ2V0VGVtcGxhdGUiLCJTaW1wbGF0ZSIsInJlbGF0ZWRDb250ZW50VGVtcGxhdGUiLCJsb2FkaW5nVGVtcGxhdGUiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJtaXhpbiIsIm9uSW5pdCIsIm9uTG9hZCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBcUJBLE1BQU1BLFdBQVcsb0JBQVksdUJBQVosQ0FBakI7O0FBRUE7OztBQXZCQTs7Ozs7Ozs7Ozs7Ozs7O0FBMEJBLE1BQU1DLFVBQVUsdUJBQVEsOEJBQVIsRUFBd0MsMkNBQXhDLEVBQW1FLDJDQUEyQztBQUM1SEMsU0FBSyxJQUR1SDtBQUU1SEMsaUJBQWFILFNBQVNHLFdBRnNHO0FBRzVIOzs7O0FBSUFDLG9CQUFnQixJQUFJQyxRQUFKLENBQWEsQ0FDM0Isc0RBRDJCLEVBRTNCLCtDQUYyQixFQUczQixrQ0FIMkIsRUFJM0IsUUFKMkIsRUFLM0IsUUFMMkIsQ0FBYixDQVA0RztBQWM1SEMsNEJBQXdCLElBQUlELFFBQUosQ0FBYSxDQUNuQyxFQURtQyxDQUFiLENBZG9HO0FBaUI1SEUscUJBQWlCLElBQUlGLFFBQUosQ0FBYSxDQUM1QiwyREFENEIsRUFFNUIscUNBRjRCLEVBRzVCLDZCQUg0QixFQUk1Qiw2QkFKNEIsRUFLNUIsK0JBTDRCLEVBTTVCLDhCQU40QixFQU81Qiw4QkFQNEIsRUFRNUIsUUFSNEIsRUFTNUIsbUNBVDRCLEVBVTVCLFFBVjRCLENBQWIsQ0FqQjJHO0FBNkI1SEcsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQkMsT0FBckIsRUFBOEI7QUFDekMscUJBQUtDLEtBQUwsQ0FBVyxJQUFYLEVBQWlCRCxPQUFqQjtBQUNELEtBL0IySDtBQWdDNUhFLFlBQVEsU0FBU0EsTUFBVCxHQUFrQjtBQUN4QixXQUFLQyxNQUFMO0FBQ0QsS0FsQzJIO0FBbUM1SEEsWUFBUSxTQUFTQSxNQUFULEdBQWtCLENBQUU7QUFuQ2dHLEdBQTlHLENBQWhCOztvQkFzQ2VYLE8iLCJmaWxlIjoiX1JlbGF0ZWRWaWV3V2lkZ2V0QmFzZS5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBfV2lkZ2V0QmFzZSBmcm9tICdkaWppdC9fV2lkZ2V0QmFzZSc7XHJcbmltcG9ydCBfVGVtcGxhdGVkIGZyb20gJy4vX1RlbXBsYXRlZCc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuL0kxOG4nO1xyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgncmVsYXRlZFZpZXdXaWRnZXRCYXNlJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLl9SZWxhdGVkVmlld1dpZGdldEJhc2VcclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fUmVsYXRlZFZpZXdXaWRnZXRCYXNlJywgW19XaWRnZXRCYXNlLCBfVGVtcGxhdGVkXSwgLyoqIEBsZW5kcyBhcmdvcy5fUmVsYXRlZFZpZXdXaWRnZXRCYXNlIyAqL3tcclxuICBjbHM6IG51bGwsXHJcbiAgbG9hZGluZ1RleHQ6IHJlc291cmNlLmxvYWRpbmdUZXh0LFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogU2ltcGxlIHRoYXQgZGVmaW5lcyB0aGUgSFRNTCBNYXJrdXBcclxuICAgKi9cclxuICB3aWRnZXRUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGNsYXNzPVwicmVsYXRlZC12aWV3LXdpZGdldC1iYXNlIHslOiAkJC5jbHMgJX1cIj4nLFxyXG4gICAgJzxkaXYgZGF0YS1kb2pvLWF0dGFjaC1wb2ludD1cImNvbnRhaW5lck5vZGVcIiA+JyxcclxuICAgICd7JSEgJCQucmVsYXRlZENvbnRlbnRUZW1wbGF0ZSAlfScsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8L2Rpdj4nLFxyXG4gIF0pLFxyXG4gIHJlbGF0ZWRDb250ZW50VGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnJyxcclxuICBdKSxcclxuICBsb2FkaW5nVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yLWNvbnRhaW5lclwiIGFyaWEtbGl2ZT1cInBvbGl0ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJ1c3ktaW5kaWNhdG9yIGFjdGl2ZVwiPicsXHJcbiAgICAnPGRpdiBjbGFzcz1cImJhciBvbmVcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgdHdvXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIHRocmVlXCI+PC9kaXY+JyxcclxuICAgICc8ZGl2IGNsYXNzPVwiYmFyIGZvdXJcIj48L2Rpdj4nLFxyXG4gICAgJzxkaXYgY2xhc3M9XCJiYXIgZml2ZVwiPjwvZGl2PicsXHJcbiAgICAnPC9kaXY+JyxcclxuICAgICc8c3Bhbj57JTogJC5sb2FkaW5nVGV4dCAlfTwvc3Bhbj4nLFxyXG4gICAgJzwvZGl2PicsXHJcbiAgXSksXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIGxhbmcubWl4aW4odGhpcywgb3B0aW9ucyk7XHJcbiAgfSxcclxuICBvbkluaXQ6IGZ1bmN0aW9uIG9uSW5pdCgpIHtcclxuICAgIHRoaXMub25Mb2FkKCk7XHJcbiAgfSxcclxuICBvbkxvYWQ6IGZ1bmN0aW9uIG9uTG9hZCgpIHt9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==