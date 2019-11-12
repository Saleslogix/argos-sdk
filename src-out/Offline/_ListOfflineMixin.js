define('argos/Offline/_ListOfflineMixin', ['module', 'exports', 'dojo/_base/declare', './Manager', '../Dialogs/BusyIndicator', '../ErrorManager', '../I18n'], function (module, exports, _declare, _Manager, _BusyIndicator, _ErrorManager, _I18n) {
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

  var resource = (0, _I18n2.default)('_listOfflineMixin');

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
  exports.default = (0, _declare2.default)('argos.Offline._ListOfflineMixin', null, {
    autoNavigateToBriefcase: false,
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
          action: 'briefCaseList',
          security: ''
        });
      }
      return tools;
    },
    briefCaseList: function briefCaseList(action, selection) {
      var _this = this;

      // eslint-disable-line
      // Start busy indicator modal
      var busyIndicator = this.createBusyModal(Object.keys(this.entries).length);
      // Start briefcasing
      var entities = [];
      if (this.entries) {
        for (var entryId in this.entries) {
          if (this.entries.hasOwnProperty(entryId)) {
            entities.push(this.createBriefcaseEntity(this.entries[entryId]));
          }
        }
      }
      _Manager2.default.briefCaseEntities(entities).then(function (result) {
        // Show complete modal dialog
        if (!_this.autoNavigateToBriefcase) {
          var modalPromise = _this.createCompleteDialog(busyIndicator, result);
          modalPromise.then(_this.onListBriefcased.bind(_this));
        } else {
          App.modal.disableClose = false;
          App.modal.showToolbar = true;
          busyIndicator.complete(true);
          App.modal.hide();
          _this.onListBriefcased();
        }
      }, function (err) {
        // Show complete modal dialog
        _this.createAlertDialog(busyIndicator);
        _ErrorManager2.default.addSimpleError(resource.errorBriefcasingText + ' ' + _this.id, err);
      }, function () {
        busyIndicator.updateProgress();
      });
    },
    briefCaseItem: function briefCaseItem(briefcaseItem) {
      var _this2 = this;

      // eslint-disable-line
      // Start busy indicator modal
      var busyIndicator = this.createBusyModal(1);
      // Start briefcasing
      var entity = this.createBriefcaseEntity(briefcaseItem);
      _Manager2.default.briefCaseEntity(entity.entityName, entity.entityId, entity.options).then(function (result) {
        // Show complete modal dialog
        if (!_this2.autoNavigateToBriefcase) {
          var modalPromise = _this2.createCompleteDialog(busyIndicator, result);
          modalPromise.then(_this2.onListBriefcased.bind(_this2));
        } else {
          App.modal.disableClose = false;
          App.modal.showToolbar = true;
          busyIndicator.complete(true);
          App.modal.hide();
          _this2.onListBriefcased();
        }
      }, function (err) {
        // Show complete modal dialog
        _this2.createAlertDialog(busyIndicator);
        _ErrorManager2.default.addSimpleError(resource.errorBriefcasingText + ' ' + _this2.id, err);
      }, function () {
        busyIndicator.updateProgress();
      });
    },
    createBriefcaseEntity: function createBriefcaseEntity(entry) {
      var entity = {
        entityId: this.getIdentity(entry),
        entityName: this.entityName,
        options: {
          includeRelated: true,
          viewId: this.detailView,
          iconClass: this.getOfflineIcon()
        }
      };
      return entity;
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
    createBusyModal: function createBusyModal(count) {
      App.modal.disableClose = true;
      App.modal.showToolbar = false;
      var busyIndicator = new _BusyIndicator2.default({
        id: 'busyIndicator__offline-list-briefcase',
        label: resource.briefcasingText
      });
      App.modal.add(busyIndicator);
      busyIndicator.start({ isAsync: false, total: count });
      return busyIndicator;
    },
    createCompleteDialog: function createCompleteDialog(busyIndicator) {
      var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      App.modal.disableClose = false;
      App.modal.showToolbar = true;
      busyIndicator.complete(true);
      App.modal.resolveDeferred(true);
      // Attach resolve to move to briefcase list (if user hits okay)
      return App.modal.createSimpleDialog({ title: 'complete', content: resource.goToListViewText, getContent: function getContent() {
          return result;
        }, leftButton: 'cancel', rightButton: 'okay' });
    },
    getOfflineIcon: function getOfflineIcon() {
      var model = this.getModel();
      return model.getIconClass();
    },
    onListBriefcased: function onListBriefcased() {
      var view = this.app.getView('briefcase_list');
      if (view) {
        view.show({});
      }
    }
  });
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9PZmZsaW5lL19MaXN0T2ZmbGluZU1peGluLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiYXV0b05hdmlnYXRlVG9CcmllZmNhc2UiLCJjcmVhdGVUb29sTGF5b3V0IiwidG9vbHMiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJ0YmFyIiwiZW5hYmxlT2ZmbGluZSIsIkFwcCIsImVuYWJsZU9mZmxpbmVTdXBwb3J0IiwicHVzaCIsImlkIiwic3ZnIiwidGl0bGUiLCJicmllZmNhc2VUb29sdGlwVGV4dCIsImFjdGlvbiIsInNlY3VyaXR5IiwiYnJpZWZDYXNlTGlzdCIsInNlbGVjdGlvbiIsImJ1c3lJbmRpY2F0b3IiLCJjcmVhdGVCdXN5TW9kYWwiLCJPYmplY3QiLCJrZXlzIiwiZW50cmllcyIsImxlbmd0aCIsImVudGl0aWVzIiwiZW50cnlJZCIsImhhc093blByb3BlcnR5IiwiY3JlYXRlQnJpZWZjYXNlRW50aXR5IiwiYnJpZWZDYXNlRW50aXRpZXMiLCJ0aGVuIiwicmVzdWx0IiwibW9kYWxQcm9taXNlIiwiY3JlYXRlQ29tcGxldGVEaWFsb2ciLCJvbkxpc3RCcmllZmNhc2VkIiwiYmluZCIsIm1vZGFsIiwiZGlzYWJsZUNsb3NlIiwic2hvd1Rvb2xiYXIiLCJjb21wbGV0ZSIsImhpZGUiLCJlcnIiLCJjcmVhdGVBbGVydERpYWxvZyIsImFkZFNpbXBsZUVycm9yIiwiZXJyb3JCcmllZmNhc2luZ1RleHQiLCJ1cGRhdGVQcm9ncmVzcyIsImJyaWVmQ2FzZUl0ZW0iLCJicmllZmNhc2VJdGVtIiwiZW50aXR5IiwiYnJpZWZDYXNlRW50aXR5IiwiZW50aXR5TmFtZSIsImVudGl0eUlkIiwib3B0aW9ucyIsImVudHJ5IiwiZ2V0SWRlbnRpdHkiLCJpbmNsdWRlUmVsYXRlZCIsInZpZXdJZCIsImRldGFpbFZpZXciLCJpY29uQ2xhc3MiLCJnZXRPZmZsaW5lSWNvbiIsInJlc29sdmVEZWZlcnJlZCIsImNyZWF0ZVNpbXBsZURpYWxvZyIsImNvbnRlbnQiLCJpbnRlcnJ1cHRlZFRleHQiLCJnZXRDb250ZW50IiwibGVmdEJ1dHRvbiIsInJpZ2h0QnV0dG9uIiwiY291bnQiLCJsYWJlbCIsImJyaWVmY2FzaW5nVGV4dCIsImFkZCIsInN0YXJ0IiwiaXNBc3luYyIsInRvdGFsIiwiZ29Ub0xpc3RWaWV3VGV4dCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJnZXRJY29uQ2xhc3MiLCJ2aWV3IiwiYXBwIiwiZ2V0VmlldyIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxNQUFNQSxXQUFXLG9CQUFZLG1CQUFaLENBQWpCOztBQUdBOzs7O0FBdkJBOzs7Ozs7Ozs7Ozs7OztvQkEyQmUsdUJBQVEsaUNBQVIsRUFBMkMsSUFBM0MsRUFBaUQ7QUFDOURDLDZCQUF5QixLQURxQztBQUU5REMsc0JBQWtCLFNBQVNBLGdCQUFULEdBQTRCO0FBQzVDLFVBQUksS0FBS0MsS0FBVCxFQUFnQjtBQUNkLGVBQU8sS0FBS0EsS0FBWjtBQUNEO0FBQ0QsVUFBTUEsUUFBUSxLQUFLQyxTQUFMLENBQWVDLFNBQWYsQ0FBZDtBQUNBLFVBQUlGLFNBQVNBLE1BQU1HLElBQWYsSUFBdUIsS0FBS0MsYUFBNUIsSUFBNkNDLElBQUlDLG9CQUFyRCxFQUEyRTtBQUN6RU4sY0FBTUcsSUFBTixDQUFXSSxJQUFYLENBQWdCO0FBQ2RDLGNBQUksV0FEVTtBQUVkQyxlQUFLLE9BRlM7QUFHZEMsaUJBQU9iLFNBQVNjLG9CQUhGO0FBSWRDLGtCQUFRLGVBSk07QUFLZEMsb0JBQVU7QUFMSSxTQUFoQjtBQU9EO0FBQ0QsYUFBT2IsS0FBUDtBQUNELEtBakI2RDtBQWtCOURjLG1CQUFlLFNBQVNBLGFBQVQsQ0FBdUJGLE1BQXZCLEVBQStCRyxTQUEvQixFQUEwQztBQUFBOztBQUFFO0FBQ3pEO0FBQ0EsVUFBTUMsZ0JBQWdCLEtBQUtDLGVBQUwsQ0FBcUJDLE9BQU9DLElBQVAsQ0FBWSxLQUFLQyxPQUFqQixFQUEwQkMsTUFBL0MsQ0FBdEI7QUFD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Q0FBOEJkLGFBQTlCLEVBQTBEO0FBQUEsVUFBYlksTUFBYSx1RUFBSixFQUFJOztBQUM5RXZCLFVBQUk0QixLQUFKLENBQVVDLFlBQVYsR0FBeUIsS0FBekI7QUFDQTdCLFVBQUk0QixLQUFKLENBQVVFLFdBQVYsR0FBd0IsSUFBeEI7QUFDQW5CLG9CQUFjb0IsUUFBZCxDQUF1QixJQUF2QjtBQUNBL0IsVUFBSTRCLEtBQUosQ0FBVXdCLGVBQVYsQ0FBMEIsSUFBMUI7QUFDQTtBQUNBLGFBQU9wRCxJQUFJNEIsS0FBSixDQUFVeUIsa0JBQVYsQ0FBNkIsRUFBRWhELE9BQU8sVUFBVCxFQUFxQmlELFNBQVM5RCxTQUFTMEUsZ0JBQXZDLEVBQXlEVixZQUFZLHNCQUFNO0FBQUUsaUJBQU9qQyxNQUFQO0FBQWdCLFNBQTdGLEVBQStGa0MsWUFBWSxRQUEzRyxFQUFxSEMsYUFBYSxNQUFsSSxFQUE3QixDQUFQO0FBQ0QsS0FqSDZEO0FBa0g5RFAsb0JBQWdCLFNBQVNBLGNBQVQsR0FBMEI7QUFDeEMsVUFBTWdCLFFBQVEsS0FBS0MsUUFBTCxFQUFkO0FBQ0EsYUFBT0QsTUFBTUUsWUFBTixFQUFQO0FBQ0QsS0FySDZEO0FBc0g5RDNDLHNCQUFrQixTQUFTQSxnQkFBVCxHQUE0QjtBQUM1QyxVQUFNNEMsT0FBTyxLQUFLQyxHQUFMLENBQVNDLE9BQVQsQ0FBaUIsZ0JBQWpCLENBQWI7QUFDQSxVQUFJRixJQUFKLEVBQVU7QUFDUkEsYUFBS0csSUFBTCxDQUFVLEVBQVY7QUFDRDtBQUNGO0FBM0g2RCxHQUFqRCxDIiwiZmlsZSI6Il9MaXN0T2ZmbGluZU1peGluLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE1IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgT2ZmbGluZU1hbmFnZXIgZnJvbSAnLi9NYW5hZ2VyJztcclxuaW1wb3J0IEJ1c3lJbmRpY2F0b3IgZnJvbSAnLi4vRGlhbG9ncy9CdXN5SW5kaWNhdG9yJztcclxuaW1wb3J0IEVycm9yTWFuYWdlciBmcm9tICcuLi9FcnJvck1hbmFnZXInO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdfbGlzdE9mZmxpbmVNaXhpbicpO1xyXG5cclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuT2ZmbGluZS5fRGV0YWlsT2ZmbGluZU1peGluXHJcbiAqIEBjbGFzc2Rlc2MgQSBtaXhpbiB0aGF0IHByb3ZpZGVzIHRoZSBkZXRhaWwgdmlldyBvZmZsaW5lIHNwZWNpZmljIG1ldGhvZHMgYW5kIHByb3BlcnRpZXNcclxuICovXHJcbmV4cG9ydCBkZWZhdWx0IGRlY2xhcmUoJ2FyZ29zLk9mZmxpbmUuX0xpc3RPZmZsaW5lTWl4aW4nLCBudWxsLCB7XHJcbiAgYXV0b05hdmlnYXRlVG9CcmllZmNhc2U6IGZhbHNlLFxyXG4gIGNyZWF0ZVRvb2xMYXlvdXQ6IGZ1bmN0aW9uIGNyZWF0ZVRvb2xMYXlvdXQoKSB7XHJcbiAgICBpZiAodGhpcy50b29scykge1xyXG4gICAgICByZXR1cm4gdGhpcy50b29scztcclxuICAgIH1cclxuICAgIGNvbnN0IHRvb2xzID0gdGhpcy5pbmhlcml0ZWQoYXJndW1lbnRzKTtcclxuICAgIGlmICh0b29scyAmJiB0b29scy50YmFyICYmIHRoaXMuZW5hYmxlT2ZmbGluZSAmJiBBcHAuZW5hYmxlT2ZmbGluZVN1cHBvcnQpIHtcclxuICAgICAgdG9vbHMudGJhci5wdXNoKHtcclxuICAgICAgICBpZDogJ2JyaWVmQ2FzZScsXHJcbiAgICAgICAgc3ZnOiAncm9sZXMnLFxyXG4gICAgICAgIHRpdGxlOiByZXNvdXJjZS5icmllZmNhc2VUb29sdGlwVGV4dCxcclxuICAgICAgICBhY3Rpb246ICdicmllZkNhc2VMaXN0JyxcclxuICAgICAgICBzZWN1cml0eTogJycsXHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIHRvb2xzO1xyXG4gIH0sXHJcbiAgYnJpZWZDYXNlTGlzdDogZnVuY3Rpb24gYnJpZWZDYXNlTGlzdChhY3Rpb24sIHNlbGVjdGlvbikgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAvLyBTdGFydCBidXN5IGluZGljYXRvciBtb2RhbFxyXG4gICAgY29uc3QgYnVzeUluZGljYXRvciA9IHRoaXMuY3JlYXRlQnVzeU1vZGFsKE9iamVjdC5rZXlzKHRoaXMuZW50cmllcykubGVuZ3RoKTtcclxuICAgIC8vIFN0YXJ0IGJyaWVmY2FzaW5nXHJcbiAgICBjb25zdCBlbnRpdGllcyA9IFtdO1xyXG4gICAgaWYgKHRoaXMuZW50cmllcykge1xyXG4gICAgICBmb3IgKGNvbnN0IGVudHJ5SWQgaW4gdGhpcy5lbnRyaWVzKSB7XHJcbiAgICAgICAgaWYgKHRoaXMuZW50cmllcy5oYXNPd25Qcm9wZXJ0eShlbnRyeUlkKSkge1xyXG4gICAgICAgICAgZW50aXRpZXMucHVzaCh0aGlzLmNyZWF0ZUJyaWVmY2FzZUVudGl0eSh0aGlzLmVudHJpZXNbZW50cnlJZF0pKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIE9mZmxpbmVNYW5hZ2VyLmJyaWVmQ2FzZUVudGl0aWVzKGVudGl0aWVzKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgLy8gU2hvdyBjb21wbGV0ZSBtb2RhbCBkaWFsb2dcclxuICAgICAgaWYgKCF0aGlzLmF1dG9OYXZpZ2F0ZVRvQnJpZWZjYXNlKSB7XHJcbiAgICAgICAgY29uc3QgbW9kYWxQcm9taXNlID0gdGhpcy5jcmVhdGVDb21wbGV0ZURpYWxvZyhidXN5SW5kaWNhdG9yLCByZXN1bHQpO1xyXG4gICAgICAgIG1vZGFsUHJvbWlzZS50aGVuKHRoaXMub25MaXN0QnJpZWZjYXNlZC5iaW5kKHRoaXMpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBBcHAubW9kYWwuZGlzYWJsZUNsb3NlID0gZmFsc2U7XHJcbiAgICAgICAgQXBwLm1vZGFsLnNob3dUb29sYmFyID0gdHJ1ZTtcclxuICAgICAgICBidXN5SW5kaWNhdG9yLmNvbXBsZXRlKHRydWUpO1xyXG4gICAgICAgIEFwcC5tb2RhbC5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5vbkxpc3RCcmllZmNhc2VkKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgLy8gU2hvdyBjb21wbGV0ZSBtb2RhbCBkaWFsb2dcclxuICAgICAgdGhpcy5jcmVhdGVBbGVydERpYWxvZyhidXN5SW5kaWNhdG9yKTtcclxuICAgICAgRXJyb3JNYW5hZ2VyLmFkZFNpbXBsZUVycm9yKGAke3Jlc291cmNlLmVycm9yQnJpZWZjYXNpbmdUZXh0fSAke3RoaXMuaWR9YCwgZXJyKTtcclxuICAgIH0sICgpID0+IHtcclxuICAgICAgYnVzeUluZGljYXRvci51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBicmllZkNhc2VJdGVtOiBmdW5jdGlvbiBicmllZkNhc2VJdGVtKGJyaWVmY2FzZUl0ZW0pIHsgLy8gZXNsaW50LWRpc2FibGUtbGluZVxyXG4gICAgLy8gU3RhcnQgYnVzeSBpbmRpY2F0b3IgbW9kYWxcclxuICAgIGNvbnN0IGJ1c3lJbmRpY2F0b3IgPSB0aGlzLmNyZWF0ZUJ1c3lNb2RhbCgxKTtcclxuICAgIC8vIFN0YXJ0IGJyaWVmY2FzaW5nXHJcbiAgICBjb25zdCBlbnRpdHkgPSB0aGlzLmNyZWF0ZUJyaWVmY2FzZUVudGl0eShicmllZmNhc2VJdGVtKTtcclxuICAgIE9mZmxpbmVNYW5hZ2VyLmJyaWVmQ2FzZUVudGl0eShlbnRpdHkuZW50aXR5TmFtZSwgZW50aXR5LmVudGl0eUlkLCBlbnRpdHkub3B0aW9ucykudGhlbigocmVzdWx0KSA9PiB7XHJcbiAgICAgIC8vIFNob3cgY29tcGxldGUgbW9kYWwgZGlhbG9nXHJcbiAgICAgIGlmICghdGhpcy5hdXRvTmF2aWdhdGVUb0JyaWVmY2FzZSkge1xyXG4gICAgICAgIGNvbnN0IG1vZGFsUHJvbWlzZSA9IHRoaXMuY3JlYXRlQ29tcGxldGVEaWFsb2coYnVzeUluZGljYXRvciwgcmVzdWx0KTtcclxuICAgICAgICBtb2RhbFByb21pc2UudGhlbih0aGlzLm9uTGlzdEJyaWVmY2FzZWQuYmluZCh0aGlzKSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgQXBwLm1vZGFsLmRpc2FibGVDbG9zZSA9IGZhbHNlO1xyXG4gICAgICAgIEFwcC5tb2RhbC5zaG93VG9vbGJhciA9IHRydWU7XHJcbiAgICAgICAgYnVzeUluZGljYXRvci5jb21wbGV0ZSh0cnVlKTtcclxuICAgICAgICBBcHAubW9kYWwuaGlkZSgpO1xyXG4gICAgICAgIHRoaXMub25MaXN0QnJpZWZjYXNlZCgpO1xyXG4gICAgICB9XHJcbiAgICB9LCAoZXJyKSA9PiB7XHJcbiAgICAgIC8vIFNob3cgY29tcGxldGUgbW9kYWwgZGlhbG9nXHJcbiAgICAgIHRoaXMuY3JlYXRlQWxlcnREaWFsb2coYnVzeUluZGljYXRvcik7XHJcbiAgICAgIEVycm9yTWFuYWdlci5hZGRTaW1wbGVFcnJvcihgJHtyZXNvdXJjZS5lcnJvckJyaWVmY2FzaW5nVGV4dH0gJHt0aGlzLmlkfWAsIGVycik7XHJcbiAgICB9LCAoKSA9PiB7XHJcbiAgICAgIGJ1c3lJbmRpY2F0b3IudXBkYXRlUHJvZ3Jlc3MoKTtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgY3JlYXRlQnJpZWZjYXNlRW50aXR5OiBmdW5jdGlvbiBjcmVhdGVCcmllZmNhc2VFbnRpdHkoZW50cnkpIHtcclxuICAgIGNvbnN0IGVudGl0eSA9IHtcclxuICAgICAgZW50aXR5SWQ6IHRoaXMuZ2V0SWRlbnRpdHkoZW50cnkpLFxyXG4gICAgICBlbnRpdHlOYW1lOiB0aGlzLmVudGl0eU5hbWUsXHJcbiAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICBpbmNsdWRlUmVsYXRlZDogdHJ1ZSxcclxuICAgICAgICB2aWV3SWQ6IHRoaXMuZGV0YWlsVmlldyxcclxuICAgICAgICBpY29uQ2xhc3M6IHRoaXMuZ2V0T2ZmbGluZUljb24oKSxcclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgICByZXR1cm4gZW50aXR5O1xyXG4gIH0sXHJcbiAgY3JlYXRlQWxlcnREaWFsb2c6IGZ1bmN0aW9uIGNyZWF0ZUFsZXJ0RGlhbG9nKGJ1c3lJbmRpY2F0b3IpIHtcclxuICAgIEFwcC5tb2RhbC5kaXNhYmxlQ2xvc2UgPSBmYWxzZTtcclxuICAgIEFwcC5tb2RhbC5zaG93VG9vbGJhciA9IHRydWU7XHJcbiAgICBidXN5SW5kaWNhdG9yLmNvbXBsZXRlKHRydWUpO1xyXG4gICAgQXBwLm1vZGFsLnJlc29sdmVEZWZlcnJlZCh0cnVlKTtcclxuICAgIC8vIEF0dGFjaCByZXNvbHZlIHRvIG1vdmUgdG8gYnJpZWZjYXNlIGxpc3QgKGlmIHVzZXIgaGl0cyBva2F5KVxyXG4gICAgcmV0dXJuIEFwcC5tb2RhbC5jcmVhdGVTaW1wbGVEaWFsb2coeyB0aXRsZTogJ2FsZXJ0JywgY29udGVudDogcmVzb3VyY2UuaW50ZXJydXB0ZWRUZXh0LCBnZXRDb250ZW50OiAoKSA9PiB7IHJldHVybjsgfSwgbGVmdEJ1dHRvbjogJ2NhbmNlbCcsIHJpZ2h0QnV0dG9uOiAnY29uZmlybScgfSk7XHJcbiAgfSxcclxuICBjcmVhdGVCdXN5TW9kYWw6IGZ1bmN0aW9uIGNyZWF0ZUJ1c3lNb2RhbChjb3VudCkge1xyXG4gICAgQXBwLm1vZGFsLmRpc2FibGVDbG9zZSA9IHRydWU7XHJcbiAgICBBcHAubW9kYWwuc2hvd1Rvb2xiYXIgPSBmYWxzZTtcclxuICAgIGNvbnN0IGJ1c3lJbmRpY2F0b3IgPSBuZXcgQnVzeUluZGljYXRvcih7XHJcbiAgICAgIGlkOiAnYnVzeUluZGljYXRvcl9fb2ZmbGluZS1saXN0LWJyaWVmY2FzZScsXHJcbiAgICAgIGxhYmVsOiByZXNvdXJjZS5icmllZmNhc2luZ1RleHQsXHJcbiAgICB9KTtcclxuICAgIEFwcC5tb2RhbC5hZGQoYnVzeUluZGljYXRvcik7XHJcbiAgICBidXN5SW5kaWNhdG9yLnN0YXJ0KHsgaXNBc3luYzogZmFsc2UsIHRvdGFsOiBjb3VudCB9KTtcclxuICAgIHJldHVybiBidXN5SW5kaWNhdG9yO1xyXG4gIH0sXHJcbiAgY3JlYXRlQ29tcGxldGVEaWFsb2c6IGZ1bmN0aW9uIGNyZWF0ZUNvbXBsZXRlRGlhbG9nKGJ1c3lJbmRpY2F0b3IsIHJlc3VsdCA9IHt9KSB7XHJcbiAgICBBcHAubW9kYWwuZGlzYWJsZUNsb3NlID0gZmFsc2U7XHJcbiAgICBBcHAubW9kYWwuc2hvd1Rvb2xiYXIgPSB0cnVlO1xyXG4gICAgYnVzeUluZGljYXRvci5jb21wbGV0ZSh0cnVlKTtcclxuICAgIEFwcC5tb2RhbC5yZXNvbHZlRGVmZXJyZWQodHJ1ZSk7XHJcbiAgICAvLyBBdHRhY2ggcmVzb2x2ZSB0byBtb3ZlIHRvIGJyaWVmY2FzZSBsaXN0IChpZiB1c2VyIGhpdHMgb2theSlcclxuICAgIHJldHVybiBBcHAubW9kYWwuY3JlYXRlU2ltcGxlRGlhbG9nKHsgdGl0bGU6ICdjb21wbGV0ZScsIGNvbnRlbnQ6IHJlc291cmNlLmdvVG9MaXN0Vmlld1RleHQsIGdldENvbnRlbnQ6ICgpID0+IHsgcmV0dXJuIHJlc3VsdDsgfSwgbGVmdEJ1dHRvbjogJ2NhbmNlbCcsIHJpZ2h0QnV0dG9uOiAnb2theScgfSk7XHJcbiAgfSxcclxuICBnZXRPZmZsaW5lSWNvbjogZnVuY3Rpb24gZ2V0T2ZmbGluZUljb24oKSB7XHJcbiAgICBjb25zdCBtb2RlbCA9IHRoaXMuZ2V0TW9kZWwoKTtcclxuICAgIHJldHVybiBtb2RlbC5nZXRJY29uQ2xhc3MoKTtcclxuICB9LFxyXG4gIG9uTGlzdEJyaWVmY2FzZWQ6IGZ1bmN0aW9uIG9uTGlzdEJyaWVmY2FzZWQoKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5hcHAuZ2V0VmlldygnYnJpZWZjYXNlX2xpc3QnKTtcclxuICAgIGlmICh2aWV3KSB7XHJcbiAgICAgIHZpZXcuc2hvdyh7fSk7XHJcbiAgICB9XHJcbiAgfSxcclxufSk7XHJcbiJdfQ==