define('argos/_RelatedViewWidgetEditMixin', ['module', 'exports', 'dojo/_base/declare', 'dojo/_base/lang', './RelatedViewManager'], function (module, exports, _declare, _lang, _RelatedViewManager) {
  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  var _declare2 = _interopRequireDefault(_declare);

  var _lang2 = _interopRequireDefault(_lang);

  var _RelatedViewManager2 = _interopRequireDefault(_RelatedViewManager);

  function _interopRequireDefault(obj) {
    return obj && obj.__esModule ? obj : {
      default: obj
    };
  }

  /**
   * @class
   * @mixin
   * @alias module:argos/_RelatedViewWidgetEditMixin
   */
  var __class = (0, _declare2.default)('argos._RelatedViewWidgetEditMixin', null, /** @lends module:argos/_RelatedViewWidgetEditMixin.prototype */{
    cls: null,
    /**
     * @property {Simplate}
     * HTML that is used for detail layout items that point to imbeaded related views, displayed related view widget
     *
     * * `$` => detail layout row
     * * `$$` => view instance
     */
    relatedContentViewsTemplate: new Simplate(['<div id="{%= $.id %}" class="related-view-edit-content {%= $.cls %}"></div>']),
    createRowContent: function createRowContent(layout, content) {
      if (layout.relatedView) {
        content.push(this.relatedContentViewsTemplate.apply(layout.relatedView, this));
      } else {
        this.inherited(createRowContent, arguments);
      }
    },
    processData: function processData(entry) {
      this.destroyRelatedViewWidgets();
      this.createRelatedViews(this.layout, entry);
      this.inherited(processData, arguments);
    },
    createRelatedViews: function createRelatedViews(layout, entry) {
      var _this = this;

      layout.forEach(function (item) {
        if (item.relatedView) {
          var node = $('#' + item.relatedView.id, _this.contentNode)[0];
          if (node) {
            _this.onProcessRelatedViews(item.relatedView, node, entry);
          }
        }
        if (item.children) {
          _this.createRelatedViews(item.children, entry);
        }
      });
    },
    /**
     * Gets the related view manager for a related view definition.
     * If a manager is not found a new Related View Manager is created and returned.
     * @return {Object} RelatedViewManager
     */
    getRelatedViewManager: function getRelatedViewManager(relatedView) {
      if (!this.relatedViewManagers) {
        this.relatedViewManagers = {};
      }

      var relatedViewManager = void 0;

      if (this.relatedViewManagers[relatedView.id]) {
        relatedViewManager = this.relatedViewManagers[relatedView.id];
      } else {
        var relatedViewOptions = {};
        _lang2.default.mixin(relatedViewOptions, relatedView);

        var options = {
          id: relatedView.id,
          relatedViewConfig: relatedViewOptions
        };
        relatedViewManager = new _RelatedViewManager2.default(options);
        this.relatedViewManagers[relatedView.id] = relatedViewManager;
      }
      return relatedViewManager;
    },
    onProcessRelatedViews: function onProcessRelatedViews(relatedView, rowNode, entry) {
      try {
        if (typeof relatedView.enabled === 'undefined') {
          relatedView.enabled = true;
        }

        if (relatedView.enabled) {
          var relatedViewManager = this.getRelatedViewManager(relatedView);
          if (relatedViewManager) {
            relatedViewManager.addView(entry, rowNode, this);
          }
        }
      } catch (error) {
        console.log('Error processing related view:' + error); // eslint-disable-line
      }
    },
    /**
     *  Destroys all of the related view widgets, that was added.
     */
    destroyRelatedViewWidgets: function destroyRelatedViewWidgets() {
      if (this.relatedViewManagers) {
        for (var relatedViewId in this.relatedViewManagers) {
          if (this.relatedViewManagers.hasOwnProperty(relatedViewId)) {
            this.relatedViewManagers[relatedViewId].destroyViews();
          }
        }
      }
    },
    /**
     * Extends dijit Widget to destroy the search widget before destroying the view.
     */
    destroy: function destroy() {
      this.destroyRelatedViewWidgets();
      this.inherited(destroy, arguments);
    }
  }); /* Copyright 2017 Infor
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

  /**
   * @module argos/_RelatedViewWidgetEditMixin
   */
  exports.default = __class;
  module.exports = exports['default'];
});