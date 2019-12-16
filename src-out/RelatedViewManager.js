define('argos/RelatedViewManager', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', './_RelatedViewWidgetBase'], function (module, exports, _declare, _lang, _RelatedViewWidgetBase) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _RelatedViewWidgetBase2 = _interopRequireDefault(_RelatedViewWidgetBase);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  var _widgetTypes = {}; /* Copyright 2017 Infor
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

  var __class = (0, _declare2.default)('argos.RelatedViewManager', null, {
    id: 'relatedViewManager',
    relatedViews: null,
    relatedViewConfig: null,
    widgetTypes: _widgetTypes,
    enabled: true,
    constructor: function constructor(options) {
      this.relatedViews = {};
      _lang2.default.mixin(this, options);
      this.registerType('default', _RelatedViewWidgetBase2.default);
    },
    destroyViews: function destroyViews() {
      for (var relatedViewId in this.relatedViews) {
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
      var widgetType = this.widgetTypes[widgetTypeName];
      if (!widgetType) {
        widgetType = _RelatedViewWidgetBase2.default;
      }
      return widgetType;
    },
    addView: function addView(entry, contentNode, owner) {
      try {
        if (contentNode) {
          if (this.enabled) {
            var options = {};
            if (!this.relatedViewConfig.widgetType) {
              this.relatedViewConfig.widgetType = _RelatedViewWidgetBase2.default;
            }
            if (typeof this.relatedViewConfig.widgetType === 'string') {
              this.relatedViewConfig.widgetType = this.getWidgetType(this.relatedViewConfig.widgetType);
            }
            _lang2.default.mixin(options, this.relatedViewConfig);
            options.id = this.id + '_' + entry.$key;
            var relatedViewWidget = new this.relatedViewConfig.widgetType(options); //eslint-disable-line
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
        console.log('Error adding related view widgets:' + error); //eslint-disable-line
      }
    }
  });

  exports.default = __class;
  module.exports = exports['default'];
});