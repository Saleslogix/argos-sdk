/* Copyright (c) 2010, Sage Software, Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @class argos._DetailBase
 * A Detail View represents a single record and should display all the info the user may need about the entry.
 *
 * A Detail entry is identified by its key (idProperty) which is how it requests the data via the endpoint.
 *
 * @alternateClassName _DetailBase
 * @extends argos.View
 * @requires argos.Format
 * @requires argos.Utility
 * @requires argos.ErrorManager
 */
define('argos/_DetailBase', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/array',
    'dojo/_base/Deferred',
    'dojo/_base/connect',
    'dojo/query',
    'dojo/string',
    'dojo/dom',
    'dojo/dom-class',
    'dojo/dom-construct',
    './Format',
    './Utility',
    './ErrorManager',
    './View'
], function(
    declare,
    lang,
    array,
    Deferred,
    connect,
    query,
    string,
    dom,
    domClass,
    domConstruct,
    format,
    utility,
    ErrorManager,
    View
) {

    var __class = declare('argos._DetailBase', [View], {
        /**
         * @property {Object}
         * Creates a setter map to html nodes, namely:
         *
         * * detailContent => contentNode's innerHTML
         *
         */
        attributeMap: {
            detailContent: { node: 'contentNode', type: 'innerHTML' }
        },
        /**
         * @property {Simplate}
         * The template used to render the view's main DOM element when the view is initialized.
         * This template includes loadingTemplate.
         *
         * The default template uses the following properties:
         *
         *      name                description
         *      ----------------------------------------------------------------
         *      id                   main container div id
         *      title                main container div title attr
         *      cls                  additional class string added to the main container div
         *      resourceKind         set to data-resource-kind
         *
         */
        widgetTemplate: new Simplate([
            '<div id="{%= $.id %}" title="{%= $.titleText %}" class="detail panel {%= $.cls %}" data-dojo-attach-event="onclick:toggleDropDown" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>',
            '{%! $.loadingTemplate %}',
            '{%! $.quickActionTemplate %}',
            '{%! $.tabContentTemplate %}',
            '{%! $.moreTabListTemplate %}',
            '</div>'
        ]),
        /**
         * @property {Simplate}
         * HTML shown when no data is available.
         */
        emptyTemplate: new Simplate([
        ]),
        /**
         * @property {Simplate}
         * HTML shown when data is being loaded.
         *
         * `$` => the view instance
         */
        loadingTemplate: new Simplate([
            '<div class="panel-loading-indicator">',
            '<div class="row"><span class="fa fa-spinner fa-spin"></span><div>{%: $.loadingText %}</div></div>',
            '</div>'
        ]),
        /**
         * @property {Simplate}
         * HTML that creates the quick action list
         */
        quickActionTemplate: new Simplate([
            '<div class="quick-actions" data-dojo-attach-point="quickActions"></div>'
        ]),
        /**
         * @property {Simplate}
         * HTML that starts a new tab list
         */
        tabContentTemplate: new Simplate([
            '<div class="panel-content" data-dojo-attach-point="contentNode">',
                '{%! $.tabListTemplate %}',
            '</div>'
        ]),
        /**
         * @property {Simplate}
         * HTML that starts a new tab list
         */
        tabListTemplate: new Simplate([
            '<ul class="tab-list" data-dojo-attach-point="tabList"></ul>'
        ]),
        /**
         * @property {Simplate}
         * HTML that starts a new More tab list
         */
        moreTabListTemplate: new Simplate([
            '<ul class="more-tab-dropdown" data-dojo-attach-point="moreTabList"></ul>'
        ]),
        tabListAnimTemplate: new Simplate([
            '<div class="tab-focus-indicator"></div>',
            '<div class="animated-bar"></div>'
        ]),
        /**
         * @property {Simplate}
         * HTML that creates a new tab to be placed in the tab list
         * 
         * `$` => the view instance
         */
        tabListItemTemplate: new Simplate([
            '<li class="tab" data-action="changeTab">',
                '{%: ($.title || $.options.title) %}',
            '</li>'
        ]),
        /**
         * @property {Simplate}
         * HTML that creates a new tab to be placed in the more tab list
         * 
         * `$` => the view instance
         */
        moreTabItemTemplate: new Simplate([
            '<li class="tab more-item" data-action="toggleDropDown">',
            '{%: ($.title || $.options.title) %}',
            '<span class="fa fa-angle-down"></span>',
            '</li>'
        ]),
        /**
         * @property {Simplate}
         * HTML that creates the detail header displaying information about the tab list
         * 
         * `$` => the view instance
         */
        detailHeaderTemplate: new Simplate([
            '<div class="detail-header">',
                '{%: $.value %}',
            '</div>'
        ]),
        /**
         * @property {Simplate}
         * HTML that starts a new section
         *
         * `$` => the view instance
         */
        sectionBeginTemplate: new Simplate([
            //'<h2 data-action="toggleSection" class="{% if ($.collapsed || $.options.collapsed) { %}collapsed{% } %}">',
            //'<button class="{% if ($.collapsed) { %}{%: $$.toggleExpandClass %}{% } else { %}{%: $$.toggleCollapseClass %}{% } %}" aria-label="{%: $$.toggleCollapseText %}"></button>',
            //'{%: ($.title || $.options.title) %}',
            //'</h2>',
            '{% if ($.list || $.options.list) { %}',
                '{% if ($.cls || $.options.cls) { %}',
                    '<ul class="{%= ($.cls || $.options.cls) %}">',
                '{% } else { %}',
                    '<ul class="detailContent list">',
                '{% } %}',
            '{% } else { %}',
                '{% if ($.cls || $.options.cls) { %}',
                    '<div class="{%= ($.cls || $.options.cls) %}">',
                '{% } else { %}',
                    '<div class="detailContent">',
                '{% } %}',
            '{% } %}'
        ]),
        /**
         * @property {Simplate}
         * HTML that ends a section
         *
         * `$` => the view instance
         */
        sectionEndTemplate: new Simplate([
            '{% if ($.list || $.options.list) { %}',
            '</ul>',
            '{% } else { %}',
            '</div>',
            '{% } %}'
        ]),
        /**
         * @property {Simplate}
         * HTML that is used for a property in the detail layout
         *
         * * `$` => detail layout row
         * * `$$` => view instance
         */
        propertyTemplate: new Simplate([
            '<div class="row{% if(!$.value) { %} no-value{% } %} {%= $.cls %}" data-property="{%= $.property || $.name %}">',
            '<label>{%: $.label %}</label>',
            '<span>{%= $.value %}</span>', // todo: create a way to allow the value to not be surrounded with a span tag
            '</div>'
        ]),
        /**
         * @property {Simplate}
         * HTML that is used for detail layout items that point to related views, includes a label and links the value text
         *
         * * `$` => detail layout row
         * * `$$` => view instance
         */
        relatedPropertyTemplate: new Simplate([
            '<div class="row{% if(!$.value) { %} no-value{% } %} {%= $.cls %}">',
            '<label>{%: $.label %}</label>',
            '<span>',
            '<a data-action="activateRelatedEntry" data-view="{%= $.view %}" data-context="{%: $.context %}" data-descriptor="{%: $.descriptor || $.value %}">',
            '{%= $.value %}',
            '</a>',
            '</span>',
            '</div>'
        ]),
        /**
         * @property {Simplate}
         * HTML that is used for detail layout items that point to related views, displayed as an icon and text
         *
         * * `$` => detail layout row
         * * `$$` => view instance
         */
        relatedTemplate: new Simplate([
            '<li class="{%= $.cls %}">',
                '<a data-action="activateRelatedList" data-view="{%= $.view %}" data-context="{%: $.context %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">',
                    '{% if ($.icon) { %}',
                        '<img src="{%= $.icon %}" alt="icon" class="icon" />',
                    '{% } else if ($.iconClass) { %}',
                        '<div class="{%= $.iconClass %}" alt="icon"></div>',
                    '{% } %}',
                    '<span class="related-item-label">{%: $.label %}</span>',
                '</a>',
            '</li>'
        ]),
        /**
         * @property {Simplate}
         * HTML that is used for detail layout items that fire an action, displayed with label and property value
         *
         * * `$` => detail layout row
         * * `$$` => view instance
         */
        actionPropertyTemplate: new Simplate([
            '<div class="row {%= $.cls %}">',
            '<label>{%: $.label %}</label>',
            '<span>',
            '<a data-action="{%= $.action %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">',
            '{%= $.value %}',
            '</a>',
            '</span>',
            '</div>'
        ]),
        /**
         * @property {Simplate}
         * HTML that is used for detail layout items that fire an action, displayed as an icon and text
         *
         * * `$` => detail layout row
         * * `$$` => view instance
         */
        actionTemplate: new Simplate([
            '<li class="{%= $.cls %}{% if ($.disabled) { %} disabled{% } %}">',
            '<a data-action="{%= $.action %}" {% if ($.disabled) { %}data-disable-action="true"{% } %} class="{% if ($.disabled) { %}disabled{% } %}">',
            '{% if ($.icon) { %}',
                '<img src="{%= $.icon %}" alt="icon" class="icon" />',
            '{% } else if ($.iconClass) { %}',
                '<div class="{%= $.iconClass %}" alt="icon"></div>',
            '{% } %}',
            '<label>{%: $.label %}</label>',
            '<span>{%= $.value %}</span>',
            '</a>',
            '</li>'
        ]),
        /**
         * @property {Simplate}
         * HTML that is shown when not available
         *
         * `$` => the view instance
         */
        notAvailableTemplate: new Simplate([
            '<div class="not-available">{%: $.notAvailableText %}</div>'
        ]),
        /**
         * @property {String}
         * The unique identifier of the view
         */
        id: 'generic_detail',
        /**
         * @property {Object}
         * The dojo store this view will use for data exchange.
         */
        store: null,
        /**
         * @property {Object}
         * The data entry
         */
        entry: null,
        /**
         * @property {Object}
         * The layout definition that constructs the detail view with sections and rows
         */
        layout: null,
        /**
         * @cfg {String/Object}
         * May be used for verifying the view is accessible
         */
        security: false,
        /**
         * @property {String}
         * The customization identifier for this class. When a customization is registered it is passed
         * a path/identifier which is then matched to this property.
         */
        customizationSet: 'detail',
        /**
         * @property {Boolean}
         * Controls if the view should be exposed
         */
        expose: false,
        /**
         * @deprecated
         */
        editText: 'Edit',
        /**
         * @cfg {String}
         * Font awesome icon to be used by the more list item
         */
        icon: 'fa fa-chevron',
        /**
         * @cfg {String}
         * Information text that is concatenated with the entity type
         */
        informationText: 'Information',
        /**
         * @cfg {String}
         * More text that is used as the overflow tab for the tab list
         */
        moreText: 'More',
        /**
         * @cfg {String}
         * Default title text shown in the top toolbar
         */
        titleText: 'Detail',
        /**
         * @property {String}
         * Helper string for a basic section header text
         */
        detailsText: 'Details',
        /**
         * @property {String}
         * Text shown while loading and used in loadingTemplate
         */
        loadingText: 'loading...',
        /**
         * @property {String}
         * Text used in the notAvailableTemplate
         */
        notAvailableText: 'The requested data is not available.',
        /**
         * @property {String}
         * ARIA label text for a collapsible section header
         */
        toggleCollapseText: 'toggle collapse',
        /**
         * @property {String}
         * CSS class for the collapse button when in a expanded state
         */
        toggleCollapseClass: 'fa fa-chevron-down',
        /**
         * @property {String}
         * CSS class for the collapse button when in a collapsed state
         */
        toggleExpandClass: 'fa fa-chevron-right',
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
         * @property {Object}
         * dojo connect object associated to the setOrientation event
         */
        _orientation: null,
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
         * @cfg {String}
         * The view id to be taken to when the Edit button is pressed in the toolbar
         */
        editView: false,
        /**
         * @property {Object[]}
         * Store for mapping layout options to an index on the HTML node
         */
        _navigationOptions: null,

        // Store properties
        itemsProperty: '',
        idProperty: '',
        labelProperty: '',
        entityProperty: '',
        versionProperty: '',

        /**
         * Extends the dijit widget postCreate to subscribe to the global `/app/refresh` event and clear the view.
         */
        postCreate: function() {
            this.inherited(arguments);
            this.subscribe('/app/refresh', this._onRefresh);
            this.clear();
            this.tabMapping = [];
        },
        createErrorHandlers: function() {
            this.errorHandlers = this.errorHandlers || [{
                name: 'Aborted',
                test: function(error) {
                    return error.aborted;
                },
                handle: function(error, next) {
                    this.options = false; // force a refresh
                    next();
                }
            }, {
                name: 'AlertError',
                test: function(error) {
                    return error.status !== this.HTTP_STATUS.NOT_FOUND && !error.aborted;
                },
                handle: function(error, next) {
                    alert(this.getErrorMessage(error));
                    next();
                }
            }, {
                name: 'NotFound',
                test: function(error) {
                    return error.status === this.HTTP_STATUS.NOT_FOUND;
                },
                handle: function(error, next) {
                    domConstruct.place(this.notAvailableTemplate.apply(this), this.contentNode, 'only');
                    next();
                }
            }, {
                name: 'CatchAll',
                test: function(error) {
                    return true;
                },
                handle: function(error, next) {
                    var errorItem = {
                        viewOptions: this.options,
                        serverError: error
                    };

                    ErrorManager.addError(this.getErrorMessage(error), errorItem);
                    domClass.remove(this.domNode, 'panel-loading');
                    next();
                }
            }
            ];

            return this.errorHandlers;
        },
        /**
         * Sets and returns the toolbar item layout definition, this method should be overriden in the view
         * so that you may define the views toolbar items.
         * @return {Object} this.tools
         * @template
         */
        createToolLayout: function() {
            return this.tools || (this.tools = {
                'tbar': [{
                    id: 'edit',
                    cls: 'fa fa-pencil fa-fw fa-lg',
                    action: 'navigateToEditView',
                    security: App.getViewSecurity(this.editView, 'update')
                }, {
                    id: 'refresh',
                    cls: 'fa fa-refresh fa-fw fa-lg',
                    action: '_refreshClicked'
                }]
            });
        },
        _refreshClicked: function() {
            this.clear();
            this.refreshRequired = true;
            this.refresh();

            this.onRefreshClicked();
        },
        /**
         * Called when the user clicks the refresh toolbar button.
         */
        onRefreshClicked: function() {
        },
        /**
         * Extends the {@link _ActionMixin#invokeAction mixins invokeAction} to stop if `data-disableAction` is true
         * @param name
         * @param {Object} parameters Collection of `data-` attributes from the node
         * @param {Event} evt
         * @param {HTMLElement} el
         */
        invokeAction: function(name, parameters, evt, el) {
            if (parameters && /true/i.test(parameters['disableAction'])) {
                return;
            }
            return this.inherited(arguments);
        },
        /**
         * Toggles the collapsed state of the section.
         * @param {Object} The event type and source.
         * @private
         */
        toggleSection: function(params) {
            var node = dom.byId(params.$source), button = null;
            if (node) {
                domClass.toggle(node, 'collapsed');
                button = query('button', node)[0];
                if (button) {
                    domClass.toggle(button, this.toggleCollapseClass);
                    domClass.toggle(button, this.toggleExpandClass);
                }
            }
        },
        /**
         * Changes the tab state in the tab list and changes visibility of content.
         * @param {Object} The event type and source.
         * @private
         */
        changeTab: function(params) {
            var currentIndex,
                tabIndex,
                indexShift,
                moreTab,
                tab = params.$source;
            if (tab !== this.currentTab) {
                indexShift = this.tabList.children.length - 1;
                currentIndex = array.indexOf(this.tabList.children, this.currentTab);
                if (currentIndex === -1) {
                    currentIndex = array.indexOf(this.moreTabList.children, this.currentTab) + indexShift;
                }
                tabIndex = array.indexOf(this.tabList.children, tab);
                if (tabIndex === -1) {
                    tabIndex = array.indexOf(this.moreTabList.children, tab) + indexShift;
                }
                if (currentIndex > -1 && tabIndex > -1) {
                    this.tabMapping[currentIndex].style.display = 'none';
                    this.tabMapping[tabIndex].style.display = 'block';
                    moreTab = query('.more-item', this.id)[0];
                    if (array.indexOf(this.tabList.children, tab) > -1) {
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
        toggleDropDown: function(params) {
            var tab = params.$source,
                moreTab,
                posTop,
                posLeft,
                width,
                height;
            if (tab) {
                if (this.moreTabList.style.visibility === 'hidden') {
                    this.moreTabList.style.visibility = 'visible';

                    if (this.moreTabList.style.left === '') {
                        moreTab = query('.more-item', this.id)[0];
                        posTop = moreTab.offsetTop;
                        posLeft = moreTab.offsetLeft;
                        width = parseInt(moreTab.offsetWidth);
                        height = parseInt(moreTab.offsetHeight);

                        this.moreTabList.style.left = posLeft - this.moreTabList.offsetWidth + width + 'px';
                        this.moreTabList.style.top = posTop + height + 'px';
                    }
                }
                else {
                    this.moreTabList.style.visibility = 'hidden';
                }
            }
            else {
                if (params.target !== query('.more-item', this.id)[0]) {
                    this.moreTabList.style.visibility = 'hidden';
                }
            }
        },
        /**
         * Reorganizes the tab when the screen orientation changes.
         * @private
         */
        reorderTabs: function() {
            var tab,
                startMoreTab,
                moreTab,
                arr;
            this.inOverflow = false;
            if (this.moreTabList.children.length > 0) {
                moreTab = query('.more-item', this.id)[0];
                if (moreTab) {
                    this.tabList.children[this.tabList.children.length - 1].remove();
                }
                // Need to reference a different array when calling array.forEach since this.moreTabList.children is being modified, hence have arr be this.moreTabList.children
                arr = [].slice.call(this.moreTabList.children);
                array.forEach(arr, function(tab) {
                    this.moreTabList.children[array.indexOf(this.moreTabList.children, tab)].remove();
                    domConstruct.place(tab, this.tabList);
                    this.checkTabOverflow(tab);
                }, this);
            } else {
                arr = [].slice.call(this.tabList.children);
                array.forEach(arr, function(tab) {
                    if (tab.offsetTop > this.tabList.offsetTop) {
                        if (!startMoreTab) {
                            startMoreTab = tab;
                        } else {
                            this.tabList.children[array.indexOf(this.tabList.children, tab)].remove();
                            domConstruct.place(tab, this.moreTabList);
                        }
                    }
                }, this);
                this.checkTabOverflow(startMoreTab);
            }
            moreTab = query('.more-item', this.id)[0];
            if (moreTab && array.indexOf(this.moreTabList.children, this.currentTab) > -1) {
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
        positionFocusState: function(target) {
            var posTop = target.offsetTop,
                posLeft = target.offsetLeft,
                width = parseInt(target.offsetWidth),
                height = parseInt(target.offsetHeight),
                tableTop = this.tabList.offsetTop,
                tableLeft = this.tabList.offsetLeft,
                focusState = query(".animated-bar", this.id);

            if (focusState.length > 0) {
                focusState = focusState[0];
                focusState.style.left = posLeft - tableLeft + 'px';
                focusState.style.top = posTop - tableTop + 'px';
                focusState.style.right = (posTop - tableTop) + width + 'px';
                focusState.style.bottom = (posTop - tableTop) + height + 'px';
                focusState.style.width = width + 'px';
            }
        },
        /**
         * Handler for the getting the detail resource type from the id and placing the header into the detail view..
         * @private
         */
        placeDetailHeader: function() {
            var value = this.resourceKind;
            if (value.charAt(value.length - 1) === 's') {
                value = value.slice(0, value.length - 1);
            }
            value = value.charAt(0).toUpperCase() + value.slice(1) + " " + this.informationText;
            domConstruct.place(this.detailHeaderTemplate.apply({ value: value }, this), this.tabList, 'before');
        },
        /**
         * Checks the tab to see if it causes an overflow when placed in the tabList, if so then push it a new list element called More.
         * @param {Object} The tab object.
         * @private
         */
        checkTabOverflow: function(tab) {
            var moreTab, replacedTab;
            if (tab.offsetTop > this.tabList.offsetTop) {
                if (!this.inOverflow) {
                    moreTab = domConstruct.toDom(this.moreTabItemTemplate.apply({ title: this.moreText + '...' }, this));
                    moreTab.style.float = 'right';
                    domConstruct.place(moreTab, this.tabList);

                    this.tabMoreIndex = array.indexOf(this.tabList.children, moreTab) - 1;
                    this.tabList.children[this.tabMoreIndex].remove();
                    if (this.tabList.children.length === 1 && this.moreTabList.children.length === 0) {
                        moreTab.className = 'tab more-item selected';
                        this.currentTab = tab;
                        tab.className = 'tab selected';
                    }

                    if (moreTab.offsetTop > this.tabList.offsetTop) {
                        this.tabMoreIndex = this.tabMoreIndex - 1;
                        replacedTab = this.tabList.children[this.tabMoreIndex];
                        this.tabList.children[this.tabMoreIndex].remove();
                        domConstruct.place(replacedTab, this.moreTabList);
                    }

                    domConstruct.place(tab, this.moreTabList);
                    this.inOverflow = true;
                    this.tabMoreIndex++;
                } else {
                    this.tabList.children[this.tabMoreIndex].remove();
                    domConstruct.place(tab, this.moreTabList);
                }
            }
        },
        /**
         * Handler for the global `/app/refresh` event. Sets `refreshRequired` to true if the key matches.
         * @param {Object} options The object published by the event.
         * @private
         */
        _onRefresh: function(o) {
            var descriptor = o.data && o.data[this.labelProperty];

            if (this.options && this.options.key === o.key) {
                this.refreshRequired = true;

                if (descriptor) {
                    this.options.title = descriptor;
                    this.set('title', descriptor);
                }
            }
        },
        /**
         * Handler for the related entry action, navigates to the defined `data-view` passing the `data-context`.
         * @param {Object} params Collection of `data-` attributes from the source node.
         */
        activateRelatedEntry: function(params) {
            if (params.context) {
                this.navigateToRelatedView(params.view, parseInt(params.context, 10), params.descriptor);
            }
        },
        /**
         * Handler for the related list action, navigates to the defined `data-view` passing the `data-context`.
         * @param {Object} params Collection of `data-` attributes from the source node.
         */
        activateRelatedList: function(params) {
            if (params.context) {
                this.navigateToRelatedView(params.view, parseInt(params.context, 10), params.descriptor);
            }
        },
        /**
         * Navigates to the defined `this.editView` passing the current `this.entry` as default data.
         * @param {HTMLElement} el
         */
        navigateToEditView: function(el) {
            var view, entry;
            view = App.getView(this.editView);
            if (view) {
                entry = this.entry;
                view.show({ entry: entry, fromContext:this });
            }
        },
        /**
         * Navigates to a given view id passing the options retrieved using the slot index to `this._navigationOptions`.
         * @param {String} id View id to go to
         * @param {Number} slot Index of the context to use in `this._navigationOptions`.
         * @param {String} descriptor Optional descriptor option that is mixed in.
         */
        navigateToRelatedView: function(id, slot, descriptor) {
            var options = this._navigationOptions[slot],
                view = App.getView(id);

            if (descriptor && options) {
                options['descriptor'] = descriptor;
            }

            if (this.entry) {
                options.selectedEntry = this.entry;
            }
            options.fromContext = this;
            if (view && options) {
                view.show(options);
            }
        },
        /**
         * Sets and returns the Detail view layout by following a standard for section and rows:
         *
         * The `this.layout` itself is an array of section objects where a section object is defined as such:
         *
         *     {
         *        name: 'String', // Required. unique name for identification/customization purposes
         *        title: 'String', // Required. Text shown in the section header
         *        list: boolean, // Optional. Default false. Controls if the group container for child rows should be a div (false) or ul (true)
         *        children: [], // Array of child row objects
         *     }
         *
         * A child row object has:
         *
         *     {
         *        name: 'String', // Required. unique name for identification/customization purposes
         *        property: 'String', // Optional. The property of the current entity to bind to
         *        label: 'String', // Optional. Text shown in the label to the left of the property
         *        onCreate: function(), // Optional. You may pass a function to be called when the row is added to the DOM
         *        include: boolean, // Optional. If false the row will not be included in the layout
         *        exclude: boolean, // Optional. If true the row will not be included in the layout
         *        template: Simplate, // Optional. Override the HTML Simplate used for rendering the value (not the row) where `$` is the row object
         *        tpl: Simplate, // Optional. Same as template.
         *        renderer: function(), // Optional. Pass a function that receives the current value and returns a value to be rendered
         *        encode: boolean, // Optional. If true it will encode HTML entities
         *        cls: 'String', // Optional. Additional CSS class string to be added to the row div
         *        use: Simplate, // Optional. Override the HTML Simplate used for rendering the row (not value)
         *        provider: function(entry, propertyName), // Optional. Function that accepts the data entry and the property name and returns the extracted value. By default simply extracts directly.
         *        value: Any // Optional. Provide a value directly instead of binding
         *     }
         *
         * @return {Object[]} Detail layout definition
         */
        createLayout: function() {
            return this.layout || [];
        },
        /**
         * Processes the given layout definition using the data entry response by rendering and inserting the HTML nodes and
         * firing any onCreate events defined.
         * @param {Object[]} layout Layout definition
         * @param {Object} entry data response
         */
        processLayout: function(layout, entry) {
            var rows = (layout['children'] || layout['as'] || layout),
                options = layout['options'] || (layout['options'] = {
                    title: this.detailsText
                }),
                sectionQueue = [],
                sectionStarted = false,
                callbacks = [],
                current,
                i,
                section,
                tab,
                sectionNode,
                include,
                exclude,
                provider,
                property,
                value,
                rendered,
                formatted,
                data,
                hasAccess,
                context,
                useListTemplate,
                template,
                rowNode,
                rowHtml,
                item;

            if (!this.tabList.parentNode) {
                domConstruct.place(this.tabList, this.contentNode);
                domConstruct.place(this.tabListAnimTemplate.apply(), this.contentNode);
            }

            for (i = 0; i < rows.length; i++) {
                current = rows[i];
                include = this.expandExpression(current['include'], entry);
                exclude = this.expandExpression(current['exclude'], entry);

                if (include !== undefined && !include) {
                    continue;
                }

                if (exclude !== undefined && exclude) {
                    continue;
                }

                if (current['children'] || current['as']) {
                    if (sectionStarted) {
                        sectionQueue.push(current);
                    } else {
                        this.processLayout(current, entry);
                    }

                    continue;
                }

                if (!sectionStarted) {
                    sectionStarted = true;
                    if (layout.name === 'QuickActionsSection') {
                        section = domConstruct.toDom(this.sectionBeginTemplate.apply(layout, this) + this.sectionEndTemplate.apply(layout, this));
                        sectionNode = section;
                        domConstruct.place(section, this.quickActions);
                        //if (this.tabList) {
                        //    domConstruct.place(section, this.tabList, 'before');
                        //} else {
                        //    domConstruct.place(section, this.contentNode);
                        //}
                    } else {
                        tab = domConstruct.toDom(this.tabListItemTemplate.apply(layout, this));
                        section = domConstruct.toDom(this.sectionBeginTemplate.apply(layout, this) + this.sectionEndTemplate.apply(layout, this));
                        sectionNode = section;
                        if (this.tabList.children.length === 0) {
                            // No children, so set the current tab to this tab and set the section to have a display of block
                            this.currentTab = tab;
                        } else {
                            section.style.display = 'none';
                        }
                        this.tabMapping.push(section);
                        domConstruct.place(tab, this.tabList);
                        this.checkTabOverflow(tab);
                        domConstruct.place(section, this.contentNode);
                    }
                }

                provider = current['provider'] || utility.getValue;
                property = typeof current['property'] === 'string'
                    ? current['property']
                    : current['name'];
                value = typeof current['value'] === 'undefined'
                    ? provider(entry, property, entry)
                    : current['value'];

                if (current['template'] || current['tpl']) {
                    rendered = (current['template'] || current['tpl']).apply(value, this);
                    formatted = current['encode'] === true
                        ? format.encode(rendered)
                        : rendered;
                }
                else if (current['renderer'] && typeof current['renderer'] === 'function') {
                    rendered = current['renderer'].call(this, value);
                    formatted = current['encode'] === true
                        ? format.encode(rendered)
                        : rendered;
                } else {
                    formatted = current['encode'] !== false
                        ? format.encode(value)
                        : value;
                }

                data = lang.mixin({}, {
                    entry: entry,
                    value: formatted,
                    raw: value
                }, current);

                if (current['descriptor']) {
                    data['descriptor'] = typeof current['descriptor'] === 'function'
                        ? this.expandExpression(current['descriptor'], entry, value)
                        : provider(entry, current['descriptor']);
                }

                if (current['action']) {
                    data['action'] = this.expandExpression(current['action'], entry, value);
                }

                hasAccess = App.hasAccessTo(current['security']);

                if (current['security']) {
                    data['disabled'] = !hasAccess;
                }

                if (current['disabled'] && hasAccess) {
                    data['disabled'] = this.expandExpression(current['disabled'], entry, value);
                }

                if (current['view']) {
                    context = lang.mixin({}, current['options']);

                    if (current['key']) {
                        context['key'] = typeof current['key'] === 'function'
                            ? this.expandExpression(current['key'], entry)
                            : provider(entry, current['key']);
                    }
                    if (current['where']) {
                        context['where'] = this.expandExpression(current['where'], entry);
                    }
                    if (current['resourceKind']) {
                        context['resourceKind'] = this.expandExpression(current['resourceKind'], entry);
                    }
                    if (current['resourceProperty']) {
                        context['resourceProperty'] = this.expandExpression(current['resourceProperty'], entry);
                    }
                    if (current['resourcePredicate']) {
                        context['resourcePredicate'] = this.expandExpression(current['resourcePredicate'], entry);
                    }
                    if (current['dataSet']) {
                        context['dataSet'] = this.expandExpression(current['dataSet'], entry);
                    }
                    if (current['title']) {
                        context['title'] = current['title'];
                    }

                    if (current['resetSearch']) {
                        context['resetSearch'] = current['resetSearch'];
                    } else {
                        context['resetSearch'] = true;
                    }

                    data['view'] = current['view'];
                    data['context'] = (this._navigationOptions.push(context) - 1);
                }

                useListTemplate = (layout['list'] || options['list']);

                // priority: use > (relatedPropertyTemplate | relatedTemplate) > (actionPropertyTemplate | actionTemplate) > propertyTemplate
                if (current['use']) {
                    template = current['use'];
                } else if (current['view'] && useListTemplate) {
                    template = this.relatedTemplate;
                    current['relatedItem'] = true;
                } else if (current['view']) {
                    template = this.relatedPropertyTemplate;
                } else if (current['action'] && useListTemplate) {
                    template = this.actionTemplate;
                } else if (current['action']) {
                    template = this.actionPropertyTemplate;
                } else {
                    template = this.propertyTemplate;
                }

                rowNode = this.createRowNode(current, sectionNode, entry, template, data);

                if (current['relatedItem']) {
                    try {
                        this._processRelatedItem(data, context, rowNode);
                    } catch (e) {
                        //error processing related node
                        console.error(e);
                    }
                }

                if (current['onCreate']) {
                    callbacks.push({ row: current, node: rowNode, value: value, entry: entry });
                }
            }

            for (i = 0; i < callbacks.length; i++) {
                item = callbacks[i];
                item.row['onCreate'].apply(this, [item.row, item.node, item.value, item.entry]);
            }

            for (i = 0; i < sectionQueue.length; i++) {
                current = sectionQueue[i];

                this.processLayout(current, entry);
            }
        },
        createRowNode: function(layout, sectionNode, entry, template, data) {
            return domConstruct.place(template.apply(data, this), sectionNode);
        },
        _getStoreAttr: function() {
            return this.store || (this.store = this.createStore());
        },
        /**
         * CreateStore is the core of the data handling for Detail Views. By default it is empty but it should return
         * a dojo store of your choosing. There are {@link _SDataDetailMixin Mixins} available for SData.
         * @return {*}
         */
        createStore: function() {
            return null;
        },
        /**
         * Required for binding to ScrollContainer which utilizes iScroll that requires to be refreshed when the
         * content (therefor scrollable area) changes.
         */
        onContentChange: function() {
        },
        /**
         * @template
         * Optional processing of the returned entry before it gets processed into layout.
         * @param {Object} entry Entry from data store
         * @return {Object} By default does not do any processing
         */
        preProcessEntry: function(entry) {
            return entry;
        },
        /**
         * Takes the entry from the data store, applies customization, applies any custom item process and then
         * passes it to process layout.
         * @param {Object} entry Entry from data store
         */
        processEntry: function(entry) {
            var moreTab;
            this.entry = this.preProcessEntry(entry);

            if (this.entry) {
                this.processLayout(this._createCustomizedLayout(this.createLayout()), this.entry);

                if (this.currentTab) {
                    if (this.tabList.children.length === 1 && this.moreTabList.children.length > 0) {
                        moreTab = query('.more-item', this.id);
                        if (moreTab.children.length > 0) {
                            this.positionFocusState(moreTab[0]);
                            moreTab.className = 'tab more-item selected';
                        }
                    } else {
                        this.positionFocusState(this.currentTab);
                        this.currentTab.className = 'tab selected';
                    }
                }
                this.placeDetailHeader(this.entry);
            } else {
                this.set('detailContent', '');
            }
        },
        _onGetComplete: function(entry) {
            try {
                if (entry) {
                    this.processEntry(entry);
                } else {
                    domConstruct.place(this.notAvailableTemplate.apply(this), this.contentNode, 'only');
                }

                domClass.remove(this.domNode, 'panel-loading');

                /* this must take place when the content is visible */
                this.onContentChange();
            } catch (e) {
                console.error(e);
            }
        },
        _onGetError: function(getOptions, error) {
            this.handleError(error);
        },
        /**
         * Initiates the request.
         */
        requestData: function() {
            var request, store, getExpression, getResults, getOptions;

            domClass.add(this.domNode, 'panel-loading');

            store = this.get('store');
            if (store) {
                getOptions = {};

                this._applyStateToGetOptions(getOptions);

                getExpression = this._buildGetExpression() || null;
                getResults = store.get(getExpression, getOptions);

                Deferred.when(getResults,
                    this._onGetComplete.bind(this),
                    this._onGetError.bind(this, getOptions)
                );

                return getResults;
            }

            console.warn('Error requesting data, no store was defined. Did you mean to mixin _SDataDetailMixin to your detail view?');
        },
        _buildGetExpression: function() {
            var options = this.options;

            return options && (options.id || options.key);
        },
        _applyStateToGetOptions: function(getOptions) {
        },
        /**
         * Determines if the view should be refresh by inspecting and comparing the passed navigation option key with current key.
         * @param {Object} options Passed navigation options.
         * @return {Boolean} True if the view should be refreshed, false if not.
         */
        refreshRequiredFor: function(options) {
            if (this.options) {
                if (options) {
                    if (this.options.key !== options.key) {
                        return true;
                    }
                }

                return false;
            } else {
                return this.inherited(arguments);
            }
        },
        /**
         * Extends the {@link View#activate parent implementation} to set the nav options title attribute to the descriptor
         * @param tag
         * @param data
         */
        activate: function(tag, data) {
            var options = data && data.options;
            if (options && options.descriptor) {
                options.title = options.title || options.descriptor;
            }

            this.inherited(arguments);
        },
        show: function(options) {
            if (options && options.descriptor) {
                options.title = options.title || options.descriptor;
            }

            this.inherited(arguments);
        },
        /**
         * Returns the view key
         * @return {String} View key
         */
        getTag: function() {
            return this.options && this.options.key;
        },
        /**
         * Extends the {@link View#getContext parent implementation} to also set the resourceKind, key and descriptor
         * @return {Object} View context object
         */
        getContext: function() {
            return lang.mixin(this.inherited(arguments), {
                resourceKind: this.resourceKind,
                key: this.options.key,
                descriptor: this.options.descriptor
            });
        },
        /**
         * Extends the {@link View#beforeTransitionTo parent implementation} to also clear the view if `refreshRequired` is true
         * @return {Object} View context object
         */
        beforeTransitionTo: function() {
            this.inherited(arguments);

            if (this.refreshRequired) {
                this.clear();
            }
        },
        onTransitionTo: function() {
            this.inherited(arguments);

            this.orientation = connect.subscribe('/app/setOrientation', this, this.reorderTabs);
        },
        /**
         * If a security breach is detected it sets the content to the notAvailableTemplate, otherwise it calls
         * {@link #requestData requestData} which starts the process sequence.
         */
        refresh: function() {
            if (this.security && !App.hasAccessTo(this.expandExpression(this.security))) {
                domConstruct.place(this.notAvailableTemplate.apply(this), this.contentNode, 'last');
                return;
            }

            this.requestData();
        },
        /**
         * Clears the view by replacing the content with the empty template and emptying the stored row contexts.
         */
        clear: function() {
            this.set('detailContent', this.emptyTemplate.apply(this));
            if (this.tabList) {
                domConstruct.empty(this.tabList);
                if (this.moreTabList) {
                    domConstruct.empty(this.moreTabList);
                    this.moreTabList.style.left = '';
                    this.moreTabList.style.visibility = 'hidden';
                }
            }
            if (this.quickActions) {
                domConstruct.empty(this.quickActions);
            }
            if (this.tabMapping) {
                this.tabMapping = [];
                this.inOverflow = false;
                this.tabMoreIndex = null;
            }

            this._navigationOptions = [];
        },
        _processRelatedItem: function(data, context, rowNode) {
            var view = App.getView<_ListBase>(data['view']), options:any = {};

            if (view) {
                options.where = context ? context['where'] : '';
                view.getListCount(options).then(function(result) {
                    var labelNode, html;

                    if (result >= 0) {
                        labelNode = query('.related-item-label', rowNode)[0];
                        if (labelNode) {
                            html = '<span class="related-item-count">' + result + '</span>';
                            domConstruct.place(html, labelNode, 'before');
                        } else {
                            console.warn('Missing the "related-item-label" dom node.');
                        }
                    }
                });
            }
        },
        destroy: function() {
            this.inherited(arguments);
        }
    });

    lang.setObject('Sage.Platform.Mobile._DetailBase', __class);
    return __class;
});
