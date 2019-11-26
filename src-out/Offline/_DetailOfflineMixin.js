define('argos/Offline/_DetailOfflineMixin', ['module', 'exports', 'dojo/_base/declare', './Manager', '../Dialogs/BusyIndicator', '../ErrorManager', '../I18n'], function (module, exports, _declare, _Manager, _BusyIndicator, _ErrorManager, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Manager2 = _interopRequireDefault(_Manager);

  var _BusyIndicator2 = _interopRequireDefault(_BusyIndicator);

  var _ErrorManager2 = _interopRequireDefault(_ErrorManager);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var resource = (0, _I18n2.default)('_detailOfflineMixin');

  /**
   * @class argos.Offline._DetailOfflineMixin
   * @classdesc A mixin that provides the detail view offline specific methods and properties
   */
  /* Copyright 2015 Infor
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
  exports.default = (0, _declare2.default)('argos.Offline._DetailOfflineMixin', null, {

    createToolLayout: function createToolLayout() {
      if (this.tools) {
        return this.tools;
      }
      var tools = this.inherited(createToolLayout, arguments);
      if (tools && tools.tbar && this.enableOffline && App.enableOfflineSupport) {
        tools.tbar.push({
          id: 'briefCase',
          svg: 'roles',
          title: resource.briefcaseTooltipText,
          action: 'briefCaseEntity',
          security: ''
        });
      }
      return tools;
    },
    briefCaseEntity: function briefCaseEntity(action, selection) {
      var _this = this;

      // eslint-disable-line
      // Start busy indicator modal
      var busyIndicator = this.createBusyModal();

      // Start briefcasing
      var entityName = this.modelName;
      var entityId = this.entry.$key; // thie should be resolved from the model or adapter.
      var options = {
        includeRelated: true,
        viewId: this.id
      };
      _Manager2.default.briefCaseEntity(entityName, entityId, options).then(function (result) {
        // Show complete modal dialog
        var modalPromise = _this.createCompleteDialog(busyIndicator, result);
        modalPromise.then(_this.onEntityBriefcased.bind(_this));
      }, function (error) {
        _ErrorManager2.default.addSimpleError(resource.errorBriefcasingText + ' ' + _this.id, error);
        _this.createAlertDialog(busyIndicator);
      });
    },
    createAlertDialog: function createAlertDialog(busyIndicator) {
      App.modal.disableClose = false;
      App.modal.showToolbar = true;
      busyIndicator.complete(true);
      App.modal.resolveDeferred(true);
      // Attach resolve to move to briefcase list (if user hits okay)
      return App.modal.createSimpleDialog({ title: 'alert', content: resource.interruptedText, getContent: function getContent() {
          return;
        }, leftButton: 'cancel', rightButton: 'confirm' });
    },
    createBusyModal: function createBusyModal() {
      App.modal.disableClose = true;
      App.modal.showToolbar = false;
      var busyIndicator = new _BusyIndicator2.default({
        id: 'busyIndicator__offline-list-briefcase',
        label: resource.briefcasingText
      });
      App.modal.add(busyIndicator);
      busyIndicator.start();
      return busyIndicator;
    },
    createCompleteDialog: function createCompleteDialog(busyIndicator) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      App.modal.disableClose = false;
      App.modal.showToolbar = true;
      busyIndicator.complete(true);
      App.modal.resolveDeferred(true);
      // Attach resolve to move to briefcase list (if user hits okay)
      return App.modal.createSimpleDialog({ title: 'complete', content: resource.goToDetailViewText, getContent: function getContent() {
          return result;
        }, leftButton: 'cancel', rightButton: 'okay' });
    },
    onContentChange: function onContentChange() {
      if (this.enableOffline) {
        this.saveOffline();
      }
    },
    show: function show() {
      this.inherited(show, arguments);
      // Check if we are coming back to a previously fetched entry.
      // refreshRequired is an indication we are switching to a new entry and
      // this.entry will be stale.
      if (!this.refreshRequired && this.entry && this.enableOffline) {
        this.saveOffline();
      }
    },
    saveOffline: function saveOffline() {
      if (App.enableOfflineSupport) {
        _Manager2.default.saveDetailView(this).then(function () {}, function err(error) {
          _ErrorManager2.default.addSimpleError(resource.errorSavingOfflineViewText + ' ' + this.id, error);
        });
      }
    },
    getOfflineDescription: function getOfflineDescription() {
      return this.entry.$descriptor;
    },
    getOfflineIcon: function getOfflineIcon() {
      var model = this.getModel();
      return model.getIconClass();
    },
    onEntityBriefcased: function onEntityBriefcased() {
      var view = this.app.getView('briefcase_list');
      if (view) {
        view.show({});
      }
    }
  });
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9PZmZsaW5lL19EZXRhaWxPZmZsaW5lTWl4aW4uanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJjcmVhdGVUb29sTGF5b3V0IiwidG9vbHMiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJ0YmFyIiwiZW5hYmxlT2ZmbGluZSIsIkFwcCIsImVuYWJsZU9mZmxpbmVTdXBwb3J0IiwicHVzaCIsImlkIiwic3ZnIiwidGl0bGUiLCJicmllZmNhc2VUb29sdGlwVGV4dCIsImFjdGlvbiIsInNlY3VyaXR5IiwiYnJpZWZDYXNlRW50aXR5Iiwic2VsZWN0aW9uIiwiYnVzeUluZGljYXRvciIsImNyZWF0ZUJ1c3lNb2RhbCIsImVudGl0eU5hbWUiLCJtb2RlbE5hbWUiLCJlbnRpdHlJZCIsImVudHJ5IiwiJGtleSIsIm9wdGlvbnMiLCJpbmNsdWRlUmVsYXRlZCIsInZpZXdJZCIsInRoZW4iLCJyZXN1bHQiLCJtb2RhbFByb21pc2UiLCJjcmVhdGVDb21wbGV0ZURpYWxvZyIsIm9uRW50aXR5QnJpZWZjYXNlZCIsImJpbmQiLCJlcnJvciIsImFkZFNpbXBsZUVycm9yIiwiZXJyb3JCcmllZmNhc2luZ1RleHQiLCJjcmVhdGVBbGVydERpYWxvZyIsIm1vZGFsIiwiZGlzYWJsZUNsb3NlIiwic2hvd1Rvb2xiYXIiLCJjb21wbGV0ZSIsInJlc29sdmVEZWZlcnJlZCIsImNyZWF0ZVNpbXBsZURpYWxvZyIsImNvbnRlbnQiLCJpbnRlcnJ1cHRlZFRleHQiLCJnZXRDb250ZW50IiwibGVmdEJ1dHRvbiIsInJpZ2h0QnV0dG9uIiwibGFiZWwiLCJicmllZmNhc2luZ1RleHQiLCJhZGQiLCJzdGFydCIsImdvVG9EZXRhaWxWaWV3VGV4dCIsIm9uQ29udGVudENoYW5nZSIsInNhdmVPZmZsaW5lIiwic2hvdyIsInJlZnJlc2hSZXF1aXJlZCIsInNhdmVEZXRhaWxWaWV3IiwiZXJyIiwiZXJyb3JTYXZpbmdPZmZsaW5lVmlld1RleHQiLCJnZXRPZmZsaW5lRGVzY3JpcHRpb24iLCIkZGVzY3JpcHRvciIsImdldE9mZmxpbmVJY29uIiwibW9kZWwiLCJnZXRNb2RlbCIsImdldEljb25DbGFzcyIsInZpZXciLCJhcHAiLCJnZXRWaWV3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTUEsV0FBVyxvQkFBWSxxQkFBWixDQUFqQjs7QUFHQTs7OztBQXZCQTs7Ozs7Ozs7Ozs7Ozs7b0JBMkJlLHVCQUFRLG1DQUFSLEVBQTZDLElBQTdDLEVBQW1EOztBQUVoRUMsc0JBQWtCLFNBQVNBLGdCQUFULEdBQTRCO0FBQzVDLFVBQUksS0FBS0MsS0FBVCxFQUFnQjtBQUNkLGVBQU8sS0FBS0EsS0FBWjtBQUNEO0FBQ0QsVUFBTUEsUUFBUSxLQUFLQyxTQUFMLENBQWVGLGdCQUFmLEVBQWlDRyxTQUFqQyxDQUFkO0FBQ0EsVUFBSUYsU0FBU0EsTUFBTUcsSUFBZixJQUF1QixLQUFLQyxhQUE1QixJQUE2Q0MsSUFBSUMsb0JBQXJELEVBQTJFO0FBQ3pFTixjQUFNRyxJQUFOLENBQVdJLElBQVgsQ0FBZ0I7QUFDZEMsY0FBSSxXQURVO0FBRWRDLGVBQUssT0FGUztBQUdkQyxpQkFBT1osU0FBU2Esb0JBSEY7QUFJZEMsa0JBQVEsaUJBSk07QUFLZEMsb0JBQVU7QUFMSSxTQUFoQjtBQU9EO0FBQ0QsYUFBT2IsS0FBUDtBQUNELEtBakIrRDtBQWtCaEVjLHFCQUFpQixTQUFTQSxlQUFULENBQXlCRixNQUF6QixFQUFpQ0csU0FBakMsRUFBNEM7QUFBQTs7QUFBRTtBQUM3RDtBQUNBLFVBQU1DLGdCQUFnQixLQUFLQyxlQUFMLEVBQXRCOztBQUVBO0FBQ0EsVUFBTUMsYUFBYSxLQUFLQyxTQUF4QjtBQUNBLFVBQU1DLFdBQVcsS0FBS0MsS0FBTCxDQUFXQyxJQUE1QixDQU4yRCxDQU16QjtBQUNsQyxVQUFNQyxVQUFVO0FBQ2RDLHdCQUFnQixJQURGO0FBRWRDLGdCQUFRLEtBQUtqQjtBQUZDLE9BQWhCO0FBSUEsd0JBQWVNLGVBQWYsQ0FBK0JJLFVB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b0JBQVIsRUFBOEI7QUFDNUIsMEJBQWVrRCxjQUFmLENBQThCLElBQTlCLEVBQW9DOUIsSUFBcEMsQ0FBeUMsWUFBTSxDQUM5QyxDQURELEVBQ0csU0FBUytCLEdBQVQsQ0FBYXpCLEtBQWIsRUFBb0I7QUFDckIsaUNBQWFDLGNBQWIsQ0FBK0JuQyxTQUFTNEQsMEJBQXhDLFNBQXNFLEtBQUtsRCxFQUEzRSxFQUFpRndCLEtBQWpGO0FBQ0QsU0FIRDtBQUlEO0FBQ0YsS0F0RitEO0FBdUZoRTJCLDJCQUF1QixTQUFTQSxxQkFBVCxHQUFpQztBQUN0RCxhQUFPLEtBQUt0QyxLQUFMLENBQVd1QyxXQUFsQjtBQUNELEtBekYrRDtBQTBGaEVDLG9CQUFnQixTQUFTQSxjQUFULEdBQTBCO0FBQ3hDLFVBQU1DLFFBQVEsS0FBS0MsUUFBTCxFQUFkO0FBQ0EsYUFBT0QsTUFBTUUsWUFBTixFQUFQO0FBQ0QsS0E3RitEO0FBOEZoRWxDLHdCQUFvQixTQUFTQSxrQkFBVCxHQUE4QjtBQUNoRCxVQUFNbUMsT0FBTyxLQUFLQyxHQUFMLENBQVNDLE9BQVQsQ0FBaUIsZ0JBQWpCLENBQWI7QUFDQSxVQUFJRixJQUFKLEVBQVU7QUFDUkEsYUFBS1gsSUFBTCxDQUFVLEVBQVY7QUFDRDtBQUNGO0FBbkcrRCxHQUFuRCxDIiwiZmlsZSI6Il9EZXRhaWxPZmZsaW5lTWl4aW4uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTUgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBPZmZsaW5lTWFuYWdlciBmcm9tICcuL01hbmFnZXInO1xyXG5pbXBvcnQgQnVzeUluZGljYXRvciBmcm9tICcuLi9EaWFsb2dzL0J1c3lJbmRpY2F0b3InO1xyXG5pbXBvcnQgRXJyb3JNYW5hZ2VyIGZyb20gJy4uL0Vycm9yTWFuYWdlcic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuLi9JMThuJztcclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ19kZXRhaWxPZmZsaW5lTWl4aW4nKTtcclxuXHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLk9mZmxpbmUuX0RldGFpbE9mZmxpbmVNaXhpblxyXG4gKiBAY2xhc3NkZXNjIEEgbWl4aW4gdGhhdCBwcm92aWRlcyB0aGUgZGV0YWlsIHZpZXcgb2ZmbGluZSBzcGVjaWZpYyBtZXRob2RzIGFuZCBwcm9wZXJ0aWVzXHJcbiAqL1xyXG5leHBvcnQgZGVmYXVsdCBkZWNsYXJlKCdhcmdvcy5PZmZsaW5lLl9EZXRhaWxPZmZsaW5lTWl4aW4nLCBudWxsLCB7XHJcblxyXG4gIGNyZWF0ZVRvb2xMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZVRvb2xMYXlvdXQoKSB7XHJcbiAgICBpZiAodGhpcy50b29scykge1xyXG4gICAgICByZXR1cm4gdGhpcy50b29scztcclxuICAgIH1cclxuICAgIGNvbnN0IHRvb2xzID0gdGhpcy5pbmhlcml0ZWQoY3JlYXRlVG9vbExheW91dCwgYXJndW1lbnRzKTtcclxuICAgIGlmICh0b29scyAmJiB0b29scy50YmFyICYmIHRoaXMuZW5hYmxlT2ZmbGluZSAmJiBBcHAuZW5hYmxlT2ZmbGluZVN1cHBvcnQpIHtcclxuICAgICAgdG9vbHMudGJhci5wdXNoKHtcclxuICAgICAgICBpZDogJ2JyaWVmQ2FzZScsXHJcbiAgICAgICAgc3ZnOiAncm9sZXMnLFxyXG4gICAgICAgIHRpdGxlOiByZXNvdXJjZS5icmllZmNhc2VUb29sdGlwVGV4dCxcclxuICAgICAgICBhY3Rpb246ICdicmllZkNhc2VFbnRpdHknLFxyXG4gICAgICAgIHNlY3VyaXR5OiAnJyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9vbHM7XHJcbiAgfSxcclxuICBicmllZkNhc2VFbnRpdHk6IGZ1bmN0aW9uIGJyaWVmQ2FzZUVudGl0eShhY3Rpb24sIHNlbGVjdGlvbikgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAvLyBTdGFydCBidXN5IGluZGljYXRvciBtb2RhbFxyXG4gICAgY29uc3QgYnVzeUluZGljYXRvciA9IHRoaXMuY3JlYXRlQnVzeU1vZGFsKCk7XHJcblxyXG4gICAgLy8gU3RhcnQgYnJpZWZjYXNpbmdcclxuICAgIGNvbnN0IGVudGl0eU5hbWUgPSB0aGlzLm1vZGVsTmFtZTtcclxuICAgIGNvbnN0IGVudGl0eUlkID0gdGhpcy5lbnRyeS4ka2V5OyAvLyB0aGllIHNob3VsZCBiZSByZXNvbHZlZCBmcm9tIHRoZSBtb2RlbCBvciBhZGFwdGVyLlxyXG4gICAgY29uc3Qgb3B0aW9ucyA9IHtcclxuICAgICAgaW5jbHVkZVJlbGF0ZWQ6IHRydWUsXHJcbiAgICAgIHZpZXdJZDogdGhpcy5pZCxcclxuICAgIH07XHJcbiAgICBPZmZsaW5lTWFuYWdlci5icmllZkNhc2VFbnRpdHkoZW50aXR5TmFtZSwgZW50aXR5SWQsIG9wdGlvbnMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAvLyBTaG93IGNvbXBsZXRlIG1vZGFsIGRpYWxvZ1xyXG4gICAgICBjb25zdCBtb2RhbFByb21pc2UgPSB0aGlzLmNyZWF0ZUNvbXBsZXRlRGlhbG9nKGJ1c3lJbmRpY2F0b3IsIHJlc3VsdCk7XHJcbiAgICAgIG1vZGFsUHJvbWlzZS50aGVuKHRoaXMub25FbnRpdHlCcmllZmNhc2VkLmJpbmQodGhpcykpO1xyXG4gICAgfSwgKGVycm9yKSA9PiB7XHJcbiAgICAgIEVycm9yTWFuYWdlci5hZGRTaW1wbGVFcnJvcihgJHtyZXNvdXJjZS5lcnJvckJyaWVmY2FzaW5nVGV4dH0gJHt0aGlzLmlkfWAsIGVycm9yKTtcclxuICAgICAgdGhpcy5jcmVhdGVBbGVydERpYWxvZyhidXN5SW5kaWNhdG9yKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgY3JlYXRlQWxlcnREaWFsb2c6IGZ1bmN0aW9uIGNyZWF0ZUFsZXJ0RGlhbG9nKGJ1c3lJbmRpY2F0b3IpIHtcclxuICAgIEFwcC5tb2RhbC5kaXNhYmxlQ2xvc2UgPSBmYWxzZTtcclxuICAgIEFwcC5tb2RhbC5zaG93VG9vbGJhciA9IHRydWU7XHJcbiAgICBidXN5SW5kaWNhdG9yLmNvbXBsZXRlKHRydWUpO1xyXG4gICAgQXBwLm1vZGFsLnJlc29sdmVEZWZlcnJlZCh0cnVlKTtcclxuICAgIC8vIEF0dGFjaCByZXNvbHZlIHRvIG1vdmUgdG8gYnJpZWZjYXNlIGxpc3QgKGlmIHVzZXIgaGl0cyBva2F5KVxyXG4gICAgcmV0dXJuIEFwcC5tb2RhbC5jcmVhdGVTaW1wbGVEaWFsb2coeyB0aXRsZTogJ2FsZXJ0JywgY29udGVudDogcmVzb3VyY2UuaW50ZXJydXB0ZWRUZXh0LCBnZXRDb250ZW50OiAoKSA9PiB7IHJldHVybjsgfSwgbGVmdEJ1dHRvbjogJ2NhbmNlbCcsIHJpZ2h0QnV0dG9uOiAnY29uZmlybScgfSk7XHJcbiAgfSxcclxuICBjcmVhdGVCdXN5TW9kYWw6IGZ1bmN0aW9uIGNyZWF0ZUJ1c3lNb2RhbCgpIHtcclxuICAgIEFwcC5tb2RhbC5kaXNhYmxlQ2xvc2UgPSB0cnVlO1xyXG4gICAgQXBwLm1vZGFsLnNob3dUb29sYmFyID0gZmFsc2U7XHJcbiAgICBjb25zdCBidXN5SW5kaWNhdG9yID0gbmV3IEJ1c3lJbmRpY2F0b3Ioe1xyXG4gICAgICBpZDogJ2J1c3lJbmRpY2F0b3JfX29mZmxpbmUtbGlzdC1icmllZmNhc2UnLFxyXG4gICAgICBsYWJlbDogcmVzb3VyY2UuYnJpZWZjYXNpbmdUZXh0LFxyXG4gICAgfSk7XHJcbiAgICBBcHAubW9kYWwuYWRkKGJ1c3lJbmRpY2F0b3IpO1xyXG4gICAgYnVzeUluZGljYXRvci5zdGFydCgpO1xyXG4gICAgcmV0dXJuIGJ1c3lJbmRpY2F0b3I7XHJcbiAgfSxcclxuICBjcmVhdGVDb21wbGV0ZURpYWxvZzogZnVuY3Rpb24gY3JlYXRlQ29tcGxldGVEaWFsb2coYnVzeUluZGljYXRvciwgcmVzdWx0ID0ge30pIHtcclxuICAgIEFwcC5tb2RhbC5kaXNhYmxlQ2xvc2UgPSBmYWxzZTtcclxuICAgIEFwcC5tb2RhbC5zaG93VG9vbGJhciA9IHRydWU7XHJcbiAgICBidXN5SW5kaWNhdG9yLmNvbXBsZXRlKHRydWUpO1xyXG4gICAgQXBwLm1vZGFsLnJlc29sdmVEZWZlcnJlZCh0cnVlKTtcclxuICAgIC8vIEF0dGFjaCByZXNvbHZlIHRvIG1vdmUgdG8gYnJpZWZjYXNlIGxpc3QgKGlmIHVzZXIgaGl0cyBva2F5KVxyXG4gICAgcmV0dXJuIEFwcC5tb2RhbC5jcmVhdGVTaW1wbGVEaWFsb2coeyB0aXRsZTogJ2NvbXBsZXRlJywgY29udGVudDogcmVzb3VyY2UuZ29Ub0RldGFpbFZpZXdUZXh0LCBnZXRDb250ZW50OiAoKSA9PiB7IHJldHVybiByZXN1bHQ7IH0sIGxlZnRCdXR0b246ICdjYW5jZWwnLCByaWdodEJ1dHRvbjogJ29rYXknIH0pO1xyXG4gIH0sXHJcbiAgb25Db250ZW50Q2hhbmdlOiBmdW5jdGlvbiBvbkNvbnRlbnRDaGFuZ2UoKSB7XHJcbiAgICBpZiAodGhpcy5lbmFibGVPZmZsaW5lKSB7XHJcbiAgICAgIHRoaXMuc2F2ZU9mZmxpbmUoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHNob3c6IGZ1bmN0aW9uIHNob3coKSB7XHJcbiAgICB0aGlzLmluaGVyaXRlZChzaG93LCBhcmd1bWVudHMpO1xyXG4gICAgLy8gQ2hlY2sgaWYgd2UgYXJlIGNvbWluZyBiYWNrIHRvIGEgcHJldmlvdXNseSBmZXRjaGVkIGVudHJ5LlxyXG4gICAgLy8gcmVmcmVzaFJlcXVpcmVkIGlzIGFuIGluZGljYXRpb24gd2UgYXJlIHN3aXRjaGluZyB0byBhIG5ldyBlbnRyeSBhbmRcclxuICAgIC8vIHRoaXMuZW50cnkgd2lsbCBiZSBzdGFsZS5cclxuICAgIGlmICghdGhpcy5yZWZyZXNoUmVxdWlyZWQgJiYgdGhpcy5lbnRyeSAmJiB0aGlzLmVuYWJsZU9mZmxpbmUpIHtcclxuICAgICAgdGhpcy5zYXZlT2ZmbGluZSgpO1xyXG4gICAgfVxyXG4gIH0sXHJcbiAgc2F2ZU9mZmxpbmU6IGZ1bmN0aW9uIHNhdmVPZmZsaW5lKCkge1xyXG4gICAgaWYgKEFwcC5lbmFibGVPZmZsaW5lU3VwcG9ydCkge1xyXG4gICAgICBPZmZsaW5lTWFuYWdlci5zYXZlRGV0YWlsVmlldyh0aGlzKS50aGVuKCgpID0+IHtcclxuICAgICAgfSwgZnVuY3Rpb24gZXJyKGVycm9yKSB7XHJcbiAgICAgICAgRXJyb3JNYW5hZ2VyLmFkZFNpbXBsZUVycm9yKGAke3Jlc291cmNlLmVycm9yU2F2aW5nT2ZmbGluZVZpZXdUZXh0fSAke3RoaXMuaWR9YCwgZXJyb3IpO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuICB9LFxyXG4gIGdldE9mZmxpbmVEZXNjcmlwdGlvbjogZnVuY3Rpb24gZ2V0T2ZmbGluZURlc2NyaXB0aW9uKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuZW50cnkuJGRlc2NyaXB0b3I7XHJcbiAgfSxcclxuICBnZXRPZmZsaW5lSWNvbjogZnVuY3Rpb24gZ2V0T2ZmbGluZUljb24oKSB7XHJcbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuZ2V0TW9kZWwoKTtcclxuICAgIHJldHVybiBtb2RlbC5nZXRJY29uQ2xhc3MoKTtcclxuICB9LFxyXG4gIG9uRW50aXR5QnJpZWZjYXNlZDogZnVuY3Rpb24gb25FbnRpdHlCcmllZmNhc2VkKCkge1xyXG4gICAgY29uc3QgdmlldyA9IHRoaXMuYXBwLmdldFZpZXcoJ2JyaWVmY2FzZV9saXN0Jyk7XHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICB2aWV3LnNob3coe30pO1xyXG4gICAgfVxyXG4gIH0sXHJcbn0pO1xyXG4iXX0=