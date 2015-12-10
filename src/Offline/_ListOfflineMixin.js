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

const resource = getResource('_listOfflineMixin');


/**
 * @class argos.Offline._DetailOfflineMixin
 * A mixin that provides the detail view offline specific methods and properties
 * @alternateClassName _DetailOfflineMixin
 */
export default declare('argos.Offline._ListOfflineMixin', null, {
  autoNavigateToBriefcase: false,
  createToolLayout: function createToolLayout() {
    if (this.tools) {
      return this.tools;
    }
    const tools = this.inherited(arguments);
    if (tools && tools.tbar && this.enableOffline && App.enableOfflineSupport) {
      tools.tbar.push({
        id: 'briefCase',
        cls: 'fa fa-suitcase fa-fw fa-lg',
        action: 'briefCaseList',
        security: '',
      });
    }
    return tools;
  },
  briefCaseList: function briefCaseList(action, selection) { // eslint-disable-line
    // Start busy indicator modal
    const busyIndicator = this.createBusyModal(Object.keys(this.entries).length);
    // Start briefcasing
    const entities = [];
    if (this.entries) {
      for (const entryId in this.entries) {
        if (this.entries.hasOwnProperty(entryId)) {
          entities.push(this.createBriefcaseEntity(this.entries[entryId]));
        }
      }
    }
    OfflineManager.briefCaseEntities(entities).then((result) => {
      // Show complete modal dialog
      if (!this.autoNavigateToBriefcase) {
        const modalPromise = this.createCompleteDialog(busyIndicator, result);
        modalPromise.then(this.onListBriefcased.bind(this));
      } else {
        App.modal.disableClose = false;
        App.modal.showToolbar = true;
        busyIndicator.complete(true);
        App.modal.hide();
        this.onListBriefcased();
      }
    }, (err) => {
      // Show complete modal dialog
      this.createAlertDialog(busyIndicator);
      ErrorManager.addSimpleError(resource.errorBriefcasingText + ' ' + this.id, err);
    }, () => {
      busyIndicator.updateProgress();
    });
  },
  briefCaseItem: function briefCaseItem(briefcaseItem) { // eslint-disable-line
    // Start busy indicator modal
    const busyIndicator = this.createBusyModal(1);
    // Start briefcasing
    const entity = this.createBriefcaseEntity(briefcaseItem);
    OfflineManager.briefCaseEntity(entity.entityName, entity.entityId, entity.options).then((result) => {
      // Show complete modal dialog
      if (!this.autoNavigateToBriefcase) {
        const modalPromise = this.createCompleteDialog(busyIndicator, result);
        modalPromise.then(this.onListBriefcased.bind(this));
      } else {
        App.modal.disableClose = false;
        App.modal.showToolbar = true;
        busyIndicator.complete(true);
        App.modal.hide();
        this.onListBriefcased();
      }
    }, (err) => {
      // Show complete modal dialog
      this.createAlertDialog(busyIndicator);
      ErrorManager.addSimpleError(resource.errorBriefcasingText + ' ' + this.id, err);
    }, () => {
      busyIndicator.updateProgress();
    });
  },
  createBriefcaseEntity: function createBriefcaseEntity(entry) {
    const entity = {
      entityId: this.getIdentity(entry),
      entityName: this.entityName,
      options: {
        includeRelated: true,
        viewId: this.detailView,
        iconClass: this.getOfflineIcon(),
      },
    };
    return entity;
  },
  createAlertDialog: function createAlertDialog(busyIndicator) {
    App.modal.disableClose = false;
    App.modal.showToolbar = true;
    busyIndicator.complete(true);
    App.modal.resolveDeferred(true);
    // Attach resolve to move to briefcase list (if user hits okay)
    return App.modal.createSimpleDialog({ title: 'alert', content: resource.interruptedText, getContent: () => { return; }, leftButton: 'cancel', rightButton: 'confirm' });
  },
  createBusyModal: function createBusyModal(count) {
    App.modal.disableClose = true;
    App.modal.showToolbar = false;
    const busyIndicator = new BusyIndicator({
      id: 'busyIndicator__offline-list-briefcase',
      label: resource.briefcasingText,
    });
    App.modal.add(busyIndicator);
    busyIndicator.start({isAsync: false, total: count});
    return busyIndicator;
  },
  createCompleteDialog: function createCompleteDialog(busyIndicator, result = {}) {
    App.modal.disableClose = false;
    App.modal.showToolbar = true;
    busyIndicator.complete(true);
    App.modal.resolveDeferred(true);
    // Attach resolve to move to briefcase list (if user hits okay)
    return App.modal.createSimpleDialog({ title: 'complete', content: resource.goToListViewText, getContent: () => { return result; }, leftButton: 'cancel', rightButton: 'okay' });
  },
  getOfflineIcon: function getOfflineIcon() {
    const model = this.getModel();
    return model.getIconClass();
  },
  onListBriefcased: function onListBriefcased() {
    const view = this.app.getView('briefcase_list');
    if (view) {
      view.show({});
    }
  },
});
