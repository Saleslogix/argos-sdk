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
      this.inherited(clear, arguments);
    },
    show: function show() {
      this.refreshRequired = true;
      this.inherited(show, arguments);
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy9WaWV3cy9Db25maWd1cmVRdWlja0FjdGlvbnMuanMiXSwibmFtZXMiOlsicmVzb3VyY2UiLCJfX2NsYXNzIiwidGl0bGVUZXh0IiwiaWQiLCJpZFByb3BlcnR5IiwibGFiZWxQcm9wZXJ0eSIsImdldENvbmZpZ3VyZWRWaWV3IiwiQXBwIiwiZ2V0VmlldyIsIm9wdGlvbnMiLCJ2aWV3SWQiLCJvblNhdmUiLCJzZWxlY3RlZCIsImdldFNlbGVjdGVkS2V5cyIsImFsbCIsIl9zb3J0QWN0aW9ucyIsImFjdGlvbnMiLCJnZXRPcmRlcmVkS2V5cyIsInNhdmUiLCJtYXAiLCJhY3Rpb24iLCJpbmRleE9mIiwidmlzaWJsZSIsIl9lbnN1cmVQcmVmcyIsInByZWZlcmVuY2VzIiwicXVpY2tBY3Rpb25zIiwicGVyc2lzdFByZWZlcmVuY2VzIiwidmlldyIsImNsZWFyIiwicmVmcmVzaFJlcXVpcmVkIiwiUmVVSSIsImJhY2siLCJvcmRlciIsInNvcnQiLCJhIiwiYiIsImkiLCJqIiwic3RvcmUiLCJpbmhlcml0ZWQiLCJhcmd1bWVudHMiLCJzaG93IiwiY3JlYXRlU3RvcmUiLCJsaXN0IiwiZ2V0U2F2ZWRPcmRlcmVkS2V5cyIsImNvbWJpbmVkIiwiY29uY2F0IiwicmVkdWNlZCIsInJlZHVjZSIsInByZXZpb3VzIiwiY3VycmVudCIsInB1c2giLCJmaWx0ZXIiLCJrZXkiLCIka2V5IiwiJGRlc2NyaXB0b3IiLCJsYWJlbCIsIml0ZW0iLCJkYXRhIiwiX2dldFF1aWNrQWN0aW9uUHJlZnMiLCJnZXRTYXZlZFNlbGVjdGVkS2V5cyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7Ozs7Ozs7Ozs7Ozs7QUFvQkEsTUFBTUEsV0FBVyxvQkFBWSx1QkFBWixDQUFqQjs7QUFFQTs7OztBQUlBLE1BQU1DLFVBQVUsdUJBQVEsbUNBQVIsRUFBNkMseUJBQTdDLEVBQStEO0FBQzdFO0FBQ0FDLGVBQVdGLFNBQVNFLFNBRnlEOztBQUk3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LEtBQUtDLEdBQUwsQ0FBUyxVQUFDQyxNQUFELEVBQVk7QUFDMUIsZUFBT0EsT0FBT2pCLEVBQWQ7QUFDRCxPQUZNLENBQVA7QUFHRCxLQXBINEU7QUFxSDdFd0QsMEJBQXNCLFNBQVNBLG9CQUFULEdBQWdDO0FBQ3BELFdBQUtwQyxZQUFMO0FBQ0EsYUFBT2hCLElBQUlpQixXQUFKLENBQWdCQyxZQUFoQixDQUE2QixLQUFLaEIsT0FBTCxDQUFhQyxNQUExQyxLQUFxRCxFQUE1RDtBQUNELEtBeEg0RTtBQXlIN0VhLGtCQUFjLFNBQVNBLFlBQVQsR0FBd0I7QUFDcEMsVUFBSSxDQUFDaEIsSUFBSWlCLFdBQVQsRUFBc0I7QUFDcEJqQixZQUFJaUIsV0FBSixHQUFrQixFQUFsQjtBQUNEOztBQUVELFVBQUksQ0FBQ2pCLElBQUlpQixXQUFKLENBQWdCQyxZQUFyQixFQUFtQztBQUNqQ2xCLFlBQUlpQixXQUFKLENBQWdCQyxZQUFoQixHQUErQixFQUEvQjtBQUNEO0FBQ0Y7QUFqSTRFLEdBQS9ELENBQWhCOztvQkFvSWV4QixPIiwiZmlsZSI6IkNvbmZpZ3VyZVF1aWNrQWN0aW9ucy5qcyIsInNvdXJjZVJvb3QiOiJzcmMiLCJzb3VyY2VzQ29udGVudCI6WyIvKiBDb3B5cmlnaHQgMjAxNyBJbmZvclxyXG4gKlxyXG4gKiBMaWNlbnNlZCB1bmRlciB0aGUgQXBhY2hlIExpY2Vuc2UsIFZlcnNpb24gMi4wICh0aGUgXCJMaWNlbnNlXCIpO1xyXG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXHJcbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxyXG4gKlxyXG4gKiAgICBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcclxuICpcclxuICogVW5sZXNzIHJlcXVpcmVkIGJ5IGFwcGxpY2FibGUgbGF3IG9yIGFncmVlZCB0byBpbiB3cml0aW5nLCBzb2Z0d2FyZVxyXG4gKiBkaXN0cmlidXRlZCB1bmRlciB0aGUgTGljZW5zZSBpcyBkaXN0cmlidXRlZCBvbiBhbiBcIkFTIElTXCIgQkFTSVMsXHJcbiAqIFdJVEhPVVQgV0FSUkFOVElFUyBPUiBDT05ESVRJT05TIE9GIEFOWSBLSU5ELCBlaXRoZXIgZXhwcmVzcyBvciBpbXBsaWVkLlxyXG4gKiBTZWUgdGhlIExpY2Vuc2UgZm9yIHRoZSBzcGVjaWZpYyBsYW5ndWFnZSBnb3Zlcm5pbmcgcGVybWlzc2lvbnMgYW5kXHJcbiAqIGxpbWl0YXRpb25zIHVuZGVyIHRoZSBMaWNlbnNlLlxyXG4gKi9cclxuXHJcbmltcG9ydCBkZWNsYXJlIGZyb20gJ2Rvam8vX2Jhc2UvZGVjbGFyZSc7XHJcbmltcG9ydCBNZW1vcnkgZnJvbSAnZG9qby9zdG9yZS9NZW1vcnknO1xyXG5pbXBvcnQgX0NvbmZpZ3VyZUJhc2UgZnJvbSAnLi4vX0NvbmZpZ3VyZUJhc2UnO1xyXG5pbXBvcnQgZ2V0UmVzb3VyY2UgZnJvbSAnLi4vSTE4bic7XHJcblxyXG5jb25zdCByZXNvdXJjZSA9IGdldFJlc291cmNlKCdjb25maWd1cmVRdWlja0FjdGlvbnMnKTtcclxuXHJcbi8qKlxyXG4gKiBAY2xhc3MgYXJnb3MuVmlld3MuQ29uZmlndXJlUXVpY2tBY3Rpb25zXHJcbiAqIEBleHRlbmRzIGFyZ29zLl9Db25maWd1cmVCYXNlXHJcbiAqL1xyXG5jb25zdCBfX2NsYXNzID0gZGVjbGFyZSgnYXJnb3MuVmlld3MuQ29uZmlndXJlUXVpY2tBY3Rpb25zJywgW19Db25maWd1cmVCYXNlXSwge1xyXG4gIC8vIExvY2FsaXphdGlvblxyXG4gIHRpdGxlVGV4dDogcmVzb3VyY2UudGl0bGVUZXh0LFxyXG5cclxuICAvLyBWaWV3IFByb3BlcnRpZXNcclxuICBpZDogJ2NvbmZpZ3VyZV9xdWlja2FjdGlvbnMnLFxyXG4gIGlkUHJvcGVydHk6ICcka2V5JyxcclxuICBsYWJlbFByb3BlcnR5OiAnJGRlc2NyaXB0b3InLFxyXG5cclxuICBnZXRDb25maWd1cmVkVmlldzogZnVuY3Rpb24gZ2V0Q29uZmlndXJlZFZpZXcoKSB7XHJcbiAgICByZXR1cm4gQXBwLmdldFZpZXcodGhpcy5vcHRpb25zLnZpZXdJZCk7XHJcbiAgfSxcclxuICBvblNhdmU6IGZ1bmN0aW9uIG9uU2F2ZSgpIHtcclxuICAgIGNvbnN0IHNlbGVjdGVkID0gdGhpcy5nZXRTZWxlY3RlZEtleXMoKTtcclxuICAgIGNvbnN0IGFsbCA9IHRoaXMuX3NvcnRBY3Rpb25zKHRoaXMub3B0aW9ucy5hY3Rpb25zLCB0aGlzLmdldE9yZGVyZWRLZXlzKCkpO1xyXG5cclxuICAgIGNvbnN0IHNhdmUgPSBhbGwubWFwKChhY3Rpb24pID0+IHtcclxuICAgICAgaWYgKHNlbGVjdGVkLmluZGV4T2YoYWN0aW9uLmlkKSA+PSAwKSB7XHJcbiAgICAgICAgYWN0aW9uLnZpc2libGUgPSB0cnVlO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGFjdGlvbi52aXNpYmxlID0gZmFsc2U7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiBhY3Rpb247XHJcbiAgICB9KTtcclxuXHJcbiAgICB0aGlzLl9lbnN1cmVQcmVmcygpO1xyXG4gICAgQXBwLnByZWZlcmVuY2VzLnF1aWNrQWN0aW9uc1t0aGlzLm9wdGlvbnMudmlld0lkXSA9IHNhdmU7XHJcblxyXG4gICAgQXBwLnBlcnNpc3RQcmVmZXJlbmNlcygpO1xyXG5cclxuICAgIGNvbnN0IHZpZXcgPSB0aGlzLmdldENvbmZpZ3VyZWRWaWV3KCk7XHJcbiAgICBpZiAodmlldykge1xyXG4gICAgICB2aWV3LmNsZWFyKCk7XHJcbiAgICAgIHZpZXcucmVmcmVzaFJlcXVpcmVkID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBSZVVJLmJhY2soKTtcclxuICB9LFxyXG4gIF9zb3J0QWN0aW9uczogZnVuY3Rpb24gX3NvcnRBY3Rpb25zKGFjdGlvbnMsIG9yZGVyKSB7XHJcbiAgICByZXR1cm4gYWN0aW9ucy5zb3J0KChhLCBiKSA9PiB7XHJcbiAgICAgIGNvbnN0IGkgPSBvcmRlci5pbmRleE9mKGEuaWQpO1xyXG4gICAgICBjb25zdCBqID0gb3JkZXIuaW5kZXhPZihiLmlkKTtcclxuXHJcbiAgICAgIGlmIChpIDwgaikge1xyXG4gICAgICAgIHJldHVybiAtMTtcclxuICAgICAgfVxyXG5cclxuICAgICAgaWYgKGkgPiBqKSB7XHJcbiAgICAgICAgcmV0dXJuIDE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIHJldHVybiAwO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBjbGVhcjogZnVuY3Rpb24gY2xlYXIoKSB7XHJcbiAgICB0aGlzLnN0b3JlID0gbnVsbDtcclxuICAgIHRoaXMuaW5oZXJpdGVkKGNsZWFyLCBhcmd1bWVudHMpO1xyXG4gIH0sXHJcbiAgc2hvdzogZnVuY3Rpb24gc2hvdygpIHtcclxuICAgIHRoaXMucmVmcmVzaFJlcXVpcmVkID0gdHJ1ZTtcclxuICAgIHRoaXMuaW5oZXJpdGVkKHNob3csIGFyZ3VtZW50cyk7XHJcbiAgfSxcclxuICBjcmVhdGVTdG9yZTogZnVuY3Rpb24gY3JlYXRlU3RvcmUoKSB7XHJcbiAgICBsZXQgbGlzdCA9IFtdO1xyXG4gICAgY29uc3QgYWxsID0gdGhpcy5vcHRpb25zLmFjdGlvbnMubWFwKGFjdGlvbiA9PiBhY3Rpb24uaWQpO1xyXG4gICAgY29uc3Qgb3JkZXIgPSB0aGlzLmdldFNhdmVkT3JkZXJlZEtleXMoKTtcclxuXHJcbiAgICAvLyBEZS1kdXAgaWQnc1xyXG4gICAgY29uc3QgY29tYmluZWQgPSBvcmRlci5jb25jYXQoYWxsKTtcclxuICAgIGxldCByZWR1Y2VkID0gY29tYmluZWQucmVkdWNlKChwcmV2aW91cywgY3VycmVudCkgPT4ge1xyXG4gICAgICBpZiAocHJldmlvdXMuaW5kZXhPZihjdXJyZW50KSA9PT0gLTEpIHtcclxuICAgICAgICBwcmV2aW91cy5wdXNoKGN1cnJlbnQpO1xyXG4gICAgICB9XHJcblxyXG4gICAgICByZXR1cm4gcHJldmlvdXM7XHJcbiAgICB9LCBbXSk7XHJcblxyXG4gICAgLy8gVGhlIG9yZGVyIGFycmF5IGNvdWxkIGhhdmUgaGFkIHN0YWxlIGlkJ3NcclxuICAgIHJlZHVjZWQgPSByZWR1Y2VkLmZpbHRlcigoa2V5KSA9PiB7XHJcbiAgICAgIHJldHVybiBhbGwuaW5kZXhPZihrZXkpICE9PSAtMTtcclxuICAgIH0pO1xyXG5cclxuICAgIGxpc3QgPSB0aGlzLl9zb3J0QWN0aW9ucyh0aGlzLm9wdGlvbnMuYWN0aW9ucywgdGhpcy5nZXRTYXZlZE9yZGVyZWRLZXlzKCkpLm1hcCgoYWN0aW9uKSA9PiB7XHJcbiAgICAgIGlmIChyZWR1Y2VkLmluZGV4T2YoYWN0aW9uLmlkKSA+IC0xKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICRrZXk6IGFjdGlvbi5pZCxcclxuICAgICAgICAgICRkZXNjcmlwdG9yOiBhY3Rpb24ubGFiZWwsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgICByZXR1cm4gbnVsbDtcclxuICAgIH0pO1xyXG5cclxuICAgIGxpc3QgPSBsaXN0LmZpbHRlcigoaXRlbSkgPT4ge1xyXG4gICAgICByZXR1cm4gaXRlbSAhPT0gbnVsbDtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBNZW1vcnkoey8vIGVzbGludC1kaXNhYmxlLWxpbmVcclxuICAgICAgZGF0YTogbGlzdCxcclxuICAgIH0pO1xyXG4gIH0sXHJcbiAgZ2V0U2F2ZWRPcmRlcmVkS2V5czogZnVuY3Rpb24gZ2V0U2F2ZWRPcmRlcmVkS2V5cygpIHtcclxuICAgIGNvbnN0IHNhdmUgPSB0aGlzLl9nZXRRdWlja0FjdGlvblByZWZzKCk7XHJcbiAgICByZXR1cm4gc2F2ZS5tYXAoKGFjdGlvbikgPT4ge1xyXG4gICAgICByZXR1cm4gYWN0aW9uLmlkO1xyXG4gICAgfSk7XHJcbiAgfSxcclxuICBnZXRTYXZlZFNlbGVjdGVkS2V5czogZnVuY3Rpb24gZ2V0U2F2ZWRTZWxlY3RlZEtleXMoKSB7XHJcbiAgICBsZXQgc2F2ZSA9IHRoaXMuX2dldFF1aWNrQWN0aW9uUHJlZnMoKTtcclxuICAgIHNhdmUgPSBzYXZlLmZpbHRlcigoYWN0aW9uKSA9PiB7XHJcbiAgICAgIHJldHVybiBhY3Rpb24udmlzaWJsZSA9PT0gdHJ1ZTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBzYXZlLm1hcCgoYWN0aW9uKSA9PiB7XHJcbiAgICAgIHJldHVybiBhY3Rpb24uaWQ7XHJcbiAgICB9KTtcclxuICB9LFxyXG4gIF9nZXRRdWlja0FjdGlvblByZWZzOiBmdW5jdGlvbiBfZ2V0UXVpY2tBY3Rpb25QcmVmcygpIHtcclxuICAgIHRoaXMuX2Vuc3VyZVByZWZzKCk7XHJcbiAgICByZXR1cm4gQXBwLnByZWZlcmVuY2VzLnF1aWNrQWN0aW9uc1t0aGlzLm9wdGlvbnMudmlld0lkXSB8fCBbXTtcclxuICB9LFxyXG4gIF9lbnN1cmVQcmVmczogZnVuY3Rpb24gX2Vuc3VyZVByZWZzKCkge1xyXG4gICAgaWYgKCFBcHAucHJlZmVyZW5jZXMpIHtcclxuICAgICAgQXBwLnByZWZlcmVuY2VzID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCFBcHAucHJlZmVyZW5jZXMucXVpY2tBY3Rpb25zKSB7XHJcbiAgICAgIEFwcC5wcmVmZXJlbmNlcy5xdWlja0FjdGlvbnMgPSB7fTtcclxuICAgIH1cclxuICB9LFxyXG59KTtcclxuXHJcbmV4cG9ydCBkZWZhdWx0IF9fY2xhc3M7XHJcbiJdfQ==