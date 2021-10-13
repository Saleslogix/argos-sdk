define('argos/Models/RecentlyViewed/Offline', ['module', 'exports', 'dojo/_base/declare', '../_OfflineModelBase', '../Manager', '../Types', '../../I18n'], function (module, exports, _declare, _OfflineModelBase2, _Manager, _Types, _I18n) {
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

  var resource = (0, _I18n2.default)('recentlyViewedModel');

  /**
   * @class
   * @alias module:argos/Models/RecentlyViewed/Offline
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
   * @module argos/Models/RecentlyViewed/Offline
   */
  var __class = (0, _declare2.default)('argos.Models.RecentlyViewed.Offline', [_OfflineModelBase3.default], /** @lends module:argos/Models/RecentlyViewed/Offline.prototype*/{
    id: 'recentlyviewed_offline_model',
    entityName: 'RecentlyViewed',
    modelName: 'RecentlyViewed',
    entityDisplayName: resource.entityDisplayName,
    entityDisplayNamePlural: resource.entityDisplayNamePlural,
    isSystem: true,
    createEntry: function createEntity(viewId, entry, model) {
      var entity = {}; // need to dynamicly create Properties;
      entity.$key = viewId + '_' + model.getEntityId(entry);
      entity.$descriptor = model.getEntityDescription(entry);
      entity.createDate = moment().toDate();
      entity.modifyDate = moment().toDate();
      entity.entityId = model.getEntityId(entry);
      entity.entityName = model.entityName;
      entity.description = model.getEntityDescription(entry);
      entity.entityDisplayName = model.entityDisplayName;
      entity.resourceKind = model.resourceKind;
      entity.viewId = viewId;
      entity.iconClass = model.getIconClass(entry);
      return entity;
    },
    deleteEntryByEntityContext: function deleteEntryByEntityContext(entityId, entityName) {
      var _this = this;

      var options = {
        filter: function filter(entry) {
          if (entry.entityId === entityId && entry.entityName === entityName) {
            return entry;
          }
        }
      };
      this.getEntries(null, options).then(function (entries) {
        if (entries) {
          entries.forEach(function (entry) {
            _this.deleteEntry(entry.$key);
          });
        }
      });
    }
  });

  _Manager2.default.register('RecentlyViewed', _Types2.default.OFFLINE, __class);
  exports.default = __class;
  module.exports = exports['default'];
});