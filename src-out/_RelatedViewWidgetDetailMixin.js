define('argos/_RelatedViewWidgetDetailMixin', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', './RelatedViewManager'], function (module, exports, _declare, _lang, _RelatedViewManager) {
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
   * @class argos._RelatedViewWidgetDetailMixin
   */
  var __class = (0, _declare2.default)('argos._RelatedViewWidgetDetailMixin', null, /** @lends argos._RelatedViewWidgetDetailMixin# */{
    cls: null,
    /**
     * @property {Simplate}
     * HTML that is used for detail layout items that point to imbeaded related views, displayed related view widget
     *
     * * `$` => detail layout row
     * * `$$` => view instance
     */
    relatedContentViewsTemplate: new Simplate(['<li class="related-view-detail-content {%= $.cls %}">', '<li id="related-content-views"></li>', '</li>']),
    contextSnapShotTemplate: new Simplate(['<h4>{%: $["$descriptor"] %}</h4>']),
    createRowNode: function createRowNode(layout, sectionNode, entry, template, data) {
      var rowNode = void 0;
      if (layout.relatedView) {
        rowNode = $('#related-content-views', sectionNode)[0];
        if (!rowNode) {
          rowNode = $(this.relatedContentViewsTemplate.apply(data, this))[0];
          $(sectionNode).append(rowNode);
        }

        var docfrag = document.createDocumentFragment();
        $(docfrag).append(rowNode);
        this.onProcessRelatedViews(layout.relatedView, rowNode, entry);
        if (docfrag.childNodes.length > 0) {
          $(sectionNode).append(docfrag);
        }
      } else {
        rowNode = this.inherited(createRowNode, arguments);
      }

      return rowNode;
    },
    getRelatedViewId: function getRelatedViewId(relatedView) {
      return this.id + '_' + relatedView.id;
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
        relatedView.id = this.getRelatedViewId(relatedView);
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
    },
    requestData: function requestData() {
      this.destroyRelatedViewWidgets();
      this.inherited(requestData, arguments);
    },
    /**
     * Returns a rendered html snap shot of the entry.
     */
    getContextSnapShot: function getContextSnapShot() {
      var entry = this.entry;
      var snapShot = void 0;
      if (entry) {
        snapShot = this.contextSnapShotTemplate.apply(entry, this);
      }
      return snapShot;
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9fUmVsYXRlZFZpZXdXaWRnZXREZXRhaWxNaXhpbi5qcyJdLCJuYW1lcyI6WyJfX2NsYXNzIiwiY2xzIiwicmVsYXRlZENvbnRlbnRWaWV3c1RlbXBsYXRlIiwiU2ltcGxhdGUiLCJjb250ZXh0U25hcFNob3RUZW1wbGF0ZSIsImNyZWF0ZVJvd05vZGUiLCJsYXlvdXQiLCJzZWN0aW9uTm9kZSIsImVudHJ5IiwidGVtcGxhdGUiLCJkYXRhIiwicm93Tm9kZSIsInJlbGF0ZWRWaWV3IiwiJCIsImFwcGx5IiwiYXBwZW5kIiwiZG9jZnJhZyIsImRvY3VtZW50IiwiY3JlYXRlRG9jdW1lbnRGcmFnbWVudCIsIm9uUHJvY2Vzc1JlbGF0ZWRWaWV3cyIsImNoaWxkTm9kZXMiLCJsZW5ndGgiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJnZXRSZWxhdGVkVmlld0lkIiwiaWQiLCJnZXRSZWxhdGVkVmlld01hbmFnZXIiLCJyZWxhdGVkVmlld01hbmFnZXJzIiwicmVsYXRlZFZpZXdNYW5hZ2VyIiwicmVsYXRlZFZpZXdPcHRpb25zIiwibWl4aW4iLCJvcHRpb25zIiwicmVsYXRlZFZpZXdDb25maWciLCJlbmFibGVkIiwiYWRkVmlldyIsImVycm9yIiwiY29uc29sZSIsImxvZyIsImRlc3Ryb3lSZWxhdGVkVmlld1dpZGdldHMiLCJyZWxhdGVkVmlld0lkIiwiaGFzT3duUHJvcGVydHkiLCJkZXN0cm95Vmlld3MiLCJkZXN0cm95IiwicmVxdWVzdERhdGEiLCJnZXRDb250ZXh0U25hcFNob3QiLCJzbmFwU2hvdCJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkE7OztBQUdBLE1BQU1BLFVBQVUsdUJBQVEscUNBQVIsRUFBK0MsSUFBL0MsRUFBcUQsa0RBQWtEO0FBQ3JIQyxTQUFLLElBRGdIO0FBRXJIOzs7Ozs7O0FBT0FDLGlDQUE2QixJQUFJQyxRQUFKLENBQWEsQ0FDeEMsdURBRHdDLEVBRXhDLHNDQUZ3QyxFQUd4QyxPQUh3QyxD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UCxFQUFjO0FBQ2RDLGdCQUFRQyxHQUFSLENBQVksbUNBQW1DRixLQUEvQyxFQURjLENBQ3lDO0FBQ3hEO0FBQ0YsS0FwRm9IO0FBcUZySDs7O0FBR0FHLCtCQUEyQixTQUFTQSx5QkFBVCxHQUFxQztBQUM5RCxVQUFJLEtBQUtYLG1CQUFULEVBQThCO0FBQzVCLGFBQUssSUFBTVksYUFBWCxJQUE0QixLQUFLWixtQkFBakMsRUFBc0Q7QUFDcEQsY0FBSSxLQUFLQSxtQkFBTCxDQUF5QmEsY0FBekIsQ0FBd0NELGFBQXhDLENBQUosRUFBNEQ7QUFDMUQsaUJBQUtaLG1CQUFMLENBQXlCWSxhQUF6QixFQUF3Q0UsWUFBeEM7QUFDRDtBQUNGO0FBQ0Y7QUFDRixLQWhHb0g7QUFpR3JIOzs7QUFHQUMsYUFBUyxTQUFTQSxPQUFULEdBQW1CO0FBQzFCLFdBQUtKLHlCQUFMO0FBQ0EsV0FBS2hCLFNBQUwsQ0FBZW9CLE9BQWYsRUFBd0JuQixTQUF4QjtBQUNELEtBdkdvSDtBQXdHckhvQixpQkFBYSxTQUFTQSxXQUFULEdBQXVCO0FBQ2xDLFdBQUtMLHlCQUFMO0FBQ0EsV0FBS2hCLFNBQUwsQ0FBZXFCLFdBQWYsRUFBNEJwQixTQUE1QjtBQUNELEtBM0dvSDtBQTRHckg7OztBQUdBcUIsd0JBQW9CLFNBQVNBLGtCQUFULEdBQThCO0FBQ2hELFVBQU1wQyxRQUFRLEtBQUtBLEtBQW5CO0FBQ0EsVUFBSXFDLGlCQUFKO0FBQ0EsVUFBSXJDLEtBQUosRUFBVztBQUNUcUMsbUJBQVcsS0FBS3pDLHVCQUFMLENBQTZCVSxLQUE3QixDQUFtQ04sS0FBbkMsRUFBMEMsSUFBMUMsQ0FBWDtBQUNEO0FBQ0QsYUFBT3FDLFFBQVA7QUFDRDtBQXRIb0gsR0FBdkcsQ0FBaEIsQyxDQXRCQTs7Ozs7Ozs7Ozs7Ozs7O29CQThJZTdDLE8iLCJmaWxlIjoiX1JlbGF0ZWRWaWV3V2lkZ2V0RGV0YWlsTWl4aW4uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgbGFuZyBmcm9tICdkb2pvL19iYXNlL2xhbmcnO1xyXG5pbXBvcnQgUmVsYXRlZFZpZXdNYW5hZ2VyIGZyb20gJy4vUmVsYXRlZFZpZXdNYW5hZ2VyJztcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuX1JlbGF0ZWRWaWV3V2lkZ2V0RGV0YWlsTWl4aW5cclxuICovXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5fUmVsYXRlZFZpZXdXaWRnZXREZXRhaWxNaXhpbicsIG51bGwsIC8qKiBAbGVuZHMgYXJnb3MuX1JlbGF0ZWRWaWV3V2lkZ2V0RGV0YWlsTWl4aW4jICove1xyXG4gIGNsczogbnVsbCxcclxuICAvKipcclxuICAgKiBAcHJvcGVydHkge1NpbXBsYXRlfVxyXG4gICAqIEhUTUwgdGhhdCBpcyB1c2VkIGZvciBkZXRhaWwgbGF5b3V0IGl0ZW1zIHRoYXQgcG9pbnQgdG8gaW1iZWFkZWQgcmVsYXRlZCB2aWV3cywgZGlzcGxheWVkIHJlbGF0ZWQgdmlldyB3aWRnZXRcclxuICAgKlxyXG4gICAqICogYCRgID0+IGRldGFpbCBsYXlvdXQgcm93XHJcbiAgICogKiBgJCRgID0+IHZpZXcgaW5zdGFuY2VcclxuICAgKi9cclxuICByZWxhdGVkQ29udGVudFZpZXdzVGVtcGxhdGU6IG5ldyBTaW1wbGF0ZShbXHJcbiAgICAnPGxpIGNsYXNzPVwicmVsYXRlZC12aWV3LWRldGFpbC1jb250ZW50IHslPSAkLmNscyAlfVwiPicsXHJcbiAgICAnPGxpIGlkPVwicmVsYXRlZC1jb250ZW50LXZpZXdzXCI+PC9saT4nLFxyXG4gICAgJzwvbGk+JyxcclxuICBdKSxcclxuICBjb250ZXh0U25hcFNob3RUZW1wbGF0ZTogbmV3IFNpbXBsYXRlKFtcclxuICAgICc8aDQ+eyU6ICRbXCIkZGVzY3JpcHRvclwiXSAlfTwvaDQ+JyxcclxuICBdKSxcclxuICBjcmVhdGVSb3dOb2RlOiBmdW5jdGlvbiBjcmVhdGVSb3dOb2RlKGxheW91dCwgc2VjdGlvbk5vZGUsIGVudHJ5LCB0ZW1wbGF0ZSwgZGF0YSkge1xyXG4gICAgbGV0IHJvd05vZGU7XHJcbiAgICBpZiAobGF5b3V0LnJlbGF0ZWRWaWV3KSB7XHJcbiAgICAgIHJvd05vZGUgPSAkKCcjcmVsYXRlZC1jb250ZW50LXZpZXdzJywgc2VjdGlvbk5vZGUpWzBdO1xyXG4gICAgICBpZiAoIXJvd05vZGUpIHtcclxuICAgICAgICByb3dOb2RlID0gJCh0aGlzLnJlbGF0ZWRDb250ZW50Vmlld3NUZW1wbGF0ZS5hcHBseShkYXRhLCB0aGlzKSlbMF07XHJcbiAgICAgICAgJChzZWN0aW9uTm9kZSkuYXBwZW5kKHJvd05vZGUpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBjb25zdCBkb2NmcmFnID0gZG9jdW1lbnQuY3JlYXRlRG9jdW1lbnRGcmFnbWVudCgpO1xyXG4gICAgICAkKGRvY2ZyYWcpLmFwcGVuZChyb3dOb2RlKTtcclxuICAgICAgdGhpcy5vblByb2Nlc3NSZWxhdGVkVmlld3MobGF5b3V0LnJlbGF0ZWRWaWV3LCByb3dOb2RlLCBlbnRyeSk7XHJcbiAgICAgIGlmIChkb2NmcmFnLmNoaWxkTm9kZXMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICQoc2VjdGlvbk5vZGUpLmFwcGVuZChkb2NmcmFnKTtcclxuICAgICAgfVxyXG4gICAgfSBlbHNlIHtcclxuICAgICAgcm93Tm9kZSA9IHRoaXMuaW5oZXJpdGVkKGNyZWF0ZVJvd05vZGUsIGFyZ3VtZW50cyk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHJvd05vZGU7XHJcbiAgfSxcclxuICBnZXRSZWxhdGVkVmlld0lkOiBmdW5jdGlvbiBnZXRSZWxhdGVkVmlld0lkKHJlbGF0ZWRWaWV3KSB7XHJcbiAgICByZXR1cm4gYCR7dGhpcy5pZH1fJHtyZWxhdGVkVmlldy5pZH1gO1xyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgcmVsYXRlZCB2aWV3IG1hbmFnZXIgZm9yIGEgcmVsYXRlZCB2aWV3IGRlZmluaXRpb24uXHJcbiAgICogSWYgYSBtYW5hZ2VyIGlzIG5vdCBmb3VuZCBhIG5ldyBSZWxhdGVkIFZpZXcgTWFuYWdlciBpcyBjcmVhdGVkIGFuZCByZXR1cm5lZC5cclxuICAgKiBAcmV0dXJuIHtPYmplY3R9IFJlbGF0ZWRWaWV3TWFuYWdlclxyXG4gICAqL1xyXG4gIGdldFJlbGF0ZWRWaWV3TWFuYWdlcjogZnVuY3Rpb24gZ2V0UmVsYXRlZFZpZXdNYW5hZ2VyKHJlbGF0ZWRWaWV3KSB7XHJcbiAgICBpZiAoIXRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycykge1xyXG4gICAgICB0aGlzLnJlbGF0ZWRWaWV3TWFuYWdlcnMgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICBsZXQgcmVsYXRlZFZpZXdNYW5hZ2VyO1xyXG4gICAgaWYgKHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vyc1tyZWxhdGVkVmlldy5pZF0pIHtcclxuICAgICAgcmVsYXRlZFZpZXdNYW5hZ2VyID0gdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzW3JlbGF0ZWRWaWV3LmlkXTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJlbGF0ZWRWaWV3LmlkID0gdGhpcy5nZXRSZWxhdGVkVmlld0lkKHJlbGF0ZWRWaWV3KTtcclxuICAgICAgY29uc3QgcmVsYXRlZFZpZXdPcHRpb25zID0ge307XHJcbiAgICAgIGxhbmcubWl4aW4ocmVsYXRlZFZpZXdPcHRpb25zLCByZWxhdGVkVmlldyk7XHJcblxyXG4gICAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICAgIGlkOiByZWxhdGVkVmlldy5pZCxcclxuICAgICAgICByZWxhdGVkVmlld0NvbmZpZzogcmVsYXRlZFZpZXdPcHRpb25zLFxyXG4gICAgICB9O1xyXG4gICAgICByZWxhdGVkVmlld01hbmFnZXIgPSBuZXcgUmVsYXRlZFZpZXdNYW5hZ2VyKG9wdGlvbnMpO1xyXG4gICAgICB0aGlzLnJlbGF0ZWRWaWV3TWFuYWdlcnNbcmVsYXRlZFZpZXcuaWRdID0gcmVsYXRlZFZpZXdNYW5hZ2VyO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiByZWxhdGVkVmlld01hbmFnZXI7XHJcbiAgfSxcclxuICBvblByb2Nlc3NSZWxhdGVkVmlld3M6IGZ1bmN0aW9uIG9uUHJvY2Vzc1JlbGF0ZWRWaWV3cyhyZWxhdGVkVmlldywgcm93Tm9kZSwgZW50cnkpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmICh0eXBlb2YgcmVsYXRlZFZpZXcuZW5hYmxlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICByZWxhdGVkVmlldy5lbmFibGVkID0gdHJ1ZTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKHJlbGF0ZWRWaWV3LmVuYWJsZWQpIHtcclxuICAgICAgICBjb25zdCByZWxhdGVkVmlld01hbmFnZXIgPSB0aGlzLmdldFJlbGF0ZWRWaWV3TWFuYWdlcihyZWxhdGVkVmlldyk7XHJcbiAgICAgICAgaWYgKHJlbGF0ZWRWaWV3TWFuYWdlcikge1xyXG4gICAgICAgICAgcmVsYXRlZFZpZXdNYW5hZ2VyLmFkZFZpZXcoZW50cnksIHJvd05vZGUsIHRoaXMpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcclxuICAgICAgY29uc29sZS5sb2coJ0Vycm9yIHByb2Nlc3NpbmcgcmVsYXRlZCB2aWV3OicgKyBlcnJvcik7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIH1cclxuICB9LFxyXG4gIC8qKlxyXG4gICAqICBEZXN0cm95cyBhbGwgb2YgdGhlIHJlbGF0ZWQgdmlldyB3aWRnZXRzLCB0aGF0IHdhcyBhZGRlZC5cclxuICAgKi9cclxuICBkZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzOiBmdW5jdGlvbiBkZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzKCkge1xyXG4gICAgaWYgKHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycykge1xyXG4gICAgICBmb3IgKGNvbnN0IHJlbGF0ZWRWaWV3SWQgaW4gdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMucmVsYXRlZFZpZXdNYW5hZ2Vycy5oYXNPd25Qcm9wZXJ0eShyZWxhdGVkVmlld0lkKSkge1xyXG4gICAgICAgICAgdGhpcy5yZWxhdGVkVmlld01hbmFnZXJzW3JlbGF0ZWRWaWV3SWRdLmRlc3Ryb3lWaWV3cygpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgLyoqXHJcbiAgICogRXh0ZW5kcyBkaWppdCBXaWRnZXQgdG8gZGVzdHJveSB0aGUgc2VhcmNoIHdpZGdldCBiZWZvcmUgZGVzdHJveWluZyB0aGUgdmlldy5cclxuICAgKi9cclxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xyXG4gICAgdGhpcy5kZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzKCk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChkZXN0cm95LCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgcmVxdWVzdERhdGE6IGZ1bmN0aW9uIHJlcXVlc3REYXRhKCkge1xyXG4gICAgdGhpcy5kZXN0cm95UmVsYXRlZFZpZXdXaWRnZXRzKCk7XHJcbiAgICB0aGlzLmluaGVyaXRlZChyZXF1ZXN0RGF0YSwgYXJndW1lbnRzKTtcclxuICB9LFxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYSByZW5kZXJlZCBodG1sIHNuYXAgc2hvdCBvZiB0aGUgZW50cnkuXHJcbiAgICovXHJcbiAgZ2V0Q29udGV4dFNuYXBTaG90OiBmdW5jdGlvbiBnZXRDb250ZXh0U25hcFNob3QoKSB7XHJcbiAgICBjb25zdCBlbnRyeSA9IHRoaXMuZW50cnk7XHJcbiAgICBsZXQgc25hcFNob3Q7XHJcbiAgICBpZiAoZW50cnkpIHtcclxuICAgICAgc25hcFNob3QgPSB0aGlzLmNvbnRleHRTbmFwU2hvdFRlbXBsYXRlLmFwcGx5KGVudHJ5LCB0aGlzKTtcclxuICAgIH1cclxuICAgIHJldHVybiBzbmFwU2hvdDtcclxuICB9LFxyXG59KTtcclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19