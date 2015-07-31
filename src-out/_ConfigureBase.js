define('argos/_ConfigureBase', ['exports', 'module', 'dojo/_base/declare', 'dojo/query', 'dojo/dom-attr', 'dojo/dom-class', 'dojo/string', 'argos/_ListBase'], function (exports, module, _dojo_baseDeclare, _dojoQuery, _dojoDomAttr, _dojoDomClass, _dojoString, _argos_ListBase) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

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
    // Templates
    itemTemplate: new Simplate(['<h3>', '<span>{%: $.$descriptor %}</span>', '<span data-action="moveUp" class="fa fa-arrow-up"></span>', '<span data-action="moveDown" class="fa fa-arrow-down"></span>', '</h3>']),

    // Localization
    titleText: 'Configure',

    // View Properties
    id: 'configure_base',
    expose: false,
    enableSearch: false,
    enablePullToRefresh: false,
    selectionOnly: true,
    allowSelection: true,
    autoClearSelection: false,
    cls: 'configurable-list',
    lastMovedCls: 'last-moved',

    createToolLayout: function createToolLayout() {
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
    onCancel: function onCancel() {
      ReUI.back();
    },
    /**
     * Invoked when the toolbar save button is pressed.
     */
    onSave: function onSave() {},
    moveUp: function moveUp(params) {
      var node = (0, _query['default'])(params.$source);
      var rows = node.parents('li');

      if (rows) {
        var prev = rows.prev('li');
        rows.insertBefore(prev);
        this.clearLastMoved();

        // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
        // initial state (the css transition won't fire)
        setTimeout((function addClass() {
          rows.addClass(this.lastMovedCls);
        }).bind(this), 5);
      }
    },
    moveDown: function moveDown(params) {
      var node = (0, _query['default'])(params.$source);
      var rows = node.parents('li');

      if (rows) {
        var next = rows.next('li');
        rows.insertAfter(next);
        this.clearLastMoved();

        // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
        // initial state (the css transition won't fire)
        setTimeout((function addClass() {
          rows.addClass(this.lastMovedCls);
        }).bind(this), 5);
      }
    },
    clearLastMoved: function clearLastMoved() {
      var nodes = (0, _query['default'])('> li', this.contentNode);
      var cls = this.lastMovedCls;

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
    /**
     * Queries the DOM and returns selected item's idProperty in order.
     * @return {Array}
     */
    getSelectedKeys: function getSelectedKeys() {
      var results = [];

      // Using forEach instead of map, because if we return a mapped NodeList to the caller, storing that in local storage will generate an error,
      // for some reason there is a _parent attribute on the NodeList that maeks it recursive.
      (0, _query['default'])('.list-item-selected', this.domNode).filter('[data-key]').forEach(function (node) {
        var key = _domAttr['default'].get(node, 'data-key');
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
    getOrderedKeys: function getOrderedKeys() {
      var results = [];

      // Using forEach instead of map, because if we return a mapped NodeList to the caller, storing that in local storage will generate an error,
      // for some reason there is a _parent attribute on the NodeList that maeks it recursive.
      (0, _query['default'])('li', this.domNode).filter('[data-key]').forEach(function (node) {
        var key = _domAttr['default'].get(node, 'data-key');
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
    getSavedOrderedKeys: function getSavedOrderedKeys() {
      return [];
    },
    /**
     * Returns an array of keys that were saved/previously selected, in order. Previous un-selected items will not be in this list.
     * ProcessData invokes this to select items in the selection model when it loads.
     * @return {Array}
     */
    getSavedSelectedKeys: function getSavedSelectedKeys() {
      return [];
    },
    /**
     * Processes data from the store. Restores previously selected items by calling this.getSavedSelectedKeys()
     */
    processData: function processData() {
      this.inherited(arguments);
      var visible = this.getSavedSelectedKeys();

      for (var i = 0; i < visible.length; i++) {
        var row = (0, _query['default'])(_string['default'].substitute('[data-key="${0}"]', [visible[i]]), this.domNode)[0];
        if (row) {
          this._selectionModel.toggle(visible[i], this.entries[visible[i]], row);
        }
      }
    }
  });

  module.exports = __class;
});
