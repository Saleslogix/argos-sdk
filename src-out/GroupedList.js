<<<<<<< HEAD
define('argos/GroupedList', ['exports', 'module', 'dojo/_base/declare', 'dojo/_base/lang', 'dojo/query', 'dojo/string', 'dojo/dom-class', 'dojo/dom-construct', './List', './Utility'], function (exports, module, _dojo_baseDeclare, _dojo_baseLang, _dojoQuery, _dojoString, _dojoDomClass, _dojoDomConstruct, _List, _Utility) {
    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

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
     * @class argos.GroupedList
     * Grouped List provides a hook for grouping rows before rendering them to the page.
     * The grouping adds a container for the set of rows and is collapsible.
     * Note that it constructs the page sequentially meaning the rows should be in the correct
     * order before attempting to group.
     * @extends argos.List
     * @alternateClassName GroupedList
     */

    var _declare = _interopRequireDefault(_dojo_baseDeclare);

    var _lang = _interopRequireDefault(_dojo_baseLang);

    var _query = _interopRequireDefault(_dojoQuery);

    var _string = _interopRequireDefault(_dojoString);

    var _domClass = _interopRequireDefault(_dojoDomClass);

    var _domConstruct = _interopRequireDefault(_dojoDomConstruct);

    var _List2 = _interopRequireDefault(_List);

    var _Utility2 = _interopRequireDefault(_Utility);

    var __class = (0, _declare['default'])('argos.GroupedList', [_List2['default']], {
=======
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
 * @class argos.GroupedList
 * Grouped List provides a hook for grouping rows before rendering them to the page.
 * The grouping adds a container for the set of rows and is collapsible.
 * Note that it constructs the page sequentially meaning the rows should be in the correct
 * order before attempting to group.
 * @extends argos.List
 * @alternateClassName GroupedList
 */
define('argos/GroupedList', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/query',
    'dojo/string',
    'dojo/dom-class',
    'dojo/dom-construct',
    './List',
    './Utility'
], function(
    declare,
    lang,
    query,
    string,
    domClass,
    domConstruct,
    List,
    Utility
) {

    var __class = declare('argos.GroupedList', [List], {
>>>>>>> develop
        // Localization
        /**
         * @property {String}
         * Text used in ARIA label for collapsible button
         */
        toggleCollapseText: 'toggle collapse',

        collapsedIconClass: 'fa-chevron-right',
        expanedIconClass: 'fa-chevron-down',

        /**
         * @property {Simplate}
         * Simplate that defines the HTML Markup. This override adds the needed styling.
         */
        widgetTemplate: new Simplate(['<div id="{%= $.id %}" title="{%= $.titleText %}" class="overthrow list grouped-list{%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>', '<div data-dojo-attach-point="searchNode"></div>', '{%! $.emptySelectionTemplate %}', '<div class="group-content" data-dojo-attach-point="contentNode"></div>', '{%! $.moreTemplate %}', '{%! $.listActionTemplate %}', '</div>']),
        /**
         * @property {Simplate}
         * Simplate that defines the Group template that includes the header element with collapse button and the row container
         */
<<<<<<< HEAD
        groupTemplate: new Simplate(['<h2 data-action="toggleGroup" class="{% if ($.collapsed) { %}collapsed{% } %}">', '<button class="fa {% if ($.collapsed) { %}{%: $$.collapsedIconClass %} {% } else { %}{%: $$.expanedIconClass %}{% } %}" aria-label="{%: $$.toggleCollapseText %}"></button>{%: $.title %}', '</h2>', '<ul data-group="{%= $.tag %}" class="list-content {%= $.cls %}"></ul>']),
=======
        groupTemplate: new Simplate([
            '<h2 data-action="toggleGroup" class="{% if ($.collapsed) { %}collapsed{% } %}">',
            '<button class="fa {% if ($.collapsed) { %}{%: $$.collapsedIconClass %} {% } else { %}{%: $$.expanedIconClass %}{% } %}" aria-label="{%: $$.toggleCollapseText %}"></button>{%: $.title %}',
            '</h2>',
            '<ul data-group="{%= $.tag %}" class="list-content {%= $.cls %}"></ul>'
        ]),
>>>>>>> develop

        /**
         * @property {Simplate}
         * The template used to render the pager at the bottom of the view.  This template is not directly rendered, but is
         * included in {@link #viewTemplate}.
         *
         * The default template uses the following properties:
         *
         *      name                description
         *      ----------------------------------------------------------------
         *      moreText            The text to display on the more button.
         *
         * The default template exposes the following actions:
         *
         * * more
         */
        moreTemplate: new Simplate(['<div class="list-more" data-dojo-attach-point="moreNode">', '<div class="list-remaining"><span data-dojo-attach-point="remainingContentNode"></span></div>', '<button class="button" data-action="more">', '<span>{%= $.moreText %}</span>', '</button>', '</div>']),
        /**
         * @property {Object}
         * The current group object that is compared to the next entries group object
         * Must have a `tag` property that identifies the group.
         * The `title` property will be placed into the `groupTemplate` for the header text.
         */
        _groupBySections: null,
        _currentGroupBySection: null,
        /**
         * Function that returns a "group object". The group object must have a tag property that is
         * based off the passed entry as it will be used to compare to other entries.
         * The title should also reflect the current entry as it will be used for the header text in the group splitter.
         *
         * An example for a Yellow Page type list:
         *
         * `entryA = {first: 'Henry', last: 'Smith', phone: '123'}`
         * `entryB = {first: 'Mary', last: 'Sue', phone: '345'}`
         *
         *     groupGroupForEntry: function(entry) {
         *         var lastInitial = entry.last.substr(0,1).toUppperCase();
         *         return {
         *             tag: lastInitial,
         *             title: lastInitial
         *         };
         *     }
         *
         * @template
         * @param {Object} entry The current entry being processed.
         * @return {Object} Object that contains a tag and title property where tag will be used in comparisons
         */
<<<<<<< HEAD
        getGroupForEntry: function getGroupForEntry(entry) {
=======
        getGroupForEntry: function(entry) {
>>>>>>> develop
            var sectionDef, title;
            if (this._currentGroupBySection) {
                sectionDef = this._currentGroupBySection.section.getSection(entry);
                if (this._currentGroupBySection.description) {
                    title = this._currentGroupBySection.description + ': ' + sectionDef.title;
                } else {
<<<<<<< HEAD
                    title = sectionDef.title;
=======
                    title =  sectionDef.title;
>>>>>>> develop
                }
                return {
                    tag: sectionDef.key,
                    title: title,
                    collapsed: !!sectionDef.collapsed
                };
            }
            return {
                tag: 1,
                title: 'Default'
            };
        },
        /**
         * Toggles the collapsible state of the clicked group
         * @param {Object} params Object containing the event and other properties
         */
<<<<<<< HEAD
        toggleGroup: function toggleGroup(params) {
=======
        toggleGroup: function(params) {
>>>>>>> develop
            var node = params.$source,
                child;

            if (node) {
                _domClass['default'].toggle(node, 'collapsed');
                child = node.children[0];

                // Child is the button icon indicator for collapsed/expanded
                if (child) {
<<<<<<< HEAD
                    if (_domClass['default'].contains(child, this.expanedIconClass)) {
                        _domClass['default'].replace(child, this.collapsedIconClass, this.expanedIconClass);
                    } else {
                        _domClass['default'].replace(child, this.expanedIconClass, this.collapsedIconClass);
=======
                    if (domClass.contains(child, this.expanedIconClass)) {
                        domClass.replace(child, this.collapsedIconClass, this.expanedIconClass);
                    } else {
                        domClass.replace(child, this.expanedIconClass, this.collapsedIconClass);
>>>>>>> develop
                    }
                }
            }
        },
        /**
         * Overwrites the parent {@link List#processFeed processFeed} to introduce grouping by group tags, see {@link #getGroupForEntry getGroupForEntry}.
         * @param {Object} feed The SData feed result
         * @deprecated Use processData instead
         */
<<<<<<< HEAD
        processFeed: function processFeed(feed) {
            var i, entry, entryGroup, rowNode, remaining, getGroupsNode;
            getGroupsNode = _Utility2['default'].memoize(this.getGroupsNode.bind(this), function (entryGroup) {
=======
        processFeed: function(feed) {
            var i, entry, entryGroup, rowNode, remaining, getGroupsNode;
            getGroupsNode = Utility.memoize(this.getGroupsNode.bind(this), function(entryGroup) {
>>>>>>> develop
                return entryGroup.tag;
            });

            if (!this.feed) {
                this.set('listContent', '');
            }

            this.feed = feed;

            if (this.feed['$totalResults'] === 0) {
                this.set('listContent', this.noDataTemplate.apply(this));
            } else if (feed['$resources']) {
                for (i = 0; i < feed['$resources'].length; i++) {
                    entry = feed['$resources'][i];
                    entryGroup = this.getGroupForEntry(entry);

                    entry['$groupTag'] = entryGroup.tag;
                    entry['$groupTitle'] = entryGroup.title;

                    this.entries[entry.$key] = entry;
                    rowNode = _domConstruct['default'].toDom(this.rowTemplate.apply(entry, this));
                    this.onApplyRowTemplate(entry, rowNode);

<<<<<<< HEAD
                    _domConstruct['default'].place(rowNode, getGroupsNode(entryGroup), 'last');
=======
                    domConstruct.place(rowNode, getGroupsNode(entryGroup), 'last');
>>>>>>> develop
                }
            }

            // todo: add more robust handling when $totalResults does not exist, i.e., hide element completely
            if (typeof this.feed['$totalResults'] !== 'undefined') {
                remaining = this.feed['$totalResults'] - (this.feed['$startIndex'] + this.feed['$itemsPerPage'] - 1);
                this.set('remainingContent', _string['default'].substitute(this.remainingText, [remaining]));
            }

<<<<<<< HEAD
            _domClass['default'].toggle(this.domNode, 'list-has-more', this.hasMoreData());
        },
        processData: function processData(entries) {
            var i,
                entry,
                count = entries.length,
                store = this.get('store'),
                entryGroup,
                rowNode,
                getGroupsNode;
            getGroupsNode = _Utility2['default'].memoize(this.getGroupsNode.bind(this), function (entryGroup) {
=======
            domClass.toggle(this.domNode, 'list-has-more', this.hasMoreData());
        },
        processData: function(entries) {
            var i, entry, count = entries.length, store = this.get('store'), entryGroup, rowNode, getGroupsNode;
            getGroupsNode = Utility.memoize(this.getGroupsNode.bind(this), function(entryGroup) {
>>>>>>> develop
                return entryGroup.tag;
            });

            if (count > 0) {
                for (i = 0; i < count; i++) {
                    entry = this._processEntry(entries[i]);
                    this.entries[store.getIdentity(entry)] = entry;

                    entryGroup = this.getGroupForEntry(entry);

                    entry['$groupTag'] = entryGroup.tag;
                    entry['$groupTitle'] = entryGroup.title;

<<<<<<< HEAD
                    rowNode = _domConstruct['default'].toDom(this.rowTemplate.apply(entry, this));
                    this.onApplyRowTemplate(entry, rowNode);

                    _domConstruct['default'].place(rowNode, getGroupsNode(entryGroup), 'last');
                }
            }
        },
        getGroupsNode: function getGroupsNode(entryGroup) {
            var results = (0, _query['default'])('[data-group="' + entryGroup.tag + '"]', this.contentNode);
=======
                    rowNode = domConstruct.toDom(this.rowTemplate.apply(entry, this));
                    this.onApplyRowTemplate(entry, rowNode);

                    domConstruct.place(rowNode, getGroupsNode(entryGroup), 'last');
                }
            }
        },
        getGroupsNode: function(entryGroup) {
            var results = query('[data-group="' + entryGroup.tag + '"]', this.contentNode);
>>>>>>> develop
            if (results.length > 0) {
                results = results[0];
            } else {
                // Does not exist, lets create it
                results = _domConstruct['default'].toDom(this.groupTemplate.apply(entryGroup, this));
                _domConstruct['default'].place(results, this.contentNode, 'last');
                // re-query what we just place in (which was a doc frag)
                results = (0, _query['default'])('[data-group="' + entryGroup.tag + '"]', this.contentNode)[0];
            }

            return results;
        },
        /**
         * Called on application startup to configure the search widget if present and create the list actions.
         */
<<<<<<< HEAD
        startup: function startup() {
=======
        startup: function() {
>>>>>>> develop
            this.inherited(arguments);
            this._initGroupBySections();

        },
<<<<<<< HEAD
        _initGroupBySections: function _initGroupBySections() {
=======
        _initGroupBySections: function() {
>>>>>>> develop
            this._groupBySections = this.getGroupBySections();
            this.setDefaultGroupBySection();
            this.applyGroupByOrderBy();
        },
<<<<<<< HEAD
        setDefaultGroupBySection: function setDefaultGroupBySection() {
            var count, i;
=======
        setDefaultGroupBySection: function() {
            var count,
                i;
>>>>>>> develop

            count = 0;
            if (this._groupBySections) {
                count = this._groupBySections.length;
                for (i = 0; i < count; i++) {
                    if (this._groupBySections[i].isDefault === true) {
                        this._currentGroupBySection = this._groupBySections[i];
                    }
                }
                if (this._currentGroupBySection === null && count > 0) {
                    this._currentGroupBySection = this._groupBySections[0];
                }
            }
        },
<<<<<<< HEAD
        getGroupBySection: function getGroupBySection(sectionId) {
            var groupSection, i;
=======
        getGroupBySection: function(sectionId) {
            var groupSection,
                i;
>>>>>>> develop

            groupSection = null;
            if (this._groupBySections) {
                for (i = 0; i < this._groupBySections.length; i++) {
                    if (this._groupBySections[i].Id === sectionId) {
                        groupSection = this._groupBySections[i];
                    }
                }
            }
            return groupSection;
        },
<<<<<<< HEAD
        setCurrentGroupBySection: function setCurrentGroupBySection(sectionId) {
            this._currentGroupBySection = this.getGroupBySection(sectionId);
            this.applyGroupByOrderBy(); //need to refresh view
        },
        getGroupBySections: function getGroupBySections() {
            return null;
        },
        applyGroupByOrderBy: function applyGroupByOrderBy() {
=======
        setCurrentGroupBySection: function(sectionId) {
            this._currentGroupBySection = this.getGroupBySection(sectionId);
            this.applyGroupByOrderBy(); //need to refresh view
        },
        getGroupBySections: function() {
            return null;
        },
        applyGroupByOrderBy: function() {
>>>>>>> develop
            if (this._currentGroupBySection) {
                this.queryOrderBy = this._currentGroupBySection.section.getOrderByQuery();
            }
        }
    });

<<<<<<< HEAD
    _lang['default'].setObject('Sage.Platform.Mobile.GroupedList', __class);
    module.exports = __class;
=======
    lang.setObject('Sage.Platform.Mobile.GroupedList', __class);
    return __class;
>>>>>>> develop
});
