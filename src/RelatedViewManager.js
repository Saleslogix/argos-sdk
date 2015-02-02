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
    'Sage/Platform/Mobile/Store/SData',
    'Sage/Platform/Mobile/RelatedViewWidget',
    'Sage/Platform/Mobile/RelatedViewDetailWidget'
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
    SDataStore,
    RelatedViewWidget,
    RelatedViewDetailWidget
) {
    var _widgetTypes = {};
    return declare('Sage.Platform.Mobile.RelatedViewManager', null, {

        id: 'relatedViewManager',
        relatedViews: null,
        relatedViewConfig: null,
        widgetTypes: _widgetTypes,
        enabled: true,
        constructor: function(options) {
            this.relatedViews = {};
            lang.mixin(this, options);
            this.registerType('default',RelatedViewWidget);
            this.registerType('detail', RelatedViewDetailWidget);
        },
        destroyViews: function() {
            for (var relatedViewId in this.relatedViews) {
                this.relatedViews[relatedViewId].destroy();
            }
            this.relatedViews = {};
        },
        registerType: function (widgetTypeName, ctor) {
            this.widgetTypes[widgetTypeName] = ctor;
        },
        getWidgetType: function (widgetTypeName) {
            var widgetType;
            widgetType = this.widgetTypes[widgetTypeName];
            if (!widgetType) {
                widgetType = RelatedViewWidget;
            }
            return widgetType;
        },
        addView: function(entry, contentNode, owner) {
            var relatedContentNode,
            relatedViewNode,
            relatedViewWidget,
            relatedResults,
            options;
            try {
                if (contentNode) {
                    if (this.enabled) {
                        options = {};
                        if (!this.relatedViewConfig.widgetType) {
                            this.relatedViewConfig.widgetType = RelatedViewWidget;
                        }
                        if (typeof this.relatedViewConfig.widgetType === 'string') {
                            this.relatedViewConfig.widgetType = this.getWidgetType(this.relatedViewConfig.widgetType);
                        }
                        lang.mixin(options, this.relatedViewConfig);
                        options.id = this.id + '_' + entry.$key;
                        relatedViewWidget = new this.relatedViewConfig.widgetType(options);
                        relatedViewWidget.parentEntry = entry;
                        relatedViewWidget.parentResourceKind = owner.resourceKind;
                        relatedViewWidget.owner = owner;
                        relatedViewWidget.parentNode = contentNode;
                        this.relatedViews[relatedViewWidget.id] = relatedViewWidget;
                        relatedViewWidget.onInit();
                        relatedViewWidget.placeAt(contentNode, 'last');
                    }
                }
            }
            catch (error) {
                console.log('Error adding related view widgets:' + error);

            }
        }        
    });
});
