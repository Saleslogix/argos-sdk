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
    SDataStore,
    _Widget,
    _Templated
) {
    return declare('Sage.Platform.Mobile.RelatedViewWidget', [_Widget, _Templated], {
       
        nodataText: 'no records found ...',
        viewMoreDataText: 'see more ... ',
        refreshViewText: 'refresh',
        parentEntry: null,
        relatedEntry: null,
        relateViewNode: null,
        itemsNode: null,
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
        numberOfItems: 1,
        isLoaded: false,
        /**
         * @property {Simplate}
         * Simple that defines the HTML Markup
         */
        widgetTemplate: new Simplate([
            '<div class="related-view-widget-section">',
             '<div class="tab collapsed" data-dojo-attach-event="onclick:toggleView">',
                  '{%: ($.title ) %}',
                  '<button  class="collapsed-indicator" aria-label="{%: $.title %}"></button>',
               '</div>',
               '<div>',
                  '{%! $$.relatedViewHeaderTemplate %}',
                   '<div  data-dojo-attach-point="relatedViewNode"></div>',
                  '{%! $$.relatedViewFooterTemplate %}',
                '<div>',
            '</div>'
        ]),
        nodataTemplate: new Simplate([
           '<div class="related-view-widget-nodata">',
             '<h4> {%: $$.nodataText %}</h4>',
           '</div>'
        ]),
        relatedViewHeaderTemplate: new Simplate([
           '<div class="related-view-widget-header">',
                '<div class="action" data-dojo-attach-event="onclick:onRefreshView">{%: $$.refreshViewText %}</div>',
           '</div>'
        ]),
        relatedViewFooterTemplate: new Simplate([
            '<div class="related-view-widget-footer">',
                '<div>',
                 '<div class="action" data-dojo-attach-event="onclick:onSelectMoreData">{%: $$.viewMoreDataText %}</div>',
               '</div>',
                '<hr />',
            '</div>'
        ]),
        relatedViewRowTemplate: new Simplate([
            '<div class="related-view-widget-row"  data-relatedkey="{%: $.$key %}" data-descriptor="{%: $.$descriptor %}">',
              '<button>',
                '<img src="{%: $$.icon %}" class="icon" />',
               '</button>',
            '<div class="related-view-widget-item">',
            '{%! $$.relatedItemTemplate %}',
            '</div>',
            '</div>'
        ]),
        relatedItemTemplate: new Simplate([
              '<div>{%: $.$descriptor %}</div>'
        ]),
        contructor: function(options) {
            this.inherited(arguments);
            lang.mixin(this, options);
        },
        /**
         * Expands the passed expression if it is a function.
         * @param {String/Function} expression Returns string directly, if function it is called and the result returned.
         * @return {String} String expression.
         */
        expandExpression: function(expression) {
            if (typeof expression === 'function')
                return expression.apply(this, Array.prototype.slice.call(arguments, 1));
            else
                return expression;
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
            var whereExpression = '';
            if (this.hasOwnProperty('where')) {
                if (typeof this.where === 'function') {
                    whereExpression = this.where(this.parentEntry);
                } else {
                    whereExpression = this.where;
                }
            }
            var queryOptions = {
                count: this.numberOfItems || 1,
                start: 0,
                select: this.select || '',
                where: whereExpression,
                sort: this.sort || ''
            };
            return queryOptions;
        },
        fetchData: function() {
            var queryResults;
            queryResults = this.store.query(null, this.queryOptions);
            return queryResults;
        },
        onInit: function(options) {

            this.store = this.store || this.getStore();
            this.queryOptions = this.queryOptions || this.getQueryOptions();

        },
        onLoad: function() {

            if (this.isLoaded) {
                return;
            }
            if (this.parentCollection) {
                this.onApply(this.parentEntry[this.parentCollectionProperty]['$resources']);
            } else {
                relatedResults = this.fetchData();
                (function(context, relatedResults) {

                    try {
                        when(relatedResults, lang.hitch(context, function(relatedFeed) {
                            context.onApply(relatedFeed);
                        }));
                    }
                    catch (error) {
                        console.log('Error fetching related view data:' + error);
                    }
                })(this, relatedResults);
            }
            this.isLoaded = true;
        },
        onApply: function(relatedFeed) {
            var relatedHTML, itemEntry, itemNode, headerNode, footerNode, itemsNode, footerHtml, itemHTML, nodataHTML;
            try {

                if (this.itemsNode) {
                    dojo.destroy(this.itemsNode);
                }

                this.itemsNode = domConstruct.toDom("<div id='itemsNode'><div>");
                domConstruct.place(this.itemsNode, this.relatedViewNode, 'last', this);
                if (relatedFeed.length > 0) {
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
                }
                domConstruct.place(itemsNode, this.relatedViewNode, 'last');
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
        onSelectMoreData: function(evt) {
            var  options, view, whereExpression;

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
        onRefreshView: function(evt) {
            var  i, view, nodes;

            if (this.itemsNode) {
                dojo.destroy(this.itemsNode);
            }
            this.isLoaded = false;
            this.onLoad();

            evt.stopPropagation();
        }
    });
});
