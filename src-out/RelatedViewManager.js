/*
 * See copyright file.
 */
define('argos/RelatedViewManager', [
    'dojo/_base/declare',
    'dojo/_base/lang',
    'dojo/_base/event',
    'dojo/string',
    'dojo/dom-class',
    'dojo/when',
    'dojo/dom-construct',
    'dojo/query',
    'dojo/_base/array',
    './Store/SData',
    './_RelatedViewWidgetBase'
], function (declare, lang, event, string, domClass, when, domConstruct, query, array, SDataStore, RelatedViewWidget) {
    var _widgetTypes, __class;
    _widgetTypes = {};
    __class = declare('argos.RelatedViewManager', null, {
        id: 'relatedViewManager',
        relatedViews: null,
        relatedViewConfig: null,
        widgetTypes: _widgetTypes,
        enabled: true,
        constructor: function (options) {
            this.relatedViews = {};
            lang.mixin(this, options);
            this.registerType('default', RelatedViewWidget);
        },
        destroyViews: function () {
            for (var relatedViewId in this.relatedViews) {
                if (this.relatedViews.hasOwnProperty(relatedViewId)) {
                    this.relatedViews[relatedViewId].destroy();
                }
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
        addView: function (entry, contentNode, owner) {
            var relatedContentNode, relatedViewNode, relatedViewWidget, relatedResults, options;
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
    // Backwards compatibility for custom modules still referencing the old declare global
    lang.setObject('Sage.Platform.Mobile.RelatedViewManager', __class);
    return __class;
});
