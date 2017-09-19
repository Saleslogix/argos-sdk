/* Copyright 2017 Infor
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
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
          $(contentNode).append($(relatedViewWidget.domNode));
        }
      }
    } catch (error) {
      console.log('Error adding related view widgets:' + error);//eslint-disable-line
    }
  },
});

export default __class;
