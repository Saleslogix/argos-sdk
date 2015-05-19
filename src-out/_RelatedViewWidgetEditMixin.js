/*
 * See copyright file.
 */
define('argos/_RelatedViewWidgetEditMixin', [
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/aspect',
    'dojo/dom-construct',
    'dojo/query',
    './RelatedViewManager'
], function (declare, array, lang, aspect, domConstruct, query, RelatedViewManager) {
    var __class = declare('argos._RelatedViewWidgetEditMixin', null, {
        cls: null,
        /**
       * @property {Simplate}
       * HTML that is used for detail layout items that point to imbeaded related views, displayed related view widget
       *
       * * `$` => detail layout row
       * * `$$` => view instance
       */
        relatedContentViewsTemplate: new Simplate([
            '<div id="{%= $.id %}" class="related-view-edit-content {%= $.cls %}"></div>'
        ]),
        createRowContent: function (layout, content) {
            if (layout['relatedView']) {
                content.push(this.relatedContentViewsTemplate.apply(layout['relatedView'], this));
            }
            else {
                this.inherited(arguments);
            }
        },
        processData: function (entry) {
            this.destroyRelatedViewWidgets();
            this.createRelatedViews(this.layout, entry);
            this.inherited(arguments);
        },
        createRelatedViews: function (layout, entry) {
            var node;
            layout.forEach(function (item) {
                if (item['relatedView']) {
                    node = query('#' + item['relatedView'].id, this.contentNode)[0];
                    if (node) {
                        this.onProcessRelatedViews(item['relatedView'], node, entry);
                    }
                }
                if (item.children) {
                    this.createRelatedViews(item.children, entry);
                }
            }.bind(this));
        },
        /**
        * Gets the related view manager for a related view definition.
        * If a manager is not found a new Related View Manager is created and returned.
        * @return {Object} RelatedViewManager
        */
        getRelatedViewManager: function (relatedView) {
            var relatedViewManager, options, relatedViewOptions;
            if (!this.relatedViewManagers) {
                this.relatedViewManagers = {};
            }
            if (this.relatedViewManagers[relatedView.id]) {
                relatedViewManager = this.relatedViewManagers[relatedView.id];
            }
            else {
                //relatedView.id = this.id + '_' + relatedView.id;
                relatedViewOptions = {};
                lang.mixin(relatedViewOptions, relatedView);
                options = {
                    id: relatedView.id,
                    relatedViewConfig: relatedViewOptions
                };
                relatedViewManager = new RelatedViewManager(options);
                this.relatedViewManagers[relatedView.id] = relatedViewManager;
            }
            return relatedViewManager;
        },
        onProcessRelatedViews: function (relatedView, rowNode, entry) {
            var relatedViewManager, i, relatedContentNode;
            try {
                if (typeof relatedView.enabled === 'undefined') {
                    relatedView.enabled = true;
                }
                if (relatedView.enabled) {
                    relatedViewManager = this.getRelatedViewManager(relatedView);
                    if (relatedViewManager) {
                        relatedViewManager.addView(entry, rowNode, this);
                    }
                }
            }
            catch (error) {
                console.log('Error processing related view:' + error);
            }
        },
        /**
         *  Destroys all of the related view widgets, that was added.
         */
        destroyRelatedViewWidgets: function () {
            var relatedViewId;
            if (this.relatedViewManagers) {
                for (relatedViewId in this.relatedViewManagers) {
                    if (this.relatedViewManagers.hasOwnProperty(relatedViewId)) {
                        this.relatedViewManagers[relatedViewId].destroyViews();
                    }
                }
            }
        },
        /**
         * Extends dijit Widget to destroy the search widget before destroying the view.
         */
        destroy: function () {
            this.destroyRelatedViewWidgets();
            this.inherited(arguments);
        }
    });
    return __class;
});
