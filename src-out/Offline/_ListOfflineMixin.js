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