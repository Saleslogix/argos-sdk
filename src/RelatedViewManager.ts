/*
 * See copyright file.
 */
import * as lang from 'dojo/_base/lang';
import RelatedViewWidget from './_RelatedViewWidgetBase';

const _widgetTypes = {};
export default class RelatedViewManager {
  id = 'relatedViewManager';
  relatedViews = null;
  relatedViewConfig = null;
  widgetTypes = _widgetTypes;
  enabled = true;

  constructor(options) {
    this.relatedViews = {};
    lang.mixin(this, options);
    this.registerType('default', RelatedViewWidget);
  }

  destroyViews() {
    for (const relatedViewId in this.relatedViews) {
      if (this.relatedViews.hasOwnProperty(relatedViewId)) {
        this.relatedViews[relatedViewId].destroy();
      }
    }

    this.relatedViews = {};
  }
  registerType(widgetTypeName, ctor) {
    this.widgetTypes[widgetTypeName] = ctor;
  }
  getWidgetType(widgetTypeName) {
    let widgetType = this.widgetTypes[widgetTypeName];
    if (!widgetType) {
      widgetType = RelatedViewWidget;
    }
    return widgetType;
  }
  addView(entry, contentNode, owner) {
    try {
      if (contentNode) {
        if (this.enabled) {
          const options: any = {};
          if (!this.relatedViewConfig.widgetType) {
            this.relatedViewConfig.widgetType = RelatedViewWidget;
          }
          if (typeof this.relatedViewConfig.widgetType === 'string') {
            this.relatedViewConfig.widgetType = this.getWidgetType(this.relatedViewConfig.widgetType);
          }
          lang.mixin(options, this.relatedViewConfig);
          options.id = `${this.id}_${entry.$key}`;
          const relatedViewWidget = new this.relatedViewConfig.widgetType(options);
          relatedViewWidget.parentEntry = entry;
          relatedViewWidget.parentResourceKind = owner.resourceKind;
          relatedViewWidget.owner = owner;
          relatedViewWidget.parentNode = contentNode;
          this.relatedViews[relatedViewWidget.id] = relatedViewWidget;
          relatedViewWidget.onInit();
          $(contentNode).append($(relatedViewWidget.domNode));
        }
      }
    } catch (error) {
      console.log('Error adding related view widgets:' + error);
    }
  }
}
