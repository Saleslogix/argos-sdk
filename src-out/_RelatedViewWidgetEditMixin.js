define('argos/_RelatedViewWidgetEditMixin', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', './RelatedViewManager'], function (module, exports, _declare, _lang, _RelatedViewManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _RelatedViewManager2 = _interopRequireDefault(_RelatedViewManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class argos._RelatedViewWidgetEditMixin
   */
  var __class = (0, _declare2.default)('argos._RelatedViewWidgetEditMixin', null, /** @lends argos._RelatedViewWidgetEditMixin# */{
    cls: null,
    /**
     * @property {Simplate}
     * HTML that is used for detail layout items that point to imbeaded related views, displayed related view widget
     *
     * * `$` => detail layout row
     * * `$$` => view instance
     */
    relatedContentViewsTemplate: new Simplate(['<div id="{%= $.id %}" class="related-view-edit-content {%= $.cls %}"></div>']),
    createRowContent: function createRowContent(layout, content) {
      if (layout.relatedView) {
        content.push(this.relatedContentViewsTemplate.apply(layout.relatedView, this));
      } else {
        this.inherited(createRowContent, arguments);
      }
    },
    processData: function processData(entry) {
      this.destroyRelatedViewWidgets();
      this.createRelatedViews(this.layout, entry);
      this.inherited(processData, arguments);
    },
    createRelatedViews: function createRelatedViews(layout, entry) {
      var _this = this;

      layout.forEach(function (item) {
        if (item.relatedView) {
          var node = $('#' + item.relatedView.id, _this.contentNode)[0];
          if (node) {
            _this.onProcessRelatedViews(item.relatedView, node, entry);
          }
        }
        if (item.children) {
          _this.createRelatedViews(item.children, entry);
        }
      });
    },
    /**
     * Gets the related view manager for a related view definition.
     * If a manager is not found a new Related View Manager is created and returned.
     * @return {Object} RelatedViewManager
     */
    getRelatedViewManager: function getRelatedViewManager(relatedView) {
      if (!this.relatedViewManagers) {
        this.relatedViewManagers = {};
      }

      var relatedViewManager = void 0;

      if (this.relatedViewManagers[relatedView.id]) {
        relatedViewManager = this.relatedViewManagers[relatedView.id];
      } else {
        var relatedViewOptions = {};
        _lang2.default.mixin(relatedViewOptions, relatedView);

        var options = {
          id: relatedView.id,
          relatedViewConfig: relatedViewOptions
        };
        relatedViewManager = new _RelatedViewManager2.default(options);
        this.relatedViewManagers[relatedView.id] = relatedViewManager;
      }
      return relatedViewManager;
    },
    onProcessRelatedViews: function onProcessRelatedViews(relatedView, rowNode, entry) {
      try {
        if (typeof relatedView.enabled === 'undefined') {
          relatedView.enabled = true;
        }

        if (relatedView.enabled) {
          var relatedViewManager = this.getRelatedViewManager(relatedView);
          if (relatedViewManager) {
            relatedViewManager.addView(entry, rowNode, this);
          }
        }
      } catch (error) {
        console.log('Error processing related view:' + error); // eslint-disable-line
      }
    },
    /**
     *  Destroys all of the related view widgets, that was added.
     */
    destroyRelatedViewWidgets: function destroyRelatedViewWidgets() {
      if (this.relatedViewManagers) {
        for (var relatedViewId in this.relatedViewManagers) {
          if (this.relatedViewManagers.hasOwnProperty(relatedViewId)) {
            this.relatedViewManagers[relatedViewId].destroyViews();
          }
        }
      }
    },
    /**
     * Extends dijit Widget to destroy the search widget before destroying the view.
     */
    destroy: function destroy() {
      this.destroyRelatedViewWidgets();
      this.inherited(destroy, arguments);
    }
  }); /* Copyright 2017 Infor
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

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fUmVsYXRlZFZpZXdXaWRnZXRFZGl0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsImNscyIsInJlbGF0ZWRDb250ZW50Vmlld3NUZW1wbGF0ZSIsIlNpbXBsYXRlIiwiY3JlYXRlUm93Q29udGVudCIsImxheW91dCIsImNvbnRlbnQiLCJyZWxhdGVkVmlldyIsInB1c2giLCJhcHBseSIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInByb2Nlc3NEYXRhIiwiZW50cnkiLCJkZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzIiwiY3JlYXRlUmVsYXRlZFZpZXdzIiwiZm9yRWFjaCIsIml0ZW0iLCJub2RlIiwiJCIsImlkIiwiY29udGVudE5vZGUiLCJvblByb2Nlc3NSZWxhdGVkVmlld3MiLCJjaGlsZHJlbiIsImdldFJlbGF0ZWRWaWV3TWFuYWdlciIsInJlbGF0ZWRWaWV3TWFuYWdlcnMiLCJyZWxhdGVkVmlld01hbmFnZXIiLCJyZWxhdGVkVmlld09wdGlvbnMiLCJtaXhpbiIsIm9wdGlvbnMiLCJyZWxhdGVkVmlld0NvbmZpZyIsInJvd05vZGUiLCJlbmFibGVkIiwiYWRkVmlldyIsImVycm9yIiwiY29uc29sZSIsImxvZyIsInJlbGF0ZWRWaWV3SWQiLCJoYXNPd25Qcm9wZXJ0eSIsImRlc3Ryb3lWaWV3cyIsImRlc3Ryb3kiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7QUFHQSxNQUFNQSxVQUFVLHVCQUFRLG1DQUFSLEVBQTZDLElBQTdDLEVBQW1ELGdEQUFnRDtBQUNqSEMsU0FBSyxJQUQ0RztBQUVqSDs7Ozs7OztBQU9BQyxpQ0FBNkIsSUFBSUMsUUFBSixDQUFhLENBQ3hDLDZFQUR3QyxDQUFiLENBVG9GO0FBWWpIQyxzQkFBa0IsU0FBU0EsZ0JBQVQsQ0FBMEJDLE1BQTFCLEVBQWtDQyxPQUFsQyxFQUEyQztBQUMzRCxVQUFJRCxPQUFPRSxXQUFYLEVBQXdCO0FBQ3RCRCxnQkFBUUUsSUFBUixDQUFhLEtB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QUFLQSxtQkFBTCxDQUF5QmEsY0FBekIsQ0FBd0NELGFBQXhDLENBQUosRUFBNEQ7QUFDMUQsaUJBQUtaLG1CQUFMLENBQXlCWSxhQUF6QixFQUF3Q0UsWUFBeEM7QUFDRDtBQUNGO0FBQ0Y7QUFDRixLQTNGZ0g7QUE0RmpIOzs7QUFHQUMsYUFBUyxTQUFTQSxPQUFULEdBQW1CO0FBQzFCLFdBQUsxQix5QkFBTDtBQUNBLFdBQUtKLFNBQUwsQ0FBZThCLE9BQWYsRUFBd0I3QixTQUF4QjtBQUNEO0FBbEdnSCxHQUFuRyxDQUFoQixDLENBdEJBOzs7Ozs7Ozs7Ozs7Ozs7b0JBMEhlWCxPIiwiZmlsZSI6Il9SZWxhdGVkVmlld1dpZGdldEVkaXRNaXhpbi5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBSZWxhdGVkVmlld01hbmFnZXIgZnJvbSAnLi9SZWxhdGVkVmlld01hbmFnZXInO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5fUmVsYXRlZFZpZXdXaWRnZXRFZGl0TWl4aW5cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fUmVsYXRlZFZpZXdXaWRnZXRFZGl0TWl4aW4nLCBudWxsLCAvKiogQGxlbmRzIGFyZ29zLl9SZWxhdGVkVmlld1dpZGdldEVkaXRNaXhpbiMgKi97XHJcbiAgY2xzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IGlzIHVzZWQgZm9yIGRldGFpbCBsYXlvdXQgaXRlbXMgdGhhdCBwb2ludCB0byBpbWJlYWRlZCByZWxhdGVkIHZpZXdzLCBkaXNwbGF5ZWQgcmVsYXRlZCB2aWV3IHdpZGdldFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gZGV0YWlsIGxheW91dCByb3dcclxuICAgKiAqIGAkJGAgPT4gdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHJlbGF0ZWRDb250ZW50Vmlld3NUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGlkPVwieyU9ICQuaWQgJX1cIiBjbGFzcz1cInJlbGF0ZWQtdmlldy1lZGl0LWNvbnRlbnQgeyU9ICQuY2xzICV9XCI+PC9kaXY+JyxcclxuICBdKSxcclxuICBjcmVhdGVSb3dDb250ZW50OiBmdW5jdGlvbiBjcmVhdGVSb3dDb250ZW50KGxheW91dCwgY29udGVudCkge1xyXG4gICAgaWYgKGxheW91dC5yZWxhdGVkVmlldykge1xyXG4gICAgICBjb250ZW50LnB1c2godGhpcy5yZWxhdGVkQ29udGVudFZpZXdzVGVtcGxhdGUuYXBwbHkobGF5b3V0LnJlbGF0ZWRWaWV3LCB0aGlzKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmluaGVyaXRlZChjcmVhdGVSb3dDb250ZW50LCBhcmd1bWVudHMpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcHJvY2Vzc0RhdGE6IGZ1bmN0aW9uIHByb2Nlc3NEYXRhKGVudHJ5KSB7XHJcbiAgICB0aGlzLmRlc3Ryb3lSZWxhdGVkVmlld1dpZGdldHMoKTtcclxuICAgIHRoaXMuY3JlYXRlUmVsYXRlZFZpZXdzKHRoaXMubGF5b3V0LCBlbnRyeSk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChwcm9jZXNzRGF0YSwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIGNyZWF0ZVJlbGF0ZWRWaWV3czogZnVuY3Rpb24gY3JlYXRlUmVsYXRlZFZpZXdzKGxheW91dCwgZW50cnkpIHtcclxuICAgIGxheW91dC5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnJlbGF0ZWRWaWV3KSB7XHJcbiAgICAgICAgY29uc3Qgbm9kZSA9ICQoYCMke2l0ZW0ucmVsYXRlZFZpZXcuaWR9YCwgdGhpcy5jb250ZW50Tm9kZSlbMF07XHJcbiAgICAgICAgaWYgKG5vZGUpIHtcclxuICAgICAgICAgIHRoaXMub25Qcm9jZXNzUmVsYXRlZFZpZXdzKGl0ZW0ucmVsYXRlZFZpZXcsIG5vZGUsIGVudHJ5KTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgICAgaWYgKGl0ZW0uY2hpbGRyZW4pIHtcclxuICAgICAgICB0aGlzLmNyZWF0ZVJlbGF0ZWRWaWV3cyhpdGVtLmNoaWxkcmVuLCBlbnRyeSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgcmVsYXRlZCB2aWV3IG1hbmFnZXIgZm9yIGEgcmVsYXRlZCB2aWV3IGRlZmluaXRpb24uXHJcbiAgICogSWYgYSBtYW5hZ2VyIGlzIG5vdCBmb3VuZCBhIG5ldyBSZWxhdGVkIFZpZXcgTWFuYWdlciBpcyBjcmVhdGVkIGFuZCByZXR1cm5lZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFJlbGF0ZWRWaWV3TWFuYWdlclxyXG4gICAqL1xyXG4gIGdldFJlbGF0ZWRWaWV3TWFuYWdlcjogZnVuY3Rpb24gZ2V0UmVsYXRlZFZpZXdNYW5hZ2VyKHJlbGF0ZWRWaWV3KSB7XHJcbiAgICBpZiAoIXRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycykge1xyXG4gICAgICB0aGlzLnJlbGF0ZWRWaWV3TWFuYWdlcnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVsYXRlZFZpZXdNYW5hZ2VyO1xyXG5cclxuICAgIGlmICh0aGlzLnJlbGF0ZWRWaWV3TWFuYWdlcnNbcmVsYXRlZFZpZXcuaWRdKSB7XHJcbiAgICAgIHJlbGF0ZWRWaWV3TWFuYWdlciA9IHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vyc1tyZWxhdGVkVmlldy5pZF07XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCByZWxhdGVkVmlld09wdGlvbnMgPSB7fTtcclxuICAgICAgbGFuZy5taXhpbihyZWxhdGVkVmlld09wdGlvbnMsIHJlbGF0ZWRWaWV3KTtcclxuXHJcbiAgICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgICAgaWQ6IHJlbGF0ZWRWaWV3LmlkLFxyXG4gICAgICAgIHJlbGF0ZWRWaWV3Q29uZmlnOiByZWxhdGVkVmlld09wdGlvbnMsXHJcbiAgICAgIH07XHJcbiAgICAgIHJlbGF0ZWRWaWV3TWFuYWdlciA9IG5ldyBSZWxhdGVkVmlld01hbmFnZXIob3B0aW9ucyk7XHJcbiAgICAgIHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vyc1tyZWxhdGVkVmlldy5pZF0gPSByZWxhdGVkVmlld01hbmFnZXI7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gcmVsYXRlZFZpZXdNYW5hZ2VyO1xyXG4gIH0sXHJcbiAgb25Qcm9jZXNzUmVsYXRlZFZpZXdzOiBmdW5jdGlvbiBvblByb2Nlc3NSZWxhdGVkVmlld3MocmVsYXRlZFZpZXcsIHJvd05vZGUsIGVudHJ5KSB7XHJcbiAgICB0cnkge1xyXG4gICAgICBpZiAodHlwZW9mIHJlbGF0ZWRWaWV3LmVuYWJsZWQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgcmVsYXRlZFZpZXcuZW5hYmxlZCA9IHRydWU7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChyZWxhdGVkVmlldy5lbmFibGVkKSB7XHJcbiAgICAgICAgY29uc3QgcmVsYXRlZFZpZXdNYW5hZ2VyID0gdGhpcy5nZXRSZWxhdGVkVmlld01hbmFnZXIocmVsYXRlZFZpZXcpO1xyXG4gICAgICAgIGlmIChyZWxhdGVkVmlld01hbmFnZXIpIHtcclxuICAgICAgICAgIHJlbGF0ZWRWaWV3TWFuYWdlci5hZGRWaWV3KGVudHJ5LCByb3dOb2RlLCB0aGlzKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBwcm9jZXNzaW5nIHJlbGF0ZWQgdmlldzonICsgZXJyb3IpOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICB9XHJcbiAgfSxcclxuICAvKipcclxuICAgKiAgRGVzdHJveXMgYWxsIG9mIHRoZSByZWxhdGVkIHZpZXcgd2lkZ2V0cywgdGhhdCB3YXMgYWRkZWQuXHJcbiAgICovXHJcbiAgZGVzdHJveVJlbGF0ZWRWaWV3V2lkZ2V0czogZnVuY3Rpb24gZGVzdHJveVJlbGF0ZWRWaWV3V2lkZ2V0cygpIHtcclxuICAgIGlmICh0aGlzLnJlbGF0ZWRWaWV3TWFuYWdlcnMpIHtcclxuICAgICAgZm9yIChjb25zdCByZWxhdGVkVmlld0lkIGluIHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycykge1xyXG4gICAgICAgIGlmICh0aGlzLnJlbGF0ZWRWaWV3TWFuYWdlcnMuaGFzT3duUHJvcGVydHkocmVsYXRlZFZpZXdJZCkpIHtcclxuICAgICAgICAgIHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vyc1tyZWxhdGVkVmlld0lkXS5kZXN0cm95Vmlld3MoKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIEV4dGVuZHMgZGlqaXQgV2lkZ2V0IHRvIGRlc3Ryb3kgdGhlIHNlYXJjaCB3aWRnZXQgYmVmb3JlIGRlc3Ryb3lpbmcgdGhlIHZpZXcuXHJcbiAgICovXHJcbiAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcclxuICAgIHRoaXMuZGVzdHJveVJlbGF0ZWRWaWV3V2lkZ2V0cygpO1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoZGVzdHJveSwgYXJndW1lbnRzKTtcclxuICB9LFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19