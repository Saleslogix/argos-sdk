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
      var tools = this.inherited(createToolLayout, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9PZmZsaW5lL19MaXN0T2ZmbGluZU1peGluLmpzIl0sIm5hbWVzIjpbInJlc291cmNlIiwiYXV0b05hdmlnYXRlVG9CcmllZmNhc2UiLCJjcmVhdGVUb29sTGF5b3V0IiwidG9vbHMiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJ0YmFyIiwiZW5hYmxlT2ZmbGluZSIsIkFwcCIsImVuYWJsZU9mZmxpbmVTdXBwb3J0IiwicHVzaCIsImlkIiwic3ZnIiwidGl0bGUiLCJicmllZmNhc2VUb29sdGlwVGV4dCIsImFjdGlvbiIsInNlY3VyaXR5IiwiYnJpZWZDYXNlTGlzdCIsInNlbGVjdGlvbiIsImJ1c3lJbmRpY2F0b3IiLCJjcmVhdGVCdXN5TW9kYWwiLCJPYmplY3QiLCJrZXlzIiwiZW50cmllcyIsImxlbmd0aCIsImVudGl0aWVzIiwiZW50cnlJZCIsImhhc093blByb3BlcnR5IiwiY3JlYXRlQnJpZWZjYXNlRW50aXR5IiwiYnJpZWZDYXNlRW50aXRpZXMiLCJ0aGVuIiwicmVzdWx0IiwibW9kYWxQcm9taXNlIiwiY3JlYXRlQ29tcGxldGVEaWFsb2ciLCJvbkxpc3RCcmllZmNhc2VkIiwiYmluZCIsIm1vZGFsIiwiZGlzYWJsZUNsb3NlIiwic2hvd1Rvb2xiYXIiLCJjb21wbGV0ZSIsImhpZGUiLCJlcnIiLCJjcmVhdGVBbGVydERpYWxvZyIsImFkZFNpbXBsZUVycm9yIiwiZXJyb3JCcmllZmNhc2luZ1RleHQiLCJ1cGRhdGVQcm9ncmVzcyIsImJyaWVmQ2FzZUl0ZW0iLCJicmllZmNhc2VJdGVtIiwiZW50aXR5IiwiYnJpZWZDYXNlRW50aXR5IiwiZW50aXR5TmFtZSIsImVudGl0eUlkIiwib3B0aW9ucyIsImVudHJ5IiwiZ2V0SWRlbnRpdHkiLCJpbmNsdWRlUmVsYXRlZCIsInZpZXdJZCIsImRldGFpbFZpZXciLCJpY29uQ2xhc3MiLCJnZXRPZmZsaW5lSWNvbiIsInJlc29sdmVEZWZlcnJlZCIsImNyZWF0ZVNpbXBsZURpYWxvZyIsImNvbnRlbnQiLCJpbnRlcnJ1cHRlZFRleHQiLCJnZXRDb250ZW50IiwibGVmdEJ1dHRvbiIsInJpZ2h0QnV0dG9uIiwiY291bnQiLCJsYWJlbCIsImJyaWVmY2FzaW5nVGV4dCIsImFkZCIsInN0YXJ0IiwiaXNBc3luYyIsInRvdGFsIiwiZ29Ub0xpc3RWaWV3VGV4dCIsIm1vZGVsIiwiZ2V0TW9kZWwiLCJnZXRJY29uQ2xhc3MiLCJ2aWV3IiwiYXBwIiwiZ2V0VmlldyIsInNob3ciXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQW9CQSxNQUFNQSxXQUFXLG9CQUFZLG1CQUFaLENBQWpCOztBQUdBOzs7O0FBdkJBOzs7Ozs7Ozs7Ozs7OztvQkEyQmUsdUJBQVEsaUNBQVIsRUFBMkMsSUFBM0MsRUFBaUQ7QUFDOURDLDZCQUF5QixLQURxQztBQUU5REMsc0JBQWtCLFNBQVNBLGdCQUFULEdBQTRCO0FBQzVDLFVBQUksS0FBS0MsS0FBVCxFQUFnQjtBQUNkLGVBQU8sS0FBS0EsS0FBWjtBQUNEO0FBQ0QsVUFBTUEsUUFBUSxLQUFLQyxTQUFMLENBQWVGLGdCQUFmLEVBQWlDRyxTQUFqQyxDQUFkO0FBQ0EsVUFBSUYsU0FBU0EsTUFBTUcsSUFBZixJQUF1QixLQUFLQyxhQUE1QixJQUE2Q0MsSUFBSUMsb0JBQXJELEVBQTJFO0FBQ3pFTixjQUFNRyxJQUFOLENBQVdJLElBQVgsQ0FBZ0I7QUFDZEMsY0FBSSxXQURVO0FBRWRDLGVBQUssT0FGUztBQUdkQyxpQkFBT2IsU0FBU2Msb0JBSEY7QUFJZEMsa0JBQVEsZUFKTTtBQUtkQyxvQkFBVTtBQUxJLFNBQWhCO0FBT0Q7QUFDRCxhQUFPYixLQUFQO0FBQ0QsS0FqQjZEO0FBa0I5RGMsbUJBQWUsU0FBU0EsYUFBVCxDQUF1QkYsTUFBdkIsRUFBK0JHLFNBQS9CLEVBQTBDO0FBQUE7O0FBQUU7QUFDekQ7QUFDQSxVQUFNQyxnQkFBZ0IsS0FBS0MsZUFBTCxDQUFxQkMsT0FBT0MsSUFBUCxDQUFZLEtBQUtDLE9BQWpCLEVBQTBCQyxN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QixTQUFTQSxvQkFBVCxDQUE4QmQsYUFBOUIsRUFBMEQ7QUFBQSxVQUFiWSxNQUFhLHVFQUFKLEVBQUk7O0FBQzlFdkIsVUFBSTRCLEtBQUosQ0FBVUMsWUFBVixHQUF5QixLQUF6QjtBQUNBN0IsVUFBSTRCLEtBQUosQ0FBVUUsV0FBVixHQUF3QixJQUF4QjtBQUNBbkIsb0JBQWNvQixRQUFkLENBQXVCLElBQXZCO0FBQ0EvQixVQUFJNEIsS0FBSixDQUFVd0IsZUFBVixDQUEwQixJQUExQjtBQUNBO0FBQ0EsYUFBT3BELElBQUk0QixLQUFKLENBQVV5QixrQkFBVixDQUE2QixFQUFFaEQsT0FBTyxVQUFULEVBQXFCaUQsU0FBUzlELFNBQVMwRSxnQkFBdkMsRUFBeURWLFlBQVksc0JBQU07QUFBRSxpQkFBT2pDLE1BQVA7QUFBZ0IsU0FBN0YsRUFBK0ZrQyxZQUFZLFFBQTNHLEVBQXFIQyxhQUFhLE1BQWxJLEVBQTdCLENBQVA7QUFDRCxLQWpINkQ7QUFrSDlEUCxvQkFBZ0IsU0FBU0EsY0FBVCxHQUEwQjtBQUN4QyxVQUFNZ0IsUUFBUSxLQUFLQyxRQUFMLEVBQWQ7QUFDQSxhQUFPRCxNQUFNRSxZQUFOLEVBQVA7QUFDRCxLQXJINkQ7QUFzSDlEM0Msc0JBQWtCLFNBQVNBLGdCQUFULEdBQTRCO0FBQzVDLFVBQU00QyxPQUFPLEtBQUtDLEdBQUwsQ0FBU0MsT0FBVCxDQUFpQixnQkFBakIsQ0FBYjtBQUNBLFVBQUlGLElBQUosRUFBVTtBQUNSQSxhQUFLRyxJQUFMLENBQVUsRUFBVjtBQUNEO0FBQ0Y7QUEzSDZELEdBQWpELEMiLCJmaWxlIjoiX0xpc3RPZmZsaW5lTWl4aW4uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTUgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBPZmZsaW5lTWFuYWdlciBmcm9tICcuL01hbmFnZXInO1xyXG5pbXBvcnQgQnVzeUluZGljYXRvciBmcm9tICcuLi9EaWFsb2dzL0J1c3lJbmRpY2F0b3InO1xyXG5pbXBvcnQgRXJyb3JNYW5hZ2VyIGZyb20gJy4uL0Vycm9yTWFuYWdlcic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuLi9JMThuJztcclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ19saXN0T2ZmbGluZU1peGluJyk7XHJcblxyXG5cclxuLyoqXHJcbiAqIEBjbGFzcyBhcmdvcy5PZmZsaW5lLl9EZXRhaWxPZmZsaW5lTWl4aW5cclxuICogQGNsYXNzZGVzYyBBIG1peGluIHRoYXQgcHJvdmlkZXMgdGhlIGRldGFpbCB2aWV3IG9mZmxpbmUgc3BlY2lmaWMgbWV0aG9kcyBhbmQgcHJvcGVydGllc1xyXG4gKi9cclxuZXhwb3J0IGRlZmF1bHQgZGVjbGFyZSgnYXJnb3MuT2ZmbGluZS5fTGlzdE9mZmxpbmVNaXhpbicsIG51bGwsIHtcclxuICBhdXRvTmF2aWdhdGVUb0JyaWVmY2FzZTogZmFsc2UsXHJcbiAgY3JlYXRlVG9vbExheW91dDogZnVuY3Rpb24gY3JlYXRlVG9vbExheW91dCgpIHtcclxuICAgIGlmICh0aGlzLnRvb2xzKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRvb2xzO1xyXG4gICAgfVxyXG4gICAgY29uc3QgdG9vbHMgPSB0aGlzLmluaGVyaXRlZChjcmVhdGVUb29sTGF5b3V0LCBhcmd1bWVudHMpO1xyXG4gICAgaWYgKHRvb2xzICYmIHRvb2xzLnRiYXIgJiYgdGhpcy5lbmFibGVPZmZsaW5lICYmIEFwcC5lbmFibGVPZmZsaW5lU3VwcG9ydCkge1xyXG4gICAgICB0b29scy50YmFyLnB1c2goe1xyXG4gICAgICAgIGlkOiAnYnJpZWZDYXNlJyxcclxuICAgICAgICBzdmc6ICdyb2xlcycsXHJcbiAgICAgICAgdGl0bGU6IHJlc291cmNlLmJyaWVmY2FzZVRvb2x0aXBUZXh0LFxyXG4gICAgICAgIGFjdGlvbjogJ2JyaWVmQ2FzZUxpc3QnLFxyXG4gICAgICAgIHNlY3VyaXR5OiAnJyxcclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdG9vbHM7XHJcbiAgfSxcclxuICBicmllZkNhc2VMaXN0OiBmdW5jdGlvbiBicmllZkNhc2VMaXN0KGFjdGlvbiwgc2VsZWN0aW9uKSB7IC8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgIC8vIFN0YXJ0IGJ1c3kgaW5kaWNhdG9yIG1vZGFsXHJcbiAgICBjb25zdCBidXN5SW5kaWNhdG9yID0gdGhpcy5jcmVhdGVCdXN5TW9kYWwoT2JqZWN0LmtleXModGhpcy5lbnRyaWVzKS5sZW5ndGgpO1xyXG4gICAgLy8gU3RhcnQgYnJpZWZjYXNpbmdcclxuICAgIGNvbnN0IGVudGl0aWVzID0gW107XHJcbiAgICBpZiAodGhpcy5lbnRyaWVzKSB7XHJcbiAgICAgIGZvciAoY29uc3QgZW50cnlJZCBpbiB0aGlzLmVudHJpZXMpIHtcclxuICAgICAgICBpZiAodGhpcy5lbnRyaWVzLmhhc093blByb3BlcnR5KGVudHJ5SWQpKSB7XHJcbiAgICAgICAgICBlbnRpdGllcy5wdXNoKHRoaXMuY3JlYXRlQnJpZWZjYXNlRW50aXR5KHRoaXMuZW50cmllc1tlbnRyeUlkXSkpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgT2ZmbGluZU1hbmFnZXIuYnJpZWZDYXNlRW50aXRpZXMoZW50aXRpZXMpLnRoZW4oKHJlc3VsdCkgPT4ge1xyXG4gICAgICAvLyBTaG93IGNvbXBsZXRlIG1vZGFsIGRpYWxvZ1xyXG4gICAgICBpZiAoIXRoaXMuYXV0b05hdmlnYXRlVG9CcmllZmNhc2UpIHtcclxuICAgICAgICBjb25zdCBtb2RhbFByb21pc2UgPSB0aGlzLmNyZWF0ZUNvbXBsZXRlRGlhbG9nKGJ1c3lJbmRpY2F0b3IsIHJlc3VsdCk7XHJcbiAgICAgICAgbW9kYWxQcm9taXNlLnRoZW4odGhpcy5vbkxpc3RCcmllZmNhc2VkLmJpbmQodGhpcykpO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIEFwcC5tb2RhbC5kaXNhYmxlQ2xvc2UgPSBmYWxzZTtcclxuICAgICAgICBBcHAubW9kYWwuc2hvd1Rvb2xiYXIgPSB0cnVlO1xyXG4gICAgICAgIGJ1c3lJbmRpY2F0b3IuY29tcGxldGUodHJ1ZSk7XHJcbiAgICAgICAgQXBwLm1vZGFsLmhpZGUoKTtcclxuICAgICAgICB0aGlzLm9uTGlzdEJyaWVmY2FzZWQoKTtcclxuICAgICAgfVxyXG4gICAgfSwgKGVycikgPT4ge1xyXG4gICAgICAvLyBTaG93IGNvbXBsZXRlIG1vZGFsIGRpYWxvZ1xyXG4gICAgICB0aGlzLmNyZWF0ZUFsZXJ0RGlhbG9nKGJ1c3lJbmRpY2F0b3IpO1xyXG4gICAgICBFcnJvck1hbmFnZXIuYWRkU2ltcGxlRXJyb3IoYCR7cmVzb3VyY2UuZXJyb3JCcmllZmNhc2luZ1RleHR9ICR7dGhpcy5pZH1gLCBlcnIpO1xyXG4gICAgfSwgKCkgPT4ge1xyXG4gICAgICBidXN5SW5kaWNhdG9yLnVwZGF0ZVByb2dyZXNzKCk7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIGJyaWVmQ2FzZUl0ZW06IGZ1bmN0aW9uIGJyaWVmQ2FzZUl0ZW0oYnJpZWZjYXNlSXRlbSkgeyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXHJcbiAgICAvLyBTdGFydCBidXN5IGluZGljYXRvciBtb2RhbFxyXG4gICAgY29uc3QgYnVzeUluZGljYXRvciA9IHRoaXMuY3JlYXRlQnVzeU1vZGFsKDEpO1xyXG4gICAgLy8gU3RhcnQgYnJpZWZjYXNpbmdcclxuICAgIGNvbnN0IGVudGl0eSA9IHRoaXMuY3JlYXRlQnJpZWZjYXNlRW50aXR5KGJyaWVmY2FzZUl0ZW0pO1xyXG4gICAgT2ZmbGluZU1hbmFnZXIuYnJpZWZDYXNlRW50aXR5KGVudGl0eS5lbnRpdHlOYW1lLCBlbnRpdHkuZW50aXR5SWQsIGVudGl0eS5vcHRpb25zKS50aGVuKChyZXN1bHQpID0+IHtcclxuICAgICAgLy8gU2hvdyBjb21wbGV0ZSBtb2RhbCBkaWFsb2dcclxuICAgICAgaWYgKCF0aGlzLmF1dG9OYXZpZ2F0ZVRvQnJpZWZjYXNlKSB7XHJcbiAgICAgICAgY29uc3QgbW9kYWxQcm9taXNlID0gdGhpcy5jcmVhdGVDb21wbGV0ZURpYWxvZyhidXN5SW5kaWNhdG9yLCByZXN1bHQpO1xyXG4gICAgICAgIG1vZGFsUHJvbWlzZS50aGVuKHRoaXMub25MaXN0QnJpZWZjYXNlZC5iaW5kKHRoaXMpKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBBcHAubW9kYWwuZGlzYWJsZUNsb3NlID0gZmFsc2U7XHJcbiAgICAgICAgQXBwLm1vZGFsLnNob3dUb29sYmFyID0gdHJ1ZTtcclxuICAgICAgICBidXN5SW5kaWNhdG9yLmNvbXBsZXRlKHRydWUpO1xyXG4gICAgICAgIEFwcC5tb2RhbC5oaWRlKCk7XHJcbiAgICAgICAgdGhpcy5vbkxpc3RCcmllZmNhc2VkKCk7XHJcbiAgICAgIH1cclxuICAgIH0sIChlcnIpID0+IHtcclxuICAgICAgLy8gU2hvdyBjb21wbGV0ZSBtb2RhbCBkaWFsb2dcclxuICAgICAgdGhpcy5jcmVhdGVBbGVydERpYWxvZyhidXN5SW5kaWNhdG9yKTtcclxuICAgICAgRXJyb3JNYW5hZ2VyLmFkZFNpbXBsZUVycm9yKGAke3Jlc291cmNlLmVycm9yQnJpZWZjYXNpbmdUZXh0fSAke3RoaXMuaWR9YCwgZXJyKTtcclxuICAgIH0sICgpID0+IHtcclxuICAgICAgYnVzeUluZGljYXRvci51cGRhdGVQcm9ncmVzcygpO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBjcmVhdGVCcmllZmNhc2VFbnRpdHk6IGZ1bmN0aW9uIGNyZWF0ZUJyaWVmY2FzZUVudGl0eShlbnRyeSkge1xyXG4gICAgY29uc3QgZW50aXR5ID0ge1xyXG4gICAgICBlbnRpdHlJZDogdGhpcy5nZXRJZGVudGl0eShlbnRyeSksXHJcbiAgICAgIGVudGl0eU5hbWU6IHRoaXMuZW50aXR5TmFtZSxcclxuICAgICAgb3B0aW9uczoge1xyXG4gICAgICAgIGluY2x1ZGVSZWxhdGVkOiB0cnVlLFxyXG4gICAgICAgIHZpZXdJZDogdGhpcy5kZXRhaWxWaWV3LFxyXG4gICAgICAgIGljb25DbGFzczogdGhpcy5nZXRPZmZsaW5lSWNvbigpLFxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICAgIHJldHVybiBlbnRpdHk7XHJcbiAgfSxcclxuICBjcmVhdGVBbGVydERpYWxvZzogZnVuY3Rpb24gY3JlYXRlQWxlcnREaWFsb2coYnVzeUluZGljYXRvcikge1xyXG4gICAgQXBwLm1vZGFsLmRpc2FibGVDbG9zZSA9IGZhbHNlO1xyXG4gICAgQXBwLm1vZGFsLnNob3dUb29sYmFyID0gdHJ1ZTtcclxuICAgIGJ1c3lJbmRpY2F0b3IuY29tcGxldGUodHJ1ZSk7XHJcbiAgICBBcHAubW9kYWwucmVzb2x2ZURlZmVycmVkKHRydWUpO1xyXG4gICAgLy8gQXR0YWNoIHJlc29sdmUgdG8gbW92ZSB0byBicmllZmNhc2UgbGlzdCAoaWYgdXNlciBoaXRzIG9rYXkpXHJcbiAgICByZXR1cm4gQXBwLm1vZGFsLmNyZWF0ZVNpbXBsZURpYWxvZyh7IHRpdGxlOiAnYWxlcnQnLCBjb250ZW50OiByZXNvdXJjZS5pbnRlcnJ1cHRlZFRleHQsIGdldENvbnRlbnQ6ICgpID0+IHsgcmV0dXJuOyB9LCBsZWZ0QnV0dG9uOiAnY2FuY2VsJywgcmlnaHRCdXR0b246ICdjb25maXJtJyB9KTtcclxuICB9LFxyXG4gIGNyZWF0ZUJ1c3lNb2RhbDogZnVuY3Rpb24gY3JlYXRlQnVzeU1vZGFsKGNvdW50KSB7XHJcbiAgICBBcHAubW9kYWwuZGlzYWJsZUNsb3NlID0gdHJ1ZTtcclxuICAgIEFwcC5tb2RhbC5zaG93VG9vbGJhciA9IGZhbHNlO1xyXG4gICAgY29uc3QgYnVzeUluZGljYXRvciA9IG5ldyBCdXN5SW5kaWNhdG9yKHtcclxuICAgICAgaWQ6ICdidXN5SW5kaWNhdG9yX19vZmZsaW5lLWxpc3QtYnJpZWZjYXNlJyxcclxuICAgICAgbGFiZWw6IHJlc291cmNlLmJyaWVmY2FzaW5nVGV4dCxcclxuICAgIH0pO1xyXG4gICAgQXBwLm1vZGFsLmFkZChidXN5SW5kaWNhdG9yKTtcclxuICAgIGJ1c3lJbmRpY2F0b3Iuc3RhcnQoeyBpc0FzeW5jOiBmYWxzZSwgdG90YWw6IGNvdW50IH0pO1xyXG4gICAgcmV0dXJuIGJ1c3lJbmRpY2F0b3I7XHJcbiAgfSxcclxuICBjcmVhdGVDb21wbGV0ZURpYWxvZzogZnVuY3Rpb24gY3JlYXRlQ29tcGxldGVEaWFsb2coYnVzeUluZGljYXRvciwgcmVzdWx0ID0ge30pIHtcclxuICAgIEFwcC5tb2RhbC5kaXNhYmxlQ2xvc2UgPSBmYWxzZTtcclxuICAgIEFwcC5tb2RhbC5zaG93VG9vbGJhciA9IHRydWU7XHJcbiAgICBidXN5SW5kaWNhdG9yLmNvbXBsZXRlKHRydWUpO1xyXG4gICAgQXBwLm1vZGFsLnJlc29sdmVEZWZlcnJlZCh0cnVlKTtcclxuICAgIC8vIEF0dGFjaCByZXNvbHZlIHRvIG1vdmUgdG8gYnJpZWZjYXNlIGxpc3QgKGlmIHVzZXIgaGl0cyBva2F5KVxyXG4gICAgcmV0dXJuIEFwcC5tb2RhbC5jcmVhdGVTaW1wbGVEaWFsb2coeyB0aXRsZTogJ2NvbXBsZXRlJywgY29udGVudDogcmVzb3VyY2UuZ29Ub0xpc3RWaWV3VGV4dCwgZ2V0Q29udGVudDogKCkgPT4geyByZXR1cm4gcmVzdWx0OyB9LCBsZWZ0QnV0dG9uOiAnY2FuY2VsJywgcmlnaHRCdXR0b246ICdva2F5JyB9KTtcclxuICB9LFxyXG4gIGdldE9mZmxpbmVJY29uOiBmdW5jdGlvbiBnZXRPZmZsaW5lSWNvbigpIHtcclxuICAgIGNvbnN0IG1vZGVsID0gdGhpcy5nZXRNb2RlbCgpO1xyXG4gICAgcmV0dXJuIG1vZGVsLmdldEljb25DbGFzcygpO1xyXG4gIH0sXHJcbiAgb25MaXN0QnJpZWZjYXNlZDogZnVuY3Rpb24gb25MaXN0QnJpZWZjYXNlZCgpIHtcclxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmFwcC5nZXRWaWV3KCdicmllZmNhc2VfbGlzdCcpO1xyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgdmlldy5zaG93KHt9KTtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuIl19