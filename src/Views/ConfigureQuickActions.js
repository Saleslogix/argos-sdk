/**
 * @class argos.Views.ConfigureQuickActions
 *
 *
 * @extends argos._ConfigureBase
 *
 */
define('argos/Views/ConfigureQuickActions', [
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/query',
    'dojo/string',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/store/Memory',
    '../_ConfigureBase'
], function(
    declare,
    array,
    lang,
    query,
    string,
    domAttr,
    domClass,
    Memory,
    _ConfigureBase
) {

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
            var order, selected;

            order = this.getOrderedKeys();
            selected = this.getSelectedKeys();

            App.persistPreferences();

            ReUI.back();
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

            list = array.map(this.options.actions, function(action) {
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

            return Memory({data: list});
        },
        getSavedOrderedKeys: function() {
            var save = App.preferences.quickActions[this.options.viewId];
            return array.map(save, function(action) {
                return action.id;
            });
        },
        getSavedSelectedKeys: function() {
            var save = App.preferences.quickActions[this.options.viewId];
            save = array.filter(save, function(action) {
                return action.visible === true;
            });

            return array.map(save, function(action) {
                return action.id;
            });
        }
    });

    return __class;
});

