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
      var tools = this.inherited(arguments);
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
      this.inherited(arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9PZmZsaW5lL19EZXRhaWxPZmZsaW5lTWl4aW4uanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJjcmVhdGVUb29sTGF5b3V0IiwidG9vbHMiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJ0YmFyIiwiZW5hYmxlT2ZmbGluZSIsIkFwcCIsImVuYWJsZU9mZmxpbmVTdXBwb3J0IiwicHVzaCIsImlkIiwic3ZnIiwidGl0bGUiLCJicmllZmNhc2VUb29sdGlwVGV4dCIsImFjdGlvbiIsInNlY3VyaXR5IiwiYnJpZWZDYXNlRW50aXR5Iiwic2VsZWN0aW9uIiwiYnVzeUluZGljYXRvciIsImNyZWF0ZUJ1c3lNb2RhbCIsImVudGl0eU5hbWUiLCJtb2RlbE5hbWUiLCJlbnRpdHlJZCIsImVudHJ5IiwiJGtleSIsIm9wdGlvbnMiLCJpbmNsdWRlUmVsYXRlZCIsInZpZXdJZCIsInRoZW4iLCJyZXN1bHQiLCJtb2RhbFByb21pc2UiLCJjcmVhdGVDb21wbGV0ZURpYWxvZyIsIm9uRW50aXR5QnJpZWZjYXNlZCIsImJpbmQiLCJlcnJvciIsImFkZFNpbXBsZUVycm9yIiwiZXJyb3JCcmllZmNhc2luZ1RleHQiLCJjcmVhdGVBbGVydERpYWxvZyIsIm1vZGFsIiwiZGlzYWJsZUNsb3NlIiwic2hvd1Rvb2xiYXIiLCJjb21wbGV0ZSIsInJlc29sdmVEZWZlcnJlZCIsImNyZWF0ZVNpbXBsZURpYWxvZyIsImNvbnRlbnQiLCJpbnRlcnJ1cHRlZFRleHQiLCJnZXRDb250ZW50IiwibGVmdEJ1dHRvbiIsInJpZ2h0QnV0dG9uIiwibGFiZWwiLCJicmllZmNhc2luZ1RleHQiLCJhZGQiLCJzdGFydCIsImdvVG9EZXRhaWxWaWV3VGV4dCIsIm9uQ29udGVudENoYW5nZSIsInNhdmVPZmZsaW5lIiwic2hvdyIsInJlZnJlc2hSZXF1aXJlZCIsInNhdmVEZXRhaWxWaWV3IiwiZXJyIiwiZXJyb3JTYXZpbmdPZmZsaW5lVmlld1RleHQiLCJnZXRPZmZsaW5lRGVzY3JpcHRpb24iLCIkZGVzY3JpcHRvciIsImdldE9mZmxpbmVJY29uIiwibW9kZWwiLCJnZXRNb2RlbCIsImdldEljb25DbGFzcyIsInZpZXciLCJhcHAiLCJnZXRWaWV3Il0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTUEsV0FBVyxvQkFBWSxxQkFBWixDQUFqQjs7QUFHQTs7OztBQXZCQTs7Ozs7Ozs7Ozs7Ozs7b0JBMkJlLHVCQUFRLG1DQUFSLEVBQTZDLElBQTdDLEVBQW1EOztBQUVoRUMsc0JBQWtCLFNBQVNBLGdCQUFULEdBQTRCO0FBQzVDLFVBQUksS0FBS0MsS0FBVCxFQUFnQjtBQUNkLGVBQU8sS0FBS0EsS0FBWjtBQUNEO0FBQ0QsVUFBTUEsUUFBUSxLQUFLQyxTQUFMLENBQWVDLFNBQWYsQ0FBZDtBQUNBLFVBQUlGLFNBQVNBLE1BQU1HLElBQWYsSUFBdUIsS0FBS0MsYUFBNUIsSUFBNkNDLElBQUlDLG9CQUFyRCxFQUEyRTtBQUN6RU4sY0FBTUcsSUFBTixDQUFXSSxJQUFYLENBQWdCO0FBQ2RDLGNBQUksV0FEVTtBQUVkQyxlQUFLLE9BRlM7QUFHZEMsaUJBQU9aLFNBQVNhLG9CQUhGO0FBSWRDLGtCQUFRLGlCQUpNO0FBS2RDLG9CQUFVO0FBTEksU0FBaEI7QUFPRDtBQUNELGFBQU9iLEtBQVA7QUFDRCxLQWpCK0Q7QUFrQmhFYyxxQkFBaUIsU0FBU0EsZUFBVCxDQUF5QkYsTUFBekIsRUFBaUNHLFNBQWpDLEVBQTRDO0FBQUE7O0FBQUU7QUFDN0Q7QUFDQSxVQUFNQyxnQkFBZ0IsS0FBS0MsZUFBTCxFQUF0Qjs7QUFFQTtBQUNBLFVBQU1DLGFBQWEsS0FBS0MsU0FBeEI7QUFDQSxVQUFNQyxXQUFXLEtBQUtDLEtBQUwsQ0FBV0MsSUFBNUIsQ0FOMkQsQ0FNekI7QUFDbEMsVUFBTUMsVUFBVTtBQUNkQyx3QkFBZ0IsSUFERjtBQUVkQyxnQkFBUSxLQUFLakI7QUFGQyxPQUFoQjtBQUlBLHdCQUFlTSxlQUFmLENBQStCSSxVQUEvQixFQUEyQ0UsUUFB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ZixDQUE4QixJQUE5QixFQUFvQzlCLElBQXBDLENBQXlDLFlBQU0sQ0FDOUMsQ0FERCxFQUNHLFNBQVMrQixHQUFULENBQWF6QixLQUFiLEVBQW9CO0FBQ3JCLGlDQUFhQyxjQUFiLENBQStCbkMsU0FBUzRELDBCQUF4QyxTQUFzRSxLQUFLbEQsRUFBM0UsRUFBaUZ3QixLQUFqRjtBQUNELFNBSEQ7QUFJRDtBQUNGLEtBdEYrRDtBQXVGaEUyQiwyQkFBdUIsU0FBU0EscUJBQVQsR0FBaUM7QUFDdEQsYUFBTyxLQUFLdEMsS0FBTCxDQUFXdUMsV0FBbEI7QUFDRCxLQXpGK0Q7QUEwRmhFQyxvQkFBZ0IsU0FBU0EsY0FBVCxHQUEwQjtBQUN4QyxVQUFNQyxRQUFRLEtBQUtDLFFBQUwsRUFBZDtBQUNBLGFBQU9ELE1BQU1FLFlBQU4sRUFBUDtBQUNELEtBN0YrRDtBQThGaEVsQyx3QkFBb0IsU0FBU0Esa0JBQVQsR0FBOEI7QUFDaEQsVUFBTW1DLE9BQU8sS0FBS0MsR0FBTCxDQUFTQyxPQUFULENBQWlCLGdCQUFqQixDQUFiO0FBQ0EsVUFBSUYsSUFBSixFQUFVO0FBQ1JBLGFBQUtYLElBQUwsQ0FBVSxFQUFWO0FBQ0Q7QUFDRjtBQW5HK0QsR0FBbkQsQyIsImZpbGUiOiJfRGV0YWlsT2ZmbGluZU1peGluLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE1IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgT2ZmbGluZU1hbmFnZXIgZnJvbSAnLi9NYW5hZ2VyJztcclxuaW1wb3J0IEJ1c3lJbmRpY2F0b3IgZnJvbSAnLi4vRGlhbG9ncy9CdXN5SW5kaWNhdG9yJztcclxuaW1wb3J0IEVycm9yTWFuYWdlciBmcm9tICcuLi9FcnJvck1hbmFnZXInO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdfZGV0YWlsT2ZmbGluZU1peGluJyk7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5PZmZsaW5lLl9EZXRhaWxPZmZsaW5lTWl4aW5cclxuICogQGNsYXNzZGVzYyBBIG1peGluIHRoYXQgcHJvdmlkZXMgdGhlIGRldGFpbCB2aWV3IG9mZmxpbmUgc3BlY2lmaWMgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZGVjbGFyZSgnYXJnb3MuT2ZmbGluZS5fRGV0YWlsT2ZmbGluZU1peGluJywgbnVsbCwge1xyXG5cclxuICBjcmVhdGVUb29sTGF5b3V0OiBmdW5jdGlvbiBjcmVhdGVUb29sTGF5b3V0KCkge1xyXG4gICAgaWYgKHRoaXMudG9vbHMpIHtcclxuICAgICAgcmV0dXJuIHRoaXMudG9vbHM7XHJcbiAgICB9XHJcbiAgICBjb25zdCB0b29scyA9IHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgICBpZiAodG9vbHMgJiYgdG9vbHMudGJhciAmJiB0aGlzLmVuYWJsZU9mZmxpbmUgJiYgQXBwLmVuYWJsZU9mZmxpbmVTdXBwb3J0KSB7XHJcbiAgICAgIHRvb2xzLnRiYXIucHVzaCh7XHJcbiAgICAgICAgaWQ6ICdicmllZkNhc2UnLFxyXG4gICAgICAgIHN2ZzogJ3JvbGVzJyxcclxuICAgICAgICB0aXRsZTogcmVzb3VyY2UuYnJpZWZjYXNlVG9vbHRpcFRleHQsXHJcbiAgICAgICAgYWN0aW9uOiAnYnJpZWZDYXNlRW50aXR5JyxcclxuICAgICAgICBzZWN1cml0eTogJycsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvb2xzO1xyXG4gIH0sXHJcbiAgYnJpZWZDYXNlRW50aXR5OiBmdW5jdGlvbiBicmllZkNhc2VFbnRpdHkoYWN0aW9uLCBzZWxlY3Rpb24pIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgLy8gU3RhcnQgYnVzeSBpbmRpY2F0b3IgbW9kYWxcclxuICAgIGNvbnN0IGJ1c3lJbmRpY2F0b3IgPSB0aGlzLmNyZWF0ZUJ1c3lNb2RhbCgpO1xyXG5cclxuICAgIC8vIFN0YXJ0IGJyaWVmY2FzaW5nXHJcbiAgICBjb25zdCBlbnRpdHlOYW1lID0gdGhpcy5tb2RlbE5hbWU7XHJcbiAgICBjb25zdCBlbnRpdHlJZCA9IHRoaXMuZW50cnkuJGtleTsgLy8gdGhpZSBzaG91bGQgYmUgcmVzb2x2ZWQgZnJvbSB0aGUgbW9kZWwgb3IgYWRhcHRlci5cclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGluY2x1ZGVSZWxhdGVkOiB0cnVlLFxyXG4gICAgICB2aWV3SWQ6IHRoaXMuaWQsXHJcbiAgICB9O1xyXG4gICAgT2ZmbGluZU1hbmFnZXIuYnJpZWZDYXNlRW50aXR5KGVudGl0eU5hbWUsIGVudGl0eUlkLCBvcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgLy8gU2hvdyBjb21wbGV0ZSBtb2RhbCBkaWFsb2dcclxuICAgICAgY29uc3QgbW9kYWxQcm9taXNlID0gdGhpcy5jcmVhdGVDb21wbGV0ZURpYWxvZyhidXN5SW5kaWNhdG9yLCByZXN1bHQpO1xyXG4gICAgICBtb2RhbFByb21pc2UudGhlbih0aGlzLm9uRW50aXR5QnJpZWZjYXNlZC5iaW5kKHRoaXMpKTtcclxuICAgIH0sIChlcnJvcikgPT4ge1xyXG4gICAgICBFcnJvck1hbmFnZXIuYWRkU2ltcGxlRXJyb3IoYCR7cmVzb3VyY2UuZXJyb3JCcmllZmNhc2luZ1RleHR9ICR7dGhpcy5pZH1gLCBlcnJvcik7XHJcbiAgICAgIHRoaXMuY3JlYXRlQWxlcnREaWFsb2coYnVzeUluZGljYXRvcik7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGNyZWF0ZUFsZXJ0RGlhbG9nOiBmdW5jdGlvbiBjcmVhdGVBbGVydERpYWxvZyhidXN5SW5kaWNhdG9yKSB7XHJcbiAgICBBcHAubW9kYWwuZGlzYWJsZUNsb3NlID0gZmFsc2U7XHJcbiAgICBBcHAubW9kYWwuc2hvd1Rvb2xiYXIgPSB0cnVlO1xyXG4gICAgYnVzeUluZGljYXRvci5jb21wbGV0ZSh0cnVlKTtcclxuICAgIEFwcC5tb2RhbC5yZXNvbHZlRGVmZXJyZWQodHJ1ZSk7XHJcbiAgICAvLyBBdHRhY2ggcmVzb2x2ZSB0byBtb3ZlIHRvIGJyaWVmY2FzZSBsaXN0IChpZiB1c2VyIGhpdHMgb2theSlcclxuICAgIHJldHVybiBBcHAubW9kYWwuY3JlYXRlU2ltcGxlRGlhbG9nKHsgdGl0bGU6ICdhbGVydCcsIGNvbnRlbnQ6IHJlc291cmNlLmludGVycnVwdGVkVGV4dCwgZ2V0Q29udGVudDogKCkgPT4geyByZXR1cm47IH0sIGxlZnRCdXR0b246ICdjYW5jZWwnLCByaWdodEJ1dHRvbjogJ2NvbmZpcm0nIH0pO1xyXG4gIH0sXHJcbiAgY3JlYXRlQnVzeU1vZGFsOiBmdW5jdGlvbiBjcmVhdGVCdXN5TW9kYWwoKSB7XHJcbiAgICBBcHAubW9kYWwuZGlzYWJsZUNsb3NlID0gdHJ1ZTtcclxuICAgIEFwcC5tb2RhbC5zaG93VG9vbGJhciA9IGZhbHNlO1xyXG4gICAgY29uc3QgYnVzeUluZGljYXRvciA9IG5ldyBCdXN5SW5kaWNhdG9yKHtcclxuICAgICAgaWQ6ICdidXN5SW5kaWNhdG9yX19vZmZsaW5lLWxpc3QtYnJpZWZjYXNlJyxcclxuICAgICAgbGFiZWw6IHJlc291cmNlLmJyaWVmY2FzaW5nVGV4dCxcclxuICAgIH0pO1xyXG4gICAgQXBwLm1vZGFsLmFkZChidXN5SW5kaWNhdG9yKTtcclxuICAgIGJ1c3lJbmRpY2F0b3Iuc3RhcnQoKTtcclxuICAgIHJldHVybiBidXN5SW5kaWNhdG9yO1xyXG4gIH0sXHJcbiAgY3JlYXRlQ29tcGxldGVEaWFsb2c6IGZ1bmN0aW9uIGNyZWF0ZUNvbXBsZXRlRGlhbG9nKGJ1c3lJbmRpY2F0b3IsIHJlc3VsdCA9IHt9KSB7XHJcbiAgICBBcHAubW9kYWwuZGlzYWJsZUNsb3NlID0gZmFsc2U7XHJcbiAgICBBcHAubW9kYWwuc2hvd1Rvb2xiYXIgPSB0cnVlO1xyXG4gICAgYnVzeUluZGljYXRvci5jb21wbGV0ZSh0cnVlKTtcclxuICAgIEFwcC5tb2RhbC5yZXNvbHZlRGVmZXJyZWQodHJ1ZSk7XHJcbiAgICAvLyBBdHRhY2ggcmVzb2x2ZSB0byBtb3ZlIHRvIGJyaWVmY2FzZSBsaXN0IChpZiB1c2VyIGhpdHMgb2theSlcclxuICAgIHJldHVybiBBcHAubW9kYWwuY3JlYXRlU2ltcGxlRGlhbG9nKHsgdGl0bGU6ICdjb21wbGV0ZScsIGNvbnRlbnQ6IHJlc291cmNlLmdvVG9EZXRhaWxWaWV3VGV4dCwgZ2V0Q29udGVudDogKCkgPT4geyByZXR1cm4gcmVzdWx0OyB9LCBsZWZ0QnV0dG9uOiAnY2FuY2VsJywgcmlnaHRCdXR0b246ICdva2F5JyB9KTtcclxuICB9LFxyXG4gIG9uQ29udGVudENoYW5nZTogZnVuY3Rpb24gb25Db250ZW50Q2hhbmdlKCkge1xyXG4gICAgaWYgKHRoaXMuZW5hYmxlT2ZmbGluZSkge1xyXG4gICAgICB0aGlzLnNhdmVPZmZsaW5lKCk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBzaG93OiBmdW5jdGlvbiBzaG93KCkge1xyXG4gICAgdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIC8vIENoZWNrIGlmIHdlIGFyZSBjb21pbmcgYmFjayB0byBhIHByZXZpb3VzbHkgZmV0Y2hlZCBlbnRyeS5cclxuICAgIC8vIHJlZnJlc2hSZXF1aXJlZCBpcyBhbiBpbmRpY2F0aW9uIHdlIGFyZSBzd2l0Y2hpbmcgdG8gYSBuZXcgZW50cnkgYW5kXHJcbiAgICAvLyB0aGlzLmVudHJ5IHdpbGwgYmUgc3RhbGUuXHJcbiAgICBpZiAoIXRoaXMucmVmcmVzaFJlcXVpcmVkICYmIHRoaXMuZW50cnkgJiYgdGhpcy5lbmFibGVPZmZsaW5lKSB7XHJcbiAgICAgIHRoaXMuc2F2ZU9mZmxpbmUoKTtcclxuICAgIH1cclxuICB9LFxyXG4gIHNhdmVPZmZsaW5lOiBmdW5jdGlvbiBzYXZlT2ZmbGluZSgpIHtcclxuICAgIGlmIChBcHAuZW5hYmxlT2ZmbGluZVN1cHBvcnQpIHtcclxuICAgICAgT2ZmbGluZU1hbmFnZXIuc2F2ZURldGFpbFZpZXcodGhpcykudGhlbigoKSA9PiB7XHJcbiAgICAgIH0sIGZ1bmN0aW9uIGVycihlcnJvcikge1xyXG4gICAgICAgIEVycm9yTWFuYWdlci5hZGRTaW1wbGVFcnJvcihgJHtyZXNvdXJjZS5lcnJvclNhdmluZ09mZmxpbmVWaWV3VGV4dH0gJHt0aGlzLmlkfWAsIGVycm9yKTtcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfSxcclxuICBnZXRPZmZsaW5lRGVzY3JpcHRpb246IGZ1bmN0aW9uIGdldE9mZmxpbmVEZXNjcmlwdGlvbigpIHtcclxuICAgIHJldHVybiB0aGlzLmVudHJ5LiRkZXNjcmlwdG9yO1xyXG4gIH0sXHJcbiAgZ2V0T2ZmbGluZUljb246IGZ1bmN0aW9uIGdldE9mZmxpbmVJY29uKCkge1xyXG4gICAgY29uc3QgbW9kZWwgPSB0aGlzLmdldE1vZGVsKCk7XHJcbiAgICByZXR1cm4gbW9kZWwuZ2V0SWNvbkNsYXNzKCk7XHJcbiAgfSxcclxuICBvbkVudGl0eUJyaWVmY2FzZWQ6IGZ1bmN0aW9uIG9uRW50aXR5QnJpZWZjYXNlZCgpIHtcclxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC5nZXRWaWV3KCdicmllZmNhc2VfbGlzdCcpO1xyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgdmlldy5zaG93KHt9KTtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuIl19