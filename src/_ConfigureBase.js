import declare from 'dojo/_base/declare';
import DraggableList from './DraggableList';
import getResource from './I18n';


const resource = getResource('configureBase');

/**
 * @class argos._ConfigureBase
 * @extends argos._ListBase
 */
const __class = declare('argos._ConfigureBase', [DraggableList], /** @lends argos._ConfigureBase# */{
  // Templates
  itemTemplate: new Simplate([
    '<h4>',
    '<span>{%: $.$descriptor %}</span>',
    '</h4>',
    `<button type="button" class="btn-icon hide-focus draggable">
      <svg class="icon" focusable="false" aria-hidden="true" role="presentation">
        <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-drag"></use>
      </svg>
    </button>`,
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
        svg: 'check',
        fn: this.onSave,
        scope: this,
      }, {
        id: 'cancel',
        svg: 'cancel',
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
    const node = $(params.$source);
    const rows = node.parents('li');

    if (rows.length) {
      const prev = rows.prev('li');
      rows.insertBefore(prev);
      this.clearLastMoved();

      // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
      // initial state (the css transition won't fire)
      setTimeout(() => {
        rows.addClass(this.lastMovedCls);
      }, 5);
    }
  },
  moveDown: function moveDown(params) {
    const node = $(params.$source);
    const rows = node.parents('li');

    if (rows.length) {
      const next = rows.next('li');
      rows.insertAfter(next);
      this.clearLastMoved();

      // The setTimeout is so the browser doesn't think the last-moved class is part of the node's
      // initial state (the css transition won't fire)
      setTimeout(() => {
        rows.addClass(this.lastMovedCls);
      }, 5);
    }
  },
  clearLastMoved: function clearLastMoved() {
    const nodes = $('> li', this.contentNode);
    const cls = this.lastMovedCls;

    nodes.each((_, node) => {
      $(node).removeClass(cls);
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
    $('.list-item-selected', this.domNode).filter('[data-key]').each((_, node) => {
      const key = $(node).attr('data-key');
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
    $('li', this.domNode).filter('[data-key]').each((_, node) => {
      const key = $(node).attr('data-key');
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
      const row = $(`[data-key="${visible[i]}"]`, this.domNode).get(0);
      if (row) {
        this._selectionModel.toggle(visible[i], this.entries[visible[i]], row);
      }
    }
  },
});

export default __class;
