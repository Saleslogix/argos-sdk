define('argos/TabWidget', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/array', 'dojo/dom-class', 'dojo/dom-construct', 'dojo/dom-style', 'dojo/query', 'argos/_Templated'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseArray, _dojoDomClass, _dojoDomConstruct, _dojoDomStyle, _dojoQuery, _argos_Templated) {
  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

  /**
   * @class argos.TabWidget
   * @alternateClassName TabWidget
   */

  var _declare = _interopRequireDefault(_dojo_baseDeclare);

  var _lang = _interopRequireDefault(_dojo_baseLang);

  var _array = _interopRequireDefault(_dojo_baseArray);

  var _domClass = _interopRequireDefault(_dojoDomClass);

  var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

  var _domStyle = _interopRequireDefault(_dojoDomStyle);

  var _query = _interopRequireDefault(_dojoQuery);

  var _Templated2 = _interopRequireDefault(_argos_Templated);

  var __class = (0, _declare['default'])('argos.TabWidget', [_Templated2['default']], {
    /**
     * @property {Simplate}
     * HTML that defines a new tab list
     */
    tabContentTemplate: new Simplate(['{%! $.tabListTemplate %}']),
    /**
     * @property {Simplate}
     * HTML that defines a new tab list
     */
    tabListTemplate: new Simplate(['<ul class="tab-list" data-dojo-attach-point="tabList">', '</ul>']),
    /**
     * @property {Simplate}
     * HTML that defines a new More tab list
     */
    moreTabListTemplate: new Simplate(['<ul class="more-tab-dropdown" data-dojo-attach-point="moreTabList">', '</ul>']),
    /**
     * @property {Simplate}
     * HTML that defines a new animation bar
     */
    tabListAnimTemplate: new Simplate(['<div class="tab-focus-indicator"></div>', '<div class="animated-bar"></div>']),
    /**
     * @property {Simplate}
     * HTML that defines a new tab to be placed in the tab list
     *
     */
    tabListItemTemplate: new Simplate(['<li class="tab" data-action="selectedTab">', '{%: ($.title || $.options.title) %}', '</li>']),
    /**
     * @property {Simplate}
     * HTML that defines a new tab to be placed in the more tab list
     *
     */
    moreTabItemTemplate: new Simplate(['<li class="tab more-item" data-action="toggleDropDown">', '{%: ($.title || $.options.title) %}', '<span class="fa fa-angle-right"></span>', '</li>']),

    /**
     * @cfg {String}
     * More text that is used as the overflow tab for the tab list
     */
    moreText: 'More',
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
    changeTab: function changeTab() {
      var tab = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (tab !== this.currentTab) {
        var indexShift = this.tabList.children.length - 1;
        var currentIndex = _array['default'].indexOf(this.tabList.children, this.currentTab);
        if (currentIndex === -1) {
          currentIndex = _array['default'].indexOf(this.moreTabList.children, this.currentTab) + indexShift;
        }
        var selectedIndex = _array['default'].indexOf(this.tabList.children, tab);
        if (selectedIndex === -1) {
          selectedIndex = _array['default'].indexOf(this.moreTabList.children, tab) + indexShift;
        }
        if (currentIndex > -1 && selectedIndex > -1) {
          _domStyle['default'].set(this.tabMapping[currentIndex], {
            display: 'none'
          });
          _domStyle['default'].set(this.tabMapping[selectedIndex], {
            display: 'block'
          });
          if (_array['default'].indexOf(this.tabList.children, tab) > -1) {
            this.positionFocusState(tab);
            _domClass['default'].toggle(this.currentTab, 'selected');
            _domClass['default'].toggle(tab, 'selected');
            this.currentTab = tab;
            if (this.moreTab) {
              _domClass['default'].remove(this.moreTab, 'selected');
            }
          } else {
            if (this.moreTab) {
              this.tabFocusSelect(this.moreTab);
              _domClass['default'].toggle(this.currentTab, 'selected');
              _domClass['default'].toggle(tab, 'selected');
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
      var tab = params.$source;
      this.changeTab(tab);
    },
    tabFocusSelect: function tabFocusSelect() {
      var tab = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this.positionFocusState(tab);
      _domClass['default'].add(tab, 'selected');
    },
    /**
     * Changes the tab state in the tab list and changes visibility of content.
     * @param {Object} The event type and source.
     */
    toggleDropDown: function toggleDropDown(params) {
      var tab = params.$source;
      var icon = (0, _query['default'])('.fa', this.moreTab)[0];

      if (tab) {
        if (_domStyle['default'].get(this.moreTabList, 'visibility') === 'hidden') {
          _domStyle['default'].set(this.moreTabList, {
            visibility: 'visible'
          });
          if (icon) {
            _domClass['default'].replace(icon, 'fa fa-angle-down', 'fa fa-angle-right');
          }

          if (!this.moreTabList.style.left) {
            var posTop = this.moreTab.offsetTop;
            var posLeft = this.moreTab.offsetLeft;
            var width = parseInt(this.moreTab.offsetWidth, 10);
            var height = parseInt(this.moreTab.offsetHeight, 10);
            var maxHeight = this.domNode.offsetHeight - this.domNode.offsetTop - posTop;

            _domStyle['default'].set(this.moreTabList, {
              left: posLeft - this.moreTabList.offsetWidth + width + 'px',
              top: posTop + height + 'px',
              maxHeight: maxHeight + 'px'
            });
          }
        } else {
          _domStyle['default'].set(this.moreTabList, {
            visibility: 'hidden'
          });
          if (icon) {
            _domClass['default'].replace(icon, 'fa fa-angle-right', 'fa fa-angle-down');
          }
        }
      } else {
        if (params.target !== this.moreTab) {
          _domStyle['default'].set(this.moreTabList, {
            visibility: 'hidden'
          });
          if (icon) {
            _domClass['default'].replace(icon, 'fa fa-angle-right', 'fa fa-angle-down');
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
          this.tabList.children[this.tabList.children.length - 1].remove();
        }
        // Need to reference a different array when calling array.forEach since this.moreTabList.children is being modified, hence have arr be this.moreTabList.children
        var arr = [].slice.call(this.moreTabList.children);
        _array['default'].forEach(arr, function placeFromMoreTab(tab) {
          this.moreTabList.children[_array['default'].indexOf(this.moreTabList.children, tab)].remove();
          _domConstruct['default'].place(tab, this.tabList);
          this.checkTabOverflow(tab);
        }, this);
      } else {
        var arr = [].slice.call(this.tabList.children);
        _domConstruct['default'].empty(this.tabList);
        _array['default'].forEach(arr, function recreateTabList(tab) {
          _domConstruct['default'].place(tab, this.tabList);
          this.checkTabOverflow(tab);
        }, this);
      }

      if (this.moreTab && _array['default'].indexOf(this.moreTabList.children, this.currentTab) > -1) {
        this.tabFocusSelect(this.moreTab);
      } else {
        this.positionFocusState(this.currentTab);
      }
      return this;
    },
    /**
     * Sets the parentNode for the tabList
     */
    placeTabList: function placeTabList() {
      var parentNode = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      if (!this.tabList.parentNode && this.isTabbed) {
        this.tabMapping = [];
        this.tabs = [];
        _domConstruct['default'].place(this.tabList, parentNode);
        _domConstruct['default'].place(this.tabListAnimTemplate.apply(), parentNode);
        if (!this.moreTabList.parentNode) {
          _domConstruct['default'].place(this.moreTabList, parentNode);
        }
      }
      return this;
    },
    /**
     * Handler for positioning the focus bar for the tab list.
     * @param {Object} The target tab in the tabList.
     */
    positionFocusState: function positionFocusState(target) {
      var focusState = (0, _query['default'])('.animated-bar', this.id)[0];

      if (focusState) {
        var posTop = target.offsetTop;
        var posLeft = target.offsetLeft;
        var width = parseInt(target.offsetWidth, 10);
        var height = parseInt(target.offsetHeight, 10);
        var tableTop = this.tabList.offsetTop;
        var tableLeft = this.tabList.offsetLeft;

        _domStyle['default'].set(focusState, {
          left: posLeft - tableLeft + 'px',
          top: posTop - tableTop + 'px',
          right: posTop - tableTop + width + 'px',
          bottom: posTop - tableTop + height + 'px',
          width: width + 'px'
        });
      }
      return this;
    },
    /**
     * Creates the moretab and sets the style to float right
     */
    createMoretab: function createMoretab() {
      this.moreTab = _domConstruct['default'].toDom(this.moreTabItemTemplate.apply({
        title: this.moreText + '...'
      }, this));
      _domStyle['default'].set(this.moreTab, { // eslint-disable-line
        float: 'right'
      });
      _domConstruct['default'].place(this.moreTab, this.tabList);
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
          this.tabMoreIndex = _array['default'].indexOf(this.tabList.children, tab);
          this.tabList.children[this.tabMoreIndex].remove();
          if (this.tabList.children.length === 1 && !this.moreTabList.children.length) {
            _domClass['default'].add(this.moreTab, 'selected');
            this.currentTab = tab;
            _domClass['default'].toggle(tab, 'selected');
          }

          if (this.moreTab.offsetTop > this.tabList.offsetTop) {
            this.tabMoreIndex = this.tabMoreIndex - 1;
            var replacedTab = this.tabList.children[this.tabMoreIndex];
            this.tabList.children[this.tabMoreIndex].remove();
            _domConstruct['default'].place(replacedTab, this.moreTabList);
          }

          _domConstruct['default'].place(tab, this.moreTabList);
          this.inOverflow = true;
          this.tabMoreIndex++;
        } else {
          this.tabList.children[this.tabMoreIndex].remove();
          _domConstruct['default'].place(tab, this.moreTabList);
        }
      }
      return this;
    },
    /**
     * Function used to create the tabs, should be called by the parent upon completion of populating the tabs array of dom objects
     * @param {Array} An array of the tab objects.
    */
    createTabs: function createTabs() {
      var tabs = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];

      _array['default'].forEach(tabs, function placeTab(tab) {
        if (this.defaultTabIndex && this.defaultTabIndex >= 0) {
          if (this.defaultTabIndex === this.tabList.children.length) {
            this.currentTab = tab;
            _domStyle['default'].set(this.tabMapping[_array['default'].indexOf(tabs, tab)], {
              display: 'block'
            });
          }
        } else {
          if (this.tabList.children.length === 0) {
            this.currentTab = tab;
            _domStyle['default'].set(this.tabMapping[_array['default'].indexOf(tabs, tab)], {
              display: 'block'
            });
          }
        }
        _domConstruct['default'].place(tab, this.tabList);
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
        _domStyle['default'].set(this.tabMapping[0], {
          display: 'block'
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
        _domConstruct['default'].empty(this.tabList);
        if (this.moreTabList) {
          _domConstruct['default'].empty(this.moreTabList);
          _domStyle['default'].set(this.moreTabList, {
            left: '',
            visibility: 'hidden'
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
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.TabWidget', __class);
  module.exports = __class;
});
