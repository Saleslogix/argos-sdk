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
     * HTML that starts a new tab list
     */
    tabContentTemplate: new Simplate(['{%! $.tabListTemplate %}']),
    /**
     * @property {Simplate}
     * HTML that starts a new tab list
     */
    tabListTemplate: new Simplate(['<ul class="tab-list" data-dojo-attach-point="tabList">', '</ul>']),
    /**
     * @property {Simplate}
     * HTML that starts a new More tab list
     */
    moreTabListTemplate: new Simplate(['<ul class="more-tab-dropdown" data-dojo-attach-point="moreTabList">', '</ul>']),
    /**
     * @property {Simplate}
     * HTML that starts a new animation bar
     */
    tabListAnimTemplate: new Simplate(['<div class="tab-focus-indicator"></div>', '<div class="animated-bar"></div>']),
    /**
     * @property {Simplate}
     * HTML that creates a new tab to be placed in the tab list
     *
     * `$` => the view instance
     */
    tabListItemTemplate: new Simplate(['<li class="tab" data-action="selectedTab">', '{%: ($.title || $.options.title) %}', '</li>']),
    /**
     * @property {Simplate}
     * HTML that creates a new tab to be placed in the more tab list
     *
     * `$` => the view instance
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
     * @property {Array}
     * Mapping of tab to the section
     */
    tabMapping: null,

    /**
     * Changes the tab state in the tab list and changes visibility of content.
     * @param {Object} The event type and source.
     * @private
     */
    selectedTab: function selectedTab(params) {
      var tab = params.$source;
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
          var moreTab = (0, _query['default'])('.more-item', this.id)[0];
          if (_array['default'].indexOf(this.tabList.children, tab) > -1) {
            this.positionFocusState(tab);
            _domClass['default'].toggle(this.currentTab, 'selected');
            _domClass['default'].toggle(tab, 'selected');
            this.currentTab = tab;
            if (moreTab) {
              _domClass['default'].remove(moreTab, 'selected');
            }
          } else {
            if (moreTab) {
              this.positionFocusState(moreTab);
              _domClass['default'].add(moreTab, 'selected');
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
     * @private
     */
    toggleDropDown: function toggleDropDown(params) {
      var tab = params.$source;
      var moreTab = (0, _query['default'])('.more-item', this.id)[0];
      var icon = (0, _query['default'])('.fa', moreTab)[0];

      if (tab) {
        if (_domStyle['default'].get(this.moreTabList, 'visibility') === 'hidden') {
          _domStyle['default'].set(this.moreTabList, {
            visibility: 'visible'
          });
          if (icon) {
            _domClass['default'].replace(icon, 'fa fa-angle-down', 'fa fa-angle-right');
          }

          if (!this.moreTabList.style.left) {
            var posTop = moreTab.offsetTop;
            var posLeft = moreTab.offsetLeft;
            var width = parseInt(moreTab.offsetWidth, 10);
            var height = parseInt(moreTab.offsetHeight, 10);
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
        if (params.target !== moreTab) {
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
     * @private
     */
    reorderTabs: function reorderTabs() {
      var moreTab = (0, _query['default'])('.more-item', this.id)[0];
      this.inOverflow = false;

      if (this.moreTabList.children.length > 0) {
        if (moreTab) {
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

      if (moreTab && _array['default'].indexOf(this.moreTabList.children, this.currentTab) > -1) {
        this.positionFocusState(moreTab);
        _domClass['default'].add(moreTab, 'selected');
      } else {
        this.positionFocusState(this.currentTab);
      }
    },
    /**
     * Handler for positioning the focus bar for the tab list.
     * @param {Object} The target tab in the tabList.
     * @private
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
    },
    /**
     * Checks the tab to see if it causes an overflow when placed in the tabList, if so then push it a new list element called More.
     * @param {Object} The tab object.
     * @private
     */
    checkTabOverflow: function checkTabOverflow(tab) {
      if (tab.offsetTop > this.tabList.offsetTop) {
        if (!this.inOverflow) {
          var moreTab = _domConstruct['default'].toDom(this.moreTabItemTemplate.apply({
            title: this.moreText + '...'
          }, this));
          _domStyle['default'].set(moreTab, { // eslint-disable-line
            float: 'right'
          });
          _domConstruct['default'].place(moreTab, this.tabList);

          this.tabMoreIndex = _array['default'].indexOf(this.tabList.children, tab);
          this.tabList.children[this.tabMoreIndex].remove();
          if (this.tabList.children.length === 1 && !this.moreTabList.children.length) {
            _domClass['default'].add(moreTab, 'selected');
            this.currentTab = tab;
            _domClass['default'].toggle(tab, 'selected');
          }

          if (moreTab.offsetTop > this.tabList.offsetTop) {
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
    }
  });

  _lang['default'].setObject('Sage.Platform.Mobile.TabWidget', __class);
  module.exports = __class;
});
