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
   * @class argos.Models.RecentlyViewed.Offline
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

  var __class = (0, _declare2.default)('argos.Models.RecentlyViewed.Offline', [_OfflineModelBase3.default], {
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9Nb2RlbHMvUmVjZW50bHlWaWV3ZWQvT2ZmbGluZS5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJpZCIsImVudGl0eU5hbWUiLCJtb2RlbE5hbWUiLCJlbnRpdHlEaXNwbGF5TmFtZSIsImVudGl0eURpc3BsYXlOYW1lUGx1cmFsIiwiaXNTeXN0ZW0iLCJjcmVhdGVFbnRyeSIsImNyZWF0ZUVudGl0eSIsInZpZXdJZCIsImVudHJ5IiwibW9kZWwiLCJlbnRpdHkiLCIka2V5IiwiZ2V0RW50aXR5SWQiLCIkZGVzY3JpcHRvciIsImdldEVudGl0eURlc2NyaXB0aW9uIiwiY3JlYXRlRGF0ZSIsIm1vbWVudCIsInRvRGF0ZSIsIm1vZGlmeURhdGUiLCJlbnRpdHlJZCIsImRlc2NyaXB0aW9uIiwicmVzb3VyY2VLaW5kIiwiaWNvbkNsYXNzIiwiZ2V0SWNvbkNsYXNzIiwiZGVsZXRlRW50cnlCeUVudGl0eUNvbnRleHQiLCJvcHRpb25zIiwiZmlsdGVyIiwiZ2V0RW50cmllcyIsInRoZW4iLCJlbnRyaWVzIiwiZm9yRWFjaCIsImRlbGV0ZUVudHJ5IiwicmVnaXN0ZXIiLCJPRkZMSU5FIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFzQkEsTUFBTUEsV0FBVyxvQkFBWSxxQkFBWixDQUFqQjs7QUFFQTs7O0FBeEJBOzs7Ozs7Ozs7Ozs7Ozs7QUEyQkEsTUFBTUMsVUFBVSx1QkFBUSxxQ0FBUixFQUErQyw0QkFBL0MsRUFBb0U7QUFDbEZDLFFBQUksOEJBRDhFO0FBRWxGQyxnQkFBWSxnQkFGc0U7QUFHbEZDLGVBQVcsZ0JBSHVFO0FBSWxGQyx1QkFBbUJMLFNBQVNLLGlCQUpzRDtBQUtsRkMsNkJBQXlCTixTQUFTTSx1QkFMZ0Q7QUFNbEZDLGNBQVUsSUFOd0U7QUFPbEZDLGlCQUFhLFNBQVNDLFlBQVQsQ0FBc0JDLE1BQXRCLEVBQThCQyxLQUE5QixFQUFxQ0MsS0FBckMsRUFBNEM7QUFDdkQsVUFBTUMsU0FBUyxFQUFmLENBRHVELENBQ3BDO0FBQ25CQSxhQUFPQyxJQUFQLEdBQWlCSixNQUFqQixTQUEyQkUsTUFBTUcsV0FBTixDQUFrQkosS0FBbEIsQ0FBM0I7QUFDQUUsYUFBT0csV0FBUCxHQUFxQkosTUFBTUssb0JBQU4sQ0FBMkJOLEtBQTNCLENBQXJCO0FBQ0FFLGFBQU9LLFVBQVAsR0FBb0JDLFNBQVNDLE1BQVQsRUFBcEI7QUFDQVAsYUFBT1EsVUFBUCxHQUFvQkYsU0FBU0MsTUFBVCxFQUFwQjtBQUNBUCxhQUFPUyxRQUFQLEdBQWtCVixNQUFNRyxXQUFOLENBQWtCSixLQUFsQixDQUFsQjtBQUNBRSxhQUFPVixVQUFQLEdBQW9CUyxNQUFNVCxVQUExQjtBQUNBVSxhQUFPVSxXQUFQLEdBQXFCWCxNQUFNSyxvQkFBTixDQUEyQk4sS0FBM0IsQ0FBckI7QUFDQUUsYUFBT1IsaUJBQVAsR0FBMkJPLE1BQU1QLGlCQUFqQztBQUNBUSxhQUFPVyxZQUFQLEdBQXNCWixNQUFNWSxZQUE1QjtBQUNBWCxhQUFPSCxNQUFQLEdBQWdCQSxNQUFoQjtBQUNBRyxhQUFPWSxTQUFQLEdBQW1CYixNQUFNYyxZQUFOLENBQW1CZixLQUFuQixDQUFuQjtBQUNBLGFBQU9FLE1BQVA7QUFDRCxLQXJCaUY7QUFzQmxGYyxnQ0FBNEIsU0FBU0EsMEJBQVQsQ0FBb0NMLFFBQXBDLEVBQThDbkIsVUFBOUMsRUFBMEQ7QUFBQTs7QUFDcEYsVUFBTXlCLFVBQVU7QUFDZEMsZ0JBQVEsU0FBU0EsTUFBVCxDQUFnQmxCLEtBQWhCLEVBQXVCO0FBQzdCLGNBQUlBLE1BQU1XLFFBQU4sS0FBbUJBLFFBQW5CLElBQStCWCxNQUFNUixVQUFOLEtBQXFCQSxVQUF4RCxFQUFvRTtBQUNsRSxtQkFBT1EsS0FBUDtBQUNEO0FBQ0Y7QUFMYSxPQUFoQjtBQU9BLFdBQUttQixVQUFMLENBQWdCLElBQWhCLEVBQXNCRixPQUF0QixFQUErQkcsSUFBL0IsQ0FBb0MsVUFBQ0MsT0FBRCxFQUFhO0FBQy9DLFlBQUlBLE9BQUosRUFBYTtBQUNYQSxrQkFBUUMsT0FBUixDQUFnQixVQUFDdEIsS0FBRCxFQUFXO0FBQ3pCLGtCQUFLdUIsV0FBTCxDQUFpQnZCLE1BQU1HLElBQXZCO0FBQ0QsV0FGRDtBQUdEO0FBQ0YsT0FORDtBQU9EO0FBckNpRixHQUFwRSxDQUFoQjs7QUF3Q0Esb0JBQVFxQixRQUFSLENBQWlCLGdCQUFqQixFQUFtQyxnQkFBWUMsT0FBL0MsRUFBd0RuQyxPQUF4RDtvQkFDZUEsTyIsImZpbGUiOiJPZmZsaW5lLmpzIiwic291cmNlUm9vdCI6InNyYyIsInNvdXJjZXNDb250ZW50IjpbIi8qIENvcHlyaWdodCAyMDE3IEluZm9yXHJcbiAqXHJcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XHJcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cclxuICogWW91IG1heSBvYnRhaW4gYSBjb3B5IG9mIHRoZSBMaWNlbnNlIGF0XHJcbiAqXHJcbiAqICAgIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxyXG4gKlxyXG4gKiBVbmxlc3MgcmVxdWlyZWQgYnkgYXBwbGljYWJsZSBsYXcgb3IgYWdyZWVkIHRvIGluIHdyaXRpbmcsIHNvZnR3YXJlXHJcbiAqIGRpc3RyaWJ1dGVkIHVuZGVyIHRoZSBMaWNlbnNlIGlzIGRpc3RyaWJ1dGVkIG9uIGFuIFwiQVMgSVNcIiBCQVNJUyxcclxuICogV0lUSE9VVCBXQVJSQU5USUVTIE9SIENPTkRJVElPTlMgT0YgQU5ZIEtJTkQsIGVpdGhlciBleHByZXNzIG9yIGltcGxpZWQuXHJcbiAqIFNlZSB0aGUgTGljZW5zZSBmb3IgdGhlIHNwZWNpZmljIGxhbmd1YWdlIGdvdmVybmluZyBwZXJtaXNzaW9ucyBhbmRcclxuICogbGltaXRhdGlvbnMgdW5kZXIgdGhlIExpY2Vuc2UuXHJcbiAqL1xyXG5cclxuaW1wb3J0IGRlY2xhcmUgZnJvbSAnZG9qby9fYmFzZS9kZWNsYXJlJztcclxuaW1wb3J0IF9PZmZsaW5lTW9kZWxCYXNlIGZyb20gJy4uL19PZmZsaW5lTW9kZWxCYXNlJztcclxuaW1wb3J0IE1hbmFnZXIgZnJvbSAnLi4vTWFuYWdlcic7XHJcbmltcG9ydCBNT0RFTF9UWVBFUyBmcm9tICcuLi9UeXBlcyc7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuLi8uLi9JMThuJztcclxuXHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdyZWNlbnRseVZpZXdlZE1vZGVsJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLk1vZGVscy5SZWNlbnRseVZpZXdlZC5PZmZsaW5lXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuTW9kZWxzLlJlY2VudGx5Vmlld2VkLk9mZmxpbmUnLCBbX09mZmxpbmVNb2RlbEJhc2VdLCB7XHJcbiAgaWQ6ICdyZWNlbnRseXZpZXdlZF9vZmZsaW5lX21vZGVsJyxcclxuICBlbnRpdHlOYW1lOiAnUmVjZW50bHlWaWV3ZWQnLFxyXG4gIG1vZGVsTmFtZTogJ1JlY2VudGx5Vmlld2VkJyxcclxuICBlbnRpdHlEaXNwbGF5TmFtZTogcmVzb3VyY2UuZW50aXR5RGlzcGxheU5hbWUsXHJcbiAgZW50aXR5RGlzcGxheU5hbWVQbHVyYWw6IHJlc291cmNlLmVudGl0eURpc3BsYXlOYW1lUGx1cmFsLFxyXG4gIGlzU3lzdGVtOiB0cnVlLFxyXG4gIGNyZWF0ZUVudHJ5OiBmdW5jdGlvbiBjcmVhdGVFbnRpdHkodmlld0lkLCBlbnRyeSwgbW9kZWwpIHtcclxuICAgIGNvbnN0IGVudGl0eSA9IHt9OyAvLyBuZWVkIHRvIGR5bmFtaWNseSBjcmVhdGUgUHJvcGVydGllcztcclxuICAgIGVudGl0eS4ka2V5ID0gYCR7dmlld0lkfV8ke21vZGVsLmdldEVudGl0eUlkKGVudHJ5KX1gO1xyXG4gICAgZW50aXR5LiRkZXNjcmlwdG9yID0gbW9kZWwuZ2V0RW50aXR5RGVzY3JpcHRpb24oZW50cnkpO1xyXG4gICAgZW50aXR5LmNyZWF0ZURhdGUgPSBtb21lbnQoKS50b0RhdGUoKTtcclxuICAgIGVudGl0eS5tb2RpZnlEYXRlID0gbW9tZW50KCkudG9EYXRlKCk7XHJcbiAgICBlbnRpdHkuZW50aXR5SWQgPSBtb2RlbC5nZXRFbnRpdHlJZChlbnRyeSk7XHJcbiAgICBlbnRpdHkuZW50aXR5TmFtZSA9IG1vZGVsLmVudGl0eU5hbWU7XHJcbiAgICBlbnRpdHkuZGVzY3JpcHRpb24gPSBtb2RlbC5nZXRFbnRpdHlEZXNjcmlwdGlvbihlbnRyeSk7XHJcbiAgICBlbnRpdHkuZW50aXR5RGlzcGxheU5hbWUgPSBtb2RlbC5lbnRpdHlEaXNwbGF5TmFtZTtcclxuICAgIGVudGl0eS5yZXNvdXJjZUtpbmQgPSBtb2RlbC5yZXNvdXJjZUtpbmQ7XHJcbiAgICBlbnRpdHkudmlld0lkID0gdmlld0lkO1xyXG4gICAgZW50aXR5Lmljb25DbGFzcyA9IG1vZGVsLmdldEljb25DbGFzcyhlbnRyeSk7XHJcbiAgICByZXR1cm4gZW50aXR5O1xyXG4gIH0sXHJcbiAgZGVsZXRlRW50cnlCeUVudGl0eUNvbnRleHQ6IGZ1bmN0aW9uIGRlbGV0ZUVudHJ5QnlFbnRpdHlDb250ZXh0KGVudGl0eUlkLCBlbnRpdHlOYW1lKSB7XHJcbiAgICBjb25zdCBvcHRpb25zID0ge1xyXG4gICAgICBmaWx0ZXI6IGZ1bmN0aW9uIGZpbHRlcihlbnRyeSkge1xyXG4gICAgICAgIGlmIChlbnRyeS5lbnRpdHlJZCA9PT0gZW50aXR5SWQgJiYgZW50cnkuZW50aXR5TmFtZSA9PT0gZW50aXR5TmFtZSkge1xyXG4gICAgICAgICAgcmV0dXJuIGVudHJ5O1xyXG4gICAgICAgIH1cclxuICAgICAgfSxcclxuICAgIH07XHJcbiAgICB0aGlzLmdldEVudHJpZXMobnVsbCwgb3B0aW9ucykudGhlbigoZW50cmllcykgPT4ge1xyXG4gICAgICBpZiAoZW50cmllcykge1xyXG4gICAgICAgIGVudHJpZXMuZm9yRWFjaCgoZW50cnkpID0+IHtcclxuICAgICAgICAgIHRoaXMuZGVsZXRlRW50cnkoZW50cnkuJGtleSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuTWFuYWdlci5yZWdpc3RlcignUmVjZW50bHlWaWV3ZWQnLCBNT0RFTF9UWVBFUy5PRkZMSU5FLCBfX2NsYXNzKTtcclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19