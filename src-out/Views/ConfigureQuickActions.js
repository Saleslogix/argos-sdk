define('argos/Views/ConfigureQuickActions', ['module', 'exports', 'dojo/_base/declare', 'dojo/store/Memory', '../_ConfigureBase', '../I18n'], function (module, exports, _declare, _Memory, _ConfigureBase2, _I18n) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _Memory2 = _interopRequireDefault(_Memory);

  var _ConfigureBase3 = _interopRequireDefault(_ConfigureBase2);

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

  var resource = (0, _I18n2.default)('configureQuickActions');

  /**
   * @class argos.Views.ConfigureQuickActions
   * @extends argos._ConfigureBase
   */
  var __class = (0, _declare2.default)('argos.Views.ConfigureQuickActions', [_ConfigureBase3.default], {
    // Localization
    titleText: resource.titleText,

    // View Properties
    id: 'configure_quickactions',
    idProperty: '$key',
    labelProperty: '$descriptor',

    getConfiguredView: function getConfiguredView() {
      return App.getView(this.options.viewId);
    },
    onSave: function onSave() {
      var selected = this.getSelectedKeys();
      var all = this._sortActions(this.options.actions, this.getOrderedKeys());

      var save = all.map(function (action) {
        if (selected.indexOf(action.id) >= 0) {
          action.visible = true;
        } else {
          action.visible = false;
        }

        return action;
      });

      this._ensurePrefs();
      App.preferences.quickActions[this.options.viewId] = save;

      App.persistPreferences();

      var view = this.getConfiguredView();
      if (view) {
        view.clear();
        view.refreshRequired = true;
      }

      ReUI.back();
    },
    _sortActions: function _sortActions(actions, order) {
      return actions.sort(function (a, b) {
        var i = order.indexOf(a.id);
        var j = order.indexOf(b.id);

        if (i < j) {
          return -1;
        }

        if (i > j) {
          return 1;
        }

        return 0;
      });
    },
    clear: function clear() {
      this.store = null;
      this.inherited(arguments);
    },
    show: function show() {
      this.refreshRequired = true;
      this.inherited(arguments);
    },
    createStore: function createStore() {
      var list = [];
      var all = this.options.actions.map(function (action) {
        return action.id;
      });
      var order = this.getSavedOrderedKeys();

      // De-dup id's
      var combined = order.concat(all);
      var reduced = combined.reduce(function (previous, current) {
        if (previous.indexOf(current) === -1) {
          previous.push(current);
        }

        return previous;
      }, []);

      // The order array could have had stale id's
      reduced = reduced.filter(function (key) {
        return all.indexOf(key) !== -1;
      });

      list = this._sortActions(this.options.actions, this.getSavedOrderedKeys()).map(function (action) {
        if (reduced.indexOf(action.id) > -1) {
          return {
            $key: action.id,
            $descriptor: action.label
          };
        }
        return null;
      });

      list = list.filter(function (item) {
        return item !== null;
      });

      return (0, _Memory2.default)({ // eslint-disable-line
        data: list
      });
    },
    getSavedOrderedKeys: function getSavedOrderedKeys() {
      var save = this._getQuickActionPrefs();
      return save.map(function (action) {
        return action.id;
      });
    },
    getSavedSelectedKeys: function getSavedSelectedKeys() {
      var save = this._getQuickActionPrefs();
      save = save.filter(function (action) {
        return action.visible === true;
      });

      return save.map(function (action) {
        return action.id;
      });
    },
    _getQuickActionPrefs: function _getQuickActionPrefs() {
      this._ensurePrefs();
      return App.preferences.quickActions[this.options.viewId] || [];
    },
    _ensurePrefs: function _ensurePrefs() {
      if (!App.preferences) {
        App.preferences = {};
      }

      if (!App.preferences.quickActions) {
        App.preferences.quickActions = {};
      }
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9WaWV3cy9Db25maWd1cmVRdWlja0FjdGlvbnMuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwidGl0bGVUZXh0IiwiaWQiLCJpZFByb3BlcnR5IiwibGFiZWxQcm9wZXJ0eSIsImdldENvbmZpZ3VyZWRWaWV3IiwiQXBwIiwiZ2V0VmlldyIsIm9wdGlvbnMiLCJ2aWV3SWQiLCJvblNhdmUiLCJzZWxlY3RlZCIsImdldFNlbGVjdGVkS2V5cyIsImFsbCIsIl9zb3J0QWN0aW9ucyIsImFjdGlvbnMiLCJnZXRPcmRlcmVkS2V5cyIsInNhdmUiLCJtYXAiLCJhY3Rpb24iLCJpbmRleE9mIiwidmlzaWJsZSIsIl9lbnN1cmVQcmVmcyIsInByZWZlcmVuY2VzIiwicXVpY2tBY3Rpb25zIiwicGVyc2lzdFByZWZlcmVuY2VzIiwidmlldyIsImNsZWFyIiwicmVmcmVzaFJlcXVpcmVkIiwiUmVVSSIsImJhY2siLCJvcmRlciIsInNvcnQiLCJhIiwiYiIsImkiLCJqIiwic3RvcmUiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJzaG93IiwiY3JlYXRlU3RvcmUiLCJsaXN0IiwiZ2V0U2F2ZWRPcmRlcmVkS2V5cyIsImNvbWJpbmVkIiwiY29uY2F0IiwicmVkdWNlZCIsInJlZHVjZSIsInByZXZpb3VzIiwiY3VycmVudCIsInB1c2giLCJmaWx0ZXIiLCJrZXkiLCIka2V5IiwiJGRlc2NyaXB0b3IiLCJsYWJlbCIsIml0ZW0iLCJkYXRhIiwiX2dldFF1aWNrQWN0aW9uUHJlZnMiLCJnZXRTYXZlZFNlbGVjdGVkS2V5cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTUEsV0FBVyxvQkFBWSx1QkFBWixDQUFqQjs7QUFFQTs7OztBQUlBLE1BQU1DLFVBQVUsdUJBQVEsbUNBQVIsRUFBNkMseUJBQTdDLEVBQStEO0FBQzdFO0FBQ0FDLGVBQVdGLFNBQVNFLFNBRnlEOztBQUk3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RCxFQUFZO0FBQzFCLGVBQU9BLE9BQU9qQixFQUFkO0FBQ0QsT0FGTSxDQUFQO0FBR0QsS0FwSDRFO0FBcUg3RXdELDBCQUFzQixTQUFTQSxvQkFBVCxHQUFnQztBQUNwRCxXQUFLcEMsWUFBTDtBQUNBLGFBQU9oQixJQUFJaUIsV0FBSixDQUFnQkMsWUFBaEIsQ0FBNkIsS0FBS2hCLE9BQUwsQ0FBYUMsTUFBMUMsS0FBcUQsRUFBNUQ7QUFDRCxLQXhINEU7QUF5SDdFYSxrQkFBYyxTQUFTQSxZQUFULEdBQXdCO0FBQ3BDLFVBQUksQ0FBQ2hCLElBQUlpQixXQUFULEVBQXNCO0FBQ3BCakIsWUFBSWlCLFdBQUosR0FBa0IsRUFBbEI7QUFDRDs7QUFFRCxVQUFJLENBQUNqQixJQUFJaUIsV0FBSixDQUFnQkMsWUFBckIsRUFBbUM7QUFDakNsQixZQUFJaUIsV0FBSixDQUFnQkMsWUFBaEIsR0FBK0IsRUFBL0I7QUFDRDtBQUNGO0FBakk0RSxHQUEvRCxDQUFoQjs7b0JBb0lleEIsTyIsImZpbGUiOiJDb25maWd1cmVRdWlja0FjdGlvbnMuanMiLCJzb3VyY2VSb290Ijoic3JjIiwic291cmNlc0NvbnRlbnQiOlsiLyogQ29weXJpZ2h0IDIwMTcgSW5mb3JcclxuICpcclxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcclxuICogeW91IG1heSBub3QgdXNlIHRoaXMgZmlsZSBleGNlcHQgaW4gY29tcGxpYW5jZSB3aXRoIHRoZSBMaWNlbnNlLlxyXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcclxuICpcclxuICogICAgaHR0cDovL3d3dy5hcGFjaGUub3JnL2xpY2Vuc2VzL0xJQ0VOU0UtMi4wXHJcbiAqXHJcbiAqIFVubGVzcyByZXF1aXJlZCBieSBhcHBsaWNhYmxlIGxhdyBvciBhZ3JlZWQgdG8gaW4gd3JpdGluZywgc29mdHdhcmVcclxuICogZGlzdHJpYnV0ZWQgdW5kZXIgdGhlIExpY2Vuc2UgaXMgZGlzdHJpYnV0ZWQgb24gYW4gXCJBUyBJU1wiIEJBU0lTLFxyXG4gKiBXSVRIT1VUIFdBUlJBTlRJRVMgT1IgQ09ORElUSU9OUyBPRiBBTlkgS0lORCwgZWl0aGVyIGV4cHJlc3Mgb3IgaW1wbGllZC5cclxuICogU2VlIHRoZSBMaWNlbnNlIGZvciB0aGUgc3BlY2lmaWMgbGFuZ3VhZ2UgZ292ZXJuaW5nIHBlcm1pc3Npb25zIGFuZFxyXG4gKiBsaW1pdGF0aW9ucyB1bmRlciB0aGUgTGljZW5zZS5cclxuICovXHJcblxyXG5pbXBvcnQgZGVjbGFyZSBmcm9tICdkb2pvL19iYXNlL2RlY2xhcmUnO1xyXG5pbXBvcnQgTWVtb3J5IGZyb20gJ2Rvam8vc3RvcmUvTWVtb3J5JztcclxuaW1wb3J0IF9Db25maWd1cmVCYXNlIGZyb20gJy4uL19Db25maWd1cmVCYXNlJztcclxuaW1wb3J0IGdldFJlc291cmNlIGZyb20gJy4uL0kxOG4nO1xyXG5cclxuY29uc3QgcmVzb3VyY2UgPSBnZXRSZXNvdXJjZSgnY29uZmlndXJlUXVpY2tBY3Rpb25zJyk7XHJcblxyXG4vKipcclxuICogQGNsYXNzIGFyZ29zLlZpZXdzLkNvbmZpZ3VyZVF1aWNrQWN0aW9uc1xyXG4gKiBAZXh0ZW5kcyBhcmdvcy5fQ29uZmlndXJlQmFzZVxyXG4gKi9cclxuY29uc3QgX19jbGFzcyA9IGRlY2xhcmUoJ2FyZ29zLlZpZXdzLkNvbmZpZ3VyZVF1aWNrQWN0aW9ucycsIFtfQ29uZmlndXJlQmFzZV0sIHtcclxuICAvLyBMb2NhbGl6YXRpb25cclxuICB0aXRsZVRleHQ6IHJlc291cmNlLnRpdGxlVGV4dCxcclxuXHJcbiAgLy8gVmlldyBQcm9wZXJ0aWVzXHJcbiAgaWQ6ICdjb25maWd1cmVfcXVpY2thY3Rpb25zJyxcclxuICBpZFByb3BlcnR5OiAnJGtleScsXHJcbiAgbGFiZWxQcm9wZXJ0eTogJyRkZXNjcmlwdG9yJyxcclxuXHJcbiAgZ2V0Q29uZmlndXJlZFZpZXc6IGZ1bmN0aW9uIGdldENvbmZpZ3VyZWRWaWV3KCkge1xyXG4gICAgcmV0dXJuIEFwcC5nZXRWaWV3KHRoaXMub3B0aW9ucy52aWV3SWQpO1xyXG4gIH0sXHJcbiAgb25TYXZlOiBmdW5jdGlvbiBvblNhdmUoKSB7XHJcbiAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuZ2V0U2VsZWN0ZWRLZXlzKCk7XHJcbiAgICBjb25zdCBhbGwgPSB0aGlzLl9zb3J0QWN0aW9ucyh0aGlzLm9wdGlvbnMuYWN0aW9ucywgdGhpcy5nZXRPcmRlcmVkS2V5cygpKTtcclxuXHJcbiAgICBjb25zdCBzYXZlID0gYWxsLm1hcCgoYWN0aW9uKSA9PiB7XHJcbiAgICAgIGlmIChzZWxlY3RlZC5pbmRleE9mKGFjdGlvbi5pZCkgPj0gMCkge1xyXG4gICAgICAgIGFjdGlvbi52aXNpYmxlID0gdHJ1ZTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICBhY3Rpb24udmlzaWJsZSA9IGZhbHNlO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gYWN0aW9uO1xyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5fZW5zdXJlUHJlZnMoKTtcclxuICAgIEFwcC5wcmVmZXJlbmNlcy5xdWlja0FjdGlvbnNbdGhpcy5vcHRpb25zLnZpZXdJZF0gPSBzYXZlO1xyXG5cclxuICAgIEFwcC5wZXJzaXN0UHJlZmVyZW5jZXMoKTtcclxuXHJcbiAgICBjb25zdCB2aWV3ID0gdGhpcy5nZXRDb25maWd1cmVkVmlldygpO1xyXG4gICAgaWYgKHZpZXcpIHtcclxuICAgICAgdmlldy5jbGVhcigpO1xyXG4gICAgICB2aWV3LnJlZnJlc2hSZXF1aXJlZCA9IHRydWU7XHJcbiAgICB9XHJcblxyXG4gICAgUmVVSS5iYWNrKCk7XHJcbiAgfSxcclxuICBfc29ydEFjdGlvbnM6IGZ1bmN0aW9uIF9zb3J0QWN0aW9ucyhhY3Rpb25zLCBvcmRlcikge1xyXG4gICAgcmV0dXJuIGFjdGlvbnMuc29ydCgoYSwgYikgPT4ge1xyXG4gICAgICBjb25zdCBpID0gb3JkZXIuaW5kZXhPZihhLmlkKTtcclxuICAgICAgY29uc3QgaiA9IG9yZGVyLmluZGV4T2YoYi5pZCk7XHJcblxyXG4gICAgICBpZiAoaSA8IGopIHtcclxuICAgICAgICByZXR1cm4gLTE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGlmIChpID4gaikge1xyXG4gICAgICAgIHJldHVybiAxO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gMDtcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgY2xlYXI6IGZ1bmN0aW9uIGNsZWFyKCkge1xyXG4gICAgdGhpcy5zdG9yZSA9IG51bGw7XHJcbiAgICB0aGlzLmluaGVyaXRlZChhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgc2hvdzogZnVuY3Rpb24gc2hvdygpIHtcclxuICAgIHRoaXMucmVmcmVzaFJlcXVpcmVkID0gdHJ1ZTtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBjcmVhdGVTdG9yZTogZnVuY3Rpb24gY3JlYXRlU3RvcmUoKSB7XHJcbiAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgY29uc3QgYWxsID0gdGhpcy5vcHRpb25zLmFjdGlvbnMubWFwKGFjdGlvbiA9PiBhY3Rpb24uaWQpO1xyXG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLmdldFNhdmVkT3JkZXJlZEtleXMoKTtcclxuXHJcbiAgICAvLyBEZS1kdXAgaWQnc1xyXG4gICAgY29uc3QgY29tYmluZWQgPSBvcmRlci5jb25jYXQoYWxsKTtcclxuICAgIGxldCByZWR1Y2VkID0gY29tYmluZWQucmVkdWNlKChwcmV2aW91cywgY3VycmVudCkgPT4ge1xyXG4gICAgICBpZiAocHJldmlvdXMuaW5kZXhPZihjdXJyZW50KSA9PT0gLTEpIHtcclxuICAgICAgICBwcmV2aW91cy5wdXNoKGN1cnJlbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgICB9LCBbXSk7XHJcblxyXG4gICAgLy8gVGhlIG9yZGVyIGFycmF5IGNvdWxkIGhhdmUgaGFkIHN0YWxlIGlkJ3NcclxuICAgIHJlZHVjZWQgPSByZWR1Y2VkLmZpbHRlcigoa2V5KSA9PiB7XHJcbiAgICAgIHJldHVybiBhbGwuaW5kZXhPZihrZXkpICE9PSAtMTtcclxuICAgIH0pO1xyXG5cclxuICAgIGxpc3QgPSB0aGlzLl9zb3J0QWN0aW9ucyh0aGlzLm9wdGlvbnMuYWN0aW9ucywgdGhpcy5nZXRTYXZlZE9yZGVyZWRLZXlzKCkpLm1hcCgoYWN0aW9uKSA9PiB7XHJcbiAgICAgIGlmIChyZWR1Y2VkLmluZGV4T2YoYWN0aW9uLmlkKSA+IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICRrZXk6IGFjdGlvbi5pZCxcclxuICAgICAgICAgICRkZXNjcmlwdG9yOiBhY3Rpb24ubGFiZWwsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0pO1xyXG5cclxuICAgIGxpc3QgPSBsaXN0LmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbDtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBNZW1vcnkoey8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgZGF0YTogbGlzdCxcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgZ2V0U2F2ZWRPcmRlcmVkS2V5czogZnVuY3Rpb24gZ2V0U2F2ZWRPcmRlcmVkS2V5cygpIHtcclxuICAgIGNvbnN0IHNhdmUgPSB0aGlzLl9nZXRRdWlja0FjdGlvblByZWZzKCk7XHJcbiAgICByZXR1cm4gc2F2ZS5tYXAoKGFjdGlvbikgPT4ge1xyXG4gICAgICByZXR1cm4gYWN0aW9uLmlkO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBnZXRTYXZlZFNlbGVjdGVkS2V5czogZnVuY3Rpb24gZ2V0U2F2ZWRTZWxlY3RlZEtleXMoKSB7XHJcbiAgICBsZXQgc2F2ZSA9IHRoaXMuX2dldFF1aWNrQWN0aW9uUHJlZnMoKTtcclxuICAgIHNhdmUgPSBzYXZlLmZpbHRlcigoYWN0aW9uKSA9PiB7XHJcbiAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9PT0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBzYXZlLm1hcCgoYWN0aW9uKSA9PiB7XHJcbiAgICAgIHJldHVybiBhY3Rpb24uaWQ7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIF9nZXRRdWlja0FjdGlvblByZWZzOiBmdW5jdGlvbiBfZ2V0UXVpY2tBY3Rpb25QcmVmcygpIHtcclxuICAgIHRoaXMuX2Vuc3VyZVByZWZzKCk7XHJcbiAgICByZXR1cm4gQXBwLnByZWZlcmVuY2VzLnF1aWNrQWN0aW9uc1t0aGlzLm9wdGlvbnMudmlld0lkXSB8fCBbXTtcclxuICB9LFxyXG4gIF9lbnN1cmVQcmVmczogZnVuY3Rpb24gX2Vuc3VyZVByZWZzKCkge1xyXG4gICAgaWYgKCFBcHAucHJlZmVyZW5jZXMpIHtcclxuICAgICAgQXBwLnByZWZlcmVuY2VzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFBcHAucHJlZmVyZW5jZXMucXVpY2tBY3Rpb25zKSB7XHJcbiAgICAgIEFwcC5wcmVmZXJlbmNlcy5xdWlja0FjdGlvbnMgPSB7fTtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==