/*
 * See copyright file.
 */
import declare = require('dojo/_base/declare');
import lang = require('dojo/_base/lang');
import event = require('dojo/_base/event');
import string = require('dojo/string');
import domClass = require('dojo/dom-class');
import when = require('dojo/when');
import domConstruct = require('dojo/dom-construct');
import query = require('dojo/query');
import array = require('dojo/_base/array');
import SDataStore = require('./Store/SData');
import _RelatedViewWidgetBase = require('./_RelatedViewWidgetBase');

var _widgetTypes,
    __class;

_widgetTypes = {};
__class = declare('argos.RelatedViewManager', null, {
    id: 'relatedViewManager',
    relatedViews: null,
    relatedViewConfig: null,
    widgetTypes: _widgetTypes,
    enabled: true,
    constructor: function(options) {
        this.relatedViews = {};
        lang.mixin(this, options);
        this.registerType('default', _RelatedViewWidgetBase);
    },
    destroyViews: function() {
        for (var relatedViewId in this.relatedViews) {
            if (this.relatedViews.hasOwnProperty(relatedViewId)) {
                this.relatedViews[relatedViewId].destroy();
            }
        }
        this.relatedViews = {};
    },
    registerType: function(widgetTypeName, ctor) {
        this.widgetTypes[widgetTypeName] = ctor;
    },
    getWidgetType: function(widgetTypeName) {
        var widgetType;
        widgetType = this.widgetTypes[widgetTypeName];
        if (!widgetType) {
            widgetType = _RelatedViewWidgetBase;
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
                        this.relatedViewConfig.widgetType = _RelatedViewWidgetBase;
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
export = __class;
