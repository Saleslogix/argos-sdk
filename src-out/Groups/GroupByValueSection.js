define('argos/Groups/GroupByValueSection', ['module', 'exports', 'dojo/_base/declare', '../Utility', './_GroupBySection', '../I18n'], function (module, exports, _declare, _Utility, _GroupBySection2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Utility2 = _interopRequireDefault(_Utility);

  var _GroupBySection3 = _interopRequireDefault(_GroupBySection2);

  var _I18n2 = _interopRequireDefault(_I18n);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

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
   * @class argos.Groups.GroupByValueSection
   */
  var resource = (0, _I18n2.default)('groupByValueSection');

  var __class = (0, _declare2.default)('argos.Groups.GroupByValueSection', [_GroupBySection3.default], {
    name: 'DateTimeSectionFilter',
    displayNameText: resource.displayNameText,
    width: 0,
    constructor: function constructor(o) {
      this.groupByProperty = o.groupByProperty;
      this.sortDirection = o.sortDirection;
      if (o.width) {
        this.width = o.width;
      }
      this.init();
    },
    init: function init() {
      this.sections = [];
    },
    getSection: function getSection(entry) {
      if (this.groupByProperty && entry) {
        var value = _Utility2.default.getValue(entry, this.groupByProperty);
        value = this._getValueFromWidth(value, this.width);
        if (value) {
          return {
            key: value,
            title: value
          };
        }
        return this.getDefaultSection();
      }
      return null;
    },
    getDefaultSection: function getDefaultSection() {
      return {
        key: 'Unknown',
        title: 'Unknown'
      };
    },
    _getValueFromWidth: function _getValueFromWidth(value, width) {
      if (value) {
        if (width > 0) {
          return value.toString().substring(0, width);
        }
      }
      return value;
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9Hcm91cHMvR3JvdXBCeVZhbHVlU2VjdGlvbi5qcyJdLCJuYW1lcyI6WyJyZXNvdXJjZSIsIl9fY2xhc3MiLCJuYW1lIiwiZGlzcGxheU5hbWVUZXh0Iiwid2lkdGgiLCJjb25zdHJ1Y3RvciIsIm8iLCJncm91cEJ5UHJvcGVydHkiLCJzb3J0RGlyZWN0aW9uIiwiaW5pdCIsInNlY3Rpb25zIiwiZ2V0U2VjdGlvbiIsImVudHJ5IiwidmFsdWUiLCJnZXRWYWx1ZSIsIl9nZXRWYWx1ZUZyb21XaWR0aCIsImtleSIsInRpdGxlIiwiZ2V0RGVmYXVsdFNlY3Rpb24iLCJ0b1N0cmluZyIsInN1YnN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFlQTs7O0FBUUEsTUFBTUEsV0FBVyxvQkFBWSxxQkFBWixDQUFqQjs7QUFFQSxNQUFNQyxVQUFVLHVCQUFRLGtDQUFSLEVBQTRDLDBCQUE1QyxFQUErRDtBQUM3RUMsVUFBTSx1QkFEdUU7QUFFN0VDLHFCQUFpQkgsU0FBU0csZUFGbUQ7QUFHN0VDLFdBQU8sQ0FIc0U7QUFJN0VDLGlCQUFhLFNBQVNBLFdBQVQsQ0FBcUJDLENBQXJCLEVBQXdCO0FBQ25DLFdBQUtDLGVBQUwsR0FBdUJELEVBQUVDLGVBQXpCO0FBQ0EsV0FBS0MsYUFBTCxHQUFxQkYsRUFBRUUsYUFBdkI7QUFDQSxVQUFJRixFQUFFRixLQUFOLEVBQWE7QUFDWCxhQUFLQSxLQUFMLEdBQWFFLEVBQUVGLEtBQWY7QUFDRDtBQUNELFdBQUtLLElBQUw7QUFDRCxLQVg0RTtBQVk3RUEsVUFBTSxTQUFTQSxJQUFULEdBQWdCO0FBQ3BCLFdBQUtDLFFBQUwsR0FBZ0IsRUFBaEI7QUFDRCxLQWQ0RTtBQWU3RUMsZ0JBQVksU0FBU0EsVUFBVCxDQUFvQkMsS0FBcEIsRUFBMkI7QUFDckMsVUFBSyxLQUFLTCxlQUFOLElBQTJCSyxLQUEvQixFQUF1QztBQUNyQyxZQUFJQyxRQUFRLGtCQUFRQyxRQUFSLENBQWlCRixLQUFqQixFQUF3QixLQUFLTCxlQUE3QixDQUFaO0FBQ0FNLGdCQUFRLEtBQUtFLGtCQUFMLENBQXdCRixLQUF4QixFQUErQixLQUFLVCxLQUFwQyxDQUFSO0FBQ0EsWUFBSVMsS0FBSixFQUFXO0FBQ1QsaUJBQU87QUFDTEcsaUJBQUtILEtBREE7QUFFTEksbUJBQU9KO0FBRkYsV0FBUDtBQUlEO0FBQ0QsZUFBTyxLQUFLSyxpQkFBTCxFQUFQO0FBQ0Q7QUFDRCxhQUFPLElBQVA7QUFDRCxLQTVCNEU7QUE2QjdFQSx1QkFBbUIsU0FBU0EsaUJBQVQsR0FBNkI7QUFDOUMsYUFBTztBQUNMRixhQUFLLFNBREE7QUFFTEMsZUFBTztBQUZGLE9BQVA7QUFJRCxLQWxDNEU7QUFtQzdFRix3QkFBb0IsU0FBU0Esa0JBQVQsQ0FBNEJGLEtBQTVCLEVBQW1DVCxLQUFuQyxFQUEwQztBQUM1RCxVQUFJUyxLQUFKLEVBQVc7QUFDVCxZQUFJVCxRQUFRLENBQVosRUFBZTtBQUNiLGlCQUFPUyxNQUFNTSxRQUFOLEdBQWlCQyxTQUFqQixDQUEyQixDQUEzQixFQUE4QmhCLEtBQTlCLENBQVA7QUFDRDtBQUNGO0FBQ0QsYUFBT1MsS0FBUDtBQUNEO0FBMUM0RSxHQUEvRCxDQUFoQjs7b0JBNkNlWixPIiwiZmlsZSI6Ikdyb3VwQnlWYWx1ZVNlY3Rpb24uanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLkdyb3Vwcy5Hcm91cEJ5VmFsdWVTZWN0aW9uXHJcbiAqL1xyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgVXRpbGl0eSBmcm9tICcuLi9VdGlsaXR5JztcclxuaW1wb3J0IF9Hcm91cEJ5U2VjdGlvbiBmcm9tICcuL19Hcm91cEJ5U2VjdGlvbic7XHJcbmltcG9ydCBnZXRSZXNvdXJjZSBmcm9tICcuLi9JMThuJztcclxuXHJcbmNvbnN0IHJlc291cmNlID0gZ2V0UmVzb3VyY2UoJ2dyb3VwQnlWYWx1ZVNlY3Rpb24nKTtcclxuXHJcbmNvbnN0IF9fY2xhc3MgPSBkZWNsYXJlKCdhcmdvcy5Hcm91cHMuR3JvdXBCeVZhbHVlU2VjdGlvbicsIFtfR3JvdXBCeVNlY3Rpb25dLCB7XHJcbiAgbmFtZTogJ0RhdGVUaW1lU2VjdGlvbkZpbHRlcicsXHJcbiAgZGlzcGxheU5hbWVUZXh0OiByZXNvdXJjZS5kaXNwbGF5TmFtZVRleHQsXHJcbiAgd2lkdGg6IDAsXHJcbiAgY29uc3RydWN0b3I6IGZ1bmN0aW9uIGNvbnN0cnVjdG9yKG8pIHtcclxuICAgIHRoaXMuZ3JvdXBCeVByb3BlcnR5ID0gby5ncm91cEJ5UHJvcGVydHk7XHJcbiAgICB0aGlzLnNvcnREaXJlY3Rpb24gPSBvLnNvcnREaXJlY3Rpb247XHJcbiAgICBpZiAoby53aWR0aCkge1xyXG4gICAgICB0aGlzLndpZHRoID0gby53aWR0aDtcclxuICAgIH1cclxuICAgIHRoaXMuaW5pdCgpO1xyXG4gIH0sXHJcbiAgaW5pdDogZnVuY3Rpb24gaW5pdCgpIHtcclxuICAgIHRoaXMuc2VjdGlvbnMgPSBbXTtcclxuICB9LFxyXG4gIGdldFNlY3Rpb246IGZ1bmN0aW9uIGdldFNlY3Rpb24oZW50cnkpIHtcclxuICAgIGlmICgodGhpcy5ncm91cEJ5UHJvcGVydHkpICYmIChlbnRyeSkpIHtcclxuICAgICAgbGV0IHZhbHVlID0gVXRpbGl0eS5nZXRWYWx1ZShlbnRyeSwgdGhpcy5ncm91cEJ5UHJvcGVydHkpO1xyXG4gICAgICB2YWx1ZSA9IHRoaXMuX2dldFZhbHVlRnJvbVdpZHRoKHZhbHVlLCB0aGlzLndpZHRoKTtcclxuICAgICAgaWYgKHZhbHVlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgIGtleTogdmFsdWUsXHJcbiAgICAgICAgICB0aXRsZTogdmFsdWUsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gdGhpcy5nZXREZWZhdWx0U2VjdGlvbigpO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIG51bGw7XHJcbiAgfSxcclxuICBnZXREZWZhdWx0U2VjdGlvbjogZnVuY3Rpb24gZ2V0RGVmYXVsdFNlY3Rpb24oKSB7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBrZXk6ICdVbmtub3duJyxcclxuICAgICAgdGl0bGU6ICdVbmtub3duJyxcclxuICAgIH07XHJcbiAgfSxcclxuICBfZ2V0VmFsdWVGcm9tV2lkdGg6IGZ1bmN0aW9uIF9nZXRWYWx1ZUZyb21XaWR0aCh2YWx1ZSwgd2lkdGgpIHtcclxuICAgIGlmICh2YWx1ZSkge1xyXG4gICAgICBpZiAod2lkdGggPiAwKSB7XHJcbiAgICAgICAgcmV0dXJuIHZhbHVlLnRvU3RyaW5nKCkuc3Vic3RyaW5nKDAsIHdpZHRoKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgcmV0dXJuIHZhbHVlO1xyXG4gIH0sXHJcbn0pO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgX19jbGFzcztcclxuIl19