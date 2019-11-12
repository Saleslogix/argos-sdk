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

  var resource = (0, _I18n2.default)('briefcaseModel');

  /**
   * @class argos.Models.Briefcase.Offline
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

  var __class = (0, _declare2.default)('argos.Models.Briefcase.Offline', [_OfflineModelBase3.default], {
    id: 'briefcase_offline_model',
    entityName: 'Briefcase',
    modelName: 'Briefcase',
    entityDisplayName: resource.entityDisplayName,
    entityDisplayNamePlural: resource.entityDisplayNamePlural,
    isSystem: true,
    createEntry: function createEntity(entry, model, options) {
      var entity = {}; // need to dynamicly create Properties;
      entity.$key = model.entityName + '_' + model.getEntityId(entry);
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

  _Manager2.default.register('Briefcase', _Types2.default.OFFLINE, __class);
  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL3NyYy9Nb2RlbHMvQnJpZWZjYXNlL09mZmxpbmUuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwiaWQiLCJlbnRpdHlOYW1lIiwibW9kZWxOYW1lIiwiZW50aXR5RGlzcGxheU5hbWUiLCJlbnRpdHlEaXNwbGF5TmFtZVBsdXJhbCIsImlzU3lzdGVtIiwiY3JlYXRlRW50cnkiLCJjcmVhdGVFbnRpdHkiLCJlbnRyeSIsIm1vZGVsIiwib3B0aW9ucyIsImVudGl0eSIsIiRrZXkiLCJnZXRFbnRpdHlJZCIsIiRkZXNjcmlwdG9yIiwiZ2V0RW50aXR5RGVzY3JpcHRpb24iLCJjcmVhdGVEYXRlIiwibW9tZW50IiwidG9EYXRlIiwibW9kaWZ5RGF0ZSIsImVudGl0eUlkIiwiZGVzY3JpcHRpb24iLCJyZXNvdXJjZUtpbmQiLCJ2aWV3SWQiLCJkZXRhaWxWaWV3SWQiLCJpY29uQ2xhc3MiLCJnZXRJY29uQ2xhc3MiLCJkZWxldGVFbnRyeUJ5RW50aXR5Q29udGV4dCIsImZpbHRlciIsImdldEVudHJpZXMiLCJ0aGVuIiwiZW50cmllcyIsImZvckVhY2giLCJkZWxldGVFbnRyeSIsInJlZ2lzdGVyIiwiT0ZGTElORSJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBc0JBLE1BQU1BLFdBQVcsb0JBQVksZ0JBQVosQ0FBakI7O0FBRUE7OztBQXhCQTs7Ozs7Ozs7Ozs7Ozs7O0FBMkJBLE1BQU1DLFVBQVUsdUJBQVEsZ0NBQVIsRUFBMEMsNEJBQTFDLEVBQStEO0FBQzdFQyxRQUFJLHlCQUR5RTtBQUU3RUMsZ0JBQVksV0FGaUU7QUFHN0VDLGVBQVcsV0FIa0U7QUFJN0VDLHVCQUFtQkwsU0FBU0ssaUJBSmlEO0FBSzdFQyw2QkFBeUJOLFNBQVNNLHVCQUwyQztBQU03RUMsY0FBVSxJQU5tRTtBQU83RUMsaUJBQWEsU0FBU0MsWUFBVCxDQUFzQkMsS0FBdEIsRUFBNkJDLEtBQTdCLEVBQW9DQyxPQUFwQyxFQUE2QztBQUN4RCxVQUFNQyxTQUFTLEVBQWYsQ0FEd0QsQ0FDckM7QUFDbkJBLGFBQU9DLElBQVAsR0FBaUJILE1BQU1SLFVBQXZCLFNBQXFDUSxNQUFNSSxXQUFOLENBQWtCTCxLQUFsQixDQUFyQztBQUNBRyxhQUFPRyxXQUFQLEdBQXFCTCxNQUFNTSxvQkFBTixDQUEyQlAsS0FBM0IsQ0FBckI7QUFDQUcsYUFBT0ssVUFBUCxHQUFvQkMsU0FBU0MsTUFBVCxFQUFwQjtBQUNBUCxhQUFPUSxVQUFQLEdBQW9CRixTQUFTQyxNQUFULEVBQXBCO0FBQ0FQLGFBQU9TLFFBQVAsR0FBa0JYLE1BQU1JLFdBQU4sQ0FBa0JMLEtBQWxCLENBQWxCO0FBQ0FHLGFBQU9WLFVBQVAsR0FBb0JRLE1BQU1SLFVBQTFCO0FBQ0FVLGFBQU9VLFdBQVAsR0FBcUJaLE1BQU1NLG9CQUFOLENBQTJCUCxLQUEzQixDQUFyQjtBQUNBRyxhQUFPUixpQkFBUCxHQUEyQk0sTUFBTU4saUJBQWpDO0FBQ0FRLGFBQU9XLFlBQVAsR0FBc0JiLE1BQU1hLFlBQTVCO0FBQ0FYLGFBQU9ZLE1BQVAsR0FBaUJiLFdBQVdBLFFBQVFhLE1BQXBCLEdBQThCYixRQUFRYSxNQUF0QyxHQUErQ2QsTUFBTWUsWUFBckU7QUFDQWIsYUFBT2MsU0FBUCxHQUFvQmYsV0FBV0EsUUFBUWUsU0FBcEIsR0FBaUNmLFFBQVFlLFNBQXpDLEdBQXFEaEIsTUFBTWlCLFlBQU4sQ0FBbUJsQixLQUFuQixDQUF4RTtBQUNBLGFBQU9HLE1BQVA7QUFDRCxLQXJCNEU7QUFzQjdFZ0IsZ0NBQTRCLFNBQVNBLDBCQUFULENBQW9DUCxRQUFwQyxFQUE4Q25CLFVBQTlDLEVBQTBEO0FBQUE7O0FBQ3BGLFVBQU1TLFVBQVU7QUFDZGtCLGdCQUFRLFNBQVNBLE1BQVQsQ0FBZ0JwQixLQUFoQixFQUF1QjtBQUM3QixjQUFJQSxNQUFNWSxRQUFOLEtBQW1CQSxRQUFuQixJQUErQlosTUFBTVAsVUFBTixLQUFxQkEsVUFBeEQsRUFBb0U7QUFDbEUsbUJBQU9PLEtBQVA7QUFDRDtBQUNGO0FBTGEsT0FBaEI7QUFPQSxXQUFLcUIsVUFBTCxDQUFnQixJQUFoQixFQUFzQm5CLE9BQXRCLEVBQStCb0IsSUFBL0IsQ0FBb0MsVUFBQ0MsT0FBRCxFQUFhO0FBQy9DLFlBQUlBLE9BQUosRUFBYTtBQUNYQSxrQkFBUUMsT0FBUixDQUFnQixVQUFDeEIsS0FBRCxFQUFXO0FBQ3pCLGtCQUFLeUIsV0FBTCxDQUFpQnpCLE1BQU1JLElBQXZCO0FBQ0QsV0FGRDtBQUdEO0FBQ0YsT0FORDtBQU9EO0FBckM0RSxHQUEvRCxDQUFoQjs7QUF3Q0Esb0JBQVFzQixRQUFSLENBQWlCLFdBQWpCLEVBQThCLGdCQUFZQyxPQUExQyxFQUFtRHBDLE9BQW5EO29CQUNlQSxPIiwiZmlsZSI6Ik9mZmxpbmUuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgX09mZmxpbmVNb2RlbEJhc2UgZnJvbSAnLi4vX09mZmxpbmVNb2RlbEJhc2UnO1xyXG5pbXBvcnQgTWFuYWdlciBmcm9tICcuLi9NYW5hZ2VyJztcclxuaW1wb3J0IE1PREVMX1RZUEVTIGZyb20gJy4uL1R5cGVzJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4uLy4uL0kxOG4nO1xyXG5cclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ2JyaWVmY2FzZU1vZGVsJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLk1vZGVscy5CcmllZmNhc2UuT2ZmbGluZVxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLk1vZGVscy5CcmllZmNhc2UuT2ZmbGluZScsIFtfT2ZmbGluZU1vZGVsQmFzZV0sIHtcclxuICBpZDogJ2JyaWVmY2FzZV9vZmZsaW5lX21vZGVsJyxcclxuICBlbnRpdHlOYW1lOiAnQnJpZWZjYXNlJyxcclxuICBtb2RlbE5hbWU6ICdCcmllZmNhc2UnLFxyXG4gIGVudGl0eURpc3BsYXlOYW1lOiByZXNvdXJjZS5lbnRpdHlEaXNwbGF5TmFtZSxcclxuICBlbnRpdHlEaXNwbGF5TmFtZVBsdXJhbDogcmVzb3VyY2UuZW50aXR5RGlzcGxheU5hbWVQbHVyYWwsXHJcbiAgaXNTeXN0ZW06IHRydWUsXHJcbiAgY3JlYXRlRW50cnk6IGZ1bmN0aW9uIGNyZWF0ZUVudGl0eShlbnRyeSwgbW9kZWwsIG9wdGlvbnMpIHtcclxuICAgIGNvbnN0IGVudGl0eSA9IHt9OyAvLyBuZWVkIHRvIGR5bmFtaWNseSBjcmVhdGUgUHJvcGVydGllcztcclxuICAgIGVudGl0eS4ka2V5ID0gYCR7bW9kZWwuZW50aXR5TmFtZX1fJHttb2RlbC5nZXRFbnRpdHlJZChlbnRyeSl9YDtcclxuICAgIGVudGl0eS4kZGVzY3JpcHRvciA9IG1vZGVsLmdldEVudGl0eURlc2NyaXB0aW9uKGVudHJ5KTtcclxuICAgIGVudGl0eS5jcmVhdGVEYXRlID0gbW9tZW50KCkudG9EYXRlKCk7XHJcbiAgICBlbnRpdHkubW9kaWZ5RGF0ZSA9IG1vbWVudCgpLnRvRGF0ZSgpO1xyXG4gICAgZW50aXR5LmVudGl0eUlkID0gbW9kZWwuZ2V0RW50aXR5SWQoZW50cnkpO1xyXG4gICAgZW50aXR5LmVudGl0eU5hbWUgPSBtb2RlbC5lbnRpdHlOYW1lO1xyXG4gICAgZW50aXR5LmRlc2NyaXB0aW9uID0gbW9kZWwuZ2V0RW50aXR5RGVzY3JpcHRpb24oZW50cnkpO1xyXG4gICAgZW50aXR5LmVudGl0eURpc3BsYXlOYW1lID0gbW9kZWwuZW50aXR5RGlzcGxheU5hbWU7XHJcbiAgICBlbnRpdHkucmVzb3VyY2VLaW5kID0gbW9kZWwucmVzb3VyY2VLaW5kO1xyXG4gICAgZW50aXR5LnZpZXdJZCA9IChvcHRpb25zICYmIG9wdGlvbnMudmlld0lkKSA/IG9wdGlvbnMudmlld0lkIDogbW9kZWwuZGV0YWlsVmlld0lkO1xyXG4gICAgZW50aXR5Lmljb25DbGFzcyA9IChvcHRpb25zICYmIG9wdGlvbnMuaWNvbkNsYXNzKSA/IG9wdGlvbnMuaWNvbkNsYXNzIDogbW9kZWwuZ2V0SWNvbkNsYXNzKGVudHJ5KTtcclxuICAgIHJldHVybiBlbnRpdHk7XHJcbiAgfSxcclxuICBkZWxldGVFbnRyeUJ5RW50aXR5Q29udGV4dDogZnVuY3Rpb24gZGVsZXRlRW50cnlCeUVudGl0eUNvbnRleHQoZW50aXR5SWQsIGVudGl0eU5hbWUpIHtcclxuICAgIGNvbnN0IG9wdGlvbnMgPSB7XHJcbiAgICAgIGZpbHRlcjogZnVuY3Rpb24gZmlsdGVyKGVudHJ5KSB7XHJcbiAgICAgICAgaWYgKGVudHJ5LmVudGl0eUlkID09PSBlbnRpdHlJZCAmJiBlbnRyeS5lbnRpdHlOYW1lID09PSBlbnRpdHlOYW1lKSB7XHJcbiAgICAgICAgICByZXR1cm4gZW50cnk7XHJcbiAgICAgICAgfVxyXG4gICAgICB9LFxyXG4gICAgfTtcclxuICAgIHRoaXMuZ2V0RW50cmllcyhudWxsLCBvcHRpb25zKS50aGVuKChlbnRyaWVzKSA9PiB7XHJcbiAgICAgIGlmIChlbnRyaWVzKSB7XHJcbiAgICAgICAgZW50cmllcy5mb3JFYWNoKChlbnRyeSkgPT4ge1xyXG4gICAgICAgICAgdGhpcy5kZWxldGVFbnRyeShlbnRyeS4ka2V5KTtcclxuICAgICAgICB9KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfSxcclxufSk7XHJcblxyXG5NYW5hZ2VyLnJlZ2lzdGVyKCdCcmllZmNhc2UnLCBNT0RFTF9UWVBFUy5PRkZMSU5FLCBfX2NsYXNzKTtcclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19