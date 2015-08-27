import declare from 'dojo/_base/declare';
import query from 'dojo/query';
import domAttr from 'dojo/dom-attr';
import domClass from 'dojo/dom-class';
import string from 'dojo/string';
import _ListBase from 'argos/_ListBase';

const resource = window.localeContext.getEntitySync('configureBase').attributes;

/**
 * @class argos._ConfigureBase
 *
 *
 * @extends argos._ListBase
 *
 */
const __class = declare('argos._ConfigureBase', [_ListBase], {
  // Templates
  itemTemplate: new Simplate([
    '<h3>',
    '<span>{%: $.$descriptor %}</span>',
    '<span data-action="moveUp" class="fa fa-arrow-up"></span>',
    '<span data-action="moveDown" class="fa fa-arrow-down"></span>',
    '</h3>',
  ]),

  // Localization
  titleText: resource.titleText,

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
        scope: this,
      }, {
        id: 'cancel',
        cls: 'fa fa-ban fa-fw fa-lg',
        side: 'left',
        fn: this.onCancel,
        scope: ReUI,
      }],
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
    const node = query(params.$source);
    const rows = node.parents('li');

    if (rows) {
      const prev = rows.prev('li');
      rows.insertBefore(prev);
      this.clearLastMoved();

      // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
      // initial state (the css transition won't fire)
      setTimeout(function addClass() {
        rows.addClass(this.lastMovedCls);
      }.bind(this), 5);
    }
  },
  moveDown: function moveDown(params) {
    const node = query(params.$source);
    const rows = node.parents('li');

    if (rows) {
      const next = rows.next('li');
      rows.insertAfter(next);
      this.clearLastMoved();

      // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
      // initial state (the css transition won't fire)
      setTimeout(function addClass() {
        rows.addClass(this.lastMovedCls);
      }.bind(this), 5);
    }
  },
  clearLastMoved: function clearLastMoved() {
    const nodes = query('> li', this.contentNode);
    const cls = this.lastMovedCls;

    nodes.forEach((node) => {
      domClass.remove(node, cls);
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
    const results = [];

    // Using forEach instead of map, because if we return a mapped NodeList to the caller, storing that in local storage will generate an error,
    // for some reason there is a _parent attribute on the NodeList that maeks it recursive.
    query('.list-item-selected', this.domNode).filter('[data-key]').forEach((node) => {
      const key = domAttr.get(node, 'data-key');
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
    const results = [];

    // Using forEach instead of map, because if we return a mapped NodeList to the caller, storing that in local storage will generate an error,
    // for some reason there is a _parent attribute on the NodeList that maeks it recursive.
    query('li', this.domNode).filter('[data-key]').forEach((node) => {
      const key = domAttr.get(node, 'data-key');
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
    const visible = this.getSavedSelectedKeys();

    for (let i = 0; i < visible.length; i++) {
      const row = query((string.substitute('[data-key="${0}"]', [visible[i]])), this.domNode)[0];
      if (row) {
        this._selectionModel.toggle(visible[i], this.entries[visible[i]], row);
      }
    }
  },
});

export default __class;
