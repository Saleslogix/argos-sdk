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
   * @class
   * @alias module:argos/Offline/_DetailOfflineMixin
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

  /**
   * @module argos/Offline/_DetailOfflineMixin
   */
  exports.default = (0, _declare2.default)('argos.Offline._DetailOfflineMixin', null, /** @lends module:argos/Offline/_DetailOfflineMixin.prototype */{

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