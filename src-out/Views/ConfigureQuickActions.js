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

  /**
   * @module argos/Views/ConfigureQuickActions
   */
  const resource = (0, _I18n2.default)('configureQuickActions');

  /**
   * @class
   * @alias module:argos/Views/ConfigureQuickActions
   * @extends module:argos/_ConfigureBase
   */
  const __class = (0, _declare2.default)('argos.Views.ConfigureQuickActions', [_ConfigureBase3.default], /** @lends module:argos/Views/ConfigureQuickActions.prototype */{
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
      const selected = this.getSelectedKeys();
      const all = this._sortActions(this.options.actions, this.getOrderedKeys());

      const save = all.map(action => {
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

      const view = this.getConfiguredView();
      if (view) {
        view.clear();
        view.refreshRequired = true;
      }

      ReUI.back();
    },
    _sortActions: function _sortActions(actions, order) {
      return actions.sort((a, b) => {
        const i = order.indexOf(a.id);
        const j = order.indexOf(b.id);

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
      let list = [];
      const all = this.options.actions.map(action => action.id);
      const order = this.getSavedOrderedKeys();

      // De-dup id's
      const combined = order.concat(all);
      let reduced = combined.reduce((previous, current) => {
        if (previous.indexOf(current) === -1) {
          previous.push(current);
        }

        return previous;
      }, []);

      // The order array could have had stale id's
      reduced = reduced.filter(key => {
        return all.indexOf(key) !== -1;
      });

      list = this._sortActions(this.options.actions, this.getSavedOrderedKeys()).map(action => {
        if (reduced.indexOf(action.id) > -1) {
          return {
            $key: action.id,
            $descriptor: action.label
          };
        }
        return null;
      });

      list = list.filter(item => {
        return item !== null;
      });

      return (0, _Memory2.default)({ // eslint-disable-line
        data: list
      });
    },
    getSavedOrderedKeys: function getSavedOrderedKeys() {
      const save = this._getQuickActionPrefs();
      return save.map(action => {
        return action.id;
      });
    },
    getSavedSelectedKeys: function getSavedSelectedKeys() {
      let save = this._getQuickActionPrefs();
      save = save.filter(action => {
        return action.visible === true;
      });

      return save.map(action => {
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