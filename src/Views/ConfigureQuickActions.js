import declare from 'dojo/_base/declare';
import array from 'dojo/_base/array';
import lang from 'dojo/_base/lang';
import query from 'dojo/query';
import string from 'dojo/string';
import domAttr from 'dojo/dom-attr';
import domClass from 'dojo/dom-class';
import Memory from 'dojo/store/Memory';
import _ConfigureBase from '../_ConfigureBase';

/**
 * @class argos.Views.ConfigureQuickActions
 *
 *
 * @extends argos._ConfigureBase
 *
 */
var __class = declare('argos.Views.ConfigureQuickActions', [_ConfigureBase], {
  // Localization
  titleText: 'Configure Quick Actions',

  //View Properties
  id: 'configure_quickactions',
  idProperty: '$key',
  labelProperty: '$descriptor',

  getConfiguredView: function() {
    return App.getView(this.options.viewId);
  },
  onSave: function() {
    var save, all, selected, view;

    selected = this.getSelectedKeys();
    all = this._sortActions(this.options.actions, this.getOrderedKeys());

    save = array.map(all, function(action) {
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

    view = this.getConfiguredView();
    if (view) {
      view.clear();
      view.refreshRequired = true;
    }

    ReUI.back();
  },
  _sortActions: function(actions, order) {
    return actions.sort(function(a, b) {
      var i, j;
      i = order.indexOf(a.id);
      j = order.indexOf(b.id);

      if (i < j) {
        return -1;
      }

      if (i > j) {
        return 1;
      }

      return 0;
    });
  },
  clear: function() {
    this.store = null;
    this.inherited(arguments);
  },
  show: function() {
    this.refreshRequired = true;
    this.inherited(arguments);
  },
  createStore: function() {
    var list = [],
      all = array.map(this.options.actions, function(action) {
        return action.id;
      }),
      order = this.getSavedOrderedKeys(),
      reduced,
      combined;

    // De-dup id's
    combined = order.concat(all);
    reduced = combined.reduce(function(previous, current) {
      if (previous.indexOf(current) === -1) {
        previous.push(current);
      }

      return previous;
    }, []);

    // The order array could have had stale id's
    reduced = array.filter(reduced, function(key) {
      return all.indexOf(key) !== -1;
    });

    list = array.map(this._sortActions(this.options.actions, this.getSavedOrderedKeys()), function(action) {
      if (reduced.indexOf(action.id) > -1) {
        return {
          '$key': action.id,
          '$descriptor': action.label
        };
      } else {
        return null;
      }
    });

    list = array.filter(list, function(item) {
      return item !== null;
    });

    return Memory({
      data: list
    });
  },
  getSavedOrderedKeys: function() {
    var save = this._getQuickActionPrefs();
    return array.map(save, function(action) {
      return action.id;
    });
  },
  getSavedSelectedKeys: function() {
    var save = this._getQuickActionPrefs();
    save = array.filter(save, function(action) {
      return action.visible === true;
    });

    return array.map(save, function(action) {
      return action.id;
    });
  },
  _getQuickActionPrefs: function() {
    this._ensurePrefs();
    return App.preferences.quickActions[this.options.viewId] || [];
  },
  _ensurePrefs: function() {
    if (!App.preferences) {
      App.preferences = {};
    }

    if (!App.preferences.quickActions) {
      App.preferences.quickActions = {};
    }
  }
});

export default __class;
