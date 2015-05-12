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

        createToolLayout: function() {
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
        onCancel: function() {
            ReUI.back();
        },
        /**
         * Invoked when the toolbar save button is pressed.
         */
        onSave: function() {
        },
        moveUp: function(params) {
            var node, rows, prev;

            node = query(params.$source);
            rows = node.parents('li');

            if (rows) {
                prev = rows.prev('li');
                rows.insertBefore(prev);
                this.clearLastMoved();

                // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
                // initial state (the css transition won't fire)
                setTimeout(function() {
                    rows.addClass(this.lastMovedCls);
                }.bind(this), 5);
            }
        },
        moveDown: function(params) {
            var node, rows, next;

            node = query(params.$source);
            rows = node.parents('li');

            if (rows) {
                next = rows.next('li');
                rows.insertAfter(next);
                this.clearLastMoved();

                // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
                // initial state (the css transition won't fire)
                setTimeout(function() {
                    rows.addClass(this.lastMovedCls);
                }.bind(this), 5);
            }
        },
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
        /**
         * Queries the DOM and returns selected item's idProperty in order.
         * @return {Array}
         */
        getSelectedKeys: function() {
            var results = [];

            // Using forEach instead of map, because if we return a mapped NodeList to the caller, storing that in local storage will generate an error,
            // for some reason there is a _parent attribute on the NodeList that maeks it recursive.
            query('.list-item-selected', this.domNode).filter('[data-key]').forEach(function(node) {
                var key = domAttr.get(node, 'data-key');
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
        getOrderedKeys: function() {
            var results = [];

            // Using forEach instead of map, because if we return a mapped NodeList to the caller, storing that in local storage will generate an error,
            // for some reason there is a _parent attribute on the NodeList that maeks it recursive.
            query('li', this.domNode).filter('[data-key]').forEach(function(node) {
                var key = domAttr.get(node, 'data-key');
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
        getSavedOrderedKeys: function() {
            return [];
        },
        /**
         * Returns an array of keys that were saved/previously selected, in order. Previous un-selected items will not be in this list.
         * ProcessData invokes this to select items in the selection model when it loads.
         * @return {Array}
         */
        getSavedSelectedKeys: function() {
            return [];
        },
        /**
         * Processes data from the store. Restores previously selected items by calling this.getSavedSelectedKeys()
         */
        processData: function() {
            this.inherited(arguments);

            var visible,
                i,
                row;

            visible = this.getSavedSelectedKeys();

            for (i = 0; i < visible.length; i++) {
                row = query((string.substitute('[data-key="${0}"]', [visible[i]])), this.domNode)[0];
                if (row) {
                    this._selectionModel.toggle(visible[i], this.entries[visible[i]], row);
                }
            }
        }
    });

    return __class;
});

