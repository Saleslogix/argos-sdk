/*
 * See copyright file.
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import domConstruct from 'dojo/dom-construct';
import query from 'dojo/query';
import RelatedViewManager from './RelatedViewManager';

const __class = declare('argos._RelatedViewWidgetDetailMixin', null, {
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
    '<div id="related-content-views"></div>',
    '</li>',
  ]),
  contextSnapShotTemplate: new Simplate([
    '<h4>{%: $["$descriptor"] %}</h4>',
  ]),
  createRowNode: function createRowNode(layout, sectionNode, entry, template, data) {
    let rowNode;
    if (layout.relatedView) {
      rowNode = query('#related-content-views', sectionNode)[0];
      if (!rowNode) {
        rowNode = domConstruct.toDom(this.relatedContentViewsTemplate.apply(data, this));
        domConstruct.place(rowNode, sectionNode, 'last');
      }

      const docfrag = document.createDocumentFragment();
      docfrag.appendChild(rowNode);
      this.onProcessRelatedViews(layout.relatedView, rowNode, entry);
      if (docfrag.childNodes.length > 0) {
        domConstruct.place(docfrag, sectionNode, 'last');
      }
    } else {
      rowNode = this.inherited(arguments);
    }

    return rowNode;
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
      relatedView.id = `${this.id}_${relatedView.id}`;
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
    this.inherited(arguments);
  },
  requestData: function requestData() {
    this.destroyRelatedViewWidgets();
    this.inherited(arguments);
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
