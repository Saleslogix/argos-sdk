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


define('Sage/Platform/Mobile/RelatedViewWidget', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/event',
    'dojo/string',
    'dojo/dom-class',
    'dojo/when',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/dom-attr',
    'Sage/Platform/Mobile/Store/SData',
    'dijit/_Widget',
    'Sage/Platform/Mobile/_Templated'
], function(
    declare,
    lang,
    event,
    string,
    domClass,
    when,
    domConstruct,
    query,
    domAttr,
    SDataStore,
    _Widget,
    _Templated
) {
    return declare('Sage.Platform.Mobile.RelatedViewWidget', [_Widget, _Templated], {
       
        cls: null,
        nodataText: 'no records found ...',
        selectMoreDataText: 'see ${0} more of ${1} ... ',
        loadingText: 'loading ... ',
        refreshViewText: 'refresh',
        totalCountText: ' ${0} of ${1}',
        parentEntry: null,
        relatedEntry: null,
        itemsNode: null,
        loadingNode: null,
        id: 'related-view',
        icon: 'content/images/icons/ContactProfile_48x48.png',
        title: 'Related View',
        detailViewId: null,
        listViewId: null,
        listViewWhere: null,
        enabled: null,
        parentCollection: false,
        parentCollectionProperty: null,
        resourceKind: null,
        contractName: null,
        select: null,
        where: null,
        sort: null,
        store: null,
        queryOptions: null,
        isLoaded: false,
        autoLoad: false,
        wait: false,
        startIndex: 1,
        pageSize: 3,
        relatedResults: null,
        itemCount: 0,
        /**
         * @property {Simplate}
         * Simple that defines the HTML Markup
         */
        widgetTemplate: new Simplate([
            '<div class="related-view-widget-section {%: $$.cls %}">',
             '{% if ($.autoLoad) { %}',
                 '<div  id="tab" class="tab" data-dojo-attach-event="onclick:toggleView">',
            '{% } else { %}',
                '<div  id="tab" class="tab collapsed" data-dojo-attach-event="onclick:toggleView">',
            '{% } %}',
                  '<span  data-dojo-attach-point="titleNode" >{%: ($.title ) %}</span>',
                  '<button  class="collapsed-indicator" aria-label="{%: $.title %}"> </button>',
               '</div>',
               '<div>',
                  '{%! $$.relatedViewHeaderTemplate %}',
                   '<div  data-dojo-attach-point="relatedViewNode"></div>',
                  '{%! $$.relatedViewFooterTemplate %}',
                '<div>',
            '</div>'
        ]),
        nodataTemplate: new Simplate([
             '<div class="related-view-widget-nodata"> {%: $$.nodataText %}</div>'
        ]),
        relatedViewHeaderTemplate: new Simplate([
           '<div class="related-view-widget-header">',
                '<div class="action" data-dojo-attach-event="onclick:onRefreshView">{%: $$.refreshViewText %}</div>',
           '</div>'
        ]),
        relatedViewFooterTemplate: new Simplate([
            '<div class="related-view-widget-footer  ">',
                '<div>',
                 '<div  data-dojo-attach-point="selectMoreNode" class="action" data-dojo-attach-event="onclick:onSelectMoreData"></div>',
               '</div>',
                '<hr />',
            '</div>'
        ]),
        relatedViewRowTemplate: new Simplate([
            '<div class="related-view-widget-row {%: $$.cls %}"  data-relatedkey="{%: $.$key %}" data-descriptor="{%: $.$descriptor %}">',
               '<div class="wrapper">',
                   '{%! $$.relatedItemIconTemplate %}',
                   '<div class="related-view-widget-item">',
                      '{%! $$.relatedItemTemplate %}',
                  '</div>',
               '</div>',
            '</div>'
        ]),
        relatedItemIconTemplate: new Simplate([
            '<div>',
            '<button class="header">',
                '<img src="{%: $$.icon %}" class="icon" />',
            '</button>',
            '</div>'
        ]),
        relatedItemTemplate: new Simplate([
              '<div>{%: $.$descriptor %}</div>'
        ]),
        loadingTemplate: new Simplate([
           '<div class="related-view-widget-loading-indicator"><div>{%= $.loadingText %}</div></div>'
        ]),
        contructor: function(options) {
            this.inherited(arguments);
            lang.mixin(this, options);
        },
        getStore: function() {
            var store = new SDataStore({
                service: App.services['crm'],
                resourceKind: this.resourceKind,
                contractName: this.contractName,
                scope: this
            });
            return store;
        },
        getQueryOptions: function() {
            var whereExpression = '', startIndex;
            if (this.hasOwnProperty('where')) {
                if (typeof this.where === 'function') {
                    whereExpression = this.where(this.parentEntry);
                } else {
                    whereExpression = this.where;
                }
            }
            
            var queryOptions = {
                count: this.pageSize || 1,
                start: 0,
                select: this.select || '',
                where: whereExpression,
                sort: this.sort || ''
            };
            
            return queryOptions;
        },
        fetchData: function() {
            var queryResults, startIndex;
            if (this.startIndex < 1) {
                this.startIndex = 1;
            }
            this.queryOptions.start = this.startIndex-1;
            queryResults = this.store.query(null, this.queryOptions);
            this.startIndex = this.startIndex > 0 && this.pageSize > 0 ? this.startIndex + this.pageSize : 1;
            return queryResults;
        },
        onInit: function() {
            var tabNode;
            this.store = this.store || this.getStore();
            this.queryOptions = this.queryOptions || this.getQueryOptions();

            if (this.autoLoad) {
                tabNode = query('> #tab', this.domNode);
                domClass.toggle(tabNode, 'collapsed');
                this.onLoad();
            }
        },
        onLoad: function() {

            if (this.parentCollection) {
                this.onApply(this.parentEntry[this.parentCollectionProperty]['$resources']);
            } else {

                if (!this.loadingNode) {
                    this.loadingNode = domConstruct.toDom(this.loadingTemplate.apply(this));
                    domConstruct.place(this.loadingNode, this.relatedViewNode, 'last', this);
                }
                domClass.toggle(this.loadingNode, 'related-view-widget-loading');
                if (this.wait) {
                    return;
                }
                this.relatedResults = this.fetchData();
                (function(context, relatedResults) {

                    try {
                        when(relatedResults, lang.hitch(context, function(relatedFeed) {
                            this.onApply(relatedFeed);
                        }));
                    }
                    catch (error) {
                        console.log('Error fetching related view data:' + error);
                    }
                })(this, this.relatedResults);
            }
            this.isLoaded = true;
        },
        onApply: function(relatedFeed) {
            var i, relatedHTML, itemEntry, itemNode, headerNode, footerNode, itemsNode, itemHTML, moreData, restCount, moreCount ;
            try {

                if (!this.itemsNode) {
                    this.itemsNode = domConstruct.toDom("<div id='itemsNode'><div>");
                    domConstruct.place(this.itemsNode, this.relatedViewNode, 'last', this);
                }
                if (relatedFeed.length > 0) {
                    this.itemCount = this.itemCount + relatedFeed.length;
                    restCount = this.relatedResults.total - this.itemCount;
                    if (restCount > 0) {
                        moreCount = (restCount >= this.pageSize) ? this.pageSize : restCount;
                        moreData = string.substitute(this.selectMoreDataText, [moreCount, restCount]);
                    } else {
                        moreData = '';
                    }
                    domAttr.set(this.selectMoreNode, { innerHTML: moreData });
                    domAttr.set(this.titleNode, { innerHTML:  this.title +  "  "  +  string.substitute(this.totalCountText, [this.itemCount, this.relatedResults.total]) });
                    for (i = 0; i < relatedFeed.length; i++) {
                        itemEntry = relatedFeed[i];
                        itemEntry['$descriptor'] = itemEntry['$descriptor'] || relatedFeed['$descriptor'];
                        itemHTML = this.relatedViewRowTemplate.apply(itemEntry, this);
                        itemNode = domConstruct.toDom(itemHTML);
                        dojo.connect(itemNode, 'onclick', this, 'onSelectViewRow');
                        domConstruct.place(itemNode, this.itemsNode, 'last', this);
                    }
                    
                } else {
                    domConstruct.place(this.nodataTemplate.apply(this.parentEntry, this), this.itemsNode, 'last');
                    domAttr.set(this.selectMoreNode, { innerHTML: "" });
                }
                domClass.toggle(this.loadingNode, 'related-view-widget-loading');
            }
            catch (error) {
                console.log('Error applying data for related view widget:' + error);
            }

        },
        toggleView: function(evt) {

            if (evt.target) {
                domClass.toggle(evt.target, 'collapsed');
            }
            if (!this.isLoaded) {
                this.onLoad();
            }
            evt.stopPropagation();
        },
        onSelectViewRow: function(evt) {
            var relatedKey, descriptor, options, view;

            relatedKey = evt.currentTarget.attributes['data-relatedkey'].value;
            descriptor = evt.currentTarget.attributes['data-descriptor'].value; 

            options = {
                descriptor: descriptor,
                key: relatedKey,
                title: descriptor
            };

            view = App.getView(this.detailViewId);
            if (view) {
                view.show(options);
            }
            evt.stopPropagation();
        },
        onNavigateToList: function(evt) {
            var options, view, whereExpression;

            if (this.hasOwnProperty('listViewWhere')) {
                if (typeof this.listViewWhere === 'function') {
                    whereExpression = this.listViewWhere(this.parentEntry);
                } else {
                    whereExpression = this.listViewWhere;
                }
            } else {
                if (this.hasOwnProperty('where')) {
                    if (typeof this.where === 'function') {
                        whereExpression = this.where(this.parentEntry);
                    } else {
                        whereExpression = this.where;
                    }
                }
            }

            options = {
                descriptor: this.title,
                where: whereExpression,
                title: this.title
            };

            view = App.getView(this.listViewId);
            if (view) {
                view.show(options);
            }
            evt.stopPropagation();
        },
        onSelectMoreData: function(evt) {
            this.onLoad();
            evt.stopPropagation();
        },
        onRefreshView: function(evt) {
            var view, nodes;

            if (this.itemsNode) {
                dojo.destroy(this.itemsNode);
                this.itemsNode = null;
            }
            this.startIndex = 1;
            this.itemCount = 0;
            this.isLoaded = false;
            this.onLoad();

            evt.stopPropagation();
        }
    });
});
