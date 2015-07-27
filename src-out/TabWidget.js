define('argos/TabWidget', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/_base/array', 'dojo/string', 'dojo/dom-attr', 'dojo/dom-class', 'dojo/dom-construct', 'dojo/dom-style', 'dojo/query', 'moment', 'argos/_Templated'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojo_baseArray, _dojoString, _dojoDomAttr, _dojoDomClass, _dojoDomConstruct, _dojoDomStyle, _dojoQuery, _moment, _argos_Templated) {
		function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

		/**
   * @class argos.TabWidget
   * @alternateClassName TabWidget
   */

		var _declare = _interopRequireDefault(_dojo_baseDeclare);

		var _lang = _interopRequireDefault(_dojo_baseLang);

		var _array = _interopRequireDefault(_dojo_baseArray);

		var _string = _interopRequireDefault(_dojoString);

		var _domAttr = _interopRequireDefault(_dojoDomAttr);

		var _domClass = _interopRequireDefault(_dojoDomClass);

		var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

		var _domStyle = _interopRequireDefault(_dojoDomStyle);

		var _query = _interopRequireDefault(_dojoQuery);

		var _moment2 = _interopRequireDefault(_moment);

		var _Templated2 = _interopRequireDefault(_argos_Templated);

		var __class = (0, _declare['default'])('argos.TabWidget', [_Templated2['default']], {
				/**
     * @property {Simplate}
     * HTML that starts a new tab list
     */
				tabContentTemplate: new Simplate(['<div class="panel-content" data-dojo-attach-point="contentNode">', '{%! $.tabListTemplate %}', '</div>']),
				/**
     * @property {Simplate}
     * HTML that starts a new tab list
     */
				tabListTemplate: new Simplate(['<ul class="tab-list" data-dojo-attach-point="tabList"></ul>']),
				/**
     * @property {Simplate}
     * HTML that starts a new More tab list
     */
				moreTabListTemplate: new Simplate(['<ul class="more-tab-dropdown" data-dojo-attach-point="moreTabList"></ul>']),
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
				tabListItemTemplate: new Simplate(['<li class="tab" data-action="changeTab">', '{%: ($.title || $.options.title) %}', '</li>']),
				/**
     * @property {Simplate}
     * HTML that creates a new tab to be placed in the more tab list
     *
     * `$` => the view instance
     */
				moreTabItemTemplate: new Simplate(['<li class="tab more-item" data-action="toggleDropDown">', '{%: ($.title || $.options.title) %}', '<span class="fa fa-angle-down"></span>', '</li>']),

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
				changeTab: function changeTab(params) {
						var currentIndex,
						    tabIndex,
						    indexShift,
						    moreTab,
						    tab = params.$source;
						if (tab !== this.currentTab) {
								indexShift = this.tabList.children.length - 1;
								currentIndex = _array['default'].indexOf(this.tabList.children, this.currentTab);
								if (currentIndex === -1) {
										currentIndex = _array['default'].indexOf(this.moreTabList.children, this.currentTab) + indexShift;
								}
								tabIndex = _array['default'].indexOf(this.tabList.children, tab);
								if (tabIndex === -1) {
										tabIndex = _array['default'].indexOf(this.moreTabList.children, tab) + indexShift;
								}
								if (currentIndex > -1 && tabIndex > -1) {
										this.tabMapping[currentIndex].style.display = 'none';
										this.tabMapping[tabIndex].style.display = 'block';
										moreTab = (0, _query['default'])('.more-item', this.id)[0];
										if (_array['default'].indexOf(this.tabList.children, tab) > -1) {
												this.positionFocusState(tab);
												this.currentTab.className = 'tab';
												tab.className = 'tab selected';
												this.currentTab = tab;
												if (moreTab) {
														moreTab.className = 'tab more-item';
												}
										} else {
												if (moreTab) {
														this.positionFocusState(moreTab);
														moreTab.className = 'tab more-item selected';
														this.currentTab.className = 'tab';
														tab.className = 'tab selected';
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
						var tab = params.$source,
						    moreTab,
						    posTop,
						    posLeft,
						    width,
						    height,
						    maxHeight;
						if (tab) {
								if (this.moreTabList.style.visibility === 'hidden') {
										this.moreTabList.style.visibility = 'visible';

										if (!this.moreTabList.style.left) {
												moreTab = (0, _query['default'])('.more-item', this.id)[0];
												posTop = moreTab.offsetTop;
												posLeft = moreTab.offsetLeft;
												width = parseInt(moreTab.offsetWidth);
												height = parseInt(moreTab.offsetHeight);
												maxHeight = this.domNode.offsetHeight - this.domNode.offsetTop - posTop;

												this.moreTabList.style.left = posLeft - this.moreTabList.offsetWidth + width + 'px';
												this.moreTabList.style.top = posTop + height + 'px';
												this.moreTabList.style.maxHeight = maxHeight + 'px';
										}
								} else {
										this.moreTabList.style.visibility = 'hidden';
								}
						} else {
								if (params.target !== (0, _query['default'])('.more-item', this.id)[0]) {
										this.moreTabList.style.visibility = 'hidden';
								}
						}
				},
				/**
    * Reorganizes the tab when the screen orientation changes.
    * @private
    */
				reorderTabs: function reorderTabs() {
						var moreTab, arr;

						this.inOverflow = false;
						if (this.moreTabList.children.length > 0) {
								moreTab = (0, _query['default'])('.more-item', this.id)[0];
								if (moreTab) {
										this.tabList.children[this.tabList.children.length - 1].remove();
								}
								// Need to reference a different array when calling array.forEach since this.moreTabList.children is being modified, hence have arr be this.moreTabList.children
								arr = [].slice.call(this.moreTabList.children);
								_array['default'].forEach(arr, function (tab) {
										this.moreTabList.children[_array['default'].indexOf(this.moreTabList.children, tab)].remove();
										_domConstruct['default'].place(tab, this.tabList);
										this.checkTabOverflow(tab);
								}, this);
						} else {
								arr = [].slice.call(this.tabList.children);
								_domConstruct['default'].empty(this.tabList);
								_array['default'].forEach(arr, function (tab) {
										_domConstruct['default'].place(tab, this.tabList);
										this.checkTabOverflow(tab);
								}, this);
						}
						moreTab = (0, _query['default'])('.more-item', this.id)[0];
						if (moreTab && _array['default'].indexOf(this.moreTabList.children, this.currentTab) > -1) {
								this.positionFocusState(moreTab);
								moreTab.className = 'tab more-item selected';
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
						var posTop = target.offsetTop,
						    posLeft = target.offsetLeft,
						    width = parseInt(target.offsetWidth),
						    height = parseInt(target.offsetHeight),
						    tableTop = this.tabList.offsetTop,
						    tableLeft = this.tabList.offsetLeft,
						    focusState = (0, _query['default'])(".animated-bar", this.id);

						if (focusState.length) {
								focusState = focusState[0];
								focusState.style.left = posLeft - tableLeft + 'px';
								focusState.style.top = posTop - tableTop + 'px';
								focusState.style.right = posTop - tableTop + width + 'px';
								focusState.style.bottom = posTop - tableTop + height + 'px';
								focusState.style.width = width + 'px';
						}
				},
				/**
    * Checks the tab to see if it causes an overflow when placed in the tabList, if so then push it a new list element called More.
    * @param {Object} The tab object.
    * @private
    */
				checkTabOverflow: function checkTabOverflow(tab) {
						var moreTab, replacedTab;
						if (tab.offsetTop > this.tabList.offsetTop) {
								if (!this.inOverflow) {
										moreTab = _domConstruct['default'].toDom(this.moreTabItemTemplate.apply({ title: this.moreText + '...' }, this));
										moreTab.style.float = 'right';
										_domConstruct['default'].place(moreTab, this.tabList);

										this.tabMoreIndex = _array['default'].indexOf(this.tabList.children, tab);
										this.tabList.children[this.tabMoreIndex].remove();
										if (this.tabList.children.length === 1 && !this.moreTabList.children.length) {
												moreTab.className = 'tab more-item selected';
												this.currentTab = tab;
												tab.className = 'tab selected';
										}

										if (moreTab.offsetTop > this.tabList.offsetTop) {
												this.tabMoreIndex = this.tabMoreIndex - 1;
												replacedTab = this.tabList.children[this.tabMoreIndex];
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
