import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import array from 'dojo/_base/array';
import domClass from 'dojo/dom-class';
import domConstruct from 'dojo/dom-construct';
import domStyle from 'dojo/dom-style';
import query from 'dojo/query';
import _Templated from 'argos/_Templated';
import getResource from './I18n';

const resource = getResource('tabWidget');

/**
 * @class argos.TabWidget
 * @alternateClassName TabWidget
 */
const __class = declare('argos.TabWidget', [_Templated], {
  /**
   * @property {Simplate}
   * HTML that defines a new tab list
   */
  tabContentTemplate: new Simplate([
    '{%! $.tabListTemplate %}',
  ]),
  /**
   * @property {Simplate}
   * HTML that defines a new tab list
   */
  tabListTemplate: new Simplate([
    '<ul class="tab-list" data-dojo-attach-point="tabList" onclick="">',
    '</ul>',
  ]),
  /**
   * @property {Simplate}
   * HTML that defines a new More tab list
   */
  moreTabListTemplate: new Simplate([
    '<ul class="more-tab-dropdown" data-dojo-attach-point="moreTabList">',
    '</ul>',
  ]),
  /**
   * @property {Simplate}
   * HTML that defines a new animation bar
   */
  tabListAnimTemplate: new Simplate([
    '<div class="tab-focus-indicator"></div>',
    '<div class="animated-bar"></div>',
  ]),
  /**
   * @property {Simplate}
   * HTML that defines a new tab to be placed in the tab list
   *
   */
  tabListItemTemplate: new Simplate([
    '<li class="tab" data-action="selectedTab">',
    '{%: ($.title || $.options.title) %}',
    '</li>',
  ]),
  /**
   * @property {Simplate}
   * HTML that defines a new tab to be placed in the more tab list
   *
   */
  moreTabItemTemplate: new Simplate([
    '<li class="tab more-item" data-action="toggleDropDown">',
    '{%: ($.title || $.options.title) %}',
    '<span class="fa fa-fw fa-angle-right"></span>',
    '</li>',
  ]),

  /**
   * @cfg {String}
   * More text that is used as the overflow tab for the tab list
   */
  moreText: resource.moreText,
  /**
   * @property {li}
   * Current tab (html element li) that the view is on
   */
  currentTab: null,
  /**
   * @property {bool}
   * Boolean value for whether tabs caused an overflow in the tab list
   */
  inOverflow: false,
  /**
   * @property {int}
   * int value representing the index at which the more tab starts (used to place the remaining tabs into the more tab)
   */
  tabMoreIndex: null,
  /**
   * @property {int}
   * int value representing the index at which the default tab is located
   */
  defaultTabIndex: null,
  /**
   * @property {Array}
   * Mapping of tab to the section
   */
  tabMapping: null,
  /**
   * @property {Array}
   * Array holding the tab dom elements
   */
  tabs: null,
  /**
   * @property {Object}
   * Moretab object that is used to aggregate extra tabs
   */
  moreTab: null,

  /**
   * Changes the tab state in the tab list and changes visibility of content.
   * @param {Object} The tab to change to
   */
  changeTab: function changeTab(tab = {}) {
    if (tab !== this.currentTab) {
      const indexShift = this.tabList.children.length - 1;
      let currentIndex = array.indexOf(this.tabList.children, this.currentTab);
      if (currentIndex === -1) {
        currentIndex = array.indexOf(this.moreTabList.children, this.currentTab) + indexShift;
      }
      let selectedIndex = array.indexOf(this.tabList.children, tab);
      if (selectedIndex === -1) {
        selectedIndex = array.indexOf(this.moreTabList.children, tab) + indexShift;
      }
      if (currentIndex > -1 && selectedIndex > -1) {
        domStyle.set(this.tabMapping[currentIndex], {
          display: 'none',
        });
        domStyle.set(this.tabMapping[selectedIndex], {
          display: 'block',
        });
        if (array.indexOf(this.tabList.children, tab) > -1) {
          this.positionFocusState(tab);
          domClass.toggle(this.currentTab, 'selected');
          domClass.toggle(tab, 'selected');
          this.currentTab = tab;
          if (this.moreTab) {
            domClass.remove(this.moreTab, 'selected');
          }
        } else {
          if (this.moreTab) {
            this.tabFocusSelect(this.moreTab);
            domClass.toggle(this.currentTab, 'selected');
            domClass.toggle(tab, 'selected');
            this.currentTab = tab;
          }
        }
      }
    }
  },
  /**
   * Changes the tab state in the tab list and changes visibility of content.
   * @param {Object} The event type and source.
   */
  selectedTab: function selectedTab(params) {
    const tab = params.$source;
    this.changeTab(tab);
  },
  tabFocusSelect: function tabFocusSelect(tab = {}) {
    this.positionFocusState(tab);
    domClass.add(tab, 'selected');
  },
  /**
   * Changes the tab state in the tab list and changes visibility of content.
   * @param {Object} The event type and source.
   */
  toggleDropDown: function toggleDropDown(params) {
    const tab = params.$source;
    const icon = query('.fa', this.moreTab)[0];

    if (tab) {
      if (domStyle.get(this.moreTabList, 'visibility') === 'hidden') {
        domStyle.set(this.moreTabList, {
          visibility: 'visible',
        });
        if (icon) {
          domClass.replace(icon, 'fa-angle-down', 'fa-angle-right');
        }

        if (!this.moreTabList.style.left) {
          const posTop = this.moreTab.offsetTop;
          const posLeft = this.moreTab.offsetLeft;
          const width = parseInt(this.moreTab.offsetWidth, 10);
          const height = parseInt(this.moreTab.offsetHeight, 10);
          const maxHeight = this.domNode.offsetHeight - this.domNode.offsetTop - posTop;

          domStyle.set(this.moreTabList, {
            left: posLeft - this.moreTabList.offsetWidth + width + 'px',
            top: posTop + height + 'px',
            maxHeight: maxHeight + 'px',
          });
        }
      } else {
        domStyle.set(this.moreTabList, {
          visibility: 'hidden',
        });
        if (icon) {
          domClass.replace(icon, 'fa-angle-right', 'fa-angle-down');
        }
      }
    } else {
      if (params.target !== this.moreTab && params.target !== icon) {
        domStyle.set(this.moreTabList, {
          visibility: 'hidden',
        });
        if (icon && this.moreTab) {
          domClass.replace(icon, 'fa fa-angle-right', 'fa fa-angle-down');
        }
      }
    }
  },
  /**
   * Reorganizes the tab when the screen orientation changes.
   */
  reorderTabs: function reorderTabs() {
    this.inOverflow = false;

    if (this.moreTabList.children.length > 0) {
      if (this.moreTab) {
        this.ieFixRemove(this.tabList, this.tabList.children.length - 1);
      }
      // Need to reference a different array when calling array.forEach since this.moreTabList.children is being modified, hence have arr be this.moreTabList.children
      const arr = [].slice.call(this.moreTabList.children);
      array.forEach(arr, function placeFromMoreTab(tab) {
        this.ieFixRemove(this.moreTabList, array.indexOf(this.moreTabList.children, tab));
        domConstruct.place(tab, this.tabList);
        this.checkTabOverflow(tab);
      }, this);
    } else {
      let temp = this.tabList.children;
      let isIE = false;
      if (!temp[0].remove) { // Check if is IE
        temp = this.tabList.cloneNode(true).children;
        isIE = true;
      }
      const arr = [].slice.call(temp);
      if (isIE) {
        this.currentTab = arr[array.indexOf(this.tabList.children, this.currentTab)];
      }
      domConstruct.empty(this.tabList);
      array.forEach(arr, function recreateTabList(tab) {
        domConstruct.place(tab, this.tabList);
        this.checkTabOverflow(tab);
      }, this);
    }

    if (this.moreTab && array.indexOf(this.moreTabList.children, this.currentTab) > -1) {
      this.tabFocusSelect(this.moreTab);
    } else {
      this.positionFocusState(this.currentTab);
    }
    return this;
  },
  /**
   * Sets the parentNode for the tabList
   */
  placeTabList: function placeTabList(parentNode = {}) {
    if (!this.tabList.parentNode && this.isTabbed) {
      this.tabMapping = [];
      this.tabs = [];
      domConstruct.place(this.tabList, parentNode);
      domConstruct.place(this.tabListAnimTemplate.apply(), parentNode);
      if (!this.moreTabList.parentNode) {
        domConstruct.place(this.moreTabList, parentNode);
      }
    }
    return this;
  },
  /**
   * Handler for positioning the focus bar for the tab list.
   * @param {Object} The target tab in the tabList.
   */
  positionFocusState: function positionFocusState(target) {
    const focusState = query('.animated-bar', this.id)[0];

    if (focusState) {
      const posTop = target.offsetTop;
      const posLeft = target.offsetLeft;
      const width = parseInt(target.offsetWidth, 10);
      const height = parseInt(target.offsetHeight, 10);
      const tableTop = this.tabList.offsetTop;
      const tableLeft = this.tabList.offsetLeft;

      domStyle.set(focusState, {
        left: posLeft - tableLeft + 'px',
        right: (posTop - tableTop) + width + 'px',
        bottom: (posTop - tableTop) + height + 'px',
        width: width + 'px',
      });
    }
    return this;
  },
  /**
   * Creates the moretab and sets the style to float right
   */
  createMoretab: function createMoretab() {
    this.moreTab = domConstruct.toDom(this.moreTabItemTemplate.apply({
      title: this.moreText + '...',
    }, this));
    domStyle.set(this.moreTab, { // eslint-disable-line
      float: 'right',
    });
    domConstruct.place(this.moreTab, this.tabList);
    return this;
  },
  /**
   * Checks the tab to see if it causes an overflow when placed in the tabList, if so then push it a new list element called More.
   * @param {Object} The tab object.
   */
  checkTabOverflow: function checkTabOverflow(tab) {
    if (tab.offsetTop > this.tabList.offsetTop) {
      if (!this.inOverflow) {
        this.createMoretab();
        this.tabMoreIndex = array.indexOf(this.tabList.children, tab);
        this.ieFixRemove(this.tabList, this.tabMoreIndex);
        if (this.tabList.children.length === 1 && !this.moreTabList.children.length) {
          domClass.add(this.moreTab, 'selected');
          this.currentTab = tab;
          domClass.toggle(tab, 'selected');
        }

        if (this.moreTab.offsetTop > this.tabList.offsetTop) {
          this.tabMoreIndex = this.tabMoreIndex - 1;
          const replacedTab = this.tabList.children[this.tabMoreIndex];
          this.ieFixRemove(this.tabList, this.tabMoreIndex);
          domConstruct.place(replacedTab, this.moreTabList);
        }

        domConstruct.place(tab, this.moreTabList);
        this.inOverflow = true;
        this.tabMoreIndex++;
      } else {
        this.ieFixRemove(this.tabList, this.tabMoreIndex);
        domConstruct.place(tab, this.moreTabList);
      }
    }
    return this;
  },
  /**
   * Function used to create the tabs, should be called by the parent upon completion of populating the tabs array of dom objects
   * @param {Array} An array of the tab objects.
  */
  createTabs: function createTabs(tabs = []) {
    array.forEach(tabs, function placeTab(tab) {
      if (this.defaultTabIndex && this.defaultTabIndex >= 0) {
        if (this.defaultTabIndex === this.tabList.children.length) {
          this.currentTab = tab;
          domStyle.set(this.tabMapping[array.indexOf(tabs, tab)], {
            display: 'block',
          });
        }
      } else {
        if (this.tabList.children.length === 0) {
          this.currentTab = tab;
          domStyle.set(this.tabMapping[array.indexOf(tabs, tab)], {
            display: 'block',
          });
        }
      }
      domConstruct.place(tab, this.tabList);
      this.checkTabOverflow(tab);
    }, this);

    if (this.currentTab) {
      if (this.tabList.children.length === 1 && this.moreTabList.children.length) {
        if (this.moreTab) {
          this.tabFocusSelect(this.moreTab);
        }
      } else {
        this.tabFocusSelect(this.currentTab);
      }
    } else {
      this.currentTab = this.tabs[0];
      domStyle.set(this.tabMapping[0], {
        display: 'block',
      });
      this.tabFocusSelect(this.currentTab);
    }
    return this;
  },
  /**
   * Function used to clear the tabs, should be called by the parent on it's clear call
  */
  clearTabs: function clearTabs() {
    if (this.tabList) {
      domConstruct.empty(this.tabList);
      if (this.moreTabList) {
        domConstruct.empty(this.moreTabList);
        domStyle.set(this.moreTabList, {
          left: '',
          visibility: 'hidden',
        });
      }
    }
    if (this.tabMapping) {
      this.tabs = [];
      this.tabMapping = [];
      this.inOverflow = false;
      this.tabMoreIndex = null;
    }
    return this;
  },
  ieFixRemove: function ieFixRemove(parent, indexToRemove = 0) {
    if (parent.children[indexToRemove].remove) {
      return parent.children[indexToRemove].remove();
    }
    return parent.removeChild(parent.children[indexToRemove]);
  },
});

lang.setObject('Sage.Platform.Mobile.TabWidget', __class);
export default __class;
