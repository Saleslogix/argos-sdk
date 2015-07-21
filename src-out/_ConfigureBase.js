<<<<<<< HEAD
define('argos/_ConfigureBase', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/query', 'dojo/dom-attr', 'dojo/dom-class', 'dojo/string', 'argos/_ListBase'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoQuery, _dojoDomAttr, _dojoDomClass, _dojoString, _argos_ListBase) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _query = _interopRequireDefault(_dojoQuery);

    var _domAttr = _interopRequireDefault(_dojoDomAttr);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _string = _interopRequireDefault(_dojoString);

    var _ListBase2 = _interopRequireDefault(_argos_ListBase);

    /**
     * @class argos._ConfigureBase
     *
     *
     * @extends argos._ListBase
     *
     */
    var __class = (0, _declare['default'])('argos._ConfigureBase', [_ListBase2['default']], {
        //Templates
        itemTemplate: new Simplate(['<h3>', '<span>{%: $.$descriptor %}</span>', '<span data-action="moveUp" class="fa fa-arrow-up"></span>', '<span data-action="moveDown" class="fa fa-arrow-down"></span>', '</h3>']),
=======
/**
 * @class argos._ConfigureBase
 *
 *
 * @extends argos._ListBase
 *
 */
define('argos/_ConfigureBase', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/query',
    'dojo/dom-attr',
    'dojo/dom-class',
    'dojo/string',
    'argos/_ListBase'
], function(
    declare,
    lang,
    query,
    domAttr,
    domClass,
    string,
    _ListBase
) {

    var __class = declare('argos._ConfigureBase', [_ListBase], {
        //Templates
        itemTemplate: new Simplate([
            '<h3>',
            '<span>{%: $.$descriptor %}</span>',
            '<span data-action="moveUp" class="fa fa-arrow-up"></span>',
            '<span data-action="moveDown" class="fa fa-arrow-down"></span>',
            '</h3>'
        ]),
>>>>>>> develop

        // Localization
        titleText: 'Configure',

        //View Properties
        id: 'configure_base',
        expose: false,
        enableSearch: false,
        enablePullToRefresh: false,
        selectionOnly: true,
        allowSelection: true,
        autoClearSelection: false,
        cls: 'configurable-list',
        lastMovedCls: 'last-moved',

<<<<<<< HEAD
        createToolLayout: function createToolLayout() {
=======
        createToolLayout: function() {
>>>>>>> develop
            return this.tools || (this.tools = {
                tbar: [{
                    id: 'save',
                    cls: 'fa fa-check fa-fw fa-lg',
                    fn: this.onSave,
                    scope: this
                }, {
                    id: 'cancel',
                    cls: 'fa fa-ban fa-fw fa-lg',
                    side: 'left',
                    fn: this.onCancel,
                    scope: ReUI
                }]
            });
        },
        /**
         * Invoked when the toolbar cancel button is pressed.
         */
<<<<<<< HEAD
        onCancel: function onCancel() {
=======
        onCancel: function() {
>>>>>>> develop
            ReUI.back();
        },
        /**
         * Invoked when the toolbar save button is pressed.
         */
<<<<<<< HEAD
        onSave: function onSave() {},
        moveUp: function moveUp(params) {
            var node, rows, prev;

            node = (0, _query['default'])(params.$source);
=======
        onSave: function() {
        },
        moveUp: function(params) {
            var node, rows, prev;

            node = query(params.$source);
>>>>>>> develop
            rows = node.parents('li');

            if (rows) {
                prev = rows.prev('li');
                rows.insertBefore(prev);
                this.clearLastMoved();

                // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
                // initial state (the css transition won't fire)
<<<<<<< HEAD
                setTimeout((function () {
=======
                setTimeout(function() {
>>>>>>> develop
                    rows.addClass(this.lastMovedCls);
                }).bind(this), 5);
            }
        },
<<<<<<< HEAD
        moveDown: function moveDown(params) {
            var node, rows, next;

            node = (0, _query['default'])(params.$source);
=======
        moveDown: function(params) {
            var node, rows, next;

            node = query(params.$source);
>>>>>>> develop
            rows = node.parents('li');

            if (rows) {
                next = rows.next('li');
                rows.insertAfter(next);
                this.clearLastMoved();

                // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
                // initial state (the css transition won't fire)
<<<<<<< HEAD
                setTimeout((function () {
=======
                setTimeout(function() {
>>>>>>> develop
                    rows.addClass(this.lastMovedCls);
                }).bind(this), 5);
            }
        },
<<<<<<< HEAD
        clearLastMoved: function clearLastMoved() {
            var nodes, cls;

            nodes = (0, _query['default'])('> li', this.contentNode);
            cls = this.lastMovedCls;

            nodes.forEach(function (node) {
                _domClass['default'].remove(node, cls);
            });
        },
        activateEntry: function activateEntry() {
            this.clearLastMoved();
            this.inherited(arguments);
        },
        hasMoreData: function hasMoreData() {
            return false;
        },
        createStore: function createStore() {},
=======
        clearLastMoved: function() {
            var nodes, cls;

            nodes = query('> li', this.contentNode);
            cls = this.lastMovedCls;

            nodes.forEach(function(node) {
                domClass.remove(node, cls);
            });
        },
        activateEntry: function() {
            this.clearLastMoved();
            this.inherited(arguments);
        },
        hasMoreData: function() {
            return false;
        },
        createStore: function() {
        },
>>>>>>> develop
        /**
         * Queries the DOM and returns selected item's idProperty in order.
         * @return {Array}
         */
<<<<<<< HEAD
        getSelectedKeys: function getSelectedKeys() {
=======
        getSelectedKeys: function() {
>>>>>>> develop
            var results = [];

            // Using forEach instead of map, because if we return a mapped NodeList to the caller, storing that in local storage will generate an error,
            // for some reason there is a _parent attribute on the NodeList that maeks it recursive.
<<<<<<< HEAD
            (0, _query['default'])('.list-item-selected', this.domNode).filter('[data-key]').forEach(function (node) {
                var key = _domAttr['default'].get(node, 'data-key');
=======
            query('.list-item-selected', this.domNode).filter('[data-key]').forEach(function(node) {
                var key = domAttr.get(node, 'data-key');
>>>>>>> develop
                if (key) {
                    results.push(key);
                }
            });

            return results;
        },
        /**
         * Queries the DOM and returns all of the idProperty attributes in order.
         * @return {Array}
         */
<<<<<<< HEAD
        getOrderedKeys: function getOrderedKeys() {
=======
        getOrderedKeys: function() {
>>>>>>> develop
            var results = [];

            // Using forEach instead of map, because if we return a mapped NodeList to the caller, storing that in local storage will generate an error,
            // for some reason there is a _parent attribute on the NodeList that maeks it recursive.
<<<<<<< HEAD
            (0, _query['default'])('li', this.domNode).filter('[data-key]').forEach(function (node) {
                var key = _domAttr['default'].get(node, 'data-key');
=======
            query('li', this.domNode).filter('[data-key]').forEach(function(node) {
                var key = domAttr.get(node, 'data-key');
>>>>>>> develop
                if (key) {
                    results.push(key);
                }
            });

            return results;
        },
        /**
         * Returns an array of keys in the order they were saved previously. This list will contain selected and un-selected items.
         * @return {Array}
         */
<<<<<<< HEAD
        getSavedOrderedKeys: function getSavedOrderedKeys() {
=======
        getSavedOrderedKeys: function() {
>>>>>>> develop
            return [];
        },
        /**
         * Returns an array of keys that were saved/previously selected, in order. Previous un-selected items will not be in this list.
         * ProcessData invokes this to select items in the selection model when it loads.
         * @return {Array}
         */
<<<<<<< HEAD
        getSavedSelectedKeys: function getSavedSelectedKeys() {
=======
        getSavedSelectedKeys: function() {
>>>>>>> develop
            return [];
        },
        /**
         * Processes data from the store. Restores previously selected items by calling this.getSavedSelectedKeys()
         */
<<<<<<< HEAD
        processData: function processData() {
            this.inherited(arguments);

            var visible, i, row;
=======
        processData: function() {
            this.inherited(arguments);

            var visible,
                i,
                row;
>>>>>>> develop

            visible = this.getSavedSelectedKeys();

            for (i = 0; i < visible.length; i++) {
                row = (0, _query['default'])(_string['default'].substitute('[data-key="${0}"]', [visible[i]]), this.domNode)[0];
                if (row) {
                    this._selectionModel.toggle(visible[i], this.entries[visible[i]], row);
                }
            }
        }
    });

<<<<<<< HEAD
    module.exports = __class;
=======
    return __class;
>>>>>>> develop
});

