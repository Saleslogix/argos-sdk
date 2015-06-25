define('argos/Views/ConfigureQuickActions', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/array', 'dojo/_base/lang', 'dojo/query', 'dojo/string', 'dojo/dom-attr', 'dojo/dom-class', 'dojo/store/Memory', '../_ConfigureBase'], function (exports, module, _dojo_baseDeclare, _dojo_baseArray, _dojo_baseLang, _dojoQuery, _dojoString, _dojoDomAttr, _dojoDomClass, _dojoStoreMemory, _ConfigureBase2) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _array = _interopRequireDefault(_dojo_baseArray);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _query = _interopRequireDefault(_dojoQuery);

    var _string = _interopRequireDefault(_dojoString);

    var _domAttr = _interopRequireDefault(_dojoDomAttr);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _Memory = _interopRequireDefault(_dojoStoreMemory);

    var _ConfigureBase3 = _interopRequireDefault(_ConfigureBase2);

    /**
     * @class argos.Views.ConfigureQuickActions
     *
     *
     * @extends argos._ConfigureBase
     *
     */
    var __class = (0, _declare['default'])('argos.Views.ConfigureQuickActions', [_ConfigureBase3['default']], {
        // Localization
        titleText: 'Configure Quick Actions',

        //View Properties
        id: 'configure_quickactions',
        idProperty: '$key',
        labelProperty: '$descriptor',

        getConfiguredView: function getConfiguredView() {
            return App.getView(this.options.viewId);
        },
        onSave: function onSave() {
            var save, all, selected, view;

            selected = this.getSelectedKeys();
            all = this._sortActions(this.options.actions, this.getOrderedKeys());

            save = _array['default'].map(all, function (action) {
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
        _sortActions: function _sortActions(actions, order) {
            return actions.sort(function (a, b) {
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
        clear: function clear() {
            this.store = null;
            this.inherited(arguments);
        },
        show: function show() {
            this.refreshRequired = true;
            this.inherited(arguments);
        },
        createStore: function createStore() {
            var list = [],
                all = _array['default'].map(this.options.actions, function (action) {
                return action.id;
            }),
                order = this.getSavedOrderedKeys(),
                reduced,
                combined;

            // De-dup id's
            combined = order.concat(all);
            reduced = combined.reduce(function (previous, current) {
                if (previous.indexOf(current) === -1) {
                    previous.push(current);
                }

                return previous;
            }, []);

            // The order array could have had stale id's
            reduced = _array['default'].filter(reduced, function (key) {
                return all.indexOf(key) !== -1;
            });

            list = _array['default'].map(this._sortActions(this.options.actions, this.getSavedOrderedKeys()), function (action) {
                if (reduced.indexOf(action.id) > -1) {
                    return {
                        '$key': action.id,
                        '$descriptor': action.label
                    };
                } else {
                    return null;
                }
            });

            list = _array['default'].filter(list, function (item) {
                return item !== null;
            });

            return (0, _Memory['default'])({ data: list });
        },
        getSavedOrderedKeys: function getSavedOrderedKeys() {
            var save = this._getQuickActionPrefs();
            return _array['default'].map(save, function (action) {
                return action.id;
            });
        },
        getSavedSelectedKeys: function getSavedSelectedKeys() {
            var save = this._getQuickActionPrefs();
            save = _array['default'].filter(save, function (action) {
                return action.visible === true;
            });

            return _array['default'].map(save, function (action) {
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

    module.exports = __class;
});
