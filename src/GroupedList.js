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
 * @class Sage.Platform.Mobile.GroupedList
 * Grouped List provides a hook for grouping rows before rendering them to the page.
 * The grouping adds a container for the set of rows and is collapsible.
 * Note that it constructs the page sequentially meaning the rows should be in the correct
 * order before attempting to group.
 * @extends Sage.Platform.Mobile.List
 * @alternateClassName GroupedList
 */
define('Sage/Platform/Mobile/GroupedList', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/query',
    'dojo/string',
    'dojo/dom-class',
    'dojo/dom-construct',
    'Sage/Platform/Mobile/List',
    'Sage/Platform/Mobile/Utility'
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

    return declare('Sage.Platform.Mobile.GroupedList', [List], {
        // Localization
        /**
         * @property {String}
         * Text used in ARIA label for collapsible button
         */
        toggleCollapseText: 'toggle collapse',

        /**
         * @property {Simplate}
         * Simplate that defines the HTML Markup. This override adds the needed styling.
         */
        widgetTemplate: new Simplate([
            '<div id="{%= $.id %}" title="{%= $.titleText %}" class="overthrow list grouped-list{%= $.cls %}" {% if ($.resourceKind) { %}data-resource-kind="{%= $.resourceKind %}"{% } %}>',
            '<div data-dojo-attach-point="searchNode"></div>',
            '{%! $.emptySelectionTemplate %}',
            '<div class="group-content" data-dojo-attach-point="contentNode"></div>',
            '{%! $.moreTemplate %}',
            '{%! $.listActionTemplate %}',
            '</div>'
        ]),
        /**
         * @property {Simplate}
         * Simplate that defines the Group template that includes the header element with collapse button and the row container
         */
        groupTemplate: new Simplate([
            '<h2 data-action="toggleGroup" class="{% if ($.collapsed) { %}collapsed{% } %}">',
            '{%: $.title %}<button class="collapsed-indicator" aria-label="{%: $$.toggleCollapseText %}"></button>',
            '</h2>',
            '<ul data-group="{%= $.tag %}" class="list-content {%= $.cls %}"></ul>'
        ]),

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
        moreTemplate: new Simplate([
            '<div class="list-more" data-dojo-attach-point="moreNode">',
            '<div class="list-remaining"><span data-dojo-attach-point="remainingContentNode"></span></div>',
            '<button class="button" data-action="more">',
            '<span>{%= $.moreText %}</span>',
            '</button>',
            '</div>'
        ]),
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
        getGroupForEntry: function(entry) {
            var sectionDef, title;
            if (this._currentGroupBySection) {
                sectionDef = this._currentGroupBySection.section.getSection(entry);
                if (this._currentGroupBySection.description) {
                    title = this._currentGroupBySection.description + ': ' + sectionDef.title;
                } else {
                    title =  sectionDef.title;
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
        toggleGroup: function(params) {
            var node = params.$source;
            if (node)
                domClass.toggle(node, 'collapsed');
        },
        /**
         * Overwrites the parent {@link List#processFeed processFeed} to introduce grouping by group tags, see {@link #getGroupForEntry getGroupForEntry}.
         * @param {Object} feed The SData feed result
         */
        processFeed: function(feed) {
            var i, entry, entryGroup, rowNode, remaining, getGroupsNode;
            getGroupsNode = Utility.memoize(lang.hitch(this, this.getGroupsNode), function(entryGroup) {
                return entryGroup.tag;
            });

            if (!this.feed){
                this.set('listContent', '');
            }

            this.feed = feed;

            if (this.feed['$totalResults'] === 0) {
                this.set('listContent', this.noDataTemplate.apply(this));
            } else if (feed['$resources']) {
                for (i = 0; i < feed['$resources'].length; i++) {
                    entry = feed['$resources'][i];
                    entryGroup = this.getGroupForEntry(entry);

                    entry["$groupTag"] = entryGroup.tag;
                    entry["$groupTitle"] = entryGroup.title;

                    this.entries[entry.$key] = entry;
                    rowNode = domConstruct.toDom(this.rowTemplate.apply(entry, this));
                    this.onApplyRowTemplate(entry, rowNode);

                    domConstruct.place(rowNode, getGroupsNode(entryGroup), 'last');
                }
            }

            // todo: add more robust handling when $totalResults does not exist, i.e., hide element completely
            if (typeof this.feed['$totalResults'] !== 'undefined') {
                remaining = this.feed['$totalResults'] - (this.feed['$startIndex'] + this.feed['$itemsPerPage'] - 1);
                this.set('remainingContent', string.substitute(this.remainingText, [remaining]));
            }

            domClass.toggle(this.domNode, 'list-has-more', this.hasMoreData());
        },
        getGroupsNode: function(entryGroup) {
            var results = query('[data-group="' + entryGroup.tag + '"]', this.contentNode);
            if (results.length > 0) {
                results = results[0];
            } else {
                // Does not exist, lets create it
                results = domConstruct.toDom(this.groupTemplate.apply(entryGroup, this));
                domConstruct.place(results, this.contentNode, 'last');
                // re-query what we just place in (which was a doc frag)
                results = query('[data-group="' + entryGroup.tag + '"]', this.contentNode)[0];
            }

            return results;
        },
        /**
         * Called on application startup to configure the search widget if present and create the list actions.
         */
        startup: function() {
            this.inherited(arguments);
            this._initGroupBySections();

        },
        _initGroupBySections:function(){
            this._groupBySections = this.getGroupBySections();
            this.setDefaultGroupBySection();
            this.applyGroupByOrderBy();
        },
        setDefaultGroupBySection: function() {
            var count = 0;
            if (this._groupBySections) {
                count = this._groupBySections.length;
                for (var i = 0; i < count; i++) {
                    if (this._groupBySections[i].isDefault === true) {
                        this._currentGroupBySection = this._groupBySections[i];
                    }
                }
                if ((this._currentGroupBySection === null) && (count > 0)) {
                    this._currentGroupBySection = this._groupBySections[0];
                }
            }
            
        },
        getGroupBySection: function(sectionId) {
            var groupSection = null;
            if (this._groupBySections) {
                for (var i = 0; i < this._groupBySections.length; i++) {
                    if (this._groupBySections[i].Id === sectionId) {
                        groupSection = this._groupBySections[i];
                    }
                }
            }
            return groupSection;
        },
        setCurrentGroupBySection:function(sectionId){
            this._currentGroupBySection = this.getGroupBySection(sectionId);
            this.applyGroupByOrderBy(); //need to refresh view
        },
        getGroupBySections: function() {
            return null;
        },
        applyGroupByOrderBy: function() {
            if (this._currentGroupBySection) {
                this.queryOrderBy = this._currentGroupBySection.section.getOrderByQuery();
            }
        }
        
    });
});
