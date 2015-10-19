import declare from 'dojo/_base/declare';
import array from 'dojo/_base/array';
import Memory from 'dojo/store/Memory';
import _ConfigureBase from '../_ConfigureBase';

const resource = window.localeContext.getEntitySync('configureQuickActions').attributes;

/**
 * @class argos.Views.ConfigureQuickActions
 *
 *
 * @extends argos._ConfigureBase
 *
 */
const __class = declare('argos.Views.ConfigureQuickActions', [_ConfigureBase], {
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

    const save = array.map(all, (action) => {
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
    this.inherited(arguments);
  },
  show: function show() {
    this.refreshRequired = true;
    this.inherited(arguments);
  },
  createStore: function createStore() {
    let list = [];
    const all = array.map(this.options.actions, (action) => action.id);
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
    reduced = array.filter(reduced, (key) => {
      return all.indexOf(key) !== -1;
    });

    list = array.map(this._sortActions(this.options.actions, this.getSavedOrderedKeys()), (action) => {
      if (reduced.indexOf(action.id) > -1) {
        return {
          '$key': action.id,
          '$descriptor': action.label,
        };
      }
      return null;
    });

    list = array.filter(list, (item) => {
      return item !== null;
    });

    return Memory({// eslint-disable-line
      data: list,
    });
  },
  getSavedOrderedKeys: function getSavedOrderedKeys() {
    const save = this._getQuickActionPrefs();
    return array.map(save, (action) => {
      return action.id;
    });
  },
  getSavedSelectedKeys: function getSavedSelectedKeys() {
    let save = this._getQuickActionPrefs();
    save = array.filter(save, (action) => {
      return action.visible === true;
    });

    return array.map(save, (action) => {
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
  },
});

export default __class;
