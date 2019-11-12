define('argos/RelatedViewManager', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', './_RelatedViewWidgetBase'], function (module, exports, _declare, _lang, _RelatedViewWidgetBase) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _RelatedViewWidgetBase2 = _interopRequireDefault(_RelatedViewWidgetBase);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _widgetTypes = {}; /* Copyright 2017 Infor
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

  var __class = (0, _declare2.default)('argos.RelatedViewManager', null, {
    id: 'relatedViewManager',
    relatedViews: null,
    relatedViewConfig: null,
    widgetTypes: _widgetTypes,
    enabled: true,
    constructor: function constructor(options) {
      this.relatedViews = {};
      _lang2.default.mixin(this, options);
      this.registerType('default', _RelatedViewWidgetBase2.default);
    },
    destroyViews: function destroyViews() {
      for (var relatedViewId in this.relatedViews) {
        if (this.relatedViews.hasOwnProperty(relatedViewId)) {
          this.relatedViews[relatedViewId].destroy();
        }
      }

      this.relatedViews = {};
    },
    registerType: function registerType(widgetTypeName, ctor) {
      this.widgetTypes[widgetTypeName] = ctor;
    },
    getWidgetType: function getWidgetType(widgetTypeName) {
      var widgetType = this.widgetTypes[widgetTypeName];
      if (!widgetType) {
        widgetType = _RelatedViewWidgetBase2.default;
      }
      return widgetType;
    },
    addView: function addView(entry, contentNode, owner) {
      try {
        if (contentNode) {
          if (this.enabled) {
            var options = {};
            if (!this.relatedViewConfig.widgetType) {
              this.relatedViewConfig.widgetType = _RelatedViewWidgetBase2.default;
            }
            if (typeof this.relatedViewConfig.widgetType === 'string') {
              this.relatedViewConfig.widgetType = this.getWidgetType(this.relatedViewConfig.widgetType);
            }
            _lang2.default.mixin(options, this.relatedViewConfig);
            options.id = this.id + '_' + entry.$key;
            var relatedViewWidget = new this.relatedViewConfig.widgetType(options); //eslint-disable-line
            relatedViewWidget.parentEntry = entry;
            relatedViewWidget.parentResourceKind = owner.resourceKind;
            relatedViewWidget.owner = owner;
            relatedViewWidget.parentNode = contentNode;
            this.relatedViews[relatedViewWidget.id] = relatedViewWidget;
            relatedViewWidget.onInit();
            $(contentNode).append($(relatedViewWidget.domNode));
          }
        }
      } catch (error) {
        console.log('Error adding related view widgets:' + error); //eslint-disable-line
      }
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9SZWxhdGVkVmlld01hbmFnZXIuanMiXSwibmFtZXMiOlsiX3dpZGdldFR5cGVzIiwiX19jbGFzcyIsImlkIiwicmVsYXRlZFZpZXdzIiwicmVsYXRlZFZpZXdDb25maWciLCJ3aWRnZXRUeXBlcyIsImVuYWJsZWQiLCJjb25zdHJ1Y3RvciIsIm9wdGlvbnMiLCJtaXhpbiIsInJlZ2lzdGVyVHlwZSIsImRlc3Ryb3lWaWV3cyIsInJlbGF0ZWRWaWV3SWQiLCJoYXNPd25Qcm9wZXJ0eSIsImRlc3Ryb3kiLCJ3aWRnZXRUeXBlTmFtZSIsImN0b3IiLCJnZXRXaWRnZXRUeXBlIiwid2lkZ2V0VHlwZSIsImFkZFZpZXciLCJlbnRyeSIsImNvbnRlbnROb2RlIiwib3duZXIiLCIka2V5IiwicmVsYXRlZFZpZXdXaWRnZXQiLCJwYXJlbnRFbnRyeSIsInBhcmVudFJlc291cmNlS2luZCIsInJlc291cmNlS2luZCIsInBhcmVudE5vZGUiLCJvbkluaXQiLCIkIiwiYXBwZW5kIiwiZG9tTm9kZSIsImVycm9yIiwiY29uc29sZSIsImxvZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFtQkEsTUFBTUEsZUFBZSxFQUFyQixDLENBbkJBOzs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTUMsVUFBVSx1QkFBUSwwQkFBUixFQUFvQyxJQUFwQyxFQUEwQztBQUN4REMsUUFBSSxvQkFEb0Q7QUFFeERDLGtCQUFjLElBRjBDO0FBR3hEQyx1QkFBbUIsSUFIcUM7QUFJeERDLGlCQUFhTCxZQUoyQztBQUt4RE0sYUFBUyxJQUwrQztBQU14REMsaUJBQWEsU0FBU0EsV0FBVCxDQUFxQkMsT0FBckIsRUFBOEI7QUFDekMsV0FBS0wsWUFBTCxHQUFvQixFQUFwQjtBQUNBLHFCQUFLTSxLQUFMLENBQVcsSUFBWCxFQUFpQkQsT0FBakI7QUFDQSxXQUFLRSxZQUFMLENBQWtCLFNBQWxCO0FBQ0QsS0FWdUQ7QUFXeERDLGtCQUFjLFNBQVNBLFlBQVQsR0FBd0I7QUFDcEMsV0FBSyxJQUFNQyxhQUFYLElBQTRCLEtBQUtULFlBQWpDLEVBQStDO0FBQzdDLFlBQUksS0FBS0EsWUFBTCxDQUFrQlUsY0FBbEIsQ0FBaUNELGFBQWpDLENBQUosRUFBcUQ7QUFDbkQsZUFBS1QsWUFBTCxDQUFrQlMsYUFBbEIsRUFBaUNFLE9BQWpDO0FBQ0Q7QUFDRjs7QUFFRCxXQUFLWCxZQUFMLEdBQW9CLEVBQXBCO0FBQ0QsS0FuQnVEO0FBb0J4RE8sa0JBQWMsU0FBU0EsWUFBVCxDQUFzQkssY0FBdEIsRUFBc0NDLElBQXRDLEVBQTRDO0FBQ3hELFdBQUtYLFdBQUwsQ0FBaUJVLGNBQWpCLElBQW1DQyxJQUFuQztBQUNELEtBdEJ1RDtBQXVCeERDLG1CQUFlLFNBQVNBLGFBQVQsQ0FBdUJGLGNBQXZCLEVBQXVDO0FBQ3BELFVBQUlHLGFBQWEsS0FBS2IsV0FBTCxDQUFpQlUsY0FBakIsQ0FBakI7QUFDQSxVQUFJLENBQUNHLFVBQUwsRUFBaUI7QUFDZkE7QUFDRDtBQUNELGFBQU9BLFVBQVA7QUFDRCxLQTdCdUQ7QUE4QnhEQyxhQUFTLFNBQVNBLE9BQVQsQ0FBaUJDLEtBQWpCLEVBQXdCQyxXQUF4QixFQUFxQ0MsS0FBckMsRUFBNEM7QUFDbkQsVUFBSTtBQUNGLFlBQUlELFdBQUosRUFBaUI7QUFDZixjQUFJLEtBQUtmLE9BQVQsRUFBa0I7QUFDaEIsZ0JBQU1FLFVBQVUsRUFBaEI7QUFDQSxnQkFBSSxDQUFDLEtBQUtKLGlCQUFMLENBQXVCYyxVQUE1QixFQUF3QztBQUN0QyxtQkFBS2QsaUJBQUwsQ0FBdUJjLFVBQXZCO0FBQ0Q7QUFDRCxnQkFBSSxPQUFPLEtBQUtkLGlCQUFMLENBQXVCYyxVQUE5QixLQUE2QyxRQUFqRCxFQUEyRDtBQUN6RCxtQkFBS2QsaUJBQUwsQ0FBdUJjLFVBQXZCLEdBQW9DLEtBQUtELGFBQUwsQ0FBbUIsS0FBS2IsaUJBQUwsQ0FBdUJjLFVBQTFDLENBQXBDO0FBQ0Q7QUFDRCwyQkFBS1QsS0FBTCxDQUFXRCxPQUFYLEVBQW9CLEtBQUtKLGlCQUF6QjtBQUNBSSxvQkFBUU4sRUFBUixHQUFnQixLQUFLQSxFQUFyQixTQUEyQmtCLE1BQU1HLElBQWpDO0FBQ0EsZ0JBQU1DLG9CQUFvQixJQUFJLEtBQUtwQixpQkFBTCxDQUF1QmMsVUFBM0IsQ0FBc0NWLE9BQXRDLENBQTFCLENBVmdCLENBVXlEO0FBQ3pFZ0IsOEJBQWtCQyxXQUFsQixHQUFnQ0wsS0FBaEM7QUFDQUksOEJBQWtCRSxrQkFBbEIsR0FBdUNKLE1BQU1LLFlBQTdDO0FBQ0FILDhCQUFrQkYsS0FBbEIsR0FBMEJBLEtBQTFCO0FBQ0FFLDhCQUFrQkksVUFBbEIsR0FBK0JQLFdBQS9CO0FBQ0EsaUJBQUtsQixZQUFMLENBQWtCcUIsa0JBQWtCdEIsRUFBcEMsSUFBMENzQixpQkFBMUM7QUFDQUEsOEJBQWtCSyxNQUFsQjtBQUNBQyxjQUFFVCxXQUFGLEVBQWVVLE1BQWYsQ0FBc0JELEVBQUVOLGtCQUFrQlEsT0FBcEIsQ0FBdEI7QUFDRDtBQUNGO0FBQ0YsT0F0QkQsQ0FzQkUsT0FBT0MsS0FBUCxFQUFjO0FBQ2RDLGdCQUFRQyxHQUFSLENBQVksdUNBQXVDRixLQUFuRCxFQURjLENBQzRDO0FBQzNEO0FBQ0Y7QUF4RHVELEdBQTFDLENBQWhCOztvQkEyRGVoQyxPIiwiZmlsZSI6IlJlbGF0ZWRWaWV3TWFuYWdlci5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBsYW5nIGZyb20gJ2Rvam8vX2Jhc2UvbGFuZyc7XHJcbmltcG9ydCBSZWxhdGVkVmlld1dpZGdldCBmcm9tICcuL19SZWxhdGVkVmlld1dpZGdldEJhc2UnO1xyXG5cclxuY29uc3QgX3dpZGdldFR5cGVzID0ge307XHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5SZWxhdGVkVmlld01hbmFnZXInLCBudWxsLCB7XHJcbiAgaWQ6ICdyZWxhdGVkVmlld01hbmFnZXInLFxyXG4gIHJlbGF0ZWRWaWV3czogbnVsbCxcclxuICByZWxhdGVkVmlld0NvbmZpZzogbnVsbCxcclxuICB3aWRnZXRUeXBlczogX3dpZGdldFR5cGVzLFxyXG4gIGVuYWJsZWQ6IHRydWUsXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcclxuICAgIHRoaXMucmVsYXRlZFZpZXdzID0ge307XHJcbiAgICBsYW5nLm1peGluKHRoaXMsIG9wdGlvbnMpO1xyXG4gICAgdGhpcy5yZWdpc3RlclR5cGUoJ2RlZmF1bHQnLCBSZWxhdGVkVmlld1dpZGdldCk7XHJcbiAgfSxcclxuICBkZXN0cm95Vmlld3M6IGZ1bmN0aW9uIGRlc3Ryb3lWaWV3cygpIHtcclxuICAgIGZvciAoY29uc3QgcmVsYXRlZFZpZXdJZCBpbiB0aGlzLnJlbGF0ZWRWaWV3cykge1xyXG4gICAgICBpZiAodGhpcy5yZWxhdGVkVmlld3MuaGFzT3duUHJvcGVydHkocmVsYXRlZFZpZXdJZCkpIHtcclxuICAgICAgICB0aGlzLnJlbGF0ZWRWaWV3c1tyZWxhdGVkVmlld0lkXS5kZXN0cm95KCk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICB0aGlzLnJlbGF0ZWRWaWV3cyA9IHt9O1xyXG4gIH0sXHJcbiAgcmVnaXN0ZXJUeXBlOiBmdW5jdGlvbiByZWdpc3RlclR5cGUod2lkZ2V0VHlwZU5hbWUsIGN0b3IpIHtcclxuICAgIHRoaXMud2lkZ2V0VHlwZXNbd2lkZ2V0VHlwZU5hbWVdID0gY3RvcjtcclxuICB9LFxyXG4gIGdldFdpZGdldFR5cGU6IGZ1bmN0aW9uIGdldFdpZGdldFR5cGUod2lkZ2V0VHlwZU5hbWUpIHtcclxuICAgIGxldCB3aWRnZXRUeXBlID0gdGhpcy53aWRnZXRUeXBlc1t3aWRnZXRUeXBlTmFtZV07XHJcbiAgICBpZiAoIXdpZGdldFR5cGUpIHtcclxuICAgICAgd2lkZ2V0VHlwZSA9IFJlbGF0ZWRWaWV3V2lkZ2V0O1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHdpZGdldFR5cGU7XHJcbiAgfSxcclxuICBhZGRWaWV3OiBmdW5jdGlvbiBhZGRWaWV3KGVudHJ5LCBjb250ZW50Tm9kZSwgb3duZXIpIHtcclxuICAgIHRyeSB7XHJcbiAgICAgIGlmIChjb250ZW50Tm9kZSkge1xyXG4gICAgICAgIGlmICh0aGlzLmVuYWJsZWQpIHtcclxuICAgICAgICAgIGNvbnN0IG9wdGlvbnMgPSB7fTtcclxuICAgICAgICAgIGlmICghdGhpcy5yZWxhdGVkVmlld0NvbmZpZy53aWRnZXRUeXBlKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVsYXRlZFZpZXdDb25maWcud2lkZ2V0VHlwZSA9IFJlbGF0ZWRWaWV3V2lkZ2V0O1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgaWYgKHR5cGVvZiB0aGlzLnJlbGF0ZWRWaWV3Q29uZmlnLndpZGdldFR5cGUgPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIHRoaXMucmVsYXRlZFZpZXdDb25maWcud2lkZ2V0VHlwZSA9IHRoaXMuZ2V0V2lkZ2V0VHlwZSh0aGlzLnJlbGF0ZWRWaWV3Q29uZmlnLndpZGdldFR5cGUpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgbGFuZy5taXhpbihvcHRpb25zLCB0aGlzLnJlbGF0ZWRWaWV3Q29uZmlnKTtcclxuICAgICAgICAgIG9wdGlvbnMuaWQgPSBgJHt0aGlzLmlkfV8ke2VudHJ5LiRrZXl9YDtcclxuICAgICAgICAgIGNvbnN0IHJlbGF0ZWRWaWV3V2lkZ2V0ID0gbmV3IHRoaXMucmVsYXRlZFZpZXdDb25maWcud2lkZ2V0VHlwZShvcHRpb25zKTsvL2VzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgICAgIHJlbGF0ZWRWaWV3V2lkZ2V0LnBhcmVudEVudHJ5ID0gZW50cnk7XHJcbiAgICAgICAgICByZWxhdGVkVmlld1dpZGdldC5wYXJlbnRSZXNvdXJjZUtpbmQgPSBvd25lci5yZXNvdXJjZUtpbmQ7XHJcbiAgICAgICAgICByZWxhdGVkVmlld1dpZGdldC5vd25lciA9IG93bmVyO1xyXG4gICAgICAgICAgcmVsYXRlZFZpZXdXaWRnZXQucGFyZW50Tm9kZSA9IGNvbnRlbnROb2RlO1xyXG4gICAgICAgICAgdGhpcy5yZWxhdGVkVmlld3NbcmVsYXRlZFZpZXdXaWRnZXQuaWRdID0gcmVsYXRlZFZpZXdXaWRnZXQ7XHJcbiAgICAgICAgICByZWxhdGVkVmlld1dpZGdldC5vbkluaXQoKTtcclxuICAgICAgICAgICQoY29udGVudE5vZGUpLmFwcGVuZCgkKHJlbGF0ZWRWaWV3V2lkZ2V0LmRvbU5vZGUpKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XHJcbiAgICAgIGNvbnNvbGUubG9nKCdFcnJvciBhZGRpbmcgcmVsYXRlZCB2aWV3IHdpZGdldHM6JyArIGVycm9yKTsvL2VzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==