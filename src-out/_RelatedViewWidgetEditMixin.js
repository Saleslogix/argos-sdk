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
        this.inherited(arguments);
      }
    },
    processData: function processData(entry) {
      this.destroyRelatedViewWidgets();
      this.createRelatedViews(this.layout, entry);
      this.inherited(arguments);
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
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fUmVsYXRlZFZpZXdXaWRnZXRFZGl0TWl4aW4uanMiXSwibmFtZXMiOlsiX19jbGFzcyIsImNscyIsInJlbGF0ZWRDb250ZW50Vmlld3NUZW1wbGF0ZSIsIlNpbXBsYXRlIiwiY3JlYXRlUm93Q29udGVudCIsImxheW91dCIsImNvbnRlbnQiLCJyZWxhdGVkVmlldyIsInB1c2giLCJhcHBseSIsImluaGVyaXRlZCIsImFyZ3VtZW50cyIsInByb2Nlc3NEYXRhIiwiZW50cnkiLCJkZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzIiwiY3JlYXRlUmVsYXRlZFZpZXdzIiwiZm9yRWFjaCIsIml0ZW0iLCJub2RlIiwiJCIsImlkIiwiY29udGVudE5vZGUiLCJvblByb2Nlc3NSZWxhdGVkVmlld3MiLCJjaGlsZHJlbiIsImdldFJlbGF0ZWRWaWV3TWFuYWdlciIsInJlbGF0ZWRWaWV3TWFuYWdlcnMiLCJyZWxhdGVkVmlld01hbmFnZXIiLCJyZWxhdGVkVmlld09wdGlvbnMiLCJtaXhpbiIsIm9wdGlvbnMiLCJyZWxhdGVkVmlld0NvbmZpZyIsInJvd05vZGUiLCJlbmFibGVkIiwiYWRkVmlldyIsImVycm9yIiwiY29uc29sZSIsImxvZyIsInJlbGF0ZWRWaWV3SWQiLCJoYXNPd25Qcm9wZXJ0eSIsImRlc3Ryb3lWaWV3cyIsImRlc3Ryb3kiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBbUJBOzs7QUFHQSxNQUFNQSxVQUFVLHVCQUFRLG1DQUFSLEVBQTZDLElBQTdDLEVBQW1ELGdEQUFnRDtBQUNqSEMsU0FBSyxJQUQ0RztBQUVqSDs7Ozs7OztBQU9BQyxpQ0FBNkIsSUFBSUMsUUFBSixDQUFhLENBQ3hDLDZFQUR3QyxDQUFiLENBVG9GO0FBWWpIQyxzQkFBa0IsU0FBU0EsZ0JBQVQsQ0FBMEJDLE1BQTFCLEVBQWtDQyxPQUFsQyxFQUEyQztBQUMzRCxVQUFJRCxPQUFPRSxXQUFYLEVBQXdCO0FBQ3RCRCxnQkFBUUUsSUFBUixDQUFhLEtB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d0NELGFBQXhDLENBQUosRUFBNEQ7QUFDMUQsaUJBQUtaLG1CQUFMLENBQXlCWSxhQUF6QixFQUF3Q0UsWUFBeEM7QUFDRDtBQUNGO0FBQ0Y7QUFDRixLQTNGZ0g7QUE0RmpIOzs7QUFHQUMsYUFBUyxTQUFTQSxPQUFULEdBQW1CO0FBQzFCLFdBQUsxQix5QkFBTDtBQUNBLFdBQUtKLFNBQUwsQ0FBZUMsU0FBZjtBQUNEO0FBbEdnSCxHQUFuRyxDQUFoQixDLENBdEJBOzs7Ozs7Ozs7Ozs7Ozs7b0JBMEhlWCxPIiwiZmlsZSI6Il9SZWxhdGVkVmlld1dpZGdldEVkaXRNaXhpbi5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBSZWxhdGVkVmlld01hbmFnZXIgZnJvbSAnLi9SZWxhdGVkVmlld01hbmFnZXInO1xyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5fUmVsYXRlZFZpZXdXaWRnZXRFZGl0TWl4aW5cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fUmVsYXRlZFZpZXdXaWRnZXRFZGl0TWl4aW4nLCBudWxsLCAvKiogQGxlbmRzIGFyZ29zLl9SZWxhdGVkVmlld1dpZGdldEVkaXRNaXhpbiMgKi97XHJcbiAgY2xzOiBudWxsLFxyXG4gIC8qKlxyXG4gICAqIEBwcm9wZXJ0eSB7U2ltcGxhdGV9XHJcbiAgICogSFRNTCB0aGF0IGlzIHVzZWQgZm9yIGRldGFpbCBsYXlvdXQgaXRlbXMgdGhhdCBwb2ludCB0byBpbWJlYWRlZCByZWxhdGVkIHZpZXdzLCBkaXNwbGF5ZWQgcmVsYXRlZCB2aWV3IHdpZGdldFxyXG4gICAqXHJcbiAgICogKiBgJGAgPT4gZGV0YWlsIGxheW91dCByb3dcclxuICAgKiAqIGAkJGAgPT4gdmlldyBpbnN0YW5jZVxyXG4gICAqL1xyXG4gIHJlbGF0ZWRDb250ZW50Vmlld3NUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8ZGl2IGlkPVwieyU9ICQuaWQgJX1cIiBjbGFzcz1cInJlbGF0ZWQtdmlldy1lZGl0LWNvbnRlbnQgeyU9ICQuY2xzICV9XCI+PC9kaXY+JyxcclxuICBdKSxcclxuICBjcmVhdGVSb3dDb250ZW50OiBmdW5jdGlvbiBjcmVhdGVSb3dDb250ZW50KGxheW91dCwgY29udGVudCkge1xyXG4gICAgaWYgKGxheW91dC5yZWxhdGVkVmlldykge1xyXG4gICAgICBjb250ZW50LnB1c2godGhpcy5yZWxhdGVkQ29udGVudFZpZXdzVGVtcGxhdGUuYXBwbHkobGF5b3V0LnJlbGF0ZWRWaWV3LCB0aGlzKSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgcHJvY2Vzc0RhdGE6IGZ1bmN0aW9uIHByb2Nlc3NEYXRhKGVudHJ5KSB7XHJcbiAgICB0aGlzLmRlc3Ryb3lSZWxhdGVkVmlld1dpZGdldHMoKTtcclxuICAgIHRoaXMuY3JlYXRlUmVsYXRlZFZpZXdzKHRoaXMubGF5b3V0LCBlbnRyeSk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgY3JlYXRlUmVsYXRlZFZpZXdzOiBmdW5jdGlvbiBjcmVhdGVSZWxhdGVkVmlld3MobGF5b3V0LCBlbnRyeSkge1xyXG4gICAgbGF5b3V0LmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgaWYgKGl0ZW0ucmVsYXRlZFZpZXcpIHtcclxuICAgICAgICBjb25zdCBub2RlID0gJChgIyR7aXRlbS5yZWxhdGVkVmlldy5pZH1gLCB0aGlzLmNvbnRlbnROb2RlKVswXTtcclxuICAgICAgICBpZiAobm9kZSkge1xyXG4gICAgICAgICAgdGhpcy5vblByb2Nlc3NSZWxhdGVkVmlld3MoaXRlbS5yZWxhdGVkVmlldywgbm9kZSwgZW50cnkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBpZiAoaXRlbS5jaGlsZHJlbikge1xyXG4gICAgICAgIHRoaXMuY3JlYXRlUmVsYXRlZFZpZXdzKGl0ZW0uY2hpbGRyZW4sIGVudHJ5KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxuICAvKipcclxuICAgKiBHZXRzIHRoZSByZWxhdGVkIHZpZXcgbWFuYWdlciBmb3IgYSByZWxhdGVkIHZpZXcgZGVmaW5pdGlvbi5cclxuICAgKiBJZiBhIG1hbmFnZXIgaXMgbm90IGZvdW5kIGEgbmV3IFJlbGF0ZWQgVmlldyBNYW5hZ2VyIGlzIGNyZWF0ZWQgYW5kIHJldHVybmVkLlxyXG4gICAqIEByZXR1cm4ge09iamVjdH0gUmVsYXRlZFZpZXdNYW5hZ2VyXHJcbiAgICovXHJcbiAgZ2V0UmVsYXRlZFZpZXdNYW5hZ2VyOiBmdW5jdGlvbiBnZXRSZWxhdGVkVmlld01hbmFnZXIocmVsYXRlZFZpZXcpIHtcclxuICAgIGlmICghdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzKSB7XHJcbiAgICAgIHRoaXMucmVsYXRlZFZpZXdNYW5hZ2VycyA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGxldCByZWxhdGVkVmlld01hbmFnZXI7XHJcblxyXG4gICAgaWYgKHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vyc1tyZWxhdGVkVmlldy5pZF0pIHtcclxuICAgICAgcmVsYXRlZFZpZXdNYW5hZ2VyID0gdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzW3JlbGF0ZWRWaWV3LmlkXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGNvbnN0IHJlbGF0ZWRWaWV3T3B0aW9ucyA9IHt9O1xyXG4gICAgICBsYW5nLm1peGluKHJlbGF0ZWRWaWV3T3B0aW9ucywgcmVsYXRlZFZpZXcpO1xyXG5cclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgICBpZDogcmVsYXRlZFZpZXcuaWQsXHJcbiAgICAgICAgcmVsYXRlZFZpZXdDb25maWc6IHJlbGF0ZWRWaWV3T3B0aW9ucyxcclxuICAgICAgfTtcclxuICAgICAgcmVsYXRlZFZpZXdNYW5hZ2VyID0gbmV3IFJlbGF0ZWRWaWV3TWFuYWdlcihvcHRpb25zKTtcclxuICAgICAgdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzW3JlbGF0ZWRWaWV3LmlkXSA9IHJlbGF0ZWRWaWV3TWFuYWdlcjtcclxuICAgIH1cclxuICAgIHJldHVybiByZWxhdGVkVmlld01hbmFnZXI7XHJcbiAgfSxcclxuICBvblByb2Nlc3NSZWxhdGVkVmlld3M6IGZ1bmN0aW9uIG9uUHJvY2Vzc1JlbGF0ZWRWaWV3cyhyZWxhdGVkVmlldywgcm93Tm9kZSwgZW50cnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICh0eXBlb2YgcmVsYXRlZFZpZXcuZW5hYmxlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZWxhdGVkVmlldy5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlbGF0ZWRWaWV3LmVuYWJsZWQpIHtcclxuICAgICAgICBjb25zdCByZWxhdGVkVmlld01hbmFnZXIgPSB0aGlzLmdldFJlbGF0ZWRWaWV3TWFuYWdlcihyZWxhdGVkVmlldyk7XHJcbiAgICAgICAgaWYgKHJlbGF0ZWRWaWV3TWFuYWdlcikge1xyXG4gICAgICAgICAgcmVsYXRlZFZpZXdNYW5hZ2VyLmFkZFZpZXcoZW50cnksIHJvd05vZGUsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHByb2Nlc3NpbmcgcmVsYXRlZCB2aWV3OicgKyBlcnJvcik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqICBEZXN0cm95cyBhbGwgb2YgdGhlIHJlbGF0ZWQgdmlldyB3aWRnZXRzLCB0aGF0IHdhcyBhZGRlZC5cclxuICAgKi9cclxuICBkZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzOiBmdW5jdGlvbiBkZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzKCkge1xyXG4gICAgaWYgKHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycykge1xyXG4gICAgICBmb3IgKGNvbnN0IHJlbGF0ZWRWaWV3SWQgaW4gdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycy5oYXNPd25Qcm9wZXJ0eShyZWxhdGVkVmlld0lkKSkge1xyXG4gICAgICAgICAgdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzW3JlbGF0ZWRWaWV3SWRdLmRlc3Ryb3lWaWV3cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyBkaWppdCBXaWRnZXQgdG8gZGVzdHJveSB0aGUgc2VhcmNoIHdpZGdldCBiZWZvcmUgZGVzdHJveWluZyB0aGUgdmlldy5cclxuICAgKi9cclxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5kZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzKCk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbn0pO1xyXG5leHBvcnQgZGVmYXVsdCBfX2NsYXNzO1xyXG4iXX0=