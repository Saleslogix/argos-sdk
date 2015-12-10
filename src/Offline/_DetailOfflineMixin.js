/* Copyright (c) 2015 Infor. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import declare from 'dojo/_base/declare';
import OfflineManager from './Manager';
import BusyIndicator from '../Dialogs/BusyIndicator';
import ErrorManager from '../ErrorManager';
import getResource from '../I18n';

const resource = getResource('_detailOfflineMixin');


/**
 * @class argos.Offline._DetailOfflineMixin
 * A mixin that provides the detail view offline specific methods and properties
 * @alternateClassName _DetailOfflineMixin
 */
export default declare('argos.Offline._DetailOfflineMixin', null, {

  createToolLayout: function createToolLayout() {
    if (this.tools) {
      return this.tools;
    }
    const tools = this.inherited(arguments);
    if (tools && tools.tbar && this.enableOffline && App.enableOfflineSupport) {
      tools.tbar.push({
        id: 'briefCase',
        cls: 'fa fa-suitcase fa-fw fa-lg',
        action: 'briefCaseEntity',
        security: '',
      });
    }
    return tools;
  },
  briefCaseEntity: function briefCaseEntity(action, selection) { // eslint-disable-line
    // Start busy indicator modal
    const busyIndicator = this.createBusyModal();

    // Start briefcasing
    const entityName = this.modelName;
    const entityId = this.entry.$key; // thie should be resolved from the model or adapter.
    const options = {
      includeRelated: true,
      viewId: this.id,
    };
    OfflineManager.briefCaseEntity(entityName, entityId, options).then((result) => {
      // Show complete modal dialog
      const modalPromise = this.createCompleteDialog(busyIndicator, result);
      modalPromise.then(this.onEntityBriefcased.bind(this));
    }, (error) => {
      ErrorManager.addSimpleError(resource.errorBriefcasingText + ' ' + this.id, error);
      this.createAlertDialog(busyIndicator);
    });
  },
  createAlertDialog: function createAlertDialog(busyIndicator) {
    App.modal.disableClose = false;
    App.modal.showToolbar = true;
    busyIndicator.complete(true);
    App.modal.resolveDeferred(true);
    // Attach resolve to move to briefcase list (if user hits okay)
    return App.modal.createSimpleDialog({ title: 'alert', content: resource.interruptedText, getContent: () => { return; }, leftButton: 'cancel', rightButton: 'confirm' });
  },
  createBusyModal: function createBusyModal() {
    App.modal.disableClose = true;
    App.modal.showToolbar = false;
    const busyIndicator = new BusyIndicator({
      id: 'busyIndicator__offline-list-briefcase',
      label: resource.briefcasingText,
    });
    App.modal.add(busyIndicator);
    busyIndicator.start();
    return busyIndicator;
  },
  createCompleteDialog: function createCompleteDialog(busyIndicator, result = {}) {
    App.modal.disableClose = false;
    App.modal.showToolbar = true;
    busyIndicator.complete(true);
    App.modal.resolveDeferred(true);
    // Attach resolve to move to briefcase list (if user hits okay)
    return App.modal.createSimpleDialog({ title: 'complete', content: resource.goToDetailViewText, getContent: () => { return result; }, leftButton: 'cancel', rightButton: 'okay' });
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
      OfflineManager.saveDetailView(this).then(function success() {
      }, function err(error) {
        ErrorManager.addSimpleError(resource.errorSavingOfflineViewText + ' ' + this.id, error);
      });
    }
  },
  getOfflineDescription: function getOfflineDescription() {
    return this.entry.$descriptor;
  },
  getOfflineIcon: function getOfflineIcon() {
    const model = this.getModel();
    return model.getIconClass();
  },
  onEntityBriefcased: function onEntityBriefcased() {
    const view = this.app.getView('briefcase_list');
    if (view) {
      view.show({});
    }
  },
});
