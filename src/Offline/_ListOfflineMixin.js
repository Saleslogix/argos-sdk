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


/**
 * @class argos._DetailOfflineMixin
 * A mixin that provides the detail view offline specific methods and properties
 * @alternateClassName _DetailOfflineMixin
 */
export default declare('argos.Offline._ListOfflineMixin', null, {

  createToolLayout: function createToolLayout() {
    if (this.tools) {
      return this.tools;
    }
    const tools = this.inherited(arguments);
    if (tools && tools.tbar && this.enableOffline) {
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
    const entities = [];
    if (this.entries) {
      for (const entryId in this.entries) {
        if (this.entries.hasOwnProperty(entryId)) {
          entities.push(this.createBriefcaseEntity(this.entries[entryId]));
        }
      }
    }
    OfflineManager.briefCaseEntities(entities).then(function success() {
    }, function err(error) {
      console.error(error);// eslint-disable-line
    });
  },
  createBriefcaseEntity: function createBriefcaseEntry(entry) {
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
  getOfflineIcon: function getOfflineIcon() {
    const model = this.getModel();
    return model.getIconClass();
  },
});
