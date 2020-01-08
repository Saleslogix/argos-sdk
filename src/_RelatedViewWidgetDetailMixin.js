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

/**
 * @module argos/_RelatedViewWidgetDetailMixin
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import RelatedViewManager from './RelatedViewManager';

/**
 * @class
 * @mixin
 * @alias module:argos/_RelatedViewWidgetDetailMixin
 */
const __class = declare('argos._RelatedViewWidgetDetailMixin', null, /** @lends module:argos/_RelatedViewWidgetDetailMixin.prototype */{
  cls: null,
  /**
   * @property {Simplate}
   * HTML that is used for detail layout items that point to imbeaded related views, displayed related view widget
   *
   * * `$` => detail layout row
   * * `$$` => view instance
   */
  relatedContentViewsTemplate: new Simplate([
    '<li class="related-view-detail-content {%= $.cls %}">',
    '<li id="related-content-views"></li>',
    '</li>',
  ]),
  contextSnapShotTemplate: new Simplate([
    '<h4>{%: $["$descriptor"] %}</h4>',
  ]),
  createRowNode: function createRowNode(layout, sectionNode, entry, template, data) {
    let rowNode;
    if (layout.relatedView) {
      rowNode = $('#related-content-views', sectionNode)[0];
      if (!rowNode) {
        rowNode = $(this.relatedContentViewsTemplate.apply(data, this))[0];
        $(sectionNode).append(rowNode);
      }

      const docfrag = document.createDocumentFragment();
      $(docfrag).append(rowNode);
      this.onProcessRelatedViews(layout.relatedView, rowNode, entry);
      if (docfrag.childNodes.length > 0) {
        $(sectionNode).append(docfrag);
      }
    } else {
      rowNode = this.inherited(createRowNode, arguments);
    }

    return rowNode;
  },
  getRelatedViewId: function getRelatedViewId(relatedView) {
    return `${this.id}_${relatedView.id}`;
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

    let relatedViewManager;
    if (this.relatedViewManagers[relatedView.id]) {
      relatedViewManager = this.relatedViewManagers[relatedView.id];
    } else {
      relatedView.id = this.getRelatedViewId(relatedView);
      const relatedViewOptions = {};
      lang.mixin(relatedViewOptions, relatedView);

      const options = {
        id: relatedView.id,
        relatedViewConfig: relatedViewOptions,
      };
      relatedViewManager = new RelatedViewManager(options);
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
        const relatedViewManager = this.getRelatedViewManager(relatedView);
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
      for (const relatedViewId in this.relatedViewManagers) {
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
  },
  requestData: function requestData() {
    this.destroyRelatedViewWidgets();
    this.inherited(requestData, arguments);
  },
  /**
   * Returns a rendered html snap shot of the entry.
   */
  getContextSnapShot: function getContextSnapShot() {
    const entry = this.entry;
    let snapShot;
    if (entry) {
      snapShot = this.contextSnapShotTemplate.apply(entry, this);
    }
    return snapShot;
  },
});
export default __class;
