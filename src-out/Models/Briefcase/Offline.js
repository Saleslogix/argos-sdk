define('argos/Models/Briefcase/Offline', ['module', 'exports', 'dojo/_base/declare', '../_OfflineModelBase', '../Manager', '../Types', '../../I18n'], function (module, exports, _declare, _OfflineModelBase2, _Manager, _Types, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _OfflineModelBase3 = _interopRequireDefault(_OfflineModelBase2);

  var _Manager2 = _interopRequireDefault(_Manager);

  var _Types2 = _interopRequireDefault(_Types);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  const resource = (0, _I18n2.default)('briefcaseModel');

  /**
   * @class
   * @alias module:argos/Models/Briefcase/Offline
   * @extends module:argos/Models/_OfflineModelBase
   */
  /* Copyright 2017 Infor
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
   * @module argos/Models/Briefcase/Offline
   */
  const __class = (0, _declare2.default)('argos.Models.Briefcase.Offline', [_OfflineModelBase3.default], /** @lends module:argos/Models/Briefcase/Offline.prototype */{
    id: 'briefcase_offline_model',
    entityName: 'Briefcase',
    modelName: 'Briefcase',
    entityDisplayName: resource.entityDisplayName,
    entityDisplayNamePlural: resource.entityDisplayNamePlural,
    isSystem: true,
    createEntry: function createEntity(entry, model, options) {
      const entity = {}; // need to dynamicly create Properties;
      entity.$key = `${model.entityName}_${model.getEntityId(entry)}`;
      entity.$descriptor = model.getEntityDescription(entry);
      entity.createDate = moment().toDate();
      entity.modifyDate = moment().toDate();
      entity.entityId = model.getEntityId(entry);
      entity.entityName = model.entityName;
      entity.description = model.getEntityDescription(entry);
      entity.entityDisplayName = model.entityDisplayName;
      entity.resourceKind = model.resourceKind;
      entity.viewId = options && options.viewId ? options.viewId : model.detailViewId;
      entity.iconClass = options && options.iconClass ? options.iconClass : model.getIconClass(entry);
      return entity;
    },
    deleteEntryByEntityContext: function deleteEntryByEntityContext(entityId, entityName) {
      const options = {
        filter: function filter(entry) {
          if (entry.entityId === entityId && entry.entityName === entityName) {
            return entry;
          }
        }
      };
      this.getEntries(null, options).then(entries => {
        if (entries) {
          entries.forEach(entry => {
            this.deleteEntry(entry.$key);
          });
        }
      });
    }
  });

  _Manager2.default.register('Briefcase', _Types2.default.OFFLINE, __class);
  exports.default = __class;
  module.exports = exports['default'];
});