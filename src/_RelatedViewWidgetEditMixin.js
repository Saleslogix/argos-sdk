/*
 * See copyright file.
 */
import declare from 'dojo/_base/declare';
import lang from 'dojo/_base/lang';
import query from 'dojo/query';
import RelatedViewManager from './RelatedViewManager';

const __class = declare('argos._RelatedViewWidgetEditMixin', null, {
  cls: null,
  /**
   * @property {Simplate}
   * HTML that is used for detail layout items that point to imbeaded related views, displayed related view widget
   *
   * * `$` => detail layout row
   * * `$$` => view instance
   */
  relatedContentViewsTemplate: new Simplate([
    '<div id="{%= $.id %}" class="related-view-edit-content {%= $.cls %}"></div>',
  ]),
  createRowContent: function createRowContent(layout, content) {
    if (layout.relatedView) {
      content.push(this.relatedContentViewsTemplate.apply(layout.relatedView, this));
    } else {
      this.inherited(arguments);
    }
  },
  processData: function processData(entry) {
    this.destroyRelatedViewWidgets();
    this.createRelatedViews(this.layout, entry);
    this.inherited(arguments);
  },
  createRelatedViews: function createRelatedViews(layout, entry) {
    layout.forEach((item) => {
      if (item.relatedView) {
        const node = query('#' + item.relatedView.id, this.contentNode)[0];
        if (node) {
          this.onProcessRelatedViews(item.relatedView, node, entry);
        }
      }
      if (item.children) {
        this.createRelatedViews(item.children, entry);
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

    let relatedViewManager;

    if (this.relatedViewManagers[relatedView.id]) {
      relatedViewManager = this.relatedViewManagers[relatedView.id];
    } else {
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
});
export default __class;
