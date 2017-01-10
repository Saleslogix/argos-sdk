/*
 * See copyright file.
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import RelatedViewWidget from './_RelatedViewWidgetBase';

const _widgetTypes = {};
const __class = declare('argos.RelatedViewManager', null, {
  id: 'relatedViewManager',
  relatedViews: null,
  relatedViewConfig: null,
  widgetTypes: _widgetTypes,
  enabled: true,
  constructor: function constructor(options) {
    this.relatedViews = {};
    lang.mixin(this, options);
    this.registerType('default', RelatedViewWidget);
  },
  destroyViews: function destroyViews() {
    for (const relatedViewId in this.relatedViews) {
      if (this.relatedViews.hasOwnProperty(relatedViewId)) {
        this.relatedViews[relatedViewId].destroy();
      }
    }

    this.relatedViews = {};
  },
  registerType: function registerType(widgetTypeName, ctor) {
    this.widgetTypes[widgetTypeName] = ctor;
  },
  getWidgetType: function getWidgetType(widgetTypeName) {
    let widgetType = this.widgetTypes[widgetTypeName];
    if (!widgetType) {
      widgetType = RelatedViewWidget;
    }
    return widgetType;
  },
  addView: function addView(entry, contentNode, owner) {
    try {
      if (contentNode) {
        if (this.enabled) {
          const options = {};
          if (!this.relatedViewConfig.widgetType) {
            this.relatedViewConfig.widgetType = RelatedViewWidget;
          }
          if (typeof this.relatedViewConfig.widgetType === 'string') {
            this.relatedViewConfig.widgetType = this.getWidgetType(this.relatedViewConfig.widgetType);
          }
          lang.mixin(options, this.relatedViewConfig);
          options.id = `${this.id}_${entry.$key}`;
          const relatedViewWidget = new this.relatedViewConfig.widgetType(options);//eslint-disable-line
          relatedViewWidget.parentEntry = entry;
          relatedViewWidget.parentResourceKind = owner.resourceKind;
          relatedViewWidget.owner = owner;
          relatedViewWidget.parentNode = contentNode;
          this.relatedViews[relatedViewWidget.id] = relatedViewWidget;
          relatedViewWidget.onInit();
          relatedViewWidget.placeAt(contentNode, 'last');
        }
      }
    } catch (error) {
      console.log('Error adding related view widgets:' + error);//eslint-disable-line
    }
  },
});
// Backwards compatibility for custom modules still referencing the old declare global
lang.setObject('Sage.Platform.Mobile.RelatedViewManager', __class);
export default __class;
