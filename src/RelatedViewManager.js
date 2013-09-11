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


define('Sage/Platform/Mobile/RelatedViewManager',  [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/event',
    'dojo/string',
    'dojo/dom-class',
    'dojo/when',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/_base/array',
    'Sage/Platform/Mobile/Store/SData'
], function(
    declare,
    lang,
    event,
    string,
    domClass,
    when,
    domConstruct,
    query,
    array,
    SDataStore
) { return declare('Sage.Platform.Mobile.RelatedViewManager', null, {

    id:'relatedView',
    relatedViews: null,
    _batchData: null,
    relatedViewConfig: null,
    enabled: null,
    resourceKind: null,
    contractName: null,
    select: null,
    where: null,
    sort: null,
    store: null,
    queryOptions: null,
    pageSize: 5,
    totalCount:0,
    pageCount:0,
    isLoaded: false,
    autoLoad: false,
    enabled: true,
    queIds: null,

    constructor: function(options) {
        this.relatedViews = {};
        this._batchData = {};
        lang.mixin(this, options);
    },

    destroyViews: function() {
         
        for (var relatedViewId in this.relatedViews) {
            this.relatedViews[relatedViewId].destroy();
        }
        this.relatedViews = {};
        this._batchData = {};
    },
    addView: function(entry, rowNode, batchId) {
        var relatedContentNode,
        relatedViewNode,
        relatedViewWidget,
        relatedResults,
        i,
        options,
        batch;
        relatedContentNode = query('> #list-item-content-related', rowNode);
        try {
            if (relatedContentNode[0]) {
                if (this.enabled) {
                    options = {};
                    lang.mixin(options, this.relatedViewConfig);
                    options.id = this.id + '_' + entry.$key;
                    relatedViewWidget = new this.relatedViewConfig.widgetType(options);
                    relatedViewWidget.parentEntry = entry;
                    relatedViewWidget.parentNode = relatedContentNode[0];
                    relatedViewWidget.autoLoad = true;
                    //relatedViewWidget.wait = false;
                    this.relatedViews[relatedViewWidget.id] = relatedViewWidget;
                    //this.addToBatch(batchId, relatedViewWidget.id, entry.$key);
                    relatedViewWidget.onInit();
                    relatedViewWidget.placeAt(relatedContentNode[0], 'last');
                }
            }
        }
        catch (error) {
            console.log('Error adding related view widgets:' + error );

        }
    },
    addToBatch: function(batchId, relatedViewId, entryKey) {
        var batch, data;
        batch = this._batchData[batchId];
        data = {
            relatedViewId:relatedViewId, 
            entryKey: entryKey
        };
        if (batch) {
            batch.data.push(data);
        }
        else {
            this._batchData[batchId] = { data: [data] };
        }
    },
    processBatch:function(batchId){
        var batch, ids, request, where, service, pageSize;
        batch = this._batchData[batchId];
        ids = [];
        if (batch) {

            array.forEach(batch.data, function(data) {
                ids.push('\'' + data.entryKey + '\'');
            }, this);
            pageSize = this.relatedViewConfig.pageSize * ids.length
            where = this.relatedViewConfig.relatededProperty + " in (" + ids.join(',') + ")";
            store = this.relatedViewConfig.getStore();
            queryOptions = {
                count: pageSize || 1,
                start: 0,
                select: this.relatedViewConfig.select || '',
                where: where,
                sort:  this.relatedViewConfig.relatededProperty +'asc , ' +     this.relatedViewConfig.sort || ''
            };
            queryResults = store.query(null, this.queryOptions);

            relatedResults = this.fetchData();
            (function(context, batch, relatedResults) {

                try {
                    when(relatedResults, lang.hitch(context, function(relatedFeed) {
                        context.onApply(relatedFeed, batch);
                    }));
                }
                catch (error) {
                    console.log('Error fetching related view data:' + error);
                }
            })(this, batch, queryResults);
        }
    },
    onApplyBatch:function (batch, relatedFeed){

        try {
            if (relatedFeed.length > 0) {
                for (i = 0; i < relatedFeed.length; i++) {





                }
            }
        }
        catch (error) {

        }
    },
     getStore: function() {
            var store = new SDataStore({
                service: App.services['crm'],
                resourceKind: this.resourceKind,
                contractName: this.contractName,
                scope: this
            });
            return store;
        }
    });
});
