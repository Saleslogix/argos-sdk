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
) {
    return declare('Sage.Platform.Mobile.RelatedViewManager', null, {

        id: 'relatedView',
        relatedViews: null,
        relatedViewConfig: null,
        enabled: true,
        constructor: function(options) {
            this.relatedViews = {};
            lang.mixin(this, options);
        },
        destroyViews: function() {
            for (var relatedViewId in this.relatedViews) {
                this.relatedViews[relatedViewId].destroy();
            }
            this.relatedViews = {};
        },
        addView: function(entry, rowNode) {
            var relatedContentNode,
            relatedViewNode,
            relatedViewWidget,
            relatedResults,
            options;
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
                        this.relatedViews[relatedViewWidget.id] = relatedViewWidget;
                        relatedViewWidget.onInit();
                        relatedViewWidget.placeAt(relatedContentNode[0], 'last');
                    }
                }
            }
            catch (error) {
                console.log('Error adding related view widgets:' + error);

            }
        }
    });
});
